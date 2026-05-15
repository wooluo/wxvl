#  漏洞预警 | Copy Failh和Dirty Frag的好兄弟fragnesia来了  
永恒之锋实验室
                    永恒之锋实验室  Eonian Sharp   2026-05-14 14:05  
  
## Fragnesia  
### 漏洞介绍  
  
Fragnesia 是 Dirty Frag 漏洞家族的独立新变种，源自修复 Dirty Frag 时引入的新缺陷。漏洞利用计算 TCP 中密码传输的 iv ，通过密码逻辑缺陷覆盖内存中 /bin/su 的缓存, 不同于前置CVE-2026-43284 dirtyfrag通过堆栈溢出进行篡改  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Vj6VUMJMyibqMe2MTXibicGdfO0wIib62XyYtCwn38OQ6RIwwzdZctC27bicoic21p1mzfX8DUdudOTgMrF0MDOybVvZ7ubm2ibwia9XHR7GP9gbiass/640?wx_fmt=png&from=appmsg "")  
### 影响版本  
```
cef401de7be8 到本次修复之间的所有相关内核版本
```  
### 修复建议  
  
应用供应商提供的修复底层 XFRM ESP-in-TCP 漏洞的内核补丁（一旦可用）。  
  
  
  
