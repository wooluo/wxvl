#  NGINX 漏洞预警：18 年老洞可 RCE，PoC 已公开  
 猎户攻防实验室   2026-05-14 11:37  
  
   
  
5月13日，安全研究机构 DepthFirst 的自动化漏洞扫描系统一次性发现了 NGINX 的 4 个安全漏洞。其中最严重的 CVE-2026-42945（NGINX Rift） 影响范围横跨 0.6.27 到 1.30.0，存在了将近 18 年，官方 PoC 已公开。  
## 漏洞清单  
  
<table><thead><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">CVE</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">严重度</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">模块</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">影响</span></section></td></tr></thead><tbody><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">CVE-2026-42945</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">🔴 Critical 9.2</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">ngx_http_rewrite_module</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">堆溢出 → RCE/DoS</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">CVE-2026-42946</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">🟠 High 8.3</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">ngx_http_scgi_module / uwsgi_module</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">~1TB 内存分配 → worker 崩溃（DoS）</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">CVE-2026-40701</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">🟡 Medium 6.3</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">ngx_http_ssl_module</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">TLS 关闭后 OCSP DNS use-after-free</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">CVE-2026-42934</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">🟡 Medium 6.3</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">ngx_http_charset_module</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &#34;PingFang SC&#34;, Cambria, Cochin, Georgia, Times, &#34;Times New Roman&#34;, serif;font-size: 14px;padding: 0.5em 1em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">UTF-8 跨缓冲区越界读（off-by-one）</span></section></td></tr></tbody></table>  
  
修复版本：**1.30.1+**  
（稳定分支）/ **1.31.0+**  
（主线）  
## 重点分析  
  
**CVE-2026-42945（NGINX Rift）—— 堆溢出可RCE**  
  
这是本次最严重的漏洞。当配置中 rewrite 的替换串包含 ?  
，且后续通过 set  
/if  
/rewrite  
 引用了正则捕获组（如 $1  
、$2  
）时，攻击者发送特制 URI 即可触发堆溢出。可导致 worker 进程崩溃，在绕过 ASLR 的条件下可实现远程代码执行。  
  
受影响配置示例：  
```
rewrite ^/old/(.*)$ /new?param=$1;    # 替换串含 ? 且引用了 $1set $my_var $1;                        # 引用捕获组
```  
  
**CVE-2026-42946 —— SCGI/uwsgi 内存耗尽**  
  
触发后可导致约 1TB 的内存分配，直接打挂 worker 进程。所有使用 SCGI 或 uWSGI 后端的部署均受影响。  
## PoC / 利用脚本  
  
CVE-2026-42945 的 PoC 已公开：  
- • 官方 PoC：https://github.com/DepthFirstDisclosures/Nginx-Rift  
  
> **关于 PoC 的实际利用能力说明：**  
 该 PoC 主要在 ASLR 关闭的环境（如 DepthFirst 提供的 Docker 测试环境）下能稳定实现 RCE。在真实生产环境（默认开启 ASLR 的 Linux 系统）上，大概率只能实现可靠的 DoS 崩溃，完整 RCE 需要额外技巧。**请仅在自己可控的测试环境中使用，严禁用于任何未经授权的服务器，否则属于违法行为。**  
  
## 排查方法  
  
**第 1 步：资产清点 — 确认 NGINX 版本**  
```
# 本地最准确检查nginx -vnginx -V# 远程通过 Header 检查curl -sI https://your-domain.com/ 2>/dev/null | grep -i "^Server:"# 批量扫描（推荐）while read host; do  echo -n "$host | "  curl -skI --max-time 5 "https://$host" 2>/dev/null | grep -i "^Server:" || echo "无法访问或 Server 头已隐藏"done < host_list.txt
```  
  
判定标准：  
- • 版本在 **0.6.27 ~ 1.30.0**  
 之间（含 NGINX Plus R32~R36）→ **受影响，立即升级**  
  
- • 版本 **≥ 1.30.1**  
 或 **≥ 1.31.0**  
 → 已修复  
  
**第 2 步：模块与编译选项检查**  
```
# 查看已编译模块nginx -V 2>&1 | tr ' ' '\n' | grep --color=never -E 'module|http_rewrite|http_scgi|http_uwsgi|http_charset|http_ssl'
```  
  
**第 3 步：配置触发条件检查（最核心！）**  
```
# 查找含 ? 的 rewrite + 匿名捕获组grep -rnE 'rewrite\s+.*\?.*\$[0-9]' /etc/nginx/ --include="*.conf"# 查找所有匿名捕获组使用grep -rnE '\$([1-9][0-9]?)' /etc/nginx/ --include="*.conf"# 检查 SCGI/uWSGI（CVE-2026-42946）grep -rnE 'scgi_pass|uwsgi_pass' /etc/nginx/ --include="*.conf"
```  
  
**第 4 步：日志异常检查**  
```
# worker 崩溃记录grep -E "exited on signal|segfault|signal 11|worker process" /var/log/nginx/error.log | tail -30# 可疑 URI 请求grep -E "(\+|%26|%25)" /var/log/nginx/access.log | tail -50
```  
## 修复建议  
  
**首选：立即升级 NGINX**  
```
# CentOS / RHELyum update nginx# Ubuntu / Debianapt update && apt install nginx# Dockerdocker pull nginx:1.31.0# 验证nginx -v   # 确保 >= 1.30.1
```  
  
**临时缓解（无法立即升级时）**  
  
针对 CVE-2026-42945，最有效的办法是把匿名捕获组改成 **named captures**  
：  
```
# 推荐写法rewrite ^/users/(?<user_id>[0-9]+)/profile/(?<section>.*)$ /profile.php?id=$user_id&tab=$section last;
```  
  
**参考链接：**  
- •   
DepthFirst 官方技术分析  
https://github.com/DepthFirstDisclosures/Nginx-Rift  
  
- •   
F5 安全公告 K000161019  
https://my.f5.com/manage/s/article/K000161019  
  
- •   
NGINX 安全公告  
https://nginx.org/en/security_advisories.html  
  
   
  
  
