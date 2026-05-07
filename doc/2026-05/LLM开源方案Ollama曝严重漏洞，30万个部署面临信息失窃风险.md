#  LLM开源方案Ollama曝严重漏洞，30万个部署面临信息失窃风险  
 SecHub网络安全社区   2026-05-07 02:11  
  
****  
****  
****  
**点击蓝字 关注我们**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8icWLyUKibZZrPdaxnm18Zscp6Xcu0OiaMwuh8LP87lPQLxMwiceAsv3TurmE7zZOulOhMELnQ2OulwFIJkbmB3bRg/640?wx_fmt=png "")  
  
  
**免责声明**  
  
本文发布的工具和脚本，仅用作测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断。  
  
如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关内容。  
  
文中所涉及的技术、思路及工具等相关知识仅供安全为目的的学习使用，任何人不得将其应用于非法用途及盈利等目的，间接使用文章中的任何工具、思路及技术，我方对于由此引起的法律后果概不负责。  
## 🌟简介                            
  
  
      
  
    
    
Cyera 警告称，**约 30 万个 Ollama 部署因一个可远程利用、无需身份验证的严重漏洞，易面临敏感信息失窃风险。**  
  
   
  
Ollama 是一款用于在本地机器上运行大语言模型（LLMs）的开源解决方案，作为一种自托管的人工智能推理引擎，在各组织中广受欢迎。  
  
   
  
Cyera 表示，Ollama 中的一个堆越界读取问题，可被利用来访问存储在堆中的敏感信息，包括提示词、消息以及环境变量，如 API 密钥、令牌和机密信息等。  
  
   
  
该漏洞编号为 CVE - 2026 - 7482（严重程度评分 CVSS 为 9.3），被称为“失血羊驼”，  
该漏洞影响 GGUF 模型加载器，该加载器接受攻击者提供的包含声明的张量偏移量和大于文件长度的 GGUF 文件。  
  
   
  
在处理该文件时，传感器会读取超出已分配堆缓冲区的内容，从而访问可能包含敏感信息的内存。  
  
   
  
Cyera 称：**“攻击者随后利用 Ollama 内置的模型推送功能，将包含窃取的堆数据的文件泄露到攻击者控制的服务器。整个攻击仅需三次无需身份验证的 API 调用。”**  
  
   
  
这家网络安全公司解释说，Ollama 默认启动时无需身份验证，且会监听所有网络接口，这意味着所有可通过互联网访问的实例都易受攻击。  
  
   
  
Cyera 警告：“目前约有 30 万个 Ollama 服务器暴露在公共互联网上，此漏洞可即刻被广泛利用，无需凭证。”  
  
   
  
根据 Ollama 的使用方式，成功利用 “流血骆驼” 漏洞可能导致员工交互信息、开发代码、路由工具输出，以及包含个人身份信息（PII）、个人健康信息（PHI）和其他敏感信息的提示词被泄露。  
  
   
  
据 Cyera 称，“任何未在前面设置防火墙或身份验证代理就可通过网络访问的 Ollama 部署” 都有被利用的风险。  
  
   
  
Ollama 0.17.1 版本已修复该漏洞。建议各组织尽快应用修复程序，并限制对其部署的网络访问。部署身份验证代理和进行网络分段应能提高安全性。  
  
   
  
各组织还应对正在运行的实例进行互联网暴露情况审计，并将任何可从互联网访问的实例，以及通过该实例的环境变量和数据，视为已遭泄露。  
#   
  
  
  
  
欢迎关注SecHub网络安全社区，SecHub网络安全社区目前邀请式注册，邀请码获取见公众号菜单【邀请码】  
  
**#**  
  
  
**企业简介**  
  
  
**赛克艾威 - 网络安全解决方案提供商**  
  
****  
       北京赛克艾威科技有限公司（简称：赛克艾威），成立于2016年9月，提供全面的安全解决方案和专业的技术服务，帮助客户保护数字资产和网络环境的安全。  
  
  
安全评估|渗透测试|漏洞扫描|安全巡检  
  
代码审计|钓鱼演练|应急响应|安全运维  
  
重大时刻安保|企业安全培训  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8icWLyUKibZZrPdaxnm18Zscp6Xcu0OiaMwuh8LP87lPQLxMwiceAsv3TurmE7zZOulOhMELnQ2OulwFIJkbmB3bRg/640?wx_fmt=png "")  
  
  
**联系方式**  
  
电话｜16637726088  
  
官网｜https://sechub.com.cn  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0FW5uwU0BZtn2lmMrLPwpibCeCVbtBFDRkbFb7n7ibhPRxg20spUo9mUIiakmRYABB88Idl81IpGuXfw/640?wx_fmt=gif "")  
  
**关注我们**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SUZ43ICubr4mWJcUARDKYbQooQjbjbmqZTerAIXqDX9CaVxXbB7pyWwnMRklrCJias9r59PhnJAxZ4e3gYjyqVQ/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SUZ43ICubr4mWJcUARDKYbQooQjbjbmqZTerAIXqDX9CaVxXbB7pyWwnMRklrCJias9r59PhnJAxZ4e3gYjyqVQ/640?wx_fmt=png "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/8icWLyUKibZZrPdaxnm18Zscp6Xcu0OiaMwyhlWCYDVqK38BA5dbjKkH7icWmAew7SYRA7ao1bFibialrMvmQ9ib0TBvw/640?wx_fmt=jpeg "")  
  
  
**公众号：**  
sechub安全  
  
**哔哩号：**  
SecHub官方账号  
  
  
  
