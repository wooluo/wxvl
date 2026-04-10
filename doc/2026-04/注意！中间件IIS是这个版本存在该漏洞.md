#  注意！中间件IIS是这个版本存在该漏洞  
原创 建哥聊安全
                    建哥聊安全  建哥聊安全   2026-04-10 00:44  
  
# 免责声明：严格禁止对任何未授权系统/网络进行扫描、攻击或入侵。禁止制作/传播恶意程序，禁止参与任何网络犯罪。如擅自将本文实验技术用于非法用途，一切法律后果及责任由行为人独立承担，与作者无关。  
# IIS6.0文件解析漏洞–特殊符号";"  
## 实验目的  
  
通过本实验，掌握  
windows下IIS6.0文件解析漏洞的利用方法。  
## 实验环境  
  
·  
操作机：  
Win10  
  
用户名：  
Administrator  
  
密码：  
Sangfor!7890  
  
·  
靶机：  
windows server 2003下的IIS6.0  
  
·  
实验地址：  
http://ip/upload/up.asp  
## 实验原理  
  
文件上传使用白名单做限制，只能上传图片文件，导致脚本文件无法上传，上传图片马绕过白名单文件上传的验证，但是图片马又无法解析，利用  
IIS6.0文件解析漏洞的特点，从而解析脚本文件。  
  
·  
IIS除了可以解析.asp后缀的脚本以外，还可以解析.cer和.asa后缀的文件  
  
·  
特殊符号“/”，任意文件夹名.asp目录下的任何文件都会被IIS当作asp脚本执行  
  
·  
特殊符号“;”，任意文件名.asp;.jpg，后缀是.jpg，可以绕过限制，但是IIS6.0的特殊符号“;”会将该文件当作asp脚本执行  
## 实验步骤  
  
1、登录操作机，打开浏览器，访问http://ip/upload/up.asp  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trEp53IdcZkOmPaeicMmXBM9qVefgBudYwH4SaObAcuZzqf9xbhY1zAAiafCs0GwcnnnBrI1FicjpPNUzV7icNZ6sLw9VryNZdlibicyI/640?wx_fmt=png&from=appmsg "")  
  
2、在操作机新建任意文件名的asp脚本，比如now.asp  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trEdBCX3wdeiaPufczE1rBzbU1mcBOIsY47TnvIOiciac5V0AqxLxJKx2Rz2kY9TdUiceWq4CUIw2QGdr3J1S03b9n09JIu1tbibagGg/640?wx_fmt=png&from=appmsg "")  
  
3、点击“浏览”按钮，选择新建的asp脚本文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trFkicPJKxHeoqYCyzYfFKEHOz8s37406bHYAmunvCM70ODhiavoHpMvicVibNUUd9Z5KfWPXvwrRNEvibnibL0sYyotjjsp8zD4HzjaM/640?wx_fmt=png&from=appmsg "")  
  
4、点击“上传”按钮，上传选择的文件，文件格式不正确，上传失败  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trFsPjYlx5nibkXwQYaZjatrDzL2K4OtLIREEUEicv0TwaGiaVsvlb1YWcBEm8YflDVqg2ueDzDtn14l3IOqltC8APIM2gCmPp1jtg/640?wx_fmt=png&from=appmsg "")  
  
5、点击“重新上传文件”，将新建的文件重命名为now.asp;.jpg，并选择该文件  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trHAl3RfKDJG3tB2080sgcUCumPtcIZw0lzerRoxN9qF6X94xgibz6LKA4c8yicHYA1pvGPOYUXNqic3UNZTNoZ08ojyTdGHsogB4k/640?wx_fmt=png&from=appmsg "")  
  
6、点击“上传”按钮，上传选择的文件，上传成功  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trGX9NU8zKTJdoC6uibggODThCYbIFzPCmdg0MNsniaOEcf09YL83GnlMooc8DbWM4HrN3bsTj0TzUvCbXrgGSibpVCiaPYFxicRpFAc/640?wx_fmt=png&from=appmsg "")  
  
7、访问http://ip/upload/image/now.asp;.jpg，脚本成功解析  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trHZRXJ2CNfU7NVPJOoyIZJGfIhCGautFOKV25rzqJeGOYb1je8SyfRz54ib6q6d3r273YZSMk0Uv5bWWr1ia0icOjBl1t3kzfvI2U/640?wx_fmt=png&from=appmsg "")  
## 实验总结  
  
掌握利用  
IIS6.0文件解析漏洞，绕过白名单限制，解析脚本文件。  
  
往期文章：  
  
[你的验证码就这样被破解了??？（前端篇）](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247489865&idx=1&sn=9da992818b7c6bc6fed7bf5ccee064ba&scene=21#wechat_redirect)  
  
  
[SQL注入&字符型get注入](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247489891&idx=1&sn=209335f4b9260724a83aaf6224d115f9&scene=21#wechat_redirect)  
  
  
[快检查下你服务器中间件，存不存在这个漏洞](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247485807&idx=1&sn=f797d83c0239ab1302d56f1b164aca02&scene=21#wechat_redirect)  
  
  
[远程命令执行&一句话木马](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247485711&idx=1&sn=964f88e30fef9b0a6715b2b8827ef3f6&scene=21#wechat_redirect)  
  
  
