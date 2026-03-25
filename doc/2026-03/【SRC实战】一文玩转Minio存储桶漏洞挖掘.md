#  【SRC实战】一文玩转Minio存储桶漏洞挖掘  
原创 渗透测试安全日记
                        渗透测试安全日记  渗透测试安全日记   2026-03-24 23:01  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息、工具等资源而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任!  
  
01 背景  
  
MinIO 作为对象存储，常承载业务核心数据、备份与归档文件，其安全直接关系数据完整性、可用性与合规性。  
  
一旦出现未授权访问、越权操作或数据泄露，会导致核心数据丢失、业务中断，还可能违反隐私与行业合规要求，引发法律风险。因此做好认证授权、传输加密、访问审计和权限管控，是保障底层存储安全的关键。  
  
同时呢，此类的组件在日常的使用非常普遍，那么自然也是各位师傅安全评估必须掌握的一个点。因此本文将通过实战案例讲解下挖掘方法。  
  
号外号外，  
免费的睿鉴安全知识库上线了。点击下发链接，福利直达！！  
  
  
  
安全知识模块，主要放一些实战的案例，目前已更新五期内容，上新  
奇安信攻防社区专栏后续会持续更新。主要内容如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4ddwM5QWicpjuQwA0qcAB3kjiapc4djsY8pgMjDPIv73wEBsjzovibo9CQn68vE8MSdKOhlWjsh1R5aQo9iasqdn3niaDWokH73cNCxg/640?wx_fmt=png&from=appmsg "")  
  
资源中心模块，主要会放一些安全工具，给各位师傅提供一站式下载的渠道，目前已上线20+款工具，主要工具如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dc3iaKR5T6B301ZfrwCUDZmH17y5eJCugsMfbxMB0RA0O1R1H0r5eiadIIMiby591D2qwic0qd5haDVXVsy2hku0c8FeV5jCr40oZE/640?wx_fmt=png&from=appmsg "")  
  
02 实战过程  
  
首先通过信息收集，拿到了一张大的资产表，接着使用工具测绘了一把，挑了一个网站。  
  
访问了下，直接跳到了该高效的统一身份认证系统。难搞，没有登录账号和密码等于没戏。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4df85T9sYkraXqibFHsEY02qKumM2iceTya3BkIGvXHOF8a3pMZEpDbh1qzKh6GcIkJcTfEHXZe2NictZRbermp90tmc2ibicolD9xss/640?wx_fmt=png&from=appmsg "")  
  
经过一段时间的观察，发现从目标站点跳到统一认证的系统有个“过渡”阶段。针对此类存在过渡阶段的站点，可以使用特殊的“打断方法”来阻断跳转至统一身份认证系统。不清楚这个方法的师傅可在后台留言。  
  
打断过程省略，最终进入到目标系统的加载页面。如下图。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4ddQISvHsoIr8jJVAaJ3y4ib2f3xXibsaoFt0ibq3NYTk95EmZrNgEHicEW0fxnqKhWAvQw0ibZDia0jictTSFwo6VvL0Frn8zicbbYXuDI/640?wx_fmt=png&from=appmsg "")  
  
  
那么进入此页面，就可以对目标站点进行信息收集了。信息收集也是比较常规的方法。作者个人比较系统用findsomething及其他的网站的指纹信息来进一步挖掘。  
  
此时通过，findsomething站点看到了一个关键字，那么自然是本文的主题minio了。大大方方的展示。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dfBG1PvibsneuYLOIbVtiaD3PqlSNTPTdicJLOw7nfeE5r0M60CdqsDPMza9CRibpTwiaebKZR382AakgjIVjeFItTibeo3jzia3zmgWU/640?wx_fmt=png&from=appmsg "")  
  
  
直接操作一把，详细漏洞如下。  
  
漏洞1：未授权列桶  
  
逐层删目录，直到根目录列出文件出来。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dchluAxeOgyuWwtykdlcPC9pbzjFX5I7lNiaez6Mh2E40sNEg25ROUEdgqtwoIHfbCqAKMVUeIDXXNrT05a1UD4hQjK3g7ribb9o/640?wx_fmt=png&from=appmsg "")  
  
漏洞2：任意文件上传/覆盖  
  
都是老套路了，直接用put方法传文件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dcicnsWFr1m30364LDAoQSjJNXrptXm1UBILb5H6vY8ia0BnSvARtsv4IlFxUjOA0ibkNjlBOMbSOSiaX1xyw4KXlChSdsNZmgOiaVY/640?wx_fmt=png&from=appmsg "")  
  
传完刷新下桶，可查文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dcaBABeia9weXuecA4MfCukYWmCyu3Zhr9sHNibKvYLUdsuuHibbbgk66uicdyww5J3jbzZzo7GvKbY6wibpqgrUztBq5LlV6CN5EP0/640?wx_fmt=png&from=appmsg "")  
  
漏洞3：任意文件删除  
  
用delete方法删除漏洞2的文件。可成功删除。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4ddjT72uVI8otbmJdCl9Hibfhah3RMqAUPQXM7fOWpjEWziaC8icjkRzzxDOXx8J0T2FI2ayu7RTdI3VYJTP7D0RJHQbNtwTGZnOos/640?wx_fmt=png&from=appmsg "")  
  
回到桶里查，查不到文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4deNV8prv2g0pjIfx43L0Mjss3zLwiaGzLRl8U8BicT0QBGWEhjWvuRibdx1p88iaRpicueQORtdkzC79LVFjALNIWzibeN0KXcr8JZuE/640?wx_fmt=png&from=appmsg "")  
  
漏洞4：xss  
  
例常传个html，混分。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Euxpicz6k4dd3LlvkCh3oHVpYbBic5QAGMYUFdLBQqnGyXxicSpJZcWoWibngRtIK0PgoThy8P6zibn2bxM4hUysRibGjG4F6HArCTjhQsgKu1qew/640?wx_fmt=png&from=appmsg "")  
  
漏洞5：敏感信息泄露  
  
这个是危害最大的，如果桶里边的敏感文件太多，高危稳稳的。这个得使用工具，分享一个师傅的工具，  
下载链接见文末！使用工具拉出来就可以在excel中查。跑完工具结果如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4df77yZ6sZYdEvImIPOeMicguOErxlVyFAhsicrVWKVMC29w3rrTCX44Bjc8Pa2aJhWgGK809qYepqmIRLiad3JicuIKvNHZ5vOJI7Y/640?wx_fmt=png&from=appmsg "")  
  
此处举部分为例。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Euxpicz6k4dd3lF6H04jvdHfegM2dmmOHwT5dHHeJwh5dW80NQ7jylvodp420tk8g5wfCh03ql3HHvu2WV9Ch495g5VSFiabEqva6dXzN5n5U/640?wx_fmt=png&from=appmsg "")  
  
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
  
  
关注公众号：回复“260325”，获取下载链接！！  
  
