#  cPanel 0Day认证绕过漏洞遭野外利用，PoC已公开  
 FreeBuf   2026-05-01 10:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
全球网络托管行业正经历一场地震：cPanel & WHM 中被证实存在一个关键认证绕过漏洞（CVE-2026-41940），且已遭野外利用。该漏洞允许未认证攻击者完全绕过登录机制，可能获取托管控制面板的 root 权限。  
  
  
安全团队 watchTowr 的研究人员已公开概念验证（PoC）利用代码，使得紧急修补的紧迫性急剧上升。  
##   
  
**Part01**  
## 漏洞技术分析  
  
  
该漏洞存在于 cPanel & WHM（含 DNSOnly 部署）的认证层。根据官方公告，它影响 11.40 之后的所有版本。考虑到 cPanel 在全球共享主机市场的主导地位，攻击面极其庞大。  
  
  
漏洞本质上是 CRLF 注入与会话令牌泄漏的组合利用链，使攻击者无需有效凭证即可完成以下操作：  
1. 获取基础会话标识符  
  
1. 通过 HTTP 307 重定向泄漏有效的会话令牌  
  
1. 将原始令牌注入服务端缓存  
  
1. 最终获得 WHM root 权限  
  
研究人员 Sina Kheirkhah 发布的检测工具展示了四步攻击链：  
- 生成预认证会话，获取基础标识符  
  
- 发送 CRLF 注入载荷（Basic 认证 + 无操作 cookie），通过 HTTP 307 泄漏有效令牌  
  
- 触发 do_token_denied 请求，将原始令牌注入服务端缓存  
  
- 访问 /json-api/version，确认获得 WHM root 权限  
  
PoC 工具 authbypass-RCE.py 针对 2087 端口（WHM），可成功攻击 11.110.0.89 及更早版本。  
  
  
**Part02**  
## 紧急修补与缓解措施  
  
  
cPanel 在观测到野外攻击后加速了补丁发布。最新修补版本包括：  
- 11.86.0.41 / 11.110.0.97 / 11.118.0.63 / 11.126.0.54  
  
- 11.130.0.19 / 11.132.0.29 / 11.134.0.20 / 11.136.0.5  
  
- WP Squared 部署需升级至 136.1.7  
  
管理员必须立即执行以下操作：  
- **强制更新**  
：/scripts/upcp --force  
  
- **验证版本并重启服务**  
：使用 /usr/local/cpanel/cpanel -V  
 查看版本，执行 /scripts/restartsrv_cpsrvd  
 重启服务  
  
- **手动更新**  
：对于禁用自动升级的服务器（风险最高），需手动处理  
  
若无法立即修补，建议采取以下临时措施：  
- 通过防火墙封锁 2083、2087、2095、2096 端口  
  
- 通过 WHM API 停止 cpsrvd 和 cpdavd 服务  
  
目前，全球多家托管商已预防性下线 cPanel 控制面板。由于该漏洞可能暴露整个服务器生态系统（包括所有托管域名、邮件账户、数据库和文件系统），且 PoC 公开大幅降低了利用门槛，预计短期内会出现大规模扫描攻击。  
  
  
**参考来源：**  
  
cPanel 0-Day Authentication Bypass Vulnerability Actively Exploited in the Wild — PoC Released  
  
https://cybersecuritynews.com/cpanel-0-day-authentication-bypass-vulnerability/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337545&idx=1&sn=772e37039accf79521a5b80e0032e89f&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
