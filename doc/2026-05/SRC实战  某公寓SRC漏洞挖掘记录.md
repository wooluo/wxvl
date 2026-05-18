#  SRC实战 | 某公寓SRC漏洞挖掘记录  
原创 安全艺术
                    安全艺术  安全艺术   2026-05-18 04:49  
  
年初找房子，发现之前住过的xx公寓，想起来之前挖过他们家的src，简单分享下。  
  
1、一个简单的模糊查询获得1000元赏金。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/6mEJuibtxKvMyP24IrwjicU43asJXwQqPqXs2UEmmM1mXUNtXZt0MIXTgVtJdfvom94WS1U7auBrPf9eApXxXuwIS85zia3cspm9HM1HQmYCo0/640?wx_fmt=png&from=appmsg "")  
  
根据中文名称遍历，需要将中文进行url编码下进行模糊查询，如模糊查询公司内容：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvMVcPC929agCSlxXpdaW6CD03q2wcghOwGkXIthbAibUU76rQfC00IQIn72RpxNzCfibTCEFS4Yriag6pPoA2mRpVKicKwtQVLaANs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvNuoXtW5AibtOeufrTMcpEDGYrF3PjZj36RlLjfuV8wiaXDoz0RhjqISKbW9icJtQibzZsCX1RhX1hBaN18fQ3nQSiaG0yJwCpqxzjQ/640?wx_fmt=png&from=appmsg "")  
  
2、开发票处存在水平越权，给了1800元。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvPRqO19yzOVXDticGEGuEqeCDDYM53Iz0K8NJkSjOtAZS1QSxvt3YXEEBRtzpxE6NGS0hUic3tic5fEiaSV2vCFBYTl2wwibyJSAcvA/640?wx_fmt=png&from=appmsg "")  
  
退房后开完发票，去app里点了点，就出洞了，简单的id遍历。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/6mEJuibtxKvMpw63fHcwPibwObQ6rotrSBO6nibicQ9yYun8r9LkrQJkSrPAst0ibc90MvOt5rqViaHzlF2Rep2bibiacIK0icKdqyn77lFoiaPfSuGp8/640?wx_fmt=png&from=appmsg "")  
  
  
