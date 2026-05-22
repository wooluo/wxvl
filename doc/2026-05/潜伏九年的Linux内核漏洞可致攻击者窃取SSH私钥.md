#  潜伏九年的Linux内核漏洞可致攻击者窃取SSH私钥  
 FreeBuf   2026-05-22 11:52  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/icBE3OpK1IX0yrwoaQmibiaOjdqNgDU2RSbAY8ZsqPWOanQ9uMXoliaibx0a9O2YeUibgZqibkZaZWLMve8lMIaRQHTfUnZPOAkSWap5cDoqII7III/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX1sj4M2NdiaxF8499aMoS1ulU0zQ7frBSwDaWdTKiblEgZupSmTAk9BuGahJvXtWcCAEu5y1R2W2rFCpy6vFcEBLZutvuQZjgsTI/640?wx_fmt=jpeg "")  
  
  
在零窗口期成为常态的今天，"更快打补丁"或"更好打补丁"已不足够。安全团队需要基于**预设失陷模型（assume-breach model）**的新策略：默认入侵必然发生，关键在于实时检测和快速遏制。这些防御动作都需在网络层面即时完成。  
  
  
**Part01**  
## 预设失陷模型的三大实施要素  
##   
  
新披露的Linux内核漏洞（CVE-2026-46333）暴露了一个存在近九年未被发现的本地提权缺陷。Qualys威胁研究团队(TRU)发现，该漏洞允许攻击者窃取SSH私钥等敏感数据，并在受影响系统上以root权限执行任意命令。  
  
  
**Part02**  
## 技术原理  
  
  
该漏洞位于Linux内核的__ptrace_may_access()函数中，该函数负责控  
制  
进程间的相互检查与交互。由于Linux内核4.10-rc1版本(2016年11月)引入的逻辑错误，该函数会在特权进程短暂丢弃凭证的窗口期错误地允许访问。  
  
  
攻击者通过结合该竞争条件与pidfd_getfd()系统调用，可从特权进程复制文件描述符并在非特权上下文中重用，从而绕过标准权限检查访问敏感资源。  
  
  
Part  
03  
  
影响范围  
  
Qualys验证了该漏洞在多个主流Linux发行版中的可靠利用，包括：  
  
- Debian 13  
  
- Ubuntu 24.04/26.04  
  
- Fedora 43/44  
  
确认存在四种实际攻击场景：  
- ssh-keysign：窃取/etc/ssh/目录下的SSH主机私钥  
  
- change：泄露/etc/shadow中的密码哈希  
  
- pkexec：以root权限执行任意命令  
  
- accounts-daemon：通过D-Bus交互实现提权  
  
Part  
04  
  
漏洞根源  
  
漏洞源于__ptrace_may_access()对"dumpable"状态处理不当。当目标进程退出且其内存描述符(mm)变为NULL时，内核会跳过关键安全检查，转而依赖YAMA Linux安全模块进行访问控制。  
  
  
在默认kernel.yama.ptrace_scope=1配置下，若攻击者是父进程（常见利用场景），YAMA会允许访问。将ptrace_scope设为2可强制要求CAP_SYS_PTRACE权限，有效阻断攻击路径。  
  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX3AHqTQacAAXAqbWRFUMg3K1CYiaIHQqVCbnlmiaTHhqZOq8Xjgd6KOW2NdxzxOBDc7wBXTFibfSM7XrM4Pe9j4eHfrRakr1mpiao4/640?wx_fmt=jpeg&from=appmsg "")  
  
  
Part  
05  
  
修复建议  
  
上游补丁已于2026年5月14日发布，主要发行版包括Debian、Fedora、Red Hat等均已推出安全更新。建议管理员：  
  
- 立即应用最新内核更新  
  
- 轮换可能暴露系统的SSH主机密钥和敏感凭证  
  
- 审计系统是否存在未授权提权活动  
  
临时缓解措施可设置：  
  
- kernel.yama.ptrace_scope=2  
  
但该设置可能影响gdb、strace等调试工具及部分容器/崩溃报告工作流。鉴于公开利用代码已出现且漏洞影响近十年的Linux系统，（CVE-2026-46333）对企业与云环境构成需立即处置的重大风险。  
  
参考来源：  
  
Nine-year-old Linux Kernel Vulnerability Let Attackers Exfiltrate SSH Private Keys  
  
https://cybersecuritynews.com/nine-year-old-linux-kernel-vulnerability/  
  
****  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651338385&idx=1&sn=a442efc5bf8726e3e4239bc246e2976b&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![扫码加入AI安全交流群](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX36icYI2CXicl9uUy5fmKHIdxgDmJcibjNUK1s23sY1GnkeibMK4Dk6OcCtxdaTQL0pel4YNGX3RKhaeuS8mqdE6BibxkPKUDwQjBGE/640?wx_fmt=png "")  
  
![下载FreeBuf知识大陆APP](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX24jhTVobqv3Ooeu9m1BQAhaLDl8icW7ibmSG7VxdACficvxezGvuyRN5qlZ3UsB378ghMfkLUcAlsn7uFIBMRQkcVpD0ib3O31uvg/640?wx_fmt=png "")  
  
  
