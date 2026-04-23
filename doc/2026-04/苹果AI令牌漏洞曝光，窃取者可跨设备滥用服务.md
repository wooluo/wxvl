#  苹果AI令牌漏洞曝光，窃取者可跨设备滥用服务  
 FreeBuf   2026-04-23 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
**Part01**  
## 服务架构设计  
  
  
苹果公司宣称，其操作系统内置的生成式AI服务Apple Intelligence通过采用匿名访问令牌的双阶段认证授权机制，特别注重用户安全与隐私保护。但俄亥俄州立大学研究人员在macOS 26.0（Tahoe）系统上发现，该设计存在可导致令牌被窃取并重复利用的安全漏洞。  
  
  
该系统通过私有云计算（PCC）框架将复杂请求卸载至云端服务器处理，采用Privacy Pass协议下的两种凭证：设备首先向身份验证服务证明其苹果硬件真实性，获取长期有效的令牌授予令牌（TGT）；随后用TGT兑换批量单次使用的一次性令牌（OTT）来授权AI请求。为保护隐私，流量经由Oblivious HTTP（OHTTP）中继代理传输，可向苹果隐藏IP地址等元数据。  
  
  
![Apple Intelligence令牌漏洞](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX2eYnQXon6RnZ2xtYLkKsyoux2ZkZhEpVmlUFuT6dWe2JloZqgCdfzzLTLSr8xictzzEIFCWcaSWpicK1ITIHJZj8tao1MBPJzGQ/640?wx_fmt=jpeg&from=appmsg "")  
  
Apple Intelligence认证协议（来源：研究论文）  
  
  
**Part02**  
## 漏洞发现  
  
  
研究人员在macOS 26.0系统中发现，TGT和OTT以明文形式存储在登录钥匙串中，任何具有标准用户权限的应用程序均可访问。由于系统设计优先考虑匿名性，令牌未与物理硬件绑定，且缺乏验证令牌原始接收设备的方法，这些凭证实际成为"持有者令牌"。一旦泄露，用户无法撤销令牌，需等待数日后自动失效。  
  
  
**Part03**  
## Serpent攻击手法  
  
  
研究人员开发出名为Serpent的攻击技术，通过两个阶段突破凭证"不可转移"的设计：  
  
- 提取阶段：植入受害者Mac的恶意软件通过SecItemCopyMatchingAPI或**/usr/bin/security**工具查询钥匙串，触发系统权限弹窗（假设用户点击"允许"）  
  
- 伪装阶段：攻击者将窃取的令牌写入本地钥匙串后，其设备即可伪装成受害者发起服务请求  
  
**Part04**  
## 实际影响  
  
  
在macOS 26.0上的测试证实：  
  
- 被限流的设备通过导入受害者令牌可立即恢复服务访问  
  
- 攻击者可利用窃取的TGT反复兑换并丢弃OTT，耗尽受害者每日配额，使其设备显示"Apple Intelligence当前不可用"的伪服务中断提示  
  
- 由于OHTTP中继隐藏IP地址，服务商无法追踪攻击源  
  
该漏洞还可能导致Apple Intelligence服务被移植到Linux等平台，作为通用AI服务转售。  
  
  
**Part05**  
## 修复措施  
  
  
苹果已为此漏洞分配编号（CVE-2025-43509）并发放漏洞赏金。macOS 26.2更新将令牌存储位置改为iCloud钥匙串，需通过系统内核权限检查才能访问。但研究人员指出，该方案仍可通过内核扩展或内存调试绕过，建议采用加密硬件绑定作为根本解决方案。  
  
  
**参考来源：**  
  
Apple Intelligence flaw kept stolen tokens reusable on another device  
  
https://www.helpnetsecurity.com/2026/04/22/apple-intelligence-token-vulnerability-serpent-attack/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337140&idx=1&sn=134af642d92b85fc1076a8c83c09945c&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
