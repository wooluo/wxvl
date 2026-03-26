#  漏洞预警 | Apifox 桌面客户端官方 CDN 脚本遭供应链投毒事件  
原创 Josh
                    Josh  银河哈希   2026-03-26 07:07  
  
## 事件背景  
  
Apifox 是一站式 API 全生命周期管理工具，集接口文档、调试、Mock、自动化测试、压测与团队协作为一体，兼容 Swagger/Postman/JMeter，一套数据同步避免多工具切换；内置Apifox AI，支持自定义接入 AI 模型，可 AI 一键生成测试用例与配套测试数据、自动生成断言脚本、智能优化字段命名与数据模型、检测接口文档完整性与规范性、对话式修改接口定义，还能直接调试 Ollama 等本地大模型接口，全程 AI 辅助提升研发与测试效率。  
## 时间线  
### 2026-03-04  
  
攻击者注册并上线恶意域名 apifox.it.com，同时将 Apifox 官方 CDN 上用于事件上报的脚本文件apifox-app-event-tracking.min.js  
替换为包含恶意逻辑的 77KB 版本，相比正常 34KB 文件明显异常，针对开发者的供应链投毒正式启动。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Yg4FVwamkuVsROCg9pfgLU15XYmNdhWZiaVI3p5fUL9JBiaicNzCrQ0DXkqdnWajL5B3f4rcgsmc0AMUOGibTWN2bQkr2iaclpysRE9olvN8y4Hc/640?wx_fmt=png&from=appmsg "")  
### 2026-03-05  
  
互联网档案库 Wayback Machine 对该 CDN 脚本进行了自动抓取，首次存档了这份 77KB 的投毒版本，为后续溯源和取证留下了关键时间节点证据。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yg4FVwamkuXzCPKGxibNjgL8qt8QF8OEja9OxzoHC6OPGSTPUNvq7z4d9SLHkmQNlcbN7dv8lbTyFwiaHdN4ENcaRbziaSwwvPluZe5pE4Lq6g/640?wx_fmt=png&from=appmsg "")  
### 2026-03-25  
  
安全社区 2Libra 平台用户Path  
率先对外发布漏洞预警，公开披露 Apifox 桌面客户端遭遇供应链投毒事件，相关细节开始在安全圈快速传播。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yg4FVwamkuWDjEic82RGQEE5aHjOGUkXmW6taYvAYuDlEzEiaicyks15vAkZQUqt0XpuEakBuex4d2ggbyiahPZQnP29G8FochBmdsM417dH9tc/640?wx_fmt=png&from=appmsg "")  
### 2026-03-25 晚10点  
  
Apifox 官方正式发布公告《关于 Apifox 公网 SaaS 版外部 JS 文件受篡改的风险提示与升级公告》，承认事件并给出客户端升级、凭证重置等应急处置方案。apifox-app-event-tracking.min.js  
被更换回正常 34KB 文件，至此投毒结束  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Yg4FVwamkuV4w6VmTu9rGdf9KzJk587puwnjrJy4eJMXC22bCEAwQFrpZiakhAEjPz3wPbHUOgfRUmw0yCAd6gSuN2aXCykKfM2QZftfuRuY/640?wx_fmt=png&from=appmsg "")  
## 事件分析  
  
本次Apifox投毒事件属于典型的**Electron应用供应链劫持攻击**  
，攻击者通过篡改官方CDN上的埋点脚本apifox-app-event-tracking.min.js  
，注入经过多层混淆的恶意代码，利用客户端未启用沙箱、渲染进程可直接调用Node.js接口的缺陷，在用户无感知情况下读取本地~/.ssh/  
、~/.git-credentials  
、Shell历史记录等敏感凭证文件，并将数据加密后外传到C2服务器apifox.it.com  
；恶意脚本具备动态拉取后续载荷能力，可实现文件遍历、信息窃取甚至远程代码执行，攻击从3月4日持续至3月22日，大量使用公网 SaaS 版 Apifox 桌面客户端用户遭受影响。  
## 影响范围  
  
受影响用户为**SaaS 版 Apifox 桌面客户端**  
用户。SaaS Web 版用户不受影响；私有化部署版用户不受影响。  
  
感染窗口期为**2026年3月4日至2026年3月22日**  
，在此期间使用了公网 SaaS 版 Apifox 桌面客户端，可能存在敏感信息泄露风险。  
## 处置建议  
- 请尽快将 Apifox 客户端升级至 **2.8.19 及以上最新版本**  
。  
  
- 安全重置：若你曾在受影响版本的风险期间使用过客户端，请及时同步团队，全面检查并重置设备中以下路径存储的敏感凭证：~/.ssh/  
、~/.zsh_history  
、~/.bash_history  
、~/.git-credentials  
 等，包括但不限于SSH密钥、Git 密钥、鉴权密钥、数据库密码、云服务 AccessKey、环境变量等信息。  
  
- 恶意域名拦截：apifox.it.com  
；建议在 hosts 文件中添加配置，阻断恶意域名 apifox.it.com  
  
## 参考文献  
  
https://2libra.com/post/network-security/8HvXoR_  
  
https://rce.moe/2026/03/25/apifox-supply-chain-attack-analysis/  
  
https://www.leavesongs.com/PENETRATION/apifox-supply-chain-attack-analysis.html  
  
https://docs.apifox.com/8392582m0  
> ❝  
> 大连银河哈希安全技术科技有限公司成立于2022年，公司初创团队源于国内知名战队ChaMd5安全团队组建，曾获2023年大连市“连盾”演练第二名及各地市优秀攻击队，并获得多地网信办、经侦支队及应急保障中心感谢信，也服务多家CTF厂商举办赛事。  
> ❞  
  
  
