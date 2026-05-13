#  神秘黑客组织利用Linux服务器运维组件漏洞大量安插后门  
 二进制空间安全   2026-05-13 08:25  
  
将二进制空间安全设为"星标⭐️"  
  
第一时间收到文章更新  
### 安全事件背景  
###     
  
     
CVE-2026-41940是一个影响CPanel和WHM的高危未认证身份验证绕过漏洞,该产品广泛应用于Linux服务器运维和虚拟主机管理,该漏洞的CVSS评分已经达到9.8严重级别。黑客利用此漏洞无需提供任何账户密码,即可远程绕过身份验证并控制cPanel/WHM控制面板,从而使未经身份验证的远程攻击者获取目标服务器的管理员权限。目前有大量黑市和灰色市场组织在利用该漏洞进行网络攻击,行为包括挖矿、勒索额软件、僵尸网络传播、后门植入及其它恶意活动, 根据监控数据显示,目前全球有超过2000个攻击者源IP地址参与了针对该漏洞的自动化攻击和网络犯罪活动,这些IP地址分布在全球多个地区,主要来自德国、美国、巴西、荷兰等地。  
  
### 关于神秘黑客组织  
  
  
在利用CVE-2026-41940漏洞传播的Payload中,有一个使用Go语言编写的感染器, 该感染器会将SSH公钥、恶意PHP和JS代码植入受感染的cPanel系统,并窃取登录凭证,将窃取的信息发送回攻击者控制的Telegram群组。通过溯源发现, 在本次活动中使用的Downloader域名,跟一个在2022年被上传到VirusTotal，且至今仍为0检测的PHP后门程序共享同一个C2域名:wrned.com, 该域名最早在2020年已被使用。  
  
由此可见, 该黑客组织绝不是"打一枪就跑"的机会主义脚本小子，而是一个稳定、成熟且能够多年隐藏运作而不被发现的黑客组织。通过溯源发现, 该黑客组织创建的Telegram群组使用的用户名为:"0xWR",并且在JS代码中使用Rot13算法来隐藏C2服务器,后面将以wr_rot13代号来命名该组织。  
  
### 感染器分析  
###   
  
首先来看一下wr_rot13通过CVE-2026-41940传播的恶意脚本,它的功能是从下载服务器:cp.dene.de.com请求一个名为Update的恶意Payload,并使用nohup命令在后台持续运行,如下图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC4hS505JgppoAlpLtZdMXQqOLYpVIEAyLFS17fHyhkVFCf1loajj1m7MdJOtLNKJFYricia2ngP4lnCRerLgFHI0rO9ibuwJiaFhLs/640?wx_fmt=png&from=appmsg "")  
  
下载该感染器后的基本信息如下:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC6XZU24BL0sN3HMqCTaMxadclTLvqguePlk3dZpSnFVM8iczAzxugvVAjujiaJKDRV8ASnwo665hYGrCpaiag1UUH6VuPluiaLW4KI/640?wx_fmt=png&from=appmsg "")  
### 经过分析,该感染器的功能和结构都比较简单直接,分析难度较低 当感染器在未指定'-s'或'--silent'参数的情况下运行时,它会按顺序输出各项任务的执行状态。从输出字符串风格来看,该感染器很可能是攻击者使用人工智能直接生成的,如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC4kh3DR3I9Pzmb4CDYJujFDNso4ibl0QgonZFIgQLxTSbElILpsaRJqpkyOK00iaGa5O1eLeEmbuNguiaD74u4PRWcUofsKZvlGoc/640?wx_fmt=png&from=appmsg "")  
  
感染器的主要任务是修改受感染系统的密码,植入SSH公钥、PHP Webshell和恶意JS代码,并部署文件管理器远程控制工具,并将敏感设备信息和凭据发送回攻击者。  
  
**阶段1:修改密码并植入SSH公钥,处理函数为:main_changeRootPassword 和 main_installSSHKey**  
  
以下是感染器修改的root密码:   
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC7PicaYv6VJiatsULQYicI3spRvUTOCt12d7rBrQgEfeQ2uWyibia5l3xWn92oIzapMzCcKtaZRFgiaM407FVibiatTnxyiaZYNoXaPoaUk/640?wx_fmt=png&from=appmsg "")  
### 植入的SSH公钥信息如下:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC6bhuzia1CibXPgibIql1GkBUqSWnvWTkmIS9tM3vicvupE0jqw6ZiazJMDPYibH8xicDtvwjtB1o1Qt70wqYeDmVfoQbaGHrmJMibMLoc/640?wx_fmt=png&from=appmsg "")  
  
**阶段2:植入PHP Webshell,处理函数为: main_installCpanelPy**  
  
随后植入的WebShell下载地址为:  
https://cp.dene.de.com/cpanel.py  
, 存放的本地路径为:/usr/local/cpanel/cgi-sys/cpanel.py, 该WebShell名为Cpanel-Python,支持文件上传和浏览,以及远程命令执行,如下图:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC5MWXMUZhyWYvibVPLW47la1zXbqj3tqRzRSNcntOOVPQl4FR8ZdahjdGCUm7ylDr0ia5jKia73FAEHUic70XW7ATvmwzm8dic4OA9M/640?wx_fmt=png&from=appmsg "")  
  
**阶段3:注入Javascript代码,处理函数为:main_injectLoginPage**  
  
攻击者会从远程服务器cp.dene.de.com下载login.js和login.tmpl文件,并将它们保存到:/usr/local/cpanel/unprotected/cpanel目录,用以创建自定义登录页面。login.tmpl是一个模板文件,它通过以下代码片段将login.js嵌入到HTML页面中,如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC70GvlZkzLFiaT9W9ICCUzavLw0IbMLnqIIVM6XjsWzVbLturlQnictIrGa9MV3NdkolEca4fDFjgBtWRBZUibLupoib9HQPGib4SQc/640?wx_fmt=png&from=appmsg "")  
### 另一方面,login.js使用代码片段在登录期间窃取用户的用户名、密码、User-Agent和当前URL,并通过Ajax请求将这些敏感数据发送到攻击者控制的远程服务器,服务器地址为:uggcf://jearq.pbz/ybt.cuc?g=3, 这一串地址使用了ROT13编码,解码后的地址为:https://wrned.com/log.php?t=3,如图:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC6WYJZia96YJR9x5097lQW2Bwat7UQHhFnfA4uibvib9FiaZ0DpyibLRrnkJEM9NyJcZYxXqr6HxeccyPGqqnq0hAOncjzdYKTjoiahk/640?wx_fmt=png&from=appmsg "")  
  
**阶段4:部署文件管理远程控制工具,处理函数为:main_runWpsockInstaller**  
  
攻击者构建了一个curl下载命令,其中URL指向文件管理器后门的安装脚本,下载地址为:  
https://wpsock.com/cpanel/install.sh  
。如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC7xEGREWumnW8a7ibJrNxobVWD6VR6zWITnARJ1K3w29Bic8EzZyX4z53rlzZvUyXOpuF7RrsH5kx395ebnGwEnQ0DU6rwm5YAUo/640?wx_fmt=png&from=appmsg "")  
  
install.sh中的代码表明Filemanager是一个跨平台后门,支持三个主流操作系统:Darwin、Linux和Window，如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC6RyqAa8IaHkWZxQUaDSn1jSW0SJ0oymqoGQ4v9icxU1tslFwzxy9wb6JbmqE0wwkic50bEpuBbMn9YDgoT8poyJCicz4OiaRgRKNQ/640?wx_fmt=png&from=appmsg "")  
  
**阶段5:敏感信息通过相应的处理函数main_postData发送回C2**  
  
感染器会从受感染的系统中收集敏感信息,包括bash历史记录、ssh数据、设备信息、数据库密码、Valiases配置等,并将其发送回黑客服务器:   
https://cp.dene.de.com/collect.php  
,如图:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC6bibYbdGTFt5H6KyzgtoH1wTplp3A40CHqjsEywJ2dmibsqJjhWFZcich080BKeIciaeM9Gy0ckuv3umgWM3rkcQ3pV716fbXv46o/640?wx_fmt=png&from=appmsg "")  
  
**阶段6:敏感信息通过处理函数:main_sendTelegram或main_sendTelegramFile发送回Telegram**  
  
除了main_postData方法之外,感染器还支持冗余的Telegram外泄通道,接收信息的群组ID为:-443071772,如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC5Tv5NA2kkbxKRZV50CK43BxCVuyqaCZLglH948ILdgYAibCc28zp3Geo0iaa5nLVMcS5jfYNakmSy5XusGyWIfpBM9n63dEQ6uE/640?wx_fmt=png&from=appmsg "")  
### 众所周知，使用Telegram Bot进行数据传输需要配置令牌。目前，发现了以下两个令牌，它们都对应于名为“log_FatherBot”的同一个机器人，只是前者已被撤销。  
###   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC513h2DngQMOQ7nn3PIBIDBCk91GKVkoyXBhZHicesYhw3BjXuImsjgVAoBYaAHFxc2HVUSicibYt0RwXjVNLxTac1pJb6uJWxfTc/640?wx_fmt=png&from=appmsg "")  
  
获取到令牌和群组 ID 后，使用 getChatAdministrators API 发现该群组的创建者是 0xWR。遗憾的是，他的个人简介没有提供任何其他信息。如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC7EBTCwHlMgZAiabkoGsnCLXa1vkI47RTXFqrcCg6icN1FW6xezArDNBU8pFPtlaj33gVejQFAicxesNQ0KPDqUPNZT7wiaCHGTpicc/640?wx_fmt=png&from=appmsg "")  
###   
### Filemanager远程控制工具分析  
###   
  
Filemanager是一种跨平台远程控制木马,支持三大主流操作系统：Darwin、Linux 和 Windows。这里重点介绍基于AMD64 CPU 架构的Linux 样本。其基本信息如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC68MmTicicuTTa8b6F42gux8icsyy3gaRV7l75m7GaQ9qx03RtibtCFK7FoQjzAUR5ibTpTNmibMh5NYI7PQS7fjjOzSIWBZCIt4rjkA/640?wx_fmt=png&from=appmsg "")  
  
文件管理器支持大量参数。需要特别注意的是：此工具不支持直接传递明文密码。正确的方法是：首先使用   
-hash  
 参数生成目标密码的 bcrypt 哈希值，然后通过   
-pass-hash  
 参数传递生成的哈希值。在 Shell 环境下，必须将 bcrypt 哈希值用单引号括起来（例如，  
$2a$10$...  
），否则   
$  
 符号会被解释为变量，导致密码无效。如图:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC51fmr0aXX7kZRMNANghBiciate4tpjrP9GLbia2l6cXib7oB9O9VOXjzNIf5gZ2Wvl2OYH4Ln2N7cASBJgN9gcYqMAnrqXS64eTng/640?wx_fmt=png&from=appmsg "")  
  
在运行时，文件管理器会监听端口参数指定的端口，并为攻击者提供一个通道，使其能够通过网页远程管理被入侵的系统。如图:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC5xguDmz0DOMg7kB43YH0TVxnibuqg1Niag5RCLkQzRdM0X3ickqjTo6msibz7RR8tOk4fHicsgqCt92tMeFcYZrbsmT5MVIAuyuTWE/640?wx_fmt=png&from=appmsg "")  
  
为了演示其功能，下面在测试设备上启动了文件管理器，并指定了用户名和密码，端口设置为 9999。如图：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lLNNhhDrAC4dVBYLHx33AcHfqvsGd2HfNyHwPHsN9aiaEibLEGHVG5vvGuSGZPQJhiben7miasicFzO7FuRWO6JUMG21dcodsQtbAJuaNkm5Sa10/640?wx_fmt=png&from=appmsg "")  
  
此时，通过浏览器访问测试设备的 9999 端口，即可打开操作页面——一个非常典型的远程控制台，支持文件管理、远程命令执行和 SHELL 功能。如图:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lLNNhhDrAC5bYIkPPyfd3NHtzz05mj0u4F5bibknQPSxia1EYjWd2iaM8snpt4OVCkY5UMsQKJ3MNOPELOibxC32hppRX8OzcZcLU3cww1nFXZQ/640?wx_fmt=png&from=appmsg "")  
###   
### IOC  
###   
  
MD5:  
```
2286f126ab4740ccf2595ad1fa0c615c *help.php
2de27ca8d97124adaf604b18161a441e *Update
29222f5e73dd10088fcf1204aa21f87f *Update
fb1bc3f935fdeb3555465070ba2db33c *Update
45fc93426cf08f91c9f9de5f04a12263 *filemanager-darwin-amd64
711afb014f64c97d7b31685709c34ce7 *filemanager-darwin-arm64
22613c952459e65ce09fb6b5c1c03d47 *filemanager-linux-386
9305b4ebbb4d39907cf36b62989a6af3 *filemanager-linux-amd64
e49f68a363c867608972680799389daf *filemanager-linux-arm64
e1ec6ebb96cf87c785ee6a7da677c059 *filemanager-linux-armv7
02a5990b11293236e01f174f5999df20 *filemanager-windows-386.exe_
bae1f1bce7c82fa86f05b12e2e254cfc *filemanager-windows-amd64.exe_
```  
  
C2:  
```
wrned.com
```  
  
下载器网址:  
```
https://cp.dene.]de.com/cpanel.py
https://cp.dene.]de.com/login.js
https://cp.dene.]de.com/adminer.php
https://cp.dene.]de.com/Update
https://wpsock.]com/cpanel/install.sh
https://wpsock.]com/cpanel/dist/filemanager-linux-386
https://wpsock.]com/cpanel/dist/filemanager-linux-amd64
https://wpsock.]com/cpanel/dist/filemanager-linux-armv7
https://wpsock.]com/cpanel/dist/filemanager-linux-arm64
https://wpsock.]com/cpanel/dist/filemanager-windows-386.exe
https://wpsock.]com/cpanel/dist/filemanager-windows-amd64.exe
https://wpsock.]com/cpanel/dist/filemanager-darwin-arm64
https://wpsock.]com/cpanel/dist/filemanager-darwin-amd64
```  
  
Reporter URL:  
```
https://cp.dene.de.com/collect.php
https://wrned.com/log.php
```  
  
扫描器IP:  
```
178.249.209.182
149.102.229.146
```  
  
Telegram Token、频道和用户ID:  
```
Token
1190043163:AAEy1FDoB_r8KFiOIqsEpgDQ2k78Ai6BdWk  (Revoked)

1190043163:AAFtaUfpui9fqKoRnqOa5XvT6MHLcK1axiU  (Active )

Group
-443071772


BOT ID:1190043163

OxWR ID: 1209569354
```  
  
**(全文完)**  
  
