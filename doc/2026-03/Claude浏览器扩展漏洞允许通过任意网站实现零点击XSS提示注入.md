#  Claude浏览器扩展漏洞允许通过任意网站实现零点击XSS提示注入  
 FreeBuf   2026-03-27 10:11  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX38fmeyVsnhQ3ia5a5iaVTfKSXSmZ4MXkP11Mvvvfh7vKUA8n811jf1iaIeYTXwj3o2GCOWJPiaaW7NlQhmuWJunMecsuxM5VOyuhY/640?wx_fmt=png&from=appmsg "")  
##   
## 网络安全研究人员披露了Anthropic公司Claude谷歌浏览器扩展中存在的一个漏洞，攻击者只需诱使用户访问特定网页即可触发恶意提示注入。  
##   
##   
##   
  
**Part01**  
## 漏洞原理分析  
  
  
Koi Security研究员Oren Yomtov在提供给The Hacker News的报告中指出："该漏洞允许任何网站静默地向该AI助手注入提示，就像用户自己输入的一样。无需点击，无需权限提示。只需访问页面，攻击者就能完全控制你的浏览器。"  
  
  
该漏洞由两个底层缺陷串联形成：  
  
- 扩展程序中存在过于宽松的源白名单机制，允许任何匹配模式(*.claude.ai)的子域向Claude发送执行提示  
  
- 托管在"a-cdn.claude[.]ai"上的Arkose Labs验证码组件存在基于文档对象模型(DOM)的跨站脚本(XSS)漏洞  
  
**Part02**  
## 攻击实现方式  
  
  
具体而言，XSS漏洞允许在"a-cdn.claude[.]ai"上下文中执行任意JavaScript代码。攻击者可利用此行为注入JavaScript，向Claude扩展发送提示。而扩展程序仅因请求来自白名单域，就会将提示视为合法用户请求显示在Claude侧边栏中。  
  
  
Yomtov解释道："攻击者的页面在隐藏的中嵌入存在漏洞的Arkose组件，通过postMessage发送XSS有效载荷，注入的脚本就会向扩展程序触发提示。受害者完全不会察觉。"  
  
  
**Part03**  
## 潜在危害  
  
  
成功利用此漏洞可使攻击者：  
  
- 窃取敏感数据（如访问令牌）  
  
- 获取与AI Agent的对话历史记录  
  
- 以受害者身份执行操作（如冒充发送邮件、索取机密数据）  
  
**Part04**  
## 修复进展  
  
  
在2025年12月27日收到负责任的漏洞披露后，Anthropic为Chrome扩展部署了补丁，强制实施严格的源检查，要求精确匹配"claude[.]ai"域。Arkose Labs也于2026年2月19日修复了其端的XSS漏洞。  
  
  
Koi Security强调："AI浏览器助手功能越强大，作为攻击目标的价值就越高。一个能够导航浏览器、读取凭证并代表用户发送邮件的扩展程序，本质上就是一个自主Agent。而该Agent的安全性仅取决于其信任边界中最薄弱的环节。"  
  
  
**参考来源：**  
  
Claude Extension Flaw Enabled Zero-Click XSS Prompt Injection via Any Website  
  
https://thehackernews.com/2026/03/claude-extension-flaw-enabled-zero.html  
  
  
###   
###   
###   
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651335912&idx=1&sn=f7c9c36f910a122eb9bb727adcf9e89d&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
