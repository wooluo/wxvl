#  天地伟业Easy7 queryDataByTypeEx接口存在SQL注入漏洞 附POC  
2026-6-18更新
                    2026-6-18更新  南风漏洞复现文库   2026-06-18 15:37  
  
   
  
#   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 天地伟业Easy7简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
天地伟业Easy7  
## 2.漏洞描述  
  
天地伟业Easy7 queryDataByTypeEx接口存在SQL注入漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
天地伟业Easy7  
![天地伟业Easy7 queryDataByTypeEx接口存在SQL注入漏洞](https://mmbiz.qpic.cn/sz_mmbiz_png/b9KQYsB8q6zFwqqQfkAozjb3ibDTXBosTE4JlYXQiaI7Nk5mm1cPZ92jYPcYfka8XanIT5FnLrNC217yy1PZKUgG9ZCRm2iaGlg7WwWCHiaU8Bk/640?wx_fmt=png&from=appmsg "null")  
  
天地伟业Easy7 queryDataByTypeEx接口存在SQL注入漏洞  
## 4.fofa查询语句  
  
app="Tiandy-Easy7"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6y8WDX3pRck0krTpR8Rl94flwNKXDlia1DX5djATumozgspLGFvRT41tkZWmjqm3oXVjduy6r72LwPp7UzTam0zJ5IibqicA2oMoA/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yk0OSBnBQ7ueHoSYmor8s4RBZmM7PMPOiabkZ6Q2MgrT0icdic7qPguyiaEUn255mIXyMUaibDyEgWLKgYtMxvhQxlwOY1U0SHeHNs/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6ydFEQgJicjErNianr5Uicz9GImICUjXp51sYV4Wx5BnpNmMmh3FbSOJRxype5ml7rRibe9lTmwVswfupKthibgVqHDHRaOppEKnDm0/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6yeAHqOTaCtZ6l0V1Kiaz6pAFFufJDGial118WiaOxU79kqNW30n35TYE7cz15EFOCANNXicpLZwTKgEmCU1CsO7JuGkqkzDIZ3EnE/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xibtiae1iaTaovdHBNLF8ZNKCJWFRQtUP6Uf03lpYw4iau2ByXwc0zHaMjN5A40Oeibv9BeWcQ1pUUHlbZK1erlfdGpjGcpZvm7E04/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zianwEI40t1NxS1y1icAXE0a4fiawibIzHoQRkjcRb3jXLv8qHia2epKOdrY377jdxPEE9LKpMvGOlss24Js0bVCJibzXia3KIqCZOPE/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xoUrcofkPWzexibxibrvjahZneg51ZXbgF1wVfMY6GkmX7aQn3x5Y8mJnUIibTmb36jKopXP1icCSicj5icIgZrv7jSbjIVTX8qwHJ8/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
[天地伟业Easy7 downloadResource接口存在任意文件读取漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490601&idx=1&sn=eae49a6e19bff014add6d7287c98ceff&scene=21#wechat_redirect)  
  
  
  
  
