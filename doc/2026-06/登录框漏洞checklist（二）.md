#  登录框漏洞checklist（二）  
原创 游山玩水
                    游山玩水  山水SRC   2026-02-24 05:44  
  
## 概述  
  
本文讲解了在渗透测试中遇到登录框时进行测试的部分checklist（检查表单）  
  
## 本地ip限制或白名单限制  
  
案例：  
  
1.收集到了类似于后台、管理登录入口的url，  
直接访问返回404（或无权限）。  
  
2.修改ip为127.0.0.1后能进去  
管理登录入口进行下一步测试  
  
测试前提是：**目标应用程序的IP检查逻辑依赖于这些可被篡改的HTTP头**  
。如果服务器直接从TCP/IP连接层获取客户端IP（如 REMOTE_ADDR  
），则修改HTTP头是无效的。  
### 添加ip为127.0.0.1的方法：  
### 使用bp插件burpFakeIP  
### 地址：https://github.com/TheKingOfDuck/burpFakeIP  
  
发送想要访问的  
管理登录入口的url，但访问为404的数据包到repeater模块，选择127.0.0.1，别的也可以自己根据需求研究（有随机ip的功能）  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8tDOXFoCoQicA8dGc2WjibqnbTc7ujLbK0vteejDQ4UKAvu8ZibEoWJyOzChU3qZXUFib3AFTndp3etxOPAYSbkaAzWCtcWwxib1km4hqvH1RzME/640?wx_fmt=png&from=appmsg "")  
  
效果图：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8tDOXFoCoQibUObr9iajZmuuJlXEoBaMXUibOG7gWaDjY4EaH7bicMmD47GziboFo8Km7AbmOOrZeX544f0Nib6WYaFgFqygq7HnQ2r2nxVH72vVA/640?wx_fmt=png&from=appmsg "")  
## 修改返回包/空密码任意账号登录/修改请求包step  
  
修改返回包：在和登录框有关的登录/注册/密码重置都可以修改返回包  
  
测试流程：  
  
1.走一遍想要测试功能点的完整流程，并将返回包记录下来  
  
2.在步骤中输入错误内容（验证码错误等），但是修改其返回包为正确的  
  
3.如果能前端绕过，之后尝试是否能登录（遇到过很多只是前端显示了修改成功，但是实际后端没有修改）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8tDOXFoCoQ98C11IWykzq0pOhFx97ZZBUibickT7xoA5Bkq0ibLs13aJibTicMVjTPa4LbTDNgn4m6DAVwIp6fShicsK5o2yxrO7zdyzQIDZgYJ64/640?wx_fmt=png&from=appmsg "")  
  
  
空密码任意账号登录：  
  
password=  
  
将密码填写出置空/true/null/1/  
undefined  
  
  
修改请求包step：  
  
案例：  
有些平台的注册需要审核，未审核账号无法登录测试。但发现登录请求中存在 step=1  
参数，用于判断账号状态将 step=1  
（待审核状态）修改为 step=2  
（已激活状态）或其他后续步骤的值重放请求  
  
扩展：此方法适用于所有**分步流程**  
（如实名认证、资格审核、交易下单）。关键在于寻找控制流程阶段的参数（如 status  
, phase  
, level  
），尝试“跳步”以绕过中间校验。  
  
## 根据登录框的路径猜测注册框的路径  
  
**现象**  
：目标网站仅有“登录”和“忘记密码”入口，无显式“注册”功能。  
  
**推测**  
：注册功能可能被前端隐藏（如无链接），但后端接口依然存在。  
  
**测试**  
：将登录接口路径（如 /api/login  
）中的关键词 **login**  
 替换为 ****  
  
**register**  
、**signup**  
、**reg**  
 、creat、add等，直接访问。如果仍不存在直接将他完整url问AI让AI给你猜  
  
建议：可以自己写个登录框有关的字典用来方便爆破  
  
  
