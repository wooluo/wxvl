#  CVE‑2026‑41940：cPanel/WHM认证绕过可直接RCE，数百万服务器告急！！！  
 蚁景网安   2026-05-11 08:30  
  
2026 年 4 月 28 日，安全机构 watchTowr Labs 公开披露 cPanel/WHM 存在**严重认证绕过漏洞**  
，编号**CVE‑2026‑41940**  
，CVSS 评分高达**9.3 分**  
，属于**Critical**  
级别高危漏洞。  
  
cPanel/WHM 是全球最主流的服务器管理面板，被数百万主机商、VPS 服务商、企业服务器广泛使用。该漏洞无需账号密码、无需前置条件，**远程未认证攻击者即可直接获取 WHM root 权限，进而执行任意系统命令**  
，一旦被利用，整台服务器与所有托管站点将完全沦陷。  
  
目前 PoC 已公开，在野利用风险极高，所有在用 cPanel 用户请立即处置。  
  
  
视频来源：  
watchTowr Labs  
  
  
**一、漏洞简介**  
  
- 漏洞编号：  
CVE‑2026‑41940  
  
- 漏洞类型：  
认证绕过 → 远程代码执行（RCE）  
  
- CWE 分类：  
CWE‑306 关键功能未做认证  
  
- CVSS 评分：  
9.3/10（Critical）  
  
- 披露时间：  
2026‑04‑28  
  
- 利用条件：远程、无需认证、公网可直接利用  
  
- 核心危害：  
绕过登录验证，直接拿到 WHM 最高权限，执行任意系统命令、接管服务器。  
  
简单说：  
不用密码，直接当 root  
。  
  
  
**二、影响范围**  
  
### 1. 受影响版本  
  
cPanel & WHM **11.40 至补丁发布前所有版本**  
，几乎覆盖当前全网在用的全部版本。  
###   
  
  
### 2. 修复版本  
  
官方已在 2026‑04‑28 推送安全更新，对应修复版本如下：  
```
110.0.x → 11.110.0.97
118.0.x → 11.118.0.63
126.0.x → 11.126.0.54
132.0.x → 11.132.0.29
134.0.x → 11.134.0.20
136.0.x → 11.136.0.5
```  
  
  
3. 风险场景  
- 共享主机/虚拟主机商：**一台沦陷，全站遭殃**  
  
- VPS/云服务器：公网开放 2083/2087 端口即高危  
  
- 企业Web服务器：直接拿到 root，数据、业务全暴露  
  
- 域名/托管服务商：客户数据、站点、数据库全面失守  
  
- 开发/测试环境：公网暴露同样可被一键入侵。  
  
知名服务商 Namecheap 已紧急封锁端口、全量升级，足见风险等级。  
  
  
**三、漏洞原理**  
  
漏洞根源是**登录流程存在 CRLF 注入缺陷**  
，配合会话机制设计不当，导致未授权用户可伪造合法会话、拿到最高权限。  
  
详细的漏洞分析可以看  
watchTowr Labs这篇文章：  
  
https://labs.watchtowr.com/the-internet-is-falling-down-falling-down-falling-down-cpanel-whm-authentication-bypass-cve-2026-41940/  
  
  
完整攻击链  
  
1、生成预认证会话  
  
向 2083/2087 端口发起请求，无需凭据即可拿到基础会话令牌。  
  
2、CRLF注入恶意头部  
  
构造特殊 Basic Auth 头与无 ob 段的 Cookie，注入  
\r\n  
换行符，向会话文件写入伪造字段（如  
user=root  
、  
hasroot=1  
、  
tfa_verified=1  
）。  
  
3、307重定向泄露安全令牌  
  
服务器返回重定向，其中包含合法  
/cpsessXXXXXXX  
令牌，本应仅认证成功后发放。  
  
4、触发do_token_denied同步缓存  
  
访问无 token 的接口，强制程序读取原始会话文件并写入 JSON 缓存，让伪造权限生效。  
  
5、获取 WHM root 权限  
  
用泄露令牌访问 WHM API，直接返回 200，确认拿到最高管理权限，可执行任意命令。  
  
一句话总结：  
CRLF 注入改会话文件 → 绕过认证 → 拿 root → 远程执行代码。  
  
  
**四、漏洞复现**  
```
python authbypass-RCE.py --target https://target:2087/
                     __         ___  ___________
         __  _  ______ _/  |__ ____ |  |_\__    ____\____  _  ________
         \ \/ \/ \__  \    ___/ ___\|  |  \|    | /  _ \ \/ \/ \_  __ \
         \     / / __ \|  | \  \___|   Y  |    |(  <_> \     / |  | \/
         \/\_/ (____  |__|  \___  |___|__|__  | \__  / \/\_/  |__|
                        \/          \/     \/

        watchTowr-vs-cPanel-WHM-AuthBypass-to-RCE.py
        (*) cPanel/WHM Authentication Bypass - Detection Artifact Generator
        - Sina Kheirkhah (@SinSinology) of watchTowr (@watchTowrcyber)
        CVEs: [CVE-2026-Pending]

[0] hostname = 
[1] minting a preauth session...
    session base = :vQ2WC5Bexp0oFSa7
[2] sending the CRLF injection (Basic auth + no-ob cookie)...
    HTTP 307, leaked token = /cpsess5691070609
[3] firing do_token_denied to propagate raw -> cache...
    HTTP 401, gadget fired
[4] verifying we're WHM root...
    /json-api/version -> HTTP 200  {"version":"11.110.0.89"}
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tNyBeBKReNIRf9hcYgBtMwqSS2Tn4ctPL5lf2icMliaEdH5wAVetFNvWJP5Yic0IibTP2pIVQXWq0eZyMpzMSEVfashrck9oDpiaGZibTz7gEOua4/640?wx_fmt=png&from=appmsg "")  
  
  
**五、修复方案**  
  
1. 官方修复（强烈推荐）  
  
直接执行强制升级，一步到位：  
```
/usr/local/cpanel/scripts/upcp --force
```  
  
验证是否升级成功：  
```
/usr/local/cpanel/cpanel -V
```  
  
  
2. 临时缓解（未升级前紧急防护）  
  
防火墙封锁 2083/2087 端口，仅允许管理员 IP 访问  
```
iptables -A INPUT -p tcp --dport 2083 -j DROP
iptables -A INPUT -p tcp --dport 2087 -j DROP
iptables -I INPUT -p tcp -s 你的管理IP --dport 2083 -j ACCEPT
iptables -I INPUT -p tcp -s 你的管理IP --dport 2087 -j ACCEPT
iptables-save > /etc/iptables.rules
```  
  
- 使用CSF防火墙：  
移除 TCP_IN 中的 2083/2087，仅放行信任 IP  
  
- 反向代理拦截：  
过滤%0d  
、%0a  
、\r  
、\n  
等 CRLF 字符，直接返回 403。  
  
3. 后续加固建议  
- 为所有账户开启**双因素认证（2FA）**  
  
- 审计登录日志：/usr/local/cpanel/logs/login_log  
  
- 检查异常会话与 API 调用记录  
  
- 定期巡检 cron 任务，排查可疑后门  
  
- 托管商需同步通知客户，全面排查站点安全。  
  
**六、安全提醒**  
  
此漏洞**利用门槛极低、PoC 公开、影响面极大**  
，是 2026 年上半年最危险的服务器漏洞之一。  
  
请所有 cPanel/WHM 用户**立即升级**  
，不要心存侥幸。服务器安全无小事，一次疏忽可能导致数据泄露、业务瘫痪、法律追责。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/7QRTvkK2qC6iavic0tIJIoZCwKvUYnFFiaibgSm6mrFp1ZjAg4ITRicicuLN88YodIuqtF4DcUs9sruBa0bFLtX59lQQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=10 "")  
  
学  
习  
网安实战技术  
，戳  
“阅读原文”  
  
