#  已存在12年之久的Pack2TheRoot 漏洞可导致攻击者获得 Linux root 访问权限  
Bill Toulas
                    Bill Toulas  代码卫士   2026-04-27 10:10  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
****  
**“Pack2TheRoot”漏洞 (CVE-2026-41651，CVSS 8.8) 可用于 PackageKit 守护进程，导致Linux 本地用户安装或删除系统包并获得 root 权限。**  
  
  
该漏洞已存在12年之久，位于一款负责在 Linux 系统中管理软件安装、更新和删除的后台服务 PackageKit 中。上周已出现漏洞相关的一些信息以及修复该漏洞的 PackageKit 1.3.5版本。不过该漏洞的技术详情和演示利用尚未发布，以便用户安装补丁。  
  
德国电信公司红队调查发现，该漏洞的原因在于 PackageKit 用于处理包管理请求的机制。具体而言，研究人员发现在某些条件下可在无需认证的情况下在 Fedora 系统上执行 “pkcon install” 等命令，从而安装系统包。他们通过 Claude Opus AI 工具进一步探索了利用这种行为的可能性，最终发现了CVE-2026-41651。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfXThDbmd5FK2AEjj1uRJ0B65GibsPhGepbUlP2IhghMAzDgZtWrev3pOGlbgqa0T4TtxolbiapGutQJC3O49lZ4b2PlFFXvVicylY/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞影响和修复方案**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfVpdjf95aTE1GumgxrmsRqzdfJFa5Hoauia5wwESwGBPsbPjVQ7gG6Jron0OeGAp1VNCPTlUzlqicrqwhQJL9xx84rC6jNJL2nwo/640?wx_fmt=gif&from=appmsg "")  
  
  
  
4月8日，德国电信公司红队将研究结果告知红帽公司和 PackageKit 维护人员，他们认为预装且默认启用 PackageKit 的所有发行版本均受该漏洞影响。该漏洞影响从2014年11月发布的1.0.2版本到1.3.4版本。  
  
研究人员测试发现，该漏洞影响如下 Linux 发行版本：  
  
- Ubuntu Desktop 18.04（已停止支持）, 24.04.4 (长期支持), 26.04 (长期支持测试版)  
  
- Ubuntu Server 22.04 – 24.04 (长期支持)  
  
- Debian Desktop Trixie 13.4  
  
- RockyLinux Desktop 10.1  
  
- Fedora 43 Desktop  
  
- Fedora 43 Server  
  
  
  
不过，上述并未列出该漏洞影响的所有版本，任何使用 PackageKit 的 Linux 发行版本均应按照可能已遭攻击来处理。用户应尽快升级至PackageKit 1.3.5版本，并确保使用该包作为依赖项的其它任何软件已升级至安全版本。  
  
用户可使用如下命令，查看是否安装了易受攻击的 PackageKit 版本以及该守护进程是否运行：  
```
dpkg -l | grep -i packagekit
rpm -qa | grep -i packagekit
```  
  
  
用户可运  
行   
systemctl status packagekit   
   
或   
pkmo  
n  
 来查看   
PackageKit 守护进程是否可用且可运行，从而判断如果不修复系统是否处于风险之中。尽管尚不清楚该漏洞是否已遭利用，但研究人员认为有强有力的迹象表明已遭利用，因为利用可导致 PackageKit 守护进程触发断言失败并崩溃。即使 systemd 恢复了该守护进程，也可在系统日志中观察到崩溃情况。  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[10个npm包被指窃取 Windows、macOS 和 Linux 系统上的开发者凭据](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524314&idx=2&sn=81cae6998a39f2153ed18d7cc065303b&scene=21#wechat_redirect)  
  
  
[Docker Hub中仍然托管着带有XZ后门的数十个Linux镜像](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523819&idx=1&sn=909cc4e2732c910ba79d7907a1cd0f90&scene=21#wechat_redirect)  
  
  
[udisks 漏洞可用于获得Linux 主要发行版本的root权限](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523333&idx=2&sn=23cefe4214956d3fbac95c79c5396243&scene=21#wechat_redirect)  
  
  
[看我如何通过 OpenAI o3 挖到 Linux 内核远程 0day](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523149&idx=1&sn=0298267a08369cc3ea9bdbdec81eb788&scene=21#wechat_redirect)  
  
  
[恶意Go模块在高阶供应链攻击中传播 Linux 恶意软件擦除磁盘](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247522922&idx=1&sn=1d2c75c455f1b47d5561919e7802db6e&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://www.bleepingcomputer.com/news/security/new-pack2theroot-flaw-gives-hackers-root-linux-access/  
  
  
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
  
