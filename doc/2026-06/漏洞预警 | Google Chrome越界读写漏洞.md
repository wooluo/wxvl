#  漏洞预警 | Google Chrome越界读写漏洞  
浅安
                    浅安  浅安安全   2026-06-22 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-11645  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Google Chrome V8是一个高效的开源JavaScript引擎，用于Chrome浏览器和Node.js等平台。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/7stTqD182SXxjX8p8WklXuc23v1DKPW7yY83Sic75o0z0rlPgZHmmCPxBNvutPR92HthYPDsg7ia0ODDgsgQYjBQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-11645**  
  
**漏洞类型：越界读写**  
  
**影响：**  
执行任意代码  
  
**简述：**  
Google Chrome存在越界读写漏洞，由于其V8引擎中的越界读写问题，攻击者通过恶意网页触发漏洞，可绕过沙箱防护实现远程代码执行，完全控制用户设备。  
  
**0x04 影响版本**  
- Google Chrome(Windows/Mac) < 149.0.7827.102/.103  
  
- Google Chrome(Linux) < 149.0.7827.102  
  
**0x05 POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
chrome://settings/help  
  
  
  
