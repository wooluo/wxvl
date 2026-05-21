#  什么？？还有人不会AI漏洞挖掘  
原创 小Tiamo
                    小Tiamo  貔瑞安全实验室   2026-05-21 13:04  
  
> 依旧标题党，今天教大家基础配置，让你也能用 AI 辅助挖洞。  
  
# ——前言——  
  
这里主包使用的是 **CC Switch + Yakit + DeepSeek**  
 的组合。  
# ——所需配置一览——  
<table><thead><tr><th style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: #0d9488;color: #fff;font-weight: 600;padding: 10px 14px;text-align: left;font-size: 13px;background-color: #0d9488 !important;"><section><span leaf="">组件</span></section></th><th style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: #0d9488;color: #fff;font-weight: 600;padding: 10px 14px;text-align: left;font-size: 13px;background-color: #0d9488 !important;"><section><span leaf="">推荐选项</span></section></th><th style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);color: white;font-weight: bold;padding: 15px 12px;text-align: left;font-size: 15px;background: #0d9488;color: #fff;font-weight: 600;padding: 10px 14px;text-align: left;font-size: 13px;background-color: #0d9488 !important;"><section><span leaf="">备注</span></section></th></tr></thead><tbody><tr><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">AI 载体</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">Claude Code / Codex CLI / Gemini CLI</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">🚫 尽量别选 Gemini</span></section></td></tr><tr style="background-color: #f9f9f9;background-color: #f9f9f9;background: #f5fdfb;"><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">AI 配置</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">CC Switch</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;"><section><span leaf="">—</span></section></td></tr><tr><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;border-bottom: none;"><section><span leaf="">MCP 工具</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;border-bottom: none;"><section><span leaf="">Yakit</span></section></td><td style="padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 12px;border-bottom: 1px solid #eee;font-size: 15px;border-bottom: none;padding: 10px 14px;border-bottom: 1px solid #e0f5f0;color: #2d4a40;border-bottom: none;"><section><span leaf="">让 AI 走代理，省去手打 curl</span></section></td></tr></tbody></table>## 一、AI 载体下载  
  
需要先安装 **Node.js**  
 并配置好环境变量，这里就不多赘述了。  
> 参考教程：CSDN - Natsuago 的环境配置文章  
  
  
安装完配置好环境变量，一键下载就行。相信各位帅逼都已经成功安装了。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq7gQibxiadLPBgNN4sroDDZfTYicCXnfjoiczdibLsP0P23VKsc2dqicDMwsYLQL0uIIANtRFA9OsbbIiceuJwzwvhZUhlLzCYIRZlZcE/640?wx_fmt=png&from=appmsg "")  
  
npm install -g @anthropic-ai/claude-code  
## 二、CC Switch 配置  
  
Tiamo 这里使用的是自己的中转，大家可以根据自己的需求去选择。新手推荐选一手 **DeepSeek**  
（支持一下国产，另外国外模型的道德水平最近开始提升了，懂的都懂）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq7vfTogaTNY5iaiaM6WSgXzick0HoOAlTQ4SwsdVZOL4tNX4nTH3z82URQ5gfTqicpQK8SjB9iapCn26eWzq2XZFQLbct6C14p4SQ30/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq4Y1iaOQyMt4iciatzuRLwuIkjJCw2uSCEc1MSemhpdWGBoZtrE9w6icnECIRRwicv8hFONWDWfAHoHYnlhn2l2PtVRu46DSNA5OyzA/640?wx_fmt=png&from=appmsg "")  
  
这里都是自定义供应商  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq5u8nfy9uibBlZTicodFAxdhd7ibl0PuTSOMOrBlnmnicsSE2ia9IeCISnsKic7qInygVFXGGjm9wuVVdaEIibQRr6LMYicJ1wTia3r4gibg/640?wx_fmt=png&from=appmsg "")  
> DeepSeek 的配置参考下图。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq5dSUywLqNork5ymhVE5fmmo2H8vkH6LsV4vibHtYqZRhJSDhUODmicTERViaGT8PrPH5ppMUndye06CyhMfr1CNcMcmhgPxmMcjw/640?wx_fmt=png&from=appmsg "")  
### · · ·MCP 配置· · ·  
  
一个小坑：**Gemini CLI 调用 MCP 会出问题**  
。我们尽量使用 Claude 和 Codex 去调用。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq7OK6dhrgbq38SkD4fMt1nlKopwuWlFCcEtGxfhV0R8HouQ64Azt87OOUuOOK8KvKH7N8ImbPxO7bY5zqan99plLBxia4SXgbNk/640?wx_fmt=png&from=appmsg "")  
  
说一下为啥要调用 MCP —— 因为可以省去 curl，图方便。你可以和 AI 说让它的数据包都走你的 Yakit 代理，这样好利用数据包验证，防止AI幻觉，也能看到 AI 在干啥。  
### · · ·Skills 配置· · ·  
  
（略，自己写，这里小 Tiamo 就不放出来出丑了。）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq4M3SMjXrCKZsIj42ibaH38SobncoWlT6cBGmZicCXyZpUEiaITs3yWGlGop9w1n4pC4fibPpmMJP8ZEMI6wGIjfJPiaCAXdTnEQgI8/640?wx_fmt=png&from=appmsg "")  
### · · ·提示词配置· · ·  
  
（略，同上。提示词和 Skills 我都是让 AI 自己写的。）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq7hq165cOdnuawdvICEz2qDpZumBva0RmzFeDFelLn9PphfyAPCC7G2Rj0IjYOB0Zx0ppGEPLwqYRx7vurM4kq18TwshAc6Py8/640?wx_fmt=png&from=appmsg "")  
## 三、Yakit 配置  
  
然后就到了最简单的 Yakit 配置了。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq4liciaoyic7S3YgWPwoU5shZKuQysTrFdfLZCRORqQjlSicaGvRosmZ7W1KBGicb3REBZXxPwTibsgV6x8iaLpQcGwuHNg1y96wTsAkI/640?wx_fmt=png&from=appmsg "")  
  
这个 AI 是可以用的，总体感觉功能很好。不过每个人都有每个人的工作流嘛（不吹不黑，临时救场还是蛮不错的）。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq71giaeZRwfOrZzM0pQ7PEtxicbfScFr5BASSsZu5AicNiaFuRcQxyuiaDQ6nDNFibmyh2P1LDfgD3ic0c3fzp0FH8A9dmySD5vXpXIaI/640?wx_fmt=png&from=appmsg "")  
### · · ·两种打法· · ·  
1. 1  
**富哥打法**  
：把整个站点丢给它，全栈梭哈。  
  
1. 2  
**精准打法**  
：自己找到一个疑似漏洞点，但不会利用或者不确定，让 AI 去渗透验证。  
  
各有千秋吧，两个打法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/YsjLAVBCQq42XTU9qkUBJVgRh4tOGvzqOn4HJd8qiaaXxhichC3OzHAy0Hn8Sk03cyOA6MATYvhF8EM1iaUqG6HYJV31a0SDLTJKcuOO7Bnsrk/640?wx_fmt=png&from=appmsg "")  
  
## 实战战果  
  
这里放个朋友挖 SRC 的截图：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/YsjLAVBCQq4lxFocFoU6XCNCru6yoRtibztKyWibplXvf2uiam7rMdLREHxTbDm9ktnKL8p3oKfWGNETl2yytDZn0b3ztBvbDpsr74t3YPibYV0/640?wx_fmt=png&from=appmsg "")  
> **总结：工具再好也只是辅助，核心还是思路。AI 帮你省去重复劳动，但漏洞思维还得靠自己积累。**  
  
  
