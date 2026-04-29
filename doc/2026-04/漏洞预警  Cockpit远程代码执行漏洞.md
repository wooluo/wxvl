#  漏洞预警 | Cockpit远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-28 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-4631  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Cockpit是一款面向GNU/Linux服务器的Web化管理工具。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhxR7QHz2G8evmSFTicnibE8fPLNDmibuJDqfMObzvp3j5aRq5821vhHb7icz2ib95kYKsVNXc4fBHoovDvZB8kCeQOibNKTDLOtu36Oo/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-4631**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Cockpit存在远程代码执行漏洞，由于远程登录模块将Web端传入的用户名、主机名未经校验直接拼接为SSH命令行参数，且未使用--分隔符隔离选项与目标参数。攻击者无需身份凭证，仅构造恶意HTTP请求即可触发SSH参数注入，在目标服务器上以服务权限执行任意系统命令，从而完全控制服务器。  
  
**0x04 影响版本**  
- 326 <= Cockpit < 360  
   
  
**0x05****POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://cockpit-project.org/  
  
  
  
