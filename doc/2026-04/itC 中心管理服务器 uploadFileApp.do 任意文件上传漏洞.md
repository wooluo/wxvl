#  itC 中心管理服务器 uploadFileApp.do 任意文件上传漏洞  
Superhero
                    Superhero  Nday Poc   2026-04-16 02:34  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Melo944GVOJECe5vg2C5YWgpyo1D5bCkYN4sZibCVo6EFo0N9b7Kib4I4N6j6Y10tynLOdgov9ibUmaNwW5yeoCbQ/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=8n1b48rw&tp=webp#imgIndex=0 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Melo944GVOJECe5vg2C5YWgpyo1D5bCkhic5lbbPcpxTLtLccZ04WhwDotW7g2b3zBgZeS5uvFH4dxf0tj0Rutw/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=vx7xykg3&tp=webp#imgIndex=1 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Melo944GVOJECe5vg2C5YWgpyo1D5bCk524CiapZejYicic1Hf8LPt8qR893A3IP38J3NMmskDZjyqNkShewpibEfA/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&randomid=x3261qcu&tp=webp#imgIndex=2 "")  
  
内容仅用于学习交流自查使用，由于传播、利用本公众号所提供的  
POC  
信息及  
POC对应脚本  
而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号Nday Poc及作者不为此承担任何责任，一旦造成后果请自行承担！  
  
  
**01**  
  
**漏洞概述**  
  
  
itC 中心管理服务器 uploadFileApp.do 接口存在任意文件上传漏洞，未经身份攻击者可通过该漏洞在服务器端任意执行代码，写入后门，获取服务器权限，进而控制整个 web 服务器。  
**02******  
  
**搜索引擎**  
  
  
fofa:  
```
body="/mt_res_v3/img/public/logo.ico"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1iavC8EAGG3n5qMxdppRQPZd8FPUle0LHrQ1hKXw0NUrtyR1cXxmEQ2NjJBZEGNJeQxMo5bvGeEib4sF9huWjWpzBmDgFVTQoqTo/640?wx_fmt=png&from=appmsg "")  
  
  
**03******  
  
**漏洞复现**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8o9dnzNIF1hZQD9RFyU1Fibhpppjmbf3WcjmEJu922wlIcRW7DuGic5kCNB5I8NicUlTpSLg4iaGbicBE7fgEBZrdSpby2NIYQCGvXouTu7CKwFI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1hE2F2EeibHk0JVWbpOxq2iaEicQiagCBDHib01Fia6KOdmkWk27RicVUiafJicdJTfr7y2GAcX5klJtqExbKxRrAMnHiaRw10KF3j048VaU/640?wx_fmt=png&from=appmsg "")  
  
  
**04**  
  
**自查工具**  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1jenUqfcmjicjOzXptQCn8abus5WlPBpW60wbYQuswKHukZewvseJEaITqq8a5aXBBc8JtcjvEIdiaUnlGwfHt5rczSxN85Enb0U/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8o9dnzNIF1jy1ean7n0H5ziaqiaNF68tKFuyKg1rDeOx57O3tOSjTEwQSanUTjCmU7em17Bh0mmpL0rsRvau0v7NvmqCRNOrA0BUNmKDVwDgA/640?wx_fmt=png&from=appmsg "")  
  
  
**05******  
  
**修复建议**  
  
  
1、关闭互联网暴露面或接口设置访问权限  
  
2、升级至安全版本  
  
  
**06******  
  
**内部圈子介绍**  
  
### 【Nday漏洞实战圈】🛠️  
  
专注公开1day/Nday漏洞复现 · 工具链适配支持  
  
✧━━━━━━━━━━━━━━━━✧  
  
🔍 **资源内容**  
  
▫️ 整合全网公开1day/Nday漏洞POC详情  
  
▫️ 适配Afrog/Nuclei检测脚本  
  
▫️ 支持内置与自定义POC目录混合扫描  
  
🔄 **更新计划**  
  
▫️ 每周新增7-10个实用POC（来源公开平台）  
  
▫️ 所有脚本经过基础测试，降低调试成本  
  
🎯 **适用场景**  
  
▫️ 企业漏洞自查 ▫️ 渗透测试 ▫️ 红蓝对抗 ▫️ 安全运维  
  
✧━━━━━━━━━━━━━━━━✧  
  
⚠️ **重要声明**  
  
▫️  
仅限合法授权测试，严禁违规使用  
  
**▫️虚拟资源服务，购买后不接受任何形式退款**  
  
▫️  
付款  
前请评估需求，慎重考虑  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1iaC2NNojOI3bLx7QslA6InosllO7VQib2ozF0OEnmoaU89J6to9qOicm3FXY7ynxEjwAY8iacuoGH7S6eGyNwhf1yOQ0OGb6Wz1nE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=8 "")  
  
  
