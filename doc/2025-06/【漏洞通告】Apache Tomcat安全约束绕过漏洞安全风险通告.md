#  【漏洞通告】Apache Tomcat安全约束绕过漏洞安全风险通告  
 嘉诚安全   2025-06-18 00:43  
  
**漏洞背景**  
  
  
  
  
  
  
  
  
近日，嘉诚安全  
监测到  
Apache Tomcat安全约束绕过漏洞，漏洞编号为：  
CVE-2025-49125  
。  
  
  
Apache Tomcat是一个开源的Java Servlet容器和Web服务器，主要用于运行Java应用程序，特别是基于Servlet和JSP技术的应用。它由Apache软件基金会开发，广泛应用于Web开发和企业级应用程序中，支持Servlet、JSP以及WebSocket等技术，具有高性能、可扩展性和可靠性。  
  
  
鉴于漏洞危害较大，嘉诚安全提醒相关用户尽快更新至安全版本，避免引发漏洞相关的网络安全事件。  
  
**漏洞详情**  
  
  
  
  
  
  
  
  
经研判，该漏洞为  
**高危**  
漏洞，POC/EXP  
**已公开**  
。  
当PreResources或PostResources被挂载在Web应用根目录之外时，攻击者可能通过非预期路径访问这些资源，从而绕过原本应保护这些资源的安全约束。  
  
**危害影响**  
  
  
  
  
  
  
  
  
影响版本：  
  
11.0.0-M1 ≤ Apache Tomcat ≤ 11.0.7  
  
10.1.0-M1 ≤ Apache Tomcat ≤ 10.1.41  
  
9.0.0-M1 ≤ Apache Tomcat ≤ 9.0.105  
  
**处置建议**  
  
  
  
  
  
  
  
  
1.升级版本  
  
建议升级Apache Tomcat至11.0.8、10.1.42或9.0.106以上版本，并确保PreResources和PostResources正确挂载，避免绕过安全约束。  
  
下载链接：  
  
https://tomcat.apache.org/  
  
2.通用建议  
  
定期更新系统补丁，减少系统漏洞，提升服务器的安全性。  
  
加强系统和网络的访问控制，修改防火墙策略，关闭非必要的应用端口或服务，减少将危险服务（如SSH、RDP等）暴露到公网，减少攻击面。  
  
使用企业级安全产品，提升企业的网络安全性能。  
  
加强系统用户和权限管理，启用多因素认证机制和最小权限原则，用户和软件权限应保持在最低限度。  
  
启用强密码策略并设置为定期修改。  
  
3.参考链接  
  
https://lists.apache.org/thread/m66cytbfrty9k7dc4cg6tl1czhsnbywk  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1t8LLTibEW5NtxqlBL1HLib8jMO0PWtibWTWTFPOa3ND1lyaEQyBgp2fodg9A1XxvPjY7L6ILtK26MBGhofWE0ORw/640?wx_fmt=png&wx_ "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/sDiaO8GNKJrJnzIYoQAv2nF3pgKm4SgdFkzuniaicBHQxgSdu0U0xyYbNDOcNkDMWCjwJNwKnic9ASAhhxEpkFL6lg/640?wx_fmt=gif&wx_ "")  
  
  
