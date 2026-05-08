#  【全网告急】Linux内核又现史诗级0day提权漏洞Dirty Frag（无补丁、无CVE编号！）  
xiachuchunmo
                    xiachuchunmo  银遁安全团队   2026-05-08 02:18  
  
听说你又忘记了root的密码？没关系，一条命令让你找回它！  
  
        ![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
  
  
漏洞简介  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
    **Linux 社区刚应对完 Copy Fail（CVE-2026-31431）高危提权漏洞的一周，2026 年 5 月 7 日，韩国安全研究员 Hyunwoo Kim 公开了另一个更致命的 Linux 内核本地提权 0day——Dirty Frag。该漏洞无需特殊权限、首次利用即可稳定获取 root，覆盖 2017 年后几乎所有主流 Linux 发行版，目前无 CVE 编号、无官方补丁，属于全网紧急高危状态！**  
  
**漏洞原理：内核把只读内存当可写缓冲区，普通用户直接改写 root 级只读文件的内存副本，秒提权！**  
  
        ![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
  
  
影响范围  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
      
因负责任的漏洞披露流程及保密协议已提前失效，目前所有 Linux 发行版均无官方补丁。  
（xfrm-ESP 漏洞潜伏 9 年，RxRPC 漏洞 2023 年 6 月引入）  
```
Ubuntu 24.04/26.04
Arch Linux、RHEL 8/9
OpenSUSE
CentOS Stream
Fedora
AlmaLinux 等
```  
  
  
        ![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
  
  
漏洞复现  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
```
https://github.com/V4bel/dirtyfrag
```  
  
    笔者测试：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/14zTrTiaCfEXHCkPxYk5lLY1Ib6hEPMicQHAia9SciaJpKyXR7dSGVePiaCrHsDiaPaxHLVcUplQ0QI1DRCicX0xb62mCPib4DPN5EPSvUpVm5mrpfA/640?wx_fmt=png&from=appmsg "")  
  
    各系统测试图片：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/14zTrTiaCfEWXwicTylERJojsa4c1aX4NXknbltXKZpedVLF60yu6EHP37kpicVUiaWIZyG6D8VicSKPCokEiaibib2V2fyWTB6cW3emf0uS54Ymm44/640?wx_fmt=png&from=appmsg "")  
  
        ![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
  
  
修复建议  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
  
    1.   
目前无官方补丁，Hyunwoo Kim 提供临时缓解措  
施，可卸  
载漏洞关联内核模块，阻断攻击路径，不影响系统正常功能。  
###     2.容器/云环境额外防护：  
  
  
###     Seccomp限制：禁止容器内创建AF_ALG套接字（攻击依赖接口）  
  
  
###     AppArmor/SELinux：强化安全规则，拦截非特权用户命名空间创建  
  
  
###     权限收紧：禁止普通用户访问splice()相关高危系统调用  
  
  
