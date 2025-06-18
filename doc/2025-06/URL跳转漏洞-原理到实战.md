#  URL跳转漏洞-原理到实战  
原创 今木安全  今木安全   2025-06-18 12:21  
  
1. 定义  
  
URL跳转漏洞（开放重定向漏洞）发生在Web应用程序未经验证地将用户重定向到第三方URL时。该漏洞允许攻击者构造恶意链接，将用户从可信网站重定向到钓鱼网站或恶意内容页面。  
  
**核心问题**  
：应用程序将用户控制的输入直接用于重定向操作，未进行安全验证：  
## 2. 现象  
### 典型漏洞表现：  
```
```  
### 漏洞特征：  
- URL中包含redirect  
、return  
、url  
等参数  
- 302状态码或HTML meta刷新跳转  
- 跳转后地址与当前域名不相关  
- 出现异常协议（如data:  
、ftp:  
）或伪协议  
## 3. 漏洞危害  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">风险类型</span></span></th><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">具体危害</span></span></th><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">案例说明</span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">钓鱼攻击</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">窃取凭证/财务信息</span></span></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">伪造银行登录页窃取账号密码</span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">恶意软件分发</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">诱导下载木马/勒索软件</span></span></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">&#34;系统更新&#34;提示下载带毒程序</span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">信任欺骗</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">利用可信域名背书</span></span></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">https://company.com -&gt; https://company-com.fake/login</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">绕过检测</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">规避安全防护机制</span></span></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">通过可信站点中转恶意链接</span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">存储型XSS</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">配合脚本注入攻击</span></span></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">redirectUrl=data:text/html,alert(1)</span></code></td></tr></tbody></table>## 4. 黑盒渗透测试方法  
### 4.1 基础探测  
```
```  
### 4.2 测试Payload清单  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">测试类型</span></span></th><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">测试Payload</span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">外部域名</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?url=https://attacker.com</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">特殊协议</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?forward=ftp://evil.net</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">JS伪协议</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?target=javascript:alert(document.domain)</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">编码绕过</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?jump=https%3A%2F%2Fattacker.com</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">双重编码</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?return=%252F%252Fevil.com</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">IP地址</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?to=http://192.168.1.1</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">目录穿越</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?next=/../../../../etc/passwd</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">空字节注入</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?url=https://trusted.com\0.evil.com</span></code></td></tr></tbody></table>### 4.3 Burp Suite自动化  
```
```  
## 5. Java白盒审计指南  
### 5.1 审计流程  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FUyHlHlguEiaCic0IynwTiaILJcaf1r1xEyaiaZ9mmrUBMKplBUGrKtL2287NyuD8pauBQJkHtcTsSE4CT7FBfFBrA/640?wx_fmt=png&from=appmsg "")  
### 5.2 关键审计点  
1. **定位危险方法**  
：  
```
```  
  
1. **回溯数据流**  
：  
```
```  
  
1. **验证防护逻辑**  
：  
  
1. 白名单域名检查  
1. 协议限制（仅允许http/https）  
1. URL规范化处理  
1. 路径合法性验证  
## 6. Java中的关键代码  
### 6.1 危险重定向方法  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">方法类型</span></span></th><th style="box-sizing: border-box;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;padding: 6px 13px;"><span style="box-sizing: border-box;"><span leaf="">危险代码示例</span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">Servlet API</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">response.sendRedirect(untrustedUrl);</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">Location Header</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">response.setHeader(&#34;Location&#34;, inputUrl);</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">Spring Redirect</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">return &#34;redirect:&#34; + request.getParam(&#34;url&#34;);</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">ModelAndView</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">new ModelAndView(&#34;redirect:&#34; + target);</span></code></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><strong style="box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">RedirectView</span></span></strong></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 6px 13px;"><code style="box-sizing: border-box;font-family: &#34;Lucida Console&#34;, Consolas, Courier, monospace;text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">new RedirectView(userControlledUrl);</span></code></td></tr></tbody></table>### 6.2 安全重定向示例  
```
```  
## 7. PHP中的关键代码  
### 危险重定向函数：  
```
```  
### 安全重定向实现：  
```
```  
## 8. Java漏洞代码  
### 漏洞特征代码：  
```
```  
### 漏洞修复要点：  
1. **白名单校验**  
：建立可跳转域名/路径白名单  
1. **协议过滤**  
：仅允许http/https协议  
1. **URL规范化**  
：使用URI  
类解析标准化URL  
1. **域名验证**  
：验证目标域名是否在可信列表  
1. **相对路径处理**  
：禁止以../  
开头的相对路径  
## 9.实战  
#### redirect  
```
```  
  
    
  
没有任何限制，可以直接随意跳转  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FUyHlHlguEiaCic0IynwTiaILJcaf1r1xEyk83o7M8Uh5RxPBEaLLQrBLX6BhVxpeib2De2DVmLDXuwlUcsEyyErbA/640?wx_fmt=png&from=appmsg "")  
#### ModelAndView  
```
```  
  
  
没有任何限制，同样随意跳转  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FUyHlHlguEiaCic0IynwTiaILJcaf1r1xEyUExDPgCcG5iaWN3XAoI8PuUGobDwSRKvIs5Lvc3yCrGPO2ba119n8IQ/640?wx_fmt=png&from=appmsg "")  
#### response.sendRedirect  
```
```  
## 没有任何限制，同样随意跳转  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/FUyHlHlguEiaCic0IynwTiaILJcaf1r1xEyBq5g6cjCBC2Zfee5rchmic9xX3WP0sg6ias3TVyNk3AuJiaYErynFvzVQ/640?wx_fmt=png&from=appmsg "")  
## 10.安全代码  
  
白名单模式  
```
```  
  
