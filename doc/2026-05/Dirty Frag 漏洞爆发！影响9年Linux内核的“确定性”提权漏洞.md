#  Dirty Frag 漏洞爆发！影响9年Linux内核的“确定性”提权漏洞  
微步情报局
                    微步情报局  微步在线研究响应中心   2026-05-08 01:33  
  
1. 漏洞概况  
  
2026年5月7日，安全研究员 Hyunwoo Kim（@v4bel）公开了一个名为 **Dirty Frag**  
 的本地权限提升（LPE）漏洞。该漏洞影响自2017年以来（约9年）的主流Linux发行版，允许任何本地用户**稳定、确定性地**  
获得root权限。  
  
关于该漏洞的细节、影响系统及版本、修复方案、临时缓解措施，微步情报局正在进一步研究中，详情请关注微步漏洞情报。  
## 2. 漏洞本质：Page Cache缓存篡改  
  
Dirty Frag 属于“Dirty Pipe”漏洞家族的变种，通过操纵内核**页缓存（Page Cache）**  
，**直接篡改磁盘文件在内存中的只读副本**  
。  
  
Dirty Frag 包含两个独立的漏洞，分别位于不同的内核模块。攻击者根据目标环境选择其中一个进行利用，每个漏洞均可单独完成提权。  
### 漏洞一：xfrm-ESP Page-Cache Write  
<table><thead><tr><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">项目</span></section></th><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">信息</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">所在模块</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><code style="font-family: &#39;SFMono-Regular&#39;, Consolas, monospace;font-size: 0.92em;"><span leaf="">esp4</span></code><section><span leaf=""> / </span><code style="font-family: &#39;SFMono-Regular&#39;, Consolas, monospace;font-size: 0.92em;"><span leaf="">esp6</span></code></section></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">影响范围</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">自 2017-01-17 (cac2661c53f3) 起的所有内核</span></section></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">利用前提</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">需要创建用户命名空间的权限</span></section></td></tr></tbody></table>  
**利用流程：**  
1. **创建用户命名空间**  
：攻击者创建一个新的用户命名空间，获取所需的权限  
  
1. **触发ESP数据包处理**  
：通过Netlink接口构造特制的ESP数据包，触发 xfrm  
 代码路径中的页缓存写入操作  
  
1. **篡改页缓存**  
：利用漏洞向目标文件的页缓存中写入任意4字节数据  
  
1. **修改系统文件**  
：反复利用该原语，篡改 /etc/passwd  
 或 /etc/sudoers  
 等关键文件  
  
1. **获得root权限**  
：通过篡改后的系统文件创建root用户或提升当前用户权限  
  
### 漏洞二：RxRPC Page-Cache Write  
<table><thead><tr><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">项目</span></section></th><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">信息</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">所在模块</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><code style="font-family: &#39;SFMono-Regular&#39;, Consolas, monospace;font-size: 0.92em;"><span leaf="">rxrpc</span></code></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">影响范围</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">自 2023-06 (2dc334f1a63a) 起的所有内核</span></section></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">利用前提</span></strong></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">需要 </span><code style="font-family: &#39;SFMono-Regular&#39;, Consolas, monospace;font-size: 0.92em;"><span leaf="">rxrpc</span></code><span leaf=""> 模块已加载（Ubuntu默认加载），</span><strong><span leaf="">不需要任何特权</span></strong></section></td></tr></tbody></table>  
**利用流程：**  
1. **创建AF_RXRPC套接字**  
：攻击者创建一个 AF_RXRPC  
 类型套接字  
  
1. **构造特殊的RxRPC调用**  
：通过特定的控制消息触发内核rxrpc代码路径中的页缓存写入漏洞  
  
1. **篡改页缓存**  
：向目标文件的页缓存中写入恶意数据  
  
1. **修改认证文件**  
：利用写入原语修改 /etc/passwd  
 或 /etc/shadow  
  
1. **获得root权限**  
：通过新建的root用户或修改变更当前用户权限  
  
### 两个漏洞的场景覆盖  
<table><thead><tr><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">环境场景</span></section></th><th style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;background: #f1f5f9;font-weight: 600;"><section><span leaf="">可用的漏洞</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">允许非特权用户命名空间（大多数发行版）</span></section></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">xfrm-ESP</span></section></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">限制非特权用户命名空间（如Ubuntu + AppArmor）</span></section></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">RxRPC（若模块加载）</span></section></td></tr><tr><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><section><span leaf="">Ubuntu默认配置</span></section></td><td style="border: 1px solid #dbe4ee;padding: 8px 12px;text-align: left;"><strong><span leaf="">至少一个可用</span></strong><section><span leaf="">（xfrm-ESP 通常可用；如果被AppArmor限制，rxrpc默认加载）</span></section></td></tr></tbody></table>## 3. 和“Copy Fail”漏洞是什么关系？  
  
**相同点**  
：xfrm-ESP 漏洞与 Copy Fail 共享相同的**内核写入原语**  
。  
  
**差异点**  
：Dirty Frag 不依赖 algif_aead  
 模块。因此，即使系统已应用 algif_aead  
 黑名单来缓解 Copy Fail，**Dirty Frag 仍然有效**  
。  
  
  
