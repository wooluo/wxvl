#  突发：史诗级漏洞，732 个字节通杀所有 Linux！  
 君说安全   2026-05-08 03:40  
  
732 字节，拿下一个 root  
  
4 月 29 日，安全圈炸了。  
  
Theori（DEF CON CTF 九冠王团队）公开了一个 Linux 内核本地提权漏洞，代号 **CopyFail**  
（CVE-2026-31431）。  
  
影响范围：2017 年至今的所有主流 Linux 发行版。  
  
利用方式：一段 **732 字节的 Python 脚本**  
，不需要竞态窗口，不需要内核偏移量，跑完直接拿 root。  
  
说实话，这个漏洞的杀伤力，比 Dirty Pipe 还要猛。  
  
  
  
漏洞是怎么来的？  
  
CopyFail 的根，埋在近十年前。  
  
问题的源头是三个看似无害的变更，各自都合理，但组合在一起就成了炸弹：  
  
**2011 年**  
：authencesn  
 被加入内核（commit a5079d084f8b  
），用于支持 IPsec ESP 的 64 位扩展序列号（ESN）。它在计算 HMAC 时需要重新排列 AAD 中的字节——把 seqno_hi  
 放前面，seqno_lo  
 放末尾。  
  
排列的方式？直接用调用者的目标缓冲区当**临时工作空间**  
。  
  
当时这没问题。旧版 AEAD 接口下，关联数据在独立的 scatterlist 里，唯一的调用者是内核内部的 xfrm 层，没人会观察到中间写入。  
  
**2015 年**  
：AF_ALG 获得了 AEAD 支持（algif_aead.c  
），允许普通用户通过 socket 调用内核加密。同年 authencesn  
 切换到新 AEAD 接口（104880a6b470  
），引入了那个关键的 assoclen + cryptlen  
 偏移写入。但此时 AF_ALG 用的是 out-of-place 操作——src 和 dst 是独立的 scatterlist，页缓存页面在 src（只读），scratch 写入落在 dst（用户缓冲区），还不构成漏洞。  
  
**2017 年**  
：一次性能优化改变了所有事（commit 72548b093ee3  
）。  
  
algif_aead.c  
 改为**原地操作**  
（in-place）。解密时，AAD 和密文从 TX SGL 拷贝到 RX 缓冲区，但 tag 部分通过 sg_chain()**直接链接了原始的页缓存页面**  
，而不是拷贝。  
  
然后代码设置了 req->src = req->dst  
。  
  
页缓存页面，就这样被链进了可写的目标 scatterlist。  
  
  
  
触发点：authencesn 的越界写入  
  
authencesn  
 在 crypto_authenc_esn_decrypt()  
 里干了这件事：  
  
c  
  
```
scatterwalk_map_and_copy(tmp, dst, 4, 4, 1);   // 改写 dst[4..7] scatterwalk_map_and_copy(tmp+1, dst,      assoclen + cryptlen, 4, 1);  // 写入 tag 之后 4 字节
```  
  
  
第三个调用在 assoclen + cryptlen  
 位置写了 4 字节。这个位置超出了 AEAD 解密的合法输出范围。  
  
在 in-place 路径下，scatterwalk_map_and_copy  
 走过 RX 缓冲区，跨进链入的页缓存页面，通过 kmap_local_page  
 把 seqno_lo**直接写进了内核缓存的目标文件副本**  
。  
  
HMAC 计算随后失败，recvmsg()  
 返回错误。但那 4 字节的写入——已经持久在页缓存里了。  
  
  
  
攻击者控制了什么？  
  
三个维度，全部可控：  
  
**哪个文件**  
：任何当前用户可读的文件。  
  
**哪个偏移**  
：tag 区域对应被 splice 的文件数据末尾 authsize  
 字节。通过选择 splice 的文件偏移、splice 长度和 assoclen  
，攻击者可以精确指定文件页缓存中的哪 4 个字节被覆盖。  
  
**写入什么值**  
：4 字节的覆盖值（seqno_lo  
）来自 sendmsg()  
 中 AAD 的第 4–7 字节，完全由攻击者构造。  
  
攻击流程：  
  
• 打开 AF_ALG  
 socket，绑定 authencesn(hmac(sha256),cbc(aes))  
  
• sendmsg()  
 提供 AAD（含要写入的 4 字节），splice()  
 提供目标文件的页缓存  
  
• recv()  
 触发解密 → 内核越界写入页缓存 → 4 字节被修改  
  
• 对 /usr/bin/su  
 反复操作，逐块写入 shellcode  
  
• execve("/usr/bin/su")  
 → 内核从页缓存加载 → shellcode 以 UID 0 运行 → root  
  
  
  
为什么九年没人发现？  
  
这是最让人后背发凉的地方。  
  
crypto/  
 子系统是内核中被审查最严格的模块之一。但研究员们审查的焦点是： - IND-CPA 加密安全性 - 侧信道攻击 - 参数校验  
  
CopyFail 的问题**不在密码学层面**  
。它问的是一个完全不同的问题：这块内存从哪里来？内核凭什么通过它写入数据？  
  
换个视角看，它一直就在那里。  
  
  
  
更可怕的是发现方式  
  
这个漏洞不是某个研究员花了几个月手动审计找到的。  
  
Theori 研究员 Taeyang Lee 在做 kernelCTF 工作时，已经映射了 AF_ALG 的攻击面。他怀疑 scatterlist 页面来源可能是一个未被充分探索的漏洞源。  
  
同时，Theori 的其他成员用他们开发的 AI 系统 **Xint Code**  
 对 Linux crypto/  
 子系统跑了扫描。  
  
大约**一个小时**  
。一个操作者 prompt，无需额外 harnessing。  
  
CopyFail 就是这份报告中最关键的发现。  
  
去年 Zerodium 公开的 Linux 零日漏洞收购价，最高 **50 万美元**  
。现在，AI 一小时就能产出同等质量的漏洞。  
  
这个趋势，比漏洞本身更值得警惕。  
  
  
  
谁最危险？  
  
CopyFail 只需要一个**非特权的本地用户账号**  
，不需要网络访问，不需要开启调试功能。  
  
以下几个场景，风险极高：  
  
**🔴 多租户 Linux 主机**  
 共享开发机、跳板机、构建服务器——任何多个用户共享一个内核的环境。任何一个用户都能变成 root。  
  
**🔴 Kubernetes / 容器集群**  
 页缓存在宿主机上是共享的。一个容器内的利用，可以跨容器、跨租户影响整个节点。CopyFail 不仅是一个本地提权，更是一个容器逃逸原语。  
  
**🔴 CI/CD Runner**  
 GitHub Actions 自建 Runner、GitLab Runner、Jenkins Agent——任何以普通用户身份执行不可信 PR 代码的环境。一条 PR 就能拿到 Runner 的 root。  
  
**🟡 标准 Linux 服务器**  
 单租户生产环境，只有团队内部有 shell 权限。但一旦攻击者通过 Web RCE 或泄露的凭证拿到了一个普通用户，CopyFail 就是通往 root 的直达电梯。  
  
  
  
怎么修？  
  
好消息是，补丁已经上了主线。  
  
**内核补丁**  
：主线 commit a664bf3d603d  
，直接撤销了 2017 年的原地优化。  
  
修复前的代码：  
  
c  
  
```
// src 和 dst 指向同一个 scatterlist（原地操作） aead_request_set_crypt(&req, rsgl_src,    // RX SGL                        rsgl_src, used, iv);  // 同一个
```  
  
  
修复后：  
  
c  
  
```
// src 指向 TX SGL，dst 指向 RX SGL（分离操作） aead_request_set_crypt(&req, tsgl_src,    // TX SGL                        rsgl_src, used, iv);   // 不同的
```  
  
  
req->src  
 现在指向 TX SGL（可能包含页缓存页面），req->dst  
 指向 RX SGL（用户缓冲区）。整个 sg_chain  
 机制——把页缓存 tag 页面链入可写目标 scatterlist——被彻底移除。  
  
**各大发行版正在陆续推送修复后的内核包。第一时间升级内核并重启**  
，是最根本的解决方式。  
  
**来不及升级？先做临时缓解：**  
  
bash  
  
```
# 禁用 algif_aead 模块 echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif-aead.conf rmmod algif_aead 2>/dev/null || true
```  
  
  
或者用 seccomp 禁止创建 AF_ALG  
 socket。  
  
这会禁用什么？对绝大多数系统来说——**什么都不影响**  
。  
  
dm-crypt / LUKS、kTLS、IPsec/XFRM、内核 TLS、OpenSSL、SSH 等，都直接使用内核加密 API，不走 AF_ALG  
 用户态接口。  
  
  
  
时间线  
  
日期  
  
事件  
  
2026-03-23  
  
报告给 Linux 内核安全团队  
  
2026-03-24  
  
初始确认  
  
2026-03-25  
  
补丁提交审核  
  
2026-04-01  
  
补丁合入主线  
  
2026-04-22  
  
分配 CVE-2026-31431  
  
2026-04-29  
  
公开披露  
  
  
  
说两句掏心窝子的  
  
Dirty Pipe（CVE-2022-0847）教会了我们一件事：内核里那些没人多看一眼的子系统，可能藏了十年的炸弹。  
  
Dirty Cow（CVE-2016-5195）教了另一件事：写时复制的逻辑漏洞，可以让一个普通用户覆盖只读文件。  
  
现在 CopyFail 来了。同样是页缓存写入，同样是通杀所有发行版，但这次——**它是由 AI 在 1 小时内找到的**  
。  
  
内核的提交信息写得很直白：  
  
"There is no benefit in operating in-place in algif_aead since the source and destination come from different mappings."  
  
九年。一个原地优化。一个没人注意到的越界写入。三个合理的变更叠加。  
  
如果你的服务器上跑着 Linux，今天就去检查内核版本。这不是演习。  
  
  
**参考来源**  
：Xint 官方技术分析 · copy.fail 官网 · GitHub PoC  
  
