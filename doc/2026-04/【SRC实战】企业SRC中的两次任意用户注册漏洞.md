#  【SRC实战】企业SRC中的两次任意用户注册漏洞  
原创 观止安全
                        观止安全  观止安全   2026-04-15 06:05  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/rz592WOpic8s2nO3U1ZkrXe9nGkTztEa2icxkzHaLxIEOXp5R4IW10EDemTIHTicn1jYib8B7O8z3mHph6xuomWz8aXMibuNn98eQfh0Hr7ZQ9jU/640?wx_fmt=gif&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/rz592WOpic8srEQxZXb36uqJOjVSO5Qtoqz7rYy0CP5ICMRDqTMictUl4KzcZKReW3JUictE8pdqqNzb8s8hFLuwtHibz7X1XrJCDKuIGoniaTiac/640?wx_fmt=png&from=appmsg "")  
  
联系方式  
  
**vx：gzaqSec888**  
  
  
  
  
**免责声明**  
：  
本公众号所发的内容仅供学习用途使用，由于传播、利用本公众号所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责！如有侵权，烦请告知，我们会立即删除！观止安全拥有对此文章的修改和解释权。如欲转载或传播此文章，必须保证此文章的完整性，包括版权声明等全部内容。未经作者允许，不得任意修改或者增减此文章内容，不得以任何方式将其用于商业目的。  
  
  
**PART.0****1**  
  
  
**渗透流程1**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/rz592WOpic8uzAaibOYMtAZ503Fic3qa7iafeicg8XHMaOqlKT1ALiarg4weUCIjYTxx4ZWwrFVRtR5p1tsn0m0XxgMA1057grxfwO4CR7iaFq6VNg/640?wx_fmt=gif&from=appmsg "")  
  
  
  
首先先开始常规的第一次流程  
  
进入页面输入信息，发现不需要短信验证码即可使用任意手机号进行注册  
  
![](https://mmbiz.qpic.cn/mmbiz_png/rz592WOpic8vzFWIFE5S9ftCKehbCsjs9yjuqjDcmRF4VEoo71p7UJxASBN4d7BibIJP28D2fZT8MWrX2vB2DwicxX2qnjvSqNpCJYBNHwMfrU/640?wx_fmt=png&from=appmsg "")  
  
注册成功发现，用刚才注册的信息登录  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/rz592WOpic8vNdLY0ZPkz5oQdEI3hoI9h2WhpCLc9JpuTKwmGV7moAD43LvvcibMk4EKlTVGf4F9U4mrM6ZJVeXezJWDhuAibved66aPlacF5M/640?wx_fmt=png&from=appmsg "")  
  
即可登录成功  
  
![](https://mmbiz.qpic.cn/mmbiz_png/rz592WOpic8tfepFPOYh5V0KTOEMXX63A5BAffbHPg0B281EDHFxU30oWkxfIL0XBRJicH5ECdAoDpDAkr2TGAd9sJYj2k5lqxclaexQfOY7k/640?wx_fmt=png&from=appmsg "")  
  
  
**PART.0****2**  
  
  
渗透流程2  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/rz592WOpic8sV859mMTYia4HPZ5sREw16Y0WIV4T1cbcypYNPicwLia5HrOhMcmmk8dicNCEX1aDR0YQrV6xicywr9v1uiaw6UJ2ks0EcB6Vofl8Pg/640?wx_fmt=gif&from=appmsg "")  
  
  
  
这个漏洞在修复了一周之后，发现他直接把站给关了，然后想到当时第一次渗透的时候在findsomething插件看到他的ip，尝试访问ip之后发现就能继续访问站点了，这时我们再去任意用户注册发现根本没修复，一样可以任意用户注册，最后达到一个另类的绕过吧  
  
![](https://mmbiz.qpic.cn/mmbiz_png/rz592WOpic8s7EgP0RA1152icdboAETcDW0lebsCLtibrr3rhkfm1UEQYuf8z0qvHXibojsuBZ3xmEaMSLdHNJFZUzib5LiaxhVTmCPgfeAcP2jKg/640?wx_fmt=png&from=appmsg "")  
  
  
**PART.0****3**  
  
  
**总结**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/rz592WOpic8tlKmt6USz0w93FcjQZLTS5xicDbTuyl6phsdsOSLOfuRHXY7RqpibJzqg92CoIlwmGlyFT7IDiblD9IRybct46uLW9Zcw8w4j0us/640?wx_fmt=gif&from=appmsg "")  
  
  
  
这里的漏洞可能比较简单，很水，主要是和师傅们分享一下思考过程。遇到一个点之后，尝试换一种方法，这里第二次绕过可能原因就是可能是DNS没有解析？或者是域名解绑了？下次遇到类似可以尝试一下，  
本文较为基础，旨在分享，感谢支持！  
  
  
感兴趣的可以加入交流群  
  
![](https://mmbiz.qpic.cn/mmbiz_png/rz592WOpic8vGOA7XiaOgo6OJZo9fywz2Cn79UiaQRhJ6EuZTuJtiax57MGduvVQfHaefQCqToq5j0KsuHDxVpicT9aeDw2qDuqgenia7luS4vUnA/640?wx_fmt=png&from=appmsg "")  
  
  
