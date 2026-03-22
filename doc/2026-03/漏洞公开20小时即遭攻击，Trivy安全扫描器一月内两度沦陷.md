#  漏洞公开20小时即遭攻击，Trivy安全扫描器一月内两度沦陷  
数据安全研究组
                    数据安全研究组  数据安全合规交流部落   2026-03-22 00:21  
  
# 数据安全日报 · 2026年03月21日  


>   
> 今天有一个值得记住的数字：**20小时**。Langflow漏洞从公开到遭受真实攻击，只用了20小时。这不是个例，而是2026年漏洞利用速度的新常态。修复窗口正在以小时为单位消失。  
>   
  


## 🔴 重大安全事件  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKkibkv2CXQ8LHQ4tP5psN8wtnH2tDcibA5FzicEoO9jQHQpUfcnJ7M9CuvfI4siaodxelPFTVicXKWyeeDIvBdmsQ0YtDxcibrECEoul4/640?wx_fmt=jpeg "")  

### Trivy供应链攻击：一个月，被攻陷两次  

  
全球最广泛使用的开源容器漏洞扫描器 **Trivy** 本月遭遇罕见的连续供应链攻击，且规模逐轮升级。  

  
**第一轮——npm生态投毒**
攻击者在相关npm包中植入窃密后门，并释放具有自我传播能力的蠕虫 **CanisterWorm**，目前已在开发者生态中横向感染 **47个npm包**，仍在持续蔓延。  

  
**第二轮——GitHub Actions全面劫持**
官方组件 aquasecurity/trivy-action 与 aquasecurity/setup-trivy 遭到篡改，**75个历史版本标签被替换为恶意版本**，专门用于在CI/CD流水线执行期间窃取高权限密钥。  

  
**核心风险：** CI/CD密钥通常拥有云平台部署权限、代码仓库写入权限、生产数据库访问权限，是整个技术栈中权限最高的凭据之一。安全工具因其天然的高信任属性，正在成为攻击者渗透企业的优先目标。  

  
**自查清单：**  

```
□ CI/CD中Trivy Action是否使用浮动tag？→ 改为SHA哈希锁定
□ 受影响时间段的CI/CD流水线密钥是否已轮换？
□ npm依赖中是否存在CanisterWorm异常行为？

```  
>   
> 📎 FreeBuf[1] · THN·蠕虫篇[2] · THN·Actions篇[3]  
>   
  


## 🔴 高危漏洞集中预警  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKkicVKOp0YtpRPx8NolCGaYWIn0gGziapiaiaUXFKXXXdX1XVwngFA0RLu9opc41tb0nDXEvHA8LYiacIfPKx2qUNNLTfVYGTiatT53oc/640?wx_fmt=jpeg "")  

### ① Oracle Identity Manager — 无认证RCE（CVSS 9.8）  

  
**CVE-2026-21992** 允许任意攻击者无需账号密码直接远程执行代码，完全接管Oracle身份与访问管理系统。Oracle以极罕见的**带外紧急补丁**形式响应，跳过季度例行更新——这本身就是最强烈的危险信号。  

  
身份管理系统一旦沦陷，攻击者可任意创建账号、重置密码，进而横向渗透企业全域系统。  

  
**→ 今日内修复，不可等待**  

>   
> 📎 The Hacker News[4] · BleepingComputer[5]  
>   
  


### ② Langflow — 20小时内遭真实攻击（CVSS 9.3）  

  
**CVE-2026-33017**：AI工作流框架Langflow核心API缺失身份认证。从漏洞公开披露到攻击者完成武器化并发动真实攻击，**仅用了20小时**。  

  
这意味着：发现漏洞、阅读公告、规划修复计划——你能用来响应的时间，还不够完成一个完整的工作日。  

>   
> 📎 The Hacker News[6]  
>   
  


### ③ Cisco FMC — 满分漏洞，CISA要求明日前修复  

  
**CVE-2026-20131（CVSS 10.0）**：Cisco Secure Firewall Management Center满分漏洞，CISA已向联邦机构下达**3月22日（明日）强制修复令**。防火墙管理层被攻陷，等同于整个网络边界防御体系形同虚设。  

>   
> 📎 BleepingComputer[7]  
>   
  


### ④ Magento PolyShell — 电商攻击持续扩散  

  
Magento REST API高危漏洞，攻击者可无需认证上传可执行文件，进而RCE与账户接管。多态混淆技术绕过安全检测，**数千个电商平台、国际品牌及政务网站**自2月27日起持续遭到篡改。  

>   
> 📎 The Hacker News[8] · SecurityWeek[9]  
>   
  


### ⑤ Windows RDS — 内网提权至SYSTEM  

  
微软已发补丁，修复远程桌面服务权限提升漏洞，可一步提升至系统最高权限。内网RDP暴露面广泛的环境请优先部署。  

>   
> 📎 FreeBuf[10]  
>   
  


### ⑥ 其他高危漏洞速查  

<table>
<thead>
<tr>
<th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;font-weight: bold;background-color: rgb(240, 240, 240);">产品</th>
<th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;font-weight: bold;background-color: rgb(240, 240, 240);">类型</th>
<th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;font-weight: bold;background-color: rgb(240, 240, 240);">核心危害</th>
<th style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;font-weight: bold;background-color: rgb(240, 240, 240);">处置</th>
</tr>
</thead>
<tbody><tr>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">WordPress Ally插件</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">SQL注入</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">约<strong>40万</strong>网站可被拖库</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">立即更新</td>
</tr>
<tr>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">HPE Aruba OS</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">未授权密码重置</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">无需认证接管管理后台</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">关注官方补丁</td>
</tr>
<tr>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">GitLab</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">XSS + API DoS</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">双漏洞组合</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">紧急升级</td>
</tr>
<tr>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">Quest KACE</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">CVE-2025-32975</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">教育行业在野利用</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">立即评估</td>
</tr>
<tr>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">Apple iOS旧款</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">Coruna/DarkSword</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">串联6漏洞，4国用户受影响</td>
<td style="font-size: 0.75em;padding: 9px 12px;line-height: 22px;color: rgb(34, 34, 34);border: 1px solid rgb(216, 216, 216);vertical-align: top;">CISA要求4/3前修复</td>
</tr>
</tbody></table>

## 🟠 数据泄露  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKkib5GU7vfvZKXeQMat7Dic9aSLf5YCXDOZoHqwibhQz4JjyW1CoKue1nuo0wMffZ2szJicUohkYCHuibekOtxE8jmS2DtopLUmqD39o/640?wx_fmt=jpeg "")  

### Navia 270万用户健康数据外泄  

  
福利管理平台Navia披露：黑客在**2025年12月至2026年1月**间潜伏于系统，窃取了**270万用户**的个人信息与健康计划数据。健康数据是网络黑市的高价商品，可直接用于医疗欺诈、精准诈骗和保险骗赔，变现链路完整成熟。  

>   
> 📎 SecurityWeek[11]  
>   
  


## 🌐 全球安全动态  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKk8QETiaETTLUzQNbIKsHgZNn9ibUALAZCRkKRYRLOV7OTltNz3VhNUq4a8BjDlv0HzxnWzwnx5icEpeFUoAXobrh7YAicmF1parEyI/640?wx_fmt=jpeg "")  

  
**🇷🇺 FBI警告：俄情报机构攻击Signal/WhatsApp用户**
与俄罗斯情报机构关联的黑客正大规模钓鱼攻击加密通讯软件用户，**数千账户**已失陷，目标集中于外交官、记者、研究人员。加密通讯≠账号安全，入口依然是钓鱼的突破口。  

>   
> 📎 THN[12] · BC[13]  
>   
  

  
**🌍 美德加联合摧毁四大IoT僵尸网络**
Aisuru、KimWolf、JackSkid、Mossad的C2基础设施被联合行动彻底瓦解。  

>   
> 📎 BleepingComputer[14]  
>   
  

  
**🇮🇷 美国确认Handala受伊朗政府支持，没收运营域名**  

>   
> 📎 SecurityWeek[15]  
>   
  

  
**📱 Google Android旁加载新增24小时强制等待期**
未经验证开发者App安装需等待24小时，有效压缩恶意软件快速传播的时间窗口。  

>   
> 📎 THN[16]  
>   
  


## 🤖 AI安全前沿  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKkibziao93uBPMNsl41CGMibPFcsdIoEJNAkI8m1uuZNNPT9DmqMn0lGVHy9IsMk6HE9NbDiaRVcQRHESBSjn3wMxbibKfS0FTbsbZag/640?wx_fmt=jpeg "")  

  
**AI Agent插件生态：新型供应链攻击温床正在形成**
研究人员在AI Agent插件市场中发现恶意技能包，能静默窃取数据并建立持久控制，现有安全检测几乎无法覆盖。随着AI Agent快速普及，其插件生态的供应链安全已成不可忽视的系统性风险。  

>   
> 📎 FreeBuf[17]  
>   
  

  
**行为分析：下一代防御的核心能力**
AI生成的个性化钓鱼、Deepfake、变形恶意软件已让基于特征的检测体系大面积失效。面对AI赋能的攻击，行为异常检测正在成为防守方最后的有效防线。  

>   
> 📎 THN[18]  
>   
  


## ✅ 今日行动清单  

  
![](https://mmbiz.qpic.cn/mmbiz_jpg/XfaKEJuIKk88dWic89JibCLnYn5GfalJkZCBKe5yFCXB6tur8tq6nITx46nYF361zfLgtEGJaicdjIwXXAKBUFiav7G4KVQCudrNiamyOeSQhJQs/640?wx_fmt=jpeg "")  

  
**🔴 今日内（不可拖延）**  

-  Oracle Identity Manager → 修复 CVE-2026-21992（CVSS 9.8）  
  
-  Trivy CI/CD → SHA版本锁定 + 全量密钥轮换  
  
-  Langflow → 修复 CVE-2026-33017（已有在野利用）  
  

  
**🔴 明日（3月22日）前**  

-  Cisco FMC → 修复 CVE-2026-20131（CISA强制令）  
  

  
**🟠 本周内**  

-  Magento → 排查PolyShell，修复REST API鉴权  
  
-  Windows → 部署RDS权限提升补丁  
  
-  GitLab → 升级至最新版本  
  
-  WordPress Ally插件 → 更新修复SQL注入  
  
-  HPE Aruba → 限制管理接口，关注官方补丁  
  

  
**🟡 4月3日前**  

-  Apple iOS / macOS 旧版本 → 系统升级（CISA KEV）  
  


  
数据来源：安全客 · FreeBuf · The Hacker News · BleepingComputer · SecurityWeek · CISA
本日报仅供安全防御研究参考，请在合法授权范围内使用相关技术信息  

  
📮 关注本公众号，每日推送数据安全动态 · 转载请注明来源  

### 引用链接  
  
[1]  
FreeBuf: https://www.freebuf.com/articles/es/474442.html  
  
[2]  
THN·蠕虫篇: https://thehackernews.com/2026/03/trivy-supply-chain-attack-triggers-self.html  
  
[3]  
THN·Actions篇: https://thehackernews.com/2026/03/trivy-security-scanner-github-actions.html  
  
[4]  
The Hacker News: https://thehackernews.com/2026/03/oracle-patches-critical-cve-2026-21992.html  
  
[5]  
BleepingComputer: https://www.bleepingcomputer.com/news/security/oracle-pushes-emergency-fix-for-critical-identity-manager-rce-flaw/  
  
[6]  
The Hacker News: https://thehackernews.com/2026/03/critical-langflow-flaw-cve-2026-33017.html  
  
[7]  
BleepingComputer: https://www.bleepingcomputer.com/news/security/cisa-orders-feds-to-patch-max-severity-cisco-flaw-by-sunday/  
  
[8]  
The Hacker News: https://thehackernews.com/2026/03/magento-polyshell-flaw-enables.html  
  
[9]  
SecurityWeek: https://www.securityweek.com/thousands-of-magento-sites-hit-in-ongoing-defacement-campaign/  
  
[10]  
FreeBuf: https://www.freebuf.com/articles/vuls/474426.html  
  
[11]  
SecurityWeek: https://www.securityweek.com/navia-data-breach-impacts-2-7-million/  
  
[12]  
THN: https://thehackernews.com/2026/03/fbi-warns-russian-hackers-target-signal.html  
  
[13]  
BC: https://www.bleepingcomputer.com/news/security/fbi-links-signal-phishing-attacks-to-russian-intelligence-services/  
  
[14]  
BleepingComputer: https://www.bleepingcomputer.com/news/security/aisuru-kimwolf-jackskid-and-mossad-botnets-disrupted-in-joint-action/  
  
[15]  
SecurityWeek: https://www.securityweek.com/us-confirms-handala-link-to-iran-government-amid-takedown-of-hackers-sites/  
  
[16]  
THN: https://thehackernews.com/2026/03/google-adds-24-hour-wait-for-unverified.html  
  
[17]  
FreeBuf: https://www.freebuf.com/articles/474349.html  
  
[18]  
THN: https://thehackernews.com/2026/03/the-importance-of-behavioral-analytics.html  
  
