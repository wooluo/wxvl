#  Apache HTTP/2炸弹漏洞PoC公开，可远程耗尽服务器内存  
FreeBuf
                    FreeBuf  FreeBuf   2026-06-19 11:18  
  
![FreeBuf](https://mmbiz.qpic.cn/mmbiz_gif/icBE3OpK1IX3TJoDFib5J7jic2x5u0bn74Vz2FqXL9HARBdrDSpOWZ3cjarcVz5l1KHI2RF3n3xNlVD5AVs5dOc13N5nKZq4FicVs75RQp9Xiap0/640?wx_fmt=gif "")  
  
  
![HTTP/2炸弹漏洞](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX1TM07RsvboLMsicMBK551sP0ICmeqoHBNPbxN61OX0ahgXwI0vlrPKkskNLqS1rmB6RSl9CGdnTtclCPwuLjgGXLR130uzpjJw/640?wx_fmt=png "")  
  
  
Apache HTTP服务器中发现一个被命名为"HTTP/2炸弹"的关键拒绝服务漏洞(CVE-2026-49975),目前概念验证(PoC)利用代码已公开。该漏洞允许远程攻击者在无需认证的情况下耗尽服务器内存并中断服务,对运行未打补丁的Apache部署的组织构成重大风险。  
  
  
Part  
01  
  
漏洞技术原理  
  
该漏洞存在于Apache HTTP服务器的HTTP/2请求处理路径中。当处理多个Cookie头字段时,系统会合并这些字段但未正确计入LimitRequestFields指令限制,从而绕过关键资源保护机制。  
  
  
攻击者可构造一个经过HPACK编码的小型HTTP/2请求,该请求解压缩后会生成大量Cookie头字段。在Cookie头合并过程中,服务器被迫为每个字段扩展重复分配内存。攻击者随后通过将初始窗口大小设为零来利用HTTP/2流量控制机制,故意延迟响应传输并使受影响流保持无限期开放,阻止服务器释放已分配内存,造成持续内存耗尽状态。  
  
  
Part  
02  
  
PoC利用细节分析  
  
Apache HTTP服务器2.4.17至2.4.67的所有版本均受影响,该漏洞已在2.4.68及后续版本中修复。  
  
  
公开的PoC利用代码托管在GitHub的EQSTLab/CVE-2026-49975仓库中,使用基于Python的利用脚本演示攻击过程。攻击可在Docker化环境中复现,其中服务器容器内存限制为8GB。  
  
  
攻击脚本支持以下参数配置:  
  
- 连接与流数量 - 控制并发HTTP/2连接和流数量(如10个连接×100个流)  
  
- HPACK引用 - 最多4091个头表引用以最大化Cookie字段扩展  
  
- 流量控制保持 - 初始窗口设为0以暂停数据传输最长300秒  
  
- 滴灌式传输 - 每2秒仅释放1字节以人为保持流活跃  
  
测试显示,Apache容器的内存使用量在攻击期间急剧攀升并在保持阶段持续高位,证实内存耗尽攻击成功。成功利用将导致远程拒绝服务、内存过度消耗以及合法用户请求处理延迟或失败,无需特权访问即可使服务器离线。  
  
  
Part  
03  
  
缓解措施建议  
- 立即升级至Apache HTTP服务器2.4.68或更高版本  
  
- 在暂无法升级的服务器上临时禁用非必需HTTP/2功能  
  
- 监控Web服务器容器或进程的异常内存增长模式作为早期检测信号  
  
参考来源：  
  
PoC Exploit Released for HTTP/2 Bomb Remote DoS Vulnerability in Apache HTTP Server  
  
https://cybersecuritynews.com/http-2-bomb-dos-apache/  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651340512&idx=1&sn=88628c0f7cabd6cae377643824d2ffe9&scene=21#wechat_redirect)  
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
### 电报讨论  
  
  
[]()  
  
  
###   
  
![扫码加入AI安全交流群](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2cVdntRnNdReFrEC9uicNrkrzxp72OgpNDz7srDyd0sPwPYZejHF5E9TqvpJWJ5qHkqqDtlREdb65n2YIfXD2jnNBFTqRI2LhM/640?wx_fmt=png "")  
  
  
![下载FreeBuf知识大陆APP](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX1uQ9xLm3d4ZLoKboK1GHqPxkP2twtDHay11g4CqZnzXFyjmtib8WT7iaP1Libibnib4wCE0UreN6hUMgkYJ6NP9gD2ib8g2RNFTUAj8/640?wx_fmt=png "")  
  
  
  
