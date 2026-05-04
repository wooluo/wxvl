#  DeepAudit - 人人拥有的 AI 审计战队，让漏洞挖掘触手可及  
lintsinghua
                    lintsinghua  Zner sec   2026-05-04 09:00  
  
![](https://mmbiz.qpic.cn/mmbiz_png/P8tspoQj3VpYHDJOfVrX0Pc1tm2icwkYCVXOLicTuj5n10EM3L0EJAFYMIyWOwn58vWfQfxYeN9wickwge6sHVJXZhjK1ZaWh8bMmFTqwsbjFw/640?wx_fmt=png&from=appmsg "")  
## 📸 界面预览  
### 🤖 Agent 审计入口  
  
![](https://mmbiz.qpic.cn/mmbiz_png/P8tspoQj3VqDGlOA1hjBraMHqHg8o0KGBUibprDB1DJBWzmCicicfmK6WWKy0Zvem6roGAunR7KBS8h4FMcrAp1j4o6M0eevAGsl5d5CkIbet4/640?wx_fmt=png&from=appmsg "")  
  
首页快速进入 Multi-Agent 深度审计  
  
![](https://mmbiz.qpic.cn/mmbiz_png/P8tspoQj3Vr2XV3jTqL3bOtKCZCAeKjHT2tgaO13ZCFbb2lcr0IFJwgsoBhkEY99vJXicr8xZLSPDtJJbvibbCqTTPPPZ4UefBGawicicZyAZJo/640?wx_fmt=png&from=appmsg "")  
### 📊 专业报告  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/P8tspoQj3VoESgF2D3lIhrul2c9Re7xJlQ9Oz817rOaTY77wl9FAIKs3LgFEAqMsHIEJ6Hia9A7Pwdz7GY6ja3xOlvRuEW50B7OicqAPD4B2c/640?wx_fmt=png&from=appmsg "")  
  
一键导出 PDF / Markdown / JSON  
（图中为快速模式，非Agent模式报告）  
## 🏆 CVE 漏洞发现  
### DeepAudit 已成功发现并获得 49 个 CVE 编号 和 6 个 GHSA 安全公告🦞  
### 涉及17个知名开源项目  
#### OpenClaw🦞 漏洞挖掘成果  
  
DeepAudit 内测版本对 OpenClaw  
 项目进行了深度安全审计，目前已发现 **6 个安全漏洞**  
，均已被官方确认并发布安全公告（GHSA）。漏洞类型覆盖命令注入、签名验证绕过、远程代码执行、凭证泄露、资源耗尽及敏感信息泄露，其中包含多个 High 级别漏洞。更多漏洞仍在持续挖掘中。  
GHSA 编号项目项目热度漏洞类型严重性GHSA-g353-mgv3-8pcjOpenClawSignature Verification Bypass8.6GHSA-99qw-6mr3-36qrOpenClawCode Execution8.5GHSA-7h7g-x2px-94hjOpenClawCredential Exposure6.9GHSA-g2f6-pwvx-r275OpenClawCommand InjectionMediumGHSA-jq3f-vjww-8rq7OpenClawResource ExhaustionHighGHSA-xwcj-hwhf-h378OpenClawInformation DisclosureMediumCVE 编号项目项目热度漏洞类型CVSSCVE-2026-1884Zentao PMSSSRF5.1CVE-2025-13789Zentao PMSSSRF5.3CVE-2025-13787Zentao PMSPrivilege Escalation9.1CVE-2025-64428DataeaseJNDI Injection9.8CVE-2025-13246ModulithshopSQL Injection6.3CVE-2025-64163DataeaseSSRF9.8CVE-2025-64164DataeaseJNDI Injection9.8CVE-2025-11581PowerJobPrivilege Escalation7.5CVE-2025-11580PowerJobPrivilege Escalation5.3CVE-2025-10771JimureportDeserialization9.8CVE-2025-10770JimureportDeserialization6.5CVE-2025-10769H2o-3Deserialization9.8CVE-2025-10768H2o-3Deserialization9.8CVE-2025-58045DataeaseJNDI Injection9.8CVE-2025-10423Newbee-mallGuessable Captcha3.7CVE-2025-10422Newbee-mallPrivilege Escalation4.3CVE-2025-9835MallPrivilege Escalation4.3CVE-2025-9737O2oaXSS5.4CVE-2025-9736O2oaXSS5.4CVE-2025-9735O2oaXSS5.4CVE-2025-9734O2oaXSS5.4CVE-2025-9719O2oaXSS5.4CVE-2025-9718O2oaXSS5.4CVE-2025-9717O2oaXSS5.4CVE-2025-9716O2oaXSS5.4CVE-2025-9715O2oaXSS5.4CVE-2025-9683O2oaXSS5.4CVE-2025-9682O2oaXSS5.4CVE-2025-9681O2oaXSS5.4CVE-2025-9680O2oaXSS5.4CVE-2025-9659O2oaXSS5.4CVE-2025-9658O2oaXSS5.4CVE-2025-9657O2oaXSS5.4CVE-2025-9655O2oaXSS5.4CVE-2025-9646O2oaXSS5.4CVE-2025-9602RockOADatabase Backdoor6.5CVE-2025-9514MallPrivilege Escalation3.7CVE-2025-9264Xxl-jobPrivilege Escalation5.4CVE-2025-9263Xxl-jobPrivilege Escalation4.3CVE-2025-9241EladminCSV/XLSX Injection7.5CVE-2025-9240EladminSensitive Information Disclosure4.3CVE-2025-9239EladminHardcoded Credentials3.7CVE-2025-8974LitemallHardcoded Credentials9.8CVE-2025-8852Wukong CRMSensitive Information Disclosure4.3CVE-2025-8840JsherpPrivilege Escalation5.4CVE-2025-8839JsherpPrivilege Escalation8.8CVE-2025-8764LitemallXSS5.4CVE-2025-8753LitemallArbitrary File Deletion5.4CVE-2025-8708White-JotterDeserialization7.5  
👉 查看完整 CVE 列表详情  
> 以上漏洞由 DeepAudit 团队成员 @lintsinghua @ez-lbz 使用 DeepAudit 挖掘发现  
  
> 如果您使用 DeepAudit 发现了漏洞，欢迎在 Issues 中留言反馈。您的贡献将极大地丰富这份漏洞列表，非常感谢！  
  
## ⚡ 项目概述  
  
**DeepAudit**  
 是一个基于 **Multi-Agent 协作架构**  
的下一代代码安全审计平台。它不仅仅是一个静态扫描工具，而是模拟安全专家的思维模式，通过多个智能体（**Orchestrator**  
, **Recon**  
, **Analysis**  
, **Verification**  
）的自主协作，实现对代码的深度理解、漏洞挖掘和 **自动化沙箱 PoC 验证**  
。  
  
我们致力于解决传统 SAST 工具的三大痛点：  
- **误报率高**  
 — 缺乏语义理解，大量误报消耗人力  
  
- **业务逻辑盲点**  
 — 无法理解跨文件调用和复杂逻辑  
  
- **缺乏验证手段**  
 — 不知道漏洞是否真实可利用  
  
用户只需导入项目，DeepAudit 便全自动开始工作：识别技术栈 → 分析潜在风险 → 生成脚本 → 沙箱验证 → 生成报告，最终输出一份专业审计报告。  
> **核心理念**  
: 让 AI 像黑客一样攻击，像专家一样防御。  
  
## 💡 为什么选择 DeepAudit？  
<table><thead><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><th align="left" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">😫 传统审计的痛点</span></section></th><th align="left" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">💡 DeepAudit 解决方案</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">人工审计效率低</span></strong><section><span leaf=""><br/></span><section><span leaf="">跨不上 CI/CD 代码迭代速度，拖慢发布流程</span></section></section></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">🤖 Multi-Agent 自主审计</span></strong><section><span leaf=""><br/></span><section><span leaf="">AI 自动编排审计策略，全天候自动化执行</span></section></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">传统工具误报多</span></strong><section><span leaf=""><br/></span><section><span leaf="">缺乏语义理解，每天花费大量时间清洗噪音</span></section></section></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">🧠 RAG 知识库增强</span></strong><section><span leaf=""><br/></span><section><span leaf="">结合代码语义与上下文，大幅降低误报率</span></section></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">数据隐私担忧</span></strong><section><span leaf=""><br/></span><section><span leaf="">担心核心源码泄露给云端 AI，无法满足合规要求</span></section></section></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">🔒 支持 Ollama 本地部署</span></strong><section><span leaf=""><br/></span><section><span leaf="">数据不出内网，支持 Llama3/DeepSeek 等本地模型</span></section></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">无法确认真实性</span></strong><section><span leaf=""><br/></span><section><span leaf="">外包项目漏洞多，不知道哪些漏洞真实可被利用</span></section></section></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;"><span leaf="">💥 沙箱 PoC 验证</span></strong><section><span leaf=""><br/></span><section><span leaf="">自动生成并执行攻击脚本，确认漏洞真实危害</span></section></section></td></tr></tbody></table>  
## 🏗️ 系统架构  
### 整体架构图  
### DeepAudit 采用微服务架构，核心由 Multi-Agent 引擎驱动。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/P8tspoQj3VrtCPP4xenFzOqAjewnU2JFFcfoiblg0zW3xY4o3aKMziaCZAiclHmwwE2Or7hUIVb502IV2jVcmQzwYS700oV6wVvSK16EFXae0A/640?wx_fmt=png&from=appmsg "")  
### 🔄 审计工作流  
<table><thead><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><th align="center" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">步骤</span></section></th><th align="center" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">阶段</span></section></th><th align="center" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">负责 Agent</span></section></th><th align="left" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">主要动作</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">1</span></span></section></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">策略规划</span></span></strong></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">Orchestrator</span></span></strong></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">接收审计任务，分析项目类型，制定审计计划，下发任务给子 Agent</span></span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">2</span></span></section></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">信息收集</span></span></strong></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">Recon Agent</span></span></strong></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">扫描项目结构，识别框架/库/API，提取攻击面（Entry Points）</span></span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">3</span></span></section></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">漏洞挖掘</span></span></strong></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">Analysis Agent</span></span></strong></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">结合 RAG 知识库与 AST 分析，深度审查代码，发现潜在漏洞</span></span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">4</span></span></section></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">PoC 验证</span></span></strong></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">Verification Agent</span></span></strong></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">(关键)</span></span></strong><section><span leaf=""><span textstyle="" style="font-size: 12px;"> 编写 PoC 脚本，在 Docker 沙箱中执行。如失败则自我修正重试</span></span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">5</span></span></section></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">报告生成</span></span></strong></td><td align="center" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf=""><span textstyle="" style="font-size: 12px;">Orchestrator</span></span></strong></td><td align="left" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">汇总所有发现，剔除被验证为误报的漏洞，生成最终报告</span></span></section></td></tr></tbody></table>### 📂 项目代码结构  
```
DeepAudit/├── backend/                        # Python FastAPI 后端│   ├── app/│   │   ├── agents/                 # Multi-Agent 核心逻辑│   │   │   ├── orchestrator.py     # 总指挥：任务编排│   │   │   ├── recon.py            # 侦察兵：资产识别│   │   │   ├── analysis.py         # 分析师：漏洞挖掘│   │   │   └── verification.py     # 验证者：沙箱 PoC│   │   ├── core/                   # 核心配置与沙箱接口│   │   ├── models/                 # 数据库模型│   │   └── services/               # RAG, LLM 服务封装│   └── tests/                      # 单元测试├── frontend/                       # React + TypeScript 前端│   ├── src/│   │   ├── components/             # UI 组件库│   │   ├── pages/                  # 页面路由│   │   └── stores/                 # Zustand 状态管理├── docker/                         # Docker 部署配置│   ├── sandbox/                    # 安全沙箱镜像构建│   └── postgres/                   # 数据库初始化└── docs/                           # 详细文档
```  
## 🚀 快速开始  
### 方式一：一行命令部署（推荐）  
  
使用预构建的 Docker 镜像，无需克隆代码，一行命令即可启动：  
```
```  
## 🇨🇳 国内加速部署（作者亲测非常无敌之快）  
  
使用南京大学镜像站加速拉取 Docker 镜像（将 ghcr.io  
 替换为 ghcr.nju.edu.cn  
）：  
```
```  
手动拉取镜像（如需单独拉取）（点击展开）# 前端镜像docker pull ghcr.nju.edu.cn/lintsinghua/deepaudit-frontend:latest# 后端镜像docker pull ghcr.nju.edu.cn/lintsinghua/deepaudit-backend:latest# 沙箱镜像docker pull ghcr.nju.edu.cn/lintsinghua/deepaudit-sandbox:latest> 💡 镜像源由 南京大学开源镜像站 提供支持  
  
💡 配置 Docker 镜像加速（可选，进一步提升拉取速度）（点击展开）  
如果拉取镜像仍然较慢，可以配置 Docker 镜像加速器。编辑 Docker 配置文件并添加以下镜像源：  
  
**Linux / macOS**  
：编辑 /etc/docker/daemon.json  
  
**Windows**  
：右键 Docker Desktop 图标 → Settings → Docker Engine  
```
```  
  
  
保存后重启 Docker 服务：  
```
```  
  
> 🎉 **启动成功！**  
 访问 http://localhost:3000 开始体验。  
  
### 方式二：克隆代码部署  
### 适合需要自定义配置或二次开发的用户：  
```
```  
  
> 首次启动会自动构建沙箱镜像，可能需要几分钟。  
  
## 🔧 源码开发指南  
### 适合开发者进行二次开发调试。  
  
环境要求  
- Python 3.11+  
  
- Node.js 20+  
  
- PostgreSQL 15+  
  
- Docker (用于沙箱)  
  
### 1. 手动启动数据库  
```
```  
### 2. 后端启动  
```
cd backend
# 配置环境
cp env.example .env

# 使用 uv 管理环境（推荐）
uv sync
source .venv/bin/activate

# 启动 API 服务
uvicorn app.main:app --reload
```  
### 3. 前端启动  
```
cd frontend
# 配置环境
cp .env.example .env

pnpm install
pnpm dev
```  
### 3. 沙箱环境  
```
开发模式下需要本地 Docker 拉取沙箱镜像：
```  
```
# 标准拉取
docker pull ghcr.io/lintsinghua/deepaudit-sandbox:latest

# 国内加速（南京大学镜像站）
docker pull ghcr.nju.edu.cn/lintsinghua/deepaudit-sandbox:latest
```  
## 🤖 Multi-Agent 智能审计  
### 支持的漏洞类型  
漏洞类型描述sql_injectionSQL 注入xss跨站脚本攻击command_injection命令注入path_traversal路径遍历ssrf服务端请求伪造xxeXML 外部实体注入漏洞类型描述insecure_deserialization不安全反序列化hardcoded_secret硬编码密钥weak_crypto弱加密算法authentication_bypass认证绕过authorization_bypass授权绕过idor不安全直接对象引用> 📖 详细文档请查看 **Agent 审计指南**  
  
## 🔌 支持的 LLM 平台  
🌍 国际平台OpenAI GPT-4o / GPT-4Claude 3.5 Sonnet / OpusGoogle Gemini ProDeepSeek V3🇨🇳 国内平台通义千问 Qwen智谱 GLM-4Moonshot Kimi文心一言 · MiniMax · 豆包🏠 本地部署OllamaLlama3 · Qwen2.5 · CodeLlamaDeepSeek-Coder · Codestral代码不出内网  
💡 支持 API 中转站，解决网络访问问题 | 详细配置 → LLM 平台支持  
## 🎯 功能矩阵  
<table><thead><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">功能</span></section></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">说明</span></section></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">模式</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">🤖 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">Agent 深度审计</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Multi-Agent 协作，自主编排审计策略</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Agent</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">🧠 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">RAG 知识增强</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">代码语义理解，CWE/CVE 知识库检索</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Agent</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">🔒 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">沙箱 PoC 验证</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Docker 隔离执行，验证漏洞有效性</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Agent</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">🗂️ </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">项目管理</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">GitHub/GitLab/Gitea 导入，ZIP 上传，10+ 语言支持</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">⚡ </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">即时分析</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">代码片段秒级分析，粘贴即用</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">🔍 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">五维检测</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">Bug · 安全 · 性能 · 风格 · 可维护性</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">💡 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">What-Why-How</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">精准定位 + 原因解释 + 修复建议</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">📋 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">审计规则</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">内置 OWASP Top 10，支持自定义规则集</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">📝 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">提示词模板</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">可视化管理，支持中英文双语</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">📊 </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">报告导出</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">PDF / Markdown / JSON 一键导出</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.555556px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">⚙️ </span><strong style="box-sizing: border-box;font-weight: 600;margin-bottom: 0px;"><span leaf="">运行时配置</span></strong></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">浏览器配置 LLM，无需重启服务</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.555556px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">通用</span></section></td></tr></tbody></table>## 🦖 发展路线图  
  
我们正在持续演进，未来将支持更多语言和更强大的 Agent 能力。  
-  基础静态分析，集成 Semgrep  
  
-  引入 RAG 知识库，支持 Docker 安全沙箱  
  
-  **Multi-Agent 协作架构**  
 (Current)  
  
-  支持更真实的模拟服务环境，进行更真实漏洞验证流程  
  
-  沙箱从function_call优化集成为稳定MCP服务  
  
-  **自动修复 (Auto-Fix)**  
: Agent 直接提交 PR 修复漏洞  
  
-  **增量PR审计**  
: 持续跟踪 PR 变更，智能分析漏洞，并集成CI/CD流程  
  
-  **优化RAG**  
: 支持自定义知识库  
  
## ⚠️ 重要安全声明  
### 法律合规声明  
1. 禁止**任何未经授权的漏洞测试、渗透测试或安全评估**  
  
1. 本项目仅供网络空间安全学术研究、教学和学习使用  
  
1. 严禁将本项目用于任何非法目的或未经授权的安全测试  
  
### 漏洞上报责任  
1. 发现任何安全漏洞时，请及时通过合法渠道上报  
  
1. 严禁利用发现的漏洞进行非法活动  
  
1. 遵守国家网络安全法律法规，维护网络空间安全  
  
### 使用限制  
- 仅限在授权环境下用于教育和研究目的  
  
- 禁止用于对未授权系统进行安全测试  
  
- 使用者需对自身行为承担全部法律责任  
  
### 免责声明  
  
作者不对任何因使用本项目而导致的直接或间接损失负责，使用者需对自身行为承担全部法律责任。  
## 📖 详细安全政策  
  
有关安装政策、免责声明、代码隐私、API使用安全和漏洞报告的详细信息，请参阅 DISCLAIMER.md 和 SECURITY.md 文件。  
### 快速参考  
- **代码隐私警告**  
: 您的代码将被发送到所选择的LLM服务商服务器  
- **敏感代码处理: 使用本地模型处理敏感代码**  
- **合规要求: 遵守数据保护和隐私法律法规**  
- **漏洞报告: 发现安全问题请通过合法渠道上报**  
项目地址：  
  
https://github.com/lintsinghua/DeepAudit  
  
