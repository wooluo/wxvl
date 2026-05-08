#  全网紧急！Linux Dirty Frag漏洞POC已流出！  
原创 牛叫瘦
                    牛叫瘦  HACK之道   2026-05-08 06:36  
  
   
  
近日，Linux 内核曝出**高危本地提权漏洞 Dirty Frag（CVE-2026-31431）**  
。该漏洞源于 2017 年内核代码优化引入的逻辑缺陷，**2017 年后主流 Linux 发行版几乎全部受影响**  
，普通本地用户可通过简单代码稳定获取 root 权限，还存在容器逃逸风险，危害极大。本文从漏洞核心信息、原理、影响范围、利用条件、修复缓解方案五大维度，结合实际运维场景展开分析，为企业与个人用户提供精准处置参考。  
## 一、漏洞核心基础信息  
- • **漏洞名称**  
：Dirty Frag（脏碎片）  
  
- • **漏洞编号**  
：CVE-2026-31431  
  
- • **漏洞类型**  
：本地权限提升、容器逃逸  
  
- • **危害等级**  
：**高危（CVSS 7.8）**  
  
- • **核心成因**  
：2017 年内核优化代码导致AF\_ALG  
加密接口与splice  
系统调用链式调用时，只读文件页缓存被错误赋予可写权限  
  
- • **披露时间**  
：2026 年 4 月底（ embargo 提前破裂，补丁同步发布）  
  
- • **利用难度**  
：极低（稳定逻辑缺陷，非条件竞争，POC 已公开）  
  
## 二、漏洞原理：页缓存权限混淆的致命缺陷  
  
Dirty Frag 漏洞本质是**内核内存管理逻辑缺陷**  
，与 2022 年 DirtyPipe（CVE-2022-0847）、2016 年 DirtyCow（脏牛）漏洞同属 “页缓存权限绕过” 家族，但利用条件更宽松、稳定性更强。  
### 1. 关键触发组件  
  
漏洞触发依赖三个核心内核组件的联动，缺一不可：  
- • **AF_ALG**  
：内核加密接口，用于用户态与内核态加密算法交互，默认启用  
  
- • **authencesn**  
：加密模板模块，处理 IPSec ESP 协议的认证加密逻辑  
  
- • **splice**  
：系统调用，实现内核空间数据零拷贝传输，广泛用于管道、文件数据交互  
  
### 2. 核心原理拆解  
  
2017 年，Linux 内核为优化AF\_ALG  
+splice  
数据传输效率，提交了一项代码优化补丁。该补丁**未正确初始化管道缓冲区（pipe_buffer）的 flags 字段**  
，导致缓冲区继承旧的PIPE\_BUF\_FLAG\_CAN\_MERGE  
（可合并标志）。  
  
正常情况下，**只读文件（如 /usr/bin/su、/etc/shadow）的页缓存严格禁止用户态写入**  
。但在漏洞触发场景中：  
1. 1. 攻击者通过AF\_ALG  
创建加密套接字，调用splice  
将只读文件数据传入管道  
  
1. 2. 管道缓冲区因 flags 未清零，保留可合并标志，内核误将只读页缓存标记为可写  
  
1. 3. 攻击者向管道写入恶意数据，**直接篡改只读页缓存中的系统关键文件**  
（如将 /usr/bin/su 替换为提权 shell）  
  
1. 4. 执行被篡改的 setuid 程序，普通用户即可获得 root 权限  
  
### 3. 与同类漏洞的核心区别  
  
对比 DirtyPipe 与 DirtyCow，Dirty Frag 的危害更突出：  
- • **DirtyCow**  
：需利用写时复制（COW）竞争条件，利用不稳定，受内核防护机制限制  
  
- • **DirtyPipe**  
：依赖 pipe 缓冲区 flags 未初始化，需特定内核版本（5.8+）  
  
- • **Dirty Frag**  
：**稳定逻辑缺陷，无竞争条件，2017 年后内核全覆盖，容器逃逸成功率极高**  
  
## 三、影响范围  
### 1. 受影响内核版本  
  
漏洞源自 2017 年的内核优化提交，**所有 2017 年 1 月 1 日后构建的 Linux 内核均受影响**  
，核心覆盖：  
- • 主线内核：4.15 ~ 6.18（截至 2026 年 4 月）  
  
- • 长期支持（LTS）内核：5.4、5.10、5.15、6.1 系列  
  
### 2. 受影响主流发行版（已实测验证）  
  
<table><thead><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1dex" style="font-size: 16px;">发行版</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydtt6q" style="font-size: 16px;">受影响版本</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt8sa" style="font-size: 16px;">内核示例</span></section></td></tr></thead><tbody><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1d07" style="font-size: 16px;">Ubuntu</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1cnr" style="font-size: 16px;">22.04 LTS、24.04 LTS、26.04（开发版）</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydtb8s" style="font-size: 16px;">6.17.0-1007-aws</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydtonf" style="font-size: 16px;">RHEL/Alma/CentOS Stream</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydtdom" style="font-size: 16px;">9、10.1</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1ngi" style="font-size: 16px;">6.12.0-124.45.1.el10_1</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt18h5" style="font-size: 16px;">SUSE</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt19o2" style="font-size: 16px;">15、16</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1dsq" style="font-size: 16px;">6.12.0-160000.9-default</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydteqs" style="font-size: 16px;">Amazon Linux</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt13in" style="font-size: 16px;">2023</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydtb94" style="font-size: 16px;">6.18.8-9.213.amzn2023</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1qvl" style="font-size: 16px;">Arch Linux/Fedora</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt18ry" style="font-size: 16px;">全版本（2017 年后）</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1cf5" style="font-size: 16px;">6.18.8、6.17.x</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1huj" style="font-size: 16px;">WSL2</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt9nf" style="font-size: 16px;">全版本</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="" mpa-font-style="mowjiydt1c5b" style="font-size: 16px;">对应宿主内核版本</span></section></td></tr></tbody></table>  
### 3. 特殊环境影响  
- • **容器环境**  
：Docker、K8s 容器共享宿主机内核页缓存，**容器内普通用户可利用漏洞逃逸至宿主机 root**  
，云原生多租户环境风险极高  
  
- • **虚拟机**  
：KVM、VMware 等虚拟机不受影响（内核独立）  
  
- • **嵌入式设备**  
：2017 年后基于 Linux 的路由器、IoT 设备，若启用AF\_ALG  
接口则受影响  
  
## 四、漏洞利用条件  
  
无需特殊权限、无需特定配置，满足以下**4 个基础条件**  
即可利用：  
1. 1. **本地普通用户权限**  
：无需 sudo/root，普通账户、系统账户（如 www-data、nginx）均可  
  
1. 2. **内核启用 AF_ALG 接口**  
：主流发行版默认启用，可通过ls /proc/net/alg  
检查  
  
1. 3. **可调用 splice 系统调用**  
：默认开启，无严格限制  
  
1. 4. **系统存在 setuid 程序**  
：如/usr/bin/su  
、/usr/bin/passwd  
，所有 Linux 系统默认存在  
  
### 利用流程（极简）  
1. 1. 普通用户登录系统  
  
1. 2. 编译 / 执行公开 POC（约数百行代码）  
  
1. 3. 漏洞触发，直接获取 root shell  
  
1. 4. （容器场景）进一步提权至宿主机 root  
  
## 五、修复与缓解方案  
  
截至 2026 年 5 月，**官方补丁已全面发布**  
，各发行版已推送安全更新。建议按 “**先缓解、再修复、后验证**  
” 三步处置。  
### 1. 官方修复（首选，彻底解决）  
#### （1）内核修复版本  
- • 主线内核：升级至 6.18.9+、6.17.11+、6.12.46+  
  
- • Ubuntu：6.17.0-1008-aws+、5.15.0-107-generic+  
  
- • RHEL/Alma：6.12.0-124.46.1.el10_1+  
  
- • SUSE：6.12.0-160000.10-default+  
  
#### （2）升级命令（主流发行版）  
```
# Ubuntu/Debiansudo apt update && sudo apt install linux-image-$(uname -r | sed 's/-generic//')-generic# RHEL/CentOS/Almasudo dnf update kernel -y# Amazon Linuxsudo yum update kernel -y# 升级后重启生效sudo reboot
```  
### 2. 临时缓解措施（无法立即升级时，降低风险）  
#### （1）禁用漏洞相关内核模块（推荐）  
```
# 禁用authencesn模块（核心触发模块）echo "blacklist authencesn" | sudo tee /etc/modprobe.d/dirtyfrag.conf# 禁用AF_ALG相关模块echo "blacklist algif_aead" | sudo tee -a /etc/modprobe.d/dirtyfrag.conf# 重启生效sudo reboot
```  
#### （2）限制普通用户使用 AF_ALG 接口  
  
通过 seccomp 策略阻止普通用户创建 AF_ALG 套接字，适用于容器 / 多用户环境：  
```
# 临时生效（当前会话）sudo sysctl -w kernel.seccomp=1# 永久生效echo "kernel.seccomp=1" | sudo tee /etc/sysctl.d/99-seccomp.confsudo sysctl -p
```  
#### （3）容器环境专项防护  
- • 为容器添加 seccomp 规则，禁止splice  
、AF\_ALG  
相关系统调用  
  
- • 启用容器内核防护：\-\-security\-opt seccomp=seccomp\_profile\.json  
  
- • 定期扫描容器内 setuid 程序，清理非必要特权文件  
  
### 3. 修复验证（确认漏洞已修复）  
#### （1）检查内核版本  
```
uname -r# 输出需高于对应发行版修复版本
```  
#### （2）执行官方检测脚本 / POC  
  
运行公开的 Dirty Frag POC，若**无法提权、报错退出**  
，则说明修复 / 缓解生效  
## 六、安全建议  
1. 1. **优先升级内核**  
：漏洞利用门槛极低，**尽快升级至修复版本是唯一彻底解决方案**  
，避免拖延  
  
1. 2. **最小化权限管控**  
：遵循最小权限原则，禁止普通用户登录生产服务器，限制容器用户权限  
  
1. 3. **监控异常行为**  
：监控/usr/bin/su  
、/etc/shadow  
等关键文件的篡改行为，及时告警  
  
1. 4. **定期漏洞扫描**  
：使用安全工具（如 Nessus、OpenVAS）定期扫描内核漏洞，提前发现风险  
  
1. 5. **关注安全动态**  
：及时跟进 Linux 内核安全公告，第一时间处置新漏洞  
  
## 总结  
  
Dirty Frag 漏洞是近年来影响范围最广、利用难度最低的 Linux 内核高危漏洞之一，2017 年后的主流系统几乎全部 “中招”，容器逃逸风险更是直接威胁云原生环境安全。对于企业而言，需高度重视，**立即排查系统内核版本，优先升级修复，同步落实临时缓解措施**  
；对于个人用户，及时更新系统内核，避免被恶意提权。  
  
   
  
  
