#  使用burpsuite插件如何无脑挖的第一个公益漏洞（小白挖洞）  
原创 lucy
                    lucy  three安全之路   2026-04-03 03:19  
  
###   
  
本公众号（three安全之路）所发布的技术文章，工具及研究内容仅供参考，所提供的信息仅供网络安全从业者、授权安全测试人员对自己所负责的网络资产、信息系统及相关设备进行安全防护。利用本公众号所提供的技术信息、工具或方案而造成的直接或间接后果、经济损失及法律责任，均由使用者本人自行承担。本公众号及作者不承担由此产生的任何连带责任。  
  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="30" valign="top" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:24px;color:#d93025;display:block;line-height:1;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><strong><span leaf="">1</span></strong></span></span></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><strong><span leaf="">漏洞挖掘</span></strong></span></span></td></tr></tbody></table>  
  
漏洞产出地方，无非不是edu漏洞提交平台、补天、漏洞盒子。  
  
资产就是对应的某学校或平台上指定的某公益公司  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="30" valign="top" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:24px;color:#d93025;display:block;line-height:1;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><strong><span leaf="">2</span></strong></span></span></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><strong><span leaf="">小白挖掘</span></strong></span></td></tr></tbody></table>  
要么弱口令，要么找网上的nday，要么一些没有危害的验证码轰炸，swagger-ui未授权等方式  
  
平台回复的理由：此漏洞之前已有人提交过，故盒子会对此漏洞报告进行忽略。非常感谢您对盒子与互联网安全的支持  
！  
等忽略原因  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ2yVrZpDKzcmRVIZlKQxpVuUoPY96xeJcYUom4CuREaQmt3Rciaz5IrdbsVeAclOLGkD7S1jecsSEPVE47tjNEeEiaNchtiaTaKkM/640?wx_fmt=png&from=appmsg "")  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="30" valign="top"><section><span leaf="" style="font-size: 24px;color: rgb(217, 48, 37);display: block;line-height: 1;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);padding: 0px;outline: 0px;max-width: 100%;font-weight: bold;box-sizing: border-box !important;overflow-wrap: break-word !important;">3</span></section></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><strong><span leaf="">第一个公益漏洞</span></strong></span></td></tr></tbody></table>  
第一个公益漏洞最简单的挖掘方式：burpsuite插件-xia_sql  
  
https://github.com/smxiazi/xia_sql  
  
选一个你想测试的目标http://xxx.xxx/，对里面的功能进行点点点，所有都点一遍。然后直接看插件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ05ESib755gjW11OeAJmeJCrTWAe4GibLibhXaNt9VFeo4TcMcxOfQAs4dluHTnHnibzpMhZXWaFBTjvhaErm7MzZMERFFNYsnrvno/640?wx_fmt=png&from=appmsg "")  
  
简述一下插件功能就是：对注入点比如id=1进行sql注入探测  
- id=1'  
  
- id=1''  
  
这个两个的返回包长度进行对比，有变化就会出现勾号  
- id=1-1  
  
- id=1-0  
  
这个两个的返回包长度进行对比，有变化就会出现勾号  
  
误报情况：一般变化长度只有1个或者2个，就是没有sql注入。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ3PHB6pz5iay8qUxrtZ6O1XECzgO3SVnIoZfkOTltANp8ZzIB5K0ag8VYvPQiaxFH2QhNDuNMpAoVk1QQONZ6bBHic7kP1UdjQ5bQ/640?wx_fmt=png&from=appmsg "")  
  
出洞情况：一般变化长度很大比如几百，百分之八十都是有sql注入的（当然这里测试的不是）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ0PYictVJoxtHODGjfdfQtxGSG0V1BmLtBQicIlMgiaJatNWicnMYKXpuk9jwXmQyC6YJIEWqHTXdYaDQqk6Vu0IjurHSJecyUvMQ4/640?wx_fmt=png&from=appmsg "")  
  
然后sql注入一般来说，重复的算少，当然平台说重复了也没法。从这样  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ1HcQ4RGjE4lcfonakzffYWYUN66ZImnKFJ6RFNwiaVKF5OOdXjUKpfbUX1kPH0shBPpokX3QhictJ9yFzzqNicFiaxzFyNbAXJXdA/640?wx_fmt=png&from=appmsg "")  
  
到这样（小白练手看，大佬就没必要看啦）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ0VQNt7NtzBZAerdOgJc3dUfhoXMwTSfctAmyuz3rUWVLoEAicdE9FbBSOa69hZktES0qrOoLnicvCYmYcQQvR0r2ZfGBdOcUPJ4/640?wx_fmt=png&from=appmsg "")  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="30" valign="top"><section><span leaf="" style="font-size: 24px;color: rgb(217, 48, 37);display: block;line-height: 1;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);padding: 0px;outline: 0px;max-width: 100%;font-weight: bold;box-sizing: border-box !important;overflow-wrap: break-word !important;">4</span></section></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><strong><span leaf="">容易资产-小程序</span></strong></span></td></tr></tbody></table>  
直接微信搜目标，一般就这里看小程序和公众号  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ1Lj3icMLvaibEicyDcmUDtRVVoqfcywV4VHGxU4vHXq9EibTm581TXIG1dXN5I6fOY6VQ4phMtMN8AeodN7ob9NHjDw7WwkiblsnLE/640?wx_fmt=png&from=appmsg "")  
  
然后windows开全局代理，burpsuite抓包  
  
这样简单方便，但有很多杂包，不是业务的包，这时候就用一个**插件knife**  
  
**https://github.com/bit4woo/knife**  
  
下面填写不是目标资产的域名，后面遇到bp直接drop（当然你可以选择）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ0FTOlTjhpVfLmOnFvHQjKXGlLUKaW9mJE5U194gMfovJ4icoTO5wib2MfwmC3LlrQuAT1Dh0XjuxtmlCXHOFS0Q9J2DJKicp4Cjg/640?wx_fmt=png&from=appmsg "")  
  
然后对history进行这样，意思就是隐藏dorp的包，就看不到qq.com,cdn.office这些垃圾数据包了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ0hMeCtiaSeP7zS2uFibvVdzIq0ib60kwv8Fic6gJBLibZnKicJgQF9gYplxa2RnzzfibTwwhXVJRj1uicAntTpdTn02YuicGdD3XaZBvP8/640?wx_fmt=png&from=appmsg "")  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="30" valign="top"><section><span leaf="" style="font-size: 24px;color: rgb(217, 48, 37);display: block;line-height: 1;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);padding: 0px;outline: 0px;max-width: 100%;font-weight: bold;box-sizing: border-box !important;overflow-wrap: break-word !important;">5</span></section></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><strong><span leaf="">接口插件</span></strong></span></td></tr></tbody></table>  
就有这用两个就可以了，第一个就是这个熊猫插件FindSomething，可以看js里面的路径和敏感信息等。  
  
https://github.com/momosecurity/FindSomething  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ1hC0Uic2qp8ZvL3OWgeWWNLflhju7XV0rHmeA8RV9UPaEWnoqXXqLGx3TO5Gf7oEGWkicWzFfIrCMqVu5hPUgjk2fQmVpichfQibo/640?wx_fmt=png&from=appmsg "")  
  
第二个就是VueCrack，他主要使用的是vue框架的，这个网站你用上面的插件就没有接口，用这个才会有，有时会有意外发现。  
  
https://github.com/Ad1euDa1e/VueCrack  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ1TbvsqMvZTFzwwfIjAowyOMY5jdaqglPXPv6lRKeTeIG6dMvN11YRGsnIDhGHuVbAf6Lh3zfCOzv0qekGHiaV9AD4o7QJ9hpSo/640?wx_fmt=png&from=appmsg "")  
<table><tbody><tr style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;"><td data-colwidth="29" valign="top"><section><span leaf="" style="font-size: 24px;color: rgb(217, 48, 37);display: block;line-height: 1;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);padding: 0px;outline: 0px;max-width: 100%;font-weight: bold;box-sizing: border-box !important;overflow-wrap: break-word !important;">6</span></section></td><td valign="middle" style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);outline:0px;overflow-wrap:break-word !important;hyphens:auto;border:1px solid #dddddd;max-width:100%;box-sizing:border-box !important;padding:5px 10px;"><span style="-webkit-tap-highlight-color:rgba(0, 0, 0, 0);padding:0px;outline:0px;max-width:100%;box-sizing:border-box !important;overflow-wrap:break-word !important;font-size:18px;color:#333333;display:block;"><strong><span leaf="">铭感信息插件-HAE</span></strong></span></td></tr></tbody></table>  
https://github.com/gh0stkey/HaE  
  
暴露一些key，身份证信息，电话号码，都可以通过正则表达提取  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ3jHm8DckJFERa4RLibZew1icJ5toyibbpC9BCh7VxWto0VicRcDBUV49CMqyzHB25CaoZiav4dkaTYQxbljyicru29ryQBt949ppHdI/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
