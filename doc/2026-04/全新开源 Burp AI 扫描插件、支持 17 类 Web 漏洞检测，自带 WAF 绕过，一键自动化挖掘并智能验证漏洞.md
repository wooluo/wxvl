#  全新开源 Burp AI 扫描插件、支持 17 类 Web 漏洞检测，自带 WAF 绕过，一键自动化挖掘并智能验证漏洞  
ZackSecurity
                    ZackSecurity  渗透安全HackTwo   2026-04-23 16:01  
  
0x01 工具介绍  
  
**全新开源 Zack-AI-Scanner 是一款搭载大语言模型的 Burp Suite 漏洞扫描扩展，全面覆盖 17 类高频 Web 漏洞检测。内置多种 WAF 绕过策略与优质攻击载荷，依托 AI 引擎智能分析流量特征、动态生成测试 Payload，自动完成漏洞挖掘与高置信度核验。兼容市面主流 AI 接口，操作简单易部署，支持 HTML、Markdown 多格式报告导出，高效赋能日常授权渗透与安全检测工作。**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAXzFgOoRAfASZh8CRtVgdZFGntYaepKBrvib4XQ6mLJKpibBqzlqTEpkNnibs3tcF8SicED1MBYOPTccpl5cxZD5PicoUGhh3U3W62g/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
注意：  
现在只对常读和星标的公众号才展示大图推送，建议大家把  
**渗透安全HackTwo**  
"**设为****星标⭐️**  
"  
**否****则可能就看不到了啦！**  
  
**下载地址在末尾 #渗透安全HackTwo**  
  
0x02   
功能介绍  
  
✨主要功能  
  
- **AI 智能扫描**  
: 内置 Skills 利用 LLM 自动分析请求并制定测试策略  
  
- **多漏洞类型支持**  
: 支持 17 种常见 Web 漏洞类型的检测  
  
- **WAF 绕过能力**  
: 内置 Prompt 多种 WAF 绕过技术，50% 载荷为绕过载荷  
  
- **实时结果验证**  
: AI 二次验证确保漏洞真实性（置信度阈值 ≥90%）  
  
- **多格式报告导出**  
: 支持 HTML 和 Markdown 格式的渗透测试报告  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAV6ptqicxk2D3eNBARqcflErhKibibzSCRaPKInJxnEHbbcF9QscsCrrPJwfWXjvhaLSNbic4R51MDAOJJq0ISjbOtz0TB7uMkxzico/640?wx_fmt=png&from=appmsg "")  
### 日志统计窗口可实时查看扫描信息：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAUmUBpD7GYy9PpBJZsWWrTdUklYuOKhialPcURffGdY8LibBsFBEdPtfsEicRiayicV2jRc3jysx7RWUs7ovicSbZADmvD5CN7Yy4ibbg/640?wx_fmt=png&from=appmsg "")  
### 请求与响应详情窗口可以查看实时的扫描流量：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWXsvCTBFXjPutLATSWMpZPns6yHnOndDbp3YhBIvIIxSYFo4qRvukZeHDWbicl20OsYBeMNCvUSBRRbJAUxg0gYZUIc2o7Lkibc/640?wx_fmt=png&from=appmsg "")  
### 在任务列表窗口可以查看所有扫描任务和状态，扫描结束导出漏洞报告，支持 HTML 和 Markdown 格式：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAXgaBjD2f696BeniaYkZgZXcCu86wsIu7109w6DTFHDeGAGM1Nq6JeQw54g7pL84uzSewqYlGSbDYmJmITianGHwMzbdHoxR8rXY/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAURcWxNdDyeeeFh62EwPzkyfOuGYicqs97tBmYD4eKVNQW7S0O0ZI33dF6NZbialmqMCO2IuxwAyicTcqDpdTeL57xw8HxYXqVibWo/640?wx_fmt=png&from=appmsg "")  
### HTML 和 Markdown 格式报告内容：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAVB4sbldVz6ZicSuJZtuZ0X4nGiapsccSUC6DBF11U242X7IJnfwzyMHPIbkbEa6KvWkruDYLtibSQAibib35icI3iaNzgEeiaft2lH65A/640?wx_fmt=png&from=appmsg "")  
  
  
###   
  
0x03 更新介绍  
```
Full Changelog
```  
  
  
0x04 使用介绍  
  
📦基础使用流程  
### 配置  
1. 点击 "配置" 按钮打开配置中心  
  
1. 选择 AI 服务提供商并输入 API Key  
  
1. 点击 "获取模型" 按钮获取可用模型列表  
  
1. 保存配置后即可开始使用  
  
### 使用  
1. 在 Burp Suite 的 Proxy 或其他模块中选择 HTTP 请求  
  
1. 右键点击，选择 "Zack-AI-Scanner" 菜单  
  
1. 选择扫描模式（AI 智能扫描或特定漏洞类型）  
  
1. 在主面板查看扫描进度和结果  
  
1. 导出漏洞报告  
  
## 插件使用实例  
  
配置大模型API Key信息：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAW3y7x3ThtpGTt5x5fcItul07tMuBibia31q7OKBfibejm6pQacD2Wk8RfrMV7QbyOjt2ficBqAQowEJMibqmVtTY7Sy1luq5lj0g44/640?wx_fmt=png&from=appmsg "")  
  
右击请求包->拓展->Zack-AI-Scanner调用工具，可选择AI智能扫描和单漏洞扫描：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAU4UuoHaNNkqtGt1WJphGnAGpogbcwqwlHibRUY191vqLkRRI1hmYVXkbT0pS4FSn7xeeLDqTXBibzKIpWAT34nBSdynA74RcbW8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAWfNbYKumXQzGu5jZ1UbR1D46bmtIbphia3bRSFbdHX5slOZ2C7FbInvUEBMqoyibujQiaLMD5l3qmYciaerQ1zQlTgibGmDiapRscYo/640?wx_fmt=png&from=appmsg "")  
  
  
**0x05 内部VIP星球介绍-V1.5（福利）**  
  
          
如果你想学习更多**渗透测试技术/应急溯源/免杀工具/挖洞SRC赚取漏洞赏金/红队打点等**  
欢迎加入我们**内部星球**  
可获得内部工具字典和享受内部资源和  
内部交流群，  
**每天更新1day/0day漏洞刷分上分****(2026POC更新至5732+)**  
**，**  
包含全网一些**付费扫描****工具及内部原创的Burp自动化漏****洞探测插件/漏扫工具等，AI代审工具，最新挖洞技巧等**  
。shadon/  
Hunter  
/  
0zone  
/  
Zoomeye  
/Quake/  
Fofa高级会员/AI账号  
/CTFShow等各种账号会员共享。详情点击下方链接了解，觉得价格高的师傅后台回复"   
**星球**  
 "有优惠券名额有限先到先得  
**❗️**  
啥都有  
**❗️**  
全网资源  
最新  
最丰富  
**❗️****（🤙截止目前已有2500+多位师傅选择加入❗️早加入早享受）**  
  
****  
最新漏洞情报分享：  
https://t.zsxq.com/VuWGw  
  
****  
  
**👉****点击了解加入-->>内部VIP知识星球福利介绍V1.5版本-1day/0day漏洞库及内部资源更新**  
  
****  
  
  
结尾  
  
# 免责声明  
  
  
# 获取方法  
  
  
**公众号回复20260424获取下载、回复 加群 获取交流群**  
  
****  
  
# 最后必看-免责声明  
  
  
      
文章中的案例或工具仅面向合法授权的企业安全建设行为，如您需要测试内容的可用性，请自行搭建靶机环境，勿用于非法行为。如  
用于其他用途，由使用者承担全部法律及连带责任，与作者和本公众号无关。  
本项目所有收录的poc均为漏洞的理论判断，不存在漏洞利用过程，不会对目标发起真实攻击和漏洞利用。文中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用。  
如您在使用本工具或阅读文章的过程中存在任何非法行为，您需自行承担相应后果，我们将不承担任何法律及连带责任。本工具或文章或来源于网络，若有侵权请联系作者删除，请在24小时内删除，请勿用于商业行为，自行查验是否具有后门，切勿相信软件内的广告！  
  
  
  
# 往期推荐  
  
  
**1.内部VIP知识星球福利介绍V1.5（AI自动化）**  
  
**2.CS4.8-CobaltStrike4.8汉化+插件版**  
  
**3.全新升级BurpSuite2026.2专业(稳定版)**  
  
**4. 最新xray1.9.11高级版下载Windows/Linux**  
  
**5. 最新HCL AppScan Standard**  
  
  
渗透安全HackTwo  
  
微信号：关注公众号获取  
  
后台回复星球加入：  
知识星球  
  
扫码关注 了解更多  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RjOvISzUFq6qFFAxdkV2tgPPqL76yNTw38UJ9vr5QJQE48ff1I4Gichw7adAcHQx8ePBPmwvouAhs4ArJFVdKkw/640?wx_fmt=png "二维码")  
  
  
  
上一篇文章：  
[Nacos配置文件攻防思路总结|揭秘Nacos被低估的攻击面](https://mp.weixin.qq.com/s?__biz=Mzg3ODE2MjkxMQ==&mid=2247492839&idx=1&sn=b6f091114fbd8e8922153a996c8f4f1c&scene=21#wechat_redirect)  
  
  
