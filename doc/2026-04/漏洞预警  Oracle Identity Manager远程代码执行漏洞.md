#  漏洞预警 | Oracle Identity Manager远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-16 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-21992  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Oracle Identity Manager是甲骨文公司推出的一款核心的企业级身份治理与管理解决方案，主要用于在企业IT系统中自动化管理用户身份的生命周期。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SVjdb8W7T5YIrddGeQMLUBTXbxfZXlfOKXWTLDDbHJlEslX5e6xKhdokgiccSG2ibPY1uNib5wFzVicEg/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-21992**  
  
**漏洞类型：**  
代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Oracle Identity Manager存在远程代码执行漏洞，在Oracle Identity Manager和Oracle Web Services Manager中，由于系统在远程接口处理过程中缺乏有效的身份认证与输入校验机制，导致未授权攻击者可直接通过网络构造恶意请求触发漏洞。攻击者无需登录即可利用该漏洞执行任意代码，获取系统控制权限，进一步实施横向渗透、数据窃取或服务破坏等攻击行为。  
  
**0x04 影响版本**  
- Oracle Identity Manager 12.2.1.4.0  
  
- Oracle Identity Manager 14.1.2.1.0  
  
- Oracle Web Services Manager 12.2.1.4.0  
  
- Oracle Web Services Manager 14.1.2.1.0  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.oracle.com/cn/  
  
  
  
