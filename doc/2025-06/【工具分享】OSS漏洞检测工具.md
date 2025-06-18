#  【工具分享】OSS漏洞检测工具  
秀龙叔  黑客之道HackerWay   2025-06-18 01:00  
  
![image-20220703203021188](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvcRIPppzoA55WekyoXJdX3n7pHDfVC43mG718FyudWClnGS8g3R8icJg/640?wx_fmt=png&from=appmsg "")  
  
简介：  
  
一款OSS漏洞的检测工具，此工具与原先分享过的OSSFileBrowse工具分别可以检测出大部分OSS方面的漏洞。  
  
使用：  
```
git clone https://github.com/UzJu/Cloud-Bucket-Leak-Detection-Tools.git
cd Cloud-Bucket-Leak-Detection-Tools/
# 安装依赖 建议使用Python3.8以上的版本 我的版本: Python 3.9.13 (main, May 24 2022, 21:28:31)
# 已经测试版本如下
# 1、python3.8.9
# 2、python3.9.13
# 3、python3.7
# 4、python3.6.15
# 5、python3.9.6
pip3 install -r requirements.txt
python3 main.py -h
```  
  
![image-20220716140707903](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvrp4kXPsK7umhz21NqkOX8xO0CRdep5qiaVZkQHLl7q6WbV0GQGgfbRg/640?wx_fmt=png&from=appmsg "")  
  
使用之前需要在config/conf.py文件配置自己对应的云厂商AK  
  
![image-20220716140934866](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvUdEAepL4IXphydMOVLFabZ0d15Hn7Bsic0oRqvUY88d6OOMDGiaCgibAA/640?wx_fmt=png&from=appmsg "")  
  
阿里云存储桶：  
  
单个存储桶检测：  
```
python3 main.py -aliyun [存储桶URL]
```  
  
自动存储桶劫持：  
```
当如果检测存储桶不存在时会自动劫持该存储桶
```  
  
![image-20220703202339058](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvEwwaurTDZIsasLob1jxWfkFdShxd7xfstIVwibcWNp7VUlJGK4yucIw/640?wx_fmt=png&from=appmsg "")  
  
批量存储桶地址检测：  
```
# fofa语法
domain="aliyuncs.com"
domain="aliyuncs.com" && server="AliyunOSS"
```  
```
# 使用-faliyun
python3 main.py -faliyun url.txt
```  
  
腾讯云存储桶：  
```
python3 main.py -tcloud [存储桶地址]
```  
  
![image-20220716141554856](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvBYOuyuibKmXxhv8b5YwwEX0wRGSMvUSNyUNibApLMqzXt0NV3CpEOflQ/640?wx_fmt=png&from=appmsg "")  
  
华为云存储桶：  
```
python3 main.py -hcloud [存储桶地址]
```  
  
![image-20220716141948046](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvYwchhibtM3WJCdw9QOD0dmNGC9wabVH1JOykfmwZZ6aYIfMKz8fgWkg/640?wx_fmt=png&from=appmsg "")  
  
AWS存储桶：  
```
python3 main.py -aws [存储桶地址]
```  
  
![image-20220716142431142](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvmdOicBWpJKcsVOeqoTYlliaPIHmJgcUMcCVCAQAx2Fn6UwpGtjSWKgQA/640?wx_fmt=png&from=appmsg "")  
  
扫描结果保存：  
  
扫描结果会存放在results目录下。  
  
![image-20220716142617997](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvrjicic0dZlia5zAhSzYUGlJN2dOeIYsX852GtjPFL1ue3licOpxVF4tm6A/640?wx_fmt=png&from=appmsg "")  
  
![image-20220716142641883](https://mmbiz.qpic.cn/sz_mmbiz_png/g68qqsJpeZIND3fP3DsibG0QibiaKO8VrIvYTl7FicH9IPxLeLb9zIYTUuf4wPo2ZlBsh9piawiaTwUQrdBUSEEaMpgg/640?wx_fmt=png&from=appmsg "")  
  
- 公众号回复“  
9851  
”获取下载链接  
  
**用您发财的小手点个赞鼓励一下吧❥(^_-)**  
  
**关注公众号便于更好的为您分享(#^.^#)**  
  
  
  
  
**免责****声明**  
  
本公众号“黑客之道HackerWay”提供的资源仅供学习，利⽤本公众号“黑客之道HackerWay”所提供的信息而造成的任何直接或者间接的后果及损失，均由使⽤者本⼈负责，本公众号“黑客之道HackerWay”及作者不为此承担任何责任，一旦造成后果请自行承担责任！  
  
  
谢谢 !  
  
  
