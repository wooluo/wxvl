#  ClawHub漏洞可致恶意skill登顶；Claude Code允许AI自主选择操作权限 | FreeBuf周报  
 FreeBuf   2026-03-28 04:13  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
各位 Buffer 周末好，以下是本周「FreeBuf周报」，我们总结推荐了本周的热点资讯、一周好文，保证大家不错过本周的每一个重点！  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/qq5rfBadR3icJ1UiaObonmWJbuLyoLXdutZ6T0GL6AXwFA0IHVJ9Tl93JicaeTmN55VJBw0JKrJg4sQXdypbdzqibg/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
  
🧑‍🔧ClawHub漏洞使攻击者可操纵排名使恶意skills登顶  
  
🤖Anthropic为Claude Code解锁自动模式，允许AI自主选择操作权限  
  
💻全球逾51.1万台停止更新的微软IIS服务器暴露在互联网上  
  
🩺阿斯利康数据泄露事件——LAPSUS$ 黑客组织宣称窃取内部数据  
  
⛓️‍💥针对开源漏扫的供应链攻击：Trivy漏洞扫描器遭植入窃密后门  
  
🍎DarkSword iOS漏洞利用套件利用6个漏洞（含3个0Day）实现设备完全控制  
  
🖥️  
Telus Digital 遭 ShinyHunters 入侵，1PB 数据恐泄露  
  
💰虚假OpenClaw代币赠礼活动瞄准GitHub开发者实施钱包清空骗局  
  
🕳️TeamPCP通过Trivy CI/CD漏洞在LiteLLM 1.82.7–1.82.8版本植入后门  
  
💽APT组织通过攻击RDP服务器部署恶意载荷并建立持久化访问  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS5NY7KgXpwrAo5WHiaX2SOibeoicce3vxyZozGALjYSLtYPrDiceL0UV2D3A/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
###   
  
ClawHub漏洞使攻击者可操纵排名使恶意skill登顶  
  
安全研究团队在OpenClaw智能体生态系统的公共skills注册平台ClawHub中发现了一个关键漏洞。该漏洞允许攻击者人为虚增恶意skill的下载量，从而绕过安全检查并操纵搜索排名。通过将受感染的skill推送至榜首，威胁行为者能够对人类用户和自主AI Agent发起大规模供应链攻击。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX0QOhzSjicnWoLRKxibuNUR9HxSf7zaqZ1ZJia2yWOmD1bNoDvvSFrRiaJCTSarzlZ2qeLKqlNEY2HqADOfFMGW3WZkAicayRe5kZjw/640?wx_fmt=png&from=appmsg "")  
  
  
Anthropic为Claude Code解锁自动模式，允许AI自主选择操作权限  
  
Anthropic推出Claude Code"自动模式"，AI可自主决定操作权限，提升效率但需平衡安全风险。新模式在执行前审查操作安全性，减少人工干预，但仍存在误判可能，建议在沙盒环境中使用。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX0Wf2d4471SqWfkm2otoQUWG3Fc8lOeSQ3EwNNFGx60gS7MjnvsUDzyDuyrsmpekRQuibSm4hgstgrslfIwmndUibiaHK4ud2gmP0/640?wx_fmt=png&from=appmsg "")  
  
  
全球逾51.1万台停止更新的微软IIS服务器暴露在互联网上  
### 超51.1万台终止支持的微软IIS服务器暴露在互联网，近半数无法获得安全补丁，构成重大攻击面。中、美数量最多，建议立即升级或隔离，防止勒索软件和APT攻击。  
###   
###   
  
阿斯利康数据泄露事件——LAPSUS$ 黑客组织宣称窃取内部数据  
### 黑客组织LAPSUS$宣称入侵阿斯利康，试图出售3GB敏感数据，包括源代码、云配置和密钥，可能转向付费访问模式，威胁供应链安全。阿斯利康尚未回应。  
###   
### 针对开源漏扫的供应链攻击：Trivy漏洞扫描器遭植入窃密后门攻击者入侵流行开源漏洞扫描工具Trivy，篡改其GitHub Actions组件和二进制文件植入恶意代码窃取密钥，可能引发供应链攻击。攻击手法隐蔽，利用标签篡改规避检测。建议立即升级至安全版本并检查密钥泄露。DarkSword iOS漏洞利用套件利用6个漏洞（含3个0Day）实现设备完全控制新型iOS漏洞利用套件DarkSword利用6个漏洞（含3个0Day）窃取敏感数据，针对iOS 18.4-18.7设备，由疑似俄罗斯组织UNC6353等用于攻击乌克兰等国用户，快速窃取加密货币钱包等数据后清除痕迹，暴露iOS漏洞市场风险。Telus Digital 遭 ShinyHunters 入侵，1PB 数据恐泄露加拿大电信巨头Telus遭勒索团伙ShinyHunters入侵，700TB至1PB敏感数据泄露，含客户录音、员工档案等。该团伙多次攻击国际企业，威胁公开数据。Telus业务未中断，正通知受影响客户。虚假OpenClaw代币赠礼活动瞄准GitHub开发者实施钱包清空骗局参与OpenClaw项目的软件开发人员正成为一场旨在清空其数字钱包的危险钓鱼活动的最新目标。安全研究公司OX Security最新发现，攻击者利用GitHub自身通知系统，将毫无戒心的用户诱导至欺诈网站。  
  
TeamPCP通过Trivy CI/CD漏洞在LiteLLM 1.82.7–1.82.8版本植入后门  
### TeamPCP入侵Python软件包litellm，推送恶意版本窃取凭证并渗透Kubernetes集群，利用Trivy漏洞扩大供应链攻击，威胁持续升级。建议立即检查受影响版本并隔离系统。  
  
###   
###   
  
APT组织通过攻击RDP服务器部署恶意载荷并建立持久化访问  
  
### 国家级黑客组织APT-C-13转向长期渗透战略，通过伪装ISO镜像攻击关键设施，部署模块化框架Tambur/Sumbur隐蔽潜伏，滥用合法工具规避检测，建立持久RDP访问并窃取数据。企业需加强安全监控与审计。  
  
###   
###   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS5Ce9OricKgAogLRlHYat9jaelbVESLOylPBnQQrU63TlHEs2zCbdNrKg/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
**本周好文推荐指数**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS59ZQ6EsSUehyHWzxq6tIFG5b5TmautNPF3E0YDL2xav0dFmmibp2oT0w/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS59ZQ6EsSUehyHWzxq6tIFG5b5TmautNPF3E0YDL2xav0dFmmibp2oT0w/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS59ZQ6EsSUehyHWzxq6tIFG5b5TmautNPF3E0YDL2xav0dFmmibp2oT0w/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS59ZQ6EsSUehyHWzxq6tIFG5b5TmautNPF3E0YDL2xav0dFmmibp2oT0w/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS59ZQ6EsSUehyHWzxq6tIFG5b5TmautNPF3E0YDL2xav0dFmmibp2oT0w/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
###   
  
  
红队武器库的十年演进：从Metasploit到AI辅助攻击的范式转移  
### 过去十年间，红队武器库的演进轨迹清晰勾勒出攻击技术的三次范式转移：从手工时代的精准狙击，到自动化时代的链式收割，再到云化时代的攻防重构，直至今日AI增强时代的降维打击。  
###   
###   
  
基于Ollama的自动化渗透测试框架：设计方案  
### 传统的自动化工具（比如那些nmap自动脚本）是硬编码的if-else，遇到特殊情况就卡死了。作者的想法是用AI来做这个决策。AI能看懂nmap结果，知道8080可能是Tomcat也可能是Jenkins；能理解whatweb的输出，判断这是WordPress还是自己写的CMS；能根据当前收集到的信息，决定下一步该干什么。  
###   
  
实测Claude Code Security找漏洞  
### 2月20日，Anthropic放出了Claude Code Security——一个内嵌在Claude Code里的安全扫描功能。消息一出，CrowdStrike股价跌了8%，Cloudflare跌了8%，Okta跌了9.2%。整个网络安全板块集体恐慌。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX3uXIE0Fibic1dKuTic5iciaQZhjbpzlu8Tuprq4nUr5KT7nqicxhMcJQjzBFEPd8VkFA2Mr4T90EUhV9AulvN9wov3hZynBKBgaDnZM/640?wx_fmt=jpeg&from=appmsg "")  
###   
###   
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651335912&idx=1&sn=f7c9c36f910a122eb9bb727adcf9e89d&scene=21#wechat_redirect)  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR38TJMDLxr9EPGGib49oQymrvRy7vGw1iakQXBCr1Udmia4dpY3JSWYEEicajmhhcyfHly9YYPIziaCVPOg/640?wx_fmt=png&from=appmsg "")  
###   
  
  
