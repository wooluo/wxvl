#  【转子女神更新与0day挖掘】浅谈用转子挖掘0day的思路式，末尾有免费的交流圈  
 是小芸吖   2025-07-17 13:39  
  
“海内存知己，天涯若比邻”  
  
”这里是雪山盟，承蒙各位师傅的厚爱和支持“  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGcJNeVezzpfbH3G1ajicvk8OWDzen1bZCQvWoxQ9IcAC9OoN2ia7nuGTw/640?wx_fmt=png&from=appmsg "")  
  
感谢名单：http://zhuanzi.com.cn/thank_you_list.html  
  
非常感谢所有在转子女神工具上给予帮助的每一位师傅  
  
#------------------------------------------------------------  
  
“”“  
  
历经10余天，转子女神来到了1.1.7版本，更改了扫描的方式，可选的1-3次迭代的扫描，新增了代理，延时等等功能，修复了众多的BUG，再次感谢各位师傅的支持  
  
”“”  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGicLyHkRVCQ4cnuccRY8khE69sRDklwSR3DHvAXqJmAgxHWyBic9V9fTw/640?wx_fmt=jpeg&from=appmsg "")  
  
更新内容：  
```
```  
  
  
接下来是使用方法：  
  
--cer : 过证书  
  
--time=5 : 超时设置  
  
--url : 自定义URL的拼接  
  
--proxy=http://1.1.1.1:8080 : 自定义代理  
  
--sleep=5 : 请求的睡眠时间  
  
--scan=3 : 迭代扫描的深度，最高为3，默认为1  
  
#------------------------------------------------------------  
  
接下来是关于  
0day的出货方式与思路  
  
来自【落樱时】师傅的投稿：  
  
这位师傅在进行黑盒测试的时候，扫描的过程中发现了一个敏感的页面  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGLCwqSmAPTs2lUETQqfZkWAqn0y3lCTzPVMAdJXq6oXRDlxSnibkdrfQ/640?wx_fmt=png&from=appmsg "")  
  
经过查看，该厂商的资产超过1.5e  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGniaxNibIMp7hllwyOUpUflDWwnxiamBx93Y7HJIolaeUY9fn4G8icSMXTA/640?wx_fmt=png&from=appmsg "")  
  
请求后是这样的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGjTGgX4ibQqhMvnb2icqQ1ibw7MQhiaC1gE6RwZzZkQOwDDkLs02V81giaqg/640?wx_fmt=png&from=appmsg "")  
  
查看响应头会发现拿到了session，将session填入到这个请求下，进行fuzzer，并遍历包中的ROLE_ID，成功拿到管理员的账号密码  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGJw7dibcHadXxuKfDZvI7e5Ze0oRdO2zZ8eAVeYd4Zib41ZeD5FwdCTtA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGXXianJBaI5a8iaIlVia4XNkCrT65zEWoKHTVSwV5Gw58wIpxRbkickYXmQ/640?wx_fmt=png&from=appmsg "")  
  
成功登陆进后台系统，该漏洞已由今天，提交至CNVD国家漏洞平台  
  
需要key或者更多挖掘思路和情报的师傅，欢迎添加我的微信：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/MwxaTtRUcezg7oLRsEA2L4yJUpMDznXGRGoOX2zwibWxF3tFibGBTm6TbonGdgHsGI1W8xo5ecZtOV90dPgEAz9A/640?wx_fmt=png "")  
  
  
  
  
  
  
  
