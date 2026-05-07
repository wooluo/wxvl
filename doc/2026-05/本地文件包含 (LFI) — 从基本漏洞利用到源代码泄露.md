#  本地文件包含 (LFI) — 从基本漏洞利用到源代码泄露  
haidragon
                    haidragon  安全狗的自我修养   2026-05-07 06:54  
  
# 官网：http://securitytech.cc  
## 本文将通过实际操作演示如何使用 DVWA 进行目录遍历、绕过过滤器以及使用流包装器提取 PHP 源代码。这是文件包含系列教程的第一部分。  
## 介绍  
  
许多 Web 应用程序允许你使用 URL 参数动态加载页面——例如，?page=about通过参数来决定显示哪些内容。这是一种非常常见的模式，可以保持代码简洁，避免在代码库中重复编写代码。  
  
在 PHP 中，典型的实现方式如下所示：  
```
```  
  
很简单，对吧？问题是，如果没人检查实际传递的内容，你就等于把服务器的密钥拱手让给了攻击者。about.php他们不仅可以获取文件，还可以请求系统上的几乎任何文件——包括诸如/etc/passwd.  
  
这就是本地文件包含（LFI）。它比听起来更危险。根据配置的不同，它可能导致以下后果：  
- 敏感系统文件  
- 应用程序源代码  
- 数据库凭据  
- 在某些情况下，实际代码执行  
这不仅仅是 PHP 的问题——Node.js、Java、.NET，如果有人决定在没有事先验证的情况下信任用户输入，它们都可能出现同样的问题。  
  
## 漏洞代码分析  
  
在DVWA中，这个漏洞非常明显。该应用程序page直接从URL读取参数：  
  
  
  
  
  
然后直接将其输入，include()不做任何检查：  
  
  
  
  
  
没有验证，没有清理，什么都没有。正常使用情况下，应用会按预期加载页面：  
  
  
  
  
  
但当你意识到没有任何东西能阻止你改变这个参数时，事情就会迅速变得有趣起来。  
  
## 利用它——目录遍历  
  
诀窍在于使用 `/etc/application/z/`../来向上遍历目录树。如果应用程序位于类似 `/etc/application/z/` 的目录中/var/www/html/pages/，那么`/etc ..//application/z/` 会带你向上移动一级到 `/ /var/www/html/etc/application/z/`。将足够多的 `/etc/application/z/` 目录堆叠起来，你就能到达文件系统的根目录。  
  
所以，你不用输入页面名称，而是输入：  
```
```  
  
而且该应用程序会欣然接受它。整个/etc/passwd文件都会直接放入响应中：  
  
  
按回车键或点击查看完整尺寸的图片  
  
  
  
经典的低保真音响。  
  
## 绕过输入过滤（中等安全级别）  
  
在这个层面上，有人发现了这个问题并添加了一个过滤器。现在，代码会../在处理输入之前先将其过滤掉：  
  
  
  
  
  
乍一看似乎合情合理。阻止遍历序列，就能阻止攻击。但实际上却行不通。  
  
## 为什么过滤器会失效  
  
该过滤器使用str_replace()单次遍历输入数据的方法。它找到匹配项../，将其移除，然后继续处理下一个匹配项——它不会返回检查移除某个匹配项是否产生了新的匹配项。  
  
  
所以，绕过方法如下：  
```
```  
  
想想过滤器运行时会发生什么。它检测../到里面有杂质....//并将其清除。剩下的是什么？  
```
```  
  
过滤器实际上把自己清理进了有效载荷中。结果相同，路径不同：  
  
  
  
  
  
## URL编码绕过  
  
另一种方法是编码。如果应用程序在过滤器运行之前解码 URL，则可以用百分比编码编写遍历语句：  
```
```  
  
过滤器看不到原始数据../——它只能看到编码后的版本——所以数据直接通过了。服务器解码后，像什么都没发生一样处理遍历过程。  
  
## 教训  
  
黑名单很脆弱。你可以整天封禁特定字符串，但攻击者总能找到你意想不到的变体。正确的做法是验证输入格式是否正确，而不是试图阻止所有可能出错的情况。  
  
## 使用过滤器读取 PHP 源代码  
  
目前来看，这种方法对于纯文本文件效果很好。但是，如果尝试包含一个 PHP 文件会发生什么呢？  
```
```  
  
你无法获取源代码，只能获得渲染后的 HTML 输出——因为服务器include()不仅读取文件，还会执行它们。服务器运行 PHP 代码并返回其生成的内容。从攻击者的角度来看，这几乎毫无用处。我们对渲染后的页面不感兴趣——我们想要的是代码本身隐藏的逻辑、凭据等等。  
  
## PHP 流包装器  
  
PHP 有一个名为流包装器（Stream Wrappers）的功能，可以让你控制文件的读取方式。其中一个流包装器就是 `StreamWrappers` php://filter，它在这里非常实用。你可以用它在文件执行之前对其进行转换。  
  
诀窍在于 Base64 编码：  
```
```  
  
完整有效载荷：  
```
```  
  
应用程序不会执行 PHP 代码，而是将其作为原始数据读取并进行编码。响应中会返回一个 Base64 编码的数据块。  
  
  
  
  
  
## 解码输出  
  
将该 Base64 字符串解码，即可得到原始 PHP 源代码——其中包含凭据、逻辑、数据库配置以及所有其他内容：  
  
  
  
  
  
这时，你只需读取应用程序自身的文件就能绘制出整个应用程序的蓝图。LFI不再仅仅是获取系统文件，而变成了一种完整的源代码泄露工具。  
  
  
目前，LFI 已经允许我们读取敏感文件，甚至提取应用程序的源代码。  
  
但这仅仅是个开始。  
  
在下一部分中，我们将更进一步——使用 PHP 封装器和其他技术将本地文件包含 (LFI) 转化为完全**远程代码执行 (RCE) 。**  
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
  
****  
