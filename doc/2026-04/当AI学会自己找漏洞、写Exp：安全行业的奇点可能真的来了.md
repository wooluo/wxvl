#  当AI学会自己找漏洞、写Exp：安全行业的"奇点"可能真的来了  
 黑白之道   2026-04-21 01:25  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
> Anthropic 刚放了个大招——Claude Mythos Preview 能自主发现零日漏洞、自动写出完整利用链。这不是演习，这是安全行业的历史性时刻。  
  
【本文为4月7日，在看到Anthropic的文章后，让AI总结后人工review的，后文有“给安全从业者的生存指南”感觉有点靠谱，可以借鉴】  
  
## 一句话概括今天发生了什么  
  
2026年4月7日，Anthropic 发布了 Claude Mythos Preview 的安全能力评估报告。结论很简单粗暴：这个模型能自己在主流操作系统和浏览器里找到从未被发现的漏洞（零日漏洞），然后——这是重点——**全自动写出能用的攻击利用代码（exploit）。**  
  
不是帮你找找bug那么客气。是找到之后，顺手就把"怎么利用这个bug拿下系统"的完整剧本给你写好了。  
  
而且它干这些事的时候，**不需要任何人类指导**  
。  
## 先别慌，我们来看看它到底干了什么  
### 案例1：一个活了27年的OpenBSD漏洞  
  
OpenBSD 是什么？安全圈的"优等生"，以"默认安全"著称的操作系统。  
  
Mythos Preview 在 OpenBSD 里找到一个 **27年的老bug**  
——存在于 TCP SACK（选择性确认）的实现中。  
  
**用大白话说怎么回事：**  
  
想象你在寄快递。正常流程是你发了一堆包裹，收件人告诉你"1到10号收到了，但3号没收到"。于是你补发3号。  
  
TCP SACK 就是让收件人能更聪明地说："1-2号收到了，4-10号也收到了，就缺3号。"这样你只需要补发一个。  
  
但 OpenBSD 在处理这种"选择性确认"时有个微妙的逻辑漏洞：  
1. 1. 它用一个**链表**  
来追踪哪些数据还没被确认（叫"hole"，空洞）  
  
1. 2. 代码检查了确认范围的**结束位置**  
是否在窗口内，但**没有检查起始位置**  
  
1. 3. 单独看这问题不大——确认"负数到10号"和确认"1到10号"效果一样  
  
1. 4. 但如果某个 SACK 块**同时触发删除最后一个空洞**  
又**触发追加新空洞**  
呢？追加操作会往一个已经变成 NULL 的指针写东西 → **内核崩溃**  
  
**最骚的是怎么触发这个"不可能的条件"：**  
  
TCP序列号是32位的，会回绕。OpenBSD 用 (int)(a - b) < 0  
 来比较大小——正常情况下没问题。但因为前面那个"不检查起始位置"的bug，攻击者可以把 SACK 块的起点放在距离真实窗口约 2^31 的地方。这时候整数溢出了符号位，内核居然同时认为"起点在空洞下面"和"起点在已确认字节上面"。  
  
→ 不可能条件被满足了 → 空洞被删了 → 往 NULL 指针写数据 → **机器崩了**  
  
**这个bug从1998年藏到了2025年。27年。无数安全专家看过这段代码。没人发现。**  
### 案例2：FFmpeg里藏了16年的H.264解码器漏洞  
  
FFmpeg 是什么？全球视频处理的基础设施。几乎所有处理视频的服务都在用它。它是世界上被测试得最彻底的软件项目之一——光 fuzzing（模糊测试）相关的学术论文就能堆一摞。  
  
Mythos Preview 找到的这个 bug 在 H.264 解码器里，**从2003年引入代码那天起就存在**  
：  
  
**故事是这样的：**  
  
H.264 把每一帧分成多个切片（slice），每个切片包含若干宏块（16×16像素的区域）。去块滤波器在处理宏块时，有时候需要看看相邻像素——但前提是相邻宏块属于同一个切片。  
  
为了回答"我左边的邻居和我同属一个切片吗？"，FFmpeg 维护了一张表，记录每个宏块位置属于哪个切片号。  
  
**问题来了：**  
 表里的条目是 **16位整数**  
（最大65535），但切片计数器本身是个 **32位 int**  
，没有上限。  
  
正常视频每帧就几个切片，计数器永远到不了65535。但这张表初始化用的是 C 语言经典套路 memset(..., -1, ...)  
 ——把每个字节都填成 0xFF。  
  
16位无整数下，0xFF = **65535**  
。本意是用它当哨兵值表示"还没有切片认领这个位置"。  
  
**但如果攻击者构造一帧包含恰好 65536 个切片的视频呢？**  
  
切片号 65535 和哨兵值 **精确碰撞**  
 了。当这个切片里的宏块问"我左边那个位置跟我同一切片吗？"——对比自己的切片号（65535）和邻居条目（65535）→ 匹配！→ 认为不存在的邻居是真的 → **越界写入 → 崩溃**  
  
**这个 bug 从2003年就在那儿了。2010年重构代码时还被放大成了真正可利用的漏洞。所有fuzzer、所有人工审计，全部错过。**  
### 案例3：FreeBSD NFS服务——从互联网直接拿Root  
  
这个案例堪称**教科书级的全自动渗透**  
：  
  
**场景：**  
 FreeBSD 的 NFS 服务（运行在内核态）监听远程过程调用（RPC）  
  
**漏洞本质：**  
 实现认证协议的一段代码，直接把攻击者可控的数据拷贝到一个 **128字节的栈缓冲区**  
里，但从第32个字节开始写（前面是固定的RPC头），只剩96字节空间。唯一的长度检查只要求小于 MAX_AUTH_BYTES（400字节）。  
  
**所以攻击者可以往栈上写304字节的任意内容。**  
 够搞一套标准的 ROP（返回导向编程）攻击了。  
  
**更离谱的是——这条代码路径上几乎没有任何防护：**  
- • FreeBSD 内核编译用的是 -fstack-protector  
 而非 -fstack-protector-strong  
  
- • 溢出的缓冲区声明的是 int32_t[32]  
 不是 char[]  
，编译器根本没加栈金丝雀  
  
- • 内核地址没随机化（没开 KASLR），ROP gadget 的位置可以直接猜  
  
**唯一障碍：怎么触达这个脆弱的 memcpy？**  
  
请求需要携带一个16字节的handle匹配服务端的GSS客户端表项。攻击者可以自己创建这个表项——但需要知道内核的 hostid  
 和启动时间。  
  
暴力猜？2^32 次可能性。  
  
**Mythos Preview 说：不用猜。**  
 如果服务器同时实现了 NFSv4，一次未认证的 EXCHANGE_ID 调用就会返回主机的完整 UUID（从中可推导 hostid）和 nfsd 启动时间。  
  
搞定。触发漏洞 → ROP链 → 把攻击者的公钥写到 /root/.ssh/authorized_keys  
 → **拿到 Root**  
。  
  
**整个过程中没有任何人类介入。**  
 从"去找bug"到交出完整的root权限利用代码，全是 AI 自己完成的。  
### 案例4（高能预警）：Linux内核单比特翻转为Root  
  
这个 exploit 的精妙程度，**让很多资深安全研究员直呼内行**  
。  
  
**起点：**  
 一个看起来人畜无害的"越界读1比特"漏洞，在 netfilter 的 ipset 功能中。  
  
**ipset 是什么？**  
 防火墙的批量管理工具——你可以命名一组IP地址，然后用一条规则匹配"这组里的所有IP"，而不用写几千条单独规则。  
  
**漏洞简化版：**  
 位图分配的大小是对的，但 ADD/DEL  
 操作可以被欺骗计算出越界索引。关键技巧是用 CIDR 掩码（比如 /17  
）把地址向下取整到网络边界。精心选择 first_ip  
 和 CIDR 宽度后，攻击者可以让每次调用**只翻转一个特定的比特**  
。  
  
**一个比特。就一个比特。**  
  
**但 Mythos Preview 发现了这个比特可以翻到哪里：**  
  
Linux 内核的 SLUB 分配器中，kmalloc-192 的对象有21种可能的偏移量（0, 192, 384, ... 3840），都是8的倍数。而页表页面就是一个512个8字节页表项（PTE）的数组。  
  
**如果物理上相邻的页面恰好是一个页表页面呢？**  
 越界写的那个比特，总是落在某个 PTE 的第0个字节上。PTE 低字节的 bit 1 正好是 _PAGE_RW  
 标志——决定这个映射是否**可写**  
！  
  
**接下来的操作堪称艺术：**  
1. 1. **布局堆风水：**  
 绑定到 CPU 0 → fork 子进程 touch 几千个分散的新页面（强制分配新页表页面）→ 子进程退出释放 → 刷新 CPU 0 的 freelist → 让 buddy 分配器合并出物理连续的页面  
  
1. 2. **交错喷射：**  
 256次循环，交替执行 mmap（创建新的 PTE 页面）和 ipset 创建（分配192字节位图）  
  
1. 3. **用bug本身做探针：**  
 对每个候选 set 发 DEL  
 + NLM_F_EXCL  
 标志。如果越界翻转的 bit 原本是1，清除后继续；如果是0，立即报错停止。这就把一次可能遍历32768次的无差别循环变成了**外科手术式的精准探测**  
，通常1-2次就定位到目标  
  
1. 4. **替换目标：**  
 清除受损 PTE → 用 MAP_FIXED | MAP_SHARED | MAP_POPULATE  
 把 /usr/bin/passwd  
（一个 setuid-root 程序）的第一页 mmap 到同一个虚拟地址  
  
1. 5. **最后一击：**  
 再触发一次 bug（这次用 ADD），翻转 PTE 的可写位 → 现在**用户态有一个到 passwd 文件内核缓存的 writable mapping**  
 → memcpy 一个 168 字节的 ELF stub（setuid(0); execve("/bin/sh")  
) → 因为是 MAP_SHARED，写操作直达 page cache → **全系统看到修改后的 passwd**  
 → 执行 passwd → **Root shell**  
  
**成本：不到1000美元API费用，耗时半天。**  
  
**从"一个比特的越界写"到"完全控制操作系统"。这就是 AI 级别的漏洞利用能力。**  
## 还有一些让人睡不着觉的数据  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">能力维度</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Opus 4.6 (上一代)</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Mythos Preview (新一代)</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">Firefox JS引擎漏洞→shell exploit成功率</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">~几百次尝试成功2次</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><strong style="color: #333333;font-weight: bold;font-size: inherit;"><span leaf="">181次成功+29次获得寄存器控制</span></strong></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">OSS-Fuzz基准测试 Tier 5(完整控制流劫持)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">0次</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><strong style="color: #333333;font-weight: bold;font-size: inherit;"><span leaf="">10次</span></strong></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">自主发现并利用FreeBSD NFS RCE</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">需要大量人工引导</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><strong style="color: #333333;font-weight: bold;font-size: inherit;"><span leaf="">全程无人干预</span></strong></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">Linux内核多漏洞链接利用</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">基本不行</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><strong style="color: #333333;font-weight: bold;font-size: inherit;"><span leaf="">近十例成功案例</span></strong></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">浏览器JIT堆喷+沙箱逃逸</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><section><span leaf="">无法完成</span></section></td><td align="left" style="border: 1px solid #dfdfdf;color: #3f3f3f;word-break: keep-all;padding: 0.5em 1em;text-align: left;"><strong style="color: #333333;font-weight: bold;font-size: inherit;"><span leaf="">多家浏览器全部突破</span></strong></td></tr></tbody></table>  
  
**注意：Anthropic 明确说了，他们没有专门训练模型做这些能力。这些能力是代码理解、推理和自主性提升后的"涌现"结果。**  
 同样的改进让它更擅长修补漏洞，也更擅长利用漏洞。  
## 这对安全行业意味着什么？  
### 🔴 短期：攻击者的蜜月期  
  
Anthropic 自己也承认了：**短期内，攻击方可能更有优势。**  
 前沿实验室如果不谨慎地发布这类模型，攻击者会是第一批吃螃蟹的人。  
  
原因很简单：  
- • N-day（已知未修补漏洞）到 weaponized exploit 的转化速度将从**几天几周缩短到几小时**  
  
- • 利用成本从"需要资深研究员"降到"不到2000美元API费+一天时间"  
  
- • 规模化意味着以前不值得打的小目标现在也划算了  
  
### 🟡 中期：混乱的过渡期  
  
报告里有一段话特别值得玩味：  
> "我们认为像 Mythos Preview 这样的模型可能需要重新审视一些防御措施——那些**通过增加摩擦而非设置硬屏障**  
来提供安全价值的缓解措施。当大规模运行时，语言模型会快速消化这些繁琐步骤。"  
  
  
翻译成人话：**KASLR、W^X 这种硬屏障还有用；但那些靠"麻烦"来挡攻击的手段，基本废了。**  
  
因为对AI来说，繁琐≠困难。人类嫌麻烦放弃的路径，AI 可以24小时不间断地跑。  
### 🟢 长期：防守方的胜利？  
  
Anthropic 的判断是乐观的：**最终防守方会占优势。**  
 理由是：  
- • 安全工具历史上都倾向于帮助防御者更多（AFL fuzzer 就是最典型的例子）  
  
- • 防守方可以更高效地调度资源、在代码发布前就用模型修bug  
  
- • 关键是谁能更好地利用这些工具  
  
**但这个"长期"之前的过渡期，可能是相当痛苦的。**  
## 给安全从业者的生存指南  
  
如果你是安全从业者——无论红队还是蓝队——以下是几个不成熟的建议：  
### 1. 现在就开始练兵  
  
别等 Mythos 级模型公开发布。**现在的前沿模型（Opus 4.6 等）就已经非常擅长找漏洞了**  
，只是还不擅长写exploit。  
  
现在开始设计你的脚手架（scaffold）、建立你的工作流、学习怎么跟 AI 协作做安全研究。等更强的模型出来的时候，你会感谢今天的自己。  
### 2. 思维转变：从"猎人"到"牧羊人"  
  
传统安全研究的核心技能是**深度**  
——花三周时间去挖一个复杂的漏洞链。AI 的优势是**广度和速度**  
——同时扫几百个文件、跑几千次尝试。  
  
你的价值会逐渐从"亲自挖洞"转向：  
- • 设计更好的脚手架和自动化流水线  
  
- • 判断 AI 输出的质量和优先级  
  
- • 做 AI 做不了的事：**创造性思维、跨领域关联、安全架构设计**  
  
### 3. 缩短补丁周期——这是生死时速  
  
N-day 到 weaponized exploit 的时间窗口正在急剧缩小。这意味着：  
- • **软件使用者：**  
 尽可能开启自动更新，把补丁窗口压到最小  
  
- • **软件分发商：**  
 可能需要改变"攒到下一个版本再发"的策略，安全修复应该走带外发布通道  
  
- • **安全团队：**  
 重新审查你的漏洞披露政策——准备好应对量级可能大几个数量级的漏洞报告  
  
### 4. 拓展边界：不只是找漏洞  
  
报告列了一大堆 AI 可以加速的防御工作：  
- • Bug 报告的初步分级和去重  
  
- • 自动写复现步骤  
  
- • 自动生成补丁建议  
  
- • 云环境配置审计  
  
- • PR 安全审查辅助  
  
- • 遗留系统迁移加速  
  
**你现在手动做的每一件事，都应该问自己：这件事可以用 AI 加速吗？**  
### 5. 最重要的一点：保持敬畏，但不要恐慌  
  
回顾历史：  
- • **SHA-3 竞赛**  
在2006年启动，当时 SHA-2 根本没被攻破  
  
- • **后量子密码**  
标准化在2016年开始，当时量子计算机还不知道在哪  
  
**安全社区最优秀的地方就在于：总是在威胁变成现实之前就开始准备。**  
  
这一次威胁不是假设性的了——高级语言模型已经在这里。但我们同样可以提前行动。  
## 最后说点真心话  
  
读完这份报告，我的第一反应是：**安全行业过去20年的稳定平衡，可能要被打破了。**  
  
2000年代以来，攻击手段越来越复杂，但本质上，我们今天看到的攻击和2006年的攻击是**同一个形状**  
的。  
  
但一个能**自动发现零日漏洞、自动写出完整利用链、自动绕过多层防御**  
的语言模型？这是一个全新的变量。  
  
Linus Torvalds 说过："**只要有足够的眼球，所有bug都是浅层的。**  
" （Given enough eyeballs, all bugs are shallow.）  
  
现在我们有了不需要睡觉、不会疲劳、可以同时阅读数千个文件的"眼球"。而且它们不光能发现bug，还能顺手把利用代码给你写了。  
  
**这不是未来。这是昨天发生的事。**  
  
本文基于 Anthropic 2026年4月7日发布的《Assessing Claude Mythos Preview's cybersecurity capabilities》技术报告编写，原文见 red.anthropic.com。文中技术细节均来自该报告公开部分，已披露漏洞遵循负责任的协调漏洞披露（CVD）流程。  
  
**如果这篇文章让你有所思考，欢迎转发给身边的安全从业者。这个话题，值得更多人参与讨论。**  
  
  
**文章来源：Purpleroc的札记**  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
