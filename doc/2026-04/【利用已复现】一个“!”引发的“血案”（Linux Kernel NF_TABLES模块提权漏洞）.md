#  【利用已复现】一个“!”引发的“血案”（Linux Kernel NF_TABLES模块提权漏洞）  
原创 360漏洞研究院
                    360漏洞研究院  360漏洞研究院   2026-04-22 04:04  
  
“扫描下方二维码，进入公众号粉丝交流群。更多一手网安资讯、漏洞预警、技术干货和技术交流等您参与！”  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/5nNKGRl7pFgrNicMticDTWVCUWbOwRuWcrYSpAlwDRibKNLbe3KialEfR0Y2PlPAvS4MN50asXETicAviaRy1gRicI2Dw/640?wx_fmt=gif&from=appmsg "")  
  
  
Linux Kernel NF_TABLES 模块曝出 Use-After-Free 提权漏洞（CVE-2026-23111，CVSS 7.8），攻击者通过利用事务回滚机制中的逻辑缺陷，可实现非特权用户提权，获取系统最高权限。  
  
  
目前 **360漏洞挖掘智能体已成功复现该漏洞**  
。本文包含完整影响范围、修复方案、技术原理与复现细节，建议用户立即升级。  
  
  
<table><tbody><tr style="box-sizing: border-box;"><td colspan="4" data-colwidth="100.0000%" width="100.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;background-color: rgb(100, 130, 228);box-sizing: border-box;padding: 0px;"><section style="text-align: center;color: rgb(255, 255, 255);box-sizing: border-box;"><p style="margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞概述</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞名称</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">Linux Kernel NF_TABLES模块Use-After-Free提权漏洞</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞编号</span></strong></p></section></td><td colspan="3" data-colwidth="76.0000%" width="76.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">CVE-2026-23111</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">公开时间</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span style="box-sizing: border-box;"><span leaf="">2026-02-13</span></span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">POC状态</span></span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(100, 130, 228);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">已公开</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">漏洞类型</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">权限提升</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">EXP状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未公开</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span style="color: rgb(0, 0, 0);box-sizing: border-box;"><span leaf="">利用可能性</span></span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">高</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(0, 0, 0);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">技术细节状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;color: rgb(100, 130, 228);box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">已公开</span></strong></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="24.0000%" width="24.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">CVSS 3.1</span></strong></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">7.8</span></p></section></td><td data-colwidth="28.0000%" width="28.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;color: rgb(0, 0, 0);padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><strong style="box-sizing: border-box;"><span leaf="">在野利用状态</span></strong></p></section></td><td data-colwidth="20.0000%" width="20.0000%" style="border-width: 1px;border-color: rgb(100, 130, 228);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="font-size: 12px;padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">未发现</span></p></section></td></tr></tbody></table>  
  
  
**01**  
  
**漏洞影响范围**  
  
  
  
受影响版本：  
  
该漏洞在 Linux 内核 6.4 版本中被引入，从 6.4 开始的主线版本在修复之前均受到影响，具体修复版本如下所示：  
- 在 5.15 LTS 分支中，5.15.200 及之后版本已修复；  
  
- 在 6.1 LTS 分支中，6.1.163 及之后版本已修复；  
  
- 在 6.6 LTS 分支中，6.6.124 及之后版本已修复；  
  
- 在 6.12 LTS 分支中，6.12.70 及之后版本已修复；  
  
- 在 6.18 LTS 分支中，6.18.10 及之后版本已修复  
  
  
  
  
**02**  
  
**修复建议**  
  
  
  
**正式防护方案**  
  
官方发布了正式的修复Patch，详情如下：  
```
diff --git a/net/netfilter/nf_tables_api.c b/net/netfilter/nf_tables_api.c
index c3613d8e7d725..3bf88c137868a 100644
--- a/net/netfilter/nf_tables_api.c
+++ b/net/netfilter/nf_tables_api.c
@@ -5700,7 +5700,7 @@ staticvoidnft_map_catchall_activate(const struct nft_ctx *ctx,

   list_for_each_entry(catchall, &set->catchall_list, list) {
     ext = nft_set_elem_ext(set, catchall->elem);
-    if (!nft_set_elem_active(ext, genmask))
+    if (nft_set_elem_active(ext, genmask))
continue;

     nft_clear(ctx->net, ext);
```  
  
在Patch中删除一个"!"字符，执行了正确的逻辑，修复问题。  
  
  
**03**  
  
**漏洞描述**  
  
  
  
近期，有研究人员公开了CVE-2026-23111的漏洞详情，以及利用方法。经过深入分析，360漏洞研究院复现了该漏洞的利用。  
  
Linux内核nf_tables子系统中nft_map_catchall_activate()函数存在一个逻辑取反错误。该函数在事务Abort（回滚）阶段被调用，用于重新激活在失败事务的Prepare阶段被停用的catchall map元素。然而，由于条件判断中多了一个"!"取反符号，导致函数跳过了需要重新激活的非活跃元素。  
  
这一逻辑错误导致对于包含NFT_GOTO裁决的catchall元素，nft_data_hold()永远不会被调用来恢复chain->use引用计数。攻击者可以通过反复触发abort路径来持续递减chain->use，最终使其归零。此时，攻击者可以成功删除该chain，导致chain结构体被释放，而仍有map元素引用该chain的指针，形成Use-After-Free。该漏洞可被本地非特权用户利用实现本地权限提升（LPE）。  
  
  
**背景知识**  
  
nf_tables使用以下方式提交事务模型：  
  
1. Prepare阶段构建下一代对象状态，  
  
2. Commit阶段翻转gencursor激活新一代，  
  
3. Abort阶段按反序撤销Prepare阶段的操作。  
  
genmask机制：使用2位位掩码(genmask)跟踪对象在不同代中的活跃状态。genmask中的位被置位表示对象在该代中不活跃。当元素活跃nft_set_elem_active()返回true。  
  
chain->use引用计数：记录引用该chain的跳转/goto数量，只有use==0时chain才可删除。Map的catchall元素如包含"goto mychain"裁决，会增加mychain->use。  
  
  
**根因分析**  
  
漏洞位于net/netfilter/nf_tables_api.c的nft_map_catchall_activate()函数。  
```
if (!nft_set_elem_active(ext, genmask))  // BUG: 多了一个 "!"
    continue;
```  
  
nft_map_catchall_activate()函数中调用nft_set_elem_active(ext, genmask)进行条件判断多了一个"!"取反。导致Abort阶段跳过需要重新激活的不活跃元素，nft_setelem_data_activate()（含nft_data_hold()恢复chain->use）永远不被调用。每次abort循环永久递减chain->use，使其最终归零后chain可被释放，形成UAF。  
  
  
**04**  
  
**漏洞复现**  
  
  
  
360 漏洞研究院已在 Ubuntu 24.04 环境下完成漏洞验证。该系统使用了linux-6.12内核源代码，编译后作为目标内核；使用Ubuntu noble作为根文件系统；使用qemu启动执行目标系统。通过在目标系统中以非特权用户执行利用代码获取root权限。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzz9hO7I53VZpvBCfvzdLkoG5ZicFVUT37SteHdBOALxHeacOAqpC0YnvhheLRUNpBsGml5vX5KiaiaswULrDic9NjUsiaTTE8kxI0C8w/640?wx_fmt=png&from=appmsg "")  
  
CVE-2026-23111  
  
Linux Kernel NF_TABLES模块Use-After-Free提权漏洞复现  
  
  
**05**  
  
**时间线**  
  
  
  
2026年04月22日，360漏洞研究院发布本安全风险通告。  
  
  
**06**  
  
参考链接  
  
  
  
https://www.cve.org/CVERecord?id=CVE-2026-23111  
  
https://fuzzinglabs.com/repro-cve-2026-23111/  
  
  
07  
  
更多漏洞情报  
  
  
  
建议您订阅360数字安全-漏洞情报服务，获取更多漏洞情报详情以及处置建议，让您的企业远离漏洞威胁。  
  
  
邮箱：360VRI@360.cn  
  
网址：https://vi.loudongyun.360.net  
  
  
  
“洞”悉网络威胁，守护数字安全  
  
  
**关于我们**  
  
  
360 漏洞研究院，隶属于360数字安全集团。其成员常年入选谷歌、微软、华为等厂商的安全精英排行榜, 并获得谷歌、微软、苹果史上最高漏洞奖励。研究院是中国首个荣膺Pwnie Awards“史诗级成就奖”，并获得多个Pwnie Awards提名的组织。累计发现并协助修复谷歌、苹果、微软、华为、高通等全球顶级厂商CVE漏洞3000多个，收获诸多官方公开致谢。研究院也屡次受邀在BlackHat，Usenix Security，Defcon等极具影响力的工业安全峰会和顶级学术会议上分享研究成果，并多次斩获信创挑战赛、天府杯等顶级黑客大赛总冠军和单项冠军。研究院将凭借其在漏洞挖掘和安全攻防方面的强大技术实力，帮助各大企业厂商不断完善系统安全，为数字安全保驾护航，筑造数字时代的安全堡垒。  
  
  
