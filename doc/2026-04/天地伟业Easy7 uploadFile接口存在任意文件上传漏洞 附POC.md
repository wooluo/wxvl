#  天地伟业Easy7 uploadFile接口存在任意文件上传漏洞 附POC  
2026-4-16更新
                    2026-4-16更新  南风漏洞复现文库   2026-04-16 17:26  
  
   
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 天地伟业Easy7简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
天地伟业Easy7  
## 2.漏洞描述  
  
天地伟业Easy7 uploadFile接口存在任意文件上传漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
天地伟业Easy7  
![天地伟业Easy7 uploadFile接口存在任意文件上传漏洞](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6wChVaFC6G3iatmEw8Y10VP9q3WjCCeaj85KnRm7LY0TWByjkUgFia5FFvo8dicUiaKXlJwM17HwUKu9Y9sYccsyXClnyvdQ3iagCyI/640?wx_fmt=png&from=appmsg "null")  
  
天地伟业Easy7 uploadFile接口存在任意文件上传漏洞  
## 4.fofa查询语句  
  
body="/Easy7/apps/WebService/LogIn.jsp"|| body="Easy7/VideoLib.EXE"|| body="/Easy7/index.html"  
## 5.漏洞复现  
  
漏洞数据包：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yL53mS3fKnOLtObmbWtpUArcnibCBjda5dCSHUAp6VAopbnT4941kDJibzDTLzibyPBzgFTsCDQYlJQ3pRdzPd7rIhlkvb1EyickQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6w1Jvia1Y2km3Lia0O4agqQukV5Iol81K1hV5o5Wibbop5sAlFRs9pEiaicULUiaaL1BzwDVnQ0FXKZrJ7PAsdFFLo2q1o505Z3umxrA/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yFnP0ljaLcAcaafG7SPXrrFkR4qej2GMp7QQ4Yx755DcZFOgMvFoB2YLliaxMnAzc66nEdnIL0AbMORSbAgt7EibVBOlE7T3jjk/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6wz2jlxAicEG3ibqaVgiabSbuZzkSz4pqe9s9KtwAQ5wBlDiazJFKtic8TbydVxF4ydFcwNMiaLbAGoBa1O6Jh9xJATnyCRf166whJ7s/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yuEiaPsfDTOrMsM8V26n3Tic3TBMNiaOOCtBQcYm27UDwODK2O8VnlykMxDWkbicq48h2vwIJz3ud8a4jFJMEYvXZyUUzlFYAQXLA/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wfM2j6bBMkkngAiaYrvaeqBMLFiaFEkByGuPNzia7tbaua0nq1EXNLIGLtKA5yfbNjbicGQ8dyvM9U9W4iaPUu0EYaicqEx9Bu8KUQI/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6z6z97CNbvfcbQmTNOd6xURUokUIoMTnVSdcoJ8UYRRqRuyuqTLlHBn4vkctkRLR0cibfYY5W5zf2myraby3jkeN0ptsLghKmFo/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zxTYmXFt9UYeXxzbE5yD4Vl5KreaI6VsIDPozDABnV2Fl8vVsibiaiaM593e7e6539qRk1KWgiasngeYdO6icDTaRROrTPmCNhG4Ro/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[博硕BGM Download.ashx接口存在任意文件读取漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490299&idx=1&sn=39b1b2eeb4c1cebb61c8058552862f57&scene=21#wechat_redirect)  
  
  
