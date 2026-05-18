#  Mythos漏洞发现能力强，但验证能力弱  
 数世咨询   2026-05-18 08:00  
  
点亮上方  
「  
★  
星标 」  
更多干货内容，不再错过！  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247542077&idx=1&sn=c63f262d4bb66895352b76087521895e&scene=21#wechat_redirect)  
  
  
**本文关键看点：**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/15I7jtE1uriaTpqMbLz5A8YygCg8eaYBUk0tJibjWvQrJONna1vQMDpOOafQaMjkeicDqcD9A02T81IYoKrqzrnzA/640?wx_fmt=gif "")  
  
  
**#****01**  
  
自主攻击安全公司XBOW针对Mythos Preview进行了测试，验证其在代码审计、逆向工程、原生应用评估、交互敏锐度等方面的有效性。  
  
**#****02**  
  
研究发现Mythos在本地代码漏洞发现和逆向工程方面表现出显著优势，但在漏洞验证和推理能力方面仍存在不一致性。  
  
**#****03**  
  
目前Anthropic尚未公布Preview的具体费用，但表示其价格将是Claude Opus的5倍。  
  
▍以下正文内容基于英文原文编译，可能存在语义偏差，请以原文为准。  
  
✦  
  
**以下为正文**  
  
✦  
  
  
  
Mythos 在检测软件漏洞方面似乎确实如其所宣称的那样强大；但它在其他方面的能力则更为微妙。  
  
自四月初发布以来，Anthropic 的 Mythos 人工智能模型就引起了广泛关注，主要原因是它据称能够发现比其他任何人工智能模型都多得多的漏洞。自主攻击型安全公司 XBOW 已将其人工智能测试工具应用于 Mythos Preview，以验证其这项能力以及其他 Mythos 功能的有效性。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lYWDmickZ2myxHUyuhhO3YEib0VhvRDVdTpRBan8GKszPyskxj1F50qomDkJNY38vfjv8STEZku1pWhhsbbt43k3aicjXQN7CChza1CDMSicFWg/640?wx_fmt=png&from=appmsg "")  
  
Anthropic 的主要说法得到了证实。XBOW 报道称：“无论供应商是谁，Mythos Preview 都比所有现有型号有了显著提升。”  
  
正如 Gary McGraw 20 年前所指出的，运行缺陷源于源代码错误和架构设计缺陷之间的相互作用。“你不可能仅仅通过盯着代码就能发现设计缺陷——你需要更高层次的理解，”他说道。XBOW 对 Mythos 模型进行了测试，分别测试了仅访问源代码和代码在实际运行环境中的表现。测试发现，该模型在“实际运行环境+源代码”的测试中表现出色，但在仅测试源代码时则效果不佳。  
  
这并没有削弱 Mythos 探测源代码的能力，但 XBOW 指出，虽然任何 AI 模型都能发现一些有趣的东西，但“一些东西”并不等同于“一切”。  
  
XBOW 的其他测试探索了 Mythos 在判断力、逆向工程、原生应用程序评估和视觉敏锐度方面的能力。  
  
在判断方面，它比之前的版本更能排除假阳性结果，“但有时也会因为证据不符合其标准而漏掉真阳性结果。” Mythos 需要精确的提示才能获得最佳结果。  
  
该模型在发现本地代码漏洞和逆向工程方面都表现出了强大的实力。  
  
在逆向工程测试中，XBOW 得出结论，Mythos“能够对其自身的结果和竞争对手模型的发现进行分类”，并且该模型能够推理不寻常的固件和嵌入式系统环境。  
  
XBOW 的视觉敏锐度测试旨在检验模型通过浏览器界面与实时网站交互的能力；也就是说，它能否识别正确的 UI 元素并点击正确的位置。“当被要求提供精确坐标时，它并非像素级精确，但它在选择正确的浏览器操作方面非常有效，”XBOW 写道。  
  
然而，有一项统计数据很容易被那些被 Mythos 的强大功能所震撼的用户忽略。“Mythos Preview 不仅仅是一款新机型：它是一款真正的巨头。但巨头体型庞大，而庞大就意味着昂贵。”  
  
截至发稿时，具体价格尚未公布，但Anthropic公司表示，这款产品的价格将是Opus型号的5倍。这让XBOW不禁思考，是否有可能以更低的成本，让一款价格更低的型号拥有更长的使用寿命和更高的精度。  
  
结论是肯定的。“如果我们按预估运行成本进行标准化，结果就相当清晰了：Mythos Preview 的效率并不算太低，至少在追求高精度的情况下是如此，但它在我们的基准测试中也并非最佳选择。” 在固定令牌预算下查找 Web 漏洞时，Mythos 的性能优于 Opus 4.6，但逊于 GPT5.5。  
  
这些发现均不影响最初的根本论断。Mythos 在发现代码漏洞方面优于其他模型。然而，总体而言，XBOW 测试的主要结论是：  
- Mythos 在源代码审计方面功能极其强大。  
  
- 它在验证漏洞利用方面表现不错，但功能稍弱。  
  
- 它的判断褒贬不一。它可能过于字面化和保守，而且往往高估其研究结果的实际意义。  
  
- 它在本地代码漏洞发现和逆向工程方面实力雄厚。  
  
XBOW 总结道：“Mythos Preview 在发现潜在漏洞方面表现出色，尤其是在源代码方面，并且在 Web、原生代码和逆向工程任务中展现了令人印象深刻的能力。”  
  
* 本文为泽钧编译，原文地址：https://www.securityweek.com/mythos-proves-potent-in-vulnerability-discovery-less-convincing-elsewhere/  
  
注：图片均来源于网络，无法联系到版权持有者。如有侵权，请与后台联系，做删除处理。  
  
— 【 THE END 】—  
  
🎉 大家期盼很久的#  
**数字安全交流群**  
来了！快来加入我们的粉丝群吧！  
  
🎁**多种报告，产业趋势、技术趋势**  
  
这里汇聚了行业内的精英，共同探讨最新产业趋势、技术趋势等热门话题。我们还有准备了专属福利，只为回馈最忠实的您！  
  
👉   
扫码立即加入，精彩不容错过！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Y9btpvDIDqqPJv9p5ibKIhJXQjWHJmSlibSdib80Llfp8mlV0ibf7m47jyaVeGoFeorddtIuxS5liafTJRKHeSdLnaQ/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
😄  
嘻嘻，我们群里见！  
  
更多推荐  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Y9btpvDIDqp8QpgS12GKDZmM3wbia28fgrBsUKCFUU3a6Tf9jsVWJcD2l6ic183HdhE2nqia7uMYO2NRQRylficZ5Q/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247539099&idx=1&sn=8820d80fdc92ac1f321b5e0a3ff0653e&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247539436&idx=1&sn=676908ed11008cd016b253d1d8e6ba8a&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247540181&idx=1&sn=e0cd678638b098f969f257b408062b91&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247540845&idx=1&sn=ec923893881e69010ad830ec852b0abb&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247539573&idx=1&sn=a721e2933ad640a3a4b3c72f74d76685&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247514185&idx=1&sn=8015c07a68a5e2b6074efd2c77f20085&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247539380&idx=1&sn=da5e8afa28247b4212a544750ece924d&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247514336&idx=1&sn=e69b1126e86ab2c59c8ca8e315637031&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247530968&idx=1&sn=3d712e23b322ad37cee46d27adb08ed0&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247538943&idx=1&sn=7f95d33eb069aab1cba23c41d68c9759&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247515942&idx=1&sn=bc9ba104b8eb1c0e914d90c8c9a34542&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247532302&idx=1&sn=2c6afc5d39c89c86f79020099ea44baa&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247512372&idx=1&sn=5d06a830f00953a0ab75157fc023ae56&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247538487&idx=1&sn=c4a1ad3501ff0eea9eeb56f514f6e445&scene=21#wechat_redirect)  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247542731&idx=1&sn=e2f9ac30c00dd037a0705ae5274d5381&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247537068&idx=1&sn=3a3e7c08d93638c1a6018c7862b13bcd&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247538269&idx=1&sn=848c657fc234aff8840d16d3f06b34ea&scene=21#wechat_redirect)  
  
  
  
