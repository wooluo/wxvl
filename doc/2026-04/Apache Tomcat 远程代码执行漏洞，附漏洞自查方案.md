#  Apache Tomcat 远程代码执行漏洞，附漏洞自查方案  
原创 微步情报局
                    微步情报局  微步在线研究响应中心   2026-04-15 07:55  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fFyp1gWjicMKNkm4Pg1Ed6nv0proxQLEKJ2CUCIficfAwKfClJ84puialc9eER0oaibMn1FDUpibeK1t1YvgZcLYl3A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
漏洞概况  
  
  
Apache Tomcat是一款开源的Java Servlet容器和Web服务器，广泛用于部署和运行Java Web应用。  
  
近日，Apache Tomcat官方发布通告，修复了Apache Tomcat 远程代码执行漏洞（CVE-2026-34486）。  
微步情报局已成功复现。  
经分析，该漏洞源于针对CVE-2026-29146的修复引入了回归缺陷。在消息解密失败后，未能正确终止消息处理流程，而是继续调用 super.messageReceived(msg)，导致攻击者构造的未加密或加密错误的恶意消息能够绕过加密保护，直接进入 Tribes 集群的反序列化流程，  
若服务器类路径中存在可利用的反序列化链，则可实现远程代码执行。  
（完整漏洞情报请查阅https://x.threatbook.com/v5/vul/XVE-2026-12886）  
  
此漏洞利用条件  
较为苛刻，建议用户通过如下方案自查：  
  
1. 优先排查Tomcat版本  
  
2. 集群状态和EncryptIntercepto排查：  
检查是否启用了  
 Tribes   
集群并开启  
EncryptInterceptor  
，此组件默认不开启，可自查配置文件  
(  
默认路径  
$CATALINA_HOME/conf/server.xml)  
中是否存在集群配置关键字(如："  
SimpleTcpCluster  
")和EncryptInterceptor关键字(如：  
"encryptionKey=")  
  
3. 检查集群端口（Tribes Receiver 端口）开放情况  
  
  
建议受此漏洞影响用户  
尽快修复。  
  
漏洞处置优先级(VPT)  
  
  
**综合处置优先级：**  
中风险  
<table><tbody><tr><td rowspan="3" style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">基本信息</span></section></td><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;"><section><span leaf="">微步编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">XVE-2026-12886</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE-2026-34486</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">漏洞类型</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程命令执行</span></section></td></tr><tr><td rowspan="5" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用条件评估</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的网络条件</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要绕过安全机制</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">对被攻击系统的要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf=""><span textstyle="" style="font-size: 12px;">1.启用Tribes集群功能</span></span><span leaf=""><br/></span><span leaf=""><span textstyle="" style="font-size: 12px;">2.攻击者能够访问集群端口(默认于4000开放)</span></span><span leaf=""><br/></span><span leaf=""><span textstyle="" style="font-size: 12px;">3.集群通信配置EncryptInterceptor 拦截器</span></span><span leaf=""><br/></span><span leaf=""><span textstyle="" style="font-size: 12px;">4.目标服务器的Java类路径中存在可利用的反序列化链</span></span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的权限要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无须用户权限</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要受害者配合</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td rowspan="2" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用情报</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">POC是否公开</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">已知利用行为</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">暂无</span></section></td></tr></tbody></table>  
漏洞影响范围  
  
<table><tbody><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">产品名称</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">Apache Tomcat</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">受影响版本</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">9.0.116</span></section><section><span leaf="">10.1.53</span></section><section><span leaf="">11.0.20</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">有无修复补丁</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">有</span></section></td></tr></tbody></table>  
漏洞复现  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdEOaV0NwKH9UYDqiakLtyDKdJjoctOQSxg0Acc5Z5saOONQPicnN46n7P165rjgOg1ZicZJWB1wncIVCMjeb4iaNevoMlwLqS9VdJKM/640?wx_fmt=png&from=appmsg "")  
  
  
修复方案  
  
### 官方修复方案  
  
官方已发布修复方案，请访问链接下载：  
  
https://tomcat.apache.org/download-90.cgi  
  
https://tomcat.apache.org/download-101.cgi  
  
https://tomcat.apache.org/download-110.cgi  
### 临时缓解措施  
  
网络层面严格限制Tomcat集群通信端口的访问来源。  
  
微步产品支撑  
  
  
微步漏洞情报于  
2026-04-10  
收录该漏洞。  
  
微步下一代威胁情报平台NGTIP及X情报社区已于漏洞收录时向漏洞订阅用户推送该漏洞情报，并将持续推送后续更新；对于已经录入资产的用户，支持实时自动化排查受影响资产。  
  
微步威胁感知平台TDP、  
微步威胁防御系统OneSIG  
 Java反序列化攻击的通用规则默认可检出。  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/T4OSm0sXdEP5Ph6XbJXKtO3iaEsWrOian4mOjUYLuyeRzIx7TukgnFWh57icXd9KRmcZnsQ0gRVUpztCSL0E1DWMEM4eW9njneGXT5lGxPapkA/640?wx_fmt=png&from=appmsg "")  
  
  
  
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
  
  
  
