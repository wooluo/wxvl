#  EDU某两个证书站的任意用户覆盖漏洞  
zkaq - kkknet
                    zkaq - kkknet  掌控安全EDU   2026-03-23 07:17  
  
扫码领资料  
  
获网安教程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcrpvQG1VKMy1AQ1oVvUSeZYhLRYCeiaa3KSFkibg5xRjLlkwfIe7loMVfGuINInDQTVa4BibicW0iaTsKw/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=0 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fchVnBLMw4kTQ7B9oUy0RGfiacu34QEZgDpfia0sVmWrHcDZCV1Na5wDQ/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=1 "")  
  
  
# 本文由掌控安全学院 - 腾风起 投稿  
  
**来****Track安全社区投稿~**  
  
**千元稿费！还有保底奖励~（ https://bbs.zkaq.cn  ）**  
# 事件起因  
  
作为 EDUSRC 平台的长期守门员，每次证书上架都很激动，因为刚上架的证书站是最好挖的。同样的，这次测试过程也是一次意外的收获（捡漏）。  
  
在该证书站上架的时候，找到了该校的系统，并且成功出货。但是光顾着去兑换证书了，没想到这个漏洞其实是一个通杀漏洞，厂商修复的太快了，不过还是手快，又拿到了一本证书。运气好，靠着这个漏洞捡了两本证书，不过也给师傅们提个醒，挖到漏洞先去扫描一下指纹，万一是通杀呢？  
  
挖掘此漏洞的过程和各位师傅分享一下，也希望和各位师傅讨论更多的手法。  
# 漏洞描述  
  
**任意用户覆盖漏洞**  
是一种身份认证与访问控制缺陷，攻击者可利用该漏洞修改系统中其他用户的账户信息、权限或数据，甚至完全接管目标账户。  
# 漏洞挖掘  
  
【1】首先，开局注册两个账号，如下：  
- 用户A，账号：EDUSRC1，密码：Aa123123.，注册姓名：何一  
![](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoKr8Tux5pPFfMg0iboa8BN3deJ4icVrIstEkO6ticiammzOicQdWqe9HibFDcJd0JSrlib3T1eZt2S2obmU1YOp5IDPjHdWe0DoyibE1Fg/640?wx_fmt=png&from=appmsg "")  
- 用户B，账号：EDUSRC2，密码：Aa1231234.，注册姓名：何二  
![](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoJEogdtCy6apSWDlDojNlDYnDeNsUKhtPOibk52A9yyVKEmA8wccechnRcReMNPvMm5rV4TQibtmexJnAp1yxOqjDljLgyNaTj9A/640?wx_fmt=png&from=appmsg "")  
  
【2】遇到这种能够修改资料的，师傅们大多只测越权、SQL 注入等这些漏洞，但是我在测试时，有一个想法，就是我是否可以修改我的用户名为其他用户的用户名，从而使其他用户无法登录呢？  
  
【3】登录用户 A，也就是 何一，点击“修改”-“保存资料”，Burp 抓包如下：  
```
POST /saveInfo HTTP/1.1Host: {strJson:'{"data":[{"LXYX":"","LXDH":"","JTDZ":"","province":""}]}'}
```  
  
【4】可以看到，保存的数据中只有四个字段，那么我是否可以添加一个字段，从而让后端在接受更改的同时修改用户名呢？  
  
【5】在此处，我尝试修改 POST 请求体中的内容如下：添加一个字段为"ZH"，其中的信息为账号 B 的用户名（唯一），也就是 EUDSRC2，如下：  
```
{strJson:'{"data":[{"ZH":"EDUSRC2",LXYX":"","LXDH":"","JTDZ":"","province":""}]}'}
```  
  
注：此处我选择添加字段名为 ZH，主要有两方面考虑：  
- 从 LXDH=联系电话，这里能看出，开发的风格为首字母缩写  
  
- 在登录时，抓包看到用户名为 ZH  
  
【6】在放包后，系统提示如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoJLHBYPHMqI4OVwM59fFGHbqrPiaFKojTeNaTvGKu639ibpUbAHYdByBGhzZ62Zc0TNcmsdeDoVibXQbdzwINkkEYybXsdsNxrzPk/640?wx_fmt=png&from=appmsg "")  
  
【7】测试结束后，用户 A：EDUSRC1 无法登录，但是 EDUSRC1 原来的密码 Aa123123.和 Aa1231234.都可以登录 EDUSRC2，也就是说通过上述修改，一个账户（EDUSRC2）用两个密码都可以登录，同时 EDUSRC2 除了账号以外的所有个人信息都被修改成了 EDUSRC1 的信息，如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoKweP1KHQVQ98s1LueI0Werl1omOV4DlhBqpmyNOZ3oHgkSK6bUxazcHgAk98lc01D5SLSa1gkovUxYqRNjux37c9Z5lgVu2xo/640?wx_fmt=png&from=appmsg "")  
# 漏洞危害  
  
当然，在测试后也要说明危害，要不然怎么能和审核大大说清楚漏洞点嘞？在此处我是这样描述的：  
  
该平台的负责人信息在如下界面中也存在泄露，可利用上述方式进行替换覆盖。可通过此方式，重置管理员、学生、教师的账号，从而使管理员用户有两个密码，且接管其下管理的组，查看交易流水、学生信息等。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoJESOAvShKOLoaZT13B1BXfrF7icdVezcD0CXXKK147ShNL60ZiclWKvUTFwYSLMOZpMZS4VKicoPib6RtibODcVJKW5icQ3TBOAyoIw/640?wx_fmt=png&from=appmsg "")  
  
分享就到这里了，也希望师傅们多多出货，有其他思路也可以一起交流。  
  
  
申明：本公众号所分享内容仅用于网络安全技术讨论，切勿用于违法途径，  
  
所有渗透都需获取授权，违者后果自行承担，与本号及作者无关，请谨记守法.  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/BwqHlJ29vcqJvF3Qicdr3GR5xnNYic4wHWaCD3pqD9SSJ3YMhuahjm3anU6mlEJaepA8qOwm3C4GVIETQZT6uHGQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=34 "")  
  
**没看够~？欢迎关注！**  
  
  
**分享本文到朋友圈，可以凭截图找老师领取**  
  
上千**教程+工具+交流群+靶场账号**  
哦  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcrpvQG1VKMy1AQ1oVvUSeZYhLRYCeiaa3KSFkibg5xRjLlkwfIe7loMVfGuINInDQTVa4BibicW0iaTsKw/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=35 "")  
  
******分享后扫码加我！**  
  
**回顾往期内容**  
  
[网络安全人员必考的几本证书！](http://mp.weixin.qq.com/s?__biz=MzUyODkwNDIyMg==&mid=2247520349&idx=1&sn=41b1bcd357e4178ba478e164ae531626&chksm=fa6be92ccd1c603af2d9100348600db5ed5a2284e82fd2b370e00b1138731b3cac5f83a3a542&scene=21#wechat_redirect)  
  
  
[文库｜内网神器cs4.0使用说明书](http://mp.weixin.qq.com/s?__biz=MzUyODkwNDIyMg==&mid=2247519540&idx=1&sn=e8246a12895a32b4fc2909a0874faac2&chksm=fa6bf445cd1c7d53a207200289fe15a8518cd1eb0cc18535222ea01ac51c3e22706f63f20251&scene=21#wechat_redirect)  
  
  
[重生HW之感谢客服小姐姐带我进入内网遨游](https://mp.weixin.qq.com/s?__biz=MzUyODkwNDIyMg==&mid=2247549901&idx=1&sn=f7c9c17858ce86edf5679149cce9ae9a&scene=21#wechat_redirect)  
  
  
[手把手教你CNVD漏洞挖掘 + 资产收集](https://mp.weixin.qq.com/s?__biz=MzUyODkwNDIyMg==&mid=2247542576&idx=1&sn=d9f419d7a632390d52591ec0a5f4ba01&token=74838194&lang=zh_CN&scene=21#wechat_redirect)  
  
  
[【精选】SRC快速入门+上分小秘籍+实战指南](http://mp.weixin.qq.com/s?__biz=MzUyODkwNDIyMg==&mid=2247512593&idx=1&sn=24c8e51745added4f81aa1e337fc8a1a&chksm=fa6bcb60cd1c4276d9d21ebaa7cb4c0c8c562e54fe8742c87e62343c00a1283c9eb3ea1c67dc&scene=21#wechat_redirect)  
  
##     代理池工具撰写 | 只有无尽的跳转，没有封禁的IP！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/BwqHlJ29vcqJvF3Qicdr3GR5xnNYic4wHWaCD3pqD9SSJ3YMhuahjm3anU6mlEJaepA8qOwm3C4GVIETQZT6uHGQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=36 "")  
  
点赞+在看支持一下吧~感谢看官老爷~   
  
你的点赞是我更新的动力  
  
  
