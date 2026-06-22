#  NGINX Open Source 中存在两个可导致RCE的严重漏洞  
Ravie Lakshmanan
                    Ravie Lakshmanan  代码卫士   2026-06-22 07:30  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
**F5****公司发布安全更新，修复了位于 NGINX Open Source 中的两个严重漏洞，它们可被用于在受影响系统上实现代码执行。**  
  
这两个漏洞如下：  
  
**CVE-2026-42530**  
 （CVSS v4 评分9.2）是位于 ngx_http_v3_module 模块中的一个释放后使用漏洞。当 NGINX 开源版配置使用 HTTP/3 QUIC 模块时，远程未认证攻击者可通过特殊构造的 HTTP/3 会话重新打开 QPACK 编码器流来触发该漏洞，并可在地址空间布局随机化 (ASLR) 被禁用或攻击者能够绕过 ASLR 的系统上执行代码。  
  
**CVE-2026-42055**  
(CVSS v4 评分: 9.2) 是位于 ngx_http_proxy_v2_module 和 ngx_http_grpc_module 模块中的一个基于堆的缓冲区溢出漏洞。当使用 proxy_http_version 2 或 grpc_pass 指令代理 HTTP/2 流量，且 ignore_invalid_headers 指令设置为 off，同时 large_client_header_buffers 指令大小大于 2 MB 时，远程未认证攻击者可触发该漏洞，并可在地址空间布局随机化 (ASLR) 被禁用或攻击者能够绕过 ASLR 的系统上执行代码。  
  
这两个漏洞已在如下版本中分别修复：  
  
CVE-2026-42530在如下版本中修复：  
  
- NGINX Open Source 1.31.0 - 1.31.1（在1.31.2版本中修复）  
  
- NGINX Gateway Fabric 2.0.0 - 2.6.3（在 2.6.4 版本中修复）   
  
- NGINX Gateway Fabric 1.3.0 - 1.6.2  
  
- NGINX Instance Manager 2.17.0 - 2.22.0  
  
- NGINX Ingress Controller 5.0.0 - 5.5.0  
  
- NGINX Ingress Controller 4.0.0 - 4.0.1  
  
- NGINX Ingress Controller 3.5.0 - 3.7.2  
  
  
  
CVE-2026-42055 在如下版本中修复：  
  
- NGINX Plus 37.0.0 - 37.0.1（在37.0.2.1版本中修复）  
  
- NGINX Plus R33 - R36（在R36 P6版本中修复）  
  
- NGINX Open Source 1.31.1（在1.31.2版本中修复）  
  
- NGINX Open Source 1.30.0 - 1.30.2（在1.30.3版本中修复）  
  
- NGINX Instance Manager 2.17.0 - 2.22.0  
  
- F5 WAF for NGINX 5.9.0 - 5.13.1  
  
- NGINX App Protect WAF 5.2.0 - 5.8.0  
  
- NGINX App Protect WAF 4.10.0 - 4.16.0  
  
- F5 DoS for NGINX 4.9.0  
  
- NGINX App Protect DoS 4.3.0 - 4.7.0  
  
- NGINX Gateway Fabric 2.0.0 - 2.6.3 (Fixed in 2.6.4)  
  
- NGINX Gateway Fabric 1.3.0 - 1.6.2  
  
- NGINX Ingress Controller 5.0.0 - 5.5.0  
  
- NGINX Ingress Controller 4.0.0 - 4.0.1  
  
- NGINX Ingress Controller 3.5.0 - 3.7.2  
  
  
  
F5 公司已采取如下缓解措施：  
  
- CVE-2026-42530：禁用 HTTP/3  
  
- CVE-2026-42055：删除配置中奖 ignore_invalid_headers 设置为off的指令，或者奖 large_client_header_bufferes 指令大小降到2 MB 以下。  
  
  
  
尽管 F5 公司并未提到这两个漏洞是否已遭利用，但该公司的产品常遭恶意人员滥用。就在上个月，该公司就修复了位于NGINX Plus 和 NGINX Open Source中一个被称为 “NGINX Rift”的严重漏洞CVE-2026-42945（CVSS评分9.2），而该漏洞在公开披露几天后就遭活跃利用。  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[NGINX 新漏洞可导致远程攻击者触发恶意代码](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247526088&idx=3&sn=353fe1e4d9d79dec6b4cce44a35da5fe&scene=21#wechat_redirect)  
  
  
[已存在18年的 Nginx 漏洞可导致 RCE 攻击](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247526019&idx=2&sn=ff7a5425883dc59896247c3cc01d5e4d&scene=21#wechat_redirect)  
  
  
[已遭活跃利用的 nginx-ui 漏洞可导致 Nginx 服务器遭完全接管](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525782&idx=1&sn=95b7f1a90c60099f0b4ed5ecbfc983d2&scene=21#wechat_redirect)  
  
  
[Ingress NGINX 控制器中存在严重漏洞可导致RCE](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247522579&idx=2&sn=df3fca1672e67390925fdec6d6a9c0b7&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://thehackernews.com/2026/06/f5-patches-two-critical-nginx-open.html  
  
  
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
  
