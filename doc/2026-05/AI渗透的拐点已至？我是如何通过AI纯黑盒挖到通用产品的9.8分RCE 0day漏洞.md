#  AI渗透的拐点已至？我是如何通过AI纯黑盒挖到通用产品的9.8分RCE 0day漏洞  
 赛博生存指南   2026-05-25 03:03  
  
   
  
## AI渗透的拐点已至？我是如何通过AI纯黑盒挖到通用产品的9.8分RCE 0day漏洞  
> 标题党了， 但是过程是真实的， 是我们在测试新的工具第一天发现了一个高价值0day的真实过程。  
  
> 我们让三个 DeepSeek agent 扫描一组目标。它们从公开漏洞情报中定位到攻击面，绕过了厂商对历史漏洞的修复，拿到了 RCE。我们以为这是个已知漏洞， 直到厂商确认是新的，发了奖金。CVSS 9.8。  
  
  
在今天之前很多人怀疑 AI 能替代顶级红队，我们也怀疑 AI在真实攻防场景中的能力。各种各样的开源或者创业公司的项目和介绍， 总是在靶场和CTF中， 偶尔有能投入到SRC的， 从来没有公开的黑盒挖掘到高价值漏洞的案例。 我们自己的几套系统在实战中也遇到了这个问题， **AI能挖到的漏洞往往传统扫描器也能挖到**  
，只不过AI能帮忙进行复现和验证。  
  
Anthropic 扫描生产级开源项目，找到了 500 多个漏洞，有些藏了几十年没人发现。他们后来的 Mythos Preview 在主流操作系统和浏览器中挖出了上千个高危 0day，包括一个藏了 27 年的 OpenBSD TCP 漏洞和一个藏了 16 年的 FFmpeg 编解码器缺陷。**这些是LLM擅长的领域，基于代码白盒审计**  
  
xbow 用全自动 AI 扫描拿下了 HackerOne 全球排行榜第一，提交 1,060+ 份漏洞报告，不过HackerOne 联合创始人 Michiel Prins 的评价：量产能力强，业务深度不够。Anthropic 白盒审计找到的那 500 个开源漏洞也类似，数量可观，**但没有一个需要你理解目标业务逻辑、构造多步利用链、绕过 WAF 才能打通。**  
 至于AI在高强度对抗的实战效果，目前业界还没有很好的案例。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Lf9Eic6Vdf3eCBCKzdPpibHZzw4aakagoUjTic4nkqW44D3VckwYEicQLY3v4fe3ngRGsvbjuuDHyOdesdmQoEEJ6uhrDdd7f8IRvJkjw7ONLwY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Lf9Eic6Vdf3dHNSW4HLqiccFTYHiaQn0FaWONDrQicJoQlZ3jXDicO1ibIUSXcx0MPfNicHmbvECJ8oO1zmBib552uO7XskZBZIPhickgry7z9O92f1A/640?wx_fmt=png&from=appmsg "")  
  
  
  
国内，腾讯第二届 TCH（云黑客松）可能是最接近实战，610 支参赛队伍 。我们参加了两届三个方案：第一届主要是开源的xbow的CTF题 Antix 第四，第二届更接近真实渗透场景 Bytex 第三（唯一 AK，54/54 flag）和 For Future 第七。  
  
有一个共同问题， 大部分队伍的设计， 包括我们自己的三套设计， **总是想通过某种框架去提供模型在安全方面的能力， 不管是极繁还是极简的架构， 都逃不出框架的范畴。**  
  
这次我们再次抛开了所有的任何样式的框架， 通过一个有趣的设计， 让AI首次在real world中发现了一个高价值0day。  
## 发现过程  
  
目标是一套国内使用广泛的 ERP 系统，在多次 HW 和红蓝对抗中频繁出现。我和几个做红队的朋友都审计过这套系统的源码，到 2026 年能挖的漏洞已经不多了。  
### Phase 1: 侦察（DeepSeek，~17:50）  
  
aiscan agent 收到任务后，执行了以下工具调用链：  
```
1. spray → 4个目标跑指纹/敏感文件/爬虫 → 全部失败 (yaml decoder bug)2. web_search × 7 → 搜索目标漏洞情报   └─ 命中: 多个已知 CVE (SSTI, 路径遍历, 反序列化)3. cyberhub_search → 搜索相关 POC 模板4. bash (curl) × 4 → 探测4个目标首页5. bash (curl) × 4 → 探测常见路径 (/admin /swagger /actuator /.env /.git ...)6. bash (curl) → 发现业务服务路径返回 200   └─ 4个服务端点均可达
```  
  
spray 因为 yaml 解析 bug 全部失败，但 agent 没有停下来。它切换到 web_search 搜索目标相关的公开漏洞情报，然后用 curl 逐路径探测。在发现某个路径返回 200 后，agent 进一步探测该路径下的子端点，确认了4个活跃的业务服务接口。  
  
Phase 1 产出：目标平台在线、4个业务服务端点、产品版本号、已知 CVE 列表。耗时约10分钟。  
### Phase 2: 验证（DeepSeek，~18:00）  
  
Verify agent 的工具调用链更长，也更有针对性：  
```
1. web_search × 3 → 搜索 'BinaryFormatter exploit'2. web_fetch × 4 → 抓取 POC 源码   ├─ GitHub 安全公告 → 漏洞确认   ├─ POC 合集 → 利用代码   └─ 技术分析博客 → 学到关键路由参数3. bash × 18 → 逐个验证端点   ├─ 默认口令登录尝试 → 404 (已切换OAuth2)   ├─ 文件上传接口 → 404   ├─ 路径遍历 CVE → 404 或 WAF 418   ├─ 带路由参数的服务端点 → HTTP 200 ← 行为变化   ├─ format=2 → 响应泄露: 二进制序列化已启用   └─ format=3 → 触发 DeserializeParameters 调用, 完整堆栈泄露
```  
  
这个阶段的关键转折是 agent 从一篇公开的技术分析文章中学到了一个路由参数。不带该参数时端点返回 404，带上后返回 200 并进入了服务处理管道。agent 随后测试了不同的 format  
 值，发现 format=2  
 的响应中包含配置信息——二进制序列化已启用，默认格式为 Binary。而 format=3  
 直接触发了 BinaryFormatter.Deserialize()  
 调用，服务端返回了完整的 .NET 异常堆栈。  
  
Phase 2 产出：确认 BinaryFormatter 反序列化入口、二进制序列化配置已启用、4个端点均受影响、完整的 .NET 技术栈信息泄露。  
### Phase 3: 利用尝试（DeepSeek，~18:30）  
  
Exploit agent 从公开来源找到了完整的利用方法：  
```
1. web_search × 5 → 搜索 'BinaryFormatter ysoserial exploit'2. web_fetch × 4 → 抓取实际 exploit 代码   ├─ Python RCE 脚本 (含完整 payload 构造)   └─ 完整漏洞分析 (含路由参数来源和利用原理)3. bash × 7 → 端点确认 + 参数测试4. write × 2 → 尝试写 payload 文件 → JSON 截断失败5. bash × 5 → 尝试发送 exploit → 全部截断失败
```  
  
agent 正确理解了利用链的每个环节，但在生成 payload 时遇到了 DeepSeek 模型的输出长度限制。BinaryFormatter 序列化数据经过 Base64 编码后通常有数千字节，超出了模型单次输出的 token 上限，导致 JSON 被截断。  
  
这是当前 LLM 在漏洞利用领域的一个真实边界：信息收集和漏洞理解没有问题，但精确的二进制 payload 生成不是 token 预测模型的强项。  
### Phase 4-5: 验证与 RCE（Claude Opus 4.6，~18:15-19:00）  
  
到这个阶段，三轮 DeepSeek agent 已经在 IOA Space 中积累了大量发现。人类通过 Claude Code 读取了消息图中的工具调用日志，看到了 agent 报告的反序列化入口和堆栈泄露——但这些可能是幻觉。需要用更强的模型去实际验证。  
  
切换到 Claude Opus 4.6 后，验证分为几个阶段。  
  
**确认反序列化入口。**  
 向 agent 发现的端点发送一个 System.Data.DataSet  
 的 BinaryFormatter 序列化对象：  
```
POST /[REDACTED]/ServiceGateway.svc HTTP/1.1Content-Type: application/json{"ap0":"<base64-encoded DataSet>","format":"3"}
```  
  
服务端返回：  
```
"类型'System.Data.DataSet'的对象无法转换为类型'[REDACTED].BusinessInfo'"
```  
  
这条错误说明 **** 反序列化已经成功执行——DataSet 被正确还原了，只是在后续类型转换时失败。任意 .NET 对象都会在服务端被反序列化。DeepSeek 的发现得到了确认。  
  
**WAF 规则定位。**  
 用 ysoserial.net 生成标准 gadget chain（TypeConfuseDelegate、WindowsIdentity、ClaimsPrincipal 等），全部返回 HTTP 406——存在 WAF。  
  
为了找到 WAF 的具体拦截规则，采用二分法逐步增加 payload 字节数：  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">发送字节数</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">HTTP 响应</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf=""><br/></span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">前 500 字节</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">200</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf=""><br/></span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">前 1000 字节</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">200</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf=""><br/></span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">前 1300 字节</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">200</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf=""><br/></span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">前 1356 字节</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">200</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf=""><br/></span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">前 1357 字节</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">406</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">← 触发点</span></section></td></tr></tbody></table>  
  
对偏移 1327-1367 的 hex dump：  
```
Offset 1327-1367:HEX:   39 5D 2C **** .... 63 73 2E 50 72 6F 63 65 73 73 ...ASCII: 9],[*** ...
```  
  
WAF 的检测规则是匹配序列化数据中的 ***  
 类名。所有通过 ***  
 执行命令的标准 gadget chain 都包含这个特征。  
  
不同 gadget chain 的 WAF 测试结果：  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Gadget Chain</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">包含 Process 特征</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">WAF 结果</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">TypeConfuseDelegate</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">是</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">406 拦截</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">WindowsIdentity</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">是</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">406 拦截</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">ClaimsPrincipal</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">是</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">406 拦截</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">ActivitySurrogateSelectorFromFile</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">否</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">200 通过</span></strong></td></tr></tbody></table>  
  
**WAF 绕过。**ActivitySurrogateSelectorFromFile  
 的工作原理与标准 gadget chain 不同：  
1. 1. 攻击者编写自定义 C# 类（如 ExploitClass.cs  
）  
  
1. 2. ysoserial.net 在本地编译该类，将 IL 字节码嵌入序列化数据  
  
1. 3. 服务端反序列化时通过 ActivitySurrogateSelector  
 机制加载并实例化该类  
  
1. 4. 自定义类的构造函数被执行  
  
序列化数据中不包含 System.Diagnostics.Process  
 字符串——自定义代码以 IL 字节码形式存在，WAF 的字符串匹配规则无法检测。  
  
**时间盲注确认 RCE。**  
 编写验证用的 Exploit Class：  
```
public class ExploitClass{    public ExploitClass()    {        Thread.Sleep(5000);    }}
```  
  
生成 payload 并发送：  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">测试</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">端点</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">响应时间</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">基线</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">延迟 (Δ)</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Sleep(5000)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">DevReport</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">5151ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">~150ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">+5001ms</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Sleep(5000)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">InOutData</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">5147ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">~150ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">+4997ms</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Sleep(8000)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">DevReport</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">8607ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">~150ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">+8457ms</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Sleep(8000)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">InOutData</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">8259ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">~150ms</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">+8109ms</span></section></td></tr></tbody></table>  
  
延迟量精确跟随 Thread.Sleep()  
 参数变化，排除网络抖动。  
  
**文件写入确认。**  
 最终通过 File.WriteAllText  
 向 webroot 写入验证文件，HTTP 访问确认内容正确。服务器环境：Windows Server 2022、.NET Framework 4.8、以 SYSTEM 权限运行。  
### 复盘  
  
三轮 DeepSeek agent 的工具调用统计：  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">工具</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Scan Agent</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Verify Agent</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">Exploit Agent</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">总计</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">bash (curl/scan)</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">15</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">18</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">7</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">40</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">web_search</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">7</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">4</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">5</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">16</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">web_fetch</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">0</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">7</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">4</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">11</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">cyberhub_search</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">1</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">4</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">0</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">5</span></section></td></tr></tbody></table>  
  
几个值得记录的观察。  
  
从侦察到确认反序列化入口，DeepSeek agent 用了大约20分钟和72次工具调用。整个过程中 agent 的信息来源只有三个：**搜索引擎、目标的 HTTP 响应、和公开的 POC 仓库**  
。它从公开技术文章中自主学到了关键路由参数，又通过调整 format  
 值发现了二进制序列化的配置泄露。这条从公开情报到漏洞确认的推理链是 agent 自己构建的。  
  
模型切换的时机值得讨论。DeepSeek 在信息收集和模式匹配上表现够用，成本也低。但到了需要构造精确 payload、分析二进制数据、设计 WAF 绕过方案的阶段，我们切换到了 Claude Opus 4.6。这种分层策略在实践中是有效的：用便宜模型做探索，在需要深度推理时升级。  
  
IOA 的消息图在模型切换时体现了价值。Opus 4.6 接手时不需要从零开始理解目标——**前三轮 agent 的搜索结果、HTTP 请求和响应、成功和失败的尝试全部记录在 Space 中**  
。这让切换成本接近于零。  
## 新的架构形态---从端侧agent重新出发  
> 本文不是正式工具发布， 是新架构的预告，介绍了几个核心设计。 预计6月初发布全新的智能化渗透工具 aiscan。主打   
极简、高效、实战化  
   
  
  
回到 Phase 1：agent 从公开漏洞情报中自主定位到攻击面，用 curl 逐路径探测确认了活跃端点，最终推动了整条漏洞发现链。  
  
没有人写好工作流告诉它该搜什么、该探测哪些路径。一个没有框架、没有 MCP server、没有外部编排的单文件二进制，是怎么做到的？  
### 框架是笼子  
  
前文提到，**大部分队伍的设计都逃不出框架的范畴**  
。  
  
框架的本质问题是：它在模型和工具之间插入了一个编排层——本质上都是在处理 "调哪个工具、什么顺序、什么条件分支"。但这些决策恰恰是模型最擅长的事。各种框架使用各种或简单或复杂的机制（知识管理机制、工具调用机制、推理机制、校验机制、Harness机制等等），但**一到了real world 就水土不服**  
。  
  
**框架在代替模型思考，而不是帮助模型思考。**  
  
当编排层的假设对新场景失效时（它们总会失效 ），框架就从助力变成了笼子。  
### 端侧 agent  
  
aiscan 的回答是：不做框架，做**端侧 agent**  
。受 pi-mono 的启发，整个 agent 只有 bash  
、read  
、write  
、glob  
 四个基础工具，没有编排层，所有决策由模型在运行时做出。  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf=""><br/></span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">框架思维</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">端侧思维</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">决策者</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">编排层（代码写死）</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">模型（运行时推理）</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">工具接口</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">专用 API / MCP</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">bash 伪命令</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">工具文档</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">全量注入 system prompt</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">按需读取 SKILL</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">扩展方式</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">加概念、加节点、加状态</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">不变，组合涌现</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">训练复用</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">模型需学习新协议</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">免费复用 CLI 训练数据</span></section></td></tr></tbody></table>  
### 为什么是 4 个而不是 40 个  
  
给模型注册越多的工具，它花在"选哪个工具"上的推理预算就越多，留给"解决实际问题"的就越少。  
  
工具爆炸不是在增强 agent，而是在消耗它的注意力。  
  
4 个通用工具把认知负担压到最低——模型不需要在 20 个专用工具之间做选择，只需要想"下一步该执行什么命令"。  
### SKILL：使用手册而非SOP  
  
SKILL在大部分人的思维惯性中， 将其当作一种SOP， 例如XSS Skill 就是描述XSS从头到尾怎么测试如何绕过。 我们在之前的文章中论证过， 也**通过比赛实际成绩确认了这样的SKILL用法对agent来说是负优化， 严重损害了Agent原本的泛化能力**  
。  
  
而在aiscan中， **SKILL不是SOP， 而是作为一种渐进文档发现的机制**  
， aiscan集成了一些常用的扫描器， 但是不能一次性将工具的用法注入上下文， SKILL就是一种优雅的工具文档渐进发现机制。  
## IOA: 用通讯代替记忆  
  
Phase 4 中 Opus 4.6 接手时，它没有参与前三轮的任何工作，但立刻就能看到 DeepSeek agent 搜索了什么、请求了哪些端点、哪些尝试成功了哪些失败了。  
  
传统多 agent 系统要做到这一点，需要上下文传递、状态同步、交接协议。IOA 不需要这些。要理解 IOA 的设计，得先回到一个 50 年前的理论。  
### Actor 模型：一个老问题的老答案  
  
1973 年，Carl Hewitt 提出了 Actor 模型。核心思想极其简单：**参与者之间没有共享状态，所有交互通过异步消息传递完成**  
。  
  
这个理论在当时过于超前。直到 1986 年，Ericsson 的 Joe Armstrong 用它设计了 Erlang，让电信交换机在不停机的情况下处理数百万并发呼叫——靠的就是"进程之间绝不共享内存，只通过消息通讯"。后来 Akka 把同样的理念带进了 JVM 生态，支撑起大规模分布式服务，直到golang将其彻底发扬光大。  
  
这些系统解决的问题，和今天多 agent 协作面临的问题惊人地相似：多个独立的执行单元，需要协调，需要容错，需要在其中一个崩溃时不影响其他人。  
### 从 Actor 到 Agent  
  
主流的多 agent 框架选择了另一条路：基于文件共享上下文。所有 agent 读写同一块工作空间保证一致性。  
  
IOA 认为这条路并非唯一。**用通讯代替共享内存**  
——每个 Agent 或 Human 都是一个 Node（Actor），向 Space 写入不可变消息。没有共享内存需要加锁，没有状态需要同步。  
  
消息不可变意味着任何参与者都可以"回溯"到协作历史的任意节点——这就是为什么模型切换的成本是零。**新模型不需要"交接简报"，读消息日志就够了**  
。  
  
<table><thead><tr><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf=""><br/></span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">黑板 / 共享内存</span></section></th><th align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;background: rgba(0, 0, 0, 0.05);text-align: left;"><section><span leaf="">IOA / Actor 通讯</span></section></th></tr></thead><tbody><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">状态管理</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">共享可变状态，需要加锁和共识</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">无共享状态，只有不可变消息</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">基础原语</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Task（有限状态机）</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Message（不可约原语）</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">状态表达</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">预定义枚举（pending/complete）</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">消息语义（无限状态空间）</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">参与者</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">角色不对等（人类审批/AI执行）</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">Node 等价（不区分碳基硅基）</span></section></td></tr><tr><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><strong style="color: #FA5151;font-weight: bold;font-size: inherit;"><span leaf="">上下文恢复</span></strong></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">需要交接协议</span></section></td><td align="left" style="border: 1px solid #dfdfdf;padding: 0.25em 0.5em;color: #3f3f3f;word-break: keep-all;text-align: left;"><section><span leaf="">读取消息图即可</span></section></td></tr></tbody></table>  
### Internet of Agent ---AI时代的语义协作网络  
  
协议不预定义任何状态枚举。传统协议用 pending/running/complete  
 这样的有限状态机来描述任务生命周期——本质上是在设计时赌自己能穷举所有可能的状态。这个赌注必输。  
  
IOA 让状态存在于消息内容的自然语义中。状态空间随模型的理解能力而扩展，而不是被协议设计者的想象力所限制。  
  
Agent 和 Human 在协议层没有区别，都是 Node。  
  
本案中的 Scan Agent、Verify Agent、Exploit Agent 就是这个设计的体现， 这些角色是根据上下文语义决定的， 而非我们预制的。我们没有在协议中预定义"侦察"、"验证"、"利用"三种角色——**IoA 的 Node 没有角色字段**  
。  
  
三个 agent 收到的只是自然语言描述的任务，它们呈现出的职责分工，是**语义涌现**  
的结果，不是系统硬编码的。如果明天需要加一个"社工钓鱼 agent"，不需要改协议、加角色枚举、写适配代码——只需要往 Space 里发一条消息。  
## 结语  
  
本文涉及的漏洞已通过正规渠道报告厂商，文中对目标产品做了完全脱敏处理。  
  
我们将在aiscan的正式发布的时候详细的介绍这些机制和实现。  
  
[#AI]()  
 [#红队]()  
 [#智能化渗透]()  
 [#Agent]()  
  
  
   
  
