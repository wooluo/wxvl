# 微信公众号安全漏洞知识库

[![GitHub Actions](https://github.com/gelusus/wxvl/actions/workflows/update_today.yml/badge.svg)](https://github.com/gelusus/wxvl/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 目录
- [项目功能](#-项目功能)
- [数据来源](#-数据来源)
- [内容筛选规则](#-内容筛选规则)
- [技术实现](#-技术实现)
- [使用方法](#-使用方法)
- [知识库集成](#-知识库集成)
- [安全分析模板](#-安全分析模板)

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
```
复现|漏洞|CVE-\d+|CNVD-\d+|CNNVD-\d+|XVE-\d+|QVD-\d+|
POC|EXP|0day|1day|nday|RCE|代码执行|命令执行
```

## 🛠️ 技术实现
- 使用 [wechatmp2markdown](https://github.com/fengxxc/wechatmp2markdown) 转换格式
- 智能处理特殊字符生成合规文件名
- 按年月分类存储：`doc/yy-mm/`
- 通过`data.json`记录已处理链接

## ⚙️ 使用方法
### 自动运行
GitHub Actions 每4小时自动执行

### 手动运行
```bash
# 抓取当日新文章
python run.py today

# 抓取历史文章（更改脚本后使用）
python run_history.py history
```

## 🧠 知识库集成
1. 克隆仓库：
```bash
git clone git@github.com:wooluo/wxvl.git
```

2. AI集成方案：
- 硅基流动云端模型（[注册送Tokens](https://cloud.siliconflow.cn/i/K1xxyDSS)）
- CherryAI本地客户端（[下载](https://www.cherry-ai.com/)）加载`doc/`目录

## 📝 安全分析模板
````markdown
# [🔒] 安全分析：{漏洞名称}

**威胁等级**：{CRITICAL/HIGH/MEDIUM}  
**影响范围**：{受影响系统/版本}

## 技术细节
{知识库提取内容}

```poc
# POC代码片段
{示例代码}
```

![示意图](图片路径.png)
[来源：文件名.md]
````

## ©️ 许可证
MIT License
```

这个版本优化了：
1. 增加了目录导航
2. 精简了技术描述
3. 突出了关键操作步骤
4. 保持Markdown兼容性
5. 优化了移动端显示效果
