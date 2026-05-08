#  【风险提示】天融信关于Linux Kernel本地权限提升漏洞Dirty Frag的风险提示  
天融信应急响应
                    天融信应急响应  天融信阿尔法实验室   2026-05-08 04:37  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/TWq54w4h0qTBZVpuwzKeVuenmiaibp0IMYuziaGwSbeQZelG0Jefqtsw1AIpTLiaus50eJwta77F3va4FHvg4jsmxMS6lZa6FxgiaibIjdue335ok/640?wx_fmt=jpeg "")  
  
**0x00 背景介绍**  
  
  
近日，天融信阿尔法实验室监测到Linux Kernel主线修复了一个本地权限提升漏洞Dirty Frag。该漏洞已存在9年，影响几乎所有主流企业级和桌面Linux发行版。由于该漏洞是一个逻辑漏洞，因此漏洞利用成功率极高。当前，此漏洞的细节及Exp已经公开，暂未发现主流发行版发布针对该问题的补丁或更新，因此，请受影响用户立即根据修复建议对该漏洞进行防御。  
  
**0x01 漏洞描述**  
  
  
Linux内核是一个开源、宏内核但支持动态模块加载的操作系统核心，负责管理硬件资源并为上层软件提供运行环境。它通过进程调度、内存管理、虚拟文件系统、网络协议栈和设备驱动等关键子系统，实现对CPU、内存、磁盘及外设的抽象与调度，并提供稳定、安全和高效的接口供应用程序使用。凭借高可移植性、丰富的驱动支持和强大的社区协作，其已成为从嵌入式设备到超级计算机、从安卓系统到云服务器广泛采用的基础核心。  
  
Dirty Frag是Linux Kernel网络子系统中的一种漏洞类别，其通过链接xfrm-ESP Page-Cache Write漏洞和RxRPC Page-Cache Write漏洞在大多数Linux发行版上获得root权限。Dirty Frag与Dirty Pipe和Copy Fail的形成原因具有高度的相似性，但具体细节不同。  
  
这两个漏洞的共同之处在于，在零拷贝（zero-copy）发送路径中，当splice()函数将攻击者仅拥有读取权限的页面缓存页引用直接植入发送方skb的片段槽时，接收方内核代码会对该片段执行原地加密。结果，非特权用户仅拥有读取权限的文件（例如/etc/passwd或/usr/bin/su）的页面缓存会被修改，并且后续每次读取都会看到修改后的副本，从而实现提权。  
  
请注意，无论algif_aead模块是否可用，Dirty Frag漏洞都可能被触发。换句话说，即使在应用了公开已知的Copy Fail缓解措施（algif_aead黑名单）的系统上，您的Linux系统仍然容易受到Dirty Frag漏洞的攻击。  
  
漏洞复现（复现环境  
Ubuntu 22.04.4 LTS  
）  
:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TWq54w4h0qSmpHMvgkL9ick1k3YzK14t6z4mknTGKZp4TUNzA7Fgpo7OrA7WIS4Nzld3hc83viaz5NicgjkcbyvRpBUcSd86nlB1FAcuyw4yfY/640?wx_fmt=png&from=appmsg "")  
  
**0x02 漏洞编号**  
  
暂无  
  
**0x03 漏洞等级**  
  
高危  
  
**0x04 受影响版本**  
  
几乎影响所有主流企业级和桌面Linux发行版。  
  
xfrm-ESP Page-Cache Write漏洞影响范围：  
  
Linux Kernel主线Commit >= cac2661c53f3（2017-01-17）  
  
RxRPC Page-Cache Write漏洞影响范围：  
  
Linux Kernel主线Commit >= 2dc334f1a63a（2023-06-08）  
  
已知受影响的发行版：  
  
Ubuntu 22.04.4 LTS（6.8.0-40-generic）  
  
Ubuntu 24.04.4 LTS（6.17.0-23-generic）  
  
RHEL 10.1（6.12.0-124.49.1.el10_1.x86_64）  
  
openSUSE Tumbleweed（7.0.2-1-default）  
  
CentOS Stream 10（6.12.0-224.el10.x86_64）  
  
AlmaLinux 10（6.12.0-124.52.3.el10_1.x86_64）  
  
Fedora 44（6.19.14-300.fc44.x86_64）  
  
**0x05 修复建议**  
  
Linux Kernel官方暂未发布正式补丁，可通过以下命令删除存在漏洞的内核模块，进行临时缓解。  
  
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"  
## 0x06 声明  
  
  
天融信阿尔法实验室拥有对此公告的修改和解释权，如欲转载，必须保证此公告的完整性。由于传播、利用此公告而造成的任何后果，均由使用者本人负责，天融信阿尔法实验室不为此承担任何责任。  
  
天融信阿尔法实验室成立于2011年，一直以来，阿尔法实验室秉承“攻防一体”的理念，汇聚众多专业技术研究人员，从事攻防技术研究，在安全领域前瞻性技术研究方向上不断前行。作为天融信的安全产品和服务支撑团队，阿尔法实验室精湛的专业技术水平、丰富的排异经验，为天融信产品的研发和升级、承担国家重大安全项目和客户服务提供强有力的技术支撑。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/H6W1QCHf9dGfIEDOlNXXDTqOpRkEkicJakNxM37lzr8eRJRibEfxkwBibg9KpVh6nibXHoG4xC6KyGFtTd4TOe6GyA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/H6W1QCHf9dGfIEDOlNXXDTqOpRkEkicJawf8nKyKatopPJiaayibAUCvfTVFKfxVDInq2TiaUib6xhmhpLK4Zqscgyg/640?wx_fmt=jpeg "")  
  
天融信  
  
阿尔法实验室  
  
长按二维码关注我们  
  
  
