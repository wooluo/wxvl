#  【已复现】微信linux最新版RCE  
原创 金夏
                        金夏  金夏安全   2026-02-10 08:42  
  
免责声明  
  
本文仅用于技术学习和讨论。请勿使用本文所提供的内容及相关技术从事非法活动，由于传播、利用此文所提供的内容或工具而造成的任何直接或者间接的后果及损失，均由使用者本人负责，所产生的一切不良后果均与文章作者及本账号无关，本次测试仅供学习使用。如有内容争议或侵权，请及时私信我们！我们会立即删除并致歉。谢谢！  
  
  
**一、漏洞描述**  
  
微信 for Linux 在处理用户接收的文件时，当用户点击打开包含恶意命令的文件名时，由于对文件名中的特殊字符（如分号、反引号、$()、换行符等）未进行充分过滤和转义，直接将文件名拼接进shell命令中执行，导致攻击者可通过构造恶意的文件名实现任意命令执行。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Iv8D5nD32icLa6498SicK6ooFKFHmP5RlSbPrBlE6kxicb3VQXfQ4QM0s5IBnAHqcb8wpK24qINZsibxquXmiav6y29v1hSTLZxoBbMTTOc530p4/640?wx_fmt=png&from=appmsg "")  
  
下一个linux版本微信，然后创建带有`号包裹文件名，包裹里填自己想要执行的命令的文件，自己发给自己就行了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Iv8D5nD32icIeW12xeRptqfYBhfvaFWOGCNaLdDqSA0GGz8XRdUTpxRpEgL36LYwJz5E07dx3ib8GwtPTBAic4lr774PhiaZC3bqzrhr9ic6XJYw/640?wx_fmt=png&from=appmsg "")  
  
  
