#  LiteLLM漏洞链可致AI网关遭接管，泄露所有密钥与数据  
 FreeBuf   2026-06-16 10:00  
  
![FreeBuf](https://mmbiz.qpic.cn/mmbiz_gif/icBE3OpK1IX0fIoxqPZ72uuTt3HFgwzOOibCrVibNAJC4ssib293Q5pwVgawibz3YLiaO8AKbqib9rJ9TOhyIiazHss3AZQr11WMuIWXGjSbqwSWiccg/640?wx_fmt=gif "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX2BYwYlAK4461qRuxry0jXgzESicHLia91BoYrCysOHfZlHjc9CheOgj1o0oMzRLab1e9BmSCPEpyE5icWnzGgAsBnhMGKVwTx6tY/640?wx_fmt=png&from=appmsg "")  
  
  
Obsidian安全研究人员披露，通过串联三个漏洞，LiteLLM代理上的默认低权限账户可提升至完全管理员权限并在服务器上执行代码。  
  
  
LiteLLM是一款广泛部署的开源AI网关，通过兼容OpenAI的单一接口代理调用100多个模型提供商的服务。服务器被接管将暴露其持有的所有提供商密钥、用于解密存储凭据的密钥，以及流经该网关的所有提示词和响应。  
  
  
Obsidian评定该完整漏洞链的CVSS评分为9.9（严重级别）。维护方BerriAI已在LiteLLM v1.83.14-stable版本中完整修复该问题（GitHub显示该版本发布于5月2日），建议用户升级至此版本或更高版本以修复这三个CVE漏洞。  
  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX2kRje6xq6HhZHUuGITJd6j1StDCxp6GMZanffuAbp678qqUicWfNe44Moz1TrwJZfz8WgY1bSnKlQcibx2bLkEdz3oZqMlznUjk/640?wx_fmt=jpeg&from=appmsg "")  
  
  
Part  
01  
  
三个漏洞详情  
  
首个漏洞（CVE-2026-47101）是授权绕过问题。当普通用户（internal_user）生成虚拟API密钥时，LiteLLM会直接存储调用者提供的allowed_routes字段，而不根据用户角色进行校验。该字段本应用于限制密钥权限，但代理却将其视为备用授权——非管理员用户可创建包含通配符["/*"]的密钥，从而访问包括管理员专属路由在内的所有路径。由于其他密钥管理端点也存在相同缺陷，修复该问题共需合并三个拉取请求。  
  
  
绕过路由限制后，攻击者可访问多个未实施二次校验的处理程序，进而触发以下两个漏洞：  
  
  
其一是权限提升漏洞（CVE-2026-47102）。/user/update端点允许用户编辑自身记录，但未限制可修改字段。攻击者通过提交包含user_role: "proxy_admin"的自更新请求即可获得完整代理管理员权限。组织管理员（org_admin）可通过合法路径触发此漏洞，而默认内部用户（internal_user）需先利用CVE-2026-47101漏洞。漏洞评级机构VulnCheck给出的CVSS 4.0评分为8.7，CVSS 3.1评分为8.8。  
  
  
其二是Custom Code Guardrail功能中的沙箱逃逸漏洞（CVE-2026-40217）。该功能会编译执行管理员提供的Python代码，但生产环境端点直接通过exec()运行代码且未实施源码级过滤。当exec()获取的globals字典不含__builtins__时，Python会隐式注入完整内置模块，使攻击代码获得__import__、open和eval等危险函数。通过调用os.system的简单载荷即可实现反向Shell。此外，X41 D-Sec独立发现的/guardrails/test_custom_code端点漏洞，可通过运行时字节码重写绕过正则表达式黑名单限制，最终同样导致服务器端代码执行。  
  
  
Part  
02  
  
攻击者能获取哪些信息  
  
作为关键枢纽节点，被攻陷的LiteLLM网关将暴露主密钥、用于解密存储凭据的盐密钥及数据库URL，同时泄露所有已配置的提供商密钥（包括OpenAI、Anthropic、Gemini、Bedrock、Azure等）。配置或环境变量中的密钥以明文存储，数据库中的密钥虽经加密但可通过盐密钥还原。所有流经网关的提示词和响应均会被窃取，实际部署环境中这些数据通常包含PII信息、源代码、内部票据和粘贴的密钥等敏感内容。  
  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX3HTytwVe99rEB61tMb5M8urxJtDZIYJVBR4uWcyeDQSgr7M1YpwqkIcPJ44Vtwr1w0DH1yxdcOibLHGicA8zW5qe9yj82GQQm78/640?wx_fmt=jpeg&from=appmsg "")  
  
  
若代理同时作为模型上下文协议（MCP）或Agent网关运行，OAuth令牌和工具凭证也将面临风险。更严重的威胁在于攻击者不仅能窃取数据，还能篡改AI模型返回的响应。Obsidian演示了通过被入侵代理路由Claude Code时，攻击者利用LiteLLM内置回调机制（该机制在每个请求时触发且不会显示在管理界面中），将模型响应替换为伪造的工具调用，并重写安全检查上下文使操作显示为已批准状态。演示中开发者仅输入"hello"一词，攻击者便在其机器上弹出反向Shell。  
  
  
值得注意的是，即使不考虑漏洞链，proxy_admin角色本身也拥有代码执行能力：MCP支持功能允许管理员注册stdio MCP服务器，代理会将其作为本地子进程启动。这属于设计权衡而非漏洞，因此获取管理员权限实质上等同于获得代码执行能力。Obsidian在v1.88.0版本中通过此方式复现了反向Shell攻击。此外，同一stdio-MCP机制中的真实漏洞（CVE-2026-42271）允许调用者通过LiteLLM的MCP预览端点生成子进程，该漏洞已被野外利用并于本月被列入CISA的已知 exploited漏洞目录。  
  
  
这并非LiteLLM今年首次出现安全问题：3月其PyPI发布的两个版本遭供应链攻击植入后门；4月披露的关键SQL注入漏洞在36小时内即遭利用。Obsidian强调本次漏洞链目前仅作为概念验证披露，尚未发现野外利用案例，但该代理的关键位置使其持续成为攻击目标。  
  
  
Part  
03  
  
修复建议  
  
立即升级至v1.83.14-stable或更高版本（首个包含完整修复的版本），并执行以下操作：  
  
  
1. 重新审计所有持有proxy_admin权限的账户，该角色应视为主机级访问权限  
  
2. 检查代理上所有Custom Code Guardrail配置  
  
3. 审查config.yaml中litellm_settings.callbacks加载的回调函数（这些内容不会显示在控制台且是攻击者隐藏后门的理想位置）  
  
4. 不仅检查配置还需验证部署代码的完整性  
  
5. 若怀疑存在泄露，立即轮换提供商密钥、数据库凭证及所有存储的MCP令牌  
  
  
需特别警惕：被入侵的代理不仅是数据泄露源，更可篡改Agent与模型间的通信数据。该漏洞链的根源在于各层级信任机制的失效——路由网关信任了调用者提供的字段、处理程序信任了路由网关的校验，而实际上没有任何环节实施有效验证。  
  
  
参考来源：  
  
LiteLLM Vulnerability Chain Lets Low-Privilege Users Take Over AI Gateway Servers  
  
https://thehackernews.com/2026/06/litellm-vulnerability-chain-lets-low.html  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651340512&idx=1&sn=88628c0f7cabd6cae377643824d2ffe9&scene=21#wechat_redirect)  
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
###   
  
### 电报讨论  
  
  
[]()  
  
###   
  
  
![扫码加入AI安全交流群](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2cVdntRnNdReFrEC9uicNrkrzxp72OgpNDz7srDyd0sPwPYZejHF5E9TqvpJWJ5qHkqqDtlREdb65n2YIfXD2jnNBFTqRI2LhM/640?wx_fmt=png "")  
  
  
![下载FreeBuf知识大陆APP](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX1uQ9xLm3d4ZLoKboK1GHqPxkP2twtDHay11g4CqZnzXFyjmtib8WT7iaP1Libibnib4wCE0UreN6hUMgkYJ6NP9gD2ib8g2RNFTUAj8/640?wx_fmt=png "")  
  
  
  
