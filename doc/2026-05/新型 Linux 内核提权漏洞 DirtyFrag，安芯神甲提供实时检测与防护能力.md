#  新型 Linux 内核提权漏洞 DirtyFrag，安芯神甲提供实时检测与防护能力  
原创 内存安全领军者
                    内存安全领军者  安芯网盾   2026-05-09 06:18  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Pn5mJk7sRlUuMvoz4axxSdibFoHBhee2JZ4WibCyib1hjr4z0NFmrN3t7JwqmAreAvLrUr8C29icN8vFmFyM7Rwt3Q/640?wx_fmt=png&from=appmsg "")  
  
  
01. 漏洞概述  
<table><tbody><tr><td data-colwidth="94" width="145.8"><p><span data-font-family="quote-cjk-patch"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">项目内容</span></span></span></p></td><td data-colwidth="420" width="871.8"><section><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">详细信息</span></span></section></td></tr><tr><td data-colwidth="94" width="145.8"><p><span data-font-family="quote-cjk-patch"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">漏洞编号</span></span></span></p></td><td data-colwidth="420" width="871.8"><section><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">CVE-2026-43284</span></span></section><section><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">CVE-2026-43500</span></span></section></td></tr><tr><td data-colwidth="94" width="145.8"><p><span data-font-family="quote-cjk-patch"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">漏洞名称</span></span></span></p></td><td data-colwidth="420" width="871.8"><p data-pm-slice="0 0 []"><span data-font-family="default"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">D</span></span></span><span data-font-family="default"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">irty</span></span></span><span data-font-family="default"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;"> F</span></span></span><span data-font-family="default"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">rag</span></span></span></p></td></tr><tr><td data-colwidth="94" width="145.8"><p><span data-font-family="quote-cjk-patch"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">公开日期</span></span></span></p></td><td data-colwidth="420" width="871.8"><section><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">2026 年 5 月 8 日</span></span></section></td></tr><tr><td data-colwidth="94" width="145.8"><p><span data-font-family="quote-cjk-patch"><span leaf="" style="color:rgba(0, 0, 0, 0.9);font-size:17px;font-family:&#34;mp-quote&#34;, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;line-height:1.6;letter-spacing:0.034em;font-style:normal;font-weight:normal;"><span textstyle="" style="font-size: 16px;">危害等级</span></span></span></p></td><td data-colwidth="420" width="871.8"><section style="line-height: 1.5em;"><span leaf="" style="color: rgba(0, 0, 0, 0.9);font-size: 17px;font-family: mp-quote, &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.034em;font-style: normal;font-weight: normal;"><span textstyle="" style="font-size: 16px;">高危（本地提权，且可用于容器逃逸）</span></span></section></td></tr></tbody></table>  
  
2026 年 5 月 8 日，Linux 内核新型本地提权漏洞 Dirty Frag（CVE-2026-43284,CVE-2026-43500）公开披露，受影响范围覆盖 Ubuntu、Debian 等主流发行版。  
  
该漏洞通过链式组合 xfrm-ESP 与 RxRPC 两条独立的 page cache 写入路径，实现对所有目标系统的完整覆盖，已部署 Copy Fail（CVE-2026-31431）缓解措施的系统也受到威胁。安芯神甲借助 ACDR 行为检测引擎，无需升级内核、无需重启服务，即可对两条攻击路径实现实时监测与拦截。  
  
02. EXP分析  
  
Dirty Frag 与 Dirty Pipe（CVE-2022-0847）、Copy Fail（CVE-2026-31431）同属 page cache 写入漏洞家族，三者共同特征是：攻击者借助 splice() 系统调用，将只拥有读权限的文件 page cache 页零拷贝植入内核数据结构，随后内核的加密/解密代码在该页上执行原地操作，最终将攻击者可控的内容写入只读文件的内存映像。  
  
目前，互联网已公开针对 Dirty Frag 提权漏洞的 EXP 代码，其核心利用方式为：用 splice() 把只读 /usr/bin/su 的 page cache 页伪装成 skb frag，再利用 ESP in-place crypto 的 4 字节 STORE，把 su 的缓存内容改造成一个 192 字节 minimal setuid-root shell ELF；随后执行 /usr/bin/su 时，内核保留 setuid-root 语义但加载攻击者 ELF，从而直接获得 root shell。  
  
03. 安芯神甲实时告警防护  
  
安芯神甲无需任何策略升级，通过内核探针与用户态行为监控实现基于 ACDR（Attack Chain） 的实时安全告警，在DirtyFrag 漏洞利用过程中完整捕获了攻击的每一个阶段，并在管理端以攻击路径图、事件时间线、进程详情等方式直观呈现。  
  
在测试主机上，执行exp 程序，复现提权操作：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/bx6mgY8cg1BPjVvRaS7jfRwibczFED6Uqdsb1Up631CQOezDBBjG2WiaEibSN6RlBrPp8oZyia78fpFu6wSibQL36ltft51FWtuPCqYfRybMARZs/640?wx_fmt=png&from=appmsg "")  
  
如图，告警完整复现了Dirty Frag 提权攻击流程：  
  
本地编译（gcc-9 + collect2 + ld）→ exp 执行触发 page cache 写入 → su 调用获取 root shell，整个攻击链从外联到提权全程留有告警记录，无任何环节缺漏。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/bx6mgY8cg1ClF0VFERFKF455rFg4TNLT3s3ia1zBT18yE0JibrnVl64dLiadRs1hJk0ic77iay0cibKMaPphHqnBlY8CjzHIicNLriakfSJueqIYKdU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/bx6mgY8cg1Dun56JE22BLe7pPcpMI5tu4WTia7QQXIibJTQxQia0z4cUOBt7BJzxmWtTDO5tYMc3kgUJoYC7f6H6NqLf0AcLtmIAthvPpibUxbs/640?wx_fmt=png&from=appmsg "")  
  
04. 缓解方案  
  
受影响发行版包括但不限于：Ubuntu（默认加载 rxrpc.ko，ESP + RxRPC 双路径均受影响）、Debian、其他编译了 esp4.ko / rxrpc.ko 的主流 Linux 发行版。  
  
对于该漏洞，安芯网盾安全研究实验室提供了以下缓解方案：  
  
1. 部署安芯神甲主机防护系统，通过  
“策略”->“事件安全策略”->开启“ACDR 事件分析”->事件拦截深度“全部”->  
根据业务实际状态选择“仅上报”模式或“拦截模式”，实时检测 + 拦截完整攻击链。  
  
2. 目前，DirtyFrag漏洞利用相关的ESP 路径（CVE-2026-43284）的修复补丁已合并进入netdev tree（2026-05-07），采用 SKBFL_SHARED_FRAG 标志强制 splice 植入的页面走 skb_cow_data() 路径，RxRPC 路径（CVE-2026-43500）目前在任何代码树中均尚无已合并的补丁。建议持续关注各发行版安全公告，补丁一旦进入生产仓库立即执行 apt upgrade / dnf update + 重启，彻底修复两条攻击路径。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Pn5mJk7sRlV3v6CyvbWX4YfyL8MictAn84vADsShfzBDSMV9iaVIPhsdjITPlnFfLpzzUXarl7OGwBYfPh1lHyqg/640?wx_fmt=gif "")  
  
**了解安芯‍‍‍**  
‍  
‍  
‍  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Pn5mJk7sRlUuMvoz4axxSdibFoHBhee2J46NdcA1uBzM056ykx1zU2VmRcJKJs9aRibfSvPu3tTm2Wu7TnEvcYsg/640?wx_fmt=png&from=appmsg "")  
  
  
