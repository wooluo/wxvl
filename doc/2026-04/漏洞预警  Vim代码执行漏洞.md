#  漏洞预警 | Vim代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-06 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-34714  
  
- # CVE-2026-34982  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Vim是一款强大的文本编辑器，广泛用于程序开发和系统管理。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30MhyU3zicWkCZRZjia5Ku0N6TibXOWnxFGkgUVzEmLoooUopyfc3ONwj5Cu4smg6lbcyUwEZ7lkdJVIMnc9fbt2JEXNNNu6iaz8ibUVVY/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-34714**  
  
**漏洞类型：**  
代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Vim存在代码执行漏洞，由于其tabpanel选项缺少P_MLE安全标志，导致tabline脚本中的表达式可被用于注册任意命令。攻击者可以通过诱导用户打开特制文件，执行任意代码，从而导致获取系统控制权，可能导致数据泄露、系统破坏等严重后果。  
  
**CVE-2026-34982**  
  
**漏洞类型：**  
代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Vim存在代码执行漏洞，由于complete、guitabtooltip和printheader三个选项缺少P_MLE安全标志，导致脚本中的表达式可被用于注册任意命令。攻击者可以通过诱导用户打开特制文件，执行任意代码，从而导致获取系统控制权。  
  
**0x04 影响版本**  
  
CVE-2026-34714  
- 9.1.1391 <= Vim < 9.2.0272  
  
CVE-2026-34982  
- 9.1.1178 <= Vim < 9.2.0276  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.vim.org/  
  
  
  
