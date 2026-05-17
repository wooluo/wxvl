#  OpenClaw 四漏洞链：24.5万个 AI Agent 服务器暴露在攻击之下  
原创 小A
                    小A  黑白之道   2026-05-17 00:04  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617500&idx=1&sn=73c0634d23ef9a5a7ca009cf0e3b1929&scene=21#wechat_redirect)  
> **导语**  
：2026年2月19日，单日报告23个漏洞，超过一半是严重级别。这个平台的运行日志正在成为黑客的藏宝图——API密钥、Telegram机器人令牌、私有SSH密钥、完整聊天记录，全部可以不经任何认证直接读取。安全研究者证明：一封精心构造的邮件，通过prompt injection（提示词注入），就能让这个平台的主人在毫不知情的情况下，把自己的私钥双手奉上。  
  
## 五分钟理解 Claw Chain（新手必读）  
### 什么是 OpenClaw？  
  
OpenClaw是一个开源的AI Agent（智能体）运行框架。简单说：你给它一个大语言模型（LLM）、一些工具和权限，它就能自主完成一系列任务——比如自动回复客服消息、批量处理文件、操作数据库、调用第三方API。  
  
它的危险在于：**权限极大，监管极弱。**  
 一个OpenClaw Agent通常可以读写文件系统、访问企业SaaS系统、持有API密钥和数据库凭据——而且这些操作是由AI自主决定的。  
### 四个漏洞的组合效果有多强？  
  
四个漏洞单独存在时，每一个都有一定危害。但组合在一起时，攻击者可以从一个立足点出发，同时完成四件事：  
```
立足点（恶意插件/prompt注入）    ↓窃取：偷走环境变量中的API密钥 + 通过符号链接读取系统文件提权：升级为Agent的owner级别控制权持久化：写入后门，改变未来Agent行为
```  
  
每一步都像是在"正常使用"Agent，安全日志里看不出异常。  
### 能达到什么效果？  
- 偷走所有环境变量：API密钥、数据库密码、OAuth令牌  
  
- 读取Agent本不应该访问的系统文件  
  
- 完全控制Agent的调度、配置和执行权限  
  
- 植入后门，让所有未来的Agent行为都被攻击者操控  
  
- 通过Agent已连接的SaaS系统横向移动  
  
### 谁受影响？  
  
任何在2026年4月23日之前部署的OpenClaw版本，且暴露在公网上的服务器。Shodan和ZoomEye共发现约24.5万个公网暴露实例。金融、医疗、法律行业的Agent部署风险最高——这些行业的Agent通常处理敏感客户数据（PII）和特权凭据。  
## 名词速查表  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">术语</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">英文原文</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">中文解释</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">OpenClaw（爪牙）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">OpenClaw</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">2025年底发布的开源AI Agent运行框架，原名Clawdbot。将大语言模型直接连接文件系统、SaaS应用和执行环境。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">AI Agent（智能体）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">AI Agent</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">由大语言模型驱动的自主运行程序，可以感知环境、做出决策、执行操作，无需人工逐一步骤干预。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Claw Chain（爪链）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Claw Chain</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Cyera安全研究团队为OpenClaw四个可链式漏洞起的代号，指攻击者从一个入口出发，串连利用多个漏洞完成复杂攻击。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">TOCTOU（检查时和使用时竞态）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Time-of-Check-Time-of-Use</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">在检查某个条件（如文件路径是否合法）和实际使用该条件之间，攻击者修改了条件内容。是Unix/Linux中最经典的漏洞类型之一。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">沙箱</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Sandbox</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">一种安全隔离机制，限制程序能访问的资源（文件、网络、系统调用）。OpenShell沙箱是OpenClaw的安全边界。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">prompt injection（提示词注入）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Prompt Injection</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">通过精心构造输入文本，欺骗AI模型执行攻击者意图的操作。类似于传统软件中的SQL注入，但针对的是AI的&#34;指令理解&#34;能力。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">CVE（通用漏洞披露）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Common Vulnerabilities and Exposures</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">全球通用的漏洞编号系统，每个已公开的漏洞都会分配一个CVE编号。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">CVSS（通用漏洞评分系统）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Common Vulnerability Scoring System</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">对漏洞严重程度的量化评分，范围0-10分。9.0以上为严重（Critical），7.0-8.9为高危（High）。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Cyera（喜雅）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Cyera</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">数据安全平台公司，2026年4月发现并报告了Claw Chain四个漏洞。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">SSH（安全外壳协议）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Secure Shell</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">加密远程登录协议，用于远程管理服务器。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">API密钥</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">API Key</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">程序访问第三方服务时的身份凭证，相当于&#34;密码&#34;。一旦泄露，攻击者可以以该程序的身份访问服务。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">OAuth令牌</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">OAuth Token</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">授权凭证，允许第三方应用代表用户访问资源。泄露后攻击者可 impersonate 合法用户。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">凭据</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Credentials</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">用于身份验证的所有信息，包括密码、API密钥、证书、令牌等。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">后门</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Backdoor</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">攻击者秘密植入的访问通道，允许绕过正常认证机制持续访问系统。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Shodan</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Shodan</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">互联网设备搜索引擎，可以扫描全球公网上暴露的所有联网设备和服务。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">ZoomEye（钟馗之眼）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">ZoomEye</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">国内知名互联网设备搜索引擎，类似Shodan。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">PII（个人可识别信息）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Personally Identifiable Information</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">能唯一识别个人身份的信息，如姓名、身份证号、电话号码、住址等。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">PHI（个人健康信息）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Protected Health Information</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">受保护的健康信息，如病历、诊断结果、用药记录等。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">GitHub</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GitHub</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">全球最大的代码托管平台，OpenClaw的主要代码托管地。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">GitHub Advisory（GitHub安全公告）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GitHub Advisory</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GitHub为开源项目发布的安全公告系统，GHSA是GitHub Security Advisory的编号前缀。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">prompt injection（提示词注入）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Prompt Injection</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">通过精心构造输入文本，欺骗AI模型执行攻击者意图的操作。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">插件</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Plugin</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">OpenClaw的扩展模块，为Agent增加新能力（如访问特定API、执行特定操作）。恶意插件是最常见的攻击入口。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">bearer token（持有者令牌）</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Bearer Token</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">一种API认证令牌，&#34;持有者&#34;（谁有令牌谁就是合法调用者）。</span></section></td></tr></tbody></table>## 第一章：四个漏洞，一条攻击链  
  
Cyera的研究团队发现的四个漏洞，编号CVE-2026-44112至CVE-2026-44113，CVSS评分从7.7到9.6不等。单个看每一个都有危害，组合在一起才是真正的威胁。  
### 漏洞一览  
  
**CVE-2026-44112（CVSS 9.6 · 严重）——TOCTOU文件系统写入逃逸**  
  
OpenShell沙箱内存在一个检查时间与使用时间之间的竞态条件（TOCTOU）。沙箱在检查一个写操作是否越界后，到实际执行写操作之间，攻击者可以修改目标路径，将数据写入沙箱边界之外。利用这个漏洞，攻击者可以篡改Agent配置文件，在宿主机上植入持久后门。  
  
**CVE-2026-44115（CVSS 8.8 · 高危）——执行允许列表环境变量泄露**  
  
OpenClaw有一个命令验证机制——在命令执行前检查它是否在白名单内。但验证结果和执行之间，通过heredoc（heredocument，一种shell多行文本传递语法）传递的环境变量在验证时"看起来安全"，实际执行时却被展开。攻击者可以通过未加引号的heredoc，让验证通过的"安全命令"泄露API密钥、token和凭据等环境变量。  
  
通俗理解：安检员检查你的包时，里面确实没有违禁品；但等你过了安检门，同一个人又从包里掏出了违禁品。问题出在检查和实际使用不是同一个时刻。  
  
**CVE-2026-44118（CVSS 7.8 · 高危）——MCP回环权限提升**  
  
OpenClaw信任一个客户端控制的"所有权标志"（senderIsOwner），但从未将这个标志与已认证的会话进行交叉验证。拥有合法持有者令牌（bearer token）的本地进程，可以把自己提升为owner级别，获得对Agent网关配置、定时调度和执行环境的完全控制权。  
  
**CVE-2026-44113（CVSS 7.7 · 高危）——TOCTOU文件系统读取逃逸**  
  
与CVE-2026-44112类似的竞态条件，但作用在读取操作上。攻击者可以在路径验证后、文件读取前，将合法路径替换为指向系统文件的符号链接（symbolic link），从而读取Agent本不应该访问的系统文件和内部信息。  
### 组合攻击链  
  
四个漏洞的可怕之处在于组合效果。从任意一个立足点出发，攻击者可以同时触发窃取和提权两条并行路径：  
```
立足点：恶意插件 / prompt注入 / 污染的外部输入    ↓窃取路径（并行触发）：  CVE-2026-44113 → 通过符号链接读取系统文件、凭据  CVE-2026-44115 → 通过heredoc泄露环境变量    ↓提权路径：  CVE-2026-44118 → 升级为owner，完全控制Agent    ↓持久化路径：  CVE-2026-44112 → 植入后门，修改未来Agent行为
```  
  
每一步都像是Agent的"正常工作"——因为攻击者利用的就是Agent自己的权限和操作方式。  
## 第二章：攻击入口——三种方式，一个起点  
### 入口一：恶意插件  
  
OpenClaw的插件系统允许第三方扩展Agent能力。一个精心构造的恶意插件，一旦被安装，就获得了在Agent沙箱内执行代码的权限。这是最简单、最直接的入口。  
### 入口二：prompt injection（提示词注入）  
  
这是目前AI安全领域最受关注的攻击向量之一。攻击者不需要直接访问OpenClaw的代码——只需要在某个用户输入、外部API响应或文档内容中，嵌入精心构造的prompt，让AI模型误以为这是来自"系统管理员"的指令。  
  
安全研究者已经证明：仅凭一封精心构造的邮件，就能通过prompt injection让OpenClaw在毫不知情的情况下，把私有SSH密钥发送到攻击者控制的服务器。  
### 入口三：受污染的供应链输入  
  
OpenClaw通常连接大量外部数据源——数据库、API、消息队列、文件存储。如果任何一个上游数据源被攻击者控制，注入的恶意内容就顺着数据管道进入Agent的处理流程。  
### 为什么检测这么难？  
  
传统安全工具的检测逻辑基于"异常行为"——进程不该访问某个文件，网络不该连到某个地址。但Claw Chain攻击的特殊之处在于：攻击者利用的是Agent本身的合法权限和合法操作。  
  
当Agent"正常地"读取一个文件时，安全日志显示的是正常的文件读取——你无法区分这是合法操作还是攻击者在通过Agent的手来拿文件。  
## 第三章：24.5万暴露实例  
### 扫描数据  
  
截至2026年5月，两大数据安全搜索引擎的扫描结果：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">搜索引擎</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">暴露实例数</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Shodan</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">~65,000</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">ZoomEye</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">~180,000</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">合计</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">约245,000</span></strong></td></tr></tbody></table>  
约24.5万个OpenClaw服务器暴露在公网上，没有任何认证保护。  
### 哪些行业最危险？  
  
Cyera的研究团队明确指出风险最高的行业：  
- **金融服务**  
：Agent处理交易数据、账户凭据、支付系统API  
  
- **医疗健康**  
：Agent处理PHI（个人健康信息），访问电子病历系统  
  
- **法律服务**  
：Agent处理法律文档、客户敏感信息、案件数据  
  
这些行业的共同特点是：Agent工作流处理的都是高价值敏感数据，且这些数据的泄露会带来监管处罚、声誉损失和法律责任。  
### 国内预警  
  
工信部已发布OpenClaw专项安全预警。国内安全厂商（绿盟科技、腾讯云、阿里云）均已发布技术分析文章和安全部署指南。  
## 第四章：修复与紧急响应  
### 补丁状态  
  
所有四个漏洞已在2026年4月23日由OpenClaw维护者修复，对应四个GitHub安全公告（GHSA编号）：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">CVE</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">GHSA编号</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">CVSS</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">漏洞类型</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-44112</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GHSA-5h3g-6xhh-rg6p</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">9.6</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">沙箱写入逃逸</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-44115</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GHSA-wppj-c6mr-83jj</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">8.8</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">环境变量泄露</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-44118</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GHSA-r6xh-pqhr-v4xh</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">7.8</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">权限提升</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-44113</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">GHSA-x3h8-jrgh-p8jx</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">7.7</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">沙箱读取逃逸</span></section></td></tr></tbody></table>### 紧急行动清单（24小时内）  
  
**第一步：立即打补丁。**  
 升级到2026年4月23日或之后的版本。  
  
**第二步：轮换所有凭据。**  
 假设所有环境变量和可被Agent进程访问的凭据已经泄露。API密钥、OAuth令牌、数据库密码——全部重新生成。  
  
**第三步：找出暴露实例。**  
 用Shodan搜索或内部资产盘点，找到所有暴露在公网上的OpenClaw部署，立刻加上认证或防火墙保护。  
  
**第四步：审计Agent访问范围。**  
 每个Agent能访问什么数据？能操作哪些系统？权限应该最小化，而不是默认全开。  
### 长期加固  
- 将Agent视为特权身份（service account），应用与服务账号相同的访问控制和生命周期管理  
  
- 审计所有插件和供应链输入，限制插件安装权限，新插件需要安全审查  
  
- 网络隔离：将OpenClaw部署放在独立网段，配置严格的出口控制，限制数据外传路径  
  
## 尾声：AI Agent 安全的"成人礼"  
  
OpenClaw的安全事件不是孤立的。2025年底到2026年初，短短几个月内：  
- 近1000个暴露实例被安全研究员发现，无需认证即可访问  
  
- 安全审计发现512个漏洞，其中8个高危  
  
- ClawHub技能市场36%的插件存在安全缺陷  
  
- 2月19日单日报告23个漏洞  
  
- 工信部发布专项预警  
  
这些数字说明一个事实：**AI Agent的安全模型还没有成熟**  
。开发者的注意力在功能上，不在安全上；企业的注意力在效率上，不在权限管控上；安全工具的注意力在传统IT上，不在AI自主行为上。  
  
Claw Chain是AI Agent安全的一个"成人礼"——痛苦的、昂贵的，但必要的。攻击者已经开始把AI Agent当作新的攻击面，防御方不能再假装Agent与传统软件一样安全。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617065&idx=1&sn=1e30ce488590711587c29414a82b7ab8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617222&idx=2&sn=a600c58c6ac251bf0313134ad70a4fd8&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
