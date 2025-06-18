#  漏洞预警 | Windows SMB权限提升漏洞  
浅安  浅安安全   2025-06-18 00:00  
  
**0x00 漏洞编号**  
- # CVE-2025-33073  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Windows SMB是一种网络通信协议，用于计算机之间共享资源和文件。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SVleaDeU1ibPickZJzpKIF4Mcm9iaHXXSDJfzdooHoG4ZA4iaHupxCYLp8HtE2qPLEqYibUd5u3E3Nmiczw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
**0x03 漏洞详情**  
  
**CVE-2025-33073**  
  
**漏洞类型：**  
权限提升  
  
**影响：**  
提权  
  
**简述：**  
Windows SMB存在权限提升漏洞，由于访问控制不当，具有普通域用户权限的攻击者可以通过添加恶意的DNS记录并强制域内计算机进行解析来获取域内所有用户的权限，从而达到提权的目的。  
   
  
**0x04 影响版本**  
- Windows Server 2008 R2  
  
- Windows Server 2008  
  
- Windows Server 2016  
  
- Windows 10 Version 1607  
  
- Windows Server 2012 R2  
  
- Windows Server 2012  
  
- Windows 10  
  
- Windows Server 2025  
  
- Windows 11 Version 24H2  
  
- Windows Server 2022, 23H2 Edition  
  
- Windows 11 Version 23H2  
  
- Windows 10 Version 22H2  
  
- Windows 11 Version 22H2  
  
- Windows 10 Version 21H2  
  
- Windows Server 2022  
  
- Windows Server 2019  
  
- Windows 10 Version 1809  
  
**0x05****POC状态**  
- 已公开  
  
****  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://msrc.microsoft.com/update-guide/zh-cn/vulnerability/CVE-2025-33073  
  
  
  
