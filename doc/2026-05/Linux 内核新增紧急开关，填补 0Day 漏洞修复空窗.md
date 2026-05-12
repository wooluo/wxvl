#  Linux 内核新增紧急开关，填补 0Day 漏洞修复空窗  
 FreeBuf   2026-05-12 12:50  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
  
  
Linux 服务器管理员或将获得在操作系统内核中临时禁用漏洞功能的能力——前提是开源社区采纳内核开发者提出的这项建议。该机制可在 0Day 漏洞补丁发布前作为临时防护措施。  
  
  
**Part01**  
## 内核级防护新思路  
  
  
Nvidia 杰出工程师、Linux 长期支持版与稳定版内核联合维护者 Sasha Levin 提出，应为特权操作者设计"紧急禁用开关"机制。他在近期发文中指出："漏洞曝光后，整个服务器集群会持续暴露风险，直到完成内核补丁构建、分发与重启。对多数情况而言，最简单的缓解措施就是停止调用存在缺陷的函数。"Levin 与同事还提交了内核禁用开关的代码实现草案。  
  
  
"对大多数用户来说，"Levin 强调，"‘某个套接字功能临时失效’的代价，远低于继续运行已知存在漏洞的内核等待补丁发布。"  
  
  
该提议正值 Linux 曝出多个高危漏洞之际，包括：  
  
- Copy Fail（CVE-2026-31431）：逻辑缺陷漏洞，可被利用获取 root 权限  
  
  
- Dirty Frag：通过组合 Linux 内核内存页碎片处理缺陷（CVE-2026-43284）与 RxRPC 网络协议漏洞（CVE-2026-43500）实施的攻击。  
  
**Part02**  
## 安全社区激烈反对  
  
  
该提案引发信息安全从业者的激烈争论。在 Reddit 的 r/cybersecurity 论坛中，用户将其评价为"糟糕的主意"、"荒谬"、"极度危险"。有参与者警告："人们会滥用禁用开关替代补丁安装。"  
  
  
技术层面也有质疑声：禁用开关虽能终止特定功能，但会关闭已具备"故障"状态处理能力的高级入口点。一位用户表示："熟悉 Linux 运行机制者无需此功能——Dirty Frag 漏洞利用代码发布两小时内，我就完成了分析与防护方案；而不了解内核原理者，本就不该使用任何禁用开关。"  
  
  
**Part03**  
## 专家持审慎态度  
  
  
加拿大深度湾网络安全公司 CTO Kellman Meghu 指出："理论上很美好，但考虑到变更控制仍需严格测试，其防护效率未必优于现有流程。开发者可以说‘直接卸载内核模块’，但难点在于向业务部门证明服务不受影响——这反而暴露出系统加固流程的缺陷。"  
  
  
Meghu 预见两大问题：  
  
1. 多数管理员难以评估禁用功能对业务服务的影响。禁用开关或对 Copy Fail 有效，但作为通用方案？需投入时间在生产环境外验证功能禁用后果。  
  
  
1. 对企业级应用而言，单纯启用禁用开关并非可靠策略。  
  
  
Enderle 集团分析师 Robert Enderle 认为这是典型的"应急破窗"工具："对企业管理员，这能有效应对 0Day 披露与补丁部署的时间差。在高可用环境中，无需重启就能禁用正被利用的非关键功能（如冷门网络协议），堪称重大突破——用边缘功能换取系统即时完整性。"但他同时警告："该机制可能沦为延缓打补丁的借口，且存在误操作风险。若管理员错误禁用关键内存管理功能，系统将立即崩溃。"  
  
  
**Part04**  
## 红帽表态支持  
##   
  
Linux 发行商红帽对该方案表示认可。其核心平台副总裁 Mike McGrath 称："我们支持在内核集成禁用开关功能，特别是当 LLM 驱动的扫描加剧漏洞利用速度与危害时。虽然补丁是解决 CVE 的关键，但常伴随业务中断。大规模运营机构必须在防护与业务连续性间权衡，因此红帽始终倡导通过多种途径提供无中断缓解方案，为正式补丁部署争取时间。"  
  
****  
**参考来源：**  
  
Linux kernel maintainers suggest a ‘kill switch’ to protect systems until a zero-day vulnerability is patched  
  
https://www.csoonline.com/article/4169659/linux-kernel-maintainers-suggest-a-kill-switch-to-protect-systems-until-a-zero-day-vulnerability-is-patched.html  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337545&idx=1&sn=772e37039accf79521a5b80e0032e89f&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
