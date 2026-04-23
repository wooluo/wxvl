#  GHSA-xq3m-2v4x-88gg 的 PoC：通过代码注入在 protobuf.js 中实现严重远程代码执行 (CVSS 9.4)  
 Ots安全   2026-04-23 04:57  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
protobuf.js（protobufjsnpm 包）中存在严重代码注入漏洞，可通过精心构造的 protobuf schema 类型名称实现完全远程代码执行。  
  
根本原因  
  
该protobuf.js库使用一个代码生成模块（ ），该模块通过字符串连接@protobufjs/codegen构建 JavaScript 函数，并通过构造函数执行它们。来自 protobuf 模式的类型名称直接插入到生成的函数标识符中，而没有任何清理。Function()  
  
易受攻击的代码路径位于src/type.js：  
  
```
// Type.generateConstructor builds a constructor function:var gen = util.codegen(["p"], mtype.name); // mtype.name is UNSANITIZED// ... adds body lines ...return gen; // gen() later calls Function(source)()
```  
  
  
代码生成器toString()构建：  
  
```
functionNAME(p){  body}
```  
  
  
注入技术  
  
设计的类型名称结构如下：  
  
```
X(p){PAYLOAD};if(true){//
```  
  
  
经过代码生成器处理后，生成如下代码：  
  
```
returnfunctionX(p){PAYLOAD};if(true){//(p){  if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)  this[ks[i]]=p[ks[i]]}
```  
  
  
解析器将其视为：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0GevEiaZKEOVMvP73aFgiclOCpKMnQ2TY5ic1fibdRlDOLVKpbnqaKtiafYJJwLmKGs5SwRXE6grU46ibQw5oun1lg42SFjNahmcQTicE/640?wx_fmt=png&from=appmsg "")  
  
解析器将其视为：返回的函数成为类型构造函数。当protobuf.js使用该构造函数创建或解码消息时new ctor(props)，注入的有效负载将以完整的 Node.js 权限执行。  
  
攻击链  
  
```
Attacker crafts .proto schema with malicious type name         |         vApp loads schema (Root.fromJSON, protobuf.load, gRPC config)         |         vType.generateConstructor() → codegen → Function()          | (unsanitized name injected into functionsource)         vnewctor(props) calledduring .create() / .decode() / .encode()         |         vPAYLOADEXECUTES — child_process, fs, net, process.env
```  
  
  
影响  
  
利用漏洞可使攻击者获得以下权限：  
- 通过操作系统命令执行child_process.execSync()  
  
- 文件系统访问——读/写任意文件  
  
- 环境变量——凭据、API密钥、数据库URL  
  
- 网络访问——数据泄露、横向移动  
  
- 进程控制——反向 shell、持久化  
  
受影响的下游软件包包括@grpc/proto-loaderFirebase SDK 和 Google Cloud SDK。  
  
概念验证员做什么  
  
该洞利用程序分为 4 个阶段：  
- 第一阶段——通过精心构造的类型名称注入代码，该类型名称经过修改globalThis以证明可以执行任意代码。  
  
- 第二阶段——id通过执行child_process.execSync()并将输出写入到/tmp/pwned.txt  
  
- 第三阶段——捕获内联命令输出（id，，）uname -a/etc/os-release  
  
- 第四阶段——显示生成的函数源代码，准确地展示了注入是如何进行的。  
  
屏幕截图  
  
利用（protobufjs 7.5.4）  
  
所有三个阶段都确认了代码执行——全局修改、操作系统命令执行写入/tmp/pwned.txt以及内联命令输出捕获：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0FT2UJBH1oYVuTiaAt3ZnYcgsyG8Yk2arwemHkliaCWzFTdZDDplq8qqyb1xxNantzv4G0bQSzKYAiaKiaLR90L91ahLgqfMV3P73I/640?wx_fmt=png&from=appmsg "")  
  
代码生成分析  
  
生成的函数源代码展示了类型名称注入是如何跳出函数模板的：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0HkQUt87hiascaYGmJRXkcAvGNae7bIKiaLM0pSKMmZImwSQBjK6hV5mCDuIibHV20ia2oUcm1h9u1cIBtJxwpicWIUwTwUr8aoBFCM/640?wx_fmt=png&from=appmsg "")  
  
补丁验证（protobufjs 7.5.5）  
  
同样的漏洞利用代码可以针对修复后的版本进行攻击——所有注入尝试都会被阻止：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0G1fyd49YADdeL4R6SV0f0bjyYdpsdQEpL5e1CAodOrI2zczwOVuEpSTpfiazm8pL1Nj3h0tZCPz7ibgW5V5NbL6g18Y8jMFeQUM/640?wx_fmt=png&from=appmsg "")  
  
修复提交  
  
这行代码修复了类型名称在代码生成之前就去除所有非单词字符的问题：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0FX3BsMXus6LBlM6wjZbKiaSWpJSKZp8Bv4VW4BqA6stvCtjDJMHA01J5f8PsW2fRdQZTKPFgBHl7rgOEic2k4F0WYXLFIGE5g58/640?wx_fmt=png&from=appmsg "")  
  
攻击流程  
  
从精心设计的攻击模式到代码执行的端到端攻击流程：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0Gnxew9q0HFMQYrPdadaasCpNr07eicFNQ73r9wsUSL5EVXxHm1M8WNC2cS8oV36U60r5x88ORzlwM7xsgz4AHfjdMNRMbpiaxXQ/640?wx_fmt=png&from=appmsg "")  
  
漏洞概要  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0F7BbFegdsfySrQ8azT5XSBCBg5JeKzG0NibqYq1RWibOhWPxFmcgVkdVOYN7CXcCtcfBvuc8jSQH2jpj8LFSjTvYPI0hXJhCibjc/640?wx_fmt=png&from=appmsg "")  
  
项目地址：  
  
https://github.com/dinosn/CVE-protobufjs-GHSA-xq3m-2v4x-88gg  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zNsFJyIuL0FKQibgyPGBGVoYgachey0FLjVgj9PU4ciaCMRAyNrhxeecIL3wbDGgQhLIQgKXzlljluU9dmTwgvKm9reyQ9fx2gD8M70pENHfA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
