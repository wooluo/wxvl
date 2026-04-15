#  GraphQL RCE：通往云身份的攻击链  
haidragon
                    haidragon  安全狗的自我修养   2026-04-15 04:25  
  
#   
# 官网：http://securitytech.cc  
  
  
![cover](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnssCq7NiayE095jt5Xz1numPEdtjLCepqicq0poBhgTynAgfnDFI1mCjib2UcdiaA4uHO5RUrXVtoHicrcHjUNPu4OmMBic75JzAOTw0/640?wx_fmt=png&from=appmsg "")  
## 从一个简单查询到生产环境“上帝权限”…！  
  
想象一下：  
  
你登录进一个现代 SaaS 平台……界面很丝滑、速度很快，而且有一个杀手级功能——  
  
👉 **自定义 Python 函数（Custom Python Functions）**  
  
对普通用户来说，这是生产力工具……  
  
但对漏洞猎人来说——  
  
👉 **这是一扇入口…！**  
  
在我之前的文章中，我教你如何“找到门”。  
  
而今天我要讲的是：  
  
👉 **我是如何撬开锁、走进房子，最终拿走整个云基础设施的钥匙…！**  
  
这是一个从“Viewer（只读）账号”到  
  
👉 **完全接管云身份（Full Cloud Identity Compromise）**  
 的过程。  
## 🎣 沙箱的幻觉  
  
现代应用喜欢“用户自定义逻辑”：  
- 表格公式  
  
- 自定义脚本  
  
它们都有一个共同点：  
  
👉 运行在一个 **Sandbox（沙箱）**  
  
开发者以为：  
  
👉 把用户限制在安全环境中  
  
但攻击者会想：  
  
👉 找到围栏里的漏洞  
> **思维：**  
  
沙箱的安全性取决于最薄弱的一点。  
  
如果服务器执行代码，那么问题不是“能不能逃”，而是“怎么逃”。  
  
## 🗺️ 阶段 1：信息收集  
  
任何攻击都从“地图”开始。  
  
在 GraphQL 中，这个地图就是：  
- Introspection  
  
- 资源 ID  
  
我需要：  
- workspaceId  
- appId  
于是我执行：  
```
```  
  
👉 拿到 ID 后，我已经不是访客，而是参与者。  
  
![enum1](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnsw8hGFSAkhWicySq3X8C8Cq76jNchdYV1YXmNQt0ibd3yhdykvLlCHnh1em1DprgopStTLWapb1OL4msWRfCKPP7RZVm6TUC2Q8/640?wx_fmt=png&from=appmsg "")  
  
![enum2](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnvyh6JHaxthEiapKBsfcpPx2xuYsnchoI1FX9JHmXH0xOhYXrIK75ibLRCfUAzLU53j4JRMPNQXC7zWBTic0UDckpEUxNVtkWpgMg/640?wx_fmt=png&from=appmsg "")  
## 🪵 阶段 2：漏洞利用  
  
系统提供：  
```
```  
  
👉 可以执行 Python  
## 💥 注入 payload  
```
```  
  
👉 利用 __import__  
 逃逸沙箱  
  
![rce1](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnsOwg2KbJtrToGJDpwdok2tIJN2DGWPpolic5YM0fiax75dV2DtIaVTSDQe1ibcove985RuWOQHmeDTI86ib8LaDKKiazTPdCgheGu8/640?wx_fmt=png&from=appmsg "")  
## 🚀 触发执行  
```
```  
  
![rce2](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnuicEMSpiazdibH5fSQgPLRrkokoicdIRfXUpOFEKiaRcEib6Py9y50iamoOMn3avciaCF8ibw8d80ekPtY2K2IzsURIibr2iaxOlKicD1quiaA/640?wx_fmt=png&from=appmsg "")  
## ✅ 结果  
  
返回：  
- GAE_RUNTIME: python313  
- 内部代理  
  
- 工作目录  
  
👉 **RCE 成功（已经进入容器）**  
## 🔍 阶段 3：读取源码  
  
RCE 只是开始，源码才是关键。  
  
我用：  
```
```  
  
读取后端代码  
  
![read1](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnsdsB1ibFsae180OcORtxdc3E5nEHYxhI2LQuEia79wOVdlaKQFbl29DFtGSOMicuJXK0z4nmia1VJFiaJ8RGJaxWxoPVtFD2icynpick/640?wx_fmt=png&from=appmsg "")  
  
触发执行：  
  
![read2](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnuibQKmkQ5KWZ9icUUiabOGXIwWXia4jwXc9XbtcT3sF5Q8jSx0k1Bcf0kzOlqdbth4n1xwwY8Vo8XhCaQpMsSl05mWECpcUJIuW6c/640?wx_fmt=png&from=appmsg "")  
## 🚨 发现漏洞核心  
```
```  
  
👉 问题：  
  
没有设置：  
```
```  
  
👉 导致：  
- __import__  
 可用  
  
- 沙箱完全失效  
  
## ☁️ 阶段 4：云身份接管（Kill Shot）  
  
目标：  
  
👉 **Google Cloud Metadata**  
```
```  
## 💥 获取 JWT  
```
```  
  
![jwt1](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnuWaibZvELCoaXBMd1tKAwzToeOprZicxHRibGbEibJ22zhHfagCktSUBmTuOYtPEhwPibaDQQ80OkFkO0FUVNv4ZEwKHWicjibfrQzU8/640?wx_fmt=png&from=appmsg "")  
  
触发：  
  
![jwt2](https://mmbiz.qpic.cn/mmbiz_png/R98u9GTbBnvkX8SgAcbRotgzxq8lLsx0ArIRX9xqD61pbyibCH2O7QpgjYL9CUbO5ZUejic4ZZlz6eNTgK9lkcapvDIZJJfBy189iaTT9wl2kc/640?wx_fmt=png&from=appmsg "")  
## 🎯 最终结果  
  
拿到：  
  
👉 **OIDC JWT Token**  
  
解析后：  
```
```  
  
👉 已获得生产环境身份  
  
👉 **直接接管云服务**  
# 🧠 核心总结  
  
现实中的攻击不是电影那样炫技：  
  
👉 而是：  
- 好奇心  
  
- 多走一步  
  
- 一步步扩大权限  
  
## 💥 最终影响  
- ✅ 任意命令执行（RCE）  
  
- ✅ 后端源码泄露  
  
- ✅ SSRF 攻击内部服务  
  
- ✅ 云服务账号接管  
  
## 🛡️ 修复建议  
  
1️⃣ 沙箱必须禁用 builtins：  
```
```  
  
2️⃣ 屏蔽元数据 IP：  
```
```  
  
3️⃣ 使用隔离环境：  
- Firecracker  
  
- gVisor  
  
# ✅ 一句话总结  
  
👉 **一个漏掉的 __builtins__，直接导致从用户权限 → 云身份接管**  
- 公众号:安全狗的自我修养  
  
- vx:2207344074  
  
- http://  
gitee.com/haidragon  
  
- http://  
github.com/haidragon  
  
- bilibili:haidragonx  
  
##   
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBnuooicxkxDZiaJsaI5jA85YQDuJvy534icUZiaRalxpzhJzTXA53ic399LPgnwRA6Ohp47fja3BY30XmeQ26yN59fTFPZLT8xpjZia4U/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/R98u9GTbBntzul4OYib7KLROTpMENBSiaCmATGZ3Oph7HHwWDetqwDRwLRLWA49Az2shOg8wcM55uicQKeZsSKlavAf95b9a8xg3OhnSibvEo7A/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPZeRlpCaIfwnM0IM4vnVugkAyDFJlhe1Rkalbz0a282U9iaVU12iaEiahw/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=z84f6pb5&tp=webp#imgIndex=5 "")  
  
  
  
****- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/vBZcZNVQERHYgfyicoHWcBVxH85UOBNaPMJPjIWnCTP3EjrhOXhJsryIkR34mCwqetPF7aRmbhnxBbiaicS0rwu6w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=omk5zkfc&tp=webp#imgIndex=5 "")  
  
