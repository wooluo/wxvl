#  一个简单的OTP漏洞如何可能导致账户被完全接管  
haidragon
                    haidragon  安全狗的自我修养   2026-04-21 04:16  
  
# 官网：http://securitytech.cc  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBntahhB12rJlRuR3wFs9egAyiaOzeUg3erHtW9YhwmvPuQhqndZE0mW3v0CZ2BHJOgsGt3fkCKfHjNibgsa1vEQDooZiaOTXnwvzN4/640?wx_fmt=png&from=appmsg "")  
  
  
  
我是谁？  
  
我是 一名安全研究员/饥饿学习者和漏洞赏金猎人，对网页应用安全，特别是身份验证和会话管理缺陷有浓厚兴趣。  
  
另外，我的悬赏故事也很有趣。我因为旅行压力太大不能说这些，现在让我们回到标题。  
  
我开始学习漏洞赏金是出于好奇和想理解应用内部运作方式的愿望。这种好奇心最终带来了我的第一个有效的虫子悬赏和第一个致命漏洞。  
  
本文分享了那段经历的故事。  
  
  
准备好饮料了，啊......珍珠奶茶+薯条  
  
  
  
  
**关于目标应用**  
  
事情就是这样开始的。这是一个在线产品销售网站。这与最受欢迎的游戏Freefire有关。登录时出现了奇怪的冻结，还出现了很多其他问题（比如购买通知没有登记等等），然后我立刻开始查看。  
  
接着，我带着装备去了注册区。（打嗝 + 临时邮件  
)  
  
我不知道这个申请的任何信息，我的第一步不是重新评估，而是发现......直接跳转测试，  
  
在注册部分，我会拦截与邮件验证相关的请求，然后再填写其他邮件  
  
砰——！标记捕获的OTP代码发送。  
  
  
请按回车或点击查看全尺寸图片  
  
  
  
这是许多虫子猎人不会考虑或考虑的事情，但我会告诉你如何利用它。  
  
好了，我们有点跑题了，让我告诉你一个弱点如何影响整个系统。  
  
  
**小提醒**  
一下我写这篇文章是因为我觉得你可能不理解，如果我只说我需要说的话。我写这些是想让你看看我是怎么想的，从一个小点开始，一直到我黑进了整个系统。  
  
  
我所做的只是完成了注册并创建了个人资料。然后我开始研究整个应用。它用了哪些技术，内部运作如何，等等。然后我发现了一些非常酷的东西，你会以为要找到这些东西，你必须非常熟悉应用。  
- 支付有多种方式，注册用户会为每种支付方式单独获得一个钱包。  
  
请按回车或点击查看全尺寸图片  
  
  
  
如果我们进一步了解，这种情况下的支付选项是**币安支付**  
，而实际上，当我们选择该选项时，相关卖家的账户信息会被输入，我们通过币安进行交易。但这里的情况恰恰相反。当新用户注册时，该用户会获得一个与**币安/ezcash**  
相关的钱包。如果用户之后无法通过Visa卡进行交易，他可以联系相关网站的所有者或管理员，为相关钱包充值，并可在任何相关时间通过该卡购买商品。  
  
  
* 例如：当我联系管理员并给他10美元时，他会把钱放进我的钱包里的个人资料，这样我买东西时可以通过那个选项购买。  
  
  
接着我说我开始认真看了。这次我发现了别的有趣，于是付了一笔小额费用。  
  
**砰......！IDOR**  
  
  
请按回车或点击查看全尺寸图片  
  
  
  
**invoice.php？order_id=13034**  
这是与我付款相关的发票。后来，当我查看其他邮件时，我注意到另一件事，  
  
相关用户的邮箱显示在与本次付款相关的部分，所以我可以申请那个账户，因为我们最初是因为OTP漏洞😊发现的  
  
  
但现在你会想，拿这些用户的账号有什么好处？  
> 说实话，想想我接下来该怎么做。请牢记你的回答，请继续阅读以下内容。你真正的想法如下。相信我，你的思维模式完全正确。你不是普通人。**哈**  
......  
  
  
  
**查找使用钱包的用户并搜索他们的电子邮件**  
  
  
请按回车或点击查看全尺寸图片  
  
  
  
接下来你看到的是每个用户在每张相关发票上支付时使用的付款方式。你觉得我怎么想的？  
  
然后我通过订单ID找到了最后的订单ID。它有点大，大概**130##。**  
如果我升级到**13000+，比如2500、2501、2502.....怎么办？**  
所以我决定为此写一个 Python 脚本。我想了解那些购买过一项或多项服务，并且通过其他方式支付而非使用Visa卡的用户。然后我用它来做我需要做的事。  
  
  
请按回车或点击查看全尺寸图片  
  
  
  
找到......！  
  
  
  
  
所以现在我们可以通过从ID获取相关邮箱，绕过OTP漏洞，使用相关用户的钱包来购买物品。  
  
  
所以，如果这样继续下去，我会成为一名作家。这是我的最后一篇帖子，我必须说我决定只在这一部分讲述。在这个系统里，我接管了整个系统，比如支付绕过、管理仪表盘访问、价格操控、业务逻辑绕过。  
  
   
- 公众号:安全狗的自我修养  
  
- vx:2207344074  
  
- http://  
gitee.com/haidragon  
  
- http://  
github.com/haidragon  
  
- bilibili:haidragonx  
  
##   
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnuRIbfP2JAq95Uhf739IzEhvCMPAicia6Am0rbwAWqqtHfMq2eGwA7yVRpzc7cZQV59sSvhC7cyu9wfDbGj5a7nyyeLuWcu32Bmw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBntW6oUWn999LfiaYr6THPwzDibfdInoyC0cEeyqwibpBTUFjQMjBJbOcedk0qJlGrDTMCq8lkDj8fScLq0OCdiaMbOPl7SDIOGJmGc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPZeRlpCaIfwnM0IM4vnVugkAyDFJlhe1Rkalbz0a282U9iaVU12iaEiahw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=z84f6pb5&tp=webp#imgIndex=5 "")  
  
  
  
****- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPMJPjIWnCTP3EjrhOXhJsryIkR34mCwqetPF7aRmbhnxBbiaicS0rwu6w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=omk5zkfc&tp=webp#imgIndex=5 "")  
  
