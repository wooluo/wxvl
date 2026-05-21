#  【漏洞通告】Linux Kernel PinTheft 权限提升漏洞  
深瞳漏洞实验室
                    深瞳漏洞实验室  深信服千里目安全技术中心   2026-05-21 09:54  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/APc6NwjLsxRmnDjjEb6PTYR0ptnf3Wc1e7NXHYEicMOxTwxfdg5Xz29Vth65czfKSdX0ibdFbuFTRrdK4iaRHw17ANRMttamNmxibbpo1qHC54U/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞名称：**  
  
Linux Kernel PinTheft 权限提升漏洞(SF_2026_16445)  
  
**组件名称：**  
  
Linux Kernel  
  
**影响范围：**  
  
启用 CONFIG_RDS、CONFIG_RDS_TCP 和 CONFIG_IO_URING 配置，且 io_uring_disabled=0、RDS/RDS_TCP 模块可用或可自动加载的 Linux 内核版本。  
  
**漏洞类型：**  
  
权限提升  
  
**利用条件：**  
  
1、用户认证：需要用户认证  
  
2、前置条件：  
  
① 启用了 CONFIG_RDS、CONFIG_RDS_TCP、CONFIG_IO_URING  
  
② io_uring_disabled=0  
  
③ RDS/RDS_TCP 模块存在并可用或可被自动加载  
  
④ 系统存在可读的 SUID-root 二进制程序  
  
3、触发方式：本地  
  
**综合评价：**  
  
<综合评定利用难度>：中等，需要本地低权限执行条件。  
  
<综合评定威胁等级>：高危，可提升至root权限。  
  
**官方解决方案：**  
  
已发布  
  
  
  
  
**漏洞分析**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/APc6NwjLsxRQEmNQfvianjdo8AIEJbYNxe74gGhPw1g1DSZgVJ0hh56cMYjLdeFVytBH9icNaC5DjiaibTUicQ7oIAXoOxZ09RUddu1lQH24ZicOw/640?wx_fmt=gif&from=appmsg "")  
  
组件介绍  
  
Linux内核（Linux Kernel）是一个开源的操作系统内核，它是Linux操作系统的核心组件，负责管理计算机的硬件资源，并提供了许多系统服务，如进程管理、内存管理、文件系统管理和设备驱动程序等。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/APc6NwjLsxTfNLXXUDGibIxnMVIOs273Ht9qnDBjgn9liaCLCtMrq2AAs0utezbYEB4UDnPqibWvhh6sZ46WYjDrd5iblpacIb6uFPibwasGxoYM/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞描述**  
  
  
2026年5月20日，深瞳漏洞实验室监测到一则Linux Kernel组件存在权限提升漏洞的信息，漏洞威胁等级：高危。  
  
  
Linux Kernel PinTheft 是 RDS 零拷贝发送机制中的本地权限提升漏洞。漏洞出现在用户页锁定与错误回收流程中，当页面处理过程中发生异常时，内核可能对已锁定页面执行异常的引用计数释放，同时相关零拷贝状态未被正确清理，导致页面引用计数失衡。**低权限本地用户可配合 io_uring 固定缓冲区机制扩大该问题影响，进一步实现页缓存篡改，并可能通过修改 SUID-root 程序内容植入载荷，最终提升至 root 权限。该漏洞利用依赖 RDS/RDS_TCP 模块可用性，默认允许相关模块加载的发行版风险更高。**  
  
  
  
  
**影响范围**  
  
目前受影响的Linux Kernel版本：  
  
启用 CONFIG_RDS、CONFIG_RDS_TCP 和 CONFIG_IO_URING 配置，且 io_uring_disabled=0、RDS/RDS_TCP 模块可用或可自动加载的 Linux 内核版本。  
  
检查方法：  
  
①检查内核是否启用 RDS、RDS_TCP 和 IO_URING  
  
grep -E 'CONFIG_(RDS|RDS_TCP|IO_URING)=' /boot/config-$(uname -r) 2>/dev/null || zgrep -E 'CONFIG_(RDS|RDS_TCP|IO_URING)=' /proc/config.gz 2>/dev/null  
  
如果出现  
  
CONFIG_RDS=m或者y  
  
CONFIG_RDS_TCP=m或者y  
  
CONFIG_IO_URING=y  
  
证明系统满足漏洞所需的核心内核配置条件  
  
cat /proc/sys/kernel/io_uring_disabled  
  
②检查 io_uring 是否开启  
  
cat /proc/sys/kernel/io_uring_disabled  
  
如果出现0，即可证明当前系统未禁用 io_uring  
  
③检查 RDS/RDS_TCP 模块是否可加载  
  
modprobe -n -v rds; modprobe -n -v rds_tcp  
  
如果可正常加载模块，即可证明 RDS/RDS_TCP 模块未被有效禁用  
  
④检查系统是否存在可读 SUID-root 程序  
  
find /usr/bin /bin /usr/sbin /sbin -maxdepth 1 -type f -perm -4000 -readable -print 2>/dev/null  
  
如果输出对应路径，即可证明系统存在可读 SUID-root 目标程序。  
  
  
  
**解决方案**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/APc6NwjLsxRS4tyvxia8FgHgLkQicKuSFoOgbKHiaYLmlibhdIpAVD1dz94Eicvoxe2IF3Qj7vOfAhsG6SpukKMOC77FCpfywZtP5ciaAfCA555E0/640?wx_fmt=gif&from=appmsg "")  
  
**官方修复建议**  
  
  
目前官方已有可更新版本，建议尽快将 Linux 内核升级至包含修复补丁的版本。   
  
下载地址：  
  
https://lore.kernel.org/netdev/20260505234336.2132721-1-achender@kernel.org/  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/APc6NwjLsxTJMhjfkmX7U5wE6MYCRmpr2JPA8X0Q88LyMWpvRnrYQ70pXkA2Y2go66PiaeXzOob5UWSc020b0OOZuoNOXmu9W3laxdfRdy5A/640?wx_fmt=gif&from=appmsg "")  
  
**临时修复建议**  
  
  
如果业务不需要 RDS 功能，建议卸载并禁用 RDS 模块：  
  
rmmod rds_tcp rdsprintf 'install rds /bin/false\ninstall rds_tcp /bin/false\n' > /etc/modprobe.d/pintheft.conf  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/APc6NwjLsxS6k9kQTKHluJgg7EEwica5ajDtDX8NsBOwaat6oxTlOUdcHV819ntPOagWPXme13I2zCHDGR1COQB5ZprXZMfib6MnHiaqmQLVtY/640?wx_fmt=gif&from=appmsg "")  
  
**深信服解决方案**  
  
  
**漏洞主动检测**  
  
支持对Linux Kernel PinTheft 权限提升漏洞(SF_2026_16445)的主动检测，**可批量快速检出业务场景中是否存在漏洞风险，**  
相关产品如下：  
  
**【深信服云镜YJ】**  
预计2026年05月30日发布检测方案，规则ID:SF-2026-00917。  
  
**【深信服可拓展检测响应平台XDR】**  
预计2026年05月30日发布检测方案（需要具备云镜组件能力），规则ID:SF-2026-00917。  
  
  
  
参考链接  
  
  
https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-42897  
  
  
  
时间轴  
  
  
  
**2026/05/20**  
  
深瞳漏洞实验室监测到Linux Kernel PinTheft 权限提升漏洞信息。  
  
  
  
**2026/05/21**  
  
深瞳漏洞实验室发布漏洞通告。  
  
  
点击**阅读原文**  
，及时关注并登录深信服**智安全平台**  
，可轻松查询漏洞相关解决方案。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/APc6NwjLsxSOIIbonicR694f7HMR6Q07yosIUft6kRrLhze74eQMxEvOEECBIzicLsDtL0dyymDsmMr3h6eVoibSpiabaH1FMiczuOURSYvXl4Tk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/w8NHw6tcQ5zvcIHbwGGYKbqDVYsVKzNNia1jYtHf49C7133AlDXAgex2W4lFvpia56tjQQDkiauNBrl08YbxqG01A/640?wx_fmt=jpeg&from=appmsg "")  
  
  
