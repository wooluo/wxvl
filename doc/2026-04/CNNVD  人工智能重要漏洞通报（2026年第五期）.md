#  CNNVD | 人工智能重要漏洞通报（2026年第五期）  
 中国信息安全   2026-04-17 10:21  
  
[](https://cisat.cn/all/14915419?from_tag=1)  
  
  
**漏洞情况**  
  
根据国家信息安全漏洞库（CNNVD）统计，近期（2026年3月31日至2026年4月15日）共采集重要人工智能漏洞320个，CNNVD对这些漏洞进行了收录。本周人工智能类漏洞主要涵盖了OpenClaw、Ollama、MLflow等多个厂商（项目）。CNNVD对其危害等级进行了评价，其中超危漏洞35个，高危漏洞107个，中危漏洞178个。  
  
鉴于近期人工智能领域漏洞呈爆发式增长态势，相关系统安全风险急剧攀升，请相关单位及个人尽快开展漏洞消控工作。  
  
## 一人工智能漏洞增长数量情况  
  
  
近期CNNVD采集人工智能漏洞320个。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/uOZw5Efn8evDRqGtxbkZRiajk0Oy45VWBaG8icg0xUbFEHM6pA4QygFqDSelgEkdKAPPRZzYnP6NzHNoTlAyB1khR0ETpQwic4ZHGjb0ibHMOJM/640?wx_fmt=other&from=appmsg&watermark=1#imgIndex=3 "")  
  
图1 近五周漏洞新增数量统计图  
  
  
## 二人工智能漏洞具体情况  
  
  
近期共采集人工智能漏洞320个，包括OpenClaw、Ollama、MLflow等多个厂商（项目）的漏洞。其中超危漏洞35个，高危漏洞107个，中危漏洞178个。具体如表1所示：  
  
表1 人工智能漏洞列表  
  
![](https://mmbiz.qpic.cn/mmbiz_png/uOZw5Efn8evqiaSRURKkFsRlKU5If8Lu40icibBrwGDQrD7qYtJgP6wK2JjMtLbenibg5OYjZicAzpZe6q6gSiboq8RJiacP9pjBZ7KFw5yOSB7Xqo/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=4 "")  
  
## 三重要人工智能漏洞实例  
  
  
近期重要漏洞实例如表2所示。  
  
表2 本期重要漏洞实例  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/uOZw5Efn8evtvDHTosBnOb7negdk2zIg0mg9lqj5PNSeQpcFkZ8bU4eXPTymAIWQopJvYMPbIS7D5HbxK40fyc5yZG7MYQdU3czM5NfdJJk/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=5 "")  
  
1. OpenClaw 操作系统命令注入漏洞（CNNVD-202603-6234）  
  
OpenClaw是一个开源的智能人工助理。  
  
OpenClaw 2026.3.13之前版本存在操作系统命令注入漏洞，该漏洞源于未清理路径包含的shell元字符，攻击者利用该漏洞可以远程注入命令。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://github.com/openclaw/openclaw/releases  
  
2. MLflow 操作系统命令注入漏洞（CNNVD-202603-6212）  
  
MLflow是一个开源简化机器学习的开发平台。  
  
MLflow存在操作系统命令注入漏洞，该漏洞源于model_uri参数未经适当清理可直接嵌入shell命令，攻击者利用该漏洞可以注入命令和提升权限。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://github.com/mlflow/mlflow/releases  
  
3. LoLLMs 安全漏洞（CNNVD-202604-1398）  
  
LoLLMs是一个大型语言与多模态系统。  
  
LoLLMs 2.1.0版本存在安全漏洞，该漏洞源于使用弱密钥签署JSON Web Tokens导致访问控制不当，攻击者利用该漏洞可以离线暴力破解以恢复密钥，进而伪造管理令牌并提升权限。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://lollms.com/  
  
  
（来源：CNNVD）  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/LJwWAbW20Ch90C0U9HhePiaDDzrHse2xBydmAsYOkj3g1vHTJECnOV5PmwENG3yNvVJibc15jVAgXMuNfzEd5iaoicqbsoS5dkrIs3LvEU5CIpQ/640?wx_fmt=png&from=appmsg "")  
  
[](https://cisat.cn/)  
  
