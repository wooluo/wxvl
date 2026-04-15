#  0Day漏洞可禁用CrowdStrike EDR，签名驱动成攻击利器  
 FreeBuf   2026-04-15 04:53  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX38SJibELX4hGUxoKI4lomctUX6hHcbibPtCdNS0JCtjmraxeZLjCjYxV0xUFX33ENphp9bicic4SqAJEwRTp99fpeBAm2nvadKURc/640?wx_fmt=jpeg "")  
##   
  
网络安全研究人员发现了一种新型的 BYOVD（自带漏洞驱动）攻击技术，能够关闭包括 CrowdStrike Falcon 在内的一流终端安全解决方案。通过逆向分析一个此前未知的 0Day 内核驱动，研究人员揭示了威胁攻击者如何利用合法签名的驱动程序完全绕过终端检测与响应（EDR）系统。  
##   
  
**Part01**  
## BYOVD攻击原理  
  
  
在 BYOVD 攻击中，黑客会在受感染的机器上部署一个受信任但存在缺陷的驱动程序，以利用其提升的内核级权限。调查发现该恶意驱动存在超过 15 个不同变种。尽管具备破坏性能力，所有变种都携带有效的微软数字签名，且未被供应商拦截或吊销。令人担忧的是，VirusTotal 等平台的扫描结果显示，现代杀毒引擎对其检测率为零。  
  
  
由于该驱动经过签名且受高度信任，Windows 系统允许其加载至内核模式而不会触发任何安全警报，从而为攻击者提供了隐蔽的立足点。  
  
  
**Part02**  
## 逆向分析 IOCTL 接口  
  
  
研究人员使用 IDA Pro 进行技术分析时，绕过了一个经过混淆的入口点来检查驱动程序的核心设备控制处理程序。  
  
  
![DriverEntry 反编译失败（来源：core-jmp）](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX3wevXqJ8mck2nNODrIUH8VTcOEcTh7Mk0rTFSau6h2z2gUndRiafHJk5HUNCA3w4UicUJ5ibb7xC0HflkbibYLFUF3wXdwbxa3WeI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
在清理严重混乱的反编译代码后，研究人员发现了一个危险的输入/输出控制（IOCTL）接口。具体而言，IOCTL 代码 0x22E010 会触发专用的进程终止例程。该驱动接受字符串形式的进程 ID，使用标准 C 函数将其转换为整数，然后执行终止命令。真正的危险在于该驱动如何从内核级别终止安全进程——它使用 ZwOpenProcess 和 ZwTerminateProcess 内核函数强制终止活动应用程序。  
  
  
![创建 PoC（来源：core-jmp）](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX1Tx6k53Xl4P7sCtbDyNjcaHOH9fMfOohMAtR5SqW7j3hewCkERJcSxYvNZBTDypfcEdZSicbF5khUScicNzYgIYug8q089dEFdk/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**Part03**  
## 内核攻击优势  
  
  
在标准用户模式下，尝试关闭受保护的进程（如 CrowdStrike 的 PPL 服务）会立即遭到访问拒绝。但内核级命令能完全绕过这些用户模式保护机制，使得驱动程序可以在攻击者部署勒索软件或其他次级有效载荷之前，静默终止关键安全代理。  
  
  
为验证该漏洞，core-jmp 研究人员在测试环境中动态追踪驱动程序，定位到其符号链接 \\.\{F8284233–48F4–4680-ADDD-F8284233}。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX1RR8woOMxzLwh6yKgHjTFVv5FLBQjxX8P2RCvc0JgeD1ufxG4VBFM0nTFqmmpbeYc60TibVBVfc5wtXM1xBEqELPUYmzYcHZsQ/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**Part04**  
## 漏洞验证与利用  
  
  
利用该链接及发现的 IOCTL 代码，研究人员开发了名为 PoisonKiller 的概念验证漏洞利用程序。当通过标准命令行服务工具加载时，该漏洞利用程序成功定位并终止了活动的 CrowdStrike EDR 进程。完整的技术分析和漏洞利用代码已发布在 GitHub 上，凸显了现代操作系统在处理已签名的第三方驱动程序时存在的重大盲区。  
  
  
**参考来源：**  
  
Researcher Reverse Engineered 0-Day Used to Disable CrowdStrike EDR  
  
https://cybersecuritynews.com/0-day-disable-crowdstrike-edr/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651336774&idx=1&sn=408127059513eb158f86aa2cfc845a5b&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
