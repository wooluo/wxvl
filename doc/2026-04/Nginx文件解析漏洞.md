#  Nginx文件解析漏洞  
原创 建哥聊安全
                    建哥聊安全  建哥聊安全   2026-04-13 02:34  
  
# 免责声明：严格禁止对任何未授权系统/网络进行扫描、攻击或入侵。禁止制作/传播恶意程序，禁止参与任何网络犯罪。如擅自将本文实验技术用于非法用途，一切法律后果及责任由行为人独立承担，与作者无关。  
# Nginx文件解析漏洞  
## 实验目的  
  
通过本实验，掌握  
Nginx文件解析漏洞的利用方法。  
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
Centos7.2下的Nginx  
  
·  
实验地址：  
http://ip  
## 实验原理  
  
文件上传使用白名单做限制，只能上传图片文件，导致脚本文件无法上传，上传图片马绕过白名单文件上传的验证，但是图片马又无法解析，利用  
Nginx文件解析漏洞的特点：任意文件名/任意文件名.php，从而解析脚本文件。  
## 实验步骤  
  
1、登录操作机，访问http://ip  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trGO8XQGYPe0dibpGxpWro2UQxpBFp5CzFibiaQbxo5S5fJYKaItkN4H3HINwXeVYCfnygp0JJEOYmib3riaf1k37jyX4Slia9FUOtM10/640?wx_fmt=png&from=appmsg "")  
  
2、上传任意的文件，上传失败，发现为白名单验证。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trEAWXkwlBsZCokZ0EViasruPib6uuZNJrIicalJg2ibbpzvI44MeJeCUZiaicTiatRy3MQ7DZvRB0la1u2Aia6QhsN8eabPC6zVHJRUwB4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trFFwYfeWIZdEvuM0I04licbyRNuXkkAMUviawzmmMwnGpy8qZzG1XXQpI4WH0cNwooTE8fGorx8RBzwy0jvibCn7gghibibkkusZ31Y/640?wx_fmt=png&from=appmsg "")  
  
3、使用windows的画图创建任意的png图片文件。  
  
4、使用Edit Plust编辑上一步中的png文件，在文件末尾加入代码  
  
<?php phpinfo();?>  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trEgibwDlpJAjso3ibqibH2Tj2mE2EF0WAlOeqY59WG96K67nFGekMNs52vqqicOpek7r9XWPCkiaSBEIWkXeVrEPia23xC1N6y6GJiac4/640?wx_fmt=png&from=appmsg "")  
  
5、将.png文件上传。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trFjqVtPVDnsgr5zTVusiauf76EvczHic9L5EOHRwORMXhIyibZMUSuq7UdRt3q5KB8U5HlUGTb7WLCbiaO4X5ia8vfcwMJCG7To8lv0/640?wx_fmt=png&from=appmsg "")  
  
6、上传成功，访问上传的.png文件，脚本没有解析。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/QJTLZsy5trFgZgIDmC7ib1q3XRqvxiaHEofBWdyoHWvWibaUnJvQIEfYpib80DmePcPAo5oUePzpLYCXiaGwNqfq5ibY4eusq9Zleztyp4VrqRI5g/640?wx_fmt=png&from=appmsg "")  
  
7、利用Nginx文件解析漏洞访问：  
  
http://ip/uploadfiles/4a47a0db6e60853dedfcfdf08a5ca249.png/.php，脚本文件成功解析  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/QJTLZsy5trFZ4kYzU53oqk3Hn8Tn4KcklkicvBVa1BluNMlWHicYROrGoUf5JX4VNKH6zOIlTHEn9vXxbquiaNXkibfsqYzLNlssqbX0v10tF1A/640?wx_fmt=png&from=appmsg "")  
  
## 实验总结  
  
掌握利用  
Nginx文件解析漏洞，绕过白名单限制，解析脚本文件。  
  
往期精选文章：  
  
[什么！！验证码就这样破解了？](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247485479&idx=1&sn=3b1c01122131017cdfa51e15db0a8ba5&scene=21#wechat_redirect)  
  
  
[这样改完，购物直接0元购？](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247485562&idx=1&sn=e1aec2b3ea7c4d3147582be02d9d6c6c&scene=21#wechat_redirect)  
  
  
[注意！中间件IIS是这个版本存在该漏洞](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247489903&idx=1&sn=57fb62c768e15e9fd9ea860952d8c3f8&scene=21#wechat_redirect)  
  
  
[电脑中了勒索病毒？试试这个方法。](https://mp.weixin.qq.com/s?__biz=MzYzOTAwMjY5NQ==&mid=2247485031&idx=1&sn=0fa7d9c9c423d6f3f48e830fbb2a3d4e&scene=21#wechat_redirect)  
  
  
