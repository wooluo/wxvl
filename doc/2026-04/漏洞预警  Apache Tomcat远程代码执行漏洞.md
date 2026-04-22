#  漏洞预警 | Apache Tomcat远程代码执行漏洞  
浅安
                    浅安  浅安安全   2026-04-21 23:50  
  
**0x00 漏洞编号**  
- CVE-  
2026-34486  
  
**0x01 危险等级**  
- 高危  
  
**0x02 漏洞概述**  
  
Apache Tomcat是一个流行的开源Web服务器和Java Servlet容器。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/7stTqD182SWJJsicexOeGePbC9kyVvapu9wiclKfBZRwyWZSn0HheHxmVzMf32MBvk9bjyvt55C0RxejMwSKxanQ/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=0 "")  
  
**0x03 漏洞详情**  
  
**CVE-2026-34486**  
  
**漏洞类型：**  
远程代码执行  
  
**影响：**  
执行任意命令  
  
**简述：**  
Apache Tomcat存在远程代码执行漏洞，在对EncryptInterceptor组件进行安全加固时，消息接收方法messageReceived()内部的异常处理流程发生了改变，这导致了当接收到的集群通信数据无法正常解密时，代码路径未能终止当前请求的处理，而是忽略了该异常状态并继续将原始的、未经解密验证的数据向后续处理环节传递。在启用Tribes集群并配置加密拦截器的场景下，远程攻击者能够向集群监听端口提交特制的协议报文，且该报文无需遵守正常的加密规范。若当前应用环境或依赖库中已存在可利用的Gadget类，攻击者便获得了在服务器进程上下文中执行任意系统命令或代码的能力。  
  
**0x04 影响版本**  
- Apache Tomcat 11.0.20  
  
- Apache Tomcat 10.1.53  
  
- Apache Tomcat 9.0.116  
  
**0x05****POC状态**  
- 未公开  
  
**0x06****修复建议**  
  
******目前官方已发布漏洞修复版本，建议用户升级到安全版本****：******  
  
https://tomcat.apache.org/  
  
  
  
