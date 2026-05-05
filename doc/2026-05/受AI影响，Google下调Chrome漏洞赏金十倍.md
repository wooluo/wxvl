#  受AI影响，Google下调Chrome漏洞赏金十倍  
原创 玄月调查小组
                    玄月调查小组  玄月调查小组   2026-05-05 06:18  
  
## AI改变漏洞挖掘行业  
  
过去几年，AI以一种毁灭性的方式，席卷了整个网络安全行业。  
  
Claude Mythos、GPT 5.4 Cyber，还有Google自己的Big Sleep、CodeMender。  
  
这些模型或是AI Agent能自动化完成代码分析、根因定位、补丁建议。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFticqjmVswV0ick9XPz9lQoIJc6ciahibgOd0RpsS7wicYsrCUt1HcKeIkibib9HhPl20xhJMjRK84FUeAO1kSuVCAeib4LmfjBupDibqn78/640?wx_fmt=png&from=appmsg "")  
  
所以Google在公告里也坦然承认了AI对漏洞挖掘的影响：  
> 过去几年间，AI 与自动化技术加速了漏洞发现的进程， 我们的团队正以前所未有的速度推进工作。  
  
  
**曾经只有顶尖黑客能做的事，现在AI一下就能完成。**  
  
漏洞提交量出现了爆炸式增长，虽然也混进去了很多的AI**幻觉**  
。  
  
所以Google还强调了：  
  
提交未经核实、自动化或AI生成的**幻觉**  
发现将被视为违反行为准则。  
  
信噪比低的账户将受到自动速率限制，并可能被永久移出该计划。  
## 关注AI还做不到的事  
  
Google没有选择封杀AI。  
  
它选择了重构整个赏金体系。  
  
从奖励"发现漏洞"。  
  
转向关注"发现AI发现不了的完整利用链漏洞"。  
  
**Android：顶级赏金暴涨50%**  
  
针对Pixel手机**Titan M2安全芯片**  
的0 click全链路持久化漏洞，最高直接从100万美元升至**150万美元**  
。  
  
没有持久化的同类漏洞，也从50万美元涨到了**75万美元**  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFtibRZ3j6guwrEr9wSTTTlib0k54icdMM6JtRrCMf7AUTz6q4ktKr1VurLjrroiaBaN8tWSs6q4YicPTv5ZbjaJCKgQdoqI89AvzxibYQ/640?wx_fmt=png&from=appmsg "")  
  
同时，Google大幅收窄了奖励范围。  
  
Linux内核的通用漏洞不再奖励。  
  
除非你能拿出**在安卓设备上可利用的确凿证据**  
。  
  
**Chrome：普通赏金全面腰斩**  
  
和Android的暴涨形成了两极分化。  
  
Chrome绝大多数类别的赏金，全线下降。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFt9HLIXgJT27Op6F9WicNeTcugqj6twFbr0Tt5dwgOiaycEVfTNsBTiaW1azwhkDJ5CFCRMAANpz5DiaatSAW0RQNDWBCXOa8oibWGRg/640?wx_fmt=png&from=appmsg "")  
  
旧的 Chrome VRP 奖励金额  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFtic8iaNpv8lzGxL4Iur0MicicW82JB9ibcoycBOYrb89lGJPfhpeyMjn8k9zvUKKXh0y7lyf6zs2l6t0IsNCOCeyjicZicOpclia1DSdYw/640?wx_fmt=png&from=appmsg "")  
  
新的 Chrome VRP 奖励金额  
  
2025年刚推出的**renderer代码执行和任意读写专项奖金**  
，被直接取消。  
  
Google对此的解释：  
> 如今，AI 已使演示这些技术近乎常规化，让我们得以聚焦更复杂、新颖的提权方法。  
  
  
**曾经的天才绝技，现在成了AI的基本功。**  
  
@loobeny表示：AI 彻底改变了漏洞研究和漏洞挖掘。Chrome VRP 已名存实亡，奖励金额减少了 10 倍。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/xKicFZ2TIFtichlntGicVjQzhWf9I6tQ9BEIxNK1XPtmh57ZkW1wCibOfP4icu94QPWMiaQ3NSgwicTa2IxTvYnX1aP3DBcn4tI1Oe3HVGLFKpAvXI/640?wx_fmt=png&from=appmsg "")  
  
当然，真正的高危漏洞依然价值连城。  
  
一个完整的Chrome全链路漏洞，最高仍然可以拿到**25万美元**  
。  
  
如果能绕过Google引以为傲的**MiraclePtr内存防护**  
  
还能额外获得一笔精确到个位数的奖金：**250128美元。**  
## Google削减安全预算？  
  
Google是不是在削减安全预算？  
  
它在公告里预测：**2026年的总赏金支出，将超过2025年创纪录的1710万美元。**  
  
看起来Google不是不想花钱。  
  
只是再也不想把钱花在AI能做的事情上。![](https://mmbiz.qpic.cn/mmbiz_png/xKicFZ2TIFt91T76ic5lWzicxasDOo0ibfY7ibdTXqHsxqDPFStkzAmPRXf6gegiaDwUqth2XCQB03FeRw8lg42wPZib8c7LAZxN7StjfPJJ6bYFEU/640?wx_fmt=png&from=appmsg "")  
  
  
为了配合这个新体系，Google甚至专门升级了整个基础设施。  
  
未来几周，Google还将发布**专为安全研究员定制的Chrome特殊版本**  
。  
  
用来帮助研究者复现和证明漏洞。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aYef9qMYLnLIqb6wTzbSErRKzmg7cicZCtQB7Yz9PaKF4ichseJFxMOjJvgVtLVLmwInwfM88sTYvibpCibA7e6DMA/640?wx_fmt=png&from=appmsg "")  
  
**以上，既然看到这里了，如果觉得不错，随手点个赞、在看、转发三连吧，如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章，我们，下次再见。**  
  
参考资料：  
  
https://bughunters.google.com/blog/evolving-the-android-chrome-vrps-for-the-ai-era https://bughunters.google.com/about/rules/android-friends/android-and-google-devices-security-reward-program-rules  
  
