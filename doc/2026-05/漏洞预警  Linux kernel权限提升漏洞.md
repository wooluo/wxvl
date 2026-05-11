#  漏洞预警 | Linux kernel权限提升漏洞  
浅安
                    浅安  浅安安全   2026-05-11 00:00  
  
**0x00 漏洞编号**  
- # CVE-2026-31431  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Linux kernel是美国Linux基金会的开源操作系统Linux所使用的内核。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhxQXbwG1WSjsS1TMvUY3aIsCJ1ic2kxclUiaYic5gV2p9dmfrcTERVZZ5bEOnWFIvWxTRHhnpSrVwYdscfiaPjyuYZZadMxgIIH8Gg/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-31431**  
  
**漏洞类型：**  
权限提升  
  
**影响：**  
获取root权限  
  
**简述：**  
Linux Kernel存在本地权限提升漏洞，由于其内核加密子系统中的一处逻辑缺陷，攻击者可以利用AF_ALG加密接口与splice()系统调用的组合，向任意可读文件的页缓存写入受控的4字节数据，从而篡改setuid程序，无需竞争条件即可直接获得root权限。  
  
**0x04 影响版本**  
- 72548b093ee3 <= commit < a664bf3d603d  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.kernel.org/  
  
  
  
