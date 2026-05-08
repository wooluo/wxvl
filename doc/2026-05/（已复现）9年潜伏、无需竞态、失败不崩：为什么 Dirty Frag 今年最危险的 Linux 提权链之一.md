#  （已复现）9年潜伏、无需竞态、失败不崩：为什么 Dirty Frag 今年最危险的 Linux 提权链之一  
原创 云梦DC
                    云梦DC  云梦安全   2026-05-08 03:14  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Ft77EUEUqoukkfVLtM4C6a8lr3zgL5SyWic3h3msaYeOforhdu0YRFibVNib5WIXkd42fhuMp3aLu7zhhYypUpbIWw0AKQ5goM3ibjKvI134rPE/640?wx_fmt=png&from=appmsg "")  
  
  
如果只看名字，  
Dirty Frag  
 很容易让人把它当成又一个“Dirty 系列”的营销标题。  
  
但把作者公开的技术细节认真读完之后，你会发现，这件事真正让人不安的，并不是命名方式，而是它同时具备了几个很少能在同一条 Linux 本地提权链上看到的特征：  
- 它不是单一漏洞，而是一类漏洞的组合利用  
  
- 它延续了   
Dirty Pipe  
、  
Copy Fail  
 这条 bug class 的思路  
  
- 它不依赖竞态窗口，不需要 race  
  
- 即便利用失败，内核也不会像很多提权洞那样直接 panic  
  
- 它的两条变体还能互相补盲区，覆盖 major distributions  
  
如果要用一句话概括 Dirty Frag，我会更愿意这样说：  
  
**它不是简单地“写坏一个文件”，而是把 Linux 内核在零拷贝、页缓存和原地加解密上的几个默认前提，拼成了一条可稳定落地的本地提权链。**  
## 一、Dirty Frag 到底是什么  
  
按照仓库作者   
Hyunwoo Kim (@v4bel)  
 的定义，Dirty Frag 是一个 Linux 本地提权漏洞类，它通过串联两条不同的   
Page-Cache Write  
 变体，在主流发行版上实现提权：  
- xfrm-ESP Page-Cache Write  
  
- RxRPC Page-Cache Write  
  
这两条链路看上去分属不同子系统，但它们的核心共性其实非常一致：  
  
攻击者先在一个   
**zero-copy send path**  
 上，通过   
splice()  
 把自己只有只读权限的文件页缓存页，种进发送侧   
skb  
 的   
frag  
 槽位里；随后，接收侧内核代码在这个   
frag  
 上做   
**in-place crypto**  
；于是，本来只该被“读”的页缓存页，在内存中被内核“写”了。  
  
这就是 Dirty Frag 最关键的原理支点。  
  
它污染的不是磁盘上的原始文件，而是   
**page cache**  
。  
  
但由于后续读取、执行看到的都是被污染过的缓存副本，效果上你几乎可以把它理解成：  
  
**一个低权限用户，让内核替自己改写了本不该改的只读文件内容。**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Ft77EUEUqot9yPSfXFtzU9P7vxplzNqfbDxGkkOVAGEwdFVicqmv3d4JiaZGIWpm7qyZLTicLmhzEYxibzOOJ222Kib7xBbvibohXibw9MSkxLnZibA/640?wx_fmt=png&from=appmsg "")  
  
## 二、为什么它会让人立刻想到 Dirty Pipe 和 Copy Fail  
  
作者在 write-up 里明确把 Dirty Frag 放到了和   
Dirty Pipe  
、  
Copy Fail  
 同一条 bug class 里。  
  
三者的共同点并不在于代码位置相近，而在于一个更底层的逻辑：  
  
**只读页缓存页，被错误地带入了一个后续会发生写操作的内核路径。**  
  
区别在于：  
- Dirty Pipe  
 的经典问题点在   
struct pipe_buffer  
  
- Dirty Frag  
 则把问题点转移到了   
struct sk_buff  
 的   
frag  
  
这也是为什么仓库文档里有一句非常值得安全团队记住的话：  
  
即便某些环境已经做过   
Copy Fail  
 相关的已知缓解，例如 blacklist 某些模块，  
**Dirty Frag 依然可能成立**  
。  
  
换句话说，这不是“老洞换壳”，而是同一类设计假设问题在另一条内核数据路径上的再次出现。  
## 三、Dirty Frag 最危险的，不只是“能提权”，而是它的成功条件很现实  
  
很多本地提权洞在传播时都会被夸张成“瞬间 root”。  
  
但真正决定风险高低的，往往不是标题，而是下面这些问题：  
- 要不要赌 race  
  
- 会不会把机器打崩  
  
- 依赖是不是过于苛刻  
  
- 失败后能不能悄悄重来  
  
Dirty Frag 在这些维度上的表现都不算乐观。  
  
仓库   
README  
 里反复强调，它是一个   
**deterministic logic bug**  
：  
- 不依赖 timing window  
  
- 不需要 race condition  
  
- 利用失败时不会导致 kernel panic  
  
- 成功率很高  
  
这几个条件叠在一起，意味着它更像一个“工程化可用”的利用链，而不是实验室里偶尔撞出来的一次 PoC。  
## 四、两条变体各自做了什么  
### 1. xfrm-ESP 变体  
  
这条变体的根因，在于   
esp_input()  
 进入原地 AEAD 解密前，本应在某些情况下先走   
copy-on-write  
，把数据复制到内核私有缓冲区里；但在特定分支下，这个保护被绕开了。  
  
结果就是：  
  
攻击者通过   
splice  
 种进去的页缓存页，直接成了后续原地解密的   
src/dst  
。  
  
而一旦原地加解密路径里出现   
STORE  
，那 4 个字节就不再写到“安全的临时区域”，而是写回到了攻击者精心摆放的页缓存页里。  
  
作者进一步指出，这条链甚至能把一个带   
setuid-root  
 位的目标程序页缓存污染成攻击者想要的形态，随后仅通过执行这个程序完成提权。  
  
从风险角度看，这条链的特点是：  
- 写入能力更强  
  
- 可控性更高  
  
- 但需要创建 user namespace 的权限条件  
  
### 2. RxRPC 变体  
  
另一条变体的根因，在于   
rxkad_verify_packet_1()  
 对 RxRPC 载荷前 8 字节做了   
**in-place decrypt**  
。  
  
如果那个   
skb frag  
 里放着的仍然是攻击者提前种进去的页缓存页，那么这 8 个字节的原地解密，就会变成对页缓存页的原地写。  
  
和 xfrm-ESP 变体相比，它的写入值没有那么“直接可控”，因为写进去的是一次密码函数输出，而不是攻击者直接指定的 4 字节。  
  
但它的优势在于：  
  
**不需要 user namespace 创建权限。**  
  
作者在 write-up 里展示了另一种更现实的思路：不再强行改写可执行文件，而是转而污染   
/etc/passwd  
 一小段关键认证字段，让后续的   
su  
 认证路径发生偏移。  
  
这条链更像是在告诉防守方：  
  
攻击者不一定总想“把整个文件换掉”，只要能把认证或执行路径上的几个关键字节推歪，提权就已经够了。  
## 五、为什么作者要把两条链“串起来”  
  
Dirty Frag 最值得注意的地方之一，不是单个漏洞多强，而是作者很清楚每条链各自的盲区。  
  
xfrm-ESP  
 变体的问题是：  
- 它在多数发行版上都更通用  
  
- 但依赖 user namespace 创建能力  
  
而   
RxRPC  
 变体的问题是：  
- 它不依赖 user namespace  
  
- 但   
rxrpc.ko  
 并不是所有发行版默认都带或都默认加载  
  
这就是为什么 write-up 最后专门写了   
Chaining  
 一节。  
  
作者的思路非常直接：  
- 能走   
xfrm-ESP  
 就先走它  
  
- 如果环境策略拦住了 user namespace，例如 Ubuntu 某些 AppArmor 配置  
  
- 那就回退到   
RxRPC  
 这条链  
  
两条路径互相补位，才构成了仓库标题里那个非常醒目的词：  
  
Universal Linux LPE  
  
这里“Universal”未必意味着绝对所有 Linux，但它至少说明了一件事：  
  
**作者不是在展示单个提权点，而是在做跨发行版落地覆盖。**  
## 六、Dirty Frag 真正给内核安全提了什么醒  
  
这篇 write-up 我觉得最值得内核和安全工程团队反复咀嚼的一点，是它暴露出来的并不是某个孤立 if 分支写错了，而是一类更根本的假设问题：  
  
**当 zero-copy、页缓存复用、非线性 skb、以及原地加解密这几件事叠在一起时，内核是否还明确知道“这块内存到底能不能安全地原地写”？**  
  
Dirty Frag 的答案是：在某些路径上，没有。  
  
这也是为什么它虽然表面上看是 LPE，但本质上更像一堂关于“共享内存语义”和“copy-on-write 边界”的反面教材。  
  
从防守视角看，这类问题比普通越界读写更难受的地方在于：  
- 它发生在合法逻辑路径里  
  
- 它不一定制造明显 crash  
  
- 它利用的是性能优化和零拷贝路径里的隐含前提  
  
也就是说，问题不是代码“不会跑”，而是代码“按预期跑了，但预期本身错了”。  
## 七、截至 2026 年 5 月 8 日，修复和披露走到了哪一步  
  
根据仓库   
write-up  
 里的时间线，Dirty Frag 的披露过程并不平静。  
  
几个关键时间点值得记一下：  
- 2026-04-29  
：作者向   
security@kernel.org  
 提交   
RxRPC  
 变体及 weaponized exploit 细节  
  
- 2026-04-30  
：作者向   
security@kernel.org  
 提交   
xfrm-ESP  
 变体细节，并向   
netdev  
 邮件列表提交补丁  
  
- 2026-05-07  
：  
xfrm-ESP  
 变体的修复补丁合入   
netdev tree  
  
- 2026-05-07  
：在 embargo 期内，第三方公开了 exploit，导致 embargo 被打破  
  
- 2026-05-07  
：在与维护者沟通后，作者完整公开 Dirty Frag 文档和代码  
  
这里有一个细节值得注意：  
  
仓库   
README  
 仍提醒“由于 embargo 被打破，发行版补丁与 CVE 仍未就绪”；而   
write-up  
 又明确指出，  
xfrm-ESP  
 变体的上游修复补丁已经在   
2026-05-07  
 合入   
netdev tree  
。  
  
换句话说，  
**上游修复在推进，但发行版侧的回补、发布节奏和最终统一编号，仍需要继续观察。**  
  
至于   
RxRPC  
 变体，作者在文档里给出了补丁提案，但仓库文档截至当时并没有进一步给出“已合入上游”的记录。  
## 八、对企业和运维团队来说，现在最现实的动作是什么  
  
仓库   
README  
 给出的临时缓解策略，是先禁用涉及的模块：  
```
```  
  
如果把这件事翻译成更适合安全团队执行的语言，大概就是：  
### 1. 先搞清楚环境里哪些机器真的依赖这些模块  
  
不要一看到命令就一刀切上生产。  
  
尤其是和 IPsec、特定认证或某些分布式服务相关的环境，先评估业务影响。  
### 2. 如果暂时不能完整修复，优先做模块级止血  
  
Dirty Frag 这类问题的难点在于它不是普通用户态程序 bug，而是内核路径里的共享页缓存写入问题。  
  
在发行版补丁落地前，减少可触达路径通常比“等正式公告”更现实。  
### 3. 不要把“限制 user namespace”当成完整答案  
  
因为 Dirty Frag 的链式设计，已经明确把这个盲区考虑进去了。  
  
只拦 user namespace，未必足够。  
### 4. 重新审视“Dirty Pipe 类”问题的治理边界  
  
如果一个团队此前把   
algif_aead  
 blacklist 这类 Copy Fail 缓解动作当作收工信号，那么 Dirty Frag 会提醒你：  
  
**同一类问题，可能已经换了一条更隐蔽的数据路径重新出现。**  
## 九、为什么我会把 Dirty Frag 视为今年特别值得关注的一条 Linux 提权链  
  
因为它同时踩中了几个非常关键的点：  
- 它不是随机撞中的 race，而是逻辑上稳定可复现的路径  
  
- 它不是只依赖一种环境，而是设计了双变体互补  
  
- 它不是简单破坏，而是精准利用 page cache 污染改变后续执行/认证结果  
  
- 它不是只说明“这里有个洞”，而是说明 Linux 内核在 zero-copy 与 in-place crypto 结合处还有系统性风险  
  
如果   
Dirty Pipe  
 当年让大量人第一次意识到“只读文件也可能在页缓存层被污染”，那么 Dirty Frag 这次更进一步：  
  
**它展示了这种思路并没有结束，而是在网络子系统与加解密路径上继续蔓延。**  
  
这也是为什么对 Linux 安全从业者来说，Dirty Frag 不应该只被当成一个新 PoC 仓库，而更应该被看成：  
  
一个关于页缓存写污染 bug class 仍在扩展的强烈信号。  
  
poc:  
https://github.com/V4bel/dirtyfrag  
  
注！：一定要在测试环境复现测试，poc来源于网络谨慎谨慎！  
  
