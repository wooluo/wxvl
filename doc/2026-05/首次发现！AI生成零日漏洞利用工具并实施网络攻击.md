#  首次发现！AI生成零日漏洞利用工具并实施网络攻击  
e安在线
                    e安在线  e安在线   2026-05-14 02:07  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9kP6mKAQcibJcs5dW4wZ1uuIV4TkmJXMed7F8B0QC2TvjcnnjuL2n7J0IlTjex0D98dWhPYTJc1egZZB1vMVvWoUzicW8tCgavibg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9mCrBmfSZTbjcDglqdTFJnEVgkbzib1ibrkMvHle9XZibTL5CUyEq2aoPsqLN1Klf33ZuyOqpP7zQshsOibDBYkvuhoeCbQLLZd1AQ/640?wx_fmt=png&from=appmsg "")  
  
  
谷歌研究人员披露，首次发现攻击者疑似利用AI，生成了某款流行Web管理工具的零日漏洞利用程序，并实施网络攻击。  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Hxdb7gjfn9l0W0XkqibOTD4EbrhcdyPe30EvZHhNhgJYsgvuv5IVbOR5SqPY0xs6AIj2Jl1uPy6pEdRiaotMsmH3L9kkyC8bugfa77aTNaiboQ/640?wx_fmt=jpeg&from=appmsg "")  
  
  
谷歌威胁情报小组（GTIG）的研究人员表示，一款针对流行开源Web管理工具的零日漏洞利用程序，很可能由AI生成。  
  
  
该漏洞利用程序可用于绕过一款流行的Web开源系统管理工具中的双因素认证（2FA）保护，但该工具名称尚未公开。  
  
  
尽管此次攻击在进入大规模利用阶段前就被成功阻止，但这一事件表明，威胁行为者正越来越依赖AI辅助开展漏洞发现与漏洞利用活动。  
  
  
  
**首次发现攻击者利用**  
  
**AI生成的零日漏洞利用实施攻击**  
  
  
  
根据这段Python漏洞利用代码的结构与内容，谷歌高度确信，攻击者使用了AI模型来发现并武器化该漏洞。  
  
  
谷歌威胁情报小组在今日发布的一份报告中表示：“例如，该脚本包含大量具有教学性质的文档字符串，其中甚至包括一个虚构的CVSS评分。此外，它采用了结构化、教科书式的Python编码风格，这种特征与大模型训练数据的风格高度一致。”  
  
  
目前尚不清楚攻击者具体使用了哪一种大模型来执行恶意任务，但谷歌已排除Gemini参与其中的可能性。  
  
  
另一个表明漏洞发现过程中使用了大模型工具的证据，在于该漏洞本身的性质。这是一个高层语义逻辑漏洞，而AI系统尤其擅长识别这类漏洞，相比之下，传统模糊测试或静态分析更常发现的是内存损坏或输入清理问题。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Hxdb7gjfn9lrzql8TRmnqhK3uia2gEaibrHLJrNkMGS31gAsfUTjGMHKibribAzica2Pd5Ng1toGmicUlDEHshJhkib70BricWgwh9H0oJmlFcyTMB0/640?wx_fmt=jpeg&from=appmsg "")  
  
图：漏洞发现工具对比  
  
  
谷歌已将这一重大威胁通报给相关软件开发商，并及时采取措施阻止了此次攻击。  
  
  
谷歌威胁情报小组研究人员表示：“这是我们首次发现威胁行为者使用我们认为由AI开发的零日漏洞利用程序。”  
  
  
  
**全球APT组织大量使用AI**  
  
**进行漏洞发现和利用开发**  
  
  
  
除这一案例外，谷歌指出，包括APT27、APT45、UNC2814、UNC5673和UNC6201在内的朝鲜等国黑客组织，一直在利用AI模型进行漏洞发现和漏洞利用开发。这延续了谷歌在今年2月报告中观察到的趋势。  
  
  
研究人员还发现，与俄罗斯有关联的行为者正在利用AI生成的诱饵代码，对CANFAIL和LONGSTREAM等恶意软件进行混淆。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Hxdb7gjfn9nsSuUKRC3bOYSXwAUiaL8icUnlLb0EY36CyczUiceJRoXwcPMVMw2Peqjz4fYFc3Vbxgme1s2RNVzGd7vVichxovQVDcrv8SIkYfo/640?wx_fmt=jpeg&from=appmsg "")  
  
图：CANFAIL中用于诱饵逻辑的代码注释  
  
  
谷歌还重点提到了一项代号为“Overload”的俄罗斯行动。在该行动中，从事社会工程攻击的威胁行为者使用AI语音克隆技术，在虚假视频中冒充真实记者，以传播反乌克兰叙事。  
  
  
谷歌的报告还提及ESET今年早些时候披露的安卓后门程序PromptSpy。该程序集成了GeminiAPI，可实现自主设备交互。  
  
  
此外，谷歌还发现了一个名为“GeminiAutomationAgent”的自主智能体模块。该模块通过硬编码提示词，使恶意软件能够以自动化方式与设备进行交互。  
  
  
研究人员表示，这些提示词的作用是为系统赋予一个无害的人设，从而绕过LLM的安全机制。其目标是计算用户界面边界的几何信息，而PromptSpy则可利用这些信息，以多种方式与设备进行交互。  
  
  
此外，谷歌研究人员表示，该恶意软件还利用基于AI的功能，在设备上重放认证信息，无论是锁屏图案还是PIN码都包括在内。  
  
  
谷歌警告称，威胁行为者如今正通过自动化账号创建、代理中继以及账号池基础设施等方式，工业化获取高级AI模型的访问权限。  
  
  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9mGtuAHiciccL6HRicofzibibHKxjpbmnQxho7ibVNA7rCd8gLHYdIgs5q0XsaNibO1QNIpxNEj5AgXZvXx2UpicZVxofgYhLZiclYntja8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9lOKGMTJUCu7fuss5TPw6dEF3223X5Z4P4icYbvtre5XVxuMzs45AU4ZXtkvGQjROq3GHnOWDLcxMd4qib4kqAL2rYuKfUEF1PuM/640?wx_fmt=png&from=appmsg "")  
  
  
声明：除发布的文章无法追溯到作者并获得授权外，我们均会注明作者和文章来源。如涉及版权问题请及时联系我们，我们会在第一时间删改，谢谢！文章来源：安全内参  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9lmwHS6ibonpPmvSPCj2sWS5ictZ17ej9ibJUkWm34uicT9X3tsRSXwUEgXu0Cm7Owjowq9dcRpZPwon6WXPgqXPCTv3wJ3CVyiak1Q/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9lNzQuoqWo3uC63KoqUChZw1JNjoavZHcuicQdic5HTRxEFOuicsWONiafAhANCtv3VRr1uG8ftXhoCia9kemYs2S9xO92pNCJgUTics/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9nsAEPfT8d6aethKjUL0EfpyYVKFkU0ic7H5zibAicKXk2jQophGfVL7CRz40Qkibmt7Vib4JF90ibCcdRgwQvOxxyf354cFKQySgtyM/640?wx_fmt=png&from=appmsg "")  
  
  
  
