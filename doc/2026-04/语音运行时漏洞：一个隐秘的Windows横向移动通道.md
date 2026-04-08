#  语音运行时漏洞：一个隐秘的Windows横向移动通道  
 幻泉之洲   2026-04-08 06:59  
  
>   
  
## 当语音功能变成攻击武器  
  
SpeechRuntime.exe是Windows的一个合法组件，负责语音输入和识别，现代Windows的很多语音体验都离不开它。  
  
但问题在于，它也是一个COM（Component Object Model）服务器。有本地管理员权限的攻击者，可以劫持这个COM对象，借用目标主机上已登录用户的会话权限来执行代码。本质上，这是一种跨会话激活攻击。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibeHPscqYObVCsoialxOFrCthCHqgfCTsuBt9maKcZMEWuWv3OCE6eic33HLzMDic83zCq0WvwQ5FYmrQmOCDDVkRDqnMuKb4FkYg0/640?wx_fmt=png&from=appmsg "")  
## 攻击剧本解析  
  
最近公开的工具SpeechRuntimeMove（GitHub）完整复现了这种攻击。  
  
它的攻击思路和之前Bitlocker相关的横向移动很相似，所以检测思路也差不多。攻击的第一步，是找到目标。SpeechRuntime本身位于C:\Windows\System32\Speech_OneCore\Common\目录下。  
### 远程会话枚举：用非官方API窥探  
  
攻击者需要知道目标机器上谁在登录，尤其是用着RDP的管理员。SpeechRuntimeMove用了微软未公开的API，这些函数藏在winsta.dll里。我们熟悉的qwinsta命令也是靠这个DLL来显示远程桌面会话信息的。  
  
using System;using System.Data;using System.Runtime.InteropServices;...[DllImport("winsta.dll", SetLastError = true, CharSet = CharSet.Unicode)]public static extern IntPtr WinStationOpenServerW(string serverName);// 其他导入...  
  
工具主要调用这几个API：  
- WinStationOpenServerW: 打开目标服务器的句柄。  
- WinStationEnumerateW: 枚举系统上的所有会话。  
- WinStationQueryInformationW: 获取指定会话的详细信息。  
- WinStationCloseServer: 关闭服务器句柄。  
用winsta.dll而不是官方推荐的wtsapi32.dll（WTSEnumerateSessions系列函数），有时是为了规避检测。  
### COM劫持的核心：篡改注册表  
  
简单的说，COM劫持就是改注册表，把COM对象激活时应该加载的东西，指向攻击者自己的恶意代码。  
  
SpeechRuntime对应的CLSID是{655D9BF9-3876-43D0-B6E8-C83C1224154C}。攻击的关键，就是在目标用户的注册表路径下（比如HKEY_CURRENT_USER\SOFTWARE\Classes\CLSID\{655D9BF9...}\InProcServer32）写入恶意DLL的路径。  
  
但这里有个障碍：远程注册表服务（Remote Registry）默认是**禁用**的。  
  
所以攻击链里多了一步：通过WMI（Windows Management Instrumentation）远程把这个服务启动起来。下面这段代码展示了如何操作：  
  
ManagementScope scope = new ManagementScope($"\\\\{computerName}\\root\\cimv2", options);scope.Connect();ObjectQuery query = new ObjectQuery("SELECT * FROM Win32_Service WHERE Name='RemoteRegistry'");foreach (ManagementObject service in searcher.Get()){inParams["StartMode"] = "Automatic";service.InvokeMethod("ChangeStartMode", inParams, null);service.InvokeMethod("StartService", null);}  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibcqmoahbe3ZAqaMTZ1IFyNuexJqKqte5TKGMHbsybGn9ybjRzImYPVCdRVGLmicFUeib7SibcrzknZtu6wd5CQqGUxEJo4SW5FUCM/640?wx_fmt=png&from=appmsg "")  
## 攻击演示：从侦察到执行  
  
SpeechRuntimeMove是个.NET工具，可以直接在C2框架里内存加载执行。  
  
首先，枚举目标主机（比如10.0.0.13）上的会话：  
  
dotnet inline-execute /home/kali/Downloads/SpeechRuntimeMove.exe mode=enum target=10.0.0.13  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibesusZG289rv3cbPAZJ3NIlK53KfP7LxJgdOEzztdvS6O7Xyk6ARDxv37D4T3bBCKg9RyRVIntPGQSWDDDpQicV379T0A7AnM8U/640?wx_fmt=png&from=appmsg "")  
  
假设发现管理员用户“Administrator”正在通过RDP登录（会话ID为2）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfXRSNa0NIEWcvDCrZGIMWF33RqLYcQyTeSn0BQfffv4GBudevZs9a9319PEFzmJE6Yl7y26fkFFSO12dnCZZN98pf1Xp3TWicQ/640?wx_fmt=png&from=appmsg "")  
  
接着，发动攻击。攻击会做这几件事：把恶意DLL扔到目标磁盘上（比如C$共享目录），启动远程注册表服务，然后修改注册表实现COM劫持。工具最后还会清理痕迹。  
  
dotnet inline-execute /home/kali/Downloads/SpeechRuntimeMove.exe mode=attack target=10.0.0.13 dllpath=C:\temp\demon.x64.dll session=2 targetuser=ipurple\Administrator command="cmd.exe /C calc.exe"  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibdxg4tEj7yxMibbCmIMUpOlyrBMD1wz3OBB4ppr8kKP3ic6IPXlPh9VjOYI0cjEHIOic1EQFsBKaDxLaRfYZWnWKFtaibk56L9hzC8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdEAyjqLtPsWsyyfmruuSFibZiaXogXKEjNoqWib7WEiaE6OccAeCr0FwIXhlxl5wVxq4UsN3uUeNmFZgkkiccfodzNs1zJylJMq8u4/640?wx_fmt=png&from=appmsg "")  
  
最终，恶意代码会在目标用户的会话中，以SpeechRuntime.exe进程的身份执行起来。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibeZzk7J8Lwd2qFsdEWcYc7ORGxxLX7stWJe8edO2kwslmsM3nHEBmMgxKx40Ik11yhsDxezy2wpBINNkzY6DcL9Vr9QCWAeIeU/640?wx_fmt=png&from=appmsg "")  
  
整个攻击流程可以用下图概括：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/tbTbtBE6Tibe24hy9QU32L7I7ibFecDwCRdoX5OLZeoO2QFxVrmRxhjv1icLoYvqGdwbGDNiaibLxM73yibyTRuNvZfjLBAPPoJicralS7LL3IHDrE/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/tbTbtBE6TibdrIeLzf43WYye89SDmxAY65iaJVS78KJZPvY1DZbaxF3X9T62JfLzp38jfABlQzu4B9oqYRd9ibl2XhGmmcapgfzxiaZuRaQcHw8/640?wx_fmt=jpeg&from=appmsg "")  
## 如何检测？多层设防  
  
防御这种攻击，需要结合端点和服务器的多个数据源。它的攻击链长，留下的蛛丝马迹也多。  
### 1. API调用监控  
  
攻击工具使用了winsta.dll的非公开API枚举会话。防御方需要关注：  
- 是否有非标准进程（非qwinsta.exe、tsadmin.msc等）加载了winsta.dll或wtsapi32.dll？  
- EDR产品是否监控了这些用于远程会话枚举的API调用？攻击者也可能将代码注入到合法的微软进程里，所以需要结合其他事件关联分析。  
以下是相关的API对比：  
<table><thead><tr><th>库/DLL</th><th>API函数</th><th>功能</th></tr></thead><tbody><tr><td>winsta.dll</td><td>WinStationEnumerateW</td><td>枚举系统会话（攻击工具使用）</td></tr><tr><td>wtsapi32.dll</td><td>WTSEnumerateSessionsW</td><td>枚举RDP会话（微软官方）</td></tr></tbody></table>### 2. 服务状态变更告警  
  
**远程注册表服务是核心指征。**这个服务默认禁用，任何对其状态的远程修改都极其可疑。  
  
攻击通过WMI查询并修改服务状态，对应两个关键的Windows事件ID：  
- **事件ID 7040**：服务启动类型更改（从“禁用”改为“自动”）。可以在“事件查看器 > Windows日志 > 系统”里找到。  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibdDr2sfkaH3glWico6GCTIVZ4CJan2BWgwHea9g60T7gn4xtsuPiaC3b3k6TWWEjqBVKjXmzliaoVbL80wNByEa1JTYzzgjgRclrY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdulpNymkuEiclKsRYTB9Hu80PeKUpV6oOJ1LoHIx91HibJh8YA0Qh9sTE1kEN5Q3bL2EqhG88vGpPZ9gk7BTicLYQ2LXubHKiaOMs/640?wx_fmt=png&from=appmsg "")  
- **事件ID 7036**：服务进入运行状态。  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcAPKPgqHLrXzGdRe5qY8Oc1ibygtwu9Zfq0ZBYyxlCM4ZH70cOwdEX9jsE7L43JgTPZbNMg7uJSPjVbjNrWjmVjeUGAQHicqarM/640?wx_fmt=png&from=appmsg "")  
<table><thead><tr><th>事件ID</th><th>描述</th></tr></thead><tbody><tr><td>7040</td><td>服务启动类型变更</td></tr><tr><td>7036</td><td>服务进入运行状态</td></tr></tbody></table>### 3. 注册表键审计（最有效）  
  
攻击必然要修改注册表。防御者应该对特定的CLSID路径启用高级审计。  
  
关键路径是：HKEY_CURRENT_USER\SOFTWARE\Classes\CLSID\{655D9BF9-3876-43D0-B6E8-C83C1224154C}\InprocServer32  
  
配置方法：通过组策略（计算机配置 > 策略 > Windows设置 > 安全设置 > 注册表），添加这个路径，并审计“Everyone”或“Authenticated Users”组的“设置数值”、“创建子项”、“删除”、“写入DAC”等成功事件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcrnlF6O5OPKia46pj9tHIIFoia0zhPVkeLDdGqLsAadI4HzhibSlS81krDgHN5ZoTpicdtFXFhz67Wt2icpwtdSR9Ta7kAib9K09aro/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibc3Tc10j6s6rUHhT0dp6NADOwa3tBkj9P0y6I5g39jaNicqB9HIspn5icgguibOpBR3kRia8icmPK9zpENfIvL1wY0w8eRiaxJj9yFGg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibf29cNZYFUwGG9QSu61O9BeVjhaZchiagibTmQ88x0vKgLz1aAWD2QeibztUUlW1fX6GypVyVB4zONoibicM1Q4XFWGSX2L9sM5TNdM/640?wx_fmt=png&from=appmsg "")  
  
审计生效后，一旦该键被访问或修改，就会产生以下事件：  
- **4657**: 注册表项创建  
- **4663**: 注册表对象访问  
- **4660**: 注册表项删除（清理时）  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcGoGegAQrVdk3hClqRSY1T4ZbqRqM0qmibvDpn0MTr9v11ahxib6PtUic2IWJ7zYbW7c5y2RxUe5Oh8IE4aCtdBOXyp7Lj9booibs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfPR5UVJC3EgVyicxQgeLhWl83PCDbId79l64Ose3mbMoz6P4bQnbdXy3IBXy6xf24ibkTibxF5CmgP8K5xkNnyJVe8N92SdcyCms/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibf1WcJeOxel3qiaiaN9v0uNETSN0GBcke8BFMKUqHnt2kLMs343bAYPGDibibO2Wae0H6kc2EPBz80DGsbUJDAerfHHJ5qYjRicFr2g/640?wx_fmt=png&from=appmsg "")  
  
你可以用类似下面的KQL查询（以Microsoft Defender为例）来主动搜寻可疑活动：  
  
DeviceRegistryEvents| where RegistryKey has @"\Software\Classes\CLSID\{655D9BF9-3876-43D0-B6E8-C83C1224154C}\InProcServer32"| project Timestamp, DeviceName, InitiatingProcessAccountName, InitiatingProcessCommandLine, RegistryKey  
### 4. 进程创建监控  
  
攻击执行后，会创建两个关键进程：  
1. **SpeechRuntime.exe**：被劫持的合法进程，用于加载恶意代码。  
1. **WmiPrvSe.exe**：WMI提供程序宿主进程，在远程启动服务时产生。  
这些进程创建事件对应**事件ID 4688**。需要在组策略中启用“审核进程创建”（计算机配置 > 策略 > Windows设置 > 安全设置 > 高级审核策略配置 > 审核策略 > 详细跟踪 > 审核进程创建）。  
  
但要注意，在域控制器上开启这个审计会产生海量日志，得先评估存储容量。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibeNfPUIe1GQM4KD1gCxZGibkTIzOia62jVxKV1EEsm4pyIOkbZDqDECrBECY0q4avOLXnYXP0jIvdLCibX9Jzn6Y65KpzVyTcLtDM/640?wx_fmt=png&from=appmsg "")  
  
监控时，可以关注这些进程的父子关系：  
<table><thead><tr><th>父进程</th><th>子进程</th><th>事件ID</th></tr></thead><tbody><tr><td>svchost</td><td>SpeechRuntime.exe</td><td>4688</td></tr><tr><td>svchost</td><td>WmiPrvSe.exe</td><td>4688</td></tr></tbody></table>  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibdr9Od2j0GcEjXtECAnSVD232sUKEZ1bgRNOKxOrMyTibsCeUyMCDFfywJ8HEiadpadA4PaEuE2tt9dicIc6HhaK7yvkbA3VxgA9g/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibeiavwHBo5y3d75gSJuWtT2OyfhzcdsePGiaxhUpz6sHrrGibrWNbTKB7IlJndTgSoOJHAQZndwHYyDJeYWV6HOpZZ3HAHr0HxVpA/640?wx_fmt=png&from=appmsg "")  
  
对企业环境来说，**SpeechRuntime.exe的合法使用场景很少**。除了开启Windows语音识别，或者Edge、Office等应用使用语音功能时，平时基本见不到它。所以，在非特定场景下出现SpeechRuntime.exe进程，尤其是其父进程不是常见应用时，就是一个很强的异常信号。  
  
COM劫持给Windows环境下的横向移动开了不少后门。SpeechRuntime只是其中一个例子。防御团队需要把这些公开的、新型的攻击手法尽快纳入检测策略，别等对手用上了才反应过来。说到底，安全是一个持续对抗的过程，了解攻击者的工具箱，才能更好地守住自己的阵地。  
  
