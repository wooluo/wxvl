#  漏洞预警 | OpenPrinting CUPS远程代码执行和认证绕过漏洞  
浅安
                    浅安  浅安安全   2026-04-22 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-34980  
  
- # CVE-2026-34990  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
OpenPrinting CUPS是一款开源的打印系统，广泛应用于Linux及其他类Unix操作系统中。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30Mhwc7ej5Mh3AMKF4Bjz3snCODsia7k5EvxfzQgafhCsicaGXfTZ9MlZObTPXSudJrkjHDn1KbuIkvpdPZID0MfNAaN2z32Tib0oxSg/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-34980**  
  
**漏洞类型：**  
代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
OpenPrinting CUPS存在远程代码执行漏洞，由于其在处理打印任务属性时存在输入验证缺陷，系统在序列化和反序列化打印选项过程中，未能正确处理特殊字符的转义逻辑，导致攻击者可以通过构造特定的打印请求，将恶意数据注入到队列配置中。  
  
**CVE-2026-34990**  
  
**漏洞类型：**  
认证绕过  
  
**影响：**  
越权操作  
  
**简述：**  
OpenPrinting CUPS存在认证绕过漏洞，由于其在处理本地打印机创建和认证令牌管理时存在逻辑缺陷，系统在创建临时打印机和验证设备URI时，未能正确验证打印机属性的变更请求，导致攻击者可以捕获管理令牌并绕过文件设备安全策略创建并覆盖任意文件。  
  
**0x04 影响版本**  
- CUPS <= 2.4.16  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://github.com/OpenPrinting/cups  
  
  
  
