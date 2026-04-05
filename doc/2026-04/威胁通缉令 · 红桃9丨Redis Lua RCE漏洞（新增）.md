#  威胁通缉令 · 红桃9丨Redis Lua RCE漏洞（新增）  
 安天集团   2026-04-05 03:00  
  
点击上方"蓝字"  
  
关注我们吧！  
  
  
最新版“  
**病毒通缉令**  
”已在  
[计算机病毒分类命名百科](https://mp.weixin.qq.com/s?__biz=MjM5MTA3Nzk4MQ==&mid=2650211459&idx=1&sn=3ce636cfadaec1c3790b6aba9e6507c4&scene=21#wechat_redirect)  
  
同步更新：  
https://www.virusview.net/virusWantedOrder  
  
今  
日推送：  
Redis Lua RCE漏洞  
，牌面情况：  
新增  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/XBFaicYdOHkibtynV0N1Xd1icUHZOCUZJZEERp1dB1iayTXI0E84HcqMr8SeL5Iia1he6ad1IBkqOQOdQAD0TfNMGY67v3aZO9zHtP29DUQoBAo4/640?wx_fmt=png&from=appmsg "")  
  
****  
**病毒名称：Redis Lua RCE漏洞**  
  
**CVE编号：CVE-2025-49844**  
  
**发现时间：2025-10**  
  
**检测规则首次添加至AVL SDK反病毒引擎病毒库时间：2025-10**  
  
**简介：‌Redis（开源内存数据库）的Lua脚本引擎存在释放后使用（UAF）内存损坏漏洞，该漏洞已隐藏约13年，影响所有支持Lua 脚本的Redis版本。拥有EVAL/EVALSHA命令权限的已认证攻击者可通过特制Lua脚本操控垃圾回收器，触发释放后使用条件，突破Lua沙箱限制，执行任意代码，可能导致Redis服务器完全被控制，窃取数据、加密数据或进一步攻击内部网络。由于Redis默认未启用认证，大量部署面临极高风险。**  
  
****  
**安天智甲终端防御系统（IEP）拥有驱动级主防模块，基于安天AVL SDK反病毒引擎的检测能力和内核与应用层的防御点，可有效阻断该漏洞攻击链和其他类似的攻击活动。**  
  
  
****  
**往期推荐:“威胁通缉令”年度更新！安天历年发布的威胁通缉令，今天正式在计算机病毒百科网站上线手机上的恶意代码知识库——计算机病毒百科服务号上线了计算机病毒分类命名知识百科上线试运行（安天研究院出品）视频揭秘入选“十四五”硬核科技成果的反病毒引擎**  
  
