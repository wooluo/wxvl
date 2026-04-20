#  漏洞预警 | Axios输入验证不当漏洞  
浅安
                    浅安  浅安安全   2026-04-19 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-40175  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Axios是一款广泛使用的JavaScript HTTP客户端库，支持浏览器与Node.js环境，提供Promise API、请求拦截器、自动JSON转换等功能。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhzhX5ibzGSwotBfsiaRFX2gPTDgzvheFibka6JrWKqLHW5jtdz2u7Gycy48LLWSO5libEVobdsvozLuEA45NInMojY8sYXWhvOT9NE/640?wx_fmt=png&from=appmsg "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-40175**  
  
**漏洞类型：**  
输入验证不当  
  
**影响：**  
越权操作  
  
**简述：**  
Axios存在Header注入漏洞，在lib/adapters/http.js组件中，由于Axios在合并请求配置时未对Header值进行CRLF字符校验，且会继承被污染的Object.prototype属性，导致Prototype Pollution可被利用为“Gadget”。攻击者可通过第三方依赖中的原型污染漏洞注入恶意Header，进而构造请求走私流量，实现对AWS IMDSv2等云元数据服务的访问，窃取IAM凭证或执行远程代码。  
  
**0x04 影响版本**  
- axios < 1.15.0  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://axios-http.com/  
  
  
  
