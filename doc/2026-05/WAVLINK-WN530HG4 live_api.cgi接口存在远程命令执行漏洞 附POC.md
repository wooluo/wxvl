#  WAVLINK-WN530HG4 live_api.cgi接口存在远程命令执行漏洞 附POC  
2026-5-12更新
                    2026-5-12更新  南风漏洞复现文库   2026-05-12 15:56  
  
   
  
#   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. WAVLINK-WN530HG4简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
WAVLINK-WN530HG4  
## 2.漏洞描述  
  
WAVLINK-WN530HG4 live_api.cgi接口存在远程命令执行漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
WAVLINK-WN530HG4  
![WAVLINK-WN530HG4 live_api.cgi接口存在远程命令执行漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/b9KQYsB8q6ycOmYambI4MHVWxbBicqRQkz0hPMTW6MHRvyPE3icAc2eCXIYd4FmHSMUtlrcjtnERAq9E359CI8GesoyGjz9ibrZsdlZ7ibTm7zg/640?wx_fmt=png&from=appmsg "null")  
  
WAVLINK-WN530HG4 live_api.cgi接口存在远程命令执行漏洞  
## 4.fofa查询语句  
  
app="WAVLINK-WN530HG4"&&body="wavlink"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yMhRTxeXgza52njQB8OwaH8OAl2ibzNrcI3fZgicjAZibaNRTQM6W2CiaVD5ricJnjmibfuCyYQgmCicL2dOdibKoLX7hqAPOj8vmpUlo/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
执行id  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wNzhMicklu17glz00qvg9iaakA5aESz27XD3EjOgB97NgdNVqUC1PTlnYHlXcWqkpL71ShQmiatnnYA31zXPVbBRYbc3lf9HQDI8/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yOR62yAQynKgrXg2YKdian2Lrpobv2vJmO1fcqfibLCAOl01bCcBYBJTQN7E3ZB1Oggib3ONVYmc8UpnwaNtNS8jc21ICB13jY60/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xDRbLyRibSVBABMAOoeSFL9rBn4WebCnRXrAkT7UEf85kpazQAmbuKiavkppcTzHwTMqhVvLbDIEcaJalGERFJRZ8zZP6HprTms/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yQovuiciaBkMOGBBoF1icuh93mGiciabK5j21IialBM9sChFx9EBXiaY8mTEbjtyqibyfHiagpsbHLuicUHDgzw89nHVdt4Kfq4cm1Q4o2s/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6weE1rBIOS9XnWKDJiaH4hiaqqQaUW9MhTjGSLhyyShnaA0W5L8D5RPuVLibEVJ93nOwmZYuhzlwyB16b4dwKm6NaMib8Dxp8WZ834/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yz2ECNtITKGZytnZLicib2TtGhpX05LYW1gbiatXjITw2PbK350QKy4OJ7ZLgpGlvUHibdraVvzWMnzw6VzSElDnPlmfvndQEUfAE/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wRKnNd8DCMB0WAzVoKqq6T6Ar9EuNVcq9ticlDv5N9wtvHWYSdJDBQSBRMSIic8PLulIa3CMaqEY2X10ve7G9Tz39W7JP84r0KM/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[Blinko plugins路径遍历漏洞存在任意文件读取漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490408&idx=1&sn=641c51ac01ffea2d1d22f90023b04778&scene=21#wechat_redirect)  
  
  
