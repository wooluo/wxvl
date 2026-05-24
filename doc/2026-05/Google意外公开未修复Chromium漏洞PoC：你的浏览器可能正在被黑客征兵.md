#  Google意外公开未修复Chromium漏洞PoC：你的浏览器可能正在被黑客"征兵"  
原创 Red Hunter
                    Red Hunter  黑白之道   2026-05-24 00:40  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617500&idx=1&sn=73c0634d23ef9a5a7ca009cf0e3b1929&scene=21#wechat_redirect)  
> **导语**  
：Google本周三在Chromium官方bug追踪器上意外公开了一个存在长达42个月未修复漏洞的PoC利用代码——讽刺的是，漏洞发现者曾私下报告，Google却一直未修，而今自己先把底牌亮了出来。攻击者可利用该漏洞将用户浏览器悄无声息地变成僵尸网络的一员。受影响设备可能高达数百万，而修复时间表至今仍是未知数。  
  
## 42个月的"沉睡"漏洞：一段不该发生的尴尬  
  
这事儿吧，得从两边儿看——发现漏洞的安全研究员这边，够冤；Google那边，够尴尬。  
  
独立安全研究人员Lyra Rebane在2022年底私下向Google报告了这个漏洞。漏洞藏在Chromium的Browser Fetch API里，利用Service Workers建立隐蔽持久的后门通道。按理说，这种级别的漏洞大厂怎么也得抓紧修吧？结果一等就是**42个月**  
，漏洞依然"躺"在代码库里一动不动。  
  
直到本周三，Google自己把包含PoC的bug报告发布到了公开的Chromium bug追踪器上。Rebane一开始以为终于修好了，上去一看——好家伙，漏洞压根没动。Google随后虽然删掉了公开帖子，但PoC代码早已被存档到其他网站，等于"泼出去的水收不回来了"。  
  
Google随后在一份声明中表示已知悉代码公开事件，正在努力修复。但具体何时能打补丁——暂无时间表。  
## 技术原理：Fetch API怎么成了后门通道？  
  
这漏洞到底是怎么工作的？用一句话概括：**滥用浏览器后台下载功能，让Service Worker"永生"**  
。  
  
Browser Fetch API是Chromium系浏览器的一个标准功能，允许网站在后台发起大文件下载（比如离线视频），即使你关掉了页面，下载也能继续。Google在2018年推出这个功能时还信誓旦旦地承诺："Service Worker不会一直运行，不用担心它在后台挖矿。"  
  
结果这话在2026年被狠狠打脸。  
  
Rebane发现，攻击者只要在恶意网站上跑一段JavaScript，每20秒创建并中止一次后台fetch，就能**绕过Service Worker的正常生命周期限制，让它永久保持活跃**  
。更绝的是，如果快速完成创建和中止动作，整个过程在浏览器UI上完全无感知——既不会有下载提示，也不会弹窗。  
  
在Edge浏览器上，这个下载下拉菜单会冒出来，但菜单里什么都没有，用户大概率会以为是浏览器的bug。在最新版Chrome上，连这个"假bug提示"都消失了，后台fetch静默运行，用户根本不知道自己的浏览器已经变成了别人的"肉鸡"。  
  
![漏洞利用流程图](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6ORbmSvibvF1mJicP8wflGgbVWTxI9Il1ejQKP2ZKLQbxAf88hJyBo81qaAgE5b56AmJ4bd4rcwKIwg9nibTyrM74ljJQvKFIR4dw/640?wx_fmt=png "漏洞利用流程图")  
## 你的浏览器能干什么坏事？  
  
既然Service Worker永久活跃了，攻击者能做的事可不少：  
  
**持久化远程代码执行**  
：通过Service Worker加载远程JavaScript payload，一旦执行，攻击者可以在用户浏览器里跑任意代码。  
  
**构建僵尸网络**  
：数百万设备被悄悄征召，形成一个隐形的代理网络。攻击者可以用它来匿名浏览、做DDoS攻击的流量源，甚至植入挖矿脚本。  
  
**用户追踪**  
：Service Worker可以获取浏览器启动时间、IP地址和User-Agent信息，实现长期用户画像。  
  
**配合其他漏洞横向渗透**  
：Rebane本人在报告里说了一句大实话："危险的地方在于，你现在手里聚集了一大批浏览器，将来一旦发现新漏洞，就可以一次性在所有设备上运行。"  
## 影响范围：谁在"裸奔"？  
  
受影响的浏览器包括但不限于：  
- **Google Chrome**  
  
- **Microsoft Edge**  
  
- **Brave**  
  
- **Opera**  
  
- **Vivaldi**  
  
- **Arc**  
  
一句话总结：**所有基于Chromium的浏览器**  
，除非另有说明，否则都可能中招。  
  
而Firefox和Safari之所以安全，是因为它们压根不支持Browser Fetch API的这个"永生"特性——有时候少支持点功能反而成了优势。  
  
![受影响浏览器分布](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6MT1seYNPcmUpIapR8lLS9eWMFXzicFNTAZDaDyEib9KKAEicXLl2u5qibPuSYdibfvRh43Wotsj5GclgaNPD8taBMFXydbNQ5uruUk/640?wx_fmt=png "受影响浏览器分布")  
## 为什么42个月都没修？Google自己给出了答案  
  
Rebane在接受 Ars Technica 采访时说了这么一句：  
  
"我想问题在于，这个漏洞没有突破任何已有的安全边界。所以它不会让攻击者访问你的邮件、电脑或者类似的东西。大概正是因为这个，负责这个漏洞的人没有真正理解它的危害程度，于是就这么一直拖着。"  
  
翻译成人话就是：**漏洞虽然存在，但不会直接毁掉用户电脑，所以优先级一直上不去。**  
  
然而问题在于，单个漏洞确实"只是个小后门"，但当这个后门能和未来任何新漏洞组合使用时，其破坏力就会呈指数级上升。攻击者完全可以先静默积累"肉鸡群"，等新漏洞一出，一键全打——这种攻击方式在地下黑产圈里并不新鲜。  
## 防护建议：现在你能做什么？  
  
在Google正式推送补丁之前，你可以关注以下几点：  
  
**留意异常的下载提示**  
：如果浏览器突然弹出没有来源的下载下拉菜单，尤其是什么都没下载却出现了下载图标，这是一个值得警惕的信号。  
  
**禁用Service Workers**  
：在Chrome设置里找到"站点设置"，可以手动关闭JavaScript或限制Service Worker权限，但这会影响部分网站的正常功能。  
  
**保持浏览器更新**  
：虽然目前没有补丁，但及时更新到最新版本永远是第一选择。  
  
**关注浏览器下载管理器**  
：定期检查你的下载记录，看是否有不明来源的下载任务在后台运行。  
  
从长远看，这事儿也给所有基于Chromium的浏览器用户提了个醒：**你的浏览器比你想象的更强大，也更危险**  
。  
## 写在最后  
  
Google这次"自爆"操作，可以说是在安全圈扔下了一颗深水炸弹。一个42个月未修复的漏洞，PoC代码已经公开满天飞，受影响设备可能高达数百万——讽刺程度拉满。  
  
这事儿说明什么？即便是全球最顶级的科技公司，在漏洞管理上也并非无懈可击。而当一个"看起来不严重"的漏洞积累到足够长的时间，它的风险等级往往会悄然升级。  
  
对于普通用户而言，与其指望厂商快速打补丁，不如培养良好的安全习惯——毕竟在攻防这场马拉松里，防守方永远都需要多留一手。  
  
**图片版权 华盟网**  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617065&idx=1&sn=1e30ce488590711587c29414a82b7ab8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617222&idx=2&sn=a600c58c6ac251bf0313134ad70a4fd8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617751&idx=1&sn=f1c1ed68d848029fc1ff726087cac05a&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617464&idx=1&sn=a447b46bf211ae577eec30f82ed1d089&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
