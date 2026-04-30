#  【安全圈】Linux 内核潜伏 9 年漏洞披露：732 字节脚本攻破 Ubuntu 等发行版，提权至 root 最高权限  
 安全圈   2026-04-30 08:01  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/aBHpjnrGylgOvEXHviaXu1fO2nLov9bZ055v7s8F6w1DD1I0bx2h3zaOx0Mibd5CngBwwj2nTeEbupw7xpBsx27Q/640?wx_fmt=other&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
**关键词**  
  
  
  
漏洞  
  
  
Linux 内核爆出高危漏洞 Copy Fa  
il，追踪编号为 CVE-2026-31431，**仅需一个 732 字节的 Python 脚本，就能攻破几乎所有主流 Linux 发行版本，提权至最高的 root 权限。**  
  
大多数 Linux 提权漏洞需要满足于竞态条件、内核版本匹配、以及编译好的有效载荷等，而本次曝光的 Copy Fail 漏洞完全消除了这些条件，是一个简单的直线逻辑缺陷。  
  
该漏洞的根源涉及 AF_ALG 加密接口、splice () 系统调用以及 2017 年引入的一项代码优化。这三者结合导致攻击者能将恶意数据写入内核页缓存，进而篡改 / usr / bin / su 等可信二进制文件。相较于历史上的 Dirty Cow 或 Dirty Pipe，此漏洞利用更稳定、更简单，成功率极高。  
  
漏洞影响范围极广，涵盖 2017 年至补丁发布前构建的内核版本。特别值得注意的是，由于 Linux 页缓存在容器边界间共享，受感染的容器或 Pod 可利用此机制篡改宿主机缓存文件，从而实现容器逃逸。攻击者可能利用这一特性，威胁云原生环境及多租户架构。  
  
![](https://mmbiz.qpic.cn/mmbiz/sbq02iadgfyHtJ6y0eWiblY1WTic2NHNYnjMSRxk9iaicVicgLfdJJibyNZO00l2A4nggibdSl3qHNNwFF4vRkjb1nuOTacbasua54iash7SAouhazOA/640?wx_fmt=other&from=appmsg "Linux 内核潜伏 9 年漏洞披露：732 字节脚本攻破 Ubuntu 等发行版，提权至 root 最高权限")  
  
研究人员利用该漏洞编写了一个 732 字节的 Python 脚本，在 Ubuntu、Amazon Linux、RHEL 及 SUSE 四个主流 Linux 发行版上，测试发现 Linux 6.12、6.17 和 6.18 均存在问题，每次都成功获取了 root shell。  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/sbq02iadgfyHrkaDBkgUIHt6WkQZrjyC8srVsRWVSqK8j8a9uv0f52tQmicOASCNMaLDGPuE6pttnmN1rf6bARtsbxe671SY7yHbawtd7uhzA/640?wx_fmt=gif&from=appmsg "")  
  
发现过程结合了人类洞察与 AI 工具。研究员 Taeyang Lee 识别出攻击面后，利用 AI 辅助审计工具 Xint Code 扫描 crypto / 子系统，仅耗时约 1 小时便定位到这一最高严重性漏洞。  
  
针对该漏洞的修复补丁（提交号 a664bf3d603d）已发布，主要回退了 2017 年的优化代码。若无法立即更新，管理员可通过禁用 algif_aead 内核模块或配置 seccomp 策略阻止 AF_ALG 套接字创建来缓解风险。  
  
![](https://mmbiz.qpic.cn/mmbiz/sbq02iadgfyGYIWNQEh629NuZ7vP2fdIS3g2CX8fnendBPGsJ7jyyiapXopsUCuQLNFtKXgF2yAfEWXTKudpopZRSoIEZQMoBvpibgrNibSWSGg/640?wx_fmt=other&from=appmsg "")  
  
漏洞修复  
  
**漏洞检测**  
  
Li  
nux系统用户可以通  
过查看内核版本来判断当前系统是否在受影响范围内，查看操作系统版本信息命令如下：  
```
cat /proc/version
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/sbq02iadgfyHCj4Wg5ZUXN3fMy7iatickYVtTW8CGJVGXvRLuYMU75dXdNic5TNBYm0uW48lmY5PHpUkaoCgU80SVhEKfHR1Ov0EfxHrTJictcrw/640?wx_fmt=png&from=appmsg "")  
  
可使用下列命令检查algif_aead模块的状态：  
```
lsmod | grep algif_aead
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/sbq02iadgfyG7ajwQpeNJXOjR87Ss4RGDvKX2447kThiaGHokaqtTG2R8LqQKkXm8MIMTJIj7OddJV88ZNMtyqOtvk1jxWVhNHHjlZ6CPtynw/640?wx_fmt=png&from=appmsg "")  
  
注：若系统内核在受影响范围且加载了该模块，则存在安全风险。  
  
  
漏洞防护  
  
  
目前官方已发布新版本与安全补丁修复此漏洞，请受影响的用户尽快更新进行防护，下载链接：  
  
Linux Kernel 6.18.22  
  
https://git.kernel.org/stable/c/fafe0fa2995a0f7073c1c358d7d3145bcc9aedd8  
  
Linux Kernel 6.19.12  
  
https://git.kernel.org/stable/c/ce42ee423e58dffa5ec03524054c9d8bfd4f6237  
  
Linux Kernel 7.0  
  
https://git.kernel.org/stable/c/a664bf3d603dc3bdcf9ae47cc21e0daec706d7a5  
### 其他防护措施  
  
若相关用户暂时无法进行升级更新，可使用以下措施进行临时防护：  
```
# 彻底禁止加载
echo "blacklist algif_aead" > /etc/modprobe.d/blacklist-algif-aead.conf
echo "install algif_aead /bin/false" >> /etc/modprobe.d/blacklist-algif-aead.conf
# 锁死模块系统（高安全）
sysctl -w kernel.modules_disabled=1
验证：
python3 - << 'EOF'
import socket
s = socket.socket(socket.AF_ALG, socket.SOCK_SEQPACKET, 0)
try:
    s.bind(("aead", "gcm(aes)"))
    print("bind success")
except Exception as e:
    print("bind failed:", e)
EOF
```  
  
  
  
  END    
  
  
阅读推荐  
  
  
[【安全圈】伊朗黑客组织：已“开盒” 2379 名美国海军陆战队员，掌握数万名中东美军姓名、住址、日常轨迹、购物习惯等](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=1&sn=da1650f67f6af7da8ad2b79dff4f91a3&scene=21#wechat_redirect)  
  
  
  
[【安全圈】医疗科技大厂美敦力 IT 系统遭遇黑客入侵，未影响服务交付](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=2&sn=6a35f617d45895376be8b42f42bc2cd0&scene=21#wechat_redirect)  
  
  
  
[【安全圈】巴西 LofyGang 团伙沉寂三年后卷土重来，发起 Minecraft LofyStealer 窃取器活动](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076059&idx=3&sn=86fa3d53221d6b2950f6138d34ba3c1f&scene=21#wechat_redirect)  
  
  
  
[【安全圈】“幻影核心” 利用 TrueConf 漏洞入侵俄罗斯网络](https://mp.weixin.qq.com/s?__biz=MzIzMzE4NDU1OQ==&mid=2652076045&idx=1&sn=d9eecb878e9564d2a2967040fcb4511b&scene=21#wechat_redirect)  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEDQIyPYpjfp0XDaaKjeaU6YdFae1iagIvFmFb4djeiahnUy2jBnxkMbaw/640?wx_fmt=png "")  
  
**安全圈**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCEft6M27yliapIdNjlcdMaZ4UR4XxnQprGlCg8NH2Hz5Oib5aPIOiaqUicDQ/640?wx_fmt=gif "")  
  
  
←扫码关注我们  
  
**网罗圈内热点 专注网络安全**  
  
**实时资讯一手掌握！**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/aBHpjnrGylgeVsVlL5y1RPJfUdozNyCE3vpzhuku5s1qibibQjHnY68iciaIGB4zYw1Zbl05GQ3H4hadeLdBpQ9wEA/640?wx_fmt=gif "")  
  
**好看你就分享 有用就点个赞**  
  
**支持「****安全圈」就点个三连吧！**  
  
![](https://mmbiz.qpic.cn/mmbiz/sbq02iadgfyHC2YjeUqGiaG0s9guicyfH6XlJvPpd0zO9tzccXNJ39TeEjlRwia73nt6jWJicQfcibXvLhREhDBPCaZlV1XR7RibyESsib0iaIOgtw3s/640?wx_fmt=other&from=appmsg "Linux 内核潜伏 9 年漏洞披露：732 字节脚本攻破 Ubuntu 等发行版，提权至 root 最高权限")  
  
  
