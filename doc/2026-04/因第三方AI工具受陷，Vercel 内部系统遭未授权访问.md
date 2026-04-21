#  因第三方AI工具受陷，Vercel 内部系统遭未授权访问  
DevOpsDaily Team
                    DevOpsDaily Team  代码卫士   2026-04-21 10:32  
  
   
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
   
聚焦源代码安全，网罗国内外最新资讯！  
   
  
编译：代码卫士  
  
![](https://mmbiz.qpic.cn/mmbiz_png/oBANLWYScMRSylJK2k7H6mNqiaS2G6WRaeeK34cLHE6pe9VeOIHYiboAnKB0TMoayZCxFpHMLljzTnz9DnNuFiaqQ/640?wx_fmt=png "")  
  
  
专栏·供应链安全  
  
  
数字化时代，软件无处不在。软件如同社会中的“虚拟人”，已经成为支撑社会正常运转的最基本元素之一，软件的安全性问题也正在成为当今社会的根本性、基础性问题。  
  
  
随着软件产业的快速发展，软件供应链也越发复杂多元，复杂的软件供应链会引入一系列的安全问题，导致信息系统的整体安全防护难度越来越大。近年来，针对软件供应链的安全攻击事件一直呈快速增长态势，造成的危害也越来越严重。  
  
  
为此，我们推出“供应链安全”栏目。本栏目汇聚供应链安全资讯，分析供应链安全风险，提供缓解建议，为供应链安全保驾护航。  
  
  
注：以往发布的部分供应链安全相关内容，请见文末“推荐阅读”部分。  
  
**2026****年 4 月 19 日，Vercel 披露了一起涉及内部系统未授权访问的安全事件。该攻击的源头并非 Vercel 自身，而是因一名 Vercel 员工使用的第三方 AI 工具 Context.ai触发，随后通过一个被入侵的 Google Workspace OAuth 应用进行传播，最终进入 Vercel 的内部环境以及部分客户的环境变量。**  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
这是一起供应链攻击事件，但这里的“供应链”并非指代码或 npm 包，而是指企业员工用 Google 账号登录的那些 SaaS 应用。本文将说明事件经过、如何判断自己是否受影响，以及需要做出哪些改变。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfXibMnRMw3t8w5kfcx61v8Oj2z1YRD0micS5zDcD1qONiaGRFHhrGm7tmHnqftk0C8xpA96aT4SiadaSfPnnW4xsyqZ5BXHSDiaAvl0/640?wx_fmt=gif&from=appmsg "")  
  
**攻击时间线**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfVJDOXbBf3S1Ixd7HCiaiaPFib9iandRJlgjUCmBo5q0HwxgYa7xQFx1BovHyKnS0UqP239TMUewb0UY9cTibmOcc81OaXKWMgjs1Ys/640?wx_fmt=gif&from=appmsg "")  
  
  
  
这条攻击链的完整过程值得了解，因为它揭示了现代“供应链”入侵越来越多地通过身份提供商（而非代码）进行传播的典型路径。  
  
**1、****2026****年3月：Context.ai 发生 AWS 入侵事件。**  
Context.ai 是一家 AI 工具创业公司。该公司在 3 月份披露称 AWS 基础设施遭入侵，并聘请 CrowdStrike 公司代为调查。    
  
**2、****OAuth****令牌被盗，但未被标记为异常。**  
AWS 入侵事件还暴露了 Context.ai 为 Google Workspace 集成所持有的 OAuth 令牌。调查显然未能发现这一点。  
  
**3、****一名 Vercel 员工使用了 Context.ai。**  
该员工此前通过 OAuth 授权 Context.ai 访问其 Google Workspace——就像授权任何需要读取邮件、文件或日历的第三方 SaaS 应用一样。  
  
**4、****攻击者重放了令牌。**  
凭借有效的 OAuth 令牌，攻击者可以冒充 Context.ai 应用，并访问该 Vercel 员工的 Google Workspace 账户。当已预先授权的 OAuth 应用调用 Google API 时，不会触发密码或多因素认证 (MFA) 提示。  
  
**5、****横向移动进入 Vercel 内部系统。**  
攻击者从该 Workspace 账户出发，通过一系列权限提升操作最终进入了 Vercel 的内部环境。  
  
**6、****访问客户的环境变量。**  
进入内部后，攻击者能够读取 Vercel 平台上那些未被客户标记为“敏感”的环境变量。Vercel 对所有静态环境变量都进行了加密，但标记为“敏感”的环境变量即使对 Vercel 内部员工也不可见，因此未受到影响。  
  
Vercel 检测到了异常活动，聘请 Mandiant 公司介入调查并通知执法机构，并于 4 月 19 日进行了公开披露。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfXtk6kH4ZhadLI0z3CyI6nJwZeYwvHUycqLJIdMObpR6qv03hd9DEtafmy0S6ayBJXqJqzemY54PonSuPibIHYh2xp31VkeAtRY/640?wx_fmt=gif&from=appmsg "")  
  
**已暴露（及未暴露）的内容**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfVX8QXMMDwPsoHh9vaTwj8X0dAXlntVLnicer2AMEcnib2LO1Y1NXUXQB7IN5J8ibiba63E2Ff6AJz5DPZeuLm4tXGGMZaXeus5VQY/640?wx_fmt=gif&from=appmsg "")  
  
  
  
**Vercel****官方确认的情况**  
  
攻击者可能访问了以下内容：  
  
- “一小部分客户”的 Vercel 凭证  
  
- 客户项目中未标记为“敏感”的环境变量  
  
- 客户项目中的 Deployment Protection 令牌  
  
- Vercel 的各类内部系统和工具  
  
  
  
攻击者**未能**  
访问以下内容：  
  
- 标记为“敏感”的环境变量（即使 Vercel 员工也无法查看）  
  
- 所列子集之外的任何客户数据（Vercel 已直接联系受影响客户）  
  
- Vercel 的构建/运行基础设施本身  
  
  
  
在整个事件发生期间，Vercel 服务始终保持正常运行。Vercel 的公共边缘网络、构建系统以及部署并非攻击面。  
  
**攻击者的说法**  
  
安全研究员 @k1rallik 在一条推文中声称，该威胁行为者是 ShinyHunters（即 2024 年 Ticketmaster 数据泄露事件的幕后组织），提到BreachForums 论坛正在以200万美元的价格出售 Vercel 内部数据库的副本。据称该数据列表包含属于 Vercel 的 NPM 令牌和 GitHub 令牌。该研究员还声称 Vercel 通过 Telegram 直接联系了攻击者。  
  
**这一点尚未得到 Vercel 的官方确认。**  
应将这一说法视为社区信号，而非既定事实。但其中隐含的风险值得认真对待：如果用于发布 Vercel 所维护包的 NPM 令牌被盗，最坏的情况下，next、@vercel/next、@vercel/analytics 或任何其它由 Vercel 发布包的恶意版本将出现在 npm 上。仅 Next.js 每周就有约 600 万次下载，这将使其成为一场教科书式的全球供应链攻击，与最近 axios 被入侵事件形态类似。  
  
如果 Vercel 确认或否认令牌被盗，我们后续将更新。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfW6ibEIMAZ6qS64tqYnoN1b6M9ibbnRoicdxpkWp3PFkmzcPIxmLGTS9cmjs3kGrI5O9YKakHcl7ias7iaDJpxpavicRV76suBdJbbCk/640?wx_fmt=gif&from=appmsg "")  
  
**如何判断是否受影响？**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfXyRib5esnEp4x348m8PP9l1eDMRuPIEPX6DDKrDs5uuaFGibbpHHAEibcjNrrVYsxbeb899AME9LZpuWuLno33gDdCASuwpl5icQg/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Vercel 已直接联系了受影响的客户。Vercel 表示，如果未收到通知，则说明没有发现账户被入侵的证据。话虽如此，更为稳妥的做法是自行核实。  
  
**检查通知**  
  
1、  
在与 Vercel 账户所有者关联的收件箱中，查找日期在 2026 年 4 月 19 日前后来自 Vercel 的邮件。  
  
2、检查 Vercel 仪表板中是否有横幅通知或应用内通知。  
  
3、搜索垃圾邮件 / 隔离文件夹。  
  
**审计账户活动**  
```
# In the Vercel dashboard:
# Settings → Security → Audit Log
```  
  
查找不熟悉的情况：  
  
- 自身未触发的部署  
  
- 新的团队成员或项目邀请  
  
- 令牌创建或 SSH 密钥添加  
  
- 环境变量变更  
  
- 域名或 DNS 设置变更  
  
  
  
需特别关注 2026 年 4 月初到审计之日期间的活动。  
  
**检查近期的部署**  
```
# Vercel dashboard → Project → Deployments
```  
  
  
对于自 4 月初以来的每个生产部署，需验证：  
  
- commit SHA 与 Git 历史记录一致  
  
- 构建日志不包含异常命令或输出  
  
- 部署由已知用户或 CI 流水线触发  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfUuYJVDbicSxe0rmaQcj20x0Q7XcAc8wt4TtgeeC1BA1nBXxkmiaOJpGGfHpDzNcMkjIiabF4iaNcebScN8CnCcjcT9tvcZtIm4nds/640?wx_fmt=gif&from=appmsg "")  
  
**如受影响，如何修复？**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfXa3qgVENmtP53Z89GjEhmjH89uJcpxiaklIMGxE1309T8yQVRW0ZtufKpp2Wc90B4hZw1ThmcCWwB9aefOzaDd7K7PbIaPpK3I/640?wx_fmt=gif&from=appmsg "")  
  
  
  
如果收到 Vercel 的通知，或审计发现了任何可疑情况，需假定自己的非敏感环境变量已被读取，并采取相应措施。  
  
**1、****更换所有曾经存在于非敏感环境变量中的密钥**  
  
包括：  
  
- 第三方 API 密钥（Stripe、OpenAI、Sentry、PostHog、Resend 等任何服务）  
  
- 数据库连接字符串和凭据  
  
- OAuth 客户端密钥和 webhook 签名密钥  
  
- 内部服务间通信令牌  
  
- 任何其它以普通环境变量（而非敏感环境变量）存储的凭据  
  
  
  
如有可能，需在原处更换。否则，需发布新凭据、完成部署，再撤销旧凭据。  
  
**2、****更换 Deployment Protection 令牌**  
```
# Vercel dashboard → Project → Settings → Deployment Protection → Rotate token
```  
  
  
如攻击者获得 Deployment Protection 令牌，就可绕过预览部署的保护措施。  
  
**3、****将 Deployment Protection 至少提升到 Standard 级别**  
  
如果受影响项目上的 Deployment Protection 之前设置为 None 或低于 Standard 级别，需提升，以防止未来对预览 URL 的未授权访问。  
  
**4、****后续采用敏感环境变量**  
  
Vercel 为每个变量提供了一个“敏感”标志。敏感值：  
  
- 仅能被运行中的部署读取，仪表板、CLI 或 Vercel 员工均无法查看  
  
- 不会包含在构建日志中  
  
- 设置后无法再被查看  
  
  
  
需将所有机密（密钥、令牌、密码）都移至敏感环境变量。将非敏感变量留给真正非秘密的配置使用，例如功能开关、区域名称或公共 URL。  
```
# When adding a new env var in the dashboard, check the
# "Sensitive" checkbox. For secrets, always.
```  
  
  
**5、****重新构建并重新部署**  
  
更换完成后，触发一次干净的重新部署，以便新值生效，旧值仅作为旧构建中的无效引用存在。  
  
**6、****锁定Next.js 和 Vercel 发布的 npm 依赖**  
  
如果使用 Next.js 或任何由 Vercel 发布的包（next、@vercel/*、@next/*），需在 Vercel 官方确认没有发布令牌被泄露之前，在 lockfile 中将其锁定到已知安全的版本：  
```
# See what you have locked
grep -E '"next":|"@vercel/|"@next/' package.json package-lock.json yarn.lock pnpm-lock.yaml 2>/dev/null
# In CI, use clean installs that respect the lockfile exactly
npm ci
# or
pnpm install --frozen-lockfile
# or
yarn install --frozen-lockfile
```  
  
  
如不需要，可在 CI 中对不受信任的依赖项禁用 postinstall 脚本：  
```
npm ci --ignore-scripts
```  
  
  
在 4 月 19 日到 Vercel 宣布风险解除这段时间内，监控 npm 上 next 包的发布动态，留意任何非预期的版本发布。在此时间窗口内出现的任何计划外补丁版本都是一个危险信号。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfV30sOE8IGH2dicHlG3Rw2iaT0pQYFcIR2AF7pxicOVucRnFlEmZCbZibyPrEgNhQQtAhib2eDWARtwZKLeyHvfpMiaS0kEZfibKE6wlg/640?wx_fmt=gif&from=appmsg "")  
  
**如何防范类似攻击**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfWjRMwknFJKA9RzegyljSqcoXXqvfRNGQ9KPbxmbljzkTGdFibdLrva1rBSOIQsDiaoq1SWt6CVCjZwC3IzOJCWf42BWxFHgcFdA/640?wx_fmt=gif&from=appmsg "")  
  
  
  
类似攻击还会再次发生。它是一种模式，而非孤立事件。无论是否使用 Vercel，都应在所在组织内做好以下加固措施。  
  
**1****、将 OAuth 应用授权视为访问控制**  
  
团队接受的每一个“使用 Google 登录”授权，都是一条进入身份提供商的持久访问路径。大多数组织从不审计已经授权了哪些应用。  
```
# Google Workspace admin: Security → Access and data control →
#   API controls → App access control → Manage Third-Party App Access
```  
  
  
检查列表。撤销任何无人认识的授权。将高价值范围（Drive、Gmail、日历的读写权限）纳入显式白名单，这样员工就无法静默地授权新应用读取公司数据。  
  
GitHub 也有类似的审查页面，用于查看已获得所在组织授权的 OAuth 应用。  
  
**2****、在每个 OAuth 集成上最小化权限范围**  
  
将第三方 SaaS 应用连接到 Workspace 或 Microsoft 365 时，需检查权限范围列表。如果某个应用只应该读取日历，却请求 https://mail.google.com/（完整的邮件访问权限），则应拒绝。但大多数员工会接受任何被请求的权限。  
  
**3****、默认将每个密钥标记为敏感**  
  
不仅仅是在 Vercel 上这样做。在每个类似平台上都应如此：  
  
- Vercel：敏感环境变量  
  
- AWS：Secrets Manager，绝不要在可通过 kubectl get 访问到的 Lambda 上使用明文环境变量。  
  
- GitHub Actions：加密密钥，不要在工作流的 YAML 中使用明文环境变量。  
  
- Kubernetes：至少使用 Secret 对象，在理想情况下使用密封的 Secret 或由 Vault 支持的External Secret Operator。  
  
  
  
这里需要秉持的一个原则是，秘密永远不应被仪表板、日志或人类管理员读取，只能被运行时需要它的进程读取。  
  
**4****、监控 Google Workspace 中的异常令牌使用情况**  
  
Workspace 会记录每次 OAuth 应用令牌的访问。用户可针对以下情况设置告警：  
  
- 一个超过 30 天未使用的 OAuth 应用令牌突然激活  
  
- 来自异常地理位置或 IP 的令牌使用  
  
- OAuth 应用在短时间内大量读取文档或邮件  
  
  
  
这类活动本可更早地发现本次事件中的令牌重放。大多数组织拥有这些日志，但没有为其配置任何告警。  
  
**5****、制定涵盖“供应商被入侵”场景的应急计划**  
  
不应等待事情发生了才开始行动，应提前写好：  
  
- 当某个供应商披露入侵事件时，所在团队中的联系人是谁。  
  
- 哪些密钥需要按什么顺序更换（通常是：身份提供商优先，其次是支付/计费，然后是产品 API）。  
  
- 如果事件影响到客户，如何与他们沟通。  
  
- 更换操作手册存放在哪里。  
  
  
  
每年通过一次桌面演练来实践该计划。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfV9tEAMfTaIuPbxdWFjcQfHztpFLPTiaGxNean3wLSsmZdUJbleVa3fz6icJOicbSe3WHFYap2BhEQ2bafDdTkZAHcSC0mEyS2q8s/640?wx_fmt=gif&from=appmsg "")  
  
**更大的教训和启发**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfUNBMqic6aXibzmDsGtYfx5wib03V0LXHnprtvVzTONCDNN1ElRBDlBwXFrcRRmLiaRliajeuqdlnibTzzPZ3OJ2iaF6JppZsV2BIvp0k/640?wx_fmt=gif&from=appmsg "")  
  
  
  
这起事件令人不安的地方，并不是 Vercel 本身被入侵，而是最初的攻击向量是一个 Vercel 安全团队完全无法监控的 AI 工具。Context.ai 在被入侵一个月后，Vercel 内部才有人知道出了问题。CrowdStrike 公司显然也没有将 OAuth 令牌纳入其调查范围。  
  
如果读者现在使用 Vercel 或任何 Serverless 平台，则风险面现在已经扩展到了每一位员工曾经用自己的Google 账号登录过的每一款 SaaS 应用。这是一个非常庞大的风险面。审计、缩小该攻击面的权限范围、对异常的令牌活动设置告警——这是唯一的防御手段。而等待供应商来披露信息并非策略。  
  
  
开源  
卫士试用地址：  
https://sast.qianxin.com/#/login  
  
代码卫士试用地址：  
https://codesafe.qianxin.com  
  
  
  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[在线阅读版：《2025中国软件供应链安全分析报告》全文](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523516&idx=1&sn=0b6fc53ba92e7b5135395b67fff6a822&scene=21#wechat_redirect)  
  
  
[Trivy供应链攻击触发CanisterWorm 在47个 npm 包中自传播](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525520&idx=2&sn=b3d4dddc586c4b0aa8cefb09c0344cb8&scene=21#wechat_redirect)  
  
  
[热门包管理器中存在多个漏洞，JavaScript 生态系统易受供应链攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524984&idx=1&sn=19aef4ce8e288278782458e430a710d8&scene=21#wechat_redirect)  
  
  
[开源自托管平台 Coolify 修复11个严重漏洞，可导致服务器遭完全攻陷](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524828&idx=2&sn=21af241f60f1452013815133745e9a72&scene=21#wechat_redirect)  
  
  
[得不到就毁掉：第二轮Sha1-Hulud供应链攻击已发起，影响2.5万+仓库](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524487&idx=1&sn=f170d3131122071dec6e419c6cff562c&scene=21#wechat_redirect)  
  
  
[vLLM 高危漏洞可导致RCE](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524481&idx=3&sn=6d0b161f8add2f6c1ee65e60ef6955d8&scene=21#wechat_redirect)  
  
  
[开源AI框架 Ray 的0day已用于攻陷服务器和劫持资源](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247519162&idx=1&sn=3872fcc82018e2c561d9e4e7574f0c8e&scene=21#wechat_redirect)  
  
  
[热门 React Native NPM 包中存在严重漏洞，开发人员易受攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524330&idx=2&sn=bc54e02a8f815ed78b67d3135a9f9607&scene=21#wechat_redirect)  
  
  
[10个npm包被指窃取 Windows、macOS 和 Linux 系统上的开发者凭据](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524314&idx=2&sn=81cae6998a39f2153ed18d7cc065303b&scene=21#wechat_redirect)  
  
  
[热门 React Native NPM 包中存在严重漏洞，开发人员易受攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524330&idx=2&sn=bc54e02a8f815ed78b67d3135a9f9607&scene=21#wechat_redirect)  
  
  
[热门NPM库 “coa” 和“rc” 接连遭劫持，影响全球的 React 管道](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247508946&idx=1&sn=273c58d08a4225306a567cf6a150f40c&scene=21#wechat_redirect)  
  
  
[开发人员注意：VSCode 应用市场易被滥用于托管恶意扩展](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247515219&idx=1&sn=faa32338df1d68e7cd738a80222f3a44&scene=21#wechat_redirect)  
  
  
[GitHub Copilot 严重漏洞可导致私有仓库源代码被盗](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524163&idx=1&sn=d70a7c55e27a3e179522330a9ce62b0b&scene=21#wechat_redirect)  
  
  
[受 Salesforce 供应链攻击影响，全球汽车巨头 Stellantis 数据遭泄露](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524053&idx=1&sn=2b843932ebd4eeeb17b6935b08be82f8&scene=21#wechat_redirect)  
  
  
[捷豹路虎数据遭泄露生产仍未恢复，幕后黑手或与 Salesforce-Salesloft 供应链攻击有关](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523990&idx=1&sn=ad9957a5c3d054d4a0bf32250bceb556&scene=21#wechat_redirect)  
  
  
[十几家安全大厂信息遭泄露，谁是 Salesforce-Salesloft 供应链攻击的下一个受害者？](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523972&idx=1&sn=7b06c31940ea7576d0236d9310886b39&scene=21#wechat_redirect)  
  
  
[第三方集成应用 Drift OAuth 令牌被用于攻陷 Salesforce 实例，全球700+家企业受影响](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523952&idx=1&sn=2bc84253019e6c2525bcf928eaed696c&scene=21#wechat_redirect)  
  
  
[黑客发动史上规模最大的 NPM 供应链攻击，影响全球10%的云环境](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523990&idx=2&sn=6e38e1ee8cd69f1375a5be218c02ff97&scene=21#wechat_redirect)  
  
  
[十几家安全大厂信息遭泄露，谁是 Salesforce-Salesloft 供应链攻击的下一个受害者？](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523972&idx=1&sn=7b06c31940ea7576d0236d9310886b39&scene=21#wechat_redirect)  
  
  
[第三方集成应用 Drift OAuth 令牌被用于攻陷 Salesforce 实例，全球700+家企业受影响](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523952&idx=1&sn=2bc84253019e6c2525bcf928eaed696c&scene=21#wechat_redirect)  
  
  
[AI供应链易遭“模型命名空间复用”攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523962&idx=1&sn=2d9b8ca044c242a6ae1f72df93d7acb0&scene=21#wechat_redirect)  
  
  
[Frostbyte10：威胁全球供应链的10个严重漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523957&idx=2&sn=288b0d14a657b13c7f1a6b14705a44e8&scene=21#wechat_redirect)  
  
  
[PyPI拦截1800个过期域名邮件，防御供应链攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523850&idx=2&sn=72dc01d9984a720959b312dd0e7cf05e&scene=21#wechat_redirect)  
  
  
[PyPI恶意包利用依赖引入恶意行为，发动软件供应链攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523844&idx=2&sn=08c8962eead61fe76467a9196b3da3e5&scene=21#wechat_redirect)  
  
  
[黑客利用虚假 PyPI 站点钓鱼攻击Python 开发人员](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523700&idx=2&sn=463d300bdfd3de129cd5d258ceb67cf4&scene=21#wechat_redirect)  
  
  
[700多个恶意误植域名库盯上RubyGems 仓库](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247492823&idx=2&sn=9c226ff328303e78331451ac5219df07&scene=21#wechat_redirect)  
  
  
[NPM “意外” 删除 Stylus 合法包 全球流水线和构建被迫中断](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523648&idx=1&sn=d9237c45bf78637d1cdd3bedd1d873e6&scene=21#wechat_redirect)  
  
  
[固件开发和更新缺陷导致漏洞多年难修，供应链安全深受其害](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523615&idx=1&sn=1df256011200be03dc2afc80016c587e&scene=21#wechat_redirect)  
  
  
[NPM仓库被植入67个恶意包传播恶意软件](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523592&idx=2&sn=5087c0aa841caf3f0def9a1ca6c5ad27&scene=21#wechat_redirect)  
  
  
[在线阅读版：《2025中国软件供应链安全分析报告》全文](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523516&idx=1&sn=0b6fc53ba92e7b5135395b67fff6a822&scene=21#wechat_redirect)  
  
  
[NPM软件供应链攻击传播恶意软件](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523234&idx=2&sn=ac4e0656fd04218349d356761af176dd&scene=21#wechat_redirect)  
  
  
[隐秘的 npm 供应链攻击：误植域名导致RCE和数据破坏](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523167&idx=2&sn=4249c8e9e0dace01810c665eda52c421&scene=21#wechat_redirect)  
  
  
[NPM恶意包利用Unicode 隐写术躲避检测](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523031&idx=2&sn=5071cdb63bdd6339b1a3ff7ef3581cd5&scene=21#wechat_redirect)  
  
  
[Aikido在npm热门包 rand-user-agent 中发现恶意代码](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247522945&idx=1&sn=c767722383afc7e6b505aef2f50ba4cd&scene=21#wechat_redirect)  
  
  
[密币Ripple 的NPM 包 xrpl.js 被安装后门窃取私钥，触发供应链攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247522841&idx=2&sn=024b6c290bf4ebecc241f11bc944be1c&scene=21#wechat_redirect)  
  
  
  
  
**原文链接**  
  
https://devops-daily.com/posts/vercel-april-2026-security-incident  
  
  
**本文由奇安信编译，不代表****奇安信观点。转载请注明“转自奇安信代码卫士 https://codesafe.qianxin.com”。**  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSf7nNLWrJL6dkJp7RB8Kl4zxU9ibnQjuvo4VoZ5ic9Q91K3WshWzqEybcroVEOQpgYfx1uYgwJhlFQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSN5sfviaCuvYQccJZlrr64sRlvcbdWjDic9mPQ8mBBFDCKP6VibiaNE1kDVuoIOiaIVRoTjSsSftGC8gw/640?wx_fmt=jpeg "")  
  
**奇安信代码卫士 (codesafe)**  
  
国内首个专注于软件开发安全的产品线。  
  
   ![](https://mmbiz.qpic.cn/mmbiz_gif/oBANLWYScMQ5iciaeKS21icDIWSVd0M9zEhicFK0rbCJOrgpc09iaH6nvqvsIdckDfxH2K4tu9CvPJgSf7XhGHJwVyQ/640?wx_fmt=gif "")  
  
   
觉得不错，就点个 “  
在看  
” 或 "  
赞  
” 吧~  
  
  
