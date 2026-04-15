#  漏洞预警 | LEAN MES系统任意文件上传/删除漏洞  
浅安
                    浅安  浅安安全   2026-04-14 23:50  
  
**0x00 漏洞编号**  
- # 暂无  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
LEAN MES系统是由深圳市深科特信息技术有限公司开发的一款应用系统，主要用于生产调度、产品跟踪、质量控制等车间管理功能。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30MhyOARYlib6ZmYw4nSxRL683JkTJt8uxPJoBcavlnfIowmxQk6Vbj3gfZqr9B1HGChbiat3E5P6Y7ic9r8z4kTWLGOB8q5OZwP1SW4/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**漏洞类型：**  
任意文件上传/删除  
  
**影响：**  
执行任意代码  
  
**简述：**  
LEAN MES系统的  
/Kanban/ChooseImage.aspx接口存在任意文件上传/删除漏洞，攻击者可通过构造恶意请求，绕过文件类型或内容校验，上传恶意文件，实现任意命令执行，或删除系统文件，导致拒绝服务。  
  
**0x04 影响版本**  
- LEAN MES系统  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.sz-skt.com/  
  
  
  
