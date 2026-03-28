#  瑞斯康达Raisecom智能网关 list_base_config 远程命令执行漏洞  
原创 Caigensec
                    Caigensec  菜根网络安全杂谈   2026-03-28 02:20  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/GagrLP56FibVwx4hfFezZXyhDATCQtibMyLqTzMlb8DXuhXPvQ2pwyG7UsYv9As6Ujffp9g7wiaDVBNo4ncIghIkA/640 "")  
  
点击上方  
蓝字  
关注我们  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Rw1GYXElC3fsz3fQsXSqeO7MgiamgBtBjFwpXTXJkafnVYDcxTe2VibnQPWsmZnoiaLeOzRqf8pgRsA8d7gsEMDhQ/640 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ick6R1E3YokGa1ibCe5rpdRyAoBRvrYqueA3wY9CwYuRkqG2lE5MctQus6KVY2uic2Kj03Cf6xiaQHzOjibL8QJTomw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Sg02xflJ62rdxefX9thdaL8hxJWicY1vPlEmzNIWcBy2ypXTggHXX9e0kFDEVicficwTDdlLHLNrh6ica1SEvMqKeQ/640?wx_fmt=gif "")  
  
免责声明：本文仅用于合法范围的学习交流，若使用者将本文用于非法目的或违反相关法律法规的行为，一切责任由使用者自行承担。请遵守相关法律法规，勿做违法行为！  
  
01  
  
漏洞描述   
  
![](https://mmbiz.qpic.cn/mmbiz_png/1BiahkUNKiclteCuCXiaCW4UMxvnLW4rTb6NTKnUoGsLbztIoJUj2t9ttkcdhm6ryDTH9k9b8uyl7Tj9Rf3PaWMYA/640 "")  
  
Raisecom智能网关是瑞斯康达公司面向中小企业及行业分支机构推出的新一代语音融合接入型网络产品。该产品集数据、语音、安全、无线等功能于一体，能够为用户提供一个综合、完整的网络接入解决方案。其接口list_base_  
config_php  
存在远程命令执行漏洞，攻击者可通过该漏洞执行系统命令，控制服务器。  
  
  
02  
  
资产测绘  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1BiahkUNKiclteCuCXiaCW4UMxvnLW4rTb6NTKnUoGsLbztIoJUj2t9ttkcdhm6ryDTH9k9b8uyl7Tj9Rf3PaWMYA/640 "")  
  
FOFA：  
  
body="oForm.user_name.value"  
  
body="/images/raisecom/back.gif"   
  
 title="Web user login"  
  
  
03  
  
