#  如何使用MCP进行自动化漏洞挖掘  
原创 骨哥说事
                    骨哥说事  骨哥说事   2026-05-09 00:19  
  
<table><tbody><tr><td data-colwidth="557" width="557" valign="top" style="word-break: break-all;"><h1 data-selectable-paragraph="" style="white-space: normal;outline: 0px;max-width: 100%;font-family: -apple-system, system-ui, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="color: rgb(255, 0, 0);"><strong><span style="font-size: 15px;"><span leaf="">声明：</span></span></strong></span></span></strong><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="font-size: 15px;"><span leaf="">文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由用户承担全部法律及连带责任，文章作者不承担任何法律及连带责任。</span></span></span></h1></td></tr></tbody></table>#   
  
#   
  
****# 防走失：https://gugesay.com/  
  
**不想错过任何消息？设置星标****↓ ↓ ↓**  
#   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hZj512NN8jlbXyV4tJfwXpicwdZ2gTB6XtwoqRvbaCy3UgU1Upgn094oibelRBGyMs5GgicFKNkW1f62QPCwGwKxA/640?wx_fmt=png&from=appmsg "")  
  
最近我有一周时间不在我的"日常工作"上，所以决定真正整理一下我的业余项目，处理各种管理任务。不过，写这篇文章，关于那个0day的"机器"，是我几周来一直想做的一件事。  
  
我将深入探讨我是如何使用Claude Code和MCP构建一个自动化漏洞挖掘系统的，以及它在此过程中发现的一些漏洞。从我所在的一个群里还诞生了一句有趣的引语：  
> Andy基本上是在让AI充当苦力  
  
  
这个标题来源于GenAI = Jenny以及这首歌：  
  
我从2026年初就开始构建这个系统，起初是在我的空闲时间，主要是我通常失眠的半夜；最终它演变成了一个成熟的研究工作流。我也会在文章中谈到这点，但这也是我构建TokenBurn的原因，用于计算我在Claude Max和硬件上的投资回报率：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZgQQGz2HLzF7v5U6UYG2DZRlGTGLYTObKWrKh9m4fiazoAZoPiaibPWDr0rZ3by5KdKWmZZGt4BGB5ERxGiaDPvfeliawM3UbA4vYks/640?wx_fmt=png&from=appmsg "")  
  
众所周知，使用大型语言模型(LLM)进行安全研究并非新鲜事，构建自定义工具来自动化漏洞挖掘中枯燥的部分也不是什么新鲜事，自动化模糊测试已经存在多年了。早在2014年，我就和Stephen Sims聊过关于他如何进行大规模模糊测试，这与我今天的设置没什么不同，只是当时没有集成LLM。然而，事实证明，结合Claude Code的MCP（模型上下文协议）和一个专门构建的实验环境，效果出奇地好。我知道可能有成百上千的人在做同样的事情，但无论如何，以下是我整合的内容、它是如何工作的，以及一些劳动成果。  
  
最初的动机来自于我在处理工具上花的时间比实际挖掘漏洞还要多。通常的过程大致如下：连接到虚拟机，部署一个二进制文件，反编译它，映射攻击面，设置模糊测试，分析崩溃，编写概念验证(PoC)，起草披露报告，提交给供应商或赏金计划。每一步都有自己的工具、自己的输出格式以及需要传递到下一步的上下文。我希望Claude来处理这些繁琐的工作，而我来进行思考和写作，因为我们都知道AI写出来的东西不像人写的，而且我想在一定程度上保持对自己技术能力的掌控。  
## MCP快速概览  
  
在深入细节之前，先为不熟悉的人快速介绍一下MCP。模型上下文协议允许你将工具作为可调用函数暴露给Claude Code。可以把它想象成给Claude提供对你终端命令的原生访问权限，但结构化了输入和输出的类型。每个MCP服务器只是一个注册工具的Python进程，Claude在对话中直接调用它们。无需复制粘贴终端输出，无需切换窗口。  
  
方法相当直接：将我研究工作流中的每个工具都包装成一个MCP服务器。最终，我拥有分布在5个虚拟机上的8个MCP服务器，以及超过300个工具（我不会列出具体细节，但这里是一个粗略概述）：  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">服务器</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">用途</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">实验控制器</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">SSH/WinRM会话，Proxmox虚拟机管理，基础逆向工程(RE)</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">猎人</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">补丁差异分析，攻击面枚举，10个模糊测试领域，崩溃分析，活动管理</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">逆向工程工具</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Ghidra、radare2、Frida及其他工具</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">漏洞利用开发</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Shellcode生成，堆喷射，控制流防护(CFG)绕过，PoC汇编，模拟执行</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">调试器</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">持久的WinDbg/GDB会话，能够在工具调用之间保持存活</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">检索增强生成(RAG)</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">对所有活动数据、发现结果和先前研究的语义搜索</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">基础设施</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">在Proxmox上配置和扩展模糊测试虚拟机</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">报告</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">披露报告，赏金提交，CVE请求</span></section></td></tr></tbody></table>  
  
每个虚拟机旁边的彩色圆点表示其所属的类别及其分配的MCP，这让我可以快速识别每个虚拟机的功能。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZgB43HQs5nVlROJIibF3tXW1YjkqOPwiabLChE27u5W3Ny15CIqWDXx2ia0oOznH2lQficibyVo3GiaYGwicfWLT8mMhqemZQ0zxkXBKQ/640?wx_fmt=png&from=appmsg "")  
  
所有八个服务器都作为独立的Python进程在Claude Code下运行，并注册在同一个.mcp.json  
文件中。当Claude需要检查Windows目标上加载了哪些驱动程序时，它会调用tool_surface_kernel_drivers  
。当它需要反编译一个函数时，它会调用tool_re_ghidra_decompile  
或众多可用逆向工程工具中的一个。当它需要启动一个模糊测试活动时，它会为我想要选择的领域调用相应的tool_*_fuzz_start  
，该工具会调用直接的工具并开始工作。  
  
每个服务器都是使用FastMCP构建的。服务器文件本身是简洁的@mcp.tool()  
包装器；实际的业务逻辑位于子目录中(hunter/  
、re_tools/  
、exploit_tools/  
、debug_tools/  
)。会话（SSH、WinRM）在对话和子代理中的工具之间持续存在，所以你只需连接一次，之后的一切都会正常工作。  
## 实验环境  
  
这项研究运行在一个基于Proxmox的"狩猎"范围上，该范围在隔离的网络段中包含5个虚拟机。我正在重写我的家庭实验室系列文章，但这是我新主机的规格，它将取代我家庭实验室系列中现有的NUC。https://blog.zsec.uk/homelab-clustering-pt1/  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZgkYNI9UiavyQib1XlrADIscuPeDz0MbLbmibAypqXzcsxMoRcFlUfvOOAN0UEsrBmbxRtFkiaQThAIfLVrmJj228lA5fickSmRMZZg/640?wx_fmt=png&from=appmsg "")  
  
这里没有什么特别新奇的东西（除了它们都拥有相当高的规格，因为它们运行在我的新家庭实验室主机上），只是为工作流量身定制的：  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">虚拟机</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">平台</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;min-width: 85px;"><section><span leaf="">角色</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">hunt-win11</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Windows 11（最新补丁）</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">主要目标</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">hunt-win11-n1</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Windows 11（前一版补丁，N-1）</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">与前一个&#34;补丁星期二&#34;进行二进制差异分析</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">hunt-winserv</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Server 2022</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">RPC、服务、Active Directory(AD)攻击面</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">hunt-kali</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Kali Linux</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Ghidra、radare2、GDB/pwndbg、angr、Volatility3</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">hunt-fuzz</span></strong></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">Windows 11</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;min-width: 85px;"><section><span leaf="">专用模糊测试（WinAFL、Jackalope、DynamoRIO）</span></section></td></tr></tbody></table>  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZiaNaoWzXJQXE6TIomQOTib41kWLd8bM8NibI6PCuiaQYFibmzram0hT7dd82B0E9YQia1Q9rPOTkJN8Ibs3svibrShVZfCibasJdllNf4/640?wx_fmt=png&from=appmsg "")  
  
感谢Claude提供的可视化效果  
  
每个Windows虚拟机还设置了一个lowpriv  
标准用户账户。这比你想的更重要。我稍后会详细解释原因，但简而言之，其中一个痛苦的早期教训是发现了从SYSTEM  
上下文看起来很棒，但作为普通用户完全无法触及的漏洞。  
  
Windows的二进制文件通过SFTP(tool_re_stage  
)被部署到hunt-kali  
进行离线分析，这意味着radare2  
和Ghidra  
不需要在Windows目标本身上运行。这两个Windows 11虚拟机（最新和前一版补丁）专门用于支持二进制差异分析：枚举"补丁星期二"之间的变化，对二进制文件进行差异分析，并识别与安全相关的修复，以便针对特定活动进行目标锁定。我还有一个专门用于补丁差异分析的MCP。  
## 活动与"幻觉垃圾桶"  
  
除非你与世隔绝，否则你可能已经深切地意识到，LLM模型会产生幻觉，它们会令人信服地告诉你一个谎言或将你引向歧途，因为它们在某种充满氧气的计算机梦境中产生了幻觉。  
  
为了对抗这些"计算机毒瘾患者"，所有的狩猎工作都被组织成一个个活动。一个活动本质上是hunts/campaigns/  
下的一个目录，具有结构化的布局，用于存放发现、崩溃、覆盖数据、笔记和披露信息。使用tool_campaign_create  
创建一个活动，其他所有东西都附属于它。  
  
现在，这是整个系统中最重要的设计决策，也是我希望在第一天就做出的决策：**所有发现都始于幻觉**  
。  
  
每一个新发现都会进入hallucinations/  
目录，而不是findings/  
目录。只有在通过验证关卡后，它才会被提升：  
  
**关卡 0:**  
 存在PoC并可编译**关卡 1:**  
 PoC在干净的虚拟机快照中复现了崩溃**关卡 2:**  
 崩溃是可利用的（不仅仅是空指针解引用或优雅退出）**关卡 3:**  
 漏洞触发条件为普通用户，非SYSTEM或管理员  
  
这听起来很偏执，而且有充分的理由，因为我在寻找可利用的漏洞，我希望系统拥有一定程度的自我认知能力，从我对它施压转为它对自己施压来识别缺陷。这让我免于向供应商提交无意义的东西，而且在流程中有人类的干预和思考也有帮助，这样就不会向项目和公司发送大量的报告和邮件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZia2MpInKeMJ9icJ65AfnNBgCcI8NOeiaxHf9rqestJ6Wt2KrxNoIpK43O8pq6uTWahAMULtYbcPlD6I4RhOeAbSKcOU9eGVga7ao/640?wx_fmt=png&from=appmsg "")  
  
例如，在一次早期的狩猎会话中，自主引擎通过手动分析标记了6个发现，日志和反编译输出中看起来很有希望，但经过手动审查和干预后，所有6个都在动态分析中被推翻，"幻觉垃圾桶"在它们接近最终报告之前就捕获了每一个。  
  
提升流程是tool_finding_promote  
 (hallucinations/  
 → findings/  
)和tool_finding_demote  
（如果后续有东西被证明无效，则退回到原处）。很简单，但它强制执行了一个纪律：没有证据，任何东西都不能离开这个流水线。  
## 知识循环  
  
这是我最满意的部分。每个模糊测试启动工具在启动前都会查询我自己的检索增强生成(RAG)索引，寻找先前的发现。每次崩溃和发现之后都会记录结果，目标是建立一个连续反馈循环，让系统随着每次狩猎而真正变得更智能。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZiajOQjhBqryPQdUx4BPH4HVrC9rqCAfJVH1KvH5K1WRLPLuDCia0cdya8wYQRQFnK3KMhEGrH3sK0G1WyBI2fyNEjyEzqYW12LA/640?wx_fmt=png&from=appmsg "")  
  
早期RAG和模型的迭代版本  
  
该循环的工作方式如下：  
1. **狩猎**  
 - 在开始一个活动前，查询知识库："我们以前在这个二进制文件或应用程序类型中看到过崩溃吗？哪些技术奏效了？哪些防御措施阻止了我们？"  
  
1. **收集**  
 - 所有10个领域中的每一次崩溃都会随着领域、目标和崩溃类别被记录。  
  
1. **丰富**  
 - 供应商安全公告、补丁差异、变体分析匹配、赏金提交以及覆盖平台期事件都会作为输入。  
  
1. **学习**  
 - 所有内容都会自动索引到一个带有句子的FAISS向量存储中。  
  
1. **重复**  
 - 下一次狩猎从更丰富的上下文开始。  
  
如果我在一个活动中对ntoskrnl.exe  
进行模糊测试并发现了一个崩溃模式，那么下一个针对ntoskrnl.exe  
的活动就会知道它。跨活动的重复出现的漏洞类型通过语义相似性自动显现。去重无需手动操作。  
  
该系统还维护一个已知防御数据库。当目标被证明是强化的反恶意软件保护进程(AM-PPL)、并行（SxS）保护、严格的Authenticode验证时，这些都会被记录。这些防御措施会成倍地降低目标在未来狩猎中的优先级分数，防止系统在相同的死胡同里浪费循环。在最初的几个活动撞上AM-PPL墙之后，系统就完全不再推荐这些目标了。  
  
除了实验室的RAG索引，我还构建了一个单独的本地RAG系统，它索引了我过去十五年的笔记"大脑转储"以及5800多条公共Sigma规则、1025个精选的GitHub仓库、工具文档等总计超过561,000个数据块。它在本地使用Ollama运行，并且也作为一个MCP服务器工作，所以Claude可以在狩猎期间内联查询我的整个攻击性安全知识库。当我询问某个技术时，我得到的是我自己的方法论及我使用的确切命令，而不是来自训练数据的通用摘要，并且它像我一样不断学习新东西。  
## 赏金智能  
  
除了RAG，我还有一个MCP，它跟踪跨多个平台的100多个漏洞赏金计划，并评估跨漏洞类别的投资回报率(ROI)（远程代码执行(RCE)、本地权限提升(LPE)、认证绕过、类型混淆、释放后使用(UAF)、堆溢出）。在为一个目标投入时间之前，它会根据以下几点估算预期支出：  
- 目标二进制文件的补丁历史（频繁打补丁 = 被发现的攻击面越多 = 可发现的漏洞越多）  
  
- 漏洞类别和严重性等级  
  
- 计划的支出范围和历史接受率，加上基于特定类型发现结果的"分析人员知识"  
  
- 目标上存在的已知防御机制  
  
这些信息会输入到目标排名中，自主狩猎引擎使用它来决定下一步模糊测试什么。虽然不完美，因为赏金计划的范围和支出会变化，但它可以防止犯下典型的错误，比如为一个最高赏金仅500美元的目标花费一周时间，而旁边可能有一个价值25万美元的超管理器逃逸赏金。  
## 劳动成果  
  
现在架构已经分解完毕，你可能想知道，嗯，这很酷，但是值得吗？  
### 多个Go标准库CVE  
  
针对Go的golang.org/x/image  
包的模糊测试活动在两周内产生了两个CVE。两者都是OOM漏洞，会导致任何处理不受信任输入的Go进程崩溃。这些漏洞存在于标准库的扩展图像包中，这意味着任何处理用户提供图像或字体的程序（Web服务器、聊天平台、持续集成(CI)流水线）都可能受到影响。  
#### CVE-2026-33809 - x/image/tiff: 恶意IFD偏移导致的OOM  
  
Go issue #78267  
  
一个特意构造的8字节TIFF文件，其IFD偏移地址设置为0xFFFFFFFF  
，会导致通过io.Reader  
路径（非ReaderAt  
）解码时，buffer.fill()  
分配约4 GB内存，从而导致进程因OOM被杀。  
  
载荷实际上只有8个字节：  
```
\x49\x49\x2a\x00\xff\xff\xff\xff
```  
  
这是一个有效的TIFF头（小端序，魔数0x002A  
），后跟一个指向32位地址空间末尾的IFD偏移地址。当buffer.fill()  
尝试读取到该偏移地址时，它会分配一个足以容纳整个范围的缓冲区，对于一个8字节的文件，大约分配了4 GB的零。发生这种分配是因为safeReadAt  
（CVE-2022-41727的修复）没有覆盖reader.go:477  
处的IFD偏移地址读取，这是一个独立的代码路径。  
  
**受影响版本：**golang.org/x/image  
从v0.0.0到v0.37.0的所有版本，即每个曾经发布的版本。Go模块图谱显示有945+个下游包引入了易受攻击的代码。  
  
**修复：**  
 分块读取数据并分配缓冲区，将增长上限设定为输入的实际大小，而不是信任IFD偏移地址。我提交的修复是golang/image#25，合并为提交23ae9ed  
。  
  
**下游影响：**  
 已向多个下游消费者报告，因为最终影响的就是它们。并通过供应商的开源漏洞奖励计划提交给了上游。  
#### CVE-2026-33812 - x/image/font/sfnt: 未检查的GPOS类数量乘积导致的OOM  
  
Go issue #78382  
  
一个特制的字体文件在解析GPOS PairPos表时会触发数十亿字节的分配。在parsePairPosFormat2  
中，numClass1  
和numClass2  
作为uint16  
值直接从字体文件中读取，并且它们的乘积未经检查就传递给source.view()  
。当两个值都为65,535时，乘积乘以2达到约8 GiB，立即导致OOM。只有io.ReaderAt  
路径受到影响（[]byte  
路径受到切片长度的限制）。在调查过程中，我还发现了同一代码中的另外两个问题：  
- makeCachedPairPosGlyph  
和makeCachedPairPosClass  
在索引之前，并未验证从字体文件派生的索引是否在已解析的缓冲区内。  
  
- source.varLenView  
在计算总长度时没有检查整数溢出。  
  
**修复：**  
 在分配之前，针对maxTableLength  
验证类数量乘积；在PairPos kern函数中添加索引边界检查；并在varLenView  
中添加溢出检查。已提交为golang/image#26，合并为提交854c274  
。  
#### 更广泛的模糊测试活动  
  
这两个CVE来自一项更广泛的努力：对21个Go标准库包进行了模糊测试，每个目标在3-30分钟不等的会话中总计执行约8000万次。该活动涵盖了tiff  
、sfnt  
、webp  
、gif  
、png  
、jpeg  
、gob  
、asn1  
、x509  
、pem  
、ssh  
、zip  
、tar  
、gzip  
、xml  
、html  
、ccitt  
、tiff/lzw  
等。只有TIFF和SFNT产生了已确认的漏洞。WebP和GIF基于维度的分配问题经Go维护者确认属于预期行为。  
  
这里的语法模糊测试领域是关键。与其向图像解析器投掷随机字节（这通常只会导致"无效格式"错误），语法引擎生成结构有效但包含对抗性字段值的文件。对于TIFF，这意味着一个具有恶意IFD偏移地址的有效头。对于字体，意味着具有极端类数量值的有效OpenType结构。  
### OEM服务0日漏洞 - 认证绕过 + 服务器端请求伪造(SSRF) → SYSTEM代码执行  
  
赏金智能流水线将一个Windows OEM系统管理代理标记为高价值目标：该供应商运行着公开的赏金计划，该软件安装在数百万台企业机器上，它运行着具有丰富Windows Communication Foundation(WCF)接口的特权SYSTEM服务，是第三方OEM软件，通常受到的审查比操作系统组件要少。逆向工程工具反编译了WCF接口，揭示了完整的服务契约。接下来是一个从普通用户到SYSTEM代码执行的四阶段攻击链。  
  
**1. 命名管道认证绕过**  
该更新服务暴露了多个SYSTEM级别的WCF命名管道，任何本地用户都可以访问。有趣的是：身份验证机制完全在客户端实现。服务器对传入的管道连接不执行任何身份验证。我通过AppDomainManager  
注入到供应商自己的已签名服务二进制文件中绕过了它。  
  
**2. 通过WCF进行SSRF**  
其中一个WCF方法接受一个攻击者可控的URL参数，并且没有管理员检查。与接口中的其他方法不同，这个方法完全跳过了权限验证。SYSTEM服务会尽职尽责地对你提供的任何URL执行HEAD + GET请求，并使用供应商特定的用户代理字符串。通过显示SYSTEM上下文请求攻击者控制端点的HTTP日志证实了这一点。  
  
**3. 目录注入**  
攻击者精心构造的更新包描述符被接受并作为适用的更新返回。数据契约使用供应商特定的序列化格式。合成的XML会导致反序列化错误，因此我们必须从合法响应中提取确切的格式。服务日志确认了注入，显示我们伪造的"关键更新"被库存接受了。  
  
**4. SYSTEM二进制文件执行**  
触发完整的更新流程会导致SYSTEM服务执行以下操作：  
1. 从攻击者控制的URL下载  
  
1. 验证包大小 - **通过**  
  
1. 验证SHA256校验和 - **通过**  
  
1. 验证Authenticode签名 - **通过**  
  
1. 以SYSTEM权限执行二进制文件  
  
Authenticode检查是剩下的障碍：有效载荷必须是供应商签名的。但是存在一条"自带漏洞驱动(BYOVD)"的路径：供应商自己的一个旧版本内核驱动程序拥有WHQL签名（Windows硬件质量实验室），不在易受攻击驱动程序阻止列表中，即使在启用基于虚拟化的安全(VBS)的代码完整性防护(HVCI)时也能加载，并提供任意内核读写原语。该驱动程序有一个已知的CVE，但在完全打过补丁的Windows 11上仍然可加载。因为我并不从事完全披露，我不会在这篇博客文章中谈论它。  
  
整个攻击链在Windows 11 25H2（Build 26200）上得到了验证。Ghidra反编译、Frida动态分析和WCF接口逆向都是通过MCP工具完成的：将二进制文件部署到hunt-kali  
，运行Ghidra无头分析，然后用Frida钩住实时服务以确认行为。已提交给供应商并确认为有效。  
### macOS App Distributor - 两项发现  
  
这台"狩猎机器"不仅限于Windows和Linux，因为编排器运行在我的Mac上，所以在那里我也拥有一个完整的工具套件，包括Raptor。使用这套工具加上Raptor，通过供应商的赏金计划，获得了针对一个macOS应用程序分发平台的两项发现：  
  
**浏览器历史记录外泄**  
 - 一个捆绑的框架在启动时读取浏览器SQLite数据库以及macOS隔离数据库。静态分析发现了初步线索；通过MCP逆向工程工具的Frida动态分析确认了实际的查询行为。有趣的是：虽然浏览器历史查询结果最终限定在特定搜索词上，但对隔离数据库的查询（SELECT * FROM LSQuarantineEvent  
）是完全无过滤的，会外泄用户曾经下载过的每个文件。  
  
**生产包中包含调试RSA密钥**  
 - 生产版应用中捆绑的一个debug.pem  
文件竟然是jwt.io网站上的RS256示例密钥，这意味着私钥是公开已知的。结合使用CFPreferencesSetAppValue  
来覆盖Sparkle更新框架的签名验证密钥。概念验证是一个Swift脚本加上一个Frida钩子，展示了跨进程偏好注入，从而支持恶意更新分发。  
  
这些发现是工作流实践中的一个很好的例子：通过逆向工程工具的静态分析识别了线索，Frida动态插桩确认了行为，报告服务器起草了赏金提交。Frida的后续跟进工作将两者从"需要更多信息"转变为已分类，这是一个有用的教训：仅靠静态的发现通常需要运行时验证才能满足供应商的要求。  
  
以上只是所发现漏洞的一部分，此外还有以下几项正在进行中：  
- 影响多个供应商的3个Windows本地权限提升(LPE)  
  
- 影响多种应用程序（主要是桌面应用）的4个远程代码执行(RCE)  
  
- 影响一个库（有待披露）的2个释放后使用(UAF)  
  
- 在macOS/Windows上通过多款软件堆栈发现的一些信息泄露  
  
## 经验教训  
  
我从这个过程中学到了一些东西，并持续反馈给系统；**"幻觉垃圾桶"应该是关卡0。**  
 我的系统第一个版本相信它自己的输出。这是一个错误。LLM驱动的分析会产生听起来自信的评估，但这些评估可能反映现实，也可能不反映现实。"有罪推定"的方法，即每个发现都始于hallucinations/  
，几乎实现了零误报率。如果我重头开始，这将是我构建的第一样东西。  
  
**永远从低权限上下文进行验证。**  
 多个早期发现被证明只能在管理员或SYSTEM上下文中触发。最糟糕的例子是：一个硬件供应商的诊断代理被标记为具有可利用的命名管道，但分析是从SYSTEM上下文运行的。而从普通用户的角度看，这个管道是无法访问的。关卡3 (tool_lowpriv_check  
) 本应从第一天就存在。每个发现在被提交之前，都需要以标准用户身份进行验证。  
  
**记录负面结果。**  
 当一个目标被证明是强化的（反恶意软件保护进程(AM-PPL)、并行（SxS）保护、严格的签名验证）时，记录这种防御机制。已知防御数据库现在会成倍地惩罚强化目标，防止未来的活动在相同的死胡同里耗费循环。在几次活动撞上同一批二进制文件的AM-PPL墙之后，系统就完全停止推荐它们了。  
  
**知识循环会带来复合效应。**  
 每次活动都让下一次更高效。在运行了15次以上的活动后，系统关于模糊测试什么以及如何进行的建议，明显比每次从头开始要好。每次活动前进行的RAG查询确实防止了模糊测试中最昂贵的错误：使用相同的种子对相同的二进制文件运行相同的活动，然后一无所获。  
## 成本计算  
  
对于任何这样的系统，一个显而易见的问题是：它真的值得吗？在Proxmox主机上运行五个虚拟机，订阅Claude Max，以及构建和维护跨八个MCP服务器的300多个工具所花费的时间，这些都不是免费的。我很好奇，如果我把这些花在API额度上，而不是Claude Max订阅上，总成本会是多少，所以我也为此构建了一个工具。  
### 跟踪令牌使用情况  
  
第一个问题是了解你在花什么。使用Max订阅的Claude Code不是按令牌计费的，但这并不意味着令牌是免费的。有速率限制，了解你的消费模式可以告诉你是否从订阅中获得了价值，或者按API计费是否更划算。  
  
我构建了TokenBurn来回答这个问题。它是一个自托管的仪表板，同步运行Claude Code的每台机器的令牌使用数据，汇总数据，并按模型和项目细分消耗情况。每台机器运行一个轻量级的同步脚本，解析本地会话数据并将其导出为JSON。然后仪表板显示每日消耗趋势、按项目细分、每小时活动模式，以及关键的是，将相同使用量的API费率与固定订阅费进行比较。  
  
具体到安全研究，使用模式是突发的。一个狩猎会话可能会在一次对话中，通过协调一个15步的攻击面枚举、反编译函数、交叉引用发现结果、起草披露报告，从而消耗大量上下文令牌。然后，在模糊测试运行时，可能一天都没有消耗。TokenBurn捕捉了这种模式并使其可见，而不是让你猜测订阅是否划算。  
### 每个发现的成本  
  
我最初开始这个过程并不是为了赚钱，最初挖掘CVE是因为我之前在职业生涯中获得了两个CVE（https://blog.zsec.uk/nvidia-cve-2020/和https://blog.zsec.uk/cve-2017-3528/），现在通过这个过程，这个数字增加到了4个，还有几个正在与供应商沟通中。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZhZ79GZ2ib5O6ZdcJCuAFia662gbgHLWiaoDxoAhAfxIofZcs8gNooBeiaa8RvEhwXcvj0wRff0UVWDLib0jnxRAhGhceWlqr9lvZ8o/640?wx_fmt=png&from=appmsg "")  
  
所以你可以争辩说，实际上，如果仅基于API成本，每个CVE可能花费了5000英镑。然而，订阅制为我节省了大量成本，并且实际上通过一些下游漏洞的赏金支付抵消了订阅成本。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TKdPSwEibsZia8ZonInuOJFsfGcBfI4t1InNSfzghNN3J6Q5wia0D5YrpJe3b6fv6GnicxQb7xT8b7A1T9ddeU8OzIcibMWdgIySKneaGlbc0sX0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZhMiaCQmm7X5pRIkZdRVhIaJibaSe50Zh0PnIjzYuWBic48hBdH2aia5kh4VYBhe08TLUe9NmCicGSNH1rYbLQMsvpgReD9NUtXPVVA/640?wx_fmt=png&from=appmsg "")  
  
尽管如此，我还是很好奇这些成本是多少，系统本身会跟踪这一点。每个活动都记录其创建时间戳、最后更新时间以及分配的虚拟机数量。分析模块计算一个直接的指标：总计算小时数（活动持续时间乘以虚拟机数量）除以已验证的发现数量。注意，"幻觉垃圾桶"里的发现不算，只有那些通过所有验证循环的发现才算。  
  
像所有事情一样，大多数活动产生零个已验证的发现。消耗数百个虚拟机小时的模糊测试可能一无所获。那些确实产生发现的活动，其花费的实际时钟时间往往比没有收获的活动要少，因为知识循环将它们导向那些先前存在更高漏洞概率的目标，而不是在强化的二进制文件上死磕。  
  
趋势比任何一个具体数字都更重要。"每个发现的成本"在系统生命周期内显著下降。最初几项活动在各个方面都很昂贵：构建工具、学习什么方法不奏效、用听起来很自信的无稽之谈填满"幻觉垃圾桶"。  
  
最近的活动受益于所有这些积累的上下文。RAG索引知道哪些二进制文件是加固过的。赏金智能知道哪些计划值得投入时间。语法生成器知道哪些文件格式字段是有趣的。  
### 基于投资回报率(ROI)的目标选择  
  
在任何活动开始之前，赏金智能模块会估算预期回报。这不是复杂的财务建模，而是一种务实的计算：**预期投资回报率 = 保守支出估计 / 预估的狩猎小时数**  
输入很直接。狩猎小时估算是基于实践经验：一个DLL劫持通常需要大约8小时来识别和证明，一个本地权限提升(LPE)大约20小时，一个远程代码执行(RCE)大约40小时，而像类型混淆或释放后使用(UAF)这样的内存损坏类可能需要轻松达到80小时。这些都是保守估计。它们假设你不会走运，并且验证（幻觉垃圾桶逻辑流程）需要花费实际时间。  
  
支出估算使用每个计划公布范围的最低值，而不是典型值或最大值。这是一个深思熟虑的选择。系统应该对支出持悲观态度，而对其他方面保持乐观。系统跟踪了100个赏金计划，针对从低端的信息泄露到顶级的虚拟机监控程序逃逸等漏洞类别给出了支出范围。  
  
竞争调整是最后的乘数。一个低竞争的计划保持90%的预期价值。像主要操作系统供应商那样的高竞争计划则降至40%，因为你可能发现漏洞，但也可能有其他三位研究人员首先报告它。竞争非常激烈的计划降至20%。这可以防止系统在那些首个报告机会渺茫的最大头条赏金上钻牛角尖。  
  
最终效果是：系统自然会倾向于那些审查不足但赏金不错的软件的"甜蜜点"。第三方系统工具、OEM管理代理、企业中间件，这些安装在数百万台机器上但不像Chrome或Windows内核那样吸引研究人员关注的软件。前面描述的OEM更新服务0日漏洞就是这个排名的直接产物。  
## 一个诚实的评价  
  
这个系统已经回本了。来自已验证发现的赏金支付已经超过了Proxmox硬件、订阅费以及构建工具所投入的时间的总成本。这是否意味着你可以复制我所构建的一切并快速赚钱？也许吧，但这只是从乐观角度看。  
  
完整的情况包括许多没有发现任何东西的活动。导致死胡同的覆盖度平台期。看起来可利用但实际上并非如此的崩溃。"幻觉垃圾桶"比发现目录要大得多，而且这正是设计意图。这意味着系统在浪费我的时间之前，正在捕捉自己的假阳性。同时，我从大量经验的输入也做了很多工作，让工具实际捕获LLM的幻觉，并且在它忘记其系统提示并开始质疑安全研究的伦理时，偶尔不得不"欺负"一下它。  
  
从长远来看，让经济学起作用的不是任何单一发现，而是发现和整体研究的复合效应。每个失败的活动仍然为知识库做出了贡献，每个负面结果（这个二进制文件有AM-PPL保护，这个命名管道仅限管理员）防止了未来的活动重复同样的死胡同。运行其第二十次活动的系统，其每次发现的平均运营成本，比运行第一次的系统要低得多，尽管订阅成本是相同的。我还通过为每次活动构建CLAUDE.md  
文件，调整其记忆和系统提示，以及让它越来越多地转向本地模型，来帮助它学习、变得更好并使用更少的令牌。  
## 各部分如何协同工作  
  
对于任何考虑构建类似系统的人，以下是高级架构：**薄服务器包装器，厚重的业务逻辑**  
 - MCP服务器文件只是函数调用周围的@mcp.tool()  
装饰器。所有真正的工作都存在于专用模块中，其中一些是Claude编写的，一些是我自己实际编写的。这意味着你可以独立于MCP管道来测试和迭代业务逻辑，并在需要时调整和调整编码。  
  
**共享会话**  
 - 每个服务器连接一次，会话在对话中的所有工具调用之间持续存在。当你链接10多个步骤（部署二进制文件、反编译、识别函数、设置断点、跟踪执行、分析崩溃）时，如果每一步都重新连接，足以耗尽令牌，并让我仅存的一点理智也悄然消逝。  
  
**统一的模糊测试接口**  
 - 每个领域都有相同的工具模式（setup  
/start  
/status  
/crashes  
/stop  
）。自主引擎不需要特定领域的分发逻辑；它只需选择正确的领域并调用相同的工具序列。  
  
**所有信息都馈入循环**  
 - 崩溃、发现、覆盖数据、微软安全响应中心(MSRC)公告、补丁差异、赏金结果，所有这些都被索引、可搜索，并为下一次狩猎提供信息。运行其第一次活动的系统一无所知，然而运行其第二十次活动的系统对于目标哪些二进制文件以及跳过哪些有主见，它还拥有来自先前19次活动的丰富知识，包括我的"大脑转储"和先前研究的详细信息。  
  
## 接下来会怎样？  
  
目前该系统仍需我在关键节点作出判断，主要是决定某个漏洞是否值得深究、某条发现链是否切实可行、目标的防御手段是否导致攻击不可行。  
  
下一步是压缩反馈循环，让更多决策能够依据积累的知识库而非我的直觉做出。  
  
目前尚无法完全自主运行（我认为我们还未达到那个阶段，设立幻觉问题反馈箱是有原因的），但要在恰当时机更有效地呈现正确信息。我还在训练自己的门控差分网络+基于混合专家（MoE）的Transformer模型，它最初基于Qwen架构，但已通过大量其他数据进行了扩展，并调整了权重设置，以聚焦于我的大量研究成果，从而帮助完善研究学习过程。  
  
若你对用模型上下文协议(MCP)进行安全研究感兴趣，该协议本身在modelcontextprotocol.io网站上有详细文档，真正的难点并不在于构建服务器——那只是简单的Python编程；真正的挑战在于设计一套验证流程，以确保你能信赖其输出。建议先从设立幻觉问题反馈箱开始着手。  
  
原文：  
https://blog.zsec.uk/bullyingllms/  
  
- END -  
  
**感谢阅读，如果觉得还不错的话，动动手指给个三连吧～**  
  
