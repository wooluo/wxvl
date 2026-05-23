#  不用迷信Mythos ，开源AI以更低的成本发现漏洞  
 数世咨询   2026-05-23 22:00  
  
点亮上方  
「  
★  
星标 」  
更多干货内容，不再错过！  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247542077&idx=1&sn=c63f262d4bb66895352b76087521895e&scene=21#wechat_redirect)  
  
  
**本文关键看点：**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/15I7jtE1uriaTpqMbLz5A8YygCg8eaYBUk0tJibjWvQrJONna1vQMDpOOafQaMjkeicDqcD9A02T81IYoKrqzrnzA/640?wx_fmt=gif "")  
  
  
**#****01**  
  
当Mythos的试用引起安全行业的震惊和担忧的同时，DARPA的参赛者们不以为然："这就是我们已经生活了一段时间的世界。"  
  
**#****02**  
  
DARPA竞赛中的参赛者比OpenAI和Anthropic更具优势，因为他们的开源工具成本远低于大型AI公司的产品。  
  
**#****03**  
  
虽然发现漏洞是主要关注点，但验证发现和自动生成漏洞修复的能力才是AI真正的超能力。  
  
▍以下正文内容基于英文原文编译，可能存在语义偏差，请以原文为准。  
  
✦  
  
**以下为正文**  
  
✦  
  
  
  
当全世界在Anthropic强大的新AI模型Claude Mythos及其发现严重软件漏洞的能力之间交替恐慌和追捧时，开源AI系统已经在以极低的成本变革漏洞发现领域。  
  
这些日益精密的开源工具，是美国国防高级研究计划局（DARPA）人工智能网络挑战赛的产物——这是一项为期多年的努力，旨在推动开发能够快速发现并修复美国庞大关键基础设施中漏洞的AI系统。从DARPA竞赛中产生的漏洞发现系统虽然没有Claude Mythos或OpenAI类似新工具那样的高调发布，但正因为它们是开源的、运行成本更低，它们可以帮助更多的基础设施提供商、企业和独立软件开发者。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lYWDmickZ2mwB84uKMtoCSY3JrgIRkDFrUshqtUd1bOoH7UBgxucm9ia46utB1libt2cn0nOniczySS9KGzaiaibqAQU2hBV4k6PPXkIH9jvWRoJw/640?wx_fmt=png&from=appmsg "")  
  
随着DARPA竞赛成为过去式，获奖团队和其他决赛选手正在将他们在比赛中获得的经验付诸实践，帮助保护那些默默支撑整个互联网的开源软件包。虽然与关键基础设施运营商及其供应商建立联系的努力仍处于萌芽阶段，但DARPA和几位竞赛获奖者表示，他们对这些新型AI工具的有效性感到兴奋。  
  
在美国网络安全人员捉襟见肘、对手正利用AI加速攻击之际，美国最大的希望可能是自动化工具——在漏洞导致混乱之前就能发现并帮助修复它们。  
  
到处发现漏洞  
  
DARPA在2025年8月宣布了竞赛的三名获胜者后，为使用其AI系统发现并修复关键重要软件中漏洞的决赛选手设立了140万美元的奖金池。该机构审查了各团队的提案，以审查重要的开源软件包，并跟踪他们如何与项目维护者互动。七支决赛队伍每支最多可获得20万美元，每个项目最高1万美元。  
  
到3月份付费漏洞猎杀狂潮结束时，各团队已在超过30个商业和开源项目中发现了83个漏洞，包括Android、Linux、流行数据库引擎SQLite和广泛使用的数据存储工具Redis。在政府预留的140万美元奖金中，它发放了83万美元。  
  
此后，"各团队继续在其他项目中发现了额外漏洞并生成了修复补丁，"负责监督竞赛的DARPA项目经理Andrew Carney说，他现在是团队进入新工作阶段的联络人。  
  
他表示，DARPA竞赛冠军Team Atlanta在U-Boot引导加载器和多个Apache核心库中发现了缺陷；另一支决赛队伍42-b3yond-6ug在Linux内核中发现了可能让黑客破坏关键基础设施中广泛嵌入的设备的漏洞。  
  
第三名Theori已部署其系统Xint，用于在"互联网上每个人都依赖的、真正广泛使用的开源项目"中发现缺陷，Theori研究员Tyler Nighswander说。Xint在流行数据库工具Redis、Postgres和MariaDB，以及Python、Linux和苹果的XNU内核（为MacOS和iPhone提供支持）中发现了漏洞。  
  
AI在发现"逻辑漏洞"——传统漏洞评估软件不会标记为有缺陷的错误代码——方面特别有用。Trail of Bits高级安全工程师Michael Brown说，随着AI在理解上下文方面越来越好，"自动化工具能够更深入地探索边界"。  
  
虽然发现缺陷获得了最多关注，但AI系统验证其发现的能力及其自动生成的修复，才是它们真正的超能力。  
  
关键基础设施组织通常运行高度定制的硬件和软件，而且往往难以在他们的定制设备上测试补丁——如果他们还能打补丁的话。由于漏洞猎手必须为DARPA竞赛开发补丁验证能力，他们最新的系统包含了这些功能。  
  
"那里有如此强大的力量，对于需要高安全性、高保证的系统有如此大的价值，"Carney说。"当我们进行这些对话时[与基础设施组织]，我们最终会在那里花费大量时间。"  
  
"说服那些反应较慢的公司和行业采用这项技术确实有些困难。"  
  
Tyler Nighswander研究员，说道。  
  
关键基础设施的障碍  
  
当各团队忙于修复核心互联网架构时，DARPA也试图将他们与关键基础设施的运营商及其供应商联系起来。美国大部分计算机化工设备陈旧、不安全且维护不善，DARPA希望义务漏洞猎手能在黑客利用之前找出重大缺陷。  
  
DARPA已向多个行业协调委员会（SCC）简要介绍了AI工具的潜力。Carney最近在卫生行业协调委员会的一次会议上发言，分享了竞赛团队的进展。"这样的论坛是我们真正关注的，"他说，"因为它们在传播信息方面非常有效。"  
  
Nighswander说，DARPA在漏洞猎手和关键基础设施运营商之间促成的介绍"取得了不同程度的成功"，许多组织并不急于采用新技术。"这个过程确实很慢。不同行业有不同的采用周期和接受意愿。"  
  
一些基础设施公司不理解AI系统如何在他们的环境中工作。其他人拒绝AI帮助，因为他们认为他们的人类安全团队已经足够。还有一些人对AI漏洞检测感兴趣，但无法获得必要的许可。"想办法减少一些繁文缛节会很好，"Nighswander说，"因为到目前为止，这一直是最大的限制。"  
  
Theori已与"少于五个"关键基础设施实体签署了漏洞猎杀协议，Nighswander说。"说服那些反应较慢的公司和行业采用这项技术确实有些困难。"  
  
迄今为止最成功的案例是Trail of Bits与卫生与公众服务部合作开展的医疗设备漏洞猎杀项目，Brown说该项目通过与医疗服务提供商及其供应商的强力合作修复了许多漏洞。  
  
因为基础设施供应商经常使用轻量级开源软件包——特别是在嵌入式设备中——漏洞猎手现有的工作将产生重大的下游影响，即使是不想直接参与的供应商也是如此。  
  
"这是一种提供价值的方式，然后启动与行业特定或部门特定公司和实体的对话，"Carney说。  
  
Anthropic宣布Claude Mythos预览版颠覆了商业世界，但类似的开源工具已经可用了好几个月。  
  
打破Mythos神话  
  
当Anthropic宣布Claude Mythos预览版并表示对公众来说太危险而不发布，促使整个商界震惊和警觉时，DARPA的竞争对手们大多只是耸了耸肩。  
  
"这很酷，"Nighswander说，但"这就是我们已经生活了一段时间的世界。"  
  
尽管如此，AI漏洞检测的新宣传可能有利于开源系统背后的团队。"它让人们发现有'哦，这是我公司应该担心的事情，'"Nighswander说。  
  
DARPA竞赛决赛选手甚至比OpenAI和Anthropic有优势，因为他们开源工具的成本远低于大型AI公司的产品，后者的访问令牌成本可能高达数万美元。  
  
使用Claude进行漏洞发现"有点像去一家菜单上没有价格的高级餐厅，"Trail of Bits研发总监Trent Brunson说。"你知道你有一个大型代码库。你不知道你有什么漏洞。……公司可能在令牌上花费5万美元、7.5万美元，甚至没有意识到，然后他们可能得到的信息量很低的漏洞。"  
  
资金紧张的关键基础设施公司可能会选择OpenAI和Anthropic的工具，转而选择DARPA决赛选手的便宜得多的但效果相似的服务。"更多公司会关注底线，"Brunson说，"而不是仅仅把AI令牌扔进去。"  
  
竞赛之外  
  
当他们离开DARPA竞赛时，Theori、Trail of Bits及其同行采取了不同方法来实现自己的AI系统。  
  
Theori正在与开源软件包维护者合作，但也已将其Xint商业化，并正在与企业签约评估他们的产品。"到目前为止，我们已经运行得相当成功，"Nighswander说。相比之下，Trail of Bits主要专注于开源软件包。将其工具Buttercup商业化会"从根本上"改变公司，Brunson说。  
  
漏洞猎手不得不根据竞赛环境调整他们的AI系统。工具需要能够发现真正的漏洞，而不是DARPA为竞赛创造的"合成"漏洞。它们需要生成人类能够轻松阅读的报告，而不仅仅是输入评分算法的数据。而且它们需要能够评估比严格结构化的竞赛要求的更广泛的输入。  
  
Trail of Bits为其分析医疗设备固件的工作构建了一个全新的系统，固件通常以二进制形式编写，与涉及源代码的软件不同。二进制代码是嵌入式设备通信的主要方式，但AI很难处理它，因为它不像源代码那样看起来像自然语言。Brunson说，一旦这个问题得到解决，"世界就是我们的了"。  
  
"我对技术继续拥有的性能和影响感到非常兴奋。"  
  
Andrew Carney项目经理，DARPA  
  
AI真正的变革  
  
DARPA、竞赛决赛选手和网络安全专家表示，几乎不可能夸大AI将如何改变漏洞发现过程。  
  
Nighswander说，过去需要多人花费六个月完成的软件安全评估，现在可以由AI在几小时内完成，而且往往效果更好。"这种规模和效率令人难以置信。"  
  
这项技术显然是一把双刃剑。国土安全部新兴技术政策前主任Nick Reese表示，同样的工具"为安全专业人员带来了重要机会"，但如果攻击者获得相同的数据，也会"为攻击者带来潜在优势"。  
  
但DARPA乐观地看待事情。2004年DARPA第一次竞赛中出现的自动驾驶汽车花了好几年才上市；Carney说，在AI漏洞修复竞赛中，该机构从未想过会看到一个"技术奇迹"，同时还能"经济上可行"。  
  
"我非常兴奋，"Carney说，"对这项技术继续拥有的性能和影响。"  
  
* 本文为泽钧编译，原文地址：  
https://www.cybersecuritydive.com/news/ai-vulnerability-discovery-darpa-challenge-critical-infrastructure/819494/  
  
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
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247540892&idx=1&sn=4c2c4b434d9731b3181760d45759d47b&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247537068&idx=1&sn=3a3e7c08d93638c1a6018c7862b13bcd&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzkxNzA3MTgyNg==&mid=2247538269&idx=1&sn=848c657fc234aff8840d16d3f06b34ea&scene=21#wechat_redirect)  
  
  
  
