#  快报：Linux 又爆高危提权漏洞：DirtyFrag  
原创 MarkSec
                    MarkSec  六边形攻防安全   2026-05-08 00:46  
  
Linux 安全圈刚刚又出了一个  
严重的  
内核提权漏洞：  
  
DirtyFrag  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FaZFJ7xrqJZdta95WKDc4qfFzGUyWgd9XI6bJzia7aU6nntjBHpfKNrEpx58MzicibO6NicafpsdUEZGPl96D5yH6kbDE7Nmubkm86OLvzqiaQV4/640?wx_fmt=png&from=appmsg "")  
  
5个小时前github上已有人公开了漏洞exp  
  
很多人第一眼看到名字：  
  
就会想到：  
- DirtyCow  
  
- DirtyPipe  
  
没错。  
  
它们属于同一种思路：  
> ❝  
> 污染 Page Cache（页缓存）  
> ❞  
  
# 漏洞影响  
  
攻击者如果已经获得：  
> ❝  
> 普通 Linux 用户权限  
> ❞  
  
  
理论上可能：  
> ❝  
> 直接提权到 root  
> ❞  
  
  
目前：  
- Ubuntu  
  
- Debian  
  
- RHEL  
  
等发行版都可能受到影响。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/FaZFJ7xrqJZzgGRB8foRgFhCAV8oMcickrmfyKniaStnYMibPmMaI5hxPnSAOS842UF2Iv4fMibMHnYHn2hzDkOWsVAZ2p34z45JHEOIZzo9vY0/640?wx_fmt=jpeg&from=appmsg "")  
  
  
笔者也在虚拟机ubuntu24.04中也成功复现，如下图所示  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FaZFJ7xrqJahf9Py4TML3TtibJsIpUKEvULIwTLVzicNE1FPochiayNdB7m1FMQXQiadvk9apeTTiaCcLq8nLicTdZjdIIAMico2gxQL0BGjv1jPV4/640?wx_fmt=png&from=appmsg "")  
# 漏洞核心  
  
问题出在：  
  
AF_ALG + splice() + Page Cache  
  
简单理解就是：  
> ❝  
> Linux 内核错误地把只读内存页当成了可写  
> ❞  
  
  
最终导致：  
> ❝  
> 普通用户可以污染 Page Cache  
> ❞  
  
# 为什么危险？  
  
因为：  
> ❝  
> 磁盘文件可能完全没变，但内存里的内容已经被改了  
> ❞  
  
  
这也是为什么：  
  
很多人把它归类到：  
  
DirtyCow / DirtyPipe 家族  
# 云环境尤其危险  
  
因为：  
> ❝  
> Docker / Kubernetes 共享宿主机内核  
> ❞  
  
  
所以：  
> ❝  
> 一个本地提权，有机会进一步演变成容器逃逸  
> ❞  
  
# 漏洞细节  
> ❝  
> 官方仓库 & PoC：https://github.com/V4bel/dirtyfrag  
> ❞  
  
> ❝  
> 详细技术文档：仓库内 assets/write-up.md  
> ❞  
  
# 临时缓解方案  
  
很多安全团队目前建议：  
- 升级内核  
  
- 安装发行版补丁  
  
- 禁用相关 algif_aead 模块  
  
# 最后  
  
这几年 Linux 提权已经越来越明显：  
> ❝  
> 攻击目标正在从“磁盘文件”转向“内存中的 Page Cache”  
> ❞  
  
  
从：  
  
DirtyCow → DirtyPipe → DirtyFrag  
  
基本能看出：  
> ❝  
> Page Cache 已经成了 Linux 内核最危险的攻击面之一  
> ❞  
  
# 参考资料  
- https://github.com/V4bel/dirtyfrag  
  
- https://github.com/V4bel/dirtyfrag/blob/master/assets/write-up.md  
  
  
  
