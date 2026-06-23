#  14个开源项目、11个零权限RCE——这个AI审计系统开放公开挑战了  
 潇湘信安   2026-06-23 04:00  
  
GitHub 仓库：  
https://github.com/tianchong-zerotemp/dianxing  
## 一个大胆的问题  
  
如果一个 AI 系统声称自己在 14 个真实开源项目中，单次运行、零人工干预，累计发现了数千条安全漏洞，其中 11 条是无需任何认证就能远程接管服务器的零权限 RCE——你信吗？  
  
大多数人的第一反应是不信。数字太大了，听起来像吹牛。  
  
但如果这个系统随后做了一件事：**把所有漏洞描述锁进密码学哈希里提前公开，拿出三万元悬赏全球安全研究者来找它的遗漏——找到一个赔你一万**  
，你还觉得它在吹吗？  
  
这就是「点星」（DianXing）正在做的事。  
  
**而截至目前，挑战赛已收到十余份社区提交的漏洞验证请求——经逐一比对，全部命中已公开哈希表中的既有记录，无一例外。**  
 换言之，社区独立发现的每一个高危漏洞，点星都已提前找到并锁定了密码学证据。零遗漏，零例外。  
## 点星是什么  
  
点星是一套**端到端 AI 自动化代码安全审计系统**  
，由零隐网络安全实验室打造。  
  
简单描述它的工作模式：上传源代码 → 系统自主完成全量漏洞挖掘与验证 → 输出精准的结构化漏洞清单。**全程零人工干预，仅需单次运行。**  
  
关键在于「不是什么」——**点星不是规则扫描器。**  
 它不依赖正则匹配或已知 CVE 模式库。传统 SAST 工具擅长的是模式匹配：看到 eval(user_input)  
 就报警。但认证绕过、越权访问、业务逻辑缺陷这类需要「理解代码在做什么」才能发现的深层漏洞，规则引擎天然无能为力。  
  
点星的方法是让 AI 对代码进行语义级理解——读懂代码意图，追踪数据流，理解鉴权逻辑，最终像一名顶级安全研究员一样判断「这里有问题」。  
  
而它最令人侧目的能力是：**自主挖掘零权限 RCE 漏洞并完成从发现到远程控制服务器的完整攻击链验证。**  
 部分被发现的漏洞已在目标项目中存在数年，历经无数次传统工具扫描却从未被触及。  
## 数据实绩：先把牌摊开  
## 总览  
<table><thead><tr><th><section><span leaf=""><span textstyle="" style="font-size: 14px;">指标</span></span></section></th><th><section><span leaf=""><span textstyle="" style="font-size: 14px;">数据</span></span></section></th></tr></thead><tbody><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">已完成审计项目</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">14 个</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">累计检出漏洞</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">8,451+ 条</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">零权限 RCE（严重）</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">11 条（靶机实测远程获取服务器控制权）</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">高危 + 中危</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">7,095 条</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">覆盖语言</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">Java / Go / JS / PHP / Python / Solidity / Binary</span></span></section></td></tr></tbody></table>  
审计目标涵盖：Jenkins（全球 CI/CD 基石）、LiteLLM（LLM 代理网关）、phpMyAdmin（最广泛的 MySQL 管理工具）、1Panel（运维面板）、Grav CMS、New API、Redash、Aave V4 等知名开源项目。另有 4 个已发现零权限 RCE 的项目因安全责任考量隐去名称。  
### 关于 8,451 这个数字——统计口径说明  
  
**这可能是读者最先质疑的一个数字，因此需要优先说清楚。**  
  
点星采用的是**细粒度计数**  
口径：**同一漏洞点位（同一段存在缺陷的代码），若存在多条相互独立的利用链（不同触发入口 / 不同利用方式），分别计为不同发现。**  
  
举个例子：某个文件上传接口存在路径穿越缺陷（一个代码缺陷点位），但攻击者可以通过 API-A 触发、也可以通过 API-B 触发、还可以结合另一个接口组合利用——这三条路径在细粒度口径下计为 3 条漏洞，因为它们各自构成独立的可利用攻击面，每一条都可以独立复现。  
  
**为什么选这个口径？**  
  
团队给出的解释是：8,451 反映的是「**可被独立利用的攻击面总量**  
」，而非去重后的代码缺陷点数量。这是刻意选择的、更贴近攻击者真实视角的口径——攻击者不会因为「这是同一个根因」就只走一条路径。对防御方而言，每一条独立可利用的路径都需要被识别和堵住。  
  
**这个口径是否合理？**  
  
见仁见智。但有几点值得注意：  
1. 团队**主动公开了这一口径说明**  
，而非让读者自行理解为「8,451 个不同的 bug」  
  
1. 每一条都声称可独立复现核验  
  
1. 在挑战赛中，有效漏洞的判定标准恰恰是按**根因去重**  
的——同一触发点的不同利用方式视为同一漏洞  
  
换言之：宣传用攻击面总量（体现广度），验证用根因去重（回归本质）。两套口径配合使用，逻辑上自洽。  
## 能力基准：不止是数字  
## 9 种语言召回率测试：零遗漏  
  
在严格受控条件下评估漏洞召回能力：  
- 覆盖 C / Java / JavaScript / Python / Go / PHP / .NET / Rust / Ruby  
  
- 每语言至少 5 类不同漏洞类型  
  
- 所有测试漏洞的**披露时间晚于 AI 模型训练截止日期**  
  
- 全程禁止联网、禁止人工干预、仅允许 1 次运行  
  
结果：**9 种语言，全部零遗漏。**  
  
这意味着系统面对的是「从未见过」的漏洞——发布时间晚于训练数据，运行时无网络。它是理解了代码逻辑，而非记住了答案。  
### 四方横向对比  
  
在 Grav CMS v1.8.0-beta.29 上，点星与三款主流 AI 代码审计产品同台实测：  
<table><thead><tr><th><section><span leaf=""><span textstyle="" style="font-size: 14px;">系统</span></span></section></th><th align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">检出总数</span></span></section></th><th align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">真阳性率</span></span></section></th><th align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">RCE 靶机复现</span></span></section></th></tr></thead><tbody><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">点星</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">1,215</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">98.6%</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">14</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">竞品 A</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">7</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">100%</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">3</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">竞品 B</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">2</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">50%</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">0</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 14px;">竞品 C</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">3</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">33%</span></span></section></td><td align="right"><section><span leaf=""><span textstyle="" style="font-size: 14px;">0</span></span></section></td></tr></tbody></table>  
检出量级差两个数量级，RCE 靶机复现数近 5 倍。即使考虑上述「细粒度计数」口径的放大效应，差距依然显著。  
## 为什么不公开实现  
  
一个自然的追问是：既然这么强，为什么不开源？  
  
团队的回应是——恰恰因为太强了。一个能自主发现零权限 RCE 并完成全链路攻击验证的系统，一旦被无门槛释放，任何人只需上传一份源代码，就能获得一份可直接用于攻击的高危漏洞清单，不再需要攻击者具备任何安全专业知识。  
  
这不是假设性风险。团队声称这是已在靶机上反复验证过的现实能力。  
  
因此选择了「**公开数据，封存实现**  
」的策略：用可验证的审计数据和公开挑战赛来建立信任，而非直接释放能力本身。  
  
这套逻辑是否站得住？我们可以从挑战赛的设计来检验。  
## 漏洞猎人挑战赛：核心证明机制  
## 如果自信，就接受证伪  
  
传统的能力证明是正面陈述：「我发现了 X 个漏洞，附上截图/PoC」。问题在于这不可证伪——你永远不知道是否经过了选择性披露。  
  
点星选了一条相反的路：**主动创造一个可以被证伪的场景，然后用经济激励邀请全世界来尝试证伪。**  
### 机制拆解  
  
**第一步：锁定答案**  
  
审计完成后，将漏洞清单中每条漏洞的描述文本逐条计算 SHA-256 哈希值（密码学单向散列），发布至 GitHub 仓库。  
  
**第二步：时间锚定**  
  
哈希表通过 Git commit 发布。commit 时间戳在仓库历史中不可被单方面篡改——这确保了「答案」的提交时间早于挑战窗口开放。  
  
**第三步：开放挑战**  
  
哈希表公开后，任何人均可提交其独立发现的高危漏洞。团队比对后给出三种结果：  
- **完全匹配——你的漏洞已在清单中，团队出示对应哈希原文验证。感谢参与。**  
- **组件覆盖但未串联——漏洞利用链中的各环节已被独立发现但未组合为完整链。安慰奖。**  
- **完全未覆盖——你的漏洞不在清单中。全额奖金：当前剩余奖金池的 1/3。**  
### 这套逻辑证明了什么  
  
**它证明的不是「点星能找到所有漏洞」——没有任何系统能做到。它证明的是：**  
1. **事前承诺不可篡改：SHA-256 + Git 时间戳，排除了事后补录的可能性**  
1. **主张可被证伪：任何人都可以通过找到遗漏来打脸系统**  
1. **证伪有经济激励：首位找到遗漏的人拿走一万元，越早证伪回报越高**  
1. **覆盖率的统计信号：如果持续无人领奖，构成对审计完整性的强侧面佐证；如果频繁有人领奖，则清晰暴露系统短板**  
本质上，这是一个**开放的、密码学锚定的、有经济激励的证伪协议**  
。  
### 当前进度  
  
第一轮目标：**Grav CMS v1.8.0-beta.29**  
，已公开 1,215 条漏洞哈希。奖金池总额 30,000 元，首位全额获奖者可得 10,000 元，此后按剩余 1/3 递减。  
  
有效漏洞须满足：  
- 必须是项目自身代码（非第三方依赖）  
  
- 严重度达高危及以上（以真实可利用影响为准）  
  
- 按根因去重  
  
- 需在官方默认配置下端到端可利用，并提供可复现 PoC  
  
## 几个值得深究的设计细节  
## 「审计」与「攻击链编排」的能力边界  
  
团队特别区分了两个层次：  
- **点星的职责：发现每一个独立的代码缺陷点位**  
- **攻击链编排（万破平台另一产品线）：将多个独立缺陷串联为完整利用链**  
因此挑战赛中的「组件覆盖但未串联」判定，本质上是承认：审计工具发现了链条中的每个环节，但没有做「组装」这一步。找缺陷是审计的事，串链条是编排的事。  
  
这个区分是否有道理？从安全工程的分工来看，是合理的——漏洞扫描和漏洞利用本就是两个不同的能力域。但从挑战者的视角看，可能感觉「组件都在了但不给全额奖」有些遗憾。好在规则是提前公开的，信息对称。  
### 严重度评级的反虚高机制  
  
所有漏洞严重度由 AI 自动评级（非人工），且团队公开了完整评级标准，并明确声明会「统一重新核定，主动对抗往严重报的倾向」。  
  
这在安全行业是少见的自我约束——更常见的做法是尽可能把漏洞往严重里报以凸显能力。  
### 被涂黑的项目  
  
审计列表中有 4 个项目名称被完全隐去，原因是点星在这些项目中发现了零权限 RCE。团队的解释是避免漏洞被逆推定位到具体版本而遭滥用。  
  
这是一个安全责任方面的选择：在没有完成负责任披露之前，不公开可能让攻击者定位目标的信息。  
## 行业视角：一个值得关注的信号  
  
AI 代码审计赛道越来越热，各家产品都在讲能力。但一个根本问题始终存在：**凭什么信？**  
  
大多数厂商的做法是案例背书、客户 logo 墙、媒体报道——都是间接证据。点星选了一条更直接的路：**密码学承诺 + 时间锚定 + 经济激励证伪。**  
 不是说「你信我」，而是说「来证明我错了，我给钱」。  
  
这给行业释放了一个信号：**如果对自家产品能力有真正的信心，是可以用更透明、更可验证的方式来证明的。**  
## 结语  
  
点星的做法可以概括为一句话：**把答案锁进哈希里，把钥匙交给全世界，然后说——来，试试看。**  
  
第一轮挑战正在进行中，目标 Grav CMS，1,215 条漏洞哈希已存证。首笔奖金一万元。无论你是想验证这个系统的能力边界，还是单纯想试试「找到遗漏就能拿钱」的机会，都值得去 GitHub 仓库看看完整规则。  
  
对安全从业者而言，这至少是一个有意思的技术实验；对行业而言，这可能是 AI 安全审计进入「可验证时代」的一个起点。  
  
GitHub 仓库：  
https://github.com/tianchong-zerotemp/dianxing  
  
