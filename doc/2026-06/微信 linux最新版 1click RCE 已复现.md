#  微信 linux最新版 1click RCE 已复现  
 Say Sec   2026-02-10 07:59  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/1mtwZURvGTkCK3ZFyqYEyTwmaLo2YSMeibz3eeShkewiadS4oh0RBl1U7BTVeEscGQrEbjWKcQzGpJEFLwr4cFQw/640?wx_fmt=gif&wxfrom=13&wx_lazy=1&tp=wxpic "")  
  
  
## 前言：  
  
文中技术分析仅供交流讨论，poc仅供合法测试，用于企业自查，切勿用于非法测试，未授权测试造成后果由使用者承担，与本公众号以及棉花糖无关。  
## 正文  
  
  
## 今日，有bro在朋友圈发了如下内容：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/IicMcDFtTOlPWVeicJo8Uxew1f0POScnuFGKumofv1Wq2MVzFNssCKyJETAp6XlpsOibE2hc17xhYukbp2qm5kUDYyC4LKvXqAfXDpe5dZkiaRQ/640?wx_fmt=png&from=appmsg "")  
## 简而言之，微信 linux版本存在1click rce，只需要将文件名使用反引号包裹命令，目标点击文件即可执行，复现：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/IicMcDFtTOlOL8iaEy6m8nEg59PFIKqLdAMKsB8MglUQmz1SwgNYFyVrd70uN5oDIiaUTq2zucjpSrRnj5y6pOGa6DqbIxVzUehmjdL82bSwfI/640?wx_fmt=png&from=appmsg "")  
  
  
  
