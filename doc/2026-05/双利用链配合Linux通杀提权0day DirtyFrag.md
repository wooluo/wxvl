#  双利用链配合Linux通杀提权0day "DirtyFrag"  
Rotten_SnorT
                    Rotten_SnorT  知秋安全   2026-05-08 04:23  
  
漏洞介绍  
  
Dirty Frag是一个Linux内核提权漏洞，通过串联利用两个漏洞 xfrm-ESP Page-Cache Write (主要) 和 RxRPC Page-Cache Write (辅助，用于覆盖某些发行版的盲区，例如 Ubuntu 的 AppArmor 限制) 来实现。  
  
它属于与 Dirty Pipe（CVE-2022-0847）和 Copy Fail（CVE-2026-31431）相同的漏洞类别：利用 zero-copy 操作，如 splice() 将用户可读的 page cache 页面写入到内核 skb（struct sk_buff）的 frag 中，然后让内核在接收/解密路径上对这些页面进行写入，从而永久污染受影响文件的 page cache（如 /etc/passwd 或 /usr/bin/su）。修改后的  
 page cache   
页面  
后续被读取使用  
，从而实现本地提权至 root。与 Copy Fail 一样无需条件竞争，成功率高，且不会导致内核崩溃。  
  
该漏洞由Hyunwoo Kim (@v4bel) 发布于2026年5月7日，无CVE编号。  
  
漏洞原理  
### 其核心机制与 Dirty Pipe 和 Copy Fail 的相似：  
  
攻击者使用 splice() 或 vmsplice() 将 page cache 页面引用放入发送侧 skb 的 frag 槽中。接收侧内核代码（esp/rxrpc 的解密 fast path）绕过 COW（Copy-On-Write），直接在这些外部页面上执行 in-place crypto 操作，导致写入 page cache。  
### 两条利用链原理如下：  
###   
  
**1.xfrm-ESP Page-Cache Write （自2017 年引入，commit cac2661c53f3)：**  
  
- 在 esp_input() / esp6_input() 中，存在绕过 skb_cow_data() 的路径（当 skb 非线性但无 frag_list 时，直接 skip_cow）。  
  
- 在 AEAD 解密（尤其是带 ESN 的 authencesn）过程中，会写入4个受控字节。  
  
- 攻击者可通过 XFRM netlink（需 CAP_NET_ADMIN，通常用 user/net namespace）写入4 个字节。  
  
- 即使认证失败，也能成功写入。  
  
**2.RxRPC Page-Cache Write (自2023 年引入，commit 2dc334f1a63a)：**  
  
- 在 rxrpc 的 rxkad_verify_packet_1 等路径上进行 in-place 单块解密（pcbc/fcrypt）。  
  
- 不需要 namespace 权限，但模块加载情况因发行版而异。  
  
- xfrm-ESP 在某些 Ubuntu AppArmor 配置下受限（namespace 创建受阻）因此引入了该条利用链。  
  
- RxRPC 用于覆盖Ubuntu发行版利用盲区（Ubuntu 默认加载 rxrpc.ko）。  
  
- 两条利用链配合可在**几乎所有主流发行版**  
上通用。  
  
  
利用方式  
  
官方Exp：  
https://github.com/V4bel/dirtyfrag  
```
git clone https://github.com/V4bel/dirtyfrag.git
cd dirtyfrag
gcc -O0 -Wall -o exp exp.c -lutil
./exp
```  
  
  
漏洞复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ZuVH3yjXZOZibhJAhrMtQOBib8KOPJGD5BiahJLRSibnJAkpQTFnRZ3aW8FSwkAXSgSicBkT8DqHUfpibSjwOBK6MkHJloXwAY8U1A4Znv7trhdd4/640?wx_fmt=jpeg "")  
  
  
受影响范围  
  
2017年至今所有Linux发行版，已确认的包括：  
- Ubuntu 24.04.4: 6.17.0-23-generic  
  
- RHEL 10.1: 6.12.0-124.49.1.el10_1.x86_64  
  
- openSUSE Tumbleweed: 7.0.2-1-default  
  
- CentOS Stream 10: 6.12.0-224.el10.x86_64  
  
- AlmaLinux 10: 6.12.0-124.52.3.el10_1.x86_64  
  
- Fedora 44: 6.19.14-300.fc44.x86_64  
  
漏洞修复  
  
紧急修复措施：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
  
相关链接  
  
https://github.com/V4bel/dirtyfrag  
  
