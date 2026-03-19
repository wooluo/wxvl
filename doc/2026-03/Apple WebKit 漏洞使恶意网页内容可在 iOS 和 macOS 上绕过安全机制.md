#  Apple WebKit 漏洞使恶意网页内容可在 iOS 和 macOS 上绕过安全机制  
 网安百色   2026-03-19 11:17  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/WibvcdjxgJntcXNQejSEOR5M1rctbU6LpyyEmaDyNrwLiaTHGbRHVLKoq4n2ffveaQvdl0t6ibzfn7ic8AxribnvRgTaa0BTRZ1354EuOqLFzXMI/640?wx_fmt=jpeg&from=appmsg "")  
  
Apple 已发布关键安全补丁，以修复一个高危 WebKit 漏洞，该漏洞允许恶意构造的网页内容绕过同源策略（Same Origin Policy）。  
  
此次更新发布于 2026 年 3 月 17 日，适用于 Apple 最新版本的移动和桌面操作系统。  
  
该补丁通过“后台安全改进”（Background Security Improvements）机制下发，使设备能够在无需冗长系统重启或完整软件更新安装的情况下，快速获得防护。  
  
**Apple WebKit 漏洞 CVE-2026-20643**  
  
该漏洞由安全研究员 Thomas Espach 发现并报告，官方编号为 CVE-2026-20643。漏洞源于 WebKit 框架栈中 Navigation API 的跨源（cross-origin）问题。  
  
在正常情况下，同源策略是现代浏览器中的一项核心安全边界，用于限制来自某一源（origin）加载的文档或脚本与另一源资源之间的交互。  
  
一旦攻击者利用精心构造的恶意网页内容成功绕过该机制，可能会窃取认证令牌、劫持用户会话，或从用户当前访问的受信任网站中窃取敏感信息。  
  
Apple 工程师通过改进输入验证机制，修复了 Navigation API 中的底层缺陷，从而成功堵住了允许不当跨源导航的漏洞。  
  
与其等待下一次重大软件版本发布，Apple 选择通过“后台安全改进”机制分发该修复补丁。  
  
该机制随 26.1 版本操作系统引入，这类轻量级更新可为 Safari 浏览器、WebKit 框架栈以及多个系统库组件提供关键安全防护。  
  
这一快速响应机制使 Apple 能够在常规更新周期之间，无缝修复高危漏洞。  
  
如果用户在补丁应用后遇到少见的兼容性问题，可以临时移除此安全改进。  
  
这样做会使设备回退至基础软件版本，直到该补丁在后续正式版本中得到完善并集成。  
  
此次快速更新适用于以下系统版本：  
  
iOS 26.3.1、iPadOS 26.3.1、macOS 26.3.1 和 macOS 26.3.2。  
  
为确保设备持续受到该 WebKit 漏洞的保护，用户应确认系统已开启自动接收补丁的配置。  
  
用户可以在设备设置中的“隐私与安全性”（Privacy & Security）菜单中进行相关管理。  
  
在 iPhone 和 iPad 上，该选项位于“设置”应用中；而 Mac 用户则可通过 Apple 菜单进入“系统设置”访问。  
  
在对应界面中，选择“后台安全改进”（Background Security Improvements）选项，并确认“自动安装”（Automatically Install）功能已开启。  
  
关闭该设置将使设备在手动安装常规软件更新前，持续暴露于跨源攻击风险之下。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=p6hk1x4r&tp=webp#imgIndex=1 "")  
  
