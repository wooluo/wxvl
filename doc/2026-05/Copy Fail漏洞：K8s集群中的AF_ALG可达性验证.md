#  Copy Fail漏洞：K8s集群中的AF_ALG可达性验证  
Dubito
                    Dubito  云原生安全指北   2026-05-06 00:35  
  
   
  
> 注：本文翻译自 Juliet 的文章  
《Copy Fail in Kubernetes: RuntimeDefault Did Not Block AF_ALG》[1]  
，可点击文末“阅读原文”按钮查看英文原文。  
  
  
全文如下：  
## 一、引言  
  
2026年4月22日，Linux CNA 发布了   
CVE-2026-31431[2]  
，这是 Linux 内核中 algif_aead  
 组件的一个漏洞，该组件位于内核 AF_ALG 加密套接字接口的 AEAD 侧。Xint 将该漏洞命名为   
Copy Fail[3]  
，并演示了如何在不污染磁盘上文件的情况下，修改一个只读文件的页缓存（page-cache）字节。  
  
这个 Linux 层面的描述是准确的，但它留下了一个与 Kubernetes 相关的未解问题：  
> 如果一个 Pod 是非 root 的，被丢弃了所有 Linux 能力（Capabilities），使用了 RuntimeDefault  
 级别的 seccomp，并且被 Pod 安全标准限制（Pod Security Standards Restricted）允许，那么它是否仍然能够触发 Copy Fail 的内核路径？  
  
  
我们在两个真实的 Kubernetes 集群上进行了测试：  
- • Talos v1.12.2  
，内核 6.18.5-talos  
，containerd 2.1.6  
  
- • 运行于 Amazon Linux 2023.11 之上的 EKS 集群，内核 6.12.79-101.147.amzn2023.x86_64  
，containerd 2.2.1  
  
简短的答案是：可以。在两个集群中，一个在 PSS 限制策略下准入的非 root Pod，都能够创建一个 AF_ALG 套接字，并绑定相关的 AEAD 算法路径。在这两个集群中，一个非 root Pod 能够修改一个内置于特定容器镜像层中的文件的缓存字节，并且同一节点上、使用相同镜像的另一个 Pod 观察到了被修改后的字节。RuntimeDefault  
 级别的 seccomp 并未阻止该路径。而一个自定义的、拒绝 socket(AF_ALG, ...)  
 调用的 Localhost  
 类型 seccomp 配置文件则可以阻止。  
  
我们还在 Talos/containerd 和 EKS/containerd 上进行了受控的 root 链实验室测试，使用了一个内置于测试镜像中的、特制的 setuid 辅助程序。当使用该Pod的应用允许权限提升时，这些测试中的容器能够达到有效用户 ID（euid）0。一个 PSS 限制策略下的写入者 Pod 能够改变共享镜像层中的字节，但 allowPrivilegeEscalation: false  
 这个设置阻止了该 Pod 利用 setuid 机制来提升权限。  
  
本文的讨论范围是有意限定的。我们不会发布漏洞利用代码。我们没有针对宿主机上的 setuid 二进制文件、宿主机可执行文件、包管理器管理的文件或生产应用文件进行测试。setuid 测试仅使用了一个位于一次性实验镜像内部的、特制的辅助程序。  
  
**2026年5月3日更新：**  
 我们重新检查了主要的追踪器和供应商公告。下方关于 Kubernetes 的结论没有变化，但各厂商的修复进展仍在更新。SUSE 现已表示，为所有仍在维护的 SUSE Linux Enterprise 和 openSUSE Leap 发行版均发布了更新，公共云镜像的更新仍在进行中。Amazon Linux 的追踪器仍将 Amazon Linux 2 和 Amazon Linux 2023 的内核流标记为“修复待发布”。Red Hat 的公共公告仍保持 Important  
 和 Ongoing（进行中）  
 状态，并且 Red Hat 的公共 OpenShift 文章指出，OpenShift Container Platform 4 以及受管的 ROSA Classic/OpenShift Dedicated 集群均受影响，修复工作仍在继续。NVD 在5月3日也继续添加了该 CVE 的引用。请以厂商的包/公告源作为最实时的信息来源。  
  
**2026年5月2日更新：**  
 基于存在积极利用的证据，CISA 于5月1日将 CVE-2026-31431 添加到其已知被利用漏洞目录（Known Exploited Vulnerabilities catalog）中，并要求联邦民事行政部门（FCEB）在2026年5月15日前完成修复。Microsoft Defender 报告称，目前观察到的利用行为是有限的，且主要是概念验证/测试活动，但初步的测试可能会导致后续利用尝试增加。  
  
各厂商的修复状态也在持续更新。AlmaLinux 已将打了补丁的内核从测试仓库移至生产仓库，Debian 现已在其 bullseye-security  
、bookworm-security  
、trixie-security  
、forky  
 和 sid  
 仓库中列出了已修复的内核包，CloudLinux/KernelCare 在5月2日扩展了内核和 livepatch（实时补丁）的覆盖范围。请继续使用操作系统厂商的公告作为唯一权威来源，因为仅凭内核版本字符串可能会遗漏向后移植（backport）和 livepatch 状态的细节。这改变了漏洞的紧迫性，但并未改变 Kubernetes 的结论：在我们测试的受影响节点上，PSS 限制和 RuntimeDefault  
 级别的 seccomp 并未消除对 AF_ALG 的可达性。  
  
**2026年5月1日更新：**  
 自本文发布以来，CVE 记录已更新，增加了更多已修复的稳定内核版本阈值，并且各厂商已经发布了更多的缓解措施和修复指南。Debian 已将 trixie-security  
 的修复版本列为 6.12.85-1  
；Ubuntu 推送了一个 **kmod**  
 缓解措施，在内核修复全面推出期间禁用 algif_aead  
 模块；AlmaLinux 发布了处于测试状态的已修复内核；CloudLinux 指出，当 algif_aead  
 被编译进内核时，通过 modprobe.d  
 和 rmmod  
 进行的缓解措施在 RHEL 系列系统上无效；Sidero 推荐使用 Talos 1.12.7+  
 或 1.13.0+  
 版本。关于 Kubernetes 的核心结论保持不变：在我们测试的受影响节点上，PSS 限制和 RuntimeDefault  
 级别的 seccomp 并未消除对 AF_ALG 的可达性。  
## 二、主要发现  
- • 在我们测试的两个集群中，PSS 限制均未阻止相关的 AF_ALG 路径。  
  
- • 在 Talos/containerd 或 EKS/containerd 上，RuntimeDefault  
 seccomp 均未阻止 AF_ALG。  
  
- • 在这两个集群中，一个自定义的、拒绝 socket(AF_ALG, ...)  
 的 Localhost  
 seccomp 配置文件阻止了该路径。  
  
- • 跨 Pod 的页缓存（page-cache）可见性在同一节点上可重现，包括共享同一个容器镜像层的情况。  
  
- • 在受控的 Talos 和 EKS 实验室环境中，当一个设置了 allowPrivilegeEscalation: true  
 的 Pod 执行了来自共享镜像层且已被篡改的特制 setuid 辅助程序时，容器能够达到有效用户 ID（euid）0。  
  
- • PSS 限制未能阻止页缓存的篡改，但 allowPrivilegeEscalation: false  
 确实阻止了该 setuid 辅助程序路径在受限 Pod 内部获得 root 权限。  
  
- • 在 hostPath 卷的实验室测试中，磁盘上的文件字节保持干净，而正常的缓存读取操作却观察到了被篡改后的字节。  
  
## 三、什么是 Copy Fail  
  
该 CVE 的官方标题是 crypto: algif_aead - Revert to operating out-of-place  
。该 CVE 记录的 CVSS 3.1 评分为 7.8（高危），其向量为 AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H  
。上游受影响范围始于 Linux 提交 72548b093ee38a6d4f2a19e6ef1948ae05c181f7  
。截至 2026 年 5 月 3 日，CVE/NVD 记录列出了已修复的稳定内核版本阈值，包括 5.10.254  
、5.15.204  
、6.1.170  
、6.6.137  
、6.12.85  
、6.18.22  
、6.19.12  
 和 7.0  
。  
  
Xint 的文章解释了该漏洞的利用原语：一个非特权的本地进程可以利用 AF_ALG 的 AEAD 操作以及 splice()  
 系统调用，以一种特定的方式导致内核向文件关联的页缓存（file-backed page-cache pages）中写入数据。这些缓存页会被正常的读取和执行路径所使用，但文件本身并不会像通常那样在磁盘上被标记为“脏页（dirty）”。  
  
这个区别在 Kubernetes 中非常重要，因为同一节点上的容器共享同一个宿主机内核以及宿主机的页缓存。Kubernetes 的命名空间隔离了很多东西，但它并没有为每个 Pod 提供一个私有的 Linux 内核。  
## 四、为什么 Kubernetes 会改变该漏洞的影响范围  
  
Kubernetes 团队通常会从工作负载态势角度来推理这类错误：  
- • Pod 是 root 的还是非 root 的？  
  
- • 它是特权的（privileged）吗？  
  
- • 它是否拥有危险的 Linux 能力（capabilities）？  
  
- • 它是否使用了宿主机命名空间（host namespaces）或 hostPath？  
  
- • 该命名空间是否强制启用了 PSS 限制？  
  
- • 是否启用了 seccomp？  
  
这些问题仍然有用，但 Copy Fail 漏洞恰恰打破了其中一个常见的假设：RuntimeDefault  
 seccomp 并不等同于拒绝了 AF_ALG 套接字。  
  
Kubernetes 将 RuntimeDefault  
 定义为容器运行时的默认 seccomp 配置文件。该配置文件的内容因运行时及其版本而异。在我们检查过的配置文件中，Docker/Moby 和 containerd 确实拒绝了 socket(AF_VSOCK, ...)  
 调用，但它们并没有拒绝 socket(AF_ALG, ...)  
 调用。AF_ALG 的地址族编号是 38  
；而 AF_VSOCK 是 40  
。  
  
这意味着，一个 Pod 可能看起来符合 Kubernetes 的大部分态势标准，显得合情合理，但它仍然能够访问触发此漏洞所需的内核接口。  
## 五、我们测试了什么  
  
我们在两个集群上分别进行了五项防御性实验室测试，随后在 Talos/containerd 和 EKS/containerd 上分别进行了受控的 root 链实验室测试。  
### 5.1 RuntimeDefault 是否允许 AF_ALG？  
  
在两个集群上，一个被丢弃了所有能力（capabilities）、且 seccompProfile.type: RuntimeDefault  
 的非 root Pod 都成功创建了 AF_ALG 套接字。  
  
Talos 集群的结果：  
```
AF_ALG_SOCKET_OKAF_ALG_AUTHENCESN_BIND_OK
```  
  
EKS 集群的结果：  
```
AF_ALG_SOCKET_OKAF_ALG_AUTHENCESN_BIND_OK
```  
  
这本身并不证明漏洞被成功利用。它仅证明了相关的系统调用路径可以从一个普通 Pod 访问到。  
### 5.2 PSS 限制会阻止它吗？  
  
不会。在两个集群中，一个设置了 pod-security.kubernetes.io/enforce=restricted  
 的命名空间，允许了一个非 root、使用 RuntimeDefault  
 seccomp 的 Pod，而该 Pod 能够创建 AF_ALG 套接字并绑定相关的 AEAD 算法。  
  
两个集群均返回：  
```
PSS_RESTRICTED_AFALG_OK
```  
  
这不是 Kubernetes 的缺陷。PSS 限制是一个工作负载加固的基线。它并不承诺会拒绝每一个内核攻击面。  
  
更简单的要点是：不要告诉自己“PSS 限制”就意味着“AF_ALG 已被阻止”。  
### 5.3 另一个 Pod 能否观察到页缓存的变化？  
  
可以，在我们实验室中针对一个共享的 hostPath inode 进行了测试。  
  
在 Talos 上，一个位于某命名空间中的写入者 Pod 将一个临时文件在偏移量 64 处的缓存字节从 CROS  
 修改为 TLXN  
。另一个位于不同命名空间中的读取者 Pod 观察到了被修改后的字节：  
```
CROSSNS_WRITER_BEFORE 43524f53 b'CROS'CROSSNS_WRITER_AFTER  544c584e b'TLXN'CROSSNS_READER_OFFSET_64 544c584e b'TLXN'
```  
  
在 EKS 上，同样的跨命名空间测试将 CROS  
 修改为 EKXN  
：  
```
CROSSNS_WRITER_BEFORE 43524f53 b'CROS'CROSSNS_WRITER_AFTER  454b584e b'EKXN'CROSSNS_READER_OFFSET_64 454b584e b'EKXN'
```  
  
命名空间在这里不起作用，因为缓存是节点级别的，而不是命名空间级别的。  
### 5.4 该效果是否会在攻击 Pod 消失后仍然存在？  
  
是的，在我们的实验室中如此。在删除了写入者和读取者这两个 Job 之后，稍后调度到同一节点上的另一个读取者 Job 仍然观察到了被修改后的缓存字节。  
  
Talos：  
```
LIFECYCLE_READER_OFFSET_64 544c584e b'TLXN'
```  
  
EKS：  
```
LIFECYCLE_READER_OFFSET_64 454b584e b'EKXN'
```  
  
这并非磁盘上的持久化，而是存在于节点的页缓存中的持久化。重启节点或以其他方式驱逐相关的缓存页可以清除这类效果，但仅删除 Pod 本身并不能。  
### 5.5 这是否需要 hostPath？  
  
这是我们最关心的测试。hostPath 本身已经是一种高风险模式，Kubernetes 社区完全有理由问：这会不会只是“hostPath 很危险”的另一种表现形式？  
  
我们为此专门构建了一个实验用镜像，其中包含一个只读文件，位于 /copyfail-lab/target.bin  
。Pod A 使用该镜像运行，并修改了该文件的页缓存字节。Pod B 在同一节点上使用相同的镜像运行，并读取了同一个路径下的文件。  
  
在 Talos 上，Pod A 将 IMG0  
 修改为 TIMG  
，Pod B 读取到了 TIMG  
：  
```
IMAGE_WRITER_BEFORE 494d4730 b'IMG0'IMAGE_WRITER_AFTER  54494d47 b'TIMG'IMAGE_READER_OFFSET_64 54494d47 b'TIMG'IMAGE_EXPECTED_SHA256 915a6e4d52cf856e62c67cdb4e453c785c3ec6515e51dee3fd3f95e1c9d9f03aIMAGE_READER_SHA256   a18219a47a679b294ed62a16bd6a9c8b050799c5a282f3e650b63745970fa8ac
```  
  
在 EKS 上，Pod A 将 IMG0  
 修改为 EIMG  
，Pod B 读取到了 EIMG  
：  
```
IMAGE_WRITER_BEFORE 494d4730 b'IMG0'IMAGE_WRITER_AFTER  45494d47 b'EIMG'IMAGE_READER_OFFSET_64 45494d47 b'EIMG'IMAGE_EXPECTED_SHA256 915a6e4d52cf856e62c67cdb4e453c785c3ec6515e51dee3fd3f95e1c9d9f03aIMAGE_READER_SHA256   f4b6127700e72fe2c7f9293a427e7966bd66572df3a16a505364f7bd1a1448a5
```  
  
这就是与 Kubernetes 相关的关键发现：在我们测试的 Talos/containerd 和 EKS/containerd 实验室环境中，这个问题并不仅限于 hostPath。一个内置于容器镜像层中的文件，就足以让同一节点上的不同 Pod 之间产生可见性。  
  
请不要将这一结论过度推广到我们测试范围之外的场景。快照器（snapshotter）行为、存储驱动、镜像垃圾回收、页缓存驱逐策略以及运行时配置等，都会影响具体细节。但至少在我们测试的集群中，“只有挂载了 hostPath 才会出问题”这一说法是不成立的。  
## 六、这在 Kubernetes 中能获得 root 权限吗？  
  
可以，但存在重要的边界条件。  
  
在完成镜像层测试之后，我们为 Talos 和 EKS 分别构建了第二个一次性实验镜像。这些镜像中包含一个特制的 setuid-root 辅助程序，其唯一的特权行为是：当它自己的镜像层文件中的一个四字节标记发生变化时，会在其自身容器内部写入一个标记。这些辅助程序并不针对宿主机文件、包管理器管理的文件或真实的应用二进制文件。  
  
在一个丢弃了所有 Linux 能力、使用 RuntimeDefault  
 seccomp、且设置了 allowPrivilegeEscalation: true  
 的非 root Pod 中，该辅助程序在字节被篡改之前会拒绝访问，而在镜像层缓存字节被篡改之后，则成功获得了有效用户 ID（euid）0：  
```
COPYFAIL_LAB_DENY found=0 ruid=1000 euid_start=0 euid_now=1000COPYFAIL_WRITE ... before=4a4c5430 after=4a4c5431COPYFAIL_LAB_ALLOW found=1 regain=0 marker_fd=3 ruid=1000 euid_start=0 euid_now=0
```  
  
我们在 Talos/containerd 和 EKS/containerd 上都复现了相同的序列。这证明了在我们实验室环境中，只要存在一个可达的 setuid 目标，并且使用该目标的 Pod 允许权限提升，就可以实现完整的容器内提权到 root。  
  
PSS 限制改变了这一链条的后续部分。我们在 allowPrivilegeEscalation: false  
（该设置会启用 no_new_privs  
）的条件下运行了同一个被篡改的辅助程序。被篡改的字节仍然可见，但辅助程序启动时未进行 setuid 提权，也无法再获得 euid 0：  
```
COPYFAIL_LAB_ALLOW found=1 regain=-1 marker_fd=-1 errno=1 ruid=1000 euid_start=1000 euid_now=1000
```  
  
与 Kubernetes 具体相关的结果是跨 Pod 版本，该版本在两个集群上也均已复现。一个 PSS 限制下的写入者 Pod 修改了一个共享镜像层内辅助程序的缓存字节。随后，同一节点上、使用相同镜像的另一个 Pod（设置了 allowPrivilegeEscalation: true  
）观察到了被修改的镜像层字节，并成功获得了 euid 0：  
```
WRITER: COPYFAIL_WRITE ... before=4a4c4330 after=4a4c4331WRITER: COPYFAIL_LAB_ALLOW found=1 regain=-1 marker_fd=-1 euid_start=1000 euid_now=1000READER_JLC0_OFFSET -1 READER_JLC1_OFFSET 8192READER: COPYFAIL_LAB_ALLOW found=1 regain=0 marker_fd=3 ruid=1000 euid_start=0 euid_now=0
```  
  
这意味着：PSS 限制未能阻止一个 Pod 修改共享镜像层的页缓存字节，而另一个拥有可达 setuid 目标且启用了权限提升的 Pod，可以利用被修改后的缓存状态。  
  
这不意味着：我们并未证明可以获取宿主机 root 权限、实现容器逃逸，或证明每一个 PSS 限制的工作负载都能通过这一特定的 setuid 路径获得 root 权限。提权链条的结果取决于是否存在一个可达的目标，该目标能将“被修改的字节”转化为“特权执行”。  
## 七、磁盘保持干净，而缓存读取的内容已发生变化  
  
对于 hostPath 实验中的测试文件，我们比较了常规缓存读取与 O_DIRECT  
（直接 I/O）读取的结果。  
  
在 Talos 上，常规读取看到了 JLT!  
，但直接读取看到的仍然是原始的 0123  
 和原始的 SHA-256 值：  
```
NORMAL_OFFSET_64 4a4c5421 b'JLT!'NORMAL_SHA256 40879caad4634328849e0405d26e23f506ea54c86c3a8176a036c3acb4a9e39aDIRECT_OFFSET_64 30313233 b'0123'DIRECT_SHA256 d281ea21d2bc15d0f737288a081f5982ad6e08d836af73ca013ab00e469cf27f
```  
  
在 EKS 上，常规读取看到了 EKS!  
，但直接读取看到的仍然是原始的 0123  
 和原始的 SHA-256 值：  
```
NORMAL_OFFSET_64 454b5321 b'EKS!'NORMAL_SHA256 0e33005673886ecf2d6f7782dbcfca3f7ef29d09411ca4a925a6e8b83b15bb4dDIRECT_OFFSET_64 30313233 b'0123'DIRECT_SHA256 d281ea21d2bc15d0f737288a081f5982ad6e08d836af73ca013ab00e469cf27f
```  
  
这印证了 Xint 的核心观察：此类数据损坏会影响常规文件读取所看到的内容，同时却不改变持久化的文件内容。这也解释了为什么仅依赖磁盘数据的完整性检查对于这类漏洞来说是错误的控制手段。  
  
这里需要谨慎措辞。我们并不是说所有的文件完整性检测产品在所有配置下都会失效。我们的意思是：如果一个工具只校验持久化在磁盘上的字节，那么它可能会漏掉那些仅存在于页缓存中、但常规读取操作仍能观察到的内容变化。  
## 八、我们验证过的缓解措施  
  
内核打补丁是主要的修复方式。Red Hat、Ubuntu、Debian 以及其他发行版的修复状态，应通过它们各自的公告和软件包渠道来追踪，因为厂商内核经常通过向后移植（backport）来修复问题，其内核版本号与上游并不一致。  
  
请检查“禁用该内核模块”的建议在你的节点操作系统上是否真的有效。在某些 RHEL 系列的家族内核上，algif_aead  
 是直接编译进内核的，而不是作为一个可加载的模块。因此，通过 modprobe.d  
 黑名单规则或 rmmod algif_aead  
 命令来操作，即使命令执行成功，也可能并未真正移除攻击面。在将一个节点视为“已缓解”之前，请通过运行时 AF_ALG 绑定测试或使用操作系统厂商支持的控制手段来验证缓解措施的有效性。  
  
作为一种补偿性控制措施，我们测试了一个 Localhost  
 类型的 seccomp 配置文件。该配置文件在 socket()  
 系统调用的第一个参数为 AF_ALG（值为 38  
）时，拒绝该调用。在 Talos 和 EKS 上，该配置都成功阻止了漏洞路径，返回 EPERM  
 错误，并且测试目标文件的内容保持不变。  
  
Talos：  
```
AF_ALG_SOCKET_BLOCKED errno=1 strerror=Operation not permittedMITIGATED_BEFORE 61626364 b'abcd'MITIGATED_AFTER  61626364 b'abcd'
```  
  
EKS：  
```
AF_ALG_SOCKET_BLOCKED errno=1 strerror=Operation not permittedMITIGATED_BEFORE 61626364 b'abcd'MITIGATED_AFTER  61626364 b'abcd'
```  
  
我们还在 Talos 上、使用同一个拒绝 AF_ALG 的 Localhost  
 配置文件，重新运行了 setuid 辅助程序的实验室测试。写入者在 socket(AF_ALG, ...)  
 调用时失败，目标辅助程序中的标记保持原样未被篡改，因此辅助程序也没有进入被篡改后的执行路径：  
```
PermissionError: [Errno 1] Operation not permittedAFTER_JLB0_OFFSET 8192 AFTER_JLB1_OFFSET -1COPYFAIL_LAB_DENY found=0 ruid=1000 euid_start=0 euid_now=1000
```  
  
Kubernetes 并不会在 Pod YAML 中内联 seccomp 系统调用过滤规则。一个 Localhost  
 类型的配置文件必须存放在每个节点的 kubelet seccomp 配置文件路径下，然后 Pod specs 通过文件名来引用它。这意味着一个完整的修复方案包含两个部分：  
- • 将那个拒绝 AF_ALG 的 seccomp 配置文件放置到每一个需要它的节点上。  
  
- • 强制执行策略，确保不受信任的工作负载使用该配置文件，直到内核被修复为止。  
  
请不要把 Localhost  
 这个词当作什么神奇的开关。你必须自己去验证实际的配置文件内容。  
## 九、Juliet 当前可以检测什么  
  
Juliet 现已包含一个初步的 Copy Fail 扫描器，以及一个策略门控（policy gate），用于帮助那些希望在节点内核修复期间实施临时 seccomp 缓解措施的团队。  
  
该扫描器结合了三个信号：  
- • 节点 KBOM 信息：osImage  
、kernelVersion  
 和 containerRuntimeVersion  
。  
  
- • 工作负载态势：每个容器在应用了 Pod 级别的 seccomp 继承规则之后的生效 seccomp 配置文件。  
  
- • 节点本地的 seccomp 配置文件内容：Juliet 的节点代理会对 kubelet 的 Localhost  
 类型配置文件 JSON 进行哈希和解析，并验证所引用的配置文件是否确实拒绝了 socket(AF_ALG, ...)  
 调用。  
  
当一个 Pod 被调度到 Copy Fail 状态为 affected  
（受影响）或 unknown  
（未知）的节点上，并且至少有一个容器未使用经过节点验证且明确拒绝 AF_ALG 的 Localhost  
 配置文件时，Juliet 会开启一个高危级别的问题（Issue）。暴露的情况包括：使用了 RuntimeDefault  
、未设置 seccomp、使用了 Unconfined  
、使用了非 Localhost  
 的配置文件、配置文件内容缺失、解析失败，以及那些无法证明其确实执行了拒绝操作的 Localhost  
 配置文件。  
> **需要帮助检查你的集群是否存在此问题？**  
申请一次免费的 Copy Fail 暴露情况审查[4]  
，或者免费开始使用 Juliet，连接一个集群，然后打开 **Security → All Findings**  
 并搜索 Copy Fail  
 或 CVE-2026-31431  
。现有用户也可以询问 Explorer：哪些 Pod 暴露于 Copy Fail 风险下？  
  
  
我们还添加了一个名为 copyfail-require-custom-seccomp  
 的高危级别内置策略。该策略默认是禁用的，旨在为希望审计或实施此特定缓解措施的客户提供服务。该策略会标记出那些生效 seccomp 配置文件为unset  
、Unconfined  
、RuntimeDefault  
或任何非 Localhost  
 值的容器、init 容器和临时容器（ephemeral container）。  
  
一个重要的限制：Juliet 并不会仅凭内核版本字符串就断言节点 CVE 的完整修复状态。仅靠内核版本匹配是有风险的，因为厂商会向后移植（backport）修复补丁。该扫描器将我们在实验室中复现出漏洞的内核标记为 affected  
（受影响），对于我们已经验证过的、厂商声明不受影响的情况则会予以标记，否则节点状态将保持为 unknown  
（未知），直到有厂商的软件包或公告证据出现。  
## 十、Kubernetes 团队现在应该做什么  
### 10.1 首先给节点打补丁  
  
将节点内核视为唯一的信息来源。请使用你的操作系统厂商的公告和软件包渠道，而不仅仅是上游的内核语义版本。  
  
CISA 现已将 CVE-2026-31431 列入其 KEV（已知被利用漏洞）目录，因此请将此漏洞视为“优先打补丁”的工作，而不是一个理论上的 Linux 本地权限提升问题。Red Hat 将此问题评级为“重要（Important）”，并在其追踪器中将 RHEL 8、RHEL 9、RHEL 10 以及 RHEL 8/9 的 kernel-rt  
 系列列为受影响。Ubuntu 将此问题标记为“高（High）”。Debian 的追踪器则显示了不同软件包套件各自的状态。这些状态会随着软件包的更新而变化，因此请尽可能基于厂商的数据进行自动化处理。  
### 10.2 不要假设 RuntimeDefault 会阻止 AF_ALG  
  
我们测试了 Talos 和 EKS 上 containerd 的默认配置，发现 AF_ALG 是可访问的。我们目前审查过的 Moby 和 containerd 的默认配置文件也都没有拒绝 AF_ALG。  
  
如果你的临时缓解措施依赖于 seccomp，请在每个节点家族上测试其实际的运行时行为。  
### 10.3 针对不受信任的工作负载，使用一个目标明确的 Localhost seccomp 配置文件  
  
阻止所有的 socket()  
 调用会破坏工作负载。精确的控制手段是：仅当地址族为 AF_ALG 时，才拒绝 socket()  
 调用。  
  
将该配置文件应用于运行不受信任代码、CI 任务、构建运行器、多租户工作负载，或任何执行用户提供插件的命名空间。  
### 10.4 降低节点共享的风险  
  
镜像层的测试结果非常重要，因为节点上的许多 Pod 可能共享同一个下层（lower-layer）文件。在节点被打补丁之前，请减少高风险工作负载与高价值工作负载之间的不必要同节点部署：  
- • 将 CI/构建工作负载隔离到专用的节点上。  
  
- • 避免将多租户工作负载与控制平面邻近的工作负载或特权工作负载混合部署。  
  
- • 减少特权 Pod、宿主机命名空间以及宽泛的 hostPath 挂载。  
  
- • 考虑使用沙箱化运行时，但请务必进行测试。我们的两个集群都没有可用的 gVisor、Kata 或 Firecracker RuntimeClass，因此我们在此不对沙箱运行时做出任何断言。  
  
### 10.5 将可疑节点视为已被入侵  
  
仅存在于页缓存中的数据损坏是暂时的，但一个利用此漏洞的进程可能会利用其获得的访问权限，在其他地方进行持久化的更改。如果你怀疑节点被利用，请打补丁或替换该节点，并调查其上运行过的工作负载。  
  
运行时信号（例如来自本不应需要内核加密 API 的工作负载的、意外的 AF_ALG 或 authencesn  
 套接字活动）是有用的排查信号。但仅凭套接字的创建并不能作为 Copy Fail 漏洞已被成功利用的证据。请将其视为一个高信号的事件线索，然后保留证据并遵循你的事件响应流程来处理节点问题。  
## 十一、我们证明了什么，没有证明什么  
  
现有的事实已经足够说明问题，无需夸大。  
  
我们确实在 Talos/containerd 和 EKS/containerd 上，证明了当一个设置了 allowPrivilegeEscalation: true  
 的 Pod 使用了来自共享镜像层的、且已被篡改的特制 setuid 辅助程序时，可以实现一个受控的容器内 root 提权链条。  
  
请不要声称每个 Kubernetes 集群都存在此漏洞。该结果取决于正在运行的内核、厂商补丁、运行时配置以及工作负载策略。  
  
请不要声称“容器逃逸”或“宿主机 root 权限沦陷”是必然发生的。这是一个强大的本地内核原语，但节点是否被攻陷，取决于可访问的目标文件、命名空间、挂载点、工作负载行为，以及攻击者能否诱使另一个进程去读取或执行特定内容。  
  
请不要声称仅凭 PSS 限制就能让此漏洞变得无害。在我们的实验室中，PSS 限制确实阻止了受限 Pod 内部的 setuid 提权交接，但它并没有阻止该 Pod 去篡改共享镜像层的缓存字节，而这些被篡改的字节随后被另一个 Pod 所消费。  
  
请不要声称文件完整性检测工具总是会失效。请精确地表述：仅检查磁盘数据的检测方式，可能会遗漏仅存在于页缓存中的变化。  
  
请不要在未经测试的情况下断言沙箱化运行时可以缓解此漏洞。它们可能会改变风险模型，但我们在两个受测集群中都没有可用的沙箱 RuntimeClass。  
## 十二、常见问题解答  
### 12.1 这是一个 Kubernetes 漏洞吗？  
  
不是。CVE-2026-31431 是一个 Linux 内核漏洞。Kubernetes 之所以重要，是因为节点上的 Pod 共享宿主机的内核，并且在我们测试的场景中，页缓存的篡改效果在同一节点的不同 Pod 之间是可见的。  
### 12.2 Pod 安全标准限制（PSS Restricted）能阻止它吗？  
  
不能，至少在我们的测试中不能。PSS 限制允许了一个非 root、使用 RuntimeDefault  
 seccomp 的 Pod，而该 Pod 能够创建 AF_ALG 套接字并绑定相关的 AEAD 算法路径。  
### 12.3 RuntimeDefault 级别的 seccomp 能阻止它吗？  
  
不能，在我们测试的 Talos/containerd 和 EKS/containerd 集群中不能。RuntimeDefault  
 是由运行时定义的。我们检查过的常见运行时默认配置都没有拒绝 AF_ALG。  
### 12.4 这能获得 root 权限吗？  
  
在我们进行的 Talos 和 EKS 实验室测试中，在特定条件下可以实现容器内的 root 权限：即在特定构建的镜像层中存在一个可达的 setuid 目标，并且使用该目标的 Pod 设置了 allowPrivilegeEscalation: true  
。我们并未证明能够获取宿主机 root 权限或实现容器逃逸；并且在我们的测试中，allowPrivilegeEscalation: false  
 这一设置阻止了受限 Pod 内部的 setuid 提权交接。  
### 12.5 这需要用到 hostPath 吗？  
  
不需要，在我们的测试中不需要。我们仅使用一个特制的容器镜像层就复现了跨 Pod 的页缓存可见性。hostPath 在通过 O_DIRECT  
 证明“磁盘 vs. 页缓存”行为差异时很有用，但镜像层测试结果并不依赖它。  
### 12.6 我应该阻止什么？  
  
如果使用 seccomp 作为补偿性控制措施，请在 socket()  
 系统调用的第一个参数（arg0）是 AF_ALG（值为 38  
）时拒绝该调用。请验证节点本地的实际配置文件内容，并测试其运行时行为。最终的修复方案仍是为内核打补丁。  
## 参考链接  
- •   
CVE-2026-31431 记录[2]  
  
- •   
CVE-2026-31431 的 NVD 条目[5]  
  
- •   
CISA KEV 目录中 CVE-2026-31431 的条目[6]  
  
- •   
CISA：CVE-2026-31431 被添加到 KEV[7]  
  
- •   
Microsoft Security：Copy Fail 漏洞导致 Linux root 权限在云环境中提升[8]  
  
- •   
Xint：Copy Fail[3]  
  
- •   
copy.fail[9]  
  
- •   
Linux 稳定版修复提交 fafe0fa2[10]  
  
- •   
Linux 稳定版修复提交 ce42ee42[11]  
  
- •   
Linux 稳定版修复提交 a664bf3d[12]  
  
- •   
Red Hat CVE 数据[13]  
  
- •   
Red Hat 安全公告 RHSB-2026-02[14]  
  
- •   
Red Hat：OpenShift CVE-2026-31431 缓解措施[15]  
  
- •   
Red Hat：ROSA Classic 和 OpenShift Dedicated 的 CVE-2026-31431 缓解措施[16]  
  
- •   
Amazon Linux CVE 数据[17]  
  
- •   
Ubuntu CVE 数据[18]  
  
- •   
Ubuntu：Copy Fail 修复可用[19]  
  
- •   
Debian 安全追踪器[20]  
  
- •   
AlmaLinux：Copy Fail 补丁已发布[21]  
  
- •   
CloudLinux：Copy Fail 内核更新[22]  
  
- •   
SUSE：对 Copy Fail 的回应[23]  
  
- •   
CIQ：Rocky Linux CVE-2026-31431 缓解措施[24]  
  
- •   
Sidero Labs：Copy Fail 与 Talos Linux[25]  
  
- •   
Kubernetes Pod 安全标准[26]  
  
- •   
Kubernetes seccomp 文档[27]  
  
- •   
Kubernetes Linux 内核安全约束[28]  
  
- •   
Docker seccomp 文档[29]  
  
- •   
Moby 默认 seccomp 配置文件[30]  
  
- •   
containerd 默认 seccomp 配置文件[31]  
  
- •   
Linux 套接字地址族常量[32]  
  
#### 引用链接  
  
[1]  
 《Copy Fail in Kubernetes: RuntimeDefault Did Not Block AF_ALG》: https://juliet.sh/blog/we-tested-copy-fail-in-kubernetes-pss-restricted-runtime-default-af-alg  
[2]  
 CVE-2026-31431: https://cveawg.mitre.org/api/cve/CVE-2026-31431  
[3]  
 Copy Fail: https://xint.io/blog/copy-fail-linux-distributions  
[4]  
 申请一次免费的 Copy Fail 暴露情况审查: https://juliet.sh/copy-fail-review  
[5]  
 CVE-2026-31431 的 NVD 条目: https://nvd.nist.gov/vuln/detail/CVE-2026-31431  
[6]  
 CISA KEV 目录中 CVE-2026-31431 的条目: https://www.cisa.gov/known-exploited-vulnerabilities-catalog?field_cve=CVE-2026-31431  
[7]  
 CISA：CVE-2026-31431 被添加到 KEV: https://www.cisa.gov/news-events/alerts/2026/05/01/cisa-adds-one-known-exploited-vulnerability-catalog  
[8]  
 Microsoft Security：Copy Fail 漏洞导致 Linux root 权限在云环境中提升: https://www.microsoft.com/en-us/security/blog/2026/05/01/cve-2026-31431-copy-fail-vulnerability-enables-linux-root-privilege-escalation/  
[9]  
 copy.fail: https://copy.fail/  
[10]  
 Linux 稳定版修复提交 fafe0fa2: https://git.kernel.org/stable/c/fafe0fa2995a0f7073c1c358d7d3145bcc9aedd8  
[11]  
 Linux 稳定版修复提交 ce42ee42: https://git.kernel.org/stable/c/ce42ee423e58dffa5ec03524054c9d8bfd4f6237  
[12]  
 Linux 稳定版修复提交 a664bf3d: https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
[13]  
 Red Hat CVE 数据: https://access.redhat.com/security/cve/cve-2026-31431  
[14]  
 Red Hat 安全公告 RHSB-2026-02: https://access.redhat.com/security/vulnerabilities/RHSB-2026-02  
[15]  
 Red Hat：OpenShift CVE-2026-31431 缓解措施: https://access.redhat.com/solutions/7141979  
[16]  
 Red Hat：ROSA Classic 和 OpenShift Dedicated 的 CVE-2026-31431 缓解措施: https://access.redhat.com/articles/7141989  
[17]  
 Amazon Linux CVE 数据: https://explore.alas.aws.amazon.com/CVE-2026-31431.html  
[18]  
 Ubuntu CVE 数据: https://ubuntu.com/security/CVE-2026-31431  
[19]  
 Ubuntu：Copy Fail 修复可用: https://ubuntu.com/blog/copy-fail-vulnerability-fixes-available  
[20]  
 Debian 安全追踪器: https://security-tracker.debian.org/tracker/CVE-2026-31431  
[21]  
 AlmaLinux：Copy Fail 补丁已发布: https://almalinux.org/blog/2026-05-01-cve-2026-31431-copy-fail/  
[22]  
 CloudLinux：Copy Fail 内核更新: https://blog.cloudlinux.com/cve-2026-31431-copy-fail-kernel-update  
[23]  
 SUSE：对 Copy Fail 的回应: https://www.suse.com/c/suse-responds-to-the-copy-fail-vulnerability/  
[24]  
 CIQ：Rocky Linux CVE-2026-31431 缓解措施: https://kb.ciq.com/article/rocky-linux/rl-cve-2026-31431-mitigation  
[25]  
 Sidero Labs：Copy Fail 与 Talos Linux: https://www.siderolabs.com/blog/exploit-fail-cve-2026-31431-copy-fail-barely-scratches-talos-linux/  
[26]  
 Kubernetes Pod 安全标准: https://kubernetes.io/docs/concepts/security/pod-security-standards/  
[27]  
 Kubernetes seccomp 文档: https://kubernetes.io/docs/tutorials/security/seccomp/  
[28]  
 Kubernetes Linux 内核安全约束: https://kubernetes.io/docs/concepts/security/linux-kernel-security-constraints/  
[29]  
 Docker seccomp 文档: https://docs.docker.com/engine/security/seccomp/  
[30]  
 Moby 默认 seccomp 配置文件: https://raw.githubusercontent.com/moby/profiles/main/seccomp/default.json  
[31]  
 containerd 默认 seccomp 配置文件: https://raw.githubusercontent.com/containerd/containerd/main/contrib/seccomp/seccomp_default.go  
[32]  
 Linux 套接字地址族常量: https://raw.githubusercontent.com/torvalds/linux/master/include/linux/socket.h  
  
   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Kric7mM9eA5BYOHlxY4UaFrKXcCcOyR4MFkPRWicx9iaVQzBjwONMoxYpdpUcuE9yKNKHfljR6EkRdvgMWibTecibialvMv9408NtibMLGCibetHk0Q/640?wx_fmt=gif&from=appmsg "")  
  
  
  
**交流群**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Kric7mM9eA5BfIUMuzOPrKOYdopiciauvfKwA5z33V2yR00CkOGWfhElHIRWibMLGFUTghMcWYvu4WztdkRBEYYXiaGgVofR6zrg3iaiab5JOUse6Q/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
