#  漏洞预警 | cPanel&WHM身份认证绕过漏洞  
浅安
                    浅安  浅安安全   2026-05-12 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-41940  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
cPanel&WHM是全球主流的LinuxWeb托管控制面板。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30Mhx3aWGVZlxWQRQNGo3znKeicA9sPNT7EVqT7G7sH1Xr8YSgZGJ3qe94pEeiacJzaSBtGtNicyEzN6JZ2tDuKMUrGKTbsicKdGibGBzU/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-41940**  
  
**漏洞类型：**  
身份认证绕过  
  
**影响：**  
越权操作  
  
**简述：**  
cPanel&WHM存在身份认证绕过漏洞，由于其登录流程中的会话加载与保存机制存在逻辑缺陷。攻击者通过Basic认证头在密码字段注入CRLF字符，并利用缺少ob部分的会话cookie避免密码编码，从而将恶意键值对写入原始会话文件。随后触发token_denied流程，使系统重新解析该文件并将注入的hasroot=1、user=root等记录提升至JSON缓存，最终绕过密码验证获得管理员权限。  
  
**0x04 影响版本**  
- cPanel&WHM 11.86.* < 11.86.0.41  
  
- cPanel&WHM 11.110.* < 11.110.0.97  
  
- cPanel&WHM 11.118.* < 11.118.0.63  
  
- cPanel&WHM 11.126.* < 11.126.0.54  
  
- cPanel&WHM 11.130.* < 11.130.0.18  
  
- cPanel&WHM 11.132.* < 11.132.0.29  
  
- cPanel&WHM 11.134.* < 11.134.0.20  
  
- cPanel&WHM 11.136.* < 11.136.0.5  
  
- WP Squared 11.136.* < 11.136.1.7  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.cpanel.net/  
  
  
  
