#  对以前的地图api漏洞做点小补充  
原创 地图大师挖漏洞
                    地图大师挖漏洞  地图大师的漏洞追踪指南   2026-04-02 05:25  
  
          
大家好我是地图大师，最近有师傅问我，四年前我发的文章中的高德地图api利用payload遇到有些key好像用不了了，虽然这个洞早就不收了，我也很久没在研究地图相关的东西了，但是我还是抽时间来看了一下，补充了一个payload。  
## 0x01历史回顾  
##   
  
不了解这个漏洞师傅可以看下我几年前发的文章链接如下：  
  
1、《地图API后台配置错误,挖SRC的新玩具？》  
```
https://www.ditusec.com/blog/2022/09/01/%E6%BC%8F%E6%B4%9E%E7%A0%94%E7%A9%B6/%E5%9C%B0%E5%9B%BEAPI%E5%90%8E%E5%8F%B0%E9%85%8D%E7%BD%AE%E9%94%99%E8%AF%AF,%E6%8C%96SRC%E7%9A%84%E6%96%B0%E7%8E%A9%E5%85%B7%EF%BC%9F/
```  
  
2、《地图API漏洞新玩法更新》  
```
https://www.ditusec.com/blog/2023/10/12/%E6%BC%8F%E6%B4%9E%E7%A0%94%E7%A9%B6/%E5%9C%B0%E5%9B%BEAPI%E6%BC%8F%E6%B4%9E%E6%96%B0%E7%8E%A9%E6%B3%95%E6%9B%B4%E6%96%B0
```  
  
0x02 之前文章中给的利用key  
```
高德webapi：https://restapi.amap.com/v3/direction/walking?origin=116.434307,39.90909&destination=116.434446,39.90816&key=**这里写key**
高德jsapi：https://restapi.amap.com/v3/geocode/regeo?key= 这里写key &s=rsv3&location=116.434446,39.90816&callback=jsonp_258885_&platform=JS
高德小程序定位：https://restapi.amap.com/v3/geocode/regeo?key= 这里写key &location=117.19674%2C39.14784&extensions=all&s=rsx&platform=WXJS&appname=c589cf63f592ac13bcab35f8cd18f495&sdkversion=1.2.0&logversion=2.0
百度webapi：https://api.map.baidu.com/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak=**这里写key**
百度webapiIOS版：https://api.map.baidu.com/place/v2/search?query=ATM机&tag=银行&region=北京&output=json&ak= 这里写key =iPhone7%2C2&mcode=com.didapinche.taxi&os=12.5.6
腾讯webapi： https://apis.map.qq.com/ws/place/v1/search?keyword=酒店&boundary=nearby(39.908491,116.374328,1000)&key=**这里写key**
```  
  
0x03 增加内容  
  
最近有的师傅发现，再使用高德key的时候发现用我之前给的所有利用payload都显示错误代码1009（调用方式异常），我通过对师傅给的key研究发现，可能是高德有点小更新现在的jsapi没法通过url形式请求了。所以给大家一个小的html代码  
```
<!DOCTYPE html>
<html>
<head>
  <script src="https://webapi.amap.com/maps?v=2.0&key=这里写key"></script>
</head>
<body>
  <div id="map" style="width:100%;height:500px;"></div>
  <script>
    var map = new AMap.Map('map');
  </script>
</body>
</html>
```  
  
直接把你的key写到里面然后保存成html的形式，如果key可以用，用浏览器打开显示如下  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DdVXYMZZ2zgoQ9ZQCXTDZ2qyXO63P0Oa6g32pH29QG367iaLdy0mVEL7wcqtyqkmDKx0ib2eDia5yKfxE4O8s21ft2pKzpEsxGHGZCGUHZAeL4/640?wx_fmt=png&from=appmsg "")  
  
  
如果key存在问题显示是空白，并且f12的console和network中会提示key error  
  
![](https://mmbiz.qpic.cn/mmbiz_png/DdVXYMZZ2ziahlQVlsYdC9ibnia80ZtxNxE6RWlEVZqvs9zaMusogNnwh5Y3GHahQdpZicf6cLe2U54KibCwmLMMiaVpboA4iaBaqHxbRaGNDLbKfo/640?wx_fmt=png&from=appmsg "")  
  
###   
  
