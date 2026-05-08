#  Copy Fail 延伸 Dirty Frag 提权漏洞  
 Khan安全团队   2026-05-08 05:20  
  
![](https://mmbiz.qpic.cn/mmbiz_png/J7CSmJcRR8miaeYEmuklVZt99Q59MaZp3UZsZbd5icib8h1GYhZFNAA2ftA2LRrYRicIZibMbpK5gxUoZksEiaibTBVpkLxboqS5adicAsQh4rVZLkM/640?wx_fmt=png&from=appmsg "")  
  
它可以通过链接 xfrm-ESP Page-Cache Write 漏洞和 RxRPC Page-Cache Write 漏洞，在主要的 Linux 发行版上获得 root 权限。  
  
Dirty Frag 漏洞扩展了 Dirty Pipe 和 Copy Fail 漏洞所属的漏洞类别。由于它是一个确定性逻辑漏洞，不依赖于特定的时间窗口，因此无需竞争条件，即使利用失败，内核也不会崩溃，并且成功率非常高。  
  
受影响版本  
  
xfrm-ESP 页面缓存写入漏洞的范围从 cac2661c53f3 (2017-01-17) 到上游，RxRPC 页面缓存写入漏洞的范围从 2dc334f1a63a (2023-06) 到上游。  
  
换句话说，这些漏洞的有效寿命约为 9 年。此脏碎片已在以下发行版本上测试过。  
- Ubuntu 24.04.4：6.17.0-23-通用  
  
- RHEL 10.1: 6.12.0-124.49.1.el10_1.x86_64  
  
- openSUSE Tumbleweed：7.0.2-1-default  
  
- CentOS Stream 10：6.12.0-224.el10.x86_64  
  
- AlmaLinux 10：6.12.0-124.52.3.el10_1.x86_64  
  
- Fedora 44：6.19.14-300.fc44.x86_64  
  
xfrm-ESP Page-Cache Write 提供了一个强大的任意 4 字节 STORE 原语，例如 Copy Fail，并且包含在大多数发行版中，但它需要创建命名空间的权限。  
  
Ubuntu 有时会通过 AppArmor 策略阻止非特权用户创建命名空间。在这种环境下，xfrm-ESP Page-Cache Write 无法触发。RxRPC Page-Cache Write 创建命名空间不需要特权，但rxrpc.ko大多数发行版并未包含该模块。不过，在 Ubuntu 上，该rxrpc.ko模块默认加载。  
  
将这两种方法结合起来，可以相互弥补漏洞，从而在所有主流发行版上获取 root 权限。  
  
