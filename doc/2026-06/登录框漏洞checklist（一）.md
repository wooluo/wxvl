#  登录框漏洞checklist（一）  
原创 游山玩水
                    游山玩水  山水SRC   2026-02-23 06:10  
  
## 概述  
  
本文讲解了在渗透测试中遇到登录框时进行测试的部分checklist（检查表单）  
## 登录框sql注入  
  
测试方法：  
  
使用bp插件：xia SQL（该插件会对数据包的每一个参数进行注入并和原来注入前响应包的长度进行对比）  
  
地址：  
https://github.com/smxiazi/xia_sql  
  
测试步骤：  
  
①打开  
xia SQL的监控（底下的payload可以用自带的也可以问AI让他写一些，如果该工具实在不会用就去哔站搜视频）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8tDOXFoCoQ9icsJLO9D9FCMqJjPdVrH7LpbGMqAaEXSttfq8nNb9uSHeka1N56hibOfPder3icsEeLjL3MfTLMKCkNROSibIWViaBNqibQ6BeutVk/640?wx_fmt=png&from=appmsg "")  
  
  
②在登录框位置输入任意值提交表单（点击登录）就行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8tDOXFoCoQicwsKtXFYuUWdkXKwFCZWpBlZJY0Htep0w4zQcS3uufCLVp5HNQia8ibVVFyFRbpn6pk2f4J3pVibNcnicwogpiaCrH464Tnk18NdRs/640?wx_fmt=png&from=appmsg "")  
  
寻找有对钩的数据包（这代表注入后响应包长度有变，这种可能存在sql注入）  
  
具体哪些需要进一步使用sqlmap测试  
  
①响应包长度变化很大的  
  
②响应时间变化很大的  
  
为什么这些需要进一步测试：  
  
我的测试payload：  
  
%df'%20and%20sleep(3)%23（  
时间盲注探测，响应时间**显著延迟（如3秒以上）**  
）  
  
'and%20'1'='1和'and%20'1'='2(  
布尔逻辑测试，1=1**响应长度**  
 应 **等于或非常接近**  
 原始正常请求的长度，1=2其**响应长度**  
 应 **明显不同于**  
 真条件时的长度  
)  
  
'和"（  
探测闭合字符与错误，**响应长度**  
 与正常请求**显著不同**  
（通常是变短，返回一个错误页面）  
）  
## 弱口令  
  
测试位置：  
后台、管理登录入口  
  
测试需求：根据指纹探测出的OA系统来测（OA系统一般都有默认密码，  
如用友致远A8 v7.0、泛微OA e-cology 9.0、蓝凌OA等）  
  
如果找到了后台但没有具体oa且密码不是admin/username/password这种如何解决：  
  
使用工具结合信息收集到的管理员信息/公司信息进行生成密码  
  
工具地址：  
  
https://github.com/zgjx6/SocialEngineeringDictionaryGenerator  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8tDOXFoCoQibMyGQGDofRRtKudWEj8H6icaAwjRpibMvbE2vAQTBmHdIsibvYQUB8lpXG4IWS6GoXVE8pYkZRNM7lejXgIX5PXwYKZLIe8jzzBE/640?wx_fmt=png&from=appmsg "")  
  
## 用户名枚举  
  
测试：在登录框输入账号提示用户不存在而不是账号或密码错误就存在  
  
用途：一般结合别的漏洞进行使用，比如找到个任意用户登录结合用户名枚举就能登录别人用户（  
单纯的用户名枚举漏洞是不收的，补天试过）  
## 任意用户注册  
  
案例：  
  
①在注册位置让填的手机号或邮箱可以随便填，对方只检测格式不检测是否存在  
  
②需要手机号验证码才能注册，但是只要填写不同的用户名就可以一个手机号注册无限个账号  
  
③在注册框检查手机号是否存在，但是在登录后的个人页面处可以随便修改手机号（没验证码检测），导致一个手机号可以无限注册  
  
  
该漏洞收（亲测有效）  
## 密保找回  
  
密保存在于源码或返回包中  
  
测试：  
  
①在前端源码中搜索密保（ctrl+F）  
  
②返回包中寻找密保  
  
出现位置  
包括不限于Header头、Cookie、Body中  
## 密码找回第一个url直接跳到第三个url  
  
密码找回第一个url直接跳到第三个url（  
绕过验证直接重置密码  
）  
#### 场景一：URL分步式（直接跳转测试）  
  
**漏洞特征**  
：密码找回的每一步（提交账号、验证身份、重置密码）都有独立的URL。  
  
测试步骤：  
  
①正常走一遍密码找回流程，用Burp Suite抓包。  
  
记录关键节点URL和参数。通常流程为：  
  
**URL1（身份提交页）**  
：提交用户名/邮箱/手机号。  
  
**URL2（验证码验证页）**  
：接收并输入短信或邮箱验证码。  
  
**URL3（重置密码页）**  
：设置新密码。  
  
②在URL1处输入账号点击下一步，当浏览器**正在加载或显示URL2的页面时**  
（例如，显示“请输入短信验证码”的界面），**手动选中地址栏中的URL2，将其完整替换为URL3的地址**  
（例如 .../step3?token=xxx  
），然后按回车访问。  
如果能绕过输入验证码则可能存在该漏洞（修改密码后尝试是否能登录进去）  
  
#### 场景二：单页面应用式（API调用测试）  
  
**漏洞特征**  
：整个流程在一个页面内完成，URL不变，通过前端API与后端交互。  
  
①使用bp抓包观察完整步骤（重点关注每一步操作（点击“下一步”或“获取验证码”、“提交验证码”、“设置新密码”）时，**前端向后端发送了什么样的API请求**  
（通常是XHR/Fetch请求））  
  
②从抓包数据中找到  
  
**最终设置新密码的API请求**  
（例如 POST /api/reset-password  
）。  
  
将这个请求发送到 **Burp Suite Repeater**  
 中，进行send  
  
尝试经过输入用户名后**不经过“获取验证码”和“提交验证码”这两个前置API的调用**  
，直接发送重置密码的API请求。  
  
③观察页面是否变为重置密码页面，进行重置密码尝试  
  
④测试修改后密码是能登录  
  
  
