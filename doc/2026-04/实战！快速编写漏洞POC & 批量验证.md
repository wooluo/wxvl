#  实战！快速编写漏洞POC & 批量验证  
原创 無名
                    無名  无名的安全小屋   2026-04-26 02:17  
  
01  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SgRVa0DmgbGnAF6bcuRyFkYeKXCw4HhUO1aLC1bjYErLMfl5qNdx8fCJ5PpraI7CB5rEqC7MMCsOohyzxS7icYOGSD1NXJHPnVXZZgQh43Rk/640?wx_fmt=png "")  
  
前置知识  
  
玄域靶场：www.shangsec.com  
  
  
目前已建成  
web、安卓、苹果渗透靶场！  
  
  
所有操作均在**玄域靶场**  
中进行，大家也一定要遵守这个网络安全法！  
  
  
首先，什么是漏洞POC？  
  
  
简单来说就是验证漏洞是否存在的脚本  
  
  
02  
  
  
基础环境配置  
  
nuclei 开源项目地址：  
  
https://github.com/projectdiscovery/nuclei  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbG6No7YLommiacwu7ozYtjV60UUC52a4r4G9LEJ4Y4ouyhXv72mQpaUpNrKj0ydLr8AXpIWz4ugTsATZx7svkicibNDSXLmsuvmu4/640?wx_fmt=png "")  
  
  
burp nuclei 插件  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbFHpXU8j7cGJqY6zQPUx5rlNwfGtjK4nIziaxtwMcrR0S1Zfnuo6vDou1iaCnu1k4wZbZHNr3ZPjWGcdV2ibuWThOgQGP7t7ZuGOQ/640?wx_fmt=png "")  
  
  
  
03  
  
  
实战演示  
  
可以先来到CTF-SQL注入免费靶场环境  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SgRVa0DmgbGjNU9ibG8UBhaW5DUZWvHQ8Iib5F6icBDcVyadtpVDA7EHZhOL9M02TZusMIfbpnVfNhSDYUQ8coc9IbTBfo68DlZEibpz74EnjHg/640?wx_fmt=png "")  
  
  
首先进行手工的SQL注入漏洞验证，再根据特征编写漏洞POC  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbGy8QRPs9ZicE88JM509Ud2XibUuXibDZHGR5PxNchPYJic2da13EAOicWhwcyUK1icEZBRKbIRFOMbdC2B5ULcH7hDoJGnnuJ24DBtA/640?wx_fmt=png "")  
  
  
标记好返回包中的特征值，然后发送到nuclei插件中去  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbGd4oZNrY6tlkOzQBAhEHGOUKHcTZTs1XzrHm4HD4jINIhzyiak2eJvOPDwnZSQq3d8eCiaAEZgGgibwXnDicZn5VPWyibFHbxxBT90/640?wx_fmt=png&from=appmsg "")  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbFWLp0FSvra5SZLEWNdia06FsEEMwG5poj4oT1Hu3oWwUl1vvFvkCe6pMOqLcsLUz3TZ2LNeKVPNWZMRFvmx8iayXYUGExtFB2BQ/640?wx_fmt=png "")  
  
  
然后可以根据漏洞类型修改相应描述  
  
然后保存即可  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbG55vcC4HS1iaWZUwPtdNSbjz37bTNskaiaDVoaVv9b3kxMLwtOucL7dtTbibFxv9La8SiazJvwhlSmSQws5gJQT7ic80aqYrNf5dJc/640?wx_fmt=png "")  
  
  
接下来就可以通过nuclei加载该POC文件，后面就可以进行自动化漏洞验证了  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SgRVa0DmgbEGdTKMZroXMcTnURoDxmMDric4QhybXjicicqq8mPib2UichRgrn3AyFCzfW4UlQs7MSryViaxoGlD2C8rH4AsBRakjeBtoWib2sjeks/640?wx_fmt=png "")  
  
  
补充：批量扫描可以使用 -l 参数加载URL文件  
  
  
  
04  
  
  
学习交流  
  
工具包、资料  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SgRVa0DmgbFYl44JKtTXF4EH3LApMu5ia3CltKLaZAhLkXQdJkiceDRx5ITphvWrRJNV1MJWZhs3zNe19YBSNEOSU5bsmWSaMRgAegMjib0qF4/640?wx_fmt=png "")  
  
若已过期，可以添加平台客服  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SgRVa0DmgbETr8zVCoICBjA7edGOWDsHcMRDt0KEcjzX3J1yjB8Py7ib8y4PFIGibp0RhoBxFPQS1oh1Fl2ocibmfr2QVfoRw29hBUXjTBFmpI/640?wx_fmt=png "")  
  
[【黑客基础】如何手工进行SQL注入？实操演示！](https://mp.weixin.qq.com/s?__biz=Mzk0NTYwNzY3NQ==&mid=2247484459&idx=1&sn=bcc78d09e1106bfff2475d13e5fb7a74&scene=21#wechat_redirect)  
  
  
  
[【支付漏洞】金额溢出导致的0元购-网络安全](https://mp.weixin.qq.com/s?__biz=Mzk0NTYwNzY3NQ==&mid=2247484444&idx=1&sn=7135128fca759d790cbda3e7d48ce3f2&scene=21#wechat_redirect)  
  
  
  
[700万美元加密钱包被盗事件概览  | 其中的Vshell是什么？手把手带你安装和配置！](https://mp.weixin.qq.com/s?__biz=Mzk0NTYwNzY3NQ==&mid=2247484415&idx=1&sn=d15620b3fb1dc99dac1699fe3800e6a2&scene=21#wechat_redirect)  
  
  
  
