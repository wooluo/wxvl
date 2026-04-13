#  Adobe 紧急修复已遭利用的 0day  
Ravie Lakshmanan
                    Ravie Lakshmanan  代码卫士   2026-04-13 10:41  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
**Adobe****紧急修复了位于 Acrobat Reader 中已遭活跃利用的一个严重漏洞CVE-2026-34621（CVSS评分8.6）。**  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
该漏洞是由运行污染导致的，如遭利用可导致攻击者在受影响版本上运行恶意代码。原型污染是指可导致攻击者操纵应用对象和属性的JavaScript 漏洞，影响如下 Windows 和 macOS 版本：  
  
- Acrobat DC 26.001.21367及之前版本（已在26.001.21411中修复）  
  
- Acrobat Reader DC 26.001.21367及之前版本（已在26.001.21411中修复）  
  
- Acrobat 2024 版本24.001.30356 及之前版本（已在Windows 24.001.30362 和 macOS：24.001.30360中修复）  
  
  
  
Adobe 表示，“已知晓CVE-2026-34621已遭在野利用。”  
  
几天前，安全研究员兼 EXPMON 的创始人 Haifei Li 披露称，在通过 Adobe Reader 打开特殊构造的 PDF 文档时，该 0day 漏洞被用于运行恶意 JavaScript 代码。他指出，“Adobe 似乎认为该漏洞可导致任意代码执行，而非仅仅是一个信息泄露漏洞，这和我们以及其他安全研究员在过去几天中的研究发现一致。”  
  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[CISA提醒注意已遭活跃利用的 Adobe AEM 满分漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524204&idx=1&sn=33d5368ee92ea1a703d23d88bfbd0ee9&scene=21#wechat_redirect)  
  
  
[Adobe 修复史上最严重的 Magento 漏洞之一](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523980&idx=2&sn=1e726413f895d0c82f9817dde7abb01b&scene=21#wechat_redirect)  
  
  
[Adobe 紧急修复 AEM Forms 中的两个0day漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523749&idx=2&sn=107431463b8a59e595bc603cdfbdaa98&scene=21#wechat_redirect)  
  
  
[Adobe紧急修复严重的ColdFusion 路径遍历漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247521882&idx=1&sn=1a457064eddc19fcc7a712086557d5cb&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://thehackernews.com/2026/04/adobe-patches-actively-exploited.html  
  
  
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
  
