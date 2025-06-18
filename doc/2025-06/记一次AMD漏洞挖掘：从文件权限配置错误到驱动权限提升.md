#  记一次AMD漏洞挖掘：从文件权限配置错误到驱动权限提升  
 黑白之道   2025-06-18 02:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
文章作者：先知社区（Ba1_Ma0）  
  
文章来源：https://xz.aliyun.com/news/17962  
  
  
**1**  
►  
  
**AMD**  
  
  
超微半导体公司（Advanced Micro Devices, Inc.），通常缩写为 AMD，是一家总部位于加利福尼亚州圣克拉拉的美国跨国半导体公司，为商业和消费市场开发计算机处理器和相关技术。  
  
  
**2**  
►  
  
**漏洞挖掘过程**  
  
  
在使用PrivescCheck工具收集信息时，发现AMD目录可以被用户修改  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLia2roc5DvZDKkUpjYD4ng9TKV0SAuSBpib7fGeR376cwDiazxL6yPPyC7w/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic&watermark=1 "")  
  
  
虽然用户权限只能读取和执行，但Authenticated Users是可以对此文件夹进行修改的  
  
## 什么是Authenticated Users  
  
  
Authenticated Users（已认证用户） 是Windows操作系统中的一个安全主体（Security Principal），代表所有通过系统身份验证的用户或计算机账户  
  
  
意思就是，普通用户可以对AMD文件夹进行读取、执行、修改  
  
## 文件权限配置错误  
  
  
在AMD文件内有两个子文件夹  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiamTZPw0iajGwVEwRFtlezMImPprSA64BxO3pLF4ibl6Ow4pv2uibSjJQZA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
经研究，AMD-Software-Installer文件夹只是Software程序的安装包目录，不重要，重要的是Chipset_Software文件夹  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiastQszxseZ3aG16t20fW7I88HHhIiaKLIYdPckv1rjp5JpGSXuBOwe9w/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
其内部为AMD驱动安装配置文件，包括驱动inf安装配置文件，驱动sys程序，驱动msi安装  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaEITmyUPDiaRnVMCRia2y8WA1W8ds6d7qibGlAhLHBoibT466rpxr5nFtRw/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLia5DErluFNPyYzV1LYzz1Aq62IKqIAWZkWP4VnRMrTQQa0h4h5fQ8A2Q/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
普通用户对此文件夹内所有文件均可访问、执行与修改，最重要的是'修改'这个权限，代表用户可以无条件修改驱动的安装配置文件（.inf），也可以利用msi文件安装恶意程序  
  
## 利用漏洞  
  
  
这里展示普通用户可以随意修改驱动的安装配置文件会造成什么危害，这里用AMD PSP驱动做演示，首先，要读懂它的安装配置文件，文件夹目录：  
```
C:\AMD\Chipset_Software\Binaries\PSP Driver\W11x64
```  
  
使用文本编辑器打开amdpsp.inf  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaTic04jicKpVPqPjz5Q4oNjATD6ibwggJqEk8SquRsicpx4p1EclVXNtEWg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
INF DestinationDirs Section 是 Windows 驱动程序安装文件（.inf）中的一个重要部分，用于定义文件在目标系统上的安装路径，它指定了驱动程序和相关文件应该被复制到哪个系统目录中，文件默认是从system32drivers目录下导入dll，可以修改配置文件，让它导入用户指定目录下的dll  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaxvftPCIetk4osV6UZZxMbVunMzM902XEg0usPIjRqYgiagriblIm1S4g/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
修改至从AMDChipset_SoftwareBinariesPSP DriverW11x64目录下导入dll，这个目录可控，能写入恶意dll  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaZkYLZ6XljpK7ZwHOJMV7rTWEFGfFiapksmAbo8uG93icj1icFv3icrFVXA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
这里是安装的sys程序，和移动system32目录下的dll，作用是将指定目录下的amdtee_api64.dll，amdtee_api32.dll移动到system32目录下  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaL6OptgnVPpfpBy3Z5qjcw6Ob6rTwYwPicf48wc0DEv5JUNZPKwQTic8g/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
这里通过前面修改的文件夹，可以将AMDChipset_SoftwareBinariesPSP DriverW11x64目录下名为amdtee_api64.dll移动至system32目录下  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaRhe5lPY0Ddk4s9J3rJNYwPLLRYWRBMhRpfkiaFXGWibuMmncNGj6KrfQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
为了区分，移动后的文件名改为了777.dll  
  
### 更新驱动文件  
  
  
打开计算机管理，依次选择系统工具-设备管理器-安全设备-AMD PSP 11.0 Device，右击选择更新驱动程序  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiae2C8Kjpkqpd0DzvZC5OBJsnEibYPiccUM3MGOxkfF0iaY3Sfsibx4CLk7w/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
选择手动查找并安装驱动  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaSUoNn2yDzkrpKY84WGoW8aHt2WmV394229ibT6G1JcKmWfL2ic7NOuibQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
选择从本地获取  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaPu0h82rhfrk5ov9OgbE9Rs18Qq7mSzlFINl2ondTKwnbOibsprSvsUQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
找到AMDChipset_SoftwareBinariesPSP DriverW11x64目录下的amdpsp.inf并点击确定  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiazwkzBLEfnwAUy4icAy0MMWF7m0CKqT9dhNibAeJhiadtPyLjvAlJePvUA/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLia18pWeePIJ1iaS1OfrZRqVggIBfcGUGyApvG5rrYkqd37BPuEqosMibfg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLialsUtqSPCTKmPIGiamYF8WLiczicZmeKFic3wib666sMkJRozpm6XibmcIeSQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
打开system32文件夹，成功将恶意文件移动至此目录  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaV3vtC5WxuEmCwXNicIfmee2dribibV41z9a7gmucNyZveNDeCck7M6GCg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
这里只是验证其中的一个文件移动操作。  
  
  
**3**  
►  
  
**提权漏洞挖掘**  
  
  
通过前面的文件权限配置错误，检查AMD当前运行的驱动文件目录是否可以被修改  
  
  
遗憾的是，正在运行的驱动文件夹也可以被修改  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiau4AjiciaxRYdbdfwz2C3gCVxsbPTiadzXSIsyt6TlnV0ZHQH2d33pwnIg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
下图是其他正常驱动目录的配置权限，只有system权限才能完全控制  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaDiawU8Q9hDvv8eDgrXZagPIvxPsaIkZPZkScaJmWM01sicSxsFYMdUQg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
AMD External Events Service Module 存在一个权限提升漏洞，其中 atiesrxx.exe 会从当前目录加载一个不存在的 DLL（MSASN1.dll）到程序栈中执行。需要注意的是，由于用户可以修改驱动程序文件夹，而该文件夹中的内容会以系统权限执行，攻击者可利用此漏洞在本地机器上获取系统权限。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaThSiaMQgnXUwEtmGWibS2eqo4KUc5IMLMrSibQK4hiaXgqRykqLvpaMibuQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiamPc9EFaib0Hta9BpLzldYHXJtkTcEogib8ibGuibibQEAdiaH9tu6DdT87KQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
当 AMD External Events Service Module（atiesrxx.exe）运行时，它会从当前目录加载一个不存在的 DLL（MSASN1.dll）并在栈中执行。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaOKw1RUvpb9ZkT5BknGQAhBiaAfQ5cQALv79jibW5gGw3xo6mPefp8jag/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
编写一个用于验证漏洞的 DLL，并将其重命名为 MSASN1.dll。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiawXlXnD6G6vmu1dQEAibkd1A2IzSmKNYy08atOeQN8uEDjsGV4mviavTQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiay3N7dibTMZshMASgJaO1q5CjI722U0JVYXotGZnodtnRxUCrcpYRMsg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
将 MSASN1.dll 移动到 AMD External Events Service Module 的驱动程序文件夹中。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaX4uj5vgYWLkfT57ynYhgGf3HX6bD4kOAp28pNlyTC1Sqt5CibSZpiaicg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLia16vs1AlFycVJ4etKaFetmx2YQKIlfCff0pRmUTYFiarAPuqibw36TvLg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
重启服务后，  
恶意 DLL 成功以系统权限加载并执行。  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLiaJiaiaTuu9FABNutFnZJOOicXg2QUL3h29Byz8eHPxYticfpdMNm0Avu2tQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
因为服务是开机自启动的，所以还可用作权限维持  
  
  
提交赏金漏洞，官方回应  
问题出在 AMD 芯片组驱动程序软件的安装程序中，不在赏金范围内  
，但后续  
更新会发布安全公告或简报  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/XoIcX2HtlUBEokcBtic8V9SHP89CYeDLia8l66aO04u27ZLxIxkrlk9zriacKnUvFUzpick50bAzpOegxYI5rnorwg/640?wx_fmt=png&from=appmsg&watermark=1&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
