#  你的WinRAR还在“裸奔”？——近三年高危漏洞大盘点  
原创 山石网科
                    山石网科  山石网科新视界   2026-04-10 06:00  
  
#   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8Jb8ZACqDjPdMzgicp2SzdZ19mFnVcBO53s1uA2cSfarQkwibVUeCeH9w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=kzx4ched&tp=webp#imgIndex=1 "")  
  
  
你的WinRAR还在“裸奔”？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/NGIAw2Z6vnLKuKAwMiaYedpTAYugKibaTBsHzf5pDuztECgfIgOfpG5DRF31jzhosMEj23dlx186q0zgLaIZj9lA/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=2c2qx2ig&tp=webp#imgIndex=2 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
引言  
  
  
压缩工具凭借其便捷性和广泛部署性已成为高价值攻击目标，作为全球应用最广泛的压缩/解压软件之一，WinRAR在企业办公场景与个人用户群体中均具备极高的渗透率，但其近年来高危漏洞频发。尽管官方已及时修复，大量未更新终端仍处于暴露状态。本文将系统盘点近三年WinRAR高危漏洞，旨在明确漏洞特征、梳理风险隐患，为企业及个人用户防范相关安全威胁、制定科学的防护策略提供参考。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
CVE-2023-38831代码执行漏洞  
  
  
CVE-2023-38831代码执行漏洞，源于WinRAR对ZIP压缩包内带末尾空格的文件名与同名文件夹的处理逻辑缺陷，以及Windows系统ShellExecuteExW API对带空格路径的通配符解析行为。当用户双击预览包内诱饵文件时，该API会将带空格的文件名解析为通配符，错误匹配并执行同名文件夹内的程序。攻击者可借此植入伪装恶意程序，结合Windows隐藏文件后缀特性，诱导用户双击触发恶意代码执行并接管终端。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Zjic54DsBHbGITwpsXUYKibpH4n8hOmxrMVBGRc6FuuZrQecIO09t2sMjP0Ig526BSDZlqTjsvN2ZLS5iaXUYUqAfgIwYdGaadw5EH9jiasMAck/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
CVE-2023-40477内存越界访问漏洞  
  
  
CVE-2023-40477是WinRAR恢复卷功能中的内存破坏型远程代码执行漏洞。漏洞根因在于WinRAR对用户可控恢复区块数据缺乏严格的边界校验与合法性验证，存在堆缓冲区越界读写缺陷。WinRAR在解析含恶意恢复区块的压缩包时，会因输入验证缺失导致缓冲区越界读写。攻击者可通过精心构造的恶意恢复区块，精准操控内存布局，实现任意地址读写，诱使用户使用受影响版本解压，即可在当前进程上下文执行任意恶意代码，最终实现主机接管。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Zjic54DsBHbGacevNvZMp1d0O8ebYJE7dgWnVzmGEQ1TyVyWBAwRYTSnUoElfZpACX1Os0Z7W7iaOnMx2YbOrBKRDQtP1NicFFs0rO3HCWhqrc/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
CVE-2024-33899/CVE-2024-36052 ANSI转义序列欺骗漏洞  
  
  
CVE-2024-33899（Linux/UNIX）与CVE-2024-36052（Windows）为同源ANSI转义序列注入高危漏洞，漏洞根源是WinRAR解析ZIP等压缩包文件名时，未过滤、无害化处理内嵌的ANSI转义控制序列。攻击者可在压缩包文件名中植入特制ANSI转义序列，恶意篡改WinRAR文件列表、终端输出内容，伪造文件类型、欺骗安全提示，再结合社会工程学诱骗用户，触发完整攻击链。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Zjic54DsBHbGmUnoVib3icdf8cJpySu2cUKWbVe9bHg7RwZIzXDibmicfp2P0Kcpy0iaUWgNTIO4PP39rGc9csCJr4U095UNoibZWZf3Smbfyulbnk/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
CVE-2025-6218目录穿越漏洞  
  
  
CVE-2025-6218是Windows版WinRAR高危路径遍历漏洞。该漏洞的核心成因是WinRAR处理压缩包内文件路径时未严格校验压缩包内文件路径、未限制解压目录边界，攻击者可构造含“..\”遍历序列的恶意压缩包，绕过指定目录，将文件写入系统任意路径，如开机启动目录。用户解压后，恶意文件会随系统启动自动执行，实现当前权限下无感知远程代码执行。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Zjic54DsBHbE5E65ic12001ibYARU50a1e5ojsrokBQbQq1hm0XTIO4QxLc9MC5jK4pRRqSC8toicED6Rbibu87PAAAZwDMJRdJyfia1NLYZw914s/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
CVE-2025-8088路径遍历漏洞  
  
  
CVE-2025-8088是Windows版WinRAR中存在的高危路径遍历漏洞。该漏洞的核心成因是WinRAR在处理RAR5格式压缩包时，对NTFS文件系统的备用数据流（ADS）校验机制存在缺陷。攻击者可构造恶意RAR压缩包，在诱饵文件的ADS流中嵌入恶意载荷，并在流名称中拼接"..\"路径遍历字符，构造指向系统敏感目录的恶意路径。当用户使用受影响版本解压时，程序会绕过目录限制，将载荷写入任意指定路径，典型目标为Windows开机启动目录。恶意载荷写入启动目录后，会在用户下次登录系统时自动执行，从而实现无感知的远程代码执行与持久化驻留。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Zjic54DsBHbEb0K0mSyfXWDPibJBP4YdHdhzsT8iaNW3IAWg8MHQ3nVciaTEhxRClkWKT7v4BzlTren0C2xTibEkdibbtUibTqcAfqhkuBAPOgedVA/640?wx_fmt=png&from=appmsg "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
防御建议  
  
  
个人用户防护建议：  
- 及时更新软件：定期核查WinRAR版本，升级至官方最新正式版，修复已知高危漏洞，筑牢终端安全屏障。  
  
- 开启杀毒防护：安装正规终端安全软件并启用实时防护，自动扫描查杀下载压缩包，抵御恶意文件入侵。  
  
- 强化安全意识：不随意打开不明来源文件，拒绝使用破解版、绿色版WinRAR，从源头规避漏洞利用风险。  
  
企业级防御策略：  
- 终端管控与补丁管理：通过终端管理系统排查全网WinRAR版本，禁用低版本、无法升级的终端，通过组策略限制程序权限，阻断其调用cmd、powershell等系统程序，防范漏洞利用。  
  
- 网络与网关防护：在邮件、Web网关配置专项规则拦截恶意压缩包，对外部传入压缩包做沙箱检测，无风险后放行，筑牢网络边界防线。  
  
- 终端检测与响应：借助EDR监控WinRAR异常行为，如创建子进程、释放可执行文件、执行脚本等，发现异常立即告警阻断，防止攻击扩散。  
  
- 安全意识培训：开展员工钓鱼防范专项培训，明确压缩包安全操作规范，提升恶意压缩包识别能力，降低人为安全隐患。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
山石防护  
  
  
WinRAR高危漏洞已成为APT、黑产团伙的核心攻击突破口之一，加之WinRAR无强制自动更新机制，漏洞暴露周期长达数月乃至数年，影响覆盖海量终端，极易成为内网渗透的初始突破口。针对上述漏洞风险，山石网科智铠统一终端安全管理系统打造全生命周期闭环防护体系：  
- 事前拦截：专业病毒引擎深度解析压缩包，精准查杀漏洞载荷、免杀病毒及内嵌恶意脚本，从源头切断攻击入口。  
  
- 事中阻断：持续监控WinRAR异常行为，及时告警并实时防护，填补补丁窗口期防护空白。  
  
- 根源管控：全网版本批量排查、低版本强制禁用，从根源消除漏洞风险。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8lvpAJHElQA6DiaJniaZb0daO3Kppz9ndV9Z2hHsjMuH61r2hu0jesGSg/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&randomid=hhvjiwep&tp=wxpic#imgIndex=3 "")  
  
ATT&CK技战术分析  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Zjic54DsBHbFdDRF0yyDq1VMXCrnTraDeSu6lO0Tx2nySJ6s2mTPmkbLhP6qiaVTxDLu4JQM8WYrKkjoOocQ1Icfrtv0wYEc4aGPsP93wUoLY/640?wx_fmt=png&from=appmsg "")  
  
更多详情，请点击“阅读原文”查看完整版。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnIYnBoVjHn0mWO3pro1TfcNW1g9SygLH6FI0c8mzWjXzibo9E0zM28pwRHFqwdHGwa2KbdicjgWdTtQ/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=852hkcz1&tp=webp#imgIndex=6 "")  
  
- [山石网科贾宇：山石网科防火墙开启 “抗量子密码” 时代](https://mp.weixin.qq.com/s?__biz=MzAxMDE4MTAzMQ==&mid=2661306055&idx=1&sn=5342bdc306731a9a9d073888fb60f2ff&scene=21#wechat_redirect)  
  
  
- [山石方案｜医疗行业-数据安全治理案例](https://mp.weixin.qq.com/s?__biz=MzAxMDE4MTAzMQ==&mid=2661306055&idx=2&sn=ef71796f27bd0b432ec02891949a355e&scene=21#wechat_redirect)  
  
  
- [2026个人信息保护升级！你的数据安全由谁守护？](https://mp.weixin.qq.com/s?__biz=MzAxMDE4MTAzMQ==&mid=2661306036&idx=1&sn=eec9fbfb95bcc453899dcc7e62741b51&scene=21#wechat_redirect)  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/NGIAw2Z6vnLSsTccx7j0fJVU0OOoqKA8KrXv9sZf93yt4huq2kARyZSgmdnic40GayohIYiaD2FAkkAqJehJSMtQ/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=7oqdpqlb&tp=webp#imgIndex=7 "")  
  
山石网科是中国网络安全行业的技术创新领导厂商，由一批知名网络安全技术骨干于2007年创立，并以首批网络安全企业的身份，于2019年9月登陆科创板（股票简称：山石网科，股票代码：688030）。  
  
现阶段，山石网科掌握30项自主研发核心技术，申请560多项国内外专利。山石网科于2019年起，积极布局信创领域，致力于推动国内信息技术创新，并于2021年正式启动安全芯片战略。2023年进行自研ASIC安全芯片的技术研发，旨在通过自主创新，为用户提供更高效、更安全的网络安全保障。目前，山石网科已形成了具备“全息、量化、智能、协同”四大技术特点的涉及  
基础设施安全、云安全、数据安全、应用安全、安全运营、工业互联网安全、信息技术应用创新、AI安全、安全服务、安全教育等10大类  
产品及服务，50余个行业和场景的完整解决方案。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/NGIAw2Z6vnLzibrp7C4HmazCNIQXMJIRxPibycdiaNQCI4PNojUk3eYCQDZs6c5zNMUkq7yFNeYQIxicAV33eHNdFA/640?wx_fmt=gif&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=2m7uy0lj&tp=webp#imgIndex=8 "")  
  
  
