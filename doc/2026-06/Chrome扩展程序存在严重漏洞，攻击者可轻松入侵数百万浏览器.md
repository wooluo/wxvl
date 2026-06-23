#  Chrome扩展程序存在严重漏洞，攻击者可轻松入侵数百万浏览器  
e安在线
                    e安在线  e安在线   2026-06-23 01:50  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Hxdb7gjfn9lhKTE1TiaaZ8lLqcoR43nkggxdsADyRWUwJejHibJOzn1Kw1MECEJ4Ca6lXbN4pXzMOy37VN4rrBX0QdPNwQZjMLzic231icuQVVo/640?wx_fmt=jpeg&from=appmsg "")  
  
  
广泛使用的Chrome扩展程序SiderAI和MaxAI中发现的关键安全漏洞，正使数百万用户面临风险。这些漏洞允许攻击者完全控制浏览器会话，并可能访问跨网站及本地系统的敏感数据。  
  
  
Rebora Security安全研究人员发现了两组分别名为 "Spyder" 和 "MaXSS" 的漏洞，影响采用AI技术的"agentic side panel"类扩展程序。这些旨在通过AI驱动摘要和自动化功能增强浏览体验的工具，已在Chrome兼容浏览器上安装超过1000万台设备。值得注意的是，SiderAI位列Chrome应用商店前25名热门扩展，凸显了漏洞影响的广泛性。  
  
  
  
**漏洞技术原理**  
  
  
  
漏洞源于网页与扩展内部组件（特别是内容脚本）之间的通信处理存在安全隐患。在Chrome扩展架构中，内容脚本充当网站与扩展后台进程的中介。虽然理论上应保持严格隔离，但SiderAI和MaxAI均未能正确验证来自网页的输入数据。  
  
  
针对MaxAI的研究显示，恶意网站可向扩展内容脚本发送特制消息，这些消息未经适当验证就被转发至后台进程。这使得攻击者能执行特权操作，包括：打开隐藏标签页、截取屏幕截图以及与用户账户交互。在演示案例中，研究人员成功在用户无感知的情况下访问Gmail和Google Calendar会话并提取敏感信息。  
  
  
SiderAI的Spyder漏洞则允许攻击者模拟用户交互行为（如点击和键盘输入），跨越嵌入式网页会话实施攻击。通过滥用此功能，恶意网站可静默开启Google Gemini等服务，窃取私密AI对话数据并外泄，这标志着浏览器信任边界的严重失效。  
  
  
  
**漏洞影响范围**  
  
  
  
这些漏洞的影响极为广泛：攻击者可读取邮件、窃取认证令牌、篡改文档，并代表用户在几乎所有网站上执行操作。某些情况下，扩展获得的权限甚至允许访问底层操作系统的本地文件。最令人担忧的是，漏洞利用仅需用户访问恶意网页，无需其他交互，使得攻击向量兼具隐蔽性和高度可扩展性。  
  
  
  
**处置建议**  
  
  
  
Rebora研究人员已向扩展开发商报告问题但未获回应。鉴于漏洞严重性，研究结果被公开披露，Chrome应用商店运营方Google也收到通知。安全专家强烈建议用户立即检查浏览器是否安装SiderAI或MaxAI扩展，确认后立即卸载。  
  
  
该事件凸显了AI集成类浏览器扩展日益增长的安全风险，表明终端安全正成为不断演变的威胁格局中的关键战场。  
  
  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9nICBowwHOpzIlibia984voWDsES7wSZ9HGrVibecYnQ0KtWUlJEr6ROreI4blFicTs9jwOicD9Sh5iaj4p3I6NQicsSzYVfBoLdP3bck/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9kI3PockBVNSGSa1Y2HwwqIa7adPjrW9ayflzWGRdZm7KsytA0hRAzPFaCFgwzMmEtump6pa57bDJcYHkIiaI41bicCdTBu8j1MU/640?wx_fmt=png&from=appmsg "")  
  
  
声明：除发布的文章无法追溯到作者并获得授权外，我们均会注明作者和文章来源。如涉及版权问题请及时联系我们，我们会在第一时间删改，谢谢！文章来源：FreeBuf  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9nfv3Tv4Up5os7sjXJ8icfQuwLG9WKWtl2ounxVn1YB4YhQXEuahHqsh2rA02ibusgZrqa83psUNB92NlaibtaQOCqsyT7RGIHLvs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9kZibKkcrZGA3GTnjwVRm3uib5LcOfUicM0kibUFL0louiatPmkGzicKv27Sh4mF39wj8agnoLzjJbPymXnsKkQcXobQrYpFanUbj1nU/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9nhOFITZxEkBxPIicbuxDuicNicFziaias6thx3Lria9U8HBofibt1E224wbuXx9YGLn4EBlk7ZPvwjA7oqNrVWy1biaykd6Kkpu1iaY9DA/640?wx_fmt=png&from=appmsg "")  
  
  
  
