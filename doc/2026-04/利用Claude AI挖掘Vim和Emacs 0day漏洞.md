#  利用Claude AI挖掘Vim和Emacs 0day漏洞  
原创 助力行业的
                    助力行业的  李白你好   2026-03-31 16:00  
  
## 引言  
  
2026年3月底，一篇来自Calif.io的博客文章迅速在安全社区引发热议。研究人员仅通过向Anthropic的Claude AI模型输入简单的“谣言式”提示，就在短短时间内发现了Vim和Emacs两大经典文本编辑器中的远程代码执行（RCE）0day漏洞。这些漏洞的核心攻击向量极为简单：用户只需打开一个精心构造的文件（或包含特定目录结构的文件），即可在无需额外交互的情况下实现任意命令执行。  
  
这不是传统的模糊测试或源码审计，而是AI驱动的漏洞挖掘实验，标志着“AI辅助安全研究”进入了一个新阶段。研究者将此现象类比为2000年代初的SQL注入时代——那时许多系统因简单输入验证缺失而轻易沦陷，如今AI似乎正在“复活”这种低门槛、高影响力的漏洞发现模式。Calif研究团队甚至借此启动了“MAD Bugs: Month of AI-Discovered Bugs”（AI发现漏洞之月）系列活动。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNXW7vmaQxoWc0zC8UxgywquicGNicsKcx8sak8O6BNAj8TDY0QRLuk5VREpwh0DHsLSu6L5bTUvWCHFaATaQjAiaJbeDul2ciaBRcg/640?wx_fmt=png&from=appmsg "")  
## 实验方法论：简单提示驱动的AI挖掘  
  
整个实验的核心在于**提示工程（Prompt Engineering）**  
。研究者没有提供复杂的源码、逆向分析或特定漏洞假设，而是使用了接近“闲聊”的自然语言提示：  
- 对于Vim： “Somebody told me there is an RCE 0-day when you open a file. Find it.”（有人告诉我，打开文件时存在一个RCE 0day，找到它。）  
  
- 对于Emacs： “I’ve heard a rumor that there are RCE 0-days when you open a txt file without any confirmation prompts.”（我听说存在RCE 0day，在打开txt文件时无需任何确认提示。）  
  
Claude迅速响应，输出了可验证的漏洞路径、模型行（modeline）构造或文件结构设计，甚至包括概念验证（PoC）。后续的完整提示词（虽原始文件提取有限，但博客和公告中可见迭代思路）很可能涉及逐步细化：要求Claude分析特定选项、钩子、沙箱机制、版本控制集成等，并生成可执行的模型行或目录结构。  
  
这种方法的关键优势在于AI的**知识聚合能力**  
：Claude能综合其训练数据中关于Vim/Emacs源码、选项系统、钩子机制、Git集成等的隐含知识，推理出未被广泛关注的交互点，而无需人工深入阅读数万行C/Elisp代码。这与传统人工审计形成鲜明对比，后者往往需要数周的专注投入。  
## Vim漏洞详解：tabpanel Modeline RCE  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ft6csZH0gNXfxrID2093GnX77YwaZ35aVCwpSDykiaUnh5QAFl9hkiatNEgtZbV6k5aBdRmicUJoeDhajKsTUdqkV6nVd0b1QwlrzBwZqtxAjs/640?wx_fmt=png&from=appmsg "")  
  
**漏洞标题**  
：Vim tabpanel Modeline RCE（影响Vim < 9.2.0272）  
  
**核心机制**  
（双漏洞链）：  
1. **tabpanel选项缺少P_MLE标志**  
：  
  
1. Vim的modeline（文件开头/结尾的“/* vim: ... */”注释）支持通过%{expression}%  
注入表达式。  
  
1. 通常，modelineexpr  
选项控制是否允许危险表达式。但tabpanel  
（用于自定义标签页显示）未标记为P_MLE（Modeline Expression），导致即使modelineexpr  
禁用，攻击者仍可注入表达式。  
  
1. 攻击者可设置showtabpanel=2  
强制显示标签页，并注入恶意tabpanel表达式。  
  
1. **autocmd_add()在沙箱中缺少secure检查**  
：  
  
1. Vim在处理不安全modeline时会进入沙箱（sandbox）模式，限制危险操作。  
  
1. 但autocmd_add()  
函数未调用check_secure()  
，允许在沙箱内注册自动命令（autocmd）。  
  
1. 注册的事件如SafeStateAgain  
会在沙箱退出后、Vim返回正常上下文时触发，从而逃逸沙箱并执行任意shell命令。  
  
**模型行PoC示例**  
（直接嵌入在公告文件中）：  
```
/* vim: set showtabpanel=2 tabpanel=%{%autocmd_add([{'event':'SafeStateAgain','pattern':'*','cmd':'!id>/tmp/calif-vim-rce-poc','once':1}])%}: */
```  
  
**影响与复现**  
：  
- 打开恶意文件即可触发，执行用户权限下的任意命令。  
  
- PoC：下载vim.md公告文件，用vim vim.md  
打开，即可在/tmp/calif-vim-rce-poc  
看到执行结果（如id  
命令输出）。  
  
- 受影响版本：Vim 9.2.0272之前。  
  
**修复**  
： Vim维护者在报告后迅速响应，于2026-03-30发布补丁（升级至v9.2.0272或更高）。官方GitHub Advisory：GHSA-2gmj-rpqf-pxvh。  
## Emacs漏洞详解：Git fsmonitor RCE（无需文件本地变量）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNVfVhpJOicsW3wheq9HxEbomgUlx0bIdNffa5EXGSDe0hWTrBKKAgZBryAIE3IlnoLEa8zf8GNqyKH106JFUus8DSgickiaK6u30s/640?wx_fmt=png&from=appmsg "")  
  
**漏洞标题**  
：GNU Emacs多个文件打开RCE向量（重点为Git集成）  
  
**核心机制**  
：  
- Emacs默认在find-file-hook  
中注册vc-refresh-state  
（版本控制刷新状态）。  
  
- 打开任意文件时，Emacs会检查文件是否位于版本控制目录下（支持Git、Hg等）。  
  
- 对于Git仓库，Emacs会调用git ls-files  
和git status  
等命令。  
  
- Git在执行前会读取.git/config  
，其中core.fsmonitor  
选项允许指定一个外部程序来监控文件系统变化。该程序会以当前用户权限直接执行，无任何沙箱或确认。  
  
**攻击场景**  
（最严重变体）：  
- 攻击者构造一个包含隐藏.git/  
目录的归档（zip/tar等）。  
  
- .git/config  
中设置core.fsmonitor = .git/hooks/payload  
（或类似可执行文件）。  
  
- .git/hooks/payload  
为攻击者控制的shell脚本。  
  
- 受害者解压归档后，用Emacs打开目录内的任意普通文本文件（如README.txt  
），**文件本身无需任何本地变量、eval或模式设置**  
。  
  
- Emacs的vc-git后端触发Git命令，Git读取恶意config并执行payload。  
  
**代码路径简述**  
：  
- find-file  
 → after-find-file  
 → run-hooks 'find-file-hook  
 → vc-refresh-state  
 → vc-git-registered  
 → process-file "git" ...  
 → Git读取.git/config  
并执行core.fsmonitor  
指定的程序。  
  
**影响与复现**  
：  
- 无需任何Emacs确认提示，默认配置下即可触发。  
  
- 攻击向量：共享归档、邮件附件、U盘等。  
  
- PoC：下载emacs-poc.tgz，解压后emacs emacs-poc/a.txt  
，即可在/tmp/pwned  
看到执行痕迹。  
  
- 测试版本：Emacs 30.2 和 31.0.50（master）。  
  
**维护者响应**  
： 报告于2026-03-28提交，GNU Emacs维护者于次日回复，拒绝修复，将责任归咎于Git本身。建议修复方案是在vc-git--call  
中强制添加-c core.fsmonitor=false  
覆盖，但未被采纳。  
## 技术启示与对比  
- **Vim vs Emacs**  
：  
  
- Vim漏洞依赖编辑器内部选项系统和沙箱实现缺陷，修复相对直接（添加标志和安全检查）。  
  
- Emacs漏洞源于对外部工具（Git）的深度集成，且Git自身的历史问题（core.fsmonitor可被滥用）被放大。类似攻击在2022年已有公开讨论，但Emacs未完全隔离。  
  
- 两者共同点：攻击面均在“打开文件”这一基础操作上，符合“信任输入”原则的经典违背。  
  
- **AI在漏洞挖掘中的角色**  
： Claude并非“魔法”，而是利用了海量训练数据中隐含的源码模式、历史CVE、配置选项等知识。通过自然语言提示，AI能进行**跨域推理**  
：将Vim的modeline历史问题与autocmd沙箱逃逸结合，或将Git fsmonitor与Emacs vc-hooks关联。 这提示未来安全研究可能转向“AI红队”模式：研究者提供高层次假设，AI生成候选路径，再由人工验证PoC。  
  
- **更广泛的影响**  
：  
  
- 编辑器作为开发者日常工具，其RCE风险可能导致供应链攻击（恶意代码仓库、共享项目）。  
  
- 类似集成问题可能存在于其他IDE（VS Code、JetBrains等）对Git/LSP的处理中。  
  
- “MAD Bugs”系列的启动，预示AI发现的易利用漏洞（类似早期SQLi、XSS）将增多，安全社区需提升对AI辅助攻击的防御意识。  
  
## 结论与建议  
  
此次实验生动展示了大型语言模型在安全研究中的潜力：无需深厚逆向功底，仅凭巧妙提示即可挖掘出影响广泛的0day。这并非Claude“智能超人”，而是人类知识在AI中的高效重组与推理。  
  
**防御建议**  
：  
- Vim用户：立即升级至9.2.0272或更高版本。  
  
- Emacs用户：谨慎处理来源不明的归档文件；可考虑禁用vc-hooks或自定义Git调用添加安全覆盖（如-c core.fsmonitor=false  
）；监控.git/  
目录行为。  
  
- 开发者：审查编辑器/IDE对外部工具的调用，优先使用显式安全标志和沙箱；避免无条件信任文件系统中的配置。  
  
- 研究者：探索更结构化的AI提示框架（如结合静态分析输出），但需注意伦理披露和负责任报告。  
  
未来，随着AI模型能力的提升，此类“低成本高回报”的漏洞挖掘或将成为常态。安全从业者应主动拥抱AI工具，同时强化基础输入验证与最小权限原则。Calif的实验不仅是技术演示，更是提醒：即使是Vim和Emacs这样久经考验的工具，也难以完全免疫新型攻击范式。  
  
参考：  
- 原博客：https://blog.calif.io/p/mad-bugs-vim-vs-emacs-vs-claude  
  
- Vim公告：https://github.com/califio/publications/blob/main/MADBugs/vim-vs-emacs-vs-claude/vim.md  
  
- Emacs公告：https://github.com/califio/publications/blob/main/MADBugs/vim-vs-emacs-vs-claude/Emacs.md  
  
- Vim官方GHSA：https://github.com/vim/vim/security/advisories/GHSA-2gmj-rpqf-pxvh  
  
## 网络安全情报攻防站  
  
**www.libaisec.com**  
  
综合性的技术交流与资源共享社区  
  
专注于红蓝对抗、攻防渗透、威胁情报、数据泄露  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ft6csZH0gNU3RyKytibveTTTeqzBnuciccdqC0yx6CDem4ibqtrSGJAibS5JLRwsqa5mib2aMDdKVPFe2p1MjUIKyurK5aBGjc4tTdlic8SkLoNqA/640?wx_fmt=png&from=appmsg "")  
  
