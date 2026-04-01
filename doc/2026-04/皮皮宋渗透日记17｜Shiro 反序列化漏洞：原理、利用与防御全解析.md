#  皮皮宋渗透日记17｜Shiro 反序列化漏洞：原理、利用与防御全解析  
原创 皮皮宋
                    皮皮宋  皮皮宋渗透笔记   2026-04-01 02:07  
  
大家好，我是皮皮宋✨Shiro 反序列化漏洞是 Java 安全领域的经典高危漏洞，也是面试、渗透测试的高频考点。很多新手对 Shiro-550、Shiro-721 的区别、利用条件、防御方案一知半解，今天一次性讲透：从 RememberMe 原理到漏洞成因，从利用链到实战复现，从版本差异到企业级防御，看完直接拿捏！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3PxWhY8513bjU0p4MuLdNbDuia3jEKu6iaw5NH2lQER6BtDXncf1RNia8jr3AC9ZJicMZ8VfMmfNNsYQibSZMhg2LRY60DbSXxVhgWFxQ3DTAGdg/640?wx_fmt=png&from=appmsg "")  
# 一、前置知识：Shiro RememberMe 功能原理  
  
Apache Shiro 是 Java 生态最常用的权限控制框架，  
RememberMe「记住我」是其核心功能之一，用于实现用户免登录访问，完整流程如下：  
  
正常业务流程  
1. 用户登录：用户勾选「记住我」，输入账号密码完成认证  
  
1. 序列化用户信息：Shiro 将用户身份信息（如用户名、权限）序列化为字节流  
  
1. AES 加密：使用预设的 AES 密钥对序列化数据进行加密  
  
1. Base64 编码：将加密后的字节流做 Base64 编码，生成最终的rememberMeCookie  
  
1. 写入浏览器：将 Cookie 下发给用户浏览器，下次访问自动携带  
  
1. 服务端校验：用户再次访问时，Shiro 反向执行：Base64 解码 → AES 解密 → 反序列化，恢复用户对象，实现免登录  
  
核心风险点  
  
整个流程中，  
反序列化步骤是漏洞的核心入口：只要服务端对  
rememberMeCookie 执行反序列化，就会触发对象的  
readObject()方法，为恶意代码执行创造条件。  
# 二、Shiro-550（CVE-2016-4437）：经典硬编码密钥漏洞  
## 1. 漏洞核心成因  
  
Shiro 1.2.4 及更早版本中，  
AES 加密密钥是硬编码在源码中的默认密钥（经典密钥：  
kPH+bIxk5D2deZiIxcaaaA==），攻击者可直接获取该密钥，伪造恶意 Cookie。  
## 2. 攻击链路（核心流程图）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/3PxWhY8513YOcBNIp6ibsAJNHTlpiaHr2YX0toONYOelmzEDm4jo4FxlZ9PMc47RqT0r2zqiaDA4icicz4oiawGwJicicNxznvyjuiaahE159skBQzrU/640?wx_fmt=png&from=appmsg "")  
## 3. 关键细节拆解  
- 漏洞载体：rememberMeCookie，无需登录、无需权限，只要请求携带该 Cookie 即可触发  
  
- 利用链依赖：需要 CommonsCollections（CC）、CommonsBeanutils（CB）等 Gadget 链，配合反序列化执行命令  
  
- 影响版本：Shiro ≤ 1.2.4  
  
- 核心特征：固定硬编码密钥，攻击者可直接构造加密 Payload，利用门槛极低  
  
# 三、Shiro-550 vs Shiro-721：核心区别速查表  
  
很多人容易混淆两个漏洞，一张表讲清本质差异：  
<table><thead><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><th data-colwidth="100" style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">维度</span></section></th><th style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">Shiro-550（CVE-2016-4437）</span></section></th><th style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">Shiro-721</span></section></th></tr></thead><tbody><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">密钥特征</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">固定硬编码默认密钥（24 位经典密钥）</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">随机动态密钥（用户自定义）</span></section></td></tr><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">加密方式</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">AES-CBC 模式，固定 IV</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">AES-GCM 模式，随机 IV</span></section></td></tr><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">利用条件</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">已知默认密钥，直接构造 Payload</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">需获取 / 爆破密钥，或绕过密钥校验</span></section></td></tr><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">影响版本</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">Shiro ≤ 1.2.4</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">Shiro 1.2.5+（修复默认密钥后）</span></section></td></tr><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">利用难度</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">极低，工具一键打</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">较高，需额外获取密钥</span></section></td></tr><tr style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-row;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><td data-colwidth="100" style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><strong style="color: rgb(31, 35, 41);font: 700 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 700;line-height: 24px;text-align: left;white-space: normal;display: inline;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><span leaf="">核心入口</span></strong></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">rememberMe Cookie 反序列化</span></section></td><td style="color: rgb(31, 35, 41);font: 16px / 24px ui-sans-serif, system-ui, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;, &#34;Segoe UI Symbol&#34;, &#34;Noto Color Emoji&#34;;font-size: 16px;font-weight: 400;line-height: 24px;text-align: left;white-space: normal;display: table-cell;flex: 0 1 auto;flex-direction: row;justify-content: normal;align-items: normal;padding: 0px;margin: 0px;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box;"><section style="font-size: 17px;font-weight: 400;color: rgba(0,0,0,0.9);line-height: 1.8;margin-bottom: 24px;"><span leaf="">同左，rememberMe Cookie</span></section></td></tr></tbody></table>> 一句话总结：**Shiro-550 是「密钥公开白给」，Shiro-721 是「密钥随机但仍有绕过空间」**  
  
# 四、Shiro 其他高频漏洞汇总  
  
除了经典反序列化漏洞，Shiro 还存在多个高危权限 / 认证绕过漏洞，渗透测试中需重点关注：  
## 1. 未授权访问漏洞  
- 影响版本：Shiro 1.2.3  
  
- 漏洞原理：通过./admin等畸形路径，直接绕过权限校验进入管理后台  
  
- 补充：1.2.3~1.5.3 版本存在多种路由未授权绕过方式  
  
## 2. 权限绕过漏洞（CVE-2020-1957）  
- 影响版本：Shiro ≤ 1.5.2  
  
- 漏洞原理：Shiro 路径匹配逻辑缺陷，攻击者可通过构造特殊 URI（如/xxx/..;/admin）绕过权限拦截  
  
## 3. 认证绕过漏洞（CVE-2020-13933）  
- 影响版本：Shiro ≤ 1.5.3  
  
- 漏洞原理：Shiro 对 HTTP 请求方法处理不当，可通过特殊请求方法绕过认证，直接访问受限资源  
  
## 4. 信息泄露漏洞  
- 影响版本：Shiro 1.2.4  
  
- 漏洞原理：部分接口未做权限控制，可泄露用户敏感信息、配置文件等  
  
# 五、Shiro 反序列化漏洞：关键面试问答  
## 1. Shiro 反序列化漏洞的触发入口是什么？  
  
HTTP 请求 Cookie 中的  
rememberMe  
字段。攻击者将构造好的恶意序列化数据，经 AES 加密、Base64 编码后，替换目标用户的  
rememberMeCookie；服务端在处理该 Cookie 时，会自动执行 Base64 解码、AES 解密、反序列化操作，从而触发漏洞。  
## 2. Shiro 常用的利用链有哪些？  
- CC 链（CommonsCollections）：最经典、最通用的利用链，依赖 Apache Commons Collections 库，适用于绝大多数 Shiro 环境  
  
- CB 链（CommonsBeanutils）：无 CC 依赖时的替代利用链，部分无 CC 环境可直接使用  
  
## 3. 密钥是随机密钥，就无法攻击 Shiro 了吗？  
  
不是，仍有多种攻击手段：  
1. SpringBoot 堆内存泄露：通过 Actuator 未授权端点、Heapdump 接口下载服务器堆栈信息，从内存中直接提取 Shiro AES 密钥  
  
1. 无密钥绕过利用链：部分特殊 Gadget 链可绕过密钥校验，无需知晓密钥直接触发反序列化  
  
1. 弱密钥爆破：若用户自定义密钥复杂度极低，可通过字典爆破破解  
  
1. 社会工程 / 权限渗透：通过渗透获取服务器权限，读取配置文件中的密钥  
  
## 4. Log4j2 与 Shiro 反序列化的底层触发函数有什么区别？  
- Shiro 反序列化：核心触发函数是ObjectInputStream.readObject()，反序列化时自动执行对象的readObject()方法，配合 CC 链执行命令  
  
- Log4j2 漏洞：核心触发函数是JndiLookup.lookup()，日志解析时触发 JNDI 注入，远程加载恶意类执行代码  
  
# 六、企业级防御方案（面试必背）  
## 1. 核心修复方案  
- 升级 Shiro 版本：升级至 1.2.5 及以上安全版本，移除硬编码默认密钥  
  
- 自定义强密钥：使用复杂度极高的随机 AES 密钥，禁止使用默认密钥，定期更换  
  
- 关闭 RememberMe 功能：非必要场景直接关闭该功能，从根源消除漏洞入口  
  
## 2. 代码层加固  
- 反序列化数据增加白名单校验，仅允许可信类反序列化  
  
- 移除项目中危险的 Gadget 依赖（如 CommonsCollections 高危版本）  
  
- 禁用Runtime.exec()等危险系统调用，限制代码执行权限  
  
## 3. 网络层防护  
- WAF 拦截rememberMeCookie 恶意特征流量，阻断攻击请求  
  
- 限制服务器出站端口，禁止服务器主动外联恶意 LDAP/RMI 服务  
  
- 对 Shiro 管理后台做 IP 白名单限制，仅允许内部访问  
  
## 4. 应急排查方案  
- 检查 Shiro 版本，确认是否为 ≤1.2.4 高危版本  
  
- 检查配置文件中的 AES 密钥，是否为默认硬编码密钥  
  
- 排查服务器异常外联流量、异常进程，排查是否被植入内存马  
  
- 定期更新安全补丁，修复 Shiro 权限绕过等其他漏洞  
  
感谢您抽出   
![图片](https://mmbiz.qpic.cn/mmbiz_gif/jzC1MZl7uvpkwDV3NcrFRpT6QRJSY1j2fmBhd9q58lS5Y7AD6wFEcDwATcl4EE4opylqeM9SfvgqfPhuyibX68w/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
   
![图片](https://mmbiz.qpic.cn/mmbiz_gif/jzC1MZl7uvpkwDV3NcrFRpT6QRJSY1j2ibfVug8UCLkFuUujUoSyOXh5CqOQCEKIcfKnW1GQ44x9Ne70wEdZfag/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
·  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/jzC1MZl7uvpkwDV3NcrFRpT6QRJSY1j2uXNXnTIfFfy57Se7rsutTQf1dl4F9IWEs68rhI1h92t0dMmVCFfu2Q/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
   
![图片](https://mmbiz.qpic.cn/mmbiz_gif/jzC1MZl7uvpkwDV3NcrFRpT6QRJSY1j2BoAnxnn1vrz1ZNoqcUckl4UCVfhTOsCy3meVib6Bc8juibR7LEZqWO1g/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
来阅读此文，  
觉得不错的话记得点个赞和在看  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3PxWhY8513bsCAJic7zCKv1WWR9cxMiaHJ86FnEBgvJHR3FzbusGJpCqiaYRzqhv6qeHUyJ2aNfcn4VgbvSOdTIaR6YlSAVMYvLa9TTXRhiaNiaY/640?wx_fmt=gif&from=appmsg "")  
  
  
  
