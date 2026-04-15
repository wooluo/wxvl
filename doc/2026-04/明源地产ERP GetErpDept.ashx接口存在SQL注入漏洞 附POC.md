#  明源地产ERP GetErpDept.ashx接口存在SQL注入漏洞 附POC  
2026-4-14更新
                    2026-4-14更新  南风漏洞复现文库   2026-04-14 16:11  
  
   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 明源地产ERP 简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
明源地产ERP  
## 2.漏洞描述  
  
明源地产ERP GetErpDept.ashx接口存在SQL注入漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
明源地产ERP  
![明源地产ERP GetErpDept.ashx接口存在SQL注入漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/b9KQYsB8q6w27gKY21jFQuiaVkQAEgl1mzYEQZr1VX1ONfGDEopVJOEhoM47Pp0erm9JsUXB9hlPG7OwrLWK8zyys6Y0dqNe5161ZZBmh7ick/640?wx_fmt=png&from=appmsg "null")  
  
明源地产ERP GetErpDept.ashx接口存在SQL注入漏洞  
## 4.fofa查询语句  
  
body="/_common/scripts/md5-min.js"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6z8pdTOicpzWrSY8ZCWx3abichgU9yc1xxoanCSNCanyicosQAVxLXPVkoQiadofFaMBFRHIaOh9nMDwM7E0EFk4vyKH6OdaAZUwBo/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zG0ArKCLEQMgSgOyZq7pXP4uxqICET3aUQo3lK1aTpVrCoSs25CMCW26BA3wyujbUBYWy6T6LgbaCp9ehUlCC6RE9loKjeREE/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6znoSDSAibI2OSI7gU2uQ2aBYl1vHTtPgLRLMKomyWdnk2zKgVa6E1JwNBiaHSStP9ib1U76pbho30KlfmTCphSDVvNTLPfGHibPia4/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yAYnw9dibCONKWMLOaKjxsa9XB49IfRJmC2mxWu2EosJxwQQ7qicNIdRRP5122gSx7Yg2Rsh38q0yM5EZiahriaEIK9icDOzcqywf4/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xp5gGo0Tx82ojJMic8IXOHaSHI5UVzGsbT5ibIEvwjsKEs8fDuptGMWKT53NDY9MaBcvAjFdyTqa3q2c1xDMeSCQKia8g2iaInegs/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yJ1VSFUVJFKsP2l1ia4CwxrpLpDORkjENA6aU9h4cnfxKVX2v4qsGmzbsdK1YuuCWtibPRxSuhAFdkHj8CND7PTCBcV9wGGook4/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zQNibfXIjib5fyPTic2ZV4yLGkFm4qSs3uGAYpxfXj91rtuK2no7KiaV7ibibUQmdTTWLRKtdbADCSKMzEAU7ibmdq2U23r5ibHt4ozLE/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[Apache ActiveMQ存在远程代码执行漏洞(CVE-2026-34197) 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490275&idx=1&sn=fef72fe69a185507b895f19dccd35cd0&scene=21#wechat_redirect)  
  
  
