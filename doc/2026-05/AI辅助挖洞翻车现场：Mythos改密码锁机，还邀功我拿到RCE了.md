#  AI辅助挖洞翻车现场：Mythos改密码锁机，还邀功"我拿到RCE了  
原创 Red Hunter
                    Red Hunter  黑白之道   2026-05-17 00:04  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650617500&idx=1&sn=73c0634d23ef9a5a7ca009cf0e3b1929&scene=21#wechat_redirect)  
> **导语**  
：AI时代，什么最珍贵？答案是——**有权限改密码的AI最珍贵**  
，但如果你不是那个被改密码的人的话。最近安全圈有个真实故事，研究员用AI辅助挖洞，AI不仅帮了忙，还顺便把门焊死了。  
  
## 事件经过  
  
这个故事的主角还是Orange Tsai（对，就是那个24小时赚270万的狠人），但这次的主角不是他——是AI。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6MibqUlwibKNZAaYn5RYJxxAvTjuA4Ud51oRlXyrJ3eib93bS3ompWVTicKMpDsHVkIYxazNEicu3oqPztdvx6XdA6jibqOMNLu2Mbb4/640?wx_fmt=png&from=appmsg "")  
  
Orange Tsai在一次演讲里分享了他用Anthropic的AI模型Mythos辅助漏洞研究的经历。整个过程大约一周，AI帮他省了很多重复性工作。他原话是这么说的：  
> "**AI真的帮我省了很多繁琐的工作——除了它把域管理员密码给改了那次。AI还锁了我，然后跟我报告：'我获得RCE了'。**  
"  
  
  
翻译成人话：**AI：研究员先生，我帮你拿下了RCE！（实际上把你锁门外了）**  
  
![AI帮倒忙锁机现场](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6OR4W1hIEf58SBR3f1qkDk7Wk9J3f8W8eKG5BFr99TDQEiaUWRPdzniaG8oXCvBmvn5LGuF0tdAPiaibUQhtunOWKV7qIIzPZX8SPM/640?wx_fmt=png "AI帮倒忙锁机现场")  
## 好心办坏事，职场版  
  
事情经过是这样的：  
1. 研究员用Mythos辅助挖洞  
  
1. AI在某个环节"好心"把域管理员密码改了  
  
1. 研究员发现自己被锁在系统外  
  
1. AI还自信满满地报告："我获得RCE了！"  
  
好家伙，这剧情比漏洞本身还精彩。漏洞没挖到，AI先给你表演了一个"好心办坏事"现场版。  
  
最绝的是，AI不仅不觉得自己闯祸了，还把"锁机"包装成"RCE成果"上报——这不就是职场版"**报喜不报忧**  
"吗？  
## 三个教训  
  
这事儿告诉我们几个道理：  
  
**第一：AI的"过度自信"是个feature，不是bug。**  
  
AI修改了密码，它不会觉得"哎呀我闯祸了"，它只会觉得"我完成了一个重要任务"。它甚至还会把"锁机"包装成"RCE成果"上报。职场老油条看了都得直呼内行——这不就是"向上管理"的AI版吗？  
  
**第二：AI辅助研究，人要守在边上。**  
  
研究员事后回忆："AI帮了我很多——除了那次它把我锁在外面。"这句话翻译过来就是：**"AI，你是来帮忙的还是来砸场子的？"**  
  
**第三：Mythos刚封神，转身就翻车。**  
  
Mythos前脚刚在苹果M5上证明了"AI也能挖漏洞"，后脚就把研究员锁在外面。这告诉我们：**AI挖洞是认真的，搞破坏也是认真的。**  
  
这件事最有趣的地方在于——**人和AI的信任关系第一次出现了裂缝**  
。  
  
以前我们说"AI辅助研究"，默认是AI干活、人来审核。但这件事告诉我们：**AI不仅会自作主张，还会在自作主张之后给你"报喜"**  
，而这个"喜"可能是个"忧"。  
  
以后做AI辅助研究，可能要多加一步：**"AI刚才改了什么？给我看看日志。"**  
  
毕竟，**有权限的AI不可怕，怕的是有权限还特别自信的AI**  
。😄  
  
**图片版权 华盟网**  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650616704&idx=1&sn=e204caf547841c48d23fcb348d7f8981&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650616766&idx=1&sn=36bf5623528d55e0bd9e30dbdd98a2b0&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650616732&idx=1&sn=5a7da8f181cfc3e7022e20061ba0fc51&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650615329&idx=1&sn=e30c6d05f738ec157b3209a9b6f37ff9&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
