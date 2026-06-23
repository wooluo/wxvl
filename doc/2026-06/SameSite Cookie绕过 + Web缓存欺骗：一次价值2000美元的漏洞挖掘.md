#  SameSite Cookie绕过 + Web缓存欺骗：一次价值2000美元的漏洞挖掘  
原创 Violet Walker
                    Violet Walker  黑白之道   2026-06-23 00:40  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618185&idx=1&sn=e7a4ddec94c9af10451bca515c67e228&scene=21#wechat_redirect)  
> **导语**  
：安全研究人员 tinopreter 在一个自注册预订平台上，发现了一个 Web 缓存欺骗漏洞。平台将用户 JWT 直接嵌入首页 HTML 中，并且整个页面被公共缓存代理缓存。配合浏览器 SameSite Cookie 的默认行为，通过顶部导航重定向绕过限制，最终实现账户劫持，获得 **2000 美元**  
高额赏金。  
  
## 一、漏洞背景  
  
作者最近受邀测试了一个预订平台。该平台支持用户自主注册，整个应用运行在云基础设施上。用户登录后，应用通过 JWT（JSON Web Token）来管理会话，直接将令牌内嵌在 Cookie 头中返回。  
  
![漏洞示意图](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6PwA0ubrDXLW0L2NNoCto0FXt4y2icCics0aaXGK5Tia88WHb9lm7SrjKO7P8lsia3gwYObmR5JKRqBlnt5iaCRnI5IuLALcYOfJ5W4/640?wx_fmt=png "漏洞示意图")  
  
在深入利用步骤之前，先简单回顾一下现代云基础设施中缓存机制的工作原理，以及 Web 缓存欺骗（WCD）是什么、它与 Web 缓存投毒（WCP）有什么不同。  
## 二、缓存机制与核心概念  
### 2.1 什么是缓存  
  
在现代云架构中，当客户端向应用服务器发送请求时，请求几乎总是先经过一个中间层——可能是反向代理、CDN 或负载均衡器，然后才到达最终的应用服务器。返回时也是一样，先经过中间层再到达浏览器。  
  
**缓存（Caching）**  
 就是这样一个机制：中间代理服务器将后端服务器的原始响应复制一份存储起来。当后续用户请求完全相同的资源时，代理直接返回已存储的副本，无需再次查询应用服务器。  
  
判断一个响应是否被缓存，可以看响应头中的 **X-Cache**  
 字段：  
- **MISS**  
：表示这是从源服务器取来的新鲜响应  
  
- **HIT**  
：表示这是从中间代理返回的缓存副本  
  
![缓存标识](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6Of4TW8FUYQvs24w1Xm7DDuDic6U4ibbEUY8pY40B13UMkTNsKWRFLfciaPtIwibO84M66FeH7VlL90kG9AuqKdfJQldFkoIp8sxFA/640?wx_fmt=png "缓存标识")  
> 大多数应用都会缓存首页，这本身很正常。因为首页对所有访客展示的静态内容基本一致。真正不该被缓存的，是那些包含私人数据的用户专属页面。  
  
### 2.2 Web 缓存欺骗（WCD）  
  
设想这样一个请求：访问 /my-profile  
 端点，返回的 HTML 页面直接在源码中嵌入了用户的个人信息（如邮箱、家庭住址等）。由于页面包含私人数据，它绝对不该被缓存。  
  
**Web 缓存欺骗**  
 就是指这种情况——包含用户敏感数据的页面被错误地缓存了。一旦被代理服务器存储，攻击者再次请求该端点时，不会得到新数据，而是被直接返回包含他人隐私信息的缓存页面，导致私密数据泄露。  
### 2.3 Web 缓存投毒（WCP）  
  
Web 缓存投毒的工作原理与 Web 缓存欺骗完全不同。  
  
在 **WCP**  
 中，攻击者先找到一个已被缓存的页面，然后利用注入攻击（例如 XSS）修改其内容，将"有毒"的恶意版本存入缓存。后续用户访问该页面时，被服务的正是攻击者植入的恶意版本，导致恶意代码在用户浏览器中直接执行。  
## 三、漏洞发现过程  
  
作者完成身份验证后被重定向到首页。按照惯例，作者在继续检查 JavaScript 文件之前，先快速扫了一眼 HTML 响应。  
  
![已缓存的首页](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6MKbUxMz3v1NDJQf4xD0ZlPXjNk7Sr4o9ezIYjGIVPhzReBnViadfna5ibKo5cMVWbqLoyuolf4xuTe0ticWIslsic9SXxiasLN6514/640?wx_fmt=png "已缓存的首页")  
  
作者注意到响应头中包含 X-Cache: MISS  
，同时 Cache-Control  
 头没有设置 private  
。这意味着首页具备被缓存的资格，而 MISS  
 状态表示这是从源服务器直接取回的第一条响应，即将被缓存。  
  
作者在 Repeater 中重新发送了该请求。这次响应头变为了 X-Cache: HIT  
，确认自己已经被服务了缓存的副本。  
  
作者进一步分析这个缓存后的响应，发现了一个严重问题：**当前已认证用户的 JWT 令牌直接被嵌入在页面的 JavaScript 代码中**  
。  
  
![首页中的 JWT](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6PQKwo8vAaxZKqV9Gs9rMWnPYFZXsv3fvOtk5rFOzSgP5M264S5Z3nAe0LeLLY2VDazrKviatosmQmfQX9WBbe2DWTL1tdMGNnc/640?wx_fmt=png "首页中的 JWT")  
  
这是一个致命问题——一旦缓存了包含用户私密信息的响应，任何登录用户在访问首页后，他们的认证令牌都会被缓存下来，等待被其他人提取。  
## 四、漏洞利用  
### 4.1 缓存覆盖攻击  
  
现在已经确认：首页的响应包含用户 JWT，且整个响应被缓存。利用路径已经清晰——只需等待另一个用户访问首页，让代理缓存他的响应，然后自己再访问同一个页面，直接从源码中提取对方的 JWT。  
  
对于拥有数百万用户的平台，用户不断刷新首页，旧缓存被新请求覆盖。每当一个缓存过期，下一个访问该页面的用户就会成为新的"受害者"。  
  
为了让攻击更加精准，作者引入了一个 **缓存破坏器（cache buster）**  
。缓存破坏器是一个追加在 URL 后的随机参数（例如 ?cb=123  
），强制缓存服务器将请求视为全新的请求，而不是返回已缓存的副本。通过控制这个参数，攻击者可以精准锁定某个特定会话。  
  
攻击者构造了如下恶意链接：  
```
https://target.com/?cacheBuster=1
```  
  
如果已登录的受害者点击了这个链接，首页对他而言完全正常，他可以继续正常使用平台。但后台，他的响应已经被代理安全地缓存。攻击者再访问同一个带参数的 URL，就能获得受害者缓存的响应，从中直接提取 JWT。  
  
![攻击流程](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6PnxHL5FrJ1PWCekkH1rDm2H7Oksibxotb0CJzTsyrEpWxWKzh6ibPXZopFicKhmOWVJFueicEEnWBdX8iakWFXicHKYfrQeicwnxRnVE/640?wx_fmt=png "攻击流程")  
### 4.2 SameSite Cookie 的阻碍  
  
为了向受害者发送这个恶意链接，作者可以把它嵌入邮件，或托管在攻击者控制的站点上。作者选择了后者。  
  
但第一次尝试失败了——攻击者托管了一个包含 <img src="https://www.target.com/?cacheBuster=1">  
 的 HTML 页面，但浏览器的 **SameSite Cookie**  
 机制阻止了攻击。  
  
![跨站请求未携带 Cookie](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6PQKwo8vAaxZKqV9Gs9rMWnPYFZXsv3fvOtk5rFOzSgP5M264S5Z3nAe0LeLLY2VDazrKviatosmQmfQX9WBbe2DWTL1tdMGNnc/640?wx_fmt=png "跨站请求未携带 Cookie")  
  
由于请求来自攻击者的域名，浏览器阻止了受害者的会话 Cookie 随跨站请求一起发送。结果，发往首页的请求是一个**未认证请求**  
——页面中没有有效的会话或 JWT 可供缓存，攻击自然失败。  
> 目标平台没有在 Cookie 上设置任何 SameSite 属性，但现代浏览器会在未指定 SameSite 时默认应用 SameSite=Lax  
。这种默认保护阻止了跨站请求携带 Cookie，但仍有漏洞可寻。  
  
### 4.3 绕过 SameSite：顶部导航  
  
作者深入研究后发现：尽管 SameSite=Lax  
 会阻止来自其他站点的请求携带 Cookie，但如果该请求是来自**顶部导航（Top-Level Navigation）**  
，这些限制就不适用了。  
  
![顶部导航绕过 SameSite](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6Oianrxib2deVmfsIwLlDHH7yjFVU9jV9iaGXoxwxia6oFoqvPgsULTRafmt0d53RHgmrXtlfeuwNrc1tsCicmANt3IDEDhtfXeuJP8/640?wx_fmt=png "顶部导航绕过 SameSite")  
  
所谓**顶部导航**  
，就是浏览器地址栏的 URL 真正发生改变，整个视口（主窗口）跳转到一个全新的网站，完全替换掉之前的页面结构。  
  
攻击者找到了两种触发顶部导航的方式：  
- **自动 Meta-Refresh 重定向**  
：使用 HTML 的 <meta>  
 标签触发自动的顶部重定向，用户只需加载攻击者页面，全程无需额外交互。  
  
- **用户手动导航**  
：作为备选方案，加入 <a></a>  
 标签，即使自动重定向偶尔失效，用户点击也能完成导航。  
  
修改后的 PoC 如下：  
```
<!DOCTYPE html><html><head>    <title>WCD PoC</title>    <meta http-equiv="refresh" content="0; url=https://www.target.com/?cacheBuster=1"></head><body>    <h3>正在跳转进行 PoC 验证…</h3>    <p>如果没有自动跳转，<a href="https://www.target.com/?cacheBuster=1">请点击这里</a>。</p></body></html>
```  
  
作者在第二账户中访问了托管页面，**攻击成功！**  
 由于 <meta>  
 标签的存在，浏览器执行了一次快速的顶部导航跳转，Cookie 被附带发送，响应被缓存。  
  
![顶部导航成功](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6PnxHL5FrJ1PWCekkH1rDm2H7Oksibxotb0CJzTsyrEpWxWKzh6ibPXZopFicKhmOWVJFueicEEnWBdX8iakWFXicHKYfrQeicwnxRnVE/640?wx_fmt=png "顶部导航成功")  
  
顶部导航绕过了 SameSite 限制。攻击者再用相同参数 ?cacheBuster=1  
 向首页发起 GET 请求，就能获得受害者缓存的响应。从源码中提取 JWT 后，注入自己的请求即可完成账户劫持。  
## 五、漏洞影响与赏金  
  
攻击者可以窃取任意访问过恶意页面的用户的 JWT。该漏洞被评级为 **高危（HIGH）**  
，作者最终获得 **2000 美元**  
赏金。  
  
![赏金截图](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6MfoJfcor3rIa3r5suHGfZzBjW1kTibapDgIvHWadfl7icMwtRxYo31j4y0kGQAD7Oibhgl7Z6v9qlBXtRU7tnnMDKe4heAichf6Yw/640?wx_fmt=png "赏金截图")  
  
**漏洞披露时间线：**  
- **3 月 4 日**  
 — 提交漏洞报告  
  
- **3 月 11 日**  
 — 确认收到  
  
- **3 月 13 日**  
 — 按需提供了更详细的说明  
  
- **3 月 19 日**  
 — 完成分类并支付 **2000 美元**  
赏金  
  
- **5 月 7 日**  
 — 修复完成，**50 美元**  
复测奖励  
  
- **5 月 8 日**  
 — 关闭，标记为已修复  
  
## 六、总结与思考  
  
这个案例再次说明了一个道理：**看似安全的默认行为背后，往往藏着意想不到的攻击链**  
。  
- **SameSite=Lax 是浏览器默认给出的保护**  
，但它只挡住了"普通的"跨站请求，对于顶部导航这类场景，保护形同虚设。  
  
- **首页被缓存本身不是问题**  
，问题出在首页里嵌入了不该被缓存的内容——用户的 JWT。  
  
- 两件" individually 看起来不算漏洞"的事（缓存首页 + SameSite 默认值），一旦被攻击者串联起来，就形成了一条完整的账户劫持利用链。  
  
紫队视角看这件事：**防守方的视角需要从单个漏洞扩展到攻击链的视角**  
。修复一个点可能不够，需要系统性地审视用户身份信息在缓存层和 Cookie 策略两个维度上的风险。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。原文内容经授权转载，配图版权归原作者所有。  
  
**原文链接**  
：https://medium.com/@tinopreter/cracking-samesite-for-a-2000-bounty-web-cache-deception-with-top-level-redirect-xyz  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/nGzNudUIJ6Puc8HNiaVFMibMWyXuRCjam9iat0x1rCpsp1iatD7HveaKn7X0FMG8AlYEYZQbWQjAzjbYJjgdDQYTxLsn3W66vehH9V8LV2z9XnE/640?wx_fmt=jpeg "")  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618755&idx=1&sn=48e0a85464fb20c73b6f338928a8f850&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618776&idx=2&sn=a8fc65fd2a71822830022fc52d967bcd&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618496&idx=1&sn=96ecdff99136258a4bf2cb156542311e&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
