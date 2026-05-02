#  【自研工具】Zack-Vulscan 指纹驱动精准匹配Poc的Web漏洞扫描器  
原创 ZackSecurity
                    ZackSecurity  ZackSecurity   2026-05-02 02:10  
  
# 不是另一个"全端口扫描器"——而是一台精准的漏洞猎杀引擎。  
  
![version](https://mmbiz.qpic.cn/mmbiz_svg/Q3auHgzwzM6lBk71FuyDBjGemvtic1c1aqyGugWPYCsbIgb6P36biaKThUJ1mwWEffUYGv0wXI13kfbuyF5sr9ruC37TI8ojeFwbibOpYon7oibKd0M9zETcGw/640?wx_fmt=svg&from=appmsg "")  
 ![pocs](https://mmbiz.qpic.cn/mmbiz_svg/Q3auHgzwzM4eoAy2A2ue1dKWBqWzhMib3CPlBUwHibyevcfTGqicqVzarwEDKjBRkeuxUMhN6Uap1he6nxAcviaEOlJFic6NXmkRZdWGRabv1stiaOB6r3GY9FWA/640?wx_fmt=svg&from=appmsg "")  
 ![fingerprints](https://mmbiz.qpic.cn/mmbiz_svg/Q3auHgzwzM4D20NIGm7QnxSjefs4AeR2moNoF0rHuXt1LaLaB2SPg1sld1YuKPPR7DPqQjM6AD3ey1AMmWEgHGVEJ2RW7M3nIJnvUL5sCGP29gf3M8MHFA/640?wx_fmt=svg&from=appmsg "")  
 ![language](https://mmbiz.qpic.cn/mmbiz_svg/Q3auHgzwzM5RhFXqtywviaxlUmQn83sQan250UhiaWyI1tgvh2ebSH3kSCdm6BsZbnvvrYO38lkGckefxF2ezcHOcuhWedt5r9WgYYlRNZhJauIiarwP3wICQ/640?wx_fmt=svg&from=appmsg "")  
  
## 工具概况  
  
Zack-Vulscan 是一款基于  
**指纹驱动精准匹配**  
的 Web 漏洞扫描器。它在发起任何攻击之前，先通过 11,158 条指纹规则识别目标的技术栈，再利用倒排索引将 6,465 个 PoC 精确匹配到对应的技术组件，最终执行并发漏洞扫描并输出交互式 HTML + XLSX 双份报告。  
```
```  
> 全部编译为单个可执行文件（~15MB）。无需 Python 环境，无需   
pip install  
，无需 Docker。  
> **支持平台**  
：  
windows-amd64  
 ·   
linux-amd64  
 ·   
darwin-arm64  
 (Apple Silicon)  
  
### 核心工作流  
```
```  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n16" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">参数</span></span></span></th><th data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n17" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">说明</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n19" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-u</span></code></span></span></td><td data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n20" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">单个目标 URL / IP / 域名（必填，与 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-f</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 二选一）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n22" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-f</span></code></span></span></td><td data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n23" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">资产文件路径，每行一个目标（与 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-u</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 二选一）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n25" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-t</span></code></span></span></td><td data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n26" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">并发线程数（默认 50）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n28" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-timeout</span></code></span></span></td><td data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n29" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">HTTP 请求超时秒数（默认 5）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="129" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n31" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 179.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">-o</span></code></span></span></td><td data-colwidth="374" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n32" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 729.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">报告输出目录（默认 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">./output</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">）</span></span></span></td></tr></tbody></table>## 技术亮点  
1. **倒排索引 + 噪声过滤的指纹→PoC 匹配**  
：不是简单的字符串包含，而是词边界感知的双向匹配 + 30% 噪声阈值 + 单复数变体生成。匹配精度远超同类产品。  
  
1. **自研布尔表达式求值器**  
：递归下降解析，正确实现 AND > OR 优先级，支持任意嵌套括号，正则缓存优化。  
  
1. **批量 OOB 验证**  
：注册所有 OOB 子域名 → 等待 10 秒 → 一次 API 调用完成所有验证。对比逐 POC 轮询，API 调用量从 O(n) 降为 O(1)。  
  
1. **完整 DSL 引擎**  
：18+ 内置函数，支持   
contains()  
 /   
starts_with()  
 /   
ends_with()  
 /   
regex()  
 /   
len()  
 以及   
==  
 /   
!=  
 /   
>=  
 /   
<=  
 /   
>  
 /   
<  
 比较操作符。  
  
1. **自定义 XPath 提取器**  
：无需第三方 XML 库，纯 Go 实现的 HTML 节点遍历引擎，支持绝对路径、后代搜索、属性选择器、位置索引。  
  
1. **复合多请求匹配**  
：一个 PoC 多个 raw 请求时，所有响应合并后统一匹配——捕获单请求无法确认的漏洞模式。  
  
1. **智能协议探测**  
：HTTP/HTTPS 自动切换，非标准端口多策略回退。  
  
1. **连接池复用**  
：HTTP 客户端按配置缓存，  
MaxIdleConns: 100  
，避免 TCP 握手开销。  
  
## 适用场景  
- 🛡️   
**红队打点**  
：快速识别目标技术栈，只打精准 PoC  
  
- 🔍   
**安全评估**  
：批量资产漏洞巡检，自动生成双份报告  
  
- 🏗️   
**SDL 集成**  
：CI/CD 流水线中的自动化安全测试节点  
  
- 🎓   
**安全研究**  
：6,465 个 PoC 库，涵盖 20 年的 CVE 历史  
  
## 痛点：传统扫描器为什么让你白等半小时？  
  
市面上的漏洞扫描器，工作方式大同小异：拿到一个目标 → 把所有 PoC 逐个往上怼。你有 6000 个 PoC，它就发 6000 个请求；你有 100 个目标，那就是 60 万次 HTTP 交互。  
  
**问题是**  
：一个 WordPress 站点的 Log4j PoC 能打出什么？什么都打不出。它只是浪费了一个 HTTP 往返，还拖慢了整个扫描流程。  
  
这就是所谓的   
**"盲扫"困境**  
——扫描器不知道目标是什么，所以它必须假设目标是一切。  
  
**Zack-Vulscan 从根本上改变了这个公式。**  
## 核心理念：先认识，再攻击  
  
Zack-Vulscan 的工作流程可以概括为一句话：  
> **先搞清楚你是谁，再决定用什么武器对付你。**  
  
  
这不是一个"发现漏洞"的工具，而是一个  
**四阶段漏洞猎杀流水线**  
。  
## Phase 1：资产存活检测 —— 给你的目标拍一张"CT 扫描"  
  
在你对目标发起任何攻击之前，Zack-Vulscan 已经在默默地收集目标的多维度特征：  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n80" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">维度</span></span></span></th><th data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n81" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">收集方式</span></span></span></th><th data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n82" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">用途</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n84" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">HTTP 状态码</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n85" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">GET 请求返回</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n86" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">status=&#34;200&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n88" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">响应体内容</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n89" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">读取前 2MB</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n90" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">body=&#34;keyword&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n92" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">响应头</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n93" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">全量散列表</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n94" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">header=&#34;X-Powered-By&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n96" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">页面标题</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n97" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">&lt;title&gt;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 正则提取</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n98" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">title=&#34;管理后台&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n100" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Server 头</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n101" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">Server</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> header</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n102" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">server=&#34;nginx&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n104" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">TLS 证书</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n105" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Subject + Issuer</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n106" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">cert=&#34;Let&#39;s Encrypt&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="135" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n108" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 161px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">favicon.ico</span></span></strong></span></span></td><td data-colwidth="199" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n109" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">MurmurHash3(Base64)</span></span></span></td><td data-colwidth="271" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n110" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 436px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">匹配 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">icon_hash=&#34;1142584645&#34;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 指纹</span></span></span></td></tr></tbody></table>  
对，Zack-Vulscan 连目标网站的 favicon 都不会放过。很多 CMS / 框架的 favicon 哈希是独一无二的——一个哈希值就能精确识别"这是用友 NC"还是"泛微 OA"。  
### 智能协议探测  
  
目标没写协议？先试 HTTP，不通自动切 HTTPS。非标准端口也给你安排好：  
- 80 端口上 HTTP 不通 → 自动尝试同端口 HTTPS → 再尝试 443  
  
- 非标准端口 HTTP 不通 → 先切同端口 HTTPS → 再试 443  
  
整个过程对用户透明。你丢一个 IP:8080 进去，它自己会判断这到底是个 HTTP 服务还是 HTTPS 服务。  
### 布尔表达式指纹引擎  
  
Zack-Vulscan 内置了 11,158 条指纹规则，每条规则都是一个完整的布尔表达式。这不是简单的字符串匹配——这是一个  
**递归下降表达式求值器**  
，支持：  
```
```  
  
支持的操作符：  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n126" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">操作符</span></span></span></th><th data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n127" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">含义</span></span></span></th><th data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n128" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">示例</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n130" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">=</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> / </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">==</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n131" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">精确/包含匹配</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n132" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">body=&#34;hello&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n134" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">~=</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n135" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">正则匹配</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n136" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">header~=&#34;X-.*&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n138" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">!=</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n139" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">不匹配</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n140" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">status!=&#34;404&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n142" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">!~=</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n143" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">正则不匹配</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n144" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">body!~=&#34;error&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n146" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">&amp;&amp;</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n147" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">逻辑且（高优先级）</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n148" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">body=&#34;a&#34; &amp;&amp; title=&#34;b&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n150" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">\|\|</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n151" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">逻辑或（低优先级）</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n152" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">status=&#34;200&#34; \|\| status=&#34;301&#34;</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td data-colwidth="100" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n154" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 113.5px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">()</span></code></span></span></td><td data-colwidth="182" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n155" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 275.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">分组</span></span></span></td><td data-colwidth="227" style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n156" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 493px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">(a \|\| b) &amp;&amp; (c \|\| d)</span></code></span></span></td></tr></tbody></table>  
关键设计：  
**AND 天然比 OR 优先级高**  
，不需要背诵优先级表。正则表达式自动缓存到   
sync.Map  
，同一模式不重复编译。  
## Phase 2：指纹→PoC 精准匹配 —— 这才是核心壁垒  
  
Phase 2 是 Zack-Vulscan 的  
**灵魂**  
。  
### 别人怎么做？  
```
```  
### 我们怎么做？  
```
```  
  
这个流程背后有三层精妙设计：  
### 第一层：倒排索引  
  
在 PoC 加载阶段（不是扫描阶段），Zack-Vulscan 对 6,465 个 PoC 的  
**所有元数据**  
建立倒排索引：  
```
```  
  
索引结构是   
map[keyword][]POCIndex  
。当你匹配到   
Apache-Druid  
 这个指纹时，只需要查   
apache  
 和   
druid  
 两个 key，就能瞬间拿到所有包含这些词的 PoC 候选列表。  
### 第二层：噪声过滤  
  
这是最关键的一步。有些词太"通用"了——比如   
web  
、  
server  
、  
platform  
。如果不过滤，一个通用指纹会让你匹配到 80% 的 PoC。  
  
**Zack-Vulscan 的解决方案**  
：30% 噪声阈值。  
  
如果一个关键词出现在超过 30% 的 PoC 中，它被视为  
**噪声词**  
，直接跳过。这个阈值是精心调试的结果——太高会漏报，太低会误报。30% 正好卡在"有区分度"和"不太苛刻"的平衡点上。  
  
加上 28 个内置停用词（  
the  
、  
and  
、  
web  
、  
http  
、  
system  
……），确保了只有真正有辨识度的技术关键词才会触发 PoC 匹配。  
### 第三层：双向词匹配 + 单复数变体  
  
关键词   
druid  
 怎么匹配到 PoC？Zack-Vulscan 不是简单地做字符串包含，而是做  
**词边界感知的匹配**  
：  
```
```  
  
更精妙的是  
**单复数变体生成**  
：  
```
```  
  
支持的变体规则：  
- -ies  
 →   
-y  
（  
technologies  
 →   
technology  
）  
  
- -es  
 → 去掉，再试   
-s  
（  
services  
 →   
service  
，再试   
servic  
）  
  
- -s  
 → 去掉（  
servers  
 →   
server  
）  
  
这就是为什么你匹配到   
Apache-Tomcat-Servers  
 时，也能找到 tag 为   
tomcat  
 的 PoC。  
### 验证环节：六字段任意命中  
  
倒排索引给了你一组候选，但候选可能有几十个。最终验证时，关键词会与 PoC 的  
**七个字段**  
进行任意匹配（OR 策略）：  
1. **PoC ID**  
：精确匹配（比如   
CVE-2021-44228  
）  
  
1. **文件名**  
：词边界匹配  
  
1. **标签**  
：双向词包含（  
tag  
 含   
kw  
 或   
kw  
 含   
tag  
）  
  
1. **产品名**  
：双向词包含  
  
1. **厂商名**  
：双向词包含  
  
1. **CPE**  
：字符串包含  
  
1. **PoC 名称**  
：词边界匹配  
  
七个字段中  
**任意一个**  
命中就算匹配。这意味着：  
- 指纹名是   
Spring  
 → 产品名为   
Spring Framework  
 的 PoC 能匹配到 ✓  
  
- 指纹名是   
华为-USG6000  
 → 厂商名含   
huawei  
 的 PoC 能匹配到 ✓  
  
- 指纹名是   
CVE-2023-3452  
 → ID 精确为   
CVE-2023-3452  
 的 PoC 能匹配到 ✓  
  
### 通用漏洞补充：不放过任何一个盲点  
  
指纹匹配精准，但有一个问题：有些漏洞跟产品无关——XSS、SQL 注入、目录遍历、备份文件泄露，它们可能出现在任何 Web 应用上。  
  
所以 Zack-Vulscan 在指纹匹配之后，会  
**自动追加 ~85 个通用 PoC**  
。这些 PoC 满足三个条件：  
1. 没有产品/厂商绑定  
  
1. 所有标签都是漏洞类型关键词（  
xss  
、  
sqli  
、  
ssrf  
……共 140+ 词）  
  
1. 位于通用漏洞分类目录下  
  
这意味着即使目标指纹匹配不上任何特定 PoC，基本的 XSS、敏感文件泄露、管理面板暴露等通用检查  
**一个都不会少**  
。  
## Phase 3：并发漏洞执行 + OOB 带外验证  
  
匹配到精确的 PoC 后，执行引擎  
**完全对标 Nuclei 规范**  
：支持   
raw:  
 原生 HTTP 请求和结构化请求，3 种爆破模式（batteringram / pitchfork / clusterbomb），22 个动态函数（  
rand_int  
、  
md5  
、  
base64_encode  
 等），5 种匹配器（word / regex / status / dsl / binary），均支持反向匹配。变量替换引擎自动注入   
{{BaseURL}}  
、  
{{Hostname}}  
、  
{{Port}}  
 等内置变量，  
**5 种提取器**  
（regex / dsl / json / kval / xpath）可在多步请求间传递数据。  
### Flow 多步执行链 + 复合匹配  
  
Zack-Vulscan 支持   
**881 个多步 PoC**  
，通过   
flow: http(1)&&http(2)||http(3)  
 布尔表达式串联步骤——比如先登录提取 Token，再携带 Token 访问敏感接口。同一 PoC 的多个   
raw  
 请求还会进行  
**复合匹配**  
：所有响应合并后统一检查，捕获单请求无法确认的漏洞模式。  
### 批量 OOB 带外验证  
  
Log4j、SSRF、JNDI 等无回显漏洞依赖 DNSLog 验证。传统做法是每个 PoC 逐次轮询 cEye API——6000 个 OOB PoC 就是 6000 次 API 调用。  
**Zack-Vulscan 的做法**  
：所有 PoC 并发执行时，OOB 子域名统一注册到   
BatchTracker  
；全部执行完毕后等待 10 秒，  
**一次 API 调用**  
同时查询 DNS 和 HTTP 记录，O(1) 哈希匹配回注册表，批量产出已验证的漏洞结果。API 调用量从 O(n) 降为 O(1)。未配置 DNSLog 时，OOB 依赖的 PoC 会被自动跳过，不会产生无法验证的误报。  
## Phase 4：双份报告 —— 有面子也要有里子  
### HTML 漏洞报告  
  
交互式单页 HTML，每个漏洞一行：  
- **点击序号**  
展开/折叠完整的 HTTP 请求-响应对  
  
- 多步 PoC 显示编号的请求/响应序列（Request 1 ↔ Response 1, Request 2 ↔ Response 2...）  
  
- 颜色编码的严重级别徽章：Critical（红）/ High（橙）/ Medium（黄）/ Low（绿）/ Info（蓝）  
  
- 完整的 HTTP 报文内容，包括所有头部，便于安全研究人员复核  
  
### XLSX 资产报告  
- **存活资产表**  
：URL、页面标题、HTTP 状态码、匹配到的所有指纹名称  
  
- 指纹资产优先排列，未识别的资产列在末尾  
  
- 自动列宽调整，左对齐排版  
  
两份报告，一份给客户炫耀，一份给团队复盘。  
## 对比：Zack-Vulscan vs 传统扫描器  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n258" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">维度</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n259" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">传统扫描器</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;border-width: 1px 1px 0px;border-bottom-style: initial;border-bottom-color: initial;font-weight: bold;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;margin: 0px;"><span cid="n261" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Zack-Vulscan</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n263" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">PoC 选择策略</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n264" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">全部执行</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n266" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">指纹自动匹配</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n268" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">100 目标的扫描量</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n269" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">N × 6000+</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n271" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">N × 3~15（指纹匹配后）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n273" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">误报率</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n274" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">中-高</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n276" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">极低</span></span></strong></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">（精准匹配 + OOB 验证）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n278" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">技术栈适配</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n279" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">无感知</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n281" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">自动识别 11,158 种技术栈</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n283" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">OOB 验证</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n284" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">通常不支持</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n286" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">批量轮询（1 次 API）</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n288" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">多步漏洞链</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n289" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">不支持</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n291" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">881 个 Flow 多步链</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n293" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">指纹规则表达能力</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n294" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">简单字符串</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n296" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">布尔表达式 + 正则 + 9 种字段</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n298" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">favicon 指纹</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n299" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">不支持</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n301" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">MurmurHash3 哈希匹配</span></span></strong></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border-top: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n303" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 265.5px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">输出报告</span></span></strong></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n304" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 182.5px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">文本 / JSON</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n306" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 434px;min-height: 10px;"><span md-inline="strong" style="box-sizing: border-box;"><strong style="box-sizing: border-box;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">交互式 HTML + XLSX 资产表</span></span></strong></span></span></td></tr></tbody></table>## 快速开始  
```
```  
### 配置文件  
  
编辑   
config.json  
 启用 cEye DNSLog：  
```
```  
  
不配置？没关系，OOB 依赖的 PoC 会自动跳过，不会产生误报。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/D5oXMbxlRk3frYiaImo5jQic4jGnyxuPmkbH52MynIzctVpe0qYicibwr7smgsm55ahb1SeDR7VZNskl03Gn10ufVsyKynDRY13wADia4jNuwiaIM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/D5oXMbxlRk1cjeyGEVdgndLNaiaNs8qWxbuofknHHAbEPcdypfmmGCwSgkiblOTmSrtcZ4ZYlYwtEHzVQEn145ibXJ2IbWHOgTZSrzlBX0ib3Z8/640?wx_fmt=png&from=appmsg "")  
## 写在最后  
  
Zack-Vulscan 的设计哲学从来不是"扫得全"，而是  
**"扫得准"**  
。  
  
在一个 PoC 数量指数级增长的时代，盲目堆砌 PoC 已经没有意义。真正有价值的，是  
**在正确的时间、对正确的目标、发送正确的 Payload**  
。  
  
而这，就是指纹→PoC 匹配引擎存在的全部意义。  
## 工具获取  
  
Zack-Vulscan 工具性能已经达到商用水准，请加入星球下载。  
知识星球后续会更新全套红队自研工具：外网打点->免杀上线->提权->横向移动。目前已经更新有 Zack-AI-Scanner v2.0 和   
Zack-Vulscan 两款打点工具  
。新成员仅需  
 66 元即可加入星球，后续人员到 100 人后提升费用为 88 元。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/D5oXMbxlRk1KmzkFAkCv1rsibGAoSthurNwkZ4x9EUzO4rygicTdHDZfE8W4hoIM6FVPoqkkRYYbnC38ibGQFG4b0jvj5JXqhyIGib3FjtlB5zc/640?wx_fmt=jpeg&from=appmsg "")  
  
