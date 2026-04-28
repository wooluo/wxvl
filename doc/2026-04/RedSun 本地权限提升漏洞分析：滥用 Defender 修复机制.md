#  RedSun 本地权限提升漏洞分析：滥用 Defender 修复机制  
Cristian Rubio
                    Cristian Rubio  securitainment   2026-04-28 05:10  
  
<table><tfoot><tr><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://www.coresecurity.com/blog/analysis-redsun-local-privilege-escalation-defender-remediation-abuse</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Cristian Rubio</span></section></td></tr></tfoot></table>  
Fortra 情报与研究专家团队 (FIRE) 对 RedSun 展开了深入分析。RedSun 是研究人员 "Chaotic Eclipse" 发布的最新概念验证漏洞利用，该研究人员此前曾披露 BlueHammer。RedSun 于 2026 年 4 月发布，在来源与技术手法上均与 BlueHammer 一脉相承，通过滥用 Microsoft Defender 逻辑及文件系统时序与路径混淆来实现权限提升。  
  
随着 "RedSun" 漏洞的公开，本文对其内部机制进行技术层面的深度剖析。该漏洞揭示了一类引人关注的逻辑缺陷：防御性工具在与复杂操作系统特性交互时，可被利用以危害其本应保护的系统。  
  
RedSun 是一个本地权限提升 (LPE) 漏洞，通过滥用 Windows Defender、Windows Cloud Files API (cfapi) 与 NTFS Reparse Points 三者之间的交互来实现任意文件覆写。攻击者利用 TOCTOU (Time-of-Check to Time-of-Use) 竞争条件，可迫使高权限防病毒服务覆写关键系统二进制文件，最终获得 NT AUTHORITY\SYSTEM 权限。  
  
以下内容对 RedSun 漏洞利用链、执行前提条件及其遗留痕迹逐一展开说明。  
## Exploit 执行链  
  
RedSun PoC 通过一系列步骤运行：引诱反病毒引擎、以文件锁挂起其执行线程，并将修复操作重定向至受保护的系统目录。  
### 阶段 1：诱饵创建与 EICAR 触发  
  
该 exploit 首先在 %TEMP% 下创建临时工作目录，并在目录内释放名为 TieringEngineService.exe 的诱饵可执行文件。为确保反病毒引擎立即响应，将标准 EICAR 反病毒测试字符串写入该文件。为规避对 PoC 二进制文件本身的静态签名检测，EICAR 字符串以逆序形式存储，在写入磁盘前于内存中动态还原。  
### 阶段 2：Cloud Files API (CfAPI) 注册  
  
该 exploit 的关键环节在于对 Windows Cloud Files API 的滥用。PoC 将临时目录注册为 Cloud Sync Root (CfRegisterSyncRoot)，并连接回调提供程序 (CfConnectSyncRoot)，随后将诱饵可执行文件转换为云占位符文件 (CfCreatePlaceholders)。此机制使该 exploit 的用户态回调能够拦截并操控系统对该文件的后续访问。  
### 阶段 3：通过 Oplocks 建立 TOCTOU 窗口  
  
为构造竞争条件，该 exploit 通过 FSCTL_REQUEST_BATCH_OPLOCK 对诱饵文件申请批量机会锁 (Batch Opportunistic Lock, Oplock)。当实时防护引擎扫描新创建的 EICAR 文件时，Cloud Files 回调被触发，Oplock 随即生效。持有该文件打开句柄的高特权反病毒线程由此被挂起，形成所需的检查时间到使用时间 (Time-of-Check to Time-of-Use, TOCTOU) 窗口。  
### 阶段 4：通过 Reparse Points 实现路径重定向  
  
杀毒引擎处于挂起状态期间，该 exploit 对文件系统结构执行以下动态修改：  
1. 对原始临时目录重命名 (例如追加 .TMP 后缀)，使其脱离原始路径。  
  
1. 在原始路径的精确位置重建新目录。  
  
1. 将该新目录转换为指向 \??\C:\Windows\System32 的 NTFS Mount Point (directory junction)。  
  
### 阶段 5：利用修复流程实施攻击  
  
目录结构完成替换后，该 exploit 释放 Oplock，杀毒引擎随即恢复运行。此时引擎的修复逻辑将目标路径下的文件识别为用户 %TEMP% 目录中带有云标记的恶意文件，并尝试对其执行"还原"或覆盖操作以消除威胁。由于引擎以 NT AUTHORITY\SYSTEM 权限运行，而该路径已通过 junction 重定向至 System32，杀毒软件在毫无察觉的情况下写入 C:\Windows\System32\TieringEngineService.exe，以攻击者控制的文件内容覆盖合法的 Windows 服务二进制文件。  
### 阶段 6：权限提升与执行  
  
系统文件被成功覆盖后，PoC 将自身可执行文件写入已被篡改的 TieringEngineService.exe。随后初始化 COM，并调用与 Tiering Management Engine 关联的特定 COM class ({50d185b9-fff3-4656-92c7-e4018da4361d})。此操作触发 Service Control Manager 以 NT AUTHORITY\SYSTEM 身份启动被覆盖的服务。payload 在 SYSTEM 上下文中执行时，复制一个特权 token 并将其分配至当前活跃用户会话，继而启动交互式控制台进程 (conhost.exe)，攻击者由此获得完整的管理员控制权限。  
## 环境前提条件与失败条件  
  
RedSun 成功执行依赖以下几项环境因素同时满足：  
- **实时保护处于激活状态：**  
杀毒引擎须处于运行状态，持续扫描文件创建事件，并配置为自动修复或隔离威胁。  
  
- **Cloud Files API 可用性：**  
系统须支持 cfapi.dll，且允许标准用户与其交互 (通常在 Windows 10/Server 2016 及更高版本中具备此能力)。  
  
- **挂载点创建不受限制：**  
该漏洞利用依赖标准用户创建目录联接点、使其指向特权路径 (如 C:\Windows\System32) 的能力。  
  
- **服务覆写可行性：**  
目标服务 TieringEngineService.exe 在 AV 引擎执行修复阶段获取写入权限时，须处于未锁定状态，且其运行方式不得阻断该写入操作。  
  
## 检测可观测项  
  
防御者可通过监控以下行为异常，检测 RedSun 及同类逻辑利用技术：  
- **可疑的 CfAPI 调用：**  
监控经由 CldApi.dll 注册 Cloud Sync Roots 的非预期或未授权进程，重点关注从 %TEMP% 或 %APPDATA% 启动的二进制文件。  
  
- **Oplock 与联接点的组合序列：**  
对下列操作序列触发告警——进程对某文件请求批量 Oplock，随即删除或重命名其父目录，并创建指向关键系统路径 (C:\Windows\System32、C:\Program Files) 的挂载点。  
  
- **AV 进程异常行为：**  
监控 EDR 遥测数据，识别 Antimalware Service Executable (MsMpEng.exe 或同类进程) 对 C:\Windows\System32 内已知系统二进制文件执行写入或覆写操作的实例。  
  
- **EICAR 告警与服务修改的时序关联：**  
若 EICAR 告警 (常因被认定为测试行为而被忽略) 在系统服务发生非预期变更或 COM 对象实例化前数毫秒触发，须将该情况标记为高度可疑。  
  
- **命名管道异常：**  
关注由 SYSTEM 级进程创建或访问的未授权命名管道 (如 \??\pipe\REDSUN)，尤其是该进程随后衍生了交互式 shell (conhost.exe、cmd.exe) 的情况。  
  
## 最终思考  
  
RedSun 揭示了现代操作系统安全领域中一项持续存在的挑战：防御软件与复杂文件系统特性之间的交汇边界。攻击者将杀毒引擎的修复能力转化为任意文件覆写原语，得以在无需依赖内存破坏的前提下绕过传统访问控制机制。缓解此类威胁需采用纵深防御策略，将严格的策略管控 (如限制非特权用户创建挂载点及访问 CfAPI) 与健壮的行为监控相结合，以识别 TOCTOU 攻击所特有的、快速且异常的文件系统操作序列。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSh6IuYW6GtDPibDMe358UKmvSE0SL9mW5hZfOYj0OGH7zicsVHflmZwPCALXTgQhIzJh9KdJIKH7OibJ2nNT9icIpVlDozX0oVXbqI/640?wx_fmt=png&from=appmsg "")  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
