#  漏洞预警 | Apache HTTP Server双重释放漏洞  
浅安
                    浅安  浅安安全   2026-05-18 23:50  
  
**0x00 漏洞编号**  
- CVE-2  
026-23918  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Apache HTTP Server是Apache软件基金会的一个开放源代码的网页服务器，由于其具有跨平台性和安全性，被广泛使用，它是最流行的Web服务器端软件之一。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30Mhy51ib4eXH5AiaQjn3ibxNckMnGISaWRdwJib6aKpVaNhHmSu1dPsibDJdqrqibzXthoDibVGiczLPNhqPbfUV7gVQAIkQibZeZ1U4oPwpI/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-23918**  
  
**漏洞类型：**  
双重释放  
  
**影响：**  
内存破坏  
  
**简述：**  
Apache HTTP Server mod_http2模块存在双重释放漏洞，由于服务器在处理HTTP/2连接早期重置请求时，对内存资源释放逻辑存在缺陷，导致同一内存对象被重复释放，进而可能引发内存破坏。攻击者可通过构造恶意HTTP/2请求触发异常内存操作，造成服务崩溃，并在特定条件下进一步实现远程代码执行。  
  
**0x04 影响版本**  
- Apache HTTP Server 2.4.66  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
******目前官方已发布漏洞修复版本，建议用户升级到安全版本****：******  
  
https://httpd.apache.org/  
  
  
  
