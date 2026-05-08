#  新的Linux漏洞732 字节通杀Linux内核  
HackSee安全团队
                    HackSee安全团队  HackSee安全生活   2026-05-08 08:23  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/oPZcPicUADs8sJO6sQHiap5u7Yh6quemkOAjhPZzIH6cWPdQrjfUh0zzPvwiblXXwqicV1mSUj5MiaNastKEQaq9yeribJHab4IEIHcHXgLZ16G58/640?wx_fmt=jpeg&from=appmsg "")  
  
网络安全研究人员披露了Linux本地特权升级（LPE）漏洞的细节，该漏洞可能允许无特权的本地用户获得根用户。  
  
这个名为CVE-2026-31431 （CVSS评分：7.8）的严重漏洞被Xint命名为“复制失败”。io和Theori。  
  
“一个没有特权的本地用户可以在Linux系统上的任何可读文件的页面缓存中写入四个受控制的字节，并使用它来获得root，”Xint的漏洞研究团队说。io和Theori说。  
  
该漏洞的核心是Linux内核加密子系统（特别是algif_aead模块）中的一个逻辑缺陷。该问题是在2017年8月提交的源代码中引入的。  
  
成功利用这一缺陷可以让一个简单的732字节Python脚本编辑setuid二进制文件，并在2017年以来发布的几乎所有Linux发行版上获得root权限，包括Amazon Linux、RHEL、SUSE和Ubuntu。Python漏洞利用包括四个步骤  
  
打开一个AF_ALG套接字并绑定到authencesn(hmac（sha256),cbc(aes)）  
  
构造shellcode有效负载  
  
触发写操作到内核缓存的"；/usr/bin/su"；  
  
调用execve（"/usr/bin/su"）来加载注入的shellcode并以root身份运行它  
  
虽然不能孤立地远程利用该漏洞，但本地非特权用户可以通过破坏setuid二进制文件的页面缓存来获得root权限。同样的原语也具有跨容器影响，因为页面缓存在系统上的所有进程之间共享。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/oPZcPicUADs9ZEcocfxRacMECWRmrLg3gnROrZ8zsYVBfAU5SyavvMQiaHNUGw1hr4icTq8fAS2alWMbcWBSN6gicmvxEka9ciaTf4Hnicu0tLQmM/640?wx_fmt=jpeg&from=appmsg "")  
  
作为对这次披露的回应，Linux发行版已经发布了他们自己的建议  
- AlmaLinux  
  
- 亚马逊Linux  
- Arch Linux  
  
- CloudLinux  
  
- Debian  
  
- Gentoo  
  
- 红帽企业Linux  
- SUSE  
  
- Ubuntu  
  
Copy Fail在Dirty Pipe （CVE-2022-0847）中也有类似的情况，这是另一个Linux内核LPE漏洞，可以允许非特权用户将数据剪切到只读文件的页面缓存中，并最终覆盖系统上的敏感文件以实现代码执行。  
  
Bugcrowd的David Brumley说：“Copy Fail是同一类原语，在不同的子系统中。”algif_aead中的2017就地优化允许通过AF_ALG套接字提交的AEAD操作将页面缓存页放入内核的可写目标散列列表中。然后，非特权进程可以将splice（）驱动到该套接字中，并完成一个小的、有针对性的写操作，写入它不拥有的文件的页面缓存。  
  
使漏洞变得危险的是，它可以可靠地触发，并且不需要任何竞争条件或内核偏移。最重要的是，相同的漏洞可以跨发行版使用。  
  
这个漏洞是独一无二的，因为它有四个几乎永远不会同时出现的属性：可移植、微小、隐蔽和跨容器。io发言人在一份声明中告诉黑客新闻。它允许任何用户帐户，无论其级别有多低，都可以将其权限增加到完全的管理访问权限。它还允许他们绕过沙箱，并在所有Linux版本和发行版中工作。  
  
  
  
