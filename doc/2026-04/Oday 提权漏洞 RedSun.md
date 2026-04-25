#  Oday 提权漏洞 RedSun  
 Khan安全团队   2026-04-25 09:19  
  
通常情况下，我会直接放出 PoC 代码，让大家自己去琢磨。但这次不行，它实在太搞笑了。当 Windows Defender 出于某种愚蠢又滑稽的原因，检测到某个恶意文件带有云标签时，这个本应保护系统的杀毒软件竟然会把找到的文件重新写入到原来的位置。这个 PoC 代码正是利用了这一特性来覆盖系统文件并获取管理员权限。  
  
我认为反恶意软件产品应该删除恶意文件，而不是确定它们是否存在，但这只是我个人的看法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/J7CSmJcRR8lPCvDb0dVVE0b1iciat33ib7cy6Pn0iahE14MgUvdyMmibdf0XibC6qWBSAgZ92PfTyhLoQ3cRMYXFOPzjrnB1wnkAUgSWV33eVVghM/640?wx_fmt=png&from=appmsg "")  
  
https://github.com/Nightmare-Eclipse/RedSun  
  
