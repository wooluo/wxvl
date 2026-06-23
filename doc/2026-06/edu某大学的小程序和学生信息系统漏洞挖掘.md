#  edu某大学的小程序和学生信息系统漏洞挖掘  
 黑白之道   2026-06-23 00:40  
  
# 本文由掌控安全学院 -  洛川 投稿  
  
**来****Track安全社区投稿~**  
  
**千元稿费！还有保底奖励~（   https://bbs.zkaq.cn   ）**  
  
****##### 小程序抓包方法  
  
小程序抓包方法还是挺多的  
- 直接使用fiddler进行小程序抓包  
这里不做演示  
- 电脑系统设置配合Burp抓包小程序  
  
这种方法打开电脑系统设置——>网络和internet——>代理——>手动设置代理——>设置  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoLDuib2CZKYlhbEA5tPfsjDibs8IqnNYchrKdMMnnkYly0Ycvzc0B81k6qNzEkVaVzJHLzCnuE5gYAe4ZWMddK7nlvLtaZvl2icJA/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=2 "")  
  
然后直接配置代理IP和端口即可，当然记得在Burp中加上设置的IP和端口，下面输入框和选项不影响  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoIBxTCI5ib2wicdziaicNFodRHugZrdFNoGCg7iadMPdMvIb8Be0fa7ENF0gW9mGceVQcqQts4U39m4f2ZsSVRtjo51pB9ib7nad9Yyk/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=3 "")  
- Proxifter配合Burp抓包小程序  
  
这种方法在此不做演示  
- Clash配合Burp抓包小程序  
  
这种方法需要Clash PC段系列软件配合，因为Clash的全局代理功能异常强大，因此我们直接使用Clash开启全局代理  
  
打开Clash for Windows，默认设置即可  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoK5kNr9LA6djGbv3pHD37CbG3G3enbBY9FA2U7OV2I7CWhOrG5P4VDrj6Lqnnlr2hEwicqxAhYG86ibajKtTKxDafOS6chUwffok/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=4 "")  
  
在配置中使用默认配置  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoIwWcMesCHVXOmdxbpYnzrq3Vb9Jc1jibHEmkwJrOrlhZpInX0ticPPWE93EEyAbkOXTg1hVia9nlVkR7WZAvYcJx6wTcToMP6KKQ/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=5 "")  
  
然后在Burp设置抓包IP和端口即可，如果使用默认设置端口即为7890，也可自行进行更改  
  
然后在右下角右键选择全局代理即可愉快抓取小程序包  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoKTh4oKZLmwWjbibBQen7WBzGom1XPkhickFlwvhnxX6gYg3Me5RUic2kBOedWDlFtwYW2TZvo8HOibNwZibNfwVbZKI473msfrSqz4/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=6 "")  
##### 信息收集  
  
从搜索引擎通过Googlehacking语法获取学号和身份证，site：xxx.edu.cn “身份证””学号” filetype:xls ，这里就不多赘述了  
##### 小程序挖掘  
  
微信搜索此大学的公众号，发现后勤公众号  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoLicTTWMX5Xes5mzGic4Jo0vqtAAcQiblAl2zmHQUJIjM0Fk5yduAibaxFq6gmYXM8WPcWNXC98lLRzib0xNjtWiaRIIW4lGPibMnetmE/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=7 "")  
  
点击智慧公寓  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoKl6086vCibicERb93CsdaJibzcDojSiaOGG7XAh9u3CMyqPUtSCibicEMy2MEgNzfccbz3L4odr4VmMlAATInqEQUk7vqgyfWoiaicbME/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=8 "")  
  
输入账号密码，账号密码在搜索引擎所得，为学号和身份证后六位  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoJKz7tAkia9usKejg0n4dPrwtmicgQ7F8f3cFUojN9mMa0nW5fZLrbKic7bOTPREBP0q7iaT2V2icS2yQHfhib70ibr1icj3yAgNtCFwcE/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=9 "")  
  
打开bp抓包并点击住宿信息，连续放包后得到这个数据包  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoLy34U19CudTia6C0I9jUF0yG5fkiaFgLibGrqEUMf9ca21dibibgUTu6HFjNbO9xYoG7ib1KazfWhgtFeOvF4eMDzJCgNsxZVoRDic8g/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=10 "")  
  
发包即可得到页面没有的敏感信息数据  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoLAVliaJib0Oy9XbsoxPWpPibJXrickvCXtjxO2YNr9JV05hE0DLvNR2Jw95npnibu4snFtkvT15VVAOgwtkZRw4TNJUwEDTuoMR04c/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=11 "")  
  
遍历personsn可得到全校学生的敏感信息数据（18年至23年都可以得到）  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoJYbzohS1VAtwibLPrm6thfPibRiasfKcBzHOdicM1NVc55qZj0EYxPQaj5uPic9Jnnj6qErfdGJMiaAz4icMFWpWOSo3IUSAMvdluLLc/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=12 "")  
  
经测试，点击报修和报修中的我要报修也可得到此数据包  
##### 学生信息系统挖掘  
  
来到系统，账号为学号/密码为sfz后六位  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoLCDWMTVRic0mPib2mzIM0dicccm2NicAr5hzZADAukeDlnyHN2lh1usMQibbTgIn0hs2kvSxSyWDVxXbkKDD44gZC59J6ec3UIbByE/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=13 "")  
  
  
进入系统  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoIaNFl1qZNsibdBJibntMHhHcJqLCAsAHAmIJXRnqXEsyMt7rL7IreNw3bZic4p7ktBu4JEuPyMUyxicFOPBlWbahavKb1DkA34eNg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=14 "")  
  
点击收入查询并抓包  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoIUuGSUIAmxFqWKPo3K1a3oWEEetteF4nicjaempdj0Fue0EwQYDbavJHticgMWZJ7Q24tykCjYn1oZzEElgsZ9waYpYxfQaKnVI/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=15 "")  
  
StudentNo 为学生学号，返回包中有大量敏感数据  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoLao5v6f1ml5JdZvwFP9rWSCFXpMpLdGyz1xibJFdf0MR8Gq62hvDiaib9GkJqpGO1sU9DibLeEO74ObhAlbFZaEQ8j4pW9razbX5Q/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=16 "")  
  
同时遍历StudentNo参数实现越权获取全校学生敏感信息  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoLRGN8ia0cfruh0AEXw3ib0p8Ozajs4l1URSKicLwhT7I6tt0ft45bnSPI5DZDsBmS1LRnJPVia3rFaVBJpuRNxyjZfNCqCsqvC5Q4/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=17 "")  
  
然后点击缴费明细然后点开年份点开查看电子票据图片即可查看本人的电子缴费单  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoKKvzPLbjzwjJb9A2TjfSFVxhiat5koDKUWqjTHn3iaicAibo0dibibiag03uwFJSeAPlKWUpumTgwcicRUG88dMBeR2JIGaMPJf4CtSxU/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=18 "")  
  
抓包，点击查看电子票据图片  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoIbyGaice0e4wQQibBHZR3CZF1u2PpsxkVu3GeUu04u5h4FicREM3TvWsMCtQIWffG0ZLINMGVKiaZWLK53NJare7WaWkickJWg5xXI/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=19 "")  
  
修改数据包url中的参数  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoK5agF3Flu0Zwtw1dX2QaGInMtEEgjxxB8LIibryZvXe35GIWertPVUX5WrH3g2mju3ENJEnACJAqxH4yQQnqyYSYS8XfNpFLibk/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=20 "")  
  
然后可以遍历所有人的电子票据  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoJhKpQjrFFa4g2UuVGia8UFfKrXLZDfpQrBUXYw7em2JSzmqyeL4ggyAhdOiamCGpZydj27m3NEVH0c72jUzCVAgkh3deYnvEcBg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=21 "")  
  
接着，点开学生缴费汇总  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoKIic6532bVXkoyXhBfyrYF2IcQOa6yjcfHzJ2icb4Y0GibNxtDBricjadaCruIVxQp1lAI5XsarfjJGJibsNm9B0QZiaGrRylrNASRY/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=22 "")  
  
修改studentNo即可查询所有人的学生缴费信息  
  
接着点开我的  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoIeTFn3h3a1cDqghyx4psNTKbQM4oqwoRWBfWKpYqcNdD3FdL5MLiauuIUnZBqmg0WheBPetRrIDCzN1THCBpaTEkHY81ZrJhh8/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=23 "")  
  
在框中输入xsspayload即可弹窗,这里存在黑名单，过滤了a标签和script标签，直接换个标签即可  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/ianpxKPnLHoJ2WRb8v5XqcBec5EOc1g4tG4JdObiac19ibsFtA7nb4NhxDw2GIS9GorEicmswRHLEbpB8eJC0oRC0OaUaqWRSD8Wt0wY0Hryf40/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=24 "")  
  
同时，这里不经过验证可以直接修改学生的信息  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/ianpxKPnLHoIiaAVtxoV9nwFaIwX16y2hN0S5BnZF4pgzho6d5OQ9V1XdkB6EZOz5C87gYiaPY1AV6cvhgdXRATibcy4QdSYJcVTGVXfLgBwsSM/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=25 "")  
  
  
到这测试就结束了  
  
  
  
