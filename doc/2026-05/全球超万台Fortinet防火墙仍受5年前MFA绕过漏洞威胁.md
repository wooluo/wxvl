#  全球超万台Fortinet防火墙仍受5年前MFA绕过漏洞威胁  
 FreeBuf   2026-01-03 10:30  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibZSTanftINpTOycR8Ww3wr6DalewIibtXRkGpKXrVKzFGgDAflPiaBPHwJiaRVicQ6laDsGOoVd9gYyw/640?wx_fmt=png&from=appmsg "")  
  
  
**Part01**  
## 漏洞概况  
  
  
据调查，全球仍有超过1万台Fortinet防火墙设备存在CVE-2020-12812漏洞风险，而这个多因素认证（MFA）绕过漏洞早在五年前就已披露。Shadowserver基金会近期将该漏洞纳入其每日脆弱HTTP服务报告，Fortinet在2025年底确认该漏洞正被活跃利用。  
  
  
**Part02**  
## 技术细节  
```

```  
  
该漏洞源于FortiOS SSL VPN门户的身份验证缺陷，影响6.4.0、6.2.0至6.2.3以及6.0.9及更早版本。攻击者仅需修改合法用户名的字母大小写（如将"user"改为"User"）即可绕过第二认证因素（通常是FortiToken）。这是由于FortiGate本地用户名区分大小写，而LDAP服务器（如Active Directory）通常忽略大小写，导致攻击者可通过LDAP组成员身份完成认证而无需MFA验证。  
  
  
该漏洞CVSS v3.1基础评分为7.5（高危），具有网络可访问性、低复杂度攻击条件，可能影响数据机密性、完整性和可用性。2021年勒索软件组织利用该漏洞后，它被列入CISA已知被利用漏洞目录。  
  
  
**Part03**  
## 利用情况  
  
  
2025年12月，Fortinet发布PSIRT公告（FG-IR-19-283更新），详细说明该漏洞在野利用情况：当本地FortiGate用户启用MFA并关联LDAP，且属于映射到SSL VPN、IPsec或管理员访问认证策略的LDAP组时，威胁分子可利用该漏洞获取未授权内网访问权限。  
  
  
**Part04**  
## 全球影响  
  
  
Shadowserver扫描数据显示，截至2026年1月初仍有超1万台设备存在风险。受影响最严重的国家包括：  
- 美国：1300台  
  
- 泰国：909台  
  
- 中国台湾地区：728台  
  
- 日本：462台  
  
- 中国大陆：462台  
  
地理分布图显示北美、东亚和欧洲为密集暴露区域，非洲和南美部分地区受影响较轻。  
  
  
**Part05**  
## 缓解措施  
  
  
Fortinet建议升级至已修复版本（6.0.10+、6.2.4+、6.4.1+），检查配置避免混合本地-LDAP MFA设置。应关闭非必要SSL VPN暴露面，实施最小权限原则，监控日志中的大小写变体登录尝试。企业应订阅Shadowserver报告获取定制化警报，并及时运行脆弱HTTP扫描。  
  
  
该持续威胁凸显了企业防火墙中遗留漏洞的风险，可能为勒索软件攻击或横向移动提供便利。  
  
  
**参考来源：**  
  
10,000+ Fortinet Firewalls Still Exposed to 5-year Old MFA Bypass Vulnerability  
  
https://cybersecuritynews.com/fortinet-firewalls-exposed/  
  
  
###   
###   
###   
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651332681&idx=1&sn=f3b4d860ef790d55652eb5a4aeca8e97&scene=21#wechat_redirect)  
###   
### 电台讨论  
  
****  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibl7jGenyy4j8qWgan0RtibartNWPtzeeYghKJbbNPqS5rOJDpDr5YL7LGpoFibAV3davCAEvU2IESg/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
