#  加密机制、性能与系统安全的“三体”平衡——Linux内核“Dirty 家族”漏洞三连的总结报告  
安天研究院
                    安天研究院  安天集团   2026-05-20 01:06  
  
点击上方"蓝字"  
  
关注我们吧！  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XBFaicYdOHk9oJTAiasqrYiaZqU1ZFQ68z7tXW67gdbWHrzJmv3Y69NODPBey4Z17Oj2kzHyYAaS5eeoicTXc1ibnEicohMWYIVRTfPKtTdjAvq80/640?wx_fmt=jpeg "")  
  
摘要：  
2026年4月29日至5月13日的两周时间窗内，Linux 内核连续披露了 Copy Fail（CVE-2026-31431）、Dirty Frag（CVE-2026-43284、CVE-2026-43500）与 Fragnesia（CVE-2026-46300）三个高危本地权限提升漏洞。三者与 2022 年披露的 Dirty Pipe（CVE-2022-0847）共同构成了 Linux 内核安全史上一个具有强烈代际特征的“Dirty 家族”漏洞谱系：均借助零拷贝路径将只读文件的页缓存页面“钉入”内核可写缓冲区，进而通过加密原语的原地操作在不触发脏页回写的前提下实现对页缓存的稳定写入。这一谱系将三个看似正交的工程目标——  
“  
加密机制、性能优化与系统安全  
”——置于一个真实可观察的“三体”耦合系统中：加密本应保护信息，却反过来成为越权写入的精确可控工具；性能优化逻辑普遍移除安全契约（skb_cow_data、out-of-place 操作）以追求热路径吞吐，却同时拆除了内存所有权的隔离墙；原有以“崩溃点”和“内存破坏”为预设的代码安全工程体系，对此类跨子系统、跨年份累积的“涌现性逻辑漏洞”几近失效，并在 AI 辅助漏洞挖掘“原语狩猎”新范式的冲击下显露结构性短板。本报告以 Dirty 家族为解剖样本，围绕三个悖论展开正向工程视角的辩证分析，并在结论部分将“执行体治理”理念映射到针对此类涌现性内核缺陷的微纵深防御工程实践。  
  
一、引言：“三体”问题的提出  
  
在跟进分析  
Copy Fail  
、  
Dirty Frag  
、  
 Fragnesia  
系列重大漏洞过程中，安天工程师陷入了思考，为什么上述漏洞都与系统加密机制耦合在一起。密码协议作为安全的基石，何以反而导致了重大的系统安全风险，但显然这并非是两种安全机制的条件竞争或冲突问题，还有另一个关键的要素——性能优化。对Linux的内核的  
加密机制、性能优化与系统安全  
单独审视  
时，它们的工程逻辑均明确且自洽：加密标准定义算法正确语义，性能优化消除冗余拷贝，  
系统  
安全机制保障内存隔离  
，但三者交互耦合时，却造成了复杂的连锁风险。这让我们自然联想到一个词——“三体”  
。  
  
"三体问题"（three-body problem）  
是经典天体力学中的著名难题。自牛顿力学体系建立以来，数学家发现：两个天体在万有引力作用下的运动可被精确解析（开普勒轨道），但当系统中存在三个相互引力的天体时，其长期运动呈现出混沌特征，无法求得稳定的解析解——任何微小的初始条件扰动都将导致轨道行为的巨大偏差。这一发现最早可追溯至1687年牛顿的《自然哲学的数学原理》，而"三体问题"的不可解性在19世纪末被庞加莱（Henri Poincaré）严格证明，成为动力系统混沌理论的经典范例之一。2006年，中国科幻作家刘慈欣的长篇小说《三体》出版，将"三体问题"从学术领域引入  
科幻  
文化语境。“三体"一词由此在中文互联网语境中获得了超越其物理学原意的文化生命力——它不再仅仅指代一个数学难题，更成为一种隐喻，用以描述"三个相互作用的变量在混沌中无法达成稳定均衡"的系统性困境。  
  
因此，  
本报告借用"三体"，  
希望形象的来表示加密机制、性能优化和系统安全在  
内核架构中交汇耦合——加密与性能交汇于原地操作路径，性能与安全交汇于页缓存共享，加密与安全交汇于内存语义的重新解释——整体行为便呈现"三体"式的混沌特征，涌现出不可预见的漏洞。  
我们希望以此  
揭示了操作系统内核安全领域一个长期被忽视的结构性张力——深层安全缺陷可能并非孤立代码错误的产物，而是多个合理设计在非线性交互中涌现的系统性后果  
。  
但同时，我们也需要指出这只是“借喻”，而非严谨的建模或框架构建。  
  
本报告并非新的FAQ 类报告或单一漏洞复盘，而是作为安天研究院系列文献的总结篇。我们已在《CVE-2026-31431（Copy Fail）漏洞 FAQ（上）》《CVE-2026-31431（Copy Fail）漏洞 FAQ（下）》《人与 AI 协同的漏洞分析新范式——Copy Fail 发现过程解析》《基于 Dirty Frag 漏洞发现过程的“攻击原语”思考——再论漏洞发现与分析工作的人机分工》以及《“分片失忆”——Dirty Frag 补丁如何催生了 Fragnesia 漏洞》等系列报告中，分别完成了单点漏洞的基本情况说明、技术机理解析、AI 辅助挖掘范式探讨与补丁副作用追踪。本总结篇的目标是跳出单点漏洞，从内核设计哲学与开源社区运营机制层面，对  
相关复杂的要素  
关系进行结构性规律提炼，并将这种规律  
映射到代码安全工程和防御当中  
。  
  
1.1 事件缘起：Dirty 家族漏洞与加密机制的深度耦合  
  
自2016年10月Dirty Cow（CVE-2016-5195）披露以来，Linux内核 “Dirty”系列漏洞逐步形成以内存子系统缺陷为共性的家族雏形。Dirty Cow 因内核写时复制（COW）机制的竞态条件，允许低权限用户篡改只读内存映射并提权，影响 2007 年后几乎所有 Linux 内核版本，是该家族的奠基性漏洞。2022 年 3 月，Max Kellermann 披露 Dirty Pipe（CVE-2022-0847），聚焦页缓存写入路径缺陷，可覆写只读文件并提权；同年 8 月，Dirty Cred（CVE-2022-2588）在 Black Hat 大会公开，通过内核堆内存重用机制交换特权凭证，实现无地址依赖的通用提权，进一步丰富了该家族的利用范式。自此，以 “页缓存写入（Page-Cache Write）” 为共同终点的漏洞类（bug class）逐步从孤立事件演化为一个可被命名、可被范式化的家族。  
  
2026 年 4 月 29 日，韩国安全公司 Theori 旗下 Xint Code 研究团队披露了 Copy Fail（CVE-2026-31431），将这一家族正式引入 “加密子系统作为通道” 的新阶段；5 月 7 日，韩国研究员 Hyunwoo Kim（@v4bel）公开了 Dirty Frag 文档，将两个独立模块（xfrm-ESP 与 RxRPC）以链式互补的方式组合为通用提权原语；5 月 13 日，V12 Security 团队的 William Bowling 又公布了 Fragnesia（CVE-2026-46300），该漏洞被 Hyunwoo Kim 描述为 “被 Dirty Frag 补丁意外激活” 的衍生漏洞，自此一周内连续出现的三个高危漏洞共同构成了 Dirty 家族的 “漏洞三连”。  
  
值得关注的是，这一家族并非传统意义上的内存破坏漏洞——它不依赖竞态条件、不会引发内核 panic、不需要逐发行版调整偏移量；其核心机制是 Linux 内核中三种工程力量的不当结合：零拷贝（splice 系列接口）作为性能机制将外部所有权的页缓存页面引入内核缓冲区  
、加密路径（AF_ALG、xfrm-ESP、RxRPC/rxkad）以原地操作的方式越过缓冲区所有权的隔离边界  
、页缓存（page cache）作为跨用户/跨容器共享的全局可写资源被默认信任  
。这种“三力  
纠缠  
”的特征，使 Dirty 家族在工程哲学层面具有不同于以往内核 LPE 漏洞的解剖价值。  
  
1.2 核心设问：加密机制、性能、系统安全是否存在竞争性冲突  
  
本报告将围绕以下三个悖论展开论述：  
  
•  
悖论一（加密作为安全增益与滋生破坏通道的负和对立）：加密作为一种保护信息机密性、完整性、真实性的信息安全机制，本应提升系统的整体安全水位；然而Dirty 家族表明，加密子系统恰恰因其“跨域汇聚”与“内部细节不可审计”的双重属性，成为破坏系统页缓存完整性的精确可控通道。  
  
•  
悖论二（性能要求与内存安全的零和互斥）：性能优化（splice 零拷贝、skb_cow_data 省略、AEAD 原地操作、skb_try_coalesce 合并）的工程逻辑追求“减少拷贝、共享所有权”，而内存安全的工程逻辑追求“复制后操作、明确所有权”——前者每一项收益的背后，几乎都对应后者的一次让渡。  
  
•  
悖论三（人机协同新范式与既有代码安全工程的代际错配）：Copy Fail 由 AI 辅助系统 Xint Code 在“仅一次操作员提示”的条件下，对 Linux crypto/subsystem约一小时的扫描发现，Fragnesia 由 Zellic 公司的 AI 智能体审计工具发现，宣告了“原语狩猎”（primitive hunting）取代“崩溃点搜索”成为主流漏洞挖掘范式；与此同时，原有以人工审计、模糊测试、以传统SAST/DAST 为骨架的代码安全工程体系，无论在审计认知规模、跨子系统语义推理，还是补丁副作用预测层面，均显示出结构性短板。  
  
1.3 “三体”平衡点界定：加密机制（算法与协议）、性能（优化与效率）、安全（防御与验证）的交互域  
  
Linux内核中呈现了如下复杂的三体样貌  
：  
  
•加密机制  
——以 AES-GCM（NIST SP 800-38D）、IPsec ESP（RFC 4303）、HMAC-SHA256、PCBC/FCRYPT 等算法与协议为核心，覆盖内核 crypto 子系统、xfrm 框架、AF_ALG 用户态接口、RxRPC/rxkad 等内核组件。  
  
•性能（优化与效率）  
——以 splice()/vmsplice()/sendfile()/MSG_SPLICE_PAGES 等零拷贝机制、scatterlist 散列、skb_cow_data 省略、skb_try_coalesce 合并、AEAD 原地操作（in-place）等为代表的内核热路径工程优化策略。  
  
•安全（防御与验证）  
——涵盖内核访问控制、命名空间隔离、所有权与可写性不变性、页缓存完整性、模块加载控制、AppArmor/seccomp/SELinux 等纵深防御要素。  
  
三者的“交互域”集中体现在三个工程位点：第一，散列表（scatterlist）的所有权语义  
——一段连续可寻址内存究竟由谁拥有、是否可被任意写入；第二，sk_buff 的 frag 共享标记（SKBFL_SHARED_FRAG）  
——外部所有权页面是否被正确标识；第三，加密原语对调用方缓冲区的隐式约定  
——authencesn、pcbc(fcrypt)、AES-GCM 等算法是否将调用方提供的目标缓冲区视为可写“草稿区”。  
  
1.4 报告讨论范围与术语约定  
  
本报告限定于：（1）Dirty 家族四个漏洞（Dirty Pipe、Copy Fail、Dirty Frag   
（有  
两个CVE  
编号）  
、Fragnesia）所触及的内核子系统与机制；（2）正向工程视角下的代码逻辑、设计假设、状态机一致性分析；（3）“执行体治理”理念到内核漏洞防御的映射。明确排除：单个漏洞利用细节的复述（已见于 FAQ 上下篇）、与 Dirty 家族机制无关的更广泛网络安全话题、超出技术域的政策性论述（仅在 1.1、8.4 必要处简短提及）。  
  
术语约定：- 页缓存（page cache）  
：Linux 内核以 4 KB 物理页为粒度对文件内容的内存缓存，由内核全权管理，不进行权限检查； - scatterlist（散列表）  
：内核crypto 子系统描述加密/解密输入输出的链式内存描述结构； - SKBFL_SHARED_FRAG  
：sk_buff 标记位，指示该 skb 的 frag 中含有非内核私有所有权的外部页面； - 原地操作（in-place）：加密/解密的源与目的指向同一内存区域； - 攻击原语（primitive）  
：一段可被任意调用以产生特定确定性副作用（如“4 字节越界写”）的代码路径； - 执行体（execution entity）  
：安天提出的概念，泛指被操作系统真实加载并赋予执行权限的运行对象，是网络安全运营的基本治理单元。  
  
二、Dirty 家族谱系：漏洞三连的技术解构  
  
2.1 Dirty Pipe（CVE-2022-0847）：页缓存篡改范式的开创——管道子系统的零拷贝与原地写入  
  
Dirty Pipe 是 Dirty 家族的范式开创者。其根因可追溯到两次相隔多年的内核改动：2016 年的 commit 241699cd72a8 引入了新的管道缓冲区分配函数 copy_page_to_iter_pipe() 与 push_pipe()，但未对 struct pipe_buffer 中的 flags 字段进行初始化；2020 年 Linux 5.8 中的 commit f6dd975583bd 引入了 PIPE_BUF_FLAG_CAN_MERGE 标志位，用于指示管道缓冲区可以与新写入的数据合并（这一标志本身是为了改善匿名管道的写入性能）。Max Kellermann 在 2022 年的披露中指出，攻击者只需先填满并清空一个管道使所有 pipe_buffer 的 flags 字段保留 PIPE_BUF_FLAG_CAN_MERGE，再通过 splice() 将只读文件的页缓存页引入管道，随后向管道写入数据时，内核会因为 CAN_MERGE 标志而直接覆写该页缓存页，进而绕过文件权限检查实现对只读文件、只读挂载乃至 immutable 文件的篡改。  
  
从  
“  
三体  
”  
视角看，Dirty Pipe 已经具备了家族的核心基因：性能优化（零拷贝splice、匿名缓冲区合并）侵入了所有权语义、页缓存共享被默认信任、单一标志位的未初始化将整个权限模型打穿  
。唯一与后续家族成员的差异在于：Dirty Pipe 尚未涉及加密机制——它直接通过管道子系统完成对页缓存的写入，加密在此并未充当通道。这一点既是范式开创点，也为后续漏洞向加密子系统迁移留下了空间。  
  
2.2 Copy Fail（CVE-2026-31431）：AI 辅助发现的加密桥接漏洞——AF_ALG 原地解密与 splice() 交汇  
  
Copy Fail 标志着 Dirty 家族正式进入加密子系统。其漏洞链由三次独立且各自合理的工程决策在时间线上的叠加构成：  
  
•2011 年（commit a5079d084f8b）  
：authencesn 模板被加入内核以支持 IPsec 的 64 位扩展序列号（ESN，RFC 4303 §2.2.1）。该实现将调用方提供的目标缓冲区作为重排 ESN 字节顺序的临时草稿区使用，在 crypto_authenc_esn_decrypt() 中执行 scatterwalk_map_and_copy(tmp + 1, dst, assoclen + cryptlen, 4, 1)  
——即向 dst 偏移 assoclen + cryptlen 处写入 4 字节 seqno_lo。当时的隐式假设是：仅内核内部 xfrm 层会调用 authencesn，调用方完全掌握目标缓冲区。  
  
•2015 年（commit 104880a6b470 + algif_aead.c）  
：authencesn 被迁移到新的 AEAD 接口；同期 AF_ALG 增加了 AEAD 支持，将内核 crypto 子系统通过 socket 接口暴露给非特权用户态。  
  
•2017 年（commit 72548b093ee3）  
：algif_aead 引入“原地操作”性能优化，将 req->src 与 req->dst 设置为同一 scatterlist，并通过 sg_chain() 将认证标签页面链入输出散列表。  
  
三次决策单独看均无明显安全问题，但当攻击者通过splice() 把只读文件的页缓存页注入 AF_ALG socket 的散列表、再触发 authencesn 解密时，scatterwalk_map_and_copy 会从合法输出区“走过”边界进入被链入的页缓存页面，调用 kmap_local_page() 将其映射为内核可写虚拟地址，并把 4 字节的 seqno_lo 写入。这 4 字节的取值完全由用户在 sendmsg() 中通过 AAD（bytes 4-7）控制，构成了一个确定性的 4 字节任意写原语。  
  
修复方案由内核crypto 子系统维护者 Herbert Xu 提交：commit a664bf3d603d 直接回退了 2017 年的原地优化，使 algif_aead 重新使用独立的源散列表与目的散列表（TX SGL 与 RX SGL 分离），其提交说明称"在 algif_aead 中就地操作没有好处，因为源和目标来自不同的映射"。Copy Fail 的发现过程更具标志意义——Theori 研究员 Taeyang Lee 基于 kernelCTF 经验提出"AF_ALG + splice"组合攻击面假设，由 Xint Code AI 平台在“仅一次操作员提示”的条件下，对 Linux crypto/subsystem约一小时的扫描完成跨数十个源文件的语义图遍历，首次在工程上验证了"人源洞见 + AI 规模化泛化"协同范式的有效性。CISA 于 2026 年 5 月 1 日将该漏洞加入已知被利用漏洞（KEV）目录。  
  
安天研究院在《人与AI协同的漏洞分析新范式——Copy Fail 发现过程解析》中对这一发现过程进行了分析解读，提炼出三个关键认知：第一，  
AI   
辅助审计的核心价值不在于  
"  
替代人类发现漏洞  
"  
，而在于将人类研究员的  
"  
洞见假设  
"  
（如  
"AF_ALG + splice   
的组合攻击面  
"  
）快速规模化为  
"  
面状审计  
"——Xint Code   
平台在一小时内完成了人类审计者数周甚至数月才能完成的跨子系统语义关联分析。第二，  
Copy Fail   
的漏洞本质具有典型的  
"  
涌现性  
"  
特征：  
2011   
年的  
 authencesn   
模板设计、  
2015   
年的  
 AF_ALG AEAD   
接口开放、  
2017   
年的原地操作优化，三次独立决策在长达九年的时间线上叠加，没有任何单一  
 commit   
可被指责为  
"  
错误  
"  
，但三者的交汇却产生了可被非特权用户稳定利用的提权原语。安天  
 CERT   
在  
[ Copy Fail FAQ（上）](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214685&idx=1&sn=5c1d5e3dc08490e7bd919dba10cc01bd&scene=21#wechat_redirect)  
中明确指出：  
"  
涉及多个子系统的耦合  
……  
单一子系统的代码审计难以发现这种跨系统的交互缺陷  
"  
。第三，  
Theori   
团队的安全研究能力具有深厚的实战背景  
——  
其在  
 2025   
年  
 8   
月  
 DEF CON 33   
上举行的  
 DARPA AI Cyber Challenge  
（  
AIxCC  
）决赛中以第三名获奖  
 150   
万美元，其上游  
 CTF   
战队  
 MMM  
（与  
 CMU PPP   
及  
 UBC Maple Bacon   
联合）九次获得  
 DEF CON CTF   
冠军  
——  
这表明  
 AI   
辅助漏洞挖掘的有效性不仅取决于工具本身，更取决于操作者的领域洞察与问题建模能力。  
  
从  
"  
三体  
"  
视角审视  
 Copy Fail  
，它代表了加密机制、性能优化与系统安全三者交汇的第一种完整形态：加密子系统（  
authencesn  
）提供了越界写入的  
"  
精确工具  
"  
，性能优化（  
splice   
零拷贝  
 + AF_ALG   
原地操作）提供了将页缓存页引入加密路径的  
"  
传输通道  
"  
，而安全机制（页缓存的共享信任模型）提供了写入后持久生效的  
"  
存储载体  
"  
。三者的耦合使  
 Copy Fail   
成为  
 Dirty   
家族中首个  
"  
加密桥接  
"  
漏洞  
——  
它首次证明加密子系统可以被武器化为页缓存篡改的精确写入原语。  
  
2.3 Dirty Frag（CVE-2026-43284、CVE-2026-43500）：双原语链式组合——xfrm-ESP 与 RxRPC 的加密路径耦合  
  
Dirty Frag 由 CVE-2026-43284（xfrm-ESP Page-Cache Write）与 CVE-2026-43500（RxRPC Page-Cache Write）两个独立漏洞链式构成，由 Hyunwoo Kim 于 2026 年 5 月 7 日因 embargo 提前破裂而公开披露。  
  
xfrm-ESP Page-Cache Write（CVE-2026-43284）  
：该漏洞的根因可追溯至2017 年的 commit cac2661c53f3（“esp4: Avoid skb_cow_data whenever possible”）与对应的 esp6 版本 commit 03e2a30f6a27，其性能优化目标是：当 sk_buff 未被克隆且无 frag_list 时，esp_input() 跳过 skb_cow_data() 直接对 frag 执行原地解密。该优化的潜在前提是 frag 由内核私有持有。然而当攻击者通过 MSG_SPLICE_PAGES（commit 7da0dde68486 与 6d8192bd69bb）或 splice() 将管道中的页缓存页直接挂接到 UDP/ESP-in-UDP 的 sk_buff 时，IPv4/IPv6 datagram 拼接路径并未像 TCP 的 skb_splice_from_iter() 那样设置 SKBFL_SHARED_FRAG 标志，使一个本应被视为“含有外部所有权片段”的非线性 skb 看起来与普通的未克隆非线性 skb 完全相同。esp_input 由此进入 no-COW 快速路径，在 frag 之上直接执行 crypto_authenc_esn_decrypt()——这与 Copy Fail 的 sink 完全相同，攻击者通过控制 XFRMA_REPLAY_ESN_VAL.seq_hi 即可在指定页缓存偏移处获得 4 字节任意写原语。Red Hat 对该 CVE 给出 CVSS 3.1 评分 8.8 HIGH（基于 kernel.org CNA 评估），Canonical 给出 7.8 HIGH 评分。  
  
RxRPC Page-Cache Write（CVE-2026-43500）  
：该漏洞位于net/rxrpc/rxkad.c 的 rxkad_verify_packet_1()，自 2023 年 6 月 commit 2dc334f1a63a 引入。当 RXKAD 安全层验证数据包时，内核对 skb 中前 8 字节 RxRPC 载荷执行 in-place pcbc(fcrypt) 单块解密。fcrypt 是 RxRPC/AFS 协议遗留的 56 位密钥分组密码，密钥可由非特权用户通过 add_key(“rxrpc”, …) 自由注册。攻击者在用户态以约每秒 1800 万次（即“fcrypt runs ~18 million keys/second, resolving in milliseconds to ~1 second per chunk”，TheCybrDef 转引 Hyunwoo Kim 在 V4bel/dirtyfrag write-up 中的实测数据）的速率暴力搜索密钥 K，使 fcrypt_decrypt(C, K) 等于目标明文 P，从而在页缓存中“植入”任意 8 字节内容（典型利用是将 /etc/passwd 的 root 行 password 字段改为空，利用 pam_unix.so 的 nullok 选项无密码登录）。  
  
两个漏洞之所以“链式互补”，源于其覆盖盲区相反：xfrm-ESP 路径需要创建用户命名空间（部分 Ubuntu 通过 AppArmor 默认拦截），但 esp 模块在几乎所有发行版默认加载；RxRPC 路径完全不需要命名空间，但 rxrpc.ko 仅在 Ubuntu 等少数发行版默认加载。组合后即可在所有主流 Linux 发行版上稳定提权。上游 xfrm-ESP 修复由 Kuan-Ting Chen 与 Steffen Klassert 提交（commit f4c50a4034e6），其核心思路是为 IPv4/IPv6 datagram splice frag 显式设置 SKBFL_SHARED_FRAG 标志，并使 ESP input 在该标志存在时回退到 skb_cow_data()。  
  
2.4 Fragnesia（CVE-2026-46300）：补丁衍生漏洞——修复补丁激活古老缺陷的状态机断裂  
  
Fragnesia 在 Dirty Frag 修复仅 5 天后由 William Bowling（V12 Security/Zellic）于 2026 年 5 月 13 日披露，是本家族中最具警示意义的“补丁衍生漏洞”。其根因不在 esp4/esp6/rxrpc 模块本身，而在内核核心套接字缓冲区代码 skb_try_coalesce()：当 GRO（Generic Receive Offload）路径将多个 sk_buff 合并时，该函数未将 SKBFL_SHARED_FRAG 标志从被合并的 skb 传播到合并后的 skb。其结果是：即便 Dirty Frag 补丁已经为 IPv4/IPv6 datagram splice frag 正确设置了 SKBFL_SHARED_FRAG 标志，该标志也可能在后续的 skb 合并过程中被丢失。  
  
更尖锐的辩证关系在于：Fragnesia 的攻击路径正是 Dirty Frag 补丁所“引入”的——Dirty Frag 修复使 ESP input 在 SKBFL_SHARED_FRAG 存在时回退到 skb_cow_data，但若 skb_try_coalesce 把标志丢掉，回退就不会发生，反而留下一条更新的攻击路径。Hyunwoo Kim 因此明确将 Fragnesia 描述为“被 Dirty Frag 补丁意外激活”的休眠缺陷。具体利用上，Fragnesia 攻击者通过 unshare(CLONE_NEWUSER | CLONE_NEWNET) 在隔离命名空间内获取 CAP_NET_ADMIN，借助 NETLINK_XFRM 安装一个以已知 AES-128-GCM 密钥构造的 ESP-in-TCP 传输模式 SA；将待写入的页缓存页通过 splice() 排入 TCP 接收队列后，再将 socket 切换至 espintcp ULP 模式，此时内核对队列中的页缓存页执行原地 AES-GCM 解密。攻击者预先通过 AF_ALG 构造 256 项密钥流查找表，即可通过控制 IV nonce 使 AES-GCM 密钥流 XOR 后产生确定的一字节写入——这一步将“加密”由被动数据载体彻底转化为主动攻击工具。  
  
修复commit f84eca581739让skb_try_coalesce() 正确传播 SKBFL_SHARED_FRAG 标志，配合在 pskb_copy() 中的传播修复，以及对 rxrpc DATA/RESPONSE 包 unsharing、rxkad 对齐、potential UAF 修复在内的一组连带补丁。值得注意的是，V12 团队随后又于 2026 年 5 月 15 日披露 skb_segment() 在构造 GSO 分段时仅传播 head skb 的 SKBFL_SHARED_FRAG 标志而忽略 frag_list 成员——这一旁路尚未完全修复，再次印证了状态机一致性问题的“层层皆有”。  
  
2.5 谱系演进规律：从单点漏洞到链式组合再到补丁衍生的代际跃迁  
  
将四个漏洞放入同一坐标系，可见明显的代际跃迁：  
<table><tbody><tr><td data-colwidth="83" width="68" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt medium 1pt 1pt;border-style: solid none solid solid;border-color: rgb(255, 255, 255) currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">代际</span></span></font></span></b></p></td><td data-colwidth="95" width="153" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt medium 1pt 1pt;border-style: solid none solid solid;border-color: rgb(255, 255, 255) currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">代表漏洞</span></span></font></span></b></p></td><td data-colwidth="101" width="189" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt medium 1pt 1pt;border-style: solid none solid solid;border-color: rgb(255, 255, 255) currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">加密耦合</span></span></font></span></b></p></td><td data-colwidth="121" width="186" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt medium 1pt 1pt;border-style: solid none solid solid;border-color: rgb(255, 255, 255) currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">形态</span></span></font></span></b></p></td><td data-colwidth="150" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(255,255,255);mso-border-left-alt:0.5000pt solid rgb(255,255,255);border-right:1.0000pt solid rgb(255,255,255);mso-border-right-alt:0.5000pt solid rgb(255,255,255);border-top:1.0000pt solid rgb(255,255,255);mso-border-top-alt:0.5000pt solid rgb(255,255,255);border-bottom:1.0000pt solid rgb(255,255,255);mso-border-bottom-alt:0.5000pt solid rgb(255,255,255);background:rgb(79,129,189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">发现方式</span></span></font></span></b></p></td></tr><tr><td data-colwidth="83" width="68" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">第一代</span></span></font></span></b></p></td><td data-colwidth="95" width="153" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Dirty Pipe (2022)</span></span></font></span></p></td><td data-colwidth="101" width="189" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">无</span></span></font></span></p></td><td data-colwidth="121" width="186" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">单点未初始化</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">+ 标志位</span></span></font></span></p></td><td data-colwidth="150" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(255,255,255);mso-border-left-alt:0.5000pt solid rgb(255,255,255);border-right:1.0000pt solid rgb(255,255,255);mso-border-right-alt:0.5000pt solid rgb(255,255,255);border-top:none;mso-border-top-alt:0.5000pt solid rgb(255,255,255);border-bottom:1.0000pt solid rgb(255,255,255);mso-border-bottom-alt:0.5000pt solid rgb(255,255,255);background:rgb(219,229,241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">偶发崩溃溯源</span></span></font></span></p></td></tr><tr><td data-colwidth="83" width="68" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">第二代</span></span></font></span></b></p></td><td data-colwidth="95" width="153" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Copy Fail (2026-04)</span></span></font></span></p></td><td data-colwidth="101" width="189" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">AF_ALG+authencesn</span></span></font></span></p></td><td data-colwidth="121" width="186" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">跨三个子系统的涌现性原语</span></span></font></span></p></td><td data-colwidth="150" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(255,255,255);mso-border-left-alt:0.5000pt solid rgb(255,255,255);border-right:1.0000pt solid rgb(255,255,255);mso-border-right-alt:0.5000pt solid rgb(255,255,255);border-top:none;mso-border-top-alt:0.5000pt solid rgb(255,255,255);border-bottom:1.0000pt solid rgb(255,255,255);mso-border-bottom-alt:0.5000pt solid rgb(255,255,255);background:rgb(219,229,241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">AI辅助原语狩猎</span></span></font></span></p></td></tr><tr><td data-colwidth="83" width="68" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">第三代</span></span></font></span></b></p></td><td data-colwidth="95" width="153" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Dirty Frag (2026-05)</span></span></font></span></p></td><td data-colwidth="101" width="189" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">xfrm-ESP+RxRPC/rxkad</span></span></font></span></p></td><td data-colwidth="121" width="186" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">链式互补的双原语</span></span></font></span></p></td><td data-colwidth="150" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(255,255,255);mso-border-left-alt:0.5000pt solid rgb(255,255,255);border-right:1.0000pt solid rgb(255,255,255);mso-border-right-alt:0.5000pt solid rgb(255,255,255);border-top:none;mso-border-top-alt:0.5000pt solid rgb(255,255,255);border-bottom:1.0000pt solid rgb(255,255,255);mso-border-bottom-alt:0.5000pt solid rgb(255,255,255);background:rgb(219,229,241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">人类研究员模式识别</span></span></font></span></p></td></tr><tr><td data-colwidth="83" width="68" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(79, 129, 189);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(255,255,255);font-weight:bold;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">第四代</span></span></font></span></b></p></td><td data-colwidth="95" width="153" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Fragnesia (2026-05)</span></span></font></span></p></td><td data-colwidth="101" width="189" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top: 1.8pt;margin-bottom: 1.8pt;text-align: left;"><span style="font-family: 微软雅黑;font-size: 9pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">XFRM ESP-in-TCP+AES-GCM</span></span></font></span></p></td><td data-colwidth="121" width="186" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(255, 255, 255) rgb(255, 255, 255);background: rgb(219, 229, 241);"><p style="margin-top:1.8000pt;margin-bottom:1.8000pt;mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;font-size:9.0000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">补丁副作用激活的状态机断裂</span></span></font></span></p></td><td data-colwidth="150" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(255,255,255);mso-border-left-alt:0.5000pt solid rgb(255,255,255);border-right:1.0000pt solid rgb(255,255,255);mso-border-right-alt:0.5000pt solid rgb(255,255,255);border-top:none;mso-border-top-alt:0.5000pt solid rgb(255,255,255);border-bottom:1.0000pt solid rgb(255,255,255);mso-border-bottom-alt:0.5000pt solid rgb(255,255,255);background:rgb(219,229,241);"><p style="margin-top: 1.8pt;margin-bottom: 1.8pt;text-align: left;"><span style="font-family: 微软雅黑;font-size: 9pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">AI智能体审计</span></span></font></span></p></td></tr></tbody></table>  
其规律可归纳为：第一，加密耦合从无到有再到主动化  
——从 Dirty Pipe 完全不涉及加密，到 Copy Fail/Dirty Frag 借助加密 sink 完成写入但加密本身只是“载体”，再到 Fragnesia 通过 AES-GCM 密钥流 XOR 的算法语义直接产生攻击效果。第二，原语颗粒度从粗到精  
——从 Dirty Pipe 的“按字节顺序覆写”，到 Copy Fail 的“任意 4 字节确定写”，再到 Fragnesia 的“任意单字节确定写”。第三，发现方式从人为主到 AI 为主  
——AI 辅助审计正在重塑此类逻辑型漏洞的发现成本曲线。  
  
2.6 共性根因：加密操作原地性、零拷贝性能优化、页缓存共享性的“三体”交汇  
  
将四个漏洞的根因抽象到最高层级，其共性根因是三体交汇产生的结构性失配  
：  
  
1.页缓存共享性  
——Linux 设计上始终将页缓存视为内核私有可写、对所有进程透明共享的全局资源；  
  
2.零拷贝可写引用  
——splice/sendfile/MSG_SPLICE_PAGES 等机制为追求性能而保留页面的“出处（provenance）”信息，将页缓存页面以引用形式传入其他子系统；  
  
3.加密原语的原地写入  
——在认证失败之前就已经执行了对调用方缓冲区的副作用写入（authencesn 草稿、AES-GCM 密钥流 XOR、pcbc(fcrypt) 块覆写）。  
  
三者中任何两者结合都不足以触发漏洞——只有当三  
者  
同时作用，才能形成“无须竞态、无须内核 panic、无需偏移、无需重试”的确定性写原语。这正是 Dirty 家族  
漏洞  
 “涌现性（emergent）”  
爆发  
的工程根源。  
  
三、性能维度：优化逻辑与安全假设的断裂  
  
3.1 内核热路径的性能瓶颈：网络栈、加密路径、内存管理的效率压力  
  
Linux 内核长期承担“通用商业 OS”与“高性能基础设施 OS”双重角色。在网络栈、加密路径与内存管理三条热路径上，性能压力极端集中：网络栈每秒需处理百万级数据包，每次拷贝意味着数千 CPU 周期与缓存污染；加密路径既要支撑 IPsec/TLS 等吞吐密集型应用，又要满足 dm-crypt/fscrypt 等存储加密需求；内存管理对 4 KB 物理页的分配、释放、回收频次极高，任何额外的页面拷贝都将转化为系统级性能损失。这种压力使内核开发文化中长期形成了“性能优先（performance-first）”的工程倾向——所有可省略的拷贝、所有可合并的缓冲区、所有可共享的引用，都构成开发者的“既得收益”。  
  
3.2 零拷贝机制（splice()）的设计哲学与内存语义陷阱  
  
splice() 系统调用由 Jens Axboe 于 Linux 2.6.16（2006 年）引入。Jonathan Corbet 在 LWN.net 2023 年 2 月的文章《Rethinking splice()》中记录了 Linus Torvalds 的关键表述：缓冲区的共享“是 splice 的全部意义”。  
   
splice()通过让管道pipe_buffer直接引用页缓存实现零拷贝，既避免了用户态与内核态之间的数据复制，也避免了内核内部的数据拷贝。LWN.net的另一篇文章（Articles/178725）指出：“zero-copy真正含义是zero CPU copies”——零拷贝机制的核心价值，在于避免CPU执行高成本的数据复制操作。  
  
但这种共享带来一类难以肉眼识别的内存语义陷阱：通过splice() 注入到下游子系统（pipe、socket、crypto 散列表、sk_buff frag）的页面，其所有权（ownership）  
与可写性（writability）  
并不随之传递。对接收侧而言，那只是一段“可寻址的物理内存”，并不包含“这段内存由谁拥有、是否允许写入”的元信息。Dirty 家族的所有漏洞，本质上都建立在这种“语义信息丢失”之上。LWN 2023 年 2 月文章中Samba 开发者Stefan Metzmacher 使用 splice 遇到的“surprising”行为，已部分预告了这类问题——但内核社区对该问题的整体认知，依然停留在“个别使用者的注意事项”层面。  
  
3.3 原地操作的三重性能收益与单一安全代价  
  
加密路径中的原地操作（in-place）为内核带来三重性能收益：（1）省略输入到输出的内存拷贝（典型节省一次完整缓冲区拷贝）；（2）减少 scatterlist 描述符的数量  
（src 与 dst 合并）；（3）改善缓存局部性  
（同一物理页面读写在L1/L2 中保持热态）。但代价仅有一项：当且仅当源缓冲区在加密前后均由内核私有所有时才安全。任何打破这一前提的调用方都将引入风险。  
  
Dirty 家族证明，这一前提在多个相互独立的代码路径上同时被破坏：  
  
•  
algif_aead 通过 AF_ALG socket 将原地操作能力开放给非特权用户态（Copy Fail）；  
  
•  
xfrm-ESP 通过“跳过 skb_cow_data 直接对 frag 操作”将原地操作扩展到 sk_buff 路径（Dirty Frag）；  
  
•  
rxkad_verify_packet_1 通过对 frag 中的 RxRPC 载荷做单块 pcbc(fcrypt) 原地解密（Dirty Frag）；  
  
•  
espintcp ULP 在 socket 已注入 splice 页面之后才切换模式（Fragnesia）。  
  
四条路径的优化决策互无关联，但其失败模式严格同构——这恰恰是涌现性漏洞的标志。  
  
3.4 Avoid skb_cow_data 与 skb_try_coalesce()：优化代码的“收益幻觉”与“风险暗物质”  
  
更具典型意义的两个例子是skb_cow_data 的省略与 skb_try_coalesce()。skb_cow_data  
 的作用按Linux 内核 net/core/skbuff.c 注释为：“Make sure that the data buffers attached to a socket buffer are writable. If they are not, private copies are made of the data buffers and the socket buffer is set to use these instead”——它是 sk_buff 体系内的一道关键所有权防线。2017 年 commit cac2661c53f3（“esp4: Avoid skb_cow_data whenever possible”）的优化目标完全合理——对未克隆、无 frag_list 的 skb 跳过 COW 可以显著减少 IPsec 数据路径的内存压力——但其错失了“未设置 SKBFL_SHARED_FRAG 不等于真的没有共享 frag”这一隐性条件。这种“看似严密但条件并未全部列出”的状态判定，正是性能优化代码中常见的“风险暗物质”。  
  
skb_try_coalesce() 的角色更为隐蔽。作为 GRO 与 TCP 接收侧的合并优化，其官方语义为“try to merge skb to prior one”——它把多个 sk_buff 的 frag 合并到前一个 sk_buff 以减少分配。然而合并过程对 SKBFL_SHARED_FRAG 标志的传播被遗漏——这正是 Fragnesia 的根因。从工程量来看，该缺失“看不见”——它不导致任何数据错误、不影响功能正确性、不引发任何崩溃，仅仅是一个静默的元数据传播失败。正因为这种缺失零成本，它在长达数年的代码评审中均未被发现。  
  
3.5 性能-安全零和博弈：为何优化代码会成为漏洞的“原动力”  
  
将上述线索拼合，性能优化与安全的关系在内核热路径上呈现明显的“零和”特征：  
  
1.拷贝是安全的核心机制之一  
——每一次拷贝都建立了所有权边界，剥离了来源的“出处”；  
  
2.零拷贝是性能的核心机制之一  
——每一次拷贝省略都将所有权边界打开；  
  
3.优化代码默认“理想假设”  
——开发者倾向于假设上游传入的是“良好的”输入；  
  
4.攻击者主动制造“不良输入”  
——splice 之于 AF_ALG、unshare 之于 xfrm-ESP、CLONE_NEWUSER 之于 ESP-in-TCP，都是攻击者刻意构造的“不良入口”。  
  
因此优化代码客观上成为“漏洞原动力”——它持续在热路径上释放新的攻击面。这种零和性并非“工程师水平不足”的结果，而是性能目标与安全目标在内核架构层面天然存在结构性  
的破坏  
张力。  
  
四、加密机制维度：算法语义与系统语义的鸿沟  
  
4.1 加密机制标准的“内存安全盲区”：NIST SP 800-38D、RFC 4303 的算法正确性假设  
  
NIST SP 800-38D（Morris Dworkin, 2007）与 RFC 4303（Stephen Kent, 2005 年 12 月）作为本家族涉及的两份核心标准，其表述精度极高——分别详尽规定了 AES-GCM 的初始化向量构造、唯一性约束、认证标签长度，以及 IPsec ESP 数据包格式、ESN 序列号管理、抗重放窗口等。NIST 于 2024 年 3 月 5 日正式宣布将修订 SP 800-38D，包括“remove support for authentication tags whose lengths are less than 96 bits, clarify that the construction of initialization vectors (IVs) for GCM in the Transport Layer Security (TLS) 1.3 protocol is approved”等内容。  
  
然而二者具有共同的“内存安全盲区”——它们以算法/协议正确性为讨论对象，对调用方的内存所有权、缓冲区生命周期、原地操作的内核语义不作约束。这一盲区在工程上是合理的——  
应用  
密码学  
（加密协议实现意义上）  
标准的范畴本不应扩展到操作系统的内存模型。但当算法实现被嵌入到一个共享页缓存、零拷贝引用、原地操作并存的内核环境中，标准层的“沉默”就转化为实现层的“失序”  
。authencesn 的 ESN 重排“草稿写”严格符合 RFC 4303 §2.2.1 对 64 位扩展序列号的处理要求；AES-GCM 的密钥流 XOR格符合 NIST SP 800-38D 第 6 节的密文构造定义——但两者都假设调用方提供的目标缓冲区“全部由调用方私有”。这一隐式假设从未出现在任何标准中，也从未出现在任何 API 注释中。  
  
4.2 加密子系统的枢纽地位：跨域数据流汇聚与攻击面富集  
  
Linux 内核 crypto 子系统在结构上具有“枢纽节点（hub）”地位：dm-crypt/fscrypt（存储）、kTLS（网络）、IPsec/xfrm（VPN）、RxRPC/AFS（分布式文件系统）、AF_ALG（用户态加密 API）、modules signature 验证（加载保护）等高强度数据流均汇聚于 crypto API 的同一组核心模板（authenc、authencesn、gcm、ccm、pcbc(fcrypt)、cbc(aes)）。这种枢纽地位意味着任何一个 crypto 原语的边界假设错误，都将在多个上游子系统中以不同形式被触发。  
  
Dirty 家族提供了一个典型的“枢纽放大”案例：authencesn 的 4 字节越界写在 algif_aead 路径上构成 Copy Fail，在 xfrm-ESP 路径上构成 Dirty Frag 之一，在 espintcp 路径上又与 AES-GCM 密钥流 XOR 组合构成 Fragnesia 更深层的利用链。  
  
安天CERT在Copy Fail FAQ（下）中剖析了加密子系统的关键位置：  
Crypto API 的枢纽地位创造了“双刃剑”效应——统一加密服务避免了子系统重复开发，散集列表高效支持 IPsec 对 paged skb 的处理，但三个数据流（文件系统→加密、网络栈→加密、用户空间→加密）在加密子系统中的交汇极大地富集了攻击面。Copy Fail 利用文件系统→加密路径，Dirty Frag ESP 变体利用网络栈→加密路径，Dirty Frag RxRPC 变体利用本地 socket→加密路径。枢纽地位意味着攻破任一个接入点即可获得向其他域注入数据的能力。安天 CERT 指出，这种枢纽放大效应是 Dirty 家族区别于传统内核 LPE 漏洞的关键特征——传统漏洞通常局限于单个子系统内部，而 Dirty 家族的攻击路径天然具有“跨域跳转”能力，单一 crypto 原语的边界假设错误即可在多个上游子系统中被以不同形式触发。  
  
4.3 加密的“审计遮蔽”与“利用可控”悖论：混淆机制对安全审查的抑制与攻击端的精确可控  
  
加密的本质是把“明文域的语义”映射为“密文域的混乱”。这种混乱在防御侧造成审计遮蔽——加密过程会主动破坏数据的语义可解释性，传统的污点分析、符号执行难以跨越加密原语两端；而在攻击侧，由于密钥与算法均可由攻击者控制（Copy Fail 中通过 ALG_SET_KEY、Dirty Frag/RxRPC 中通过 add_key(“rxrpc”,…)、Fragnesia 中通过 NETLINK_XFRM SA 安装的已知密钥），加密算法对攻击者而言反而是完全确定且可预测的：给定输入与密钥，输出结果即可被精确推导。于是，“对页缓存的 4 字节/1 字节确定写”便能够被稳定构造成攻击原语。  
  
这一不对称构成“加密-安全负和”的核心悖论：防御复杂性的增加，并不必然提升安全性，反而可能为攻击者提供更稳定、更精确的利用语义  
。Dirty 家族不是个例，它揭示出 Linux 内核加密子系统在攻防博弈中的结构性弱势——加密在系统内部的存在本身，扩大了攻击面而非缩小  
。  
  
4.4 从被动载体到主动工具：AES-GCM 密钥流异或的风险引入  
  
Fragnesia 的工程价值在于把加密从“被动数据载体”提升为“主动攻击工具”。在 Copy Fail 与 Dirty Frag 中，加密路径只是把攻击者的写入“搬运”到目标偏移（authencesn 把 4 字节写到 dst[assoclen + cryptlen]、pcbc(fcrypt) 把 8 字节写到 frag 起始）；攻击者控制的是写入值本身或可计算的密钥。但 Fragnesia 中，攻击者实际上让AES-GCM 算法主动产生写入效果  
——AES-GCM 解密在密文与密钥流之间执行 XOR，而攻击者通过控制 IV nonce 与一个已知密钥下的密钥流查找表，使密钥流的每一个字节都可预测、可选择，从而把“密钥流 XOR”这一算法核心步骤变成“对页缓存的精确单字节写”。  
  
这种转变标志着Dirty 家族的“加密耦合”达到  
极致  
：加密机制不仅成了漏洞链上的一环，而几乎成了漏洞的执行引擎  
。  
  
4.5 遗留加密机制的“僵尸化”：RxRPC/fcrypt 的兼容性负债与纯风险属性  
  
fcrypt 是 RxRPC/rxkad 安全层（kerberos 4 等效协议，security index 2）所依赖的 56 位密钥分组密码，源自 1980 年代 AFS（Andrew File System）的设计。Linux 内核 net/rxrpc/Kconfig 显示 RXKAD 配置选项中显式 select CRYPTO_PCBC  
 与select CRYPTO_FCRYPT  
。从纯密码学角度看，它早已被现代标准（AES、ChaCha20-Poly1305）全面替代，56 位密钥在普通桌面 CPU 上即可被穷举——按 V4bel write-up 实测的 18 Mops/s 速度，单次密钥搜索在毫秒到约 1 秒区间。然而由于 OpenAFS、kAFS 等遗留生态对 rxkad 的兼容性需求，fcrypt 与 PCBC 模式仍保留在 net/rxrpc 与 crypto/fcrypt.c 中。  
  
这种保留有其工程合理性——开源社区对“破坏现有生态”的兼容性负债极度敏感——但其安全属性已发生质变：从“可用但弱”的合规组件，变成了“纯风险”的  
负面代码遗产  
。fcrypt 不再提供有意义的机密性保护（攻击者可轻易暴力出密钥），但仍承担着“在 frag 上执行原地解密”的副作用，这一副作用恰恰被 Dirty Frag 的 RxRPC   
变体利用。遗留加密机制因此成为Dirty 家族的“僵尸化负债”——其密码学价值已死，但其代码副作用依然存活  
。  
  
4.6 加密机制-性能的正和幻觉：硬件卸载与软件路径的错位  
  
加密机制与性能在表面上呈现“正和”——AES-NI、CLMUL（PCLMULQDQ）等指令集让 AES-GCM 接近“零成本加密”。但这种正和仅存在于“算法层”。在“系统层”，加密路径的优化（原地操作、零拷贝、跳过 COW）所带来的安全代价并未被任何硬件指令抵消。当工程实践被“硬件加密很便宜，所以可以广泛使用”的认知误导时，开发者往往低估加密入口暴露给非特权用户态  
所引入的攻击面增长——AF_ALG 的存在本意是让 OpenSSL 等用户态库利用内核硬件加密，但实际广泛使用 AF_ALG 的应用极少（OpenSSL afalg 引擎、cryptsetup、kcapi-tools），却为 Copy Fail 与早期 Fragnesia 攻击路径提供了完整的密钥流查找表能力。  
  
加密-性能的正和因此是一种幻觉  
——其表象的“双赢”被“软件路径的额外攻击面”暗中抵消。  
  
五、代码安全工程维度：开源社区安全运营能力的结构性短板  
  
5.1 正向设计中的“安全后置”：内核开发文化的性能优先传统  
  
Linux 内核的开发文化长期奉行“先正确，再快，再安全”的优先级——这一文化由 Linus Torvalds 与核心维护者群体在 30 余年中以社会化方式塑造而成。LKML 与 netdev 邮件列表的讨论模式同样强烈倾向于“代码即论据，性能数据即真理”。然而该模式对安全副作用  
的接纳力相对较弱：当一个补丁带来5% 的吞吐提升，社区不会要求其同时提交“对所有相邻代码路径安全不变性的回归证明”。这种文化不是 Linux 独有的，但其规模——数千万行内核代码、数千名提交者、数百个子系统——使每一次“安全后置”的累积效应远超其他开源项目。  
  
Dirty 家族的所有根因 commit（241699cd72a8、f6dd975583bd、72548b093ee3、cac2661c53f3、03e2a30f6a27、2dc334f1a63a、7da0dde68486、6d8192bd69bb）在合入时均经过严格的 Reviewer 审查与社区讨论，但讨论焦点几乎全部集中在功能正确性与性能数据，没有一份合入讨论明确质疑“该优化是否破坏了上下游子系统的所有权不变性”  
。  
  
5.2 跨子系统安全契约的模糊地带：模块边界清晰但语义断裂  
  
Linux 内核以模块化著称，子系统间的接口（API/Hook/Notifier Chain）边界清晰。但模块化只解决了功能契约  
——“我调用 skb_cow_data 你就给我可写 sk_buff”——而未解决语义契约  
——“我传给你的 sk_buff 中的 frag 是否拥有真正的所有权”。Copy Fail 暴露的正是 splice → AF_ALG → algif_aead → authencesn 这一调用链上的语义断裂：每一个模块单独审计无误，但语义在边界处遗失。  
  
InfoQ 2026 年 5 月的《Copy Fail and Dirty Frag: Linux Page-Cache Exploits Target Every Major Distribution》引用 Hyunwoo Kim 关于二者关系的论述：“xfrm-ESP Page-Cache Write provides a powerful arbitrary 4-byte STORE primitive like Copy Fail, and is included on most distributions, but it requires the privilege to create a namespace. RxRPC Page-Cache Write does not require the privilege to create a namespace, but the rxrpc.ko module itself is not included in most distributions”——同一 sink，两条 source。这种“多 source 共 sink”恰是模块化设计在跨子系统安全契约缺失下的典型暴露形态。  
  
5.3 审计范式的代际滞后：从“崩溃点发现”到“原语狩猎”的认知鸿沟  
  
传统内核漏洞挖掘长期以“崩溃点（crash point）”为核心目标：Syzkaller、AFL、KASAN、KMSAN等工具的主要检测机制，都是捕获非法内存访问、UAF、OOB 等能够显式触发异常的错误。从发现崩溃到实现“受控崩溃”，在早期的灵感发掘到Fuzzing的过程中，都被视为从发现漏洞到形成PoC的基本范式。  
Dirty家族则对这一范式构成了系统性挑战——四个漏洞均不会导致内核崩溃  
：Copy Fail中HMAC校验失败仅返回EBADMSG，Dirty Frag 中AEAD认证失败仅表现为普通错误码，Fragnesia中AES-GCM标签校验失败同样只是一次失败返回。然而，在错误被报告之前，对页缓存的4字节或1字节写入副作用早已完成。传统模糊测试框架很难从这类漏洞中获得有效反馈信号。  
  
由Theori 提出 “攻击原语狩猎（primitive hunting）  
”范式正在取代崩溃点范式  
，  
研究员（人）  
基于长期深耕Linux内核攻防建立的洞察能力，  
提出“加密接口 + 零拷贝 + 页缓存”的假设，  
基于其千卡平台的算力建设，  
AI 平台（机）在数百万行代码中跨文件、跨子系统进行语义图遍历，定位“在哪些路径上 splice 引入的页缓存页可能进入可写 scatterlist”。在“仅一次操作员提示”的条件下，对 Linux crypto/subsystem约一小时的扫描即可发现相关漏洞。——  
展示了新范式的发现效率。这是就是安天在《  
Copy Fail 漏洞的发现展示了新的人机分工  
》所指出的，人聚焦“问对问题”，AI负责“问遍所有相关问题”。  
   
  
5.4 修复响应的“充分性幻觉”：补丁验证覆盖度的系统性不足  
  
Fragnesia 的存在本身就是对补丁充分性的最严厉检验。Dirty Frag 的修复——为 IPv4/IPv6 datagram splice frag 设置 SKBFL_SHARED_FRAG 并让 ESP input 在该标志存在时回退到 COW——是逻辑严密的针对性修复。然而 5 天后 Fragnesia 即通过 skb_try_coalesce 的标志传播缺失绕过了该补丁——这表明社区对“标志位状态机的全局一致性”未做系统验证。  
  
更进一步，V12 团队在 Fragnesia 修复 commit f84eca581739 之后的 2026 年 5 月 15 日又披露 skb_segment() 的同类问题（在 GSO 分段时仅传播 head skb 的 SKBFL_SHARED_FRAG，忽略 frag_list 成员）——一种“补丁打补丁、补丁绕补丁”的级联效应。  
  
这种“充分性幻觉”的根源是补丁验证仅覆盖该补丁直接修改的代码路径，而不覆盖与该状态变量相关的所有路径  
——也就是说，开源社区在标志位、所有权指针、引用计数等关键状态变量上缺乏全局一致性的验证基础设施。  
  
5.5 性能热路径的“审计免疫性”：高频代码的安全盲区与长期休眠缺陷  
  
splice、skb_try_coalesce、authencesn 等代码长期处于 Linux 内核的高频热路径  
，广泛参与零拷贝IO、页缓存复用与加密数据处理。然而这些路径恰恰拥有最强的“审计免疫性”—— 其代码因高频运行而被视为“经过实战验证”  
，因逻辑复杂而被认为修改风险较高，又因性能敏感而使安全加固往往被视为可能破坏吞吐与延迟表现。Copy Fail与Dirty Frag在相关路径中长达9年的潜伏，正是该  
免审机制  
的直接代价。  
  
5.6 开源社区安全运营能力的结构性短板：从个人英雄主义到体系化审计  
  
将上述五点连接，可以看到开源社区安全运营的结构性短板  
：  
  
•挖掘端  
：高度依赖个人英雄主义（Max Kellermann、Taeyang Lee、Hyunwoo Kim、William Bowling），缺乏面向涌现性漏洞的系统化扫描基础设施；  
  
•审计端  
：以syzbot 等模糊测试为主，缺乏跨子系统语义不变性验证；  
  
•响应端  
：以单点补丁为主，缺乏补丁副作用的状态机一致性分析；  
  
•披露端  
：oss-security/linux-distros embargo 流程已在 Dirty Frag 上被第三方破坏，对协调披露的“信任前提”动摇。HackerOne 旗下 Internet Bug Bounty 项目于 2026 年 3 月 27 日宣布暂停受理新漏洞提交（Dark Reading 2026-04 引述 HackerOne 公开声明：“Effective March 27, the program paused accepting new vulnerability submissions because of what HackerOne described as a worsening imbalance between vulnerability discoveries and the ability for open source maintainers to remediate them”），即是这一系统性失衡的最直接  
证明  
。  
  
这并非否定开源社区的整体效能——上游修复复杂漏洞响应仍是积极和尽力的（Copy Fail 从Theori 向内核安全团队3月23日提交到4月1日补丁合入主线，仅用了9天时间，到4月29日披露曝光，也为用户更新保留了一个正月的时间周期）但Dirty 家族三连证明，单纯依靠应急修复的“快”无法补偿设计验证的“漏”，同时也必须有第三方安全能力的场景侧协同  
。  
  
六、三者关系的辩证分析：困境与平衡  
  
6.1 “三体”困境的不可回避性：性能-安全零和、加密机制-安全负和、加密机制-性能正和幻觉  
  
将前述分析整合，  
其  
两两关系可归纳为：  
  
•性能消耗 ↔ 系统安全：（必然）零和  
——每一项零拷贝/原地优化都让渡了所有权隔离；  
  
•加密机制↔ 系统安全：（部分）负和  
——加密的审计遮蔽性 + 攻击端的可控性 + 枢纽地位，使加密客观上为攻击提供精确化能力；  
  
•加密机制↔ 性能：（幻觉）正和  
——硬件指令的算法加速难以抵消软件路径上“暴露给非特权用户态”所引入的攻击面。  
  
三对关系互相增强，构成“三体困境”。这一困境不是某次具体设计失误的结果，而是 Linux 内核作为“通用 + 高性能 + 安全”  
复杂  
目标共存系统所必然遭遇的结构性张力。  
  
6.2 “三体”耦合的涌现性漏洞：Dirty 家族作为“优化 + 加密”的涌现产物  
  
Dirty 家族的每一个漏洞  
基本很难  
归因于单一commit、单一开发者或单一子系统  
（除Copy Fail机制实现者和漏洞引入者为一人外）  
——它们  
更多  
是涌现性漏洞（emergent vulnerability）  
：三个或更多独立合理的工程决策在多年时间线上叠加  
，  
最终产生了非线性的安全后果。安天CERT 在 Copy Fail FAQ（上）已指出“涉及多个子系统的耦合……单一子系统的代码审计难以发现这种跨系统的交互缺陷”，与本节论点完全一致。  
  
安天研究院参考现有资料，总结了涌现性漏洞具有三个工程性质：  
（1）根因的非局部性——修复任一根因 commit 都可阻断漏洞，但单看任一根因 commit 都“无错”。Copy Fail 的任一根因（authencesn 模板设计、AF_ALG 接口开放、原地操作优化）在独立审查中均无可指摘，但三者的组合却产生了页缓存级任意写入能力。（2）潜伏期的低可观测性——常规 fuzzing、CI、Reviewer 审查均不会触发警报。Dirty 家族四个漏洞均不会让内核崩溃，认证失败仅返回错误码，但写入副作用已经完成。这种“静默利用”特征使传统以崩溃为导向的审计工具完全失效。（3）修复的副作用  
难以  
预测性——单点修复可能激活其他根因。Fragnesia 是典型案例：Dirty Frag 的修复补丁在逻辑上严密，却意外激活了 skb_try_coalesce() 中潜伏 13 年的标志传播缺陷。安天在《“分片失忆”——Dirty Frag 补丁如何催生了 Fragnesia 漏洞》中详细追踪了这一补丁副作用的完整因果链。  
  
涌现性漏洞具有以下三个工程性质：（1）根因的非局部性  
——修复任一根因 commit 都可阻断漏洞，但单看任一根因 commit 都“无错”；（2）潜伏期的可观测性低  
——常规 fuzzing、CI、Reviewer 审查均不会触发警报；（3）修复的副作用不可预测性  
——单点修复可能激活其他根因（Fragnesia 即是典型）。  
  
6.3 从“不可能三角”到“有条件共存”：打破零和博弈的技术路径  
  
这一“  
三体  
”  
困境是否注定是  
很难实现平衡  
？答案在工程层面是“有条件共存”。条件  
包括：  
  
•所有权语义的显式化  
——以 SKBFL_SHARED_FRAG 为代表的标志位机制扩展到 scatterlist（如假想中的 CRYPTO_REQ_MAY_SHARE）、pipe_buffer 等其他描述结构；  
  
•加密API 的内存契约文档化  
——明确声明 authencesn 等模板的“草稿写”行为，禁止调用方将不可写区域链入；  
  
•零拷贝路径的“出处”传播不变性验证  
——任何 zero-copy 引用都必须携带 provenance 元信息；  
  
•补丁副作用的状态机全局一致性检查  
——任何修改 SKBFL_SHARED_FRAG 行为的补丁必须经过 skb_try_coalesce、skb_segment、pskb_copy 等所有传播点的回归验证。  
  
6.4 状态机全局一致性验证：作为“三体”平衡的技术中介  
  
状态机全局一致性验证（State Machine Global Consistency Verification）在“三体”平衡中扮演技术中介角色——它既不要求放弃性能优化，也不要求改变加密标准，而是要求每一项跨子系统的状态变量在所有传播路径上保持语义不变  
。对Dirty 家族而言，关键状态变量包括：  
  
•SKBFL_SHARED_FRAG  
（sk_buff 共享 frag 标记）；  
  
•pipe_buffer.flags  
（特别是PIPE_BUF_FLAG_CAN_MERGE）；  
  
•scatterlist.page 的所有权属性  
（隐含，无显式标志）；  
  
•xfrm_state.replay_esn 的序列号方向性  
。  
  
形式化方法（如TLA+、Coq、Iris）在 Linux 内核中难以全量推广，但可在关键状态变量的传播路径上做有界模型检查（bounded model checking），这是 6.5 节人机协同再平衡的工程基础。  
  
6.5 人机协同的再平衡：AI 辅助状态机验证应对 AI 辅助漏洞挖掘  
  
攻防失衡的核心体现之一，在于Theori/Xint Code平台能够依托大规模算力集群，仅凭一次操作员提示，即在约一小时内完成针对Linux crypto子系统的全面语义图遍历。这一分析速度已远超人类安全研究员的可审计极限。安天在《人与 AI 协同的漏洞分析新范式》中明确指出，对抗这种范式跃迁的唯一可行路径不是“用规则拦截 AI”，而是“用 AI 辅助验证抵御 AI 辅助挖掘”  
——具体到 Dirty 家族，即：  
  
•AI 辅助审计原语  
——以“零拷贝引用 + 原地写入 + 页缓存源”为模式，对 Linux 全树持续扫描；  
  
•AI 辅助状态机一致性验证  
——为关键状态变量构建全局数据流图，自动发现传播缺失；  
  
•AI 辅助补丁副作用预测  
——在补丁合入前，预测对相邻代码路径的状态影响。  
  
这种再平衡的关键不是“AI 替代人”，而是把人源洞见（如“AF_ALG + splice”的攻击面假设）规模化为面状审计  
。  
  
七、“三体”平衡的实现路径：安全架构重构  
  
7.1 加密 API 的内存安全契约：CRYPTO_REQ_MAY_SHARE 与显式验证接口  
  
Linux 内核 crypto API 当前缺乏对调用方内存的可写性、所有权、共享性的显式标志。我们建议引入类似 CRYPTO_REQ_MAY_SHARE  
 的请求标志，以明示该aead_request 的 src/dst 可能包含外部所有权页面；模板实现（如 authencesn）在该标志存在时必须切换到 out-of-place 模式或主动拒绝。与之配套的是 scatterlist 的所有权元信息  
：每个scatterlist 元素应携带 SG_OWNED_BY_KERNEL  
、SG_BACKED_BY_PAGE_CACHE  
、SG_FROM_USER_SPLICE  
 等枚举所有权属性。  
  
7.2 页缓存管理的架构级改造：共享页标记、COW 强制化、合并路径重构  
  
页缓存当前对所有写入路径均“无条件可写”。建议引入写入路径白名单  
机制：仅VFS 写路径、文件系统专用写路径、显式 mmap MAP_SHARED 写路径可对页缓存页面执行写入；其他路径（包括 crypto in-place、scatterwalk_map_and_copy 等）必须先 COW。该改造需要 skb_cow_data 的语义升级——从“sk_buff 自身是否可写”扩展为“sk_buff 中所有 frag 是否均由内核私有”。skb_try_coalesce、skb_segment、pskb_copy 等合并/分段路径必须将 SKBFL_SHARED_FRAG 视为“传播不变量”。  
  
7.3 跨子系统安全契约：缓冲区来源语义的显式化与传播不变性验证  
  
splice/sendfile/MSG_SPLICE_PAGES 等机制应携带“来源标记（origin tag）”，标识页面源自页缓存、匿名内存、设备 DMA 区等。任何跨子系统传递缓冲区的 API（pipe_buffer、sk_buff frag、scatterlist）必须将该来源标记一并传递。  
来源标记的完整性可由静态分析工具在CI 阶段做强制验证。  
  
7.4 补丁副作用审计机制：从路径检查到状态机全局一致性验证  
  
Linux 内核维护团队应建立关键状态变量清单（critical state inventory）  
，列出所有“具有跨子系统语义不变性的标志位 / 引用计数 / 所有权指针”。任何修改该清单中变量的补丁必须经过以下三层验证：（1）补丁本身路径正确性；（2）该变量在所有传播路径上的一致性回归；（3）该变量在补丁前后所触发的所有依赖代码路径的副作用预测。Dirty Frag → Fragnesia 的“补丁催生漏洞”链条本可在第二层检测中阻断。  
  
7.5 遗留代码的“收益-风险”评估与清理策略  
  
RxRPC/fcrypt、PCBC 模式、authencesn（如果未来 IPsec 全面迁移到 AEAD GCM/ChaCha20-Poly1305）等遗留组件的“密码学价值已不再，代码副作用仍存”。  
建议建立周期性“遗留加密组件审计”机制：（1）评估实际生产环境下的真实调用频次（rxrpc.ko 仅在少数场景使用）；（2）评估其密码学强度（fcrypt 56 位密钥已可暴力）；（3）评估其代码副作用风险（in-place 操作是否成为攻击 sink）。结合三项评估给出“维持 / 弃用 / 强制重构”决策。  
  
7.6 对“执行体治理”理念的映射：运行对象层次的约束、审计与微纵深防御  
  
安天在多年的系统安全实践中提出“执行体治理（Execution Entity Governance）”  
——即将网络安全运营的基本单元从“边界”或“主机”细粒度化到“每一个真实加载并被赋予执行权限的运行对象”。  
在Dirty 家族的语境下，“执行体”概念  
未来  
可被映射到三个层次：  
  
•进程/容器级执行体  
——能否打开 AF_ALG socket、能否触发 unshare(CLONE_NEWUSER)、能否加载 esp4/esp6/rxrpc 模块；  
  
•代码段执行体  
——/usr/bin/su 等 setuid 程序、动态库 pam_unix.so 的页缓存完整性是否被实时校验；  
  
•AI 代理执行体  
——若未来 AI 智能体作为系统进程运行，其能否调用加密接口需作为新的治理对象（这是安天  
将  
“提示词（Prompt）  
视为  
新型执行体”的延伸思考）。  
  
针对Dirty 家族，最直接的执行体治理实践包括：（1）通过 seccomp 限制非治理白名单内的进程创建 AF_ALG/AF_RXRPC socket；（2）通过 AppArmor/SELinux 限制非容器运行时进程的 CLONE_NEWUSER 能力；（3）通过 EDR 实时监测 setuid 二进制的页缓存哈希；（4）将 esp4/esp6/rxrpc/algif_aead 等模块的加载纳入执行体白名单。这些措施单独看都不构成“穷尽漏洞”的方案，但其组合形成的微纵深防御（micro defense-in-depth）  
结构，可在补丁未到位的窗口内阻断绝大多数Dirty 家族变体。  
  
八、结论与展望  
  
8.1 结构性规律总结：“三体”平衡是动态演进而非静态均衡  
  
Dirty 家族给出的最核心结构性规律是：加密机制、性能、系统安全三者之间不存在静态平衡点  
。任何一个时点的“暂时平衡”都会因外部条件（硬件能力、攻击范式、新功能引入）的变化而被打破。Dirty Pipe 揭示了纯 IO 路径的零拷贝风险；Copy Fail 将该风险移到加密路径；Dirty Frag 将该风险链式化并兼顾跨发行版盲区互补；Fragnesia 将该风险升级到补丁副作用层面。  
漏洞  
演进表明，“三体”平衡是一种动态演进过程，每一次平衡的获得本身就是下一次失衡的种子  
。  
  
8.2 开源社区工程哲学：从“默认信任”到“显式验证”再到“状态机证明”  
  
Linux 内核工程哲学过去 30 年的隐式信任模型是：“上游传给我的输入是良好的，我对其做我的工作，下游再按其规则处理”。Dirty 家族证明该模型在涉及共享所有权（页缓存）与跨子系统加密枢纽时已失效。下一阶段的工程哲学应从“默认信任”演进到“显式验证”——所有权、可写性、共享性须有显式标志；再演进到  
基于AI算力平台支持的  
“状态机证明”——关键状态变量在所有传播路径上须经过有界模型检查。  
  
8.3 未来安全趋势：原语识别、语义标注、链式推演与修复副作用预测  
  
未来1-3 年内，Linux 内核安全工程的四个明确趋势可被预见：  
  
1.AI 辅助原语识别（Primitive Identification）将常态化  
——“零拷贝引用 + 原地写入 + 页缓存源”等模式将被作为持续扫描规则纳入内核 CI；  
  
2.语义标注体系建立  
——scatterlist、sk_buff、pipe_buffer 等核心结构将逐步引入所有权/出处的语义标注；  
  
3.链式攻击推演工具化  
——攻击原语之间的链式可达性将通过图算法工具化分析；  
  
4.修复副作用预测  
——补丁合入流程将引入“对关键状态变量的全局影响预测”作为强制检查项。  
  
8.4 防御启示：走出穷尽漏洞的误区，构建运行对象层次的微纵深防御  
  
在Mythos、和GPT 5.5带来了对AI挖掘漏洞能力的极大恐慌，Xint Code亦构建人机协同的漏洞示范样本的背景下。安天一方面认可，漏洞挖掘是重要的安全能力，漏洞分析响应修补是安全的基础能力。但同时也希望再次强调， “漏洞不是一种对象客体”，试图通过穷尽漏洞来消亡漏洞的安全努力将是徒劳的。其实  
系统环境和上下文条件复杂性的“涌现属性”  
，是攻防过程中  
攻防关系中成为  
的“  
关系型存在  
”。穷尽漏洞既不可能，也不应作为目标  
。  
  
防御方的合理目标因此应从“穷尽漏洞”转向“承认漏洞的客观存在的必然性，将资源放到缓解、削弱攻击者利用漏洞作为入口的能力  
”。具体到运营层面  
，包括  
：  
  
•极限的暴露面和可攻击面治理——  
基于端口、账户、服务治理全面削弱攻击者的可达性条件，基于配置优化尽可能的关闭不使用的功能和能力  
  
•不依赖于补丁的及时性——  
在补丁未到位的窗口内通过模块黑名单、seccomp 策略、AppArmor 限制阻断利用前置条件；  
  
•执行体层面的实时校验  
——对 setuid 二进制、动态库、关键配置文件（/etc/passwd、/etc/sudoers）的页缓存完整性做实时校验；  
  
•运行对象的细粒度管控  
——将每一个执行体（  
可执行文件、  
进程、容器、模块、AI 代理）作为独立治理单元，赋予最小所需  
权限  
；  
  
•威胁情报与运营闭环  
——  
构建在终端防护侧对  
攻击原语  
的规则化能力，并  
作为通用威胁知识纳入EDR/XDR 规则库，与执行体信誉评估结合。  
  
这些能力与治理手段，与  
安天  
对  
 “网络安全的基石重回系统一侧”  
的判断，和  
“安全边界细粒度化到每一个执行对象之上”  
的产品导向  
完全一致。它不是  
某个  
漏洞家族的“特定解”，而是面对涌现性漏洞时代的“通用工程姿态”。  
  
（本文编写中使用了多个大模型工具和智能体进行内容生成和信息检索校验，但报告完整内容经过了人工审核，特此说明）  
  
附录参考资料  
  
[1] 安天  
CERT  
.  
CVE-2026-31431（Copy Fail）漏洞 FAQ（上）——漏洞的基本情况、影响范围与处置篇[R/OL]. (2026-05-12)[2026-05-18].   
  
https://www.antiy.com/response/Copy_Fail_FAQ_01.html  
.  
  
[2] 安天  
CERT  
. CVE-2026-31431（Copy Fail）漏洞 FAQ（下）——漏洞技术机理、历史坐标与战略启示篇[R/OL]. (2026-05)[2026-05-18].   
  
https://www.antiy.com/response/Copy_Fail_FAQ_02.html .  
  
[3] 安天研究院. 人与AI协同的漏洞分析新范式——Copy Fail发现过程解析[R/OL]. (2026-05)[2026-05-18].   
  
https://www.antiy.com/response/Copy_Fail_Analysis.html.  
  
[4] 安天研究院. 基于Dirty Frag漏洞发现过程的“攻击原语”思考——再论漏洞发现与分析工作的人机分工[R/OL]. (2026-05)[2026-05-18].   
  
https://www.antiy.com/response/Dirty_Frag.html.  
  
[5] 安天研究院. “分片失忆”——Dirty Frag 补丁如何催生了 Fragnesia 漏洞[R/OL]. (2026-05)[2026-05-18].   
  
https://www.antiy.com/response/Dirty_Frag02.html.  
  
[6] MITRE. CVE-2022-0847[EB/OL]. (2022)[2026-05-18]. https://nvd.nist.gov/vuln/detail/CVE-2022-0847.  
  
[7] KELLERMANN M. The Dirty Pipe Vulnerability[EB/OL]. (2022-03-07)[2026-05-18].   
  
https://dirtypipe.cm4all.com/.  
  
[8] MITRE. CVE-2026-31431[EB/OL]. (2026)[2026-05-18]. https://nvd.nist.gov/vuln/detail/CVE-2026-31431.  
  
[9] Xint Code Research Team. Copy Fail: 732 Bytes to Root on Every Major Linux Distribution[EB/OL]. (2026-04-29)[2026-05-18].   
  
https://xint.io/blog/copy-fail-linux-distributions.  
  
[10] MITRE. CVE-2026-43284, CVE-2026-43500[EB/OL]. (2026)[2026-05  
-18].   
  
https://nvd.nist.gov/vuln/detail/CVE-2026-43284  
.  
  
https://nvd.nist.gov/vuln/detail/CVE-2026-43500.  
  
[11] KIM H (V4bel). Dirty Frag Write-up[EB/OL]. (2026-05-07)[2026-05-18].  
  
 https://github.com/V4bel/dirtyfrag/blob/master/assets/write-up.md.  
  
[12] MITRE. CVE-2026-46300[EB/OL]. (2026)[2026-05-18]. https://nvd.nist.gov/vuln/detail/CVE-2026-46300.  
  
[13] BOWLING W. Fragnesia PoC and Write-up[EB/OL]. V12 Security Team. (2026-05-13)[2026-05-18].   
  
https://github.com/v12-security/pocs/tree/main/fragnesia.  
  
[14] DWORKIN M. Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC: NIST SP 800-38D[S]. Gaithersburg: National Institute of Standards and Technology, 2007. NIST Crypto Publication Review Board 2024-03-05 revision decision.  
  
https://www.nist.gov/news-events/news/2024/03/nist-revise-special-publication-800-38d-galoiscounter-mode-gcm-and-gmac  
  
[15] KENT S. IP Encapsulating Security Payload (ESP): RFC 4303[S]. IETF, 2005-12.  
  
https://www.ietf.org/media/documents/241209_IETF_RFC_Declaration_-_RFCs_4303_4304_4307_4308_4309_4543_4835_4868_599_8vOcsP5.pdf  
  
[16] CHEN K T, KLASSERT S. [PATCH net 8/8] xfrm: esp: avoid in-place decrypt on shared skb frags[EB/OL]. netdev mailing list. (2026-05)[2026-05-18].   
  
https://www.spinics.net/lists/netdev/msg1183448.html.  
  
[17] CORBET J. Rethinking splice()[EB/OL]. LWN.net. (2023-02-17)[2026-05-18].   
  
https://lwn.net/Articles/923237/.  
  
[18] CISA. Known Exploited Vulnerabilities Catalog: CVE-2026-31431[EB/OL]. (2026-05-01)[2026-05-18].   
  
https://www.cisa.gov/known-exploited-vulnerabilities-catalog.  
  
[19] Microsoft Security Response Center. CVE-2026-31431: Copy Fail vulnerability enables Linux root privilege escalation across cloud environments[EB/OL]. (2026-05-01)[2026-05-18]. https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/.  
  
[20] Tenable Research Special Operations. Dirty Frag (CVE-2026-43284, CVE-2026-43500): Linux Kernel Privilege Escalation FAQ[EB/OL]. (2026-05-08)[2026-05-18].   
  
https://www.tenable.com/blog/dirty-frag-cve-2026-43284-cve-2026-43500-frequently-asked-questions-linux-kernel-lpe.  
  
[21] Tenable Research Special Operations. Fragnesia (CVE-2026-46300): Linux Kernel ESP-in-TCP LPE FAQ[EB/OL]. (2026-05-14)[2026-05-18].  
  
https://www.tenable.com/blog/fragnesia-cve-2026-46300-faq-about-new-linux-kernel-xfrm-esp-in-tcp-priv-esc.  
  
[22] HOWELLS D. RxRPC Network Protocol[EB/OL]. The Linux Kernel Documentation. [2026-05-18].   
  
https://docs.kernel.org/networking/rxrpc.html.  
  
[23] Linux Kernel. net/rxrpc/Kconfig[EB/OL]. [2026-05-18]. https://github.com/torvalds/linux/blob/master/net/rxrpc/Kconfig.  
  
[24] 安天集团. 以执行体治理为基石，助力智慧民航建设[R/OL].   
(2023)[2026-05-18].   
  
https://mp.weixin.qq.com/s/Qb0c-xA1fgqbxGZG2ASxCA.  
  
[25] 安天  
CERT  
. 利爪浩劫——面向AI代理OpenClaw技能市场的大规模投毒行动分析[R/OL]. (2026)[2026-05-18].  
  
https://www.antiy.com/response/OpenClaw_AI_Poisoning_Attack_Analysis.html.  
  
[26] Sysdig Threat Research Team. CVE-2026-31431: “Copy Fail” Linux kernel flaw lets local users gain root in seconds[EB/OL]. (2026-04-29)[2026-05-18].   
  
https://www.sysdig.com/blog/cve-2026-31431-copy-fail-linux-kernel-flaw-lets-local-users-gain-root-in-seconds.  
  
[27] Sysdig Threat Research Team. Dirty Frag (CVE-2026-43284 and CVE-2026-43500): Detecting unpatched local privilege escalation via Linux Kernel ESP and RxRPC[EB/OL]. (2026-05)[2026-05-18].   
  
https://www.sysdig.com/blog/dirty-frag-cve-2026-43284-and-cve-2026-43500-detecting-unpatched-local-privilege-escalation-via-linux-kernel-esp-and-rxrpc.  
  
[28] InfoQ. Copy Fail and Dirty Frag: Linux Page-Cache Exploits Target Every Major Distribution[EB/OL]. (2026-05)[2026-05-18]. https://www.infoq.com/news/2026/05/copy-fail-dirty-frag-linux/.  
  
[29] AlmaLinux Project. Fragnesia (CVE-2026-46300): Patched kernels available[EB/OL]. (2026-05-13)[2026-05-18].   
  
https://almalinux.org/blog/2026-05-13-fragnesia-cve-2026-46300/.  
  
[30] Canonical Ltd.Fixes available for CVE-2026-31431 (Copy Fail) Linux Kernel Local Privilege Escalation Vulnerability[EB/OL]. (2026-05)[2026-05-18].   
  
https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available.  
  
[31] BUGCROWD. What we know about Copy Fail (CVE-2026-31431)[EB/OL]. (2026-04-29)[2026-05-18].   
  
https://www.bugcrowd.com/blog/what-we-know-about-copy-fail-cve-2026-31431/.  
  
[32] ARPA-H, DARPA. DARPA AI Cyber Challenge (AIxCC) Finals Results[EB/OL]. (2025-08)[2026-05-18].   
  
https://arpa-h.gov/.  
  
[33] Dark Reading. Dirty Frag Exploit Poised to Blow Up on Enterprise Linux Distros[EB/OL]. (2026-05)[2026-05-18]. https://www.darkreading.com/vulnerabilities-threats/dirty-frag-exploit-blow-up-enterprise-linux-distros.  
  
**往期推荐:**  
  
  
  
  
  
# “分片失忆”——Dirty Frag补丁如何催生了Fragnesia漏洞  
  
  
  
[基于Dirty Frag漏洞发现过程的“攻击原语”思考——再论漏洞发现与分析工作的人机分工](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214707&idx=1&sn=918c767dcbb97cfb7a1d3f3bd7ecf6f2&scene=21#wechat_redirect)  
  
  
  
[人与AI协同的漏洞分析新范式——Copy Fail发现过程解析](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214696&idx=1&sn=191837d70f13dd2c2aa6f163edd80444&scene=21#wechat_redirect)  
  
  
  
[CVE-2026-31431（Copy Fail）漏洞FAQ（上）——漏洞的基本情况、影响范围与处置篇](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214685&idx=1&sn=5c1d5e3dc08490e7bd919dba10cc01bd&scene=21#wechat_redirect)  
  
  
  
[CVE-2026-31431（Copy Fail）漏洞FAQ（下）——漏洞技术机理、历史坐标与战略启示篇](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214688&idx=1&sn=de694ee3d652992e2023cd7ac07fbe8f&scene=21#wechat_redirect)  
  
  
