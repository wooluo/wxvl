#  Spring框架相关漏洞案例分享  
原创 神农Sec
                        神农Sec  神农Sec   2026-03-19 01:00  
  
  课程培训  
  
  扫码咨询  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fchVnBLMw4kTQ7B9oUy0RGfiacu34QEZgDpfia0sVmWrHcDZCV1Na5wDQ/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
  
#   
  
专注于SRC漏洞挖掘、红蓝对抗、渗透测试、代码审计JS逆向，CNVD和EDUSRC漏洞挖掘，以及工具分享、前沿信息分享、POC、EXP分享。不定期分享各种好玩的项目及好用的工具，欢迎关注。加内部圈子，文末有彩蛋（课程培训限时优惠）。  
#   
  
  
01  
  
0x1   
Spring框架相关漏洞案例分享  
  
### 漏洞一：druid漏洞  
  
这里通过检索druid关键字，发现子域名可能存在druid协议，那么就可以尝试打一波druid漏洞  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVXd2sLJ1PTYY4vXdONhYGPOCiawR2Rm1AcshYsD16Sw1ibl9nG8ico27kjzmBxtltr4QpPSAcfG3tw2gic9797hMGFE02F0LGqFOo/640?wx_fmt=png&from=appmsg "")  
  
img  
  
通过拼接druid的登录接口，发现确实存在druid登录后台  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXlsCmSOmde5cak1X0eI971jtw0icFmnIibHBVp8bdgZ6PPuJMo3eXTibicmTQYr7iaRUJf6wMEaaXzDJr14w669IrVFicecmZOPqHw4/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后就可以使用druid的常见弱口令，发现成功可以登录druid后台，然后后面就可以使用druid工具打打nday啥的了  
```
常见用户:admin ruoyi druid常见密码:123456 12345 ruoyi admin druid admin123 admin888
```  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWLjbVFHJV5TcE8OPWnx9aQrM1vK3XTgWMVRX0aicaudW8Hib5eN63UdhdaicLnTGYiaupmsnqDC2Usl2vuZ0cJLMxMj3owsaMgic4w/640?wx_fmt=png&from=appmsg "")  
  
img  
### 漏洞二：spring-boot未授权漏洞  
  
上面既然发现了druid，那么我们就可以使用曾哥的spring-boot工具进行扫一波  
  
可以看到下面泄露了很多的未授权接口目录的信息，且泄露的页面长度很多  
```
python SpringBoot-Scan.py -u ip
```  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUY4ZL0ibmPicaibU4y7T4bq2vSqrtGWytWApOJKdc2nxkDv4Yq2VHGqrT91K5cTdEYepVE4BYGNZ4eT3IiaNAOCrRQ8JGmKYtaQ60/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面泄露了很多的接口信息，下面可以进行挨个访问看看  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWmMZIxaDVtyEBWFEgJEsBIMHwC6HxoWZE1M6S5GXicyXfRlWHCBryONzc32fmYm5lvbskI4bJJ70SpzIibNiamOHlMDBI6BVLic1U/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUXnIq0Z564XSuOeqaG157xATNuNs3SHo9bCicbCUSic4q4jWbjtIlJkicibXyjenIPpXnVYF52TgU9ibFFxNQBHqc3eH5yJGquibcFo/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面是常见的spring-boot接口泄露的相关信息，都可以去尝试访问下  
```
/actuator查看有哪些 Actuator端点是开放的。/actuator/auditeventauditevents端点提供有关应用程序审计事件的信息。/actuator/beansbeans端点提供有关应用程序 bean 的信息。/actuator/conditionsconditions端点提供有关配置和自动配置类条件评估的信息。/actuator/configpropsconfigprops端点提供有关应用程序@ConfigurationPropertiesbean的信息。/actuator/env 查看全部环境属性，可以看到 SpringBoot 载入哪些 properties，以及 properties 的值（会自动用*替换 key、password、secret 等关键字的 properties 的值）。/actuator/flywayflyway端点提供有关 Flyway 执行的数据库迁移的信息。/actuator/health 端点提供有关应用程序运行状况的health详细信息。/actuator/heapdumpheapdump端点提供来自应用程序 JVM 的堆转储。(通过分析查看/env端点被*号替换到数据的具体值。)/actuator/httptracehttptrace端点提供有关 HTTP 请求-响应交换的信息。（包括用户HTTP请求的Cookie数据，会造成Cookie泄露等）。/actuator/infoinfo端点提供有关应用程序的一般信息。
```  
  
在/actuator/env直接拿下该账户密码  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUNQJEDzXzicXyW2cNHljySVaibKm3osnXBeCiaSqUtlS4kv3Z7Qc4CicOwx50zXs7QxcvcHVpLDqQNgvqAdvJgkiaAaG05ljSpQTiaA/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后这里直接访问这个下载heapdump文件，然后再使用heapdump工具进行检测里面的敏感信息  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVic2iacKx9cLEmFXKcqKJtXePSavtJ4X2nPP6iawjkd7XNBVrMM11m6hUB74xeZsN7cHA5qDnPACy1QzBze501o8CNKpAoSxhsC0/640?wx_fmt=png&from=appmsg "")  
  
img  
  
使用脚本工具进行分析，里面泄露了很多的信息，可以去里面收集很多的账户密码，然后还有OSS储存桶相关账户信息  
```
java -jar JDumpSpider-1.1-SNAPSHOT-full.jar heapdump
```  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVkb3TL7v1P6tLIaJibicEGdN5VNAgNu9fh8u65dkI4fP4mmcFBAEAUX4UEdYvHPPfkaxtyMovLnTEqLQW2qodusMRfSLYK9GVdI/640?wx_fmt=png&from=appmsg "")  
  
img  
### 漏洞三：api接口未授权访问  
  
这里我利用这个站点直接看里面的js接口，使用findsomething插件看看有什么常见的api泄露的接口，但是在这个插件中没有找到什么有价值的信息泄露接口  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU8Gia60HUW6XWwJ35iaWqZrGXzTOM4z4NwHUkuhibo2mjoF2SQmtagLqzBvPUHkmP0YzwIkHQwDK58aepYepzVjkzdQohPaDHdTM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面可以尝试F12查看该站点的js文件，看看有没有常见的api泄露接口  
  
直接在源代码里面检索文件里面的所有api接口，然后挨个去尝试下  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWib2miavibs5e3UvS32tTmOSGbkq0Sibm11DqhfIfjN7m7PAeHTSkuxHhAtibPDLlCibWlFic2zRap0IZxewlxY9Myl2qPH74WwLB5Ig/640?wx_fmt=png&from=appmsg "")  
  
img  
  
可以看到下面的这个api接口是可以成功访问的，直接一手未授权访问  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVlic3wC5Z2tMSdZUyYSNvlbSl3NHoIiaulcwgMgfNIG5zX2CaWRBWogzmlX6UFiaK5JyiblzVVnnfNjKHz6CwUmh1nVhxk3ucfC0c/640?wx_fmt=png&from=appmsg "")  
  
img  
### 漏洞四：Swagger UI信息泄露漏洞  
  
上面泄露的api接口使用Swagger UI插件访问，可以看到下面右下角是没有加密的，也就是我们可以尝试下面的GET、POST请求方法去打一个api接口未授权  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QV9fRib7CJGTGAhvkbpv4A5FKGDzibyWrpB9SoL9DfNLj89YDBDD5icfmZkGaFSujS9d5qwznz0dnJKyTLBG1EeQdsgibEnWJ0dU1g/640?wx_fmt=png&from=appmsg "")  
  
img  
  
这里我们可以通过bp爆破去遍历一下id用户信息  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUF4mQbnadAQics2plo04NbQ6dpyWFoMDUMZGiaKjLIz700pibW4zEqDFP4u0PUAqMS4F1FZtuMu2wx9B7JwEffIOVc1nvQMEpZbM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXicSMZ94uJul7anKOgNJTsgQNot5CcJibSiaXTrJPQqdec27ficNmh57LbOribqYEeibNnpIhmD21ysUxrEibyMQttg8mxPCicYEQ42Fc/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后里面还有很多的这样的信息泄露的接口都可以尝试未授权访问，看看有没有什么敏感信息泄露  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QX6wS3lqjWibmTNMib9VZClDKIeEnWoFia7SGKuEWCSLLR1gtOsicbc2oia69lic8kAFwM6pZs27QFBvJgInVVtQdvSGr7BM8ia3V8HhM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
02  
  
0x2 培训课程介绍  
  
26  
  
**SRC漏洞挖掘培训课程**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/6cIuvSQkkicOHhYFkQLTibYAMUR9rfZ9eUrI78toIC4V2304G909O6s6CnVrAGiaYLEJM9XuUARhzNfxCtYKQfQ83wfPSlqpshSScfoYzSKzgY/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&watermark=1&tp=wxpic#imgIndex=4 "")  
  
  
**1.课程价格目前是400（后面也会随着人数越多，涨价）🌟师傅们还可以上车补票，冲冲冲！**  
  
**2.报名成功送知识星球一个，拉内部小圈子交流群+SRC直播通知群！✨**  
  
**3.一周2节课程，直播+录播形式，课程内容大家可以看课表，目前是第一期，一次报名永久无限听课！❤️**  
  
**4.目前是第一期课程，后面比如说开了二、三期，都是不用在花钱的！**  
  
**5.上课结束后，会把视频录播+课件笔记一起打包发直播群！**  
  
**6.哔哩哔哩SRC课程公开课，链接🔗直达：**  
  
**https://space.bilibili.com/642258933**  
  
SRC课程详情🔎：[神农SRC 漏洞挖掘实战课：从 0 到 1 成](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
[‍](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
[为赏金猎人](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
  
内部小圈子知识星球详情🔎：[强烈推荐一个永久的SRC挖掘、渗透攻防内部知识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QVcCkxIUpaBmNic17zibGfXMWrr9z89gE0DFtbOu3QYzD5d62zsp6qwc38Pssk60mLq8VKthcMOmctVlHU716S5G4KYmrKVrEj5c/640?wx_fmt=other&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
开课一个月时间左右  
，课程目前已经  
累计加入了478个学员  
了，课程培训招生任火热持续中，师傅们  
对于我们课程感兴趣的，想要学习技术，找工作的可以咨询我报名  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVmU3RvFrAIvjU6mIpGP1hn4Yz0XPbNcz6FtP6rcQzkKp8oDd0tNoMLRSKaraRTkKXmMT3YmXj0Ft1jr30OcBEzfsqics9qwia6g/640?wx_fmt=png&from=appmsg "")  
  
课程培训记录📝，每次上车在1-3小时之间，上课包括课程内部群大家  
交流氛围很好！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVITh8VvNrnXLk1uuBSYeYtdOxg96gnicdvmpa2GhwOVTvBGzKEA5ktu7C7wqFYWWRuYZgKmsI8TAoYFia1uC8iaiaLvUNXS7JMMqU/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18 "")  
  
课程上课笔记课件📒都会打包给师傅们，笔记都非常详细，很多几k价格的培训机构哪怕是课件笔记都没有的，我这里都是下课第一时间把  
录播+笔记打包发给大家！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWbRV4mBn8GZHrvHocPMYYcBuAM3gyIKOM0SicBWQhywMehkXInvEerRLySOPPMzEmM2GLSlOMFREx6QItqtCgCibGs2MeY6yvu0/640?wx_fmt=png&from=appmsg "")  
  
平常也都会给学员进行一些项目发布，包括后面的  
工作、护网内推等，经常上麦交流，大家互相学习，简历优化等。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXvjjkgJibDEUhdDjErjibiangGsN0rqb0Av59xfyxBbDrTMNdfIAhNXlx0HQKvxIVBIEGAAbYrEENzd77j65asejlD4a50Sb4U7o/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20 "")  
  
SRC漏洞挖掘课程培训已经两个星期了，期间也是创建了  
“回本小群”，希望学员回本越来越多，创建这个群主要是鼓励学员学习进步，以及不定时发小项目！  
  
最后也是希望大家都可以赚钱，找到好工作🎉  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVHo5bYVAoTlYpmjK5p9RsUBWmHBibRU9caiaDnrrVvf8kVeW9xKcqv2BvctHgMQT0xGzwU49zVQlyt3vuJgnju8BBvyMo6agNKQ/640?wx_fmt=png&from=appmsg "")  
  
培训时间不长，感谢🙏师傅们的  
喜报  
，很开心看到师傅们给我分享自己的成果，  
希望师傅们越来越强！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUMAtEWv3xXZPDsGBRhESmwGRciaasCGibU8TtbP2U0YVZPBdf5tlLqpWAtQKBh5oFwgETyvicKBeW1JSsekAyJ5cbRlSdjooQkSM/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=22 "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUrS4N68nZ0EyE76Wkib7ZDrpnZWw2Q1RJQvFEdIOu5XvFGCwpz9lziabKyo9C9d5ZiamibuSXlibhXLHb7b8QJhqEIs3hXvqktkkyA/640?wx_fmt=png&from=appmsg "")  
  
  
平常也会分享项目，下面是一些  
学员项目成果  
，群里报课的学员都是不抽成的，主要是帮助学员进行  
回本  
，  
让大家都可以进步！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
上课结束后，会把  
视频录播+课件笔记  
一起打包发直播群  
  
「神农安全」知识星球目前已经  
累计1800+网络安全爱好者的加入！  
  
后面也是小圈子做大起来了，师傅们也都喜欢看我文章，想着给大家教下src漏洞挖掘思路，所以自己花了很长时间做了✨  
课件和课表，都是纯自己手搓的，大家也可以看下课表的内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthM2sjuWQFbmvWv79V058KwI0DswFF9LysewGtULj81Vp5bX9nTEK78A/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVhliaOc71FnQLZjEUB2QiavqaRdiaaAN25Gb1HNADIy0cYvIIHC46za7Ab6sibRKvKG2tbJBxqrOGyczqWF44LQOKllnZXE6PU5iaE/640?wx_fmt=png&from=appmsg "")  
  
03  
  
0x3 课程特色  
  
课程  
主打真实，  
一线SRC漏洞挖掘师傅是如何学习和挖掘SRC漏洞的，让你真正了解SRC漏洞挖掘，助力在岗人员和大学生的能力提升，掌握新的技能树，为下一次  
跳槽涨薪做好准备。本  
课程内容覆盖企业  
SRC、众测项目挖掘、护网HVV红蓝攻防技巧、CVE、CNVD、EDUSRC等平台通杀案例技巧挖掘方法。  
  
本课程  
适合人群  
（光看不挖啥也不会）  
```
1、想从0转行入行的大学生或自学者
2、想从CTF比赛/Web或SRC进阶到项目实战的选手
3、想参与项目/找工作/提高收入的转型者
```  
  
课程价格：400元  
  
报课成功的师傅们直接免费送内部小圈：一个知识星球+内部小圈子交流群  
```
1、课程价格真心实惠，绝不割韭菜
2、两三百的课程价格让你体会大几千的培训课程内容
3、带着大家从0到1，本人上课坚持手搓课件（实战案例+知识体系）
4、拒绝使用PPT演讲模式（无实操，很枯燥）
```  
  
直播培训教学方式  
  
课程  
一周1-2节课，课程特色涵盖直播多人上麦活跃回答，直播过程中有问题随时解决或私信我。  
拉微信群：一个知识星球内部小圈子交流群+课程培训直播通知群。有项目/工作/护网第一时间内推报课的师傅，  
一对一简历优化，助力在岗人员和大学生的能力提升。  
  
一次报名每期均可永久学习，并且赠送内部「神农安全」知识星球，一对一永久解答、无保留教学！  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
课程均为线上交付，报名成功后  
不支持退款  
  
内部小圈子  
（知识星球+内部小圈子交流群+知识库）  
  
对内部小圈子感兴趣的师傅们也可以看下下面的这个  
跳转链接，里面有对小圈子的详细介绍，报名课程成功的师傅们直接免费送一个（直接点击下面直接可以跳转）。  
  
[强烈推荐一个永久的SRC挖掘、渗透攻防内部知识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVTgWHud84yTCoykuHLJU9nbwIgQ6QMWwxCjwKNhClicETT9kYH0X5NBpmNVVQQxN9GvBGRQJCZZ4xDnW5nmN81Hq4DqNeMvod0/640?wx_fmt=png&from=appmsg "")  
  
讲师介绍  
  
id：一个想当文人的黑客  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthqvGuVSjkR43eeaNibf1KbGU4nia5ibXFYpTBFeAbQewTq43IqJHIMhhhg/640?wx_fmt=png&from=appmsg "")  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
04  
  
0x4 第一期挖洞培训课表内容  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWVMibw6HiaoHUxJgNHUVfqCicbGSauW0QQBjLcC9H4gdOEyW3ZzLjTfyYibqGdaSueO9GDbbyicmckia2Kg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap086iau0Y0jfCXicYKq3CCX9qSib3Xlb2CWzYLOn4icaWruKmYMvqSgk1I0Aw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**内部圈子介绍（报课赠送）**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap08Z60FsVfKEBeQVmcSg1YS1uop1o9V1uibicy1tXCD6tMvzTjeGt34qr3g/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
  
  
**圈子专注于更新src/红蓝攻防相关：**  
  
```
1、维护更新src专项漏洞知识库，包含原理、挖掘技巧、实战案例
2、知识星球专属微信“小圈子交流群”
3、微信小群一起挖洞
4、内部团队专属EDUSRC证书站漏洞报告
5、分享src优质视频课程（企业src/EDUSRC/红蓝队攻防）
6、分享src挖掘技巧tips
7、不定期有众测、渗透测试项目（一起挣钱）
8、不定期有工作招聘内推（工作/护网内推）
9、送全国职业技能大赛环境+WP解析（比赛拿奖）
10、十个专栏会持续更新~提前续费有优惠，好用不贵很实惠
11、每日内部资料分享，内部圈子资料1000+
12、联系圈主获取：内部漏洞知识库+圈子使用手册+内部圈子交流群
13、VX：routing_love，技术交流+疑问解决
```  
  
  
**内部圈子**  
**专栏介绍**  
  
知识星球内部共享资料截屏详情如下  
  
（只要没有特殊情况，每天都保持更新）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWWYcoLuuFqXztiaw8CzfxpMibgpeLSDuggy2U7TJWF3h7Af8JibBG0jA5fIyaYNUa2ODeG1r5DoOibAXA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWUw2r3biacicUOicXUZHWj2FgFxYMxoc1ViciafayxiaK0Z26g1kfbVDybCO8R88lqYQvOiaFgQ8fjOJEjxA/640?wx_fmt=png&from=appmsg "")  
  
  
05  
  
0x5   
优秀学员报喜  
  
下面是最近一个月培训期间，很多  
优秀学员进行报喜，看到师傅们有收获，也是感到很开心的！  
拉回本小群，就是为了促进大家学习，在群里发学员成果，也是为了让大家学习优秀的师傅们。  
  
加油，你我皆是黑马！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWK7cWZiaiatmAfXNWyj732Fib2ntZRWjFR4rfftXb2LoeicNAMZPrbBJFR2Ybf9XmWpqOiammYbiaxoQN5q5XRXo5xPicld4PhTtPtCI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU6ibZutPq43zUiap7IgDmJq7kwUKJBCa2IDujYiadMJfe9fFH9DOfUEOM2TibibYRuFiahDqMnBX1MVjLw5XIdNDSuR5P3g7XibaUkBo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVz2wFpVfer0uAFVpLKyicMaaLkmJDdg5bWnOotuzN3S9r2FMKpEKrJy8ND7icWVzNgqyYS2J6XElVN43vGca4X6HcEqapwGcNX0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWLzyCczAqyEgBN7ibpfzJQonkfJ9PeHWlbbz7pBG5xmiauw81a4dS7EkcoG33YvUTiawb2hnOrfCViaAs0kN15Qv88b8xbCB82JrQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWR2FjdMjH8n9LoMESXkIibV1hSJias6y1uXYFPcNJS7uVVCCym2QicIdp6N1q3QicfwkqtVpsWe8Ld1xfQiagucjrgl8ibrJzII2LGc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXB1O6Fx3ia62NNWITh9vUQaEKp7epibLWeEsdobibvBvqNDoTCAvfyQFHw597O24naJAIpM4QALgfqMWWc4E1KHrxBoaGRxE4Ajc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXnjwIRWjJOVSuN4X4HjmEFtCVqCHZ05M77sXqzmVjibaJbLUw3ApOuz7iaH8OCCnRmTRYVtKC5NajGKVkI4pnKZsJaj0T4iaYibq0/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUm9nL5FsCxBKWrhMmwpgVvr7x7IfEu2IQPQuXMiaJZSHDyNDib5qoA3tGvfW8TUfShOKvIDuia32oSqb9YN1ghaxaKAicW6uKxrvU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWRdtEUY2aeAZh34wDle515j7UwnibFQeCibWSeDKGnIZ2YH5VGX64cYeXgPGdCwHLKdsMY07EIVliapxh10gzQ2EO3bks7bxhmVs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXwfrgic5XLseOxkPOWkjm1yicAW2ZiaAqzxtbjPok4Yhic2Wiblic93SSGN5BtT77AFuZt6ySuRL09icqIicPuOUUbL5NbWgMCHgLictiak/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWpzNI7sn0dCdaebEyMXY3Gx9tkNjicAiaEctakpWVtl4evP95MOl9ErgT9NYQiaF6dCt0FGFPziaVxz9QuE5SsiagkJYNicRR18lVb0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWzKmnCemQquDBf5uFwcpaG7RQqSPVwKqOKjrFxkCicFVTh6ngv3LOGDY1InR2mj0D6iby2A3Adic9U6MMsJ8FIo2wwxzPswjHsIQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWdXaOziavIFibdPXHERG5Vkz13uwaiaGO3SJqvllW0tPxV0n4bmGlAQptLjxR1z24cLAMXqE2KqUb9WwnDSBKj2GYAW0zeHWX1YM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU0zKGNkZEg53VP15XfI98bHZLibNbia3JDPEVzoe6wscFq3JY2UibD6Esp0Xz4rPY3VIp3xsT0ocSmGyjuASribI6eRiaMoNSyIh4k/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXQJcAmd5OVIoq1znICoW1Sy9hTsxpwe9HsiceptQ58rFYCNibBonWQQEH1TB3IrMASTQ3icWHwRd7JDtBwAwibWEGZxvIxeseTiaIY/640?wx_fmt=png&from=appmsg "")  
  
  
  
**神农安全公开交流群**  
  
有需要的师傅们直接扫描文章二维码加入，然后要是后面群聊二维码扫描加入不了的师傅们，直接扫描文章开头的二维码加我（备注加群）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QWHBQ9zBgY25wF0tKOS1rxurgd4mdGZibT7Miau6eU6J8dc7KnkTzw9S6acjBqnUeehPOfPiaAhMmqAwkz3zDAgB8lbt4C5csHHKs/640?wx_fmt=jpeg&from=appmsg "")  
```
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/b7iaH1LtiaKWW8vxK39q53Q3oictKW3VAXz4Qht144X0wjJcOMqPwhnh3ptlbTtxDvNMF8NJA6XbDcljZBsibalsVQ/640?wx_fmt=gif "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
**往期回顾**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[手把手js逆向断点调试&js逆向前端加密对抗&企业SRC实战分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247495361&idx=1&sn=48283073b325e360823da8dec27a7508&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[浅谈src漏洞挖掘中容易出洞的几种姿势](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247489731&idx=1&sn=c3a5ef01648fad496ecda36b653b6e21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[HVV护网行动 | 分享最近攻防演练HVV漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247488672&idx=1&sn=493bb70011a02eb971ff1b74c733f1d9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[攻防演练｜分享最近一次攻防演练RTSP奇特之旅](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492377&idx=1&sn=a94ad30e30e08bd96e888dad744e9814&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[JS漏洞挖掘｜分享使用FindSomething联动的挖掘思路](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492315&idx=1&sn=88991e98058a277e267a9a79b8518e16&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 从jeecg接口泄露到任意管理员用户接管+SQL注入漏洞](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493292&idx=1&sn=611fd43361089a30e5f7bcda21274b95&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[分享SRC中后台登录处站点的漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247485439&idx=1&sn=3fd7e4cef57edca8e73104f8af38fc05&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[企业SRC支付漏洞&EDUSRC&众测挖掘思路技巧操作分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492839&idx=1&sn=b9781f60580c1da8e2151166f0494ba5&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 分享某次项目上的渗透测试漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493495&idx=1&sn=791bebc6faa651cc3c585c2f5f481d21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】分享云安全浪潮src漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494877&idx=1&sn=2d00c0f651fd7375e881be86638e53ce&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[实战SRC挖掘｜微信小程序渗透漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494468&idx=1&sn=f0da4b4ff7763cbb83b858fb5a8964f9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[综合资产测绘 | 手把手带你搞定信息收集](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493749&idx=1&sn=d2e0febcdcf9dcd8aa44be0d43b51936&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】针对若依系统nday的常见各种姿势利用](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493489&idx=1&sn=d3ef10a1ae3b8c161d7174cb42702fac&scene=21#wechat_redirect)  
  
  
  
