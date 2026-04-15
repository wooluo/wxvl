#  博硕BGM Download.ashx接口存在任意文件读取漏洞 附POC  
2026-4-15更新
                    2026-4-15更新  南风漏洞复现文库   2026-04-15 16:57  
  
   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 博硕BGM 接口简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
博硕BGM  
## 2.漏洞描述  
  
博硕BGM Download.ashx 存在任意文件读取漏洞，攻击者可进行文件读取，获取重要敏感配置信息。  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
博硕BGM  
![博硕BGM Download.ashx接口存在任意文件读取漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/b9KQYsB8q6yicLejUSkibF4tVoJib3Mmx0BmVD51a5kWHrYJVufL4PSWzJ4jFzvLJmdjvAASGicOdgj5Q8J9WuzbpAWqxmttRJPnb4trZovwBBA/640?wx_fmt=png&from=appmsg "null")  
  
博硕BGM Download.ashx接口存在任意文件读取漏洞  
## 4.fofa查询语句  
  
body="Libs/Platform.lib"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xibqqSjVpBsI1WmwYpkjmicTDvfibZh6bhQE5gUfbhhTbicA9AjAKiaNAROmkZgLrW1UvDu3wpnnsrx83NZIkQEIhUtoPk4K5HbNM0/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wQia9djnb2mClPvFGUbPfBpiaVDgt80OiaZ3ksJLsZjzU4BdxwhMcLnXboyJ1RJUKKqm4ew2eaQxgGH5j7ABesdZ6eJjnO5QQEDg/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xXt0h9cDicGLZYRAuib7jH4FfTzxwodoHyqoDZI98aB5iaWaqo6QoVp76ah99jaJbCEHtaPUnZMfmKhic8cwAVURDg6smPJib4znI8/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yj86kUYrWiblAcAr4p0hHJXJg5d05rRDM4xhKOtsKUIRia4xKPo6QgDjcYdYyf9mEdeN3pddHsxILKZqLGClXUN5AZibowr7fwicE/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yPa51C0AbpnQxVr6rI4rezq6icsYwjb4x8pDtcktfYy3QCBgiacp5ibamo5aJWzvg6kj2yqDI9SKPSBuZpTTCNu6Rh3heoD9997w/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6wg0UxHyWagLVvIQ0CsKG2GPDav8ysaAiaX5hmbZepuwrkDtl2XJfsXxj2Z6PhyKElaCV2bq6yOCMHWfemSU5SYGhSHhTh9DyS4/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xH6flv7M3AfVVMxE4NDJh8740gJhDwesL06fQVQTlsDpZaQuGstItrW25mubBCqD22kvyibsFyOqcITuaDiaz8260JOBxdMJydU/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[明源地产ERP GetErpDept.ashx接口存在SQL注入漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490287&idx=1&sn=e343e59a046907665829d3f76a4f1568&scene=21#wechat_redirect)  
  
  
[Apache ActiveMQ存在远程代码执行漏洞(CVE-2026-34197) 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490275&idx=1&sn=fef72fe69a185507b895f19dccd35cd0&scene=21#wechat_redirect)  
  
  
