#  Claude Code 源码：要是能重来 | 聊聊 Source Map 泄露这件小事  
原创 冰片Ice
                        冰片Ice  安全女王   2026-03-31 23:05  
  
# Source Map 文件泄露  
  
今天蹭下热点，聊聊一个我在挖 SRC 过程中经常遇到但容易被忽视的问题 —— **Source Map 文件泄露**  
。  
## 一个"不难发现"的漏洞  
  
做过web渗透测试的朋友应该都不陌生：打开浏览器开发者工具，翻翻 JS 文件末尾，看看有没有 sourceMappingURL  
 注释，或者直接在 URL 后面拼个 .map  
 试试 —— 就这么简单。  
  
相比 SQL 注入、XSS 这些需要构造 payload 的漏洞类型，Source Map 泄露的发现门槛确实不高。装个浏览器扩展（比如 SourceDetector），日常浏览网页的时候它就会自动帮你标记出来。  
  
但"容易发现"不代表"不严重"。  
## map 里面有什么  
  
同样是 Source Map 泄露，不同场景下的风险差异很大：  
- 有的 map 文件里只有压缩前的变量名和目录结构，影响相对有限  
- 有的 map 文件包含完整的 sourcesContent  
，等于把未混淆的原始源码一字不差地送到了攻击者手里  
- 更严重的情况是源码中硬编码了 API Key、内部接口地址、鉴权逻辑 —— 这时候一个 map 文件就可能成为撕开安全防线的攻击入口  
昨天Claude Code 事件就是一个新鲜的典型例子：Anthropic 的 npm 包因为构建流程配置疏忽，把 .map  
 文件打包进了发布产物，导致约 1,900 个 TypeScript 文件、超过 512,000 行完整源码暴露在公网上。内置工具、斜杠命令、未发布功能、内部特性标志……全部一览无余。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/msyThOmQAtC12qjHVaHW1kfY6TCEg7Je7G6DoOCThHTVDZ6IYSlLpVNezxz5MpmicWT1Sb6pmP01ls9CswPMu2m0hBy7zABrmhuRo3KBZ36Q/640?wx_fmt=png&from=appmsg "")  
  
## 如何呢  
  
技术层面的问题其实好解决 —— 关掉 source map 生成、服务端拦截 .map  
 请求、发布前检查一下构建产物，几分钟的事。  
  
**真正难的是意识层面。**  
  
我在提交漏洞的过程中反复遇到这样的情况：  
  
**反馈了，但不被重视。**  
 有时候提交了 Source Map 泄露的报告，对方不语只是忽略。  
  
**修了，但没修彻底。**  
 我提供了泄露的 map 文件 URL，对方确实把这个文件删了，返回 404 了。但问题的根源 —— 构建配置没改。下次发版，新的 map 文件又生成了，换个 URL 照样能访问。头痛医头，脚痛医脚。  
  
**没人修。**  
 一些中小企业没有专职的安全人员，甚至开发和运维都靠乙方或外包。  
  
还有一些情况是产品迭代太快、效率优先，安全配置在一次次"先上线再说"中被跳过了。或者是老项目年久失修，当初的构建配置已经没人维护了。  
  
这些都不是靠提交一个漏洞报告就能解决的问题。  
## 又能怎  
  
**SourceMap 安全指南**  
（source-map-leak.vercel.app）是一个纯静态的科普站点，以 Claude Code 泄露事件为切入点，面向三类人群：  
- **新手**  
 —— 用比喻和交互演示解释什么是 Source Map、泄露是怎么发生的  
- **开发者**  
 —— Webpack / Vite / Next.js / Vue CLI 各框架的具体配置方法，Nginx / Apache / Vercel 的服务端防护配置，npm 发包安全检查清单  
- **安全研究员**  
 —— 检测工具推荐、漏洞挖掘流程、报告模板  
我希望它能成为一个可以直接甩给开发同学看的链接 —— 下次再遇到"什么是 Source Map？为什么要关掉？怎么关？"这类问题，不用每次都从头解释一遍。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/msyThOmQAtCNICtMdGyGhXPEiaOsdrh188rGDd7CoFRomo9K9ibiciczFRf48Dw4gR9r5xmayibH807czwK6grA6ibGntzWJb8vsv8JIaZ6XE2OXk/640?wx_fmt=png&from=appmsg "")  
  
## 关于功能  
  
站点主要提供指南指引，没有  
在线检测功能  
。  
  
受到浏览器同源策略（CORS）限制，一个网页的 JavaScript 一般是无法读取另一个网站的 JS 文件内容和响应头。用公共代理绕过的方案不稳定，检测结果不可靠，如果"没检测到”误报成 “安全"是给了用户错误的信心。所以  
站点里没有做在线检测功能。推荐使用 SourceDetector 浏览器扩展或 curl 命令行来做检测 —— 这些方式不受 CORS 限制，结果比较可靠。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/msyThOmQAtBgrm108m7gia2OlfKCCgQkyeJ6iaD3eOehjOLWiaK685fbia4oSw86S2Y4eFuCaCibnjXPsSp4odhFcfwgxV1ELqrcaEM6UN3Tp5sQ/640?wx_fmt=png&from=appmsg "")  
  
## 写在最后  
  
其实这种漏洞既不复杂也不高深，构建工具的默认配置、匆忙的上线流程、缺失的安全 review —— 每一个环节的小疏忽都可能把源代码送到公网上。  
  
如果你是开发者，花五分钟检查一下自己项目的构建配置。  
  
如果你是安全从业者、漏洞赏金猎人，下次提交报告的时候或许可以附上这个站点的链接，帮助对方更好地理解问题。  
少一些"修了但没修好"的来回。  
  
  
项目已在 GitHub 开源（CC BY-NC-SA 4.0）：  
https://github.com/ForOneIce/SourceMapLeak  
  
在线访问： https://source-map-leak.vercel.app  
  
## 微信咨询（添加请说明来意）：  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/msyThOmQAtAJ4iaMic06OeRXgEm7e9g8plh3f0Nmcia6vDZ59by1hQnthNUib5k2P1244XXH7XLcAaFLaaRCJxyMXZBNXoeeFk6DibqgE2WCcOwY/640?wx_fmt=jpeg&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
  
  
