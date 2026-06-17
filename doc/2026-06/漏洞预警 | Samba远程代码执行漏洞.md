#  漏洞预警 | Samba远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-06-16 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-4480  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Samba是一个开源的软件套件，主要用于在Unix和Linux系统与Windows系统之间共享文件和打印资源。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SXXFenB7mkkecqxsj1xmdrVe9lxQQCgJ8KS13prPicRiaSMStEga8ZYPE9jANofibfFNUcBaibOJES1Uw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-4480**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行  
任意命令  
  
**简述：**  
S  
amba存在远程代码执行漏洞，由于其打印子系统在处理客户端提交的打印任务时，将客户端可控的作业描述字符串通过%J替换字符传递给print command配置项所指定的命令，但未对字符串中的Shell元字符进行转义处理。攻击者可以利用该漏洞，通过构造包含未转义Shell元字符的特殊打印作业描述，在服务器上执行任意操作系统命令，从而完全控制受影响的服务器。  
  
**0x04 影响版本**  
- 4.1.0 <= Samba < 4.22.10  
  
- 4.23.0 <= Samba < 4.23.8  
  
- 4.24.0 <= Samba < 4.24.3  
  
**0x05****POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.samba.org/  
  
  
  
