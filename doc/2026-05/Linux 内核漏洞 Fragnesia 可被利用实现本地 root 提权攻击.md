#  Linux 内核漏洞 Fragnesia 可被利用实现本地 root 提权攻击  
鹏鹏同学
                    鹏鹏同学  黑猫安全   2026-05-15 06:24  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DYqn7TU9icq3iba46uk2icyjr5ic1U56DMLkdbBSj6W3TSicDG1cgC5zn3jbWBULG7EW3icJanoV4AS2BdibIEod3OFmkaYDYFSYTQk0wVPek1NDvY/640?wx_fmt=png&from=appmsg "")  
  
研究人员披露了一处全新 **Linux 内核提权漏洞**  
，漏洞命名为 **Fragnesia**  
，漏洞编号 **CVE-2026-46300**  
，CVSS 评分 **7.8**  
。该漏洞存在于 XFRM TCP 封装 ESP 子系统中，本地攻击者可通过破坏内核页缓存，**获取完整 Root 最高权限**  
。  
  
安全专家警示该漏洞风险极高：低权限攻击者即可篡改内存中的只读文件，进而完全控制受影响系统。此漏洞由 V12 安全团队的威廉・鲍林发现，Wiz 安全公司发布了详细技术分析报告。  
  
Wiz 发布的报告指出：**该漏洞允许无特权本地攻击者篡改内核页缓存中的只读文件内容**  
，攻击者可借助可复现的页缓存损坏行为，最终提升至 Root 权限。  
  
Fragnesia 与早期 Linux 提权漏洞（如 Dirty Frag、Copy Fail）原理相近。研究人员表示，该漏洞可在主流 Linux 发行版上**稳定实现本地提权**  
，无需利用竞态条件，也无需复杂时序攻击。  
  
报告补充说明：**该漏洞与 Dirty Frag 相互独立，但攻击面一致，缓解防护策略也基本相同**  
。  
  
研究人员解释，漏洞成因是 ESP/XFRM 网络子系统存在**逻辑缺陷**  
，攻击者可向 /usr/bin/su  
 等受保护文件的页缓存内存执行任意写入。  
  
报告原文描述：Fragnesia 利用了 Linux 系统 **XFRM TCP 封装 ESP**  
 实现中的逻辑漏洞，核心根源是内核在进行 SKB 合并时，对共享页碎片处理不当。漏洞利用原理：在套接字切换至 espintcp 上层协议模式前，将文件映射页拼接到 TCP 接收队列；启用 ESP 处理后，内核就地解密队列数据，攻击者可通过操控 AES-GCM 密钥流，**可控破坏底层页缓存**  
。  
  
Debian、Ubuntu、红帽、SUSE、亚马逊 Linux、AlmaLinux、Gentoo 等主流 Linux 厂商已发布安全公告与补丁更新。目前该漏洞 **概念验证（PoC）利用代码已公开**  
，外界担忧攻击者会快速制作武器化攻击程序。  
  
Wiz 表示：**与 Dirty Frag 不同，利用该漏洞无需提前具备主机级权限**  
，AppArmor 安全配置仅能起到部分防护作用。  
  
微软及多家安全团队敦促各企业尽快部署可用补丁；无法立即升级的系统，专家建议：关闭不必要的 XFRM/IPsec 功能、限制本地 Shell 登录权限、强化容器环境安全加固，并加强对可疑提权行为的安全监控。  
  
目前暂无证据表明该漏洞已被攻击者用于真实网络攻击场景，建议各机构及时为受影响系统打补丁，降低被入侵风险。  
  
  
