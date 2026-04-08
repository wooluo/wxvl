#  Windows Defender 0Day漏洞PoC曝光，攻击者可获取系统最高权限  
e安在线
                    e安在线  e安在线   2026-04-08 03:26  
  
网络安全研究员Chaotic Eclipse（@ChaoticEclipse0）在GitHub上公开了一个名为BlueHammer的Windows本地提权（LPE）0Day漏洞利用程序，并附带了完整的PoC源代码。漏洞研究员Will Dormann证实该漏洞利用有效，并指出微软自身的安全响应流程可能是导致此次非协调性公开披露的直接原因。  
  
  
****  
  
**漏洞技术细节**  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Hxdb7gjfn9kTFmNicb1BpMRzGHibE4XU8yh2Ygob7UhknibIZ5WMbibd3kWJXBlxs79QZOcXDHRMiaziaiasBmU0fVGvEpnFCs2wvnibONwQo3Wh76U/640?wx_fmt=jpeg&from=appmsg "")  
  
  
该漏洞利用程序还展示了凭据窃取能力，能够显示本地账户的NTLM密码哈希值，包括标记为IsAdmin: TRUE的管理员用户，并确认SYSTEMShell: OK、Shell: OK和PasswordRestore: OK等关键功能。受影响的系统运行Windows 11（Build 10.0.26200.8037），表明该漏洞影响最新版本的Windows系统。  
  
  
****  
  
**披露原因与微软响应问题**  
  
  
  
研究人员表示，对微软安全响应中心（MSRC）的不满是非协调性公开披露的主要动机。据Chaotic Eclipse称，近年来MSRC的质量显著下降，原因是微软裁减了经验丰富的安全人员，取而代之的是只会遵循僵化流程图表而缺乏专业判断的员工。  
  
  
披露中特别指出：MSRC要求研究人员提交漏洞利用的视频演示作为漏洞报告流程的一部分，这一要求被安全社区普遍认为是不合理且苛刻的。研究人员暗示，这一要求可能是故意设置的障碍，最终导致案例被关闭或搁置而未得到解决。  
  
  
"在撰写本文时公开披露bluehammer漏洞利用程序，该漏洞目前仍未修补。完整PoC源代码可在此处获取——https://t.co/yk80ylIfBV" —— Chaotic Eclipse (@ChaoticEclipse0) 2026年4月3日  
  
  
****  
  
**潜在威胁与缓解措施**  
  
  
  
研究人员指出，该漏洞利用程序并非100%可靠，但承认其"足够有效"可用于实际攻击。在熟练的威胁行为者手中，即使是部分可靠的LPE漏洞利用程序也可以被改进并武器化。勒索软件组织和APT攻击者通常在漏洞披露后几天内就将公开的PoC代码集成到他们的工具包中。  
  
  
**缓解建议**  
  
  
在微软发布官方补丁或缓解建议之前，安全团队应采取以下预防措施：  
  
- 通过终端检测与响应（EDR）工具监控异常的权限提升活动  
  
- 将本地用户权限限制在业务所需的最低水平  
  
- 在Windows系统上启用增强日志记录以检测异常的SYSTEM级进程生成  
  
- 关注微软针对BlueHammer漏洞发布的安全更新或公告  
  
截至本文发布时，微软尚未就该漏洞发表公开声明或分配CVE编号。  
  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9ngtRibO5L85kXsrxf0uugm8sicibf59QrsiamAaxZSdkqjgrSCy1A3tpso8MqGQmfHq1BKJUkkiaxCgjsmZQdREYdLQROJzx8icM8po/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9l8gDEeOZ7U4yKwhvPYu9nxiadvZlTvBQQrsbAvRfpibHicEialOHYQXibFzpblAxKTYURGqO2LnIOql2ESzYkhhzuSVvy0WFicSBMDA/640?wx_fmt=png&from=appmsg "")  
  
  
声明：除发布的文章无法追溯到作者并获得授权外，我们均会注明作者和文章来源。如涉及版权问题请及时联系我们，我们会在第一时间删改，谢谢！文章来源：FreeBuf  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9kvvkH6ScbO3I27Hzp1zKgJ1MwSZhUPYwwD4UzHiciattC5GuaOONITdwfpqceUx0Fv6A0nr5DzxdEWgwnKtpdBLEs8Tpib2juiaoI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9loFUHEibfCbU1DqCh73ABUSxpAPsibmIHPMicA78Gqf1FtCOMeEf9aAuF0hSdoqjphibfkuw3Nyv6Q9J5SRKBibMxXQIpOQvbuTsjE/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9kcqKFJ8qM4PePiaNXia5sibyjBial9erhLZLWv4j36KvNv2iaXxfib42QQH6wCQcc2SKpiabwGqVx60b5bEw3R4fwAer1egtqxcGg5nE/640?wx_fmt=png&from=appmsg "")  
  
  
  
