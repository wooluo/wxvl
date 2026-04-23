#  1day:可实现Nginx服务器完全控制  
 迪哥讲事   2026-04-23 02:13  
  
<table><tbody><tr><td data-colwidth="557" width="557" valign="top" style="word-break: break-all;"><h1 data-selectable-paragraph="" style="white-space: normal;outline: 0px;max-width: 100%;font-family: -apple-system, system-ui, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;letter-spacing: 0.544px;background-color: rgb(255, 255, 255);box-sizing: border-box !important;overflow-wrap: break-word !important;"><strong style="outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="color: rgb(255, 0, 0);"><strong><span style="font-size: 15px;"><span leaf="">声明：</span></span></strong></span></span></strong><span style="outline: 0px;max-width: 100%;font-size: 18px;box-sizing: border-box !important;overflow-wrap: break-word !important;"><span style="font-size: 15px;"><span leaf="">文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由用户承担全部法律及连带责任，文章作者不承担任何法律及连带责任。</span></span></span></h1></td></tr></tbody></table>#   
  
#   
  
****#   
#   
  
  
  
近日，一款流行的基于Web的Nginx管理工具nginx-ui中发现了一个关键安全漏洞，并且已被在野利用。该工具在GitHub上拥有超过11K星标和43万+的Docker拉取量。漏洞CVE-2026-33032  
的CVSS得分为9.8，使攻击者能够完全控制Nginx服务器。  
## 场景理解  
  
nginx-ui使用了mcp-go库中的SSE传输。以下是两个重要的端点：  
  
GET /mcp  
 - 打开一个持久的SSE流。用于建立持久的Server-Sent Events连接以接收JSON-RPC响应并启动会话。  
  
POST /mcp_message  
 - 用于向MCP服务器发送命令。  
  
当一个客户端发送GET请求到 /mcp  
 端点以打开流时，服务器会响应一个会话ID，如下所示：  
```
data: /mcp_message?sessionId=9a7f3d21-6c5e-4b8a-9d72-3f1e8c4b2a11
```  
  
之后，通过POST请求调用工具到 /mcp_message  
 端点，并携带有效的 sessionId  
，响应通过SSE流发送回客户端。这里，nginx-ui使用 node_secret  
 对MCP连接进行身份验证。  
  
但你现在肯定在想这有什么问题，到目前为止一切看起来都正常。我们来看看。  
### 理解安全漏洞  
```
// Vulnerable Code
func InitRouter(r *gin.Engine) {
 r.Any(
"/mcp"
, middleware.IPWhiteList(), middleware.AuthRequired(),
  func(c *gin.Context) {
   mcp.ServeHTTP(c)
  })
 r.Any(
"/mcp_message"
, middleware.IPWhiteList(),
  func(c *gin.Context) {
   mcp.ServeHTTP(c)
  })
}
```  
  
如果你仔细观察，/mcp  
 端点受 middleware.AuthRequired()  
 保护，但 /mcp_message  
 没有。因为 mcp.ServeHTTP()  
 处理所有的MCP工具调用，任何人都可以在未经身份验证的情况下通过 /mcp_message  
 端点执行工具。  
  
虽然 /mcp_message  
 端点确实使用了 middleware.IPWhiteList()  
，但这一层仅存的保护自身存在一个关键缺陷：  
```
// internal/middleware/ip_whitelist.go:11-26 - Empty whitelist allows all
func IPWhiteList() gin.HandlerFunc {
 
return
 func(c *gin.Context) {
  clientIP := c.ClientIP()
  
if
 len(settings.AuthSettings.IPWhiteList) == 0 || clientIP == 
""
 || clientIP == 
"127.0.0.1"
 || clientIP == 
"::1"
 {
   c.Next()
   
return
  }
  // ...
 }
}
```  
  
这里，我们可以看到如果 IPWhiteList  
 为空，那么这个机制就完全失效，因为它允许所有没有IP过滤的请求；并且默认安装时 IPWhiteList  
 是空的，这是一个失效开放的设计。  
  
总之，如果 IPWhiteList  
 为空，那么下面列出的12个MCP工具可以在没有任何身份验证的情况下被攻击者访问。  
### 可用的MCP工具  
  
来自 mcp/nginx/  
:  
- restart_nginx  
 - 重启Nginx进程  
  
- reload_nginx  
 - 重新加载Nginx配置  
  
- nginx_status  
 - 读取Nginx状态  
  
来自 mcp/config/  
:  
- nginx_config_add  
 - 创建新的Nginx配置文件  
  
- nginx_config_modify  
 - 修改现有配置文件  
  
- nginx_config_list  
 - 列出所有配置  
  
- nginx_config_get  
 - 读取配置文件内容  
  
- nginx_config_enable  
 - 启用/禁用站点  
  
- nginx_config_rename  
 - 重命名配置文件  
  
- nginx_config_mkdir  
 - 创建目录  
  
- nginx_config_history  
 - 查看配置历史  
  
- nginx_config_base_path  
 - 获取Nginx配置目录路径  
  
### 影响  
1. 攻击者可以完全控制Nginx服务，并且可以在配置目录内创建、修改和删除任何Nginx配置文件，这会触发立即重启。  
  
1. 攻击者可以通过代理所有流经攻击者控制端点的流量，窃取凭证、会话令牌和其他敏感数据。  
  
1. 写入无效的配置文件会导致服务器重启并完全中断服务。  
  
1. 攻击者可以通过注入包含自定义 log_format  
 模式的 access_logs  
 指令来捕获 Authorization  
 头，这使其能够提升权限，访问REST API。  
  
数据显示全球范围内暴露的Nginx实例数量。  
  
全球共有2689个暴露的实例，其中大部分来自中国、美国、印度尼西亚、德国和香港。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TKdPSwEibsZgicicOmDKg5KXKu42J3NkAodpeNUMWwvsTWp8AoiaO0wEfIAjdrY5GalkbYhkeUSwuM0Blpc33ouDV2uG1kDA6TSGpe3VVZgo6CM/640?wx_fmt=png&from=appmsg "")  
## 现在该怎么做？  
  
已确认CVE-2026-33032  
在野被积极利用。如果你正在运行易受攻击的版本，请立即更新。  
  
如果你正在运行启用了MCP的nginx-ui：  
- 立即更新到 v2.3.4  
 或更高版本  
  
- 如果你无法立即更新，请立即禁用MCP，或者紧急地将可信主机添加到IP白名单中，切勿将其留空。  
  
### 修复  
  
该漏洞在2026年3月15日发布的 v2.3.4  
 中得到了修复，你猜对了，修复方法就是在 /mcp_message  
 端点上添加缺失的身份验证。  
  
修复后的代码看起来像这样：  
```
// Patched code
r.Any(
"/mcp_message"
, middleware.IPWhiteList(), middleware.AuthRequired(),
func
(c *gin.Context)
 {
        mcp.ServeHTTP(c)
    })
```  
  
原文：  
  
https://infosecwriteups.com/cve-2026-33032-exploitation-allows-full-control-over-nginx-server-838949e8637c  
  
如果你是一个长期主义者，欢迎加入我的知识星球，本星球日日更新,包含号主大量一线实战,全网独一无二，微信识别二维码付费即可加入，如不满意，72 小时内可在 App 内无条件自助退款  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YmmVSe19Qj5EMr3X76qdKBrhIIkBlVVyuiaiasseFZ9LqtibyKFk7gXvgTU2C2yEwKLaaqfX0DL3eoH6gTcNLJvDQ/640?wx_fmt=png&from=appmsg "")  
  
往期回顾  
#   
# 如何利用ai辅助挖漏洞  
#   
# 如何在移动端抓包-下  
#   
# 如何绕过签名校验  
#   
  
[一款bp神器](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247495880&idx=1&sn=65d42fbff5e198509e55072674ac5283&chksm=e8a5faabdfd273bd55df8f7db3d644d3102d7382020234741e37ca29e963eace13dd17fcabdd&scene=21#wechat_redirect)  
  
  
[挖掘有回显ssrf的隐藏payload](https://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247496898&idx=1&sn=b6088e20a8b4fc9fbd887b900d8c5247&scene=21#wechat_redirect)  
  
  
[ssrf绕过新思路](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247495841&idx=1&sn=bbf477afa30391b8072d23469645d026&chksm=e8a5fac2dfd273d42344f18c7c6f0f7a158cca94041c4c4db330c3adf2d1f77f062dcaf6c5e0&scene=21#wechat_redirect)  
  
  
[一个辅助测试ssrf的工具](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247496380&idx=1&sn=78c0c4c67821f5ecbe4f3947b567eeec&chksm=e8a5f8dfdfd271c935aeb4444ea7e928c55cb4c823c51f1067f267699d71a1aad086cf203b99&scene=21#wechat_redirect)  
  
  
[dom-xss精选文章](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247488819&idx=1&sn=5141f88f3e70b9c97e63a4b68689bf6e&chksm=e8a61f50dfd1964692f93412f122087ac160b743b4532ee0c1e42a83039de62825ebbd066a1e&scene=21#wechat_redirect)  
  
  
[年度精选文章](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247487187&idx=1&sn=622438ee6492e4c639ebd8500384ab2f&chksm=e8a604b0dfd18da6c459b4705abd520cc2259a607dd9306915d845c1965224cc117207fc6236&scene=21#wechat_redirect)  
  
  
[Nuclei权威指南-如何躺赚](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247487122&idx=1&sn=32459310408d126aa43240673b8b0846&chksm=e8a604f1dfd18de737769dd512ad4063a3da328117b8a98c4ca9bc5b48af4dcfa397c667f4e3&scene=21#wechat_redirect)  
  
  
[漏洞赏金猎人系列-如何测试设置功能IV](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486973&idx=1&sn=6ec419db11ff93d30aa2fbc04d8dbab6&chksm=e8a6079edfd18e88f6236e237837ee0d1101489d52f2abb28532162e2937ec4612f1be52a88f&scene=21#wechat_redirect)  
  
  
[漏洞赏金猎人系列-如何测试注册功能以及相关Tips](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486764&idx=1&sn=9f78d4c937675d76fb94de20effdeb78&chksm=e8a6074fdfd18e59126990bc3fcae300cdac492b374ad3962926092aa0074c3ee0945a31aa8a&scene=21#wechat_redirect)  
  
[‍](http://mp.weixin.qq.com/s?__biz=MzIzMTIzNTM0MA==&mid=2247486764&idx=1&sn=9f78d4c937675d76fb94de20effdeb78&chksm=e8a6074fdfd18e59126990bc3fcae300cdac492b374ad3962926092aa0074c3ee0945a31aa8a&scene=21#wechat_redirect)  
  
  
  
  
  
