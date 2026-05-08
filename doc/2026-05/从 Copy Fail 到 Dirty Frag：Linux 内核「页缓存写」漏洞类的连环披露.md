#  从 Copy Fail 到 Dirty Frag：Linux 内核「页缓存写」漏洞类的连环披露  
原创 🅼🅰🆈
                    🅼🅰🆈  独眼情报   2026-05-08 04:33  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/cBGhzWwhSAjmNk7n7dkbAxkjVUoddia2ZlXCibLqISCxSNbIiagUnxwcA3G0zAtX74yWrbS3pFCNn1EZW0A1TMQaqt0eEWgG1hQxO8RB3djdPE/640?wx_fmt=jpeg&from=appmsg "")  
## 长话短说  
  
2026 年 4 月 29 日到 5 月 8 日，仅九天时间，Linux 内核同一类逻辑漏洞——**通过 splice() 把只读文件的页缓存页种进 zero-copy 发送路径，让接收侧的 in-place 加密操作在攻击者控制的位置写入受保护文件**  
——被两组独立研究员连续披露：  
- **Copy Fail（CVE-2026-31431）**  
：Theori 公司研究员 Taeyang Lee 借助 AI 代码审计工具 Xint Code 在约一小时内挖出，2026-04-29 公开；漏洞位于 algif_aead  
 的 authencesn  
 模板。  
  
- **Dirty Frag（暂无 CVE）**  
：韩国独立内核研究员 Hyunwoo Kim（@v4bel）通过传统人工挖洞挖出，2026-04-29 / 04-30 报告 Linux 内核安全团队，原定 5 月 12 日 embargo 解除；2026-05-07 被「无关第三方」打破计划，被迫立即全公开。漏洞位于 xfrm-ESP  
 和 RxRPC  
 两个独立子系统。  
  
两批漏洞合计影响 2017 年至今主流 Linux 发行版的默认配置——桌面、服务器、容器、WSL2 在多家独立验证下均能成功提权（具体可利用性受内核版本、模块加载策略、AppArmor/seccomp 配置影响，详见技术骨架小节）。Copy Fail 已有补丁；Dirty Frag 至今无 CVE 编号，上游 ESP 补丁已于 2026-05-07 合入 netdev 树（commit f4c50a4034e6），上游 RxRPC 补丁仍在 netdev 邮件列表 review；发行版层面 AlmaLinux 已在 2026-05-07 把 patched kernel 推入 testing 仓库、CloudLinux 在 build/test 中，Red Hat、Ubuntu、SUSE、Debian、Fedora 截至发稿（2026-05-08）未见 Dirty Frag 完整修复公告。  
  
**研判**  
：Dirty Frag 在主流发行版上的补丁缺位的直接原因是 embargo 被破打乱了厂商发版节奏，依据是 v4bel 在 oss-security 邮件列表中明确说明这一点 + AlmaLinux 公告原话「Patches are not yet available from Red Hat」；这是 2026 年迄今最严重的本地提权窗口。  
  
但本文最值得关心的不是「又一个 LPE」。  
  
**研判**  
：Copy Fail 显示了 AI 代码审计工具能在一小时内挖出过去 9 年没人发现的内核逻辑漏洞，Dirty Frag 显示了同一漏洞类的「隔壁子系统」早已经被人类研究员独立锁定——这两件事叠加，倾向认为内核逻辑漏洞的发现成本正在快速下降，防御方过去依赖「LPE 0day 是稀缺品」的补丁周期、采购周期、合规周期假设需要重新评估。依据：Copy Fail 的发现路径（人类专家锁定方向 + Xint Code 一小时扫描）+ Dirty Frag 的发现路径（人工深挖同一漏洞类邻近子系统）。  
  
![Fire in the hole 幻听](https://mmbiz.qpic.cn/sz_mmbiz_jpg/cBGhzWwhSAiaPegzFibPIYWQgUCDkL3DsmzOZRiahD14yELpl4F2erXOQtXichQHgsnrvYOPNgslqibNBY9YnykEq5eCHPqcCoRepWHt6CuYavJk/640?wx_fmt=jpeg&from=appmsg "")  
  
Fire in the hole 幻听  
## 技术骨架：一个共同模式，三个落点  
  
Dirty Pipe（2022, CVE-2022-0847）、Copy Fail（2026, CVE-2026-31431）、Dirty Frag（2026, CVE 待分配）属于同一个漏洞类。攻击者掌握一个共同原语：  
> 通过 splice()  
 把**攻击者只有读权限的文件**  
（典型如 /usr/bin/su  
、/etc/passwd  
）的页缓存页「种」进某个内核 zero-copy 路径的 scatter-gather list，使得内核某段代码在错误的假设下对这块物理内存执行写操作。结果：磁盘上的文件没变，但**页缓存里的版本被改了**  
——而页缓存才是后续所有进程读到的版本。  
  
  
三个漏洞的差异只在「内核哪段代码错以为可以写」：  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">漏洞</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">落点子系统</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">写入原语</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">利用前提</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Dirty Pipe</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">pipe_buffer</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">通过 </span><code><span leaf="">splice()</span></code><span leaf=""> 后污染 pipe buffer 的 flag 让 </span><code><span leaf="">write()</span></code><span leaf=""> 落到只读页</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">内核 ≥ 5.8 + 特定补丁</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Copy Fail</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">algif_aead</span></code><section><span leaf=""> (AF_ALG) 的 </span><code><span leaf="">authencesn</span></code><span leaf=""> 模板</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">AEAD 解密时 4 字节「草稿写」落到 dst SGL 末尾</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">普通本地用户即可</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Dirty Frag (ESP 变种)</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">xfrm-ESP</span></code><section><span leaf=""> 的 </span><code><span leaf="">esp_input</span></code><span leaf=""> 跳过 </span><code><span leaf="">skb_cow_data</span></code></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">crypto_authenc_esn_decrypt</span></code><section><span leaf=""> 把 ESN 序列号高 4 字节 STORE 进 dst</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">需要 user namespace（CAP_NET_ADMIN）</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Dirty Frag (RxRPC 变种)</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">rxkad_verify_packet_1</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">pcbc(fcrypt)</span></code><section><span leaf=""> 单块解密原地写 8 字节</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">普通本地用户即可</span></section></td></tr></tbody></table>  
  
这张表是本文的核心信息密度所在。**研判**  
：从 Dirty Pipe 到 Copy Fail 到 Dirty Frag，「通过 zero-copy 路径污染页缓存」这个原语的可利用面被持续发现并未被收敛，原因是 Linux 内核里「in-place crypto on shared page」这个反模式分布在多个独立维护的子系统（pipe、AF_ALG、IPsec、AFS/RxRPC），没有统一的护栏。每个子系统的开发者都默认上游（splice 路径）传过来的是「自己的页」，而 splice 的语义恰恰是「可以把别人的页传过来」。补丁全部是局部的——为每个出口点单独加 skb_cow_data  
 或 SKBFL_SHARED_FRAG  
 标志位检查——而非根因修复。**这意味着同类漏洞还会出现**  
。  
### Dirty Frag 的两个变种为何要「链」在一起  
  
v4bel 的 write-up 给出了非常关键的工程考量：单个变种都不够「通用」，但两个变种叠加可以覆盖几乎所有主流发行版。  
- **ESP 变种**  
几乎所有发行版的内核构建中都包含 esp4.ko/esp6.ko  
（XFRM 路径触发时可由 netlink 自动加载），但 exploit 需要 CAP_NET_ADMIN  
。Ubuntu 部分场景通过 AppArmor 阻断了非特权用户创建 user namespace，导致 ESP 变种在那里失效。  
  
- **RxRPC 变种**  
完全不要特权，但要求**目标系统的内核构建中存在 rxrpc.ko 模块且允许通过 socket(AF_RXRPC) 触发自动加载**  
。Ubuntu 内核默认提供 rxrpc  
 模块（exploit 通过 dummy socket 调用即可触发自动加载）；RHEL 10.1 默认构建不包含该模块（v4bel write-up 明确指出这一点），因此不可触发——但如果系统启用了 AlmaLinux 等下游的 partner 模块仓库可能引入 rxrpc  
，需独立核查。  
  
链式 exploit 的逻辑：先尝试 ESP 变种；若 unshare(CLONE_NEWUSER)  
 失败或 SA 注册失败，回落到 RxRPC 变种。这就是为什么 Dirty Frag 比单个变种危险得多——它解决了「在野利用工具链」的最后一公里。  
### 为什么传统检测工具看不到  
  
Copy Fail 和 Dirty Frag 共享一个让传统防御绝望的特性：**修改只发生在内存中的页缓存，磁盘文件本身没动**  
。文件完整性监控（AIDE、Tripwire、Wazuh FIM）逐字节比对的是磁盘内容，看不到这种「内存层污染」。直到下一次系统重启或 echo 3 > /proc/sys/vm/drop_caches  
，被污染的页缓存才会被刷新。**研判**  
：这意味着如果攻击者在被污染的窗口内完成提权和持久化（比如修改 SSH key、植入 cron），后续即便 IT 团队「打了补丁并重启」，攻击者已经留下的持久化通道仍然有效。  
  
这条对蓝队的实战影响很大：**任何怀疑被这两个漏洞利用过的系统，光打补丁不够，必须配合凭据轮换、计划任务审计、SSH key 审计**  
。  
## 主叙事：AI 工具与人类研究员的「撞车」，以及它意味着什么  
  
Copy Fail 和 Dirty Frag 的同周披露**不是巧合**  
，但也**不是同一团队协调的产物**  
。两条线独立行进，最后撞到一起：  
  
**第一条线：Theori / Xint Code（AI 工具线）**  
  
Xint 在自己的官方写作中把 Copy Fail 的发现过程描述得相当具体：研究员 Taeyang Lee 在前期 kernelCTF 工作中已经把 AF_ALG 攻击面摸清，意识到 splice()  
 + AF_ALG 这条路径让普通用户可以把页缓存页喂进 crypto 子系统，**怀疑 scatterlist 页来源是个被低估的漏洞富矿**  
；他把这个洞察作为一句「操作员提示」喂给 Xint Code，让它扫描整个 crypto/  
 子系统对用户态 syscall 可达的全部代码路径。约一小时后 Copy Fail 是输出里最高严重度的发现——**Xint 同时还报告「这次扫描还发现了另一个高严重度的提权漏洞，目前仍在负责任披露流程中」**  
。  
  
外部解读：Theori 不是做营销。Bugcrowd 在他们的复盘文章里给出一个对照——传统上，跨发行版的无 race window LPE 原语在 broker 市场（Zerodium 历史报价曾达 50 万美元、Crowdfense 当下灰市报价 1 万到 700 万美元区间）属于稀缺品。**研判**  
：如果一个 AI 工具能在专家给定方向后一小时内产出这个位置的候选，则该工具的边际成本结构与传统人工挖洞不在一个数量级。但这是基于 Theori/Xint 自身披露的单一案例；**反向条件**  
：Xint Code 的发现速度没有第三方独立复现——Bugcrowd 也只是基于 Xint 的公开材料做的判断，不是独立验证。真正能验证「市场结构变化」的是 Xint Code 或同类工具在未来 3-6 个月内是否持续产出同等量级的发现。  
  
**第二条线：Hyunwoo Kim / @v4bel（人工挖洞线）**  
  
v4bel 是韩国资深内核安全研究员，公开身份可追溯到 2019-2020 年的 Linux 内核 hacking 课程。他从未在 Dirty Frag 公开材料中提到使用 AI 工具——write-up 里展示的是高度细节化的人工分析：跟踪 esp_input  
 在哪一个分支会跳过 skb_cow_data  
、crypto_authenc_esn_decrypt  
 把哪 4 字节 STORE 到哪里、ESP 头里 seq_hi  
 是怎么从用户态 XFRMA_REPLAY_ESN_VAL  
 一路传到 STORE 操作的目标地址、为什么 fcrypt 56 位密钥可以在用户态以 ~18M 次/秒暴力搜索。  
  
这种深度跟「AI 扫一小时给出候选」是两种完全不同的工作模式。但二者落到了**同一个漏洞类**  
。  
  
**两条线为什么会撞**  
  
回答这个问题需要回到漏洞类本身：从 Dirty Pipe 起，「通过 splice 污染页缓存」已经成了一条公开的研究方向。Theori 的研究员明确说过这是「前期 kernelCTF 工作的延续」——也就是说，这条研究方向在内核安全社区已经是显学。AI 工具和资深人工研究员**在同一个公开富矿区竞争**  
，撞车的概率本就很高。  
  
**研判**  
：这个「撞车」是 AI 辅助漏洞挖掘进入主流的标志性事件，但它揭示的真正变化不是「AI 替代人类」——v4bel 的工作 Xint Code 当时没有挖出来（至少没在 Copy Fail 报告里出现 ESP/RxRPC 变种）。**真正的变化是工具把「挖洞门槛」压低到「读懂工具输出」的水平**  
。Bugcrowd 的判断：使用一个严肃的漏洞挖掘工具的技能曲线，开始看起来像读懂它输出的技能曲线。但反方向看不成立：依据是 v4bel 的工作明显比 Theori 的报告更深入了同一漏洞类的相邻子系统——人类专家的「漏洞类直觉」和「链式利用工程」目前仍领先于 AI 工具。  
  
但只要「AI 找候选 + 人类做工程」成为标准流程，**漏洞供给将不再受单点专家产能约束**  
——这才是对防御方的根本冲击。  
## 当前威胁面  
### 受影响范围  
  
**Copy Fail（已有补丁）**  
：  
- 内核范围：Linux 4.14（2017）至 6.18 / 6.19.12 / 7.04 之前的所有版本  
  
- 发行版：Ubuntu（24.04 LTS 等所有 26.04 之前的版本）、Amazon Linux 2023、RHEL 10.1、SUSE 16、Debian、Fedora、Arch Linux 等  
  
- Ubuntu 26.04 (Resolute) 及以上不受影响（已包含相关重构）  
  
**Dirty Frag（补丁滚动中，无 CVE）**  
：  
- 内核范围：ESP 变种自 2017-01-17 commit cac2661c53f3 起；RxRPC 变种自 2023-06 commit 2dc334f1a63a 起；上游有效寿命约 9 年  
  
- 发行版：Tom's Hardware 测试 WSL2、CachyOS（kernel 7.0.3）、Arch、Ubuntu 24/26、RHEL、OpenSUSE、CentOS Stream、Fedora、AlmaLinux 全部可成功提权  
  
- **上游补丁**  
：ESP 部分已于 2026-05-07 合入 netdev 树（commit f4c50a4034e6）；RxRPC 部分的 v4bel 提交补丁尚未 merge  
  
- **发行版补丁状态（截至 2026-05-08 KST）**  
：  
  
- AlmaLinux：已在 testing 仓库放出 patched kernel，等待社区测试后推入 production  
  
- CloudLinux：patched kernel 与 KernelCare livepatch 在 build/test 中  
  
- Red Hat / RHEL：截至发稿未见 Dirty Frag 修复公告（Copy Fail 已发补丁）  
  
- Ubuntu / SUSE / Debian / Fedora：截至发稿未见 Dirty Frag 修复公告（Copy Fail 已发补丁）  
  
- 截至发稿无 CVE 标识符  
  
### 在野利用情况  
- **Copy Fail**  
：CISA 已将其加入 KEV 目录；Microsoft 称已观察到「有限的野外利用，主要围绕 PoC 测试」；独立安全研究员 Hendry Adrian 也确认「攻击者正在利用」  
  
- **Dirty Frag**  
：截至发稿（2026-05-08）**没有任何安全厂商或机构公开确认在野利用**  
。v4bel 在 write-up 中暗示「无关第三方」打破 embargo 可能与攻击者武器化有关，但 v4bel 本人也写明「It's unknown at this time whether this is an example of parallel discovery or how the third party was able to disclose it prior to the end of the embargo」（LWN.net 转述）—— 即**embargo 被破的原因目前未明**  
。**待证实**  
：Dirty Frag 是否已被武器化用于实际攻击。从 oss-security 邮件列表正式公开（2026-05-08 KST 03:56）到现在不到 24 小时，监测窗口太短。完整 exploit 公开 + 无补丁的窗口本身已经足够紧迫，不必等到「确认在野利用」才行动  
  
### 容器与云的特殊敏感性  
  
这是本文对决策者最重要的一段：  
  
**标准共享内核容器不是面对这类漏洞的可靠安全边界——但也不能写成「所有容器场景一定可逃逸」**  
。Copy Fail 和 Dirty Frag 的危险点在于：攻击者不需要容器内 root，只要能在容器内执行代码，且该代码可以触达 AF_ALG、XFRM、RxRPC、splice()  
 等内核路径，就可能污染**宿主机内核的页缓存**  
——效果跨越所有共享同一内核的容器。  
  
实际可利用性取决于：seccomp 是否过滤了 add_key  
/unshare  
/setsockopt  
 这类 syscall、AppArmor/SELinux 是否限制了协议族（AF_ALG、AF_RXRPC、AF_NETLINK）、是否做了 capability drop（特别是 CAP_NET_ADMIN）、相关内核模块是否存在或可自动加载、容器运行时是否启用了 user namespace。Ubuntu 官方对 Copy Fail 的容器风险表述就比较克制——「在可能执行恶意工作负载的容器部署中可能促进容器逃逸场景」，并指出公开 PoC 当时尚未演示完整逃逸。  
  
但**对真实在做不可信代码执行的场景，应当假设默认配置不安全**  
。  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">架构</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">风险评估</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">标准 Docker / Podman / Kubernetes（共享宿主内核）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">高风险——前述所有限制条件未做齐时，假设可逃逸</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">AWS Lambda / Fargate（Firecracker 微 VM，每租户独立内核）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">跨租户/宿主逃逸风险显著降低——但 guest 内核如果在影响范围内，guest 内提权仍需修复</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Cloudflare Workers（V8 isolates，无 Linux 内核暴露）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">跨租户逃逸风险接近零——这类漏洞不是它的威胁模型</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">gVisor（用户态内核）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">跨租户逃逸风险显著降低——它不暴露 </span><code><span leaf="">algif_aead</span></code><span leaf=""> / IPsec / RxRPC 路径，但需要确认是否启用了相关 syscall pass-through</span></section></td></tr></tbody></table>  
  
**研判**  
：AI 代理代码执行沙箱（agent code-execution sandbox）是这类漏洞的高优先级目标。任何让 LLM 在容器内执行 shell 命令的平台，如果默认基于标准 Linux 容器、没做严格 seccomp 过滤，就需要重新评估隔离假设。这个赛道在 2025-2026 年增长极快，很多平台还没迁到 microVM 或 gVisor。  
  
CI/CD runner（GitHub Actions self-hosted、GitLab runner、Jenkins agent）同理——它们的工作模型是「在容器里跑不可信代码」，最容易踩到这类漏洞的可达性陷阱。  
## 缓解与处置  
### 立即行动（按优先级）  
  
**P0 - 容器编排平台运营方**  
：  
1. 立刻评估容器宿主机内核是否在影响范围内：Copy Fail 影响 4.14–6.19.12；Dirty Frag 的 ESP 变种自 4.10（2017-01-17）起，RxRPC 变种自 6.4（2023-06）起，**ESP 变种覆盖面较广，RxRPC 变种是否可触发取决于内核构建是否包含 rxrpc 模块以及是否能通过 socket(AF_RXRPC) 自动加载**  
  
1. Copy Fail 已有补丁，立即推送 Ubuntu/RHEL/AlmaLinux 等发行版的 kernel 更新并重启节点  
  
1. Dirty Frag：AlmaLinux 用户可从 testing 仓库拉取 patched kernel 测试后部署；其它发行版（Red Hat、Ubuntu、SUSE、Debian、Fedora）暂无补丁，临时缓解：禁用 esp4  
/esp6  
/rxrpc  
 模块（见下文命令），同时禁用 algif_aead  
（Copy Fail 的双保险）  
  
1. 把多租户工作负载迁到 microVM（Firecracker）或 gVisor 隔离  
  
**P1 - 通用服务器**  
：  
1. 立即应用 Copy Fail 补丁  
  
1. Dirty Frag 临时缓解：  
  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
1. 关闭非特权 user namespace 创建（阻断 Dirty Frag ESP 变种）：  
  
```
sudo sysctl -w kernel.unprivileged_userns_clone=0
```  
  
注意此设置对部分容器运行时（如 rootless Podman、Bubblewrap、Firefox sandbox）有副作用——评估业务影响  
1. **关键例外**  
：运行 IPsec VPN（strongSwan、Libreswan、site-to-site IPsec 隧道）的服务器**不能直接 rmmod esp4/esp6**  
，会断 VPN。这类服务器需要单独评估补丁路径  
  
**P2 - 桌面用户**  
：  
  
风险等级低于服务器（攻击者需要先在你机器上拿到 shell），但 WSL2 也在影响范围内（Tom's Hardware 实测）。建议跟随发行版补丁更新，桌面常用应用（浏览器、IDE、容器开发工具）的代码执行漏洞链可以触达本地 LPE。  
### 不要做的事  
- **不要把「补丁了就完事了」作为唯一动作**  
。Copy Fail / Dirty Frag 的页缓存污染特性意味着：如果一台机器在补丁前被攻击过，必须假设凭据已泄漏、持久化已植入。光打补丁不重置凭据等于自欺  
  
- **不要依赖磁盘文件完整性监控（FIM）作为唯一检测**  
。AIDE、Tripwire、Wazuh FIM、磁盘 checksum 这类工具看的是磁盘内容，对 Copy Fail / Dirty Frag 的页缓存污染**直接漏报**  
——Xint 官方明确说该漏洞修改不会触发文件 dirty bit。但行为检测仍然有效：Cloudflare 在 Copy Fail 公开后用现有 bpf-lsm 行为规则在数分钟内识别出利用模式（无需为这个漏洞写专门规则）——这说明 EDR / eBPF / LSM hook 路径如果能解析 syscall 参数和协议族链路，就能拿到信号。问题在于大多数组织的检测栈是 FIM + 标准 EDR 进程行为规则，**两端都不踩点**  
  
- **不要用 AppArmor / SELinux 作为唯一防线**  
。Dirty Frag 的 RxRPC 变种完全不需要任何特权 syscall，标准 LSM 策略不会拦截  
  
### 检测建议  
  
由于 Copy Fail / Dirty Frag 的写入只发生在内核页缓存内存层、磁盘文件不变，传统基于磁盘的文件完整性监控（AIDE、Tripwire、Wazuh FIM）无效。检测重点应转向**行为侧 + 参数解析**  
。  
  
可行的检测路径：  
1. **eBPF / LSM hook**  
（Tetragon、Tracee、bpf-lsm 等）：能拿到 syscall 字符串参数，可以做精确过滤。重点关注：  
  
1. 非系统服务进程调用 add_key(type="rxrpc", ...)  
 —— 合法 AFS 客户端在大多数环境极罕见  
  
1. 非容器运行时进程调用 unshare(CLONE_NEWUSER | CLONE_NEWNET)  
 后短时间内执行 XFRM netlink 操作  
  
1. 单进程在数秒内连续触发 XFRM_MSG_NEWSA  
（Dirty Frag ESP exploit 一次需要约 48 个 SA 注册）  
  
1. **EDR 行为规则**  
：监控以下行为链作为高置信度告警：  
  
1. splice()  
 跨文件描述符（pipe → socket）+ 目标 socket 是 AF_INET UDP 4500 端口（ESP-in-UDP）+ 短时间内对 /usr/bin/su  
 或 /etc/passwd  
 的只读 fd 进行 splice  
  
1. add_key("rxrpc", ...)  
 + 紧接着的 socket(AF_RXRPC)  
 + 对 /etc/passwd  
 的页缓存 mmap 操作  
  
1. **审计 auditd**  
（能力受限但仍有价值）：  
  
```
# 监控 unshare —— 注意 Dirty Frag PoC 用的是 CLONE_NEWUSER|CLONE_NEWNET（a0=0x50000000），# 不能用 a0=0x10000000 精确匹配，会漏报。先记录所有 unshare，再到 SIEM/eBPF 层解析 flags。-a always,exit -F arch=b64 -S unshare -k unshare_observed# 监控 add_key 调用（无法按 type 字符串过滤，但可观察频次/进程）-a always,exit -F arch=b64 -S add_key -k addkey_observed# 监控缓解配置文件被写入或删除（防止攻击者撤销缓解）-w /etc/modprobe.d/dirtyfrag.conf -p wa -k dirtyfrag_mitigation
```  
  
**注意**  
：auditd 的 -F  
 字段不支持按 syscall 字符串参数（如 add_key  
 的 type="rxrpc"  
）过滤——这种过滤只能在 eBPF 或 EDR 层做参数解析。如果你的检测栈只有 auditd，做不到精确告警，只能告警量大后人工筛。  
1. **取证一次性命令**  
（已经怀疑被利用，重启前做一次）：  
  
```
# 抓取当前页缓存中 /etc/passwd 与 /usr/bin/su 的内容做基线sudo cat /etc/passwd > /tmp/passwd-from-cache.snapshotsudo cmp /etc/passwd <(sudo dd if=/dev/sda1 ... )  # 需配合具体文件系统离线读取
```  
  
补丁后强制刷新页缓存（**仅在确认补丁已加载且重启窗口前可用**  
）：  
```
sync && sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
```  
  
**警告**  
：drop_caches  
 不是防护措施，只是把已经被污染的页缓存清掉；如果攻击者保有 root，他可以重新触发漏洞再次污染。这条命令的正确用法是在**已打补丁 + 准备重启前**  
执行一次清理，不能替代补丁。在大流量数据库 / 缓存层服务器上 drop_caches  
 会造成短暂性能抖动，需评估时机。  
  
  
参考：  
https://github.com/V4bel/dirtyfrag  
  
