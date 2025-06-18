#  基于OSI模型来挖洞的思想转变来找到那些被忽略的漏洞  
原创 Enomothem  Eonian Sharp   2025-06-18 04:41  
  
###   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/hvMQKkLOqzMwIWd8s9zobcZnnqUdZabGib4E1KO7L3Br2w1GI4jgc2WW9LMWtnic039qQxmvEy7bKWiceJWscjquQ/640?wx_fmt=jpeg "")  
### 背景  
  
在平时挖洞的思维中，似乎大家都习惯了或者偏向于Web漏洞，这就导致了忽略一些协议层面的漏洞。我对OSI略有研究，经常翻阅RFC文档，所以对TCP/IP的协议簇比较感兴趣。最近发布了一个工具是扫描端口的，大家都知道，端口是基于TCP扫描的，属于传输层，传输层上面的所有协议都需要通过传输层再以下三层路由交换电线传输到对端的传输层进行逻辑上的对等。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/hvMQKkLOqzNckpmkIOA2TDBzbeqnZISFGtgNPnqC2XnlsTq0OiayO2icJ6JHhZrfglBCWkuKvVL18OSicND8scw2Q/640?wx_fmt=jpeg "")  
  
有人问我，端口扫描，我明明给的是域名，为什么变成IP地址了？  
  
有人问我，为什么扫描的域名显示4xx，被拦截了？  
  
有人问我，为什么端口看到是开放状态，浏览器打不开？  
  
有人问我，工具明明扫描出漏洞，怎么没有路径访问呢？  
  
一些  
理解了网络基础原理的同学可能已经知道答案了，但是安全属于交叉学科，大多数人又处于  
半路学起的安全，我深知安全需要学的东西太多太多，所以可能初学者急于求成，先从最容易的web学起，这无疑把最基础的知识给忽略， 我在这里略讲一些，希望能给初学者一些启发。  
### TCP  
  
TCP还有  
一个好兄弟叫UDP，他们两个各有65535个端口，形成两个通道负责传输信息。应用层、会话  
层、表示层的数据通通打包，通过TCP运送到你要去往的对方。  
  
### HTTP  
  
  
  
而我们最熟悉的Web，其实就是HTTP协议，HTTP协议大家可以理解为访问网页。大家上网，不管是PC端，还是手机上APP购物，都是渲染的前端HTML、CSS，然后加上JS的动作，就可以进行交互了。再接着就是通过HTTP协议进行传输。HTTP RFC  
  
HTTP/0.9 (1991)  
  
初始版本，无正式RFC文档  
，仅作为简单协议使用（仅支持GET方法）。  
  
HTTP/1.0 正式开始编号为RFC 1945 (1996)  
  
标题：*Hypertext Transfer Protocol – HTTP/1.0*  
  
链接：https://datatracker.ietf.org/doc/html/rfc1945  
  
关键内容：正式定义HTTP/1.0，引入状态码、头部字段（如Content-Type）、多方法（GET/POST/HEAD）等。  
  
1997年，  
首次定义HTTP/1.1，后被RFC 2616取代。  
  
再到2015年的RFC7540，HTTP/2.0，目前最新的是2022年的RFC9114 HTTP/3.0  
  
大家是否在漏洞扫描器上经常看见TLS习惯的漏洞。其实就是使用了已经弃用的HTTP 1.0，因为支持弱加密算法DES，和弱哈希MD5，所以不被支持。  
  
但是不可否认，目前大部分仍然在使用这些比较老的版本。互联网上的应用要做到统一迭代谈何容易，一个服务可能十几年都不维护，但仍旧稳定运行在互联网上。这就是兼容性。  
  
  
为什么域名扫描的是IP？  
  
是否还记得，我们初学安全，信息收集里有一个最基本的操作，是的，找真实IP，各种绕，就是为了找到真实IP，我们看到的只不过是入口，假象，是CDN，是负载均衡。  
  
域名只是IP的一个对应关系，而且由域名系统DNS维护，既然有维护，那就会有变化，很可能下一秒，这个IP就和这个域名分道扬镳，又和另一个域名好上了，有可能是这个域名到期了，也有可能是这个服务器到期了，公网IP也被收回，但我们并不在意域名，因为域名只是为了让IP地址好记，IP才是原本面目。  
  
所以，域名从未拥有过端口，而是它解析的IP所拥有的，IP才是真正的宿主。  
  
  
为什么扫描的域名显示4xx，被拦截了？  
  
因为端口扫描的本质是解析成IP地址使用TCP Socks套接字进行访问，而不是使用HTTP的GET或者POST去请求，所以安全策略给防御了，域名最好再用HTTP类的工具去探测。  
  
  
这里推荐咱们开源的Pulse，非常的帅气  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hvMQKkLOqzNckpmkIOA2TDBzbeqnZISFDa6oxAM6wic56ql3dq5vEFEticibxHCep5ehn0ia9jFomeIEhOU79nYoOw/640?wx_fmt=png&from=appmsg "")  
  
http://eoniansharp.com:5000/about  
  
  
为什么端口看到是开放状态，浏览器打不开？  
  
如果你识别到端口是Open状态，放到浏览器却打不开，这种情况非常常见，之所以我们需要指纹识别的原因，就是为了先筛选出HTTP进行Web页面的渗透  
  
如果你是HTTP协议还打不开，那就有几种情况了  
  
1. 服务本身就没有提供任何页面，只是开了端口监听。  
  
2. 服务器挂了  
  
3. 需要指定的路径才能访问  
  
如果你都不是HTTP协议，那自然而然不能访问，你觉得你能在浏览器访问SSH协议？还是3306MYSQL？这些都需要特定的工具。  
  
  
工具明明扫描出漏洞，怎么没有路径访问呢？  
  
有人问，为什么工具识别到漏洞了，却访问不了，也没有给出访问的路径呢？  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hvMQKkLOqzNckpmkIOA2TDBzbeqnZISFyyicPpKO4nhcC5jEjsXkXQrR3JibH7l5GJCyoEfZibboyDXoQvvKtw5mQ/640?wx_fmt=png&from=appmsg "")  
  
  
我们知道，比如说springboot未授权需要去访问/actuator/env  
  
swagger未授权，比如/api/swagger-ui.html  
  
druid未授权访问 /druid/index.html  
  
Hadoop未授权访问默认的  
:8088/cluster  
  
等等等等  
  
  
但是，这些都是Web漏洞，HTTP协议  
  
2181 zookeeper ， 6379 redis 。。这些走TCP 的流量，你咋访问，浏览器渲染得了？  
  
这些就如同SSH、FTP一样，和HTTP是同应用层级，不同的协议！  
  
他们需要专门的工具  
  
例如HTTP协议，你需要打开浏览器访问  
  
FTP，你可以使用FTP命令，也可以使用工具  
  
SSH，Xshell工具等等  
  
所以，我们往往忽视的就是其他协议的漏洞，而偏向于寻找HTTP协议的web漏洞  
。  
  
  
拿到一批资产，很多师傅就直接指纹识别，过滤HTTP出来开始测试。其他协议都给忽略了，以为是访问不了的端口。  
  
  
另外，我们还需要注意的是，默认端口只是默认端口，不一定22就是ssh，不一定80就是http，80也可能是ssh，22也有可能是http，所以指纹识别的意义，就是发现端口背后的指纹，这样才能让我们更好的识别漏洞。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hvMQKkLOqzNckpmkIOA2TDBzbeqnZISF8XcSzySyBheMTbDszDb6OFP3fu2y6MdXfdraP0je8zcMylwcQfOSVQ/640?wx_fmt=png&from=appmsg "")  
  
工具详情  
  
http://eoniansharp.com:5000/docs/portscan  
  
