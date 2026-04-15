#  Windows事件日志服务曝内核地址泄露漏洞，影响NVMe存储设备  
原创 网空闲话
                    网空闲话  网空闲话plus   2026-04-14 22:57  
  
【2026年04月15日暗网监测发现】tier1论坛用户"以利亚"发帖称，安全研究人员发现Windows事件日志服务存在严重信息泄露漏洞。该漏洞允许攻击者通过远程过程调用（RPC）机制，从本地或远程Windows计算机中提取内核池指针等敏感内存信息。漏洞具体存在于Microsoft-Windows-Storage-Storport/Operational日志通道中，当Stornvme驱动程序处理NVMe固态硬盘错误时生成的EventID 524事件会意外泄露内核内存地址。  
  
技术分析显示，攻击者可利用此漏洞绕过内核地址空间布局随机化（KASLR）等安全防护机制，为后续提权攻击和恶意代码执行提供便利。虽然当前评估严重程度为"中等"，但该漏洞可能成为高级持续性威胁（APT）攻击链的关键环节。建议所有Windows用户立即检查系统更新，重点关注存储驱动程序补丁。同时应限制不必要的RPC端口暴露，启用内核隔离功能，并监控异常的事件日志访问行为。企业环境需优先为关键服务器部署微隔离策略，防止横向移动风险。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d0mthSMltlf37J95KgNnJh9lIibKPQmLLAaU4e6nCOKUCnC6aJiaazs49KGlh0fROwucd6F9GjdtCb1qv8RKFsSiaS5uYwrV1sEms/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d1yM2QFzmMFUzYibxHU1xd3xMibq6pGnicG1AxjR0fFibA8Nicn1xCU0eibIRoeT8UTe6SgV8rp5nGsOK4gH8IdxBbzUZ647RrsjWSdw/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d0PyHtVM0cOcInibtX8ckcz1Lgbic0JfrIMc9XFYWNJGhhrcq5F7HYJx1ZBAdN2sezJv20jEvFo0jAw8zCiaDoRMome7xY4iaiaxiaP4/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d151Ug50wodroYyicdcmlsO34FhlUBaNgicg2XotsxJ3b0uJPPhrsS41jmMhNcQdYwT35FfMMFV5wU147lTQkhYWadtw9Ia5bDjk/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d1y1eeYk9JGe8fD3Zfe7ictPy7ZiaAUl8efzAolG7PjaCRA4PMLZzufpCpjVXIpuHQstFBiaHeicj076olOh2iayCH88OUIdSUrXFgo/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d3cIIaDKzeHhZz603yaTmVt4icS93j44icgVQHDkrljpsvo5JZ23dklcutMR3UDuNsLXl5kia0V3wNzbbFcibWEdgnGfkbCUdibVVlE/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d1nVI7PbkyrVecmzEXmXibicqibdGt8oPsYfJAUodRL4StZpyWTo9fH9PFgclFcULNqOL0vOPZd9ctzYricMqlpDyBiaPhlzqS0MD5w/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d2znIRo6ocMKzZKmqTWo7kRxsyiazBDpiaIhB4PAPuQa2K95gvUibjc5ALAhZHRNHnZIfz6V2UUA3yHFr2paAncuzyVRiaOr4HyM6Q/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d30XOiaEtvtJibtibH3zvzAbItl1pySlup7acic21PKQb1ZgEH8usSC7OqHGrXmS9vPVV4ic3ZEw0uqmWSVibJABhtZVHB6FSmRrgjw8/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d2nEzLvcAPbqWQUJRKZXWfyCZ1x0tGxBawcYOiafwgAofaex0HHiatq1LH8lTQoV0wJoN27pzfRiaw1armT9DxcobLdiaLmCu67kzk/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d2iabsX6ibJgIhbZ3JXySfhLmsUD7yQqx8AgdDwXZuRqo884yftdO9VWibtZjpuDCCGFosXTEk7tIofYyuW9ibNX26ibfIFicUmdXfoc/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d2iaYh74mtwWibI4thkkE813cUnicuicFATwzgWp6DwFAXksz1Aic74Sdd4S9QA4eNEOBN2ZWhf35Ss8qYBCHRJyLUd7IywK5nRicdS4/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d09buf2kwYAibkVpSHqicNI9WAxLaXoiatdzLFaPSssTXibdR7XPBvdSQ9AMB2dEXopvOlzYJznUicRsicb12t27k4NIPDJJTFfwNElI/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/lQ1jXOMq3d0z5a8s2Qs85GoPA8lGeTbPoK8NsyrjTT4yO19kDQibcJtYExo74e1AXRrziaNSYfOAu41M3pPWEPCYgkUuGtUcfs6kzFrd6hGIQ/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lQ1jXOMq3d3RyV9qhUnyXq0o8cenBpInRsZCCdqjOQwibliagTw70Kd9ickzVFjHYIFL4uFXJ00XY0A4yeCnubhvYdwalwoRmJwUNyO3pJb6sM/640?wx_fmt=jpeg "")  
  
该漏洞是否有cve尚未核实。感兴趣者自行查证。  
  
手机编辑，未对细节进行分析核实，见凉。  
  
参考来源：https://tier1.life/thread/143  
  
