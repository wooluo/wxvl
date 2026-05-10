#  从密码重置到 Gogs RCE：Silentium 双链路提权  
原创 YMsora
                    YMsora  YMs0ra的安全漫路   2026-05-09 14:57  
  
最近忙着打比赛和搞开发，好久没更新  
  
这次的机器非常有意思并且流程相对挺长的，同时也学到了很多东西吧  
  
老样子，绑定openvpn之后开始跑nmap  
```
sora@IBM5100:~$ nmap -sC -sV -T4 -Pn --min-rate 1000 10.129.47.81
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-05-03 17:15 CST
Nmap scan report for staging.silentium.htb (10.129.47.81)
Host is up (0.27s latency).
Not shown: 760 filtered tcp ports (no-response), 238 closed tcp ports (conn-refused)
PORT STATE SERVICE VERSION
22/tcp open ssh OpenSSH 9.6p1 Ubuntu 3ubuntu13.15 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
| 256 0c:4b:d2:76:ab:10:06:92:05:dc:f7:55:94:7f:18:df (ECDSA)
|_ 256 2d:6d:4a:4c:ee:2e:11:b6:c8:90:e6:83:e9:df:38:b0 (ED25519)
80/tcp open http nginx 1.24.0 (Ubuntu)
|_http-server-header: nginx/1.24.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 92.43 seconds
```  
  
直接改/etc/hosts绑ip  
  
首页静态，第一步肯定是fuzz子域名  
  
这里有两种方式，一个是直接FUZZ.example.com,  
  
还有一种是-H vhost的扫描，也就是指定-H "HOST: XXXX"  
  
首页拿到一个员工邮箱ben@silentium.htb  
  
成功扫出子域staging.silentium.htb  
  
直接访问进行简单抓包，抓到一个未授权密码重置，  
  
重置之后进行登录操作，然后带上cookie进行nuclei扫描  
  
成功扫到RCE，为CVE-2025-58434-59528  
  
找到github的poc进行反弹shell到我方主机  
  
ls -la / 时发现这是个容器机。  
  
继续寻找信息泄露，在/proc/1/environ中找到了一个密码，试试ssh  
  
可以直接进行连接  
```
ben@silentium:/home$ cd ben
ben@silentium:~$ ls
user.txt
ben@silentium:~$ cat usr.txt
cat: usr.txt: No such file or directory
ben@silentium:~$ cat user.txt
e1f48c281b4c85b7eb5cfa6b7a2979b3
ben@silentium:~$
```  
  
到这里RCE一步已经完成。接下来就是提权拿到root目录的flag了  
  
scp将LinPEAS进行上传到目标服务器，扫到了docker的可写提权以及最近很火爆的内核组件提权，  
  
但是尝试poc后都宣告失败，我并没有看docker的权限  
  
netstat -tuln 查看端口情况。  
  
发现有非常多的端口开着，如下  
```
root@silentium:~


netstat -tulnnetstat -tulnActive Internet connections (only servers)Proto Recv-Q Send-Q Local Address Foreign Address Statetcp 0 0 127.0.0.1:1025 0.0.0.0:* LISTENtcp 0 0 0.0.0.0:22 0.0.0.0:* LISTENtcp 0 0 0.0.0.0:80 0.0.0.0:* LISTENtcp 0 0 127.0.0.54:53 0.0.0.0:* LISTENtcp 0 0 127.0.0.1:8025 0.0.0.0:* LISTENtcp 0 0 127.0.0.1:39085 0.0.0.0:* LISTENtcp 0 0 127.0.0.53:53 0.0.0.0:* LISTENtcp 0 0 127.0.0.1:3000 0.0.0.0:* LISTENtcp 0 0 127.0.0.1:3001 0.0.0.0:* LISTENtcp6 0 0 :::22 :::* LISTENtcp6 0 0 :::80 :::* LISTENudp 0 0 127.0.0.54:53 0.0.0.0:udp 0 0 127.0.0.53:53 0.0.0.0:udp 0 0 0.0.0.0:68 0.0.0.0:*root@silentium:~#
```  
  
这里可以做一个本地脚本微探测，发现3001端口跑的是gogs，  
```
sora@IBM5100:~$ nuclei -u http://127.0.0.1:3001 -tags gogs -vv

 __ _
 ____ __ _______/ /__ (_)
 / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ / __/ /
/_/ /_/\__,_/\___/_/\___/_/ v3.8.0

 projectdiscovery.io

[WRN] Found 1 templates with runtime error (use -validate flag for further examination)
[INF] Current nuclei version: v3.8.0 (latest)
[INF] Current nuclei-templates version: v10.4.2 (latest)
[INF] New templates added in latest release: 121
[INF] Templates loaded for current scan: 8
[INF] Executing 8 signed templates from projectdiscovery/nuclei-templates
[INF] Targets loaded for current scan: 1
[CVE-2014-8682] Gogs (Go Git Service) - SQL Injection (@dhiyaneshdk,@daffainfo) [high]
[CVE-2018-18925] Gogs (Go Git Service) 0.11.66 - Remote Code Execution (@princechaddha) [critical]
[CVE-2020-15867] Gogs 0.5.5 - 0.12.2 - Remote Code Execution (@theamanrawat) [high]
[CVE-2022-0415] Gogs <0.12.6 - Remote Command Execution (@theamanrawat) [high]
[CVE-2022-0870] Gogs <0.12.5 - Server-Side Request Forgery (@theamanrawat,@akincibor) [medium]
[CVE-2025-8110] Gogs <= 0.13.3 - Remote Code Execution (@rxerium) [high]
[gogs-panel] Gogs Login Panel - Detect (@dhiyaneshdk,@daffainfo) [info]
[gogs-installer] Gogs (Go Git Service) - Installer (@dhiyaneshdk) [critical]
[INF] Templates clustered: 2 (Reduced 1 Requests)
[gogs-panel] [http] [info] http://127.0.0.1:3001/user/login
[INF] Scan completed in 1.632897714s. 1 matches found.
sora@IBM5100:~$
```  
  
其中有[CVE-2025-8110] Gogs <= 0.13.3 - Remote Code Execution (@rxerium) [high]  
  
是可以提权的，我们找到POC进行修改，然后拿到shell，于是就完成了  
  
super RCE  
  
