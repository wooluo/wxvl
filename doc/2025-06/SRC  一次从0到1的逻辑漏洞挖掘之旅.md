#  SRC | 一次从0到1的逻辑漏洞挖掘之旅  
 黑白之道   2025-06-24 02:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
当我看到前端没任何功能点时，是绝望的；看到登录到系统后端只调用了两个接口时，是绝望的；看到js中一堆接口，但大多数都是403时，是绝望的；找到一个能调通的接口，但不知道参数名时，是绝望的；找到参数名，但是不知道传参的值时，是绝望的。  
  
文章作者：奇安信攻防社区（  
新人小安  
）  
  
文章来源：  
https://forum.butian.net/share/4420  
  
  
**1**  
►  
  
**前言**  
  
  
最近对某产品进行渗透测试，系统登陆进去发现是一片空白，前端没有任何菜单，界面，登陆后也仅仅只会产生两个后端请求，通过爆破也发现没有什么敏感的接口、api文档等。  
  
以往遇到这种情况都是直接下一个，但这次由于最近产出实在拉跨，选择多看看，最终在js中发现了更多接口，通过观察同类型接口得到关键接口需要的参数，通过构造参数最终拿到了该平台总共573万用户的昵称，手机号等信息，成功从0到1产出了严重的逻辑漏洞。  
  
此篇文章用于复盘，现在回想，似乎这次漏洞挖掘的每一步都是一个“绝望”的心态：  
> 看到前端没任何功能点时，是绝望的  
  
看到登录到系统后端只调用了两个接口时，是绝望的  
  
看到js中一堆接口，但大多数都是403时，是绝望的  
  
找到一个能调通的接口，但不知道参数名时，是绝望的  
  
找到参数名，但是不知道传参的值时，是绝望的  
  
  
但好在，在每一次“绝望”的时候，我都没选择放弃希望，最终成功调通了接口，拿到了敏感数据，迎来了曙光。这篇文章我将再次还原当初的视角，与大家分享本次的漏洞挖掘经历，分享在上面每一次“绝望”的时候，我做出的一些操作和所用到的技巧，希望和各位师傅们交流学习，共同进步~  
  
  
**2**  
►  
  
**测试开始**  
  
  
得到资产之后，是个域名，直接访问一手，于是就来了当头一棒，访问登陆后前端界面如下，鸟都没有，此情此景，一个大大的Welcome看起来好像也没有那么欢迎我。  
  
![image-20250513170049942.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVYngPbSf1v1qhTQic9G8BLCWhicFh6tysl2tpITxqHxaMAMxrnHB7wFeQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
一般遇到这种情况，我的惯用操作就是：前端不行，试试后端接口，抓抓包，看看从登录到进入这个平台的时候，都调用了哪些接口。使用Burp即可  
  
![image-20250513170920674.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVmytUMunLHvP80YkqUcAHe3mpYLqRrIdiaNEouhFEWyiaoUOGQcIUaibXg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
然而，看到结果之后心又凉了半截，从登录到进入平台前端，没有任何功能点交互相关的请求，只有两个可信认证类的确认用户身份的接口  
  
![image-20250513171219605.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVs5Mgx7JvY3vvQDx6r630SzEEibaJF0Rj0S3kZTbyU8n74rlpmAXc6HQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
不过遇到这种情况也能有一些收获，看到接口路由非常规范，可以猜测是spring的后端，那么就可以跑一下敏感路径，看看会不会泄露一些敏感的Actuator端点，有没有api-docs等。当然，结果在大多数情况下是不理想的  
  
![image-20250513172837629.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVK6p8dmXsGEByDs9q2J2MJQjDvcZGENG2a9vgqBJkhaaTKrAicibibibMbQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
在这种情况，有两条路，第一个就是顺着这些敏感的接口继续走，目前提示403，可以用一些静态文件后缀尝试能不能bypass，但这个我试了也是失败，所以就启用另一个策略，既然爆破不出敏感路径和接口文档，那就动手去找。  
  
这里也是分享下我找接口的思路：就是从前端js文件中去搜索，具体怎么搜索呢？可以根据已有的接口，也就是上面我们抓包抓到唯二的两个接口，直接F12，全局搜索，搜索上面抓到包的接口，这里不一定直接搜完整的接口名，比如上面有一个接口是“api/user/current-menu-tree”，那么我们可以搜"api/"或者"user"等等，挑选关键词搜就OK了，结果如下：  
  
![image-20250514140727118.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVDYjRcMZEsZILUtedrds0fW8dEU4ycFT2jjcPlovgNFupuxBZlZTCLw/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
这里也是非常幸运，直接搜索，点进去就发现了大量的接口，这里接口并不是分开的，而是直接写在了一起，这对我们而言就非常有利  
  
![image-20250514140943046.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJV9HqFKO4nnVmfwJbqqVDr3t8Y65mIMswDByic7AeQLamNoXhFr48E0icA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
直接复制下来，稍微正则表达式提取一下路径，就可以放到Burp里面跑一下  
  
![image-20250514141153850.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVmvLiaF0Dwrwj9j8ce7c4UFsdI1KjQfoR7icB4pH2gTVYO6iaWSRSKl6Eg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
![image-20250514141327018.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJV2MAPNC24aib4u5USISO05BOBjnOs6AYoicK57hQOTwwQ4ntWfpZgibR4w/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
但是到现在其实一个问题也显而易见了，我们这样测试只是单纯的GET请求接口，没有携带任何参数，因为我们不知道接口需要什么参数，也不知道具体参数值该传什么，我个人的习惯就是直接发包，先筛选出起码不是403的接口，之后也许能根据接口的报错信息，提示或者回显来判断需要什么参数，进而再进行构造，尝试调通接口，寻找可用信息。  
  
![image-20250514145826772.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVM70L99AlVps8RtEicnTB7pULLZFk1oibYtMGPpJX9f8dAicaTfUvBRBiaA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
Burp跑完之后还是有一些信息，其中HaE已经给我们标出来了，图上就有一个请求返回了手机号的字段，但实际上那个接口没什么危害，返回的都是公开的信息。这些接口中有的提示是200，有的是403，200中还有一些是提示我们请求方式不正确，例如下图：  
  
![image-20250514150005162.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVwadALndVlF6iaNKL2QXn8Su67LQWsujMSMsmXt3glurrSc5OgqMX6rw/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
有的请求要求是POST，有的要求是PUT，我们只需要再次发到repeater中单独再次测试即可。测试中，通过接口的名称，发现了一个报错的接口  
  
![image-20250514150733765.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJViauJHxFYBibOxDYME2Xt7YfuQQkiaW8NeTaIEDBeOTDxWvO4SUz8OfRxQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
通过报错，可以看到，似乎这个接口没能调通的原因，就是因为缺少一个参数，名称为"tenantId"，看到这个报错，心情喜出望外，立马拼接了一手试了一下，虽然tenantId这个id不知道具体填什么，先随便来个，1或者123这种：  
  
![image-20250514151503991.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVUqw7on40flXNso4vBpn4ib7XGhhYRRibibx3QU2uL0MZyr4aG8Qtq67LA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
可以看到，虽然成功了，但是没有卵用，接口调通了，没有数据，那就说明我们的参数tenantId也许是错误的，本来有了一些希望，现在又变成了绝望，就目前的情况我们根本不知道tenantId具体该填什么，此时我也尝试了爆破，但是没有任何效果。  
  
此时心情也是低入谷底，可能有危害的接口，但是不知道参数值，无奈继续尝试其他的接口，希望能找到一些有用的信息，这时候的目标更希望是快速找到个什么接口，能返回tenantld  
  
果不其然，在不懈的努力下，发现之前爆破中的接口，返回了这样一组数据：  
  
![image-20250514154431300.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVZKicwP9gQmOVJObibnKHldrydFovWwHKic5OdbSqY4wfqy0KKwR3IjGicg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
没错！终于找到tenantld了！赶紧拼接请求一手！  
  
![image-20250514160306046.png](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUDVibkspLtIJ9eHy5e4SOpJVzXQic6NxTheoFUHjbqzhn6HsB8exYT55qN4wleHpEIwsoO9G9Hx6VpA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
终于，成功，拼接这个tenantld后，接口返回了573w用户信息。此时此刻，感觉刚刚付出的一切，都有了结果！  
  
  
**3**  
►  
  
**总结**  
  
  
如果光从漏洞类型来看，这其实只是一个简单的未授权漏洞，但实际这个漏洞最难的地方还是从0到1找到这个接口的“路径”，从一开始只是一个空白界面，到最后发现这个接口，每一步都存在挫折和困难。实际挖洞本身就是一件非常困难的事情，我们面对一个也许自己都不知道是干什么的系统，要熟悉他，摸清其中暗含的业务逻辑，往大来讲，安全实际本身就是一件“逆天而行”的事情，在这个过程中我们通过坚持，一步步得到成果，这也许是拿下一个靶标，或许是挖出一个漏洞，但虽然过程很艰辛，当我们成功的时候，内心也会感到无比的喜悦，感激当初那个遇到困难没选择放弃的自己。  
  
希望通过这篇文章与各位师傅分享我关于接口与API漏洞挖掘方面的技巧，同时也非常欢迎大家随时与我进行交流，共同进步，感谢大家！  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
