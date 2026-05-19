#  【src实战】| 业务逻辑漏洞  
 迪哥讲事   2026-05-19 03:00  
  
📝 **编者语**  
  
有些漏洞的发现过程，其实并不复杂。  
  
可能只是一次正常的业务操作，或者一个“不服气”的小测试，最后慢慢把问题带了出来。  
  
这篇文章分享的是一个比较有意思的小程序逻辑漏洞案例，漏洞本身不算复杂，但思路很适合刚开始接触业务逻辑漏洞的师傅参考。  
  
1  
  
“舔狗的自述”  
  
事情是这样的。  
  
最近在挖某家新开的 SRC，小程序刚上线没多久，我寻思：  
  
**“新资产 + 新业务，一般都比较有节目效果。”**  
  
于是打开小程序开始随缘乱逛。  
  
**一、第一眼：非常普通的购物小程序**  
  
整个小程序长这样：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4nVuxDEkduWQaAlFlG2TBHpbHyJB6CbY0xLDrNsA1KS4a5GR4icwosKL0r18KfOe9pNtkrZMYRPiarfRhDuAPFk737m9KXH3hGT8/640?wx_fmt=png&from=appmsg "")  
  
说实话，第一眼看过去：  
  
很普通。  
  
普通到甚至有点困。  
  
就是标准的：  
  
- 商品  
  
- 下单  
  
- 收货地址  
  
- 支付  
  
  
  
这种电商模板。  
  
  
**二、一开始其实没什么思路**  
  
我最开始测了一圈：  
  
- 登录  
  
- 优惠券  
  
- 商品接口  
  
- 支付流程  
  
  
  
都没太大收获。  
  
直到我点到了：  
  
👉 收货地址。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4licCJweia4Vjeicz9gxVd3fsCEPrHmQZooFWplySRKCyic6eULAb8Y8843OhibXdFtDuzvFyo28lE80OcIeyQfg4DF1EK3Ev7rhopg/640?wx_fmt=png&from=appmsg "")  
  
**三、一个让我有点不服气的提示**  
  
我随手填了个比较偏远的地址。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4ne1HiajiaYbKa6uDVG5Vz3fIiaBa9o35bQwl7K2BH9nH43PAzYtqhF5U99icj4rMDg5picnHxShqPyoDk6v76TqDzHian0TkxwicIcJM/640?wx_fmt=png&from=appmsg "")  
  
  
结果系统提示：  
  
当前地区暂不支持发货  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4nNBdFbO3UpcQUbO8WxJZjlyEiarZOR1KZ6ZKS8yuSoAXlVnLOxicBTtXzESugwNlMH65Zia17pDevkCxwthVibKibkwZqbVyPrkqY0/640?wx_fmt=png&from=appmsg "")  
  
正常用户看到这里，可能就退出了。  
  
但挖洞人脑子里的第一反应是：  
  
**“真的假的？”**  
  
  
**四、业务逻辑里，最怕“前端判断”**  
  
很多业务系统都会做这种：  
  
if(地区不支持)  
  
{  
  
   不允许下单  
  
}  
  
但问题在于：  
  
有些系统只在前端判断。  
  
后端根本没认真校验。  
  
于是经典流程来了：  
  
**“开BP，抓包。”**  
  
  
**五、开始看修改地址的数据包**  
  
我在“修改地址”的地方抓了个包。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4ntSsqz1VCg26yH8zY8ZicoVFBicfPv3tvknrwoyswLowsGFgS2FmewNlLhPuMQggqEyYfRqrscJu5IUVNnYEhPzT0XOFQHxZGGs/640?wx_fmt=png&from=appmsg "")  
  
数据结构其实挺典型：  
  
provinceCode  
  
cityCode  
  
countyCode  
  
townCode  
  
villageCode  
  
也就是：  
  
- 省  
  
- 市  
  
- 区县  
  
- 乡镇  
  
- 村  
  
  
  
对应的五级行政编码。  
  
  
**六、这个时候，开始进入“胡思乱想”阶段**  
  
说实话。  
  
一开始我也没什么特别高级的思路。  
  
只是脑子里有个问题：  
  
**“它到底是怎么判断这个地区能不能发货的？”**  
  
  
**七、我现在很喜欢测一种东西：数据类型**  
  
很多系统：  
  
- 校验了值  
  
- 但没校验类型  
  
  
  
比如：  
  
650000  
  
它可能只判断：  
  
是否等于 650000  
  
但没考虑：  
  
650000.0  
  
  
**八、于是我做了一个很朴素的测试**  
  
直接把：  
  
"provinceCode":"650000"  
  
改成：  
  
"provinceCode":"650000.0"  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4mVU9bvWCd2zhy1LFqrAGhicf3dAhy2511M73HLj9wA9XqG4QaGrMbek1Gzp30dA5UKbyEGUuicEfmVQibdS4iaxHBdhQJoztpkHNI/640?wx_fmt=png&from=appmsg "")  
  
然后重新发包。  
  
  
**九、结果突然就不一样了**  
  
原本：  
  
不支持发货  
  
现在：  
  
直接通过了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4nQWFhef0cncYc2FkDRhUx5D4bylibgnr86EF8vucibmPjVHsxUGU8RQ829aVicBW4oVibqxgGHHyRicZaQqR6JExQKHibO9f2NDtkFc/640?wx_fmt=png&from=appmsg "")  
  
我当时第一反应其实是：  
  
**“啊？这也行？”**  
  
  
**十、接下来继续验证**  
  
既然地址修改成功了。  
  
那下一步自然就是：  
  
下单测试。  
  
结果：  
  
订单成功创建。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4mQzFpRrX7fmsIibYkEgU5aicOnaPcATdzxqJ1Muiae8NsmQ6RIlapcgWiaTrfXvRVWuedWDPWia9EsrFetnfpPUysiaP0DVLWZrDrho/640?wx_fmt=png&from=appmsg "")  
  
  
**十一、这个漏洞本质是什么？**  
  
简单来说：  
  
地址校验逻辑存在缺陷。  
  
系统原本应该：  
  
- 严格校验行政区编码  
  
- 判断是否属于禁发区域  
  
  
  
但实际上：  
  
它只校验了“部分格式”。  
  
  
**十二、为什么 650000.0 能绕过去？**  
  
这个场景其实很典型。  
  
有些后端会出现：  
  
字符串 → 数字转换  
  
或者：  
  
弱类型比较  
  
导致：  
  
650000 == 650000.0  
  
成立。  
  
但：  
  
业务判断流程已经被绕过了。  
  
- 弱口令  
  
- 简单爆破  
  
  
  
但都没什么结果。  
  
  
3  
  
小总结  
  
以前我总觉得：  
  
**“业务逻辑漏洞，应该很复杂。”**  
  
后来发现很多时候其实不是。  
  
反而很多问题都来自：  
  
- 类型校验  
  
- 边界值  
  
- 参数格式  
  
  
  
我当时其实觉得：  
  
这最多是个低危。  
  
毕竟：  
  
- 没有 getshell  
  
- 没有拖库  
  
- 没有特别夸张的利用链  
  
  
  
结果交上去之后：  
  
通过了，而且还是高危。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4m03ibhaibdzyEVk0eI5TRjCBYNwOWq5Wuma54oH9zH90nXnLY5pwXic7RL8gPEn3xy6bACXhqP7CibxKU01nnmO3RxhNyR7pHiaSKs/640?wx_fmt=png&from=appmsg "")  
  
那一刻属于是：  
  
**“鼠鼠突然理解业务漏洞为什么值钱了。”**  
  
如果总结一下，其实就几个点：  
  
  
🔹 不要太相信前端提示  
  
不支持发货  
  
≠  
  
后端真的禁止  
  
  
🔹 参数不只测“值”  
  
还要测：  
  
- 类型  
  
- 格式  
  
- 空值  
  
- 小数  
  
- 科学计数法  
  
  
  
  
🔹 业务漏洞很多时候不复杂  
  
它更像：  
  
**“你有没有多试一下。”**  
  
  
如果你是一个长期主义者，欢迎加入我的知识星球，本星球日日更新,包含号主大量一线实战,全网独一无二，微信识别二维码付费即可加入，如不满意，72 小时内可在 App 内无条件自助退款  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YmmVSe19Qj5EMr3X76qdKBrhIIkBlVVyuiaiasseFZ9LqtibyKFk7gXvgTU2C2yEwKLaaqfX0DL3eoH6gTcNLJvDQ/640?wx_fmt=png&from=appmsg "")  
  
往期回顾#   
# 如何利用ai辅助挖漏洞  
#   
# 如何在移动端抓包-下  
#   
# 如何绕过签名校验  
#   
  
[一款bp神器](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247495880&idx=1&sn=65d42fbff5e198509e55072674ac5283&chksm=e8a5faabdfd273bd55df8f7db3d644d3102d7382020234741e37ca29e963eace13dd17fcabdd&scene=21#wechat_redirect)  
  
  
[挖掘有回显ssrf的隐藏payload](https://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247496898&idx=1&sn=b6088e20a8b4fc9fbd887b900d8c5247&scene=21#wechat_redirect)  
  
  
[ssrf绕过新思路](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247495841&idx=1&sn=bbf477afa30391b8072d23469645d026&chksm=e8a5fac2dfd273d42344f18c7c6f0f7a158cca94041c4c4db330c3adf2d1f77f062dcaf6c5e0&scene=21#wechat_redirect)  
  
  
[一个辅助测试ssrf的工具](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247496380&idx=1&sn=78c0c4c67821f5ecbe4f3947b567eeec&chksm=e8a5f8dfdfd271c935aeb4444ea7e928c55cb4c823c51f1067f267699d71a1aad086cf203b99&scene=21#wechat_redirect)  
  
  
[dom-xss精选文章](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247488819&idx=1&sn=5141f88f3e70b9c97e63a4b68689bf6e&chksm=e8a61f50dfd1964692f93412f122087ac160b743b4532ee0c1e42a83039de62825ebbd066a1e&scene=21#wechat_redirect)  
  
  
[年度精选文章](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247487187&idx=1&sn=622438ee6492e4c639ebd8500384ab2f&chksm=e8a604b0dfd18da6c459b4705abd520cc2259a607dd9306915d845c1965224cc117207fc6236&scene=21#wechat_redirect)  
  
  
[Nuclei权威指南-如何躺赚](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247487122&idx=1&sn=32459310408d126aa43240673b8b0846&chksm=e8a604f1dfd18de737769dd512ad4063a3da328117b8a98c4ca9bc5b48af4dcfa397c667f4e3&scene=21#wechat_redirect)  
  
  
[漏洞赏金猎人系列-如何测试设置功能IV](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486973&idx=1&sn=6ec419db11ff93d30aa2fbc04d8dbab6&chksm=e8a6079edfd18e88f6236e237837ee0d1101489d52f2abb28532162e2937ec4612f1be52a88f&scene=21#wechat_redirect)  
  
  
[漏洞赏金猎人系列-如何测试注册功能以及相关Tips](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486764&idx=1&sn=9f78d4c937675d76fb94de20effdeb78&chksm=e8a6074fdfd18e59126990bc3fcae300cdac492b374ad3962926092aa0074c3ee0945a31aa8a&scene=21#wechat_redirect)  
  
[‍](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486764&idx=1&sn=9f78d4c937675d76fb94de20effdeb78&chksm=e8a6074fdfd18e59126990bc3fcae300cdac492b374ad3962926092aa0074c3ee0945a31aa8a&scene=21#wechat_redirect)  
  
  
  
  
  
