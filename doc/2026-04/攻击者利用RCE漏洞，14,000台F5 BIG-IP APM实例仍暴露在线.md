#  攻击者利用RCE漏洞，14,000台F5 BIG-IP APM实例仍暴露在线  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-04-07 01:11  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DYqn7TU9icq0T7EvrRofexkHblAcicnobkLgsT6ia2zyZ1w3nKjibVIeQMXhNq5KZgEJqtViahawRaV4DiclO19QmX7z6wickRzD7fCMXcZC5ibdiay0/640?wx_fmt=png&from=appmsg "")  
  
非营利安全组织Shadowserver警告称，超过14,000台F5 BIG-IP APM实例仍暴露在线，攻击者正在积极利用关键远程代码执行漏洞CVE-2025-53521（CVSS 3.1评分9.8）。  
  
BIG-IP APM中的漏洞允许特制恶意流量在虚拟服务器上启用访问策略时触发远程代码执行（RCE）。  
  
研究人员在五个月前的10月报告了该漏洞。该漏洞此前被归类为拒绝服务（DoS）问题，根据2026年3月的新发现，已重新归类为关键远程代码执行（RCE）漏洞。其严重性显著增加，CVSS评分更高。原始修复仍然有效，但该漏洞已在易受攻击的BIG-IP版本中被积极利用。  
  
Shadowserver现在报告追踪超过14,100个具有F5 BIG-IP APM指纹的IP暴露在线，其中大多数位于美国（5138）、欧洲（4750）和亚洲（2689）。目前尚不清楚其中有多少实际上易受攻击利用。  
  
3月底，美国网络安全和基础设施安全局（CISA）将F5 BIG-IP AMP中的漏洞添加到其已知被利用漏洞（KEV）目录中。CISA命令联邦机构在2026年3月30日之前修复该漏洞。  
  
  
