#  Coruna：神秘而强大的iOS漏洞利用工具包分析  
原创 华盟翻译
                    华盟翻译  黑白之道   2026-03-19 01:42  
  
> **导语**  
：Google Threat Intelligence发现了一款名为Coruna的强大iOS漏洞利用工具包，该工具包横跨多个威胁攻击者和全球攻击活动。这再次证明了复杂网络能力的扩散速度之快，以及商业间谍软件市场的活跃程度。  
  
## 一、发现概述  
  
Google威胁情报小组（GTIG）发现了一款针对苹果iPhone的新型强大漏洞利用工具包，名为"Coruna"。该工具包针对运行iOS 13.0（2019年9月发布）至iOS 17.2.1（2023年12月发布）版本的苹果设备。  
  
Coruna漏洞利用工具包包含五条完整的iOS漏洞利用链，共计23个漏洞。该工具包的核心技术价值在于其全面的iOS漏洞收集，其中最先进的漏洞利用技术采用了非公开的利用技术和缓解措施绕过方法。  
  
![Coruna iOS漏洞利用工具包时间线](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6NM7R4Lz5Mo8qs6toBiaGCiafn6Sr4xHN5uLm2SJS047voG3r4rHqiaauSoxcV8DzqBUEs01HdcVUFUeq9FDU3wgD3FNZdUGSoSJ8/640?wx_fmt=png "Coruna iOS漏洞利用工具包时间线")  
 # 来源：Google Cloud Blog  
  
Coruna漏洞利用工具包是复杂能力扩散的又一个典型案例。在2025年期间，GTIG追踪了其在高度针对性攻击活动中的使用情况：最初由一家监控供应商的客户使用，随后观察到UNC6353（疑似俄罗斯间谍组织）在针对乌克兰用户的供应链攻击中部署了该工具包，最后在UNC6691（来自中国的金融动机威胁攻击者）的大规模攻击活动中发现了完整的漏洞利用工具包。  
  
这种扩散是如何发生的尚不清楚，但表明"二手"零日漏洞市场非常活跃。除这些已识别的漏洞外，多个威胁攻击者现在已经获得了可重复使用和修改的高级利用技术。  
  
根据Google的披露政策，我们分享此研究以提高业界的安全意识。我们还已将所有已识别的网站和域名添加到Safe Browsing中，以保护用户免受进一步攻击。Coruna漏洞利用工具包对最新版本的iOS无效，强烈建议iPhone用户将设备更新到最新版本的iOS。如果无法更新，建议启用Lockdown Mode以增强安全性。  
## 二、发现时间线  
  
![Coruna iOS漏洞利用工具包时间线](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6Onpw6zWuRlnyibovNx2YSB26FzLggDibO3tC9OfWf2We3WuPwtk8J2u8r9jqacuCNG2gQich7UC1Aw0icichwQEabBzUAatjPFQDsw/640?wx_fmt=png "Coruna iOS漏洞利用工具包时间线")  
 # 来源：Google Cloud Blog  
### 首次发现：商业监控供应商的角色  
  
2025年2月，我们捕获了由监控公司客户使用的iOS漏洞利用链的部分内容。这些漏洞被集成到一个此前未见过的JavaScript框架中，该框架使用了简单但独特的JavaScript混淆技术。  
```
[16, 22, 0, 69, 22, 17, 23, 12, 6, 17].map(x => {return String.fromCharCode(x ^ 101);}).join("")
```  
```
i.p1=(1111970405 ^ 1111966034);
```  
  
JavaScript框架使用这些构造来编码字符串和整数。  
  
该框架启动了一个指纹识别模块，收集各种数据点以确定设备是否真实，以及运行的是何种特定iPhone型号和iOS软件版本。根据收集的数据，它加载适当的WebKit远程代码执行（RCE）漏洞利用，然后是指针身份验证代码（PAC）绕过。  
  
![Coruna漏洞利用工具包的去混淆JavaScript](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6MkhWRNNWceku5RkgEIkeHyTz1DkETKyXIPibNULMjaVzMRm9LaS1pj3kxdfKwaRuP6zd6AicvHMwxcVfZKP2KrpRVNU1CC7cbCw/640?wx_fmt=png "Coruna漏洞利用工具包的去混淆JavaScript")  
 # 来源：Google Cloud Blog  
  
当时，我们恢复了交付给运行iOS 17.2设备的WebKit RCE，并确定这是CVE-2024-23222，这是一个此前被识别为零日漏洞的漏洞，Apple在2024年1月22日在iOS 17.3中修补了该漏洞，但未向任何外部研究人员致谢。下图展示了RCE漏洞利用的开头部分，完全按照在野外发现的形式交付。  
  
![RCE漏洞利用的交付方式](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6O3s1nTZdEILAJj3icCM9WTe8iaq3Wnz8MsknjXWjxsg1x094l2ibpY0pxos2GsVxmrIwaEOgicM5PLOmnvYLIuHanxkiaUpib2mBtg0/640?wx_fmt=png "RCE漏洞利用的交付方式")  
 # 来源：Google Cloud Blog  
### 政府支持的威胁攻击者使用  
  
2025年夏季，我们注意到相同的JavaScript框架托管在cdn.uacounter[.]com上，该网站作为隐藏iFrame加载在许多受感染的乌克兰网站上，涵盖工业设备、零售工具到本地服务和电子商务网站。该框架仅向来自特定地理位置的选定iPhone用户交付。  
  
框架完全相同并交付相同的漏洞利用集。我们收集了WebKit RCE，其中包括CVE-2024-23222、CVE-2022-48503和CVE-2023-43000，然后服务器被关闭。我们提醒并与CERT-UA合作清理了所有受感染的网站。  
### 从中国诈骗网站获取完整漏洞链  
  
年底时，我们在大量与中国金融相关的虚假网站上发现了相同的JavaScript框架，投放了完全相同的iOS漏洞利用工具包。这些网站试图说服用户使用iOS设备访问这些网站，下图取自虚假的WEEX加密货币交易所网站。  
  
![虚假加密货币交易所网站上的弹出窗口](https://mmbiz.qpic.cn/mmbiz_png/nGzNudUIJ6PB9qHKXUiaw5EMTIgeOquAt5Rb460P2Fdhy017b0ATRw7JjuoVF9Me14Gc1EuJ2SA1KyrBxAKsWU2mjdKJYNibuiaoESkqoh7vlU/640?wx_fmt=png "虚假加密货币交易所网站上的弹出窗口")  
 # 来源：Google Cloud Blog  
  
通过iOS设备访问这些网站时，无论地理位置如何，都会注入一个隐藏的iFrame来投放漏洞利用工具包。作为示例，下图展示了在3v5w1km5gv[.]xyz上发现的相同CVE-2024-23222漏洞利用。  
  
![从诈骗网站恢复的CVE-2024-23222漏洞利用截图](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6MpawIHfr4pBQjOldpKnB24JTKkOibqQvkNDoicnyUtvItd1cNXibOsqjodYSst27GdkLo6uEicuiav8EzlzJa7U8zhJ1wq0mRz6KwY/640?wx_fmt=png "从诈骗网站恢复的CVE-2024-23222漏洞利用截图")  
 # 来源：Google Cloud Blog  
  
我们检索了所有混淆的漏洞利用，包括最终有效载荷。经过进一步分析，我们注意到攻击者部署了漏洞利用工具包的调试版本，留下了所有漏洞利用的明文，包括其内部代码名称。正是在那时，我们了解到该漏洞利用工具包在内部可能被称为Coruna。  
  
总共收集了数百个样本，涵盖五条完整的iOS漏洞利用链。该漏洞利用工具包能够针对运行iOS 13.0（2019年9月发布）至iOS 17.2.1（2023年12月发布）的各种iPhone型号。  
## 三、Coruna漏洞利用工具包  
  
围绕漏洞利用工具包的框架设计得非常出色；所有漏洞利用片段自然连接在一起，并使用常见的工具和漏洞利用框架组合在一起。该工具包执行以下独特操作：  
- 如果设备处于Lockdown Mode或用户处于私密浏览模式，则退出。  
  
- 使用独特的硬编码Cookie以及生成资源URL的方式。  
  
- 资源通过哈希引用，需要使用sha256(COOKIE + ID)[:40]  
派生唯一Cookie来获取其URL。  
  
- RCE和PAC绕过以未加密形式交付。  
  
该工具包包含一个二进制加载器，用于在WebKit中RCE后加载适当的漏洞利用链。在这种情况下，二进制有效载荷具有独特的元数据，指示它们的真实身份、支持的芯片和iOS版本。  
  
这些有效载荷具有以下特征：  
- 具有独特的元数据，指示其真实身份、支持的芯片和iOS版本。  
  
- 从以.min.js结尾的URL提供。  
  
- 使用ChaCha20加密，每个blob使用唯一密钥。  
  
- 打包在自定义文件格式中，以0xf00dbeef作为文件头。  
  
- 使用Lempel-Ziv-Welch（LZW）算法压缩。  
  
下图展示了从网络角度看待运行iOS 15.8.5的iPhone XR感染的情况，图中标注了浏览这些虚假金融网站时的不同部分。  
  
![在iOS 15.8.5上交付的Coruna漏洞利用链](https://mmbiz.qpic.cn/sz_mmbiz_png/nGzNudUIJ6MjCPaFOSamJeWlosicV0e1l1MX2hKDRpu6KiczcOEVFqADpzMrEMCrTYFs3ehu300tBs2Jd7hR38NB1mYVLm2HiacMtianT2DJA9A/640?wx_fmt=png "在iOS 15.8.5上交付的Coruna漏洞利用链")  
 # 来源：Google Cloud Blog  
## 四、漏洞利用及其代码名称  
  
该漏洞利用工具包的核心技术价值在于其全面的iOS漏洞收集。这些漏洞包含大量文档，包括用原生英语编写的文档字符串和注释。最先进的漏洞利用技术采用了非公开的利用技术和缓解措施绕过方法。下表提供了我们 ongoing分析 regarding the various exploit chains的摘要；但是，由于完整调查仍在进行中，某些CVE关联可能会发生变化。总共有23个漏洞，覆盖iOS 13到iOS 17.2.1版本。  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">类型</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">代码名称</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">目标版本（包含）</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">修复版本</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">CVE</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent R/W</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">buffout</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">13 → 15.1.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2021-30952</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent R/W</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">jacurutu</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.2 → 15.5</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2022-48503</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent R/W</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">bluebird</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.6 → 16.1.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent R/W</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">terrorbird</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.2 → 16.5.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2023-43000</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent R/W</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">cassowary</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.6 → 17.2.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.7.5, 17.3</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2024-23222</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent PAC绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">breezy</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">13 → 14.x</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">?</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent PAC绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">breezy15</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15 → 16.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">?</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent PAC绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">seedbell</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.3 → 16.5.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">?</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent PAC绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">seedbell_16_6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.6 → 16.7.12</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">?</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent PAC绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">seedbell_17</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17 → 17.2.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">?</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent沙箱逃逸</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">IronLoader</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.0 → 16.3.1、16.4.0 (≤A12)</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.7.8, 16.5</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2023-32409</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">WebContent沙箱逃逸</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">NeuronLoader</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.4.0 → 16.6.1 (A13-A16)</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17.0</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Neutron</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">13.X</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2020-27932</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE（信息泄露）</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Dynamo</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">13.X</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.2</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2020-27950</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Pendulum</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14 → 14.4.x</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.7</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Photon</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.5 → 15.7.6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.7.7, 16.5.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2023-32434</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Parallax</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.4 → 16.7</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17.0</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2023-41974</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PE</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Gruber</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.2 → 17.2.1</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.7.6, 17.3</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PPL绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Quark</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">13.X</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.5</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PPL绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Gallium</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">14.x</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.7.8, 16.6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2023-38606</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PPL绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Carbone</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">15.0 → 16.7.6</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17.0</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">无CVE</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PPL绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Sparrow</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17.0 → 17.3</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.7.6, 17.4</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2024-23225</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">PPL绕过</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">Rocket</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">17.1 → 17.4</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">16.7.8, 17.5</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">CVE-2024-23296</span></section></td></tr></tbody></table>  
Photon和Gallium是利用的漏洞，这些漏洞也是Kaspersky在2023年发现的Triangulation行动中作为零日漏洞使用的漏洞。Coruna漏洞利用工具包还嵌入了可重复使用的模块，以简化上述漏洞的利用。例如，有一个名为rwx_allocator  
的模块，使用多种技术来绕过各种缓解措施，防止在用户空间分配RWX内存页面。内核漏洞利用还嵌入了各种内部模块，允许它们绕过基于内核的缓解措施，如内核模式PAC。  
## 五、最终有效载荷  
  
在漏洞利用链的末尾，一个名为PlasmaLoader  
的分阶段二进制文件（由GTIG追踪为PLASMAGRID）使用com.apple.assistd作为标识符，促进与漏洞利用建立的内核组件的通信。该加载器将自己注入powerd，这是一个在iOS上以root身份运行的守护进程。  
  
注入的有效载荷没有表现出我们通常期望从监控供应商那里看到的功能，而是窃取金融信息。该有效载荷可以从磁盘上的图像中解码QR码。它还有一个模块用于分析文本blob，以查找BIP39单词序列或非常特定的关键词，如"backup phrase"或"bank account"。如果在Apple Memos中找到此类文本，它将被发送回C2。  
  
更重要的是，该有效载荷能够远程收集和运行其他模块，从http://<C2 URL>/details/show.html  
检索配置。配置以及其他模块被打包为受唯一硬编码密码保护的7-ZIP存档。配置以JSON编码，简单地包含模块名称列表及其各自的URL、哈希和大小。  
```
{ "entries":[{"bundleId":"com.bitkeep.os","url":"http://<C2URL>/details/f6lib.js","sha256":"6eafd742f58db21fbaf5fd7636e6653446df04b4a5c9bca9104e5dfad34f547c","size":256832,"flags":{"do_not_close_after_run":true}}...]}
```  
  
正如预期的那样，绝大多数已识别的模块都表现出统一的设计；它们都放置了用于窃取以下应用程序的加密钱包或敏感信息的函数钩子：  
- com.bitkeep.os  
  
- com.bitpie.wallet  
  
- coin98.crypto.finance.insights  
  
- org.toshi.distribution  
  
- exodus-movement.exodus  
  
- im.token.app  
  
- com.kyrd.krystal.ios  
  
- io.metamask.MetaMask  
  
- org.mytonwallet.app  
  
- app.phantom  
  
- com.skymavis.Genesis  
  
- com.solflare.mobile  
  
- com.global.wallet.ios  
  
- com.tonhub.app  
  
- com.jbig.tonkeeper  
  
- com.tronlink.hdwallet  
  
- com.sixdays.trust  
  
- com.uniswap.mobile  
  
所有这些模块都包含用中文编写的适当日志：  
```
<PlasmaLogger> %s[%d]: CorePayload 管理器初始化成功，尝试启动...
```  
  
此日志字符串表示CorePayload Manager已成功初始化。  
  
某些注释还包含表情符号，并以可能由LLM生成的方式编写，如下所示：  
```
<PlasmaLogger> %s[%d]: [PLCoreHeartbeatMonitor] ✅ 心跳监控已启动 (端口=0x%x)，等待 CorePayload 发送第一个心跳...
```  
  
网络通信通过HTTPS进行，收集的数据使用AES加密并POST，使用静态字符串的SHA256哈希作为密钥。某些HTTP请求包含其他HTTP标头，如sdkv  
或x-ts  
，后跟时间戳。该植入程序包含硬编码的C2列表，但如果服务器没有响应，则有回退机制。该植入程序嵌入了使用字符串"lazarus"作为种子生成可预测域列表的自定义域生成算法（DGA）。这些域将有15个字符，并使用.xyz作为TLD。攻击者使用Google的公共DNS解析器来验证这些域是否处于活动状态。  
## 六、结论  
  
Google一直是Pall Mall进程的坚定参与者，该进程旨在建立共识并推进限制间谍软件行业危害的努力。这些努力建立在早期政府行动的基础上，包括美国政府为限制政府使用间谍软件而采取的措施，以及首次此类国际承诺，以开展类似工作。  
## 七、致谢  
  
我们要感谢Google Project-Zero和Apple Security Engineering & Architecture团队在整个调查过程中的合作。  
## 八、妥协指标（IOC）  
### 文件指标  
#### 植入程序  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">bundleId</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">SHA-256</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.apple.assistd</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2a9d21ca07244932939c6c58699448f2147992c1f49cd3bc7d067bd92cb54f3a</span></section></td></tr></tbody></table>#### 模块  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">bundleId</span></strong></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">SHA-256</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.apple.springboard</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">18394fcc096344e0730e49a0098970b1c53c137f679cff5c7ff8902e651cd8a3</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.bitkeep.os</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">6eafd742f58db21fbaf5fd7636e6653446df04b4a5c9bca9104e5dfad34f547c</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.bitpie.wallet</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">42cc02cecd65f22a3658354c5a5efa6a6ec3d716c7fbbcd12df1d1b077d2591b</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">coin98.crypto.finance.insights</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">0dff17e3aa12c4928273c70a2e0a6fff25d3e43c0d1b71056abad34a22b03495</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">org.toshi.distribution</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">05b5e4070b3b8a130b12ea96c5526b4615fcae121bb802b1a10c3a7a70f39901</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">exodus-movement.exodus</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">10bd8f2f8bb9595664bb9160fbc4136f1d796cb5705c551f7ab8b9b1e658085c</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">im.token.app</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">91d44c1f62fd863556aac0190cbef3b46abc4cbe880f80c580a1d258f0484c30</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.kyrd.krystal.ios</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">721b46b43b7084b98e51ab00606f08a6ccd30b23bef5e542088f0b5706a8f780</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">io.metamask.MetaMask</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">25a9b004cf61fb251c8d4024a8c7383a86cb30f60aa7d59ca53ce9460fcfb7de</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">org.mytonwallet.app</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">be28b40df919d3fa87ed49e51135a719bd0616c9ac346ea5f20095cb78031ed9</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">app.phantom</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">3c297829353778857edfeaed3ceeeca1bf8b60534f1979f7d442a0b03c56e541</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.skymavis.Genesis</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">499f6b1e012d9bc947eea8e23635dfe6464cd7c9d99eb11d5874bd7b613297b1</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.solflare.mobile</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">d517c3868c5e7808202f53fa78d827a308d94500ae9051db0a62e11f7852e802</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.global.wallet.ios</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">4dfcf5a71e5a8f27f748ac7fd7760dec0099ce338722215b4a5862b60c5b2bfd</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.tonhub.app</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">d371e3bed18ee355438b166bbf3bdaf2e7c6a3af8931181b9649020553b07e7a</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.jbig.tonkeeper</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">023e5fb71923cfa2088b9a48ad8566ff7ac92a99630add0629a5edf4679888de</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.tronlink.hdwallet</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">f218068ea943a511b230f2a99991f6d1fbc2ac0aec7c796b261e2a26744929ac</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.sixdays.trust</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">1fb9dedf1de81d387eff4bd5e747f730dd03c440157a66f20fdb5e95f64318c0</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">com.uniswap.mobile</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">4dc255504a6c3ea8714ccdc95cc04138dc6c92130887274c8582b4a96ebab4a8</span></section></td></tr></tbody></table>### 网络指标  
#### UNC6353指标  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">交付Coruna漏洞利用工具包的URL</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://cdn[.]uacounter[.]com/stat[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[1]</span></sup></section></td></tr></tbody></table>#### UNC6691指标  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">交付Coruna漏洞利用工具包的URL</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://ai-scorepredict[.]com/static/analytics[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[2]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://m[.]pc6[.]com/test/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[3]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://ddus17[.]com/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[4]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://goodcryptocurrency[.]top/details/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[5]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://pepeairdrop01[.]com/static/analytics[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[6]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://osec2[.]668ddf[.]cc/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[7]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://pepeairdrop01[.]com/static/analytics[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[8]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://ios[.]teegrom[.]top/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[9]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://i[.]binaner[.]com/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[10]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://ajskbnrs[.]xn--jor0b302fdhgwnccw8g[.]com/gogo/list[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[11]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://sj9ioz3a7y89cy7[.]xyz/list[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[12]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://65sse[.]668ddf[.]cc/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[13]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://sadjd[.]mijieqi[.]cn/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[14]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://mkkku[.]com/static/analytics[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[15]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://dbgopaxl[.]com/static/goindex/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[16]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://w2a315[.]tubeluck[.]com/static/goindex/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[17]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://ose[.]668ddf[.]cc/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[18]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://cryptocurrencyworld[.]top/details/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[19]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://iphonex[.]mjdqw[.]cn/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[20]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://goodcryptocurrency[.]top/details/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[21]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://share[.]4u[.]game/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[22]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://26a[.]online/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[23]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://binancealliancesintro[.]com/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[24]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://4u[.]game/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[25]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://bestcryptocurrency[.]top/details/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[26]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://b27[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[27]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://h4k[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[28]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://so5083[.]tubeluck[.]com/static/goindex/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[29]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://seven7[.]vip/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[30]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://y4w[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[31]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://7ff[.]online/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[32]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://cy8[.]top/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[33]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://7uspin[.]us/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[34]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://seven7[.]to/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[35]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://4kgame[.]us/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[36]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://share[.]7p[.]game/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[37]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://www[.]appstoreconn[.]com/xmweb/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[38]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://k96[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[39]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://7fun[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[40]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://n49[.]top/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[41]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://98a[.]online/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[42]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://spin7[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[43]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://t7c[.]icu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[44]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://7p[.]game/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[45]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://lddx3z2d72aa8i6[.]xyz/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[46]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://anygg[.]liquorfight[.]com/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[47]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://goanalytics[.]xyz/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[48]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://land[.]77bingos[.]com/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[49]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://land[.]bingo777[.]now/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[50]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://land[.]bingo777[.]now/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[51]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">http://land[.]777bingos[.]xyz/88k4ez/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[52]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://btrank[.]top/tuiliu/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[53]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://dd9l7e6ghme8pbk[.]xyz/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[54]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://res54allb[.]xn--xkrsa0078bd6d[.]com/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[55]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://fxrhcnfwxes90q[.]xyz/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[56]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://kanav[.]blog/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[57]</span></sup></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">https://3v5w1km5gv[.]xyz/group[.]html</span><sup style="color: rgb(72, 112, 172);"><span leaf="">[58]</span></sup></section></td></tr></tbody></table><table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><strong style="color: rgb(72, 112, 172);"><span leaf="">PLASMAGRID C2域名</span></strong></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">vvri8ocl4t3k8n6.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">rlau616jc7a7f7i.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">ol67el6pxg03ad7.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">6zvjeulzaw5c0mv.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">ztvnhmhm4zj95w3.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">v2gmupm7o4zihc3.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">pen0axt0u476duw.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">hfteigt3kt0sf3z.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">xfal48cf0ies7ew.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">yvgy29glwf72qnl.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">lk4x6x2ejxaw2br.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">2s3b3rknfqtwwpo.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">xjslbdt9jdijn15.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">hui4tbh9uv9x4yi.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">xittgveqaufogve.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">xmmfrkq9oat1daq.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">lsnngjyu9x6vcg0.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">gdvynopz3pa0tik.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">o08h5rhu2lu1x0q.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">zcjdlb5ubkhy41u.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">8fn4957c5g986jp.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">uawwydy3qas6ykv.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">sf2bisx5nhdkygn3l.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">roy2tlop2u.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">gqjs3ra34lyuvzb.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">eg2bjo5x5r8yjb5.xyz</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">b38w09ecdejfqsf.xyz</span></section></td></tr></tbody></table>  
**原文来源**  
：Google Cloud Blog - Google Threat Intelligence Group  
### 引用链接  
  
[1]  
http://cdn[.]uacounter[.]com/stat[.]html: http://cdn%5B.%5Duacounter%5B.%5Dcom/stat%5B.%5Dhtml  
  
[2]  
https://ai-scorepredict[.]com/static/analytics[.]html: https://ai-scorepredict%5B.%5Dcom/static/analytics%5B.%5Dhtml  
  
[3]  
https://m[.]pc6[.]com/test/tuiliu/group[.]html: https://m%5B.%5Dpc6%5B.%5Dcom/test/tuiliu/group%5B.%5Dhtml  
  
[4]  
http://ddus17[.]com/tuiliu/group[.]html: http://ddus17%5B.%5Dcom/tuiliu/group%5B.%5Dhtml  
  
[5]  
https://goodcryptocurrency[.]top/details/group[.]html: https://goodcryptocurrency%5B.%5Dtop/details/group%5B.%5Dhtml  
  
[6]  
http://pepeairdrop01[.]com/static/analytics[.]html: http://pepeairdrop01%5B.%5Dcom/static/analytics%5B.%5Dhtml  
  
[7]  
https://osec2[.]668ddf[.]cc/tuiliu/group[.]html: https://osec2%5B.%5D668ddf%5B.%5Dcc/tuiliu/group%5B.%5Dhtml  
  
[8]  
https://pepeairdrop01[.]com/static/analytics[.]html: https://pepeairdrop01%5B.%5Dcom/static/analytics%5B.%5Dhtml  
  
[9]  
https://ios[.]teegrom[.]top/tuiliu/group[.]html: https://ios%5B.%5Dteegrom%5B.%5Dtop/tuiliu/group%5B.%5Dhtml  
  
[10]  
https://i[.]binaner[.]com/group[.]html: https://i%5B.%5Dbinaner%5B.%5Dcom/group%5B.%5Dhtml  
  
[11]  
https://ajskbnrs[.]xn--jor0b302fdhgwnccw8g[.]com/gogo/list[.]html: https://ajskbnrs%5B.%5Dxn--jor0b302fdhgwnccw8g%5B.%5Dcom/gogo/list%5B.%5Dhtml  
  
[12]  
https://sj9ioz3a7y89cy7[.]xyz/list[.]html: https://sj9ioz3a7y89cy7%5B.%5Dxyz/list%5B.%5Dhtml  
  
[13]  
https://65sse[.]668ddf[.]cc/tuiliu/group[.]html: https://65sse%5B.%5D668ddf%5B.%5Dcc/tuiliu/group%5B.%5Dhtml  
  
[14]  
https://sadjd[.]mijieqi[.]cn/group[.]html: https://sadjd%5B.%5Dmijieqi%5B.%5Dcn/group%5B.%5Dhtml  
  
[15]  
https://mkkku[.]com/static/analytics[.]html: https://mkkku%5B.%5Dcom/static/analytics%5B.%5Dhtml  
  
[16]  
https://dbgopaxl[.]com/static/goindex/tuiliu/group[.]html: https://dbgopaxl%5B.%5Dcom/static/goindex/tuiliu/group%5B.%5Dhtml  
  
[17]  
https://w2a315[.]tubeluck[.]com/static/goindex/tuiliu/group[.]html: https://w2a315%5B.%5Dtubeluck%5B.%5Dcom/static/goindex/tuiliu/group%5B.%5Dhtml  
  
[18]  
https://ose[.]668ddf[.]cc/tuiliu/group[.]html: https://ose%5B.%5D668ddf%5B.%5Dcc/tuiliu/group%5B.%5Dhtml  
  
[19]  
http://cryptocurrencyworld[.]top/details/group[.]html: http://cryptocurrencyworld%5B.%5Dtop/details/group%5B.%5Dhtml  
  
[20]  
https://iphonex[.]mjdqw[.]cn/tuiliu/group[.]html: https://iphonex%5B.%5Dmjdqw%5B.%5Dcn/tuiliu/group%5B.%5Dhtml  
  
[21]  
http://goodcryptocurrency[.]top/details/group[.]html: http://goodcryptocurrency%5B.%5Dtop/details/group%5B.%5Dhtml  
  
[22]  
https://share[.]4u[.]game/group[.]html: https://share%5B.%5D4u%5B.%5Dgame/group%5B.%5Dhtml  
  
[23]  
https://26a[.]online/group[.]html: https://26a%5B.%5Donline/group%5B.%5Dhtml  
  
[24]  
https://binancealliancesintro[.]com/group[.]html: https://binancealliancesintro%5B.%5Dcom/group%5B.%5Dhtml  
  
[25]  
https://4u[.]game/group[.]html: https://4u%5B.%5Dgame/group%5B.%5Dhtml  
  
[26]  
http://bestcryptocurrency[.]top/details/group[.]html: http://bestcryptocurrency%5B.%5Dtop/details/group%5B.%5Dhtml  
  
[27]  
https://b27[.]icu/group[.]html: https://b27%5B.%5Dicu/group%5B.%5Dhtml  
  
[28]  
https://h4k[.]icu/group[.]html: https://h4k%5B.%5Dicu/group%5B.%5Dhtml  
  
[29]  
https://so5083[.]tubeluck[.]com/static/goindex/group[.]html: https://so5083%5B.%5Dtubeluck%5B.%5Dcom/static/goindex/group%5B.%5Dhtml  
  
[30]  
https://seven7[.]vip/group[.]html: https://seven7%5B.%5Dvip/group%5B.%5Dhtml  
  
[31]  
https://y4w[.]icu/group[.]html: https://y4w%5B.%5Dicu/group%5B.%5Dhtml  
  
[32]  
https://7ff[.]online/group[.]html: https://7ff%5B.%5Donline/group%5B.%5Dhtml  
  
[33]  
https://cy8[.]top/group[.]html: https://cy8%5B.%5Dtop/group%5B.%5Dhtml  
  
[34]  
https://7uspin[.]us/group[.]html: https://7uspin%5B.%5Dus/group%5B.%5Dhtml  
  
[35]  
https://seven7[.]to/group[.]html: https://seven7%5B.%5Dto/group%5B.%5Dhtml  
  
[36]  
https://4kgame[.]us/group[.]html: https://4kgame%5B.%5Dus/group%5B.%5Dhtml  
  
[37]  
https://share[.]7p[.]game/group[.]html: https://share%5B.%5D7p%5B.%5Dgame/group%5B.%5Dhtml  
  
[38]  
https://www[.]appstoreconn[.]com/xmweb/group[.]html: https://www%5B.%5Dappstoreconn%5B.%5Dcom/xmweb/group%5B.%5Dhtml  
  
[39]  
https://k96[.]icu/group[.]html: https://k96%5B.%5Dicu/group%5B.%5Dhtml  
  
[40]  
https://7fun[.]icu/group[.]html: https://7fun%5B.%5Dicu/group%5B.%5Dhtml  
  
[41]  
https://n49[.]top/group[.]html: https://n49%5B.%5Dtop/group%5B.%5Dhtml  
  
[42]  
https://98a[.]online/group[.]html: https://98a%5B.%5Donline/group%5B.%5Dhtml  
  
[43]  
https://spin7[.]icu/group[.]html: https://spin7%5B.%5Dicu/group%5B.%5Dhtml  
  
[44]  
https://t7c[.]icu/group[.]html: https://t7c%5B.%5Dicu/group%5B.%5Dhtml  
  
[45]  
https://7p[.]game/group[.]html: https://7p%5B.%5Dgame/group%5B.%5Dhtml  
  
[46]  
https://lddx3z2d72aa8i6[.]xyz/group[.]html: https://lddx3z2d72aa8i6%5B.%5Dxyz/group%5B.%5Dhtml  
  
[47]  
https://anygg[.]liquorfight[.]com/88k4ez/group[.]html: https://anygg%5B.%5Dliquorfight%5B.%5Dcom/88k4ez/group%5B.%5Dhtml  
  
[48]  
https://goanalytics[.]xyz/88k4ez/group[.]html: https://goanalytics%5B.%5Dxyz/88k4ez/group%5B.%5Dhtml  
  
[49]  
http://land[.]77bingos[.]com/88k4ez/group[.]html: http://land%5B.%5D77bingos%5B.%5Dcom/88k4ez/group%5B.%5Dhtml  
  
[50]  
https://land[.]bingo777[.]now/88k4ez/group[.]html: https://land%5B.%5Dbingo777%5B.%5Dnow/88k4ez/group%5B.%5Dhtml  
  
[51]  
http://land[.]bingo777[.]now/88k4ez/group[.]html: http://land%5B.%5Dbingo777%5B.%5Dnow/88k4ez/group%5B.%5Dhtml  
  
[52]  
http://land[.]777bingos[.]xyz/88k4ez/group[.]html: http://land%5B.%5D777bingos%5B.%5Dxyz/88k4ez/group%5B.%5Dhtml  
  
[53]  
https://btrank[.]top/tuiliu/group[.]html: https://btrank%5B.%5Dtop/tuiliu/group%5B.%5Dhtml  
  
[54]  
https://dd9l7e6ghme8pbk[.]xyz/group[.]html: https://dd9l7e6ghme8pbk%5B.%5Dxyz/group%5B.%5Dhtml  
  
[55]  
https://res54allb[.]xn--xkrsa0078bd6d[.]com/group[.]html: https://res54allb%5B.%5Dxn--xkrsa0078bd6d%5B.%5Dcom/group%5B.%5Dhtml  
  
[56]  
https://fxrhcnfwxes90q[.]xyz/group[.]html: https://fxrhcnfwxes90q%5B.%5Dxyz/group%5B.%5Dhtml  
  
[57]  
https://kanav[.]blog/group[.]html: https://kanav%5B.%5Dblog/group%5B.%5Dhtml  
  
[58]  
https://3v5w1km5gv[.]xyz/group[.]html: https://3v5w1km5gv%5B.%5Dxyz/group%5B.%5Dhtml  
  
