#  CNNVD | 人工智能重要漏洞通报（2026年第九期）  
 中国信息安全   2026-06-18 08:40  
  
[](https://cisat.cn/all/14915419?from_tag=1)  
  
  
**漏洞情况**  
  
根据国家信息安全漏洞库（CNNVD）统计，近期（2026年5月29日至2026年6月15日）共采集重要人工智能漏洞201个，CNNVD对这些漏洞进行了收录。本周人工智能类漏洞主要涵盖了MLflow、OpenClaw、Nous Research（Hermes Agent）等多个厂商（项目）。CNNVD对其危害等级进行了评价，其中超危漏洞11个，高危漏洞73个，中危漏洞117个。  
  
## 一人工智能漏洞增长数量情况  
  
  
近期CNNVD采集人工智能漏洞201个。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/uOZw5Efn8etFYTNPzzLqOhHw7icibydQZQ2vyOeHQZicrcFqVnGPUzglKkUuLPm6TkpU2Cy3H8nDCAN7vY0AtJPINzsOPlicmFh8nmnYrnba18Y/640?wx_fmt=other&from=appmsg&watermark=1#imgIndex=3 "")  
  
图1 近期漏洞新增数量统计图  
  
  
## 二人工智能漏洞具体情况  
  
  
近期共采集重要人工智能漏洞201个，包括MLflow、OpenClaw、Nous Research（Hermes Agent）等多个厂商（项目）的漏洞。其中超危漏洞11个，高危漏洞73个，中危漏洞117个。具体如表1所示：  
  
表1 人工智能漏洞列表  
  
![](https://mmbiz.qpic.cn/mmbiz_png/uOZw5Efn8euFThibUBeBgzWrDFQBIosjrEqbK3EJHlQSwLUck7bmc83dpBTibtVxqFmrUCicHT2fUJZAUjzejoKRY2sXlVHS9zAaC5iaoY33HJA/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=4 "")  
  
## 三重要人工智能漏洞实例  
  
  
近期重要漏洞实例如表2所示。  
  
表2 本期重要漏洞实例  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/uOZw5Efn8ev0Oib8sc0w0MDvIjviaKLyyyvOIAutVqTdURKwgGl7cw6iaDum9xeJ2GlZNfaJbibY9mibEKyz9jM38kYl7icVxrDVQkPnoPgsIicJicQ/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=5 "")  
  
1. MLflow 安全漏洞（CNNVD-202606-737）  
  
MLflow是一个开源的简化机器学习开发的平台，包括跟踪实验、将代码打包成可重复的运行以及共享和部署模型。  
  
MLflow 3.11.0之前版本存在安全漏洞，该漏洞源于允许解析 AI网关密钥中的环境变量，攻击者利用该漏洞可以获取敏感凭据。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
[https://mlflow.org/](https://mlflow.org/)  
  
  
2. OpenClaw 授权问题漏洞（CNNVD-202606-2941）  
  
OpenClaw是一个开源的智能人工助理。  
  
OpenClaw 2026.5.22之前版本存在授权问题漏洞，该漏洞源于对身份验证不当，攻击者利用该漏洞可以伪造位置信息并获取持久的可管理设备令牌，从而获取敏感信息。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
[https://github.com/openclaw/openclaw/security/advisories/GHSA-chr9-m4q2-76hw](https://github.com/openclaw/openclaw/security/advisories/GHSA-chr9-m4q2-76hw)  
  
  
3. Hermes Agent 安全漏洞（CNNVD-202606-354）  
  
Hermes Agent是Nous Research开源的一款具备自我学习循环的AI代理工具。  
  
Hermes Agent 2026.4.30版本及之前版本存在安全漏洞，该漏洞源于对输入的字符串限制不当，攻击者利用该漏洞可以远程执行命令。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
[https://github.com/NousResearch/hermes-agent/releases](https://github.com/NousResearch/hermes-agent/releases)  
  
  
  
（来源：CNNVD）  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/LJwWAbW20Ch90C0U9HhePiaDDzrHse2xBydmAsYOkj3g1vHTJECnOV5PmwENG3yNvVJibc15jVAgXMuNfzEd5iaoicqbsoS5dkrIs3LvEU5CIpQ/640?wx_fmt=png&from=appmsg "")  
  
[](https://cisat.cn/)  
  
