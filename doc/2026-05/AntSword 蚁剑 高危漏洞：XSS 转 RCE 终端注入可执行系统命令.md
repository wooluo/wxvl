#  AntSword |蚁剑 高危漏洞：XSS 转 RCE 终端注入可执行系统命令  
原创 three安全之路
                    three安全之路  three安全之路   2026-05-07 01:43  
  
本公众号（three安全之路）所发布的技术文章、工具及研究内容均仅供参考，所提供的信息仅面向网络安全从业者、授权安全测试人员，用于其负责的网络资产、信息系统及相关设备的安全防护工作。任何使用者利用本公众号提供的技术信息、工具或方案，所造成的直接或间接后果、经济损失及法律责任，均由使用者本人自行承担，本公众号及作者不承担任何连带责任。  
  
## 1漏洞概述  
  
     XSS → RCE 的安全漏洞，存在于 AntSword v2.1.15 中。攻击者可通过构造恶意的服务端响应，在虚拟终端中注入可执行的 JavaScript 链接，由于 Electron 启用了 nodeIntegration: true，用户点击后可直接执行任意系统命令。  
  
漏洞类型：反射型 XSS + Electron RCE  
  
利用条件：需要用户主动点击终端中的链接（1-click 交互）  
  
危害等级：高危（可执行任意命令，可进行反连）  
  
https://github.com/AntSwordProject/antSword/issues/370  
<table><tbody><tr><td data-colwidth="45.65px" width="45.65px" style="text-align: center;font-size: 16px;color: rgb(220, 53, 69);border: 1px solid rgb(222, 226, 230);flex: 0 0 10%;box-sizing: border-box;padding: 5px 10px;max-width: 10% !important;"><section><span leaf="">2</span></section></td><td data-colwidth="417.35px" width="417.35px" style="border: 1px solid rgb(222, 226, 230);box-sizing: border-box;padding: 5px 10px;"><span style="font-size: 20px;"><strong><span leaf="">漏洞复现</span></strong></span></td></tr></tbody></table>  
       
  
     环境准备：**客户端**  
 (运行AntSword)，**服务端**  
 (恶意WebShell)，**蚁剑**  
(版本v2.1.15及以下)  
  
      在服务端的根目录下放入php脚本，在php.ini**配置 PHP 自动前置加载这个脚本**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ34iayVjlCoGDLGJ63iczYeOIyf82ECsWRpWfMQk2qT7ZabtQB8MibUibDBQN5aucU9ywhhTmia4S0gosATia0N6GIFmNIr3e4qDyaibQ/640?wx_fmt=png&from=appmsg "")  
  
      蚁剑连接后，打开终端显示蚁剑需要更新(我们的钓鱼信息)，攻击者点击下面的链接执行弹出clac命令(可以配合msf+cs进行钓鱼网站，反连)  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ00rX35GS1UYvYcJQUTia6KWahs5w3AufUPWTibWgcNDCOj0c5hY5RjWTKGpwUqLAdZUoGfwwAe4NiaZxtRicqOsniaKG1HiaOQiagCkM/640?wx_fmt=png&from=appmsg "")  
<table><tbody><tr><td data-colwidth="45.65px" width="45.65px" style="text-align: center;font-size: 16px;color: rgb(220, 53, 69);border: 1px solid rgb(222, 226, 230);flex: 0 0 10%;box-sizing: border-box;padding: 5px 10px;max-width: 10% !important;"><section><span leaf="">3</span></section></td><td data-colwidth="417.35px" width="417.35px" style="border: 1px solid rgb(222, 226, 230);box-sizing: border-box;padding: 5px 10px;"><span style="font-size: 20px;"><strong><span leaf="">技术实现</span></strong></span></td></tr></tbody></table>#      php脚本  
  
  
#   
  
#      重点在php脚本的这一行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/op0UsH3vuJ0ZoZsan4ibaibSEcu2JwrQcTNFGqc0FpKQlB10bwVpfjm6K24yyCRXoE0gTw8CIaZsygD3HfHoqSNKeS0I3icaqt20Aib65UKdItY/640?wx_fmt=png&from=appmsg "")  
  
## jquery.terminal 格式码  
  
  
##   
  
     jquery.terminal 支持一种类似 BBCode 的内联格式化语法：  
```
[[b;color;background]Bold colored text][[!;;;;url]{Display text}]
```  
  
    关键语法字符是 [ ] ; ! :  
 ——全部不在 noxss()  
 的转义范围内。  
  
    当 term.echo()  
 接收  
到包含这些格式码的字符串  
时，jquery.terminal 会将其**解析并渲染为 HTML DOM 元素**  
。特别是链接格式码：  
```
[[!;;;;javascript:void(...)]{Click me}]
```  
  
会被渲染为：  
```
<a href="javascript:void(require(`child_process`).exec(`calc.exe`))">Click me</a>
```  
  
****  
  
**这就绕过了 HTML 层面的 XSS 防御，因为恶意内容从来没有以 HTML 标签的形式出现过——它是以 jquery.terminal 格式码的形式注入，由库自身转换为 DOM**  
  
****<table><tbody><tr><td data-colwidth="45.65px" width="45.65px" style="text-align: center;font-size: 16px;color: rgb(220, 53, 69);border: 1px solid rgb(222, 226, 230);flex: 0 0 10%;box-sizing: border-box;padding: 5px 10px;max-width: 10% !important;"><section><span leaf="">4</span></section></td><td data-colwidth="417.35px" width="417.35px" style="border: 1px solid rgb(222, 226, 230);box-sizing: border-box;padding: 5px 10px;"><span style="font-size: 20px;"><b><span leaf="">涉及代码位置</span></b></span></td></tr></tbody></table>#   
<table><tbody><tr style="height: 33px;"><td colspan="2" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">文件</span></p></td><td style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">说明</span></p></td></tr><tr style="height: 33px;"><td colspan="2" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">source/app.entry.js</span></p></td><td style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">noxss()</span><span leaf=""> 函数定义，过滤逻辑</span></p></td></tr><tr style="height: 33px;"><td colspan="2" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">source/modules/terminal/index.js</span></p></td><td style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">term.echo(antSword.noxss(output, false))</span><span leaf="">，终端输出</span></p></td></tr><tr style="height: 33px;"><td colspan="2" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">source/modules/terminal/index.js</span></p></td><td style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">Banner 中同样使用 </span><span leaf="">noxss</span><span leaf=""> 包裹系统信息</span></p></td></tr><tr style="height: 33px;"><td colspan="2" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">app.js</span></p></td><td style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">nodeIntegration: true</span><span leaf="">，RCE 的根本条件</span></p></td></tr></tbody></table>#   
<table><tbody><tr><td data-colwidth="45.65px" width="45.65px" style="text-align: center;font-size: 16px;color: rgb(220, 53, 69);border: 1px solid rgb(222, 226, 230);flex: 0 0 10%;box-sizing: border-box;padding: 5px 10px;max-width: 10% !important;"><section><span leaf="">5</span></section></td><td data-colwidth="417.35px" width="417.35px" style="border: 1px solid rgb(222, 226, 230);box-sizing: border-box;padding: 5px 10px;"><span style="font-size: 20px;"><strong><span leaf="">总结</span></strong></span></td></tr></tbody></table>  
  
    这是一个典型的**过滤策略与解析器不匹配**  
导致的安全问题。noxss()  
 只考虑了 HTML 实体编码，却忽略了上层富文本格式码的语法字符。再加上 Electron nodeIntegration: true  
 的危险配置，使得原本只是一个 XSS 的问题直接升级为 **RCE**  
。这也提醒开发者：在 Electron 应用中，XSS 不等于“只是弹个框”，在 nodeIntegration  
 开启的情况下，XSS 就等于拿到了系统的 shell  
  
  
**因 PHP 脚本篇幅较长，需复现该漏洞的师傅，后台回复【AntSword】即可获取完整脚本**  
  
  
# three安全之路圈子介绍  
  
**three安全****纷传圈子****+toposcan一年工具+three安全****漏洞库****+thre安全****面试题库****简单介绍+圈子交流群****（****加入纷传圈子送toposcan工具+漏洞库+面试题库+内部群****）**  
                          
  
如果觉得合适可以加入,圈子目前价格**39.9**  
元，首批送9.9优惠价，价格只会根据圈子内容和圈子人数进行上调，不会下跌。。。    
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ1POF6UkcRx8YkmZibu5yPCLz1SDYqTqXibzIlsm5GJTKHkASQZgHlf5tQnbfqhmyFtYfKswmc11KBmOr72kB0XpPqa0auBxw5nQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/op0UsH3vuJ3JOJibHobGqibDZibmd0M8mtgcD099qfbfI9fqs5d5NN3ILichWianGjeFBfwGqxm0qMmFy6xheswo6ZAApqXcKmY5jSicwtfvHVkSo/640?wx_fmt=png&from=appmsg "")  
  
  
**后台回复【小圈子】获得优惠卷**  
  
  
