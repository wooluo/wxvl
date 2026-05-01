#  Linux内核存在本地权限提升漏洞  
原创 guowei
                    guowei  网络安全直通车   2026-05-01 12:35  
  
漏洞概述漏洞编号：CNTA-2026-0002（CNVD-2026-19044，对应CVE-2026-31431）发布日期：2026年4月30日漏洞类型：Linux内核本地权限提升漏洞危险等级：高危漏洞详情Linux内核加密子系统存在逻辑处理缺陷，本地普通权限用户可通过组合AF_ALG套接字和splice系统调用，向可读文件或SUID程序的页缓存中写入4字节数据，从而篡改setuid等高权限进程，最终获得root权限。影响范围受影响系统默认启用或可加载 algif_aead 模块的Linux发行版：Ubuntu 24.04 LTS及以下Amazon Linux 2023及以下RedHat Enterprise Linux 10/9/8及以下SUSE 16及以下Debian、Arch、Fedora、Rocky、Alma、Oracle等同期内核版本内核版本范围受影响提交： commit 72548b093ee3 ≤ version < commit a664bf3d603d 未受影响版本：内核主线7.0+、稳定版6.18.22+、稳定版6.19.12+高危场景共享服务器（多租户主机、开发机、跳板机）Kubernetes和容器集群CI/CD执行器（GitHub Actions、GitLab Runner、Jenkins等）处置建议根本解决方案立即升级至官方修复版本：https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5 临时缓解措施禁用algif_aead内核模块通过seccomp或运行安全策略，阻断容器内AF_ALG socket创建重要提醒漏洞利用代码已公开安天公司报告已发现漏洞在野利用情况特别建议云服务器、容器宿主机、多租户环境用户立即采取行动该漏洞对云计算和容器化环境威胁较大，建议相关管理员优先处理。  
  
  
