#  泛微E-cology10 getEmDsList接口存在敏感信息泄露 附POC  
2026-3-25更新
                    2026-3-25更新  南风漏洞复现文库   2026-03-25 15:39  
  
   
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
## 1. 泛微E-cology10简介  
  
微信公众号搜索：南风漏洞复现文库  
  
该文章 南风漏洞复现文库 公众号首发  
  
本人只有 南风漏洞复现文库 和 南风网络安全  
 这两个公众号，其他公众号有意冒充，请注意甄别，避免上当受骗。  
  
泛微 E-cology10（简称 E10）是上面向中大型组织的数智化协同运营平台  
## 2.漏洞描述  
  
泛微 E-cology10（简称 E10）是面向中大型组织的数智化协同运营平台，定位为企业级数字化中枢，核心覆盖协同办公、流程管理、业务集成、知识管理、低代码开发等全场景能力。泛微E-cology10 getEmDsList存在敏感信息泄露  
  
CVE编号:  
  
CNNVD编号:  
  
CNVD编号:  
## 3.影响版本  
  
泛微E-cology10  
  
![泛微E-cology10 getEmDsList接口存在敏感信息泄露](https://mmbiz.qpic.cn/mmbiz_png/b9KQYsB8q6yTV16X1aTOXILuJBEVLVrHicr7zfGmsYtA3Gv0WpG5zaiaZicM9YEQmEz0WbHkrVx83LQFz4RNug1iaZjMlnUAlZwEEoRX18cLb0M/640?wx_fmt=png&from=appmsg "null")  
  
泛微E-cology10 getEmDsList接口存在敏感信息泄露  
## 4.fofa查询语句  
  
icon_hash="-1619753057"  
## 5.漏洞复现  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6xRDUAIiaPxO5VGYJvicicnx5GmWicMQICWygTjhrKicvjthicaKBoalLcSj74Wh0oEm6PDDO2O0CC7icRgQ13Gxqk2VOUXLUaoZTib9uk/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 6.POC&EXP  
  
本期漏洞及往期漏洞的批量扫描POC及POC工具箱已经上传知识星球：南风网络安全  
  
  
1: 更新poc批量扫描软件，承诺，一周更新8-14个插件吧，我会优先写使用量比较大程序漏洞。  
  
  
2: 免登录，免费fofa查询。  
  
  
3: 更新其他实用网络安全工具项目。  
  
  
4: 免费指纹识别，持续更新指纹库。  
  
  
5: Nuclei脚本。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6x6YqwJYZiaVqH2gK63WzP9rW5n3oZljdluBpIJjXGGj87jsWHb0kg5UiavWOZAE2fTnlicibIXFhICL9NyeVWo3vh6jHXXC54UctY/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yAbNWznULI4x7HKiaja9l4icWGyWk4oAJ6wkxWWPCR4nNwo6PzHm8R1Aian2PK5ZMQpLgAk11cXjUUd2FhXnibcZTEr7sEiafKJS4I/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6zhiaTk74WnFLqc3KbAibyr1oSckEQn2t24kQ5VII7T45hmtic8du97xbL4EGdtQ0KsVfticzUtnj2FgTmYGCGyh3lJB6G8LJ3HBFc/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/b9KQYsB8q6y7f0VnU02gGnibQlYC8to96tKAhdBqc2a6082cOtJ5fcr3nD5yLoL6CbBgKCPh5jTsAeXAB3rDdarTymJHQtobBp36oMvPibCNA/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6yfq32zzrcpYdMWdX18NT9Ehy1DuMrsYtpDibz1iahxUHq8NLMpgR6Qd7R6GFqvd19fIaIs2ojFClSiaqPg2WewtojvQYpYFog2To/640?wx_fmt=jpeg&from=appmsg "null")  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b9KQYsB8q6zPQR4fcIwffKE7wibicyKdVjJKduPwgReVWCKEkhjWKsFj7sEWU6aRZUM3ic3oBs8pc4RPzjmNEY7JtaWPiapzU8icVItOSagTtfF4/640?wx_fmt=jpeg&from=appmsg "null")  
  
## 7.整改意见  
  
打补丁  
## 8.往期回顾  
  
  
   
  
  
  
