#  漏洞预警 | Adobe Acrobat Reader远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-27 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-34621  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Adobe Acrobat是Adobe Inc.开发的一系列应用软件和Web服务，用于查看、创建、操作、打印和管理便携式文档格式(PDF)文件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhxwQSeiayvsZbeK1PvsqvBMQHZVyl7ry291ibrRpk7mBRqGEp95llLbDInSd0TnHvCTbXRERUojspxUxiaiaECqmL2R7XpSDMTkFUY/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-34621**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Adobe Acrobat Reader存在远程代码执行漏洞，由于其JavaScript引擎未能正确控制对象原型属性的修改，攻击者可以利用该漏洞制作恶意的PDF文件，诱导受害者打开特制的文件，在当前用户的上下文中执行任意代码。  
  
**0x04 影响版本**  
- Acrobat DC <= 26.001.21367  
  
- Acrobat Reader DC <= 26.001.21367  
  
- Acrobat 2024 <= 24.001.30356  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.adobe.com/  
  
  
  
