#  【红队】一个检测VUE站点未授权漏洞  
Ad1euDa1e
                    Ad1euDa1e  贝雷帽SEC   2026-04-10 01:56  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
**免责声明**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/HVNK6rZ71oofHnCicjcYq2y5pSeBUgibJg8K4djZgn6iaWb6NGmqxIhX2oPlRmGe6Yk0xBODwnibFF8XCjxhEV3K7w/640?wx_fmt=gif&wxfrom=13&wx_lazy=1&tp=wxpic "")  
  
本公众号所提供的文字和信息仅供学习和研究使用，  
请读者自觉遵守法律法规，不得利用本公众号所提供的信息从事任何违法活动。本公众号不对读者的任何违法行为承担任何责任  
。  
工具来自网络，安全性自测，如有侵权请联系删除。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
**工具介绍**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
  
VueCrack 是一个专为红队人员开发的浏览器插件，用于分析Vue框架网站的路由结构，并绕过路由守卫，从而发现站点的**隐藏资产**  
与**未授权访问漏洞**  
。  
  
   
核心功能：  
- **自动检测Vue框架**  
：快速识别目标站点是否使用Vue.js  
  
- **绕过路由守卫**  
：自动清除路由守卫，允许访问受保护路由  
  
- **修改鉴权字段**  
：自动修改路由元信息中的auth字段，绕过前端权限检查  
  
- **路由结构分析**  
：提取所有路由路径，包括可能隐藏的管理页面  
  
- **批量操作**  
：支持一键复制和访问所有发现的路由  
  
   
技术实现：  
- **多重检测引擎**  
：使用多种策略检测Vue及Router实例  
  
- **守卫清除机制**  
：通过修改Router原型方法清除beforeEach等路由守卫  
  
- **权限标志修改**  
：递归遍历路由树，修改所有auth相关字段  
  
- **内存路由提取**  
：直接从内存中获取完整路由表，包括隐藏路由  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
**工具使用**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
```
在 Chrome 或基于 Chromium 的浏览器中安装此扩展
访问基于 Vue.js 的网站
点击扩展图标，工具将显示所有可能的 URL 路径
使用生成的 URL 列表，尝试访问目标站点的受限页面
利用“打开”按钮直接导航到可能的未授权页面
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/k2PJfskYECkQWxhzdPAsAbkBholcAKeLthQTl8s7r0tAYbibAjXEHvv450icgeiaYOg958lBEca5GI3fWNyqIvjBIltiaaynXFJkCcmRuHKCFias/640?wx_fmt=png&from=appmsg "")  
  
  
**下载链接**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
```
项目地址：https://github.com/Ad1euDa1e/VueCrack
```  
  
  
  
  
End  
  
  
“点赞、在看与分享都是莫大的支持”  
  
  
**工具精选**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
  
  
  
[【红队】一款安全测试工具集——Onyx](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494121&idx=1&sn=8675cf1677352620a57d68ff9f0b0686&scene=21#wechat_redirect)  
  
  
[【红队】一款 AI 原生安全测试平台](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494139&idx=1&sn=5d8a98e0d0cb700c124aeaecae595d4c&scene=21#wechat_redirect)  
  
  
[【红队】Webshell 管理与后渗透平台](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494098&idx=1&sn=cb7bc8f3cc7f59e6f80f4b56e7d4c1f9&scene=21#wechat_redirect)  
  
  
[【红队】BProxy - 多级 SOCKS5 代理工具](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494084&idx=1&sn=dbc658a17e6ddc0dcd7c7857c841478a&scene=21#wechat_redirect)  
  
  
[【红队】攻击面管理平台 (ASM)](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494076&idx=1&sn=e9c2ff60ccd065dc223c71042515268d&scene=21#wechat_redirect)  
  
  
[【红队】ParrotOS 7.0 正式发布 代号：Echo](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247494038&idx=1&sn=243e1105a439eb986fdc34534e6a8d19&scene=21#wechat_redirect)  
  
  
[【红队】一款专为红队打造的主动资产指纹识别工具](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493898&idx=1&sn=3e395ade15061739c89f5d0a13645af4&scene=21#wechat_redirect)  
  
  
[【蓝队】SamWaf开源轻量级网站防火墙](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493939&idx=1&sn=e56702a24dcae461024668aaea6aced3&scene=21#wechat_redirect)  
  
  
[[蓝队] FastMonitor - 网络流量监控与威胁检测工具](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493925&idx=1&sn=a952c400c3ee63c8401ff57692745dd1&scene=21#wechat_redirect)  
  
  
[【蓝队】漏洞全生命周期管理平台](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493803&idx=1&sn=10daa12b5a3523bf4a1ecc665890f917&scene=21#wechat_redirect)  
  
  
[【蓝队】蓝队Ark神器 OpenArk v1.5.0](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493788&idx=1&sn=91a31e2d507cb9e0111c19dac98b315e&scene=21#wechat_redirect)  
  
  
[【红队】矛·盾 武器库 v3.2](https://mp.weixin.qq.com/s?__biz=Mzk0MDQzNzY5NQ==&mid=2247493701&idx=2&sn=9cf7e304fee21328bac6d9bd97b81183&scene=21#wechat_redirect)  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pM2klgicgT5dylTzXyrXBmex6dlAsZ0QJOQdzqcw2HpC49rnL0dTHNsWsOze4QmRYN7fPRoLdVK5MXs0DXtOvZw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
                                                   
  
      
  
  
  
