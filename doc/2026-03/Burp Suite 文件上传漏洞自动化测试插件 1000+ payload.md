#  Burp Suite 文件上传漏洞自动化测试插件 1000+ payload  
原创 攻防路
                    攻防路  攻防录   2026-03-21 13:42  
  
#   
  
项目地址：https://github.com/T3nk0/Upload_Auto_Fuzz  
  
渗透测试遇到文件上传点，测绕过是个体力活。后缀大小写、Content-Type 伪造、双写、空字节截断……每一种都得手工改包发一遍，效率极低。Upload_Auto_Fuzz ——一个 Burp Suite 插件，把所有常见的文件上传绕过姿势打包成 payload 列表，配合 Intruder 批量跑，一键搞定。  
  
截至 2026 年 3 月，这个项目在 GitHub 上已有约 569 颗 star，最新版本 v1.2.0 完成了一次架构级重构，payload 数量达到 1000 以上。  
## 能测哪些东西  
  
很多工具只测后缀名，Upload_Auto_Fuzz 覆盖的维度要宽得多。  
  
**后缀绕过**  
  
最基础的部分，但覆盖非常全：  
- 可执行扩展变体：php3、php5、phtml、phar、asa、cer、ashx、jspx 等  
  
- 大小写混淆：pHp、PhP、aSp、JsP  
  
- 双写绕过：pphphp、aspasp、jspjsp  
  
- 特殊字符：shell.php.  
（尾部点号）、shell.php;.jpg  
（分号）  
  
- 空字节截断：shell.php%00.jpg  
  
**请求头操控**  
  
这一块是很多工具忽略的地方。实际上很多 WAF 和框架对 Content-Disposition 头的解析存在歧义：  
- Content-Disposition 大小写：ConTENT-DisPoSition  
  
- form-data 污染：删除 form-data、多分号、脏数据替换  
  
- filename 参数：双 filename（filename="1.jpg";filename="shell.php"  
）、空 filename、未闭合引号（filename="shell.php  
）、多等号  
  
- 换行注入：filename\n="shell.php"  
  
**Content-Type 绕过**  
- MIME 类型伪造：image/gif、image/png、application/octet-stream  
  
- URL 编码：image%2Fgif  
、image%2Fphp  
  
- 双重 Content-Type 头  
  
- 大小写变换  
  
**系统特性利用**  
  
Windows 和 Linux 各有一套：  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">系统</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">技巧</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">示例</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Windows</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">NTFS 数据流</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">shell.php::$DATA</span></code></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Windows</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">IIS 分号解析</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">shell.asp;.jpg</span></code></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Windows</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">保留设备名</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">con.php</span></code><section><span leaf="">、</span><code><span leaf="">aux.asp</span></code></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Linux</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Apache 多扩展名</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">shell.php.jpg</span></code></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Linux</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">路径穿越</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">../shell.php</span></code></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Linux</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">隐藏文件</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">.shell.php</span></code></td></tr></tbody></table>  
  
**配置文件上传**  
  
这是杀伤力比较大的一类，上传配置文件来改变服务器解析行为：  
- .htaccess  
：写 SetHandler  
，让任意文件被当作 PHP 执行  
  
- .user.ini  
：写 auto_prepend_file  
，实现文件包含  
  
- web.config  
：IIS 下配置 handlers  
  
**魔术字节注入**  
  
在文件头加 GIF89a、PNG 头、PDF 头，绕过服务器端的文件内容检测。  
## 工作原理  
  
Upload_Auto_Fuzz 是一个 Burp Suite 的 Extension，注册为 Intruder 的 payload generator。  
  
普通的 Intruder 攻击，payload 来自一个固定列表（比如一个字典文件）。而 Extension-generated 类型的 payload，是由插件在运行时动态生成的。Upload_Auto_Fuzz 就是在这个钩子里实时生成文件上传的各类变体。  
  
v1.2.0 采用了策略模式重写，每一种绕过姿势都是一个独立的策略类，可以单独启用或禁用。比如你只测 PHP 站、不需要 ASP 相关的 payload，可以直接在配置面板里关掉对应策略。  
  
插件还做了去重处理，同样的 payload 不会重复发送，减少无效请求。  
## 安装步骤  
  
前置条件：Burp Suite 需要配置 Jython（Python 2.7 解释器）。官方文档在：  
  
https://portswigger.net/burp/documentation/desktop/extensions  
  
安装过程：  
1. 从 GitHub 下载 Upload_Auto_Fuzz.py  
  
1. 打开 Burp Suite，进入 Extender → Extensions 标签  
  
1. 点击 Add，Extension type 选择 Python  
  
1. 选择下载的 .py 文件，点击 Next  
  
加载成功后，Burp 顶部菜单栏会出现「Upload Fuzz」标签页，可以在里面配置测试策略。  
## 怎么用  
### 第一步：抓包，发到 Intruder  
  
抓到文件上传的请求后，右键发送到 Intruder。  
  
![抓包发到 Intruder，选中整个文件区域作为注入点](https://mmbiz.qpic.cn/sz_mmbiz_png/0zk3Ye7cp033qkK63It9wUzfpNMFYbSnEtHOiaUGXQUL5HicuJGFy86OgBgSZwjia7nvRunicIprPIPNFD0Iv5bj8aHficAkrjskXDWrhDmRxibks/640?wx_fmt=png&from=appmsg "")  
  
抓包发到 Intruder，选中整个文件区域作为注入点  
  
建议选中整个 multipart body 里的文件部分作为注入点，也就是这一段：  
```
Content-Disposition: form-data; name="file"; filename="test.jpg"Content-Type: image/jpeg[文件内容]
```  
### 第二步：配置 Payload  
  
切换到 Payloads 标签，Payload type 选 Extension-generated，然后点 Select generator，选 upload_auto_fuzz  
。  
  
![在 Payloads 面板中选择 upload_auto_fuzz 作为生成器](https://mmbiz.qpic.cn/sz_mmbiz_png/0zk3Ye7cp00TZRUeauwds9veV52uVCcT13YP28CibGXenJXMyb3VFBqNBicYhfeJibNoxWyac6eUwR0JqH4VGnTNfFvzG4mia2kQY4uD8kVyLvE/640?wx_fmt=png&from=appmsg "")  
  
在 Payloads 面板中选择 upload_auto_fuzz 作为生成器  
### 第三步：关闭 Payload Encoding（重要）  
  
向下滚动到 Payload Encoding 部分，把「URL-encode these characters」的勾去掉。  
  
![取消 Payload Encoding，否则 payload 中的特殊字符会被二次转义](https://mmbiz.qpic.cn/mmbiz_png/0zk3Ye7cp01J8kQ7icGiahKDibSvhos1cDlibYtaibJsMJ8MRohcFfb6WEMo06yNjMtVEUOPpEIaOhnqicZO0mVlfbibHt5GhEV23SZRDIcqErXQgM/640?wx_fmt=png&from=appmsg "")  
  
取消 Payload Encoding，否则 payload 中的特殊字符会被二次转义  
  
这步很容易忘。如果不关掉，payload 里的 %00  
、%2F  
 这类字符会被 Burp 再 encode 一次，导致 payload 失效。  
### 第四步：开始攻击，看结果  
  
点 Start attack，根据响应的**状态码**  
和**响应长度**  
来判断哪个 payload 有效。一般来说，和其他 payload 长度明显不同的那些，值得重点看。  
  
![Intruder 攻击结果，可通过响应长度差异筛选有效 payload](https://mmbiz.qpic.cn/sz_mmbiz_png/0zk3Ye7cp01lDQia0qSFQNSSH3sxhWLVsXJo9sOFWOCagelawICdBlgSmlC61mjwvkcM0FfErU8ibnwMFBRHsyeibgSCUZp2IMQj8Uubyl8ng4/640?wx_fmt=png&from=appmsg "")  
  
Intruder 攻击结果，可通过响应长度差异筛选有效 payload  
## 几个实战场景  
  
**场景一：测试 PHP 站的上传点**  
  
在配置面板选择 PHP 后端，只启用 PHP 相关的后缀策略和配置文件策略。跑完之后，重点看 .phtml  
、.phar  
、.htaccess  
、.user.ini  
 对应的响应。  
  
**场景二：Java 应用的文件上传**  
  
选 JSP 后端，关注 jspx  
、jspjsp  
 类的后缀变体，以及 Content-Type 绕过类的 payload。  
  
**场景三：有 WAF 防护的场景**  
  
先跑一遍基础后缀，看哪些被 block、哪些放行。再对放行的格式在请求头层面组合测试，比如用 Content-Disposition 大小写混淆配合特殊后缀。  
  
注意：WAF 环境下建议调低 Intruder 的并发速度，避免触发限频。  
## 几点注意  
- 部分 payload（比如 WebShell 内容）默认是开启的，正式测试前确认已获得授权。  
  
- 某些 payload 依赖特定服务器配置才能生效，比如 NTFS 数据流只在 Windows 服务器上有意义。  
  
  
  
欢迎关注“攻防录”✨  
  
  
  
  
