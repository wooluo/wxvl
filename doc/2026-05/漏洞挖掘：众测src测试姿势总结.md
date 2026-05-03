#  漏洞挖掘：众测src测试姿势总结  
hkl1x
                    hkl1x  只会看监控的实习生   2026-05-03 00:00  
  
## 导语  
###### 最近在打众测和src，也挖到一下洞，这里分享一些我的测试流程和思路，希望能帮助各位师傅提供新的思路，共同学习，共同进步。  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFmxlIJRpZw4tKfKKEk6QXMlBw8NBCRPmgCB9XhlUSM2pCKbQEqV3fSRfnriaiaL8joOyUH7j1BNWLCyvvQkBqa1PDwgxuEdKV14/640?wx_fmt=jpeg&from=appmsg "")  
### 支付漏洞  
###### 支付漏洞是渗透测试的常客了，只要是商城的资产，支付漏洞一定是第一要测试的点。这里说一下测试的思路吧。  
> 订单：敏感参数是否可以修改，如数量，价格等使用小数，负数，四舍五入，int最大值等  
  
优惠券：是否可以并发领取，是否可以修改优惠数额，是否可以使用更高优惠的券，是否可以使用他人的优惠券（薅羊毛）  
  
其他：是否可以更改订单的取消时间占据库存，是否可以使用便宜的商品购买贵的商品。是否可以突破数量或地区限制购买，  
  
#### 数量修改  
###### 1.测试到医院小程序  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEySbsYibne99kRd74cIkfyWSvkaMYoYmUTaMF9R8C0gZez9BicNKPibjpC23k9lT0KZeyzWnsrnat8BMZGAN5Y3wPAZ4Xtibbpt20/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.测试业务经典的购买订单业务，测试发现product_id,attr_value_id,client_id遍历都没用  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHayMia99jYttMDl0e7ibqy1icicic4w94VTcrsEiaRRTYLHia8n8a3wicnIBOsKr3S2iaJvEn6ibW1cgQAF6TQKXFfJKr51yicqW93Qn0p9c/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHiaejlaufjkJWfnZVJgl3hyDV6FWicaM1gYKCtUKyd4ct0hHibnT5nsV8pUBbsIywgt5Sia4jY4TXok7icq50u6g2AqRXZI5s8SyIM/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.最后尝试修改数量  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHFHxVfkyuyfu6OfYyMSULcel2Kr3MHTwDS8mYPNlLdv6icpic0reCWrPIQgJeHG9kx7RdtoEKpC20Nme8tiaDjRwQwBPkPVCL0Go/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.订单生成了？！！  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHRxNWqDJQPMahiapMDsibV0BmZuHc7ep9wcPJkW3n3zPjuRNp0fXe3gKctQu5mnKSmfIsReotLXy8CZ3KbFjbTRM0HUIjCl6LPA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFERbcJAO19YQDP2WC0biaib704E8TSkqeyT64jIvLZicY2lxH7b8iaGXsBywkSKeGOjlRAb1aNQCuYf7MzAiawaqwlSCnJjnJmQwib98/640?wx_fmt=jpeg&from=appmsg "")  
#### 任意优惠券使用  
###### 1.定位一处商城小程序  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFXGSqgIp4LRU1sFxjeqKvJS62c2Vze6oYGYWkVLlSrXCLly6uicteU7Y3fYjXdKAJQQagWzCoL1AY32TpACOZtibb1Xp1k5EiaCY/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.下单后抓包查看敏感id  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGg8icV7MzZXHXZADctvYICRoqkibo7EVcDiaia3znh3kicWhicyQAOqrPAoV6ibP2NfDS7ibaABvbNsshs12G63ocXEfnZHuBF3rhiaqPE/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.我对数量修改后端会报错尝试跟换更高优惠的优惠券也失败  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFfGn0FpwP1m524VXhHgicRFxh623GGCic6ot1J9Ypiaic683EUkUgZNnWfDYLbSayoQ6ZB5NUUe78GHGstJOtiatA77NZS1sveL4ick/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.然后想到那我是否可以创建一个新的账号使用别人的优惠券这是新创建的用户的优惠券列表  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGeW6moJaiajYjfJe6gKE8rxjbpXTlfriaKPlmibNxRhhRXbxovQdwVBeDsMcAiagupvIqzABQ2JbxXaUbM88IGyewG5EHrVepb988/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.成功使用了别人的优惠券  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEwXmuDZNGvToRqlHicapJticryicVdT3kjPlGFQs8iaQ2oiaJ6ORvqOPQPMR2O5qYxiaiahWOG81RjWEl1bK0NjBmJOy74IdibBSJaf9o/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGWqCaMvmYHlB1ibZgVNZLz41MMhJZ2wIibP6crLTia4s7yk7IDWiaBdTCK8ND6WUJOazEN9lqRWQfx4IaCmicwnGKPVS3f4Feo2uXw/640?wx_fmt=jpeg&from=appmsg "")  
#### 修改返回包  
###### 这个思路是我看别人的，原理就是生成付款链接的价格是看前端的数据而不是看后端传来的，导致支付价格被修改了。  
###### 1.发现一处商城  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEfIqmLvaibkEqLYq02r6O7czqLh4ADWs3OKxdU0M8Egr7UrZGG0eQoEjCbyccENBr8DlOGC5RicaicEy3bR2o2pknqCibIPDib8BHY/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.正常逻辑购买查看数据包发现价格查询接口拦截响应包更改数据  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFGGM6X7Hngia3eRSnC8xETbnofFsqGdUfE4U6OI7icCia89ic65PdTkCSO5HwOTzGKnskLYAaJQv1dTcIJd2ciaGbiac6SJfz70UI4Q/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGHKJkVb7iaAwjHrvPpm31hTWytib0Ef9bEz56ObquSCTOKu2kzttwf2dSHibADUwUe01qEOVe2H6PZ9Towbt4zsicHfpt9JiaABoIY/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.查看订单  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHS8dEYhIqubLLMa2MTx1LQZcianzDxSjOwtQUR5ibXdz4Gc7C8uEZWrRUZh6qvGicFf3zNx1PXfLwk9EzYVoYUbStAlXx9V5BCSg/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHx2jzt19LSQswrr9KgtY7dT2MRrBbSetTqWxAX0rZhPzt8eP1ibqU1GCND3UOicVqJU4qzxuHN3KSercWd27qXouo8icCEwOJhgQ/640?wx_fmt=jpeg&from=appmsg "")  
### 文件上传  
###### 文件上传漏洞相对简单，主要还是看能不能上传webshell拿shell，不能的话就上传exe或者文件型xss，没啥说的，遇到waf就可以换业务点测了，根本绕不过，这里说一下测试的位置吧。  
> 更换头像  
  
评论区  
  
简历上传  
  
编辑器  
  
#### 评论任意文件上传  
###### 1.找到一处医院小程序  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGszpUgkpSvgUWQnlHhEZo6G1uuJZib3qB6dZL1D5rDEiaYMccabuvic1Xeh6snLqyjpqKwozvdFDI2wDnBTX6uDdMButfOCEwMPo/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.在上传区图片功能抓包  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFE42765WsxAvrknPBWmBcUEjwNX9TM3LJILmv2ym71AKAePwsycwcyKYeXibVQummnrCTCkWBOyvTRD1fq0dQLRaXLDazia3z87Q/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.使用重放器更改后缀名  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFMsoLCFamOgHIEw2Q8PJ4poS9syRFHja2GPh2toVMERDT1CH8atg3fKGFd86cbvafgWWWCsgFpgOWxkibgkKiaNpanLN3onKlicg/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.浏览器下载  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHEzmJz5tSvJkfJGAIteiaKsf7xrwnZEVocyxlp3ChdOf7ZMHibYIEdb7iceJXgqwWzmaWKfdxhiaFjSzPX0J0bloSInZzG3EiaVEPo/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.扩大危害上传pdf型xss  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGT5W2yRibKc0w7Ec6wuOXnjKmffqYMBOzeRoUW2AmkxvzC8zw3VQHJUCu1YKiaeaRibCcscY3IVtqKfvjRnEicwcicU1BeHAb1R7pk/640?wx_fmt=jpeg&from=appmsg "")  
#### 头像任意文件上传  
###### 1.小程序的头像编辑功能  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEA8oER0OkY63H279Yt3FMgmK9riauPrM8a6bYvqdd5JkA03fYI4HibBBBsvJAaiabeeibDwlyoxMGKmncQPU9fqqSMPkO3a0MxjNU/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.exe测试  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGwMAiaZHiaY1vaNpylSbYyxoOKIriakCJTqQlofns14mWkQ4YouG11RTGEgvmdmz0t2afL0xBFEibQ6ejwN36ib3RbPFA9nWkYypPU/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGgylbjVRWtz7hpuf9yKps3FKebuGk0yibjX8vAlhHHzcdvtfKGnkPeVWTlbvshcTvwDAk4ZaOM7gd6PpP9XFTOia5Fg5aQHQ0DU/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.并且这个路径可以自定义那这个就是算高危了因为这个一定是创建了一个文件夹还可能存在覆盖的风险（这个是没有的）  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEm8J3wVEiaUm0GCgSaibd3HzYAMlD2w7FDUX7NqrTXPRbcvoIurJyZhweftrBebRrlib7rgYic6YddnwolAnKVr2ze2vFkVygRpEY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFF4ZOic55rd1Loic1qYDqB9ziaz3vGNanwDuW8spHNicKlSNQJwrTvsYPX1QzEtNkvs6yAxSiazt3GJRbeMPhOOlg7g6PQY6tBvSzLY/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHaib9zrKYu3icCJvenPfthoSMA6ibH1Z8kZl43rDBKhcvOzmbgMiakyft5Tv4ibZA9YOIUnfZRXicAMxhBG9VrweU0ReMUR1fcmLMl4/640?wx_fmt=jpeg&from=appmsg "")  
### XSS  
###### xss应该是最好测试的漏洞了，又是都不需要使用bp，主要就是先拿a标签探针一下，js解析了就继续往下面测就好了，这里说一下测试的位置吧。  
> 评论区  
  
发布帖子公告  
  
pdf上传  
  
智能客服  
  
编辑器  
  
#### 首页xss  
###### 1.找到一个人才招聘网站登录后台发现求职功能编辑并发布  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFa3YU4fvgnWh9bMYIUticgcHicAPmxibqicKKQHoppOCTsTaic5bPnbhgLHabN1nCky0ylvzicSibJ5tS3G6PIdaTibxc9K4ibPl8WbeR4/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.回到首页发现js代码被解析  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEGxyVRX6cAG35mhuaQcGt1aruGLOUxrTcJDMhACyTZAbWKfoM2E37GibHdyhQruRPrUbG2HiaFUBEv6zOJ5PyzfJIdnHQf7rPaU/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.在意向职务输入payload并发布  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHqaTsjR6XzicUdouWPK9iae8Xo5H4LibInqZU62Z2FfJZyibJOMdX8wUOMIRrhicmMWC2TKy24yx55XdFrQLuPibkHqoHNrxAuUIb5A/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.返回主页  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGs3qticJOeIt2OPGibdnHOCWgGhz8dwSjaMKw3Ma1TVt2qLIOre4DgUFtLBibmFq2knia28Wfe4jDicm1NDvB7GibNd2uS7Vw8zLqsA/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.因为这是一个大型的门户网站，所以主站也弹窗了  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFCWz3WeT7FBWrXZDjLzBXoORH45JwKlia5pM6sswdIb0ueBZ4ssOUbbcZNoibbklA918egybM27jY9Atyn0VLOgo8hH23M8w8lI/640?wx_fmt=jpeg&from=appmsg "")  
#### XSS+Cookie弱加密账号接管  
###### 1.找到一个租房网站，发现发布功能尝试xss  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEGXyNtvZT9hGxNQqmltSMl918soiaQB2EEpwULt141RolgKmboaM3Cnp7QdzWS90aX1bricpz6NsH3UmnTpXfRmHiaHL1jddibJrU/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEs9w9YBuUT0WVaSNMgyqRO4ga1ibqZZTZibibowEvf0o3SYIe0NBdtzXnnibn4T0g1TvGbHKc81AKswFfzgnc8Eicld7g6I4Zbg8QY/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.发现解析js代码  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEM095qCH3jWic0HSc2icbqVMsqzTKJD7ibthdpnjpDPAeaFF9rKSNibtibZdbjTuiaZZcUns4J0ZiabvcPcicTLydg7QI6HhzwcoKFIes/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.发现Cookie其实就是用户名和密码（md5）  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHEGaK95zVyTlP9xTLAGvj7kLnFdskRibEV8pslYDmN5ibaqrSsyo3H12ZXd5ibq8T2R1SsicLke6PrmnD9Xzgp3s4wiaAUCMwqhvx8/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHnRGcaM1VppWskhqdN49CfSCVI7NYnBUWMAdvxRab0tVeI2OUlMPjibQPfWGpKjCLdibRqOkP5IX2LySfibuDpxbq4DIpCr0NNGM/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.尝试使用xss获取cookie  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHaJiaRfYq87Ix9t1u1YHvWK2YJr7OpRicBBqx1HyPFdljTtfj1QPlbX6jfzSdgsAZnKicCaXYAzaXYbliahABmVHG9E8oOcLCicjZs/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFF28icL4ibP1YoNG2AHSImGTiawNpfS7zPfTA3WkLYjfC3IIwzrBRzQxZV01EoD9aibJNvoBsFo0vIF6EsedLzMsh8cBrlkyIsm0Ac/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.成功获取cookie  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGk5fkupDZ9VCuvUOHqEBFUUd2EuibjlmZ2LSpTJYjvFQWDFEj8GXm3dn3B3zB0LeibyFgLq4Wmn9zsYwibHnA6Vfp8Th2777ywpI/640?wx_fmt=jpeg&from=appmsg "")  
#### 编辑器XSS  
###### 1.一处资料编辑功能发现编辑器  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFH8XK7DmZ1qLsOJTEsrzuF59KDdlngiaP4XSXZ3IL0ibM27fQ0mk7M0my6jKhHdTJvdtIb35wxN6ZoYIzITCkh1Dr7qqBQNia7PYc/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.切换带html代码  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGZh8qPbZtg9p3pqtq6hvlLM2UwDObqxJhdH7AdJ9eTSmy8CZoDTHNVicDMicb5dNsqdsAxoGsHeKiaCic9IXhaI5Dz7KGib96vDKZs/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.填写payload  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFRFvNKbmdCiciaajveEJsQa2jkEM3pZpYOQH94JSbtItrdJy0EvNYquSiamhFnYxD1PCoJ53ccuAJnfeGsNYzpVEiaJF9oU0QrYibY/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.弹窗  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFH4KPia3p2hyRzJXOm922HSEibOu5libL3ibgibK0icRt2UjuJibFZicB1RJk8VNAn6PIibJ32mpDAvB4NWPtoiaib5KOtF6vjuLcicRq8URt0/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGbTQD3mKQO494ia1bjW9zBOO92HHllHZsibH40cbxMqblHSjlFurrLsY4vDmkgz8uPjnt0vmPiaXaFDv38sSYS5lvVyl8VibcuVr4/640?wx_fmt=jpeg&from=appmsg "")  
#### 客服XSS  
###### 1.找到一个ai客服页面  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGRqkJfsyzEYhAnyxYuP2b4Lu9yOibJSzthhoAbFdACHibnrKx5o55KIBgGCibGMTB1TKyc52Kx7fj3qTe2O86O7NC5QU8Vgc0icKc/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.a标签探针一下  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHj8zZ5W3Uze5HD3B8T1IMeMGAyauAicJvDhRY2JiaSHBicPjtcFDAibQmVsibGCemOEgU7xGjTl7F7hIeJlJ77F1pWJycsscS2qpo4/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.上payload  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGtKcNuibpa7W6kwmEC2MpdOsWb5l0rEqQr1S9APbhR7KZnYTpNfcCsEQa3kz53QowMkX91j6p66p64hFYzJOIxM3z6eRuOtSUE/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFdC2hxWSWeyyNyKLib7oFB3Guia6p415d3ZCqVa6dibNOSaftTOiaemASIn8IPqgib70jtTaQFbSMaCLfVVjYVXZYq4z6iakhBRQD2M/640?wx_fmt=jpeg&from=appmsg "")  
### 验证码  
###### 验证码漏洞还是主要看能不能绕过了，下面说一下测试的思路吧。  
> 验证码可绕过：none，ture，或删除code字段等  
  
验证码没有和手机号或邮箱绑定  
  
验证码可爆破  
  
#### 验证码爆破  
###### 这个是我爆破验证码进后台测试出xss和文件上传任意用户登录的流程  
###### 1.找到一个党校资产  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFEAUREjOXxQr2iaro4jojaLn51sHl0BE2Th8muYia0wRGUrcLuW0pTY8X83qiazWrNl2ELTycGIoDYiciaVB4C1wb2PhgoUmQy3sbAQ/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.获取验证码抓包并爆破出测试账号（账号不存在会回显）  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFs4Io2WG2c70icc33uczCH2cb3LEmLQo29wDSg95kv2B3Q9L3nH2icElU5aCp9I9icbSa5LaBKLlkgR3gpOjf3ibEmpKJyStu8VXE/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.通过测试账号在爆破出四位验证码  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFVg9OqElozsic9ESNneqXLTjAWg3pUNqYKMuOUt9bJf7z7BHy7mmibNXOJZiaYxKfyEwibX4NbbOVdRZPmKB0uTkx6FPTSWUuv4ibU/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.成功登录后台  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFF7pGLJnmBeLPknSLyk6cA67vG1B2W3IbITmCvqHmFXZd0jLZqukV1QRciaDurvmA6tJk34jpVBsvkw3QntFibmLwibZHShgnfAEE/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.获取敏感信息（手机号 职务 姓名 地址）  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHd34MXwEW8odpOc6f7GoKkgT5lvQsZgoXLwiaEv5icfYvkZOhBedeThxUbwf54OjX4ia7GRcd1xibsiaRWAf0zsHcia4dJoSQBrcvME/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHZa0lTRaRJYGOVhKSXvNHx4ugjg2ibzkKxz8Q5qxEIFczCHAwwRj8qhH2viagj2vNDsSia2sEf1W2biawrIbJ2rlfib2E2B6Lib8fXw/640?wx_fmt=jpeg&from=appmsg "")  
###### 6.尝试登录这个用户  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFF8A4nXRZ0xao6F06p3vHI7v3DQlicH3s5LMEztENK9p0ibrJd3H3k4Evffv1sD3a9SiaT1ScXibUYsfdZn2Cn6zn49yn7BichGZJ2A/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFBAWVa4jKicVaf5PnjkvwRPhBlfyqOWKh1Hlb3SJaZibzF4hZNg87ib7v4jEaXQhEzjIxj6eR4gshdajYdGmiaavJe9aNIxtGBibXc/640?wx_fmt=jpeg&from=appmsg "")  
###### 7.聊天室xss  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFu3bg3rn0QelkTOyqHic1IicRjX9ImKaYecyEPCYcvbSaNWDPEswI8DicjJrXKibOXOkpzQMSwkJXvZwxcdmr1Yn2IOFc3MiclcA8c/640?wx_fmt=jpeg&from=appmsg "")  
###### 8.发现解析js代码  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFqeXDZU7tbFT0gmpq3drLvANk5wa8bw9kRtUicDhMklflW03NiactvhH8uF3R0vBXqwrInyHgqDgWF0nkUrQQorPI56RZVjUYow/640?wx_fmt=jpeg&from=appmsg "")  
###### 9.弹窗  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHrl6TH5dmWubEcTO7uOUYv0PAHibhm7RHHq6RrPQ8PreJxUzv35uR4mTyHtcKyd0XAkOquCQND41Ir9qLu3uf0ZJbGUc4zKNuU/640?wx_fmt=jpeg&from=appmsg "")  
###### 10.文件上传  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFUspyxxWgWPmURZsSXFytdP3gAiaSCsbAEVxRPx9lBaRpVQB4Xy2UeQRwSoptbsvVicJqQ2RiccoJcGiaBZwNJDmNbeweRgMBvQf8/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHohcMqgUX9iaD0d8v4uDX00XP11XYydjcfEAYibBibaprOe5BniamLrxYfGO0cPIEuicQzQWCkCeoFibUmVztjhw037dPaXSVtyZ8z4/640?wx_fmt=jpeg&from=appmsg "")  
#### 任意手机号邮箱验证码绑定  
###### 这个是真的乱就是网站只验证了验证码是否有效，导致手机和手机，邮箱和邮箱，手机和邮箱可以任意绑定  
###### 1.申请验证码  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGibeWngyfCPdWz4AqjeNnsOfYy6fgYRot0XZU76oeYYBvGdNc3LGhV7Ehjg5Plustq980UktQxWSL4LpgPUePytbcHneY7WOmg/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.获取验证码  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFk6SNib0jCiasaNBicdNlLqOWOjxLuuP6MgribIaqFGp3yvnD33LKwmKlTgBic4KI144Iicia3pWsQ963yT8kbuBxnBqcjtX8WJDFlMo/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.跟换绑定手机号（不是接收验证码的手机号）  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEmot8VVg5j5UbUhakkJnQNdicIdmfaEo5Q5ibz3yjOvBvETPLTibdUWQQIfyicFS6snxlibWfQdOKQOBAkCJqOD4saN8JzEzNTBvt8/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGicPia7RxOspXeYNg5I47EwsCUvgRkG9MtzYZuJfFEGwxtUPxsJ4ac2OFzSx9c7vWibEm4aV0ZLh3KzyQVnrCQ6zHA1GmtJCL3lk/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.手机和邮箱绑定（邮箱和邮箱不演示了）  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGEgfWDYNw0Siat06wKhicziaxWJ1Qbcqgd05D7uBZjuYuufiakMLgibNS5wqeOWIkTgjcTvjaFcibNO4fP2KI2frxjrJVWiaJ3UjJ8Mo/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFEtsSicfCvLxe0LaNsLic3Xu6DDBqzjlRnmh13q7baeHCYfZv3siatsmt0IJ31jW9lmtNEV0CKFjJrquibEtzWTLaKE8fFKsbY37Gw/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.更改绑定邮箱（我邮箱甚至没有发送验证码）  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGPnICTR2qUFcx4icqSicWgpLZuDv6Qspicz5QZWEYfibb0VSQz109icf4SxuoLxJ0eG62wZgshm3BljsyRdib9zhCnKxjzOticicTDibiaw/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFibvdXaibR6SCoFbS3ib5LaYxocmL5ZZsIQI2EsWhAN35FUZnNnaW4djrsib8lZc7XoibNNsgia0dWMFKfIttVKDzgknAHULqDImpBg/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGBYcIczhdThEb6gQ0N1d7QGrqI3ojt4kMg3dicRRThu2MvO0rnOULVnU3icyibn1gflH6Y8YHYFEIOlVOaunX7O5wZLrmeS1DheI/640?wx_fmt=jpeg&from=appmsg "")  
### 未授权访问  
###### 这里的未授权访问是网站组件的未授权，如果开发没有做到访问控制，就会有安全问题，这里就列举一些组件和路径吧。  
> Springboot Actuator：/actuator/env /actuator/beans  
  
Swigger-ui ：/Swigger-ui.html  
  
druid：/druid/index.html  
  
tomcat：/manager/html  
  
jboss：/jmx-console  
  
#### Actuator未授权  
###### 1.发现一处资产  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEIeicUuIGNWYnaaffEOjRfURaBDMxF7K7aqSCMYLqRyAhHSTlicc6BkCs6Zv3nBNtx5PuMjuK8sgcfD9FicdfYsqbicnefM87MUqU/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.常规路径扫描发现存在Actuator未授权漏洞  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFE03Up1mWicbJZZPpibpfJmXIVR44pINDkRPwgEXy9Pib0pdmC05ibxwuYfFraDFOAb3N3xTahtYKkhicpYZmOr1P1PXadgLPUfltjo/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.尝试下载heapdump  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEajM3NusYOqtQ1mZJ1ufvMfM0qp8G531AXiagbFEI4SWotUkdezribqEVBdlnVt9rtgibnMH5ZL45ibp8Rdh4H8mEDQwYI5Yt4kg8/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.成功解密敏感信息数据库账号密码  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFeLS303XvBvTklulzIcMDWvTTtJSBeUquhb6icAWIlhaObYAg1cpm5U7d0asTe6tdGTXkSz4Ls3xaPicbSknzp0ibPFPia7ChnXlg/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGU8kJYR91SR7dkfBNLNbxJl3CfdnyMzKg05XPgXzpS5V83UgF4sKgZ8KiaN83ovbb2EJ1wPvj1AhWS8D9N3oXKdn10p6gicKwdU/640?wx_fmt=jpeg&from=appmsg "")  
### 高危组件  
###### 这个都是老生常谈的漏洞了，随便哪一个漏扫工具都可以的，还是推荐goby，我在信息搜集的博客里说过好处，这里就不说了，那就列举一下组件吧。  
> shiro  
  
fastjson  
  
log4j  
  
struts2  
  
tomcat  
  
jboss  
  
各种OA系统  
  
#### shiro反序列化  
###### 1.发现一处资产，goby探针出shiro框架  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHsq7P7nOKMt6G4WTPnNSjoWsetC1KDicU55NjFc7xRSwyvZwa7obNFSfnV1qpfsDv30jZbqEwLsiajFDLk4A0SyTd4WNkNXPicSw/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGj6fOQcRvbaOI2PBetAial8XscPBFveE34akOnO4lc3mgIjMoLjhyjY5WsswfCM024W4U1cDcYGqc0d3DAj7HBDn3rumF41tW0/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.尝试使用框架工具攻击  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFGO7ySbmbBibYbibAZ2ibWEwvVpKAVWdlI5DpRByIic0picBbfeM9sDIkN0L5pUbKGPGTibN3JDEZCs41qVibfRKtr0u7ojxuTsic5UaGc/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFF9ssHYCI32aX9GxicjD9CrAs3fwkjOV8yrGYplAXEQSnpc5rN8c1EC9ORtEUGnQ1vIl88ZlEw29GXlNibiaRuxKB9Ydm7ywsNBRQ/640?wx_fmt=jpeg&from=appmsg "")  
### 越权  
###### 其实现在打越权已经挺难的了，现在正常的开发做身份认证不会是简单的userid了，我感觉没多少越权可以挖了。当然也有一些还是存在的，还是说一下测试点吧。  
> 主要存在于敏感操作时的身份认证，如个人信息，修改密码，修改邮箱这些。  
  
#### 任意图片删除  
###### 1.找到一处上传图片的功能  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHXmUxSoic7ERBC2H3JMAYXcbQlcqNgO5ko64NYU8tYJJA1ibibgbGicGA2szu2RiciaWJicA0k5G2LibSaKdlNLrHqnA9m35ErUduVue0/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.常规的文件上传都已经测试没有发现漏洞并且没有完整路径但是发现文件有自己的id并且这个id可以遍历  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHplia6iaoFibQZCmCfWs2gthdMs3YNpKT6viaEKnmMFGV75GCg9loH4yVDeROGeAF75Dp6sf8eLL125icyYMrNoxt0KzicSdBh6ShHk/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.那么就测试删除功能发现连cookie都没有只对文件id校验存在越权  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFEhU6AOjAkxjCjjoEuvnzIxqjZCkoIICxJjgdhEPVXrNuartEIJ3QCKE5UlxzJFKImjZ9V7Yy5ExSOwibpeRzFl2ic6SUicPDH9gM/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.这里不影响网站业务我自己注册账号测试  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHNsrOQWoKygFVp6xaH3fn4tyicibv7iczShhUb8QRrLKz0kDFuPuw9P5ArcnrTfJY47YicdFTD34ET1wzdYmNictj7HBgddZgasHrU/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.切换删除数据包id  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFkyJH2V5vEQibZXPJ0tXVbwle3Fstx9ibXhHJ7RuSqSP9K35jzzl6ktEiaPYFxKL2ia0OhpLERiblcJyJVOf7O96u9wg8RyicHUg8VY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFEK3s9DuLBqjjnFCT9nmskAZpzQnRB9yicDLg9oqgU2Nx1P2vqiaEZRcufMVbouCvr882BpOJUDe8KORL8Nsca9vAPweTkgjNXwI/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFEAE9w8RjdGT3icehqgJKM0lDDqFgccd4ZmboIkGYaWxyURzibicD1Xb3aLMkicPAxZwnvHX29c4L6tic7218DaJCrDQ7lsria0KjicoY/640?wx_fmt=jpeg&from=appmsg "")  
### 并发  
###### 都说万物皆可并发，那确实。但是涉及到并发的漏洞危害都不会很高，说一下测试点吧。  
> 限量商品  
  
签到  
  
积分  
  
退款  
  
点赞  
  
关注  
  
领取优惠券  
  
短信轰炸  
  
#### 并发签到  
###### 1.一处小程序资产  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFE7aXBv0tjRtnDoXvo8sptFGmvlgp0gCC9qn9Y11ib5meKIQ6Rd09pju25MI3YdKFfgGSy773E0lAMpRnKckFImbkCLibNFQ5Cjo/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.签到数据包抓包并发  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFG54hpM42INf61XIw7ibbovNP5vg7FIJWRWnlibUWXukYFAn2XyXX0ibcdRdzYNDRTZhYFZUM6eCicL8DxPEziaRYLhPwx00j2o9kfY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHfUrV4WKlHMCjEYBSTU5Tc0qkZ0XTPCkI8KO9WADR6DgIQgv9ibDlJHUXCNURuORKnoAVRTexA0PZ7D2q6m9LL7OYqloB54icgE/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.查看信息  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGm0s8DUBPlVBGww3xicFnUmrIEcAz8sxFyFaJ0KnTsFicDxbOK2LAfeO0wtKt6xkR6xuBEg8BsMtNcrWvEq6LwWftaArqxb7cwI/640?wx_fmt=jpeg&from=appmsg "")  
###### 4.眼尖的可以发现签到时通过用户id决定的，同样是可以越权签到并发的（就是没啥危害）  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHBYDjkGFshia82J9ibpibJllf0lqpibiap4CiaAB7ThaWKfj0cFOiaibgElPCEcAOyNTPv0VBrxH6x9Iicgz5r17KfSLlyZWrwU5wNMub8/640?wx_fmt=jpeg&from=appmsg "")  
###### 5.排行榜泄露userid  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHHdbC4LciaUONXKfaIld7IFqbpbxOCtdyu686XWdDPiaMfuhs63XKOzl2lAFs7QphoTNeLxFR0mtJsaUaO3cdkib2oMAKI9ia5q3s/640?wx_fmt=jpeg&from=appmsg "")  
###### 6.试天明用户  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFFj7hFhFAXswRI0ib7YfMVbVxGBbD5iaz9vR1f8zsyAuicdiczj2QvLdkTuiaEibI5TMzZtsMQUicpM7tWGJUdLF7nCskEibmsCyR7EryY/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFHHW5kQ5nTGgOQ7qLvsD0ibuzZtlFHTtRPdX7jxAsWVQHujuUhX1AyKlJnVxhGSaFy7KtTYExKeb3UV73GVU2XVauV3oV0qQfIA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGicGBuC9YcMee73OEBtiapiaSRe7oHoVMGicD3omvAnNFaVB39uX1N4HBgKYicEaWX7reKq1Yo8qCSBKYL3icwv9ZHWO22iaDnwTGVibs/640?wx_fmt=jpeg&from=appmsg "")  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHabLl8Hzatmue6z4VNeqhn6zu8pCQSln40PEzX0MXN7sASKPFmW5lJdTGYPOwibcq96tXicKPVCu2iaSrINg7exTLhIFW2nF1Pkg/640?wx_fmt=jpeg&from=appmsg "")  
### 短信或或邮箱轰炸  
###### 额，这个更是没啥好说的，没啥技术含量，看运气吧，见到验证码了测试一下就行了。  
#### 短信轰炸  
###### 1.发现一处发送验证码功能  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHiaGw3VEEoefDLymbS2kax77yueAq3MbLKhjctzL182hdKh3x39ia92mRtJ3TKZyFpbRYYd080ldPsvTWJ90HMU0808QvgkBX78/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.抓取数据包尝试并发  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFELiaGWb0TYsL7otNzZdRPLbIcFjpmZicDas4M4JQGRSMy6yJN881O0crJxLfbgx6loffLtZrwuV8ibtw16FMGWuh4YEhia0Ire9rU/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.查看手机  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHbe5lTRXn30jsAolico6WpUWw38bZ4fmicxXDLIkyJKLEdTByicjlWt5cUoP2rOE2LibETriaegxHEb0RbS1yeib5z2ibbSgPkia0S8eA/640?wx_fmt=jpeg&from=appmsg "")  
#### 邮箱轰炸  
###### 1.一处邮箱验证码业务  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFHiaOEwphNhHUZnwUZp0PzNs87mx2YZn1ibdDcCQqrb3Pt9richcFePib4FhRO2lqCGEmiaxqOOPRFo69A4Czwd3AicKsiaeVhFxI9l60/640?wx_fmt=jpeg&from=appmsg "")  
###### 2.抓取数据包尝试并发  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Pled5HYvsFFAR5Qh02n0U1pam0H7NNjMicXkqoiaxicbQLicYs7fWTyJJhgml6Lem4RibKQtXbcQtCutfU0AxteF6BEYxdx6OejIUTIElu2VYuLE/640?wx_fmt=jpeg&from=appmsg "")  
###### 3.查看邮箱  
  
![image.png](https://mmbiz.qpic.cn/mmbiz_jpg/Pled5HYvsFGIdBBHgggyjXuxibUUQ0kuw6UdDQSTSahVspyhtVQb069O6yvbWiaxebpz88wmKDqGHdD8Znp08r4qQrRY4bEMT4coJrNJkiaaqE/640?wx_fmt=jpeg&from=appmsg "")  
## 结语  
###### 说了这么多，其实也都不是很难的漏洞，只要耐心在多一点，一定能挖到洞的，同时多看别人的博客借鉴一下思路，加油加油。  
######   
###### 原文链接：https://www.freebuf.com/articles/web/460765.html  
  
