#  漏洞预警 | 四信通信科技有限公司设备管理平台SQL注入漏洞  
浅安  浅安安全   2025-06-18 00:00  
  
**0x00 漏洞编号**  
- # 暂无  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
厦门四信通信科技有限公司设备管理平台是一个依托物联网、云计算等技术，为用户提供设备秒接入、数据上云、协议解析、远程控制与运维、数据存储展示等功能的软硬件一体化管理平台。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SVsNOADZuENUhYticxt93d0ChRh3icPDPdA19cDVicH7ia7Ria90zMeEQe2mmB2hsbEiagZz9URh03orznw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
**0x03 漏洞详情**  
  
**漏洞类型：**  
SQL注入  
  
**影响：**  
敏感信息泄露****  
  
**简述：**  
厦门四信通信科技有限公司设备管理平台的  
/devicetask/listPage.do和  
/userInfo/findUserInfo.do  
接口存在SQL注入漏洞，未经身份验证的攻击者可以通过该漏洞获取数据库敏感信息。  
  
**0x04 影响版本**  
- 厦门四信通信科技有限公司设备管理平台  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
http://www.four-faith.com/  
  
  
  
