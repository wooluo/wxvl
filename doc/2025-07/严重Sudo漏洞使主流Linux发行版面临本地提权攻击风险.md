#  严重Sudo漏洞使主流Linux发行版面临本地提权攻击风险  
鹏鹏同学  黑猫安全   2025-07-06 23:05  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8dBEfDPEceibDD8j7prZPRaxibuJUBSO2ibgicLH8mlOXsib0M7HRmNl3omlof7NxAS87rV8X4nFlvELcOr7V2JicMXQ/640?wx_fmt=png&from=appmsg "")  
  
网络安全研究人员披露了Linux及类Unix操作系统命令行工具Sudo的两个漏洞。攻击者可利用这些漏洞在受影响系统上将权限提升至root级别。  
  
Sudo（"superuser do"缩写）是Unix/Linux系统中的命令行工具，允许授权用户以其他用户（通常是root用户）的安全权限执行命令。  
  
漏洞详情如下：  
  
CVE-2025-32462（CVSS评分2.8）：  
  
当sudoers文件指定了非当前主机且非ALL的主机时，1.9.17p1之前的Sudo版本允许列出的用户在非目标机器上执行命令。  
  
CVE-2025-32463（CVSS评分9.3）：  
  
1.9.17p1之前的Sudo版本在使用--chroot选项时，会加载用户可控目录下的/etc/nsswitch.conf文件，导致本地用户获取root权限。  
  
Stratascale网络研究部门(CRU)团队发现了这两个本地提权漏洞。  
  
CVE-2025-32462：  
  
该高危漏洞源于2013年1.8.8版本引入的--host选项。虽然该选项本仅用于规则列举（sudo -l），但在特定企业配置中使用Host或Host_Alias指令时，攻击者可利用远程主机规则在本地执行特权命令。  
  
"CRU团队发现，自2013年引入host选项后，通过引用无关远程主机规则执行sudo/sudoedit命令时，Sudo会错误地将远程规则视为本地有效。"Stratascale报告指出，"即使生产服务器明确禁止低权限用户访问，通过指定开发服务器host选项仍可获取root权限。"  
  
该漏洞已通过限制--host选项仅用于列举的补丁修复。  
  
CVE-2025-32463：  
  
"--chroot选项本应允许用户在sudoers文件许可下使用自选根目录运行命令。但sudo 1.9.14版本修改了路径解析方式，攻击者可通过在用户指定根目录下创建/etc/nsswitch.conf文件诱导sudo加载恶意共享库。"Sudo维护团队公告称，"1.9.17p1版本已撤销该修改，并将chroot功能标记为弃用状态，未来版本将彻底移除该功能。"  
  
  
