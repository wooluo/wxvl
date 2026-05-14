#  Pwn2Own被0day狂潮冲垮：一场暴露行业底层逻辑崩溃的安全危机  
原创 Night Walker
                    Night Walker  黑白之道   2026-05-14 00:33  
  
> 🌈  
> **导语**  
：2026年Pwn2Own柏林站，创下19年历史纪录——不是因为技术突破，而是因为收到的0day太多，主办方Trend Micro ZDI直接关门拒收。紧接着，被拒研究者开始批量公开漏洞，一场围绕"漏洞处理能力"的行业信心危机正在蔓延。  
  
## 事件定性：这不是新闻，是结构性崩溃  
  
本次Pwn2Own柏林站的关键词不是"黑客大赛"，而是**"挤兑"**。  
  
5月7日，注册截止。5月14日，比赛开幕。中间只有7天。而在这7天里，ZDI在过去24小时内收到超过**100份**  
参赛申请——这是该赛事举办19年来从未出现的情况。  
  
ZDI在给研究员的拒信中明确写道：  
> 🌈  
> "我们对此表示歉意，我知道大家都在准备参赛项目，但过去24小时发生的事情在Pwn2Own历史上从未有过。"  
  
  
这不是客气话。这是崩溃宣言。  
  
![漏洞处理能力与AI产出之间形成致命剪刀差](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6N8MtMSx0wPXm0HMMgJEoJ3ciafh3e0ib4CuKUtBAoicgV6FQnI30sU2th7dsboOmicc7d4xJRywiaXMqmicLFjXrKcKj95Wtt1L931Y/640?wx_fmt=png "漏洞处理能力与AI产出之间形成致命剪刀差")  
# 图片版权 华盟网  
## 爆炸半径：一场被拒，拖累整条攻击链  
  
本次事件最具戏剧性的转折，出现在ggwhyp的案例中。  
  
这位代号为ggwhyp的研究者，准备了一套完整的Firefox全链RCE漏洞链： HTML页面加载 → 触发沙盒逃逸（CVE-2026-8401） → 弹出cmd.exe → 执行calc.exe。这是一条典型展示型攻击链，技术价值极高。  
  
他原本的计划是参加Pwn2Own柏林站。但在报名截止前，他的参赛资格**被直接拒绝**  
——不是因为漏洞质量不足，而是因为"没有slot了"。  
  
于是，他直接将漏洞报告发给了Mozilla。  
  
Mozilla在极短时间内紧急发布了**Firefox 150.0.3**  
，修复了5个高危漏洞，其中4个归属ggwhyp，CVE-2026-8401（沙盒逃逸）被直接堵掉。  
  
这意味着：其他入围队伍、针对Firefox的攻击链，因为Mozilla的紧急补丁，**直接失效**  
——他们的参赛作品在一夜之间从"0day"变成了"n-day"。  
  
这不是孤例。@xchglabs准备了**86个漏洞**  
横跨PyTorch、NVIDIA、Linux KVM、Oracle、Docker、Ollama、Chroma、LiteLLM、llama.cpp，全部被拒。@FuzzingLabs的Oracle AI数据库RCE同样被拒。  
  
潘多拉魔盒打开了，但承接的容器——塌了。  
  
![Mozilla紧急发布Firefox 150.0.3](https://mmbiz.qpic.cn/sz_mmbiz_jpg/nGzNudUIJ6Nb09mCAJUJCgAZCmo1jU9aq8WJyogU1hRCokw79JicMPlzKyl3jtJRActfDzAxdWcEicaRibvjiccnq9noc0Fzs4eKBdKdTK0NbMA/640?wx_fmt=jpeg "Mozilla紧急发布Firefox 150.0.3")  
## 根源剖析：AI打开了魔盒，ZDI接不住  
  
要理解这次崩溃的底层逻辑，必须回到2026年3月ZDI发布的官方规则。  
  
今年是ZDI**首次将AI相关目标拆分为多个独立类别**  
：AI Databases（AI数据库）、Coding Agents（编程代理）、Local Inferences（本地推理）、NVIDIA产品。  
  
这一改动的背景是：2025年的Pwn2Own Vancouver，AI类目标首次引入即大获成功，奖金池总额超过**100万美元**  
。ZDI显然希望扩大战果。  
  
但他们没有预料到的是：**AI大幅降低了漏洞挖掘的门槛**  
。  
  
2025年之前，找到一个可用的浏览器0day需要数月积累。2026年，AI辅助 fuzzing工具让单个研究员在数周内就能产出数十个RCE候选。@xchglabs一人的86个漏洞储备，超过了绝大多数年份整届比赛的提交总量。  
  
这不是研究员变多了，而是**研究员的生产力发生了结构性跃升**  
。  
  
问题在于：ZDI的赛道容量、评审流程、验证机制，都是为工业时代设计的——每条漏洞需要人工验证、现场演示、评委打分，这些都不能被AI加速。  
  
**供给侧革命，遇到了需求侧的工业时代瓶颈。**  
<table><thead><tr><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">对比维度</span></section></th><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">AI驱动的研究员</span></section></th><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">ZDI处理能力</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">漏洞产出速度</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">单人可产86+个RCE</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">单届比赛几十个slot</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">验证周期</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">分钟级PoC生成</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">每条漏洞需现场演示</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">评审机制</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">自动化初步筛选</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">纯人工评委审核</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">规则弹性</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">固定赛道无法快速扩容</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">无法临时增加比赛日</span></section></td></tr></tbody></table>## 第三波冲击：90天政策正在失效  
  
这次事件更深层的冲击，在于对** Coordinated Vulnerability Disclosure（CVD）政策**的质疑。  
  
传统CVD框架的核心逻辑是：研究员发现漏洞 → 提交给厂商 → 厂商在90天内修复 → 届时公开。在此期间，漏洞被视为"责任披露"资产。  
  
但Pwn2Own的规则本质上是一个**加速版CVD拍卖行**  
：漏洞提交 → 现场演示 → 即时判定 → 奖金发放。问题在于，当提交量超过处理能力时，"先到先得"的公平性假设就直接崩溃。  
  
更严重的拷问是：**当提交本身会导致漏洞失效（因为其他研究员公开同类漏洞导致厂商紧急修复），研究员的博弈策略会彻底改变**  
。  
  
理性选择不再是"耐心等待90天"或"按规则提交参赛"，而是：**谁先公开，谁就掌握了主动权**  
。  
  
这不是道德问题，是**激励结构的失效**  
。  
  
ggwhyp选择了负责任披露（直接报告Mozilla而非公开），但他的遭遇让其他人看到了另一条路：如果按规则提交会被拒，那为什么要遵守规则？  
  
![90天CVD政策面临根本性挑战](https://mmbiz.qpic.cn/mmbiz_jpg/nGzNudUIJ6Mpay3mjKzGqRXPYJ6Y3nicdPAz1mH2gqrFFVCdC5nuLq5S9YwibehzGiahUhVCdRp1fpuvODmEkDNPXWl2UWkoibnCS5CibTsFC7f8/640?wx_fmt=jpeg "90天CVD政策面临根本性挑战")  
## 关键时间线重构  
<table><thead><tr><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">时间节点</span></section></th><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">事件</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年3月11日</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">ZDI官方宣布Pwn2Own Berlin 2026规则，首次拆分AI类别，奖金池超100万美元</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月7日</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">注册截止。ZDI在过去24小时内收到超100份申请，宣布达到容量上限</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">ggwhyp的Firefox全链RCE被拒，转向直接报告Mozilla</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月13日前后</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">Mozilla紧急发布Firefox 150.0.3，修复5个高危漏洞，CVE-2026-8401等被堵</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月14日</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">Pwn2Own Berlin 2026开幕。原定部分Firefox攻击链失效</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月19日（预告）</span></section></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">Mozilla计划从Firefox 151起每周发布安全更新（此前为月度周期）</span></section></td></tr></tbody></table>## 开放问题：行业需要什么样的漏洞处理架构？  
  
这次事件留下的不是单一问题，而是一系列需要整个行业共同回答的结构性命题：  
  
**1. 当"提交即失效"成为新常态，研究员的激励从哪里来？**  
 如果按规则提交不能获得应有回报，谁还愿意走负责任披露路径？  
  
**2. 漏洞平台需要"弹性容量"吗？**  
 传统CVD框架假设漏洞提交量可预期、可管理。AI时代这个假设已不成立。我们是否需要一套能随提交量动态调整的评审机制？  
  
**3. "比赛日"的组织形式是否已经过时？**  
 ZDI明确表示"无法增加额外的比赛日"。但当提交量是往届数倍时，固定形式的赛制是否已成为瓶颈？  
  
**4. 开源AI框架的安全责任如何分配？**  
 本次被拒漏洞中，大量针对PyTorch、Ollama、llama.cpp等开源AI项目。这类项目通常缺乏企业级安全响应能力，却承载了越来越多的AI工作负载。谁来兜底？  
## IOC摘要  
<table><thead><tr><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">类型</span></section></th><th style="background-color: rgb(255, 243, 228);font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">指标</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><strong><span leaf="">CVE</span></strong></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">CVE-2026-8401（Firefox沙盒逃逸）、CVE-2026-8390（JavaScript UAF，OpenAI AI工具发现）</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><strong><span leaf="">受影响版本</span></strong></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">Firefox &lt; 150.0.3</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><strong><span leaf="">涉及项目</span></strong></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">PyTorch、NVIDIA Container Toolkit、Linux KVM、Oracle AI DB、Docker、Ollama、Chroma、LiteLLM、llama.cpp</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><strong><span leaf="">事件时间</span></strong></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">2026年5月7日（注册截止）至5月14日（比赛开幕）</span></section></td></tr><tr><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><strong><span leaf="">处置建议</span></strong></td><td style="font-size: 0.75em;text-align: center;border: 0.13em dashed rgb(255, 235, 211);padding: 9px 12px;line-height: 22px;vertical-align: top;color: rgb(34, 34, 34);"><section><span leaf="">立即更新Firefox至150.0.3；审计AI框架API暴露面；收紧容器运行时权限策略</span></section></td></tr></tbody></table>  
**置信度**  
：高（本事件已有多个独立信息源交叉验证，多家媒体确认细节） **影响范围**  
：全球范围Pwn2Own参赛者生态，间接影响所有使用Firefox和AI框架的企业 **规避建议**  
：将AI框架纳入漏洞管理流程，缩短补丁响应窗口  
  
版权声明：本文由华盟网原创发布，转载需授权。  
  
