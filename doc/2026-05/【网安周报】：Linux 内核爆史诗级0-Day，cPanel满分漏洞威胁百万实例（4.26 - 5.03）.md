#  【网安周报】：Linux 内核爆史诗级0-Day，cPanel满分漏洞威胁百万实例（4.26 - 5.03）  
原创 极客零零七
                    极客零零七  极客零零七   2026-05-03 22:01  
  
#   
> **导语：**  
  
各位极客，五一假期过得如何？在这个本该放松的黄金周里，网络安全圈却如同经历了连环大地震。  
> 潜伏 9 年的 Linux 内核 0-Day 被 AI 揪出、cPanel 爆出 CVSS 9.8 分认证绕过漏洞、PyTorch Lightning 等开源包遭精准投毒……黑客们显然没有放假。  
> 以下是本周【极客零零七】为您梳理的全球最具威胁的网络安全事件，请火速核查你的资产清单！  
  
## 01. 核弹级漏洞与在野利用 (In-the-Wild Exploits)  
### 1. 史诗级 Linux 0-Day：“Copy Fail” (CVE-2026-31431) 曝光  
  
本周最具爆炸性的漏洞，非**Copy Fail**  
 莫属。这个潜伏在Linux内核 authencesn  
 密码学模板中长达9年的逻辑漏洞，让安全圈倒吸一口凉气。  
- **漏洞危害**  
：攻击者仅需**732 字节**  
（一个单文件）的Python脚本，无需任何条件竞争，就能在所有2017年后发布的Linux发行版上实现100% 稳定提权至 Root。  
  
- **可怕之处**  
：它通过越界写入污染内存的 Page Cache（页缓存），磁盘上的文件 Hash 完好无损，能完美绕过传统的主机文件完整性监控 (FIM)。  
  
- **修复建议**  
：尽快升级内核，或通过 echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif-aead.conf  
 临时禁用受影响模块。  
  
- [[技术深潜] 潜伏9年的Copy-Fail：内核0-Day通杀Root](https://mp.weixin.qq.com/s?__biz=Mzk2NDgwNjA2NA==&mid=2247486454&idx=1&sn=7e34cb7fef20cd52fc7c1c81693fbba7&scene=21#wechat_redirect)  
  
  
### 2. DarkSword iOS 利用链持续扩散，多个 APT 团伙跟进采用  
  
3 月由 Google、Lookout、Jamf 等团队联合披露的 iOS 利用链 **DarkSword**  
，本周仍在野持续利用，多家 APT 团伙跟进。  
- **技术细节**  
：链式利用 **6 个漏洞**  
（含 CVE-2026-20700 等 **3 个 0-Day**  
），影响 **iOS 18.4 – 18.6.2**  
。攻击者通过感染合法网站植入恶意 JavaScript，利用 JavaScriptCore JIT 漏洞与 GPU 沙箱逃逸完成 **Zero-Click**  
，无需用户任何交互即可完成入侵，重点窃取凭据与加密钱包数据。  
  
- **追踪情报**  
：已被疑似俄国家背景的 **UNC6353**  
 与土耳其商业间谍商 **PARS Defense**  
 客户采用，PARS 客户在土耳其境内的活动可追溯至 2025 年 11 月。  
  
### 3. cPanel 惊爆 CVSS 9.8 满分认证绕过漏洞，约 150 万实例暴露公网  
  
4 月 28 日，cPanel & WHM 爆出极其严重的身份验证绕过漏洞 (**CVE-2026-41940**  
)，**Shodan 数据显示约 150 万 cPanel 实例暴露公网**  
，全部受影响。  
- **技术细节**  
：CRLF 注入 + Session 文件双存储竞态——攻击者可向 session 注入 user=root / hasroot=1 / tfa_verified=1  
，**直接绕过密码与 2FA**  
。  
  
- **影响**  
：攻击者无需任何凭证即可获得目标服务器 **Root 级 WHM 控制权**  
，且在野利用早于补丁约两个月。请所有运维人员立即执行系统更新。  
  
## 02. AI 攻防与开源供应链 (AI Sec & Supply Chain)  
### 1. PyTorch Lightning等开源包遭精准投毒，恶意版本锁定 v2.6.2/2.6.3  
  
本周连续爆出两起重大开源投毒事件：  
- **4 月 29 日**  
：大量 **SAP 相关 npm 包**  
被植入凭据窃取后门，Onapsis、Aikido、Wiz 等联合警示。  
  
- **4 月 30 日**  
：**PyTorch Lightning**  
 在 PyPI 上的 **v2.6.2 / v2.6.3**  
 版本被植入恶意 _runtime  
 目录与混淆 JavaScript 载荷；Aikido、OX Security、Socket、StepSecurity 同步发出警报。  
  
- **细节**  
：恶意载荷在 import lightning  
 时**自动执行**  
，无需任何额外用户操作。开发者若使用自动化脚本拉取最新依赖，将直接中招。请立即排查 CI/CD 与生产镜像中的版本锁定。  
  
### 2. AI 掀起“挖洞狂潮”：Project Glasswing 碾压人类专家  
  
Anthropic 公开 **Project Glasswing**  
 计划进展：前沿模型 **Claude Mythos Preview**  
 已在所有主流操作系统和浏览器中挖出**数千个高危漏洞**  
，其中不乏潜伏十余年未被人类与 Fuzzer 发现的深层 Bug。当前访问受限于 AWS、Apple、Cisco、CrowdStrike、Google、Microsoft 等约 50 家组织。  
- **极客辣评**  
：更扎心的是 Anthropic 自己披露**这些漏洞修复率不到 1%**  
——AI 找漏洞的速度已经远超工业界修补的节奏。攻防成本彻底失衡，安全工程师的工单恐怕要排到明年。  
  
## 03. 勒索风暴与内鬼疑云 (Ransomware & Insider Threats)  
### 1. 安全圈“无间道”：前应急响应专家因参与 BlackCat 勒索被判刑  
  
前 Sygnia 应急响应经理 **Ryan Goldberg**  
 与前 DigitalMint 谈判员 **Kevin Martin**  
，各被法院判处 **4 年监禁**  
。两人利用"安全防守方"的内部知识反向加入 **BlackCat (ALPHV)**  
 团伙，自 2023 年起对 5 家美企（医疗、制药、工程、无人机制造）发动精准勒索，获利约 120 万美元。**第三共犯 Angelo John Martino III 将于 7 月 9 日宣判，最高面临 20 年。**  
 日防夜防，家贼难防。  
### 2. VECT 2.0 勒索翻车：超过 131KB 的文件连勒索者本人都解不开  
  
**VECT 2.0**  
 勒索软件横扫 Windows、Linux 与 ESXi 环境，但 Check Point 研究将其定性为 **"Ransomware by design, Wiper by accident"**  
——名为勒索，实为擦除器。  
- **致命 Bug**  
：ChaCha20-IETF 加密实现存在 nonce 处理缺陷，**超过 131,072 字节（128 KB）的文件，4 个 nonce 中 3 个会被丢弃**  
。结果是任何超过 131KB 的文件都**无法被还原，连勒索者本人也无解**  
——交赎金也救不回数据。  
  
- **平台差异**  
：ESXi 变种带地理围栏与反调试，并通过 SSH 横向移动；Linux 版与 ESXi 同源，功能子集。  
  
> **零零七安全建议：**  
  
节后返工第一天，请各位运维和安全老哥务必做好两件事：  
> 排查 Linux 服务器内核版本，跟进 Copy-Fail 漏洞的修复方案；检查代码仓库中的开源依赖，特别是版本号敏感的第三方包。  
  
  
保持敬畏，保持更新。更多硬核前沿网安资讯与技术拆解，敬请关注【极客零零七】！  
  
  
