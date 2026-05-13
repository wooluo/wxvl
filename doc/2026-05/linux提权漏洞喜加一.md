#  linux提权漏洞喜加一  
原创 🅼🅰🆈
                    🅼🅰🆈  独眼情报   2026-05-13 12:13  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/cBGhzWwhSAgWxkVrnqONjRQE14eWwx2XiaMbY4Wxu2Pzk4ziciciahD5YaIw5iabZQrbtr8OkHFgv5aAiaDZacK8qLSGwslZPBFkeblO9z1r3dEss/640?wx_fmt=jpeg&from=appmsg "")  
  
最近公开的 Fragnesia 项目，可以看作又一个围绕 Linux page cache 的本地提权利用样本。攻击者已经拥有本地代码执行能力后，借助 Linux 内核网络与页缓存处理逻辑缺陷，把只读文件的 page cache 内容改写为攻击者控制的数据，最终借助 setuid 程序执行 root shell。  
  
从项目自述看，Fragnesia 被作者定义为 “universal Linux local privilege escalation exploit”，其核心是滥用 Linux XFRM ESP-in-TCP 子系统中的逻辑缺陷，对只读文件的内核 page cache 进行任意字节写入。项目说明还将其归入 Dirty Frag 相关漏洞类别，并强调它与 Dirty Pipe、Copy Fail 一样，属于“把只读文件在内存页缓存中的内容变成可控内容”的攻击思路。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/cBGhzWwhSAiapdPryJ6bFxBoTM6j6SE2t1qv7gMe87hdyx1vqicomrgvdNIvSHXY9wwQKufxls8d0aBY9pI0WG0UkIqmvibZkUCrf0nxWlURiaA/640?wx_fmt=jpeg&from=appmsg "")  
  
https://github.com/v12-security/pocs/tree/main/fragnesia  
  
受影响版本 所有受 dirtyfrag 影响的版本均受影响。  
  
任何未包含此补丁的版本：https://lists.openwall.net/netdev/2026/05/13/79，即 2026 年 5 月 13 日之前的任何 Linux 内核版本。  
  
  
