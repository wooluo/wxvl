#  MCP协议架构级漏洞深度分析：STDIO设计缺陷引发大规模AI供应链安全危机  
原创 威胁情报中心
                    威胁情报中心  奇安信威胁情报中心   2026-04-19 01:30  
  
## 威胁概览  
  
奇安信威胁情报中心监测发现，安全研究机构Ox Security于2026年4月披露了Anthropic公司Model Context Protocol（MCP）协议中存在的  
架构级设计缺陷。该漏洞根植于MCP协议的STDIO传输机制，攻击者可利用此缺陷实现未授权命令注入与远程代码执行（RCE），受影响系统规模超过  
20万台服务器，相关SDK累计下载量突破  
1.5亿次。  
  
威胁定性：高危（Critical）  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">评估维度</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">详情</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">漏洞类型</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">架构设计缺陷导致的命令注入与RCE</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">影响范围</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">20万+服务器，150M+SDK下载，7000+公开MCP实例</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">利用难度</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">低（无需高级技术背景）</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">攻击前提</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">低（部分场景为零点击利用）</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">厂商态度</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">拒绝修复，定性为&#34;预期行为&#34;</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">已披露CVE</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">10+（高危/严重级别）</span></section></td></tr></tbody></table>  
从威胁情报角度评估，该漏洞已非单一产品安全事件，而是演变为  
AI基础设施层面的系统性供应链风险。Anthropic作为AI领域头部企业，其主导协议的架构缺陷将对整个AI开发生态产生深远影响。  
## 技术根因剖析  
### MCP协议与STDIO传输机制  
  
Model Context Protocol（MCP）是Anthropic于2024年11月发布的开源协议，旨在为大型语言模型（LLM）、AI应用和智能代理提供连接外部数据源、系统和服务统一接口。该协议支持多编程语言实现，包括Python、TypeScript、Java和Rust，覆盖当前主流AI开发技术栈。  
  
核心问题  
在于MCP采用STDIO（标准输入/输出）作为本地传输机制。当AI应用需要调用MCP服务器时，协议设计允许以子进程形式启动MCP服务器，并通过STDIO进行进程间通信。  
  
**漏洞本质**  
：STDIO传输层的设计逻辑存在根本性缺陷。当通过"command"参数传入任意  
操作  
系统命令时，该命令**无论进程是否成功启动都会被执行**  
。具体表现为：  
- 若命令成功创建STDIO服务器，则返回句柄供后续使用  
  
- 若命令执行失败，仍会在收到错误响应  
之前完成命令执行  
  
这种"先执行、后验证"的行为模式，使攻击者可以在进程启动阶段注入恶意命令，利用命令执行到错误返回之间的时间窗口完成攻击。  
### 攻击链技术解析  
```
攻击者输入 → STDIO传输层 → 命令执行（无认证/无清理） → 系统接管 ↓ [漏洞触发] ↓ 返回错误信息（此时命令已执行完毕）
```  
  
该攻击链具备以下特征：  
1. 1. **时间窗口利用**  
：命令执行发生在STDIO错误处理流程之前  
  
1. 2. **认证绕过**  
：STDIO传输层本身不包含认证机制  
  
1. 3. **清理失效**  
：开发者层面的输入清理无法触及协议底层执行逻辑  
  
1. 4. **跨平台影响**  
：影响所有使用官方SDK的项目（Python/TypeScript/Java/Rust）  
  
1.   
## 四大攻击向量深度分析  
  
奇安信威胁情报团队根据Ox Security研究报告，对该漏洞衍生的攻击向量进行系统性梳理：  
### 攻击向量一：未授权命令注入  
  
**技术描述**  
：STDIO传输机制允许攻击者直接注入任意操作系统命令，命令以服务器端执行权限运行，无需任何认证或输入清理。  
  
**影响范围**  
：  
- • 所有版本的LangFlow（IBM开源低代码AI应用框架）  
  
- • GPT Researcher（开源深度研究AI代理）  
  
**技术影响**  
：攻击者可获得目标服务器完整控制权，访问敏感用户数据、内部数据库、API密钥及聊天记录。  
  
**CVE关联**  
：CVE-2025-65720（GPT Researcher）  
### 攻击向量二：加固绕过攻击  
  
**技术描述**  
：部分MCP实现已尝试通过白名单机制加固，仅允许特定命令（如"python"、"npm"、"npx"）通过"command"参数执行。攻击者可利用这些"安全"命令的参数注入能力绕过限制。  
  
**绕过技术**  
：  
```
npx -c <malicious_command>
```  
  
通过在允许命令的子参数中传入恶意内容，攻击者可间接执行任意命令，将白名单防护形同虚设。  
  
**受影响项目**  
：  
- • Upsonic（CVE-2026-30625）  
  
- • Flowise（GHSA-c9gw-hvqq-f33r）  
  
**威胁影响**  
：即便开发者已实施基础安全加固措施，该漏洞仍可导致完整的命令注入和系统接管。  
### 攻击向量三：零点击提示词注入  
  
**技术描述**  
：在AI集成开发环境（IDE）和编程助手中，用户输入的提示词可直接影响MCP JSON配置，无需用户任何额外交互即可触发漏洞。  
  
**受影响产品**  
：  
- • Windsurf（CVE-2026-30615）  
  
- • Claude Code  
  
- • Cursor  
  
- • Gemini-CLI  
  
- • GitHub Copilot  
  
**威胁特征**  
：这是唯一真正的零点击攻击向量。用户仅需正常与AI助手对话，恶意构造的提示词即可触发MCP配置变更，进而执行任意命令。  
  
**厂商态度**  
：Google、Microsoft及Anthropic均将此问题定性为"已知限制"或"非有效漏洞"，理由是修改配置需要用户明确授权。奇安信认为这一判断存在重大偏差——用户授权的是与AI进行对话交互，而非授权系统执行任意命令。  
### 攻击向量四：MCP市场供应链投毒  
  
**技术描述**  
：MCP市场允许开发者发布和分发MCP工具包，攻击者可向市场提交内含恶意命令的MCP包。研究团队测试结果显示：  
- • 测试样本：11个MCP市场  
  
- • 投毒成功：9个市场  
  
- • 概念验证：植入可执行任意命令的MCP包（测试使用创建空文件）  
  
**危害评估**  
：  
- • 目标市场月访问量达数十万级别  
  
- • 单个恶意MCP包可在被发现前被数千开发者安装  
  
- • 每次安装即为攻击者提供目标机器的完整命令执行权限  
  
**攻击场景**  
：这是一个典型的供应链投毒模式。攻击者只需成功提交一个恶意MCP包，即可实现对大量下游开发环境的规模化入侵。  
  
## MITRE ATT&CK战术技术映射  
  
奇安信威胁情报团队将该漏洞相关攻击活动映射至MITRE ATT&CK框架：  
  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">战术阶段</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">技术ID</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">技术名称</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">适用场景</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">初始访问</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1190</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">利用面向公众的应用</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">暴露的MCP服务器</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">执行</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1059</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">命令与脚本解释器</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">通过STDIO注入的命令执行</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">执行</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1053</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">计划任务/作业</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">持久化部署后门</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">持久化</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1543</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">创建/修改系统进程</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">通过MCP建立持久化控制</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">权限提升</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1068</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">利用特权升级漏洞</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">命令以高权限执行</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">防御规避</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1027</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">混淆文件或信息</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">恶意MCP包编码混淆</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">凭证访问</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1552</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">未保护凭证</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">窃取API密钥和环境变量</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">横向移动</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1021</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">远程服务</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">通过MCP扩展攻击范围</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">数据外泄</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1041</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">通过C2通道外泄</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">窃取敏感数</span></section></td></tr></tbody></table>  
  
## 国内关联影响评估  
### 波及范围  
  
从奇安信威胁情报中心监测数据来看，该漏洞对国内AI开发生态的影响体现在以下层面：  
  
**开发者生态层面**  
：  
- • 国内大量AI应用基于Python开发，官方Python SDK受影响  
  
- • 开源AI框架（如LangFlow、Flowise）在GitHub上拥有大量国内开发者Fork和Star  
  
- • 主流AI编程助手（通义灵码、文心快码等）虽未在原报告提及，但若采用MCP协议同样面临风险  
  
**企业应用层面**  
：  
- • 互联网企业AI Agent开发普遍采用MCP协议连接外部工具  
  
- • 金融、政务领域AI应用集成MCP进行数据对接  
  
- • 云服务商MCP相关产品线潜在受影响  
  
**供应链层面**  
：  
- • MCP市场投毒可影响国内开发者通过镜像站获取的工具包  
  
- • 攻击者可通过国内技术社区传播恶意MCP包  
  
- • 开发环境容器镜像若包含易受攻击的MCP SDK，将导致大规模扩散  
  
### 威胁行为体归因分析  
  
**初级威胁行为体**  
（脚本小子）：  
- • 技术门槛低：STDIO注入无需高级漏洞利用技术  
  
- • 工具易获取：MCP市场投毒可批量自动化  
  
- • 目标价值高：开发者机器通常存储SSH密钥、API凭证、项目代码  
  
**高级持续性威胁（APT）组织**  
：  
- • 供应链投毒模式契合APT攻击链设计  
  
- • 可针对特定开发团队实施定向入侵  
  
- • 利用开发者环境横向移动至目标企业网络  
  
**企业竞争对手/商业间谍**  
：  
- • 窃取竞品代码和商业机密  
  
- • 获取API密钥进行资源滥用  
  
- • 在开发阶段植入后门，实现长期潜伏  
  
## 漏洞处置现状与厂商立场分析  
### 负责任披露过程  
  
Ox Security安全研究团队于2025年11月启动该研究，历时约5个月，完成超过**30次**  
负责任披露协调：  
- • 向Anthropic提交漏洞详情及修复建议  
  
- • 协调30余家MCP提供商修补具体产品漏洞  
  
- • 推动10余个高危/严重级别CVE的发布  
  
### Anthropic官方立场  
  
**核心结论**  
：Anthropic拒绝修改协议底层架构，明确表示该行为属于"预期行为"。  
  
**官方解释**  
：  
1. 1. STDIO执行模型代表"安全默认值"  
  
1. 2. 输入清理责任应完全由SDK使用者承担  
  
1. 3. 仅更新安全指南，建议开发者"谨慎"使用STDIO适配器  
  
**后续动作**  
：收到研究报告一周后，Anthropic悄然更新安全策略文档，将STDIO适配器使用标注为"需谨慎"。  
### 奇安信专业评估  
  
从安全工程实践角度，奇安信威胁情报团队对Anthropic的立场持**明确异议**  
：  
  
**架构层面的安全责任不可下放**  
：  
- • 协议设计者对协议安全性承担首要责任  
  
- • SDK使用者无法在协议层施加有效安全约束  
  
- • "由使用者负责清理"意味着每个下游项目都需重复实现安全机制  
  
- • 架构缺陷导致的系统性风险无法通过下游补丁有效控制  
  
**"预期行为"不等于"安全行为"**  
：  
- • 安全协议设计应遵循"默认安全"原则  
  
- • 命令执行前应进行显式授权验证  
  
- • STDIO传输层的"先执行后验证"模式本质上是不安全的设计选择  
  
**SDK层面的10+ CVE印证了架构缺陷**  
：  
- • 若问题仅存在于下游实现，相关厂商应可独立修复  
  
- • 大量独立产品出现同类漏洞，指向共同的架构根因  
  
- • Anthropic作为协议制定者，有能力也有责任从协议层面解决该问题  
  
-   
## 缓解措施与安全建议  
### 短期应急措施  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">措施类别</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">具体建议</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">禁用STDIO</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">评估并切换至SSE或其他传输机制</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">输入验证</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">对所有MCP命令参数实施严格白名单过滤</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">权限控制</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">MCP服务器以最低权限账户运行</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">网络隔离</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">限制MCP服务器网络访问能力</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">日志审计</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">监控异常命令执行行为</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(51, 51, 51);font-size: inherit;"><span leaf="">依赖审查</span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">检查项目MCP依赖是否存在已知漏洞</span></section></td></tr></tbody></table>  
### 中期加固方向  
  
**协议层面**  
：  
- • 推动MCP协议引入命令执行授权机制  
  
- • 实现命令参数的架构级清理  
  
- • 添加传输层认证和完整性校验  
  
**SDK层面**  
：  
- • 官方SDK应默认启用安全传输模式  
  
- • 提供安全配置指南和最佳实践  
  
- • 建立SDK安全更新响应机制  
  
**生态层面**  
：  
- • 建立MCP包安全审核机制  
  
- • 实现包签名和来源验证  
  
- • 推动MCP安全标准的行业共识  
  
### 长期战略建议  
1. 1. **供应链安全审计**  
：对AI基础设施依赖的第三方协议实施安全评估  
  
1. 2. **零信任集成**  
：MCP交互纳入零信任安全框架  
  
1. 3. **威胁建模**  
：针对AI应用场景进行专项威胁建模  
  
1. 4. **应急响应准备**  
：建立AI供应链安全事件应急响应预案  
  
1.   
## 结论  
  
MCP协议的STDIO设计缺陷是一个典型的**系统性安全架构问题**  
，而非单一产品漏洞。Anthropic拒绝从协议层面修复该缺陷的立场，使整个AI开发生态面临持续性供应链安全威胁。  
  
**关键风险点总结**  
：  
- • **架构缺陷**  
：STDIO传输机制先天存在命令注入风险  
  
- • **规模庞大**  
：20万+服务器、1.5亿+下载量构成重大攻击面  
  
- • **利用门槛低**  
：脚本小子到APT组织均可利用  
  
- • **厂商推诿**  
：Anthropic以"预期行为"为由拒绝担责  
  
- • **生态脆弱**  
：MCP市场投毒可实现规模化供应链攻击  
  
奇安信威胁情报中心将持续跟踪该漏洞及相关威胁活动态势。建议所有使用MCP协议的企业和开发者立即评估风险暴露面，采取紧急缓解措施，并密切关注Anthropic后续安全公告。  
  
  
## IOC指标  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">类型</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">标识符</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">描述</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE-2026-30625</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">Upsonic命令注入漏洞</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE-2026-30615</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">Windsurf零点击提示词注入漏洞</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">CVE-2025-65720</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">GPT Researcher命令注入漏洞</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">GHSA</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">GHSA-c9gw-hvqq-f33r</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">Flowise加固绕过漏洞</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">TTP</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1059</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">命令与脚本解释器执行</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">TTP</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1190</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">利用面向公众的应用</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">TTP</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1027</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">混淆文件或信息</span></section></td></tr></tbody></table>  
## MITRE ATT&CK技术映射  
  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">战术</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">技术ID</span></section></th><th style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">名称</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">初始访问</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1190</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">利用面向公众的应用</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">执行</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1059</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">命令与脚本解释器</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">执行</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1053</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">计划任务/作业</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">持久化</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1543</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">创建/修改系统进程</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">权限提升</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1068</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">利用特权升级漏洞</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">防御规避</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1027</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">混淆文件或信息</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">凭证访问</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1552</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">未保护凭证</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">横向移动</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1021</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">远程服务</span></section></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">数据外泄</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">T1041</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(10, 10, 10);word-break: keep-all;text-align: left;"><section><span leaf="">通过C2通道外泄</span></section></td></tr></tbody></table>  
  
## 参考来源  
- https://go.theregister.com/feed/www.theregister.com/2026/04/16/anthropic_mcp_design_flaw/  
  
- Anthropic MCP官方文档与安全策略  
  
