#  干货 | HOST碰撞漏洞挖掘技巧  
HACK学习君
                    HACK学习君  HACK之道   2026-04-02 00:45  
  
**文章来源：转载来源语雀文档，非**  
**P喵呜****作者本人投稿。****如有侵权，请联系删除**  
  
**0x01 前言**  
  
****在实战中,我们总会对一个企业进行资产收集,在这个过程中会收集到许多资产,有域名有 ip但有的时候打开的域名指向的是一个内网 ip 非常无奈 :(而打开的 ip 状态码更是直接显示 400,403,404 禁止我们访问还有一种状态码显示 200 但是输入啥都没啥变化的同时对它们进行目录扫描,也是常常没有结果那么这种情况下, HOST 碰撞技术就可以尝试使用了  
  
**0x02 host 碰撞原理**  
  
****当数据包的 host 头替换为某个域名时在访问该反代服务器的 ip, 如果 nginx/Apache 的反向代理的 host 配置没删除,就会把请求转发到内网对应的 host 业务服务器上, 接着返回该业务的信息, 实现本该隐藏的业务访问  
  
简单点就是: 当数据包的 host 头替换为某个域名时在访问时该反代服务器的 ip, 如果页面发生了变化,返回了对应的资源, 即可判断为存在 host 碰撞  
  
**0x03 host 碰撞什么时候存在?**  
  
****1业务通过 DNS 解析到外网，后面删除了 A 记录(但是 nginx/Apache 的反向代理还没删除)2测试业务(不对外开放的业务,只流传于开发或是测试使用)  
  
**0x04 什么样的 ip 能进行 host 碰撞?**  
  
****这里我看网上很多人写文章都是写 ip 状态码为 40X 的时候,在进行 host 碰撞但是我想说,这不一定正确!!!实际上,我认为应该改为任何一个 ip 都有 host 碰撞的价值!!!这个点的问题在于,现在很多较大的公司比较流行,资产统一把控,也就是自己所有的资产全部收缩进内网然后整个 nginx 或是 Apache 服务器,想对外网开放某个资产的时候就通过这个反代服务器新添加个配置映射出去这就导致了一个问题, 那就是如果配置不当了, 忘记删除这台 nginx 或是 Apache 服务器的域名指向了那么我们通过修改 host 就可以重新访问这些以前在外网后面被收缩进内网的资产了  
```
```  
  
这种情况, 我对大公司进行测试时, 已经发现不下于三次因此我认为只要是个 ip 能够访问,那么它就有进行 host 碰撞的价值当然这个是我自己个人实战经验,读者们看个乐乎就好了 :)  
  
**0x05 host 碰撞检测方法-思路**  
  
****网上大佬是遇到 40X,或是收集到了内网域名在进行 host 碰撞这里我的检测方法对比网上那些大佬的比较泛~~  
```
```  
  
**0x06 host 碰撞检测方法-实际**  
  
****测试方法的话,我这里提供两种比较高效的测试方法  
  
**0x06.1 测试数据**  
```
```  
  
**0x06.2 方法一 - 使用工具 HostCollision**  
```
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEciaXyiazHoibjtwvcdoftVNrdRgwDqiaGpBp7nOsppnS4CY68pd8W7daWQ/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQENpuK4QiaRtgBxS3lQCSlYHG7IzhB4jiagq5ibHuFBI5pF5ibCbNuiaQ4H2Q/640?wx_fmt=png "")  
  
**0x06.3 方法二 - 使用 burp**但是这个方法,只能一个 ip 一个 ip 的测试,无法批量 host 爆破第一步: 找一个你认为有漏洞 ip 我拿的测试数据的 42.xxx.xxx.xxx第二步: 将找到的 host 保存成一个 hostList.txt 分别填写进对应的数据(一行一个)第三步: 构造数据包如下图![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQES1s6kT96H2LlCNR5Mx65vxcxbpibwdkpqFlQgkfTodzGcWKQn1xD2ug/640?wx_fmt=png "")  
  
有了这个包以后,发送到测试器里面进行 host 爆破  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQE5iatTCnlBHjqiaibvvGRCcbu3c94ksAL2Fznn3U1CTh6bfpQUD0OVHotw/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEiayHicKRS5W4HmIPezSPhQayJ5t4cWAUZqCs6IS3beqmrN1HDicaeprkw/640?wx_fmt=png "")  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEqQdCXtRGLTGhtzlHkWDaLn237K1y5WAicMIv8FYh8z02icyKQRAJpS3Q/640?wx_fmt=png "")  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEMcnFYzicy4ZqkpPZetxHNzA1kExWAKib4K3uu7BXKH2Q9nO9tHHtfCiaA/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEj330fq4Zl66YMCjcxgG2pYKiciagUHRaLSAhSQeQyMPzcob0N54qbicVw/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEib5NiaVGeeEo3K84EKRo6YBODDzI9aXwpqg9U1xHiaRiaobs9oJcRzH96Q/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEvk365RreykJUOQFBvTyxmWfjTicNQffqxVSAUslusicWZvktHPNe0Z2w/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQENGyfwh9ym8ic6JlxWRbtib8m6C3NnGRaic57jabWqXlrVjaFbBT01ha3A/640?wx_fmt=png "")  
  
  
**0x06.4 浏览器访问的方法**  
  
  
**0x06.4.1 方法一 - 系统 hosts 文件修改**这里就教如何利用 windows 访问对应的站点  
```
```  
  
打开文件: C:\Windows\System32\Drivers\etc\hosts![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEtEID4G72fMDENbLL9qLAw6ArXPLyKHpILICpJPWjO3TFWREebbAXwQ/640?wx_fmt=png "")  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEoicrgyWFHT473P03L0JQtiaeS78nrepdOV2sNCWLn1WwHfQicncg0mVbg/640?wx_fmt=png "")  
  
**0x06.4.1 方法二 - 使用 burp**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEZJd5g21TBu14eN0icGv8Fcpnqc4E3eA6rPbJH6w5eGGmC2ibVkbtG1eQ/640?wx_fmt=png "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEIpoAsia3fHNmHztzWNG1Vcn8rFHRib3McWwoBZ6ut6ia5EQACMneHfoIQ/640?wx_fmt=png "")  
  
  
如果还看不明白,这里也有中文版的可以看一眼  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEdlbsbD1Usfu7hVsEWrHtG1KdJHyNHx7YZZibg9rpx3icwtvwvumaNkBA/640?wx_fmt=png "")  
  
  
**0x07 总结**  
  
```
```  
  
要是前面的文章还看不是很懂的话,可以看看这张网站访问流程的图会更加清晰  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IXOicg347dAjEdfxCltfeNHEry3iaj6RQEsFDlDPrFOpg2CKlBIQ7pAopG7gcT7qtfPkBmumTpYDP243ghicQCSqA/640?wx_fmt=png "")  
  
多试试总会成功的 :)  
  
  
