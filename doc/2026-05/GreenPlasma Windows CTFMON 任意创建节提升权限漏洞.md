#  GreenPlasma Windows CTFMON 任意创建节提升权限漏洞  
 Ots安全   2026-05-13 01:58  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
GreenPlasma Windows CTFMON 任意创建节提升权限漏洞  
  
这次我不会放出完整的PoC，只保留了实现完整SYSTEM shell所需的必要代码。这对CTF爱好者来说是个巨大的挑战。  
  
PoC 会在任何 SYSTEM 可写的目录对象中创建一个任意内存段对象。如果你足够聪明，你可以利用这一点实现完全的权限提升，因为你可以影响新创建的段来操作数据。许多服务（甚至内核模式驱动程序）盲目地信任某些路径，因为普通用户通常不应该拥有对这些路径的写入权限。  
  
不确定这在 Windows 10 中是否有效，但在 Windows 11/2022/2026 中肯定有效。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0ExLEPdZ0NFflrbWdROicofx654dxcxFypfNE7mflibxiaGKwjZuzsvW1iaEuBZVgT4vQckyacrkEjgico3ib1ZO3Dt48G6J83JIcbUI/640?wx_fmt=png&from=appmsg "")  
  
项目地址：  
  
https://github.com/Nightmare-Eclipse/GreenPlasma  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0GLH3Xv3wnccJsTIbfGWPcjibHmGN9tpZx3ibzHf6QkP7Je8NYYoXCiaTnnl7wkbqjaZDMSm4WVXmajqBb9I28jfHrSiaYFmEIvVdk/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
