#  PhantomCore 利用 TrueConf 漏洞入侵俄罗斯网络  
会杀毒的单反狗
                    会杀毒的单反狗  爱拍照的老李   2026-04-29 01:02  
  
**导****读**  
  
  
  
PhantomCore的行动凸显其复杂性，他们在某些情况下能保持隐秘长达78天，同时针对俄罗斯政府、国防和制造业等关键领域。PhantomCore的战术不仅限于TrueConf漏洞利用，还包含带有密码保护RAR压缩包的钓鱼攻击，其中包含PhantomRAT恶意软件，这与早期基于ZIP的方法有所不同。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/PaFY6wibdwyKylhiarlX1aKB3RuWFAx0tWoRl3efyuSaawP1GLsyskupA2LNJH8W0M2dJz7hFX9kPApiaVtD9ibDmEYD4Zk66u9n8u4TAqJ64mI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
一个名为 PhantomCore 的亲乌克兰黑客组织自 2025 年 9 月起，一直在利用 TrueConf 视频会议软件的漏洞入侵俄罗斯网络。  
  
  
据 Positive Technologies 的一份报告显示，攻击者利用 TrueConf Server 中三个未公开的漏洞，绕过身份验证，读取敏感文件，并远程执行任意命令。  
  
  
尽管 TrueConf 已于 2025 年 8 月 27 日发布了补丁，但该组织仍独立地对这些漏洞进行了逆向工程，在不依赖公开漏洞的情况下，对俄罗斯组织发起了广泛的攻击。  
  
  
这些漏洞包括 BDU:2025-10114 (CVSS 7.5)，这是一个访问控制不足的漏洞，允许对诸如 /admin/* 之类的管理端点发起未经身份验证的请求；BDU:2025-10115 (CVSS 7.5)，该漏洞允许任意读取文件；以及严重漏洞 BDU:2025-10116 (CVSS 9.8)，这是一个命令注入漏洞，允许执行完整的操作系统命令。  
  
  
该漏洞利用链使攻击者能够首先在易受攻击的服务器上立足，从而便于在受害者环境中横向移动和持久化。  
  
  
PhantomCore 的行动凸显了其高超的作案技巧，他们能够长时间保持隐蔽——在某些情况下甚至长达 78 天——同时攻击政府、国防和制造业等行业。  
  
  
PhantomCore 的策略不仅限于 TrueConf 漏洞利用，还结合了网络钓鱼，利用包含 PhantomRAT 恶意软件的密码保护 RAR 压缩包进行攻击，这与早期基于 ZIP 的攻击方式截然不同。  
  
  
Positive Technologies 指出，仅在 2025 年 5 月至 7 月期间，就发生了超过 180 起感染事件，高峰出现在 6 月 30 日，截至 2026 年初，至少仍有 49 台主机处于攻击者的控制之下。该组织亲乌克兰的立场与其地缘政治动机相符，在持续不断的网络间谍浪潮中，他们专注于攻击俄罗斯实体。  
  
  
如果未及时修补 TrueConf，运行该软件的组织将面临更高的风险，因为攻击者会不断改进工具以逃避检测并进行大规模攻击。  
  
  
此次攻击凸显了在敏感环境中未打补丁的协作工具的危险性，在这些环境中，私有零日漏洞可能助长国家支持的黑客行动。  
  
  
俄罗斯企业必须优先考虑漏洞管理和威胁搜寻，因为 PhantomCore 的适应性表明，威胁将持续到 2026 年。通过保持警惕，防御者可以在此类隐蔽入侵升级为数据窃取或破坏之前将其阻止。  
  
  
技术报告：  
  
https://ptsecurity.com/research/pt-esc-threat-intelligence/hiding-in-plain-sight-how-phantomcore-masks-its-activity-with-legitimate-tools/  
  
  
新闻链接：  
  
https://www.cysecurity.news/2026/04/phantomcore-exploits-trueconf-flaws-to.html  
  
![](https://mmbiz.qpic.cn/mmbiz_svg/McYMgia19V0WHlibFPFtGclHY120OMhgwDUwJeU5D8KY3nARGC1mBpGMlExuV3bibicibJqMzAHnDDlNa5SZaUeib46xSzdeKIzoJA/640?wx_fmt=svg "")  
  
**今日安全资讯速递**  
  
  
  
**APT事件**  
  
  
Advanced Persistent Threat  
  
1  
. 新的 Windows 零点击漏洞被用于绕过 Defender SmartScreen  
  
一个关键的零点击身份验证强制漏洞，编号为CVE-2026-32202，源于对Windows Shell安全功能绕过的一个不完整补丁，微软确认该漏洞正被俄罗斯APT28威胁组织积极利用。  
  
🔗  
https://cybersecuritynews.com/windows-shell-security-0-click-vulnerability/  
  
  
2. 新的 Linux FIRESTARTER 后门针对 Cisco Firepower 设备  
  
CISA 和 NCSC 警告称，基于 Linux 的后门 FIRESTARTER 针对思科 Firepower 设备，可绕过补丁，并在固件更新后仍能实现持续访问。  
  
🔗  
https://hackread.com/linux-firestarter-backdoor-cisco-firepower-devices/  
  
  
3. 新的安卓间谍软件 Morpheus 与意大利监控公司相关  
  
非营利组织Osservatorio Nessuno发现通过虚假安卓应用传播的Morpheus间谍软件，用于窃取数据，突显日益增多的隐蔽监控工具。  
  
🔗  
https://securityaffairs.com/191398/malware/new-android-spyware-morpheus-linked-to-italian-surveillance-firm.html  
  
  
4. PhantomCore 利用 TrueConf 漏洞入侵俄罗斯网络  
  
PhantomCore的行动凸显其复杂性，他们在某些情况下能保持隐秘长达78天，同时针对俄罗斯政府、国防和制造业等关键领域。PhantomCore的战术不仅限于TrueConf漏洞利用，还包含带有密码保护RAR压缩包的钓鱼攻击，其中包含PhantomRAT恶意软件，这与早期基于ZIP的方法有所不同。  
  
🔗  
https://www.cysecurity.news/2026/04/phantomcore-exploits-trueconf-flaws-to.html  
  
  
  
**一般威胁事件**  
  
  
General Threat Incidents  
  
1. VECT 2.0 网络勒索软件因设计缺陷会擦除所有数据  
  
名为VECT 2.0的网络犯罪活动由于其在Windows、Linux和ESXi变体中的加密实现存在关键缺陷，实际上更像是一种擦除工具而非勒索软件，甚至攻击者自身也无法恢复数据。VECT的锁定机制会永久破坏大文件，而不是对其进行加密。  
  
🔗  
https://thehackernews.com/2026/04/vect-20-ransomware-irreversibly.html  
  
  
2.   
ClickUp 数据泄露导致企业邮件暴露超过一年  
  
ClickUp 公共网站中的硬编码 API 密钥导致数百个企业及政府电子邮件地址暴露了一年以上。  
  
🔗  
https://www.esecurityplanet.com/threats/clickup-data-leak-exposes-enterprise-emails-for-over-a-year/  
  
  
3.   
大规模网络钓鱼活动正在悄然针对全球用户  
  
由中文语言服务支持的一波大规模网络钓鱼活动正在悄然针对全球用户，利用日常通讯应用窃取个人和财务凭证。  
  
🔗  
https://cybersecuritynews.com/chinese-backed-smishing-services-use-ott-messaging/  
  
  
4. 新型BlobPhish攻击利用浏览器Blob对象窃取用户登录凭据  
  
一个名为BlobPhish的复杂、驻留内存的网络钓鱼活动，自2024年10月起活跃，利用浏览器Blob URL API从Microsoft 365用户、主要美国银行和金融平台窃取凭证，同时几乎完全对传统安全工具保持隐形。  
  
🔗  
https://cybersecuritynews.com/blobphish-phishing-attack/  
  
  
5  
. 新的 DHL 钓鱼诈骗使用 11 步攻击链窃取密码  
  
Forcepoint旗下X-Labs报告了一种11步的DHL钓鱼诈骗，该诈骗使用伪造的OTP验证码和EmailJS来窃取用户凭据和设备遥测数据。  
  
🔗  
https://hackread.com/dhl-phishing-scam-attack-chain-steal-passwords/  
  
  
6  
. Sevii 推出网络蜂群防御模式，以大规模阻止人工智能驱动的攻击  
  
Sevii 推出了一个新的功能，旨在以机器速度和规模阻止高流量的、由人工智能驱动的网络攻击，而无需承担不可预测的人工智能标记成本。Sevii 的网络蜂群防御模式（CSD）解决了由人工智能造成的一个关键漏洞，即在大规模、由人工智能驱动的攻击洪峰期间，无法维持网络安全性能和成本效率。  
  
🔗  
https://www.helpnetsecurity.com/2026/04/28/sevii-cyber-swarm-defense-mode-csd/  
  
  
7  
. 虚假验证码诱骗实施 IRSF 欺诈和加密货币盗窃活动  
  
Infoblox 的研究揭示了一种新的欺诈操作，该操作结合了常规的网络安全部署与电信计费滥用，通过伪造的 CAPTCHA 界面导致未经授权的移动设备活动。  
  
🔗  
https://www.cysecurity.news/2026/04/fake-captcha-lures-power-irsf-fraud-and.html  
  
  
**漏洞事件**  
  
  
Vulnerability Incidents  
  
1. 关键GitHub 漏洞（CVE-2026-3854）允许远程代码执行  
  
研究人员在 GitHub 中发现了一个关键漏洞，编号为 CVE-2026-3854，可通过简单的 git push 实现远程代码执行。  
  
🔗  
https://securityaffairs.com/191434/security/cve-2026-3854-github-flaw-enables-remote-code-execution.html  
  
  
2. Hugging Face LeRobot 漏洞为远程代码执行攻击打开大门  
  
在Hugging Face的LeRobot中发现一个关键的远程代码执行（RCE）漏洞，LeRobot是一个流行的开源机器人机器学习框架。该漏洞被标记为CVE-2026-25874，最大CVSS严重性评分为9.8，允许未经身份验证的攻击者在受影响的服务器上执行任意系统命令。  
  
🔗  
https://gbhackers.com/hugging-face-lerobot-flaw/  
  
  
3. 关键 LiteLLM SQL注入漏洞在野外被利用  
  
一个关键的预认证SQL注入漏洞存在于LiteLLM中，这是一个广泛使用的开源AI网关，拥有超过22,000个GitHub星标，该漏洞正在野外被积极利用。此严重漏洞编号为CVE-2026-42208，允许未经授权的攻击者直接从平台的PostgreSQL数据库中提取高度敏感的云和AI提供商凭据。  
  
🔗  
https://cybersecuritynews.com/litellm-sql-injection-vulnerability-exploited/  
  
  
4. 微软修复 Entra ID 漏洞  
，该漏洞可导致权限提升  
  
微软修复  
Entra ID 中的一个漏洞，该漏洞可能允许攻击者接管服务帐户。此问题涉及代理 ID 管理员角色，该角色负责管理 AI 代理的身份和访问权限，并可能被滥用以提升权限。  
  
🔗  
https://securityaffairs.com/191414/security/microsoft-fixes-entra-id-flaw-enabling-privilege-escalation.html  
  
  
5. Windows 中新 PhantomRPC 权限提升漏洞无补丁  
  
一个伪造的 RPC 服务器可用于监听 RPC 请求，并伪装目标服务以将权限提升至 System。  
  
🔗  
https://www.securityweek.com/no-patch-for-new-phantomrpc-privilege-escalation-technique-in-windows/  
  
  
7. Notepad++ 漏洞允许攻击者使应用程序崩溃并泄露内存数据  
  
一个名为CVE-2026-3008的新字符串注入漏洞在Notepad++ 8.9.3版本中被发现。此关键漏洞允许攻击者使应用程序崩溃，或立即且秘密地提取敏感内存信息。  
  
🔗  
https://gbhackers.com/notepad-vulnerability-lets-attackers-crash-app/  
  
  
8. Robinhood漏洞被用于网络钓鱼攻击  
  
投资和交易平台 Robinhood 已证实，网络犯罪分子利用其账户创建过程中的漏洞发送了看似合法的网络钓鱼邮件。  
  
🔗  
https://www.securityweek.com/robinhood-vulnerability-exploited-for-phishing-attacks/  
  
****  
扫码关注  
  
军哥网络安全读报  
  
**讲述普通人能听懂的安全故事**  
  
  
