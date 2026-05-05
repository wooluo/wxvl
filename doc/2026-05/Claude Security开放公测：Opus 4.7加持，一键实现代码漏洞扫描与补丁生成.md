#  Claude Security开放公测：Opus 4.7加持，一键实现代码漏洞扫描与补丁生成  
 FreeBuf   2026-05-05 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2WfJAJ1gHNQqYDLnG7U6ibibAu6ybgElYUlCmVTDJpQw8ib9ibPDrnUntMeiaT2zve313uLeN9MxnsicCARfKXYc5P4OFJH8knJT9SE/640?wx_fmt=png&from=appmsg "")  
  
  
Claude Security（前身为 Claude Code Security）现已面向 Claude Enterprise 客户开放公测。该功能集成于 Claude.ai 平台，可扫描代码库中的安全漏洞并提供针对性补丁建议，帮助开发团队发现并修复可能被遗漏的问题。  
  
  
管理员可通过管理控制台启用该功能，Claude Team 和 Max 客户预计将陆续获得访问权限。  
  
  
企业可使用 Claude Opus 4.7 模型对代码库进行全面检测，该系统通过追踪数据流和分析跨文件/模块的组件交互来实现漏洞识别。该方案无需 API 集成或自定义 Agent，支持定时扫描、定向扫描、审计系统对接以及漏洞分类追踪等功能。  
  
  
**Part01**  
## 技术实现原理  
  
  
用户可通过 Claude.ai 侧边栏或 claude.ai/security 入口启动扫描，选择代码仓库或指定目录/分支作为扫描范围。扫描过程中系统会分析组件交互关系、追踪数据流并解读源代码，最终生成包含以下要素的详细报告：  
- 漏洞置信度评级  
  
- 严重性分级  
  
- 潜在影响分析  
  
- 复现步骤说明  
  
- 上下文关联的补丁指令  
  
Anthropic 官方表示："本次更新新增了仓库目录级精准扫描功能，支持记录漏洞驳回原因（便于后续审计追溯），可将结果导出为 CSV/Markdown 格式对接现有审计系统，还能通过 Webhook 将扫描结果推送至 Slack/Jira 等平台。"  
  
  
企业可通过三种方式部署该方案：直接使用 Claude Security 平台、集成至现有系统或通过服务团队获得定制支持。  
  
  
**Part02**  
## 行业竞争动态  
##   
  
一个月前，Anthropic 推出的 Claude Mythos Preview 通用模型已能识别 0Day 漏洞并构建针对主流操作系统/浏览器的攻击利用链。对此，OpenAI 首席执行官 Sam Altman 在社交平台宣布，将在近日向选定网络安全团队推出 GPT-5.5-Cyber 模型。  
  
  
"我们将联合行业生态与政府机构建立可信网络安全访问机制，致力于快速提升企业和基础设施的安全防护能力。"Altman 强调。  
##   
  
**参考来源：**  
  
Claude Security enters public beta with Opus 4.7 vulnerability scanning and patching  
  
https://thehackernews.com/2026/05/2026-year-of-ai-assisted-attacks.html  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337545&idx=1&sn=772e37039accf79521a5b80e0032e89f&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
