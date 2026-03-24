#  记录一次edusrc某证书大学漏洞挖掘  
原创 sakuya
                    sakuya  略懂安全的三秋   2026-03-24 08:23  
  
作者：  
sakuya  
  
原文链接：  
https://xz.aliyun.com/news/91098  
  
## 登录框起手  
  
  
经典登录框开局  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Qzel5kQIPbCN6xeAjjAapeIqnyqEkSviaT5guicpq73oQBGnGGgNXZIGGGlibeYLhELicGdYbAHsZicpM2l3trtQibFjh0iarKSdm2NuotnUARiaqV8/640?wx_fmt=png&from=appmsg "")  
  
有个注册的功能点 我们尝试能否注册账号  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbBxzibDRIiaAddv32icE43jID8OmYIhBBVMDsIUyn63LqRrYOux5IP6UkfCU5aiaVibSYe0CAmzr4F7ibjITht0VAVxpOlIOBLgeTTR4/640?wx_fmt=png&from=appmsg "")  
  
随便写点东西然后成功注册了  
  
  
我这里直接成功注册职工账户了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Qzel5kQIPbAYicAKJiclmPLTVvSZ0ySx0ZYq6wr376Abb3jORUm1e5B7tZ6BNibhU8FlzQo8Bx5ECs8RlTdtfzrbGHS6y8KhYBOGibv4RhAD8F4/640?wx_fmt=png&from=appmsg "")  
  
首页就有许多的功能点可以测试  
  
  
那么我们现在就可以开始一个一个点击并测试是否存在越权操作  
  
  
这里记得开启你的bp 把一个个数据包都记录下来  
## 测试功能点  
  
  
经过好一顿测试 发现绝大部分的功能点都无法使用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbCyzQTTic7hqib69osaECiaE6FWVXVvYmMXjpGPw8sUG1Ig2ibBaaia8U6pJpvEcJqkD9ZeQiawtzeHO8lW4B3qYvFfC9entdOribQD3o/640?wx_fmt=png&from=appmsg "")  
  
所有的管理操作界面 当你点击的时候都会进行一个鉴权操作  
  
  
导致跳转到这个401界面 提醒我们没有权限操作  
  
  
猜测虽然我们成功注册了 但是实际上可能还没有被管理员审核成功 导致虽然有职工账户 但是却没法实际操作  
  
  
到了这里基本可以宣告结束了  
  
  
但是在最后 我们还可以看看具体数据包的情况 比如说在点击什么功能点的时候会不会加载了什么有敏感信息的路由  
  
  
所以我们现在就可以回到刚刚开启的bp界面查看一手历史数据包里有没有什么大货  
  
## 翻看bp历史数据包  
  
  
当我点击一个又一个的历史数据包的时候  
  
  
绝大部分都数据包都是没有什么内容的  
  
  
但是当我打开了一个叫user/all的路由时 发现响应包长度不正常  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbCWnNoluUH0YnOUEH5xSjZ2cgmyfasU3diasW2RdyyKKgcWlPEpzgV45QqDzFI0Wz6Mg6icBaGUe7eJ0icpFJfuQpHq8NtNNjEk8w/640?wx_fmt=png&from=appmsg "")  
  
这个数据包居然没有做鉴权操作 导致全站用户信息泄露  
  
  
当时也是比较吃惊 怎么这个数据包就刚好没鉴权呢  
  
  
总之先不管为什么这个没鉴权  
  
  
我们现在确确实实找到了一个没有鉴权的路由  
  
  
里面刚好有手机号和密码hash  
  
  
手机号就是账号名  
  
  
密码hash可以试着看看能不能被cmd5爆破出来  
## 尝试登录账号  
  
  
回到刚刚的登录框  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbBO7icRRrXILTibFtzAz1pzo4qZ7iaibCOvePHsU6H5vI9ovVwnhkUSQe36XAeIELju2SWjPic33eegwibiajdV5ibWfRJ9uiadicrmzHfNE/640?wx_fmt=png&from=appmsg "")  
  
我们使用刚刚获得到的手机号进行登录  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Qzel5kQIPbD9ZjiaYhibD2jvTbdCIPwibnahMk6NuJNK93QJOXO5cmWsnlSWh30JKhRiaLNFU6xibIzPYhicoaeDYoGyibmFYxyOOGL0hVcmsN5HAM/640?wx_fmt=png&from=appmsg "")  
  
  
当我输入一个弱密码的时候居然直接登进去了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbCt9bjFk1Rrt2CQ3rHWB97uianQAkgeUnWIEMbIHOZe5TSwLDibtUBI9icLl8G3TbexGrzK8jmzIPLtV4TjpD0YUiaLtZBQht6tcnU/640?wx_fmt=png&from=appmsg "")  
  
用户名的部分就写着一个老师的名字  
  
  
我们居然成功登录进去了  
  
  
经过我后面的尝试发现其实这里有这一个巨大的问题  
  
  
站内所有用户的手机号都可以进行登录  
  
  
但是密码其实是"没有"的  
  
  
这里的没有并不是真的没有 因为确实是有密码hash  
  
  
实际上是这个登录框不需要真正的密码就可以登录进去  
  
  
只需要你随便输入几个字符串就都可以登进去 密码形同虚设  
  
  
这种情况也是百年难见 可遇不可求  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbAhS7JPOUQDOhr79j9edStSgAbPpkQ99LtLQlY4c8ySFNA3uc3VMKF9Tzrz3c8UdicnCA4ObceVzjLyYGfbOaeVSF8FdPnQl99U/640?wx_fmt=png&from=appmsg "")  
  
那么现在就可以愉快的测试功能点 来扩大影响范围了  
  
## 测试功能点  
  
  
开始重新测试  
  
  
首先发现是一个管理员用户 可以进行正常后台的一些列操作  
  
  
增删改查用户 泄露用户信息等  
  
  
又找到了几个越权点  
  
  
比如编辑用户信息 同意/拒绝他人审核等接口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Qzel5kQIPbCUUmtKvRvibJtTWcv0mcIaicKkvEoKs3a2ZtH6SnicF0hLUAqJ1nCibRqhXzHz0eV8XafibHFcHOQWGG8yIUicabzAKlBFA5UYNwhnQ/640?wx_fmt=png&from=appmsg "")  
  
只需要修改参数中的user_id的值就可以简单进行越权等操作  
  
  
这些也都是常见的越权点  
  
  
这里就不做过多说明了  
  
  
最后发现其实之前user/all的路由是不需要登录的  
  
  
可以直接未授权访问 导致全站用户信息泄露  
  
  
这个可比没鉴权更严重 这个是什么都没做 直接就可以访问到、  
  
  
提交到edusrc上 也是美美拿下又一个证书站点  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Qzel5kQIPbAfzcth5dollIbn2y0goOtiaP7TcTo2t9AEadde2I12657FZX3EzTojqQH9dxpNtBPegwm6MEwteDiaCuMa7GTFoE4bibknGUMbcQ/640?wx_fmt=png&from=appmsg "")  
## 总结一下  
  
  
首先遇到登录框 可以看看有没有什么登录之外的功能点 比如注册 密码重置什么的 都可以去尝试看看  
  
  
一般如果可以注册的话 应该都可以到站点内部进行测试  
  
  
还有就是一定要时刻查看bp数据包的历史情况  
  
  
没准就会有像是这样的未授权访问 泄露全站用户的情况  
## 叠甲环节  
  
  
文章来自作者日常积累，未经许可严禁转载，转载需联系本人。文中内容仅限学习交流，严禁用于商业及非法用途，涉及网络安全相关未经授权不得测试，违规使用后果自负，与作者和公众号及本文无关 。（都别乱搞哈）  
  
  
  
