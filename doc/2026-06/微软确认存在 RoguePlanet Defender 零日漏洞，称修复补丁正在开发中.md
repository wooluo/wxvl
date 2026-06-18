#  微软确认存在 RoguePlanet Defender 零日漏洞，称修复补丁正在开发中  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-06-18 00:49  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8dBEfDPEceicOpyAicGzIiaz42H1JlibWPAEfczibkYDUHboBiaM2bbAib2px3HtFOKWbb3icLYTlBak3mheNkpQlhpZiaQ/640?wx_fmt=png "")  
  
微软官方披露，正研发补丁修复一款代号为 RoguePlanet 的微软 Defender 零日漏洞。该漏洞现已分配唯一 CVE 编号 CVE-2026-50656（CVSS 风险评分 7.8 分），微软将其定性为权限提升漏洞。  
  
微软表示：“我们知晓微软 Defender 内置的恶意软件防护引擎存在一处权限提升漏洞，该漏洞对外代号为‘RoguePlanet’。目前我们正推进开发高质量安全更新以修复此漏洞。”  
  
近一周前，安全研究员 Chaotic Eclipse（别名 Nightmare-Eclipse）公开曝光了 RoguePlanet 漏洞，称该漏洞利用程序属于竞争条件漏洞，攻击者可借此获取系统最高权限（SYSTEM 权限）交互式命令行。  
  
该研究员说明：“此漏洞利用依赖竞争条件，执行成功率不稳定。我在部分设备上能实现百分百利用成功，另一部分设备则难以触发。”  
  
研究员于周二更新补充道：“我漏说了一点，很意外的是，RoguePlanet 概念验证代码无论 Defender 实时防护是否开启都能正常运行，这点极具讽刺。我推测在被动防护模式下也可利用，但尚未测试验证。”  
  
微软上周向《黑客新闻》媒体证实，已收到该漏洞上报，且 “正在积极核查相关漏洞爆料的真实性与实际利用影响范围”。  
  
RoguePlanet 是 Chaotic Eclipse 公开的第四款微软 Defender 漏洞，此前三款分别为 BlueHammer（CVE-2026-33825）、UnDefend（CVE-2026-45498）、RedSun（CVE-2026-41091），微软均已完成对应漏洞补丁推送。  
  
  
