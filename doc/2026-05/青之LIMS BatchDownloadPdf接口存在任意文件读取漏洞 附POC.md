#  青之LIMS BatchDownloadPdf接口存在任意文件读取漏洞 附POC  
2026-5-13更新
                    2026-5-13更新  南风漏洞复现文库   2026-05-13 15:48  
  
   
  
#   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 青之LIMS 简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
青之LIMS  
## 2.漏洞描述  
  
青之LIMS BatchDownloadPdf接口存在任意文件读取漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
青之LIMS  
![青之LIMS BatchDownloadPdf接口存在任意文件读取漏洞](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6xSS7F34lJNJGzpYYr9kNt14ZhiaLuJOWKjib8TYtjEiaxlKVIAXBUiarO5w8Vn2ZcK3xiamiaia3rLJialicVAQeXUtttzica4WA6fk6Yp8/640?wx_fmt=png&from=appmsg "null")  
  
青之LIMS BatchDownloadPdf接口存在任意文件读取漏洞  
## 4.fofa查询语句  
  
青之LIMS  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wj1TuM9VqoFTMicGJmIZvANSTbP4KK8p3yXa1n3SjZN7ySJHF7MmEl0wiacXicbiaKofLVZckSkbAbBMm0BMfwx9AAV6eeB6icic6ps/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zRR6XjIViaCg5nA1kqP2ChfwGeUXHJOVE5JTCfS4hibGkVxffMw3SAgrPODfct8G9KoGlTD9tGubyKBib7MFwjvD3lBjchh7SxWY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6w7mFXib3NMS8xg6yicrrxwHmvG1gE8eVCLAsgGoUtCHbcRJEABNMicF9MPjXFH3OIiaEhZHf2BBJICqMl6Bd2GKFg60N5dics9yMbg/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yzKxm2O7ZkKwFlrtjsaIib3WPeuqTdRMnPOXm3WCRSNIDz3E8qRYoK6OxH2ZrS93eF9lomR9Pb4Y0ET8rUC2Ljl7pia2Zq3AMlQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6znv5icpkKprsMujdBOrue0wIyKTP3SyOKQK33SrmRibV3EZr26YIDfl6OMy3hicN3gkTQEUWuJibXvibEdaSbjWYHGOy3rUMjAY4YY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6x3SfhkX7nDvweX6c6BZKZuzlRIqxRfibgRN0GqZ9YFjFFmR2icJKCuicpyqgf1n1KT8jlTw1oy6tJibcvFm8CHquibIfEwib7nzgEIQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xySgjZHJWOnXnwaJ5sjuWL912hPiau8PapHA1mN2tsjFnAgzvF133rVOVLrxoHng6kVyEngSKQm1ypZiaicXgkLkRHy5BUFZp9Fc/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[WAVLINK-WN530HG4 live_api.cgi接口存在远程命令执行漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490421&idx=1&sn=084da46c0ff985ad446af76e74e5b039&scene=21#wechat_redirect)  
  
  
