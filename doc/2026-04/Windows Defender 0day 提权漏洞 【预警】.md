#  Windows Defender 0day 提权漏洞 【预警】  
 安锐信安全攻防实验室   2026-04-14 09:27  
  
   
  
# Windows Defender 0day 提权漏洞 【预警】  
  
一位化名为 Chaotic Eclipse (@ChaoticEclipse0) 的安全研究人员公开发布了一个名为 BlueHammer 的 Windows 0 day本地权限提升 (LPE) 漏洞利用程序，并在 GitHub 上提供了完整的概念验证 (PoC) 源代码。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/9mJNQIzib3Q0D426cIEXrqANe6r5cg2SJE0JBjMZuAzgfRuVH7KTJ5rAm9SJNH5LmvOkXSNIYmR7uFFicykodDicc00jfzG36g2914sicWsvsSI/640?from=appmsg "null")  
  
  
该漏洞中文命名为 “蓝锤漏洞”  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/9mJNQIzib3Q18RqAKdg9RX20jibErr2kbg8WbbUDvqibCz8ykibD6Zpu9RVRibIhN2pjQhpxBHZTc1Ap5iayL4bzoiatFzibudiclic8nnTVTCuVEa4dI/640?from=appmsg "null")  
  
  
BlueHammer 是一个 Windows 零日 LPE 漏洞利用程序 ，它允许低权限的本地用户将其访问权限提升到 NT AUTHORITY\SYSTEM，这是 Windows 计算机上的最高权限级别。  
  
研究人员发布的一份详细分析报告显示，Windows Defender 被利用来提升权限。  
  
披露信息中分享的屏幕截图生动地展示了其影响：从 C:\Users\limited\Downloads> （显然是一个受限用户帐户）启动的命令提示符在几秒钟内获得了完整的 SYSTEM shell， whoami 确认了 nt authority\system 。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/9mJNQIzib3Q12y1hopFOib0mQH9dDCIiaK6sGIdZCqWKWFzf2S8DjSmhMXq989ZWRXjue1xblGCgCadMWgB6JBvQYPdy5yjpe558IRZSc2iby4Q/640?from=appmsg "null")  
  
### 二、利用条件  
  
这个漏洞并不是远程发个链接就能黑掉电脑，它有几个前提：  
1. 本地访问权：  
 攻击者必须已经进入了系统。无论是通过 Web 漏洞拿到的 Shell，还是通过 RDP 远程登录，或者是坐在电脑前的临时访客。  
  
1. Defender 处于活动状态：  
 毕竟是利用 Defender 提权，如果杀毒软件被彻底禁用，这个特定路径就走不通了。  
  
1. 运行 PoC 代码：  
 需要在命令行执行那个被公开的 BlueHammer  
 程序。  
  
###   
  
  
### 三、 影响版本  
  
根据目前安全研究员披露的信息，这个漏洞的杀伤范围非常广：  
<table><thead><tr style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><strong style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;margin-bottom: 0px !important;"><span leaf="">操作系统</span></strong></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><strong style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;margin-bottom: 0px !important;"><span leaf="">受影响情况</span></strong></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><strong style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;margin-bottom: 0px !important;"><span leaf="">备注</span></strong></td></tr></thead><tbody><tr style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,1,0,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,1,0,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">Windows 11</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,1,1,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,1,1,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">高危</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,1,2,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">已证实包括最新的 24H2/23H2 等预览版和正式版。</span></span></td></tr><tr style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,2,0,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,2,0,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">Windows 10</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,2,1,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,2,1,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">高危</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,2,2,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">架构相似，基本确定同样受影响。</span></span></td></tr><tr style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,3,0,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,3,0,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">Windows Server</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,3,1,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><b data-path-to-node="14,3,1,0" data-index-in-node="0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">中高危</span></b></span></td><td style="border: 1px solid;font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span data-path-to-node="14,3,2,0" style="font-family: &#34;Google Sans Text&#34;, sans-serif !important;line-height: 1.15 !important;margin-top: 0px !important;"><span leaf="">只要安装并启用了默认的 Defender 方案，理论上都有风险。</span></span></td></tr></tbody></table>### 缓解措施  
  
在微软发布官方补丁或缓解措施建议之前，安全团队应采取以下预防措施：  
  
1、监控端点检测和响应 (EDR) 工具，以发现异常的权限提升活动。  
  
2、将本地用户权限限制在操作所需的最低限度。  
  
3、在 Windows 系统上应用增强型日志记录，以检测异常的系统级进程生成。  
  
4、非必要不将windows RDP等远程控制端口暴露在外网。  
  
5、请留意微软发布的有关 BlueHammer 漏洞的安全更新或公告。  
  
   
  
  
