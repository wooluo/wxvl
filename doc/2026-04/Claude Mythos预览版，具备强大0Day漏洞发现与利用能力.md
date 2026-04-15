#  Claude Mythos预览版，具备强大0Day漏洞发现与利用能力  
 乌雲安全   2026-04-15 00:36  
  
## Anthropic公司近日推出Claude Mythos预览版，这款先进语言模型具备发现并自主利用未公开0Day漏洞的非凡能力。为确保这些强大工具被用于防御目的，该公司同步启动"Glasswing项目"，与行业合作伙伴共同修补关键软件系统。  
##   
  
**Part01**  
## 模型能力显著升级  
  
  
Claude Mythos预览版相较Opus 4.6等旧模型实现重大突破——旧模型仅能发现漏洞却难以转化为有效攻击载荷。在开源软件内部测试中，新模型成功实现对10个完全打补丁目标的完整控制流劫持。这些高级攻击能力并非显式编程所得，而是源自模型在逻辑推理和自主编码方面的整体提升。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX0ZktYggZgPacia4Sem61qy8PQr4PJuuuKmT9f7qmIIYEVBcWednNiacicnZZjErdlDDdGVibt9Xseu9jJZwGjgTIYnGFGiaiaBavXibU/640?wx_fmt=jpeg&from=appmsg#imgIndex=2 "")  
  
  
**Part02**  
## 自主漏洞利用生成  
  
  
该模型能自主串联多个软件缺陷，构建可绕过现代安全防护的复杂攻击链。例如，它成功编写出可规避严格沙箱环境、突破内核地址空间布局随机化（KASLR）防护的网页浏览器漏洞利用程序，最终获取系统提权权限。由于工具自动化程度极高，即便毫无网络安全基础的用户也能在一夜之间生成可用的远程代码执行攻击代码。  
  
  
**Part03**  
## 历史漏洞挖掘成果  
  
  
当应用于真实软件环境时，该AI Agent发现了人类研究者数十年未察觉的关键0Day漏洞，包括：  
  
- OpenBSD系统中存在27年的内存破坏漏洞（该系统以严格的安全标准著称），根源在于网络传输控制协议的复杂有符号整数溢出问题  
  
- 经过严格审计的FFmpeg媒体库中存在16年的缺陷，源于视频帧解码过程中的整数大小与内存初始化不匹配问题  
  
**Part04**  
## 安全防护机制  
  
  
为发现这些漏洞，AI在隔离测试环境中自主完成源代码分析、假设验证及PoC漏洞编写全流程。Anthropic承认，发布如此强大的漏洞发现工具可能短期内令恶意黑客获得危险优势。为此，Glasswing项目初期仅限受信任的防御方使用该模型，以便在漏洞被野外利用前完成修复。  
  
  
安全专家普遍认为，随着行业适应进程，这类先进AI模型终将成为不可或缺的防御工具，大幅提升全球软件生态安全性。  
  
  
**参考来源：**  
  
Anthropic Unveils Claude Mythos Preview With Powerful Zero-Day Detection Capabilities  
  
https://cybersecuritynews.com/claude-mythos-zero-day-detection/  
  
  
  
