#  EarthEmbeddingExplorer：零门槛、多模态，像搜图一样探索全球卫星影像  
原创 mapxiaotu
                    mapxiaotu  空天感知   2026-04-13 04:12  
  
- **论文标题**EARTHEMBEDDINGEXPLORER: A WEB APPLICATION FOR CROSS-MODAL RETRIEVAL OF GLOBAL SATELLITE IMAGES  
- **作者机构**中科院空天院、中国科学院大学、LGND AI、伦敦大学学院等  
- **论文链接**https://arxiv.org/abs/2603.29441v2  
- **体验地址：ModelScope Studio**  
可以访问这个Web试用：  
  
https://modelscope.ai/studios/Major-TOM/EarthEmbeddingExplorer/summary  
  
![](https://mmbiz.qpic.cn/mmbiz_png/cemuAg1hRPvJGvPAYxcao5x04Ffuia7cibscoOXygGxmXJmrviaARgFwT2sxAmxAOS55pMjPCHcnLn3QmocontbfIdHeNqkxiaVWGAZdOwFaIyc/640?wx_fmt=png&from=appmsg "")  
  
  
文本检索  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/cemuAg1hRPtI50lBWpj1whrRloVP1zJ5M3cFjrXRHMNJbJE79skwQIESbBkFgm15Xe5gXOtdJqM4qRxWLObM5kEicIiaLoXFwWp90RJLNwyzk/640?wx_fmt=png&from=appmsg "")  
  
相似图检索  
### 研究背景  
  
在地球观测领域，虽然基础模型（Foundation Models）和全球尺度的嵌入数据集（Earth Embeddings）层出不穷，但将这些学术资产转化为普通研究者可用的工具却面临巨大障碍。  
  
目前，用户若想利用这些模型进行搜索或分析，通常需要下载数以 TB 计的数据包，自行搭建嵌入流水线，并开发复杂的向量检索与可视化系统。  
  
这种技术门槛限制了前沿模型在非专家团队中的普及。  
### 核心贡献  
  
1. **交互式 Web 应用：开发了 EarthEmbeddingExplorer，将静态的科研成果转化为动态、实用的发现工作流。**  
1. **跨模态检索：支持自然语言（文本）、视觉（图像）和地理位置三种查询模式。**  
1. **预集成主流模型：内置了 DINOv2、FarSLIP、SatCLIP 和 SigLIP 四种具有代表性的基础模型。**  
1. **全球化规模：基于 Major TOM 数据集，提供了覆盖全球约 1.4% 陆地表面的 24.8 万个预计算嵌入切片。**  
  
### 系统架构  
  
EarthEmbeddingExplorer 采用了云原生架构，前端基于 Gradio 构建，部署在 ModelScope Studio 等开放平台上，为用户提供免费的 GPU 算力支持。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/cemuAg1hRPvhxrUwzII6MEEsTZ9ia1FOSo6rqgl00AHFaibUYveocbPOd1JwZg8ibU1TdW65REZSPm0ibkzqBG8icBS3yTFkTiamlt6Jm7kEWicUzs/640?from=appmsg "")  
  
图 1：基于 ModelScope Studio 的云原生检索流程  
  
系统核心逻辑包括：   
  
- **高效存储**  
：使用 GeoParquet 格式存储预计算嵌入，支持高并发查询和 HTTP Range Download，实现秒级实时可视化。   
  
- **灵活过滤**  
：用户可以根据模型权重、相似度阈值、时间及空间范围进行多维度过滤。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/cemuAg1hRPuiaVibwgrvCVl5wthibqKfRNjmSwHb3hwR0gOHMCpH8vsmpqYTLxa6QctDe3W3pwia66DJKx9SoEaSibXWpCsjmjsiceibYic3TibZ9zl4/640?from=appmsg "")  
  
图 2：EarthEmbeddingExplorer 用户界面展示  
### 核心模型对比  
  
应用集成了四种互补的模型，满足不同场景下的检索需求：  
<table><caption><section><span leaf=""><br/></span></section></caption><tfoot><tr><td><section><span leaf=""><br/></span></section></td></tr></tfoot></table><table><tfoot><tr><td><section><span leaf=""><br/></span></section></td></tr></tfoot></table><table><caption><section><span leaf=""><br/></span></section></caption><tfoot><tr><td></td></tr></tfoot><colgroup><col/><col/><col/><col/><col/></colgroup></table><table><thead><tr><th align="left" style="border:1px solid #eee;padding:10px;text-align:left;background-color:#f9f9f9;font-weight:bold;"><section><span leaf="">模型</span></section></th><th align="left" style="border:1px solid #eee;padding:10px;text-align:left;background-color:#f9f9f9;font-weight:bold;"><section><span leaf="">架构</span></section></th><th align="left" style="border:1px solid #eee;padding:10px;text-align:left;background-color:#f9f9f9;font-weight:bold;"><section><span leaf="">训练数据集</span></section></th><th align="left" style="border:1px solid #eee;padding:10px;text-align:left;background-color:#f9f9f9;font-weight:bold;"><section><span leaf="">输入模态</span></section></th><th align="left" style="border:1px solid #eee;padding:10px;text-align:left;background-color:#f9f9f9;font-weight:bold;"><section><span leaf="">维度</span></section></th></tr></thead><tbody><tr><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><strong><span leaf="">DINOv2</span></strong></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">ViT-L/14</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">LVD-142M</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">视觉 (RGB)</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">1024</span></section></td></tr><tr><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><strong><span leaf="">FarSLIP</span></strong></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">ViT-B/16</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">RS5M, MGRS</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">文本-视觉对齐</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">512</span></section></td></tr><tr><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><strong><span leaf="">SatCLIP</span></strong></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">ViT16-L40</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">S2-100K</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">位置-视觉对齐</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">256</span></section></td></tr><tr><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><strong><span leaf="">SigLIP</span></strong></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">ViT-SO400M</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">WebLI</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">文本-视觉对齐</span></section></td><td align="left" style="border:1px solid #eee;padding:10px;text-align:left;"><section><span leaf="">1152</span></section></td></tr></tbody></table>### 案例实战：热带雨林检索  
  
论文展示了以“热带雨林”为目标的检索案例，对比了不同查询模式下模型的表现差异。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/cemuAg1hRPtfgMibouufib6m6cAtDwKs8HFDK4icb6EqY27In8BziajGBkzKlN8fUa7nc8ZrJSVPjNicCHMV3bh8Nbz6TRtmLTttAwxZb0ZBiaWlc/640?from=appmsg "")  
  
图 3：不同模型与查询模式下的全球相似度分布图  
- **文本查询 (FarSLIP)：精准捕捉“雨林”语义，高分匹配区集中在南美亚马逊、非洲刚果盆地和东南亚。**  
- **地理位置查询 (SatCLIP)：展现了极强的地理先验，检索结果严格限制在赤道附近的热带雨林带。**  
- **图像查询 (DINOv2)：更关注视觉特征。例如，若查询图像中包含河流，DINOv2 的前 5 个结果往往都带有明显的河流纹理，体现了其对视觉细节的敏感性。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/cemuAg1hRPsic6yrgQ0MibiadwvY3EG32qia2WfRwBjOyib0I4UmytCjExRoaibMFDlib8fPbIXEs5fdGt5CKWhAuXj452EsGByibNevQCw5wt7uwNQ/640?from=appmsg "")  
  
图 4：热带雨林案例下的 Top-5 检索结果切片  
### 总结与展望  
  
EarthEmbeddingExplorer 成功弥合了学术论文与实际应用之间的鸿沟。它不仅为模型开发者提供了一个全球尺度的“压力测试”平台，也让地理科学研究者能够通过简单的文本或位置信息，快速定位并导出感兴趣的全球卫星影像。  
  
未来，该项目计划进一步扩大空间与时间覆盖范围，并支持更多社区贡献的基础模型，推动地球观测领域的开放科学生态建设。  
  
  
  
[让AI“读懂”12000+景SAR影像：开源SAR平台重大更新，接入大模型你也可以实现以文搜图](https://mp.weixin.qq.com/s?__biz=MzI2MDIyOTMyOA==&mid=2247488734&idx=1&sn=d045ef3e00551d2562e24413dab1bfe2&scene=21#wechat_redirect)  
  
  
[也说遥感共性产品，行业需要什么样的遥感产品？](https://mp.weixin.qq.com/s?__biz=MzI2MDIyOTMyOA==&mid=2247486926&idx=1&sn=66ad7dc53a491a5c9068e6b4684cbb03&scene=21#wechat_redirect)  
  
  
[看水利部水利遥感星座战略布局，机遇与挑战并存](http://mp.weixin.qq.com/s?__biz=MzI2MDIyOTMyOA==&mid=2247486470&idx=1&sn=8cac97764abc7e9245f86848dd08e2ca&chksm=ea6d9db9dd1a14af59370e49bcf8ee8e5ba2da77d1b5658589b68c6d649ff302627d446d071e&scene=21#wechat_redirect)  
  
  
[Umbra开源雷达影像下载工具开发实践](https://mp.weixin.qq.com/s?__biz=MzI2MDIyOTMyOA==&mid=2247486877&idx=1&sn=15bb7e1fa63a69c07bf78df5e668758a&scene=21#wechat_redirect)  
  
  
[NASA与微软联合推出“Earth Copilot”，“智能助手“或成为行业产品标配](http://mp.weixin.qq.com/s?__biz=MzI2MDIyOTMyOA==&mid=2247486590&idx=1&sn=869ed4f61721ebc13009dd121b105b90&chksm=ea6d9dc1dd1a14d7146f6faee440b3c3e6526d673c10f990d3f7d633b45350eec0f51aae7e4f&scene=21#wechat_redirect)  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/cemuAg1hRPuUUGtsvvL2TmjPffZHnF0KIhVMH50Z4Jvsacia9qUicOHtnsJT8HgQlgI1Uflxj0oEWicibZLbNUujAiazONzTwTUCFwdTVv6I3sRc/640?wx_fmt=other&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=4 "")  
  
欢迎交流  
  
笔者长期从事人工智能、遥感、大模型等业务  
  
  
