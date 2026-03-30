#  手把手CNVD从资产收集到通杀漏洞挖掘  
原创 神农Sec
                        神农Sec  神农Sec   2026-03-30 02:19  
  
  课程培训  
  
  扫码咨询  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fchVnBLMw4kTQ7B9oUy0RGfiacu34QEZgDpfia0sVmWrHcDZCV1Na5wDQ/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
  
#   
  
专注于SRC漏洞挖掘、红蓝对抗、渗透测试、代码审计JS逆向，CNVD和EDUSRC漏洞挖掘，以及工具分享、前沿信息分享、POC、EXP分享。不定期分享各种好玩的项目及好用的工具，欢迎关注。加内部圈子，文末有彩蛋（课程培训限时优惠）。  
#   
  
  
01  
  
0x1   
手把手CNVD从资产收集到通杀漏洞挖掘  
  
## 0x1 前言  
### 1、CNVD平台介绍  
  
国家信息安全漏洞共享平台（China National Vulnerability Database，简称CNVD）是由国家计算机网络应急技术处理协调中心（中文简称国家互联网应急中心，英文简称CNCERT）联合国内重要信息系统单位、基础电信运营商、网络安全厂商、软件厂商和互联网企业建立的国家网络安全漏洞库。  
  
CNVD官方网站：https://www.cnvd.org.cn/  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXXiaNItZMzxCQWe4a5eDFvoqmwyOFctS2ic0c6NVypicVz4csWk1ZjZKbmI2BH8aM9I0ceAk0iczFW5vO5pOEmVg03uQSZzVTKfDk/640?wx_fmt=png&from=appmsg "")  
  
img  
### 2、CNVD证书发放规则  
  
**归档漏洞的证书颁发条件为：**  
  
**1、事件型**  
  
事件型漏洞必须是三大运营商（移动、联通、电信）的中高危漏洞，或者党政机关、重要行业单位、科研院所、重要企事业单位（如：中央国有大型企业、部委直属事业单位等）的高危事件型漏洞才会颁发原创漏洞证书。  
  
**2、通用型**  
  
这里我们主要介绍通用型漏洞证书获取方式，通用型发证要求为中高危漏洞且漏洞评分不小于4.0（这里说白了就是低危不发证），通用型证书获取方式需要满足两个条件：  
- 1）需要给出漏洞证明案例至少十起（例如：一个建站平台下的十个网站都存在SQL注入，你就需要提供这十个网站的URL，具体漏洞复现方式需要在你上传的doc文件中至少详细复现3~5个，剩下的只需要将URL附上即可）。  
  
- 2）发现的漏洞相应的公司规模要以及注册资金要相应比较多，反之可能提交的漏洞会被打下来（CNVD要求公司的实缴资金必须不小于五千万）。  
  
## 0x2 信息收集——github  
### 简介  
  
在漏洞挖掘的过程前期我们进行信息收集，github和码云  
搜索相关的信息，代码库，运气好的话可以在库中发现一些重要配置如数据库用户密码等。  
  
这里先给师傅们分享一下**手工github搜索语法**  
:  
```
in:name baidu              #标题搜索含有关键字baidu
in:descripton baidu         #仓库描述搜索含有关键字
in:readme baidu             #Readme文件搜素含有关键字
stars:>3000 baidu           #stars数量大于3000的搜索关键字
stars:1000..3000 baidu      #stars数量大于1000小于3000的搜索关键字
forks:>1000 baidu           #forks数量大于1000的搜索关键字
forks:1000..3000 baidu      #forks数量大于1000小于3000的搜索关键字
size:>=5000 baidu           #指定仓库大于5000k(5M)的搜索关键字
pushed:>2019-02-12 baidu    #发布时间大于2019-02-12的搜索关键字
created:>2019-02-12 baidu   #创建时间大于2019-02-12的搜索关键字
user:name                  #用户名搜素
license:apache-2.0 baidu    #明确仓库的 LICENSE 搜索关键字
language:java baidu         #在java语言的代码中搜索关键字
user:baidu in:name baidu     #组合搜索,用户名baidu的标题含有baidu的
等等..

```  
  
然后再给师傅们分享下**github官方文档**  
： GitHub检索文档  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWVQNEE3HPAHzDhgGXRThSXI4cZXFvIeFtwZAjOLSkn0WFhPC9WsW1IjkEdFnWlyCUpUrUJTMX1nBM4xKj5lyqKQZYVUSaOnsE/640?wx_fmt=png&from=appmsg "")  
  
img  
### 自动化工具——GitDorker  
  
GitDorker工具下载GitDorker   
是一款github自动信息收集工具，它利用 GitHub 搜索 API 和作者从各种来源编译的大量 GitHub dorks 列表，以提供给定搜索查询的 github 上存储的敏感信息的概述。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWCZHw3C2X624TyfcGnoNQgM49ibcAfS4Vic49TqfaCgCtms1TgfjWAticOIOjCyLbZdyBfybHQxVKgzkyIIKmG1FoPuw4HLtWgrg/640?wx_fmt=png&from=appmsg "")  
  
img  
  
**挖掘泄漏方法:**  
 可以从域名开始找比如: xxx.com  
 我们就使用github.com  
 等平台等搜索语法对包含xxx.com  
进行搜索，再一一进行逐个排查或者直接使用上方等自动化工具，直接跑也可以。  
  
**高危案例:**  
  
某某某.com 存在敏感信息泄露，数据库用户名密码等泄露  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUlxhg7ia0btic496SiaxRDoCw6cDFpBvLCic0DliclBHLh21eW3dfNVP1icic5buH2zH76bdSYhhAytK0xuTKLKcL3UTbC3dXcFdpBRs/640?wx_fmt=png&from=appmsg "")  
  
img  
  
通过查看库内文件找到了 数据库配置等信息  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUicV17dvLuxbu7gNYdXywYewjM8ibNMrQPLLicm5R9j50ib4icntKThOK4c2JaUz30pR7mNut9xOiaeX4VQ7mJgWXzWHeOvn2QCLoeg/640?wx_fmt=png&from=appmsg "")  
  
img  
## 0x3 资产收集  
  
首先这里我先确定这个公司的资产信息，可以使用网上一些免费的企业查询在线网站，比如爱企查、企查查、风鸟等在线免费的企业信息查询网站。  
  
下面可以看到该公司的基本信息以及重要的注册资本资金，但是现在对于要拿漏洞证书的通用型漏洞来说，需要实缴资本大于5000万，下面这个公司就符合。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXXgxfGJfH1DibhUicxTABDlMP9moHj3vBBa2BibYorj5rA6oiabAorxym5cxnfsvYLyBzlQUWicSiab2D9TB33RXTyjp2icdDKh225JY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QU1SnJv2CE9hJcGwRrzNia2wQiaJiawHHd3IYnAHE3r6zJ2u91Xotrog7g7TU1qwjoL8McUCdfSfIYOCqIOtNBHO71HjyicHbq4Njw/640?wx_fmt=png&from=appmsg "")  
  
img  
  
像这里面的系统都是可以进行测试的，一般都是可以利用空间搜素引擎进行检索，然后去挨个找漏洞，找到了就可以再去利用搜素引擎进行检索关键字进行模糊匹配，然后打个通杀漏洞，就可以拿到CNVD漏洞证书了。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUYS6LAfvJiaGHrKeEIXQr48oEBn9D7HJTuLr6MqzlF2UCEnTuwrY2ZSPciaMgGibvWzQXdEMyLnWBoZP4X74LKB9BZW5Rm2Ruazw/640?wx_fmt=png&from=appmsg "")  
  
img  
### FOFA检索  
  
下面就是利用FOFA进行检索目标网站了，这里利用空间引擎进行检索的时候，很容易打偏，因为资产网站很多，所以检索语法需要进行多测试，对关键字进行模糊匹配  
  
下面直接检索**仓库管理系统**  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUzqqiayQYnqb9RJ8AgC3o1Lk5icWRfo2fgG7KYjSmqhYaMCnWWnLmOjicc54QEc4LN3b36p7KoNaWzZO5gC6u2JM2b1rv5S0hiae0/640?wx_fmt=png&from=appmsg "")  
  
img  
  
这里需要主要的是这里FOFA还给我们整理了icon图标，可以找对应的icon，然后也是同一系统，然后也是可以打一个通杀的  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXRXDibupC62jZXzoAFGGhXnoMzjFKJyKZXnvh2xC3X0R4cz9iaiajy3LLBsKiaH0ZMYaDV1G9iaS3vfugF5J7KsUzyFcY4ujlHkUmQ/640?wx_fmt=png&from=appmsg "")  
  
img  
  
也可以利用FOFA检索出来的系统名称进行一个漏洞测试，测试出来都是一个系统，也是很大概率会碰倒通杀漏洞的，提交CNVD也是可以拿到一个漏洞报送证书的  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QW3zjqMySwE2F531gzb9qfwCKmZLK1TT8wu2rSFJOYVlHfCZnbP9ASpAygjQJMQNiaXzDo591c5P7ofeAfv5iad9eFKAtmyTibWPc/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面就检索有关**Vue**  
相关的icon网站  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVRzsk0XSQqegxlf5dE8DF8VJsFT1mVthKiaxRufx3DCGxNKJI91PjiaOoGbMd298kRefEshWxqLexqjfRLJpsmXU6gyLibpXamKY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
vue是一个用于创建用户界面的开源JavaScript框架，也是一个创建单页应用的Web应用框架。他的图标长这样，绿色的一个V，如果以后看到这样一个图标，这就是vue框架了：  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWQQ9yn5DLWx66MnS1sVbhIFPMYaWWhrrLdIvoHGoZ91amBlWbbbsTNzHtoavTbJBQZzYHVgBx0z7jfEFcMJVjLTo8C32byjrg/640?wx_fmt=png&from=appmsg "")  
  
img  
## 0x4 漏洞猎杀  
### 漏洞一：弱口令漏洞  
  
这里随便点开一个网站，然后进行测试  
  
这里可以看到里面有管理员登录，那么看到账号密码登录框以及管管理员登录，首先就要尝试下弱口令以及尝试下sql万能密码，看看能不能进去。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXicpj3oicDT91BfstduxjmeONyCKPl5ayAcjfRmkJO5yk1VJgmFwqoB4PSGEE8U4B4shaj63Liciawf1260FzfSO7ngR7YDNibRUtY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
这里我还是运气蛮好的，直接弱口令admin:admin就直接登录进去了  
  
进去以后，那么就可以尝试在网站后台进行测试其他的漏洞了  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWtfCWb1zHXXxnCnRkClWfJkVzC223cPGWyVwmf1iauxia2IZiaV1Va3EAQ1MlmpoS2MwOlC8sKqV8EXiaboHUAibc4FYqJ7HXeibU2s/640?wx_fmt=png&from=appmsg "")  
  
img  
### 漏洞二：垂直越权漏洞  
  
然后师傅们可以退出登录后台页面，来到开始的登录页面  
  
可以看到这里有管理员登录、学生登录以及还可以注册学生，那么我们这里是不是可以尝试打一个垂直越权呢？  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWlT1hTx5lYfAmq7d5e5sWuich37nE89N0ro2iajibpjEdPSJm6xy19OzXnP1Cn9FyvT3mUKLvck4KEeM553tFoNSdBxibN9jBmsHk/640?wx_fmt=png&from=appmsg "")  
  
img  
  
接下来我们先注册一个学生用户，前面我们已经把这个网站的管理员账号密码给弄出来了  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVLg4EcHFnFM2ZbtB2T8jQ4IQozibkvT6IuYBLTQVH6iaiczeBPgVV4b9nXsicNZw5QPpeh9A40lgGBdYYbNTzJh3fp6QZf1AXHQ9k/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后先拿学生账号去登录，再利用bp抓包，看看登录成功和登录失败的返回包的区别  
  
可以看到下面是登录成功的数据包，记录下这个登录成功的返回包code为0，且有token值  
```
{
"code":0,
"token":"1u40ivkgvpvtc1dd2l663zdu249e132z"
}

```  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXyXSEibcSKwwLQHnsOchCSwuuzRXBsmwia1w2VthXTCx0Esmer1nmEiaa7I68yjIKVKoLtysoPEtl4xnRF35wO2DVEy4djnrN4Rc/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后下面再使用管理员的账号密码去登录，且是利用bp看他的登录失败的数据包  
  
然后再使用bp的Comparer功能去对比两个数据包  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVefysDBibnqD9KpiaG4BgQtx8xwFicwmLhibBJBUWACVuK9fo0JzboGYyj0Njs3dWCbFFAYBQcoWfib6PO56Iy4niaKZpmISkHJLMao/640?wx_fmt=png&from=appmsg "")  
  
img  
  
可以看到利用admin管理员登录失败的数据包如下，看到这个数据包，师傅们可以尝试改下msg，里面的内容改成succes，以及把code里面的内容改成0试试。  
```
{
"msg":"账号或密码不正确",
"code":500
}

```  
  
下面是学生用户登录成功和管理员登录失败的数据包对比如下：  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWLehN9VicmibhfFUCQmV9tliaRuSAUSSicWMNOrFbqOaa1xXWaDVJrVDbw3AfF9bic1ULsEjM2PcVpViaT269bPTV07mciaaIRibx7ibvc/640?wx_fmt=png&from=appmsg "")  
  
img  
```
管理员数据包：POST /users/login?username=admin&password=12345 HTTP/1.1

普通学生用户数据包：POST /xuesheng/login?username=pass&password=123456 HTTP/1.1

```  
  
直接先抓管理员登录失败的数据包，然后修改请求包  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVvyU7wvue1xcMNx3GAbexnVc6fADT47Xcw79Utz7VibXFaPRia2ZmBemA92xicfvfHb4AvXicGTibTxVmxpXnMuqibJsj5YJt2zticm4/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后再使用学生用户登录成功的数据包，发送下数据包，更新下token，然后把这个新的登录成功的返回包复制下来到上面的管理员的返回包中  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUUGGUKbTU84EMebZUERbNHx3SnQCQO8Xnyom14QJaGUzQEmmpldRKUJD7mTmDBgj6Rotibp7WY6v8VcFqosz0wI90oUcic8jW5M/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后一直放包，然后就可以直接登录成功了，这样就直接简单的垂直越权成功了，直接登录admin管理员账户了  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWDoubOZ3mpeVomP9qndarxcE7TU9UntY5ibWlBrib2EtRKESIhx5rfNrnY4GbNgdBYzlwIvvzQwMN2bvUUKo8oHbS9BQvZBm4q4/640?wx_fmt=png&from=appmsg "")  
  
img  
### 漏洞三：sql注入漏洞  
  
后台个人中心的修改密码的地方，师傅们感兴趣的可以测测CSRF、SQL注入、以及水平/垂直越权漏洞  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXDn1REy3ALzPric8cscG9k1JjbVJCBjdTn9yfY2Rm9d96D0kJ7ia9MXcsCyOmIrx9N3lLLh6KxhVEScKNgKIfQx29OG5pSV8wlQ/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后在这个学生账号查询框处可以发现测试单引号报了sql注入错误，显示了sql查询语句，说明这里基本上就是存在sql注入漏洞  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUyJUelRIyutRM3EsQN7MLicJLia94O95QxQnS5ibvmDGxBibVibJ9A0ibia1wjOyz9vV2n1tqar6fBeicLFCLO05ZHYaNU9icc87Rmk8S0/640?wx_fmt=png&from=appmsg "")  
  
img  
#### sqlmap一把嗦  
  
把bp抓到的数据包保存到sqlmap里面，然后利用sqlmap工具跑，过程可能比较慢  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWkDR0p1ImU1kLUkdhJsl2NB2BbWxdHqyVRkZnJV6XSJv2raMZicYcogKZc88v1gicqwn8XKz1rFpngGEt5HUszxYeYPudpe4U1I/640?wx_fmt=png&from=appmsg "")  
  
img  
  
利用sqlmap一把嗦的命令如下：  
```
python sqlmap.py -l 1.txt --batch --random-agent
python sqlmap.py -r 1.txt --batch

```  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QW2p64iauXiaQU58Zr34eGrwATkUx8QELfHo3Cn7szB4ibFicCRiaIoaDwdowicQyJ571U9usLMLvzvgNMjJ0rMPyQZiaYRUO5C6TlwoQ/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWzMcrFbQBltPp5A1gG2stricj8Srev6CAGnJZBbMiaeWJNBBdNc4F6r7ACoWkdqzrtvzpplohOU38J3ic7YtwUUDXhz2T9bpian78/640?wx_fmt=png&from=appmsg "")  
  
img  
  
通过查看下面的sqlmap跑出来的结果可以看到，这个网站存在sql报错注入、sql盲注以及时间盲注，可以通过sqlmap下面的提示的url进行尝试  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWaHOSjlAAvwmMMFMmdEVTBlnNQAHDqO6M6pmNtZlqlYVmDBmDluicuQ9BH4xHPRQP2UHs8xUWiau5cPF46eZPJCRvzE6h9ClsfI/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后再利用下面的报错盲注测测，利用手工在bp数据包中测试  
  
利用updatexml()函数测出数据库版本、数据库信息即可  
```
updatexml(1,concat(0x7e,database(),0x7e),3)--+

```  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUPFK5gcGondolTqLicbHPGuv2HqjtHoND25Ac9Bica5msiceO3nS9jKeUFQDkocnSFsR1iaW6bojGQ5YT2oZ9ia0CF1ic4n1LiaWNzTY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXUeO7T7feerZHz3s93gxkLRebiar11icvfQfOuEDvygQfKasgC5frz5icqstyL9v1JMddT0hmoKriaW7eY4EMIVCTruPlSrVobmvw/640?wx_fmt=png&from=appmsg "")  
  
img  
## 0x5 垂直越权漏洞通杀  
  
因为刚才的系统都是我再检索一个公司旗下的系统，所以我们可以尝试下找找这个网站的关键字然后进行模糊匹配，一般常利用JS或者网页源代码里面比较特殊的字符，然后利用空间检索引擎进行检索  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXYbnnoqb3WvSdfw04hQCrSZrES3B2x3G4s7n3Z410l1bsoz1CrQfSYZh6MuWxGZsVSzlfmaDdTgdFP5icrHTkSDI8EuwUg4LRI/640?wx_fmt=png&from=appmsg "")  
  
img  
  
我这里直接右击查看网页源代码，发现这串字符串比较特殊，不出意外的话是可以利用FOFA碰出比较多的相关网站的  
```
We're sorry but mas-creator-admin doesn't work properly without JavaScript enabled. Please enable it to continue.

```  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWJFv5k0oHv0wfwrvPAGLtmML5RNo3r8Ze5XbZfKuHkicTO97dLRr5DsiabLOqXelsl3egSWKkSUynGlCn6FD95nMILMFbmaSeqg/640?wx_fmt=png&from=appmsg "")  
  
img  
  
这里FOFA匹配出来了很多的icon图标，我们这里直接利用刚才的**Vue框架**  
进行测试  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVMYP72jkx3P8KnteBKGLKS4JxwM5kcDN0DUGr0rzh9EGicuAJsdT3ZM6RqqhF3rafBA87qbibIY3rBr23am31tnmtTOvQLBasiaQ/640?wx_fmt=png&from=appmsg "")  
  
img  
  
匹配出来了318条独立的IP，那么我们是不是可以像开始那样测试，开始先测试下弱口令以及SQL万能密码看看能不能登进去，然后再在登录后台进行测试下sql注入  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWWSib2lC4nxic4wDSouUU0207ZSTRUVpwdhmsCJ3tk6veZZhzNSByPotibwwvickwkoPcusgsiahtsMZ1W0qZAU4mzGHTM2yq38oKk/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXs555Ia7kMQFU6Ecx8JB8Xjib4aHl7pN9iawFUL4yr1oKnSuiaFgNtibUcsiaGRLPic6ueGVcHXrvWmJxvBWJQYs5RkxIJHPfRN18MM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
包括使用鹰图，可以发现检索匹配成功的IP数量更加多，那么接下来我们就可以提交CNVD漏洞了，后面我这里提交了多个事件型CNVD以及通用型CNVD漏洞。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QV3ZKYSibNM4Q0jQicibxS5W8ncLO0doyegx3kN5rnS5KhSWAwDfxGSn39vVePq9pP6U2h4MCeN2ib4rlqKYwvoWmDybrIL19Gib8qw/640?wx_fmt=png&from=appmsg "")  
  
  
02  
  
0x2 培训课程介绍  
  
26  
  
**SRC漏洞挖掘培训课程**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/6cIuvSQkkicOHhYFkQLTibYAMUR9rfZ9eUrI78toIC4V2304G909O6s6CnVrAGiaYLEJM9XuUARhzNfxCtYKQfQ83wfPSlqpshSScfoYzSKzgY/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&watermark=1&tp=wxpic#imgIndex=4 "")  
  
  
**1.课程价格目前是425（后面也会随着人数越多，涨价）🌟师傅们还可以上车补票，冲冲冲！**  
  
**2.报名成功送知识星球一个，拉内部小圈子交流群+SRC直播通知群！✨**  
  
**3.一周2节课程，直播+录播形式，课程内容大家可以看课表，目前是第一期，一次报名永久无限听课！❤️**  
  
**4.目前是第一期课程，后面比如说开了二、三期，都是不用在花钱的！**  
  
**5.上课结束后，会把视频录播+课件笔记一起打包发直播群！**  
  
**6.哔哩哔哩SRC课程公开课，链接🔗直达：**  
  
**https://space.bilibili.com/642258933**  
  
SRC课程详情🔎：[神农SRC 漏洞挖掘实战课：从 0 到 1 成](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
[‍](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
[为赏金猎人](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247503167&idx=1&sn=2654bb0ed9382199d7480aba559ea490&scene=21#wechat_redirect)  
  
  
内部小圈子知识星球详情🔎：[强烈推荐一个永久的SRC挖掘、渗透攻防内部知识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QVcCkxIUpaBmNic17zibGfXMWrr9z89gE0DFtbOu3QYzD5d62zsp6qwc38Pssk60mLq8VKthcMOmctVlHU716S5G4KYmrKVrEj5c/640?wx_fmt=other&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
开课两个月时间左右  
，课程目前已经  
累计加入了564个学员  
了，课程培训招生任火热持续中，师傅们  
对于我们课程感兴趣的，想要学习技术，找工作的可以咨询我报名  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QV7XwSH7CPSibZnIOSr29icvpiaAtwNqGaBmwqHAFYQQCjPKCNJJB4YFGI0rPflk596yoozlfJkfU7v58Ccz9foxZqBiboVzyfwrH0/640?wx_fmt=png&from=appmsg "")  
  
课程培训记录📝，每次上车在1-3小时之间，上课包括课程内部群大家  
交流氛围很好！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVITh8VvNrnXLk1uuBSYeYtdOxg96gnicdvmpa2GhwOVTvBGzKEA5ktu7C7wqFYWWRuYZgKmsI8TAoYFia1uC8iaiaLvUNXS7JMMqU/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18 "")  
  
课程上课笔记课件📒都会打包给师傅们，笔记都非常详细，很多几k价格的培训机构哪怕是课件笔记都没有的，我这里都是下课第一时间把  
录播+笔记打包发给大家！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWbRV4mBn8GZHrvHocPMYYcBuAM3gyIKOM0SicBWQhywMehkXInvEerRLySOPPMzEmM2GLSlOMFREx6QItqtCgCibGs2MeY6yvu0/640?wx_fmt=png&from=appmsg "")  
  
平常也都会给学员进行一些项目发布，包括后面的  
工作、护网内推等，经常上麦交流，大家互相学习，简历优化等。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXvjjkgJibDEUhdDjErjibiangGsN0rqb0Av59xfyxBbDrTMNdfIAhNXlx0HQKvxIVBIEGAAbYrEENzd77j65asejlD4a50Sb4U7o/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20 "")  
  
SRC漏洞挖掘课程培训已经两个星期了，期间也是创建了  
“回本小群”，希望学员回本越来越多，创建这个群主要是鼓励学员学习进步，以及不定时发小项目！  
  
最后也是希望大家都可以赚钱，找到好工作🎉  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU32N92BK2LQ5C07q2P5vVQN2rOm3sic7piavVJJLlA3AGnoBlqhQ93M0BxMFtMwgxeJ2x81FLECQ4ZgrwXC6yiaNeE3PsOibfWeMY/640?wx_fmt=png&from=appmsg "")  
  
培训时间不长，感谢🙏师傅们的  
喜报  
，很开心看到师傅们给我分享自己的成果，  
希望师傅们越来越强！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUMAtEWv3xXZPDsGBRhESmwGRciaasCGibU8TtbP2U0YVZPBdf5tlLqpWAtQKBh5oFwgETyvicKBeW1JSsekAyJ5cbRlSdjooQkSM/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=22 "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUrS4N68nZ0EyE76Wkib7ZDrpnZWw2Q1RJQvFEdIOu5XvFGCwpz9lziabKyo9C9d5ZiamibuSXlibhXLHb7b8QJhqEIs3hXvqktkkyA/640?wx_fmt=png&from=appmsg "")  
  
  
平常也会分享项目，下面是一些  
学员项目成果  
，群里报课的学员都是不抽成的，主要是帮助学员进行  
回本  
，  
让大家都可以进步！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
上课结束后，会把  
视频录播+课件笔记  
一起打包发直播群  
  
「神农安全」知识星球目前已经  
累计1900+网络安全爱好者的加入！  
  
后面也是小圈子做大起来了，师傅们也都喜欢看我文章，想着给大家教下src漏洞挖掘思路，所以自己花了很长时间做了✨  
课件和课表，都是纯自己手搓的，大家也可以看下课表的内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthM2sjuWQFbmvWv79V058KwI0DswFF9LysewGtULj81Vp5bX9nTEK78A/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVhliaOc71FnQLZjEUB2QiavqaRdiaaAN25Gb1HNADIy0cYvIIHC46za7Ab6sibRKvKG2tbJBxqrOGyczqWF44LQOKllnZXE6PU5iaE/640?wx_fmt=png&from=appmsg "")  
  
03  
  
0x3 课程特色  
  
课程  
主打真实，  
一线SRC漏洞挖掘师傅是如何学习和挖掘SRC漏洞的，让你真正了解SRC漏洞挖掘，助力在岗人员和大学生的能力提升，掌握新的技能树，为下一次  
跳槽涨薪做好准备。本  
课程内容覆盖企业  
SRC、众测项目挖掘、护网HVV红蓝攻防技巧、CVE、CNVD、EDUSRC等平台通杀案例技巧挖掘方法。  
  
本课程  
适合人群  
（光看不挖啥也不会）  
```
1、想从0转行入行的大学生或自学者
2、想从CTF比赛/Web或SRC进阶到项目实战的选手
3、想参与项目/找工作/提高收入的转型者
```  
  
课程价格：425元  
  
报课成功的师傅们直接免费送内部小圈：一个知识星球+内部小圈子交流群  
```
1、课程价格真心实惠，绝不割韭菜
2、两三百的课程价格让你体会大几千的培训课程内容
3、带着大家从0到1，本人上课坚持手搓课件（实战案例+知识体系）
4、拒绝使用PPT演讲模式（无实操，很枯燥）
```  
  
直播培训教学方式  
  
课程  
一周1-2节课，课程特色涵盖直播多人上麦活跃回答，直播过程中有问题随时解决或私信我。  
拉微信群：一个知识星球内部小圈子交流群+课程培训直播通知群。有项目/工作/护网第一时间内推报课的师傅，  
一对一简历优化，助力在岗人员和大学生的能力提升。  
  
一次报名每期均可永久学习，并且赠送内部「神农安全」知识星球，一对一永久解答、无保留教学！  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
课程均为线上交付，报名成功后  
不支持退款  
  
内部小圈子  
（知识星球+内部小圈子交流群+知识库）  
  
对内部小圈子感兴趣的师傅们也可以看下下面的这个  
跳转链接，里面有对小圈子的详细介绍，报名课程成功的师傅们直接免费送一个（直接点击下面直接可以跳转）。  
  
[强烈推荐一个永久的SRC挖掘、渗透攻防内部知识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVTgWHud84yTCoykuHLJU9nbwIgQ6QMWwxCjwKNhClicETT9kYH0X5NBpmNVVQQxN9GvBGRQJCZZ4xDnW5nmN81Hq4DqNeMvod0/640?wx_fmt=png&from=appmsg "")  
  
讲师介绍  
  
id：一个想当文人的黑客  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthqvGuVSjkR43eeaNibf1KbGU4nia5ibXFYpTBFeAbQewTq43IqJHIMhhhg/640?wx_fmt=png&from=appmsg "")  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
04  
  
0x4 第一期挖洞培训课表内容  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWVMibw6HiaoHUxJgNHUVfqCicbGSauW0QQBjLcC9H4gdOEyW3ZzLjTfyYibqGdaSueO9GDbbyicmckia2Kg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap086iau0Y0jfCXicYKq3CCX9qSib3Xlb2CWzYLOn4icaWruKmYMvqSgk1I0Aw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**内部圈子介绍（报课赠送）**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap08Z60FsVfKEBeQVmcSg1YS1uop1o9V1uibicy1tXCD6tMvzTjeGt34qr3g/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
  
  
**圈子专注于更新src/红蓝攻防相关：**  
  
```
1、维护更新src专项漏洞知识库，包含原理、挖掘技巧、实战案例
2、知识星球专属微信“小圈子交流群”
3、微信小群一起挖洞
4、内部团队专属EDUSRC证书站漏洞报告
5、分享src优质视频课程（企业src/EDUSRC/红蓝队攻防）
6、分享src挖掘技巧tips
7、不定期有众测、渗透测试项目（一起挣钱）
8、不定期有工作招聘内推（工作/护网内推）
9、送全国职业技能大赛环境+WP解析（比赛拿奖）
10、十个专栏会持续更新~提前续费有优惠，好用不贵很实惠
11、每日内部资料分享，内部圈子资料1000+
12、联系圈主获取：内部漏洞知识库+圈子使用手册+内部圈子交流群
13、VX：routing_love，技术交流+疑问解决
```  
  
  
**内部圈子**  
**专栏介绍**  
  
知识星球内部共享资料截屏详情如下  
  
（只要没有特殊情况，每天都保持更新）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWWYcoLuuFqXztiaw8CzfxpMibgpeLSDuggy2U7TJWF3h7Af8JibBG0jA5fIyaYNUa2ODeG1r5DoOibAXA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWUw2r3biacicUOicXUZHWj2FgFxYMxoc1ViciafayxiaK0Z26g1kfbVDybCO8R88lqYQvOiaFgQ8fjOJEjxA/640?wx_fmt=png&from=appmsg "")  
  
  
05  
  
0x5   
优秀学员报喜  
  
下面是最近两个月培训期间，很多  
优秀学员进行报喜，看到师傅们有收获，也是感到很开心的！  
拉回本小群，就是为了促进大家学习，在群里发学员成果，也是为了让大家学习优秀的师傅们。  
  
加油，你我皆是黑马！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWK7cWZiaiatmAfXNWyj732Fib2ntZRWjFR4rfftXb2LoeicNAMZPrbBJFR2Ybf9XmWpqOiammYbiaxoQN5q5XRXo5xPicld4PhTtPtCI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU6ibZutPq43zUiap7IgDmJq7kwUKJBCa2IDujYiadMJfe9fFH9DOfUEOM2TibibYRuFiahDqMnBX1MVjLw5XIdNDSuR5P3g7XibaUkBo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVz2wFpVfer0uAFVpLKyicMaaLkmJDdg5bWnOotuzN3S9r2FMKpEKrJy8ND7icWVzNgqyYS2J6XElVN43vGca4X6HcEqapwGcNX0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWLzyCczAqyEgBN7ibpfzJQonkfJ9PeHWlbbz7pBG5xmiauw81a4dS7EkcoG33YvUTiawb2hnOrfCViaAs0kN15Qv88b8xbCB82JrQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWR2FjdMjH8n9LoMESXkIibV1hSJias6y1uXYFPcNJS7uVVCCym2QicIdp6N1q3QicfwkqtVpsWe8Ld1xfQiagucjrgl8ibrJzII2LGc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXB1O6Fx3ia62NNWITh9vUQaEKp7epibLWeEsdobibvBvqNDoTCAvfyQFHw597O24naJAIpM4QALgfqMWWc4E1KHrxBoaGRxE4Ajc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXnjwIRWjJOVSuN4X4HjmEFtCVqCHZ05M77sXqzmVjibaJbLUw3ApOuz7iaH8OCCnRmTRYVtKC5NajGKVkI4pnKZsJaj0T4iaYibq0/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUm9nL5FsCxBKWrhMmwpgVvr7x7IfEu2IQPQuXMiaJZSHDyNDib5qoA3tGvfW8TUfShOKvIDuia32oSqb9YN1ghaxaKAicW6uKxrvU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWRdtEUY2aeAZh34wDle515j7UwnibFQeCibWSeDKGnIZ2YH5VGX64cYeXgPGdCwHLKdsMY07EIVliapxh10gzQ2EO3bks7bxhmVs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXwfrgic5XLseOxkPOWkjm1yicAW2ZiaAqzxtbjPok4Yhic2Wiblic93SSGN5BtT77AFuZt6ySuRL09icqIicPuOUUbL5NbWgMCHgLictiak/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWpzNI7sn0dCdaebEyMXY3Gx9tkNjicAiaEctakpWVtl4evP95MOl9ErgT9NYQiaF6dCt0FGFPziaVxz9QuE5SsiagkJYNicRR18lVb0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWzKmnCemQquDBf5uFwcpaG7RQqSPVwKqOKjrFxkCicFVTh6ngv3LOGDY1InR2mj0D6iby2A3Adic9U6MMsJ8FIo2wwxzPswjHsIQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWdXaOziavIFibdPXHERG5Vkz13uwaiaGO3SJqvllW0tPxV0n4bmGlAQptLjxR1z24cLAMXqE2KqUb9WwnDSBKj2GYAW0zeHWX1YM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU0zKGNkZEg53VP15XfI98bHZLibNbia3JDPEVzoe6wscFq3JY2UibD6Esp0Xz4rPY3VIp3xsT0ocSmGyjuASribI6eRiaMoNSyIh4k/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXQJcAmd5OVIoq1znICoW1Sy9hTsxpwe9HsiceptQ58rFYCNibBonWQQEH1TB3IrMASTQ3icWHwRd7JDtBwAwibWEGZxvIxeseTiaIY/640?wx_fmt=png&from=appmsg "")  
  
  
  
**神农安全公开交流群**  
  
有需要的师傅们直接扫描文章二维码加入，然后要是后面群聊二维码扫描加入不了的师傅们，直接扫描文章开头的二维码加我（备注加群）  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/mcko8AHj6QXdGu9sxc7PwZM3VExWm6kWEI6hzXSia0xM33xHqZFaXm9OZ4ibHs1Y91CXUFbV37ZA9KXHBBBmNpMPY7MrTnRCichjLE6VKDic1dI/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/mcko8AHj6QV9grs7NOhSTCfTpCc4xrxdnlISIReNNCKR2EOyWvhMpyIzbma8nuelSg8LicKF5yYZ7hgyODlWgMmhViaE8Ahhs7PZlnmA0VFcY/640?wx_fmt=jpeg&from=appmsg "")  
```
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/b7iaH1LtiaKWW8vxK39q53Q3oictKW3VAXz4Qht144X0wjJcOMqPwhnh3ptlbTtxDvNMF8NJA6XbDcljZBsibalsVQ/640?wx_fmt=gif "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
**往期回顾**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[手把手js逆向断点调试&js逆向前端加密对抗&企业SRC实战分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247495361&idx=1&sn=48283073b325e360823da8dec27a7508&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[浅谈src漏洞挖掘中容易出洞的几种姿势](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247489731&idx=1&sn=c3a5ef01648fad496ecda36b653b6e21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[HVV护网行动 | 分享最近攻防演练HVV漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247488672&idx=1&sn=493bb70011a02eb971ff1b74c733f1d9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[攻防演练｜分享最近一次攻防演练RTSP奇特之旅](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492377&idx=1&sn=a94ad30e30e08bd96e888dad744e9814&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[JS漏洞挖掘｜分享使用FindSomething联动的挖掘思路](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492315&idx=1&sn=88991e98058a277e267a9a79b8518e16&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 从jeecg接口泄露到任意管理员用户接管+SQL注入漏洞](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493292&idx=1&sn=611fd43361089a30e5f7bcda21274b95&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[分享SRC中后台登录处站点的漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247485439&idx=1&sn=3fd7e4cef57edca8e73104f8af38fc05&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[企业SRC支付漏洞&EDUSRC&众测挖掘思路技巧操作分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492839&idx=1&sn=b9781f60580c1da8e2151166f0494ba5&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 分享某次项目上的渗透测试漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493495&idx=1&sn=791bebc6faa651cc3c585c2f5f481d21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】分享云安全浪潮src漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494877&idx=1&sn=2d00c0f651fd7375e881be86638e53ce&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[实战SRC挖掘｜微信小程序渗透漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494468&idx=1&sn=f0da4b4ff7763cbb83b858fb5a8964f9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[综合资产测绘 | 手把手带你搞定信息收集](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493749&idx=1&sn=d2e0febcdcf9dcd8aa44be0d43b51936&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】针对若依系统nday的常见各种姿势利用](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493489&idx=1&sn=d3ef10a1ae3b8c161d7174cb42702fac&scene=21#wechat_redirect)  
  
  
  
