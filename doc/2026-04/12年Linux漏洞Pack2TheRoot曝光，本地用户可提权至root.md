#  12年Linux漏洞Pack2TheRoot曝光，本地用户可提权至root  
 FreeBuf   2026-04-27 10:05  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
**Part01**  
## 漏洞概述  
  
  
编号为CVE-2026-41651（CVSS评分8.8）的Pack2TheRoot漏洞允许非特权用户未经授权安装或删除系统软件包，从而可能获得完整的root访问权限。该高危漏洞已存在近12年之久。  
  
  
**Part02**  
## 漏洞发现与影响范围  
  
  
德国电信红队发现该漏洞源于PackageKit在某些系统上允许"pkcon install"等命令无需密码即可运行。研究人员使用Claude Opus AI工具分析该问题后，通过人工验证确认漏洞存在，并负责任地向维护者披露，最终获得确认。  
  
  
德国电信在公告中表示："今天我们协同各发行版维护者公开披露一个影响多款Linux发行版默认安装的高危漏洞（CVSS 3.1评分8.8）。任何本地非特权用户均可利用Pack2TheRoot漏洞在受影响系统上获取root权限。该漏洞存在于PackageKit守护进程中，这是一个跨发行版的软件包管理抽象层。"  
  
  
**Part03**  
## 技术细节与修复情况  
  
  
PackageKit 1.3.5版本已发布修复补丁，但为避免漏洞被滥用，暂未公开漏洞利用代码。研究人员发现，在Fedora等系统上，PackageKit有时无需认证即可执行"pkcon install"等命令安装软件包。所有1.0.2至1.3.4版本的PackageKit均受影响，波及Ubuntu、Debian、Fedora和Rocky Linux等多个发行版，使用PackageKit的服务器（如搭载Cockpit的系统）也可能面临风险。该漏洞已于2026年4月22日发布的1.3.5版本中修复。  
  
  
**Part04**  
## 检测与防护建议  
  
  
要检查系统是否受影响：  
  
  
确认是否安装PackageKit：  
```
dpkg -l | grep -i packagekit
rpm -qa | grep -i packagekit
```  
  
检查服务是否活跃：  
```
systemctl status packagekit
pkmon
```  
  
若服务处于运行状态且未打补丁，则系统可能面临风险。研究人员已发布该漏洞的入侵指标(IOCs)，但可靠的PoC代码暂未公开以防止滥用。建议用户通过发行版渠道及时更新系统。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2D8gcCKup03t4SIlagWibGmY2snZjqVibwp67g1kHl9Bheib6nEDqjXWJPF2UAudbMj8qd2iapBfO6vCx4LXaLro4QBQuwwIWSYFE/640?wx_fmt=png&from=appmsg "")  
  
  
**参考来源：**  
  
12-year-old Pack2TheRoot bug lets Linux users gain root privileges  
  
https://securityaffairs.com/191231/security/12-year-old-pack2theroot-bug-lets-linux-users-gain-root-privileges.html  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337326&idx=1&sn=4b4825de0e4f83e00dad9cfa560df6f2&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
