#  漏洞变现金：我的31500美元Facebook漏洞赏金之旅 0x2  
原创 安全小白团译文  安全小白团   2025-06-18 00:32  
  
forever young  
  
  
  
不论昨天如何，都希望新的一天里，我们大家都能成为更好的人，也希望我们都是走向幸福的那些人  
  
  
  
01  
  
继续探索  
  
安全小白团  
  
  
书接上回《[漏洞变现金：我的31500美元Facebook漏洞赏金之旅 0x1](https://mp.weixin.qq.com/s?__biz=MzU2NzY5MjAwNQ==&mid=2247486856&idx=1&sn=17c1bdd0c707512e9a9bbdf977974ad7&scene=21#wechat_redirect)  
》  
  
  
在发现 MicroStrategy Web SDK 托管在 Facebook 的生产服务器上后，我意识到这是一个潜在的金矿。MicroStrategy Web SDK 是用 Java 编写的，而我对 Java 代码中的漏洞情有独钟。于是，我使用 JD-GUI 工具反编译了 SDK 中的每个 JAR 文件，并开始仔细审查代码。为了更好地测试，我还在自己的服务器上托管了这个 SDK，以便在代码中发现可疑之处时能够立即验证。  
  
  
经过 26 天的努力和反复测试，我终于有了一个有趣的发现。  
  
  
在  
 com.microstrategy.web.app.task.WikiScrapperTask  
   
类中，我注意到字符串 str1  
 是由用户提供的输入进行初始化的。代码会检查提供的字符串是否以 http://  
 或 https://  
 开头，如果是，则调用 webScrapper  
 函数。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56wFqdmy0fuNLq0KXeoKZpJ0LialSW9og3tf0sziaKINt7iac6IfEicEgicrA/640?wx_fmt=png&from=appmsg "")  
  
  
webScrapper  
 函数内部会使用 JSOUP 向提供的 URL 发送 GET 请求，用于抓取和解析 HTML 页面。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56xo48N82AjXrYRIdYJiblChLvicDIznROzXKjp3v6vzhzZe6dQbRWicpDQ/640?wx_fmt=png&from=appmsg "")  
  
  
**BOOM！又是一个 SSRF漏洞！**  
  
****  
****  
****  
****  
****  
遗憾的是，这次是一个SSRF盲注，我无法证明它允许提交内部 GET 请求。但是，通过 MicroStrategy Web SDK 的源代码（部署在 m-nexus.thefacebook.com  
 域名上），我确认这是一个内部 SSRF。  
  
  
通过这个发现，我们无法枚举防火墙后的内部基础设施，也无法泄露任何敏感信息。我知道，如果我将这个漏洞报告给 Facebook，他们很可能会拒绝，因为这个漏洞没有实际影响。  
  
  
那么接下来该怎么办？——我一时陷入了茫然。  
  
  
我决定暂时放下这个漏洞，开始寻找 Facebook 主域名（facebook.com  
）上的新漏洞。  
  
  
几个月后……  
  
  
我在 Facebook 上发现了另一个漏洞，这次是 URL 短链接服务可能泄露服务器敏感信息。  
  
  
URL   
短链接  
是一种技术，通过它可以将一个较长的 URL 缩短，同时仍然指向所需的页面。——维基百科  
  
  
Facebook 有自己的 URL   
短链接  
服务，地址是 https://fb.me/  
。这个服务被 Facebook 内部员工和外部用户广泛使用。我注意到，短链接会通过 HTTP Location 头将用户重定向到长 URL。我还发现 fb.me  
 网站没有设置速率限制。于是，我决定对该服务器发起基于字典的暴力攻击（大约 2000 个单词），并分析响应。  
  
  
通过 Burp Suite 的 Intruder 工具，我捕获了几个短链接，这些链接会将用户重定向到内部系统，但内部系统最终会将用户重定向到 Facebook 主域名（即 facebook.com  
）。  
  
以下是一个场景：  
  
```
https://fb.me/xyz ==> 
301 Moved Permanently — https://our.intern.facebook.com/intern/{some-internal-data} ==> 
302 Found — https://www.facebook.com/intern/{some-internal-data} ==> 404 Not Found
```  
  
需要注意的是，一些将用户重定向到内部系统的短链接是由 Facebook 内部员工生成的，可能包含敏感的内部信息，例如：  
  
```
https://our.intern.facebook.com/intern/webmanager?domain=xyz.com&user=admin&token=YXV0aGVudGljYXRpb24gdG9rZW4g
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56TLfHzaqTI4ib8mia13D2udLLqj0jpQodhg1CDrIJLOZTZvAK3gOblLeA/640?wx_fmt=png&from=appmsg "")  
  
  
通过 Burp Suite 代理工具观察 https://fb.me/err  
 URL 的 HTTP 响应，可以看到日志文件夹的完整内部路径。  
  
  
我使用字典和 Intruder 工具获取了更多类似的信息，并编写了一个简单的 Python 脚本来自动化这一任务。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56bepOib8yaUcXx9mYXGF0SvmYVE2bbvcNE9NU8xUHHVZwMsgkVXQEytw/640?wx_fmt=png&from=appmsg "")  
  
  
以下是测试过程中获取的部分信息截图：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw5650F4rKcmGktxBFDQJ9HSBSeRVCfvrhLmjBbaMDKtu5DIlpIbiazheiaA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56RW8mLMP2HNMGbPBzHXdJuVABdCIjDuydJiczXEYbhthznDRicbP5DF6w/640?wx_fmt=png&from=appmsg "")  
  
  
我只放了两张截图，由于 Facebook 的政策，我无法披露所有信息，这个漏洞泄露了内部 HTTP GET 查询。在未经任何身份验证的情况下泄露日志文件夹路径、其他文件路径、用于获取数据的内部系统查询、内部 IP 地址、内部 ID、配置相关信息、私有文档等。通过利用这个漏洞，攻击者可以枚举系统中存在的有效内部 URL。  
###   
###   
  
02  
  
漏洞链  
  
安全小白团  
  
  
现在，我手上有两个漏洞：  
  
  
**1.盲 SSRF**  
：可以向内部和外部系统提交 GET 请求。  
  
**2.服务器敏感信息泄露**  
：包括日志文件夹路径、其他文件路径、内部系统查询、内部 IP 地址、内部 ID 等。  
  
  
我创建了一个场景，展示了敏感信息泄露如何有助于发起特定攻击，例如路径遍历和服务器端请求伪造（SSRF）。如果攻击者能够获取内部网络的 IP 地址，他们将更容易针对内部系统发起攻击。  
  
我将这两个漏洞的 PoC 提交给了 Facebook，并收到了回复：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56aw1Y2yjEshHKevCNe2Ctq5rKD8d2BIjibdPQ0dd8seBOMPAibdXTBZqg/640?wx_fmt=png&from=appmsg "")  
  
  
我注意到，SSRF 盲注漏洞已经被修复（wikiScrapper  
   
任务不再可访问/注册）。  
嗯……这不公平   
  
  
几天后，我又发现了一个盲 SSRF 😎  
  
  
通过 MicroStrategy Web SDK 的源代码，我确认这是一个内部 SSRF。在com.microstrategy.web.app.utils.usher  
 类中，我观察到validateServerURL  
 函数处理serverURL  
 参数。validateServerURL  
 函数会内部向提供的 URL 发送 GET 请求。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56BknHZtbASIn24sKiaWTD3ucvk5rQsMsWicuaicyicfG6q6OXdUwKf3twOA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56odbylFy20jiaqxEqSUvCVdRhuia7WX61Qrv5my9oYt1jM6ibKVOZ4QfpQ/640?wx_fmt=png&from=appmsg "")  
  
  
我将 serverURL  
 参数的值替换为 Burp Collaborator 的 URL 并发送 GET 请求  
。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw568fiaYUaJpRibQYP10yGwFLU6ks0sibUh1Jhmrc0tgessXSqHR4dQA0zSg/640?wx_fmt=png&from=appmsg "")  
  
  
Burp Collaborator 立即收到了请求，显示 IP 地址为  
 199.201.64.1  
，这表明 SSRF 漏洞存在。我请求 Facebook 允许我执行之前邮件中描述的操作。  
  
  
他们回复说，他们能够复现这个漏  
洞，并且正在修复中，会尽快更新赏金决定。  
  
  
几天后，我终于收到了回复：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56PKrg8VxVxuOQbdomgUpwfIkE80XVo4gefKzgAkSKyIH1Hpd9CFZKqw/640?wx_fmt=png&from=appmsg "")  
  
  
**Facebook 奖励了我！**  
  
  
哇！🤩🤩🤩🤩🤩  
###   
###   
  
03  
  
后续测试  
  
安全小白团  
  
  
接下来，我想测试 MicroStrategy 演示门户是否存在 SSRF 漏洞。结果发现，这个漏洞也存在。通过 AWS 元数据 API，我能够从他们的服务器获取一些有价值的信息。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56x8KnSrPKREibo8ILRjoLHbATicm696Jv3zWYmIPyLtqPRdRqcFhV8zzQ/640?wx_fmt=png&from=appmsg "")  
  
  
我将此漏洞报告给了 MicroStrategy 的安全团队，并收到了以下回复：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaASKxS11kaSBlicVBBUibsriautSQeuOw56QuGaITrzMs44O7strhiavr5UIo6CZN85toAlZZ89IQZiaicNOraAqIk4w/640?wx_fmt=png&from=appmsg "")  
  
  
**MicroStrategy 确认并奖励了我。**  
### 结论  
###   
  
这个问题现在已经修复。这篇文章稍长，但我的目的是让你深入了解如何结合代码审查、枚举和脚本编写等技能，发现关键漏洞。  
  
  
当我第一次在 Facebook 服务器上发现这个漏洞时，我尝试将其升级为 RCE，但遗憾的是，Facebook 实施了良好的安全措施，未能成功。不过，我仍然通过这个漏洞获得了总计 **31,500 美元**  
（1,000 美元 + 30,000 美元 + 500 美元）的赏金。💰  
  
  
希望你喜欢这篇文章。如果有任何错误，请见谅。感谢阅读，保持学习，注意安全与健康！😇  
  
  
  
参考及来源：  
  
https://medium.com/@win3zz/how-i-made-31500-by-submitting-a-bug-to-facebook-d31bb046e204  
  
  
  
  
04  
  
免责&版权声明  
  
安全小白团  
  
  
  
安全小白团是帮助用户了解信息安全技术、安全漏洞相关信息的微信公众号。安全小白团提供的程序(方法)可能带有攻击性，仅供安全研究与教学之用，用户  
将其信息做其他用途，由用户承担全部法律及连带责任，安全小白团不承担任何法律及连带责任。安全小白团所分享的工具均来自互联网公开资源，我们不对工具的来源进行任何形式的担保或保证。  
用户在下载或使用本公众号分享的工具前，应自行评估工具的安全性。我们无法对工具可能存在的病毒、木马或其他恶意软件负责，因此造成的任何损失，安全小白团不承担任何责任。  
欢迎大家转载，  
转载请注明出处。  
如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaic181R2RnYicpic6GbdiazMpqiaIrCaa2fbjKHtn8kiayKGGBeW0icqgpfzNqmibShxqsn2DMDggpaxnKjrY1sCWZXWng/640?wx_fmt=png "")  
  
转发  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ItKicuUNQ9EMVAsW4tKUASR3dbCFrBib4ibY05IeDzhxf9b1KMxjzLaukAYt0NfYLchE5eibmaSHibiamfT9wDQibytww/640?wx_fmt=png "")  
  
收藏  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jwUk1NOJTytvIJd6VYGIIp4cA0qNKtMv7tAziatxhK4whicjTxAPklWUEfjejWvRbEbJjKDoRhZpUaPaEibpFYbcQ/640?wx_fmt=png "")  
  
点赞  
  
![](https://mmbiz.qpic.cn/mmbiz_png/K2CMDET8V6nLGsmoNxVfZytJuZzowIia6LuVg70JTa2jGiaozMwyvhG9eKOKVa5rzaj1QOgfPm4a2lsEJ7GN7zCQ/640?wx_fmt=png "")  
  
在看  
  
  
