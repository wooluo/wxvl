#  漏洞多到"溢出"！Pwn2Own 2026被迫"闭门拒客"  
原创 360漏洞研究院
                    360漏洞研究院  360漏洞研究院   2026-05-13 08:01  
  
定于 2026 年 5 月 14 日在德国柏林OffensiveCon期间举办的Pwn2Own Berlin 2026，正面临该赛事创办 19 年来的首次“漏洞溢出”危机。这是由于全球研究人员提交的 0-day 漏洞利用链数量远超主办方 ZDI（Zero Day Initiative）的处理能力，导致大量漏洞利用链被迫拒之门外。  
  
  
**赛事火爆，Pwn2Own史上首次被迫"闭门拒客"**  
  
  
**1. 什么是Pwn2Own？**  
  
  
Pwn2Own是由趋势科技（Trend Micro）旗下ZDI主办的安全赛事。自 2007 年在加拿大温哥华的 CanSecWest 安全会议上首次举办以来，该赛事已成为安全研究人员展示零日漏洞（Zero-Day Vulnerability）挖掘与利用技术的舞台。  
  
  
Pwn2Own赛事规则非常简单：参赛者携带从未公开的0day漏洞和利用代码，在现场规定的有限时间和尝试次数内成功攻破目标产品，即可获得对应奖金和"Master of Pwn"积分荣誉。赛事中所验证的漏洞都通过ZDI的协调漏洞披露（CVD）渠道通报给相关厂商进行修复。  
  
  
**2. 覆盖范围：从浏览器到AI Agent应用**  
  
  
Pwn2Own Berlin 2026共设置31个攻击目标，总奖金池超过100万美元，是Pwn2Own史上应用目标最为丰富的一届。赛事覆盖十大类别：网络浏览器、企业应用、虚拟化与云基础设施，服务器、操作系统、容器、以及首次大规模引入，涵盖Claude Code、Ollama、vLLM、Chroma、LiteLLM、Megatron等多种AI产品的4类AI赛道。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dZ7ia5iaWFzz9icAweULBd0JwRTqmBYrpeUQebicNG7lVN0AR7BAKzYdznibUYWPsefr7GW1fkDWfHF27QHGNc4iaGefxYjQFjgbhm08DYqLj9Lwg/640?wx_fmt=png&from=appmsg "")  
  
从浏览器到数据库，从云原生到AI Agent，Pwn2Own的攻击版图几乎囊括了当前数字网络空间的每一个关键设施。这意味着，任何一个在Pwn2Own上被成功利用的漏洞，其潜在影响都可能波及全球数十亿终端用户和企业核心系统。2026年赛事首次大幅扩展AI相关类别，也反映了 AI系统正迅速成为安全研究的核心焦点，AI应用的安全性也关系到全球用户的终端安全。  
  
  
**3. "秒空"的报名表：150+研究员被拒门外**  
  
  
2026年5月7日，Pwn2Own Berlin 2026的正式报名通道关闭。但在此之前，大量安全研究人员已经收到了来自ZDI的回复："我们已达到最大容量，无法增加额外的比赛日"。这是Pwn2Own自2007年创办以来，首次因为参赛者过多而不得不拒绝带有有效漏洞利用链的报名申请。  
  
据社区追踪统计，超过150名研究人员尝试报名，部分已公开被拒人员如下：  
  
**xchglabs团队：**  
报名被拒后，向PyTorch、NVIDIA、Linux KVM、Oracle、Docker、Ollama、Chroma、LiteLLM、llama.cpp报送86个漏洞。  
  
**ggwhyp：**  
持有完整的Firefox on Windows远程代码执行全链，被拒后已公开演示视频并直接向Mozilla提交负责任披露。  
  
**anzuukino2802：**  
持有Claude Code远程代码执行利用，遭到拒绝。  
  
**desckimh：**  
持有Ollama的远程代码执行利用，同样遭到拒绝。  
  
**FuzzingLabs：**  
针对 Oracle Autonomous AI Database 的远程代码执行，但因达到注册最大容量无法报名。  
  
每一个被拒绝的提交，都代表着一个可能有效的0day远程代码执行利用链无法通过Pwn2Own提交给厂商，因赛事名额无法承载而被迫外流。  
  
  
**4. 连锁反应：批量赛前披露冲击赛事生态**  
  
  
值得一提的是，这种"赛方拒收"现象对已获准参赛的选手同样造成了影响。按照Pwn2Own的规则，已报名的漏洞必须在比赛现场的设备上成功演示才能获得奖金。而随着报名被拒绝的研究人员逐渐转向直接公开披露、上报各大厂商或提交至PSIRT等渠道，已经报名成功的参赛选手持有的漏洞就有可能在赛前被补丁修复。  
  
  
一旦补丁在比赛日前推送，已获准参赛的选手精心准备数周甚至数月的漏洞利用链将在现场演示时"失效"，此前的所有投入将化为泡影。比如Firefox在5月12日推出的最新150.0.3版本的补丁修复，就让如**Qrious Secure**  
团队、**crixer**  
等已经成功报名参赛的选手遗憾退赛。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dZ7ia5iaWFzz91Xa8nVnzU4EgY4WgnH03o6XjLTJicJWhriaWxb7lfs4iaHjz5Wof54xq3XcXan7g5CiaJtN44GdUr3eA9A4GolwwrkElLhA7BbWU/640?wx_fmt=png&from=appmsg "")  
  
  
**5. 结构性瓶颈：从"找漏洞难"到"审漏洞难"**  
  
  
Pwn2Own Berlin 2026以容量已满为由宣布停止接收新申请，并非单纯因为报名人数多，也有每支队伍提交的漏洞数量超出了往届平均数量的因素。该赛事主要受限于场地、调试设备和厂商到场人员，并且赛事日程固定为3日，无法延长。赛事在开赛前宣布停止接收申请，也表明主办方在容量规划上预留了明确边界。  
  
  
过去，打磨一条稳定的0-day利用链动辄数月，参赛团队通常只带一两个核心项目。现在，AI显著改变了挖掘成本：从年初以Opus 4.6为代表的各类大模型展现出的深层逻辑分析力，到Theori团队通过 AI 辅助在1小时内定位的『Copy Fail』漏洞，都证明研究效率发生了质变，漏洞产出更加容易。  
  
  
漏洞数量的增长给赛事评审环节造成了直观的压力。以前一场比赛验证的漏洞数量不会超过3位数，而现在参赛成员共携带百余枚漏洞入场，评审团队的工作量将迅速增长。漏洞发现端已实现“人机协作”提速，而漏洞评审端却仍依赖专家纯手工整理和核验，两者的效率落差正在不断拉大。  
  
  
Pwn2Own Berlin 2026的"闭门拒客"事件，表面是一次赛事运营的技术性溢出，实质是整个网络安全行业面对AI时代漏洞发现速度飙升的结构性预警。当Copy Fail用一小时宣告AI挖洞进入"小时级别"的博弈时代，当150余名研究人员因赛事装不下而被拒之门外，当每一个被拒绝的0day都可能通过非受控渠道流入公开领域——我们不得不重新审视一个根本性问题：防御体系的设计假设，是否仍然匹配攻击侧的能力进化速度？  
  
  
AI正在制造新的安全代差，而缩小这一代差，需要的是从漏洞挖掘智能体、自动化响应体系到全行业协同机制的系统性升级。毕竟，在这个漏洞发现以小时计数、武器化以天计数的新时代，"来不及"的代价，可能比以往任何时候都更加沉重。  
  
  
参考来源：  
  
**Pwn2Own 2026 Capacity Overflow, Hackers Drop 0-Days Solo**  
  
https://awesomeagents.ai/news/pwn2own-berlin-2026-capacity-overflow/  
  
**Pwn2Own Berlin 2026 Rules**  
  
https://www.zerodayinitiative.com/Pwn2OwnBerlin2026Rules.html  
  
  
  
“扫描下方二维码，进入公众号粉丝交流群。更多一手网安资讯、漏洞预警、技术干货和技术交流等您参与！”  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/5nNKGRl7pFgrNicMticDTWVCUWbOwRuWcrYSpAlwDRibKNLbe3KialEfR0Y2PlPAvS4MN50asXETicAviaRy1gRicI2Dw/640?wx_fmt=gif&from=appmsg "")  
  
  
  
“洞”悉网络威胁，守护数字安全  
  
  
**关于我们**  
  
  
360 漏洞研究院，隶属于360数字安全集团。其成员常年入选谷歌、微软、华为等厂商的安全精英排行榜, 并获得谷歌、微软、苹果史上最高漏洞奖励。研究院是中国首个荣膺Pwnie Awards“史诗级成就奖”，并获得多个Pwnie Awards提名的组织。累计发现并协助修复谷歌、苹果、微软、华为、高通等全球顶级厂商CVE漏洞3000多个，收获诸多官方公开致谢。研究院也屡次受邀在BlackHat，Usenix Security，Defcon等极具影响力的工业安全峰会和顶级学术会议上分享研究成果，并多次斩获信创挑战赛、天府杯等顶级黑客大赛总冠军和单项冠军。研究院将凭借其在漏洞挖掘和安全攻防方面的强大技术实力，帮助各大企业厂商不断完善系统安全，为数字安全保驾护航，筑造数字时代的安全堡垒。  
  
  
