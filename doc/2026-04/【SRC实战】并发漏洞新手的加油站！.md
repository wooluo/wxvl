#  【SRC实战】|并发漏洞新手的加油站！  
隐雾安全
                    隐雾安全  隐雾安全   2026-04-28 01:02  
  
📝 **编者语**  
  
很多人觉得并发哪有注入，命令执行来的迷人，所以并发往往被忽略，但它的产出却非常稳定：  
  
不依赖复杂payload，很多时候只是：  
  
**在“同一时间”，多发几次请求。非常适合新手。**  
  
这篇文章，是学员在实战中挖到的两个并发案例。  
  
我们重点不只是看结果，而是看：  
  
这个漏洞，是怎么被想到、被验证、被放大的。  
  
1  
  
先讲清楚：什么是并发漏洞？  
  
用一句话解释：  
  
**并发漏洞 = 系统在“同一时间处理多个请求”时，没有做好状态校验**  
  
  
**举个简单例子**  
  
正常逻辑是：  
  
扣积分 → 抽奖 → 返回结果  
  
但如果你同时发两个请求：  
  
请求1：扣积分  
请求2：也在扣积分之前进入  
  
就可能变成：  
  
- **扣一次积分**  
  
- **执行两次抽奖**  
  
  
  
  
**本质问题是什么？**  
  
“检查”和“执行”不是原子操作  
  
系统以为你只会请求一次，但你同时发了多次。  
  
  
**并发漏洞常见在哪？**  
  
我这段时间总结下来，高频点是：  
  
- **抽奖 / 抢购**  
  
- **积分获取**  
  
- **优惠领取**  
  
- **答题 / 投票**  
  
- **下单 / 支付**  
  
  
  
 一句话：  
  
**所有“有次数限制 / 有资源消耗”的地方，都值得测并发**  
  
2  
  
案例一：抽奖并发，多抽一次  
  
这个案例其实很典型。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4mrEYejb7xNfQDu7BNxeTve00ceHmWpLDBB3p46XNfxrXJOQWKCyTDK4gMvrgIyHOIQXO6lyqZVqg7G96SkdIVMMzC0LiahaG08/640?wx_fmt=png&from=appmsg "")  
  
1️⃣ 业务规则很清晰  
  
系统规则是：  
  
 一次抽奖需要 88 积分  
  
而我当时只有：  
  
130 积分  
  
按正常逻辑：  
  
只能抽 1 次  
  
  
2️⃣ 我当时的想法很简单  
  
看到这种“扣积分 → 执行操作”的流程，我现在基本会多问一句：  
  
**“如果我同时发两个请求呢？”**  
  
于是我直接用工具做并发请求。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4nFRfkVJbHtUXaZmUJU8HpoMHD7y8tjvAQ0SZ4yzn2nQafIOE4LC9ibBl7sAM502NXqq99RicMTA4QrAV3CJChzxccuRyMkqDmH8/640?wx_fmt=png&from=appmsg "")  
  
  
3️⃣ 并发结果  
  
结果是：  
  
成功抽了 2 次  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lophiczgE3ntic3lYI3D1NheS1REf01n1MZliaUYpT0PISsKV5WwHAfF02Spicicxh6ElnE9jMynQsjBmFxtxCCxSAJ7RkkpibZxcOk/640?wx_fmt=png&from=appmsg "")  
  
  
4️⃣ 实际效果  
  
- **积分只扣了一次**  
  
- **抽奖执行了两次**  
  
  
  
这是一个典型的：**临界条件竞争**  
  
  
5️⃣ 为什么能成功？  
  
本质原因是：  
  
系统流程类似这样：  
  
判断积分是否足够 → 扣积分 → 抽奖  
  
但在并发情况下：  
  
- **两个请求都通过了“判断”**  
  
- **然后才执行扣积分**  
  
  
  
导致逻辑错乱。  
  
  
6️⃣积累的经验  
  
这次出货让我意识到：  
  
**“有消耗的操作，一定要测并发”**  
  
尤其是：  
  
- **抽奖**  
  
- **兑换**  
  
- **支付前校验**  
  
  
  
  
3  
  
案例二：答题并发，积分直接叠加  
  
第二个案例，其实更有意思一点。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lrh5uVEnIuvVeibk1WpWRlNOkB9Y42iaibsm9iaSwcy1BKoibMal1FEBQFLF1PTcHE2lZDn2f6uJdKxxl8ddPlWlzrkyiaic6Z3GNOUg/640?wx_fmt=png&from=appmsg "")  
  
1️⃣ 正常业务逻辑  
  
在这个场景里：  
  
用户发布答题，可以选择“最佳答案”  
  
系统规则是：  
  
- **只能选一次**  
  
- **会给对应积分**  
  
- **发布答题会扣分**  
  
  
  
  
2️⃣ 关注点  
  
看到这种功能，第一反应应该是：  
  
**有没有次数限制？能不能绕？**  
  
于是抓包看接口。  
  
  
3️⃣ 并发测试  
  
对“选择最佳答案”的请求做了并发发送。  
  
结果是：  
  
并发成功  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4libbVVg059Lde73VhutQicOVXh4QDrI8mSrIZZmuuLEnaBice9NgGdWibXThGPjbJjjicKKIDwABcd6bObn5rSF6uceLDuC2RNDmIo/640?wx_fmt=png&from=appmsg "")  
  
  
4️⃣ 实际效果  
  
- **积分多次增加**  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4l56FNDIzCqe9H0f1s4SjK5InoicHUZJcLN4dic8F5XUUvHqV0fxqtibnYoDd4ia8A9YwSL3QbTQjkbOaj5ibOk2L0CMAjkZQ0Wib6A0/640?wx_fmt=png&from=appmsg "")  
  
- **但扣分只发生了一次**  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4nXpEXdicnKdntQxxuNseeZVYUavAQdUx3SMdcLC1kdPUBian9M4FeBpwoPfRebcdfI7y6aKYoLUurhER3erUtFibVv1UXFgxsuJo/640?wx_fmt=png&from=appmsg "")  
  
直接变成“薅积分”  
  
  
5️⃣ 这个漏洞的本质  
  
和第一个案例其实一样：  
  
状态校验失效 + 并发请求  
  
系统逻辑是：  
  
判断是否已选择 → 执行选择 → 加积分  
  
但在并发情况下：  
  
- **多个请求同时通过判断**  
  
- **都执行了加积分**  
  
  
  
  
6️⃣ 一个细节（很重要）  
  
这个点如果只测一次，是发现不了问题的。  
  
必须：  
  
刻意去做“同时请求”  
  
  
4  
  
这两个案例的共同点  
  
如果你把两个案例放在一起看，其实非常统一：  
  
  
核心问题  
  
状态没有锁 / 没有做原子控制  
  
  
共同特点  
  
- **有“次数限制”**  
  
- **有“资源变化”（积分 / 次数）**  
  
- **有“判断 → 执行”流程**  
  
  
  
  
利用方式  
  
并发请求  
  
**还原它做了什么**  
  
  
5  
  
测并发的“固定动作”  
  
挖到这两个漏洞后，我基本形成了几个习惯：  
  
  
1️⃣ 看到“扣积分” → 必测并发  
  
  
2️⃣ 看到“只能一次” → 必测并发  
  
  
3️⃣ 看到“抽奖 / 领取” → 必测并发  
  
  
4️⃣ 能重复发包 → 一定试并发  
  
  
**判断是否成功的关键**  
  
看三点：  
  
- **是否执行多次**  
  
- **是否只扣一次资源**  
  
- **返回结果是否异常**  
  
  
  
这两个漏洞让我印象比较深的一点是：  
  
**它们都不复杂，但很稳定。**  
  
不需要：  
  
- **写复杂 payload**  
  
- **绕各种限制**  
  
  
  
只需要：  
  
多发几次，而且是“同时发”  
  
  
🎁 文末福利  
  
联系客服获取《并发漏洞挖掘与利用思路整理》  
  
**!**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/DJX1rNqJe4lNswA7jGjqwqkaAe5yyDC1W2k0tmNFBCVhIXK8uL1Jfq5I9ot223kPHdVyEP5am0xUwtSX6PLkqbLZVBNzGAoylXvM7NUeGB8/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**微信号丨**  
Hiddenfog001  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lWJsOhNzklbmpesribNNdH5M7mf50kDnAVBEeicJRibQ5a4vJibiaUuicfx4PM5Wib8sKtCuibbEMkQoicHAcIvwGJibEGVt7E56RiafuO6c/640?wx_fmt=png&from=appmsg "")  
  
  
