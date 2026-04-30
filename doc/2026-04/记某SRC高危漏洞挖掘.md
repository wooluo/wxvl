#  记某SRC高危漏洞挖掘  
原创 oh1inge
                    oh1inge  Tide安全团队   2026-04-30 09:03  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DuibU3GqmxVmRsdItbBVRKegNHicHQvAHDdZsGpLVU7touSU1AU1twHTfRjG3Vu5aUh0RnPPllfVUhs4qdWF5QYQ/640?wx_fmt=png "")  
  
声明：Tide安全团队原创文章，转载请声明出处！文中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途给予盈利等目的，否则后果自行承担！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/9zYJrD2VibHmqgf4y9Bqh9nDynW5fHvgbgkSGAfRboFPuCGjVoC3qMl6wlFucsx3Y3jt4gibQgZ6LxpoozE0Tdow/640?wx_fmt=png "")  
  
  
  
**【平台名称、文章内容、接口等已打码脱敏】**  
  
无聊的时候打开了某SRC，发现了新增资产，于是立即开启了本次的漏洞挖掘之路。  
## 从开局一个登录框到通用漏洞挖掘  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdVepqsRbeWlA8u7eGOh1VIYxGibicA8JU1iaLzYNsicWyQxyIDSOs57t6S9iaGwVbh1jNg1qyX4ibiciaSEdycXX2aSvwBmwp1GSzlI118/640?wx_fmt=jpeg&from=appmsg "")  
  
一般针对这种登录框的挖掘思路就是提取js文件的接口进行Fuzz测试，看是否存在未授权访问导致的信息泄露漏洞，以及是否有重置密码的接口、SQL注入、账号密码泄露、用户名枚举、弱口令等，这里我几乎跑了所有的js接口，并没看到什么爆红的数据包，但  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdW4Ijoo0TyWsqu76IWRhrkQC32knuBI0yTLQZPiaIA4ibju6OcdDPLlJ4DhiajEGdiaYZzNt3olLbTuib5bDVYPp8KChBJfBJhqaDlA/640?wx_fmt=jpeg&from=appmsg "")  
  
心里一喜，是否只要我得到userId值传进去，就可以getuserinfo得到用户敏感数据了？？当时还在想会不会泄露账户密码等信息，js里并未泄露该userid参数，我尝试了11111111 尝试了1 admin 等等 均未成功，于是我决定换个思路，查一下该系统互联网的相同资产。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdV4X93M3cEvJhKw6nypsZpIyLSqAQcVay1V7GA2CAxl2QbXln9ayEXhZvU5jjUDLmqLEib6X79K2xPJTYzhLSBZj2skqfb7p6bg/640?wx_fmt=jpeg&from=appmsg "")  
  
好嘛 这么多资产，我找个存在未授权或者弱口令的进去横向挖掘通用漏洞，或者看是否能够收集到该系统的备份源码进行代码审计，再不济收集到userId岂不美哉？ 此处省略横向打点过程，最终摸到了一个弱口令的系统，进去查看发现存在userid为xxxxxxxxxxxxxxxxxxxxx 很长一段。 发现再次请求该接口只能得到如下信息  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdUzNxNZ0Kbc03xd19dfDiaeP0e71BwOZVW8YWGibzYp4wTIVlOIwdTcybdkEZH8zSe2DtMiaibTOKJ4JWSx1I3OTKxsNGXN30AA1B4/640?wx_fmt=jpeg&from=appmsg "")  
  
还是不够啊，于是我就对互联网那个存在弱口令的资产开始漏洞挖掘，后台某个功能点请求了一个新的js文件，这里我们称它为abcdindex.js 就是该js文件泄露了大量的路由接口拿来拼接测试，果不其然，  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdUFwCbILV8DIWfQPhep3nGwMcrmWg3dKrWWOZjwCp32iavNqC7LibLz8U80vnib0T4CuzVVZj33vC2uXdzicrk1GoUe5aD1kqgNA7M/640?wx_fmt=jpeg&from=appmsg "")  
  
发现该系统其实有多个子系统功能模块，每个mulu.json都给出了对应系统的API接口也就是BaseUrl和后台接口。拼接遍历，成功取得通用型未授权访问漏洞，某个接口泄露了大量的视频摄像头权限。贴一张厚码的图（大概几百多个摄像头调度权限）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdWI0MqRPo59Mvb6brWf1g8TP1hOIn9siaGvAArfqXCCGL0R90ADHGRoUvCcia3m3zhKwMrRFWLyM2ibVgILaiblK4FbT4TTAR7kmZY/640?wx_fmt=jpeg&from=appmsg "")  
  
提交该漏洞也是成功斩获高危  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdWFOpLFYK5gfRIeRBksnIpsY19LfzYA5VfJez5nhJiaa2adFFOXd6x4UZBQDzcq4saGvDClS2QG4Z11kBMmrDCfa6KibhOImibNME/640?wx_fmt=jpeg&from=appmsg "")  
  
发现了那么多的隐藏接口，该漏洞肯定不能到此为止，于是继续开始挖掘。  
## 逻辑缺陷导致鉴权缺失  
  
发现很多接口功能点均提示缺少userId  这种归为A类， A类的接口还需要提供数据库存在的用户id和绑定的租户Id即可实现越权查看该用户信息，但还有一些接口提示鉴权缺失，该接口这里称为B类，但发现只需讲数据包的B的Authorization: Bearer认证头删除即会提示A类的问题，只需添加也可绕过，所以这里对提取到的后台目录进行访问这里直接访问 如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdVtG4hcuHibyAspum6m2sg3xsQZOE0RQmmRpZs5Zja2e4LQAvjrcPEGZIiaD6op0hB93OibM4FOuFYvTsMibQeXytichHJeBP3fqAFU/640?wx_fmt=jpeg&from=appmsg "")  
  
空白页面，这里使用bp抓包对每一个后端交互的数据包进行认证头删除  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdUhfNP2ltSXsiazibgtq0fjYkniaLSKcnAyyjj7icJHJDW7qQDIlzd0Szmu9EhGjjArTrDkib8q4a72MwmWroKuR5FlribxtA5Sara0U/640?wx_fmt=jpeg&from=appmsg "")  
  
？？？？？？？不是你？  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdUiaviaxoWStwYpzDoDPSicnYpmDrrorGZg0gJRlaNqDKXOfMKvZhgHszPjibyRnkicVDvPuAaVqdgwIyUUA9UemJ5zzVlTfW3YSswM/640?wx_fmt=jpeg&from=appmsg "")  
  
这么烂的系统没有权限就能难道本菜鸡吗，我拿前面收集到的用户ID 身份ID 进行参数FUZZ遍历 成功得到数据，舒服了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/jS2mB7OlsdXJf6jicsBib5KibDxu95IIJaf7GNRvIcBBdrlGpTySrCicfxv4JdsnQEoVuZHHDelichicOyRL7deRZlW6AbMoJO1moj18aSu36EEOQ/640?wx_fmt=jpeg&from=appmsg "")  
  
其实还有很多人员管理等功能模块全部存在缺陷，也是成功绕过拿到该系统的后台管理员权限。斩获高危漏洞，这里根据日志泄露的用户名其实还发现了弱口令用户等多个漏洞，但还未来得及提交，项目就已经进行了关闭。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdWkHIhB1DU9u4DgntdZyR0w2aKvNnGk2gcia9Fr4RF6krKAl2VxUdOR0MF9iaUx7bjCh8yjGzOeicznZiaYBD3jDZJRJSgibZAkb7ew/640?wx_fmt=jpeg&from=appmsg "")  
  
这两个漏洞相信有耐心的师傅其实都可以挖的到，本文仅是做个记录分享，但实际挖掘过程中需要去寻找的参数还是很多的，而且登录的默认管理用户名比较复杂，也是通过信息收集找了一波操作手册，像一般的SRC资产肯定都被大佬们挖掘的差不多了，几乎不会存在JS接口提取未授权的漏洞产生，但有时转变下思路，去打通杀，再根据0day漏洞或隐藏的文件接口针对性的对原始目标开展攻击，也许会发现到别人挖不到的漏洞，撕开不一样的口子。  
  
  
往期推荐  
  
[TscanPlus-一款红队自动化工具](https://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247516589&idx=1&sn=107da3b45e88255f240504d033ebde7f&scene=21#wechat_redirect)  
  
  
[潮影在线免杀平台上线了](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247499902&idx=1&sn=59cba8d980b4ecb0deefff99edaabd4d&chksm=ce5de21ff92a6b09a8972a0144557b0099e443aa8e018b17151c816fc7f08f3615ecb22617fc&scene=21#wechat_redirect)  
  
  
[自动化渗透测试工具开发实践](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498466&idx=1&sn=085c15679436dedb06a179ca8d47951a&chksm=ce5dd883f92a5195ef74ac517741f6d3da0da40b5501d72016e52cb70344904bb85b8aef65ba&scene=21#wechat_redirect)  
  
  
[【红蓝对抗】利用CS进行内网横向](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247492640&idx=1&sn=43b1991dc5628eab322923083fde8d70&chksm=ce5dc641f92a4f57ffb18e2977644b1f977fcc5e0eccdf10956d3ae4ce70dc95024500631e89&scene=21#wechat_redirect)  
  
  
[一个Go版(更强大)的TideFinger](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498344&idx=1&sn=3679330363ff6890166b09f6a502f769&chksm=ce5dd809f92a511f6066fcbb12fb5c1dc8c2642e4e2690dad64d76cc6f9247eae356d16f5810&scene=21#wechat_redirect)  
  
  
[SRC资产导航监测平台Tsrc上线了](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247499823&idx=1&sn=065ffeae6bd02fff922cfb12c5a0f4df&chksm=ce5de24ef92a6b58f709260b691e6b36e4a53aac00d3022946302b8e638696ed55c70e13e16f&scene=21#wechat_redirect)  
  
  
[新潮信息-Tide安全团队2022年度总结](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247506056&idx=1&sn=ad6dd23f58f5fd8ce899a1e292f5b685&chksm=ce5dfae9f92a73ff4f14c812436cb5bfecb29db04eada11c409e946d5338c82a92bcaa425736&scene=21#wechat_redirect)  
  
  
[记一次实战攻防(打点-Edr-内网-横向-Vcenter)](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498965&idx=1&sn=655548831da6808a020ad07294a92e60&chksm=ce5ddeb4f92a57a283d5692c246e54655319ab0d09f6403e354300a2777cda6ae4c787631ab3&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/rTicZ9Hibb6RWbGNtVfIZbm2rmGO4hQDzQUrLN62vEGlA4fPmib5utUAp9gbQicb6FC82RjsVI5vx7wEc9yAAiaFEoQ/640?wx_fmt=gif "")  
  
E  
  
  
  
  
N  
  
  
  
  
D  
  
  
  
**Tide团队产品及服务**  
  
**团队自研平台**  
：潮汐在线指纹识别平台 | 潮听漏洞情报平台 | 潮巡资产管理与威胁监测平台 | 潮汐网络空间资产测绘 | 潮声漏洞检测平台 | 在线免杀平台 | CTF练习平台 | 物联网固件检测平台 | SRC资产监控平台  | ......  
  
  
**技术分享方向**  
:Web安全 | 红蓝对抗 | 移动安全 | 应急响应 | 工控安全 | 物联网安全 | 密码学 | 人工智能 | ctf 等方面的沟通及分享  
  
  
**团队知识wiki**  
：红蓝对抗 | 漏洞武器库 | 远控免杀 | 移动安全 | 物联网安全 | 代码审计 | CTF | 工控安全 | 应急响应 | 人工智能 | 密码学 | CobaltStrike | 安全测试用例 | ......  
  
  
**团队网盘资料**  
：安全法律法规 | 安全认证资料 | 代码审计 | 渗透安全工具 | 工控安全工具 | 移动安全工具 | 物联网安全 | 其它安全文库合辑  | ......  
  
