#  Vulfocus入门——命令执行漏洞  
原创 L×K@y
                    L×K@y  Quest安全团队   2026-05-02 09:26  
  
- 命令注入漏洞的核心成因：  
  
**应用程序在调用外部系统命令时，将用户可控的数据（如输入、参数等）直接拼接到命令中，且未进行充分的验证或过滤。**  
  
具体可分解为以下几个关键点：  
1. **未过滤/转义用户输入**  
：程序直接使用了用户通过表单、URL参数、Cookie、HTTP头等提供的输入，作为系统命令的一部分。  
  
1. **危险函数调用**  
：代码中使用了执行系统命令的函数，例如PHP中的 system()  
、exec()  
、shell_exec()  
，Java中的 Runtime.exec()  
，Python中的 os.system()  
、subprocess.call(shell=True)  
 等。  
  
1. **拼接命令字符串**  
：直接将用户输入拼接到命令字符串中，没有使用参数化（类似SQL注入的预编译）或安全的API进行隔离。  
  
1. **未使用安全编程模式**  
：没有遵循“白名单验证”、“转义特殊字符”、“限制命令执行权限”等安全实践。  
  
**一个典型的漏洞代码示例（PHP）：**  
  
php  
```
```  
  
  
攻击者可以提交：?filename=; rm -rf /  
，最终执行的命令就变成了：  
  
bash  
```
```  
  
  
**导致漏洞的常见场景：**  
- **用户上传文件后的处理**  
：如调用 convert  
、ffmpeg  
 等外部工具。  
  
- **系统诊断功能**  
：如Ping、Traceroute、NSLookup等网络工具调用。  
  
- **压缩/解压功能**  
：调用 tar  
、zip  
、unzip  
。  
  
- **发送邮件**  
：调用 mail  
 或 sendmail  
。  
  
- **服务状态检查**  
：调用 systemctl  
、service  
。  
  
**根本性原因总结：**  
  
**信任了用户的输入，并将其作为代码（命令）执行，而不是仅作为数据处理。**  
 这是典型的“注入类”漏洞（包括SQL注入、XSS等）的共同根源——未将“数据”与“代码”进行有效隔离。  
  
  
- 如题所示：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eQs5ycicWaylaYuLCmoiaRHj4sULqcAPrdicI5DPtDlI7trF43spBFQzulP6o6mST9a7d3BWpaNmIbOXeiagKObAjEficuK0fL5NGcB3CRvcrLGU/640?wx_fmt=png&from=appmsg "")  
  
参数cmd可控，利用参数调用系统命令。  
  
在 Linux 系统中，/tmp  
 是一个**临时文件目录**  
，全称为 temporary  
。  
  
ls  
 是 Linux 系统中最基础、最常用的命令之一，英文全称是 **list**  
，用于**列出目录内容**  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eQs5ycicWaynlMQLEribQhMm004iaMwvwXVBRXunXcnrScVKMQ8cibrqrSTZnLJTqC9f4puphr6NpmOicVrmwCOePHo2oRRibWGEMwJXHtyO5TKNU/640?wx_fmt=png&from=appmsg "")  
  
  
