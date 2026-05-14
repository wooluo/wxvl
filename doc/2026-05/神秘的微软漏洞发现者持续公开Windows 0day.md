#  神秘的微软漏洞发现者持续公开Windows 0day  
会杀毒的单反狗
                    会杀毒的单反狗  爱拍照的老李   2026-05-14 01:01  
  
**导****读**  
  
  
  
今年已经恶意曝光三个 Windows   
0day  
漏洞的匿名安全研究人员，在微软  
5  
月补丁日更新之后，又曝光了两个新的漏洞，攻击者可以利用这些漏洞获得 SYSTEM 权限。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/PaFY6wibdwyKCvcLUJZh6btNBWnbfOfkibhiaO0s86jUGicNXED3NV3prIZJN6hNBhkjtDqeR9w7Pf6lgicH9HvoMDIV2hAiciccq8gGhR0AFFFib8M/640?wx_fmt=jpeg&from=appmsg "")  
  
  
Nightmare-Eclipse（或 Chaotic Eclipse，取决于你更喜欢哪个别名）公布了 YellowKey和GreenPlasma的详细信息 ——分别是 BitLocker 绕过漏洞和权限提升漏洞，攻击者可以利用这些漏洞获得 SYSTEM 访问权限。  
  
  
接受《The Register》采访的专家警告说，这两个漏洞都存在严重的安全隐患，尤其是 Nightmare-Eclipse 还发布了大量关于如何利用这些漏洞的技术信息。  
  
  
Nightmare-Eclipse 将 YellowKey 描述为“我发现过的最疯狂的发现之一”。他们提供了这些文件，这些文件必须加载到 U 盘上，如果攻击者正确完成密钥序列，他们就能获得对受 BitLocker 保护的计算机的完全 shell 访问权限。  
  
  
这个漏洞需要实际接触到Windows电脑，BitLocker是Windows针对物理接触设备的最后一道防线，绕过这项技术就等于能够访问加密文件。  
  
  
尽管需要物理访问，但 Bridewell 的网络威胁情报首席负责人 Gavin Knapp 告诉The Register，YellowKey 仍然是“使用 BitLocker 的组织面临的巨大安全问题”。  
  
  
他援引网络威胁情报圈内共享的信息补充说，可以通过实施 BitLocker PIN 码和 BIOS 密码锁定来缓解 YellowKey 的威胁。  
  
  
该研究人员还发布了 GreenPlasma 的部分漏洞利用代码，而不是完整的概念验证漏洞利用 (PoC)。  
  
  
攻击者需要获取研究人员提供的代码，并自行研究如何将其武器化，这并非易事：目前，该代码在默认 Windows 配置下会触发 UAC 同意提示，这意味着静默攻击仍处于开发阶段。  
  
  
Knapp 警告说，攻击者在受害者系统中取得初步立足点后，经常会利用这类权限提升漏洞。  
  
  
他说：“这些权限提升漏洞通常会在攻击后被利用，使攻击者能够在横向转移到其他系统之前，发现并收集凭证和数据，最终实现数据窃取和/或勒索软件部署等目标。”  
  
  
“目前，GreenPlasma尚无已知的缓解措施。待微软解决此问题后，及时打补丁至关重要。”  
  
  
YellowKey 和 GreenPlasma 是这位神秘的匿名研究人员今年曝光的五个微软  
0day  
漏洞中最新的两个。  
  
  
当 Nightmare-Eclipse发布 BlueHammer（CVE-2026-32201，6.5）——微软在 4 月份对其进行了修复——时，他们被描述为一名心怀不满的研究人员，此后有传言称他是微软的前雇员。  
  
  
根据他们以 Chaotic Eclipse 为名发表的第一篇博客文章，漏洞泄露事件是在一次涉嫌违反信任关系后发生的。  
  
  
4 月初，该研究人员泄露了 Windows Defender 漏洞利用的概念验证代码，他们称之为 RedSun 和 UnDefend——分别是另一个管理员权限提升漏洞和拒绝服务漏洞——以及 BlueHammer。  
  
  
RedSun 和 UnDefend 这两个漏洞仍然没有修复，据 Huntress 称，发布的概念验证代码很快就被利用并被用于现实世界的攻击中。  
  
  
安全专家将 YellowKey 和 GreenPlasma 的曝光描述为针对微软不断升级的报复行动的最新进展，并警告说还会有更多类似事件发生。  
  
  
新闻链接：  
  
https://www.theregister.com/security/2026/05/13/disgruntled-researcher-releases-two-more-microsoft-zero-days/5239758  
  
****  
扫码关注  
  
军哥网络安全读报  
  
**讲述普通人能听懂的安全故事**  
  
  
