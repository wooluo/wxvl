#  安全热点周报：LiteLLM 认证路径曝 SQL注入漏洞，披露 36 小时即遭定向攻击  
 奇安信 CERT   2026-04-30 08:45  
  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;border-bottom: 4px solid rgb(68, 117, 241);visibility: visible;"><th align="center" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 0px none;background: rgb(254, 254, 254);max-width: 100%;box-sizing: border-box !important;font-size: 20px;line-height: 1.2;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;color: rgb(68, 117, 241);visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;font-size: 17px;visibility: visible;"><span leaf="" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">安全资讯导视 </span></span></strong></span></th></tr><tr style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;border-bottom: 1px solid rgb(180, 184, 175);visibility: visible;"><td valign="middle" align="center" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 0px none;max-width: 100%;box-sizing: border-box !important;font-size: 14px;visibility: visible;"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;clear: both;min-height: 1em;visibility: visible;"><span leaf="" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">• </span><span leaf="">美国防部2027财年网络空间活动预算申请达205亿美元</span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;border-bottom: 1px solid rgb(180, 184, 175);visibility: visible;"><td valign="middle" align="center" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 0px none;max-width: 100%;box-sizing: border-box !important;font-size: 14px;visibility: visible;"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;clear: both;min-height: 1em;visibility: visible;"><span leaf="" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">• </span><span leaf="">上海隧道新加坡子公司发生数据泄露，甲方暂停数字系统访问权限</span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;border-bottom: 1px solid rgb(180, 184, 175);visibility: visible;"><td valign="middle" align="center" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 0px none;max-width: 100%;box-sizing: border-box !important;font-size: 14px;visibility: visible;"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;clear: both;min-height: 1em;visibility: visible;"><span leaf="" style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">• </span><span leaf="">为“干私活”删除公司超89TB的AI训练数据，一程序员获刑</span></p></td></tr></tbody></table>  
  
**PART****0****1**  
  
  
**漏洞情报**  
  
  
**1.Linux Kernel "Copy Fail"本地权限提升漏洞安全风险通告**  
  
  
4月30日，奇安信CERT监测到官方修复Linux Kernel本地权限提升漏洞(CVE-2026-31431)，该漏洞源于内核加密子系统中的一处逻辑缺陷，攻击者可以利用AF_ALG加密接口与splice()系统调用的组合，向任意可读文件的页缓存写入受控的4字节数据，从而篡改setuid程序，无需竞争条件即可直接获得root权限。目前该漏洞PoC和技术细节已公开。鉴于该漏洞影响范围较大，建议客户尽快做好自查及防护。  
  
  
**2.cPanel&WHM身份认证绕过漏洞安全风险通告**  
  
  
4月30日，奇安信CERT监测到官方修复cPanel&WHM身份认证绕过漏洞(CVE-2026-41940)，该漏洞源于登录流程中的会话加载与保存机制存在逻辑缺陷。攻击者通过Basic认证头在密码字段注入CRLF字符，并利用缺少ob（对象）部分的会话cookie避免密码编码，从而将恶意键值对写入原始会话文件。随后触发token_denied流程，使系统重新解析该文件并将注入的hasroot=1、user=root等记录提升至JSON缓存，最终绕过密码验证获得管理员权限。目前该漏洞PoC和技术细节已公开。鉴于该漏洞已发现在野利用，建议客户尽快做好自查及防护。  
  
  
**3.LiteLLM SQL注入漏洞安全风险通告**  
  
  
4月28日，奇安信CERT监测到LiteLLM SQL注入漏洞(CVE-2026-42208)在野利用，该漏洞源于代理在进行API密钥验证时，直接将调用方传入的密钥值拼接到数据库查询语句中，未使用参数化查询或安全转义。远程未认证攻击者可利用构造的Authorization头，无需权限即可执行恶意SQL指令，成功利用后可读取、篡改代理数据库数据，获取代理权限及托管的各类凭证密钥，实现未授权访问与权限提升。奇安信鹰图资产测绘平台数据显示，该漏洞关联的国内风险资产总数为6572个，关联IP总数为676个。目前该漏洞PoC和技术细节已公开。鉴于该漏洞已发现在野利用，建议客户尽快做好自查及防护。  
  
  
**4.llama.cpp远程代码执行漏洞安全风险通告**  
  
  
4月28日，奇安信CERT监测到官方修复llama.cpp远程代码执行漏洞(CVE-2026-34159)，该漏洞源于RPC后端的deserialize_tensor()函数，在处理 GRAPH_COMPUTE 消息时，当tensor的buffer字段为0时会完全跳过所有边界和有效性验证，导致攻击者可直接控制result->data指针。攻击者可结合ALLOC_BUFFER和BUFFER_GET_BASE消息实现指针泄露，绕过ASLR，最终通过构造GRAPH_COMPUTE消息实现任意内存读写，并通过函数指针劫持（如覆盖iface.clear为system()）达成远程代码执行。目前该漏洞PoC和技术细节已公开。鉴于该漏洞影响范围较大，建议客户尽快做好自查及防护。  
  
  
**PART****0****2**  
  
  
**新增在野利用**  
  
  
**1.LiteLLM SQL注入漏洞(CVE-2026-42208)******  
  
  
4月28日，报告称黑客正在利用编号为 CVE-2026-42208 的严重漏洞，攻击存储在 LiteLLM 开源大型语言模型 (LLM) 网关中的敏感信息。  
  
该漏洞是 LiteLLM 代理 API 密钥验证步骤中出现的 SQL 注入问题。攻击者无需身份验证即可利用此漏洞，只需向任何 LLM API 路由发送特制的 Authorization 标头即可。这使得攻击者能够读取代理数据库中的数据并对其进行修改。根据维护者的安全公告，攻击者可以利用此功能“未经授权访问代理及其管理的凭据”。  
  
LiteLLM 版本 1.83.7 修复了字符串连接问题，用参数化查询替换了字符串连接。LiteLLM 存储 API 密钥、虚拟密钥和主密钥以及环境/配置密钥，因此访问其数据库可以让黑客读取敏感数据，然后他们可能会利用这些数据发起进一步的攻击。  
  
LiteLLM 是一个流行的代理/SDK 中间件层，它使用户能够通过统一的 API 调用 AI 模型。该项目被 LLM 应用和多模型平台的开发者广泛使用。它在 GitHub 上拥有 4.5 万颗星和 7600 个 fork 。该项目最近还成为供应链攻击的目标，TeamPCP 黑客发布了恶意 PyPI 软件包，部署了信息窃取程序，从受感染的系统中窃取凭证、令牌和密钥。  
  
云安全公司 Sysdig 的研究人员在一份报告中称，CVE-2026-42208 漏洞的利用在4月24日该漏洞公开披露后约36小时开始。研究人员观察到蓄意且有针对性的攻击尝试，这些尝试向“/chat/completions”发送精心构造的请求，并带有恶意的“Authorization: Bearer”标头。这些请求查询了包含 API 密钥、提供商（OpenAI、Anthropic、Bedrock）凭据、环境数据和配置的特定表。虽然 36 小时不如利用Marimo 最近出现的漏洞那么快，但这些攻击是有针对性的，而且非常具体。  
  
研究人员警告称，暴露在外的 LiteLMM 实例仍在运行易受攻击的版本，应将其视为可能已被入侵，并且存储在暴露于互联网的 LiteLLM 实例中的每个虚拟 API 密钥、主密钥和提供商凭证都应该轮换。对于那些无法升级到 LiteLLM 1.83.7 及更高版本的用户，维护者建议通过在“general_settings”下设置“disable_error_logs: true”来阻止恶意输入到达易受攻击的查询的路径。  
  
  
参考链接：  
  
https://www.bleepingcomputer.com/news/security/hackers-are-exploiting-a-critical-litellm-pre-auth-sqli-flaw/  
  
  
**2.Microsoft Windows Shell 欺骗漏洞(CVE-2026-32202)******  
  
  
4月27日，微软修改了其针对 Windows Shell 的一个现已修复的高危安全漏洞的公告，承认该漏洞已被实际利用。  
  
此次涉及的漏洞为 CVE-2026-32202（CVSS 评分：4.3），这是一个欺骗漏洞，攻击者可以利用该漏洞访问敏感信息。该漏洞已在本月的微软补丁日更新中得到修复。  
  
微软在一份警报中指出，Windows Shell 中的保护机制失效，使得未经授权的攻击者能够通过网络执行欺骗操作。攻击者需要向受害者发送恶意文件，而受害者则必须执行该文件。成功利用该漏洞的攻击者可以查看一些敏感信息（保密性），但并非受影响组件中的所有资源都会泄露给攻击者。攻击者无法更改已泄露的信息（完整性）或限制对资源的访问（可用性）。微软表示已更正“可利用性指数、已利用标志和 CVSS 向量”，因为它们在4月14日发布时是错误的。  
  
虽然这家科技巨头没有透露任何有关此次漏洞利用活动的细节，但因发现并报告该漏洞的 Akamai 安全研究员 Maor Dahan 表示，这种零点击漏洞源于 CVE-2026-21510 的不完整补丁。后者已被一个名为APT28（又名 Fancy Bear、Forest Blizzard、GruesomeLarch 和 Pawn Storm）的俄罗斯国家组织利用，并与 CVE-2026-21513 一起作为漏洞利用链的一部分进行攻击。该攻击活动的目标是乌克兰和欧盟国家，目标是在2025年12月发起攻击。该活动利用恶意 Windows 快捷方式 (LNK) 文件来利用这两个漏洞，有效地绕过 Microsoft Defender SmartScreen，并使攻击者控制的代码得以执行。  
  
在全面修复尚未完全集成和部署之前，管理员应对 LNK 文件保持高度怀疑态度。鼓励组织监控与外部或未知 IP 地址的异常 SMB 连接，并确保严格执行 NTLM 保护。  
  
  
参考链接：  
  
https://thehackernews.com/2026/04/microsoft-confirms-active-exploitation.html  
  
**PART****0****3**  
  
  
**安全事件**  
  
  
**1.上海隧道新加坡子公司发生数据泄露，甲方暂停数字系统访问权限**  
  
  
4月28日Straits Times消息，新加坡陆路交通管理局（LTA）披露，负责承建裕廊区域线（JRL）三座地铁站及樟宜第三新生水厂的承包商，上海隧道工程股份（新加坡）有限公司近期发生网络安全事件。初步调查显示，涉及上述两项重点工程的相关数据遭到泄露。目前，LTA已采取预防措施，暂时关停该承包商进入官方数字系统的权限；新加坡公用事业局（PUB）称泄露内容主要为公开招标文档，暂未发现敏感数据失窃。目前，该企业正配合警方及网络安全专家的深入调查。  
  
  
原文链接：  
  
https://www.straitstimes.com/singapore/contractor-building-jrl-stations-and-newater-factory-hit-by-data-breach  
  
  
**2.斯里兰卡财政部遭网络入侵，超1800万元被窃取**  
  
  
4月23日澳媒ABC消息，亚洲岛国斯里兰卡政府表示，该国财政部计算机系统及电子邮件服务器日前遭黑客入侵。斯里兰卡财政部秘书Harshana Suriyapperuma表示，此次网络攻击导致一笔原计划用于偿还澳大利亚的债务资金被窃，损失总额超过370万美元（约合人民币1810万元）。这是该国政府历史上涉案金额最大的网络窃取案。据悉，公共债务管理办公室已有四名高级官员因此事被停职。斯里兰卡当局已寻求澳大利亚等外国执法机构协助调查。澳大利亚驻斯高级专员Matthew Duckworth表示，澳方正配合斯方就还款“异常”情况进行调查，并强调澳方将继续支持斯里兰卡实现债务可持续性。此前，斯里兰卡在2022年经济危机后曾发生债务违约，目前仍处于经济修复期。  
  
  
原文链接：  
  
https://www.abc.net.au/news/2026-04-23/hackers-steal-sri-lanka-s-debt-repayment-to-australia/106600116  
  
  
**3.因科研数据管理不当，50万英国人健康数据在阿里电商平台挂牌出售**  
  
  
4月23日卫报消息，英国科技大臣Ian Murray在下议院表示，英国生物样本库（UK Biobank）约50万名志愿者的“去标识化”健康记录，曾在阿里巴巴旗下的跨境电商平台被非法挂牌出售，但尚未发生任何交易。调查显示，有三个独立商品页在出售相关数据。经英国政府与中国政府及阿里巴巴集团沟通协调，目前所有违规数据列表已从该平台移除。英国生物样本库撤销了被认定数据来源的3家研究机构访问权限，并计划关闭三周以升级安全防范措施。  
  
  
原文链接：  
  
https://www.theguardian.com/technology/2026/apr/23/private-health-records-uk-biobank-chinese-website-alibaba  
  
  
**4.为“干私活”删除公司超89TB的AI训练数据，一程序员获刑**  
  
  
4月22日AI前哨站消息，北京市东城区人民检察院日前公布了全市首例以非法删除训练数据为手段，破坏人工智能模型的刑事案件。2024年9月，北京市东城区某科技公司算法工程师王某，为了使用公司的算力资源“干私活”，违规登录公司服务器集群，输入了行业内公认最危险、被戏称为“删库跑路代码”的删除命令。一夜之间，王某将公司AI游戏部门超过89 TB的训练数据和多个公司自主研发的文生3D AI模型全部删除。这一行为直接导致模型训练系统功能瘫痪、研发项目全部停摆，造成了20余万元的经济损失。据悉，王某在与他人沟通中，提到可以通过公司的资源来完成工作，但操作中，公司数据库处于满负荷的状态，无法再运行其他程序，王某因此删除了大量AI训练数据。后法院以破坏计算机信息系统罪，对王某判处有期徒刑五年十个月。  
  
  
原文链接：  
  
https://mp.weixin.qq.com/s/u7C-dcoTzn1vMidHMfgUHQ  
  
  
**PART****0****4**  
  
  
**政策法规**  
  
  
**1.工信部等两部门印发《关于联合实施2026年“模数共振”行动的通知》**  
  
  
4月28日，工业和信息化部、国家数据局联合印发《关于联合实施2026年“模数共振”行动的通知》，正式启动2026年“模数共振”行动，面向钢铁、石化化工、信息通信、网络安全等20个重点行业，确定一批重点城市，探索并基本形成场景、模型、智能体、数据集、案例等关键技术成果的产出路径，推动人工智能高水平赋能新型工业化。该文件提出打造“模数共振”空间，制定一套能够实现跨主体数据协同、模型共建、责任划分、安全保障的管理机制，具备跨主体数据可信贯通、模型协同训练与安全合规应用的能力。  
  
  
原文链接：  
  
https://www.secrss.com/articles/89804  
  
  
**2.美国防部2027财年网络空间活动预算申请达205亿美元**  
  
  
4月21日，美国国防部发布2027财年预算提案，计划拨款205亿美元用于网络空间活动，较2026财年的151亿美元预算增加35.7%。具体来说，相关预算将投资于网络安全、网络空间作战以及网络研发活动等三大领域，旨在防御和干扰网络攻击活动，加速向零信任网络安全架构过渡，并强化美国关键基础设施和国防工业基础合作伙伴对恶意网络攻击的防御。网络安全分项预算为121亿美元，较2026财年的91亿美元增加32.9%，重点投资于武器系统和国防关键基础设施、网络安全服务提供机构、供应链风险管理、零信任以及密码学现代化；网络空间作战分项预算为77亿美元，较2026财年的54亿美元增加42.5%，将用于加强美国的网络能力，跨领域整合，遏制并击败敌方在网络空间的行动自由，并打造可提供更强杀伤力和更佳作战效果的网络部队；网络研发分项预算为6.33亿美元，较2026财年的6.119亿美元微增3.4%，将用于部署和升级现有能力和技术，以推进下一代网络安全和网络作战工具的开发，从而增强美国防部的网络安全和网络作战项目。  
  
  
原文链接：  
  
https://www.secrss.com/articles/89725  
  
  
**3.美国空军部发布人工智能和数据战略以加速提升军事优势**  
  
  
4月20日，美国空军部发布《美国空军部人工智能战略》和《美国空军部数据战略》，明确将数据和人工智能从“辅助功能”提升为“战略优势的基础”，旨在确保美空军部在复杂安全环境下保持敏捷并领先于不断演变的威胁。《美国空军部人工智能战略》提出，实现保障现代化以适应人工智能时代，开创敏捷的网络安全和验证流程以及开发并部署先进的方法论，以确保各项能力强大可靠并能抵御新型的、人工智能特有的威胁。《美国空军部数据战略》提出，确保数据可见、可访问、可理解、互联、可信、可互操作且安全。  
  
  
原文链接：  
  
https://www.secrss.com/articles/89785  
  
  
**往期精彩推荐**  
  
  
[【已复现】Linux Kernel "Copy Fail" 本地权限提升漏洞(CVE-2026-31431)安全风险通告](https://mp.weixin.qq.com/s?__biz=MzU5NDgxODU1MQ==&mid=2247505520&idx=1&sn=782f41f065f5b44a1724fe083a86f80e&scene=21#wechat_redirect)  
  
  
[【已复现】cPanel&WHM 身份认证绕过漏洞(CVE-2026-41940)安全风险通告](https://mp.weixin.qq.com/s?__biz=MzU5NDgxODU1MQ==&mid=2247505520&idx=2&sn=17a49e5024765e8f6bd8b09c1f4719f8&scene=21#wechat_redirect)  
  
  
[今日（2026年4月29日）热点网络安全漏洞动态](https://mp.weixin.qq.com/s?__biz=MzU5NDgxODU1MQ==&mid=2247505501&idx=1&sn=e16e042def91096ee2fa2164cd09a1f3&scene=21#wechat_redirect)  
  
  
  
  
本期周报内容由安全内参&虎符智库&奇安信CERT联合出品！  
  
  
  
  
  
  
  
