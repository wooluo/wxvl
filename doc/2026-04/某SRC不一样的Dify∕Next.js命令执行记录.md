#  某SRC不一样的Dify/Next.js命令执行记录  
安全艺术
                    安全艺术  安全艺术   2026-04-29 02:30  
  
某SRC收集到的一个资产  
coreagent.xxx.com，这个资产在1月份就有收录了，按道理这么多师傅挖，应该都扫描过了吧，但是我用dd2去扫，还是可以进行命令执行的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvPpicubVJs73I0IaG1wE5hfcwKicOI0EUMEeiamnjEusjlY2icT5Nn2rCKTP12tzDNI1OmhW8QQ3RyhuW8loCVwkQ98jcsYibZiaD8zU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6mEJuibtxKvNsu9MT3rzgzF53d70gZt9HbSlC2ictb5vMKbljS5FpWgjBIbE3aUsYbNQMahElVzobEls0m4CRYMGRwIzqsPF9egom00ibqv8FQ/640?wx_fmt=png&from=appmsg "")  
  
其实这个就是之前某位师傅反应的chat接口关了，但是其它路由未关闭还是可以触发rce的，和师傅讨论着就随意脑补了下，大概是这样子吧......  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvPs6KjibDptBpueTib37853kznvvZEeMVRB41iaYafJDeueojg0yCiawicib2JkKAXoD1ax3wTs9gWKiblfwlQrhM0A7icF1ALjm8X9ibU8/640?wx_fmt=png&from=appmsg "")  
  
然后就可以r了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6mEJuibtxKvO9PxtmmVdpTR3SJqRfT8qe5fRRfd0FXibqaaNvBgCmKbNf7t54kUcrm3TeuYNSDvIkl4fRicGRQz17toBnSppzdugRfibHDvwmck/640?wx_fmt=png&from=appmsg "")  
  
相关路由接口已内置到dd2工具中，后边碰到其它的继续加吧，感兴趣的师傅们可以加入我的小圈子哈。  
  
本周新上线功能：初步实现js和api爬取及敏感信息提取。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvOSnPPF7s1xezGVoDtRaBpWpryLibhQt70OntjRLn7eiaIEId6h1MYfIgjAyH2QFjFROiakdkiav3E2uF8k4Cq3kzClaRRZaWWUHPM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6mEJuibtxKvP46tD9cbcSW6Jw4CahUo0zEo7oL9fTZMsiciafZQddicgXESZOGurBhwgKVzn4Sm8nmicEpUIonZtNkBg1tia1u6xaxdLtRBzcDfnw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvO1sCyxtbYCatefqboTeScw6QF3jdicabhLpeOG1jV4MksDWw3edhFvDfgfxZ9ibkRCrgInZ7Ke3RFm3xOTYzZMPRnY0BGp7hLzs/640?wx_fmt=png&from=appmsg "")  
  
  
