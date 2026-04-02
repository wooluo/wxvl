#  Ilevia EVE X1 Server login.php 身份认证绕过漏洞  
Superhero
                    Superhero  Nday Poc   2026-04-02 03:22  
  
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
  
  
Ilevia EVE X1 Server login.php 接口存在身份认证绕过漏洞，未授权的攻击者可利用漏洞url获取在线用户sessionid 导致用户信息泄露，并且切换网站session后可直接接管后台，造成信息泄露或恶意破坏，使系统处于极不安全状态。  
**02******  
  
**搜索引擎**  
  
  
fofa:  
```
icon_hash="392278119"
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8o9dnzNIF1hbd2T2j69DFtsB3SnjdGcqxYVYIN2b8WUDsNC27icg3vibvbLkSZSNw9fOu9xY889hBlgicJuKsC7F3tcfGMX48zA1J3eJX32Fv0/640?wx_fmt=png&from=appmsg "")  
  
  
**03******  
  
**漏洞复现**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1hwjAVSbTYVyfsz6a5iaKIFH1cxWcOZ29foZiaNfZBfxG3ZBn5f7U9VNbOdaHe2sdJOKeiaavhbOBdeaYgIFW7ib7UOjgLBVPfH8FU/640?wx_fmt=png&from=appmsg "")  
  
替换cookie，登录后台  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/8o9dnzNIF1htZ3aHgk3OOg6VDjCf6TNuNnJlq49m1EsaUcVokXVmbDVAU2WaribyMpwURD7BwlP1lkrrC5H8e9OGYr2pQRKjKGkGovMhv6sE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1h1Xic4e3wBlnqNZ22RBpLHb9L86N1ibsibxBxMzTcfXaUWDhoK4kd2jL6rFeUibVKVYKBOYj32nR64Plsymz8a2GQ6ANkx8U1TznY/640?wx_fmt=png&from=appmsg "")  
  
  
**04**  
  
**自查工具**  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1gEXBjF8a5uFyGtjiatmVicFUB4ic6tHA04qRGfd7xCiact33NSyCBqbNthKFK7sAqlSXg4oibHpdtib6Jiam7IGhcV83VDtntThRPmx4/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1hYvVSHpqev9DNusvroazibF3an07iclE0DQRosyqk1lvhP99LemLhpSRYmCzhMib8udk5yGw1GGTicEO3BBN5NRgkw1DHSFt3GkP0/640?wx_fmt=png&from=appmsg "")  
  
  
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
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/8o9dnzNIF1gz6Ww7C4xiboqiabGMAjB4ib1wONWFcEoaDbq54pTneddN01JNibnmyRkyjVE4okWhky97UGQyEdYGKAJbnFY4RCbEfDOdHVicgw8U/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=8 "")  
  
  
