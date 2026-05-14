#  突发｜DeepSeek 现重大漏洞，输入特殊字符可直接泄露他人对话内容  
原创 Attacker安全
                    Attacker安全  Attacker安全   2026-05-14 09:06  
  
**20****26**  
  
收藏+关注，分享不迷路！  
  
**Attacker安全**  
  
专注于网络安全技术与工具分享  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mlsJQIePMtAu7llGmqjl0LqRKZ97yVf0Rfib0GElgkUdqHCVIP6C0N4bvINyib2fj39ezYI2g3QG2II5uO3lTr7Koicmpwiama9gTXnRRSmjIyk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mlsJQIePMtDiaPtOhcgJCqDEj8eGqGwyDh8rcLicLm4cLPibWariaTfhuTqHbmIpnYTeXwvIry1MdP02lzQHPYzO4cicH7cs8vLgMkibkakZUVtlE/640?wx_fmt=png&from=appmsg "")  
  
**2026期待您的关注**  
  
  
**SHENGMING**  
  
**声明**  
  
  
本文仅用于技术讨论与学习，利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，文章作者及本公众号团队不为此承担任何责任。  
  
  
  
01  
  
### 漏洞复现：一行指令，轻松 “窃取” 他人对话  
  
  
  
  
2026·INVITATION  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mlsJQIePMtCXtbdYibZOt1ptgQ9AAFh9upp5RNtBFcbKe4uvPFcGnL3YhfwBg4hVrvPOhbeAsxnIPUxibia7Xj4g6K5ukoRHic4ljez6ibWMxUbo/640?wx_fmt=png&from=appmsg "")  
  
  
2026 年 5 月 14 日，国内知名 AI 大模型再陷数据泄露风波。有用户实测发现，仅需输入特定特殊字符，模型便会随机输出陌生用户的完整对话记录，涵盖私人提问、思考过程及模型回复，隐私裸奔风险拉满。  
  
本次漏洞触发方式极为简单，无需复杂技术操作，普通用户即可快速验证。  
- **触发指令**  
在 DeepSeek 对话框输入任意以下字符，快速模式下触发概率 100%，专家模式不涉及。```
<think

```  
  
  
- **泄露内容示例**  
：输入指令后，模型直接输出一段无关对话，包含用户私密提问、模型完整思考过程及文学性回复片段，与当前用户操作毫无关联。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mlsJQIePMtBrbot3wR7micpRZKhrbO0wCEKYmwEZK5DWaMxq3RYPk7gHfyWPmiaEqUvbVh3pYqM2S1ASxj2iaApTHpSRXyBO2MKOz24V2hCdnM/640?wx_fmt=png&from=appmsg "")  
  
  
- **核心特征**  
：每次刷新结果均不同，内容随机，涵盖小说创作、问题咨询、情感交流等各类场景，疑似从公共对话库中随机抽取。  
  
点击上方  
  
  
关注我们  
  
  
  
  
