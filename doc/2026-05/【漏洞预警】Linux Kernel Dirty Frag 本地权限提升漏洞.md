#  【漏洞预警】Linux Kernel Dirty Frag 本地权限提升漏洞  
PokerSec
                    PokerSec  PokerSec   2026-05-08 03:07  
  
**先关注，不迷路.**  
## 免责声明  
  
请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 漏洞介绍  
  
近日，监测到 Linux Kernel Dirty Frag 本地权限提升漏洞相关安全风险。该漏洞属于 Linux 内核零拷贝（Zero-copy）机制中的 Page Cache 污染类漏洞，可导致本地普通用户稳定提权至 Root 权限。  
  
当前该漏洞 PoC 与部分技术细节已公开，攻击门槛较低，影响范围广，建议相关用户尽快开展自查与防护工作。  
## 影响范围  
  
Linux Kernel 是开源类 UNIX 操作系统的核心组件，负责：  
- 进程调度  
  
- 内存管理  
  
- 文件系统管理  
  
- 网络通信  
  
- 硬件资源控制  
  
其广泛应用于：  
- 服务器  
  
- 云平台  
  
- 容器环境  
  
- 桌面终端  
  
- 嵌入式设备  
  
- 移动系统  
  
作为全球主流 IT 基础设施的重要底层运行环境，Linux Kernel 广泛支撑互联网、金融、政企、云计算等关键业务系统。  
## 漏洞复现  
  
POC:  
  
(这微信页面直接复制代码格式会乱，可以浏览器打开复制)  
```
https://github.com/V4bel/dirtyfrag/blob/master/exp.c
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/oXVNrHPdp9Y2qFDWyxoIvFLIddxrQg6dkz6YCnwbYoIv1TAX9U25SPoM6WS9pCPmB1dmdF7ZcRVQaHCqicFapyg0YGQjXial4YdibTVuYtaSfk/640?wx_fmt=png&from=appmsg "")  
## 漏洞描述  
  
Dirty Frag 漏洞源于 Linux 内核中：  
- xfrm-ESP（自 2017 年引入）  
  
- RxRPC（相关路径自 2023 年调整）  
  
两个网络协议模块中的逻辑缺陷。  
  
攻击者可利用：  
- splice()  
  
- sendmsg()  
  
- skb frag  
  
- Zero-copy 数据路径  
  
将文件页缓存（Page Cache）错误挂载至 sk_buff 的 frag 成员。  
  
在后续协议处理过程中：  
- ESP  
  
- RxRPC  
  
会对 skb frag 指向的内存进行写操作，  
  
从而导致：  
# 对只读 Page Cache 页面的非法写入。  
  
最终可实现：  
- 篡改 /etc/passwd  
  
- 污染 SUID 程序  
  
- 注入 SSH Key  
  
- 修改系统认证文件  
  
并稳定获取 Root 权限。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/oXVNrHPdp9auvg6ST8fxNEEH8MkCoD83to8fX8QvjNaNia0Luw6IW6A238deVcgibP2IFeIDLOGzViaqnkyLDvSrEmvw4FPpGqpCwTT4ibZdicsE/640?wx_fmt=png&from=appmsg "")  
## 修复意见  
  
在官方补丁完成部署前，建议临时禁用相关模块：  
```
modprobe -r esp4modprobe -r esp6modprobe -r rxrpc
```  
  
同时建议：  
- 限制低权限用户登录  
  
- 加强容器隔离  
  
- 关闭非必要用户命名空间  
  
- 及时更新内核补丁  
  
如有侵权，请及时联系删除。  
  
  
