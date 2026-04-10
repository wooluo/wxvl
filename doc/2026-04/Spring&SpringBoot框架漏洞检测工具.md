#  Spring&SpringBoot框架漏洞检测工具  
 锐鉴安全   2026-04-09 22:36  
  
go。  
  
部分X  
  
dian'ji'weigweiID  
  
  
  
，  
  
zai  
  
  
cizhi'cizhici  
  
  
s  
  
“证书站的未授权漏洞，忆校园青春  
[阅edu证书站的未授权漏洞，忆校园青春](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247486254&idx=1&sn=993cd82bceba042301a009c28ca2d251&scene=21#wechat_redirect)  
  
  
  
点击蓝字 关注我  共筑信息安全  
  
  
  
  
  
  
￼  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任！  
  
  
  
  
1  
  
  
  
  
背景  
  
  
本次实战的案例，源于某高校的人脸采集系统，听着都感觉危害很大，因为全是敏感信息，如身份证、人脸等，拿到就是高危漏洞。从无账号到登录系统，靠的就是fuzz，详细的过程见实战过程。  
  
  
  
  
  
  
2  
  
  
  
  
实战过程  
  
  
通过一系列的信息收集，高校的人脸采集系统引起了作者注意，为什么？因为有敏感信息。  
  
  
  
  
连Hunter、Fofa都没索引到这个系统，作者靠灯塔拿到了，灯塔确实好使，关键还免费，需要的师傅可以文末获取下载链接！  
  
  
  
  
系统的首页如下图，可以看到，只用一个登录按钮。  
  
  
￼  
  
  
  
  
看下findsomething，也没有找到“注册”功能相关的关键字，同时也跑了下接口，并无接口未授权问题。  
  
  
￼  
  
  
  
  
  
本次案例的关键操作来了，首先抓包观察下登录系统的数据包情况，随意输入账号密码，点击登录。  
  
  
￼  
  
  
  
可以看到登录的数据包中有个login关键字，秉着试试的心态！  
  
  
作者将login改为register，惊喜时刻，注册账号成功。  
  
  
￼  
  
  
  
使用注册成功的账号登录系统。  
  
  
￼  
  
  
  
可以看到获取到了身份凭证。  
  
  
￼  
  
  
  
登录到了个人信息首页。  
  
  
￼  
  
  
  
任意用户注册账号漏洞拿下，这个fuzz操作确实有点妙。都登录系统，肯定得把全量的功能测一遍，一般可以测试sql注入、越权、文件上传等漏洞。  
  
  
  
  
co  
  
  
点击蓝字 关注我  共筑信息安全  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RLTNmn7FBP6LllD9Qm4I2eKvyHt1WlNDd8O4wJKfGhV48dQHTMk8icXxCBI5BKxPqWQOfwFWxPtG2e8iazqUssJg/640?wx_fmt=png&from=appmsg "")  
  
**免责声明：**  
请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息、工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任！  
  
  
**1**  
  
  
  
**工具介绍**  
  
YYBaby-Spring_Scan这款图形化工具针对Java 生态核心组件Spring&SpringBoot框架的一键梭哈工具。  
  
  
该工具不仅集成Spring&SpringBoot框架常见未授权目录扫描而且覆盖多款CVE的漏洞扫描及漏洞利用。  
  
另外工具内置内存马植入、heapdump 分析、文件读取、反弹 Shell 等实战功能，新增多线程与代理支持，可绕过 SSL 证书限制，自定义 Cookie/UA 等参数。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qvoCyTM5aVLzhPQ5UvWCQ8qUiapwI0h92LhyALIIwEDTXPqCbOaGLgHWbUE6TNmDII1mOmjE40qzbbbGFJlJz5AiaibSicnxGDxhBZjTvOY3CicE/640?wx_fmt=png&from=appmsg "")  
  
  
**2**  
  
  
  
工具介绍  
  
主要特点：  
  
方便快捷：YYBaby-Spring_Scan采取一键梭哈模式，无需过多配置，输入目标地址一键检测，小白也能使用，降低门槛。  
  
  
Cookie自定义：能自定义Cookie，对于常规认证模式也能适用。图形化界面：提供友好的图形化操作界面，降低使用门槛，提高操作效率。  
  
  
跨平台支持：基于 Java 开发，支持 Windows、Linux、macOS 等多种操作系统。高效：默认3线程扫描，可自定义线程数，极大提高检测速度。  
  
  
功能丰富：内置命令执行、反弹VPS、内存马、内存分析等功能。  
  
  
应用场景：  
  
渗透测试:在授权的渗透测试项目中，用于检测Spring&SpringBoot框架漏洞。  
  
红蓝对抗:在红蓝对抗演练中，用于红队对Spring&SpringBoot框架漏洞攻击。  
  
  
安装步骤  
  
1. 确认 Java 环境：打开命令行，输入 java -version 确认 Java 已正确安装。  
  
2. 下载工具：从 GitHub 下载 YYBaby_v1.0_Spring_Scan.jar 文件到本地目录。  
  
3. 在命令行中执行：java -jar YYBaby_v1.0_Spring_Scan.jar2.4 配置说明Spring_Scan 支持以下配置选项：语言设置：支持中文界面代理设置：可配置 HTTP代理，用于特殊网络环境超时设置：可自定义连接超时时间和读取超时时间。  
  
  
工具下载链接见文末！  
  
  
  
  
  
  
往期好文推荐  
  
  
[武装你的浏览器-信息收集](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488461&idx=1&sn=330b3bacf6d1cbad8f3fa1f50d2cd159&scene=21#wechat_redirect)  
  
  
[XXE\SSRF\XSS全家桶实战案例](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488615&idx=1&sn=81ba367b5962295e50dbc2b335fd4d59&scene=21#wechat_redirect)  
  
  
["细狗",太细了,就该你出洞（干货案例）](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488336&idx=1&sn=4fc12ad7e24012b7ba2789f0113a0df1&scene=21#wechat_redirect)  
  
  
[SRC之实名绑定绕过实战！](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488420&idx=1&sn=4e7b4fcff88f7ce347f3bd6241c978f1&scene=21#wechat_redirect)  
  
  
[SRC通用案例，第三方接口调用缺陷](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488481&idx=1&sn=2dd2432375ca933ef9b1a39a7706d150&scene=21#wechat_redirect)  
  
  
[记一次对房东xxx的渗透实战，含技巧！](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488363&idx=1&sn=ad8a61a8593cd0c07271d1f7150f19ec&scene=21#wechat_redirect)  
  
  
[通过SSO认证绕过，艰难“拿证”实战](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488451&idx=1&sn=1e8f509e558f429a5a2e1bbe7ba6f777&scene=21#wechat_redirect)  
  
  
[JSHunter助你挖掘JS中的漏洞"宝矿"](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488322&idx=1&sn=776feed1b3a99b0c735cddbde1ace82e&scene=21#wechat_redirect)  
  
  
[分享1个发现隐藏资产的技巧，附实战](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488233&idx=1&sn=b9b47437e21fc89e0bccb43879dd62c9&scene=21#wechat_redirect)  
  
  
[更新-大佬的SRC思路，等你来GET](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488407&idx=1&sn=17a9d299d47f8d19735b28ce29995f9f&scene=21#wechat_redirect)  
  
  
[SRC必备的SSRF插件](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488266&idx=1&sn=34a7dd1fa98025f74cd200438b2c095a&scene=21#wechat_redirect)  
  
  
[记一次SRC渗透测试实战](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247487518&idx=1&sn=9d4498c7829a31051be9ba9813d367ec&scene=21#wechat_redirect)  
  
  
[从微信扫描登录到账号接管，细节实战](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247488142&idx=1&sn=874e5fcfabd9dda5cccb9506c0b25fb8&scene=21#wechat_redirect)  
  
  
[更新|帆软、用友、泛微、蓝凌等常见OA系统综合漏洞检测工具](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247487310&idx=1&sn=f27b0f1199b3f52b086d1c7dc18685d0&scene=21#wechat_redirect)  
  
  
[Web渗透测试综合工具](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247486715&idx=1&sn=1d507a1a89b525e5c1ad4d75d0d9eedc&scene=21#wechat_redirect)  
  
  
[Swagger漏洞检测工具](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247487229&idx=1&sn=07acbbae48db8862efe4bb8062056a96&scene=21#wechat_redirect)  
  
  
[Java漏洞专项检测工具](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247487205&idx=1&sn=e0d8353342f7d33fc3ce5bd5e747c861&scene=21#wechat_redirect)  
  
  
[有趣的Fuzz+BucketTool工具等于双高危！](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247486814&idx=1&sn=1d114995e1cf5745e824d2018cdbd615&scene=21#wechat_redirect)  
  
  
[推荐一款资产“自动化”筛选工具](https://mp.weixin.qq.com/s?__biz=MzkxMjg3NzU0Mg==&mid=2247486679&idx=1&sn=288fe9f4312c3267c33765cfa9e3ab06&scene=21#wechat_redirect)  
  
  
  
入交流群扫下方二维码：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qvoCyTM5aVJPZ5SwuG3vOJxaKLd9l42U3Wic1TTXEkV2ic5gaNywwRnrrVRnBJVrwH3SLOEoJq6oia64VUwgJ7P0F1MtwMIvr6RL1jXSMtjjYQ/640?wx_fmt=png&from=appmsg "")  
  
  
号外：进入下方小程序，获取其他资源。  
  
  
  
下载方式：关注公众号，回复“260410”获取下载链接。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/RLTNmn7FBP6LllD9Qm4I2eKvyHt1WlND18ovUTvvzp4MagwzrEIAu6ZHoicVWA2YvfmEgZicxv4tvVibeFB8T7w3A/640?wx_fmt=gif&from=appmsg "")  
  
  
