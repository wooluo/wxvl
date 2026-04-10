#  Mythos之后：漏洞挖掘从“找问题”走向“证明漏洞”  
原创 做安全的小明同学
                    做安全的小明同学  大山子雪人   2026-04-10 04:06  
  
   
  
# Mythos之后：漏洞挖掘从“找问题”走向“证明漏洞”  
## 1. 背景与目标  
  
  
Claude Mythos Preview[1]新型的通用大模型的出现，无疑是对计算机安全领域的一枚重磅炸弹。Anthropic 明确表示：这是一个“安全领域的分水岭时刻（watershed moment）  
”  
> 模型已经可以：  
> • 发现漏洞• 利用漏洞• 自动生成 exploit并且这些能力：• 远超以往模型• 接近甚至超过顶级人类安全研究员  
  
  
不是让一个大模型直接“判断有没有漏洞”，而是让多个 Agent 围绕“证据、假设、验证、闭环”持续推进，直到得到可复现、可解释、可报告的漏洞结果。  
  
结合Claude Mythos Preview的核心思想，打算对当前的漏洞挖掘多agent系统先做一次架构上的升级。  
  
当前在用的基于openclaw的多Agent漏洞挖掘框架已经具备较完整的能力：  
- • 以 vulnerability-researcher  
（百晓生）为中心控制器  
  
- • 以 sync_state.py  
 / session_manager.py  
 / states/  
 为状态驱动底座  
  
- • 以 experience_store.py  
 / knowledge/  
 / skills/experience-learning  
 为经验层  
  
- • 以 reverse-engineer  
、attack-surface-researcher  
、diff-expert  
、kernel-researcher  
、binder-hal-analyst  
、reachability-scorer  
 等为专家执行层  
  
下一阶段的关键，不再是继续增强单个 Agent 的局部能力，而是把整套系统升级为：  
1. 1. **可规模化搜索**  
：能同时覆盖更多入口、更多模块、更多 ROM / App / Patch 变体  
  
1. 2. **可验证收敛**  
：能把“可疑点”逐层升级为“可达”“可复现”“可定级”的高质量结果  
  
1. 3. **可优先级排序**  
：先把算力投入最可能出高价值漏洞的目标，而不是平均扫描  
  
1. 4. **可评测迭代**  
：有稳定 benchmark、成本模型、命中率指标，能持续优化 scaffold  
  
1. 5. **可知识闭环**  
：从发现、验证、误报、失败路径中持续提炼出下一轮搜索优势  
  
因此，Android 漏洞挖掘 2.0 的目标是：  
  
从“多专家协作的研究平台”演进为“面向 Android 系统与 App 漏洞挖掘的可并行、可验证、可评测的研究流水线”。  
## 2. 2.0 的核心设计思想  
### 2.1 从“对话型协作”转向“流水线型协作”  
  
2.0 不应依赖长对话记忆推动任务，而应依赖结构化状态和标准化产物驱动。  
  
每个子 Agent 的输出都应收敛为以下几类结构化对象：  
- • candidate  
  
- • entrypoint  
  
- • constraint  
  
- • evidence  
  
- • validation_result  
  
- • severity_assessment  
  
- • knowledge_artifact  
  
这样百晓生做的不是“理解每句话”，而是“消费状态变化并决定下一步”。当前虽然具备state的能力，但是不够完善。如在之前文章中介绍的  
  
[从流程到编排：Agent 系统的下一代设计范式](https://mp.weixin.qq.com/s?__biz=Mzg2MDc0NTIxOQ==&mid=2247484951&idx=1&sn=e212d5c8afca4916f1b7152a997f0716&scene=21#wechat_redirect)  
  
### 2.2 从“平均扫描”转向“先排序再深挖”  
  
虽然现在大模型能够对批量扫描结果有一个初步的排序和优先级建议。但是更倾向于大模型的“经验”，而非根据“事实”的打分结果。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VRdT0HGxjvDylTKMVxJxItLfSWGyZawndraubLHlDBW6UEPjpz7GZU7gRcZrRMLc1HlAgDuicKUxWZcwK2J3f5zburMqk5hRah8Hz03x8FwI/640?wx_fmt=png&from=appmsg "")  
  
需要完全依赖使用者的经验来做出决策。  
  
因此 2.0 必须把“候选目标评分”前移，在真正深挖前完成：  
- • 文件 / 类 / Service / Binder 接口评分  
  
- • 入口面优先级排序  
  
- • 变体候选热度排序  
  
- • 动态验证投入价值判断  
  
### 2.3 从“找到可疑点”转向“逐层升级证据”  
  
候选问题必须经过固定的升级流程：  
1. 1. 静态可疑（suspicious）  
  
1. 2. 攻击者可达（reachable）  
  
1. 3. 运行时可复现（reproducible）  
  
1. 4. 具有安全影响（impactful）  
  
1. 5. 可高质量报告（reportable）  
  
如果不能升级，就要明确卡在哪一层，而不是把所有候选都丢给人工。  
### 2.4 从“成功经验库”转向“研究记忆系统”  
  
知识库不能只存成功案例，也必须存：  
- • 常见误报模式  
  
- • 不可达路径模式  
  
- • 哪类验证方法成本高但收益低  
  
- • 哪类 patch / bulletin / ROM 分支最容易出现 drift  
  
- • 哪类 native / Binder / URI / WebView 模式命中率更高  
  
这会直接影响后续评分器与委派策略。  
## 3. 当前多agent系统的已有能力和缺点  
### 3.1 已有能力  
- • **领域化 Agent 已成型**  
：逆向、攻击面、Patch Diff、Kernel、Binder/HAL、Reachability、PoC、数据采集均已有对应角色  
  
- • **状态驱动已有基础**  
：sync_state.py  
、states/  
、pending_events.json  
 已能承载 run 级状态推进  
  
- • **经验沉淀已有基础设施**  
：知识库存储、索引、检索和规则生成功能已经存在  
  
- • **Android 执行工具链完善**  
：JEB、IDA、Frida、ADB、ROM unpack、动态采集等工具已接入  
  
- • **研究方法偏证据驱动**  
：AGENTS.md  
 中已明确要求 entry-first、follow-the-fallback、boolean polarity verification 等审计纪律  
  
### 3.2 主要缺口  
  
最值得补的不是更多工具，而是更强的“中层控制逻辑”：  
- • 缺少统一的 **目标评分器**  
  
- • 缺少统一的 **候选升级状态机**  
  
- • 缺少独立的 **严重性/真实性确认环节**  
  
- • 缺少面向 Android 的 **长期 benchmark 与成本度量**  
  
- • 缺少“补丁 -> 变体 -> 可达性 -> 验证”的标准流水线编排  
  
- • 缺少对失败路径和误报路径的系统化积累  
  
## 4. 2.0 目标架构  
  
2.0 的系统主流程固定为 7 个阶段：  
1. 1. **Surface Enumeration**  
：攻击面盘点  
  
1. 2. **Target Ranking**  
：目标评分与排序  
  
1. 3. **Hypothesis Generation**  
：漏洞假设生成  
  
1. 4. **Reachability & Policy Check**  
：可达性与权限/SELinux 边界判断  
  
1. 5. **Runtime Validation**  
：动态验证与复现  
  
1. 6. **Impact & Severity Review**  
：影响与严重性确认  
  
1. 7. **Distillation & Rule Export**  
：经验蒸馏与规则产出  
  
可用如下状态推进图描述：  
```
```  
  
这个流程的关键在于：  
- • 前期大范围并行  
  
- • 后期小范围深挖  
  
- • 每一层都能淘汰低价值候选  
  
- • 每一层的结果都能反哺评分器和经验库  
  
## 5. Agent 体系的 2.0 增量设计  
  
原则：**优先复用现有 Agent，只新增少量“中层控制型 Agent”。**  
### 5.1 保持现有核心 Agent 不变  
  
以下 Agent 继续作为 2.0 主干：  
- • 百晓生：总控编排  
  
- • 摘星手：攻击面盘点  
  
- • 洗髓经：静态逆向 / 代码理解  
  
- • 无情剑：Patch Diff / 变体入口  
  
- • 扫雷僧：Kernel 研究  
  
- • 天机枢：Binder / HAL 分析  
  
- • 铁算盘：可达性评分  
  
- • 顺风耳：运行时证据采集  
  
- • 神机笔：验证输入、测试载荷、最小复现实验设计  
  
- • 天算书生：知识蒸馏与经验检索  
  
### 5.2 新增 Agent A：Target Prioritizer（司南台）  
#### 5.2.1 职责  
  
在深挖之前，把目标对象按“值得投入程度”排序。  
#### 5.2.2 输入  
- • attack surface inventory  
  
- • 历史经验命中  
  
- • patch diff 信息  
  
- • 权限 / SELinux 边界信息  
  
- • 入口类型、解析复杂度、native 接触情况  
  
#### 5.2.3 输出  
- • target_score  
  
- • priority_reason  
  
- • recommended_next_agent  
  
- • estimated_validation_cost  
  
#### 5.2.4 推荐评分维度  
- • 外部输入可控度  
  
- • 权限边界穿越可能性  
  
- • 解析器复杂度  
  
- • native / JNI / Parcel 接触度  
  
- • 历史漏洞模式命中  
  
- • patch drift 风险  
  
- • 运行时验证成本  
  
### 5.3 新增 Agent B：Finding Reviewer（大理寺）  
#### 5.3.1 职责  
  
作为独立复核者，只回答两个问题：  
1. 1. 这个问题是否真实？  
  
1. 2. 这个问题是否值得继续投入？  
  
#### 5.3.2 作用  
  
避免系统因为“最初发现者的叙事惯性”而不断加码错误假设。  
#### 5.3.3 输入  
- • 结构化 evidence  
  
- • 可达性结果  
  
- • 运行时日志 / trace / crash  
  
- • 对照路径 / fallback 路径  
  
#### 5.3.4 输出  
- • review_status  
: confirmed / inconclusive / rejected  
  
- • severity_band  
: low / medium / high / critical  
  
- • missing_evidence  
  
- • review_notes  
  
### 5.4 新增 Agent C：Benchmark Curator（演武堂）  
#### 5.4.1 职责  
  
维护一套稳定的Android漏洞研究benchmark：  
- • 公开 CVE 回归集  
  
- • 已修补 AOSP patch 集  
  
- • 厂商系统 app 历史案例集  
  
- • 明确不可达的假阳性集  
  
- • 常见逻辑漏洞模式集  
  
#### 5.4.2 输出  
- • benchmark_runs  
  
- • precision/recall proxy  
  
- • avg_cost_per_confirmed_finding  
  
- • false_positive_clusters  
  
### 5.5 新增 Agent D：Patch Drift 巡检员（补天匠）  
#### 5.5.1 职责  
  
把 bulletin/upstream patch 转成 Android 生态下的变体挖掘任务：  
- • AOSP 主干与 release branch 差异  
  
- • GKI / vendor kernel 差异  
  
- • framework patch 是否同步到 priv-app / vendor service  
  
- • 安全修复是否只修了主路径而未修 fallback 路径  
  
#### 5.5.2 输出  
- • drift_targets  
  
- • variant_candidates  
  
- • unpatched_branches  
  
- • half_patched_patterns  
  
## 6. 2.0的状态模型升级  
  
当前 working_state  
 从“任务快照”升级为“研究对象图谱”。  
### 6.1 顶层 state 字段  
```
{  "goal":{},"task":{},"target_inventory":[],"scored_targets":[],"candidates":[],"validation_queue":[],"findings":[],"knowledge_feedback":[],"metrics":{}}
```  
### 6.2 candidate 结构  
```
{  "candidate_id":"cand_001","target":{    "module":"system_server",    "component":"SomeService",    "entry_type":"binder"},"hypothesis":{    "class":"permission_bypass",    "summary":"permission check may be skipped on fallback path"},"stage":"suspicious","confidence":0.46,"attacker_model":{    "actor":"third_party_app",    "required_capability":["send_binder_transaction"]},"guards":[],"constraints":[],"evidence":[],"assigned_agents":[],"next_actions":[]}
```  
### 6.3 验证阶段  
  
每个 candidate 固定使用如下阶段：  
- • suspicious  
  
- • reachable  
  
- • reproduced  
  
- • impact_assessed  
  
- • reportable  
  
- • rejected  
  
- • parked  
  
其中：  
- • parked  
 表示证据不足但值得保留  
  
- • rejected  
 表示已有足够证据证明路径不成立  
  
### 6.4 evidence 对象建议标准化  
  
每条关键证据都应可回溯：  
```
{  "type":"code_trace","source":"reverse-engineer","artifact":"frameworks/base/.../FooService.java","claim":"fallback path omits permission enforcement","confidence":0.72,"supports":["cand_001"],"contradicts":[]}
```  
  
这会显著提升后续 Reviewer 的复核效率。  
## 7. 目标评分器设计  
  
目标评分器是 2.0 的第一个关键增量。  
### 7.1 评分目标  
  
评分器的目标不是“判断有没有漏洞”，而是“判断是否值得优先投入”。  
### 7.2 建议评分公式  
  
可用线性加权模型起步：  
  
  
其中：  
- •   
  
: External controllability，外部输入可控度  
  
- •   
  
: Privilege boundary value，权限边界价值  
  
- •   
  
: Complexity，解析/状态机复杂度  
  
- •   
  
: Native/JNI/Binder/Parcel 接触度  
  
- •   
  
: Historical hit rate，历史模式命中率  
  
- •   
  
: Drift likelihood，补丁漂移概率  
  
- •   
  
: Validation cost，验证成本  
  
### 7.3 Android 特有加分项  
  
如下对象建议默认额外加权：  
- • Binder transaction handler  
  
- • exported privileged component  
  
- • Intent.parseUri()  
 / deep link router / URI dispatcher  
  
- • WebView + JSBridge + custom scheme 组合  
  
- • Provider call()  
 / 文件导入 / Bundle 注入路径  
  
- • JNI 桥接到 native parser / codec / media / image 路径  
  
- • system_server 中带 userId  
 / packageName  
 / token  
 / PendingIntent  
 的跨进程逻辑  
  
### 7.4 Android 特有降权项  
  
如下对象建议默认降权：  
- • 完全内部调用且无外部输入链路  
  
- • 明确受 SELinux + signature permission 双重硬阻挡  
  
- • 已被历史经验判定为高误报模式  
  
- • 动态验证成本极高且缺乏利用价值  
  
## 8. 验证闭环设计  
  
验证环节建议从“需要时再想办法验证”升级为标准流程。  
### 8.1 四层验证模型  
#### Level 1：Static Suspicion  
- • 代码路径存在潜在问题  
  
- • 尚未确认攻击者是否可达  
  
#### Level 2：Reachability Confirmed  
- • 攻击者模型成立  
  
- • 权限 / SELinux / protectedBroadcast / caller identity 约束已核对  
  
#### Level 3：Runtime Reproduced  
- • 通过 log / trace / state change / UI / crash 观察到实际效果  
  
#### Level 4：Security Impact Confirmed  
- • 明确构成提权、越权访问、敏感数据泄露、身份伪造、策略绕过、DoS 等安全影响  
  
### 8.2 验证产物  
  
每个高价值 finding 至少应产出：  
- • 最小触发输入  
  
- • 关键代码路径  
  
- • 攻击者能力模型  
  
- • 运行时证据  
  
- • 安全影响说明  
  
- • 为什么不是误报  
  
  
  
   
  
  
[1]https://red.anthropic.com/2026/mythos-preview/  
  
