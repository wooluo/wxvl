#  新的“Dirty Frag”Linux漏洞可能在攻击中被利用  
会杀毒的单反狗
                    会杀毒的单反狗  爱拍照的老李   2026-05-12 01:01  
  
**导****读**  
  
  
  
也被称为 Copy Fail 2，被追踪为 CVE-2026-43284 和 CVE-2026-43500，该漏洞在补丁发布前就被公开了。  
  
  
最新披露的本地权限提升漏洞影响主流 Linux 发行版，该漏洞可能已被攻击者利用。该漏洞名为Dirty Frag and Copy Fail 2 ，利用了 CVE-2026-43284 和 CVE-2026-43500 两个漏洞，允许非特权用户将权限提升至 root。  
  
  
研究员 Hyunwoo Kim 负责任地披露了该漏洞，但有人在补丁发布之前将其公开，这促使 Kim 公布了技术细节和 PoC 代码。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/PaFY6wibdwyL5bQWrzI8OOARvXFz1X1rLMxS7SYD186oMMOeNVpDTrCTd5FjZrz9pHtiajayHfSCgqPGRwfc5yX4fKyEdnBiahyIen4ibib9nHibk/640?wx_fmt=png&from=appmsg "")  
  
  
“  
因为这是一个确定性的逻辑漏洞，不依赖于时间窗口，不需要竞争条件，当漏洞利用失败时内核不会崩溃，成功率非常高。  
”Kim解释说。  
  
  
这些漏洞影响Linux内核的xfrm-ESP（IPsec）和RxRPC组件，对未运行容器工作负载的主机影响最大。Ubuntu开发人员指出，在容器部署中，攻击者可能利用Dirty Frag漏洞逃离容器，但目前尚未证实这一点。  
  
  
Dirty Frag 与 2022 年出现的漏洞 Dirty Pipe 以及最近发现的名为Copy Fail 的漏洞类似。  
  
  
Copy Fail 漏洞已被实际利用，微软报告称 Dirty Frag 漏洞也可能已被利用。  
  
  
微软报告称，攻击者在获得目标系统的访问权限后即可利用 Dirty Frag 漏洞，而获得访问权限可以通过多种方式实现，包括被盗用的 SSH 帐户、通过暴露在互联网上的应用程序访问 web shell、滥用服务帐户、容器逃逸到主机环境或远程访问被攻破。  
  
  
微软表示，其 Defender 产品在实际应用中发现的漏洞活动有限，这可能表明 Dirty Frag 或 Copy Fail 漏洞已被利用。  
  
  
微软解释说：  
    
“攻击者获得提升的访问权限后，会修改 GLPI LDAP 身份验证文件（由 vim 生成的 .swp 文件证明），对 GLPI 目录和系统配置进行侦察，并检查漏洞利用工件。”  
  
  
“随后，该活动转向访问敏感数据并与 PHP 会话文件交互——首先删除多个会话文件，然后强制擦除其他会话文件——之后读取剩余的会话数据，这表明活动会话遭到破坏，并且访问了会话内容。”报告补充道。  
  
  
Linux 发行版已开始发布针对 Dirty Frag 的补丁和缓解措施，包括Red Hat、Amazon Linux、Ubuntu、Fedora和Alma Linux。  
  
  
完整漏洞公告：  
  
https://github.com/V4bel/dirtyfrag  
  
  
新闻链接：  
  
https://www.securityweek.com/new-dirty-frag-linux-vulnerability-possibly-exploited-in-attacks/  
  
****  
扫码关注  
  
军哥网络安全读报  
  
**讲述普通人能听懂的安全故事**  
  
  
