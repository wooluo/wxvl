#  漏洞挖掘中的host头碰撞  
原创 三呼呼
                        三呼呼  古月安全   2026-04-22 01:36  
  
随着网络资产梳理与边界防护的常态化，内部站点正从传统扫描中“隐形”。然而，在看似严密的访问限制背后，一种通过碰撞隐藏域名与服务器IP来“无中生有”的攻击手法——**Host碰撞**  
，为渗透测试者打开了一扇隐秘的后门。  
### 什么是HTTP协议中的Host  
  
Host是HTTP/1.1引入的一个请求头，用于指定请求的目标主机和端口号。在HTTP/1.0中，由于没有Host头，因此一个IP只能托管一个网站。在HTTP/1.1引入了Host头，服务器就可以根据不同的Host值将请求分发到不同的网站。从而允许在同一个IP和端口上托管多个网站（域名）。   
  
 比如：在浏览器访问http://test.com时，请求头中会自动添加Host: test.com。如下，我们常常使用bp抓包都会看到这样的信息：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7dibXE95vWTVeU4EEdbYGVFibYcEW4rGl1FHUSH0NfZXib3hQiadyc5dPtfNicCfWCXL2Nt3lj0rvOSo2sfQicDaIlWkQVmeicaia1jx8/640?wx_fmt=other&from=appmsg "")  
  
比如我们如果更改成一个不存在的host名，虽然请求还是发往localhost:8000，但是找不到host对应的域名地址了，所以服务器无法正确响应结果-这里没有做任何处理，无返回。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4V5gHNbPsWmzPgd76JVEcCN9j4D41Gibo9ZbmTuvmsNPG6quVWibrKX1eeMyA1rpt7SYR1mvgicmcbHZVFI2GaymiaEmqXBfxibAJM/640?wx_fmt=other&from=appmsg "")  
  
**这里的“Host”指代的是什么？**  
  
HOST碰撞漏洞的语境中，Host特指HTTP请求头中的Host字段，它告诉服务器用户想要访问哪个网站。注意，**它不是一个主机（服务器）实体，而是一个字符串标识。因为一个实体服务器，可以启动多个web（域名比如www.test.com），同时每一个web域名可以对应一个host。可以参考这2篇java内存马之-tomcat-valve-手把手投喂（一）和java内存马之-tomcat-valve-手把手投喂（二）**  
  
host它有3个层面含义：  
  
1.用户认知层面：一个域名，也是我们通常直观认为的：如www.test.com。   
  
2.协议层面：HTTP协议请求头中的Host字段。现代浏览器通常自动从URL中提取主机名并放入Host头。   
  
3.服务器层面：服务器配置中虚拟主机的标识符，用于匹配请求并返回相应域名的内容。  
#### 与其他请求头的区别  
<table><tbody><tr><th><p><span leaf="">请求头</span></p></th><th><p><span leaf="">作用</span></p></th><th><p><span leaf="">是否可伪造</span></p></th><th><p><span leaf="">在HOST碰撞中的作用</span></p></th></tr><tr><td><p><strong><span leaf="">Host</span></strong></p></td><td><p><span leaf="">指定请求的目标主机</span></p></td><td><p><span leaf="">是</span></p></td><td><p><strong><span leaf="">核心</span></strong><span leaf="">：服务器据此选择虚拟主机</span></p></td></tr><tr><td><p><strong><span leaf="">Referer</span></strong></p></td><td><p><span leaf="">指示请求来源页面</span></p></td><td><p><span leaf="">是</span></p></td><td><p><span leaf="">次要：可用于日志分析</span></p></td></tr><tr><td><p><strong><span leaf="">Origin</span></strong></p></td><td><p><span leaf="">指示跨域请求的源</span></p></td><td><p><span leaf="">是（有限制）</span></p></td><td><p><span leaf="">通常无关</span></p></td></tr><tr><td><p><strong><span leaf="">X-Forwarded-Host</span></strong></p></td><td><p><span leaf="">代理转发的原始Host</span></p></td><td><p><span leaf="">是</span></p></td><td><p><strong><span leaf="">备选</span></strong><span leaf="">：一些代理服务器会使用</span></p></td></tr></tbody></table>  
那么host在用户发起访问之后的作用是什么呢？  
  
在服务器的视角来看：当用户访问http://www.test.com，当请求到达服务器时，服务器看到的是：  
1. 目标IP地址（TCP层）  
  
1. Host头值（应用层）  
  
1. 其他请求信息  
  
**服务器优先根据Host头选择要响应的网站**  
，几乎不关心请求是发送到哪个IP地址的（除非特别配置）。  
  
**虚拟主机技术**  
  
虚拟主机技术允许在一台物理服务器上运行多个网站，共享同一个IP地址。服务器根据Host头来决定由哪个网站来处理请求。比如通过tomcat的配置信息来创建虚拟主机（网站）：  
```
<VirtualHost *:80>
    ServerName www.test.com
    DocumentRoot /www/test
</VirtualHost>
<VirtualHost *:80>
    ServerName admin.internal.test.com
    DocumentRoot /admin/www/admin
</VirtualHost>
# 默认虚拟主机
<VirtualHost *:80>
    ServerName default
    DocumentRoot /www/default
    # 或者拒绝访问
    Redirect 403 /
</VirtualHost>
```  
  
当配置了虚拟主机之后，服务器就存在了两个不同域名的web了，那么当用户发起请求时  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5tM7m48jwxjZRoo7oEH4IkdnJkr5bSpgenTUwAHx6AGia5tZMiaVFqdcJyI1ps2QPERlDSrPgxtFr5ic17bQOT5bdqyMQlh3beaQ/640?wx_fmt=other&from=appmsg "")  
  
那么这样做的好处是什么呢？  
1. **成本效益：减少服务器数量，降低硬件和维护成本**  
1. **资源共享：充分利用服务器性能**  
1. **管理便利：统一管理多个相关服务**  
然而，这种便利性也带来了安全风险，特别是在配置不当的情况下。  
## HOST碰撞的核心原理剖析  
  
**内外网域名分离场景**  
  
比如某公司只有一个对外的IP地址123.123.123.123 互联网固定IP地址。然而公司却有几个网站都需要发布，这时候就需要虚拟主机技术来实现了。比如：  
```
公网外部的DNS记录：
www.test.com    → 123.123.123.123 
api.test.com    → 123.123.123.123 
公司内部DNS配置：
admin.internal.test.com  → 123.123.123.123 
vpn.internal.test.com    → 123.123.123.123 
服务器配置（203.0.113.100）：
- 虚拟主机1: www.test.com（公网网站）
- 虚拟主机2: admin.internal.test.com（内部后台）
- 虚拟主机3: vpn.internal.test.com（VPN门户）
```  
  
当用户在互联网访问www.test.com 的时候，因为有正确的DNS解析，可以访问，实际就是123.123.123.123 这个具体的服务器地址。当访问admin.internal.test.com 这个网站的时候，却无法访问到，因为外部是没有DNS解析到这个域名的。相当于它是一个公司内部网站。  
#### 请求生命周期分解  
  
**正常访问流程**  
  
1.用户浏览器解析DNS：www.test.com    → 123.123.123.123  
  
2.发送请求 GET / HTTP/1.1   Host: www.company.com  
  
3.服务器123.123.123.123 接收请求  
  
4.匹配虚拟主机：找到server_name为www.test.com的配置  
  
5. 返回官网内容  
  
**HOST碰撞攻击流程**  
  
1.用户浏览器解析DNS：www.test.com    → 123.123.123.123 ，请求成功抵达123.123.123.123 服务器的tomcat容器或者Nginx容器。也可以直接通过IP进行访问，效果一样  
  
2.手动设置Host头：Host: admin.internal.test.com  
  
3.服务器203.0.113.100接收请求  
  
4.匹配虚拟主机：找到server_name为admin.internal.company.com的配置  
  
5.返回内部后台内容 ← 漏洞发生！  
  
**关键点：大多数Web服务器的匹配优先级都是先尝试精确匹配Host头，所以就导致了漏洞的产生。**  
#### host"碰撞"成功的关键因素  
1. **域名与IP的对应关系：域名确实解析到该IP**  
1. **服务器配置：该域名在服务器上有对应的虚拟主机配置**  
1. **无有效防护：服务器没有拒绝非法Host头的访问**  
那如何发现和利用host碰撞漏洞  
#### IP资产发现技术：比如传统扫描工具，比如namp，借助搜索引，子域名枚举等  
#### Burp Suite测试流程  
1. **配置代理和目标范围**  
1. **发送请求到Repeater**  
1. **修改Host头并发送：**  
1. **比较响应差异：**  
1. 长度差异  
  
1. 状态码差异  
  
1. 内容关键词差异  
  
1. **使用Intruder进行批量测试：**  
1. 攻击类型：Sniper  
  
1. 载荷位置：Host头  
  
1. 载荷来源：准备好的域名列表  
  
**漏洞危害**  
#### 未授权访问内部系统，敏感信息泄露，绕过WAF/防护设备  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7I78rGamiaxX8ftSDY0qqDXI1ZsjXVD5Oh2RdTVZ0Xia999PhDyicBQM0dbGO76X1aokiaofj4Wgcc6RF5Kkz4VpGRZtulNicef8C4/640?wx_fmt=other&from=appmsg "")  
### 间接风险与攻击链拓展  
#### 从HOST碰撞到内网漫游：比如通过未授权访问内部系统，碰撞出内部API网关，发现其他接口隐藏的资产.  
  
它的核心思想是：**一个IP服务器上可能托管了多个网站或应用，仅通过IP地址访问时，服务器不知道你要访问哪一个，因此需要用户请求中的****Host****头来指定。**  
  
**实操演示**  
  
**环境搭建**  
  
为了快速搭建环境，这里我们使用phpstudy 小皮系统，快速搭建网站。从其官网下载之后，下一步下一步安装就行了。  
  
启动之后是这样的：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7k2PXADvuY4HC5Q17E8plP1cuhrB9zZRwWlmzXsBJU4Q44Qto7SwNjicFPdc3tNINXmY6icRpwaAwEmCt3yVf4RaMIzkvG023D4/640?wx_fmt=other&from=appmsg "")  
  
我们需要做的是啥？是需要两个不同域名的网站，所以在网站菜单下新建一个站点：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5hM4kRBQjjXIQecpXx3WBicAo2jRpcS04KUjErvqR9CYtadwMM38DNhXPDjWMlH8n4iaMyK7Pnx4BzYdrPt1AMKBfJIBcTVlZqE/640?wx_fmt=other&from=appmsg "")  
  
然后第二个网站的hosts，不需要同步。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn55NO4EiaorHHPwwlBZEW7WhRIjsqo0swmglggNwcBZZ9yLvHEibREExnEGPa4auj0FP4fRjicZoJicG4aYPkelE2AVBb4KTvAwNvU/640?wx_fmt=other&from=appmsg "")  
  
然后启动apache：网站就部署好了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn45qYGAG5RbzTJDTL7OJzfJ4rmgFfz1HiaTCAHCcIgKMG7XY9wcDHHk1TvddF5TuBv2KK4EicPVhExzCQrD4zH6g0GibwkYiaQ0lHw/640?wx_fmt=other&from=appmsg "")  
  
点击这个同步hosts目的是什么呢？首先我们要了解如何通过域名找到对应的服务器的。域名访问的核心是**DNS解析**  
，将人类可读的域名转换为机器可读的IP地址。  
```
浏览器输入域名 → DNS解析 → 建立TCP连接 → HTTP请求 → 服务器响应
```  
  
如果没有这一步，那么我们输入一个自定义的域名，如果该域名在互联网上不存在，那么就无法解析，找不到对应的站点。比如上面的第二个网站：无法访问。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7u2dEq8p45hQTsQv3WicwkAaycsRFXyu9biawoSEC0MicxTwfWuWyS3OLRHUtxRiaG0uHDdNbzWLoOlX75Y9NxI7qbkSWBeHLNbZw/640?wx_fmt=other&from=appmsg "")  
  
而第一个同步了hosts的呢：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7QmpaViaBoWXzANGJFymS9NGiaBtGqfK4icvAQIurVicFnicbyBnHicMgex5iaibOHg74FibsTXTicXmq8J2YCtZVIZ8IKUvJ0c6enqHwl0/640?wx_fmt=other&from=appmsg "")  
  
为什么会这样，其实在同步hosts的时候，软件帮我们做了一件事情，那就是修改了我们系统的hosts文件内容：其修改了C:\Windows\System32\drivers\etc 目录下的hosts文件：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7GZSEZtL0vCmsjSrqZvSBHibrLlDJBV5vkgoLOF9HpThbuXjbOJbDDmbAXzPicWYib04icUpHdh7cwUacpNdiaC1I0VAleMdg2iaMQs/640?wx_fmt=other&from=appmsg "")  
  
在最后一行添加了一句话：127.0.0.1 www.mytesthost.com  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6l6mziaHj8G8edH3JxDn4wxMoCFabiaCbFZWDDianuZzFB2VfA9yucaL9qC4Jvg3IGI0LicQ7YWo3ZexicF0xBq9Enm6ppUCdZowAM/640?wx_fmt=other&from=appmsg "")  
  
让本地的127.0.0.1 解析www.mytesthost.com，那么当浏览器访问这个域名的时候，就会优先解析hosts文件中的IP，访问127.0.0.1，这样访问的就是我们自己部署的网站了，同时因为没有配置www.admin.mytesthost.com ，所以无法访问第二个网站。  
  
这样做的效果就等同于，第一个网站发布在公网，第二个网站未发布到公网，但是只对本机有效-- 模拟效果。  
## 完整的域名访问过程  
### 1.浏览器缓存检查  
- 浏览器首先检查自身缓存中是否有该域名的DNS解析结果  
  
- 如果有且未过期，直接使用缓存的IP地址  
  
- 缓存时间由DNS记录的TTL（Time To Live）值决定  
  
### 2.操作系统缓存检查  
- 如果浏览器缓存中没有，操作系统检查本地DNS缓存  
  
### 3.hosts文件查询（关键步骤）  
- 系统检查hosts  
文件中是否有对应的域名映射  
  
- 如果找到匹配记录，直接使用该IP地址，**不再进行后续DNS查询**  
  
### 4.DNS服务器查询（如hosts中无记录）  
  
a.**本地DNS服务器查询**  
  
向配置的DNS服务器（如8.8.8.8、114.114.114.114）发送查询请求  
  
b.**递归查询过程**  
：  
  
本地DNS服务器 → 根DNS服务器（.）               → 顶级域服务器（.com）               → 权威DNS服务器（example.com）               → 返回 www.example.com 的IP地址  
### 5.建立连接  
### 6.HTTP请求与响应  
  
所以上面的hosts步骤就是，让我们可以通过浏览器访问他们，并能返回正确的响应结果。  
### 解析优先级  
```
高优先级 ↓
1. 浏览器缓存（如有）
2. hosts文件      ← 修改hosts影响这里，只影响本机，不影响其他设备
3. 系统DNS缓存
4. DNS服务器查询
低优先级 ↑
```  
  
**漏洞演示**  
  
现在开始尝试host碰撞攻击的演示，使用火狐浏览器打开第一个站点，访问正常  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn72ddIvmSUCDH4N0SW2jjvh3MHLNRicDrb48gIAuQzNwDF6zN1A9TntG3fqF40dagjWImic8FpcibKOU8azPdWQD3J4YRFft2DcJ4/640?wx_fmt=other&from=appmsg "")  
  
第二个失败：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn70CNUObpRojqMiadKSMp3McvegYTiaib8OtuhNmney9Uh5HFDRLWneia9SNJFO6GyE9zr7qmlqDYgNlTnBBUNZEYa3lAG8ZWTic564/640?wx_fmt=other&from=appmsg "")  
  
现在使用bp抓包第一个网站的请求包：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4KIDsBAPPPEwp26icVhveQjwJDo7uYfDy3TD6eWtaaELB78CyEwjbF5IjwEibP4guXJoYY6gIDWIaIiaQDS97CqF6v4nsEf38T80/640?wx_fmt=other&from=appmsg "")  
  
那么我们在漏洞挖掘过程中，比如发现该IP地址上，可能存在其他的域名，但是又无法访问，就像现在这种情况，这时候就可以通过host碰撞的方式尝试了，可能有意外收获  
  
这时候将host的值，修改成第二个域名的值：www.admin.mytesthost.com  
  
比如这样：明显可以看到返回内容改变了，那么由此可知，已经通过host碰撞的方式，访问到了另外的服务器，已经成功绕过只能内网访问的这个限制了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4ZcLY2ichEn8OUstoGNUtHMWRMXe0ALLlzeYA9UNpS9W5VDopmpmUNjKOibFUZB6c4XPTLM2meVLmMlekFxFKaHHIN6FicND7y2Q/640?wx_fmt=other&from=appmsg "")  
  
接下来应该就是对目录的一些爆破了，比如可以通过爆破模块进行目录，文件爆破，从而访问内部网站的内容，当然也可以使用浏览器插件，更改host的值，这样就可以在浏览器上访问得到响应结果了。  
  
然后爆破目录，就可以得到了内部网站的内容了  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn44HZvUyibJCvV0wyZy27zg0YwhXpic3pUfwriaPiaWpDkKKueRH01V5fMZv6JjvQ8a9BiaBpibuncjIFyicMsicUfCh9udwIQYGZxLibew/640?wx_fmt=other&from=appmsg "")  
  
那么这里它访问的逻辑就是这样的：请求http://www.mytesthost.com/ 域名解析服务器IP地址，通过IP地址找到服务器，服务器解析host头，确认来源想要访问哪个host主机，http://www.admin.mytesthost.com/ 确认存在该host的主机，将请求发送给该网站，返回该内部站点的响应  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5GicxribVMxxQV7X1mKl4piblkMwtWsPFxs8sRl7C4JrfpRvBNhYSw7X7PPcLe2lC2NhPIDzMaeicI6QbbiaWz8WDMjZJnibibSTvicZE/640?wx_fmt=other&from=appmsg "")  
  
这就是为什么可以在同一台服务器、同一个IP地址上托管数百个不同域名的网站！  
  
当然也可以通过IP地址访问如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5a87FGVicFcoWyfBDFpESAFwtH4kb4CDt26eHG4VJlmjibbqJ2Lc1XB2zw4WRUCWq2ibnWxmdyVFnXzEBVq1l8u00hicq3YUICwes/640?wx_fmt=other&from=appmsg "")  
  
同时利用host头来控制具体需要访问的哪个网站，其效果是一样的，可能在某些情况下也是一种绕过的方式。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6JW4hH5omCDLKYibPGgytsUVBfFiadnlctXqOnDaDxP7ich6VgHMNF5xQk3kURTwLsJrwic06u9YdC8zLbtoricY1PzuSsHnjlBjPo/640?wx_fmt=other&from=appmsg "")  
  
**带来的安全风险**  
  
基于名称的虚拟主机配置可能会带来以下风险：  
  
**跨虚拟主机访问**  
  
虚拟主机配置不当导致的信息泄露，比如上面的例子，host头碰撞出内部站点，从而绕过限制，直接获取内部资源，比如一些引申的问题，通过目录穿越访问其他虚拟主机的目录文件等。  
  
**Host头注入攻击**  
  
密码重置中毒：攻击者修改Host头，使密码重置链接指向攻击者控制的域名，从而劫持用户的密码重置令牌。 缓存投毒：攻击者向缓存代理（如CDN）发送带有恶意Host头的请求，导致缓存服务器将恶意内容缓存，并分发给其他用户。 绕过安全限制：某些应用程序可能根据Host头来限制访问，攻击者通过伪造Host头绕过限制。  
  
比如：许多应用程序依赖Host头来生成链接、重定向或进行安全验证，篡改Host头可能导致应用程序生成的链接可控，比如找回密码：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7V5tIChFcKB22emp2QbHIjRwDvsGWFuPE1SrmTLsUkJpVarDIbWeDZS7aT0mNvGIRoaEaAyhA0glB7XxhVOMaKcqfXkQenzMU/640?wx_fmt=other&from=appmsg "")  
  
利用用户名或者手机号或者邮箱找回，输入正确的信息之后，就会像用户绑定的邮箱发送一封重置密码的邮件。  
  
如果服务器是利用host名加一段随机加密字符串生成密码重置的链接：比如：www.test.com/resetpassword/page=tokenaaaaaa，如果host头可控，那么就可以生成由攻击者控制的链接，比如伪造 host:www.attack.com，那么重置密码的链接就可能是这样的www.attack.com/resetpassword/page=tokenaaaaaa，这时候攻击者在重置密码界面，通过枚举或者爆破的方式，重置用户密码，那么用户的邮箱中将会收到这个重置的邮件，但是重置链接却是攻击者控制的(www.attack.com/resetpassword/page=tokenaaaaaa)，从而将用户引导至攻击者的网站。用户如果点击重置链接，那么攻击者将得到这个tokenaaaaaa，这样就可以再将正确的域名www.test.com替换回来，就可以重置该用户的密码了。主要利用方式是通过钓鱼邮件的方式向大量用户发送，只有用户点击即可接管账号。  
  
还有其他的比如Web缓存投毒攻击，利用Host头进行内部服务访问（SSRF）等攻击方式。  
  
**DNS重绑定攻击**  
  
DNS重绑定攻击是一种利用DNS解析机制的攻击。攻击者控制一个域名，将其DNS记录的TTL设置为很短，第一次解析返回一个合法的IP地址（例如攻击者的服务器），第二次解析返回目标服务器的内网IP地址。这样，攻击者可以绕过同源策略，通过浏览器访问到内网服务。**攻击核心**  
：利用浏览器同源策略只检查域名不检查IP的特点，结合DNS TTL过期重新解析，实现对内网的访问。  
  
**漏洞挖掘建议**  
  
**资产发现与Host碰撞**  
：这是当前最主要的应用。通过尝试将已知域名与大量IP进行“碰撞”，常能发现未公开的测试后台、管理界面等，为进一步测试打开突破口。  
  
**多路径测试**  
：测试时不要只改Host  
标头，也试试X-Forwarded-Host  
、X-Host  
等替代标头。  
  
**关注重定向与链接生成**  
：重点测试密码重置、邮件通知、OAuth授权回调、服务器端重定向等功能，这些是Host头被滥用的高发区。  
  
**组合利用提升危害**  
：单独一个可篡改的Host头可能只是低危，但如果能组合成有效的密码重置中毒、SSRF或缓存投毒，就能显著提升漏洞等级。  
  
**防御**  
1. **输入验证：严格验证Host头的合法性**  
1. **网络隔离：管理后台等敏感系统进行网络隔离**  
1. **多层防御：结合WAF、应用程序防护和系统层防护**  
