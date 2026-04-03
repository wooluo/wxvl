#  PolyShell高危漏洞可致电商Magento系统遭遇未授权远程代码执行  
胡金鱼
                    胡金鱼  嘶吼专业版   2026-04-03 06:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wpkib3J60o297rwgIksvLibPOwR24tqI8dGRUah80YoBLjTBJgws2n0ibdvfvv3CCm0MIOHTAgKicmOB4UHUJ1hH5g/640?wx_fmt=gif "")  
  
近期，一则名为“PolyShell”的高危新型漏洞被公开披露，该安全漏洞影响所有Magento开源版与Adobe Commerce 2系列稳定版电商系统，攻击者无需登录身份认证，即可远程执行恶意代码、窃取接管管理员账号权限。   
  
目前安全监测暂未捕获野外大规模实战挖矿勒索攻击，但Sansec紧急预警：完整漏洞攻击利用链已在地下黑产圈层流通扩散，自动化批量扫描爆破攻击或将很快全面爆发。   
  
Adobe官方虽已紧急推送安全修复补丁，但该补丁仅内嵌于2.4.9版本第二轮Alpha测试预览版，正式商用生产稳定版暂未迭代更新，全网大量在线运营商城仍处于高危未防护裸奔状态。  
  
Sansec补充说明，Adobe同步提供简易Web服务器防护配置模板，可大幅限制漏洞攻击危害扩散范围，但绝大多数中小企业商城均直接沿用云主机服务商默认一键建站配置，无自定义加固能力。  
  
据Sansec发布的分析报告表示：Magento电商平台REST API接口，在处理购物车商品自定义附加选项时，违规开放恶意文件上传高危权限。  
  
安全研究员拆解攻击原理：“当商品自定义选项设定为‘文件上传’类型时，系统会默认解析内嵌file_info数据包，自动解码Base64加密恶意文件载荷、识别伪造MIME资源类型、读取伪装文件名，最终直接落地写入服务器 pub/media/custom_options/quote/公开可访问目录。”  
  
本次高危漏洞命名“PolyShell”，核心特征为攻击者上传多格式兼容恶意文件，该文件既可伪装成常规图片绕过安全检测，又能解析执行后台恶意脚本后门。  
  
漏洞实际危害严重依赖服务器Web环境配置，通杀两大高危攻击链：轻则实现远程代码执行（RCE）接管服务器权限，重则植入存储型XSS恶意脚本劫持管理员后台会话Cookie，一键窃取全站账号权限，Sansec抽样全网监测显示，绝大多数商城默认配置均暴露上传目录高危风险。   
  
在Adobe正式推送商用生产版安全补丁前，安全研究员建议商城运维管理员立即落地三大临时应急加固防护措施：  
  
1. 严格限制封禁pub/media/custom_options/目录外网直接访问权限；  
  
2. 深度核查Nginx/Apache核心防护规则，确认目录拦截策略永久生效；  
  
3. 全盘深度扫描服务器目录，排查清除已上传恶意网页后门、木马挖矿程序及各类窃听恶意软件。  
  
参考及来源：  
https://www.bleepingcomputer.com/news/security/new-polyshell-flaw-allows-unauthenticated-rce-on-magento-e-stores/  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HJNX5ecKII5QZU5k8vpDbjhyIVb7o3GNdLAsGlFbYVmFchkPoJunVic0zeFJhnXRtkUAlhIibicUKUGnG3OAwySUHHrn9ncNPjJuA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HLsC5ekKZ6dZhY88cdlot4eDkBibOp3slUicLZ9flHxzic5852NCZoHz0jO2tKIeFQjkTh6oXYR5fvB2DRHmn8ZAib6Go1TWOOfNR4/640?wx_fmt=png&from=appmsg "")  
  
  
