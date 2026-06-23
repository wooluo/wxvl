#  OpenCode CNVD 多 Agent 插件 | 用于授权场景下的 CNVD 漏洞挖掘  
trah01
                    trah01  夜组安全   2026-06-22 23:30  
  
免责声明  
  
由于传播、利用本公众号夜组安全所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号夜组安全及作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
**所有工具安全性自测！！！VX：**  
**NightCTI**  
  
朋友们现在只对常读和星标的公众号才展示大图推送，建议大家把  
**夜组安全**  
“**设为星标**  
”，  
否则可能就看不到了啦！  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icZ1W9s2Jp2WrOMH4AFgkSfEFMOvvFuVKmDYdQjwJ9ekMm4jiasmWhBicHJngFY1USGOZfd3Xg4k3iamUOT5DcodvA/640?wx_fmt=png&from=appmsg "")  
  
## 工具介绍  
  
**OpenCode CNVD 多 Agent 插件**  
，这是一个独立的 OpenCode 工作流目录，用于授权场景下的 CNVD 漏洞挖掘。  
  
opencode-cnvd  
 是面向 CNVD 漏洞报送场景的授权安全测试工作流，不是某个固定业务系统、固定厂商或固定目标项目的名称。  
  
本仓库提供的是 OpenCode 插件、agent 提示词和流程规范，用来在已经获得授权的前提下，对指定系统或产品进行资产收集、攻击面分析、漏洞验证、审计记录和报告整理。实际测试对象由每次运行时登记的授权范围和 campaign_id  
 决定，例如某个 OA、门户、业务系统或产品版本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/WibL3bOeESMJ5ljtTpZw7wT5Qib63Xnhic2ztgPAvl7icCBUDWMeRWqjdMWUEr3mfbZnPGgp4bQUicP9udfFm4NJ1q9kx1oupYWiadRibGTiauC9bUQ/640?wx_fmt=png&from=appmsg "")  
## 包含内容  
- cnvd-plugin.ts  
：OpenCode 本地插件，提供授权范围登记、范围检查、报告证据模板和基础工具拦截。  
  
- opencode.example.jsonc  
：OpenCode 多 agent 示例配置。  
  
- prompts/  
：总规、授权审查、资产收集、攻击面分析、CVE研究、MCP操作、长期巡检、渗透测试、漏洞验证、操作审计、报告输出等 agent 提示词。  
  
- docs/workflow.md  
：统一工作流和边界规范。  
  
- docs/memory.md  
：长期运行、上下文恢复、持久记忆和风险队列规范。  
  
- docs/model-allocation.md  
：DeepSeek 与 GPT 的角色分配、安全边界和脱敏要求。  
  
- docs/sanitization.md  
：交给 GPT agent 前的脱敏输入规范。  
  
## 使用方式  
1. 将 opencode.example.jsonc  
 中的 MCP 路径改成你本机漏洞检测 MCP server 的绝对路径。  
  
1. 把配置内容合并到项目的 opencode.json  
 或 opencode.jsonc  
。  
  
1. 在 OpenCode 中先让 cnvd-chief  
 登记授权范围：  
  
```
请使用 cnvd_scope_register 登记授权目标：https://example.com，授权编号：your-ticket-id
```  
1. 之后按总规调度不同 agent 完成资产收集、测试、验证、审计和报告。  
  
## 自动长期运行  
  
配置默认将 bash  
 设为 allow  
，避免安全只读动作频繁打断任务。真正的边界控制放在插件里：  
- 安全动作继续执行。  
  
- 高危、越界或可能改动状态的动作不执行，自动进入风险队列。  
  
- agent 不需要立刻询问用户，应继续寻找低风险替代路径。  
  
- 阶段性结束后用 cnvd_risk_queue_list  
 汇总 pending 项，用户再统一决定。  
  
建议启动长期任务时给总规这样的指令：  
```
按 CNVD 多 agent 工作流长期运行。先为当前系统调用 cnvd_campaign_start 设置独立 campaign_id，命名为类似 泛微OA_6_19 或 蓝凌OA_6_19 的项目名。插件会在当前目录创建该项目文件夹。每个阶段先读取当前 campaign 的 cnvd_campaign_status 和 cnvd_scratchboard_read，发现资产、假设、证据、结论都写入 cnvd_memory_record。只检索当前系统记忆，不读取其他无关系统历史。临时文件放到当前项目文件夹 tmp/，报告放到 reports/。遇到高危动作不要问我，记录风险队列后继续低风险替代路径。阶段结束再汇总 pending 风险。
```  
## 模型替换  
  
opencode.example.jsonc  
 中每个 agent 都可以单独替换 model  
，例如：  
- 总规、渗透测试、漏洞验证、报告输出使用强模型。  
  
- 授权审查、资产整理、审计记录使用轻量模型。  
  
## 边界控制  
  
默认禁止：  
- 文件写入、编辑、补丁类工具。  
  
- 后渗透、持久化、横向移动、凭据访问、webshell、规避类工具。  
  
- 常见破坏性 shell 命令。  
  
- 未登记授权范围的目标扫描或验证。  
  
高危动作不会立即询问用户，也不会执行；插件会写入当前系统项目文件夹下的 risk-queue.jsonl  
，后续通过 cnvd_risk_queue_list  
 统一查看。  
## 长期记忆  
  
插件会在当前目录自动创建 <campaign_id>/  
，例如 XX系统_6_19/  
：  
- campaign.db  
 保存授权范围、阶段状态、结构化记忆、风险队列和审计事件。  
  
- scratchboard.md  
 保存给模型快速恢复上下文的短摘要。  
  
- events.jsonl  
 保存追加式全过程事件。  
  
- risk-queue.jsonl  
 保存待审批高危动作。  
  
- evidence/  
 保存证据附件。  
  
- reports/  
 保存报告输出。  
  
- tmp/  
 保存临时文件和过程材料。  
  
如果运行时不支持 SQLite，会自动退回 state.json  
，任务仍可继续。  
  
如果所在项目是 Git 仓库，建议把每个项目文件夹（例如 XX系统_6_19/  
）加入 .gitignore  
，避免把审计过程和目标信息提交到仓库。  
  
默认一个系统/产品使用一个独立 campaign 和一个独立项目文件夹。泛微OA  
 和 蓝凌OA  
 是两个独立记忆；同一个系统的多个域名、URL、IP 和案例可以放在同一个 campaign。只有需要在同一系统内缩小到某个 URL/IP 时，才在 cnvd_memory_snapshot  
、cnvd_campaign_status  
、cnvd_memory_search  
 中传入 target  
。  
  
这些限制无法替代人工授权审查。执行真实测试前，仍需要确认目标、授权、时间窗口和测试强度。  
  
## 工具获取  
  
  
  
点击关注下方名片  
进入公众号  
  
回复关键字【  
260623  
】获取  
下载链接  
  
  
## 往期精彩  
  
  
[给 AI 渗透助手装上"安全带"——不锁油门，只锁刹车 | AI Agent 在渗透测试场景下既能放手测试，又不会脱库、删库、留后门2026-06-22](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247497098&idx=1&sn=24d2652b28344d79c36f49e36d448e81&scene=21#wechat_redirect)  
[Burp Suite 验证码 DOS 漏洞检测插件 | 利用验证码图片的隐藏尺寸参数进行DDos攻击2026-06-18](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247497092&idx=1&sn=743fa6c182c96e780344513bdb5192b3&scene=21#wechat_redirect)  
[以一烛之光，照见隐秘  | 主动指纹嗅探、威胁情报检索、编解码加解密、JS加密绕过Web爆破2026-06-17](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247497078&idx=1&sn=73061cd0c05b3c8b40cb2c81a78c553e&scene=21#wechat_redirect)  
[牛逼！AI 驱动的后渗透综合管理平台，深度集成 LLM Agent，175 个工具 + 21 个技能，开箱即用。2026-06-16](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247497040&idx=1&sn=bb0d6936f648c2ffe72f92009c3035be&scene=21#wechat_redirect)  
[实用！跨平台进程内存扫描工具 | 应急响应与安全分析 快速定位可疑连接、进程2026-06-15](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247497032&idx=1&sn=208d754e7fc71b572f6176ec32899c7a&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/OAmMqjhMehrtxRQaYnbrvafmXHe0AwWLr2mdZxcg9wia7gVTfBbpfT6kR2xkjzsZ6bTTu5YCbytuoshPcddfsNg/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&random=0.8399406679299557&tp=webp "")  
  
