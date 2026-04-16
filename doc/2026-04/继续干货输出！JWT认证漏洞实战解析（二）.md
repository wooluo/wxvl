#  继续干货输出！JWT认证漏洞实战解析（二）  
原创 洞悉安全攻防团队
                        洞悉安全攻防团队  洞悉安全团队   2026-04-16 10:30  
  
点击上方  
**蓝字**  
关注我们～  
  
Part 01  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/zEUqu7mKQjBohI0v26MRG0XHiaBjRhnU5ywswsDWQZ3TfjQY1IWEPibiboqBtD8RoLx9oscsicyB1D94BmuRVicibsYe5mdZYj1jCX37Ara0XkDAU/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/vmHNWaef13CRUash8WLcW8hpceS5yhanSKjIuJrFWeGSBeqLYS00icdQuiajjQIhPQsAciam49QWXUbuKSoDKQJwf19oU8obH1maEe2wtDZXBk/640?from=appmsg "")  
  
  
通过 JWK 头注入绕过 JWT 认证  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLdBvvVibAvz2mibzGbh6sb7XoNHNFvpyDDZcibMdgaXz3IbTWMrDCibW9Vwdur2uyNMrtmq2eeJia8SggJZ3BzZ2mm7RDicibHpBMmmW8/640?wx_fmt=gif&from=appmsg "")  
  
1. 漏洞原理  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLc2lNvN201fh2GToy3iaL6g8lHFWkCRic1QSAd9FcxMz1AwsB7upK8Fv8Vw3aebHCp5vqyUpKdvUwepAzhNs8x1xicJdzxF8XLhCE/640?wx_fmt=gif&from=appmsg "")  
  
    JWK（JSON Web Key）是 JWT 头部（Header）中用于存储公钥的字段，主要用于 RSA 等非对称签名算法场景。  
  
    正常情况下，服务端应使用本地预设的可信公钥验证 JWT 签名；若服务端未严格校验 JWK 字段的合法性，甚至直接信任 JWT 头部中携带的 JWK 作为验证公钥，攻击者即可在 Header 中注入自行生成的公钥，让服务端用攻击者的公钥验证签名，最终通过对应私钥伪造任意权限的合法 JWT，实现认证绕过。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLdkm5va0yaLtic0jiaibnTJMjiaH71XpLwIEE8F3BmVG5AIxJI7NAGBv79NeHZV35v0ElNRa6pujNcUticya38xpnrDqU6ViaqMWKRuY/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLcicox4Mcb32yBRQHrTFJRV16TjFbUIWnkF42coSL9NcSPwzxdZD6WMhV1CaBDibfFEkia0CCqZMtwTV1UY9e5MvLibYmTnlDFm2Wc/640?wx_fmt=gif&from=appmsg "")  
  
2. 前置知识  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLcIWaBhaGQmKZibcZ7k9qPUpAkFdHkOsrbWNj4qA0IlNBZS1MLXTiaCY36jKOlbkwvzoiaPFZpo7InMYX6sIj6DdgUicXeueokHV5Y/640?wx_fmt=gif&from=appmsg "")  
  
    JWK 标准结构：包含  
kty  
（密钥类型，RSA 场景固定为RSA）、  
use  
（密钥用途，签名场景为sig）、  
alg  
（签名算法，如RS256）、  
n  
（公钥模值，Base64URL 编码）、  
e  
（公钥指数，通常为AQAB）、  
kid  
（密钥 ID，可选）等核心字段。  
  
  
    非对称加密逻辑：RSA 算法中，私钥用于签名，公钥用于验签；攻击者需自行生成密钥对，用私钥签名 JWT，用公钥注入 JWK 欺骗服务端验签。  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLdyiahLP2ghr2Be4ce3YKPrdpRDd9ib7eSBGhpeKtAODKLIO7hh6SZdsFxSibYpphuk184t7SF52KzkjIJjRFyNsmJcIQrz2V1PFw/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLdiaC0mlX5F0ibsm0qbgvNuYlRpBv9SymR65tBa7KlD3WFsZjH4q4iaHusyDmIZIX0O3p23TXOrqLG36mzjjgoudYFE5bBoRoxNms/640?wx_fmt=gif&from=appmsg "")  
  
3. 实战利用步骤：  
  
  
1  
  
登录普通用户  
，抓取合法 JWT  
  
  
1. 使用普通账号登录系统。  
  
1. 在   
Burp Suite  
 中抓取携带   
JWT  
 的请求包，复制   
JWT 字符串  
。  
  
  
  
2  
  
在 Burp 中生成 **RSA****密钥对**  
  
1. #### 打开 JWT Editor 插件 → 切换到 Keys面板  
  
1. #### 点击 New RSA Key，自动生成一组 RSA 公钥 / 私钥。  
  
1. #### 保存该密钥对，用于后续注入与签名。  
  
####   
  
3  
  
将生成的**公钥****注入****JWT********头部**  
  
1. #### 在 Burp Repeater 中选中 JWT，右键选择 JWT Editor → Edit。  
  
1. #### 在 Header 区域添加 / 替换为自己的 JWK 公钥信息。  
  
1. #### 插件会自动将公钥填充到 jwk 字段中  
####   
  
4  
  
篡  
改 Payload 为**管理****员****权限**  
  
1. #### 在 Payload 区域修改关键字段：  
  
1. #### 修改用户 ID、角色等权限标识。  
####   
  
5  
  
使用**私钥****重新签名并发送**  
  
1. #### 点击 Sign 按钮，选择刚才生成的 RSA 私钥。  
  
1. #### 插件自动生成新签名，拼接为完整恶意 JWT。  
  
1. #### 发送请求，服务端使用头部注入的公钥验签，成功通过。  
####   
  
6  
  
成功获取**管理员****权限**  
  
#### 响应返回管理员接口数据、后台入口或敏感信息。  
  
  
案例演示：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/v8yrCQN46lGibnfXztFesYNPLQKoYfVFK8VW5TOEhXbAHKkMkLnv7iazSic32VwJqfhUss0jcGeWJY1RlqCS3xCow/640 "")  
  
  
  
1.登录普通用户：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLdcouTZfj2CB0t0UMlrdG67z8SQPfZ5p3qWRcHVlvfCPN8wGEjeOicibXu8h86GbvCkIp7XrSwTqJWTORZxjLSiaBHmibbZEhmxeU0/640?wx_fmt=png&from=appmsg "")  
  
2.使用jwt editor获取新的rsa密钥  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLfEQ8s7GiceXlzztqMgZqYAecW7cdENVDE3viaicIV2IRrUhLj6worzzh8icbExBywS28SzyxdiaWTmSI8NLQQBNgsvtbicGt9wEknLk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLdPia1Riaem1Wfa0z4HgxGNogNMuCOTIp5SokXUMutFpJYY7hCqfCbczGPXNC7TCXnAzkyXm44MkOtE0bxNAiaH5DpichnqMC7OrW8/640?wx_fmt=png&from=appmsg "")  
  
3.使用burp的jwt插件，注入刚刚生成的rsa密钥  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLdJBPSSgwV2QWp4ENLyxvd5Y4RBvPMqcMzUPstUiaabLgwqvY3G0R8rmOrJGxFr5rcZspXQAspiceQJicZlzibfrt16Ec6jQTmcibNw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLdx3lB88nRxxBAcPHczKxjmhEo2PQtPK50aKiaW1SaotoJCucicCeibX1u0iceMLa4APD5P1EHGwc7IUXnwsC7auECwovBxqtBXn4M/640?wx_fmt=png&from=appmsg "")  
  
4.修改用户为管理员，并点击重新生成sign  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLcRTPZpe7Cx0JkH6IwBmP0K1leRWYfic2u7s06te2hGgvb5jicy3RGlGVPPmL5TaTLwibWHG8M2c8IdsBAYHUV24ZMQ5olgE4ibHjA/640?wx_fmt=png&from=appmsg "")  
  
5.成功接管管理员账户：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLfjHfx6iaOA2YEhVTZUoiaLHP40IIr5oz80L4YNRkMQeeTT48ozuSYbfxmWITH52Hx4Qx973pt2rRZpIdWXTpKlpDkiaTpxlsubLw/640?wx_fmt=png&from=appmsg "")  
  
Part 02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/zEUqu7mKQjBohI0v26MRG0XHiaBjRhnU5ywswsDWQZ3TfjQY1IWEPibiboqBtD8RoLx9oscsicyB1D94BmuRVicibsYe5mdZYj1jCX37Ara0XkDAU/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/vmHNWaef13CRUash8WLcW8hpceS5yhanSKjIuJrFWeGSBeqLYS00icdQuiajjQIhPQsAciam49QWXUbuKSoDKQJwf19oU8obH1maEe2wtDZXBk/640?from=appmsg "")  
  
  
通过 kid 头路径遍历实现 JWT 认证绕过  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLeEsibRR9GHaxf51ibibzfLicbjue0JfT73DemztnaxnO1uSwO6yeYIVfIbXib5ll9Z7eXmBYxujWDiamesSjc6pwbBON3quSloSCbPM/640?wx_fmt=gif&from=appmsg "")  
  
1. 漏洞原理  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLfAOIK2GQbSR9Tdj786HuqnMoWck15vicluJ6xxG4LRh0x55EQP21WP2zibsWIhRcq3z5z25A0ZuoPWKhcfQic22M1XwH8Nq18Hiao/640?wx_fmt=gif&from=appmsg "")  
  
     
 kid  
（Key ID）  
是 JWT 头部中用于指定签名密钥的字段，常用于多密钥场景（如不同业务、不同用户对应不同密钥）。  
  
    正常情况下，服务端应根据  
kid  
从预设密钥列表中匹配对应密钥；若服务端未对  
kid  
做路径校验，直接用kid拼接本地文件路径读取  
密钥（如  
/  
keys/{kid}.pem  
），攻击者可通过路径遍历（  
../  
）读取服务器上的任意文件，甚至指定空密钥、静态文件作为验证密钥，最终绕过签名验证。  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLe6RCx5vcOq1HgPe5V7PRHU5Cn7wB3sGLrPv9HVXH55MjS891pFwcwVrB7VnkQ9MTYWicXxnJMN9VqicYRVQ4CFh4GkE2MZACSRE/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLelHF3vFd7fXVR2UbyXOWbrTjZddnjmSjAzFib81n43UgOtVIggWYQ1zLiaHaI2Gaia5wddsZq4EZmwPJib6ys1F7hvlia5lDh3aibWs/640?wx_fmt=gif&from=appmsg "")  
  
2. 前置知识  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLfOv910Sr6ZUhjmdJ3FnLZdicuibJNRtBsE2uicQpzVbCD13ozzArAxwI2ONmX2mhjBgmaOoZY7KD5w270TGArEGTP3Ly1bIEBZXY/640?wx_fmt=gif&from=appmsg "")  
  
    常见利用场景：服务端从文件系统读取密钥，  
kid  
直接作为文件名拼接路径，未做过滤。  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLdvZ6G8YLAhXtV3Pcopusvd8JnDz8pvCCXqx4YfLYbzOV4ruj114kkFiaSUEZkgRJeDooZ2TTuTf7FIgQ0OPv0JlwTBFvOdIdro/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLfSVCajWYIHOyWs1XX61rrIhcZ4JzhYH3VW1Zv3tlXZNzUQCibSQuZE2UytcbmCaB24Bct6v3HVZh5zdicJvhR2R4gtzrzicSGI0Q/640?wx_fmt=gif&from=appmsg "")  
  
3. 实战利用步骤  
###   
  
步骤 1  
  
分析服务端密钥读取逻辑  
  
通过接口测试、报错信息等方式，确认服务端的密钥读  
取逻辑：  
- 若服务端返回文件不存在  
类报错，可确认kid  
用于拼接文件路径；  
  
- 常见路径式：/app/keys/{kid}.pem  
、/etc/jwt/keys/{kid}.key  
等。  
  
  
步骤 2  
  
构造恶意  
kid字段  
  
根据服务端路径格式，构造路径遍历 payload  
  
常见 payload 如下：  
- 读取空文件（Linux 系统/dev/null  
，内容为空，可用于空密钥签名绕过）：../dev/null。  
  
- 读取系统静态文件（如/etc/passwd  
，用文件内容作为密钥签名）：../etc/passwd。  
  
- 路径深度适配：根据服务端路径层级调整../  
数量，如../../../../dev/null  
  
  
构造的 JWT Header 如下：  
```
{  "alg": "HS256",  "typ": "JWT",  "kid": "../dev/null"}
{
  "alg": "HS256",
  "typ": "JWT",
  "kid": "../dev/null"
}
```  
  
将上述 JSON 进行   
Base64URL  
 编码，得到 JWT 的第一段。  
  
步骤 3  
  
篡改 Payload 并签名  
1. 解码目标合法 JWT 的 Payload，修改权限字段，重新 Base64URL 编码得到第二段。  
  
1. 用遍历到的文件内容作为密钥（如/dev/null  
内容为空，即空密钥），对Header.Payload  
进行 HS256 签名，生成第三段 Signature。  
  
1. 拼接三段内容，得到完整恶意 JWT。  
  
  
步骤 4  
  
验证绕过  
  
    将恶意 JWT 放入请求头发送至目标接口，服务端会根据kid  
读取对应文件作为密钥，验证签名通过后信任篡改后的 Payload，实现认证绕过。  
  
案例演示：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/v8yrCQN46lGibnfXztFesYNPLQKoYfVFK8VW5TOEhXbAHKkMkLnv7iazSic32VwJqfhUss0jcGeWJY1RlqCS3xCow/640 "")  
  
  
  
1.登录到用户会话：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLeZZRwKfHiaASUicKdZSnwvFKPtNc7l7kfmvCib1Nsg8x3UoknjVwU6Q55ZuVr4iaa30xlsVTE0uyGWTXMDWSHOLBpkYibNWVhGRHwo/640?wx_fmt=png&from=appmsg "")  
  
2.使用jwt editor生成一个key：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLcZ5GDPVHDRTt0Wgib3jH7xiaWvmYlrFLqzxs4TuDJgtBkg0fxCLJz4QydeRv1ibxNIMdfviceCiaWxnxp0jqBq42H1l9GlMCwpgFUU/640?wx_fmt=png&from=appmsg "")  
  
3.修改k为AA==,AA==的base64解码为空  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLdTQibR5OaEF0uleQ002SaibfSnegNSTN6tIbp2ou8x6X6g2V26atfw1XzoA2Cia6HPaCOqgsrdNGonuOXlV3c2WIvKcrIMzqZF1s/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLeY3cxkG25H9olabcUhVeNLuiaYxnkfibyeu50libcT5kIIGyrxDc0TPRpRyI1QRia4odsvbDvPhWynHvhibGXUKFszDD2WG9gibKicu4/640?wx_fmt=png&from=appmsg "")  
  
4.修改kid为../../../../../../../dev/null  
，尝试跳转到根目录/dev/null  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLdHLtEJQARlat1R0CNywGEibicDq9RTcZQO49826vD6XyHGnxvPdmDFbxemg4kKwORwhWiabZ0E7yUEy8edYKeup6aSWGk3fjiaM90/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLdtrV7RXuLzSUVgAC3NtAjR3HoMJhcRL5VIRGg6EBNSwQwHdDECA2icDBNLnOqHiaTmoz4EVavmvfvGtk0SYzM9ngr2JNsLjOxs8/640?wx_fmt=png&from=appmsg "")  
  
5.修改sub参数为管理员账户，利用刚刚生成的key重新生成sign：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/eDXiba58htLcP10JIe2ia0RlIjCyUjn22B9BibfLFnBAGKySuEeoicvIh3kEgTvwUxlia818mCBX5IQfWmctIF7JHzDMN8jTK3tsFC11VclSt7pw/640?wx_fmt=png&from=appmsg "")  
  
6.成功接管管理员账户：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/eDXiba58htLeeW2YuT5L8icvsHoFuYrv9LNTsI8HxtXllk1YE0VCLGhmdAjJgfWcgicXoOdWAD1iaBib4Jv1iaxXFdkicfI4OsicWUrvrdK4KFpQiaP8/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLfSMS2eYOrEKonIuicibObEdpFwW7JVQMtIq89Fo8IgLR9WWyI6hlX6BtgdIRgDOZKN9s12DMXiaOURIbYkCu2xe8eVUZz9sH9PvM/640?wx_fmt=gif&from=appmsg "")  
  
4. 防御措施  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLe6JrFic103Zr6w8W4pleSVupfUfjjNbpLto8PRkkCeZhaMrIgSCTyA5pmHknLGNBIQjWcM0L7a7icYdtN1e5AJlj0109yWRFKQw/640?wx_fmt=gif&from=appmsg "")  
  
- 对kid字段做严格的路径校验，过滤../、./等路径遍历字符，仅允许字母、数字、下划线等合法字符。  
  
- 仅允许kid为预设的合法密钥 ID，禁止直接用kid拼接文件路径读取密钥。  
  
- 密钥文件存储在非 Web 可访问目录，避免路径遍历读取。  
  
- 采用数据库存储密钥，而非文件系统，从根源避免路径遍历风险。  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLcOvh2gkNaAYCMmafYFapt5icd7ABkoL29ErPquB82MYg7C2JKOo2av143CS1eNodkrnSXJ0Du8KfutHdLHvuNlhllE7CBGmD4E/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Part 03  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/zEUqu7mKQjBohI0v26MRG0XHiaBjRhnU5ywswsDWQZ3TfjQY1IWEPibiboqBtD8RoLx9oscsicyB1D94BmuRVicibsYe5mdZYj1jCX37Ara0XkDAU/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/vmHNWaef13CRUash8WLcW8hpceS5yhanSKjIuJrFWeGSBeqLYS00icdQuiajjQIhPQsAciam49QWXUbuKSoDKQJwf19oU8obH1maEe2wtDZXBk/640?from=appmsg "")  
  
  
通过算法混淆实现 JWT 认证绕过  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLdk9rgOmxjgVxAEJ3JxL6EUCNt3GibjHvdicf6lGSgUlM6NibHLkfSIvxKGRHSib35nJsr7crY6diaQkCTc5mGZ6myKZjoCIP6gsJibg/640?wx_fmt=gif&from=appmsg "")  
  
1. 漏洞原理  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLdhZIiaDhKkGOMAu2juBFRgKcxNTIolaVMjA6Ke1Ql4f4pyK3Dn73Nz6mjFoUsibicHaCicYH1pNRUDgdcvLfok13BDwxJha0Xjoss/640?wx_fmt=gif&from=appmsg "")  
  
    该漏洞无需获取服务端密钥（公钥 / 私钥），仅利用服务端的算法校验缺陷实现绕过。其原理为：  
- 服务端同时支持对称算法（HS256）与非对称算法（RS256），但未做严格的算法隔离；  
  
- 攻击者  
通过构造特殊的 JWT 结构，让服  
务端错误地使用对称算法的验签逻辑，验证非对称算法的签名，或利用算法解析缺陷，跳过签名验证；  
  
- 整个过程无需获取服务端任何密钥，仅通过修改 Header 与 Payload 即可实现绕过。  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLch9IuXzOYRibxLssgHcmw7xn13dH3p1sX843PzxtPUElGjvMlFibvcviajo7WvMoGFbr1dKZzYhXicLUqh6oibUcdEzoIPaFPm0Z20/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLczOw0V5XEfKyuvLzJPg8PFz2pMo3lnw1vx2hBiaqSqlNGjVH7YeWLvjVb2tPHYvODicNqs73l1Q3ND6eSW303BzoF6R0z2qoOgQ/640?wx_fmt=gif&from=appmsg "")  
  
2. 前置知识  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLenWcXtRAX4ZdSvg20ib2RiaCjiaLP4JY3ZPqCKuzh5oBC0FSicTVmMiaLnZozp30n3r7aOxj5YSpDxfFbKQkZ2BkuIy6o5LD9gnytM/640?wx_fmt=gif&from=appmsg "")  
  
    常见利用场景：服务端使用通用 JWT 库（如jsonwebtoken），未配置严格的算法白名单，导致算法解析逻辑被绕过。  
  
  
    核心优势：无需密钥，仅通过算法混淆即可实现绕过，适用于服务端密钥未外泄的场景。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLc5BDjPRbK3ly3uvHMsBKrMpwPL1lSXicVCBm05Q0k94HuaX8XR2qnlpECzrqq8exYCvfrRz3SmJiavINRNc5hKkId8gtEEnDehs/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLdopQHmoeViaqbUPENKQVwoDKsCCiaKToUJntYqSic3libncOyXDict1VqBfQbqzWHeUViaaS0OpXjavQyOLAZYKpic3Wo48OSUQ6x9cA/640?wx_fmt=gif&from=appmsg "")  
  
3. 详细利用步骤  
  
  
步骤 1  
  
分析服务端算法支持情况  
  
通过测试不同  
alg  
字段的 JWT，确认服务端同时支持 HS256 与 RS256 算法，且未做严格校验  
：  
- 发送alg:HS256  
的 JWT，若服务端正常验签，说明支持对称算法；  
  
- 发送alg:RS256  
的 JWT，若服务端正常验签，说明支持非对称算法。  
  
  
步骤 2  
  
构造算法混淆 Header  
  
构造特  
殊的 Header 结构，利用 JWT 库的解析缺陷，  
  
常见两种利用方式：  
##### 方式 1：双算法混淆  
  
在 Header 中同时声明两种算法，让服务端解析错误：  
```
{  "alg": "HS256",  "alg": "RS256",  "typ": "JWT"}
{
  "alg": "HS256",
  "alg": "RS256",
  "typ": "JWT"
}
```  
  
部分 JWT 库会优先解析第一个alg  
字段，用 HS256 逻辑验签，同时用 RS256 的公钥作为密钥，实现绕过。  
##### 方式 2：算法别名混淆  
  
使用算法别名（如HS256  
别名HS256(None)  
、RS256  
别名RS256-null  
），让服务端跳过签名验证：  
```
{  "alg": "HS256(None)",  "typ": "JWT"}
{
  "alg": "HS256(None)",
  "typ": "JWT"
}
```  
  
部分 JWT 库会识别为无签名算法，跳过验签，直接信任 Payload。  
  
步骤 3  
  
篡改 Payload  
  
    解码目标合法 JWT 的 Payload，修改权限字段（如提升为管理员），重新 Base64 编码，得到 JWT 的第二段。  
  
步骤 4  
  
构造签名  
- 若服务端跳过验签，可直接删除签名，保留末尾的.  
格式为Header.Payload.  
；  
  
- 若服务端要求签名格式，可使用空字符串或随机字符串作为签名，部分库会忽略签名校验。  
  
  
步骤 5  
  
验证绕过  
  
    将构造的恶意 JWT 放入请求头发送至目标接口，服务端因算法解析错误，跳过签名验证或错误验签，信任篡改后的 Payload，实现认证绕过，且全程无需获取服务端任何密钥。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/UxfuWGC2h883TnCYz8FJbVVia7ml9Fz8zanzNOicrK8EF00LNicSepKWKJUZyXIibe0saqkTwGyu5tSNVNHkX5Vpkw/640?from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/eDXiba58htLedExcf3vT1hyQFicEuuujkW3iaLycG3NNnH6BPJ5FpF9ozDsoUiaIIgrOrF3iceTGDplib8hQERAictRmIvaRHIcWvPN5RAjQmL9b8U/640?wx_fmt=gif&from=appmsg "")  
  
4. 防御措施  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLdkmYZgu5QReMdMnUjJ3ibcUEy8JC7qDmvt1ficxNMUaylKkuOXdCpTI91w063HrBQsLRr7Ir8lvIEcVGdNWxb964jBiaQ3w10ZgY/640?wx_fmt=gif&from=appmsg "")  
  
- 服务端配置严格的算法白名单，仅允许指定的一种算法（如仅 RS256），禁止其他算法。  
  
- 升级 JWT 库至最新版本，修复算法解析缺陷，避免双算法、别名等绕过场景。  
  
- 采用算法强制校验机制，在验签前明确指定算法，禁止从 JWT Header 中动态读取算法。  
  
- 对 JWT Header 做完整性校验，禁止重复字段（如双alg），拦截异常 Header 的请求。  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/eDXiba58htLcsoEr3iaWx6tWIKxzFopvIVm1NYpEQnl4XHXibIB3eykuia3MacASTksT0OytY6WibyPZhgCBcMASTIFCtuS2dPOiblecdOEfQgIWw/640?wx_fmt=gif&from=appmsg "")  
  
  
  
Part 04  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/zEUqu7mKQjBohI0v26MRG0XHiaBjRhnU5ywswsDWQZ3TfjQY1IWEPibiboqBtD8RoLx9oscsicyB1D94BmuRVicibsYe5mdZYj1jCX37Ara0XkDAU/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/vmHNWaef13CRUash8WLcW8hpceS5yhanSKjIuJrFWeGSBeqLYS00icdQuiajjQIhPQsAciam49QWXUbuKSoDKQJwf19oU8obH1maEe2wtDZXBk/640?from=appmsg "")  
  
  
通用防御总结  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xNgVCIrftqZGJk7sSfvXjXRicRaUDia2N661licibtmFm7886zzgpfZW9TY6SPFmf7aMOJH3x2BZtqJYCcO8nnVLvA/640 "")  
  
1、严格校验签名  
  
    国  
服务端必须验证 JWT 的 Signature 部分，禁止仅校验 Payload。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/sk3U7agjTJBC1GbWw1CUmTJ5iaeFr4vUgYmDicicMffzvHNZS4rOnHVl5t1QLibpvLxnu9XYvsdGaXSdKCPgxtIupg/640 "")  
  
2、算法白名单管控  
  
    明确指定允许的签名算法，禁止none算法、未授权算法。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/StPIKtnEcT2NACMJicY7d4nV9SSz5DcYgNWjsTjVIIr9k5lyKTU0iaV3AIvXh4R3APwiaNKJSicass7YD84xa5hlfQ/640 "")  
  
3、密钥安全管理  
  
    对称算法使用高强度密钥，非对称算法妥善保管私钥，公钥仅用于验签。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/xNgVCIrftqZGJk7sSfvXjXRicRaUDia2N661licibtmFm7886zzgpfZW9TY6SPFmf7aMOJH3x2BZtqJYCcO8nnVLvA/640 "")  
  
4、头部字段校验  
  
    对 Header 中的jwk、jku、kid等字段做严格校验，禁止未授权字段  
。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/sk3U7agjTJBC1GbWw1CUmTJ5iaeFr4vUgYmDicicMffzvHNZS4rOnHVl5t1QLibpvLxnu9XYvsdGaXSdKCPgxtIupg/640 "")  
  
5、定期安全审计  
  
    对 JWT 认证逻辑进行渗透测试，及时修复算法混淆、路径遍历等漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/StPIKtnEcT2NACMJicY7d4nV9SSz5DcYgNWjsTjVIIr9k5lyKTU0iaV3AIvXh4R3APwiaNKJSicass7YD84xa5hlfQ/640 "")  
  
6、缩短令牌有效期  
  
    设置合理的 JWT 过期时间，减少令牌泄露后的风险  
。  
  
  
往期推荐  
  
[JWT认证漏洞实战解析](https://mp.weixin.qq.com/s?__biz=MzkwNzY3MjkwNg==&mid=2247484451&idx=1&sn=66c9e9cf0b2d1749d7d0f36484e60a90&scene=21#wechat_redirect)  
（一）  
  
[云存储实战挖掘思路](https://mp.weixin.qq.com/s?__biz=MzkwNzY3MjkwNg==&mid=2247484430&idx=1&sn=bad553a346639ab083319b8c62b790a4&scene=21#wechat_redirect)  
  
  
[新思路！支付漏洞实战案例分享：低价薅高价商品](https://mp.weixin.qq.com/s?__biz=MzkwNzY3MjkwNg==&mid=2247484411&idx=1&sn=e0440dd052505b4b6b97093455bc6cc8&scene=21#wechat_redirect)  
  
  
[实战视角：LLM 不安全输出引发的 XSS 漏洞与对抗](https://mp.weixin.qq.com/s?__biz=MzkwNzY3MjkwNg==&mid=2247484391&idx=1&sn=5f522d234dafed56e2a1e6837b98303d&scene=21#wechat_redirect)  
  
  
  
话题征集  
  
Today's News  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2REVYDOYKpwVWdKcRsLl4LNrw0zjMib74vAfgT2ricmPRQBc3AibyEerKa8icDyIOfkSlll8PZDrH0wn9icFF2eia5ICR1fjCnicXlN50JAhPUmlTQ/640?from=appmsg "")  
  
NEWS  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/5upuicN3ZIJhMgib1c6hRSgEdDFr66LraibKj0miarOT0lSohPSqlobdp4WBEw2wABvrTtiaqDkCCpaiaiaYuZfKvtB6Vu7iaJnd6TIpVbEnicZtlQHc/640?from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/5upuicN3ZIJhMgib1c6hRSgEdDFr66LraibKj0miarOT0lSohPSqlobdp4WBEw2wABvrTtiaqDkCCpaiaiaYuZfKvtB6Vu7iaJnd6TIpVbEnicZtlQHc/640?from=appmsg "")  
  
    哈喽，感谢看到这里的你！![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_64@2x.png "")  
  
  
  
    如果有什么  
想要了解的话题、想看的内容也可添加下方小助手联系我们，或留言评论区，选中话题会整理写成完整文章噢～  
  
  
    也可加入我们  
交流群，参与话题讨论，群里也不定时分享干货、答疑解惑，第一时间同步新文章和小惊喜，添加下方小助手，备注  
【公众号，进群】即可。  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/nWZrJa3yq4kvBz3bsQia7McsPBahlSibuQNgmN0sHbSibraoofeVTJBE5Iqh4g1Uz4yVzD10WvACxBePxDz3cIAQQ/640 "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/a8rkalooibKZEics1QicwficNCZmqmv3gQnh0pQibXzzTeP2wicUqagrpbGLLXrZjfoHDYH4AicgJWfgiaPaicONrMDQicEQ/640 "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/eDXiba58htLenpFwN27wPsSvqSF5FfKgOiaNljnN3HACqzjeGzyOrlWAZf3qpW9wlDkohprQV7ETKHIhYXI82N7t1JIc8SLrLXLq4Dsb5mLC8/640?wx_fmt=jpeg&from=appmsg "")  
  
备注【公众号，进群】  
加入交流群  
  
一起交流，相互学习  
  
  
**点赞鼓励一下**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/kw2nrMk65sdm2h1H7HL0PuJZltDnjKlKJKwx2SOicHZ6ciceNaAhompextcznbssviakCvDN8S2yJxhDVDuZhxSFw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1 "")  
  
  
  
