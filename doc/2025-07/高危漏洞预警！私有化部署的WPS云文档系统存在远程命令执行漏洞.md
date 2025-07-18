#  高危漏洞预警！私有化部署的WPS云文档系统存在远程命令执行漏洞  
知道创宇  知道创宇   2025-07-18 02:35  
  
2025年7月17日，创宇安全智脑通过威胁监测平台发现，私有化部署的WPS云文档系统（WPS文档中心 - 多人实时协作的在线Office）中存在远程命令执行（RCE）漏洞。攻击者可通过未授权访问获取关键配置信息并利用特定接口执行任意命令，可能导致系统完全被接管。  
  
金山软件股份有限公司为中国领先的应用软件产品和服务供应商，旗下产品WPS Office应用广泛， 覆盖了政务、教育、金融、制造、能源等各行业。WPS云文档是金山软件股份有限公司开发的一款在线办公平台，可以实现文档的在线编辑、分享和存储，广泛应用于政府单位和大型企业的日常办公中。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Oan15mBs7fNt7oe9sATXGkjshv8gZL8q0XRiaXx0JgNU4j5b7SQcejTJrCicPhahibW5TDWTHXCtYA0u31cExXulg/640?wx_fmt=png&from=appmsg "")  
  
  
**1.漏洞危害**  
  
  
  
****  
攻击者可通过未授权访问获取系统AK/SK配置信息，结合脚本添加路由映射并向目标POD发起通信，最终实现远程命令执行，可能导致敏感数据泄露、系统控制权丧失或恶意代码植入。  
  
  
**2.影响范围**  
  
  
  
****  
使用ZoomEye网络空间测绘引擎探测（搜索语法：app="WPS云文档"）发现全球范围内存在112条结果，主要分布在中国。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Oan15mBs7fNClQXMSmAZ2icickcX6Cn7T3OEendPBNW49ZgMEhoJgIicIMHtGatYia6DMGicFnbWBhQIYeK5d7VGNzw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Oan15mBs7fNClQXMSmAZ2icickcX6Cn7T3fe99wleofxlYTPRtoLroqmaUuZrXeNRkQfvHuxzJibHWyL6iaNc7pzQA/640?wx_fmt=png&from=appmsg "")  
  
  
**3.受影响版本**  
  
  
  
****- v6.0.2205<=WPS文档中台版本<v7.1.2405  
  
- v7.0.2306b<=WPS文档中心版本<v7.0.2405b  
  
  
**4.修复建议**  
  
  
  
****- 立即检查系统配置：确认是否存在未授权访问的接口，限制对 /open/v6/api/etcd/operate 等敏感接口的访问。  
  
- 升级系统版本：联系WPS官方获取最新补丁或固件版本，升级至已修复该漏洞的版本。  
  
  
**知道创宇多款产品均已支持检测**  
  
知道创宇多款产品均已更新该漏洞检测插件，助力客户快速排查，定位风险资产。  
  
  
**ZoomEye 互联网攻击面管理平台**  
  
是面向党政机关、央企国企、金融、能源及其他企事业单位提供的网络安全风险暴露面收敛产品，以安全大数据为驱动，从攻击者视角审视互联网资产暴露面与脆弱性的SaaS产品，为客户提供持续全量资产发现与管理、风险监测与治理能力，实现互联网攻击面的梳理与收敛，成为网络安全合规与实战对抗中不可或缺的安全保护手段。只需完成授权，2分钟即可接入平台，获取单位整体攻击面。  
  
官网介绍  
：  
https://easm.zoomeye.org/easm  
  
  
**ZoomEye Pro**  
  
是面向企事业单位研发的一款网络资产扫描与管理系统。采用对全球测绘10余年的ZoomEye同款主动探测引擎，结合被动探测引擎，以及与ZoomEye云地联动的方式，能够全面采集内外网资产并统一管理。基于SeeBug漏洞平台、创宇安全智脑的能力，能够快速更新高威胁漏洞插件并对全部资产进行漏洞影响面分析。具备资产发现能力快速精准、资产指纹信息丰富、资产分类清晰直观、漏洞响应能力强的特点。帮助客户从攻击者视角持续发现内外网资产以及高风险问题，有效降低安全风险。  
  
官网介绍  
：  
https://scanv.yunaq.com/zp/index.html  
  
  
**ScanV**  
  
为网站及业务系统提供全生命周期的外部攻击面管理（EASM）能力，从攻击者视角出发，开展漏洞监测、漏洞响应、漏洞预警等深度漏洞治理工作，实时更新漏洞情报数据，持续性跟踪风险、快速定位威胁。  
  
官网介绍：  
https://www.scanv.com  
  
  
**WebSOC**  
  
是面向行业区域监管机构、集团信息中心量身定制的能大范围快速发现高危Web漏洞及安全事件的硬件监测系统，产品具备扫描快、结果准、取证全的核心特质，能帮助客户快速、全面发现其管辖区域内的安全事件，生成完整通报证据链，方便通报到相关单位以促使其快速整改，帮助监管机构有效履行监管职责。  
  
官网介绍：  
https://scanv.yunaq.com/websoc/index.html  
  
**如有ZoomEye互联网攻击面管理平台、ZoomEye Pro、ScanV、WebSOC等业务需求，请联系您的专属商务经理或扫一扫下方二维码联系：**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Oan15mBs7fNt7oe9sATXGkjshv8gZL8qBhzYoQKSIMiaycbPEF1LetHzYEicKRibNEqOiaaZq73Ls9JOKyeeGH7Giag/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
点击**阅读原文**  
，查看官网介绍  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/Oan15mBs7fPELDJ7ZBVtMNoJOH9ficsJhMNc9SFnBXxI1qWCicKUo05dcaryZnqGOgx4oHptpQGlxW8YIunHK6Wg/640?wx_fmt=gif&from=appmsg&wxfrom=10005&wx_lazy=1&tp=webp "")  
  
  
