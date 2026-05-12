#  漏洞复现 | 大蚂蚁 (BigAnt) 即时通讯系统 moveDept 存在SQL注入漏洞  
 实战安全研究   2026-05-12 02:00  
  
**免责声明**  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><td valign="top" style="-webkit-tap-highlight-color: transparent;outline: 0px;word-break: break-all;hyphens: auto;visibility: visible;"><span style="color: rgb(255, 0, 0);letter-spacing: 0.544px;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);outline: 0px;visibility: visible;font-size: 14px;"><span leaf="">本文仅用于技术学习和安全研究，请勿使用本文所提供的内容及相关技术从事非法活动，由于传播和利用此文所提供的内容或工具而造成任何直接或间接的损失后果，均由使用者本人承担，所产生一切不良后果与文章作者及本账号无关。如内容有争议或侵权，请私信我们！我们会立即删除并致歉。谢谢！</span></span></td></tr></tbody></table>  
1  
  
**漏洞描述**  
  
  
  
杭州九麒科技大蚂蚁 (BigAnt) 即时通讯系统是一款企业级IM通信管理系统，提供多种功能支持。该系统的 \Api\Controller\DeptController::moveDept 接口存在SQL注入漏洞，攻击者可通过在 moveDept 功能的相关参数中插入恶意构造的 SQL 查询语句，实现对后端数据库的非法操作，可能导致敏感信息泄露、数据篡改、绕过身份验证，甚至在特定配置下实现任意命令执行或获取系统控制权限。  
  
2  
  
**影响版本**  
  
  
  
   
杭州九麒科技大蚂蚁 (BigAnt) 即时通讯系统  
  
3  
  
**测绘语法**  
  
  
  
fofa语法  
```
(body="/Public/static/admin/admin_common.js" && body="/Public/lang/zh-cn.js.js") || title="即时通讯 系统登录" && body="/Public/static/ukey/Syunew3.js"
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/yIciaKAicYtor0ODr0hOnYmpabgiciaeHMQutX6fGUZykN0yzgAvcNHMiaypiaE5vIWXoL0O2RBXWGicPWITepTcOj62h3nO9hoCuGqlRiaibhI21xIM/640?wx_fmt=png&from=appmsg "")  
  
  
4  
  
**漏洞复现**  
  
  
  
获取  
authen  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtoqoNAEjhMCX7mjmM9JFukVhwJ7iau7QAiaRgQvjSvmVRSwYibm6ILQZqKnKy7lBUIgXVE3ibsHAvameHvtJWs1jicTqN9HlmSuTAFoU/640?wx_fmt=png&from=appmsg "")  
  
注入  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtopMCib7xrYevssmAW0YFKBDqujBamyqsnoRUic8ITaTcYamicvWo5P0ZdgFSqZZWVvCb5Vo5yY8ryyYmDWjoTCxcjBso7HnocRAJ8/640?wx_fmt=png&from=appmsg "")  
  
  
5  
  
**检测POC**  
  
  
  
nuclei  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtopas3SDZlUvDBRN6LA6Wlr6nMDJyic1dPF4kkR62TZl8PqCNSJjd5ZqRXTshSu9St7SRwtaw5J66ib3M6vfcv4sbgtkjHOc3icRvk/640?wx_fmt=png&from=appmsg "")  
  
afrog  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/yIciaKAicYtoqyfiaiak5LKXWAEsGyTOz0IhnsU0HvFgOXOkY5Om7uSiaPDicRnqria8wibaATOjBCh8Xz8qH8vqHlicCGCdNIKl3hDeMFict8rKOy1QI/640?wx_fmt=png&from=appmsg "")  
  
  
6  
  
**漏洞修复**  
  
  
1、建议联系厂商打补丁或升级版本。  
  
2、增加Web应用防火墙防护。  
  
3、关闭互联网暴露面或接口设置访问权限。  
  
7  
  
**内部圈子**  
  
  
**现在已更新POC数量 2300+（中危以上）**  
  
🔥 **1day/Nday 漏洞实战圈上线**  
 🔥  
  
还在到处找公开漏洞 POC？  
  
这里专注整合全网公开1day/Nday漏洞POC和复现，一站式解决你的痛点！  
  
🔍   
圈子福利  
  
✅ 整合全网 1day/Nday 漏洞POC，附带复现步骤，新手也能快速上手  
  
✅ 每周更新 7-15 个POC测试脚本，经过实测验证，到手就能用  
  
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
  
目前圈子已满150人，价格由64.9调整为66.9元（  
交个朋友啦  
），200人后调整为69.9元。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/yIciaKAicYtoq2m23RRtN5eeDmvVrDbu9WiaNSNHQXQKICfd9ibekFKRXyrRibCKEU5ULmDCwsicOG1Dk4FAqvQ7R2M3KhUEsiapLLUQQj3nZ8v9QQ/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
