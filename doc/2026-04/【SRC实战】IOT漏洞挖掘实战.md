#  【SRC实战】IOT漏洞挖掘实战  
原创 渗透测试安全日记
                        渗透测试安全日记  渗透测试安全日记   2026-04-06 03:50  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息、工具等资源而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任!  
  
01 背景  
  
平时开展渗透测试，最多的就是挖掘web、小程序的漏洞，IOT的案例比较少见，特分享一起通过web渗透到IOT漏洞的实战案例。详细过程见实战。  
  
号外号外，  
免费的睿鉴安全知识库上线了。点击下发链接，福利直达！！  
  
  
  
安全知识模块，主要放一些实战的案例，目前已更新五期内容，上新  
奇安信攻防社区专栏后续会持续更新。主要内容如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4ddwM5QWicpjuQwA0qcAB3kjiapc4djsY8pgMjDPIv73wEBsjzovibo9CQn68vE8MSdKOhlWjsh1R5aQo9iasqdn3niaDWokH73cNCxg/640?wx_fmt=png&from=appmsg "")  
  
  
  
资源中心模块，主要会放一些安全工具，给各位师傅提供一站式下载的渠道，目前已上线20+款工具，主要工具如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dc3iaKR5T6B301ZfrwCUDZmH17y5eJCugsMfbxMB0RA0O1R1H0r5eiadIIMiby591D2qwic0qd5haDVXVsy2hku0c8FeV5jCr40oZE/640?wx_fmt=png&from=appmsg "")  
  
02 实战过程  
  
通过测绘平台，拿到了一个高校的xxx能源支付系统。这个系统的大概用法就是用户可以通过这个平台，完成日常的生活用电用水的费用支付。看到这个系统还是比较新奇，之前挖掘漏洞时，确实很少见。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4ddpyTS8eWibdicYH6NIQEDFg7pmK94wtkuKx4KXgwicoo8CP7MMcCCO96uMB3Qxez4qcoUzGnxiaaxuyx07tX3QTzgz6zVoeTduK6k/640?wx_fmt=png&from=appmsg "")  
  
再加上这个系统自带了账号注册功能，那必须安排一把，毕竟黑盒测试没账号非常难，最好测试的就是有账号的，安排，完成账号注册。使用账号登录系统。  
  
登录后，可以看到，功能比较少，就是一些账单查询，房间管理的功能。明眼看就是普通用户的权限。测完这些功能，没出货。这时该咋办？  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dfbIhyia3uqOpslnXuPZSxtCdEVP0AiayuSh0GMvUG7X2ARcEX9Lnjv6dicia9icrArYVy2Y57mcGCqSgl0JtKsUZEBt4RWOWLwegz0/640?wx_fmt=png&from=appmsg "")  
  
那还是老套路，翻下js，翻到了一个路径，疑似管理员权限。直接拼接。越权到了管理员的回复管理功能，拿下漏洞1。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4devibiauub8ezBVzLoyGu1DMPNKvAbUkt7TPHWAiaQ247dia5wEYSYtR2OibPpoPg1ThqQK55wOJibjiaQFGF5vmL0bACTnLA1qgBX92o/640?wx_fmt=png&from=appmsg "")  
  
点开用户会话，可以越权查看用户的对话信息。同时还可以回复，可确认为此功能仅管理员才有功能。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4ddb5PwxGx6RajQsySr0PExZAnL3ubVQToibkTvs0nKQ2hzIcWUTNNOhW6Yiae5FI7vLMS5t0Wy9iaKBicfvbU4CiahrrJNStjdvW3PI/640?wx_fmt=png&from=appmsg "")  
  
继续越权，翻到了一个用户管理功能，至此已来到跟IOT漏洞强相关的功能点。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4deiaC4Pc9Yx5FhEArD2icqibhorUxv0mZK6gORblE2XOJswbNlibbOLKs4trX5Z2TQnMibe6sORQaziaDSLIG2S6UZMMm9R0Pt1xvekc/640?wx_fmt=png&from=appmsg "")  
  
点击具体用户，进入后，可以看到以下信息。可以远程进行断电，niubi了。能断电还不算，关键可以对全量用户进行远程断电，约3万+用户。  
  
随着物联网的发展，以后这种漏洞会越来越常见。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dfQf22iaPxIbjib0Pgbm4JtvApVJgfTRJ6ltnOUgzibzNruIstRUlrDawkbBRpTo8xzNSk1Xw6P0AZ1pV2ecJdZCBFiaEgPDDoJapM/640?wx_fmt=png&from=appmsg "")  
  
点到为止了，危害太大了，提SRC。  
  
至此本次分享结束，希望对各位师傅有帮助。  
  
往期好文  
  
[网络安全人员的金牌证书：为你铺就高薪职业之路](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484847&idx=1&sn=62fefecfbed336486f417e60bdf5fdd2&scene=21#wechat_redirect)  
  
  
[【SRC实战】简单FUZZ拿下高危漏洞](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485405&idx=1&sn=669a4286abd1103b050059efdb3da268&scene=21#wechat_redirect)  
  
  
[【SRC实战】RedirectUrl劫持实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485901&idx=1&sn=dc9931b8afe21cca270f80e71fda1e20&scene=21#wechat_redirect)  
  
  
[AI大模型“越狱”实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485551&idx=1&sn=5e2accbd716bf890c37a9fb7be4c06b7&scene=21#wechat_redirect)  
  
  
[企业 SRC 低投入，高收益漏洞总结](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485784&idx=1&sn=d53f6491bccec7fdcd8eca356c04f0d8&scene=21#wechat_redirect)  
  
  
[【SRC实战】任意用户密码重置实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485484&idx=1&sn=e3ccb64ef54194ae4216c1d43606b651&scene=21#wechat_redirect)  
  
  
[【SRC实战】记一次越权测试实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485379&idx=1&sn=37985dd7e56a66b2d023548eabd845ea&scene=21#wechat_redirect)  
  
  
[免密登录某后台管理系统实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485024&idx=1&sn=71c596dd36800993e18f1f05b9d37547&scene=21#wechat_redirect)  
  
  
[安服人应急“薅洞”指南](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485381&idx=1&sn=d0195d62adf45f6d614c785886d04e92&scene=21#wechat_redirect)  
  
  
[推荐一款资产筛选工具](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484744&idx=1&sn=7d205189f4a95c2a0cce1b6e99014c64&scene=21#wechat_redirect)  
[【SRC实战】SRC常用的信息收集方法TOP 10](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485754&idx=1&sn=da396a3501b1346d7becdc4201299a2a&scene=21#wechat_redirect)  
  
  
[【SRC实战】短信验证码爆破，拿下某众测中危](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484618&idx=1&sn=9ef1826481eaace69ebef6849995bcfa&scene=21#wechat_redirect)  
  
  
[【SRC实战】一次“链式”渗透，从站点A打到站点B](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484164&idx=1&sn=9c2db3fc19000f60785499f2c4ad1f6f&scene=21#wechat_redirect)  
  
  
[用户账号接管实战，洞穿开发者逻辑](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247483991&idx=1&sn=c1f6e65233cf18ade53b6e566fa4b3af&scene=21#wechat_redirect)  
  
  
  
