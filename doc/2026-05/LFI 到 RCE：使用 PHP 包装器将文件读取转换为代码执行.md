#  LFI 到 RCE：使用 PHP 包装器将文件读取转换为代码执行  
haidragon
                    haidragon  安全狗的自我修养   2026-05-07 06:54  
  
# 官网：http://securitytech.cc  
  
## 利用 data://、php://input 和 expect://，从一个简单的文件包含错误演变成一个 shell 攻击。  
> **注意**：这是我的文件包含漏洞系列文章的第二部分。如果您还没有阅读第一部分，我介绍了本地文件包含漏洞 (LFI)、目录遍历、过滤器绕过以及使用php://filter包装器读取 PHP 源代码——建议您在深入阅读本文之前先阅读第一部分，因为我们将在此基础上进行讲解。  
  
  
到目前为止，我们所做的一切都只是读取文件——系统文件、配置文件、PHP 源代码。这固然有用，但我们不会止步于此。下一步是在服务器上实际执行代码。  
  
有几种方法可以做到这一点。一种枯燥但有效的方法是翻阅你已经有权访问的文件——配置文件通常包含数据库密码，而人们往往会重复使用密码。检查一下config.php，找到一个凭据，然后尝试用它通过 SSH 登录。或者直接查看/home/username/.ssh/——如果权限设置得比较松散，你或许可以直接获取私钥并成功登录。  
  
但本节并非着重讨论这个。我们将使用 PHP 封装器，通过本地文件包含漏洞直接执行远程代码——无需任何凭据。  
  
为此，我正在 HackTheBox 上的一个机器上进行测试。这里存在漏洞的参数是 `<language_file>` language，它通常接收一个语言文件（例如 `<language_file>`）es.php来切换页面语言。这就是我们的注入点。  
  
  
按回车键或点击查看完整尺寸的图片  
  
  
  
## 一个条件  
  
在一切正常运行之前，必须确保一件事：allow_url_include必须在 PHP 配置中启用该选项。默认情况下它是关闭的，但这种情况比您想象的要普遍得多——许多插件和 Web 应用程序都会启用它才能正常工作。  
  
我们可以像之前阅读源代码一样检查它——使用php://filter包装器提取 PHP 配置文件并对其进行 base64 编码：  
```
```  
  
解码输出结果并用 grep 命令查找该设置：  
```
```  
  
如果你能回来：  
```
```  
  
一切就绪。  
  
## 数据//包装器  
  
这个data://封装器允许你将数据直接注入到包含文件中——包括 PHP 代码。思路很简单：编写一个 Web shell，对其进行 Base64 编码，然后将其传递给封装器。服务器会对其进行解码并执行。  
  
  
首先，对 shell 进行编码：  
```
```  
  
然后将其传递给包装器，并在末尾加上你的命令：  
```
```  
  
或者使用 curl：  
```
```  
  
  
按回车键或点击查看完整尺寸的图片  
  
  
  
服务器以管理员身份运行了我们的命令www-data。我们成功登录。  
  
## php://input 包装器  
  
这种方法原理相同，区别在于不是将 PHP 代码嵌入 URL，而是将其放在 POST 请求的正文中发送。allow_url_include要求也相同。  
```
```  
  
shell 脚本放在 POST 请求体中，命令作为 GET 参数放在 URL 中。需要注意的是，如果存在漏洞的函数只接受 POST 请求而不接受 GET 请求，则无法将其cmd作为 URL 参数传递。在这种情况下，请直接在 PHP 代码中硬编码命令：  
```
```  
  
  
按回车键或点击查看完整尺寸的图片  
  
  
## 预期//包装器  
  
这是三者中最简单直接的——它就是专门用来运行命令的。无需 shell，只需直接传递命令即可：  
```
```  
  
需要注意的是，这expect是一个外部扩展，并非 PHP 默认自带的。它必须手动安装到服务器上。您可以像以前一样检查它是否已安装：  
```
```  
  
在配置文件中找到它固然令人鼓舞，但这并不能保证它在运行时实际加载。唯一的真正验证方法就是实际测试。在本例中，它在目标设备上不可用，这很常见——虽然这种情况比较少见，但每当遇到本地文件包含漏洞时都值得检查一下。  
  
## 快速比较  
  
这三个封装器都有一个共同的入口要求——allow_url_include必须启用。区别在于有效载荷的传递方式：  
- data://所有信息都包含在URL中，并进行Base64编码。  
- php://input— shell 放在 POST 请求体中，命令放在 URL 中。  
- expect://— 无需 shell，命令直接放在 URL 中（罕见）  
在下一部分中，我们将完全跳出服务器的框架——我们不再通过 URL 注入代码，而是研究远程文件包含，即在我们的机器上托管我们自己的恶意脚本，并让易受攻击的服务器远程获取并执行它。  
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnvgxQ2jO3dsx1xB3CibU9nobxZqZ72Cbu3usZSZqD6nppib37oPCn8P9dTAGO0wPiccoibGnn1F2lc9zM8RenFkXIia7mjbEXuLAHII/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnvZ9ppFfFQkVAy1ANlGRJCIBbvVLOia8WyNRviacUXHNb6Meuiaa7feQUnEr8rcEdjUBxxFZnCP4aVxNjlqb1ZvXR9g5yIzvkA3to/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPZeRlpCaIfwnM0IM4vnVugkAyDFJlhe1Rkalbz0a282U9iaVU12iaEiahw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=z84f6pb5&tp=webp#imgIndex=5 "")  
  
  
  
  
****  
  
- 公众号:安全狗的自我修养  
  
- vx:2207344074  
  
- http://  
gitee.com/haidragon  
  
- http://  
github.com/haidragon  
  
- bilibili:haidragonx  
  
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPMJPjIWnCTP3EjrhOXhJsryIkR34mCwqetPF7aRmbhnxBbiaicS0rwu6w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=omk5zkfc&tp=webp#imgIndex=5 "")  
  
