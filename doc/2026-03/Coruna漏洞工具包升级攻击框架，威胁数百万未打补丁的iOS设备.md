#  Coruna漏洞工具包升级攻击框架，威胁数百万未打补丁的iOS设备  
 FreeBuf   2026-03-28 04:13  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/icBE3OpK1IX1YlBzRLHBnibqn5MoXmK2UwBXQic6HiaP62yYUKKoVg4Wd4gjYCnuwFQicicEJaz5HRtiaA32gPmEwDRBZWicNolpCceH5s3vuKuVr4s/640?wx_fmt=jpeg&from=appmsg "")  
##   
  
卡巴斯基研究人员发现，Coruna iOS漏洞利用工具包使用了2023年Triangulation行动中相同内核漏洞的更新版本。虽然早期证据未能明确关联两者，但代码相似性现在暗示了它们之间可能存在联系——不过仅凭共享漏洞并不能确证两次攻击由同一组织发起。  
  
  
2025年3月初，谷歌威胁情报小组（GTIG）识别出名为Coruna（亦称CryptoWaters）的新型iOS漏洞利用工具包，该工具包针对运行iOS 13.0至17.2.1系统的苹果iPhone。该套件包含五条完整攻击链，共计23个漏洞利用程序。  
  
  
根据谷歌分析，虽然Coruna对运行iOS 13.0至17.2.1系统的iPhone极具威胁，但对最新版iOS无效。GTIG追踪到该漏洞被用于三类场景：某监控软件客户的精准攻击、UNC6353组织针对乌克兰的"水坑攻击"，以及中国金融威胁组织UNC6691发起的大规模攻击，这显示出"二手"0Day漏洞利用程序存在活跃交易市场。多个威胁组织正在复用并改造这些先进技术来攻击新漏洞。  
##   
  
**Part01**  
## 漏洞利用框架的演进  
  
  
2025年2月的初始发现中，GTIG捕获到一个从未公开的JavaScript框架，该框架通过某监控软件客户分发iOS漏洞利用链。分析显示Coruna工具包使用了多个已修补漏洞，包括（CVE-2023-32434）和（CVE-2023-38606）——这两个漏洞最初在Triangulation行动中作为0Day漏洞出现。虽然漏洞细节现已公开，但卡巴斯基发现Coruna的内核漏洞利用程序是早期攻击所用版本的升级版。  
  
  
研究人员成功收集并分析Coruna组件后，确认了显著的代码相似性。该工具包还包含四个额外内核漏洞利用程序，其中部分开发于Triangulation行动之后，但均基于相同框架构建。这些发现表明Coruna并非拼凑的复用部件，而是Triangulation行动背后同一漏洞利用框架的更高级演进。  
  
  
"这些发现让我们得出结论：该漏洞工具包并非拼凑而成，而是采用统一方法设计。"卡巴斯基报告指出，"我们认为这是同一漏洞利用框架的更新版本——至少在某种程度上曾用于Triangulation行动。"  
  
  
**Part02**  
## 模块化攻击流程  
  
  
Coruna攻击链始于基于Safari的加载器，该模块识别目标设备并根据浏览器版本选择合适漏洞。它包含下载加密组件的链接和密钥。随后有效载荷通过ChaCha20算法和LZMA压缩技术解密处理多层数据，揭示存储文件和指令的结构化容器。这些容器根据设备类型、CPU和iOS版本定义需要获取的漏洞利用程序、加载器和恶意组件。  
  
  
Coruna支持多种包类型，包括针对不同架构和固件版本定制的内核漏洞利用程序、加载器和植入模块。当所有组件获取完成后，有效载荷执行内核漏洞利用、加载恶意软件并发起攻击，动态适应目标环境以实现最大效果。  
  
  
**Part03**  
## 代码复用与适配升级  
  
  
研究人员分析Coruna中五个内核漏洞利用程序后，发现其中一个是Triangulation行动所用漏洞的更新版。新版代码通过检查更多XNU版本细节、支持新版iOS（最高17.2）及识别A17和M3等新款苹果芯片来提升兼容性。尽管原始漏洞早已修补，但这些检查机制被添加以支持基于同一共享框架构建的新漏洞利用程序。  
  
  
"如果目标漏洞已在iOS 16.5 beta 4中修复，为何漏洞利用程序仍需检查iOS 17.2及新款CPU？通过检查其他漏洞利用程序可找到答案：它们都基于同一源代码。"报告补充道，"唯一区别在于所利用的漏洞不同，因此添加这些检查以支持新版漏洞利用程序，并在重新编译后出现在旧版本中。"  
  
  
**Part04**  
## 攻击后自动化处理  
  
  
启动器负责攻击后任务处理。它不再重新运行漏洞利用程序，而是复用早前创建的内核访问权限来读写内存。该模块会清除攻击痕迹、选择目标进程、注入加载器并执行以部署最终恶意软件。这种流线型方法使得攻击者在获得初始访问权限后，能更高效隐蔽地实施攻击。  
  
  
"这个最初为网络间谍目的开发的框架，现正被更广泛的网络犯罪分子使用，使数百万未打补丁的设备面临风险。"报告总结道，"鉴于其模块化设计和易复用性，我们预计其他威胁组织将开始将其纳入攻击体系。强烈建议用户尽快安装最新安全更新（如尚未更新）。"  
  
  
**Part05**  
## 关联攻击工具浮出水面  
  
  
2025年3月中旬，Lookout威胁实验室发现名为DarkSword的新iOS漏洞利用工具包，自2025年底起被多个威胁组织使用，包括监控软件供应商及疑似国家背景的黑客。该工具包能实施全链条攻击窃取苹果设备敏感数据，已观察到针对沙特、土耳其、马来西亚和乌克兰等国的攻击活动。  
  
  
DarkSword针对运行iOS 18.4-18.7系统的iPhone，疑似俄罗斯关联组织UNC6353曾用它攻击乌克兰目标。攻击者可窃取凭证和加密钱包信息等敏感数据，采用"打了就跑"策略快速外传数据并清除痕迹。这些漏洞利用程序似乎与Coruna存在关联，DarkSword能以最小用户交互实现近乎完全的设备访问，表明高级漏洞利用技术正在二级市场向更广泛的威胁组织流通。  
  
  
**参考来源：**  
  
Coruna exploit reveals evolution of Triangulation iOS exploitation framework  
  
https://securityaffairs.com/190010/security/coruna-exploit-reveals-evolution-of-triangulation-ios-exploitation-framework.html  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651335912&idx=1&sn=f7c9c36f910a122eb9bb727adcf9e89d&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
