#  Struts2-066上传漏洞原理详解  
原创 三呼呼
                        三呼呼  古月安全   2026-04-20 01:36  
  
漏洞简介  
  
struts2的S2-066漏洞，它是一个在2023年底披露的**高危文件上传路径穿越漏洞**  
。其核心在于攻击者可以通过精心构造的请求参数，“污染”并覆盖框架内部的文件名变量，从而将恶意文件上传到Web服务器的任意目录，其影响版本：**Struts2框架**  
（2.5.33及以下或6.3.0.2及以下）  
### 漏洞核心原理：参数污染  
  
这个漏洞是Struts2框架在处理参数时，**多个环节的共同缺陷**  
导致的连锁反应，而非单一问题。下表对比了正常流程与存在漏洞的流程：  
<table><tbody><tr><th><p><span leaf="">处理环节</span></p></th><th><p><span leaf="">正常预期行为</span></p></th><th><p><span leaf="">漏洞环境下的缺陷行为</span></p></th></tr><tr><td><p><strong><span leaf="">HttpParameters收集参数</span></strong></p></td><td><p><span leaf="">统一处理参数，无歧义。</span></p></td><td><p><span leaf="">对</span><strong><span leaf="">大小写敏感</span></strong><span leaf="">，将</span><code><span leaf="">UploadFileName</span></code><span leaf="">和</span><code><span leaf="">uploadFileName</span></code><span leaf="">视为两个不同参数存入。</span></p></td></tr><tr><td><p><strong><span leaf="">ParametersInterceptor参数绑定</span></strong></p></td><td><p><span leaf="">有序地将参数映射到Action属性。</span></p></td><td><p><span leaf="">使用</span><strong><span leaf="">TreeMap</span></strong><span leaf="">存储参数，其</span><strong><span leaf="">自然排序规则</span></strong><span leaf="">导致</span><code><span leaf="">UploadFileName</span></code><span leaf="">（大写U）排在</span><code><span leaf="">uploadFileName</span></code><span leaf="">（小写u）</span><strong><span leaf="">之前</span></strong><span leaf="">。</span></p></td></tr><tr><td><p><strong><span leaf="">OGNL调用Setter方法</span></strong></p></td><td><p><span leaf="">严格按参数名反射调用对应方法。</span></p></td><td><p><span leaf="">OGNL在反射前会对属性名进行</span><strong><span leaf="">规范化</span></strong><span leaf="">（capitalize），</span><code><span leaf="">uploadFileName</span></code><span leaf="">会被转换为</span><code><span leaf="">UploadFileName</span></code><span leaf="">。这就导致框架试图两次调用同一个方法</span><code><span leaf="">setUploadFileName</span></code><span leaf="">。</span></p></td></tr></tbody></table>  
**漏洞复现**  
  
环境搭建：新建一个web项目：  
  
导入相应的软件包：pom.xml  
```
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
    </dependency>
    <dependency>
      <groupId>org.apache.struts</groupId>
      <artifactId>struts2-core</artifactId>
      <version>6.3.0</version>
    </dependency>
  </dependencies>
  <build>
    <finalName>struts2</finalName>
  </build>
</project>
```  
  
项目结构如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7bh5Ll9eOLASZDvyyZBGj3mWjqAW1tMk3y3ef3ibKNCJUOBr206KBAshNv6WzfaCiaabDUnEaIITonwic116S6Ed7qYUdqqQTseQ/640?wx_fmt=other&from=appmsg "")  
  
设置运行环境，tomcat 9.0.107-可自行选择，该漏洞与tomcat版本无关。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6drmBKAUichODiahicEPZYvoic6bSWq88ltvBtWPv2QtBuvhQ1njyvhMqFMTPduTSVk9O8tGIFrOViaLhqkEGcffnN93cEbaBXoiaQ0/640?wx_fmt=other&from=appmsg "")  
  
然后启动web：如下正常显示。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn56UqhG8gBgJOZX2aZ6s9ianLUxUuY6OSHqEMHQD6A0cNGnsbo1WKkvIQM1TCRzJLSxIx37m3WK8YVAG1wiaDAibicgV3Rjs3Yu2v8/640?wx_fmt=other&from=appmsg "")  
  
接下来使用struts2框架实现文件上传的功能，新建一个action：upLoad.java  
```
package com.struts2;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;
import java.io.File;
/**
 * 文件上传Action类
* 【安全警告】此实现存在S2-066高危漏洞风险：
* 1. 直接使用了Struts2默认的文件上传属性命名规则
* 2. 未对uploadFileName进行路径穿越过滤
* 3. 若Struts2框架版本在受影响范围内，攻击者可利用参数覆盖实现任意文件上传
*/
public class upLoad extends ActionSupport {
    private static final long serialVersionUID = 1L;
    // 文件内容本身，对应表单中name="upload"的<input type="file">控件
// 框架会自动将上传的临时文件注入到此属性
private File upload;
    // 文件MIME类型，由框架自动注入
// 命名规则：表单字段名(upload) + "ContentType"
private String uploadContentType;
    // 【关键漏洞点】原始文件名，由框架自动注入
// 命名规则：表单字段名(upload) + "FileName"
    // S2-066漏洞的核心攻击目标：攻击者通过构造污染参数可覆盖此值
private String uploadFileName;
    // 以下getter和setter方法由Struts2框架通过反射调用
// 这是实现自动参数注入的基础机制
public File getUpload() {
        return upload;
    }
    public void setUpload(File upload) {
        this.upload = upload;
    }
    public String getUploadContentType() {
        return uploadContentType;
    }
    public void setUploadContentType(String uploadContentType) {
        this.uploadContentType = uploadContentType;
    }
    public String getUploadFileName() {
        return uploadFileName;
    }
    /**
     * 【关键漏洞点】S2-066漏洞利用的目标方法
* 攻击者通过发送名为"uploadFileName"的请求参数，
* 利用框架的OGNL处理缺陷，可多次调用此方法进行值覆盖。
* 若参数值包含"../"等路径穿越字符，将导致任意文件写入。
*/
public void setUploadFileName(String uploadFileName) {
        this.uploadFileName = uploadFileName;
    }
    /**
     * 执行文件上传的业务方法
* 【关键漏洞点】直接使用未经验证的uploadFileName拼接保存路径
* 若uploadFileName被覆盖为"../../WEB-INF/web.xml"，
* 将导致文件被写入任意目录，构成路径遍历漏洞。
*/
public String doUpload() {
        // 获取服务器上"upload"目录的物理路径
String path = ServletActionContext.getServletContext().getRealPath("/") + "upload";
        // 【高危操作】直接使用用户可控的文件名进行路径拼接
// 此处应进行：1.路径穿越过滤 2.文件名重命名 3.扩展名白名单校验
String realPath = path + File.separator + uploadFileName;
        try {
            // 将临时文件复制到目标路径
// 如果realPath被污染，可能覆盖系统关键文件
FileUtils.copyFile(upload, new File(realPath));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return SUCCESS;
    }
}
```  
  
以及其对应的前端内容：upload.html  
```
<!DOCTYPE html>
<html>
<head>
    <title>Struts2 文件上传</title>
    <meta charset="UTF-8">
</head>
<body>
<h2>简单文件上传</h2>
<!-- 表单必须：method="post", enctype="multipart/form-data" -->
<form action="/struts2/upload.action" method="post" enctype="multipart/form-data">
    <p>
        <label>选择文件：</label><br>
<!-- name必须与Action中的属性名一致 -->
<input type="file" name="Upload" required>
    </p>
    <p>
        <label>自定义保存文件名 (可选)：</label><br>
        <input type="text" name="uploadFileName" placeholder="留空则使用原文件名">
    </p>
隐藏字段用于传递文件MIME类型，通常由浏览器自动填充
     如果你的Action需要，可以添加此字段，但一般可省略
<input type="hidden" name="uploadContextType" id="uploadContextType">
    <p>
        <input type="submit" value="开始上传">
    </p>
</form>
</body>
</html>
```  
  
为了让struts2框架帮我们实现上传文件的管理，还需要一些特殊的配置，使用struts2的过滤器：在web.xml中加入如下配置：  
```
<!DOCTYPE web-app PUBLIC
"-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
 "http://java.sun.com/dtd/web-app_2_3.dtd" >
<web-app>
  <display-name>Archetype Created Web Application</display-name>
  <filter>
    <filter-name>struts2</filter-name>
    <filter-class>org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>struts2</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
</web-app>
```  
  
以及新建一个struts.xml，放在resources目录下：  
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE struts PUBLIC
"-//Apache Software Foundation//DTD Struts Configuration 2.0//EN"
        "http://struts.apache.org/dtds/struts-2.0.dtd">
<struts>
    <package name="upload" extends="struts-default">
        <action name="upload" class="com.struts2.upLoad" method="doUpload">
            <result name="success" type="">/index.jsp</result>
        </action>
    </package>
</struts>
```  
  
这样就完成了全部的环境搭建，最终的项目结构如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7k6jiccTSdHO60DLL2Glg1bZX84bhH5Dry7icmg6NsITz1BGzcgxGYe0Y0PFCl7KbWXTicUluZHctQdFAUARxiaspLaBMxLgiaV6eE/640?wx_fmt=other&from=appmsg "")  
  
启动之后大概是这样：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4AtL0LVUl4ic6z8liaEV3MCS4R1d0go05zlXBZicL52t43xRmrm51IN8b7PSAORLawyWUAFcLFVv0SydPTAic2OzicCmYId7Bt1ROg/640?wx_fmt=other&from=appmsg "")  
  
**文件上传漏洞**  
  
在当前的上传页面，选择任意文件，然后修改自定义的名字，将会生成对应的payload：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4EH0Mho0dPyiaKasicUIcfiaNe5nXGEu9fGdIjZL9JL8l2lXWbMY8ZkHAWyhbHzYCsxJ0Y4GCBVSFtqorTOPK3kVxweoGcxrmLxE/640?wx_fmt=other&from=appmsg "")  
  
正常的上传大概是下面这样的：与上面相比，多了一个自定义的参数：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6fU8euJyyRIrQiaWFuVgCjOG6IYwmH1uGUl9ibibMy321icL1xwdflo6ddHJ765toKmyMe2icNdX6GhOjmZXpCNLGvhllnaic71JDZM/640?wx_fmt=other&from=appmsg "")  
  
上传之后，项目目录下结果是这样的：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4UxeibHj3dhTyteBBwyIYJhpZVw7Z7ia9yfUOiceibcRvHjTCoDuxPUzTkaib2XPraU3Jor2n1Uzfz04QSGEHvBKib2icJVWvNSszf6Y/640?wx_fmt=other&from=appmsg "")  
  
那么就可以上传任意文件，从而达到上传木马的目的，比如上传jsp文件。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5MWvRX5JX5m5NTMleoDIibKy5z7W4GOF9EhEpudzIIYHiceYuEHtL1X683KKcibWrIpZ5wLvj6zm7Act5uUBxR4lRYiaQdichYQbLM/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4ebYA7aZaDyVbPpiczsiartXdndmAMrqdvdHWAdol1GcD2MDvib0VoAicWqdDNcetictfOMlpYLGl9U2tD6lwTec3UicYASxL8ASc3Y/640?wx_fmt=other&from=appmsg "")  
  
**漏洞复现总结：**  
  
**通过构造恶意的上传参数，并指定参数的值为目录穿越的格式（../../*****），从而实现目录穿越，上传任意文件类型。实现远程代码执行（RCE），完全控制服务器。**  
  
**漏洞原理分析**  
  
现在来看看到底是如何造成的目录穿越。调试我们的上传的action类：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6Msl3AskRmbFqwmt5bOXUX8GqR4KwueO4Ar5Pp5xficaNOhvwiaR9LyniajaxR6rkGtT28iaFLFPvSALFDPRohmr2wxHJcyOYdCjY/640?wx_fmt=other&from=appmsg "")  
  
发现这里的uploadFileName变量被赋值成..\12345.jsp了，但是我们自己并没有对他进行赋值，我们代码中也没有相关操作，那么它一定是struts2框架帮我们完成的，问题大概就是出在这个赋值过程中。  
  
既然是上传的漏洞，肯定是与上传相关的功能，在struts2框架中有这么一个类：  
  
**FileUploadInterceptor.java**  
拦截器类。  
  
主要功能就是用来处理上传相关的操作的，并且它实现了一个拦截的方法intercept()，如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn43ice3OBybP3dB4RwVrI3XElkibQwWQRQBCs1htQlPeDyKibHPicoibv9VCTAd4Bb00HuicW9s4tB2m5n97BEeSjcXicYIfWD6ZDEGLI/640?wx_fmt=other&from=appmsg "")  
  
首先就是常规的获取web上下文的操作：得到了我们提交的一些参数的值：比如uploadFileName的参数的值。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7AWPicZXTJ4PqxP9klicTMGBDb9Jibr20Nyo8tudKbH2BVCShpK3WfcWJwfEHI4gn9WiaibDVx4ibBs0reibnSbzChgbXS48UvDUavkY/640?wx_fmt=other&from=appmsg "")  
  
**struts2的过滤规则**  
  
然后下面有个方法调用：String[] fileName = multiWrapper.getFileNames(inputName);得到一个fileName。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn75eXDQAoIxVAQMiaib695ZIh27vpdCGrIz6pAcYXkqsmSkdhaanHZvjFNww1RM1ibkoiaYCES36eQicesriaqMfPBwb5gs593SGibHHw/640?wx_fmt=other&from=appmsg "")  
  
进入该方法，它会从files中取出Upload对应的值，其实就是上传文件的相关信息：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7iajXv5f1byaib4EsBn3ZcDfXNZzU2gXa2m44BKqZZ9tFfASXKyYQvmzReKLGFLqbNJy2s2Gm4OvGdMKKE4UoD57jkMcKbBkHYw/640?wx_fmt=other&from=appmsg "")  
  
然后调用 fileNames.add(getCanonicalName(fileItem.getName()));方法：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6QUFqwe5OrKria0YyzFMsy3AyFqcP90OcSWOn8GAlIicJ6PlMYwb8oY8UWrbM4zQW3qplbJZQjCJDDLv6zsVgOIzuDicDseK0g2s/640?wx_fmt=other&from=appmsg "")  
  
进入getCanonicalName方法可以看到，struts2本身已经对上传的文件格式进行了过滤，防止文件穿越，比如下面的测试，使用..\它会将其过滤掉。既然struts2对文件名进行了过滤，那么漏洞又是如何产生的呢？  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5jtqkZZAUGflI7P3j08micnvxJ8TQQMF0ekfMdsrEyyFicscGCUOpMC9vTkt83cspriaOP1o9aqhPI8FlgyM8d3bGaPKWCOvdeNo/640?wx_fmt=other&from=appmsg "")  
  
过滤之后返回到调用该方法的地方，继续往下执行：还是这个FileUploadInterceptor类里面的拦截方法如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn77sSAH31x5OXzR7W2Ex98ByQ1iavz24geF4l3ayqnexELJu38ibhfzpJwuzy47ibzHl49kEus0Wn3z2vqYAZr0qyXnecYbYxzXrc/640?wx_fmt=other&from=appmsg "")  
  
**接着它创建了几个变量，比如上面两行关键代码，它通过拼接的方式将inputName拼接到这2个字符串的前面，这样就得到了两个变量分别是：UploadFileName和UploadContentType。而我们恶意构造了一个首字母小写的uploadFileName参数在上下文ac的parameters中，这两个参数相似度99%！**  
  
然后将其加入对应的List变量中。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5RcicA5CbmGRhPDqrtRhLCX43W1LxYRna7gqnoZDdBweSRgic2BE9sPGuFlIBpnaJeBDUcNzENMMneaLdDfy1WuUtrX6V2j7ZTI/640?wx_fmt=other&from=appmsg "")  
  
继续往下将拼接得到的参数以及对应的值全部放进上下文ac的**parameters中。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5T8FPweHjwm8ojkQjgibRqZTfgFZgfmLvNyI7FoRpdAeZMzdQ3CtPwOsky6CC2icSFiaNA4wKrU7g6rNqkrpXr3WlKyQFlUwKMJM/640?wx_fmt=other&from=appmsg "")  
  
执行完这一行代码之后，ac上下文parameters的值变成了如下内容：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6VekjDeAB7wO4gh8iccTtzjz2ibgYOmgBm7OacApNSicice6Cq3Uibvt6F1gtLMNvLK34O8x8rImZBIsqpFvnyN2gqicLkFA8mH1BgY/640?wx_fmt=other&from=appmsg "")  
  
最后执行invoke()方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4bwss7lNexicjvM5lQ3JwiaLULWCcBZOlEZkOoWwX06A9ACy8bDlgTP9S1icnQPJ9Y0LXsqZusYNZiarYF9AWEUWjCRjYFic7S96JM/640?wx_fmt=other&from=appmsg "")  
  
然后从DefaultActionInvocation.invoke()方法中调用executeConditional((ConditionalInterceptor) interceptor);该方法会调用MethodFilterInterceptor的intercept方法，然后通过这个方法调用ParametersInterceptor的doIntercept方法：中间不很多不重要的方法之间的调用就不详细看了。  
  
**大写UploadFileName循环**  
  
在doIntercept方法中取出这几个参数，然后将其作为形参调用setParameters方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4IM4o79BY8LlHIOic35vxkrztcbbGr7hYl7Gy5Zo5GdX6QDK6ibic4AUice1UWhrQwVjhMdkvCQvPyfejfibVZIXHB6OIwAzibBCoicE/640?wx_fmt=other&from=appmsg "")  
  
在setParameters方法中：首先对每个参数进行一些特殊字符的判断，不重要了解即可。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4NvPP1cjAVG4O0OXicOyyB0ZL3LlsOCl1QHG86cnMFKfWEqRMeswT40zVk2ZzicTR4Leg3vEJCl0A1w2KictHwqomjK4tWM123ibo/640?wx_fmt=other&from=appmsg "")  
  
然后来到这里**逐一取出treeMap中的每一个k-v调用 newStack.setParameter(name, value.getObject());**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn48dP24P01dxlZC0A4u2fv1Fic6xw986ru8fKj1XC504rPLVBfgPWAooPsiaRaa7moc98UKmKUN2KtrSd4WlGI4RQFQuj806qrQY/640?wx_fmt=other&from=appmsg "")  
  
就会来到OgnlValueStack这个类：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4aiccU6miby9Mia5ZyrPzH6qcxXkcquSVJHdf8wLEHj31x3BVFm0mgzzDr82Xxva3EqETYBRmNFFz9qUTAb5iaWYEpWHbdjjiaYL24/640?wx_fmt=other&from=appmsg "")  
  
继续跟着这个执行过程走：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6ksA4QrR5IAARRSGngm7QEWkuZsYO163ocJ9j93ECNXtEKFrGFXULf2wuDkl7HzWyJJ1bOicE9qehC0njcask6vZasNicpTNkDQ/640?wx_fmt=other&from=appmsg "")  
  
来到OgnlUtil类的setValue方法：该方法最后一行会调用：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4pOETfgGgVzH0PgMSMeWlUAz9A7Ef9ibtdqeusvbU4jMjhLKdNEhqwvKUKibGgWibPPycIdHRa3yoX18uE6YIjiaYZTW4A4vU7ypI/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4iamwawSk0HFfTQfkoPua2picvlT2ASicRibKRC40o7qgN8ia01lpJiabsfYyes0q8PO9InE8txcgMXIribFFEjr3gcM6JxCUAddAgFA/640?wx_fmt=other&from=appmsg "")  
  
从而进入SimpleNode类的setValue方法，再次调用它的evaluateSetValueBody方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6lNp2wD1nQuEukyGWexINFiakotIMHqGeKUMTianOFiav5hUuyAElHcWUTKBWlx0PiaZnpTaGrzicdrmiaXGPWGtsxOKnGaL90UQMPI/640?wx_fmt=other&from=appmsg "")  
  
继续调用ASTProperty类的方法setValueBody：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4ZXcnzL9DQUwBcvskibKMXkcM1icgs164KlDNxZU2Oh5mvzACbhgRhjsqWRZB4hGL6qj89H5Qs3kLtO9nSJzQ7nyAHiciaUWNibqqg/640?wx_fmt=other&from=appmsg "")  
  
继续方法之间的调用：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7qXcajzRLm7gFE4y8LSKJ47vMZjN1JhJt0pzEONT8qPiawXNqvIEaiatq1ZGzsS4Eibic8ONff9dnq7ELiaucibc3NNNtPAsYg7aEEQ/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5kQ2XfIeafLibLNtKlCMYDlz4RPZvATZ4e6gRRNqp1pyPQXTa6VZa59nrc2qicibv7dvYgIDVojdSViar4g04zOqlZFpAnRMNc21s/640?wx_fmt=other&from=appmsg "")  
  
**关键路径这里CompoundRootAccessor类的setProperty()方法，会连续调用2个方法OgnlRuntime.hasSetProperty(ognlContext, o, name))和OgnlRuntime.setProperty(ognlContext, o, name, value)。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4NW4pbYgJ7xmVibZh4icqibMUYibxadJGnxftweRic4KhibEVDKxrFu6wK9ZVEsicXgrmV5J0La1n4G7N6bIynskicCuWZ2p1viaodFO10/640?wx_fmt=other&from=appmsg "")  
  
**先来第一个OgnlRuntime类的hasSetProperty，一路调用到setMethodValue方法**  
,它会执行getSetMethod方法，看名字大概就知道什么功能了。它会获取setter方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7Uu8ntx0NQjuHw8gCOEyE6ib0ymV0F7jCj0qlU7EzcTdFT88uibKKDlYA4Aw8HqAhwZibEnV5N4kgNdibn3YImNhibvRsgp6iatiaQzc/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4XHDTJKjgG3YaHqGpWMCCbIWEnTBEFdpRh4VykpLmVMUetOJEhnLqOaBAj8Qs9YDfMsSSxABGj5rpl5v7Du13OjdPTjiaOnkeo/640?wx_fmt=other&from=appmsg "")  
  
最终会来到这里的方法并调用getDeclaredMethods如下：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6OJZT3LOQ4yfY2ge9fvFticnov1nFWHDLI32jnCtOFtXLEzGuWdGBOBDsytibCDkCHanKibBiahAfyc0FWf4EnibKRHdAYrnzVw6MI/640?wx_fmt=other&from=appmsg "")  
  
**在getDeclaredMethods这个方法里面有这样一个调用：capitalizeBeanPropertyName(propertyName);**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn79voz2At1XDDDdPaNmS7krCukPjpW25hrcOMdNpn1bapuvKFzKTBwQGj4bpZnwsJEGoDk2xAibmbmfiaS5MoY4Hyvldo2yFXYco/640?wx_fmt=other&from=appmsg "")  
  
看看这个方法具体细节：它首先对这个参数进行了一系列判断：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6wToTbumAjJrqzgE9ARzx472cia1pHHDxOPm7oVcN2bzlJvuwlg57vSkN0xbFVBljv4KcLdbMO7H5qWdl8kC0icVsicUn7rh2248/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5OljhGB6mb1L5tkRHSHp4s5drsywSLZdxQ4q4bCQmkDkfuccDvLib00wH01yD0XpQib03BE3J2VQNiaPdw1UrLBiaZATLZic8oicdgo/640?wx_fmt=other&from=appmsg "")  
  
判断其是否以set,get,is开头，如果不是这样的开头，就会执行下面的代码：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7k11omnjhOC6BfNo0mFkaPIntLzgadPOe2OILWsIHibKQvRGAL3ctfodklWoADwcGDP4JxdDmpTdU12AKU8a36YkHzEloN52as/640?wx_fmt=other&from=appmsg "")  
  
**判断第一个字符是不是小写，并且第二个字符是不是大写：比如xX这样的格式，就会直接返回，如果不是就继续执行，继续执行的目的就是将首字母变成大写！然后返回，比如我们的uploadFileName参数在这里将会被处理为UploadFileName.**  
  
处理之后调用拿着这个值**baseName=UploadFileName**  
去调用collectAccessors方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn54by9GVb2L0wodhf2DKttfEFDyTZvSlPAj8ofRmFERDLEjcR10K3wTFRsHQOfOgkorTDJ2BpqKPQAo2Pg3ZPlGKsAvrrPIlc8/640?wx_fmt=other&from=appmsg "")  
  
如下：**在该方法中，通过反射得到我们自己写的action类里面的所有方法，然后循环调用addIfAccessor方法，并且也会对父类的所有方法也进行同样的操作：---即查找该名字对应的setter方法。**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4Fo8RD7XJ4KRln213QCL7DfJBVRUqvu1sicoArhN9HREFMsIldIRO56vTyF7bhQm5mMn56A2JkibahLTvenn0ib5d7SyxcVYkVmc/640?wx_fmt=other&from=appmsg "")  
  
**该方法具体实现：将所有的方法逐一与UploadFileName值比较，看起是否以这个值结尾，如果是就将该方法加入到List result中。这个步骤主要就是得到这个参数的对应的setter方法。**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4E5FYycicxjicHS4iafM0MrjWbGt7miaCSv39Nt3yv0icFiauNQ3BAbM6Xzoicet9lKkGlibSDCez7KJibdM2NzLbdSvcNtxfNSiarWS2LE/640?wx_fmt=other&from=appmsg "")  
  
回到开始调用这个方法的地方：methods获取到一个setter方法！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn49feCkjuVypyHNE8cjDZXWuxjI7b9kzQl46ao9Bqvqr5eWmDnMWibzkHyPsBNvVJ1cXLrXflXP5ZyicCWGRb0zTmBsLJKib9nbCE/640?wx_fmt=other&from=appmsg "")  
  
这里小结一下：**在OgnlRuntime类中getDeclaredMethods方法中调用capitalizeBeanPropertyName()方法验证字符串格式是否符合setter（java bean格式）方法的格式。如果符合继续调用collectAccessors()->addIfAccessor()通过获取自定义的action类（这里是我们自己写的upLoad.java）的所有方法（包括父类的方法），逐一与当前的参数对比，该方法是否以该参数的名字结尾，如果符合就添加这个方法到result中。至此得到该参数的setter方法。**  
  
**setter方法的调用**  
  
上面关键路径的地方有2个方法调用,第一个方法已经看完了：框架通过自己的一系列方法调用，得到了我们传入参数的对应的setter方法，那就需要调用该方法，就可以对该参数进行赋值了。现在来看看赋值过程：  
  
接着上面返回result，通过一系列判断，比如该方法是不是public的，判断之后说明该方法符合条件，然后返回该方法。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn50ITCQvUFf42AOWt8m5hjffeJNGdeqn4cnIYgmCT0Aw18JVS3ot07su4TnwkXBCLgHox1LJIfsPFh5oZAJvEBLTiafBCrcFibGg/640?wx_fmt=other&from=appmsg "")  
  
层层返回：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn69bSTeyMstesDeiaTqY3EsM6wiaPsMdKb6LTyFgic8DeeGGCDUUcpX43TvPwhdwp2m5gc8FE3xmLNfjT9ND5wa5e9ypSnfRuwBibY/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn52TFjFLDgd1EOT2Pk1A3uh4uyxtGfAttKyBicx10FtHXfMheWEV0eTBoTVZPIOPGemzj3gOvAjAgaic59501qmkTmAdJt8MPceg/640?wx_fmt=other&from=appmsg "")  
  
又回到了关键路径这里，因为找到了对应的getter方法，这里结果就会是true了，准备调用第二个方法setProperty()：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7ISkVRg4lXctBoSpJUaEUmicKvhT0VNdNc4wgicnGHRCuQLkQ9u2lWDEYIibxlicgAL6tpsPtegvXK4JBDxHF969ickBnvxZ07SKKA/640?wx_fmt=other&from=appmsg "")  
  
带着这些上传的参数调用setProperty()方法：OgnlRuntime.setProperty()---ObjectAccessor.setProperty()---ObjectPropertyAccessor.setProperty()  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5sEjXb7vdUsibMCCp7rcg5GnTUrebqmy6jZqkyYWASUWBTjpKviahYIld0ByNcHFVsS9FzRd2rFz8zvgTmfOCA0DzUHbO31KxE4/640?wx_fmt=other&from=appmsg "")  
  
最终会调用setPossibleProperty(context, target, name, value);这个方法，如下图对应的还是那些参数值。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6NXD0lDzzWiaUZRjSNud2kxoEKXJZFTJlhhovIHTniaibcCNRbibB50WC4Kt7QAbuLeJt3RCDuY86xSKroibkne53GnMfFjibMTk5FA/640?wx_fmt=other&from=appmsg "")  
  
继续跟上去：OgnlRuntime.setMethodValue(ognlContext, target, name, value, true))  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn727CqPC6SettcLNywRod8eCqIfhkVyBibIA9weViczXzJheWvw8hrVBMiaA61OOzO3aYCI5XQjq3zicf6ZG89ENYV5rck0YmDkc6M/640?wx_fmt=other&from=appmsg "")  
  
该方法中获取了setUploadFileName方法。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn6pXoOCgsCKr5x2PDdPJyQRMHyEk4ROtUicSFdAbXLAxZ6K6VYlk4jwTHF5uklziaQ4AEDuGJ3hibet7SEibuyzMuAVkdh6k8GjFbY/640?wx_fmt=other&from=appmsg "")  
  
接着调用 callAppropriateMethod(context, target, target, m.getName(), propertyName, Collections.nCopies(1, m), args); 如下图：对应的参数的值，前面已经知道。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn58zSQo9ojIXC07IDWkxW80XzpGsuxdBxW0w3BIxU7P7DBL4Jb5YTHsKNmW9e5XS9VB1Lkcahxj8xjHz2HpRBz6CR8QHiaTYibNE/640?wx_fmt=other&from=appmsg "")  
  
在该方法的最后几行有这样一个调用：invokeMethod(target, method, convertedArgs);这里的target就是上传的文件，method=setUploadFileName()方法，convertedArgs=12345.txt上传的文件名（参数的值）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5KIKwSKj0uTDON2ibWzzRfUx5kKLLZuvvv5at2VQialSafC6Jxr6G1dQ8bicHcrUKLOfEGqMyC9RB5RlsnuOQGLcw7vqLtJHuVHo/640?wx_fmt=other&from=appmsg "")  
  
然后继续调用invokeMethodInsideSandbox(target, method, argsArray);还是同样的参数：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4DCiaH8rWghE7ibjv18hlFVRG5JG4WpVZIV2vyibaj5fgUeyp3tUP87KRl0qSutwItZUvGjn7duaaIb1W9FjvIsPficic5uLdwn7c4/640?wx_fmt=other&from=appmsg "")  
  
最后在这个方法里面看到了反射调用该方法：成功执行到了setUploadFileName方法！对其赋值！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4lBgiaPYmc6t7V8ZFJyFBfHUW5m0psStblBue1w8QSLE5C1jia0ialibjSjyuBO1vaYjTYssHggbfjw9PUVJWjwqtf80mShR1v0II/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4jMbkVCH1eWp6wmEh83rRPiaaxdJrib5FPS34s4aypgKrl7rQzEctGzHkEotQx2QDGwFmk1qtKEIGCyowqo2VmYVre54goYx4pY/640?wx_fmt=other&from=appmsg "")  
  
这样就完成了一轮赋值。同样的uploadContentType参数赋值也是经历同样的过程，所有自定义的参数，均会通过这个过程，在struts2的反射下进行setter方法调用，完成赋值，这是框架提供的能力。那么问题出在哪儿？  
  
**记得前面有几个关键点：1.它存在过滤方法，前面分析过，但是它只作用于上传文件的参数值本身，而忽略了请求中可能存在的其他参数（比如通过请求体或URL注入的参数）不会过滤。如下图用户提交的参数将全部放入acceptableParameters变量。**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn7sqg2G2efGDUNy1iaFhQAcqribkzMRibvvpzTm1hpTDD1Q0XIUft3GIqzic59y5mwmAm0XnBbtUxk6BHMibhERCM62Ge5t9z2HaDf4/640?wx_fmt=other&from=appmsg "")  
  
**2.对参数名的处理过程中：如果不是对应的格式，就会将其首字母大写，比如abc将会变成Abc返回，然后通过这个字符串去找对应的setter方法。上面的图中UploadFileName 和uploadFileName本来是两个参数，但是在处理之后，他们将变成同一个值-都会变成UploadFileName，那么最后通过这个字符串找到的setter方法也将是同一个--setUploadFileName()。**  
  
**3.acceptableParameters类型是treeMap，如下图，在对他进行迭代的时候，会根据字符的asicc码进行排序，asicc码小的在前，大写字母的asicc码比小写字母小，所以它的索引在前，如下图参数序列。所以第一个参数UploadFileName将率先通过迭代取出，并执行newStack.setParameter(name, value.getObject());方法--进入上面的流程完成赋值**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5Mbsn7XposChaQewLT9ylkiavXjDvdbh7XT39RhaCfoavf3UVm4iaSicBlaJCrORG6g221l5qPn5bHA92bNq3iaeTIOnRVYhktibZ8/640?wx_fmt=other&from=appmsg "")  
  
**4.当第二个小写的uploadFileName取出再次进行赋值的时候，它同样经过处理得到它的setter方法setUploadFileName再次调用同一个方法，但是值却变成了第二次的值..\12345.txt。完成目录穿越。**  
  
**5.struts2框架对上传的参数大小写不敏感，比如如果只能是小写，那么它只会有一个uploadFileName参数如下图：**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4BjjjibN2GeyBpaUjWonSgJsszDl5DSxETez1y5NzgDnyRgy7CrFu4iaXK9Sy50T8JLCMypX95fI54Px3SdNnsjhKJvXAiaGbgXY/640?wx_fmt=other&from=appmsg "")  
  
**小写uploadFileName循环**  
  
因为有5个参数它就会执行5次上面的流程，现在我们再看小写的uploadFileName的循环过程。比如下面第三次得到就是uploadContextType  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn6dWur2ytHRSsPgxicHNJADByeAnBIqIfuXk29XTUJNs2X2HnruFjXKALicKeNAKwA30q4cMAA1oS0Yvr4VpAQFstuxHzB5AptE0/640?wx_fmt=other&from=appmsg "")  
  
直接跳过我们直接来到最后一次循环：使用小写的uploadFileName带入：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5ZL5ERqR2icibmDPNDQmofsVbnhyJdOPByBG9afFI6z5LUZnXlgPnp2V2icFYGmwibdmpdkoUBhvuoeMwCFle0gOVPc9Ossr7iaiatk/640?wx_fmt=other&from=appmsg "")  
  
依然是上面的循环：  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5otgf0rT7Dv2ibQ8FfSxMZdedTDYs4d1ZkCibnuuuOHHZhs7DCH6FuTvU4VVSEiaVeUiaNQjTOiatfSbZVKmSzATxIiaoPjLdRyIByg/640?wx_fmt=other&from=appmsg "")  
  
中间跟上面的一样，不在重复直接来到最终的获取setter方法的地方，同样的地方callAppropriateMethod()方法里面，得到了同与大写的名字同样的setter方法。setUploadFileName，然后进入下面的反射调用该方法，继续赋值。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn60nnd97NI564ZEXd2gvxjJVicrDic3ib47dIWibKJCqSKCpXgyYHYgh6DP1MTDktCEhUMShwCeDyQrl0dj34G5R6EFeYM3hG01KicI/640?wx_fmt=other&from=appmsg "")  
  
同样执行到setUploadFileName()方法，再次对他进行赋值，第二次的值覆盖第一次的值，将变成..\12345.txt  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn4WicIjAichjyYkfkULSJiawbbzhxAgeQic85m0yTibvdXeKh0wNnWDlg7ic8KDNsb1o3dy6t4ibGzL4OwrAswtaRCy1icK2zwtu3n3tSs/640?wx_fmt=other&from=appmsg "")  
  
从而实现了目录穿越，当一切执行完成之后，同样通过反射调用doUpload完成最后的上传文件，但是变量已经覆盖，从而达到了目录穿越的效果。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn5yr8q2ekbEegtZxDhUPq7nDhWVsYWEGWmeq7sh4VSAt7WON6619duCZ3cicnfdblsHrz5OZPf7VIm8UbGBfibqMvOvaMgR783cY/640?wx_fmt=other&from=appmsg "")  
  
**总结**  
  
**该漏洞由于多方面的因素共同造成了这样的结果。首先是框架未对其他参数进行过滤，仅仅过滤了上传文件的的参数，同时对所有参数赋值的过程中，获取setter方法会对参数的首字母大写，从而会导致在treeMap中的本来两个参数xxx和Xxx最后得到的同样的字符串Xxx，最后使用该字符串得到的setter方法其实是同一个。treeMap会将asicc在前的放在前面，所以后面的变量值会覆盖前面大写变量的值，最终导致参数污染，达到目录穿越的效果。**  
  
**举一反三-漏洞本质-通用**  
  
回到我们的upload.java代码。我们的命名规则完全按照struts2框架规范来的，如果开发者不按照这个命名规范呢：比如代码变成下面这样：  
```
package com.struts2;
import com.opensymphony.xwork2.ActionSupport;
import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;
import java.io.File;
public class upLoad extends ActionSupport {
    private static final long serialVersionUID = 1L;
    // 文件内容本身，对应表单中name="upload"的<input type="file">控件
// 框架会自动将上传的临时文件注入到此属性
private File test;
    // 文件MIME类型，由框架自动注入
// 命名规则：表单字段名(upload) + "ContentType"
private String testType;
    // 随意起的属性名字
private String testName;
    // 以下getter和setter方法由Struts2框架通过反射调用
// 这是实现自动参数注入的基础机制
public File getTest() {
        return test;
    }
    public void setTest(File test) {
        this.test = test;
    }
    public String getTestType() {
        return testType;
    }
    public void setTestType(String testType) {
        this.testType = testType;
    }
    public String getTestName() {
        return testName;
    }
    public void setTestName(String testName) {
        this.testName = testName;
    }
    public String doUpload() {
        // 获取服务器上"upload"目录的物理路径
String path = ServletActionContext.getServletContext().getRealPath("/") + "test";
        // 【高危操作】直接使用用户可控的文件名进行路径拼接
// 此处应进行：1.路径穿越过滤 2.文件名重命名 3.扩展名白名单校验
String realPath = path + File.separator + testName;
        try {
            // 将临时文件复制到目标路径
// 如果realPath被污染，可能覆盖系统关键文件
FileUtils.copyFile(test, new File(realPath));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return SUCCESS;
    }
}
```  
  
上传改成test，上传的文件名也改成testName，那我们上面的poc就不能用了，因为它没有对应的可调用的setter方法了。发送这样的payload  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5NIYHgzNrTLfTH8XzicZL10TOiaNyBicdlssWxaNzU2mpticxZ4YiamJ0lJyeg7nHYVibz6TSNN9E8iaDLn2licNfUicC3iajrQ066LYsfM/640?wx_fmt=other&from=appmsg "")  
  
运行之后得到的就是这样的参数列表了：还是会在上传的参数后面加2个字符串，组成两个新的参数名。  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/ic8BH9EFusn5b1t8FqtibM7ojoBMcXGAemTDMZv7qETqP6YDiaGbJBWe3Zshia6AuA2IcY6XT8LrtazrW8Cziax9tWz7IJHuzyzjMR7woHfAUsUo/640?wx_fmt=other&from=appmsg "")  
  
然后对这5个字符串分别执行上面的流程，最终前面三个是找不到对应的setter方法的，所以其实这里正常的上传也不会成功，因为无法反射获取正常的setter方法。但是我们的方法中有setTestName方法，所以还是会目录穿越成功。最终赋值成功：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4Nrx71nK59lfiayicQYpaTqicdUbHWu4gPicfc79icGnkjhOnSibd5YMoltuDEufxnVwJC06ps2RiaqoK3bCWIsvUyER0ucPnficd66Zc/640?wx_fmt=other&from=appmsg "")  
  
最后完成穿越。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn7F0XUhBErYmKt8xq3l5b1esE1nOuwHER4OePA4XmzicEjW1ZnEgrC5BjdK1OIVGUicgic59ia0Ws3sDicLjpDqrYw9WXRSNDUBrtno/640?wx_fmt=other&from=appmsg "")  
  
使用大写的Test效果是一样的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/ic8BH9EFusn4YqECNCvPgDaBDgjDR992whSSfIvRyRj0SC4tPGgtyOJulaCH0khGTVMAF4ZFjdv8sFpCjJNnRJfu1rI0xXjZ2jVicqY3lR9tc/640?wx_fmt=other&from=appmsg "")  
  
该漏洞利用不依赖于固定的uploadFileName  
参数，而依赖于**参数名到setter方法的映射规则**  
。核心逻辑是：攻击者构造的参数名，经过框架处理，必须能调用到那个决定文件保存路径的setter方法。这个映射规则很简单：**将HTTP请求中的参数名，首字母大写，并加上****set****前缀，就是框架试图调用的方法名。**  
  
因此，攻击者的构造步骤是：  
1. **推断或收集目标setter方法名（如 setUpFileN）。**  
1. **去除方法名的****set****前缀得到属性名的“首字母大写”形式（UpFileN）。**  
1. **构造两个关键参数**  
1. **触发参数：属性名的“首字母大写”形式。用于正常触发文件上传流程。**  
1. **污染参数：将上述属性名首字母改为小写（upFileN）。用于后续覆盖。**  
所以需要攻击者首先得到服务端的保存文件路径的setter方法名：比如可能存在如下这样的命名：  
<table><tbody><tr><th><p><span leaf="">服务器端Action类的setter方法</span></p></th><th><p><span leaf="">推断出的属性名（首字母大写）</span></p></th><th><p><span leaf="">攻击者需构造的“触发上传”参数名</span></p></th><th><p><span leaf="">攻击者需构造的“污染”参数名</span></p></th></tr><tr><td><p><code><span leaf="">setUploadFileName</span></code></p></td><td><p><code><span leaf="">UploadFileName</span></code></p></td><td><p><code><span leaf="">UploadFileName</span></code></p></td><td><p><strong><code><span leaf="">uploadFileName</span></code></strong><span leaf="">（标准案例）</span></p></td></tr><tr><td><p><code><span leaf="">setUpFileN</span></code></p></td><td><p><code><span leaf="">UpFileN</span></code></p></td><td><p><code><span leaf="">UpFileN</span></code></p></td><td><p><strong><code><span leaf="">upFileN</span></code></strong></p></td></tr><tr><td><p><code><span leaf="">setFileName</span></code></p></td><td><p><code><span leaf="">FileName</span></code></p></td><td><p><code><span leaf="">FileName</span></code></p></td><td><p><strong><code><span leaf="">fileName</span></code></strong></p></td></tr><tr><td><p><code><span leaf="">setSavedPath</span></code></p></td><td><p><code><span leaf="">SavedPath</span></code></p></td><td><p><code><span leaf="">SavedPath</span></code></p></td><td><p><strong><code><span leaf="">savedPath</span></code></strong></p></td></tr><tr><td><p><code><span leaf="">setTargetFile</span></code></p></td><td><p><code><span leaf="">TargetFile</span></code></p></td><td><p><code><span leaf="">TargetFile</span></code></p></td><td><p><strong><code><span leaf="">targetFile</span></code></strong></p></td></tr></tbody></table>  
**总结**  
  
该漏洞的利用不依赖于固定的参数名（如uploadFileName  
），而是**依赖于攻击者能否猜中或探测到目标setter方法名，并利用框架“参数名→setter方法”的自动映射规则，通过一个首字母小写的参数触发对同名但首字母大写的setter方法的调用，从而注入恶意值**  
。  
  
