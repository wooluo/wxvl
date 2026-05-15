#  JWT 密钥强度为零：Note Mark 满分漏洞与令牌伪造攻击  
原创 CVE-SEC
                    CVE-SEC  CVE-SEC   2026-05-15 06:00  
  
# JWT 密钥强度为零：Note Mark 满分漏洞与令牌伪造攻击  
  
**CVE-2026-44523 | CVSS 10.0 | Note Mark < 0.19.4**  
## 前言  
  
有一类漏洞不需要复杂的漏洞利用技术，不需要内存破坏，不需要绕过任何安全机制。它的存在只需要开发者在配置密码学组件时少做了一步验证。CVE-2026-44523 就是这样一个漏洞——Note Mark 应用接受任意长度的 JWT 签名密钥，包括仅 1 字节的密钥，导致攻击者可以通过离线暴力破解获取签名密钥，进而伪造任意用户的身份令牌，实现完全的账户接管。  
  
CVSS 评分 10.0，无需认证，无需用户交互。  
## JWT 与 HS256：安全的前提  
  
要理解这个漏洞，需要先回顾 JWT 的基本工作原理。  
  
JSON Web Token（JWT）是一种广泛使用的认证令牌格式，结构为三段 Base64 编码的 JSON 对象，以点分隔：  
```
header.payload.signature

```  
- **header**  
 声明算法类型（如 {"alg":"HS256","typ":"JWT"}  
）  
  
- **payload**  
 携带用户声明（如 user_id、role、exp）  
  
- **signature**  
 是对前两段的加密签名，用于验证令牌未被篡改  
  
Note Mark 使用 **HS256（HMAC-SHA256）**  
 算法对令牌进行签名。HS256 是对称签名算法，服务端使用同一个密钥（JWT_SECRET  
）既签名又验证。其安全性完全依赖于密钥的保密性和强度。  
  
**RFC 7518 第 3.2 节明确要求：HS256 密钥长度不得少于 256 位（32 字节）。**  
  
当密钥长度不足时，攻击者可以对一个有效的 JWT 令牌实施离线字典攻击或暴力破解——不需要触碰服务器，不产生任何日志，只需要一台配备 GPU 的机器和时间。  
## 漏洞核心：接受任意长度密钥  
  
Note Mark 的配置加载逻辑存在于两个关键位置：  
  
**backend/config/utils.go**  
 中的 Base64Decoded.UnmarshalText  
 函数负责将 JWT_SECRET  
 环境变量从 Base64 解码为字节序列。问题在于：解码成功即认为配置有效，没有任何对结果字节长度的检查。  
  
**backend/core/auth.go**  
 使用解码后的字节序列对 JWT 进行 HS256 签名，同样没有验证密钥是否满足算法的最低强度要求。  
  
结果是：应用接受任意可 Base64 解码的字符串作为 JWT 密钥，哪怕只有 1 个字节。  
  
当管理员将 JWT_SECRET  
 配置为：  
- secret  
（6 字节）  
  
- abc  
（3 字节）  
  
- 应用名称、域名等可预测值  
  
- 任何少于 32 字节的字符串  
  
应用会正常启动，正常运行，却在不知情的情况下处于高度危险的状态。  
## 攻击路径：从令牌到密钥到管理员  
  
攻击分为三个阶段，第一阶段唯一需要的是一个有效的 JWT 令牌。  
  
**阶段一：获取令牌样本**  
  
攻击者在目标 Note Mark 实例上注册一个普通账户，或通过其他方式（HTTP 响应捕获、日志泄露等）获得任何用户的有效 JWT 令牌。令牌本身是公开携带的——它会出现在 HTTP 请求的 Authorization 头中。  
  
**阶段二：离线破解密钥**  
```
# 使用 hashcat 对 HS256 JWT 进行 GPU 加速破解
hashcat -a 0 -m 16500 <jwt_token> rockyou.txt

# 或暴力枚举短密钥
hashcat -a 3 -m 16500 <jwt_token> ?a?a?a?a?a?a?a?a

```  
  
对于 6 字节以内的密钥，现代 GPU 可以在秒级内完成暴力枚举。8-16 字节的密钥取决于字符集，通常在分钟到小时级别内可破解。使用常见词汇的密钥（secret  
、password  
、应用名等）在 rockyou.txt 这类字典中几乎必然命中。  
  
**阶段三：伪造任意用户令牌**  
  
一旦获取密钥，攻击者可以用标准的 JWT 库伪造任意用户的令牌：  
```
import jwt

# 恢复的密钥
secret = "weak_secret"

# 伪造管理员令牌，user_id=1 通常是管理员账户
payload = {
    "user_id": 1,
    "is_admin": True,
    "exp": 9999999999  # 任意设置过期时间
}

forged_token = jwt.encode(payload, secret, algorithm="HS256")

```  
  
使用伪造令牌向任何 API 端点发起请求，服务器验证签名通过，完全相信令牌的声明。攻击者以任意用户（包括所有管理员）的身份访问系统，读取、修改、删除所有数据。  
  
**关键特性：整个过程不产生任何登录日志**  
，因为攻击者没有使用密码进行认证，而是直接呈现一个"合法"的令牌。  
## 同批次漏洞：系统性的安全设计问题  
  
这不是 Note Mark 的孤立问题。安全研究员 @adrgs 在同一批次报告了五个漏洞，共同揭示了 Note Mark 在 0.19.4 之前版本中系统性的安全设计缺陷：  
<table><thead><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">CVE</span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">类型</span></section></th><th style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;font-weight: bold;background-color: #f0f0f0;"><section><span leaf="">CVSS</span></section></th></tr></thead><tbody><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">CVE-2026-44523（本文）</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">弱 JWT 密钥 → 完全账户接管</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">10.0</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">CVE-2026-44522</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">资产名称路径穿越 → 任意文件写入 → RCE</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">严重</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">CVE-2026-41571</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">认证绕过</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">9.4</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: #F8F8F8;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">CVE-2026-40262</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">存储型 XSS（SVG/HTML 文件上传）</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">高</span></section></td></tr><tr style="border: 0;border-top: 1px solid #ccc;background-color: white;"><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">CVE-2026-40265</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">未认证资产文件访问</span></section></td><td style="font-size: 16px;border: 1px solid #ccc;padding: 5px 10px;text-align: left;"><section><span leaf="">中</span></section></td></tr></tbody></table>  
五个漏洞覆盖认证、授权、输入验证、访问控制等核心安全域，这是系统性审计的结果，也意味着 0.19.4 之前的任何版本都不应被信任用于存储敏感数据。  
## 修复与验证  
  
修复提交（18b58775866776ed400c403dd0ccad68c1fa4802  
）在 config/utils.go  
 的 Base64 解码步骤后增加了密钥长度检查：解码后字节数不满足最低要求时，应用拒绝启动并报错，强制管理员提供合规密钥。  
  
**升级步骤：**  
1. 将 Note Mark 升级至 v0.19.4 或更高版本  
  
1. 生成新的强密钥：  
```
openssl rand -base64 64
# 或
python3 -c "import secrets; print(secrets.token_urlsafe(64))"

```  
  
  
1. 更新 JWT_SECRET  
 环境变量并重启服务（所有现有会话将失效，用户需重新登录）  
  
1. 审计过去的访问日志，检查是否存在来源不明的 API 请求  
  
**自查方法（升级前）：**  
```
import base64, os

secret = os.getenv("JWT_SECRET", "")
try:
    decoded = base64.b64decode(secret)
    if len(decoded) < 32:
        print(f"存在风险：密钥解码后仅 {len(decoded)} 字节，不满足 32 字节最低要求")
    else:
        print("密钥长度合规")
except Exception:
    print("密钥格式异常")

```  
## 更深层的问题：为什么这类漏洞反复出现  
  
JWT 弱密钥不是新问题，但它在开源项目中以惊人的频率出现。原因在于：大多数 JWT 库的设计将密钥强度验证留给调用方，库本身接受任意长度的密钥字节。开发者在集成时如果没有主动意识到这一点，就会写出"功能上正常但密码学上脆弱"的代码。  
  
对于框架和应用开发者而言，防范这类漏洞的正确姿势不是文档警告，而是**强制验证**  
：  
- 应用启动时检查密钥字节长度，不满足要求则拒绝启动  
  
- 提供安全的默认密钥生成方式，而非让用户自行设置  
  
- 在 CI 管道中加入密钥强度检查  
  
- 考虑使用 RS256（非对称签名），彻底分离签发能力与验证能力  
  
## 结语  
  
CVE-2026-44523 展示了密码学组件的安全性与功能性的分离：代码运行正常，认证看起来工作，但底层的密码学保证已经形同虚设。这类漏洞不会在测试环境中暴露，不会触发任何监控告警，只有当攻击者持有伪造的令牌时才会显现出危害。  
  
自托管软件的运营者需要建立一个意识：**应用能启动不等于应用是安全的**  
。密码学配置的正确性需要主动验证，而不是依赖应用的默认行为。  
  
  
