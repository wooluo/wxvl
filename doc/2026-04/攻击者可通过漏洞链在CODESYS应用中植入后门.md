#  攻击者可通过漏洞链在CODESYS应用中植入后门  
 FreeBuf   2026-04-29 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
## 全球广泛采用的基于软件的可编程逻辑控制器（Soft PLC）平台CODESYS Control运行时系统存在多个安全漏洞。Nozomi Networks实验室研究人员发现，攻击者通过组合利用这些漏洞，可在通过身份验证后，将合法的工业控制应用程序替换为植入后门的版本，从而将权限提升至对目标设备的完全管理控制。  
##   
  
**Part01**  
## 影响广泛的工业控制系统  
  
  
CODESYS被广泛应用于水处理设施、能源电网和自动化生产线等多个工业领域。由于这些PLC直接控制物理流程，漏洞利用可能导致生产中断、设备损坏或危险操作状况。CODESYS Control运行时系统负责管理自动化系统的实时输入/输出处理和网络通信。  
  
  
![用于树莓派的CODESYS Control（来源：nozominetworks）](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX2cB80hMicHgYXD0aRbUysynrudkRUwF9ibt1tib1YjLABdZAKUoOicpIGVNJGMXWfTRg9XvojPUzfOpibe9rTvkiaplktic5LQxWWapw/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**Part02**  
## 新发现的安全漏洞  
  
  
最新发现的漏洞涉及运行时系统处理文件权限和备份恢复的方式：  
  
- CVE-2025-41658（5.5，中危）：默认权限设置不当，允许本地用户读取CODESYS密码哈希  
  
- CVE-2025-41659（8.3，高危）：权限配置错误使低权限用户可访问敏感加密数据  
  
- CVE-2025-41660（8.8，高危）：资源传输缺陷允许恢复被篡改的启动应用程序  
  
**Part03**  
## 攻击链工作流程  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX01E9NLibW0bQA2sn2aA8icj4yXhtTC3AFKoj9p5Hkq0G7mj2tKFeScWXMUnj4OcMfKNZO0fTfBQCzNicRPGRIkP2RgxH5ec72m8c/640?wx_fmt=jpeg&from=appmsg "")  
  
  
攻击者首先需要获取有效的服务级凭证。虽然标准安全控制通常能阻止此类行为，但攻击者可通过默认密码、入侵工程工作站或利用CVE-2025-41658提取哈希值来窃取凭证。通过身份验证后，攻击分多个阶段展开：  
  
- 下载应用程序：利用平台备份功能从PLC下载活动启动应用程序  
  
- 窃取加密密钥：利用CVE-2025-41659提取必要的加密材料，绕过可选的代码加密和签名保护  
  
- 篡改并恢复：向二进制文件注入恶意机器代码，必要时重新签名，并利用CVE-2025-41660将植入后门的应用程序上传回设备  
  
- 获取root执行权限：等待操作员重启应用程序或系统，注入的后门将以root权限运行  
  
- 提升权限：通过root访问权限修改本地用户数据库，获取完整管理员权限  
  
**Part04**  
## 潜在危害与缓解措施  
  
  
被入侵的Soft PLC可使攻击者改变执行器行为、修改安全设定值并覆盖关键系统联锁。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX0RP4Zg80FHscltC8071ca4BAehnzo2R4AVErR6GWTqlNbNtPEF3HL8VftfJZyvand4lk69T6PEg86ticKuCGia69FbmC8B94XXU/640?wx_fmt=jpeg&from=appmsg "")  
  
  
该攻击涉及多项MITRE ATT&CK for ICS技术，包括控制操纵（T0831）、模块固件修改（T0839）和运营信息窃取（T0882）。CODESYS集团已在CODESYS Control Runtime 4.21.0.0和Toolkit 3.5.22.0版本中完全修复这些问题。  
  
  
Nozomi Networks指出，为防止进一步篡改，CODESYS现已默认强制要求所有PLC代码在部署或执行前必须进行代码签名。管理员应立即应用这些更新，实施严格的网络分段，并持续监控工业网络流量中的可疑活动。  
  
  
**参考来源：**  
  
Attackers Can Backdoor CODESYS Applications by Chaining Vulnerabilities  
  
https://cybersecuritynews.com/attackers-backdoor-codesys-applications/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337326&idx=1&sn=4b4825de0e4f83e00dad9cfa560df6f2&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
