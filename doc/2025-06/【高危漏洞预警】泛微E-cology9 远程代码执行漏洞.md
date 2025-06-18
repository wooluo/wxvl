#  【高危漏洞预警】泛微E-cology9 远程代码执行漏洞  
cexlife  飓风网络安全   2025-06-18 09:19  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibhQpAia4xu03Ut790ricpehIavwqb4fWqlGqQhQ4AcBvx8NfFibcpnLEOaQPwM3R6ngqiagxKVrib3ALpVOvN6ZqrhQ/640?wx_fmt=png&from=appmsg "")  
  
漏洞描述:  
  
由于E-соlоɡу将用户可控的参数拼接SQL语句造成SQL注入漏洞,攻击者可利用该漏洞向数据库中写入数据,并利用Olе组件导出为Wеbѕhеll实现远程代码执行进而获取服务器权限。  
  
攻击场景:  
  
攻击者可能通过上传恶意文件或SQL注入攻击系统实现远程代码执行获取服务器权限  
  
影响产品:  
  
补丁版本 < v10.75  
  
修复建议:  
  
泛微官方已发布修复补丁,请尽快更新至v1075版本补丁:  
  
https://www.weaver.com.cn/cs/securityDownload.html   
  
缓解措施:  
  
可配置防护策略限制访问漏洞相关路径  
  
  
  
