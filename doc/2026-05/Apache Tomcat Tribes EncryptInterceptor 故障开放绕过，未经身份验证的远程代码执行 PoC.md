#  Apache Tomcat Tribes EncryptInterceptor 故障开放绕过，未经身份验证的远程代码执行 PoC  
 Ots安全   2026-05-12 05:08  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0FicWBhOk7UhHN3TIianogmTGr6oW5DMPsx2edp3h34XPpLWVWw3WamucCqlPYNauJZicnKENfJME9Fm57IiacAYT9so1dTFnNe0lw/640?wx_fmt=png&from=appmsg "")  
  
CVE-2026-34486  
  
Apache Tomcat Tribes 集群中的 EncryptInterceptor 故障打开绕过导致通过 Java 反序列化实现未经身份验证的 RCE。  
  
受影响版本：11.0.19+、10.1.53+、9.0.116+。已修复版本：11.0.21、10.1.54、9.0.117。  
  
由 Bartlomiej Dmitruk ( striga.ai )发现并报告。  
- 文章链接：https://striga.ai/research/tomcat-tribes-unauth-rce  
  
要求  
- Docker  
  
- Java 21  
  
- Python 3  
  
用法  
  
一键复制：  
  
```
bash run.sh
```  
  
  
这会构建 Docker 镜像，启动带有 EncryptInterceptor 的 Tomcat 11.0.20，生成 CC6 gadget 链有效载荷，将其未加密地发送到端口 4000 上的 Tribes 接收器，并通过检查/tmp/pwned容器内部来验证 RCE。  
  
清理  
  
```
docker rm -f tomcat-encrypt-poc
```  
  
  
项目地址：  
  
https://github.com/striga-ai/CVE-2026-34486  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0FN2cqoKEJ3aaNBzDspnW4JlMc0UnB9kMkWB0cTbZHLVZI3agPIBw8w4icNJsicXze0qWF1GEXEbOR07kVlSH5GFj5Gicz2ysvsB4/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
