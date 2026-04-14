#  Windows中如何根据systeminfo信息获取需要修复的漏洞列表  
原创 一个努力的学渣
                        一个努力的学渣  一个努力的学渣   2026-04-14 08:42  
  
免责声明  
  
本文只做学术研究使用，不可对真实未授权网站使用，如若非法他用，与平台和本文作者无关，需自行负责！  
  
前言  
  
不管是在打红队还是蓝队应急中，经常需要使用  
systeminfo来获取补丁信息，可是获取之后，我们应如何进行下一步操作呢？  
  
wesg  
- 项目地址：https://github.com/bitsadmin/wesng  
  
- 使用：  
    - git clone https://github.com/bitsadmin/wesng  
  
    - cd wesng  
  
    - pip install . -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host pypi.tuna.tsinghua.edu.cn  
  
```
可选参数：
-u, --update
  下载最新的 CVE 漏洞库文件
--definitions [DEFINITIONS]
  指定漏洞定义压缩包（默认：definitions.zip）
-p 已安装补丁 [补丁编号 ...], --patches 已安装补丁 [补丁编号 ...]
  除 systeminfo.txt 中识别的补丁外，手动额外指定已安装的补丁编号
-d, --usekbdate
  自动过滤：仅保留晚于最新安装补丁发布日期的漏洞
-e, --exploits-only
  仅显示存在公开利用代码的高危漏洞
--hide 需隐藏漏洞 [软件名 ...]
  隐藏指定软件的漏洞（例如：Adobe Flash Player、Microsoft Edge）
-i 漏洞影响 [影响类型 ...], --impact 漏洞影响 [影响类型 ...]
  仅显示指定影响类型的漏洞
-s 漏洞等级 [等级 ...], --severity 漏洞等级 [等级 ...]
  仅显示指定危险等级的漏洞
-o [输出文件名], --output [输出文件名]
  将扫描结果保存到文件中
--muc-lookup
  自动校验微软更新目录：若补丁已被新版替代，自动隐藏对应漏洞
--os [操作系统名称 / ID]
  手动指定操作系统（不加此参数直接运行，可查看系统 ID 列表）
-c, --color
  控制台彩色输出（需安装 termcolor 依赖库）
-h, --help
  显示帮助信息并退出
--update-wes
  下载最新版本的 wes.py 工具
```  
```
使用示例：
下载最新漏洞定义库
  wes.py --update
  wes.py -u
扫描系统漏洞（核心用法）
  wes.py systeminfo.txt
通过 qfe 文件扫描漏洞（先不加 --os 查看系统列表，再指定系统）
  wes.py --qfe qfe.txt --os 'Windows 10 Version 20H2 for x64-based Systems'
  wes.py -q qfe.txt --os 9
扫描漏洞并将结果导出到文件
  wes.py systeminfo.txt --output vulns.csv
  wes.py systeminfo.txt -o vulns.csv
手动指定补丁编号，减少漏洞误报
  wes.py systeminfo.txt --patches KB4345421 KB4487017
  wes.py systeminfo.txt -p KB4345421 KB4487017
按补丁日期过滤，扫描最新漏洞
  wes.py systeminfo.txt --usekbdate
  wes.py systeminfo.txt -d
手动指定自定义漏洞库文件扫描
  wes.py systeminfo.txt --definitions C:\tmp\mydefs.zip
仅显示有利用代码的漏洞，排除 IE/Edge/Flash 漏洞
  wes.py systeminfo.txt --exploits-only --hide "Internet Explorer" Edge Flash
  wes.py systeminfo.txt -e --hide "Internet Explorer" Edge Flash
仅显示指定影响类型的漏洞（如：远程代码执行）
  wes.py systeminfo.txt --impact "Remote Code Execution"
  wes.py systeminfo.txt -i "远程代码执行"
仅显示指定危险等级的漏洞（如：严重级）
  wes.py systeminfo.txt --severity critical
  wes.py systeminfo.txt -s critical
根据缺失补丁列表展示漏洞
  wes.py --missing missing.txt
  wes.py -m missing.txt
根据缺失补丁 + 指定操作系统展示漏洞
  wes.py --missing missing.txt --os "Windows 10 Version 1809 for x64-based Systems"
  wes.py -m missing.txt --os 2
联网校验微软补丁替代关系
  wes.py systeminfo.txt --muc-lookup
彩色显示扫描结果
  wes.py systeminfo.txt --color
  wes.py systeminfo.txt -c
更新 WES-NG 工具本体
  wes.py --update-wes
```  
  
首先，需要导出  
systeminfo信息：  
systeminfo > systeminfo_server2022.txt  
  
- git clone https://github.com/bitsadmin/wesng  
  
- cd wesng  
  
- pip install . -i https://pypi.tuna.tsinghua.edu.cn/simple --trusted-host pypi.tuna.tsinghua.edu.cn  
  
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
-   
![](https://mmbiz.qpic.cn/mmbiz_png/qkajCoyKpkABTOCKJKk48X91XEARcafLic8dpsuZIoo33tSFgicLJ4coWS9cIU46g9Uohw07EoJ8fzWD09DNJ2eNGKuhmKek7IFpGj1214h2I/640?wx_fmt=png&from=appmsg "")  
  
之后  
扫描漏洞并将结果导出到文件：  
wes.py systeminfo_server2022.txt -o server2022_vuln_report.csv  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qkajCoyKpkD6qmgRNocjha8VGb11CQnDy9EULExpST10VCAoxKzrdJSibKmIJbhibgS2J1GALYiaXqp4t2JibgicoTubARjQRKVgnkvzOSyzFzOQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qkajCoyKpkBiaoPicR7aQTFDKmMq7cbh19v9nVJibn82UHtbwiavTaSYgWlzZUHRZD8luCzvrvsoekichGEIHWiby7VyEae4JkAtMT74Wnic88AAeI/640?wx_fmt=png&from=appmsg "")  
  
最新的漏洞是  
CVE-2026-23669，至于是否真的存在，需要具体去验证  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qkajCoyKpkDC1xV2BVqMa2iaZ7bicVyxybJ62nBHj3LNIe6S5C6viaCicNkj7ywLXbbIS1yXJrk4b9gvFXjp0PK04xUaia2em5yxveqRoNbl68Eg/640?wx_fmt=png&from=appmsg "")  
  
修复很简单：  
1. 全部更新：Windows更新  
  
1. 单独修复漏洞：根据某一个漏洞去下载更新程序  
  
1. 配置防火墙策略  
  
