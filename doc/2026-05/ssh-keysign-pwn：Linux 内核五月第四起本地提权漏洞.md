#  ssh-keysign-pwn：Linux 内核五月第四起本地提权漏洞  
原创 Night Walker
                    Night Walker  黑白之道   2026-05-17 00:04  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617500&idx=1&sn=73c0634d23ef9a5a7ca009cf0e3b1929&scene=21#wechat_redirect)  
> **导语**  
：你有一台Linux服务器，上面有一个普通用户账号。你没有root密码，也没有sudo权限。但你知道这台服务器上跑着SSH服务。现在的问题是：你能不能拿到SSH主机私钥？能不能读到/etc/shadow里所有用户的密码哈希？  
>   
  
  
> 答案是：能。  
  
  
而且不需要你做什么特别的事情，只需要在同一个用户下面启动一个普通进程，和一个特权进程"赛跑"——比赛的对象是一个微秒级的竞态窗口。这就是CVE-2026-46333，代号ssh-keysign-pwn。它是2026年5月曝出的第四起Linux内核本地提权漏洞，也是潜藏时间最长的一起：从2020年10月就被安全研究员标记，直到2026年5月14日林纳斯·托瓦兹（Linus Torvalds）推送补丁，整整6年。 补丁推送后数小时，攻击者_SiCk就放出了两个可直接运行的exploit：一个偷SSH私钥，一个偷密码文件。所有主流发行版无一幸免。而且不需要你做什么特别的事情，只需要在同一个用户下面启动一个普通进程，和一个特权进程"赛跑"——比赛的对象是一个微秒级的竞态窗口。这就是CVE-2026-46333，代号ssh-keysign-pwn。它是2026年5月曝出的第四起Linux内核本地提权漏洞，也是潜藏时间最长的一起：从2020年10月就被安全研究员标记，直到2026年5月14日林纳斯·托瓦兹（Linus Torvalds）推送补丁，整整6年。 补丁推送后数小时，攻击者_SiCk就放出了两个可直接运行的exploit：一个偷SSH私钥，一个偷密码文件。所有主流发行版无一幸免。  
  
## 五分钟理解 ssh-keysign-pwn（新手必读）  
### 核心逻辑（一句话版本）  
  
Linux内核在进程退出时，有一段"清理内存但还没关文件"的极短窗口，同账号的普通进程可以趁这个窗口把特权进程打开的文件"偷"走。  
### 类比理解  
  
想象一家银行金库（特权进程）在关门下班（退出）。保安先把保险柜锁好（清空内存映射），但还没来得及把金库大门关上（关闭文件描述符）。就在这短短几微秒内，外面一个和你同一层楼的普通员工（同UID进程），通过一个小工具（pidfd_getfd系统调用），伸手把金库里已经打开的一个保险柜抽屉（文件描述符）拖了出来——而这个抽屉里装的就是SSH私钥。  
  
金库的门确实关上了，内存确实清空了，但那个抽屉已经被拖到外面了。  
### 能达到什么效果？  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">攻击目标</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">能拿到什么</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">危害等级</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">ssh-keysign程序</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/etc/ssh/ssh_host_*_key（SSH主机私钥）</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">🔴 极高</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">chage程序</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/etc/shadow（系统密码哈希文件）</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">🔴 极高</span></section></td></tr></tbody></table>  
拿到SSH主机私钥意味着什么？你可以伪装成这台服务器向所有连接它的客户端发起中间人攻击——客户端会信任你的"假服务器"，毫无察觉。拿到/etc/shadow意味着什么？所有用户的密码哈希都在你手里，可以离线暴力破解。  
### 谁受影响？  
  
2026年5月14日之前的所有Linux内核版本。包括Ubuntu、Debian、Arch、CentOS、Raspberry Pi OS等所有主流发行版。红帽（Red Hat）官方确认RHEL 8/9/10均受影响。  
## 名词速查表  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">术语</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">英文原文</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">中文解释</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">本地提权</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Local Privilege Escalation (LPE)</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">攻击者以普通用户身份登录系统，通过漏洞获取root权限。不需要远程入侵，只需要一个本地账号。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">竞态条件</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Race Condition</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">两个或多个进程对共享资源的访问顺序不确定，导致结果依赖于谁先到达。就像两个司机同时抢一个停车位，结果取决于谁更快。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">文件描述符</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">File Descriptor (FD)</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">操作系统内核为每个打开的文件分配的一个数字编号。程序通过这个编号读写文件，就像用钥匙开门。偷走文件描述符=偷走钥匙。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">ptrace</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">ptrace</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux内核提供的一个系统调用，允许一个进程&#34;跟踪&#34;另一个进程——读取它的内存、寄存器、系统调用等。调试器（gdb）底层就是用ptrace。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">pidfd_getfd</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">pidfd_getfd</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 5.3引入的一个系统调用，允许一个进程从另一个进程&#34;借&#34;走它打开的文件描述符。本身是合法功能，但被攻击者利用。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">do_exit()</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">do_exit()</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux内核中进程退出的核心函数。当一个程序结束时，内核调用它来清理这个进程的所有资源。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">exit_mm()</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">exit_mm()</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">do_exit()内部的第一步：释放进程的内存映射。完成后进程的mm指针变为NULL。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">exit_files()</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">exit_files()</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">do_exit()内部的后续步骤：关闭进程打开的所有文件描述符。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">UID</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">User Identifier</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">用户ID，操作系统用来区分不同用户的数字编号。同UID=同一个用户账号。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">SSH</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Secure Shell</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">远程登录协议，几乎所有的Linux服务器都用SSH管理。SSH主机私钥是服务器身份的核心凭证。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">SSH主机私钥</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">SSH Host Private Key</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">存储在/etc/ssh/ssh_host_*_key的文件，服务器用它证明自己的身份。拿到这个密钥=可以冒充服务器。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">/etc/shadow</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">/etc/shadow</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux系统中存储所有用户密码哈希的文件，只有root能读取。拿到这个文件=可以离线破解所有用户密码。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">dumpable</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">dumpable</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux进程的一个属性标记，表示该进程的内存是否可以被ptrace读取。是ptrace安全检查的关键依据。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">CAP_SYS_PTRACE</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CAP_SYS_PTRACE</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux能力（Capability），拥有此能力的进程可以ptrace任意进程。root默认拥有此能力。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Linus Torvalds</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linus Torvalds</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux内核的创始人和首席维护者，个人推送补丁修复漏洞。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Qualys</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Qualys</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">美国网络安全公司，负责报告这个漏洞。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">_SiCk</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">_SiCk</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">安全研究员，在补丁发布后数小时内放出了两个公开exploit。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Jann Horn</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Jann Horn</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">谷歌零号项目（Google Project Zero）安全研究员，2020年10月就发现了同类问题模式，但当时未被修复。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">AlmaLinux</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">AlmaLinux</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">红帽企业版Linux（RHEL）的免费社区替代发行版，第一个发布安全公告的发行版。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">Yama</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Yama</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux内核的Linux安全模块（LSM），负责ptrace访问控制。ptrace_scope是它的核心配置参数。</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><strong><span leaf="">TOCTOU</span></strong></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Time-of-Check-Time-of-Use</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">&#34;检查时和使用时&#34;之间的时间差漏洞。检查时的状态和使用时的状态不一样了，就是TOCTOU。ssh-keysign-pwn本质上是一种TOCTOU变体。</span></section></td></tr></tbody></table>## 第一章：漏洞原理详解  
### 从进程退出说起  
  
要理解ssh-keysign-pwn，需要先理解Linux内核在进程退出时做了什么。当一个程序结束时，内核的do_exit()函数会按顺序清理这个进程的所有资源——内存、文件、信号处理器等。  
  
关键的问题是：**清理的顺序是什么？**  
  
答案是：  
1. 先执行exit_mm()——释放进程的内存映射  
  
1. 后执行exit_files()——关闭进程打开的文件描述符  
  
这两个步骤之间，存在一个极短的时间窗口——在这个窗口内，进程的内存已经没了（mm == NULL），但文件描述符还开着。内核的安全检查代码__ptrace_may_access()在这个窗口内会跳过本应执行的dumpable检查，因为mm已经为空，检查条件不成立。  
  
这就是漏洞的根源。  
### 攻击如何利用这个窗口  
  
攻击者利用pidfd_getfd(2)系统调用，从这个正在退出的特权进程中"偷走"文件描述符。  
  
流程是这样的：  
1. 攻击者（普通用户，与目标进程同UID）观察系统，找到即将退出的特权进程  
  
1. 在exit_mm()执行后、exit_files()执行前这微秒级的窗口内  
  
1. 调用pidfd_getfd()，从那个正在退出的进程那里拿到打开的文件描述符  
  
1. 这个文件描述符指向的文件——原本只有root才能读取——现在被攻击者握在了手里  
  
### ssh-keysign为什么中招  
  
sshd（SSH守护进程）在启动时，会派生一个叫做ssh-keysign的辅助进程。这个进程的职责是在SSH密钥交换时签名数据。但它有一个关键的操作顺序：  
1. 打开SSH主机私钥（/etc/ssh/ssh_host_rsa_key等）  
  
1. 调用permanently_set_uid()，把自己的权限降到普通用户  
  
1. 正常退出  
  
问题在于第1步和第2步之间——私钥已经打开了，但权限还没降。如果攻击者能在ssh-keysign退出的瞬间抢到那个文件描述符，就拿到了主机私钥。  
  
chage命令（用来查看/修改用户密码过期时间）的行为类似——它先以root身份打开/etc/shadow，然后降权。攻击者抢到那个文件描述符，就拿到了密码哈希文件。  
### 漏洞为什么藏了6年  
  
2020年10月，Jann Horn（谷歌零号项目研究员）就在内核邮件列表上指出了这个"exit_mm() 早于 exit_files() 导致fd可被窃取"的问题模式。但当时没有被当作独立的安全漏洞修复，只被当作一个代码质量问题。  
  
6年后，Qualys把它变成了一个可武器化的exploit，林纳斯才意识到这个模式确实是一个独立漏洞。补丁的改动很小——确保即使mm为NULL，也通过缓存的"最后dumpable标记"或CAP_SYS_PTRACE能力来执行检查。林纳斯自己说这是"稍微理智一点的"（slightly saner）逻辑。  
  
但"小改动"不等于"小影响"。  
## 第二章：五月四连击——Linux内核进入高危期  
  
2026年5月，Linux内核以惊人的频率爆出本地提权漏洞。按时间顺序：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">次序</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">名称</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">CVE编号</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">发现者</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">披露日期</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第一击</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Copy Fail（复制失败）</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-31431</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Xint Code</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">4月29日</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第二击</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Dirty Frag（脏碎片）</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-43284 / CVE-2026-43500</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Hyunwoo Kim</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">5月7日</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第三击</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Fragnesia</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-46300</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">William Bowling</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">5月13日</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">第四击</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">ssh-keysign-pwn</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">CVE-2026-46333</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Qualys</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">5月14日</span></section></td></tr></tbody></table>  
Fragnesia和ssh-keysign-pwn的补丁是同一天推送的（5月14日），均由林纳斯·托瓦兹合并到主线内核。阿尔玛Linux（AlmaLinux）官方博客在5月15日的安全综述中写道："如果你在家里数数的话，这是我们在大约两周内写的第四篇本地root级Linux内核漏洞披露博客。 AlmaLinux构建服务器和核心团队都快要有危险津贴了。"  
### 为什么集中在5月？  
  
这不是巧合。Copy Fail和Dirty Frag的补丁修复了内核加密子系统的问题，而Fragnesia正是Dirty Frag补丁意外激活的——Dirty Frag的修复没有处理干净一个边缘情况，导致XFRM/ESP子系统出现新的竞态窗口。  
  
内核维护者在一次修复中引入新漏洞，这在大型复杂代码库中并不罕见。但在5月这个时间节点，多个研究团队同时在深挖内核，旧问题被新补丁重新激活，新问题又被快速发现——形成了共振效应。  
## 第三章：exploit 实战演示  
### ssh-keysign-pwn：偷SSH私钥  
  
攻击者启动exploit程序，让它监控系统中即将退出的ssh-keysign进程。当ssh-keysign调用do_exit()退出时，exploit在exit_mm()和exit_files()之间的微秒级窗口内调用pidfd_getfd()。  
  
成功拿到文件描述符后，攻击者可以：  
- 读取/etc/ssh/ssh_host_rsa_key等主机私钥  
  
- 用这个私钥伪造SSH服务器，对连接该服务器的客户端发起中间人攻击  
  
- 客户端看到的指纹与真实服务器一致，完全无法察觉  
  
### chage_pwn：偷密码哈希  
  
原理完全相同，目标换成chage命令：  
1. 攻击者触发chage执行（例如通过at/cron或直接调用）  
  
1. chage以root身份打开/etc/shadow，然后降权退出  
  
1. 在退出窗口内抢到文件描述符  
  
1. 用hashcat或john离线破解密码哈希  
  
拿到/etc/shadow后，攻击者可以：  
- 离线暴力破解所有用户密码  
  
- 拿着破解的密码登录其他服务器  
  
- 横向移动到整个内网  
  
### _SiCk是谁？  
  
_SiCk是两个exploit的作者，也是之前打破Dirty Frag披露暂停期（embargo）的第三方研究员。AlmaLinux在博客中略带无奈地写道："感谢_SiCk的概念验证代码，让影响变得明确——即使他们的发布时间表并没有给发行版太多喘息空间。"  
## 第四章：修复与缓解  
### 主线修复  
  
林纳斯·托瓦兹于2026年5月14日推送修复commit，改进了__ptrace_may_access()中的dumpable检查逻辑。即使目标进程的mm为空，也会参考缓存的最后dumpable标记或要求CAP_SYS_PTRACE能力。  
  
各发行版已发布的修复内核版本：  
<table><thead><tr><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">发行版</span></section></th><th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;font-weight: bold;background-color: rgb(255, 249, 249);color: rgb(239, 112, 96);"><section><span leaf="">修复内核版本</span></section></th></tr></thead><tbody><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">AlmaLinux 8</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">kernel-4.18.0-553.124.4.el8_10</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">AlmaLinux 9</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">kernel-5.14.0-611.54.6.el9_7</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">AlmaLinux 10</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">kernel-6.12.0-124.56.5.el10_1</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 7.0.x</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 7.0.8</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 6.18.x</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 6.18.31</span></section></td></tr><tr><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 6.12.x</span></section></td><td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;border: 1px solid rgb(239, 112, 96);vertical-align: top;"><section><span leaf="">Linux 6.12.89</span></section></td></tr></tbody></table>### 临时缓解措施  
  
无法立即重启的系统，可以先收紧Yama的ptrace_scope配置：  
```
# 禁止所有ptrace attach（最严格，可能影响调试工具）sudo sysctl -w kernel.yama.ptrace_scope=3# 或只允许root进行ptrace（允许本地调试）sudo sysctl -w kernel.yama.ptrace_scope=2# 永久生效echo 'kernel.yama.ptrace_scope = 3' | sudo tee /etc/sysctl.d/99-ssh-keysign-pwn.conf
```  
  
ptrace_scope=3会完全禁止ptrace attach，可能会影响gdb等调试工具。如果需要在受影响机器上进行本地调试，使用2代替。  
### 检查你的系统是否受影响  
```
# 查看当前内核版本uname -r# 检查ptrace_scope当前值cat /proc/sys/kernel/yama/ptrace_scope# 检查是否有公开exploit相关进程在运行ps aux | grep -E 'sshkeysign|chage_pwn'
```  
## 尾声：这不是结束  
  
Qualys的报告、林纳斯的补丁、_SiCk的exploit——这条漏洞的生命周期已经完整走完。但它的意义不止于"又一个本地提权漏洞"。  
  
首先，它潜藏了6年。Jann Horn在2020年就指出了这个模式，但没有被重视。今天有多少类似的"已知模式"正在潜伏，等待有人把它变成武器？  
  
其次，它出现在五月。在Copy Fail、Dirty Frag、Fragnesia之后，第四个。当内核补丁自己制造新漏洞，当AI把exp开发压缩到30分钟，当披露窗口从90天变成0天——安全团队面对的不再是一个个孤立的CVE，而是一场持续的洪水。  
  
第三，它的攻击面极广。不需要特殊权限，不需要特殊硬件，只要一个普通用户账号，任何Linux服务器都在射程之内。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617065&idx=1&sn=1e30ce488590711587c29414a82b7ab8&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617222&idx=2&sn=a600c58c6ac251bf0313134ad70a4fd8&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
