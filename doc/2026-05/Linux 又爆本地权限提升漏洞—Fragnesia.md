#  Linux 又爆本地权限提升漏洞—Fragnesia  
原创 Esn Arsenal
                    Esn Arsenal  Esn技术社区   2026-05-14 22:13  
  
适用于Linux系统的通用漏洞利用工具。  
  
它属于Dirty Frag类型的漏洞（攻击面相同），但仍属于独立的漏洞类别 !  
  
是啊，又来了。 )))  
  
*  
  
[#漏洞利用]()  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icfnkibn16VeiaoLKoSAm7t4CWVWBichIE6gaX6m54KHphTNTA4mbkF5L4msHxRFzxGoM7jDvHG6CBlb22gydbTv38h6wkDHqsvwYG3Do1rbPB0/640?wx_fmt=png&from=appmsg "")  
  
  
  
Fragnesia 是一个通用的 Linux 本地权限提升漏洞，由William Bowling和V12 团队使用V12 版本发现。Fragnesia 属于Dirty Frag漏洞类别。它与Dirty Frag 是 ESP/XFRM 中的一个独立漏洞，后者已发布单独的补丁。然而，它们处于同一攻击面，缓解措施也与 Dirty Frag 相同。  
  
  
  
  
  
利用 Linux XFRM ESP-in-TCP 子系统中的逻辑漏洞，实现对只读文件的内核页面缓存进行任意字节写入，而无需任何竞争条件。  
  
该技术扩展了包含脏管道漏洞在内的页面缓存写入漏洞类：当 TCP 套接字espintcp在数据已从文件剪切到接收队列后切换到 ULP 模式时，内核会将排队的文件页作为 ESP 密文处理。计数器块位置 2、字节 0 处的 AES-GCM 密钥流字节会直接与缓存的文件页进行异或运算。通过选择 IV nonce 来生成所需的密钥流字节，可以将文件中的任何目标字节设置为任何值——每次触发调用对应一个字节。  
  
该漏洞利用程序构建了一个包含 256 个条目的查找表，将每个可能的密钥流字节映射到其对应的 nonce 值，然后遍历有效载荷，对每个需要修改的字节触发 splice/ULP 竞争条件。它会在页面缓存的/bin/sh前 192 个字节上写入一个小的位置无关 ELF 存根（setresuid/setresgid/execve） ，然后调用函数获取 root shell。页面缓存的修改不会回滚到磁盘；磁盘上的二进制文件保持不变。/usr/bin/suexecve("/usr/bin/su")  
## 受影响版本  
  
受 dirtyfrag 影响的所有版本都会受到影响。  
  
任何没有此补丁的版本：https://lists.openwall.net/netdev/2026/05/13/79，即 2026 年 5 月 13 日之前的 Linux 内核。  
  
Linux localhost 6.8.0-111-generic #111-Ubuntu SMP PREEMPT_DYNAMIC Sat Apr 11 23:16:02 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux已确认可在（从 Linode 购买的 VPS）上运行。  
```
地址：https://github.com/v12-security/pocs/tree/main/fragnesia
```  
  
  
  
