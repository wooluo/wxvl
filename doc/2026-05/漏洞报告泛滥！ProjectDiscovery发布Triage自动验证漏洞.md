#  漏洞报告泛滥！ProjectDiscovery发布Triage自动验证漏洞  
原创 玄月调查小组
                    玄月调查小组  玄月调查小组   2026-05-22 17:06  
  
现在，安全团队现在最怕的，不是没有漏洞报告。  
  
现在是报告太多，每一份看起来有点像真的。  
  
ProjectDiscovery很直接说：报告量已经超过了人工分类的处理能力。  
  
**不复现，怕漏掉致命漏洞。**  
  
**全复现，人根本不够用。**  
## 报告变多了，也更像真的  
  
过去，低质量漏洞报告还比较容易识别。  
  
过去的碰瓷漏洞，一眼就能看穿。  
  
但现在，漏洞报告泛滥成灾。  
  
AI可以写得很完整，甚至还会引用真实信息。  
  
让安全团队判断更慢。  
  
参见：[Linus点名AI漏洞报告！Linux安全列表已被挤爆](https://mp.weixin.qq.com/s?__biz=MzkzMTY0MDgzNg==&mid=2247486352&idx=1&sn=550edaeda0a9dfe98606c71d67a53415&scene=21#wechat_redirect)  
  
  
唯一的解决方法就是手动复现，而这恰恰是攻击者最擅长利用的时间差。  
  
所以，  
ProjectDiscovery  
本周发布了  
Triage  
产品。  
## 先复现，再升级  
  
**Triage**  
 的思路，就是把这一步前移给AI。  
  
每份报告先被视为未证明。  
  
Triage会把它放进沙箱，尝试复现漏洞，并确认是否可利用。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFt9ibVYBnxdicrJt1ic1zWxat32nbDDk2f394eWLeGAlWWcM5r4jR19e1g9N8XTJswadMo5JQKGA2tYQBkyeSdaI4VWK3gzjWbnVpk/640?wx_fmt=png&from=appmsg "")  
  
如果复现成立，发现会被升级。  
  
如果无法确认，噪音就会被关闭。  
  
这不是简单地给报告打标签，而是把“阅读判断”换成“执行验证”。  
  
对团队来说，进入队列的不再只是描述，而是带着证据的发现。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFticO2zJkAjNvuqjNzprHDQZRgpx3kaf7LgVy9C76HnhOdNLOtY3vKYfImhGb25Smibjkr2oqjkqksm5SLZpVAYnaYueMsUwUsYBU/640?wx_fmt=png&from=appmsg "")  
## 分类不是读报告，是跑流程  
  
**Triage**  
 可以驱动浏览器走多步骤流程，设置前置条件，并在隔离环境里发送攻击载荷。  
  
很接近漏洞/SRC团队平时做复现的动作。  
  
现实中，很多漏洞并不在一个公开 URL 上。它们可能藏在登录态之后。  
  
所以 **Triage**  
 还会处理账号和访问条件。  
  
它可以注册测试账号、配置邮箱、走 **MFA**  
 流程、连接 **VPN**  
 隧道，并把多步骤前置条件串起来。  
## 每份报告都有自己的隔离环境  
  
自动复现还有一个绕不开的问题：怎么控制执行边界？  
  
ProjectDiscovery 给出的答案，是每份报告都在独立沙箱里复现。  
  
Triage 使用 **Firecracker VM**  
，并在每次判定后销毁环境。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFtib38am8h6n6qb8Kx48hiaImNibWO4xmV9lW6icibiahNWkJ0ja4bTArbXCZCsOcx8k1EDUE1CkjscCy4Z7R9Z7ype9icrxawjAEtvz8U/640?wx_fmt=png&from=appmsg "")  
  
不同报告之间不共享状态。  
  
验证可以在隔离环境里跑完，不影响生产系统，也不干扰其他测试。  
## 接进现有安全工具  
  
Triage还展示了它和现有其他工具的连接。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFt9dhQClbia5wHycUibZXtNkGok1WDyLn2a2J6ic04jaV7wNR0De7z3QZrNoS5NsCkSq5iccbBe8icd6XC5rHcJQ5TAcLdNjZE6sUGms/640?wx_fmt=png&from=appmsg "")  
  
包括 **HackerOne、Intigriti、GitHub、Claude Code等**  
。  
  
其中，HackerOne 报告可以直接进入分类管道，上下文会保留下来。Claude Code 运行时，Triage 也可以实时验证发现，先过滤噪音和误报，再把结果交给用户。  
  
如果某个发现已经确认，还可以升级到 **Neo**  
。  
  
Neo 会继续串联攻击向量、测试横向移动，并映射潜在影响。  
  
Triage 先回答“这个报告是否成立”，Neo 再往后看“它可能影响到哪里”。  
## 真正稀缺的是可信发现  
  
LLM 让“写出一份像样的漏洞报告”变得更容易。  
  
但安全团队真正缺的，不是更多描述。  
  
而是更快知道哪些报告值得处理。  
  
Triage 的价值，就在这里：  
  
先复现，先确认，先把相同问题合并，再把真实发现交给人处理。  
  
当报告越来越多、文本越来越像真的，安全流程也需要换一个默认动作。  
  
不是先相信报告。  
  
而是拿出证据。  
  
  
参考资料: https://projectdiscovery.io/triage  
  
