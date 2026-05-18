#  集成数千漏洞攻击模块--全流程渗透测试框架MSF  
原创 Kitty队长
                    Kitty队长  网络安全研习社   2026-05-18 06:31  
  
> **免责声明：**  
涉及到的所有技术仅用来学习交流，严禁用于非法用途，未经授权请勿非法渗透，否则产生的一切后果自行承担，如有侵权，请及时联系删帖！   
  
  
一、  
介绍  
  
    MSF全称是The Metasploit Framework，是全球使用最广泛的开源渗透测试框架，由开源社区与Rapid7公司共同维护  
。该框架集信息收集、漏洞探测、漏洞利用、后渗透攻击、持久化控制等功能于一体，是安全研究人员和渗透测试人员不可或缺的利器。  
  
    MSF目前附带数千个已知软件漏洞的专业级漏洞攻击模块，涵盖Windows、Linux、macOS、Android、iOS等多平台漏洞利用场景，因其强大的攻击能力，被安全社区幽默地称为“可以黑掉全宇宙”  
。  
# 二、背景  
  
    在渗透测试过程中，安全从业者常常需要在不同阶段切换多款工具：用  
Nmap扫描端口、用搜索引擎收集信息、手动编译漏洞利用代码、单独搭建Shell控制环境  
---  
传统的手工渗透方式不仅效率低下，而且对技术人员的综合能力要求极高。  
  
MSF的诞生正是为了解决这一系列痛点：  
  
l  
多工具切换繁琐，缺乏统一的操作平台  
  
l  
漏洞利用代码分散，需要手动编译和调试  
  
l  
后渗透阶段工具链不完整  
  
l  
不同平台、不同漏洞类型的利用方式差异巨大  
# 三、Windows环境下部署MSF工具-下载  
## 1、工具下载  
  
    MSF在Kali中自带，Windows版本  
可在官网  
进行  
下载  
，  
  
    下载地址：  
 https://windows.metasploit.com/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaaoakSnibxS1Ip6txWpM2CQpTCIxlgTUvowZ1QWa7wG66AibIjcZyRHicmIMxrJBgEK2Ilg7KqBkJibj9VxdjeEvK8FACLDUUdgFlc0/640?wx_fmt=png&from=appmsg "")  
## 2、工具安装  
  
    注意：  
需要退出所有的杀毒软件或者说把你的安装目录加入到白名单。否则会报木马、溢出程序、脚本病毒、风险程序、黑客工具等的问题，还会隔离甚至删除这些文件。这样会造成软件功能不完整，安装之前一定要关闭杀毒，加入白名单  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaaq6AHmpr1bRjNoNRqqLIcyMdP6Y4CwPQcf7KsoU8PonOzKhJ7hj192fbibU91xdrp3Jv30Fp8QWDsibEe22uAKmgQgOzp1SIGq4Q/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaaq9aNZBrjUqU056GhJZQ6upNwJyptHp2yOqwqNbcJhZxoqRXCIicia9e6ZicRvwjicia2kOPvJIeDsTzj5EWFr8JtzY6Ie9fib4fNCYE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaapSxelD5yHB9Qntk7zGJ71Sbtk4Z4DbbbrXOmZbnr2AYGbwFJcpn7e2hHM3uU3MK2fccOmj5iaVPibyVgibDTKz4YLcrh537FoQJA/640?wx_fmt=png&from=appmsg "")  
## 3、添加环境变量  
  
    安装完成后，  
默认安装在  
 C 盘中，进入 Bin 目录即可访问 MSF  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaaqNHTPWic5VX3ZMlCpgRe7WRQuKVg8IG19yYnTZ4ia81ia4RG2Kfteuq2AL0AMaswodF3leBHl9N1uLyzo1sT0QAsn7UOjvkbhdLY/640?wx_fmt=png&from=appmsg "")  
  
    执行添加环境变量  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaarBLOTx8GhBd8R06bPKFl604mu4Wdys5TPEJjiaf3LpDVXArFiaFU7vcDAX3BIGgx4hLz7EWtAMaJdoD7TVAJenF9ibFAyP4ialxx8/640?wx_fmt=png&from=appmsg "")  
  
  
    命令如下（路径按安装路径自行更改）：  
```
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path /t REG_EXPAND_SZ /d "%PATH%;D:\metasploit-framework\bin" /f
```  
  
    CMD执行msfconsole即可进入MSF界面：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaapTKiabo3lFbu5tYVvAyJNl65pe243KibMiaJjHA6ab9u9F2lYQJVlRM75Ps4X21mc9FavkfsT5OCMKPHynaicI2aSEFRubnGibELUo/640?wx_fmt=png&from=appmsg "")  
# 四、使用说明  
## 1、MSF模块讲解  
  
    在启动msf之后，会进入“攻击命令交互界面”，此界面可看到msf各个模块。  
  
· Exploits（漏洞利用模块）  
数量为2482个。Exploit模块用于利用目标系统中的已知漏洞，以获得对目标系统的访问权限或者执行特定的操作。例如，针对某个特定版本的 Web 服务器软件的漏洞，编写的用于攻击该漏洞的代码就包含在相应的exploit模块中。  
  
· Auxiliary（辅助模块）  
 数量为1279个。Auxiliary模块主要用于执行一些辅助性的任务，如扫描目标系统开放的端口、枚举服务、进行指纹识别等。它们通常不直接利用漏洞来获取目标系统的控制权，但能为后续的攻击提供重要信息。  
  
· Post（后渗透模块）  
数量为431个。Post模块是在成功获得目标系统的访问权限后使用的，用于执行一些后续的操作，比如收集系统信息、提升权限、窃取敏感数据等。  
  
· Payloads（攻击载荷模块）  
 数量为1463个。Payload是在成功利用漏洞后执行的代码，它可以是一个简单的命令，也可以是一个完整的反向shell程序，用于与攻击者建立通信通道，使攻击者能够控制目标系统。  
  
· Encoders（编码器模块）  
 数量为49个。Encoder 模块用于对攻击载荷进行编码，以绕过目标系统的安全防护机制，如入侵检测系统（IDS）、入侵防御系统（IPS）等。编码后的载荷在功能上与原始载荷相同，但形式上发生了变化，从而降低被检测到的风险。  
  
· Nops（空操作指令模块）  
 数量为13个。Nop模块主要用于在攻击载荷中填充一些无实际操作的指令，以确保攻击代码的执行流程更加稳定，同时也可以用于调整攻击载荷的长度。  
  
· Evasion（免杀模块）  
 数量为9个。Evasion 模块用于绕过目标系统的反病毒软件和其他安全检测机制，使攻击载荷能够在目标系统上顺利执行而不被发现。  
## 2、参数说明  
<table><tbody><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt;border-style: solid;border-color: windowtext;"><p style="text-align:center;"><b><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-weight:bold;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">参数</span></font></span></b></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt;border-style: solid;border-color: windowtext;"><p style="text-align:center;"><b><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-weight:bold;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">说明</span></font></span></b></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;color:rgb(0,0,0);font-size:10.5000pt;"><span leaf="">advanced</span></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">显示一个或多个模块的高级选项</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">back</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">从当前模块</span></font><span leaf="">/上下文返回上一级</span></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">clearm</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">清空模块栈（模块操作历史）</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">favorite</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">将模块添加到</span></font><font face="宋体"><span leaf="">“收藏模块”</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">favorites</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">打印收藏模块列表（</span></font></span><span style="font-family:宋体;color:rgb(0,0,0);font-size:10.5000pt;"><span leaf="">show favorites</span></span><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><span style="mso-spacerun:&#39;yes&#39;;"><span leaf=""> </span></span><font face="宋体"><span leaf="">的别名）</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">info</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">显示一个或多个模块的详细信息（说明、参数、漏洞详情等）</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">listm</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">列出模块栈（当前加载过的模块历史）</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">loadpath</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">从指定路径中搜索并加载模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">options</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">显示全局选项或指定模块的配置参数</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">popm</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">从模块栈中弹出最新加载的模块，并将其设为当前活跃模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">previous</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">将上一个加载过的模块设为当前活跃模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">pushm</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">将当前活跃模块或模块列表压入模块栈</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">Reload_all</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">从所有定义的模块路径中重新加载全部模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">search</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">按关键词搜索模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">show</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">显示指定类型的模块，或显示所有模块</span></font></span></p></td></tr><tr><td data-colwidth="162" width="208" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;mso-ascii-font-family:Calibri;mso-hansi-font-family:Calibri;mso-bidi-font-family:&#39;Times New Roman&#39;;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="Calibri"><span leaf="">use</span></font></span></p></td><td data-colwidth="407" width="486" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor windowtext windowtext;"><p style="text-align:center;"><span style="font-family:宋体;font-size:10.5000pt;mso-font-kerning:1.0000pt;"><font face="宋体"><span leaf="">加载并使用指定模块</span></font></span></p></td></tr></tbody></table># 五、利用MSF实现永恒之蓝攻击示例  
  
    以永恒之蓝漏洞为例讲解各个模块的使用方式和相关技巧  
  
1、  
永恒之蓝漏洞对应编号为[ms17_010]  
  
2、  
在MSF中搜索永恒之蓝的信息[search ms17_010]  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaaqtgj1IbmlkkRAlpHULJKFd3VPyHvTib6LTnjotLvEkKZeyuaSB63qm7JbZkMHrvTicrWQPThhMGv1guJYtg2o0Iic9KtvRDYHTt8/640?wx_fmt=png&from=appmsg "")  
  
3、  
配置模块  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaapH0vTvuF6zELIC2olcTaxykpib7cwu6hc4jX3WNL7GvhFFUS9Lut2aUkkIOiboJKPlRAbXFKq985BqXB7O7OFRI6bcibU7cAOIbk/640?wx_fmt=png&from=appmsg "")  
  
4、  
查询模块配置信息（options）  
  
查看所需参数，yes为必填，Current Setting列为  
默认值，有值的可以不动  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaaptR7Cj2C8feDnkUGHCDsvNoKY43l0rpich96kxOMD81QzT7PNTtCpO0OlicETWiapNRAhde9J9C1f5y8zic5HE2gKZAvbMl5raD1w/640?wx_fmt=png&from=appmsg "")  
  
5、  
设置Rhost并执行（set、run）  
  
注：此步骤为利用辅助模块查询目标主机是否可能存在漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaaq7VpGAz8jibj8CePSsDgrEic14hDicdoOclPjkst5A1yzdXOczuTbTcELqPKOb02XobKQLpqJWRLezibZMLWd6XQu0JBBB48MmQzM/640?wx_fmt=png&from=appmsg "")  
  
6、  
利用攻击漏洞模块，实现攻击  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaaqXnIanhr46ZDIrZ9d2MTibTrRBxKdl5eCbjbuHqib8Uwm9GjmhIB3P188liaicRMWwWVwX5I1ICibqYKVGopRT0tqxlUed0pxDQk1A/640?wx_fmt=png&from=appmsg "")  
  
此部分为默认载荷  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaapxAF8dlGz1Ab20bkuY7lH5zvAHe28Jdh0htP2G9jZdatlL7uCxy6l9etNbEbmoTOLvYb6qI2yoOn5GHbEn6UFOueXOwMV1HSg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaaoJ3yzxyT739ZBqAibibIY2IImbiceekicK8Mdn5mic9WxRV2V7MF8lTYibuttItCGiaPMaT2VsjIQeercv85JO9z1rskcjakDBEcB16I/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZMyIuHTOaaqWnt8nRS4zqBpQu0m1wicw1JCTXjZUdvdqWtICd8icwQG5mxq91icWWpgich3wyfsMQBdbteiaSic2sfADozPVRxNJJZTE2br7VibrRs/640?wx_fmt=png&from=appmsg "")  
  
7、  
攻击成功  
  
运行成功会出现meterpreter >  
  
Meterpreter 是 Metasploit 的一个扩展模块，可以调用 Metasploit 的一些功能，对目标系统进行更深入的渗透，如进入cmd、获取屏幕、上传/下载文件、创建持久后门等  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZMyIuHTOaarrG2ZjsqVQaqPLU6ibPq50jperH5lVZmF7DBEIg41w0fmJDaAptHy5ASoyEOjkMZBcJv4pgGvun00Qpprrg7kYL7WRTL3IB6Ao/640?wx_fmt=png&from=appmsg "")  
# 六、注意事项  
  
1、  
模块使用：严格  
search→use→show options→set，先info看说明再运行。  
  
2、  
目标确认：反复检查  
RHOSTS、RPORT，  
避免IP、端口错误  
。  
  
3、  
监听与  
Payload：LHOS  
T  
必须为目标可达地址  
。  
  
文章中使用到的工具，如有需要，在公众号私信回复 20260515 即可获取下载链接！  
  
