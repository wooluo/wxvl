#  Google检测到首个AI生成的Zero-Day漏洞利用链  
原创 铸盾安全
                        铸盾安全  河南等级保护测评   2026-05-13 16:00  
  
Google  
近期确认，其  
AI  
安全研究系统首次发现并生成了具备真实攻击价值的  
Zero-Day  
（  
0-day  
）漏洞利用方案。这一事件被视为  
AI  
正式进入高级漏洞研究领域的重要节点。根据报道，  
Google DeepMind  
与  
Project Zero  
联合开发的  
AI  
漏洞研究框架  
“Big Sleep”  
，成功识别出一个此前从未公开、且具有实际  
exploitability  
（可利用性）的内存安全漏洞。该漏洞属于典型的  
memory-safety vulnerability  
，可进一步演化为远程代码执行（  
RCE  
）风险，而传统  
fuzzing  
长时间运行也未能发现这一问题。  
  
Big Sleep  
并不是普通的大语言模型聊天机器人，而是一个具备代码分析、漏洞推理、自动调试、路径验证以及  
exploit  
构造能力的  
agentic AI  
系统。结合了  
Google DeepMind  
的大模型能力、  
Project Zero  
的漏洞研究经验，以及自动化执行与验证环境。  
Google  
将其定义为一种  
“AI-assisted vulnerability research agent”  
，即  
AI  
辅助漏洞研究代理。其工作流程包括分析代码提交（  
commit diff  
）、识别危险内存操作、自动构建触发条件、执行测试、验证漏洞是否具备  
exploitability  
，最终输出完整漏洞报告。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/hfjKPyxBDjrwQL08l8nHSIjDic5kWeBNfqz5LVnC7KBDI1rgo3ek7OfXulIVd4giaTpCPTFuofNzz6DbWyDAibfhw6ooWEOqcyZbOyESEdDJRA/640?wx_fmt=jpeg&from=appmsg "")  
  
此次发现的漏洞属于  
Stack Buffer Underflow  
（栈缓冲区下溢）类型，即程序在缓冲区起始位置之前访问内存，从而导致非法读取或写入。此类漏洞可能引发程序崩溃（  
Crash  
）、内存破坏，甚至进一步实现任意代码执行（  
Arbitrary Code Execution  
）。  
Google  
指出，传统  
fuzzing  
更依赖随机输入与覆盖率探索，而  
Big Sleep  
则通过代码语义理解与逻辑推理识别出了潜在危险路径，因此能够发现传统工具遗漏的复杂漏洞。  
  
与传统漏洞挖掘方式相比，  
Big Sleep  
的核心突破在于  
“  
推理驱动  
”  
而非  
“  
规则驱动  
”  
。传统安全研究通常依赖  
fuzzing  
、静态分析或人工代码审计。  
Fuzzing  
擅长大规模随机测试，但难以理解复杂逻辑；静态分析依赖规则匹配，误报较高；人工审计质量最高，但效率与成本问题明显。而  
AI  
系统则能够通过代码语义理解、长链推理、自动调试以及模式泛化能力，识别未知漏洞类别与复杂  
exploit  
条件。  
Google  
认为，这意味着漏洞研究正在从依赖经验和规则的时代，逐渐转向基于  
AI  
推理的新阶段。  
  
Google Threat Intelligence Group  
（  
GTIG  
）同时披露，  
2025  
年其追踪到约  
90  
个被真实利用的  
0-day  
漏洞，其中接近一半针对企业基础设施。  
Windows  
、  
Chrome  
与移动平台仍然是主要攻击目标，但企业边界设备和网络基础设施攻击正在持续增长。  
Google  
预测，未来  
AI  
将同时增强攻击者与防御者的能力：攻击者可以利用  
AI  
自动发现漏洞、快速生成  
exploit chain  
、自动  
bypass sandbox  
，并实现漏洞武器化；而防御方则可以使用  
AI  
自动检测漏洞、辅助修复以及提前阻断攻击路径。  
  
Google  
也特别强调了潜在风险。过去只有高级漏洞研究员才能完成的  
exploit  
开发工作，未来可能被  
AI  
部分自动化。这意味着漏洞发现与武器化的门槛将被显著降低，网络攻击的速度和规模都可能发生变化。未来的  
AI  
系统甚至可能实现自动构建  
payload  
、批量发现内存漏洞以及自动生成攻击变种。  
  
不过，  
Google  
认为当前阶段的  
AI  
漏洞研究系统仍然存在明显限制。例如误报率仍然较高，许多发现仍需人工验证；复杂  
exploit  
在真实环境中的稳定性有限；  
AI  
缺少完整上下文理解能力；并且整体能力仍然依赖训练数据与已有知识。因此，  
Big Sleep  
目前仍属于  
“AI-assisted  
（  
AI  
辅助）  
”  
阶段，而非完全  
autonomous offensive AI  
（自主攻击型  
AI  
）。  
  
这一事件的重要意义在于，  
AI  
已经不再只是用于代码补全、  
SOC  
分析或威胁情报分类，而是开始真正参与  
offensive security  
（进攻性安全）领域，包括主动发现未知漏洞、分析  
exploit  
条件以及辅助漏洞利用开发。这可能会深刻改变未来红队、漏洞研究、  
Bug Bounty  
乃至国家级网络攻防的运作模式。  
  
Google Project Zero  
长期追踪现实世界中的  
0-day  
利用事件，而此次  
Big Sleep  
的成果意味着网络安全行业可能正式进入  
“AI vs AI”  
的时代：  
AI  
自动挖洞、  
AI  
自动修复、  
AI  
自动检测攻击、  
AI  
自动生成  
exploit  
变种。未来攻防双方的速度与规模，都可能远远超过传统人工时代。  
  
  
