#  预警丨防范Windows远程桌面服务（RDS）权限提升高危漏洞  
 网络安全和信息化   2026-03-19 09:05  
  
近日，工业和信息化部网络安全威胁和漏洞信息共享平台（  
NVDB  
）监测发现，  
Windows  
远程桌面服务（  
RDS  
）存在权限提升高危漏洞，已被用于网络攻击。  
  
远程桌面服务（  
RDS  
）是  
Windows  
系统中提供远程访问、桌面虚拟化及会话管理的核心组件。该服务处理内部配置及相关注册表项权限时存在校验缺陷，攻击者在拥有用户权限或建立远程桌面会话的条件下，可构造特殊请求篡改服务启动配置，无需用户交互即可实现本地权限提升，获取系统最高权限，进而实施恶意操作，受影响的型号包括  
Windows 10/11  
，  
Windows Server 2012/2016/2019/2022/2025  
等。  
  
目前微软官方已修复漏洞并发布安全公告（  
URL  
链接：  
https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-21533  
）。建议相关单位和用户立即开展全面排查，及时升级  
Windows  
系统至最新安全版本，或参照官方公告安装补丁。针对无法及时更新的系统，可采取限制非必要远程桌面访问、开启多因素认证等加固措施，防范网络攻击风险。  
  
来源：工业和信息化部网络安全威胁和漏洞信息共享平台（  
NVDB  
）  
  
-  
END  
-  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/co91jb4rYkM8O2Vk1NMvSibBxaP5NSgRL1CpLoy06mLBVffNPZvoS2J6QNQnu0ybyprZ4UicZ4X7icgo5M3YWndwg/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&wx_co=1&randomid=t4omqpdm&retryload=1&tp=webp#imgIndex=0 "")  
  
  
**2026年杂志订阅开始啦~**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/co91jb4rYkPhgRZr1jWNOHQc9dEtv4BIGOFRFibVXKHzKTk6m6HnTzJgDtDDRaVV7Xt04ZW3Inm7SEovRKDo6gw/640?wx_fmt=jpeg&from=appmsg&wxfrom=5&wx_lazy=1&retryload=1&tp=webp#imgIndex=4 "")  
  
