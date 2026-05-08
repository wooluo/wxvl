#  Linux内核0day漏洞“Dirty Frag”  
原创 不吃香菜
                    不吃香菜  韭要学JAVA安全   2026-05-08 02:56  
  
# Linux又曝高危0day！「Dirty Frag」让攻击者瞬间提权root，2017年至今所有版本无一幸免  
> 漏洞密集轰炸，Linux运维正在经历最艰难的五月。警戒级别：最高。  
  
  
就在「Copy Fail」引发全球Linux紧急响应之后，安全研究员发现另一枚高危本地提权0day漏洞已在地下流传——这个名为**「Dirty Frag」**  
的漏洞，能让任何本地低权限用户瞬间获得root控制权，且影响自2017年以来的几乎所有主流Linux发行版。  
  
更令人不安的是，由于安全禁令提前破裂，完整漏洞利用代码和详细的利用手法已在互联网上公开，**目前尚无CVE编号**  
，各大发行版也尚未发布修复补丁。  
## 01. 一次“意外”提前泄漏，半个地球的系统管理员从睡梦中惊醒  
  
2026年5月8日，韩国安全研究员Hyunwoo Kim在公开渠道上披露了**Dirty Frag漏洞的完整细节与利用代码**  
。这并不是他计划中的发布日期。  
  
按照原定的协调披露方案，漏洞本该在5月12日才向公众公开。然而，在embargo窗口期内，一名无关的第三方打破了约定，将漏洞信息提前泄露到了网络上——  
  
**恶意攻击者手中已经掌握了可以任意提权root的武器。**  
  
为了避免信息不对称带来的更大安全风险，Kim被迫提前公开了漏洞细节和完整PoC（概念验证）代码。  
  
这意味着——在阅读本文的这一刻，攻击者手上已经有了可以直接运行的提权工具，而防守方手里既没有官方补丁，也没有CVE编号，只有临时缓解措施。  
> **漏洞关键信息速览：**  
> <table><thead><tr style="box-sizing: border-box;cursor: pointer;"><th style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">类别</span></section></th><th style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">说明</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">漏洞类型</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">本地权限提升（LPE）</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">披露日期</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">2026年5月8日</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">发现者</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">Hyunwoo Kim（韩国）</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">影响时间范围</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">2017年1月至今（ESP模块）/ 2023年6月至今（RxRPC模块）</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">利用状态</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">PoC已公开</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">CVE编号</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">暂无</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">官方补丁</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">暂无</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">攻击成功率</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">100%（确定性逻辑漏洞，无须竞态条件）</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">内核崩溃风险</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">无</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">受影响系统</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">所有主流Linux发行版，包括Ubuntu、RHEL、CentOS Stream、Fedora、AlmaLinux、Debian、Arch、OpenSUSE等</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(255, 255, 255);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">是否依赖用户命名空间</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">ESP路径依赖，RxRPC路径不依赖</span></section></td></tr><tr style="box-sizing: border-box;cursor: pointer;color: rgb(0, 0, 0);background: none left top / auto no-repeat scroll padding-box border-box rgb(248, 248, 248);width: auto;height: auto;"><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">是否已被CISA标记</span></section></td><td style="box-sizing: border-box;cursor: pointer;padding: 5px 10px;min-width: 85px;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;"><section><span leaf="">尚未（漏洞极为新鲜，信息仍在扩散中）</span></section></td></tr></tbody></table>  
  
## 02. 一个逻辑漏洞，却比任何竞态条件漏洞都要致命  
  
竞态条件漏洞有一个天然的“短板”：攻击就像是往一个飞快旋转的硬币槽里投币，时机只要差了一点，整个攻击就可能失败。更糟的是，这些漏洞往往会在失败的尝试中把系统直接搞崩溃。  
  
但Dirty Frag**完全不是这种路数**  
。  
  
它根本不需要“撞运气”。它是一个纯逻辑漏洞，攻击路径是确定性的——**只要环境满足条件，第一次尝试就能百分之百成功提权**  
，而且即便攻击失败，内核也**绝对不会崩溃**  
。  
  
它是如何做到的？  
  
这要从Linux内核的**页缓存（Page Cache）机制**  
说起。  
## 03. 绕过写权限的“魔术”——Dirty Frag攻击手法详解  
> 当页缓存被“污染”，整个系统的安全边界就形同虚设。  
  
  
大多数Linux用户都知道一个常识：没有写权限，你就无法修改系统的关键文件，例如/etc/passwd  
或/usr/bin/su  
。  
  
Dirty Frag打破了这个常识。攻击者只需要能够**读取**  
某个文件的页缓存内容，就能利用内核中特定的网络操作路径，直接对页缓存中的文件副本进行“就地修改”，**全程不需要任何写入权限**  
。  
  
这个攻击的核心，在于滥用了Linux内核中的一种性能优化机制——**零拷贝路径（Zero-Copy Send Path）**  
。  
  
当应用通过splice()  
系统调用将一个只读页缓存页面的引用“植入”网络数据包的碎片槽时，接收端的内核代码会直接在该碎片上执行**就地加密/解密操作**  
。  
  
这正是漏洞命名的由来——Dirty Frag  
中的“Frag”，指的就是网络数据包中的“分片（fragment）”。  
  
攻击者通过精心构造网络数据包，可以让内核在这个就地加密的过程中，把特定数据写入攻击者原本只有读取权限的页缓存页面中。  
  
于是局面变成了这样：一旦内存中被“污染”的页缓存被后续操作读取，系统就会看到一个**被恶意篡改过**  
的关键文件副本。  
  
**而这一切，只需要攻击者能够在该系统上运行一个普通的、没有任何特权的程序**  
——比如通过SSH登录进服务器的普通用户，或者在一台共享办公电脑上运行某个可执行文件的本地低权限账户。  
## 04. 为何Dirty Frag能击穿所有主流发行版的防线？  
  
答案：**漏洞链**  
——两个漏洞互为补充，联手覆盖了对方无法触及的“盲区”。  
  
Dirty Frag的核心能力来自两个独立的漏洞模块，它们的攻击面在不同的发行版上各有千秋。  
  
**① xfrm-ESP页缓存写漏洞：精确控制**  
  
这个漏洞存在于Linux内核的IPsec ESP协议处理组件中（esp_input()  
函数），可以追溯到2017年1月的内核提交cac2661c53f3  
。它能够提供一个非常精确的**4字节存储原语（4-byte STORE primitive）**  
——攻击者可以完全控制写入的文件偏移量和具体写入的值，实现精准的单次内存覆写。  
  
但它有一个显著的门槛——**需要具备创建非特权用户命名空间的权限**  
。Ubuntu默认开启的AppArmor会阻止这种命名空间创建操作，直接拦截这一漏洞被利用的可能。  
  
如果说ESP漏洞是一把精确制导导弹但需要特定发射环境，那么RxRPC漏洞则是一颗能绕过所有防空的“隐身炸弹”。  
  
**② RxRPC页缓存写漏洞：无需命名空间，专治Ubuntu**  
  
RxRPC是Linux内核为支持AFS分布式文件系统而设计的内核模块。它的漏洞组件存在于rxkad子系统中（rxkad_verify_packet_1()函数  
），自2023年6月便被引入了内核。  
  
与ESP漏洞不同的是，RxRPC漏洞**完全不依赖用户命名空间**  
——这意味着Ubuntu的AppArmor对它形同虚设。  
  
但RxRPC也有自己的短板：大多数Linux发行版默认并没有自动加载rxrpc.ko  
内核模块。不过，**Ubuntu是个例外**  
——它默认就会加载RxRPC模块。  
  
**③ 漏洞链：两大模块“互补”覆盖所有发行版**  
  
两个漏洞的单体覆盖缺陷，在组合成漏洞链后反而成了最致命的优势：  
- 在默认不加载RxRPC但允许命名空间创建的发行版（如RHEL、Fedora、CentOS Stream等）上，攻击者调用**ESP漏洞**  
即可完成提权；  
  
- 在禁用命名空间但加载RxRPC的发行版（如Ubuntu）上，攻击者调用**RxRPC漏洞**  
直接绕过限制。  
  
一份PoC同时运行这两个漏洞，就能在所有主流Linux发行版上稳定获取root权限，包括Ubuntu 24.04.4、RHEL 10.1、CentOS Stream 10、AlmaLinux 10、Fedora 44和openSUSE Tumbleweed等。  
## 05. 此时此刻，你的服务器随时可能被攻击者利用PoC攻破  
  
**补丁状态**  
：截至本文完稿时，上游Linux内核主线仍未发布任何修复该漏洞的补丁。**PoC状态**  
：完整的利用代码已在GitHub上公开，任何人都可以下载、编译并在本地环境执行。**CVE状态**  
：目前没有任何CVE编号被分配。  
  
慢雾首席信息安全官@23pds已在X平台发文，**紧急呼吁所有Linux用户立即采取措施，无需等待官方补丁**  
。  
### 唯一的应急方案——临时规避：屏蔽三个内核模块  
  
既然没有官方补丁，那么唯一的办法就是从根源上阻断攻击面——**屏蔽Dirty Frag利用链所依赖的三个内核模块**  
：esp4  
、esp6  
和rxrpc  
。  
  
**⚠️ 紧急Manual Mitigation（临时规避措施）**  
> **以下操作需要root权限。请在操作前务必确认你的系统没有依赖IPsec隧道或RxRPC / AFS文件系统功能。**  
  
  
在终端中以root或sudo方式执行以下一行命令：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"```
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabq752gU4sOjSLouXS3LcmeztdZia8hQENr3xwm12HqbvbTuMIZB6IVzt3HnZTa3cw21tFZkCbqc0YZPu8VSFNTLl48SZwndO3IM/640?wx_fmt=png&from=appmsg "")  
  
github poc:  
https://github.com/V4bel/dirtyfrag  
#   
  
