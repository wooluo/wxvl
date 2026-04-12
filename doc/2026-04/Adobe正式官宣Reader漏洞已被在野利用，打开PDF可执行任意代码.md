#  Adobe正式官宣Reader漏洞已被在野利用，打开PDF可执行任意代码  
原创 已卸载Adobe的
                    已卸载Adobe的  黑鸟   2026-04-11 15:30  
  
Adobe 已为 Windows 和 macOS 平台的 Adobe Acrobat 和 Reader 发布安全更新。  
  
该更新修复了一个高危漏洞，成功利用此漏洞可导致任意代码执行。  
  
Adobe 现已正式确认，同时影响Windows和MacOS双平台用户的高危漏洞CVE-2026-34621已被攻击者在野利用。  
  
  
Adobe has released a security update for Adobe Acrobat and Reader for Windows and macOS. This update addresses a critical vulnerability. Successful exploitation could lead to arbitrary code execution.  
  
 Adobe is aware of CVE-2026-34621 being exploited in the wild.  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDq6Y8Fuh3aA4qfZ4lgpVXO8YsRsw7G7U9bB3vpLa70lhsnnCupYcxFUdTGPibO1FrVIgrBfGkfvOTxs20GlE1KX0ImWhxKiarPdg/640?wx_fmt=png&from=appmsg "")  
  
https://helpx.adobe.com/security/products/acrobat/apsb26-43.html  
  
该漏洞利用可导致任意代码执行，受害者仅需打开恶意 PDF 文档即可中招，无需任何额外用户交互。  
  
  
Adobe 已发布最高级别安全预警，要求所有用户务必在 72 小时内安装此安全更新。  
  
  
Adobe 官方明确指出：Acrobat Reader 24.001.30356、26.001.21367 及更早版本存在对象原型属性控制不当修改（"原型污染"）漏洞，该漏洞可能导致攻击者在当前用户的权限上下文中执行任意代码。利用此漏洞需要用户交互，即受害者必须打开恶意制作的文件。  
  
  
Acrobat Reader versions 24.001.30356, 26.001.21367 and earlier are affected by an Improperly Controlled Modification of Object Prototype Attributes ('Prototype Pollution') vulnerability that could result in arbitrary code execution in the context of the current user. Exploitation of this issue requires user interaction in that a victim must open a malicious file.  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibO9kiauylaDrD2qA8GYLD0j29lrTfMI0Y2ttfHYhcvicSYSDuw63IiaCB8nqJWTKGzicRheYJgyKjRnTt1icicZdWtUU6KDo4M7sYyKECT9hpS8uM/640?wx_fmt=png&from=appmsg "")  
  
**Prototype Pollution(原型污染)是 JavaScript 特有的漏洞，攻击者通过修改所有对象共享的 "通用模板"，让整个程序的行为失控，最终执行任意恶意代码**  
。  
  
攻击者通过特殊构造的输入，成功修改了这个全局共享的原型对象。  
  
 一旦原型被污染，程序中所有后续创建的对象都会继承这个恶意修改，就像病毒一样扩散到整个程序。   
  
  
典型的污染过程   
  
  
1、攻击者构造一个特殊的输入，比如{"__proto__": {"evil": "恶意代码"}}   
  
2、程序没有正确过滤这个输入，直接把它合并到一个对象中   
  
3、这个操作意外地修改了全局的Object.prototype   
  
4、从此，程序中所有对象都多了一个evil属性，值为 "恶意代码"   
  
  
原型污染本身只是修改属性，但如果程序后续把被污染的属性当作函数调用，或者用在危险的操作中，就会触发代码执行。   
  
  
结合本次 Adobe Reader 漏洞（CVE-2026-34621）的具体原理  
  
  
 Adobe Reader 内置了一个 JavaScript 引擎，用于处理 PDF 中的交互功能（表单、动态内容等）   
  
恶意 PDF 文件中嵌入了特制的 JavaScript 代码   
  
当用户打开 PDF 时，这段代码会自动执行，污染全局对象原型   
  
被污染的原型会篡改 Adobe Reader 内部的特权 API 调用   
  
攻击者因此获得了执行任意代码的权限，而且是在当前用户的权限上下文中   
  
因此只需要打开 PDF 文件即可，不需要点击任何链接、按钮，也不需要启用任何额外功能   
  
  
影响范围也极广，所有 Windows 和 macOS 平台的 Adobe Acrobat/Reader 用户都受影响   
  
  
在网络安全威胁中，利用 Adobe PDF 文档发动攻击早已屡见不鲜，它们是攻击者实施社会工程学战术的主要恶意文档攻击面之一。  
  
然而，针对用于查看此类文件的 Adobe Reader 的0day漏洞利用则完全是另一回事。  
  
  
一名安全研究人员证实，威胁行为者至少  
从 2025 年 12 月开始，就一直在利用 Adobe Reader（用于查看 Adobe PDF 文件的软件）中的一个零日漏洞。  
  
该高危漏洞现已被 Adobe 正式编号为CVE-2026-34621。  
  
以开发基于沙箱的漏洞检测平台 EXPMON 而闻名的Haifei Li警告称，攻击者正在利用 "Adobe Reader 中的一个零日 / 未修补漏洞，该漏洞允许执行特权级 Acrobat 应用程序接口（API），并且已确认可在最新版本的 Adobe Reader 上生效"。  
  
如前所述，利用恶意构造的 Adobe PDF 文档发动攻击既不令人震惊也不新鲜。  
  
该漏洞利用 "在最新版本的 Adobe Reader 上即可生效，受害者仅需打开 PDF 文件，无需任何额外用户交互"，利用了 Adobe Reader JavaScript 引擎的部分功能"，并且目前在攻击中发现的文档 "包含俄语诱饵内容，涉及与俄罗斯油气行业相关的时事问题"。  
  
  
