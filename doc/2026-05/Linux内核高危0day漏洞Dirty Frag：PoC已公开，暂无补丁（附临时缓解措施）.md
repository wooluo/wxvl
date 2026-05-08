#  Linux内核高危0day漏洞Dirty Frag：PoC已公开，暂无补丁（附临时缓解措施）  
原创 ralap
                    ralap  网络个人修炼   2026-05-08 02:52  
  
5月7日，一款名为  
Dirty Frag  
的内核级0day漏洞已被公开。这是一种类似于最近披露的Copy Fail的本地权限升级漏洞,该漏洞于5月7日由韩国安全研究员提交至Linux官方内核安全团队，  
目前暂无CVE编号及官方补丁，漏洞利用代码（PoC）已在GitHub公开，普通用户可通过简单操作获取系统root权限。  
  
## 一、漏洞核心信息  
##   
  
Dirty Frag漏洞  
由两个内核漏洞串联形成漏洞链，核心细节如下：  
  
发现与披露  
  
由韩国安全研究员Hyunwoo Kim于2026年5月7日提交至Linux官方内核安全团队，原定协调披露时间为5月12日，后漏洞保密期（embargo）被第三方提前打破，导致PoC抢先公开。  
  
漏洞类型  
  
本地权限提升（LPE），属于纯逻辑漏洞，  
无需依赖时序窗口，无竞争条件，即使利用失败也不会导致内核崩溃，成功率较高。  
  
  
影响范围  
  
覆盖多数主流Linux发行版，包括Ubuntu、RHEL、CentOS Stream、Fedora、AlmaLinux、openSUSE等，  
内核版本自4.14起（2017年后发布的系统）均可能受影响。  
  
  
利用难度  
  
较低，普通人通过单行命令即可完成编译和执行，进而获取root shell。  
  
当前状态  
  
暂无CVE编号、无官方补丁及发行版修复方案，属于  
未防护状态的0day漏洞。  
  
## 二、漏洞原理  
##   
  
Dirty Frag 是一个漏洞（类），通过串联 xfrm-ESP 页面缓存写入漏洞和 RxRPC 页面缓存写漏洞，实现了大多数 Linux 发行版的根权限。  
  
xfrm-ESP漏洞自2017年起存在于系统中，需要创建非特权用户命名空间（Ubuntu的AppArmor可能会拦截该操作）；RxRPC漏洞自2023年引入，无需命名空间权限，但多数发行版默认不加载该模块，而Ubuntu等部分发行版会自动加载。  
  
该漏洞的核心逻辑是篡改Linux内核的页缓存（内存中存储的只读文件副本），无需写入磁盘即可实现权限篡改，操作过程重启后无痕迹，不易被检测。普通用户只要拥有本地账户，即可通过该漏洞获取root权限。  
  
## 三、Ubuntu实测结果  
##   
  
以下为Ubuntu2204系统下实测结果，  
普通用户下载执行即可获取root权限  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aj4fOOkmqMLia50v4NkISIGvjZjfOOjlkxCJMiaNHt7XMTvViaxgMuOyG0AiafXgbIX7f1GM1zyBNdtVd5vzINexFnyVGHGaibNbDTibX6TfOmZqk/640?wx_fmt=png&from=appmsg "")  
  
  
## 四、临时缓解方案  
##   
  
目前官方补丁尚未发布，临时抵御漏洞攻击的有效方式是禁用漏洞依赖的三个内核模块（esp4、esp6、rxrpc）。这些模块主要与IPsec网络协议相关，对于普通桌面和通用服务器，禁用后通常不会影响日常业务；依赖IPsec隧道的场景，需权衡禁用后的影响。  
  
执行以下缓解命令  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
```
ninstall esp6 /bin/false\ninstall rxrpc /bin/false\nblacklist esp4\nblacklist esp6\nblacklist rxrpc\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aj4fOOkmqMLN8E5iaBxeXuX4EgiasDmLDoyjxdhzpj7BYEbecdicA1jLIUB9dNnbBsl1YjPWexrAobd2kI6xPs99y5tJtJVLxbSqOydSF0KGlI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aj4fOOkmqMJ0tLSDOkp11EmmUfHDWicYIXVd9LWiaMy1Lu3o9nArHUBA9DHGXHjQodPeia9m3Dkc0SrqLQbrll6pzkCUF1ibeYMSUCibloat1tns/640?wx_fmt=png&from=appmsg "")  
  
  
参考链接  
  
[1]https://github.com/V4bel/dirtyfrag/blob/master/assets/write-up.md  
  
[2]https://lwn.net/Articles/1071719/  
  
