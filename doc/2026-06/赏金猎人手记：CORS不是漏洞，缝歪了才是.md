#  赏金猎人手记：CORS不是漏洞，缝歪了才是  
原创 升斗安全XiuXiu
                        升斗安全XiuXiu  升斗安全   2026-06-23 00:12  
  
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
今天不整虚的，直接上干货【  
CORS】，也就是  
跨域资源共享。  
  
别看这名字学究气，说白了，它就是你挖洞路上的一把“万能钥匙”，配置歪一点，漏洞一大片。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGGPtiayicMeQ2ezWeNs89lIk34IS7oraZo5ib7t2IIS5JFm1cTd4yKRktTYbkShSH4pp1HHP1kqUV0fWChK9UmnzZCUqZ7HGQZ6ko/640?wx_fmt=png&from=appmsg "")  
  
把浏览器想成一个小心眼的保安  
  
理解  
CORS前，先得认识它爹【  
同源策略】  
  
你可以把浏览器当成一个超级负责的保安。他的规矩就一条：你站里的人和外面的人可以随便打招呼，但外面人给的任何东西，都不许带回来。  
  
比如，A网站的脚本能向B网站发请求，就像隔着大门聊天。但B网站回的话，保安会全部拦下，不让A的脚本看。这初衷很纯粹：  
防止一个网站偷看你另一个网站的隐私。  
  
这规矩早年很管用，但现在麻烦来了。  
  
站里的人要去隔壁商场逛街怎么办？  
  
现在哪个公司的业务不是一堆  
子域名和  
第三方服务？主站在这，图床在那，接口又藏另一个地方。这就像个打通了的商业综合体，不让顾客串门，生意没法做。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGEnsrbmZVnUJ2W47ibxmic95GiaCytQiaKgUX2BrssqxnpBUmKa9zrsEBo9icsaywxibnWNAaqicvb09YQ4ALCs5n6JhA5ek0m9iaLIsAs/640?wx_fmt=png&from=appmsg "")  
  
于是，  
CORS就来了。  
  
它不是炒了保安，而是给了他一份“  
白名单”。靠着一堆  
HTTP头信息（你抓包时常见的  
Access-Control-Allow-Origin这些），告诉保安：“看，拿这张通行证的隔壁商户，放行，但只能走员工通道。”  
  
机制挺好，既灵活又保住了底线。  
  
问题出在发通行证的人身上  
  
挖了这么多年洞，我发现十次问题九次出在这【  
通行证发得太大方了】  
- 照抄来路：不管你声称自己从哪来，服务器都原样写进通行证。攻击者伪造个“来路”标签，轻松混进去。  
  
- 允许空来源：把允许列表设成null。听着没用？但特定环境（比如本地文件）发出的请求源就是null，直接绕过。  
  
- 敞开大门还送VIP卡：那个  
Access-Control-Allow-Credentials:   
true，本意是允许带上Cookie等身份凭证。一旦配上“允许所有域”，相当于对所有路人喊：“拿我的VIP金卡，随便拿随便逛。”  
  
  
对赏金猎人来说，碰到这种配置，就像捡到宝。当你发现一个不起眼的跨域请求，居然能读出你个人资料的  
JSON时，那种“中奖”的快感，懂的都懂。  
  
记住，  
CORS本身不是漏洞，是安全补丁。但任何补丁缝歪了，洞比原来更大。  
  
今天就先唠到这儿。觉得有用，  
点个赞和  
在看，  
分享给你的赏金兄弟们。别忘了  
关注我，下期硬核分享不迷路。评论区见！  
  
  
往期推荐：  
- [别只看书了！CTF免费资源+在线靶场福利，这才是赏金猎人的训练营](https://mp.weixin.qq.com/s?__biz=MjM5MzM0MTY4OQ==&mid=2447798624&idx=1&sn=1291eb2c49b2fa9f78bdd9b6d457eade&scene=21#wechat_redirect)  
  
  
- [免费打造你的渗透测试 AI助手：Burpsuite+Ollama+本地大模型 → AI辅助分析，赏金猎人高效挖洞（脚本已打包）](https://mp.weixin.qq.com/s?__biz=MjM5MzM0MTY4OQ==&mid=2447798575&idx=1&sn=0636ff98027e96c2dbbec867b59ba8ff&scene=21#wechat_redirect)  
  
  
