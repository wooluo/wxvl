#  Dirty Frag本地提权漏洞存在9年，Linux 4.11起受影响  
原创 墨菲安全实验室
                    墨菲安全实验室  墨菲安全实验室   2026-05-08 04:10  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/RibBgJR6rjzdlEibal8glHCcEutCfhRNaE0eKaNtepH0dsIFx503IdZlFQxDyic5cW3jiaDHcNB4wt5d9mstE1zajfhkfNsY5axRANTvQOuDgWg/640?wx_fmt=gif&from=appmsg "")  
  
**概述**  
  
  
**2026 年 5 月 8 日****，安全研究员 Hyunwoo Kim（@v4bel）在漏洞禁运期被第三方提前破坏后，公开披露了 Dirty Frag 漏洞链。**  
  
Dirty Frag 通过将 xfrm-ESP Page-Cache Write 和 RxRPC Page-Cache Write 两个漏洞串联，在主流 Linux 发行版上实现无需竞争条件（race-free）的本地 root 提权，成功率极高。  
  
漏洞已在 Ubuntu 24.04.4（6.17.0-23-generic）、RHEL 10.1（6.12.0-124.49.1.el10_1）、openSUSE Tumbleweed（7.0.2-1-default）、CentOS Stream 10、AlmaLinux 10、Fedora 44（6.19.14-300.fc44）上确认可利用。  
  
ESP 分支引入于 commit cac2661c53f3（v4.11，2017-01-17），RxRPC 分支引入于 commit 2dc334f1a63a（v6.5，2023-06），前者漏洞窗口约 9 年。  
  
当前无 CVE 编号，ESP 补丁已于 2026-05-07 合并入 netdev 树，RxRPC 补丁尚未合入上游。  
  
**两条利用路径对内核版本的要求不同**  
。ESP 变体从 v4.11 起即可在允许无特权用户命名空间创建的系统上独立完成提权（RHEL、Fedora、openSUSE、CentOS 等默认允许）。  
  
RxRPC 变体需要 v6.5+，针对 Ubuntu 的具体情况：Ubuntu 的 AppArmor 策略封堵了无特权 unshare(CLONE_NEWUSER)，ESP 变体无法触发，但 Ubuntu 默认加载 rxrpc.ko，RxRPC 变体不需要命名空间权限，正好补上这个缺口。完整的链式利用要求 v6.5+。  
  
  
**漏洞背景**  
  
  
Dirty Frag 与 Dirty Pipe 和 Copy Fail 属于同一漏洞类，三者都利用 splice() 将攻击者只有读权限的 page cache 页面植入内核数据路径，再借助内核后续操作完成 page cache 写入：  
  
<table><tbody><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞</span></strong></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><b style="box-sizing: border-box;"><span leaf="">被覆写的结构</span></b></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">写入触发点</span></strong></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">Dirty Pipe</span></span></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">struct pipe_buffer</span></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);line-height: 1.5;box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">pipe 写入回退路径</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">Copy Fail</span></span></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">TX SGL（AF_ALG aead）</span></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);line-height: 1.5;box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">AEAD tag 字节移位</span></span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">Dirty Frag</span></span></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">struct sk_buff 的 frag</span></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);line-height: 1.5;box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">原地 AEAD / cipher 解密</span></span></p></section></section></td></tr></tbody></table>  
  
Copy Fail 的已知缓解手段是将 algif_aead 加入模块黑名单。Dirty Frag 的 ESP 分支完全不依赖 algif_aead，对已应用该缓解的系统同样有效。  
  
  
**影响范围**  
  
  
**1.****Dirty Frag 由两条路径组成**  
  
- **xfrm-ESP 路径**  
  
由 commit cac2661c53f3 引入，自 Linux Kernel v4.11 起受影响。  
  
利用条件：xfrm/ESP 功能可用，且普通用户可创建 user namespace 与 net namespace。  
  
- **RxRPC 路径**  
  
由 commit 2dc334f1a63a 引入，自 Linux Kernel v6.5 起受影响。  
  
利用条件：内核提供或可自动加载 rxrpc 模块。  
  
  
  
  
**2.****已公开受影响测试环境**  
  
<table><tbody><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">发行版</span></strong></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><b style="box-sizing: border-box;"><span leaf="">内核版本</span></b></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">Ubuntu 24.04.4</span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">6.17.0-23-generic</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">RHEL 10.1</span></span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">6.12.0-124.49.1.el10_1.x86_64</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">openSUSE Tumbleweed</span></span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">7.0.2-1-default</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">CentOS Stream 10</span></span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">6.12.0-224.el10.x86_64</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">AlmaLinux 10</span></span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">6.12.0-124.52.3.el10_1.x86_64</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="49.8100%" width="49.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">Fedora 44</span></span></p></section></section></td><td data-colwidth="50.0000%" width="50.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">6.19.14-300.fc44.x86_64</span></p></section></section></td></tr></tbody></table>  
  
  
**3.****默认配置受影响判断**  
  
不能统一认定所有 Linux 系统默认可利用。  
  
部分主流发行版默认配置下可能满足 ESP 或 RxRPC 任一路径的利用前置条件，具体取决于发行版内核配置和安全策略。  
  
<table><tbody><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">路径</span></strong></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><b style="box-sizing: border-box;"><span leaf="">默认配置判断</span></b></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(255, 255, 255) rgb(62, 62, 62) rgb(62, 62, 62);border-style: none;background-color: rgb(180, 155, 255);padding: 0px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">关键条件</span></strong></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">xfrm-ESP</span></span></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">多数主流发行版通常包含 xfrm/ESP 能力，但普通用户能否触发取决于 user namespace 策略</span></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);line-height: 1.5;box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">默认允许 unprivileged user namespace，且 xfrm/ESP 可用</span></p></section></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="33.0000%" width="33.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">RxRPC</span></span></p></section></section></td><td data-colwidth="30.0000%" width="30.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">不同发行版差异较大，Ubuntu 上公开资料称 rxrpc.ko 通常可用</span></p></section></section></td><td data-colwidth="36.8100%" width="36.8100%" style="border-width: 1px;border-color: rgb(62, 62, 62) rgb(62, 62, 62) rgb(223, 223, 223);border-style: none none solid;background-color: rgba(255, 255, 255, 0);padding: 2px 4px;box-sizing: border-box;"><section style="margin: 5px 0%;box-sizing: border-box;"><section style="padding: 0px 5px;color: rgb(61, 61, 61);line-height: 1.5;box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><span style="background-color: rgba(254, 255, 255, 0);box-sizing: border-box;"><span leaf="">默认提供或可自动加载 rxrpc 模块</span></span></p></section></section></td></tr></tbody></table>  
  
建议客户按实际系统核查内核版本、模块配置和 user namespace 策略，而不是仅依据发行版名称判断风险。  
  
  
**补丁分析**  
  
  
**1.****ESP 变体**  
  
补丁已合入 netdev 树（commit f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4，2026-05-07），采用 Kuan-Ting Chen 的 shared-frag 方案：在 IPv4/IPv6 datagram append 路径对 splice 来源的 frag 设置 SKBFL_SHARED_FRAG 标志，esp_input/esp6_input 在 skip_cow 分支检查该标志，带外部 page 的 skb 强制走 skb_cow_data：  
```
 net/ipv4/esp4.c
-       } else if (!skb_has_frag_list(skb)) {+       } else if (!skb_has_frag_list(skb) &&+                  !skb_has_shared_frag(skb)) {

 net/ipv4/ip_output.c（及 net/ipv6/ip6_output.c 对称改动）
+           if (!(flags & MSG_NO_SHARED_FRAGS))+               skb_shinfo(skb)->flags |= SKBFL_SHARED_FRAG;
```  
  
  
**2.****RxRPC 变体**  
  
上游尚无合并的补丁。发现者提交的补丁（afKV2zGR6rrelPC7@v4bel）在 call_event.c 和 conn_event.c 的原地解密门控条件中加入 || skb->data_len，非线性 skb 通过 skb_copy() 隔离后再解密：  
```
 net/rxrpc/call_event.c 及 net/rxrpc/conn_event.c
-   if (skb_cloned(skb)) {+   if (skb_cloned(skb) || skb->data_len) {
```  
  
  
**处置建议**  
  
  
目前各主流发行版尚未发布包含补丁的内核更新，禁用相关模块是当前唯一的缓解手段：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' \
  > /etc/modprobe.d/dirtyfrag.conf; \
  rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
  
验证是否已禁用：  
```
lsmod | grep -E 'esp4|esp6|rxrpc'# 无输出表示已禁用
```  
  
  
禁用 esp4/esp6 会中断依赖 IPsec ESP 的 VPN 和加密隧道；禁用 rxrpc 会影响 AFS 客户端。评估业务影响后再操作。  
  
各发行版内核更新下发后，升级并重启恢复正常加载：  
```
# Ubuntu / Debian
apt update && apt upgrade linux-image-$(uname -r)

# RHEL / CentOS / AlmaLinux / Fedora
dnf update kernel
```  
  
  
**参考链接**  
  
  
- https://github.com/V4bel/dirtyfrag  
  
- https://git.kernel.org/pub/scm/linux/kernel/git/netdev/net.git/commit/?id=f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4  
  
- https://lore.kernel.org/all/afLDKSvAvMwGh7Fy@v4bel/  
  
- https://lore.kernel.org/all/20260504073403.38854-1-h3xrabbit@gmail.com/  
  
- https://lore.kernel.org/all/afKV2zGR6rrelPC7@v4bel/  
  
- https://dirtypipe.cm4all.com/  
  
- https://copy.fail/  
  
  
  
  
  
  
  
**部分典型客户**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RibBgJR6rjzdNsgfZZr0E7iaYwDy0ZSwnN37Q4QNiavcrWeZIKlgaZZyhkRuVdhA1qvZgSo4XtwY8SLMQT7C2JGuA5uywl85ZaibHaWNVSpickrY/640?wx_fmt=png&from=appmsg "")  
  
  
**七大产品矩阵**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RibBgJR6rjzc96vgf8Fp7CKacaXUuF5er43NyWaGnxf0vibw3zUHSicWOdrjxnnueSWps2ypCxnzSqMkz9fUAKD0LB0cp9fvibKdNvRKo6JVuKE/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
