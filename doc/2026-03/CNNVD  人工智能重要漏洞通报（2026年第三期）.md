#  CNNVD | 人工智能重要漏洞通报（2026年第三期）  
 中国信息安全   2026-03-20 10:04  
  
[](https://cisat.cn/all/14915419?from_tag=1)  
  
**漏洞情况**  
  
根据国家信息安全漏洞库（CNNVD）统计，近期（2026年3月4日至2026年3月19日）共采集重要人工智能漏洞155个，CNNVD对这些漏洞进行了收录。本周人工智能类漏洞主要涵盖了OpenClaw、腾讯、HCL等多个厂商（项目）。CNNVD对其危害等级进行了评价，其中超危漏洞18个，高危漏洞56个，中危漏洞81个。  
  
## 一人工智能漏洞增长数量情况  
  
  
近期CNNVD采集人工智能漏洞155个。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/uOZw5Efn8etfO6rZWhVNB8h00kIvutPdyn3eOx5JreDqZcibfVzkhD8rX94Z4lRAsQ5xA6y8UElOhFiaGaEy3LYdUzPJfgojnib084j95wfoUs/640?wx_fmt=other&from=appmsg&watermark=1#imgIndex=3 "")  
  
图1 近五周漏洞新增数量统计图  
  
****  
## 二人工智能漏洞具体情况  
  
  
近期共采集人工智能漏洞155个，包括OpenClaw、腾讯、HCL等多个厂商（项目）的漏洞。其中超危漏洞18个，高危漏洞56个，中危漏洞81个。具体如表1所示：  
  
表1 人工智能漏洞列表  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/uOZw5Efn8euwNlsiciaibr9MOUcKEqyicQib2uDTHZHwhJQxq0oaUia3XxeRA23hO3rdkicgseR7fHKjb60ezGPZKiavMicqMknChZofjibKdF8IHrs8k/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=4 "")  
  
## 三重要人工智能漏洞实例  
  
  
近期重要漏洞实例如表2所示。  
  
表2 本期重要漏洞实例  
  
![](https://mmbiz.qpic.cn/mmbiz_png/uOZw5Efn8evfHlkvRPmgVeLuLhibp09Ul1mvNMu2p3oQDtewwao7jeUcRbtGGiaKLDsibxc5w5xGGlc3BEmicFY2HcoTjv6Ay6IAoHLcScGGrQs/640?wx_fmt=png&from=appmsg&watermark=1#imgIndex=5 "")  
  
1. OpenClaw 数据伪造问题漏洞（CNNVD-202603-623）****  
  
OpenClaw是一个开源的智能人工助理软件。  
  
OpenClaw 2026.2.2之前版本存在数据伪造问题漏洞，该漏洞源于未验证Telegram webhook模式中的webhook密钥，攻击者利用该漏洞可以执行任意命令。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://github.com/openclaw/openclaw/releases  
  
2. sglang 安全漏洞（CNNVD-202603-2425）****  
  
sglang是一个开源的用于加速大模型推理的编程语言系统。  
  
sglang存在安全漏洞，该漏洞源于replay_request_dump.py文件中的pickle.load函数没有进行验证和正确的反序列化操作，攻击者利用该漏洞可以执行恶意代码。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://github.com/sgl-project/sglang/releases  
  
3. VMware Spring AI 安全漏洞（CNNVD-202603-3285）****  
  
VMware Spring AI是美国威睿（VMware）公司的一个在Spring生态中集成人工智能与大语言模型能力的开发框架。  
  
VMware Spring AI存在安全漏洞，该漏洞源于MariaDBFilterExpressionConverter缺少输入清理，攻击者利用该漏洞可以绕过访问控制并执行任意SQL命令。  
  
目前厂商已发布升级补丁以修复漏洞，参考链接：  
  
https://spring.io/projects/spring-ai  
  
（来源：CNNVD）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/LJwWAbW20ChLHjwhM1Y79DHD6iacA0FBgEPE5KSiacT5SBvIgNBPxTVtlsX3C4uwcrpQmVfVMnFdibEjoQe6NmiaMibakFukuslQbwcqyDGXXKGM/640?wx_fmt=png&from=appmsg "")  
  
[](https://cisat.cn/)  
  
