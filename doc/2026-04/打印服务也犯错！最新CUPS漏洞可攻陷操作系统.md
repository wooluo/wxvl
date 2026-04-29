#  打印服务也犯错！最新CUPS漏洞可攻陷操作系统  
原创 打印机安全
                    打印机安全  打印机安全   2026-04-28 13:59  
  
CUPS是什么？  
  
CPU？UPS？嗑CP？  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/6liaItc9B4ZibPmMicssUu9TDLJBdwrwdn89ick9FKDHZaDOFaTLEC9LicPjkQ4dbFYfJ3ib1RpvboczpqsWZVQ6JOuQyLNKeZ5yrRneLwHhEq9gw/640?wx_fmt=jpeg&from=appmsg "")  
  
CUPS是在苹果电脑、Linux系统、Unix系统、以及基于Linux深度开发的国产操作系统里管理打印的服务。  
  
CUPS就是在你的电脑里负责接受处理打印任务的一个服务，和Windows系统里的Print Spooler服务类似。  
  
CUPS的功能非常强大：  
  
1）  
军训教官：假如多个打印任务是一个个小兵，CUPS就是那个教官，让小兵们听训听话，一个个排好队，顺序上车。  
  
2）  
翻译：如果把  
jpg、pdf、txt等格式文件直接交给  
打印机，打印机不一定能直接打印出来，打印机有自己的语言PCL等，CUPS就负责翻译工作，把电脑里的文件翻译成  
打印机能理解的文件。  
  
3）  
送信的：光在电脑里翻译好了还不行，还要送给打印机才可以，CUPS就通过专属的通道（如USB、IPP等）把翻译好的文件交给送给打印机。  
  
所以，CUPS就是操作系统里主管打印的尽心尽职的全能管家！  
  
但是！正因为尽心尽职，所以全能管家就犯错了！  
  
比如CVE-2026-34890和CVE-026-34990这两个最新漏洞，就让CUPS成为恶人的帮凶。  
  
利用漏洞攻陷操作系统：  
  
现在我们假设，操作系统是一个防守非常严密的军营，敌对势力正对着军用虎视眈眈，但又因为军营防守严密，所以就想用间谍混进军营，于是，他们盯上了尽心尽职的全能管家-CUPS。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6liaItc9B4Z8jcx7OIHRTAf9Bh55bumkxO9PAibZ6jxKEibQuu8vnOATTkOjoSEpLVCw5EfSYxm2j8NE9X2msL32GYkomMJU9H8GbylJ1uTsmw/640?wx_fmt=png&from=appmsg "")  
  
  
  
CVE-2026-34890漏洞：小兵们正排着队进军营呢，间谍来了，穿着同样的军装。CUPS非常尽心尽职，因为这已经不是他第一次接受从兄弟连队插队进来的小兵了。凡是小兵，他都接受。  
  
间谍顺利地进入了军营，但是他没有钥匙，没有打开重要房间的钥匙。  
  
  
间谍开始思考，钥匙在哪里？  
  
CVE-2026-34990漏洞：钥匙其实一直是由CUPS保管着的，但是，CUPS有个不好的习惯，他在带某些小兵（IPP）进入军营时，他会把钥匙随便乱放。这个坏习惯被间谍看到了，于是，间谍就拿着钥匙，进入了军营重要位置，开始胡作非为。  
  
最终，间谍成功地攻陷了军营。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6liaItc9B4Z8bS7Q1BpSvAxOeEm20lIf8Rt64sNzzJHy2WcItdxmox9hUPNPcoITt5yH0rgcIyMXAfn4gSVEWAgrRhkhYN4jM99fF1JwtgDc/640?wx_fmt=png&from=appmsg "")  
  
  
值得注意的是：  
  
1）目前针对的版本是CUPS2.4.16  
  
2）这两个漏洞是借助人工智能发现的。  
  
  
  
