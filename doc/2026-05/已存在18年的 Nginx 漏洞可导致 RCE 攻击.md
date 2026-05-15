#  已存在18年的 Nginx 漏洞可导致 RCE 攻击  
Ravie Lakshmanan
                    Ravie Lakshmanan  代码卫士   2026-05-15 06:35  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
**网络安全研究人员披露影响 NGINX Plus 和 NGINX Open 的多个漏洞，其中一个潜伏了 18 年（CVE-2026-42945，CVSS v4评分9.2）。**  
  
该漏洞由 depthfirst 公司发现，是一个影响 ngx_http_rewrite_module 模块的堆缓冲区溢出问题，攻击者可通过精心构造的请求实现远程代码执行或造成拒绝服务。该漏洞被命名为“NGINX Rift”。  
  
F5 在周三发布的安全公告中表示：“NGINX Plus 和 NGINX Open Source 的 ngx_http_rewrite_module 模块存在一个漏洞。该漏洞存在于以下情况：rewrite 指令之后跟有 rewrite、if 或 set 指令，并且使用了未命名的 Perl 兼容正则表达式（PCRE）捕获（例如 $1、$2），同时替换字符串中包含问号（?）。未经身份认证的攻击者，在无法控制的特定条件下，可以通过发送精心构造的 HTTP 请求利用该漏洞，可能导致 NGINX 工作进程发生堆缓冲区溢出，从而引发重启。此外，对于禁用了地址空间布局随机化的系统，攻击者可能实现代码执行。”  
  
depthfirst 发布安全公告表示，该漏洞可能允许远程未认证的攻击者通过发送精心构造的 URI 来破坏 NGINX 工作进程的堆，无需认证即可触发，能够可靠地用于引发堆溢出，并可能导致 NGINX 工作进程中的远程代码执行。公告称：“能够通过 HTTP 访问到存在漏洞的 NGINX 服务器的攻击者，可以发送单个请求，使工作进程中的堆溢出并实现远程代码执行。无需认证步骤，不需要任何前置访问权限，也无需现有会话。写入分配内存区域之外的字节来源于攻击者的 URI，因此内存损坏是由攻击者塑造的，而非随机的。重复请求也可用于使工作进程持续处于崩溃循环中，从而降低该实例所服务的每个网站的可用性。”  
  
该漏洞已在如下版本中修复：  
  
- NGINX Plus R32 - R36 （R32 P6 和 R36 P4引入修复方案）  
  
- NGINX Open Source 1.0.0 - 1.30.0（1.30.1 和 1.31.0引入修复方案）  
  
- NGINX Open Source 0.6.27 - 0.9.7（无修复计划）  
  
- NGINX Instance Manager 2.16.0 - 2.21.1  
  
- F5 WAF for NGINX 5.9.0 - 5.12.1  
  
- NGINX App Protect WAF 4.9.0 - 4.16.0  
  
- NGINX App Protect WAF 5.1.0 - 5.8.0  
  
- F5 DoS for NGINX 4.8.0  
  
- NGINX App Protect DoS 4.3.0 - 4.7.0  
  
- NGINX Gateway Fabric 1.3.0 - 1.6.2  
  
- NGINX Gateway Fabric 2.0.0 - 2.5.1  
  
- NGINX Ingress Controller 3.5.0 - 3.7.2  
  
- NGINX Ingress Controller 4.0.0 - 4.0.1  
  
- NGINX Ingress Controller 5.0.0 - 5.4.1  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfWP3JapWYVAVUkiaLu0O7WZDAQVd0ctcD5ibyJ2yMOHV1hJYXribNYCyLicbMew9bIeBBnV84X7fM0Uad6bs9lxqyTxsROCjCbnbrU/640?wx_fmt=gif&from=appmsg "")  
  
**其它漏洞**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfXJ6H53MXGTEKiawAiahuvH737xJd2uIr0V7sFqOSA4IzRKXJtCVu3oc5licWEicTJnfsWribUh0z9UT1nMUumtWcDOE0z3pNULfpuE/640?wx_fmt=gif&from=appmsg "")  
  
  
  
NGINX Plus 和 NGINX Open Source 还修复了其它三个漏洞：  
  
- CVE-2026-42946（CVSS v4 评分：8.3）—— ngx_http_scgi_module 和 ngx_http_uwsgi_module 模块中存在的一个过度内存分配漏洞，当配置了 scgi_pass 或 uwsgi_pass 时，具备中间人能力的远程未认证攻击者可控制上游服务器的响应，读取 NGINX 工作进程的内存或使其重启。  
  
- CVE-2026-40701（CVSS v4 评分：6.3）—— ngx_http_ssl_module 模块中存在的一个释放后使用漏洞，当 ssl_verify_client 指令设置为 "on" 或 "optional"，且 ssl_ocsp 指令设置为 "on" 时，远程未认证攻击者可有限控制数据修改或导致 NGINX 工作进程重启。  
  
- CVE-2026-42934（CVSS v4 评分：6.3）—— ngx_http_charset_module 模块中存在的一个越界读取漏洞，当配置了 charset、source_charset、charset_map 以及禁用了缓冲（"off"）的 proxy_pass 指令时，远程未认证攻击者可泄露内存内容或导致 NGINX 工作进程重启。  
  
  
  
建议用户应用最新版本获得最佳防护。如果无法立即打补丁，建议修改 rewrite 配置，将每个受影响 rewrite 指令中的未命名捕获替换为命名捕获。  
  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[已遭活跃利用的 nginx-ui 漏洞可导致 Nginx 服务器遭完全接管](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525782&idx=1&sn=95b7f1a90c60099f0b4ed5ecbfc983d2&scene=21#wechat_redirect)  
  
  
[Ingress NGINX 控制器中存在严重漏洞可导致RCE](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247522579&idx=2&sn=df3fca1672e67390925fdec6d6a9c0b7&scene=21#wechat_redirect)  
  
  
[F5修复BIG-IP 和 NGINX Plus 中的多个高危漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247520531&idx=1&sn=3711327c08007954c754b1a665f4b963&scene=21#wechat_redirect)  
  
  
[NGINX 发布影响LDAP 实现的0day 缓解措施](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247511319&idx=2&sn=7ce34db4fac8a3e29220748a71cf6cea&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://thehackernews.com/2026/05/18-year-old-nginx-rewrite-module-flaw.html  
  
  
题图：Pixa  
bay Licens  
e  
  
  
**本文由奇安信编译，不代表奇安信观点。转载请注明“转自奇安信代码卫士 https://codesafe.qianxin.com”。**  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSf7nNLWrJL6dkJp7RB8Kl4zxU9ibnQjuvo4VoZ5ic9Q91K3WshWzqEybcroVEOQpgYfx1uYgwJhlFQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSN5sfviaCuvYQccJZlrr64sRlvcbdWjDic9mPQ8mBBFDCKP6VibiaNE1kDVuoIOiaIVRoTjSsSftGC8gw/640?wx_fmt=jpeg "")  
  
**奇安信代码卫士 (codesafe)**  
  
国内首个专注于软件开发安全的产品线。  
  
   ![](https://mmbiz.qpic.cn/mmbiz_gif/oBANLWYScMQ5iciaeKS21icDIWSVd0M9zEhicFK0rbCJOrgpc09iaH6nvqvsIdckDfxH2K4tu9CvPJgSf7XhGHJwVyQ/640?wx_fmt=gif "")  
![]( "")  
  
   
觉得不错，就点个 “  
在看  
” 或 "  
赞  
” 吧~  
  
