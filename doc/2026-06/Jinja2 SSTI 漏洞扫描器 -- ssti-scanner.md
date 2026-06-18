#  Jinja2 SSTI 漏洞扫描器 -- ssti-scanner  
ANAISMUSE
                    ANAISMUSE  Web安全工具库   2026-06-18 02:18  
  
===================================  
  
**免责声明**  
  
请勿利用文章内的相关技术从事非法测试，由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。工具来自网络，  
安全性自测  
，  
大家都要把工具当做病毒对待，在虚拟机运行。  
如有侵权请联系删除。个人微信：  
ivu123ivu  
  
  
**0x01 工具介绍**  
  
这是一个面向安全研究人员和 CTF 学习者的 Python 工具，专注于 Jinja2 模板引擎的服务端模板注入（SSTI）漏洞检测与利用链分析。工具将整个漏洞利用过程拆解为四个递进阶段：首先用算术 payload（如 {{7*7}}）探测模板引擎是否在解析用户输入，随后通过 Jinja2 专有对象确认引擎类型，再沿 Python 对象的 MRO 链路向上爬取，寻找可达 __builtins__ 的利用路径，最后在授权环境下尝试命令执行。工具内置了七条主流利用链，涵盖从经典的 __subclasses__ 枚举到无需索引的 lipsum、cycler、joiner 等 Jinja2 内置对象链，并支持批量 URL 扫描、GET/POST 参数注入、自动参数提取和格式化报告输出。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/U7LDNXUGXQvNvyvuqAsWhrnmXRlxR1oUj0ZUEzwR3sBVxHREc8lmtUKpW2NFJE4yYBnHiaRRSPNIpAXZQ2Aicm0iarrBqKwibbIdw4D8U3nj9GE/640?wx_fmt=png&from=appmsg "")  
  
  
**0x02 安装与使用**  
  
常用命令：  
  
   
  
**打印 payload 速查表（不发任何请求，纯离线查看）**  
```
python3 ssti_scanner.py --payloads
python3 ssti_scanner.py --payloads -c "cat /etc/passwd"
```  
  
**扫描单个 URL**  
```
# 工具会自动提取 URL 中的第一个 query 参数
python3 ssti_scanner.py -u "http://target.com/page?name=test"
```  
  
**手动指定参数名**  
```
python3 ssti_scanner.py -u "http://target.com/page" -p search -m GET
```  
  
**扫描 POST 参数**  
```
python3 ssti_scanner.py -u "http://target.com/login" -p username -m POST
```  
  
**开启完整模式（包含 RCE 尝试）**  
```
python3 ssti_scanner.py -u "http://target.com/page?q=test" --full -c "id"
```  
  
**批量扫描**  
```
# 命令行多个 URL
python3 ssti_scanner.py -u "http://target1.com/?q=1" -u "http://target2.com/?q=1"

# 从文件读取（每行一个 URL）
python3 ssti_scanner.py -f urls.txt --full -c "whoami"
```  
  
  
   
  
  
  
网盘下载链接（一定要在虚拟机运行）：  
  
公众号后台回复：20260618  
  
  
  
  
**·****今 日 推 荐**  
**·**  
<table><tbody><tr><td data-colwidth="287"><section><span leaf=""><img class="rich_pages wxw-img" data-aistatus="1" data-imgfileid="100034920" data-ratio="1.4015518913676042" data-s="300,640" data-src="https://mmbiz.qpic.cn/sz_mmbiz_jpg/U7LDNXUGXQvOrG7vXcN8dtaIQNk7Lk45F6cWK1GNBHEbIibDnrffMPzqaO3YlQa4etjIfXGJNyCQ90sMNJXhmoILZQeWet6hJQd8miagm1K50/640?wx_fmt=jpeg&amp;from=appmsg" data-w="1031" type="inline"/></span></section></td><td data-colwidth="287"><section><span leaf=""><img class="rich_pages wxw-img" data-aistatus="0" data-imgfileid="100033627" data-ratio="1.2469635627530364" data-s="300,640" data-src="https://mmbiz.qpic.cn/sz_mmbiz_jpg/8H1dCzib3UibsC4yYFwgTnJrN0q57DearHJhaWSE6XQllpkUviaibg5MqTYgdUQYDNt8ysfV2v6o4jsN34pmq3DAOg/640?wx_fmt=jpeg&amp;from=appmsg" data-type="jpeg" data-w="1235" type="inline"/></span></section></td></tr></tbody></table>  
  
  
  
  
