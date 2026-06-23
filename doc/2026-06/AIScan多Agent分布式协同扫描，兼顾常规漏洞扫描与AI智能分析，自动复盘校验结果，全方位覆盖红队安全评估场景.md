#  AIScan多Agent分布式协同扫描，兼顾常规漏洞扫描与AI智能分析，自动复盘校验结果，全方位覆盖红队安全评估场景  
M09Ic
                    M09Ic  渗透安全HackTwo   2026-06-22 16:03  
  
0x01 工具介绍  
  
**AIScan 是一款融合多Agent分布式协同能力的智能安全扫描工具，兼顾传统常规漏洞扫描的精准性与大模型AI智能分析能力。支持自动复盘、校验扫描结果，有效规避误报、漏报问题。依托自研IOA协作协议，可实现多节点自主组网、任务分摊，适配单机测试与大规模内网巡检场景，全方位覆盖日常资产巡检、渗透测试等各类红队安全评估工作。**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWia93TWqJv0svF1PSqI3ria5eUT2rjSoBLubJgAySxfTxR5XIYjTnibsa4hohk3zhxrZv9cSyAQGrgCZNvxuxrO9YopOwIzV9eFg/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
  
  
  
注意：  
现在只对常读和星标的公众号才展示大图推送，建议大家把  
**渗透安全HackTwo**  
"**设为****星标⭐️**  
"  
**否****则可能就看不到了啦！**  
  
**下载地址在末尾 #渗透安全HackTwo**  
  
0x02   
功能介绍  
  
✨核心能力  
  
### 设计理念  
- **单文件、零依赖**  
 — 静态链接，开箱即用  
  
- **极简 agent 内核**  
 — 可组合的 ~160 行循环；工具、重试、评估均为插拔式，非硬编码  
  
- **插件式架构**  
 — 新增工具只需一个文件；重依赖（playwright、katana）编译期可选  
  
- **内嵌 Skill**  
 — 每个工具自带用法文档和战术指导，agent 按需加载  
  
- **Scan + Agent 统一**  
 — 同一套引擎驱动确定性流水线和自主 agent  
  
### Scan — 确定性扫描流水线  
- 多阶段自动串联：端口发现 → Web 探测 → 弱口令检测 → POC 检测，无需 LLM  
  
- 可选 AI 驱动的结果验证、公开漏洞关联和动态测试  
  
- quick 模式快速暴露面发现，full 模式深度爬取和扩展覆盖  
  
![](https://mmbiz.qpic.cn/mmbiz_png/ibrevicNauKAWGxz5YQSOY4cBoRglVg2ZHibCd0Y1FibdlLTCRBSwQsAn4AkpicJeqxztbNOGUMXL301ghbsa4gCGNR5Kzd3qX9ZYyeU64AvV8lc/640?wx_fmt=png&from=appmsg "")  
### Agent — 自主安全评估  
- 自然语言描述任务，agent 自主规划、扫描、分析、输出结论  
  
- Goal Evaluation — 独立评估器判定任务完成度，自动驱动重试  
  
- 交互式 REPL，支持直接执行命令  
  
- 多 provider 容错降级  
  
### IOA — 多 Agent 协作  
- 共享消息空间实现分布式 agent 协调  
  
- Worker 模式持续监听任务  
  
- 内置 IOA server，支持 token 认证  
  
- 参阅：  
设计理念  
 |   
CLI 文档  
 |   
扩展开发  
  
### 内置工具集  
  
**扫描器**  
- gogo  
 — 端口、服务、banner 发现  
  
- spray  
 — Web 探测、指纹识别、路径 fuzz  
  
- zombie  
 — 弱口令检测  
  
- neutron  
 — 模板化 POC 执行  
  
- cyberhub  
 — 指纹和 POC 关联查询  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/ibrevicNauKAV1lPI7nGHTZUKTT6EEcE3VsJjXA9deBwI5KY6L29h0vB5rwqwEicxJJsz9Vmc1PrF2ctWffNuBzoicVbxT2g8iaT97Mynw0gV8q4/640?wx_fmt=png&from=appmsg "")  
  
**浏览器 & 侦察**  
（完整版）  
- playwright — headless Chromium 会话、截图、网络捕获  
  
- katana — Web 爬虫，支持 standard/headless/hybrid 引擎  
  
- passive — 网络空间搜索（FOFA、Hunter、Shodan）  
  
**辅助工具**  
- tmux — 后台任务会话，增量输出自动推送  
  
- arsenal — 安全工具包管理器（  
crtm  
），一键安装  
  
- proxy — 多协议代理链（trojan/vless/anytls/hy2/ss）  
  
- web_search / fetch — CVE 搜索和 URL 抓取  
  
###   
  
0x03 更新介绍  
  
```
新增 Arsenal（crtm）安全工具包管理器；Playwright 新增 -s 全局 session flag；TUI verbose 渲染全面重设计；命令接口统一为全局 OutputWriter；4 平台 PTY 文件整合为单一 go-pty wrapper。
```  
  
  
0x04 使用介绍  
  
📦安装与使用指南  
### Scan 模式  
```
aiscan scan -i 192.168.1.0/24                                    # 快速扫描
aiscan scan -i 192.168.1.0/24 --mode full                        # 完整扫描
aiscan scan -i http://target.example --verify=high --sniper       # AI 增强
aiscan scan -i http://target.example --mode full --deep --report  # 完整 + 深度 + 报告
```  
### Agent 模式  
```
# 一次性任务
aiscan agent -p "扫描目标，发现所有 Web 服务并检查高风险漏洞" -i 192.168.1.0/24
# 带 Goal Evaluation
aiscan agent -p "全面扫描目标" -i http://target.example -e "发现所有开放端口并输出服务指纹"
# 交互式 REPL
aiscan agent
```  
### IOA 模式  
```
# 启动 IOA Server
aiscan ioa serve --ioa-url http://0.0.0.0:8765
# 启动 IOA worker
aiscan agent --ioa-url http://127.0.0.1:8765 --space pentest-project \
  -p "scan assigned targets and report findings"
```  
### LLM 配置  
```
# 环境变量
export OPENAI_API_KEY="sk-..."
# CLI 参数
aiscan agent --provider deepseek --base-url https://api.deepseek.com --api-key sk-... --model deepseek-chat
```  
  
配置文件   
~/.config/aiscan/config.yaml  
：  
```
llm:
  provider: openai
  api_key: sk-...
  model: gpt-4o
```  
  
  
**0x05 内部VIP星球介绍-V1.5（福利）**  
  
          
如果你想学习更多**渗透测试技术/应急溯源/免杀工具/挖洞SRC赚取漏洞赏金/红队打点等**  
欢迎加入我们**内部星球**  
可获得内部工具字典和享受内部资源和  
内部交流群，  
**每天更新1day/0day漏洞刷分上分****(2026POC更新至8922+)**  
**，**  
包含全网一些**付费扫描****工具及内部原创的Burp自动化漏****洞探测插件/漏扫工具等，AI代审工具，最新挖洞技巧等**  
。shadon/  
Hunter  
/  
0zone  
/  
Zoomeye  
/Quake/  
Fofa高级会员/AI账号  
/CTFShow等各种账号会员共享。详情点击下方链接了解，觉得价格高的师傅后台回复"   
**星球**  
 "有优惠券名额有限先到先得  
**❗️**  
啥都有  
**❗️**  
全网资源  
最新  
最丰富  
**❗️****（🤙截止目前已有2800+多位师傅选择加入❗️早加入早享受）**  
  
****  
最新漏洞情报分享：  
https://t.zsxq.com/DSAvv  
  
****  
  
**👉****点击了解加入-->>内部VIP知识星球福利介绍V1.5版本-1day/0day漏洞库及内部资源更新**  
  
****  
  
  
结尾  
  
# 免责声明  
  
  
# 获取方法  
  
  
**公众号回复20260623获取下载、回复 加群 获取交流群**  
  
****  
  
# 最后必看-免责声明  
  
  
      
文章中的案例或工具仅面向合法授权的企业安全建设行为，如您需要测试内容的可用性，请自行搭建靶机环境，勿用于非法行为。如  
用于其他用途，由使用者承担全部法律及连带责任，与作者和本公众号无关。  
本项目所有收录的poc均为漏洞的理论判断，不存在漏洞利用过程，不会对目标发起真实攻击和漏洞利用。文中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用。  
如您在使用本工具或阅读文章的过程中存在任何非法行为，您需自行承担相应后果，我们将不承担任何法律及连带责任。本工具或文章或来源于网络，若有侵权请联系作者删除，请在24小时内删除，请勿用于商业行为，自行查验是否具有后门，切勿相信软件内的广告！  
  
  
  
# 往期推荐  
  
  
**1.内部VIP知识星球福利介绍V1.5（AI自动化）**  
  
**2.CS4.8-CobaltStrike4.8汉化+插件版**  
  
**3.全新升级BurpSuite2026.4专业(稳定版)**  
  
**4. 最新xray1.9.11高级版下载Windows/Linux**  
  
**5. 最新HCL AppScan Standard**  
  
  
渗透安全HackTwo  
  
微信号：关注公众号获取  
  
后台回复星球加入：  
知识星球  
  
扫码关注 了解更多  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/RjOvISzUFq6qFFAxdkV2tgPPqL76yNTw38UJ9vr5QJQE48ff1I4Gichw7adAcHQx8ePBPmwvouAhs4ArJFVdKkw/640?wx_fmt=png "二维码")  
  
  
  
上一篇文章：  
[Nacos配置文件攻防思路总结|揭秘Nacos被低估的攻击面](https://mp.weixin.qq.com/s?__biz=Mzg3ODE2MjkxMQ==&mid=2247492839&idx=1&sn=b6f091114fbd8e8922153a996c8f4f1c&scene=21#wechat_redirect)  
  
  
