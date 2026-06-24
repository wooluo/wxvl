#  漏洞预警 | Linux kernel权限提升漏洞  
浅安
                    浅安  浅安安全   2026-06-24 00:00  
  
**0x00 漏洞编号**  
- # CVE-2026-46331  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Linux kernel是美国Linux基金会的开源操作系统Linux所使用的内核。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/NQlfTO30MhxQXbwG1WSjsS1TMvUY3aIsCJ1ic2kxclUiaYic5gV2p9dmfrcTERVZZ5bEOnWFIvWxTRHhnpSrVwYdscfiaPjyuYZZadMxgIIH8Gg/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-46331**  
  
**漏洞类型：**  
权限提升  
  
**影响：**  
获取root权限  
  
**简述：**  
Linux Kernel net/sched act_pedit存在本地权限提升漏洞，由于其tcf_pedit_act()函数在处理数据包编辑操作时，函数仅在循环外基于tcfp_off_max_hint一次性计算skb写时复制COW范围，该提示值未考虑运行时类型密钥追加的报文头部偏移，导致部分待写入内存区域未执行COW拷贝。攻击者可通过非特权用户命名空间配合CAP_NET_ADMIN权限，构造恶意tc流量规则，触发未COW的共享只读页缓存写入篡改；无需内核竞态条件，可稳定篡改setuid-root二进制文件的页缓存，不会持久写入磁盘，仅内存层面生效。成功利用后本地普通用户可直接获取系统root最高权限，从而实现完全控制服务器。  
  
**0x04 影响版本**  
- v5.18 <= Linux Kernel < v7.1-rc7  
  
**0x05 POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.kernel.org/  
  
  
  
