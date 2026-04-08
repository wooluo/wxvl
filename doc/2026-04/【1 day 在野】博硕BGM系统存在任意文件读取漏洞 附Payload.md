#  【1 day 在野】博硕BGM系统存在任意文件读取漏洞 附Payload  
阿伟
                    阿伟  船山信安   2026-04-07 23:50  
  
**免责声明**  
  
由于传播、利用本公众号船山信安所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，公众号  
船山信安  
及作者不为此承担任何责任，一旦造成后果请自行承担！如有侵权烦请告知，我们会立即删除并致歉。谢谢！  
  
**一、漏洞描述**  
  
**博硕 BGM 系统是一个集销售管理、生产控制、原料管理、车辆调度、实验室管控、财务统计和智能物联网监控于一体的综合数字化管理平台。平台存在任意文件读取漏洞，接口通过path参数拼接文件路径实现文件下载功能，未对传入路径做合法性校验、权限控制及目录穿越过滤。攻击者可构造恶意请求，通过../目录穿越字符遍历服务器任意文件读取网站配置文件、系统敏感文件等核心数据。**  
  
**二、影响版本**  
  
**博硕BGM**  
  
**三、360Quake 语法**  
  
**body: "Libs/Platform.lib"**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dscLuiaicVquM0fwT1Sy0jAdCicI0YTqdVOKLAhQKXI1vlAlAFf0zBEu5xKhBdafHuDicImibRJuibUcIfntz2HnjcMM7CbPvN73ShmXFcKDQ22ZM/640?wx_fmt=png&from=appmsg "")  
  
**四、漏洞复现**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dscLuiaicVquN3FAAWFL3ZtM4VWjJpGoao7PicQpzTXpdIvVcve1GdYsrK2jFZ0SsAWic9vQae3Mibywc92o2KEMqicWZWccRzQbAKhtnuVEsOib9E/640?wx_fmt=png&from=appmsg "")  
  
**五、修复建议**  
  
**升级平台版本并应用安全补丁、取消接口中动态路径拼接机制或对可访问文件目录进行严格白名单限制、对文件路径参数进行合法性校验与目录穿越过滤、启用安全防护策略并开展全面安全审计、从源头消除安全隐患。**  
  
**六、payload获取**  
  
**后台回复20260408获取Payload**  
  
  
