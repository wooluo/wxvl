#  Windows Defender 0Day漏洞PoC曝光；Anthropic拒美军AI武器化遭封杀 | FreeBuf周报  
 FreeBuf   2026-04-11 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
各位 Buffer 周末好，以下是本周「FreeBuf周报」，我们总结推荐了本周的热点资讯、一周好文，保证大家不错过本周的每一个重点！  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/qq5rfBadR3icJ1UiaObonmWJbuLyoLXdutZ6T0GL6AXwFA0IHVJ9Tl93JicaeTmN55VJBw0JKrJg4sQXdypbdzqibg/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
  
💻Windows Defender 0Day漏洞PoC曝光，攻击者可获取系统最高权限  
  
🤖Anthropic拒美军AI武器化遭封杀，引爆企业自治与政府监管大战  
  
☕星巴克数据泄露事件：攻击者宣称窃取10GB源代码  
  
⚔️黑客借美以伊冲突的导弹恐慌伪造警报，窃取微软账户凭证  
  
🛡️Anthropic Glasswing项目揭示漏洞发现的未来：AI如何重塑网络安全格局  
  
⛓️‍💥攻击者劫持AI工具链，LiteLLM沦为密钥提款机  
  
⏰Claude仅用10分钟发现Apache ActiveMQ潜伏13年的RCE漏洞  
  
🧑‍🔧逾1.2万个Flowise实例暴露在CVSS 10.0远程代码执行漏洞攻击之下  
  
🌩️攻击者利用Kubernetes配置错误从容器渗透至云账户  
  
🎰Adobe数据泄露事件：攻击者宣称窃取1300万份支持工单及员工记录  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3icFibibPIGEfXsibI0C3or4BS5NY7KgXpwrAo5WHiaX2SOibeoicce3vxyZozGALjYSLtYPrDiceL0UV2D3A/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
###   
  
Windows Defender 0Day漏洞PoC曝光，攻击者可获取系统最高权限  
  
网络安全研究员公开Windows本地提权0Day漏洞BlueHammer，影响最新系统，可获取最高权限。披露因不满微软安全响应流程低效，漏洞利用代码已公开，威胁行为者可能快速利用。建议监控权限提升活动并限制用户权限，微软暂未回应。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icBE3OpK1IX2hw46iaqs3EbLqeOpObc4gOMribNMLbBNa9Jwa8pTdibIhlXT1AZNh4XAPQKnR8JbZQWCZlXtFAeZKVDZCg3RqLk9iceFXMGLTnib0/640?wx_fmt=png&from=appmsg "")  
  
  
Anthropic拒美军AI武器化遭封杀，引爆企业自治与政府监管大战  
  
AI控制权之争：Anthropic与美国国防部的冲突凸显AI治理核心矛盾，涉及国家安全、企业自治与技术伦理。企业坚持使用限制或强化市场信任，但政策变动带来技术债务风险，需全新治理框架平衡多方利益。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icBE3OpK1IX16JWlEobjWPNUEUQmlsS083aOXI6hu8fygMcwPQ6xEPuVibiaBG6RtIzvQry8t3KyDyOnnGxGly1o0gmzZGRGNA7GuLgibsCqFoc/640?wx_fmt=png&from=appmsg "")  
  
  
星巴克数据泄露事件：攻击者宣称窃取10GB源代码  
### 网络安全组织ShadowByt3s攻击星巴克，窃取10GB核心源代码和运营固件，涉及咖啡机控制器、内部管理系统等关键资产，威胁公开数据勒索赎金。  
###   
###   
  
黑客借美以伊冲突的导弹恐慌伪造警报，窃取微软账户凭证  
### 黑客利用美以伊紧张局势，发送伪装成民防警报的欺诈邮件，诱导受害者扫描二维码进入伪造微软页面窃取凭证。专家警告勿轻信紧急邮件，避免扫描陌生二维码输入密码。  
###   
### Anthropic Glasswing项目揭示漏洞发现的未来：AI如何重塑网络安全格局Anthropic推出AI漏洞挖掘模型"Glasswing"，联合40多家企业测试，可大规模发现高危漏洞，挑战传统漏洞经济模式，预示安全防御将转向AI驱动和上游控制，但双重用途风险仍存。攻击者劫持AI工具链，LiteLLM沦为密钥提款机开发者终端因存储大量明文凭证成为攻击目标，LiteLLM供应链攻击事件凸显其风险。需迁移密钥至保险库、使用临时凭证、部署蜜罐预警，并将终端安全提升至生产系统级别。Claude仅用10分钟发现Apache ActiveMQ潜伏13年的RCE漏洞Apache ActiveMQ Classic曝出存在十多年的严重RCE漏洞（CVE-2026-34197），由AI在10分钟内发现。漏洞通过Jolokia API暴露，攻击者可利用默认凭证或无需认证（6.0.0-6.1.1版本）执行任意命令。建议立即升级至5.19.4/6.2.3版本并检查默认凭证。逾1.2万个Flowise实例暴露在CVSS 10.0远程代码执行漏洞攻击之下Flowise AI平台曝高危漏洞CVE-2025-59528（CVSS 10.0），允许远程代码执行，已遭野外利用。攻击者可借API令牌完全控制服务器，超1.2万实例暴露风险。漏洞源于未验证的JS代码执行，3.0.6版本已修复。  
  
攻击者利用Kubernetes配置错误从容器渗透至云账户  
### Kubernetes因配置错误和身份滥用成为攻击热点，威胁激增282%。黑客利用服务账户令牌窃取渗透云账户，甚至侵入金融系统窃取数百万美元。建议实施最小权限、短期令牌和运行时监控，防范集群到云的横向攻击。  
  
###   
###   
  
Adobe数据泄露事件：攻击者宣称窃取1300万份支持工单及员工记录  
  
### 黑客通过Adobe印度外包公司入侵，窃取1300万客户工单、1.5万员工档案及漏洞报告，暴露供应链风险与访问控制漏洞。建议加强第三方监控与数据导出审计。  
  
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
  
  
AI幻觉：网络安全中的攻防实现  
### AI幻觉在网络安全中表现为模型生成形式上专业但实质错误的内容，攻击者正利用这一特性进行数据投毒等新型攻击。防御需构建抗幻觉体系，包括RAG架构、输出验证和投毒检测等技术，以及风险分级流程和红队演练等组织措施，形成分层信任体系。  
###   
###   
  
Oracle Agile PLM 严重漏洞预警：CVSS 9.8 高危漏洞威胁制造业供应链安全  
### Oracle Agile PLM 曝出 CVSS 9.8 高危漏洞（CVE-2026-21969），无需认证即可远程攻击，威胁制造业供应链安全，可能导致核心数据泄露。建议立即打补丁或实施临时防护措施，并评估长期迁移计划。  
###   
  
暗网标价22万美金！Windows RDP高危提权漏洞（CVE-2026-21533）解析与EDR检测  
### CVE-2026-21533是Windows远程桌面高危漏洞，本地提权至SYSTEM，暗网工具售价22万美元。EDR需监控TermService注册表修改，结合行为链检测，优先打补丁并收敛攻击面。  
  
![RDP是什么意思？一文全搞懂RDP！](https://mmbiz.qpic.cn/mmbiz_jpg/icBE3OpK1IX1U57zFALN4XRoVpZOHmBKGORT7ERZIB454oBOUVgxbqAX6A5k90T6a8kEqGmpRTcmRKRPvyNIEwUbjZRRNl6AqMYcXvn5X4L8/640?wx_fmt=jpeg&from=appmsg "")  
###   
###   
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651336774&idx=1&sn=408127059513eb158f86aa2cfc845a5b&scene=21#wechat_redirect)  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR38TJMDLxr9EPGGib49oQymrvRy7vGw1iakQXBCr1Udmia4dpY3JSWYEEicajmhhcyfHly9YYPIziaCVPOg/640?wx_fmt=png&from=appmsg "")  
###   
  
  
