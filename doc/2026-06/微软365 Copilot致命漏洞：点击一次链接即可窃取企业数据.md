#  微软365 Copilot致命漏洞：点击一次链接即可窃取企业数据  
Red Hunter
                    Red Hunter  黑白之道   2026-06-16 23:18  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618185&idx=1&sn=e7a4ddec94c9af10451bca515c67e228&scene=21#wechat_redirect)  
> **导语**  
：微软365 Copilot企业版被发现存在严重漏洞链，攻击者只需发送一个指向合法微软域名的链接，用户点击一次即可被窃取 MFA 验证码、邮件内容、日历详情和机密文件。这个名为SearchLeak的漏洞已被微软标记为最高严重级别并完成修复。  
  
## 一、漏洞概述  
  
SearchLeak并非单个漏洞，而是一组漏洞链，它将微软365 Copilot企业版搜索功能武器化，使其成为静默的数据外泄通道。  
  
该漏洞由Varonis威胁实验室（Varonis Threat Labs）的研究员Dolev Taler发现并详细披露，编号为CVE-2026-42824，获得了微软的最高严重级别评分。  
  
![攻击链示意图](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6N8W6WJGVZniaU2uxDGGkHkwVicicc7lU4Fc5fwibKpYAMtOHUqopvBEM0QrmZaIdUNrblbe1rmSW9Yd1icy4nCZkaPcUCh7p90ulOo/640?wx_fmt=png "攻击链示意图")  
## 二、三阶段攻击链解析  
  
SearchLeak漏洞链将三种不同的弱点组合在一起，形成一击必杀的数据窃取方案：  
### 第一阶段：参数到提示词注入（P2P Injection）  
  
微软365 Copilot搜索功能接受一个 q  
 URL参数，用于自然语言搜索查询。问题在于，q  
 参数的值不仅被Copilot的AI引擎当作搜索字符串处理，还会被当作可执行指令。  
  
攻击者构造一个指向可信 microsoft.com 域名的恶意链接，命令Copilot搜索受害者的邮箱，并将提取的数据嵌入图片URL中。由于链接解析到合法微软域名，传统的反钓鱼和URL保护工具不会标记它。  
### 第二阶段：绕过安全护栏  
  
微软对危险AI生成HTML的缓解措施是将Copilot输出包裹在 <code>  
 块中，防止浏览器将其渲染为标记。  
  
然而，这种包裹只在Copilot完成生成阶段后才执行。在流式传输阶段，包含攻击者注入的 <img>  
 标签的原始HTML会临时在DOM中实时渲染。浏览器在 sanitizer 激活之前就发送了HTTP请求，这是一个教科书式的竞态条件绕过。  
### 第三阶段：通过Bing实现SSRF  
  
由于 m365.cloud.microsoft 上的内容安全策略（CSP），受害者的浏览器无法直接联系攻击者控制的服务器。但是，*.bing.com  
 在CSP允许列表中。Bing的"以图搜图"功能接受 imgurl  
 参数，并对提供的URL执行服务器端获取。  
  
攻击者将窃取的数据直接嵌入Bing图片搜索URL的路径中。Bing的后端无意中会将窃取的数据中继到攻击者的服务器，完全绕过CSP。  
  
整个攻击仅需要一个通过邮件、Teams、Slack或任何消息通道发送的恶意链接。点击后，Copilot静默搜索受害者的邮箱，生成包含嵌入窃取数据的Bing图片URL的响应，攻击者服务器在几秒钟内记录所有外泄信息，全程无需第二次点击。  
## 三、漏洞影响与修复状态  
  
SearchLeak漏洞的严重之处在于，三个独立看都可控的漏洞组合在一起，形成了一个一击必中的攻击方式：  
- **无需特殊权限**  
：受害者无需任何特殊权限，攻击即可生效  
  
- **无需插件**  
：不需要任何额外的浏览器插件  
  
- **无需二次交互**  
：点击一次链接即可完成全部窃取操作  
  
- **绕过传统防护**  
：因为链接指向合法微软域名，传统安全工具无法检测  
  
微软已在服务器端完全修复了SearchLeak漏洞，用户无需执行任何操作即可收到修复。  
## 四、防御建议  
  
尽管微软已修复漏洞，Varonis建议安全团队采取以下措施：  
- **监控Copilot搜索URL**  
：检测 q  
 参数中包含HTML或图片嵌入指令的编码 payload  
  
- **审计CSP允许列表**  
：审查任何对用户提供URL执行服务器端获取的域名  
  
- **将AI流式输出视为不可信**  
：sanitization必须在渲染时执行，而非作为后处理步骤  
  
- **提醒用户警惕**  
：在点击前检查包含长编码查询字符串的微软365链接  
  
## 五、关联事件：Reprompt漏洞  
  
SearchLeak是Varonis继发现Reprompt之后披露的又一起类似的一键数据外泄漏洞链。Reprompt影响的是Copilot Personal（个人版），而SearchLeak则针对Copilot Enterprise（企业版）。  
  
这些发现揭示了一个重要趋势：AI助手正在通过在新的上下文场景中重新激活原本难以利用的经典漏洞，创建新的、难以检测的攻击面。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。配图由华盟网授权使用。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/nGzNudUIJ6Puc8HNiaVFMibMWyXuRCjam9iat0x1rCpsp1iatD7HveaKn7X0FMG8AlYEYZQbWQjAzjbYJjgdDQYTxLsn3W66vehH9V8LV2z9XnE/640?wx_fmt=jpeg "")  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618370&idx=1&sn=04062f6f20b8c24755eb711f63e2101b&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618166&idx=3&sn=42d553ae19e05e17a57425bafd32452d&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618370&idx=4&sn=17496d177d3e9f5a0bcb209cd40975dc&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
