#  突发！一条命令 github.com 被黑！RCE Made By AI！  
原创 一个不正经的黑客
                    一个不正经的黑客  一个不正经的黑客   2026-04-29 07:58  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ZR7I3n4aibmpyJwEYGXxDcWia5lobEiaZkcPAqwRwRXf4KWhbPwZAchpkM2CY6p0gRibw2ibic6TKKR9rFzNtCIvNqGfGhsTXRS0rd86ySiaq4j4VQ/640?from=appmsg "")  
  
先说结论  
  
  
  
这是一个“  
用户输入污染内部可信协议”的漏洞。  
  
  
表面入口只是标准的 git push -o  
 参数，但它被错误地拼接进内部 X-Stat  
 header；  
  
  
由于  
内部协议缺少转义、字段重复允许覆盖、下游服务又完全信任该 header，攻击者就能把普通用户输入升级成  
内部安全配置控制权  
。  
  
  
最后经过一系列  
基础设施的原语组合利用实现RCE！  
  
  
整个链路从黑白盒角度来看并不复杂，甚至漏洞作者提到：当下有AI加持，挖掘到此漏洞的难度已大大降低！  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR1bC2cUoCibicxEzR7g74aDUU5ToNwOl0dPky9Xf374dMVSPNNH8QvNxzGoY1ia721zv1qjDeuObbvnFjT9FT9QibuKVeP9rO6OR4s/640?wx_fmt=png&from=appmsg "")  
  
  
GitHub 内部 Git 基础架构中存在一个严重漏洞 (CVE-2026-3854)，该漏洞可能影响 GitHub.com 和 GitHub Enterprise Server。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR2rBibiacoficerWKAwavibkVmz6hKSM07z0sswAwYOoicTGTlibd4dGMsz5TlNnAia33mhnFs0PH8CEjuSGYG8lJtpY0tT9N0XCkpZZ4/640?wx_fmt=png&from=appmsg "")  
  
  
通过利用 GitHub 内部协议中的注入漏洞，任何已认证的用户只需  
git push使用一个标准的 Git 客户端，即可通过一条命令在 GitHub 的后端服务器上执行任意命令。  
  
  
值得注意的是，这是首批利用人工智能技术在闭源二进制文件中发现的严重漏洞之一，凸显了此类漏洞识别方式的转变。  
  
  
尽管底层系统十分复杂，但该漏洞却极易被利用。  
  
  
在 GitHub.com 上，该漏洞允许在共享存储节点上执行远程代码。  
  
  
当前已确认，受影响节点上数百万个属于其他用户和组织的公共和私有代码库均可被访问。  
  
  
在 GitHub Enterprise Server 上，同样的漏洞会导致服务器完全被攻破，包括访问所有托管代码库和内部机密信息。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR05oGhzVBHg3KCOlpXsv9TSkoFoUibLGw6RINQgGjnebqPdqmEQpaHyB9ZTt60K1tuG3C7GNO11RBt5E2RRU8o4mpRSJMJ8mBGw/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/x1z5JzuXicnZT3rSDSSLCicw5Ma7CA6vDv0Gum5LSmCxAoXeZWWYeZNeqkSMjv7lLLHxvy5tZ3ZUDMesBtmgPJkozPrU8vIAgpian2N0tRjbk8/640?from=appmsg "")  
  
  
目前，Github官方已经确认并修复此漏洞，并且支付最高额的赏金💰！  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR2SJv9M0yOlI7eRq91sLHRKeN8MiaQpsuIzoK7Oia4ngNrXqKGmia9FZZRe0rr72lpfYTUOfHxx52zr4Q2kRxFmCjgWGGj1ibot9RU/640?wx_fmt=png&from=appmsg "")  
  
  
值得庆幸的事是，Github官方通过查询遥测日志历史，确认此漏洞没有被外部提前发现和利用。  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/VugQCN2riaR1btFEHghYASoomKCuq8zp5sNo0bz4hUNrRI9eurfbceMawe4fcSia8YxSnNIDQmRBYISzhkfUnM66RamvGjBAm08cpoTQcRgxM/640?wx_fmt=png&from=appmsg "")  
  
  
此漏洞由wiz发现，已公开漏洞详情（点击跳转原文直达）：  
  
https://www.wiz.io/blog/github-rce-vulnerability-cve-2026-3854  
  
github 官方公告：  
  
https://github.blog/security/securing-the-git-push-pipeline-responding-to-a-critical-remote-code-execution-vulnerability/  
  
  
喜欢就  
关注  
哦  
  
![](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR0UzVqO10taaoiaXP33ZyEU259sh6CeZfmeagwb3huRVQQPqGqdaUMuOoqt6hxdbe7N1FPG1YOfQPFTXmCriamiaezFjvXUyWmx7s/640?wx_fmt=png&from=appmsg "")  
  
  
动动小手点个  
赞  
  
![](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR1I2kTYERQibcN5KTrEBO2EUgrBhsEAuesZmsobBQrnAGNiaWA9qaniamwiaIvricwGJzKicAUZJh9ia2seWpLrR0mZoWbQVfibMv3ibdJk/640?wx_fmt=png&from=appmsg "")  
  
  
点  
在看  
最好看  
  
![](https://mmbiz.qpic.cn/mmbiz_png/VugQCN2riaR1vtCP4iafJyGOwkY56GiczCNhP37zDNcydicSvcWPibtRM9NacDImqde9keuG6MFhBcjb5QBH1xbqBSduSoHg6gsg9TIqicibFsnFMc/640?wx_fmt=png&from=appmsg "")  
  
  
