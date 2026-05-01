#  CNNVD | 关于cPanel访问控制错误漏洞的通报  
 中国信息安全   2026-05-01 03:25  
  
[](https://cisat.cn/all/14915419?from_tag=1)  
  
  
**漏洞情况**  
  
近日，国家信息安全漏洞库（CNNVD）收到关于cPanel访问控制错误漏洞（CNNVD-202604-5641、CVE-2026-41940）情况的报送。攻击者可通过构造恶意请求，在经未授权的情况下访问目标服务器控制面板。cPanel 11.40之后版本均受此漏洞影响。目前，cPanel官方已发布新版本修复了该漏洞，建议用户及时确认产品版本，尽快采取修补措施。  
  
## 一漏洞介绍  
  
  
cPanel是美国cPanel公司的一套基于Web的自动化主机托管平台，该平台主要用于自动化管理网站和服务器。该漏洞源于登录流程中存在身份验证绕过问题，可能导致未经身份验证的攻击者远程访问目标服务器控制面板。  
  
  
## 二危害影响  
  
  
cPanel 11.40之后版本受此漏洞影响。  
  
  
## 三修复建议  
  
  
目前，cPanel官方已发布新版本修复了该漏洞，建议用户及时确认产品版本，尽快采取修补措施。参考链接：  
  
https://support.cpanel.net/hc/en-us/articles/40073787579671-Security-CVE-2026-41940-cPanel-WHM-WP2-Security-Update-04-28-2026  
  
本通报由CNNVD技术支撑单位——奇安信网神信息技术（北京）股份有限公司、亚信科技（成都）有限公司、内蒙古万德系统集成有限责任公司、内蒙古旌云科技有限公司、天翼云科技有限公司等技术支撑单位提供支持。  
  
CNNVD将继续跟踪上述漏洞的相关情况，及时发布相关信息。如有需要，可与CNNVD联系。联系方式: cnnvd@itsec.gov.cn  
  
（来源：CNNVD）  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/LJwWAbW20Ch90C0U9HhePiaDDzrHse2xBydmAsYOkj3g1vHTJECnOV5PmwENG3yNvVJibc15jVAgXMuNfzEd5iaoicqbsoS5dkrIs3LvEU5CIpQ/640?wx_fmt=png&from=appmsg "")  
  
[](https://cisat.cn/)  
  
