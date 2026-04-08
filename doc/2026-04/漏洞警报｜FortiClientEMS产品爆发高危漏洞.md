#  漏洞警报｜FortiClientEMS产品爆发高危漏洞  
原创 千里
                    千里  东方隐侠安全团队   2026-04-07 12:49  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/AwziaxUyibcNjcxugBXBje6ofcDFj6icKjnbHE1VWVweKfIQaHg4VpndLKG3HxeGwwmSMZQLcNdFwhaMHOia6icXmI9WIicD3vpbZTWDsXiaoCXia7A/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
  
01  
  
当前事件  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNgkatmTS5nSQy7bPmcLoC1K0waGf5uP8LrVvWdqNibVZZibEx9f3z8vt3SGGxx9kJMDRwvbxPLHd1FqVC6WdvzXgBXmLrTaNjg30/640?wx_fmt=gif&from=appmsg "")  
  
  
  
4月4日，Fortinet 发布紧急 hotfix，修复 FortiClient EMS 的一个 API 认证与授权绕过漏洞，编号 CVE-2026-35616，CVSS 9.1。  
  
![Details of CVE-2026-35616 (SOCRadar Vulnerability Intelligence)](https://mmbiz.qpic.cn/sz_mmbiz_png/AwziaxUyibcNgkFeuHJJAe1ZcFyBGNrEe5fKCRkdpPiaoD5mzk77CWHA97yf6gkBlAKGp3wKwBPuQggRQ2TplGiajUW1wHvrwaz8ubWyE0IuysQ/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
Fortinet 在官方 advisory（FG-IR-26-099）中描述为：未认证攻击者可通过构造请求，在无需任何凭证的情况下执行未授权代码或命令，漏洞影响级别为"权限提升"（Escalation of Privilege）。Fortinet 表示已观察到在野利用，CISA 后续在2026年4月6日将其加入已知被利用漏洞目录（KEV）。  
  
具体时间线：某蜜罐厂商在3月31日记录到针对该漏洞的可疑利用活动，彼时正值 Easter 假期，Fortinet 在4月4日才发布 hotfix。  
  
CISA 在4月6日要求联邦机构在4月9日前完成修复。  
  
受影响版本为 FortiClient EMS  
 7.4.5 和 7.4.6，对应 hotfix 编号分别为 7.4.5.2111 和 7.4.6.2170，从 Fortinet 官方支持门户获取。7.4.7 为后续正式版本路线，非当前可执行补丁。  
  
  
02  
  
暴露面与利用逻辑  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AwziaxUyibcNia45iaM7Xf6TYvic4SsPOXnXWRRRYHOvgaQB1nEj0HD1w5r2picuTibCXvlEfgOuTicBsL4cicb3iaUEPPYNL6CCbFC0y4Y2zolGHpnNo/640?wx_fmt=gif&from=appmsg "")  
  
  
  
FortiClient EMS 是 Fortinet 终端安全管理体系的协调节点，部署在 Windows 服务器上，负责向托管终端下发安全策略、验证合规状态、管理 ZTNA 遥测。  
  
![forticlient ems 儀表板](https://mmbiz.qpic.cn/sz_mmbiz_png/AwziaxUyibcNjF4opv1uickkI7jHTVDibvfEGscOSjVwialtI6y1clpEvaOqgxfE4w8FflKYm6XpuiagsvM4wmg0FAzMAeqeUltiaD5AJFPmYiaMjzg/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
2026年3月的 Shodan 和 Shadowserver 联合扫描数据显示，全球约 2,000 至 2,400 台 EMS 实例处于公网可达状态，大部分集中在美国和欧洲。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/AwziaxUyibcNgR4l7YDEbE7QibYwZD74icwF7YWgmop7IkMZ3TPOEJJxkghZCoZZiaoGKp7fdJTxt3RFebqPQadibVickwStzMqjXGu893hPD439nU/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
这类漏洞最危险的地方在于利用前提极低：攻击者只需要一个可访问的公网 IP 和一组构造好的请求，不需要窃取凭证，不需要欺骗用户，不需要任何前置条件。  
  
Fortinet 在 advisory 中给出的 CVSS 向量为 AV:N/AC:L/PR:N/UI:N——网络可达、低复杂度、无权限要求、无需用户交互，这个组合在 CVSS 计算中直接产生最高分值。  
  
放到真实环境，这个漏洞意味着：一台开着的公网 EMS 实例，加一个没打的补丁，加几行构造好的请求——攻击就能完成。  
  
  
03  
  
控制价值与接管后果  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNg0BjJ8l6G4jtynctr8ica6zlrLZ6zTGc87OyGL7B9PVvnXgm57OvwLfZ7HVicQTCwKT7ibicUhrrzrsA74T1mpFTA71UdCAj9sG9E/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Fortinet 在 advisory 中将该漏洞的影响标注为"权限提升"。结合 API 认证绕过的技术性质，攻击者可以在未认证的情况下，以 EMS 进程权限执行代码，攻击者获得的是策略分发通道的控制权。  
  
具体而言，管理员在 EMS 上的操作权限包括：向所有托管终端推送策略变更、修改合规规则、注册新终端、查询终端安全状态。攻击者控制 EMS 后，可以向所有终端下发恶意策略、将已入侵主机标记为"合规"以规避检测、向终端推送指向攻击者控制域名的配置。这些操作的本质，是用 EMS 的管理权限绕过终端安全体系的检测机制——攻击者不需要逐一渗透每台终端，只需要通过 EMS 给它们下一条指令。  
  
FortiClient EMS 同时承担 ZTNA 架构中终端身份验证和访问控制协调的角色。一旦被控，ZTNA 的信任决策基础就被破坏：攻击者可以操纵合规判定逻辑，让本不应获得访问权限的终端被标记为可信，从而绕过网络分段或访问控制策略。  
  
  
04  
  
历史后利用路径  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNg4QJNVvOzFWicdA9aHCbNia2389OVHVZ0cjwtItniaCZgWfzv9U3qOtD9fEUMCmXiaRhkW49iaUbBXdEYEoXqhVWNkfpQr6L2XLoSI/640?wx_fmt=gif&from=appmsg "")  
  
  
  
FortiClient EMS 被控之后的真实后果，我们可以从历史完整事件溯源记录窥见一二。  
  
2024 年 3 月披露的 CVE-2023-48788 中，安全厂商 Darktrace 对多起受控事件进行了事后分析，完整的攻击链如下：攻击者通过 EMS 的 SQL 注入漏洞进入服务器，启用 xp_cmdshell 获得代码执行权限后，首先部署 ScreenConnect 和 AnyDesk 等合法远程管理工具作为持久化通道；随后使用 Mimikatz 和 WebBrowserPassView 窃取本机存储的凭证；以受控服务器为跳板，向内网发起 NTLM 暴力破解，通过 PsExec 和 WMI 横移到其他主机；在至少一起事件中，攻击者于初始入侵约三周后在目标网络上部署了 Medusa 勒索软件。  
  
Horizon3.ai (http://horizon3.ai/) 在 CVE-2023-48788 披露后发布了技术 PoC，确认漏洞位于 /api/v1/init_consts 端点，SQL 注入 payload 通过 HTTP Site 头传递，未经消毒即进入后端 PostgreSQL 查询。Darktrace 的溯源分析则补充了进入内网之后的行为链：RMM 工具部署、凭证窃取、横向移动、最终数据外传或勒索。  
  
这两个来源描述的是同一个漏洞的不同阶段——Horizon3.ai (http://horizon3.ai/) 的 PoC 证明了技术可行性，Darktrace 的事后分析证明了真实攻击者正在沿着这条路径走到终点。它说明的风险逻辑是：FortiClient EMS 的漏洞从来不是一个孤立的安全事件——它是整个攻击链的起点。  
  
  
05  
  
企业现在该做什么  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNgickKawbrAofVBb0K1WVXuDuj9k81mbQexhJobjTkvXNGibpiaWicrWxyn0c6gscrYrI18DZ5QQOPEa1eHQ6c2AA7hyeficKYIAfgI/640?wx_fmt=gif&from=appmsg "")  
  
  
  
紧急修复  
  
建议运行 FortiClient EMS 7.4.5 或 7.4.6 的企业，在近期优先完成 hotfix 安装。两个版本对应不同 hotfix 编号（7.4.5 用 7.4.5.2111，7.4.6 用 7.4.6.2170），从 Fortinet 官方支持门户获取。升级至 7.4.7 是后续版本路线，不是当前修复选项。  
  
临时管控  
  
补丁未打之前，Fortinet 确认限制网络访问是有效的临时缓解手段。建议通过防火墙将 EMS 管理接口收紧至已知可信 IP 范围，切断公网直达路径。若业务模式要求 EMS 必须从互联网可达，建议至少加 VPN 或 bastion 认证作为 gating。  
  
排查是否已被利用  
  
补丁打完不代表安全。建议排查 3 月 25 日至今的 EMS 访问日志，重点关注：hotfix 上线前的异常 API 调用、未经授权的策略变更、新增管理员账号、非可信源 IP 的认证失败后仍执行的操作。EMS 服务器本机同时排查：是否有新安装的 RMM 工具（ScreenConnect、AnyDesk、Atera、Splashtop）、是否有 Mimikatz 或凭证窃取工具的痕迹、是否有异常的出站网络连接。拿下 EMS 的攻击者，目标不会是待在原地——建议假设横向移动正在发生。  
  
  
06  
  
结构性判断  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNjhzcaK9ZXCaI0vQqZCibucNbwGNnffZrXJNb7EPHSibgDLiaBuOr7mY5vntQDzw0IibYiaYicxhwnvU2OcUbOibRVLw8tnFOV1HIpyeA/640?wx_fmt=gif&from=appmsg "")  
  
  
  
FortiClient EMS 在不到两年时间内已披露多个高危未认证 RCE 类漏洞：2024 年 3 月 CVE-2023-48788（SQL 注入）、2026 年 3 月 CVE-2026-21643（SQL 注入）、2026 年 4 月 CVE-2026-35616（API 认证绕过）。虽然具体机制各有不同，但它们都落在管理平面的认证与输入处理层面。  
  
对于将 FortiClient EMS 作为零信任架构一部分的企业，这意味着一个必须重新审视的风险假设：集中管理平台的控制权限，一旦成为攻击者的目标，被控后果远远超过一台普通服务器的失陷。拿下一台数据库服务器，攻击者得到的是一个数据立足点；拿下 EMS，攻击者得到的是整个终端安全体系的分发通道。补丁必须打，但不能只靠打补丁解决——必须在这个前提下重新设计监控、隔离和响应策略。  
  
作者：东方隐侠安全团队 千里  
- 欢迎关注我们的公众号、CSDN、视频号、BiliBili账号  
  
- 如您有意加入私域圈子，也可在公众号私信联系我，我正在和小隐小侠构造中，敬请期待，谢谢～  
  
  
  
