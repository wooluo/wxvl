#  Vercel 被黑！  
 黑极客hijackY   2026-04-20 03:01  
  
供应链攻击越来越多了，防不胜防啊...  
  
![](https://mmbiz.qpic.cn/mmbiz_png/09BdCqGwDFXiaOvYHam4drDWujiaFib7IIpKEv6pqHZsRd07BokvSbibPsK3KJ0oEN95F0WdZGTNoTn7fblTFjo60CyYooVbaMD4zyGXOdI6afk/640?wx_fmt=png&from=appmsg "")  
  
这一事件的起因是，Vercel的一名员工使用的第三方AI工具Context.ai被黑客攻破。黑客利用这一漏洞，控制了该员工的Vercel Google Workspace账户。这样一来，黑客就能够访问那些未被标记为“敏感信息”的Vercel环境及相关环境变量。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/09BdCqGwDFVTxXXiaic09jjGibsjHSLlxrGa8WvAn1LGvxsCzFPwiaoHmaq7TeGz9P1mCO20aDwQHh3vQ4vnGZWQ4VU0xnhppdoiar5ibgve3saWE/640?wx_fmt=png&from=appmsg "")  
  
如果你是vercel的用户，建议：  
1. 定期检查账户和各环境中的操作记录，查看是否有可疑活动。您可以通过控制台或命令行工具来查看操作记录。  
  
1. 定期审查并更换环境变量中的敏感信息。如果某些环境变量中包含未标记为敏感信息的秘密信息（如 API 密钥、令牌、数据库凭证、签名密钥等），则应将这些信息视为可能已被泄露的敏感数据，并优先进行更换。  
  
1. 尽量使用“敏感环境变量”功能，从而确保这些敏感信息不会被轻易读取。  
  
1. 检查最近的部署记录，看看是否有异常或可疑的部署行为。如有疑问，请立即删除相关部署。  
  
1. 确保“部署保护”设置至少处于“标准”级别。  
  
1. 如果已启用“部署保护”功能，请定期更换相关令牌。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/09BdCqGwDFVQpicTGv6hmWx2nURg8kU4stNQW9ficxRoLkjibG8zTFNFZc9vYiaQVC6k8lZUTOicMoPwmibX0WxzTPMEGiagM7ZqGR7W0LHfO9x6B0/640?wx_fmt=png&from=appmsg "")  
  
  
如何排查你的Google workspace有没有被投毒：  
  
操作步骤如下：  
  
1. 访问 http://admin.google.com  
  
2. 进入“安全”选项卡，然后选择“访问与数据控制”→“API控制”→“应用访问控制”→“管理第三方应用访问权限”  
  
3. 搜索对应的客户端ID：110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj  
  
如果找到该客户端ID，则将其撤销/屏蔽即可。  
  
  
  
Indicators of compromise (IOCs)  
  
OAuth App:  
  
110671459871-30f1spbu0hptbs60cb4vsmv79i7bbvqj.apps.googleusercontent.com  
###   
  
