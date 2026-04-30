#  Linux提权漏洞！10行代码直接root  
原创 微步情报局
                    微步情报局  微步在线研究响应中心   2026-04-30 02:14  
  
漏洞概况  
  
  
微步情报局监测到，Linux Kernel 被披露存在本地权限提升漏洞，漏洞编号 CVE-2026-31431，代号 “Copy Fail”。该漏洞源于内核 crypto: algif_aead 模块在处理 AEAD操作时的逻辑缺陷，可导致本地低权限攻击者通过 AF_ALG 加密接口向任意可读文件的页缓存（page cache）写入受控的少量数据（PoC 中为 4 字节块），进而篡改 setuid 等特权二进制文件，  
实现本地权限提升至 root。  
  
目前该漏洞细节及 PoC 已公开，  
利用门槛极低（仅需约 10 行 Python 脚本），影响过去 9 年内大多数主流 Linux 发行版，对云服务器、容器宿主机、多租户环境等构成较高风险。  
  
目前已知的影响面有：  
  
**1. 共享服务器（开发机、跳板机、构建服务器）**  
：任意普通用户即可直接提权为 root  
  
2.  
Kubernetes 和容器集群  
：单个被攻破的 Pod 可逃逸至宿主机  
  
**3. CI/CD 执行器（GitHub Actions、GitLab Runner、Jenkins 等）**  
：恶意 Pull Request 可直接获得 Runner 的 root 权限  
  
**4. 运行用户代码的云平台（Notebook、Agent 沙箱、Serverless 函数等）**  
：租户可直接提升至宿主机 root 权限  
  
建议受影响的用户尽快修复。  
  
漏洞处置优先级(VPT)  
  
  
**综合处置优先级：**  
中风险  
<table><tbody><tr><td rowspan="3" style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">基本信息</span></section></td><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;"><section><span leaf="">微步编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">XVE-2026-15008</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE编号</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">CVE-2026-31431</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">漏洞类型</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">权限提升</span></section></td></tr><tr><td rowspan="5" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用条件评估</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的网络条件</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">本地访问</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要绕过安全机制</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">对被攻击系统的要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">无特殊要求</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">利用漏洞的权限要求</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">低权限</span></section></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">是否需要受害者配合</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">否</span></section></td></tr><tr><td rowspan="2" style="border: 1px solid #ddd;padding: 12px;vertical-align: top;font-weight: bold;background-color: #f8f9fa;"><section><span leaf="">利用情报</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">POC是否公开</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><span style="color: #d93025;font-weight: bold;"><span leaf="">是</span></span></td></tr><tr><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">已知利用行为</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">暂无</span></section></td></tr></tbody></table>  
漏洞影响范围  
  
<table><tbody><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">产品名称</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">Linux Kernel</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">受影响版本</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">commit 72548b093ee3 &lt;=version&lt; commit a664bf3d603d</span></section></td></tr><tr><td style="border: 1px solid rgb(221, 221, 221);padding: 12px;vertical-align: top;font-weight: bold;background-color: rgb(248, 249, 250);"><section><span leaf="">有无修复补丁</span></section></td><td style="border: 1px solid #ddd;padding: 12px;vertical-align: top;"><section><span leaf="">有</span></section></td></tr></tbody></table>  
漏洞复现  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/T4OSm0sXdEOwWA6nvV4AWa4SnBneTNmkksP40kgpdicoGvfXuLga6PgFTYYcZYdGOj23xYkOPFEicXNsvGnK4libVO9B5lDmgP2CxicoOdJ2Dic0/640?wx_fmt=png&from=appmsg "")  
  
修复方案  
  
### 官方修复方案  
  
官方已发布修复方案，请访问链接下载：  
  
https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
  
微步产品支撑  
  
  
微步漏洞情报于  
2026-04-22  
收录该漏洞。  
  
微步下一代威胁情报平台NGTIP及X情报社区已于漏洞收录时向漏洞订阅用户推送该漏洞情报，并将持续推送后续更新；对于已经录入资产的用户，支持实时自动化排查受影响资产。  
  
  
