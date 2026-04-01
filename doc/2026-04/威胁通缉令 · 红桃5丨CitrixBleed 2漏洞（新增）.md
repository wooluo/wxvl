#  威胁通缉令 · 红桃5丨CitrixBleed 2漏洞（新增）  
 安天集团   2026-04-01 04:52  
  
点击上方"蓝字"  
  
关注我们吧！  
  
  
最新版“  
**病毒通缉令**  
”已在  
[计算机病毒分类命名百科](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650211459&idx=1&sn=3ce636cfadaec1c3790b6aba9e6507c4&scene=21#wechat_redirect)  
  
同步更新：  
https://www.virusview.net/virusWantedOrder  
  
今  
日推送：  
CitrixBleed 2漏洞  
，牌面情况：  
新增  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/XBFaicYdOHkib6AMrY6ufDLiaBM86caMyAn78Ub9EIuC0LbdgArSw1B68dC5vYHT9JuYAy4K8boKa9abRSN7aXq6cD9vKibgPbFeJDdEbXswecM/640?wx_fmt=png&from=appmsg "")  
  
****  
**病毒名称：CitrixBleed 2漏洞**  
  
**CVE编号：CVE-2025-5777**  
  
**发现时间：2025-06**  
  
**检测规则首次添加至AVL SDK反病毒引擎病毒库时间：2025-06**  
  
**简介：‌Citrix NetScaler ADC 和 Gateway（企业级应用交付控制器和远程访问网关）存在越界读取漏洞，源于身份验证请求处理时的输入验证不足。当 NetScaler 配置为 Gateway（VPN 虚拟服务器、ICA 代理、CVPN、RDP 代理）或 AAA 虚拟服务器时，未认证攻击者可通过发送特制 HTTP POST 请求（如在登录参数中故意遗漏等号）触发内存越界读取，每次请求可泄露约 127 字节的堆栈内存内容，包括会话 cookie、认证令牌（含 nsroot 管理员令牌）和敏感配置信息。攻击者可通过多次请求收集足够信息，绕过多因素认证（MFA），劫持管理员或普通用户会话，完全控制 NetScaler 设备，进一步攻击内部网络或窃取企业敏感数据。该漏洞与 2023 年广泛利用的 CVE-2023-4966 CitrixBleed 漏洞原理相似，被称为 CitrixBleed 2。**  
  
****  
**安天智甲终端防御系统（IEP）拥有驱动级主防模块，基于安天AVL SDK反病毒引擎的检测能力和内核与应用层的防御点，可有效阻断该漏洞攻击链和其他类似的攻击活动。**  
  
  
****  
**往期推荐:“威胁通缉令”年度更新！安天历年发布的威胁通缉令，今天正式在计算机病毒百科网站上线手机上的恶意代码知识库——计算机病毒百科服务号上线了计算机病毒分类命名知识百科上线试运行（安天研究院出品）视频揭秘入选“十四五”硬核科技成果的反病毒引擎**  
  
