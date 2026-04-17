#  Windows Defender LPE 0day 漏洞  
 黑白之道   2026-04-17 00:41  
  
RedSun - Windows Defender LPE 0day 漏洞：当 Windows Defender 检测到恶意文件带有云端检测标签时，它可能会将检测到的文件重写回其原始位置，而不仅仅是将其隔离。该 PoC 漏洞利用了这种行为，将其作为文件覆盖原语，从而可以替换系统文件并最终实现管理员权限提升。  
  
  
![底部文字](https://mmbiz.qpic.cn/sz_mmbiz_jpg/nGzNudUIJ6PsQ531KceuTG2465cHhxTfTAVBQHoq42oH8Snch5e6UGCyHMPyFp4n1Lib4ZkZLD09zT6VH0icXMnAw9tbZGs8mWKqDAZVnGq3c/640?wx_fmt=jpeg&from=appmsg "")  
  
  
原文链接：   
https://github.com/Nightmare-Eclipse/RedSun  
  
