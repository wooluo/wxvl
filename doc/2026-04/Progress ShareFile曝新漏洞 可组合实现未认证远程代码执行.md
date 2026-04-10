#  Progress ShareFile曝新漏洞 可组合实现未认证远程代码执行  
胡金鱼
                    胡金鱼  嘶吼专业版   2026-04-10 06:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wpkib3J60o297rwgIksvLibPOwR24tqI8dGRUah80YoBLjTBJgws2n0ibdvfvv3CCm0MIOHTAgKicmOB4UHUJ1hH5g/640?wx_fmt=gif "")  
  
安全研究人员最新发现，企业级安全文件传输解决方案 Progress ShareFile 存在两处漏洞，攻击者可将其组合利用，在无需身份认证的情况下从受影响环境中窃取文件。Progress ShareFile 是一款文档共享与协作产品，广泛应用于大中型企业。  
  
此类文件传输平台历来是勒索软件团伙的重点攻击目标，此前 Clop 勒索组织就曾利用 Accellion FTA、SolarWinds Serv-U、Gladinet CentreStack、GoAnywhere MFT、MOVEit Transfer、Cleo 等产品中的漏洞实施大规模数据窃取攻击。   
  
watchTowr 的研究人员在 Progress ShareFile 5.x 分支的 Storage Zones Controller（SZC，存储区域控制器）组件中，发现了一处认证绕过漏洞（CVE-2026-2699）和一处远程代码执行漏洞（CVE-2026-2701）。  
  
存储区域控制器（SZC）允许用户将数据存储在自有基础设施（本地或第三方云）或 Progress 官方系统中，从而让客户对数据拥有更强的控制权。  
  
在 watchTowr 完成负责任漏洞披露后，Progress 已发布 ShareFile 5.12.4 版本，修复了上述问题。  
# 攻击原理  
  
watchTowr 研究人员在最新发布的报告中介绍，整个攻击链首先利用 CVE-2026-2699 认证绕过漏洞。由于系统对 HTTP 重定向处理不当，攻击者可直接访问 ShareFile 管理后台界面。   
  
获取权限后，攻击者可修改存储区域配置，包括文件存储路径、区域密钥及相关敏感安全参数。   
  
随后，攻击者可利用第二个漏洞 CVE-2026-2701，通过滥用文件上传与解压功能，将恶意 ASPX 网页后门放置在应用根目录，从而在服务器上实现远程代码执行。  
  
研究人员指出，要成功利用漏洞，攻击者需要生成合法的 HMAC 签名，并提取和解密内部密钥。但在成功利用 CVE-2026-2699 之后，攻击者可设置或控制与密钥相关的配置项，上述步骤均可实现。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HLSjMSJVtQYcy5okViasFEQSGZeNpFeHia3h0YU3Ycu6KYic4AMYC6bKmG4QLp9ibg2VyTTaEibh41g9MMQj1lzyx3E3sakBKqJgsew/640?wx_fmt=png&from=appmsg "")  
  
漏洞利用链概述  
# 影响范围与暴露情况  
  
根据 watchTowr 的扫描结果，约有 3 万个存储区域控制器实例暴露在公网。ShadowServer 基金会监测到约 700 台可公网访问的 Progress ShareFile 实例，其中大部分位于美国和欧洲地区。   
  
watchTowr 于 2 月 6 日至 13 日期间发现这两处漏洞并上报给 Progress 公司，并于 2 月 18 日验证了完整攻击链可在 ShareFile 5.12.4 之前版本生效。厂商已于 3 月 10 日在 5.12.4 版本中推送安全更新。  
  
截至本文发布，暂未发现野外在野利用行为。但由于漏洞细节已公开，极易吸引攻击者跟进利用，因此运行存在漏洞的 ShareFile 存储区域控制器版本的系统应立即安装补丁。  
  
参考及来源：  
https://www.bleepingcomputer.com/news/security/new-progress-sharefile-flaws-can-be-chained-in-pre-auth-rce-attacks/  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HIFjz9ncyJLmXiceNZcQUSF3IBDqiaOiaITRKnFcamiaPtlwxIcZVPpfWQMUXh3W7Hiarb4nTZzLnk6v4TTM8z4Pqp2N3x2o8ueFcpw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/fHEm7hZn9HLgLCzoGSTmtOYib7XxPDdyS5ibSFfnbvT7VXiaLhLak7KG0ObtsyKE9gMibk3JHjib46lthI5ABiayr98CATDUduZQxoexmWyROg5l4/640?wx_fmt=png&from=appmsg "")  
  
  
  
