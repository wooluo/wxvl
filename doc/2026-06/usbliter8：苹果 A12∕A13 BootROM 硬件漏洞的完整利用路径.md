#  usbliter8：苹果 A12/A13 BootROM 硬件漏洞的完整利用路径  
原创 黑鸟
                    黑鸟  黑鸟   2026-06-21 14:41  
  
2026 年 6 月 18 日，安全研究团队 Paradigm Shift 公开了名为 usbliter8 的 BootROM 漏洞研究成果，针对苹果 A12、S4/S5 以及 A13 系列 SoC 实现了 SecureROM（安全只读存储器）层面的完整代码执行。这项研究同时披露了 Synopsys DWC2 USB 控制器中的固有硬件缺陷，以及从漏洞触发到权限提升再到功能驻留的完整利用链路，再次证明即使是搭载现代安全机制的移动端芯片，底层硬件的细微漏洞依然足以击穿整条启动信任链。  
  
SecureROM 是芯片出厂时固化在 BootROM 中的第一级启动代码，也是设备信任链的根节点。它的代码无法通过系统更新修改，存在于其中的漏洞通常被称为永久漏洞，会伴随设备整个生命周期。  
  
本次漏洞的触发点位于 USB 控制器的硬件逻辑中，要理解漏洞原理，需要先了解两项基础机制，USB Setup 事务的结构与 DMA（直接内存访问）的工作方式。  
  
按照 USB 规范定义，所有控制传输都必须以 Setup 事务作为起始，这是主机向设备发送各类请求的标准方式。一次完整的 Setup 事务由主机先后发送两个包组成。第一个是令牌包，携带 SETUP 标识、设备地址和端点号。第二个是数据包，固定为 8 字节，承载具体的 USB 设备请求结构，这部分数据会被直接传递给设备端的 USB 驱动处理。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDr9ibxOOxDbomdbBQmIjQo2YXmIJrZAh61Sa0NtnPsR5iaqRreCCMvy4D8Rf9ibUw70ibwpnz3o1PspgUZCbuxGOmo8OhsKWon8w1I/640?wx_fmt=png&from=appmsg "")  
  
苹果各代 SoC 中搭载的 USB 控制器均为 Synopsys 出品的 DWC2。该控制器通过 DMA 机制将收到的数据写入系统主存，不需要 CPU 参与数据搬运。AP 端会预先分配一块内存区域，将该区域的物理地址写入控制器 MMIO（内存映射输入输出）空间的 DOEPDMA 寄存器，控制器收到 SETUP 和 OUT 类型的数据包后，就会自动通过 DMA 写入这块缓冲区。  
  
一个关键的细节是，控制器每完成一次数据写入，都会直接递增 DOEPDMA 寄存器中存储的地址值。这意味着该寄存器的值就是下一次 DMA 传输的真实目标地址，而非仅作为初始配置参数。  
  
DWC2 控制器的设计中，最多可以在内存中连续存储三个 Setup 包。当收到第四个 Setup 事务时，控制器会将 DMA 基地址重置回起始位置，逻辑上相当于一个容量为 3 的环形缓冲区。正常情况下每个 Setup 包 8 字节，三个包共 24 字节，因此重置操作就是将 DOEPDMA 寄存器的值固定减去 24。  
  
问题出在控制器对短数据包的处理逻辑上。控制器可以接受长度小于 8 字节的数据包，并且始终以 4 字节为单位存入缓冲区。这就导致每次写入后指针递增的幅度，和重置时固定减去的 24 字节无法对齐。反复触发这一逻辑后，DMA 指针会逐步向低地址方向偏移，形成每次 12 字节的缓冲区下溢原语。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDrDdYU1mxFz7ec3l63rr6XFpPRyPuvWLqib6O96lSszU39icrjayYDxt8dTutae8TQZ6uRcqDkFcPE7Fbz3xYHno45nY35KibVJhU/640?wx_fmt=png&from=appmsg "")  
  
研究团队判断这是 USB 控制器本身的硬件固有缺陷，但该缺陷能否被成功利用，还取决于设备固件的配置方式。不同代际的苹果芯片表现出明显差异。  
  
A11 及更早的芯片中，USB 驱动会在每次收到数据包后手动重置 DMA 地址到初始值，完全抵消了硬件缺陷的影响，不存在可利用性  
  
A12 与 A13 的 SecureROM 中，USB DART（设备地址重映射表）被配置为旁路模式，DMA 可以直接访问全部 SRAM 空间，攻击者能够自由覆盖内存数据  
  
A14 及后续芯片在 SecureROM 阶段就正确配置了 DART 权限，即使触发硬件缺陷也无法实现有效内存覆盖，漏洞不可利用  
  
拿到内存覆盖能力后，不同平台获得 PC（程序计数器）控制权的难度差异很大，核心分界点在于 A13 引入的 PAC（指针认证）机制。  
### A12 平台的直接利用  
###   
  
A12 的 SecureROM 没有 PAC 防护，利用过程相对直接。USB 控制器的 DMA 缓冲区被分配在堆内存上，位置紧邻 USB 任务的栈空间。攻击者只需要通过下溢原语逐步覆盖栈上保存的 LR（链接寄存器），当系统调度器切回 USB 任务时，就会直接跳转到攻击者指定的地址，获得完整 PC 控制权。  
### A13 平台的多步绕过  
###   
  
A13 引入了 PAC 机制，会对栈上存储的 LR 进行签名校验，直接覆盖栈 LR 的方法不再生效。同时堆内存还带有元数据校验和，上下文切换时也会验证 LR 签名。研究团队设计了多步组合技巧来绕过这些防护。  
  
第一步，构造有限写原语并规避堆校验。堆内存中，DMA 缓冲区的前方紧邻着 DART 相关的数据结构。攻击者先覆盖这部分 DART 对象数据，获得有限的内存写能力，这些写操作会在退出 DFU（设备固件升级）循环时触发一次。利用清理流程中的 dart_stop 函数，可以实现 16 字节范围的零值写入。再通过该写原语修改后续解引用的指针，让 dart_free 函数中的释放操作变成空操作，避免被破坏的堆块被回收时触发校验和异常。  
```
void dart_stop(unsigned int dart_id)
{
  // [1] we can fully overwrite the heap memory for this object
  dart = darts[dart_id];
  mmio_base = dart->info->mmio_base;
  v4 = 16 * dart->ctx->field_11 + 0x200;
  for ( int i = 0; i < 16; i += 4 ) {
    // [2] this gives us a 16-byte zero write primitive
    *(_DWORD *)(mmio_base + v4 + i) = 0;
  }
  dart_flush_maybe(mmio_base);
}
void dart_free(__int64 dart_id)
{
  // [...]
  dart_stop(dart_id);
  enter_critical_section();
  ref_count = info->ref_count - 1;
  info->ref_count = ref_count;
  if ( !ref_count )
    irq_mask(info->int_irq_num);
  exit_critical_section();
  // [3] we need to use the zero write primitive for these second deref to return 0 and make the free a no-op
  dart = darts[dart_id];
  free(dart);
  darts[dart_id] = 0;
}
```  
  
  
第二步，改写 panic 逻辑让设备保持可交互。同一条清理路径中，dart_flush_maybe 函数会向指定地址写入固定值 0xF。攻击者将写入目标对准全局 panic 计数器，让计数阈值提前被触发。这样后续触发 panic 时，CPU 会进入无限自旋循环而不是重启设备，保证 USB 控制器依然处于工作状态。  
```
void dart_flush_maybe(__int64 mmio_base)
{
  __dmb();
  // [4] these gives us a 0xF write primitive targeting the panic depth counter
  *(_DWORD *)(mmio_base + 52) = 0xF;
  *(_DWORD *)(mmio_base + 32) = 0;
  ticks = get_ticks();
  while ( 1 ) {
    v3 = get_ticks();
    if ( (*(_DWORD *)(mmio_base + 32) & 4) == 0 )
      break;
    if ( v3 - ticks >= 1000000 )
      panic();
  }
}
void __noreturn panic()
{
  // [5] after overwritting this global we would enter an infinite loop on panic
  if ( ++panic_cnt >= 3 )
    spin();
  // [...]
}
```  
  
第三步，精准控制写入时机保护任务上下文。任务结构体中保存着 LR 和 SP 等上下文寄存器，任务切换时会从这里恢复执行状态。如果 DMA 写入破坏了这些值，任务切回时就会直接崩溃。攻击者需要将写入时机控制在 USB 任务处于运行状态的窗口内，这样当任务主动让出 CPU 时，硬件会把正确的寄存器值写回结构体，覆盖掉被篡改的内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDoqMna0Thv5Wpicz8hk4TP1MTg6dNe4sjpibWNfVDhhiaBQxCVcIed5lZc5ezibgmFMNd1MqMvpuAxHLwxparfQibblHBPuCuUMTVWA/640?wx_fmt=png&from=appmsg "")  
  
第四步，篡改临界区深度触发可控 panic。任务结构体中还保存着临界区深度计数字段。攻击者将该字段篡改为异常值，当系统调用退出临界区函数时就会触发 panic。由于此时中断仍然处于开启状态，进入自旋循环后 USB 中断依然可以响应，DMA 写入能力不会丢失。  
```
void enter_critical_section()
{
  current_task = current_task();
  critical_section_depth = current_task->critical_section_depth;
  if ( critical_section_depth < 0 || critical_section_depth >= 10000 )
    panic();
  // [1] on each call increments task's critical_section_depth
  current_task->critical_section_depth = critical_section_depth + 1;
  if ( !critical_section_depth ) {
    irq_disable();
  }
}
void exit_critical_section()
{
  current_task = current_task();
  // [2] should be equal to the amount of entries to `enter_critical_section`
  // but we can overwrite it with a smaller count
  critical_section_depth = current_task->critical_section_depth;
  // [3] on first entry it will enable interrupts and on second entry it will panic
  if ( critical_section_depth <= 0 )
    panic();
  critical_section_depth = critical_section_depth - 1;
  current_task->critical_section_depth = v2;
  if ( !critical_section_depth )
    irq_enable();
}
```  
  
第五步，覆盖中断处理函数获得 PC 控制权。通过持续的 DMA 下溢写入，攻击者可以逐步覆盖到 BSS 段中的中断处理函数数组。将 USB 中断对应的处理函数指针替换为任意值后，下一次 USB 中断触发时，CPU 就会跳转到指定地址执行，最终实现完全的 PC 控制。  
```
// [1] an array of `irq_handler_ctx` structs lives in the BSS section which we can reach with our bug
00000000 struct irq_handler_ctx // sizeof=0x18
00000000 {
00000000     void (*handler)(void *arg);
00000008     __int64 *arg;
00000010     _BYTE unk;
00000011     _BYTE shall_mask;
00000012     // padding byte
00000013     // padding byte
00000014     // padding byte
00000015     // padding byte
00000016     // padding byte
00000017     // padding byte
00000018 };
void handle_irq()
{
  irq_num = MEMORY[0x23B102004];
  if ( MEMORY[0x23B102004] ) {
    while ( irq_num ) {
      if ( (irq_num & 0x70000) != 0x10000 )
        panic();
      irq_num__ = irq_num & 0x1FF;
      // [2] after the Setup we can freely overwrite handler for USB interrupt with a controlled value
      handler = irq_list[irq_num__].handler;
      if ( handler )
        // [3] fully controlled handler gets called with fully controlled arg
        handler(irq_list[irq_num__].arg);
      _clr_mask_irq(irq_num__);
      irq_num = MEMORY[0x23B102004];
    }
  } else {
    ++stale;
  }
}
```  
  
## 后利用：从 EL0 到系统级控制  
  
拿到 PC 控制权只是第一步，SecureROM 大部分代码运行在 EL0 特权级，无法访问受保护的系统寄存器和内存区域。攻击者需要进一步提升权限并植入持久化的自定义逻辑。  
### A12 与 S4/S5 的 ROP 方案  
  
A12 和 S4/S5 平台没有 PAC 防护，拿到 PC 控制权后可以直接构造 ROP（面向返回编程）链。这条 ROP 链很短，核心完成三项操作。首先通过 32 位写指令修改 USB MMIO 寄存器，重定向 DMA 的目标地址。其次等待约 400 毫秒，保证 DMA 传输完成。最后跳转到 ROM 中指定的 SVC 指令位置，切换到 EL1 特权级。  
  
选择 SVC 指令位置的原因在于，SecureROM 仅在极少数位置会执行 SVC 0 指令，执行后系统会切换到 EL1 模式再返回。攻击者选择了负责跳转至下一级 iBoot 的函数中的 SVC 指令作为落点。  
  
正常情况下启动蹦床区域属于仅可执行内存，EL0 和 EL1 都无法写入修改。但 DMA 传输直接由硬件执行，绕开了 CPU 的权限检查，因此可以向这片区域写入自定义 shellcode。400 毫秒的延迟就是为了保证 DMA 完整写入 shellcode。  
  
固件本身包含状态校验逻辑，防止跳转到函数中间执行。但编译器生成的校验代码中，有一项检查使用 X24 寄存器作为基地址。X24 属于被调用者保存寄存器，它的值存储在栈上，而栈已经被攻击者完全控制，因此这项校验可以被轻松绕过。  
  
获得 EL1 权限后，攻击者需要完成一系列清理工作。将原始启动蹦床代码还原到原位，恢复所有被破坏的堆分配结构，在启动蹦床的未使用空间中注入自定义 USB 请求处理函数，修改 USB 序列号字符串加入 PWND 标识，最后修复 USB 任务的栈帧并返回正常执行流。最终设备会停留在 DFU 模式，但已经加载了攻击者的自定义处理逻辑。  
  
自定义处理程序会将标准 DFU 请求转发给原生处理逻辑，同时新增两项能力。一项是临时降级 SoC 的生产模式，效果持续到设备重启。另一项是直接启动未经签名校验的原始 iBoot 镜像。  
  
这里有一个实现细节，不能直接在 USB 处理函数内部调用 iBoot 跳转函数。因为跳转前会关停 USB 硬件，导致当前运行的 USB 任务直接终止。正确的做法是修改主任务栈上的返回地址，关闭 DFU 会话后由主任务接管执行，完成最终的跳转流程。  
### A13 的 ROM 重映射方案  
  
A13 平台受 PAC 限制无法使用常规 ROP，但启动蹦床区域位于 BSS 段与堆之间，可以通过 DMA 直接覆盖。跳转函数同样带有状态检查，依赖栈上保存的 X22 寄存器，但 A13 上无法直接控制该寄存器。  
  
研究团队找到了一个可用的代码 gadget。跳转到该位置后，X22 寄存器的值会直接来自攻击者可控的内存区域，后续代码会从 X22 指向的内存中取出函数指针并执行认证分支。虽然固件大量使用带认证的分支指令，但实际仅启用了 IB 密钥，攻击者可以顺利完成跳转，获得最高权限执行能力。  
  
A13 平台的内存破坏范围更大，常规清理手段难以实现。研究团队采用了 SecureROM 重启的方案。将完整的 ROM 代码复制到 SRAM 的末端区域，对副本打上自定义补丁，再配置 MMU（内存管理单元）将这段 SRAM 的物理地址映射到原 ROM 的虚拟地址空间，让代码可以正常寻址。  
  
ROM 自身初始化过程中会创建新的页表并切换，这会打破自定义的映射关系。攻击者通过挂钩 ROM 的页表生成逻辑，保证新页表中依然保留自定义的地址映射。  
  
最终打上的补丁共有四处。第一处缩小加载区域的大小，避免 ROM 初始化时清零 SRAM 尾部的自定义代码。第二处强制系统进入 DFU 模式，不会直接启动系统。第三处挂钩 USB 序列号生成逻辑，加入 PWND 标识。第四处注入自定义 USB 请求处理函数。  
  
由于该漏洞需要操控非常底层的 USB 数据包行为，普通电脑的标准 USB 栈无法满足时序和包结构的控制要求，因此需要借助专用微控制器硬件实现。  
  
官方测试验证过的开发板均基于 RP2350 芯片，包括微雪 RP2350 USB-A、微雪 RP2350 Zero、Pimoroni TINY2350 以及树莓派 Pico 2。使用时搭配 Lightning 转 USB-A 线缆，部分型号需要移除板上的 R13 电阻。其他 RP2350 开发板也可使用，需要自行焊接 Lightning 线缆对应的引脚。默认使用 GPIO12 和 GPIO13 分别连接 D+ 与 D- 信号，不建议使用 USB-C 线缆，引脚定义差异较大，且 Lightning 端的线缆不宜过长。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDqiakjDvZEKpv7I7P4s0XryvoLx5phxibWHyiaOAicvQkJ1SGR2VRfo89AB5o0JtWQM9BWTbF2h2OmXia6unHlhl9ialLPpJWKMbcCTQ/640?wx_fmt=png&from=appmsg "")  
  
RP2040 芯片理论上也可使用，但稳定性较差，且完全无法支持 A13 平台。  
  
完整的利用流程如下。首先让目标设备进入 DFU 模式，注意不能通过破坏 LLB 的方式进入 DFU，否则无法触发漏洞。将设备从电脑上拔出，转接到 RP2350 开发板，0.7 到 1.2 秒内即可完成利用过程。用户可以通过板载 LED 的状态判断进度，也可以连接虚拟串口查看详细日志。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDoyTDnwoYxFc5YyqzWMx9Cjp1ib4WwthxUwChXKqy3tb3twN6tichiaolYz5XeGSoOpWwwibIMVyxhYgTsLRuQkt5CRNYeEqdKr70c/640?wx_fmt=png&from=appmsg "")  
  
利用成功后，将设备重新接回电脑，在 USB 设备的序列号字段末尾可以看到 PWND:[usbliter8] 的标识。项目仓库中提供了名为 usbliter8ctl 的 Python 控制工具，基于 pyusb 库开发，可以执行生产模式降级和原始 iBoot 启动操作。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDrsfFWLm0zyfFp6fhGKeiafcd2KTtkO8icniaImx8BNx33XPLq7Miaw9w1yUh3V48yNKIsZX8cyiaF55fT1OQUWducGc0ia3cIQ2hjtg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibO9kiauylaDpRGhDrUIEk5qvFrgPicIrC2M8CribibZ5Dgskic8cgQAu8BwE9C5MFpX0VSFToGVUhZPAz1s3JLIM03H4yef5K8vIrkjoorGib0S8E/640?wx_fmt=png&from=appmsg "")  
  
usbliter8 完整展示了从单一硬件缺陷出发，逐步绕过多重软件防护，最终实现 SecureROM 层面代码执行的完整路径。它证明即使是搭载指针认证等现代安全机制的新一代 SecureROM，底层硬件的细微设计缺陷依然可以被串联成有效的攻击链，打破启动信任链。  
  
BootROM 处于设备安全体系的最底层，这里的漏洞会从根本上影响设备的完整性。不过苹果的 SEP（安全隔区处理器）仍然是独立的安全边界，该漏洞本身不直接攻破 SEP，但为后续针对 SEP 的攻击提供了更广阔的入口。  
  
由于漏洞存在于固化的硬件与 ROM 代码中，受影响的 A12 和 A13 设备将永久携带这一缺陷，系统更新无法修复。A14 及更新的芯片已经通过正确配置 DART 规避了可利用性，不受该漏洞影响。研究团队在公开成果前已经向苹果产品安全团队上报，并完成了协调披露流程。  
  
Introducing usbliter8  
  
An A12/A13 SecureROM exploit  
  
A novel iPhone BootROM vulnerability discovered and exploited by our team. It covers the underlying bug, the associated exploitation techniques, and the post-exploitation steps required to achieve application processor's boot-chain compromise.   
  
The exploit leverages both a hardware bug in the USB controller and a specific configuration flaw present in the device firmware.  
  
https://ps.tc/pages/blog-usbliter8.html  
  
poc:  
  
https://github.com/prdgmshift/usbliter8  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ibO9kiauylaDqicDvERLTuy6Yo2PUS5sCSLCWBlXcichCYke51phlZqJvemVicckicq5cDX67WMuDvDmWX3HQaiaFCeKnMRuEVv2jsQCv90kc27HwE/640?wx_fmt=jpeg&from=appmsg "")  
  
