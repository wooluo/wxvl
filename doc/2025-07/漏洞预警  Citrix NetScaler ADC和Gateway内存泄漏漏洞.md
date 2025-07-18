#  漏洞预警 | Citrix NetScaler ADC和Gateway内存泄漏漏洞  
浅安  浅安安全   2025-07-18 00:01  
  
**0x00 漏洞编号**  
- # CVE-2025-5777  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
思杰系统公司是一家软件和云端运算的科技公司。它的跨国业绩包括提供服务器、软件及桌面虚拟化、网络连结、以及软件即服务等产品。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SXOhrIicAqN0TULjm0J7IN5yNFwN8VlIAgqViayV5oCfl4oEBdfD8iaBTgvqsebYRsDGucYqHsdJiclXw/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp "")  
  
**0x03 漏洞详情**  
###   
  
**CVE-2025-5777**  
  
**漏洞类型：**  
内存泄漏  
  
**影响：**  
获取  
敏感信息  
  
**简述：**  
Citrix NetScaler存在内存泄漏漏洞，攻击者可以通过远程、未经身份验证的方式，读取设备内存中的敏感信息，如会话令牌，从而绕过多因素认证机制并劫持用户会话。  
  
**0x04 影响版本**  
- NetScaler ADC 14.1 < 14.1-43.56  
  
- NetScaler Gateway 14.1 < 14.1-43.56  
  
- NetScaler ADC < 13.1-58.32  
  
- NetScaler Gateway 13.1 < 13.1-58.32  
  
- NetScaler ADC 13.1-FIPS < 13.1-37.235-FIPS  
  
- NetScaler ADC 13.1-FIPS < 13.1-37.235-NDcPP  
  
- NDcPP < 13.1-37.235-FIPS  
  
- NDcPP < 13.1-37.235-NDcPP  
  
- NetScaler ADC 12.1-FIPS < 12.1-55.328-FIPS  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.citrix.com/  
  
  
  
