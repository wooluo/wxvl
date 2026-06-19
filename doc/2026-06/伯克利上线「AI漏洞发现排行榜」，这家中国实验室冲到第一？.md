#  伯克利上线「AI漏洞发现排行榜」，这家中国实验室冲到第一？  
原创 玄月调查小组
                    玄月调查小组  玄月调查小组   2026-06-18 14:12  
  
有没有人和我一样疑惑：说了这么久的 AI 挖洞，到底哪家更强？  
  
过去我们看到的，大多是厂商 Demo、Benchmark 分数。  
  
至于真实世界里挖出了漏洞，没有人去统计。  
  
最近，伯克利上线了一个项目：**Agentic Vulnerability Coverage Map**  
。  
  
不是收录 AI 自身漏洞，也不是统计 AI 又写出多少漏洞，而是：  
  
**一个每日更新的公开数据库，收录由 AI Agent发现的 CVE**  
。  
  
地址： https://vuln.cs.berkeley.edu  
  
谁在深耕实战、谁在做PPT，这下能看得明明白白。  
## AI Agent，开始有漏洞排行榜了！  
  
CVE ，不是模型跑分，也不是「我感觉它很强」。  
  
CVE 意味着漏洞进入公开披露流程，有编号、有影响范围，也能被后续安全团队追踪。  
  
很多安全同学的入门标准就是挖到自己的 CVE。  
  
从这个角度看，它**更像是 AI 漏洞挖掘时代的「兵器谱」**  
。  
  
有趣的是，国内的玄武实验室目前在**平均严重程度**  
上目前排名第一。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFticzwES9xIcDm83CKYHxkJYlKLD86fjyxoSYjMa0LB0ks2cN04BX4dHsyucMEevcphuP0nW1bNLyy2zaiakdmwhIAlibfI3Iaviamo/640?wx_fmt=png&from=appmsg "")  
## 从「能不能挖」到「覆盖了多少」  
  
它不是只看谁发现漏洞最多，也看覆盖范围。  
  
安全里最怕一种能力：只会打一个点。  
  
忽略别的攻击面，企业最后还是被打穿。  
  
比如特别擅长找 SQL 注入，  
  
但对反序列化漏洞都不敏感，  
  
那它仍然不能成为通用安全能力。  
  
而且现实也是如此，**不同AI和Agent，覆盖的漏洞类型有很大差异**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFt8HMHibh0K1TDQicfvoz5ibQuNDbia6J5CbUhSHZ1lKaHkrqemsBZzPeOAiaSuvMFdkj1AQmOgmPVXicsHq7YvBReiaPPufxvUgaIC3W4/640?wx_fmt=png&from=appmsg "")  
## 从「PPT叙事」走向「结果叙事」  
  
过去一年，AI 漏洞挖掘产品最容易陷入一个问题：每家都说自己很强。  
  
小编想说，其中一些产品和：  
 /goal 给我开发一个漏洞挖掘  AI Agent并没有什么区别。  
  
伯克利这张图的价值在于，它把「AI 挖洞」拉回现实：  
  
**别只讲 Demo，拿 CVE 说话。**  
  
对行业是好事。  
  
对安全公司来说，CVE 是公认的的能力证明。  
  
对企业来说，也可以看到哪些AI Agent在哪些漏洞类别上更强。  
## 只是参考，绝非最终答案  
  
这里也要泼盆冷水。  
  
他们的统计视野，局限在「**公开可追溯的 CVE 世界**  
」里，不能等同于真实挖洞能力。  
  
一方面，不少团队挖到漏洞后选择低调提交、不公开署名；  
  
大量 CVE 条目本身也缺少明确的发现主体归因字段，无法被纳入统计。  
  
另一方面，国内多数安全厂商更倾向于向 **CNVD**  
 报送漏洞，这部分成果也不会体现。  
  
因此它  
绝非国产 AI 漏洞挖掘 Agent 的实力终榜  
，参考价值远大于排名意义。  
  
可以预见的是，用不了多久，就会有一堆公司冲着这榜来刷 KPI 了。  
  
过不了多久，就能看到各家冲榜的热闹场面了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFticps8uM7razwUoDl5kibb9iapXcs5OtBIMWWibfjawnw0PeLXyhpApbpcSFQ99Wp3pUMGTCicYOueKMfTztHJDx1iaPSlYpOf2YRFPQ/640?wx_fmt=png&from=appmsg "")  
  
  
