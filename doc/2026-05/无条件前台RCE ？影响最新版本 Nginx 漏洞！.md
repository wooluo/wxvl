#  无条件前台RCE ？影响最新版本 Nginx 漏洞！  
原创 一个不正经的黑客
                    一个不正经的黑客  一个不正经的黑客   2026-05-20 15:36  
  
![Pasted image 20260520232541](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR19KZiabjGcFicMrulqfWBzAIvgMQt90fMSLOpbqkEgzhFFk5FsGyAibJnFT4UZ33530wibqPjrxtXtTial7bsUEWYqkIAyh4PHRLO0/640?wx_fmt=png&from=appmsg "")  
## 前文  
  
刷推看到 Nebula Security 公布 nginx-poolslip 的EXP利用演示视频！  
  
推上内容翻译过来如下  
  
介绍 nginx-poolslip，这是针对最新 nginx 发布版 1.31.0 的一个新的 RCE。  
  
nginx-rift 已经打了补丁，但我们的安全代理 Vega 发现了一个新的 0day。  
  
我们将在补丁发布 30 天后，在 http://nebusec.ai 上公开完整技术分析，包括 ASLR 绕过。  
  
![Pasted image 20260520223345](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR3FIJx26vYHN8sQe4YYwujAbjMHibOViaN3TF04riaXINueCKuz8UFkSN5VIAdmLhTKMnZPntWPOS9pIZUlTrqnibLoPTvVmqDnZeQ/640?wx_fmt=png&from=appmsg "")  
![]( "")  
![]( "")  
## 事件分析  
  
通过查看官网 https://nebusec.ai/ 公开介绍来看  
  
这是一家小型独立安全研究实验室，主打 AI 驱动的安全工具，应用方向包括威胁情报、漏洞研究和事件响应。  
  
这次 Nginx 漏洞是由其自研的 Vega AI Agent 辅助发现的。  
  
近一两年，打着“AI 安全”旗号的产品已经很多，但其中相当一部分更偏向概念包装，  
真正能拿出硬核漏洞成果的并不多。  
  
不过这个漏洞利用，从视频上看，  
300 次 请求就绕过ASLR获取base基值确实有点东西，不是属于那种暴力Fuzz的手段，应该是找到比较巧的信息泄漏。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR1jeM3wSdLkMsOS9cW8f5iaxXrtpy148hGsOmxziaUHy8293bTE8tAStW1GEQmiav42eDKeHCqpn01I2nHWibJ3DHibhSKcK4FaK7Zg/640?wx_fmt=png&from=appmsg "")  
  
利用 codex 分析了一波，这个漏洞可能跟HTTP2有关系，  
  
![Pasted image 20260520231756](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR1FtJgfUMGZ1TweKHUBliciaE9X4OlND3PTAGd4upfk8u9bryfyMY71gyMn9KMemwtNqlvI4coBn6WBZDuiaYiaYf9WDYOALWdtp6w/640?wx_fmt=png&from=appmsg "")  
  
不过，如果真的和http2模块有关，那么这个漏洞的影响面就并不会特别大，因为http2不是默认开启的，而且重定向路径可控条件在真实条件下是挺苛刻的。  
  
当然，也有可能目前补丁是还没有发布，所以目前具体情况都是猜测！  
  
![Pasted image 20260520232244](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR0icBRkWXyHEUicKzaE2rYUeD7NicUbQl2ibQBSQkdNW382n3TvUXsRQwUaUD9y8Y5lN7JXBwYxMibkcltXqk9qVAthr1VsgGQuAkK8/640?wx_fmt=png&from=appmsg "")  
  
另外，大家如果对这家公司本身感兴趣，也可以看看他们公开披露的 Bug List。仅内核相关条目就有 709 个，整体产出相当高。  
  
![Pasted image 20260520223636](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR06JuuKMJDSJKCmOtFwTiaNblXRXGUpDNPgNFsLUmy4ch7kjRqgIEA5jQWjB5XQSMcjELmLHicrCliad5ENLoAmocQTbMEzRnj8p8/640?wx_fmt=png&from=appmsg "")  
  
至少从结果上看，AI 对漏洞研究的加速作用，已经不只是营销叙事，而是在持续转化为可见的漏洞发现能力。  
## 自由讨论  
  
如果把这件事放到更大的背景下看，AI 加持下的漏洞挖掘范式，正在以更高的质量和更高的产出，持续重塑传统以人工为主的研究方式。  
  
最直观的变化就是效率提升。过去一项可能需要投入一周时间的漏洞挖掘工作，  
在 AI 辅助下，周期现在很可能被压缩到一天甚至更短。  
  
更有意思的是，很多人原本认为二进制安全是门槛最高、最依赖经验积累、也最难被自动化渗透的领域之一。  
  
但从近来的漏洞涌现趋势看，二进制相关漏洞反而成了 AI 辅助研究中最活跃、产出最明显的方向之一。  
  
现阶段来说，  
甲方安全的重点也许不应该再继续聚焦事前防御，而是需要转变精力去建设事中对抗和事后溯源链路。  
  
未来，只有具备真正纵深防御能力的公司或许才能平安无事走到最后！  
  
