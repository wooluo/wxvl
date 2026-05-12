#  原型污染+DOM XSS完整利用链：那个多出来的“1”差点毁了我的漏洞  
原创 升斗安全XiuXiu
                    升斗安全XiuXiu  升斗安全   2026-05-12 00:18  
  
**【文章说明】**  
- **目的**  
：本文内容仅为网络安全**技术研究与教育**  
目的而创作。  
  
- **红线**  
：严禁将本文知识用于任何**未授权**  
的非法活动。使用者必须遵守《网络安全法》等相关法律。  
  
- **责任**  
：任何对本文技术的滥用所引发的**后果自负**  
，与本公众号及作者无关。  
  
- **免责**  
：内容仅供参考，作者不对其准确性、完整性作任何担保。  
  
**阅读即代表您同意以上条款。**  
  
****  
想靠纯手动挖到高阶原型污染漏洞，很多时候就差在“怎么找”和“怎么连起来”这两步。下面这份笔记我尽量用说人话的方式，带你从头到尾跑一遍，看完可以直接上手实操。  
  
你有没有过这种瞬间：明明感觉已经摸到了漏洞的边，但就是差那么一点串不起来？今天我们就来聊一个又经典又容易被人忽视的攻击面——客户端原型污染（  
Prototype Pollution）。我会分别演示  
纯手工和用神器   
DOM Invader 两种玩法，帮你把这个技能点彻底点亮。  
  
一、手工挖洞：像侦探一样串联整条攻击链  
  
挖原型污染，本质上就是做三件事：找到污染源、找到能被污染的“零件”（Gadget）、把 payload 调通。  
  
1. 找到原型污染入口  
  
先用最粗暴的方式试探——直接在 URL 查询字符串里注入属性，看能不能污染   
Object.prototype：  
```
/?__proto__[foo]=bar
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGGI9VLic2MEgYfVtfZR5EP9abjbwxz5090NIZwq0d3fGzWlqlquUnhbibmzVI2NDHbovIhXdGT5fianZYjGQXOj713UHk9r3CPBLg/640?wx_fmt=png&from=appmsg "")  
  
打开控制台，输入   
Object.prototype 查看，你会发现   
foo 属性根本没进去。别急，换一种写法再试：  
```
/?__proto__.foo=bar
```  
  
再次查看 Object.prototype，你会发现对象里多了一个 foo 属性，值正是 bar。恭喜，你刚亲手确认了一个原型污染源。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGFqAgRCpgtaaUzy8qn08Hy8BY4pQcK15wDy88xWR4SBxJdkGh2OZXC0vVWnia3gpSLic3MsictPFHh0zrWFD8ySZw8f2ZeRnJ0Ryg/640?wx_fmt=png&from=appmsg "")  
  
2. 顺藤摸瓜，找到可利用的   
Gadget  
  
转到“源代码”面板，把目标站加载的   
JS 文件过一遍，重点盯那些能执行代码的危险函数（也就是   
sink）。在   
searchLoggerAlternative.js 里发现了一个   
eval() 调用，而且它接收的参数   
manager.sequence 默认是未定义的——这简直是为污染量身定做的位置。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGEAuJelVPjocaku0NE1zlzuJllgRBYH20GQibap05libp0R2IjljoSzhUTG9HbSDZZiaBQWouB5Ktibic3Byj9dUqCvpTlH2k9Kn6f0/640?wx_fmt=png&from=appmsg "")  
  
3. 调通你的 Payload  
  
知道了入口和落点，先试一版最简单的   
payload：  
```
/?__proto__.sequence=alert(1)
```  
  
刷新后，发现并没有弹窗。打开控制台，看到报错了。点开堆栈追踪最上面的链接，直接跳到了 eval() 那一行。在这里打个断点，再刷新一次。  
  
鼠标悬停在 manager.sequence 上一看，它的值竟然是 alert(1)1——末尾被多拼了一个数字 1，导致语法错误。这就解释了为什么没弹窗。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGH1x2rVb5R4wWA1zkuBheyAov4vu4NHVO2SRI2x1MScfnI9POBUmclHCKVd47LR7r8YDVHp8X09PYt2kJCT58a0kojicORnKsTs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGFYCLq4JLqQnPx9vlMwFEibPMtZlibFibfddJB2Tqoic8Mwn2UiayueoAh0NPiajwkWm1yFMbssfyTl2onFHAoTdghwRUkp9xKwSsDbk/640?wx_fmt=png&from=appmsg "")  
  
  
知道问题就好办了。去掉断点，在 payload 末尾补一个  
减号，把多出来的字符变成表达式的一部分：  
```
/?__proto__.sequence=alert(1)-
```  
  
再次刷新，弹窗出现，实验搞定。整条攻击链被你完整走通。  
  
二、DOM Invader 方案：让工具帮你做重复劳动  
  
手工虽然帅，但如果每次都要这么找，效率太低。  
Burp 内置浏览器里有个   
DOM Invader，就是专门干这个的。  
  
先打开内置浏览器，加载目标页面，启用   
DOM Invader 并打开原型污染开关。接着打开开发者工具里的   
DOM Invader 面板，刷新页面。你会发现它已经自动识别出查询字符串（也就是   
search 属性）中存在原型污染向量。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGGuqfRtK0AdyI42PQibfZA2bT7SX0uQicicG9eaN65IgZbWCCfW8vehRIsC6Hqr9rXcnQmbgC19CxHXSFEp0AkH8yRWibweDUaKMlw/640?wx_fmt=png&from=appmsg "")  
  
点一下   
Scan for gadgets，  
DOM Invader 会另开新标签页开始自动扫描。扫完后，在同一个标签页里打开   
DOM Invader 面板，你会看到它已经帮你把链路打通了——通过一个叫   
sequence 的   
gadget，成功触达了   
eval() 这个   
sink。  
  
到这一步，直接点   
Exploit。有意思的是，第一次自动生成的验证   
payload 同样没弹窗。回到之前的标签页再看一眼 eval() 那个位置，发现 canary 字符串末尾果然被多塞了个数字 1——跟手工验证时一模一样的问题。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGHaNeKmb68K4o2Op10piaCp0AhtbyN9U5PQj6aice11BWlbibXnVNhLMHer6HdZkAgQUOpYMSmOr1WsWwYXzN3ws84w2qQcod1RMA/640?wx_fmt=png&from=appmsg "")  
  
再点一次 Exploit，在新打开的标签页 URL 末尾手动加个减号，回车刷新。alert(1) 顺利弹出，问题解决。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGEo4icaZAcYdrkibialuXZDgdibu6eYMW1WrIrXSWExKO3YlAgmPK17MkeZtFFo4aIKdjPt2XYecz4xEQKJRVXxf06Kqxjvhm45sBQ/640?wx_fmt=png&from=appmsg "")  
  
两种方式跑完，你会发现核心逻辑完全一样，只是一个纯靠肉眼和手感，一个用工具加速排查。真正打赏金的时候，建议先用   
DOM Invader 快速定位，再手工复现确认细节，效率和深度都有了。  
  
如果觉得这篇笔记对你有用，欢迎点赞、在看、转发三连，算是对我熬夜整理的一种鼓励。也欢迎在评论区聊聊你遇到过的那些“只差一点点”的坑。  
  
还想看更多实战向的挖洞思路，可以关注本号，我会持续分享一线渗透测试中的干货和小众玩法。  
  
  
