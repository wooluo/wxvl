#  俄罗斯APT组织利用Zimbra XSS漏洞，在“幽灵邮件行动”中攻击乌克兰政府  
原创 网络安全9527
                    网络安全9527  安全圈的那点事儿   2026-03-20 12:03  
  
与俄罗斯国家有关联的威胁行为者对乌克兰政府机构发起有针对性的网络攻击，利用 Zimbra Collaboration Suite 中的跨站脚本 (XSS) 漏洞窃取凭证和敏感的电子邮件数据。  
  
此次攻击活动被称为“幽灵邮件行动”，其显著特点是完全没有传统攻击特征——没有恶意文件附件，没有可疑链接，也没有宏。  
  
此次攻击是通过乌克兰国家水文局（乌克兰基础设施部下属的关键国家基础设施机构）于 2026 年 1 月 22 日收到的一封钓鱼邮件发起的。  
  
这封用乌克兰语写成的电子邮件，伪装成国家内务学院（NAVS）一名四年级学生的例行实习咨询邮件。  
  
这条信息的措辞力求显得无害，甚至还附上了道歉声明，以防误发到其他收件箱——这是消除收件人疑虑的经典策略。  
  
Seqrite 研究人员在 2026 年 2 月 26 日将钓鱼邮件上传到 VirusTotal 后发现了该活动，当时 VirusTotal 的检测记录为零。  
  
电子邮件的 HTML 正文中隐藏着一个经过 base64 编码的大型 JavaScript 有效载荷，该有效载荷隐藏在一个 display:none div 块中。  
  
该漏洞利用的目标是 CVE-2025-66376，这是 Zimbra Collaboration Suite 中的一个存储型 XSS 漏洞，已在 2025 年 11 月的 ZCS 版本 10.0.18 和 10.1.13 中进行了修复。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7M94YHGaURycF5Rtn0NXPGqo8REyFFeibv80icKlyJxUfJCToWUT2VDzR3egmMEGoEbfygx2bJJqLzFg6PZAJib3xvCwfXo5yr8F0/640?wx_fmt=png&from=appmsg "")  
  
该漏洞源于使用 CSS 指令对 HTML 内容进行清理不足 @import 。一旦受害者在 Zimbra 的经典用户界面中打开已认证会话的电子邮件，恶意代码就会在浏览器中静默执行。  
  
根据与先前记录的Zimbra 攻击模式的技术重叠以及目标的地缘政治性质，Seqrite 以中等置信度将 GhostMail 行动归因于 APT28（Fancy Bear）。  
  
此次针对乌克兰负责海事和水文基础设施的政府机构的网络攻击，与俄罗斯在持续冲突中针对公共部门机构开展的国家支持的网络行动如出一辙。  
  
一旦有效载荷执行完毕，攻击者便会悄无声息地窃取会话令牌、登录凭据、备份双因素身份验证码、浏览器保存的密码以及受害者长达 90 天的电子邮件存档——所有这些都不会引发任何警报。  
  
数据通过HTTPS和DNS通道同时泄露，这使得通过传统的网络过滤方式进行检测变得尤为困难。  
## 两阶段感染机制  
  
此次攻击分两个阶段进行，两个阶段都完全在受害者的浏览器中运行，没有向磁盘写入任何数据。  
  
在第一阶段，JavaScript 加载器首先检查 ID 为“zmb_pl_v3_”的脚本是否已经在运行，以防止重复注入。  
  
然后，它使用该函数解码 base64 有效载荷 atob() ，并使用密钥“twichcba5e”应用 XOR 解密来解包最终的 JavaScript 有效载荷。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7PrwPMu87nJI31ScrXaiaD6BJOuGJ6XuLr3vLtQHwGZKic7uEuF3m5A6M9WzVtuU7hMWPNT9yuwa3W26CUAibBYjLiaLOBxM1yMnIk/640?wx_fmt=png&from=appmsg "")  
  
这段解码后的脚本被注入到顶层文档中，从而绕过了网页邮件的 iframe 沙箱，并获得了对浏览器 cookie、localStorage 和同源 SOAP API 的完全访问权限。  
  
第二阶段引入了完整的浏览器窃取程序，首先为每个受害者生成一个唯一的 12 个字符的字母数字令牌，该令牌用作每个命令与控制 (C2) 请求中的标识符。  
  
硬编码的C2域名为 zimbrasoft[.]com[.]ua，注册于2026年1月20日——比钓鱼邮件到达时间早两天。九个并行数据收集操作同时启动，最大限度地提高了单个浏览器会话中的数据量。  
  
这些操作捕获了电子邮件内容、服务器配置、CSRF 令牌、移动设备配置文件、OAuth 应用程序访问权限、备份 2FA 代码和浏览器自动填充凭据。  
  
此次攻击还在受害者的账户上悄悄启用了IMAP访问权限，并创建了一个名为“ZimbraWeb”的持久性应用程序专用密码，使攻击者能够长期访问邮箱，即使完全重置密码后也无法再次访问。  
  
  
