#  行之:我的大模型黑盒RCE挖掘之路  
 Hacking黑白红   2026-06-22 12:46  
  
原文首发在：先知社区  
  
  
由作者授权发表：https://xz.aliyun.com/news/92273  
  
  
前言  
> 大模型时代，攻击面不再只是传统的Web漏洞。最近阅读了洺熙师傅的“prompt越狱手册”，对里面的提示词注入手法比较感兴趣。随着时代的发展，现在的LLM已经不仅仅拥有文本对话的能力，外接MCP、Skills、Agent等能够让我们的学习更加高效，但也引入了更大的攻击面。本文记录了我在几个不同AI产品上，从Prompt注入出发，最终拿到RCE、SSRF、数据泄露等漏洞的完整过程。距离去年发布“从白帽角度浅谈SRC业务威胁情报挖掘与实战”也已经有一年的时间了，很长时间没有更新，遂有此文。再次感谢先知社区这个优秀的平台，和各位师傅⼀起分享我在大模型黑盒漏洞挖掘的思路，文笔不好，如有错误敬请指出！  
  
# 一、NPM软件包动态加载触发的云原生 RCE  
### 发现过程  
  
在挖掘大模型漏洞的过程中，我其实更关心的是底层业务逻辑的流转过程，而不是单纯的 Fuzzing。  
  
这里以某大厂推出的 AI 前端智能开发平台（通过提示词一键生成完整的前端项目）为例 。当用户输入 Prompt 要求生成代码后，平台不仅会生成代码，通常还会提供一个实时的预览环境。 大概是这个样子。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49VMDSZOQ9BbZkfzyq1gGhc5nec6ib4ib14TO4PWr5cSaNNlic2DQ7cgQA0krgeEUaYuoQdsGlVdzIO8hWZwnFD8iczSKgXHVYK3Ng/640?wx_fmt=png&from=appmsg "")  
  
  
当智能问答助手创建完毕的时候，在网页的右侧会自动生成代码，采用Websocket传输。这里可以看到生成的代码是jsx格式的，网页右侧会通过 WebSocket 实时推送并生成代码。从回传的数据来看，生成的代码是 JSX 格式的，搜了一下，说的是平台是 React 技术栈来构建前端预览站点的。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48oBsGbldwDBZfVvsTzY8u1wZMIqq1ZTA1aPWBRloJicRKdicibVdtE3xm3bqGPqBbAFVR0FnH6MA3UyGTFWg0g8hWZQsxeNwLPhQ/640?wx_fmt=png&from=appmsg "")  
  
  
  
接下来我们对代码进行审计，可以发现一个很有意思的现象。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icXlVicTfpQUlEWNUdoCClQAG0OvRcousPbEiaGz1eDV2Dh1dAOianexxKnoq24je79bD157OMVVQ1IAG8TYt509Y0WNbd4qdHga0/640?wx_fmt=png&from=appmsg "")  
  
  
在package.json中，此项目会根据用户prompt中的依赖需求，自动从npm仓库拉取对应的npm包。那么接下来我们就要测试在加载依赖请求的时候。模型是否出网？还是在本地的npm仓库中，下载了精简的npm包进行项目构建？因为对nodejs不是很了解，在我的印象里，像python的沙箱环境，一般都会给一些可以用的库，但是比较少。  
  
#### 出网探测  
```
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48sdymOLDyU0BG5kaCyeWa361kib1dkfuiaSfBLNB0HQQq2WuJejmiaVguzmK6YcejvdDk9HqyYBy5skw934GTNib1YwqVficY4M5QY/640?wx_fmt=png&from=appmsg "")  
  
提示词："安装valibot最新版本"  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48l93QGaeQAvibJDvicSibOxvzwgCictT0uQ0Tkiavc2H183AGIxXjHYFNnPKIrNCLtaG1ibS9XcaVGBdrjKkicCvFxvCFl0n6A3RwUWQ/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49cfDh4tTIClUJ0zNpx5Ah0DKd4qRxY2vicUF9LiaBTJP4HZ8ibLyQgRK5HBCic9qB7Rd3rCTqM3q6icZjePYBzJX3YF043KEtaJ8Tw/640?wx_fmt=png&from=appmsg "")  
  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49XCbuPbYB0bMCJxAUT2Iic31EUvaB1PNDanrjO8aHg1WI2GrN2a4iapiaj5ls0iaYwcgj57aE3djI3RqPP7SFeXILsd9RqyKcFf7Q/640?wx_fmt=png&from=appmsg "")  
  
  
这里可以发现模型正常进行了安装，并且在package.json中被加载，这意味着  
**它拥有出网能力，并且会执行npm install。（这里我就不截图具体的了）**  
  
### 攻击路径  
  
**第一步：利用npm中的postinstall生命周期钩子执行系统命令**  
  
如果在 NPM 官方源中，存在一个受我们控制的恶意包，并且我们通过 Prompt 强制 AI 在生成项目时引入这个包，后端的 Node.js 环境是否会去下载并触发里面的恶意代码呢？这里利用的核心机制就是 NPM 的 postinstall 生命周期钩子。当 NPM 安装依赖包时，会自动以系统权限执行 scripts 中定义的系统命令。  
  
在软件开发中，特别是在使用npm或yarn这类包管理工具时，  
<font style="color:rgb(51, 51, 51);">postinstall</font>  
是一个非常有用的生命周期钩子。它允许你在一个npm包或项目安装完成后自动执行某些操作。这对于执行额外的配置、安装额外的依赖、或者运行初始化脚本非常有帮助。  
  
很多 npm 包在安装时需要编译 C++ 扩展、配置本地环境或下载额外的二进制文件（比如   
<font style="color:rgb(51, 51, 51);">esbuild</font>  
、  
<font style="color:rgb(51, 51, 51);">puppeteer</font>  
、  
<font style="color:rgb(51, 51, 51);">node-sass</font>  
 等）。为了实现这些自动化配置，npm 提供了一系列的  
**生命周期脚本（Lifecycle Scripts）**  
，最常用的就是   
<font style="color:rgb(51, 51, 51);">preinstall</font>  
 和   
<font style="color:rgb(51, 51, 51);">postinstall</font>  
```
```  
  
无论谁（开发者、CI/CD 流水线，或者是 AI 后台的构建容器），只要执行了   
npm install  
 下载了这个包，npm 就会在文件写入磁盘后，立刻毫无提示的以当前执行   
npm install  
 用户的系统权限去运行   
node setup.js  
  
**以上用我自己的话来说就是，比如你去买了一个苹果手机，在你拿到苹果手机的时候，自带的一个AppleCare就会自动被执行了，就这意思，是全自动执行的，你付完款自动生效（npm install xx 安装完的一瞬间立马执行）**  
  
这里关于postinstall漏洞的具体原理我觉得可以参考这篇文章，写的不错  
  
《Axios遭供应链投毒攻击》  
  
https://hetian.blog.csdn.net/article/details/159727912  
  
《TrapDoor跨生态供应链攻击深度解析》          
https://blog.csdn.net/weixin_42376192/article/details/161410863  
  
《你安装的 NPM 包，居然偷偷做这种事？》  
  
https://cloud.tencent.com/developer/article/2316137  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibS8ia95IvWI8HNZ0P6A47cxYS2iaYCEYCELeW83IPXqZabMPk7CB8Q3sp6N9eDJJJIsRfODiclB3kNJNIr4rTDrXOcMtUib3bvoC0/640?wx_fmt=png&from=appmsg "")  
  
  
可以发现他们的其核心手法均是滥用了 npm package.json 中的 preinstall 或 postinstall 生命周期钩子。一旦受害者（或流水线）执行 npm install，恶意脚本便会以当前系统权限被静默执行，导致云凭证泄露或 RCE。 顺着这个威胁情报思路，我开始思考：现在的 AI 前端智能开发平台，在后台为用户动态构建和预览 React/Vue 项目时，势必也会执行拉取依赖的动作。如果我能用 Prompt 控制 AI，让它在项目中引入我准备好的恶意 npm 包，是不是也会造成这种攻击  
  
所以接下来我构造了一个恶意的npm包，关于如何构造npm包，这里我是先在本地构造好投毒，再上传到npm官方仓库的  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icdbjfiaczkwst9fXbJU1nw8hUpHJur2QfzuujlPHiaIib71dRVSg3N96uPicyYe71dHzyOOYV0PmnXps4FTYpxff5P683mQKksg0A/640?wx_fmt=png&from=appmsg "")  
  
  
这里我们的postinstall.js就可以写执行命令的内容了  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48AZQxEeU3XaROCZvVia6IUaYmAtVbTmqSK0WaiazALYA5KoibRjzjW3vjWspDLg2iaRJzic8na0vBBf201DCsL0uEs3Eto8OM77k7Y/640?wx_fmt=png&from=appmsg "")  
  
```
```  
  
这里我们在之前需要有一个npm的账户，并且上传恶意的包，来让大模型从后台默认加载一下。具体npm账户和push的教程可以看这一篇文章  
```
```  
  
   （这里的行之哥哥可以自己改），我是随便起的，记得纯英文，不要中文  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icIBZZhPpKE2tXIuwxDnukjtRpcg8rfdMibicsMwtBcRP2j7k38tUcEZQDicK6llRnAjAd2ATnlFjgbdL6FziaTKww8jP7RDNFm408/640?wx_fmt=png&from=appmsg "")  
  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48ibDMxnpMw2WPaicIpSkI9d0QzH9OHVOVicaiayVCHUibiaXZfQTob8lSG3gzibvQBgW3vrtIYAPs9U3FZWZNACEgdKzSpr6kDDZMibrI/640?wx_fmt=png&from=appmsg "")  
  
```
```  
  
  
  
**第二步：通过Prompt触发安装**  
  
在大模型构造的的灵感输入框中输入：  
```
```  
  
此时大模型会忠实执行用户的"需求"，将恶意包加入依赖并install。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibibKhic9sib982DVV2utrYQ423ay6KibvRuo1OeXQwvkTJ10eicrbdqwnrdzG9zC2lJVmJ3UDQnmNZ4ztN90UU4wWBqQibvc7s4LCTs/640?wx_fmt=png&from=appmsg "")  
  
  
  
**第三步：RCE验证**  
  
通过npm包的  
postinstall  
脚本实现命令执行，成功在目标服务器上执行任意命令。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibLlqMztEFXgMkrLXXR3j9BH9UMjvSOmuqw6U8yfdEuxLw5COyDyaZllR0MXxAY5XpDzkXg2Czklt66uf8oJPGpniaq5SRhicTh4/640?wx_fmt=png&from=appmsg "")  
  
```
```  
  
**第四步：云元数据SSRF**  
  
这里有个弊端，就是在postinstall中写命令，如果想多次执行命令，只能把npm数据包去更新个新的版本进行发布。并且引入新的版本再让大模型读取，才可以执行下一条命令。所以这里我生成了几个新的版本。  
  
修改  
package.json  
，利用  
postinstall  
脚本同时探测多个云厂商的元数据服务：  
```
```  
  
每次更新POC都需要重新发布npm版本，并让AI重新加载最新版本。  
```
```  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibibv8es1Dtx5c7QovH9K7wWdoibbrRyHdMH8ialP7hEUicI4VMVQlql6w8IGoHNQ3qKE3NeLp5oUFFkpMMhcAV5CdjB0NAYc3QGV4/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49fSKpz7dVYTtMAlHBGPrnzt8816Z69XtYnicLhQYPibTAibEQY56klI2Y0Pp1jZibibh8kPnwx58Hflk2G1IQ2Nqs4Gpdo1mHicRT5k/640?wx_fmt=png&from=appmsg "")  
  
  
之后再通过1.0.6版本将数据回传即可  
```
```  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49XkAItCYJ7wm6q2HBDNbZmCxN4It2QziakriajuSjPxnTG21poAIqoiblNTm9cPvV3r3fqDqqs5rkB0AvMhsUiaoMBBc8ogmvrqBE/640?wx_fmt=png&from=appmsg "")  
  
  
  
此外，在系统目录中还发现了网络日志文件和log文件，包含其他用户的历史信息。  
  
（假装这里有图，太敏感就不放了）  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48gzm42jcrMG9Xoq8qFHeaG8c1g0lduMOlzmjep7e6RjzYmpq9HIlNibLaaboJWh8Sr3vU8AnxuTQtngQicbVjQianwafJlI1VOLs/640?wx_fmt=png&from=appmsg "")  
  
  
最终拿到机器管理权限，完成RCE  
  
  
**记得交报告快点，没几分钟就被封号了**  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibO2Inb39mHGjsBlkTsyXmLCwsca4YqCkuJ24Qtr2JgXq8EOIErnTYWmS4E8PfAQbuOgodYyMUYdB6Kb2hnvCxRWjdPLoHTIfY/640?wx_fmt=png&from=appmsg "")  
  
  
  
**第五步：我的一些思考**  
  
preinstall  
 vs   
postinstall  
 的区别与利用场景  
  
这两个钩子（Hooks）设计的初衷是为了方便开发者在安装包的特定阶段执行环境检查、编译原生依赖或清理临时文件。但在投毒者眼中，它们是绝佳的代码执行通道。  
  
preinstall  
（安装前执行）：  
  
触发时机： 在包被下载并解压后，但在它的任何依赖被解析和安装之前执行。  
  
攻击视角的价值： 这是黑客能拿到的最早的执行时机。投毒者通常喜欢使用   
preinstall  
，因为此时安装过程才刚刚开始，即使用户在安装中途发现异常并   
Ctrl+C  
 强行终止，  
preinstall  
 中的恶意脚本（如窃取环境变量、SSH 密钥、上传挖矿木马）极可能已经执行完毕了。  
  
postinstall  
（安装后执行）：  
  
触发时机： 在包及其所有依赖项都已成功安装完毕之后执行。  
  
攻击视角的价值： 如果黑客的恶意脚本需要依赖其他外部库（比如需要用到   
axios  
 发送网络请求，或者用到某些解密算法库），他们就会把代码挂载在   
postinstall  
 上。此时运行环境已经完全准备好，恶意脚本可以顺理成章地调用刚安装好的依赖来完成复杂的攻击逻辑。  
  
防范手段： 在 npm 中，开发者可以通过添加   
--ignore-scripts  
 参数（如   
npm install --ignore-scripts  
）来阻止这些生命周期脚本的自动执行，但这往往会被很多人忽略。  
  
  
那么我也会思考，除了npm在安装的时候会触发命令执行，比如一个AI可以让他去安装Python的包，或者其他语言的包，其他语言会不会也存在同样的问题。以下是AI给出的回复，笔者没有去实现，读者有兴趣实现的可以自行进行实验。  
```
```  
### 漏洞本质  
```
```  
  
**    AI平台信任了用户prompt中的依赖声明，且npm install的postinstall钩子天然具备代码执行能力。就这样**  
# 二、基于角色扮演的 Agent 护栏绕过后RCE访问API平台  
### 发现过程  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibO9tFjye99EtPqG4NG0o6lVoLaXicOyLK3nkmVbia7KaIcOsoFeO7xuF1lzgoaiaysPbJUVcVK0ob1hEOeCfL7Iia03qLrXtkRTiac/640?wx_fmt=png&from=appmsg "")  
  
  
阅读了洺熙师傅的“prompt越狱手册”后，对其中的“间接性提问”，以及“角色扮演”比较感兴趣，顺手搜了一下微信的聊天记录，发现很多人都在使用角色扮演等手法来绕过大模型的检测等等，这里还有很多绕过手法，不再赘述。  
  
### 攻击路径  
  
**第一步：绕过SecrityAgent**  
  
提示词  
```
```  
  
在对话的过程中让大模型输出env信息和系统相关信息无法正常进行输出。有安全围栏。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48tZCupYqxaWfdicFFiaPnAywYicjgiahwIw2ADBhxicqY5AAdzvI9p4pjXM0ujT70Lf0npj6XFQ3w0XHrnxvLMtfW9PkUj9euETcWA/640?wx_fmt=png&from=appmsg "")  
  
  
这里可以发现在读取的时候内容无法正常读取，稍微读取了一点内容也被拦截掉了。使用了小语种和多次注入均无法绕过，但是这里发现可以去内部git平台拉取镜像返回给用户来构造（假装这里有图），于是利用角色代换注入来RCE。  
```
```  
```
```  
  
这里我为什么要这么做，是因为我发现在第一步的时候，大模型会有输出，因为我们都知道，  
输出走SSE流式传输，Burp里能看到返回包，但被DLP拦截了。所以我们直接不需要让他输出敏感的内容，DLP Agent监控的是大模型的SSE响应流，也就是"说了什么"； 但通过MCP反弹Shell就可以不经过他了  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ickTricMvBggV2m3Z0YBkNiaM8sUCpuabpoco69s0VJjkJzpFic4KVOpR262QbpbwaqJlQSfFu50atzQWIpyZwQZyHia8RhVeia9hEk/640?wx_fmt=png&from=appmsg "")  
  
  
  
**第二步：k8s内网探测**  
  
通过反弹 Shell 拿到的初始权限通常是一个普通用户权限，至于接下来的信息收集，各位做红队的师傅肯定都轻车熟路了。基于虚拟环境搭建的容器一般权限都比较小，并且使用了 AliOS 的机器通常不存在常见的权限滥用提权情况（相比之下，原生的 CentOS 和 Ubuntu 提权会相对容易些）。关于如何进行容器逃逸和深度提权，我将在第四个案例中详细讲到，此处先不多赘述。  
  
当前 K8s 集群存在严格的网络隔离限制，常规的云原生元数据（Metadata）地址均无法直接访问，但是，通过读取当前容器环境的   
env  
 环境变量，和openclaw的配置文件，可以获取到内部配置的地址信息。这里比如内部的中转站平台。  
  
之前信息收集发现部分内网资产在外网是可以 Ping 通的，做了 ACL限制。既然已经在容器内打下据点，这里直接代入 Socks 代理连接即可穿透内网。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49Uria8oLW77qfGsMfOsEG58SbVq2ppquHFAyshOzFfWWKW4V2Y9icbuoXiaPwDiax5bp8ibkNxaQJLpuFXQckyOy1p81VZgDk1ZABQ/640?wx_fmt=png&from=appmsg "")  
  
  
挂代理后通内网，找到中转站地址，这里发现可以集团内部员工使用的models等等  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ib6WutLVyVHEDj9tANBaibUj9JAeJIuwPuqFtMmNXm3Y3pBorPl4YVfEXhhhwXrzyuL8C7UVGVGD1UrchCD4FxEbc3IUrd8bOzc/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibu52lJt83FOp4De5Fz7w4xUpBRSlNsGebLwWickYuntL8TVDqHaXvIRlqs2UDoMfZ0NzkztOkpRiaiazcRybRmsTpL3osJhaqiamc/640?wx_fmt=png&from=appmsg "")  
  
  
直接使用自写的弱口令爆破一波拿下，记得用精确一些的字典  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibpc9PLEH9mmMTp1RutCYibBWN4fibMP8k4iaIoU5y5zFJiakA22W5xkxY0AicFDDgpTC9fBqFLuib0vvDbp6zHIiavgugrS1ow0ng2Qk/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icMbLQUlRYt6xgUKSIzmsQLrBuyGiaTEGqeQyBouibY8NybiaoGwFYkFdKWpO6GxZyxE4oVFENI2gGj4tBwJn2CcjN7EKb8kYFdibQ/640?wx_fmt=png&from=appmsg "")  
  
  
控制所有sk-api  
  
  
  
**第三步：admin权限滥用删除安全组件**  
  
这里也可以通过反代的方式，免费用模型，但是比较麻烦，这里我们为了方便，直接利用Linux中的admin权限，对skills和agent进行删除，发现存在admin权限滥用的问题。此时再进行对话即可不受到任何限制  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibWnib93NMXMnccglTcMiaria5kvNiaYDA73t1ic5CV0E0tdM5icGokjiakZd7UBkp0Wcwn7NsYuyJZsqGhUr2owK4XxX23x4RIod2PoU/640?wx_fmt=png&from=appmsg "")  
  
  
别学哥们，很容易出事的。。。。这里拿了授权的  
  
  
同一，记得交报告快点，不然就会被封号  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibJf1IDg8tVRGjYicPLibtrbtciakrZo7zwSy958xH4qJNBOkCLo8zAbrocekLqsYpG9xx2FBAYficxcT2woNd6faB0DRJCdpBFt3I/640?wx_fmt=png&from=appmsg "")  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49iaWicYVDKTXnkJIibpUtvr8FWQK6Zxe1VkOTEqIcQbB4OSib0BFb4wPfibzOXpaC0UHMoqjcu0wXKNN3lwFhzd77sZq1u0nLoOjoo/640?wx_fmt=png&from=appmsg "")  
  
### 漏洞本质  
```
```  
# 三、基于不同模型安全能力差异造成的AKSK接管及容器逃逸  
### 发现过程  
  
在某家SRC的产品中发现可以和很多大模型进行对话，但是很多大模型在我们进行prompt注入进行敏感操作的时候会进行防护拦截  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icNVu3N8ILWbeN7Bf08eCuq4C9R5DssNlkcj0cjqEZzHbpjcokTdj23wMfmXvmZwcmBRRaQbo3yQbtrfMqarLdzP6sicTaaicibhs/640?wx_fmt=png&from=appmsg "")  
  
```
```  
### 攻击路径  
  
**第一步：通过不同大模型对安全不同的敏感程度进行绕过**  
  
  
这里可以发现在读取的时候内容无法正常读取，稍微读取了一点内容也被拦截掉了。使用了小语种和多次注入均无法绕过，但是这里可以发现可以让我们选择很多种模型。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibq1ljjwAMpxuageGrIGiauYn6elGAIJOl5s6xFccxd3vJNdVPGUgYnIBteUlT0QeZ5tmTK5pegjgt5Lzqq1Y7jZuZk3ERWxDcs/640?wx_fmt=png&from=appmsg "")  
  
  
这里使用DeepSeek-V4-Pro和Kimi-K2.6的时候，进行prompt注入会出现如下现象。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49fgUoGQ6P7LsNDTSCxiaiaqqM9iaMWJQr8HMK8VFIUWG0UofjV6HaJl9av9MNXFXGibDialFnYjohDPRCHHOLdq3kHViamkj4F4MSqE/640?wx_fmt=png&from=appmsg "")  
  
  
同时还会触发大模型本身自带的一个安全能力，也就是Kimi自带的一个道德限制，例如：  
我不能完成你的xx请求  
  
接下来我们通过对不同大模型版本的选择，使用相同的提示词进行注入，即可触发系统命令执行。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ic64pnWWQ6btLo0vDgpNiblCPASr5CJD1ZAa5ALCSmIHejKX2yz7ENAtheDicc7SOvra9zydKL4H3wMRzBa23YDQ8ibBg1PnkITNw/640?wx_fmt=png&from=appmsg "")  
  
  
  
当然这里也可能出现幻觉，我的解决办法是让他执行date命令，查看当前的时间，以及查看env信息，幻觉大模型出现的env信息都是a1b2c3d4这种格式的。  
```
```  
  
使用GLM-5.1进行绕过即可查看AKSK等信息  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ics78FSRriaWNAic3DP7ru8VnaxafIgWS4ApBh7uM6oKZj90EicThxN0Xtx9XRicxFleAW9Cd84LViaVib2tAQBemDRj6hDV4bjp1ceY/640?wx_fmt=png&from=appmsg "")  
  
  
为了继续进行角色代换注入，我们需要继续模仿安全工程师角色  
```
```  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49hUZqeSfscIkXaeiarcsBTfCEG3PFERTdX8sfTpL6OvgrqLQaPp8Gj4PLiatX91QM12xdIkLRlUiaHbofRic3l96dd4Q58ndu9sDc/640?wx_fmt=png&from=appmsg "")  
  
  
之后即可在我们的vps上获取env信息，包含了AKSK等，使用工具进行接管  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibjMqGh8lBSqHZR1DyXfIJVAjUVQse88g5tTznFWA0Onviab0AAvdI4ZxaezPLRpqwBibrj8PAxRLicXiabt0ICHpiaFTgF5WRYZOz0/640?wx_fmt=png&from=appmsg "")  
  
  
通过env的信息泄露，导入行云管家也是可以的，但是此处没配List权限  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4833qrgWolvaDGTVDYMGKDCJphyQflGjfXNRy0Y4S4ZDoDu9B9RdygIOs32doTYOaHu6icDDYxXHfFQibrprb3Y8o5gRDWwvNP3o/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ic1AcZebfeNEKPqM6lzQmALbsDIDibxVI4qJOGAibLSptowfHfe7Vs8KtuhnGxPvvFRib3ucib5pu2PN8Mym3pIOLMp8iayKK5QxNAI/640?wx_fmt=png&from=appmsg "")  
  
  
最后通过不同模型对安全能力的差异性拿到高危  
  
  
**第二步：通过让AI自己打自己实现容器逃逸**  
  
既然容器可以允许大模型来执行系统命令，在之前的信息中我们通过信息收集已经知道了是跑在容器内的，  
所以接下来可以利用让AI自己打自己来实现K8S逃逸  
。  
  
依旧朴实无华的PUA  
```
```  
  
这里推荐一款容器逃逸安全检查工具，是活动仔教我的  
  
https://github.com/cdk-team/CDK  
  
官方Wiki地址：  
  
https://github.com/cdk-team/CDK/wiki/CDK-Home-CN  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48AziaMgTR2G0mIzFvIP0FVD16ibzlHUvq1RjL5rz2LH8PARaghic1p4OwIdP5LLj5HHkyvAPlE0MTGb3wNqm7w7GgrQlN3rXTINE/640?wx_fmt=png&from=appmsg "")  
  
  
当然了，前面我们已经讲到大模型本身是有幻觉的，所以我们一定要让他逃逸成功了再说  
```
```  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48aqd0ficnWgsPMicnrkcTFRY2LHG0TERCIfXpDVuVoNw7MWtJlVrfAlcZvlYuMPicW3EnMUiczbRcQibia8iaANYnnMqHHLLhvbfhqLM/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icKNKVMILYIJtlIEv2cjdSciczNjNdH8iaclOcHoTEajahcD4Po4qTV1TL0ibKrM9EK8xJ2tsuN2F9Y4HaHnbnzBDMOkUQAQ5Qq0U/640?wx_fmt=png&from=appmsg "")  
  
  
之后也是成功进行容器逃逸，但是pod下无其他机器，所以给驳回了，但是问题不大，思路是正确的，以往我们去做渗透测试通过会把执行的结果给到AI，然后又AI进行调教，但是其实完全可以在Console里面安装Agent去全自动打，可能也是未来的一个发展趋势吧。  
### 漏洞本质  
```
```  
  
##   
# 四、基于MCP无安全防护能力造成的越权隐私泄露  
  
在某业务中，通过抓取SSE返回包可以发现调用了语雀MCP，那么通过以下思路即可基于MCP造成隐私泄露。  
```
```  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icBXTJYDThha2W2WO9XicZgjww6S5963SHDoSEib0S2YjEvDjSpAZ6cQHFRUibrhjCzYyQgFnbpO5F5MFo1H69dicWsf75BSBch648/640?wx_fmt=png&from=appmsg "")  
  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48OEtVhyyDOibLXD9cdYibUIOKFpKqMBj4HHVSxiaI1rUEHt4CY6EXS9bc86W8Ck0L7CiapicTWQPBYaEttKaJhibjjUh4ZCIXsvAJHo/640?wx_fmt=png&from=appmsg "")  
  
  
当然这里模型也有可能出现幻觉，因此也可以让大模型给我们生成一个oss地址，我们直接去oss上面进行下载。  
  
<!-- 这是一张图片，ocr 内容为： -->  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48e7mBibc2lN3GRdHcbBCcyWCSXL4y2Fiaic7Xtbzic9STwDeqO327QcqGibCXTenniaMibw0ibW3WmQTqAT6r5icia9Eg02chlYsklTkFjY/640?wx_fmt=png&from=appmsg "")  
  
  
最后也是拿到高危  
  
# 总结  
  
本文记录了四个大模型黑盒漏洞挖掘案例，攻击入口分别来自动态依赖加载、Agent 工具调用、以及多模型安全能力差异，但最终都指向同一个核心问题：当 AI 平台开始具备代码执行、文件读写、网络访问、环境感知和云资源调用能力后，Prompt 就不再只是普通文本输入，而可能成为驱动底层执行环境的控制指令。  
  
从传统 Web 安全视角看，这类问题可能表现为 RCE、SSRF、AK/SK 泄露、内网访问、容器逃逸等具体漏洞；但从 AI Agent 安全视角看，其本质是平台没有为模型能力、工具权限、运行环境和敏感数据之间建立清晰边界。模型的拒答能力不应成为唯一安全防线，尤其在多模型接入场景下，只要存在一个安全能力较弱的模型，整体系统就可能被最弱环节突破。  
  
AI 平台的安全建设不能只停留在内容审核和 Prompt 拦截层面，更需要在底层执行环境中落实最小权限、沙箱隔离、出网控制、凭据隔离、工具调用审批、依赖安装限制和完整审计。只有把“模型能说什么”和“系统能做什么”彻底解耦，才能避免 Prompt 注入从对话风险演变成真实的云原生安全事件。  
  
最后，本文所有案例均基于授权测试环境完成，相关细节已做脱敏处理。希望这些复盘能为 AI Agent、MCP、代码生成平台和智能运维系统的安全建设提供一些参考。  
# 致谢  
  
感谢洺熙师傅等前辈公开分享的优秀文章，让我对 Prompt 注入和大模型安全有了最初的系统性认识。特别感谢 V_ghost 师傅在日常交流中持续给到的思路启发和经验分享，很多关于 AI Agent 攻击面、黑盒测试方法和漏洞本质归纳的思考，都受到了他的影响。  
  
同时感谢 Clown、活动仔、我来躺等师傅在真实案例复盘和日常交流中提供的启发与案例支撑，也感谢先知社区提供这样一个开放的技术交流平台。  
  
文章难免有理解不到位的地方，欢迎各位师傅交流指正。  
  
