#  【实战复现】常见企业系统漏洞合集——从监控系统到ERP平台  
原创 xuzhiyang
                    xuzhiyang  玄武盾网络技术实验室   2026-03-31 03:04  
  
⚠️   
*免责声明：本文仅供安全研究与学习之用，  
严禁使用本内容进行未经授权的违规渗透测试，遵守网络安全法，共同维护网络安全，违者后果自负。  
  
  
每日资源分享：  
泛微E-cology9 SQL 注入漏洞批量检测工具  
  
更多资源访问：  
www.xwdjs.ysepan.com  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/UM0M1icqlo0ksibSrdmG6RUINt7tm0jzNfWelbIic01JSwTMGicib8TAu6uppbPm8aHJcTvfAr1aRe8ibLpbWwPlXdrg/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/UM0M1icqlo0ksibSrdmG6RUINt7tm0jzNfYiaMz4mX1pUS9oQsq6muLibPdPgx7hLb4fEicsxBZARI6ibI6Q0uOsk3Yw/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=1 "")  
  
  
正文  
  
  
漏洞类型：未授权访问 / SQL注入 / 任意文件上传 / 远程代码执行  |  适用于：红队渗透、护网行动、SRC挖掘  
  
  
  
在企业内网渗透中，监控系统、OA协同、ERP管理平台是最常见的三类目标。这些系统往往部署在核心网络，拥有大量敏感数据，且历史漏洞众多、修复滞后。  
  
本文整理了实战中高频出现的几类系统漏洞，涵盖大华监控、致远OA、用友ERP等，提供完整的复现流程和利用技巧。  
## 一、大华智能监控平台高危  
## 0x01 漏洞概述  
  
大华 DVR/NVR 设备及智能监控平台长期存在多个高危漏洞，主要包括：  
<table><tbody><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">漏洞类型</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">影响组件</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">危害等级</span></section></th></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">未授权访问</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">/admin.htm、/edit.htm、/login.action</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">高危</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">敏感信息泄露</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">/current_config、/config.xml</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">中危</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">任意文件读取</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">/portal/..;/etc/passwd</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">高危</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">远程命令执行</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">部分旧固件 Telnet 后门</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">严重</span></section></td></tr></tbody></table>## 0x02 未授权访问复现  
  
**漏洞点：**  
部分版本的管理界面存在绕过，直接访问后台路径无需认证。  
  
Step 1  
探测开放端口  
```
```  
  
Step 2  
访问后台绕过  
```
```  
  
Step 3  
获取摄像头画面  
```
```  
## 0x03 配置文件泄露  
```
```  
  
⚡ 大华设备默认账号：admin/admin  
 或 admin/888888  
，大量设备从未修改。  
## 0x04 批量探测脚本  
```
```  
## 二、致远OA协同办公系统严重  
## 0x01 漏洞概述  
  
致远OA是国内占有率最高的协同办公系统之一，历史漏洞丰富，是护网和红队的重点目标。  
<table><tbody><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">漏洞名称</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">漏洞类型</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">影响版本</span></section></th></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">任意文件上传</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">WebMail 附件上传</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">A6/A8 多个版本</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">SQL注入</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">多个接口参数未过滤</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">全版本</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">SSRF</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">远程图片抓取功能</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">A8 v5.x</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">远程代码执行</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">Apache Shiro 反序列化</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">A8 v5.x</span></section></td></tr></tbody></table>## 0x02 任意文件上传漏洞（WebMail）  
  
**漏洞点：**/seeyon/webmail.do  
 接口允许上传任意类型文件。  
  
Step 1  
上传 JSP WebShell  
```
```  
  
Step 2  
访问 WebShell  
```
```  
## 0x03 SQL注入漏洞  
  
**漏洞点：**  
多个接口存在未过滤的 SQL 参数。  
```
```  
## 0x04 Shiro 反序列化 RCE  
  
部分版本使用了存在漏洞的 Apache Shiro 组件，且使用默认密钥。  
```
```  
  
✅ 致远OA漏洞利用门槛低，大量资产暴露在公网，是护网必打目标。  
## 三、用友NC/ERP系统严重  
## 0x01 漏洞概述  
  
用友NC是国内大型企业广泛使用的ERP系统，承载财务、供应链等核心业务，漏洞危害极大。  
<table><tbody><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">漏洞名称</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">漏洞类型</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">CVE编号</span></section></th></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">任意文件上传</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">FileManager 接口</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">CVE-2023-xxxx</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">SQL注入</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">多处接口参数拼接</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">-</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">XXE注入</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">XML解析无过滤</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">-</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">远程代码执行</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">JNDI注入/反序列化</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">-</span></section></td></tr></tbody></table>## 0x02 任意文件上传复现  
  
**漏洞点：**/uapim/upload.jsp  
 等接口。  
  
Step 1  
上传 JSP Shell  
```
```  
  
Step 2  
执行命令  
```
```  
## 0x03 SQL注入批量检测  
```
```  
## 0x04 常见敏感路径  
```
```  
## 四、其他高频系统漏洞速查中高危  
## 0x01 通达OA  
```
```  
## 0x02 蓝凌OA  
```
```  
## 0x03 金蝶ERP  
```
```  
## 五、渗透实战要点总结  
  
📌 **信息收集阶段：**  
1. 遍历常见端口（80、443、8080、8443、9090等）  
2. 识别系统类型（页面特征、响应头、Title）  
3. 尝试默认账号口令（大量系统从未修改）  
4. 扫描敏感路径（/admin、/upload、/config等）  
  
📌 **漏洞利用阶段：**  
1. 优先尝试未授权访问和弱口令  
2. 文件上传 → WebShell → 提权  
3. SQL注入 → 读取敏感表 → 获取管理员密码  
4. 反序列化 → RCE → 内网横向  
  
📌 **后渗透阶段：**  
1. 数据库连接串通常保存在配置文件中  
2. OA系统往往集成了邮件、AD域，可获取大量凭证  
3. ERP系统存储财务、供应链等核心数据  
4. 监控系统可作为内网跳板和情报来源  
## 六、防护建议  
<table><tbody><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">措施</span></section></th><th style="box-sizing: border-box;margin: 0px;padding: 9px 13px;background: rgb(249, 250, 251);border: 1px solid rgb(229, 231, 235);text-align: left;font-weight: 600;color: rgb(107, 114, 128);font-size: 12px;"><section><span leaf="">说明</span></section></th></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">强制定期改密</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">杜绝默认口令，实施密码复杂度策略</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">网络隔离</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">核心系统不应直接暴露在公网</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">及时升级补丁</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">关注厂商安全公告，及时打补丁</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">WAF防护</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);"><section><span leaf="">部署WAF拦截常见攻击</span></section></td></tr><tr style="box-sizing: border-box;margin: 0px;padding: 0px;"><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">日志审计</span></section></td><td style="box-sizing: border-box;margin: 0px;padding: 9px 13px;border: 1px solid rgb(229, 231, 235);color: rgb(55, 65, 81);background: rgb(250, 250, 250);"><section><span leaf="">开启访问日志，定期排查异常请求</span></section></td></tr></tbody></table>  
⚠️ 再次免责声明：本文所有复现操作均在授权测试环境中进行，相关技术仅供安全研究与学习参考。请勿将上述内容用于未授权渗透测试或任何违法活动，否则后果自负。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/UM0M1icqlo0knIjq7rj7rsX0r4Rf2CDQylx0IjMfpPM93icE9AGx28bqwDRau5EkcWpK6WBAG5zGDS41wkfcvJiaA/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp#imgIndex=5 "")  
  
