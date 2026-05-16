#  “分片失忆”——Dirty Frag补丁如何催生了Fragnesia漏洞  
安天研究院
                    安天研究院  安天集团   2026-05-16 15:55  
  
点击上方"蓝字"  
  
关注我们吧！  
  
  
  
摘要：Linux 内核近期爆发的 Fragnesia（“分片失忆”）漏洞，揭示了安全补丁可能激活历史代码缺陷的连锁风险。该漏洞因SKB 标记在分片合并过程中静默丢失而得名“分片失忆”：安天研究院研究人员提出了补丁衍生漏洞问题的研究框架，基于大模型的全面辅助，完成本报告编写。旨在深入剖析这一补丁衍生漏洞的技术根因与状态机演化机理，系统梳理同类历史缺陷案例，并针对漏洞挖掘、缺陷修补与补丁审核流程提出优化建议。报告强调：Fragnesia 事件给开发者与安全修复者很深的教益，但其不应导致补丁恐慌心理。其事件证明的是补丁修复机制需要在AI时代升级由传统路径检测进阶至全局状态机一致性校验。但必须明确的是，补丁修复是应对软件安全缺陷的最基础和必备的机制。  
  
  
**01**  
  
**引言**  
## 1.1 事件回溯：从Dirty Frag到Fragnesia的“漏洞连锁”  
  
2026年5月，Linux内核安全社区经历了一场罕见的连锁安全事件。5月4日，Kuan-TingChen向netdev邮件列表提交了基于shared-frag方法的修复补丁。该补丁引入SKBFL_SHARED_FRAG标记机制，意图在ESP输入路径中识别并阻断来自splice()的共享缓存页。5月7日，独立安全研究员Hyunwoo Kim（@v4bel）通过oss-security邮件列表公开披露了Dirty Frag漏洞——一个通过链式组合xfrm-ESP（CVE-2026-43284）与RxRPC（CVE-2026-43500）两个页缓存写入原语实现的本地权限提升（LPE）漏洞，影响Ubuntu 24.04.4、RHEL 10.1、openSUSE Tumbleweed、CentOS Stream 10、AlmaLinux 10、Fedora 44等全系列主流发行版。该漏洞的破坏性在于其确定性：无需竞态条件，不依赖内核版本差异，单原语即可覆盖setuid二进制文件的内存映像，CVSS评分高达7.8。Linux内核维护者在压力之下迅速响应，5月7日，xfrm子系统维护者Steffen Klassert引导该补丁合入netdev tree；5月8日，补丁（commit f4c50a4034e6）合入mainline。社区一度认为，Dirty Frag的攻击面已被彻底封堵。  
  
然而，约5-6天后的5月13日，安全研究员William Bowling——Zellic公司Head of Assurance、V12 Security团队成员——向netdev邮件列表提交了Fragnesia的修复补丁（Message-ID: 20260513041635.1289541-1-vakzz@zellic.io），正式披露Fragnesia（CVE-2026-46300）。其利用路径直接源于Dirty Frag的修复补丁——SKBFL_SHARED_FRAG标记在skb_try_coalesce()的合并路径中丢失，导致修复后的内核反而开放了新的页缓存写入窗口。攻击者通过AES-GCM的密钥流异或（keystream XOR）实现逐字节精确写入，PoC成功覆盖/usr/bin/su的前192字节。该漏洞的CVSS评分同样高达7.8。从Dirty Frag到Fragnesia，间隔不是数月，而是短短约一周。这不是巧合，而是补丁衍生漏洞（Patch-Induced Vulnerability）的典型案例：一  
个  
旨在  
“  
治愈  
”漏洞  
的补丁，在特定条件下  
“  
催生  
”  
了新的攻击面。  
## 1.2 演化悖论：安全补丁为何成为新漏洞的温床  
  
漏洞响应修复  
模型遵循  
“  
发现-修复-验证-关闭  
”  
的线性逻辑。然而，Fragnesia的事件轨迹呈现了一个非线性悖论：修复行为本身改变了系统的状态空间，使得原本休眠的缺陷获得新的语义上下文，从而被“激活”为可利用漏洞  
。这一悖论的  
可以视为一个  
状态机复杂性  
问题  
。状态机  
是  
固定状态  
基于  
触发条件  
和迁移  
规则的行为逻辑模型  
，  
 Linux 内核整套资源、数据结构、网络缓冲区、协议流程共同构成的  
复杂的  
全局运行状态流转体系  
，因此其  
内核  
并非  
静态代码集合，而是动态演化的状态机网络。任何安全补丁——尤其是引入新标记、新检查点、新分支路径的补丁——都会改变状态迁移规则  
。若补丁设计者对状态机的全局拓扑缺乏完整认知，新引入的状态变量可能在某些迁移路径中  
“  
丢失  
”  
或  
“  
变异  
”  
，产生补丁设计者未预期的可达状态。Dirty Frag的修复补丁正是如此：它引入了一个二元标记SKBFL_SHARED_FRAG，假设该标记会随skb（socket buffer）在其全生命周期内正确传播。  
  
然而，skb在内核网络栈中经历分配、克隆、合并、分片、释放等数十种操作，每种操作都可能改变其内部状态。补丁设计者验证了ESP输入路径的标记检查，却遗漏了skb_try_coalesce()合并路径中的标记传播——一个自2013年（commit cef401de7be8）即存在、13年间从未被触发的古老缺陷。Fragnesia补丁同时指向了两个Fixes标签：2013年的cef401de7be8和2026年的f4c50a4034e6，需要特别澄清的是：从技术真相来看，Fragnesia并非由Dirty Frag补丁  
“  
引入  
”  
新bug，而是Dirty Frag补丁添加了依赖SKBFL_SHARED_FRAG标记正确的代码路径，使得一个已有13年历史的coalescing bug首次变得可被利用。  
## 1.3 “分片失忆”：Fragnesia根因的精确比喻（skb分片合并中的标记丢失）  
  
Fragnesia是William Bowling基于Fragment（碎片、内核网络分片）和nesia = Amnesia（失忆、遗忘）两个词的拼接构造，因此本漏洞也被中译为“分片失忆”。  
skb_try_coalesce()是内核中负责将两个相邻skb的分片区合并的函数，其设计目标是减少内存分配开销、提升网络吞吐量在Linux内核网络栈中，skb（socketbuffer）是网络数据包的核心载体。当数据包较大或经过零拷贝路径时，skb的数据区可能由多个分片（fragment，简称frag）组成，这些分片指向独立的内存页。这个记忆在ESP输入路径中被读取，若存在则强制触发COW（Copy-On-Write），阻止原地解密对共享页的篡改Dirty Frag修复补丁为skb引入了一个  
“  
记忆  
”  
——SKBFL_SHARED_FRAG标记，定义于include/linux/skbuff.h（SKBFL_SHARED_FRAG = BIT(1)），用于标识该skb包含来自用户态splice()的共享缓存页，然而，当两个skb经过skb_try_coalesce()合并时，这个  
“  
记忆  
”  
被选择性遗忘了。合并后的skb继承了合并前的数据内容，却丢失了共享页标记。于是，一个本应被标记为  
“  
危险  
”  
的缓存页，在合并后以  
“  
清白  
”  
身份进入ESP-in-TCP解密路径，接受AES-GCM的原地异或操作——分片失忆，标记归零  
，攻击由此发生。  
  
  
**02**  
  
治愈与副作用：补丁的正反双重属性  
## 2.1 Dirty Frag修复的关键逻辑：SKBFL_SHARED_FRAG标记机制  
##   
  
Dirty Frag的攻击核心在于：攻击者通过splice()将setuid二进制文件（如/usr/bin/su）的缓存页注入网络skb的分片区，随后skb进入xfrm-ESP或RxRPC解密路径，原地解密操作直接覆盖共享缓存页实现提权。为修复该漏洞，Kuan-Ting Chen提交的修复补丁（commit f4c50a4034e6），由Steffen Klassert等维护者审核后合入主线，该补丁采用了  
“  
标记-检查  
”  
策略。标记阶段：在splice()将缓存页注入skb分片区时，为skb设置SKBFL_SHARED_FRAG标记；传播阶段：假设该标记会随skb的克隆、引用、传递等操作正确传播；检查阶段：在ESP输入路径（esp_input()→esp_input_done2()）中，检查skb是否携带该标记。若携带，则对涉及的原地解密操作强制触发skb_cow_data()进行私有复制，避免在共享frag上执行原地解密。这一策略在单一路径验证中看似完备：只要标记正确设置并在ESP路径前未被篡改，攻击者的共享页注入即被阻断。  
## 2.2 修复的边界假设：标记会随skb全生命周期正确传播  
##   
  
修复补丁隐含了三个边界假设，这些假设共同构成了“充分性幻觉”的基础。  
  
假设一：标记的持久性。  
SKBFL_SHARED_FRAG作为skb私有标志的一部分，应在skb的所有操作中保持持久，直至skb释放。  
  
假设二：标记的遗传性。  
当skb被克隆（skb_clone()）、复制（skb_copy()）或引用时，标记应被正确继承。  
  
假设三：标记的封闭性。  
skb的分片区操作（如分片添加、删除、合并）不应导致标记丢失，除非操作显式清除了分片的共享属性。每一步迁移都可能涉及skb的重新分配、分片重组或标志位操作。  
  
这三个假设在线性路径中成立，但在非线性状态迁移中失效。skb在内核网络栈中的生命周期并非简单的线性传递，而是经历复杂的图状状态迁移：网络中断接收→GRO（Generic Receive Offload）聚合→skb_try_coalesce()合并→协议栈处理（TCP/UDP）→ULP（Upper Layer Protocol）切换（如espintcp）→xfrm解密。  
## 2.3 被忽视的角落：高性能合并路径中的标记静默丢失  
<table><tbody><tr></tr></tbody></table>  
  
skb_try_coalesce()的合并路径，其核心功能是将两个相邻的skb（to和from）合并为一个，以减少分片数量、提升缓存局部性。skb_try_coalesce()是内核网络栈中的高频优化函数，位于net/core/skbuff.c  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XBFaicYdOHk8x6UkvDe0RWSj5ujOn7dOVtH8OxBWcg1dNNbG8Wm4ppcqChE6SOfYh5YJkT9UNalGcnLdJiamyuICmdVEInIt1TMTxtLJ78vn8/640?wx_fmt=png&from=appmsg "")  
  
在Dirty Frag修复之前，这一行为无关紧要——网络栈中不存在需要跨skb传播的共享页标记。但修复补丁引入SKBFL_SHARED_FRAG后，skb_try_coalesce()的  
“  
标志位不传播”行为从  
“  
无害的设计选择  
”  
变成了  
“  
危险的标记丢失  
”  
。该函数自2013年引入以来，历经数十次优化迭代，但其核心逻辑始终未变：合并时复制分片指针，但不复制或合并源skb的标志位补丁设计者未同步审计skb_try_coalesce()的原因在于性能敏感路径的  
“  
修复免疫性  
”  
：该函数是每包处理的热路径（hot path），增加任何额外检查（如标志位传播）都会引入分支预测失败和内存访问延迟。开发者在修复Dirty Frag时，本能地回避了对热路径的修改，选择了在  
“  
足够安全”的ESP路径入口处增加检查点。  
## 2.4 标记“失忆”：合并后SKBFL_SHARED_FRAG丢失的代码机理  
##   
  
标记丢失的精确机理如下：设定场景为skb_a由攻击者通过splice()注入并携带SKBFL_SHARED_FRAG标记，分片区包含/usr/bin/su的缓存页。skb_b为正常网络数据包，无共享页标记，分片区为内核私有页。  
其  
合并过程  
如下  
：  
  
1.  
TCP接收路径中，skb_a和skb_b因数据连续被送入skb_try_coalesce()；  
  
2.  
函数将skb_a和skb_b的分片区合并为新的分片数组；  
  
3.  
函数释放skb_a和skb_b的独立结构，返回合并后的skb_merged；  
  
4.  
skb_merged未继承SKBFL_SHARED_FRAG——标记丢失；  
  
5.  
合并后的skb_merged进入TCP ULP切换路径，被标记为espintcp（ESP-in-TCP）；  
  
6.  
skb_merged进入xfrm ESP-in-TCP解密路径；  
  
7.  
由于SKBFL_SHARED_FRAG已丢失，esp_input_done2()中的skb_has_shared_frag()检查返回false；  
  
8.  
AES-GCM原地解密执行，密钥流异或覆盖共享缓存页；  
  
9.  
/usr/bin/su的内存映像被篡改，下次执行时触发提权  
；  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/XBFaicYdOHkicwbdFtC77z5MlbojttvHxf9qLHKvweu7e3bejI2ozLMXcyYfvBibhnHJBw8686M6gnQF1uZZHb60S5U0iaVyV0ScE6GQJDLacqI/640?wx_fmt=png&from=appmsg "")  
  
图1 Fragnesia攻击链路：从splice()到权限提升  
  
其关键问题在于：  
标记丢失不是“数据损坏”，而是语义断裂。缓存页仍然是共享的（_refcount>1），但skb的元数据不再反映这一事实。内核的安全决策依赖于元数据而非物理内存状态，元数据的“失忆”直接导致安全策略的失效。正如William Bowling在Fragnesia补丁描述中指出的：skb_try_coalesce()在将分页frag从@from附加到@to时，如果@from设置了SKBFL_SHARED_FRAG标记，合并后的@to仍会保留原有的外部归属或页缓存关联分片，却无法继承共享页标记。标记静默丢失直接破坏了后续解密路径原地写入防护机制所依赖的内核不变量。  
  
  
**03**  
  
**古老缺陷的**“激活”  
## 3.1 2013年的沉睡代码：skb_try_coalesce()标记传播缺陷的历史  
##   
  
skb_try_coalesce()的标记传播缺陷并非新引入的代码错误，而是自2013年即存在的设计惯性。Fragnesia补丁中的Fixes标签明确指向两个commit：  
  
Fixes: cef401de7be8 ("net: fix possible wrong checksum generation") ←2013年提交  
  
Fixes: f4c50a4034e6 ("xfrm: esp: avoid in-place decrypt on shared skb frags")  ← Dirty F  
a  
rg修补丁  
  
2013年，Linux内核网络栈面临10GbE乃至40GbE网络接口的吞吐压力。skb_try_coalesce()的引入是为了解决高带宽场景下skb分片过多导致的缓存抖动和内存分配开销。其设计哲学是最小化元数据操作：仅复制分片指针，不复制标志位，不更新引用计数以外的任何状态 在当时的设计语境中，这一选择是合理的：-skb->shinfo->tx_flags主要用于发送路径的硬件卸载标记（如VLAN、TSO、checksum offload），与接收路径的内存安全无关；-不存在  
“  
共享缓存页  
”  
的概念需要跨skb传播；-合并操作追求极致性能，任何额外的位操作都被视为不必要的开销。因此，skb_try_coalesce()的  
“  
标志位不传播  
”  
不是bug，而是设计假设——一个在当时完全成立、在13年后被Dirty Frag修复补丁推翻的设计假设。  
## 3.2 为何13年间未被触发：无标记机制时的“无害性”  
##   
  
一处潜伏长达13年的逻辑缺陷，之所以长期未爆发安全风险，原因是漏洞依赖的前置约束始终不存在。skb_try_coalesce()自2013年落地以来，始终遵循合并分片时只拷贝分片数据、不同步传递SKB标志位的固有逻辑。在内核未引入SKBFL_SHARED_FRAG安全标记的漫长周期里，网络栈无需跨skb流转共享页属性与安全元数据，仅frag数据合并即可满足业务与性能需求。此时标记不传播的行为只是普通的历史设计习惯，不存在安全危害。这个问题可类比为：一扇原本无需上锁的门，没有锁具、也无需上锁，  
“  
不能上锁  
”  
本身算不上缺陷；直到后续为安全防护加装门锁，才发现门体结构先天存在，无法适配锁具逻辑。Dirty Frag修复补丁引入SKBFL_SHARED_FRAG后，相当于给网络栈增设了共享页防护校验，而skb_try_coalesce()遗留的标志位不传播短板，立刻turned从无害设计变为致命缺陷，最终造成防护标记静默丢失、安全策略被绕过。  
## 3.3 Dirty Frag补丁的“激活效应”  
##   
  
新标记使古老缺陷首次成为攻击路径Fragnesia的悖论在于：修复补丁不是修补了缺陷，而是激活了缺陷。Dirty Frag修复补丁引入SKBFL_SHARED_FRAG标记，本意是增加安全状态机的维度。然而，这一新增维度与旧有代码路径（skb_try_coalesce()）发生了不兼容交互的状态机演化：  
新状态机中，skb_try_coalesce()成为未定义迁移（undefined transition）——补丁设计者未考虑该路径下标记应如何传播，旧代码也未处理新标记。结果，系统退回到旧状态机的默认行为（skb_normal），绕过了新引入的安全检查。这种  
“  
激活效应  
”  
是补丁衍生漏洞的典型模式：新代码赋予旧缺陷新的语义上下文，使其从  
“  
不可达状态  
”  
跃迁至  
“  
可达且可利用状态  
”  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/XBFaicYdOHk8VjbCAzVox5gian9nHHdQdK7wJC5YdM1vzgAauPjiaGsbkqtGtG5WB9xRYMIccbpSZzJpSRdA0m8etQ285fU82VgmTEslBqGIYw/640?wx_fmt=png&from=appmsg "")  
  
图2  
 状态机演化图展示Dirty Frag补丁如何引入Fragnesia漏洞  
## 3.4 从“设计疏忽”到“补丁衍生漏洞”的状态跃迁  
##   
  
Fragnesia的状态跃迁揭示了漏洞分类学的演进：补丁衍生漏洞的特殊性在于其责任归属的复杂性：修复者并非引入原始缺陷，但其修复行为改变了系统的状态空间拓扑，使得原始缺陷首次成为攻击路径。这要求安全社区建立补丁副作用审计（Patch Side-Effect Auditing）机制，将修复行为本身纳入漏洞研究范畴。  
  
  
**04**  
  
**补丁衍生漏洞的规律与启示**  
## 4.1 补丁衍生漏洞的三种路径：绕过、降级、激活与历史案例  
##   
  
Fragnesia案例是补丁“激活”漏洞的代表性事件，但“激活型”只是补丁衍生漏洞的路径之一，基于对历史上多起补丁衍生漏洞的分析，我们将衍生路径其划分为三类：绕过型（Bypass）、降级型（Degradation）、激活型（Activation）。当然还有一种情况就是攻击者以修复者的身份出现，在补丁中构造漏洞，典型案例如：  
XZ Utils 后门事件（CVE-2024-3094）  
，  
攻击者伪装成修复者  
、  
贡献者，在补丁里直接构造漏洞  
。但这是其实是一个带有社会工程学，不在安天本篇讨论范围之内。我们未来会做专题讨论。  
  
以下选取几个经典历史案例，分别分析三种衍生路径机理。  
  
表1 补丁衍生漏洞分类与历史案例表  
<table><tbody><tr style="height:18.0000pt;"><td data-colwidth="91" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(79,129,189);mso-border-left-alt:0.5000pt solid rgb(79,129,189);border-right:none;mso-border-right-alt:none;border-top:1.0000pt solid rgb(79,129,189);mso-border-top-alt:0.5000pt solid rgb(79,129,189);border-bottom:1.0000pt solid rgb(79,129,189);mso-border-bottom-alt:0.5000pt solid rgb(79,129,189);background:rgb(79,129,189);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">补丁衍生漏洞类型</span></span></font></span></b></p></td><td data-colwidth="193" width="180" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt medium 1pt 1pt;border-style: solid none solid solid;border-color: rgb(79, 129, 189) currentcolor rgb(79, 129, 189) rgb(149, 179, 215);background: rgb(79, 129, 189);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">类型说明</span></span></font></span></b></p></td><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: 1pt;border-style: solid;border-color: rgb(79, 129, 189) rgb(79, 129, 189) rgb(79, 129, 189) rgb(149, 179, 215);background: rgb(79, 129, 189);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">历史漏洞案例</span></span></font></span></b></p></td></tr><tr style="height:28.5000pt;"><td rowspan="3" data-colwidth="91" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(149,179,215);mso-border-left-alt:0.5000pt solid rgb(149,179,215);border-right:1.0000pt solid rgb(149,179,215);mso-border-right-alt:0.5000pt solid rgb(149,179,215);border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid rgb(149,179,215);mso-border-bottom-alt:0.5000pt solid rgb(149,179,215);background:rgb(219,229,241);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">绕过</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">/ Bypass</span></span></font></span></b></p></td><td rowspan="3" data-colwidth="193" width="180" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">修复补丁增加了检查点（如权限校验、边界检查、状态验证等），但攻击者通过分析补丁引入的控制流变化找到了绕过这些检查点的替代路径，使得安全检查形同虚设</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">。</span></span></font></span></p></td><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">GC BUG\_ON Bypass</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2021-0920</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">）</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><span style="font-family:微软雅黑;mso-spacerun:&#39;yes&#39;"><span leaf=""><span textstyle="" style="font-size: 14px;"> </span></span></span></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">，</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Android Linux内核GC（垃圾回收）子系统中，补丁引入的BUG\_ON检查可被绕过，导致权限提升。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">nft\_tables Check Bypass</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2022-34918）</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">，</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">nftables子系统的补丁验证逻辑不完整，攻击者可绕过类型检查执行任意代码。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Netfilter Compat Bypass</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2021-22555</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">）</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><span style="font-family:微软雅黑;mso-spacerun:&#39;yes&#39;"><span leaf=""><span textstyle="" style="font-size: 14px;"> </span></span></span></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">，</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">netfilter兼容层补丁未覆盖全部compat路径，导致32位兼容模式下安全检查被绕过。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td rowspan="3" data-colwidth="91" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(149,179,215);mso-border-left-alt:0.5000pt solid rgb(149,179,215);border-right:1.0000pt solid rgb(149,179,215);mso-border-right-alt:0.5000pt solid rgb(149,179,215);border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid rgb(149,179,215);mso-border-bottom-alt:0.5000pt solid rgb(149,179,215);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">降级</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">/ Degradation</span></span></font></span></b></p></td><td rowspan="3" data-colwidth="193" width="180" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">修复补丁增加了检查点（如权限校验、边界检查、状态验证等），但攻击者通过分析补丁引入的控制流变化找到了绕过这些检查点的替代路径，使得安全检查形同虚设</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">。</span></span></font></span></p></td><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">io\_uring Timeout Race</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2022-29582</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">io\_uring超时机制的修复/优化逻辑本身成为竞争条件来源，引发权限提升。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">XFRM Namespace Race</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2022-3028</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），添加</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">XFRM命名空间支持的补丁无意中引入竞态条件，导致信息泄露和UAF。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">io\_uring GC UAF</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2022-2602</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">io\_uring注册文件的优化与Linux垃圾回收机制交互产生新的UAF窗口。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td rowspan="4" data-colwidth="91" valign="top" style="padding:0.0000pt 5.4000pt 0.0000pt 5.4000pt;border-left:1.0000pt solid rgb(149,179,215);mso-border-left-alt:0.5000pt solid rgb(149,179,215);border-right:1.0000pt solid rgb(149,179,215);mso-border-right-alt:0.5000pt solid rgb(149,179,215);border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid rgb(149,179,215);mso-border-bottom-alt:0.5000pt solid rgb(149,179,215);background:rgb(219,229,241);"><p style="mso-pagination:widow-orphan;text-align:left;"><b><span style="font-family:微软雅黑;color:rgb(0,0,0);font-weight:bold;font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">激活</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">/ Activation</span></span></font></span></b></p></td><td rowspan="4" data-colwidth="193" width="180" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">修复补丁引入新标志位、新状态机或新机制，但与已有代码路径不兼容，导致原本无法触发的休眠缺陷（</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">dormant bug）在新语义上下文中首次变为可利用</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">。</span></span></font></span></p></td><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">tcindex Reference Count</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2023-1281</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">tcindex调度器补丁引入的同步机制与已有工作流不兼容，激活休眠的引用计数缺陷。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">SYSCTL Stack Overflow</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2022-4378</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），多个补丁的叠加效应激活了</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">sysctl子系统中已休眠13年的栈溢出缺陷。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);background: rgb(219, 229, 241);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">QFQ Out-of-Bounds Write </span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2023-31436</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">QFQ调度器补丁叠加多个历史变更，激活越界写漏洞，导致内核内存破坏。</span></span></font></span></p></td></tr><tr style="height:28.5000pt;"><td data-colwidth="292" width="384" valign="top" style="padding: 0pt 5.4pt;border-width: medium 1pt 1pt;border-style: none solid solid;border-color: currentcolor rgb(149, 179, 215) rgb(149, 179, 215);"><p style="mso-pagination:widow-orphan;text-align:left;"><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Fragnesia (Marking Loss)</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">漏洞（</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">CVE-2026-46300</span></span></font></span><span style="font-family:微软雅黑;color:rgb(0,0,0);font-size:6.5000pt;mso-font-kerning:0.0000pt;"><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">），</span></span></font><font face="微软雅黑"><span leaf=""><span textstyle="" style="font-size: 14px;">Dirty Frag修复补丁引入SKBFL\_SHARED\_FRAG标记，在skb\_try\_coalesce()合并路径中丢失，导致页缓存写入攻击。</span></span></font></span></p></td></tr></tbody></table>### 形态一：绕过（Bypass）  
  
该形态的修复补丁增加了检查点（如权限校验、边界检查、状态验证等），但攻击者通过分析补丁引入的控制流变化找到了绕过这些检查点的替代路径，使得安全检查形同虚设。  
  
关键特征：  
  
✦ 补丁意图正确，检查逻辑本身无缺陷；  
  
✦ 检查点存在但覆盖路径不全面；  
  
✦ 攻击者通过ioctl、替代syscall或其他未受控代码路径绕过检查；  
  
✦ 漏洞仅在补丁应用后才可被利用（旧代码虽有问题但无法被触发）。  
#### 典型案例：CVE-2021-0920 — Linux GC BUG_ON检查绕过  
####   
  
2017年，Google的Andrey Ulanov提交了一个修复补丁，在unix_notinflight()函数中添加了BUG_ON()检查，原始补丁意图是通过状态校验防止飞行计数出现不一致状态。该漏洞最早于2016年由Red Hat内核开发者在公开邮件列表中披露，但当时Linux内核社区未接受补丁。  
  
攻击原理  
  
BUG_ON()检查看似可以阻止UAF利用，但攻击者发现可以通过制造大量虚假垃圾对象来延迟垃圾回收的时机，从而绕过检查：  
  
制造飞行对象  
：通过SCM_RIGHTS发送大量文件描述符，制造大量飞行中的文件对象  
  
堆喷射布局  
：通过堆喷射填充slab缓存，控制内存布局  
  
竞争条件触发  
：利用竞争条件在GC执行期间触发MSG_PEEK操作  
  
绕过检查  
：GC的BUG_ON检查因虚假垃圾对象的延迟而被绕过，攻击者获得sk_buff的UAF原语  
  
Google Project Zero博客将此漏洞命名为"The Quantum State of Linux Kernel Garbage Collection"，形象描述了GC状态的不确定性如何被攻击者利用。  
  
影响范围  
  
•  
   
Linux Kernel < 5.15（具体修复版本因发行版而异）  
  
•  
 Android设备：Samsung S10、S20等  
  
野外利用  
  
Google TAG确认从2020年11月起被surveillance vendor Wintego利用。  
  
修复方案  
  
2021年官方补丁在MSG_PEEK分支中请求unix_gc_lock自旋锁，强制MSG_PEEK等待GC完成后执行。  
### 形态二：降级（Degradation）  
###   
  
该形态的修复补丁在尝试降低攻击面或增加安全机制时，反而降低了攻击门槛或扩大了可利用的攻击窗口。修复逻辑本身成为竞争条件、状态不一致或引用计数错误的来源。  
  
关键特征：  
  
✦ 补丁意图增加安全性或降低攻击面；  
  
✦ 修复逻辑引入了新的竞争条件或状态不一致；  
  
✦ UAF修复引入新的引用计数逻辑，反而创造新的UAF窗口；  
  
✦ 旧漏洞可能仅在高复杂度下可利用，补丁后利用门槛显著降低。  
#### 典型案例：CVE-2022-3028 — XFRM Namespace补丁引入竞争条件  
####   
  
X  
FRM子系统及afkey模块在Commit 283bc9f35bbb中新增了网络命名空间支持，补丁意图让 IPSec/XFRM框架能在不同network namespace中独立工作。这是一个正常的功能增强补丁。  
  
攻击原理  
  
补丁衍生的漏洞利用：  
添加namespace支持的补丁无意中引入了竞争条件。  
  
•  
 单线程变多线程：  
在namespace支持之前，xfrm_probe_algs()是单线程调用的；添加namespace支持后，多个namespace可以同时调用xfrm_probe_algs()  
  
•并发执行冲突：  
在compose_sadb_supported()执行期间，如果多个xfrm_probe_algs()同时执行  
  
• 缓冲区分配错误：  
如果algorithm在竞速访问期间被添加，代码分配的buffer小于实际可用的algorithm数量  
  
• 内存破坏：  
导致out-of-bounds write或kernel heap memory leak  
  
关键降级特征：  
一个功能增强补丁（添加namespace支持）将原本安全的单线程代码路径变成了多线程竞争条件，这属于典型的攻击面扩大。  
  
影响范围  
  
•   
Linux Kernel<6.0  
  
• 受影响版本：4.19、5.4、5.10、5.15等系列  
  
修复方案  
  
Commit：在pfkey_register函数中为xfrm_probe_algs()调用添加mutex锁，消除并发竞争条件。  
### 形态三：激活（Activation）  
###   
  
该形态的修复补丁引入新标志位、新状态机或新机制，但与已有代码路径不兼容，导致原本无法触发的休眠缺陷（dormant bug）在新语义上下文中首次变为可利用。  
  
关键特征：  
  
✦ 补丁引入新标志位（flag）、新状态机或新语义；  
  
✦ 旧代码中存在休眠缺陷（已有但未触发或无法利用）；  
  
✦ 新标志/机制与旧代码路径不兼容；  
  
✦ 休眠缺陷在新语义上下文中首次可被利用。  
#### 典型案例：CVE-2023-31436—QFQ 2011年补丁激活越界写  
####   
  
2011年的补丁3015f3d2a3cd（"pkt_sched:enable QFQ to support TSO/GSO"）为 QFQ（Quick Fair Queueing）调度器添加了对 TSO（TCP Segmentation Offload）和 GSO（Generic Segmentation Offload）的支持。这个补丁修改了 qfq_change_class()函数，使其可以直接使用网卡的MTU作为lmax值。  
  
攻击原理  
  
补丁衍生的漏洞利用：  
12年前的功能增强补丁在特定配置下首次变为可利用。  
  
• 2011年补丁引入默认路径：  
允许在未提供TCA_QFQ_LMAX参数时直接使用MTU作为lmax  
  
• 超大MTU特性：  
loopback网卡的MTU可以被设置为2^31-1（这是已有但未受关注的系统特性）  
  
• 索引越界：  
超大MTU导致qfq_calc_index()计算出的索引i超出q->groups数组范围（大小仅为25）  
  
• 越界写触发：  
agg->grp= &q->groups[i]触发slab-out-of-bounds write  
  
关键激活特征：  
2011年的补丁在当时看起来完全安全（使用MTU作为默认值是合理的设计），但随着内核中loopback MTU可调至超大值这一特性被引入，旧的默认路径首次变为可利用。新特性（超大 MTU）与旧补丁代码不兼容，激活了休眠缺陷。  
  
影响范围  
  
•   
Linux Kernel 2.6.x+（2011 年补丁引入后）- 6.2.13（修复前）  
  
•   
需要CAP_NET_ADMIN（可通过user namespace获得）  
  
•   
需要CONFIG_NET_SCH_QFQ启用  
  
修复方案  
  
Commit：3037933448f60f9acb705997eae62013ecb81e0d  
  
修复补丁重构验证逻辑，确保无论lmax是显式提供还是从MTU派生，都进行统一的边界检查。  
### 三种形态对比总结  
###   
  
Fragnesia属于激活型（Activation），这是最隐蔽、最难预测  
的形态，因为它要求修复者具备对  
多年积累的  
代码设计假设的完整认知。Dirty Frag补丁引入的SKBFL_SHARED_FRAG标记与2013年skb_try_coalesce()的设计假设（“标志位无需传播”）不兼容，最终激活了潜伏13年的标记传播缺陷。  
## 4.2 “充分性幻觉”：修复覆盖度的认知偏差  
  
“  
充分性幻觉  
”  
是补丁衍生漏洞的心理学根源  
，就是修复这认为“我这样做已经足够了”  
。修复者在验证补丁时，往往聚焦于直接攻击路径的覆盖，而忽视间接状态迁移路径的完整性：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XBFaicYdOHkibgYClMqYW3oxibicQdeHJXonXMDbdK98OLibw84010FXKfn3icSg2icH1BNcXGd9MWMRTpPQ9HVN8LXrNib56vcNFWQupOZibFIDibic5c/640?wx_fmt=png&from=appmsg "")  
  
图  
3  
   
充分性幻觉：修复者的线性路径与攻击者的图遍历对比  
  
修复者的验证是线性思维（从入口到检查点），攻击者的利用是图遍历思维（所有可能的状态迁移路径）。两者的认知不对称导致了  
“  
充分性幻觉  
”  
——修复者相信  
“  
我已覆盖所有路径  
”  
，实际上仅覆盖了预期路径。这种思维层面的认知偏差，使得补丁测试仅聚焦主流业务流转链路，刻意忽略冷门合并、异步调度、跨模块联动等边缘执行路径，无法穷尽内核状态机全部迁移分支。最终造成新增的安全约束与状态标记仅在常规流程生效，在开发者未曾顾及的代码逻辑中出现规则失效、状态丢失等漏洞隐患。  
## 4.3 性能敏感路径的“修复免疫性”为何合并优化未被同步审计  
  
skb_try_coalesce()未被同步审计的原因在于性能敏感路径的“修复免疫性”：这种“修复免疫性”使得性能优化代码成为安全修复的盲区。Fragnesia的案例表明，越古老的优化代码，越可能成为新安全机制的兼容性陷阱。  
## 4.4 关键审计点：从“路径检查”到“状态机全局一致性验证”  
  
Fragnesia要求漏洞审计范式从  
“  
路径检查”升级为  
“  
状态机全局一致性验证”,具体审计点建议：标记传播闭包审计：对skb的所有操作函数（约50+个核心函数）逐一验证新标记的传播逻辑；跨子系统影响分析：标记引入不仅影响本修复子系统（xfrm），还影响所有消费skb的子系统（TCP、UDP、SCTP、netfilter、QoS等）；历史代码兼容性审计：对2013-2020年间引入的skb操作函数进行回溯，验证其是否假设  
“  
标志位无需传播”。  
  
  
**05**  
  
**小结**  
## 5.1 开源社区正面临的AI辅助漏洞挖掘和辅助攻击双项挑战  
##   
  
Linux建立了非常复杂精密的开源运营体系，包括分层维护者制度、邮件列表与协同开发平台、严格的代码签名与审查流程（如Reviewed-by 和 Signed-off-by）、自动化持续集成测试（如 Kernel CI）、定期版本发布管理（如合并窗口期与 rc 版本迭代）、安全漏洞响应团队（如 Linux Kernel Security Team）及 CVE 分配机制、社区行为准则与仲裁规则  
等，这些机制确保了Linux 成为人类智慧无私的杰作。但也需要看到，虽然拥有极为严格的审计机制，但这种自发社群和志愿者的运行机制，却难以有效跟进那些拥有规模型 AI 算力支撑的新型漏洞研究者的  
脆弱性  
发现成果。其核心  
问题  
是开源社区难以拥有足够的、统一的算力资源支撑——开发者和审核者所能掌握的算力资源是有限的，也是高度不平衡的。  
因此进一步应对  
着带有超强算力支撑的新型攻击行为体的挑战  
，会有更长的不适应周期。  
  
AI代理数小时内可完成传统人工审计数周的代码遍历与模式匹配，将漏洞发现窗口从“月级”压缩到“天级”；覆盖维度，AI不受注意力疲劳和认知偏差限制，能对跨子系统、跨版本代码进行一致性检查，发现人工难以触及的深层交互缺陷；持续性维度，AI可7×24小时不间断监控代码仓库变更，在补丁发布瞬间即启动副作用分析，这种"即时响应"能力是任何人工团队无法企及的。  
  
当然我们一贯反对无限放大AI的能力。当前AI在理解复杂业务逻辑、推断深层设计意图方面仍有局限，Fragnesia的发现虽借助了AI完成代码路径遍历，但依然是基于研究者的分析原语的转化与指引的。  
AI是放大器而非替代者——它放大了安全研究者的分析半径，但核心洞察和工程判断仍需人类主导。未来三到五年，“AI初筛-专家精修-自动化验证”将成为标准工作流。开源体系也需要获得开放的算力支持。  
## 5.2 以AI辅助的状态机验证应对AI辅助的漏洞挖掘  
  
Fragnesia的根源可精确归因为状态机不一致：Dirty Frag补丁为skb引入了SKBFL_SHARED_FRAG新状态，却未同步更新skb_try_coalesce()这一状态迁移函数，导致“标记应传播”的新规则与“标志位不复制”的旧实现发生冲突。这是一类典型的状态机验证缺失问题——补丁改变了系统的状态空间定义，却未验证所有迁移路径是否与新定义保持一致。  
  
Linux内核本质上是一个超大规模的状态机网络。以skb为核心载体，其状态变量（flags、tx_flags、frag列表等）在数十个核心函数间流转，每个函数都是一条状态迁移规则。安全补丁频繁引入新的状态变量或约束条件，如SKBFL_SHARED_FRAG标记、新的引用计数语义、额外的权限校验位等。每一次引入，理论上都需要验证：该变量在所有可能的迁移路径中是否被正确传播、不被意外清除、不被错误覆盖。人工完成这种全局一致性验证几乎不可能——skb涉及的核心操作函数超过50个，跨TCP、UDP、xfrm、netfilter等十余个子系统，状态迁移路径呈指数级增长。  
  
AI辅助状态机验证正是针对这一难题的系统性解法。其核心思路是将内核数据结构的变更建模为状态机补丁，利用AI自动化完成三项关键验证。其一，传播闭包验证：当新标记被引入时，AI自动遍历所有消费或修改该数据结构的函数，识别哪些函数显式处理了新标记、哪些遗漏了处理逻辑。Dirty Frag补丁若经此验证，skb_try_coalesce()中缺失的SKBFL_SHARED_FRAG传播代码将被自动标记。其二，跨子系统一致性验证：AI构建子系统间的数据流图谱，追踪新标记从引入点到所有消费点的完整路径。SKBFL_SHARED_FRAG由xfrm子系统定义，却在TCP接收路径的合并操作中被静默清除——这种跨子系统的语义断裂，恰是AI图谱分析的天然优势领域。其三，历史假设冲突检测：AI通过代码模式学习，识别历史函数中与新语义不兼容的隐含假设。skb_try_coalesce()“仅复制分片数据、不传播标志位”的13年设计惯性，与SKBFL_SHARED_FRAG“必须跨skb传播”的新安全需求之间的冲突，可以被AI提前捕获。  
  
AI具有极为明显的可武器化特点。AI驱动的漏洞挖掘工具能够在补丁发布后数小时内逆向分析其边界假设，快速定位未覆盖的迁移路径——Fragnesia从Dirty Frag补丁合入到被披露仅5至6天，正是这一趋势的。防御侧必须以对等的AI能力回应：不是用人工审计对抗AI扫描，而是以AI状态机构建对抗AI漏洞挖掘。具体而言，需要在补丁发布流程中嵌入“AI状态机一致性关卡”——补丁合入前必须通过AI验证，确认新增状态变量在所有迁移路径中的传播闭包完整性；发布后启动AI持续监控，追踪异常状态迁移模式。  
  
这一范式的产业化已在萌芽。DARPA AI Cyber Challenge验证了AI在自动化代码分析中的实战价值，下一步的关键是将这种能力从“攻击发现”转向“防御验证”。未来三到五年，“AI状态机预检-专家确认-持续监控”有望成为内核安全补丁的标准发布流程，期待下一次，AI状态机验证能够发布前拦截“new Fragnesia  
”  
。  
## 5.3 修复不是终点，而是新风险的起点  
  
传统漏洞响应模型将“修复发布”视为事件终结——补丁合入主线、发行版推送完毕，安全警报解除，社区转向下一个问题。然而，Fragnesia揭示了一个被长期忽视的真相：修复发布不是风险周期的终点，而是新一轮风险周期的起点。  
  
从攻击者视角看，修复补丁的公开发布实质上是一份“逆向工程指南”。Dirty Frag的修复补丁在5月8日合入主线后，其代码变更、SKBFL_SHARED_FRAG标记机制及ESP路径检查逻辑全部公开。对具备内核分析能力的攻击者而言，这份补丁本身就是“攻击地图”——它指明了哪些路径被覆盖，也暗示哪些路径可能未被关注。William Bowling在补丁发布后约5至6天即发现Fragnesia，正是通过聚焦分析修复补丁、逆向推导其边界假设。历史反复验证这一模式：攻击者通过分析补丁中的边界检查，快速定位未被覆盖的替代路径。“从修复到利用”的转化周期正被大幅压缩。  
  
从系统演化角度看，修复补丁改变了内核状态机的拓扑结构，而这种改变具有不可完全预测性。Dirty Frag补丁引入SKBFL_SHARED_FRAG标记，本意增加安全维度，却在与skb_try_coalesce()的合并路径交互时产生语义断裂。这种“新状态变量与旧代码不兼容”的问题，在大型系统中几乎无法通过静态审查完全避免。更关键的是风险不对称性——防御者需在全状态空间中验证正确性，攻击者只需找到一条未覆盖路径即可。Fragnesia中，设计者验证了ESP路径，却遗漏了一个自2013年即存在的高频合并函数。  
  
从用户侧看，“修复即安全”的认知偏差可能导致防御松懈。许多组织补丁发布后仅执行基础回归测试，缺乏“副作用”专项验证；部分团队甚至长期推迟更新。Fragnesia表明，这种延迟可能使系统同时暴露于旧漏洞和新漏洞的双重威胁之下——若系统在Dirty Frag修复后、Fragnesia修复前处于中间状态，攻击者恰好可利用这一补丁衍生漏洞完成提权。补丁管理的敏捷性本身已成为安全性的关键变量。  
  
从产业生态看，Fragnesia暴露了开源供应链“修复-分发”链条的薄弱环节。内核补丁从合入主线到各发行版采纳存在数天至数周延迟，期间代码已公开而防护未部署，形成“代码可见但防护缺失”的脆弱窗口。对企业用户而言，建立补丁预研机制——在官方发布后、正式部署前进行副作用审计和压力测试——将成为安全运营的标准动作。对内核社区而言，探索“分级发布”机制，让关键修复先向信任方开放验证再完全公开，值得认真考虑。  
  
AI时代为补丁风险治理提供了新可能。AI辅助状态机验证可在发布前发现“标记在合并路径中丢失”这类问题；但AI驱动的漏洞挖掘也在降低攻击者发现副作用的门槛。这种“AI攻、AI防”的博弈，要求补丁流程从“人工设计-人工审核-人工发布”转向“AI辅助设计-AI全局验证-分级发布-持续监控”的闭环。  
  
Fragnesia的终极启示是：安全没有终点，只有持续演化的风险周期。每一个修复补丁都是对系统状态空间的重新塑造，而这种重塑必然带来新的未知。接受这一点，是对复杂系统本质的清醒认知。  
## 5.4 补丁仍是必备的、基础安全机制  
  
Fragnesia事件易引发一种误判——既然补丁可能催生新漏洞，全面放弃打补丁是否更稳妥？这一设问看似合理，实则是对复杂信息系统安全本质的误读。系统的补丁修复依然是且未来始终将是复杂系统最基础、必备的安全能力。  
本事件恰恰说明：出品侧的补丁能力需在AI时代与时俱进，用户侧需要的是更完备的补丁策略。   
  
补丁出现衍生漏洞与不修复已知漏洞之间，本质是概率权衡。未修复漏洞处于确定性暴露状态——攻击者拥有完整分析窗口、公开PoC和可预期路径，被利用概率随时间递增。Dirty Frag修复前，任何掌握细节者均可稳定复现攻击。而补丁衍生漏洞需多重条件耦合：新机制与历史代码路径语义冲突、该路径实际运行中被激活、攻击者率先发现隐蔽交互。Fragnesia从补丁合入到披露仅5至6天，恰恰说明其具有低概率、短窗口特征。两害相权，前者仍是显著更优选择。敌视补丁只会让系统长期暴露于已知漏洞之下——这恰是攻击者最乐见的局面。  
  
复杂信息产品具有不完备性的必然性。以Linux为例，内核已超三千万行代码，涉及数千开发者、数百子系统。“一次编写、永无缺陷”是不可能的理想态——非工程能力不足，而是复杂系统内在属性所决定。形式化验证、静态分析、动态测试各有边界，均无法穷尽状态组合。补丁非对"完美设计"的补救，而是承认不完备性、以持续迭代逼近更高安全水平的理性实践。  
  
实践证明，补丁是应对安全和功能缺陷的最根本机制。从Heartbleed到EternalBlue，从Spectre/Meltdown到Linux内核提权漏洞，几乎所有重大安全事件的最终闭环均依赖补丁。IDS规则、终端防护、微隔离与零信任等缓解手段，定位是风险缓解与攻击链打断，非根因消除；其核心价值在于为补丁修复赢得时间，将其长期化是认知错位。  
  
AI时代，补丁能力建设需主动升级。AI辅助代码分析有望将副作用审计推向自动化全局一致性检验；同时AI驱动的漏洞挖掘也在加速，攻击者发现新缺陷的周期正缩短。在此态势下，动态热补丁的需求也会增加——它能够在不停机状态下完成关键漏洞的即时修复，既压缩了攻击窗口，又为传统补丁的全面验证和正式发布争取了宝贵时间。出品方须构建“动态热补丁应急 + 常规补丁根治”的双轨体系，以更敏捷、智能的研发与发布机制应对安全威胁，以AI对抗AI。用户侧则应建立基于风险分级的补丁管理策略：关键补丁验证后尽快部署，同时建立监控与回滚机制。  
  
Fragnesia的教训绝非“补丁太危险，千万不要打”，而是“补丁者需要更睿智，更需要AI助力”。补丁衍生漏洞应推动社区在补丁全流程中引入更严格的语义一致性检查，而非动摇对补丁机制本身的信心。  
  
总之：在复杂系统的安全性与完备性之间，补丁修复依然是一座不可或缺的桥梁。  
  
  
**附录**  
## 附录A：skb_try_coalesce() 标记传播缺陷的代码片段与修复方案  
##   
### A.1 缺陷代码分析  
###   
  
skb_try_coalesce()函数位于net/core/skbuff.c，其标记传播缺陷的核心在于合并分片时未同步合并源skb的SKBFL_SHARED_FRAG标记。以下是Fragnesia补丁（William Bowling提交，Message-ID:20260513041635.1289541-1-vakzz@zellic.io）中描述的问题模式。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/XBFaicYdOHkibknFpNVCvAWOAvxFeoicvibHiaRLVYPMysInmBxVjHnGMibHdw5z1HTqia0Xze1VnDNEFfhpKRG832bNVUA3gIbF3GFKcbCUnORNF8/640?wx_fmt=png&from=appmsg "")  
### A.2 触发条件  
###   
  
标记丢失的触发需要满足以下条件链；标记设置阶段：攻击者通过splice()+MSG_SPLICE_PAGES将缓存页注入skb分片区，TCP栈在skb_splice_from_iter()后为skb设置SKBFL_SHARED_FRAG标记合并触发阶段：携带SKBFL_SHARED_FRAG标记的skb在TCP接收路径中经历skb_try_coalesce()合并，标记丢失；检查绕过阶段：合并后的skb进入ESP-in-TCP解密路径，skb_has_shared_frag()返回false，跳过skb_cow_data()调用。写入执行阶段：AES-GCM原地解密在共享缓存页上执行密钥流异或，精确覆盖目标文件内容####A.3 Fragnesia 上游修复补丁：William Bowling提交的Fragnesia修复补丁核心diff。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/XBFaicYdOHk9DrkxTkNg5DG4rtvSLvvh5n0BdC3XjV8tKnxtBzf5iac1cQfSiaVuqgHKWR0cTjtuAMwVjHiaPLZHuPNqwmKWy8z04KaCawEfnrE/640?wx_fmt=png&from=appmsg "")  
  
- Fixes: cef401de7be8(修复补丁在两个地方添加了Fixes标签“net: fix possible wrong checksum generation”)——追溯到2013年skb_try_coalesce()引入时即存在的标记传播缺陷- Fixes: f4c50a4034e6(“xfrm: esp: avoid in-place decrypt on shared skb frags”) —— Dirty Frag修复补丁   
## 附录B：Fragnesia 触发路径简化示意图  
##   
  
注：以下示意图已在正文各章节中以文字描述形式详细阐述。本附录提供完整的数据流与控制流概览。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XBFaicYdOHk9O0RDNthy8kWNHwCOicfWszicqNZXUicsrSfG1iajcVtSRw0ClnRkib5vOIdyiaP2z9rksLULoPGR4icoKTKAZygNiaEGbnSlzbcibibRdg/640?wx_fmt=png&from=appmsg "")  
## 附录C：参考资料清单  
##   
  
本附录所列参考资料按正文引用顺序编号，格式遵循GB/T 7714-2015《信息与文献 参考文献著录规则》。  
  
[1] KIM H. Dirty Frag: Linux kernel LPE via xfrm-ESP and rxrpc page-cache write[EB/OL]. (2026-05-07)[2026-05-15]. https://github.com/V4bel/dirtyfrag.  
  
[2] KELLERMANN M. Dirty Pipe - CVE-2022-0847 [EB/OL]. (2022-03-07)[2026-05-15]. https://dirtypipe.cm4all.com/.  
  
[3] SUSE. Solution Security Risk Report 2022: Dirty Pipe (CVE-2022-0847) [R]. SUSE, 2022. https://documentation.suse.com/sbp/security/pdf/SBP-SUSE-security-report-2022_en.pdf.  
  
[4] HG TECH. Why Linux Keeps Getting Rooted by the Same Bug Class: The Page Cache Curse [EB/OL]. (2026-05-10)[2026-05-15]. https://thehgtech.com/articles/dirty-frag-page-cache-curse-2026.html.  
  
[5] LINUX KERNEL SOURCE TREE. commit f4c50a4034e6 - xfrm: esp: avoid in-place decrypt on shared skb frags[EB/OL]. (2026-05-07)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f4c50a4034e6.  
  
[6] RECONIX. Dirty Frag: How a Linux Kernel Embargo Failed in Public View[EB/OL]. (2026-05-08)[2026-05-15]. https://reconix.co/th/blog/dirty-frag-linux-zero-day-lpe/.  
  
[7] Linux Kernel Organization. splice(2) - Linux manual page [EB/OL]. (2025-09-20)[2026-05-15]. https://man7.org/linux/man-pages/man2/splice.2.html.  
  
[8] LINUX KERNEL DOCUMENTATION. XFRM (IPsec transform) subsystem documentation [EB/OL]. (2026)[2026-05-15]. https://docs.kernel.org/networking/xfrm.html.  
  
[9] RECONIX. Dirty Frag: How a Linux Kernel Embargo Failed in Public View [EB/OL]. (2026-05-08)[2026-05-15]. https://reconix.co/th/blog/dirty-frag-linux-zero-day-lpe/.  
  
[10] CYBERSCOOP. ‘Copy Fail’ is a real Linux security crisis wrapped in AI slop [EB/OL]. (2026-05-04)[2026-05-15]. https://cyberscoop.com/copy-fail-linux-vulnerability-artificial-intelligence/.  
  
[11] ANTIY LABS. Thinking of “Attack Primitive” Based on Dirty Frag Vulnerability Discovery Process [EB/OL]. (2026-05-09)[2026-05-15]. https://www.antiy.net/p/thinking-of-attack-primitive-based-on-dirty-frag-vulnerability-discovery-process-re-discussion-on-human-machine-division-of-vulnerability-discovery-and-analysis/.  
  
[12] Palo Alto Networks Unit 42. Copy Fail: What You Need to Know About the Most Severe Linux Threat in Years [EB/OL]. (2026-05-05)[2026-05-15]. https://unit42.paloaltonetworks.com/cve-2026-31431-copy-fail/.  
  
[13] LINUX KERNEL SOURCE TREE. commit a664bf3d603d - Revert “crypto: algif_aead - fix AEAD decryption for assoclen” [EB/OL]. (2026-04-01)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=a664bf3d603d.  
  
[14] BOWLING W. [PATCH net] net: skbuff: preserve shared-frag marker during coalescing [EB/OL]. netdev mailing list, (2026-05-13)[2026-05-15]. https://lists.openwall.net/netdev/2026/05/13/79.  
  
[15] National Vulnerability Database. CVE-2024-50264 [EB/OL]. (2024-11-19)[2026-05-15]. https://nvd.nist.gov/vuln/detail/CVE-2024-50264.  
  
[16] Linux Kernel Organization. vmsplice(2) - Linux manual page [EB/OL]. (2025-09-21)[2026-05-15]. https://man7.org/linux/man-pages/man2/vmsplice.2.html.  
  
[17] BOWLING W. Fragnesia: Linux kernel LPE via XFRM ESP-in-TCP[EB/OL]. (2026-05-13)[2026-05-15]. https://github.com/v12-security/pocs/tree/main/fragnesia.  
  
[18] LINUX KERNEL DOCUMENTATION. sk_buff data structure and network packet processing [EB/OL]. (2026)[2026-05-15]. https://docs.kernel.org/networking/skbuff.html.  
  
[19] LINUX KERNEL SOURCE TREE. net/core/skbuff.c - skb_try_coalesce() implementation [EB/OL]. (2026-05-13)[2026-05-15].  
  
https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/net/core/skbuff.c.  
  
[20] LINUX KERNEL SOURCE TREE. include/linux/skbuff.h - SKBFL_SHARED_FRAG flag definition[EB/OL]. (2026-05-07)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/include/linux/skbuff.h.  
  
[21] LINUX KERNEL SOURCE TREE. include/linux/skbuff.h - SKBFL_SHARED_FRAG flag definition[EB/OL]. (2026-05-07)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/include/linux/skbuff.h.  
  
[22] BOWLING W. [PATCH net] net: skbuff: preserve shared-frag marker during coalescing[EB/OL]. (2026-05-13)[2026-05-15]. https://lore.kernel.org/netdev/20260513041635.1289541-1-vakzz@zellic.io/.  
  
[23] BOWLING W. [PATCH net] net: skbuff: preserve shared-frag marker during coalescing[EB/OL]. (2026-05-13)[2026-05-15]. https://lore.kernel.org/netdev/20260513041635.1289541-1-vakzz@zellic.io/.  
  
[24] BOWLING W. [PATCH net] net: skbuff: preserve shared-frag marker during coalescing[EB/OL]. (2026-05-13)[2026-05-15]. https://lore.kernel.org/netdev/20260513041635.1289541-1-vakzz@zellic.io/.  
  
[25] LINUX KERNEL SOURCE TREE. commit f4c50a4034e6 - xfrm: esp: avoid in-place decrypt on shared skb frags[EB/OL]. (2026-05-07)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=f4c50a4034e6.  
  
[26] LINUX KERNEL SOURCE TREE. net/ipv4/tcp_ulp.c - TCP ULP (Upper Layer Protocol) framework[EB/OL]. (2026)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/net/ipv4/tcp_ulp.c.  
  
[27] LINUX KERNEL DOCUMENTATION. ESP-in-TCP (espintcp) - IPsec ESP over TCP connections[EB/OL]. (2026)[2026-05-15]. https://docs.kernel.org/networking/epsintcp.html.  
  
[28] LINUX KERNEL SOURCE TREE. commit cef401de7be8 - net: fix possible wrong checksum generation [EB/OL]. (2013-10-28)[2026-05-15]. https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=cef401de7be8.  
  
[29] Google Project Zero. 0-day in the Wild: CVE-2021-0920[EB/OL]. (2021-11)[2026-05-15]. https://googleprojectzero.github.io/0days-in-the-wild/0day-RCAs/2021/CVE-2021-0920.html.  
  
[30] CVE-2021-0920漏洞分析（中文）[EB/OL]. (2023-05-10)[2026-05-15]. https://bsauce.github.io/2023/05/10/CVE-2021-0920/.  
  
[31] KIM H. Dirty Frag: Linux kernel LPE via xfrm-ESP and rxrpc page-cache write [EB/OL]. (2026-05-07)[2026-05-15]. https://github.com/V4bel/dirtyfrag.  
  
[32] KIM H. oss-security - Dirty Frag disclosure [EB/OL]. (2026-05-07)[2026-05-15]. https://www.openwall.com/lists/oss-security/2026/05/07/8.  
  
[33] CVE-2022-29582详细分析[EB/OL]. (2022-08-05)[2026-05-15]. https://ruia-ruia.github.io/2022/08/05/CVE-2022-29582-io-uring/.  
  
[34] Wiz Vulnerability Database. CVE-2022-29582[EB/OL]. (2022-04)[2026-05-15]. https://www.wiz.io/vulnerability-database/cve/cve-2022-29582.  
  
[35] Wiz Vulnerability Database. CVE-2022-3028[EB/OL]. (2022-09)[2026-05-15]. https://www.wiz.io/vulnerability-database/cve/cve-2022-3028.  
  
[36] openEuler. CVE-2022-3028追踪[EB/OL]. (2022)[2026-05-15]. https://gitee.com/src-openeuler/kernel/issues/I5OPA4.  
  
[37] CVE-2022-2602漏洞分析（中文）[EB/OL]. (2023-06-08)[2026-05-15]. https://bsauce.github.io/2023/06/08/CVE-2022-2602/.  
  
[38] CVE-2022-2602内核提权详细分析[EB/OL]. (2022-10)[2026-05-15]. https://idocdown.com/app/articles/blogs/detail/15354.  
  
[39] oss-security. CVE-2022-4378 disclosure[EB/OL]. (2022-Q4)[2026-05-15]. https://seclists.org/oss-sec/2022/q4/178.  
  
[40] ZENG K. CVE-2022-4378原始报告[EB/OL]. (2022-12-09)[2026-05-15]. https://www.openwall.com/lists/oss-security/2022/12/09/1.  
  
[41] Google Security Research. CVE-2023-31436 PoC and vulnerability documentation[EB/OL]. (2023-05)[2026-05-15]. https://github.com/google/security-research/blob/master/pocs/linux/kernelctf/CVE-2023-31436_mitigation/docs/vulnerability.md.  
  
[42] CVE-2023-31436漏洞分析（中文）[EB/OL]. (2023-05)[2026-05-15]. https://idocdown.com/app/articles/blogs/detail/8187.  
  
[43] THE REGISTER. Dirty Frag gets a sequel as Fragnesia hands Linux attackers root-level access [EB/OL]. (2026-05-14)[2026-05-15]. https://www.theregister.com/security/2026/05/14/dirty-frag-gets-a-sequel-as-fragnesia-hands-linux-attackers-root-level-access/5240270.  
  
[44] THEORI. Copy Fail: 732 Bytes to Root on Every Major Linux Distribution [EB/OL]. (2026-04-29)[2026-05-15]. https://xint.io/blog/copy-fail-linux-distributions.  
  
[45] National Vulnerability Database. CVE-2026-31431 [EB/OL]. (2026-04-22)[2026-05-15]. https://nvd.nist.gov/vuln/detail/CVE-2026-31431.  
  
[46] AI JOURNAL. Theori Wins $1.5 Million Prize at DARPA’s AI Cyber Challenge [EB/OL]. (2025-08-11)[2026-05-15]. https://aijourn.com/theori-wins-1-5-million-prize-at-darpas-ai-cyber-challenge/.  
  
[47] Linux Kernel Organization. splice(2) - Linux manual page[EB/OL]. (2025-09-20)[2026-05-15]. https://man7.org/linux/man-pages/man2/splice.2.html.  
  
  
**往期推荐:**  
  
  
  
  
  
[基于Dirty Frag漏洞发现过程的“攻击原语”思考](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214707&idx=1&sn=918c767dcbb97cfb7a1d3f3bd7ecf6f2&scene=21#wechat_redirect)  
  
[——](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214707&idx=1&sn=918c767dcbb97cfb7a1d3f3bd7ecf6f2&scene=21#wechat_redirect)  
  
[再论漏洞发现与分析工作的人机分工](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214707&idx=1&sn=918c767dcbb97cfb7a1d3f3bd7ecf6f2&scene=21#wechat_redirect)  
  
  
  
[人与AI协同的漏洞分析新范式——Copy Fail发现过程解析](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214696&idx=1&sn=191837d70f13dd2c2aa6f163edd80444&scene=21#wechat_redirect)  
  
  
  
[CVE-2026-31431（Copy Fail）漏洞FAQ（上）——漏洞的基本情况、影响范围与处置篇](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214685&idx=1&sn=5c1d5e3dc08490e7bd919dba10cc01bd&scene=21#wechat_redirect)  
  
  
  
[CVE-2026-31431（Copy Fail）漏洞FAQ（下）——漏洞技术机理、历史坐标与战略启示篇](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650214688&idx=1&sn=de694ee3d652992e2023cd7ac07fbe8f&scene=21#wechat_redirect)  
  
  
