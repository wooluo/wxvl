#  【漏洞预警】更新iOS 18.6也逃不掉 DarkSword内核漏洞利用  
 Ots安全   2026-04-08 04:50  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
近日，GitHub仓库rooootdev/lara（WIP darksword kexploit implement）引发安全社区关注。该工具实现了针对  
iOS 18.6（及部分相邻版本）的内核级利用（kexploit），可实现完整文件系统访问与root权限获取。开发者明确表示，Lara最高支持至iOS 18.7.1 / iOS 26.0.1，相关漏洞已在后续版本中被修补。  
  
事件概况  
  
Lara基于DarkSword exploit chain开发，目前已在iPhone SE2（iOS 18.1.1）、iPhone XS Max（iOS 18.6）等设备上测试通过。通过侧载IPA后运行“Run All”即可触发DarkSword内核利用+沙箱逃逸，实现完全root权限与文件系统读写。社区反馈显示，该实现已在部分设备上取得完整filesystem access。  
  
DarkSword是一条真实世界的iOS全链式攻击链，涉及多个零日或已知漏洞，主要通过Safari浏览器访问恶意网页即可发起静默妥协，已被多家商业监视厂商及疑似国家行为体在实际行动中使用。其影响范围覆盖iOS 18.4至18.7系列，最高可导致设备被完全控制并部署后门载荷。  
  
攻击链与TTPs简析  
- 初始访问：主要依赖WebKit/JavaScriptCore内存破坏漏洞（如CVE-2025-31277、CVE-2025-43529等），通过精心构造的网页触发。  
  
- 权限提升：利用内核读写原语（kernel r/w），绕过PAC（Pointer Authentication Codes）等防护，最终实现sandbox escape与root。  
  
- DarkSword核心：链式组合多漏洞（含JavaScriptCore JIT优化/类型混淆、垃圾回收bug等），构建arbitrary read/write能力，进而部署GHOSTBLADE、GHOSTKNIFE等最终载荷。  
  
- Lara实现特点：当前为WIP状态，集成DarkSword kexploit，操作相对简化（侧载IPA后一键触发）。支持范围明确上限为18.7.1/26.0.1，之后版本已打补丁。  
  
影响范围与受害者画像  
- 受影响版本：iOS 18.4 ~ 18.7.1（含18.6），对应iPhone XS及更新机型、iPad相应型号。  
  
- 高风险场景：未及时更新设备的普通用户、依赖旧版本的企业/机构设备、越狱/测试环境。  
  
- 实际威胁：DarkSword已被观察到用于真实间谍活动，一旦触发可实现持久化控制。Lara的公开实现可能被低技术门槛攻击者借鉴，用于本地物理访问或侧载场景下的权限提升测试。  
  
检测建议  
- 检查设备系统版本，优先升级至iOS 18.7.3及以上或iOS 26系列（已包含针对DarkSword的多项修复）。  
  
- 监控异常Safari活动、未知IPA侧载行为、内核级读写异常日志。  
  
- 企业环境建议启用严格MDM策略，限制侧载并强制更新；开启Lockdown Mode可进一步降低WebKit相关风险。  
  
- 蓝队可关注JavaScriptCore相关崩溃或异常内存操作作为早期信号。  
  
缓解与修复措施（优先级排序）  
1. 立即更新系统：升级至最新iOS版本，Apple已在iOS 18.6及后续补丁中逐步修复相关内存破坏与状态管理问题。  
  
1. 避免侧载未知IPA：仅从可信来源安装应用，禁用“信任企业开发者”选项。  
  
1. 启用安全功能：开启“锁定模式”（Lockdown Mode），限制WebKit高级功能。  
  
1. 监控与响应：定期审查系统日志，出现可疑内核行为时隔离设备并进行取证。  
  
1. 长期建议：对于高价值设备，考虑使用最新硬件并保持系统在支持周期内。  
  
总结  
  
Lara仓库的出现标志着DarkSword相关内核利用技术走向公开化与社区实现阶段，虽然目前仍为WIP，但已能在特定iOS 18.6设备上实现完整root访问。这再次提醒我们，及时打补丁是防御浏览器驱动攻击链的最有效手段。建议所有iOS用户检查并更新系统，避免在易受影响版本上进行高风险操作。  
  
项目：  
  
https://github.com/rooootdev/lara  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0FRMVZUq8Lj4RqbUf5RygcOIVTicIorZUK4Cg5CJg2HptMvdb5LxbNiaM8oln7M45oIFQ9Qmuj5rzTxQWzwZcL1QnrgRQgzjYbB8/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
