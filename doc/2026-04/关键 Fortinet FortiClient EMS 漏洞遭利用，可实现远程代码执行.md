#  关键 Fortinet FortiClient EMS 漏洞遭利用，可实现远程代码执行  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-04-01 01:20  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DYqn7TU9icq1ydicE2kx4bnjSfiaxcBPeZfBARqnibyjicpBoibribzEWf6e5lUYmAxGiaoMKDHLiaQCAqlNmC82bIgyUy5qmYWiak9f4NX7ypjVKiaTP4/640?wx_fmt=png&from=appmsg "")  
  
一项被追踪为 **CVE-2026-21643**（CVSS 评分为 9.1）的 Fortinet FortiClient EMS 关键漏洞，目前正遭到积极利用。  
  
Defused 研究人员警告称，威胁行为者正在利用 Fortinet FortiClient EMS 平台中的这一漏洞。  
  
Defused 在 X 平台上发文表示：“Fortinet Forticlient EMS CVE-2026-21643——目前在美国网络安全和基础设施安全局（CISA）及其他已知被利用漏洞（KEV）列表中仍标记为未被利用——但根据我们的数据，首次利用早在 4 天前就已发生。攻击者可以通过 HTTP 请求中的‘Site’标头夹带 SQL 语句。根据 Shodan 的数据，近 1000 个 Forticlient EMS 实例暴露在公网。”  
  
今年 2 月，Fortinet 发布紧急公告，修复了这一关键的 FortiClientEMS 漏洞。该漏洞属于 FortiClientEMS 中对 SQL 命令中特殊元素的中和不当问题（即“SQL 注入”）。未经身份验证的攻击者可利用该漏洞，通过特制的 HTTP 请求执行未经授权的代码或命令。  
  
公告指出：“FortiClientEMS 中存在一个对 SQL 命令中特殊元素的中和不当漏洞（SQL 注入，CWE-89），可能允许未经身份验证的攻击者通过特制的 HTTP 请求执行未经授权的代码或命令。”  
  
攻击一旦成功，攻击者便可在目标网络中获得初始立足点，进而进行横向移动或部署恶意软件。  
  
该漏洞由 Fortinet 产品安全团队的 Gwendal Guégniaud 在内部发现并报告。  
  
受影响版本如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DYqn7TU9icq1by35AW9x87zdpKAJicRGxZZ7EYLibMRgZ6bd3Bg1pK7qD1sAKU8X7BVdsMf5DVpYH66LMBXRJHW9mcmdWYuKo4dV5vEhLGh0KM/640?wx_fmt=png&from=appmsg "")  
  
今年 2 月，Fortinet 并未透露该漏洞是  
否已在野外被积极利用。  
  
尽管该漏洞尚未出现在主要的已知被利用漏洞列表中，但现实中的攻击已被观察到。  
  
Shadowserver 研究人员报告称，约有 2000 个 F  
ortiClient EMS 实例暴露在网上，其中大部分位于美国（756 个）和欧洲（683 个）。  
  
2024 年 3 月，美国网络安全和基础设施安全局（CISA）曾将另一个 FortiClient EMS SQL 注入漏洞（CVE-2023-48788）列入其已知被利用漏洞（KEV）目录。  
  
  
