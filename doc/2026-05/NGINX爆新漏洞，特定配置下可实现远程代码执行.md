#  NGINX爆新漏洞，特定配置下可实现远程代码执行  
原创 微步情报局
                    微步情报局  微步在线研究响应中心   2026-05-14 03:50  
  
漏洞概况  
  
  
NGINX 是全球最流行的 Web 服务器和反向代理服务器，广泛应用于 API 网关与负载均衡等场景。  
  
微步情报局近期监控到NGINX远程代码执行漏洞（CVE-2026-42945）。  
微步情报局已成功复现。  
经分析，该漏洞存在于NGINX 的 ngx_http_rewrite_module 模块中。  
当满足特定条件时  
，未认证攻击者可通过构造 HTTP 请求触发 NGINX worker 进程堆缓冲区溢出，导致进程重启。  
若编译时禁用地址空间布局随机化  
，甚至可导致远程代码执行。（完整漏洞情报请查阅https://x.threatbook.com/v5/vul/XVE-2026-19557）  
  
  
漏洞利用需同时满足以下条件：  
  
1. 目标服务器的 nginx.conf 必须在同一个 location 或上下文中连续使用 rewrite 和 set 指令  
  
2. rewrite 指令的替换字符串中必须包含问号（?）  
  
3. 随后的 set 指令必须引用之前正则表达式捕获的变量（如 $1, $2 等）  
NGINX配置形如：  
```
location~ ^/api/(.*)$ {rewrite ^/api/(.*)$ /internal?migrated=true;set$original_endpoint$1;}
```  
  
此漏洞  
无需认证  
，攻击者成功利用此漏洞可  
导致 NGINX worker 进程发生堆缓冲区溢出并引发进程重启，在特定条件下可能进一步导致代码执行。  
建议受影响用户  
尽快修复。  
  
漏洞处置优先级(VPT)  
  
  
**综合处置优先级：**  
高风险  
<table><tbody><tr><td rowspan="3" style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">基本信息</span></section></td><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;"><section><span leaf="">微步编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">XVE-2026-19557</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE-2026-42945</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">漏洞类型</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程代码执行</span></section></td></tr><tr><td rowspan="5" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用条件评估</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的网络条件</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">远程</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要绕过安全机制</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">对被攻击系统的要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="2 2 []"><span leaf="">1. 目标服务器的 nginx.conf 必须在同一个 location 或上下文中连续使用 rewrite 和 set 指令</span></section><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="0 0 []"><span leaf="">2. rewrite 指令的替换字符串中必须包含问号（?）</span></section><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="0 0 []"><span leaf="">3. 随后的 set 指令必须引用之前正则表达式捕获的变量（如 $1, $2 等）</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的权限要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无需认证</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要受害者配合</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td rowspan="2" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用情报</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">POC是否公开</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><span style="color: #d93025;font-weight: bold;"><span leaf="">是</span></span></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">已知利用行为</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr></tbody></table>  
漏洞影响范围  
  
<table><tbody><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">产品名称</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">F5 Networks Inc. | Nginx Plus</span><span leaf=""><br/></span><span leaf="">F5 Networks Inc. | Nginx Open Source</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">受影响版本</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">Nginx Open Source：</span></section><section><span leaf="">0.6.27 &lt;= version &lt; 1.30.1</span><span leaf=""><br/></span><span leaf="">Nginx Plus：</span></section><section><span leaf="">R36 &lt;= version &lt; R36 P4</span></section><section><span leaf="">R32 &lt;= version &lt; R32 P6</span></section><section><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="0 0 []"><span leaf=""><br/></span></section></section><section><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="0 0 []"><span leaf=""><br/></span></section></section><section><section style="font-size: 15px;" segoe="" pingfang="" data-pm-slice="0 0 []"><span leaf=""><br/></span></section></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">有无修复补丁</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">有</span></section></td></tr></tbody></table>  
漏洞复现  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdEOLh79etlOK0gQwDAjy0rcAW7g3dRm3yq3gVZQvcNCfolC6LQJI68vViaAJooUS6mFRrtA3xMIXsmMHv60e0PMH6eQfZBRUpA4I/640?wx_fmt=png&from=appmsg "")  
  
修复方案  
  
### 官方修复方案  
  
官方已发布修复方案，请访问链接下载：  
  
https://my.f5.com/manage/s/article/K000161019  
### 临时缓解措施  
  
如无法立即升级，可调整 rewrite 配置：将所有受影响 rewrite 指令中的未命名捕获（$1、$2）替换为命名捕获  
  
微步产品支撑  
  
  
微步漏洞情报于  
2026年  
5月13日  
收录该漏洞。  
  
微步下一代威胁情报平台NGTIP及X情报社区已于漏洞收录时向漏洞订阅用户推送该漏洞情报，并将持续推送后续更新；对于已经录入资产的用户，支持实时自动化排查受影响资产。  
  
微步威胁感知平台TDP已于  
20260514  
支持检测，检测ID：  
S3100175119，  
模型/规则高于：  
20260514000000   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdEOJtib1N1lZGX9CVrYBl1gvgFHwQmc9XZFwYdDxOZu7COM90h03CV0LFvcKiciciblw8suMqiaFOBqKCo3OlCGdquTD3UsBHIBzqD0M/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
