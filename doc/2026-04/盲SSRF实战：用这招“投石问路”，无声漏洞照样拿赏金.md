#  盲SSRF实战：用这招“投石问路”，无声漏洞照样拿赏金  
原创 升斗安全XiuXiu
                    升斗安全XiuXiu  升斗安全   2026-04-27 23:55  
  
**【文章说明】**  
- **目的**  
：本文内容仅为网络安全**技术研究与教育**  
目的而创作。  
  
- **红线**  
：严禁将本文知识用于任何**未授权**  
的非法活动。使用者必须遵守《网络安全法》等相关法律。  
  
- **责任**  
：任何对本文技术的滥用所引发的**后果自负**  
，与本公众号及作者无关。  
  
- **免责**  
：内容仅供参考，作者不对其准确性、完整性作任何担保。  
  
**阅读即代表您同意以上条款。**  
  
****  
今天我们来分享一些关于“  
盲SSRF”的实战技巧，掌握这一招，能让你更好地理解这种漏洞的危害点和利用点。  
  
这招特别适合挖  
SSRF这种“  
盲”漏洞——页面不报错、不返回明显特征，根本看不出来服务器有没有发起请求。这时候，我们需要一个“收信地址”，让服务器主动来敲门。  
Burp Collaborator就是这个地址。  
  
实战拆解：四步走  
  
第一步：逮住请求  
  
正常使用目标功能，比如提交表单、导入链接、图片加载这些。Burp抓到请求后，右键直接“  
Send to Repeater”，把它扔进  
Repeater等着改。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGFRQD7Xx8tbyG3NpuHdXSVZSFAZL4KyfRMmBaop80ibgXVY6wXj6GgibkAooUe7LRXos8qiaL9YEjrC7gqbliaJ8Aw08Yao6tL2m04/640?wx_fmt=png&from=appmsg "")  
  
第二步：偷梁换柱  
  
在  
Repeater里找到  
Referer头（别的头也行，  
只要值是个URL的地方都值得试试），鼠标右键点它，菜单里选“  
Insert Collaborator Payload”。你会看到原本的域名一下子变成了  
Collaborator那个带随机串的地址。别犹豫，点“Send”把请求发出去。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qg1MKHx3jGGQJFUegC01XiaUkeAibjagOg4B7gAw4ODRdYic3VorFGOwP6acycHj5sGFm3CQicOuIoI0qmsI0jZVgSQyqIJiaKj5MHUnBibiaRKtib4/640?wx_fmt=png&from=appmsg "")  
  
第三步：等回铃  
  
切到Burp顶部的“  
Collaborator”标签页，点“  
Poll now”刷新。没反应？正常的。服务端很多操作是异步的，可能隔几秒、十几秒才处理。喝口水，再点一次。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/qg1MKHx3jGH0ibkdCJZ7uNMA8HI70HbhAUs3ziaXQ0Zh2bEkXeYWK1yaEPbvojGFBVHpOSyxficNpTOQUxpardl9PgCkcou41icicqKUIibNib5gXs/640?wx_fmt=png&from=appmsg "")  
  
第四步：看信号  
  
只要有DNS查询或者HTTP请求出现在列表里，恭喜——目标服务器按我们给的地址，主动发了请求，  
SSRF基本实锤。接下来就可以琢磨怎么扩大利用面了。  
  
说两句掏心窝的  
  
这法子不依赖页面返回，专门对付那些“闷声不响”的服务端请求。  
Referer只是其中一个常见注入点，像  
X-Forwarded-For、  
User-Agent、各种回调地址，都可以用同样套路挨个测。多试几个位置，往往有意外收获。  
  
觉得实用的话，点个 「在看」 让更多挖洞的兄弟看到。想学习更多赏金技巧、掌握最新漏洞线索，关注我，不定时更新更多挖洞姿势。  
  
  
