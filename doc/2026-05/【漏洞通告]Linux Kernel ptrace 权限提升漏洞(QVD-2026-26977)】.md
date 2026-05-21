#  【漏洞通告]Linux Kernel ptrace 权限提升漏洞(QVD-2026-26977)】  
 安迈信科应急响应中心   2026-05-21 01:41  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tdibEPWdubQUgErMslSgzVibGKdSFkWPTbTgu83UTXdNYm7eOxRSmuNmOjUIxdicy73wTLufCMnbs6CAsc3uicJUcg/640?wx_fmt=png "")  
### 01 漏洞概况      该漏洞核心在于ptrace_may_access()在目标进程内存映射为空（task->mm == NULL）时会跳过关键的 dumpable 安全检查；进程退出时先调用exit_mm()清空内存映射、再调用exit_files()关闭文件描述符，这一顺序形成高危竞争窗口，同 UID 攻击者可通过pidfd_getfd()窃取进程退出瞬间仍持有的打开文件描述符。02 漏洞处置综合处置优先级：高漏洞信息漏洞名称 Linux Kernel ptrace 权限提升漏洞漏洞编号CVE编号无‍漏洞评估披露时间2026-05-15漏洞类型本地权限提升危害评级高危公开程度PoC已公开威胁类型本地利用情报在野利用未发现影响产品产品名称Linux Kernel受影响版本commit <31e62c2ebbfdc3fe3dbdf5e02c92a9dc67087a3a影响范围广有无修复补丁有  
### 03 漏洞排查      用户应尽快排查服务器操作系统内核版本是否受影响，可通过执行 uname -r 命令查看内核版本，若当前版本低于安全版本（Linux Kernel 5.10 系列 < 5.10.256、5.15 系列 < 5.15.207、6.1 系列 < 6.1.173、6.6 系列 < 6.6.139、6.12 系列 < 6.12.89、6.18 系列 < 6.18.31、7.0 系列 < 7.0.8），则极大可能会受到影响，需及时进行修复。04 修复方案当前官方已发布最新版本，建议受影响的用户及时更新升级到最新版本。链接如下：https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=31e62c2ebbfdc3fe3dbdf5e02c92a9dc67087a3a05 时间线      2026.05.14 厂商发布安全补丁      2026.05.16 安迈信科安全运营团队发布通告   关于安迈信科西安安迈信科科技有限公司以“数字化可管理”为核心理念，坚持DevOps自主研发，创新打造“能力聚合、流程闭环、持续赋能”的综合性网络数据安全平台与运营服务。公司从古城西安出发，已在全国范围内为政府、运营商、电力、能源等行业客户提供了高质量的安全保障，并将继续为我国数字化转型和发展贡献力量。智 慧 . 至 简 . 致 诚  
  
  
