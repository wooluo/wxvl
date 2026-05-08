#  【立即修复】Dirty Frag 漏洞已公开 EXP！一条命令阻断攻击路径  
 长亭安全观察   2026-05-08 10:25  
  
![头图for长亭科技.gif](https://mmbiz.qpic.cn/mmbiz_gif/uX9TOlqibIRvQJTSh9JYRBKubfhNXMjuTfk0Lib5njebianC6Jp1Ia7SvBNYNTHibBmiaGUicA5npnEmVgF5tymU3RUGPHp1l952xhVO9smy86xrc/640?from=appmsg "")  
  
  
**漏洞已公开，**  
**EXP****可直接下****载！ 即使你已经打过 Copy Fail 补丁，系统仍然可能被攻陷。**  
  
  
2026年5月7日，一个足以让全球 Linux 管理员失眠的漏洞突然曝出。  
  
  
Linux 是目前全球服务器、云计算、容器环境中使用最广泛的操作系统内核，绝大多数主流 Linux 发行版（Ubuntu、Debian、RHEL、Amazon Linux、SUSE、Arch、Fedora 等）均基于其构建。  
  
  
**而曝出的****Dirty Frag****漏洞**  
——通过链式利用两个独立的页缓存写入原语，使本地普通用户可**无条件**  
提权至 root。更严重的是：**即使已部署****Copy Fail****官方补丁，系统仍受****Dirty Frag****影响。**  
  
  
这意味着即使打了补丁，攻击者依然能用同样的思路撕开你的防线。  
  
  
**立即行动**  
：请先翻到文章末尾查看临时缓解方案，用一条命令阻断攻击路径。  
  
  
  
**这个漏洞是什么？**  
  
Dirty Frag 包含两个独立触发的漏洞原语，攻击目标都是 Linux 内核的**页缓存（****Page Cache****）**  
。  
  
  
页缓存相当于餐厅的“备餐台”。热门数据被临时放在这里，客人需要时直接端走，省得每次都去后厨（存储）取。  
  
  
问题出在**零拷贝发送路径**  
：内核想把数据从“备餐台”直接发给客人，通过   
splice()  
把数据页放入网络数据包的“餐盒”（skb）里。攻击者只有一个“餐盒”的**查看权**  
（读权限），却能污染里面的食物（页缓存数据）。当其他程序读取这个被污染的“食物”时，内核会误以为这是合法指令并执行，从而完成权限提升。  
  
  
  
**和 Dirty Pipe、Copy Fail 有什么区别？**  
  
三者同属  
**页缓存污染漏洞家族**  
，但攻击的目标不同：  
  
  
• **Dirty Pipe / Copy Fail：**  
污染   
struct pipe_buffer。  
  
• **Dirty Frag**  
：污染   
struct sk_buff  
的 frag 槽，**即使在打上****Copy Fail****补丁后依然有效。**  
  
  
  
**危害比 Dirty Cow 更严重**  
  
传统竞态条件漏洞（如 Dirty Cow）需要“碰运气”，在正确的时间窗口内完成攻击，失败可能导致系统崩溃。  
  
  
**Dirty Frag****是纯逻辑漏洞**  
，无需时序窗口，首次尝试就能成功，成功率接近 100%。  
  
  
  
**影响范围**  
<table><tbody><tr><td style="background: #f2f2f2;border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><strong><span leaf="">漏洞变体</span></strong></span></p></td><td style="background: #f2f2f2;border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><strong><span leaf="">引入时间</span></strong></span></p></td><td style="background: #f2f2f2;border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><strong><span leaf="">受影响范围</span></strong></span></p></td></tr><tr><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><span leaf="">xfrm-ESP Page-Cache Write</span></span></p></td><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><span leaf="">2017 年 1 月</span></span></p></td><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><strong><span leaf="">2017 </span></strong><strong><span leaf="">年至今所有内核版本</span></strong></span></p></td></tr><tr><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><span leaf="">RxRPC Page-Cache Write</span></span></p></td><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><span leaf="">2023 年 6 月</span></span></p></td><td style="border: 1px solid #000000;padding:5px 10px;"><p style="text-align:left;widows: 2;orphans: 2;line-height: 1.75;margin-left: 0px;margin-right: 0px;"><span style="font-size: 15px;letter-spacing: 0px;"><span leaf="">2023 年至今所有内核版本</span></span></p></td></tr></tbody></table>  
  
  
**覆盖所有主流发行版**  
：Ubuntu、Debian、RHEL、CentOS、AlmaLinux、openSUSE、Fedora、Arch、Rocky、Oracle Linux……无一幸免。  
###   
###   
  
**场景示例**  
  
**场景****1****：云服务器沦陷**  
  
你在云平台上买了一台 VPS，以为"租户隔离"保护着你。但 Dirty Frag 让你只需几秒钟，就能从普通用户变成这台服务器的 root——然后你可以读写其他租户的数据。  
  
  
**场景****2****：容器逃逸**  
  
你在 K8s 集群里跑着微服务，容器之间"隔离"让你安心。但页缓存是宿主机共享的！容器内的攻击者可以穿透容器边界，拿到宿主机的 root，整台节点上的所有租户都暴露了。  
  
  
**场景****3****：****CI/CD****沦为肉鸡**  
  
你的 GitHub Actions 自动跑着 PR 测试？攻击者提交一个恶意 PR，几秒钟后你的 Runner 宿主机就变成他的了——然后他可以用你的计算资源挖矿、攻击其他目标，法律风险由你承担。  
  
##   
  
**如何修复？**  
  
临时缓解方案（立即执行）  
  
  
  
禁用三个内核模块可同时阻断两个漏洞变体的利用路径：  
  
**// bash**  
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"  
  
  
  
  
禁用影响评估  
  
  
  
**不影响**  
：普通 TCP/UDP   
应用、TLS、SSH、HTTP(S) 服务、dm-crypt/LUKS 磁盘加密、kTLS——这些均不依赖 esp4/esp6/rxrpc模块。  
  
  
**可能影响**  
：IPsec/ESP   
隧道（VPN）、Andrew File System（AFS）相关服务。执行前请确认系统是否使用上述功能（lsmod | grep -E 'esp4|esp6|rxrpc'）。  
###   
  
升级修复方案（补丁推送后执行）  
  
  
  
上游补丁已提交，各发行版正在陆续回溯。补丁发布后，请尽快执行升级。  
  
  
  
**安全建议**  
  
**立即排查：**  
检查你的 Linux 服务器/主机是否运行受影响的内核版本  
  
**立即缓解：**  
参考本文的临时缓解方案，禁用相关内核模块  
  
**持续关注：**  
密切跟踪系统供应商（Ubuntu/RHEL/Debian 等）发布的安全更新  
  
  
**日常建议：**  
  
◦ 遵循最小权限原则  
  
◦ 避免以 root 权限运行未知程序  
  
◦ 限制普通用户的危险系统操作权限  
  
  
  
  
