#  微软Defender零日漏洞深度分析：从BlueHammer到RedSun，安全工具的攻防博弈  
原创 威胁情报中心
                    威胁情报中心  奇安信威胁情报中心   2026-04-20 06:31  
  
## 事件概述  
  
2026年4月，微软在Patch Tuesday例行更新中修复了Microsoft Defender反恶意软件平台中的一个高危零日漏洞（**CVE-2026-33825**  
，又称BlueHammer）。该漏洞源于平台内访问控制粒度不足（**CWE-1220**  
），允许具备基本本地访问权限的攻击者将权限提升至最高SYSTEM级别。  
  
值得高度关注的是，该漏洞的技术细节在微软官方修复发布前即被公开披露，攻击者可能已掌握漏洞利用代码。更为严峻的是，安全研究员Chaotic Eclipse于4月16日公开了针对同一安全平台的另一未修补漏洞**RedSun**  
，该漏洞利用Defender对云标签文件的处理逻辑缺陷，将防御工具本身转化为攻击链的一环。这两起连续披露事件反映出安全研究社区与厂商之间的信任危机，同时也预示着针对终端安全基础设施的攻击技术正在向更高阶的形态演进。  
  
## 漏洞技术分析  
### BlueHammer漏洞（CVE-2026-33825）  
  
**CVE-2026-33825**  
 是Microsoft Defender反恶意软件平台中的一个本地权限提升漏洞。攻击者利用平台内部访问控制机制的粒度不足，通过用户态二进制文件（MsMpEng.exe）与内核态驱动之间的权限边界混淆，实现从低权限用户到SYSTEM级别权限的跨越。  
  
根据微软CVSS 3.1评分体系，该漏洞获得**7.8分**  
（高危），攻击特征如下：  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">评估维度</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">配置值</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">风险解读</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">攻击向量</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Local（本地）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">攻击者需已获得目标系统 foothold</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">攻击复杂度</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Low（低）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">漏洞利用路径明确，稳定性高</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限要求</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Low（低）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">标准用户账户即可触发</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">用户交互</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">None（无需）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">漏洞利用可静默执行</span></section></td></tr></tbody></table>  
该漏洞的技术根因指向**CWE-1220**  
（访问控制粒度不足），这意味着平台在设计层面对权限边界的控制存在结构性缺陷，而非单一的实现错误。从攻击链视角分析，此类漏洞通常作为APT攻击的**权限提升（Privilege Escalation）**  
环节使用，位于初始入侵之后、横向移动之前。  
  
### RedSun漏洞：安全工具的双重属性滥用  
  
RedSun漏洞代表了更高级的攻击思路：不再寻找传统意义上的代码执行缺陷，而是滥用安全产品的**正常功能逻辑**  
，将其转化为攻击向量。  
  
该漏洞的利用原理如下：当带有"云标签"（Cloud Tags）标记的文件被Defender检测并隔离后，平台可能触发文件"恢复"机制，将文件写回原始路径。攻击者正是利用这一合法行为的时序竞争条件，通过以下步骤实现权限提升：  
1. **诱饵构造：创建携带特定云标签的恶意文件（如伪装为EICAR测试字符串的可执行文件）**  
1. **虚假同步根注册：利用Cloud Files API注册虚假的同步根目录，使恶意文件获得云管理特征**  
1. **竞争条件触发：通过oplock机制协调文件系统操作时序，诱导Defender执行异常恢复行为**  
1. **路径重定向：利用重解析点（Reparse Point）将文件操作重定向至System32等特权目录**  
1. **权限获取：最终实现将恶意可执行文件写入高权限位置，以SYSTEM上下文执行**  
这种攻击方式的高明之处在于：它组合了多个合法的Windows子系统（NT文件操作、卷影复制服务、Cloud Files API、oplock机制、重解析点），单一行为均难以被判定为恶意，但串联使用即可形成完整的攻击链。  
  
## 威胁行为体归因分析  
### 漏洞发现者追踪  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">研究者</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">身份特征</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">关联动作</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Zen Dodd</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">独立安全研究员</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">联合报告BlueHammer漏洞</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Yuanpei XU</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">独立安全研究员</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">联合报告BlueHammer漏洞</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Chaotic Eclipse（Nightmare-Eclipse）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">独立安全研究员</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">公开RedSun漏洞及完整PoC</span></section></td></tr></tbody></table>  
Chaotic Eclipse的研究者身份值得特别关注。根据开源情报分析，该研究者长期关注微软安全产品的漏洞挖掘，其公开RedSun漏洞的动机被普遍解读为**对BlueHammer补丁处理方式的不满**  
——BlueHammer漏洞细节在微软修复前被公开披露，这可能导致了厂商与研究者之间的信任破裂。  
### APT组织利用可能性评估  
  
从威胁行为体归因视角分析，CVE-2026-33825类漏洞对高级持续性威胁（APT）组织具有显著战略价值：  
  
**利用价值评估**  
：  
- 微软Defender作为Windows内置安全组件，部署量覆盖全球数亿终端  
  
- 漏洞利用门槛低（本地访问即可，无需用户交互）  
  
- 获取SYSTEM权限后可建立持久化据点，完全接管目标主机  
  
- 可与供应链攻击、初始访问向量形成高效攻击链  
  
**APT组织潜在利用路径**  
：在APT攻击杀伤链模型中，该漏洞位于**权限提升**  
和**持久化**  
环节。攻击者通常通过鱼叉式钓鱼（Spear Phishing）或供应链攻陷（Supply Chain Compromise）获取初始低权限访问，随后利用此类漏洞提升至SYSTEM权限，为后续的横向移动和数据外泄奠定基础。  
  
**关联威胁活动预警**  
：考虑到BlueHammer利用代码已公开、RedSun PoC已发布，**高能力威胁行为体**  
（包括APT组织）在未来30天内将该漏洞集成至攻击工具库的概率为**高**  
。  
  
## 战术技术演变分析（MITRE ATT&CK框架映射）  
  
本章节将BlueHammer和RedSun漏洞的攻击战术映射至MITRE ATT&CK v14框架，为安全团队的检测与响应提供技术参照。  
### BlueHammer攻击链ATT&CK映射  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">攻击阶段</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">ATT&amp;CK战术</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术ID</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术描述</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">初始访问</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">通过漏洞组合实现</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1078.004</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用合法凭证或低权限账户</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用漏洞提权</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><strong style="overflow-wrap: break-word;font-weight: bold;font-size: inherit;"><span leaf="">T1068</span></strong></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用软件漏洞获取更高权限</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">滥用权限控制机制</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><strong style="overflow-wrap: break-word;font-weight: bold;font-size: inherit;"><span leaf="">T1548</span></strong></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">绕过访问控制限制</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">持久化</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">创建账户</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1136.001</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">创建本地管理员账户</span></section></td></tr></tbody></table>### RedSun攻击链ATT&CK映射  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">攻击阶段</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">ATT&amp;CK战术</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术ID</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术描述</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用云标签处理缺陷</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1068</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用文件系统交互逻辑缺陷</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用竞争条件</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1499.004</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">滥用系统功能的时序特性</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">持久化</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">写入特权位置</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1544</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">替换受保护的系统文件</span></section></td></tr></tbody></table>### 关键检测点  
  
针对RedSun攻击链，防御者应重点监控以下异常行为组合：  
- **Cloud Files API异常调用：非同步提供者角色却调用Cloud Files API**  
  
- **卷影复制设备枚举：用户态代码对\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy 等路径的访问**  
  
- **临时目录重解析点创建：在用户临时目录创建重解析点后尝试替换系统文件**  
  
- **文件恢复行为异常：Defender执行非预期的文件恢复操作**  
  
****## 国内影响评估  
### 暴露面分析  
  
微软Defender作为Windows 10/11操作系统的内置安全组件，其默认启用特性使其成为国内数量最庞大的终端安全基础设施之一。  
  
**高风险场景识别**  
：  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">场景</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">风险等级</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">说明</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">企业内网终端</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">攻击者可通过横向移动抵达高价值资产</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">开发测试环境</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">高</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">代码签名环境被攻陷可导致供应链风险</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">运维跳板机</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">极高</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">SYSTEM权限可完全控制运维通道</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">域控制器所在终端</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">极高</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">可用于Active Directory提权攻击</span></section></td></tr></tbody></table>### 漏洞利用窗口评估  
  
BlueHammer漏洞的公开披露时间为2026年4月7日（早于官方修复），微软官方修复发布于4月14日。从4月7日至4月14日的**7天零日窗口期**  
内，漏洞利用代码可能已被恶意行为体获取并部署。  
  
当前漏洞利用代码已进入地下黑市流通渠道。从漏洞公开到野外部署的典型时间窗口通常为**2-4周**  
，但考虑到该漏洞的低复杂度特性，实际利用可能更快出现。  
### 国内企业应对建议  
  
针对该漏洞对国内政企环境的影响，奇安信威胁情报中心建议采取以下分级响应措施：  
  
**紧急响应（72小时内）**  
：  
- 验证所有Windows终端的Defender平台版本是否升级至**4.18.26030.3011**  
或更高  
  
- 优先处置面向互联网的高暴露面服务器和研发环境终端  
  
- 启用端点检测与响应（EDR）系统对本地提权行为进行深度监控  
  
**中期加固（1-2周）**  
：  
- 部署应用白名单（AppLocker/WDAC）策略，限制非授权可执行文件在特权目录的执行  
  
- 强化Active Directory域环境安全，监控异常的管理员账户创建行为  
  
- 开展内部红蓝对抗演练，验证现有防护体系对该攻击链的检测能力  
  
## 漏洞修复与防护建议  
### 版本核查  
  
微软已发布修复版本，建议立即执行以下核查步骤：  
- 打开Windows安全中心应用（Windows Security）  
  
- 导航至**病毒和威胁防护**  
 → **管理设置**  
  
- 点击**保护更新**  
 → **检查更新**  
  
- 进入**设置**  
 → **关于**  
，  
查看**反恶意软件客户端版本**  
  
- 确认版本号 ≥ **4.18.26030.3011**  
  
### 漏洞影响范围  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">软件/平台</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">受影响版本</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">已修复版本</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Microsoft Defender Antimalware Platform</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">≤ 4.18.26020.6</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">≥ 4.18.26030.3011</span></section></td></tr></tbody></table>  
**特殊说明**  
：即使Windows Defender被禁用，受影响的二进制文件仍存留于系统。微软澄清，禁用状态下的系统**不处于可利用状态**  
，但仍建议更新至安全版本。  
### 企业级防护建议  
1. **补丁管理：确保企业补丁分发系统（WSUS/SCCM/Intune）已同步最新Defender平台更新**  
  
1. **最小权限原则：限制本地管理员权限范围，减少攻击面**  
  
1. **行为监控：部署EDR解决方案，监控MsMpEng.exe进程的异常子进程创建和文件写入行为**  
  
1. **网络分段：对高价值资产实施严格的网络隔离，限制横向移动路径**  
  
1. **日志分析：集中收集Windows安全日志，关联分析权限提升特征**  
  
****## 总结  
  
BlueHammer（CVE-2026-33825）和RedSun漏洞的连续披露，揭示了终端安全领域的深层次问题：即便是微软这样的顶级厂商，其核心安全产品同样存在可被利用的漏洞。更值得关注的是RedSun漏洞展现的**安全工具滥用**  
（Attack of the Transformers）这一新兴攻击范式——攻击者不再寻找传统代码缺陷，而是挖掘产品正常功能的误用路径。  
  
从威胁情报角度评估，该漏洞对APT组织的利用价值极高，其公开披露显著降低了攻击门槛。考虑到Windows Defender的全球部署规模，奇安信威胁情报中心将该漏洞的**全球威胁等级评定为"高"**  
。  
  
奇安信安全产品矩阵已支持对该攻击链的检测：  
- **奇安信天眼新一代威胁感知系统：可检测RedSun攻击链的多个检测点******  
  
- **奇安信椒图（HIDS）：监控关键系统目录的异常写入行为******  
  
- **奇安信终端安管理系统（EDR）：提供进程行为链分析，识别权限提升攻击**  
  
- ****  
## IOC指标  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">类型</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">指标</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">说明</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-33825</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">Microsoft Defender权限提升漏洞</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CWE-1220</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">访问控制粒度不足（漏洞根因）</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">漏洞代号</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">BlueHammer</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">CVE-2026-33825的非官方命名</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">漏洞代号</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">RedSun</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">针对Defender云标签处理的独立漏洞</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">软件版本</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">≤ 4.18.26020.6</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">受影响Defender平台版本</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">修复版本</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">≥ 4.18.26030.3011</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">安全版本</span></section></td></tr></tbody></table>##   
## MITRE ATT&CK技术编号参考  
<table><tbody><tr style="overflow-wrap: break-word;"><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术ID</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">战术</span></section></th><th style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;background: rgba(0, 0, 0, 0.05);max-width: 100%;"><section><span leaf="">技术名称</span></section></th></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1068</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升（Privilege Escalation）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">利用软件漏洞提权</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1548</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">权限提升（Privilege Escalation）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">滥用权限控制机制</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1136.001</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">持久化（Persistence）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">本地账户创建</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1544</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">持久化（Persistence）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">远程文件替代</span></section></td></tr><tr style="overflow-wrap: break-word;"><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">T1499.004</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">影响（Impact）</span></section></td><td style="overflow-wrap: break-word;border: 1px solid rgb(223, 223, 223);padding: 0.25em 0.5em;color: rgb(43, 48, 59);word-break: break-all;max-width: 100%;"><section><span leaf="">竞争条件滥用</span></section></td></tr></tbody></table>##   
## 参考来源  
  
[1].https://cybersecuritynews.com/microsoft-defender-0-day-vulnerability/  
  
[2].https://www.redpacketsecurity.com/redsun-a-windows-privilege-escalation-poc-that-turns-defender-into-part-of-the-attack-chain/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/odcL3w4qOqic48JFFjrH9MOxPpXgAt8e5R7Yb8Yy2KdwYWoBia7xqujfx44V136icqR1AGFBxP0ShddSSQPJfnT9FufSNSgcDsONoDeC4RqkH4/640?wx_fmt=gif&from=appmsg "")  
  
点击  
阅读原文  
至**ALPHA 9.1**  
  
即刻助力威胁研判  
  
