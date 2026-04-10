#  黑客利用Flowise关键漏洞攻击数千个AI工作流  
 黑白之道   2026-04-10 00:24  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
## 漏洞概述：自定义MCP节点设计缺陷导致任意代码执行  
  
网络安全研究人员发现，威胁攻击者已找到向Flowise低代码平台注入任意JavaScript的方法。该平台主要用于构建定制化大语言模型（LLM）和Agent系统。  
  
![系统警告标志显示在智能手机上，防火墙遭受病毒攻击的网络安全隐患示意图](https://mmbiz.qpic.cn/sz_mmbiz_jpg/nGzNudUIJ6NQCqFibibFTX7DDCTdSzibfWeickNnaIe73KWe9N9cMjgMXlW4UxaPzfSMWDHLlk12EnrHru7icbxBWWvGqRwhpiaPUSibFtJDicl1VHk/640?wx_fmt=jpeg&from=appmsg "")  
  
这一代码注入漏洞源于平台自定义MCP节点的设计缺陷（被评为最高严重级别），该节点作为插件连接器，使应用的AI Agent能够通过MCP服务器与外部工具通信。根据VulnCheck最新警报，黑客已开始利用该漏洞插入恶意JavaScript代码，分析显示近15000个Flowise实例暴露在公共互联网上。该漏洞已在AI开发平台3.0.6版本中修复，最新发布的3.1.1版本于上月推出。  
## 技术细节：MCP配置验证缺失  
  
Flowise是一项通过拖拽方式构建定制化大语言模型（LLM）流程的服务。用户可将自定义MCP节点拖入工作流，并粘贴必要配置（JSON）以指向外部MCP服务器。  
  
问题出在允许应用使用用户提供配置连接任何外部MCP服务器的自定义MCP节点上。在3.0.5版本中，这些配置未对恶意代码进行适当验证，导致远程代码执行。美国国家漏洞数据库（NVD）描述称："该节点解析用户提供的mcpServerConfig字符串以构建MCP服务器配置，但在此过程中会执行未经安全验证的JavaScript代码。具体而言，在convertToValidJSONString函数内部，用户输入直接传递给Function()构造函数，该构造函数将输入作为JavaScript代码进行评估和执行。"由于该函数以完整Node.js运行时权限运行，"可访问child_process和fs等危险模块"。  
  
该漏洞被追踪为（CVE-2025-59528），在2025年9月披露时被评定为CVSS 10.0的严重等级，归类为"代码生成控制不当（代码注入）"漏洞。  
## 攻击现状：黑客瞄准未修复实例  
  
尽管补丁已发布数月，但VulnCheck最新发现首次野外利用发生在4月6日。漏洞情报公司安全研究副总裁Caitlin Condon通过LinkedIn发文警告该漏洞正遭滥用。她写道："今天凌晨，VulnCheck的Canary网络开始检测到首次利用（CVE-2025-59528）的攻击活动，这是Flowise中的任意JavaScript代码注入漏洞。目前观察到的活动源自单个Starlink IP。"她在帖子中指出，约12000至15000个实例仍处于暴露状态，但尚不清楚其中有多少运行着存在漏洞的Flowise版本。  
  
Condon在帖子中还提到另外两个关键Flowise漏洞：身份验证缺失（CVE-2025-8943）和任意文件上传（CVE-2025-26319），表示Canary网络也监测到针对这些漏洞的活跃利用。完整攻击细节（包括完整载荷和请求数据）将提供给Canary Intelligence客户。此外，漏洞利用代码、PCAP文件、YARA规则、网络特征和目标Docker容器已向其Initial Access Intelligence客户开放。  
  
**参考来源：**  
> Hackers exploit a critical Flowise flaw affecting thousands of AI workflows  
  
  
  
> **文章来源：freebuf**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
