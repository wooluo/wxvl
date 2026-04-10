#  漏洞预警 | Vite任意文件读取漏洞  
浅安
                    浅安  浅安安全   2026-04-09 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-39363  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Vite是一个现代化的前端构建工具，旨在提供更快的开发体验。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SW9tr2La24Zpwljl38LqYvRpNLGxEndYaic5QRRTuCvtTKHB2cRM1ZyqPOwZSQWNKC1QnHeoBfdCRQ/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-39363**  
  
**漏洞类型：**  
任意文件读取  
  
**影响：**  
敏感  
信息泄露  
  
**简述：**  
Vite  
存在任意文件读取漏洞，  
其WebSocket中的fetchModule方法未实施server.fs访问控制，导致攻击者可通过WebSocket连接并读取服务器上的任意文件。  
  
**0x04 影响版本**  
- 8.0.0 <= Vite <= 8.0.4  
  
- 7.0.0 <= Vite <= 7.3.1  
  
- 6.0.0 <= Vite <= 6.4.1  
  
- Vite <= 0.1.15  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://vite.dev/  
  
  
  
