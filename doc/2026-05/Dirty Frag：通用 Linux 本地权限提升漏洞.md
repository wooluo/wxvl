#  Dirty Frag：通用 Linux 本地权限提升漏洞  
 黑鸟略略略   2026-05-08 02:43  
  
Linux 新高危本地提权漏洞 Dirty Frag，属于 Dirty Pipe 家族衍生漏洞，影响 2017 年至今近九年的 Linux 内核版本，漏洞为纯逻辑缺陷、无需竞态条件、利用成功率百分百，普通本地无特权用户即可稳定提升至 root 权限。  
该漏洞包含 xfrm-ESP 和 RxRPC 两个可独立利用的子漏洞，前者依赖用户命名空间权限、覆盖 2017 年后所有内核，后者针对 2023 年 6 月之后内核且 Ubuntu 默认加载相关模块无需额外权限，漏洞核心原理是借助内核页缓存机制实现无写权限篡改只读文件内存副本，攻击者可利用该原语篡改 /etc/passwd、/etc/sudoers 等系统关键配置文件从而拿下最高权限。  
同时该漏洞不受此前 Copy Fail 漏洞缓解措施限制，目前暂无官方 CVE 编号和完整补丁，临时防护可通过黑名单禁用 esp4、esp6、rxrpc 内核模块、限制普通用户创建命名空间以及容器环境加固 seccomp 和 AppArmor 策略来降低风险。  
  
# 漏洞概述  
  
Dirty Frag 是由安全研究员 Hyunwoo Kim（@v4bel）首次发现并报告的全新 Linux 内核漏洞类别。它通过将xfrm-ESP Page-Cache Write 漏洞与RxRPC Page-Cache Write 漏洞链式利用，能够在主流 Linux 发行版上稳定获取 root 权限。  
  
该漏洞属于与 Dirty Pipe 和 Copy Fail 相同的 bug 类，但它是一种确定性逻辑漏洞，无需任何竞争条件（race condition）。即使利用失败，内核也不会崩溃，成功率极高。  
  
重要说明：目前该漏洞尚未有官方补丁或 CVE 编号（因披露流程被打破），研究者已与 linux-distros 维护者协商后公开了相关信息。  
# 漏洞核心特点  
- 高成功率：确定性逻辑漏洞，无竞争条件，利用失败不会导致内核崩溃  
  
- 跨发行版兼容：覆盖所有主流 Linux 发行版  
  
- 影响周期长：xfrm-ESP 漏洞有效存在时间长达约 9 年  
  
- 绕过现有缓解：不受 Copy Fail 漏洞的 algif_aead 模块黑名单缓解措施影响  
  
- 互补式利用链：两个漏洞相互弥补盲区，实现全场景覆盖  
  
# 受影响范围  
  
1. 内核版本影响  
- xfrm-ESP Page-Cache Write：影响范围从 2017 年 1 月 17 日的 commit cac2661c53f3 起，直至上游最新版本。  
  
- RxRPC Page-Cache Write：影响范围从 2023 年 6 月的 commit 2dc334f1a63a 起，直至上游最新版本。  
  
漏洞有效存在时间长达约 9 年。研究者已在以下主流发行版上成功测试：  
- Ubuntu 24.04.4（内核 6.17.0-23-generic）  
  
- RHEL 10.1（内核 6.12.0-124.49.1.el10_1.x86_64）  
  
- openSUSE Tumbleweed（内核 7.0.2-1-default）  
  
- CentOS Stream 10、AlmaLinux 10、Fedora 44 等  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/75jfFGfS1OTiaqKpTT6ZzXcSeLuaYibibDEUeAgEm8pfhWibj1wvAZ8R4YnB6phUN9ibzdkFgXs979fPScM7FZ1LEyqu44Cw1O1PzCfic9dKKG30g/640?wx_fmt=jpeg&from=appmsg "")  
# 缓解措施  
  
当前唯一可用方案：立即禁用相关内核模块（推荐所有受影响服务器立即执行）  
  
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"  
  
  
后续修复：待各发行版后续 backport 补丁后，请及时更新系统内核。  
# 常见问题解答（FAQ）  
  
Q1：为什么要把两个漏洞链起来使用？  
  
xfrm-ESP Page-Cache Write 提供了类似 Copy Fail 的强大任意 4 字节写入原语，但需要创建用户命名空间的权限（部分 Ubuntu 通过 AppArmor 限制）。而 RxRPC Page-Cache Write 不需要命名空间权限，却在多数发行版中默认不加载模块（仅 Ubuntu 默认加载）。二者相互弥补盲区，从而在所有主流发行版上都能可靠提权。  
  
Q2：又一个 "Dirty" 系列漏洞？  
  
是的，但这个名字最贴切 —— 它是 Dirty Pipe 的后代，核心是 "污染"（dirty）struct sk_buff 中的 frag 成员。  
  
Q3：与 Copy Fail 漏洞有什么关系？  
  
Copy Fail 是本次研究的直接起因。Dirty Frag 中的 xfrm-ESP 部分与 Copy Fail 使用相同的漏洞触发点，但它不受 algif_aead 模块黑名单缓解措施的影响。也就是说，即使你已经按照公开的 Copy Fail 缓解方案打了补丁，系统依然可能受到 Dirty Frag 的威胁。  
  
Q4：如何彻底修复？  
  
目前只能使用上述模块禁用方案。详细的技术细节、披露时间线及后续补丁信息，请参考研究者仓库中的技术文档（assets/write-up.md）。  
  
Dirty Frag 是近年来 Linux 内核中最具普适性的本地权限提升漏洞之一。其高成功率、无崩溃风险、跨发行版兼容性，以及长达 9 年的影响周期，使其成为运维人员和安全研究者必须立即关注的问题。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/75jfFGfS1OTVFkp8hFCytH8udRbP28YaiamibbIKeibo58Ux9JZ5vq6WVEYAyhMzj6HIgsZy9ibicfNVITtO1eOsibibzLfRr4cJEASicXwTOF5k2Qs/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/75jfFGfS1OTKXXeRcYxpXhyD7grcREgviaiauMiclhAoTgKMd6w1ECgIKonvtIbIkUXc5Pjpgz6HzVWUOl1rtwkkaqicx0vxd1lf00KDOsOKqibk/640?wx_fmt=jpeg&from=appmsg "")  
  
地址  
  
https://github.com/V4bel/dirtyfrag  
  
