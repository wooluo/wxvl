#  飓风安全发现OpenClaw高危漏洞  
jufeng
                    jufeng  飓风网络安全   2026-04-09 10:40  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yd9HAo0qc3oeF5HpoYjwBIfd95SxZWRU7MEwk4LEEqJ10kGrohnkq2qIaQqXH1GX6Kfq2Q7OkRvulbOq2DgsRKI5QyH1wBTs8diay4hHNHXk/640?wx_fmt=png&from=appmsg "")  
  
近日，飓风安全发现OpenClaw漏洞，并第一时间向  
OpenClaw官方报告漏洞细节  
  
其中  
OpenShell镜像模式可  
导致远程服务器任意目录的文件被删除  
已获官方确认（安全公告  
GHSA-m34q-h93w-vg5x  
），飓风安全全程协助OpenClaw完成相关修复工作。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Yd9HAo0qc3ppeZaGo49icic4PibRKC3QjLTtChZT9wx0OvaLXptyMErYamex3XgXMetWp0o1ZNz6vk1gGcf2GZt6wSPaU1Q76O5EKPemJ30r7I/640?wx_fmt=png&from=appmsg "")  
  
漏洞等级:  
  
高危  
  
漏洞危害:  
  
如果攻击者能够影响这些 OpenShell 配置值，镜像同步可能会删除非预期远程目录的内容，并将其替换为上传的工作区数据。这是镜像同步路径中的一个破坏性远程路径漏洞。  
  
OpenShell 镜像后端允许设置任意的绝对路径作为 remoteWorkspaceDir 和 remoteAgentWorkspaceDir,如果攻击者能控制这些配置，镜像同步操作（清理和覆盖）就会针对这些非预期的路径执行，导致远程服务器上任意目录的文件被删除。  
  
受影响的软件包/版本  
  
软件包：openclaw (npm)  
  
受影响版本：<= 2026.4.1  
  
已修复版本：>= 2026.4.2  
  
最新已发布的 npm 版本：2026.4.1  
  
修复方案:  
  
立即升级openclaw npm包  
  
你需要将项目中使用的 openclaw 包升级到包含修复补丁的版本。  
  
受影响版本： <= 2026.4.1  
  
修复版本： >= 2026.4.2  
  
参考链接:  
  
https://github.com/openclaw/openclaw/security/advisories/GHSA-m34q-h93w-vg5x  
  
  
  
