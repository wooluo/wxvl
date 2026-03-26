#  阿里云 AVD、长亭漏洞库、OSCS、奇安信 |多源实时漏洞监控和推送  
savior-only
                    savior-only  夜组安全   2026-03-26 00:00  
  
免责声明  
  
由于传播、利用本公众号夜组安全所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号夜组安全及作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
**所有工具安全性自测！！！VX：**  
**NightCTI**  
  
朋友们现在只对常读和星标的公众号才展示大图推送，建议大家把  
**夜组安全**  
“**设为星标**  
”，  
否则可能就看不到了啦！  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icZ1W9s2Jp2WrOMH4AFgkSfEFMOvvFuVKmDYdQjwJ9ekMm4jiasmWhBicHJngFY1USGOZfd3Xg4k3iamUOT5DcodvA/640?wx_fmt=png&from=appmsg "")  
  
## 工具介绍  
  
WatchVuln_Web是WatchVuln 的二开版本，在原版命令行工具的基础上增加了 Web 管理控制台，提供可视化配置界面，方便用户管理漏洞监控和推送设置。  
## 功能特性  
### Web 管理控制台  
- **可视化配置界面**  
：通过 Web 页面配置所有功能，无需修改配置文件  
  
- **实时监控状态**  
：查看漏洞库数量、最近更新时间、下次检查时间  
  
- **手动触发检查**  
：一键触发漏洞检查，无需等待定时任务  
  
- **操作日志**  
：记录所有配置变更和推送记录  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/WibL3bOeESMIOGXTovPsqauZC0PCiatKWQQsujpR4C6cPKsTcicdSNXOnfBqkKYqvJPgcrjwBFTOnohuYTibXgdIJwdHjJggdvwzRowjr50J5vg/640?wx_fmt=png&from=appmsg "")  
### 数据源  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/WibL3bOeESMISHWRKjsgaUXfjtkjjJTMRqeR8uRtnQd0SrjIyicuYicNEwx9pDnCWHic9AcZtSZc4OwicUgDXTD0UoiamJic2AN7mEN3qn1gkeFyaI/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibL3bOeESMIppLXiaq0o3bVg5Fdwfz2qONF0RWl4VHYGQKWb5dianKRicKBBHny2L3nS7dOdGAkLU5XZZMD51KDKdUTMghlEwz8RmkPicaRYxHU/640?wx_fmt=png&from=appmsg "")  
### 推送渠道  
  
支持多种推送方式：  
- 钉钉群机器人  
  
- 飞书群机器人  
  
- 微信企业版  
  
- Server 酱  
  
- PushPlus  
  
- Telegram Bot  
  
- Slack Webhook  
  
- Bark  
  
- 蓝信  
  
- 自定义 Webhook  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/WibL3bOeESMLQ5sl6mG1w3PEm5z2ToPZjQdvJicHsyRXmnUtDckk8D0dlMxjT5qPaBJS41voOHZ3Bgs0PlC5lCECVjJlRoUFPPHIicHqBVNDgw/640?wx_fmt=png&from=appmsg "")  
## 快速开始  
### 直接运行  
```
# 运行（默认监听 0.0.0.0:8080）./WatchVuln_Web-windows-amd64.exe --console
```  
  
首次启动会生成随机登录密码，请注意查看日志。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibL3bOeESMK4VrhsZ5MbHJjKMML4XY4gu3NOPXgczQyqZy7wIU8XdOTgCd032K5toIGL7iazfTsXpPyl4XVsHFh3WsWJ7jGen8ue90icVD1jk/640?wx_fmt=png&from=appmsg "")  
## 配置说明  
  
启动后访问 http://localhost:8080  
，使用 admin 账号登录（每次启动密码会随机生成，见日志）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibL3bOeESMLbuLYcxr87dK0okoWUa4Tqzj8tEMKxmQIdgSphnvIhUWOsrQwnhLnMzPhibbtuylq4bTEfzm1Y4TB5PuiaYq7TISl85YlaRYiciaI/640?wx_fmt=png&from=appmsg "")  
### 监控配置  
- **检查间隔**  
：设置漏洞检查周期（15分钟/30分钟/1小时/2小时/6小时）  
  
- **数据源选择**  
：勾选需要监控的漏洞源  
  
- **关键词过滤**  
：设置白名单/黑名单关键词过滤  
  
- **CVE 过滤**  
：开启后多个源的同一 CVE 只推送一次  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibL3bOeESMKXcYwXzDiciaaBmavB1XW84WbOdx2Xdg7yewfbTxYK0LxmLNZyvsJerF5keVbbnYOQ2Z7Vem0uSlicEtWPrzDE1iapclEKmeIibeYA/640?wx_fmt=png&from=appmsg "")  
### 推送配置  
  
配置推送渠道的访问凭证，每个渠道可独立开启/关闭。  
### 代理配置  
  
支持 HTTP/SOCKS5 代理，用于访问需要代理的数据源。  
  
## 工具获取  
  
  
  
点击关注下方名片  
进入公众号  
  
回复关键字【  
260326  
】获取  
下载链接  
  
  
## 往期精彩  
  
  
[一个综合性的Web安全学习平台 | 涵盖16大类Web安全漏洞，共80+个实战场景2026-03-25](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247496552&idx=1&sn=66c6fe8d1c0b4c96e01579bee35faae8&scene=21#wechat_redirect)  
[网站老被攻击？别慌，这个免费“保镖”我用了都说好2026-03-24](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247496551&idx=1&sn=bbeaff114e49f9c4cfbf3a8912e95d6c&scene=21#wechat_redirect)  
[BeforeDawn 漏洞管理平台 | 致敬每一个在黎明前守夜的安全人员2026-03-23](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247496531&idx=1&sn=7cfaf72f34988de5d0be92164d912d7e&scene=21#wechat_redirect)  
[云安全渗透测试框架 - 支持国际主流云厂商和国内云平台2026-03-20](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247496525&idx=1&sn=ee423b4b6dfc387f91a8a2f8b971d8db&scene=21#wechat_redirect)  
[BurpSuite 多漏洞自动化探测插件  | XSS、SQL 注入（10 种数据库）、SSTI 模板注入（6 大家族 20+ 引擎）、NoSQL 注入2026-03-19](https://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247496514&idx=1&sn=763253f5d9398861270dda2765068fd6&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/OAmMqjhMehrtxRQaYnbrvafmXHe0AwWLr2mdZxcg9wia7gVTfBbpfT6kR2xkjzsZ6bTTu5YCbytuoshPcddfsNg/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&random=0.8399406679299557&tp=webp "")  
  
