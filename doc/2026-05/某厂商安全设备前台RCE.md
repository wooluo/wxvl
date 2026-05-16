#  某厂商安全设备前台RCE  
原创 ptr
                    ptr  UpRoot   2026-05-16 17:20  
  
### 起  
  
给自己定了个小目标，挑了一款安全产品来审计前台RCE，该安全产品通常部署在关键的网络节点并且处于支配地位，因此本文所产出的两个漏洞，理论上可以接管大部分的流量探针、入侵防御IPS等安全设备。  
  
本文仅作技术分享，漏洞均已被安全厂商修复，因该产品较多映射出公网，故不会产出poc，并且厚码。  
### 承  
  
原生的shell仅能执行指定的命令，需要突破shell限制，转到bash修改root密码。为下文分离源码做准备。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pc9OPic42UMTwxeMv11qmEC5M3DGp9E7oSC8iaAQyohmA72BPEibvcxPL0ryV2cicWXL3icbXibJGWicHiaicQrVX3AEnhCer46XB97wLgc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pdSqJHOfLd2yKeQWSxFkWhGibWkqQ3YVamfQiboLYT2Jicrlt9fkTnlTla5XukXicbniaeBQYEaAkp6asIEfJIQP6z9VsLKJUb2fpias/640?wx_fmt=png&from=appmsg "")  
  
开启SSH，准备窥探系统全貌。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pdOdbBKEibYsBEiaQm5qV6S5F46Va7g4Noy1csklyb1aUvQC0CYVJib7uZCq22s7uiatF2RmgRciaTrsicTjm5UyEJYD1HzBzAicibM7Co/640?wx_fmt=png&from=appmsg "")  
  
设备出厂前指定了IP需要更改下。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pdXiaTcjnQKXicyN1uEYRQPXiaA1B8naaoDgnibNL381AVG1Q40IfMSsJCUtBvib4riaOzVx1jU9AdcIvTE5hKHIJuL8wcOMx7F4UlYY/640?wx_fmt=png&from=appmsg "")  
```
vi /etc/sysconfig/network-scripts/ifcfg-eth0
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pcMcyncoYOpCG4YyThonwB2bbTYBGIuF6CqsdnvQwws99DCzhc9W5ByzbrQWQRM3udFR1TAw83oX0mGic3eschyXszP8sciaZKn8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pc1tt9vrpOsiaiceVyNFAbOCSTw17iaIS1HiaIMOJyQic4kicN6w1KMtEbnYkvgibLFcrjBK0duDRdDdUw3KG5RjzaVm1hNCBvWoZD1as/640?wx_fmt=png&from=appmsg "")  
  
初步信息收集以及分离源码。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pe1mwN6kA8tMRdmgaemUuUdia341ldug884CsszDFykxphu2yjSHKtzRKFUDiav7WSz7WOYoCeD8SO0aO6wAHQgxN8tGqdVK871E/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pd8b3zI1qw41p8vLMLC9fwHCBRibicjpfMEtgDRXRg9wScyezIlom1achvH9YAlv8rN0jmHcBTmNgRJ2yOeZlCnA8dl2oV32iaQk0/640?wx_fmt=png&from=appmsg "")  
  
存在activemq并且是漏洞版本，第一时间想到的是借助任意读来R，后面发现8161端口做了限制，外部不可以连接，于是就放弃了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pdczYeic30LDhKGwdviabVE9B9fencib6mTbPSOAbhpm6OaxcL6pSicMor9zlwQzYkT1Hicjp2VX1wvM52Nl0jaxVMXNWpcN0icfiasTA/640?wx_fmt=png&from=appmsg "")  
  
nat表将80重定向到8080、443重定向到8443，原来起在这两个端口上面的服务，可通过80、443来访问了，这是为了隐藏实际端口。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pdkqoWbgm9FeQXsvosAs3QOz0v0vcBicLxUL1rvqvibJnKkHT9y95xaF5uNtzIpwel4iaBlOVEsbiaaxibicF3hVxv886G7gFMJPtENI/640?wx_fmt=png&from=appmsg "")  
  
尝试curl路径，发现服务存在问题，我又修了服务一段时间，最终定位到是数据库连接的时候进行了ssl，当前服务器不适配，直接改配置文件中的jdbc连接信息为userSSL=false即可。  
  
因我们在服务器上，可以让服务器开放5005端口，然后接入IDEA进行动调，提高效率。  
```
iptables -I INPUT -p tcp -s 192.168.41.101 --dport 5005 -j ACCEPT
```  
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pftPmGaQ9HYgkVHRjVdcb2MlVs0SrziaE4xBYXLE7ib4LL50ZNgcp311SyeDgibnN33wlibmwmBxKyVwoPO97Q1XopodGbWhwoNZGQ/640?wx_fmt=png&from=appmsg "")  
  
前期准备工作就做完了，下面进入代码审计。  
  
因厂商针对权限校验做的比较死，看了一段时间代码觉得没有可前台R的点了，后面发起一处Restful调用接口未被写入权限拦截器，可以调用任意注册的Serveice服务的public方法，这有了极大的操作空间。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pcVib7GImnObj25yjr4rAyV7MlicdjKY91M4oUibvom8vLGQMSnF2LbD16OD1UjQM3Yibr0Yg1gzSEoMibD9vlpnST73kXzSc6QHkY8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pckOaL4ficuGmQ6VMXyWmibAlkmsDVDfYsK2pUyLp29AYqJzWFFd4OxgmPq7FibMZAAwwx5nzN6ObTflXDdKFZxSezS0VfxIm08e4/640?wx_fmt=png&from=appmsg "")  
  
很快就能定位到一处命令拼接，并且外部可控。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pfsalNf3SWvfRAHpgl6krXE5UgI14jWFWIPPATlRuyq7k8eD68mdrfSfgvDSr015KxwjPHm0WS3rbdK099XCjMQzakpNeayoicE/640?wx_fmt=png&from=appmsg "")  
  
仅仅命令命令注入倒是可以R，但是R的不优雅，好在系统有处限制路径任意文件上传，这就可以优雅的R并打入内存马了。  
  
当然，不借助这个文件上传，也是有别的优雅的R法打内存马的，这里就不写了（组件反序列化）。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pccpx2moll1fbw3CUq57RB3pnlJbBHAdDdkpjFI478kgacyQFdIO4NjWCUcibNZ3GiaNwYJ0O1UmaicubCtNgrxwv4Qg6jakiaVeV8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pdrR4IRr3ECe6g3AMpfmLVSBWvicViaPqPBv6Oj32ibHb8kqM7LVLZTbIRtdG4x2w65NYezoDUV8sqHWzNRlzkXYZU2xpslS82mEA/640?wx_fmt=png&from=appmsg "")  
  
写到这，大家应该都想到了我的R法：实战中追求严格的不出网的条件下，可以通过先上传一个落地打内存马的txt，然后cp到前台web路径下并重定义后缀为jsp。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7peFTThBrRIPfpqicdk14f1Oib13fsoPiacq413A22XyxdKzOkxw7rjN3jSibnbLD4R4E2VAm04vVqibm5rBF8ONqa0WRJSUSulFxjFg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7peeXYGINsRCibRx9RqX1m8Zs4iajwxKjFsCPic7pyiahhZOURDP0cgyBr80HlxGTjKAy6XUjvXROqf7BVWyWn4MxUMWaErPciabvswE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/KA5KNdck7pfsh04qhLnmSfSdQl5r0hLO5GQJzbPHqust2ibYOH6IVkX1eAo3OxfnSibd3sYssJ1J8FhvWV49A8J4jAibPs0vVYibznJPewD3rD4/640?wx_fmt=png&from=appmsg "")  
  
那该怎么致盲蓝队或者接管大部分流量设备、IPS呢？那你一定会想到，既然你都可以调用任意Service方法了，那大概率就也可以添加用户和修改密码。  
  
战略上有了思路定下了路线，那战术上就交给AI来做就好了，减少工作量，把你的思路输出给它，它就不会致幻，它就可以指哪打哪。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/KA5KNdck7pdbo4zH6hTDeNRkC20icjhHSTenlpPrtG2w4IxQpibF3LDpBl8s0Y6ZsBbxkZgXJ0ucCX1Axy2eqA1XyHoZlscNZGMzSZribyQyJY/640?wx_fmt=png&from=appmsg "")  
  
于是就可以以管理员身份进入后台接管安全设备了。  
  
（AI稍微操作下50刀的额度就跑没了...）  
### 合  
  
再加把劲，也许以后的选择就会多一些。  
  
- END -  
  
  
