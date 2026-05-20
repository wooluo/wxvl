#  【SRC实战】|两个小程序之间的越权漏洞  
原创 隐雾安全
                    隐雾安全  隐雾安全   2026-05-20 01:00  
  
📝 **编者语**  
  
有时候挖洞就像“解密”。  
  
一个原本没什么头绪的小程序，一个看起来没什么用的字段，加上一点“这俩东西会不会有关联”的猜测，最后慢慢把漏洞解出来。  
  
这次分享的是一次比较典型的水平越权漏洞挖掘过程，重点不是漏洞本身有多复杂，而是：  
  
**信息之间，是怎么一点点串起来的。**  
  
1  
  
本来都放弃了，结果小程序把我“串”进去了  
  
最近在挖某企业 SRC。  
  
说实话，一开始其实没什么头绪。  
  
打开一个微信小程序（后面叫它“小程序 A”）之后，第一感觉就是：  
  
很普通，就是一个学校作业系统。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lARibkuGlZNKKicfbFAmh19HL5n4CsKOTOfQasrB1ABuficb0BfNuibGOFSAJFTIPU1AhcJIoOwibfl3iag5sOjN2lZucWKDLlccvzE/640?wx_fmt=png&from=appmsg "")  
  
2  
  
实战过程  
  
**① 一个“没什么用”的查询功能**  
  
在小程序A里随便乱点。  
  
看到一个通过手机号查询信息的功能。  
  
于是随手输入了一个测试手机号：  
  
13111111111  
  
返回结果里出现了一些内容：  
  
- 用户名（部分打码）  
  
- 学号  
  
- 学校  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lAqUwkffGGW5Khz5j6uSLNcOOy2Nb0n2afJtRNdNRlgON40evDNKibn5HzHuGE7hj0n3WriaI8xicptic1kxtqia1l26RI9Rw1NVp0/640?wx_fmt=png&from=appmsg "")  
  
但问题是：  
  
这些数据并不完整。  
  
因为：  
  
- 用户名是打码状态  
  
- 没有明显敏感信息  
  
- 返回包里也没有更多字段  
  
  
  
 如果只是这样那就是安全，关机  
  
  
**② 正常情况下，已经切目标了**  
  
但那天刚好没什么事。  
  
于是我又顺手打开了这个企业另一个相关的小程序（后面叫“小程序 B”）。  
  
结果这一看，还真发现了点东西。  
  
  
**③ 小程序 B 里的“添加学员”**  
  
进入个人中心后，我发现一个功能：  
  
添加学员。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4nuKZ91wo0BGCz6oUmHpwCVe0IrVe0r1fVjlLHug88biadRzC65k7cTOick46RvNz3Jv5PJgia4D5ibWIggZic2DU3BeluMTia9tKQvY/640?wx_fmt=png&from=appmsg "")  
  
功能支持两种方式：  
  
- 手机号绑定  
  
- 学员号绑定  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4n6YNMw6Oiaria1tInHIy1ibSjgU8yE0bfEJOWpCMiboHg99JSqdACibokdEtQjJib30no89bqLqY42NueFKtsXoZ0Eqiban8KSH6WuRQ/640?wx_fmt=png&from=appmsg "")  
  
  
**④ 一个让我突然开始认真起来的字段**  
  
因为：  
  
“学员号” 这个字段，看起来真的很眼熟。  
  
我回头看了一眼小程序A返回的数据。  
  
发现：  
  
**小程序A里的“学号”，格式几乎完全一致。**  
  
这个时候我的第一反应就是：  
  
这两个系统不会共用一套数据吧？  
  
**⑤ 尝试绑定学员号**  
  
直接把：  
  
小程序A里获取到的学号  
  
填进：  
  
小程序B的“学员号绑定”。  
  
结果：  
  
绑定成功。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4nMNcic0JIFapgLG510WjyFsgsgGK5DSvr3BJ3NP1uicliaofexPH6NfZaVuOAd1LMEibxvbibOSnOKP5lxMZb7Nl3pbhMSAdibJz3U4/640?wx_fmt=png&from=appmsg "")  
  
  
**⑥ 信息开始“明文化”**  
  
原本在小程序 A 里：  
  
- 用户名是打码的  
  
- 数据并不完整  
  
  
  
结果到了小程序 B：  
  
👉 信息直接完整显示了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lEjpdOhQfdSOuoYCMhdJm8NOrPuic2paHU8x9g9zRSiaUd29ptQRbLnmicOF6YYXNicyRQ3AicyXYqnA9Fy36p0yIW0AeoPDHvLCPQ/640?wx_fmt=png&from=appmsg "")  
  
这一步其实已经能确认：  
  
**两个系统的数据确实是互通的。**  
  
  
**⑦ 继续往下看接口**  
  
这个时候事情已经开始有趣了。  
  
因为很多时候：  
  
- 数据互通  
  
- 用户绑定  
  
  
  
当看到了信息名片下面有一个获取验证码，想着会不会有验证码回显导致的任意用户绑定，  
  
于是经典流程：  
  
抓包。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lw3FXkGrvgETicRNyeibH2hFxydgCgTLlx93ia7sG70LLqHaZe91vsaAPDuEo0brI7Jxx486Hdak1wzOu4m9q6Glw8bu0HGEibUaI/640?wx_fmt=png&from=appmsg "")  
  
遗憾的是，该发送短信的接口不存在验证码回显。  
  
**⑧ 两个关键参数**  
  
但在接口里，我注意到了两个字段：  
  
userId  
studentId  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4mzwo11CibgQOr3Ss57w226n2BHOr5qsbdYxfv4tAMaRjl06UJ0iacQzYurqsnZ3XRsIUgic2IMcBo8KuafG8GbpwtWAFWsRn2xu4/640?wx_fmt=png&from=appmsg "")  
  
测试之后发现：  
  
参数  
  
含义  
  
userId    当前登录用户      
  
studentId    被绑定学员      
  
**⑨ 动脑时间**  
  
因为：  
  
studentId是可控的  
  
所以有没有可能存在越权？  
  
**⑩ 开始寻找“修改类接口”**  
  
因为很多时候：  
  
- 查询接口  
  
- 绑定接口  
  
  
  
只是铺垫。  
  
真正容易出问题的：  
  
往往是修改接口。  
  
于是开始翻个人中心相关请求。  
  
最后找到了：  
  
修改个人信息接口。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4kicHgk3bZ7JysdIQbBYVm4lP24I1ibQnkYqwH7eXj0AlnhUI4q7ibDVkl2MsPDwLVtkyoqCIiaQ5bLsrb9ABDic77XPoESOYy3E64k/640?wx_fmt=png&from=appmsg "")  
  
  
**⑪ 直接替换 ID 测试**  
  
抓包之后。  
  
我把：  
  
自己的studentId  
  
替换成：  
  
之前获取到的目标studentId  
  
然后重新发包。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4krWyboxaQS246YX3XicWzu8wxG3ICJITiaJNcabd0n6hBkMlrwp9FXunj3WxlbTwDCVM18zFVe2tibKVic5lqeE1ZiajvK9Tn2RO48/640?wx_fmt=png&from=appmsg "")  
  
  
**⑫ 越权成功**  
  
接口正常返回。  
  
一开始我其实还不太敢确定。  
  
于是重新查看目标账号。  
  
结果发现：  
  
对方的信息已经被成功修改。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4mPQHT1Eq5OY9ia2hvGdD2uhyXDrZ3KSRYUz3UoqlTDvO89IpHcQtVFVOQzk1hicnia5a6IUyG3308kL0FfWjIY8Rzys2xRw3kdtU/640?wx_fmt=png&from=appmsg "")  
  
3  
  
漏洞带给我的思考  
  
这个漏洞没有特别复杂的技术。  
  
没有：  
  
更多是：  
  
“你有没有把信息串起来。”  
  
  
**🔹 很多 ID，来自别的接口**  
  
现在我测试经常：  
  
先收集各种ID。  
  
因为很多越权：  
  
其实不是“猜出来”的。  
  
而是：  
  
从别的接口慢慢漏出来的。  
  
  
**🔹 多系统之间，往往会共用数据**  
  
尤其是：  
  
- 小程序 A/B  
  
- 官网/H5  
  
- App/后台  
  
  
  
很多时候：  
  
共用的是同一套用户体系。  
  
  
**🔹 修改接口永远优先级很高**  
  
因为：  
  
查询接口更多是信息泄露。  
  
但：  
  
修改接口，才真正决定影响。  
  
这次漏洞最后也顺利提交通过了。  
  
但比起漏洞本身，我更大的感受其实是：  
  
**很多业务漏洞，重点不在“打”，而在“串”。**  
  
  
🎁 文末福利  
  
联系客服获取《越权漏洞实战思路整理》  
  
**!**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/DJX1rNqJe4kECoSxLQfbQwmhiazrXhgKO6OXDd29ic8cRwPenHqT21Yjd0IGVfuY1SVtT6EibN8HhicR3icDCAlnia3emuB30pvia6ZYKplEd8ic5ibA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**微信号丨**  
Hiddenfog001  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lmF1icXQDQgCoWAhY8hCeVqMnVHwj0bX8LMaZyPhfkMVEZqsbRia5CibgDGvfxddNIIakROtBhqtpL5YTNhiaGmNRMkEX7iaoHs7n0/640?wx_fmt=png&from=appmsg "")  
  
  
  
