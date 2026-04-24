#  网络安全可视化工具集 | FOFA 资产测绘爬取与 Nuclei 漏洞扫描  
tangjie1
                    tangjie1  菜鸟学信安   2026-04-24 00:31  
  
工具介绍  
**唐门-暗之器**  
 是一款面向安全研究人员的可视化工具集，提供 FOFA 资产测绘爬取与 Nuclei 漏洞扫描的一体化图形界面，采用黑客风格深色 UI 设计。  
  
![image](https://mmbiz.qpic.cn/mmbiz_png/AFjuWEpVxUI1e981XicIIXsRxuOia0gDdmorNrJTdX99fv8yIxPyn2IAc8sAozlqsWGjDWicHtZ4NgLOCf92eScWxO6oPuxxKU8Nn7D4eHOkko/640?wx_fmt=png&from=appmsg "")  
![]( "")  
  
![_cgi-bin_mmwebwx-bin_webwxgetmsgimg__ MsgID=1206142898001846034 skey=@crypt_1e147aac_cdb940c476741532f1e2f738a4426eb2 mmweb_appid=wx_webfilehelper](https://mmbiz.qpic.cn/mmbiz_png/AFjuWEpVxUIHasXCbu373RmC3Wpj6SUj1icrIx9amtG5J28E6SVC2ABsk3JTEpethMrT3TCcEicl3GBmGufLANy4LB0o9ZOQNlJuvVGkeQiaico/640?wx_fmt=png&from=appmsg "")  
![]( "")  
## 功能特性  
### FOFA 爬取模块  
  
| 功能 | 说明 | :|------|------| | FOFA 搜索 | 支持完整 FOFA 语法，自动 Base64 编码 | | 分页爬取 | 可设置起止页，一键获取总页数 | | 反爬间隔 | 可配置随机延迟（默认 3~6s），避免封 IP | | 实时展示 | 表格实时显示 Host / IP / Port / 协议 / 标题 | | 存活探测 | HTTP 探测每个 Host 可达性，颜色标注 | | 结果导出 | 支持 .txt  
 / .csv  
 格式导出 | | Cookie 管理 | 独立配置弹窗，支持 Cookie 有效性验证 |  
### Nuclei 扫描模块  
  
| 功能 | 说明 | :|------|------| | 可视化配置 | 模板路径、输出目录、代理等图形化配置 | | 模板树形浏览 | 异步加载模板目录，支持搜索/勾选/右键编辑 | | 实时输出 | 扫描结果实时彩色展示，按严重级别分色 | | 漏洞统计 | 自动统计真实漏洞数量（排除 INFO 级别信息） | | FOFA 联动 | 一键将 FOFA 结果发送至 Nuclei 批量扫描 | | 目标管理 | 支持手动输入 / txt 文件批量导入 | | 结果导出 | 扫描结果导出为 .txt  
 / .jsonl  
 |  
## 工具使用  
### 环境要求  
- Python 3.9+  
  
- Windows（已测试）/ Linux（理论支持）  
  
- Nuclei(https://github.com/projectdiscovery/nuclei)（Nuclei 模块需要）  
  
- nuclei-templates(https://github.com/projectdiscovery/nuclei-templates)（Nuclei 模块需要）  
  
### 安装  
```
# 克隆仓库git clone https://github.com/tangjie1/tang-darkweapon.gitcd tang-darkweapon# 安装依赖pip install -r requirements.txt
```  
  
或双击 安装依赖.bat  
### 配置  
```
# 复制配置模板（重要！）copy config\settings.json.example config\settings.json
```  
  
然后编辑 config/settings.json  
，填入：  
- fofa_cookie  
：你的 FOFA Cookie（浏览器 DevTools → Application → Cookies 复制）  
  
- nuclei_exe  
：nuclei 可执行文件的完整路径  
  
- nuclei_template_dir  
：nuclei-templates 目录路径  
  
### 启动  
```
python main.py
```  
  
或双击 启动.bat  
  
## 项目地址  
  
  
https://github.com/tangjie1/tang-darkweapon  
  
  
