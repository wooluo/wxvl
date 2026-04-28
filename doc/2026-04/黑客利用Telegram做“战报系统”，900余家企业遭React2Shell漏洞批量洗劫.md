#  黑客利用Telegram做“战报系统”，900余家企业遭React2Shell漏洞批量洗劫  
 黑白之道   2026-04-28 01:35  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6MOHK214zuvACt0l5a5usm5ooLwUuIgaYiaCFy3Zzs3prlvywdpDB7licXia5t12ge4Kbn6zGSEqodrRjMlYgnH7DbMGib8zs8J2D8/640?wx_fmt=png&from=appmsg "")  
  
**Part01**  
## 攻击行动曝光  
  
  
一台意外暴露在公网的服务器，揭开了近期一场大规模自动化攻击的真面目。在这场围绕名为「Bissa scanner」工具展开的攻击行动中，威胁攻击者利用自动化扫描、AI辅助编码与Telegram机器人，已悄无声息地入侵了全球超过900家企业。  
  
  
攻击者专门针对暴露在互联网上的Web应用程序，窃取敏感凭证，并将每一次成功的漏洞利用结果，实时发送至自己的Telegram账户。  
  
  
**Part02**  
## 漏洞利用机制  
  
  
本次攻击的核心，是Next.js中的一个高危漏洞——CVE-2025-55182。安全研究人员将其命名为React2Shell。  
  
  
该漏洞允许攻击者针对数百万台Web服务器发起攻击，窃取通常包含密码、API密钥和访问令牌的敏感环境文件（.env文件）。  
  
  
值得注意的是，攻击者并非盲目随机扫描，而是构建了一套结构化的攻击流程：对受害者进行发现、利用、分级，并根据被盗数据的潜在价值进行筛选。报告显示，金融机构、加密货币平台和零售企业是受影响最严重的行业。  
  
  
**Part03**  
## 自动化攻击基础设施  
  
  
DFIR Report的分析师在发现一台暴露的服务器后，还原了此次攻击的全貌。该服务器上存储了分布在150多个目录中的13,000多个文件。  
  
  
研究人员指出，这些内容绝非简单的数据转储，而是一条高度专业化的攻击流水线——漏洞利用脚本、受害者数据暂存、凭证收集和权限验证，全部在同一台机器上完成。  
  
  
更值得关注的是，这台暴露主机还显示，攻击者使用了Claude Code和OpenClaw进行故障排除和工作流管理，为大规模漏洞利用提供了罕见的自动化水平和操作效率。  
  
  
**Part04**  
## Telegram实时通知系统  
  
  
此次发现最引人注目的，是攻击者将Telegram打造成了一套实时的漏洞利用通知系统。  
  
  
Bissa scanner框架中的运行脚本，硬编码了一个与Telegram机器人 @bissapwned_bot 相关联的令牌。每当扫描器确认一次成功的React2Shell漏洞利用，该机器人就会立即向攻击者的私人Telegram聊天发送一条结构化警报。  
  
  
攻击者的Telegram身份也由此曝光：用户名为 @BonJoviGoesHard，显示名称为“Dr. Tube”。每一条警报都包含受害者的身份信息、云环境状态、权限级别以及可用的密钥——攻击者可以近乎实时地在即时通讯应用上，筛选和评估数百次入侵的价值。  
  
  
**Part05**  
## 凭证收集规模  
  
  
攻击者的凭证收集规模同样惊人。从数万个.env文件中，他们攫取了包括：  
- AI服务商：Anthropic、OpenAI的密钥和令牌  
  
- 云平台：AWS、Azure  
  
- 支付系统：Stripe、PayPal  
  
- 数据库：MongoDB、Supabase  
  
等各类系统的访问凭证。  
  
  
在2026年4月10日至21日的短短11天内，攻击者使用兼容S3的Filebase存储服务，向名为 bissapromax 的云存储桶上传了超过65,000个归档文件条目，充分暴露了其攻击管道的自动化程度和持续性。  
  
  
**Part06**  
## Telegram机器人通知系统原理拆解  
  
  
Telegram警报机制是本轮攻击中最具技术揭示价值的细节之一。  
  
  
@bissapwned_bot 发送的每条确认消息都带有结构化标头，包含消息ID、日期、发送者用户名和机器人用户ID。消息正文则采用表情符号分隔字段、单行书写的格式，使攻击者无需登录服务器，即可秒级了解每个受害者的核心情况。  
  
  
这种设计体现出极高的操作成熟度——攻击者追求的是结果查看时的速度、清晰度和最小操作成本。  
  
  
DFIR Report的分析师还发现，攻击者至少运行了两个独立的机器人：  
- @bissapwned_bot：用于扫描结果警报  
  
- @bissa_scan_bot：由OpenClaw驱动的AI控制子系统中的扫描机器人  
  
对Telegram API的元数据查询证实，两个机器人在被发现时均处于活跃状态。目标聊天记录解析为机器人与单个操作员之间的私人对话，确认这是一次单人操作、集中管理的攻击行动。  
  
  
这种基础设施投入水平表明，攻击者并非新手，而是长期从事此类操作——存储阶段的命名痕迹甚至可追溯至2025年9月。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2Qq6BXVdmAScG7t96IdSlfKHRSHA0SkXZKE7Su6qVHs2ibwhUllQUiblAmNNtf3kwddYSHqhf4YJZx7StxHolWgK1XKYZUTOla4/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=2 "")  
  
  
**Part07**  
## 防御建议  
  
  
DFIR Report的研究人员提出了几项组织应立即采取的防御措施：  
1. 积极打补丁：  
订阅供应商安全公告，确保关键CVE在成为事件之前就已被修复。  
  
1. 迁移凭证管理方式：  
将生产凭证从.env文件迁移到专业的密钥管理器中，在运行时注入具有短生命周期和窄权限的凭证。  
  
1. 控制出站流量：  
通过可记录日志的代理控制应用层出站流量，防止被入侵的主机静默连接攻击者基础设施。  
  
1. 常态化凭证安全运营：  
定期轮换凭证，扫描代码和构建产物中嵌入的密钥，并部署蜜罐令牌以触发告警。  
  
**参考来源：**  
  
Hackers Use Telegram Bots to Track 900+ Successful React2Shell Exploits  
  
https://cybersecuritynews.com/hackers-use-telegram-bots/  
  
  
> **文章来源：freebuf**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
