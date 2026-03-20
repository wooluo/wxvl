#  九年未被发现的漏洞影响1260万个企业级Linux系统  
 祺印说信安   2026-03-20 16:01  
  
AppArmor 是一款广泛使用的 Linux 强制访问控制框架，现已发现九个严重漏洞。这些漏洞统称为“CrackArmor”，它们允许非特权本地用户将权限提升至 root，破坏容器隔离，并导致内核操作崩溃。该问题影响全球超过 1260 万个企业级 Linux 系统。  
  
CrackArmor 漏洞的起源可以追溯到 2017 年发布的 Linux 内核版本 4.11，并且在生产环境中近九年来一直未被发现。  
  
这些缺陷由Qualys 威胁研究部门 (TRU) 发现，并于2026年3月12日公开披露。这些缺陷存在于 AppArmor 作为Linux安全模块 (LSM) 的实现中，而不是其底层安全模型中。  
  
自 2.6.36 版本以来，AppArmor 一直是 Linux 内核主线的一部分，并且在 Ubuntu、Debian 和 SUSE 上默认启用，这使得其攻击面异常广泛，涵盖企业数据中心、Kubernetes 集群、物联网部署和云平台。  
  
Qualys CyberSecurity Asset Management 的数据证实了风险敞口的规模：超过 1260 万个企业 Linux 实例默认启用 AppArmor，所有这些实例在修补之前都可能存在漏洞。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mOJLHzw95XI5S0NicYAibv9mTVhLX54q9aoKFxz5vicqvhnic6oCKhswOickdICbWse8w9mU6KpbyNzJvEdY8icWWUFW7sBInRTDGf6hfwbmQXBq0/640?wx_fmt=jpeg "")  
## CrackArmor 漏洞  
  
CrackArmor 的核心是混淆代理漏洞，这是一种缺陷，其中无特权参与者欺骗有特权进程代表其执行未经授权的操作。  
  
攻击者利用这一点，通过写入位于/sys/kernel/security/apparmor/.load、.replace和 的AppArmor 伪文件.remove，使用 Sudo 和 Postfix 等受信任的系统工具作为不知情的代理。  
  
由于这些工具以提升的权限运行，它们绕过了通常会阻止攻击者直接访问的用户命名空间限制，从而能够在内核内部执行任意代码。  
  
CrackArmor支持的攻击链种类繁多且威力强大：  
- **策略绕过：**非特权用户可以静默地移除对关键系统守护进程（如 rsyslogd 和 cupsd）的保护，或者加载 sshd 的 deny-all 配置文件以阻止所有 SSH 访问。  
- **本地权限提升 (LPE) 到 Root（用户空间）：**攻击者通过加载一个从 sudo 中剥离 CAP_SETUID 的配置文件并操纵 MAIL_CONFIG 环境变量，强制 sudo 以 root 身份调用 Postfix 的 sendmail 二进制文件，从而获得完整的 root shell。  
- **内核空间 LPE：**利用函数中的释放后使用漏洞aa_loaddata，攻击者可以将释放的内核内存重新分配为页表，该页表映射/etc/passwd，直接覆盖 root 密码条目，并通过获得 root 访问权限su。  
- **容器和命名空间突破：**通过加载目标为“userns”的配置文件/usr/bin/time，非特权用户可以创建功能齐全的用户命名空间，从而破坏 Ubuntu 先前部署的命名空间限制缓解措施。  
- **通过堆栈耗尽拒绝服务：**具有深度嵌套子配置文件（最多1,024 层）的配置文件在递归删除期间可能会耗尽内核的16KB 堆栈，从而引发内核崩溃并强制系统重启。  
- **KASLR 绕过：**配置文件解析过程中的越界读取会泄露内核内存地址，从而破坏内核地址空间布局随机化，并为进一步的攻击链打开大门。  
截至发稿时，CrackArmor漏洞尚未分配CVE编号。由于这些漏洞存在于上游Linux内核中，只有上游内核团队才有权发布CVE编号，而这一过程通常需要一到两周时间，即在修复程序稳定发布后。安全团队不应因缺少CVE编号而延误修复响应。  
  
Qualys TRU 团队已开发出可运行的概念验证漏洞利用代码，演示了完整的攻击链。虽然该团队尚未公开发布，以便补丁部署顺利进行，但漏洞的技术机制已得到充分记录，可供更广泛的安全社区进行独立验证。  
  
运行启用 AppArmor的Linux系统的组织应立即采取以下措施：  
- 立即为 Ubuntu、Debian、SUSE 及其衍生版本应用所有可用的厂商内核和 AppArmor 安全补丁。  
- 部署 Qualys QID 386714 扫描所有 Linux 端点，查找受影响的 AppArmor 版本，并优先处理面向互联网的资产。  
- 密切监控/sys/kernel/security/apparmor/任何意外的配置文件变化，这可能表明存在恶意攻击活动。  
- 使用Qualys CyberSecurity Asset Management 查询来枚举本地和云环境中所有安装了 AppArmor 的 Ubuntu、Debian和SUSE 资产。  
Qualys已确认其自身产品和平台不受CrackArmor漏洞的影响。  
  
  
