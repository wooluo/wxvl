#  漏洞预警 | macOS本地提权漏洞  
浅安
                    浅安  浅安安全   2026-09-28 23:50  
  
**0x00 漏洞编号**  
- # CVE-2025-43786  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
macOS是Apple的闭源桌面操作系统，CoreServices是其中提供启动服务与系统资源访问等能力的系统框架。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SWCxaKPT9g3A3f5WkaQIRmKnKH1tyvQGYjF4851SygGibjqq6UianpJAyxQcbwr4n6iaTcfETecD5mNA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2025-43786**  
  
**漏洞类型：**  
本地提权  
  
**影响：**  
执行任意代码  
  
**简述：**  
macOS存在本地提权漏洞，由于其CoreServices组件中缺少entitlement检查，拥有本地低权限账号的攻击者可编写无需任何特殊签名或授权的普通应用，调用本应受限的特权接口，以root身份执行任意代码。  
  
**0x04 影响版本**  
- macOS Sequoia < 15.8  
  
- macOS Tahoe < 26.7  
  
- macOS Golden Gate < 27  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.apple.com.cn/  
  
  
  
