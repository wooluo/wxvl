#  榨干 Intego 的最后一滴油——Windows 本地提权漏洞分析  
Lucas Laise
                    Lucas Laise  securitainment   2026-04-19 03:33  
  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://blog.quarkslab.com/milking-the-last-drop-of-intego-time-for-windows-to-get-its-lpe.html</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">Lucas Laise</span></section></td></tr></tbody></table>> 通过利用符号链接跟随漏洞，在杀毒软件 Intego 中实现任意目录删除的漏洞利用。  
  
## 引言  
  
那是一个阳光灿烂的周日下午，我的同事 Mathieu Farrell 和我聊起了他在 macOS 版本的 Intego 中发现三个漏洞的经过 (详见 1、2 和 3)。出于好奇，我去浏览了 Intego 的官网，想了解一下这款我此前并不熟悉的安全软件，结果发现他们还推出了 Windows 版本。既然如此，不妨趁着闲暇试试手？几小时后，我成功挖掘出一个 Local Privilege Escalation 漏洞。用这样的方式度过一个阳光灿烂的下午，还真不赖。  
  
该漏洞的原理相当直接：Intego 的 Optimization 模块在以 SYSTEM 权限删除重复文件时，未对目标文件究竟是普通文件还是目录联接点进行充分验证。将其与广为人知的 Config.msi  
删除技巧相结合，攻击者便可一路打通晋升至 SYSTEM  
权限。  
  
本文将详细记录影响 Intego 3.0.0.1  
的这一漏洞的发现过程、利用方式与技术分析。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSj8cwh9016Dr8fJLiaRKEIg5vjhXnicQleHTQDOF1uicgjo3RXcia9w80ZETtHXjJzhZ5lJRwItMLmBpj2m4FQDKApmBaQGkC3EmC4/640?wx_fmt=png&from=appmsg "")  
  
Intego version 3.0.0.1.  
## 技术背景  
## Intego 的 Optimization 模块  
  
Intego 内置了一个 Optimization 模块，用于扫描重复文件并提示用户进行删除。该功能无需高权限即可使用，具体工作流程如下：  
1. 用户对指定位置发起优化扫描。  
  
1. Intego 根据文件内容识别重复文件。  
  
1. 用户选择要删除的文件，点击"Cleanup"按钮。  
  
1. IavService.exe  
(以 SYSTEM 权限运行) 执行文件删除。  
  
从设计层面看，逻辑似乎无懈可击。但在实践中，这正是我们实现权限提升的突破口。  
## 关于 config.msi技巧  
  
在深入介绍攻击细节之前，先简要说明由 ZDI 记录的 Config.msi  
删除原语。在 Windows Installer 服务的安装与回滚过程中，该服务会将回滚脚本 (.rbs  
) 和回滚文件 (.rbf  
) 存储于 C:\Config.msi  
目录下，这些文件随后将以 SYSTEM  
权限执行处理。完整的利用流程如下：  
1. 滥用某个 SYSTEM 操作，借助重解析点删除文件夹 C:\Config.msi  
。  
  
1. 攻击者重新创建 C:\Config.msi  
，并将 .rbs  
和 .rbf  
回滚脚本及文件放入其中。  
  
1. 触发 MSI 安装流程并强制令其失败，从而引发回滚操作。  
  
1. Windows Installer (SYSTEM) 将加载回滚文件与脚本，默认情况下会在 C:\Program Files\Common Files\microsoft shared\ink\HID.DLL  
处植入一个 DLL，随后只需启动 osk.exe  
并切换到安全桌面 (按下 CTRL+ALT+DEL  
即可)，便能获得具有 SYSTEM 权限的命令提示符。  
  
如需了解我们此前针对同类漏洞所做的工作，可参阅 Avira 的 CVE-2026-27748 与 CVE-2026-27750。  
## 操作演示  
  
使用受限用户 limited1  
，我们首先需要在一个全新 (或空白) 目录中创建 2 个内容相同的文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSiaTL5icrlYt25VYqYc9rlyVQe7sMCfVzyMMYRxtibaS2zweZd39QN0J03An126XPC8EH83JM48mVu8t25nDGnb0M0DalUArWr4G0/640?wx_fmt=png&from=appmsg "")  
  
  
受限用户权限。  
```
mkdir c:\foobar
echo 123 > c:\foobar\deleteme1.txt
echo 123 > c:\foobar\deleteme2.txt
```  
  
在 **Optimization**  
-> **Scan Specific Location**  
中选择 c:\foobar  
目录，扫描重复文件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShbpOneO5ViazhGtCzY8Ficvcia58wCCBMibjXfgAKALE1pOnSTa6dqInJtYsWWb7R6q3w3A0LZUnKkwwn5u6yc8y4hmbxDwGcAkWo/640?wx_fmt=png&from=appmsg "")  
  
  
Scan Specific Location.  
  
等待扫描完成，确认所控目录无误，然后运行 **Scan Now**  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgd2Bg7WicOTRXWu4Zwv9OPccmmqlU8ez3jHX2gDTJpsnOibDAF0RGF2OhjV8gxBkVEtjyMDRJaJicsT9Ye9pSEPy50picfpY9h4Tc/640?wx_fmt=png&from=appmsg "")  
  
  
Scan Now.  
  
在执行 **Cleanup**  
之前，先运行 FolderOrFileDeleteToSystem.exe。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShWib4yQN8cjoHWtb20RjPe6BhrND5yeWJMoLpdnTbiagjgX73QS6tjUPMICX0apVt1yLummv5cTPSA8JBWzcUzicPdmSia09eEEKs/640?wx_fmt=png&from=appmsg "")  
  
  
运行 FolderOrFileDeleteToSystem.exe。  
  
同样，在执行 **Cleanup**  
之前，在另一个 shell 中依次运行以下命令：先删除 c:\foobar  
目录中的所有文件；然后创建指向 C:\config.msi  
的 symlink，以触发 LPE；最后执行"清理"。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nShnhky6CF5H0ErR65mSxia80Dwvads8k7vIFZU29rhrQ32ibguRNfjDo1hycTiafmV3C9sEGInSkSfOLxup75xJ0Ly5ryVib16Clds/640?wx_fmt=png&from=appmsg "")  
  
  
删除所有文件并创建 symlink。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSj6lNpvf1eJnEPNtrBX2cSYUopcjL0AX8LsSksCUzLMRjhnLuPuygQ0SoIUmg8XcZWQe2MRcABDCdEIOMa3HkBWQ7EeCfxg0CI/640?wx_fmt=png&from=appmsg "")  
  
  
执行清理操作。  
  
坐享其成。exploit 运行成功，IavService.exe  
已将 C:\config.msi  
删除，此时按下 CTRL+ALT+DEL  
调出虚拟键盘，即可获得 SYSTEM  
权限的 shell。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjojF2qlln59rTn0YHsyfibhzNyIGZusmsttlVaFkMtw7SJrUhYNSWjibWER3eeLbcArP0Cb4GHEN9biaSFyAZxo6k8Fd4zpcjdss/640?wx_fmt=png&from=appmsg "")  
  
  
DLL 成功植入。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSglia2N5K2oWThxvbr4WbGlj0xiauXWDdsPIniaB9IQJcxliaIgmbhnsZ7kubE53Y9e1tYEopsHme90vh74WibxIbsZLL0cLeKt2vLY/640?wx_fmt=png&from=appmsg "")  
  
  
Procmon 捕获确认删除操作以 SYSTEM 身份执行。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgz9AcpDDU3VqYic5I11wZRGWpokFjgn58AIvcDMic84hNf0upypOvYaZa6VdK99q14GXNIxsziabEiaMc50Hy0BHxia8YcNUpsOTkw/640?wx_fmt=png&from=appmsg "")  
  
  
获得 SYSTEM 命令提示符访问权限。  
## 漏洞分析  
  
分析 IavService.exe  
揭示了删除流程中的问题：  
1. **TIME-OF-CHECK**  
：GetFileAttributesW()  
检查文件属性。  
  
1. **用户点击"清理"**  
：形成可利用的竞态窗口。  
  
1. **TIME-OF-USE**  
：通过 IavFilesUtil_RemoveFile  
调用 DeleteFileW()  
。  
  
代码从不验证 file_attributes  
是否包含 FILE_ATTRIBUTE_REPARSE_POINT (0x400)  
或 FILE_ATTRIBUTE_DIRECTORY (0x10)  
。目录联接点和普通目录均可绕过检查直接通过。  
  
以下是存在漏洞的函数简化伪代码。  
## 函数：IavFileDeleteEx_DeleteFileEx  
  
该函数执行初始检查并协调删除操作，以 SYSTEM 权限运行，但不验证文件类型。  
```
boolIavFileDeleteEx_DeleteFileEx(wstring* filepath_wstring_ptr,
void* stack_frame_base,
void* unused_param)
{
// TIME-OF-CHECK    file_attributes = GetFileAttributesW(*filepath_wstring_ptr);

// The code does NOT verify:// - if (file_attributes & FILE_ATTRIBUTE_REPARSE_POINT)  // 0x400// - if (file_attributes & FILE_ATTRIBUTE_DIRECTORY)      // 0x10// This allows symlinks and directories to pass through unchecked
// Only checks if file is read-onlyif ((file_attributes & FILE_ATTRIBUTE_READONLY) != 0)
    {
if (!SetFileAttributesW(*filepath_wstring_ptr,
                                file_attributes & ~FILE_ATTRIBUTE_READONLY))
        {
// Failed to remove read-only attribute// ...        }
    }

// Application is paused here, waiting for user to confirm deletion
IavFileDeleteEx_KillProcessUsingFile(filepath_wstring_ptr);

    temp_filepath.assign(*filepath_wstring_ptr);

// TIME-OF-USE    deletion_succeeded = IavFilesUtil_RemoveFile(&temp_filepath);

    temp_filepath.~wstring();

if (deletion_succeeded)
    {
goto CLEANUP_AND_RETURN_SUCCESS;
    }
}
```  
## 函数：IavFilesUtil_RemoveFile  
  
漏洞利用正是发生在此处。此处存在三个关键缺陷：  
1. **无类型校验**  
- 从不检查重解析点或目录。  
  
1. **危险的兜底逻辑**  
- std::filesystem::remove()  
可处理目录并跟随目录联接点。  
  
1. **始终返回 TRUE**  
- 即使删除失败也如此。  
  
```
boolIavFilesUtil_RemoveFile(wstring* filepath_wstring)
{
wchar_t* filepath_ptr;

    DWORD file_attributes = GetFileAttributesW(filepath_ptr);

// Still no check for "is it directory or symlink".// Only check if file exists and is read-onlyif (file_attributes != INVALID_FILE_ATTRIBUTES &&
        (file_attributes & FILE_ATTRIBUTE_READONLY))
    {
if (!SetFileAttributesW(filepath_ptr,
                                file_attributes & ~FILE_ATTRIBUTE_READONLY))
        {
// Log error if removing read-only fails// ...        }
    }

// Extract filepath pointerif (filepath_wstring->capacity >= 8)
    {
        filepath_ptr = (wchar_t*)filepath_wstring->data_ptr;
    }
else
    {
        filepath_ptr = (wchar_t*)&filepath_wstring->inline_buffer;
    }


if (!DeleteFileW(filepath_ptr))
    {
// If fail, log and return true (?)        DWORD error_code = GetLastError();

LogFormatted(LOG_LEVEL_WARNING,
L"Failed to ::DeleteFile %s trying with std::filesystem %d",
                    filepath_ptr,
                    error_code);


        std::error_code ec;
std::filesystem::remove(filepath_ptr, ec);

returnTRUE;
    }

// Deletion succeeded, return truereturnTRUE;
}
```  
## 漏洞利用链  
1. 扫描器将 c:\foobar\deleteme2.txt  
识别为重复文件。  
  
1. GetFileAttributesW()  
检查文件属性。  
  
1. 用户点击"清理"，但攻击者抢先行动：  
  
1. 删除 c:\foobar\  
目录下的所有文件。  
  
1. 将 c:\foobar\deleteme2.txt  
替换为指向 \RPC Control  
的 NT object directory junction。  
  
1. 在 \RPC Control\deleteme2.txt  
处创建指向 C:\Config.msi  
的 NT symlink。  
  
1. DeleteFileW()  
因 NT symlink 而调用失败。  
  
1. 回退至 std::filesystem::remove()  
，该函数会跟随 NT symlink。  
  
1. RemoveDirectoryW()  
以 SYSTEM 权限执行，并删除 C:\Config.msi  
。  
  
1. 函数返回 TRUE  
，调用方看来一切正常。  
  
## 结论  
  
此漏洞虽简单却十分有效：删除操作前缺少类型验证，叠加 SYSTEM 权限即可完成提权。再次感谢 Mathieu 发现了 macOS 上的相关漏洞，正是这些发现，启发了我在那个周日下午展开这番研究。  
## 参考资料  
- Intego X9: When your macOS antivirus becomes your enemy  
  
- Intego X9: Why your macOS antivirus should not trust PIDs  
  
- Intego X9: Never trust my updates  
  
- Avira: Deserialize, Delete and Escalate - The Proper Way to Use an AV  
  
- Abusing Arbitrary File Deletes to Escalate Privilege and Other Great Tricks  
  
- symboliclink-testing-tools, by James Forshaw  
  
## 披露时间线  
  
以下为本次协调漏洞披露流程中所有关键事件的时间线，旨在向各方完整呈现整个过程及相关行动。  
- 2025-11-06：Quarkslab 向 dpo@intego.com 发送邮件，寻求安全漏洞报告的联络人。  
  
- 2025-12-08：Quarkslab 向 info@intego.com 发送邮件，再次寻求安全漏洞报告的联络人。  
  
- 2025-12-16：Quarkslab 将漏洞报告提交至 CERT-FR，说明此前未能联系到厂商，披露日期定为 2025 年 12 月 30 日。  
  
- 2025-12-17：CERT-FR 确认收到报告，询问 Quarkslab 曾尝试联系哪些渠道，并建议将发布时间推迟至次年二月中旬，以便协调厂商并避免在年末发布。  
  
- 2025-12-18：Quarkslab 同意将发布推迟至 2026 年 2 月 10 日，并提供了此前尝试联系的邮件地址。  
  
- 2025-12-24：CERT-FR 询问具体测试了哪些版本，并确认是否可将报告转发给厂商。  
  
- 2025-12-24：CERT-FR 通过厂商支持渠道与其取得联系。  
  
- 2026-01-15：CERT-FR 再次联系厂商，提醒其发布计划定于 2 月 10 日，并询问修复方案的发布计划。  
  
- 2026-01-17：Intego 客服回复称，报告已转交相关部门审查，一旦有进一步信息将通过邮件更新。  
  
- 2026-01-24：CERT-FR 向 Quarkslab 通报了披露协调的最新进展，并表示已告知厂商：若未收到关于报告处理情况的具体反馈，将按约于二月如期发布。  
  
- 2026-02-05：Quarkslab 向 CERT-FR 发送邮件，确认将按约定如期发布。  
  
- 2026-02-10：关于 macOS 版本的第一篇博客文章正式发布。  
  
- 2026-02-26：关于 macOS 版本的第二篇博客文章正式发布。  
  
- 2026-03-20：关于 macOS 版本的第三篇博客文章正式发布。  
  
- 2026-04-07：本篇关于 Windows 版本的博客文章正式发布。  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
