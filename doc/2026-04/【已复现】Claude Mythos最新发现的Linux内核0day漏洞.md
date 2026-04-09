#  【已复现】Claude Mythos最新发现的Linux内核0day漏洞  
原创 360漏洞研究院
                    360漏洞研究院  360漏洞研究院   2026-04-09 07:25  
  
“扫描下方二维码，进入公众号粉丝交流群。更多一手网安资讯、漏洞预警、技术干货和技术交流等您参与！”  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/5nNKGRl7pFgrNicMticDTWVCUWbOwRuWcrYSpAlwDRibKNLbe3KialEfR0Y2PlPAvS4MN50asXETicAviaRy1gRicI2Dw/640?wx_fmt=gif&from=appmsg "")  
  
  
Linux内核曝出Futex模块UAF漏洞，本地攻击者通过构造不一致的Futex requeue操作，可诱发内核锁对象悬空，进而实现权限提升或容器逃逸。  
  
  
目前 360 漏洞研究院已成功复现该漏洞并验证了危害。本文包含完整影响范围、修复方案、技术原理与复现细节，建议用户立即升级。  
  
  
<table><tbody><tr style="box-sizing: border-box;"><td colspan="4" data-colwidth="100.0000%" width="100.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;background-color: rgb(100, 130, 228);box-sizing: border-box;padding: 0px;"><section style="text-align: center;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞概述</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞名称</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">Linux内核Futex模块UAF漏洞</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞编号</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">LDYVUL-2026-00057982</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">公开时间</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">2026-03-26</span></span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">POC状态</span></span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未公开</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞类型</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">权限提升</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">EXP状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未公开</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">利用可能性</span></span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">高</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(0, 0, 0);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">技术细节状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未公开</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">CVSS 3.1</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">7.8</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">在野利用状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未发现</span></p></section></td></tr></tbody></table>  
  
  
**01**  
  
**漏洞影响范围**  
  
  
  
受影响的软件版本：  
  
该漏洞从添加sys_futex_requeue系统调用的时候被引入，引入时主线内核版本为6.6.0-rc2，但是内核6.6-y长期版本不受影响。  
  
引入commit为0f4b5f972216782a4acb1ae00dcb55173847c2ff。  
  
漏洞在下面几个版本中被修复  
  
6.12.80 with commit 027145ace09fad4c7cbcd6c61fe9b429c63eb0e5  
  
6.18.21 with commit 18b7d09c2b794c71d4252f3ea2cf84ad12b73d6a  
  
6.19.11 with commit e2f78c7ec1655fedd945366151ba54fcb9580508  
  
  
**02**  
  
**修复建议**  
  
  
  
**正式防护方案**  
  
应用安全补丁  
  
https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/kernel/futex/syscalls.c?h=v7.0-rc7&id=19f94b39058681dec64a10ebeb6f23fe7fc3f77a  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzzicXzZ9ricc5KpnQr0rpF0Ur7xtjWLdAbdYTe8iabGRdRHZhDajBHmyA67icg1eqWubeyXpmwo5n4255E7qW1l33mH7YPtAoiawAtRE/640?wx_fmt=png&from=appmsg "")  
  
  
**03**  
  
**漏洞描述**  
  
  
  
近日著名大模型Claude的开发商Anthropic在其官方网页上发布了一篇文章，该文章详细介绍了其最新模型Claude Mythos在漏洞挖掘与利用领域的重大突破，并重点阐述了Mythos对Linux内核进行全自动化漏洞挖掘与利用的成果。我们复现了其文章中提及的e2f78c7ec165 patch所修补的漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzzib2uuHibibze6CVOvDoyPwzyp6sT0OhcmqHusoRibSiaMp66rke52OEicJME0keibgdvdxABIeKVfz1UQfria3YicJWEez6mgQGnbibR53c/640?wx_fmt=png&from=appmsg "")  
  
该漏洞位于Linux内核Futex模块，其本质在于 Futex 的 requeue 操作允许使用不一致的 flags（shared → private），从而破坏了等待队列与其底层锁对象的生命周期一致性：攻击者可以将一个仍在等待的 futex waiter 迁移到另一个进程的 private futex hash 上，使其内部的 q->lock_ptr 指向该进程的私有 bucket 锁；当目标进程随后退出并释放其 mm 及对应的 private hash 后，这个指针变为悬空，而等待线程在被唤醒或中断返回路径中执行 futex_unqueue() 时仍会对该已释放的锁执行 spin_lock()，最终触发 use-after-free。  
  
成功利用此漏洞的攻击者可能可以实现Linux ROOT权限提升和容器逃逸，可获得对系统内核内存的访问权限，严重威胁系统安全。  
  
  
**04**  
  
**漏洞复现**  
  
  
  
360漏洞研究院已成功复现Linux Kernel Futex模块UAF漏洞，通过触发KASAN报告的方式进行验证。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dZ7ia5iaWFzz8V1K58ZFw9npVapKHO728tbuDZzNFPrC04O6Y64l7Y8JCbtSsouDOzExzonEWH0IPHqrXvp9NnyFHFvgYBh6MS1OwLcoiakRUU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzzibpibibrXwrkY8p2jePnDHNAZcaR0XC8ruxWZiatQMthkaP9IqYwGlU4njOdpHrs5txl4OUNuzHRmAIAyMQib9K984wwIpOV1Y7ymo/640?wx_fmt=png&from=appmsg "")  
  
Linux内核Futex模块UAF漏洞复现  
  
  
**05**  
  
**时间线**  
  
  
  
2026年04月09日，360漏洞研究院发布本安全风险通告。  
  
  
**06**  
  
参考链接  
  
  
  
https://red.anthropic.com/2026/mythos-preview/  
  
https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/kernel/futex/syscalls.c?h=v7.0-rc7&id=19f94b39058681dec64a10ebeb6f23fe7fc3f77a  
  
  
07  
  
更多漏洞情报  
  
  
  
建议您订阅360数字安全-漏洞情报服务，获取更多漏洞情报详情以及处置建议，让您的企业远离漏洞威胁。  
  
  
邮箱：360VRI@360.cn  
  
网址：https://vi.loudongyun.360.net  
  
  
  
“洞”悉网络威胁，守护数字安全  
  
  
**关于我们**  
  
  
360 漏洞研究院，隶属于360数字安全集团。其成员常年入选谷歌、微软、华为等厂商的安全精英排行榜, 并获得谷歌、微软、苹果史上最高漏洞奖励。研究院是中国首个荣膺Pwnie Awards“史诗级成就奖”，并获得多个Pwnie Awards提名的组织。累计发现并协助修复谷歌、苹果、微软、华为、高通等全球顶级厂商CVE漏洞3000多个，收获诸多官方公开致谢。研究院也屡次受邀在BlackHat，Usenix Security，Defcon等极具影响力的工业安全峰会和顶级学术会议上分享研究成果，并多次斩获信创挑战赛、天府杯等顶级黑客大赛总冠军和单项冠军。研究院将凭借其在漏洞挖掘和安全攻防方面的强大技术实力，帮助各大企业厂商不断完善系统安全，为数字安全保驾护航，筑造数字时代的安全堡垒。  
  
  
