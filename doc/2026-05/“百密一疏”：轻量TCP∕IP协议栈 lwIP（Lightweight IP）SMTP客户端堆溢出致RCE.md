#  “百密一疏”：轻量TCP/IP协议栈 lwIP（Lightweight IP）SMTP客户端堆溢出致RCE  
原创 360漏洞研究院
                    360漏洞研究院  360漏洞研究院   2026-05-19 07:46  
  
lwIP 被曝存在 SMTP 客户端堆缓冲区溢出漏洞。攻击者可利用该漏洞构造恶意响应，在**无需认证**  
的前置条件下实现远程代码执行。  
  
  
目前 **360漏洞挖掘智能体已成功复现该漏洞**  
。本文包含完整影响范围、修复方案、技术原理与复现细节，建议用户立即升级。  
  
  
<table><tbody><tr style="box-sizing: border-box;"><td colspan="4" data-colwidth="100.0000%" width="100.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;background-color: rgb(100, 130, 228);box-sizing: border-box;padding: 0px;"><section style="text-align: center;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞概述</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞名称</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">lwIP 2.2.1 SMTP客户端堆缓冲区溢出漏洞</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞编号</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">LDYVUL-2026-00082509</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">公开时间</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">2026-05-16</span></span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">POC状态</span></span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(100, 130, 228);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">已公开</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞类型</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">堆缓冲区溢出</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">EXP状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(100, 130, 228);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">已公开</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">利用可能性</span></span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">高</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(0, 0, 0);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">技术细节状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(100, 130, 228);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">已公开</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">CVSS 3.1</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">8.1</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">在野利用状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未发现</span></p></section></td></tr></tbody></table>  
  
  
**01**  
  
**漏洞影响范围**  
  
  
  
受影响的软件版本：  
  
lwIP ≤ 2.2.1  
  
  
**02**  
  
**修复建议**  
  
  
  
**正式防护方案**  
  
官方发布了正式的修复Patch，详情如下：  
```
--- a/src/apps/smtp/smtp.c
+++ b/src/apps/smtp/smtp.c
@@ -1062,7 +1062,12 @@ smtp_prepare_auth_or_mail(struct smtp_session *s, u16_t *tx_buf_len)
     u16_t crlf = pbuf_memfind(s->p, SMTP_CRLF, SMTP_CRLF_LEN, auth);
     if ((crlf != 0xFFFF) && (crlf > auth)) {
       /* use tx_buf temporarily */
-      u16_t copied = pbuf_copy_partial(s->p, s->tx_buf, (u16_t)(crlf - auth), auth);
+      /* Clamp copy length to tx_buf capacity. (crlf - auth) is derived from
+       * the server response and can exceed SMTP_TX_BUF_LEN if a malicious
+       * server sends an AUTH capabilities line longer than 255 bytes. */
+      u16_t auth_line_len = (u16_t)(crlf - auth);
+      u16_t safe_len = (auth_line_len < SMTP_TX_BUF_LEN) ? auth_line_len : SMTP_TX_BUF_LEN;
+      u16_t copied = pbuf_copy_partial(s->p, s->tx_buf, safe_len, auth);
       if (copied != 0) {
         char *sep = s->tx_buf + SMTP_KEYWORD_AUTH_LEN;
         s->tx_buf[copied] = 0;
```  
  
  
**03**  
  
**漏洞描述**  
  
  
  
近日，安全研究团队xchglabs披露了 lwIP 2.2.1中存在一个严重的堆缓冲区溢出漏洞。该漏洞允许网络可达的恶意 SMTP 服务器（或中间人攻击者）通过构造超长的 EHLO 响应中的 AUTH 能力行，在 lwIP 客户端上触发堆缓冲区溢出，可能导致远程代码执行。  
  
  
经分析，漏洞存在于 src/apps/smtp/smtp.c 文件的 smtp_prepare_auth_or_mail() 函数中。当 lwIP SMTP 客户端解析服务器返回的 EHLO 响应时，代码使用 pbuf_copy_partial() 将 AUTH 能力行拷贝到固定 256 字节的 tx_buf 缓冲区，但未对拷贝长度进行边界检查。恶意服务器可控制 crlf - auth 的差值（最大可达约 64KB），导致大量数据溢出到 struct smtp_session 的后续字段（包括 callback_fn 函数指针），最终通过 smtp_free() 调用劫持的函数指针实现代码执行。  
  
  
值得注意的是，在同一个 smtp.c 文件中，所有其他向 tx_buf 写入数据的函数——包括 HELO/EHLO、PLAIN/LOGIN 的 base64 编码、MAIL 和 RCPT——要么有编译时断言（LWIP_ASSERT），要么长度参数受 SMTP_TX_BUF_LEN 限制。唯独 AUTH 能力解析器没有任何边界检查。正是这一处遗漏，让攻击者能够通过一个超长的 250-AUTH 响应，将 256 字节的缓冲区击穿。  
  
  
该漏洞在客户端发送 AUTH 凭证之前即可触发，无需认证前置条件。即使设备未配置 SMTP 凭据，EHLO 响应解析仍在 AUTH 握手之前执行，smtp_prepare_auth_or_mail() 仍会解析 AUTH 能力行并触发溢出。  
  
  
**04**  
  
**漏洞复现**  
  
  
  
360漏洞研究院已成功复现 lwIP 2.2.1 SMTP客户端堆缓冲区溢出漏洞。攻击者启动恶意 SMTP 服务器，在 EHLO 握手阶段返回超长的 250-AUTH 能力行，控制溢出量。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzz8R6Bibd55WAoCN5VMyGfrxYCQLnsDwEDb2kFTpR1k2JAibGuTFmLdw79IBeRYaGNV6912n8X2oaAqCE6TLguEdtzrl4I9HNibNs0/640?wx_fmt=png&from=appmsg "")  
  
lwIP SMTP客户端向外部邮件服务器发起连接。解析响应时 pbuf_copy_partial() 将超长数据写入 tx_buf，溢出覆盖 callback_fn。服务器断开连接后 smtp_free() 调用被劫持的指针，完成代码执行。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzz9qvU4WkOJmiactTWq2BBNMqGPwDunoXVJ4sD4UsicOQNJD08OHm8SiaYiavyRvdgEibYAmIuNR3ORuA0k97Swcrb6fqELeEvxNh1Vg/640?wx_fmt=png&from=appmsg "")  
  
lwIP 2.2.1 SMTP客户端堆缓冲区溢出漏洞复现  
  
  
**05**  
  
**时间线**  
  
  
  
2026年05月19日，360漏洞研究院发布本安全风险通告。  
  
  
**06**  
  
参考链接  
  
  
  
https://xchglabs.com/blog/lwip-smtp-auth-overflow.html  
  
https://xchglabs.com/assets/patch_125_smtp_txbuf.diff  
  
  
07  
  
更多漏洞情报  
  
  
  
“扫描下方二维码，进入公众号粉丝交流群。更多一手网安资讯、漏洞预警、技术干货和技术交流等您参与！”  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/5nNKGRl7pFgrNicMticDTWVCUWbOwRuWcrYSpAlwDRibKNLbe3KialEfR0Y2PlPAvS4MN50asXETicAviaRy1gRicI2Dw/640?wx_fmt=gif&from=appmsg "")  
  
  
建议您订阅360数字安全-漏洞情报服务，获取更多漏洞情报详情以及处置建议，让您的企业远离漏洞威胁。  
  
  
邮箱：360VRI@360.cn  
  
网址：https://vi.loudongyun.360.net  
  
  
  
“洞”悉网络威胁，守护数字安全  
  
  
**关于我们**  
  
  
360 漏洞研究院，隶属于360数字安全集团。其成员常年入选谷歌、微软、华为等厂商的安全精英排行榜, 并获得谷歌、微软、苹果史上最高漏洞奖励。研究院是中国首个荣膺Pwnie Awards“史诗级成就奖”，并获得多个Pwnie Awards提名的组织。累计发现并协助修复谷歌、苹果、微软、华为、高通等全球顶级厂商CVE漏洞3000多个，收获诸多官方公开致谢。研究院也屡次受邀在BlackHat，Usenix Security，Defcon等极具影响力的工业安全峰会和顶级学术会议上分享研究成果，并多次斩获信创挑战赛、天府杯等顶级黑客大赛总冠军和单项冠军。研究院将凭借其在漏洞挖掘和安全攻防方面的强大技术实力，帮助各大企业厂商不断完善系统安全，为数字安全保驾护航，筑造数字时代的安全堡垒。  
  
