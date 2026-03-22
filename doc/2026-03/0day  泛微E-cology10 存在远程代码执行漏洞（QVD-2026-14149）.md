#  0day | 泛微E-cology10 存在远程代码执行漏洞（QVD-2026-14149）  
 实战安全研究   2026-03-22 01:01  
  
**免责声明**  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><td valign="top" style="-webkit-tap-highlight-color: transparent;outline: 0px;word-break: break-all;hyphens: auto;visibility: visible;"><span style="color: rgb(255, 0, 0);letter-spacing: 0.544px;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);outline: 0px;visibility: visible;font-size: 14px;"><span leaf="">本文仅用于技术学习和安全研究，请勿使用本文所提供的内容及相关技术从事非法活动，由于传播和利用此文所提供的内容或工具而造成任何直接或间接的损失后果，均由使用者本人承担，所产生一切不良后果与文章作者及本账号无关。如内容有争议或侵权，请私信我们！我们会立即删除并致歉。谢谢！</span></span></td></tr></tbody></table>  
1  
  
**漏洞描述**  
  
  
  
泛微  
 E-cology10（简称 E10）是上海泛微网络科技推出的面向中大型组织的数智化协同运营平台，定位为企业级数字化中枢，核心覆盖协同办公、流程管理、业务集成、知识管理、低代码开发等全场景能力。  
泛微E-cology10 存在远程代码执行漏洞（QVD-2026-14149），攻击者可无需认证，通过向特定接口发送恶意请求的方式触发漏洞，进而在目标服务器上执行任意代码，完全控制目标服务器，造成服务器沦陷及敏感数据泄露。  
  
2  
  
**影响版本**  
  
  
  
E-cology10.0 && 安全补丁版本 < v20260312  
  
3  
  
**测绘语法**  
  
  
  
fofa语法  
```
icon_hash="-1619753057"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtopLnYyicY1Xu2b00q6w9jwGhIhJ5BE9h5DYPrxsgc9sbGjsj8Xlt0uSAYOTibXzfuX4dlZQox0hW1cXs6TCQ1NXxkyibxOg1RlU3A/640?wx_fmt=png&from=appmsg "")  
  
  
4  
  
**漏洞复现**  
  
  
  
执行命令  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtopZyVriaBCXfo3WOuricXv8dSrpcOapD3gzoAXibPJ8U5vppQ95TibVYfwXqf9hDJpOdMBmYbG1J5ibW2Fg7F6HgRMGp3q1ctSpMLfI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtor2w9Z2ic8WIlictRys1kkoZV0RK3Kgqxkmiab6O9EDmEj92ibQeBOZOfkydoWZKVSsrtpOdtZRGhYGtjJvZFeTN7Mia8UV4Q2AU93k/640?wx_fmt=png&from=appmsg "")  
  
  
5  
  
**检测POC**  
  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtopK9deoaK4xmhQx4vn7d83ibhciblshxibyjkKofUoN1F3XhtrDibQqwEOEssicVR6zQHWehxTYKPFSr87c6GxbFa2ricxXj6ibHeGNicI/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtoqB2v4icXyhbkcKO2XF6O1tUPfag3lDtSaCJiaE5QVcb6icxGBLfsR02CoMDpxNZE8ocoBoBSx8ALiaUNVWvAZI5k0zhNYPraGznFk/640?wx_fmt=png&from=appmsg "")  
  
  
6  
  
**漏洞修复**  
  
  
1、建议联系厂商打补丁或升级版本。  
  
2、增加Web应用防火墙防护。  
  
3、关闭互联网暴露面或接口设置访问权限。  
  
7  
  
**内部圈子**  
  
  
**现在已更新POC数量 2100+（中危以上）**  
  
  
🔥 **1day/Nday 漏洞实战圈上线**  
 🔥  
  
还在到处找公开漏洞 POC？  
  
这里专注整合全网公开1day/Nday漏洞POC和复现，一站式解决你的痛点！  
  
🔍   
圈子福利  
  
✅ 整合全网 1day/Nday 漏洞POC，附带复现步骤，新手也能快速上手  
  
✅ 每周更新 10-15 个POC测试脚本，经过实测验证，到手就能用  
  
✅ 完美适配 Nuclei/Afrog 扫描工具，脚本无需额外修改，即拿即用  
  
✅ 重磅福利：免登录免费 FOFA 查询，无需账号也能高效资产测绘  
  
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
）。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/yIciaKAicYtor8hxFgQq4NCg7aufAWfaeLz1yd8HwEzaBBNfWx4TY4X2b4KYNKEuvV6kmOVJvy5hnhmxSXKQa9t7xGRquGMK72A8AHBWVYkdY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
