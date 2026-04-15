#  漏洞预警 | OpenAM远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-14 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-33439  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
OpenIdentityPlatform OpenAM是一款开源的企业级访问管理解决方案，提供统一的身份认证、授权管理、单点登录以及联合身份管理功能。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30Mhyb4NZjExnabgXw3QXnX2YnVDmDZEgJXocxUTPasUDLwaP3PD9ZKkNTS2acB0fiae5jDfoPTfDj0Ra5Xhr6aicj6TicnTUhglnicv4/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-33439**  
  
**漏洞类型：**  
代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
OpenAM存在远程代码执行漏洞，由于其在修复历史漏洞时，仅对部分参数应用了白名单过滤机制，而忽略了框架中其他反序列化入口点，导致用户可控的序列化数据被直接反序列化，进而执行任意代码。  
  
**0x04 影响版本**  
- OpenAM <= 16.0.5  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://github.com/OpenIdentityPlatform/OpenAM  
  
  
  
