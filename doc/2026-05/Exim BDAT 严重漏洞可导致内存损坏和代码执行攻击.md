#  Exim BDAT 严重漏洞可导致内存损坏和代码执行攻击  
Ravie Lakshmanan
                    Ravie Lakshmanan  代码卫士   2026-05-14 04:04  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
**开源的邮件传输代理 (MTA) Exim 发布安全更新，修复了影响某些配置的一个严重漏洞 (CVE-2026-45185)，它可导致内存损坏和潜在的代码执行后果。**  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
Exim 为类 Unix 系统设置，用于接收、路由和交付邮件。该漏洞被称为 “Dead.Letter”，是位于 Exim 二进制文件传输 (BDAT) 消息主体解析中的一个释放后使用漏洞，在 GnuTLS 处理 TLS 连接时触发。  
  
Exim 在今天发布的一份安全公告中提到，“当客户端在邮件正文传输完成之前发送 TLS close_notify 告警时，随后在同一 TCP 连接上以明文形式发送最后一个字节时，该漏洞会在 BDAT 命令处理邮件正文的处理过程中触发。这一系列操作会导致Exim在TLS会话关闭过程中，向一个已被释放的内存缓冲区写入数据，从而引发堆内存损坏。攻击者仅需建立TLS连接，并使用CHUNKING（BDAT）SMTP扩展即可实施攻击。”  
  
该漏洞影响从4.97版本到4.99.2版本（含）的所有Exim版本。但需要注意的是，只有使用 USE_GNUTLS=yes 编译的版本才受影响，即依赖OpenSSL等其它TLS库的构建版本不受影响。自主网络安全测试平台XBOW的安全实验室负责人Federico Kirschbaum于2026年5月1日发现并报告该漏洞，之后获得致谢。  
  
Kirschbaum解释称：“在TLS关闭过程中，Exim会释放TLS传输缓冲区——但一个嵌套的BDAT接收包装器仍可能处理后续传入的字节，并最终调用 ungetc()，该函数会将一个字符（\n）写入已释放的内存区域。这一个字节的写入会落在Exim分配器的元数据上，破坏分配器的内部结构；攻击者随后利用这种损坏来获取更进一步的攻击原语。”  
  
研究员所在公司将该漏洞描述为 Exim 迄今发现过的“最高质量的漏洞之一”，并补充说，触发该漏洞几乎不需要服务器端进行任何特殊配置。这一漏洞已在 4.99.3 版本中得到修复。建议所有用户尽快升级。目前没有能够解决该漏洞的缓解措施。Exim 指出：“修复方案确保了在活跃的 BDAT 传输过程中收到 TLS close 通知时，输入处理栈会被彻底复位，从而防止使用悬空指针。”  
  
这并非 Exim 首次曝出严重的释放后使用漏洞。早在 2017 年底，Exim 就曾修补过 SMTP 守护进程中的一个释放后使用漏洞（CVE-2017-16943，CVSS 评分9.8）。未经身份验证的攻击者可利用该漏洞，通过特殊构造的 BDAT 命令实现远程代码执行，进而控制邮件服务器。  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[Exim 严重漏洞绕过150万台邮件服务器上的安全过滤器](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247520065&idx=3&sn=21cb4f355ee0bab1701bb08f51762ec4&scene=21#wechat_redirect)  
  
  
[数百万台Exim 服务器被曝严重缺陷，可导致攻击者以根权限远程执行命令](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247490811&idx=3&sn=4ec2274061c40fd69a4aa5003515ca5d&scene=21#wechat_redirect)  
  
  
[开源邮件传输代理 Exim 易遭 RCE 和 DoS 攻击 用户应立即修复](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247485423&idx=1&sn=8e7599e60d00a9e49a9c76be679e5120&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://thehackernews.com/2026/05/new-exim-bdat-vulnerability-exposes.html  
  
  
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
  
