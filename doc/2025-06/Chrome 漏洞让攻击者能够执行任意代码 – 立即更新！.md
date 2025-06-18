#  Chrome 漏洞让攻击者能够执行任意代码 – 立即更新！  
邑安科技  邑安全   2025-06-18 09:17  
  
更多全球网络安全资讯尽在邑安全  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1N39PtINn8sQcSia1rMbD0QZDicia5iaEHbebx2Ct9xBdtLDcYojcJSjTicz6vETLibA3vfjgicZJGgiazr7VJuk5R1Xjg/640?wx_fmt=png&from=appmsg "")  
  
Google 已针对所有桌面平台上的 Chrome 浏览器发布了紧急安全更新，解决了可能允许攻击者在用户系统上执行任意代码的关键漏洞。  
  
该更新于 2025 年 6 月 17 日星期二推出，修补了三个重大安全漏洞，包括两个高严重性漏洞，这些漏洞为外部研究人员赢得了总计 11,000 美元的巨额赏金奖励。  
  
最新的 Chrome 稳定频道更新版本 137.0.7151.119/.120（适用于 Windows 和 Mac）和 137.0.7151.119（适用于 Linux）解决了对用户安全构成重大风险的三个关键安全漏洞。  
  
CVE-2025-6191：V8 中的整数溢出  
  
该高严重性漏洞被跟踪为 CVE-2025-6191，表示 Chrome 的 JavaScript 引擎 V8 中存在整数溢出。  
  
此漏洞由安全研究员 Shaheen Fazim 于 2025 年 5 月 27 日发现，并从 Google 的漏洞奖励计划中获得了 7,000 美元的赏金。  
  
特别是，该漏洞影响了 Chrome 的核心 JavaScript 处理引擎，该引擎每天处理跨 Web 应用程序的数十亿次作。  
  
JavaScript 引擎中的整数溢出漏洞特别危险，因为它们可能导致内存损坏，并使攻击者能够在浏览器的沙盒环境中执行恶意代码。  
  
CVE-2025-6192：在 Profiler 中释放后使用  
  
第二个高严重性漏洞 CVE-2025-6192 涉及 Chrome 的 Profiler 组件中的释放后使用情况。  
  
据研究员彭朝元 （@ret2happy） 于 2025 年 5 月 31 日报告，该漏洞获得了 4000 美元的奖励。  
  
该漏洞以 Chrome 的性能分析系统为目标，开发人员和高级用户经常使用该系统进行调试和优化。  
  
当程序在释放内存后继续使用内存时，就会出现释放后使用漏洞，这可能允许攻击者纵内存内容并实现代码执行。  
  
Google 的安全团队强调，在大多数用户更新他们的浏览器之前，对详细错误信息的访问仍然受到限制。  
  
该公司还指出，如果漏洞影响到其他尚未实施修复程序的项目使用的第三方库，则限制可能仍然存在。  
  
用户需要立即采取行动  
  
所有桌面平台上的 Chrome 用户都必须立即更新，以防止这些漏洞可能被利用。  
  
更新推出于周二开始，并将在未来几天和几周内通过 Chrome 的自动更新机制继续推出。  
  
用户可以通过导航到 Chrome 设置 > 关于 Chrome） 或通过访问浏览器地址栏中的 chrome://settings/help 来手动检查更新。  
  
对这些漏洞的快速响应表明了维护更新的浏览器软件的极端重要性，并凸显了现代 Web 浏览器在平衡功能与用户保护时面临的持续安全挑战。  
  
原文来自: cybersecuritynews.com  
  
原文链接:   
https://cybersecuritynews.com/chrome-vulnerabilities-update-now/  
  
欢迎收藏并分享朋友圈，让五邑人网络更安全  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/1N39PtINn8tD9ic928O6vIrMg4fuib48e1TsRj9K9Cz7RZBD2jjVZcKm1N4QrZ4bwBKZic5crOdItOcdDicPd3yBSg/640?wx_fmt=jpeg "")  
  
欢迎扫描关注我们，及时了解最新安全动态、学习最潮流的安全姿势！  
  
推荐文章  
  
1  
  
[新永恒之蓝？微软SMBv3高危漏洞（CVE-2020-0796）分析复现](http://mp.weixin.qq.com/s?__biz=MzUyMzczNzUyNQ==&mid=2247488913&idx=1&sn=acbf595a4a80dcaba647c7a32fe5e06b&chksm=fa39554bcd4edc5dc90019f33746404ab7593dd9d90109b1076a4a73f2be0cb6fa90e8743b50&scene=21#wechat_redirect)  
  
  
2  
  
[重大漏洞预警：ubuntu最新版本存在本地提权漏洞（已有EXP）　](http://mp.weixin.qq.com/s?__biz=MzUyMzczNzUyNQ==&mid=2247483652&idx=1&sn=b2f2ec90db499e23cfa252e9ee743265&chksm=fa3941decd4ec8c83a268c3480c354a621d515262bcbb5f35e1a2dde8c828bdc7b9011cb5072&scene=21#wechat_redirect)  
  
  
  
  
  
