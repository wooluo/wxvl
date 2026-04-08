#  OpenAI Codex漏洞允许攻击者窃取GitHub访问令牌  
原创 网络安全9527
                    网络安全9527  安全圈的那点事儿   2026-04-07 11:12  
  
AI编码代理的集成给开发团队带来了新的、影响巨大的攻击面。  
  
BeyondTrust旗下的Phantom Labs最近在OpenAI Codex中发现了一个严重的命令注入漏洞。该漏洞允许攻击者窃取敏感的GitHub用户访问令牌。  
  
通过利用 Codex 处理任务创建请求的方式，威胁行为者可以利用授予 AI 代理的确切权限，横向移动到组织的 GitHub 环境中。  
## 命令注入漏洞利用  
  
OpenAI Codex 是一个基于云的编码助手，可以直接连接到开发者的 GitHub 代码库。  
  
当用户提交提示时，Codex 会启动一个托管容器来运行代码生成或存储库分析等任务。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7NY458bsbJwgicJVh9upCl2bDgnBLZZvWjheOOFibX6TXJjgVZqDZUl1t9P63AVmpFCLFhNBkBqduQFPWLT7dwCZgKBcxOmfh4Yk/640?wx_fmt=png&from=appmsg "")  
  
BeyondTrust 的研究人员发现，在容器设置阶段，系统未能正确清理输入。  
  
具体来说，HTTP POST 请求中的 GitHub 分支名称参数直接传递到环境的设置脚本中。  
  
攻击者可以通过在分支名称中注入 shell 命令来利用此漏洞。例如，恶意载荷可以强制系统将隐藏的 GitHub OAuth 令牌输出到一个可读的文本文件中。  
  
攻击者随后可以指示 Codex 代理读取该文件，从而直接在 Web 界面中暴露明文令牌。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7OvO7g9nEI0XTLjmqeF5iaibOyL3M64rcakyRhezptZStozEy1IwIB1ib6sPQCv6LQMfoYRCz9k9UN2xYbG4Ook91kldMoaqGf3KI/640?wx_fmt=png&from=appmsg "")  
  
这种危险不仅限于网络门户，还蔓延到了本地开发者环境。研究人员发现，桌面版 Codex 应用程序会将身份验证凭据存储在本地的身份验证文件中。  
  
如果攻击者获得了对运行Windows、macOS 或 Linux的开发人员机器的访问权限，他们就可以窃取这些本地会话令牌。  
  
攻击者利用这些被盗用的本地令牌对后端 API 进行身份验证，即可获取用户的完整任务历史记录。  
  
通过这种后端访问权限，他们能够提取隐藏在容器任务日志深处的 GitHub 访问令牌。此外，该攻击还可以自动化，无需与 Codex 界面交互即可入侵多个用户。  
  
攻击者可以通过在共享的 GitHub 存储库中直接创建恶意分支，对使用该特定代码库的 Codex 用户触发漏洞利用。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7OJHChlTTs8C28vd3XFd9OxXLC0QAEcVezq97NSEL6jr9JVX28ITc6lZOJ6uNQa356GVjdiaM5ryXaBpdO4qfW2nwz6NM1l09SA/640?wx_fmt=png&from=appmsg "")  
  
为了绕过 GitHub 的分支命名限制（该限制会阻止标准空格），攻击者将空格替换为包含内部字段分隔符的有效载荷。  
  
他们还巧妙地利用Unicode表意空间将恶意代码隐藏在用户界面之外。对于毫无戒心的受害者来说，恶意分支看起来与标准主分支完全相同。  
  
一旦用户或自动化进程与它交互，有效载荷就会在后台静默执行，将他们的 GitHub 令牌发送到攻击者控制的外部服务器。  
## 窃取安装令牌  
  
这种自动化分支攻击也适用于自动化拉取请求。当开发者标记 Codex 机器人对拉取请求进行代码审查时，系统会启动一个代码审查容器。  
  
 如果存储库包含恶意命名的分支，则自动容器将执行隐藏的有效载荷，从而允许攻击者窃取更广泛的 GitHub 安装访问令牌。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/BicXBAdicJy7NesUsic8XXOqFQP9qrBbcSS0fWjibRjnDtz3I3JgURgAwZ534SicPHL1kRUWLPYu9BfIibTY3NvfbVn6hBqr65TnbJ1QLwHM042WY/640?wx_fmt=png&from=appmsg "")  
  
该漏洞被评为严重级别，并影响ChatGPT 网站、Codex CLI、Codex SDK 和 Codex IDE 扩展。  
  
OpenAI 于 2025 年 12 月收到负责任的披露，并在 2026 年 1 月底之前完全修复了该问题。  
  
随着 AI 编码助手深入融入开发人员的工作流程，组织必须将代理容器视为严格的安全边界。  
  
开发和安全团队应遵循以下做法：  
- 在将所有用户可控输入传递给 shell 命令之前，对其进行清理。  
- 永远不要认为外部提供商的数据格式本质上是安全的。  
- 审核授予人工智能应用程序的权限，以强制执行严格的最小权限原则。  
- 监控代码库，查找包含 shell 元字符或 Unicode 空格的异常分支名称。  
- 定期轮换 GitHub 令牌，并检查访问日志以发现异常 API 活动。  
