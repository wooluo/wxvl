#  敏感信息泄露漏洞总结：深情哥提醒你aksk正在“裸奔”  
原创 湘南第一深情
                        湘南第一深情  湘安无事   2026-04-19 06:45  
  
声明：  
由于传播、利用本公众号湘安无事所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，请勿利用文章内的相关技术从事非法测试，如因此产生的一切不良后果与文章作者和本公众号无关。如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
## 前言  
  
  
最近老是有学员问这个Appid和  
AppSecret怎么怎么利用，而且好多学员不认识这个aksk是什么，怎么操作。今天我把以前遇到的aksk的利用方式都总结一下，并且开发个aksk敏感信息管理在线web网站。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9Esn761ickJsdcfeX52jdsYpsK37piaVJp0QX34tomiczEgicOYpaGbuEBjEOpuOb0Tw0lia6T1KAYzRNaAr7Z8oTecCT39J56vXF1b0/640?wx_fmt=png&from=appmsg "")  
  
长下面这个样子，是不是很符合深情哥的风格,接下来讲各种泄露aksk该怎么利用~  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Evu1exBdckMHufA1XQBvibZgd5vOaj1LJzekBMia4Lh0oBwPlpuIYvvAd9mrju80x1bm6Pv9OvfKHiaSFE40rzg5rU27BpPaRibpxY/640?wx_fmt=png&from=appmsg "")  
  
## 钉钉key的泄露-赏金500的报告  
  
#### 1.api接口泄露，看我f12大法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Eu7BAgQASznscdsmBKzLdNEkaCnsnp1IVfa72O76aHUDgM3VgiaVESWsH0SLQcoYSDTg3AIkFO0b9DvvYueqPIicJ6uibPE4uw9WI/640?wx_fmt=png&from=appmsg "")  
#### 2.毫无疑问/m/dingding/api/getDDConfig这个路径看起来就很牛逼  
  
应该是获取配置文件，然后根据  
js  
里面的提示构造请求，类似这样子  
```
http://XXX.XXXX.XXX:8000/m/dingding/api/getDDConfig?corpId=XXXXXX&modelType=parking
```  
  
哦吼，直接获取到一些信息，看起来像密钥 里面还要钉钉网址  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tlibgKYKL9EsVgr9uZhw3rZ7OdRGtngGB2owHYv9WAw7m4o9EuY8Qt7buFJskYn6CtNqOOoNmQ9BlqArGmIoBib8bKqMIicQpzvd0f97wvKcf4/640?wx_fmt=other&from=appmsg "")  
  
类似这样子  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EserBYmj7T4iawib7UxvqJKAw7V3zLKSzfia984ltxHgq9jb3lPvgZsZ6ibPEXcgfKuF373DE0pibS55BjpgMsXDOVyjfz6Xia4ZrX3c/640?wx_fmt=png&from=appmsg "")  
#### 3.验证是否dingding-key可以利用,打开湘安社区  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EuURbIiba5KOdkGYJBNyp1GlwZy2JmDCOc6A2DHG9Gcm48XYqyfV5F7ZHNO7zvJZIq2SYz4GK34l2fjialOfpt7BQoLibxGMQOupk/640?wx_fmt=png&from=appmsg "")  
  
然后点击添加应用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EuQRiar1J3KSTq9BBTeG1Ws0vgwEMOZy4J4G7fY89DaO6ZenFvVrZypZR1yoMibbKbZRxkZsibEuDkfvb8X7NXjrJANDYdY5zP4Bw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EszL9SVorMoVtRCteyXXB0I4iareaq7mysFoye39QrJ0kX0wQftjnTUZn2IvojaveU4mTnicgoJbZEXuvK9IN1nhuW6qLQKtScts/640?wx_fmt=png&from=appmsg "")  
  
然后点击验证  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EsTH5l1c27e5jNNVs6KNDoxNWaYZPp4fe8kM5v7uhrSYiciafZO8ABGIRmMudibSbhQYlGT4RuMfQ5apkSeGal0VaS5Itu4ia34AicU/640?wx_fmt=png&from=appmsg "")  
#### 4.如果审核让你继续利用  
  
钉钉获取管理员userid的接口  
```
https://oapi.dingtalk.com/user/get_admin?access_token=XXXXXXXXXXXXXXXXXXXX
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EucLmlRibDpvULqO663S4pMiaYswBwYkcVVbk464B4rlCEITCRLGXC2yo4a2SIyWjJ4M61oUAm2REKJMsIZmW60MEsqZ5qwcr5Ow/640?wx_fmt=png&from=appmsg "")  
  
钉钉通过获取管理员  
userid  
参数信息得到个人敏感信息  
```
https://oapi.dingtalk.com/user/get?access_token=XXXXXXXXXXXXXXXXXXXXXXXXX&userid=dd
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9Es5VpKDDyHlYA01q7alK2oY6seN7bfsEia8a2snshoBmLROib7pk7icQexlJcRDYj7yX7d4hhalEqzOEq58r0amQylK29b71HbFcM/640?wx_fmt=png&from=appmsg "")  
  
在钉钉添加部门成员  
api  
接口，这个操作慎用呀  
```
POST /user/create?access_token=ACCESS_TOKEN_STRING HTTP/1.1
Host: oapi.dingtalk.com
Content-Type: application/json
Content-Length: 356
{
    "userid": "test_20260218",
    "name": "安全测试账号",
    "orderInDepts": "123456789",
    "department": [123456789],
    "position": "测试工程师",
    "mobile": "18888888888",
    "tel": "010-88888888",
    "workPlace": "杭州",
    "remark": "授权安全测试",
    "email": "test@test.com",
    "orgEmail": "test@company.com",
    "jobnumber": "T001",
    "isHide": false,
    "isSenior": false
}
```  
  
或者curl  
```
curl -X POST 'https://oapi.dingtalk.com/user/create?access_token=YOUR_ACCESS_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
    "userid": "test_20260218",
    "name": "安全测试账号",
    "mobile": "18888888888",
    "department": [123456789],
    "position": "测试工程师",
    "email": "test@test.com"
}'
```  
  
我不小心添加之后直接进去到别人钉钉群里面去了，这不妥妥的被抓  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EuoAlnU0UgDde7ktuAqticl8HfBWnfUzYNFyR1giceA2QSicfxGDOscZFwZVVV6STKIjqszOL7XfyItr00wqWPhGmdzhfAgDrXxmI/640?wx_fmt=png&from=appmsg "")  
  
利用到这里差不多了，具体可看钉钉的接口文档  
```
https://open.dingtalk.com/document/isvapp-server/queries-department-user-details-1
```  
  
妈的 因为是第三方开发的信息，被降级了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9Esl4YibWVsoVxicpIQ7vDF56AFsl8CgSBYOmhbBvPARjFOH1CQzXpia2YiaBUx5aCd3iaJWQARlwJe80ichfYCzeakW4GTrxZiapzibdrc/640?wx_fmt=png&from=appmsg "")  
  
  
## 企业微信key-价值2000大洋的报告  
  
#### 1.f12再web网站接口发现存在泄露  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EtMzyv8Ypy5K0lemz8HaYeBaukHMecIibAfJVYNz5JG50ianzltsoS3oC4gOznDLxhPciaIleYctmLBMfoibVBlOibAPUHSsjZ4Jtn0/640?wx_fmt=png&from=appmsg "")  
#### 2.然后拿到网站上面测试  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EtbZVXcqsrYjd3TiaJtKCib93dibzTXeRyebFMcx2ckHIJQ2gIAysO56FibyHwAOoNeVicwjUU5ErNujkOqmp9BzHzALYwSaD8wRCtc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EtVnB9nm5PJa7icbNW1iaD8iaUrJgcicVtdh9biaoYSAyOQSNJ4RkhTBSXsf1DWibY7yIiarSiavZzd4ibACV0BDx2czPTe1OmUvWfInBbQ/640?wx_fmt=png&from=appmsg "")  
  
成功了就会返回token  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Es3PtalVFcWgDUTk3eiacy6nia9pgugbHmIePxBspeM78AYgics4u5k0FOuIP2cYSBQvlW381PsKIxTkVdWhl52Q4vhb1AuoH4KnQ/640?wx_fmt=png&from=appmsg "")  
#### 3.如果审核让你利用就下面这样子操作  
```
GET https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&userid=USERID
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EvTdn9WHtT256WDuBMgZHHh5dx92oTEcANprG8nOUdiavT8P3b7co7UQ6icTs5eXYZsJeicebRibcZcGyEiaVqvRoFmnasCjibOxV3OM/640?wx_fmt=png&from=appmsg "")  
  
userid一般是姓名便利一下即可，比如zhangmin  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EvRmdwwEI6zx0iaWM7IWHqB8012icWKqKd9iaicleFUGKXIV543tlxu0S14oicw9SNBqLE6ibTxj3eVRcuIvkFWHZSpVRj7Lqiam1Ag2I/640?wx_fmt=png&from=appmsg "")  
  
可以直接跑出很多人的敏感信息，直接给了高危  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EtZrmrhEicgyP6h4zdeOQUto8oyC4icHlgCqgBEGrqVZW7gAeoPgomia6OwrhIFz9yic3NiaGaLPJZxqJVNvMRK3KeX3tDpO33icH90Q/640?wx_fmt=png&from=appmsg "")  
####   
  
## 微信key-价值500大洋的报告  
  
  
具体看之前深情哥写的文章，下次撩妹用这招好嘛~  
  
[公众号接管漏洞之偷偷加小姐姐微信](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494345&idx=1&sn=6d9ab80cde99e95c4d1ac710e091ffdd&scene=21#wechat_redirect)  
  
  
## 听云key-价值300的报告-有点抽象  
  
  
后台发现了另一个站存在听云并且有key和token，f12大法发现泄露听云key  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EujBOABUAib5vunk4e1pUiamvkPIq9CwtMOkJsbpwOpXg9LvEu26KA7nvctvG58tHoZDkk4rAUT9DHRUMnErRPliakQph9g0fILEM/640?wx_fmt=png&from=appmsg "")  
  
什么是听云？  
```
你可以把听云理解成一个网站的“私人医生”或“体检中心”。网站（如你例子中的中邮人寿）在代码里嵌入听云提供的探针后，探针就会持续收集网站的运行状况、用户访问体验等数据，并报告给听云的服务器。这样，网站的技术人员就能通过听云平台实时了解网站的健康状况，快速定位问题
```  
  
根据听云的接口文档构造了下面数据包这段代码就是**听云Web探针的初始化配置脚本**  
，直接嵌入在  
网站的HTML页面中。它的作用是在用户浏览器中启动听云的监控功能。  
```
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Evhx0miaKp3KDPjULfEAblM5CibdWHDZIKJGgekLJILmicM5oYQSicZ4RQqIx2DWqsTUmbbKAgPFKCAfRWG2MUfcsIxfXrRib0mehnI/640?wx_fmt=png&from=appmsg "")  
  
直接评级了个中，有点抽象，宝子们下次自己多试试  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Etf90sdsHxp04J0edKm3iazN8qTYIqmnFsUhHpkWibSaibibpIT3gySpIqQE3FHHyjxgficdmVrNnsZ5HIe5coxkIUiamKVia27vQhQdo/640?wx_fmt=png&from=appmsg "")  
  
## 百度人脸key-低微的报告-100元  
  
  
1.app反编译查找关键字找出来的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9Eu3mdyEm6DkDUuEbNnJscd14BWeticflnlZibQicZbv09RcEQRuWOhicnhC24zLpyn8UkYWWONSUxsuJ4cN0GNUZwI2cntkkiaUN0Ag/640?wx_fmt=png&from=appmsg "")  
#### 2.直接找到这个key  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EuZwexrPMqHicxEGPxPn3RN2rsUnicbrLjBHUVibqq391EqB3Hbyu9xibQnYibXWQwQmnMovRiaI4ZHZ1zjp3DkSKZnFYmP5OjYk2IFY/640?wx_fmt=png&from=appmsg "")  
  
根据对这个app的分析应该是人脸的key  
  
人脸的ak secert  
  
人脸调用的接口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EsfeZ6jk7qpC2bHAUxB6pOE3kSKzkY4htEaUTE4m32nyEFpYbOFdYhChCNibn6YOic4xIPicJTsq9PAhCx50JMpxzxdO8mFwaibNQA/640?wx_fmt=png&from=appmsg "")  
#### 3.百度人脸key第三方文档  
```
https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjhhu
```  
  
自行查看  
```
https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=pXuzuyEU0tnjwpKmNBpxxxc&client_secret=VRfVVGtlSpl1Z0UhuRgxxxxxSSmW7A
```  
  
返回下面这个就说明可以  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EskyF5T3RUhe3SiaatvJMog0V1FQ2f8Z5xiaxMXghsOmiaoXy23woaDxtJoiaKHF4rL5aUUmjiccHd3YIIlNhCM0OHibH0uBMJGkWa0c/640?wx_fmt=png&from=appmsg "")  
  
然后就给了低微  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EsKaMI5ZWCLkldoicb3BGNulKhABHN21fiaWL8jKqRUGlkp02S06zOhFaL7rYHWCHbAcUFicADadgyIeQhXF4yzGZWlVBcCrOibUk0/640?wx_fmt=png&from=appmsg "")  
#### 4.已经集成到平台网站了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EuOXLAoJ8BqQqEibiaPhHibAFopj9SVmxxmd5ClEbMYeGkmAVjY7zQsknXD5pYIiaQ3iaeczr945k4S3U4Zj9j1bSCIxeEWFL5nOKa8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EtWhu8IYPkv56V5ibwznuK8YsAteJVb18KKYRkSN3pMkPPzfcEjffiblMdkwZnHcMkGibYmbnXYRLs1zeibZ73sHdNOiciaZW8nDI4LA/640?wx_fmt=png&from=appmsg "")  
  
## aksk后续衍生  
  
  
本质还是看第三方服务商提供的api文档接口，危害无非就是消耗资源和操作敏感信息，如果大家有遇到经常挖到的aksk可以把报告发给sqg，集成到我们的平台上面。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EuhROXsoZwWKANtkGaic7Ae7sibGtCuicZcFQudiaGUcztT2gjpwfHmaAexDzkR4WDK2YQY8LhL357DjeD4P79IXUxd7TuuwgYHevM/640?wx_fmt=png&from=appmsg "")  
  
如果看不懂文章的同学可以去b站看深情哥的做好的视频，更容易理解该漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EtMibD9ibIqGh7OgCsabvmwkAWrpNgkzAfYTat1elCH9VichUzibp4GMUnw2k6388nP8I0viaYvEAL4t3oaPoCxECkK12Afot2jJFew/640?wx_fmt=png&from=appmsg "")  
  
往期文章  
  
[记母校漏洞测试一次waf绕过经历](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494963&idx=1&sn=a3402602ab048ef32c1bc7f36d702dde&scene=21#wechat_redirect)  
  
  
[Codex-AI 道德审查绕过进行js逆向](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494987&idx=1&sn=7344cac0a26228596f0e267793aca865&scene=21#wechat_redirect)  
  
  
[究极无敌的srcAI-xss手法（快看过来）](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247495003&idx=1&sn=fcd19fb5f7f950a3e7a15785577cd738&scene=21#wechat_redirect)  
  
  
[记一次差点进编制的漏洞测试](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494898&idx=1&sn=9f9c5a3527c8330f2e4312eadf0ce863&scene=21#wechat_redirect)  
  
  
[新版微信强开f12和新版本微信反编译](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494896&idx=1&sn=ac8ebcaecd5e18d45f79c7b6d8e3b10c&scene=21#wechat_redirect)  
  
  
[湘安无事2025团队和培训总结-福利抽奖](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494849&idx=1&sn=a7084a23faa401c4fbcb06af4650846a&scene=21#wechat_redirect)  
  
  
[985证书漏洞越权成为教授 + EDU/RCE漏洞实战解析｜湘安内部平台月榜 TOP3 案例](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494786&idx=1&sn=9ee660a005413f34e6d89f728df59803&scene=21#wechat_redirect)  
  
  
[服务号存在注入之有意思的edu漏洞](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494659&idx=1&sn=e357db59d806c93f3a5a36b5c312b335&scene=21#wechat_redirect)  
  
  
[湘安无事之湘潭大学冬令营总结](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494727&idx=1&sn=1d17ba9ee9bcd5fc4cfabe12d463e4da&scene=21#wechat_redirect)  
  
  
[赏金src报告分享&&edu证书站漏洞分享](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494759&idx=1&sn=65084c580bb13fa31f82985721147e7e&scene=21#wechat_redirect)  
  
  
[edu小灶案例之泄露上w敏感信息&有意思的证书站报告案例](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494702&idx=1&sn=5f0d05b6bea8550eda36ed2ce8ddbf7a&scene=21#wechat_redirect)  
  
  
[学员投稿之edu漏洞的JS逆向解密导致任意密码重置](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494634&idx=1&sn=7cc83a90badea88d7d7d25583bd0c419&scene=21#wechat_redirect)  
  
  
[最近学员小灶总结之双十二特惠](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494604&idx=1&sn=80f030c8114ee3287036586c670289c9&scene=21#wechat_redirect)  
  
  
[卡顿页面导致三本edu证书现世之学员案例分享](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494572&idx=1&sn=14c21f1cae87dbdbf2ca5c4b10533f5d&scene=21#wechat_redirect)  
  
  
[看完这场EDU通杀刷屏，连我自己都沉默了](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494535&idx=1&sn=113dd5e17065def94a5dacad361176b3&scene=21#wechat_redirect)  
  
  
[edu证书站挖掘之学员分享案例](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494524&idx=1&sn=bff39f27ea27bccb884e832603acda92&scene=21#wechat_redirect)  
  
  
[如何快速挖掘低微漏洞-项目挖掘总结版](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494500&idx=1&sn=2da7aa0d40075b462eb27695f2da9e83&scene=21#wechat_redirect)  
  
  
[公众号接管漏洞之偷偷加](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494345&idx=1&sn=6d9ab80cde99e95c4d1ac710e091ffdd&scene=21#wechat_redirect)  
  
[小姐姐微信](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494345&idx=1&sn=6d9ab80cde99e95c4d1ac710e091ffdd&scene=21#wechat_redirect)  
  
  
[辅助学员审计案例-php代码审计](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494284&idx=1&sn=2feaf2786717c2c577fe0b5230cbc58f&scene=21#wechat_redirect)  
  
  
[学员-补天800赏金报告分享](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494284&idx=2&sn=c54ea91e0b3dc79f48f54f931df413c0&scene=21#wechat_redirect)  
  
  
[从js逆向到sql注入waf绕过到net审计-edu证书漏洞](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494171&idx=1&sn=0d589d01dfbb068e53f9ad9c22676d7a&scene=21#wechat_redirect)  
  
  
[空白页面引起的高危src漏洞-再次绕过](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494082&idx=1&sn=6d1cc92a049d28b5395d417e0a5203a5&scene=21#wechat_redirect)  
  
  
[空白页面引起的高危src漏洞](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494061&idx=1&sn=bfb1406138041fcba8286811aa7ac6e1&scene=21#wechat_redirect)  
  
  
[难忘的优惠劵漏洞(深情哥破防版)](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494035&idx=1&sn=422326cc617c33c78b3d518471e0862d&scene=21#wechat_redirect)  
  
  
[什么？又日母校？竟然还有表扬](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493987&idx=1&sn=f8edc2f3a113591e6e4cc57fdf821c8f&scene=21#wechat_redirect)  
  
[信](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493987&idx=1&sn=f8edc2f3a113591e6e4cc57fdf821c8f&scene=21#wechat_redirect)  
  
  
[sql server注入靶场搭建](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493947&idx=1&sn=885ee489f74211ba26a4a097f7ba30d6&scene=21#wechat_redirect)  
  
  
[记一次学校ai沦为我的宠物之拿下e](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493890&idx=1&sn=380e9dd566b29b713993b26f524fe0e4&scene=21#wechat_redirect)  
  
[du证书](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493890&idx=1&sn=380e9dd566b29b713993b26f524fe0e4&scene=21#wechat_redirect)  
  
  
[疯狂星期四两本证书漏洞合集](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493926&idx=1&sn=06ac298909e27d0e37fef90f64b205da&scene=21#wechat_redirect)  
  
  
[湘安无事之深情哥版edu+src培训](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493855&idx=2&sn=bb025b6a32bc022319f8dc8057a6436d&scene=21#wechat_redirect)  
  
  
[记两次js逆向拿下985证书站(学员投稿)~](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493855&idx=1&sn=0d507bc1f90b04588393698ee1c2d4b8&scene=21#wechat_redirect)  
  
  
[重生之我在教育园暴打小朋友](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493410&idx=1&sn=17df8a525145bf062ed5d6ecc3e09539&scene=21#wechat_redirect)  
  
  
[某医院微信小程序签名机制绕过分析](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493408&idx=1&sn=672ff76188ab6c97bc1b8d688ac7228f&scene=21#wechat_redirect)  
  
  
[记二次帮学员拿下edu证书站](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493399&idx=1&sn=425e84fa877f789598a2e8afdf8320c6&scene=21#wechat_redirect)  
  
  
[记一次难忘的net直播审计](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493369&idx=1&sn=e10ae1cd25ece5fe3c3ca4c2b455cb51&scene=21#wechat_redirect)  
  
  
[记一次小米-root+简易app抓包(新手)](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493374&idx=1&sn=7dea1086256be1d5a2b1a18fa4ab3be0&scene=21#wechat_redirect)  
  
  
[记一次带学员渗透母校](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493292&idx=1&sn=7b1881174201094a5449fe1400ddc8a6&scene=21#wechat_redirect)  
  
  
[同学，你试过交edu漏洞交两天两夜嘛](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493292&idx=2&sn=0d706a4064111b3e131f24460b2f2c56&scene=21#wechat_redirect)  
  
  
[手把手带学员拿下浙大edu证书](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493292&idx=4&sn=cd157b6471a1ab1e63b8dbfe0f62b42e&scene=21#wechat_redirect)  
  
  
[记一次手把手带学员拿下600赏金](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247493151&idx=1&sn=3e1a791a4d14b9ad21d2f0afe8a455a2&scene=21#wechat_redirect)  
  
  
[深情版edu+src培训讲解(3000)](https://mp.weixin.qq.com/s?__biz=MzU3Mjk2NDU2Nw==&mid=2247494535&idx=2&sn=9dfb9ceda7361c9523471a64d8f16f5b&scene=21#wechat_redirect)  
  
  
最后总结  
  
感兴趣的可以联系深情哥进群  
，有公开课会在群里面通知，包括审计和src。  
edu邀请码获取，咨询问题，hvv渠道推荐，nisp和cisp考证都可以联系深情哥  
。  
  
**内部edu+src培训，包括src挖掘，edu挖掘，小程序逆向，js逆向，app渗透，导师是挖洞过40w的奥特曼深情哥，edu上千分的带头大哥！！！联系深情哥即可。**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EuUOFwOfeS1vC2qYFuTtUxosHwsZib0QSmy6OLt3HCVhRRn6m4m07cbth4aw1Vmt2HLKl2pN5er2VVOXKkxbWramspHp1orzJAU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=22 "")  
  
  
