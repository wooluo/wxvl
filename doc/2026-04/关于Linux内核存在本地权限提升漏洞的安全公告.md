#  关于Linux内核存在本地权限提升漏洞的安全公告  
原创 CNVD
                    CNVD  CNVD漏洞平台   2026-04-30 04:33  
  
安全公告编号:  
CNTA-2026-0002  
  
   
  
   
  
   
  
2026  
年  
4  
月  
30  
日，国家信息安全漏洞共享平台（  
CNVD  
）收录了  
Linux Ker  
nel  
本地  
权限提升漏洞（  
CNVD-2026-19044  
，对应  
CVE-2026-31431  
）。本地攻击者利用该漏洞，可提权获得  
root  
权限。目前，漏洞利用代码已公开，官方已发布补丁完成修复。该漏洞对云服务器、容器宿主机、多租户环境影响较高，安天公司报告已发现漏洞在野利用情况，  
CNVD  
建议受影响用户立即升级至最新版本。  
  
一、漏洞情况分析  
  
Linux  
内核具有较好的稳定性和灵活性，被广泛应用于服务器、超级计算机、嵌入式设备、个人电脑、移动设备以及云计算基础设施。  
Linux  
内核的开源性吸引了全球开发者社区的持续贡献，形成了庞大的生态系统，包括  
Red Hat  
、  
Ubuntu  
等众多发行版本，成为全球最重要的软件项目之一。  
  
2026  
年  
4  
月  
30  
日，国家信息安全漏洞共享平台收录了  
Linux Kernel  
本地权限提升漏洞。由于  
Linux  
内核加密子系统存在逻辑处理缺陷  
，  
本地普通权限用户可组合  
AF_ALG  
套接字和  
splice  
系统调用，向可读文件或  
SUID  
程序的页缓存中写入  
4  
字节，实现对  
setuid  
等高权限进程的篡改。攻击者利用该漏洞，可本地提权至  
root  
权限，在云服务器、容器宿主机、多租户场景下实现容器逃逸。  
  
CNVD  
对该漏洞的综合评级为  
“  
高危  
”  
。  
  
二、漏洞影响范围  
  
目前，该漏洞影响默认启用或可加载  
algif_aead  
模块的  
Linux  
系统，已知受影响的产品如下：  
  
1  
、  
Ubuntu  
24.04  
LTS  
及以下；  
  
2  
、  
Amazon  
Linux  
2023  
及以下；  
  
3  
、  
RedHat  
Enterprise  
Linux  
10  
及以下；  
  
4  
、  
RedHat  
Enterprise  
Linux  
9  
及以下；  
  
5  
、  
RedHat  
Enterprise  
Linux  
8  
及以下；  
  
6  
、  
SUSE  
16  
及以下；  
  
7  
、  
Debian/Arch/Fedora/Rocky/Alma/Oracle  
等同期内核版本。  
  
受影响的内核提交范围：  
  
commit 72548b093ee3 ≤ version < commit a664bf3d603d  
  
不受影响的  
Linux  
系统包括：内核主线  
7.0+  
、稳定版  
6.18.22+  
、稳定版  
6.19.12+  
。  
  
该漏洞对多用户共享主机场景较高，高危场景包括：  
  
1  
、共享服务器：多租户主机、开发机、跳板机等；  
  
2  
、  
Kubernetes  
和容器集群；  
  
3  
、  
CI/CD  
执行器，如  
GitHub Actions  
、  
GitLab Runner  
、  
Jenkins  
等。  
  
三、漏洞处置建议  
  
目前，  
Linux官方已发布新版本修复漏洞，CNVD建议受影响用户，尤其是高危场景用户尽快进行自查，并通过官方链接更新至最新版本：  
  
https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
  
也可采用以下临时修复措施：  
  
1、禁用algif_aead内核模块  
  
2、通过  
seccomp或运行安全策略，阻断容器内  
AF_ALG socket创建。  
  
  
  
感谢知道创宇、  
360  
漏洞云、安天、深信服、微步对本报告提供的技术支持。  
  
