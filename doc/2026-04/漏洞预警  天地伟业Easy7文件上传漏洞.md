#  漏洞预警 | 天地伟业Easy7文件上传漏洞  
浅安
                    浅安  浅安安全   2026-04-28 23:50  
  
**0x00 漏洞编号**  
- # 暂无  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
天地伟业Easy7综合管理平台采用分布式架构，融合模数混合切换显示、用户权限控制、数据存储点播等功能，具备智能检索、视频诊断等特色应用，能为各行业提供高效可靠的安防综合管理方案。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SWaLw2vQgZuyUrIFYzJaw7Wq8JT3p6gtDdlQkjnCfQTfZgUJ0NFdz1icCuk7DcAviaMZGvrmxkTGVhQ/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**漏洞类型：**  
文件上传  
  
**影响：**  
上传恶意文件  
  
**简述：**  
天地伟业Easy7  
的  
/Easy7/apps/WebService/UploadOwnerImage.jsp  
接口存在任意文件上传漏洞，未经验证的攻击者可构造请求包，上传webshell文件并保存在任意路径，从而控制服务器。  
  
**0x04 影响版本**  
- 天地伟业Easy7  
  
**0x05****POC状态**  
- 已公开  
  
**0x06****修复建议**  
  
**目前官方已发布漏洞修复版本，建议用户升级到安全版本****：**  
  
https://www.tiandy.com/  
  
  
  
