#  记母校漏洞测试一次waf绕过经历  
 湘安无事   2026-03-30 16:06  
  
**免责声明**  
<table><tbody><tr><td data-colwidth="576"><section><span style="font-size:14px;"><span leaf="">本文仅用于网络安全技术学习与交流，</span><strong><span style="font-size: 13px;"><span leaf="">严禁将文中技术用于任何非法入侵、未授权测试、数据窃取等违法违规行为</span></span></strong><span leaf="">。因擅自使用本文内容进行非法操作、或传播本文所造成的一切法律责任与经济损失，均由使用者自行承担，与本公众号及作者无关。如有内容侵权，请及时联系我们处理</span></span></section></td></tr></tbody></table>  
**0x1前言**  
  
没测试过母校的人生是不完整的，今天的一个例子因为做了限制，没什么危害，只能证明有漏洞，就来浅浅的分享一下  
  
  
**0x2漏洞测试**  
  
微信里面找到一个电费查询的链接  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibejgItsDbuTB83Ukqlas5dziaqchw3n8W023yJwUuF8fKiaW7CVgq9klHnrvbBHkjqY4gZwQS9dvmzYteUgxxKvSDtQvTAliasd7U/640?from=appmsg "")  
  
  
点击用电查询  
  
![e80a5c84de76f7b16a372d793107e6ef.png](https://mmbiz.qpic.cn/mmbiz_png/kA6wmJJAxibfzrf20gzicLZD3vdT2uoyiaUG5AibXFK16qkL6hmX1lUOxlf3JDSoC50EUohhHPib4tGicXrmGxYY3nKsuBGiasW3nfHwDWo0HVyASw/640?from=appmsg "")  
  
  
来到这样一个界面  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibft3SuHF3L4H26RKYTck3kgl6bGrmtPblUmayIQWrQyQAPh4nPIAbEgGCVrgdRJ3SS2shHEpUyKAmyMRu3RTceRicgZL9tyBV7w/640?from=appmsg "")  
  
  
随便输入点什么开始抓包  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/kA6wmJJAxibe8XLW9ooRo34WLQqwXCTtZb7VBPJSSoPaib8r166SL9L2h1u9Bjnv3ZiaaarMSOKllmgwKot40NmbPytFBqY57nt4r3YibibF3Ma8/640?from=appmsg "")  
  
  
单引号报错，说明是有注入的  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibfXMxTbCCiag2micjEGQqzNjfKjibP0cmV6hguaBSiaC9YpKERNZdrHhfL4R8TzdIDqfjzLHukicLMzvyufMibLAIVsqpZ8EzAkq2qfU/640?from=appmsg "")  
  
  
我直接构造闭合，直接被拦了  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibeEaQ9BoPIcRPndG4aEGribR2iclIswOZQ4PS7lBJG3LpHc59TAgfmfv9nL77aariaIKiaPFUIIb0Jice4ZAkyhpIiaITJTVQZSqunrM/640?from=appmsg "")  
  
  
学校竟然偷偷上waf了  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibegfwlsicx5BNeuZYbcStWFauZn1J7ABqyRbssZa0UYZV8RtkUyWUBEsD51ZZk2Ww004ziawTO81jVd01FcD90ibpHBTicc4ct0RK8/640?from=appmsg "")  
  
  
遇事不决，我直接摇深情哥逆转大局  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibcBhsfkbqHAsBTRPr89vnibjibfDtnx8l0xQ4auLOZWYD2c7BGOFS45Iy6QLycxNIYmiahCzpVsG0yfv9q8iaHFHPth9k88ibwRTsPw/640?from=appmsg "")  
  
  
                            ![](https://mmbiz.qpic.cn/sz_mmbiz_gif/kA6wmJJAxibdhskHIq2ibryglokHoiaBtUbrVUs8vsqPM590sc9J9GH8bOHgDXzCsHOa4b6qnTPGUMhG3VgURW2icQ9XOwZng4SXgh3SjOgENmU/640?from=appmsg "")  
  
sqg一来把get改成post后直接不拦了  
  
哈哈，我真没招了，甜菜  
  
可以看到闭合成功后有正常回显  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibffOqBicUqOwbB71u6ElWOXKVImQ5XRiauib4b7VD4LEtECFKVMskCNNicDpRqChw7MPGicBF9MpBZ6hU29U4ibKS5vIACFBD8l90XTU/640?from=appmsg "")  
  
  
就在我要进一步的时候，又来一个奇怪的回显，不管后面加啥都空白了  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/kA6wmJJAxibcpRQS6Dibv1KE2WQsibOPqgf8qLb8dIOjoFWic52WIqjynaNDXMQEljpeMCg6icibbXVEVbbYxrRcibDueX0uHfTV3WhncwlKFBooxw/640?from=appmsg "")  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/kA6wmJJAxibdFaadOtVpEmQ3W59JULbvD0qpx6X4ibibQ78dw3eaclcRCorsJicibCYmkXOloLY4NE8E66zSadcLVxibeR8WWwkNcyhuz5O5CcAFY/640?from=appmsg "")  
  
  
这我注啥呀  
  
                                ![三角洲鼠鼠表情包 的图像结果](https://mmbiz.qpic.cn/mmbiz_jpg/kA6wmJJAxibdhVvEOibVCJcnKtlqhGPkQJ4ricBSibpzrY6qAicPDGicJIq3Ohm0vhYkdg4CyKBZYiccCWic5HRbiaqmGmYjJxmxBncjTel6icEeEpHm8/640?from=appmsg "")  
  
后面发现这个参数有字符数量限制，只能有10个字符  
  
超过这个字符回显一律变成空白，  
那要怎么证明危害呢，这毕竟要交edu的，遇事不决，摇深情哥  
  
从深情哥哪里学到了一个payload：  
'-user/1-'，这玩意刚好10个字符(被做局了)  
  
成功报错用户名称为dbo  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_png/kA6wmJJAxibf5v3HC4UImHNL9icicbyJaeyOuLicJVuzQxrBaw6HhE7k9nC3hEjrMEFX63GaGu5L1HnOvxHn7rxtEKIGHtE0xjE0TxSw1msicnib0/640?from=appmsg "")  
  
这个注入点只能用这个payload，这也是为什么我说他没啥危害的原因  
  
成功拿下高危3rank，最后还要感谢深情哥帮忙  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_png/kA6wmJJAxibdN1tH5vx44tk2jrLGFibQk3aKnXNnjYCejY1nIbc6oDybP8L6Bn4Xr0hvgWZ1H6Lc7bpFz0MsP8ibfoF3Hm8b36PXURjXayTdSs/640?from=appmsg "")  
  
  
                        ![](https://mmbiz.qpic.cn/mmbiz_gif/kA6wmJJAxibfcPO2wk2xmPp28NFMgq5pJgxnpVO0InRlquTIE0z2q6RnVPK9dKT32k6KhRtv5BWI8bUfzZ64uulZRPBYO05x7TKPck4Z6u6A/640?from=appmsg "")  
  
  
