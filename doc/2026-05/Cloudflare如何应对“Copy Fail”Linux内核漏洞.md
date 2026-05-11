#  Cloudflare如何应对“Copy Fail”Linux内核漏洞  
Dubito
                    Dubito  云原生安全指北   2026-05-11 00:35  
  
   
  
> 注：本文翻译自 Cloudflare 的文章  
《How Cloudflare responded to the “Copy Fail” Linux vulnerability》[1]  
，可点击文末“阅读原文”按钮查看英文原文。  
  
  
全文如下：  
## 一、引言  
  
2026年4月29日，一个名为“Copy Fail”的Linux内核本地权限提升漏洞被公开披露（  
CVE-2026-31431[2]  
）。Cloudflare的安全与工程团队在漏洞披露后立即开始了评估。我们分析了利用技术，评估了其在各个基础设施上的影响面，并验证了我们现有的行为检测机制能够在几分钟内识别出该漏洞利用模式。  
  
**Cloudflare环境未受任何影响，没有任何客户数据面临风险，也从未发生过任何服务中断。**  
 请继续阅读，了解我们的预先准备是如何奏效的。  
## 二、背景  
### 2.1 我们的Linux内核发布流程  
  
Cloudflare运营着规模庞大的全球Linux服务器基础设施，数据中心遍布  
全球330个城市[3]  
。为了在此规模下有效管理更新，我们维护着一个基于社区长期支持（LTS，Long-Term Support）版本的自定义Linux内核构建。在任意给定时间，我们可能会使用来自不同系列（例如6.12或6.18）的多个LTS版本，这些版本都能受益于较长的更新周期。  
  
社区会定期合并并发布安全与稳定性更新，这会触发一个自动化任务，大约每周生成一个新的内部内核构建版本。这些构建版本会在我们的预发布数据中心进行测试，以确保在全球部署前的稳定性。成功发布后，边缘重启发布流程（ERR，Edge Reboot Release）会以四周为周期，管理边缘基础设施的系统化更新和重启。我们的控制平面基础设施通常会采用最新的内核，并根据具体的工作负载需求来安排重启时间。  
  
到某个CVE公开时，必要的修复通常已经集成到稳定的Linux LTS版本中数周了。我们既定的流程确保这些补丁早已部署完毕。  
  
在“Copy Fail”漏洞披露时，我们的大部分基础设施都在运行6.12 LTS版本，同时有一小部分机器已开始向较新的6.18 LTS版本过渡。  
### 2.2 关于Copy Fail漏洞  
  
在讲述响应过程之前，先了解这个漏洞会有所帮助。关于该漏洞的详细文章可以在原版  
Xint Code披露文章[4]  
中找到。  
#### 2.2.1 AF_ALG 与内核加密 API  
  
Linux 内核内部的加密 API 管理着诸如 kTLS 和 IPsec 等功能。用户空间程序通过 AF_ALG  
 套接字族来访问它，这使得非特权进程可以请求执行加密或解密操作。其中 algif_aead  
 模块为带关联数据的认证加密（AEAD，Authenticated Encryption with Associated Data）密码算法提供了支持。  
  
一个非特权程序会执行以下步骤：  
1. 1. 打开一个 AF_ALG  
 套接字，并绑定到一个 AEAD 模板。  
  
1. 2. 设置一个密钥，然后接受一个请求套接字。  
  
1. 3. 通过 sendmsg()  
 或 splice()  
 提交输入数据。  
  
1. 4. 使用 recvmsg()  
 执行操作。  
  
这里的 splice()  
 系统调用至关重要，因为它通过传递页缓存引用来移动数据。  
#### 2.2.2 内存机制：页缓存与原地加密  
  
**页缓存（page cache）**  
 是一个用于文件内容的共享系统缓存。修改一个属于 setuid 可执行文件的页，相当于对所有用户编辑了该程序，直到该页被驱逐出缓存。  
  
加密 API 使用**散列集（scatterlists）**  
，这是一种用于连接多个内存页的结构。2017 年，algif_aead  
 针对   
原地（in-place）  
 操作进行了优化，将目标页和引用页链接在一起。这种设计缺乏相应的强制检查，未能阻止算法写入超出预定边界的位置。  
#### 2.2.3 漏洞：越界写入  
  
当用户执行 recvmsg()  
 时，内核中的 authencesn  
 包装器会在合法输出区域之外执行一次 4 字节的写入：  
```
scatterwalk_map_and_copy(tmp + 1, dst, assoclen + cryptlen, 4, 1);
```  
  
通过使用 splice()  
，攻击者可以将目标文件的页缓存页链接到散列集中。随后的越界写入会污染被缓存的文件，从而允许攻击者控制以下三个要素：哪个文件被修改、修改的偏移量，以及具体写入哪 4 个字节。这意味着攻击者可以利用此漏洞操控：  
- • 文件：任意可读文件。  
  
- • 偏移量：可通过 assoclen  
 和 splice 参数进行调整。  
  
- • 值：通过 sendmsg()  
 中的 AAD 第 4-7 字节进行控制。  
  
#### 2.2.4 漏洞利用步骤详解  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5Bzpps1xUGDZJ1NHLw8hgA3gPlqVjdl6XJJmZT9npZzeZBlWJ8qYmSVmR1z3sibr4HgyRgvqP6v6l7eHPX9BUTdiaEsVcAo7YgHE/640?from=appmsg "null")  
  
该默认漏洞利用针对的是 /usr/bin/su  
，这是一个几乎存在于所有发行版中的 setuid-root 二进制文件。  
1. 1. **缓存引用**  
：以 O_RDONLY  
 方式打开 /usr/bin/su  
 并调用 read()  
，将其填充到页缓存中。在该文件描述符上使用 splice()  
，将这些页缓存引用传入加密散列集中。  
  
1. 2. **设置环境**  
：创建一个 AF_ALG  
 套接字，绑定（bind()  
）到 authencesn(hmac(sha256),cbc(aes))  
，设置一个密钥，然后接受一个请求套接字——这些操作都不需要特权。  
  
1. 3. **构造写入**  
：对于每个 4 字节的 shellcode 片段：  
  
1. • 调用 sendmsg()  
，其 AAD 第 4–7 字节包含该 shellcode 片段。  
  
1. • 将目标二进制文件通过 splice()  
 传入管道，再传入 AF_ALG  
 套接字，使得 assoclen + cryptlen  
 能够指向期望的 .text  
 段偏移量。  
  
1. 4. **触发写入**  
：调用 recvmsg()  
 启动解密操作。authencesn  
 将其临时数据写入页缓存中 /usr/bin/su  
 的目标偏移量处。尽管该函数最终返回 -EBADMSG  
，但这 4 字节的写入已经成功进入了全局页缓存。  
  
1. 5. **执行**  
：运行 execve("/usr/bin/su")  
 会加载已被污染的页缓存。由于该二进制文件是 setuid-root，注入的 shellcode 将以 **root**  
 权限执行。  
  
上游的修复方案（  
提交 a664bf3d603d[5]  
）回退了 2017 年的原地（in-place）优化，从而消除了该漏洞。  
## 三、我们如何响应  
  
当该漏洞被公开披露时，多个工作流并行启动：  
- • **评估影响范围**  
：我们的安全团队与内核工程师合作，确定哪些内核版本存在漏洞，并评估潜在的影响面。  
  
- • **验证检测覆盖**  
：安全团队审查了漏洞利用技术，并确认在授权的内部验证中，我们现有的行为检测机制能够识别出该漏洞利用模式。  
  
- • **主动威胁狩猎**  
：安全团队开始在我们的全量日志中回溯过去 48 小时，搜索该漏洞在公开披露前是否已被利用的迹象。  
  
- • **开发缓解措施**  
：内核工程师开始构建一个运行时缓解方案，该方案能够在不中断生产服务的前提下保护整个基础设施。  
  
- • **持续推进软件更新**  
：我们的工程团队致力于交付一个更新的 Linux 内核，这需要在我们的服务器上仔细地进行重启和逐步上线。  
  
在此次响应的任何时刻，均未对客户造成任何影响。  
### 3.1 验证检测覆盖能力  
  
我们安全团队首先做的事情之一，就是确认现有的端点检测能否捕获此漏洞利用。我们的服务器运行着行为检测机制，持续监控进程执行模式。它不依赖于了解特定漏洞，而是在整个基础设施范围内观察异常行为。  
  
当我们的工程师作为响应的一部分在内部验证该漏洞时，检测平台在几分钟内就发出了告警。该系统关联了整个执行链——从脚本解释器开始，经过内核的加密子系统，最终到达权限提升的二进制文件——并基于整个基础设施范围内的行为模式将其标记为恶意。  
  
这一切都是在没有更新签名、没有修改规则、也没有人工干预的情况下完成的。在我们为这个特定的“Copy Fail”漏洞编写任何自定义逻辑之前，我们的行为检测覆盖就已经存在了。  
  
这一确认非常重要，因为它意味着我们在编写针对特定漏洞的规则之前就已经具备检测能力了。  
### 3.2 主动狩猎利用迹象  
  
在我们的工程团队转向更有针对性的缓解措施时，安全调查（自漏洞披露以来）一直在进行。这是我们处理任何关键漏洞的标准流程。  
  
我们的安全团队在处理关键漏洞时遵循一个简单的原则：先假定已被入侵，直到你能证明并非如此。调查从一开始就假设该漏洞可能在公开之前就已经被利用了，我们系统地开展工作，要么证实这一点，要么排除这种可能。  
  
该漏洞利用在运行时会在内核日志中留下独特的痕迹。我们在集中式日志记录基础设施中搜索了该痕迹，覆盖了漏洞公开披露前 48 小时的时间窗口。如果有人在此之前就已经利用了此漏洞，我们应能发现它。  
  
我们提取了受影响系统的访问日志，并重建了谁连接了、何时连接的以及他们运行了什么命令。这为我们提供了关于潜在受影响基础设施上交互活动的完整取证图像。  
  
我们检查了系统二进制文件是否被篡改，将加密哈希值与已知正确的软件包清单进行比对，查找了持久化机制，并审计了网络连接中是否存在任何异常。一切均为正常。  
## 四、事件时间线与影响  
  
<table><thead><tr><th style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);"><section><span leaf="">时间 (UTC)</span></section></th><th style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);"><section><span leaf="">事件</span></section></th></tr></thead><tbody><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 16:00</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">“Copy Fail”漏洞公开披露。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 约21:00</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">在正式启动事件响应流程之前，安全与工程团队开始评估基础设施影响面及缓解方案。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 22:52</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">安全团队确认现有的行为检测能够覆盖“Copy Fail”漏洞利用模式。在授权的内部验证中，检测系统在几分钟内就标记了相关活动。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 23:01</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">现有的行为检测针对类似漏洞利用的活动生成了一个高危告警，确认了该技术的检测覆盖能力。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 (晚间)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">第一个漏洞缓解尝试被推送到我们的预发布数据中心。部署过程中出现了一个依赖冲突，随后该缓解被回滚。生产系统未受影响。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-29 (深夜)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">工程团队起草了 bpf-lsm 漏洞缓解程序。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 03:14</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">为促进跨团队协作并提高紧迫性，正式宣布安全事件。安全团队对全量历史数据进行了基础设施范围的威胁狩猎，以确认 Cloudflare 系统上不存在恶意活动。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 (早晨)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">工程团队测试了 bpf-lsm 漏洞缓解程序，并使其达到生产就绪状态。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 14:25</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">为协调漏洞缓解程序和 Linux 补丁的部署，正式宣布工程（engineer）事件。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 约17:00</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">做出决定：通过重启自动化流程交付一个打了补丁的上一个 LTS 版本构建；不加速推进新的 LTS 版本；在此期间依赖 bpf-lsm 进行防护。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 (下午)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">可见性流水线（pipeline）（通过 eBPF 追踪 AF_ALG 套接字使用情况）部署到全量基础设施。该管道提供了所有合法 AF_ALG 使用者的完整视图。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-04-30 (晚间)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">bpf-lsm 漏洞缓解程序通过一个独立的开关（gate）完成部署，从而对整个基础设施实现了全面缓解。在之前存在漏洞的测试节点上进行的端到端验证确认漏洞利用已不再生效。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-05-04 (早晨)</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">使用已打补丁的内核，按正常节奏恢复了重启自动化流程。</span></section></td></tr><tr><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">2026-05-04 之后</span></section></td><td style="text-align: left;line-height: 1.75;font-family: -apple-system-font,BlinkMacSystemFont, Helvetica Neue, PingFang SC, Hiragino Sans GB , Microsoft YaHei UI , Microsoft YaHei ,Arial,sans-serif;font-size: 14px;border: 1px solid #dfdfdf;padding: 0.5em 1em;color: #3f3f3f;word-break: keep-all;"><section><span leaf="">本周早些时候已经完成重启自动化的服务器，通过手动重启来加载已打补丁的内核。尚未打补丁的服务器则按照正常的重启自动化流程进行更新。</span></section></td></tr></tbody></table>  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5DRYUkKPvCd6zybTkTicOMLKqX1lf29d1yTxWjAhk6iaOkdLe7MVEMxD1VDsIsNwkv6rT8BQCtvTIicUJ8kaGnF23kCFmlZuCBA7c/640?from=appmsg "null")  
  
此图展示了我们的 mitigation 程序在整个基础设施中的推进进度。  
## 五、我们是如何进行缓解的？  
  
由于部署一个已打补丁的 Linux 内核涉及较长时间周期，我们还尝试了无需重启即可缓解此漏洞的方法。  
### 5.1 移除模块  
  
该漏洞存在于 algif_aead  
 内核模块中。因此，简单的修复方法就是直接移除此模块，并禁止其重新加载。  
  
这正是发现该漏洞的安全研究人员在其   
Copy Fail[6]  
 分析文章中所建议的缓解方案。  
```
echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif.confrmmod algif_aead 2>/dev/null || true
```  
  
但遗憾的是，移除该模块会影响那些依赖内核加密 API 的软件。这意味着我们必须找到一种更精准的缓解方案。  
### 5.2 Bpf-lsm  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Kric7mM9eA5AebSFezhCXkKk9JIia1p78ZVE0D4zagRCEOfDUY8PrEUWoJYzFfjiasicibibjicpicGW2sJaeUCD7flESLzX4AhEkvdgga9pq5hiaOrA/640?from=appmsg "null")  
  
针对这种场景，我们早已开发并部署了一个工具：  
bpf-lsm[7]  
。该工具不是移除模块，而是让模块保持加载状态以服务合法用户，同时使用一个 BPF LSM（Linux Security Module，Linux安全模块）程序来拒绝其他所有进程对 socket_bind  
 LSM 钩子的调用。这从根本上封堵了任何漏洞利用的入口。  
  
该 eBPF 程序的草稿在夜间完成。团队成员第二天早上接手，进行了验证，并使其达到生产就绪状态。该程序逻辑相当直接。在每次 socket_bind  
 调用时：  
1. 1. 如果套接字族（socket family）不是 AF_ALG  
，则放行该调用，不做任何修改。  
  
1. 2. 如果是 AF_ALG  
 族，则检查调用该调用的二进制文件路径，并与一个已知合法用户的允许列表进行比对。  
  
1. 3. 如果该二进制文件在允许列表内，则允许 bind()  
 操作；否则，拒绝该操作。  
  
为了在不实际利用漏洞的情况下验证某台机器的缓解效果，  
Copy Fail[6]  
 分析文章提供了一个单行命令：  
```
python3 -c 'import socket; s = socket.socket(socket.AF_ALG, socket.SOCK_SEQPACKET, 0); s.bind(("aead","authencesn(hmac(sha256),cbc(aes))"));'
```  
  
在已缓解的机器上，你得到的会是 PermissionError: [Errno 1] Operation not permitted  
（或 FileNotFoundError  
，具体取决于激活的是哪种缓解方案），而不是成功的 bind()  
 操作。  
### 5.3 逐步部署  
  
**在启用强制策略之前，我们首先验证了已知的内部服务是唯一合法的 AF_ALG 使用者，以避免意外中断。**  
 我们使用了   
prometheus-ebpf-exporter[8]  
 来挂钩 socket()  
 系统调用，并追踪整个基础设施中每个二进制文件的 AF_ALG  
 使用情况。这不需要更改内核，并在数小时内就获得了来自数十万台服务器的聚合数据。结果证实，我们确定的那个服务确实是唯一的合法使用者。  
  
因此，bpf-lsm 的部署被刻意分为两个步骤：  
1. 1. **先获取可见性**  
：通过 salt 推送 ebpf-exporter 配置。在指标层面确认，已知的服务几乎是唯一在创建 AF_ALG  
 套接字的进程。  
  
1. 2. **再进行强制策略**  
：通过一个独立的强制开关（enforcement gate）来推送 bpf-lsm 程序。  
  
与此同时，针对我们主要使用的 LTS 版本的上游（upstream）反向移植（backport ）终于就绪，我们的内部自动化流程基于此构建了一个已打补丁的内核。  
  
我们尽快开始在预发布数据中心测试这个打了补丁的内核，然后恢复了较长的重启流程，以便为整个基础设施全面打上补丁。  
## 六、修复与后续改进措施  
  
虽然我们为此类场景做好了准备，但在 Cloudflare，我们始终在不断学习和改进。我们确定需要改进的关键领域包括：  
- • **提升对内核 API 依赖关系的可见性**  
：我们将审查生产服务中内核子系统的使用情况，以便能够在不中断服务的前提下继续快速进行漏洞缓解。  
  
- • **改进运行时缓解能力**  
：bpf-lsm 是一个非常有价值的缓解工具，但我们希望让它变得更好。这包括探索更快的部署方式、更完善的应急预案，以及更好的日志记录和可见性。  
  
- • **缩减 Linux 内核的攻击面**  
：审查并审计我们的内核配置。主动识别未使用的模块或特性，以便将它们从我们的内核构建中彻底移除。  
  
## 七、结论  
  
“Copy Fail”漏洞给我们带来了一个独特的挑战。尽管我们每两周就会部署一次 Linux 补丁更新，但由于一个已存在一个月之久的主线修复尚未反向移植（backport ）到我们的主要内核版本，我们当时仍然存在风险。尽管如此，在该反向移植发布后的数小时内，我们就成功部署了已打补丁的内核。在过渡期间，bpf-lsm 提供了一种精准且无需重启的缓解方案，保障了我们整个基础设施的安全。虽然我们最初尝试禁用有问题的模块未能成功，但这次失败安全地发生在我们内部的预发布环境中，而非生产环境，这也使我们能够识别出该依赖关系。  
  
到部署完成时，我们基础设施中的每台机器都已受到保护，要么运行的是已打补丁的内核，要么由 bpf-lsm 程序拒绝非允许列表中的二进制文件访问存在漏洞的代码路径。在此次事件的任何时刻，客户均未受到任何影响。我们已承诺完成上述后续改进工作，以便在下次类似事件发生时，能够做出更快的响应并获得更好的可见性。负责任的披露机制是有效的，内核内的可见性工具恰恰在此刻展现了其价值，而 bpf-lsm 依然是我们用于运行时内核缓解的最有用的工具之一。  
  
在 Cloudflare，关键漏洞响应是安全、工程、产品及许多其他团队的协同努力。特别感谢 Ali Adnan、Ivan Babrou、Frederik Baetens、Curtis Bray、Piers Cornwell、Everton Didone Foscarini、Rob Dinh、Elle Dougherty、Kevin Flansburg、Matt Fleming、Kimberley Hall、Brandon Harris、Jerry Ho、Oxana Kharitonova、Marek Kroemeke、Fred Lawler、James Munson、Nafeez Nazer、Walead Parviz、Miguel Pato、Evan Pratten、Josh Seba、June Slater、Ryan Timken、Michael Wolf、Jianxin Zeng 以及所有为“Copy Fail”漏洞的调查、缓解和修复做出贡献的其他人。我们还要感谢 Linux 上游维护者和“Copy Fail”漏洞的研究人员，他们的工作使快速响应成为可能。  
#### 引用链接  
  
[1]  
 《How Cloudflare responded to the “Copy Fail” Linux vulnerability》: https://blog.cloudflare.com/copy-fail-linux-vulnerability-mitigation/  
[2]  
 CVE-2026-31431: https://security-tracker.debian.org/tracker/CVE-2026-31431  
[3]  
 全球330个城市: https://www.cloudflare.com/network/  
[4]  
 Xint Code披露文章: https://xint.io/blog/copy-fail-linux-distributions  
[5]  
 提交 a664bf3d603d: https://github.com/torvalds/linux/commit/a664bf3d603d  
[6]  
 Copy Fail: https://copy.fail/  
[7]  
 bpf-lsm: https://blog.cloudflare.com/live-patch-security-vulnerabilities-with-ebpf-lsm/  
[8]  
 `prometheus-ebpf-exporter`: https://github.com/cloudflare/ebpf_exporter  
  
   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Kric7mM9eA5BvrkoDfL3WibOHWhXwUic07K4Jp9vprKWz9TL1jK8o5wxOPQn2Drke7XvINbR0jtD4Hib6iccx5lHnk7h6VPgqCFdXQ7WslX46qZ4/640?wx_fmt=gif&from=appmsg "")  
  
  
  
**交流群**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5DaGiaHibSYhsiaN2qnPFRmMQtLibA65Se54KHwGhQ6I8P8CrdUDuL5RgaJYZxicn1Bd9AqSpxGb7IogSsgUNnqG3mCNiaA0riaqYMgBg/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
**知识库**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5AyygOK6MdEgz3yFP2HnnWZ8J40rwZQSTVgquicykxLtY5LOV3gnSvfPcN9ibYUI4mpibangYR9EP2g2r20xRrc15iaibChkv51lfnQ/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
