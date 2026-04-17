#  【安全圈】开源AI中转站现高危漏洞 利用缺陷可以伪造任意金额充值  
 安全圈   2026-04-17 02:47  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aBHpjnrGylgOvEXHviaXu1fO2nLov9bZ055v7s8F6w1DD1I0bx2h3zaOx0Mibd5CngBwwj2nTeEbupw7xpBsx27Q/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
**关键词**  
  
  
  
漏洞  
  
  
经营 API 中转站业务的站长请注意：New-API 项目日前出现高危漏洞，借助漏洞可以伪造任意金额充值，使用该项目搭建的 API 中转站应当立即升级到最新版。  
  
  
新版本已经调整 Stripe 异步支付事件和 Webhook 验签逻辑，升级到新版本后增加显式判断，如果没有配置 Stripe 签名密钥，则尝试发起支付时会直接返回 403 并终止处理。  
  
  
![开源AI中转站项目New-API修复高危漏洞 利用缺陷可以伪造任意金额充值](https://mmbiz.qpic.cn/mmbiz_jpg/sbq02iadgfyEdVM7Q8eMPmjhXK8C17iaoQCmIrAvsscMJxUXXP2LlUaxkBooSUuxCOAThwoBV55xt7nE8dtHR4HnrlWB6zB1JCMsZlPD6bMg0/640?wx_fmt=jpeg "")  
  
  
**漏洞描述如下 (根据代码变更推测)：**  
  
  
在启用 Stripe 充值并且 Webhook 路由可以被外部访问的情况下，原本 Webhook 应该靠 StripeWebhookSecret 校验签名，但如果 secret 为空，旧代码仍然会尝试进行验签，正常情况下应该直接拒绝验签。  
  
  
这意味着签名校验的安全边界失效，最坏的情况下攻击者可以伪造 Stripe 支付事件，让系统误以为已经成功支付并计入余额。  
  
  
Stripe Webhook 的核心作用在于让平台在用户完成付款、付款失败或者异步支付到账时，自动接受 Stripe 发送的事件通知并完成后续操作，这些通知必须依赖 Stripe 签名与服务端保存的签名密钥完成验签，确保请求确实来自 Stripe 而不是伪造流量。  
  
  
**新版本封堵相关缺陷：**  
  
  
在最新发布的 New-API v0.12.10 版中，开发者已经将这个缺陷修复，在开启 Stripe 支付但并未配置密钥时，系统会直接返回 403 来终止处理。  
  
对使用 New-API 的项目来说当前需要立即升级到最新版本，同时检查 Webhook 是否存在暴露的情况，如有需要还应当检查近期的支付订单是否存在异常。  
  
  
  END    
  
  
阅读推荐  
  
  
[【安全圈】10 美元域名或致黑客掌控 2.5 万个终端，涉运营技术及政府网络](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652075748&idx=1&sn=7b8d03243d9ebe0188ee9d33a3df0eb2&scene=21#wechat_redirect)  
  
  
  
[【安全圈】CISA 将微软 SharePoint Server 和 Office Excel 漏洞列入已知被利用漏洞目录](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652075748&idx=2&sn=658ec73bf935cb0dcf3f4494d9a314f5&scene=21#wechat_redirect)  
  
  
  
[【安全圈】微软 2026 黑客大赛支付 230 万美元：揪出 80+ 个云和 AI 漏洞](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652075748&idx=3&sn=cd40d46e17f54f6ba7ec40fbcc29d550&scene=21#wechat_redirect)  
  
  
  
[【安全圈】伊朗大量美制通信设备突然"失灵"](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652075710&idx=1&sn=7f598c08c68d27461c854f8d3e905ff6&scene=21#wechat_redirect)  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEDQIyPYpjfp0XDaaKjeaU6YdFae1iagIvFmFb4djeiahnUy2jBnxkMbaw/640?wx_fmt=png "")  
  
**安全圈**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
←扫码关注我们  
  
**网罗圈内热点 专注网络安全**  
  
**实时资讯一手掌握！**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCE3vpzhuku5s1qibibQjHnY68iciaIGB4zYw1Zbl05GQ3H4hadeLdBpQ9wEA/640?wx_fmt=gif "")  
  
**好看你就分享 有用就点个赞**  
  
**支持「****安全圈」就点个三连吧！**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCE3vpzhuku5s1qibibQjHnY68iciaIGB4zYw1Zbl05GQ3H4hadeLdBpQ9wEA/640?wx_fmt=gif "")  
  
  
