#  DNSLOG、HTTPLOG无回显漏洞测试辅助平台 | 辅助渗透测试过程中无回显漏洞及SSRF等漏洞的验证和利用  
 黑白之道   2026-01-03 01:18  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
## 工具介绍  
  
无回显漏洞测试辅助平台 (Spring Boot + Spring Security + Netty)  
  
平台使用Java编写，提供DNSLOG，HTTPLOG等功能，辅助渗透测试过程中无回显漏洞及SSRF等漏洞的验证和利用。  
  
![DNSLOG](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icZ1W9s2Jp2Ury4jX0ybOO0IRWOqrZCRPLjiax1XqZFFR6hA8aMMX7AnNBOv3IicAQy0tLdNeabV8sOsVcfk4icGJA/640?wx_fmt=jpeg&from=appmsg&watermark=1 "")  
  
DNSLOG  
## 主要功能  
- DNSLOG  
  
- HTTPLOG  
  
- 自定义DNS解析  
  
- DNS Rebinding  
  
- 自定义HTTP Response(Response内容、状态码、Header)  
  
- 数据查询API  
  
## 部分截图  
  
![DNSLOG](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icZ1W9s2Jp2Ury4jX0ybOO0IRWOqrZCRPLjiax1XqZFFR6hA8aMMX7AnNBOv3IicAQy0tLdNeabV8sOsVcfk4icGJA/640?wx_fmt=jpeg&from=appmsg&watermark=1 "")  
  
DNSLOG  
  
![HTTPLOG](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icZ1W9s2Jp2Ury4jX0ybOO0IRWOqrZCRPlq8SDyRrsFicItY9smic2VMp5hvbBDTj9mibnhHuNDXlJfNAsiafdhlx3g/640?wx_fmt=jpeg&from=appmsg&watermark=1 "")  
  
HTTPLOG  
## API接口  
  
apiKey在登录后的API信息页面中  
#### dnslog查询接口  
  
http://xxx.xx/api/dnslog/search?token={apiKey}&keyword={test}  
  
keyword参数值必须是完整除去logAdress后的部分，此处没有模糊查询，如aaaaaa.1.dnslog.com对应keyword=aaaaaa，返回数据格式样例如下：  
```
[  {    "ip": "localhost",    "host": "test1.1.dns.xxxx.com",    "time": "2019-07-30 15:25:14.0",    "type": "A(1)"  }]
```  
#### httplog查询接口  
  
http://xxx.xx/api/weblog/search?token={apiKey}&keyword={test} keyword要求同上，返回数据格式样例如下：  
```
[  {    "path": "/",    "method": "POST",    "data": "",    "ip": "10.10.37.75",    "host": "test.1.dns.xxxx.com",    "header": "{\"content-length\":\"22896\",\"postman-token\":\"9575b873-ccd9-4d5b-ba8a-c1f746e40086\",\"host\":\"test.1.dns.xxxx.com\",\"content-type\":\"text/plain\",\"connection\":\"keep-alive\",\"cache-control\":\"no-cache\",\"accept-encoding\":\"gzip, deflate\",\"user-agent\":\"PostmanRuntime/7.13.0\",\"accept\":\"*/*\"}",    "time": "2019-07-23 17:50:10.0",    "params": null,    "version": "HTTP/1.1"  }]
```  
  
  
## 工具获取  
  
  
https://github.com/SPuerBRead/Bridge  
  
> **文章来源：夜组安全**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
