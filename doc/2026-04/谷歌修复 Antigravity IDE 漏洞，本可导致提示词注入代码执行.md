#  谷歌修复 Antigravity IDE 漏洞，本可导致提示词注入代码执行  
Ravie Lakshmanan
                    Ravie Lakshmanan  代码卫士   2026-04-22 10:23  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
****  
**网络安全研究人员在谷歌的代理型 IDE Antigravity中发现了一个漏洞，可用于实现代码执行。**  
  
  
  
该漏洞已被修复，它利用Antigravity所允许的文件创建能力，并结合原生文件搜索工具 find_by_name 中输入清理不充分的问题，绕过该程序的“严格模式”。“严格模式”是一种限制性安全配置，用于限制网络访问、防止对工作区外的文件进行写入，并确保所有命令都在沙箱环境中运行。  
  
Pillar Security 公司的研究员 Dan Lisichkin 在一篇分析文章中指出：“通过在 find_by_name 工具的 Pattern 参数中注入 -X (exec-batch) 标志，攻击者可以强制 fd 对工作区文件执行任意二进制程序。结合 Antigravity 允许创建文件这一行为，便可形成完整的攻击链：先植入恶意脚本，再通过看似合法的搜索触发它，一旦提示注入成功，整个过程无需用户进一步交互。”  
  
该攻击利用了以下事实：find_by_name 工具调用会在严格模式相关约束生效之前执行，并被解释为原生工具调用，从而导致任意代码执行。尽管 Pattern 参数本意是接收文件名搜索模式，通过 fd 工具在 find_by_name 中触发文件和目录搜索，但由于缺乏严格的输入校验，输入内容会直接传递给底层的 fd 命令，从而造成安全风险。因此，攻击者可以利用这一行为植入恶意文件，并在 Pattern 参数中注入恶意命令，以触发载荷执行。  
  
Lisichkin解释道：“这里的关键标志是 -X (exec-batch)。当传递给 fd 时，该标志会针对每个匹配的文件执行指定的二进制程序。通过构造 -Xsh 这样的 Pattern 值，攻击者可以使 fd 将匹配的文件传递给 sh 作为 shell 脚本执行。”  
  
此外，该攻击还可通过间接提示注入发起，无需攻陷用户账户。在这种方式中，受害用户在不知情的情况下从不可信来源拉取了一个看似无害的文件，但实际上该文件中隐藏了受攻击者控制的注释，使人工智能代理植入并触发漏洞利用代码。  
  
谷歌在2026年1月7日收到负责任的披露后，已于2月28日修复该漏洞。  
  
Lisichkin 表示：“当工具的输入未经过严格验证时，原本为受限操作设计的工具就会成为攻击向量。支撑安全假设的信任模型即人类会发现可疑之处，在自主代理遵循外部内容指令时并不成立。”  
  
这一发现恰逢多个AI驱动工具中若干现已修复的安全漏洞被披露，包括：  
  
- Anthropic Claude Code 安全审查、Google run-gemini-cli（原 Gemini CLI Action）以及 GitHub Copilot Agent 均被发现存在通过 GitHub 评论进行的提示注入漏洞，攻击者可将拉取请求标题、议题正文和议题评论转化为攻击向量，用于窃取 API 密钥和令牌。该提示注入攻击代号为“Comment and Control”，其武器化利用了 AI 代理的高权限及其处理不可信用户输入以执行恶意指令的能力。  
  
- 发现该漏洞的安全研究员 Aonan Guan 表示：“该模式很可能适用于任何摄取不可信 GitHub 数据、并能访问与生产密钥在同一运行时环境中的执行工具的 AI 代理——并且不限于 GitHub Actions，任何处理不可信输入并具备工具和密钥访问权限的代理（如 Slack 机器人、Jira 代理、邮件代理、部署自动化系统）都可能受影响。注入表面不同，但模式相同。”  
  
- 思科发现的 Claude Code 中的另一个漏洞能够污染该编码代理的记忆，并在每个项目、每个会话中维持持久性，甚至在系统重启后依然有效。该攻击本质上利用软件供应链攻击作为初始访问向量，启动恶意载荷，从而篡改模型的记忆文件以达到恶意目的（例如，将不安全实践描述为必要的架构要求），并在用户的 shell 配置中附加一个 shell 别名。  
  
- AI 代码编辑器 Cursor 被指存在一个名为“NomShub”的严重的“离地 (LotL)”漏洞链，恶意仓库可通过间接提示注入、利用 shell 内置命令（如 export 和 cd）实现的命令解析器沙箱逃逸，以及 Cursor 的内置远程隧道，在开发者于 IDE 中打开该仓库时悄然劫持其机器，授予攻击者持久的、未被检测到的 shell 访问权限。  
  
- 一旦获得持久访问权限，攻击者可以连接到该机器，而无需再次触发提示注入或引发任何安全告警。由于 Cursor 是一个经过签名和公证的合法二进制文件，攻击者可以不受限制地访问底层主机，获得完整的文件系统访问和命令执行能力。  
  
- Straiker 公司的研究员 Karpagarajan Vikkii 和 Amanda Rousseau 表示：“人类攻击者需要组合多个漏洞并维持持久访问，而 AI 代理则自主完成这一过程，将注入的指令当作合法的开发任务来执行。”  
  
- 名为“ToolJack”的新型攻击允许本地攻击者操纵 AI 代理对其环境的感知，并破坏工具的“真实情况”，从而产生非预期的下游影响，包括数据投毒、伪造的商业智能以及虚假的推荐。  
  
- Preamble 研究员 Jeremy McHugh 表示：“如果说 MCP Tool Shadowing 是投毒工具描述以影响代理在多个服务器上的行为，ConfusedPilot 是污染 RAG 检索池，那么 ToolJack 则作为实时基础设施攻击，直接作用于通信通道本身。它不等待代理有机地遇到投毒数据，而是在执行过程中合成一个虚构的现实，表明攻破协议边界即可控制代理的整个感知。”  
  
- 研究人员在 Microsoft Copilot Studio（又称 ShareLeak，CVE-2026-21520，CVSS 评分：7.5）和 Salesforce Agentforce（又称 PipeLeak）中发现了严重的间接提示注入漏洞，攻击者可分别通过外部 SharePoint 表单或简单的表单提交线索来窃取敏感数据。  
  
- Capsule Security 公司研究员 Bar Kaduri 在谈及 CVE-2026-21520 时表示：“该漏洞利用了输入清理缺失以及系统指令与用户提供数据之间隔离不足的问题。”PipeLeak 与 ForcedLeak 类似，系统将面向公众的线索表单输入视为受信指令，从而允许攻击者嵌入恶意提示，覆盖代理的预期行为。  
  
- 研究人员在 Claude 中发现了三个漏洞，当在名为“Claudy Day”的攻击中组合利用时，攻击者可悄然劫持用户的聊天会话，并通过一次点击窃取敏感数据。该攻击流程无需额外的集成、工具或模型上下文协议服务器。  
  
- 该攻击通过在构造的 Claude URL（“claude[.]ai/new?q=...”）中嵌入隐藏指令，并将其封装在 claude[.]com 上的一个开放重定向中以使其看起来合法，然后将其作为看似正常的 Google 广告投放。一旦用户点击该广告，攻击即被触发，受害者被静默重定向到包含隐形提示注入的构造 URL“claude[.]ai/new?q=...”。  
  
- Oasis Security 公司的研究人员表示：“结合 Google Ads（通过主机名验证 URL），攻击者可以投放一个显示受信 claude.com 网址的搜索广告，点击后受害者会被静默重定向到注入 URL。这不是钓鱼邮件，而是一条与真实结果无法区分的 Google 搜索结果。”  
  
  
  
在上周发布的研究中，Manifold Security 公司还披露了一个基于 Claude 的 GitHub Actions 工作流（“claude-code-action”）如何仅通过两条 Git 配置命令，利用伪造的可信开发者身份，被诱骗批准并合并包含恶意代码的拉取请求。该攻击的核心在于将 Git 的 user.name 和 user.email 属性设置为某知名开发者（本案例中为 AI 研究员 Andrej Karpathy）的信息。当 AI 系统将此元数据欺骗视为可信信号时，便会产生安全问题。攻击者可利用这种未经验证的元数据，诱使 AI 代理执行非预期的操作。  
  
研究人员 Ax Sharma 和 Oleksandr Yaremchuk 表示：“在首次提交时，Claude 将该 PR 标记为需人工审查，并指出仅凭作者声誉不足以作为批准依据。但重新打开并再次提交同一个 PR 后，它便获得了批准。AI 在重试时推翻了自己原本更合理的判断。这种非确定性正是问题所在。你无法在一个会改变想法的系统上建立安全控制。”  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[数千个谷歌云公共API密钥启用 Gemini API 后遭暴露](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525264&idx=2&sn=a57283d8231801d9e9e1f0fd7ddcbab2&scene=21#wechat_redirect)  
  
  
[Vertex AI 漏洞暴露谷歌云数据和非公开制品](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525630&idx=1&sn=c92b1cfa77120afb058a49b0490a079b&scene=21#wechat_redirect)  
  
  
[谷歌修复已遭利用的两个新 0day](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525415&idx=1&sn=55278f01895a398c324b6e1d68a3202d&scene=21#wechat_redirect)  
  
  
[谷歌 Gemini 提示注入漏洞可用于暴露私有日历数据](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524925&idx=2&sn=f89ae14d71d858aa5b0a3b1ba66faf9d&scene=21#wechat_redirect)  
  
  
[谷歌Gemini Enterprise存在漏洞，可导致企业数据遭暴露](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524630&idx=2&sn=be82a743b4b79c2cc101a8757cb82cc4&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://thehackernews.com/2026/04/google-patches-antigravity-ide-flaw.html  
  
  
题图：Pixa  
bay Licens  
e  
  
  
**本文由奇安信编译，不代表奇安信观点。转载请注明“转自奇安信代码卫士 https://codesafe.qianxin.com”。**  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSf7nNLWrJL6dkJp7RB8Kl4zxU9ibnQjuvo4VoZ5ic9Q91K3WshWzqEybcroVEOQpgYfx1uYgwJhlFQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSN5sfviaCuvYQccJZlrr64sRlvcbdWjDic9mPQ8mBBFDCKP6VibiaNE1kDVuoIOiaIVRoTjSsSftGC8gw/640?wx_fmt=jpeg "")  
  
**奇安信代码卫士 (codesafe)**  
  
国内首个专注于软件开发安全的产品线。  
  
   ![](https://mmbiz.qpic.cn/mmbiz_gif/oBANLWYScMQ5iciaeKS21icDIWSVd0M9zEhicFK0rbCJOrgpc09iaH6nvqvsIdckDfxH2K4tu9CvPJgSf7XhGHJwVyQ/640?wx_fmt=gif "")  
![]( "")  
  
   
觉得不错，就点个 “  
在看  
” 或 "  
赞  
” 吧~  
  
