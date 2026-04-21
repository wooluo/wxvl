#  警惕AI全自动攻击！Claude Opus成功构建Chrome漏洞武器化链路  
 黑白之道   2026-04-21 01:25  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6NE6mRVMVHmriaM2h4Ag3C6kRHCe2TZEcB1zDuWgyvmPUNA91x7JSic5p1Hc6aQLYBTZ3n0llk0vdZ7cqKvIhR1jqs4Tt9iaVKHOU/640?wx_fmt=png&from=appmsg "")  
  
在 Anthropic 公司发布 Mythos 和 Project Glasswing 模型引发激烈争论之际，一位安全研究人员展示了前沿 AI 技术对网络安全的实际影响。该研究突破了理论警告的局限，成功利用 Claude Opus 构建出针对 Google Chrome 复杂 V8 JavaScript 引擎的完整漏洞利用链。  
  
  
这项实验揭示了现代软件生态系统中长期存在的"补丁滞后"问题。许多基于 Electron 框架构建的流行桌面应用（如 Discord、Notion 和 Slack）都捆绑了自身的 Chromium 版本，这些版本通常比上游 Chrome 版本落后数周甚至数月，导致已知漏洞无法及时修补，使用户面临 n-day 漏洞利用攻击。  
##   
  
**Part01**  
## 漏洞组合利用过程  
  
  
研究人员选择Discord桌面应用作为测试目标，该程序运行在过时的Chrome 138引擎上。由于Discord主窗口未启用沙箱机制，攻击者只需组合两个漏洞即可完成完整利用链，无需额外突破沙箱防护。  
  
  
通过一系列引导式交互，研究人员要求Claude Opus基于特定未修补漏洞开发攻击方案。该AI成功串联两个复杂漏洞，实现了远程代码执行（RCE）：  
- **CVE-2026-5873**  
：V8 Turboshaft编译器处理WebAssembly时的越界读写漏洞（已在Chrome 147中修复）。攻击者可利用该漏洞绕过分层编译后的边界检查，实现对V8堆内存的任意操控。  
  
- **V8沙箱绕过漏洞**  
：WebAssembly代码指针表（WasmCPT）中的释放后使用（UAF）缺陷。通过破坏导入分派表并利用类型混淆，攻击代码完全逃逸了V8沙箱限制，获得对整个虚拟地址空间的读写权限。  
  
利用这些串联的漏洞原子化能力 ，模型最终生成了可重定向执行流至系统dyld缓存的攻击载荷，从而在macOS目标上执行任意系统命令。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2WicMicE75uTuaRWfzDnoMQ8ibNGHDc5FmxECdJz8LDxw4NLzVRBvPaxq7Miboqut57QLXFYeiaYJCb4NbIaZR44dj3YE1AIZVq02E/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=2 "")  
  
  
**Part02**  
## 技术局限与经济影响  
  
  
尽管成果显著，但整个过程远未实现全自动化。研究人员指出，Claude Opus需要大量人工监督、框架搭建和操作管理。该AI在长对话中频繁出现上下文丢失、依赖推测而非验证内存偏移量、陷入逻辑循环后难以自主恢复等问题。  
  
  
实验历时一周，累计消耗约23亿tokens（1765次请求），成本约2283美元，并需要20小时的人工指导。据Hacktron AI报道，研究人员必须持续向模型反馈调试器（LLDB）信息，以保持其正确方向。  
  
  
从经济角度看，AI辅助漏洞开发的投入产出比极具吸引力。相比商业漏洞赏金计划（同类漏洞通常支付上万美元）或高利润的黑市漏洞交易，花费约2300美元和数天时间生成可靠的Chrome漏洞利用方案，已具备显著盈利空间。  
  
  
**Part03**  
## 警示与展望  
  
  
这项实验为网络安全行业敲响了警钟。虽然当前Claude Opus等模型仍需专家指导才能武器化漏洞，但技术发展趋势已十分明确。随着Anthropic Mythos等具备更强推理编码能力的新一代模型出现，生成复杂漏洞利用方案的技术门槛将大幅降低。  
  
  
最终，自动化漏洞生成技术与缓慢的厂商补丁周期之间的差距不断缩小，可能导致技术能力有限的威胁行为者以前所未有的规模攻陷存在漏洞的软件系统。  
  
  
**参考来源：**  
  
Researcher Uses Claude Opus to Build a Working Chrome Exploit Chain  
  
https://cybersecuritynews.com/claude-opus-to-build-a-working-chrome-exploit-chain/  
  
  
> **文章来源：freebuf**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
