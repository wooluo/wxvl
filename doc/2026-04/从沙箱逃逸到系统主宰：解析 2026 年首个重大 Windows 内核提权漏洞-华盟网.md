#  从沙箱逃逸到系统主宰：解析 2026 年首个重大 Windows 内核提权漏洞-华盟网  
ming
                    ming  黑白之道   2026-04-06 00:12  
  
在 Windows 中，所有对afd.sys的操作都通过打开\Device\Afd设备句柄完成。  
- 深度细节：攻击者并不直接调用 socket()，而是通过 NtCreateFile 直接获取 AFD 设备的原始句柄。该漏洞的核心在于 AfdBind 函数（或 AfdXxx 相关派生函数）在处理 AFD_BIND_DATA 结构体时，对用户态传入的地址长度（ Address Length ）校验存在逻辑缺陷。  
  
- 整数溢出触发：当传入一个极大的 AddressLength（例如接近 0xFFFFFFFF）时，内核在计算总分配空间时发生绕回（ Wrap-around ），导致分配了一个极小的非分页池内存，但随后的 RtlCopyMemory 操作却拷贝了大量数据，造成越界写入。  
  
这是提权漏洞的“皇冠明珠”。你需要向读者解释攻击者是如何在内存乱局中精确定位的。  
- ActiveProcessLinks 遍历：攻击者利用溢出获得内核执行权限后（通过覆盖函数指针或异步过程调用 APC ），会遍历内核中的 EPROCESS 双向链表。  
  
- [敏感信息已移除] 定位到当前攻击进程（受限权限）的 EPROCESS 结构。 定位到系统进程（如 PID 为 4 的 System 进程）的 EPROCESS 结构。 读取 System 进程的 [敏感信息已移除] EPROCESS + 0x4b8 偏移处，具体取决于 Windows 版本）。 将该地址覆盖到攻击进程的 [敏感信息已移除] - 结果**：当前进程瞬间“继承”了系统的最高权限，且这种修改在任务管理器中是不可见的，直到进程执行 whoami /user。  
  
黑客是如何绕过的。  
- KASLR 绕过：内核地址空间随机化（ KASLR ）本应让攻击者找不到 EPROCESS 的位置。但在 2026 年的实战中，黑客通常配合 NtQuerySystemInformation 泄露内核对象地址，或者利用 afd.sys 自身的其他信息泄露（ Information Leak ）漏洞来获取基址。  
  
- VBS/HVCI 挑战：如果开启了“基于虚拟化的安全（ VBS ）”，内核内存是受保护的（只读），即使发生溢出也无法直接修改 [敏感信息已移除]。  
  
深度观点：黑客可能会转向修改 PreviousMode 标志位（位于 KTHREAD 结构中）。将 PreviousMode 从 UserMode (1) 修改为 KernelMode (0)，可以让后续的系统调用（如 NtWriteVirtualMemory ）跳过权限检查，从而变相实现内核读写。  
  
  
漏洞代码 (afd.sys 内部):  
```
// 简化后的风险逻辑
ULONG TotalSize = HeaderSize + UserInput->AddrLength; // ！！！此处未检查整数溢出
PVOID Buffer = ExAllocatePoolWithTag(NonPagedPool, TotalSize, 'Afd '); 
RtlCopyMemory(Buffer, UserInput->Data, UserInput->AddrLength); // 越界拷贝发生
```  
  
越界拷贝发生  
```
// 增加安全校验
if (RtlULongAdd(HeaderSize, UserInput->AddrLength, &TotalSize) != STATUS_SUCCESS || 
    TotalSize > MAX_ALLOWED_SIZE) {
    return STATUS_INVALID_PARAMETER; // 拦截非法长度
}
```  
  
- 历史包袱：afd.sys 的部分代码甚至可以追溯到 Windows NT 时代。由于需要保证极致的网络性能，其内部大量使用了原始指针和手动内存管理。  
  
- 供应链风险：虽然这是微软自己的驱动，但许多第三方防火墙和杀毒软件会挂钩（ Hook ）afd.sys。这种漏洞的修复可能会导致第三方安全软件的不兼容甚至蓝屏（ BSOD ）。  
  
> “在应用层，我们讨论的是代码逻辑和认证机制；但在内核层，我们讨论的是对每一比特内存的绝对控制。 CVE-2026-21236 提醒我们，即使是在最坚固的堡垒之下，那些服务了数十年的老旧驱动（ AFD.sys ）依然是数字世界最脆弱的‘阿喀琉斯之踵’。”  
  
  
