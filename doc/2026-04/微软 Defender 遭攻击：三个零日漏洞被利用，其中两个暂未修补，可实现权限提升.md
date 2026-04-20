#  微软 Defender 遭攻击：三个零日漏洞被利用，其中两个暂未修补，可实现权限提升  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-04-20 00:52  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DYqn7TU9icq0m7AcJ7v0p38cyRO0ZhXptnudX3olhpuHHsZgefpq79bvibVnJn37knDdEXMEDrrufs2oZBBWicvk51QZhjMdYZSjMgoTQm9bUQ/640?wx_fmt=png&from=appmsg "")  
  
攻击者正利用微软 Defender 中近期披露的**三个零日漏洞**  
，在受入侵系统中获取更高权限。这些漏洞分别被命名为**蓝锤（BlueHammer）、红日（RedSun）和破防（UnDefend）**  
，由一位名为**Chaotic Eclipse**  
的研究者公开，此前该研究者曾批评微软对漏洞披露的处理方式。  
  
Chaotic Eclipse 还公开了其中**尚未修补**  
的 Windows 漏洞的概念验证代码。  
- **BlueHammer**  
与**RedSun**  
可让攻击者在微软 Defender 中实现本地权限提升；  
  
- **UnDefend**  
则会触发拒绝服务，导致安全特征库更新被阻断，防护能力大幅下降。  
  
截至目前，微软仅修复了编号为 **CVE-2026-33825**  
 的 BlueHammer 漏洞，其余两个仍未发布补丁。  
  
安全厂商 Huntress 研究人员称，已有攻击者在实战中利用这三个 Windows 漏洞发起攻击，但受害者与攻击者身份尚不明确。  
  
Huntress 表示已监测到三个漏洞均在真实环境中被利用：攻击者自**2026 年 4 月 10 日**  
起开始利用 BlueHammer，随后在**4 月 16 日**  
又使用了 RedSun 与 UnDefend 的概念验证利用代码。  
  
研究人员判断，攻击者使用的正是 Chaotic Eclipse 公开在网络上的漏洞利用代码。  
###   
  
Huntress 安全运营中心（SOC）已监测到攻击者使用由 Nightmare-Eclipse 公开的 BlueHammer、RedSun、UnDefend 漏洞利用技术。  
  
调查人员：@wbmmfq、@Curity4201 及 @_JohnHammond  
  
—— Huntress（@HuntressLabs）2026 年 4 月 16 日  
  
Huntress 称，攻击者于 2026 年 4 月 10 日开始利用 BlueHammer，随后在 4 月 16 日使用了 RedSun 与 UnDefend 的概念验证漏洞利用程序。  
  
并在今日（4 月 16 日）监测到：→ C:\Users [已隐去]\Downloads\RedSun.exe  
  
该程序触发了 Defender 对 EICAR 测试文件的告警，这也是其攻击手法的一部分。  
  
—— Huntress（@HuntressLabs）2026 年 4 月 16 日  
  
当漏洞利用代码公开后，威胁组织往往能迅速将其武器化，用于真实网络攻击。  
  
  
