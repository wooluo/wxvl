#  挖洞实战｜接口FUZZ+日志泄漏导致大量密码泄漏漏洞  
原创 猎洞时刻
                    猎洞时刻  猎洞时刻   2026-03-19 00:00  
  
![](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTH9evFcNH31Pjh0f83GEqsibSQsGS8uUrBPLU6VJbjw8CTibOgsYYOhqqKpaQHb9BicrJcCOYhZG0tYOg/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**免责声明**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/bL2iaicTYdZn6mG6TyJornrhz9JticBo3Nx4zhzUFXcggEDw1lkfzMI0KuLp7dW4dDCvbfgAKlLSX3yGmYg0gtXcw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
```
本公众号“猎洞时刻”旨在分享网络安全领域的相关知识，仅限于学习和研究之用。本公众号并不鼓励或支持任何非法活动。
本公众号中提供的所有内容都是基于作者的经验和知识，并仅代表作者个人的观点和意见。这些观点和意见仅供参考，不构成任何形式的承诺或保证。
本公众号不对任何人因使用或依赖本公众号提供的信息、工具或技术所造成的任何损失或伤害负责。
本公众号提供的技术和工具仅限于学习和研究之用，不得用于非法活动。任何非法活动均与本公众号的立场和政策相违背，并将依法承担法律责任。
本公众号不对使用本公众号提供的工具和技术所造成的任何直接或间接损失负责。使用者必须自行承担使用风险，同时对自己的行为负全部责任。
本公众号保留随时修改或补充免责声明的权利，而不需事先通知。
```  
  
  
  
通过360网络空间测绘发现一处edu站点的后台  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup7EEl6eZwROw7PBnbcRLtJIAVic1TlFQV6yJicQE1iblr3NKDcy4ajaalhGzSVFPv2xu3BJUmVKvvnlicaDRavviaNrBHtqGZjlAibjA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup5zjtRsqRHxYibCKS5YuESF4OOg4J1fRibrEHhYWWZ3H7oQC5qX1QnXptHGy9wk19SaibkJibI8IyQn3Zp4JouSreeqlCg9c3su1ok/640?wx_fmt=png&from=appmsg "")  
  
  
尝试弱口令发现有滑块验证，难以突破  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7tFzMq4fZ0oJu7Arpx7VuzpBxk24L4LWvtRTSoIYAdJWic0BEhzmNrsDuxWu2iaGM6EQJzA4jcA0dkVibVQpo2uicrNGOsaQmaCLI/640?wx_fmt=png&from=appmsg "")  
  
  
使用浏览器插件：雪瞳，提取该站点的API接口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup45UicLTXFM4RdlhlCrPLnTZIeBvAybU2nP7l03DaWSsVNoBKPmDnIibxRd5cyRQu3SfOLFHRfMrIPxKPhs8D3gv3yS7Nzx0yGMc/640?wx_fmt=png&from=appmsg "")  
  
  
复制URL后使用批量请求器，筛选状态码为200，但是返回长度与其他接口明显不同的接口，一般会有惊喜  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4hzaffCMwgv9kSC2NeJqibDSf7zkW7v3FUx17M9iaNibUcTqBmc7aHkySlHrqWo4Wx0AkryMfmQaT0icicm3Dvib0z9r5Zyrf3LGK6s/640?wx_fmt=png&from=appmsg "")  
  
  
  
访问该接口，根据接口名称：  
  
/common/common/upload/source/file  
  
推测为存储后台文件上传地址的地方  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5GYicGMXUwykTf4mgeDybBM2Dks72icTswjL0bZwib1jw7zhAicibdRct5P6CicIiaicelGAjSA51oibKeJiaTXs9cYHNawCeTcblKibkTHE/640?wx_fmt=png&from=appmsg "")  
  
  
将拿到的文件路径拼接在o2o6.xxx.edu.cn后直接跳转回了登录界面，难到做了鉴权？  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup50mZemth87NQFaheKG4XHiaeqOlVicibr0q5r3yNOJ9L23bQusIicKd4JNFLAxwVjNcQdKIT4Mkjibe5ldWS6kbOrRkcQ8r3vS0cNg/640?wx_fmt=png&from=appmsg "")  
  
  
继续翻刚刚的API接口  
  
发现接口：  
  
/common/common/site  
  
处出现了：o2o9.xxxxx.edu.cn，且后接的文件格式相似  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup6emrribnYYG6J7NbzSwbgEO34MQOnYbvdiaNpJSqRevDxax7YEm87vW6W3JlqdR6N3YQQOmSpOHJYByGm8bu0I3bKpz8Jmzxfxk/640?wx_fmt=png&from=appmsg "")  
  
  
猜测可能是多服务器架构，  
  
o2o6 可能是业务服务器，负责接收上传请求、处理文件信息  
  
o2o9 可能是静态资源服务器或对象存储，专门存放实际文件  
  
此时再次拼接可以正常访问（竟然还是永杰无间的图片）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7hr3peDho9xDztozFiaWeVS3VtiaTMhrCzc9Gt0ECGyOvHluGIESqMKNBB11UyCYZ2iclshAgWKIG96ibfjwxibWpdX1dH1kUq8zsg/640?wx_fmt=png&from=appmsg "")  
  
  
只读取图片危害太低，回到  
  
/common/common/upload/source/file  
  
继续寻找高危文件  
  
  
发现有txt文件和刚刚测试文件上传的pht文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4kXK90nTxG2AUdsrKCpYOaISvo9osRiaXjNP7oJ5kY3rSgoQkBJzJiatKACKgsCngX7LicYs7dXfwqfj4T4pS2hlW8LIRiad7fBrs/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4Y3oODm5vEHn10icbQvISeOx7Ql24V6tmJGnLbjqnPNoty5Uz8hjlDx5ct6YZQvmEB8fZDKjXVHxh6OKCcJTuUW9Lr3bPMb92I/640?wx_fmt=png&from=appmsg "")  
  
  
  
Python脚本提取所有txt文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4iaCd5qDP0x69D3yUTEoICicxZDKjGEZz90F04BYSwvSe4ibicqXAXicmMlzFVnp1nGq5jG8wotMk7rMjxic7lZXYnyoKdUbbib6C5icc/640?wx_fmt=png&from=appmsg "")  
  
  
Burpsuite遍历所有txt文件，发现其中一个文件疑似开发日志，泄露大量平台账号密码，实测可以接管，危害极大  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup7KY2icZCJhkZrvu07MxyU6X4eR6viaZcFHo1lXLr7VsxXlwTgjTGTZrRrU9ybTbDX27xuxE0MGrZUpyib4LdxLd39zdwica3OXDOw/640?wx_fmt=png&from=appmsg "")  
  
  
最终泄漏了大量密码信息。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup6wym1pnTKJQnEqOFkHwxWoQurIuzb4zUXGOXv6NAfcMX8Jrg5AhrzaYscp4nDT5lXgTveJIG6hKDMazhhk4GqAO0oHRmzibUu4/640?wx_fmt=png&from=appmsg "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup46ib5iajjK0uoicD5BGzDzCTvdzzgIvEaYiayTFBiazibkib5d3UmHePSVaYf1QG2XnW7Hl1hZ4jLCOQzyBrhTDuva7KGicrP8AJupKrU/640?wx_fmt=png&from=appmsg "")  
  
  
    
  后台回复【260319】获取上文中快速请求url的工具下载地址。  
  
  
  
如果需要挖洞实战src培训(含一对一技术和入职解答)和安全考证，欢迎看  
下面末文  
介绍嗷～加群也可以获取一些新的文章推文～  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup4pf43UaR4KAkK2fv3gGqiclLibjNrMtN1P40t6r1a2v1oqZ24sQHrVr88NicbqbFr7niaicLyuZqiat1UnWuBnnE4sarvfyPdiakNYto/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/pxmgfRlwjjQEDKVbwyMsgkkXnIGyoQh8WqO1yON9a5qQREgXKAxGXgUic5mnhJPFeZepvrKQnrgevjFqW9icAhTg/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TjzCwgOAXajGjch5dJybW7g6niaFmGsenWK3eRSuh6Zc2nBm3juAHia3BXrLEkW4Q6zXicjib80ibCbA3dqetAep3Vg/640?from=appmsg "")  
  
「 往期推荐」  
  
  
  
[推荐一个SSRF自动化扫描Burp插件](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489677&idx=1&sn=93463a5e05577c832108e3185adfd5fc&scene=21#wechat_redirect)  
  
  
  
[AI大模型提示词注入实战](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489656&idx=2&sn=a6629e90723feee36833a724231eb66b&scene=21#wechat_redirect)  
  
  
  
[实战案例｜信息收集新思路并三次绕过登陆检测](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489716&idx=1&sn=4f8ae2955ea03e8f87e1f9d6171e3a60&scene=21#wechat_redirect)  
  
  
  
[关于网络安全超低价格考证CISP、PTE、NISP](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489670&idx=2&sn=0763c8952fb77162909b12c9cdea771f&scene=21#wechat_redirect)  
  
  
  
[Webpack打包js.map泄露导致的通杀0day](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489640&idx=2&sn=3469362ed58fa6ed8b95e26652c9c265&scene=21#wechat_redirect)  
  
  
  
[企业SRC赏金漏洞挖掘实战-多个奖励条件绕过漏洞](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489549&idx=1&sn=5683235b8fd49c5cb1601a0ca0b7d1bf&scene=21#wechat_redirect)  
  
  
  
[[猎洞时刻] XSS如何乱杀企业SRC赏金](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489507&idx=1&sn=3a49f4eb79fe4723c281ea932c510105&scene=21#wechat_redirect)  
  
  
  
[开局一个登陆口渗透二十多种方式-公开课](https://mp.weixin.qq.com/s?__biz=MzkyNTUyNTE5OA==&mid=2247489446&idx=1&sn=938523b3af2811d7a6601434c2924ca6&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MoM4ibZQic0icEr4mg4zIh4m4JicbKk4bzSREndPB6iagvlib7gOJqFJnrO0bNINt8a9eDVD1apJjuKD6Xcj0fAxPmBQ/640?from=appmsg "")  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/6sTFU8pTrmbOrffDZC4eviaUGATv5IdZibGfKicjoXicLWHzR2P59VNmwibojvurAjiaLXV3vmiamyMqgTND2EdqesU6g/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/6sTFU8pTrmbOrffDZC4eviaUGATv5IdZibGfKicjoXicLWHzR2P59VNmwibojvurAjiaLXV3vmiamyMqgTND2EdqesU6g/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/cN92fstOicgIODrJ4zh2ur1RublJ5Go9EwvnnfiarROZV2dyggctibQGrCCQMGWIyEQKpV41PRSvuibTRqL0dOhHuw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/KX4I8DCXpFRUZiackUcKHBakOymyt29sNiaXWjFzq53lRLkBCae3uluibWzBcmFd6VjckWtdyJINx8YcsZicdjJIFg/640?from=appmsg "")  
  
猎洞网安第四期挖洞培训正式开启！  
  
HAPPY NEW YEAR  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
猎洞SRC挖洞培训简介  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
猎洞时刻，专注网络安全挖洞领域的实战培训。  
  
团队成立于2023年，至今已吸引上万名安全从业者关注，累计帮助众多学员从入门到实战，逐步建立起在挖洞方向的影响力。我们致力于为每一位在挖洞路上探索的师傅，提供真正有价值的学习资源、实用的实战经验，以及永久在线的陪伴式答疑服务。  
  
  
2024年，我们从“安全小圈子”知识星球起步，逐步搭建起成体系的挖洞培训内容。起初只是一场小范围内的内部培训，却意外收获了众多师傅的认可与推荐。  
  
  
2025年，随着课程体系不断完善、课后服务质量持续提升，团队口碑在圈内迅速发酵。如今，无论是在主流SRC平台、众测项目，还是网安大厂企业内部，时常能见到我们学员的身影。  
  
  
2026年，历经三年实战沉淀、四期课程迭代，在众多师傅的推荐与期待中——  
  
  
猎洞SRC第四期于2026年3月初· 正式上线！  
  
  
📌  
往期课程回顾：  
  
第一期：16节课（已结课）  
  
第二期：22节课（已结课）  
  
第三期：37节课（已结课）  
  
第四期：预计50～60节正课 + 附赠20节零基础入门课程（火热开课中）  
  
  
📌公众号也在短短几年内，收获了上万位师傅的关注与持续支持。感谢每一位阅读、分享、推荐我们的朋友，是你们的认可，让我们一路走到今天。  
  
  
愿所有走在网安路上的师傅，挖洞如饮水，洞洞皆可寻。猎洞时刻，始终与你并肩。  
  
  
  
  
挖洞培训、安全考证、扩列，欢迎加我微信！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5cEBENTmWaCicoEheEEFMjHR5KaD1I0Hj4brYkZq4uRSV6ZtXicz9k0SHdGVELFiaa3iaVt7hXbPr2Vl5ibTJibjEYtlNBQCE6HO5BM/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
猎洞SRC正课进阶第四期课表  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
    本课程覆盖企业赏金SRC，众测赏金，EDUSRC，CNVD和工作项目渗透挖掘。课程内容方面主要是Web挖洞、小程序挖洞、APP挖洞、JS自动化加解密逆向、小程序自动化加解密逆向、云安全、HVV护网培训、项目教学挖洞实战、AI大模型安全、前端安全渗透等内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup68goK4nS6VI3gn60nCLIwp0BAJG1jlx2jaRob3fhNpEUGXaORBFBia3HGnnXxW8zbbOD4kWzMxWHPu1OzfT7m0ICW4dBeQdH4I/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
猎洞学员EDU挖洞成绩介绍  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
该部分内容实在太多，这里仅展现部分成果，想了解更多可以加我微信了解。  
  
  
在Edusrc平台，我们是2025.4开始挖掘本平台，截止到2025.12底，我们在2025年个人榜单第一名、2025年团队榜单第四名、全年总榜第六名，也算是进步比较快的！非常感谢这些小伙伴们的支持～ 并且会给冲分的优秀学员奖励红包、鼠标或者键盘奖励！  
  
  
以下为2025年团队榜单，第四。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup47Q9yeOYHzvAGUvtJQjMMeBu99icJQlACfUoJkcNibEjXBwL6uZ8GefrwaUItGmmYeP5sIIAKOwdyGLafXvhA2PoTUQEj3wjXzA/640?wx_fmt=png&from=appmsg "")  
  
  
以下为Edusrc 2025年成员个人榜单，稳第一：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup7JL1icdib9zXgG2uUuwwScAwm9zUM93YZ0LibPzLUPPAzA8Pxs3kAGIczxSj2dSiavNRb41jKndK0ccSEEu6ZDvXAKTQnQBw29ELc/640?wx_fmt=png&from=appmsg "")  
  
  
以下为Edusrc平台所有年份汇总的总榜，第六：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4jD7MDTcsKutOZU8QDiakjDrgec1oQLT49picuglSy2orwiaRogSxyI0yMQiaDua6WrrAFRsiazlkouFLQiaU0YJCvwjkvDP0xE0fyU/640?wx_fmt=png&from=appmsg "")  
  
  
以下为其中单个学员的个人edu证书（并非多人汇总证书）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup6GzP3DnrYNkribSjA5jZibsuzANRwqpLWGookh2oM3C1Bic6Fu1oJxSI2YFMSJSAp6RMgoVdK7wskdH8TB00NI5c7Sepdgic0icic4I/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
企业赏金SRC和CNVD  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
学员部分赏金和CNVD荣誉。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5gx0vRDEtNugy3I6pv7hMrvfLHficNWPCdjkEz4OyCibdLDjDjn8KKYqYtgS2GfpbheurvVrfjkt2mpTBPyqrAyiclic8icrTeLxqA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTH9uGoiaibSicrHjpP7JPHMnqraO5bf3yJibLStSPvnphsLbLzcW7NRcnsoljHjZ9IVib3TWDV549OiaT9Yw/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTHica68o8ricbIGvbVRGsvCBojIWz5ZnHcntAXwm2yibBK51JXM5c0kzjTia0psDvtfy22vDQPq3QiaFWgQ/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTHico4s7YfpmcHmWDlhInfXQ3onZicYXP4Uj0ouTBT5XjibfTpA5kiaZzewcDnlKhicLxy12Oa2lm7jhU0g/640?wx_fmt=other&from=appmsg&randomid=vkc2323j&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup6Xfw1tqotTNhVtezd2Dhd6WwQLqUGCtMFKkdtR9nEA78IeMu6qZdfzpHTI4ziao3ap3szks0S8O9l3cfsDWt3pDje6OicnJvk0I/640?wx_fmt=png&from=appmsg "")  
  
  
还有学员的CNVD证书，多的摆不下。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7zydZbluqDD8hdQWiaWlDmHJCvZr3Ns6hfKictgYiaPhJicSSIGHVkTibBFB48vNxa7ys3YLjPfjchalvJ2Yic8OvUsHib2iaTSSTYqWA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7TEql9u6j74sibz6pFFUSxIA51YHLGqVk7aL7kCI8lPvYY0t4hFJY57TdgDia0EYLhRuuxz46UTXyiaW9E7hg43estefjDhHibmHo/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup66AJXiayrHu3YyUicnicCRcnDORsBIhxg0RmkuxIqJmDSbelrcUQRppowJG9BSe0uNyqyMPxdpZ9ebia0fkdB6N7FzcrfBOzF2hGc/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
学员网安大厂入职层面  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
    很多人挖洞一方面是为了做赏金、证书，但是更多师傅来我这边的是大学生，想要入职一个好企业，才来锻炼自己的挖洞能力，挖洞是这个行业的技术基石，只要挖洞做的足够好，入职才能更顺利。  
  
  
     
 网络安全常见几个安全大厂，比如技术顶尖代表-长亭科技、还有网安一哥-奇安信、网安黄埔军校-绿盟，还有安恒、深信服、启明星辰、360等老牌安全公司，均有不少学员遍布，下面是部分offer，如有造假，欢迎打假👊我！  
真正的大厂学员聚集地！我们从不推荐那种垃圾低薪的伪网安工作，最低也让你去冲个做挖洞、渗透的网安厂商。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4MqHR5FQwOKicazcoZibcRoLZqZsJmkeGJQj9QicLOibIzVpUcbFm0L1clyQTUztc0rDFOkrZaZiaLIhwQ4MibraVNNGFFF8PArj8ZQ/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5M3lUqtya4FU7ldibnlT2ohqgU3VfHPsWH7TMZRkXbv9gjCCqVRwujS8BJXJo7eic0ViaJJXwBlGXlm753JFR2icYH8ibpZVaWAK3g/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTHicVgicZmS5Yd5mD2hUJQ4YcQOFvcTeZOJs35zkDNDjcOFC0WpBaz2ia3mF8CHsCdC4IsFjJJRh46L8g/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTH84CZG0rxw3p3txiar8hJibcTIW1TWkYEQyTzhlTNG0ULg55ST3qoFJicKqdG2duTK3vnSyGJSCVB84w/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTH8NuPia6aIOENP4XGImm3Ycrn5D3XHRicyCjJXdLklxpSDSAoYppBCkgIlVlIILh3nicRHFOqBDIKdDg/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/d6JIQYCSTH8NuPia6aIOENP4XGImm3Ycrh9yBcBMDSRckD2796FbMX3iacAwAbzUgdTlT4MtDUFcQUykkWcNgk4g/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup6z5MqpwjRicUCMOOxDQOalgh67DLfvicR0gGYjPqluVM8D5z7yAVNlPflAzflGia9EoaMb5LuKrHW0IvnhG4bgEfxjhLkYM90ZW4/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
猎洞网安零基础课程-赠送  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
网络安全完全零基础、小白能学吗？？？  
  
   在之前，我们课程本身是做直接实战挖洞，解决学员在入职挖洞、赏金挖洞、证书或公益挖洞的无法入手难题，所以是需要具有一定网安基础的，但是有些师傅零基础也想在我这边学习，完全没有问题，  
第四期直接赠送猎洞完全零基础课程！帮助师傅快速打好网安基础。完全零基础也可以学！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7QD5bp6d7vVCzpF7KtMULbGPmtFRGrhhlAyvvdAeoSnHnxI3rBAyAJNlAqNpialtyWv3xU4bjSJzwh7brH616p710HE6UYC5J8/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
上课形式和资源  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
 我们上课是腾讯会议直播上课，都是晚上八点多之后开始，这个时间段无论是大学生还是就业人员都已经时间空闲可以学习，每节课都有录播，可以反复无限制学习。课程保证提供 直播、录播、课程课件、课程工具全部提供！  
  
同时还会额外赠送一个知识星球。  
  
  
课程课件：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup7mpL0c5CIkgVCUDzDtvIQywfa0b3Kzsk61r3CJKGKnAGSLa6aDBfvVmWERLls8aofEJFM6OibexSl7mn3Vicb6z8XCeFVAVoUmg/640?wx_fmt=png&from=appmsg "")  
  
  
课程录播：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5ZF2PTgZZGxL7e5c1icKVE5IO0kcKOR2GoicvbHjFAyUB3Sgga1vPicuLtibBRZU6DsauS5A89tFuR4Y3rqzfDsua2TL3sHEWGzj8/640?wx_fmt=png&from=appmsg "")  
  
  
课程工具：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup4fujpuC0Y9G6rAnkv9YNPXjMGF3bANjYpU73SRbmLX6XxXZm0mKiaSEeUAV9Nt7ibxibicxMlNr56f2KuYoaibcrdFY1I8wooaTmzM/640?wx_fmt=png&from=appmsg "")  
  
  
赠送千人知识星球小圈子：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ucA3HFqtup4AF9MtXRicCciaAtZs2lNIibpH3iadP8OcsKXmKYITU7wvgiakMVbu4WC2o6LYRFiclx3JGfd7297XQEuYkDpemCEQ9NicJKqmjg69Yc/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XlDccKmwUxpdHwn9CAZQGzA7zhUXAWlPWqiaqgoX5mroSGLZz9d8lKOyiaIHibcOiajtiaBZ2fteBkSEXeUlCX2ZRMQ/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/CRCWJpzeT1EnCOpghLqMn1pUdGSh92YplOib5UKrjeNicoaGtSKNXK63icibfzpufRbicGictnf2RBfHPOibXZSicibzm0A/640?from=appmsg "")  
  
最后结束语和价格  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVSvuzvYiba0p67Qu5yqicmyyx6aBszyQ2OnrdeAARKPUEYGtWjOyGoc5JnjHzb8JFUwthnZlmlYHCh0WMogSzWw/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tTibAMib2Ruh2xpqvLTonQuSq625EZ7wEzCaLScjPQywlcicXJHLI2LTv6Q36BsICLqibV0jDvD6IfRep3ib7AXmryg/640?from=appmsg "")  
  
    课程价格为1888¥，一次报名可以永久学习、持续更新！包永久挖洞技术解答和入职解答，不会有二次收费。目前报名还有额外优惠，相信我，来到我这边可以知道，这个价格绝对是偏低的，更重要的是售后服务，全包技术挖掘和入职解答！  
  
报名可以保证之前讲过的课程录播，还有后续更新的新的一期都能永久学习。  
  
学员在挖洞时候的任何技术问题、入职时候的简历和面试等问题可以随时咨询我！  
  
报名可以可以直接加我下方微信，报名早的话还有一定价格优惠！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ucA3HFqtup5cEBENTmWaCicoEheEEFMjHR5KaD1I0Hj4brYkZq4uRSV6ZtXicz9k0SHdGVELFiaa3iaVt7hXbPr2Vl5ibTJibjEYtlNBQCE6HO5BM/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Uxiano3ib6ECceVUPW0lnfaN4byRTz3gV6nCTaK2ReZUUmSzKbQ6DgtZceUpnnj6JrMcRb3NY1gNTFeYXoYZHr9g/640?from=appmsg "")  
  
  
  
  
