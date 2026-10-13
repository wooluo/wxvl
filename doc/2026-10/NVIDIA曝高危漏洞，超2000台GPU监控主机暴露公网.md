#  NVIDIA曝高危漏洞，超2000台GPU监控主机暴露公网  
e安在线
                    e安在线  e安在线   2026-10-13 01:38  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9mV6ohI7svBamOYzwq8CvEDUokM6ibXbp9rYEWbO24dlH6ibh2TS0e5ZwysMswAHia7o3vrsYtVv8Vic51xf5eTbeo3e1Zn5iawsh2Q/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9m0e21wsHsyibuPyzKL3DBJXQqv833U3XnodjI9EPY7a0H6g3s5eNg5c6n3AHnRibPpwGB9ibAwcOXP5N40iadhmMB30AibibUVnjJog/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9mibt3mcbqCcNjUcoiacjcYJW2jtIeerlPfub3KmP5zHiby6hP44iatBQnopwQVxctnJic1aicJtdExTLTNicljMmGFTn6zkpN8oSeOtM/640?wx_fmt=png&from=appmsg "")  
  
  
**NVIDIA披露 DCGM Exporter 高危漏洞 CVE-2026-47483,CVSS 评分8.2。漏洞位于/debug/pprof 调试接口，未授权攻击者可发送大量请求触发资源耗尽，造成监控组件崩溃，干扰AI业务负载。**  
  
  
**扫描显示公网超2100台主机暴露，泄露12000余个GPUUUID，涉及H100、RTX5090等高端显卡。官方建议升级至4.8.2及以上版本，非必要关闭pprof功能，监控服务绑定内网地址，收紧9400端口访问权限，排查异常调试请求，防范探测攻击。**  
  
  
  
NVIDIA曝出DCGM Exporter中的高危漏洞（CVE-2026-47483）。该漏洞可被未授权远程攻击者利用，耗尽服务器资源、导致GPU监控崩溃，进而中断AI工作负载。  
  
  
**漏洞未授权访问可耗尽资源**  
  
  
DCGM Exporter是GPU服务器与Kubernetes集群的常用监控工具。它会采集GPU型号、温度、内存占用、功耗、运行错误、工作负载状态等信息，通过HTTP接口输出符合Prometheus格式要求的监控数据。  
  
  
每块GPU都对应唯一的UUID标识。如果监控接口暴露在公网，外部攻击者可以梳理高价值硬件资产、掌握GPU繁忙时段，还能获取相关软件与工作负载的详细信息。  
  
  
该漏洞存在于/debug/pprof路径下的Go性能分析接口中。这类接口原本用于帮助开发者排查CPU与内存占用问题，但存在漏洞的版本未对接口设置登录校验，也没有配置合理的请求频率限制，直接将接口暴露在外。  
  
  
攻击者只要短时间内发送大量性能分析请求，就会导致服务器内存与CPU占用失控，最终使DCGM Exporter运行变慢、停止响应甚至直接崩溃。  
  
  
**公网暴露超2000台主机**  
  
  
NVIDIA将该漏洞的CVSS评分为8.2（满分10），漏洞类型归为CWE-770（无限制资源分配）。一旦DCGM Exporter崩溃，运维人员将无法实时查看GPU健康状态、运行错误、温度与资源占用情况。如果DCGM Exporter没有配置严格的容器或主机资源限制，这类资源挤占还会拖慢同一环境下运行的AI任务。研究人员仅在受控环境中测试了该资源耗尽攻击的效果，并未对发现的公网暴露系统发起攻击。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Hxdb7gjfn9libG6tYicOXbdYoSBrcy9H9BPFtmMFskfWlb8gDx243J87nDwWjUc88gDawTIDibcFBZFBXTYyKxvg6q1ufKCmBaBKvibib664zicibI/640?wx_fmt=jpeg&from=appmsg "")  
  
  
Lava Security研究员Michael Katchinskiy在研究公网暴露的DCGM Exporter系统时发现了该漏洞。2026年3月至5月期间，研究团队开展了四次全网扫描，共发现约2100台主机无需认证即可对外提供监控指标数据。  
  
  
这些主机分布在近300家机构中，共泄露超过12000个唯一GPU标识符。其中约四分之一的DCGM主机同时暴露了存在风险的性能分析接口。可被识别的硬件包括H100、H200、B200、Blackwell Ultra B300、RTX 4090、RTX 5090等型号GPU。从地域分布看，美国暴露的GPU数量为5274块，占观测总量的44%。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Hxdb7gjfn9lVVBcQYUwlkXSMaiaDeLibjoB69cOSJtMKq6AGTof70xskxyUNicFawfI1YbTaxwR2DHicVwtNn2n6rQgrHE0wjVibeV6gAv9VSE50/640?wx_fmt=jpeg&from=appmsg "")  
  
  
研究人员还在多家GPU云服务商的关联网络中发现了用户自行部署的暴露端点，涉及服务商包括Voltage Park、Lambda、Northern Data、DigitalOcean等。相关服务商收到漏洞通报后，已协助通知受影响客户。  
  
  
这一事件也说明，AI监控端口需要得到与其他管理服务同等的安全重视。Cyber Security News此前曾报道过可导致代码执行的NVIDIA GPU驱动漏洞，还发布过覆盖GPU、固件与管理层风险的AI数据中心安全检查清单。  
  
  
**官方推送4.8.2修复版本**  
  
  
NVIDIA在安全公告中要求DCGM Exporter用户升级至4.8.2及以上版本。运维人员若非必要性能分析需求，应保持--enable-pprof参数为禁用状态。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Hxdb7gjfn9lHG0d9Hd7NotqoNdvxGrmxvvGmKOYKyfx1UZwX5We3tibfD3gOm4sUBC62CHDfaicNrR4f63yiclqVmK3x4vzB2mgLHot3mEkPbA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
运维人员应将Exporter、Prometheus、Node Exporter服务绑定至私有地址或回环接口，仅允许受信任的监控系统访问。访问控制可通过防火墙规则、云安全组或Kubernetes NetworkPolicies实现。  
  
  
安全团队应全面排查面向公网开放的9400端口，禁止公网访问/debug/pprof路径，同时检查日志中是否存在重复或长时间运行的性能分析请求。  
  
  
如果出现内存突增、CPU飙升、Prometheus抓取失败或GPU告警断档等情况，可能意味着系统正被探测或已遭利用。团队需确认所有GPU节点都已部署修复后的容器版本，不能仅在镜像仓库或配置文件中更新版本。  
  
  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Hxdb7gjfn9nSwsQ3fa5yfvZBeyTNw39rEMXhiapibkhYnGDwicud6LEJddnCsdhtDwg7G9kLxwaPXa0N7eJyPtRafC2Kp41OibjhvxldPHlibXb0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9kiagee1EcGibuMFdnYT8cjiaiaC8oKVpfCiceD9MaukWoW0rmwytuMrsCKBNHic6SaVQHhWBY3VFUOXOexIHZibNT32OPSU1a1xTBiaHo/640?wx_fmt=png&from=appmsg "")  
  
  
声明：除发布的文章无法追溯到作者并获得授权外，我们均会注明作者和文章来源。如涉及版权问题请及时联系我们，我们会在第一时间删改，谢谢！文章来源：FreeBuf  
  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9mJsX3c2HFibUxDLFdyYFjuOhFC87ia2fs39IdANRSqUp14xiaAKtr3VlvCbbIInKzpO7ulec7fUdUTmrHHqicE9MYm4O0ib3SJQRWM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9mX3cokSC9mMzg1dSv5oI59zKcS5Nt8yeR0SGYXNQHE9VJAH6Roy4S9Q1uNF7CQxKbmI3Htbvu7Or3rMrzJnc6sogTgugribYn0/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Hxdb7gjfn9k7k43M6HEticYVpyBfqsKbWbLolibibqn42qjuSiaPtiadxlfyzicchVzcymwTI4tV4sBfGfWrlaW3Km1pMU6ryK784Rv8ZqRTgGrXE/640?wx_fmt=png&from=appmsg "")  
  
  
  
