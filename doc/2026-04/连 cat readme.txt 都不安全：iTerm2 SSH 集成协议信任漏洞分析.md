#  连 cat readme.txt 都不安全：iTerm2 SSH 集成协议信任漏洞分析  
Calif
                    Calif  securitainment   2026-04-30 04:54  
  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://blog.calif.io/p/mad-bugs-even-cat-readmetxt-is-not</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Calif</span></section></td></tr></tbody></table>  
在此前一篇 AI 发现的漏洞 系列文章中，我们以 Vim 和 Emacs 为对象，分析了看似无害的工作流如何能以出人意料的方式触发代码执行。这次，我们把问题推进一步：cat readme.txt  
安全吗？  
  
结果是：如果你用的是 iTerm2，并不安全。  
  
这乍看起来难以置信——直到你了解 iTerm2 为某项合法功能的设计逻辑、它如何使用 PTY，以及当终端输出能够伪装成该功能协议的一端时会发生什么。  
> 特此鸣谢 OpenAI 与我们共同参与本项目。  
  
## 背景：iTerm2 的 SSH 集成  
  
iTerm2 具备 SSH 集成功能，可对远程会话建立更丰富的理解。实现这一功能时，iTerm2 会在远端引导启动一个名为 conductor 的小型辅助脚本，对远程 shell 的操作远超向其"盲目键入命令"的层面。  
  
运作模式大致如下：  
1. iTerm2 启动 SSH 集成，通常通过 it2ssh  
完成。  
  
1. iTerm2 通过现有 SSH 会话将远程引导脚本 (conductor) 传送至远程端。  
  
1. 该远程脚本成为 iTerm2 的协议通信方。  
  
1. iTerm2 与远程 conductor 交换终端转义序列，协调以下操作：  
  
1. 探测登录 shell  
  
1. 检测 Python  
  
1. 切换目录  
  
1. 上传文件  
  
1. 执行命令  
  
关键在于：整个机制不依赖任何独立的网络服务。conductor 仅是运行于远程 shell 会话内的脚本，协议通过普通的终端 I/O 传输。  
## PTY 基础回顾  
  
终端最初是真实的硬件设备：一块键盘和屏幕连接到主机，程序从该设备读取输入、向其写入输出。  
  
iTerm2 这类终端模拟器，是上述硬件终端的现代软件形态。它负责渲染屏幕、接收键盘输入，并解析终端控制序列。  
  
然而，shell 及其他命令行程序仍期望与一个看起来像真实终端设备的对象通信。为此，操作系统提供了 PTY (pseudoterminal，伪终端)。PTY 是旧硬件终端的软件替代，位于终端模拟器与前台进程之间。  
  
在一次标准 SSH 会话中：  
- iTerm2 将字节写入 PTY  
  
- 前台进程是 ssh  
  
- ssh  
将这些字节转发至远端主机  
  
- 远端 conductor 从其 stdin 读取这些字节  
  
因此，当 iTerm2 需要"向远端 conductor 发送命令"时，其本地实际执行的操作是将字节写入 PTY。  
## conductor 协议  
  
SSH 集成协议以终端转义序列作为传输载体。  
  
以下两点是关键：  
- DCS 2000p  
用于挂接 SSH conductor  
  
- OSC 135  
用于传递帧封装前的 conductor 消息  
  
在源码层面，DCS 2000p  
触发 iTerm2 实例化一个 conductor 解析器。该解析器随后接受如下 OSC 135  
消息：  
- begin <id>  
- 命令输出行  
  
- end <id> <status> r  
- unhook  
因此，合法的远端 conductor 可完全通过终端输出与 iTerm2 通信。  
## 核心漏洞  
  
该漏洞本质上是一个信任失效问题。iTerm2 会接受来自终端输出的 SSH conductor 协议，即使该输出并非来自真实可信的 conductor 会话。换言之，不可信的终端输出可以冒充远程 conductor。  
  
这意味着恶意文件、服务器响应、banner 或 MOTD 均可输出：  
- 伪造的 DCS 2000p  
钩子  
  
- 伪造的 OSC 135  
回复  
  
而 iTerm2 便会按真实 SSH 集成交换的流程运作。这便是该漏洞的利用原语。  
## 漏洞利用的实际原理  
  
该漏洞利用文件包含一段伪造的 conductor 会话记录。  
  
当受害者执行：  
```
cat readme.txt
```  
  
iTerm2 会渲染该文件，但文件内容并非纯文本。它包含：  
1. 一行伪造的 DCS 2000p  
指令，用于声明一个 conductor 会话  
  
1. 伪造的 OSC 135  
消息，用于响应 iTerm2 的请求  
  
一旦钩子被接受，iTerm2 便启动其正常的 conductor 工作流程。在上游源码中，Conductor.start()  
会立即发送 getshell()  
，成功后再发送 pythonversion()  
。  
  
因此，漏洞利用无需主动注入上述请求——iTerm2 自身会发出这些请求，恶意输出只需伪装成相应的回复即可。  
## 遍历状态机  
  
伪造的 OSC 135  
消息内容极简，但精确到位。  
  
它们的作用如下：  
1. 为 getshell  
启动命令体  
  
1. 返回形似 shell 探测输出的行  
  
1. 以成功状态结束该命令  
  
1. 为 pythonversion  
启动命令体  
  
1. 以失败状态结束该命令  
  
1. 解除挂钩  
  
这已足够将 iTerm2 推入其正常的回退流程。此时，iTerm2 认为已完成足够多的 SSH 集成工作流步骤，可以继续执行下一步：构建并发送 run(...)  
命令。  
## sshargs的作用  
  
伪造的 DCS 2000p  
钩子包含若干字段，其中包括攻击者可控的 sshargs  
。  
  
该值至关重要，因为 iTerm2 随后在构造 conductor 的 run ...  
请求时，会将其作为构造命令的原始输入。  
  
该漏洞利用代码选取 sshargs  
的方式，使得当 iTerm2 对以下内容进行 base64 编码：  
  
run   
  
最后 128 字节的块恰好变为：  
  
ace/c+aliFIo  
  
这个字符串并非随意选取。选择它的原因在于，它同时满足以下两个条件：  
- conductor 编码路径的有效输出  
  
- 有效的相对路径名  
  
## PTY 混淆：漏洞利用得以实现的根源  
  
在合法的 SSH 集成会话中，iTerm2 将 base64 编码的 conductor 命令写入 PTY，由 ssh  
转发至远端 conductor。在漏洞利用场景下，iTerm2 仍向 PTY 写入这些命令，但实际上并不存在真正的 SSH conductor。本地 shell 直接将这些命令作为普通输入接收。  
  
这就是会话录制中呈现如下内容的原因：  
- getshell  
以 base64 形式出现  
  
- pythonversion  
以 base64 形式出现  
  
- 随后出现一段经过 base64 编码的 run ...  
载荷  
  
- 最后一段为 ace/c+aliFIo  
  
靠前的数据段作为无效命令执行失败。若该路径在本地存在且具有可执行权限，最后一段则会执行成功。  
## 复现步骤  
  
可使用 genpoc.py  
复现基于文件的原始 PoC：  
```
python3 genpoc.py
unzip poc.zip
cat readme.txt
```  
  
执行后生成：  
- ace/c+aliFIo  
，一个可执行的辅助脚本  
  
- readme.txt  
，一个包含恶意 DCS 2000p  
与 OSC 135  
序列的文件  
  
前者诱使 iTerm2 与伪造的 conductor 通信。后者在最终数据块到达时，向 shell 提供可实际执行的内容。  
  
要使漏洞利用生效，需在包含 ace/c+aliFIo  
的目录下执行 cat readme.txt  
，从而使由攻击者构造的最终数据块解析为真实的可执行路径。  
## 披露时间线  
- 3 月 30 日：我们向 iTerm2 报告了该漏洞。  
  
- 3 月 31 日：该漏洞已在提交 a9e745993c2e2cbb30b884a16617cd5495899f86  
中修复。  
  
- 截至撰写本文时，该修复尚未进入稳定版本。  
  
补丁提交合并后，我们尝试仅凭该补丁从头重建漏洞利用。此过程所用的提示词记录于 prompts.md  
，最终生成的利用脚本为 genpoc2.py  
，其工作方式与 genpoc.py  
非常相似。  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
