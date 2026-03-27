#  OpenAI重金悬赏AI滥用漏洞，50%复现即算有效  
 FreeBuf   2026-03-27 10:11  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2iaavZWpUDSndPwjn0Fsus834wC1zbp9BJeMSia1OaZtzIEqXswZeeoNAXF9qn50oWbqq3sAZrAwxjRrGyj9dKmt0waFaJchD0I/640?wx_fmt=png&from=appmsg "")  
##   
  
OpenAI宣布启动一项公共安全漏洞赏金计划（Safety Bug Bounty），旨在识别其产品中存在的AI滥用行为和安全风险。该计划托管于Bugcrowd平台，标志着该公司在应对传统安全漏洞范畴之外、但仍具有现实危害潜力的风险方面迈出重要一步。  
  
  
这项安全漏洞赏金计划旨在对OpenAI现有的安全漏洞赏金计划（Security Bug Bounty）形成补充，接收那些虽不符合传统安全漏洞定义、但存在重大滥用和安全风险的漏洞报告。所有提交将由OpenAI的安全与安全漏洞赏金团队共同评估，并根据范围和所有权在两个计划间进行流转。  
##   
  
**Part01**  
## 重点关注的AI特有风险类别  
  
  
该计划针对以下几类AI特有的安全场景：  
  
  
包含MCP的Agentic风险  
——涵盖第三方提示注入和数据外泄场景，即攻击者控制的文本能够可靠劫持受害者的AI Agent（包括浏览器、ChatGPT Agent等类似产品）执行有害操作或泄露敏感用户数据。要符合条件，该行为必须至少50%的情况下可复现。涉及Agentic产品大规模执行禁止或潜在有害行为的报告也属于该范畴。  
  
  
OpenAI专有信息  
——研究人员可报告模型生成内容中无意暴露的推理相关专有信息，以及泄露其他OpenAI机密数据的漏洞。  
  
  
账户与平台完整性  
——该类别针对账户和平台完整性信号中的弱点，包括绕过反自动化控制、操纵账户信任信号以及规避账户限制、暂停或封禁等行为。  
  
  
OpenAI明确界定了不在范围内的内容：导致粗俗语言或公开可用信息的一般性越狱行为将不予考虑。没有明显安全或滥用影响的通用内容策略绕过行为也被排除在外。不过，OpenAI会定期针对特定危害类型开展私密漏洞赏金活动（例如ChatGPT Agent和GPT-5中的生物风险内容问题），并在这些计划开放时邀请研究人员申请。  
  
  
对于能够实现未经授权访问功能、数据或超出许可权限的漏洞，研究人员应提交至现有的安全漏洞赏金计划。  
  
  
该计划的推出表明业界日益认识到，AI系统带来了全新的攻击面，这是传统安全框架无法应对的。通过激励以安全为重点的研究与传统漏洞披露并行，OpenAI正在有效建立一个针对AI特有威胁的结构化建模框架。  
  
  
有意参与的研究人员可直接通过OpenAI在Bugcrowd平台上的安全漏洞赏金页面进行申请。  
  
  
**参考来源：**  
  
OpenAI Launches AI Safety Bug Bounty to Detect AI-Specific Vulnerabilities  
  
https://cybersecuritynews.com/openai-safety-bug-bounty/  
  
  
###   
###   
###   
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651335912&idx=1&sn=f7c9c36f910a122eb9bb727adcf9e89d&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
