#  LiteLLM漏洞链：低权限用户即可接管AI网关服务器  
原创 Red Hunter
                    Red Hunter  黑白之道   2026-06-16 23:18  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618185&idx=1&sn=e7a4ddec94c9af10451bca515c67e228&scene=21#wechat_redirect)  
> **导语**  
：LiteLLM是一个广泛部署的开源AI网关，用于在统一的OpenAI兼容接口下代理调用100多个模型提供商。Obsidian Security近日披露，该代理存在一个严重漏洞链，仅需一个默认低权限账户，即可通过三个漏洞串联利用，最终提升为完整管理员权限并在服务器上执行任意代码，综合CVSS评分高达9.9。  
  
## 一、漏洞概述  
  
LiteLLM（由BerriAI维护）是一个被广泛使用的开源AI网关，它通过统一的OpenAI兼容接口，代理调用超过100个模型提供商的API。  
  
一旦服务器被接管，攻击者可以获取：  
- **主密钥**  
（master key）  
  
- **用于解密存储凭据的盐密钥**  
（salt key）  
  
- **数据库URL**  
  
- **所有配置的提供商密钥**  
（OpenAI、Anthropic、Gemini、Bedrock、Azure等）  
  
- **流经网关的所有内容**  
（提示词和响应）  
  
![LiteLLM漏洞攻击链](https://mmbiz.qpic.cn/sz_mmbiz_jpg/nGzNudUIJ6MWs6JojV7cVbibaV4x5rCg00EabMU7c03gQibaZyosJ96UpJD0ibWnyKibu713nfU2KsPBp62aXjGgv9HUlmHjDlcuJYeaicFvPOJs/640?wx_fmt=jpeg "LiteLLM漏洞攻击链")  
## 二、三个漏洞详解  
  
该漏洞链包含三个独立漏洞，串联利用形成致命攻击：  
### CVE-2026-47101：授权绕过  
  
第一个漏洞是授权绕过。当普通用户（internal_user）生成虚拟API密钥时，LiteLLM会存储调用者提供的 allowed_routes  
 字段，但不检查它是否与用户的角色匹配。  
  
该字段本应限制密钥的功能范围。然而，代理同时将其作为后备授权处理，因此非管理员用户可以创建一个包含 allowed_routes: ["/*"]  
（通配符）的密钥，从而访问所有路由，包括仅限管理员的路由。同样的未检查写入出现在其他密钥管理端点上，这也是修复需要三个Pull Request才能完成的原因。  
### CVE-2026-47102：权限提升  
  
绕过路由限制后，后面的处理程序变得可达。其中多个处理程序假定路由Gate已经完成了筛选，这就打开了两个攻击路径。  
  
第二个漏洞是权限提升。/user/update  
 端点允许用户编辑自己的记录，但不限制可以写入的字段。用户可以通过自更新设置 user_role: "proxy_admin"  
，该值会被接受并保存，从而将调用者提升为完整代理管理员。org_admin可以通过合法的预期代码路径访问此端点，无需任何绕过；而默认的 internal_user 则需要先利用CVE-2026-47101。  
  
VulnCheck（ CVE分配机构）给出的CVSS评分：4.0标准下8.7分，3.1标准下8.8分。  
### CVE-2026-40217：沙箱逃逸  
  
第三个漏洞是自定义代码防护线（Custom Code Guardrail）中的沙箱逃逸。该功能编译并运行管理员提供的Python代码。生产端点通过 exec()  
 执行代码，且无源码级过滤。  
  
当 exec()  
 获得不包含 __builtins__  
 的 globals 字典时，Python会静默注入完整的builtins模块，从而向代码提供 __import__  
、open  
 和 eval  
。一个简单的调用 os.system  
 的payload就足以获取反向shell。  
  
X41 D-Sec（独立发现此漏洞的另一家安全公司）在 /guardrails/test_custom_code  
 操场端点上发现了另一条路径，通过运行时字节码重写击败了正则表达式黑名单。两条攻击路径都最终实现了服务器端代码执行。  
## 三、攻击者能获得什么  
  
LiteLLM处于咽喉要道，攻击范围非常广泛。完整的漏洞链可暴露：  
- **主密钥和盐密钥**  
：可用于解密数据库中存储的加密凭据  
  
- **数据库URL**  
：可访问数据库  
  
- **所有提供商密钥**  
：包括OpenAI、Anthropic、Claude、Gemini等  
  
- **流经网关的所有数据**  
：提示词、响应、PII、源代码、内部工单、粘贴的密钥等  
  
如果代理还运行着模型上下文协议（Model Context Protocol，MCP）或代理网关，OAuth令牌和工具凭据也在攻击范围内。  
### 更危险的风险：篡改而非窃取  
  
更尖锐的风险不在于攻击者能读取什么，而在于他能篡改什么。网关位于AI代理和模型之间的通信链路上，被攻陷后可以篡改传输中的响应。  
  
Obsidian在演示中展示了针对通过被黑代理路由的Claude Code的攻击。这不是提示词注入（Prompt Injection），而是攻击者利用LiteLLM的内置回调机制——这是一个在每个请求上都触发的扩展点，且从未出现在管理界面中。回调函数将模型的响应替换为伪造的工具调用，并重写安全检查上下文，使该操作看起来像是已批准的。  
  
在演示中，开发者只输入了一个单词"hello"，攻击者就在开发者的机器上弹出了反向shell。  
## 四、LiteLLM的多事之秋  
  
这并非LiteLLM今年的第一次危机：  
- **2026年3月**  
：供应链攻击在PyPI上后门了两个LiteLLM版本  
  
- **2026年4月**  
：关键SQL注入漏洞在披露后36小时内就被利用  
  
- **2026年6月**  
：CVE-2026-42271（stdio-MCP machinery中的漏洞）已在野外被利用，并被列入CISA的已知利用漏洞（KEV）目录  
  
Obsidian表示，此次披露的漏洞链是已公开的有完整工作演示的漏洞，并非在野外观察到的利用案例。但由于代理的特殊位置，它始终是攻击者的目标。  
## 五、修复建议  
  
升级到 v1.83.14-stable 或更高版本，这是包含完整修复集的第一个发布版本。  
  
然后进行审计：  
- 重新验证每个持有 proxy_admin 角色的账户，将该角色视为主机级访问权限  
  
- 审查代理上的每个自定义代码防护线  
  
- 检查 config.yaml  
 中 litellm_settings.callbacks  
 下加载的回调，因为这些永远不会出现在控制台中，恰恰是后渗透攻击者隐藏的地方  
  
- 验证部署代码的完整性，而不仅仅是配置  
  
如怀疑已遭受攻击，应轮换提供商密钥、数据库凭据以及任何存储的MCP令牌。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。配图由华盟网授权使用。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/nGzNudUIJ6Puc8HNiaVFMibMWyXuRCjam9iat0x1rCpsp1iatD7HveaKn7X0FMG8AlYEYZQbWQjAzjbYJjgdDQYTxLsn3W66vehH9V8LV2z9XnE/640?wx_fmt=jpeg "")  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618370&idx=1&sn=04062f6f20b8c24755eb711f63e2101b&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618166&idx=3&sn=42d553ae19e05e17a57425bafd32452d&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=MzAxMjE3ODU3MQ==&mid=2650618370&idx=4&sn=17496d177d3e9f5a0bcb209cd40975dc&scene=21#wechat_redirect)  
> 👇 点击**阅读原文**  
，访问我的网站  
  
  
