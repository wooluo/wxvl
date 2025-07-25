#  AI开发框架成黑客新“肉鸡”：Langflow高危漏洞被利用组建DDoS僵尸网络  
原创 Hankzheng  技术修道场   2025-06-24 00:01  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/wWBwsDOJT497T8Txzu0wCJzDx7eia2obUWRxsb0aJISW0pJmn4gD2bZiakvajlniaUaUibrH4SEVXibdJbibfxjf01wg/640?wx_fmt=png&from=appmsg "")  
  
在AI技术一日千里的“大模型淘金热”中，开发者们正以前所未有的速度构建和部署AI应用。然而，这股热潮的背后，是正在被迅速累积的“安全技术债”。近日，针对AI应用构建框架**Langflow**  
的一个攻击活动，就为我们敲响了警钟：为追求快速迭代而忽视基础安全设计的新兴AI工具，正成为传统网络犯罪分子眼中最肥沃的“肉鸡”温床。  
## 致命根源：为“易用”而牺牲“安全”  
  
此次攻击的突破口，是Langflow中一个CVSS评分高达**9.8**  
的远程代码执行漏洞（**CVE-2025-3248**  
）。其根源并非某种高深莫测的攻击技巧，而是一个在安全开发领域被反复强调却仍被忽视的基础性缺陷：**平台未能对用户的输入进行有效的验证或实现沙箱化运行。**  
  
简而言之，Langflow这个AI应用的“加工厂”，缺少了最基本的“安全检查”流程。这使得攻击者可以轻易地将恶意代码伪装成正常的HTTP请求，而服务器会全盘接受并执行，最终导致了无需任何身份验证的远程代码执行。早在5月份，包括SANS研究所在内的机构就已通过其**蜜罐系统**  
捕获到针对此漏洞的在野利用尝试。  
## 攻击链升级：Flodrix僵尸网络的“精准捕猎”  
  
如今，攻击者已不再满足于简单的漏洞验证。他们利用公开的PoC代码，在全网扫描暴露在公网且未打补丁（1.3.0版本之前）的Langflow服务器，并精准地植入一个名为**Flodrix**  
的新型僵尸网络程序。根据趋势科技的追踪，其恶意软件的下载源指向了IP地址 80.66.75[.]121:25565  
。  
> Flodrix：一个更狡猾的DDoS平台  
> 作为与**Moobot组织**  
相关的LeetHozer僵尸网络的“进化版”，Flodrix在隐匿性和对抗性上都显著增强：  
> 强化的隐匿性通过加密DDoS攻击指令和C2通信，有效规避基于流量特征的传统IDS/IPS系统；同时具备自我移除功能，极大地增加了事后取证的难度。增强的环境感知通过枚举系统的/proc目录来收集运行进程信息，使其能更好地“了解”自己所处的环境，为后续躲避安全软件或进行更精准的攻击做准备。  
  
## 商业风险：当你的AI服务器成为“帮凶”  
  
对于一家企业而言，其AI开发服务器被感染并成为DDoS僵尸网络的一员，绝非“贡献一点带宽”那么简单，其背后是切实的商业风险：  
- **品牌与声誉损害**  
一旦被安全社区曝光，企业的品牌形象和技术实力将受到严重质疑。  
  
- **意外的财务成本**  
发动DDoS攻击会消耗巨量的出向带宽，可能导致企业面临意想不到的高额云服务账单。  
  
- **持久化的内部威胁**  
最大的风险在于，即便修复了Langflow的漏洞，谁也无法保证攻击者在控制服务器期间，没有植入其他更隐蔽的后门。这台服务器的信任基础已然崩塌。  
  
## DDoS只是前奏？攻击者或在“放长线，钓大鱼”  
  
趋势科技的研究人员提出了一个更具战略性的警告：当前的DDoS攻击，可能仅仅是攻击者的**“火力侦察”**  
。他们利用此次机会，可能正在对全球所有易受攻击的AI开发服务器进行**画像和分类**  
。那些部署在大型企业、拥有高价值商业数据或强大GPU算力的“高价值目标”一旦被识别，未来可能面临的将是AI模型被窃、训练数据被污染、甚至企业核心算力被用于加密货币“挖矿”等更致命的打击。  
## 行动指南：三步走，拆除AI基础设施“定时炸弹”  
1. **紧急响应**  
立即将所有暴露在公网的Langflow实例升级至**1.3.0或更高版本**  
。这是切断攻击入口最直接的手段。  
  
1. **事后检查与清理**  
1. 对已确认或疑似被攻击的服务器进行隔离，检查是否存在指向恶意IP（如上文提及）的异常网络连接。  
  
1. 审查系统日志和进程列表（特别是对/proc  
目录的异常访问），寻找未知或可疑的脚本和二进制文件。  
  
1. 在无法完全确认系统干净的情况下，应考虑重装系统并从可信备份中恢复。  
  
1. **长期战略加固**  
1. AI开发者和团队在选择开源框架和工具时，必须将其**安全记录和设计**  
（如是否默认开启沙箱、是否有输入验证）作为核心考量因素。  
  
1. 将所有AI相关的基础设施纳入企业的整体安全监控和漏洞管理范围，不能让其成为被遗忘的“影子IT”。  
  
AI的浪潮势不可挡，但只有建立在坚实的安全地基之上，智能化的未来才能行稳致远。  
  
