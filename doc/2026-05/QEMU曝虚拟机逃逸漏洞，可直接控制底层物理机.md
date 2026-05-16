#  QEMU曝虚拟机逃逸漏洞，可直接控制底层物理机  
原创 网空闲话
                    网空闲话  网空闲话plus   2026-05-16 07:37  
  
QEMU CXL Type-3设备仿真模块被曝出名为“QEMUtiny”的漏洞链。具备 Guest系统Root权限的攻击者，可利用该漏洞实现虚拟机逃逸，获取宿主机进程甚至宿主机Root权限，风险较高（暂无 CVE 编号）。  
  
漏洞原理  
  
该漏洞链源于 CXL mailbox 逻辑（hw/cxl/cxl-mailbox-utils.c）中的两个致命缺陷：  
  
1. 越界读（GET_LOG）：指针运算错误，导致泄露宿主机内存地址。  
  
2. 越界写（SET_FEATURE）：边界检查缺失，允许破坏设备对象字段，进而劫持程序执行流。  
  
影响范围  
  
仅影响启用了 CXL 支持（启动参数含 cxl=on、cxl-type3等）且向 Guest 暴露了该设备的 QEMU 实例。普通 QEMU 虚拟机及物理 CXL 硬件不受影响。  
  
安全建议  
  
1. 排查参数：检查 QEMU 启动配置，移除不必要的 CXL 相关参数。  
  
2. 切断暴露：严禁向不可信的 Guest 虚拟机暴露 CXL Type-3 设备。  
  
3. 隔离降险：临时禁用该仿真功能，或仅在严格隔离的测试环境中使用。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d2czib5nWUicH8dLktbu0yzMoD4a4icaoT9Tkls8VbUVOdSmZ1RsseIm8fuW8N2iaVJDTfBeggIRHgudtDjIBytK3Wzzr8SvmzWxiaQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d3mMXhupqY5guhnXic70leqwia5PcdUHcIEYsoz9VTuNQuDrbsLbFQ4otRfsn1VAAxlV57c0UI0x6BJPO4cDdUhic2RbYcG4Zn7SU/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d3qicXnouj9tdD0JrG4icicyb5NLPDtgwcPoemroInJGhWjKVcsVicDHCkb5aia6jJN4iaPFOrnBxSBvJufNJW3NZFtp3DZn75UpAictU/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d0afCDm0pjOSibgm4FUd7PLzsOQVmuhaPpibVvlK6Ep9ibOrKqJO8sJJGbGHOQ5Zeia3StIpt07Ttnr5uLq3bFJDY0Brza5pa0N9cc/640?wx_fmt=jpeg "")  
  
初步分析表明，该漏洞可使已获取Guest 系统Root权限的攻击者，利用CXL仿真模块的越界读泄露宿主机内存地址，再通过越界写劫持程序执行流，最终实现虚拟机逃逸并直接控制底层物理机（获取宿主机进程甚至Root权限）。攻击成功后，可读取宿主机敏感数据、植入后门或横向渗透。危害程度高，但仅影响启用了 CXL Type-3设备暴露的特定QEMU实例。  
  
  
—— LoopDNS 、 GitHub  
  
