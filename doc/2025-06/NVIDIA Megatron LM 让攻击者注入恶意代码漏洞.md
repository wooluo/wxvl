#  NVIDIA Megatron LM 让攻击者注入恶意代码漏洞  
 网安百色   2025-06-26 11:41  
  
NVIDIA Megatron LM 大型语言模型框架中存在严重安全漏洞，可能允许攻击者注入恶意代码并获得未经授权的系统访问权限。  
  
该公司于 2025 年 6 月 24 日发布了紧急安全补丁，解决了两个严重性漏洞，这些漏洞会影响 0.12.0 版本之前流行的 AI 训练平台的所有版本。  
```
Summary1. Two high-severity code injection flaws (CVE-2025-23264, CVE-2025-23265) with CVSS 7.8 scores affect all Megatron LM versions before 0.12.0.2. Exploitation enables code execution, privilege escalation, data access, and AI model tampering through malicious file injection.3. Local system access with low privileges needed to exploit vulnerabilities via specially crafted files.4. Immediate upgrade to Megatron LM version 0.12.1+ from NVIDIA's GitHub repository.
```  
## 代码注入漏洞概述  
  
在 NVIDIA 的 Megatron LM 框架中发现了两个重大安全漏洞，分别是 CVE-2025-23264 和 CVE-2025-23265。  
  
这两个漏洞都源于框架内 Python 组件中的代码注入弱点，在常见弱点枚举系统中被归类为 CWE-94（代码注入）。  
  
这些漏洞的 CVSS v3.1 基本评分为 7.8，将其标记为高严重性威胁。  
  
安全研究人员 Yu Rong 和 Hao Fan 发现了这些严重缺陷，并将其报告给了 NVIDIA 的产品安全事件响应团队 （PSIRT）。  
  
这些漏洞对利用 NVIDIA 框架进行大规模语言模型训练和推理的组织构成了重大风险。  
  
通过恶意文件注入执行代码的可能性可能会危及整个 AI 基础设施部署。  
  
这两个漏洞的攻击媒介都遵循模式 AV：L/AC：L/PR：L/UI：N/S：U/C：H/I：H/A：H，表示本地访问要求，攻击复杂度低，所需权限低。  
  
攻击者可以通过向 Megatron LM 系统提供特制的恶意文件来利用这些漏洞。  
  
成功利用后，攻击者可以造成多种严重影响，包括代码执行、权限提升、信息泄露和数据篡改。  
  
<table><tbody><tr style="box-sizing: border-box;background-color: rgb(240, 240, 240);"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><strong msttexthash="7544134" msthash="72" style="box-sizing: border-box;font-weight: bold;"><span leaf="">CVE 证书</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><strong msttexthash="17242355" msthash="73" style="box-sizing: border-box;font-weight: bold;"><span leaf="">受影响的产品</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><strong msttexthash="4085822" msthash="74" style="box-sizing: border-box;font-weight: bold;"><span leaf="">冲击</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><strong msttexthash="17124536" msthash="75" style="box-sizing: border-box;font-weight: bold;"><span leaf="">利用先决条件</span></strong></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><strong msttexthash="8943688" msthash="76" style="box-sizing: border-box;font-weight: bold;"><span leaf="">CVSS 3.1 分数</span></strong></td></tr><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><section><span leaf="">CVE-2025-23264、CVE-2025-23265</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><section><span leaf="">NVIDIA Megatron-LM（所有平台）</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><section><span leaf="">代码执行、权限提升、信息泄露、数据篡改</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><section><span leaf="">本地访问，攻击复杂度低，需要的权限低，无需用户交互</span></section></td><td style="box-sizing: border-box;padding: 2px 8px;border: 1px solid rgba(0, 0, 0, 0);word-break: break-word;"><font mstmutation="1" msttexthash="24357385" msthash="81" style="box-sizing: border-box;"><span leaf="">7.8 （高）</span></font><section><span leaf=""><br/></span></section></td></tr></tbody></table>## 缓解措施  
  
NVIDIA 强烈建议所有 Megatron LM 用户立即更新到 0.12.1 或更高版本，可通过官方 GitHub 存储库获取。  
  
由于这些漏洞的严重性很高，组织应优先考虑此更新。  
  
此安全更新同时解决了 CVE-2025-23264 和 CVE-2025-23265。运行早期软件分支版本的用户应升级到最新的分支版本，以确保获得全面保护。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
