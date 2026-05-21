#  友数聚科技CPAS审计管理系统V4 doDownLoadPicFile接口存在文件读取漏洞 附POC  
2026-5-20更新
                    2026-5-20更新  南风漏洞复现文库   2026-05-20 14:55  
  
   
  
#   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 友数聚科技CPAS审计管理系统V4 简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
友数聚科技-CPAS审计管理系统  
## 2.漏洞描述  
  
友数聚科技-CPAS审计管理系统V4 doDownLoadPicFile接口存在文件读取漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
友数聚科技-CPAS审计管理系统  
![友数聚科技CPAS审计管理系统V4 doDownLoadPicFile接口存在文件读取漏洞](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6wGDWVDPEXicfjkmMgABJwdcn4vLLpkedrkZc16wPL1yDzsrB2ahZpTMrV9nFibZ4hnVdOtDTpriaSEQuo3NQSH7k4icrOARBfmjr4/640?wx_fmt=png&from=appmsg "null")  
  
友数聚科技CPAS审计管理系统V4 doDownLoadPicFile接口存在文件读取漏洞  
## 4.fofa查询语句  
  
body="/cpasm4/static/cap/font/iconfont.css"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xnBdpBn9YprbubyvxibY5tLK3OhfI8QYbWKexvhqPFmacxLBqfFibQ4ArsLBBJ9GiaUV044aRca1GBEUZP6IkB33R9y43MSBPbdI/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zx8v9rQawe1BYXM7XZnLlUgwfc7k7lUZR6JWBUguj3EhuZow5WDpZ2BwMKgwaHeTzUsZXEicWYqlkyutIr2MAjzxwkDEb2jnAQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zrVRX5TyhhfBXswOmrhtvoiaSicdzodiayaMYy6qk6IIicFIannvcOq0B9JBWJMUZRAlkXaFYDySNqvHpicvh9funE8VRH8mmbcCgA/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xgIJiceZRFmDTVfDAwProy1oTvtsFV5E98kicTZJuLiaXrvzIqdQjRia7zibKGDSATUMzvrnm1Z4XriaMAePBT1sd3s8tQKicPNjCjk0/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xzDib8v6M1mtMPg7ibT8ypoxCKoZ7If3iahEgrdlpzdjszdbaibibGSBYVUMBamPm6KwiaHcsJuV2ic8iaTDD9wLvwbibuZpX5EOPlYD74/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yMzWAtC2vxG0SdI241rmibGQSVOgJVEvURZ6WRTlibNXBzwgA6LYGIibA7SZHWYMibF7Q7pwTMKSx9Y1X9s3pUHicOQX2VQWFFQeIU/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xdPvcOEiaqqOcZacjmZiaH0PkCllNHHOr5iaPK3WLzdQY4PJXrJKwb1noQDyrS0B8w8HTawyea29I1fSLw27XLgK2LdNo0LkcehA/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
[东胜物流软件CrmProxyMailListGridSource.aspx接口存在SQL注入漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490469&idx=1&sn=64a63a1d8f7b4fd7f1cbc107c2e50826&scene=21#wechat_redirect)  
  
  
  
  
