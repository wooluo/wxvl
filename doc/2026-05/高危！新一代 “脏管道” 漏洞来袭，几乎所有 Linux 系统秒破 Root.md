#  高危！新一代 “脏管道” 漏洞来袭，几乎所有 Linux 系统秒破 Root  
原创 OnePanda-Sec
                    OnePanda-Sec  OnePanda-Sec   2026-05-08 05:53  
  
**OnePanada-Sec 招新啦**  
  
招新要求  
  
- 热爱网络安全，喜欢 CTF；  
  
- 拥有 CTF 比赛经验，有较好比赛成绩的；  
  
- 乐于奉献、热爱分享，愿意提升自己同时帮助他人；  
  
- 时间允许参加各类赛事，服从战队管理与安排；  
  
- 各类比赛获奖者、能力出众者视情况考量；  
  
- 未参与其他高校联队；  
  
- 大一同学视情况放宽资历要求。  
  
  
  
联系方式  
  
请将个人简历发送至以下邮箱：  
  
简历邮箱：2638726415@qq.com  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vkibCXbGicB8N9xk73iamtLplTt37OUxp77DcYIOQb0QLJ8oQnEfTEUsTql1OFoKOz54qPSlOKu4BS7J6iaGlhaVcDzrZsbGzIIFGblGy5uY1S0/640?wx_fmt=png&from=appmsg "")  
  
**PART 02**  
  
🔍 漏洞简介：Dirty Frag  
  
Dirty Frag 是一个通用的 Linux 本地提权漏洞，与脏管道（Dirty Pipe）、Copy Fail 属于同一系列漏洞大类。它的特点非常 “狠”：  
- 是确定性逻辑漏洞，不依赖时间竞争窗口、无需壳态条件  
  
- 漏洞利用失败时不会触发内核崩溃  
  
- 整体利用成功率极高，堪称新一代 “Linux 提权神器”  
  
该漏洞影响范围极广，2017 年以来几乎所有主流 Linux 发行版均受影响，攻击者可以通过漏洞链实现对页缓存的写入，从而稳定提权至 root 权限。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vkibCXbGicB8N9xk73iamtLplTt37OUxp77DcYIOQb0QLJ8oQnEfTEUsTql1OFoKOz54qPSlOKu4BS7J6iaGlhaVcDzrZsbGzIIFGblGy5uY1S0/640?wx_fmt=png&from=appmsg "")  
  
**PART 03**  
  
🛠️ 漏洞复现  
  
复现版本  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DC4TgvRKhOtD8KNn7Y5zljPrZU1lxMoDhibWwczmeviam2DaubCD2aiarYuB2deaMaJatqzBbWgYSmRtOwibgmzbFuaHBNBO0LgIGCFSxMsqF4Q/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DC4TgvRKhOvlWkEdoAP1xNn7l2xiaGnO0zKdTank8Xnam2gE0YtTye3KMHicPBzdeILa0tPCRLO7GL3paMIv35XQgxMKaiaibyISJt3ayybfEBQ/640?wx_fmt=png&from=appmsg "")  
  
POC地址  
  
https://github.com/V4bel/dirtyfrag  
  
POC复现  
```
git clone https://github.com/V4bel/dirtyfrag.git
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DC4TgvRKhOt001N25ERXyiawD4gj2aght9UMCvd6Uib7yfXj7bQOaViaOWnXlV1rGxxicsg7UYwrA9qZs9dWeAVgJfUHLHLw0ribgac16RbEQzJg/640?wx_fmt=png&from=appmsg "")  
  
cd dirtyfrag  
  
gcc -O0 -Wall -o exp exp.c -lutil   
  
./exp  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DC4TgvRKhOuibRRTBAfVhcPej3du4mTnnl6zUYv8jc3MTUIUjEGdDAG6ibIqzKeRwnf4VSDQ5LBc1NibPqdiaaNh0vqOSUoAGnbepQOhKMrP7xg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vkibCXbGicB8N9xk73iamtLplTt37OUxp77DcYIOQb0QLJ8oQnEfTEUsTql1OFoKOz54qPSlOKu4BS7J6iaGlhaVcDzrZsbGzIIFGblGy5uY1S0/640?wx_fmt=png&from=appmsg "")  
  
**PART 04**  
  
⚠️ 高危！受影响版本与临时防护方案  
#### 🔴 受影响范围：覆盖近 9 年主流内核  
  
Dirty Frag 系列漏洞的影响周期极长，覆盖了多个上游内核提交引入的问题：  
- xfrm-ESP  
 页缓存写入漏洞：影响内核提交 **cac2661c53f3（2017-01-17）至今**  
 的所有上游内核版本  
  
- RxRPC  
 页缓存写入漏洞：影响内核提交 **2dc334f1a63a（2023年6月）至今**  
 的所有上游内核版本  
  
整体来看，漏洞影响周期长达约 9 年，几乎所有主流 Linux 发行版都难逃其外，实测可利用的版本包括：  
- Ubuntu 24.04.4：6.17.0-23-generic  
  
- RHEL 10.1：6.12.0-124.49.1.el10_1.x86_64  
  
- openSUSE Tumbleweed：7.0.2-1-default  
  
- CentOS Stream 10：6.12.0-224.el10.x86_64  
  
- AlmaLinux 10：6.12.0-124.52.3.el10_1.x86_64  
  
- Fedora 44：6.19.14-300.fc44.x86_64  
  
- ……  
  
#### 🛡️ 临时防护方案（无官方补丁时）  
  
因负责任的漏洞披露流程及保密协议已提前失效，目前所有 Linux 发行版均无官方补丁。可执行以下命令，禁用存在漏洞的内核模块做临时防护：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' >> /etc/modprobe.d/blacklist-dirtyfrag.conf"
```  
  
  
执行后重启系统即可生效，可有效阻断漏洞利用路径，为等待官方补丁争取时间。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vkibCXbGicB8N9xk73iamtLplTt37OUxp77DcYIOQb0QLJ8oQnEfTEUsTql1OFoKOz54qPSlOKu4BS7J6iaGlhaVcDzrZsbGzIIFGblGy5uY1S0/640?wx_fmt=png&from=appmsg "")  
  
**PART 05**  
  
**微信QQ交流群**  
  
欢迎大家加入[ OnePanda-Sec ] 群聊一起交流 ^ ^  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vkibCXbGicB8Nj9sRGKmdpcnZnxUKQ7OWqDaCxXibArvnnHh8P8ib0WeFOZ9d5lw2BgRhJxNYfyD1GBGMbYSQYA2a0N81sqnLYkOAGDecsZEShc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/DC4TgvRKhOuhb60PY0SMECdxT3PMFUJZh9J77aRA9Zkzb9JfNUY1HIrRYkGCFPnUIjGjCbKjQSSR0twDmiciamazicZZZMVn907IiabYVH9N3BQ/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/vkibCXbGicB8MCfibmV6DB7iaJFWqyQ1jyozX9v37ya1x8ORmvoL4QxiblEzzFVHicfF1cpuabWoDZ5p4YRJQRBFsmso8eSFEj0PyW9Kia0ibhlkGg4/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
  
**END**  
  
  
