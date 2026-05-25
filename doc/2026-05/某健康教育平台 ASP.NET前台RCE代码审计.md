#  某健康教育平台 ASP.NET前台RCE代码审计  
 威零安全团队   2026-05-25 07:50  
  
# 现在只对常读和星标的公众号才展示大图推送，建议大家能把威零安全团队“设为星标”，否则可能就看不到了啦！免责声明本文章仅用于信息安全防御技术分享，因用于其他用途而产生不良后果,作者不承担任何法律责任，请严格遵循中华人民共和国相关法律法规，禁止做一切违法犯罪行为。由于传播、利用本公众号所发布的而造成的任何直接或者间接的后果及损失，均由使用者本人承担。威零安全实验室公众号及原文章作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
一、前言  
  
  
    来给尊师投稿一个ASPX借助AI分析挖掘出来的首洞！  
  
二、框架识别  
  
    该系统基于   
**ASP.NET Web Forms**  
 架构（非 MVC），核心入口位于   
AMHWeb.dll  
 中的   
MvcApplication  
 类（Global.asax）：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTomClMFu85GbicicsShg9WXYFHWUXf46gBfhD45PvwfBbYicia053yxRdaKS9bCFXTcjq8Uhw9Gb7rI5A1iaKTSflmvtxjnaia5FJC0/640?wx_fmt=png&from=appmsg "")  
- Application_BeginRequest  
 中没有调用任何鉴权模块（如 FormsAuthentication、自定义 HTTP Module）  
  
- 没有全局的   
AuthorizeRequest  
 事件绑定  
  
而且法发现  
该系统存在  
**两套独立的鉴权体系**  
，且完全分开管理：  
  
三、鉴权分析  
  
    主系统登录入口   
/ashx/Login.ashx  
:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTFLwcm72BcBl7VBy2jOWCoAUZ9w7G1y7rNjpvzmib5CJC4SrY0pLUhuSxyE6yicnbzGpj7MaNXvmDxQFaPl2Wto7tmLOYrRgfhM/640?wx_fmt=png&from=appmsg "")  
  
    用户类型包括：Student, Parent, Admin, Counselor, SchoolSuperAdmin, Teacher, CommissionAdmin, SuperAdmin, ClassTeacher。  
  
    鉴权方式：部分后台 handler 在处理请求前  
**手动检查**  
 Cookie 或 Session：  
  
这里也就是尊师常说的文件开头鉴权。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTp2LpujeZf43PVYmaribg1oW0MjTwEl8icXibslnuAPc8LLRYYY2hicEic8QjGXOpARBl2ryQUU0aspELYNtns1saicO9fF7pcZia7xg/640?wx_fmt=png&from=appmsg "")  
#### 前台WebApp鉴权  
####   
  
    前台门户   
/AppWeb/ashx/AdminLogin.ashx  
 独立使用  
**纯明文 Cookie 鉴权**  
：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT3qH2gWFYQjYgCyISPFiaLulA3ZnBJia11QgMRjRDTnrMFiaM2gJfs1HsFiaZOW4DicSokHErAbXiaRmuenia5UCuXzicAChvKGtBibL1M/640?wx_fmt=png&from=appmsg "")  
  
其中   
WebAppAdminLogin  
 直接在数据库中明文对比密码：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kR8Tc3FnK7uSickFIo4rYovyC3j9paBNTzSn7BPZn4iaia9P5679qbolz9o7Wzx3QZIIAsSHlZUibwfGSXNcYmVyftPhibILtYIwnJ4/640?wx_fmt=png&from=appmsg "")  
  
该框架的鉴权不是通过中间件/模块全局强制执行的，而是  
**依赖每个 Handler 开发者手动编写鉴权检查代码**  
。这意味着：  
- 如果开发者忘记写鉴权检查 → 该接口就是  
**公开可访问**  
的  
  
- 没有编译器级别或框架级别的强制鉴权约束  
  
- 没有任何 Base Class 或抽象方法强制子类实现鉴权  
  
所有   
/AppWeb/ashx/  
 目录下的 handler 均直接实现   
IHttpHandler  
，无任何基类：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kS9pcJ3XASicnVqjEHPUrnBfzVNOYn5E2U1CvMnVXw53QkJWxObhLGOibdiaAxmEr5ialkWpDDazRGNnmBHkPMKOJPbLa5Sqpw7t5s/640?wx_fmt=png&from=appmsg "")  
  
四、前台RCE  
  
  
 这里直接进行定位到相关的文件上传搜索特征  
SaveAs(  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQxKGXepUYAmqmGIRBk5hM8QAcx41iajxjnfPhhyRXve2APeQx81eKjcrmfQMVaHMP4mzBREFlHPeiaLYwmCQoLdED4LMO17Mo7w/640?wx_fmt=png&from=appmsg "")  
  
        可以看到没有任何过滤直接将文件进行上传，并且也没有进行鉴权处理，前台可以直接进行访问。  
  
/xxxxx/ashx/ImgUploader.ashx  
  
尝试进行漏洞利用。  
  
  
五、漏洞复现  
  
  
    构造相关的数据包，成功RCE！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kT18wzp9kIkiapoL0Ul8CSDal9IdxoPu59qJwGmlRc9HvyFWWiap6Nia6mP7NQ2gvx8AnjxsjqPcYqCDkzlxC81iaMYQ84lAVWvFyQ/640?wx_fmt=png&from=appmsg "")  
```
```  
  
  
