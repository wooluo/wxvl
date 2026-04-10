#  整合型漏洞扫描工具 -- vulnscan（4月6日更新）  
bbyybb
                    bbyybb  Web安全工具库   2026-04-10 02:07  
  
===================================  
  
**免责声明**  
  
请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。工具来自网络，  
安全性自测  
，  
大家都要把工具当做病毒对待，在虚拟机运行。  
如有侵权请联系删除。个人微信：  
ivu123ivu  
  
  
**0x01 工具介绍**  
  
一款整合型漏洞扫描工具，将 Web DAST、代码 SAST 和 SCA 能力集成于统一界面中。功能特性：  
```
7 个内置扫描器 -- 安全头检查（含 CSP 值检查、Cookie 安全属性）、SSL/TLS（证书 + SAN 域名匹配）、敏感路径探测（~130 条）、信息泄露检测（内部 IP/Email 泄露）、端口扫描（61 端口 + Banner）、源码漏洞分析（10 类模式）、依赖 CVE 检查（10 种格式）
9 个外部工具集成 -- Nuclei（全模板类型）、Nmap（TCP+UDP 双扫描）、SQLMap（level=5/risk=3 + WAF 绕过）、Nikto（全部 13 类检查）、ffuf（路径×扩展名×递归）、Bandit、Semgrep（4 个规则集）、Trivy（漏洞+密钥+配置错误）、Grype
自定义 HTTP 选项 -- 请求头、Cookies、POST 数据、请求方法；支持粘贴浏览器 curl 命令自动填充
CLI 和 GUI 双界面 -- 终端命令行或图形窗口，随意选择
HTML + JSON 报告生成 -- 丰富的 HTML 报告和机器可读的 JSON 报告
漏洞自动去重 -- 多个扫描器发现的相同漏洞自动合并，减少报告噪声
调试日志输出 -- 
--log-file 参数将详细扫描日志写入文件，方便排查问题
Cyber 深邃/明亮主题 -- GUI 支持Cyber 深邃（GitHub Dark 风格）和明亮主题切换
一键安装外部工具 -- GUI 中不可用工具旁显示"安装"和"浏览"按钮；支持 .exe/.py/.pl/.jar/.ps1 脚本；自定义路径保存到 
~/.vulnscan/tool_paths.json
跨平台支持 -- Windows / macOS / Linux
中英文双语 -- 自动检测系统语言或手动切换
```  
  
**0x02 安装与使用**  
  
常用命令  
```
# Web 扫描（默认设置：所有可用扫描器，同时生成两种报告）
python main.py web https://example.com
# 指定扫描器进行 Web 扫描
python main.py web https://example.com --scanners HeaderScanner SSLScanner
# 自定义输出目录和报告格式
python main.py web https://example.com -o ./reports --format html
# 自定义并发线程数
python main.py web https://example.com --workers 8
# 使用自定义 HTTP 头和 Cookies 扫描（适用于需要认证的站点）
python main.py web https://example.com -H "Authorization: Bearer token" -H "Content-Type: application/json" --cookie "session=abc123"
# 使用 POST 方法和请求体扫描
python main.py web https://example.com --method POST --data '{"key":"value"}'
# 查看版本
python main.py --version
# 将调试日志写入文件
python main.py --log-file scan.log web https://example.com
# 代码扫描
python main.py code ./your-project
# 指定扫描器进行代码扫描
python main.py code ./your-project --scanners FileAnalyzer DependencyScanner
# 仅生成 JSON 报告
python main.py code ./your-project --format json -o ./reports
# 检查扫描器状态
python main.py status
# 切换语言
python main.py --lang zh status
python main.py --lang en web https://example.com
# 启动图形界面
python main.py gui
```  
  
启动图形界面：  
```
python main.py gui
#或直接运行（无参数默认启动 GUI）
python main.py
```  
  
运行界面  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/U7LDNXUGXQvktRtdZSv8eVHqQXNnzf2bartzIiapYovNciaJn8qU6fQN6jLvwm4pg4KNUFyrHaTbk4okNFgZVPfQtoQPexOrwxFxUuo9yMibes/640?wx_fmt=png&from=appmsg "")  
  
网盘下载链接（一定要在虚拟机运行）：  
  
链接：https://pan.quark.cn/s/f6b6ca11e1bf  
  
  
  
  
  
**·****今 日 推 荐**  
**·**  
<table><tbody><tr><td data-colwidth="287"><section><span leaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-imgfileid="100034620" data-ratio="1.4015518913676042" data-s="300,640" data-src="https://mmbiz.qpic.cn/mmbiz_jpg/U7LDNXUGXQuMa1rBtfuqhI7sniaMmDXILMnLzibjwQzkme7MsrS8QVmrc030YC96zxHS5EBPwY7WHkORJvRYEXheR241icC666hwtXk7EkFOqw/640?wx_fmt=jpeg&amp;from=appmsg" data-type="jpeg" data-w="1031" type="inline"/></span></section></td><td data-colwidth="287"><section><span leaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-imgfileid="100033627" data-ratio="1.2469635627530364" data-s="300,640" data-src="https://mmbiz.qpic.cn/sz_mmbiz_jpg/8H1dCzib3UibsC4yYFwgTnJrN0q57DearHJhaWSE6XQllpkUviaibg5MqTYgdUQYDNt8ysfV2v6o4jsN34pmq3DAOg/640?wx_fmt=jpeg&amp;from=appmsg" data-type="jpeg" data-w="1235" type="inline"/></span></section></td></tr></tbody></table>  
  
