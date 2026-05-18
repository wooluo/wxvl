#  漏洞预警 CVSS 8.1 【严重】Exchange Server OWA 在野 0day：一封邮件即可劫持会话  
原创 爱坤
                    爱坤  爱坤sec   2026-05-18 18:30  
  
# 一 漏洞描述  
  
Microsoft Exchange Server Outlook Web Access (OWA) 存在跨站脚本（XSS）漏洞，攻击者只需发送一封特制邮件，当目标用户在 OWA 中打开该邮件并满足特定交互条件时，即可在浏览器上下文中执行任意 JavaScript，实现欺骗攻击与会话劫持。该漏洞已确认在野利用，CISA 已纳入 KEV 清单要求 2026-05-29 前完成处置。CVSS 评分 8.1。  
  
CVSS 评分 8.1  
# 二 影响版本  
```
Microsoft Exchange Server 2016（任意累积更新）
Microsoft Exchange Server 2019（任意累积更新）
Microsoft Exchange Server Subscription Edition (SE)
Exchange Online 不受影响。
```  
  
# 三 搜索语法  
```
app="Microsoft-Exchange"
```  
  
  
四 利用脚本  
```
暂未有poc，关注爱坤，获取一手情报
```  
  
五 搜索语法  
  
exchange的含金量我就不用说吧  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/uqtLGQlJSxX7kSIPMlEibibpBtyHmTlkLkxR2UGAcRVaAn8icrc5SicdwCxnkBcSELP9KovZxgtsib54ribXicGmlgD1XYMFYnuZuN5K8rdZxuiaZMQ/640?wx_fmt=png&from=appmsg "")  
  
【严重声明】本文所涉及的工具、思路和操作手法仅用于本地安全测试以及教育目的，禁止将其用于非法入侵或对他人的系统进行攻击以及盈利，一切后果由操作者自行承担！！！下载后的24小时请删除。  
  
更多精彩文章与工具分享 欢迎关注  
  
