#  Windows“MiniPlasma”零日漏洞可使攻击者获得SYSTEM权限——概念验证代码已发布  
 网安百色   2026-05-19 10:44  
  
![](https://mmbiz.qpic.cn/mmbiz_png/WibvcdjxgJns3KrspeM08mGwL0ibZzkhAGp1k8pfSPJUQPCJ0ZiaIBWlToge1micgibwUPmyWeY0IyJ3Lnyic664GqicXLIIb6PnzwwGXBM1lHwMfg/640?wx_fmt=png&from=appmsg "")  
  
Windows本地提权零日漏洞“MiniPlasma”曝光，公开的概念验证利用代码可使攻击者在完全打补丁的Windows系统上获取SYSTEM级权限。  
  
安全研究员Nightmare-Eclipse于2026年5月13日在GitHub发布了武器化利用代码，声称微软要么未能修复、要么悄然回滚了六年前报告的漏洞补丁。  
  
该漏洞针对cldflt.sys云过滤驱动程序的HsmOsBlockPlaceholderAccess例程，最初由Google Project Zero研究员James Forshaw于2020年9月发现并报告给微软。  
  
微软为该漏洞分配了CVE-2020-17103编号，并据称在2020年12月的补丁星期二更新中修复。  
  
然而，Nightmare-Eclipse发现原始报告中记录的相同问题仍可被利用，且无需修改原始概念验证代码。  
  
该研究员在微软2026年5月补丁星期二发布后一天公开了MiniPlasma，使披露时间紧随补丁周期，导致组织在至少下次计划更新前无法获得官方修复方案。  
  
该利用代码在安全社区引发广泛关注，GitHub仓库在发布数日内已获得超过390个星标。  
  
MiniPlasma零日概念验证已发布  
  
该漏洞允许未授权用户在未经适当访问检查的情况下创建任意注册表键.DEFAULT用户配置单元。  
  
据Google Project Zero称，漏洞根源在于HsmOsBlockPlaceholderAccess函数处理注册表键创建的方式，未能指定OBJ_FORCE_ACCESS_CHECK标志。  
  
这使攻击者能够绕过常规访问限制，向.DEFAULT用户配置单元写入键值，尽管标准用户通常不具备此类权限。  
  
该利用通过利用竞态条件来武器化此行为，该条件在用户令牌和匿名令牌之间切换以操控内核中的RtlOpenCurrentUser函数。  
  
当竞态条件成功时，系统在模拟线程还原期间打开.DEFAULT配置单元进行写入，从而允许未授权的键创建。  
  
Nightmare-Eclipse在GitHub发布的概念验证表明，在多核系统上通过竞态条件成功后可稳定生成SYSTEM权限的Shell。  
  
该漏洞影响所有Windows版本，对企业的环境、工作站和云同步系统构成重大威胁。  
  
测试证实，从标准用户账户运行该利用可成功打开具有SYSTEM权限的命令提示符，使攻击者完全控制受感染机器。  
  
云过滤驱动程序组件是Windows云存储同步服务（如OneDrive）的核心部分，这意味着易受攻击的代码运行在广泛范围的Windows安装环境中。  
  
组织应监控微软的安全响应并准备在补丁可用后立即部署，因为可用的工作利用代码显著增加了被利用的风险。  
  
本公众号所载文章为本公众号原创或根据网络搜索下载编辑整理，文章版权归原作者所有，仅供读者学习、参考，禁止用于商业用途。因转载众多，无法找到真正来源，如标错来源，或对于文中所使用的图片、文字、链接中所包含的软件/资料等，如有侵权，请跟我们联系删除，谢谢！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/1QIbxKfhZo5lNbibXUkeIxDGJmD2Md5vKicbNtIkdNvibicL87FjAOqGicuxcgBuRjjolLcGDOnfhMdykXibWuH6DV1g/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=p6hk1x4r&tp=webp#imgIndex=1 "")  
  
