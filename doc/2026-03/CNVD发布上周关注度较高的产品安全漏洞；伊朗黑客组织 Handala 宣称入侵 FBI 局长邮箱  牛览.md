#  CNVD发布上周关注度较高的产品安全漏洞；伊朗黑客组织 Handala 宣称入侵 FBI 局长邮箱 | 牛览  
 安全牛   2026-03-31 04:58  
  
**点击蓝字 关注我们**  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/wKeDC5RjIzF1QNJKCCnFQS34CIaOsXw8OVf0Q87mGT5UfOG5VUOqcD6J2L2LKZgr6ibzkMvF2eJJt99Ig4ePeY648NvVjSaSJ5tCySfBtjcc/640?wx_fmt=png&from=appmsg "")  
  
  
新闻速览  
  
- CNVD发布上周关注度较高的产品安全漏洞  
  
  
- Anthropic 超强 AI 安全模型曝光 全球网络安全股集体重挫  
  
  
- 伊朗黑客组织 Handala 宣称入侵 FBI 局长 Kash Patel 个人 Gmail 邮箱  
  
  
- 加密货币成军用无人机采购新渠道 链上追踪成监管关键  
  
  
- 伊朗关联黑客瞄准能源供应链：技术渗透与舆论操控双重威胁  
  
  
- 欧盟官方网站 EuropaEU 被入侵 敏感数据面临泄露风险  
  
  
- 新型攻击链曝光：AI代码生成+ClickFix实现无感投毒  
  
  
- iOS高级攻击工具泄露：Coruna与DarkSword威胁数亿设备  
  
  
- VoidLink 新型 Linux 内核级 rootkit 曝光：伪装 AMD 驱动，可绕过主流检测  
  
  
- ShipSec Studio开源发布：为安全团队提供可编排的自动化工作流平台  
  
特别关注  
  
  
**CNVD发布上周关注度较高的产品安全漏洞**  
  
近日，CNVD发布多项国内外产品漏洞通报，涉及操作系统、数据库及网络设备等多个关键领域。漏洞类型以代码执行、命令注入、认证绕过及信息泄露为主，对企业及个人用户构成现实威胁。  
  
  
在境外厂商方面，多款Apple产品（iOS、tvOS、watchOS）存在代码执行漏洞（CNVD-2026-14497），攻击者可利用漏洞执行任意代码。同时，WebKit组件缺陷导致信息泄露漏洞（CNVD-2026-14495），可能被用于通过Safari扩展跟踪用户。IBM Db2（CNVD-2026-14675）则因查询逻辑处理不当，存在拒绝服务（DoS）风险。此外，TRENDnet TEW-657BRM路由器因setup.cgi组件缺陷存在命令注入漏洞，可被远程执行系统命令；Adobe Commerce存在授权绕过漏洞（CNVD-2026-15170），可能导致未授权访问。  
  
  
境内厂商方面，网络设备与操作系统漏洞同样突出。TOTOLINK WA300因/cgi-bin/cstecgi.cgi接口参数过滤不严，存在命令注入漏洞（CNVD-2026-15249）；ZTE MF258K Pro因目录权限配置不当，允许攻击者执行写入操作（CNVD-2026-15251）。在操作系统层面，Huawei HarmonyOS暴露认证绕过漏洞（CNVD-2026-15248）及证书管理模块数据处理缺陷（CNVD-2026-15250），均可能影响系统机密性与完整性。此外，ZTE ZXMP M721存在私钥泄露问题（CNVD-2026-15252），低权限用户即可获取通信密钥，威胁网络通信安全。  
  
  
整体来看，本次通报显示命令注入与访问控制缺陷仍为高发问题，且广泛分布于终端设备与网络基础设施。安全人员应优先关注边界设备与关键系统的补丁更新及访问控制策略，以降低被利用风险。  
  
  
原文链接：  
  
https://www.cnvd.org.cn/webinfo/show/12241  
  
  
  
热点观察  
  
  
**伊朗关联黑客瞄准能源供应链：技术渗透与舆论操控双重威胁**  
  
近日，网络安全公司Resecurity披露，一个名为Nasir Security的威胁组织正针对中东能源行业发起供应链攻击，并结合虚假信息传播扩大影响。该活动主要发生在阿联酋、阿曼、伊拉克及沙特等地区，涉及Dubai Petroleum、CC Energy Development等能源企业。  
  
  
从攻击路径来看，Nasir Security并未直接入侵能源企业核心系统，而是通过入侵其第三方供应商（如工程、建筑、安全设备厂商）获取访问权限。这类攻击利用供应链信任关系，将第三方数据包装为“直接泄露”，增加溯源难度。  
  
  
在技术层面，该组织主要采用Business Email Compromise（BEC）结合定向钓鱼（T1566）、身份冒充（T1656）以及对公网应用的利用（T0819）实现初始访问，并从配置不当的云存储中窃取数据（T1530）。 数据内容包括工程图纸、合同及风险评估报告，这些信息可被用于后续针对关键基础设施的精准打击。  
  
  
值得注意的是，该组织在数据规模上存在明显夸大行为。例如其声称窃取超过827GB数据，但实际多来源于单一供应商账户。这种“真实数据+夸大宣传”的策略，旨在制造混乱并放大心理影响。  
  
  
从整体态势看，此类行动不仅是网络攻击，更融合了宣传（propaganda）、虚假信息（misinformation）及“伪旗行动”（false flag），形成网络与认知层面的复合型威胁。研究人员指出，在当前地缘冲突背景下，IT与OT供应链正成为优先攻击目标，未来类似攻击可能持续增加。  
  
  
总体而言，Nasir Security的行动表明，能源行业需将防御重点从单一系统安全扩展至供应链安全与信息战防护，以应对日益复杂的复合型攻击模式。  
  
  
原文链接：  
  
https://securityonline.info/nasir-security-middle-east-energy-supply-chain-attack-propaganda/  
  
  
**加密货币成军用无人机采购新渠道 链上追踪成监管关键**  
  
2026 年 3 月 30 日，Chainalysis 发布报告显示，加密货币正成为现代冲突中无人机采购的重要支付手段，俄、伊等受制裁方通过区块链绕过金融限制，形成军民两用技术 + 加密支付的新型风险链路。  
  
  
商用无人机属典型军民两用技术，低成本、易获取，被大量用于战场侦察与攻击。亲俄民兵通过加密货币众筹超 830 万美元，用于采购无人机及配件；伊朗国防部出口中心 Mindex 更公开接受加密货币购买 Shahed 无人机等装备，构建抗制裁军贸体系。  
  
  
链上数据显示，俄无人机厂商 KB Vostok 的钱包呈现规律订单式交易，单笔金额匹配单机价格，资金多来自 Garantex 等俄系交易所，指向军方供应链批量采购；伊朗相关交易则与 Nobitex 交易所、IRGC 钱包存在资金关联，战时采购量显著攀升微博。  
  
  
该模式带来两大监管难题：一是第三方电商平台与厂商接受加密支付，买家身份与最终用途不透明；二是稳定币取代比特币成为主流，提升交易隐蔽性。  
  
  
报告指出，区块链的透明不可篡改特性，为溯源提供关键抓手。通过 liquidity 来源、交易金额、对手方聚类分析，可识别军方关联采购、定位供应链节点，为制裁执行、反洗钱与合规审查提供数据支撑。建议监管与企业强化链上监测，对无人机等高风险品类实施交易穿透核查，严控非法资金流向军工用途。  
  
  
原文链接：  
  
https://www.chainalysis.com/blog/cryptocurrency-drones-research/  
  
  
**iOS高级攻击工具泄露：Coruna与DarkSword威胁数亿设备**  
  
近日，TechCrunch 报道一款针对 iPhone 的高危攻击工具在网络上公开泄露，导致全球数百万台苹果手机面临未授权访问、数据窃取等严重安全风险。  
  
  
该工具属于可直接利用的实战级攻击组件，能够突破 iPhone 的系统防护，实现权限提升、隐私数据提取、设备控制等恶意操作。由于工具已完全公开，攻击者无需复杂技术即可快速用于批量攻击，威胁范围快速扩大。  
  
  
受影响设备覆盖多款主流 iPhone 机型，攻击者可通过漏洞利用、社会工程学等方式发动攻击，获取用户照片、通讯录、聊天记录、支付凭证等敏感信息，甚至实现远程锁定与操控。  
  
  
安全专家指出，此次工具泄露属于高严重性安全事件，公开化的攻击手段大幅降低攻击门槛，黑产组织可快速将其整合到自动化攻击流程中，形成大规模威胁。  
  
  
苹果方面已收到相关漏洞情报，正紧急分析影响范围并研发修复方案。建议用户立即将 iOS 系统更新至最新版本，关闭不明来源的描述文件与企业级证书，不安装非官方应用，避免连接可疑 WiFi 及点击陌生链接。  
  
  
安全厂商提醒企业与个人用户加强终端安全监测，启用双重认证，定期备份数据，防范因工具滥用导致的信息泄露与设备劫持。  
  
  
原文链接：  
  
https://techcrunch.com/2026/03/26/a-major-hacking-tool-has-leaked-online-putting-millions-of-iphones-at-risk-heres-what-you-  
  
  
安全事件  
  
  
**伊朗黑客组织 Handala 宣称入侵 FBI 局长 Kash Patel 个人 Gmail 邮箱**  
  
2026 年 3 月 27 日，伊朗政府支持的黑客组织 Handala 宣称攻破 FBI 局长 Kash Patel 的个人 Gmail 邮箱，并公开其早年照片及一批邮件文件。  
  
FBI 官方回应称，已察觉针对局长个人邮箱的恶意攻击并采取风险缓解措施，泄露信息为历史数据，不涉及政府机密。美方同时悬赏最高 1000 万美元，征集 Handala 组织相关线索。  
  
  
TechCrunch 通过邮件头信息验证与密码学签名校验，确认泄露邮件来自 Patel 的个人 Gmail 及 2014 年前后的美国司法部邮箱，文件时间截至 2019 年左右。路透社援引司法部官员消息，证实此次泄露事件属实。  
  
  
自 2026 年 2 月美以对伊朗相关冲突爆发后，Handala 大幅提升网络攻击频率，此前曾对医疗科技企业 Stryker 实施破坏性攻击，导致数万员工设备数据被清除，并公开多名以色列国防人员及防务承包商个人信息。美方此前查封该组织部分网站，但其迅速更换域名恢复上线。美国检方已正式指控伊朗情报与安全部（MOIS）运作 Handala 组织。截至发稿，Handala 与 Patel 本人均未就此事进一步回应。  
  
  
原文链接：  
  
https://techcrunch.com/2026/03/27/iranian-hackers-claim-breach-of-fbi-director-kash-patels-personal-email-account/  
  
  
**欧盟官方网站 EuropaEU 被入侵 敏感数据面临泄露风险**  
  
欧盟委员会正式确认，欧盟官方网站平台EuropaEU遭遇黑客攻击并引发数据泄露事件，相关安全事件已由欧盟官方对外公开证实。  
  
  
本次攻击直接针对 EuropaEU 平台系统，攻击者通过网络入侵手段突破平台安全防护边界，非法获取平台内部存储的部分数据资源，涉及欧盟机构相关信息与用户数据资产。欧盟委员会在声明中表示，已第一时间启动应急响应机制，联合内部安全团队与外部网络安全机构开展全面排查，锁定攻击入口与数据泄露范围。  
  
  
目前，欧盟方面未公开披露被泄露数据的具体类型、数量及受影响用户规模，但强调已采取紧急防护措施，包括暂停部分系统服务、强化访问权限管控、修补系统漏洞，防止攻击范围进一步扩大。同时，欧盟委员会已启动事件溯源与调查流程，对攻击来源、攻击手法及攻击者身份进行全面核查，后续将根据调查进展发布更新通报。  
  
  
此次 EuropaEU 平台被攻破，暴露了大型政府机构官网面临的高级持续性威胁攻击风险。作为欧盟核心官方网络平台，EuropaEU 存储大量机构办公数据与公共服务信息，此次事件对欧盟整体网络安全防御体系提出警示，也为全球政府机构、公共平台的网络安全建设敲响警钟。  
  
  
原文链接：  
  
https://www.bleepingcomputer.com/news/security/european-commission-confirms-data-breach-after-europaeu-hack/  
  
  
安全攻防  
  
  
**新型攻击链曝光：AI代码生成+ClickFix实现无感投毒**  
  
近期，安全研究人员披露了一种名为DeepLoad的新型恶意软件传播方式，该攻击结合ClickFix社会工程技术与AI生成内容，显著提升了攻击隐蔽性与成功率。其核心在于利用AI摘要或代码生成结果，将恶意指令嵌入“可信内容”中，诱导用户主动执行。  
  
  
在攻击流程上，威胁行为者首先通过提示注入（prompt injection）污染AI生成内容，使摘要或代码中夹带隐藏指令。当用户查看AI生成结果时，会看到类似“修复错误”或“验证系统”的操作提示，进而复制并执行命令。ClickFix正是利用这种“问题-解决”模式，诱导用户在终端或运行窗口中粘贴恶意代码。  
  
  
技术细节显示，这类攻击通常通过HTML隐藏内容或混淆指令，使恶意payload在AI输出中占据主导位置，同时规避传统检测机制。 一旦用户执行命令，系统会下载并运行后续载荷，例如信息窃取程序或勒索软件，从而完成入侵链条。  
  
  
研究指出，这种攻击的关键突破在于“信任转移”：用户对AI生成内容的信任，被攻击者转化为执行恶意操作的入口。相比传统钓鱼或恶意链接，该方式不依赖漏洞利用，而是直接操控用户行为。  
  
  
此外，该攻击具备高度扩展性，可通过邮件客户端、浏览器插件及生产力工具中的AI功能进行传播，影响范围广泛。由于攻击链跨越“内容生成—用户交互—系统执行”多个环节，传统安全产品难以全面覆盖。  
  
  
总体来看，DeepLoad与ClickFix的结合标志着AI安全威胁进入新阶段。专家建议，加强对AI输入与输出的上下文校验，限制高风险指令生成，并提升用户对“复制执行命令”类提示的警惕性，成为防御此类攻击的关键。  
  
  
原文链接：  
  
https://www.infosecurity-magazine.com/news/deepload-malware-clickfix-ai-code/  
  
  
**VoidLink 新型 Linux 内核级 rootkit 曝光：伪装 AMD 驱动，可绕过主流检测**  
  
2026 年 3 月 29 日，Check Point 披露新型 Linux 框架级 rootkitVoidLink，该恶意程序可伪装成 AMD 官方驱动，通过内核级与 eBPF 混合架构，实现全版本 Linux 环境持久化驻留与深度隐藏。  
  
  
VoidLink 并非单次实验性工具，已迭代至少 4 代，适配 Linux 3.10 至 5.x 全系列内核。其核心伪装手段为冒用amd_mem_encrypt合法驱动信息，伪造 AMD 官方版权声明，并通过 XOR 异或加密模块名，规避 strings、grep 等基础检测。  
  
  
技术上，VoidLink 采用内核模块 + eBPF双组件架构：内核模块通过 ftrace 劫持系统调用，隐藏进程、内核模块与敏感文件；eBPF 程序则在用户态边界篡改 Netlink 数据，绕过 ss、netstat 等工具的网络连接检测。  
  
  
该 rootkit 具备极强抗检测与抗查杀能力：通过 kprobe 绕过 5.7 + 内核符号限制，拦截 SIGKILL、SIGTERM 等全部关键终止信号，保护恶意进程不被杀死；基于 ICMP 隐蔽通道接收指令，同时支持无文件 memfd 植入场景。  
  
  
针对新型防护机制，VoidLink 针对性适配内核保护策略，采用动态符号查找兼容 GCC 编译优化改名问题，实现跨发行版稳定运行。  
  
  
安全建议：启用 Secure Boot 与内核模块签名，开启 kernel lockdown；通过 Auditd 监控 init_module、finit_module 调用；限制非特权 eBPF，使用 seccomp 或 LSM 策略管控 bpf () 调用；可通过官方 YARA 规则检测 VoidLink 相关样本。  
  
  
原文链接：  
  
https://www.securitylab.ru/news/570911.php  
  
  
产业动态  
  
  
**Anthropic 超强 AI 安全模型曝光 全球网络安全股集体重挫**  
  
2026 年 3 月 30 日，《财富》报道，全球科技巨头 Magnificent Seven 股价集体大幅回调，同时 Anthropic 泄露的超强 AI 安全模型引发网络安全板块剧烈震荡。  
  
  
Magnificent Seven 全部较 52 周高点下跌超 10% 进入回调区间，受伊朗冲突、AI 业务争议及产品不及预期影响。其中 Microsoft 较峰值跌约 32%，Meta 跌约 25%，Alphabet 跌约 15%，Nvidia 与 Amazon 年内转负。该板块 2023 至 2025 年累计涨幅显著，本轮为 AI 热潮后的明显逆转。  
  
  
网络安全领域出现重大冲击：Anthropic 内部测试的 Claude Mythos/Claude Capybara 模型泄露，其被称为网络安全能力远超现有模型，可自主挖掘漏洞、突破防御，效率大幅领先安全防护方。消息导致 CrowdStrike、Palo Alto Networks、Zscaler 等均跌超 5%，SentinelOne 跌 8%，Tenable 跌近 11%，网络安全 ETF 年内跌幅超 20%。市场担忧 AI 自主攻防能力将直接替代传统安全产品，引发需求逻辑重构。  
  
  
同期，Elon Musk 旗下 xAI 因涉非自愿私密图像与儿童不良内容遭巴尔的摩市政府起诉，其隧道项目同步被终止。此外，行业出现多项动向：Amazon 收购 Fauna Robotics，Meta 为 AI 园区新增 10 座燃气发电厂，Bluesky 推出基于 Anthropic Claude 的新产品。  
  
  
本次事件标志 AI 技术进入安全颠覆性阶段，传统网络安全防御体系面临根本性挑战，行业格局或将加速重塑。  
  
  
原文链接：  
  
https://fortune.com/2026/03/30/the-humbling-big-tech-magnificent-seven/  
  
  
新品发布  
  
  
**ShipSec Studio开源发布：为安全团队提供可编排的自动化工作流平台**  
  
ShipSec AI 发布开源安全工作流自动化平台 ShipSec Studio，旨在替代传统安全团队依赖 shell 脚本、cron 任务与零散工具的粗放模式，为安全运营构建专用编排层。  
  
  
该平台提供可视化无代码工作流构建器，安全人员无需编写粘合代码即可将安全工具串联为自动化管道，可视化流程图会被编译为专用领域语言，由独立运行时执行。平台原生集成 Subfinder、DNSX、Naabu、HTTPx 等侦察工具，以及 Nuclei、TruffleHog 用于漏洞与密钥检测。  
  
  
ShipSec Studio 具备专业编排能力，支持人工介入暂停机制，可在执行中等待运营人员审批、输入或验证后继续运行；支持嵌入 LLM 节点对工具输出进行 AI 辅助分析，并通过 MCP provider 实现标准化集成，同时支持 CRON 定时扫描与 REST API 调用。  
  
  
架构上平台分为三层：基于 NestJS 的管理层负责工作流编译、AES-256-GCM 加密的密钥管理与身份认证；基于 Temporal.io 的编排层管理状态、并发与持久化等待；无状态工作层在临时容器中执行任务并实现卷隔离。后端采用 PostgreSQL、MinIO、Redis 等组件，前端基于 React19 与 ReactFlow 实现。平台支持 AWS CloudTrail 等 MCP 服务开箱集成。  
  
  
该平台支持完全私有化部署，一行安装程序即可完成依赖配置与 Docker 启动，适配数据本地化与隔离环境需求，现已在 GitHub 免费开源。  
  
  
原文链接：  
  
https://www.helpnetsecurity.com/2026/03/30/shipsec-studio-security-workflow-automation-platform/  
  
  
  
  
  
  
  
  
**联系我们**  
  
合作电话：18610811242  
  
合作微信：aqniu001  
  
联系邮箱：bd@aqniu.com  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wKeDC5RjIzG73TxMUYUrwtpwvuDC6apYM7cbnd2w3jUIrebPlnTv0NghC93d92l7ceCibpIy1puRbTLdZTMBj75K58jTfjWBOP8YlWfkpEzg/640?wx_fmt=gif&from=appmsg "")  
  
  
