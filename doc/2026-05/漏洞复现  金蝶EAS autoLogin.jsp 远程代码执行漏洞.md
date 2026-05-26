#  漏洞复现 | 金蝶EAS autoLogin.jsp 远程代码执行漏洞  
 实战安全研究   2026-01-03 02:00  
  
**免责声明**  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><td rowspan="5" valign="top" style="-webkit-tap-highlight-color: transparent;outline: 0px;word-break: break-all;hyphens: auto;visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.544px;color: rgb(255, 0, 0);font-size: 14px;visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);letter-spacing: 0.544px;orphans: 4;text-align: left;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(255, 0, 0);letter-spacing: 0.544px;visibility: visible;"><span leaf="">本文仅用于技术学习使用，请勿使用本文所提供的内容及相关技术从事非法活动，由于传播、利用此文所提供的内容或工具而造成任何直接或者间接的后果及损失，均由使用者本人承担，所产生一切不良后果均与文章作者及本账号无关。如内容有争议或侵权，请私信我们！我们会立即删除并致歉。谢谢！</span></span></strong></strong></td></tr><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"></tr><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"></tr><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"></tr><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"></tr></tbody></table>  
1  
  
**漏洞描述**  
  
  
  
金蝶EAS autoLogin.jsp 路径存在远程代码执行漏洞，这一安全隐患使得攻击者能够趁机注入恶意代码，进而非法控制服务器，并实施包括数据窃取、网站篡改、服务器资源滥用等一系列恶意行为。  
  
2  
  
**影响版本**  
  
  
  
金蝶 EAS 8.0，8.1，8.2，8.5  
金  
蝶 EAS Cloud 8.6私有云/公有云，8.6.1，8.8  
  
3  
  
**fofa语法**  
  
  
  
fofa语法  
```
app="Kingdee-EAS"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zBdps5HcBF27VmLMoC1AnXER8GwASUolsVicywlVO5z76Bsu9FPIRoBsMWEXJX6zdtpibNyaYOoB7oLPxPajeBSg/640?wx_fmt=png&from=appmsg "")  
  
  
4  
  
**漏洞复现**  
  
  
  
curl dnslog  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zBdps5HcBF27VmLMoC1AnXER8GwASUolZ4KR1FJtzMv9jYjXSq1hXQaibTYRiaVRpwDHQ6q81S2A5BzuOrOJJrVQ/640?wx_fmt=png&from=appmsg "")  
  
收到请求  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zBdps5HcBF27VmLMoC1AnXER8GwASUolBZ1t4ncQFjpsfdo7V5vMO3c9Gd3caoOAAtPH3yeI6BWj9XibAZoQ28g/640?wx_fmt=png&from=appmsg "")  
  
  
5  
  
**检测POC**  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/zBdps5HcBF27VmLMoC1AnXER8GwASUolB1sLA92xnN3ibXgwnuIUhxgwpGibtsq5DcSQrDQ0oJkY2AB6O4t7XBQw/640?wx_fmt=png&from=appmsg "")  
  
  
6  
  
**漏洞修复**  
  
  
  
1、建议联系厂商打补丁或升级版本。  
  
2、增加Web应用防火墙防护。  
  
3、关闭互联网暴露面或接口设置访问权限  
  
7  
  
**内部圈子**  
  
  
  
**现在已更新POC数量 1400+（中危以上）**  
  
  
  
🔥 **1day/Nday 漏洞实战圈上线**  
 🔥  
  
还在到处找公开漏洞 POC？  
  
这里专注实战漏洞复现，一站式解决你的痛点！  
  
🔍   
圈子福利  
  
✅ 整合全网公开1day/Nday漏洞POC，附带复现步骤，新手也能快速上手  
  
✅ 每周更新 10-15 个POC测试脚本，经过实测验证，到手就能用  
  
✅ 完美适配Nuclei 主流扫描工具，脚本无需额外修改，即拿即用  
  
✅ 重磅福利：免登录免费 FOFA 查询，无需账号也能高效资产测绘  
  
✅ 专属权益：提供指纹识别库，指纹库持续更新  
  
💡   
适合对象  
  
渗透测试🔹攻防演练🔹安全运维🔹企业自查  
  
👉 不管你是企业安全自查的运维人员，或者是参加攻防演练的战队成员（红队/蓝队），还是做渗透测试的工程师等职业，这里的资源都能适合你  
  
⚠️   
重要提醒  
  
仅限授权范围内的合法安全测试，严禁用于未授权攻击行为！  
  
本服务为虚拟资源服务，一经购买概不退款，请按需谨慎购买！  
  
现在加入圈子价格是59.9元（  
交个朋友啦  
），后面将调整涨价。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zBdps5HcBF0LT7w2oQhicN1qEEeNOeXLqp8IMlibGQ0lWRN8WqYIibGTylFFvg1ib9cTGFXw8brIEuIsA7CZPuhaCA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
