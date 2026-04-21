#  Windows 解除 FAT32 三十年限制，最大分区扩容至 2TB；CNVD发布上周关注度较高的产品安全漏洞| 牛览  
 安全牛   2026-04-21 04:20  
  
**点击蓝字 关注我们**  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/wKeDC5RjIzGMNwEiaMG6vALxhicyUibcRrXYzlDrDmftIXMPt35BO5yemibd4FoCXUd8YYGdf8btACePibKNXy6lrG2dHhODJRs8C3cjxEScicLeo/640?wx_fmt=png&from=appmsg "")  
  
  
新闻速览  
  
  
- CNVD发布上周关注度较高的产品安全漏洞  
  
  
- AI模型Claude Opus仅需2283美元即可将漏洞转化为利用程序  
  
- Google推出Android CLI：打通AI Agent开发链路，应用构建提速3倍  
  
  
- “删除不当内容法案”《Take It Down Act》落地在即，美国加码打击AI滥用  
  
  
- 法国国家身份系统 ANTS 遭网络攻击，1900 万公民数据疑似泄露  
  
  
- 多款串口转IP转换器存在严重漏洞，或成关键基础设施攻击入口  
  
  
- Vercel安全漏洞与Context AI黑客攻击相关，少量客户凭证遭泄露  
  
  
- Anthropic MCP 架构存在设计缺陷，可致 RCE 并冲击 AI 供应链  
  
  
- Windows 解除 FAT32 三十年限制，最大分区扩容至 2TB  
  
  
- Elon Musk拒绝配合法国调查：X平台AI生成深度伪造内容引发监管风暴  
  
  
  
  
特别关注  
  
  
**CNVD发布上周关注度较高的产品安全漏洞**  
  
国家信息安全漏洞共享平台（CNVD）近期集中收录一批 2026 年高危漏洞，覆盖境外主流软硬件与境内终端、网络设备，以权限提升、越界写入、缓冲区溢出、拒绝服务为主，威胁政企办公、虚拟化、路由与终端系统安全。  
  
  
境外厂商方面，Dell AppSync 4.6.0 存在权限分配不当漏洞（CNVD-2026-17277），可被利用提权；Microsoft Windows WinSock 辅助驱动存在类型混淆缺陷，攻击者可提升权限；IBM Aspera Console 存在拒绝服务漏洞，可致邮件服务中断；多款 Mozilla 产品存在权限提升漏洞（CNVD-2026-17001）；Microsoft Hyper-V 存在代码执行漏洞（CNVD-2026-17151），可被执行任意代码。  
  
  
境内厂商方面，Huawei HarmonyOS 与 EMUI kernel 模块存在越界写入漏洞（CNVD-2026-17176），影响数据机密性与可用性；D-Link DI-8003 存在两处缓冲区溢出漏洞（CNVD-2026-17537、17657），因参数校验不充分可触发拒绝服务；ZTE T540 路由器 Web 模块权限控制不当，存在授权问题漏洞（CNVD-2026-17181），可泄露敏感信息；Huawei HarmonyOS WEB 模块同样存在越界写入漏洞（CNVD-2026-17169），威胁系统安全。  
  
  
上述漏洞均已收录 CNVD，建议相关厂商与用户尽快核查版本、更新补丁，强化权限管控与输入校验，降低被利用风险。  
  
  
原文链接：  
  
https://www.cnvd.org.cn/webinfo/show/12296  
  
  
  
热点观察  
  
  
**AI模型Claude Opus仅需2283美元即可将漏洞转化为利用程序**  
  
近日，安全研究人员Mohan Pedhapati（Hacktron CTO）披露，其利用Anthropic的Claude Opus 4.6模型，在约20小时人工辅助下，以2283美元API成本，成功生成针对Chrome V8引擎的完整漏洞利用链。  
  
  
该实验以已公开修复的漏洞为起点，目标为嵌入旧版Chromium（版本138）的应用环境（如Discord）。研究人员向模型输入补丁差异（patch diff）和调试信息，引导其多轮迭代生成攻击代码。最终利用一个越界访问（out-of-bounds）漏洞，并结合WebAssembly相关缺陷，完成从内存读写到执行控制流劫持的完整利用链，并以“popped calc”验证攻击成功。  
  
  
整个过程消耗约23亿tokens，显示出当前大模型已具备将漏洞信息转化为可执行利用代码的能力。尽管仍需人工干预纠错，但相较传统需要数周的漏洞利用开发，该方法显著降低了时间与技术门槛。  
  
  
研究指出，AI的关键作用在于“补丁逆向自动化”：安全补丁本身成为“exploit hint”，模型可快速解析并生成攻击路径。这对依赖旧版本组件的软件生态构成现实威胁，尤其是Electron类应用（如Slack、Teams等）普遍存在“patch lag”问题。  
  
经济层面上，该攻击成本显著低于漏洞赏金（约1.5万美元）或黑市价格，意味着攻击行为具备更高性价比与可复制性。  
  
  
尽管Anthropic在后续版本（如Opus 4.7）中加入安全限制，但研究者认为，AI代码生成能力的持续提升不可逆转，未来“具备API访问能力的低技术攻击者”也可能具备漏洞利用能力。  
  
  
该事件表明，AI正加速漏洞从披露到武器化的周期，迫使安全行业重新评估补丁管理、漏洞披露和软件更新策略。防御重点需转向缩短补丁窗口、加强依赖管理以及应对AI辅助攻击的新常态。  
  
  
原文链接：  
  
https://securityaffairs.com/191018/ai/ai-model-claude-opus-turns-bugs-into-exploits-for-just-2283.html  
  
  
**“删除不当内容法案”《Take It Down Act》落地在即，美国加码打击AI滥用**  
  
2026 年 4 月 20 日，CyberScoop 报道，美国联邦贸易委员会 FTC 正扩大 AI 监管范围，准备依据《Take It Down Act》对非自愿性 AI 深度伪造内容开展执法，并重点打击利用语音克隆实施的网络诈骗。  
  
  
《Take It Down Act》允许对传播非自愿私密图像与 AI 伪造内容者追究刑责，相关移除条款将于 5 月生效，个人可提交移除通知，平台须在 48 小时内处理，否则将面临 FTC 调查与处罚。本月，美国司法部依据该法完成首例定罪，被告人利用 AI 生成深度伪造色情图片实施骚扰。FTC 已将此项执法列为优先工作，xAI 旗下 Grok 因存在批量非自愿深度伪造内容，成为潜在监管目标。  
  
  
同时，AI 语音克隆诈骗危害加剧，FBI 数据显示相关诈骗已造成近 9 亿美元损失，诈骗者常冒充亲友或政府官员实施欺诈。FTC 表示 AI 大幅降低诈骗门槛，正研究针对性管控手段，但受跨境执法与权限限制，需补充立法支持。  
  
  
FTC 强调将逐案判定深度伪造的误导性，重点规制存在虚假陈述或未披露 AI 生成的内容，并将未成年人网络保护作为核心方向。法律与监管界呼吁 FTC 出台合规指引，明确平台善意合规标准。  
  
  
原文链接：  
  
https://cyberscoop.com/ftc-ai-portolio-getting-bigger-take-it-down-voice-cloning/  
  
  
**多款串口转IP转换器存在严重漏洞，或成关键基础设施攻击入口**  
  
近日，安全研究人员披露，多款Serial-to-IP converter（串口转IP转换器）存在高危安全漏洞，可能使OT（Operational Technology）及医疗环境暴露于远程攻击之下。这类设备广泛用于将传统串行通信设备接入TCP/IP网络，是工业控制系统和医疗设备网络化的重要桥接组件。  
  
  
研究指出，受影响设备来自多家厂商，漏洞类型主要包括未授权访问（unauthenticated access）、弱身份认证以及硬编码凭证（hardcoded credentials）。攻击者无需复杂利用，即可通过网络直接访问设备管理接口，执行配置修改、数据拦截甚至设备控制等操作。  
  
  
技术细节显示，一些设备开放Telnet或Web管理端口且缺乏访问控制，允许攻击者远程登录。此外，部分产品使用默认凭证或内置账户，增加了被暴力破解或凭证复用攻击（credential reuse）的风险。一旦被利用，攻击者可横向移动（lateral movement）至内部网络，进一步威胁关键系统。  
  
  
值得注意的是，这些Serial-to-IP设备常部署于关键场景，如工业生产线、楼宇自动化系统以及医疗设备网络（如病患监护系统和影像设备）。由于其处于IT与OT交界位置，一旦被攻破，将成为攻击者进入核心环境的“跳板”。  
  
  
安全专家强调，这类设备长期存在“可见性低、补丁滞后”的问题，很多组织未将其纳入资产管理与安全监控体系，导致风险被低估。此外，在医疗环境中，设备停机或更新受限，也加剧了漏洞暴露周期。  
  
  
厂商已发布部分安全公告与补丁建议，但整体修复进展不一。建议用户立即采取缓解措施，包括禁用不必要服务、修改默认凭证、限制管理接口访问以及通过网络分段（network segmentation）隔离关键设备。  
  
  
该事件再次表明，边缘连接设备（edge connectivity devices）正成为攻击面扩展的重要来源。对于安全从业者而言，加强对OT资产的可见性与访问控制，已成为防御体系中的关键一环。  
  
  
原文链接：  
  
https://www.securityweek.com/serial-to-ip-converter-flaws-expose-ot-and-healthcare-systems-to-hacking/  
  
  
**Elon Musk拒绝配合法国调查：X平台AI生成深度伪造内容引发监管风暴**  
  
2026年4月，法国检方就社交平台X（原Twitter）涉嫌传播非法内容一案，传唤Elon Musk及前CEO Linda Yaccarino进行“自愿问询”，但双方均未出席。该调查由巴黎检察机关主导，起始于2025年1月，最初聚焦平台算法操控及数据使用问题，随后扩展至更严重的网络安全与内容合规风险。  
  
  
核心争议集中在X集成的AI聊天机器人Grok。调查显示，Grok在用户提示下可生成涉及未成年人及女性的性化深度伪造（deepfake）图像，甚至包含Holocaust denial等违法内容。 从技术角度看，这类生成依赖生成式AI与计算机视觉模型，对输入图像进行语义修改和合成，导致“非自愿图像操控”（non-consensual image manipulation）的大规模传播。  
  
  
数据层面，研究显示该类内容生成具有明显规模化特征：在高峰期，系统每小时可生成数千张性化图像，远超传统深度伪造网站总量，且其中包含疑似未成年人内容。 这直接触及欧盟《数字服务法》（DSA）对非法内容治理和平台责任的要求。  
  
  
执法层面，法国警方已对X巴黎办公室实施搜查，并联合Europol及网络犯罪部门展开取证，重点审查算法推荐机制及内容审核流程是否存在系统性缺陷。 同时，调查还涉及平台是否通过算法放大敏感内容传播，以及是否未能有效识别和下架CSAM（child sexual abuse material）。  
  
  
值得注意的是，该事件已演变为跨境监管冲突。美国司法部拒绝协助法国调查，认为其可能侵犯言论自由原则，而X方面则将调查定性为“政治动机”。  
  
  
整体来看，此案不仅是一起平台内容治理事件，更凸显生成式AI在安全、合规及算法透明性方面的系统性风险。对于网络安全从业者而言，其核心启示在于：AI生成内容（AIGC）已成为新型攻击面，平台级防护、内容检测模型及合规框架亟需同步升级。  
  
  
原文链接：  
  
https://therecord.media/elon-musk-avoids-questioning-french-police-x-images-scandal  
  
  
  
安全事件  
  
  
**法国国家身份系统 ANTS 遭网络攻击，1900 万公民数据疑似泄露**  
  
2026 年 4 月 20 日，Security Affairs 报道，法国负责身份证、护照、驾照等安全证件管理的国家机构 ANTS 官网于 4 月 15 日遭网络攻击，疑似发生大规模数据泄露，涉事数据规模最高达 1900 万条。  
  
  
法国内政部已确认事件成立，泄露数据包含公民全名、电子邮箱、手机号、出生日期、出生地、住址、账户元数据等 PII 信息，未涉及证件扫描件与账户直接登录凭证。官方已通报法国数据保护机构 CNIL、检察院及国家网络安全部门，开展溯源与影响范围调查，并强化平台防护措施。  
  
  
黑客组织 breach3d/ExtaseHunters 在黑客论坛公开宣称窃取数据，并以私下议价方式兜售 1800 万至 1900 万条用户信息，声称数据真实未篡改，支持第三方托管交易。该数据若被滥用，可引发大规模身份盗用、金融诈骗、合成身份欺诈等长期安全风险。  
  
  
目前官方尚未完全证实黑客所售数据的真实性，仅提醒用户警惕钓鱼短信、电话与邮件等后续诈骗行为。此次事件再次凸显政务身份系统作为高价值目标的安全脆弱性，对各国政务平台数据防护提出严峻挑战。  
  
  
原文链接：  
  
https://securityaffairs.com/191069/data-breach/frances-ants-id-system-website-hit-by-cyberattack-possible-data-breach.html  
  
  
**Vercel安全漏洞与Context AI黑客攻击相关，少量客户凭证遭泄露**  
  
近日，云开发平台Vercel披露一起安全事件，确认其部分内部系统访问权限被未授权获取。进一步调查显示，此次入侵与AI初创公司Context AI此前遭受的攻击存在直接关联，属于典型的供应链安全事件。  
  
  
根据披露信息，攻击源头在于Context AI员工设备被植入“infostealer”恶意软件，攻击者借此窃取了开发者凭证（developer credentials），包括访问令牌（access tokens）和会话信息。随后，这些被盗凭证被用于登录与Vercel相关的系统，实现“合法身份滥用”（valid account abuse），绕过传统身份验证机制。  
  
  
技术分析表明，攻击者并未利用Vercel自身的系统漏洞，而是通过被信任的第三方访问路径进行横向渗透（lateral movement）。一旦获取访问权限，攻击者能够访问部分内部资源，包括项目配置和部署环境信息，但目前未发现核心基础设施或生产系统被破坏的证据。  
  
  
Vercel强调，受影响范围有限，且已对相关访问令牌进行吊销（token revocation），同时加强了对异常登录行为的监测。此外，公司建议用户启用多因素认证（MFA），并定期轮换凭证，以降低类似风险。  
  
  
该事件的关键在于“凭证窃取+供应链信任”的攻击链条。infostealer恶意软件通常通过钓鱼邮件或恶意下载传播，一旦感染开发者终端，即可批量收集浏览器存储的cookie、API keys和session tokens，为攻击者提供高权限入口。  
  
  
此次Vercel事件再次凸显SaaS生态中的供应链风险：安全边界不再局限于单一平台，而是延伸至合作伙伴及其开发环境。对于安全从业者而言，加强终端防护、凭证管理以及第三方访问控制，已成为防御此类攻击的关键措施。  
  
  
原文链接：  
  
https://thehackernews.com/2026/04/vercel-breach-tied-to-context-ai-hack.html  
  
  
  
安全攻防  
  
  
**Anthropic MCP 架构存在设计缺陷，可致 RCE 并冲击 AI 供应链**  
  
近日，安全公司OX Security披露，Anthropic推出的Model Context Protocol（MCP）存在严重设计缺陷，可导致远程代码执行（RCE），影响超过20万台AI服务器及数万代码仓库，引发AI供应链安全担忧。  
  
  
MCP是Anthropic于2024年推出的开放标准，旨在让大模型通过统一接口连接外部工具、数据源和服务，目前已被多家厂商及主流AI开发框架广泛采用。  
  
  
此次漏洞的核心在于MCP官方SDK中的STDIO接口设计。该接口原用于启动本地服务并建立通信，但实际实现中会直接执行用户传入的任意操作系统命令，即使服务启动失败，命令仍可能被执行，且缺乏输入校验与安全边界隔离。  
  
  
研究人员指出，该问题并非传统编码错误，而是协议层面的架构设计缺陷，存在于Python、TypeScript、Java、Rust等多语言SDK中，任何基于MCP构建的应用都会继承该风险。  
  
  
攻击路径多样，包括未授权UI注入、Prompt Injection、绕过防护机制以及通过MCP Marketplace分发恶意组件等。研究团队已在真实企业环境中成功执行任意命令，并对6个生产平台完成验证。  
  
  
数据显示，相关生态规模巨大：涉及超过7,000台公网暴露服务器、约20万实例及数千万级SDK下载量，潜在影响覆盖LangChain、LiteLLM、LangFlow等主流工具链。  
  
  
尽管OX已披露超过10个高危CVE并推动部分项目修复，但其强调问题根源仍未在协议层解决。Anthropic方面则回应称相关行为“符合预期”，仅建议开发者谨慎使用相关功能。  
  
  
业内认为，该事件反映出AI生态快速扩张下的系统性安全缺口：当协议层设计缺陷存在时，风险会沿供应链被放大并扩散至整个AI应用体系。  
  
  
原文链接  
  
https://thehackernews.com/2026/04/anthropic-mcp-design-vulnerability.html  
  
  
  
产业动态  
  
  
**Windows 解除 FAT32 三十年限制，最大分区扩容至 2TB**  
  
数十年来，Windows 系统对 FAT32 文件系统一直存在 32GB 的人为分区上限，该限制源自上世纪 90 年代微软开发人员的临时设定，本为过渡参数却沿用至今。理论上 FAT32 本身最高可支持 2TB 分区，受界面限制，超过 32GB 的存储设备用户此前只能选用 NTFS、exFAT 格式，面向老旧设备的大容量存储卡还需借助 Rufus 等第三方工具破解限制。  
  
  
微软在最新 Windows 11 Insider Preview Build 26300.8170 版本中解除该项遗留限制，将 FAT32 最大分区容量提升至 2TB。目前该更新仅支持命令行界面操作，传统图形化格式化界面依旧保留 32GB 上限，官方后续版本预计会统一界面参数。该功能此前已于 2024 年 8 月登陆 Canary 频道，现阶段微软仍在收集用户反馈，暂未全面推送。  
  
  
此次更新具备重要实用价值。当前 NTFS 仅适配 Windows 设备，在 macOS 中只读且不兼容大量老旧外设；exFAT 虽跨平台性较好，但诸多老式相机、车载音响、电视、掌机等设备缺少对应驱动，仅原生支持 FAT32。微软移除这一人为存储壁垒，补齐了跨设备存储兼容短板，解决了老旧硬件搭配大容量存储介质的使用痛点。  
  
  
原文链接  
  
https://securityonline.info/windows-11-fat32-limit-increase-2tb-formatting/  
  
  
**Google推出Android CLI：打通AI Agent开发链路，应用构建提速3倍**  
  
国际网络安全技术媒体 SecurityOnline 发布 Google Android CLI AI Agent 开发工作流指南，面向开发者与安全从业人员提供基于 Android 系统的命令行 AI Agent 标准化开发流程，填补移动端 AIagent 工程化落地的技术空白。  
  
  
该指南以 Android 生态为基础，聚焦 CLI 模式 AI Agent 的设计、开发、调试与部署全链路，明确命令行交互、本地模型调用、权限管控、进程管理等核心技术环节，规范 AI Agent 与系统底层、应用层的交互规范，降低跨设备适配与安全合规风险。  
  
  
指南重点覆盖开发环境配置、Android SDK 集成、CLI 指令封装、AI 能力接入、异常处理、权限最小化配置等关键步骤，提供可复用的工程化模板，帮助开发者快速构建轻量、稳定、安全的终端侧 AI Agent。同时强调安全基线要求，包括输入校验、沙箱隔离、日志脱敏、权限审计等防护措施，避免因 Agent 越权、数据泄露、命令注入等问题引发安全风险。  
  
  
该工作流适用于移动安全自动化、终端运维、智能诊断等场景，为 Android 平台 AIagent 商业化落地提供标准化参考方案。  
  
  
原文链接：  
  
https://securityonline.info/google-android-cli-ai-agent-development-workflow-guide/  
  
  
  
  
  
  
  
  
**联系我们**  
  
合作电话：18610811242  
  
合作微信：aqniu001  
  
联系邮箱：bd@aqniu.com  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wKeDC5RjIzHkpyhcRgbHBZ0mdK82CnDHrnSbOMdbNPkN8MlHaWT1taNR9RGsQlyy25hpoyXU2sgWu1iazuDZFmZkibjPloJ32OnWZybgv61a8/640?wx_fmt=gif&from=appmsg "")  
  
  
  
