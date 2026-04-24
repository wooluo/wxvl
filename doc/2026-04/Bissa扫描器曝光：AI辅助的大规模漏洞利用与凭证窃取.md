#  Bissa扫描器曝光：AI辅助的大规模漏洞利用与凭证窃取  
 幻泉之洲   2026-04-24 02:09  
  
> 安全人员发现一台暴露的服务器，背后是一个代号为Bissa的自动化扫描操作。核心是利用React2Shell漏洞（CVE-2025-55182），扫描数百万目标，成功入侵900多家公司，窃取数万份包含AI、云平台、支付等核心服务的凭证。攻击者使用Claude Code等AI工具辅助工作流，手法专业且目标明确，尤其针对金融、加密货币和高价值行业。  
  
  
opendir[1]  
## 关键发现  
  
这台服务器的发现过程很有意思，它就像一个粗心的黑客忘记了关掉家里的灯，让整个“工作室”暴露在网络上。  
- 整个服务器被发现用于多目标漏洞利用、数据暂存、结果审查和访问验证，构成了一个完整的攻击链条。  
  
- 攻击者在日常工作中深度依赖Claude Code和OpenClaw。别笑，他们用AI写代码、调试扫描器、优化工作流，甚至让AI规划改进方案，搞得很“正规化”。  
  
- 攻击核心是一个大规模React2Shell漏洞（CVE-2025-55182）利用行动。扫描了数百万个公开目标，日志确认有900多个成功入侵。  
  
- 这哥们儿搞机会主义扫描，但得手后可不乱来。他的入侵后行动相当有选择性。分析显示，他会对被入侵的访问权限进行分级“诊疗”，仔细验证窃取的数据，然后把主要精力和后续高级攻击，集中在那些价值明确的机构身上——尤其是金融、加密货币和零售行业。  
  
- 窃取密钥是首要任务。数万个.env配置文件中，包含了AI、云服务、支付、数据库等几乎所有现代SaaS的凭证。攻击者还会花时间对这些凭证进行测试和排序，找出最有用的那些。  
  
- 服务器还暴露了基于Telegram的告警和命令基础设施，直接指向了Bissa扫描器生态系统的背后操作者，让我们罕见地看到了攻击者如何接收通知，甚至他公开的Telegram用户名。  
  
## 运作机制：有组织的工业化攻击  
  
这台服务器上有超过13000个文件，分布在150多个目录里，涉及漏洞利用、受害者数据暂存、凭证窃取和操作员工作流管理。  
  
攻击者用Claude Code来理解和优化扫描器代码，用OpenClaw作为一个本地的AI控制界面。这些工具被集成到日常工作中，用于故障排除、流程编排和完善数据收集管道。  
  
整个Bissa扫描器是一个成熟、模块化的操作平台。它不仅仅是用来存放随机偷来的数据，而是支撑着一个有组织的行动，目标是在大规模获取访问权限的同时，将最高价值的结果“操作化”。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibe6TfB8yqVroa19WjIMXickoeTKOOrLYkia0QC1ssfelmVwcJF0PMl6o5OZ2ChXBDHq33LdIuqYaNj1qUtIvWjKPOwiaocgHZQoGo/640?wx_fmt=png&from=appmsg "")  
## 被盗的“秘密”：AI和云凭证成重灾区  
  
窃取的凭证覆盖了现代SaaS的每个层级，而AI提供商相关的密钥成为了数量最多的单一类别。  
<table><thead><tr><th><section><span leaf="">类别</span></section></th><th><section><span leaf="">平台/服务</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">AI平台</span></section></td><td><section><span leaf="">Anthropic, Google, OpenAI, Mistral, OpenRouter, Groq, Replicate, DeepSeek, HuggingFace</span></section></td></tr><tr><td><section><span leaf="">云服务提供商</span></section></td><td><section><span leaf="">AWS, Cloudflare, Azure, Google Cloud / Firebase, DigitalOcean, Alchemy</span></section></td></tr><tr><td><section><span leaf="">消息服务</span></section></td><td><section><span leaf="">Resend, Telegram, SendGrid, Twilio, Vonage, Postmark</span></section></td></tr><tr><td><section><span leaf="">支付平台</span></section></td><td><section><span leaf="">Stripe, PayPal, Shopify, Square</span></section></td></tr><tr><td><section><span leaf="">监控与分析</span></section></td><td><section><span leaf="">Sentry, Segment, Intercom, Mixpanel</span></section></td></tr><tr><td><section><span leaf="">银行连接</span></section></td><td><section><span leaf="">Plaid</span></section></td></tr><tr><td><section><span leaf="">数据库</span></section></td><td><section><span leaf="">Supabase, MongoDB</span></section></td></tr><tr><td><section><span leaf="">源代码管理</span></section></td><td><section><span leaf="">GitHub</span></section></td></tr><tr><td><section><span leaf="">身份验证</span></section></td><td><section><span leaf="">Auth0 / Okta, Clerk</span></section></td></tr><tr><td><section><span leaf="">移动应用收入</span></section></td><td><section><span leaf="">RevenueCat</span></section></td></tr><tr><td><section><span leaf="">地图</span></section></td><td><section><span leaf="">Mapbox</span></section></td></tr><tr><td><section><span leaf="">加密货币托管</span></section></td><td><section><span leaf="">Fireblocks</span></section></td></tr><tr><td><section><span leaf="">团队协作</span></section></td><td><section><span leaf="">Slack</span></section></td></tr></tbody></table>  
这份清单很能说明问题。现在的软件高度依赖外部服务，一个.env文件泄露，可能意味着公司的AI能力、云基础设施、客户通讯渠道、支付网关和核心数据库全部沦陷。  
  
单纯从数量上看，这次泄露的规模也同样惊人：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcbIX9vDRrzGb7FxmEKNfKRX23j80IOwjpbPjUwzphnob16HibeHxicDv7iaqTvaAliakiaCyZ5h852r7XnrYFlLqxCKe7WibjDqsuT4/640?wx_fmt=png&from=appmsg "")  
## 受害者：金融与加密资产成焦点  
  
除了窃取密钥，攻击者还对特定高价值目标进行了深度数据挖掘。  
  
**受害者A：**  
一家中型税务咨询和财务顾问公司。服务器上不仅有该公司的直接入侵证据，还有一个独立的、标记为“数据样本”的打包数据集。这个数据集里有什么？Plaid银行连接令牌、关联的银行账户数据、IRS税务记录、ACH转账记录、Twilio通话记录、Salesforce联系人，以及包含个人社保号（SSN）和出生日期（DOB）字段的客户案例数据。  
  
**受害者B：**  
一家大型数字资产、支付和企业金融公司。数据看起来是通过经身份验证的Oracle Fusion REST接口导出的，内容涉及供应商、发票、采购订单、支付流程和银行账户数据。  
  
**受害者C：**  
一家中型薪资、人力资源和稳定币支付平台。数据包括薪资单、结算记录、Fireblocks加密货币托管集成信息，以及HRIS相关材料。  
  
你看，目标非常明确。这些数据不是网站页面，而是直接能用来欺诈、勒索或者了解企业内部财务状况的核心商业机密。对于受害者B和C，其初始的入侵路径尚不明确，但数据已经躺在了攻击者的服务器上。  
## 攻击者：一个叫“Dr. Tube”的独狼  
  
这次分析最有趣的部分之一，是清晰地看到了攻击者的身影。  
  
Bissa扫描器里的脚本硬编码了一个Telegram机器人令牌，指向机器人@bissapwned_bot  
（显示名为“BissaPwned”），以及目标聊天ID。这个目标聊天室只有两个成员：机器人和一个真人操作员。  
  
这个操作员的公开Telegram身份是用户名@BonJoviGoesHard  
，显示名字叫“Dr. Tube”。机器人的命名风格和整个行动保持一致（bissascanner， bissa_bench， bissapromax， BissaPwned）。开源的OpenClaw日志中还提到了@bissa_scan_bot  
这个账号，这说明Dr. Tube至少运行着两个专用机器人，分别负责扫描告警和AI控制子系统。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibe5d6rJBTw0mosD0ufftA4QEyoP3hX6xHGtAfsHbLfibeLMAlZfMT66nlNRtIzqC5xrfToG3TWvrUnF42qRyia59QfI9m5jyrNDE/640?wx_fmt=png&from=appmsg "")  
  
@bissapwned_bot  
的每条消息都包含身份信息，作为扫描器群的C2（命令与控制）通知通道发送到操作员的聊天窗口。每条消息的结构都很清晰，用表情符号分隔字段，在一行内浓缩了受害者的身份、运行时环境、权限级别、云配置状态和可恢复的密钥类型，让操作员能直接在Telegram上快速筛选成百上千次攻击事件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibfSaQFZk3BcV5via9cjrCSicFKqucLt5tUkCadjMzB1H6Zy7BFahdyvyb5ybXCM3McTObMjQEJzO3KQgdIEcKnFHx88icwK8gQ6GE/640?wx_fmt=png&from=appmsg "")  
## 攻击能力：模块化与规模化  
### Bissa扫描器  
  
扫描器的核心是围绕Next.js的React2Shell漏洞（CVE-2025-55182）构建的工作流。  
  
扫描器依赖两个关键文件：一个是包含目标列表的“获取器”文件，一个是定义漏洞利用类型的“租约”文件。这些文件显示，操作员从一个托管在cs2.ip.thc.org的ZIP压缩包中获得目标列表，分配好CVE-2025-55182漏洞利用模块，然后部署一个有效载荷。这个载荷会尝试枚举.env文件、云服务元数据、Kubernetes服务账户、本地凭证存储、数据库和Redis访问权限、加密货币钱包信息等等高价值“秘密”。  
  
一个名为“confirmed hits”的文件显示，超过900家公司通过这个工作流被成功入侵。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibceynnBYaZZXsCAkOZiaqRiba47jpUviaEbPvAHgX3XjkB03CK6oAmPIiaZNapdEKPMWTEkPd5XexA3C8ms1ZibC5VZId1j4lAfsQQA/640?wx_fmt=png&from=appmsg "")  
  
扫描器还包括一个专门针对WordPress的模块，目标是CVE-2025-9501（W3 Total Cache插件中的一个未授权命令注入漏洞）。不过在我们恢复的模块中，只看到了版本检查逻辑，实际的RCE（远程代码执行）载荷并不在其中，也没有发现通过这个模块成功入侵的证据。  
### 数据外传：利用S3兼容存储  
  
攻击者很聪明，他没有把偷来的所有.env文件都堆在自己的服务器上。  
  
他使用与S3兼容的Filebase服务，作为受害者的.env文件的“场外归档库”。扫描器被配置为监控本地的results/目录，将*.env文件批量打包成ZIP，然后上传到hxxps://s3.filebase[.]com的bissapromax  
存储桶中。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcFqpGbkCu7YvOIzib22tPse6X6BGcOhGZvK0EKsS0MN1v7icEV9wem8bcN6uroStFj1XCticRbdgcQ3Z9pa7ZCLGiby3pOz8rbW4I/640?wx_fmt=png&from=appmsg "")  
  
Filebase存储桶的历史记录显示出至少三个阶段：2025年9月的bissa，2025年11月的bissa2，以及从2025年12月至今的bissapromax。其中，只有bissapromax存储桶里有可恢复的归档内容，正好对应上我们看到的2026年4月大规模.env文件收集工作流。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibddyxBVLYdJ2emQQia8noBKBvBRqttUfn2icwv6RiccwGTBnqvSWxPr0tEDEuAazOMv6dVutn58BvjRxIQWmtpljFMqladqYGrfY8/640?wx_fmt=png&from=appmsg "")  
  
这些S3存储桶中的完整数据包包含400多个原始的env-batch-*.zip对象，涵盖了超过3万个不同的.env文件名，时间跨度从2026年4月10日到4月21日。这些ZIP文件总共包含超过6.5万个存档文件条目，显示同一个受害者的文件会随着时间的推移，被反复打包和重新上传，而不是暂存一次就丢弃。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibfePPsScTtFCXNDRVhJquajwpkxDZCMRrxbpcTQ7kibibxREmMVibMbeNic00z6EpvXOoRCrJfT8dic7b82OJpaESsN8VwhkCZgyloU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibfwc32ZcPVic3vcI7YVdvSfmVvQXU20AjibPicDnnHrb6nScjAXnOP4UENibTpX4raOtJgC8E1GksQgdubsGa3B0xkIUNhWBRow8Hg/640?wx_fmt=png&from=appmsg "")  
## 防御者该怎么做？  
  
这种工业化的攻击让传统的防火墙和杀毒软件显得有点力不从心。防御需要更精细、更深入的策略。  
- **积极打补丁。**  
保持面向互联网的应用和框架处于快速更新节奏。别等到安全事件发生了，才从应急电话里听说某个关键漏洞。  
  
- **把密钥真正当作秘密来管。**  
赶紧把生产环境的凭据从.env文件里移走，放到真正的密钥管理器里。在运行时注入，缩短密钥有效期，把每个密钥的权限限制在它所需的最小范围。  
  
- **缩小爆炸半径。**  
假设你的防线一定会被突破。使用工作负载身份代替长期有效的密钥，加固对云服务元数据的访问控制，收紧RBAC（基于角色的访问控制），禁用未使用的服务账户令牌，永远不要把容器运行时套接字挂载到应用工作负载里。  
  
- **控制出站流量。**  
将应用层的出站流量路由到有日志记录的代理服务器。这样，即使一台主机失陷，它也无法静悄悄地访问云服务元数据、支付API或攻击者的基础设施。  
  
- **定期轮换和检测。**  
定期轮换你的凭证。扫描源代码和构建产物里有没有嵌入的密钥。布置一些“蜜罐令牌”，一旦它们被使用，就立即向你告警。  
  
- **演练你的响应流程。**  
清楚知道哪些密钥能在几分钟内轮换，哪些需要几天。确保供应商联系人是有效的。每年做一次“生产环境密钥泄露”的桌面推演。最快从事故中恢复的团队，往往是那些在风平浪静时就经常演练的团队。  
  
**现状更新：**  
鉴于从这台暴露服务器恢复的材料的敏感性，相关IP地址不会公开披露。执法部门已介入，所有与该目录相关的主要受害者都已收到直接通知。针对此事件的协调披露和受害者通知工作正在进行中。  
### 参考资料  
  
[1]   
https://thedfirreport.com/category/opendir/  
  
[2]   
https://thedfirreport.com/2026/04/22/bissa-scanner-exposed-ai-assisted-mass-exploitation-and-credential-harvesting/  
  
