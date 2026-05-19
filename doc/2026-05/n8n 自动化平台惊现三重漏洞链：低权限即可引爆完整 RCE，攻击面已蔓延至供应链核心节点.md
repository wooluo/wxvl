#  n8n 自动化平台惊现三重漏洞链：低权限即可引爆完整 RCE，攻击面已蔓延至供应链核心节点  
原创 威胁情报中心
                    威胁情报中心  奇安信威胁情报中心   2026-05-19 02:50  
  
## 事件概述  
  
n8n 作为一款开源工作流程自动化平台，近年来在 DevOps 团队、SaaS 集成商以及中大型企业中迅速普及。其架构设计允许用户通过可视化方式串联 API、数据库、云服务和内部工具，构建高度自动化的业务流程。这种"核心枢纽"定位使其成为攻击者梦寐以求的目标——一旦攻陷平台本身，攻击者即可横向染指整个数据处理链。  
  
奇安信威胁情报中心监测发现，安全研究人员 Jubke 披露了 n8n 平台中一组可串联利用的高危漏洞。三个漏洞（CVE-2026-44789  
、CVE-2026-44790  
、CVE-2026-44791  
）分布在 HTTP Request 节点、Git 节点和 XML 节点中，组合后可实现完整的远程代码执行（RCE）。更值得警惕的是，利用门槛极低——攻击者仅需拥有创建或编辑工作流程的基本权限，即可触发整条攻击链，完成从权限提升到服务器接管的全流程。  
  
受影响版本如下：  
- n8n **< 1.123.43**  
- n8n **< 2.20.7**  
- n8n **< 2.22.1**  
官方已在修复版本中完成补丁推送，建议所有使用 n8n 的企业立即核查部署版本，并优先完成升级。  
  
## 漏洞技术分析  
### CVE-2026-44789：HTTP Request 节点原型污染  
  
**严重等级**  
：Critical | **CWE**  
：CWE-1321（原型污染）| **MITRE ATT&CK**  
：T1203  
  
该漏洞是三个漏洞中危害最为严重的一个，位于 n8n 的 HTTP Request 节点。问题根源在于分页参数校验存在缺陷，攻击者可以利用 JavaScript 原型污染（Prototype Pollution）技术向全局对象注入恶意属性。当受害实例上的其他工作流程被执行时，这些被污染的属性会触发意外行为，最终导致任意代码在服务器端执行。  
  
原型污染在 JavaScript 应用安全领域并非新鲜事物，但在自动化平台场景下危害被显著放大。n8n 的工作流程通常处理来自多个外部源的动态数据，一旦攻击者通过原型污染篡改了核心对象的运行时行为，破坏效应会沿着工作流程的执行链路级联传播，影响范围远超单一工作流程本身。  
  
从攻击向量来看，这是一个纯网络侧攻击（AV:N），无需任何用户交互，CVSS 评分达到高危区间。攻击者可以在不触发任何告警的情况下完成 exploit。  
### CVE-2026-44790：Git 节点命令行注入  
  
**严重等级**  
：High | **CWE**  
：CWE-88（命令参数注入）| **关联 MITRE ATT&CK**  
：T1059（命令与脚本解释器）  
  
第二个漏洞影响 Git 节点。当 n8n 执行 Git push 操作时，用户输入的某些参数被直接拼接到命令行参数中，未经过充分的边界校验。攻击者利用这一缺陷，可以在 Git push 过程中注入恶意 CLI 参数，进而读取服务器上的任意文件。  
  
这一漏洞的破坏力不容低估。通过文件读取，攻击者可获取敏感信息，包括但不限于：  
- 配置文件中的数据库连接字符串  
- API 密钥和认证凭据  
- 环境变量文件（.env  
）  
- SSH 私钥及其他密钥材料  
一旦攻击者获取了这些凭据，后续行动空间将大幅扩展——从横向移动到持久化控制，威胁等级迅速攀升。  
### CVE-2026-44791：XML 节点补丁绕过  
  
**严重等级**  
：High | **CWE**  
：CWE-1321（原型污染）  
  
第三个漏洞是 XML 节点中早期安全修复的绕过。n8n 团队此前曾针对该节点的原型污染问题发布过补丁，但研究人员发现，通过替代数据路径仍可成功触发相同的污染行为。这意味着即便企业环境中已部署了之前的补丁，攻击者仍可利用这一绕过路径配合 CVE-2026-44789 实现完整的 RCE。  
  
该漏洞的存在说明：在 JavaScript 运行时环境中，单一路径的修复不等于全局安全。"头痛医头"的修补策略在面对原型污染这类语言特性级别的漏洞时，往往难以根除问题。  
  
## 攻击链解析：低权限如何撬开服务器大门  
  
三个漏洞并非孤立存在，而是形成了一条完整的攻击链。以下是奇安信威胁情报团队还原的攻击路径：  
  
**第一步：立足**  
。攻击者获取一个拥有工作流程创建/编辑权限的低权限账户。在多数企业环境中，DevOps 工程师、自动化管理员甚至部分业务人员都可能拥有这类权限。  
  
**第二步：污染**  
。攻击者利用 CVE-2026-44789 在 HTTP Request 节点中构造恶意分页参数，通过原型污染向 JavaScript 全局对象注入恶意属性。这一步不需要任何管理员权限，仅利用节点本身的功能逻辑即可实现。  
  
**第三步：横向扩大**  
。通过 CVE-2026-44791 绕过此前针对 XML 节点的安全修复，确保原型污染路径在多种数据处理场景下均可持续生效。  
  
**第四步：凭据窃取**  
。利用 CVE-2026-44790 的命令行注入漏洞，通过 Git push 操作读取服务器上的敏感文件——配置、密钥、凭据统统落入攻击者手中。  
  
**第五步：全面接管**  
。结合前几步获取的凭据和环境信息，攻击者可在服务器上执行任意代码，完成从"低权限用户"到"系统控制者"的权限跨越。整个过程静默高效，不会触发常规安全监控的告警阈值。  
  
在典型的企业部署中，n8n 实例往往以服务账户或系统账户权限运行。一旦攻击者完成 RCE，其获得的不是普通用户权限，而是能够访问环境变量、配置文件乃至底层系统的更高权限级别。这使得后续的横向移动和数据窃取成本几乎为零。  
  
## 威胁态势评估  
### 平台普及度推高实际风险  
  
n8n 的设计哲学强调灵活性和易用性。用户无需深厚的编程背景，即可通过可视化界面将 API、云服务、数据库等组件串联成自动化工作流程。这一定位直接导致了两个后果：  
1. **用户群体庞大且分散**  
：开发团队、运维团队乃至业务团队都可能独立部署 n8n 实例，导致资产管理出现盲区。  
1. **连接范围广泛**  
：n8n 通常持有大量第三方服务的 API 密钥、数据库访问凭据和环境配置信息，一旦被攻陷，攻击者获取的不只是一个平台，而是整个集成链条的访问权。  
从奇安信全球威胁视野来看，这类处于供应链"中间位置"的自动化平台，正在成为高级威胁行为体优先关注的目标——控制一个枢纽节点的价值，远高于攻陷单个终端。  
### 利用门槛与攻击烈度的错配  
  
当前披露信息显示，这些漏洞需要"低权限认证"作为前置条件。但奇安信安全研究团队提醒，这一限制条件在实际企业环境中并不构成有效防护：  
- 在许多组织中，"创建工作流程"的权限已广泛授予开发者和部分业务人员  
- n8n 的多用户协作特性意味着同一实例上往往存在多个具备编辑权限的账户  
- 即使是内部用户，其账户被攻陷（如钓鱼攻击、凭据复用）的概率并不低  
综合评估，**实际可利用的攻击面远超实验室环境下的理想化评估**  
。  
### 公开 Exploit 预期  
  
安全社区通常遵循"漏洞披露→研究验证→PoC 公开"的演进路径。鉴于这三个漏洞的利用复杂度相对可控（无需复杂的漏洞利用链），且 CVSS 评分一致处于高危区间，奇安信威胁情报中心研判，公开的漏洞利用代码（PoC/EXP）预计将在短期内出现。一旦公开代码可用，结合 n8n 在全球范围内的广泛部署，规模化攻击窗口将迅速打开。  
  
## MITRE ATT&CK 技战术映射  
<table><thead><tr style="overflow-wrap: break-word;"><th data-colwidth="90" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术 ID</span></section></th><th data-colwidth="136" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术名称</span></section></th><th data-colwidth="125" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">攻击阶段</span></section></th><th data-colwidth="209" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">本事件关联</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;"><td data-colwidth="90" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1203</span></section></td><td data-colwidth="136" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">通过软件漏洞利用执行代码</span></section></td><td data-colwidth="125" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">初始访问/执行</span></section></td><td data-colwidth="209" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-44789 原型污染触发 RCE</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="90" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1059</span></section></td><td data-colwidth="136" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">命令与脚本解释器</span></section></td><td data-colwidth="125" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">执行</span></section></td><td data-colwidth="209" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-44790 命令行注入后执行任意命令</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="90" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1552</span></section></td><td data-colwidth="136" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">未安全存储的凭据</span></section></td><td data-colwidth="125" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">凭据访问</span></section></td><td data-colwidth="209" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">通过文件读取获取配置文件中的密钥</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="90" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1027</span></section></td><td data-colwidth="136" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">混淆文件或信息</span></section></td><td data-colwidth="125" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">防御规避</span></section></td><td data-colwidth="209" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">原型污染技术本身具有混淆效果</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="90" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1570</span></section></td><td data-colwidth="136" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">横向工具传输</span></section></td><td data-colwidth="125" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">横向移动</span></section></td><td data-colwidth="209" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">获取凭据后在其他系统展开行动</span></section></td></tr></tbody></table>##   
## 缓解建议  
### 紧急措施（24-72 小时内）  
1. **立即升级**  
：将所有 n8n 实例升级至 1.123.43、2.20.7、2.22.1 或更高版本。这是消除风险的最直接手段。  
1. **临时缓解**  
：如无法立即升级，可通过设置环境变量 N8N_NODES_EXCLUDE  
 禁用 HTTP Request、Git 和 XML 节点，同时严格限制工作流程的创建和编辑权限仅授予最小必要人员。  
1. **权限审查**  
：审计所有拥有工作流程编辑权限的账户，撤销非必要权限，启用多因素认证（MFA）。  
### 中期加固（1-2 周内）  
- 在 n8n 实例前部署 Web 应用防火墙（WAF），对工作流程配置接口的异常请求进行检测和阻断  
- 建立 n8n 版本管理机制，确保所有节点版本始终处于官方支持的最新稳定分支  
- 对 n8n 实例的网络访问进行精细化控制，限制其仅能访问必要的下游服务  
### 长期安全建设  
- 将 n8n 实例纳入配置管理（CMDB）系统，确保所有部署实例无遗漏  
- 在 CI/CD 流程中集成安全扫描环节，对自动化工作流程的配置进行合规性检查  
- 建立威胁情报订阅机制，第一时间获取相关漏洞的公开利用情报  
  
##   
## 奇安信威胁情报说明  
  
奇安信威胁情报中心持续监控全球范围内的漏洞披露和威胁活动。本次 n8n 漏洞事件中涉及的三个 CVE 均已纳入奇安信威胁情报库，具备以下检测能力：  
- 相关漏洞的规则匹配和告警  
- 原型污染技术的特征检测  
- 命令行注入行为的日志分析规则  
当前未发现针对该漏洞的已知 APT 组织归因信息，但基于漏洞利用的便利性和平台战略价值，高级别威胁行为体（APT）可能在未来将其纳入攻击工具库。建议安全团队保持关注。  
  
## IOC 与关联指标  
  
本次披露的漏洞为设计缺陷类漏洞，未涉及传统意义上的失陷指标（IOC），如恶意文件哈希、恶意域名等。核心关注点应聚焦于受影响的版本范围和漏洞类型，而非文件级指标。  
<table><thead><tr style="overflow-wrap: break-word;"><th data-colwidth="161" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">实体/指标</span></section></th><th data-colwidth="111" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">类型</span></section></th><th data-colwidth="279" align="left" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">说明</span></section></th></tr></thead><tbody><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-44789</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">HTTP Request 节点原型污染，RCE</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-44790</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Git 节点命令行注入，任意文件读取</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-44791</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">XML 节点补丁绕过，原型污染延续</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">n8n &lt; 1.123.43</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">版本范围</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">主线版本受影响</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">n8n &lt; 2.20.7</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">版本范围</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">2.x 分支受影响</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">n8n &lt; 2.22.1</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">版本范围</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">2.x 分支受影响</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1203</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">ATT&amp;CK</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用软件漏洞执行代码</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1059</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">ATT&amp;CK</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">命令与脚本解释器</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE-1321</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">原型污染</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE-88</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">命令行参数注入</span></section></td></tr><tr style="overflow-wrap: break-word;"><td data-colwidth="161" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Jubke</span></section></td><td data-colwidth="111" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">研究人员</span></section></td><td data-colwidth="279" style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">漏洞发现者</span></section></td></tr></tbody></table>##   
## 参考来源  
- https://github.com/n8n-io/n8n/security/advisories/GHSA-wrwr-h859-xh2r  
- https://github.com/n8n-io/n8n/security/advisories/GHSA-57g9-58c2-xjg3  
- https://github.com/n8n-io/n8n/security/advisories/GHSA-c8xv-5998-g76h  
- https://1275.ru/vulnerability/kriticheskie-uyazvimosti-v-platforme-avtomatizatsii-n8n-pozvolyayut-udalenno-vypolnyat-kod-cherez-tsepochku-atak_25976  
- https://www.cybersecuritynews.com/n8n-vulnerabilities-rce  
- https://www.thedailytechfeed.com/n8n-critical-vulnerability-rce  
- https://www.cyberwebspider.com/n8n-security-vulnerabilities  
