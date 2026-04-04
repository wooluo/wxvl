#  Progress ShareFile漏洞深度剖析：一次无需认证的远程代码执行之旅  
 幻泉之洲   2026-04-04 03:04  
  
>   
  
## 文件传输工具为何总在漏洞榜单上霸屏  
  
扫一眼CISA的已知被利用漏洞（KEV）清单，你可能会觉得这份榜单是各类文件传输解决方案的专属秀场。虽然这个想法不对（而且盯着看对眼睛不好），但文件传输工具确实因为受到威胁行为者、APT组织以及勒索软件团伙的“偏爱”，在这份清单里占据了相当大的比例。  
  
以下几起事件堪称行业标志性案例：  
- 2023年的MOVEit数据泄露事件  
- 2024年的Cleo Harmony、VLTrader和LexiCom漏洞  
- 以及2025年被神秘利用的Fortra GoAnywhere  
今天我们分析的是在Progress ShareFile中发现的一系列漏洞，如何将它们串联起来，最终实现无需任何前置身份验证的远程代码执行。  
## Progress ShareFile到底是什么  
  
它最初是思杰（Citrix）旗下的软件套件，于2024年被Progress收购。根据其官方描述，ShareFile为用户提供了一个结构化、安全的空间，便于与客户协作——共享文件、收集签名、索取数据并管理待办事项。  
  
乍看其产品描述和注册流程，你可能以为ShareFile是一家纯粹的SaaS公司，通常不在传统安全研究的范畴。这个想法只对了一半。实际上，ShareFile维护着一个名为“存储区域控制器”的本地化扩展解决方案。  
### 存储区域控制器的特殊身份  
  
简单来说，存储区域控制器是一个由客户管理的网关，它能将你的文件保留在你自己的存储（本地或云端）中，同时仍使用ShareFile的SaaS界面进行访问和管理。它负责处理安全的文件传输、身份验证和策略执行，让你能控制数据的存储位置。  
  
这有点像SaaS，因为你通过ShareFile的门户进行身份验证和管理文件，但实际的数据并不存储在ShareFile的基础设施里。它可以配置为存储在本地文件系统、SMB服务器或云存储桶等位置。这对于那些因数据主权、监管要求或纯粹出于安全习惯而无法使用ShareFile基础设施的客户来说，至关重要。  
  
那么，究竟有多少这样的实例暴露在外呢？一个快速的互联网搜索显示，大约有**30,000个**Storage Zone Controller实例直接暴露在公网上。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcjIYfkX1yYRGqPN2nxEiar2Ndna5e9lSr4LLicy5TX26L57gLC8uGVYa44XYE1udmFL0G4Ph7KhhHtPxUsIq9LSZhuo5kT2xJPg/640?wx_fmt=png&from=appmsg "")  
## 我们将讨论什么  
  
在这篇文章中，我们将分享在Progress ShareFile中发现的漏洞。利用这些漏洞，我们在一个**当时已打满官方最新补丁的系统**上，实现了无需认证的远程代码执行。  
  
具体来说，是针对以下两个漏洞的分析和串联：  
- CVE-2026-2699 / WT-2026-0006 - 身份验证绕过漏洞  
- CVE-2026-2701 / WT-2026-0007 - 远程代码执行漏洞  
ShareFile存在两个主要的应用程序分支，都运行在IIS环境中：  
- 6.x分支：基于.NET Core构建  
- 5.x分支：基于传统的ASP.NET构建  
我们发现的这两个漏洞均存在于5.x分支中。具体是在当时的**最新版本StorageCenter_5.12.3**中识别出来的。这些问题在2026年3月10日发布的5.12.4版本中得到修复。  
## 解剖ShareFile存储区域控制器  
  
我们的目标很明确：从一个完全未认证的视角，实现对一个ShareFile存储区域控制器的完全攻陷。  
  
安装过程很常规，文件位于IIS的C:\inetpub\wwwroot\ShareFile目录下。为了开始分析，我们提取并反编译了应用所有的.dll文件到C#代码。安装后，系统会从本地启动一个配置页面，要求将本地实例关联到对应的SaaS用户。我们配置了实例，使其看起来像运行在生产环境中，包括：将区域控制器连接到Progress的SaaS平台，并创建一个使用本地文件服务器（而非Progress的SaaS环境）托管文件的主区域。  
  
对于一个大型的.NET应用，我们通常先查看那些易于阅读的脚本文件（如.ashx, .aspx, .asmx），然后再去啃那些包含REST API的庞然大物——dll文件。但在深入代码之前，了解应用对不同端点请求的响应方式很重要：返回什么状态码、内容长度、内容类型是什么？直接“戳一下”应用，有时能发现代码中并不明显的特征。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibeMEmK9OeY1bSolAwaB8cwAC7mUBRgEEb6RexUuawEFOy1lRaeHN7oZvLM7DH9tUg096aqIDGicqRibbIXQ1zaUFBCA2qB2TJESw/640?wx_fmt=png&from=appmsg "")  
## 漏洞一：WT-2026-0006 身份验证绕过漏洞  
  
我们首先列出了应用内的所有.aspx文件，并向服务器发送请求以观察响应。我们寻找那些不会跳转到认证页面，或者不返回401或403状态码的“异常”端点。  
  
很快我们就注意到，像/ConfigService/Login.aspx这样的配置端点会返回HTTP 403（禁止访问）状态码，它只允许从主机本地（127.0.0.1）访问。  
  
但在浏览时，我们发现/ConfigService/Admin.aspx的响应非常反常。看看下面这个响应，你能发现哪里不对劲吗？  
  
HTTP/1.1 302 FoundCache-Control: private,no-storePragma: no-cacheContent-Type: text/html; charset=utf-8Location: /ConfigService/Login.aspx?callerpage=Admin...Content-Length: 22448Object movedObject moved to here.">... (大量页面内容被截断)  
  
当通过浏览器访问这个端点时，你会通过Location响应头被重定向到Login.aspx进行认证（如前所述，它会403）。反常之处在于：它的**响应内容长度非常大（22448字节）**，而且响应主体里包含了完整的页面内容。  
  
这很奇怪。对于不熟悉的朋友，这在某些PHP应用中曾是一种不算少见但也不常见的错误行为：开发者实现了检查认证并重定向用户的逻辑，但却忘记在重定向后退出脚本（例如die()），导致重定向发生后，脚本剩余部分及其访问的功能依然被执行。这被称为“CWE-698：重定向后执行”漏洞。  
  
朋友们，我们找到了突破口——一个身份验证绕过！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibexr870cF9CtHMn7Wrf2EUOUzUiciakbU20eicH6XbSTNFBKy4nK2bzgsYAcoicUmWNAqb969DeB5icpuvFnFhAyZBaj5dJEHic1O8TI/640?wx_fmt=png&from=appmsg "")  
### 那么，这到底意味着什么？  
  
我们来看一下。如果你有测试兴趣，完全可以用任何工具修改这个HTTP响应，把Location响应头删掉，你会发现管理面板就完整地渲染出来了。这功能看起来挺“企业级”的，对吧？  
  
删除重定向响应头后，浏览器就能正常渲染页面主体，显示出本应在认证后才能看到的管理功能。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibemAl4S9jp90CS5mKKQNg0gGVPhRlicn4Daebrr1TBvVlcojuWhVE0ibzViaibYu7ovMHMno8wPD19JokibraPxeaNtA5I5VpoibA3BE/640?wx_fmt=png&from=appmsg "")  
  
我们现在拥有了无需认证即可交互的功能。但首先，我们得从代码层面弄清楚到底是哪里出了问题。  
  
查看Admin.aspx的源码，我们发现它引用了类ConfigService.Admin。这个类的代码就在我们之前反编译的DLL里。关键的Page_Load方法大致逻辑如下：它会检查当前会话是否通过认证。如果没有认证，就会调用RedirectAndCompleteRequest方法。  
>   
> RedirectAndCompleteRequest  
>   
> CompleteRequest  
>   
  
  
简单来说，.NET为了保持与传统ASP的兼容性，设计时允许CompleteRequest之后代码逻辑（包括数据库操作等）继续运行，直到当前页面生命周期结束。但ShareFile的开发人员可能误以为调用这个方法后，页面流程就会立刻停止。这导致了我们观察到的现象：重定向发生了，但页面的其余部分依然加载了，将管理面板暴露给了未经身份验证的用户。  
  
有了这个身份验证绕过，我们就能访问配置功能了，特别是那个“网络存储位置”设置。我们进入了管理员面板。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibclW9SShicenT88z7wVt3IFgf4pnnYONN8VbBqhMia9LG1TeV8fxSBYGjAoTn8LBe4PKia1pa4JmRwcVCoodJwNzVyHYuWu7KiadMI/640?wx_fmt=png&from=appmsg "")  
## 漏洞二：WT-2026-0007 远程代码执行漏洞  
  
虽然我们绕过了认证，但尚未获得代码执行能力。接下来需要找到一条路径，将任意文件（例如一个网页后门）写入服务器的web目录。  
  
在管理员面板中，我们发现了“网络存储位置”的配置选项。这个路径是ShareFile用于存储上传文件的位置。配置时，应用会进行一系列的验证：连接测试、创建目录、写入测试文件、检查文件是否存在并删除。这些检查从功能上看是合理的，但它们缺乏关键的**安全边界检查**。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibfenPsEpaeF72xBIlP9DGicJ9f2fbjwq5tVn3kPqA6oazhV9kdcCmaGnWZhRfqLiaQjaHs4NMDQxic5wwpp7yuUcu0Iade6cco814/640?wx_fmt=png&from=appmsg "")  
  
这个验证功能的代码如下所示（简化版）。你可以看到，只要应用对这个路径有写入权限，配置就会成功。  
  
...if (File.Exists(filePath)){    File.Delete(filePath); // 如果存在，删除测试文件}...  
>   
> 任何你想要的路径  
>   
> C:\inetpub\wwwroot\ShareFile\StorageCenter\documentum  
>   
  
  
最终，我们可以引导应用程序将存储位置指向其自身的web根目录，而不是一个网络共享文件夹。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcELVwqXED8bKavx51nj7hlgPJxK1osdaBQHkN4cwfoBKSGoxnAcMBw0O4JaWkTfyRxibAM7BmBzqMJWAav89ZorwfO8YxEG9sA/640?wx_fmt=png&from=appmsg "")  
### 这算是漏洞的根源吗？  
  
这可以看作是认证后RCE的根本原因，但我们还缺少一个环节：如何上传一个能执行的网页后门。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibd248SVuh6VKrP26qNq7Y4WRRBOlHlRU1o3tWyIibfKK8JWZCEoP7f41ibiasVktE9J9ERrSNdWAeqvU98bJkIyruahUGUFm2iaF4M/640?wx_fmt=png&from=appmsg "")  
  
我们继续审查了与文件上传相关的端点。这些端点通常会使用我们刚刚控制的“网络存储位置”参数作为上传目标路径。但很快发现，这些端点普遍不适合用来上传网页后门，因为：上传的文件会被重命名为类似GUID的“随机”键值；文件的扩展名会被移除。  
  
这种设计在有基本安全意识的应用中很常见：手动重命名上传的文件，并将键值与原始文件名映射存储（例如在数据库中）。这在一定程度上可以防止路径遍历攻击。例如，在一个名为ProcessFileControl的示例上传方法中，路径在[1]处构建，文件名在[2]处添加，但这里的ShareFileFileId是一个自动生成的UUID。  
  
string text = ShareFile.StorageCenter.BusinessLogic.Configuration.TempDir + "ul-" + uploadId； // [1] 上传路径string text2 = text + fileControl.ShareFileFileId; // [2] 文件名被替换成UUID  
  
在调试器中，可以看到文件名被替换成了UUID。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibfs3dS2cqg8xDppEJNkqMkY03BdtQQFmlYBp4QKoabClc0WYHF31IIfUicziauibiazFBAfHx5WfVfuqwibvv5dibGehcIHR0nCVFe5o/640?wx_fmt=png&from=appmsg "")  
  
查看文件系统，上传的文件确实没有扩展名，名字也是随机的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibf2URcUf2iaMfT3ia4vJ5S0VRyOgDnKia40gqkww1woN6FY5ibfBmJ8VXfHicgJiafQDTcq6Pf7YjhEicbpxURZvUUh7kRWkQhAMABauY/640?wx_fmt=png&from=appmsg "")  
  
我们需要寻找其他的功能。我们最终在StorageCenter.Upload页面（通过/StorageCenter/Upload.aspx端点访问）中挖掘得更深，发现了一个有趣的细节。在Page_Load方法中，有一个unzip参数的判断。  
  
if (requestKeys["unzip"] != null && (requestKeys["unzip"] == "true" || requestKeys["unzip"] == "on")) // [1]{    flag = true;}if (flag){    num2 += Upload.UnzipFiles(..., text3, text4); // [2] 调用解压函数}  
  
在[1]处，代码根据unzip输入参数设置标志位。如果unzip被设为true，它将在[2]处调用Upload.UnzipFiles函数。  
>   
> unzip  
>   
> 被解压出来的文件不会被重命名  
>   
  
  
听着简单，但完整利用还是有些曲折。因为我们没在用户界面里找到使用这个端口的直接方法，所以不得不从零开始构造HTTP请求。上传请求的解析基于一些比较古怪的代码，我们花了不少时间才搞对格式。  
  
不过还没完。如果你仔细看那个HTTP请求示例，会发现一个奇怪的h参数。它被称为“上传密文”，你可以把它看作一种校验和。如果计算不正确，你的请求就会被拒绝。  
### 如何计算上传密文  
1. **泄漏TempData2参数**：首先，你需要泄漏内部的TempData2参数。可以通过发送带有效签名的GET /ConfigService/api/StroageZoneConfig?...请求来完成。你需要使用当前ShareFile的密钥来对该URL字符串进行HMAC-SHA256签名。由于你已经通过身份验证绕过来设置了新密钥，所以这不是什么大问题。  
1. **解密区域密钥**：泄漏出的TempData2实际上是经过Base64编码和AES加密的“区域密钥”。你可以使用硬编码的盐值和加密密钥来解密它。  
1. **计算上传请求的HMAC**：最后，使用解密出的“区域密钥”为上传请求计算HMAC-SHA256签名。你需要对请求的特定部分（如/upload.aspx?id=&uploadid=&bp=test&accountid=1&exp=）进行签名，然后将计算出的HMAC作为h参数附加到URL上。  
当你凑齐所有部件，就可以部署你的新网页后门了。它将被上传并解压到类似/files/ul-/1/这样的路径下。  
  
最终，你可以在行动中看到你的网页后门（及其上传路径）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcLib1ibQIyrEmhgapA14m8KQG3sBibasKts1XVU5pjs9acz75cS0pDhm8w4butIU5WTI19KZOVvSWVj7LhIkAxbnCuowg18bibrFs/640?wx_fmt=png&from=appmsg "")  
  
至此，我们可以将所有环节串联起来，实现完整的前置认证RCE攻击链。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdBZG6ic874FwdZBGoJiaiaBXr7AKI6Tic3vGiars6pG4nbkbQu5YtWBwrDmrZEib0XzibPLfPfxgXfzpRcKgxAs6JPwdibTFafQNIRPeg/640?wx_fmt=png&from=appmsg "")  
## 检测与修复  
  
研究人员还提供了简易的检测方法。其检测脚本的核心逻辑是尝试访问Admin.aspx，并验证响应是否：返回302状态码，且响应正文长度超过10000个字符。这足以确认系统暴露于CVE-2026-2699漏洞之下。  
>   
> 三万多个这样的实例直接暴露在互联网上  
>   
  
  
唯一的建议就是：**立即修补**。  
## 事件时间线  
<table><thead><tr><th>日期</th><th>详情</th></tr></thead><tbody><tr><td>2026年2月6日</td><td>watchTowr向Progress安全团队披露了身份验证绕过漏洞WT-2026-0006。</td></tr><tr><td>2026年2月13日</td><td>watchTowr向Progress安全团队披露了远程代码执行漏洞WT-2026-0007。</td></tr><tr><td>2026年2月16日</td><td>watchTowr提供了一个Python PoC，演示如何串联两个漏洞实现前置认证RCE。</td></tr><tr><td>2026年2月26日</td><td>Progress分配了CVE编号并请求将漏洞信息保密至4月2日。</td></tr><tr><td>2026年3月10日</td><td>Storage Zone Controller 5.12.4版本发布，已修复漏洞。</td></tr><tr><td>2026年4月2日</td><td>保密协议到期，漏洞信息公布。</td></tr></tbody></table>  
这整个案例听起来是不是有点像“瑞士奶酪”模型？每一层防御都看似存在，但恰好叠在一起的漏洞却让攻击者得以长驱直入。身份验证绕过，源于对.NET框架机制的误解；RCE，则因为功能验证忽略了安全边界。两者的结合，让一个面向高安全需求场景的解决方案变得岌岌可危。对于安全研究人员来说，这提醒我们永远不要假设“最新已修补”就等于“绝对安全”。对于企业用户而言，再次印证了那句老话：没有绝对的安全，只有持续的风险管理和响应。  
>   
  
  
