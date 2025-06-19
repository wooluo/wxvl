#  英特尔 CPU 新漏洞导致特权内存中的敏感数据泄露  
Rhinoer  犀牛安全   2025-06-18 16:00  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qvpgicaewUBlkqb2UwXDnXb0MYfKajE4r3hglaicFbk8tb4kjw2w4DGgfIIx1JuicqfdjBPknoQmiaOILG6vJ57ALA/640?wx_fmt=png&from=appmsg "")  
  
所有现在使用的英特尔 CPU 中都存在一个新的“分支权限注入”漏洞，该漏洞允许攻击者从分配给特权软件（如操作系统内核）的内存区域中泄露敏感数据。  
  
通常，这些区域包含密码、加密密钥、其他进程的内存和内核数据结构等信息，因此保护它们免遭泄漏至关重要。  
  
据苏黎世联邦理工学院研究人员Sandro Rüegge、Johannes Wikner 和 Kaveh Razavi 称，Spectre v2 缓解措施已持续六年，但他们最新的“分支预测器竞争条件”漏洞有效地绕过了这些措施。  
  
该漏洞被命名为“分支特权注入”，编号为CVE-2024-45332，是英特尔 CPU 中使用的分支预测器子系统的竞争条件。  
  
分支预测器（例如分支目标缓冲区 (BTB) 和间接分支预测器 (IBP)）是专门的硬件组件，它们会在分支指令解析之前尝试猜测其结果，以保持 CPU 流水线满载，从而实现最佳性能。  
  
这些预测都是推测性的，这意味着如果最终结果错误，预测结果就会被撤销。然而，如果预测正确，性能就会提高。  
  
研究人员发现，英特尔的分支预测器更新与指令执行不同步，导致这些更新跨越特权边界。  
  
如果发生权限切换，例如从用户模式切换到内核模式，则存在一个很小的机会窗口，在此期间更新与错误的权限级别相关联。  
  
结果，用户和内核之间的隔离被打破，非特权用户可以泄露特权进程的数据。  
  
苏黎世联邦理工学院的团队开发了一种漏洞，可以训练 CPU 预测特定的分支目标，然后进行系统调用将执行移至操作系统内核，从而使用攻击者控制的目标（“小工具”）进行推测执行。  
  
该代码访问加载到缓存中的秘密数据，并使用侧信道方法将内容泄露给攻击者。  
  
研究人员在启用默认缓解措施的 Ubuntu 24.04 上演示了他们的攻击，以读取包含哈希帐户密码的“/etc/shadow/”文件的内容。该漏洞的峰值泄漏速率可达 5.6 KB/秒，准确率高达 99.8%。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qvpgicaewUBlkqb2UwXDnXb0MYfKajE4r4G7gHKMIomc5uKgP4t12nZxib3CAJNfS81lsVkZczczAQrIQJKrgpaA/640?wx_fmt=png&from=appmsg "")  
  
影响和修复  
  
CVE-2024-45332 影响第九代及以后的所有英特尔 CPU，包括 Coffee Lake、Comet Lake、Rocket Lake、Alder Lake 和 Raptor Lake。  
  
研究人员解释说：“自第 9 代（Coffee Lake Refresh）以来的所有英特尔处理器都受到分支权限注入的影响。”  
  
“然而，我们早在第 7 代（Kaby Lake）处理器上就观察到绕过间接分支预测屏障（IBPB）的预测。”  
  
苏黎世联邦理工学院的研究人员目前尚未测试老一代产品，但由于它们不支持增强型间接分支限制推测 (eIBRS)，因此它们与这一特定漏洞的相关性较小，并且可能更容易受到类似旧版 Spectre v2 的攻击。  
  
Arm Cortex-X1、Cortex-A76 以及 AMD Zen 5 和 Zen 4 芯片也接受了检查，但它们没有表现出相同的异步预测器行为，因此不易受到 CVE-2024-45332 的攻击。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qvpgicaewUBlkqb2UwXDnXb0MYfKajE4rp3IBTZAGeK330w70gQwGzW9J7PYiaCsgxYpic67WhicibYiaVXWK9fUSk9Q/640?wx_fmt=png&from=appmsg "")  
  
尽管该攻击是在 Linux 上演示的，但该漏洞存在于硬件级别，因此理论上在 Windows 上也可以利用。  
  
研究人员于 2024 年 9 月向英特尔报告了他们的发现，该科技巨头发布了微代码更新，以缓解受影响型号上的 CVE-2024-45332。  
  
固件级缓解措施会带来 2.7% 的性能开销，而软件缓解措施会对性能产生 1.6% 到 8.3% 的影响，具体取决于 CPU。  
  
对于普通用户来说，风险较低，攻击需要满足多个强有力的先决条件才能开启现实的利用场景。即便如此，我们仍建议应用最新的 BIOS/UEFI 和操作系统更新。  
  
苏黎世联邦理工学院将在即将举行的USENIX Security 2025大会上以技术论文的形式介绍其漏洞的全部细节 。  
  
5 月 13 日更新 - 英特尔发布了有关 CVE-2024-45332 的安全公告 ，并向 BleepingComputer 发送了以下评论：   
  
我们感谢苏黎世联邦理工学院在这项研究以及协调公开披露方面的合作。英特尔正在加强其 Spectre v2 硬件缓解措施，并建议客户联系其系统制造商获取相应的更新。迄今为止，英特尔尚未发现任何利用瞬时执行漏洞的实际案例。——英特尔发言人  
  
  
信息来源：B  
leepingComputer  
  
