#  “Jenny是我的朋友”——用MCP打造我的AI漏洞猎人  
 幻泉之洲   2026-04-14 06:02  
  
> 我花了几个月时间，用Claude Code和模型上下文协议（MCP）搭建了一个半自动的漏洞挖掘系统。本文详细介绍了系统的架构设计、运作机制，以及它为我挖到的几个零日漏洞和赏金，最后还有关于成本与收益的诚实复盘。  
  
## 动机很简单：解放自己  
  
这事儿的初衷挺实在的。之前手动挖洞，大量时间都耗在配置工具、切换环境这些杂活上。搞一次标准的分析流程大概是这样：连上虚拟机，准备好二进制文件，反编译，理清攻击面，设置模糊测试，分析崩溃点，写利用代码，整理论证报告，最后提交给厂商或赏金平台。每一步都有专用工具、不同输出格式和上下文。我烦透了这些重复劳动，就想让AI（我选的Claude Code）去处理这些“苦力活”，把思考和策略判断留给自己，毕竟我可不想自己的技术被AI的写作风格同化。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcYsJ803qznl6xK5bStIsaITW4m2RyJfiaHTdeejmU4iaKt6F9oP3NJwWmOFObrGMI4icyRtq4j2nglZr44mVgMOE8mtRDC1B1nzo/640?wx_fmt=png&from=appmsg "")  
## 快速了解MCP：给AI装上“手”  
  
MCP，模型上下文协议，相当于让Claude Code能直接调用你暴露给它的工具函数。你可以把它理解成给AI配了一个结构化的命令行——有明确的输入输出类型，不再是复制粘贴终端输出的原始方式。  
  
我的做法很直接：把我研究流程里的每个工具都包装成一个MCP服务器。最后搞出了8个MCP服务器，分布在5个虚拟机上，总共有超过300个工具。下图是个大致概览：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibdkHaGJFU8a4rns2foCFPnibN0dNkiccotTpmo1m6vRnZFYqFxYbib93tJ6OxYO2fh6N95BibWV2G5HAwS8picS6ZJONTOdib8vRHTeg/640?wx_fmt=png&from=appmsg "")  
  
所有的服务器都基于FastMCP搭建，服务器文件本身只是薄薄的一层包装，真正的业务逻辑都放在独立的模块里。而且，像SSH、WinRM这样的会话可以在一次对话中跨工具调用持久保持，连一次就行。  
## 为工作流量身打造的实验室  
  
整个研究环境搭建在一个基于Proxmox的专用网段里，跑了5台虚拟机。配置不算太特别，就是为我的工作流专门优化的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcibzFbUiaiaukVk1COqtnPib5tNpQgflwYsw2KBy83xDibX61LnfEzIu3kuhgerJxzdqoRRZVp42tia8KCwib4EgAlCrhl3K7ibiaCp8mQ/640?wx_fmt=png&from=appmsg "")  
<table><thead><tr><th><section><span leaf="">虚拟机</span></section></th><th><section><span leaf="">平台</span></section></th><th><section><span leaf="">用途</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">hunt-win11</span></section></td><td><section><span leaf="">Windows 11（最新补丁）</span></section></td><td><section><span leaf="">主要攻击目标</span></section></td></tr><tr><td><section><span leaf="">hunt-win11-n1</span></section></td><td><section><span leaf="">Windows 11（前一版补丁）</span></section></td><td><section><span leaf="">用于补丁星期二后的二进制对比分析</span></section></td></tr><tr><td><section><span leaf="">hunt-winserv</span></section></td><td><section><span leaf="">Server 2022</span></section></td><td><section><span leaf="">RPC、服务、AD攻击面</span></section></td></tr><tr><td><section><span leaf="">hunt-kali</span></section></td><td><section><span leaf="">Kali Linux</span></section></td><td><section><span leaf="">分析工具集（Ghidra, radare2, 调试器等）</span></section></td></tr><tr><td><section><span leaf="">hunt-fuzz</span></section></td><td><section><span leaf="">Windows 11</span></section></td><td><section><span leaf="">专用模糊测试（WinAFL, Jackalope等）</span></section></td></tr></tbody></table>  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfshWjeOfgHPBj73YHow6E0ic8FYQlAmSibajdYYPYicwcph7Cm8rDCKyVrtA8pXvl9TKBSGk53MtV6CN9WdFic9uvDojIETVmjhZM/640?wx_fmt=png&from=appmsg "")  
  
所有Windows虚拟机都配了一个lowpriv  
标准用户账号。这点很重要，早期教训就是，在SYSTEM  
权限下看起来很美妙的漏洞，普通用户可能根本够不着。分析工作在Kali上通过SFTP拉取二进制文件进行，避免把分析工具装到目标机本身。  
## 战役与“幻觉垃圾桶”：最重要的设计  
  
LLM会一本正经地胡说八道，这你知道。为了管住这些“电脑瘾君子”，我把所有挖掘工作都组织成“战役”。每个战役本质上是hunts/campaigns/  
下的一个目录，有固定的结构存放发现、崩溃数据、笔记和报告。  
  
但整个系统里最关键的设计是：所有新发现，一开始都**被视为幻觉**  
。  
  
任何新找到的东西，必须先放进hallucinations/  
目录，而不是findings/  
。只有通过了层层验证关卡，才能被“晋升”：  
- 关卡0: 存在可编译的验证程序。  
  
- 关卡1: 验证程序能在干净的VM快照中复现崩溃。  
  
- 关卡2: 崩溃具备可利用性（不是空指针解引用这类无害崩溃）。  
  
- 关卡3: 漏洞能以标准用户身份触发，不需要SYSTEM  
或管理员权限。  
  
听起来有点偏执，但很必要。这大大减少了提交给厂商的无用报告，也保证了整个流程中仍有人类的干预和思考。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibej9RFxH47LRS6Mg1xrn66JtPxxPeUx7lltxU09UdS7zU10Ksl09icJeL6X03XDQ5eotpHmP5SrEnPJNU0UCmZhCsTXtwOatFjg/640?wx_fmt=png&from=appmsg "")  
## 知识循环：系统越用越聪明的地方  
  
这是我最满意的一部分。每次模糊测试启动前，工具都会先查询我自建的检索增强生成（RAG）索引，看看有没有针对这个目标的历史发现。每次崩溃和发现的结果也会被记录，形成一个持续的反馈循环——系统真的会随着每次挖掘变得更聪明。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfvjKZ10TkwammqRl7KVMt6TOjWWmWIDH358trPjGMPzWRNNWibE3JwohftDt4iaecYnZTJxRwm4VPibp1SdYibv5EplDYCKf8rbZU/640?wx_fmt=png&from=appmsg "")  
  
循环大概是这样的：先查询知识库了解历史；收集所有崩溃信息；用补丁信息、赏金结果等丰富数据；用FAISS向量库索引所有内容；最后用更丰富的上下文开启下一次挖掘。这样，如果前一次在ntoskrnl.exe  
里发现过某种崩溃模式，下一次针对它的战役从一开始就知道了。  
  
系统还会维护一个已知防御手段数据库。当发现某个目标有反恶意软件保护进程、严格的Authenticode验证等加固措施时，就会记录下来，从而降低该目标在后续挖掘中的优先级。  
## 赏金情报：算算划不划算  
  
除了RAG，还有一个专门的MCP负责追踪100多个漏洞赏金项目，并针对不同漏洞类型（RCE、LPE、越权等）计算投资回报率评分。在投入时间前，系统会根据目标的补丁历史、漏洞严重等级、项目赏金范围和历史接受率、已知防御机制等因素，估算预期收益。  
  
这直接影响了目标优先级排序。虽然不完美（赏金项目会变），但能避免那种花一周时间在一个最高赏金只有500美元的目标上，而错过25万美元虚拟机逃逸赏金的经典错误。  
## 成果：不只是听起来酷  
  
看到这里你可能会想，架构挺酷，但到底挖到东西没？  
### 两个Go标准库CVE  
  
针对Go语言golang.org/x/image  
包的模糊测试战役，两周内产出两个CVE。  
- **CVE-2026-33809 (x/image/tiff)**  
：一个8字节的恶意TIFF文件，利用错误的IFD偏移地址，能让解码器尝试分配约4GB内存，导致进程内存耗尽崩溃。影响范围极广，该模块的所有历史版本。  
  
- **CVE-2026-33812 (x/image/font/sfnt)**  
：一个精心构造的字体文件在解析GPOS表时触发数十亿字节的内存分配，同样是瞬间OOM。受影响的是特定的代码路径。  
  
这两个都来自一个更广泛的模糊测试行动，覆盖了21个Go标准库包，进行了约8000万次测试。基于语法的模糊测试是关键，它会生成结构有效但字段值异常的文件，从而提高命中率。  
### 一个Windows OEM服务零日链  
  
赏金情报系统将它标记为高价值目标：厂商有公开赏金、软件部署在数百万企业机器上、以SYSTEM权限运行且有丰富的WCF接口。  
  
逆向工具自动反编译了WCF接口，揭示了一个从标准用户到SYSTEM代码执行的四阶段攻击链：第一步，利用客户端认证实现的漏洞绕过命名管道认证；第二步，利用WCF方法中的未授权URL参数，将SYSTEM服务变成一个服务器端请求伪造（SSRF）触发器；第三步，利用特殊的更新包描述格式，注入恶意更新目录；第四步，结合一个已签名的旧版内核驱动，完成内核读写提权。整个过程已在Windows 11 25H2上验证。  
### macOS应用分发平台的两个发现  
  
利用Raptor等macOS工具套件，发现了两个问题：一是某个框架会读取浏览器历史记录和Mac隔离数据库；二是一个生产环境应用捆绑包中竟包含了一个众所周知的JWT调试RSA私钥，结合偏好设置篡改可导致恶意更新。  
  
这些都得益于“静态分析定位 -> Frida动态验证 -> 自动起草报告”的工作流。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfdnIMJibBykzsCbC5WpjWQumGScH5icwEX5acAibldRzxOks84IFfll1a3apUMIdkia5ibsYsJ3nefpf1LhntTHgadmjqWepZo4Rpc/640?wx_fmt=png&from=appmsg "")  
## 成本核算：值不值？  
  
这类系统绕不开的问题：划得来吗？5台Proxmox虚拟机、Claude Max订阅、构建和维护300多个工具的投入，都不是免费的。  
  
我还为此专门写了个工具——TokenBurn，来监控令牌使用情况，对比订阅成本和按API付费的差异。对于安全研究这种突发性强的任务，订阅模式通常更划算。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdIE3PLf1XxqOfwzuW6f2Xjelx74Za8AtuBfKibib49ia7NszyLLOqTFvKWt2ztNibMZM2NUJsZ7NkdjYI8c4XAF7tXkNPu2FwZB6c/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcwHEueMF2cx4QI0WBAC4J7fHyM416NRPbmkRaOkjHELsFibKxgOia86ibvONtPoNCJsd9HVTN6Gg4BQsY1OnBpTTyYoYTbnwWRSU/640?wx_fmt=png&from=appmsg "")  
  
关于“每个漏洞的成本”，系统会追踪。简单来说，就是用总计算（虚拟机小时数）除以已验证的发现数（注意，是那些通过了幻觉垃圾桶验证的）。大多数战役颗粒无收，但那些成功的战役，因为有了知识循环的指引，往往耗时更短。  
  
更重要的是趋势——单次发现成本随着系统运行时间显著下降。早期的战役很“贵”，因为要铺工具、试错、填满幻觉垃圾桶。近期的战役则受益于积累下来的海量上下文：RAG知道哪些二进制加固了；赏金情报知道哪些项目值得追；语法生成器知道哪些文件格式的字段容易出问题。  
## 反思与关键教训  
> 教训一：幻觉垃圾桶必须是第一道关卡。早期版本太信任AI输出了，这是个错误。LLM驱动的分析听起来很自信，但未必反映现实。“有罪推定”模式（所有发现先丢进幻觉桶）将误报率压到了几乎为零。  
  
> 教训二：务必在低权限环境下验证。好几个早期发现最终证明只能在管理员或SYSTEM下触发。最糟糕的是一个硬件诊断代理的命名管道漏洞，分析时用的是SYSTEM上下文，普通用户根本访问不了这个管道。  
  
> 教训三：记录负面结果。当发现目标有强防御（如AM-PPL）时，一定要把它记入已知防御数据库，防止以后在同一个死胡同里浪费时间。  
  
> 教训四：知识循环会产生复利效应。每个战役（即使是失败的）都在让下一个战役更高效。运行了20次战役的系统，其单位发现成本远低于刚开始的时候。  
  
## 怎么把拼图拼起来  
  
如果你也想搞类似的系统，我的架构建议是：MCP服务器用薄包装，业务逻辑厚重独立；实现跨工具调用的共享会话，避免重复连接消耗；设计统一的模糊测试接口，让自动化引擎调用逻辑保持一致；确保所有产出（崩溃、发现、补丁等）都能反馈到知识循环里。  
## 下一步怎么走？  
  
目前系统还需要我在关键节点做决策，比如判断一个崩溃值不值得追，或一个目标防御太强是否该放弃。下一步是收紧反馈循环，让更多这类决策能基于积累的知识库，而非我的直觉。完全自主？我觉得还没到那一步，幻觉垃圾桶的存在本身就说明了问题。目标是在合适的时机呈现更精准的信息，辅助决策。  
### 参考资料  
  
[1]   
https://blog.zsec.uk/bullyingllms/  
  
