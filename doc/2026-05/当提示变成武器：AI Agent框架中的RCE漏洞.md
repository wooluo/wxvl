#  当提示变成武器：AI Agent框架中的RCE漏洞  
 幻泉之洲   2026-05-10 01:08  
  
>   
  
  
AI Agent从根本上改变了AI应用的安全模型。给它装上插件（也叫工具），它就不再只是生成文字了——它能读文件、查数据库、跑脚本，直接在网络上搞事情。  
  
所以AI层的漏洞早就不只是内容安全的问题了，它变成了执行风险。攻击者如果能通过提示注入控制插件参数，Agent就可能被驱动去做超出设计范围的事。AI模型本身没问题，它按照设计把语言解析成工具调用格式。问题出在框架和工具太信任解析出来的数据了。  
  
开发人员为了快速构建应用，大量依赖Semantic Kernel、LangChain、CrewAI这类框架。这些框架相当于AI Agent的操作系统，把复杂的模型编排都抽象掉了。但这种方便是有代价的：框架成了通用底层，只要有一个漏洞，就能把模型输出映射到系统工具上，带来系统性风险。  
  
我们的任务是把AI系统搞得更安全、消灭新型漏洞。为此我们发起了一个系列研究，专门找热门AI Agent框架里的漏洞。通过负责任的披露流程，和维护者一起先把问题修掉，再公开分享。这篇博客就讲我们在微软Semantic Kernel里发现的漏洞细节、修复步骤，还有一个交互式的挑战让你自己试试。后面还会发其他框架的研究。  
## 背景  
  
我们在微软Semantic Kernel里找到一条漏洞路径，能把提示注入变成宿主机级别的远程代码执行（RCE）。  
  
一句提示就能在运行AI Agent的设备上弹出计算器：不需要浏览器漏洞、不需要恶意附件、不需要内存破坏。Agent只是按设计干活：理解自然语言、选个工具、把参数传进代码。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibe0uREFBcYPiaTV5AJBn17C4NgACcpNNeJGweaOYhiaXeoNLyrzcvTXBiaZOovgxhyH3B9NO7rtefUTy6jx3YR5FQ2kAic0VwibJzJo/640?wx_fmt=png&from=appmsg "")  
  
▲ 图1：利用本地模型演示CVE-2026-26030的利用过程  
  
现代AI Agent背后的真实安全故事就是这样。一旦AI模型连上工具，提示注入就成了一条细细的分界线：分界这边是内容安全问题，那边是代码执行能力。在这篇AI Agent框架安全系列研究里，我们演示Semantic Kernel的两个漏洞如何让攻击者跨过那条线，以及客户该怎么做来评估风险、打补丁、调查是否已经被利用。  
## 一个典型案例：Semantic Kernel  
  
Semantic Kernel是微软的开源框架，用来构建AI Agent、把AI模型集成到应用里。它在GitHub上有超过27000颗星，提供了编排AI模型、管理插件、链接工作流的核心抽象。  
  
我们在对Semantic Kernel做安全研究时，发现并披露了两个严重漏洞：CVE-2026-25592和CVE-2026-26030。这两个问题已经被修复，但修复前攻击者可以利用针对框架内Agent的注入攻击，实现未授权的代码执行。下面详细拆解漏洞机制，并给出加固建议。  
## CVE-2026-26030: 内存向量存储  
  
利用这个漏洞需要两个条件：  
- 攻击者得有提示注入的入口，能影响Agent的输入  
- 目标Agent必须用了Search Plugin，且后端是默认配置的内存向量存储（In-Memory Vector Store）  
两个条件都满足，攻击者就能从一句提示出发实现RCE。  
  
我们搭了一个"酒店搜索"Agent来演示。先创建一个内存向量集存放酒店数据，然后把search_hotels(city=...)函数暴露给Agent，让AI模型能通过工具调用来用它。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibctErFicX9obP9GJSztCbcxv1PgERs02l7XOFqYK2U49knAkfRXpLlA9s4jp6NrzGMDFcODmKleryf9r4PXFLTtxc0QnZ54PxbY/640?wx_fmt=webp&from=appmsg "")  
  
▲ 图2：配置了内存向量集的Semantic Kernel Agent  
  
用户输入"找巴黎的酒店"时，AI模型会调用搜索插件，参数是city="Paris"。插件先跑一个确定性过滤函数缩小数据集，然后计算向量相似度（嵌入）。  
  
了解了Agent怎么搜索，我们深入漏洞本身。  
### 问题1：不安全的字符串插值  
  
默认的过滤函数是用eval()执行的一个Python lambda表达式。在例子里，默认过滤器会变成new_filter = "lambda x: x.city == 'Paris'"。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibfVuEB785ibNZOqeriamAhJAh1rDWCcQQ9C1j7s9ibG9on09AgeGDq8C7CPA4xpMHJXujFicLqIkAyqaR7W1cjjK3FGq3IwJ8souic8/640?wx_fmt=webp&from=appmsg "")  
  
▲ 图3：默认过滤函数定义  
  
漏洞在于kwargs[param.name]由AI模型控制且没有过滤。这成了一个经典的注入点。攻击者通过闭合引号（'）并追加Python逻辑，就能把简单的数据查询变成可执行载荷：  
- 输入：' or MALICIOUS_CODE or '  
- 结果：lambda x: x.city == '' or MALICIOUS_CODE or ''  
### 问题2：可绕过的黑名单  
  
框架开发者预料到了这个RCE风险，实现了一个校验器，在执行前把过滤器字符串解析成抽象语法树（AST）。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6TibeMdBLrSRs7672AoCZ1TQR7gtQjgnhmLlekugvoibRwuwI1sWThcCUicZYGACwjMB9YJpnHLnVfWCmVg3juWq3COtBeH08K09V6Q/640?wx_fmt=webp&from=appmsg "")  
  
▲ 图4：黑名单实现  
  
在运行用户提供的过滤代码前，应用会跑一个验证函数，目的是阻止不安全的操作。大致逻辑：  
1. 只允许lambda表达式。直接拒绝代码块（比如import语句、类定义）。  
1. 扫描每个元素，发现危险标识符和属性（比如eval、exec、open、__import__）就拒绝。  
1. 通过检查后，在受限环境里执行：Python的内置函数（比如open、print）被故意移除了。就算有漏网之鱼，也不应该能访问危险功能。  
生成的lambda用来过滤向量集中的记录。  
  
这个做法理论上说得通，但在Python这种动态语言里，黑名单天生脆弱——语言的灵活性允许通过替代语法、库或运行时求值重新引入被禁的操作。我们找到了绕过这个黑名单的方法。  
### 利用  
  
我们的利用提示被设计成：操纵Agent触发Search Plugin调用，传入最终导致恶意代码执行的参数。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6TibcC6mPQibyicowRFYXIv2w6OJ7ODlLDc6vPVuX0Zpj9qe8DOBcF5tbiaz2X87wu3s88xQMZSb7u540kxfccC9UoSsknwID2n7xbhY/640?wx_fmt=webp&from=appmsg "")  
  
▲ 恶意提示要求执行search_hotels函数并携带恶意参数  
  
这条提示骗过Agent，触发了下面的函数调用：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibdyJiavF5djOGr2aPpmeOBb2gfxib9zkowErgH8ov61BxfRROQv3PlZIc96k0jganHTJ8MtxHUfliceva9ic1ibT0364fVticRicmAEuM/640?wx_fmt=webp&from=appmsg "")  
  
▲ 携带恶意参数调用"search hotels"函数  
  
结果lambda被格式化成下面的代码并在eval()中执行。这个载荷逃出了模板字符串，遍历Python的类层次找到BuiltinImporter，用它动态加载os然后调用system()。这些步骤绕过了导入黑名单，在保持模板语法有效（有干净的闭合表达式）的同时启动了任意shell命令（比如calc.exe）。  
  
过滤器没拦住这个载荷，原因如下：  
1. 缺少危险名称。载荷用了多个不在黑名单里的属性：__name__（按名称找BuiltinImporter）、load_module（导入模块的方法）、system（执行shell命令的方法）、BuiltinImporter（类本身）。  
1. 结构检查通过了。载荷包在合法的lambda表达式里。isinstance(tree.body, ast.Lambda)检查通过，因为整个东西就是一个lambda，只不过体里包含了恶意代码。  
1. 空__builtins__没用。eval()调用用了{"__builtins__": {}}来移除内置函数，但这个保护没意义——载荷根本不直接使用内置函数。它从tuple()出发，绕过Python的类型系统达到危险功能，而tuple()无论内置环境如何都存在。  
1. 没有检查ast.Subscript。虽然这次没用上，但要注意过滤器只检查ast.Name和ast.Attribute节点。如果载荷需要用到被禁的名称，可以用方括号记法（比如obj['__class__']代替obj.__class__），这会生成ast.Subscript节点，验证完全忽略它。  
### 修复措施  
  
我们向MSRC负责任披露后，Semantic Kernel团队用四层防护做了全面修复：  
- AST节点类型白名单——只允许比较、布尔逻辑、算术、字面量等安全结构。  
- 函数调用白名单——即使允许的AST调用节点也要检查，确保只调用安全函数。  
- 危险属性黑名单——阻止类层次遍历（比如__class__、__subclasses__）。  
- 名称节点限制——只允许lambda参数（比如x）作为裸标识符，拒绝os、eval、type等引用。  
### 我怎么知道自己是否受影响？  
  
如果你的Agent满足以下所有条件，就存在CVE-2026-26030漏洞：  
- 使用了Python包semantic-kernel[1]  
- 框架版本低于1.39.4  
- 使用了内存向量存储，并且依赖其过滤功能（作为Search Plugin的默认配置后端）  
### 如果受影响怎么办？  
  
不需要重写Agent。把Python的semantic-kernel依赖升级到1.39.4或更高版本就行。  
### 那之前Agent还脆弱的时候呢？  
  
打补丁能堵住漏洞，但回答不了防守者关心的回溯问题：升级之前Agent是不是已经被利用了？  
  
首先，定义每个受影响部署的脆弱窗口：从部署了有漏洞的Semantic Kernel Python版本开始，到安装1.39.4或更高版本截止。调查应该聚焦在这个时间范围。  
  
其次，在脆弱窗口内搜索宿主机层面的后利用迹象。因为成功利用会在宿主机上执行代码，最有用的证据在端点遥测里：Agent宿主进程产生的可疑子进程、出站连接、持久化痕迹。我们在后面专门一节提供了实用的高级狩猎查询。  
  
如果找到可疑活动，要当作潜在的主机沦陷来处理。审查受影响主机，轮换Agent能访问的凭证和令牌，调查这台主机能接触到什么数据或系统。  
## CVE-2026-25592: 通过SessionsPythonPlugin写任意文件  
  
在深入第二个漏洞的机制之前，先看看Agent沙箱逃逸长什么样：用一句提示，攻击者就能绕过云端沙箱，直接把恶意载荷写到宿主设备的Windows Startup文件夹，实现完整的RCE。  
### 容器边界  
  
Semantic Kernel内置了一个叫SessionsPythonPlugin的插件，让Agent在Azure Container Apps动态会话（隔离的云端沙箱，有自己的文件系统）里安全执行Python代码。安全模型完全依赖这个边界：代码运行在隔离沙箱里，碰不到Agent进程所在的宿主机。为了在沙箱内外传输数据，插件用了UploadFile和DownloadFile这类辅助函数，它们在宿主机侧运行来跨边界传文件。  
### 漏洞  
  
在.NET SDK里，DownloadFileAsync不小心被加上了[KernelFunction]属性。这个属性正式把它广告给了AI模型当可调用的工具，还带着完整的参数schema。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6TibfS5hxBWGljD4zvztIEmQgKI1ug4F89QM0HQuOLzMfc7eWGKpesPYMrjP1tgjQERnQ995HpMyeiag0QkgSERMb9Cvib3YyGibFUys/640?wx_fmt=webp&from=appmsg "")  
  
▲ 因为这个属性，localFilePath参数——它直接决定了File.WriteAllBytes()在宿主机上写到哪里——完全由AI控制了。没有路径校验、没有目录限制、没有过滤，攻击者不需要复杂的虚拟机逃逸漏洞，只要提示模型帮它做就行了。  
  
（注：任意文件读取。反过来，Python和.NET SDK里的upload_file()函数也存在类似漏洞：它不加验证地接受任意本地文件路径，允许提示注入把敏感文件——比如SSH密钥、凭证——直接泄露到沙箱里。）  
### 攻击链概览  
  
把两个暴露的工具串起来，攻击者就能把标准的函数调用升级成沙箱逃逸：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibciapnU9ia5MHm7mKsHCx2OHGBHUyeDSt2LV2MSyiconnWFSO4zxxibxj3Fms79SanJRTPZGI82N1ibyBdVscniaV4mz384Ykr3f35SU/640?wx_fmt=webp&from=appmsg "")  
  
▲ 步骤1：创建载荷  
  
一条注入提示让Agent使用ExecuteCode工具在隔离容器内生成恶意脚本。  
  
![]( "")  
  
▲ 此时载荷还在容器里，没执行能力，不能影响宿主机。  
  
步骤2：逃出沙箱  
  
第二条注入指令告诉AI模型用DownloadFileAsync工具把文件下载到宿主机上的危险位置。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6Tibc0L3BbwOgibw2gMPNUylPnVLc4kx0nic6bbImH4B0DWib4W2iaiarMQzEm14vFy5cD5KN6X1Ric3kibo7gjnib8KpYIecV5zBvxfRL3Vw/640?wx_fmt=webp&from=appmsg "")  
  
▲ Agent调用：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibfFzBSwHJWgvIhuHkHKGwlcicGUVZvav3usU5Yxaraj1kZfsiaXZs7yA9nBibnvXTLsTM0W5P9Vjmx4w3ypO7JfMXrYUQU9Pf2vZU/640?wx_fmt=webp&from=appmsg "")  
  
▲ Agent从沙箱API取回脚本，直接写到宿主机的Windows\Start Menu\Programs\Startup文件夹。  
  
步骤3：执行代码  
  
下次用户登录时脚本运行，宿主机就完全沦陷了。  
  
这个利用演示了MITRE ATLAS[2]技术AML.T0051（LLM提示注入）级联成AML.T0016（获取能力）。暴露DownloadFileAsync提供了宿主机文件系统上的直接写文件原语，容器隔离等于白费了。  
### 修复与防御  
  
Semantic Kernel打了补丁[3]，移除了工具暴露的根因并加了纵深防御：  
  
移除AI访问——去掉了[KernelFunction]属性，函数对AI模型不可见了。AI Agent不能再调用它，提示注入也够不着了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibcGFeUWDxUX8YyIUf9Ts6ttSzQEEvzibqnkrl5CwKxuM8ZQvcXtCWDtSOU4ThdjLxvPAMj0ZTwWOJPDO7lEwjicud1S02zpPlsnI/640?wx_fmt=webp&from=appmsg "")  
  
▲ 这一个改动就打破整条攻击链。AI现在只能被开发者的意图代码直接调用。  
- 路径校验——对于编程方式调用函数的开发者，增加了ValidateLocalPathForDownload()方法，使用路径规范化（Path.GetFullPath()）和目录白名单匹配，确保目标路径落在允许的目录里。  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6Tibc0h7NfunupRXhLUELxldJspGcYoyEVEmOibFDo54DpuFCmaMia64YD3d6MlfElrgStiaqkzEvl3Dt9gLCJNxiarEZ9ib7YpmesoUMw/640?wx_fmt=webp&from=appmsg "")  
  
▲ 上传也加了类似的选入保护。  
### 我受影响吗？  
  
如果你的Agent用了低于1.71.0的Semantic Kernel .NET SDK版本，就存在CVE-2026-25592漏洞。  
## 防御Agent边界  
  
如果你用Semantic Kernel，首要建议是立刻升级。不需要重写Agent架构，安全更新只是移除了AI模型自主触发这些函数的能力。更广泛地说，防御AI Agent需要承认一个事实：AI模型不是安全边界。安全团队必须在两个层面关联信号：AI模型层面（通过元提示和内容安全过滤器检测意图）和宿主机层面（检测执行）。如果攻击者绕过了模型护栏，传统的端点防御必须在位，才能检测到异常行为——比如AI Agent进程突然产生命令行、往Startup文件夹里扔脚本。  
## 不是Bug，是设计缺陷  
  
把不可信数据用作高风险操作的输入并不是新事。早期Web应用安全里，这类输入直接被拼进SQL查询或文件系统API。今天Agent在做类似的事：把不可信的自然语言输入映射到系统工具上。两个漏洞的共通教训是：它们不是AI模型本身的bug，而是Agent架构和工具设计的问题。我们必须清楚区分模型行为和Agent架构。AI模型完全按设计工作：把意图翻译成结构化的工具调用。当模型连上系统工具时，提示注入的风险就超出了典型的聊天机器人滥用范围，需要额外的防护。它会变成通向具体执行原语的直接路径：数据泄露、任意文件写入、RCE。如果想深入了解连了工具的AI模型的运行时风险，可以看Running OpenClaw safely: identity, isolation, and runtime risk[4]。  
  
再次强调：你的LLM不是安全边界。你暴露的工具定义了攻击者的影响范围。模型能影响的任何工具参数都必须视为攻击者可控的输入。  
  
在这个系列的下一篇博客里，我们会扩展到Semantic Kernel之外，探索我们在其他广泛使用的第三方Agent框架里发现的类似结构执行漏洞。  
## CTF挑战：攻击你自己的Agent  
  
想看看提示注入怎么升级成执行？想测试自己的技术？我们把这篇博客里那个有漏洞的酒店搜索Agent打包成了一个可交互的夺旗（CTF）挑战。  
  
这个CTF让你扮演攻击者，在受控环境里尝试利用CVE-2026-26030。你需要构造一条提示注入，不仅要绕过Agent的自然语言防御，还要把Python AST遍历载荷通过有漏洞的eval()注入点偷渡进去。  
  
下载挑战，在沙箱里启动，看看能不能操纵AI模型执行任意代码、在服务器上弹出计算器。记住：这个挑战仅供教育目的，别在生产环境里跑。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibfGtYQEwbAVCyOMiaCnRtvR2CdaicA8YSk2JF17Q5cjjUueAgtZIaIgHZLOJqeOsTPgY83P19xwxUltYwicHTHL07NFribsZW25sLE/640?wx_fmt=webp&from=appmsg "")  
  
▲ 侦察：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6TibeDlQZviackFD3kpNM4KExv9TvQBEET9ibYBCFcsgfG62NCQ4NzNibricOqo9UCjtNuVHmAzuaO1rlJtvIdUSb68eDJtwAvjiaEsh9Q/640?wx_fmt=webp&from=appmsg "")  
  
▲ 利用（越狱+载荷）：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibdxacHpnZ1IUCjccaAoice4hiaq7bDPRplsibS1q6kiattFjZcqbTxRbq3neYzpoktE3KGkVRC6ZF0ngDcticnSibVIbKHgKSt6H82XI/640?wx_fmt=webp&from=appmsg "")  
  
▲ 注意：因为Agent在你本机运行，计算器会弹在你桌面上。在真实场景里，可执行文件会在托管Agent的服务器上远程启动。  
  
下载CTF挑战：https://github.com/amiteliahu/AIAgentCTF/tree/main/CVE-2026-26030  
## 高级狩猎  
  
以下高级狩猎查询帮你从Semantic Kernel Agent中找出可疑活动。  
### 检测Semantic Kernel Agent宿主进程常见的RCE后利用子进程  
  
DeviceProcessEvents| where Timestamp > ago(30d)| where InitiatingProcessCommandLine matches regex @"(?i)semantic[\s_\-]?kernel"    or InitiatingProcessFolderPath matches regex @"(?i)semantic[\s_\-]?kernel"| where FileName in~ (    "cmd.exe", "powershell.exe", "pwsh.exe", "bash.exe", "wsl.exe",    "certutil.exe", "mshta.exe", "rundll32.exe", "regsvr32.exe",    "wscript.exe", "cscript.exe", "bitsadmin.exe", "curl.exe",    "wget.exe", "whoami.exe", "net.exe", "net1.exe", "nltest.exe",    "klist.exe", "dsquery.exe", "nslookup.exe")| project     Timestamp,    DeviceName,    AccountName,    FileName,    ProcessCommandLine,    InitiatingProcessFileName,    InitiatingProcessCommandLine,    InitiatingProcessFolderPath| sort by Timestamp desc  
### 检测.NET宿主的Semantic Kernel产生可疑子进程  
  
DeviceProcessEvents| where Timestamp > ago(30d)| where InitiatingProcessFileName in~ ("dotnet.exe")| where InitiatingProcessCommandLine matches regex @"(?i)(semantic[\s_\-]?kernel|SKAgent|kernel\.run)"| where FileName in~ (    "cmd.exe", "powershell.exe", "pwsh.exe", "bash.exe",    "certutil.exe", "curl.exe", "whoami.exe", "net.exe")| project     Timestamp,    DeviceName,    AccountName,    FileName,    ProcessCommandLine,    InitiatingProcessFileName,    InitiatingProcessCommandLine| sort by Timestamp desc  
### 参考资料  
  
[1]   
https://pypi.org/project/semantic-kernel/  
  
[2]   
https://atlas.mitre.org/  
  
[3]   
https://github.com/microsoft/semantic-kernel/pull/13478/changes  
  
[4]   
https://www.microsoft.com/en-us/security/blog/2026/02/19/running-openclaw-safely-identity-isolation-runtime-risk/  
  
