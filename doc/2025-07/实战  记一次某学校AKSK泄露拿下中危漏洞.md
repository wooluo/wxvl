#  实战 | 记一次某学校AKSK泄露拿下中危漏洞  
 渗透安全团队   2025-07-21 02:36  
  
   
  
# 前言  
  
这个资产是偶然在漏洞报告平台上看到得一所教育局直属院校，所以就以 Web+微信小程序+微信公众号去进行资产收集，扩大资产暴露面，以便进行渗透测试。在官方公众号当中的电费充值网站，通过渗透测试，发现存在 AKSK 敏感信息泄露。  
# 信息收集  
  
1、找到目标资产  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2a9ydAic4uCT0bULQCPXX7zcZGzpFGuhvazJDaWZISLNTZhSwI0kSiabDA/640?wx_fmt=png&from=appmsg "")  
  
  
这里我们需要进行测试得功能网站是“电费充值”  
  
下面这是电费充值得登录栏  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2at9RVnhbdDmAp2zUtuVUx5UJXgjAIUODy90sjPtSY2BrPhfiaboiaCkSg/640?wx_fmt=png&from=appmsg "")  
  
# 测试  
  
2、通过 BurpSuite 抓包进行观察网站得所有流量，在众多流量当中存在一个 config 得文件流量  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2aqSgqpA1S25qqBq1qTpzXz09p3zflCzs1JKZqvzECze9TwjjcAZ2OUg/640?wx_fmt=png&from=appmsg "")  
  
  
在流量当中得一个/static/config.js 当中存在一个 corpid 和 appkey 以及 appsecret，这里就是 AKSK 泄露得地方，泄露得是钉钉的 AKSK  
  
钉钉的 AKSK 的特征是前四个字符是 “ding”  
  
3、通过使用工具获取到钉钉得 token 这样就可以进行接管钉钉的管理员账户  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2aibef0155qUd7Z5B9LVFicVfeKy0alqFO47l29vJvjaFibDib3ibpcHXuOYg/640?wx_fmt=png&from=appmsg "")  
  
  
进行接管账户的时候会因为 X-Forwarded-For 未知而造成接管不成功，这里只需要填写*.*.*.*  
即可接管账户  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2aR4vrWSYsMY8FHgzkc8XNVyDFzlBX9sWeergV3LWEnzR9VosKVLVxUQ/640?wx_fmt=png&from=appmsg "")  
  
# 总结  
  
这次渗透主要考察的是渗透时的细心，要观察每一个流量包，看看流量包当中是否存在敏感信息泄露（如：默认账号密码、AKSK 泄露等信息），在做资产收集时不要只局限于 Web 或者微信小程序端，有时在官方微信公众号也会有意想不到的收获  
  
本次漏洞已提交至相关平台进行修复，切勿再进行任何的渗透测试，后续任何违法行为与本人无关，本文章只作为学习思路进行学习，仅供参考！！！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BwqHlJ29vcpv93EljMWWiaazQjvl6EK2aPbPE9QaNMeQjOJ2kJ1EJDQUufA7rxqW1TnSuxaia5XMlh1MlkqqOGnA/640?wx_fmt=png&from=appmsg "")  
  
申明：本公众号所分享内容仅用于网络安全技术讨论，切勿用于违法途径，  
  
所有渗透都需获取授权，违者后果自行承担，与本号及作者无关，请谨记守法.  
  
**★**  
  
**付费圈子**  
  
  
**欢 迎 加 入 星 球 ！**  
  
**代码审计+免杀+渗透学习资源+各种资料文档+各种工具+付费会员**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/pLGTianTzSu7XRhTMZOBAqXehvREhD5ThABGJdRialUx3dQWwO7fclsicyiajicKfvXV4kHs38nkwFxUSckVF2nYlibA/640?wx_fmt=gif&random=0.4447566002908574&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
**进成员内部群**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/pPVXCo8Wd8AQHAyOTgM5sLrvP6qiboXljGWG0uOdvcNR8Qw5QJLxSVrbFds2j7MxExOz1ozb9ZoYwR68leoLdAg/640?wx_fmt=jpeg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/pLGTianTzSu7XRhTMZOBAqXehvREhD5ThABGJdRialUx3dQWwO7fclsicyiajicKfvXV4kHs38nkwFxUSckVF2nYlibA/640?wx_fmt=gif&random=0.09738205945672873&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
**星球的最近主题和星球内部工具一些展示******  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/pPVXCo8Wd8Doq0iczyRiaBfhTQyfzqSGuia4lfHfazabEKr2EDe7sGVoxUhLrNRA4FbI1yef6IkWdmzxvZrTiaJncg/640?wx_fmt=jpeg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8BmE6FAA8Bq7H9GZIRt1xYZpmYNWxrrzolt71FtX5HyM03H0cxkiaYelv7ZSajLtibEdBXUpCibdItXw/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8ADSxxicsBmvhX9yBIPibyJTWnDpqropKaIKtZQE3B9ZpgttJuibibCht1jXkNY7tUhLxJRdU6gibnrn0w/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8DKZcqe8mOKY1OQN5yfOaD5MpGk0JkyWcDKZvqqTWL0YKO6fmC56kSpcKicxEjK0cCu8fG3mLFLeEg/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8DAc8LkYEjnluf7oQaBR9CR7oAqnjIIbLZqCxwQtBk833sLbiagicscEic0LSVfOnbianSv11PxzJdcicQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8B96heXWOIseicx7lYZcN8KRN8xTiaOibRiaHVP4weL4mxd0gyaWSuTIVJhBRdBmWXjibmcfes6qR1w49w/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8DAc8LkYEjnluf7oQaBR9CRBgpPoexbIY7eBAnR7sWS1BlBAQX51QhcOOOz06Ct2x1cMD25nA6mJQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8AqNwoQuOBy9yePOpO5Kr6aHIxj7d0ibfAuPx9fAempAoH9JfIgX4nKzCwDyhQzPrRIx4upyw5yT4Q/640?wx_fmt=png&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
****  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/pLGTianTzSu7XRhTMZOBAqXehvREhD5ThABGJdRialUx3dQWwO7fclsicyiajicKfvXV4kHs38nkwFxUSckVF2nYlibA/640?wx_fmt=gif&random=0.4447566002908574&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
**加入安全交流群**  
  
  
[](http://mp.weixin.qq.com/s?__biz=MzkxNDAyNTY2NA==&mid=2247513602&idx=1&sn=98045772ff9aebe8792552e32523bf83&chksm=c1764badf601c2bbcc199da519611ac8c36c17e5a0554fe32ab9d9769403a495187058f19f3d&scene=21#wechat_redirect)  
  
 			                  
  
  
**信 安 考 证**  
  
  
  
需要考以下各类安全证书的可以联系我，下方扫码回复  
**考证**  
进交流群，价格优惠、组团更便宜，还送【  
渗透安全团队  
】知识星球**1**  
年！  
<table><tbody><tr style="outline: 0px;"><td data-colwidth="557" width="557" valign="top" style="outline: 0px;word-break: break-all;hyphens: auto;"><p style="outline: 0px;"><span style="outline: 0px;font-size: 14px;letter-spacing: 0.51px;"><span leaf="">CISP、PTE、PTS、DSG、IRE、IRS、</span></span><span style="outline: 0px;font-size: 14px;letter-spacing: 0.51px;"><span leaf="">NISP、</span></span><span style="outline: 0px;font-size: 14px;letter-spacing: 0.51px;"><span leaf="">PMP、CCSK、CISSP、ISO27001...</span></span></p></td></tr></tbody></table>  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8AOzYX7kxefGbGGZg3g1ltkN30q9hceg23PiczgUqMT0EE9w0fLK9uw1eKWwQX9TljXQe1OQeHRZ2Q/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**教程如下图**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pPVXCo8Wd8C3Gu1libJC0muV1WmOFa3XM3fTyOiaOJYPgCiaHV6gkJJBia6Fjeds9w9pxxyyPNJhbcfK3I1tcGueTg/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ndicuTO22p6ibN1yF91ZicoggaJJZX3vQ77Vhx81O5GRyfuQoBRjpaUyLOErsSo8PwNYlT1XzZ6fbwQuXBRKf4j3Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
  
  
**推荐阅读**  
  
  
  
**干货｜史上最全一句话木马**  
  
  
**干货 | CS绕过vultr特征检测修改算法**  
  
  
**实战 | 用中国人写的红队服务器搞一次内网穿透练习**  
  
  
**实战 | 渗透某培训平台经历**  
  
  
**实战 | 一次曲折的钓鱼溯源反制**  
  
  
**免责声明**  
  
由于传播、利用本公众号渗透安全团队所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号渗透安全团队及作者不为**此**  
承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
好文分享收藏赞一下最美点在看哦  
  
  
