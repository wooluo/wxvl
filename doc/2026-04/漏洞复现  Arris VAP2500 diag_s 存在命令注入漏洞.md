#  漏洞复现 | Arris VAP2500 diag_s 存在命令注入漏洞  
 实战安全研究   2026-04-06 01:01  
  
**免责声明**  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><td valign="top" style="-webkit-tap-highlight-color: transparent;outline: 0px;word-break: break-all;hyphens: auto;visibility: visible;"><span style="color: rgb(255, 0, 0);letter-spacing: 0.544px;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);outline: 0px;visibility: visible;font-size: 14px;"><span leaf="">本文仅用于技术学习和安全研究，请勿使用本文所提供的内容及相关技术从事非法活动，由于传播和利用此文所提供的内容或工具而造成任何直接或间接的损失后果，均由使用者本人承担，所产生一切不良后果与文章作者及本账号无关。如内容有争议或侵权，请私信我们！我们会立即删除并致歉。谢谢！</span></span></td></tr></tbody></table>  
1  
  
**漏洞描述**  
  
  
  
Arris VAP2500 diag_s 存在命令注入漏洞 diag_s.php处存在命令注入漏洞，未经身份攻击者可通过该漏洞在服务器端任意执行代码，写入后门，获取服务器权限，进而控制整个 web 服务器。  
  
2  
  
**影响版本**  
  
  
  
   
Arris VAP2500  
  
3  
  
**测绘语法**  
  
  
  
fofa语法  
```
body="CACHE-CONTROL" && body="/js/cookiecontrol.js"
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtopMMib22yfTYouSF376jnCdZB6KTkjMiaQpwP8jG9tMh3S8w0L2OL48Zkea42IwmUjFFV4BicB7XEUbKeNku8nLXyDIy5SibqVLTz8/640?wx_fmt=png&from=appmsg "")  
  
  
4  
  
**漏洞复现**  
  
  
  
写入文件  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtoplE2sbfSj9RaAJ6SJNssPOzenJsgC0sqn47nwopRiaA7eXMPDyvtibFeFGrxZAibgonXPD5bhnARbPWtCgpicYfqJpaT6NnFH6UmM/640?wx_fmt=png&from=appmsg "")  
  
访问文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtopgYYZFaWzHZM169ahausA57oSS9V3rxKFaV7jI71OiapJQ5Pn5zgOwWb11UYxRreF6qz3B2A0sXGY7tUf9UPK77TtDw5V8Wico0/640?wx_fmt=png&from=appmsg "")  
  
  
5  
  
**检测POC**  
  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtooQvbiaibJenEmXGWLkia2tZGCNO5cqgclDz1UN5Rgo5TaTWngdOS74vn28JKr54WShPtPicMiaur2b8z26mgN6eHu7A7V5k8iakWaVg/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtooHPKdCbT8mf89SZMEYNSugVTNE1F5Q6yuHA0FDYQq06f7p6hnRGsUYP21GdMD7uPeVsuHq06pXksPicLDZkJvicrfsob9U904ro/640?wx_fmt=png&from=appmsg "")  
  
  
6  
  
**漏洞修复**  
  
  
1、建议联系厂商打补丁或升级版本。  
  
2、增加Web应用防火墙防护。  
  
3、关闭互联网暴露面或接口设置访问权限。  
  
7  
  
**内部圈子**  
  
  
**现在已更新POC数量 2250+（中危以上）**  
  
  
🔥 **1day/Nday 漏洞实战圈上线**  
 🔥  
  
还在到处找公开漏洞 POC？  
  
这里专注整合全网公开1day/Nday漏洞POC和复现，一站式解决你的痛点！  
  
🔍   
圈子福利  
  
✅ 整合全网 1day/Nday 漏洞POC，附带复现步骤，新手也能快速上手  
  
✅ 每周更新 10-15 个POC测试脚本，经过实测验证，到手就能用  
  
✅ 完美适配 Nuclei/Afrog 扫描工具，脚本无需额外修改，即拿即用  
  
✅ 重磅福利：免费 FOFA 高级会员查询，无需账号也能高效资产测绘  
  
✅ 专属权益：提供指纹识别库，指纹库持续更新  
  
💡   
适合对象  
  
渗透测试🔹攻防演练🔹安全运维🔹企业自查  
🔹SRC漏洞挖掘  
  
⚠️   
重要提醒  
  
仅限授权范围内的合法安全测试，严禁用于未授权攻击行为！  
  
本服务为虚拟资源服务，一经购买概不退款，请按需谨慎购买！  
  
目前圈子已满100人，价格由59.9调整为64.9元（  
交个朋友啦  
），150人后调整为66.9元。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/yIciaKAicYtoq2LKleGia5Vf3N9OHAwsYdpabOVTTkhZ0VA2Rnfha6riad2eAJseVQeiaY9uyIGIDss54TNRyC4jXoecjrn9CQNAHAFbyVibY3HnI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
