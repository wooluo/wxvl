#  SecLens：面向角色的大模型安全漏洞检测评估  
 幻泉之洲   2026-05-11 02:56  
  
>   
  
## 一个分数解决不了所有问题  
  
大语言模型在安全漏洞检测上越来越强。GPT-5.4、Claude Sonnet 4.6、Gemini 3.x这些模型能识别、分类、定位漏洞，覆盖多种编程语言和CWE类别。但公司面临一个实际问题：到底该用哪个模型？  
  
现有的基准测试（CyberSecEval、PrimeVul、SEC-bench等）都有一个共同缺陷：它们把模型的能力压成一个数字。这个数字对排行榜排名有用，但对实际决策远远不够。  
  
想想不同角色的需求：  
- CISO（首席信息安全官）最关心：关键漏洞有没有被漏掉？严重性加权的召回率够不够？各CWE类别是否都有覆盖？如果模型只擅长检测注入漏洞，却放过了认证绕过，那就不能信任。  
- CAIO（首席人工智能官）关心：哪个模型能力最强又最省成本？看重McC-per-dollar、自主完成率、工具使用效率。  
- 安全研究员关心：模型的推理深度如何？CWE分类准确吗？证据链完整吗？  
- 工程主管关心：模型会拖慢我们团队的开发速度吗？误报率高不高？每个任务花多少钱？  
- AI-as-Actor（自主代理）评估：这个智能体知道它能做什么、不能做什么吗？解析稳定性、格式合规、错误处理、自主完成能力如何？  
一个分数根本没法同时服务这五个视角。排名第一的模型，对CISO来说可能是最差选择——如果它放过了关键漏洞；对工程团队也可能是最差选择——如果它产生大量误报。我们的实验证实了这一点：同一个模型，根据不同角色的权重打分，得分能差31分。  
## SecLens-R框架：35个维度，5套权重  
  
我们设计了SecLens-R评估框架。核心思路很简单：所有角色共享35个评价维度，分7个类别（检测、覆盖与一致性、推理与证据、运营效率、工具使用与导航、风险与严重性、鲁棒性）。每个角色选择12–16个维度，给每个维度分配权重，权重之和固定为80。然后对每个维度归一化到0-1，加权平均后再乘100，得到决策分（0-100）。  
  
具体来说：CISO选了16个维度，把34分（满分80）投给了检测类别，18分给了风险与严重性。工程主管选了13个维度，重头在检测（35分）和效率（22分），尤其看重精确率（12分）和可操作发现率（10分）。AI Actor角色把36分砸在鲁棒性上，自主完成（12分）和优雅降级（9分）是其独特关注点。安全研究员则把39分集中在检测，尤其是CWE准确率（12分）。  
  
框架还支持动态维度排除——如果某个维度在当前评估中不可用（比如工具使用维度在纯代码提示模式下没有数据），分母自动调整。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibf1WycfEA5hhasE84QKdjWdxiamNpdOibM9YnaznZiaSKo77bt8II2KbgHsib3sThoPU0HzHRBUSNHJPDiaJs6NBibxycUjibp2n2sGj8/640?wx_fmt=png&from=appmsg "")  
  
▲ 图1：五个角色的类别级权重分布，每个轴代表一个测量类别，权重总和为80  
## 我们怎么做的评价？  
  
我们使用了SecLens基准数据集，包含406个任务，来自93个开源项目，覆盖10种编程语言和8个OWASP对齐的漏洞类别。任务分为两类：真阳性（有漏洞的代码）和补丁后（相同函数但已修复），各203个，严格平衡。  
  
评估分别在两个层级进行：第一个是纯代码提示（CIP）层——直接把脆弱函数给模型，看它能否判断是否含漏洞、分类CWE、定位。第二个是工具使用（TU）层——给模型一个沙盒仓库和三个工具（读文件、搜索、列目录），模拟真实审计流程。  
  
我们评测了12个模型，来自Anthropic（Claude Opus 4.6、Sonnet 4.6、Haiku 4.5）、Google（Gemini 3.1 Pro Preview、3 Flash Preview、2.5 Pro、2.5 Flash）、OpenAI（GPT-5.4），以及通过OpenRouter路由的Qwen3-Coder、Qwen3-Coder-Plus、Kimi K2.5、Grok Code Fast 1。  
## 结果：同一个模型，不同角色打分天差地别  
  
先看CIP层的整体排行榜：Gemini 3 Flash Preview第一（49.6%），Gemini 3.1 Pro Preview第二（48.2%），Claude Sonnet 4.6第三（47.6%）。但排行榜排名和角色特定得分完全不是一回事。  
  
我们给每个模型在每个角色下算了决策分（0-100），然后映射成等级：A≥75，B≥60，C≥50，D≥40，F<40。下面是一些惊人的发现：  
  
AI Actor角色对谁都友好——12个模型全部得A，分数在77.9到87.5之间。因为鲁棒性维度（解析、格式合规等）现在的模型基本都做得不错，区分度很低。  
  
CISO角色最苛刻——得分从D（45.2，Qwen3-Coder）到B（73.3，Gemini 3 Flash）。CISO权重中的严重性加权召回率和关键漏洞漏报率对漏报严重的模型惩罚很大。  
  
工程主管角色最青睐保守派——GPT-5.4得A（76.7），Qwen3-Coder得A（76.3）。这两个模型在CISO角色下只有D和D。原因很简单：它们预测策略保守，很少说代码有漏洞，所以精确率高、误报少，但召回率低。这正合工程主管的胃口，但CISO不答应。  
  
排行榜第一的Gemini 3 Flash，在CISO角色得B（73.3），在工程主管角色只有B（66.2）；而排行榜倒数的Claude Haiku 4.5（第8名）在CISO角色却拿到B（71.2），排名第二。这说明：只看排行榜选模型，很可能选错。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibdXv7QtIV0diaREKsHiapic1hLxecyWib5SjoOFVZ2XqNgQuRVOSGYKuSosoRAFN5NBKGj3uIw1Kebu2FZBaA0vMRziceSQ9cRiay7Iw/640?wx_fmt=png&from=appmsg "")  
  
▲ 图2：CIP层12个模型的角色决策分，虚线标记等级阈值。模型按排行榜得分排序（从左到右）。AI Actor全部A，CISO波动最大，工程主管在右侧（保守模型）明显上升  
  
我们计算了角色差异指数（RDI），就是每个模型在五个角色中最高分减最低分。最高的居然是Qwen3-Coder，差了31.1分！GPT-5.4紧随其后，30.8分。最平衡的是Claude Haiku 4.5，只有16.8分。也就是说，你用什么角色去评价一个模型，直接决定了它的“好坏”。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibdTPpsuwiahphmTN828mFfOeLmEsJicwACyCJWymXEV0KYxFTZWasDD61RAsIkibyc79CuATXcJW0QViaXWynOo1hDWWPLa55sZ0m4/640?wx_fmt=png&from=appmsg "")  
  
▲ 图3：按模型和漏洞类别划分的F1热力图，模型按平均F1排序。绿色表示强，红色表示弱。没有任何一个模型在所有类别都强  
  
具体到每个漏洞类别，情况更复杂。认证失败是最难的类别，最好成绩只有0.585（Kimi K2.5），Claude Opus 4.6居然得了0.000——完全没检出。SSRF是Claude的强项，Sonnet 4.6和Opus 4.6排前两名。Gemini 3 Flash在加密失败和数据完整性上领先。Haiku 4.5意外地内存安全和输入验证拿了第一。Qwen3-Coder在7个类别中都是最差的，因为它的召回率太低。  
  
这些类别级别的盲点在总分里完全看不到，但CISO的D10（最差类别下限）维度会让它现形。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcicsddsPSW0ia0sicfHnkATIjTDHxdLgAmgazFYMxMbwLMcAic59UE0I1W942BSrickJljJqicvxyy6Kbm27f8gQbu30LCibCDthveCU/640?wx_fmt=png&from=appmsg "")  
  
▲ 图4：每个模型的角色差异指数，红色=高（≥28），黄色=中（≥22），蓝色=低。RDI越高，模型价值越取决于利益相关者视角  
## CIP vs. 工具使用：成本差10倍以上  
  
我们比较了CIP和TU两层的结果。TU层（工具使用）的排行榜得分整体更低，最高只有45.8%（Gemini 3.1 Pro Preview），而CIP最高49.6%。更重要的是成本：TU层运行一次比CIP贵10到100倍。Gemini 3.1 Pro的PCI成本是$0.111/任务，TU成本是$1.578/任务；Claude Haiku 4.5的CIP成本$0.005/任务，TU成本$0.256/任务。对于只关心检测质量的决策者来说，CIP层已经足够提供65-70%的区分力，没必要花那么多钱跑TU。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibfJqyNmxAkRic6YUjOsdaOQDicsQrrDRqhugbEHccakJSJJBNXAicjKoVJeMN0c1YuzicVOkVHga0Lop4NRdnuGiaaMdhwfZVzKYBLQ/640?wx_fmt=png&from=appmsg "")  
  
▲ 图5：每个任务成本 vs. 排行榜得分（CIP层，8个有成本跟踪的模型）。对数坐标轴，越靠上越靠左越好  
  
成本效率方面，GPT-5.4表现最好：$0.007/任务，MCC/$达到0.042。但它的排行榜得分只有39.9%。Haiku 4.5是最便宜的模型，$0.005/任务，CISO评分却排名第二。如果你预算有限而且安全检测频率高，Haiku 4.5可能是最佳选择。  
  
注意：通过OpenRouter路由的4个模型没有成本数据，它们的成本维度被动态排除，比较时要留意。  
## 结论：没有万能模型，选模型必须看角色  
  
SecLens-R框架告诉我们一件事：大模型安全漏洞检测的模型选择不是单目标优化问题。同一个模型，站在不同利益相关者角度看，价值天差地远。  
  
保守派模型（GPT-5.4、Qwen3-Coder）适合工程主管——精确率高、误报少、成本低。激进派模型（Gemini 3 Flash、Haiku 4.5）适合CISO——召回率高、覆盖广、严重性感知好。如果你想找一个方方面面都平衡的模型，Haiku 4.5可能是现在最接近的角色平衡选择（RDI最低）。  
  
我们的框架是开源的。你可以根据自己的风险偏好和操作约束，修改权重配置。我们提供了YAML格式的配置文件，改起来很方便。  
  
这只是一个开始。接下来我们会收集SAST误报任务、做多轮运行稳定性分析、扩展到更多模型，并且尝试把这个评分层应用到其他基准测试上。  
### 参考资料  
  
[1]   
https://arxiv.org/html/2604.01637v1  
  
