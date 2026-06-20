#  SSL/TLS 密码套件漏洞分析以及修复方法  
 谈思实验室   2026-06-20 10:00  
  
点击上方蓝字  
谈思实验室  
  
获取更多汽车网络安全资讯  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247573595&idx=1&sn=425c418664766cc4030f3cb49a733ec6&scene=21#wechat_redirect)  
  
  
**01**  
  
**前言**  
  
  
在当今数字化时代，网络安全至关重要。SSL/TLS 协议作为保障网络通信安全的重要手段，广泛应用于各类网络应用中。然而，如同任何技术一样，SSL/TLS 也并非绝对安全，存在着一些可能被攻击者利用的漏洞。本文将深入分析 SSL/TLS 密码套件中常见的漏洞种类及其原因，并详细介绍相应的修复方法，旨在帮助读者更好地理解和应对这些安全风险，确保网络通信的安全性和可靠性。  
  
**02**  
  
**SSL/TLS密码套件漏洞的常见种类和原因**  
  
  
**2.1 SSL/TLS 协议信息泄露漏洞(CVE-2016-2183)**  
  
使用nmap对某个域名做密码学套件的扫描。扫描结果如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaDma8NYgpXL1kRDOEvGfhCMdB5Jb4xtLcYJibrzSI4KVVLT1vtsqPwaSl1ib27EujtVreoMic3t9rvgqibrN1eYsH1Jc4pkkQmyTRk/640?wx_fmt=png&from=appmsg "")  
  
可以看到：  
  
时的用 TLSv1.0 和 TLSv1.1 协议依旧支持，同时压缩算法部分有TLS_RSA_WITH_3DES_EDE_CBC_SHA(rsa 2048)被标记为-C，表示存在潜在风险。同时服务器警告 64 - bit 块密码 3DES 容易受到 SWEET32 攻击。  
  
**2.2 SSL/TLS 服务器瞬时 Diffie-Hellman 公共密钥过弱漏洞**  
  
使用nmap对某个域名做密码学套件的扫描。扫描结果如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaAUfkbXUnUz6Riaia4It0TmtO7MKDMneCT8RIOehQLaAak7icjibgc5FFPPic6FsPkEOzU1DExqlT1DU7rJbeSIqFEt0VYdqPfORoia8/640?wx_fmt=png&from=appmsg "")  
  
扫描结果显示`Diffie - Hellman Key Exchange Insufficient Group Strength`，即服务器在使用Diffie - Hellman密钥交换时，所使用的组强度不够。这种情况可能导致服务器容易受到被动窃听攻击。攻击者可能通过分析网络流量，利用Diffie - Hellman密钥交换的弱点，获取到加密通信中的敏感信息，从而破坏通信的保密性和完整性。  
  
**2.3 OpenSSL 拒绝服务漏洞(CVE-2016-8610)**  
  
OpenSSL 是一种开放源码的 SSL 实现，用来实现网络通信的高强度加密，现 在被广泛地用于各种网络应用程序中。OpenSSL 在 SSL/TLS 协议握手过程的 实现中，允许客户端重复发送类型为 SSL3_RT_ALERT 级别为 SSL3_AL_WARNING 的内容未定义警告包，且 OpenSSL 在实现中遇到该未定 义警告包时仍选择忽略并继续处理接下来的通信内容（如果有的话）。攻 击者可以容易的利用该缺陷在一个消息中发送大量此未定义内容的警告 包，使服务或进程陷入无意义的循环，从而导致服务进程占掉 100 的 CPU 使用率。  
  
检测方法：  
  
通过socket发送如下数据  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaB0hlHA3AjzMVicypMvTaZXicVXjfyszBuIkcbogFgnetXnqbcZ5uNcfb0ZruMPpU0nmVBJ4e0Hpueic43Sh33ibJBIGVqp2x8GDAI/640?wx_fmt=png&from=appmsg "")  
  
如果收到响应  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaCN1xTicCJzuhkJQXOdRSvO5wKeX45wTDwlibDRicic45jX3WkMnCW9bBctmhal2eeyo61DZjFzTJ6PFyk5ZbzYx1icRqtbmMAyiaLNg/640?wx_fmt=png&from=appmsg "")  
  
则表示漏洞存在。  
  
相关资料：  
  
https://www.openssl.org/source/ https://security.360.cn/cve/CVE-2016-8610/ https://access.redhat.com/errata/RHSA-2017:1414  
  
https://access.redhat.com/errata/RHSA-2017:1413  
  
**03**  
  
**应用系统的架构**  
  
  
ISO 7 层架构和 TCP/4 层架构有不同的含义和应用场景，主要区别如下：  
  
**3.1 层次结构**  
  
ISO 7 层架构  
  
从下到上依次为物理层、数据链路层、网络层、传输层、会话层、表示层和应用层。  
  
物理层负责处理物理介质上的信号传输，如网线、光纤等；数据链路层关注的是在相邻节点间可靠地传输数据帧；网络层负责将数据包从源节点路由到目标节点；传输层提供端到端的可靠或不可靠的数据传输服务；会话层建立、维护和管理会话；表示层处理数据的表示形式，如加密、压缩等；应用层是用户与网络交互的接口，包括各种应用程序。  
  
TCP/IP  4 层架构  
  
由网络接口层、网络层、传输层和应用层组成。  
  
网络接口层对应于 ISO 模型中的物理层和数据链路层的功能，主要负责网络接入和数据链路的相关操作；网络层负责 IP 寻址和路由选择；传输层提供 TCP（可靠传输）和 UDP（不可靠传输）等服务；应用层包含各种应用协议和应用程序，如 HTTP、FTP 等。  
  
**3.2 功能重点**  
  
**ISO 7 层架构**  
  
更注重对网络通信过程中从物理介质到应用程序的全方位、精细化的功能划分和描述。  
  
每个层次都有其明确的功能和接口规范，有利于不同厂商的设备和软件在各个层次上进行标准化的开发和集成。例如，在表示层可以通过统一的标准来实现数据的加密和解密操作，使得不同系统之间能够正确地处理和理解数据的表示形式。  
  
TCP/IP 4 层架构  
  
更侧重于互联网环境下的实际应用和网络通信的核心功能。  
  
它简化了层次结构，突出了网络层的 IP 协议和传输层的 TCP、UDP 协议的重要性。网络层的 IP 协议实现了全球范围内的寻址和路由，传输层的 TCP 和 UDP 则满足了不同应用场景下对数据传输可靠性和效率的要求。例如，在设计一个简单的 Web 应用时，主要关注的是应用层的 HTTP 协议、传输层的 TCP 协议以及网络层的 IP 协议，而对底层的物理层和数据链路层细节通常不需要过多考虑。  
  
**3.3 在阿里云服务器配置中的应用**  
  
ISO 7 层架构应用  
  
在一些复杂的企业级应用场景中，可能会涉及到对各个层次的精细配置和管理。例如，在配置服务器的网络安全时，可能需要在不同层次上设置访问控制。在物理层可以通过限制服务器机房的物理访问来保护设备；在数据链路层可以设置 MAC 地址过滤；在网络层可以配置防火墙规则进行 IP 地址过滤；在传输层可以通过配置 SSL/TLS 协议来保障数据传输的安全；在会话层可以管理用户会话的超时和权限；在表示层可以对数据进行加密存储和传输；在应用层可以对不同的应用程序设置用户权限和访问规则。  
  
TCP/IP 4 层架构应用  
  
在阿里云服务器配置中，通常更关注网络接口层的网络接入方式（如以太网、无线等），网络层的 IP 地址分配和路由设置，传输层的协议选择（如 TCP 或 UDP）以及应用层的应用程序部署和配置。例如，在配置一个 Web 服务器时，会在网络接口层确保网络连接正常，在网络层为服务器分配一个公网 IP 地址并设置正确的路由，在传输层选择 TCP 协议来保障 HTTP 请求的可靠传输，在应用层安装和配置 Web 应用程序相关的软件（如 Apache、NGINX  等）。  
  
用户客户端访问应用服务器，一个常见的途径步骤是首先访问WAF，再到NGINX，最后到服务器。  
  
所以我们在修复SSL/TLS密码套件漏洞时，要首先了解这是什么架构。  
  
以阿里云为例，如果阿里云上看到负载均衡的监听器管理的配置如下  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaDictgJIeoLG0KmGiazjhXa3cSQntKZO7Iicaz6wM5NJtv5898vq0H5sWqKiaHbpVGSZpaPDQYz13zLDsmCPf76NiaicMkUytDzyhav8/640?wx_fmt=png&from=appmsg "")  
  
说明目前负载均衡配置的是tcp4层协议，需要在服务器上修改协议版本配置。参考4.3的方法可以修复漏洞  
  
其实我们建议尽量把负载均衡升级（新建一个新的7层协议），需要重新配置负载均衡，并且修改域名映射。当然，这需要影响业务，需要应用维护人员协商时间去操作，并且配合测试，动作比较大。那如果是在7层协议的情况下，用户需要找到最外层的设备，如果是WAF，建议采用4.1方法；如果是Nginx，建议采用4.2的方法。  
  
**04**  
  
**修复方法**  
  
  
从阿里云的WAF使用说明中可以看到 只有通过CNAME接入方式接入域名时，您可以在接入域名配置向导的配置监听任务中，自定义允许WAF使用的加密套件类型（如下图所示）。自定义加密套件类型后，WAF只监听支持指定加密套件的客户端的请求。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaBZVyuDT76QZ0aLNc4XWjGVC8tMzZgRcZ9fZ2NsHJZImR1GCdo3cQ3auM2UlMIppPtDI2Yvia0hcafYOIia6frMicIQGEDclkxnOk/640?wx_fmt=png&from=appmsg "")  
  
**4.2 修改NGINX配置**  
  
NGINX关闭低版本tls协议 禁用 tls1.0 tls1.1等协议  
  
配置示例：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaBQEmicZ3ktQNL8ibMhziaB2F14XPMuAVrFIc8YufkHwPos9CxZhvbcZpceTR6oswvM2LvzOV3KMMfkR24hEicCAEaetSayhMsE9g0/640?wx_fmt=png&from=appmsg "")  
  
在这个配置中，ssl_protocols TLSv1.2 TLSv1.3; 明确地禁用了 TLSv1 和 TLSv1.1。  
  
ssl_ciphers 指定了一些安全的加密套件。  
  
ssl_prefer_server_ciphers on; 配置 Nginx 使用服务器优选的加密套件。  
  
确保你已经生成了 dhparam.pem 文件，可以通过以下命令生成：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaBQCibF3q1WjVJmict0ADVbib7nxjsuOTB8KicW467zWheM0jTS7Q2ewcZEibibIq5vONRln8dqSvlo3yzeRfSfDNckibic1zEsMkEllWk/640?wx_fmt=png&from=appmsg "")  
  
完成配置后，重启 Nginx 以应用更改：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaCibAEY8V57g98MAQbpzvhFD75A5rRENurSCYlDLach5lgqvdPYZBoibzmWqInia8ibBrrwyUA09YuQl0ia7CMEJvO0IWmPMLiaicuz74/640?wx_fmt=png&from=appmsg "")  
  
注意！这里可能有坑！我按上面的设置，通过检测工具(SSL Server Test (Powered by Qualys SSL Labs))，发现还是没有禁用tls1.1，后来折腾好久，才发现原因，是这台服务器不止一个网站，有别的vhost文件在用着tls1.1，如果想要禁用tls1.1，必须是整个服务器的nginx配置里都禁用tls1.1  
  
**4.3 服务器tomcat配置修改**  
  
修改conf下面的server.xml  
  
<Connector 这一段里面增加如下两个配置：  
  
配置1：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaBqwrGTAsVmicdVnJ5ibd7Xs5rCDjNzTDVBX1OnU9OQCrU4LN7po0qoKrick9nTFyze5TdLQkajibOSnASCTCWwCLlPutoP0AibxlrY/640?wx_fmt=png&from=appmsg "")  
  
配置2：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaBYbX6mMaBxzfDwicLNriaObicIauFmyMLbtiaiaHz5yax898ZTeFB7XPoXJf4IyficOXkEbpjfhrYFZYXsUltUKBL65z2xNVNBGLOCw/640?wx_fmt=png&from=appmsg "")  
  
配置完成的配置文件截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaBxUZVUPnKJARCepg9SdoPibQCey95cw7fmHM612QA1H5PlY8M5VE3Rrfgwy3eziaiaIH5X5Mmr1ARhNfQAdqEpwAMgNheRVSsFnw/640?wx_fmt=png&from=appmsg "")  
  
最后重启tomcat,就发现生效了。  
  
**4.4 windows服务器本地修复**  
  
天威诚信工具ITrusIIS.exe下载地址 http://www.itrus.cn/soft/ITrusIIS.exe  
  
运行后点击“最佳配置”，然后去除红线这条后点“应用”  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaA4iap6RKZMphDO81tibfHSZy4eSSen7vkp7IvlVYkVIb1Yk1iaZ79MB4TfibZ2NOgVibwKrJcMPrCMY7iaAk9QPPOoTBNRY1mqZ4lAc/640?wx_fmt=png&from=appmsg "")  
  
**4.4.2 可能的报错解决**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaAvTDEib8RLhouN1MnDdj1153F3aiaqiaicFGnSkEpeQS0yQBRnnUibMj3lKhMVcX56v9d9d5be03e2cRVbzwxMl6iaLcLE9BWPyhic7M/640?wx_fmt=png&from=appmsg "")  
  
禁用HTTP/2  
  
检查以下目录  
  
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\HTTP\Parameters]  
  
“EnableHttp2Tls”=dword:00000000  
  
“EnableHttp2Cleartext”=dword:00000000  
  
没有就添加上面两值  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zQ19N6bPViaCHbX8Re7KWYkSJu997zNGtUwOUyqP2TQxHOHTMiaTCibiaxA0c57HrCeHtVjoQKMicCDCOCaDa8r1kujrmSA61smAFibgVJicGyk3sE/640?wx_fmt=png&from=appmsg "")  
  
**4.5 升级opensll**  
  
对于 OpenSSL 拒绝服务漏洞(CVE-2016-8610)，建议方法是升级OPENSSL。但是需要注意这里的版本范围  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zQ19N6bPViaDsd2YgW4WV6Uicws55v6ggaF7IuahLsah1ohzQhwvxjJFqKiboVoZHPicVKpiaEQQ8TPgnZ8V16IAG0kria4589Te1yePx3r3odvqs/640?wx_fmt=png&from=appmsg "")  
  
来源：CSDN博主「晓翔仔」  
  
https://blog.csdn.net/qq_33163046/article/details/143226226  
  
**end**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/3g8Dklb9Twicgqayv6EVjeHah3Bpvw2ZJlH8rNickiaaHhLM4PaibcicFO9usS5xIOrWYjZibuvwV8g9DwnI6xZ4RvHg/640?wx_fmt=jpeg&from=appmsg "")  
  
**谈思汽车媒体门户**  
  
  
[](https://mp.weixin.qq.com/s?__biz=MzkyODQzMDI3Mw==&mid=2247549590&idx=1&sn=b5ea25965c057d1ca2913d900f77799d&scene=21#wechat_redirect)  
  
  
  
**精品活动推荐**  
  
  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247570424&idx=3&sn=50dd348126dde62996f11475319db5db&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247572036&idx=3&sn=2410465a682d6b6c1f8b801eb583cdae&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247572912&idx=3&sn=58184d21d6dabc713e8d93a0c1d80e40&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247573595&idx=1&sn=425c418664766cc4030f3cb49a733ec6&scene=21#wechat_redirect)  
  
  
  
  
  
  
**AutoSec系列沙龙**  
  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247548574&idx=1&sn=11f37456b4f45c0fdbf795c21e201c03&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247551934&idx=2&sn=50785b76c512a88b30455fc1e8fa188c&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247557132&idx=2&sn=2e44d4c2d77a2eec377d0553442d2c1b&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247561775&idx=1&sn=948a9e7f8d4fbed363c6a6a5479cd39e&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247561260&idx=2&sn=0ca6395502487515a921f32288b7e8df&scene=21#wechat_redirect)  
  
  
  
  
  
**专业社群**  
  
  
[](https://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247535223&idx=1&sn=e30e07a44accd5b0e9ada3d8b537f977&scene=21#wechat_redirect)  
  
**部分入群专家来自：**  
  
  
**新势力车企：**  
  
特斯拉、理想、极氪、小米、零跑汽车、阿维塔汽车、智己汽车、小鹏、岚图汽车、蔚来汽车、吉祥汽车、赛力斯......  
  
**外资传统主流车企代表:**  
  
大众中国、大众酷翼、奥迪汽车、宝马、福特、戴姆勒-奔驰、通用、保时捷、沃尔沃、现代汽车、日产汽车、捷豹路虎、斯堪尼亚......  
  
**内资传统主流车企：**  
  
吉利汽车、上汽乘用车、长城汽车、上汽大众、长安汽车、北京汽车、东风汽车、广汽、比亚迪、一汽集团、一汽解放、东风商用、上汽商用......  
  
**全球领先一级供应商：**  
  
博世、大陆集团、联合汽车电子、安波福、采埃孚、科世达、舍弗勒、霍尼韦尔、大疆、日立、哈曼、华为、百度、联想、联发科、普瑞均胜、德赛西威、蜂巢转向、均联智行、武汉光庭、星纪魅族、中车集团、潍柴集团、地平线、紫光同芯、字节跳动、......  
  
**二级供应商(500+以上)：**  
  
中科数测  
、ETAS、  
BlackDuck  
、NXP、上海软件中心、Deloitte、奇安信、为辰信安、云驰未来、信长城、泽鹿安全、纽创信安、复旦微电子、天融信、奇虎360、中汽中心、中国汽研、上海汽检、  
加特兰微电子  
、浙江大学......  
  
**人员占比**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3g8Dklb9Twicgqayv6EVjeHah3Bpvw2ZJVW2JR9ib5icMR4wIs58nO6ia3OicH5l6vONnmuhfLqMKqj8T2AnD7W1vqQ/640?wx_fmt=png&from=appmsg "")  
  
  
**公司类型占比**  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3g8Dklb9Twicgqayv6EVjeHah3Bpvw2ZJU6yKtYSJu4oPaJABYuCSyTpLXjRNbVv7OUTUUCxmB1OuPhtcM4j1kw/640?wx_fmt=png&from=appmsg "")  
  
  
**文章**  
  
# 不要错过哦，这可能是汽车网络安全产业最大的专属社区！  
  
[关于涉嫌仿冒AutoSec会议品牌的律师声明](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247531034&idx=2&sn=e466ca3e7c2927a91dd9a81be705afe1&chksm=e9273ec1de50b7d7f540ae2e4c255bfb42f842228a87f7dbc65297027a878544a9e796e09cf6&scene=21#wechat_redirect)  
  
  
[一文带你了解智能汽车车载网络通信安全架构](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247517280&idx=2&sn=8bfafb17871598c9cc0041bc9ee5f65d&chksm=e927c0bbde5049ad8cdb3647f6cdfce00c2db7a7b484941027bb7edf3128e4eaa74d6727dd46&scene=21#wechat_redirect)  
  
  
[网络安全：TARA方法、工具与案例](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247502093&idx=1&sn=ec4b373a33ca04d79afbb0b0b880bd4e&chksm=e9278dd6de5004c01bdd83ad0dd89c3549c7ae2ceb362959dbcb159324b2593d70bce78d82a9&scene=21#wechat_redirect)  
  
  
[汽车数据安全合规重点分析](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247519068&idx=1&sn=78c66e13bd8798afd46c766b8f18abe7&chksm=e927cf87de504691c816f78b55daf93bdfb72fc1cb870d926de8b471eb3e1be61058498327b1&scene=21#wechat_redirect)  
  
  
[浅析汽车芯片信息安全之安全启动](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247512151&idx=1&sn=7fabbeeec206ce615a5a3c574bed4c43&chksm=e927f48cde507d9ab6bfd4b8389b5eafea37586707682bfe60f294feb54e1c36cb07bad4d26d&scene=21#wechat_redirect)  
  
  
[域集中式架构的汽车车载通信安全方案探究](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247519952&idx=2&sn=709860de942501f20e923d15330ced9a&chksm=e927ca0bde50431df0b47ad1a2da63bf98ee637c9c00482145fbdb8755851b61421357aab4bf&scene=21#wechat_redirect)  
  
  
[系统安全架构之车辆网络安全架构](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247520446&idx=1&sn=27e10e455264cecb2a1b49d91484d036&chksm=e927d465de505d73c59a6fb4cb066c7c7d07a96ef49a841ffe598c23d28be545c5874dec7de4&scene=21#wechat_redirect)  
  
  
[车联网中的隐私保护问题](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247521010&idx=1&sn=94ef379e2b877551093a869cf9d4897e&chksm=e927d629de505f3f3cbc102682f7a21a82372108776d3484d8ce619f7db1aae0ab0a001b9b41&scene=21#wechat_redirect)  
  
  
[智能网联汽车网络安全技术研究](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247521302&idx=1&sn=01e9311cb2c84f3e64902abf5f6e7a9e&chksm=e927d0cdde5059db5fe18c5e27f830bbb6ea6df327088082e7844aa056b05f840ad4cf6e3b5a&scene=21#wechat_redirect)  
  
  
[AUTOSAR 信息安全框架和关键技术分析](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247521661&idx=1&sn=a72381e326e3a226059954c74698e0dd&chksm=e927d1a6de5058b0297b91ba77fcf34bd3c581476a0790c5e0cfbcbe026b5a7c27d700bfb1ca&scene=21#wechat_redirect)  
  
  
[AUTOSAR 信息安全机制有哪些？](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247522056&idx=1&sn=bbd03def212d085f533e0301f8c86f18&chksm=e927d3d3de505ac57099d5e42fb6726cf152de9aaa9590b095895874e7a4cc806abc84cc4ebf&scene=21#wechat_redirect)  
  
  
[信息安全的底层机制](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247522886&idx=1&sn=77103702d98e3788beae34b8ea3c31d0&chksm=e927de9dde50578b3dce0bba65599da38844310edd8554f43c9f1c354eaa0487b7c8b4f65c3c&scene=21#wechat_redirect)  
  
  
[汽车网络安全](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247523567&idx=1&sn=1b1d83f339de81a0dc396dd0bd6e6893&chksm=e927d834de50512246f63e47a32f7b934e64eb2b6138053ef43485b871736a122db1340bc437&scene=21#wechat_redirect)  
  
  
[Autosar硬件安全模块HSM的使用](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247527177&idx=1&sn=984bfc845ef51ec1f32cd12d37430621&chksm=e9272fd2de50a6c4013f84ed2257f634a505a04a27b4b27c30e5af4492d5fc3b0099216b1f7d&scene=21#wechat_redirect)  
  
  
[首发!小米雷军两会上就汽车数据安全问题建言：关于构建完善汽车数据安全管理体系的建议](http://mp.weixin.qq.com/s?__biz=MzIzOTc2OTAxMg==&mid=2247519331&idx=1&sn=925d48164f1c7d2d109ee433cde6805b&chksm=e927c8b8de5041aea58f73aed311cdd3bf913bbb73d8e175ac80ae643d944709e06ec418fb52&scene=21#wechat_redirect)  
  
  
