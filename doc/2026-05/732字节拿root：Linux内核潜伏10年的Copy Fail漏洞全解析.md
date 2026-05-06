#  732字节拿root：Linux内核潜伏10年的"Copy Fail"漏洞全解析  
原创 iconic
                    iconic  老登的安全观   2026-05-06 00:31  
  
佛系随性笔记，记录最好的自己！  
  
个人水平比较有限，每篇都尽量以白话+图文的方式去说明。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/bwYjpTUcUCJbkuoSHKuLwVQ9GrcPHbWEChhEpoiaIg3QM30YicibryBjG14O0L4pydneIticFp5pTgcXWvg1P76sLfzd18MtUjZ4xbmw6rOWHmI/640?wx_fmt=jpeg "")  
  
  
文章架构  
  
引言  
  
1、什么原理  
  
2、没有一点含金量，全靠系统"送"  
  
3、"潜伏10年"的罗生门  
  
4  
、  
核心：只改“复印件”，不碰“原件”  
  
5、吹了这么多，怎么防？  
  
结语  
  
  
  
引言  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bwYjpTUcUCIEibjyic0EO9eo13qoAAzYTOr9R4lcMeG0FDU1yXicXdrib5CHqHn63IvfgBuRKub6FwrXeNKoEIia0eibvvSfKeyDiaXFSZqfs5I3zM/640?wx_fmt=jpeg "")  
  
732字节有多大？1KB都不到？发条微信朋友圈配张图 📸，都不够的 🤏。  
  
但就在节前，安全圈被这732字节的代码炸了锅 💣。只要你在Linux系统里跑一下它，一个普普通通的用户，瞬间就能原地飞升 🚀，变成掌控整台机器的最高大Boss（root） 👑。  
  
漏洞编号：CVE-2026-31431  
 🏷️，代号 “  
Copy Fail  
” 。  
  
严重程度：  
高危   
🚨。CVSS评  
分7.8  
，满分10分 。  
  
攻击效果：  
从普通用户直接  
升级成root用户  
 🆙。root是什么概念？就是Linux系统里的"上帝" 🛐，想干嘛就干嘛，没有权限管得了你 🛡️❌。  
  
攻击代码：732字节的Python脚本 🐍。比这篇文章的一个段落还短 。  
  
如果你觉得"又是一个Linux提权漏洞，老套路了" 🥱，那你就大错特错了 ❌。这玩意儿不仅能让安全研究员拍大腿 🤦‍♂️，还能让云厂商半夜惊醒 😱。今天我就用大白话，扒一扒这个潜伏了快十年的"copy Fail" 🕵️‍♂️。  
  
  
💡  
什么原理？  
  
大白话解释下，要理解这个漏洞，得先知道两件事  
💡  
：  
### 1️⃣第一件事：Linux有个"缓存区"💾  
  
当你运行一个程序的时候，Linux不会每次都去硬盘读文件，太慢了  
🐢  
。它会把文件先加载到内存里，这就是**页面缓存（Page Cache）💨**  
。  
  
就像你下载电影  
🎬  
，第一次要等它慢慢缓冲、完成下载，存到本地硬盘  
💿  
后，下次想看直接点开  
⏯️  
就行，不用再等加载了。  
### 2️⃣ 第二件事：Linux有个"加密接口"🔐  
  
Linux提供了一套接口，让程序可以用内核级别的加密功能，这就是**AF_ALG**  
。你可以理解成Linux内置了一个"加密瑞士军刀"，很多安全软件都靠它。  
  
**那么问题来了🤔？漏洞就出在这两件事的"合作"上。🤝💥**  
  
2017年  
📅  
，Linux内核为了提升性能  
🏎️  
，对AF_ALG做了一处优化。但这处优化有个bug：  
它把"源文件"和"目标文件"搞混了  
🙈  
。  
  
用大白话来说，就是：你本来想让系统"读取"一个文件做加密处理，结果它把加密后的结果**直接写回了原始✍️文件**  
。  
  
加密过程中，系统会往文件末尾追加4个字节的序列号  
🔢➕  
。结果因为这个bug，这4个字节被写到了原本**只读的文件**  
里  
📝🚫  
，  
这么简单的一个逻辑  
🤦‍♂️  
错误。  
  
### 没有一点含金量，全靠系统"送"  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bwYjpTUcUCJQTyjSB3vlJ6RibJEe00pJfErmMOH71Yiavyv1TOLMhGjUb03osgZrJfniaBX6NH8ia31iaD0pcTjd2nCy2J2ibufhBKia5hh09qcNibo/640?wx_fmt=jpeg&from=appmsg "")  
  
搞过安全的都知道，想从普通用户骗到root权限，以前要么得拼手速  
⏱️  
（竞争条件），要么得搞玄学（堆风水  
🔮  
），费半天劲还不一定能成。  
  
但Copy Fail呢？没有竞争，不用重试，不用拼运气。写个极小的脚本，敲一下回车，啪，权限就到手  
👑  
了。这就好比你玩游戏  
🎮  
，系统不仅没封你号，还主动跑过来把“无敌外挂”塞你手里  
🎁  
，拍拍你的肩膀说："拿去随便玩。"这操作，简直把“离谱”两个字写在了Linux内核的脑门  
🤦‍♂️  
上。  
  
### "潜伏10年"的罗生门  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/bwYjpTUcUCK7ftnFP69bVrFSWKdAia8XoL3vJfkA1lhEqJSXOzpAkhvIqtMYYb8vMnLmaxB7lrxjx4kdSwibN5qLWcIT67dBF8icpp8Elxdvts/640?wx_fmt=jpeg "")  
  
新闻里都在刷"  
潜伏10年  
"  
🕰️  
，很多人以为是刚发现了一个10年前写的漏洞。其实不是，这事儿得从盖楼说起  
🏗️  
：  
- **2011年：留了扇破窗🪟。**  
内核里加了个加密功能，顺手留了个小后门（借用输出缓冲区当临时空间）。但当时窗外有堵  
🧱  
墙，坏人进不来，大家也就当没看见。  
- **2017年：脑子一抽，把墙拆了🚜。**  
有个开发者为了"  
性能优化  
⚡  
"，觉得这扇窗透气挺好，直接把防波堤给拆了。**从这一刻起，这扇窗彻底成了摆设，谁都能翻进来🚶‍♂️。**  
- **2026年4月底：扫地僧出现了🧹。**  
直到上个月底，才有安全专家溜达的时候发现了这扇没插销的窗户，顺手发了个朋友圈  
📱  
（公开披露），官方才连夜拿砖头把窗封死  
🛠️  
。  
  
所以，"  
潜伏10年  
"不是指雷埋了10  
💣  
年，而是"**这扇门敞着让坏人进出，已经快10年了，居然没一个人发现🚪，**  
"  
 细思极恐  
🥶  
。  
  
  
核心：只改“复印件”，不碰“原件”  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bwYjpTUcUCKicjokYR05k7rzEibjOtd5ubNhb9mShsiciaRNdYeIresy25EeiclHptiaJaTiagibX9Ze98ndrwa5Im12YRe7RkUKyWRKRmogtQdPSvI/640?wx_fmt=jpeg "")  
  
这个漏洞为什么叫"Copy Fail"？  
🤔  
它最鸡贼的地方，在于它的作案手法。  
  
平时咱们打开个文件，电脑嫌硬盘太慢，会在内存（工作台）里复印一份，这叫"页缓存  
💾  
"。  
  
以前的黑客提权，都是想办法去动硬盘里的原件。动了原件，杀毒软件、文件完整性校验工具立马就报警了："报告！这个文件被改过了  
🚨  
！"  
  
Copy Fail微微一笑：谁说要动原件  
😏  
了？  
它盯上了系统里用来提权的程序（比如 /usr/bin/su  
），然后**直接在内存里，把这份复印件偷偷改了几个字节✏️。**  
  
系统是个死心眼，它调取文件时看的是复印件。一看复印件："哎？你写着你是root啊，给给给，钥匙拿去  
🔑  
。"  
  
等杀毒软件来查案：拿出硬盘里的原件一比对，一模一样，清清白白。只要你一重启服务器，内存清空，作案痕迹灰飞烟灭，连个屁都查  
🔍  
不到。  
  
这叫什么？这叫**杀人不见血，借刀不沾血🥷，来看个对比；**  
  
**Dirty Cow和Dirty Pipe都需要"竞态条件"，简单说就是要在特定的时间窗口内完成操作，窗口很小，需要多试几次。**  
  
**Copy Fail不需要🛤️。**  
 它就是一条直直的路，没有拐弯、没有红灯、没有人拦你。成功率接近100%，小学生照着教程敲都能成  
👦  
功。  
<table><tbody><tr><td data-colwidth="114" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">漏洞</span></span></section></td><td data-colwidth="114" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">发布时间</span></span></section></td><td data-colwidth="114" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">代码量</span></span></section></td><td data-colwidth="114" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">成功率</span></span></section></td><td data-colwidth="100" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">难度</span></span></section></td></tr><tr><td data-colwidth="114"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">Dirty Cow</span></span></span></section></td><td data-colwidth="114"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">2016年</span></span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">几百字节</span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">需要运气</span></span></section></td><td data-colwidth="100"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">较难</span></span></section></td></tr><tr><td data-colwidth="114"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">Dirty Pipe</span></span></span></section></td><td data-colwidth="114"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">2022年</span></span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">几百字节</span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">较高</span></span></section></td><td data-colwidth="100"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">中等</span></span></section></td></tr><tr><td data-colwidth="114"><section><strong style="box-sizing: border-box;font-weight: 600;color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: normal;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">Copy Fail</span></span></strong></section></td><td data-colwidth="114"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">2026年</span></span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">732字节</span></span></section></td><td data-colwidth="114"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">极高</span></span></section></td><td data-colwidth="100"><section><span leaf=""><span textstyle="" style="font-size: 12px;font-weight: normal;">极低</span></span></section></td></tr></tbody></table>  
**云厂商看了要连夜拉群。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bwYjpTUcUCLd5tTCFUDicdA1ng8zFl8WRibgN51ic1M5cjzgVMrj8Gl4hoHFTLUicqtdia8YF8Ktm4RaRMiaYZPPGLgiarAl4r8Bdu7yKfZiaiahYqUY/640?wx_fmt=jpeg&from=appmsg "")  
  
如果只是黑掉一台虚拟机，大佬们还不至于这么慌。真正让全行业炸锅的，是它的"**越狱**  
"  
能力  
💥  
。  
  
现在的云时代，一台物理服务器上虚拟出一堆容器（就像把一套大别墅隔成很多小单间），大家其实是在**共享同一块“内存☁️黑板”**  
。  
  
你作为一个租客（黑客），在自己的小单间里用Copy Fail改了黑板上的字，结果不仅你自己提权了，隔壁的、楼上的、甚至整栋别墅（宿主机）的权限，全被你  
🏢  
拿下了。  
  
这也就是传说中的**容器逃🚪逸**  
。在K8s集群里，只要有一个节点中招，整个集群可能直接沦陷。  
  
云厂商要是没及时打补丁，客户的数据在哪被搬走的都不知道  
😱  
。  
  
### 吹了这么多，怎么防？  
  
别慌，对策非常简单直接。  
  
**🥇上策：老老实实打补丁。**  
  
Ubuntu、红帽、Debian等各大发行版早就把那扇破窗户换成防弹玻璃了。看看你的版本在不在影响范围内  
，在的话，赶紧升级内核，一步到位，  
这是最彻底的方案。各大发行版已经发布补丁  
✅  
，**如果你是用的云厂商，可以联系📞厂商咨询内核升级计划。**  
<table><tbody><tr><td data-colwidth="287" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">发行版</span></span></section></td><td data-colwidth="266" style="background-color:#a5c8ff;"><section><span leaf=""><span textstyle="" style="font-size: 12px;color: rgb(255, 255, 255);font-weight: bold;">修复版本</span></span></section></td></tr><tr><td data-colwidth="287"><section><span leaf=""><span textstyle="" style="font-size: 12px;">Linux内核</span></span></section></td><td data-colwidth="266"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">6.18.22 / 6.19.12 / 7.0+</span></span></span></section></td></tr><tr><td data-colwidth="287"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">Ubuntu</span></span></span></section></td><td data-colwidth="266"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">官方已发布更新</span></span></span></section></td></tr><tr><td data-colwidth="287"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">Debian</span></span></span></section></td><td data-colwidth="266"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">官方已发布更新</span></span></span></section></td></tr><tr><td data-colwidth="287"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">RedHat</span></span></span></section></td><td data-colwidth="266"><section><span style="color: rgb(59, 59, 59);font-family: -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, &#34;Helvetica Neue&#34;, sans-serif;font-size: 13px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf=""><span textstyle="" style="font-size: 12px;">官方已发布更新</span></span></span></section></td></tr></tbody></table>  
**🥈下策：实在不能重启，拿木板钉死。**  
  
如果这台机器是核心业务，祖宗十八代都不允许重启，那就下命令把出问题的那个内核模块（叫 algif_aead  
）给禁用掉。  
  
（  
注：  
🙏  
如果你用的系统比较奇葩，把这个功能直接焊死在内核里了，那木板也钉不上，没得商量，乖乖找时间升级吧。  
）  
```
（1）永久禁用
echo "install algif_aead /bin/false" | sudo tee /etc/modprobe.d/disable-algif_aead.conf 
（2）立即卸载该模块
sudo rmmod algif_aead 2>/dev/null || true
```  
  
检查当前是否已加载模块  
💻  
```
（1）执行 lsmod | grep ^algif_aead，无输出说明当前未加载；
（2）检查永久禁用配置是否生效：执行 cat /etc/modprobe.d/disable-algif-aead.conf，
输出install algif_aead /bin/false，说明配置正确；
（3）验证模块是否可被加载：执行modprobe -n -v algif_aead，若返回install /bin/false则说明加载请求被拦截，禁用生效；
（4）（可选）检查是否有进程正在使用AF_ALG接口：lsof | grep AF_ALG，无输出说明无业务依赖
```  
###   
### 结语  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bwYjpTUcUCLu6MHw1Ig4O5VRUUAiaia4Dq1tMqDYUKH30kxXdpoE1LEHJQ1ssnvSnb8adqmLsYb8icHCW13uDWtejp9ribdHUgmJYlsEbQdQuuc/640?wx_fmt=jpeg&from=appmsg "")  
  
网络安全里有一句老话：**所有打着“性能优化”旗号的补丁，最后都可能变成安全人员的噩💡梦。**  
  
2017年那个为了“就地操作优化”提交的代码，估计自己都忘了。但代码就是这么现实，你欠下的技术债，十年后  
它连本带利让你  
💸  
还。  
  
好了不说了，我要去催运维老哥打补丁了，咱们下次再巴拉巴拉...  
🏃‍♂️  
  
  
  
  
  
[深圳]()  
          
  
**注释：如有失误，望批评指正！**  
  
**后面会写下Windows和liunx的应急响应技巧、容器、还有一些网络安全、数据安全。**  
  
**后台输入“Windows应急响应手册、linux应急响应手册、数据安全政策、数据安全治理、电力、工业、金融、0731、0830、0911、2026、007”有相关资料可供下载！**  
  
