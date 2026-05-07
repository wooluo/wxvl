#  【漏洞复现】ERPNext存在模板注入（SSTI）漏洞  
 信通云服   2026-05-07 09:06  
  
# 【漏洞描述】  
# 组件介绍  
  
ERPNext 是一款基于 Python 和 Node.js开发的开源 ERP 系统，功能覆盖会计、CRM、销售、采购、库存、制造、项目管理、人力资源、网站与电商等多个模块，并且内置了中国会计科目表，在中国市场的本地化方面有一定优势。  
# 漏洞简介  
  
ERPNext v15.103.1及更早版本中的服务器端模板注入（SSTI）使拥有邮件模板创建或编辑权限的认证攻击者能够在服务器端渲染时执行任意模板表达式。攻击者可以注入恶意模板代码，在模板渲染时进行处理，可能导致代码在服务器上执行。  
# 【漏洞复现】  
  
1、创建一个邮件模板，并添加payload查询tabUser表数据  
。  
```
{{ frappe.db.sql("select * from tabUser") }}
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tOrb0WDic7iciaFAsvia0tHL6icIpXDiadoIfvV57b4ESxGML24DjbxOZYwia2K7ydDvEFYygd96rtevC9LXPuGnZ5ylxFflxjT6XcSUDdyyiamg3N0/640?wx_fmt=png&from=appmsg "")  
  
2、添加新邮件，并选择刚创建携带payload的模板，随后点击添加模板，语句成功被执行。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tOrb0WDic7icggbian3moNKycZ38KfnPWiaWicDbvFA1RcqTzh6chRtJnDRcXgQhsf2z6XY7ibYdo04ia2xH6uuLKGibHG6cIiakydWUicokvabWaEfus/640?wx_fmt=png&from=appmsg "")  
# 【修复建议】  
  
补丁版本>  
v15.103.1  
  
【  
参考链接  
】  
  
https://c0wking.hashnode.dev/ssti-in-erpnext-frappe-email-template-engine  
  
  
