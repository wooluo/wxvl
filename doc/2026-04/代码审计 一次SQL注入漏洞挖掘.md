#  代码审计 一次SQL注入漏洞挖掘  
原创 moonsec
                    moonsec  moonsec   2026-04-14 03:08  
  
```
免责声明：本公众号所提供的文字和信息仅供学习和研究使用，不得用于任何非法用途。
我们强烈谴责任何非法活动，并严格遵守法律法规。读者应该自觉遵守法律法规，不得利用本公众号所提供的信息从事任何违法活动。
本公众号不对读者的任何违法行为承担任何责任。
```  
  
一、简介  
  
最近分析了一套php的小众源码。发现了一个SQL注入漏洞 觉得有点意思。   
  
二、过程  
  
在index.php 存在函数 doStrslashes()函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRubzOcLZRWV0Bn1Upk8aHzfHA9gMvBMvAb9qju0kricPTF71aMN6FJu1EMmQv6u3SV6EyohCsMxkMyrHibOLO7cFwI0yKouAuVPc/640?wx_fmt=png&from=appmsg "")  
  
这个函数的作用是对全局输入的参数过滤 主要的作用是将特殊字符'转换成\'  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRv0ic53dtbTtQ1mWaujO9Kjiaibq4CS6ysWTe0Z3Ba4N5WxGFgrjK4HnEOt6em00a3pvQ3nRGH7wuKibktia38LaoA1qIadGXibzBwC0/640?wx_fmt=png&from=appmsg "")  
  
创建函数进行测试  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRsdYcFV6aYia8Y8gZaFQictGcungchg4gATickqysOX3dUGUFNRGkic51dQTdiagjC1gj6SYy4tqwCIl0kM0YwOBvKXIBNDsQibJo3TU/640?wx_fmt=png&from=appmsg "")  
  
对特殊字符过滤  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRsH6iall660rzgiaUcSTicGicwpXC40lzaHq98OFtetKBqic1NAGPomfrdDyd3ibNojlWh1f4Z7chDn1Ek3iaQRUhfRl3ibrQHzt8yyibAQ/640?wx_fmt=png&from=appmsg "")  
  
这套系统还有其他方式接受参数 input  
函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRszr5pAT14EuiaEG2OmR8MACaY5ZnPc5DhCPtvk8vVZUibdV6qAzGia24FhQRmS6ck9l4oBzUHIHUD2Ttdo7zjBKIZDyzmCY8DFy4/640?wx_fmt=png&from=appmsg "")  
  
跟进函数分析   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRv2AOfEWwtLUWBdShH9VEjIKlt9Lh0oTrtegjLCeX4QGb0sKNgNHnAGM7suKPcwWYBhUWQRlJNESHNb3dRMBUo0lquAkmoLKrA/640?wx_fmt=png&from=appmsg "")  
  
主要的作用是对传入的参数进行分类获取。这样依旧会进行过滤 因为一开始的时候 必须经过 doStrslashes函数再进入input函数。 传入的参数对进入where函数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRvZXfDnHe8bncbfvISRDs0hMI44hcJOaia7zeO1p99yzl2F0VRY2SMuKIf9UiabIO8RfppAq6sCbHjGYknyibdY4icUIsN3WFTJNAI/640?wx_fmt=png&from=appmsg "")  
  
跟进where函数 对token的值进行处理。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRvzTnnKZFIFg2JFibA85PiaUoAHeDrvuzGOjJGNhwG7dvmakGngaD7AFBC1DiaugxGiahztLT0d3QkQcNmkPB7ib3iatpjfvjUqeoibYk/640?wx_fmt=png&from=appmsg "")  
  
接着进入 escapeString  
函数 作用是对\'  
在进行一次过滤   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRu9Ho3Jkgo3fbNHyDbdiaHXluIaS1VBcAN91IGIHnibof7FuMAujjtiaaZ8O9oAyWdKOPWY3hZ7ccRkT8VibqVxBfa2LtOd3h0MyNE/640?wx_fmt=png&from=appmsg "")  
  
变成 $0 = '1\\\''  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRuTpZXVIwc5KCkgJSwaW0XFTI3kxsWmPTJB3WZws9kVSfaNZkQxoxIvgGdCwjEqibCrPk2etjQW0UxccJAsibRaqLcibowbxcCxTo/640?wx_fmt=png&from=appmsg "")  
  
经过处理最终 token = '1\\''  
变成这样  这种情况会造成SQL注入  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRsIBrb8bLAnEPY2cqGhIRV8YpFHsgAiaVj4hRScuDFmq5LPiaj2mHav2055am5jI34FEMG700mxrJicVX2Gwr68Wq9iak0869liasmo/640?wx_fmt=png&from=appmsg "")  
  
进入 find函数   
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRtDalteuystqic87zGMEvicx3nW29uEWdWhLZw9wBWfJJxtAialGr6ftKySUUBFnP6sooib1AGJnaugEAvZemHF4sAdhxKE163Ziads/640?wx_fmt=png&from=appmsg "")  
  
根据 buildWhere  
函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRvDOxKDp5CADaV1ibsYic6QGKwf0zVP8A8xFVjvq5ap3TM25lJ8PicDtGw8DY7mvmmZXibnibiaDIUGr2x6Xp0q8cUsuLwnjGfpXwZDc/640?wx_fmt=png&from=appmsg "")  
  
最后到达execute  
函数执行 调用query执行sql语句  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRsycRoIia4p4qE983XJ6xqQdeOnwct6Xa4J5RcrKLP6dCHYlTulWaM4nFhvmTV3qupD5oAvhgXCJnpN3Huw3JlAn3m1CjYjfufc/640?wx_fmt=png&from=appmsg "")  
  
报错进入 error  
函数 把报错的内容显示出来。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRtlhkCCQibFTVsSNqic329Zskm4F1oPj2vhgqDWVdAt9k0JW68JrNJ0cxo6sqmU7e1k0sYqK9Va7oNVUbw01ytBrCicYSRGSHRtOw/640?wx_fmt=png&from=appmsg "")  
  
漏洞证明  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRthsVic06ereFHh503PbNtpUQZ54Y3zLibA2IWqlOPs3HjGAACMIb0c7HKftwV53j2OmvZHPAZ7vnKxoKqhxDIpXPsCf1VnTgwsg/640?wx_fmt=png&from=appmsg "")  
  
三.安全培训  
  
如果你想系统掌握网络安全实战技能，从入门到进阶完成一次能力跃迁，我们提供了高质量的培训课程，内容涵盖 Web 安全、内网渗透、红队对抗、代码审计等方向。课程由实战经验丰富的讲师教学，适合零基础或有一定基础的学员。有兴趣了解课程详情，扫一扫 添加月师傅微信  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/0ic45F94NibRstSpqxyWRV0vYcaSd9WwhqdRIFdhC47qiapp5pt8h0mbZwpfxP0VrDB2UxzMUlSJUkoGSyNWHpWTGxRxYKVEHRUxZrS08KDrYI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
