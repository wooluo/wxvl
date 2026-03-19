#  新型 iOS 漏洞利用高级 iPhone 黑客工具窃取个人数据  
原创 网络安全9527
                    网络安全9527  安全圈的那点事儿   2026-03-19 05:55  
  
Google 威胁情报小组 (GTIG) 发现了一种名为 DarkSword 的高度复杂的 iOS 全链漏洞利用程序。  
  
该漏洞利用自 2025 年 11 月起活跃，利用多个零日漏洞完全入侵运行 iOS 18.4 至 18.7 的 Apple 设备。  
  
DarkSword 非常不寻常，因为它在其整个攻击链中完全依赖于 JavaScript，从而减少了对编译二进制文件的需求。  
  
谷歌的安全研究人员观察到，包括国家支持的间谍组织和商业监控供应商在内的多个威胁行为者，利用这一漏洞链攻击沙特阿拉伯、土耳其、马来西亚和乌克兰的高知名度受害者。  
## 威胁行为者归因和攻击方法  
  
DarkSword 已被至少三个不同的威胁行为者采用，每个行为者都根据其特定的行动需求定制了部署机制。  
  
第一个集群被识别为 UNC6748，它使用一个具有欺骗性的 Snapchat 主题网站，以沙特阿拉伯的用户为目标。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7P0dJaOuj1bCRlCibickWYTQDqU1t3kAHicvic0xF3q6lsYs6ibmSztyseOd9ZwF8BhFxxk9jDz0nTXEY2byELQS4l4QJtzDxdDnskw/640?wx_fmt=png&from=appmsg "")  
  
攻击者利用 JavaScript 混淆和会话存储检查来防止再次感染之前的受害者。  
  
当目标用户访问登录页面时，该漏洞利用程序会通过一个不可见的框架加载远程代码执行模块，从而部署 GHOSTKNIFE 恶意软件。  
  
第二场行动是由土耳其商业监控设备供应商 PARS Defense 策划的。  
  
他们利用增强版的漏洞利用加载程序，针对土耳其和马来西亚的用户发起攻击。  
  
该组织采用了更严格的操作安全措施，包括对其漏洞利用有效载荷进行强加密和高级设备指纹识别，以部署 GHOSTSABER 后门。  
  
最后，疑似俄罗斯间谍组织 UNC6353 将 DarkSword 整合到针对乌克兰网站的水坑攻击活动中。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/BicXBAdicJy7PBvqanZfzWOz6MzoU14XcXukSvhKGBGWVYI19HicScqZqhBAg54KbPmK8chufzYOSPKSHiayzsp78n55O5icnlqENIicIX3ibHn7k0/640?wx_fmt=png&from=appmsg "")  
  
他们将恶意脚本注入到被入侵的网站中，以传播 GHOSTBLADE 数据挖掘程序。  
  
有趣的是，尽管有针对 iOS 18.7 的漏洞利用程序，但 UNC6353 仅使用了针对 iOS 18.4 至 18.6 的漏洞利用模块。  
  
攻击者利用漏洞后，部署了三种不同的基于 JavaScript 的有效载荷之一，旨在窃取大量数据。  
  
UNC6748 使用的 GHOSTKNIFE 恶意软件会窃取消息、位置历史记录和浏览器数据。  
  
它还支持音频录制和文件下载，并且会主动删除崩溃日志以隐藏其在设备上的存在。  
  
PARS Defense 部署了 GHOSTSABER，这是一个功能强大的后门，可通过 HTTP(S) 进行通信。  
  
它能够执行详细的设备枚举、文件窃取、任意 SQL 查询执行和动态 JavaScript 执行，使其成为一款多功能的间谍工具。  
  
UNC6353 使用的 GHOSTBLADE 数据挖掘器主要专注于从 iMessage、Telegram、WhatsApp、加密货币钱包和隐藏照片中提取个人数据。  
  
虽然它缺乏持续的后门功能，但其广泛的数据收集能力对受感染的目标构成了严重的隐私风险。  
  
