#  漏洞预警 - Linux内核「Dirty Frag」提权0day  
原创 0xsdeo
                        0xsdeo  Spade sec   2026-05-08 01:35  
  
## 漏洞简述  
  
该漏洞由 Hyunwoo Kim（@v4bel）首次发现并报告，通过串联 xfrm-ESP 页缓存写入漏洞 和 RxRPC 页缓存写入漏洞，可以在主流 Linux 发行版上获取 root 权限。  
  
Dirty Frag 是 Dirty Pipe 和 Copy Fail 所属的漏洞类型的一个扩展案例。由于它是一个确定性的逻辑漏洞，不依赖于时间窗口竞态条件，因此漏洞利用失败时内核不会崩溃，且成功率非常高。  
  
由于当前禁令已被打破，目前尚无补丁或 CVE 编号。  
  
https://github.com/V4bel/dirtyfrag  
：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Vs726wCeYTWJs6YNP3LVXfV6MXDLhCLy4cNYyRTsBBUHoqiaPaBpVouRwpRdJaMu3ib9vugCib6l4Zib0Xmf4eBiaLgZJIl16yqWAABse0ZNN7Ac/640?wx_fmt=png&from=appmsg "")  
## 漏洞验证  
```
git clone https://github.com/V4bel/dirtyfrag.git && cd dirtyfrag && gcc -O0 -Wall -o exp exp.c -lutil && ./exp
```  
  
本概念验证 (PoC) 是在与 Linux 发行版协商后提供的准确信息。请勿在您未获授权进行测试的系统上使用它。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Vs726wCeYTV3lrD9j8xwMtljf4YdbPEfic5bEWPrl5sEYibGS9iam3tqKk6MOZKYm0J5ZicBrtgum2wounSv4cIhpkiaib9ibIS8O9VqTMxwkibsSeM/640?wx_fmt=png&from=appmsg "")  
  
笔者测试：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Vs726wCeYTUV2bTxJ8nSrNwjrxh2o03rH5ukdT3Xlh3evGryXcvqcRcTCWKdrE39ojh6EOmSq4wBWl5evNRWpfTVB9013K2erNvu2dKwp8c/640?wx_fmt=png&from=appmsg "")  
## 受影响版本  
  
xfrm-ESP 页缓存写入漏洞 的影响范围从 cac2661c53f3（2017年1月17日）开始，直至上游最新版本；RxRPC 页缓存写入漏洞 的影响范围从 2dc334f1a63a（2023年6月）开始，直至上游最新版本。  
  
换句话说，这两个漏洞的有效生命周期约为 9 年。  
  
该 Dirty Frag 漏洞已在以下发行版版本上进行了测试：  
  
Ubuntu 24.04.4：6.17.0-23-generic RHEL 10.1：6.12.0-124.49.1.el10_1.x86_64 openSUSE Tumbleweed：7.0.2-1-default CentOS Stream 10：6.12.0-224.el10.x86_64 AlmaLinux 10：6.12.0-124.52.3.el10_1.x86_64 Fedora 44：6.19.14-300.fc44.x86_64 ...  
## 修复方案  
  
https://github.com/V4bel/dirtyfrag/blob/master/assets/write-up.md[#patch]()  
-1  
  
