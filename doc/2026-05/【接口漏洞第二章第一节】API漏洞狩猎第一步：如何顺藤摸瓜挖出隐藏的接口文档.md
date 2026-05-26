#  【接口漏洞第二章第一节】API漏洞狩猎第一步：如何顺藤摸瓜挖出隐藏的接口文档  
 sec0nd安全   2026-01-02 12:47  
  
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
API 通常会被要求编写为文档，以便开发者了解如何使用并与它们进行集成。  
  
文档可以同时采用人类可读和机器可读的形式。人类可读的文档旨在帮助开发者理解如何使用 API，可能包含详细说明、示例和使用场景。机器可读的文档则设计为由软件处理，以自动化 API 集成和验证等任务，通常以 JSON 或 XML 等结构化格式编写。  
  
API 文档通常是公开可用的，特别是当 API 面向外部开发者时。如果是这种情况，建议在开展侦查（recon）时首先查阅相关文档。  
  
发现 API 文档  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VPUK6Jz75Q0tVJ6uy9qKVgVnia7bJyNdcNX8nT0UiaLuvsh631N5y6XIVRl3ZjMgsh2gkXb4ohMlPQ9wnj3OKQTw/640?wx_fmt=png&from=appmsg "")  
  
即使 API 文档未公开提供，我们仍可能通过浏览使用该 API 的应用程序来访问它。  
  
为此，我们可以使用 Burp Scanner 对 API 进行爬取。也可以使用 Burp 浏览器 手动浏览应用程序。寻找可能指向 API 文档的端点，例如：  
- /api  
  
- /swagger/index.html  
  
- /openapi.json  
  
如果发现某个资源的端点，请务必调查其基础路径。例如，如果识别出资源端点 /api/swagger/v1/users/123，则应检查以下路径：  
- /api/swagger/v1  
  
- /api/swagger  
  
- /api  
  
我们还可以使用 Intruder 配合常见路径列表来查找文档。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VPUK6Jz75Q0tVJ6uy9qKVgVnia7bJyNdcnhRofos8eZicz6vILq0GCYYia5JXwBHc5Z5heUJNtGiciaGMicte1RbDfNg/640?wx_fmt=png&from=appmsg "")  
  
了解了接口文档的简单内容和原理后，我们下一篇将结合实际场景来对api文档进行实际的发现及利用。想要系统学习关于  
api漏洞  
的小伙伴，别忘了点赞、收藏、关注。这边会循序渐进的进行内容输出。  
  
