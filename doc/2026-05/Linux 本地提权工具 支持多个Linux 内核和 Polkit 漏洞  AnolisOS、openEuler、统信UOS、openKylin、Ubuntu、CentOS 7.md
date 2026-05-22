#  Linux 本地提权工具 支持多个Linux 内核和 Polkit 漏洞 | AnolisOS、openEuler、统信UOS、openKylin、Ubuntu、CentOS 7  
RoadBicycle-C
                    RoadBicycle-C  无影安全实验室   2026-05-22 12:40  
  
免责声明：  
本篇文章仅用于技术交流，  
请勿利用文章内的相关技术从事非法测试  
，  
由于传播、利用本公众号无影安全  
实验室所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号无影安全实验室及作者不为此承担任何责任，一旦造成后果请自行承担！  
如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
所有工具安全性自测！！！  
**VX：smile62157**  
  
  
朋友们现在只对常读和星标的公众号才展示大图推送，建议大家把"**无影安全实验室**  
"设为星标，这样更新文章也能第一时间推送！  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3GHDOauYyUGbiaHXGx1ib5UxkKzSNtpMzY5tbbGdibG7icBSxlH783x1YTF0icAv8MWrmanB4u5qjyKfmYo1dDf7YbA/640?&wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
  
安全工具  
  
  
  
## 0x01 工具介绍  
  
RootHawk 是一个**用于授权安全测试**  
的 Linux 本地提权工具。它整合了多个已公开的 Linux 内核和 Polkit 漏洞，目的是在**可控环境**  
（虚拟机、实验环境、授权目标机器）中验证系统是否存在提权风险。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Nuuibh3bDOw7Ydw359UaN5RWNvBGYL8s6zpklolyo5q6u4P8p6axdXicibibEdfd25dZGuic2xecMDNuUy9qs4TcneYN2UMgZpwh45qkbI24s2I4/640?wx_fmt=png&from=appmsg "")  
  
## 0x02 支持的主要漏洞（CVE）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Nuuibh3bDOw7bO7gMAhfKMfdMaAu7SM5lcuZMNtPAX8zURZibHbtvqxcDW12Jicj681wNO0P4RAG7RKcg5SpDvR8DZCZMRdx72Kficg5jE27VWI/640?wx_fmt=png&from=appmsg "")  
  
  
工具采用**模块化设计**  
，每个 CVE 都有独立实现，可以单独运行或一次性尝试所有模块。## 0x03 主要功能特点  
- 支持命令行参数快速调用特定 CVE（-e CVE-XXXX-XXXX  
）  
  
- 支持一键运行所有可用漏洞（-any  
）  
  
- 可列出所有可用模块（-list  
）  
  
- 支持自定义参数（如 pkexec 路径、备份 su、后渗透执行命令等）  
  
- 提供详细日志输出（-v  
）  
  
- 预编译二进制文件（支持 amd64、arm64、386 架构）  
  
- 已在多个国产系统上测试通过：  
  
- AnolisOS  
  
- openEuler  
  
- 统信 UOS（统信桌面操作系统）  
  
- openKylin（开放麒麟）  
  
- Ubuntu、CentOS 7 等  
  
## 0x04 工具测试  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Nuuibh3bDOw7QicrMnFnAdMs7BqxgNOiawg4RdiciafclYCsWfTbUK8QQrj2VplBaBqcM2WO58qgEnqMictWibGn9IQnfcXJfoF4Ja3kOEAM7U60icU/640?wx_fmt=png&from=appmsg "")  
  
信创系统  
openEuler  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Nuuibh3bDOw7Ydw359UaN5RWNvBGYL8s6zpklolyo5q6u4P8p6axdXicibibEdfd25dZGuic2xecMDNuUy9qs4TcneYN2UMgZpwh45qkbI24s2I4/640?wx_fmt=png&from=appmsg "")  
  
DirtyFrag  
```
./RootHawk-amd64 -e CVE-2026-43284
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Nuuibh3bDOw6qgRc8xJEjrCaMKwsdSkPIBAQzojbYArRFvPoibC5vB7NgTWwC4Odibu5Dr8eWVJF2TYLymSa78g7Awful5gVjyibLMicp7BntS1w/640?wx_fmt=png&from=appmsg "")  
  
CopyFai  
```
./RootHawk-amd64 -e CVE-2026-31431
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Nuuibh3bDOw7ap25VyibmW3XWkCiadsHibaJr6ScbwqW3mXnu0a7aXg0Ops3ArWXFQicaoCPiaRYKbibhlOQRchyHJQQrg42pLQSj0UcF1ptpdBNWw/640?wx_fmt=png&from=appmsg "")  
# CVE-2021-4034  
  
```
./RootHawk-amd64 -e CVE-2026-4034
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Nuuibh3bDOw6fealAUaaBk8YmIhVeuDOQyH9LAbod0ibibSPDWHTaMJicURp8q1ft1xFUiaRYJBfWGH15uiarLJey05icmtOXQenl7csIrfPF8gsmQ/640?wx_fmt=png&from=appmsg "")  
## 0x05 工具使用  
### 已编译版本  
```
bin/RootHawk-amd64bin/RootHawk-arm64bin/RootHawk-386
```  
  
Ubuntu amd64 虚拟机使用：  
```
chmod +x RootHawk-amd64./RootHawk-amd64 -help
```  
  
查看帮助：  
```
./RootHawk-amd64 -help
```  
  
查看模块列表：  
```
./RootHawk-amd64 -list
```  
  
执行指定 CVE：  
```
./RootHawk-amd64 -e CVE-2022-0847
```  
  
按顺序执行全部模块：  
```
./RootHawk-amd64 -any
```  
### 参数说明  
```
-list              显示当前集成的 CVE 模块-e <名称>          执行指定 CVE 或别名-any               按列表顺序执行全部模块-pk <路径>         指定 CVE-2021-4034 使用的 pkexec 路径，默认 /usr/bin/pkexec-backup <路径>     CVE-2026-31431 执行前备份 su 到指定路径-exec <路径>       CVE-2026-31431 提权后执行指定程序，而不是进入 su-v                 尽量输出详细日志-help              显示帮助
```  
### 示例  
```
./RootHawk-amd64 -list./RootHawk-amd64 -e CVE-2021-4034./RootHawk-amd64 -e CVE-2021-4034 -pk /usr/bin/pkexec./RootHawk-amd64 -e CVE-2026-31431 -backup /tmp/su.bak./RootHawk-amd64 -e CVE-2026-31431 -backup /tmp/su.bak -exec /tmp/root-task./RootHawk-amd64 -e CVE-2026-43284 -v./RootHawk-amd64 -any
```  
  
## 0x06 工具下载  
  
**点****击关注**  
**下方名片****进入公众号**  
  
**回复关键字【260522****】获取**  
**下载链接**  
  
  
  
最后推荐一下内部  
小  
密圈，干货满满，物超所值，**内部圈子每增加100人，价格将上涨20元，越早进越优惠！！！**  
  
****  
