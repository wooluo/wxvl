#  Android零点击漏洞PoC公开，攻击者可远程获取Shell权限  
 FreeBuf   2026-05-14 10:04  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
  
  
谷歌在2026年5月的Android安全公告中披露了一个潜藏在Android系统核心的灾难性零点击漏洞，这对移动安全领域造成了严重冲击。编号为CVE-2026-0073的漏洞存在于Android的adbd守护进程中，允许附近的威胁行为者在无需用户交互的情况下远程获取完整Shell访问权限。  
  
  
**Part01**  
## Android零点击漏洞PoC发布  
  
  
BARGHEST安全研究人员发现，这个关键性加密机制失效彻底破坏了Android的调试信任模型，将标准开发者工具转变为隐蔽的武器化后门。CVE-2026-0073漏洞的根源在于auth.cpp文件中adbd_tls_verify_cert函数的加密逻辑错误。  
  
  
现代无线ADB连接依赖双向TLS认证来确保连接客户端是先前配对过的可信主机。在此握手过程中，系统使用EVP_PKEY_cmpAPI将客户端证书公钥与设备存储的授权RSA密钥进行比对。当攻击者提供非RSA证书（如EC P-256或Ed25519）时，比对API会返回-1表示跨算法不匹配。但由于底层C++实现将所有非零整数视为布尔成功，守护进程会错误地将攻击者不匹配的证书验证为可信主机密钥。  
  
  
**Part02**  
## 漏洞利用技术要求  
  
  
虽然逻辑缺陷本身简单，但将其武器化需要精确的协议操控。攻击者必须首先建立TCP连接，成功协商STLS升级序列，然后提供恶意的跨算法证书。一旦绕过此认证关卡，攻击者就能在加密隧道内恢复ADB帧结构以打开远程Shell。这将授予攻击者Shell用户执行权限，使其能够绕过常规应用沙箱。  
  
  
根据Barghest研究，该漏洞主要在特定状态下影响Android 14、15和16设备。成功利用需要满足以下先决条件：  
- 目标设备已启用开发者选项  
  
- 无线调试或TCP ADB在网络中暴露  
  
- 设备信任存储包含至少一个先前配对的RSA主机密钥  
  
- 攻击者能够访问设备ADB TCP端口5555所在的相邻网络  
  
**Part03**  
## 防护建议  
  
  
设备用户和企业管理员必须立即应用2026年5月的安全补丁来修复此关键漏洞。为主动减少攻击面，用户应在不受信任的网络上关闭无线调试功能，并撤销未知调试主机的授权。强烈建议在不使用时完全关闭开发者选项，以防止自动化局域网利用尝试。  
  
  
**参考来源：**  
  
PoC Exploit Released for Android 0-Click Vulnerability that Enables Remote Shell Access  
  
https://cybersecuritynews.com/poc-exploit-android-zero-click-vulnerability/  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337950&idx=1&sn=12d64571335d50c1b93389447dfb8ef1&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
