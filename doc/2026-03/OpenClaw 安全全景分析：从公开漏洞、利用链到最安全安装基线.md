#  OpenClaw 安全全景分析：从公开漏洞、利用链到最安全安装基线  
ckcsec
                    ckcsec  补天平台   2026-03-20 06:06  
  
> 文章首发于奇安信攻防社区：https://forum.butian.net/ai_security/75  
  
  
  
从防守视角出发、基于OpenClaw 官方 Trust / Docs、GitHub Security Advisories、NVD 及公开研究整理的安全全景分析。  
  
1. OpenClaw 的风险到底和普通聊天机器人有什么不同？  
  
2. 近期公开漏洞到底暴露了什么样的真实攻击链？  
  
3. 如果你今天就要部署，怎样才算一个尽可能稳妥的安全基线？  
## 先说结论  
  
**OpenClaw 不是“天然不安全”，但它也绝不是一个普通聊天机器人。**  
  
它更像一个**带自然语言入口的本地自动化中枢**  
：可以执行 shell、读写文件、抓网页、控制浏览器、发消息、调度任务、访问外部服务和 API。 如果把它当成普通 Bot 来部署，再套上“开放群聊 + 全工具权限 + 公网暴露”的组合，风险就会被迅速放大。  
  
截至 **2026 年 3 月 15 日**  
，GitHub Releases 当前最新正式版本是 **openclaw 2026.3.13**  
，对应签名标签 **v2026.3.13-1**  
。GitHub 仓库 Security 页面也已经累积了大量安全条目。对防守者来说，真正重要的不是把这些编号机械罗列出来，而是看清一条更现实的攻击路径：  
  
**不受信任输入 → 控制面 / 认证 → 工具层 / 浏览器 / 节点 → 宿主机 / 外部服务**  
  
真正要防的，就是这条链被串起来。  
## 为什么 OpenClaw 的安全半径比多数人想象得更大  
  
很多人第一次接触 OpenClaw，天然会把它放进“聊天机器人”这个脑内分类里。但官方文档其实已经给出了更准确的定位：它不是只会吐文本的助手，而是一个可被自然语言驱动的自动化执行层。  
  
OpenClaw 官方 Trust 和安全文档明确写到，它可以：  
- 执行 shell 或系统命令  
  
- 读写工作区文件  
  
- 抓取任意 URL  
  
- 控制浏览器  
  
- 通过 WhatsApp、Telegram、Discord 等渠道接收和发送消息  
  
- 调度自动化任务  
  
- 访问已连接的服务、节点和 API  
  
更重要的一点是：**如果多个人都能给同一个启用了工具的 agent 发消息，那么这些人都能在该 agent 已经获授权的边界内“驾驶”它。**  
  
这句话其实直接决定了 OpenClaw 的安全思路。 你真正要防的，不是“模型今天会不会胡说八道”，而是下面四件事：  
1. 谁能跟它说话  
  
1. 它能动哪些工具  
  
1. 这些工具是不是被沙箱隔离  
  
1. 宿主机、浏览器身份、API 凭证有没有和 AI 分开  
  
只要其中一项做得太宽，后面几项就很容易一起失守。  
## 官方 threat model 已经说明：风险不是抽象的  
  
截至本文时间点，官方 threat model 当前列出 **37 个威胁**  
，其中 **6 个 Critical、16 个 High**  
。核心信任边界大体可以理解为 5 层：  
- 供应链  
  
- 通道访问控制  
  
- 会话隔离  
  
- 工具执行  
  
- 外部内容  
  
如果把 OpenClaw 的风险画成一张图，大概就是这样：  
  
![iShot_2026-03-15_16.13.22.png](https://mmbiz.qpic.cn/sz_mmbiz_png/7RlRLTgDcUgZKicyLs2ibT29yfdcb1esUCM0pfcOcvU20rfXe5SyjALJWciaRLUZGA2UWgiavQ5rcRYZUuoOwL2YWwy7vjastE2yuiaXErNze0hw/640?wx_fmt=png&from=appmsg "")  
  
**入口、控制面、执行面、宿主机、供应链**  
，任何一层放得太宽，都会把后面几层一起带开。  
  
所以 OpenClaw 的安全工作，不能只盯着“有没有某个高危 CVE”，而要看整条链是不是被切断。  
## 公开漏洞应该怎么看：不要按编号看，要按攻击链看  
  
下面不追求穷举，而是按最关键的攻击面整理一批最值得防守者关注的问题。  
## 一、控制面 / 认证与授权：一旦失守，后面很多能力都会变成现成工具  
### 1. 恶意链接让 Control UI 自动把 token 发给攻击者  
  
**CVE-2026-25253 / GHSA-g8p2-7wf7-98mq**  
  
Control UI 曾信任 query string 中的 gatewayUrl  
，并在页面加载时自动带着已保存的 gateway token 建立 WebSocket。 结果就是：**用户只要点一次恶意链接，token 就可能被发给攻击者**  
，后者再接管本地 gateway、修改工具或 sandbox 策略，甚至实现 **1-click RCE**  
。  
  
这个漏洞最值得记住的地方有两个：  
- 就算 gateway 只绑定在 127.0.0.1  
  
- 只要浏览器里保存了 token  
  
风险依然可能成立，因为这是**受害者浏览器主动向外建立连接**  
，不是攻击者直接打入 loopback。  
  
修复版本：2026.1.29  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq  
### 2. 共享 token/password 连接可自报高权限 scope  
  
**GHSA-rqpp-rjj8-7wv8**  
  
某些共享 token/password 的 WebSocket 后端连接曾可自行声明高权限 scope，比如 operator.admin  
，从而跨越原本的授权边界。  
  
修复版本：2026.3.12  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-rqpp-rjj8-7wv8  
### 3. 配对权限可进一步铸造更高权限 token  
  
**GHSA-4jpw-hj22-2xmc**  
  
只拿到 operator.pairing  
 的调用方，曾可通过 device.token.rotate  
 铸造更高权限 token；如果节点端同时暴露了 system.run  
，就会从权限提升继续走到**真实 node RCE**  
。  
  
修复版本：2026.3.11  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-4jpw-hj22-2xmc  
### 4. trusted-proxy 模式下来源校验曾可被绕过  
  
**CVE-2026-32302 / GHSA-5wcw-8jjv-m286**  
  
在 trusted-proxy  
 模式下，浏览器来源校验曾可被代理头绕过，不受信任网页可以经反向代理继承认证身份并建立高权限 operator 会话。  
  
修复版本：2026.3.11  
 参考：https://github.com/advisories/GHSA-5wcw-8jjv-m286  
  
这一类问题共同说明了一件事： **控制面不是普通管理后台，它是 agent 的总开关。**  
## 二、执行面 / Browser / SSRF / Secrets：只要能驱动工具，影响就可能直接落到宿主机和浏览器身份上  
### 1. node.invoke 注入可绕过 exec approvals  
  
**GHSA-gv46-4xfq-jv58**  
  
authenticated gateway client 曾可在 node.invoke  
 路径里通过内部控制字段注入，绕过 node host exec approvals，直接达到 **RCE**  
。  
  
修复版本：2026.2.14  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-gv46-4xfq-jv58  
### 2. system.run 环境清洗不完整  
  
**GHSA-xgf2-vxv2-rrmg**  
  
system.run  
 的环境清洗不完整，攻击者可借 HOME  
、ZDOTDIR  
 等 shell 启动环境变量先执行受控启动文件，再绕过原本依赖 allowlist 的“意图限制”。  
  
修复版本：2026.2.22  
 参考：https://github.com/advisories/GHSA-xgf2-vxv2-rrmg  
### 3. browser upload 路径穿越可读本地文件  
  
**CVE-2026-26329 / GHSA-cv7m-c9jx-vg7q**  
  
browser 的 upload  
 动作曾允许绝对路径和路径穿越，Playwright 会直接读取 gateway 宿主机本地文件，再由页面 JS 或快照导出。  
  
修复版本：2026.2.14  
 参考：https://github.com/advisories/GHSA-cv7m-c9jx-vg7q  
### 4. SSRF guard 可被 IPv4-mapped IPv6 绕过  
  
**CVE-2026-26324 / GHSA-jrvc-8ff5-2f9f**  
  
SSRF guard 曾可被完整写法的 IPv4-mapped IPv6 绕过，比如 0:0:0:0:0:ffff:7f00:1  
 实际就是 127.0.0.1  
。 这意味着原本应被阻止的 loopback、metadata、私网探测可能直接穿过防护。  
  
修复版本：2026.2.14  
 参考：https://github.com/advisories/GHSA-jrvc-8ff5-2f9f  
### 5. skills.status 曾向只读客户端泄露配置值  
  
**GHSA-8mh7-phf8-xgfm**  
  
skills.status  
 曾把 requires.config  
 对应的原始解析值返回给 operator.read  
，导致 secrets 向只读客户端泄露。  
  
修复版本：2026.2.14  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-8mh7-phf8-xgfm  
### 6. 日志和会话 transcript 也可能成为侧信道  
- **GHSA-g27f-9qjv-22pm**  
：某些 WebSocket 头曾被原样写进日志，形成 log poisoning / 间接 prompt injection 风险  
  
- **GHSA-vr7j-g7jv-h5mp**  
：session transcript 文件曾未强制 user-only 权限，本地其他用户或进程可能直接读取对话内容  
  
这一类问题共同说明： **浏览器、执行工具、日志、配置值，全部都属于安全边界。**  
## 三、渠道 / 配对 / Webhook / 集成：入口越多，前置验证越重要  
### 1. Telegram webhook 预认证资源消耗  
  
**GHSA-jq3f-vjww-8rq7**  
  
Telegram webhook 曾在校验 x-telegram-bot-api-secret-token  
 之前先读 body，导致未认证请求也能消耗内存、socket 和 JSON 解析资源。  
  
修复版本：2026.3.13  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-jq3f-vjww-8rq7  
### 2. iMessage 远程附件取回命令注入  
  
**GHSA-g2f6-pwvx-r275**  
  
iMessage 远程附件经 SCP 取回时，未清洗的 remote path 可携带 shell 元字符，造成命令注入。  
  
修复版本：2026.3.13  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-g2f6-pwvx-r275  
### 3. pairing QR / setup code 曾携带长期共享凭证  
  
**GHSA-7h7g-x2px-94hj**  
  
老版本 /pair  
 与 openclaw qr  
 生成的 setup code 曾直接嵌入长期共享的 gateway token/password，而不是短期 bootstrap token。 一旦聊天记录、截图或 QR payload 泄露，旧凭证就可能被重放。  
  
修复版本：2026.3.12  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-7h7g-x2px-94hj  
  
这一类问题提醒我们： **渠道接入不是“多一个入口”，而是多一整层攻击面。**  
## 四、供应链 / Skills / Workspace：最容易被低估，但最接近“直接执行代码”  
### 工作区插件自动发现导致本地代码执行  
  
**GHSA-99qw-6mr3-36qr**  
  
OpenClaw 曾自动从当前 workspace 的 .openclaw/extensions/  
 中发现并加载插件，不需要显式 trust/install。 攻击者只要让你在一个恶意仓库目录里运行 OpenClaw，就可能触发代码执行。  
  
修复版本：2026.3.12  
 参考：https://github.com/openclaw/openclaw/security/advisories/GHSA-99qw-6mr3-36qr  
  
而官方 Trust 页面本身已经把话说得很直白：  
> skills are code that runs in your agent’s context  
  
  
翻译成人话就是：  
  
**装 skill = 装本地可执行代码**  
  
这不是理论上的担忧。公开报道已经提到过 ClawHub 上出现成批恶意 skills 的案例。 所以对防守者来说，这不是“社区生态的问题”，而是标准的供应链风险。  
## 这些漏洞共同说明了什么  
  
可以把 OpenClaw 的核心风险概括成一句话：  
  
**一旦不受信任输入能驱动有权限的 agent，后面连接的就不是聊天框，而是真工具、真浏览器、真文件系统、真外部账号。**  
  
这也是为什么 OpenClaw 不应该被简单理解成“天然适合多人共享的团队机器人平台”。 官方安全页已经明确说了：如果多个人可以给同一个启用了工具的 agent 发消息，他们都能在该 agent 已有权限范围内 steering 它。  
  
把一个高权限 agent 丢进开放群聊，很多时候不是高可用，而是**高风险默认**  
。  
# 安全方法与最安全安装：不是“把提示词写严一点”，而是把边界收紧  
  
下面进入最关键的部分：如果你不是在做漏洞研究，而是想把它**尽可能安全地用起来**  
，应该怎么做。  
## 1）版本基线：现在不要研究“哪个旧版本还能凑合用”  
  
截至 **2026 年 3 月 15 日**  
，GitHub Releases 显示当前最新正式版是 **openclaw 2026.3.13**  
。 今天的保守做法不是停在 2026.3.11  
 或 2026.3.12  
，而是：  
  
**至少直接到 2026.3.13。**  
  
原因很简单：  
- 2026.3.11  
 修了 trusted-proxy  
 相关浏览器来源校验问题  
  
- 2026.3.12  
 修了共享认证 scope 提权、pairing 长期凭证、workspace 插件自动加载  
  
- 2026.3.13  
 又修了 Telegram webhook 预认证资源消耗、iMessage SCP path 注入等问题  
  
所以现在最稳妥的答案不是“先上旧版再说”，而是直接以 2026.3.13  
 为基线。  
  
参考：https://github.com/openclaw/openclaw/releases  
## 2）部署思路先改过来：OpenClaw 更像一台“会说话的自动化主机”  
  
官方安全文档其实已经给出了正确心智模型：  
- 你的 AI 助手会执行 shell、读写文件、访问网络、向外发消息  
  
- 给它发消息的人会尝试社会工程、探测基础设施、诱导它泄露数据  
  
- 真正的事故往往不是“高深漏洞利用”，而是“有人给机器人发了一句指令，机器人就真去做了”  
  
所以安全方法不能只依赖提示词，而要围绕**缩小可触达面**  
来设计。  
## 3）最稳妥的安装形态：专用主机 / 专用 OS 用户 + Docker 非 root  
  
官方 Docker 文档说明，默认镜像是**安全优先**  
的：  
- 容器内以非 root node  
 用户运行  
  
- 默认没有 Homebrew  
  
- 默认没有预装 Chromium / Playwright  
  
- 改成 root 是明确的安全权衡  
  
对多数生产部署来说，这比直接在个人工作机上全局装依赖要稳。  
  
推荐安装方式：  
```
git clone https://github.com/openclaw/openclaw.git  cd openclaw  git fetch \--tags  git checkout v2026.3.13-1export OPENCLAW\_HOME\_VOLUME\="openclaw\_home"./docker-setup.sh
```  
  
这条路径的重点不只是“能跑”，而是：  
- 版本固定  
  
- 环境容器化  
  
- 默认非 root  
  
- 易于回滚  
  
- 易于审计  
  
如果是共享主机，官方建议优先使用**专用 OS 用户**  
；要更强隔离，直接上**单独主机**  
。  
  
参考：https://docs.openclaw.ai/zh-CN/install/docker  
## 4）源码或全局安装也有安全差异：pnpm 的“显式批准脚本”反而更稳  
  
如果你不用 Docker，而是用 npm / pnpm 裸装，那么安全上也有差别。  
  
官方安装文档指出，pnpm 在首次安装时会拦下 build scripts，需要你显式执行：  
```
pnpm add \-g openclaw@2026.3.13pnpm approve-builds \-g  pnpm add \-g openclaw@2026.3.13openclaw onboard \--install-daemon
```  
  
从安全角度看，这反而是优点，因为你至少被迫确认一次安装脚本。 相比一路 npm install -g ...@latest  
，这种方式更可审计一些，尤其是在你本身就关心供应链风险的时候。  
  
参考：https://docs.openclaw.ai/zh-CN/install  
## 5）控制面先收口：Gateway 只给可信路径碰  
  
官方安全建议非常明确：  
- 推荐把 Gateway 保持在 **loopback-only**  
  
- 不要直接绑到公网  
  
- 不要直接反代暴露出去  
  
- 远程访问优先用 **SSH tunnel / Tailscale / VPN**  
  
- Gateway 默认就应该要求认证  
  
所以最稳的做法不是“把 0.0.0.0:18789  
 暴露出来再补救”，而是：  
  
**Gateway 只监听 loopback + token/password 认证 + 远程访问走 SSH / Tailscale**  
  
推荐配置：  
```
{    gateway: {      mode: "local",      bind: "loopback",      port: 18789,      auth: {        mode: "token",        token: "REPLACE\_WITH\_LONG\_RANDOM\_TOKEN",        allowTailscale: false    }    }  }
```  
  
如果需要远程访问，最稳的一种方式是：  
```
ssh \-N \-L 18789:127.0.0.1:18789 user@your-openclaw-host
```  
  
# 然后在本地浏览器打开 http://127.0.0.1:18789  
  
这样 Gateway 本身仍然只在远端主机的 loopback 上监听，公网只看到 SSH。  
  
参考：  
- https://docs.openclaw.ai/zh-CN/gateway  
  
- https://docs.openclaw.ai/zh-CN/gateway/security  
  
-   
- *  
  
## 6）为什么我不建议你轻易上 trusted-proxy  
  
trusted-proxy  
 不是“更高级的标准做法”，而是**安全敏感功能**  
。  
  
原因很现实：  
- GHSA-5wcw-8jjv-m286  
 已证明，受影响版本中 trusted-proxy  
 模式下浏览器来源校验可被绕过  
  
- 不受信任网页可以经代理继承认证身份，建立高权限 operator 会话  
  
- 代理头、来源校验、认证边界一旦理解不清，就很容易把控制面暴露出去  
  
因此，如果你不是非常明确知道自己在做什么，**宁可 SSH 隧道，也别先上反代直出**  
。  
  
如果你确实必须用反代，至少要同时做到：  
1. 正确配置 gateway.trustedProxies  
  
1. 让代理**覆盖**  
而不是追加 X-Forwarded-For  
  
1. 如果你自己的反代在前面终止 TLS，就关闭 gateway.auth.allowTailscale  
  
## 7）Control UI 的“方便调试开关”，很多时候正是事故开关  
  
官方安全页专门提醒了两个开关：  
- gateway.controlUi.allowInsecureAuth  
- gateway.controlUi.dangerouslyDisableDeviceAuth  
前者会退回到只靠 token 认证并跳过设备配对；后者更是直接禁用设备身份检查。 官方对后者的定性非常直接：这是**严重安全降级**  
。  
  
所以经验上就一句话：  
  
**除了临时排障，不要长期打开。**  
  
尤其当你已经把 gateway 放到非 loopback 或放在反代后面时，这类“省事开关”会把原本至少还在的一层设备校验直接抹掉。  
## 8）入口收紧：谁能给它发话，比模型多聪明更重要  
  
OpenClaw 最怕的不是“黑客突然远程进来”，而是“本来就能在群里说话的人，顺手把机器人也带上了”。  
  
官方建议非常实用：  
- 私信默认 pairing  
  
- 群组默认 requireMention: true  
  
- 多人可私信的场景，打开 session.dmScope: "per-channel-peer"  
  
推荐配置：  
```
{  channels: {      whatsapp: {        dmPolicy: "pairing",        groups: {          "\*": { requireMention: true }        }      },      telegram: {        dmPolicy: "pairing",        groups: {          "\*": { requireMention: true }        }      }    },  session: {      dmScope: "per-channel-peer"  }  }
```  
  
这套配置做了三件事：  
- 未经批准的私信先不能直接驱动 agent  
  
- 群聊里不 @ 它，它不响应  
  
- 不同发送者不共享上下文  
  
这比“在提示词里写一句你要谨慎”有效得多。  
## 9）工具先砍到最小：不要一上来就给 browser、exec、cron、nodes  
  
官方工具文档提供了多个 profile：  
- minimal  
- coding  
- messaging  
- full  
对于大多数非开发专用场景，最稳的起点不是 coding  
，更不是 full  
，而是：  
  
**全局先用 messaging，然后显式 deny 掉高危能力。**  
  
推荐基线：  
```
{  tools: {      profile: "messaging",      deny: \[        "group:runtime",        "browser",        "gateway",        "cron",        "nodes",        "web\_fetch",        "web\_search"    \]    }  }
```  
  
这段配置的意义很直接：  
- 默认只保留消息能力  
  
- 先把执行、浏览器、网关、定时任务、节点和外部抓取全部封死  
  
- 以后真要用，再单独给 owner-only agent 打开  
  
不要从“万能 Bot”开始，而要从“默认什么都不能碰”开始。  
## 10）把能力拆成不同 agent，比让一个 agent 学会克制更可靠  
  
最实用的方法不是做一个什么都能干的 agent，而是拆成几类：  
- **owner agent**  
：你自己用，可以给更高权限  
  
- **reader agent**  
：只负责读资料、读会话、做总结，不给写入和执行  
  
- **public/team agent**  
：只保留消息能力，不给文件系统、浏览器、节点、定时任务  
  
例如一个只读型 reader agent 可以这样配：  
```
{  agents: {      list: \[        {          id: "reader",          sandbox: {            mode: "all",            scope: "session",            workspaceAccess: "ro"        },          tools: {            allow: \["read", "sessions\_list", "sessions\_history", "session\_status"\],            deny: \[              "write",              "edit",              "apply\_patch",              "exec",              "process",              "browser",              "gateway",              "cron",              "nodes"          \]          }        }      \]    }  }
```  
  
这比“一个 agent 全都能干，再靠提示词要求它自律”稳得多。  
## 11）沙箱一定要开，而且要开对  
  
官方沙箱文档写得很清楚：  
- OpenClaw 可以把工具执行放进 Docker 容器  
  
- 沙箱不是完美边界，但能显著限制文件系统和进程访问范围  
  
- 如果沙箱关闭，工具就在主机上运行  
  
- tools.elevated  
 会绕过沙箱，直接落到宿主机  
  
对多数人来说，真正要吃透的是三个字段：  
- mode  
- scope  
- workspaceAccess  
推荐生产基线：  
```
{    agents: {      defaults: {        sandbox: {          mode: "all",          scope: "session",          workspaceAccess: "none"      }      }    }  }
```  
  
它的含义是：  
- mode: "all"  
：所有会话都进沙箱，不留“主会话跑宿主机”的口子  
  
- scope: "session"  
：一会话一容器，不共享执行环境  
  
- workspaceAccess: "none"  
：默认看不到真实工作区  
  
如果要做“能看代码但不能改代码”的审计型 agent，再单独把 workspaceAccess  
 升到 "ro"  
。  
  
还有几个经常被忽略的点：  
- 默认 docker.network  
 是 "none"  
，也就是沙箱容器默认没网络出口  
  
- binds  
 会把宿主机路径直接挂进去，等于主动绕过沙箱文件系统边界  
  
- tools.elevated  
 本质上就是沙箱逃逸口，绝不能给陌生发送者  
  
-   
- *  
  
## 12）浏览器控制不是“自动化功能”，而是“带登录态的远程手”  
  
官方安全页对 browser control 的措辞已经很重了：  
> 如果浏览器 profile 里已经有登录会话，模型就能访问这些账户和数据。  
  
  
所以浏览器配置文件必须被当成敏感状态。 最稳的习惯是：  
1. 日常浏览器不用来长期控制 OpenClaw  
  
1. 专门建一个 openclaw  
 浏览器 profile  
  
1. 这个 profile 不登录私人邮箱  
  
1. 不接私人密码管理器  
  
1. 不做浏览器同步  
  
1. 下载目录隔离  
  
1. 不需要 browser 工具时，直接 deny  
  
这不是“麻烦”，而是把“你的人类 Web 身份”和“AI 可驱动的 Web 身份”拆开。  
## 13）节点要按管理员权限对待：paired macOS node 本质就是远程代码执行  
  
官方安全页写得非常直白：paired macOS node 上的 system.run  
 本质上就是**远程代码执行**  
。 如果你不想要这个能力：  
- 直接 deny system.run  
  
- 不需要就移除该节点配对  
  
- 不把 node 暴露给公开或半公开 agent  
  
如果浏览器和 node 在另一台机器上，最好也把它们只放在同一 tailnet 或受控内网里，不要为了“方便”开到 LAN 或公网。  
## 14）日志、转录、mDNS、文件权限：别让“辅助数据”变成侧门  
  
很多人部署时只盯着端口，忽略了磁盘和广播信息本身也是攻击面。  
  
官方安全页明确说明，~/.openclaw/  
 下很多内容都可能包含敏感数据：  
- openclaw.json  
- credentials/**  
- auth-profiles.json  
- sessions/**  
- extensions/**  
- sandboxes/**  
官方建议也很直接：  
- 目录权限 700  
  
- 文件权限 600  
  
- 开启全盘加密  
  
- 共享主机优先使用专用 OS 用户  
  
推荐执行：  
```
chmod 700 ~/.openclaw  find ~/.openclaw \-type f \\( \-name '\*.json' \-o \-name '\*.jsonl' \\) \-exec chmod 600 {} \\;日志方面，建议保持：{    logging: {      redactSensitive: "tools",      redactPatterns: \[        "sk-\[A-Za-z0-9\_-\]+",        "xox\[baprs\]-\[A-Za-z0-9-\]+"    \]    }  }
```  
  
同时，OpenClaw 还会通过 mDNS / Bonjour 做本地发现。 完整模式下，TXT 记录里可能包含 cliPath  
、sshPort  
、displayName  
、lanHost  
 等运营细节。 对暴露型 gateway，建议至少：  
```
{    discovery: {      mdns: { mode: "minimal" }    }  }
```  
  
如果不需要本地发现，直接 off  
 更稳。  
## 15）Plugins / Skills / Workspace：都按“执行代码”管理，不按“装扩展”管理  
  
这一点值得重复很多次：  
  
**skills 是代码，plugins 是代码，workspace extensions 也是代码。**  
  
安全方法也因此非常朴素：  
- 不在不可信 Git 仓库目录里直接运行 OpenClaw  
  
- 不把 skills / plugins 当配置文件看  
  
- 安装时使用固定版本，而不是 latest  
  
- 启用前先审查落盘代码  
  
- 优先使用显式白名单，而不是自动发现  
  
可以直接做的审查动作：  
```
\# 审查当前仓库中可能被加载的工作区扩展  find . \-path '\*/.openclaw/extensions/\*' \-type f | sort  \# 审查本地已安装扩展  find ~/.openclaw/extensions \-maxdepth 3 \-type f | sort  \# 审查当前目录下 skills  \[ \-d ./skills \] && find ./skills \-maxdepth 2 \-type f | sort
```  
  
这几步不花哨，但基本能挡住一大类最实际的供应链踩坑。  
## 16）一个适合多数人直接开用的“安全默认”配置  
  
下面这份配置不是官方逐字模板，而是结合官方网关安全页、工具、沙箱文档和近期漏洞修复逻辑收紧后的**中级用户保守基线**  
：  
```
{  gateway: {      mode: "local",      bind: "loopback",      port: 18789,      auth: {        mode: "token",        token: "REPLACE\_WITH\_LONG\_RANDOM\_TOKEN",        allowTailscale: false    }    },  discovery: {      mdns: { mode: "minimal" }    },  session: {      dmScope: "per-channel-peer"  },  tools: {      profile: "messaging",      deny: \[        "group:runtime",        "browser",        "gateway",        "cron",        "nodes",        "web\_fetch",        "web\_search"    \]    },  agents: {      defaults: {        sandbox: {          mode: "all",          scope: "session",          workspaceAccess: "none"      }      },      list: \[        {          id: "reader",          sandbox: {            mode: "all",            scope: "session",            workspaceAccess: "ro"        },          tools: {            allow: \["read", "sessions\_list", "sessions\_history", "session\_status"\],            deny: \[              "write",              "edit",              "apply\_patch",              "exec",              "process",              "browser",              "gateway",              "cron",              "nodes"          \]          }        }      \]    },  channels: {      whatsapp: {        dmPolicy: "pairing",        groups: { "\*": { requireMention: true } }      },      telegram: {        dmPolicy: "pairing",        groups: { "\*": { requireMention: true } }      }    },  logging: {      redactSensitive: "tools"  }  }
```  
  
这份配置做的事情其实非常明确：  
- **入口收紧**  
：未知私信先配对，群里不 @ 不响应  
  
- **会话隔离**  
：不同人不共享私信上下文  
  
- **能力收紧**  
：默认只保留消息能力  
  
- **执行隔离**  
：所有会话都进沙箱  
  
- **数据收紧**  
：默认看不到真实工作区  
  
- **日志收紧**  
：工具输出默认脱敏  
  
这基本就是把官方推荐的几条安全原则，用一份更适合真实部署的配置落了下来。  
## 17）已经部署了怎么补救：按“止血—轮换—审计”来  
  
如果你已经部署了一段时间，尤其是中途开过公网、反代、pairing QR 截图、公群常驻、插件安装，那么补救建议按这个顺序走。  
### 第一步：先止血  
  
先做最现实的事：  
- 升级到 2026.3.13  
  
- 暂时停掉 browser / nodes / runtime / cron / gateway / web_fetch / web_search  
  
- 如果有公网或反代暴露，先退回 loopback  
  
### 第二步：再轮换凭证  
  
如果你曾经：  
- 把 pairing QR / setup code 发进群聊  
  
- 发过截图  
  
- 用过旧版 /pair  
  
- 在老版本 Control UI 上点过可疑链接  
  
- 在 trusted-proxy 场景下对外暴露过控制面  
  
那就应该默认 gateway token/password **可能已经泄露**  
。  
  
可以这样做：  
  
openssl rand -hex 32  
  
# 生成新 token，更新 openclaw.json 或环境变量  
  
# 重启 gateway  
  
# 更新所有远程客户端保存的旧 token  
### 第三步：跑安全审计  
  
openclaw security audit  
  
openclaw security audit --deep  
  
openclaw security audit --fix  
  
官方说明这个审计器会检查：  
- gateway 认证暴露  
  
- 浏览器控制暴露  
  
- 文件权限  
  
- 日志脱敏  
  
- 群组开放策略  
  
- 本地高危配置  
  
如果怀疑已经被入侵，还应额外检查：  
- gateway 日志  
  
- ~/.openclaw/agents/<agentId>/sessions/*.jsonl  
- extensions/  
- 最近的配置变化  
  
- 保存过旧 token 的客户端  
  
-   
- *  
  
## 最后一句话：OpenClaw 最有效的安全方法，不是“让模型更听话”  
  
对 OpenClaw 来说，真正有效的安全方法其实只有四条：  
1. **入口最小化**  
：默认配对，群里必须 @，多人私信分会话  
  
1. **工具最小化**  
：先 messaging  
，高危工具默认 deny  
  
1. **执行隔离化**  
：所有会话进沙箱，默认不见工作区  
  
1. **状态分离化**  
：专用浏览器 profile、专用 OS 用户、最好专用主机  
  
这四条，几乎覆盖了官方安全页、沙箱文档、工具文档和近几个月公开漏洞真正暴露出来的问题。  
  
如果只记住一句话，那就是：  
> **不要把 OpenClaw 当成一个普通聊天机器人。它更像一台会说话、会执行、会联网、还能接浏览器和节点的自动化主机。**  
  
  
而对这样的系统，最安全的默认值永远不是“全开”，而是：  
  
**最新版本、loopback 绑定、显式认证、最小工具集、全量沙箱、专用环境、只给可信发送者。**  
## 参考资料  
- OpenClaw Releases https://github.com/openclaw/openclaw/releases  
  
- OpenClaw GitHub Security Overview https://github.com/openclaw/openclaw/security  
  
- OpenClaw Trust https://trust.openclaw.ai/trust/zh-cn  
  
- OpenClaw Threat Model https://trust.openclaw.ai/trust/threatmodel  
  
- Gateway Security https://docs.openclaw.ai/zh-CN/gateway/security  
  
- Gateway 文档 https://docs.openclaw.ai/zh-CN/gateway  
  
- Tools 文档 https://docs.openclaw.ai/zh-CN/tools  
  
- Sandboxing 文档 https://docs.openclaw.ai/zh-CN/gateway/sandboxing  
  
- Docker 安装文档 https://docs.openclaw.ai/zh-CN/install/docker  
  
- 安装文档 https://docs.openclaw.ai/zh-CN/install  
  
- GHSA-g8p2-7wf7-98mq  
 https://github.com/openclaw/openclaw/security/advisories/GHSA-g8p2-7wf7-98mq  
  
- GHSA-5wcw-8jjv-m286  
 https://github.com/advisories/GHSA-5wcw-8jjv-m286  
  
- GHSA-rqpp-rjj8-7wv8  
 https://github.com/openclaw/openclaw/security/advisories/GHSA-rqpp-rjj8-7wv8  
  
- GHSA-4jpw-hj22-2xmc  
 https://github.com/openclaw/openclaw/security/advisories/GHSA-4jpw-hj22-2xmc  
  
- GHSA-7h7g-x2px-94hj  
 https://github.com/openclaw/openclaw/security/advisories/GHSA-7h7g-x2px-94hj  
  
- GHSA-99qw-6mr3-36qr  
 https://github.com/openclaw/openclaw/security/advisories/GHSA-99qw-6mr3-36qr  
  
- NVD: CVE-2026-25253  
 https://nvd.nist.gov/vuln/detail/CVE-2026-25253  
  
****## 其他文章推荐  
- 实战揭秘，315晚会提到的GEO大模型投毒手法起底  
  
https://forum.butian.net/ai_security/72  
  
- 浅谈OpenClaw：架构、全维度风险与安全防护策略  
  
https://forum.butian.net/ai_security/69  
  
- ### 攻防视角下的 OpenClaw 部署风险与安全基线构建  
  
https://forum.butian.net/ai_security/59  
  
审核兑奖条件  
  
**【END】**  
  
  
  
奇安信攻防社区是奇安信补天漏洞响应平台为用户打造的技术交流分享平台，社区以促进攻防技术的切磋与交流为目标，将安全技术、实战攻防经验与大家交流共享，以分享促成长，提升实战化攻防技术。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/WdbaA7b2IE4IkqBYefOa5DoTfL5vEib1NazOOg40MIyE1sDVZnLBf9VkbChug6UtmpfSVib2zzerFibYS6MTaOs7A/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=7 "undefined")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/WdbaA7b2IE4IkqBYefOa5DoTfL5vEib1NjXlNDbU9P1iaEpq1gCmZqbEvcLRHUX01rQmjQib2Flor5iaIw81rfIrxg/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=8 "")  
  
**# 奇安信攻防社区**  
  
浏览热门及最新文章  
  
探索攻防新思路  
  
  
