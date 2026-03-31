#  VoidStealer恶意软件利用调试器漏洞窃取Chrome主密钥  
胡金鱼
                    胡金鱼  嘶吼专业版   2026-03-31 06:01  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/wpkib3J60o297rwgIksvLibPOwR24tqI8dGRUah80YoBLjTBJgws2n0ibdvfvv3CCm0MIOHTAgKicmOB4UHUJ1hH5g/640?wx_fmt=gif "")  
  
一款名为VoidStealer的窃密恶意软件采用新型攻击手段，绕过谷歌浏览器（Chrome）的应用程序绑定加密（ABE）防护机制，非法提取用于解密浏览器本地敏感数据的主密钥。   
  
这项全新破解技术隐蔽性极强，核心原理是利用硬件断点，直接从浏览器内存中读取明文状态的v20_master_key万能主密钥（同时负责加密与解密运算），全程无需权限提权或代码注入等高风险操作。  
  
诺顿、Avast、AVG、Avira等安全品牌母公司——Gen Digital发布专项安全报告证实，这是全球野外实战攻击中，首例采用该底层绕过机制的窃密恶意软件。  
  
谷歌于2024年6月发布的Chrome 127版本中，正式上线ABE应用绑定加密功能，专门防护浏览器Cookie缓存及各类核心敏感数据。该机制确保万能主密钥在磁盘中始终处于加密封存状态，普通用户权限无法直接读取还原。   
  
正常合法解密主密钥，必须依托系统最高权限运行的谷歌浏览器权限提升服务，严格校验请求进程身份后方可放行。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/fHEm7hZn9HLiam4pXGI9gicDEiaM1f6E2tAGeVLrGpiaibdN5tpC5I6wHdyaQlGBZnpkkgpcPbiaQsHf493CsGxyx6uvSmcEvE1fUJwE4LoLA9Lyo/640?wx_fmt=png&from=appmsg "")  
  
ABE如何阻止恶意软件概述  
  
但该防护体系此前已被多款窃密恶意软件家族成功绕过，甚至相关破解逻辑已公开开源工具化。尽管谷歌多次推送补丁迭代加固封堵旧漏洞，新型恶意软件仍能衍生新变种，持续绕过防护窃取密钥。   
  
Gen Digital威胁情报研究员表示：“VoidStealer是野外攻击中首个实战落地的窃密工具，创新依托调试器底层原理绕过ABE加密，精准调用硬件断点，直接从浏览器运行内存中dump读取v20_master_key万能主密钥。”   
  
据悉，VoidStealer属于恶意软件即服务（MaaS）黑产平台，最迟自2025年12月中旬起，已在暗网论坛公开售卖推广，其2.0版本正式新增这款全新ABE加密绕过高危机制。  
  
![图片18.png](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HIzrUdVBBvPxfIsKnXLB4FpnibrQJjpeJXynarsgEPlppsk3yjGlU7aLNYP3vjRdTUxYsrEa8zqTLG7ibbcXjia2w7KrfJsBhiaPnc/640?wx_fmt=png&from=appmsg "")  
  
网络犯罪分子在VoidStealer 2.0版本中宣传ABE绕过功能  
# 主密钥窃取攻击原理详解  
  
VoidStealer的核心破解漏洞逻辑，是精准捕捉浏览器解密运算瞬间：Chrome的v20_master_key会短暂以明文裸奔状态驻留内存，恶意软件精准卡位该极短时间窗口完成窃取。  
  
![图片19.png](https://mmbiz.qpic.cn/sz_mmbiz_png/fHEm7hZn9HLjInlBficwfUiaiakB9H5gD3dQS0CyIrW8gA6GNOnSNfkOaMFcWv5XgIZ7OrE6cC3rzhrlJnVLt7mGWWYsuLacoubfqC0fHrQp6w/640?wx_fmt=png&from=appmsg "")  
  
VoidStealer 的目标字符串  
  
具体攻击流程分为五步：  
  
1. 启动静默挂起、后台隐藏的浏览器进程，以调试器身份绑定注入目标进程；  
  
2. 静默等待浏览器核心动态链接库（chrome.dll/msedge.dll）加载完成；  
  
3. 检索库文件内特定特征字符串及寻址指令，锁定指令地址作为硬件断点触发靶点；  
  
4. 对当前所有运行线程及新建线程全局植入断点，静默监听浏览器启动解密流程；  
  
5. 断点触发瞬间读取寄存器密钥指针地址，调用内存读取接口直接dump明文万能主密钥。   
  
恶意软件最优攻击时机为浏览器开机冷启动阶段：此时程序会批量加载ABE加密防护Cookie缓存，强制触发主密钥解密运算，漏洞攻击成功率最高。   
  
该新型绕过技术并非VoidStealer原创开发，而是直接复刻开源项目ElevationKatz漏洞利用逻辑——该工具隶属ChromeKatz缓存导出套件，专门演示Chrome浏览器加密体系底层缺陷，开源上线至今已超一年。 两款工具代码虽存在少量微调差异，但核心攻击实现逻辑高度同源复用。  
  
参考及来源：  
https://www.bleepingcomputer.com/news/security/voidstealer-malware-steals-chrome-master-key-via-debugger-trick/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/fHEm7hZn9HIwl1Gc2WkpRlPETs2cwS27lK1pD7ZkAonLr5FjkTZdFx3dBWYSuksqHenJibA3icxqxU6zDk0pPsnjRdhMSsvPWN3cow9tvlSGY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/fHEm7hZn9HI26Lg97l0vIgJFFzQKqAl0Dz22qFoiac9rf7QUzY2f7fSXFz3aWKSMf7jtu0DicibyyibI1vkEEzxRgH0ibGPA0eUhTOoE4hh9lQ3I/640?wx_fmt=png&from=appmsg "")  
  
  
