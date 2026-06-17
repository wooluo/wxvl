#  OpenBSD 修复已存在27年的 PPP 协议栈认证绕过漏洞  
Sergiu Gatlan
                    Sergiu Gatlan  代码卫士   2026-06-17 03:51  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
****  
**OpenBSD****修复PPP协议栈中已存在长达27年之久的身份验证绕过漏洞。该漏洞源于sppp_pap_input函数中用于PAP（密码认证协议）凭证验证的bcmp比较逻辑存在缺陷，可用于在无需任何凭证的情况下完成PPP认证，并可能造成内核堆内存越界读取。**  
  
该漏洞自1999年7月1日最初导入OpenBSD源代码树起便存在，影响此后所有版本的OpenBSD，直至2026年6月14日被修复。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfUtZUBPOO5LVmbJIyOn3c65vOXVRTCERs7ia7mDrXzbHVyWibMKK5qmFKunIicjskfUEiafX7HI6uT6F3kicticEowGgvBqWHKictwBhM/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞简述**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfWLjughDIyiaoAIHjs5jcxiaSrdUNXMLq4wRbWy0ADq1AQvorw08t4jTcCfSrFO3n54CPn4IlGcRBEwVQ5uHibWe8a4ct1IfwiavyY/640?wx_fmt=gif&from=appmsg "")  
  
  
  
该漏洞源自一行代码，sppp_pap_input函数在验证PAP凭证时，直接使用来自传入PAP数据帧中攻击者可控制长度字段（name_len和passwd_len）作为bcmp比较的长度。当攻击者将这两个长度字段设为0时，bcmp比较会无条件返回0（因为比较长度为0），从而绕过用户名和密码的验证，直接通过PAP认证。此外，若攻击者提供的name_len大于实际配置凭证的分配长度，bcmp会读取堆对象之后的内存，导致内核堆越界读取。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfWtianKAKIOw43svsb2tHdd2H6DXEwARDO07Zmldottftp1f8tL5jmHT7qaEsI2hQfxs9Agf2ytsfn7GwSIqRAsRqdDIp4sRzqM/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞影响**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfUeWoNaX9MAv5uibhyJNmqrN34XHGKBIiaAvNHKEUhHl3eXsFK9yZsTTEjWibq5HTYHic1moR91icD8DibYdL80xXABrWic1nu1SrcVSs/640?wx_fmt=gif&from=appmsg "")  
  
  
  
攻击者可在同一广播域内通过PPPoE数据路径，即pppoe_data_input → pppoeintr → sppp_input → sppp_pap_input，利用该漏洞，无需知晓任何凭证即可完成PPPoE握手全过程（包括发现、LCP协商、零长度PAP认证、IPCP协商），最终建立网络连接并劫持受害者的IP流量。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfUbT4FWRvhWBtTjTJP3jLljYBX32ic8GO0rREUQgubGGYe5WnQ12UPIguZ871n4aTUZyJyYM90TW1DAkmK0SH4u0wSzdbUYAKe0/640?wx_fmt=gif&from=appmsg "")  
  
**修复方案**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfXHjPEd5l1kNWUf80JChibHC3ibLpgsohaCxlzM4icFY1Hw1Z2pjRxZic1brTKibUcs4CNSNMbcAUTCHYR77NMfKG5iaahpg3ahZGRIs/640?wx_fmt=gif&from=appmsg "")  
  
  
  
修复方式参照了同一文件中CHAP处理程序已有的正确模式，使用精确长度预检查：  
```
if (name_len != strlen(sp->hisauth.name) ||
    passwd_len != strlen(sp->hisauth.secret) ||
    bcmp(name, sp->hisauth.name, name_len) != 0 ||
    bcmp(passwd, sp->hisauth.secret, passwd_len) != 0) {
```  
  
  
该修复防范同时阻止了零长度绕过，并将bcmp的比较长度限定为存储凭证的确切大小，从而消除了越界读取问题。修复提交于2026年6月14日，提交ID为openbsd/src@076e2b1。  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[开源操作系统 OpenBSD 被曝四个严重的认证绕过和提权漏洞（详情）](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247491821&idx=1&sn=99481c872b8bb5bb526699225619cab3&scene=21#wechat_redirect)  
  
  
[出于安全考虑，OpenBSD 禁用英特尔 CPU 超线程](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247487429&idx=3&sn=87b0a3dfa9d2ebb4cf9ff82ab32826e1&scene=21#wechat_redirect)  
  
  
[phpBB 论坛软件修复已存在10年的认证绕过漏洞](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247526272&idx=1&sn=f79160dd0916a71743130bac5538397f&scene=21#wechat_redirect)  
  
  
[PAN-OS GlobalProtect 认证绕过漏洞已遭活跃利用](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247526149&idx=1&sn=64865321252297906000fede942608f5&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://blog.argus-systems.ai/blog/openbsd-pap-27-year-auth-bypass.html  
  
  
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
  
