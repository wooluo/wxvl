#  Dirty Frag：无需漏洞触发条件的 Linux 本地提权，你的防御控制真的在工作吗？  
 塞讯安全验证   2026-05-14 02:02  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/D3YzQzbXJGZ6TpQTg6aLIewNELxKrkCmmRjaIWsIQNYpH196pAcAOaJ5p6FqRU3xpOqeibIk7Sh7eFEPbHRlQaw/640?wx_fmt=gif&from=appmsg "")  
  
5 月 8 日消息。继 Copy Fail 之后，Linux 内核再次曝出严重本地提权漏洞，研究人员将其命名为 Dirty Frag。与 Copy Fail 机制类似，任何本地用户只需运行一个程序，即可在不依赖特定系统条件或时序触发的情况下瞬间获取 root 权限。这是一个纯逻辑漏洞。  
  
01  
  
这一次，范围更广，窗口更长  
  
  
Dirty Frag 的影响范围几乎覆盖 2017 年以来的所有主流 Linux 发行版：Ubuntu 24/26、Arch、RHEL、OpenSUSE、CentOS Stream、Fedora、Alma，以及微软的 WSL2。  
  
![DirtyFrag影响范围](https://mmbiz.qpic.cn/mmbiz_png/VZSw6Dl0jCgpKwSEOFEjwNiaf99fOzKSIDD6QpvchrQEU9PjTGOuRMLYTIGgRxLI0ib9OicB8SKaFFqBIoefHP8WbBia0N1guVatZQJYKSZhuQU/640?from=appmsg "")  
  
**漏洞于 4 月 30 日向 Linux 内核团队报告，原本计划有序披露，但一名"无关第三方"打破了信息禁令，导致漏洞细节在补丁尚未准备就绪时已公开流传。**  
  
这意味着从漏洞曝光到修复，这段没有补丁保护的窗口期是完全暴露的。相比 Copy Fail，Dirty Frag 的危险程度更高。  
  
对企业来说，这带出一个更关键的问题：  
你的安全控制措施，此刻真的在工作吗？  
  
02  
  
机制拆解：两个链式漏洞，一条通往 root 的路  
  
  
Dirty Frag 在技术层面利用了 IPSec 相关模块中的零拷贝操作缺陷，由两个链式漏洞组成：  
- **xfrm-ESP Page Cache Write 漏洞（内核提交 cac2661c53f3，引入于 2017 年）**  
  
- **RxRPC Page-Cache Write 漏洞（内核提交 2dc334f1a63a）**  
  
![链式漏洞利用](https://mmbiz.qpic.cn/sz_mmbiz_png/VZSw6Dl0jCiaEZNlo8BdwpSsnZMrLzZwk4BR5s56v7qc8NHsJERXdHWZn3nibv8OF5PEuLhicmsicWDFticuLPkGBCXrK8TqF65Tw64HP39tRbYg/640?from=appmsg "")  
  
由于 Ubuntu 的 AppArmor 会封堵第一个漏洞，攻击者的概念验证代码（PoC）会自动链式调用第二个完成提权，整个过程  
无需任何额外条件  
。  
  
这种"自适应链式利用"结构，意味着常见的 MAC 强制访问控制机制在这里失去了屏障作用，漏洞利用路径并不因此中断，只是切换了入口。  
  
攻击行为映射至 MITRE ATT&CK 框架：  
- **T1068 - 漏洞利用提权：利用操作系统内核漏洞将权限从普通用户提升至 root**  
03  
  
缓解方案：禁用三个内核模块  
  
  
由于暂无内核补丁，官方建议的临时缓解措施是禁用 esp4、esp6 和 rxrpc 三个模块——这三个模块均与 IPSec 网络相关，大多数生产服务器默认不会使用，执行以下命令可完成缓解：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
**执行前建议确认当前环境是否依赖 IPSec VPN 或相关网络功能，以评估缓解操作对业务的影响。**  
  
04  
  
企业防御框架：三步走  
  
  
截至 2026 年 5 月 12 日，Linux 主线内核已发布官方修复补丁，各大主流发行版正在陆续推送安全更新。在所有服务器完成官方补丁部署前的真空期，企业安全防线仍然极其脆弱，以下是一个可操作的分层响应框架：  
## 第一步：资产排查与影响范围确认  
  
统计环境中运行 2017 年以来 Linux 内核版本的服务器数量，重点关注：面向互联网的 Linux 主机、多租户容器宿主机、使用 WSL2 的 Windows 端点。  
## 第二步：执行缓解操作，并验证执行结果  
  
禁用三个模块的操作本身简单，但覆盖全量资产依赖完整的配置管理能力。对于使用配置管理工具（如 Ansible、Chef、Salt）的团队，缓解脚本应纳入统一推送，而非依赖手动逐台执行。**执行后需确认模块已真正卸载，而非仅写入配置文件。**  
  
![三步走防御框架](https://mmbiz.qpic.cn/mmbiz_png/VZSw6Dl0jChhMHdT8TfRRQTiclM10uTSD6w9WbGnDibicDNqgE0u5xB8nc2EEXo89UWSZtnAGqnNS9yk90pc4ibpYxsGoiaib2ovjEDiaXQfYoHrtk/640?from=appmsg "")  
## 第三步：验证现有防御控制是否对本地提权行为具备检测能力  
  
禁用模块之后并不意味着万事大吉——类似机制的内核漏洞并非孤例，Copy Fail 刚消停，Dirty Frag 随即出现。更关键的问题是：  
当攻击者已经在主机上以普通用户身份运行程序时，你的 EDR 和 HIDS 以及基于审计日志的 SIEM 是否能识别进程提权行为？  
  
目前，塞讯智能安全验证平台的攻击规则库已收录 Dirty Frag 漏洞的验证规则。企业团队可直接在真实环境中执行本地提权验证场景，由平台自动收集 EDR、HIDS、SIEM 等安全产品或平台的响应告警，与验证动作进行比对，  
确认防御控制是否真实生效  
——而不是依赖供应商的"支持声明"自行判断。  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTWraMIkxfckaFSngPbCmkoTJ3icaW9YYeZtBtXdz9LYD08bOGSSZMKfTibLicFekbn7jwl8cjacicKa7PovTXpuLns4XC7WSqRpfAo/640?wx_fmt=png&from=appmsg "")  
  
Dirty Frag 的利用不需要任何先决条件，只需要一个本地用户账号。  
  
假设攻击者已经通过钓鱼邮件在你的某台服务器上获得了普通用户 shell，从那一刻起到获取 root 权限，  
你的防御体系有多少时间、多少层拦截机会？  
  
这个问题的答案，你是否已经用真实数据验证过？  
  
  
  
  
  
  
  
**以情报洞察未知，以验证锚定安全**  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/D3YzQzbXJGZ6X2NtUtFjicOPdYZbdXy10MvHQBIuSJGLDTSiaPRQTib1ZHKqLjibLs8Jm9fIYaCBpzUfFj1Efibvtvw/640?wx_fmt=gif&wxfrom=10005&wx_lazy=1&wx_co=1&randomid=iyt7hkoz&tp=wxpic#imgIndex=33 "")  
  
**长按图片扫码添加【官方客服】**  
  
****  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/D3YzQzbXJGZc61MO7yLs2nJa9K6ndfaocica0SmniasTB10oR41lBMfPRlT9mtF0ku3GdRO30Mj4UMs0YCw8Y0cQ/640?wx_fmt=other&wxfrom=10005&wx_lazy=1&wx_co=1&randomid=vedmokhe&tp=wxpic#imgIndex=36 "")  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508434&idx=1&sn=899b56ec72d2fa7d82977c52bb4ce1b4&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508434&idx=2&sn=d438b32121859a582668ee8bb3c191cc&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508378&idx=1&sn=7512bcced06e275ff9095f7acae9139b&scene=21#wechat_redirect)  
  
  
![图片](https://mmecoa.qpic.cn/sz_mmecoa_png/NFUgVR5BdTX3NBjibce13yPLAV7oUSjdTcoUicKKUj8CyyRh9MwL1az8tBbicHKRibMPAmLQyiby2x7azm6FSmmA3MxbeYyOaubAoibsHmeLABDsw/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=10005&wx_lazy=1#imgIndex=16 "")  
  
▶▶  
关注【塞讯安全验证】，了解塞讯智能安全验证平台  
以及更多安全资讯  
  
  
▶▶  
关注【塞讯威胁情报】，  
解锁 AI 赋能的新一代威胁情报中枢，获取第一手恶意 skills 情报  
  
  
  
