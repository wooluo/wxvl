#  亿赛通-电子文档安全管理系统DecryptApplication;Servicelogin接口存在任意文件读取漏洞 附POC  
2026-3-30更新
                    2026-3-30更新  南风漏洞复现文库   2026-03-30 15:56  
  
   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 亿赛通-电子文档安全管理系统简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
亿赛通-数据泄露防护是一款专门防止您的私人数据资产在分享、存储过程中，被他人非法窃取或使用的安全产品。  
## 2.漏洞描述  
  
亿赛通-数据泄露防护是一款专门防止您的私人数据资产在分享、存储过程中，被他人非法窃取或使用的安全产品。亿赛通-电子文档安全管理系统DecryptApplication;Servicelogin接口存在任意文件读取漏洞。  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
亿赛通-数据泄露防护(DLP)  
![亿赛通-电子文档安全管理系统DecryptApplication;Servicelogin接口存在任意文件读取漏洞](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6y2mbQH5fKP4qrIn8kJnGvtvjMuANPe3e5wXfNQNOpkk2Dqpv4padJ0TibwdnImqR5RBMYbHGeKfncyxkmmIqez3dNC9bP7N7DQ/640?wx_fmt=png&from=appmsg "null")  
  
亿赛通-电子文档安全管理系统DecryptApplication;Servicelogin接口存在任意文件读取漏洞  
## 4.fofa查询语句  
  
app="亿赛通-电子文档安全管理系统"||body="/CDGServer3/index.jsp"  
## 5.漏洞复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zDdEeMJlbmRwXo3B1uSsgow2GKQaGjicHQ6ZVcaU378aLMA3ibaDGcYMUIjtiaqqbiaKLaSbd2SJIN8OdR2Gu7TCCdibszCBlagzX8/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yy65TachZib7UX7hMzZbZMJMN7QKFicEzOKHgVa2vey8ibmZT9fDJj1r2918vICfyQQuzSkmTPbicicRuuYyL2qgR4GxSwVNARtKps/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yOicdicibBYDZrJYibyxxVTyyB0Bic02AvF6LxvoErrrQlD9QcV94yl2TgU2OBa8yUU1oibrRDxJtCRaA8pZRHylicOIUOOARial7O4fw/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wED1pmWDl3QQ9cbGZibv1mdjGEyNibAg6SfcqnIjArypibRq2J3FclWR4iaKY1S0NsgGWsjaAbxm0icKcOTRF4H1jQNf9CibibjHiaBLg/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zG9wJ0QQHJLvaNFIWSqEf1iaPqLQdBj5I6FqwxgDeUm9ibPwibTvh7Tia5yyZDAVPibrVmb45AkOLSQ5YOibuAWFF1pibibJicNczV1MMQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wzCqD1D3jSXWobZdOyD9ZpqAtzeYnhYrdq0o1PEITRx9VgMcXFia2uUxARm7DALol1oKS3xqZZLNXLibFDxSIDZk2sx86LkWB4A/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yy0OEBS6Ehe9wZiaZQDH4n7iaCtVnCEJX1s7EDYZlFo81Bv6nEHXpyDbZll7mQv3NcJXXD66iaydWe8Qjd73jTOib5ibYz5ticzicIpw/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
厂商已提供漏洞修补方案，请关注厂商主页及时更新： http://www.esafenet.com/  
## 8.往期回顾  
  
  
   
  
  
  
