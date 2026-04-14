#  漏洞预警 | Apache ActiveMQ远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-13 23:50  
  
**0x00 漏洞编号**  
- # CVE-2026-34197  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Apache ActiveMQ是Apache软件基金会研发的一个开源消息中间件，为应用程序提供高效的、可扩展的、稳定的和安全的企业级消息通信。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SW51lXD4VAia2ODK18phIRsw8O7yQmcZZAvplx8oQvQibDlDD7syqj4COCp76icXqVvw8QdeBg5QI01w/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-34197**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
任意  
代码执行  
  
**简述：**  
Apache ActiveMQ存在远程代码执行漏洞，由于系统通过/api/jolokia/暴露Jolokia JMX-HTTP接口，并且默认访问策略允许对org.apache.activemq:* MBeans执行exec操作。由于对输入的discovery URI参数缺乏有效校验，攻击者可构造恶意brokerConfig参数，触发ResourceXmlApplicationContext加载远程Spring XML配置。在Spring初始化阶段会提前实例化Bean，具备认证用户权限的攻击者可借助Runtime.exec()等方法实现任意代码执行。  
  
**0x04 影响版本**  
- Apache ActiveMQ Broker < 5.19.4  
  
- 6.0.0 <= Apache ActiveMQ Broker < 6.2.3  
  
- Apache ActiveMQ < 5.19.4  
  
- 6.0.0 <= Apache ActiveMQ < 6.2.3  
  
**0x05 POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://activemq.apache.org/  
  
  
  
