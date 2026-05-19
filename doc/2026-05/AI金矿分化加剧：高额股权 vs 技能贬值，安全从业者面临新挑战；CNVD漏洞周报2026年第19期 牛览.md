#  AI金矿分化加剧：高额股权 vs 技能贬值，安全从业者面临新挑战；CNVD漏洞周报2026年第19期| 牛览  
 安全牛   2026-05-19 04:17  
  
**点击蓝字 关注我们**  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/wKeDC5RjIzEWymzICmbTyMwJQ2FAtPbKqmLdUe8UDexLaH0Iib61Q66sFDSfwp7XLJ4c98vfkEqz0hCxvW2qkefY5drgqRk0WBvvVrsOzWmc/640?wx_fmt=png&from=appmsg "")  
  
  
新闻速览  
  
  
- CNVD漏洞周报2026年第19期  
  
  
- AI金矿分化加剧：高额股权 vs 技能贬值，安全从业者面临新挑战  
  
  
- 纽约医疗系统遭网络攻击，超 180 万患者医疗数据泄露  
  
  
- CNVD发布上周关注度较高的产品安全漏洞  
  
  
- 电商售后遭AI伪造证据冲击，AI内容鉴定成商家维权新工具  
  
  
- CISA供应链安全再敲警钟：GovCloud凭据公开暴露数月  
  
  
- 美国超2.5亿条个人数据疑遭暗网泄露，信用与收入信息成高风险字段  
  
  
- Lyrie开源自治渗透测试代理发布，AI驱动七阶段攻防流程  
  
  
- 钓鱼团伙采用JavaScript VM规避检测：AiTM+MFA拦截技术加速演进  
  
  
- 勒索软件团伙遭反噬：运营与附属管理细节揭秘  
  
  
  
  
特别关注  
  
  
**CNVD漏洞周报2026年第19期**  
  
2026 年 5 月 11 日至 17 日，CNVD 第 19 期共收录漏洞 501 个，整体威胁评级为中，其中高危漏洞 279 个，零日漏洞 411 个（占 82%），党政机关及企事业单位相关漏洞环比增 12%。  
  
  
漏洞分布集中，Web 应用 235 个、应用程序 164 个、网络设备 55 个。厂商方面，Microsoft、Adobe、Mozilla、Google 等产品漏洞突出，均为高危级别。  
  
  
Microsoft 多款产品存权限提升、代码执行漏洞；Adobe Framemaker 曝出堆溢出、越界读写等漏洞，可远程执行代码；Mozilla Firefox 等因 WebRTC、Graphics 组件缺陷，存在代码执行与崩溃风险；Google Chrome 现缓冲区溢出漏洞，可致沙箱逃逸。此外，Tenda F456 路由存栈溢出漏洞，远程可触发攻击。  
  
  
目前多数厂商已发布补丁，CNVD 提醒用户及时更新，防范漏洞攻击。  
  
  
原文链接：  
  
https://www.cnvd.org.cn/webinfo/show/12401  
  
  
**CNVD发布上周关注度较高的产品安全漏洞**  
  
近期，国家信息安全漏洞库（CNVD）收录多起国内外厂商产品高危漏洞，涉及办公软件、浏览器、操作系统、工业设备及家用路由，威胁覆盖代码执行、权限提升、拒绝服务等。  
  
  
境外产品方面，Adobe Framemaker 先后曝出堆缓冲区溢出（CNVD-2026-19998）与越界读取漏洞（CNVD-2026-19997），均允许攻击者执行任意代码。Mozilla 多款产品存两漏洞，Graphics 组件边界错误致浏览器崩溃（CNVD-2026-19984），WebRTC:Signaling 组件未定义行为可远程执行代码（CNVD-2026-19983）。Microsoft Windows SSDP 存在权限提升漏洞（CNVD-2026-20180）。  
  
  
境内产品隐患集中，Huawei HarmonyOS 通信模块现两起内存错误引用漏洞（CNVD-2026-20004、20003），影响系统可用性。Delta Electronics DVP-12SE11T 输入验证不当，可引发拒绝服务（CNVD-2026-20005）。D-Link M60 路由弱密码恢复漏洞，威胁数据机密性、完整性（CNVD-2026-19966）。Tenda F456 路由栈缓冲区溢出漏洞，远程恶意数据可触发溢出（CNVD-2026-19971）。  
  
  
原文链接：  
  
https://www.cnvd.org.cn/webinfo/show/12406  
  
  
  
热点观察  
  
  
**电商售后遭AI伪造证据冲击，AI内容鉴定成商家维权新工具**  
  
“有图有真相”的电商售后逻辑正被AI生成内容改写。近期，多名商家反映，部分买家利用AI伪造“问题商品”图片，申请“仅退款”，将正常维权流程异化为套利工具。河北种植户张先生曾售出12单无花果苗后收到退款申请，对方提供的枯黄果苗图与植物失水规律不符，但平台仍在数分钟内批准“仅退款”。  
  
  
类似案例已扩展至多类商品，包括衣架断裂图、杯身裂痕图、商品发霉或破损图等。有商家上传疑似图片后，AI检测工具给出“92%概率AI生成”的判断，部分图片甚至带有“豆包生成”水印。  
  
  
应对这一趋势，国家反诈中心App已于今年3月上线AI内容鉴定功能，支持对图像、视频、文本和音频进行AI识别检测，覆盖30KB至5MB图片、10分钟以内人声音频等常用格式。蚂蚁安全内容视觉算法负责人兰钧介绍，主流AI鉴真通常结合小模型和大模型：前者学习AI生成内容的模式特征，后者识别物理瑕疵、文字乱码和语义逻辑异常。对中小商家而言，这类工具可降低初步鉴别成本，并为平台申诉和维权提供技术证据。  
  
  
原文链接：  
  
https://www.ithome.com/0/951/422.htm  
  
  
**勒索软件团伙遭反噬：运营与附属管理细节揭秘**  
  
2026年5月，勒索软件团伙The Gentlemen内部系统遭受入侵，其后端基础设施、附属成员活动、受害者管理和运营工具等关键信息被曝光。Check Point Research（CPR）研究人员借此获得对该RaaS（Ransomware-as-a-Service）团伙运作的罕见洞察。  
  
  
The Gentlemen于2025年首次出现，采用RaaS模式运营，主运营商提供勒索软件平台，附属成员负责实施攻击并分享赎金。该团伙向附属成员提供高达90%的收入分成，这一慷慨比例有效吸引了经验丰富的网络犯罪分子。攻击重点在于实际执行，而非炫技：主要针对暴露在互联网上的系统，入侵后禁用安全工具，随后加密Windows、Linux、NAS和ESXi环境。研究人员还观察到与该团伙关联的SystemBC恶意软件，用于持久化、远程访问和流量隧道。  
  
  
泄露数据包括受害者跟踪系统、附属管理渠道及内部聊天记录。附属成员在私密频道讨论凭证滥用、EDR-killer工具、Fortinet和Cisco访问以及NTLM中继等技术。暴露的受害者数量远超其暗网泄露站点公开数据，CPR识别出超过1570个潜在受害者，覆盖多个行业和地区。  
  
  
尽管遭受内部泄露，The Gentlemen并未放缓脚步。5月16日，其成为BreachForums新版本的官方合作伙伴，并在暗网站点展示相关横幅，继续发布受害者公告和勒索信息。这凸显了勒索软件生态的韧性，但也暴露了内部安全薄弱环节，如附属纠纷、基础设施防护不足和运营失误，为研究人员和执法部门提供了情报收集机会。  
  
  
对网络安全从业者而言，此事件提醒企业需强化互联网暴露面防护、EDR解决方案及多层防御策略，同时关注RaaS团伙的内部动态以提前预警潜在威胁。  
  
  
原文链接：  
  
https://hackread.com/the-gentlemen-ransomware-gang-breach-op-exposed/  
  
  
  
安全事件  
  
  
**纽约医疗系统遭网络攻击，超 180 万患者医疗数据泄露**  
  
近日，美国纽约市公立医院系统 NYC Health Hospitals 披露一起严重网络安全事件，黑客通过入侵系统窃取大量医疗数据，受影响人数至少 180 万。  
  
  
事件源于针对性网络攻击，攻击者非法侵入医院信息系统，未经授权获取患者个人信息与医疗记录，包括身份信息、诊疗记录、病史等敏感数据。此类数据泄露可被用于诈骗、勒索或黑市交易，严重威胁患者隐私与身份安全。  
  
  
NYC Health Hospitals 已确认事件属实并启动内部调查，同时通知受影响患者、上报监管机构，并加强系统安全防护。医疗行业因数据价值高、系统复杂、防护薄弱，长期为网络攻击重点目标。此次事件再次警示，医疗机构需强化网络安全治理，完善数据加密、访问控制与威胁监测机制，防范同类攻击。  
  
  
原文链接：  
  
https://www.cybersecurity-review.com/nyc-health-hospitals-says-hackers-stole-medical-data-affecting-at-least-1-8m-people/  
  
  
**CISA供应链安全再敲警钟：GovCloud凭据公开暴露数月**  
  
美国CISA一起高敏感凭据泄露事件引发关注。GitGuardian研究员Guillaume Valadon于5月15日发现，一个名为“Private-CISA”的公开GitHub仓库暴露了大量CISA/DHS内部资产，包括AWS GovCloud密钥、tokens、明文密码、日志和内部系统文件。该仓库由政府承包商Nightwing一名员工维护，疑似被当作跨设备同步或临时工作区使用。  
  
  
安全公司Seralys创始人Philippe Caturegli验证发现，泄露凭据可认证至3个AWS GovCloud账户，且具备高权限。仓库中还包含“importantAWStokens”和“AWS-Workspace-Firefox-Passwords.csv”等文件，后者列出数十个CISA内部系统的用户名和密码，其中包括疑似“Landing Zone DevSecOps”的LZ-DSO环境，以及内部artifactory代码包仓库。攻击者若获取这类访问权限，可能借软件包投毒实现横向移动和持久化。  
  
  
更严重的是，相关GitHub提交记录显示，该账号曾禁用GitHub默认的secret scanning阻断机制，使SSH keys等敏感信息得以公开提交。仓库在KrebsOnSecurity和Seralys通知CISA后下线，但部分AWS密钥仍继续有效约48小时。CISA回应称正在调查，目前没有迹象显示敏感数据因此被破坏，并将部署额外防护措施。该事件凸显政府机构在第三方承包商管理、云凭据轮换、secret scanning和最小权限控制上的系统性风险。  
  
  
原文链接：  
  
https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/  
  
  
**美国超2.5亿条个人数据疑遭暗网泄露，信用与收入信息成高风险字段**  
  
近日，一起涉及美国的大规模数据泄露事件在暗网曝光。根据公开信息，泄露数据规模超过2.5亿条，内容覆盖姓名、电话号码、电子邮件地址、出生日期、婚姻状况、性别等基础身份信息，同时还包括家庭住址、邮政编码、地理位置、房屋成本、租金、房屋建造年份等居住类数据。  
  
  
更值得关注的是，泄露字段还涉及信用能力、政治倾向、工资、收入详情、拥有车辆数量、家庭子女数量以及宠物数量等高度敏感信息。这类数据不只是单一身份标识，已经接近完整的个人画像，一旦被黑产利用，可能被用于精准诈骗、社会工程攻击、身份冒用、信用欺诈和定向钓鱼。  
  
  
从安全角度看，本次事件的风险不在于单个字段泄露，而在于多维数据被集中关联。攻击者可通过姓名、联系方式和住址建立基础身份映射，再结合收入、信用、家庭结构和政治倾向等信息，对目标进行分层筛选和定制化攻击。对于企业和安全团队而言，此类事件也提醒数据治理需要覆盖采集、存储、访问控制、脱敏和外泄监测等全链路环节，避免高价值个人数据长期集中暴露。  
  
  
原文链接：  
  
https://cn-sec.com/archives/5243948.html  
  
  
  
安全攻防  
  
  
**钓鱼团伙采用JavaScript VM规避检测：AiTM+MFA拦截技术加速演进**  
  
知名钓鱼即服务（PhaaS）组织FlowerStorm开始使用浏览器端JavaScript虚拟机KrakVM来隐藏凭证窃取代码，这是研究人员观察到的钓鱼工具包复杂性升级，可能让传统邮件安全和静态分析工具更难检测。  
  
  
Sublime Security研究人员于4月发现该活动：攻击者通过伪装成语音邮件通知、发票或供应商沟通的HTML附件发送钓鱼邮件。打开后，嵌入的JavaScript利用KrakVM将恶意代码编译为加密字节码，在浏览器内通过虚拟机解释执行，实现多层混淆，规避静态检测。  
  
  
该攻击针对Microsoft 365、Hotmail和GoDaddy等服务的凭证及多因素认证（MFA）代码，支持实时adversary-in-the-middle（AiTM）拦截技术，能动态适应受害者环境、伪造登录门户、预加载邮箱地址并枚举MFA方式（包括Authenticator推送、TOTP、SMS等）。凭证和MFA响应被转发至C2服务器，完成会话劫持。  
  
  
FlowerStorm以高级AiTM和MFA拦截能力著称，此次在KrakVM开源后一个月内快速采用，凸显钓鱼生态正引入传统恶意软件的虚拟化执行和分层混淆技术。研究人员发布了153个IoC，目标行业涵盖地方政府、物流、零售等。默认配置即可运行，意味着该技术易于在钓鱼团伙中扩散。  
  
  
对网络安全从业者而言，这提醒需加强HTML附件行为分析、动态沙箱检测和MFA强化策略，以应对日益演化的钓鱼威胁。  
  
  
原文链接：  
  
https://www.csoonline.com/article/4171221/flowerstorm-phishing-gang-adopts-virtual-machine-obfuscation-to-evade-email-defenses.html  
  
  
  
产业动态  
  
  
**AI金矿分化加剧：高额股权 vs 技能贬值，安全从业者面临新挑战**  
  
Menlo Ventures合伙人Deedy Das近日在社交媒体上发长帖，指出当前AI热潮下旧金山科技圈氛围紧张，成果分化达到前所未有的程度。过去5年，约1万名OpenAI、Anthropic、Nvidia、xAI等公司创始人及核心员工，通过股权等实现了远超2000万美元的“退休财富”，而多数从业者即使拿着低于50万美元年薪的工作，也难以企及类似水平。  
  
  
文章提到，尽管AI技术迅猛发展，但行业内裁员潮仍在持续，许多软件工程师感到自身技能迅速贬值，对职业路径产生困惑，并出现对工作未来的深层倦怠。这种“赢家通吃”的局面，让AI既成为少数人的“彩票”，又成为多数人职业安全的威胁。  
  
  
帖文引发X平台讨论，有人认为多数科技从业者已足够幸运，应选择积极心态；也有人指出，本轮周期独特之处在于同一技术同时扮演财富创造者和传统岗位破坏者的双重角色。  
  
  
作为网络安全从业者，需特别关注这一分化对行业的影响：核心AI企业掌握强大算力和数据资源，可能在安全防御与攻击能力上形成不对称优势，而广大从业者则面临技能迭代压力。如何在AI时代快速掌握相关安全技术、参与高价值项目，或成为应对分化的关键。  
  
  
原文链接：  
  
https://techcrunch.com/2026/05/16/the-haves-and-have-nots-of-the-ai-gold-rush/  
  
  
  
新品发布  
  
  
**Lyrie开源自治渗透测试代理发布，AI驱动七阶段攻防流程**  
  
5月18日，据Help Net Security报道，OTT Cybersecurity推出开源自治安全代理Lyrie，试图将传统需要数周人工投入的渗透测试流程，压缩为可通过命令行执行的自动化工具。该项目本月已升级至3.1.0版本，新增XChaCha20-Poly1305内存加密，用于保护敏感威胁数据；同时加入7类PoC生成器，覆盖prompt injection、auth bypass、CSRF、open redirect、race condition、secret exposure和cross-site execution等场景，并新增Rust分析、taint engine处理和AI-driven code review三类深度扫描器。  
  
  
Lyrie由两个可安装组件组成：lyrie-omega是面向扫描、渗透测试和red-teaming的Python CLI，@lyrie/atp是基于TypeScript和Node.js的SDK，用于实现Agent Trust Protocol。其核心命令lyrie hack可对 live URLs和本地源码树执行侦察、指纹识别、扫描、利用、PoC生成和报告输出等流程，并以SARIF格式输出结果，便于接入GitHub Code Scanning。AI红队模块支持针对LLM endpoint的5种攻击策略，其中gradient-based suffix attacks需要H200 GPU基础设施。  
  
  
值得关注的是，Agent Trust Protocol试图解决AI agent在运行时身份验证和授权范围声明问题。该协议使用Ed25519签名，支持delegation chains、revocation lists和multisig配置，便于系统实时确认agent身份、授权范围及权限是否被撤销。该规范目前已有143项通过测试，并计划提交给IETF。  
  
  
原文链接：  
  
https://www.helpnetsecurity.com/2026/05/18/lyrie-ai-autonomous-pentesting-agent/  
  
  
  
  
  
  
**联系我们**  
  
合作电话：18610811242  
  
合作微信：aqniu001  
  
联系邮箱：bd@aqniu.com  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wKeDC5RjIzFLHSLkywjuB8830GGEhP7TeFJgpX2O34NcDgOibSjtWytLA5cRj357zvEQKlfQeBZ34XUW2siclcrxicXjHzzfgWvicLLkysicicd98/640?wx_fmt=gif&from=appmsg "")  
  
  
