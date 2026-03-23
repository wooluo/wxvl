#  漏洞预警 | TOTOLINK A7000R命令注入漏洞  
浅安
                    浅安  浅安安全   2026-03-22 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-1623  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
TOTOLINK A7000R是吉翁电子公司的一款无线路由器。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30MhwiaqqUBz8ibsBhckz4Iiamnl3qjxUtB84RYEHAm6pgKzcrq72QuI1OMvRWc5ZzQBu7tALhm4tvt1n1oMMFrC5nnk538PpcCoibbtg/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-1623**  
  
**漏洞类型：**  
命令注入  
  
**影响：**  
执行任意命令  
  
**简述：**  
TOTOLINK A7000R的/cgi-bin/cstecgi.cgi接口存在命令注入漏洞，由于其对该URL的参数FileName未进行检验，攻击者可利用该漏洞实现远程代码执行。  
  
**0x04 影响版本**  
- TOTOLINK A7000R 4.1cu.4154  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.totolink.net/  
  
  
  
