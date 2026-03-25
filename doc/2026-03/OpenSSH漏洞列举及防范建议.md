#  OpenSSH漏洞列举及防范建议  
原创 Caigensec
                    Caigensec  菜根网络安全杂谈   2026-03-25 09:07  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/GagrLP56FibVwx4hfFezZXyhDATCQtibMyLqTzMlb8DXuhXPvQ2pwyG7UsYv9As6Ujffp9g7wiaDVBNo4ncIghIkA/640?wx_fmt=png "")  
  
点击上方  
蓝字  
关注我们  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Rw1GYXElC3fsz3fQsXSqeO7MgiamgBtBjFwpXTXJkafnVYDcxTe2VibnQPWsmZnoiaLeOzRqf8pgRsA8d7gsEMDhQ/640?wx_fmt=png "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ick6R1E3YokGa1ibCe5rpdRyAoBRvrYqueA3wY9CwYuRkqG2lE5MctQus6KVY2uic2Kj03Cf6xiaQHzOjibL8QJTomw/640?wx_fmt=png "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Sg02xflJ62rdxefX9thdaL8hxJWicY1vPlEmzNIWcBy2ypXTggHXX9e0kFDEVicficwTDdlLHLNrh6ica1SEvMqKeQ/640?wx_fmt=gif "")  
  
免责声明：本文仅用于合法范围的学习交流，若使用者将本文用于非法目的或违反相关法律法规的行为，一切责任由使用者自行承担。请遵守相关法律法规，勿做违法行为！本公众号尊重知识产权，如有侵权请联系我们删除。  
  
01  
  
OpenSSH漏洞盘点  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1BiahkUNKiclteCuCXiaCW4UMxvnLW4rTb6NTKnUoGsLbztIoJUj2t9ttkcdhm6ryDTH9k9b8uyl7Tj9Rf3PaWMYA/640?wx_fmt=png "")  
  
1、OpenSSH中间人攻击漏洞（CVE-2025-26465）  
  
影响范围： OpenSSH 6.8p1 至 9.9p1  
  
漏洞描述：  
 VerifyHostKeyDNS 功能存在逻辑错误，当客户端通过 DNS 验证服务器密钥时，特定错误 （如内存分配失败） 会被误判为验证成功，导致攻击者可伪造服务器密钥并拦截敏感数据。  
  
  
2、OpenSSH拒绝服务漏洞（CVE-2025-26466）  
  
影响范围  
： OpenSSH 9.5p1 至 9.9p1  
  
漏洞描述  
： 密钥交换过程中内存分配未限制，攻击者可发送超大 PONG 数据包 （约 234MB），导致客户端或服务器 CPU 和内存资源耗尽，引发服务瘫痪。  
  
  
3、OpenSSH ssh-agent远程代码执行漏洞（CVE-2023-38408）  
  
影响范围  
： 5.5 < OpenSSH <= 9.3p1  
  
漏洞描述  
：由于对CVE-2016-10009的修复不完整，9.3p2之前的OpenSSH中的PKCS#11功能存在不受信任的搜索路径，如果受害者系统上存在通过ssh-agent(1)的PKCS#11支持加载的特定库，且agent被转发到威胁者控制的系统（启用ssh-agent转发），则可能会导致远程代码执行。  
  
  
4、OpenSSH智能卡密钥添加漏洞（CVE-2023-28531）  
  
影响范围  
：OpenSSH版本8.9 到 9.2，  
  
漏洞描述  
：该漏洞存在于ssh-add工具中，该工具用于将私钥加载到ssh-agent认证代理中。在 OpenSSH 8.9 中，增加了一个功能来支持存储在智能卡上的密钥的“逐跳目的地约束”。这个功能允许用户加载一个密钥，但将其使用限制在特定主机（例如，“仅允许此密钥用于 ssh jump-host”）。然而，由于实现中的逻辑错误，当用户执行添加具有这些约束条件的智能卡密钥的命令时（例如，ssh-add -h "constraint" ...），约束条件实际上从未发送到ssh-agent。代理只是接收密钥并将其存储为不受限制的密钥。这意味着密钥可以用于认证到任何接受它的服务器，而不仅仅是预期的目标。  
  
  
5、OpenSSH ProxyCommand命令注入漏洞（CVE-2023-51385）*  
  
影响范围  
：OpenSSH<9.6  
  
漏洞描述  
：此漏洞是由于OpenSSH中的ProxyCommand命令未对%h、%p或类似的扩展标记进行正确的过滤，攻击者可通过这些值注入恶意shell字符进行命令注入攻击。  
  
  
6、OpenSSH Terrapin前缀截断攻击漏洞（CVE-2023-48795）  
  
影响范围  
：OpenSSH 9.6以前  
  
漏洞描述  
：Terrapin 攻击是针对 SSH 协议本身的一种攻击，通过中间人 (MitM) 攻击，使受感染的客户端错误地认为服务器缺乏对用户身份验证中使用的最新签名算法的支持。  
  
  
7、OpenSSH PKCS11目标约束漏洞（CVE-2023-51384）  
  
影响范围  
：OpenSSH 9.6以前  
  
漏洞描述  
：ssh-agent中，某些目标约束可能无法完全应用。当在添加PKCS#11托管的私钥指定目标约束时，这些约束仅适用于第一个密钥，即使PKCS#11令牌返回多个密钥。  
  
  
8、OpenSSH身份验证绕过漏洞（CVE-2023-51767）  
  
影响范围  
：OpenSSH 9.6以前  
  
漏洞描述  
：该漏洞源于当使用常见类型的 DRAM 时，mm_answer_authpassword 中已验证的整数值不能抵抗单个比特的翻转，导致攻击者可以绕过身份验证。  
  
  
9、OpenSSH远程代码执行漏洞（CVE-2024-6387）*  
  
影响范围  
：8.5p1 <= OpenSSH < 9.8p1  
  
漏洞描述  
：  
该漏洞是由于OpenSSH服务器(sshd)中的信号处理程序竞争问题，未经身份验证的攻击者可以利用此漏洞在Linux系统上以root身份执行任意代码  
。  
  
  
10、OpenSSH权限提升漏洞（CVE-2021-41617）*  
  
影响范围  
：OpenSSH版本6.2-8.7  
  
漏洞描述  
：当sshd(8)在执行AuthorizedKeysCommand或AuthorizedPrincipalsCommand时，未能正确地初始化，其中AuthorizedKeysCommandUser或AuthorizedPrincipalsCommandUser指令被设置为以非root用户身份运行。相反，这些命令将继承 sshd(8) 启动时的组的权限，根据系统配置的不同，继承的组可能会让辅助程序获得意外的权限，导致权限提升。在sshd_config(5)中，AuthorizedKeysCommand和AuthorizedPrincipalsCommand都没有被默认启用。  
  
  
11、OpenSSH 用户枚举漏洞（CVE-2018-15473）*  
  
影响范围  
：OpenSSH 7.7 及之前版本  
  
漏洞描述：  
该漏洞源于程序会对有效的和无效的用户身份验证请求发出不同的响应，攻击者可通过发送特制的请求利用该漏洞枚举用户名称。  
  
  
注：以上内容来自互联网公开信息。  
  
  
  
02  
  
防范建议  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1BiahkUNKiclteCuCXiaCW4UMxvnLW4rTb6NTKnUoGsLbztIoJUj2t9ttkcdhm6ryDTH9k9b8uyl7Tj9Rf3PaWMYA/640?wx_fmt=png "")  
  
如无需要，关闭ssh端口。修改默认端口，通过网络防火墙限制 SSH 端口仅向信任 IP 开放，使用强密码，限制登录尝试与超时，禁用不必要功能，启用详细日志。  
  
  
  
  
END  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ick6R1E3YokFvoM6PLd2g5R9ZyvTVYQhyosDWxvJP5DSfU2zuS01w7sRwGM8y8FPkADsZgW9OzB1fkoEcrsDxmA/640?wx_fmt=png "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
![]( "")  
  
亲爱的朋友，若你觉得文章不错，请点击关注。你的关注是笔者创作的最大动力，感谢有你  
！  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/hTteHHe3QhbWfdLFIQTf8aRCpicxOVskIFGHvib9wFrSvpOkG1prHhy47bGaqjcRHWeZuR0A4TuBLZulsHBp2jYQ/640?wx_fmt=png "")  
  
往期推荐  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ib2rOTTXbaRCpkiapP7gr7ic5WibDjVQhnv7lA7iaDlWwYAFKeCmzovW1vyh58JV9hhCKmwnLSW9zzPBMvkuwaEU1xg/640?wx_fmt=png "")  
  
  
Recommended in the past  
  
[【工具】Xray安装步骤说明](https://mp.weixin.qq.com/s?__biz=MzI5MTIwOTQ5MA==&mid=2247487803&idx=1&sn=c6c2f438b1c3a5527c83575e7a494077&scene=21#wechat_redirect)  
  
  
[【工具】渗透测试必备的浏览器插件推荐](https://mp.weixin.qq.com/s?__biz=MzI5MTIwOTQ5MA==&mid=2247487866&idx=1&sn=b460504a7ac113e37476c4b72e9a301e&scene=21#wechat_redirect)  
  
  
[【工具】Nmap安装及使用参数说明](https://mp.weixin.qq.com/s?__biz=MzI5MTIwOTQ5MA==&mid=2247487908&idx=1&sn=bf7f7d18d6e06ba239e3b619ed90cef6&scene=21#wechat_redirect)  
  
  
