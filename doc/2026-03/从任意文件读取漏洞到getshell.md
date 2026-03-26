#  从任意文件读取漏洞到getshell  
原创 陌笙
                    陌笙  陌笙不太懂安全   2026-03-26 09:23  
  
免责声明  
```
由于传播、利用本公众号所提供的信息而造成
的任何直接或者间接的后果及损失，均由使用
者本人负责，公众号陌笙不太懂安全及作者不
为此承担任何责任，一旦造成后果请自行承担！
如有侵权烦请告知，我们会立即删除并致歉，谢谢！
```  
  
前言  
```
有师傅给我发了一个站点
让我测测看看能不能getshell说是国外的站点
正好没事打打看
```  
  
漏洞测试  
  
依旧登录页面起手  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboTIodwZeaMqZMibGBHSvDMmBvw3ODQBdo4F9uiaqmMpK2PqI6lBjd1ZutVw3RpUR3ZeBUyGW9QJ4ib6icEHloA99fH8iaSaXGgc3Tko/640?wx_fmt=png&from=appmsg "")  
  
进行登录页面常见漏洞尝试  
  
可以参考这个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRpjBn5DKV5fcxZeBoZXOMqhmicmG0YZyN7pxibGhQucakbHibqWibhicwKSZFOlgvD32o40nfnlylzQK5WTZRCtnaXqZIkLCfInBr0/640?wx_fmt=png&from=appmsg "")  
  
我们开始尝试  
  
输入弱口令admin/123456，直接提示密码错误  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQv50wrVn1g25sY2BZFxrhywfHnKVdJqokjUfxbDU1XgFBIn6qeD9NBhNlahofiaH2P7m1QliaKXO6cETYU6moiclB7faPnicDNhWM/640?wx_fmt=png&from=appmsg "")  
  
但是这个图形验证码存在复用  
  
只要第一次输入后续就会一直有效  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTju2sWqibWR4FCv9eHWWxkWvegO0tloztYBYEhjbeCo28F6u2h1Wm0A1bnf4e4ia9Iicia6pYbj3rQqksOKqm3E8RntkTakOwUAnU/640?wx_fmt=png&from=appmsg "")  
  
所以这里可以考虑爆破  
  
我们先看看别的利用点  
  
试试有没有注入,然后万能密码啥的  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboTQ6LOzyWycZoZuqgc8zt2FoC2ARibd65YnMdbVvU0REX05kSfknt4ria0yeiaUrbXiaMORJVwLUJzkHiaF86hvreP5tGUWiaDZ3kmSY/640?wx_fmt=png&from=appmsg "")  
  
加个单引号没报错，但是说账户不存在这里存在用户名枚举漏洞  
  
不存在就是存在，存在就是密码错误  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSzJTwROeScnyyM6qJKQuia2J7xGATxw3lHibLia4aykN4tTPIuuXAeicQkxPnpdczC2MnEXq3neic9mTQb6RPTS4bxBxZYNX7I4A5U/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQW7yFPRM3Bxc0y3CfQXq2OSOaHefSH0W4qgjJlNwF0NLq3b337UiaT14YiabInXg8mAguHv45mIS8r6uic1q7uiaRZmxN8RVyYUicE/640?wx_fmt=png&from=appmsg "")  
  
看看接口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboS6UMGOvzWr5yCAPlKW0oY1b3RiaE6sice6a2WQDttm3JgbZ0LFCLROITObGLwlocMw2DiaIl7N4JuGkzj4c7kfzM7uOchhkAroCc/640?wx_fmt=png&from=appmsg "")  
  
这里只能看到一个接口  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboShDsMZFLFQhM7HELBHNscDMWiarJdFFYjfiazSR5vlLKqicR2wwptgSicTpDPliaK0b6wH3YqaFZLsuIXkJuS099Loib8XVUcrd3Jzs/640?wx_fmt=png&from=appmsg "")  
  
而且我直接访问的时候页面是闪了一下过去的  
  
这个时候我们可以尝试访问根目录看看接口  
  
一下直接发现这么多接口有可能信息泄露的接口  
  
记得对接口进行简单修改  
  
/user/id -> /user/1  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboSK7tMGP3ibs4ou25OLZ0DuxBFWfxaRsRibNmgDddPa6ysE84tt058hlP86k6YmyZib0oK8o0e42UgLfoK2yKV3mWXHOsOY7NIBVk/640?wx_fmt=png&from=appmsg "")  
  
有可能存在任意用户读取的接口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSeukGQgYiaGVtnVibA3qHREENrD6Qd0hRGOAuM1JGkgznPFWO94akak4mwBwmGSTnOxA4KbZSjxAJz58tLIDSuGntflNfHAHOQw/640?wx_fmt=png&from=appmsg "")  
  
我们先跑一下接口  
  
看某大师傅的报告学到使用这个工具跑一下get,post  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRucV1ElgZKE7LuCG58bo6eEm9rRMNR5ibJyFewI2FHERxdicw98fc7al5F5dUBe5CUDoZoPW6t8WvQhyD1ice8HPrU2J6f8yw26c/640?wx_fmt=png&from=appmsg "")  
  
啥都没有只有登录框  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSYFu4Mda1XoFJFyIttibc3PQTjGJ1Dsib7xMOy26HNCH8ib5qhtFyBH3334yfRPibnRnZSS3DJVL6xrs9EmfIAbEObAzeklbtSlN0/640?wx_fmt=png&from=appmsg "")  
  
只能爆破一下弱口令（没爆破出来）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRDPicJUcjic4P8C2QPGJGQialcwmqLWkkxJ0DIShe2nYtaO4Liaibpuia1tdts3o2ZiaiaAByuiajqySSriaZudmzPPJFlnliauflSQ3MZaw/640?wx_fmt=png&from=appmsg "")  
  
操作成功和失败返回一样的长度  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRic9wIuRbcfeWkmVx2FV9ymnE7fyibbJIPhiaMb6tjK17jqciaqRwXCKlUvYCibrps3UTURV8kUXvf0mx0xicQKefm4ZEJGtsTjiaw5Q/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRkrZ8UtlvsQ2k7buZicrQKo9vqETLOLeJdYSPAGGPTQkKVJTxE2ibdLeibMJ1n669iaicuM4fMLUMKIgw3NrjXmiaWZZibzpyXRaoib20/640?wx_fmt=png&from=appmsg "")  
  
上面的口令是手动试了几个试出来了  
  
密码是admin123xxx  
  
成功进入后台,这里是云存储泄露了一下云key,而且可以测试链接  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQUKejVXLQ8KPMMY8aLldhtGEqZ7YjHsqSyxEElbl6puWAbnEfWnnDetvpNoJN8VeMWUFjJh3eJpLc6tKricrKCsY1FB9su1pgw/640?wx_fmt=png&from=appmsg "")  
  
这里可以新增  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboS9gKpopzbbnBRfeurKtewlxEvV5v8YTGIliaXOVibq8PsPZUGmOFgnod6nHJoP7JCYj9blOicVWQicjfLEBpicNv0ffGp8s1B7ezxw/640?wx_fmt=png&from=appmsg "")  
  
试试xss  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTkLBrIzq0Fe9MuBwxtI5IPo0ALv3aTicQxnO9mwC0hicUfFvLEVo18esQ9cTYPFkAbrJJUpm07ibeBwwQWMXT5MNzC98EAQYrKw0/640?wx_fmt=png&from=appmsg "")  
  
但是不解析  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRkTczPZgT2ulTVObAHHiaSjL6pLZbdFo228AcHnKj7MUthEeNzg81WM0GWwcaC1wd23ib71FxgNGJRpt8UvHo5r01bohrhwQNK4/640?wx_fmt=png&from=appmsg "")  
  
不测试逻辑洞了  
  
直接尝试getshell  
  
应用管理这里可以新增  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRpFmqVw7oia7PBkHphq3yhActUcTPib5TvYaf2wHPUQlA1DLswvTYeUpqUNu0Pe8QmzAnRFIHtkFNibDibBibV49kF8ZJb7ExOo1fc/640?wx_fmt=png&from=appmsg "")  
  
这里一共可以上传三种类型  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRLVoCG4iaHuGLgDiasdhVkYUy4FbdM1mVOE6zwsPnfXd7kSnklYLVcPQewXpK633gmnUyI11RT62vyza0IYPt2CxPj2Xvmfpiars/640?wx_fmt=png&from=appmsg "")  
  
有APK的接口做了白名单限制只能上传apk  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboR6aZyUFGFx8VNVfsc2wIRn17NFbmQVMP2985pjBH1VKEm6TkibVERz955WYxrQ7cMKwOEYN39HMkRLGOd6j8J7wYichfUOaOFTY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQrm0VCoXe9Kvv2nVgyNj37mBlVIdriciar5vHvV5em8ia3trwXCcqZTwnkzObghBtItu8xP1hdl1a8vOTkPez2luNbIY8icXZZyfI/640?wx_fmt=png&from=appmsg "")  
  
接口是这个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQ76owF6beOMr4h4A7or7W4ToiaB6TcDicW7EtEDv7qNCn9Y37AOadgwsI0C8vlyUYzOq6sak8CLGRdn4Rm9KQeoJGtjGGTRU0M4/640?wx_fmt=png&from=appmsg "")  
  
其实这里如果没有后面的可以考虑fuzz一下其他的格式比如  
这种的  
```
/file/uplaodFile
/file/uploadImg
/file/uploadPng
```  
  
但是这里有其他的点  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTN8Rs2Ysg7icp2Y6WKnuok5Coj341mN0ibgv6cfX8CKyGIzlLn5g39SjbvGpdgibsteVIe1whYnqEiclAn4hpQWhufZ7FK6faiaWVg/640?wx_fmt=png&from=appmsg "")  
  
直接出现四个上传接口  
  
随便找一个传图片的点上传，bp看到上传包，修改为jsp上传成功，没有任何过滤。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRMrtyF93dI98k6ApR2sqgbEE9TZokk4Qs2fNYX5qr9HL5tzzibfKmpS6icqaBibyboRsJK3VOVNMZhfo3FyWZfX78hkgvianhCcicY/640?wx_fmt=png&from=appmsg "")  
  
但是找不到路径  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRGN7lOwf3KAa0bI0AaUbl4v8sPb5QsiayYoWeKcLT8TleVPjQ2d3BrkqengznL7ybRYJ1icpgztKhmicGFbuFUaMWPGZKia5kSrgo/640?wx_fmt=png&from=appmsg "")  
  
打开一个新上传的图片是这个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRgfkWtvwGuiazjgPlp072RwCsCtbv1NDZDM2BBLy2dovrExkHtcFztn8OkBAIfLAyvYL7wAffYnquicuGDLjkSoyB1UFxch7DIM/640?wx_fmt=png&from=appmsg "")  
  
自己拼接了几个  
  
/upload/啥的  
  
/uploads/啥的  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQNU4hibBlC2w5sShaQZgRyMDP6GImW5ExgLMMGqpJAlGDPQH2Yf5VxSVP8L8Q42rLhVlGuXftGiauyjATNhMb1ibg6OeLkicFRo8w/640?wx_fmt=png&from=appmsg "")  
  
也没有只能看看这个download接口  
  
经过手工测试，成功找到任意文件读取漏洞  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQxM5qzaHARBOIZtHDGpbibDv7wf6HiaqKeMzFFX0nBTz8Iib9wrsgGTnRAC88icuNETJJMJSUpoEVlZ7PibrBy58MwQg1dSTyVZBKU/640?wx_fmt=png&from=appmsg "")  
  
尝试深入利用  
```
/root/.ssh/authorized_keys //如需登录到远程主机，需要到.ssh目录下，新建authorized_keys文件，并将id_rsa.pub内容复制进去
/root/.ssh/id_rsa //ssh私钥,ssh公钥是id_rsa.pub
/root/.ssh/id_ras.keystore //记录每个访问计算机用户的公钥
/root/.ssh/known_hosts
//ssh会把每个访问过计算机的公钥(public key)都记录在~/.ssh/known_hosts。当下次访问相同计算机时，OpenSSH会核对公钥。如果公钥不同，OpenSSH会发出警告， 避免你受到DNS Hijack之类的攻击。
/etc/passwd // 账户信息
/etc/shadow // 账户密码文件
/etc/redis.conf #redis配置文件
/etc/my.cnf //mysql 配置文件
/etc/httpd/conf/httpd.conf // Apache配置文件
/etc/redhat-release 系统版本 
/root/.bash_history //用户历史命令记录文件
/root/.mysql_history //mysql历史命令记录文件
/var/lib/mlocate/mlocate.db //全文件路径
/proc/self/fd/fd[0-9]*(文件标识符)
/proc/mounts //记录系统挂载设备
/porc/config.gz //内核配置文件
/porc/self/cmdline //当前进程的cmdline参数
/proc/sched_debug 配置文件可以看到当前运行的进程并可以获得对应进程的pid
/proc/pid/cmdline   则可以看到对应pid进程的完整命令行。
/proc/net/fib_trie   内网IP
/proc/self/environ   环境变量
/proc/self/loginuid   当前用户
/etc/ssh/sshd_config 重要文件可以构造密钥
/proc/self/cwd/ 工作目录(可以根据内容继续构造)
/proc/self/tomcat/根据回显继续读取
```  
  
这个私钥读不到  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboR2BbsdZWOJ4vragzEhrkTFic9WxhEQWu0nL23icsdeX0x6alplA0C3vxQGTL4waiccffibmaTibibdR6E9whU8jqePIhtJrVBQFM4BQ/640?wx_fmt=png&from=appmsg "")  
  
这个我之前看过一篇文章可以尝试读这个  
```
/etc/ssh/sshd_config 是 SSH 服务端（SSH Daemon）的配置文件。

它的作用
控制 SSH 服务器 的行为，例如是否允许 root 登录、使用什么端口、是否允许密码认证等


常见的配置项
配置项	说明
服务监听的端口
Port 22	SSH 
是否允许 root 用户登录
PermitRootLogin yes/no/prohibit-password
是否允许密码认证（禁用后可提高安全性）
PasswordAuthentication yes/no	
是否允许公钥认证
PubkeyAuthentication yes/no	
限制哪些用户可以通过 SSH 登录
AllowUsers user1 user2	
禁止哪些用户登录
DenyUsers user3	
监听的 IP 地址
ListenAddress 0.0.0.0	等等等。
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboR7Lc8JHBZUXFkibFczju0SdBjDBCLUC0zXlKL6qSXxxNVaYB2lEeCnaeX4a3vPoDKGZ99UvWjWhHvIHXy1cPzuL7EcEn6VLW8c/640?wx_fmt=png&from=appmsg "")  
  
根据这里的内容进行构造  
```
HostKey /etc/ssh/ssh_host_rsa_key
#HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
```  
```
/root/.ssh/id_ed25519
/root/.ssh/id_rsa
/root/.ssh/id_ecdsa
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTy4ZhnjxuGn6UVfOgB5548YBjQsua706iaDk6mJWZibRpiaB5ZNwFMFdXCSbJ9KfU3zkJo8NEswnRm2EEGBC6FJs04Nr9tM8Go2A/640?wx_fmt=png&from=appmsg "")  
  
成功拿到私钥  
  
使用xterminal成功连接，whami直接看到是root权限  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTwk73lmyicUxTeaG333nmI6aRyL91icK8NOBWiaibSiaFERrjgCRf3IlKiaWLiaGh2xhD66eUnxZMvBQgRYqRL3h7lricvzGv6qKag3K8/640?wx_fmt=png&from=appmsg "")  
  
继续查看是否在容器里面  
```
方法一：查看主机名和进程
查看主机名和进程，通过查看主机名和进程可以做个简单的判断。
检测描述：容器的主机名默认随机生成的字符串，PID1非系统进程，可初步判断当前为容器环境

检测方法：使用命令hostname和ps aux，查看相关信息
方法二：查询cgroup信息
通过利用cgroup信息的差异，可以用来判断当前的所处环境。
检测描述：通过查看cgroup信息，可以判断当前环境是否是虚拟机、Docker容器或K8s集群
检测方法：使用命令cat /proc/1/cgroup，可以查看相关信息。

方法三：检查/.dockerenv文件
检查根目录下.dockerenv文件，判断当前环境是否为容器环境。
检测描述：通过判断根目录下的.dockerenv文件是否存在，确认当前环填是否为容器环境.
检测方法：使用命今ls -alh /dockerenv，检查是否存在.dockerenv文件。
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboTZzWtPAaelV3HlpA5gbEs6PzRAUe4VESkbjtWHR8Aw3cDYiceWKwjNpnqRiamajaIVAtYWuP7oHic6IVbpHK6NSLH2wUJoveLKgM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQ43c4T9F5lZBKAYxHptiblsPJgj86LLhdYMsOoYfLrm1v3vgOPObbv6a9Y878gVrwHGS06k5T0jbLIA7yteByqNIVibnn1b94JQ/640?wx_fmt=png&from=appmsg "")  
  
显然不是，对主机名进行查看，可以看到确实是外国的  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQcpauL55FMvKfSWCpxJEX4Fdia2AhHK1KYTxFKMoHHaOZXpjaoHCBkFtaLbIQfh1Ku3IT3m6ADb39S5ul5g1waSzyCgMJibRmJ8/640?wx_fmt=png&from=appmsg "")  
  
直接可以拿到一个国外的vps  
  
其实这个是通杀，不能放出来容易出事，因为有国内的资产，  
看了文档不能getshell的师傅可以参考这个文章，给内部圈子师傅练练手，能看到下载记录，我还能控制控制，师傅们就当学个思路。。。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboSC63uJibeRdZc8MHfJGZASnq3BjSHub7ZcQn8IzeIGv2gXcXZ3Njd2oLkeCicP9670KVtX3LVkzLddyTJ8A8iaBGQiblxnOyIoodQ/640?wx_fmt=png&from=appmsg "")  
  
  
交流群  
   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboTK9XL3n9rx1ntXfFnAsQdvia4hmiarCs0P4lyrL0xzWxfoLt0pvzVev66m708JYS21sZunDbWcVaVkk51KqRkQSdWdkgemnggy0/640?wx_fmt=jpeg&from=appmsg "")  
  
         
  
 广告：    
cisp pte/pts &nisp1级2级低价报考。  
  
陌笙安全  
交流圈  
子+陌笙src挖掘  
知识库  
+陌笙安全  
漏洞库  
介绍 （加入圈子送知识库+漏洞库）              
  
如果觉得合适可以加入，人数满300人，就没有5元的优惠券了，目前价格只需  
35元，圈子的价格只会根据圈子内容和圈子人数进行上调，不会下跌  
  
圈子福利        
  
漏洞挖掘1v1指导,我给指定站,你测试之后出报告,我根据报告总结你不出洞的问题,以及看漏洞点和总结，当然你可以自己找站，我来帮你完善总结思路。（不包过，思路为主，主要针对小白，大师傅就没必要了，主打性价比，帮师傅们快速提升，挖到第一个edu洞。）   
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MSDUaqtwboR7v3GgENCXPfzwrkTKCyTu5CqOHyDR8OYWSXCfN1PmCjibjGpF1eMPfTuyXy3Am2v80V9c2JPI24C22dZq7KamHjG1XDzVmndw/640?wx_fmt=jpeg&from=appmsg "")  
  
陌笙src挖掘  
知识库  
介绍（内容持续更新中）  
```
信息收集
弱口令漏洞
任意文件读取&删除
sql注入漏洞
各种逻辑漏洞
url重定向漏洞
命令执行漏洞
反序列漏洞
未授权访问漏洞挖掘
XSS漏洞挖掘
CSRF漏洞挖掘
dns域传送漏洞
SSRF漏洞挖掘
EDUSRC挖掘案例分享
经典常见漏洞复现
等各模块不在一一介绍
```  
  
edusrc  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboQnu4nW2B6yibZw9xtCZV3mz9T0RiaegrnQbrkPN9K6MmuOEgVAyGxNvYQbP8ibmpsv7vQrkZDQFEnBvMiasFAMDFAicJAIyvcCrHic4/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboQnuBhAKicDz7O0I514LJKMNpZDlJQIIGvfib7HKWheKRfmZdzMzbn68CnEvadbtJwgtficShGARp4wQM5j5UhvMje1mlGPStB58U/640?wx_fmt=jpeg&from=appmsg "")  
  
src挖掘基础知识  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MSDUaqtwboT4ibkLJNNa0HA9o4BLCmlqTG1cia8XbBuX35VU3PD8ellIA2GcQQScjaBFPHVbMKqGibZrgUdLpyHbMLl51Yencpic1AL4G3g8a5o/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboQkY3kQH91B4gYTGY4En9NWc7Rw1P8AEKoPib0pafSCvGSqEfSUd71WLACV7ibkJPMubI2PzzPggB5kobfJDjodUam1WWtO2v4Rk/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboQhEH7t40J0kAjia8mzd8uibqcs3d98ibLmUrxeic55H8HLGMPpa0ictTrTqpVhnjvnmUUImEQgbOXsicauGTL0icF8vKdRjPoEJMDEnc/640?wx_fmt=jpeg&from=appmsg "")  
  
陌笙安全  
漏洞库  
介绍  
```
1day&0day分享
EDU
Web应用漏洞
CMS漏洞
OA产品漏洞
中间件漏洞
云安全漏洞
人工智能漏洞
其他漏洞
开发框架漏洞
开发语言漏洞
操作系统漏洞
数据库漏洞
网络设备漏洞等
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MSDUaqtwboTTZew0YHtPpDKj0nNHkWumxYhM4AWT1IcicYengasC1hqDZEH6apvoYbUicZxmEXqaP2KHN12sLpE1sfJsFkcsP0YDnuQfRwJFM/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/MSDUaqtwboRiaYMwt3UwQHJoAtQPLhqUncQmQBwRlqg6aGAsWmsibZnAQSt8dw3SfEzbaiagM7hsWJjCZWticq8937yn2W9H8Z349DbGuOicHD8E/640?wx_fmt=jpeg&from=appmsg "")  
  
圈子介绍  
```
1、src挖掘思维导图，信息收集思维导图，edusrc挖掘思维导图，以及后续的红队&面试思维导图&自己网安笔记等持续更新
2、2025-2026的edusrc实战报告包含证书站和非证书站以及2025之前的各种优质报思路分享
3、各种src报告思路分享（内部&外部）
4、分享各种src挖掘&edusrc挖掘培训资料&视频
5、不定期分享通杀、0day
6、有圈子群可以技术交流以及不定期抽取证书&免费rank
7.分享各种护网资料各家安全厂商讲解视频&精选实战面试题目
8、各种框架漏洞技巧分享
9、各种源码分享（泛微、正方系统、用友等）
10、漏洞挖掘工具&信息收集工具&内网渗透免杀等网安工具分享
11、各种ctf资料以及题目分享
12、cnvd挖掘技巧&CNVD资产&src资产分享&补天1权重资产分享&fofakey共用
13、免杀、逆向、红队攻内网防渗透等课程分享
14、漏洞库&字典以各种内容不在一一说明
15、cisp-pte/pts&nisp一级&nisp二级&edusrc证书内部价格
15、如果有漏洞挖掘问题或者工具资料需求可以找群主(尽量满足)
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSY2pbvbP3qGAlW8O43bRvAISCxZm4UDTRsaMVbJKTsjfTMTDlq6qNBcVs4tkl4UzgqGz5ag81baU1rusKE09J9T6cMVliaibibwQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboTrLRQpTicOR7bzyNiajiapVJgyMiaYlEDBVU87YXMnanOFWsCYN3cCVGsKkibzV9dMryvbFXBb4Z3472ib27RJ1Xq1HnKJIp5u49GYQ/640?wx_fmt=jpeg&from=appmsg "")  
  
目前560多条内容，扫码查看详情，持续更新中。。                
  
如果觉得合适可以加入，价格不定期会根据圈子内容和圈子人数进行上调.  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTRYerUQG0hiaY8ETj1fsicklEtQ2hNhGneaFNkJQJPWats9HhKFiab18ZURL6BnFyUjSYWHQtEPldfUnAqyJ4G7cjz6MLq88MBmg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQujstRtFOQ86ic0Mbsib9acWgy7eEwYTJCzKBsZ9ZM6ctnMXmb0t7ibSBknuW5pg1bTdeKSNOg9ygJBhddHK1SnQ9B9Pb4r6SFyg/640?wx_fmt=png&from=appmsg "")  
  
