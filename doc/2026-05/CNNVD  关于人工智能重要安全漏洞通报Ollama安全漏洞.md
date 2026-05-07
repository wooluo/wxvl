#  CNNVD | 关于人工智能重要安全漏洞通报Ollama安全漏洞  
 中国信息安全   2026-05-07 09:48  
  
[](https://cisat.cn/all/14915419?navIndex=3)  
  
  
**漏洞情况**  
  
近日，国家信息安全漏洞库（CNNVD）收到关于Ollama安全漏洞（CNNVD-202605-502、CVE-2026-7482）情况的报送。攻击者通过漏洞可获取环境变量、API密钥、系统提示和并发用户的对话数据。Ollama 0.17.1之前版本均受此漏洞影响。目前，Ollama官方已发布新版本修复了该漏洞，建议用户及时确认产品版本，尽快采取修补措施。  
  
## 一漏洞介绍  
  
  
Ollama是一个开源的跨  
平台大模型工具。该漏洞源于GGUF模型加载器中堆越界读取，可能导致服务器读取超出分配的堆缓冲区内存，攻击者通过漏洞可获取环境变量、API密钥、系统提示和并发用户的对话数据。  
  
## 二危害影响  
  
  
Ollama 0.17.1之前版本均受此漏洞影响。  
  
## 三修复建议  
  
  
目前，Ollama官方已发布新版本修复了该漏洞，建议用户及时确认产品版本，尽快采取修补措施。官方补丁链接：  
  
https://github.com/ollama/ollama/releases/tag/v0.17.1  
  
本通报由CNNVD技术支撑单位——奇安信网神信息技术（北京）股份有限公司、北方实验室（沈阳）股份有限公司、中国银联股份有限公司、内蒙古万德系统集成有限责任公司、内蒙古网安信息安全技术有限公司等技术支撑单位提供支持。  
  
CNNVD将继续跟踪上述漏洞的相关情况，及时发布相关信息。如有需要，可与CNNVD联系。联系方式: cnnvd@itsec.gov.cn  
  
（来源：CNNVD）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/LJwWAbW20CjibqkMrKgvpUMXzicRUcb356pGgnF30Ggp4NOicaLIubFr0woo2lONN2H9kOOwDEejWarMEXZDPxiahxRA0U0ibNVBoNTwLl8j4xibQ/640?wx_fmt=png&from=appmsg "")  
  
[](https://cisat.cn/)  
  
