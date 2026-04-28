#  红队神器｜Vue 站点未授权漏洞一键挖掘，这款插件太好用了  
 黑白之道   2026-04-28 01:35  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
在日常渗透测试和 SRC 挖洞中，**Vue 框架站点**  
经常让人头疼：前端路由守卫拦着、权限判断藏在 meta 里、后台路径不翻源码根本找不到，手动测试又慢又容易漏。  
  
今天给大家推荐一款**红队专用浏览器插件 ——VueCrack**  
，专门针对 Vue.js 站点做路由分析与权限绕过，能帮你快速发现隐藏页面和未授权访问漏洞，实战非常稳。  
  
  
**插件是干嘛的？**  
  
简单说，它就是 **Vue 站点的 “权限破拆工具”**  
。很多 Vue 项目只在前端做权限控制，后端校验缺失，只要绕过路由守卫，就能直接访问管理后台、用户列表、配置页等敏感路径。  
  
VueCrack 把这套逻辑做成浏览器插件，方便一键操作，大幅提升挖洞效率。  
  
**插件核心功能**  
- 自动识别Vue框架：  
打开网站点一下插件，立刻判断是不是 Vue+VueRouter 架构。  
  
- 一键清除路由守卫：  
自动干掉beforeEach  
等拦截逻辑，不再被弹窗、跳转挡住。  
  
- 批量修改鉴权字段：  
递归扫描路由表，把auth: true  
这类权限标记直接改掉，实现前端无权限访问。  
  
- 提取全部路由（含隐藏路由）：  
直接从内存里扒路由表，很多不显示在菜单里的后台路径都能揪出来。  
  
- 批量打开/复制路径：  
发现的路由一键复制、一键打开，批量测试未授权访问超省心。  
  
**怎么安装使用（超简单）**  
1. 去 GitHub 下载插件源码 / 安装包  
  
1. 打开 Chrome 浏览器，进入chrome://extensions/  
  
1. 开启 “开发者模式”，加载已解压的扩展程序  
  
1. 访问 Vue 站点，点击插件图标即可使用  
  
打开插件后，你会看到当前站点所有路由列表，直接点 “打开” 逐个访问，大概率能碰到未授权漏洞。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/zqnzfCSS1kDP61RuUw3jfjmwggX8J9PRnNtuP5MyMCyFms6gyYorWiaOVpEdYib7PfA0bcwPfJrwDoRibt1jS0HFoJ39UJLtoYVHZOtT8US3B0/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&watermark=1#imgIndex=0 "")  
  
**适合谁用？**  
- 渗透测试 / 红队工程师  
  
- SRC 漏洞挖掘爱好者  
  
- 前端安全审计人员  
  
- 想快速测 Vue 权限问题的安全从业者  
  
**下载地址**  
  
原版：VueCrack（Ad1euDa1e 维护）  
  
https://github.com/Ad1euDa1e/VueCrack  
  
增强版：VueCrack-Plus（基于原版优化扩展）  
  
https://github.com/kk12-30/VueCrack-Plus  
  
> **文章来源：Hack分享吧**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
