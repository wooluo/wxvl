#  Cisco 网络管理组件曝 DoS 漏洞，网络控制面不能只靠“重启恢复”  
 汇能云安全   2026-05-08 03:31  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/AyvgaRYHWDaF0SQofzkQVxwtUiczJYI2hfgPy2eFOk9fN4XTegzpwuL4U25OibFZbpiciaqEapDrUaM42m0PIApwUhwl2AXFWju2t1LqDVvgb78/640?wx_fmt=jpeg&from=appmsg "")  
  
**5****月****8****日，星期五****，您好！中科汇能与您分享信息安全快讯：**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AyvgaRYHWDZ11H6FUg73wegvpicZwgYHsTJ28WkDXME6FmIL7D8tDXc7DwCQtPbvBwELL7mXtKQSbIS8MIEfOle2XaewE0oX6mlfud4Za4Dc/640?wx_fmt=gif&from=appmsg "")  
  
**01**  
  
**Ivanti EPMM 0day 被真实利用，移动设备管理平台再次成为高价值入口**  
  
  
**Ivanti 披露其 Endpoint Manager Mobile（EPMM）存在多项漏洞，其中 CVE-2026-6973 已被确认遭到有限在野利用。**  
该漏洞影响本地部署版 EPMM，不影响 Ivanti Neurons for MDM 等云产品，由于 EPMM 属于企业移动设备管理基础设施，一旦被攻击者拿下，后续可能影响终端管理、策略下发和企业移动接入安全。建议本地部署用户立即安装补丁，并检查 Apache 访问日志中是否存在异常利用痕迹。  
  
  
**02**  
  
**Palo Alto PAN-OS 漏洞被 CISA 列入已知利用目录码**  
  
  
CISA 警告称，Palo Alto Networks PAN-OS 存在 CVE-2026-0300 漏洞，攻击者可在未认证情况下通过特制数据包触发 User-ID Authentication Portal 中的越界写入问题，并以 root 权限执行任意代码。  
**该漏洞已被加入 CISA KEV 已知被利用漏洞目录，受影响设备包括 PA-Series 与 VM-Series 防火墙。**  
建议立即限制 Captive Portal 暴露面，并等待官方固件修复。  
  
  
**03**  
  
**Cisco 网络管理组件曝 DoS 漏洞，网络控制面不能只靠“重启恢复”**  
  
  
Cisco 披露 Crosswork Network Controller 和 Network Services Orchestrator 存在 CVE-2026-20188 漏洞，CVSS 评分 7.5。该漏洞属于资源消耗问题，攻击者可在未认证远程条件下持续发送大量连接请求，耗尽目标系统连接资源，导致 CNC 和 NSO 无响应。更麻烦的是，系统无法自动恢复，需要管理员手动重启，  
**对运营商、企业网络和大型数据中心来说，这类问题不一定直接导致数据泄露，却可能让网络管理面陷入瘫痪，影响变更、调度和故障处置。**  
Cisco 表示目前没有可用变通措施，修复方式就是升级到受影响版本之外的官方修复版本。  
  
  
**04**  
  
**假冒 Claude AI 安装页投毒，AI 工具热度正在被黑产反向利用**  
  
  
攻击者正在利用假冒 Claude AI 安装页面诱导用户运行恶意命令，该活动被称为 InstallFix 或 Fake Claude Installer，攻击者通过 Google Ads 将仿冒页面推到搜索结果前列，专门拦截搜索“Claude Code”“Claude Code install”的用户。  
**页面会根据 Windows 或 macOS 给出看似正常的安装命令，一旦用户复制执行，攻击链就会开始收集系统信息、关闭安全功能、创建计划任务，并连接攻击者控制的服务器。**  
这个事件的警示点很明确：黑产已经不只盯漏洞，也在盯 AI 工具的使用习惯。开发者越习惯复制命令安装工具，越需要确认来源。  
  
  
**05**  
  
**WatchGuard Agent 漏洞可提权到 SYSTEM，终端安全组件自身也要打补丁**  
  
  
WatchGuard 发布紧急安全更新，修复 Windows 版 WatchGuard Agent 中多项高危漏洞。其中 CVE-2026-6787 和 CVE-2026-6788 可被串联利用，实现本地权限提升，最终获得 NT AUTHORITY\SYSTEM 权限；另有 CVE-2026-41288 与补丁管理组件权限配置错误有关，低权限用户也可能借此提权。更值得注意的是，相关 Agent 还存在网络侧缓冲区溢出问题，可被同一局域网内未认证攻击者触发拒绝服务。  
**安全软件本身一旦存在提权漏洞，就会变成攻击者关闭监控、植入持久化、隐藏管理员账号的工具。**  
建议升级至 WatchGuard Agent 1.25.03.0000。  
  
  
**06**  
  
**Redis 多个漏洞可导致远程代码执行，认证访问并不等于安全**  
  
  
Redis 被披露 5 个危险漏洞，影响 Redis Cloud、Redis Software 和开源社区版本。  
**虽然这些漏洞均需要认证访问才能利用，但成功利用后可能导致任意代码执行、系统完全失陷、数据外泄或服务中断。**  
其中 CVE-2026-23479 涉及 unblock client 流程中的 use-after-free，CVE-2026-25243 则影响 RESTORE 命令，攻击者可通过构造特殊序列化载荷触发内存访问问题。很多企业容易把“需要认证”理解为风险较低，但 Redis 往往承载缓存、会话、队列和业务中间数据，一旦凭据泄露或内部账号被滥用，后果会迅速扩大。  
  
  
**07**  
  
**假Google 广告窃取GoDaddy ManageWP 凭证，一个账号可能牵出上百个网站**  
  
  
攻击者正在滥用 Google Ads 投放假冒 ManageWP 登录入口，窃取 GoDaddy ManageWP 用户凭证。ManageWP 是 WordPress 网站集中管理平台，一个账号往往连接几十甚至上百个客户站点，因此它的账号价值远高于普通网页登录密码。研究人员称，  
**该钓鱼活动会把虚假赞助结果放在真实搜索结果上方，用户点击后进入几乎完全仿真的登录页，攻击者还会通过 AiTM 技术实时转发凭证和二次验证码，使传统 2FA 失效。**  
对网站运维和数字营销公司来说，最直接的建议是：不要从搜索广告进入后台，固定收藏官方登录地址，并优先使用硬件安全密钥。  
  
  
**08**  
  
**28款假通话记录 App 下载超730万次，Google Play 也不能只看“上架可信”**  
  
  
ESET 研究人员发现，28 款伪装成“通话记录查询”的 Android 应用曾在 Google Play 累计获得超过 730 万次下载。  
**这些应用号称可以查询任意号码的通话历史，实际展示的是提前编造的假数据，再诱导用户付费解锁完整记录，部分应用使用 Google Play 官方支付，部分跳转到第三方 UPI 支付，还有的直接在 App 内嵌银行卡支付表单。**  
这个事件虽然不是传统意义上的木马大规模窃密，但它说明应用商店审核并不能完全阻止诈骗型应用。对普通用户来说，凡是声称能查询他人通话记录、短信或社交数据的工具，本身就应视为高风险。  
  
  
**09**  
  
**恶意 NuGet 包盯上浏览器凭证、SSH 私钥和加密钱包，开发供应链风险继续升温**  
  
  
NuGet 生态中发现一批恶意软件包，攻击者将 5 个恶意包伪装成中文企业环境中常见的软件库，并建立在真实可用代码之上，从而降低开发者警惕。Socket.dev 研究人员称，这些包累计下载约 64784 次，攻击可追溯到 2025 年 9 月。  
**恶意代码会在常规 package restore 后自动触发，随后执行二阶段窃密程序 we4ftg.exe，收集浏览器密码、Cookie、支付卡、SSH 私钥、Outlook 配置、加密钱包和桌面文件。**  
开发团队应检查项目文件和 lock 文件中是否出现相关包名，一旦命中，应视为机器已失陷并立即轮换密钥。  
  
  
10  
  
**vm2 沙箱库连续曝严重逃逸漏洞，不可信代码不能只靠一个 npm 包兜底**  
  
  
Node.js 沙箱库 vm2 被披露 12 个严重漏洞，攻击者可突破沙箱限制，在宿主机执行任意代码；Cyber Security News 也报道，vm2 多个漏洞影响 3.11.1 及以下版本，涉及 sandbox escape、原型污染、child_process 绕过等风险。  
**vm2 常用于在线代码执行、插件系统、CI 流水线和多租户云服务，它的核心价值就是把不可信 JavaScript 隔离在沙箱内。**  
但这批漏洞说明，单一语言级沙箱很难长期承担完整安全边界。生产环境如果必须执行不可信代码，除了升级至 3.11.2，还应叠加容器、虚拟化、最小权限和网络隔离。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AyvgaRYHWDbS9iarHAPbWQVCwXCygF8fDpYg66IV8Axicyiadty9xcXsicPiba4cTl6soFGMlsQAypibrpvKeRqVh33CcQpHFJE5Bgm44PsEVWpQU/640?wx_fmt=gif&from=appmsg "")  
  
信息来源：人民网 国家计算机网络应急技术处理协调中心 国家信息安全漏洞库 今日头条 360威胁情报中心 中科汇能GT攻防实验室 安全牛 E安全 安全客 NOSEC安全讯息平台 火绒安全 亚信安全 奇安信威胁情报中心 MACFEESy mantec白帽汇安全研究院 安全帮  卡巴斯基 安全内参 安全学习那些事 安全圈 黑客新闻 蚁景网安实验室 IT之家IT资讯 黑客新闻国外 天际友盟  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/AyvgaRYHWDZnOnmhqdYkVQzYYCD1npL4AIDjbqtmWZxOUT04iaTXyTQyYM3H7V7JE1tUibibSibheI9gD9vklOjh2FAQw1ibSlYjImXrOibz2ttD4/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=3 "")  
  
本文版权归原作者所有，如有侵权请联系我们及时删除  
  
