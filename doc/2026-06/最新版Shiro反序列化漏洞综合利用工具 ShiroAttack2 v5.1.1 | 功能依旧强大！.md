#  最新版Shiro反序列化漏洞综合利用工具 ShiroAttack2 v5.1.1 | 功能依旧强大！  
 黑白之道   2026-06-16 23:18  
  
## 工具介绍  
  
**ShiroAttack2**  
一款针对 Shiro-550 漏洞的快速漏洞利用工具。作者：  
SummerSec  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNVdJhib7NGhcGTgtibCnLpl4yCgfG0HA41Tic8hXKjzo050G4UfD2TV4HbnwOvvop0UsZINCfHrhyRzLJ8fQWhfvD6rgZw1dLib5J8/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=0 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNVvNwOU3kS7IuNzsPJmK6VN13hfKmcS84404vTQkIW9E5tm3Lib1prM1KhrYnDVKU6vT99APQuZJUGWjp1wcI1Dnw8VrEagRa4c/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=1 "")  
## Shiro-550 为什么还能用  
  
2016 年的洞，到现在还能用。不是漏洞本身多高级，而是三个很现实的原因叠在一起。  
  
**第一，默认 Key。**  
 Shiro 1.2.4 及之前版本在 CookieRememberMeManager  
 里硬写了一个 AES Key：kPH+bIxk5D2deZiIxcaaaA==  
。十几年来的教程和脚手架代码一直在拷贝这个值。  
  
**第二，Key 换不掉。**  
 rememberMe 要求客户端和服务端用同一个 Key。一旦 Key 写进了配置文件、Docker 镜像、源码仓库，要替换就得所有节点一起改。  
  
**第三，利用成本足够低。**  
 GUI 点几下就能拿 shell，CLI 可以直接嵌进脚本。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNXKwFCBib0Gf7sUNVlBEv1T7nC5PSAfFBlJseib5SibVeEbhm7wUJqMQAdic6lenMbhHDQL4VQLFqvBm7cjoaHP2lZMOyqngUPLwRs/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=2 "")  
## 功能特点  
- JavaFX GUI + CLI 双模式，同一套攻击逻辑  
  
- 多版本 CommonsBeanutils gadget（1.8.3 / 1.9.2 / AttrCompare / ObjectToStringComparator）  
  
- 自动 AES 模式切换：CBC 和 GCM 各走一遍，哪个命中锁哪个  
  
- 内存马注入（Filter / Servlet / Interceptor / HandlerMethod / TomcatValve）  
  
- 回显类型：TomcatEcho / SpringEcho / DFS-AllEcho / ReverseEcho / NoEcho  
  
- 回显生成器（jEG）和内存马生成器（jMG）第三方集成，失败自动回退 Legacy  
  
- Shiro Key 替换（6 条注入路径，自动验证新旧 Key）  
  
- 自定义请求头、Cookie 合并、POST 型探测  
  
- --json  
 结构化输出，适合脚本化和 AI 调用  
  
- HTTP/HTTPS 代理（支持认证）  
  
- Key 生成器  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ft6csZH0gNXtkuZPaWwZCQwp0rWciakjpDozeWtibJ3bic3ic3pyQoLd0LWib21WrCiaTibE8MWq0zuSthtjzgudRED8ZEhVb8c4icHwibTCy1Mjgv0U/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=3 "")  
## 工具下载  
```
https://github.com/SummerSec/ShiroAttack2/tree/master
```  
## 网络安全情报攻防站  
  
  
