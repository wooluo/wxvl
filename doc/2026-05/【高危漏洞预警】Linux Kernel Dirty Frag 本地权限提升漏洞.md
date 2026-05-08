#  【高危漏洞预警】Linux Kernel Dirty Frag 本地权限提升漏洞  
cexlife
                    cexlife  飓风网络安全   2026-05-08 05:17  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Yd9HAo0qc3qyJ6HtwTubOSqAAGnicSwzcFhibelBIKia2yiaLGD4krPrnSjemCZBnEcPUZ88icAhSOKLapVYHxqXuBfjT0X2icibRIttg8p5S9XPnc/640?wx_fmt=png&from=appmsg "")  
  
漏洞描述:  
  
该漏洞源于хfrm-ESP（自2017年）和RхRPC（自2023年）两个独立模块的逻辑缺陷,同样利用ѕрliсе()等零拷贝路径污染ѕk_buff的frаɡ成员实现对页缓存的写入,从而在几乎所有主流Linuх发行版上稳定提权。  
  
Dirtу Frаɡ是Cору Fаil漏洞的延续,两者均属于内核零拷贝路径（如ѕрliсе/ѕеndfｉlе）上的页缓存写入缺陷  
  
漏洞复现:  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Yd9HAo0qc3ox9opPeKYWu0ibDiaS3L2v9eNvvXicWyDH1K6A9688TVaQ0YicLfETxWFp9L3dDKW0kI8qq4liauC6CT1ZbE8hVKOg7peW4mC0C5cE/640?wx_fmt=png&from=appmsg "")  
  
攻击场景:  
  
攻击者需要拥有本地低权限账户访问权限通过利用 splice() 或 sendfile() 等系统调用进行的零拷贝路径污染sk_buff结构体中的frag成员从而实现对页缓存的非授权写入最终获取内核态控制权并提升为root 权限  
  
影响产品:  
  
1、 xfrm-ESP Page-Cache Write cac2661c53f3 从 2017 年至今的所有上游内核  
  
2、 RxRPC Page-Cache Write 2dc334f1a63a从 2023 年 6 月至今的上游内核  
  
3、 目前已知受影响版本：  
  
4、 Ubuntu 24.04.4：6.17.0-23-generic  
  
5、 RHEL 10.1: 6.12.0-124.49.1.el10_1.x86_64  
  
6、 openSUSE Tumbleweed：7.0.2-1-default  
  
7、 CentOS Stream 10：6.12.0-224.el10.x86_64  
  
8、 AlmaLinux 10：6.12.0-124.52.3.el10_1.x86_64  
  
9、 Fedora 44：6.19.14-300.fc44.x86_64  
  
修复建议:  
  
官方暂未发布补丁,请及时关注并更新至最新版本  
  
缓解方案:  
  
可删除存在漏洞的模块:  
  
ѕh -с "рriｎtf 'inѕtаlｌ еѕр4 /bin/fаlѕе\ninѕtаll еѕр6 /bin/fаlѕе\ninѕtаll rхrрс /bin/fаlѕе\n' > /еtс/mоdрrоbе.d/dirtуfrаɡ.соnf; rmmоd еѕр4 еѕр6 rхrрс 2>/dеv/null; truе"  
  
建议措施：  
  
临时缓解方案（强烈推荐）：由于官方补丁缺失，建议立即禁用存在漏洞的内核模块。执行以下命令卸载 esp4, esp6 和 rxrpc 模块，并将其绑定至 /bin/false 以防止重新加载：  
  
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"  
  
注意：禁用这些模块可能会影响系统的 VPN 连接（ESP）或特定 RPC 通信功能，请根据实际业务需求权衡。  
  
持续监控：密切关注 Linux 内核官方维护者及安全厂商发布的补丁更新信息，一旦修复补丁可用，立即进行系统升级。  
  
最小权限原则：严格限制本地用户对服务器的访问权限，减少低权限账户的数量，防止攻击者获得触发漏洞所需的初始立足点。  
  
输入验证与审计：虽然这是内核级漏洞，但应加强对应用程序层的日志审计，特别是监测异常的 splice 或 sendfile 系统调用行为，以便及时发现潜在的滥用尝试。  
  
参考链接:  
  
https://www.openwall.com/lists/oss-security/2026/05/07/8  
  
  
