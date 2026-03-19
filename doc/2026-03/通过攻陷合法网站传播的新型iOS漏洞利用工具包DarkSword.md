#  通过攻陷合法网站传播的新型iOS漏洞利用工具包DarkSword  
 白帽子   2026-03-19 21:08  
  
DarkSword 是一套完全基于 JavaScript 编写的一键式 iOS 攻击框架，支持 iOS 18.4 至 18.7 版本，通过六个安全漏洞实现从 Safari 远程代码执行到内核权限提升的完整入侵流程，配套三个不同能力层级的恶意载荷家族，可实现设备全量敏感数据窃取与远程控制。  
  
该工具包最早在 2025 年 11 月被谷歌威胁情报小组在野攻击中监测到，截至 2026 年 3 月，已确认被至少三个不同背景的威胁组织用于全球多地攻击活动。相关组织包括此前操控 Coruna 漏洞工具包，疑似俄罗斯背景的间谍组织 UNC6353，针对中东地区的攻击集群 UNC6748，以及土耳其商业监控厂商 PARS Defense，攻击目标覆盖乌克兰、沙特阿拉伯、土耳其、马来西亚等国家和地区。  
  
结合全球 iOS 版本市场份额数据测算，该漏洞链直接影响全球约 14.2% 的 iPhone 用户，对应设备规模约 2.2152 亿台。如果将范围扩大至 iOS 18 全系列未修复版本，潜在受影响用户占比达到 17.3%，对应设备规模约 2.7 亿台。该工具包的出现与快速扩散，标志着国家级 iOS 漏洞利用能力已通过二级市场，向商业监控厂商、网络犯罪团伙快速渗透，基于合法网站攻陷的水坑攻击，已成为移动端高风险的主流威胁向量。  
## 威胁发现与联合调查过程  
##   
  
2026 年初，Coruna iOS 漏洞工具包相关研究发布后，Lookout 威胁实验室针对投放该恶意软件的威胁组织相关恶意基础设施，启动了持续追踪分析。在分析与 UNC6353 组织相关联的 cdn [.] uacounter [.] com 域名时，研究人员发现了一个命名、架构高度同源的恶意域名 cdncounter [.] net。该域名与原域名共享域名服务器、注册商、注册时间，部分子域名的 IP 解析也存在明显重叠。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDqibc1scVzicPVuEsYuXRgHL06WwSOeHfLiaAK2fBqUbSZjYzhe1SMWhWNWpU7oeV7WMHW6y9cGGBwGuzvptFk9Mvh3an4uQvqG1Q/640?wx_fmt=png&from=appmsg "")  
  
通过威胁情报平台监测该域名的子域名 static [.] cdncounter [.] net 时，研究人员发现该域名与两个被攻陷的乌克兰网站存在 JavaScript 代码关联，分别是顿巴斯新闻社官网 novosti [.] dn [.] ua，以及乌克兰第七行政上诉法院官网 7aac [.] gov [.] ua。其中 7aac [.] gov [.] ua 在此前曾被植入指向 cdn [.] uacounter [.] com 的恶意代码，被用于投放 Coruna 恶意软件的水坑攻击。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDryy8KKlfB9qiaMYGBibKaCkXK52QqPHzTMLgdkY4BlE7Au2j0KZ22N5HQpbJxLhVLeibibVx948nmxo29ojF9r2wK0M9F68ofuCE0/640?wx_fmt=png&from=appmsg "")  
  
研究人员对两个被攻陷网站的源码展开深度分析，在页面 HTML 中发现了指向 static [.] cdncounter [.] net 的活跃恶意 iframe，以及用于生成该 iframe 的 JavaScript 代码。最初研究人员判断这可能是 Coruna 恶意软件的另一个投放渠道，但深入分析后发现，iframe 加载的核心文件为 rce_loader.js，该脚本的核心功能是对访问网站的设备进行系统版本指纹识别，仅针对 iOS 18.4 至 18.6.2 版本的设备分发漏洞利用代码，而这些系统版本并不在 Coruna 漏洞的影响范围内。这一特征让研究人员确认，这是一套此前未被披露的全新 iOS 漏洞利用工具包。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDprTk1L0Z9aVRx4t8FlBn6DRv7UkThZ5YDpIibH1pTJKnBpczLtNFHjwRAf9f1THFgzt6FHqTnWTnGele4aibcRg3seAUbCUJdq8/640?wx_fmt=png&from=appmsg "")  
  
同期，iVerify 研究团队在野外环境中捕获了该工具包的完整攻击样本，在本地环境中复现了全量入侵流程。谷歌威胁情报小组也确认，其已于 2025 年 11 月首次监测到该威胁的野外利用活动。三方研究团队启动了联合调查，共享了捕获的样本、基础设施情报与技术分析结果，并将这套工具包正式命名为 DarkSword，命名来源为植入代码中 WiFi 密码窃取模块的固定标签 DarkSword-WIFI-DUMP。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ibO9kiauylaDqoMM65hQEVkCd2I5bqCbaqlEyGZz5odXKQ2ibUF7nmfQxdBgp9FSzgfbVCaYCXJ885ocMZMcw24zSNNy9ZTe5Cbr8goOdics6hE/640?wx_fmt=jpeg&from=appmsg "")  
  
DarkSword 中硬编码了 C2 域名，泄露的数据会发送到 8881/8882 端口，这两个端口托管着一个名为“DarkSword 文件接收器”的端点。该端点使用 BaseHTTPServer 以及其提供的 HTML 内容表明，服务器端代码可能出于演示目的包含在 DarkSword 的销售中，或者是由攻击者自行创建的。一些迹象表明，DarkSword 基础设施的这一部分是在 LLM大模型的协助下创建的，例如标题中的文件夹表情符号和勾号。  
##   
  
  
攻击者似乎并未尝试对漏洞利用链或植入代码进行混淆以防止分析。这体现在 JavaScript 代码中存在大量注释和日志信息。  
  
模式分析表明，至少部分植入代码的创建使用了 LLM（低级逻辑模型）。基于此，UNC6353 可能缺乏移动漏洞利用方面的经验，并可能依赖人工智能支持为购买的工具添加额外功能。  
  
或者，这段代码可能是在攻击者获得该工具之前添加的。   
  
此次攻击活动与以往俄罗斯相关活动存在一些值得注意的重叠之处。  
  
2024年，谷歌曾揭露了APT29利用水坑攻击入侵蒙古网站的行动。该行动利用了此前该组织使用的iOS和Android Nday漏洞，并通过隐藏的iframe进行攻击。  
  
  
在调查过程中，谷歌威胁情报小组已于 2025 年底向苹果公司完整上报了 DarkSword 利用的所有安全漏洞，苹果在后续的系统版本更新中分批完成了漏洞修复，所有相关漏洞均在 iOS 26.3 版本中完成全量修复。  
<table><thead><tr><th><section><span leaf="">时间</span></section></th><th><section><span leaf="">核心事件</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">2025 年 7 月 29 日</span></section></td><td><section><span leaf="">苹果在 iOS 18.6 版本中修复 CVE-2025-31277 漏洞，该漏洞为 DarkSword 针对 iOS 18.4 版本使用的核心远程代码执行漏洞</span></section></td></tr><tr><td><section><span leaf="">2025 年夏季</span></section></td><td><section><span leaf="">谷歌威胁情报小组首次监测到 UNC6353 组织利用 Coruna 工具包，针对乌克兰网站发起水坑攻击</span></section></td></tr><tr><td><section><span leaf="">2025 年 11 月初</span></section></td><td><section><span leaf="">谷歌威胁情报小组监测到 UNC6748 组织搭建仿 Snapchat 的钓鱼网站 snapshare [.] chat，针对沙特阿拉伯用户发起 DarkSword 攻击，初始版本仅支持 iOS 18.4 系统</span></section></td></tr><tr><td><section><span leaf="">2025 年 11 月中旬</span></section></td><td><section><span leaf="">UNC6748 组织更新攻击链，新增对 iOS 18.6 版本的支持，配套 CVE-2025-43529 漏洞的利用模块</span></section></td></tr><tr><td><section><span leaf="">2025 年 11 月下旬</span></section></td><td><section><span leaf="">UNC6748 组织新增对 iOS 18.7 版本的支持；同期谷歌威胁情报小组监测到土耳其商业监控厂商 PARS Defense 在土耳其境内发起攻击，实现对 iOS 18.4 至 18.7 全版本的适配</span></section></td></tr><tr><td><section><span leaf="">2025 年 12 月</span></section></td><td><section><span leaf="">苹果在 iOS 18.7.2 与 26.1 版本中修复 CVE-2025-43510 与 CVE-2025-43520 两个内核相关漏洞；UNC6353 组织开始使用 DarkSword 针对乌克兰发起新的水坑攻击</span></section></td></tr><tr><td><section><span leaf="">2025 年 12 月 12 日</span></section></td><td><section><span leaf="">苹果在 iOS 18.7.3 与 26.2 版本中修复 CVE-2025-43529 与 CVE-2025-14174 两个漏洞</span></section></td></tr><tr><td><section><span leaf="">2026 年 1 月</span></section></td><td><section><span leaf="">谷歌威胁情报小组监测到 PARS Defense 的客户在马来西亚发起攻击，新增严格的设备指纹识别与反分析逻辑</span></section></td></tr><tr><td><section><span leaf="">2026 年 2 月 11 日</span></section></td><td><section><span leaf="">苹果在 iOS 26.3 版本中修复 CVE-2026-20700 漏洞，该漏洞为 DarkSword 全版本通用的 PAC 与 TPRO 防护绕过漏洞</span></section></td></tr><tr><td><section><span leaf="">2026 年 2 月 12 日</span></section></td><td><section><span leaf="">Lookout 研究人员监测到乌克兰一家食品加工企业的员工设备，已被 DarkSword 成功入侵</span></section></td></tr><tr><td><section><span leaf="">2026 年 3 月</span></section></td><td><section><span leaf="">UNC6353 组织针对乌克兰的水坑攻击仍在持续，谷歌威胁情报小组与乌克兰计算机应急响应小组合作完成了攻击缓解；三方联合发布 DarkSword 完整研究报告</span></section></td></tr></tbody></table>  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDpwSI3bQakcibvnMenp4CujYKdcfCPekhnxkyTibO3ztodRPcYMmjpcdO35S6W6mEx8soXPVDibRWibALrEA9Ofl9ibenGaKmAfVfqs/640?wx_fmt=png&from=appmsg "")  
## 攻击链技术原理与执行流程  
##   
  
DarkSword 是一套全程基于 JavaScript 实现的全链攻击框架，全程无需注入任何 Mach-O 格式的二进制文件，能够规避苹果针对未签名代码设置的 PPL、SPTM 等核心防护机制。完整攻击流程分为七个核心环节，各环节形成闭环，技术细节如下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ibO9kiauylaDq5lbTtEEluR9A6gyK8DmicMA58t2ExaXm7zJCajuBmicgbzT6pcCMiabDHowNfFMwzvxiaEndTNf8MlgCBK4LIJvWtd3UAy1Jtjds/640?wx_fmt=jpeg&from=appmsg "")  
### 初始访问与载荷投放  
  
攻击者通过攻陷合法网站发起水坑攻击，在网站首页 HTML 中嵌入不可见的恶意 iframe，指向攻击载荷分发服务器。不同威胁组织的初始投放逻辑存在差异，但核心框架保持一致。  
  
UNC6353 组织在被攻陷的乌克兰政府与新闻网站中，植入尺寸为 1px×1px 的透明 iframe，直接加载 static [.] cdncounter [.] net 的攻击载荷，未设置复杂的环境校验规则，仅通过 IP 地址限制，仅向乌克兰地区的用户分发漏洞利用代码。  
  
UNC6748 组织搭建了仿 Snapchat 的钓鱼网站，通过会话存储中的 uid 密钥实现重复感染防护，非 iPhone 设备或非 Safari 浏览器访问时，会被强制通过 x-safari-https 协议跳转至 Safari 浏览器打开页面。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ibO9kiauylaDqcW87yBlr0kpica6miaAic5gibJ7V9VtO0Jt9vt8xicUI6CU6VIh4Dg1mhIvy5xuhNqUxYesfqprFAWOOR4YttPFic8icTKqZlzhy0Rc/640?wx_fmt=jpeg&from=appmsg "")  
  
PARS Defense 组织在初始页面加入了严格的设备指纹识别规则，覆盖 Apple Pay 支持情况、浏览器特性、WebGL2 支持状态、调试器检测等多个校验维度，未通过校验的访问目标会被双重重定向至合法网站，大幅降低了非目标设备的攻击暴露风险。  
  
所有攻击入口的最终目标，都是加载 rce_loader.js 文件。该文件是 DarkSword 的漏洞加载器，核心功能是识别设备的 iOS 系统版本，匹配并加载对应版本的远程代码执行漏洞利用模块。  
### Safari 渲染进程远程代码执行  
  
漏洞加载器会根据设备的 iOS 版本，加载对应的漏洞利用模块，通过两个 JavaScriptCore 引擎的 JIT 相关漏洞，实现 Safari WebContent 渲染进程的远程代码执行。  
  
针对 iOS 18.4 与 18.5 版本，攻击者利用 CVE-2025-31277 漏洞。该漏洞为 JavaScriptCore 引擎中，JIT 正则表达式匹配逻辑引发的类型混淆漏洞。漏洞根因在于，正则匹配结果数组在全局对象进入异常状态时，仍错误创建 Contiguous 类型数组，导致断言失效与内存损坏。攻击者通过该漏洞构建内存地址伪造与读取原语，再扩展为任意内存读写原语。该漏洞已在 WebKit 官方提交的 716536c 版本中完成修复。  
  
针对 iOS 18.6 至 18.7 版本，攻击者利用 CVE-2025-43529 漏洞。该漏洞为 JavaScriptCore 引擎数据流图 JIT 层的写屏障缺失漏洞。漏洞根因在于，StoreBarrierInsertionPhase 阶段的逃逸分析仅标记了 Phi 节点本身，未标记通过 Upsilon 传入 Phi 节点的所有传递性值，导致垃圾回收机制运行异常，引发内存释放后重用与类型混淆问题。该漏洞已在 WebKit 官方提交的 b21a503 版本中完成修复。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDpcZ2ILVGibcwsqakvWSMLiaqgvGKrZtibgKIdlibpmyibZOc61LJ6Uys0D9LbGkLyFZBxj7Z0kSHNq4iaDRBc4bQIOFXQiavyv8ZvTTQ/640?wx_fmt=png&from=appmsg "")  
### 用户态防护机制绕过  
  
两个远程代码执行漏洞，均配套了 CVE-2026-20700 漏洞的利用代码，实现对苹果指针认证码与可信路径只读防护机制的绕过。该漏洞根因在于 dyld 的 dlopen_from 函数中，加载器相关的向量数据被存储在常规栈内存，而非持久化分配器中。攻击者可滥用栈上可写的 dyld 敏感内部结构，绕过指针签名校验与内存保护机制，最终在 WebContent 进程中实现任意代码执行，全程无需注入未签名的二进制文件。该漏洞已在 dyld 开源项目提交的 9b3c6bde 版本中完成修复。  
### 首次沙箱逃逸，WebContent 进程至 GPU 进程突破  
  
攻击者利用 CVE-2025-14174 漏洞，从权限严格隔离的 WebContent 渲染进程，突破至 Safari GPU 进程。该漏洞为 ANGLE 组件的参数校验缺失漏洞，ANGLE 是 OpenGL ES 的适配层组件，该漏洞在特定 WebGL 操作中，未对输入参数做充分校验，导致 GPU 进程中出现越界内存写入。攻击者结合此前的防护绕过技术，在 GPU 进程中构建任意内存读写与函数调用原语，完成第一次沙箱环境突破。  
### 二次沙箱逃逸，GPU 进程至系统守护进程突破  
  
攻击者利用 CVE-2025-43510 漏洞，从 GPU 进程突破至 mediaplaybackd 系统守护进程。该漏洞为 XNU 内核的写时复制机制漏洞，攻击者通过 AppleM2ScalerCSCDriver 驱动的 1 号选择器触发漏洞，借助系统暴露的 XPC 接口，在 mediaplaybackd 进程中构建任意函数调用原语。该进程拥有比 GPU 进程更高的系统权限，为后续的内核权限提升奠定了基础。  
### 内核权限提升，实现设备完全控制  
  
攻击者在 mediaplaybackd 进程中加载 JavaScriptCore 运行时，执行 pe_main.js 提权模块，利用 CVE-2025-43520 漏洞实现内核权限提升。该漏洞为 XNU 虚拟文件系统实现中的内核态竞争条件漏洞，攻击者利用该漏洞构建物理内存与虚拟内存的全量读写原语，最终实现内核态任意代码执行，获取设备的完全控制权。  
### 载荷注入与数据窃取  
  
完成内核权限提升后，pe_main.js 会作为恶意载荷的调度器，将 JavaScriptCore 框架与定制化的恶意载荷，注入多个系统核心进程，包括 SpringBoard、configd、wifid、securityd、UserEventAgent 等。各注入的载荷完成对应敏感数据的采集与暂存后，由 SpringBoard 中的最终载荷，将全量采集的数据上传至攻击者的命令控制服务器。数据外传完成后，载荷会执行攻击痕迹清理，随后攻击进程干净退出，无持久化残留。  
## 相关威胁组织活动与画像  
  
DarkSword 工具包已在多个威胁组织之间完成扩散，不同组织均基于原生框架进行了定制化修改，适配各自的攻击目标与运营需求。核心威胁组织的活动情况与画像如下。  
### UNC6353 组织  
  
UNC6353 是 DarkSword 工具包的主要使用者，也是此前 Coruna 漏洞工具包的核心操控者。综合多维度情报分析，该组织被评估为资金充足、资源渠道广泛，但技术成熟度较低的威胁主体，攻击目标同时覆盖经济获利与和俄罗斯情报需求对齐的间谍活动，大概率为俄罗斯背景的私掠组织或犯罪代理团伙。  
  
俄文注释  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibO9kiauylaDqgicGmzLjnGMNKtm3Uk7YSWxQ1aE0NCsQISMyYHJxQ78T3CiaBas0qrLZEYRu13w8xllkfziaOcchTw1Dj3Faqvica6cZp213Fic6M/640?wx_fmt=png&from=appmsg "")  
  
该组织的核心攻击目标为乌克兰地区的政府机构、媒体、企业与个人用户，所有攻击活动均通过攻陷乌克兰本土的合法网站发起水坑攻击。其使用的 DarkSword 版本为原生框架，代码全程未做混淆处理，保留了完整的调试日志与开发注释，漏洞加载器的逻辑严谨，可精准匹配 iOS 18.4 与 18.6 版本的对应漏洞利用模块，未出现其他组织版本中的逻辑缺陷。  
  
该组织的运营安全存在明显缺陷，恶意代码未做混淆，恶意 iframe 的 HTML 代码无任何隐藏处理，命令控制接收端的设计简陋且命名直白。有明显迹象表明，该组织缺乏移动端漏洞利用的一线开发经验，部分植入代码存在借助大语言模型开发的特征，大概率是从第三方渠道购买了完整的漏洞工具包，仅做了少量适配修改。  
### UNC6748 组织  
  
UNC6748 是针对中东地区的定向攻击集群，核心攻击目标为沙特阿拉伯地区的 Snapchat 用户。该组织的攻击活动迭代速度快，但代码逻辑存在严重的兼容性缺陷，反分析能力在攻击过程中逐步提升，目前未发现其拥有针对 Chrome 浏览器的攻击链。  
  
该组织最早在 2025 年 11 月初发起攻击，初始版本仅支持 iOS 18.4 系统，后续逐步新增了 iOS 18.6 与 18.7 版本的支持。但漏洞加载器的分支逻辑存在严重错误，非 18.6 版本的设备无法正确加载 18.4 版本的漏洞利用模块，新增 18.7 版本支持后，加载器会无视设备系统版本，强制加载 18.7 版本的漏洞利用模块，整体兼容性极差。  
  
攻击成功后，该组织会部署名为 GHOSTKNIFE 的全功能 JavaScript 后门程序，实现对目标设备的长期远程控制与数据窃取。  
### PARS Defense  
  
PARS Defense 是土耳其的商业监控厂商，其发起的攻击活动运营安全水平显著高于其他两个组织。该组织最早在 2025 年 11 月下旬在土耳其境内发起攻击，后续其客户在 2026 年 1 月于马来西亚发起了同类攻击。  
  
该组织使用的 DarkSword 版本，对加载器和漏洞利用模块进行了高强度混淆处理，采用 ECDH 密钥协商与 AES 加密的方式传输攻击载荷，避免明文泄露。漏洞加载器的逻辑完善，可根据设备的 iOS 版本精准匹配对应的漏洞利用模块，无兼容性缺陷。2026 年马来西亚的攻击活动中，还新增了严格的设备指纹识别逻辑，反分析与目标精准度能力极强。  
  
攻击成功后，该组织会部署名为 GHOSTSABER 的模块化 JavaScript 后门程序，支持灵活的功能扩展与定制化攻击需求。  
## 恶意载荷功能与数据窃取范围  
  
DarkSword 工具包配套三个不同能力的恶意载荷家族，均为纯 JavaScript 实现，无持久化机制，攻击完成后会清理痕迹并退出。三个载荷的功能与定位各有差异，详细情况如下。  
### GHOSTBLADE 载荷  
  
GHOSTBLADE 是 DarkSword 原生开发的标准载荷，由 UNC6353 组织使用，定位为轻量化定向数据窃取程序，无远程控制后门能力。  
  
该载荷的核心功能是覆盖七大类核心隐私数据的采集与外传，包括 iMessage、Telegram、WhatsApp 的全量聊天数据，设备钥匙串与密钥包，WiFi 密码，位置历史记录，照片元数据，加密货币钱包文件，Safari 浏览历史、书签与 Cookie 数据，以及设备健康数据库等内容，与 DarkSword 工具包原生设计的窃取范围完全一致。  
  
数据外传完成后，该载荷仅会删除 osanalytics 目录下的诊断报告，未清理系统主崩溃日志目录，痕迹清理能力较弱。代码未做混淆，保留了完整的调试日志与开发注释，基于 Webpack 打包的代码中，保留了完整的源码文件路径，暴露了 DarkSword 工具包的完整代码库结构。  
### GHOSTKNIFE 载荷  
  
GHOSTKNIFE 是 UNC6748 组织定制开发的全功能远程控制后门程序。  
  
该载荷的核心功能包括全量隐私数据窃取，覆盖已登录账户、短信与社交软件消息、浏览器数据、位置历史、录音、照片与文件等内容。同时具备完整的远程控制能力，支持从命令控制服务器下载文件、设备截屏、麦克风实时录音、执行任意代码，还可从服务端获取新参数，实时调整攻击配置。  
  
通信层面，该载荷基于 HTTP 协议的自定义二进制协议与服务端通信，采用 ECDH 密钥协商与 AES 加密保障通信安全。痕迹清理方面，会定期删除 CrashReporter 目录下，mediaplaybackd、SpringBoard、WebKit 相关进程的崩溃日志与内核恐慌日志，掩盖攻击痕迹。存储层面，会在 tmp 目录下创建基于随机 UUID 的专属目录，分模块存储窃取的数据，完成回传后自动清理临时文件。  
### GHOSTSABER 载荷  
  
GHOSTSABER 是 PARS Defense 定制开发的模块化可扩展后门程序。  
  
该载荷的基础功能包括设备信息枚举、已登录账户与已安装应用列表采集、文件系统递归枚举、定向数据窃取、任意 SQLite 数据库查询、照片缩略图批量窃取、指定应用与文件全量上传、正则匹配批量文件窃取，以及任意 JavaScript 代码执行，可动态扩展攻击功能。  
  
载荷中包含地理位置上报、截屏、WiFi 信息窃取、麦克风录音等命令的引用，但未实现对应代码，同时预留了共享内存通信接口，疑似支持后续从命令控制服务器下载二进制模块，扩展攻击能力。通信层面，基于 HTTP 与 HTTPS 协议与服务端通信。  
### 核心数据窃取范围  
  
三个载荷均覆盖了设备全量敏感数据的窃取能力，核心采集范围包括：  
1. 通信与社交数据，包括 SMS 与 iMessage 数据库、通话记录、联系人数据库、Telegram 与 WhatsApp 全量聊天记录、媒体文件与联系人数据；  
  
1. 系统与网络数据，包括 WiFi 配置文件、已知 WiFi 网络与密码、Safari 历史记录、书签、Cookie、浏览器状态数据、设备唯一标识符、SIM 卡信息、蜂窝网络数据、系统配置文件；  
  
1. 用户隐私数据，包括位置历史记录、备忘录、日历、照片元数据、健康数据库、账户信息、邮件索引数据、已安装应用列表；  
  
1. 系统核心密钥数据，包括钥匙串数据库、设备各类密钥包，可实现设备权限的完全接管；  
  
1. 加密货币钱包数据，覆盖主流交易平台、硬件钱包配套应用、多链与单链钱包的数十款应用，可窃取钱包私钥、助记词与交易数据。  
  
## 受影响范围与风险评估  
### 直接受影响的系统版本  
  
DarkSword 工具包的原生配置覆盖 iOS 18.4 至 18.6.2 版本，PARS Defense 的定制版本已扩展支持 iOS 18.7 版本。所有相关漏洞均已在 iOS 18.7.2、18.7.3、18.7.6，以及 iOS 26.1、26.2、26.3、26.3.1 版本中完成修复。运行最新系统版本的设备，不受该威胁及其利用的漏洞影响。  
### 全球受影响设备规模  
  
结合 StatCounter 2026 年 2 月的全球 iOS 版本市场份额数据测算，iOS 18.4 至 18.6.2 版本的全球用户占比约 14.2%，对应受影响设备规模约 2.2152 亿台。  
  
结合 TelemetryDeck 2026 年 2 月的调查数据，iOS 18 全系列版本的全球占比为 18.99%，扣除已修复的 iOS 18.7.x 版本后，约 17.3% 的 iPhone 用户仍处于受影响范围，对应设备规模约 2.7 亿台。  
### 潜在风险扩展  
  
目前无证据表明该漏洞链的相关漏洞被用于攻击 iOS 26 + 版本的设备，但无法排除攻击者对漏洞进行适配，实现跨版本利用的可能性。同时，若漏洞可向下兼容 iOS 18.4 以下版本，受影响设备规模将进一步扩大。  
  
该工具包的代码可复用性极强，极易被其他威胁组织改造，用于新的攻击活动。其纯 JavaScript 的实现方式，规避了苹果针对未签名二进制代码的多重防护机制，未来此类攻击模式将成为 iOS 平台攻击的主流方向。  
## 检测方法与失陷指标  
###   
  
DarkSword 无独立的植入进程，仅通过系统原生进程执行恶意代码，传统杀毒软件难以检测，可通过以下方式进行排查。  
### 网络层失陷指标  
###   
<table><thead><tr><th><section><span leaf="">指标内容</span></section></th><th><section><span leaf="">关联威胁组织</span></section></th><th><section><span leaf="">用途</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">snapshare[.]chat</span></section></td><td><section><span leaf="">UNC6748</span></section></td><td><section><span leaf="">沙特阿拉伯攻击活动诱饵站点</span></section></td></tr><tr><td><section><span leaf="">62[.]72[.]21[.]10</span></section></td><td><section><span leaf="">UNC6748</span></section></td><td><section><span leaf="">GHOSTKNIFE 命令控制服务器</span></section></td></tr><tr><td><section><span leaf="">72[.]60[.]98[.]48</span></section></td><td><section><span leaf="">UNC6748</span></section></td><td><section><span leaf="">GHOSTKNIFE 命令控制服务器</span></section></td></tr><tr><td><section><span leaf="">sahibndn[.]io</span></section></td><td><section><span leaf="">PARS Defense</span></section></td><td><section><span leaf="">土耳其攻击活动载荷分发站点</span></section></td></tr><tr><td><section><span leaf="">e5[.]malaymoil[.]com</span></section></td><td><section><span leaf="">PARS Defense</span></section></td><td><section><span leaf="">马来西亚攻击活动载荷分发站点</span></section></td></tr><tr><td><section><span leaf="">static[.]cdncounter[.]net</span></section></td><td><section><span leaf="">UNC6353</span></section></td><td><section><span leaf="">乌克兰水坑攻击载荷分发服务器</span></section></td></tr><tr><td><section><span leaf="">cdn[.]cdncounter[.]net</span></section></td><td><section><span leaf="">UNC6353</span></section></td><td><section><span leaf="">攻击基础设施关联域名</span></section></td></tr><tr><td><section><span leaf="">count[.]cdncounter[.]net</span></section></td><td><section><span leaf="">UNC6353</span></section></td><td><section><span leaf="">攻击基础设施关联域名</span></section></td></tr><tr><td><section><span leaf="">sqwas[.]shapelie[.]com</span></section></td><td><section><span leaf="">UNC6353</span></section></td><td><section><span leaf="">GHOSTBLADE 数据回传命令控制服务器</span></section></td></tr><tr><td><section><span leaf="">141[.]105[.]130[.]237</span></section></td><td><section><span leaf="">UNC6353</span></section></td><td><section><span leaf="">2025 年 12 月 22 日至 2026 年 3 月 17 日活跃的攻击服务器</span></section></td></tr></tbody></table>###   
### 恶意文件特征  
  
设备中出现以下文件名，可作为感染的辅助判断依据：rce_loader.js、rce_module.js、rce_worker_18.4.js、rce_worker_18.6.js、sbx0_main_18.4.js、sbx1_main.js、pe_main.js。  
### 文件系统失陷指标  
  
设备中出现以下路径的文件，可判定为已被感染：  
1. /private/var/tmp/keychain_dump.txt，钥匙串明文导出文件；  
  
1. /private/var/tmp/keychain-2.db，钥匙串数据库副本；  
  
1. /private/var/tmp 目录下的各类 kb 后缀密钥包副本；  
  
1. /private/var/tmp/wifi_passwords.txt，WiFi 密码明文导出文件；  
  
1. /private/var/tmp/wifi_passwords_securityd.txt，备用路径 WiFi 密码导出文件；  
  
1. /private/var/tmp/icloud_dump/ 目录，iCloud 数据导出目录。  
  
### 日志检测特征  
  
系统统一日志中出现包含 CHAIN、MAIN、DarkSword-WIFI-DUMP 等标签的日志，且来源为 mediaplaybackd 进程，可判定为已被感染。设备短时间内出现大量 WebContent、GPU 进程的崩溃记录，或 mediaplaybackd 进程出现异常网络流量，也需高度警惕感染风险。  
### YARA 检测规则  
  
报告配套提供了四个 YARA 检测规则，分别覆盖 GHOSTKNIFE、GHOSTSABER、GHOSTBLADE 载荷，以及 DarkSword 植入库的特征检测，可用于终端威胁扫描与流量分析。  
## 缓解措施与安全建议  
### 个人用户防护建议  
1. 立即将 iOS 系统升级至最新版本。所有受影响用户需升级至 iOS 18.7.6 或 iOS 26.3.1 版本，苹果已在上述版本中修复了 DarkSword 利用的所有六个安全漏洞，这是最核心的缓解措施。  
  
整体情况报告  
  
DarkSword的扩散：iOS漏洞利用链被多个威胁行为者采用  
  
https://cloud.google.com/blog/topics/threat-intelligence/darksword-ios-exploit-chain  
  
  
信息补充报告  
  
使用暗剑的攻击者威胁 iOS 用户  
  
https://www.lookout.com/threat-intelligence/article/darksword  
  
  
关于该工具包攻击IOS系统的详细入侵痕迹报告：  
  
DarkSword内幕：一款通过被入侵的合法网站传播的新型iOS漏洞利用工具包  
  
https://iverify.io/blog/darksword-ios-exploit-kit-explained  
  
相关目录存在窃取数据痕迹  
  
/private/var/Keychains/   
  
/private/var/keybags/    
  
/private/var/tmp/    
  
/private/var/run/   
  
/private/var/db/   
  
/private/var/root   
  
/private/var/log/   
  
/private/var/wireless/  
  
其中最明显的特征为：  
<table><tbody><tr style="box-sizing: border-box;-webkit-font-smoothing: inherit;"><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">Log Message </span></p></td><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-left: 1px solid rgba(153, 153, 153, 0.25);border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">mediaplaybackd</span></p></td><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-left: 1px solid rgba(153, 153, 153, 0.25);border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">[+] Running on non-A18 Devices</span><span leaf=""><br/></span><span leaf="">[+] read_fd: 0x000000000000000a</span><span leaf=""><br/></span><span leaf="">[+] write_fd: 0x000000000000000c</span><span leaf=""><br/></span><span leaf="">[+] free_thread_arg: 0x0000000cf1568000</span><span leaf=""><br/></span><span leaf="">[+] physical_mapping_address: 0x0000000107454000</span><span leaf=""><br/></span><span leaf="">[+] pc_object: 0x000000000000e727</span><span leaf=""><br/></span><span leaf="">[+] pc_address: 0x000000037cae8000</span><span leaf=""><br/></span><span leaf="">[+] Hello from: 0x00000000000056c7</span><span leaf=""><br/></span><span leaf="">[+] target corrupted: 0xffffffe1b4d98548</span></p></td></tr></tbody></table><table><tbody><tr style="box-sizing: border-box;-webkit-font-smoothing: inherit;"><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">Log Message </span></p></td><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-left: 1px solid rgba(153, 153, 153, 0.25);border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">mediaplaybackd</span></p></td><td style="box-sizing: border-box;-webkit-font-smoothing: inherit;vertical-align: top;min-width: 16ch;background-color: rgb(255, 255, 255);padding: 8px;border-left: 1px solid rgba(153, 153, 153, 0.25);border-top: 1px solid rgba(153, 153, 153, 0.25);"><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">[CHAIN] ..</span><span leaf=""><br/></span><span leaf="">[MAIN] ..</span><span leaf=""><br/></span><span leaf="">[DRIVER-NEWTHREAD] …</span><span leaf=""><br/></span><span leaf="">[MIG_FILTER_BYPASS] …</span><span leaf=""><br/></span><span leaf="">[OFFSETS] …</span><span leaf=""><br/></span><span leaf="">[TASKROP] …</span><span leaf=""><br/></span><span leaf="">[TASK] …</span><span leaf=""><br/></span><span leaf="">[DarkSword-WIFI-DUMP] ..</span></p><p dir="ltr" style="box-sizing: border-box;-webkit-font-smoothing: inherit;margin: 24px 0px 0px;padding: 0px;font-family: Rubik, &#34;Rubik Placeholder&#34;, sans-serif;font-style: normal;font-weight: 400;color: rgb(28, 32, 36);font-size: 17px;letter-spacing: -0.17px;text-transform: none;text-decoration: rgb(28, 32, 36);text-decoration-skip-ink: auto;text-underline-offset: auto;line-height: 28.05px;text-align: start;-webkit-text-stroke: 0px rgb(28, 32, 36);font-feature-settings: &#34;blwf&#34;, &#34;cv03&#34;, &#34;cv04&#34;, &#34;cv09&#34;, &#34;cv11&#34;;font-variation-settings: normal;background-color: rgba(0, 0, 0, 0);border-radius: 0px;corner-shape: round;"><span leaf="">[DarkSword-WIFI-DUMP-SECURITYD] ...</span></p></td></tr></tbody></table>  
  
黑鸟整理部分IOS系统被攻击痕迹规则如下：  
  
https://github.com/blackorbird/APT_REPORT/tree/master/exploit_report/IOS/detect  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ibO9kiauylaDqicDvERLTuy6Yo2PUS5sCSLCWBlXcichCYke51phlZqJvemVicckicq5cDX67WMuDvDmWX3HQaiaFCeKnMRuEVv2jsQCv90kc27HwE/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibO9kiauylaDr49YmobmR4jzF4Q31cvtLJPPrlliby3JnjdZV7OgaOF24lCSDez1UuXGUIbd1d1O9DZ8vPwNxCPmHqiapM13BjVibAGL50X0A2NQ/640?wx_fmt=png&from=appmsg "")  
  
  
