#  OpenAI GhostCompact 计费漏洞：token计费差了 669 倍  
原创 i3eg1nner&林00
                    i3eg1nner&林00  SecureNexusLab   2026-10-13 01:45  
  
今年8月，Xint 的研究者在重构自家内部 agent 框架的时候，发现了 OpenAI API 里的一个记账逻辑漏洞，起名 GhostCompact。  
  
听着像个普通的计费乌龙，但这个洞能把 OpenAI 前沿模型的推理，变成近乎白嫖。OpenAI 确认了问题，9月21日推了修复。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/PkfClzhSYiczr940JN2I6F1doyv1GKpOicianUibRDv7Pia4CZothwXuuDANUn2MibgGWftdCKKGnHufyBEicfzkzBficsOsHc5OJWYu5DMgq3BQGFk/640?wx_fmt=png&from=appmsg "")  
## 背景，压缩是个啥  
  
现在所有大模型都有固定的上下文上限。为了不让长对话或者 agent 循环跑到一半直接报错罢工，各家 AI 工具都在用 compaction 上下文压缩技术。做法是把上下文交给一个模型去压，体积变小，但后续轮次需要的重要状态得保住。  
  
OpenAI 的 Responses API 提供两种压缩方式。  
  
一种是独立压缩，直接调 /responses/compact，把完整历史传进去，服务器返回一个压缩项。计费按普通模型请求走，历史按输入 token 收钱，压缩项按输出 token 收钱。  
  
另一种是内联压缩，在请求里带一句 context_management=[{"type": "compaction", "compact_threshold": N}]，当输入 token 超过 N，服务器就自动压缩输入，然后返回一个不透明的压缩项，附带新的输出。  
  
而漏洞就是出现在内联压缩中。  
## 200749和300  
  
漏洞出在这个场景，内联压缩之后紧跟一个工具调用。  
  
当模型压缩完的第一个动作是调工具，API 只按压缩之后那一小撮 token 计费，但工具调用的返回结果里，仍然装着完整的压缩项。而如果模型接下来输出的是一条普通消息，则一切正常，完整输入都会按规矩计费。  
  
Xint 的研究者做了一个对照实验。发同一个约 20 万 token 的输入，只改一个变量，模型下一步是回消息，还是调工具。  
  
回消息，计费输入 token，200749。  
  
调工具，计费输入 token，300。  
  
一模一样的请求，计费差了 669 倍。  
  
![同样的20万token输入，回消息计费200749个token，回工具调用只计费300个，来自Xint的GhostCompact研究](https://mmbiz.qpic.cn/sz_mmbiz_png/PkfClzhSYiczCV5L6thNIJsUPicibUv9PicHGtKBmnIN7f5zr0X0fo8I5icQ1ibfX6rXjsibdhU7cq2sI3pdDWOndAibC0FvaHtlQr7S2xCrk2ILFYY/640?wx_fmt=png&from=appmsg "")  
  
同样的20万token输入，回消息计费200749个token，回工具调用只计费300个，来自Xint的GhostCompact研究  
  
他们把这个差异翻来覆去验证了一遍。输入不管大小、推理力度换档、流式和非流式、开不开提示缓存，全部复现。更要命的是，响应里报告的 token 用量，和组织级 Usage API 的账单完全对得上，这是真实计走的钱，不是显示故障。  
  
所以一个客户端完全可以拿内联压缩请求，用 tool_choice 强制模型调工具，去顶替 /responses/compact 的调用，用零头拿到等价的结果。  
  
能便宜多少，取决于输入上下文的大小和压缩项的大小。在 10 万到 27.2 万 token 的上下文、1千到 5千 token 的压缩项这个区间里，GhostCompact 比独立压缩便宜 20 到 200 倍。  
  
![GhostCompact与独立压缩的成本对比，在不同上下文和压缩大小组合下便宜20到200倍，来自Xint的GhostCompact研究](https://mmbiz.qpic.cn/sz_mmbiz_png/PkfClzhSYicyibUt7SrDEgDwL2jIwA741e9lXG2FzHAsDPDj5aqgalL8FtsrEyjVR5jFjV2zQ8VPOGnRqegChJpL1xU3dFI8nQnyyKsoOdHqA/640?wx_fmt=png&from=appmsg "")  
  
GhostCompact与独立压缩的成本对比，在不同上下文和压缩大小组合下便宜20到200倍，来自Xint的GhostCompact研究  
  
还有个事，这个洞不需要刻意利用才会踩中。任何用内联压缩的人都可能无意触发。agent 循环里，压缩完的下一步通常就是工具调用，按这个结构，它是会成批成批响的。多数 agent 框架里内联压缩默认关闭，但有几个热门工具，包括 OpenClaw，默认打开。  
  
也就是说，修复之前的那段时间里，一部分 OpenClaw 用户的账单，可能一直被少收着钱。  
  
这个洞的方向，还挺照顾用户。  
## 怎么发现的  
  
发现过程本身是个意外。Xint 把内部 agent 框架从独立压缩重构成内联压缩，研究者顺手就注意到了这笔对不上的账。  
  
单看一眼，这就是个轻微的业务逻辑瑕疵，修了就完事。但它的安全影响，得想明白一件事才浮得出来，压缩，到底是什么。  
## 压缩就是推理  
  
近乎免费的压缩，真的很要紧吗。  
  
要紧，因为压缩能执行任意推理。  
  
OpenAI 从来没公开文档讲过他们的压缩是怎么实现的，但公开证据都指向同一个方向，压缩就是一次专门的推理，只不过它的输出，恰好是一个不透明的加密数据块。  
  
它被设计出来是做摘要的，但压缩这一步，可以被系统提示词高度牵引。你可以指示它对输入做任意你想做的推理任务，把结果塞进压缩项里。然后，再找另一个便宜模型接收这个压缩项，把里面的结果渲染出来。  
  
![把压缩步骤当作任意推理的示意图，系统提示词牵引压缩模型完成计算并输出加密块，便宜模型负责渲染结果，来自Xint的GhostCompact研究](https://mmbiz.qpic.cn/mmbiz_png/PkfClzhSYiczvtn1g1R63W9ZwHcBDFlybyQ4rG6PMKMtzbcpbib3mnneCvzpJ3ng1NRiaMtph8Y8RnLF4Y9XqWYjBvpDTVD3fqUUuelN4NicEMQ/640?wx_fmt=png&from=appmsg "")  
  
把压缩步骤当作任意推理的示意图，系统提示词牵引压缩模型完成计算并输出加密块，便宜模型负责渲染结果，来自Xint的GhostCompact研究  
  
两个模型接力，贵的那个，打折跑。  
  
把 GhostCompact 套在压缩这一步上，这套推理管线就彻底烂大街了。  
  
作为演示，Xint 团队做了一个全代码库安全扫描器 GhostScan，代码开在他们的 GitHub 仓库。在几次实际扫描里，GhostScan 在关键开源软件里挖出了真实的 0-day，包括 OpenSSL 里的 CVE-2026-84783。测试下来，GhostScan 的平均成本，只有同等裸推理的四十分之一。  
  
一台四十分之一价格的推理机器，还真挖出了 OpenSSL 的 0-day。压缩能被滥用作推理，这就是实证。  
## 电表  
  
回头再看整件事，它戳中的是一个挺新的信任问题。  
  
云计算按时长计费、按流量计费，那套电表打磨了二十多年，大家已经默认它准。但大模型推理按 token 计费，被计费的一方从头到尾没见过一个 token，能看到的只有 API 自己报出来的一个数字，然后照着这个数字付钱。  
  
电表也是代码，代码就有bug。  
  
其实盯着这只电表琢磨的人，早就有一批了。  
  
今年3月，Hacker News 上有个很典型的案例。有人把 MCP，Model Context Protocol，那套上下文机制当成了省钱工具，让自家的 MCP server 每轮往上下文里注入一份结构固定的依赖图，总 token 反而多出两成，但 prompt cache 命中率被喂到 95.3%，加上输出缩短了 63%，总成本砍掉 58%，16.29 美元的活，6.89 美元干完。同一套思路的变体遍地都是，工具输出存进内存只回传一个 ID 引用，把几十 K 的 tool schema 排成稳定前缀，都是为了多吃几口缓存折扣。  
  
这是照着公开价目表做的合法套利，缓存命中打折，是厂商白纸黑字写进定价页的。  
  
GhostCompact 往前多迈了一步，不研究价目表了，直接让计费器记错账。  
  
幽灵真的完整跑了一遍推理，没进上下文，没上账单，付钱的人毫不知情。GhostCompact 这个名字，起得很准。  
  
这次是一笔打了 200 倍折扣的计费bug，补上了，600美元发出去了。下一次数字落在哪一行、往哪个方向偏，没人知道。  
  
算力成为基础设施的时代，从吃缓存折扣的套利，到记错账的幽灵，大家琢磨的从来是同一件事。  
  
欢迎大家加入微信技术交流群，各位师傅可以添加小助手微信拉你进群：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/PkfClzhSYicwgic5VaPUQKia3UukpWHmejPWu3nJPUbDB4OsWCSVfiaxxVkCV8JnGzdReWFHfDiaa40QMzTT4CY5azmv77iaYaU2CqClDVl07CqvM/640?wx_fmt=jpeg "")  
  
阅读推荐：  
  
[Anthropic最新动作：从玻璃之翼 Project Glasswing 到网络使命 Cyber Mission](https://mp.weixin.qq.com/s?__biz=MzU2MDE2MjU1Mw==&mid=2247490023&idx=1&sn=efdbd637e2234c0ae664ce5eb84f785f&scene=21#wechat_redirect)  
  
  
[RSI未来已来？剑桥大学CASP最新政策建议发布，三位图灵奖得主联名论文](https://mp.weixin.qq.com/s?__biz=MzU2MDE2MjU1Mw==&mid=2247490013&idx=1&sn=d02cbfad6284fa3729264ecda50acbd8&scene=21#wechat_redirect)  
  
  
  
