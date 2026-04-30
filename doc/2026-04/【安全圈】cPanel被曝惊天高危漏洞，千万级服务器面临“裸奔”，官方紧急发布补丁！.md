#  【安全圈】cPanel被曝惊天高危漏洞，千万级服务器面临“裸奔”，官方紧急发布补丁！  
 安全圈   2026-04-30 08:01  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aBHpjnrGylgOvEXHviaXu1fO2nLov9bZ055v7s8F6w1DD1I0bx2h3zaOx0Mibd5CngBwwj2nTeEbupw7xpBsx27Q/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
**关键词**  
  
  
  
漏洞  
  
  
在网络托管的世界里，控制面板是核心资产。它是管理数据库、路由电子邮件和维护整个数字店面的中央控制中心。我们花费数千美元购买高可用性集群、冗余电源和企业级 NVMe 存储，以确保我们的数据具有弹性且无处不在。然而，正如我们本周所看到的，即使是最强大的架构设计也可能被登录脚本中的一个逻辑缺陷所破坏。  
  
  
2026 年 4 月 28 日，cPanel 发布的一系列紧急安全版本让托管社区感到震惊。该漏洞影响了几乎所有当前支持的软件版本，针对各种身份验证路径。从风险角度来看，这是最可怕的情况：一个可能允许攻击者获得对控制面板软件本身未经授权访问的缺陷。当本应在门口执行 VIP 俱乐部保镖规则的守门人却没锁后窗时，安全周边的概念就变成了过时的护城河。  
### 身份验证绕过剖析  
  
虽然 cPanel 对该漏洞的技术细节一直守口如瓶——这是负责任的披露中的常见做法，以防止为恶意行为者提供路线图——但其影响是显而易见的。行业巨头之一 Namecheap 将此问题描述为“身份验证登录漏洞”。在幕后，这表明系统验证会话令牌的方式，或处理登录界面与内部管理 API 之间的交接时存在故障。  
  
  
根据我作为白帽黑客的经验，这类漏洞通常源于架构悖论。我们构建了复杂的多重身份验证 (MFA) 系统和严格的密码策略，但有时却忽略了不遵循相同规则的旧版身份验证路径或辅助 API 端点。因此，攻击者不需要猜测您的 32 位密码；他们只需要找到那条忘记询问密码的逻辑路径。这正是为什么我和我的同行经常关注绕过的“方式”，而不是凭据本身的“内容”。  
  
  
从设计上讲，cPanel 和 WebHost Manager (WHM) 旨在成为关键任务界面。它们是系统管理员和分销商的主要工具。如果攻击者在此处获得访问权限，CIA 三要素（机密性、完整性和可用性）就会支离破碎。他们只需单击一下即可读取您的数据、修改您的代码或删除您的整个存在。在架构层面，鉴于 cPanel 作为 Linux 托管行业标准的地位，该漏洞代表了整  
个网络的系统性风险。  
### 反应性措施与 Namecheap 的响应  
  
当漏洞消息传出时，Namecheap 采取了非常规措施，应用防火墙规则来阻止对 TCP 端口 2083 (cPanel SSL) 和 2087 (WHM SSL) 的访问。从威胁格局来看，这是一个大胆虽然具有破坏性的举动。通过关闭控制面板的主要入口点，他们实际上是在加固石头的同时拉起了吊桥。  
  
从最终用户的角度来看，无法访问控制面板是令人沮丧的。然而，在发生这种级别的违规事件时，停机是比数据完全泄露好得多的选择。Namecheap 采取的主动方法——在补丁可以在其机群（Stellar Business、Reseller 和共享服务器）中得到验证之前阻止访问——是优先考虑数据完整性而非便利性的教科书案例。  
  
  
我记得几年前发生的一起事件——通过 Signal 与几位事件响应人员确认过——当时一家类似的托管服务商在零日事件期间犹豫是否要阻止访问。结果导致数千个 WordPress 网站被入侵，并造成了持续数月的取证噩梦。撇开修补不谈，识别何时进入“黑暗模式”的能力是弹性安全态势的标志。  
### 补丁矩阵：验证您的合规性  
  
如果您正在管理自己的 VPS 或专用服务器，检查版本号不仅仅是一个建议；这是一项关键任务。cPanel 已在多个层级发布了更新，以确保无论您遵循哪个发布版本，都有安全路径。  
  
  
以下是包含修复程序的特定版本。如果您的服务器运行的版本在数值上低于您各自分支中的这些版本，则您可能容易受到攻击。  
<table><tbody><tr><th><section><span leaf=""><span textstyle="" style="font-size: 17px;">cPanel 发布分支</span></span></section></th><th><section><span leaf=""><span textstyle="" style="font-size: 17px;">最低安全版本</span></span></section></th></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v110</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.110.0.97</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v118</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.118.0.63</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v126</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.126.0.54</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v132</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.132.0.29</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v136</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.136.0.5</span></span></section></td></tr><tr><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">v134</span></span></section></td><td><section><span leaf=""><span textstyle="" style="font-size: 17px;">11.134.0.20</span></span></section></td></tr></tbody></table>  
更新 cPanel 通常是通过命令行或 WHM 界面进行的简单过程，但考虑到此漏洞的性质，我建议通过 SSH 执行更新，以完全绕过 Web 界面。主动地说，您还应该检查审计日志（通常位于   
/usr/local/cpanel/logs/access_log  
），以查找在应用补丁之前来自未知 IP 地址的任何异常登录活动。  
### 评估软件之外的攻击面  
  
修补就像堵住船壳上的洞，但它并不能改变船仍处于危险水域的事实。一旦您加固了服务器，就该审视更广泛的攻击面了。在许多情况下，此类漏洞被用作隐蔽持久性的切入点。攻击者可能会获得访问权限，创建一个辅助管理帐户，然后等待您修补原始漏洞。  
  
  
这就是“人为防火墙”和细粒度审计概念发挥作用的地方。更新后，对您的管理帐户进行一次小型审计。是否有任何您不认识的用户？最近是否生成了任何 API 令牌？在零信任的世界中，我们绝不会因为安装了补丁就假设系统是干净的。我们会从取证的角度验证机器的状态。  
  
  
此外，考虑为您的 WHM 访问实施 IP 白名单。如果您只从办公室或特定的 VPN 访问服务器，则没有理由让 2087 或 2083 端口对全世界开放。通过在防火墙级别将访问限制在特定 IP，您可以创建一个去中心化的防御层，即使明天发现另一个身份验证绕过漏洞，该防御层仍然有效。  
### 系统管理员的实用要点  
  
为了应对此次事件并为未来加固您的基础设施，请遵循以下优先清单：  
1. 立即修补：  
立即从终端运行   
/usr/local/cpanel/scripts/upcp  
。不要等待自动夜间计划任务 (cron job) 执行。  
  
1. 验证版本：  
更新完成后，验证您的版本是否匹配或超过上表中列出的安全版本。  
  
1. 审计管理用户：  
检查   
/etc/trueuserowners  
 和   
/etc/passwd  
 文件，或使用 WHM “列出帐户” (List Accounts) 工具，确保在漏洞窗口期内没有创建未经授权的用户。  
  
1. 查看访问日志：  
检查   
/usr/local/cpanel/logs/access_log  
 和   
/var/log/secure  
，查找来自陌生地理位置数据的失败或成功的登录尝试。  
  
1. 启用多重身份验证 (MFA)：  
虽然这个特定的错误可能绕过了一些身份验证路径，但多重身份验证仍然是防御 99% 基于凭据攻击的强大手段。如果您还没有为 WHM 启用它，现在是时候了。  
  
1. 防火墙加固：  
使用   
iptables  
 或   
csf  
 (ConfigServer Security & Firewall) 将 cPanel/WHM 端口的访问限制在已知的、受信任的 IP 地址。  
  
### 关于威胁格局的总结  
  
安全不是一个静态的终点；它是一个不断完善的过程。这次 cPanel 事件提醒我们，即使是我们信任的用于保护服务器安全的软件本身也可能成为故障点。通过保持健康的警惕性和分析性思维，我们可以从被动的受害者转变为主动的防御者。  
  
  
截至 4 月 29 日凌晨，许多主要供应商已成功部署了这些补丁。然而，互联网上的“影子 IT”——成千上万个无人管理或被遗忘的 VPS 实例——仍然是巨大的风险隐患。如果您为客户或自己的企业管理服务器，请立即验证您的状态。网络边界不再是城墙；它是一系列必须不断审查的数字握手。  
  
  
  END    
  
  
阅读推荐  
  
  
[【安全圈】伊朗黑客组织：已“开盒” 2379 名美国海军陆战队员，掌握数万名中东美军姓名、住址、日常轨迹、购物习惯等](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=1&sn=da1650f67f6af7da8ad2b79dff4f91a3&scene=21#wechat_redirect)  
  
  
  
[【安全圈】医疗科技大厂美敦力 IT 系统遭遇黑客入侵，未影响服务交付](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=2&sn=6a35f617d45895376be8b42f42bc2cd0&scene=21#wechat_redirect)  
  
  
  
[【安全圈】巴西 LofyGang 团伙沉寂三年后卷土重来，发起 Minecraft LofyStealer 窃取器活动](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=3&sn=86fa3d53221d6b2950f6138d34ba3c1f&scene=21#wechat_redirect)  
  
  
  
[【安全圈】“幻影核心” 利用 TrueConf 漏洞入侵俄罗斯网络](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076045&idx=1&sn=d9eecb878e9564d2a2967040fcb4511b&scene=21#wechat_redirect)  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEDQIyPYpjfp0XDaaKjeaU6YdFae1iagIvFmFb4djeiahnUy2jBnxkMbaw/640?wx_fmt=png "")  
  
**安全圈**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
←扫码关注我们  
  
**网罗圈内热点 专注网络安全**  
  
**实时资讯一手掌握！**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCE3vpzhuku5s1qibibQjHnY68iciaIGB4zYw1Zbl05GQ3H4hadeLdBpQ9wEA/640?wx_fmt=gif "")  
  
**好看你就分享 有用就点个赞**  
  
**支持「****安全圈」就点个三连吧！**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCE3vpzhuku5s1qibibQjHnY68iciaIGB4zYw1Zbl05GQ3H4hadeLdBpQ9wEA/640?wx_fmt=gif "")  
  
  
