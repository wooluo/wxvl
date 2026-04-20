#  NIST突然宣布，漏洞太多，处理不过来了  
原创 玄月调查小组
                    玄月调查小组  玄月调查小组   2026-04-19 06:04  
  
漏洞数量5年间暴涨  
263%  
。   
  
2026年Q1同比再涨  
33%  
。   
  
2025年处理  
42000条CVE  
，创历史新高。  
  
过去，NIST 的 NVD 项目分析所有 CVE 添加详细信息——例如严重性评分和受影响产品列表——这些信息能帮助安全团队确定  
漏洞处理的优先级并实施缓解措施  
。  
  
然而就在这周，美国国家标准与技术研究院（NIST）正式官宣。  
  
全球最大、最权威的网络安全漏洞数据库NVD。放弃运行26年的全量分析模式，  
不再分析所有CVE  
。  
  
很明显，这不是一次小变化。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFtibPSHU8PiaIvOF6bxpb5eITooSpy3cynomVNib3seTl43B0icjxAJkDWbibZWYyc8ftpvBeFrhubzB7Mp1ZzUo8t5Xmav5CY4iaUibn8/640?wx_fmt=png&from=appmsg "")  
## 漏洞数量暴涨，压垮了NVD  
  
从2020到2025年，全球CVE漏洞提交量暴涨了263%。 这个数字有多恐怖？ 相当于每2年，漏洞数量就翻一番。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFtibgkNDX8Nww0pmZJfTDk6UFibkz2e6Pibwt8OeaaGOcdN2JP8lFjKUTB2T9QASEgW0EjKU0t8PKhbicWVdTx7M6aq5D5ufRMk5KB4/640?wx_fmt=png&from=appmsg "")  
  
随着AI在安全领域的发力，2026年第一季度，这个数字又同比上涨了33%。  
  
**漏洞数量，没有任何放缓的迹象。**  
  
NIST已经拼尽全力了。 2025年，他们一共处理了近42000条CVE漏洞。但即便如此，积压的漏洞还是像滚雪球一样越滚越大。   
  
目前积压未处理的 CVE 总量已超过 **3 万条**  
。  
## NIST只保关键软件，其余全部放弃  
  
从4月15日起，NIST只给三类漏洞提供官方分析和评分：  
- 第一类，已经被黑客实际利用的漏洞（**CISA KEV**  
）。  
  
- 第二类，**美国政府使用的软件**  
漏洞。  
  
- 第三类，行政令14028定义的**关键基础设施软件漏洞**  
。  
  
只有这三类漏洞，NIST会优先完成分析。  
  
剩下的所有漏洞，全部被打上"最低优先级"标签。 NIST不会主动给它们加任何细节。  
  
你没看错，就是不管了。  
## 历史积压漏洞，直接打入"冷宫"  
  
更狠的是对历史积压的处理。   
  
所有在2026年3月1日之前提交、还没被分析的漏洞。  
  
NIST直接把它们全部划入"不计划处理"类别。  
  
除非你发邮件专门申请。 否则这些漏洞永远不会有官方数据。  
  
而去年被标记为"延期处理"的所有漏洞。 也会在2周内，批量转为"修改后不再分析"状态。 未来将根据资源情况，进行信息富化。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFt8gR9MCApgdmRyLR6aoBqg5u4ib8tKyqL2naYFCRIBiaAQjFhKTxPvZY1ia3yxrrW5AkWCibyiaIo6WJDIiavhicW0qGjibiaD24PtFvZfA/640?wx_fmt=png&from=appmsg "")  
## 漏洞管理，一夜回到解放前  
  
NVD是什么？它是全球网络安全的"通用货币"。****  
  
**几乎所有的安全产品**  
：漏扫、IDS、WAF、威胁情报。   
  
都以NVD的数据为标准。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFt8YxVWaB2UaAcJWTN9RVE7QicicBYe9EoY0IcuwHvpKlYG9TebPUBuYrHxiaGdId6Ecv61TgMmyqUuBhqzYEoQAA8yY2o9JWZ7NC8/640?wx_fmt=png&from=appmsg "")  
  
  
CVE就是每个漏洞的唯一身份证号。   
  
而NVD就是给这些身份证号盖章、写备注的官方机构。   
  
这套机制已经运行了20多年。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFticbq0Z4UPA2dPjb6fOhdIAtvUyJqV5Mu84ibm1sibw8fzfLA5jNA39yfniamHzwibKjMcOzRgLnIvp5yUibmcfRnfC6icOmTibickn4Fpo/640?wx_fmt=png&from=appmsg "")  
  
以前，只要有新漏洞出现。   
  
NIST会在几天内给出评分和影响范围。   
  
企业只要照着NVD的优先级打补丁就行。  
  
现在，对于99%的普通企业来说，如果没有用到那三类软件，以后面对海量漏洞。  
  
要么自己分析。   
  
要么就只能赌运气，赌这个漏洞危害不高。  
  
攻击者不会利用。  
## NIST的无奈，也是全球互联网的安全危机  
  
NIST不是不想管。是真的管不动了。  
  
漏洞数量的增长速度。已经远远超过了NIST的极限。  
  
 First预计今年将提交5万多个 CVE  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFticjvliaXbfRKhSicsv0aoVqK60arE1vjlTFyukhu6cvFufhWgNPUgBSv7ZzH6ve8SYgsOeiaVx8AwhL23iaOJHTfW1iajLWzRRTfrn0/640?wx_fmt=png&from=appmsg "")  
  
FIRST CEO Chris Gibson表示：“  
漏洞发现和利用的速度之快，是我们前所未见的。  
”  
  
NIST自己也承认。全量分析模式已经完全不可持续。  
  
他们现在只能先保住最核心的部分。然后慢慢开发自动化工具，利用AI来提升效率。  
  
但什么时候能上线？没人知道。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aYef9qMYLnLIqb6wTzbSErRKzmg7cicZCtQB7Yz9PaKF4ichseJFxMOjJvgVtLVLmwInwfM88sTYvibpCibA7e6DMA/640?wx_fmt=png&from=appmsg "")  
  
以上，既然看到这里了，如果觉得不错，随手点个赞、在看、转发三连吧，如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章，我们，下次再见。  
  
参考资料: NIST Updates NVD Operations to Address Record CVE Growth https://www.nist.gov/news-events/news/2026/04/nist-updates-nvd-operations-address-record-cve-growth  
  
