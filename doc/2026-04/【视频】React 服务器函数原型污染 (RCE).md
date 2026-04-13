#  【视频】React 服务器函数原型污染 (RCE)  
 黑白之道   2026-04-13 02:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
  
> **文章来源：**  
  
  
  
### 这个视频值得研究，主要是：当前现代 Web 框架（如 Next.js）中 服务器组件（RSC） 与 客户端运行时 之间序列化机制的安全性边界  
  
###   
  
  
### 1. 漏洞基本信息  
- **CVE 编号**  
：CVE-2025-55182  
  
- **威胁等级**  
：关键 (Critical)  
  
- **影响范围**  
：主要影响集成了 React Server Functions 的框架，尤其是 Next.js 在特定版本下的实现。  
  
- **漏洞类型**  
：原型污染 (Prototype Pollution) 导致的远程代码执行 (RCE)。  
  
### 2. 技术原理分析  
  
该漏洞的核心在于 React 在处理服务器端与客户端之间的数据序列化（Serialization）和反序列化（Deserialization）时，未能正确校验特殊属性。  
- **注入点**  
：攻击者通过精心构造的 JSON 载荷（Payload）发送至服务器函数。  
  
- **攻击路径**  
：  
  
- 攻击者在请求中包含 __proto__  
 或 constructor.prototype  
 属性。  
  
- React 的服务器端逻辑在解析这些输入并将其传递给服务器函数时，发生了原型污染。  
  
- 由于 Node.js 环境中许多核心库和全局对象依赖于原型链，攻击者可以篡改全局对象的行为。  
  
  
  
  
