#  Windows 11 24H2中近期被披露了一个高危本地权限提升漏洞  
原创 INew
                    INew  黑白之道   2026-05-05 01:07  
  
> **导语**  
：一个普通用户，无需任何特殊权限，只需在锁屏界面上触发一次竞争条件，就能获得系统的最高控制权——这正是CVE-2026-24291（代号RegPwn）所实现的效果。2026年3月，这个潜伏在Windows辅助功能ATConfig机制中的高危漏洞被公开披露，影响从Windows 11 24H2到Windows Server 2025的多个主流版本。攻击者可以利用它悄无声息地将权限从"用户"提升到"SYSTEM"，从而完全掌控目标机器。  
  
## 一、漏洞概述  
  
CVE-2026-24291是一个**高危本地权限提升漏洞**  
，由英国安全公司MDSec（Mandiant Security Consulting）的研究员发现并报告给微软。该漏洞的核心在于Windows辅助功能基础设施（Accessibility Infrastructure）中的ATBroker.exe组件对注册表操作的错误处理。  
  
漏洞被命名为"**RegPwn**  
"——这个名字精准地概括了它的本质：通过**注册表（Registry）滥用**  
实现**权限劫持（Pwn）**  
。与许多依赖复杂内存破坏的提权漏洞不同，RegPwn是一个**逻辑层面的漏洞**  
，利用Windows安全桌面切换过程中的时序竞争条件，通过注册表符号链接（Registry Symbolic Link）将低权限的注册表写操作重定向到高权限的系统注册表项。  
  
这个漏洞的CVSS评分为**9.1（高危）**  
，攻击复杂度低，且无需任何用户交互（除了触发锁屏这一系统固有行为）。在2026年3月微软补丁星期二（Patch Tuesday）发布修复前，全球数以亿计的Windows设备都暴露在此风险之下。  
  
![Windows注册表提权漏洞示意](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6MdQuchZ4oJLiayuoxNuPuafseib8TkibMheAYalYqaYszmx1IiaaRS0RvyyJhAEjF0zibCgUaBJ3ZljBIk2dw0OJPA1RZt5XQ1Uegc/640?wx_fmt=png "Windows注册表提权漏洞示意")  
## 二、技术原理  
### 2.1 受影响组件：ATBroker.exe与ATConfig机制  
  
**ATBroker.exe**  
（Assistive Technology Broker）是Windows辅助功能代理服务，负责管理屏幕阅读器、屏幕键盘、放大镜等辅助工具。它运行在**SYSTEM权限**  
下，并与用户会话通过注册表进行通信。  
  
ATConfig机制是ATBroker用于保存和加载辅助功能配置的注册表结构，主要路径包括：  
- HKEY_CURRENT_USER\Software\Microsoft\Windows NT\CurrentVersion\Accessibility  
  
- 以及关联的HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\  
下的服务配置  
  
关键问题在于：当用户锁定工作站（Win+L）或触发UAC提权时，ATBroker会从用户注册表项读取配置，然后以SYSTEM权限写入到系统注册表项。**这个从低权限到高权限的"信任传递"环节，正是攻击的突破口**  
。  
### 2.2 漏洞本质：注册表符号链接竞争条件  
  
漏洞根源在于Windows对注册表符号链接的创建和解析缺乏严格的权限验证。攻击流程如下：  
  
**阶段1：符号链接预创建**  
  
攻击者在自己的HKEY_CURRENT_USER下创建一个注册表符号链接，指向受保护的系统注册表项（例如HKLM\SYSTEM\CurrentControlSet\Services\  
下的某个服务项）。例如：  
```
REG ADD HKCU\Software\Microsoft\Windows NT\CurrentVersion\Accessibility\ATConfig /ve /d "\??\REGISTRY\MACHINE\SYSTEM\CurrentControlSet\Services\msiserver" /f
```  
  
**阶段2：竞争窗口**  
  
当用户执行锁定工作站（Lock Workstation）操作时，系统会切换到安全桌面（Secure Desktop）。此时ATBroker.exe会读取ATConfig配置，并尝试将辅助功能设置同步到系统注册表项——**正是这个同步过程，ATBroker会无差别地跟随符号链接，将数据写入攻击者指定的位置**  
。  
  
**阶段3：权限提升**  
  
攻击者通过符号链接将恶意数据写入到敏感的系统服务配置项（如ImagePath  
），从而控制随系统启动的高权限进程，最终实现从普通用户到SYSTEM的提权。  
### 2.3 关键CWE漏洞类型  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">CWE编号</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">描述</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CWE-362</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">并发执行不正确的同步（Race Condition）</span></strong><section><span leaf="">——攻击利用了锁屏切换的时间窗口</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CWE-59</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">通过符号链接进行不正确的链接解析（Link Following）</span></strong><section><span leaf="">——注册表符号链接未验证目标</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CWE-732</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">不正确的权限分配</span></strong><section><span leaf="">——HKCU与HKLM之间的信任边界不清晰</span></section></td></tr></tbody></table>## 三、攻击演示  
  
根据公开的PoC（概念验证）代码，攻击流程可以简化为以下步骤：  
  
**第一步：检查环境**  
```
# 确认当前为普通用户whoami# 输出：DESKTOP-XXXX\普通用户
```  
  
**第二步：创建符号链接（低权限操作）**  
```
# 利用reg.exe命令创建指向敏感注册表项的符号链接reg add "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Accessibility\ATConfig" /ve /d "\??\REGISTRY\MACHINE\SYSTEM\CurrentControlSet\Services\msiserver" /f
```  
  
**第三步：触发竞争条件**  
```
# 锁定工作站，触发ATBroker在安全桌面的配置同步rundll32.exe user32.dll,LockWorkStation
```  
  
**第四步：验证提权**  
  
等待锁屏结束后解锁，执行：  
```
whoami# 输出：NT AUTHORITY\SYSTEM
```  
  
此时攻击者已拥有系统最高权限，可以：  
- 禁用安全软件  
  
- 安装持久化后门  
  
- 横向移动到域内其他主机  
  
- 导出敏感数据（如lsass.exe内存中的哈希）  
  
## 四、实际影响  
### 4.1 受影响版本  
  
根据微软安全公告和公开研究，受CVE-2026-24291影响的Windows版本包括：  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">操作系统</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">受影响版本</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">修复状态</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Windows 11</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">22H2, 23H2, </span><strong style="color: rgb(72, 112, 172);"><span leaf="">24H2</span></strong></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">✓ 已修复（KB5077181）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Windows 10</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">21H2, Enterprise LTSC</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">✓ 已修复</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Windows Server</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2016, 2019, 2022, 2025</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">✓ 已修复</span></section></td></tr></tbody></table>  
**Windows 11 24H2作为微软最新的桌面操作系统版本，在漏洞披露时正处于广泛部署阶段，因此受影响面极广。**  
### 4.2 利用门槛与攻击场景  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">条件</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">要求</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">初始权限</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">普通用户/访客账户（Medium Integrity Level）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">物理/远程</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">本地登录（物理访问或RDP会话）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">用户交互</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无需用户确认，仅需锁屏触发（系统固有行为）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">攻击复杂度</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">低（单行命令即可完成）</span></section></td></tr></tbody></table>  
**典型攻击场景**  
：  
1. **内网渗透后期**  
：红队通过钓鱼或Web漏洞获得一个普通用户权限的RDP会话，利用该漏洞快速提升至SYSTEM  
  
1. **物理访问攻击**  
：攻击者在目标办公室短暂接触 unlocked 的电脑，快速提权安装持久化后门  
  
1. **恶意软件利用**  
：已感染的设备上的恶意软件定期触发该漏洞以维持高权限持久性  
  
## 五、漏洞披露与利用代码  
### 5.1 时间线  
- **2025年12月**  
：MDSec研究员首次向微软报告该漏洞  
  
- **2026年2月**  
：微软确认漏洞并开始开发补丁  
  
- **2026年3月10日**  
：微软发布带外（Out-of-Band）安全更新修复CVE-2026-24291  
  
- **2026年3月中旬**  
：补丁细节公开，PoC代码在GitHub上发布  
  
- **2026年3月下旬**  
：Brute Ratel C4（红队工具框架）集成BOF（Beacon Object File）形式的利用模块  
  
### 5.2 公开利用代码  
  
目前已有多个公开的PoC/EXP实现：  
1. **GitHub PoC（lennertdefauw/CVE-2026-24291）**  
  
1. 纯C实现，直接调用Windows API  
  
1. 编译为独立可执行文件  
  
1. 自动检测系统版本并执行攻击链  
  
1. **Brute Ratel C4 BOF模块**  
  
1. BOF（Beacon Object File）格式，可在Cobalt Strike/BRc4框架内直接加载  
  
1. 更小的内存占用，更适合红队隐蔽渗透  
  
1. 支持参数化目标注册表路径  
  
1. **Metasploit模块（社区贡献）**  
  
1. 集成到Metasploit Framework的post/windows/escalate/regpwn  
模块  
  
1. 可与其他渗透模块联动  
  
## 六、检测与取证  
### 6.1 Windows事件日志监控  
  
 defenders应重点关注以下事件ID：  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">事件ID</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">来源</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">描述</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">4657</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Security</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">注册表值被修改——关注</span><code><span leaf="">HKLM\SYSTEM\CurrentControlSet\Services</span></code><span leaf="">下的修改</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">4688</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Security</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">创建新进程——观察cmd.exe/powershell.exe的SYSTEM级父进程</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">4670</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Security</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">对象权限被更改——注册表项的ACL变更</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">7036</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Service Control Manager</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">服务状态变更——可疑服务被创建或启动</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">1001</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Application</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Windows错误报告——ATBroker异常崩溃可能暗示攻击</span></section></td></tr></tbody></table>### 6.2 Sysmon关键规则  
```
<!-- 监控ATBroker进程树 --><RuleGroup name="" groupRelation="or"><ProcessCreate onmatch="exclude">    <Image condition="is">C:\Windows\System32\ATBroker.exe</Image></ProcessCreate></RuleGroup><!-- 监控HKLM注册表写入 --><RuleGroup name="" groupRelation="or"><RegistryEvent onmatch="include">    <TargetObject condition="contains">\SYSTEM\CurrentControlSet\Services\</TargetObject></RegistryEvent></RuleGroup>
```  
### 6.3 行为指标（IoCs）  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">指标类型</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">具体表现</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">进程行为</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><code><span leaf="">ATBroker.exe</span></code><section><span leaf=""> 在锁屏后短时间内启动子进程（如</span><code><span leaf="">reg.exe</span></code><span leaf="">、</span><code><span leaf="">powershell.exe</span></code><span leaf="">）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">注册表活动</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">HKCU...\ATConfig 路径下出现指向HKLM的符号链接（类型：REG_LINK）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">网络行为</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">提权后短时间内出现异常出站连接（C2回连）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">文件活动</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><code><span leaf="">msiserver</span></code><section><span leaf=""> 服务的</span><code><span leaf="">ImagePath</span></code><span leaf="">被修改为非常规路径</span></section></td></tr></tbody></table>## 七、缓解与修复  
### 7.1 官方补丁  
  
微软已在 **2026年3月10日**  
 发布带外安全更新修复此漏洞：  
- **Windows 11 24H2**  
：安装 **KB5077181**  
 或更高版本  
  
- **Windows 11 23H2/22H2**  
：安装 **KB5075897**  
  
- **Windows Server 2025 24H2**  
：安装 **KB5075899**  
  
- **Windows Server 2022**  
：安装 **KB5075897**  
  
**验证修复**  
：  
```
# 查看已安装的补丁Get-HotFix | Where-Object {$_.HotFixID -match "KB5077181|KB5075897|KB5075899"}# 或使用wmicwmic qfe list brief /format:table | findstr "KB5077181"
```  
### 7.2 临时缓解措施（无法立即打补丁）  
1. **限制ATBroker执行权限**  
```
# 禁用辅助功能代理（会影响屏幕阅读器等辅助功能）sc config "BrokerInfrastructure" start= disablednet stop "BrokerInfrastructure"
```  
  
  
1. **注册表权限加固**  
```
# 限制HKCU\...\ATConfig键的写入权限regini.exe system.ini
```  
  
内容：  
```
HKCU\Software\Microsoft\Windows NT\CurrentVersion\Accessibility\ATConfig = "D:P(A;;GA;;;SY)(A;;GR;;;BU)(A;;GR;;;IU)"
```  
  
  
1. **启用UAC始终通知**  
```
# 强制UAC始终在安全桌面提示（增加攻击成本）Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" -Name "ConsentPromptBehaviorAdmin" -Value 2
```  
  
  
1. **部署AppLocker或WDAC**  
 创建规则禁止未签名的可执行文件从临时目录运行，阻止PoC脚本执行。  
  
### 7.3 渗透测试视角的绕过思路  
  
对于红队而言，目标环境中大概率已部署基础防护。以下是在受限环境中尝试利用该漏洞的几种思路：  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">限制条件</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">绕过策略</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">杀毒软件实时监控</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">将payload注入合法进程内存（如</span><code><span leaf="">notepad.exe</span></code><span leaf="">），避免落地文件</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">AppLocker白名单</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">使用已签名的系统二进制文件（如</span><code><span leaf="">msbuild.exe</span></code><span leaf="">）加载恶意配置</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无法创建符号链接</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">利用Junction替代Symbolic Link（需SeCreateSymbolicLinkPrivilege）</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无法锁定工作站</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">模拟安全桌面切换（SendMessage/SendInput触发锁屏API）</span></section></td></tr></tbody></table>## 八、红队应用与防御建议  
### 8.1 对攻击者的价值  
  
CVE-2026-24291是一个**完美的红队提权工具**  
：  
1. **稳定性高**  
：基于逻辑漏洞而非内存破坏，极少触发蓝屏或崩溃  
  
1. **隐蔽性强**  
：不涉及异常驱动加载或敏感注册表项的直接修改  
  
1. **兼容性好**  
：适用于从Windows 10到Windows Server 2025的广泛版本  
  
1. **免杀容易**  
：纯用户态操作，无shellcode或驱动签名绕过需求  
  
在红队评估中，该漏洞常被用于**横向移动后的快速权限提升阶段**  
——当攻击者通过钓鱼获得一个普通用户RDP会话后，使用该漏洞在30秒内完成提权，从而为后续的域内活动扫清障碍。  
### 8.2 对防御者的建议  
1. **优先补丁**  
：将KB5077181/KB5075897/KB5075899列为**关键补丁**  
，72小时内完成全网部署  
  
1. **监控ATBroker异常**  
：在EDR/XDR平台配置针对ATBroker.exe  
进程树异常的告警规则  
  
1. **最小权限原则**  
：限制普通用户对HKLM\SYSTEM\CurrentControlSet\Services\  
路径的访问权限  
  
1. **定期权限审计**  
：使用Get-Acl  
或RegDACL  
检查注册表关键路径的ACL配置  
  
1. **模拟攻击测试**  
：在非生产环境运行公开PoC，验证检测规则的有效性  
  
## 九、总结  
  
CVE-2026-24291（RegPwn）代表了现代Windows内核中一类危险的逻辑漏洞：**辅助功能机制与注册表安全模型之间的信任错位**  
。攻击者不需要复杂的利用链，也不需要绕过任何内存保护机制，仅通过精心构造的符号链接和一次锁屏触发，就能将普通用户权限直接提升至SYSTEM。  
  
这个漏洞的披露再次提醒我们：**提权漏洞的本质是权限边界的模糊**  
。即使是最底层的系统组件（如ATBroker），在处理跨权限边界的操作时也必须遵循"绝不信任用户输入"的原则。  
  
对于 defenders 而言，理解这类漏洞的原理有助于构建更有效的检测规则——监控ATBroker进程、注册表符号链接创建、以及HKLM服务的非预期修改，都是可以立即落手的检测点。  
  
对于 red teamers 而言，CVE-2026-24291是一个值得加入武器库的高稳定性提权选项。但在实际使用中，务必注意目标环境是否已修补，并准备好应对EDR对ATBroker异常行为的告警。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。配图由华盟网授权使用。  
  
