#  漏洞预警 | Microsoft SharePoint远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-09-28 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-65660  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Microsoft SharePoint是由微软开发的一套协作平台和内容管理系统。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SXwCq1ryjzf7MMcj7GbibrGsAibUv1nGbUImGKn8UCEeZBgrXK9loZWhjFHmrOo01eqP1Inq1uicCupQ/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=8f73lquw&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
### CVE-2026-65660  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行任意代码  
  
**简述：**  
Microsoft SharePoint存在远程代码执行漏洞，由于其ToolPane.GetPartPreviewAndPropertiesFromMarkup()在解析WebPart标记时对Register指令与Tag标记的分离处理不当，RegisterDirective.GetHtml()在生成处理后的Register标记时未对属性值中的引号进行充分过滤，导致攻击者可通过注入双引号/单引号实现类型检查绕过。攻击者可利用该漏洞，在绕过EditingPageParser.VerifyControlOnSafeList()安全控制后注入危险命名空间与控制，结合XamlServices.Parse()、ObjectDataProvider及ExpandedWrapper等gadget实现任意代码执行，并可进一步创建无文件内存WebShell，实现持久化控制。  
  
**0x04 影响版本**  
- 16.0.0 <= Microsoft SharePoint Server Subscription Edition < 16.0.19725.20522  
  
- 16.0.0 <= Microsoft SharePoint Server 2019 < 16.0.10417.20198  
  
- 16.0.0 <= Microsoft SharePoint Enterprise Server 2016 < 16.0.5565.1001  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://msrc.microsoft.com/update-guide/zh-cn/vulnerability/  
CVE-202  
6-  
65660  
  
  
  
