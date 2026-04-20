#  vercel前端AI自动化鼻祖被黑  
原创 王君
                    王君  网安守护   2026-04-20 07:36  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/gibHv0o062m026zLY0UiaVxyiasPqghLB83sBB6RxfSO0EakpkhFzWItCx3NKssee3NiaYvFp2YXic8icFOC44vyvwmDxZdQ9wwm95vVEGkZAH3s8/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/gibHv0o062m2H2ouibGAAibkxrrbnNBNp3DsfGzRBpoGBhj24f7A3wyyFBUUiaWiaYvVx7Rjre4wF0jtib7CJmYxY25DoK0Oa14UWpPqpdSGKKHNs/640?wx_fmt=jpeg "")  
  
Vercel 居然被黑了，就是那个做 Next.js 的公司，很多程序员用它来快速部署网站。  
  
  
黑客声称拿到了 Vercel 的内部数据库，包括员工账号、源代码、各种访问密钥等。他们把这些数据打包，在黑客论坛上，标价 200 万美元出售。  
  
  
最让人担心的不是数据库本身，而是他们拿到了 NPM 令牌 和 GitHub 令牌。  
  
  
而 Next.js 是目前最流行的前端框架之一，每周下载量高达 600 万次。如果黑客手里，真的有 NPM 令牌，他们就能偷偷往 Next js 里塞恶意代码，然后全世界几百万个用 Next js 做的网站和 App 就可能集体中招。  
  
  
这就是传说中的供应链攻击。  
  
  
不过 Vercel 官方声明，这只影响了一部分客户，服务还在正常运行，起因是一个第三方 AI 工具的 Google 账号被黑了，导致一位 Vercel 员工的账号，被入侵，进而拿到了内部权限。  
  
  
目前 Vercel 官方已经紧急建议所有用户，赶紧自检！  
  
