#  破解 JWT：漏洞赏金猎人指南（第六部分  
haidragon  安全狗的自我修养   2025-06-29 07:40  
  
# 官网：http://securitytech.cc/  
#   
## 通过算法混淆绕过 JWT 身份验证  
  
  
   
  
 “有时候，这不是算法的错，而是开发人员盲目地信任了算法alg。”~ Aditya Bhatt 🧠🗿  
  
欢迎回来，黑客们！这是我的“破解 JWT”系列的第六部分——一站式指南，助您在现实世界的漏洞赏金狩猎中掌握 JWT 的利用技巧。  
  
如果您错过了前面的部分，请在这里查看：   
- 第一部分 —— JWT 基础知识和弱密钥暴力破解  
- 第 2 部分 — 无算法漏洞  
- 第 3 部分 — JWKS 公钥混淆  
- 第 4 部分 — JKU 头部注入  
- 第 5 部分 — 通过标头进行路径遍历kid  
JWT 文章索引  
  
  
  
  
# 🧠 简介：算法混淆到底是什么？  
  
在 JWT 中，alg标头定义了用于签名和验证令牌的算法。通常RS256使用非对称算法，即服务器使用私钥进行签名，使用公钥进行验证。  
  
但是如果服务器盲目信任alg标头并且不强制执行严格的验证......👀我们可以将其切换到HS256对称算法，并使用服务器自己的公钥作为 HMAC 密钥来伪造令牌。  
> 这就是你如何仅使用公钥和一个偷偷摸摸的开关来冒充管理员的方法。🧙‍♂️  
  
  
  
  
JWT 身份验证绕过 第 6 篇  
  
  
  
  
# 🎯 实验室目标  
  
实验室：通过算法混淆绕过 JWT 身份验证难度：专家目标：利用 JWT 验证中的算法混淆来获取管理员访问权限并删除用户carlos。  
  
  
  
# 🧪 逐步利用（PoC）  
  
背景：从 Burp Suite 的 BApp Store 安装 JWT 编辑器扩展，以便轻松操作令牌。  
  
  
  
  
🛠️让我们开始吧……  
  
  
  
# 1. 进入实验室并登录  
  
前往实验室并使用以下凭证登录：  
  
Username: wiener    
  
Password: peter  
  
  
  
  
  
  
# 2.尝试访问/admin  
  
手动导航到/admin。您将看到如下消息：  
> “仅以管理员身份登录时才可使用管理界面。”  
  
  
  
  
  
目前还没有什么令人惊讶的事情......但这种情况即将改变。🧨  
  
  
  
# 3. 发送 /admin 到 Repeater  
  
使用 Burp捕获/admin请求并将其发送到 Repeater。我们很快就会替换此请求中的 JWT。  
  
  
  
  
  
  
# 4. 找到服务器的公钥  
  
现在在您的浏览器中，访问服务器的 JWK 端点：  
```
```  
  
从响应中复制关键对象（如果它在数组中，则省略方括号）：  
```
```  
```
```  
  
  
  
  
  
  
  
# 5. 生成恶意签名密钥  
  
在 JWT 编辑器 → 密钥选项卡中：  
- 单击“新建 RSA 密钥”  
- 粘贴复制的 JWK  
- 保存  
- 右键点击 → 将公钥复制为 PEM  
现在你已经拥有了一个闪亮的 PEM 可以用来武器了。🧨  
  
  
  
  
  
  
# 6. Base64 编码公钥  
  
转到 Burp 的解码器：  
- 粘贴 PEM  
- 编码为 Base64  
- 复制结果  
这很快就会成为你的HMAC 秘密了。真的！😈  
  
  
  
  
  
  
# 7. 使用 PEM 作为密钥创建对称密钥  
  
再次返回 JWT 编辑器 → Keys 选项卡：  
- 单击“新建对称密钥”  
- 将值替换k为 Base64 编码的 PEM  
- 节省  
轰隆隆——服务器的公钥现在就是我们的秘密了。😎  
  
  
  
  
  
  
# 8. 修改管理员访问权限的 JWT  
  
返回 Repeater → JSON Web Token 选项卡：  
- 设置"alg"为"HS256"  
- 更改"sub"为"administrator"  
- 点击签名  
- 选择上面创建的对称密钥  
- 勾选不要修改标题框  
你现在持有的是一个拥有神级访问权限的伪造令牌。🛡️  
  
  
  
  
  
  
# 9.发送令牌  
  
在中继器中点击“发送”。  
  
🎉 成功！您已以管理员身份登录——无需私钥，无需暴力破解，无需任何干扰。只需纯粹的 JWT 黑魔法。🪄💀  
  
  
  
  
  
  
# 10.删除卡洛斯  
  
现在继续将 URL 修改为：  
```
```  
  
点击“发送”。  
  
  
  
  
可怜的卡洛斯从来没有想到会发生这样的事🪦  
  
  
  
# 11.确认实验室已解决  
  
右键→在浏览器中显示→粘贴请求URL。  
  
您将收到一条甜蜜的消息，将实验室标记为✅已解决。  
  
  
   
  
  
  
  
# 🔍 刚才发生了什么？  
  
让我们分解一下：  
- 服务器需要 RS256  
- 我们发送 HS256  
- 服务器盲目接受该alg值  
- 我们使用其公钥（用于验证）作为 HMAC 密钥  
- 🔐 它像一个好的机器人一样验证了令牌。游戏结束。  
# 🚨安全影响  
- 无需私钥即可绕过身份验证  
- 管理员冒充  
- 严重漏洞  
- 完全自动化  
- 🧨 实际应用中的高严重性 CVSS  
# 🔐 缓解技巧  
- 始终alg在后端强制执行严格的值  
- 禁用多种算法的支持  
- 永远不要相信客户端提供的加密决策标头  
- 使用经过充分测试并安全配置的 JWT 库  
# 🧠 铭刻我心的教训  
- JWT 并非灵丹妙药——糟糕的实现 = 💣  
- 切勿混合使用对称和非对称算法  
- 如果你正在使用RS256，请像对待你的孩子一样对待它——不允许进行 HMAC 交换  
- 阅读 RFC——它们将秘密隐藏在显而易见的地方  
#    
  
  
  
# 🎉 黑客快乐 & 最后的话  
  
各位，第六部分就到这里了。又一个 JWT 配置错误，你的红队武器库又多了一个漏洞。保持警惕，保持好奇心——并且始终测试algheader，就像你的下一个赏金取决于它一样。  
> 直到下一次……继续打破令牌并记下名字。  
  
  
  
  
# 🔓 传奇们，祝你们黑客愉快！🧙‍♂️🗿  
  
让您的令牌始终有效，并且您的秘密始终泄露（仅向您泄露）。  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERFwEstUwtm1vDJuUhUe81vt6swbj15W6qnwhpKrXqFcarBHtqmnyKNKJoGsr5lOq3BN4uUgV8jic5Q/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
-   
- 公众号:安全狗的自我修养  
  
- vx:2207344074  
  
- http://  
gitee.com/haidragon  
  
- http://  
github.com/haidragon  
  
- bilibili:haidragonx  
  
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPMJPjIWnCTP3EjrhOXhJsryIkR34mCwqetPF7aRmbhnxBbiaicS0rwu6w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
-   
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPZeRlpCaIfwnM0IM4vnVugkAyDFJlhe1Rkalbz0a282U9iaVU12iaEiahw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
