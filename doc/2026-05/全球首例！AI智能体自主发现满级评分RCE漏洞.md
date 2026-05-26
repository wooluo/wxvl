#  全球首例！AI智能体自主发现满级评分RCE漏洞  
 内生安全联盟   2026-01-03 03:00  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/jRRfTC292pWEia2nV2bK2qxsB36VBlls8t6sTiavOZfB3Ay6Zc7zBXBkO6jOu6moLrDbayCnGUSFDepbIfzxntLA/640?wx_fmt=gif&from=appmsg "")  
  
近日，网络安全机构pwn.ai披露了编号为CVE-2025-54322的漏洞。该漏洞不仅以CVSS10分满分评级跻身**顶级风险**  
行列，更重要的是，其发现过程本身具有里程碑意义——这是**全球首例由自治AI智能体独立发现并公开的可远程利用零日远程代码执行（RCE）漏洞。**  
  
这一事件标志着AI在网络安全领域的角色，正从“辅助分析工具”迈入“自主漏洞发现者”的新阶段，也预示着网络攻防格局正在发生深刻变化。  
  
01  
  
**AI不再只是工具，而是“猎手”**  
  
根据公开信息，此次漏洞并非由传统安全研究员或规则驱动的扫描器发现，而是由一组**自治运行的AI智能体**  
完成。  
  
与以往自动化扫描工具依赖人工设定规则、手动分析结果不同，这些AI智能体实现了从目标理解到攻击路径构建的**全流程自主化**  
：在几乎没有人工干预的情况下，完成了设备固件仿真、攻击面识别，并最终成功设计出可利用的入侵路径。  
  
研究人员为智能体设定的指令极为简单，仅要求其**“仿真目标设备并尝试获取未授权控制权”**  
，但系统在短时间内便精准定位到核心突破口，并验证了完整的攻击链路。  
  
业内普遍认为，这种能力已经超越了传统意义上的“自动化漏洞扫描”，更接近于具备策略规划与自主探索能力的“攻击型智能体”。  
  
02  
  
**满分RCE漏洞，攻击门槛极低**  
  
从技术层面看，该漏洞属于预认证远程代码执行漏洞，攻击者无需任何登录凭据，即可直接对设备执行任意系统命令。  
  
公开的技术分析显示，攻击者仅需构造特定HTTP请求头，通过绕过设备内置的Web中间件安全校验，便可实现远程控制。整个利用过程不涉及复杂条件判断或多阶段链路，**攻击门槛极低**  
，但危害范围极大。  
  
更值得警惕的是，这类设备通常部署在企业分支机构、远程办公节点、工业网络边缘环境等关键位置，是企业网络连接的重要枢纽。一旦被攻破，极有可能成为横向渗透和内网扩散的入口，进而引发连锁安全风险。  
  
03  
  
**数万设备暴露公网，漏洞尚无补丁**  
  
从影响范围看，问题同样不容乐观。网络空间测绘平台的数据显示，全球范围内仍有数万台相关设备直接暴露在公网，覆盖多个地区和行业，形成了庞大的**潜在攻击面**  
。  
  
而在漏洞处置层面，该漏洞尚无官方补丁发布。披露方在技术文档中提到，其曾在较长时间内尝试通过负责任披露方式与相关厂商沟通，但始终未获得有效反馈，这也成为其最终选择公开漏洞信息的重要原因。  
  
在AI加速漏洞发现效率的背景下，厂商响应迟缓所带来的风险，被进一步放大。  
  
04  
  
**AI 驱动漏洞挖掘，正在成为趋势**  
  
事实上，AI参与漏洞挖掘早已不是新鲜话题，但此次事件的特殊之处在于——AI首次以“主导者”身份完成了从发现到验证的全过程。  
  
长期以来，漏洞挖掘高度依赖安全研究员的经验积累，即便引入自动化工具，也需要人工制定策略、筛选结果。而具备自主探索能力的AI智能体，则可能推动漏洞发现从“手工艺式”作业，转向更高效率的**“工程化”甚至“规模化”生产**  
。  
  
这一趋势在国内同样有所体现。近年来，多家企业和研究机构已开始探索AI在零日漏洞挖掘、二进制安全分析等领域的应用，通过深度学习与智能推理技术，提升漏洞发现效率、降低误报率。业内普遍认为，AI智能体的引入，将显著改变未来网络安全攻防的节奏。  
  
但与此同时，零日漏洞的“发现—利用”**周期被极大压缩**  
，也可能加剧攻防对抗的烈度，对安全治理提出更高要求。  
  
05  
  
多家安全机构发布风险提示  
  
在漏洞尚未修复的情况下，多家国内安全机构已发布风险提示，建议相关用户立即采取临时防护措施，包括：  
- 隔离关键网络设备，避免直接暴露公网；  
  
- 启用 Web 应用防火墙，对异常 HTTP 请求进行拦截；  
  
- 加强日志审计与访问监控，及时发现异常行为；  
  
- 梳理自身网络资产，排查边缘设备暴露情况。  
  
从更长远看，此次事件为企业敲响了双重警钟：一方面，随着 AI 漏洞挖掘能力不断提升，产品安全短板将更难被掩盖；另一方面，企业自身对网络资产、边缘节点的安全管理能力，将直接决定风险暴露程度。  
  
网络安全专家指出，  
AI 时代的安全防护，不能只依赖“补漏洞”，而需要构建“智能防御 + 规范治理”的双重体系。  
  
厂商需要将智能化安全检测纳入产品研发与测试流程，提升漏洞响应速度；监管层面则需完善漏洞协同处置与披露机制；而企业用户，也应建立常态化的资产排查与风险评估能力。  
  
当 AI 成为发现漏洞的“加速器”，唯有多方协同，才能确保技术进步不会反噬网络安全本身。  
  
消息来源：pwn.ai  
  
  
转载自：安全客  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/jRRfTC292pWeAYKXsf7pB3M1GTJoicVOO9oITecrZeNtxqmmALz8LHQosj13WV1mOhJpslTDgADLuLUGWOjCIxQ/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
  
  —  热点文章  
  —    
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/LGic9LOngPZibPeawxIlysHAL4BBibOkwlGdzuDGfYd1HU8Cslrpx337MkOIW1noc32zFookqPCxxiao7b57bB5y5Q/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=22 "")  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535092&idx=1&sn=eb246a0566f3e6dfe2811641fe9d3f25&scene=21#wechat_redirect)  
  
[邬江兴院士——携手建设人工智能时代中国学派 走出不同于西方的人工智能安全治理新路径](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535092&idx=1&sn=eb246a0566f3e6dfe2811641fe9d3f25&scene=21#wechat_redirect)  
  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535009&idx=2&sn=26573ffb694a62e9047843e525a5a611&scene=21#wechat_redirect)  
  
[第五届网络空间内生安全学术大会发布“AI+生态构建八大安全挑战”](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535009&idx=2&sn=26573ffb694a62e9047843e525a5a611&scene=21#wechat_redirect)  
  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534952&idx=1&sn=1dab8c88e16d889c2da453f7d8f8dd48&scene=21#wechat_redirect)  
  
[第五届网络空间内生安全学术大会在宁开幕——聚焦AI安全可信应用  为“AI+”产业保驾护航](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534952&idx=1&sn=1dab8c88e16d889c2da453f7d8f8dd48&scene=21#wechat_redirect)  
  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534994&idx=1&sn=a35dc208810295861b94d6af88c2c7e8&scene=21#wechat_redirect)  
  
[持续赋能内生安全！第五届网络空间内生安全学术大会暨第八届“强网”拟态防御国际精英挑战赛完美收官](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534994&idx=1&sn=a35dc208810295861b94d6af88c2c7e8&scene=21#wechat_redirect)  
  
  
[巅峰对决，硬核启幕！第八届“强网”拟态防御国际精英挑战赛正式打响](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534917&idx=1&sn=48fde53132e2c669ce1fdf83d7ff3fe8&scene=21#wechat_redirect)  
  
  
2025-11-26  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247534917&idx=1&sn=48fde53132e2c669ce1fdf83d7ff3fe8&scene=21#wechat_redirect)  
  
  
[第五届网络空间内生安全学术大会－数字生态供应链安全论坛成功举办](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535013&idx=1&sn=b01b8b5ae3b2216ba396a30395a6e260&scene=21#wechat_redirect)  
  
  
2025-12-01  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535013&idx=1&sn=b01b8b5ae3b2216ba396a30395a6e260&scene=21#wechat_redirect)  
  
  
[南京紫金山实验室6G安全技术研究斩获新突破](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535009&idx=1&sn=8d20bc1104afd6d0c6590fbc4ea99de3&scene=21#wechat_redirect)  
  
  
2025-11-30  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535009&idx=1&sn=8d20bc1104afd6d0c6590fbc4ea99de3&scene=21#wechat_redirect)  
  
  
[蓝皮书下载 | 第五届网络空间内生安全学术大会，四本蓝皮书重磅发布](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535240&idx=2&sn=da33dc8d3ad64e3c161538e0d3a14494&scene=21#wechat_redirect)  
  
  
2025-12-05  
[](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535240&idx=2&sn=da33dc8d3ad64e3c161538e0d3a14494&scene=21#wechat_redirect)  
  
  
  
**热点聚焦**  
  
**HOT！！**  
  
**邬江兴院士：AI内生安全问题及可信应用系统研究**  
  
**征稿启事 | 16个热点问题，欢迎来稿！**  
  
**新书出版 | 邬江兴院士发布最新英文著作**  
  
**可信内生安全、变结构拟态计算技术等入选“新一代信息工程科技新质生产力技术备选清单（2024）”**  
  
**迎接网络韧性新时代！第四届网络空间内生安全学术大会暨第七届“强网”拟态防御国际精英挑战赛完美收官**  
  
**蓝皮书下载 | 第四届网络空间内生安全学术大会，五本蓝皮书重磅发布**  
  
**正式发布！网络空间内生安全理论和标准体系入选信息通信领域十大科技进展（附手册）**  
  
**递交2025网信生态高质量发展“开年答卷”  网络通信安全融合生态创新发展大会在宁举行**  
  
**邬江兴院士为五色石先导班学生授课**  
  
**邬江兴院士——AI时代内生安全自主知识体系建设的思考**  
  
**出版啦！南京市网络空间内生安全协会5项团体标准在中国标准出版社正式出版**  
  
**邬江兴院士 | 破击美欧网络弹性铁幕——基于自主知识技术体系的数字生态系统底层驱动范式变革**  
  
**喜报！南京市网络空间内生安全协会获评为AAAA等级社会组织！**  
  
  
****  
****  
****  
****  
**重磅活动**  
  
****  
****  
****  
****  
  
****  
**征集令！“2025年网络空间内生安全优秀案例征集”活动正式启动！**  
  
**| 往期回顾**  
  
**AI4E如何重构数字生态系统网络发展范式？**  
  
**资料下载 | 十五五规划建议全文及说明**  
  
**尤佳莉, 邬江兴 | 多模态网络环境构建技术研究与发展**  
  
[邬江兴院士提出“时空协同复杂度”理论——揭秘介观尺度智能涌现机理引领AI架构革新](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535842&idx=1&sn=bf905ee97eb951d993e28c518e8adf67&scene=21#wechat_redirect)  
  
  
[AI入法、责任加码、治理精细化：2025年网络安全合规十大政策深度剖析](https://mp.weixin.qq.com/s?__biz=Mzg4MDU0NTQ4Mw==&mid=2247535863&idx=1&sn=d6d5d82185b1013aa775fff0ac7409e2&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/jRRfTC292pXGqHBACsK1cVtpyTB5F8VFsEY3paWnfS3dichupP4OknoSrNN3c6YviaDsLwKnfHwj1OibB7lWFvbibQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=1 "")  
  
