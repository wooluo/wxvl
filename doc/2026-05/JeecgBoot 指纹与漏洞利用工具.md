#  JeecgBoot 指纹与漏洞利用工具  
 进击的HACK   2026-05-24 11:14  
  
   
  
> 字数 402，阅读大约需 3 分钟  
  
## 前言  
  
Jeecg-Boot 和它的二开系统用的挺多的。  
  
官网：https://jeecg.com/  
  
源码下载：https://github.com/jeecgboot/JeecgBoot  
## JeecgBoot 指纹  
  
fofa  
```
title="Jeecg-Boot 快速开发平台" || body="积木报表"body="jeecg-boot"app="JEECG"
```  
  
Zoomeye  
```
app:"Jeecg-Boot 企业级快速开发平台"
```  
## JeecgBoot 综合漏洞利用工具  
### jeecg-  
  
jeecg 综合漏洞利用工具,程序采用 javafx 开发,环境 JDK 1.8  
  
项目地址：https://github.com/MInggongK/jeecg-  
  
![5ec5f990cc2d92145516de64b568722b.png](https://mmbiz.qpic.cn/mmbiz_png/oQ0sWhcqsVm3t4S258HFgUEb9x9XZ7kkIzrL8yEZSWR7WtnjN6r0jF9OdG43Cg3N9mgX9zs5JVvwQqhxsgbFYtw7rSzcAa0iaMFYiaS0It9Zs/640?from=appmsg "null")  
  
5ec5f990cc2d92145516de64b568722b.png  
```
java -jar jeecgExploitss.jar
```  
  
![2fcb18a5cc77d6fbcab51438ecffe506.png](https://mmbiz.qpic.cn/sz_mmbiz_png/oQ0sWhcqsVkicJQYFQk7E27gcwCkGl9SJZYqZcVq3xy9JbsUF1z3OkGdicVkD6oKrblYiajxxCVLj0hNFF9tBkaWpAB7Pb9TykK9giagxmg8cQs/640?from=appmsg "null")  
  
2fcb18a5cc77d6fbcab51438ecffe506.png  
### JeecgGo  
  
JeecgBoot Go 版本综合漏洞检测工具  
  
JeecgGo 综合漏洞检测工具, 基于 Go 语言开发。使用时, 需下载主程序以及 Config.yaml 文件放在同一目录下运行（重要）, 运行结束后会生成 result.json 文件, 里边包含检测到存在漏洞的 URL、payload 以及响应内容。  
  
项目地址：https://github.com/Msup5/JeecgGo  
  
![44bb82c0ce580adfdefeba45bd4be866.png](https://mmbiz.qpic.cn/mmbiz_png/oQ0sWhcqsVlgjyR1YzDTB37zv8jHx4DNLcgQb00oYhh6b3QkqLQ8sKV9VUYl9F9oD0pVAWM9zQXlosdnytHGzVj0yMqwMM5Hvobg0YiaOYss/640?from=appmsg "null")  
  
44bb82c0ce580adfdefeba45bd4be866.png  
  
简单用法  
```
JeecgGo.exe -u http://127.0.0.1/jeecg-boot/
```  
  
携带 token 进行测试  
```
JeecgGo.exe -u http://127.0.0.1/jeecg-boot/ -x token
```  
  
命令执行  
```
JeecgGo.exe -u http://127.0.0.1/jeecg-boot/ -n sendMsg -c id -x tokenJeecgGo.exe -u http://127.0.0.1/jeecg-boot/ -n queryFieldBySql -c whoamiJeecgGo.exe -u http://127.0.0.1/jeecg-boot/ -n loadTableData -c "echo 111"
```  
  
check、column SQL 注入基于延时技术检测漏洞是否存在，主要靠比较响应时间的差异。网络波动可能会直接影响响应时间，所以这种容易产生误报，不可避免。为确保准确性，强烈建议对检测出的漏洞进行手动验证。  
## 扩展  
- • JeecgBoot 漏洞利用的 Tips [https://mp.weixin.qq.com/s/er7kZvvZnXuIhqXCMqG21w](https://mp.weixin.qq.com/s?__biz=MzkyMzI3MTI5Mg==&mid=2247485503&idx=1&sn=67f61c1a44a92c2a2f2ba81255db09db&scene=21#wechat_redirect)  
  
  
- • Jeecg-boot SQL 注入/命令执行漏洞集合 [https://mp.weixin.qq.com/s/bzAf77UvNFbxsghEjzqLqw](https://mp.weixin.qq.com/s?__biz=MzkxMTUyMjUxMw==&mid=2247521965&idx=1&sn=369c8f8ca717bca64aaa512fea5ef0ee&scene=21#wechat_redirect)  
  
  
- • [https://mp.weixin.qq.com/s/y5OvWLpvGNoteGZPkajJWA](https://mp.weixin.qq.com/s?__biz=MzkxMTUyMjUxMw==&mid=2247519488&idx=1&sn=5122c6da0f7d10ab35c20697f48ac1e3&scene=21#wechat_redirect)  
  
  
- • https://c0olw.github.io/2023/08/15/JeecgBoot-SSTI%E4%BB%A5%E5%8F%8AJDBC-RCE/  
  
- • 攻防打点之 Druid 未授权利用 [https://mp.weixin.qq.com/s/0EYqQ3pZepVLo9hVozZ_lw](https://mp.weixin.qq.com/s?__biz=Mzg4MDc2MTUyMQ==&mid=2247484086&idx=1&sn=7d0e37a3011870a9f49b3af6cd540bc8&scene=21#wechat_redirect)  
  
  
- • 九维团队-绿队（改进）| jeecgboot SSTI（RCE)漏洞复现 [https://mp.weixin.qq.com/s/eT32vnk_8anS3e-2B287cA](https://mp.weixin.qq.com/s?__biz=MzAwMDgyNTQzMQ==&mid=2247530176&idx=1&sn=2643a6cc48a1d0164a05120ab6506322&scene=21#wechat_redirect)  
  
  
- • Jeecg-Boot 命令执行与 sql 注入漏洞 [https://mp.weixin.qq.com/s/K7UTdEflFdCqkt5YkJPTGw](https://mp.weixin.qq.com/s?__biz=MzkyOTMxNDM3Ng==&mid=2247487597&idx=1&sn=1540262509f76f372e5bff223c4dd3fd&scene=21#wechat_redirect)  
  
  
- • JeecgBoot 代码审计系列 1 [https://mp.weixin.qq.com/s/GJPVmah75eyBObY53vDnhg](https://mp.weixin.qq.com/s?__biz=Mzg3MDU1MjgwNA==&mid=2247487556&idx=1&sn=fac277634681b9befaef2925b835f57b&scene=21#wechat_redirect)  
  
  
  
  
   
  
  
