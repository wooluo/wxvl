#  漏洞通告 | Apache HTTP Server 远程命令执行漏洞  
原创 微步情报局
                    微步情报局  微步在线研究响应中心   2026-05-07 09:02  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fFyp1gWjicMKNkm4Pg1Ed6nv0proxQLEKJ2CUCIficfAwKfClJ84puialc9eER0oaibMn1FDUpibeK1t1YvgZcLYl3A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
漏洞概况  
  
  
Apache HTTP Server 是 Apache 软件基金会维护的开源 Web 服务器，mod_http2 是其用于支持 HTTP/2 协议的核心模块。  
  
近日，微步情报局监测到 Apache HTTP Server 官方发布安全通告，修复了 Apache HTTP Server 拒绝服务漏洞（CVE-2026-23918），  
微步情报局已成功复现  
；经验证，该漏洞可通过构造特定 HTTP/2 帧序列稳定触发拒绝服务。在系统符合特定内存布局、地址信息及运行环境条件要求时可实现远程代码执行，但并非任意场景下稳定利用。(完整漏洞情报请查阅：https://x.threatbook.com/v5/vul/XVE-2026-17007）  
  
此漏洞  
无需权限  
，攻击者成功利用此漏洞可  
导致Apache worker进程崩溃造成拒绝服务，特定条件下可能实现远程代码执行。  
建议受影响用户  
尽快修复。  
  
漏洞处置优先级(VPT)  
  
  
**综合处置优先级：**  
中风险  
<table><tbody><tr><td rowspan="3" style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">基本信息</span></section></td><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;"><section><span leaf="">微步编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">XVE-2026-17007</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE-2026-23918</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">漏洞类型</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程命令执行</span></section></td></tr><tr><td rowspan="5" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用条件评估</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的网络条件</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要绕过安全机制</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">对被攻击系统的要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无特殊要求</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的权限要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无需权限</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要受害者配合</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td rowspan="2" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用情报</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">POC是否公开</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><span style="color: #d93025;font-weight: bold;"><span leaf="">是</span></span></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">已知利用行为</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">暂无</span></section></td></tr></tbody></table>  
漏洞影响范围  
  
<table><tbody><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">产品名称</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">Apache HTTP Server</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">受影响版本</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">2.4.66</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">有无修复补丁</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">有</span></section></td></tr></tbody></table>  
漏洞复现  
  
  
![20260507135232_2cbb30f9-9b1d-4de6-9936-cedc0b377c2a_image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdENNkp2w6b5aPxicJW1O5rfPg3SVh03TsskjoJPibd4WYLr5FMbmBcKWzz2aFA44zJyicUaw47wd1lq5fwW9lPpgiakVq6HNeAhyOn4/640?wx_fmt=png&from=appmsg "")  
  
修复方案  
  
### 官方修复方案  
  
官方已发布漏洞通告，建议受影响的用户依据官方通告进行修复：  
  
https://httpd.apache.org/security/vulnerabilities_24.html  
### 临时缓解措施  
  
禁用HTTP/2协议：注释掉 http2 模块，同时注释掉 H2Direct 和 H2MaxSessionStreams  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdEOvmHw4gKFHvDljfhLx06ZwtP7zcArFhYOSEzqfXUibPkF9heqEPMpSZsIPV7I9lHjrO5LNeicb1HsTqCPicqSumK6vZstXUkiaxs4/640?wx_fmt=png&from=appmsg "")  
  
  
  
- END -  
**微步漏洞情报订阅服务**  
  
  
微步提供漏洞情报订阅服务，精准、高效助力企业漏洞运营：  
- 提供高价值漏洞情报，具备及时、准确、全面和可操作性，帮助企业高效应对漏洞应急与日常运营难题；  
  
- 可实现对高威胁漏洞提前掌握，以最快的效率解决信息差问题，缩短漏洞运营MTTR；  
  
- 提供漏洞完整的技术细节，更贴近用户漏洞处置的落地；  
  
- 将漏洞与威胁事件库、APT组织和黑产团伙攻击大数据、网络空间测绘等结合，对漏洞的实际风险进行持续动态更新  
。  
  
  
扫码在线沟通  
  
↓  
↓↓  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yv6ic9zgr5hQl5bZ5Mx6PTAQg6tGLiciarvXajTdDnQiacxmwJFZ0D3ictBOmuYyRk99bibwZV49wbap77LibGQHdQPtA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yv6ic9zgr5hTIdM9koHZFkrtYe5WU5rHxSDicbiaNFjEBAs1rojKGviaJGjOGd9KwKzN4aSpnNZDA5UWpY2E0JAnNg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
[点此电话咨询]()  
  
  
  
  
**X漏洞奖励计划**  
  
  
“X漏洞奖励计划”是微步X情报社区推出的一款  
针对未公开  
漏洞的奖励计划，我们鼓励白帽子提交挖掘到的0day漏洞，并给予白帽子可观的奖励。我们期望通过该计划与白帽子共同努力，提升0day防御能力，守护数字世界安全。  
  
活动详情：  
https://x.threatbook.com/v5/vulReward  
  
  
  
