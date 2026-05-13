#  Burp Suite平替 | 强大插件、集成云端虚拟手机，快速定位APP漏洞  
threehammers
                    threehammers  菜鸟学信安   2026-05-13 01:20  
  
工具介绍  
  
**SwordfishSuite**  
 是一款受 Burp Suite 启发的现代化 Web 安全测试平台。它集成了智能代理、流量拦截、负载扫描和强大的插件系统，旨在为安全研究人员和渗透测试工程师提供一款高效、可定制的应用利器。  
## 核心特性  
- **智能拦截代理**  
：无缝拦截、查看和修改 HTTP/HTTPS 流量，支持多种客户端，操作流畅直观。  
  
- **集成APP分析**  
：可集成云手机平台，直接在SwordfishSuite查看分析手机APP流量（暂不开放）。  
  
- **可扩展插件系统**  
：基于 Python 的完整插件生态，允许您轻松编写自定义扫描检查器和数据分析工具。  
  
- **GUI界面操作**  
：提供用户友好的图形化界面 (GUI) 以满足交互式测试需求。  
  
- **流量数据转发**  
：支持流量二次转发（原始流量和HAR格式），方便各种扩展。  
  
## 工具使用  
### 前置要求  
  
在运行 SwordfishSuite 之前，如果你需要启用插件：  
- **Python**  
 3.10 或更高版本  
  
- pip  
 包管理工具 pip install grpcio grpcio-tools protobuf numpy  
  
### 安装  
1. **从 GitHub 下载Release版本压缩：**  
  
  
  
```
下载:https://github.com/threehammers-group/SwordfishSuite/releases
解压
cd Swordfish
./Swordfish.exe
```  
  
  
1. **启动应用：**  
  
1. **GUI 模式 (推荐):**  
  
  
```
./Swordfish.exe或鼠标双击即可
```  
  
1. **安装证书：**  
第一次启动程序，点击工具栏安装证书按钮，CA 证书以支持 HTTPS 解密(证书存储位置->本地计算机->指定下列存储->受信任的根证书颁发机构->完成)  
  
1. **开始探索！**  
点击工具栏开始按钮，拦截流量，重放请求，使用负载测试器，或者开发新插件定制自己的专属功能。  
  
主界面  
  
![主界面](https://mmbiz.qpic.cn/sz_mmbiz_png/AFjuWEpVxULgMJH2yFKBKu8WEP96Wnyb7quJ5mrOApbhVm41IdBz79c9f1SqbxLufhib8YwolCTanAhedNa6vZQT2Xx5juBbBJjOicZloqn4s/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
数据重发  
  
![数据重发](https://mmbiz.qpic.cn/sz_mmbiz_png/AFjuWEpVxUJicyHyT4VARkzyKAg92XwLQyiaHfNEmatJVrYy63jAvuNwPHvBY79XvXsicogMjTpd6okI3XooGrb5icriaU84WUY2K976uorBGGPw/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
负载测试  
  
![负载](https://mmbiz.qpic.cn/mmbiz_png/AFjuWEpVxUJJQichOXKNXg2uTrCMluiblS5xdspaCbQJg9jENQcFKlTzsJZ4snz6GPuxCHibkahbYI5iaAyJMFUutbhwlJgja0TN937f3UiaHibbc/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
数据包拦截  
  
![数据拦截](https://mmbiz.qpic.cn/sz_mmbiz_png/AFjuWEpVxUIXxzicibfAPdlu3DmysUqXMTy0jflgxSKVavffLCEryffAo4Dx2ScpiaMOhUd05B07dNFTWReAIEdboJTMtfjN7zlsQv4WZ5QuOo/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
APP实时抓包  
  
![APP抓包](https://mmbiz.qpic.cn/mmbiz_png/AFjuWEpVxUKjkRurgx6u82mEK3ZKnibfeZIJgpPaykuice0LXHrXWy6xS1QvglCuByCNSQ6N1wQmL2iblmYkr2p08UbSKtZljQM0icV4ciaw9llA/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
python自开发插件示例  
  
![自定义插件](https://mmbiz.qpic.cn/mmbiz_png/AFjuWEpVxUIyl1yNuXCcdmjLtjCcGcrPWIHUicp3SNyDrow8vjZHaMEgImFJ61v2pPkNgs4HSjCLh7afefPnocoDwhriaoP16PxlWOK1QkYDw/640?wx_fmt=png&from=appmsg "")  
  
  
项目地址  
  
https://github.com/threehammers-group/SwordfishSuite  
  
  
  
