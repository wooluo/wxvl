#  新型AI漏洞“Shadow Escape”曝光：零点击窃取企业核心数据  
原创 甲子元
                    甲子元  安全代码   2026-03-23 23:28  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/2CXZ5ByPoJbDDS7UPQZBHRwiafAVwzmgEIibFC57lhUL1e1ibPpgfiatKxDpyJWVU7dicgMF5evK18fZuXp5qgsxvrg/640?wx_fmt=gif&from=appmsg "")  
  
近日，安全研究公司Operant AI发布报告，揭露了一种名为“Shadow Escape”（影之逃逸）的新型安全漏洞。该漏洞利用主流AI助手的底层协议，可在用户无需任何操作的情况下，从企业内部系统窃取海量敏感数据，包括社会安全号码、医疗记录和财务信息等，引发行业高度关注。  
  
**漏洞原理：恶意指令藏身普通文档，劫持AI助手**  
  
“Shadow Escape”攻击的核心在于模型上下文协议（MCP）——企业通过该协议将ChatGPT、Claude、Gemini等大型语言模型连接到内部数据库和工具。攻击者将恶意指令隐藏在看似无害的文档中，如员工入职手册或从互联网下载的PDF。当员工为工作便利上传文件时，隐藏指令便会指示AI秘密收集并发送私人客户数据。  
  
**零点击特性：无需用户交互，传统防护失效**  
  
与传统钓鱼攻击需要诱骗用户点击不同，该漏洞属于“零点击”攻击。数据窃取发生在企业安全网络和防火墙内部，AI助手对数据拥有合法访问权限，其外发流量被伪装成常规性能跟踪，传统安全工具无法察觉。Operant AI估计，目前通过该漏洞泄露至暗网的私人记录规模可能已达数万亿条。  
  
**协议级风险：任何使用MCP的AI系统均受影响**  
  
Operant AI联合创始人Priyanka Tembey指出：“共同点并非特定AI代理，而是授予这些代理对组织系统前所未有访问权限的MCP协议。任何通过MCP连接数据库、文件系统或外部API的AI助手，都可能被‘Shadow Escape’攻击利用。”这意味着问题并非单一AI提供商独有，而是整个技术生态的系统性风险。  
  
**紧急呼吁：组织应立即审计AI系统**  
  
研究团队强烈敦促所有依赖AI代理的组织立即开展系统审计。正如报告所言：“下一次重大数据泄露可能并非来自黑客，而是来自受信任的AI助手。”在AI加速融入企业核心流程的今天，这一警告值得所有行业高度警惕。  
  
来源：安全客  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/2CXZ5ByPoJaCZo3iaHicUlpfsHplbY8pNptagz6URJ0c7y9okfK3SGguRFJ8E7PJtsLC9pUmoPbgRICzxzWjb3GA/640?wx_fmt=gif&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/GCSG9VLghhrNph1icHNJs6Luesa5vygQIL2E0bJFicfjicjZfcTdjEeQ3bxYAOd1yP3X4NauDHZQLLB8nrSggJ6aQ/640?wx_fmt=png "")  
  
**山西甲子元科技有限公司**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/w3Y1fbBttohia5eUkE5R0S8E5oOTOePy2ayE0lmzsUmWtZkLd7c1M40ujxAvia4mFYrDU4Bdzk7siawjRLvcDagJw/640?wx_fmt=jpeg "undefined")  
  
产品介绍：  
  
  
  
软件：防泄密、行为管理、行为审计、云文档安全管理、数据智能备份等安全管理系统。  
  
电话：0351-3366668  
  
  
