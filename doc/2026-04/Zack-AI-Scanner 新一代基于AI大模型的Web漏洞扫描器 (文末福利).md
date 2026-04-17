#  Zack-AI-Scanner 新一代基于AI大模型的Web漏洞扫描器 (文末福利)  
 星悦安全   2026-04-17 06:37  
  
## 0x00 前言  
  
Zack-AI-Scanner 是一款依托大语言模型的自动化 Web 漏洞扫描工具，作为 Burp Suite 扩展插件运行。它采用 AI 深度学习技术，自动解析 HTTP 请求的特征，智能识别潜在的安全漏洞，动态创建有针对性的测试 Payload，并自动验证漏洞的真实性。  
  
![image-20260413002103071](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSotffgeN2hr9Fr7ISYbDMicHa05QaLibkabtPaGSVVjfFUxpc21dDMia6wQfFAARwZKAegNcwlGLCPsbsVw9ymaGQKObkgduGicQC0/640?wx_fmt=png&from=appmsg "")  
![image-20260413001605897](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSqaYzeEWtPKQKEapAvtEL96ktJAXXFvNhibFV5eIx5ybJ1icFBhAoVsWILjriaadVYJgCjtuXxDqBEicsZd0kDiayAYLTpmkF3SZjcg/640?wx_fmt=png&from=appmsg "")  
  
项目地址 :   
https://github.com/ZackSecurity/Zack-AI-Scanner  
## 0x01 核心功能 & 技术栈  
## 核心功能  
- **AI 智能扫描：通过内置的 Skills，利用大语言模型自动分析请求并制定测试策略。**  
- **漏洞类型广泛支持：支持 17 种常见 Web 漏洞的检测。**  
- **WAF 绕过能力：集成多种 WAF 绕过技术，50% 载荷为绕过载荷。**  
- **实时验证：AI 二次验证确保漏洞的真实性，置信度阈值 ≥90%。**  
- **报告格式多样：可导出 HTML 和 Markdown 格式的渗透测试报告。**  
## 技术栈  
<table><thead><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">组件</span></section></th><th data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">技术选型</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">开发语言</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">Java 17</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">构建工具</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">Maven (maven-shade-plugin)</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">扩展框架</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">Burp Extender API 2.3</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">JSON 处理</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">Gson 2.10.1</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">HTTP 客户端</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">OkHttp3 4.12.0</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">GUI 框架</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">Swing (Java 内置)</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">配置存储</span></section></td><td data-colwidth="261" style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section style="text-align: center;"><span leaf="">JSON 文件 (~/.zackai_config.json)</span></section></td></tr></tbody></table>## 支持的漏洞类型  
<table><thead><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">漏洞类型</span></section></th><th style="box-sizing: border-box;padding: 6px 13px;font-weight: 600;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">说明</span></section></th></tr></thead><tbody><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">SQL_INJECTION</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">SQL 注入</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">XSS</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">跨站脚本攻击</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">COMMAND_INJECTION</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">命令注入</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">FILE_UPLOAD</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">文件上传漏洞</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">SSRF</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">服务端请求伪造</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">XXE</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">XML 外部实体注入</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">FILE_INCLUDE</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">文件包含漏洞</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">SSTI</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">模板注入</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">CSRF</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">跨站请求伪造</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">DESERIALIZATION</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">反序列化漏洞</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">AUTH_BYPASS</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">越权/认证绕过</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">PATH_TRAVERSAL</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">路径遍历</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">DIRECTORY_TRAVERSAL</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">目录穿越</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">SENSITIVE_DATA_EXPOSURE</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">敏感信息泄露</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">LOGIC_FLAW</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">逻辑漏洞</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(246, 248, 250);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">RACE_CONDITION</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">条件竞争</span></section></td></tr><tr style="box-sizing: border-box;background-color: rgb(255, 255, 255);border-top: 0.8px solid rgba(209, 217, 224, 0.7);"><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">TYPE_CONFUSION</span></section></td><td style="box-sizing: border-box;padding: 6px 13px;border-color: rgb(209, 217, 224);border-style: solid;border-width: 0.8px;border-image: none 100% / 1 / 0 stretch;"><section><span leaf="">类型混淆</span></section></td></tr></tbody></table>## 支持的 AI 服务提供商  
- OpenAI (GPT-4, GPT-3.5)  
  
- Anthropic (Claude)  
  
- Google Gemini  
  
- Azure OpenAI  
  
- 通义千问 (阿里云)  
  
- 文心一言 (百度)  
  
- 智谱 AI (GLM)  
  
- Kimi (月之暗面)  
  
- DeepSeek  
  
- 讯飞星火  
  
- 字节豆包  
  
- 腾讯混元  
  
- 百川智能  
  
- MiniMax  
  
- 零一万物  
  
- 阶跃星辰  
  
## 0x02 快速开始  
### 安装  
1. 构建项目: mvn clean package  
  
1. 在 Burp Suite 的 Extender 标签页加载生成的 JAR 文件  
  
### 配置  
1. 点击 "配置" 按钮打开配置中心  
  
1. 选择 AI 服务提供商并输入 API Key  
  
1. 点击 "获取模型" 按钮获取可用模型列表  
  
1. 保存配置后即可开始使用  
  
### 使用  
1. 在 Burp Suite 的 Proxy 或其他模块中选择 HTTP 请求  
  
1. 右键点击，选择 "Zack-AI-Scanner" 菜单  
  
1. 选择扫描模式（AI 智能扫描或特定漏洞类型）  
  
1. 在主面板查看扫描进度和结果  
  
1. 导出漏洞报告  
  
## 目录结构  
```
src/main/java/com/zackai/
├── AISentryExtender.java    # Burp 扩展主入口
├── core/                    # 核心功能模块
│   ├── AIEngine.java        # AI 扫描引擎
│   └── ConfigManager.java   # 配置管理器（单例）
├── model/                   # 数据模型
│   ├── ScanTask.java        # 扫描任务模型
│   ├── VulnResult.java      # 漏洞结果模型
│   └── AIProvider.java      # AI 服务提供商模型
├── ui/                      # UI 组件
│   ├── MainPanel.java       # 主面板
│   ├── TaskTablePanel.java  # 任务表格
│   ├── TaskDetailPanel.java # 任务详情
│   ├── LogPanel.java        # 日志面板
│   ├── ConfigDialog.java    # 配置对话框
│   ├── ExportDialog.java    # 导出对话框
│   ├── EndpointManagerDialog.java  # 端点管理
│   ├── PromptPanel.java     # 提示词管理
│   └── HelpPanel.java       # 帮助面板
└── util/                    # 工具类
    └── ReportGenerator.java # 报告生成器
```  
## 插件使用实例  
  
配置大模型API Key信息：  
##   
  
右击请求包->拓展->Zack-AI-Scanner调用工具，可选择AI智能扫描和单漏洞扫描：  
##   
  
日志统计窗口可实时查看扫描信息：  
##   
  
请求与响应详情窗口可以查看实时的扫描流量：  
  
![image-20260413002258241](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSrSaibiad8L7S7HZS6yV30nrnRBzNKJGPG4Yib5cgATpP9Pmk8NMYDhaibloZJibRichjjYPqJ8cgzupmia48rIyLuEkUynhQAoN4IlRA/640?wx_fmt=png&from=appmsg "")  
  
在任务列表窗口可以查看所有扫描任务和状态，扫描结束导出漏洞报告，支持 HTML 和 Markdown 格式：  
  
![image-20260413002603746](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSqzM58tmynYBHgIQibKRXNicgnB8P6caQJg8o3wPrXNufLs8CXevD4m0lFzleWfltTbLwvSR93uMnn5lExoLXc4UUjck4ZOPDC8s/640?wx_fmt=png&from=appmsg "")  
![image-20260413002646611](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSojjU5agayqvUMzvqaCsdvBTP7zHickE4ArvYFibseNhNgGicVw5Pyb7WCRRmANKCicBWhsafGu1y8icja4xCuHaibH4AksIgice5pjP4/640?wx_fmt=png&from=appmsg "")  
  
HTML 和 Markdown 格式报告内容：  
  
![image-20260413003256031](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSqRPIFvMSOJyBEdlSGhrvBORJfWic9QrghRz0ELTeRia2eicRSxw0eby7CEqxMjjvq9vlf6xk6QGibYQhtIs9NtAcW16A4ib2xqRS9M/640?wx_fmt=png&from=appmsg "")  
  
![image-20260413003211829](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSrY093n3rpTlGNEUKDYAb26yvsHdNtE6CianT9Ru8vsWw8x8gh7n7szWVS7KNtMblNM410ZpZeq1DLeedaxxfVMFIcDlyStoCe8/640?wx_fmt=png&from=appmsg "")  
## 免责声明  
  
本工具仅供教育和授权测试使用！旨在帮助安全研究人员、渗透测试人员和IT专业人员在**获得明确授权**  
的情况下进行安全评估和漏洞研究。  
  
**使用本工具即表示您同意：**  
- 仅在您拥有明确书面授权的系统上使用此工具  
  
- 遵守所有适用的法律法规和道德准则  
  
- 对任何未经授权的使用或滥用行为承担全部责任  
  
- 不会将本工具用于任何非法或恶意目的  
  
## 0x03 星悦AI中转站  
  
而想要高速率使用国外顶级AI模型，如ChatGPT 5.4 / Claude-Opus 4.6 那就需要找到一个好用的中转站.  
  
![](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSoFenib0R0YIxlIRRib0gA9JguDib2rQG80LfhqET1QXPsoNDreXA2W4TsUG0iajV1LBTkiaRacdibQ4E39bPHbtlQe6ibrc4vGtp6Udk/640?wx_fmt=png&from=appmsg "")  
  
我这里为大家能舒适使用，给大家构建了一个中转站，主营Openai / Claude ，后期会上线别的模型，而且是最快速 最安全的，不像某些所谓的公益站会往你的电脑里塞入后门.  
  
中转站地址 :   
https://xyusec.com/  
  
现在注册送10$额度，能随便用 GPT5.4 和 Claude-Opus-4.6（限前60名，后面的注册送5$）  
  
目前模型列表:  
  
![](https://mmbiz.qpic.cn/mmbiz_png/De3yb4u5JSq0CPicY6xzMTp4EPnVXHGd5njEyAOAibWMGV3gcUiaM6lKMrYVVe82hWO0fkb19XicX4HJP5hdjKE4snTJ3unk5ibytbPQQle1UscM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/De3yb4u5JSpxPRNBm6wHufRtPoQmLyPzAxVFHreeFcIDR08NPlorPyxvRZOdXlj0fkhXOJSD1yWpxDK5dibMVpm7ibYfiaDo6RR00puUA3YIq8/640?wx_fmt=png&from=appmsg "")  
## 0x04 20$兑换码获取  
  
**标签:代码审计，0day，渗透测试，系统，通用，0day，闲鱼，交易所**  
  
**5个20$兑换码，发送 260417 获取(先到先得).**  
  
****  
  
****  
**免责声明:文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由读者承担全部法律及连带责任，文章作者和本公众号不承担任何法律及连带责任，望周知！！!**  
  
