#  漏洞预警 | Windows截图工具信息泄露漏洞  
浅安
                    浅安  浅安安全   2026-04-26 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-33829  
  
**0x01 危险等级**  
- 中危  
  
**0x02 漏洞概述**  
  
Windows Snipping Tool是微软官方内置的轻量级截图编辑工具。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SVleaDeU1ibPickZJzpKIF4Mcm9iaHXXSDJfzdooHoG4ZA4iaHupxCYLp8HtE2qPLEqYibUd5u3E3Nmiczw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-33829**  
  
**漏洞类型：**  
信息泄露  
  
**影响：**  
窃取凭据  
  
**简述：**  
Windows截图工具存在信息泄露漏洞，由于其对ms-screensketch协议的filePath参数缺乏严格输入校验，攻击者可构造恶意SMB远程路径，诱使工具发起跨网络身份认证。攻击者通过构造恶意链接，触发工具自动连接受控SMB服务器，窃取当前用户的Net-NTLM哈希，导致用户身份凭据泄露。  
  
**0x04 影响版本**  
- Windows Server 2012 R2 (Server Core installation) < 6.3.9600.23132  
  
- Windows Server 2012 R2 < 6.3.9600.23132  
  
- Windows Server 2012 (Server Core installation) < 6.2.9200.26026  
  
- Windows Server 2012 < 6.2.9200.26026  
  
- Windows Server 2016 (Server Core installation) < 10.0.14393.9060  
  
- Windows Server 2016 < 10.0.14393.9060  
  
- Windows 10 Version 1607 for x64-based Systems < 10.0.14393.9060  
  
- Windows 10 Version 22H2 for 32-bit Systems < 10.0.19045.7184  
  
- Windows 10 Version 22H2 for ARM64-based Systems < 10.0.19045.7184  
  
- Windows 10 Version 22H2 for x64-based Systems < 10.0.19045.7184  
  
- Windows 10 Version 21H2 for x64-based Systems < 10.0.19044.7184  
  
- Windows 10 Version 21H2 for ARM64-based Systems < 10.0.19044.7184  
  
- Windows 10 Version 21H2 for 32-bit Systems < 10.0.19044.7184  
  
- Windows Server 2022 (Server Core installation) < 10.0.20348.5020  
  
- Windows Server 2022 < 10.0.20348.5020  
  
- Windows 10 Version 1607 for 32-bit Systems < 10.0.14393.9060  
  
- Windows 11 Version 26H1 for ARM64-based Systems < 10.0.28000.1836  
  
- Windows 11 version 26H1 for x64-based Systems < 10.0.28000.1836  
  
- Windows Server 2025 < 10.0.26100.32690  
  
- Windows 11 Version 24H2 for x64-based Systems < 10.0.26100.8246  
  
- Windows 11 Version 24H2 for ARM64-based Systems < 10.0.26100.8246  
  
- Windows Server 2022, 23H2 Edition (Server Core installation) < 10.0.25398.2274  
  
- Windows 11 Version 23H2 for x64-based Systems < 10.0.22631.6936  
  
- Windows 11 Version 23H2 for ARM64-based Systems < 10.0.22631.6936  
  
- Windows 11 Version 25H2 for x64-based Systems < 10.0.26200.8246  
  
- Windows 11 Version 25H2 for ARM systems < 10.0.26200.8246  
  
- Windows Server 2025 (Server Core installation) < 10.0.26100.32690  
  
- Windows Server 2019 (Server Core installation) < 10.0.17763.8644  
  
- Windows Server 2019 < 10.0.17763.8644  
  
- Windows 10 Version 1809 for x64-based Systems < 10.0.17763.8644  
  
- Windows 10 Version 1809 for 32-bit Systems < 10.0.17763.8644  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://msrc.microsoft.com/update-guide/zh-cn/vulnerability/  
CVE-2026-33829  
  
  
  
