#  我算了三遍才敢信：Anthropic让AI当黑客，首月1万漏洞修比找更难  
原创 AI观察
                    AI观察  AI员工上线   2026-05-24 01:36  
  
卧槽，这个数我看了三遍才敢信。  

  
据Anthropic 5月22日官方披露：他们拿最猛的模型Claude Mythos去"黑"系统，首月挖出1万多个高危漏洞。50家大厂接入，有团队找漏洞速度飙了10倍。  

  
![27年OpenBSD代码历史截图](https://mmbiz.qpic.cn/sz_mmbiz_jpg/x5l8unjI0UraTbrEy1XTGMy5HLstTFvuu175PIaCFcyFL4BVeUpYBbXhubg0KceSToLbcn05Z21I7uxqLX7ZF2S02m8fBqLO2aNpTzkjwvs/640?wx_fmt=jpeg "27年OpenBSD代码历史截图")  

  
听起来是不是很像"AI拯救世界"的爽文开头？  

  
别急。Anthropic自己说了句话，直接把剧情反转了："找漏洞相对容易，修漏洞才是网络安全面临的主要挑战。"  

  
挖出来1万个，能修好的不到100个。  

## 一、这1万个漏洞里，有多少是真问题？  

  
我来给你拆一下这个数字。  

  
战报说"超1万高危/关键漏洞"，但经过验证确认是"真阳性"的，只有1,726个。再往下筛，真正达到高危/关键级别的，是1,094个。  

  
1,726 ÷ 10,000 = 17.2%。也就是说，**82.8%的"漏洞"要么是误报，要么还在排队等人工复核。**  

  
更扎心的在后面：1,726个真漏洞里，截至目前只修补了97个，发了88个安全通告。我算了一下，**修补率5.6%**。  

  
不是不想修，是根本修不过来。你给开源项目提一个漏洞，维护者可能要花几周去复现、写补丁、测试、发版。AI一天能提一百个。  

  
这就是Anthropic说的"相对容易"和"主要挑战"之间的鸿沟。  

## 二、但这件事本身，比数字更有意思  

  
我注意到一个细节，多数报道没提。  

  
Anthropic不是给Mythos装了个"找漏洞"的插件。这模型本身是个通用AI，只不过它的代码理解和推理能力太强，以至于做安全审计这件事，成了它"顺便擅长"的事。  

  
类比一下：你请一个数学天才去算账，结果他顺手把你们公司的风控漏洞全揪出来了——不是因为他学了金融，是因为智商溢出。  

  
Mythos的CyberGym benchmark得分83.1%，比Claude Opus 4.6的66.6%高出一大截。XBOW评价它"远比之前的模型更擅长发现漏洞候选"，而且"能把漏洞串成攻击链"。  

  
![Claude Mythos出现在Vertex AI控制台](https://mmbiz.qpic.cn/mmbiz_png/x5l8unjI0Uqa5hIXaGc11h0bpnKlaibHx9VZZOkkYlsMxoVu9TiaNiaibNFy29ibOhwVwsnXic6edFWsRqgicguSv2icz1AtSuojMTU7fatKJskfTCM/640?wx_fmt=png "Claude Mythos出现在Vertex AI控制台")  

  
这事的可怕之处不是Anthropic拿它找了多少bug。  

  
而是**既然Anthropic能这么做，别人也能。**  

## 三、真正的问题：AI当"黑客"，会砸谁的饭碗？  

  
按这个趋势，未来可能有三种人受影响最大。  

  
**第一种：传统安全审计公司的初级人员。** Mythos找漏洞速度是人类10倍，靠堆人力的安全扫描服务利润率会被直接压缩。  

  
**第二种：开源项目维护者。** AI一天提100个漏洞，但每个都要人来验证、修、发版。开源社区本来就缺人，这种"漏洞洪水"对维护者可能是灾难——修不过来，拖着反而更危险。  

  
**第三种：软件厂商的产品经理。** 微软已说"未来每月新补丁数量会继续增长"。补丁变多用户变烦，产品口碑和营收承压。  

  
对了还有一个反直觉的事：Anthropic用Mythos帮一家银行拦截了150万美元欺诈电汇。黑客入侵客户邮箱伪造电话，Mythos嗅出了资金流向异常。  

  
![Project Glasswing项目截图](https://mmbiz.qpic.cn/sz_mmbiz_png/x5l8unjI0Upiar4Mhj0nl6JJ2vQ3tvEdoepHctKicvp9HmXs6lyX2UIHqMshoPKNaNUv8ich3CtLG7zjfYe70EzxdrdIK0WfNDkPCJZVYxBUB8/640?wx_fmt=png "Project Glasswing项目截图")  

## 四、你今晚就能做的三件事  

  
不是说这事跟你无关，取决于你是谁。  

  
**如果你是开发者：**关注Anthropic新推的Cyber Verification Program，符合条件的可以直接用Mythos做红队测试，帮你筛第一轮。  

  
**如果你是企业技术负责人：**评估安全补丁流程。补丁周期多久？AI发现漏洞速度是以前的10倍，你的节奏跟得上吗？Oracle已经改成月度补丁周期。  

  
**如果你是普通用户：**别慌但别偷懒，把系统更新打开。1万个漏洞被发现不代表都修好了，没被修的对攻击者来说还是敞开的门。  

  
Anthropic挺诚实的——没吹"AI拯救了网络安全"，而是说"这让软件比以前安全多了"，前提是"你得先面对修漏洞这个更大的挑战"。  

  
AI找bug是把双刃剑。找bug的人多了一倍，修bug的人还是那些。  

  
你觉得，谁先急？  

  
  
