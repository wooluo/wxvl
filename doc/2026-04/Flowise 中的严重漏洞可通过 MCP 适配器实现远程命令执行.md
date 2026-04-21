#  Flowise 中的严重漏洞可通过 MCP 适配器实现远程命令执行  
会杀毒的单反狗
                    会杀毒的单反狗  爱拍照的老李   2026-04-21 01:10  
  
**导****读**  
  
  
  
OX Security发现Flowise和多个AI框架中存在一个关键漏洞，使数百万用户面临远程代码执行（RCE）的风险。该漏洞源于Model Context Protocol（MCP），这是由Anthropic开发的用于AI代理的广泛使用的通信标准。  
  
  
与典型的软件漏洞不同，该漏洞源自Anthropic官方MCP SDK中嵌入的架构设计决策，涵盖Python、TypeScript、Java和Rust。  
  
![FlowiseAI - Build LLM Apps Easily - Minilab](https://mmbiz.qpic.cn/mmbiz_png/PaFY6wibdwyIsgicphOPMSaKOnLQic6dLPWkDo2wW9Z1xlECSeNJbSLG62mUMUyQK5DQX84ZGvQSVdCxl2rpjq98vpXpF5XlVNQNlVZtmArOR8/640?wx_fmt=png&from=appmsg "")  
  
  
任何基于MCP基础开发的开发者都会无意中继承这种风险，这意味着攻击面不仅限于单一平台，而是在整个AI供应链中产生连锁反应。  
  
  
MCP核心的架构缺陷  
  
  
该漏洞使攻击者能够在易受攻击的系统上执行任意命令，直接访问敏感用户数据、内部数据库、API密钥和聊天记录。  
  
  
OX Security在研究期间成功在六个生产平台上执行了实时指令。Flowise，一个受欢迎的开源AI工作流程构建器，是受影响最严重的平台之一。  
  
  
研究人员发现了针对Flowise的“加固绕过”攻击途径，表明即使是配置了额外保护的环境，仍可通过MCP适配器接口被利用。  
  
  
更广泛的影响范围令人震惊：  
超过1.5亿次下载，超过7000台公开访问服务器，以及估计20万个易受攻击实例。  
  
  
迄今至少发布了十条CVE，涵盖了包括LiteLLM、LangChain、GPT Researcher、Windsurf、DocsGPT和IBM的LangFlow等平台的关键漏洞。  
  
  
OX Security 多次向 Anthropic 推荐根级补丁，以保护数百万下游用户。Anthropic拒绝了，称这种风险符合预期。当安全研究人员打算发表研究结果时，Anthropic并未提出异议。  
  
  
研究人员建议立即采取行动：  
- 阻止与敏感API或数据库相连的AI服务在公共互联网中暴露。  
- 将所有外部MCP配置输入视为不可信，限制用户输入无法到达StdioServerParameters。  
- 只需从官方GitHub MCP注册表等经过验证的来源安装MCP服务器。  
- 在沙箱环境中以最小权限运行支持MCP的服务。  
- 监控AI代理工具的调用，以防意外的外呼活动。  
- 立即将所有受影响的服务更新为最新补丁版本。  
新闻链接：  
  
https://cybersecuritynews.com/flowise-vulnerability/  
  
****  
扫码关注  
  
军哥网络安全读报  
  
**讲述普通人能听懂的安全故事**  
  
  
