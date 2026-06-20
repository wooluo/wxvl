#  Node.js发布关键安全更新，修复影响120万站点的12个高危漏洞  
 网安百色   2026-06-20 10:22  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/WibvcdjxgJnuLG1mlibF25RZOlCicibtIiaAubq9Xtmyd7wPyN4JPCI8AkeluvXoB2LY3ff4r93jNA7WLFwtAqC7mXHvORMCqhicB3kaSWxIOF1ws/640?wx_fmt=png&from=appmsg "")  
  
Node.js于2026年6月18日宣布针对其所有受支持版本线发布关键安全更新，共修复12个安全漏洞。其中两个高危漏洞可能导致拒绝服务攻击（DoS） 和认证绕过风险。此次更新影响Node.js 22.x、24.x及26.x版本，修复后的版本号分别为v22.23.0、v24.17.0和v26.3.1。  
  
一、核心漏洞风险  
  
1. 最高危漏洞（CVSS评分≥8.6）  
  
CVE-2026-48933（高危）：  
  
WebCrypto API中的subtle.encrypt()函数存在整数溢出漏洞。当处理2 GiB整数倍大小的特制输入时，将触发进程崩溃，导致远程拒绝服务（DoS）。该问题对依赖加密操作的无信任环境应用构成严重威胁。  
  
CVE-2026-48618（高危）：  
  
TLS主机名验证存在Unicode点分隔符处理缺陷。攻击者可通过构造特殊域名，使主机名解析与证书验证结果不匹配，从而在特定配置下绕过TLS通配符认证，可能导致未授权访问或数据泄露。  
  
2. 中危漏洞关键影响  
  
HTTP/2协议攻击面：  
  
CVE-2026-48619：攻击者通过发送超量ORIGIN帧可导致HTTP/2客户端内存无限增长，引发服务中断。  
  
CVE-2026-48934：利用会话复用与服务器名称不匹配可绕过TLS主机身份验证，威胁通信安全。  
  
凭证泄露风险：  
  
CVE-2026-48615在代理隧道错误消息中暴露代理凭据。若代理URL中嵌入认证信息，可能通过日志或诊断输出泄露，加剧企业环境凭证失陷风险。  
  
3. 低危但可链式利用的漏洞  
  
权限模型绕过：  
  
CVE-2026-48617和CVE-2026-48935在特定条件下可突破文件系统限制。  
  
网络访问控制失效：  
  
CVE-2026-48936允许通过Unix域套接字绕过网络权限限制（仅影响Node.js 26）。  
  
协议逻辑缺陷：  
  
CVE-2026-48931因http.Agent实现中的竞态条件导致HTTP响应队列污染，CVE-2026-48937则因HTTP/2服务器未正确清理会话，可能在连接终止后继续处理数据。  
  
二、漏洞详情汇总  
<table><thead><tr style="-webkit-font-smoothing: antialiased;"><th style="-webkit-font-smoothing: antialiased;"><span data-spm-anchor-id="5176.28103460.0.i7.39f22988VIcYQi" style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE编号</span></span></th><th style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">漏洞简述</span></span></th><th style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">严重等级</span></span></th><th style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">影响版本线</span></span></th></tr></thead><tbody><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48933</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">WebCrypto AES整数溢出致远程进程终止（DoS）</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">高危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 22, 24, 26</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48618</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Unicode点分隔符处理缺陷致TLS通配符认证绕过</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">高危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 22, 24, 26</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48615</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">代理隧道错误消息泄露凭证（ERR_PROXY_TUNNEL）</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">中危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 22, 24, 26</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48619</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">攻击者控制ORIGIN帧致HTTP/2客户端内存无限增长</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">中危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 22, 24, 26</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48937</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">HTTP/2在无效协议错误后未清理会话</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">中危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 22, 24</span></span></td></tr><tr style="-webkit-font-smoothing: antialiased;"><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">CVE-2026-48936</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Unix域套接字服务器绕过网络权限限制</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">低危</span></span></td><td style="-webkit-font-smoothing: antialiased;"><span style="-webkit-font-smoothing: antialiased;"><span leaf="">Node.js 26 专属</span></span></td></tr></tbody></table>  
三、修复与应对建议  
  
1. 紧急升级要求  
  
所有受支持版本均受影响，必须立即升级至：  
  
Node.js 22 → v22.23.0  
  
Node.js 24 → v24.17.0  
  
Node.js 26 → v26.3.1  
  
已终止支持版本（EOL） 无法获取补丁，存在极高风险，建议尽快迁移至LTS版本。  
  
2. 关键修复范围  
  
更新核心依赖库：  
  
llhttp（9.4.2）  
  
nghttp2（1.69.0）  
  
OpenSSL（3.5.7）  
  
undici（跨版本适配）  
  
修复内容涵盖协议实现、内存管理及权限控制等底层机制。  
  
3. 企业防护建议  
  
验证运行时版本：通过node -v确认已部署修复版本。  
  
监控异常行为：  
  
检查服务进程崩溃日志（尤其涉及加密操作的场景）。  
  
审计TLS连接中的非常规主机名格式（含Unicode点分隔符）。  
  
强化代理配置：避免在URL中硬编码凭据，改用环境变量管理敏感信息。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=p6hk1x4r&tp=webp#imgIndex=1 "")  
  
