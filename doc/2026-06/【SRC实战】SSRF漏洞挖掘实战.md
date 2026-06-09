#  【SRC实战】SSRF漏洞挖掘实战  
原创 渗透测试安全日记
                    渗透测试安全日记  渗透测试安全日记   2026-01-19 23:07  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息、工具等资源而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任!  
  
01 背景  
  
开展日常SRC的测试，在完成信息收集后，针对某站点进行深度挖掘，通过findsomething翻到一个预览接口。并通过此接口挖到ssrf漏洞。  
  
接下来请看实战。  
  
02 实战  
  
开局一个登录框。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qghiaf9NMibp1ts5W6BLerKW4IH7ia9nYX8n6USEKPByRMFLleWibaaic3fHc1ic0xUeyZLKNa1DXicMfYMaFcZUFgHkg/640?wx_fmt=png&from=appmsg "")  
  
通过findsomething收集到一个带url参数的接口。路径为GetRawFile?url=xxxxxx。  
  
直接挂上burp代理,抓包。  
  
并将url的参数设置为http://www.baidu.com。  
  
如下图。可以看到返回了百度的页面内容。ssrf漏洞到手。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qghiaf9NMibp1ts5W6BLerKW4IH7ia9nYX8AcoJM92bd7vfzWcx75zwrQwwY3uBEfqnp0Dy5zCPemKibN3HZYAIsZg/640?wx_fmt=png&from=appmsg "")  
  
进一步探测下内网，将url的参数设置为http://127.0.0.1:80，成功返回80端口上的页面代码。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qghiaf9NMibp1ts5W6BLerKW4IH7ia9nYX8sCjTsia74kGjVe5vPBbeQD6UFj82KjnpZlre53cwb0Yb7MTgjmetE2g/640?wx_fmt=png&from=appmsg "")  
  
至此，本次的实战案例结束，点到即止。  
  
03 总结  
  
漏洞挖掘思路比较简单，重点关注下url、file等参数的路径。  
  
在无账号的情况下。可以通过F12控制台搜索的方式去找此类接口；或者通过findsomething此类前端页面信息收集的工具去收集，推荐使用这个方法，效率比较高。  
  
往期好文  
  
[网络安全人员的金牌证书：为你铺就高薪职业之路](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484847&idx=1&sn=62fefecfbed336486f417e60bdf5fdd2&scene=21#wechat_redirect)  
  
  
[【SRC实战】简单FUZZ拿下高危漏洞](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485405&idx=1&sn=669a4286abd1103b050059efdb3da268&scene=21#wechat_redirect)  
  
  
[【SRC实战】记一次越权测试实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485379&idx=1&sn=37985dd7e56a66b2d023548eabd845ea&scene=21#wechat_redirect)  
  
  
[免密登录某后台管理系统实战](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485024&idx=1&sn=71c596dd36800993e18f1f05b9d37547&scene=21#wechat_redirect)  
  
  
[安服人应急“薅洞”指南](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485381&idx=1&sn=d0195d62adf45f6d614c785886d04e92&scene=21#wechat_redirect)  
  
  
[推荐一款资产筛选工具](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484744&idx=1&sn=7d205189f4a95c2a0cce1b6e99014c64&scene=21#wechat_redirect)  
  
  
[【SRC实战】短信验证码爆破，拿下某众测中危](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484618&idx=1&sn=9ef1826481eaace69ebef6849995bcfa&scene=21#wechat_redirect)  
  
  
[【SRC实战】一次“链式”渗透，从站点A打到站点B](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484164&idx=1&sn=9c2db3fc19000f60785499f2c4ad1f6f&scene=21#wechat_redirect)  
  
  
[用户账号接管实战，洞穿开发者逻辑](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247483991&idx=1&sn=c1f6e65233cf18ade53b6e566fa4b3af&scene=21#wechat_redirect)  
  
  
[WordPress常见漏洞总结](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484505&idx=1&sn=03bf8b220f763ec99ed14e55bbd14cdc&scene=21#wechat_redirect)  
  
  
[解锁Wabpack的JS异步加载通杀技巧(附工具),看了不白看](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247483699&idx=1&sn=70c7fab6e3ca68a9128f85070203918a&scene=21#wechat_redirect)  
  
  
[SSRF漏洞常见功能，涵实战案例](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247483727&idx=1&sn=6cc25a5803d99cdbaf71ea9012931030&scene=21#wechat_redirect)  
  
  
[50个网络安全必备术语|从入门到精通](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247484997&idx=1&sn=bbbd43c78dff1ab0e3b8583cf61814b6&scene=21#wechat_redirect)  
  
  
[【SRC实战】某大厂地图服务系统任意用户注册](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247483837&idx=1&sn=47670b4c637eda9dd6c021e9eb0b36fc&scene=21#wechat_redirect)  
  
  
[2025年11月全球十大网络安全事件](https://mp.weixin.qq.com/s?__biz=MzYyMTgwMTYwOQ==&mid=2247485102&idx=1&sn=2bcafb3081506ad8ca45f4f89f04df8a&scene=21#wechat_redirect)  
  
  
