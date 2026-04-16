#  榨干Intego最后一滴：Windows权限提升漏洞的简单艺术  
 幻泉之洲   2026-04-16 09:04  
  
>   
  
  
一个阳光明媚的周日下午，同事Mathieu Farrell跟我分享了他在macOS版Intego上发现的三个漏洞。  
  
说实话，我之前压根没听说过Intego这个安全软件。浏览他们官网找资料时，我才发现他们还做了Windows版本。反正闲着也是闲着，为什么不试试看呢？  
  
几个小时后，我手里已经有了一个本地权限提升漏洞。  
  
这个下午过得不算太坏。  
## 漏洞本身很简单  
  
问题出在Intego的“优化模块”上。这个功能让普通用户扫描重复文件，然后一键清理。听起来挺方便。  
  
它的操作流程是：用户运行扫描，选中要删除的重复文件，点击“清理”。然后IavService.exe进程会以SYSTEM最高权限执行删除操作。  
  
书面流程看着没问题。实际上，这就是我们通往权限提升的专属通道。  
  
漏洞核心有两点：  
- 优化模块在删除文件时，从不检查目标到底是普通文件还是目录联接点  
- 它运行在SYSTEM权限下  
把这两点跟安全圈里已经玩熟了的Config.msi删除技巧结合，你就能拿到一张单程车票，直达SYSTEM权限。  
  
本技术分析涉及Intego 3.0.0.1版本。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcV3QdhQKJE72rWpoNT5esleYltB5Z515Xp9H4Hk6kdbIRSh36ribzCU0r6O8TneLkteY4SKCsLzlQdsaklnibdTVn1DUJ4H6MQY/640?wx_fmt=png&from=appmsg "")  
## 关于Config.msi的小把戏  
  
在深入攻击细节前，先快速过一遍ZDI早前披露的Config.msi删除漏洞利用方法。Windows Installer服务在安装和回滚过程中，会把回滚脚本和文件存到C:\Config.msi目录里，并且这些文件会以SYSTEM权限处理。  
  
攻击流程像这样：  
1. 想办法用某个SYSTEM权限的操作，通过重解析点删除C:\Config.msi文件夹  
1. 攻击者重建C:\Config.msi，并放入自己写的.rbs和.rbf回滚脚本和文件  
1. 触发一个MSI安装并强制其失败，引发回滚操作  
1. Windows Installer以SYSTEM权限加载并执行我们的回滚文件，默认会在C:\Program Files\Common Files\microsoft shared\ink\路径下释放一个HID.DLL  
1. 按CTRL+ALT+DEL启动屏幕键盘osk.exe，就能获得一个SYSTEM权限的命令行窗口  
这个技巧不算新东西，我们在分析Avira的CVE-2026-27748和CVE-2026-27750时就用过类似的思路。  
## 攻击实战：一步一步来  
  
假设我们手里只有一个普通权限账户limited1。  
  
第一步，在一个干净的新目录里，创建两个内容完全相同的文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibc7fRjkBGO5eOSuvwkp7icgzaryqQvhgRFyiaYD2ia5nllibgY3H8zACPgiagBh4N4v115SFbAe4UXPzViblow54bfTUkm6qcruFegvc/640?wx_fmt=png&from=appmsg "")  
  
mkdir c:\foobarecho 123 > c:\foobar\deleteme1.txtecho 123 > c:\foobar\deleteme2.txt  
  
然后，打开Intego的优化功能，选择“扫描特定位置”，选中我们刚建的c:\foobar目录。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibctygs6nNy72Crj8ZT3iaGotle2WibNgg21yDxmiaktV4z9YquP1RticOsekwxvibtMSxfgWrWFUAENLCKpSuFSZUYnVQLJ077OhD1I/640?wx_fmt=png&from=appmsg "")  
  
等着扫描完成，选中我们控制的目录，点击“立即扫描”。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibd8qZRO20ojaWZ8DBZV7CEN15icZYAD3prlZxRRTnN9Ctib8dsA3wxZ9rCib6XJSdHB9dosQB3zratFqpybcMwURACUJkqezfFJVI/640?wx_fmt=png&from=appmsg "")  
  
在真正点击“清理”按钮前，有些事情要先准备好。  
  
先运行一下FolderOrFileDeleteToSystem.exe这个工具。这是ZDI公开的PoC工具，用来探测系统级别的删除操作。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibdqial5F3EG6zCeASaKb0qpBpsjZ7RJkWQoGWMfmeERLUibU31bGAjmvL9TFFnklwurzM1sib1gQ5Cfx511c7MGGvvc3YGQTHvhGk/640?wx_fmt=png&from=appmsg "")  
  
接着，在另一个命令行窗口里执行这几条关键命令。  
  
先把c:\foobar目录里的所有文件删光。然后，创建一个指向C:\config.msi的符号链接（symlink）。最后，再去点那个“清理”按钮。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibf1hQ2iaiaXCE0LmuibyPXmVUiaZLvqAzZ1uHv4MXGa9LIOJGFbFsaEEro0Y0K7PKXqDtvNzjpnECGXlAISfibEebVBqKmiawrNCAMaM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdAJlCfEjShtChM5ziae0DP25xZWQcCaW0OiaYC1kJ9nicur0N1Ps5LIcFI5GTmTs5lQickcVzXgKmgv2G1kZ4skzM0GXqRicoVZZPM/640?wx_fmt=png&from=appmsg "")  
  
点击清理。  
  
现在，可以准备享受成果了。  
  
漏洞利用成功的话，IavService.exe会以SYSTEM权限删除掉C:\config.msi目录。之后，只需要按CTRL+ALT+DEL启动屏幕键盘，系统就会加载我们预先埋下的DLL，从而打开一个SYSTEM权限的命令提示符窗口。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdLahplQd8UqyicPQnfVkvIicsQmE9GYX5J8vpib1YmHKkW39oSfyvnhD9x8MyOBPTE5bfvzkJdBvQBvV50FVuCbQyudzurDCF3LQ/640?wx_fmt=png&from=appmsg "")  
  
DLL被成功释放。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibelELBOGcM1JbXibtvjQD0wzGv5NFfUKfRCtHBR4jzL0NWXrbeiaxnCLJJ8IfhhbqtnP3uuMsoNYX1ibmQDr8sh4ZbA8ibyQdGBo2A/640?wx_fmt=png&from=appmsg "")  
  
Procmon的监控记录证实了SYSTEM权限的删除操作。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcjYodeVxCoic5CMlhLTvGLAEkHxDvlicUfUkLYDbMVBwlTrfarh43DURF3gxcmQXSuzRYgNeDnPrI5LzwmLqcmoMu9lvZJXVCZY/640?wx_fmt=png&from=appmsg "")  
  
成功访问SYSTEM命令行。  
## 漏洞是怎么发生的？看代码  
  
分析IavService.exe的代码，问题就出在删除文件的流程上。  
  
这个过程存在典型的TOCTOU漏洞。  
1. 时间点A（检查时）：程序调用GetFileAttributesW()获取文件属性。  
1. 用户在界面上点击“清理”，这中间有个时间窗口。  
1. 时间点B（使用时）：通过IavFilesUtil_RemoveFile函数调用DeleteFileW()来删除文件。  
代码里从来不验证文件属性里是否包含FILE_ATTRIBUTE_REPARSE_POINT (0x400)或者FILE_ATTRIBUTE_DIRECTORY (0x10)。这意味着目录联接点和符号链接可以畅通无阻地通过检查。  
  
下面是存在漏洞的函数的简化伪代码。  
  
**函数：IavFileDeleteEx_DeleteFileEx**  
  
这个函数负责初始检查并协调删除。它以SYSTEM权限运行，但完全不验证文件类型。  
  
bool IavFileDeleteEx_DeleteFileEx(wstring* filepath_wstring_ptr,                                    void* stack_frame_base,                                   void* unused_param){    // 检查时刻    file_attributes = GetFileAttributesW(*filepath_wstring_ptr);    // 代码没有验证：    // - if (file_attributes & FILE_ATTRIBUTE_REPARSE_POINT)  // 0x400    // - if (file_attributes & FILE_ATTRIBUTE_DIRECTORY)      // 0x10    // 这让符号链接和目录都溜了过去    // 它只检查文件是不是只读的    if ((file_attributes & FILE_ATTRIBUTE_READONLY) != 0)    {        if (!SetFileAttributesW(*filepath_wstring_ptr,                                 file_attributes & ~FILE_ATTRIBUTE_READONLY))        {            // 移除只读属性失败            // ...        }    }    // 程序在这里暂停，等待用户确认删除    IavFileDeleteEx_KillProcessUsingFile(filepath_wstring_ptr);    temp_filepath.assign(*filepath_wstring_ptr);    // 使用时刻    deletion_succeeded = IavFilesUtil_RemoveFile(&temp_filepath);    temp_filepath.~wstring();    if (deletion_succeeded)    {        goto CLEANUP_AND_RETURN_SUCCESS;    }}  
  
**函数：IavFilesUtil_RemoveFile**  
  
这才是真正出问题的地方。这里能揪出三个关键缺陷：  
  
1. 不验证类型——从不检查重解析点或目录。2. 危险的备用路径——std::filesystem::remove()会处理目录并跟随联接点。3. 永远返回TRUE——就算删除失败了也返回成功。  
  
bool IavFilesUtil_RemoveFile(wstring* filepath_wstring){    wchar_t* filepath_ptr;    DWORD file_attributes = GetFileAttributesW(filepath_ptr);    // 仍然不检查“这是目录还是符号链接”。    // 只检查文件是否存在以及是否只读    if (file_attributes != INVALID_FILE_ATTRIBUTES &&        (file_attributes & FILE_ATTRIBUTE_READONLY))    {        if (!SetFileAttributesW(filepath_ptr,                                 file_attributes & ~FILE_ATTRIBUTE_READONLY))        {            // 如果移除只读属性失败，记录下来            // ...        }    }    // 获取文件路径指针     if (filepath_wstring->capacity >= 8)    {        filepath_ptr = (wchar_t*)filepath_wstring->data_ptr;    }    else    {        filepath_ptr = (wchar_t*)&filepath_wstring->inline_buffer;    }    if (!DeleteFileW(filepath_ptr))    {        // 如果失败了，记录日志，但还是返回true (?)        DWORD error_code = GetLastError();        LogFormatted(LOG_LEVEL_WARNING,                    L"Failed to ::DeleteFile %s trying with std::filesystem %d",                    filepath_ptr,                    error_code);        std::error_code ec;        std::filesystem::remove(filepath_ptr, ec);        return TRUE;    }    // 删除成功，返回true    return TRUE;}  
## 完整的攻击链条  
1. 扫描器发现c:\foobar\deleteme2.txt是重复文件，准备标记删除。  
1. GetFileAttributesW()检查了它的属性（但没查类型）。  
1. 用户点击“清理”，但攻击者行动更快：    - 删光c:\foobar\里的所有文件  
    - 把c:\foobar\deleteme2.txt替换成一个指向\RPC Control的NT对象目录联接点  
    - 在\RPC Control\deleteme2.txt处创建一个指向C:\Config.msi的NT符号链接  
  
1. 删光c:\foobar\里的所有文件  
1. 把c:\foobar\deleteme2.txt替换成一个指向\RPC Control的NT对象目录联接点  
1. 在\RPC Control\deleteme2.txt处创建一个指向C:\Config.msi的NT符号链接  
1. 由于NT符号链接的存在，DeleteFileW()调用失败。  
1. 程序进入回退路径，调用std::filesystem::remove()，而它会跟随NT符号链接。  
1. RemoveDirectoryW()以SYSTEM权限执行，成功删除C:\Config.msi。  
1. 函数返回TRUE，对调用者来说一切正常。  
## 我的看法：老问题，新面孔  
  
这个漏洞本身不复杂，却非常有效。它再一次证明：在赋予软件高权限之前，必须对它的每一个操作都做彻底的边界检查。特别是文件系统操作，Windows平台上的符号链接和联接点从来就是权限提升漏洞的“老朋友”了。  
  
Intego作为一个安全软件，在最基础的“删除”功能上翻车，实在有点讽刺。安全产品本应成为系统的最后一道防线，但糟糕的代码实现反而让它变成了攻击者的跳板。  
  
更让人无奈的是漏洞披露的时间线。我们团队从2025年11月开始尝试联系Intego，过程拖沓，响应缓慢。尽管通过CERT-FR进行了协调，但直到我们按计划发布macOS版的漏洞分析后，才发布了这个Windows版本的分析。这反映了一些安全厂商在漏洞响应上的真实态度。  
  
最后，还是得谢谢Mathieu。要不是他发现的macOS版漏洞让我在周日下午手痒，我也不会去碰这个Windows版本。  
## 时间线：一次典型的漏洞披露拉锯战  
  
下面是这次漏洞协调披露过程中的关键时间点，希望给关注这方面的人提供一点透明度。  
- 2025-11-06：尝试通过dpo@intego.com联系厂商，询问安全报告联系人。  
- 2025-12-08：尝试通过info@intego.com再次联系厂商。  
- 2025-12-16：由于未能直接联系到厂商，将漏洞报告提交给CERT-FR，并告知披露日期定为2025年12月30日。  
- 2025-12-17：CERT-FR确认收到报告。建议将发布日期推迟至次年2月中旬，以争取更多时间协调。  
- 2025-12-18：我们同意将发布日期推迟至2026年2月10日。  
- 2026-01-17：Intego客服回复称报告已转交相关部门审核，会通过邮件提供更新。  
- 2026-02-10：发布macOS版Intego的第一篇漏洞分析文章。  
- 2026-04-07：发布本篇关于Windows版Intego的分析文章。  
### 参考资料  
  
[1]   
https://blog.quarkslab.com/milking-the-last-drop-of-intego-time-for-windows-to-get-its-lpe.html  
  
