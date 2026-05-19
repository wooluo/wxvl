#  理解 Windows 内核漏洞利用中的整数溢出  
Jay Pandya
                    Jay Pandya  securitainment   2026-05-19 03:11  
  
<table><thead><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://whiteknightlabs.com/2025/05/27/understanding-integer-overflow-in-windows-kernel-exploitation/</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Jay Pandya</span></section></td></tr></tbody></table>  
在这篇博客文章中，我们将探讨 Windows 内核驱动中的整数溢出 ( integer overflow ) 问题，并分析算术运算如何引发安全漏洞。我们将剖析真实案例、构建一个自定义的易受攻击驱动，并演示这些缺陷如何影响内存分配与系统稳定性。  
## 什么是内核中的整数溢出？  
  
当算术运算的结果超出某种数据类型所能容纳的最大值时，就会发生整数溢出，导致数值发生回绕 ( wrap around )。在 Windows 内核中，整数溢出可能导致内存损坏、缓冲区溢出，或在内核分配过程中产生错误的大小计算，从而引发 **堆损坏、越界写入**  
( out-of-bounds writes ) 以及 **bug checks**  
( 又称 "blue screen of death" 或 BSOD )。  
  
这类漏洞可能以多种方式出现：  
- **Addition Overflows**  
( 加法溢出 ) 发生在两个较大的数值相加超出可表示范围时，进而导致 **错误的内存分配或数值回绕**  
，最终引发缓冲区溢出。  
  
- **Multiplication Overflows**  
( 乘法溢出 ) 可能造成 **大小计算错误的内存分配**  
，即由于整数回绕，过大的尺寸值反而得到一个较小的分配结果，从而导致 **堆损坏与内存泄漏**  
。  
  
在深入研究 **Windows kernel**  
中的整数溢出漏洞之前，让我们先理解 **data types**  
( 数据类型 ) 及其在内存中的工作方式。  
## 理解数据类型  
  
在进行 **C 和 C++ 的底层编程**  
时，尤其是在 Windows 内核态与用户态应用程序的开发中，选择正确的数据类型至关重要。一旦选择不当，就可能导致 **整数溢出、内存损坏、权限提升**  
以及 **严重的安全漏洞**  
。  
  
为了方便查阅，我整理了一份 **速查表**  
，在你分析内核驱动或用户态应用程序中潜在的 bug 时可以随时参考。这张表能让你 **快速概览不同数据类型如何存储数值，以及在哪些情形下容易出问题**  
。  
  
在排查内核态和用户态应用程序中的整数溢出、回绕 ( wraparound ) 及其他危险 bug 时，可将其作为你的 **首要参考资料**  
。  
<table><thead><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">数据类型</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">大小 (x64/x86)</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">有符号范围</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">无符号范围</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">使用场景</span></strong></th></tr></thead><tbody><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">char</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">1 byte</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-128 to 127</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 255</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">unsigned char</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">1 byte</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 255</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">signed char</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">1 byte</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-128 to 127</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">short</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">2 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-32,768 to 32,767</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 65,535</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">unsigned short</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">2 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 65,535</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">signed short</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">2 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-32,768 to 32,767</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">int</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-2,147,483,648 to 2,147,483,647</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">unsigned int</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">signed int</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-2,147,483,648 to 2,147,483,647</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">long (Windows)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes (x86/x64)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-2,147,483,648 to 2,147,483,647</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">unsigned long</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">signed long</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-2,147,483,648 to 2,147,483,647</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">long long</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 18,446,744,073,709,551,615</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">unsigned long long</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 18,446,744,073,709,551,615</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">signed long long</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">SIZE_T</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes (x64) / 4 bytes (x86)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 18,446,744,073,709,551,615 (x64) / 4,294,967,295 (x86)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">SSIZE_T</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes (x64) / 4 bytes (x86)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (x64) / -2,147,483,648 to 2,147,483,647 (x86)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">ULONG</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">仅内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">ULONGLONG</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 18,446,744,073,709,551,615</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">仅内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">DWORD</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">同 unsigned int</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">NTSTATUS</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号变长</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">N/A</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">仅内核态</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">HANDLE</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes (pointer)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">系统指针</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">系统指针</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">用户态和内核态</span></section></td></tr></tbody></table>  
上述数据表对用户态和内核态的数据类型作了全面的参考梳理，涵盖了它们的大小、取值范围以及可能出现的溢出场景。相关信息基于微软的官方文档 Microsoft documentation 以及 kernel data types，可作为识别内核驱动中整数溢出相关漏洞的重要参考资料。  
### 内核中可能导致整数溢出的常见数据类型  
<table><thead><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">数据类型</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">大小</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">有符号/无符号</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">范围</span></strong></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><strong style="margin-top: 0px;margin-bottom: 0px;"><span leaf="">溢出类型</span></strong></th></tr></thead><tbody><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">ULONG</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">无符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 4,294,967,295 (0xFFFFFFFF)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">无符号回绕</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">LONG</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-2,147,483,648 to 2,147,483,647</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号溢出</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">ULONG64</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">无符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0 to 18,446,744,073,709,551,615</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">大值溢出</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">LONG64</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号溢出</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">SIZE\_T</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes (x86) / 8 bytes (x64)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">无符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">平台相关</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">无符号回绕</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">SSIZE\_T</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes (x86) / 8 bytes (x64)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">平台相关</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号溢出</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">LONG\_PTR</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">4 bytes (x86) / 8 bytes (x64)</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">平台相关</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">指针算术溢出</span></section></td></tr><tr style="border-top: 1px solid rgb(204, 204, 204);background-color: rgb(248, 248, 248);margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">INT64</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">8 bytes</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">有符号</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">同 LONG64</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">乘法溢出</span></section></td></tr></tbody></table>- **无符号类型 ( ULONG、ULONG64、SIZE_T )**  
：这些类型只能保存非负值。发生溢出时，由于模运算行为，它们会回绕至 0，可能引发缓冲区溢出或不正确的内存分配。  
  
- **有符号类型 ( LONG、LONG64、SSIZE_T、LONG_PTR、INT64 )**  
：这些类型同时支持正值和负值。发生溢出时，符号可能会翻转，也就是说一个较大的正值可能变成负值。这会导致非预期行为，例如负数大小的内存分配或错误的指针算术运算，进而引发崩溃或安全漏洞。  
  
### 自定义 Windows 内核驱动中的网络数据包溢出 ( ULONG 加法溢出 )  
  
我将演示一个模拟网络数据包处理的自定义 Windows 内核驱动。为了理解该漏洞，我们先来讨论一下 **ULONG 及其取值范围**  
。在 Windows 中，ULONG 是一个 **32 位无符号整数**  
，这意味着它能容纳的值范围为 **0x00000000 ( 十进制的 0 ) 到 0xFFFFFFFF ( 十进制的 4,294,967,295 )**  
。由于它无法存储负值，任何超过 **0xFFFFFFFF**  
的算术运算都会引发 **整数溢出**  
，使该值回绕至一个小得多的数字，而不是继续增大。这一行为正是我这个自定义驱动中漏洞的根本原因。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSheLC4aMOamRhFnBicbHBe2H4ib8FyYNRATpfgEFHViaib5pVgzrj7RxHNt5wibUcpC0piclI9ELXKanVRNyjUQEJC6z5xTYpNthdL70/640?wx_fmt=png&from=appmsg "")  
  
ULONG 整数加法溢出  
  
该自定义驱动中的易受攻击函数会接收 **用户可控的数据包大小**  
，并在其基础上加 0x1000，以确定为存储数据包所需分配的内存大小。然而，如果攻击者提供了一个像 0xFFFFFFFF 这样的较大值，加上 0x1000 后就会引发 **整数回绕**  
，这意味着内核最终分配的并不是预期的大块缓冲区，而是一个小得多的缓冲区。例如，0xFFFFFFFF + 0x1000 会回绕至 0x00000FFF，从而仅分配 **4,095 字节，而不是预期的大缓冲区**  
。  
#### 触发漏洞：数据包分配中的整数回绕  
  
我编写了一个简单的 PoC ( 概念验证 )，用以触发该驱动中的易受攻击代码行。该函数接收用户可控的数据包大小，并加上 **0x1000**  
进行内存分配。然而，提供一个像 **0xFFFFFFFF**  
这样的较大值会导致整数回绕，从而引发一个小得多的分配 ( **0x00000FFF**  
，而不是预期的大缓冲区 )，进而导致崩溃。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSiaPI2ry53CNUML4LeFWNWNxSA6iccJxRWibWdwWjib6a8SAvUKGe6xkzWPGKo2oobXa1NW4B3sxa2uLsX3JcqvSVuVd1Gaz9AcxNQ/640?wx_fmt=png&from=appmsg "")  
  
通过用户输入触发漏洞  
  
崩溃发生在：movntps xmmword ptr [rcx-10h], xmm0  
，此时正试图越过已分配缓冲区的边界进行写入，地址为 rcx = ffff860d714f1010  
，该地址已超出 RAX 处 0x1000 字节分配的范围。这证实了由于分配大小计算中的整数溢出而引发的越界内存写入。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSje7Gqq99PHbiaoiasOM524I0GG7I9eRBC08Bz2UZibicJvfNiaS0ocwkCSjyhSCibjQuaAgC3QMMic4B0Utia9yd4TvDHEQJUR9uLibibj8/640?wx_fmt=png&from=appmsg "")  
  
WinDbg 中的崩溃分析  
### 自定义 Windows 内核驱动中的数据包大小溢出 ( 有符号 LONG 整数溢出 )  
  
我将演示一个自定义 Windows 内核驱动，用于模拟网络数据包的处理过程。为了理解该漏洞，我们先讨论 LONG 类型及其取值范围。在存在漏洞的内核驱动中，输入大小存储在一个有符号 LONG ( 32 位整数 ) 中，其范围为 -2,147,483,648 ( 0x80000000 ) 到 2,147,483,647 ( 0x7FFFFFFF )。如果攻击者提供 **0x7FFFFFFFF**  
( 即一个 **9 位十六进制值**  
)，它将超出 LONG 的范围，导致被截断为 **0xFFFFFFFF**  
。  
  
在补码表示中，有符号整数通过翻转位来表示负值。例如，0xFFFFFFFF  
被解释为 -1  
，而 0x80000000  
是 LONG  
类型的最小值 ( -2,147,483,648  
)。该特性是理解大的无符号输入如何变为负数、进而触发溢出漏洞的关键。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgRPTKFqemHluwVIBzvnR5Lt1WgUzIkCSNKibJHDzBOEeBT3B5IgVwjM6DnCQxmoFZ7gHYQHW7sDKs8co0LicAzZ9vfu1xvUvkL8/640?wx_fmt=png&from=appmsg "")  
  
LONG 整数加法溢出  
  
由于 **0xFFFFFFFF**  
在有符号表示中被解释为 -1，相应的计算只会分配一个很小的缓冲区，但随后的 memmove(PackedData->Data, userBuffer, headerSize)  
会尝试复制 **0xFFFFFFFF**  
字节，从而导致 **越界内存损坏**  
。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/h4gtbB74nSjEhibkHbM11fB4CqRZxrJVBWia12uacaZsDaSYCN3lHAtOs1WgxZRVYWe6q7EYaR712lnmuGw3MZBluwMiaiaMm2A7Q54jxW0SBtY/640?wx_fmt=jpeg&from=appmsg "")  
  
通过用户输入触发漏洞  
  
这会因非法内存访问而导致 **内核崩溃 ( BSOD )**  
，展示了有符号整数溢出如何破坏内存安全并引发系统不稳定。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSjmcQUOhUaOEgJ6Efv9ostY9mBzXF3GXjRgiaW0PGYib5JrhOLltCibYLxWqJaOfBibIckFUD45iboxtF2CSibUlwlJVjxA1XDVZXCzE/640?wx_fmt=png&from=appmsg "")  
  
蓝屏死机  
### EDR 日志处理 ( SIZE_T 无符号整数溢出 )  
  
在诸如 **端点检测与响应 ( EDR )**  
等现代安全方案中，日志与事件通常存储于 **动态分配的缓冲区**  
之中。若 EDR 驱动在使用 **SIZE_T**  
( 在 x86 平台上为 4 字节，在 x64 平台上为 8 字节 ) 计算缓冲区大小时存在错误，便可能发生 **整数溢出**  
，进而引发 **缓冲区溢出**  
或 **内存损坏**  
。  
  
为演示此问题，下面是一个 **自定义的伪内核驱动**  
，用以模拟 **真实的 EDR 场景**  
：日志通过 SIZE_T 动态分配，因尺寸计算不当而触发整数溢出漏洞。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgzTRu4lR1jCxu3BuBFp4DT8LfFP4AJjUK3IgJh5bm4dPcibITVXBm97PIAKQSrhsFyNmlqjyG0Q6Ls4YpaNlz8uLoS6ByGARlM/640?wx_fmt=png&from=appmsg "")  
  
SIZE_T 整数溢出  
  
若攻击者在 64 位系统上传入诸如 **0xFFFFFFFFFFFFFFFF**  
之类的数值，则加法运算 logSize + 0x40  
因模运算特性回绕为一个 **极小的数值**  
。这将导致 **仅分配一块微小的缓冲区**  
，然而 **memmove**  
仍试图复制 **0xFFFFFFFFFFFFFFFF**  
字节，从而引发 **堆损坏或内核崩溃**  
——这在 EDR 日志记录机制中构成严重的安全风险。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShj2SwcxKJdU2VnPXKV6Mlv3kxaq3VdhhRjaM3Vy6ctl2aZf4N9cZ9dF6K63OaUH9U4iccIczda4RP5lYhjhGwMJLUN6nDBnzoA/640?wx_fmt=png&from=appmsg "")  
  
通过用户输入触发漏洞  
  
由于发生了非法内存访问，最终导致 **内核崩溃 ( BSOD )**  
，由此可见无符号整数溢出如何破坏内存安全并引发系统不稳定。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSiaIlCG2ylPWxJ9jWseCicrKhPdEp2d7PlERicDhtTVohFULy73D95GJyQ8SVKM7ibx3AEqic2niaXc28DfuyOPZsUqLtL9sEAlK2OlM/640?wx_fmt=png&from=appmsg "")  
  
蓝屏死机  
### 从简单整数溢出到现实世界的堆损坏  
  
到目前为止，我们已经探讨了一些 **基础的整数溢出场景**  
，但让我们更进一步，看看 **看似微小的计算错误**  
如何能在 Windows 内核中导致 **严重的堆损坏**  
。  
  
在给定的代码片段中，问题源于 new_size  
计算过程中发生的 **整数溢出**  
。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSj667rksrT75V0BzTjztNlib8e3lsK55rWljl6Xczkpx0STtRBXfjA54P9wskHLyl5EPicibzApvLiccmPX4JTDEERDicNztNtiaY1eI/640?wx_fmt=png&from=appmsg "")  
  
ULONG 整数乘法溢出  
  
然而，old_items_count  
和 size_of_item  
均为用户可控的值。如果攻击者提供了较大的数值，该乘法运算结果可能超过 **ULONG ( 32 位无符号整数，最大值为 4,294,967,295 )**  
的最大值。当此情况发生时，由于整数溢出，该数值会回绕至一个远小于预期的数字。  
  
由于在内存分配步骤中发生了整数溢出，所分配的缓冲区将显著小于预期。然而，驱动程序仍会继续调用 RtlCopyMemory  
，并使用原始 ( 已溢出的 ) 大小来复制数据。由于 RtlCopyMemory  
不执行边界检查，这将导致 **越界写入**  
，即多余的数据会溢出到相邻的堆内存中。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgpny8QAKypHyOOF0lANNsgvhm3ygoaO8qzgaCv0eMYA5icoyX7KwZicB1v4985ZMwWtXrVQDDdD4iaHH2eRib7qZA8XeQkicw4REXM/640?wx_fmt=png&from=appmsg "")  
  
易受攻击的内存分配  
  
这是一个绝佳的例证，说明整数溢出并非仅停留在理论层面。在适当条件下，它们可能演变为危及系统安全的现实漏洞利用。即便是内存分配中的微小计算误差，也可能引发堆损坏。一旦被覆写，关键的内核结构便可被操纵以实现权限提升。  
##### BSOD 演示：触发整数溢出  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSh1UYJdgWsTzibAopDmdE3cG8wfzz0t3yicawglKf70dzvAmvp2ibianrfvk0IfwESdHGrgLf7fiakRTvoo93lYzFAnqSV3SG1p1VRY/640?wx_fmt=png&from=appmsg "")  
  
武器化漏洞利用  
  
上述 PoC 向易受攻击的驱动程序发送了一个精心构造的 ITEMS_INFO  
结构，将 last_item_index  
设置为 **0xFFFFFFFF**  
，并将 size_of_item  
设置为一个较大的值 ( **0xFFFFFFF0**  
)。这会在计算内存分配大小时引发整数溢出，进而导致内核空间中的堆损坏。最终，这将导致蓝屏死机 ( BSOD )。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgymw10WiczTNHw7LP8qswvLE0drAUTJtq5jLDtn5ib9sDbDlwSm62WjagNsbiaNOvNvkT6LibxoJPia6AAd0QhvpxsicacC8nEsZtHg/640?wx_fmt=png&from=appmsg "")  
  
蓝屏死机  
## 探索真实世界中的内核漏洞  
  
在之前的博文中，我们考察了 IOCTL 处理程序中基本的整数溢出场景。现在，让我们深入研究一个真实世界的案例：**CVE-2025-21333**  
，这是 **vkrnlintvsp.sys**  
( Windows 内核驱动 ) 中的一个整数溢出漏洞。  
### 函数概述  
  
函数 VkiRootAdjustSecurityDescriptorForVmwp  
负责调整虚拟机工作进程 ( VMWP ) 的安全描述符。它检索并修改对象安全描述符的自主访问控制列表 ( DACL )，然后使用 **ExAllocatePool2**  
为修改后的 ACL 分配内存。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgiavWG14IJibnERDkYy0a3yWtiaokQoVEM9e0n7Yicu4M4LzIYjAnX8RMv9ytbqN38T74O6NNeF9G3IFh7TDr55w0fO57IDeqRaCc/640?wx_fmt=png&from=appmsg "")  
  
对易受攻击函数的反编译  
### 潜在漏洞：池分配中的整数溢出  
  
在某些内核函数中，内存分配可能受到用户控制值的影响，从而导致潜在的安全漏洞。其中一种情况发生在 ExAllocatePool2()  
中，其分配大小由 v8  
的值决定：  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShibyIyic5ymdJyibVASN4SduatxVicic43kRg778phC79PjNwQuicUCW3nl61Iss6GduEETyD06zicXHfSBiaxpU5Opo7n8zae5FvS4V8/640?wx_fmt=png&from=appmsg "")  
  
易受攻击函数中的整数溢出  
  
以下是该问题之所以存在隐患的原因：  
- v6  
和 v7  
是 RtlLengthSid()  
的返回值，代表静态字符串 SID 的长度。  
  
- Dacl->AclSize  
来源于对象的安全描述符，意味着它可能被攻击者操纵。  
  
攻击者可以构造一个恶意的安全描述符，其中 Dacl  
字段指向用户可控的内存，而 AclSize  
包含一个任意大的值。当内核使用 Dacl->AclSize + v6 + v7 + 16  
作为分配大小调用 ExAllocatePool2()  
时，它会对受攻击者影响的值执行未经检查的算术运算。这可能导致整数溢出，从而分配出比预期更小的缓冲区——为基于池的缓冲区溢出和潜在的权限提升打开了大门。  
### 通过 memmove() 实现的基于堆的缓冲区溢出  
  
当 memmove()  
将 Dacl->AclSize  
字节复制到 Pool2  
中时，攻击者可控的大小可能导致越界写入，从而造成堆损坏和潜在的权限提升。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSg2Ahx7wlk7Q3OuFLQbEd7sgxLWOALuOVRiaNESkesaXdV5UqiatBRZuN25OrhVGMFzFgS6o7KicCbnU5fSMe6FYXMJekviawGWyOM/640?wx_fmt=png&from=appmsg "")  
  
易受攻击的内存分配  
  
如果 Dacl->AclSize  
被精心构造以超出已分配的缓冲区，memmove()  
就可以覆盖相邻的内存结构，从而触发堆损坏。在此我不会过于深入展开，但我在下面附上了一个参考链接，其中包含详细的根本原因分析和堆栈追踪——绝对值得一看！  
## 进阶提示：超越纯粹的算术运算  
  
在审计内核代码以发现整数溢出问题时，关注点不应仅限于算术运算本身，而应聚焦于其后续影响。如果溢出值会影响内存分配 ( **ExAllocatePoolWithTag()**  
)、来源于不可信渠道 ( IOCTLs、用户态应用程序 )，或者缺乏适当的边界检查，便可能引发 **堆破坏、缓冲区溢出**  
，乃至 **代码执行**  
。  
  
为提高发现漏洞的概率，应着重审查 **网络数据包处理程序**  
、检查 **EDR 日志中的异常内存分配**  
，并分析 **驱动程序中的大规模数据解析逻辑**  
。许多权限提升类漏洞都起源于一个 **微小的整数溢出**  
——因此务必沿着从 **数学运算到内存操作**  
的链路一路追踪。  
## 结论  
  
本文对内核代码中的整数溢出进行了深入剖析，揭示了当算术缺陷与内存分配以及用户可控输入相结合时，如何演变为严重的安全风险。通过构建一个自定义的易受攻击的驱动程序，我们展示了此类漏洞在真实场景中的具体表现形式，并通过分析一个生产环境中的实际漏洞来强化我们的理解。这些动手实践所获得的洞见，有助于弥合理论与漏洞利用之间的鸿沟，使我们具备在内核驱动程序中识别并缓解同类缺陷的能力。  
## 参考资料  
1. https://infosecwriteups.com/cve-2025-21333-windows-heap-based-buffer-overflow-analysis-d1b597ae4bae  
  
1. https://winbindex.m417z.com/?file=vkrnlintvsp.sys  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
