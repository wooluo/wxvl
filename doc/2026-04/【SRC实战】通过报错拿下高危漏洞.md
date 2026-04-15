#  【SRC实战】通过报错拿下高危漏洞  
原创 渗透测试安全日记
                        渗透测试安全日记  渗透测试安全日记   2026-04-14 23:07  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息、工具等资源而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任!  
  
01 背景  
  
相信各位师傅在渗透测试时，没少见过从服务后端返回的报错信息吧，如sql语句的报错、json数据报错等等。  
  
本次分享的案例，与平常的报错不大一样，但却可以拿下高危漏洞，具体是啥。详细过程见实战环节。  
  
号外号外，  
免费的睿鉴安全知识库上线了。点击下发链接，福利直达！！  
  
  
  
安全知识模块，主要放一些实战的案例，目前已更新五期内容，上新  
奇安信攻防社区专栏后续会持续更新。主要内容如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4ddwM5QWicpjuQwA0qcAB3kjiapc4djsY8pgMjDPIv73wEBsjzovibo9CQn68vE8MSdKOhlWjsh1R5aQo9iasqdn3niaDWokH73cNCxg/640?wx_fmt=png&from=appmsg "")  
  
  
  
资源中心模块，主要会放一些安全工具，给各位师傅提供一站式下载的渠道，目前已上线20+款工具，主要工具如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dc3iaKR5T6B301ZfrwCUDZmH17y5eJCugsMfbxMB0RA0O1R1H0r5eiadIIMiby591D2qwic0qd5haDVXVsy2hku0c8FeV5jCr40oZE/640?wx_fmt=png&from=appmsg "")  
  
02 实战过程  
  
测试的起源是信息收集，通过测绘平台，拿到了一个xxx系统，系统情况如下。页面看起来只有一个注册功能，经过简单测试，其实注册与登录是同一个功能，只要有验证码就能登录。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dfLMfgK8OeTPDAibwic0cgMIjw3iagFxToYp3Y8twzpWjpmerAhjJXGCicbIWYOxYm9g43sVT4BplLcSVaQzuhT1wdtwCZDibGFBOfc/640?wx_fmt=png&from=appmsg "")  
  
第一步先来一个任意验证码测试，尝试是否存在漏洞，点击获取验证码后，输入个1234。无果。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4desgxAor8ZKE2Sw5Hf5oNaKsmAXIOpyXu8FKk0Zo7kOM8gm685p7Nvm4vTMoqWm3Y6nPJIAiapKLdhPwQbV0YwB9fHUksWMW8gs/640?wx_fmt=png&from=appmsg "")  
  
  
从上图可以看到，手机号最后1位是2，此时作者将手机号最后一位改为1（  
为啥这么做，其实我也不知道），点击确认注册。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dfiaJTwBN6ic8jsokJCvFebSwgAhsXib7lVEm0sQpmU6VxYE3rlGQZDQFiactYe8wbHBhvW7ibNzYcCDapKsUFWM2jb8CtU2TO1zhKM/640?wx_fmt=png&from=appmsg "")  
  
报错了！报错了！后端  
直接  
报错信息，返回了正确手机号的验证码，如下图。直接从F12控制台直接返回了验证码4301。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dfiaEpQKoibribxha5ZcBaGG9ExNicRqatmjZKicT5cFW3CnORBRPdA58W2zmp7Zomfn8V7koMgoBOFCmhDDoPfwYDzjHgTmXyJIh1s/640?wx_fmt=png&from=appmsg "")  
  
再看下手机上收到的验证码，也是4301。短信验证码回显导致任意用户登录漏洞到手。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dcBIYb1ssSJXq8E4iaJdGMJyfGJwe9VrPbFj1XKdJBzDBic53cdF9aPaL0ZliadTaN4icTFMNeXa2tsw969u0CeLXbcZm1ib6SZaRzo/640?wx_fmt=png&from=appmsg "")  
  
点到为止了，危害太大了，提SRC。  
  
至此本次分享结束，希望对各位师傅有帮助。  
  
往期好文  
  
[【SRC实战】IOT漏洞挖掘实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247486150&idx=1&sn=d0cf99fbe2508b3625f4f9168491b3b7&scene=21#wechat_redirect)  
  
  
[【SRC实战】一文玩转Minio存储桶漏洞挖掘](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247486079&idx=1&sn=ffb3843bb61c5a75a3da2e9869b932cd&scene=21#wechat_redirect)  
  
  
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
  
  
  
