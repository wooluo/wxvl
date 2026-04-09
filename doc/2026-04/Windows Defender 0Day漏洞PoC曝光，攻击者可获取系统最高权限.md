#  Windows Defender 0Day漏洞PoC曝光，攻击者可获取系统最高权限  
CNNVD
                    CNNVD  安小圈   2026-04-09 00:45  
  
**安小圈**  
  
  
第890期  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BWicoRISLtbNqM3Lnaqq6icl1RhgBIMsJlo15V6mAAwoiaKaGx5dh3JNwibrENIJnvLaEZ7CmMrqGicqEWSiczsQegibw/640?wx_fmt=png "")  
  
  
网络安全研究员Chaotic Eclipse（@ChaoticEclipse0）在GitHub上公开了一个名为BlueHammer的Windows本地提权（LPE）0Day漏洞利用程序，并附带了完整的PoC源代码。漏洞研究员Will Dormann证实该漏洞利用有效，并指出微软自身的安全响应流程可能是导致此次非协调性公开披露的直接原因。  
  
  
****  
  
**漏洞技术细节**  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Hxdb7gjfn9kTFmNicb1BpMRzGHibE4XU8yh2Ygob7UhknibIZ5WMbibd3kWJXBlxs79QZOcXDHRMiaziaiasBmU0fVGvEpnFCs2wvnibONwQo3Wh76U/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
  
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
  
  
  
  
END  
  
  
  
**【以上内容**  
**来源自：e安在线】**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/BWicoRISLtbOugegrykhydnkHibcSWjpibT2K6EwRCniasJ7zopLbBxIz6DUTwPYApdKXaUBXK5sGLSdSdKb9rBZNg/640?wx_fmt=jpeg "")  
![](https://mmbiz.qpic.cn/mmbiz_gif/0YKrGhCM6DbI5sicoDspb3HUwMHQe6dGezfswja0iaLicSyzCoK5KITRFqkPyKJibbhkNOlZ3VpQVxZJcfKQvwqNLg/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg2MDg0ODg1NQ==&mid=2247550771&idx=1&sn=b106bb0574435dd5698a74aa50938488&scene=21#wechat_redirect)  
  
[看完本文再也不怕网安通报“明文传输” “TLS版本低”漏洞了](https://mp.weixin.qq.com/s?__biz=Mzg2MDg0ODg1NQ==&mid=2247550771&idx=1&sn=b106bb0574435dd5698a74aa50938488&scene=21#wechat_redirect)  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg2MDg0ODg1NQ==&mid=2247550766&idx=1&sn=823d3fdd86bc69edcd337e03d89768eb&scene=21#wechat_redirect)  
**两名网络安全专家利用勒索软件攻击企业 委托自己联系自己谈赎金****聊一聊网络安全公司的内部争斗国家出手！网络安全产业低价中标乱象能否终结？ 网络安全行业还会好起来吗?**  
  
**《网络安全法》完成修改，自2026年1月1日起施行网络安全法修改了哪些内容？（附详细对照表）全球三大网络安全巨头同时被黑网安：亏损 TOP 10中国联通DNS故障敲响警钟：DNS安全刻不容缓全球超120万个医疗系统公网暴露：患者数据或遭窃取 中国亦受影响个人信息保护负责人信息报送系统填报说明（第一版）全文高度警惕：不明黑客组织攻击中国国防、能源、航空、医疗、网安等重点行业攻防演练在即：如何开展网络安全应急响应【攻防演练】中钓鱼全流程梳理[一文详解]网络安全【攻防演练】中的防御规划与实施攻防必备 | 10款国产“两高一弱”专项解决方案【干货】2024 攻防演练 · 期间 | 需关注的高危漏洞清单攻防演练在即，10个物理安全问题不容忽视红队视角！2024 | 国家级攻防演练100+必修高危漏洞合集(可下载)【攻防演练】中钓鱼全流程梳理攻防演练在即：如何开展网络安全应急响应【零信任】落地的理想应用场景：攻防演练网安同行们，你们焦虑了吗？网安公司最后那点体面，还剩下多少？突发！数万台 Windows 蓝屏。。。。广联达。。。惹的祸。。。权威解答 | 国家网信办就：【数据出境】安全管理相关问题进行答复全国首位！上海通过数据出境安全评估91个，合同备案443个沈传宁：落实《网络数据安全管理条例》，提升全员数据安全意识频繁跳槽，只为投毒【2025】常见的网络安全服务大全（汇总详解）AI 安全 |《人工智能安全标准体系(V1.0)》(征求意见稿)，附下载**  
  
