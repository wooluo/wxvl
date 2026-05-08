#  Dirty Frag 漏洞：续 Copy Fail 之后，Linux 再曝“核弹级”提权漏洞  
原创 安全攻防屋
                        安全攻防屋  安全攻防屋   2026-05-08 04:53  
  
由于文章篇幅限制，该漏洞exp代码较长，如需完整复现代码关注公众号回复数字【  
Dirty Frag  
】自动发送exp。  
  
5月7日，Copy Fail 漏洞引发广泛关注后，又一个堪称“核弹级”的提权漏洞被曝出--Dirty Frag。（目前官方尚未发布相关补丁）  
> ⚠️ 全网紧急高危：漏洞利用无需任何权限，首次执行即可稳定获取 root，2017 年后几乎所有 Linux 发行版均受影响。截至目前，无 CVE 编号、无官方补丁。  
  
  
  
Dirty Frag 是 Linux 内核中 IPv4 与 IPv6 网络协议栈的碎片重组逻辑存在的严重漏洞。攻击者可以通过精心构造的畸形网络包，触发内核中的双重释放（double-free）或未初始化内存访问，成功实现本地提权。  
  
  
漏洞评级：严重  
  
部分payload如下：  
```
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <sched.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/uio.h>
#include <sys/ioctl.h>
#include <sys/wait.h>



extern int g_su_verbose;
int g_su_verbose = 0;
#define SLOG(fmt, ...) do { if (g_su_verbose) fprintf(stderr, "[su] " fmt "\n", ##__VA_ARGS__); } while (0)

static int write_proc(const char *path, const char *buf)
{
	int fd = open(path, O_WRONLY);
	if (fd < 0) return -1;
	int n = write(fd, buf, strlen(buf));
	close(fd);
	return n;
}

```  
  
如需完整复现代码关注公众号回复数字【  
Dirty Frag  
】自动发送exp。  
  
复现过程如下（此处以Ubuntu24.04版本演示），成功拿到root权限。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/wXKQNXqMicc8iczfqxgxFuDGnsI9llmgPS3CHXKEk6vfx8XHc2aBfB8UlhvPeq4ATmv85AWIrGt4We536Yr27wZpkMu6ZQh9wZwsz28dW85f0/640?wx_fmt=png&from=appmsg "")  
  
自查：你的系统是否受到影响？  
  
该漏洞利用的是 esp4、esp6、rxrpc 这三个内核模块。如果你的系统没有加载这些模块，则不受影响；如果已加载，则存在提权风险。  
```
echo "=== 检查漏洞模块加载状态 ===" && \
lsmod | grep -E 'esp4|esp6|rxrpc' && \
echo "⚠️ 发现以上模块已加载，系统存在风险！" || \
echo "✅ 未发现风险模块加载" && \
echo "" && \
echo "=== 检查模块是否存在于系统中 ===" && \
modinfo esp4 esp6 rxrpc 2>/dev/null && \
echo "⚠️ 模块存在，可能被自动加载" || \
echo "✅ 模块不存在或不可用"
```  
  
  
受影响版本清单列举  
```
Ubuntu 24.04/26.04
Arch Linux、RHEL 8/9
OpenSUSE
CentOS Stream
Fedora
AlmaLinux 等
```  
  
  
  
  
  
  
  
  
  
