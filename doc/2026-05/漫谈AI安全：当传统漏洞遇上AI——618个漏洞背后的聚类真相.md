#  漫谈AI安全：当传统漏洞遇上AI——618个漏洞背后的聚类真相  
原创 是JC啊
                        是JC啊  江城安知   2026-05-13 03:52  
  
**前言**  
  
  
  
这一篇聊聊关于AI安全和传统安全差异，有点研究报告的色彩，嗯，还是庄重一些。  
## 免责声明:  
## 本篇文章仅用于技术交流学习和研究的目的，严禁使用文章中的技术用于非法目的和破坏，否则造成一切后果与发表本文章的作者无关。  
  
**注意：**  
  
**本免责声明旨在明确指出，本文仅为技术交流、学习和研究之用，不得将文章中的技术用于任何非法目的或破坏行为。发表本文章的作者对于任何非法使用技术或对他人或系统造成的损害概不负责。**  
  
**阅读和参考本文章时，您必须明确并承诺，不会利用文章中提供的技术来实施非法活动、侵犯他人的权益或对系统进行攻击。任何使用本文中的技术所导致的任何意外、损失或损害，包括但不限于数据损失、财产损失、法律责任等问题，都与发表本文章的作者无关。**  
  
**本文提供的技术信息仅供学习和参考之用，不构成任何形式的担保或保证。发表本文章的作者不对技术的准确性、有效性或适用性做任何声明或保证。**  
##   
  
近期笔者陆续分析了 **618个**  
 来自 huntr.com 的AI项目漏洞报告，涉及 **74个**  
 AI项目、**44种**  
 漏洞类型。这些项目涵盖了大模型推理平台（Ollama、Open WebUI）、RAG框架（LlamaIndex、AnythingLLM）、AI Agent（AgentScope）等热门方向。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/NVsU3bKAWjPnJfPbef8ypvhZhyfNWmLvOdkyfvPqiasbmFq85kjptKIGBwjpicBicavu61n1r3gLVeTB1gKT8uO9be7CjBf3eXF2WllNT7OLFs/640?wx_fmt=png&from=appmsg "")  
  
一个核心问题始终萦绕：**AI安全漏洞，到底是全新的威胁，还是传统漏洞在AI场景下的"借尸还魂"？**  
  
答案是：**两者皆是，且后者往往更隐蔽、更危险。**  
  
本文将基于数据聚类分析，揭示AI安全漏洞的五大类型，并通过具体案例对比，带你看清传统漏洞在AI时代的"变异"轨迹。  
## 一、五大聚类：AI漏洞的全景图  
  
通过攻击向量、AI攻击面、影响范围三个维度的交叉分析，618个漏洞被聚类为五大类型：  
<table><thead><tr><th data-colwidth="228"><section><span leaf="">聚类</span></section></th><th data-colwidth="75"><section><span leaf="">漏洞数</span></section></th><th data-colwidth="88"><section><span leaf="">占比</span></section></th><th data-colwidth="164"><section><span leaf="">核心特征</span></section></th></tr></thead><tbody><tr><td data-colwidth="228"><section><span leaf="">🔴</span><strong><span leaf="">AI供应链与序列化漏洞</span></strong></section></td><td data-colwidth="75"><section><span leaf="">182</span></section></td><td data-colwidth="88"><section><span leaf="">29.4%</span></section></td><td data-colwidth="164"><section><span leaf="">Pickle反序列化、模型加载RCE</span></section></td></tr><tr><td data-colwidth="228"><section><span leaf="">🟠<span textstyle="" style="font-weight: bold;">传统漏洞在AI中的复现</span></span></section></td><td data-colwidth="75"><section><span leaf="">135</span></section></td><td data-colwidth="88"><section><span leaf="">21.8%</span></section></td><td data-colwidth="164"><section><span leaf="">向量库SQL注入、AI聊天XSS</span></section></td></tr><tr><td data-colwidth="228"><section><span leaf="">🟡 </span><strong><span leaf="">AI特有的数据流漏洞</span></strong></section></td><td data-colwidth="75"><section><span leaf="">107</span></section></td><td data-colwidth="88"><section><span leaf="">17.3%</span></section></td><td data-colwidth="164"><section><span leaf="">模型文件路径遍历、知识库操作</span></section></td></tr><tr><td data-colwidth="228"><section><span leaf="">🟢 </span><strong><span leaf="">AI资源与可用性</span></strong></section></td><td data-colwidth="75"><section><span leaf="">74</span></section></td><td data-colwidth="88"><section><span leaf="">12.0%</span></section></td><td data-colwidth="164"><section><span leaf="">模型推理DoS、GPU耗尽</span></section></td></tr><tr><td data-colwidth="228"><section><span leaf="">🔵 </span><strong><span leaf="">AI认证与访问控制</span></strong></section></td><td data-colwidth="75"><section><span leaf="">60</span></section></td><td data-colwidth="88"><section><span leaf="">9.7%</span></section></td><td data-colwidth="164"><section><span leaf="">多用户模式绕过、模型API越权</span></section></td></tr></tbody></table>> **关键发现**  
：**48.6%**  
 的漏洞具有AI特有的攻击特征（纯AI特征+混合特征）。这意味着，将近一半的AI漏洞，是传统安全工具链无法直接覆盖的。  
  
##   
## 二、聚类一：AI供应链与序列化漏洞（29.4%）  
### 2.1 最危险的"标配"漏洞：Pickle反序列化  
  
如果你审计过Python AI项目，一定会对一个现象感到震惊：**Pickle反序列化漏洞几乎无处不在。**  
  
**为什么？**  
 因为AI生态对Pickle有深度依赖：  
- **PyTorch**  
 默认使用 torch.load()  
 加载模型权重（底层是Pickle）。  
  
- **HuggingFace Transformers**  
 的 from_pretrained()  
 会下载并反序列化模型文件。  
  
- **NumPy**  
的 .npy  
 加载、**Pandas**  
 的 read_pickle()  
 同样危险。  
  
**典型案例：**  
> **Microsoft DeepSpeed - RCE via Pickle Deserialization**  
  
来源：huntr.com | 项目：microsoft/deepspeed  
  
DeepSpeed 的 p2p.recv_obj()  
 函数直接使用 pickle.loads()  
 反序列化接收到的数据，攻击者可以构造恶意Pickle Payload实现远程代码执行。  
  
> **LlamaIndex - Unsafe Deserialization in JsonPickleSerializer**  
  
CVE-2025-3108 | 来源：huntr.com | 项目：run-llama/llama_index  
  
LlamaIndex 的序列化组件使用了 jsonpickle  
，攻击者可通过构造特殊的JSON序列化数据触发任意代码执行。  
  
> **Dask - Remote Unauthorized Pickle Deserialization**  
  
CVE-2024-10096 | 来源：huntr.com | 项目：dask/dask  
  
Dask分布式计算框架在未授权情况下反序列化远程Pickle数据，导致命令执行。  
  
  
**与传统Java反序列化的对比：**  
<table><thead><tr><th data-colwidth="107"><section><span leaf="">对比项</span></section></th><th><section><span leaf="">传统Java反序列化</span></section></th><th><section><span leaf="">AI Python Pickle</span></section></th></tr></thead><tbody><tr><td data-colwidth="107"><strong><span leaf="">触发点</span></strong></td><td><section><span leaf="">HTTP请求中的序列化数据</span></section></td><td><section><span leaf="">模型加载、数据预处理、分布式通信</span></section></td></tr><tr><td data-colwidth="107"><strong><span leaf="">目标</span></strong></td><td><section><span leaf="">Java对象</span></section></td><td><section><span leaf="">PyTorch模型、NumPy数组、Pandas DataFrame</span></section></td></tr><tr><td data-colwidth="107"><strong><span leaf="">载荷</span></strong></td><td><section><span leaf="">CommonsCollections链</span></section></td><td><section><span leaf="">恶意Pickle Payload（</span><code><span leaf="">__reduce__</span></code><span leaf="">）</span></section></td></tr><tr><td data-colwidth="107"><strong><span leaf="">防御现状</span></strong></td><td><section><span leaf="">已知Gadget库，有YSoSerial等工具</span></section></td><td><section><span leaf="">模型生态广泛依赖Pickle，替代方案Safetensors未普及</span></section></td></tr><tr><td data-colwidth="107"><strong><span leaf="">特殊性</span></strong></td><td><section><span leaf="">需要特定Gadget链</span></section></td><td><strong><span leaf="">任何Python对象都可成为Gadget，门槛更低</span></strong></td></tr></tbody></table>  
**核心差异**  
：Java反序列化需要寻找特定的Gadget链，而Python Pickle的 __reduce__  
 机制允许任意可调用对象执行，**攻击门槛显著降低**  
。  
### 2.2 模型供应链攻击  
  
HuggingFace等模型Hub的流行，让"下载模型→加载模型"成为标准流程。但这个流程中：  
1. **模型来源难以验证**  
from_pretrained("user/model")  
 下载的权重是否可信？  
  
1. **加载过程缺乏隔离**  
大多数框架直接在当前进程加载模型，没有沙箱  
  
1. **格式混乱**  
.pt、.pkl、.safetensors 混用，开发者难以区分安全性  
  
##   
## 三、聚类二：传统Web漏洞在AI中的复现（21.8%）  
  
这个聚类揭示了一个重要事实：**传统漏洞在AI场景中不是简单复现，而是发生了"语义变异"——攻击目标变了，防御逻辑却常被忽视。**  
### 3.1 SQL注入：从关系型数据库到向量数据库  
  
**典型案例：**  
> **LlamaIndex - SQL Injection in default_jsonalyzer via prompt injection**  
  
CVE-2024-12911 | 来源：huntr.com | 项目：run-llama/llama_index  
  
攻击者通过Prompt注入，让LLM生成恶意SQL语句，进而操控底层向量数据库。  
  
> **LlamaIndex - SQL injection vulnerabilities in multiple vector stores**  
  
CVE-2025-1793 | 来源：huntr.com | 项目：run-llama/llama_index  
  
多个向量存储实现存在SQL注入，攻击者可读取、修改或删除向量索引数据。  
  
> **LoLLMS - SQL injection in delete_discussion()**  
  
CVE-2024-1601 | 来源：huntr.com | 项目：parisneo/lollms-webui  
  
讨论删除功能直接拼接SQL语句，导致SQL注入。  
  
  
**对比分析：**  
<table><thead><tr><th data-colwidth="106"><section><span leaf="">对比项</span></section></th><th data-colwidth="209"><section><span leaf="">传统Web SQL注入</span></section></th><th><section><span leaf="">AI向量数据库SQL注入</span></section></th></tr></thead><tbody><tr><td data-colwidth="106"><strong><span leaf="">触发点</span></strong></td><td data-colwidth="209"><section><span leaf="">搜索框、登录表单</span></section></td><td><section><span leaf="">向量查询API、RAG检索接口</span></section></td></tr><tr><td data-colwidth="106"><strong><span leaf="">目标</span></strong></td><td data-colwidth="209"><section><span leaf="">MySQL/PostgreSQL</span></section></td><td><section><span leaf="">Couchbase、PGVector、Milvus、Chroma</span></section></td></tr><tr><td data-colwidth="106"><strong><span leaf="">载荷</span></strong></td><td data-colwidth="209"><code><span leaf="">&#39; OR &#39;1&#39;=&#39;1</span></code></td><td><code><span leaf="">&#39; OR &#39;1&#39;=&#39;1</span></code><section><span leaf="">（但目标是向量索引）</span></section></td></tr><tr><td data-colwidth="106"><strong><span leaf="">后果</span></strong></td><td data-colwidth="209"><section><span leaf="">拖库、数据篡改</span></section></td><td><strong><span leaf="">知识库清空、AI记忆消除、RAG上下文污染</span></strong></td></tr><tr><td data-colwidth="106"><strong><span leaf="">防御现状</span></strong></td><td data-colwidth="209"><section><span leaf="">参数化查询已成标配</span></section></td><td><strong><span leaf="">开发者常忽视&#34;向量库也是数据库&#34;</span></strong></td></tr><tr><td data-colwidth="106"><strong><span leaf="">特殊性</span></strong></td><td data-colwidth="209"><section><span leaf="">成熟防御方案</span></section></td><td><section><span leaf="">需要理解向量查询的语义结构</span></section></td></tr></tbody></table>  
**关键洞察**  
：很多AI开发者将向量数据库视为"黑盒检索工具"，完全忽略了它同样接受查询语句、同样需要参数化防御。这是认知层面的安全盲区。  
### 3.2 XSS：从网页到AI聊天界面  
  
**典型案例：**  
> **Devika - XSS stored in chat**  
  
CVE-2024-5711 | 来源：huntr.com | 项目：stitionai/devika  
  
AI编程助手Devika的聊天界面未对模型输出进行HTML编码，导致存储型XSS。  
  
> **ChuanhuChatGPT - Insecure model output handling leads to XSS**  
  
CVE-2024-3402 | 来源：huntr.com | 项目：gaizhenbiao/chuanhuchatgpt  
  
模型输出直接渲染到DOM，攻击者可通过Prompt诱导模型输出恶意JavaScript。  
  
> **LoLLMS - XSS in Chat Message Leads to Account Takeover**  
  
CVE-2026-1116 | 来源：huntr.com | 项目：parisneo/lollms  
  
聊天消息中的XSS可被利用窃取用户Token，实现账户接管。  
  
  
**AI场景的特殊性：**  
  
传统XSS的防御思路是"不信任用户输入"，但AI聊天界面中：  
1. **输入来源模糊**  
用户输入经过LLM"转译"后输出，是否还算"用户输入"？  
  
1. **输出不可预测**  
LLM可能生成任意内容，包括恶意HTML/JS  
  
1. **Markdown渲染**  
大多数AI界面使用Markdown渲染，增加了XSS攻击面（如<img onerror=  
）  
  
**防御建议**  
：对AI模型的输出**同样**  
进行HTML编码和CSP限制，不能因为是"AI生成的"就信任。  
### 3.3 SSRF：模型API成为新的攻击向量  
  
**典型案例：**  
> **LLaVA - SSRF in POST /worker_generate_stream API endpoint**  
  
CVE-2024-9309 | 来源：huntr.com | 项目：haotian-liu/llava  
  
多模态模型LLaVA的API端点未对URL进行校验，可请求内网资源。  
  
> **LoLLMS - SSRF via POST /api/proxy**  
  
CVE-2024-12766 | 来源：huntr.com | 项目：parisneo/lollms-webui  
  
代理API允许任意URL请求，导致SSRF。  
  
> **ComfyUI - SSRF via POST /internal/models/download**  
  
CVE-2024-12882 | 来源：huntr.com | 项目：comfyanonymous/comfyui  
  
模型下载接口可被用于请求内网地址，探测内部服务。  
  
  
**AI场景的特殊性：**  
  
AI项目常需要"加载远程模型""获取外部数据"，这天然需要出站请求。但：  
- **模型下载接口**  
 成为SSRF入口（如/download?url=  
）  
  
- **RAG检索**  
 需要抓取网页，URL校验不严格导致内网探测  
  
- **多模态处理**  
 需要下载图片/音频，文件URL可被篡改  
  
##   
## 四、聚类三：AI特有的数据流漏洞（17.3%）  
  
AI项目处理大量模型文件、训练数据、向量索引，导致文件操作类漏洞激增。与传统Web不同，这些操作直接影响AI核心功能。  
### 4.1 模型文件路径遍历  
  
**典型案例：**  
> **AgentScope - Directory traversal to read any local json file**  
  
CVE-2024-8524 | 来源：huntr.com | 项目：modelscope/agentscope  
  
模型配置文件读取存在路径遍历，可读取任意本地JSON文件。  
  
> **AgentScope - Path Traversal in API /api/file**  
  
CVE-2024-8435 | 来源：huntr.com | 项目：modelscope/agentscope  
  
文件API未校验路径，可遍历读取系统文件。  
  
> **LoLLMS - Subfolder prediction via Path Traversal**  
  
来源：huntr.com | 项目：parisneo/lollms-webui  
  
通过路径遍历预测子文件夹结构，获取敏感信息。  
  
  
**AI场景的特殊性：**  
<table><thead><tr><th data-colwidth="121"><section><span leaf="">对比项</span></section></th><th data-colwidth="183"><section><span leaf="">传统路径遍历</span></section></th><th><section><span leaf="">AI模型文件路径遍历</span></section></th></tr></thead><tbody><tr><td data-colwidth="121"><strong><span leaf="">目标文件</span></strong></td><td data-colwidth="183"><code><span leaf="">/etc/passwd</span></code><section><span leaf="">、网站源码</span></section></td><td><strong><span leaf="">模型权重、训练数据、向量索引、API密钥配置</span></strong></td></tr><tr><td data-colwidth="121"><strong><span leaf="">后果</span></strong></td><td data-colwidth="183"><section><span leaf="">信息泄露</span></section></td><td><strong><span leaf="">模型窃取、知识库泄露、训练数据暴露</span></strong></td></tr><tr><td data-colwidth="121"><strong><span leaf="">利用难度</span></strong></td><td data-colwidth="183"><section><span leaf="">需要猜测路径</span></section></td><td><section><span leaf="">模型路径常按约定命名（</span><code><span leaf="">models/xxx.pt</span></code><span leaf="">），更易猜测</span></section></td></tr><tr><td data-colwidth="121"><strong><span leaf="">防御重点</span></strong></td><td data-colwidth="183"><section><span leaf="">路径校验</span></section></td><td><strong><span leaf="">还需保护模型存储目录的访问控制</span></strong></td></tr></tbody></table>### 4.2 恶意模型上传  
  
传统文件上传的防御重点是阻止WebShell（.php、.jsp），但AI场景下：  
- .pt、.pkl 文件本身就是"可执行代码"（通过Pickle反序列化）  
  
- **模型格式白名单**  
 无法防御（合法的.pt文件也可以是恶意的）  
  
- **需要沙箱加载**  
在隔离环境中验证模型安全性  
  
##   
## 五、聚类四：AI资源与可用性（12.0%）  
### 5.1 模型推理DoS  
  
**典型案例：**  
> **Ollama - Malicious GGUF model leads to DoS**  
  
CVE-2025-0313 | 来源：huntr.com | 项目：ollama/ollama  
  
恶意构造的GGUF模型文件包含越界数组访问，导致Ollama崩溃。  
  
> **Ollama - DoS using malicious GGUF model file**  
  
CVE-2024-12055 | 来源：huntr.com | 项目：ollama/ollama  
  
特殊构造的GGUF文件触发除零错误，导致服务拒绝响应。  
  
> **Ollama - Malicious GGUF model causing division by zero**  
  
CVE-2025-0317 | 来源：huntr.com | 项目：ollama/ollama  
  
模型张量维度异常导致计算错误，引发DoS。  
  
  
**AI场景的特殊性：**  
<table><thead><tr><th data-colwidth="124"><section><span leaf="">对比项</span></section></th><th data-colwidth="192"><section><span leaf="">传统DoS</span></section></th><th data-colwidth="254"><section><span leaf="">AI模型推理DoS</span></section></th></tr></thead><tbody><tr><td data-colwidth="124"><strong><span leaf="">攻击向量</span></strong></td><td data-colwidth="192"><section><span leaf="">大量HTTP请求</span></section></td><td data-colwidth="254"><strong><span leaf="">恶意模型文件、超大输入向量</span></strong></td></tr><tr><td data-colwidth="124"><strong><span leaf="">资源目标</span></strong></td><td data-colwidth="192"><section><span leaf="">带宽、CPU</span></section></td><td data-colwidth="254"><strong><span leaf="">GPU显存、推理计算资源</span></strong></td></tr><tr><td data-colwidth="124"><strong><span leaf="">防御难点</span></strong></td><td data-colwidth="192"><section><span leaf="">限流、CDN</span></section></td><td data-colwidth="254"><strong><span leaf="">需要验证模型文件结构、限制输入尺寸</span></strong></td></tr><tr><td data-colwidth="124"><strong><span leaf="">成本差异</span></strong></td><td data-colwidth="192"><section><span leaf="">攻击者消耗带宽</span></section></td><td data-colwidth="254"><strong><span leaf="">攻击者上传一个小文件，防御者消耗大量GPU资源</span></strong></td></tr></tbody></table>  
**关键洞察**  
：AI DoS是"不对称攻击"的典范——攻击者上传一个几MB的恶意模型，就能让防御者的GPU满载数小时。  
## 六、聚类五：AI认证与访问控制（9.7%）  
### 6.1 多用户模式的越权漏洞  
  
AI平台（如Open WebUI、AnythingLLM）越来越多地支持"多用户+工作空间"模式，但权限隔离常不到位。  
  
**典型案例：**  
> **Open WebUI - Improper access control allow view/delete any files**  
  
来源：huntr.com | 项目：open-webui/open-webui  
  
文件管理API未校验用户权限，可查看/删除其他用户的文件。  
  
> **Lunary - IDOR Vulnerability in PATCH /v1/runs/:id/score**  
  
来源：huntr.com | 项目：lunary-ai/lunary  
  
通过修改run ID可访问其他用户的运行记录和评分数据。  
  
> **RAGFlow - Partial Account Takeover due to Insecure Data Querying**  
  
来源：huntr.com | 项目：infiniflow/ragflow  
  
| 数据查询接口未严格隔离用户数据，导致部分账户接管。  
  
  
**AI场景的特殊性：**  
- **模型级权限**  
谁能访问哪个模型？能否限制模型调用次数？  
  
- **知识库隔离**  
用户A的知识库对用户B是否不可见？  
  
- **推理记录**  
用户的Prompt历史是否被妥善保护？  
  
- **API Key管理**  
不同用户的API Key是否有独立的权限范围？  
  
##   
## 七、总结：相同与不同  
### 相同点：底层原理不变  
1. **SQL注入依然是拼接问题**  
无论是MySQL还是PGVector，拼接SQL语句就是危险的  
  
1. **XSS依然是输出编码问题**  
AI生成的HTML同样需要转义  
  
1. **路径遍历依然是路径校验问题**  
../  
 在任何场景下都不该被允许  
  
1. **OWASP Top 10框架依然有效**  
注入、越权、配置错误等分类完全适用  
  
### 不同点：AI带来的新维度  
<table><thead><tr><th data-colwidth="98"><section><span leaf="">维度</span></section></th><th data-colwidth="165"><section><span leaf="">传统安全</span></section></th><th data-colwidth="308"><section><span leaf="">AI安全</span></section></th></tr></thead><tbody><tr><td data-colwidth="98"><strong><span leaf="">攻击面</span></strong></td><td data-colwidth="165"><section><span leaf="">Web层、网络层</span></section></td><td data-colwidth="308"><strong><span leaf="">+ 模型层、数据层、供应链层</span></strong></td></tr><tr><td data-colwidth="98"><strong><span leaf="">攻击载荷</span></strong></td><td data-colwidth="165"><section><span leaf="">语法层面（SQL、HTML）</span></section></td><td data-colwidth="308"><strong><span leaf="">+ 语义层面（Prompt、对抗样本）</span></strong></td></tr><tr><td data-colwidth="98"><strong><span leaf="">影响评估</span></strong></td><td data-colwidth="165"><section><span leaf="">数据泄露可计数</span></section></td><td data-colwidth="308"><strong><span leaf="">模型行为偏移难以量化检测</span></strong></td></tr><tr><td data-colwidth="98"><strong><span leaf="">防御工具</span></strong></td><td data-colwidth="165"><section><span leaf="">SQLMap、Burp Suite</span></section></td><td data-colwidth="308"><strong><span leaf="">+ 模型模糊测试、Prompt Fuzzing</span></strong></td></tr><tr><td data-colwidth="98"><strong><span leaf="">供应链</span></strong></td><td data-colwidth="165"><section><span leaf="">npm/pip包</span></section></td><td data-colwidth="308"><strong><span leaf="">+ HuggingFace模型、LoRA权重、数据集</span></strong></td></tr><tr><td data-colwidth="98"><strong><span leaf="">专业门槛</span></strong></td><td data-colwidth="165"><section><span leaf="">通用Web安全知识</span></section></td><td data-colwidth="308"><strong><span leaf="">需要理解AI推理流程、模型格式、向量空间</span></strong></td></tr></tbody></table>### 最危险的漏洞类型  
  
根据数据分析，**AI供应链与序列化漏洞（29.4%）**  
 是最危险的聚类，原因有三：  
1. **普遍性**  
Pickle在AI生态中无处不在  
  
1. **隐蔽性**  
模型文件看起来是"数据"，实则是"可执行代码"  
  
1. **高影响**  
RCE+模型篡改，双重危害  
  
##   
## 八、给安全从业者的建议  
### 8.1 审计AI项目时，重点关注  
1. **模型加载流程**  
是否使用了 torch.load()  
、pickle.loads()  
？  
  
是否支持Safetensors？  
  
1. **向量数据库查询**  
是否存在字符串拼接SQL？是否使用参数化查询？  
  
1. **文件操作**  
模型文件路径是否用户可控？是否校验文件扩展名之外的实际内容？  
  
1. **多用户隔离**  
知识库、模型、API Key是否严格按用户隔离？  
  
1. **出站请求**  
模型下载、RAG抓取是否校验URL？是否限制内网访问？  
  
### 8.2 给AI开发者的建议  
1. **用Safetensors替代Pickle**  
HuggingFace的Safetensors格式是安全的序列化替代方案  
  
1. **向量库也要参数化查询**  
Chroma、PGVector、Milvus都支持参数化，不要拼接SQL  
  
1. **沙箱加载模型**  
在隔离环境中首次加载新模型，验证其行为  
  
1. **输出编码**  
AI模型的输出渲染到界面前，同样要进行HTML编码  
  
1. **限制资源消耗**  
设置模型推理的超时、内存上限、输入尺寸限制  
  
##   
## 结语  
  
AI安全不是全新的领域，而是传统安全在AI场景下的**延伸和变异**  
。最危险的漏洞，往往是那些**将传统攻击面与AI特性结合的混合体**  
——比如一个看似普通的文件上传接口，因为上传的是Pickle序列化的模型文件，就变成了RCE入口。  
  
理解这种"变异"规律，是审计AI项目、防御AI威胁的关键。希望这篇基于618个真实漏洞的数据分析，能为你的AI安全研究提供有价值的参考。  
> 📊 **数据来源**  
：huntr.com 618个AI项目漏洞报告  
  
## 附录：关键漏洞索引  
<table><thead><tr><th><section><span leaf="">漏洞类型</span></section></th><th><section><span leaf="">项目</span></section></th><th><section><span leaf="">CVE</span></section></th><th><section><span leaf="">来源</span></section></th></tr></thead><tbody><tr><td><section><span leaf="">Pickle反序列化RCE</span></section></td><td><section><span leaf="">microsoft/deepspeed</span></section></td><td><section><span leaf="">-</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">Pickle反序列化RCE</span></section></td><td><section><span leaf="">dask/dask</span></section></td><td><section><span leaf="">CVE-2024-10096</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">Pickle反序列化RCE</span></section></td><td><section><span leaf="">run-llama/llama_index</span></section></td><td><section><span leaf="">CVE-2025-3108</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">向量数据库SQL注入</span></section></td><td><section><span leaf="">run-llama/llama_index</span></section></td><td><section><span leaf="">CVE-2024-12911</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">向量数据库SQL注入</span></section></td><td><section><span leaf="">run-llama/llama_index</span></section></td><td><section><span leaf="">CVE-2025-1793</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">向量数据库SQL注入</span></section></td><td><section><span leaf="">parisneo/lollms-webui</span></section></td><td><section><span leaf="">CVE-2024-1601</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">AI聊天XSS</span></section></td><td><section><span leaf="">stitionai/devika</span></section></td><td><section><span leaf="">CVE-2024-5711</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">AI聊天XSS</span></section></td><td><section><span leaf="">gaizhenbiao/chuanhuchatgpt</span></section></td><td><section><span leaf="">CVE-2024-3402</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">AI聊天XSS</span></section></td><td><section><span leaf="">parisneo/lollms</span></section></td><td><section><span leaf="">CVE-2026-1116</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型API的SSRF</span></section></td><td><section><span leaf="">haotian-liu/llava</span></section></td><td><section><span leaf="">CVE-2024-9309</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型API的SSRF</span></section></td><td><section><span leaf="">parisneo/lollms-webui</span></section></td><td><section><span leaf="">CVE-2024-12766</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型API的SSRF</span></section></td><td><section><span leaf="">comfyanonymous/comfyui</span></section></td><td><section><span leaf="">CVE-2024-12882</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型文件路径遍历</span></section></td><td><section><span leaf="">modelscope/agentscope</span></section></td><td><section><span leaf="">CVE-2024-8524</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型文件路径遍历</span></section></td><td><section><span leaf="">modelscope/agentscope</span></section></td><td><section><span leaf="">CVE-2024-8435</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型推理DoS</span></section></td><td><section><span leaf="">ollama/ollama</span></section></td><td><section><span leaf="">CVE-2025-0313</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型推理DoS</span></section></td><td><section><span leaf="">ollama/ollama</span></section></td><td><section><span leaf="">CVE-2024-12055</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">模型推理DoS</span></section></td><td><section><span leaf="">ollama/ollama</span></section></td><td><section><span leaf="">CVE-2025-0317</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">多用户越权</span></section></td><td><section><span leaf="">open-webui/open-webui</span></section></td><td><section><span leaf="">-</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">多用户越权</span></section></td><td><section><span leaf="">lunary-ai/lunary</span></section></td><td><section><span leaf="">-</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr><tr><td><section><span leaf="">多用户越权</span></section></td><td><section><span leaf="">infiniflow/ragflow</span></section></td><td><section><span leaf="">-</span></section></td><td><section><span leaf="">huntr.com</span></section></td></tr></tbody></table>  
  
**👇关注我了解更多安全小技巧**  
  
  
  
  
