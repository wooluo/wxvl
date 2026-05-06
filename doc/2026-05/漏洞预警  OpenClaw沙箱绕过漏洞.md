#  漏洞预警 | OpenClaw沙箱绕过漏洞  
浅安
                    浅安  浅安安全   2026-05-05 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-41329  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
OpenClaw是一款开源的AI智能体平台，能够在本地环境中自主运行，通过自然语言指令直接操作用户计算机完成各类任务，包括文件读写、Shell命令执行、网页浏览以及与邮件、Slack、Jira、GitHub等第三方服务的集成。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30MhziaibUwNdqMp6HAR85mswNFGndtcUTmFkdRBZicdo6ZkPeh0PQ9ZjNeicrxK04wbGP5R2IiaheicHAP2VEPs086DKcibTtBhf982uVFU/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-41329**  
  
**漏洞类型：**  
沙箱绕过  
  
**影响：**  
提升权限  
  
**简述：**  
OpenClaw存在沙箱绕过漏洞，由于其在处理heartbeat上下文继承机制时，对执行上下文及权限边界校验不充分，且senderIsOwner参数可被操控，导致攻击者能够伪造或继承高权限上下文，绕过既有sandbox限制。未获授权的攻击者可通过该漏洞提升执行权限，突破安全隔离边界，进而访问受限功能、执行高危操作或影响系统完整性。  
  
**0x04 影响版本**  
- OpenClaw <= 2026.  
3.28  
  
**0x05****POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://github.com/openclaw/openclaw  
  
  
  
