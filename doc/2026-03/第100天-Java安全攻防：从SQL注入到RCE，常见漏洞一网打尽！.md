#  第100天-Java安全攻防：从SQL注入到RCE，常见漏洞一网打尽！  
原创 Сяо Яо
                    Сяо Яо  AlphaNet   2026-03-21 03:56  
  
嗨，未来的安全大神们！👋 你是否在Java开发中只关注功能实现，而忽略了潜藏的安全风险？或者在代码审计时，面对海量代码却不知从何下手？别担心，今天这篇硬核笔记将带你系统梳理Java中几种最高频的Web漏洞，从原理到审计方法，助你构建更坚固的代码防线！  
  
>   
> 本文将围绕 **SQL注入、XXE、RCE、SSRF** 和 **URL跳转** 这五大常见漏洞展开，结合具体的技术栈和代码案例，让你知其然，更知其所以然。  
>   
  
  
  
准备好了吗？让我们开始这场Java安全探索之旅吧！  
  
  
### 🎯 Part 1: SQL注入 (SQL Injection)  
  
#### 🧐 是什么 (What)  
  
  
SQL注入是当之无愧的Web安全“头号杀手”。它发生在应用程序将用户输入的数据 **直接拼接** 到SQL查询语句中，导致攻击者可以构造恶意的SQL代码，从而绕过验证、窃取数据，甚至控制整个数据库。  
  
#### ❓ 为什么 (Why)  
  
  
根本原因在于 **信任了用户的输入**，并将其作为代码的一部分来执行。在Java中，这通常发生在以下几个主流的数据库交互技术中：  
  
1. **JDBC (Java Database Connectivity)**: Java连接数据库的基石。  
1. **MyBatis**: 一款优秀的的持久层框架，提供了灵活的SQL映射。  
1. **Hibernate/JPA**: 功能强大的对象关系映射（ORM）框架。  
#### 🛠️ 怎么做 (How)  
  
##### 1. JDBC 中的注入风险  
  
- **高危场景**：使用 Statement 对象进行SQL语句拼接。  
```

// ❌ 错误示范：典型的SQL注入漏洞
Statement stmt = connection.createStatement();
String sql = "SELECT * FROM users WHERE username = '" + userInput + "'";
ResultSet rs = stmt.executeQuery(sql);

```  
  
  
- **安全方案**：始终使用 PreparedStatement 和参数化查询（?占位符）。它会对SQL语句进行预编译，将用户输入作为纯粹的数据处理，而不是SQL指令。  
```

// ✅ 正确示范：使用预编译
String sql = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = connection.prepareStatement(sql);
pstmt.setString(1, userInput);
ResultSet rs = pstmt.executeQuery();

```  
  
  
>   
> **注意**：即使是 PreparedStatement，如果依然采用字符串拼接的方式构造SQL，预编译也无法防止注入！  
>   
  
  
##### 2. MyBatis 中的注入风险  
  
  
MyBatis提供了两种参数符号：#{} 和 ${}。  
  
- #{}：**安全的**。它会创建预编译语句，并将参数安全地设置进去。  
- ${}：**危险的**。它会直接将参数拼接到SQL语句中，是导致注入的元凶  
常见的注入场景包括：  
  
  
  
**1️⃣ Order By 注入**  
  
  
ORDER BY 子句后使用 #{} 会将参数解析为字符串（例如 ORDER BY "username"），从而导致 SQL 语法错误。开发者为了“正常排序”，往往改用 ${}，但这会直接引入 SQL 注入风险。  
  
  
```

SELECT * FROM users ORDER BY ${columnName} ${direction}

```  
  
  
  
  
**2️⃣ Like 注入**  
  
  
在模糊查询场景中，一些开发者为了拼接 % 通配符，直接使用 ${}，从而导致用户输入被原样拼接进 SQL。  
  
  
```

SELECT * FROM users WHERE username LIKE '%${keyword}%'

```  
  
  
  
  
**3️⃣ In 注入**  
  
  
当 IN 子句需要接收多个 ID 时，#{} 无法直接处理列表参数（会报错或格式不正确），因此部分开发者会改用 ${} 拼接，从而产生注入风险。  
  
  
```

SELECT * FROM users WHERE id IN (${ids})

```  
  
  
  
##### 3. Hibernate / JPA 中的注入风险  
  
  
这两个ORM框架通常鼓励使用 **命名参数** (:paramName) 或 **位置参数** (?1)，它们底层都实现了预编译，因此是安全的。  
  
  
```

// ✅ 正确示范：JPA/Hibernate 的安全查询
String hql = "FROM User u WHERE u.username = :username";
Query query = session.createQuery(hql);
query.setParameter("username", userInput);
List results = query.list();

```  
  
  
##### 审计思路总结  
  
- **黑盒测试**：寻找一切可能的输入点，尝试经典的注入Payload。  
- **白盒审计**：    1. **识别技术栈**：确定项目使用的是JDBC、MyBatis还是Hibernate/JPA。  
    1. **定位危险函数/写法**：        - JDBC: 查找 Statement 的使用，以及 PreparedStatement 的拼接场景。  
        - MyBatis: 全局搜索 ${} 的使用，特别是 order by、like、in 等场景。  
  
    1. JDBC: 查找 Statement 的使用，以及 PreparedStatement 的拼接场景。  
    1. MyBatis: 全局搜索 ${} 的使用，特别是 order by、like、in 等场景。  
    1. **确认安全性**：检查是否所有用户输入都通过预编译处理。  
  
- **识别技术栈**：确定项目使用的是JDBC、MyBatis还是Hibernate/JPA。  
- **定位危险函数/写法**：    - JDBC: 查找 Statement 的使用，以及 PreparedStatement 的拼接场景。  
    - MyBatis: 全局搜索 ${} 的使用，特别是 order by、like、in 等场景。  
  
- JDBC: 查找 Statement 的使用，以及 PreparedStatement 的拼接场景。  
- MyBatis: 全局搜索 ${} 的使用，特别是 order by、like、in 等场景。  
- **确认安全性**：检查是否所有用户输入都通过预编译处理。  
### 🎯 Part 2: XXE 注入 (XML External Entity)  
  
#### 🧐 是什么 (What)  
  
  
XXE注入是一种针对解析XML输入的应用程序的攻击。当XML解析器被配置为允许引用外部实体时，攻击者可以通过构造恶意的XML数据来读取服务器上的任意文件、探测内网，甚至执行命令。  
  
#### 🛠️ 怎么做 (How)  
  
  
在Java中，审计XXE漏洞的关键是找到处理XML的入口，并检查其配置是否安全。  
  
  
以下是需要重点关注的 **12个高危类和函数**：  
  
<table><thead><tr><th align="left">序号</th><th align="left">危险类/接口</th><th align="left">触发方法</th></tr></thead><tbody><tr><td align="left">1</td><td align="left"><code>XMLReader</code></td><td align="left"><code>parse</code></td></tr><tr><td align="left">2</td><td align="left"><code>SAXReader</code></td><td align="left"><code>read</code></td></tr><tr><td align="left">3</td><td align="left"><code>DocumentBuilder</code></td><td align="left"><code>parse</code></td></tr><tr><td align="left">4</td><td align="left"><code>XMLStreamReader</code></td><td align="left"><code>next</code></td></tr><tr><td align="left">5</td><td align="left"><code>SAXBuilder</code></td><td align="left"><code>build</code></td></tr><tr><td align="left">6</td><td align="left"><code>SAXParser</code></td><td align="left"><code>parse</code></td></tr><tr><td align="left">7</td><td align="left"><code>SAXSource</code></td><td align="left"><code>build</code></td></tr><tr><td align="left">8</td><td align="left"><code>TransformerFactory</code></td><td align="left"><code>newTransformer</code></td></tr><tr><td align="left">9</td><td align="left"><code>SAXTransformerFactory</code></td><td align="left"><code>newTransformerHandler</code></td></tr><tr><td align="left">10</td><td align="left"><code>SchemaFactory</code></td><td align="left"><code>newSchema</code></td></tr><tr><td align="left">11</td><td align="left"><code>Unmarshaller</code></td><td align="left"><code>unmarshal</code></td></tr><tr><td align="left">12</td><td align="left"><code>XPathExpression</code></td><td align="left"><code>evaluate</code></td></tr></tbody></table>  
##### 审计思路总结  
  
  
在代码审计时，全局搜索以上 **12个关键字**。一旦发现它们被使用，立即检查其初始化配置，确认是否禁用了外部实体的解析。如果一个可控变量最终被传入了这些类的解析方法（如 parse, build 等），且没有安全配置，那么就存在XXE漏洞。  
  
  
### 🎯 Part 3: RCE (Remote Code/Command Execution)  
  
#### 🧐 是什么 (What)  
  
  
RCE是远程代码/命令执行漏洞，是最高危的漏洞之一。攻击者可以像在服务器本地一样执行任意系统命令，从而完全控制服务器。  
  
#### 🛠️ 怎么做 (How)  
  
  
Java中执行系统命令通常依赖以下几个类：  
  
1. Runtime.getRuntime().exec(): 最经典、最直接的命令执行方式。  
1. ProcessBuilder: 功能更强大、配置更灵活的命令执行类。  
1. ProcessImpl: exec 和 ProcessBuilder 底层实际调用的类。  
1. GroovyShell: 如果应用集成了Groovy动态语言，其 evaluate() 或 parse() 方法是RCE的高发点。  
##### 审计思路总结  
  
  
全局搜索 exec, ProcessBuilder, GroovyShell 等关键字。定位到这些代码后，向上追溯其参数来源。如果参数最终可以被用户输入所控制，且没有经过严格的过滤，那么就存在RCE漏洞。  
  
  
### 🎯 Part 4: SSRF & URL 跳转  
  
  
这两类漏洞都与URL处理不当有关，我们放在一起看。  
  
#### 🧐 是什么 (What)  
  
- **SSRF (Server-Side Request Forgery)**: 服务端请求伪造。攻击者利用服务器作为“代理”，去请求其本无法直接访问的内网资源（如Redis、Elasticsearch等），造成信息泄露和内网漫游。  
- **URL 跳转 (Open Redirect)**: 开放重定向。攻击者可以构造一个看似无害的链接，当用户点击后，浏览器会跳转到恶意的钓鱼网站。  
#### 🛠️ 怎么做 (How)  
  
##### SSRF  
  
  
审计关键是寻找发起HTTP请求的功能点，并检查URL是否可控。在Java中，常见的HTTP客户端都可能成为触发点，例如 HttpURLConnection, OkHttp, HttpClient 等。最直接的入口是 new URL(userInput).openConnection()。  
  
##### URL 跳转  
  
- **Spring MVC**: 关注 ModelAndView 对象的使用，特别是 new ModelAndView("redirect:" + url)。  
- **Servlet API**: 关注 HttpServletResponse 的 sendRedirect(url) 和 setHeader("Location", url)。  
- **Spring Framework**: 关注 ResponseEntity 的 setHeader("Location", url)。  
##### 审计思路总结  
  
  
对于这两类漏洞，核心思路是 **“追溯可控变量”**。  
  
1. **定位触发点**：找到处理URL、发起重定向或服务端请求的函数。  
1. **分析变量来源**：向上回溯，判断传入的URL参数是否完全或部分来自用户输入。  
1. **检查防御措施**：确认系统是否对URL进行了严格的白名单校验，确保目标地址在预期的安全域内。  
### ✨ 总结与思考  
  
  
今天我们系统学习了Java中五大常见漏洞的攻防知识，核心要点可以总结为：  
  
- **SQL注入**：根源是 **代码** 和 **数据** 的混淆。防御核心是 **预编译**。审计重点是 Statement 和 MyBatis 的 ${}。  
- **XXE**：根源是 **允许解析外部实体**。审计重点是 **12个XML处理类** 的配置。  
- **RCE**：根源是 **执行了可控的系统命令**。审计重点是 exec 和 ProcessBuilder。  
- **SSRF & URL跳转**：根源是 **信任了用户提供的URL**。审计重点是所有发起 **HTTP请求** 和 **重定向** 的函数。  
>   
> 🤔 **给你留个思考题**：在实际开发中，如果业务场景（比如 order by）确实需要动态指定列名，你该如何安全地实现，来避免使用危险的 ${} 呢？  
  
  
  
**#相关靶场推荐：**  
  
- bewhale/JavaSec  
- whgojp/JavaSecLab  
- j3ers3/Hello-Java-Sec  
