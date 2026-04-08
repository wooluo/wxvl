#  AI掌握零日漏洞：Claude Mythos Preview引领网络安全新时代  
原创 0xSec笔记本
                    0xSec笔记本  0xSec笔记本   2026-04-08 05:26  
  
   
  
#    📢 免责声明           
  
本文所述技术仅用于合法授权的安全研究、教学演示及防御机制开发。作者及发布平台不承担因读者误用、滥用本内容所导致的任何法律责任。请严格遵守《中华人民共和国网络安全法》及相关法律法规。  
  
# Claude Mythos Preview 的网络安全能力：一个里程碑式的技术突破  
> 一个AI模型，两周内发现的安全漏洞比人类安全专家一生还多。它能自主黑入每一个主流操作系统和浏览器。Anthropic决定：不对外发布。  
  
## 背景：这份报告意味着什么？  
  
2026年4月7日，AI公司Anthropic发布了一份技术报告，介绍其新模型 **Claude Mythos Preview**  
 在网络安全领域的惊人表现。  
  
与此同时，他们宣布启动 **Project Glasswing（玻璃翼计划）**  
——一个联合科技巨头、专门用于网络防御的封闭计划。  
  
原因只有一个：**这个模型太危险了，不能公开。**  
> "鉴于AI进步的速度，这类能力扩散到未必会负责任部署它们的行为者手中，只是时间问题。对经济、公共安全和国家安全的后果将是严重的。"  
> —— Newton Cheng，Anthropic 网络安全负责人  
  
  
🔗 官方公告：anthropic.com/glasswing  
  
🔗 技术报告：red.anthropic.com/2026/mythos-preview  
## 它究竟能做什么？  
### 🔍 自主发现零日漏洞  
  
**零日漏洞（Zero-Day）**  
，指从未被任何人发现过的安全缺陷。找到一个，通常需要顶级安全专家数周乃至数月的努力。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RPq1g3ib528gibJDXj03o5k4PjCFnZG9NZ9BKhtBjVw7JVDBBe1GP5f8jvkYpodWLoSyOm7v1lN4DEORJpJF50yVQ7nShPZJoUj565ibpyfl44/640?wx_fmt=png&from=appmsg "")  
  
  
Mythos Preview 做到了：  
  
**① OpenBSD：27年前埋下的炸弹**  
  
OpenBSD 是以"安全著称"的操作系统，其维基百科首句话就是"一个注重安全的操作系统"。  
  
Mythos Preview 在其 TCP 协议实现中，发现了一个潜伏 **27年**  
 的漏洞。攻击者只需发送几个特殊数据包，即可远程让任意 OpenBSD 服务器崩溃。  
  
**单次发现成本：不足50美元。**  
  
**② FFmpeg：16年无人察觉**  
  
FFmpeg 是全球几乎所有视频服务都依赖的媒体处理库，也是被人工和模糊测试审查最多的开源项目之一。  
  
Mythos Preview 在其 H.264 解码器中，找到了一个因 16 位整数截断导致的越界写入漏洞——自 **2010年代码重构后**  
 就存在，此前从未被任何工具或人工发现。  
  
**③ 内存安全语言写的虚拟机也没能幸免**  
  
云计算的核心组件——虚拟机监控器（VMM）——即便使用 Rust 等内存安全语言编写，也因 unsafe  
 代码块存在漏洞，被 Mythos Preview 找到了客户机→宿主机越界写入路径。  
### 💥 自主编写攻击利用代码  
  
发现漏洞只是第一步。更震惊业界的是：**Mythos Preview 能自己写出可用的攻击代码（Exploit）。**  
  
<table><thead><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><th align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">任务</span></section></th><th align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">上一代 Opus 4.6</span></section></th><th align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Mythos Preview</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">Firefox JS引擎漏洞利用</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">成功 2次 / 数百次尝试</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(15, 76, 129);font-size: inherit;"><span leaf="">成功 181次</span></strong></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">内核最高级别崩溃</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">各仅 1次</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(15, 76, 129);font-size: inherit;"><span leaf="">10个独立目标</span></strong></td></tr><tr style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);"><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">自主完整利用链</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><section><span leaf="">近 0%</span></section></td><td align="left" style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);margin: 0px;padding: 0.25em 0.5em;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);color: rgb(63, 63, 63);word-break: keep-all;text-align: left;"><strong style="box-sizing: border-box;border: 0px solid rgb(229, 229, 229);margin: 0px;padding: 0px;outline-color: oklab(0.144521 0.00000657141 0.00000288337 / 0.5);font-weight: bold;color: rgb(15, 76, 129);font-size: inherit;"><span leaf="">多个，含复杂链式攻击</span></strong></td></tr></tbody></table>  
  
安全研究员 Nicholas Carlini 描述道：  
> "我发现，过去几周内找到的漏洞数量，超过了我此前一生加起来的总和。"  
  
  
****  
**案例：FreeBSD 远程获取 root 权限（CVE-2026-4747）**  
  
这是一个潜伏 **17年**  
 的漏洞。Mythos Preview 在没有任何人工干预的情况下：  
1. 1. 自主扫描数百个内核文件，定位漏洞  
  
1. 2. 发现栈缓冲区溢出，且因缓冲区类型为 int32_t[32]  
 而非 char[]  
，编译器未插入任何保护措施  
  
1. 3. 构造了一个**分拆在6个数据包中的20步 ROP 攻击链**  
  
1. 4. 最终将攻击者公钥写入 /root/.ssh/authorized_keys  
，完全控制服务器  
  
**全程无人工介入，费用不足50美元。**  
### 🧱 链式攻击：把多个漏洞串成一把钥匙  
  
现代系统有很多防御层。Mythos Preview 展示了一种此前只有顶级人类黑客才能完成的能力：**把多个单独看起来无害的漏洞，串联成完整的攻击路径。**  
  
**Linux内核提权案例一：单比特翻转获取root**  
- • 利用 netfilter 内核模块的一个越界写入  
  
- • 精准翻转相邻物理内存中页表项的"可写"标志位（1个bit）  
  
- • 将系统内置的 setuid-root 程序映射为可写，注入攻击代码  
  
- • **费用不足1000美元，耗时半天**  
  
**Linux内核提权案例二：一个字节读取突破硬化内核**  
  
这是更复杂的案例，模型需要绕过 Linux 的 HARDENED_USERCOPY  
 安全机制：  
1. 1. 利用 AF_UNIX socket 的 use-after-free 漏洞，获得单字节内核内存读取能力  
  
1. 2. 通过读取 CPU 的"白名单"内存区域，绕过安全检查，泄露内核地址随机化（KASLR）  
  
1. 3. 引入第二个独立漏洞（流量调度器 DRR 的 use-after-free）  
  
1. 4. 伪造内核内置的 root 凭证结构，调用 commit_creds()  
 完成提权  
  
**费用不足2000美元，耗时不足一天。**  
## Project Glasswing：防守方的集结号  
  
Anthropic 没有选择封存这个模型，而是发起了一场**有组织的防御反击**  
。  
### 参与方  
  
**12家核心合作伙伴：**  
  
Amazon Web Services · Apple · Broadcom · Cisco · CrowdStrike · Google · JPMorganChase · Linux Foundation · Microsoft · Nvidia · Palo Alto Networks · 及其他  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RPq1g3ib528jwBCiaialPkrpr4ICRnOJC9xOiapV8LpQvqcue5O4ZWibOkk98XRokFJHOlEAR6AG7Lz8Adg9SX2S8MdMt38ZFN3Aquc1suJxxOAQ/640?wx_fmt=png&from=appmsg "")  
  
另有 **40余个**  
 负责关键基础设施的组织获得访问权限。  
### 资金投入  
- • **1亿美元**  
 模型使用额度，供合作伙伴免费用于安全研究  
  
- • **250万美元**  
 捐赠给 Linux 基金会旗下的 Alpha-Omega 和 OpenSSF  
  
- • **150万美元**  
 捐赠给 Apache 软件基金会  
  
### 运作逻辑  
> "虽然AI增强网络攻击的风险是真实的，但也有理由乐观：让AI模型在坏人手中危险的那些能力，同样使它在发现和修复重要软件缺陷方面无可替代。"  
> —— Anthropic，Project Glasswing 公告  
  
  
CrowdStrike 和 Palo Alto Networks 的加入尤其值得关注——这两家公司长期以自有 AI 安全能力为傲。它们的背书，等于公开承认：Mythos Preview 在捕获零日漏洞方面，已超越了业界所有其他工具。  
## 能力跃升从何而来？  
  
Anthropic 明确指出：**Mythos Preview 的安全能力并非刻意训练的结果。**  
  
它是代码能力、推理能力和自主行动能力整体提升后的**自然涌现**  
。同样的能力，让它既更擅长修补漏洞，也更擅长利用漏洞。  
  
这也意味着：**随着模型整体能力的提升，这类能力还会继续增强。**  
```
能力演进时间线
──────────────────────────────────────
2025年初   模型无法发现非平凡漏洞
2025年末   模型可找到漏洞，但几乎无法利用
           （Opus 4.6：Firefox 利用成功率约 1%）
2026年初   ██████████ 质变
           （Mythos：Firefox 利用成功率提升近 100倍）
                      内核完整攻击链：数十个
                      浏览器沙箱逃逸：多个主流浏览器
──────────────────────────────────────
```  
## 给普通从业者的建议  
  
报告对安全从业者提出了几点实操建议：  
  
**① 现在就开始用现有模型**  
  
Claude Opus 4.6 等公开可用的模型，已经能在几乎所有审查过的代码中发现高危漏洞。没有理由等待。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RPq1g3ib528gMDibjics5rG5tXniaXeAvxzKfml2icLibwrwxxNHibluXTJ8sXwhK1cxCxdL9mnSl9R6v7wRsdLPs39yUaRYw4zJ1N0NBd6yDsThpo/640?wx_fmt=png&from=appmsg "")  
  
  
**② 缩短补丁部署周期**  
  
以往从漏洞公开到可用攻击代码，需要专业研究员数天至数周。现在，这个过程可以在几小时内完成、成本不足千元。  
  
**补丁窗口正在消失。**  
 自动更新、优先处理含CVE修复的依赖升级，必须成为标准流程。  
  
**③ 重新审视"增加摩擦"型防御措施**  
  
那些靠让攻击者"觉得麻烦"来提供安全感的防御手段，面对能持续运行的AI攻击者，效果将大幅下降。  
  
**④ 用AI加速防御侧的全流程**  
  
漏洞报告分类、去重、补丁草案生成、代码审查辅助、遗留系统迁移……这些环节都应该引入模型。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RPq1g3ib528iazgh0gHVMJ6gfj5gP3VCWV3rYOadekXfBKDb9wFPJCwciajwoPYI4EBsWzt8WEA8PGuIUV0XZJLXbic1zAk67uBrwfe7pl1eExY/640?wx_fmt=png&from=appmsg "")  
  
## 更大的图景  
> "我们现在正处于自 2000 年代互联网转型以来最稳定安全平衡的尾声。语言模型能够大规模自动识别并利用安全漏洞，可能颠覆这一脆弱的平衡。"  
> —— Anthropic 技术报告  
  
  
Anthropic 相信，从长远来看，AI 将使防御方获得更大优势——更多漏洞将在被利用前被发现和修复。  
  
但**过渡期将会动荡。**  
  
现在，有组织、有资源的防御方需要抢在攻击者之前行动。Project Glasswing 是这场竞赛的发令枪。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/RPq1g3ib528j9AV5SALStHBviatuias1JHdJsc1nATSVP7tNy6F1ymJqSAAMuibr61Bib0lAdmL3Lkpg0hXqpCmlzD1PuUX0Bbt0aj1a2mL3rM6w/640?wx_fmt=jpeg "")  
  
## 相关链接  
- • 📄 Anthropic 官方公告：Project Glasswing  
  
- • 🔬 技术报告原文（red.anthropic.com）  
  
- • 📰 Fortune 报道  
  
- • 📰 TechCrunch 报道  
  
- • 📰 VentureBeat 深度分析  
  
- • 📰 CNBC 报道  
  
- • 🧑‍💻 Simon Willison 技术评析  
  
本文整理自 Anthropic 官方技术报告及多家媒体报道，发布于 2026年4月8日。  
  
   
  
  
