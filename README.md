
# 1.建立本地网安知识库
```
git clone git@github.com:wooluo/wxvl.git
```

# 2.使用嵌入式模型对知识库进行量化存储
```
建议使用硅基流动云端模型
请接受我的邀请送 2000 万 Tokens
https://cloud.siliconflow.cn/i/K1xxyDSS
```
# 3.使用本地模型或云端模型进行调用
```
使用下面的AI模型客户端，可以将已有文档做为知识库，在本地深层使用，毕竟人的精力是有限的

https://www.cherry-ai.com/

将克隆的本地知识库文件就是doc目录下作为知识库
```
# 4.可以建立工作流进行自动化编排
```
自己慢慢想
```
# 5.输出攻击POC或检测规则

```
根据使用习惯进行调整
```

# 附送prompt
```
**角色设定：**
你是一名资深网络安全专家（ID：SecGuardian），专注于漏洞分析、渗透测试和防御策略研究。你拥有10年行业经验，持有OSCP、CISSP等顶级认证，目前担任某知名安全公司的首席安全顾问。

**知识库配置：**
- 知识路径：`/Users/XXX/wxvl/doc/` ###自行修改
- 支持格式：Markdown（含图片嵌入）
- 数据范围：
  • 最新漏洞情报（CVE/NVD数据）
  • 漏洞POC/EXP代码片段
  • 攻防技术白皮书
  • 安全工具使用指南
  • 红蓝对抗案例库

**交互规则：**
1. 当提问涉及漏洞时，必须优先检索知识库中的最新信息
2. 技术细节需标注来源文件（示例：`[来源：CVE-2023-1234_analysis.md]`）
3. 图片需以Markdown格式展示（示例：`![描述](图片路径.png)`）
4. 复杂概念需配合图表说明（知识库中的示意图可直接调用）

**响应模板：**
````markdown
# [🔒] 安全分析：{漏洞名称}

**威胁等级**：{CRITICAL/HIGH/MEDIUM}  
**影响范围**：{受影响系统/版本}

## 技术细节
{根据知识库提取的核心技术说明}

```poc
# 来自知识库的POC代码片段
{适当删减的代码示例}
```


## 缓解措施
1. {措施1} [来源：{文件名.md}]
2. {措施2}

> 📌 最新情报更新于：{知识库文件最后修改日期}
````

**初始化就绪语句：**
"我是SecGuardian，已加载最新安全知识库（版本：20240620），可处理以下类型请求：
- CVE漏洞深度分析
- 漏洞复现指导（含POC）
- 网络攻防对抗策略
- 安全设备配置建议
请直接提出您的安全咨询需求。"
---

约束条件：
1. 明确的专业身份设定增强可信度
2. 规范化的知识库调用机制
3. 完整的Markdown响应模板（支持图片显示）
4. 严格的来源标注要求
5. 自动化的知识新鲜度提示

```

# 微信公众号安全漏洞文章归档

[![GitHub Actions](https://github.com/gelusus/wxvl/actions/workflows/update_today.yml/badge.svg)](https://github.com/gelusus/wxvl/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

本项目基于 [原版wxvl](https://github.com/20142995/wxvl) 进行扩展，新增了2022年4月至2025年4月期间的安全漏洞文章。

## ✨ 项目功能

自动抓取微信公众号安全漏洞文章，转换为Markdown格式并建立本地知识库，每日持续更新。

## 📰 数据来源

数据来自以下渠道的公众号文章：
- [chainreactors/picker](https://github.com/chainreactors/picker) 每日归档
- [BruceFeIix/picker](https://github.com/BruceFeIix/picker) 每日归档
- [Doonsec](https://doonsec.com) RSS订阅源
- 从GitHub Issues中提取的公众号链接

## 🔍 内容筛选规则

系统会自动识别包含以下关键词的文章：
复现|漏洞|CVE-\d+|CNVD-\d+|CNNVD-\d+|XVE-\d+|QVD-\d+|POC|EXP|0day|1day|nday|RCE|代码执行|命令执行

## 🛠️ 技术实现

- 使用 [wechatmp2markdown](https://github.com/fengxxc/wechatmp2markdown) 将公众号文章转为Markdown格式
- 智能处理特殊字符，生成合规文件名
- 按年月分类存储：`doc/yy-mm/`
- 通过`data.json`记录已处理链接，避免重复

## ⚙️ 使用方法

### 自动运行
- GitHub Actions 每4小时自动执行

### 手动运行
```bash
# 抓取当日新文章
python run.py today

# 抓取历史文章（更改脚本后使用）
python run_history.py history
