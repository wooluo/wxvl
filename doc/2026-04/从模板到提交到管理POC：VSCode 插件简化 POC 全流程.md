#  从模板到提交到管理POC：VSCode 插件简化 POC 全流程  
原创 0x八月
                    0x八月  0x八月   2026-03-31 15:43  
  
# 从模板到提交到管理POC：VSCode 插件简化 POC 全流程  
  
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
  
  vscode-plugin-poc 是一款基于 **pocsuite3 框架**  
的 VSCode 插件，提供 POC 模板生成  
、漏洞平台一键提交  
、代码片段补全等功能，帮助**安全研究人员**  
快速完成漏洞验证代码的开发与管理，提升 POC 编写标准化程度。  
## 🚀 一句话优势  
  
**右键即生成 POC 模板**  
，一键提交漏洞平台，告别重复性代码编写。  
## 📋 核心能力速览  
  
<table><thead><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">功能</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">说明</span></section></th></tr></thead><tbody><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">新建 POC</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">右键生成 pocsuite3 标准模板</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">提交 POC</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">一键提交到漏洞管理平台</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">代码片段</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">常用 POC 代码快速补全</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">本地扫描</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">快速创建本地扫描任务</span></section></td></tr></tbody></table>  
## 📸 运行截图  
  
<table><thead><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">功能模块</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">截图</span></section></th></tr></thead><tbody><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">右键新建 POC 菜单</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section nodeleaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-imgfileid="100003615" data-ratio="0.5675925925925925" data-src="https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODz8h6q2V6ibiaZxU0yiaq9EEbDWR0k1RWF05KS7QIu507icpcHZ2Vu3mksF4sHLLcJlibgiayc7hZ0PBYoD13caEFpAntqgjffbdv06E/640?wx_fmt=png&amp;from=appmsg" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;box-sizing: border-box;display: block;max-width: 100%;border-radius: 4px;border: 4px solid rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s ease 0s;"/></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">POC 模板生成效果</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section nodeleaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-imgfileid="100003614" data-ratio="0.6129629629629629" data-src="https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODyaFxcsYd79KuI4qpxggN6RFcLofBRuyEMvqNXf4DK2FDOiaLjPv3gFKko1cDvJAHQQvdproibPHHAicucKHyia6h1pKCGa3O4cEPE/640?wx_fmt=png&amp;from=appmsg" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;box-sizing: border-box;display: block;max-width: 100%;border-radius: 4px;border: 4px solid rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s ease 0s;"/></section></td></tr></tbody></table>  
## ✨ 核心亮点  
  
### 1. pocsuite3 标准化模板生成  
  
  右键资源管理器任意文件夹，选择**"新建POC"**即可自动生成基于 pocsuite3  
 框架的标准化 POC 结构，包含 **vulID**  
、name  
、author  
、type、level、cve 等元数据字段，以及 **_verify**  
、_attack  
、check  
 三个核心方法模板。支持 **SQL注入**  
、命令执行  
、文件读取  
 等常见漏洞类型选择，自动填充对应检测逻辑框架，减少 80% 的重复代码编写工作。  
  
### 2. 漏洞管理平台无缝集成  
  
  插件深度集成漏洞管理平台，在 POC 文件编辑器中右键选择**"提交POC"**，自动解析文件中的元数据（如漏洞名称、危害等级、CVE 编号等），智能判断漏洞记录是否存在：已存在则**  
自动更新**，不存在则创建新记录  
。支持 HTTP/HTTPS  
 协议，配置简单（仅需设置平台地址、用户名、密码），实现**开发-提交-管理**  
闭环。  
  
### 3. 代码片段智能补全  
  
  内置多个实用代码片段，输入 **poc**  
 前缀按 Tab 键即可插入完整 POC 模板，输入 get_files_info  
 或 read_file  
 快速插入文件操作相关代码。覆盖 POC 开发中的高频代码模式，配合 VSCode 的 IntelliSense 功能，大幅降低**记忆成本**  
和输入错误  
。  
## 🛠️ 技术优势  
  
<table><thead><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">技术/特性</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">说明</span></section></th><th style="margin: 0px;padding: 12px 16px;box-sizing: border-box;border: 2px solid rgb(26, 26, 26);text-align: left;font-weight: 800;background-color: rgb(255, 217, 61);color: rgb(26, 26, 26);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section><span leaf="">优势</span></section></th></tr></thead><tbody><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">VSCode Extension API</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">原生插件架构</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">与 IDE 深度集成，体验流畅</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">pocsuite3 框架</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">知道创宇开源 POC 框架</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">行业标准，兼容性强</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">Node.js 18+</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">异步事件驱动</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">性能优异，生态丰富</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: rgb(255, 249, 196);"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">Webpack 打包</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">模块化构建</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">体积优化，加载快速</span></section></td></tr><tr style="margin: 0px;padding: 0px;box-sizing: border-box;border: 0px;background-color: transparent;"><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">配置验证机制</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">启动时检查登录配置</span></section></td><td style="margin: 0px;padding: 12px 16px;box-sizing: border-box;font-size: 15px;border: 2px solid rgb(26, 26, 26);text-align: left;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf="">错误前置，减少排查成本</span></section></td></tr></tbody></table>  
## 📖 使用指南  
  
① **准备工作**  
：克隆仓库后执行 npm install  
 安装依赖，运行 npm i --save-dev webpack webpack-cli  
 和 npm install -g vsce  
 安装打包工具。在 VSCode 设置中搜索 login  
，配置 **login.url**  
、login.username  
 和 login.password  
。  
  
② **核心操作**  
：在资源管理器右键目标文件夹，选择 **"新建POC"**  
，选择漏洞类型（如 SQL注入  
）后自动生成模板。编辑完成后，在编辑器中右键选择 "提交POC"  
，系统自动解析元数据并推送至平台。  
  
③ **结果查看**  
：提交成功后，登录漏洞管理平台查看已创建的漏洞记录。使用快捷键 **Ctrl + Shift + L**  
 可快速创建本地扫描任务  
（开发中），生成的 POC 文件可直接在 pocsuite3 环境中运行验证。  
  
## 📖 项目地址  
  
```
https://github.com/u1hine/vscode-plugin-poc
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
  
<table><thead><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><th data-colwidth="214.33333333333334" width="214.33333333333334" style="border-width: 2px;border-color: rgb(26, 26, 26);padding: 12px 16px;text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/mmbiz_jpg/L9cic5ql9ODwHdUbwzDLq3nh7hplKZNDBERhMYooic5cPGwPHEJRonMYCoupeaa6fPuwOKehMek9HTEvnLaG0uuiaScGxWWmibtK9XNFHF4PJD0/640?wx_fmt=jpeg&amp;from=appmsg" alt="img" class="rich_pages wxw-img" data-ratio="1.4065180102915953" data-w="1166" style="display: block;margin: 32px auto;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);padding: 8px;transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-cropselx1="0" data-cropselx2="176" data-cropsely1="0" data-cropsely2="259" data-backw="160" data-backh="225" data-imgfileid="100003010" data-aistatus="1"/></section></th><th data-colwidth="205.33333333333334" width="205.33333333333334" style="border-width: 2px;border-color: rgb(26, 26, 26);padding: 12px 16px;text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODwTIuKGmnGNWdp04KFRDHLuy2sn430a7pFSLwaOhaAb2sddKZ3uDapQ5II45nXqiaUicl8IXcdcpazmOVgV0o1v63mbpXicFlZYibQ/640?wx_fmt=png&amp;from=appmsg" alt="img" class="rich_pages wxw-img" data-ratio="0.625" data-w="1080" style="display: block;margin: 32px auto;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);padding: 8px;transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-backw="167" data-backh="105" data-imgfileid="100003011" data-aistatus="1"/></section></th></tr></thead><tbody><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="234.33333333333334" width="234.33333333333334" style="font-size: 15px;border-width: 2px;border-color: rgb(26, 26, 26);padding: 12px 16px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section nodeleaf=""><img alt="img" class="rich_pages wxw-img" data-aistatus="1" data-backh="172" data-backw="176" data-imgfileid="100003012" data-ratio="0.9768518518518519" data-src="https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODxHicicgIE0gTVhia5o7wNZiaPBibHFSAbvchW91fT05Nhp3rnNNDmoiauT4jK4JBicGHSBwFvcABEjrMB9fhnQc7xGkVx2t52CKzLW4k/640?wx_fmt=png&amp;from=appmsg" data-w="1080" style="display: block;margin: 32px auto;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background-position: initial;background-size: initial;background-repeat: initial;background-attachment: initial;background-origin: initial;background-clip: initial;padding: 8px;transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;"/></section></td><td data-colwidth="225.33333333333334" width="225.33333333333334" style="font-size: 15px;border-width: 2px;border-color: rgb(26, 26, 26);padding: 12px 16px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;word-break: break-all;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/sz_mmbiz_jpg/L9cic5ql9ODzCtog7ElLXnrLg7t9j99DftdLLjjVKFwP6unsUPX1EquflicE51wMFjB3zIBWLf6W3qFHA5modicNn3XbwJE8roDq7njXZRfjuo/640?wx_fmt=jpeg&amp;from=appmsg" class="rich_pages wxw-img" data-ratio="1.4666666666666666" data-type="png" data-w="1080" style="display: block;margin: 32px auto;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background-position: initial;background-size: initial;background-repeat: initial;background-attachment: initial;background-origin: initial;background-clip: initial;padding: 8px;transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-cropselx1="0" data-cropselx2="95" data-cropsely1="0" data-cropsely2="139" data-backw="71" data-backh="104" data-imgfileid="100003013" data-aistatus="1"/></section></td></tr></tbody></table>  
### 推荐阅读  
  
  
✦ ✦ ✦  
  
<table><thead><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><th data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);background-color: rgb(255, 217, 61);text-align: left;text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;word-break: break-all;"><section style="text-align: center;"><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485592&amp;idx=1&amp;sn=818004a6d625c4c4112ce73b83433854&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">渗透测试人员必备武器库：子域名爆破、漏洞扫描、内网渗透、工控安全工具全收录</a></span></section></th></tr></thead><tbody><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485309&amp;idx=1&amp;sn=292afbe37fb95c64f33470f915b0c54e&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI驱动的自动化红队编排框架(AutoRedTeam-Orchestrator)跨平台支持，集成 130+ 安全工具与 2000+ Payload</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247486181&amp;idx=1&amp;sn=3ace47da643c72cec0d615aeccb955ac&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">JS逆向必备：这款插件能Bypass Debugger、Hook CryptoJS、抓取路由</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485488&amp;idx=1&amp;sn=a37acb031febe69db608de53ddee5732&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">上传代码即审计：AI 驱动的自动化漏洞挖掘与 POC 验证平台</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485208&amp;idx=1&amp;sn=b5181181c1e0800124e3e099706ef2ef&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI 原生安全测试平台(CyberStrikeAI)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485805&amp;idx=1&amp;sn=8f374a239135f6a753d5cce887f8318b&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">多Agent智能协作+40+工具调用：基于大模型的端到端自动化漏洞挖掘与验证系统</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485314&amp;idx=1&amp;sn=56082cd314311ffc15cc0bcf03a395e2&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于DeepSeek的代码审计工具 (Ai-SAST-tool.xjar)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485127&amp;idx=1&amp;sn=b5eb3fdc1cc23976011e2bca396c1bc7&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于AI的自主渗透测试平台 </a></span></section></td></tr></tbody></table>  
  
✦ ✦ ✦  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnAqueibZX8s1IJDIlA8UJmu3uWsZUxqahoolciaqq65A30ia93jCyEwTLA/640?wx_fmt=gif&from=appmsg "")  
  
**点分享**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJniaq4LXsS43znk18DicsT6LtgMylx4w69DNNhsia1nyw4qEtEFnADmSLPg/640?wx_fmt=gif&from=appmsg "")  
  
**点收藏**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnev2xbu5ega5oFianDp0DBuVwibRZ8Ro1BGp4oxv0JOhDibNQzlSsku9ng/640?wx_fmt=gif&from=appmsg "")  
  
**点在看**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnwVncsEYvPhsCdoMYkI6PAHJQq4tEiaK3fcm3HGLialEMuMwKnnwwSibyA/640?wx_fmt=gif&from=appmsg "")  
  
**点点赞**  
  
