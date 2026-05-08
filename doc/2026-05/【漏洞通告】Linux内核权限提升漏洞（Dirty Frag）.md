#  【漏洞通告】Linux内核权限提升漏洞（Dirty Frag）  
原创 NS-CERT
                    NS-CERT  绿盟科技CERT   2026-05-08 05:56  
  
**通告编号 NS-2026-0012**  
  
2026-05-08  
  
<table><tbody><tr><td data-colwidth="100" width="100" valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><strong><span style="font-size: 14px;color: #333;"><span leaf="">TAG：</span></span></strong></td><td valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><p><strong style="caret-color: red;"><span style="font-size: 14px;" microsoft="microsoft" yahei="yahei"><span leaf="">Linux、kernel、Dirty Frag</span></span></strong></p></td></tr><tr><td data-colwidth="100" valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><strong><span style="font-size: 14px;color: #333;"><span leaf="">漏洞危害：</span></span></strong></td><td valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><p style="vertical-align: inherit;"><strong style="caret-color: red;font-size: 14px;line-height: 1.5em;" microsoft="microsoft" yahei="yahei"><span leaf="">攻击者利用此漏洞，可实现系统权限提升。</span></strong></p></td></tr><tr><td data-colwidth="100" valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><strong><span style="font-size: 14px;color: #333;"><span leaf="">版本：</span></span></strong></td><td valign="top" style="border-color: rgb(216, 216, 216);margin: 0;word-break: break-all;padding: 5px;"><p style="vertical-align: inherit;"><strong style="caret-color: red;font-size: 14px;line-height: 1.5em;" microsoft="microsoft" yahei="yahei"><span leaf="">1.0</span></strong></p></td></tr></tbody></table>  
  
**1**  
  
  
**漏洞概述**  
  
近日，绿盟科技CERT监测到网上披露了Linux内核权限提升漏洞（Dirty Frag），攻击者利用splice系统调用配合xfrm-ESP或RxRPC协议栈的逻辑缺陷，无需竞争条件即可篡改任意只读文件的页缓存获取系统root权限，在多租户服务器、跳板机或容器云环境中，普通用户及容器内进程可借此实现本地提权或容器逃逸。CVSS评分7.8，目前漏洞细节与PoC已公开，请相关用户尽快采取措施进行防护。  
  
xfrm-ESP Page-Cache Write：由于esp4/esp6模块中存在逻辑缺陷，具有创建用户命名空间权限的本地攻击者可通过Netlink接口构造特制的ESP数据包篡改页缓存，从而修改关键系统文件获取root权限。  
  
RxRPC Page-Cache Write：由于rxrpc模块存在逻辑缺陷，具有普通权限的本地攻击者可通过创建AF_RXRPC套接字构造特殊RxRPC调用篡改页缓存，从而修改关键系统文件获取root权限。  
  
注：该漏洞具有极高的稳定性和隐蔽性。攻击者通过运行简单脚本，即可精准篡改系统任意只读文件的页缓存；由于该利用过程属于确定性逻辑触发，不依赖竞态条件，且仅篡改内存数据而不破坏磁盘原始文件，导致基于磁盘扫描的传统安全工具难以实时发现。  
  
Linux内核是操作系统的核心组件，负责进程管理、内存管理、设备驱动、文件系统及网络协议栈等关键功能，广泛部署于服务器、桌面系统及嵌入式设备中。esp4和esp6模块是IPsec协议栈的核心组件，分别负责处理IPv4和IPv6的ESP（Encapsulating Security Payload）协议数据包，是实现IPsec的加密、认证和封装流量的关键机制。rxrpc模块是实现RxRPC（Remote Procedure Call over unreliable datagram networks）协议的核心组件，专为在不可靠的UDP网络上提供可靠的远程过程调用（RPC）通信而设计。  
  
目前已在多个Linux发行版复现此漏洞：  
  
![image](https://mmbiz.qpic.cn/mmbiz_png/tZgxn6yByvJm0rpJ46E4ywLPJ0uUotPVrdH8nY265DQ93ZkAHf6QmRNYib2icFJWg0yickIwbkD0Pc89bsTZYE6In5YkXibbSmCXoKSTjibzibzU0/640?from=appmsg "")  
  
  
参考链接：  
  
https://www.openwall.com/lists/oss-security/2026/05/07/8  
  
  
**SEE MORE →**  
  
**2****影响范围**  
  
### 受影响版本  
  
xfrm-ESP Page-Cache Write：  
  
• Linux kernel  >= 4.11（commit cac2661c53f3，2017-01-17引入）  
  
RxRPC Page-Cache Write：  
  
• Linux kernel >= 6.5（commit 2dc334f1a63a，2023-06引入）  
  
注：影响Ubuntu、Debian、RHEL、openSUSE、CentOS、AlmaLinux、Fedora、Arch Linux等绝大多数Linux发行版。  
  
  
**3****漏洞检测**  
  
### 人工检测  
  
Linux系统用户可以通过查看内核版本来判断当前系统是否在受影响范围内，查看操作系统版本信息命令如下：  
<table><tbody><tr><td valign="top" style="border-width: 1px;border-style: solid;border-color: windowtext;background: #bebebe;padding:5px 10px;"><p style="text-autospace:ideograph-numeric;text-justify:inter-ideograph;text-align:justify;"><span style="font-size: 14px;letter-spacing: normal;line-height: 1.71em;font-family:微软雅黑, &#34;Microsoft YaHei&#34;;"><span leaf="">cat /proc/version</span></span></p></td></tr></tbody></table>  
![image](https://mmbiz.qpic.cn/sz_mmbiz_png/tZgxn6yByvIqeZEh4ebD0XP9P8fomQ3WRbyX0LIkvAHvwrDbzpnk9f7ia5f1G3Wqzs0GpAFI5oiatSytgXrdonhrXAlUZ6MkfG3KZGOcBiameM/640?from=appmsg "")  
  
可使用下列命令检查esp4/esp6/rxrpc模块的状态：  
  
<table><tbody><tr><td valign="top" style="border-width: 1px;border-style: solid;border-color: windowtext;background: #bebebe;padding:5px 10px;"><p style="text-autospace:ideograph-numeric;text-justify:inter-ideograph;text-align:justify;"><span style="font-size: 14px;letter-spacing: normal;line-height: 1.71em;font-family:微软雅黑, &#34;Microsoft YaHei&#34;;"><span leaf="">lsmod | grep -E &#39;^(esp4|esp6|rxrpc)</span></span></p></td></tr></tbody></table>  
  
注：若系统内核在受影响范围且加载了相关模块，则存在安全风险。  
  
  
**4****漏洞防护**  
  
### 官方升级  
  
目前官方暂未正式发布更新修复上述漏洞，请受影响的用户关注新版本动态并及时更新，下载链接：https://kernel.org/  
  
### 其他防护措施  
  
在不影响业务的情况下，可使用以下措施进行临时防护：  
  
1、相关用户可通过禁用esp4/esp6/rxrpc模块以阻断攻击面：  
  
<table><tbody><tr><td valign="top" style="border-width: 1px;border-style: solid;border-color: windowtext;background: #bebebe;padding:5px 10px;"><p style="text-autospace:ideograph-numeric;text-justify:inter-ideograph;text-align:justify;"><span style="font-size: 14px;letter-spacing: normal;line-height: 1.71em;font-family:微软雅黑, &#34;Microsoft YaHei&#34;;"><span leaf="">sh -c &#34;printf &#39;install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n&#39; &gt; /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2&gt;/dev/null; true&#34;</span></span></p></td></tr></tbody></table>  
  
2、在容器或云环境中，建议通过Seccomp配置禁止进程创建AF_ALG类型的套接字，拦截非特权用户命名空间创建，以防止逃逸风险。  
  
3、监测/etc/passwd、/etc/sudoers、/etc/shadow、/usr/bin/su等关键文件异常篡改，限制普通用户splice、add_key、unshare等高风险调用。  
  
  
  
  
**END**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qR4ORTNELImFwJM2rh6GKbnrurdFA28jJ8chUPyC1U6aW3jhenqEiaXkmeGVmfOnvAJy8j3My901JQ7emHaicYzA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/qR4ORTNELImFwJM2rh6GKbnrurdFA28jib7icfic0lJJHh3eLRpIXiaia08KqOSEibBsz64vlOH9aqicu3lmjccEeAFWQ/640?wx_fmt=jpeg "")  
  
**声明**  
  
本安全公告仅用来描述可能存在的安全问题，绿盟科技不为此安全公告提供任何保证或承诺。由于传播、利用此安全公告所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，绿盟科技以及安全公告作者不为此承担任何责任。  
  
绿盟科技拥有对此安全公告的修改和解释权。如欲转载或传播此安全公告，必须保证此安全公告的完整性，包括版权声明等全部内容。未经绿盟科技允许，不得任意修改或者增减此安全公告内容，不得以任何方式将其用于商业目的。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/qR4ORTNELImFwJM2rh6GKbnrurdFA28jib7icfic0lJJHh3eLRpIXiaia08KqOSEibBsz64vlOH9aqicu3lmjccEeAFWQ/640?wx_fmt=jpeg "")  
  
  
**绿盟科技CERT**  
∣  
微信公众号  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tZgxn6yByvKXsABGjbFCll2soNtEvW7Ws2RpV33IGH3qtz7wSDStg3GNz23W8ibCCPOzyuD76oDhAtKhMacZTqK9B7fos0iacTG8olq5gicjicE/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz/Hu8hctxHqSW0nSJn8p8OHVEQwHicSwTibFJMBE650AxdzfISoeY8woe2QsgCINIBrccBOOUft2HuU0GsNQWibSG7g/640?wx_fmt=png "")  
  
长按识别二维码，关注网络安全威胁信息  
  
