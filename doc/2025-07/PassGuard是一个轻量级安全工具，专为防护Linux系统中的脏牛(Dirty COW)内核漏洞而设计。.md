#  PassGuard是一个轻量级安全工具，专为防护Linux系统中的脏牛(Dirty COW)内核漏洞而设计。  
aiici  夜组安全   2025-07-01 00:04  
  
免责声明  
  
由于传播、利用本公众号夜组安全所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号夜组安全及作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
**所有工具安全性自测！！！VX：**  
**baobeiaini_ya**  
  
朋友们现在只对常读和星标的公众号才展示大图推送，建议大家把  
**夜组安全**  
“**设为星标**  
”，  
否则可能就看不到了啦！  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icZ1W9s2Jp2WrOMH4AFgkSfEFMOvvFuVKmDYdQjwJ9ekMm4jiasmWhBicHJngFY1USGOZfd3Xg4k3iamUOT5DcodvA/640?wx_fmt=png&from=appmsg "")  
  
## 工具介绍  
  
PassGuard是一个轻量级安全工具，专为防护Linux系统中的脏牛(Dirty COW)内核漏洞而设计。它通过实时监控和保护关键系统文件（如/etc/passwd  
），有效防止攻击者利用内核漏洞进行权限提升攻击。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icZ1W9s2Jp2Wj14bX58NfHuHOcG4hShbnfxTDQrLAs4WgjErMyict84LNffQUVKqDwuls9ibtkA26Lz8OL0l7yq0A/640?wx_fmt=png&from=appmsg "")  
## 🐮 什么是脏牛(Dirty COW)漏洞？  
  
脏牛(CVE-2016-5195)是Linux内核中的一个严重权限提升漏洞，存在于2.6.22版本至4.8.3版本的Linux内核中。攻击者可以利用该漏洞修改只读内存映射，从而获取系统的root权限。该漏洞因其利用了Linux内核中写时复制(Copy-On-Write)机制的缺陷而得名。  
  
攻击者通常会通过修改/etc/passwd  
文件来创建具有root权限的新用户或修改现有用户的权限，从而实现权限提升。  
## ✨ 功能特点  
- 🔍 **实时监控**  
: 高频轮询检测/etc/passwd  
文件变化  
  
- 🛑 **异常阻断**  
: 自动终止非白名单进程对关键文件的修改  
  
- 🔄 **自动恢复**  
: 在检测到攻击时恢复文件到安全状态  
  
- 📊 **智能判断**  
: 区分正常系统操作和恶意攻击行为  
  
- 📱 **告警通知**  
: 支持企业微信Webhook告警，及时通知管理员  
  
- 🔒 **白名单机制**  
: 允许合法系统工具修改关键文件  
  
- 🚀 **轻量高效**  
: 资源占用极低，适合长期运行  
  
## 🔧 工作原理  
  
PassGuard采用以下策略保护您的系统：  
1. **文件监控**  
: 定期计算/etc/passwd  
文件的哈希值，检测文件变化  
  
1. **变化确认**  
: 当检测到文件变化时，等待短暂时间确认变化是否稳定  
  
1. **攻击识别**  
: 如果文件在短时间内多次变化，判定为可能的攻击行为  
  
1. **进程分析**  
: 识别正在写入/etc/passwd  
的进程，检查是否在白名单中  
  
1. **防护措施**  
: 终止非白名单进程，恢复文件到安全状态  
  
1. **告警通知**  
: 通过企业微信发送攻击告警，包含详细信息  
  
## 📋 安装说明  
### 前提条件  
- Linux操作系统  
  
- Go 1.13或更高版本（仅编译时需要）  
  
### 安装步骤  
1. 克隆仓库:  
  
```
git clone https://github.com/aiici/passguard.gitcd passguard
```  
1. 编译程序:  
  
```
go build -o passguard main.go
```  
1. 设置权限并移动到系统目录:  
  
```
chmod +x passguardsudo mv passguard /usr/local/bin/
```  
## 🚀 使用方法  
### 基本使用  
  
直接运行PassGuard:  
```
sudo passguard
```  
### 设置为系统服务  
1. 创建systemd服务文件:  
  
```
sudo nano /etc/systemd/system/passguard.service
```  
1. 添加以下内容:  
  
```
[Unit]Description=PassGuard - Protect against Dirty COW attacksAfter=network.target[Service]ExecStart=/usr/local/bin/passguardRestart=alwaysUser=rootGroup=rootEnvironment=WECHAT_WEBHOOK=your_webhook_url_here[Install]WantedBy=multi-user.target
```  
1. 启用并启动服务:  
  
```
sudo systemctl daemon-reloadsudo systemctl enable passguardsudo systemctl start passguard
```  
1. 检查服务状态:  
  
```
sudo systemctl status passguard
```  
## ⚙️ 配置选项  
  
PassGuard通过环境变量进行配置:  
  
<table><thead><tr><th style="color: rgb(66, 75, 93);font-size: 14px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none 0% 0% / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">环境变量</span></section></th><th style="color: rgb(66, 75, 93);font-size: 14px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none 0% 0% / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">描述</span></section></th><th style="color: rgb(66, 75, 93);font-size: 14px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none 0% 0% / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">默认值</span></section></th></tr></thead><tbody><tr style="color: rgb(66, 75, 93);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: 0%;background-position-y: 0%;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">WECHAT_WEBHOOK</span></code></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">企业微信Webhook URL，用于发送告警通知</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">空（不发送通知）</span></section></td></tr></tbody></table>  
  
示例:  
```
export WECHAT_WEBHOOK="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"sudo -E passguard
```  
## 🔍 日志查看  
  
PassGuard的日志输出到标准输出，可以通过以下方式查看:  
```
# 如果直接运行sudo passguard# 如果作为服务运行sudo journalctl -u passguard -f
```  
  
  
## 工具获取  
  
  
  
点击关注下方名片  
进入公众号  
  
回复关键字【  
250701  
】获取  
下载链接  
  
  
## 往期精彩  
  
  
往期推荐  
  
[为渗透测试工程师设计的纯前端工具集，专注于信息收集和文本处理，提供 URL 处理、路径分析、信息收集等功能。](http://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247494659&idx=1&sn=cc30a929b1d60d6cf79279fd545f7e77&chksm=c36ba8fbf41c21edc6aa3c62eaddc47d292c113b1f0c662bbe2b42a71da842914ab6b5e5c529&scene=21#wechat_redirect)  
  
  
[一个专为渗透测试人员、红队工程师打造的浏览器插件，便于快速保存当前所有打开的网页 URL，避免在测试过程中遗漏关键目标。](http://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247494647&idx=1&sn=eb97224ab6ac83686e2b8a7928fa425f&chksm=c36baf0ff41c2619ac886d3b93a5d0256b4c16386eb58df5bc1a1483f5b98bf0a95fbcf2403d&scene=21#wechat_redirect)  
  
  
[一款轻量级Java源代码审计工具](http://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247494604&idx=1&sn=91c609102a5ad4b0afcfe5a10abdfdac&chksm=c36baf34f41c26220d782debd114cb0ef2356e94af500728d86de290c6312072f9daf26838b9&scene=21#wechat_redirect)  
  
  
[360主动防御绕过抓取hash](http://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247494603&idx=1&sn=d47d9f357bae6aa718d2657badd732b9&chksm=c36baf33f41c26255fb7af314533d21c6d0c6396fbe88d35804de2f5c75a9d4496ced9ee3d48&scene=21#wechat_redirect)  
  
  
[Gathery 是一款信息收集与分析工具，集成了多种实用的信息收集功能和小工具](http://mp.weixin.qq.com/s?__biz=Mzk0ODM0NDIxNQ==&mid=2247494602&idx=1&sn=8b431a1ba6554e4b2ec000b5cc11f110&chksm=c36baf32f41c2624611632d49b49801a6984d23be17389e5887e096d07422abe9ad23cc96b29&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/OAmMqjhMehrtxRQaYnbrvafmXHe0AwWLr2mdZxcg9wia7gVTfBbpfT6kR2xkjzsZ6bTTu5YCbytuoshPcddfsNg/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&random=0.8399406679299557&tp=webp "")  
  
