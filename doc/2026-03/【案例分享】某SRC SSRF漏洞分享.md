#  【案例分享】某SRC SSRF漏洞分享  
 C4安全   2026-03-20 01:06  
  
# 【案例分享】某SRC SSRF漏洞分享  
>   
> 开学啦，该卷起来啦，祝各位师傅新的一年猛猛出洞，马力全开！！！  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/7AnuFAq7GcOadBERR2cvkxpiacBKMEJpfKOcjsrWlrpsHMp6ZQ76LibujnIkpjx4kIuPYBfu97Sk4Z3pJJ9bbQpS3pZzc3RVcY4Fdov5E2Vjs/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/7AnuFAq7GcMib9aX1a0W668SYHgIGXSvKpJq2olxX39TF4VYYqp37K7DWic9cibwFxibqUUmRtibKUJvLEHxNzd7aLWWicMKrAV0kWwah9ibxm4Ujs/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/7AnuFAq7GcO99yXqhAncIlYEiby6amdrUK2Goy0ZGPibVRmfwqVaS9kVC2t0icoAGhNwHAz7KVp6JzLFhexlUqCsNpRSX4DwmicveqlxokWW63I/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/7AnuFAq7GcOYe2DkuEpvAonhzRuLYVOz1EiczMEoWjLR1jBO5e0vrqApLml7vMXmjjr3Jcf70cEgS9h9TM4ouzyAx3SibgZQ4BicPGCCAJd74Q/640?wx_fmt=jpeg&from=appmsg "")  
  
一次简单的SSRF漏洞挖掘实战，带你了解漏洞原理与利用方式。今天带大家实战分析一个刚发现的SSRF漏洞案例——来自某AI平台的**服务端请求伪造漏洞**  
。  
## 1. 什么是SSRF？  
  
**SSRF（Server-Side Request Forgery，服务端请求伪造）**  
 是一种由攻击者构造请求，由服务端发起请求的安全漏洞。攻击者可以利用它让服务器向内部网络发起请求，从而探测内网信息、攻击内网服务，甚至远程代码执行。  
  
简单来说：**本来服务器只应该访问外部你指定的网站，结果它被你忽悠去访问了内网地址（比如 10.10.10.1），这就是SSRF。**  
## 2. 发现过程：从“机构应用创建”入手  
  
漏洞存在于某AI平台（example.com  
）。当时我注册登录后，创建一个“机构应用”，在填写官网链接的地方，尝试输入内网IP进行测试。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/7AnuFAq7GcOoOh7zrFKNPZkuXR9oVLOh4Lh7WfJ3ib7bKQmFv21EWyLCKzibYr803UM974FtjiaFLRskiaKvsHib6QvjkTFqZrlQgFLs3ypRhjUI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/7AnuFAq7GcNibDkbnasMdfYDKN635b3uYJqFejzoYYGP9JdRkftvhvl3dhVqlrjhj1Bpia0eAz9wZaSflfdIT06vpsaayEhKhmFppBNaDNtmw/640?wx_fmt=png&from=appmsg "")  
### 2.1 抓包拦截请求  
  
在输入框随便填个真实的URL（比如 http://example.com  
），测试功能，再填写内网地址进行SSRF内网探测测试。  
  
重点是请求体中包含一个参数 websiteList，它传递了我们输入的网址。于是我把 URL 改成了内网地址 http://10.x.x.x/42xx7(厂商提供的内网地址) 重放请求。  
  
小贴士：10.x.x.x 是内网IP（A类私有地址），正常情况下公网无法访问，但如果服务器端去请求它，就有可能探测到内网服务。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/7AnuFAq7GcM272pCX4qmIMIicy38pd3jsOJqUJy4mv5juGvzORzC5MpgoAm2cJpSPqicE10bdKice1WM3B1PeBNH7IdKZPxu9PVLCImojGWNdg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/7AnuFAq7GcMqr6yHASIGo5IWaTibzZicwRM1MEE7AtavpV7KiblmuS5SO6WohMjG3hZFRx0JbA6ibCDTHXU7O4GhbZ8ovVK8dBAZa9yictgtsqqY/640?wx_fmt=png&from=appmsg "")  
  
**重放请求后，观察返回内容：**  
  
当内网IP存在且端口开放时（比如内网有一台机器开了Web服务），返回 HTTP 200，并可能带回页面内容（截图略）。  
  
当内网IP不存在或端口关闭时，返回类似“页面失效，请更换”的提示。  
### 挖洞心得：给大学生的实战建议  
1. **关注功能点**  
：凡是用户能输入URL的地方（如头像上传、网站爬虫、在线截图、API代理），都可能存在SSRF。  
  
1. **巧用差异判断**  
：像本例中，通过内外网返回的不同提示，就能确认漏洞存在。多关注响应中的状态码、错误信息、响应时间等细节。  
  
1. **学会抓包改包**  
：Burp Suite是必备工具，一定要熟练使用Repeater和Intruder。  
  
1. **合法合规测试**  
：挖洞要选有SRC（安全响应中心）的厂商，在授权范围内测试，切勿越界。  
  
### ⚠️ 重要技术声明  
  
本文所有内容均为**网络安全技术研究**  
，仅用于学习移动端逆向、SSL证书校验、网络抓包分析等技术知识，**严禁**  
将本文的方法和思路用于违法行为。  
  
关注公众号，后续会有**网安求职**  
、**工具推荐**  
、**案例分享**  
等内容持续输出，师傅们都可以关注一下喔！  
  
  
