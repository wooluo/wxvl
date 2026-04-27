#  DeepZero：开源的驱动程序漏洞自动化研究引擎，如何改变攻防格局？  
原创 网空闲话
                    网空闲话  网空闲话plus   2026-04-27 00:24  
  
网络安全战场上，一种名为“自带漏洞驱动程序”（Bring Your Own Vulnerable Driver, BYOVD）的攻击技术正成为勒索软件运营者和国家级APT组织的惯用利器。攻击者利用合法签名但存在漏洞的Windows内核驱动程序，通过加载该驱动程序获得与操作系统内核同等的执行权限，从而绕过安全软件、关闭端点检测与响应（EDR）系统、甚至植入持久化后门。从被广泛报道的Scattered Spider团伙到朝鲜Lazarus组织，BYOVD攻击的身影频繁出现。然而，手动挖掘内核驱动中的零日漏洞需要深厚的逆向工程功底和大量时间投入，成本高昂。2026年4月，开发者416rehman推出的开源项目DeepZero，试图以自动化的方式颠覆这一现状。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lQ1jXOMq3d1gj1DEJZP4LeHuHEDRDHFDpU0QSCiaeqnicibibz49odqicialFMH4v8CckGa76TIHx0f3CQNdTjHe7ccWW5utxyAVjR5uPlzysoyZw/640?wx_fmt=png&from=appmsg "")  
### 一、项目概览：漏洞研究流程的工程化重构  
  
DeepZero是一个基于Python 3.11+的自动化漏洞研究框架，其宣传语“在你睡觉时也能找到零日漏洞”并非夸大其词。根据官方介绍，该框架被明确设计为“一个可恢复的并行流水线引擎”，能够无人值守地处理海量Windows内核驱动程序数据集。  
  
与传统的将反编译器、静态分析器和大型语言模型（LLM）用脆弱的bash脚本拼凑的做法不同，DeepZero采用“流水线即YAML”（Pipeline-as-YAML）的声明式配置。研究人员只需将分析流程写入一个YAML文件，DeepZero便负责处理编排、并行执行、容错和状态持久化。该项目采用MIT许可证，代码由98.9%的Python和1.1%的Jinja模板构成，可在Windows和Linux系统上运行。截至参考材料撰写时（2026年4月26日），DeepZero在GitHub上已获得124个star和15个fork，代码库共有71次提交——这些数字虽然不算耀眼，但正如作者评论所言，“掩盖了代码库的雄心壮志”。  
### 二、技术架构：四种处理器与原子状态模型  
#### 2.1 处理器的类型与语义  
  
DeepZero的流水线由一个**Ingest处理器**  
开始，后接任意序列的**Map**  
、**BulkMap**  
和**Reduce**  
处理器，每种处理器具有不同的输入输出语义：  
- **Ingest处理器**  
：唯一起点，接收目标文件或目录路径，返回样本列表。每个样本获得唯一ID、源路径和初始元数据。  
  
- **Map处理器**  
：一对一处理单个样本，必须线程安全。返回ProcessorResult  
，包含三种可能结果：ok  
（样本继续）、filter  
（有意排除）或fail  
（处理错误）。这一三状态判决跟踪贯穿整个运行过程。  
  
- **BulkMap处理器**  
：将所有活动样本一次性传递给单个外部进程调用，适用于启动成本高的工具（如semgrep）。返回与输入一一对应的结果列表。  
  
- **Reduce处理器**  
：全局性地看到所有活动样本，返回要保留的样本ID列表及顺序，其余样本被过滤。这是一个全局同步屏障。  
  
#### 2.2 原子状态持久化：最精妙的设计  
  
参考材料特别强调，DeepZero的状态模型是其“最有利于威胁研究的设计选择之一”。所有执行状态存储在work/<pipeline>/  
目录下每个样本的state.json  
文件中。写入操作是原子性的：先写入临时文件，再执行os.replace  
。此外，针对Windows平台，系统实现了重试机制以处理短暂的防病毒文件锁定——当扫描内核驱动程序时不可避免地会触发AV软件，这一设计极其贴心。  
  
这意味着用户可以随时按Ctrl+C  
中断运行，再次执行完全相同的命令后，DeepZero会立即从磁盘状态恢复，从中断处继续，无需重新处理已完成样本。使用--clean  
标志则可清空之前的状态重新开始。  
#### 2.3 LLM集成与成本控制  
  
DeepZero通过Jinja2提示模板和LiteLLM实现了与任意LLM提供商的集成。官方提供的LOLDrivers流水线中，LLM评估阶段的提示模板支持高达**900,000个标记**  
的上下文窗口，并可对输出进行正则表达式分类（如[VULNERABLE]/[SAFE]  
）。但更为务实的是其成本控制策略：低成本的过滤器（元数据筛选、哈希排除、semgrep静态扫描）在昂贵的AI阶段启动之前就对语料库进行层层筛选，最终只有排名靠前的少量候选样本进入LLM深度分析。正如材料中所言：“低成本的过滤器在昂贵的AI阶段启动之前就对语料库进行筛选”。  
### 三、LOLDrivers管道：BYOVD零日漏洞狩猎实战  
  
DeepZero代码库中附带了一个完整的示例流水线——**LOLDrivers**  
，专门用于探测Windows内核驱动程序中的BYOVD攻击面。研究界的主要防御数据库是loldrivers.io  
，DeepZero明确将其用作黑名单，使研究人员能够专注于尚未被收录的驱动程序——也就是可能出现新零日漏洞的区域。  
  
该流水线包含七个阶段：  
1. **discover（pe_ingest）**  
：使用LIEF库进行PE头解析，提取驱动程序元数据和攻击面信号。  
  
1. **kernel_filter（metadata_filter）**  
：筛选具有IOCTL表面的内核模式驱动程序，并按SHA256去重。  
  
1. **loldrivers_filter**  
：排除loldrivers.io  
上已收录的驱动程序（已知不良驱动程序跳过列表）。  
  
1. **decompile（ghidra_decompile）**  
：调用Ghidra无头反编译，并提取IOCTL调度函数。  
  
1. **semgrep_scanner**  
：使用自定义的semgrep规则对反编译出的C源代码进行批量扫描。附带的规则涵盖四类经典内核驱动程序漏洞：arbitrary_rw  
（任意读写）、buffer_overflow  
（缓冲区溢出）、method_neither  
（IOCTL不安全处理方法）以及msr_access  
（模型专用寄存器访问）。  
  
1. **pick_top_10（top_k）**  
：按semgrep发现的数量排名，保留前10个候选驱动程序。  
  
1. **assess（generic_llm）**  
：对每个幸存候选者进行LLM深度分析，输出带有漏洞标签的评估报告。  
  
### 四、对安全社区的深远意义  
  
DeepZero属于“日益壮大的AI辅助攻击性安全工具系列”。作者评论道，在这个系列中，“LLM不再仅仅是代码审查员，而是漏洞发现流水线上的重要环节”。对于红队而言，这一框架显著降低了BYOVD漏洞挖掘的入门成本；对于蓝队和CTI分析师而言，这意味着防御者必须预料到勒索软件攻击中会出现大量新披露的、存在漏洞但已签名的驱动程序。  
  
然而，DeepZero真正的贡献并非在于某个巧妙的单一技巧。正如材料中所总结的：“它坚持认为漏洞研究流程应该像数据工程流程一样严谨：声明式配置、原子状态、可恢复性和可插拔阶段。”这种理念将漏洞研究从“手工艺”提升到了“工程化”的层面。  
### 五、现状、局限与未来  
  
截至报道时，DeepZero的REST API仍被明确标记为“正在开发中/实验性”且“部分损坏”。其内置处理器共有七个：file_discovery  
（摄取）、metadata_filter  
（元数据过滤）、hash_exclude  
（哈希排除）、generic_llm  
（通用LLM）、generic_command  
（通用命令）、top_k  
（前K保留）和sort  
（排序）。外部处理器示例包括ghidra_decompile  
、loldrivers_filter  
、pe_ingest  
和semgrep_scanner  
。  
  
CLI提供了完整的控制能力：deepzero run  
执行或恢复流水线，deepzero status  
查看运行状态，deepzero validate  
验证流水线定义，deepzero list-processors  
枚举内置处理器，deepzero init  
搭建新流水线，deepzero interactive  
启动LLM支持的交互式REPL，以及deepzero serve  
启动REST API（实验性）。  
### 结语  
  
DeepZero是一个架构完善、积极开发的自动化漏洞研究框架，专为BYOVD零日漏洞挖掘而设计。其简洁的扩展原语使其能够推广到Windows内核驱动程序之外的其他应用场景。对于那些希望利用LLM增强漏洞挖掘能力，但又不想手动拼凑十几个工具的威胁研究人员而言，DeepZero代表了当前开源项目中一个值得密切关注的方向。正如参考材料所言：“它是今年最令人瞩目的开源项目之一。”  
  
  
参考资源  
  
1、  
https://github.com/416rehman/deepzero  
  
2、  
https://cyberwarrior76.substack.com/p/deepzero-automating-zero-day-discovery  
  
