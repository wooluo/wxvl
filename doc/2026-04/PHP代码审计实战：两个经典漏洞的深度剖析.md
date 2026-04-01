#  PHP代码审计实战：两个经典漏洞的深度剖析  
原创 油漆工
                    油漆工  C4安全   2026-04-01 07:14  
  
在PHP代码审计的学习路径中，Session反序列化和create_  
function漏洞是两个经典且高频出现的考点。今天我们通过两道实战题目，深入剖析这两个漏洞的原理与利用方式。  
  
一、Session反序列化漏洞：当"会话"成为攻击入口  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNBD4JLI8GngshBxNv0Xtr0n06tegL93o6ricJISDlzicy3BkzjE5hL26nP3vVZVSiae8acyScXInjFUibznECibXefJXiaTmek15AK8/640?from=appmsg "")  
![]( "")  
  
场景还原  
  
题目功能非常简单：  
- 接收   
content  
（文件内容）和   
name  
（文件名）两个参数  
  
- 将文件存储到   
/tmp  
 文件夹  
  
- 每次访问时，对比服务器存储的Session与访问者Session  
  
- 关键点  
：如果Session存在，就能获得flag权限  
  
知识储备：PHP Session存储机制  
  
在利用漏洞之前，我们需要理解PHP Session的存储方式：  
  
存储位置  
：  
/tmp  
 文件夹  
  
文件命名规则  
：  
sess_<sessionid>  
（例如：  
sess_abc123  
）  
  
文件内容格式  
：  
键名|序列化后的结果  
  
举个栗子：  
  
```
name|s:6:"spoock"
```  
  
  
这意味着Session中有一个名为   
name  
 的变量，值为   
spoock  
，长度为6。  
  
漏洞利用思路  
  
题目在处理Session时，会将   
content  
 参数拼接到默认字符串中。这里的关键在于：  
  
🔸  
利用   
|N  
 （null的序列化表示）分隔键名与内容  
  
通过精心构造payload，我们可以注入恶意的Session内容，从而绕过验证逻辑，获得flag访问权限。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNfZvrJo3uwXVOJSTGh3pRKwJwPDWFkVEg5C1P0qP6slo4oOUqwcSES8nyAfv2ozZmgLvR4cLWwSqAibQfRQ8jTk2uFImGRRNZ8/640?from=appmsg "")  
![]( "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CNqeuia4UB2DqR2TgI0US0fnQZy3DbsSvCkuvrxxalOMrAZ2pibSDvCa1YoGyjtIOFu43s7MqCJPvdegVDwNXxRMROic6KvUvF3K4/640?from=appmsg "")  
![]( "")  
  
二、create_  
function漏洞：动态函数的"双刃剑"  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CMtnW86szJ61MmekV3s49IvdjqMqCy2ia5vPXydiaahibEgjDhVPXicKNiaSMlc939ILzrTev8z7uAxmibXsk3DeMxGNRZCIXRB1f0J4/640?from=appmsg "")  
![]( "")  
  
场景还原  
  
题目的参数要求：  
- POST方式传入   
key  
 值  
  
- 同时需要   
act  
 和   
arg  
 参数  
  
- act  
 参数只做首尾匹配，  
过滤不严格  
  
知识储备：两个关键函数  
  
1. extract() 函数  
  
这个函数可以将POST变量导入到当前符号表中，存在  
变量覆盖风险  
。  
  
```
extract($_POST);
// 如果POST中传入 act=xxx，就会覆盖原有的 $act 变量
```  
  
  
2. create_  
function() 函数  
  
函数原型：  
  
```
create_function(string $args, string $code)
```  
  
  
它相当于动态创建一个函数，比如：  
  
```
create_function('$name', 'echo $name;')
// 等价于：
function name($name) { echo $name; }
```  
  
  
🔸  
重要提示  
：这个函数在PHP高版本中已经被废弃，但在老版本环境中仍然常见。  
  
漏洞利用思路  
  
题目中存在   
$act($arg, '')  
 这样的调用形式。  
  
结合   
extract()  
 的变量覆盖，我们可以：  
1. 将   
$act  
 变量覆盖为   
create_function  
  
1. 在   
$arg  
 参数中注入恶意代码  
  
1. 通过闭合   
$code  
 参数执行任意命令  
  
举个payload示例：  
  
```
act=create_function&arg=echo "hello";//...
```  
  
  
通过构造这样的payload，就能实现任意代码执行。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9COM8bMiaL45pHdbb9CSiarIwowS3rnHAQz6H2xDoWFbibmPZTyB1mZNlwLqkxvfmklt3hPBbsT5oPj66ST0zyEywfbLvyzF2oUHqU/640?from=appmsg "")  
![]( "")  
  
三、补充：题3的启示  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CP7KzH0ibH4YAgibmWFftC0OKu7IxtqT043IWrGAhh63puTtC9Rkib7h6oMjFYXUZTuyQjxtw2DIgNibA7HHgBwVzicePM9V4IjjNSI/640?from=appmsg "")  
![]( "")  
  
第三题的过滤较为宽松，  
管道符未过滤干净  
，可以直接利用。  
  
这提醒我们：在审计过程中，要特别关注过滤逻辑的完整性，常见的过滤绕过包括：  
- 大小写混用  
  
- 双写绕过  
  
- 编码绕过  
  
- 利用未被过滤的特殊字符  
  
四、总结与思考  
  
通过这两道题目，我们可以总结出PHP代码审计的几个关键点：  
  
✅  
1. 理解底层机制  
：Session存储、变量作用域等基础知识的掌握至关重要  
  
1. 关注危险函数  
：  
extract()  
、  
create_function()  
、  
eval()  
 等函数都是审计重点  
  
1. 过滤的完整性  
：不完整的过滤往往比不过滤更危险（给人已修复的错觉）  
  
1. 版本差异性  
：不同PHP版本的函数行为可能有差异，要关注版本特性  
  
  
  
扩展阅读  
  
如果你对这两个漏洞还想深入了解，建议阅读：  
- PHP官方手册关于Session处理的说明  
  
- PHP序列化与反序列化的完整机制  
  
- create_  
function的源码实现与安全问题  
  
感兴趣的师傅可以公众号私聊我进团队交流群，  
咨询问题，hvv简历投递，nisp和cisp考证都可以联系我  
  
  
内部src培训视频，内部知识圈，可私聊领取优惠券，加入链接：  
https://wiki.freebuf.com/societyDetail?society_id=184  
  
安全渗透感知大家族  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/niasx7fyic9CP0wIibs2ibfQD5riazRwMCepEoKtvAQ6HEaUgrB76ia3bibBuHtLLOTnZ08y865IyW0DWzo8ic646YHQxrxJicR8qzvuyCr0fUAIyP5U/640?from=appmsg "")  
![]( "")  
  
（新人优惠券折扣  
20.0  
￥  
，扫码即可领取更多优惠）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/niasx7fyic9CP2Z3K2C3jZC28q2oqxLxjJr1XpibkBSdic9bicSShp9ibdrkxmHuxIiaY5qXvyEkR4pnxGOK0WAhWnp2qrAHksGadPu9gCSf3NVO9k/640?from=appmsg "")  
![]( "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/niasx7fyic9CMofZfVo9iagVgohp7JF6WFVWaiaNoO9eTQiawYj47rxRiaibA2NWYfFHJheibpTaCRGdUha7f21UnFSPKCtmLWNF1dHuS6ic1qIeWuME/640?from=appmsg "")  
![]( "")  
  
加入团队、加入公开群等都可联系微信：yukikhq，搜索添加即可  
  
END  
  
​  
  
