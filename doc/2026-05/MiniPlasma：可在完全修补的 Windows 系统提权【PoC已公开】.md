#  MiniPlasma：可在完全修补的 Windows 系统提权【PoC已公开】  
原创 骨哥说事
                    骨哥说事  骨哥说事   2026-05-19 02:27  
  
#   
  
#   
  
曾曝光近期 Windows 漏洞 YellowKey 和 GreenPlasma 的安全研究员 Chaotic Eclipse，前两天又发布了一个 Windows 本地权限提升的零日漏洞，并且公开了详细的的概念验证（  
PoC，链接见文末）。  
  
该漏洞可使攻击者在已安装所有  
最新补丁的 Windows 系统上获得 SYSTEM 最高权限。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZjF7fGloknD8ooTfP3JqS6nty2x2bJ0icGBlu1XjVLlY0sZbdZEMicvictdPahuNgjaUzsIG7m1mJzYTQwiaNynn62kGUytmRfT5vM/640?wx_fmt=png&from=appmsg "")  
  
这个代号为 MiniPlasma 的漏洞，存在于一个名为 “cldflt.sys” 的系统组件中，它指的是 Windows 云文件迷你筛选器驱动程序（Windows Cloud Files Mini Filter Driver）。  
  
具体的漏洞根源位于该驱动中一个名为 “HsmOsBlockPlaceholderAccess” 的例程 (routine) 内。它最初由 Google Project Zero 研究员 James Forshaw 在 2020 年 9 月 报告给微软。  
  
尽管该问题曾被微软假定在 2020 年 12 月通过 CVE-2020-17103 修复，但 Chaotic Eclipse 表示，进一步调查发现 “完全相同的问题 […] 实际上仍然存在，并未被打上补丁。”  
  
研究员补充道：“我不确定是微软从未修补这个问题，还是补丁在某个时间点因未知原因被静默回滚了。Google 原始的 PoC 无需任何修改就能直接运行。” “为了凸显这个问题，我改进了原始 PoC，使其能够直接弹出 SYSTEM 权限的命令终端 (shell)。在我的测试机器上它似乎稳定运行，但由于这是一个竞态条件 (race condition)，成功率可能会有所差异。”  
  
研究员进一步指出，所有 Windows 版本 都可能受到此漏洞影响。  
  
在 Mastodon 上，安全研究员 Will Dormann 分享称，MiniPlasma 在安装了 2026年5月最新更新 的 Windows 11 系统上，能够 “可靠地” 打开一个拥有 SYSTEM 权限的 “cmd.exe” 命令提示符。 “我要指出的是，它似乎在最新的 Windows 11 Insider Preview Canary 版本上不起作用，” Dormann 提到。  
  
值得注意的是，就在 2025 年 12 月，微软还修补了发生在 同一组件 中的另一个权限提升漏洞（CVE-2025-62221，CVSS 评分：7.8），该漏洞当时已被未知的威胁行为者利用。  
  
PoC：  
https://github.com/Nightmare-Eclipse/MiniPlasma  
  
- END -  
  
**感谢阅读，如果觉得还不错的话，动动手指给个三连吧～**  
  
