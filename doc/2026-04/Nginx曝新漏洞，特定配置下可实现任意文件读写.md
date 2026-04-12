#  Nginx曝新漏洞，特定配置下可实现任意文件读写  
原创 微步情报局
                    微步情报局  微步在线研究响应中心   2026-04-11 08:45  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fFyp1gWjicMKNkm4Pg1Ed6nv0proxQLEKJ2CUCIficfAwKfClJ84puialc9eER0oaibMn1FDUpibeK1t1YvgZcLYl3A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
  
漏洞概况  
  
  
Nginx是一款轻量级的高性能Web服务器和反向代理服务器。ngx_http_dav_module 是 Nginx 的一个内置 HTTP WebDAV 模块，用来让客户端通过 HTTP 方法直接操作服务器上的文件和目录。  
  
微步情报局于今日监控到Ngnix ngx_http_dav_module模块缓冲区溢出漏洞（CVE-2026-27654）。微步情报局已成功复现。当Nginx配置同时满足以下条件时，攻击者可以通过特制请求触发缓冲区溢出：  
  
  
1. location 是普通前缀块  
  
2. 开启 dav_methods COPY/MOVE   
  
3. 使用alias指令来映射本地目录  
  
  
经分析，  
ngx_http_dav_module模块非默认安装，且漏洞  
依赖特殊配置，可能实际影响资产数量较为有限。但由于该漏洞aarch64架构上的利用脚本已公开，且能造成任意文件读写，建议用户自查当前Nginx配置是否满足上述利用条件，如果确认受影响请尽快修复。  
  
（完整自查方案请查阅微步漏洞情报：https://x.threatbook.com/v5/vul/XVE-2026-9305）  
  
漏洞处置优先级(VPT)  
  
  
**综合处置优先级：中**  
风险  
<table><tbody><tr><td rowspan="3" style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">基本信息</span></section></td><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;"><section><span leaf="">微步编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">XVE-2026-9305</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE-2026-27654</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">漏洞类型</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">缓冲区溢出</span></section></td></tr><tr><td rowspan="5" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用条件评估</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的网络条件</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要绕过安全机制</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">对被攻击系统的要求</span></section></td><td><section><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;">1.需要使用ngx_http_dav_module模块</span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;"><br/></span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;">2. 必须允许COPY或MOVE方法</span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;"><br/></span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;">3. 必须使用alias指令来映射本地目录</span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;"><br/></span><span leaf="" style="color: rgb(217, 48, 37);font-weight: bold;">4. location配置中必须存在一个普通的、非正则表达式的URI前缀匹配块</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的权限要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无需用户权限</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要受害者配合</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td rowspan="2" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用情报</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">POC是否公开</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><span style="color: #d93025;font-weight: bold;"><span leaf="">是</span></span></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">已知利用行为</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">暂无</span></section></td></tr></tbody></table>  
漏洞影响范围  
  
<table><tbody><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">产品名称</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">F5 | NGINX</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">受影响版本</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">开源版</span><p style="margin-left: 0;padding: 0;line-height: 1.6em;margin-bottom: 24px;margin-top: 24px;"><span leaf="">0.5.13 &lt;= version &lt;= 0.9.7</span><span leaf=""><br/></span><span leaf="">1.0.0 &lt;= version &lt; 1.28.3</span><span leaf=""><br/></span><span leaf="">1.29.0 &lt;= version &lt; 1.29.7</span></p><p style="margin-left: 0;padding: 0;line-height: 1.6em;margin-bottom: 24px;margin-top: 24px;"><span leaf="">商业版</span></p><p style="margin-left: 0;padding: 0;line-height: 1.6em;margin-bottom: 24px;margin-top: 24px;"><span leaf="">R36 分支：R36 &lt;= version &lt; R36 P3</span><span leaf=""><br/></span><span leaf="">R35 分支：R35 &lt;= version &lt; R35 P2</span><span leaf=""><br/></span><span leaf="">R34 分支：所有版本</span><span leaf=""><br/></span><span leaf="">R33 分支：所有版本</span><span leaf=""><br/></span><span leaf="">R32 分支：R32 &lt;= version &lt; R32 P5</span></p></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">有无修复补丁</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">有</span></section></td></tr></tbody></table>  
漏洞复现  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/T4OSm0sXdEMu32CWIFc0Zw2leDsibAtQiaQs0GyjduclCL2OiaVgZ3f7SV9J7qYbWtgDVZreVh0sKONAejOCg7EIAxBYwFdVhGUZFFN0cibEDfs/640?wx_fmt=png&from=appmsg "")  
  
由上图可见成功读取/etc/passwd文件  
  
修复方案  
  
### 官方修复方案  
  
官方已发布修复方案，请访问链接下载：  
  
https://my.f5.com/manage/s/article/K000160382  
### 临时缓解措施  
  
修改nginx.conf中对应的location块，在dav_methods中禁用COPY和MOVE方法，配置方式如下所示：  
  
  
1. 将nginx.conf中dav_methods COPY; 修改为 dav_methods PUT DELETE MKCOL;  
  
2. 检查Nginx配置：nginx -t -c /tmp/lab/nginx.conf -p /tmp/lab/  
  
3. 重启 Nginx：nginx -s reload  
  
微步产品支撑  
  
  
微步漏洞情报于  
2026-03-24  
收录该漏洞。  
  
微步下一代威胁情报平台NGTIP及X情报社区已于漏洞收录时向漏洞订阅用户推送该漏洞情报，并将持续推送后续更新；对于已经录入资产的用户，支持实时自动化排查受影响资产。  
  
微步威胁感知平台TDP通用规则默认可检出。  
  
  
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
  
  
  
