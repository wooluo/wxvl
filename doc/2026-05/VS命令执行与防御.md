#  VS命令执行与防御  
 白帽子   2026-05-20 00:44  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/DuibU3GqmxVmRsdItbBVRKegNHicHQvAHDdZsGpLVU7touSU1AU1twHTfRjG3Vu5aUh0RnPPllfVUhs4qdWF5QYQ/640?wx_fmt=png "")  
  
声明：Tide安全团队原创文章，转载请声明出处！文中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途给予盈利等目的，否则后果自行承担！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/9zYJrD2VibHmqgf4y9Bqh9nDynW5fHvgbgkSGAfRboFPuCGjVoC3qMl6wlFucsx3Y3jt4gibQgZ6LxpoozE0Tdow/640?wx_fmt=png "")  
  
  
## 0x01 背景  
  
最近在网上冲浪时发现曾哥团队推送了这样一则消息：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jS2mB7OlsdUREwZwfM5CUEABiavUfScWOqp2QKceoNYdIWZDe4glPpgkjv5599uetP4Gf5C02zPVk7zicakiaOKzsfSeqLl0Jsiav2VUH4iaPhDY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jS2mB7OlsdVAIcSIRWrZ6u6pXauDXk0aS0aW2iaNhLScW42ibobfvP0Vib6AdP8a4gp7m95SJJ1YzbUgoGSPfZdD0BWuY9iaP1U6n88Y5zKGHtE/640?wx_fmt=png&from=appmsg "")  
  
使用VS项目进行钓鱼，一番搜索发现去年10月存在同样的APT投毒项目，海莲花组织注册Github账号Jiefeng伪装为国内安全研究员，发布项目Cobalt Strike最新提权插件源码吸引受害者编译。并利用.suo文件反序列化漏洞触发恶意代码执行。  
  
关于VS钓鱼为什么越来越猖獗，有以下几个原因  
1. 微软并不认为.suo反序列化等问题是漏洞，所以不会修复  
  
1. VS项目多处可以命令执行  
  
1. 使用VS项目进行命令执行本身具备免杀效果  
  
本文从命令执行与防御两个角度展开，学习红队大佬受害记  
针对安全从业者的攻与防。  
## 0x02 命令执行  
  
根据利用难度，我分为需要编译和1click两个模块  
### 需要编译  
  
以c++项目为例，对应项目文件为.vcxproj  
，其他语言的项目配置如.vbproj  
、.csproj  
没有做相关实验，感兴趣的读者可以自行尝试~  
> .vcxproj  
  
- 方式1  
  
新建一个c++项目，打开项目名.vcxproj文件，添加以下代码  
```
<ItemDefinitionGroup>    <PostBuildEvent>      <Command>calc</Command>    </PostBuildEvent>  </ItemDefinitionGroup>
```  
  
编译vs项目执行  
- 方式2  
  
同上.vcxproj文件中加入  
```
<Target Name="GetFrameworkPaths">    <Exec Command="notepad" />  </Target>
```  
  
编译执行  
> 项目配置命令执行  
  
  
解决方案管理器右键项目名称-属性-如图所示位置  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jS2mB7OlsdXIkSkFJm0icW8NbkPK7f4zBe6cXq6UIOuT2Fg8VBjz5896EWTiaGQxhw7VDA2tZpoDDAFA2UvTAiaRVKZxvJVvuykoMvnia1rqvxQ/640?wx_fmt=png&from=appmsg "")  
  
以下三个事件都可用于命令执行  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jS2mB7OlsdU0P463a7qTFpib6rKDzllv7dmb7tPbEHLl2A2KU73CB2trNmiaicCqnU3ImOia5fJibvp53SfD8bicicjs2lhFk3DtDUbjU625Y3Mb0U/640?wx_fmt=png&from=appmsg "")  
  
需要在输出处输入内容  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jS2mB7OlsdXtQ9WlgpI7EWMSUHSFhYXLOQpX9ic2WkCno7hCgsgUFYhPpxSPr0zKl7X84vOdnAISJ9mXxJSbBWRxojvGVQBjy8Afg4k0ww5Y/640?wx_fmt=png&from=appmsg "")  
  
以上方式在编译后均可执行代码，添加这些编译属性后，vs会在项目名.vcxproj自动生成代码，由此可以看出，在背景中提到的Anydesk投毒正是在这里进行利用，需要编译恶意载荷才会运行。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/jS2mB7OlsdWrz8ibKuaVuiboCshjZ2Rwepia85VM4pLWPAXzD8Pk2Rd9yccZYj1kb42fNgjvkch3Ho2PsGjTVB6VveLAQbY7M8W2DoAmYqe3B8/640?wx_fmt=jpeg&from=appmsg "")  
### 1click  
> .suo文件利用  
  
  
项目推荐（用于生成恶意.suo文件）：  
- .suo文件反序列化漏洞利用工具: https://github.com/Brassinolide/VS_Deserialize_Exploit  
  
- .net安全矩阵知识星球 Sharp4suopoc.exe  
  
利用流程  
  
1.新建项目，以c++项目为例，打开视图->工具箱，搜索栏搜索类视图（其他窗口可能可以，没有做尝试）、属性，将三者钉在主页  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jS2mB7OlsdWWykK021mIEuvr7yPvCA6vdkYPwSOuAnmlmlyx6o85DBAevic1k8IWKuiadjdFibf7GUU1qWub3kHSTf4RfWj1kAcXGialA6PsBUM/640?wx_fmt=png&from=appmsg "")  
  
鼠标点击类视图，然后关闭项目。（聚焦此处）  
  
简单说一下以上做法的原因：  
- 打开视图工具箱：确保项目加载vstoolboxservice类，反序列化调用链触发点在此  
  
- 点击类视图触发窗口聚焦：在 @crackme.net 大佬的帮助下，了解到一条在窗口聚焦功能的漏洞触发链。  
  
2.ysoserial.exe生成反序列化载荷  
```
ysoserial -g ClaimsIdentity -f BinaryFormatter -c calc -o base64 -bgc TypeConfuseDelegate
```  
  
3.使用工具生成恶意.suo（以VS_Deserialize_Exploit工具为例）  
```
>VS_Deserialize_Exploit.exe输入suo文件路径路径\.suo输入payloadysoserial生成的数据成功，文件已保存到 evil.suo
```  
  
替换项目下的.suo文件即可（.suo文件一般在项目根目录/.vs/项目名/v16或v17/  
路径下），替换后打开项目，无需编译恶意代码即执行。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jS2mB7OlsdXMul7IY4aTgbLIicibeE3gyZUNFfOoKj6tSyye6bwSDtl2hbgzjNrwA68VvBiaV5NibAYTKBHRuriatz7ZpfYk5ibhJdVQibtQcSCpHI/640?wx_fmt=png&from=appmsg "")  
  
.suo文件优势在于隐蔽性高（.文件开头），无明显攻击语句（反序列化数据），使用一次后即销毁。  
> 利用类型库进行1click攻击  
  
  
需要的大牛可以看看链接：https://xz.aliyun.com/news/13871#:~:text=%E5%AE%83%E6%89%8D%E8%A7%A6%E5%8F%91%EF%BC%9F-,0X09%20%E6%9F%A5%E7%9C%8B%E4%BB%A3%E7%A0%81%E6%97%B6%E5%8A%A0%E8%BD%BD%E6%81%B6%E6%84%8F%E7%B1%BB%E5%9E%8B%E5%BA%93,-%E9%A6%96%E5%85%88%EF%BC%8C%E9%9C%80%E8%A6%81%E6%98%8E%E7%99%BD  
## 0x03 防御  
- 不打开来源不可信的项目文件  
  
- 运行项目前检查.vcxproj/.vbproj/.csproj  
等文件是否存在命令执行、加载未知资源的恶意代码  
  
- 打开项目前删除.vs  
文件目录  
  
- 使用工具 https://github.com/backengineering/CheckEvilSln 检查项目  
  
## 0x04 参考链接  
  
https://crackme.net/articles/evil_sln/   
  
https://mp.weixin.qq.com/s/x4QNvGNk4QXByh3Wb4qk6A   
  
https://xz.aliyun.com/news/13871   
  
https://www.secrss.com/articles/74468   
  
https://www.ch35tnut.com/zh-cn/research/apt/ocean_lotus/suo/   
  
https://mp.weixin.qq.com/s/x4QNvGNk4QXByh3Wb4qk6A  
  
  
往期推荐  
  
[TscanPlus-一款红队自动化工具](https://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247516589&idx=1&sn=107da3b45e88255f240504d033ebde7f&scene=21#wechat_redirect)  
  
  
[潮影在线免杀平台上线了](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247499902&idx=1&sn=59cba8d980b4ecb0deefff99edaabd4d&chksm=ce5de21ff92a6b09a8972a0144557b0099e443aa8e018b17151c816fc7f08f3615ecb22617fc&scene=21#wechat_redirect)  
  
  
[自动化渗透测试工具开发实践](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498466&idx=1&sn=085c15679436dedb06a179ca8d47951a&chksm=ce5dd883f92a5195ef74ac517741f6d3da0da40b5501d72016e52cb70344904bb85b8aef65ba&scene=21#wechat_redirect)  
  
  
[【红蓝对抗】利用CS进行内网横向](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247492640&idx=1&sn=43b1991dc5628eab322923083fde8d70&chksm=ce5dc641f92a4f57ffb18e2977644b1f977fcc5e0eccdf10956d3ae4ce70dc95024500631e89&scene=21#wechat_redirect)  
  
  
[一个Go版(更强大)的TideFinger](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498344&idx=1&sn=3679330363ff6890166b09f6a502f769&chksm=ce5dd809f92a511f6066fcbb12fb5c1dc8c2642e4e2690dad64d76cc6f9247eae356d16f5810&scene=21#wechat_redirect)  
  
  
[SRC资产导航监测平台Tsrc上线了](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247499823&idx=1&sn=065ffeae6bd02fff922cfb12c5a0f4df&chksm=ce5de24ef92a6b58f709260b691e6b36e4a53aac00d3022946302b8e638696ed55c70e13e16f&scene=21#wechat_redirect)  
  
  
[新潮信息-Tide安全团队2022年度总结](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247506056&idx=1&sn=ad6dd23f58f5fd8ce899a1e292f5b685&chksm=ce5dfae9f92a73ff4f14c812436cb5bfecb29db04eada11c409e946d5338c82a92bcaa425736&scene=21#wechat_redirect)  
  
  
[记一次实战攻防(打点-Edr-内网-横向-Vcenter)](http://mp.weixin.qq.com/s?__biz=Mzg2NTA4OTI5NA==&mid=2247498965&idx=1&sn=655548831da6808a020ad07294a92e60&chksm=ce5ddeb4f92a57a283d5692c246e54655319ab0d09f6403e354300a2777cda6ae4c787631ab3&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/rTicZ9Hibb6RWbGNtVfIZbm2rmGO4hQDzQUrLN62vEGlA4fPmib5utUAp9gbQicb6FC82RjsVI5vx7wEc9yAAiaFEoQ/640?wx_fmt=gif "")  
  
E  
  
  
  
  
N  
  
  
  
  
D  
  
  
  
**Tide团队产品及服务**  
  
**团队自研平台**  
：潮汐在线指纹识别平台 | 潮听漏洞情报平台 | 潮巡资产管理与威胁监测平台 | 潮汐网络空间资产测绘 | 潮声漏洞检测平台 | 在线免杀平台 | CTF练习平台 | 物联网固件检测平台 | SRC资产监控平台  | ......  
  
  
**技术分享方向**  
:Web安全 | 红蓝对抗 | 移动安全 | 应急响应 | 工控安全 | 物联网安全 | 密码学 | 人工智能 | ctf 等方面的沟通及分享  
  
  
**团队知识wiki**  
：红蓝对抗 | 漏洞武器库 | 远控免杀 | 移动安全 | 物联网安全 | 代码审计 | CTF | 工控安全 | 应急响应 | 人工智能 | 密码学 | CobaltStrike | 安全测试用例 | ......  
  
  
**团队网盘资料**  
：安全法律法规 | 安全认证资料 | 代码审计 | 渗透安全工具 | 工控安全工具 | 移动安全工具 | 物联网安全 | 其它安全文库合辑  | ......  
  
  
