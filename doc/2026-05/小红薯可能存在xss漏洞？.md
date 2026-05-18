#  小红薯可能存在xss漏洞？  
深情哥
                    深情哥  湘安无事   2026-05-18 16:21  
  
今天有人再群里面说小红薯存在xss漏洞，点开一开，还真的是。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9EuicJFpJ0SNdU0F8h1j6BRyJZ8nz3zzElCNBteicL85QqGdx76mIzj0bvH2TV8MFlgXC1YicQibKCUvovCh03vqodEav43KYgZrvoo/640?wx_fmt=png&from=appmsg "")  
  
打开一看  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tlibgKYKL9EuQPnL1AfIQPiaCic7LSEibrBftAOCCF1zcfXTlGCHa3kNqn5XcJ0Bwa8blWOOt2Gvkk3adUKxzMSRibNLniaea1anGqp66usO6DnxM/640?wx_fmt=png&from=appmsg "")  
  
深情哥分析了一下，应该是个人资料这里  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tlibgKYKL9Et69mhdZb3bH3bTISNf5BykXgFblW8Y7eyzvu1x7IRxz9EiaFcbdYxMlshjFIe8GGk144FZEhq2ia5aL3dnDpbYTdAibMXCISLcPA/640?wx_fmt=jpeg&from=appmsg "")  
  
但是我打xss的poc一直报405，有xss绕wafnb的大佬可以试试。我只能解析一下<s>的标签了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tlibgKYKL9EtrytiaX2YtDNX64NZXXM7UUPdf1N6hibCj9KRkZq10Yekr75OjjMqnqha4lUQOfjfLOlMVhh6c5g5VcLibXY79pfVNvt8xXAafF8/640?wx_fmt=jpeg&from=appmsg "")  
  
奇怪我看他的个人简介是xss的poc  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tlibgKYKL9Etf3NOLI5aSQwzGPdYU6ic3Fh5Z42AgrMgnXRuyXbAXBUoAKGqkbmwDiciaCyfGLNwJxwjf05pjQbHrneF2Tib8iapQc1fvxoNZRpnQ/640?wx_fmt=png&from=appmsg "")  
  
分析不出来原理，只能跟大家一起研究了哈哈  
```
https://www.xiaohongshu.com/user/profile/5d2df3c0000000001000eb06?xsec_token=YB_k6JDMgYnHs-isIwMgR_2IhtmwidLaDCncpFR0dp1P4%3D&xsec_source=app_share&xhsshare=CopyLink&shareRedId=N0o0REk4Rzk2NzUyOTgwNjczOTdJRzY_&apptime=1779121072&share_id=fb004d1f926147f8a467c6976a2cb101&share_channel=copy_link
```  
  
只能解析个<s>标签了，拼尽全力呜呜呜，再研究研究  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tlibgKYKL9EtW03dgyZia8DX6ic0AchjBcAjxUqtVbFN9M2iaUPEpVapAX8HkRtyRkeyricnM5xAvf21vEDiclcrFOP6PY7EVw4oicSpNr9pskJxyM/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
  
