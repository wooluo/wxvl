#  【Net_AISec_hunter】基于 Wails + cursor 红队自动化 .NET 白盒漏洞挖掘工具  
原创 hyyrent
                    hyyrent  0xSecurity   2026-03-19 10:18  
  
# Net_AISec_hunter  
  
基于 Wails + cursor-cli 的红队自动化 .NET 白盒漏洞挖掘工具。  
> 面向授权测试场景，“白盒漏洞挖掘 + 红队打点 + 审计结果验证”  
  
  
![image-20260319173534814](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsakkOz9dkngpf02ib5T0krcyD2XYEMiacPCje9BnwmpRYqibu7Z7OHArn0KI0AnsXDXekEQro7cMzqZTtqPVrCiclDplnfSDoibm4LKQ/640?wx_fmt=png&from=appmsg "")  
## 解压密码  
  
私信发送  
Net_AISec_hunter  
获取解压密码  
  
程序运行到期时间2026/04/10，没有后门，若不放心可放虚拟机使用  
## 快速开始  
### cursor cli安装  
  
https://cursor.com/cn/docs/cli/installation  
```
```  
  
Windows 默认情况下禁止运行未签名的脚本  
  
![image-20260316170151228](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsalrUteGQZvjRAdOAMtro1OVVSwVHkvwnQjVuNUqqvDYvQKYMjeqDdHFGaReL0d3ZNticxmwKzHbtMJ5XQu4dSvdhZHxAzicQ4O7I/640?wx_fmt=png&from=appmsg "")  
  
如果希望以后直接运行   
cursor-agent  
 命令不用每次加   
-ExecutionPolicy Bypass  
，可以把当前用户策略改为   
RemoteSigned  
：  
```
```  
  
然后确认：  
```
```  
  
![image-20260316170304365](https://mmbiz.qpic.cn/sz_mmbiz_png/icLvb37WXsannenT0B6AJ00SUeWhS2Q5hicb4ibFmdSicATUTwObvFria5UtdyPJV64JdQbbcRKDIKCNh0UGtvUTBRoxicGicIibial4UqicDTcjJuHYA/640?wx_fmt=png&from=appmsg "")  
### 为什么选择cursor  
  
在安全代码审计场景中，Cursor 将大模型能力嵌入 IDE，可直接基于本地完整代码仓库进行多文件关联分析，自动定位调用链、数据流及潜在漏洞点，避免了在 Claude 中手动拆分代码、拼接上下文所带来的信息丢失问题  
  
按次数收费 20美刀=500次调用（某海鲜平台购买更加便宜），相比于claude、GPT按token计费有着更友好的价格  
### 创建key  
  
https://cursor.com/cn/dashboard/cloud-agents  
  
![image-20260316170615080](https://mmbiz.qpic.cn/sz_mmbiz_png/icLvb37WXsan148FIsSg1l2nWKgBUgP7vAck090mc44j2U7iaunx6RIsRU6fUWg3BS3WWQo5McloAxmhVibrmmvGvv4SAiaVYgt0MWByDUW4yes/640?wx_fmt=png&from=appmsg "")  
  
调用命令验证  
```
```  
  
![image-20260316170700058](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsalBTg3gtiaDRt5eSicfjXemVpiaoUILppEiaMNJlAgENib7gUuJkhibcTHdzyXZx1nx2sQe4gwMZUnric0PVibWMgfZwRIPibpWAIEiaUkes/640?wx_fmt=png&from=appmsg "")  
## 使用流程  
  
选择目标扫描仓库目录   
  
![image-20260319103939059](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsamjU0RcXPzN08Lb6S0E8LyvnxCIubJAOkZ2s6JtPERIM9FJfwGhhSCYsLrZgrjQEdV707IysKyfaGtSjMiadFpSQzkMbS5gicVuM/640?wx_fmt=png&from=appmsg "")  
  
配置 API Key / AI 模型，验证key有效性  
  
![image-20260318180722235](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsakk5xIrydiaPzsjKJnW3aMnI9sst2fnicZMUT7ichzjoWa4bfQ9HGB7oLaCMtgAlmOW1yIWzu1JicPiavvB862kaISjWE4dvqFQmicf8/640?wx_fmt=png&from=appmsg "")  
  
按需勾选：去混淆、反编译，如果已经反编译好则不需要勾选，然后开始扫描（阶段化执行）    
  
导入报告，在 Repeater 中导入报告数据包并做二次验证  
  
![image-20260319173704701](https://mmbiz.qpic.cn/mmbiz_png/icLvb37WXsam19DvBHkYK7A5Yg4jIrUzbocqCPIiaksvVsu5S7DunibNMlrd0vFhibDnbMk7EeCRALGDKxEoIdp5JxV7Pk3s1hUxZBmO6X5AaH4/640?wx_fmt=png&from=appmsg "")  
## 合规声明  
  
本项目仅用于合法授权的安全测试与研究，适用于：授权渗透测试、内部安全审计、攻防演练  
  
使用者需自行确保测试对象和行为符合当地法律法规及组织规范。  
  
  
