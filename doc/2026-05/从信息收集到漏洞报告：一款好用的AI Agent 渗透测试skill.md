#  从信息收集到漏洞报告：一款好用的AI Agent 渗透测试skill  
原创 0x八月
                    0x八月  0x八月   2026-05-03 12:25  
  
# 从信息收集到漏洞报告：一款好用的AI Agent 渗透测试skill  
  
⚠️  
  
    请勿利用文章内的相关技术从事  
**非法渗透测试**  
，由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。  
**工具和内容均来自网络，仅做学习和记录使用，安全性自测，如有侵权请联系删除。**  
  
⚠️注意：现在只对常读和星标的公众号才展示大图推送，建议大家把"  
**0x八月**  
"设为星标⭐️"否则可能就看不到了啦  
,  
点击下方卡片关注我哦！  
  
**💡项目地址在文章底部哦！**  
  
  
## 📖 项目/工具简介  
  
**claude-code-pentest**  
 是一款 **纯Python渗透测试自动化Skills套件**  
，集成43个脚本覆盖侦察到报告全流程，无需编程基础  
 即可运行。  
  
Skills如何进行使用可以参考下面的文章来学习和使用，下面的的文章来自C4安全团队，需要的师傅可以参考来进行学习：  
  
[AI Agent 渗透测试skill实战测试（二）](https://mp.weixin.qq.com/s?__biz=MzkzMzE5OTQzMA==&mid=2247490292&idx=1&sn=c212d4110755e7f8f9a5161455050501&scene=21#wechat_redirect)  
  
## 🚀 一句话优势  
  
 通过 **43个零依赖脚本**  
 将渗透测试压缩为单域名输入，解决初学者工具链配置复杂痛点。  
## 📋 核心能力速览  
  
<table><thead><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">功能</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">说明</span></section></th></tr></thead><tbody><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">域名侦察</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">自动收集子域名与IP信息</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">漏洞扫描</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">检测常见安全弱点与入口</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">利用链测试</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">串联漏洞验证深度访问</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">报告生成</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">输出漏洞赏金式文本报告</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">模块化配置</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">通过文本文件自定义扫描项</span></section></td></tr></tbody></table>  
## ✨ 核心亮点  
  
### 1. 零依赖纯Python架构  
  
 套件由 **43个独立Python脚本**  
 组成，不依赖第三方库或外部工具。你只需安装 Python 3.8+ 即可运行全部功能，无需配置 nmap、masscan  
 等复杂环境。这种设计让 Windows 用户也能在 5 分钟内完成部署，降低了渗透测试的入门门槛。  
### 2. 漏洞赏金式报告  
  
扫描完成后自动生成 **结构化文本报告**  
，包含漏洞描述、风险等级与修复建议。报告格式参考 漏洞赏金平台标准  
，可直接用于提交或内部评审。你只需编辑简单的文本配置文件，即可调整报告模板与扫描深度。  
### 3. 模块化工作流  
  
6个主工具按 **侦察→扫描→利用→报告**  
 顺序编排，每个阶段可独立运行或跳过。通过修改纯文本配置文件选择特定模块，无需编程知识  
 即可定制测试范围。这种设计让不同经验水平的用户都能找到适合的操作粒度。  
## 🛠️ 技术优势  
  
<table><thead><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">技术/特性</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">说明</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">优势</span></section></th></tr></thead><tbody><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">Python原生</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">纯标准库实现43个脚本</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">零依赖，跨平台兼容</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">文本配置</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">通过简单文本文件调整参数</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">非技术人员可修改</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">单域名输入</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">仅需提供目标域名启动</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">降低操作复杂度</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">利用链验证</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">串联多漏洞测试深度访问</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">发现隐藏攻击路径</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">报告模板</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">内置漏洞赏金格式</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">可直接用于提交</span></section></td></tr></tbody></table>  
## 📖 使用指南  
  
① **准备工作**  
（环境搭建）  
  
从 Release 下载压缩包并解压，确保已安装 Python 3.8+  
 并勾选 添加至 PATH  
 选项  
  
② **核心操作**  
（启动扫描）  
  
在解压目录执行 python main.py  
，输入 目标域名  
，按提示选择扫描模块与深度。工具自动完成 **子域名收集、IP探测、漏洞扫描**  
 等步骤，通Claude/OpenCode等相关工具调用。  
  
③ **结果查看**  
（报告分析）  
  
扫描完成后在输出目录查看 **文本格式报告**  
，包含漏洞详情与修复建议，支持直接用于漏洞赏金提交  
  
## 📖 项目地址  
  
  
```
https://github.com/KaQus/claude-code-pentest
```  
## 💻 技术交流与学习  
  
      
如果师傅们想要第一时间获取到  
**最新的威胁情报**  
，可以添加下面我创建的  
**钉钉漏洞威胁情报群**  
，便于师傅们可以及时获取最新的  
**IOC**  
。  
  
    如果师傅们想要获取网络安全相关知识内容，可以添加下面我创建的  
**网络安全全栈知识库**  
，便于师傅们的学习和使用：  
  
覆盖渗透、安服、运营、代码审计、内网、移动、应急、工控、AI/LLM、数据、业务、情报、黑灰产、SRC、溯源、钓鱼、区块链等  方向，  
**内容还在持续整理中......**  
。  
  
⚠️  
打广告的勿进，会直接踢掉！！！  
  
  
<table><thead><tr style="border-width: 0px;border-style: none;border-color: currentcolor;background-color: transparent;"><th style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODzDcbialtDJB2iauRibULjWbzQk2oeHEyuNcGjibhWw6SpJia0RYGY3D7UhMASYr1QPAicb1LaSL1XlDrVowaibjeB41IKYSBHE8z9sN8/640?wx_fmt=png&amp;from=appmsg" class="rich_pages wxw-img" data-ratio="0.7916666666666666" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;display: block;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-backw="289.33334" data-backh="229.33334" data-imgfileid="100003716" data-aistatus="1"/></section></th><th style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-backh="0.33333999999999975" data-backw="0.33333999999999975" data-imgfileid="100003715" data-ratio="0.625" data-src="https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODwMu4dL9ZhibwZKibzwdD01Btq6ia2183uH0ibzaGibkr1aribDe1jicrtW0px8pd6Rz1kT7QpTtzfdmicibiaFZHSqI40srWZhLQ9HpR1JY/640?wx_fmt=png&amp;from=appmsg" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;display: block;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;"/></section></th></tr></thead></table>  
### 推荐阅读  
  
  
✦ ✦ ✦  
  
<table><thead><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><th data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);background: rgb(255, 217, 61);text-align: left;text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;word-break: break-all;"><section style="text-align: center;"><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485592&amp;idx=1&amp;sn=818004a6d625c4c4112ce73b83433854&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">渗透测试人员必备武器库：子域名爆破、漏洞扫描、内网渗透、工控安全工具全收录</a></span></section></th></tr></thead><tbody><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485309&amp;idx=1&amp;sn=292afbe37fb95c64f33470f915b0c54e&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI驱动的自动化红队编排框架(AutoRedTeam-Orchestrator)跨平台支持，集成 130+ 安全工具与 2000+ Payload</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247486181&amp;idx=1&amp;sn=3ace47da643c72cec0d615aeccb955ac&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">JS逆向必备：这款插件能Bypass Debugger、Hook CryptoJS、抓取路由</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485488&amp;idx=1&amp;sn=a37acb031febe69db608de53ddee5732&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">上传代码即审计：AI 驱动的自动化漏洞挖掘与 POC 验证平台</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485208&amp;idx=1&amp;sn=b5181181c1e0800124e3e099706ef2ef&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI 原生安全测试平台(CyberStrikeAI)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485805&amp;idx=1&amp;sn=8f374a239135f6a753d5cce887f8318b&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">多Agent智能协作+40+工具调用：基于大模型的端到端自动化漏洞挖掘与验证系统</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485314&amp;idx=1&amp;sn=56082cd314311ffc15cc0bcf03a395e2&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于DeepSeek的代码审计工具 (Ai-SAST-tool.xjar)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485127&amp;idx=1&amp;sn=b5eb3fdc1cc23976011e2bca396c1bc7&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于AI的自主渗透测试平台 </a></span></section></td></tr></tbody></table>  
  
✦ ✦ ✦  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnAqueibZX8s1IJDIlA8UJmu3uWsZUxqahoolciaqq65A30ia93jCyEwTLA/640?wx_fmt=gif&from=appmsg "")  
  
**点分享**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJniaq4LXsS43znk18DicsT6LtgMylx4w69DNNhsia1nyw4qEtEFnADmSLPg/640?wx_fmt=gif&from=appmsg "")  
  
**点收藏**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnev2xbu5ega5oFianDp0DBuVwibRZ8Ro1BGp4oxv0JOhDibNQzlSsku9ng/640?wx_fmt=gif&from=appmsg "")  
  
**点在看**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnwVncsEYvPhsCdoMYkI6PAHJQq4tEiaK3fcm3HGLialEMuMwKnnwwSibyA/640?wx_fmt=gif&from=appmsg "")  
  
**点点赞**  
  
  
