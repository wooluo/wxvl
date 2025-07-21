#  Sophos Intercept X for Windows 支持任意代码执行漏洞  
 网安百色   2025-07-21 10:58  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo4mS9sicLyicYfX99g84XN1vVMkC6bUBWupj8U8y6c9BlMylzTk5shTqGw9giaqGlWI3DXMvhVibbvqJA/640?wx_fmt=jpeg&from=appmsg "")  
  
Sophos Intercept X for Windows 产品系列中的三个严重漏洞可能允许本地攻击者以系统级权限执行任意代码。  
  
这些缺陷被识别为 CVE-2024-13972、CVE-2025-7433 和 CVE-2025-7472，包括注册表权限配置错误、设备加密组件的弱点以及在 SYSTEM 帐户下运行的 Windows 安装程序的问题。  
```
```  
  
这三个缺陷都具有高严重性评级，并影响 2025 年 7 月 17 日发布最新补丁之前的 Intercept X for Windows 版本。  
  
部署 Sophos Intercept X Endpoint 或 Intercept X for Server 的组织必须立即应用更新，否则将面临未经授权的权限提升和潜在的完整系统入侵的风险。  
## 权限提升和代码执行漏洞  
  
CVE-2024-13972 源于 Intercept X for Windows 更新程序使用的过于宽松的注册表 ACL，允许非特权用户在升级期间修改关键注册表项，从而注入以 SYSTEM 权限执行的代码。  
  
MDSec 的 Filip Dragovic 负责任地报告了此本地权限升级 （LPE） 漏洞。  
  
在第二个问题 CVE-2025-7433 中，设备加密组件暴露了一个权限提升缺陷，该缺陷使经过身份验证的本地用户能够加载和运行任意代码，绕过预期的加密保护措施。  
  
这个缺陷是由研究员 Sina Kheirkhah 通过守望台提交的。最后，CVE-2025-7472 针对 Intercept X for Windows 的安装程序。  
  
当安装程序在企业部署中常见的 SYSTEM 上下文下运行时，本地参与者可以利用不正确的文件权限来替换或作安装程序文件并获得系统级代码执行。  
  
Sandro Poppi 通过 Sophos 的漏洞赏金计划报告了此错误。  
  
<table><tbody><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><strong msttexthash="6718972" msthash="69" style="box-sizing: border-box;font-weight: bold;"><span leaf="">CVE 声明</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><strong msttexthash="6486077" msthash="70" style="box-sizing: border-box;font-weight: bold;"><span leaf="">标题</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><strong msttexthash="4085822" msthash="71" style="box-sizing: border-box;font-weight: bold;"><span leaf="">冲击</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><strong msttexthash="8943688" msthash="72" style="box-sizing: border-box;font-weight: bold;"><span leaf="">CVSS 3.1 分数</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><strong msttexthash="4044495" msthash="73" style="box-sizing: border-box;font-weight: bold;"><span leaf="">严厉</span></strong></td></tr><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">CVE-2024-13972 漏洞</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">Intercept X Updater 中的注册表权限漏洞</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">本地权限升级</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">7.8</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">高</span></section></td></tr><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">CVE-2025-7433 漏洞</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">设备加密组件权限提升</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">使用提升的权限执行任意代码</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">不可用</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">高</span></section></td></tr><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">CVE-2025-7472 漏洞</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">安装程序权限提升漏洞</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">本地权限升级</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">不可用</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid;word-break: break-word;"><section><span leaf="">高</span></section></td></tr></tbody></table>  
注册表 ACL 漏洞 CVE-2024-13972 影响版本 2024.3.2 之前的所有 Intercept X for Windows 安装，以及固定期限支持 （FTS） 2024.3.2.23.2 和长期支持 （LTS） 2025.0.1.1.2 版本。  
  
CVE-2025-7433 适用于 2025.1 之前版本的 Intercept X for Windows 中的中央设备加密模块。运行 FTS 或 LTS 版本的客户还需要相应的 2024.3.2.23.2 或 2025.0.1.1.2 版本才能接收修复程序。  
  
安装程序缺陷 CVE-2025-7472 会影响使用低于 2025 年 3 月 6 日发布的 1.22 版本的安装程序的任何部署。  
  
依赖自动安装推荐包的默认更新策略的组织将收到补丁，而无需执行其他作。相比之下，那些使用固定或长期维护通道的必须执行手动升级。  
## 缓解措施  
  
Sophos 已发布针对所有三个漏洞的更新软件包。Intercept X for Windows 2024.3.2 和匹配的 FTS/LTS 分支版本包括 CVE-2024-13972 注册表修复。  
  
Device Encryption 2025.1 及其 FTS/LTS 对应版本解决了 CVE-2025-7433，而 2025 年 3 月 6 日发布的安装程序版本 1.22 修复了 CVE-2025-7472。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
