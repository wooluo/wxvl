#  “漏洞末日”警钟预警：AI批量发现黑客可利用的漏洞  
 FreeBuf   2026-04-15 04:53  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX0ibQeTjzoEYmniab0vc7MRiaCLKfBCqspyOrT1spcr431Db9TiagtE6pbUGGjklhOkX1yzhO71ia83WHiaDc7h7pj8uHhtHriaicuZKz0/640?wx_fmt=png&from=appmsg "")  
##   
  
像Anthropic旗下Mythos这样的AI模型，正以前所未有的速度发现软件漏洞，这不仅加大了小型开发者面临的风险，也让黑客能够更快地利用这些安全缺陷。  
  
  
![1776217438_69deed5e2081cadd99d87.png!small](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX3GjBM7DjwM2SNazHgxBVM2IcOKTOD8Dc0ocXUpeoAfufcfVtngWvxAy18fqibCLBJuZgunaic5yibhric9j1Bzf16ibsF6IOdJzqoQ/640?wx_fmt=jpeg&from=appmsg "")  
  
Anthropic负责评估AI风险的Frontier Red Team团队负责人洛根·格雷厄姆和组员。  
  
图片来源：HELYNN OSPINA FOR WSJ  
  
  
一个能导致防火墙、服务器和网络设备所用操作系统崩溃的软件漏洞，在潜伏超过27年后，终于在上个月被揪了出来。  
  
  
发现它的是Anthropic公司最新的AI模型Mythos。该模型的出现已让白宫、全球各地的银行高管和网络安全专业人士感到不安。  
  
  
欢迎来到“漏洞末日”(bug armageddon)时代。像Mythos这样的AI模型正以前所未有的速度发现旧版软件中的漏洞。  
  
  
虽然大多数代码问题可能并不严重，但其庞大的数量放大了一种风险：规模较小的软件开发商将被Mythos发现的这类漏洞报告彻底淹没。有了AI，黑客能够比以往任何时候都更快速地利用这些漏洞。  
  
  
这个存在于1998年版OpenBSD操作系统中的漏洞，只是Mythos上个月发现的数千个漏洞之一。Anthropic上周表示，该公司正与大约50家科技公司和组织合作，以发现并修复漏洞，目前没有向公众发布Mythos的计划。  
  
  
“我们需要确保能够安全地发布，但目前还不完全清楚如何才能满怀信心地做到这一点，”Anthropic负责评估AI风险的Frontier Red Team团队负责人洛根·格雷厄姆（Logan Graham）说。  
  
  
据一位知情人士透露，Anthropic的竞争对手OpenAI正在开展类似的活动，向开发者提供其产品的安全专用版本，以便他们在这些漏洞被犯罪分子发现之前修补系统。谷歌（Google）也表示，正在为开发者筹备一项抢先体验计划。  
  
  
Mythos的出现已促使各大公司的技术员工紧急行动起来，许多人在试图弄清这个新模型将如何颠覆网络安全格局，又会让自家产品暴露在哪些新威胁之下。  
  
  
总部位于旧金山的AI会计自动化平台Numeric最近在其网络安全Slack频道中发起了一场关于风险的讨论。一位高管写道：“嗯，这下有意思了。”  
  
  
Numeric的联合创始人安东尼·阿尔韦纳斯（Anthony Alvernaz）表示，企业面临的一些最大风险可能来自于对所谓“开源”工具的依赖。这些工具通常由志愿者协作开发，他们可能没有资源来快速处理漏洞报告。他说，这种基础设施是现代互联网运行的主要基石。  
  
  
“一家公司自己编写的代码几乎就像蛋糕的最顶层，而下面是层层叠叠的开源软件，”他说。  
  
  
当安全研究员尼尔斯·普罗沃斯（Niels Provos）听说Mythos发现了一个陈年的OpenBSD漏洞时，他心想，这会不会是自己27年前在密歇根大学（University of Michigan）攻读博士学位期间为OpenBSD编写代码时犯下的错误。他快速检查了一下，证实了自己的猜想。  
  
  
“说实话，我只觉得这事太搞笑了。因为那代码太老了，”曾担任支付公司Stripe安全主管的普罗沃斯说。“谁知道上一次有真人看过它是什么时候。”  
  
  
![1776217505_69deeda110a5d318515bb.png!small](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX1DzSeDmC6YeRM5bMt0bCbvicYuicUoiaesKcefQz8qHp3EP10YK80WWplR5WH0BhuaYA31PwH2BjKAMv422icYbw5cg4uN5L5le68/640?wx_fmt=jpeg&from=appmsg "")  
  
安全研究员尼尔斯·普罗沃斯。  
  
图片来源：THÉRÈSE PASQUESI  
  
  
普罗沃斯说，人类要发现并利用这样一个漏洞，通常需要无数小时的研究。大多数黑客甚至都不会去看普罗沃斯写的旧代码，因为他们会想当然地认为这些代码早就被筛查过漏洞了。  
  
  
“以前只有少数人能做到这一点，”他说。“现在有了这些工具，开发出真正复杂的漏洞利用程序所需要的技能门槛已经大幅降低。”  
  
  
Anthropic称，Mythos在两天内耗费了约2万美元的算力，发现了这个漏洞以及其他几十个问题。  
  
  
Anthropic还称，过去几周，Mythos在编写可利用这些漏洞的代码方面也表现得更出色。  
  
  
如今，大多数网络攻击并不涉及以前未被发现的漏洞，即所谓的“零日漏洞”(zero days)。黑客更常利用已发现的漏洞，或通过窃取登录凭证、使用社交工程技术等手段侵入公司。此外，即便一台电脑被黑客入侵，大多数公司也有其他策略来减缓网络攻击的影响。  
  
  
今年早些时候，Anthropic的软件在火狐(Firefox)浏览器中发现了100多个漏洞，它甚至能够编写代码，在该浏览器的测试版本中利用其中一个漏洞。在现实世界中，火狐浏览器有其他的安全防护措施可以阻止此类攻击，这会给现实中的黑客增加更多工作量。  
  
  
过去几个月，最新AI模型的网络安全能力已经让怀疑论者折服。他们开始担心，修补海量且不断增加的漏洞将导致前所未有的后勤挑战——这相当于AI版的“千年虫”(Y2K)问题。当年，为了修补那些无法识别2000年及以后日期的程序，全球范围内展开了一场浩大的行动。“千年虫”的警告曾十分严峻，但技术修复基本上奏效了。  
  
  
许多网络安全专业人士认为，AI“漏洞末日”可能会以类似的方式上演，但他们表示，要成功修补各类软件中成千上万的漏洞，将需要付出巨大的努力。  
  
  
包括国家网络总监肖恩·凯恩克罗斯(Sean Cairncross)在内的白宫高级官员正加紧应对Mythos等模型带来的威胁，一方面排查政府系统的薄弱环节，一方面协调私营部门的响应行动。  
  
  
投资者担心这些变化可能颠覆整个软件行业。上周，网络安全公司股价应声下跌。  
  
  
帮助企业对漏洞报告进行分类的HackerOne称，大多数公司在修补关键漏洞方面做得越来越好，但AI正导致报告的漏洞数量激增，修补各个漏洞所需的时间也越来越长。HackerOne称，与去年同期相比，漏洞提交量增加了76%，而修复一个漏洞的平均时间从160天跃升至230天。  
  
  
企业还担心，以前被忽视的技术产品现在可能成为攻击目标，而且与科技巨头不同，开发这些较不知名产品的公司或软件开发者可能没有资源来应对突如其来的大量修补工作。  
  
  
“攻击那些以前没人攻击的零散基础设施将变得容易得多，”云计算公司Fly.io的负责人、安全研究员托马斯·普塔切克(Thomas Ptacek)说。  
  
  
网络安全公司Sysdig的首席信息安全官谢尔盖·埃普(Sergej Epp)在2月份亲身体验了一番。他已有十年没尝试过寻找漏洞，但在试用Anthropic的软件时，他很快就发现了一些安全问题。  
  
  
在两周后的一个网络安全会议上，他发布了一个氛围编程网站，利用公开数据展示AI工具将新漏洞转化为可用于攻击的软件的速度有多快。他仿照《原子科学家公报》(Bulletin of the Atomic Scientists)的核毁灭警报“末日时钟”(Doomsday Clock)，将其命名为“零日时钟”(Zero-Day Clock)。  
  
  
他说，每个软件都有缺陷，当一个漏洞被发现时，黑客与试图修补漏洞的人之间就开始了一场竞赛。这是攻击者和防御者之间一场长跑竞赛。  
  
  
他说，八年前，一个漏洞从公开披露到被利用的平均时间是847天。去年，这个数字降至23天。而今年，大多数漏洞在一天之内就被利用了。  
  
  
该网站呼吁科技行业从根本上重启构建软件的方式。  
  
  
埃普说：“AI正在赋予黑客超能力，而不是防御者。”  
  
  
**参考来源：**  
  
“漏洞末日”警钟预警：AI批量发现黑客可利用的漏洞  
  
https://cn.wsj.com/articles/ai-is-finding-bugs-that-hackers-can-exploit-get-ready-for-bugmageddon-3ec670d3  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651336774&idx=1&sn=408127059513eb158f86aa2cfc845a5b&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
