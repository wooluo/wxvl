#  dddd改版：更聪明的资产发现&漏洞扫描工具  
原创 油漆工
                    油漆工  C4安全   2026-05-25 03:18  
  
前言  
  
在企业安全建设越来越强调“持续发现、持续验证、持续修复”的今天，一款真正好用的安全扫描工具，往往不只是“能扫”，更要“扫得准、扩得开、用得顺”，dddd 正是这样一款面向安全研究与授权检测场景的工具  
  
它把资产发现、端口扫描、指纹识别、漏洞检测、子域名探测、搜索引擎资产拉取等能力整合到一起，尽量减少手工切换工具的成本  
  
改版  
  
dddd原版 的一个核心特点是需要将指纹和漏洞POC绑定，这一步是非常繁琐的  
  
在改版中我对指纹直接使用解析这一步拆分去匹配漏洞的POC tag  
  
比如说，指纹是  
  
```
springBlade,saber登录系统,Nginx
```  
  
  
它就会拆分为：  
springblade、saber、登录系统、saber登录系统、nginx  
这几个指纹tag，去所有的漏洞poc中匹配选中，然后再用选中的POC检测漏洞，避免全局POC扫描，提高效率  
  
  
dddd正工具不断更新和维护，内部社区师傅们提出修改意见，都会被考虑采纳！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CNX7nbl7mjHPyFAWmz1J6FN06biauuSMcepPnMvgsfnTOYF8k5Y8Qic8FAB0icJ1EX4OaUb9Er3Q4AoRkZ41Yl6Hxo8u01rEibqAVo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNUc31OU3pp6jY52lThYZSU8icjJyKj40zR10KobdlniadUMZSlrLrAmjlAJlvWcGn6HcibLias63DXic1CpCHNZX07nn70x7t7mxLM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COPYIJZvUkKYPxNicYA0DMskrUFqNk6me3CdhumstQrO1GYStbta8ygOfeUsWUI93j4gXBTwpeO3ibFfWBHHmPJSJN9H3pwdCjVY/640?wx_fmt=png&from=appmsg "")  
  
  
目前更新到1.7版本，可以支持拆分的指纹（不限）如下：  
```
畅捷通 T+Cloud
畅捷通 TPlus
用友-畅捷通OEM
用友畅捷通OEM
用友畅捷通
Yonyou-UFIDA
Yonyou-UFIDA-NC
用友-ERP-NC
用友-NC-Cloud
用友-GRP-U8
用友-时空KSOA
用友-ECLIENT
用友-U8
致远互联-OA
致远互联-M1 移动端
通达 OA
泛微 Ecology
泛微 EOffice
泛微 EMobile
泛微 云桥 e-Bridge
蓝凌 OA
蓝凌 EIS 智慧协同平台
万户 ezOFFICE
ezEIP
金和 OA
红帆 iOffice
飞企 FE 业务协作平台
用友 FE 协作办公平台
华天动力 OA
广联达 Linkworks 办公 OA
O2OA
全程云 OA
帆软 FineReport
致翔 OA

```  
  
  
同时我也兼容了优秀项目中的指纹：  
https://github.com/yyhuni/xingfinger/tree/main/fingerprints  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNeuMxWrctWBgtbPGHhPwr5iaRIhAH3fM5eIicB4VJEzlkmVk8vbO5WuSwOicPVHIJHzt0Gmxq7mrjAxto5UL2lmwJ0YmQ6dlJvRM/640?from=appmsg "")  
![]( "")  
  
目前支持检测的指纹数量已经达到了3万多个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9COMTNicpt3VdiaA3bj6uBYibOMOk1icPWbYpWohSF4iaWDWJcSIlESqFtRa1wqE42ibibo3aDNeXPyaCTRvAsob7BFoPlCqpicZGNMRXHM/640?wx_fmt=png&from=appmsg "")  
  
![]( "")  
  
无论你输入的是单个 IP、网段、IP 段、域名、URL，还是包含多目标的文本文件，它都能自动识别并进入对应流程  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9COc4lJdQnzHn9AjGh0OWjxj1laK0kdXM4BGx1swIZyTiadCsZvkibeuuqvWSiaTnicpsdWvO6yNWSCtiaOFlEkfm3Vlmja4icVBRN9ao/640?from=appmsg "")  
![]( "")  
  
漏洞检测方面，我将内置的nuclei引擎分离了出来，现在调用的是外部的nuclei可执行文件和nuclei模板  
  
避免nuclei引擎和nuclei漏洞模板更新导致最新的漏洞检测不到，如需更新nuclei文件直接替换即可  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CPD4YSTo9N2oibpsKibbJm9v9iagNhJ9ia9iaSxgNGkZM9H52BwlOlGY5IEYzlg4njQDwaHNOkw0MzicU1btEWoBnAEvKF38PZ2PianGs/640?from=appmsg "")  
![]( "")  
  
如需更新漏洞POC模板，直接放到config文件夹下面的poc文件夹里即可  
  
漏洞POC可以自行维护  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CNcnq1OdNica0DvibJtXWvKyne536nUt6Z7ZhGKz8ksln7oEibUdXE8RibzQdHuWCtJbLOMoXeicmACXASvUxBLm2suC0hWyqyBxSibg/640?from=appmsg "")  
![]( "")  
  
dddd改版在识别完指纹之后，就会调用关联的POC去检测漏洞  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COSTabn8ae3nQ4BRGP6L3mf4V9fN1b37iavnaQGZc48sicfh0DEqfDFrYULbmO1UlpUoY6AlEBxgHLXpRGwNMWticUxnI0EqxwQsU/640?from=appmsg "")  
![]( "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CMaU1yEbibQj5x3whMaUFdYuViaoylN79U0L1WXwZHvudCf8SWFpG4CCyjS0dkTwu0w39Q6H7Zu6KSw8Gug36ZmK6ClLb4vJwtZE/640?from=appmsg "")  
![]( "")  
  
漏洞结果会输出在html报告当中，而之前的指纹检测结果则会放在log.txt当中（追加内容，不会覆盖）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9COnFJlkbmtjjKBoK7ctAvo2FjpoQEYL2Twdd2bOicOeouBTvrJBvRSMUhyzXZBW9yPWOsOLapykYSI0ic7uJ7X7hu38vLFZ0WtwA/640?from=appmsg "")  
![]( "")  
  
可以来看下生成的报告，这次检测出的是jeecg-boot的SQL注入漏洞，报告中写明了请求和返回包  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNxdwfpx3JInbhHT8CMx1XweodFOicmbxKKSNictE4yFCASqictyUqcoHH8ovHXGx4ayr9ShcevvQne8uFpq68tmlfhG9t0FvY7pk/640?from=appmsg "")  
![]( "")  
  
另外还检测出了phpMyAdmin的安装目录文件，详细信息也类似  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COcbFWdN284pCTiaslW10U2x3pAUhrTZDeDlqFB7JuJ2ZBgjI0nANqo8koib380qXFXf6taagMyaYws3qqvGjeiaOK0eV8kXGBKbU/640?from=appmsg "")  
![]( "")  
  
当然，任何安全工具都应该建立在  
合法授权的前提下使用  
  
dddd改版更适合用于企业自有资产、授权测试环境和合规安全研究场景，帮助团队更快发现问题、验证风险、推动修复  
  
  
改版文件我已经分享在了内部知识大陆中，已加入的师傅们可以使用并提出优化的意见，目前工具还在不断的优化中~  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CMVsv0F8leKlPZML44DeFzWnqGO8D0bmbbib3MBA8ap8hQ1ZSfTf6Dibvg6CJEaR9f5Ys3dvyL96icygqEf0643tsicUkiabskOvrHA/640?wx_fmt=png&from=appmsg "")  
  
  
内部CTF课程上线，总课程30+小时，优惠折扣中！  
  
[](https://mp.weixin.qq.com/s?__biz=MzkzMzE5OTQzMA==&mid=2247490286&idx=1&sn=7f8f80578014db3187bc3be58c0df737&scene=21#wechat_redirect)  
  
  
帮会简介   
  
《  
安全渗透感知  
》是FreeBuf知识大陆的重量级帮会，帮会致力于漏洞POC/EXP、红队攻防实战，是系统化从基础入门到实战漏洞挖掘的教程社区，包含团队自整的挖掘注意点和案例，还包含分享的渗透经验、SRC漏洞案例、代码审计、挖洞思路等高价值资源。  
  
内容框架（持续新增中）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CMCpnOqvibQh9B467VSQoRtibrF3CdricQhVRJwEodF2GhiapIISMVWMgIYMdCcKDJlfwBqwm4zia4icyt2ZUQHYqVZvPhlV2QwFNpZU/640?from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=15 "")  
  
目前已有「670+」小伙伴加入了帮会  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9COia6Olejy4IjtKuic30T4T4ZvV7JvT4VEMibOvkhj53Yrn21celUDficvhrZJgfWzDAqTgUibyhFgjzYrodeSpUwNvWs3F5Vd5CFWA/640?wx_fmt=png&from=appmsg "")  
  
加入方式  
目前帮会成员  
670+  
人，  
永久会员优惠后只需  
69.9元  
。  
  
随着人数的增加及资源的积累，  
之后永久会员将  
涨价至99元  
。  
  
有意向的师傅们可以扫码加入我们，共同进步。  
  
  
如何加入帮会？→   
安卓/苹果用户  
可扫码使用优惠券↓↓  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CPRp7PTnyKnkjM5X3z8N8yLXv2Y9rS0j7uqFYgINPJNicaKNRJX9MuoaSTtwNOq2Bsn1PQv9jDACVlNYJicdeM83F8WibXKmW8wMw/640?wx_fmt=png&from=appmsg "")  
  
  
→ PC端用户可复制此链接到浏览器↓↓  
  
https://wiki.freebuf.com/societyDetail?society_id=184  
  
  
已加入帮会的小伙伴  
  
可以加帮主进帮会内部交流群  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/EXTCGqBpVJQtiakQ6okzRrdlfK4mC8pfvo5S48opk7Cd6OmuTgGysOdnia3vnbDBYeP4ahh3292l2rfZxY3ianYKg/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=21 "")  
  
请备注：帮会  
  
