#  ZIP 炸弹漏洞深度剖析：原理、构造与实战利用  
原创 m3x1
                    m3x1  梦醒安全   2026-04-25 23:57  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Aj9tsa4DmOmra6EI659XoNIvNn9wnMpVqicmqFmpJAwWJA0fw90SqBVOCEicpkLlV63QbNibrCx4BYT4JKia33l1Yg/640?wx_fmt=png&from=appmsg "")  
  
免责声明：本公众号内容仅用于知识分享和学习，由于传播、利用本公众号所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号梦醒安全及作者不为此承担任何责任，一旦造成后果请自行承担！  
  
PART.01  
  
漏洞概述  
  
压缩  
包  
炸弹（又称解压炸弹）  
是指解压缩后能够产生巨大的数据量的可疑压缩文件！默认设置是文件扫描中产生500MB以上解压数据的是“解压炸弹”，实时监控中是100MB，邮件监控是30MB。这样的压缩文件解压缩可能对解压程序造成严重负担或崩溃（可能用来攻击压缩软件以及占用大量电脑资源，或者杀毒软件的解压缩功能）。解压炸弹内，还可能存在病毒，解压中会自启动窃取用户信息  
  
PART.02  
  
常见场景  
  
**自动解压**  
 ：上传后系统自动解压压缩包（如云存储的解压预览、OA 的附件解压分发、电商的商品素材解压存储）  
  
PART.03  
  
利用方法  
  
使用生成脚本生成压缩包炸弹（  
文末获取）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/pqOYI94QTU5Ry9NpatbPbicLhniaiar9mf9AoEhs2uMia0bDXjbmYRx2S32FpXvKmiaQGKnMdluVfc4ITTYmtMwnOAhOUicTIf03XLba7vLKz2CII/640?wx_fmt=png&from=appmsg "null")  
  
查看生成的内容，可以发现压缩包大小很小,而解压后的大小却是呈指数级增长  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/f0zVXnDXPGOJOCPyvibS7hNwXvIIeSEUvpkCyNtiaKbibqfRTt859hR9pP5hWE52KUoib2gN0voJvicBWo5xk3pRPjxhFviaguYzhWxs6wsAoaib08/640?from=appmsg "null")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/f0zVXnDXPGMrwTxKplx90vhZaibfy9sXbQjappU99to5AfTmdv31iasQzgMUubcwUTmYdZiaxBPbmwJnKNu0RbkLgazic95icVGFaDEsccH3oVfY/640?wx_fmt=jpeg "null")  
  
若在上传文件时，系统后端设置了自动解压，则可耗尽服务器存储资源造成服务宕机  
  
PART.04  
  
往期推荐  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/b7iaH1LtiaKWW8vxK39q53Q3oictKW3VAXz4Qht144X0wjJcOMqPwhnh3ptlbTtxDvNMF8NJA6XbDcljZBsibalsVQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=49 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=5&tp=webp&wx_lazy=1#imgIndex=50 "")  
  
**往期好文**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=5&tp=webp&wx_lazy=1#imgIndex=53 "")  
  
  
  
[CVE-2026-24061漏洞快速检测工具](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485070&idx=1&sn=7513ea32faa0fa4ef543b4481e37ab99&scene=21#wechat_redirect)  
  
  
[YoScan：一站式资产收集神器深度解析](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485072&idx=1&sn=4fde1a17a98f82dfaab54ab15d7ed636&scene=21#wechat_redirect)  
  
  
[LoveJS插件——Web漏洞挖掘的高效信息搜集利器](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485079&idx=1&sn=bced0fba3490ff0905f6ef845ee553e4&scene=21#wechat_redirect)  
  
  
[记一次某实训系统Web安全综合实战靶场思路](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485144&idx=1&sn=bc3ed6d4f4398b288ae81c2bd875371d&scene=21#wechat_redirect)  
  
  
[CORS 跨域漏洞攻防实战：靶场复现 + POC 编写 + 防御配置](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485167&idx=1&sn=be8992eed72da18ad5daf44c27966e8d&scene=21#wechat_redirect)  
  
  
[记一次某实训系统域控攻击过程wp](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485422&idx=1&sn=8365315cad7dce6e2818d9136923c44e&scene=21#wechat_redirect)  
  
  
[记一次某实训系统恶意流量分析思路](https://mp.weixin.qq.com/s?__biz=MzYzNjAwMjQ3OQ==&mid=2247485448&idx=1&sn=aff171cb03e3fede4d282236db64b1dd&scene=21#wechat_redirect)  
  
  
  
PART.05  
  
脚本获取  
- 公众号后台回复“  
20260414”获取  
  
  
  
