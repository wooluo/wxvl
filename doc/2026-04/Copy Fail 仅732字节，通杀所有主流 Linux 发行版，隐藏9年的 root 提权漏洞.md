#  Copy Fail: 仅732字节，通杀所有主流 Linux 发行版，隐藏9年的 root 提权漏洞  
综合编译
                    综合编译  代码卫士   2026-04-30 02:45  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Az5ZsrEic9ot90z9etZLlU7OTaPOdibteeibJMMmbwc29aJlDOmUicibIRoLdcuEQjtHQ2qjVtZBt0M5eVbYoQzlHiaw/640?wx_fmt=gif "")  
    
聚焦源代码安全，网罗国内外最新资讯！  
  
**编译：代码卫士**  
  
**Xint Code****团队披露称，在AI的协助下发现，非特权本地用户可向Linux系统上任意可读文件的页缓存中写入4个可控字节，并借此获得 root 权限。该漏洞的编号是CVE-2026-31431，是一个 authencesn 暂存区写入漏洞，通过 AF_ALG 与 splice() 链式利用，实现了向页缓存写入 4 字节的能力。仅需一个732字节的Python脚本，即可获得 Ubuntu、Amazon Linux、RHEL、SUSE等自2017年以来的所有Linux 主流发行版本的 root 权限。**  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfXxcClo5rcAKYyBtzcJwWL7NzhjRgyYODFHFLEx9YkaWicia2tnsWztCgGSlyibYSoVrKcXDZGEpHSCGT41s1V43ZEYjWLSLcfJtc/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞简介和成因**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfXdjHjhU3kUYe42Ml4k3PQVdfoeUvrics2npPZ7G3AsYzdMemT5gOot0CVURtpzfZDxJicHpPl7oF2ib5f5Awjf3XjrWJFWhnVcEk/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Copy Fail（CVE-2026-31431）是 Linux 内核 authencesn 加密模板中的一个逻辑漏洞，可导致非特权本地用户向系统上任意可读文件的页缓存中，触发一次确定性的、可控的 4 字节写入。一个 732 字节的 Python 脚本就能修改任意 setuid 二进制文件，并在 2017 年以来发布的几乎所有 Linux 发行版上获得 root 权限。  
  
内核永远不会将受污染的页缓存标记为“脏页”以写回磁盘，因此磁盘上的文件保持不变，常规的磁盘校验和比对无法检测到该修改。然而，访问文件时实际读取的是页缓存中的内容，因此受污染的内存版本会立即在整个系统中生效。本地非特权用户通过污染 setuid 二进制文件的页缓存，即可借此获得 root 权限。由于页缓存在整个主机上是共享的，同样的攻击手法也能跨越容器边界。  
  
因为 authencesn 在该执行复制操作的时候并没有真正进行复制。它把调用者提供的目标缓冲区当作临时草稿区，在合法输出区域之外多写入了 4 个字节，并且从未将这些字节恢复。AAD ESN 字节的“复制 (Copy) ”操作“失败 (Fail)”了——没能待在目标缓冲区之内。因此该漏洞被取名“Copy Fail”。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfUf376ibQttB9x9VbiaeHpNsBzFvuN0tJPceWwsUDF3nibYqzW1mxiaoEd2DGhmSjYkSCru5KfSCvWZ0t8MLa6Cjs8j9iaNEXbHDdZg/640?wx_fmt=gif&from=appmsg "")  
  
**和Dirty Cow 以及 Dirty Pipe 的区别**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfVZhbKg1YLSCRutxEg3h7g5j1ywyvnkdYOPWlsiaPLNd3KiaGByAXyLS6ml7R0LotBg128r4x94CKnxUtQSmkyQoiaoIh8pvTah2c/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Linux 内核此前曾出现过一些知名的权限提升漏洞。Dirty Cow（CVE-2016-5195）需要在虚拟机子系统的写时拷贝路径中赢得一个竞争条件窗口，通常需要多次尝试，有时还会导致系统崩溃。Dirty Pipe（CVE-2022-0847）则受限于特定内核版本，并且需要精确操控管道缓冲区。  
  
Copy Fail 是一个“直线型”的逻辑缺陷。它的触发不需要竞争条件、无需重试，也不依赖易导致崩溃的时序窗口。它的特点如下：  
  
可移植性。同一个脚本在所有经过测试的发行版和架构上都能运行，包括 Ubuntu、Amazon Linux、RHEL 和 SUSE。不需要针对不同发行版调整偏移量，无需重新编译，漏洞利用代码中也不包含版本检查逻辑。  
  
极小的体积。整个漏洞利用就是一个简短的 Python 脚本，仅使用标准库模块（os、socket、zlib）。需要 Python 3.10+ 以支持 os.splice。无需编译载荷，无需安装任何依赖。  
  
隐秘性强。该写入操作绕过了常规的 VFS 写入路径。内核对写回机制不会将受污染的页缓存页标记为“脏页”。仅对比磁盘校验和的标准文件完整性检查工具将无法检测到此次修改，因为磁盘上的文件并未被改动——被篡改的只有内存中的页缓存。  
  
跨容器影响。页缓存在系统上的所有进程之间是共享的，这包括跨越容器边界。因此，Copy Fail 不仅仅是一个本地权限提升漏洞，它同时还是一个容器逃逸的原语，以及 Kubernetes 节点的入侵途径。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfVfmapc3HXFram8dKAMxeIhZns9z9q9PplgtW90GgxtRAtuEx7VLNNtuCszR0hj9K9BcshYdC3nHVSjoQOKfejtQlaStdjmXZc/640?wx_fmt=gif&from=appmsg "")  
  
**页面缓存是目标，而非磁盘文件**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfWN2725yauaKujzdbGrfCjIQPwUiaR2Z0dsgsyQic5aNXoPvFTnU8ZDIOiaScL7PRwibHoeVLkFcnxBoSrEEo4DiaHFXMBh88PohWaU/640?wx_fmt=gif&from=appmsg "")  
  
  
  
页缓存是内核加载二进制文件时所读取的内存副本。修改 /usr/bin/su 的缓存副本，就 execve 系统调用的视角而言，等同于修改了二进制文件本身，区别在于磁盘上的内容没有任何变化，inotify 不会被触发，校验和也不会出现不一致。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfWJOjIwo1aNPSHr27CeVqUtBcHMHS3qUS6vF0UfHeQAic2rTgaf4QaPkPW9HBKKhWYnekKibPP9rFhPyoIu9PQEsRohjeNJAKDFA/640?wx_fmt=gif&from=appmsg "")  
  
**漏洞本身无法远程利用**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfUPIM8ThicfxNVEFwBpErTGbDuUTiaWB1zwsib8mP8jwYAqtj4fDIGUw3l0OGprFciaSV4EeMhDl7dQtrxcI7rF4lgyRTDMhzMD1Sg/640?wx_fmt=gif&from=appmsg "")  
  
  
  
仅该漏洞自身并不能远程利用。它需要先能以普通用户的身份在本地执行代码。但只需要和任何能达成这一前提的条件串联起来（例如：打入非特权服务账户的 Web 远程代码执行漏洞、一个 SSH 初步访问权限、或者 CI 运行器上一个恶意的 PR 提交），那么就能拿到 root 权限。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/t5z0xV2OYfVZzWhMRBbjzjBzUHc8kSG3BSIR2vk7n3bCcRP6C1ibichwQVLYzBreK097LyPgHA23vPCstcYLTs6NDzVxLydr9CkcQgiaIGIgdA/640?wx_fmt=gif&from=appmsg "")  
  
**速打补丁**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/t5z0xV2OYfWE8EqqA7bnLiazq49ibNDhTjDRr3yWbhSCNbWsSWYrac1HdoN6icrFsDmyR2Mob64o7o7UW9XDYqPAVapDxV5FOwpUOic9Ojpq24Y/640?wx_fmt=gif&from=appmsg "")  
  
  
  
如果用户运行的是多租户 Linux 系统、共享内核的容器、执行不可信代码的 CI 运行器，或者任何可能存在不完全可信的人以普通用户身份执行 execve 的环境，则因立即打补丁。如用户使用的是开启了全盘加密且锁屏的单用户笔记本，则紧急程度低得多，但仍然建议打上补丁。  
  
补丁回退了 2017 年针对 algif_aead 的原位操作优化。打补丁之后，req->src 和 req->dst 再次成为两个独立的散列列表——页缓存页面位于只读的源列表中，而用户态缓冲区成为加密操作唯一可写入的目的地。主线提交号为 a664bf3d603d。  
  
  
 开源  
卫士试用地址：  
https://oss.qianxin.com/#/login  
  
 代码卫士试用地址：https://sast.qianxin.com/#/login  
  
  
  
  
  
  
  
  
  
**推荐阅读**  
  
[已存在12年之久的Pack2TheRoot 漏洞可导致攻击者获得 Linux root 访问权限](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247525878&idx=2&sn=79f2e56b6855b12ec6fb1acde9a488e5&scene=21#wechat_redirect)  
  
  
[10个npm包被指窃取 Windows、macOS 和 Linux 系统上的开发者凭据](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247524314&idx=2&sn=81cae6998a39f2153ed18d7cc065303b&scene=21#wechat_redirect)  
  
  
[Docker Hub中仍然托管着带有XZ后门的数十个Linux镜像](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523819&idx=1&sn=909cc4e2732c910ba79d7907a1cd0f90&scene=21#wechat_redirect)  
  
  
[udisks 漏洞可用于获得Linux 主要发行版本的root权限](https://mp.weixin.qq.com/s?__biz=MzI2NTg4OTc5Nw==&mid=2247523333&idx=2&sn=23cefe4214956d3fbac95c79c5396243&scene=21#wechat_redirect)  
  
  
  
  
  
**原文链接**  
  
https://copy.fail/  
  
https://xint.io/blog/copy-fail-linux-distributions  
  
  
题图：Pixa  
bay Licens  
e  
  
  
**本文由奇安信编译，不代表奇安信观点。转载请注明“转自奇安信代码卫士 https://codesafe.qianxin.com”。**  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSf7nNLWrJL6dkJp7RB8Kl4zxU9ibnQjuvo4VoZ5ic9Q91K3WshWzqEybcroVEOQpgYfx1uYgwJhlFQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/oBANLWYScMSN5sfviaCuvYQccJZlrr64sRlvcbdWjDic9mPQ8mBBFDCKP6VibiaNE1kDVuoIOiaIVRoTjSsSftGC8gw/640?wx_fmt=jpeg "")  
  
**奇安信代码卫士 (codesafe)**  
  
国内首个专注于软件开发安全的产品线。  
  
   ![](https://mmbiz.qpic.cn/mmbiz_gif/oBANLWYScMQ5iciaeKS21icDIWSVd0M9zEhicFK0rbCJOrgpc09iaH6nvqvsIdckDfxH2K4tu9CvPJgSf7XhGHJwVyQ/640?wx_fmt=gif "")  
![]( "")  
  
   
觉得不错，就点个 “  
在看  
” 或 "  
赞  
” 吧~  
  
