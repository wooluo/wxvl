#  SSRF漏洞点  
原创 信安路漫漫
                    信安路漫漫  信安路漫漫   2026-06-17 23:00  
  
前面写过一篇关于SSRF漏洞的利用方式，但是发现漏洞点位置的不同，其造成的危害和利用方式都有所区别，本篇文章就来看看漏洞点位置对利用方式的影响。  
  
SSRF（服务器端请求伪造）漏洞的核心在于攻击者通过控制服务端发起的请求目标，从而探测或攻击内网资源。根据漏洞点在 URL 中的不同位置，其影响和利用方式有显著差异。  
  
下面先来看看URL的标准格式。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/smrEGbtBXaXjnkQrwnImKCia643ZN8ejIs4pQOmkVXGcgmeJiaQvvn9bnSt5Ej4D1UNkI5Z3iaF0IkBL49GXqU6Ko2UGrVFslO27ZXpyulzib9o/640?wx_fmt=png&from=appmsg "")  
#   
  
  
# URL格式  
  
SSRF的漏洞在URL中的不同位置，可能利用方式也会不同。先来看一下URI的都有哪些位置  
```
其结构为：[ scheme :][ // authority][ path][ ? query][ # fragment]
```  
  
  
scheme与fragment部分是授权组成部分，可以基于服务，也可以基于注册表，常见的是基于服务，格式为：[ user-info @] host[ : port]  
  
![0](https://mmbiz.qpic.cn/mmbiz_png/smrEGbtBXaVn1WxjFRm19umudopjiaNM47WrT6sgx6vVNfWEkrsUFo1aSmqAjOqWww7Tr521szvw4mX1vdQlGD0TzrgFoG8hFvMwaSV4PLJQ/640?wx_fmt=png&from=appmsg "")  
  
![0](https://mmbiz.qpic.cn/mmbiz_png/smrEGbtBXaVtC34F1eqGmIAzpksGwZXKQLEAldz686lFiaTXZ7EYlVnuB3ibibyqFtPYbnmzZI6ftHFWHn76YPbvCW4d0NMTia5CMawq5jf7DRc/640?wx_fmt=png&from=appmsg "")  
  
1）scheme由一串大小写不敏感的字符组成，表示获取资源所需要的协议。  
  
2）authority中，userinfo遇到得比较少，这是一个可选项，一般HTTP使用匿名形式来获取数据，如果需要进行身份验证，  
格式为username：password，以＠结尾  
。这个常用于任意URL跳转漏洞  
  
3）host表示在哪个服务器上获取资源，一般所见的是以域名形式呈现的，如baidu.com，也有以IPv4、IPv6地址形式呈现的。  
  
4）port为服务器端口。各协议都有默认端口，如HTTP的为80、FTP的为21。使用默认端口时，可以将端口省略。  
  
5）path为指向资源的路径，一般使用“/”进行分层。  
  
6）query为查询字符串，用户将用户输入数据传递给服务端，以“？”作为表示。例如，向服务端传递用户名密码为“？username=admin&password=admin123”。  
  
7）fragment为片段ID，与query不同的是，其内容不会被传递到服务端，一般用于表示页面的锚点。  
  
根据 RFC 3986 标准，URL 的结构是严格分层的。  
- 认证信息区 (userinfo@)：必须位于 scheme:// 之后，且在第一个 / 或 ? 之前。  
  
- 查询参数区 (query)：位于 ? 之后。  
  
当 HTTP 客户端（如 Java 的 HttpClient、Python 的 requests、PHP 的 curl）解析一个完整的 URL 字符串时，一旦它遇到了 ?，它就认为前面的部分（Host 和 Path）已经解析完毕。此时，? 后面的所有内容都被视为键值对数据。  
# SSRF漏洞点在URL中不同的位置  
  
下面是SSRF中漏洞点常见的几个位置  
## 1）直接控制整个URL  
  
这是最危险、最直接的情况。当用户输入被完整拼接到请求地址中时，攻击者拥有最大的自由度。可以使用各种协议进行攻击尝试。  
  
影响：攻击者可以完全指定协议、主机、端口和路径，几乎不受任何限制。  
  
利用方式：  
  
内网探测与扫描：使用   
http://192.168.x.x  
 或   
http://10.x.x.x  
 等内网 IP 进行端口扫描或主机存活探测。  
  
读取本地文件：使用 file:///etc/passwd 或 file:///C:/Windows/win.ini 等协议读取服务器本地敏感文件。  
  
攻击内网服务：利用 gopher:// 或 dict:// 协议向 Redis、MySQL、FastCGI 等服务发送恶意命令，实现远程代码执行。  
  
访问云元数据：在云环境中，访问   
http://169.254.169.254/latest/meta-data/  
 获取实例的临时凭证，进而接管云服务器。  
##   
  
  
## 2）漏洞点在host中  
  
漏洞点在host中跟上面其实没有太大的区别也可以使用的方式进行利用。  
  
影响：攻击者可以将请求重定向到内网的任意主机，但通常受限于 HTTP 协议，无法直接使用 file:// 等非 HTTP 协议。  
  
如果后面没有路径可以使用@符号使用其它的协议，如果存在路径等信息，我这边使用@符号使用其它协议没有成功。  
  
如下面的后端代码  
  
host来源于外部输入  
```
String url= "https://" + host + "/api/test/" + "?timestamp=" + timestamp + "&api_key=" + apiKey; 
String result = HttpUtil.createGet(url).header("sign", sign).execute().body();
```  
  
如果不存在路径输入：  
  
evil.com@file:///etc/passwd  
  
存在路径使用其它协议我这边测试不成功，因为后面有路径干扰。  
  
evil.com@file:///etc/passwd#  
  
但是能控制host头使用http协议也能完成很多的试探性操作了。风险较高。  
  
## 3）漏洞点在path中  
  
当用户输入被拼接在 URL 的路径部分时，攻击者可以利用路径遍历或特殊字符来改变请求的目标。  
  
这里分为两种情况：  
  
第一种：完全控制path  
  
这种情况可以使用@符号来绕过  
```
String path = "https://" + "test.com" + path   + "?timestamp=" + timestamp + "&api_key=" + apiKey;
```  
  
如上面的代码，path完全控制  
  
可以输入  
@evil.com# 来进行漏洞利用。如果没有参数的话，可以换成其它协议进行利用  
  
  
第二种：只能控制部分path  
  
如下面的代码  
```
String path = "https://" + "test.com" + "/test/"+path   + "?timestamp=" + timestamp + "&api_key=" + apiKey;
```  
  
  
在这种情况下就不能直接使用@符号来注入其它的地址进行利用了。  
  
可以利用的方式如下：  
- 目录穿越：使用 /../ 或 %2e%2e%2f 等编码形式向上跳转目录，尝试访问上级目录中的敏感文件。  
  
- 参数污染：在路径后注入 ? 或 #，将后续的路径内容变为查询参数或锚点，从而改变实际请求的资源。  
  
这种情况目前我测试下来风险比较低，绕过很难。  
## 4）漏洞在参数中  
  
当用户输入被作为查询参数的一部分时，攻击者需要通过注入特殊字符来“逃逸”出参数的值域，从而影响整个 URL 的结构。  
  
影响：攻击者不能直接控制主机或路径，但可以通过注入 &、# 等字符来添加新参数、截断后续内容或改变认证信息。  
  
利用方式：  
  
参数注入：注入 &new_param=value 来添加新的查询参数，可能触发后端的其他逻辑。  
  
哈希符截断：注入 # 将后续的固定参数变为锚点，使其不被发送到服务器，从而绕过某些校验。  
  
CRLF 注入：在特定条件下，注入换行符 %0d%0a 可能篡改 HTTP 请求头，实现更复杂的攻击。  
  
但是在参数中，总体危害程度比较低。  
# 总结  
  
从上面可以看出，危害程度从高到底分别是完全控制，在host头，完全控制path，部分控制path，在参数中。在实际的修复中，我们通常会选择修复前三种，后面的两种危害比较低。  
各位大佬如果有什么好的利用姿势，欢迎来交流。  
  
  
