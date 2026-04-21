#  Vercel供应链攻击事件深度分析：第三方AI工具成为企业安全突破口  
原创 威胁情报中心
                    威胁情报中心  奇安信威胁情报中心   2026-04-21 02:04  
  
## 事件概述  
  
2026年4月19日，全球主流云部署平台Vercel发布官方安全公告，披露其内部系统遭受未授权访问。初步调查显示，攻击者通过攻陷一个拥有数百名用户的第三方AI工具（后确认为Context.ai）的Google Workspace OAuth应用程序，成功突破Vercel安全边界，获得内部系统访问权限。  
  
这并非一次简单的凭证泄露事件。随着多源情报的交叉验证，此次攻击的真正源头是一名Context.ai员工于2026年2月感染了Lumma信息窃取器。该员工在受感染设备上搜索并下载Roblox游戏作弊程序时，触发了典型的信息窃取器传播链。恶意软件成功窃取了包括Google Workspace、Supabase、Datadog和Authkit在内的多项企业服务凭据，其中部分凭据直接关联Vercel管理权限。  
  
威胁行为组织ShinyHunters随后在BreachForums平台发帖，声称以200万美元出售包含内部数据库、访问密钥、源代码、员工账户、API密钥、NPM令牌和GitHub令牌等数据，并提供约580条员工数据记录作为泄露凭证。Vercel CEO Rauch公开表示攻击者“高度复杂”，并指出攻击者可能利用AI能力加速入侵进程。  
  
## 攻击链路与技术分析  
### 初始渗透路径  
  
攻击链路呈现典型的“第三方→目标”的供应链攻击模式，具体可分为三个阶段：  
  
**第一阶段：信息窃取器感染（2026年2月）**  
  
攻击者通过黑产渠道获取Lumma信息窃取器，并通过游戏作弊程序捆绑方式投递。Context.ai一名员工在日常工作设备上搜索并下载Roblox作弊程序时，成功触发感染链。Lumma作为活跃的maas（恶意软件即服务）产品，具备完整的日志回传、屏幕截图、浏览器凭据抓取和加密货币钱包扫描能力。  
  
**第二阶段：凭据窃取与武器化**  
  
受感染设备上的浏览器凭据被完整提取，包括Google Workspace、Supabase、Datadog和Authkit的服务密钥。攻击者获取了support@context.ai账户的完整访问权限，该账户具备对Vercel管理端点的直接访问能力。  
  
**第三阶段：初始访问与权限维持**  
  
利用窃取的OAuth访问令牌，攻击者绕过Vercel的正常认证流程，伪装成合法第三方服务访问内部环境。攻击者成功枚举了未被标记为敏感的环境变量，由于Vercel仅对明确标记为"sensitive"的环境变量实施静态加密，非敏感变量处于明文存储状态，攻击者借此实现信息外泄。  
  
### 战术技术映射  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">战术阶段</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术编号</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术名称</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">具体表现</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">初始访问</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1078.004</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">有效账户：云账户</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用窃取的Google Workspace OAuth应用凭据访问Vercel内部系统</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">防御规避</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1550.001</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">使用替代认证材料：应用访问令牌</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">使用合法的OAuth访问令牌绕过认证机制，实现隐身访问</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">凭证访问</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1555.001</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">凭证来自密码库</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">信息窃取器从浏览器和系统提取存储凭据</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">数据外泄</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1041</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">通过C2通道外泄数据</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">威胁行为体将窃取数据打包并在黑市出售</span></section></td></tr></tbody></table>###   
### 环境变量管理的安全盲区  
  
Vercel在此次事件中暴露了一个关键的安全设计缺陷：仅对标记为"sensitive"的环境变量执行服务端静态加密。这一设计假设所有敏感配置都会被开发人员主动标记，但实际上大量包含内部访问密钥、集成token和配置参数的变量处于未保护状态。  
  
攻击者正是利用这一盲区，通过读取未加密的环境变量获取进一步横向移动所需的凭据。这一发现对云原生开发环境的安全架构设计具有重要警示意义。  
  
## 威胁行为体分析：ShinyHunters组织追踪  
### 组织画像  
  
ShinyHunters是一个以数据窃取和勒索为主要业务模式的黑客组织，长期活跃于BreachForums等地下黑产平台。该组织以大规模数据泄露事件闻名，曾先后泄露Microsoft、Tokopedia、Clubhouse、Nitro PDF等知名企业的用户数据。  
  
**已知活动特征**  
：  
- 偏好攻击拥有大量用户数据或高价值知识产权的目标  
  
- 通常在数据泄露后选择出售或勒索，而非直接公开  
  
- 具备从供应链上游突破目标的能力，善于识别第三方服务的安全弱点  
  
**历史关联活动**  
：  
- 2020年：泄露印度最大在线教育平台Unacademy超过2000万用户数据  
  
- 2021年：泄露AT&T超过7000万客户信息  
  
- 2022年：泄露Microsoft必应搜索数据及内部代码  
  
- 2024-2026年：将攻击重心转向企业服务提供商和SaaS平台  
  
  
### 攻击能力评估  
  
基于此次Vercel事件的完整攻击链分析，ShinyHunters具备以下能力：  
- **供应链识别能力：能够系统性地识别目标企业的第三方依赖关系**  
- **信息窃取器运用能力：熟练使用Lumma、Raccoon等主流窃密木马实施初始渗透**  
- **OAuth滥用技术：深度理解OAuth认证机制，可利用第三方应用劫持目标系统**  
- **数据变现渠道：拥有成熟的地下数据销售渠道和买家资源**  
## 供应链安全影响评估  
### 第三方AI工具的风险敞口  
  
Context.ai作为一款面向开发者的AI代码辅助工具，具备天然的信任优势。用户通常会赋予该类工具较高的系统权限，以便其访问代码库、集成开发环境和企业协作平台。然而，这种信任模型一旦被攻陷，将直接转化为攻击者的通行证。  
  
奇安信威胁情报中心的监测数据显示，2025年以来针对AI辅助开发工具的攻击事件呈明显上升趋势。攻击者意识到：  
1. AI工具通常需要持久化访问权限以提供流畅的使用体验  
  
1. 开发人员倾向于在这类工具中存储长期有效的API密钥  
  
1. AI工具的更新频率高，安全审计往往滞后于功能迭代  
  
  
### 开发者安全的系统性风险  
  
此次事件揭示了现代开发工作流中的多个安全盲区：  
  
**个人设备安全与企业文化冲突**  
：开发人员使用个人设备访问企业资源是常态，但个人设备的安全防护水平远低于企业托管设备。当个人设备感染信息窃取器时，企业凭据的泄露几乎不可避免。  
  
**第三方信任链的脆弱性**  
：现代软件开发高度依赖第三方服务，每个第三方服务都构成潜在的攻击面。攻击者无需直接攻陷目标，只需突破其供应链中最薄弱的环节。  
  
**OAuth授权的过度发放**  
：开发人员为便捷性往往授予第三方应用超出必要范围的权限。当第三方应用被攻陷时，过度授权的OAuth令牌将成为攻击者的利器。  
  
### 影响范围评估  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">影响维度</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">具体情况</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">直接受影响客户</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">有限数量，Vercel已直接通知</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">数据泄露范围</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">非敏感环境变量、内部部署配置、API密钥、员工记录（约580条）</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">服务可用性</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Vercel核心服务保持正常运行</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">供应链下游影响</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Next.js、Turbopack等开源项目经确认未受影响</span></section></td></tr></tbody></table>##   
## 失陷指标（IOC）  
  
对Vercel官方发布的IOC进行了多源验证，确认以下指标可用于安全排查：  
### OAuth应用标识符  
```
OAuth App ID: 110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com
```  
  
**验证状态**  
：该OAuth应用已被URLhaus标记为恶意，当前处于黑名单状态。建议Google Workspace管理员立即排查是否批准过此应用的授权请求。  
  
**排查建议**  
：  
1. 登录Google Workspace管理控制台  
  
1. 进入“安全性” → “API权限” → “已授权的应用”  
  
1. 搜索上述App ID，若存在授权记录，立即撤销并检查账户活动日志  
  
1. 检查是否有异常的资源访问行为  
  
  
### 威胁行为体关联指标  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">指标类型</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">描述</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">关联置信度</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">泄露数据样本</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">BreachForums上约580条员工记录</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">勒索要价</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">200万美元</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">数据打包特征</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">数据库、源代码、API密钥、NPM/GitHub token</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">初始感染载体</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Lumma信息窃取器 + Roblox作弊程序</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td></tr></tbody></table>##   
## 防御建议  
### 针对Vercel客户  
1. **立即轮换未标记为敏感的API密钥和令牌：特别是与GitHub、NPM、内部服务相关的凭据**  
1. **启用环境变量敏感标记功能：将所有包含访问密钥、token和内部配置的变量标记为敏感**  
1. **审计活动日志：检查近期是否有异常的OAuth应用访问或环境变量读取行为**  
1. **审查第三方应用授权：清理所有非必要且不熟悉的OAuth应用授权**  
### 针对企业开发者  
1. **个人设备安全加固：在处理企业资源的个人设备上启用企业级端点防护**  
1. **避免在工作设备上下载非官方软件：特别是不明来源的游戏辅助、破解工具**  
1. **实施MFA和最小权限原则：限制单一账户的权限范围，降低凭据泄露的破坏半径**  
1. **定期轮换OAuth令牌：建立自动化的凭据轮换机制**  
### 针对SaaS和云服务提供商  
1. **默认加密所有环境变量：改变基于标记的加密策略，实施默认加密**  
1. **第三方应用白名单机制：对OAuth应用实施严格的审核和授权流程**  
1. **供应链安全审计：定期评估第三方服务的安全态势，将供应链风险纳入整体风险管理框架**  
## 总结  
  
此次Vercel供应链攻击事件是2026年以来最具代表性的供应链攻陷案例之一。从攻击链完整性来看，事件经历了“信息窃取器感染→凭据武器化→OAuth滥用→数据外泄”的完整杀伤链，每个环节都利用了现代开发流程中的典型安全盲区。  
  
**关键警示**  
：  
1. 信息窃取器仍然是企业供应链最有效的突破口。攻击者无需使用高级APT技术，只需利用社交工程和恶意软件即可获取高价值企业凭据。  
  
1. OAuth生态系统的信任模型存在根本性缺陷。当第三方应用被攻陷时，其持有的令牌将自动成为攻击者的通行证。  
  
1. 云平台的默认安全配置不足以应对有针对性的供应链攻击。企业需要建立超越平台默认保护机制的安全能力。  
  
奇安信威胁情报中心将持续关注ShinyHunters组织的活动动态，并监控该组织是否将泄露数据进一步扩散或用于二次攻击。建议所有使用Vercel平台的企业立即执行上述防御措施，并保持对最新威胁情报的关注。  
  
## 参考来源  
- https://vercel.com/kb/bulletin/vercel-april-2026-security-incident  
  
- https://cyberveille.ch/posts/2026-04-19-incident-de-securite-vercel-avril-2026-acces-non-autorise-via-un-outil-ia-tiers-compromis/  
  
- https://www.bleepingcomputer.com/news/security/vercel-confirms-data-breach-claims-of-stolen-data-for-sale/  
  
- https://www.cybersecuritynews.com/vercel-confirms-data-breach-shinyhunters-claims/  
  
- https://www.hudsonrock.com/threat-intelligence/vercel-supply-chain-attack-context-ai-lumma-stealer  
  
