#  [视频]重磅炸弹，6年前的提权漏洞通杀Windows所有版本  
原创 陆安予
                    陆安予  白帽子安全笔记2.0   2026-05-17 02:46  
  
   
  
# [视频]重磅炸弹，6年前的提权漏洞通杀Windows所有版本  
### 一、背景  
  
日常研究发现，一个存在了**6年**  
的Windows提权漏洞浮出水面  
[1]  
，它具备直接提权到nt authority\system  
的能力。漏洞编号CVE-2020-17103  
，代号MiniPlasma  
。  
  
本人经过略改复现，在windows-11-x64-25H2  
上提权至system权限，可完全绕过Windows Defender  
。  
  
![CVE-2020-17103](https://mmbiz.qpic.cn/mmbiz_png/ibXL9MCj2GqOyyMjlvYmsIv3fyT5uoTicvYmENO7R0uHz9JX7EddrQUUXdqicsj01NpJibPSyZQLKVV1UH7OZiay4K8glSyaUSkiaAzia8Nks8ZABg/640?wx_fmt=png&from=appmsg "null")  
  
CVE-2020-17103  
  
[演示]  
  
  
> 这个漏洞涉及 Cloud Files 微过滤器驱动（cldflt.sys），在处理注册表操作时存在逻辑错误。  
  
#### 攻击流程  
1. 1. 注册表符号链接滥用 - 创建符号链接将 BlockedApps 重定向到 Volatile Environment  
  
1. 2. CfAbortOperation 触发 - 调用 CfAbortOperation 触发云文件驱动的注册表操作  
  
1. 3. 竞争条件 - 利用 ForceTokenThread 持续修改线程 token  
  
1. 4. 注册表写入 - 在 Volatile Environment 中写入 windir 键  
  
1. 5. DLL 劫持 - 触发 Windows 错误报告任务以 SYSTEM 权限运行伪造的 wermgr.exe  
  
#### 漏洞本质  
  
云文件微过滤器驱动在进行注册表操作时：  
  
1.没有正确验证注册表路径的安全性  
  
2.允许低权限进程操作其他用户的注册表键  
  
3.可以通过符号链接注入任意注册表路径  
### 二、技术修补  
  
采用**Loader6.3**  
项目对C#项目自动化修补，完全绕过AMSI  
，没有AMSI的Defender形如虚设。  
### 三、修复方案  
  
由于该  
漏洞[2]  
已存在多年，目前微软未修补，临时解决可监测该驱动的异动或直接禁用。  
### 四、免责声明  
  
本文涉及方案仅限合法授权的安全研究、渗透测试用途，使用者须确保符合《网络安全法》及相关法规。具体条款如下：  
- • 仅可用于已获得书面授权的目标系统测试；  
  
- • 遵守法律法规，不得用于侵犯他人隐私或数据窃取；  
  
本人不承担因用户滥用本软件导致的任何后果。使用即视为同意并接受上述条款。  
#### 引用链接  
  
[1]  
 : https://github.com/Nightmare-Eclipse/MiniPlasma  
[2]  
 漏洞: https://msrc.microsoft.com/update-guide/vulnerability/CVE-2020-17103  
  
   
  
  
