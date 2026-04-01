#  EDUSRC越权漏洞通杀30rank实战案例  
原创 尘佑不尘
                    尘佑不尘  尘宇安全   2026-04-01 02:00  
  
小程序越权漏洞一个报名的功能  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RDiaL6j1Wgd7SMfx8yrOHtV2ibyDhJjkWWriaXArS7ib83Sdybq2BRvCzVs4KjTsDPs0enRVvkkcLI3K1sjeqDnS4ye2InU3G2OsWlYOKGXkQuk/640?wx_fmt=png&from=appmsg "")  
  
点击取消报名  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RDiaL6j1Wgd6U7jZaIP9aD2EuUERPIF1KpIiasa38u0zjDQQEdcRAn923QdxaTItcYiab0ibUx8zOu3ibIr77SE68Os5eB0RVNuT0olfibQKiapq88/640?wx_fmt=png&from=appmsg "")  
  
数据包如下：  
  
报名取消是显示200  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RDiaL6j1Wgd5v0lvosrVaYxb7nFrl7FcWdLFjyTcab3snh1oUMsOtHaMicOsBCQf2pV3fO1WmwHVKXdRKkXVWzaFxQa3xmGBnoQv9yb4wWH0c/640?wx_fmt=png&from=appmsg "")  
  
id为个人id，如果未报名取消是如下情况：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RDiaL6j1Wgd51EPrz7DT6icgiakRiawh4ias1sLYgFAt3WTJLPicCAenuBr4c34R4lxBkCia77MIOjEcu8bRjkprBGTfCdq4VaerFrn1VC1hXxWqcU/640?wx_fmt=png&from=appmsg "")  
  
取消后再取消如下  
  
拿这个id举例  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RDiaL6j1Wgd6DevuibkhhHQRyrrgtHpibTmwtKkSYxmAzbRSIiafOIDRrPkzThoibZngl3co4Fg304tTGMvZOqFARlTHVkiaFMt8wT1ia6gFLjrLlw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RDiaL6j1Wgd61qkB2wAGUDjHuICgUQoFg2lNTiaI86oiasboU4UGdj6ePehicM2gXQoicBYXPCnB6PnstsjvFmMViaNFZbfzAzKKCJiboYQZTj3FiaM/640?wx_fmt=png&from=appmsg "")  
  
随后直接找寻通用系统，小通杀一波  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RDiaL6j1Wgd4lTAkJzaSN1EGQCt68v73GvB3rGPLW7rJ19y4nEicXxpnUJmm2pbgmQGFrFLPTdPf1YiaiaCAyicLKJSqGv44qQFQEoOk5RBvyzg8/640?wx_fmt=png&from=appmsg "")  
  
  
  
