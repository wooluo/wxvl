#  【SRC实战】|越权漏洞“默认你不会改参数”  
原创 隐雾安全
                    隐雾安全  隐雾安全   2026-05-12 01:30  
  
📝 **编者语**  
  
挖过一段时间SRC后发现  
  
**越权，才是最高频出现的问题。**  
  
尤其是在一些：  
  
- 管理后台  
  
- 小程序  
  
- 内部系统  
  
  
  
经常会出现：  
  
- “不该你看的数据”  
  
- “不该你操作的功能”  
  
  
  
这篇文章，就结合两个真实案例，聊聊最近在测试越权漏洞时的一些思考。  
  
1  
  
什么是越权？  
  
简单来说：  
  
**越权 = 做了本不属于当前身份的操作**  
  
一般分两种：  
  
  
**🔹 水平越权**  
  
看别人的数据  
  
比如：  
  
- 查看别人的订单  
  
- 查看别人的身份证  
  
- 查看别人的个人资料  
  
  
  
  
**🔹 垂直越权**  
  
普通用户做管理员的事  
  
比如：  
  
- 添加后台用户  
  
- 删除别人账号  
  
- 修改系统配置  
  
  
  
2  
  
实战案例一  
  
**1️⃣ 一开始是个后台系统**  
  
打开站点之后，第一感觉就是：  
  
这是一个内部管理平台。  
  
因为：  
  
- 没有注册入口  
  
- 页面偏后台风格  
  
- 功能基本都是管理类  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4ktb6opzdADsW4402By5HO8pSCc2nG7HsibHDaGFtXGEEhGtbE6WhHv31VjIscVytDTIQDFqKZnX0p2fSWVEK5dzhdEwkBOpQGQ/640?wx_fmt=png&from=appmsg "")  
  
  
**2️⃣ 先做了一些基础测试**  
  
因为没有注册功能，我一开始尝试了：  
  
- 弱口令  
  
- 简单爆破  
  
  
  
但都没什么结果。  
  
  
**3️⃣ 开始看接口**  
  
这时候我习惯性开了插件，顺便看接口。  
  
在接口列表里，发现几个看起来比较特别的路径。  
  
于是简单 fuzz 了一下。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4k3ZVcvROOT5fAlj0P93nvnickqEbnt1DRDnW3etHBK9ib8BGTT7HDb6FrtoWLibHWEIlRO2EDGuiaiaWMNlBmZn0yrlW8YxcAT2zNo/640?wx_fmt=png&from=appmsg "")  
  
  
**4️⃣ 一个返回长度不一样的接口**  
  
测试的时候，有个接口返回长度明显不一样。  
  
这个时候我一般会比较在意：  
  
“为什么它和别的接口返回不一样？”  
  
于是单独看了一下返回内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4nfUeg5YibqRcDeCxIDOmBNiaZhIzUeoYYezkDI04AU8ibPXaddg8OA58b4FEibOJIlkibNVTibTmEPwEPmZmibjmw6PaicqWpawZrPSMA/640?wx_fmt=png&from=appmsg "")  
  
  
**5️⃣ 提示“参数缺失”**  
  
返回信息大概是：  
  
请求参数缺失  
  
这个提示其实很关键。  
  
因为它说明：  
  
接口是真实存在的  
并且后端已经开始处理请求了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4mULRpnVONzUJMqfibyaOPmbTPmnS7xpuUGtlibQL6B5iaibWwf1LR3PibicCOjuqpZnOQauu2Q4OnVLYznqh0eqIX42ibaD06M3qgjGQ/640?wx_fmt=png&from=appmsg "")  
  
  
**6️⃣ 尝试修改请求方式**  
  
我把请求改成 POST。  
  
然后随便加了一点内容测试。  
  
结果返回：  
  
JSON 语法错误  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lw9jrCpQHicNc0VW9JnPGd5jdicWzV57uV5LGSSZyTQC2Nj7seicuvIRRsW8rNft4GBFE3HEMpseHUoCHZa8nRXwEzia1ZVfjFDgM/640?wx_fmt=png&from=appmsg "")  
  
  
**7️⃣ 这个时候基本能确认两件事**  
  
第一：  
  
👉 接口接受 JSON 数据  
  
第二：  
  
👉 后端没有完全拦截当前身份  
  
  
**8️⃣ 一个小技巧**  
  
因为是同一个站点：  
  
很多参数命名其实是复用的。  
  
所以我直接回去看了一眼登录接口的数据包。  
  
发现里面有：  
  
username  
  
password  
  
nickname  
  
这些字段。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lxrZiaIyeDQmRM0cJ0QJUGseelI0S2lbSiaiczczAvNicUYNWLu36uWMsYrzlF6336kXE2CenvXT30NL0kaPws08GBDDZrjVxD1Yw/640?wx_fmt=png&from=appmsg "")  
  
  
**9️⃣ 拼接 JSON 测试**  
  
我把这些参数放进之前那个接口里。  
  
重新发包。  
  
结果：  
  
👉 成功添加用户。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lDTBia3v07YOV40S0Xs6brQt5IqjjtfKFKv1UKajQKxSYHN0OxKpjgFSuibAsdttOuot9xPRLzcsgNeOic9bFn193PGu6StjUzFU/640?wx_fmt=png&from=appmsg "")  
  
  
**🔟 最终验证**  
  
新账号成功登录后台。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4lvnQt1iatLfH9qzI6j4xMZ1Tk9A23c6tUOeRVfTd2MeicKOa29GrevtWQewuGfrdHkQJxk7uoV11DiaicEqWiaCSkQDLo04jN5hH2E/640?wx_fmt=png&from=appmsg "")  
  
  
3  
  
小总结  
  
这个漏洞其实并不复杂。  
  
总结经验为以下几点  
  
  
**① 不要只盯“功能”**  
  
很多时候：  
  
页面没有按钮 ≠ 后端没有接口  
  
  
**② 返回信息非常重要**  
  
像这种：  
  
- 参数缺失  
  
- JSON 错误  
  
- 字段错误  
  
  
  
其实都在告诉你：  
  
“这个接口是活的。”  
  
  
**③ 同站点参数复用率很高**  
  
很多开发：  
  
会复用同一套字段命名。  
  
所以：  
  
- 登录接口  
  
- 用户接口  
  
- 管理接口  
  
  
  
参数往往都能互相参考。  
  
4  
  
实战案例二  
  
第二个案例是个小程序。  
  
相比第一个，这个更偏：信息泄露类越权。  
  
  
**1️⃣ 起点很普通**  
  
登录之后，进入“我的”页面。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4lH5bNEGfC2dyteIPunbdIETGzrHn8arN1jjRnMRE439Jku5vAArZINZh9yuoN0SYVrbg9wcdVvOlHpCP9jHYMibghUIylhtbGU/640?wx_fmt=png&from=appmsg "")  
  
  
**2️⃣ 抓一个个人信息包**  
  
这种场景我现在基本都会抓。  
  
因为：  
  
“我的信息” 往往最容易出现越权。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4nljibqWw2X2N40Ws91Rj9sNPkGibAheAJ5BibC2yv8cva6DaKNAfWM9102teoLQ2eiaic73XT7Mwv9XDlHBWfIzSs5o7fEPiaCfZmos/640?wx_fmt=png&from=appmsg "")  
  
  
**3️⃣ 看到用户 ID**  
  
请求里有一个明显的用户参数。  
  
于是我做了一个最基础的测试：  
  
修改 ID。  
  
  
**4️⃣ 返回了别人的信息**  
  
改完之后，接口正常返回。  
  
但返回的数据：  
  
已经不是当前账号的信息了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4k9PNM1vvxGd0hAcwvh9U2Tia6op05c2xdSVazZKT9BYXoehEAuJ3OrBXqeE4SgOaVfiahwcB0icBXSQlKTHXnNNnrIHzhtFmXzPY/640?wx_fmt=png&from=appmsg "")  
  
  
**5️⃣ 开始做枚举**  
  
这个时候我一般会继续确认：  
  
**“这个数据是不是连续的？”**  
  
于是开始简单遍历。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DJX1rNqJe4ndHicEoqNcHsAY5IoRVtfKMlpLiceYDdaYLmZCfE7JwkXsLgGULbuNKuxKtKvibvmLR0zSjovMI4EovUG8pnF7H1tWiarLiaTzHlVA/640?wx_fmt=png&from=appmsg "")  
  
  
**6️⃣ 结果就是典型的水平越权**  
  
通过遍历：  
  
可以查看大量用户信息。  
  
包括：  
  
- 姓名  
  
- 身份证  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4mJc1fcrwNFmJnXtxqVqtwdvDyMN5ErtR99wib8oktDt5G8ibtWXd8mujYbYoicvrEdoX1Hw1VKXvfxV64Facbonxfe0iacrsD3RMw/640?wx_fmt=png&from=appmsg "")  
  
  
  
5  
  
测试越权的固定流程  
  
对于初学者测越权可以先做几件事：  
  
  
**🔹 改 ID**  
  
id  
  
uid  
  
memberId  
  
userId  
  
  
**🔹 去 Token**  
  
看看是不是未授权。  
  
  
**🔹 换请求方法**  
  
POST → GET  
  
PUT → GET  
  
  
**🔹 看返回内容**  
  
尤其注意：  
  
- phone  
  
- idCard  
  
- token  
  
  
  
  
🎁 **文末福利**  
  
联系客服获取《越权漏洞挖掘思路整理》  
  
**!**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/DJX1rNqJe4lgZBCAicxlfT62hhMVBOXjjPPuKJFOLKEf3en0e2Xby7nGhB2XeUMp0bOjb2ibBO0h5qrOGjkfH2nwOZfj991tTxDu749AK5JNo/640?wx_fmt=jpeg&from=appmsg "")  
  
  
**微信号丨**  
Hiddenfog001  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DJX1rNqJe4kgTAiasB66IUmZEVVZcvaqvib9hfGT8IaWiaKgVGsqbbvyKB0UyAUPwox2f9mqJ0VLRskkELEHNicMUvib9FzpKFvJWf6XlSENeicHM/640?wx_fmt=png&from=appmsg "")  
  
  
  
