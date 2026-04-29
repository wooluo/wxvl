#  OpenClaw三大漏洞可致策略绕过与主机劫持  
 FreeBuf   2026-04-29 10:03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
网络安全研究人员近日在 AI Agent 框架 OpenClaw（曾用名 Clawdbot 和 Moltbot）中披露了三个中危漏洞。这些通过 npm 包分发的安全缺陷可导致策略执行绕过、网关配置篡改以及可能引发凭证泄露的主机劫持攻击。  
  
  
开发团队已发布 OpenClaw 2026.4.20 版本修复全部三个漏洞。强烈建议 2026.4.20 之前版本的用户立即升级部署以保护系统环境。  
##   
  
**Part01**  
## 网关配置篡改漏洞  
## GHSA-7jm2-g593-4qrc  
  
  
首个漏洞涉及 OpenClaw 处理 Agent 网关配置变更的缺陷。现有配置修补的安全防护机制未能充分覆盖多个敏感的操作员信任设置项，包括沙箱策略、插件启用状态、服务端请求伪造（SSRF）防护策略以及文件系统加固规则。  
  
  
若 AI 模型接收到提示词注入指令并拥有所有者专属网关工具的访问权限，便可持久化篡改这些关键配置。虽然该漏洞属于模型对操作员的防护绕过（而非远程未授权入侵），但仍构成重大风险。补丁通过扩大操作员信任路径的模型驱动变更拦截范围解决了此问题。  
  
  
**Part02**  
## 工具策略执行绕过  
## GHSA-qrp5-gfw2-gxv4  
  
  
第二个漏洞影响捆绑式模型上下文协议（MCP）与语言服务器协议（LSP）工具的处理流程。在受影响版本中，这些捆绑工具可在系统应用核心过滤规则后仍被添加到 Agent 的活跃工具集。因此，即便系统管理员设置了严格的工具策略（如显式拒绝列表、沙箱规则或所有者专属限制），捆绑工具仍能绕过防御保持活跃状态。  
  
  
最新版本通过在所有捆绑工具并入活跃工具集前实施最终全面策略检查，修复了这项本地 Agent 策略执行绕过问题。  
  
  
**Part03**  
## 主机劫持与凭证泄露  
## GHSA-h2vw-ph2c-jvwf  
  
  
第三个漏洞属于工作区配置缺陷。控制本地工作区环境文件的攻击者可操纵 API 主机设置，通过向配置中注入恶意 URL 将合法认证请求重定向至其控制的外部服务器，导致外发授权标头中的敏感 API 密钥泄露。  
  
  
OpenClaw 团队已更新软件禁止通过工作区环境文件注入 API 主机设置，从根本上阻断了此类凭证窃取攻击。  
  
  
这些发现凸显了防护 AI Agent 框架抵御提示词注入与本地环境操控的重要性。使用 OpenClaw 的组织应核查软件版本并升级至 2026.4.20，确保 AI 操作符合内部策略且保持安全。这些漏洞的快速修补表明，在快速演进的人工智能部署环境中，持续安全监测具有至关重要的意义。  
  
  
**参考来源：**  
  
Multiple OpenClaw Vulnerabilities Enables Policy Bypass and Host Override  
  
https://cybersecuritynews.com/openclaw-vulnerabilities/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337326&idx=1&sn=4b4825de0e4f83e00dad9cfa560df6f2&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
