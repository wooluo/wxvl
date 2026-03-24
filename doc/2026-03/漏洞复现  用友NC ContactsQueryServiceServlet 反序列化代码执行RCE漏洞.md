#  漏洞复现 | 用友NC ContactsQueryServiceServlet 反序列化代码执行RCE漏洞  
 实战安全研究   2026-03-24 02:22  
  
**免责声明**  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><td valign="top" style="-webkit-tap-highlight-color: transparent;outline: 0px;word-break: break-all;hyphens: auto;visibility: visible;"><span style="color: rgb(255, 0, 0);letter-spacing: 0.544px;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);outline: 0px;visibility: visible;font-size: 14px;"><span leaf="">本文仅用于技术学习和安全研究，请勿使用本文所提供的内容及相关技术从事非法活动，由于传播和利用此文所提供的内容或工具而造成任何直接或间接的损失后果，均由使用者本人承担，所产生一切不良后果与文章作者及本账号无关。如内容有争议或侵权，请私信我们！我们会立即删除并致歉。谢谢！</span></span></td></tr></tbody></table>  
1  
  
**漏洞描述**  
  
  
  
用友NC是用公司推出的一款企业管理软件，涵盖财务、供应链、生产制造等多个业务领域，旨在帮助企业实现信息化管理。用友NC的ContactsQueryServiceServlet组件存在反序列化漏洞。该Servlet在处理用户请求时，可能对接收到的序列化数据（如Java的ObjectInputStream）未进行安全检查，直接进行反序列化操作。  
未经身份攻击者可通过该漏洞在服务器端任意执行代码，写入后门，获取服务器权限，进而控制整个 web 服务器。  
  
2  
  
**影响版本**  
  
  
  
用友NC  
  
3  
  
**测绘语法**  
  
  
  
fofa语法  
```
app="用友-UFIDA-NC"
```  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtopLicictOfgScDGjgMia10Rn0L1yQ7BDCULPw9HXvspR3x9I3IZ4EC9ad3gSKOpsRbTuHtHB6W5KHoyxOcZS8143Gd7MiaSkIKB6to/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
  
4  
  
**漏洞复现**  
  
  
  
执行命令  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtoqxjqwu6m5Ogv2iap4fXibS9n2t4icGTEY3BibPwlSuW6usPfR6AwHic79IFfSNekhjmuzVHg7UkmyFJCibSoUcianEibh5JniaWIkJpPTg/640?wx_fmt=png&from=appmsg "")  
  
  
5  
  
**检测POC**  
  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtoradWOqx0iaoib5DwS6cvKu58XdfKOU6UrSy4NYbSOjsovuyYPJRyXTmU8RorIV6YMXqjxEics9fxpCjiasYOgd4nrbicbxkQujSFs0/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtoqlgG0K0Sa76AhxDeiboVx2N9wZOF0bP8I0HKbrQF5r3SO4XvTNPhNtuNBmcrwaErv5HLI23m2r5zCMdpoc9pDb50enNYhKBcM8/640?wx_fmt=png&from=appmsg "")  
  
  
6  
  
**漏洞修复**  
  
  
1、建议联系厂商打补丁或升级版本。  
  
2、增加Web应用防火墙防护。  
  
3、关闭互联网暴露面或接口设置访问权限。  
  
7  
  
**内部圈子**  
  
  
**现在已更新POC数量 2150+（中危以上）**  
  
  
🔥 **1day/Nday 漏洞实战圈上线**  
 🔥  
  
还在到处找公开漏洞 POC？  
  
这里专注整合全网公开1day/Nday漏洞POC和复现，一站式解决你的痛点！  
  
🔍   
圈子福利  
  
✅ 整合全网 1day/Nday 漏洞POC，附带复现步骤，新手也能快速上手  
  
✅ 每周更新 10-15 个POC测试脚本，经过实测验证，到手就能用  
  
✅ 完美适配 Nuclei/Afrog 扫描工具，脚本无需额外修改，即拿即用  
  
✅ 重磅福利：免费   
FOFA 高级会员  
查询，无需账号也能高效资产测绘  
  
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
）  
，150人后调整为66.9元。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/yIciaKAicYtor8hxFgQq4NCg7aufAWfaeLz1yd8HwEzaBBNfWx4TY4X2b4KYNKEuvV6kmOVJvy5hnhmxSXKQa9t7xGRquGMK72A8AHBWVYkdY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
