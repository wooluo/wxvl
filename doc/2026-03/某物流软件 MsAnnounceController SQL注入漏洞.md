#  某物流软件 MsAnnounceController SQL注入漏洞  
原创 Elon
                    Elon  好靶场   2026-03-26 06:15  
  
> 💡 好靶场   
> 团队宗旨：我们立志于为所有的网络安全同伴制作出好的靶场，让所有初学者都可以用最低的成本入门网络安全。所以我们团队名称就叫“好靶场”。  
  
  
我们承诺每天至少更新1-2个新靶场。2026年冲刺1000个。  
## 好靶场介绍  
  
**官网链接http://www.loveli.com.cn/**  
> 零基础入门不迷茫！ 专属网络安全从零到一体系化训练——配套完整靶场+精选学习资料，帮你快速搭建网安知识框架，迈出入门关键一步！ 全场景实战全覆盖！ 聚焦Web渗透工程师核心能力，深度拆解TOP10逻辑漏洞，精通PHP代码审计、Java代码审计等核心技能，从基础原理到实战攻防，覆盖行业高频应用场景！ 真实漏洞场景沉浸式体验！src训练专题重磅上线——1:1还原真实漏洞报告，让你亲身感受实战挖洞流程，积累符合企业需求的实战经验！  
  
  
🚀哈喽～各位宝子们👋！又到了学习环节，今天给大家带来的是某物流软件的一个SQL注入漏洞内容！话不多说，我们直接开始详细解说，以下的详细介绍👇  
## 漏洞名称  
> 某物流软件 MsAnnounceController SQL注入漏洞  
  
## 漏洞简介/描述  
  
物流软件是青岛东胜伟业软件有限公司一款集订单管理、仓库管理、运输管理等多种功能于一体的物流管理软件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJmicQ7bB02g8fSQc8ghb1ic7ewgHibnbpGIl5icKia9iconiaLpgbuyjiaTdiabWU9KZYYmISWAibPECEYj74StHU8USRuCjGqJzfZYicV5w/640?wx_fmt=png&from=appmsg "")  
## 资产测绘（fofa）  
```
body="FeeCodes/CompanysAdapter.aspx"||body="dhtmlxcombo_whp.js"||body="dongshengsoft"||body="theme/dhtmlxcombo.css" 
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLR7d6CoDLuYs4sYOT6b7Iic2hzeicEuKdxibiaaYGAcZ9HmaMz6e9Rt4x5SuLRvqgghZ2UM6icFWHPicMOGpvDzUmQdYWX4HKomCNSo/640?wx_fmt=png&from=appmsg "")  
## 漏洞POC  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvJLXLZnj6knxVMVPEX500CH8DBOCOZzrQ7Omd94fYiafOodKL3EIicT4kSZqLBBHH1HEFriaBDhFrX2yKFBQiabS2l3egkudx1xxtI/640?wx_fmt=png&from=appmsg "")  
## 漏洞证明  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvLNbPf78sEHrpFU7r7dhe8GA26fM2scWnvxRXu87Q6Hyh4f08OAGdiackyN0z3DUVS7mnjKLQq1Z6kGlKcG70Nzea40dc2ORhno/640?wx_fmt=png&from=appmsg "")  
## 如何使用好靶场  
  
首先关注“好靶场微信公众号”然后发送bug，可以点击链接直接登录  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvJn80Sicpic7OmticxNKsrrgJFTNUhAftHBnCibiaicLFUCB8ehvyT0PrXEG4lDcsnvDLAqJSBQlHz0V4F8SIF5gpO9iaNiaH97PBFjQRw/640?wx_fmt=png&from=appmsg "")  
## 福利  
  
福利1： 找到个人中心，邀请码输入0482d6d28539424c，白嫖14天高级会员。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLCicFgYymsZVpugibO1C8AVsib8XicsA53jA7a050c434b35AhxXQHcdCOzjtRl9N3GpUzIsFdNXY0rh56Mll8dmpKNJIib98uZvibQ/640?wx_fmt=png&from=appmsg "")  
  
福利2： 关注好靶场bilibili。拿着关注截图找到客服，领取5积分或者7天高级会员。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvIicU6vDElyplQWIXkDdgNCmMkL9xCMOx9EsUKtNN4OhyBrAGbMo3QkpzFS5OP8ETAdLenHsJAjz3XCVrfnBSu186zyaqERbsLk/640?wx_fmt=png&from=appmsg "")  
## 每日限免  
  
每日限免 为了能让更多的宝子可以免费的开启会员靶场，我们会在工作日随机开放一些靶场的限免，还请加群关注。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJguqkEichc2zwjCTwfQsl8FW56dZAlNmdDAbLVarx22icu0Y6sJibk94vBBoibkNU3htXEknvAVQQCObYtlB51hatQab1ibRp13a98/640?wx_fmt=png&from=appmsg "")  
  
我们会在微信群、QQ群每天更新限免靶场，以及免费学习资料；任选一个群添加即可，所有的通知都会到位在交流群通知，请添加好友，我将邀请你加入“好靶场内部交流群”  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvKvSCywPlC90S8mWg9fr8xxhWShHvJ3z1njibcmLCFHchA6Xl70fByLuek75ZgF8uUR5r8wqQJT730tcQvzD7ATHIdIibj1Yq3Io/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvL62Jib8LO4pnzu27PofUnice4tk9fv57UjsK6dySBood4KOYYIyqcyzG8xdksv5hWMltXV27rSiaQBoXbQd4scwms3D2oXp5PX3A/640?wx_fmt=png&from=appmsg "")  
## 好靶场AI客服机器人  
  
为方便学习还有提问，我们设计了好靶场Ai客服机器人，可以完成简单的客服能力，以及好靶场日常靶场提醒更新、根据你的询问推荐靶场  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJWgicVJZCqicFqHryHf2oekbyLAic3fkgiaibJeZF3sofXCBPJj1EokyFA6CWGqoah7K5wGP9fGgRbXrof4QwkGm8sFV8PLUZlBdicA/640?wx_fmt=png&from=appmsg "")  
> **“噜噜大王”正式上线**  
  
  
大家点击左边的快捷工具，有一个AI助教功能，然后点开就可以和噜噜大王对话啦，由于是内测期间，仅限于年会员才可以进行使用。还需要进行微调，会随着大家的使用而进行优化。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLxicf2kr1rs5jelBnqnspAL1RFCn5xzkCJoyxiaEZByibue2OculKgO7SzZzOJuINia2j0D9x66LqFBv4SCORlOxuCN9VvkUTbv3E/640?wx_fmt=png&from=appmsg "")  
  
你可以尝试问一下关于打靶场的问题  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvIAjvo2W1CHuxyibFLkMJz99iauf7o52X2NrKJsYrUkQ5gpt2ftZUGLj1AfgiaWwfq5bl0ZI5zFIIykKFMicT0fwgYKIbFGnyzTlBI/640?wx_fmt=png&from=appmsg "")  
## 🚀好靶场会员订阅  
  
好靶场会员订阅 首先点击会员订阅 ，然后选择对应的套餐 ，选择对应的会员去支付 ，支付完成后即可会员到账  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvLAbhLgqSFwkOreAFJ1ZjWOurp271M6wA2ibEM0l5Pticz2OytYw71a4n8kLQWGOic1gsL2OYCV5AYNiaHIqApLoQriaPibpIoKTaibKE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvIT2ib38x4OrWwz0PhyeLCCSQSlKe6g41mU9eEVERlqPibs5icqtp7LGdnDVRgH4bMxSwEoUfDToU0WBclU8YS4w0gjpjttC97PyI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvLBU50dGL709QWEMbQdqhZYdG7PJ38eUNQ97ZERalRVE8rgTMXNK9TP3omM8MTrGe3wSu1wNQGcL7bLBof9CFWAebhU1cEY5Ec/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLCoY5NPz3pr9bY4hCaib107wNNzl94YI3j5SEP3CLicKkcc3olcfwT5Tia8spoh0rJIicQHmSBgHuZB3FaPaYqRibYmYhpF01Q6F5k/640?wx_fmt=png&from=appmsg "")  
  
