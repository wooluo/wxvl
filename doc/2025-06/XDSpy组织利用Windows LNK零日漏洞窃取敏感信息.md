#  XDSpy组织利用Windows LNK零日漏洞窃取敏感信息  
邑安科技  邑安全   2025-06-18 09:17  
  
更多全球网络安全资讯尽在邑安全  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1N39PtINn8sQcSia1rMbD0QZDicia5iaEHbevG9stzY1ZARvsUXHYFJYqJa17GayVgUHcAcJcuCO7AsPMyv5hMsszw/640?wx_fmt=png&from=appmsg "")  
  
网络安全研究人员近期发现，XDSpy黑客组织正在利用Windows快捷方式文件中的零日漏洞实施复杂的网络间谍活动。该组织自2011年起长期潜伏，直到2020年才首次被发现，主要针对东欧和俄罗斯的政府机构。分析显示，该组织在代码、基础设施和攻击目标方面与已知APT（高级持续威胁）组织均无关联。  
  
漏洞利用技术分析  
  
攻击者利用编号为"ZDI-CAN-25373"的漏洞，通过在命令行参数中填充空白字符，使恶意命令在Windows LNK属性对话框中不可见，但仍能在触发时执行。趋势科技于2025年3月首次报告该漏洞。  
  
HarfangLab研究团队在3月中旬发现一批利用此漏洞的恶意LNK文件。调查还揭示Windows解析LNK文件的方式与其MS-SHLLINK规范存在差异，这为攻击者提供了额外的混淆攻击手段。  
  
攻击活动主要针对俄语用户，分析发现的诱饵文件包括：一份致哈萨克斯坦阿拉木图市律师协会主席的文件扫描件，以及一份来自莫斯科建筑设计公司的包含网络和电力安装计划的楼层平面图。这表明XDSpy仍专注于东欧的政府和基础设施目标。  
  
感染机制剖析  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1N39PtINn8sQcSia1rMbD0QZDicia5iaEHbej5UCYOjp1Ma6UIwk6NgCUZqvYz4ewFk1WMtdgYcDVnibFAdG3SkbyYg/640?wx_fmt=png&from=appmsg "")  
  
感染链始于受害者接收名为dokazatelstva.zip或proyekt.zip的压缩包，内含恶意LNK文件和伪装成.ini扩展名的另一个ZIP文件。当用户打开LNK文件时，会触发复杂的Windows shell单行命令，在解压执行恶意组件的同时向受害者显示诱饵文档。  
  
该LNK文件同时利用了ZDI-CAN-25373漏洞和LNK解析混淆技术来隐藏真实意图。以下是LNK文件中包含的简化版Windows shell命令示例：  
```
set PATH=%windir%\system32;%PATH% & (
  chcp 65001 | echo | set /p="import System;
  import System.IO;
  import System.IO.Compression;
  [...截断的JavaScript .NET代码...]
  Main();" > %TEMP%\B5DUC80ULT7L.a
  [...更多编译执行代码...]
)
```  
  
多阶段攻击载荷  
  
该命令提取并执行名为"ETDownloader"的第一阶段恶意软件——一个通过合法签名的Microsoft可执行文件侧加载的.NET DLL。ETDownloader通过创建启动批处理文件建立持久性，并尝试从硬编码URL的命令控制服务器下载名为"XDigo"的第二阶段载荷。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1N39PtINn8sQcSia1rMbD0QZDicia5iaEHbebCK4eKr7scsziciaHFZMbkfH1nzFkDOroBJvhibqNm2IabCVs3phRv3Bg/640?wx_fmt=png&from=appmsg "")  
  
用Go语言编写的XDigo植入程序具有复杂的数据收集功能，能够规避分析并窃取敏感信息。它会定期扫描特定扩展名的文档、截取屏幕截图、监控剪贴板内容，并具备命令执行能力，所有数据外传均采用加密处理。  
  
此次攻击活动标志着XDSpy战术的显著升级，将零日漏洞利用与复杂的多阶段载荷相结合，表明这个此前低调的黑客组织仍在持续开发针对性的高级网络间谍能力。  
  
原文来自: cybersecuritynews.com  
  
原文链接:   
https://cybersecuritynews.com/xdspy-threat-actors-leverages-windows-lnks-zero-day-vulnerability/  
  
欢迎收藏并分享朋友圈，让五邑人网络更安全  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/1N39PtINn8tD9ic928O6vIrMg4fuib48e1TsRj9K9Cz7RZBD2jjVZcKm1N4QrZ4bwBKZic5crOdItOcdDicPd3yBSg/640?wx_fmt=jpeg "")  
  
欢迎扫描关注我们，及时了解最新安全动态、学习最潮流的安全姿势！  
  
推荐文章  
  
1  
  
[新永恒之蓝？微软SMBv3高危漏洞（CVE-2020-0796）分析复现](http://mp.weixin.qq.com/s?__biz=MzUyMzczNzUyNQ==&mid=2247488913&idx=1&sn=acbf595a4a80dcaba647c7a32fe5e06b&chksm=fa39554bcd4edc5dc90019f33746404ab7593dd9d90109b1076a4a73f2be0cb6fa90e8743b50&scene=21#wechat_redirect)  
  
  
2  
  
[重大漏洞预警：ubuntu最新版本存在本地提权漏洞（已有EXP）　](http://mp.weixin.qq.com/s?__biz=MzUyMzczNzUyNQ==&mid=2247483652&idx=1&sn=b2f2ec90db499e23cfa252e9ee743265&chksm=fa3941decd4ec8c83a268c3480c354a621d515262bcbb5f35e1a2dde8c828bdc7b9011cb5072&scene=21#wechat_redirect)  
  
  
  
  
  
