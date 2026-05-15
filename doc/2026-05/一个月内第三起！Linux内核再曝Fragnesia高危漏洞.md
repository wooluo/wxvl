#  一个月内第三起！Linux内核再曝Fragnesia高危漏洞  
 FreeBuf   2026-05-15 10:32  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
  
  
继上月的CopyFail漏洞和上周的Dirty Frag漏洞之后，Linux系统管理员又面临新的安全威胁——被专家称为“重大漏洞”的Fragnesia（CVE-2026-46300）。该漏洞与Dirty Frag类似，目前各大厂商正在紧急发布补丁。  
  
  
**Part01**  
## 漏洞技术细节  
  
  
数字安全公司DigitalDefence的事件响应负责人Robert Beggs向CSO表示：“这是一个重大漏洞。它能绕过现有文件系统权限限制（例如‘文件归root所有’或‘文件只读’），实现不触及磁盘的文件篡改。”  
  
  
Fragnesia是一个本地提权漏洞，通过XFRM ESP-in-TCP子系统中的缺陷实现内核内存写入。XFRM是用于数据包转换的IP框架，而ESP-in-TCP（TCP封装安全载荷）是一种将IPsec ESP数据包封装在TCP段中的网络技术。目前该漏洞的PoC利用代码已在互联网公开。  
  
  
**Part02**  
## 攻击影响范围  
  
  
Beggs指出，该漏洞无法远程利用。攻击者需要本地访问权限才能触发特定代码路径，控制本地套接字操作并操纵数据包分片。但任何普通用户都能在受影响系统上利用该漏洞，破坏内存中的安全敏感文件，包括特权访问管理配置、密码、systemd服务文件或cron任务。虽然攻击者无法修改磁盘文件，但篡改内存文件可诱骗特权进程、改变系统行为、执行任意代码并提升系统权限。  
  
  
**Part03**  
## 厂商响应措施  
  
  
红帽、Ubuntu、AlmaLinux等发行版正在推送补丁或缓解措施，CloudLinux表示补丁正在测试中。红帽核心平台副总裁Mike McGrath称：“我们已发布esp4和esp6内核模块的临时解决方案，在寻找永久修复方案的同时为客户提供即时保护。”  
  
  
Linux支持提供商TuxCare表示，运行受影响_skbuff_代码路径的系统（包括已修复Dirty Frag的内核）都会受到影响。公开的PoC需要系统启用_CONFIG_INET_ESPINTCP_配置选项才能触发漏洞，但底层的_skbuff_缺陷可能通过其他途径被利用。  
  
  
**Part04**  
## 安全防护建议  
  
  
微软建议Linux用户立即运行更新工具打补丁。若无法立即修补，可采取与Dirty Frag相同的缓解措施：  
- 评估能否安全临时禁用esp4、esp6及相关xfrm/IPsec功能。  
  
- 限制非必要的本地shell访问。  
  
- 强化容器化工作负载。  
  
- 加强对异常提权活动的监控。  
  
Beggs建议管理员通过以下步骤加强防护：  
- 检查内核版本确认受影响状态，必要时更新至已修补版本并重启系统。  
  
- 如无需ESP-in-TCP功能，立即禁用该模块。  
  
- 确保已实施特权账户MFA、禁用非必要shell访问等基础防护。  
  
- 加强对特权进程（PAM、systemd、cron）的监控，关注异常重启、配置重载和突然提权行为。  
  
**参考来源：**  
  
Meet Fragnesia, the third Linux kernel vulnerability in a month  
  
https://www.csoonline.com/article/4171403/meet-fragnesia-the-third-linux-kernel-vulnerability-in-a-month.html  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337950&idx=1&sn=12d64571335d50c1b93389447dfb8ef1&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
