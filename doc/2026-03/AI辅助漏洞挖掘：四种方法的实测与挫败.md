#  AI辅助漏洞挖掘：四种方法的实测与挫败  
原创 骨哥说事
                    骨哥说事  骨哥说事   2026-03-23 08:27  
  
<table><tbody><tr><td data-colwidth="557" width="557" valign="top" style="word-break: break-all;"><h1 data-selectable-paragraph="" style="white-space: normal;outline: 0px;max-width: 100%;font-family: -apple-system, system-ui, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="color: rgb(255, 0, 0);"><strong><span style="font-size: 15px;"><span leaf="">声明：</span></span></strong></span><span style="font-size: 15px;"></span></span></strong><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="font-size: 15px;"><span leaf="">文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由用户承担全部法律及连带责任，文章作者不承担任何法律及连带责任。</span></span></span></h1></td></tr></tbody></table>#   
  
#   
  
****# 防走失：https://gugesay.com/archives/5438  
  
******不想错过任何消息？设置星标****↓ ↓ ↓**  
****  
#   
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/hZj512NN8jlbXyV4tJfwXpicwdZ2gTB6XtwoqRvbaCy3UgU1Upgn094oibelRBGyMs5GgicFKNkW1f62QPCwGwKxA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZgnh4g042eOYMoNGBY8FbqQdicaEUgzWdno97dqmjy0chibfDf4Q3RyD82AMibv0kJ13ZfD4uBwJZVmvnXyhPo7aAxwufib9fibBZOE/640?wx_fmt=png&from=appmsg "")  
  
  
我测试了四种AI辅助查找漏洞的方法，持续约一周。找到了真实的漏洞——20分钟内在一个目标中确认了14个漏洞。同时也浪费了时间在一种毫无成果的方法上。  
  
  
AI确实能找到漏洞——这是真的。但它找到的哪些漏洞真正具有实际影响？那就是另一回事了。我在这里分享的所有发现都是真实的漏洞、规范违反或确实错误的做法。  
  
但当真正尝试利用它们时，大多数都站不住脚。AI在覆盖范围、假设生成和代码分析方面很快。它在影响评估、验证以及识别真正可被利用的点上表现糟糕。  
  
  
每个模型都夸大了发现。研究人员的判断是区分噪音和CVE的关键。AI不能取代安全研究人员——它是一个能力放大器，而非替代品。  
  
**注意：**  
 我没有正式的AI/ML背景。这是我第一次严肃地使用AI进行漏洞研究。请谨慎看待这些结果——你的结果可能因目标选择、设置方式、提示词和整体方法而不同。  
  
  
我特意选择了些经过加固的目标，以观察AI在压力下的表现，这影响了数据。我的一些结论可能是错误的。这仅仅是我所尝试和观察到的。  
  
  
整个过程大约花了一周半。这里展示的漏洞只是示例，并非完整列表——由于披露未完成或可能暴露特定目标等原因，部分发现被省略。  
  
  
在约一周的时间里，我测试了四种不同的AI辅助查找漏洞的方法，并发现了真正的漏洞——有些甚至是高危的。  
  
  
我也在那些毫无产出的方法上浪费了数天。本文将如实剖析哪些方法有效、哪些无效，以及AI在这个工作流中的定位。  
  
## 方法一：黑盒RFC喷洒  
  
我利用AI帮助构建测试架设，指导它朝着研究方向前进，让其系统性地映射HTTP/1.0、HTTP/1.1、代理规范和HTTP/2之间存在的RFC空白、矛盾点以及“可/应”模糊之处。  
  
  
主要关注点是HTTP/1.1。AI识别了规范不一致之处——RFC 7230 与 RFC 9110 在 Content-Length  
 处理上的分歧（首次有效 vs 末次有效）；某些规范版本中“必须拒绝”变成了“可忽略”；以及代理在哪些地方被允许表现宽松。从这些空白点出发，AI生成了载荷变体，我则在Docker实验环境中构建的23个后端服务器和代理矩阵中对它们进行了喷洒测试。  
  
  
**结果：**  
 跨23个后端服务器的55个发现，通过H1和H2→H1代理链进行测试。经过分类后：8个确认可利用（并提供端到端组合实验场景的PoC），11个路径遍历漏洞，4个逻辑漏洞，外加16台服务器和6个代理存在的古怪分块RFC违反。其中3个是误报，2个已被其他研究人员报告过。  
  
### 已确认的漏洞  
  
所有可被利用的漏洞都遵循相同的模式：AI找到解析器之间的分歧，我再在Docker实验环境中搭建代理→后端链来证明它是端到端可利用的。  
  
  
**通过 strtol(base=0) 实现的CL八进制解析。**  
 一个后端的 Content-Length  
 解析器使用了带自动基数检测的 strtol  
 函数。CL:0400  
 被读作八进制的256，而不是十进制的400。代理将其读作十进制的400，并转发了400字节的请求体。后端只消耗了256字节——剩下的144字节成为一个走私的请求。通过在**默认配置**  
下的两个主要代理得到验证——无需启用宽松模式。  
  
```
POST / HTTP/1.1Content-Length: 0400       ← 代理：十进制400。后端：八进制256。[256字节填充]GET /smuggled HTTP/1.1Host: target               ← 后端将这些剩余的144字节视为下一个请求
```  
  
**纯LF分块帧。**  
 一个后端接受纯 \n  
（没有 \r  
）作为分块行结束符。一个代理会转发纯LF分块。后端和代理在请求体边界上产生分歧——1个请求进去，2个响应出来。端到端验证。  
  
**重复TE头（首次有效）。**  
 两个TE头：TE:identity  
 + TE:chunked  
。后端采用第一个（identity  
 → 退回到CL）。一个转发两个头的代理使用了 chunked  
。请求体分帧产生分歧——通过一个代理验证了走私。  
  
**多值TE被忽略。**TE:gzip,chunked  
 —— 后端没有把逗号分隔列表中的 chunked  
 识别出来，退回到CL。代理从这个列表中解析出了 chunked  
。相同的数据不同步模式，通过同一代理验证。  
  
**头部名称含空格导致的头部截断。**  
 一个后端遇到头部名称中包含空格时，会静默丢弃该头部之后的所有头部。放在畸形头部之后的 Content-Length  
 头消失了。请求体变成了一个走私的请求。在纯H1环境下是无效的——每个代理在默认配置下都会拒绝。通过一个主流代理文档中提及的宽松模式被复活：  
```
POST / HTTP/1.1Host: targetX -Forwarded: x           ← 空格终止了后端的头部解析Content-Length: 43         ← 后端永远看不到这个头（被截断了）GET /admin HTTP/1.1        ← 这43字节没有被消耗为请求体Host: target               ← 后端将它们视为下一个请求
```  
  
代理对POST进行了ACL（访问控制列表）检查。后端处理了走私的访问 /admin  
 的GET请求。通过完整PoC演示了ACL绕过。  
  
  
**NUL字节头部拆分。**  
 一个后端在NUL字节处拆分头部。X-Foo\x00Content-Length: 50  
 变成两个独立的头部。在纯H1环境下无效——所有代理都拒绝头部中的NUL字节。通过H2降级（H2→H1）复活：一个H2→H1代理会在头部值中转发NUL字节。  
  
  
**路径遍历漏洞（分布在3个后端的11个）。**  
 反斜杠遍历（/public\..dmin  
 → /admin  
），空字节截断（/admin%00.jpg  
 → /admin  
），编码点遍历（/%2e%2e/admin  
 → /admin  
），分号剥离（/public;/../admin  
 → /admin  
），片段作为路径分隔符。这些漏洞可以通过任何代理使用——代理会转发URI路径，而不对这些模式进行规范化处理。ACL绕过的演示很简单。  
  
  
**下划线到连字符的头部规范化。**  
 两个后端在内部将头部名称中的 _  
 映射为 -  
。X_Forwarded_For  
 → X-Forwarded-For  
。那些会剥离客户端 X-Forwarded-For  
 头的代理不会剥离 X_Forwarded_For  
。通过任何代理都可以绕过代理的XFF过滤器进行IP欺骗。  
  
  
**块扩展内引号中的CRLF。**  
 RFC不允许在块扩展内的引号字符串中出现CRLF。16台服务器和6个代理没有跟踪引号状态——块扩展引号值内的CRLF被当作真正的行结束符，攻击者提供的文本会被提升为尾部头部。已广泛报告，但由于块扩展在生态系统中未得到正确实现，大多数都采用相同处理方式，因此无法被有效利用。  
### H2→H1降级测试  
  
我们还用约3600个测试用例（跨26个类别）测试了15个代理的H2→H1转换层。H2测试主要发现的是RFC违反——代理接受了它们本不该根据规范接受的东西，但实际上并未以可被利用的方式转发它们。主要价值在于复活了无效的H1漏洞：只有在具有与H1代理不同验证规则的H2代理中，才存在NUL字节头部拆分和纯CR/LF投送路径。  
  
  
一些假设是AI根据我们收集的研究材料生成的：**空的DATA帧 → 零大小分块注入。**  
 从H2规范材料中，AI推理出一个空的DATA帧（长度=0，无END_STREAM标记）在请求体中可能转化为 0\r\n\r\n  
 —— 即分块编码的终止符——从而走私其后的所有内容。  
  
  
**部分请求体后的RST_STREAM → 脏后端连接。**  
 含有CL:1000的H2 POST请求，发送200字节，然后发送RST_STREAM。代理池化了这个后端连接，下一个受害者的请求会填充剩余的请求体。实际上，代理会干净地处理RST_STREAM，不会返回脏连接——这个方法没有成功。  
### 问题所在  
  
AI没有发现任何一条可被利用的链条。是我发现的。AI找到了后端解析器漏洞并映射了哪些代理会转发什么。我连接了这些点——宽松的代理模式、触发每种行为的具体字节、端到端的链条。这就是模式：AI描绘表面，研究员构建利用链。  
  
  
它还会严重夸大结果。在最初的55个发现中，许多是纸上看起来合理但在测试中破裂的虚假链条。其中3个是完全的误报（重新测试时命中率为0）。模型会将一个载荷标记为“有效”，而实际上代理-后端组合永远不会因此发生数据不同步。我仍然不得不待在实验环境中验证每一个发现。  
  
  
它擅长映射RFC空白点、生成研究方向和寻找解析器漏洞。不擅长链接逻辑，也不擅长判断什么是真正可被利用的。可利用的链条来自手动工作。  
## 方法二：两个微调模型 + Opus大脑  
  
这是最复杂的设置。三层模型架构：一个320亿参数的“安全专家”模型，在约24000个训练对（CVE分析、攻击模式、规范空白、编码技巧）上进行了微调；一个140亿参数的“实现专家”模型，针对特定目标在代码追踪和边缘情况行为上进行了每次目标的微调；Opus作为协调器，决定向每个模型询问什么。  
  
  
目标：XML解析器。我定义了横跨11种语言生态系统的61种解析器。将所有攻击面知识整合到安全专家模型中。在约2800个载荷上测试了12种解析器。  
  
  
**结果：**  
 在12个解析器中确认了53个漏洞和147个可疑行为。**零个**  
可报告的。  
### 发现的漏洞（无法利用）  
  
数据看起来令人印象深刻：12个解析器共200个发现。这些是真实的规范违反、真实的错误行为、真实的漏洞。但我用主要的下游项目 —— SAML库、签名验证器、文档处理器 —— 测试了它们，结果没有一个漏洞在实践中是可被利用的。每一个都需要一个在真实部署中不存在的特定前提条件。   
  
  
一些它们无关紧要的例子：**通过 constructor.prototype 进行的原型污染。**  
 解析器清理了 __proto__  
 但没有清理构造器链。<constructor><prototype><isAdmin>true</isAdmin></prototype></constructor>  
 创建了一个污染工具。但利用需要下游应用程序将解析后的输出传递给像 _.merge  
 这样的深度合并工具 —— 而我检查过的使用这些解析器的主要项目并不这样做。  
  
  
**数字字符引用透传。**  
 XML §4.1规定 &#N;  
 必须被解析。多个解析器将它们作为字面字符串留下。&#60;script&#62;  
 原封不动地通过，但浏览器会解码它。仅当解析后的输出未经重新编码直接进入HTML上下文时才可被利用 —— 而我检查的下游SAML/XML签名库并不这样做。  
  
  
**接受重复属性（末次覆盖）。**  
 XML §3.1禁止重复属性。多个解析器默默地接受它们。但这要成为一个安全问题，SAML库需要依赖属性的唯一性来保证断言完整性 —— 我测试的库在提取属性前会验证签名，所以未签名内容中的重复属性没有帮助。  
  
  
**缺少属性换行符规范化。**  
 XML §3.3.3规定属性值中的LF必须替换为空格。多个解析器保留了原始换行符。这会破坏C14N和数字签名 —— 但前提是签名库和验证库使用了具有不同规范化行为的不同解析器。我测试的库对两者使用相同的解析器。  
  
  
**停用节点过早关闭。**  
 字符串常量内的 </script>  
 会跳出停止节点。这是一个直接的XSS向量 —— 但仅在HTML-in-XML配置中使用，我在检查过的下游项目中没人使用这种配置。 模式总是相同的：漏洞是真实的，规范违反是真实的，但利用的前提条件在实际的下游消费者中不存在。  
### 为何失败  
  
这是孤立地对解析器进行测试的核心问题。解析器的怪异行为只有在有下游组件危险地信任该输出时才重要。AI擅长发现怪异行为。但它无法告诉你是否有任何真实的应用程序实际走了那条路径。  
  
  
不过，微调的模型架构确实有一个真正的优势：主要的LLM大脑有更好的可见性。它可以直接向专业模型询问实现细节，例如“这个解析器是在实体扩展之后还是在之前规范化空白？”并得到基于实际代码库而非臆测的答案。推理更清晰，因为协调者可以按需以较低的代价查询领域特定知识，而无需每次都将整个代码库发送给前沿模型。当它询问原型污染时，它不是根据一般知识猜测，而是从实现专家对解析器如何实际构建输出对象的理解中获得信息。是目标选错了，而不是架构。如果我将此对准一个SAML库而非孤立的解析器，我认为结果会不同。当我有预算时，我可能会重新尝试这种方法。 微调本身不是浪费。目标选择才是。 这种方法在每个目标运行上大约花费4-6美元，但微调时间/资源/内容收集的成本要高得多，这只有在计划跨生态系统进行系统研究时才值得做。  
## 方法三：基于代码和CVE历史的假设驱动  
  
这种方法不是盲目喷洒，而是对目标进行推理：  
1. 使用tree-sitter索引目标代码库 —— 函数签名、调用图、入口点  
  
1. 总结代码结构并识别信任边界  
  
1. 从OSV.dev获取目标及其依赖项的CVE历史  
  
1. 运行行为探测 —— 在理论化之前，先进行30-50个边界情况测试以观察实际的库行为  
  
1. 基于代码模式+历史漏洞+观察到的行为，生成带有置信度级别的结构化假设  
  
1. 映射依赖项影响链 —— 如果库A有缺陷，哪些下游库继承了它？ 我在一个SAML认证库及其依赖链（7个库，涵盖XML解析、签名验证、XPath求值和会话管理）上测试了此方法。  
  
**结果：**  
 跨三次运行测试了38个假设。12个确认（31%），3个部分确认，23个被否定。 这里真正的产出是假设的质量，超过漏洞本身。每个假设不仅仅是“测试X是否存在漏洞Y”。它有结构：特定的函数、它违反了哪些假设、攻击向量以及它为何基于类似库的CVE模式提出此想法。一个假设查看了一个2021年的签名绕过CVE，追踪了修复如何改变了XPath求值，将其与当前的登出流程进行了交叉引用，并问道“这里是否存在同样的信任边界违反问题？”它引用了具体的代码行、CVE模式、被违反的假设。这种跨依赖链的跨库推理人工做需要数天时间。  
### 发现的漏洞（利用影响低）  
  
最大的区别在于深度分析步骤 —— Opus拥有10万个token的预算用于扩展思考。**基线发现（9个中/低危）：**  
- **未验证中继参数**  
 —— 开放重定向/XSS，无清理。在GET和POST绑定中都得到确认，无需认证。但依赖于应用程序级别的处理，大多数框架已经缓解。  
  
- **认证载荷没有大小验证**  
 —— 5MB base64载荷 ≈ 2.5秒CPU时间，≈30MB内存占用。零大小检查。无认证，但属于慢速资源耗尽，而非崩溃。  
  
- **跨租户证书暴露**  
 —— 多租户元数据生成中的主机头篡改泄漏一个租户的证书。需要多租户配置，大多数部署不启用。  
  
- **缓存设计迫使禁用重放保护**  
 —— 默认的缓存提供程序在集群化部署中无法工作，迫使用户完全禁用重放检查。  
  
- **异步登出竞争**  
 —— 登出URL生成是异步的，但会话销毁在该操作完成前无条件触发。  
  
- **已弃用的URL解析器差异**  
 —— url.parse  
 为重定向绑定的签名验证创建了 req.url  
/req.query  
 分歧。**深度发现（3个基线遗漏的）：**  
  
- **会话在服务提供方（SP）发起的登出后存活**  
 —— 当收到登出确认时，处理程序调用 this.pass()  
 —— 继续到下一个中间件 —— 而从未调用 req.logout()  
。用户在“登出”后，会话会无限期存活。确认：5/5的测试显示 pass_called: true  
, req_logout_called: false  
, session_still_active: true  
。但需要特定的单点登出（SLO）流程，大多数部署不采用。  
  
- **身份提供方（IdP）发起的单点登出（SLO）竞争条件**  
 —— 登出操作在会话销毁完成前发送重定向，留下一个约50ms的竞争窗口。如果会话存储写入失败，会话将存活。窗口极小，取决于存储故障。  
  
- **查询参数优先级覆盖**  
 —— 查询字符串参数无条件地优先于POST正文，允许GET参数覆盖POST绑定的消息。 漏洞是真实的。发现它们的推理过程令人印象深刻。但利用影响在整个范围内是有限的。单独来看，这些都不是我能自信地报告为漏洞的问题。  
  
### 为何失败  
  
失败最严重的地方：验证。测试用例看起来正确，但不能可靠地触发漏洞。模型会写一个PoC，声称其有效，然而却是错误的 —— 或者部分正确但断言错误。假设生成是好的。实验室工作却不是。 优秀的研究助手。糟糕的实验室伙伴。  
## 方法四：领域研究 + 前沿模型 (SECRA)  
  
与方法三完全不同。不是生成假设让AI去测试，而是完全放弃了假设生成步骤。SECRA收集领域级的研究（CVEs、攻击技术、规范违反、代码模式），并将其结构化，作为目标让前沿模型逐个进行调查。 该管道针对一个目标领域构建一个研究包：  
1. **CVE分析**  
 —— 提取该领域的每个CVE，分析根本原因、修复差异和变体角度。对于SAML，收集了所有已知实现的100个CVE。  
  
1. **技术提取**  
 —— 从博客、报告、代码提交和公告中提取具体的攻击技术。针对SAML提取了149种技术。  
  
1. **模式映射**  
 —— 25个代码级漏洞模式，包含要搜索什么、为什么是漏洞、如何测试它，以及它映射到哪些CVEs。  
  
1. **规范分析**  
 —— 映射“必须/应该”的要求、自行决定区（规范中规定为“可”且各实现存在分歧的地方）以及未定义行为。对于SAML，例如“规范没有定义多个Assertion元素时的行为”、“规范没有解决NameID值中的XML注释注入问题”、“没有定义Destination/Recipient的URL比较规则”。  
  
1. **新颖角度**  
 —— 来自现有CVE之外的攻击假设。例如，xml:base  
 属性注入以重定向Reference URI解析，或者利用内部的DTD ATTLIST  
 注入来为伪造的元素构造ID属性。 这些被打包成一个指南：选择一个模式或角度，阅读目标代码，追踪数据流，编写具体的测试，运行它，报告结果。一次一件事。不要一次扫描所有东西。 前沿模型获得所有这些作为上下文，并针对目标代码库进行处理。阅读实际的源码，编写测试工具，执行它们，检查每个模式或角度是否存在于目标中。研究是预先完成的。模型进行调查和验证，而不是理论推测。 一个需要注意的点是：我必须审查所有内容，以确保模型没有走捷径 —— 例如在测试设置中禁用安全功能、弱化配置，或者微妙地让代码更脆弱，然后“发现”它自己引入的漏洞。这确实会发生。模型想要展示结果，所以它会“为了测试”禁用签名验证、使用它自己配置的不安全默认值，或者编写一个剥离了真实库会执行的验证过程的工具。你需要验证每一个发现在真实库的真实配置中存在，而不仅仅是在模型的实验室中。不能跳过这一步。 我针对多个目标运行了这个方法。结果差异巨大，主要取决于一点：**目标此前受到安全关注的程度。**  
  
### 加固目标：一个成熟的SAML库  
  
18个发现。分类：  
- 7个是维护者有明确文档说明的设计选择  
  
- 4个是被维护者称为“按设计工作”的规范违反  
  
- 3个是不可访问的废弃代码  
  
- 2个是理论上的，没有实际可利用性  
  
- 1个是美观性问题**有1个是可报告的。**  
 一个范围过滤函数使用了字符串后缀匹配而不是域名边界匹配：  
  
```
host  = "login.notevil.com"scope = "evil.com"# Vulnerable check: is "evil.com" a suffix of "login.notevil.com"?# position("evil.com") == len("login.notevil.com") - len("evil.com")# 10 == 10 → TRUE (should be FALSE — not a domain boundary)
```  
  
攻击者位于 notevil.com  
 的IdP可以为 evil.com  
 断言范围属性。这是一个 **5%的命中率**  
。AI夸大了其他所有东西。它无法区分“这段代码做了些奇怪的事”和“这是可利用的”。每个发现都带有高置信度和听起来令人信服的详细推理。18个中的17个是噪音。  
### 新鲜目标：一个SAML库  
  
同样的工具，不同的目标 —— 一个拥有大量下载的SAML库。仍然在积极使用。只是还未受到集中的安全审查。  
#### 发现的漏洞  
  
**20分钟内确认了14个漏洞。**  
- **2个认证绕过**  
 —— 完整的SAML断言伪造，需要理解整个认证流程以及签名验证实际绑定到断言消费的位置  
  
- **CBC填充恐慌**  
 —— CBC填充验证在面对错误输入时崩溃。错误路径是可以被区分的（理论上是一个填充攻击预言者），但完整的Vaudenay解密在实践中无法利用。通过恐慌导致的拒绝服务（DoS）是真实的 —— 单个精心构造的消息即可导致无认证的崩溃。  
  
- **XSLT执行**  
 —— 攻击者可控的XSLT转换在签名验证期间执行。代码执行面。  
  
- **多个拒绝服务（DoS）向量**  
 —— 通过精心构造的SAML消息进行资源耗尽 外加研究中的3种模式也被检查并正确地排除了 —— 模型并没有在不存在漏洞的地方臆造发现。  
  
### 更深的生态系统运行  
  
在针对另一个SAML生态系统（7个库）的单独运行中，前沿模型针对每个库逐一处理研究包 —— 模式、技术、规范违反。经过分类后，有9个发现值得申请CVE，其中6个已验证并通过独立的PoC进行测试。 结构化的领域研究在这里真正产生了影响。模型不是在猜测。它是在检查来自SAML生态系统100个CVEs的已知漏洞模式是否存在于这个特定目标中。  
#### 发现的漏洞  
  
**通过错误类型泄漏导致的CBC填充崩溃。**  
 一个CBC解密函数禁用了加密库内置的填充检查，然后进行手动验证。当填充无效时，它调用了一个在作用域中不存在的回调变量 —— 抛出一个 ReferenceError  
 而不是通用的 Error  
。调用方的try/catch可以区分这些错误类型。理论上这是一个填充攻击预言者 —— 模型标记了它，因为研究包包含了来自CVE历史的Vaudenay模式，并且代码与之匹配：在 setAutoPadding(false)  
 之后进行手动填充检查。实际上，完整的解密攻击无法被利用 —— 但错误路径上的崩溃是真实的。单个精心构造的密文即可导致无认证的DoS。AI正确识别了易受攻击的代码模式；它只是高估了利用的影响。**密钥检索中的XPath注入。**  
 一个加密库从XML元素中获取URI属性，并将其直接拼接进一个XPath表达式：  
```
//\*[@Id='ATTACKER_CONTROLLED_VALUE']/\*\[...\]
```  
  
没有转义。注入一个单引号和一个联合操作符，你就可以选择任意元素作为加密密钥材料：  
```
<RetrievalMethod URI="#'] | //\*[local-name(.)='CipherValue'][1] | //\*[@Id='x" />
```  
  
**静默算法降级。**  
 一个匹配OAEP哈希算法URIs的switch语句在其case标签中使用了错误的XML命名空间。每个主流身份提供方发送的标准URI都不匹配任何case，因此它们都会进入 default: SHA-1  
 分支。每个部署都在不知不觉中为OAEP使用了SHA-1，而不是它们配置的SHA-256/512。**接受未签名的消息。**  
 为基于重定向的消息设计的签名验证函数在Signature查询参数完全缺失时返回 true  
 —— 不是“签名无效”，而是“无签名 = 有效”。未认证的攻击者发送一个没有签名的登出请求，库会接受它：  
```
GET /slo?SAMLRequest=<压缩的LogoutRequest>&RelayState=...# 没有Signature和SigAlg查询参数# hasValidSignatureForRedirect() 返回 true# 用户的会话被终止
```  
  
**通过剥离未签名属性绕过重放保护。**  
 重放保护检查外部（未签名）消息信封上的一个属性。签名的内部断言不包含此属性。从信封中剥离它 —— 签名仍然验证通过，但重放检查看到“无此属性存在”并完全跳过验证，将消息视为主动发送的。同一个签名的断言被接受多次。**通过XML注释注入进行的文本节点截断。**  
 一个XML库通过对第一个子文本节点使用 .data  
 来提取身份值。攻击者控制IdP并签署一个包含注释注入的NameID的断言。签名是有效的，因为攻击者自己签署了它。但服务提供方（SP）的身份提取只读取注释边界前的第一个文本节点：  
```
<!-- 攻击者（evil.com IdP）使用以下断言进行签名： --><NameID>admin@victim.com<!--.evil.com--></NameID><!-- 签名验证：攻击者签署，摘要匹配 ✓ --><!-- DOM .data提取："admin@victim.com"（仅第一个文本节点） --><!-- SP将攻击者认证为 admin@victim.com -->
```  
  
依赖影响链分析在这里很有用。管道追踪了加密库中的一个漏洞如何流经签名验证层进入SSO登录流程，确认了从未经验证的攻击面可以到达这个崩溃点。 是的，这些都不是像签名绕过那样重大的SAML问题，但对于加固目标来说，这些问题的情况也很特殊。  
### 其他发现  
  
使用相同的管道对其他SAML库的发现：  
- **CBC填充恐慌**  
 —— 无认证DoS，完整PoC  
  
- **压缩炸弹**  
 —— 464KB压缩后 → 350MB膨胀，2个请求杀死1GB容器  
  
- **InResponseTo重放**  
 —— 源代码中nonce删除被注释掉，响应可无限重放  
  
- **元数据签名绕过**  
 —— 未签名的元数据被接受为可信，使攻击者能注册IdP  
  
- **KeyInfo证书注入**  
 —— SAML响应中不受信的证书被用于签名验证。完整的认证绕过。  
  
- **接受过期证书**  
 —— 证书验证总是忽略过期时间。已吊销/过期证书仍被视为可信。  
  
- **双重加密断言签名绕过**  
 —— 在第二次解密循环中跳过签名验证。拥有服务提供方（SP）公钥的攻击者可以注入伪造的断言。 这些都是干净的、可报告的、具有明确影响的漏洞。  
  
### 对比  
  
同样的AI。同样的管道。同样的研究员。 一个目标：约20-30分钟内5%的命中率（发现、验证、影响分析）。另一个目标：20分钟内14个确认的漏洞。  
  
  
生态系统运行：跨越7个库的9个值得申请CVE的发现。 AI在两次运行之间并没有变得更聪明。区别在于先前的安全关注度。在那个加固的库上，所有明显的漏洞都已经被人类找到了。  
  
  
剩下的那些需要深入规范知识和真实的部署上下文：理解SAML的规范化要求，XML签名的Reference URI解析如何实际工作，当规范模糊时“按设计工作”意味着什么。AI做不到这点。   
  
  
在新鲜目标上，这些漏洞并不“容易”。认证绕过并非微不足道。只是之前没有人仔细看过。AI可以将已知的漏洞模式应用到尚未经过这些模式测试的代码上。这是它最擅长的地方。  
## 我学到了什么  
  
**目标选择 > 模型复杂度。**  
 微调模型没有发现任何可报告的成果。标准的SECRA管道在20分钟内找到了14个漏洞。区别在于我瞄准的目标，而不是模型有多聪明。****  
  
****  
**AI总是夸大发现。**  
 每种方法都有这个问题。模型无法评估影响 —— 它发现了奇怪的行为就称之为漏洞。在一个加固目标上，18个中的17个都是噪音，全部以高置信度呈现。研究员的判断是过滤器。****  
  
****  
**深度推理 > 更多载荷。**  
 扩展思考找到了基线分析遗漏的漏洞 —— 追踪代码路径，推理边界情况状态。喷洒更多测试也无法找到这些。****  
  
****  
**结构化研究 > 假设生成。**  
 向模型提供来自真实CVEs的经过验证的漏洞模式，比让其从代码中理论推测产生了更多可报告的漏洞。调查研究，而非推测。****  
  
****  
**验证仍是差距。**  
 模型会走捷径 —— 在测试设置中禁用安全功能、弱化配置，然后“发现”它自己引入的漏洞。你必须用真实库及其真实配置验证每一个发现。****  
  
****  
**新鲜目标更有胜算。**  
 同样的AI，同样的管道 —— 在加固库上5%命中率，在新鲜目标上20分钟内14个漏洞。如果你要花费算力，瞄准那些尚未受到集中安全关注的代码。****  
  
****  
**AI是使能者，而非替代者。**  
 它让你更快。它并不取代研究员。也许未来会改变。但现在，还没达到。  
## SECRA  
  
SECRA是我在所有4种方法中构建和使用的工具。它是一个上下文引擎 —— 它收集领域级的安全研究并将其打包，以便前沿模型能够系统性地处理。   
  
  
对于每个目标领域，它构建一个研究包：包含根本原因和变体角度的CVE历史、从博客/报告/提交中提取的攻击技术、代码级漏洞模式、规范分析（“必须/应该”要求、自行决定区、未定义行为），以及不来自现有CVEs的新颖攻击角度。  
  
  
模型获得这些连同目标代码库，并一次针对一个模式进行处理 —— 阅读代码、编写测试、运行它、报告结果。 本文中的每种方法都以不同的方式使用了SECRA。  
  
  
方法1使用它来映射RFC空白并生成载荷变体。  
  
方法2使用它来构建训练数据并喂养微调模型。  
  
方法3使用它进行CVE历史和代码索引以生成假设。  
  
方法4最直接地使用了它 —— 将完整的研究包喂给前沿模型。   
  
  
Sonnet处理批量工作，如CVE总结和技术提取。发现结果按生态系统/名称/版本缓存，以便跨目标重用已经分析过的依赖项。目前我有它的4个版本，等我有些预算时，我会更仔细地研究混合版本。  
## 数据总结  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;font-weight: bold;background-color: #f0f0f0;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">方法</span></span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;font-weight: bold;background-color: #f0f0f0;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">发现</span></span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;font-weight: bold;background-color: #f0f0f0;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">可报告</span></span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;font-weight: bold;background-color: #f0f0f0;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">经验教训</span></span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><strong style="font-weight: bold;color: black;"><span leaf=""><span textstyle="" style="font-size: 15px;">RFC喷洒</span></span></strong></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">23台服务器上55个发现。8个可利用（组合实验PoC），11个路径遍历，4个逻辑漏洞，16台服务器+6个代理的古怪分块</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">走私，ACL绕过，缓存中毒（已报告）</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">AI描绘表面，研究员构建利用链</span></span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><strong style="font-weight: bold;color: black;"><span leaf=""><span textstyle="" style="font-size: 15px;">微调模型</span></span></strong></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">12个解析器53个漏洞+147个可疑行为（约2800个载荷）</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">0个可报告（所有都需要不满足的前提条件）</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">目标错误，架构正确</span></span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><strong style="font-weight: bold;color: black;"><span leaf=""><span textstyle="" style="font-size: 15px;">假设引擎</span></span></strong></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">38个假设，12个确认（31%）</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">3个确认，实际影响低</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">假设优秀，验证糟糕</span></span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><strong style="font-weight: bold;color: black;"><span leaf=""><span textstyle="" style="font-size: 15px;">SECRA</span></span></strong></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">向前沿模型输入了100个CVE，25个模式，149种技术</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">跨多个目标14+个，9个值得申请CVE</span></span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;min-width: 85px;text-align: left;"><section><span leaf=""><span textstyle="" style="font-size: 15px;">领域研究 + 正确的目标 = 成果</span></span></section></td></tr></tbody></table>  
  
一周时间。有些浪费了，有些极具成效。区别从来不在AI —— 而在我瞄准的目标。AI在有明确目标时工作良好，如果你像去寻找漏洞  
这样指挥它，结果可能不会那么好。  
  
  
本文列出的漏洞是代表性示例 —— 所有方法的完整发现更为广泛。部分发现正在等待披露。一旦CVE被分配，细节将会更新。大部分发现都依赖于特定情境，这是我记录所有这一切的原因之一。  
  
  
原文：https://xclow3n.github.io/post/7/  
  
**感谢阅读，如果觉得还不错的话，动动手指给个三连吧～**  
  
