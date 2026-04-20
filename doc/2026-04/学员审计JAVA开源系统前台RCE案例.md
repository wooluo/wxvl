#  学员审计JAVA开源系统前台RCE案例  
原创 学员投稿
                    学员投稿  进击安全   2026-04-20 01:19  
  
# 免责申明本文章仅用于信息安全防御技术分享，因用于其他用途而产生不良后果,作者不承担任何法律责任，请严格遵循中华人民共和国相关法律法规，禁止做一切违法犯罪行为。  
  
一、前言  
  
      
学员审计出来一个RCE漏洞，并且进行公布了出来，原创文章如下：  
> 一次比赛坐牢造成的代码审计  
  
> 一寸灰，公众号：中二sec[一次比赛坐牢造成的代码审计](https://mp.weixin.qq.com/s/YiUlKZQkwlu5_OIunrqALA)  
  
  
  
感觉审计的不错，这里在经过同意之后，我们也来进行分析一下相关的漏洞，文末有源码。  
  
二、文件上传  
  
      
首先这里我们可以看到是一个SPring Boot的网站，并且是不解析JSP文件的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTjXViaj6F8t5mjMwY8eAJxOZUicVVibXdFTH9Op0aEpGVEicYpc7xkXZ9YJ2CtwbUfCCMYBZJYPf6pYcEUU8Bicdmia76gekXwk04mE/640?wx_fmt=png&from=appmsg "")  
  
我们定位到漏洞处。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRibW4XYsy095EHSpCmzYwB343tia1M3qRswLUDzZ9VhzQ8FPpot1NYwB75qZuibeMqAPeQr5AILkcet688x3icjt8hufJ9k2Y0CvU/640?wx_fmt=png&from=appmsg "")  
  
      
在这里进行文件上传，并且进行获取相关的文件名称，同时我们可以传入一个参数id，最终给到了相关的get方法，并且赋值给了driverEntity变量。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTtzwELP2XibmWhRpZXyG26u8zeJSMszuJb28SHmGJSY2pO0qicCr0PDc9StKvaVkrtSY50E4gx4iaklvA31JVVmxeJJCTCL9QQ7o/640?wx_fmt=png&from=appmsg "")  
  
      
可以看到  
如果driverEntity存在就直接上传到他的目录，如果不存在则直接创建一个id然后根据id创建一个目录然后上传这个jar。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTOV1icovAvwx9ZaibNsB5VaCskcMJPe3FS4Y4CKNIEDO8zJYkcw8AiaUR59ia7No1Ce0YNybR0c5N5HqoLR549xVpibicfQiaT6jA9yc/640?wx_fmt=png&from=appmsg "")  
  
这里是不存在相关的过滤的，但是因为也不解析JSP。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRQ5RxDo0M8n6zW2OzmRjkL1K9zFSLHZcXzGlPiaA43jdg8z47XWEDfKXmDvn9FKuLD70zicDiakCla9icL0ia06zfRTlXhIQichnrXA/640?wx_fmt=png&from=appmsg "")  
  
这里继续往下看，这里可以得到一个信息就是可以上传任意的文件，没有任何过滤，但是唯一的遗憾就是不进行解析jsp文件，所以这里我们还需要找一个加载的地方。  
  
三、类加载  
  
      
通过上面的分析，我们目前是可以进行任意的文件上传，同时在下面的代码当总发现了通过  
Class.forName，这个是可以进行加载静态代码块的，我们尝试去加载jar包。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTb41eibORQjLNTISugvUDRe92PMFILwAzmIWEcO2LtopH1TkicX68viavpWRjdOAoWLYnRLEOGvFVTuicfPmiayw55Rvm9AqBukdlM/640?wx_fmt=png&from=appmsg "")  
  
在这个方法当中进行使用类传参，entity类，查看我们可以传递哪些参数。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQMiat0cy7DkVBABvgBn2jznnXhYnraK91vUh1Wn3rD2PW5icZrKgHMTQMC8pmVbCgDZPSVIKj1XWd1ibooKG2j2tQq0iczre2bOJw/640?wx_fmt=png&from=appmsg "")  
  
可以看到我们可以传递的参数还挺多的，回到刚才的代码，进行分析。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQiclZuJJIKch0aVQXT21ENCianeHEMJSCZwOFszpOXh1XfgfN86BaFmjRs2lBicjtD5AGpMcnOicwhmMjlG1luhG2V2f9wgOXmg20/640?wx_fmt=png&from=appmsg "")  
  
最终我们的参数类传递给了方法getDtbsSourceConnection方法跟入进行查看。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSa4B9BZ2JuFPmfQUh5oaXxosTT04Rt5ibUy23A6ohXWOK383CkV0tQxtjvG4FXrLwaaibWH3M2RYrZgXB4WbhDwKibib8MGH7qXAs/640?wx_fmt=png&from=appmsg "")  
  
继续跟入。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQwT81b1coIM4oTFmFQOdcUZbfjNnx7nngTqutefJmuORbZegwypruo3x40E6faNIn8JtneNxfaVib3JpcZo4x9Mvpgz7GZWficU/640?wx_fmt=png&from=appmsg "")  
  
    可以看到这里进行获取到了相关的一些参数的value，最后进行获取到参数DriverEntity参数值之后进行给到了dirverEntity变量，并且传递给了getConnection方法，这里查看一下如何进行获取的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSfpzSqyHrbqehL4OJj5PR3tWOElDZZZSBFaPwc0ecZGJOBbicvcLavH47Yic6d3rZZOBYVQyFwrMDqcbj28P5S2sHIxiaFfWROTc/640?wx_fmt=png&from=appmsg "")  
  
可以看到并非可以直接传参的数据类型，而是类，继续跟入。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRpYYHdaedWz91QUGZKmT70cpATBtIavQicCtpDFhAfBkoJMl3tngQdLMrVg1H4aEcTg7E8rzPr04phaNGWxVic406J2UfCLyib9Y/640?wx_fmt=png&from=appmsg "")  
  
那么这些才是我们可以进行传递的参数名称，回到刚才步骤，继续跟入方法getConnection方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSdp2e6C0M1lOEw075ODGc8uyJZ2U5Y2T8ZvIlbZybZz3K9uDWLxK1Th3Q97F6UVZ0zAvyJlhBMc3v0gKDERqicXZIcSA2h11v8/640?wx_fmt=png&from=appmsg "")  
  
可以看到调用了方法getDriver方法，其中传递参数driverEntity就是我们传参当中的DriverEntity参数，继续跟入getDriver方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRQPPykCB0EFVzabTqTGfgk7wic9e8xzVlLs4CVwcOmPy6ZMJmWQKrNZiatM2OqMC7wq3nrMyiaEDSA8v4BaBiaGc8ib5f2eFDlfRWc/640?wx_fmt=png&from=appmsg "")  
  
在这里可以看到，进行获取当中的DriverClassName参数名。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRXJq89fSNTfMO1jK8s3mG8Pt331JbXXibXQ3J9ibgedNOE54COSP47E14rLBkK1p7mGBwCI7yWeicGa0LSfJv18ZicnEyVDUIIJqc/640?wx_fmt=png&from=appmsg "")  
  
直接将驱动名传进来，然后类加载。  
  
(其实分析到这里可以感觉到就是数据库连接的代码，这里其实也可以尝试进行直接打JDBC的反序列化，只不过上文用到的方式是直接上传了一个类加载的jar包然后通过连接数据库的代码进行加载了其中的代码）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTXB8zZspVNkiauusa5xULAR9pGjVfdmFNiaiaMKic7ZJyLvXkufElLwO9UUeaVpIMhvtWbchRWcAdan9jxTAoDuxpNbe48JI1AQCg/640?wx_fmt=png&from=appmsg "")  
  
尝试直接进行探一个计算器。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRKzG0QpPGHvB6umXBYdcUzToLDUoOouKlNhBbNkdota0cYeJia0QaniaTve71bvHWIt4P997ibV7jSBCYcLBxYM3mqnNDhicycvE8/640?wx_fmt=png&from=appmsg "")  
  
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
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ7oGah70z9X3eKrEjgyjX2iay84OYnZVqXicaEPBvvvhmmbicjP3MjXibMXfO13BVpQLtFI3rCLZ7AQjiaOEURR5e7miaqFtyH97yPI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQVYccPXoHuQibvicOoVcPbBaa3NQZ3rguvzJZ2V6icQZCnuXCC2O9sjlnI9lhF374rXepKThJhqWliaQ85kLElfsD8ibN7geeibEP2c/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
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
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQxpZWVhKq3nemuVmXgaWduhyZaPibYFEpYqruSfyDFfWmMkQwUicalMEmFdZicNbEb30Xw1UcL6UlrNIlYFuSRNK9506OXGibeicdw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSetF5XrqL6PXeDYtGwq8A0G5ibzhALYb5vzXAlfd2muAwIGaH4VkSYqPQHCfyfMRZj93u3RXhUBicVtObFBCJI1og56tjUMzpSI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=18 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQ65TEYFZXRauy3SbxXCz1ZV0JlWwr0F6DOc696beC4jsUA14jyILDibVJ0Uh2VIMTwpQhDahuZXQntnoSr59Vxls6UYd4LhUDo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTtXWkg6hw82sMbdAKNsPuRpl6QxpHOzhfvyMZEc3mQPzq9iccDibpjiaGax1ByQWJPLshGlAzZksCqECIDt7N6ZH2ibSD3JGXJIMM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTiaSnZnL8y12S22ujwSxTOzD3vV27CfDS95DXgLcJLOW4jI1IuyIQq2ZK9fVEKDsh56nNCtxfHicssicaFap9MowxIQeoeC2wsTM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRSAf2pCe4GLZtv8icHDsPLm9ogJz5gyXMlf9oiaUOGhcpxd5OiaXWicl9iar7Lb3W4ymbgNYRraw1USzxIIdBPicxF13fbG4J64GZ3I/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ9WMVQQkntrBXhxhtBQFAHPFfAcicoEia65AibAqt4bncbQQHvNRTqSKgCK2iabh9I6lWtTn0ZtgP3n9HY4wjH7N1WBJ78o8qhnFo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kS8x0IdGFwCYzwz00F54tUT7BjjuzYPaDZSulhXyL9g3wb8biaVmKHrHufvULVDVrHicvuHaEAW4go2PdkrWsVYWETzEQAuhmdmI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRia6phymC59NicVd9yVy6cabY32zpqhdqC7Kibhn1vCM7k7mVibTib5wuOmRxw6CmrUmKoHD6aQHv4bftsZkc50Lm0KiaPR8DJLiclYw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT7Sv2DxMvkyicSZKVZYXVt1jYicpgyrUh9zibzFTtDvQXUDlvX4DujZtXQ7DsLFHd0RPfmoWFGp7iaLJYtHrzyEhicvxxmKLRU5cEk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQVX5Mte4xFbBS5CN75xckHLn8RMZX5GS7libUgJIibDfcmQ38jib5ndG8oFQqFYokxx2IXQ9n2b3wRiclrOvicVXwajCHnLyWnpFSo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT6icFtEESeq3iadHmJZaEyaauIu3TfUDLrfnacKpdpwprzZkT8gcAPN3vwnp3ksxQEVTnHmm0BP01wkuY1c2X216VrvhmeH1Ppk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT13qDDamrBcXwqd9qKzqgsaV9fe3ibZIJXPdiab4Q8Z4RUUZibB3XcjYMD90QcQr5Fvmf1uyTB4uyxgiba6d5sDbkw3TbJK39NfJw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSu3sQaunoEYWyCVU6KtuicFssIczibpTnU2nOo2Ok6Z3Tf5w39GBqvgjKHQUeXW3eeT2YpxS3RoiacT1rlrwSM3EAic3nicp8ml990/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRFB2mwxdagZoYQVQdrHmEOmBVwIkfDE8lv3GedBdibPa8LQJZY0SRibphics1uMJqLRtxO4bNhcB97L9DCqpiaQsSBzpfxC3WVSbM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSD2AoqSBPa2vW4VKyUMs8BcyWEwVTUHLUdSavaaN6SXMrgYPCUdQ3GVLg0pZX1xOYcVNvEHsmD4NnEIn5PibWJYibhyKrHUlvP0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQn8TwseQuyyDibibngb9xwbJ5FA4PRVXj8dvhibxggmLaBZvrTeczPibziaVVNNhsc5qMyXYEfP4PR9TN7T65ULJslecPzRZ5pGj0k/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Dfrm5V3o6kT5DF7ABkocKDHKlOUROric2wcNtGFLsD5CmSEkGSwOlZExmkfmSRzd1mFuqOicY4c2ke02ErFLPIlJibibbiauQygxX5YtFXhLzFibY/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRkQgAZhib0X5PqgSFFFcWV8p9vuux0MblVFiaxeKtpzN0kQMRBg5ejNB5lqAxiaLRmY9XsCMbcicz2BZsH2hv4kz1MGJm2VaXel1E/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRYIb8bJbCT6WtBGsrwvIQabkroAY3EeC2Py6dwJiathyfxhyqDA1ib7dF9dc7ZqgUNCflh8bswbgAOVJX22elicHsrocjdZxpAe0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kRZPhaz0v7icMCEcKMBIc8PIoCul2bAv3lZhFiaJ7RwhlGqfxpuyKJWU9bk5VeMQ3M1AbkkfDeMoa6yZWR1lpiaLwNYVzTDHmibR4o/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTIMHbO9L0v8W86sIOfXvg6Ynp086oUIRtXfY63WicqUlQwEaQDsFjx9nsqoy8HiajlSXxrdNsF8I5zdyTMtBa65jdCsJPRyYscE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQ1eiaZhrM3zSyL5zDfwnbyR6JyjkoLwaVIt29JhDwsQ12ib8Jey8XvxNr3FIPucERagQ4fvXxKes0EMEyBzFqGIniby6C5ORHOhk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTMGmJaTiaVPCc6gKj2yGGmu2Lw9GJ3xscBzbsBa5OSOACibBs87DZ0QLFpxbVrIJOjpxVZypeGhOiavUvHoDPrVTlGLvic1KicayP4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS8S13iccbwiaEbF0OKZCJlco9dXFlF55Vt4Nr9KfwSEoj5r1076rSPPjbgnZaIibw7WdqmDlrxr9QSjRgMQibKVEXRJUPv6tRZlAo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS7l167SibgSRc56iaSe2hOics8h3gB8JI1WiaalaMz1oib1SQRrRicSs1xVcYuK51LJ0hKMxbdmsticiaGeCtzhX2sk4HBypPXsWxAROk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRic5VhF3icAlwSq9BOicbhFpd5YmHLUTQMFDibKIwgLU9U9RzvC9SzcX9JzeAYicwE62B89ibooD3rweOE8fKUMtlFcBEPF9257MpCg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT6c79uOW1hpnwlvBlXOicVOOGbs61UQfU2ibtIibbUEwXwg8nEicqNU7xLIG9wnoGvImiac4icPxkH12GgP6ITEt7YEL1LC8jP5AKtA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT6IVzB9TVkTHRXkzP6lR2b3K7Q15MtrAXYOsdjUmkTtHjWKza7hexxWGMQlUsicLgWSAXAqiaV6L4iaY81KPWAvUaDLMXQibojn9w/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTI0PNh3XbsHPEXhnBDJNsfOicWPVD0wErrPQvIJXS3GDKXqp5qtQ4lhlTibUZibgYniacAyAA0XwNWZ2szyYDsRTmYqGuyZ97aoNo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTdaXJGKYX3gz94a9FZ3eBdIcb56NvuzAJunzXzG9MhLUibn8eGHra5Y7vSjFMwAxNkaic4eCAmSmp58Y3eZ56Laiby8GWXA4Lr0U/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTy3QenZqpStn4N7aTc2odBvw4oOZmMX3gGUaicSjMQYJyXiae9XNw8eCxNCb5bicQXnsEvb3HpJywvL4uFrFObIQEtoY9vo2rg8I/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTLiaAwxGhzFiaajOEibP5LG9UibAfm3rQsPNrPjQFtBIsbdgDSQyrjLBQcxLsiaibjFWfHDMeQB8mRySNibIvdiaibjO0iaCsNYAtPKlicSA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ5PdNfEu9vW8KQ9GdYD3JWbvEHyezcEvEmOgpXfyRGbL0m6TTQxNXeWMJDfkPHtdRQDfxKBr0xV4FtOjGwmmJbqwzUDibfS30E/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSNOY6icnEhmNibAt02LUTC0jdRiaPGscM065OyCyicadibOGzVdnhnXribKcouHomEtWy3zicm7qMsUHWrEkznqtO7amFEeSgIr0CrMU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSVkxiatiabHqVEjIPmRDIDJfjC0nlyjLz8hQavlexhhdWK6UjM89tp6RoZNBibAuELLciccb9c0cicdagsbul6zsj2wBbY1Pj0wUrw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSm6t4rEjw0qGFQO7D4AGlkOIA4zVFFDcK6EkwicfQfh7WQchxZgYoKmiawGVxVYuzzGzLgqwASSuDnogOmZgJtISvsyRUibxoRDs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRkQgAZhib0X5PqgSFFFcWV8p9vuux0MblVFiaxeKtpzN0kQMRBg5ejNB5lqAxiaLRmY9XsCMbcicz2BZsH2hv4kz1MGJm2VaXel1E/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQn8TwseQuyyDibibngb9xwbJ5FA4PRVXj8dvhibxggmLaBZvrTeczPibziaVVNNhsc5qMyXYEfP4PR9TN7T65ULJslecPzRZ5pGj0k/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSD2AoqSBPa2vW4VKyUMs8BcyWEwVTUHLUdSavaaN6SXMrgYPCUdQ3GVLg0pZX1xOYcVNvEHsmD4NnEIn5PibWJYibhyKrHUlvP0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQVX5Mte4xFbBS5CN75xckHLn8RMZX5GS7libUgJIibDfcmQ38jib5ndG8oFQqFYokxx2IXQ9n2b3wRiclrOvicVXwajCHnLyWnpFSo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ9WMVQQkntrBXhxhtBQFAHPFfAcicoEia65AibAqt4bncbQQHvNRTqSKgCK2iabh9I6lWtTn0ZtgP3n9HY4wjH7N1WBJ78o8qhnFo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=85 "")  
  
  
  
  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQwANEqiadDcjrxZIdmYgIht1CDvA5d20OpwTP1GJ7h1bjWVxvm6X4Cf3IFlub69TQlwzGmPlGoibLmJ3SLlVuVGTS8HSxFuY0tQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=122 "")  
  
  
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
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT3bKGQx8ojptibrDh2TibNf5Sva4tR6g9VYiahpGY2xiaJXKQVKQT3SQYP1WYHmiaPc2RrpgXyK8DUNZ3E84NCfkozAp5ZJKSO61fw/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
（后台回复：8888领取相关代码）  
  
  
