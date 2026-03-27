#  漏洞预警 | Langflow远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-03-26 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-33017  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Lаnɡflоԝ是一款用于构建和部署AI驱动的代理和工作流的工具。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SWHPUpZmONDCibcFMW39mQNiaulRXCKTibMciaWtBw1yDKAkx71WnnxR63goPXFQVQMAyTUUu2pIgLQuA/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
###   
  
**CVE-2026-33017**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Langflow的/api/v1/build_public_tmp/{flow_id}/flow端点存在远程代码执行漏洞，无需认证的攻击者可通过构造data参数在流程构建过程中通过exec函数执行任意Python代码，从而实现远程代码执行，造成服务器被完全控制、数据泄露或业务中断等严重后果。  
  
**0x04 影响版本**  
- Langflow <= 1.8.1  
  
**0x05 POC状态**  
- 已公开  
  
****  
**0x06****修复建议**  
  
******目前官方已发布漏洞修复版本，建议用户升级到安全版本****：******  
  
https://github.com/langflow-ai/langflow  
  
  
  
