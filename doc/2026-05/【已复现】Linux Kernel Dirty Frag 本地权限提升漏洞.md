#  【已复现】Linux Kernel Dirty Frag 本地权限提升漏洞  
安恒CERT
                    安恒CERT  安恒信息CERT   2026-05-08 10:03  
  
![安恒信息安全通告](https://mmbiz.qpic.cn/sz_mmbiz_png/P5dz00jGoyRJer7FFHBSKYU8MhfJayX59Fq5ZBeuSTibjcjIBwu5nDtPVQASvYVOd4Knb3TWC2TfRuicOROkiaicrYoUnPiaHxrgyBR8ia9wEbHhE/640?from=appmsg "")  
  
<table><tbody><tr><td colspan="4" style="word-break:break-all;border:1px solid #4577da;background-color:#4577da;padding:5px;color:#ffffff;font-size:14px;text-align:center;"><strong><span leaf="">漏洞概述</span></strong></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">漏洞名称</span></strong></td><td colspan="3" style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">Linux Kernel Dirty Frag 本地权限提升漏洞</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">安恒CERT评级</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">2级</span></section></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">CVSS3.1评分</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">7.8</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">CVE编号</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">未分配</span></section></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">CNVD编号</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">未分配</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">CNNVD编号</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">未分配</span></section></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">安恒CERT编号</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">WM-202605-000001</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">POC情况</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">已发现</span></section></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">EXP情况</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">未发现</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">在野利用</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">未发现</span></section></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">研究情况</span></strong></td><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="">已复现</span></section></td></tr><tr><td style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><strong><span leaf="">危害描述</span></strong></td><td colspan="3" style="word-break:break-all;border:1px solid #4577da;padding:5px;font-size:14px;color:#3e3e3e;"><section><span leaf="" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;color: rgb(62, 62, 62);font-family: &#34;PingFang SC&#34;, system-ui, -apple-system, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 14px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: 0.544px;orphans: 2;text-align: justify;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;visibility: visible;" data-pm-slice="0 0 []">该漏洞源于 xfrm-ESP（自2017年）和RxRPC（自2023年）两个独立模块的逻辑缺陷，</span><span data-pm-slice="0 0 []" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: 0.544px;orphans: 2;text-align: justify;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;color: rgba(0, 0, 0, 0.9);font-family: &#34;PingFang SC&#34;, system-ui, -apple-system, &#34;system-ui&#34;, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 13px;background-color: rgb(255, 255, 255);float: none;display: inline !important;visibility: visible;"><span leaf="" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">攻击者可以实现对页缓存的写入，从而在几乎所有主流Linux发行版上稳定提权。</span></span></section></td></tr></tbody></table>  
  
该产品主要使用客户行业分布广泛，漏洞危害性极高，建议客户尽快做好自查及防护。  
  
**安恒研究院卫兵实验室已通过恒脑AI代码审计智能体复现此漏洞。**  
  
![screenshot](https://mmbiz.qpic.cn/mmbiz_jpg/P5dz00jGoyTsEgWNRbqrDVNrOG4Io8jEg0oLwWw6hUnhDf8NZwrkibtJHc9QSHcDOF06yTs6rbsJWvaYXXsIMsc1dLwVEGQzVocHqrnPG1yk/640?from=appmsg "")  
  
  
**漏洞信息**  
  
  
  
Linux 内核是 Linux 操作系统的核心组件，负责进程调度、内存管理、网络协议栈和驱动管理等功能。  
  
  
**漏洞描述**  
  
**漏洞危害等级：**  
高危  
  
**漏洞类型：**  
内存缓冲区操作限制不当  
  
  
**影响范围**  
  
**影响版本：**  
xfrm-ESP: cac2661c53f3 (2017-01-17) 至今所有上游内核；RxRPC: 2dc334f1a63a (2023-06) 至今所有上游内核。已知受影响发行版版本包括：Ubuntu 24.04.4 (6.17.0-23-generic)、RHEL 10.1 (6.12.0-124.49.1.el10_1.x86_64)、openSUSE Tumbleweed (7.0.2-1-default)、CentOS Stream 10 (6.12.0-224.el10.x86_64)、AlmaLinux 10 (6.12.0-124.52.3.el10_1.x86_64)、Fedora 44 (6.19.14-300.fc44.x86_64)  
  
  
**CVSS向量**  
  
访问途径（AV）：本地  
  
攻击复杂度（AC）：低  
  
所需权限（PR）：低  
  
用户交互（UI）：不需要用户交互  
  
影响范围（S）：不变  
  
机密性影响（C）：高  
  
完整性影响（I）：高  
  
可用性影响（A）：高  
  
  
**修复方案**  
  
  
  
**官方修复方案**  
  
官方暂未发布补丁。上游内核已合入修复补丁，在 espinput/esp6input 的 skipcow 分支中检查 SKBFLSHAREDFRAG 标志，确保 splice 引入的外部固定页始终进入 skbcowdata 路径，阻止攻击者固定的页缓存页进入就地 AEAD 的目标 SGL。修复补丁 commit: f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4。各发行版 backport 后请及时更新至最新版本。  
  
信息来源：https://git.kernel.org/pub/scm/linux/kernel/git/netdev/net.git/commit/?id=f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4  
  
**临时缓解方案**  
  
临时缓解方案（基于漏洞暴露面的保守缓解）：可通过禁用存在漏洞的内核模块来防止漏洞被利用。执行以下命令禁用 esp4、esp6 和 rxrpc 模块：sh -c "printf &#x27;install esp4 /bin/false install esp6 /bin/false install rxrpc /bin/false &#x27; > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"。注意：禁用这些模块可能会影响 IPsec ESP 加密和 RxRPC 远程过程调用功能。  
  
信息来源：https://www.openwall.com/lists/oss-security/2026/05/07/8  
  
  
**参考资料**  
  
  
  
https://www.openwall.com/lists/oss-security/2026/05/07/8  
  
https://github.com/V4bel/dirtyfrag  
  
https://git.kernel.org/pub/scm/linux/kernel/git/netdev/net.git/commit/id=f4c50a4034e62ab75f1d5cdd191dd5f9c77fdff4  
  
  
**产品能力覆盖**  
  
  
  
<table><tbody><tr><td data-colwidth="33.0000%" width="33.0000%" style="border-color:#4577da;background-color:#4577da;"><section style="margin-top:5px;margin-bottom:5px;"><section style="padding-right:5px;padding-left:5px;text-align:left;font-size:14px;color:rgb(255, 255, 255);margin-bottom:unset;box-sizing:border-box;"><p><strong><span leaf="">产品名称</span></strong></p></section></section></td><td data-colwidth="67.0000%" width="67.0000%" style="border-color:#4577da;background-color:#4577da;"><section style="margin-top:5px;margin-bottom:5px;"><section style="padding-right:5px;padding-left:5px;text-align:left;font-size:14px;color:rgb(255, 255, 255);margin-bottom:unset;box-sizing:border-box;"><p><strong><span leaf="">覆盖补丁包</span></strong></p></section></section></td></tr><tr><td data-colwidth="33.0000%" width="33.0000%" style="border-color:#4577da;"><section style="margin-top:5px;margin-bottom:5px;"><section style="padding-right:5px;padding-left:5px;text-align:left;font-size:14px;margin-bottom:unset;box-sizing:border-box;"><p><span leaf="">明鉴漏洞扫描系统</span></p></section></section></td><td data-colwidth="67.0000%" width="67.0000%" style="border-color:#4577da;"><section style="margin-top:5px;margin-bottom:5px;"><section style="padding-right:5px;padding-left:5px;text-align:left;font-size:14px;margin-bottom:unset;box-sizing:border-box;"><p><span leaf="">V1.0.3778.0及以上</span></p></section></section></td></tr></tbody></table>  
  
  
  
**技术支持**  
  
  
  
如有漏洞相关需求支持请联系400-6059-110获取相关能力支撑。  
  
