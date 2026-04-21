#  Anthropic MCP 架构曝“设计级”漏洞：影响超 20 万服务器，AI 供应链安全拉响警报  
原创 小K
                    小K  黑白之道   2026-04-21 01:25  
  
> **导语**  
：2026年4月15日，安全研究机构 OX Security 发布报告，披露了 Anthropic 公司 Model Context Protocol（MCP）架构中一项被称为"设计即漏洞"的系统性安全缺陷。该漏洞影响范围极广——涉及超过 200 个开源项目、7,000 多台公开 MCP 服务器、1.5 亿次 SDK 下载，以及超过 20 万台受影响服务器。这被 OX Security 形容为 AI 供应链的"心脏出血"时刻。  
  
## 一、漏洞概述：STDIO 传输层的设计缺陷  
  
MCP 协议是 Anthropic 于 2024 年 11 月发布的开源协议，旨在为大型语言模型、AI 应用和智能代理提供连接外部数据源、系统和服务的统一接口。协议采用 STDIO（标准输入/输出）作为本地传输机制——当 AI 应用需要调用 MCP 服务器时，协议允许以子进程形式启动 MCP 服务器，并通过 STDIO 进行进程间通信。  
  
问题出在 STDIO 传输层的执行逻辑上。OX Security 研究发现，当通过 command  
 参数传入任意操作系统命令时，该命令**无论进程是否成功启动都会被执行**  
：  
> "MCP's STDIO interface was designed to launch a local server process. But the command is executed regardless of whether the process starts successfully. Pass in a malicious command, receive an error – and the command still runs."  
  
  
这种"先执行、后验证"的机制，使攻击者可以在进程启动阶段注入恶意命令，利用命令执行到错误返回之间的时间窗口完成攻击。  
## 二、四大攻击向量：从未授权注入到市场投毒  
  
OX Security 的报告系统性梳理了四种主要攻击向量：  
### 2.1 未授权命令注入  
  
STDIO 传输机制允许攻击者直接注入任意操作系统命令，命令以服务器端执行权限运行，无需任何认证或输入清理。  
- **受影响项目**  
：LangFlow（IBM 开源低代码 AI 应用框架）、GPT Researcher  
  
- **关联 CVE**  
：CVE-2025-65720（GPT Researcher）  
  
- **风险后果**  
：攻击者可获得目标服务器完整控制权，访问敏感用户数据、内部数据库、API 密钥及聊天记录  
  
### 2.2 加固绕过攻击（白名单突破）  
  
部分 MCP 实现已通过白名单机制加固，仅允许特定命令（如 python  
、npm  
、npx  
）通过 command  
 参数执行。然而，攻击者可利用这些"安全"命令的参数注入能力绕过限制。  
  
**绕过示例**  
：npx -c <malicious_command>  
  
即便开发者已实施基础安全加固措施，仍可导致完整的命令注入和系统接管。  
- **受影响项目**  
：Upsonic（CVE-2026-30625）、Flowise（GHSA-c9gw-hvqq-f33r）  
  
### 2.3 零点击提示词注入  
  
在 AI 集成开发环境（IDE）和编程助手中，用户输入的提示词可直接影响 MCP 配置。攻击者通过精心构造的提示词，可在用户无感知的情况下修改 MCP 配置并执行恶意命令。  
  
**攻击机制**  
：LLM 代理读取攻击者控制的内容（如网页、仓库文件、客户消息），其中包含隐藏指令，代理按设计修改本地 MCP 配置文件，下次 MCP 服务器加载时恶意命令自动执行——**无需用户任何交互**  
。  
- **受影响项目**  
：Windsurf（CVE-2026-30615，被确认为零点击 RCE 路径）、Cursor（CVE-2025-54135/CVE-2025-54136）  
  
该攻击向量揭示了 MCP 与传统 Web 安全模型的根本性差异：传统模型假设用户输入与开发者代码之间有明确边界，而 MCP 中 LLM 代理可以读取攻击者控制的内容并修改本地配置，使开发者编写的输入验证逻辑从未被执行。  
### 2.4 MCP 市场投毒  
  
 2026 年 4 月 18 日发布的后续研究显示，研究人员向 11 个 MCP 市场提交了恶意概念验证 MCP 服务器，**9 个市场接受了它们**  
。  
  
**风险等级**  
：攻击者可预先在市场中植入后门 MCP 服务器，静待用户安装使用。  
  
**已发现的恶意服务器**  
：  
- mcp-database-server  
（CVSS 8.8）：MySQL 适配器硬编码 multipleStatements: true  
，可被 SELECT 1; DROP TABLE users; --  
 绕过  
  
- mcp-ssh  
：LLM 可指向任意主机名，存在三条不同的 RCE/数据外泄路径  
  
- ClickHouse 官方 MCP 服务器：通过 DROP/**/TABLE  
 绕过安全检查  
  
## 三、影响范围：已有 10 余个 CVE 被确认  
  
根据 OX Security 的负责任披露流程，目前已有超过 30 项披露和 10 个以上高严重性漏洞获得补丁修复或正在修复中：  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">CVE 编号</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">受影响项目</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">状态</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2025-65720</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">GPT Researcher</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30623</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">LiteLLM</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已修复</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30624</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Agent Zero</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30618</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Fay Framework</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-33224</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Bisheng</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已修复</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30617</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Langchain-Chatchat</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30625</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Upsonic</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-30615</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Windsurf</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-26015</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">DocsGPT</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已修复</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2026-40933</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Flowise</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2025-54136</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Cursor</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">已报告</span></section></td></tr></tbody></table>  
一旦攻击者成功利用该漏洞，可实现：**敏感数据泄露**  
（API 密钥、环境变量、SSH 密钥）、**完整对话历史暴露**  
（RAG 检索上下文和用户对话记录）、**横向渗透**  
（从个人设备蔓延至企业内网）、**供应链后门植入**  
（通过"受信任"的 MCP 配置持久化）。  
  
OX Security 将其描述为"**AI 供应链之母**  
"（The Mother of All AI Supply Chains）。  
## 四、Anthropic 回应：技术正确，但争议未息  
  
面对 OX Security 的披露，Anthropic 回应称：MCP SDK 允许 stdio 执行是**有意为之的设计**  
，客户端应用程序开发者有责任验证进入 command  
 字段的内容。这与 Web 安全领域的基本模型一致——数据库不验证 SQL 查询，应用程序负责；库不清理输入，程序员负责。  
  
从技术角度而言，这个立场并非没有道理。然而，OX Security 指出 MCP 与 AI 代理的引入打破了传统 Web 安全模型的基本假设：  
- **"用户"身份不明确**  
：攻击者并非直接与开发者交互，而是通过 LLM 代理——代理读取攻击者控制的内容，修改本地配置，开发者编写的清理代码从未执行  
  
- **零交互场景的盲区**  
：在向量二和向量三（白名单绕过、零点击注入）的场景下，不存在人类开发者在键盘前，"应用程序开发者验证输入"的逻辑从未被触发  
  
- **责任转移问题**  
：Anthropic 仅将安全指南更新为"谨慎使用 MCP 适配器"，却保留漏洞原封不动  
  
## 五、安全建议  
### 紧急应对措施  
- **立即升级 SDK**  
：将 Python-mcp-sdk、node-mcp-sdk 及相关依赖强制升级到最新加固版本  
  
- **禁用公网暴露**  
：切勿将大语言模型及相关 AI 工具直接暴露在公网环境下  
  
- **输入验证加固**  
：对 MCP 配置的 command  
 和 args  
 字段实施严格的正则表达式校验和 shell 字符转义  
  
- **沙盒化传输**  
：将 MCP 服务器运行在 Docker 容器或受限 WASM 环境中  
  
- **最小权限原则**  
：MCP 服务器应以最低必要权限运行  
  
### 协议层长期解决方案  
- 弃用未清理的 STDIO 连接，改为安全优先的设计  
  
- 在 MCP 规范层面加入命令隔离机制  
  
- 添加"危险模式"显式选择加入，需要明确确认才能启用高权限配置  
  
- 建立标准化的 MCP 市场安全清单和验证机制  
  
## 六、结语  
  
MCP 协议的 STDIO 设计缺陷，本质上是 AI 时代对传统安全模型的一次结构性冲击。当一个协议的设计默认行为允许任意命令执行而不设任何边界隔离，无论下游开发者多么谨慎，都无法完全消除系统性风险。  
  
正如 OX Security 所警告的：如果不从协议层面修复，AI 基础设施正面临"AI 供应链之母"级别的灾难性攻击。对于整个行业而言，这不仅是一个需要紧急修补的技术漏洞，更是对 AI 互联协议安全设计原则的一次深刻警示。  
  
