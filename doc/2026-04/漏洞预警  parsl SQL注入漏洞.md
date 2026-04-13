#  漏洞预警 | parsl SQL注入漏洞  
浅安
                    浅安  浅安安全   2026-04-12 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-21892  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
parsl是Parallel Scripting Library开源的一个Python的并行脚本库。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhxuEEbTfiabMtMJF9dfJHFbzic8Mgw503icI0NnAZaUzcyOKLHuWDwoX0gU2nz9ibPWrq4f6y8ibxlACv0LqxonGZhTof0RDUmne4ibE/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-21892**  
  
**漏洞类型：**  
SQL注入  
  
**影响：**  
获取敏感信息  
  
**简述：**  
parsl存在SQL注入漏洞，由于parsl-visualize组件参数过滤不严格，  
攻击者可利用该漏洞实现未授权数据库操作。  
  
**0x04 影响版本**  
- parsl < 2026.01.05  
  
**0x05****POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://github.com/Parsl/parsl  
  
  
  
