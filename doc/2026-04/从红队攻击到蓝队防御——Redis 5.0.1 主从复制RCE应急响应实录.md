#  从红队攻击到蓝队防御——Redis 5.0.1 主从复制RCE应急响应实录  
原创 SKillLab
                    SKillLab  SkillLab   2026-04-22 23:37  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/giaH4bTW3BOn7HPhfCMVxA0xejnkZnrB7IzGmjhJgJiaZOqicg7CFjrT9RpRjGhAgRjQmzq3mxicx4Omb2qFBFLP4Q/640 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yE70PlBSEozVzTlePtQiashoYBKamZxNpJ51KxAQrTo1uNYOmLQxWs5GWialAxToZvVxIm7ic31Bw4WEM8icL4dDog/640 "")  
  
本文内容仅用于 OSCP 备考交流  
  
互联网不是法外之地，请严格遵守《网络安全法》  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0R0gH979OQm5DPYX5ibxXe5qQhhHPuj3jWWRNSfSJ4IRal5yNkjTjcDVezJ3y6xzHYqlVUhwTW1HvqX5CFzmlOg/640 "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qDqAuCnIXITRGeD5aouLKbXRJia0uSyY5EPCes7mMPeKNc22Tv4trYWibW7ta9xujbnmSBa04z1kIyFd65Fa6GqA/640 "")  
  
  
  
环境背景与风险评估  
  
风险等级：高危  
  
核心漏洞：Redis 5.0.1未授权访问&主从复制导致的远程代码执行(RCE)  
  
攻击手段：恶意共享对象(.so)注入、系统命令劫持、SSH持久化后门。  
  
攻击路径：利用未经授权的Redis 5.x主从复制漏洞实现RCE，植入Crontab定时任务，篡改系统常用命令ps隐藏进程。  
  
靶机链接：https://xj.edisec.net/challenges/22  
```
任务环境说明注：
样本请勿在本地运行！！！样本请勿在本地运行！！！样本请勿在本地运行！！！
应急响应工程师小王某人收到安全设备告警服务器被植入恶意文件，请上机排查。
```  
  
  
01  
  
应急响应整体流程  
  
2.1攻击者IP溯源分析  
  
通过本地PCSSH到服务器并且分析黑客攻击成功的IP为多少,将黑客IP作为FLAG提交;  
  
因为当前服务为redis应急响应，所以我们应该优先查看/var/log/目录下的redis日志。  
```
cd /var/logls
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREobFhhzJR2iaje65TrlH0vrtMG8tURZ2liblUiauXJZIiacxkoJXiaibLxhOS0HYlrHutLVeibggy5TlZpbUov6YFHLHwWXnxDGTjVibLJ0/640?wx_fmt=other&from=appmsg "")  
  
对日志进行查看，发现当前redis服务版本为：5.0.1，存在主从复制漏洞，攻击者一旦利用成功，可以直接获取系统权限。  
```
cat redis.log
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREobxWxNW77d0as6eV5Ckia8ttv8y2HD48tggku4shPMBIl251uxicZLiaVLRUqVWbJRvFicvVFLS8RIh7chB4GH3KGqdURfSpyt2Cqo/640?wx_fmt=other&from=appmsg "")  
  
对redis的日志进行分析：  
  
05：33：15攻击者开始操作主机向192.168.100.13:8888发起连接，但因服务端口不存在或防火墙不通，导致连接请求持续被拒绝。  
  
05：34：03向192.168.31.55:8888发起连接，依然没有成功。  
  
05：34：35向192.168.100.20:8888发起连接并建立通信，开始进行数据同步，通过主从同步，把恶意插件（exp.so）传到了机器上。  
  
05：34：37加载/exp.so文件进行攻击，获取系统权限。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREoZdUcGrsia66peQWEe67MqZ53S5zwIsZsIy4Mc6mF5eOTp6kAA5jyLic2bqQuafNXLFWHbFyUMicJDSUdzYhsmj2licvJ2SmblCUPk/640?wx_fmt=other&from=appmsg "")  
  
对redis日志继续深入分析，攻击者构建了一个由多台受控主机组成的攻击矩阵，其角色分配如下：  
  
控制端：192.168.200.2  
  
在日志中显示，所有的SLAVEOF切换指令均来自该IP。这表明攻击者已控制此机器，并将其作为内网横向移动的跳板。（SLAVEOF是一个极其危险的命令。它会导致当前数据库立即清空所有现有数据并下载新数据）  
  
失陷主机：192.168.100.13、192.168.100.20、192.168.31.55  
  
也就是说只有攻击者控制了上述4台机器，才能做到用192.168.200.2进行攻击，使用其他3个ip作为服务器让主机进行主从文件复制，且在日志中没有看到认证信息，证明该redis服务存在未授权漏洞。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREoa2ddcwXtDG83zwntH4MFQmTloSuxsYicSXTBGMJBjvUQLFohG18wT8Z7CB2SuPBrBc9kEbmZcmAVpmEQjicyNLpbhQZ9zfJELYs/640?wx_fmt=other&from=appmsg "")  
  
虽然192.168.200.2发送了SLAVEOF控制指令，但实际投送恶意Payload的源IP为192.168.100.20。  
```
flag{192.168.100.20}
```  
  
2.2恶意文件取证  
  
通过本地PCSSH到服务器并且分析黑客第一次上传的恶意文件,将黑客上传的恶意文件里面的FLAG提交;  
  
根据日志记录，攻击者将恶意动态链接库命名为exp.so。使用find命令进行全盘扫描：  
```
find / -iname *.so 2>/dev/null | grep -v '/usr/lib'
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREoZT73LngE3JX6VYNheuXIC6oB9zxREcibra9seD94YqgSeU1BwibQ35DI60og6Oiclpicb1z7TVplLw8uljZcF2WWCsbWQkgnydSgE/640?wx_fmt=other&from=appmsg "")  
  
  
使用strings工具对二进制文件进行静态分析，提取其中硬编码的字符串：  
```
strings /exp.so | grep flag
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREoY1qn577f5qqRkDMUY6X5zsu30WgG2jUdnTGFxiabmaLb8icR15iad2YcOJlH3ctEjubsicpDOzDbfwRlKKGbxs9kGC1y9iapZaU1cY/640?wx_fmt=other&from=appmsg "")  
```
flag{XJ_78f012d7-42fc-49a8-8a8c-e74c87ea109b}
```  
  
2.3持久化与反弹Shell分析  
  
通过本地PCSSH到服务器并且分析黑客反弹shell的IP为多少,将反弹shell的IP作为FLAG提交;  
  
这里本意是直接找到外连的地址，然后进行反查，判断是什么程序在进行连接，没想到执行ps-ef后，感觉怪怪的，出现了格式混乱，大概率是命令被篡改了并且在文件的最后出现ps_-ef这种非正常指令，再一次验证猜想。  
```
ps -ef
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREoYAuV8Kt34rrxukOpEAuPsGZBnwIa3lbNlicze9PTKX6ibBQ5laicLID2UtMH0zoLMWicvqzlFTuord9KicFFRAdDpicsaWLNu9DvjY0/640?wx_fmt=other&from=appmsg "")  
  
于是进入/usr/bin目录进行查看。  
```
ls -alh | grep ps
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREoaqia0sYbN3RhOLAUMEyVt80ThVj7ialuibYWqsFzg15k166o2O1Ax8xsGWom5VXGgTDzibUic2ZU3OCHKNTIZ1J6HJiaiavFPic8cy3SQ/640?wx_fmt=other&from=appmsg "")  
  
发现ps进程过滤了threadd程序，并且将n作为分隔符，进行拆分（这里应该是写错了，实际应该是以\n为分割符，这样可以达到隐藏的效果，不容易被发现）  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREoaFvjUwIoSAlFjUHc0DWVDV7MIrFicuj7RoAHKFKyBpO70phuurqwp22vIIqMb5NibibibtpQCZbPxEtbN1hviaD95INqZgWSBBP0ps/640?wx_fmt=other&from=appmsg "")  
```
root@ip-10-0-10-4:/usr/bin# cat ps
#/bin/bash
oldifs="$IFS"
IFS='$n'
result=(ps_ 1 2 3|grep -v 'threadd' )
for v in $result;
do
        echo -e "$v\t";
done
IFS="$oldifs"
#//c195i2923381905517d818e313792d196
```  
  
<table><tbody><tr><td data-colwidth="0" width="0"><section><span style="font-weight: bold;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">代码行</span></span></section></td><td data-colwidth="0" width="0"><section><span style="font-weight: bold;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">功能描述</span></span></section></td><td data-colwidth="0" width="0"><section><span style="font-weight: bold;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">存在的问题/备注</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">oldifs=&#34;$IFS&#34;</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">备份当前的内部字段分隔符（Internal</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> Field </span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Separator）。</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">常见的</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> Bash </span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">技巧，用于后续恢复环境。</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">IFS=&#39;$n&#39;</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">意图将换行符设为分隔符。</span></span></section></td><td data-colwidth="0" width="0"><section><span style="font-weight: bold;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">错误</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">：单引号里的</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">$n</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">只是字符串。正确写法应为</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">IFS=</span></span></section><section><span leaf="">\n&#39;</span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">。</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">result=(ps_ 1 2 3|grep -v &#39;threadd&#39; )</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">意图执行命令并将结果存入数组。</span></span></section></td><td data-colwidth="0" width="0"><section><span style="font-weight: bold;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">严重错误</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">：</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">ps_</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">不是标准命令；且</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> Bash </span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">数组赋值不支持直接在括号内使用管道符</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> 。</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">for v in $result;</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">遍历变量</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">result</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">。</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">如果</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">result</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">是数组，应写为</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">&#34;${result[@]}&#34;</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">。</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">echo -e &#34;$v\t&#34;;</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">打印变量内容并加一个制表符。</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">-e</span></span><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">开启转义。</span></span></section></td></tr><tr><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">IFS=&#34;$oldifs&#34;</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">恢复原始的分隔符。</span></span></section></td><td data-colwidth="0" width="0"><section><span style=""><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">良好的编程习惯。</span></span></section></td></tr></tbody></table>  
  
进一步检查crontab，发现每分钟执行一次的反弹Shell指令：  
```
crontab -l
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/wIGVBqrREobliaT1J5XS0MjYTAgeQZRfY1t6bZpX9G5wSAfzvjtscjKGicWX3WX9NRufw7CB1fiaP0O7Xc4gq7Y2gDYGOXkdVbUOYIibne843Ik/640?wx_fmt=other&from=appmsg "")  
```
flag{192.168.100.13}
```  
  
2.4工具溯源与黑客画像  
  
通过本地PCSSH到服务器并且溯源分析黑客的用户名，并且找到黑客使用的工具里的关键字符串(flag{黑客的用户-关键字符串}注关键字符串xxx-xxx-xxx)。将用户名和关键字符串作为FLAG提交;  
  
攻击成功后，攻击者会在服务器上留下后门，所以优先查看是否有用户新增或者大权限用户，通过结果判断明显没有。  
```
cat /etc/passwd
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREoa6wWFO3NGZibOCjzxFWfS6wRa2WiczQjrtM5Micr5nqS57Xiauoyc76whnfM1wmhNvTibEWbs7CmMYUwOXmH85q4acaMqwqbpa7wqY/640?wx_fmt=other&from=appmsg "")  
  
在.ssh/authorized_keys或相关配置文件中发现异常公钥/用户名备注：xj-test-user。但题目是使用工具中的隐藏字符串，所以需要进一步分析，redis服务在github中存在很多利用工具，通过对用户名及Redis RCE攻击方式进行关联搜索，锁定攻击者使用的工具为redis-rogue-getshell。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREoblgCSbwianOFh0vhjia0pxFXWricHwZcaoUMqic5DbhuicsMcDGBicQmEITzHRaEMUOujm6FJwmgRYTSezAuxAQQuvwstFHsPibQTFT8/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREobOITzKS06ibuFibSzibM8o4m3diaHETEakqQJqt38KYcmxKHibOPnqbPYgfq3VVBibibzmYiaeInG4rGPVk2muMte6DIhxqaHaEahLFYQ/640?wx_fmt=other&from=appmsg "")  
  
通过翻阅，发现flag隐藏字符串。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wIGVBqrREoZFeLxg0zmUAIlAjBvgeVLpPbYWaoCeue5ib8w8icclbnqOs99TSfkK5ozaQmUFKTCrxThwQL8Jxkmia7nGPX6rEFFRHZ3xIAdfJQ/640?wx_fmt=other&from=appmsg "")  
  
通过提示的flag拼接，获取了最终flag.  
```
flag{xj-test-user-wow-you-find-flag}
```  
  
2.5命令篡改深度取证  
  
通过本地PCSSH到服务器并且分析黑客篡改的命令,将黑客篡改的命令里面的关键字符串作为FLAG提交;  
  
基于第三题发现的线索，回到/usr/bin/ps篡改的脚本，攻击者在脚本末尾留下了一行混淆后的特征注释。  
```
flag{c195i2923381905517d818e313792d196}
```  
  
  
  
加固建议  
- 配置requirepass强密码认证,修改redis服务默认端口，并绑定127.0.0.1，禁止远程访问。  
  
- 利用rename-command禁用FLUSHALL,CONFIG,SLAVEOF等高危命令。  
  
系统完整性校验。  
- 使用debsums(Debian/Ubuntu)或rpm -V(CentOS)校验核心二进制文件。  
  
- 清理异常的crontab条目。  
  
- 遵循权限最小化，严禁以Root权限运行Redis服务。  
  
  
  
