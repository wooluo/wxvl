#  安卓惊现零点击核弹漏洞！远程Shell权限被轻易窃取，PoC已公开  
看雪学苑
                    看雪学苑  看雪学苑   2026-05-12 09:59  
  
2026年5月，谷歌发布的Android安全公告中，曝光了一个零点击高危漏洞（CVE-2026-0073），该漏洞存在于安卓系统核心的adbd守护进程中，已被BARGHEST安全研究团队披露并公开了完整的PoC利用代码。这意味着，  
攻击者只需与目标设备处于同一网络环境，无需用户任何操作，就能悄无声息地获取设备的完整shell访问权限，将开发者调试工具变成远程控制的隐形后门。  
  
  
漏洞根源：加密验证逻辑的致命缺陷  
  
  
  
这个灾难性漏洞的核心在于adbd_tls_verify_cert函数中的  
加密逻辑错误，  
该函数负责验证无线ADB连接的客户端证书。现代安卓设备的无线调试功能依赖双向TLS认证机制，确保只有经过配对的可信设备才能连接。  
  
  
正常流程中，系统会使用EVP_PKEY_cmp API比较客户端证书公钥与设备信任存储中的授权RSA密钥。但当攻击者提供非RSA证书（如EC P-256或Ed25519）时，该API会返回-1表示算法不匹配。而安卓底层C++实现中，所有非零整数都被视为布尔值true，导致系统错误地将攻击者的证书判定为可信，直接绕过了身份验证环节。  
  
  
攻击流程：三步即可突破设备防线  
  
  
  
尽管漏洞原理看似简单，但成功利用需要精准操控协议流程：  
  
1.  建立TCP连接：攻击者首先连接目标设备的5555端口（ADB默认端口）  
  
2.  协商STLS升级：成功完成安全传输层协议升级  
  
3.  提交恶意证书：发送跨算法证书绕过验证，建立加密隧道  
  
4.  获取shell权限：在加密通道中恢复ADB通信，打开远程shell，获得shell用户执行权限  
  
  
一旦攻击成功，攻击者可绕过应用沙箱限制，执行以下操作：  
- 提取短信、通讯录、照片等敏感个人信息  
  
- 静默安装恶意应用，劫持设备功能  
  
- 修改系统设置，植入持久化后门，为后续攻击铺路  
  
影响范围与利用条件  
  
  
  
该漏洞主要影响  
Android 14、15和16  
版本设备，且需满足以下前提条件才能被利用：  
  
1.  目标设备已启用开发者选项  
  
2.  无线调试（ADB over TCP）功能处于开启状态并暴露在网络中  
  
3.  设备信任存储中至少存在一个已配对的RSA主机密钥  
  
4.  攻击者与目标设备处于同一网络，能够访问5555端口  
  
  
面对这一严重威胁，安卓用户和企业管理员应立即采取以下防护措施：  
  
  
1. 优先安装安全补丁：尽快更新设备至2026年5月安全补丁版本，这是彻底修复漏洞的唯一方法  
  
2. 关闭无线调试：在不可信网络环境（如公共Wi-Fi）中，务必关闭无线调试功能  
  
3. 撤销未知授权：清理设备中已授权的未知调试主机，减少攻击面  
  
4. 禁用开发者选项：非开发需求时，完全关闭开发者选项，从根源上阻止此类攻击  
  
  
移动设备的安全边界正在不断受到挑战。即使是安卓系统核心组件，也可能存在致命缺陷。用户应保持安全意识，及时更新系统，谨慎使用开发者功能，避免在公共网络环境中暴露敏感服务端口。  
  
  
资讯来源：BARGHEST Security Research & Google Android Security Bulletin (May 2026)  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Cpo2XCpI7K2RCk7yThhBLIUbH4q3aQt0B7qaZQkicdSfE4CfxEU9spnPh2WVagN2sZH7H77mPE6EcsbzvChL8610PTSQAFtJKKxhKZeicH3mU/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Cpo2XCpI7K1O50IPHAz4bKm06ibfvA4wmOmibOHrvhmAIwOBN1W97HSMPk1rcPEibTdqbWXgubYRr8B8rVnM1ARrEUv0vn1RS3iaPbNT2fmRAhY/640?wx_fmt=gif&from=appmsg "")  
  
**球分享**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Cpo2XCpI7K0Cps1c7qg7gpgeqaGRol1dhVRz6RFF87c9N2oNOeBdSHn1icsag8yMFObqq2icPxjDmKIMI5UAg1wqYm930jGhW61eC8icDx7mJU/640?wx_fmt=gif&from=appmsg "")  
  
**球点赞**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Cpo2XCpI7K1zF1YEc6txpLjFfuXCrGHs8EW9WGfdTPtLlH4lZibQOqibfan5cN4hRmicz9xHic5JYMMibF1QgfWIQXAgpytHhDf4zN5ha5CDicE1c/640?wx_fmt=gif&from=appmsg "")  
  
**球在看**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Cpo2XCpI7K1IlDqaB0eazSXF5FsjGCSjFntddgiaevxcBXQxiaZ75KkPiauZia7dIon08S0m6nf17gOZbn3cQky9fBiahS1ReiaOU5fV5IeprEtCU/640?wx_fmt=gif&from=appmsg "")  
  
点击阅读原文查看更多  
  
