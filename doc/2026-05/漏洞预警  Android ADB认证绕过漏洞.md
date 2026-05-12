#  漏洞预警 | Android ADB认证绕过漏洞  
浅安
                    浅安  浅安安全   2026-05-12 00:04  
  
**0x00 漏洞编号**  
- # CVE-2026-0073  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Android是Google推出的移动操作系统，广泛应用于智能手机、平板及嵌入式设备，提供应用程序管理、硬件驱动、系统安全和网络通信功能，支持wireless ADB调试及远程管理。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/NQlfTO30MhwkmDzF5CYibicKWicpIh8F0ZScMExicy9g7icTLboQUmPibzExCe5VgpIu3arQPicWTEiaaCOXgXuIvRvdz8iaDoz6EtzE1F7T5p78A048/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-0073**  
  
**漏洞类型：**  
认证绕过  
  
**影响：**  
越权操作  
  
**简述：**  
Android ADB存在认证绕过漏洞，在platform/packages/modules/adb/daemon/auth.cpp文件中，由于adbd_tls_verify_cert使用EVP_PKEY_cmp验证客户端证书公钥时忽略跨算法比较返回值，导致攻击者可在无需用户交互情况下绕过身份验证，通过提供非RSA TLS客户端证书成为授权ADB host并获取shell用户权限，从而远程访问系统调试接口，执行读取敏感信息、执行命令、修改配置等操作。  
  
**0x04 影响版本**  
- Android 14 < 2026-05-01安全补丁  
  
- Android 15 < 2026-05-01安全补丁  
  
- Android 16 < 2026-05-01安全补丁  
  
- Android 16-qpr2 < 2026-05-01安全补丁  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.android.com/  
  
  
  
