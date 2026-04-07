#  一次报复式 0day 漏洞披露背后的 MSRC 信任危机  
原创 独眼情报
                        独眼情报  独眼情报   2026-04-07 04:30  
  
再次声明，我的文章都是 AI 写的，可以评论一下，文章质量是不是又提高了？🐶  
  
![](https://mmbiz.qpic.cn/mmbiz_png/cBGhzWwhSAh8LJHBjHqKSlxS21uL41NuEDqvejRsK3Og0h4U0opr9Eb8iclFXicmeVSlPIwaP2MYF6I1HYsBb3ricLE7C7LN9b6kU00nI6MJico/640?wx_fmt=png&from=appmsg "")  
> https://github.com/Nightmare-Eclipse/BlueHammer  
  
  
2026 年 4 月 2 日至 3 日，一名以 Chaotic Eclipse / Nightmare-Eclipse 为别名的安全研究员先后通过个人 Blogger 博客和 GitHub 仓库公开了一枚未修补的 Windows 本地提权（LPE）零日漏洞 PoC，事件被命名为 BlueHammer。漏洞经业内资深分析师 Will Dormann 验证为可工作，技术机制为 TOCTOU（time-of-check to time-of-use 竞争条件）与 path confusion（路径混淆）的组合，最终目标是离线读取 Windows 本地账号密码哈希数据库 SAM，进而获得 SYSTEM 权限。漏洞 PoC 在 Windows 11 25H2 上验证可工作，在 Windows Server 上失败，PoC 作者自承代码内存在 bug。截至本文成稿时（UTC 2026-04-07），微软未发布补丁,**说明是真 0day**  
。  
  
研判：BlueHammer 的技术威胁中等偏上，但事件的核心价值不在漏洞本身，而在研究员公开破坏 CVD（Coordinated Vulnerability Disclosure，协调披露）流程的动机叙事。研究员两次在公开博文中暗示与 MSRC（微软安全响应中心）之间存在「被违反的协议」、点名感谢现任 MSRC 工程副总裁 Tom Gallagher、并自称「无家可归一无所有」，研判倾向于这是一次围绕 bug bounty（漏洞悬赏）判定结果或资格认定产生的报复式披露。整体置信度评估为中偏高——技术事实层有多源交叉验证支撑，制度叙事层依赖研究员单方面表述，存在动机污染风险。  
  
**对防御方建议**  
：在补丁发布前，对终端 Windows Defender 服务的特征更新流程实施额外监控；对本地 SAM hive 的卷影副本（VSS）访问行为做异常检测；将 BlueHammer 纳入红队演练的本地提权工具评估清单。  
  
**对决策者建议**  
：将本事件作为 MSRC 类供应商安全响应程序在内部漏洞披露策略中的风险案例，重新评估对厂商响应延迟的最终通牒条款。  
  
**对同行建议**  
：关注后续是否出现 CVE 编号分配、受影响版本完整披露和在野利用迹象，并对 PoC 在其他 Windows 11 客户端版本上的可移植性保持跟踪。  
## 背景与时间线  
  
<table><thead><tr><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">时间（UTC）</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">事件</span></section></th><th style="color: rgb(0, 0, 0);font-size: 16px;line-height: 1.5em;letter-spacing: 0em;text-align: left;font-weight: bold;background: none left top / auto no-repeat scroll padding-box border-box rgb(240, 240, 240);height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">信源</span></section></th></tr></thead><tbody><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-03-26</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">别名 Chaotic Eclipse 在 Blogger 域名 deadeclipse666 发布博客首篇「First post : I never wanted to do this...」，自称被某个未具名对象「违反协议」、「搞到无家可归一无所有」。该博客 Profile 名为「Dead eclipse」</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">deadeclipse666.blogspot.com</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-02</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">同一别名发布博文「Public disclosure」，公开 GitHub 仓库链接 </span><code><span leaf="">Nightmare-Eclipse/BlueHammer</span></code><span leaf="">，正文点名感谢 MSRC 领导层和 Tom Gallagher</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">deadeclipse666.blogspot.com</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-02（同日）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">第三篇博文发布完整 PGP 公钥块，签名身份名 &#34;Terrain Repu...&#34;（剩余字符未在 RSS 摘要中出现）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">deadeclipse666.blogspot.com</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-03</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">GitHub 仓库 </span><code><span leaf="">Nightmare-Eclipse/BlueHammer</span></code><span leaf=""> 被公开。仓库 5 次提交，MIT 许可，README 用 PGP SHA512 签名。BleepingComputer 在同日发布报道</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">github.com / bleepingcomputer.com</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-03</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">vx-underground 在 X 平台转发 PoC 链接，称「stinky nerds 告诉我这是真的」</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">x.com/vxunderground</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-06</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">二级媒体（如 Filmogaz）开始转载 BleepingComputer 报道</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">filmogaz.com</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-07（成稿前）</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">独立研究员 0xjustBen 在 GitHub 发布从零重写的 BlueHammer 版本，附完整技术 README，明确标注为 Defender Signature Update LPE，仅在 Windows 11 25H2 上验证通过</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">github.com/0xjustBen/BlueHammer</span></section></td></tr><tr style="color: rgb(0, 0, 0);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">2026-04-07</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">微软仍未公开回应。BleepingComputer 文末注明已联系微软但未在发稿前收到回复</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">bleepingcomputer.com</span></section></td></tr></tbody></table>  
  
需要补充一条上下文：研究员在「Public disclosure」博文里自述「I was not bluffing Microsoft and I'm doing it again」、「Unlike previous times, I'm not explaining how this works」。研判：「我又来了一次」「不像之前那几次」这两句措辞暗示存在至少一次此前的同类公开行为，但目前在 deadeclipse666 这个博客上只能看到 2026 年 3 月以后的内容，更早的活动需要通过 PGP 公钥指纹做跨平台关联才能确认。  
## 证据与技术细节  
### 漏洞类型与影响范围  
  
Will Dormann 向 BleepingComputer 确认 BlueHammer 是一个本地提权漏洞（local privilege escalation），机制上结合了 TOCTOU 竞争条件与路径混淆两类经典 bug。Dormann 现任 Tharros 公司首席漏洞分析师（Tharros 即原 Analygence），在 Windows 本地提权领域有长期积累，业内对其判断的可信度较高。Dormann 的原话是：成功利用后攻击者能够访问 SAM（Security Account Manager，存储 Windows 本地账号密码哈希的注册表 hive），进而「拥有系统，可以做包括 spawn 一个 SYSTEM 权限 shell 在内的任何事」。Dormann 同时强调「这不是个好打的洞」，意味着利用难度较高，不属于一键打穿型。  
  
按 BleepingComputer 的复述，多名测试者在 Windows Server 平台上无法成功利用该 PoC。Dormann 进一步说明：在 Server 上 BlueHammer 只能将权限从非管理员提升到 elevated administrator，而后者需要用户主动授权一次完整系统访问，这意味着在 Server 平台上漏洞的实际杀伤力被显著削弱。  
  
PoC 作者本人在 GitHub 仓库 README 的 Edit 段中承认「There are few bugs in the PoC that could prevent it from working, might fix them later」。  
### 仓库文件结构  
  
Nightmare-Eclipse/BlueHammer  
 仓库的公开文件清单包含以下与攻击面直接相关的文件：  
- windefend.idl  
 — Windows Defender 的 RPC 接口定义文件  
  
- windefend_c.c  
 / windefend_h.h  
 / windefend_s.c  
 — 由 IDL 编译生成的 RPC 客户端、头文件和服务端 stub  
  
- offreg.h  
 / offreg.lib  
 — 微软提供的离线注册表 hive 解析库  
  
- FunnyApp.cpp  
 / .sln  
 / .vcxproj  
 — Visual Studio 工程文件，主程序名为 FunnyApp  
  
- 仓库语言统计：C 占 97.6%，C++ 占 2.4%  
  
仓库 README 正文除了 Edit 段外只有一句文本：「I'm just really wondering what was the math behind their decision, like you knew this was going to happen and you still did whatever you did ? Are they serious ?」整段以 PGP SHA512 签名包裹。  
### 0xjustBen 重写版本提供的技术细节  
> https://github.com/0xjustBen/BlueHammer  
  
  
研究员 0xjustBen 在 BlueHammer 公开后发布了一个同名仓库的从零重写版本，并附有完整 README。该版本与 Chaotic Eclipse 原仓库不是同一份代码，但既然其作者明确声明是「Modular from-scratch reimplementation of the Nightmare-Eclipse/BlueHammer PoC」，且文件结构（windefend RPC + offreg + Cloud Files API）与原仓库高度一致，研判：该重写版本应能反映原 PoC 的整体利用思路，但具体实现细节可能存在差异。  
  
按 0xjustBen 的 README 描述，BlueHammer 的利用链由以下组件构成：  
- **update.cpp**  
 — 从微软官方链接 go.microsoft.com/fwlink/?LinkID=121721  
 下载 Windows Defender 特征更新包，解析 PE 文件的 .rsrc 段，通过 FDI 回调在内存中提取 cabinet 压缩包  
  
- **vss.cpp**  
 — 投放 EICAR 测试文件作为触发器（在二进制中做了反向以避免被自身 Defender 检测），通过 NtQueryDirectoryObject  
 监控 \Device\  
 下的 VSS（Volume Shadow Copy Service，卷影副本服务）快照  
  
- **cloudfiles.cpp**  
 — 调用 CfRegisterSyncRoot  
 和 CfConnectSyncRoot  
，注册一个 Cloud Files API 同步根目录。在回调函数里通过 CF_PROCESS_INFO  
 获取访问该路径的进程 PID，识别出 Defender 进程后，对其下发 batch oplock（批处理机会锁），将 Defender 进程冻结  
  
- **race.cpp**  
 — 在 Defender 的特征数据库文件 mpasbase.vdm  
 上申请 batch oplock，将一个 NTFS junction（目录联接）切换到 \BaseNamedObjects\Restricted  
，再通过 NtCreateSymbolicLinkObject  
 创建指向 VSS 中 SAM 副本路径的符号链接，最后通过 RPC 调用 Proc42_ServerMpUpdateEngineSignature  
 触发整个流程  
  
- **sam.cpp**  
 — 通过 OROpenHive  
 离线打开 SAM hive，从 live SYSTEM hive 的 class names 中提取 boot key 并做置换运算，针对 SAM key 做 AES（rev 3）或 RC4（rev 2）解密，再用 AES 或 RC4 + DES-ECB 提取 NT hash  
  
- **escalate.cpp**  
 — 调用 NetUserSetInfo  
 完成提权  
  
0xjustBen 明确标注其重写版本只在 Windows 11 25H2 上验证通过，在 22H2、23H2、24H2 上不工作。  
### 利用链的本质  
  
把上述组件翻译成更直白的语言：BlueHammer 的核心机制是借助 Windows Defender 自身的 SYSTEM 权限去完成一次任意文件读取。攻击者在 Defender 检查目标文件路径之后、真正使用之前的时间窗口里，通过 NTFS junction 和 NT 符号链接把路径换成 VSS 中 SAM hive 的位置，让 Defender 用自己的特权身份去读 SAM。读出来的数据用微软自家的 offreg.dll  
 离线解析，提取本地账号哈希，最后用提取出的凭据完成权限提升。  
  
研判：使用 Windows Defender 这样的安全产品作为特权代理来访问被严密保护的系统资源，是这条利用链最具讽刺意味的特征，也是 BlueHammer 这个命名的可能由来——「用蓝队的锤子去砸蓝队的门」。但这只是命名的一种可能解读，研究员本人没有在任何公开材料中解释命名理由。  
## 分析与研判  
### 研判一：这是一次有意识的报复式披露，技术披露只是载体  
  
依据：研究员的两篇公开博文都不是技术文档，而是情绪化的人际叙事。3 月 26 日的「First post」整篇没有任何技术内容，只讲「someone violated our agreement and left me homeless with nothing」、「they knew this will happen and they still stabbed me in the back anyways」。4 月 2 日的「Public disclosure」也没有任何技术解释，只有「I was not bluffing」「huge thanks to MSRC leadership for making this possible」「special thanks to Tom Gallagher」。GitHub README 上的唯一一句话也是质问而非说明：「what was the math behind their decision」。  
  
研究员主动放弃了一次本可以为自己赚取技术声誉的机会——选择「不解释」而不是写一份漂亮的技术 writeup，这本身是一种姿态。研判倾向于：研究员的目标读者不是安全社区，而是 MSRC 内部的具体某个人或某几个人。技术披露只是让对方「看到」的载体。  
  
**反向假设**  
：也存在另一种可能，即研究员只是性格冲动型，没有更深的策略意图。但反向假设的弱点在于，研究员同时维护了 PGP 签名身份、控制了博文措辞节奏（先模糊预告再具体兑现）、并且选择了一个对微软 PR 影响最大的命名方式，这一系列动作不像是纯情绪化反应，更像是有意识的施压设计。  
### 研判二：矛盾大概率围绕 bug bounty 判定，证据指向但未确认  
  
依据：研究员的核心情绪关键词是「homeless」（无家可归）和「nothing」（一无所有）。这种措辞的语义场偏向经济损失，而非声誉、法律或人际纠纷。「我们的协议」（our agreement）这种表述暗示一种半正式的安排，符合 bug bounty 提交者与厂商之间的关系模式：研究员提交漏洞，厂商承诺按既定标准评估并发放赏金，但具体金额和资格判定由厂商单方面决定。  
  
进一步的指向性证据是研究员点名感谢了 Tom Gallagher。Gallagher 是 MSRC 现任工程副总裁，2025 年 12 月 11 日在 Black Hat Europe 主导宣布了 MSRC 的「In Scope by Default」政策扩张，2026 年 2 月 6 日又主导发布了 MVR（Most Valuable Researcher，年度最有价值研究员）排行榜的改革，将排名标准从积分制改为按实际悬赏金额排名。Gallagher 的对外形象正是 MSRC 悬赏政策的代言人。研究员选择点名他而非其他高管，研判倾向于矛盾的具体场景与悬赏判定相关。  
  
Will Dormann 在 BleepingComputer 报道中提到一条具体的程序细节：MSRC 在漏洞提交流程中要求研究员提供漏洞利用的视频演示，「这虽然能帮助微软更高效地分流提交，但也增加了写一份合格报告的工作量」。Dormann 的这段评论看似与事件无直接关联，但 BleepingComputer 把它放在文章中的位置紧接着「研究员公开披露的动机仍不明确」一句，研判：Dormann 暗示这条流程要求是当前 MSRC 与一线研究员关系紧张的一个具体摩擦点。  
  
**反向假设**  
：矛盾也可能不涉及金钱，而是涉及署名、CVE 分配权、披露时间表分歧等。这种解释的弱点在于无法解释「homeless」和「nothing」这种经济语境的措辞。如果矛盾只是署名或时间表分歧，常见的措辞会是「disrespect」「ignored」「broken promise」而非「homeless」。  
### 研判三：PoC 内置 bug 是策略选择而非技术失误  
  
依据：Chaotic Eclipse 在 README 的 Edit 段中明确说「PoC 里有几个 bug 可能会导致它不工作，以后可能会修」。一个有能力发现 TOCTOU + path confusion 组合洞、有能力穿过 Windows Defender 的特权边界拿到 SAM hive 的研究员，没有理由在最终公开版本里留下基础性的稳定性 bug。  
  
研判倾向于：bug 的存在是有意为之的折中方案。完整可用的 PoC 会让微软在公关上彻底被动，也会让研究员承担更大的法律和道德压力（一旦该 PoC 被纳入真实攻击工具，研究员会被追溯责任）。带 bug 的 PoC 既制造了足够的施压效果（业内可验证为真，足以登上头版），又给研究员留了一道防火墙——「我没全力以赴，需要负责任的话你们去找那些修了 bug 的人」。  
  
「以后可能会修」这句话也是策略性的——它让 MSRC 知道局面还可以更糟，也就给了 MSRC 让步的动机。  
  
**反向假设**  
：bug 也可能是真实的技术疏忽，研究员仓促发布没来得及完善。这种解释的弱点在于研究员同时维护了 PGP 身份、控制了博客发布节奏、并在博文中体现出明显的策略性措辞控制，整体不像仓促之作。  
### 研判四：BlueHammer 会被吸收进攻击工具集，但不会成为大规模事件  
  
依据：本地提权零日漏洞的常见生命周期是：公开 PoC → 社区修复 bug 并验证更多版本 → 红队工具集吸收 → 攻击工具包吸收 → 在实际入侵中作为提权环节出现。0xjustBen 的从零重写版本在 BlueHammer 公开后数日内出现，证明社区对这枚漏洞的关注度足以推动适配工作。  
  
研判：未来 1-3 个月内，BlueHammer 的可用变体大概率会出现在以下几类工具中——红队提权工具包（如 SharpUp 这类的衍生项目）、初始访问经纪人（initial access broker）的工具链、部分勒索软件团伙的横向移动工具。但 BlueHammer 不会成为类似 EternalBlue 或 PrintNightmare 那种大规模事件，原因有三：它是本地提权而非远程代码执行，需要先有非管理员权限的代码执行；微软大概率会在下一个或下下个 Patch Tuesday 发布修复（评估认为不晚于 2026 年 6 月）；漏洞利用难度较高，不属于脚本小子可直接套用的类型。  
  
**反向假设**  
：如果 PoC 被某个 APT 组织在公开后数日内集成进现有作战工具链，可能在补丁发布前形成一波短期攻击高峰。这种情况的判断依据是过去几年中已有多枚本地提权零日（如 PrintNightmare）在 PoC 公开后立即被纳入实际行动。但反向假设的弱点是 BlueHammer 的利用难度高于 PrintNightmare 那种「调用打印 spooler」类型的洞，需要对 NTFS junction、NT 符号链接、Cloud Files API 回调等多个组件有深入理解，能直接拿来用的 APT 组织数量相对有限。  
### 研判五：事件对 CVD 机制的二阶影响大于对微软的一阶影响  
  
依据：CVD（Coordinated Vulnerability Disclosure）的整套伦理框架建立在一个隐含前提之上——研究员愿意为「保护用户」这个抽象目标而压抑自己的短期利益。这个前提的稳固性取决于厂商一侧持续兑现承诺。BlueHammer 事件本身只是一个个案，但它把「研究员可以通过公开零日来报复厂商」这种行为模式做了一次高曝光度的演示。  
  
研判：事件对微软自身的损害是可控的——技术影响可以通过补丁解决，公关影响可以通过沉默或一份事后说明消化。但事件对 CVD 生态的影响更深远：其他对厂商响应不满的研究员现在多了一个可参考的剧本。具体的二阶影响可能包括——研究员在提交前更倾向于留一份完整的 PGP 签名记录、在沟通过程中保留更多书面证据、在判定不利时更倾向于公开施压而非沉默接受、甚至出现「我把 PoC 寄存在死人开关上，你不给我合理回应我就自动公开」这种制度化的对抗手段。  
  
**反向假设**  
：也有可能事件只是一个孤立个案，不会引发更大范围的行为模式变化。这种判断的依据是过去十年中类似的「报复式披露」零星出现过（最著名的是 SandboxEscaper 的多次 Windows LPE 公开），但每次之后整个 CVD 生态依然按原状运行。但本次事件与 SandboxEscaper 系列的关键差异是：Chaotic Eclipse 的措辞更具体地指向一份「被违反的协议」，而非单纯的对厂商响应缓慢的不满，这种具体的契约性叙事更容易被其他研究员代入和复制。  
  
  
