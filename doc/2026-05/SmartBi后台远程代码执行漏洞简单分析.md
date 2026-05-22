#  SmartBi后台远程代码执行漏洞简单分析  
原创 莫大130
                        莫大130  安全逐梦人   2026-05-21 23:17  
  
   
  
简单复现一下SmartBi漏洞  
  
影响版本Smartbi <= 11.0.99471.25193  
## 环境搭建  
### 需要的环境  
- • 源代码一套（最后给出源码）  
  
- • sqlserver 2016  
  
源码文件结构  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz4fl0IBseVZ2A7Feuz0rHHyXmLYO2ugibydLYhNFiclz5IEFpPoI428yrnU0qTswID7ol7Y5ytzD4pg/640?wx_fmt=png&from=appmsg "")  
  
运行tomcat\bin\startup.cmd  
 ,环境就会启动，第一次运行会要求填入sqlserve数据库账户密码  
## 代码分析  
### 分析jar  
  
搜索jar中存在的关键字 MetricsModelForVModule  
 和 checkExpression  
 ，Smartbi-SmartbixSmartbi.jar 中发现该类。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz4fl0IBseVZ2A7Feuz0rHHy4aSAu3Ej3uNsD3IyTye5rV80u3yXJZ2nIfeSZPPvknZzXgSf441qNw/640?wx_fmt=png&from=appmsg "")  
  
使用jd-gui反编译Smartbi-SmartbixSmartbi.jar  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz4fl0IBseVZ2A7Feuz0rHHyp0yvO7gBtI3ibgOduX2uh6kaUpibG8gXD8GkmJiagGCzfpZSTYzV2ZEuA/640?wx_fmt=png&from=appmsg "")  
### 分析触发漏洞点  
  
checkExpression  
 方法 使用了 ScriptEngineManager类 ，ScriptEngine 是一个标准的API（定义在 javax.script 包中），它允许Java程序在运行时嵌入、解析和执行用其他脚本语言（如JavaScript, Python, Ruby等）编写的代码。  
```
  public Boolean checkExpression(String nameExpression) {      StateHolder.toSmartbiX();      ScriptEngineManagerengineManager=newScriptEngineManager();      ScriptEngineengine= engineManager.getEngineByName("js");      try {        nameExpression = nameExpression.replaceAll("\\[[\\u4e00-\\u9fa5_ a-zA-Z0-9.]*\\]", "(6)");        engine.eval(nameExpression);      } catch (ScriptException e) {        return Boolean.valueOf(false);      }       return Boolean.valueOf(true);    }
```  
  
ScriptEngine.eval() 函数是一个极其危险的函数，会导致命令执行漏洞。  
## 漏洞复现  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz4fl0IBseVZ2A7Feuz0rHHyc6WN9fLwjJlY5dLdwvEWNUM6HGJPJUF1pjZfhickeRGNRwjkuvElQlA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz4fl0IBseVZ2A7Feuz0rHHyEJM4GCv2AjkMziaB323On1viaExiatFwOwu4TO4rU0qnfnJvUTd74nJdw/640?wx_fmt=png&from=appmsg "")  
  
   
  
  
后台回复： 20250827  
  
## 参考  
- • [https://mp.weixin.qq.com/s/aIyGt5OKlYCL-NPfd0G2Jw?scene=1&click_id=24](https://mp.weixin.qq.com/s?__biz=Mzk0NTQyMjk4Ng==&mid=2247484370&idx=1&sn=be428ab626a8dfdf968d1dc50aab0c27&scene=21&click_id=24#wechat_redirect)  
  
  
- • https://mrxn.net/jswz/smartbi-authcation-bypass-rce.html  
  
  
  
   
  
  
