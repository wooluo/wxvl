#  BlueHammer：研究员公开未修复 Windows 零日漏洞，可提权至 SYSTEM  
bitbot
                    bitbot  Desync InfoSec   2026-04-07 12:00  
  
# BlueHammer：研究员公开未修复 Windows 零日漏洞，可提权至 SYSTEM  
  
来源：Security Affairs · 2026-04-07  
📌 核心要点安全研究员 Nightmare-Eclipse 因不满微软 MSRC 的漏洞处理流程，于 4 月 3 日在 GitHub 上公开发布了 BlueHammer 零日漏洞利用代码该漏洞是一个本地权限提升（LPE）缺陷，结合 TOCTOU 竞争条件和路径混淆，可让攻击者获取 SYSTEM 权限微软目前尚未发布补丁，该漏洞仍为零日状态知名安全专家 Will Dormann 已确认该漏洞利用有效## 一、事件背景  
  
2026 年 4 月 3 日，一位化名为 **Nightmare-Eclipse** 的安全研究员在 GitHub 上公开发布了名为 **BlueHammer** 的 Windows 零日漏洞利用代码。该研究员此前已将漏洞私下报告给微软，但对微软安全响应中心（MSRC）处理披露流程的方式表示不满，最终选择公开发布。  
  
Nightmare-Eclipse 在 GitHub 仓库的描述中写道：  

「我真的很好奇他们决策背后的逻辑是什么，你知道会发生这样的事情，但还是做了你做的事？他们认真的吗？」
  
著名恶意软件研究社区 vx-underground 在 Twitter 上证实了该漏洞的真实性：  
vx-underground (@vxunderground)「一个沮丧的极客在微软漏洞赏金计划的人惹恼他之后，丢了一个零日漏洞利用。我还没有测试或确认，但有人告诉我这是真的。」## 二、技术分析  
### 漏洞类型  
  
BlueHammer 是一个**本地权限提升（LPE）**漏洞，结合了两种经典漏洞利用技术：  
<table><tbody><tr style="background:#f5f5f5 !important; text-indent: 0 !important;"><th style="border:1px solid #e8e8e8 !important;padding:12px !important;text-align:left !important;width:30% !important; text-indent: 0 !important;">技术</th><th style="border:1px solid #e8e8e8 !important;padding:12px !important;text-align:left !important; text-indent: 0 !important;">描述</th></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:12px !important; text-indent: 0 !important;"><strong>TOCTOU</strong><br/><span style="color:#999 !important;font-size:12px !important; text-indent: 0 !important;">（Time-of-Check Time-of-Use）</span></td><td style="border:1px solid #e8e8e8 !important;padding:12px !important; text-indent: 0 !important;">检查时间与使用时间的竞争条件漏洞。在系统检查资源状态和实际使用资源之间的时间窗口内，攻击者可以替换或修改资源，导致系统使用了与检查时不同的资源</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:12px !important; text-indent: 0 !important;"><strong>路径混淆</strong><br/><span style="color:#999 !important;font-size:12px !important; text-indent: 0 !important;">（Path Confusion）</span></td><td style="border:1px solid #e8e8e8 !important;padding:12px !important; text-indent: 0 !important;">利用 Windows 路径解析机制中的缺陷，通过构造特殊的路径使系统访问到非预期的文件或目录</td></tr></tbody></table>### 利用方式  
  
该漏洞的利用过程如下：  
1. 攻击者需要首先获取目标系统的**本地访问权限**（可通过社会工程、窃取凭据或其他漏洞实现）  
1. 利用 TOCTOU 竞争条件和路径混淆技术，绕过 Windows 的安全检查机制  
1. 成功利用后，攻击者可以访问 **SAM（Security Account Manager）数据库**，获取系统中存储的密码哈希  
1. 利用获取的凭据信息，攻击者可以将权限提升至 **SYSTEM** 级别  
1. 最终，攻击者可以生成 SYSTEM 级别的 Shell，完全控制系统  
### 漏洞利用难度  
⚠️ 利用难度评估• 需要本地访问权限（非远程利用）• 利用并非易事（not easy），但技术上可行• 研究员在 PoC 中故意插入了一些 bug，可能导致利用失败• 但核心漏洞原理是真实的，已被安全专家验证## 三、影响范围  
  
BlueHammer 影响**所有未修复的 Windows 系统**。由于微软尚未发布补丁，该漏洞目前为零日状态，所有 Windows 用户均面临潜在风险。  
  
虽然该漏洞需要本地访问权限，但攻击者可以通过以下途径获取初始访问：  
- **社会工程**：诱骗用户执行恶意程序  
- **窃取凭据**：通过钓鱼攻击获取用户账户  
- **其他漏洞**：利用远程代码执行漏洞获取初始立足点，再使用 BlueHammer 提权  
## 四、MSRC 处理争议  
  
此次事件暴露了微软安全响应中心（MSRC）在漏洞处理流程方面的问题。知名安全专家 **Will Dormann**（曾在美国 CERT/CC 工作）在 Mastodon 上发表了评论：  
Will Dormann「有一个新的 Windows 零日 LPE 被披露了，叫做 BlueHammer。报告者暗示这是因为 MSRC 现在的运作方式才被披露的。」「MSRC 过去是非常好合作的。但为了省钱，微软裁掉了有技术的人，留下了只会走流程的人。」「如果微软在报告者拒绝提交漏洞利用视频后就关闭了案例，我一点也不会惊讶——因为这现在似乎是 MSRC 的要求了。」## 五、缓解措施  
✅ 建议操作限制本地访问权限：遵循最小权限原则，减少拥有本地管理员权限的用户数量监控异常提权行为：关注从普通用户到 SYSTEM 权限的异常进程创建监控 SAM 数据库访问：检测非 SYSTEM 进程对 SAM 数据库的异常访问加强端点防护：启用 EDR 解决方案，检测 TOCTOU 竞争条件利用等待微软补丁：关注微软安全更新，及时应用补丁加固系统：启用 Credential Guard 保护 LSASS 和 SAM 数据库## 六、IoC 与参考  
### 相关链接  
- GitHub: BlueHammer 漏洞利用代码  
- Nightmare-Eclipse 公开披露说明  
- Bleeping Computer 报道  
- Will Dormann 的 Mastodon 分析  
### 漏洞信息  
<table><tbody><tr style="background:#f5f5f5 !important; text-indent: 0 !important;"><th style="border:1px solid #e8e8e8 !important;padding:10px !important;text-align:left !important; text-indent: 0 !important;">字段</th><th style="border:1px solid #e8e8e8 !important;padding:10px !important;text-align:left !important; text-indent: 0 !important;">值</th></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">漏洞名称</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">BlueHammer</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">类型</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">本地权限提升（LPE）</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">技术</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">TOCTOU 竞争条件 + 路径混淆</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">影响</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">获取 SYSTEM 权限，访问 SAM 数据库</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">补丁状态</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important;color:red !important;font-weight:bold !important; text-indent: 0 !important;">未修复（零日）</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">披露日期</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">2026-04-03</td></tr><tr><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">披露者</td><td style="border:1px solid #e8e8e8 !important;padding:10px !important; text-indent: 0 !important;">Nightmare-Eclipse</td></tr></tbody></table>  
**MITRE ATT&CK：**权限提升 T1068（利用漏洞提权） · 凭据访问 T1003.002（SAM） · 防御规避 T1055（进程注入） · 发现 T1082（系统信息发现）
**原文：**Security Affairs  

