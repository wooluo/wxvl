#  【漏洞复现】0day-迈普多业务融合网关逻辑缺陷导致登录绕过  
什么安全
                    什么安全  什么安全   2026-05-12 09:06  
  
  请勿利用  
文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息而造成的任何直接  
或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。本次测试仅供学习使用，如若非法他用，与平台和本文作者无关，需自行负责  
！  
## 产品描述  
  
  迈普多业务融合网关拥有融合网关功能、精准流控、上网行为管理、智能选路等强大功能，并支持对接迈普云平台，实现远程运维和集中管理，很好的满足了医疗/教育等场景要求的全面一体化的网络需求。  
## 漏洞描述  
  
  
  
  未经身份验证的远程攻击者可通过系统登录存在的逻辑缺陷绕过认证，获取应用系统操作权限。  
## Poc  
  
```
GET 未公开
```  
  
## 洞复现  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XY4NEU6nZJBdwZicbCBiaoN6OQYKIxvHkjuWOStdzfKKoTEBIAaPO7XiclmLLO2UIj8jVkvyGykuI9otPO8OhiaFzaAEYjfvJSCzt2qngF9rSa8/640?wx_fmt=png&from=appmsg "")  
  
小  
知  
识  
  
  
  
  
**依据《刑法》第285条第3款的规定，犯提供非法侵入或者控制计算机信息罪的，处3年以下有期徒刑或者****拘役****，并处或者单处****罚金****;情节特别严重的，处3年以上7年以下有期徒刑，并处罚金。**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Gn0JbCnxttRbj4Mib3fcSfwr0tP4UxXtjf47HFwaZcgwWStzGNLNMlGKQJz902fHTT8PCfOwHedLqarXh0eC9KQ/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=1 "")  
  
声  
明  
  
  
  
**本文提供的技术参数仅供学习或运维人员对内部系统进行测试提供参考，未经授权请勿用本文提供的技术进行破坏性测试，利用此文提供的信息造成的直接或间接损失，由使用者承担。**  
  
  
