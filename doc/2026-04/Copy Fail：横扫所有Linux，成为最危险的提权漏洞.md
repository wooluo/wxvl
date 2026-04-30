#  Copy Fail：横扫所有Linux，成为最危险的提权漏洞  
 数世咨询   2026-04-30 05:33  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/EqS9GE77r0ObDuLNiaxW7q7ptG21ibM4LW3MzFiaOTdxicnTjRhnd6ibvaV7f3KZURx7NfFCfeD2CAsGczabOmfY35ZtwWYOnhiasXG28xKO9TeNE/640?wx_fmt=png&from=appmsg#imgIndex=0 "")  
  
  
Linux 是目前全球服务器、云计算、容器环境中使用最广泛的操作系统内核，绝大多数主流 Linux 发行版（Ubuntu、Debian、RHEL、Amazon Linux、SUSE、Arch、Fedora 等）均基于其构建。  
  
  
2026 年 4 月 29 日，长亭安全应急响应中心监测到互联网公开披露了一个影响范围极广的Linux提权漏洞 CVE-2026-31431，命名为"Copy Fail"。该漏洞源于 Linux 内核加密子系统 authencesn  
模块中的一处逻辑缺陷，攻击者仅需本地普通用户权限，通过链式利用 AF_ALG 套接字与 splice()  
系统调用，即可向页缓存（page cache）写入任意内容，最终实现本地提权至 root。漏洞影响 2017 年至补丁发布前构建的几乎所有 Linux 内核版本，  
EXP 已公开  
，利用稳定性极高，建议受影响用户立即修复。  
  
  
**漏洞描述**  
  
   
Description  
   
  
  
  
**0****1**  
  
**漏洞成因**  
  
Linux 内核加密模块 authencesn  
在 2017 年引入了一处针对 AEAD（认证加密）操作的原地（in-place）优化，该优化导致在特定条件下，页缓存（page cache）中的只读页面可以被错误地放入可写目标散列表（scatterlist）。攻击者通过 AF_ALG 套接字暴露的内核加密 API，结合 splice()  
系统调用，利用上述逻辑缺陷实现对 setuid 二进制文件（如 /usr/bin/su  
）页缓存的 4 字节任意写入，从而篡改程序逻辑，获取 root shell。  
  
整个利用过程为  
直线逻辑  
，无需竞争窗口（race window），无需内核特定偏移，无需预装任何特殊工具。  
  
## 漏洞影响  
  
- 本地提权至 root  
：任意本地普通用户账户可无条件提权为 root。  
  
- 容器逃逸  
：Kubernetes / 容器环境中，页缓存为宿主机共享，容器内攻击者可突破容器边界，危及宿主节点及同节点其他租户。  
  
- CI/CD 环境沦陷  
：GitHub Actions、GitLab Runner、Jenkins Agent 等执行不可信代码的 CI 环境，攻击者可通过恶意 PR 直接获取 Runner 宿主机的 root 权限。  
  
- 云多租户环境  
：Notebook、Serverless、Agent 沙箱等执行用户代码的云服务，租户可提权为宿主机 root。  
  
- 漏洞持续近十年  
：问题代码于 2017 年引入，此后所有 Linux 发行版均受影响。  
  
  
  
  
  
**处置优先级：高**  
  
漏洞类型：  
权限提升  
  
**漏洞危害等级：**  
高  
  
**触发方式：**  
本地  
  
**权限认证要求：**  
普通用户权限  
  
**系统配置要求：**  
默认配置  
  
**用户交互要求：**  
无需用户交互  
  
**利用成熟度：**  
EXP 已公开  
，732 字节，100% 稳定复现  
  
**修复复杂度：**  
低，升级内核或临时禁用 algif_aead 模块  
  
  
  
  
  
**影响版本**  
  
   
Affects  
   
  
  
  
**02**  
```
```  
  
**解决方案**  
  
   
Solution  
   
  
  
  
**03**  
  
##   
  
## 升级修复方案  
  
  
升级至包含 mainline commit a664bf3d603d  
的内核版本，各主流发行版正在陆续发布修复版本：  
```
# Ubuntu / Debian
apt update && apt upgrade linux-image-$(uname -r)
# RHEL / CentOS / Rocky / Alma
dnf update kernel
# Amazon Linux
yum update kernel
# SUSE
zypper update kernel-default
```  
```

```  
  
升级后重启系统使新内核生效，并通过以下命令验证是否包含修复 commit：  
```
grep -r "a664bf3d603d" /proc/version 2>/dev/null || uname -r 
# 验证是否包含修复commit或对比发行版官方公告中的修复版本号
```  
  
  
## 临时缓解方案禁用 algif_aead内核模块可阻断漏洞利用路径：# 永久禁用（重启后生效）echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif.conf# 立即卸载（当前会话生效）rmmod algif_aead 2>/dev/null || true禁用 algif_aead 的影响评估：不影响：dm-crypt/LUKS、kTLS、IPsec/XFRM、OpenSSL/GnuTLS/NSS 默认构建、SSH、内核密钥环加密——这些组件直接使用内核加密 API，不经过 AF_ALG。可能影响：显式启用了 afalg引擎的 OpenSSL、部分嵌入式加密卸载路径、直接绑定 aead/skcipher/hash 套接字的应用。可通过 lsof | grep AF_ALG或 ss -xa检查当前系统是否有进程使用 AF_ALG。漏洞复现Reproduction                                       04时间线 Timeline 05时间事件2026 年 3 月 23 日漏洞报告至 Linux 内核安全团队2026 年 3 月 24 日内核安全团队确认收到2026 年 3 月 25 日补丁提出并完成审查2026 年 4 月 1 日修复 commit a664bf3d603d合入 mainline2026 年 4 月 22 日CVE-2026-31431 正式分配2026 年 4 月 29 日公开披露，EXP 同步发布2026 年 4 月 30 日长亭安全应急响应中心发布通告参考资料：[1].https://copy.fail/[2].https://github.com/theori-io/copy-fail-CVE-2026-31431  
  
  
**长亭应急响应服务**  
  
  
  
  
全力进行产品升级  
  
及时将风险提示预案发送给客户  
  
检测业务是否受到此次漏洞影响  
  
请联系长亭应急服务团队  
  
7*24小时，守护您的安全  
  
  
第一时间找到我们：  
  
邮箱：support@chaitin.com  
  
