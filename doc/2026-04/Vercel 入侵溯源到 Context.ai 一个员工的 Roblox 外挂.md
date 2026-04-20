#  Vercel 入侵溯源到 Context.ai 一个员工的 Roblox 外挂  
原创 🅼🅰🆈
                    🅼🅰🆈  独眼情报   2026-04-20 06:43  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/cBGhzWwhSAgqO71ayjiccn227s3B3KGdqSwUibgdzowFMnia3DljTVNwLR7qa46wEIkVQsnoqY6DBNCdAoicngkAsLdfWMmYw2CzHkdXZ4gxuicc/640?wx_fmt=png&from=appmsg "")  
## 长话短说  
  
经过 24 小时的信息披露级联，Vercel 4 月安全事件的完整初始访问链条已从黑箱变成明牌。根据 Vercel 更新后的官方公告与 Hudson Rock 同日披露的 infostealer 日志分析，入侵路径为：  
  
**2026 年 2 月**  
，Context.ai（**注意**  
：是 context.ai  
 的 AI agent 平台，不是同名的 contextual.ai  
 RAG 公司）**一名拥有敏感权限的员工**  
，在搜索和下载 **Roblox 游戏外挂 / auto-farm 脚本 / executors**  
 时被 **Lumma stealer**  
 感染，浏览器保存的企业凭据被打包外传。外泄凭据包括 **Google Workspace（含一个 admin 账户）、Supabase、Datadog、Authkit**  
；Hudson Rock 的数据库显示 Context.ai 全组织在事件前**只有这一例 infostealer 感染**  
，且这例发生在事件前约一个月——时间关系支持该员工的感染就是整个供应链事件的初始访问。  
  
**攻击者随后接管了这名员工的 Google Workspace 账户**  
（利用一个恶意 OAuth 应用，Client ID 110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com  
——Vercel 和 Hudson Rock 均公开了这个 IOC），由此登入 Context.ai 在 Vercel 的团队空间 context-inc  
，直达项目 valinor  
 的 settings、environment-variables、logs 端点。Vercel 侧**标记为 sensitive 的环境变量因加密存储且不可回读而未被获取**  
，未标记为 sensitive 的环境变量则被攻击者拿到——这对应了 4 月 19 日初始公告中单独强调 sensitive 功能时埋下的暗线。  
  
**核心研判**  
：  
1. **入侵向量已基本定案**  
——Lumma stealer → Google Workspace 接管（恶意 OAuth）→ 横向到 Vercel 第三方租户空间 → 敏感环境变量被拖走。这是 2024-2026 年 infostealer 生态最典型的 Initial Access → SSO 接管 → SaaS 链式横向  
 杀伤链的一次完整实战，不是零日，不是 APT 级手艺。高置信度。  
  
1. **"Sophisticated 攻击者"这个措辞是 Vercel 出于商业利益的叙事选择，不是技术事实**  
。Vercel 在公告中形容攻击者"sophisticated"，依据是其"operational velocity"和"detailed understanding of Vercel's systems"——但初始感染路径（员工搜 Roblox 外挂中招）与"sophisticated"完全相反。**研判**  
：真正的 sophistication 不在初始访问，而在从 Google Workspace 接管到 Vercel 租户空间横向过程中对 OAuth 应用链、context-inc/valinor  
 这种少有人知的租户空间路径的熟悉度；或者更可能，这是 access broker 生态下的分工——初始访问者（装外挂的员工场景说明这名受害者不是高价值目标被定向钓）把 Google Workspace access 卖出去，买家是熟悉 SaaS 横向技术栈的二级加工者。Vercel 用"sophisticated"主要服务于受害者叙事（"我们不是被小儿科打穿的"），而不是纯技术评估。中等置信度。  
  
对下游使用方的行动升级：仅轮换 Vercel 环境变量已经不够，**需要以 Context.ai 受影响的波及范围为圆心做二级审计**  
——如果你的团队使用了 Context.ai 这个 AI agent 平台、或者如果你的 Google Workspace admin 启用过第三方 OAuth 应用——立即检查是否授权过上文 IOC 中的 OAuth Client ID。  
## 事件骨架：从 Vercel 初始公告到入侵链被完整拼出的 24 小时  
### 4 月 19 日 晚上：Vercel 公告与 BreachForums 叫卖帖同日出现  
  
关键补充：BleepingComputer 的 Lawrence Abrams 在当日晚上 6:14 PM ET 和 7:21 PM ET 两次更新文章，第二次加入了来自 Vercel CEO Guillermo Rauch 的口径。同一篇文章明确写道："threat actors linked to recent attacks attributed to the ShinyHunters extortion gang have denied to BleepingComputer that they are involved in this incident"——这是前作核心研判（发帖者是冒名顶替者）在 P1 媒体直接采访层面的印证。  
### 4 月 20 日：Hudson Rock 放出 Context.ai infostealer 日志证据  
  
Hudson Rock 在旗下 InfoStealers.com  
 发布深度披露。三条核心披露：  
  
**第一，初始感染发生在 2026 年 2 月**  
。Hudson Rock 查询自家 cybercrime database，Context.ai 全组织历史上**仅有一次**  
 infostealer 感染记录，就是这名员工，发生在本次 Vercel 事件被公开前约一个月。这种"全组织唯一感染 + 时间精确对齐"的组合，在因果推断上支持度很高（虽不等于因果本身）。  
  
**第二，浏览器历史显示受害员工的行为画像**  
。该员工当时正在搜索并下载 Roblox 的 auto-farm 脚本与 executor 类外挂工具——这是游戏作弊工具的典型搜索模式，而 Lumma stealer 的主要感染载体之一就是伪装成游戏作弊工具的下载器。  
  
**第三，外泄凭据的广度**  
：Google Workspace（含一个 admin 账户）、Supabase、Datadog、Authkit。这是一个典型的"SaaS-first 技术栈公司员工的开发工具链全家桶"。  
### 4 月 20 日：Vercel 更新 bulletin，The Hacker News 给出 P0 确认  
  
Vercel 在其 KB bulletin 中更新了技术说明（经 The Hacker News 报道证实。注：本次分析尝试直接抓取 KB 页面时仍为最初版本，疑为 CDN 缓存；文中引用以 The Hacker News 4 月 20 日直接引述的 bulletin 内容为准）。关键新内容：  
- 明确事件起因为 Context.ai 被入侵  
  
- 攻击者"使用该访问接管了员工的 Vercel Google Workspace 账户"  
  
- "这使他们得以访问某些 Vercel 环境和未标记为 sensitive 的环境变量"  
  
- **标记为敏感的环境变量以加密方式存储、不可回读，当前没有证据表明这些值被访问**  
  
- 攻击者被描述为"sophisticated"，依据是其"operational velocity"和"对 Vercel 系统的详细理解"  
  
- Vercel 已与 **Mandiant**  
 和其他网络安全厂商合作，并与 Context.ai 对接  
  
- 受影响客户被描述为"limited subset"，已被直接联系并要求立即轮换凭据  
  
### 4 月 20 日：行业与加密圈响应扩散  
  
CoinDesk、Cryptopolitan、iTnews、Whalesbook 等多家媒体跟进报道，尤其加密项目方被迅速警示：很多加密前端应用（web3 钱包接口、交易 UI）部署在 Vercel 上，NEXT_PUBLIC_  
 前缀的环境变量如果被误用来承载 API 密钥，可能已被攻击者拖走。CoinDesk 标题直接写明"crypto developers scrambling to lock down API keys"。  
  
iTnews 报道中出现一个值得记的小标签：其标题括号里写的是「"Small, third-party AI tool" blamed for compromise」——这是 Vercel 侧对外沟通的定性口径，刻意弱化 Context.ai 的名字。但 Vercel bulletin 和 Hudson Rock 已明确指名 Context.ai，无法掩盖。  
## 技术溯源：杀伤链拼图  
### 第一环：Lumma Stealer + Roblox 外挂的典型组合  
  
Lumma stealer（也写作 LummaC2）是 2023 年以来 Malware-as-a-Service 生态中增速最快的信息窃取家族之一，其主要投递载体常见于两类渠道：  
- 伪装成破解游戏 / 游戏外挂 / 游戏启动器的可执行文件  
  
- SEO 毒化与 YouTube/TikTok 视频描述区投放的假 GitHub 或假软件下载页  
  
受害员工的搜索行为（Roblox auto-farm 脚本、executor 工具）精确命中第一类载体。这里有一个**人因链条**  
值得单独拎出来：**这名员工装外挂的设备大概率同时被用于企业工作**  
，或者企业工作账号在个人设备浏览器里保存了密码——这是 BYOD（自带设备办公）环境下最脆弱的一类人因漏洞。Hudson Rock 原文的语气是"教科书例子"，不为过。  
  
**研判**  
：初始感染不是被 ShinyHunters 或任何高段位组织定向投递的，而是机会主义的 MaaS 感染。攻击者获得该员工凭据的路径很可能是后来在 infostealer 日志市场购买或免费获取——这是 2024–2026 年初始访问经纪（IAB）经济的标准模式。中等偏高置信度；依据是受害者行为画像（装外挂）和 Lumma 的已知分发模式。  
### 第二环：Google Workspace 接管 与 恶意 OAuth  
  
外泄凭据里包含 Google Workspace（含一个 admin 账户）是整条链路的关键支点。攻击者的下一步不是简单的"用密码登陆"——企业 Google Workspace 通常开启 MFA 或 session token 限制，单纯的密码 + 无 MFA 旁路登录难以成功。  
  
Hudson Rock 和 Vercel 披露的恶意 OAuth Client ID：  
```
110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com

```  
  
这是一个**典型的 OAuth 授权劫持模式**  
：攻击者不硬攻 MFA，而是让受害者（或利用已窃取的 session cookie）给一个看起来合法的第三方应用授权，一旦授权完成，应用可以在 refresh token 生命周期内持续以受害者身份访问 Google Workspace 资源，**不需要再输密码、不需要再过 MFA**  
。这个套路在 2025 年下半年 Salesloft Drift / Gainsight 波次的大规模 Salesforce 攻击中被 ShinyHunters / SLSH 大量使用过。所以论坛帖自认 ShinyHunters 在这一层面确实"风格对口"——但**风格对口不等于身份相同**  
，整个 OAuth 接管剧本在地下生态是公开可复用的。  
  
Vercel 向 Google Workspace 管理员推荐的自检路径是实操价值最高的一段：进 Google Admin Console → Security → Access and Data Control → API Controls → Manage Third-Party App Access，按上述 Client ID 筛选。如果你的 workspace 出现了该授权记录，即刻撤销并启动 IR。  
### 第三环：从 Google Workspace 横向到 Vercel 租户  
  
Hudson Rock 披露的受害员工浏览器历史显示三条 Vercel 路径被访问过：  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">路径</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">含义</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">vercel.com/context-inc/valinor/settings/environment-variables</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Context.ai 在 Vercel 的 </span><code><span leaf="">context-inc</span></code><span leaf=""> 团队空间下 </span><code><span leaf="">valinor</span></code><span leaf=""> 项目的环境变量管理页</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">vercel.com/context-inc/valinor/settings</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">项目级通用设置</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">vercel.com/context-inc/valinor/logs</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">生产与预发环境的日志访问</span></section></td></tr></tbody></table>  
  
valinor  
 是 Context.ai 在 Vercel 上的项目代号（取自托尔金传说中的 Valinor，阿门洲）。这三个端点的组合说明攻击者不是盲目探测，而是知道要直奔环境变量这个"王冠上的明珠"——能拿到 API 密钥、部署配置、第三方集成密钥等一整套核心 secrets。  
  
关键技术分辨：Vercel 在早期（2026 年 2 月）推出了 sensitive environment variable 这一分类，标记为 sensitive 的变量"在创建后不可解密、不会通过 REST API 返回值"。本次事件中 Vercel 声称"sensitive 变量未被访问"，依据就是这一加密设计。但历史原因下，**大量真实项目的变量没有被标记为 sensitive**  
——这是为什么 Vercel 官方通告和第三方研究者（Theo 等）都在反复强调"立即把敏感变量迁到 sensitive 分类并轮换未 sensitive 的一切"。  
### 完整链图  
```
Roblox 外挂下载
  ↓
Lumma stealer 感染 Context.ai 员工终端（2026-02）
  ↓
凭据外传到 infostealer 日志市场
  ↓
攻击者（身份未定论，论坛帖自称 ShinyHunters）获得凭据
  ↓
恶意 OAuth 应用授权劫持 Google Workspace 账户
  ↓
登入 context-inc 团队空间
  ↓
访问 valinor/settings/environment-variables、logs
  ↓
拖走未标记敏感的环境变量、API 密钥等
  ↓
BreachForums 叫卖（论坛 shinyc0rpsss 账号）+ 员工邮箱骚扰
  ↓
Vercel 主动联系 + 公告 + IR 启动

```  
## 复盘：三条责任分布的线  
### Context.ai 侧  
  
**该员工所在终端的 BYOD / 设备隔离策略很可能存在缺口**  
。工作账号凭据保存在一台会被用于下载 Roblox 外挂的设备上，这是最核心的根因。**研判**  
：Context.ai 大概率没有强制企业托管设备 + 禁止企业凭据在个人设备登录的策略，或有策略但未执行到位。  
  
**admin 账户未做分级**  
。Google Workspace admin 账户与日常开发账户如果合并在一个身份上，一次 OAuth 劫持就能拿到管理员权限——这在 2024 年以后的企业安全最佳实践中已不是合理结构。  
### Vercel 侧  
  
**sensitive 环境变量功能的设计是本次事件中救命的一环**  
。从结果看，标记为 sensitive 的变量未被访问——这是 Vercel 2 月推出该功能的回报。**研判**  
：该功能在本次事件中的防御价值被严重低估，Vercel CEO 在 X 中暗示要继续改进该功能 UI（"better user interface for sensitive environment variable creation and management"）是正确的方向。  
  
**但第三方团队空间的横向信号监控是短板**  
。攻击者通过合法员工凭据进入 context-inc/valinor  
 空间并访问 logs 和 env vars 端点——这些行为如果有基于"异常地理位置 + 异常访问模式 + 异常 OAuth 应用"的联动告警，本应在攻击者得手之前触发。Vercel 在事后推出的 env var overview page 说明他们意识到这一问题。  
  
**事件响应本身符合标准**  
：主动联系发帖者集中化沟通、引入 Mandiant、按 GDPR/SEC 等合规窗口披露、发布 OAuth IOC 便于客户自检、CEO 亲自在公众渠道出面——这些是教科书动作。前作标题里的"被唬住"是修辞，不是事实判断。  
### 攻击者侧  
  
不论攻击者最终是谁，这条链路展示的是 2026 年 Initial Access Broker 经济的成熟度：  
- MaaS（Lumma）负责大面积感染  
  
- IAB 市场负责把感染凭据明码标价  
  
- SaaS 横向熟手负责把 Google Workspace admin 账户转化为下游租户访问  
  
- 冒牌者负责在 BreachForums 品牌寄生变现  
  
整个链路**不需要零日、不需要内鬼、不需要高级社工**  
。唯一的"技术"是 SaaS 横向熟手对 OAuth 劫持技术栈的熟练。这意味着**任何一个有一个员工装了 Roblox 外挂的 SaaS-first 公司都可能是下一个 Context.ai**  
。  
  
  
