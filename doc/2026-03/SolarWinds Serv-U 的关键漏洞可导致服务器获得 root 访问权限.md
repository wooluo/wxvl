#  SolarWinds Serv-U 的关键漏洞可导致服务器获得 root 访问权限  
Rhinoer
                    Rhinoer  犀牛安全   2026-03-23 22:22  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vO1zY1O9p8K4ufNjDwg68EnU5icqGTBcapiarDtLM7fvzASyL4xhnF4X6uUmYL70Z0kydnC1OgomIOXZ5zg7e1bLTlnoTd2p0wfYFQ7BzXPeI/640?wx_fmt=png&from=appmsg "")  
  
SolarWinds 发布了安全更新，修复了四个严重的 Serv-U 远程代码执行漏洞，这些漏洞可能使攻击者获得对未打补丁服务器的 root 访问权限。  
  
Serv-U 是该公司的自托管 Windows 和 Linux 文件传输软件，它同时具备托管文件传输 (MFT) 和 FTP 服务器功能，使组织能够通过 FTP、FTPS、SFTP 和 HTTP/S 安全地交换文件。  
  
SolarWinds 今天在 Serv-U 15.5.4 中修复的四个安全漏洞中，最严重的漏洞是 CVE-2025-40538，它允许具有高权限的攻击者获得易受攻击服务器上的 root 或 admin 权限。  
  
SolarWinds在周二发布的一份公告中表示：“Serv-U中存在一个访问控制漏洞，一旦被利用，攻击者就可以创建系统管理员用户，并通过域管理员或组管理员权限以root身份执行任意代码。”  
  
该公司还修复了两个类型混淆漏洞和一个不安全的直接对象引用 (IDOR) 漏洞，该漏洞可被利用以获得 root 权限来执行代码。  
  
幸运的是，这四个安全漏洞都要求攻击者已经拥有目标服务器上的高级权限，这将限制潜在的利用尝试，使其仅限于攻击者可以链接权限提升漏洞或使用先前窃取的管理员凭据的情况。  
  
Shodan 目前追踪到超过 12,000 台暴露于互联网的 Serv-U 服务器，而 Shadowserver 估计这个数字不到1,200 台。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vO1zY1O9p8JOicN0Kc4Y2ffnniaZ6TMicH7O0yAicuA9vibxeZjbsFkYSTMFm0FKAGILbkADI2WJyjajia6NiaqpuK4c7jxBA9mecjCVh3eUYf0pOA/640?wx_fmt=png&from=appmsg "")  
  
像 SolarWinds Serv-U 这样的文件传输软件经常成为攻击目标，因为它提供了对可能包含敏感的公司和客户数据的文档的便捷访问。  
  
在过去的五年里，多个网络犯罪组织和国家支持的黑客组织针对 Serv-U 漏洞发动了数据窃取攻击，其中 Clop 团伙利用 Serv-U Secure FTP 远程代码执行漏洞 (CVE-2021-35211) 入侵企业网络，发动勒索软件攻击。  
  
总部位于某国的黑客（微软追踪的编号为 DEV-0322）主要以美国国防和软件公司为攻击目标，他们从 2021 年 7 月开始，利用 CVE-2021-35211 漏洞发起零日攻击。  
  
最近，在 2024 年 6 月，网络安全公司 Rapid7 和 GreyNoise 指出 SolarWinds Serv-U 路径遍历漏洞 (CVE-2024-28995)已被威胁行为者利用公开可用的概念验证 (PoC) 漏洞进行积极利用。  
  
美国网络安全和基础设施安全局 (CISA) 目前正在追踪 SolarWinds 的九个安全漏洞，这些漏洞要么已经被利用，要么仍在被积极利用。  
  
  
信息来源：B  
leepingComputer  
  
