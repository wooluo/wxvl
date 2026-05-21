#  Nginx 最新 1.31.0 版本 又有 0day? 是真正的核弹？  
原创 Secu的矛与盾
                    Secu的矛与盾  Secu的矛与盾   2026-05-20 15:25  
  
最近，nginx 官方刚刚修复了 Rift 漏洞（CVE-2026-42945），然后冲浪的时候看见声称发现了 “nginx-poolslip”，  
针对最新 nginx 版本 1.31.0 的全新远程代码执行漏洞  
 的帖子，并声称会在  
补丁发布 30 天后发布包含 ASLR 绕过的完整技术说明 。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/q56nUfZdicH7eEId2cspbftpsV7FoVz5bW4d6m3uN29Mic6WTwIVSm4CRhsZFSSdOG262xh1AQby6PuB9vVtpfzBicuicD0HUTQw9SAGzmqZ8jQ/640?wx_fmt=png&from=appmsg "")  
  
  
<table><tbody><tr><td data-colwidth="38"><section><span leaf=""><br/></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 500;letter-spacing: normal;orphans: 2;text-align: left;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">Rift (CVE-2026-42945)</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 500;letter-spacing: normal;orphans: 2;text-align: left;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">假设的 nginx-poolslip</span></span></section></td></tr><tr><td data-colwidth="38"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">触发面</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">ngx_http_rewrite_module，偏配置相关</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">未知（若为核心内存池漏洞，则默认可触发）</span></span></section></td></tr><tr><td data-colwidth="38"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">实际威胁</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">多数场景 crash / DoS；RCE 依赖 ASLR 绕过等苛刻条件</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">若确认可以 ASLR bypass ，威胁直接升级</span></span></section></td></tr><tr><td data-colwidth="38"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">影响版本</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">≤ 1.30.0，1.30.1 / 1.31.0 已修复</span></span></section></td><td data-colwidth="287"><section><span style="color: rgb(15, 17, 21);font-family: quote-cjk-patch, Inter, system-ui, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, Roboto, Oxygen, Ubuntu, Cantarell, &#34;Open Sans&#34;, &#34;Helvetica Neue&#34;, sans-serif;font-size: 15px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">声称影响 1.31.0</span></span></section></td></tr></tbody></table>  
  
什么是  
ASLR  
  
• ASLR = Address Space Layout Randomization，中文一般叫地址空间布局随机化。  
  
  它是一种内存安全防护机制：  
  
  程序每次启动时，系统会把关键内存区域放到随机地址，比如：  
  
  程序代码段、 libc / 动态库、 heap 堆、stack 栈、mmap 区域  
  
 攻击者想利用内存漏洞 RCE 时，通常需要知道某些函数或 gadget 的地址，比如：  
  
  system()、execve()、 libc 地址、ROP gadget 地址、shellcode / fake object 地址  
  
  如果没有 ASLR，这些地址比较固定，漏洞利用更容易。  
  
  有 ASLR 后，每次地址都变，攻击者很难直接跳到目标位置。  
  
思考：  
  
1. 漏洞本质决定影响面    
  
如果 Poolslip 是核心内存池、请求解析阶段的漏洞，那它会比 Rift 危险得多。因为这类漏洞不依赖 rewrite 等特定配置，可能一次普通的 HTTP 请求就能触发——这种“公网 nginx 扫描级”的漏洞，是所有运维人员的噩梦。  
  
2. 是否绑定了特定模块或配置    
  
假设它仍然依赖某个模块（比如 proxy、缓存、HTTP/2、HTTP/3 等）或特殊的 location 规则才生效，那风险就会更接近 Rift：真实存在，但利用面明显受限。  
  
无论 Poolslip 是真是假，后续还是多关注一下的好，继续盯紧官方通告。    
  
声明：  
  
文章信息均来源于网络，仅供参考。  
  
  
  
  
