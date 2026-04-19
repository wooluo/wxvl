#  微软Azure Windows Admin Center现一键式RCE漏洞，攻击者可执行任意命令  
 FreeBuf   2026-04-19 04:14  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
Windows Admin Center是一款本地部署的浏览器管理工具，IT管理员可通过其图形化集中界面管理Windows服务器、客户端及集群。  
  
  
Cymulate研究实验室新发现的这一高危漏洞可使攻击者在Azure集成版和本地部署版WAC上实现未经身份验证的一键式远程代码执行（RCE）。攻击者仅需诱导受害者访问一个篡改后的URL，即可秘密执行任意命令并接管目标网络。  
  
  
微软于2025年8月22日收到漏洞报告后，已通过服务端补丁保护了所有Azure托管实例。云端用户无需任何操作即可自动获得防护，但本地部署WAC的用户必须主动升级至最新版本才能修复漏洞。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX0WryoWLX5b0gaSaXlRtHzvgencomiaKJSPHG1DPFaUrqTCJqNDIA8CyygDlb65zDqnHLoribsE4CNwNtl0HaJZa6NtNWjfBoPFA/640?wx_fmt=jpeg&from=appmsg "")  
  
waconazure 应用通过 iframe 在 Azure 门户中运行（来源：Cymulate）  
  
  
**Part01**  
## 漏洞成因深度解析  
  
  
根据Cymulate研究实验室的技术报告，该攻击链利用了以下三项底层架构缺陷：  
1. **响应型跨站脚本（XSS）**  
：允许攻击者向Azure门户流程和本地错误处理机制注入任意JavaScript代码。  
  
1. **不安全的重定向处理**  
：WAC未经验证即接受外部控制的网关URL，使攻击者可劫持合法应用流程实施欺骗。  
  
1. **本地部署的凭证存储缺陷**  
：敏感的Azure访问令牌和刷新令牌直接存储在浏览器的本地存储中，可通过XSS漏洞直接窃取。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX0sGaMOhvd7pDYPiaVL8aG24JJJPDKllF92baMR7Z4SgxXia0P37e65h2QibYtiaMicn8yZ0biazcjj3D0VUX4enKxYnctZyG6QL37bA/640?wx_fmt=jpeg&from=appmsg "")  
  
未经过滤的错误信息可能导致 HTML 注入（来源：Cymulate）  
  
不同部署环境面临的风险也有所不同：  
- **Azure托管环境**  
：攻击者可构造含恶意载荷的仿冒URL，通过伪造基础/NTLM认证窃取凭证。  
  
- **本地部署环境**  
：攻击者能够强制网关在托管服务器上执行任意PowerShell命令。  
  
- **连接的本地网关**  
：暴露存储的Azure令牌，使攻击者获得受害者的完整云权限。  
  
**Part02**  
## 攻击链运作全流程  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX0JYtBOoqEPsNo3HsiaS2vTETfq1RR3KnI6kPrQaA1ODTKjjvsh6ricBmGfiao6yUR4x3EBVvQFiaVttIuMibclufKOc1CibFrTibb0QI/640?wx_fmt=jpeg&from=appmsg "")  
  
攻击者托管的有效载荷可以自动窃取客户端凭据（来源：Cymulate）  
  
Cymulate研究人员证实，完整攻击链仅需极少量用户交互：  
  
  
攻击者需注册有效域名、获取可信证书并伪造WAC网关URL，通过钓鱼邮件或网页重定向传播恶意链接。当受害者点击链接时，WAC应用会将流量重定向至攻击者控制的服务器，该服务器返回包含隐藏脚本的构造错误消息。由于应用未正确过滤响应内容，恶意代码将在高权限的WAC浏览器环境中直接执行。  
  
  
该漏洞证明开发者必须严格验证客户端输入和服务器响应。虽然Azure版WAC用户已受到保护，但本地网络仍面临严峻风险。Cymulate强烈建议所有管理本地WAC部署的安全团队立即升级至微软最新补丁版本，并检查网络中是否存在未更新的实例。  
  
  
**参考来源：**  
  
One-Click RCE in Azure Windows Admin Center Allow Attacker to Execute Arbitrary Commands  
  
https://cybersecuritynews.com/azure-windows-admin-center-rce/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337048&idx=1&sn=7238361cc36d8446dbd7c8ed85cb2f42&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
