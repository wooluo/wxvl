#  key泄露利用：高危漏洞一条龙漏洞利用工具  
原创 神农Sec
                        神农Sec  神农Sec   2026-05-25 01:00  
  
  课程培训  
  
  扫码咨询  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/b7iaH1LtiaKWXLicr9MthUBGib1nvDibDT4r6iaK4cQvn56iako5nUwJ9MGiaXFdhNMurGdFLqbD9Rs3QxGrHTAsWKmc1w/640?wx_fmt=jpeg&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaaJcib7FH02wTKvoHALAMw4fchVnBLMw4kTQ7B9oUy0RGfiacu34QEZgDpfia0sVmWrHcDZCV1Na5wDQ/640?wx_fmt=png&wxfrom=13&wx_lazy=1&wx_co=1&tp=wxpic "")  
  
  
#   
  
专注于SRC漏洞挖掘、红蓝对抗、渗透测试、代码审计JS逆向，CNVD和EDUSRC漏洞挖掘，以及工具分享、前沿信息分享、POC、EXP分享。不定期分享各种好玩的项目及好用的工具，欢迎关注。加内部圈子，文末有彩蛋（课程培训限时优惠）。  
#   
  
  
01  
  
0x1 key泄露利用：高危漏洞一条龙漏洞利用工具  
  
## 0x1 前言  
  
哈咯，师傅们！这篇文章主要是给大家介绍相关key泄露，如何进行利用，给师傅们介绍很多好用的工具，进行更加高效地渗透测试，漏洞挖掘操作！  
## 0x2 云安全相关key泄露利用  
### 一、云业务 AccessKey 标识特征整理  
  
学习参考文章：  
  
https://wiki.teamssix.com/cloudservice/more/  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXIqDkATmSHtNlNXrNvU1ic7FiaicQN3vgnhSHhX9TCra5WL8Ff7Wv9IicvFCSUQg8QhGWibapN3jibcuvA5rEOlhMrYcndAxr1tIckg/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面的论述也是看完**曾哥**  
的文章，然后加上自己的理解，下面给师傅们分享下AccessKey  
相关的知识点了。对于云场景的渗透，现在已经层出不穷，获得AK  
和SK  
，也是云安全渗透中重要的一环。  
  
通常，我们会在一些敏感的配置文件或者通过未授权访问、任意文件读取漏洞等方式，来寻找AK和SK。  
  
一般常见的通过正则匹配式  
来寻找AK和SK：  
```
(?i)((access_key|access_token|admin_pass|admin_user|algolia_admin_key|algolia_api_key|alias_pass|alicloud_access_key|amazon_secret_access_key|amazonaws|ansible_vault_password|aos_key|api_key|api_key_secret|api_key_sid|api_secret|api.googlemaps AIza|apidocs|apikey|apiSecret|app_debug|app_id|app_key|app_log_level|app_secret|appkey|appkeysecret|application_key|appsecret|appspot|auth_token|authorizationToken|authsecret|aws_access|aws_access_key_id|aws_bucket|aws_key|aws_secret|aws_secret_key|aws_token|AWSSecretKey|b2_app_key|bashrc password|bintray_apikey|bintray_gpg_password|bintray_key|bintraykey|bluemix_api_key|bluemix_pass|browserstack_access_key|bucket_password|bucketeer_aws_access_key_id|bucketeer_aws_secret_access_key|built_branch_deploy_key|bx_password|cache_driver|cache_s3_secret_key|cattle_access_key|cattle_secret_key|certificate_password|ci_deploy_password|client_secret|client_zpk_secret_key|clojars_password|cloud_api_key|cloud_watch_aws_access_key|cloudant_password|cloudflare_api_key|cloudflare_auth_key|cloudinary_api_secret|cloudinary_name|codecov_token|config|conn.login|connectionstring|consumer_key|consumer_secret|credentials|cypress_record_key|database_password|database_schema_test|datadog_api_key|datadog_app_key|db_password|db_server|db_username|dbpasswd|dbpassword|dbuser|deploy_password|digitalocean_ssh_key_body|digitalocean_ssh_key_ids|docker_hub_password|docker_key|docker_pass|docker_passwd|docker_password|dockerhub_password|dockerhubpassword|dot-files|dotfiles|droplet_travis_password|dynamoaccesskeyid|dynamosecretaccesskey|elastica_host|elastica_port|elasticsearch_password|encryption_key|encryption_password|env.heroku_api_key|env.sonatype_password|eureka.awssecretkey)[a-z0-9_ .\-,]{0,25})(=|>|:=|\|\|:|<=|=>|:).{0,5}['\"]([0-9a-zA-Z\-_=]{8,64})['\"]

```  
  
  
QQ_1779629499931  
  
下面我给师傅们介绍下常见的几个厂商的 Access Key  
 内容特征，然后就能够根据不同厂商 Key 的不同特征，直接能判断出这是哪家厂商的 Access Key  
 ，从而针对性进行渗透测试。其中我们云服务器常见的就是阿里云和腾讯云了，我主要给师傅们介绍下面两种Access Key的特点。  
  
**阿里云**  
  
阿里云 (Alibaba Cloud) 的 Access Key 开头标识一般是 "LTAI  
"。  
```
^LTAI[A-Za-z0-9]{12,20}$

```  
- Access Key ID长度为16-24个字符，由大写字母和数字组成。  
  
- Access Key Secret长度为30个字符，由大写字母、小写字母和数字组成。  
  
**腾讯云**  
  
腾讯云 (Tencent Cloud) 的 Access Key 开头标识一般是 "AKID  
"。  
```
^AKID[A-Za-z0-9]{13,20}$

```  
- SecretId长度为17个字符，由字母和数字组成。  
  
- SecretKey长度为40个字符，由字母和数字组成。  
  
### 二、云资产管理工具  
#### 1、下载  
  
工具GitHub地址：https://github.com/dark-kingA/cloudTools  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUoFnSrqVqoRHm2yicEju25KWoSMekat3deLwfjaZYbcDIFU1A4icSp7NuZwJGLAC1f6TrAKEwQtFyNIbkAcRiaEme0nTxCyRM49k/640?wx_fmt=png&from=appmsg "")  
  
img  
  
但是目前官方已经下架了，工具获取，添加我微信：routing_love  
获取即可  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXLGiblNfpjDRMjUKHcCy6bMuF5Kf7pzhwg68zOVThOnGXtU56eLkYS76KwaCiaIHkm4W4wdRf7TgPgNicibx91u2IoQ74ktyJGcp0/640?wx_fmt=png&from=appmsg "")  
  
img  
#### 2、工具功能  
  
阿里云：接管控制台、取消接管、Oss增删改查、远程命令执行回显、历史命令记录查看、子用户列表、云数据库管理、告警管理 腾讯云：接管控制台、取消接管、Oss增删改查、远程命令执行回显、子用户列表 华为云：接管控制台、取消接管、子用户列表 ucloud：接管控制台、主机查询、子用户列表查看、主用户查看、订单查看 AWS: 接管控制台、创建后门、子用户列表、策略列表 后门信息  
  
云存储工具-资产列表  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QW7zK7ADtRge0uaicQicfj4bXtuh4WhJmBC2ImpoIiatkVbwkicGCancp1QZ4Hh1MJ6xfqq4jE3kYex68dE8myVibRRiaRL3GsrwnvTw/640?wx_fmt=png&from=appmsg "")  
  
img  
  
云存储工具-存储桶信息  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWJLfFjzYPbAbQN5KDa52qWxQiaDe7aMRuVg14iaq8cicnTuG6oV55KbQXf2JfrBjZQWAkibBPS0YxibLfDEX4Hpg2zAhxfuiaUgMvLY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
云存储工具-其他服务  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWiaQ8rdVjHUbfcnPKPib4UPUMKsyWeDTN8svFRtdCLFHz0dVg2krOvY0YlSVvmQOEI96LbCh9lUyUPSw9G9A3jhJUxrE7gw4as0/640?wx_fmt=png&from=appmsg "")  
  
  
云服务工具-资产列表  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUSMLJlQDC7VmnFD6c5cCIknflk6Qa7SswvsaicMrxhKRQ5c7EBSSEEepsVb1a3UrV8BVyUALAIfRCk046fhv7lCSKcBibSrK8o0/640?wx_fmt=png&from=appmsg "")  
  
云服务工具-华为云接管控制台  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVXH2HR31d9JKiaXzKuJZDfrC5WbSGw5LsNenJu6GNnvk8gyQRBxoJtcww3YVCa5rxN40TkHAseCC2zHdMia6VP8oVb6JtHW9jUs/640?wx_fmt=png&from=appmsg "")  
  
云服务工具-ucloud相关  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVG4Pbe4bCnp7LeQpqeDUocRKuTwiaRASrVUK9FjOibAfxzcBmAVwxyYEwj6lrvutUkE3nZxBgW6ricrYYdn7XaIaSr95sz3yQeCs/640?wx_fmt=png&from=appmsg "")  
  
  
其他工具：钉钉key泄露利用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXLz74rpanjtva3R2EtkZSzoiaeSWibia1wichYBoBnfscW2iagyjfSPJ2FfIauGjnoH5J0WKoYBHZh8k5j7QCa2z2Hf4iaPtWS8Ijc4/640?wx_fmt=png&from=appmsg "")  
## 0x3 API-T00L-互联网厂商API利用工具  
### 一、工具使用介绍：  
  
期望是针对互联网各大API泄露的利用工具，包含钉钉、企业微信、飞书等。目前只做出了钉钉和企业微信，别问，就是懒。特别鸣谢chatgpt，代码好帮手。 目前界面长这样，布局拉胯，能用就行。  
  
GitHub项目地址：https://github.com/pykiller/API-T00L  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QW6LNmc1KuuBlJZleKJ96GzEoDicAaMVVjiboUfVWHplJ0JCRBGibNiaWnJ3okaZYV8EFjQWbWy79j17RyiakBGAGFyy0O1uOk6Jj4o/640?wx_fmt=png&from=appmsg "")  
  
img  
  
包含钉钉、企业微信、飞书等。目前只做出了钉钉和企业微信  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QVbZfBVSBZV9iccEcE3Jr8FKABeksPGaV3IRO7ficYkp9yxmPKyBkiaq4gf9A0gPpSKia10yibZPsd3jEcZSVcq6zgnHtfsZpn6cygY/640?wx_fmt=png&from=appmsg "")  
  
img  
### 二、钉钉  
  
1、肯定你得有ak、as。填进去获取token  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWic77lHHUkY0xJ3aukJxVzSbVrhibE08xdPSToal7wc4vuKaibKfibDh315libR9BLhrhvFOWEBkFfEqPicPPmpbCfwiaDyuz9u8Sj9I/640?wx_fmt=png&from=appmsg "")  
  
img  
  
2、建用户  
  
最简单的做法，直接填入有效手机号，加入组织中可以直接用手机号登录该企业。 userid不要重了，写大点。 删除按钮是根据userid来删除的  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUsbDNh7F38eDMkLsZLvjRgYsSKEEOHe1qUszaxetQ44AlsNicjsXYLRJb8jcb7GmALeYsU5mvuvcOMcntQ0sKxapms5GuRm2YU/640?wx_fmt=png&from=appmsg "")  
  
img  
  
3、发公告钓鱼  
  
获取管理员信息，得到管理员userid。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVdHKF58mHLyl3NUxa5ruOkib0z1HZPu3rEAn3ZD0Nibwaa4lXB5o3Zsr6uhoEHs61mcAgF7YOSCHcEkeM81jlHWNnPojRRzCZaU/640?wx_fmt=png&from=appmsg "")  
  
img  
  
查userid可以得到部门id dept_id，这里只做了对部门发公告，实际操作中针对个人发公告效果不如直接加用户钓鱼好使。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXOJqMYcd2ezZ1yXicFe0rL7yhuK85B2vxUdeGUVQ941bhAVG7V2vpsu9CAx1Tb4KRUtjVLaORneWUOLprxKlBxWQw02rk96GD4/640?wx_fmt=png&from=appmsg "")  
  
img  
### 三、企业微信  
  
企业微信相对于钉钉，限制较多，22年后获取的应用Corpsecret需要设置白名单，且无法绕过。并且对于通讯录的Corpsecret需要单独获取。  
  
1、用Corpid和Corpsecret获取token  
  
2、新建用户，填入有效手机号，加入组织中可以直接用手机号登录该企业。  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWZSNibNy1CmZXHy8TzT0BR2uvvlfT1Wt0H1pHaHvy3QYf49I7jVmxBGEcBmjDhM2VODb3ibgRHaicwOibgvF0Wb68Rdia3b3ODoVEs/640?wx_fmt=png&from=appmsg "")  
  
img  
  
3、还可以通过获取邀请二维码加入到企业。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWtnleEGEfbCGU6vZRWEFugjOXRZTKnG44wMASb7CYtvEGia0T6nfmo7xdhnf7cuLXlKcyhn34QtxaBPpiaMbac3OasicOMaiaUXyg/640?wx_fmt=png&from=appmsg "")  
  
img  
### 四、飞书  
  
1、获取tenant_access_token  
  
2、新建用户，填入有效手机号，加入组织中可以直接用手机号登录该企业。  
  
需要注意，open_department_id为查询到的部门id，用户默认是放根部门，比较明显。可以放小部门里。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUxpp1cJm8iafmNtk4FPQzzicA30NV8WO0kUBzbP6JfD96ibXx3MO03iadFEX2hpYfdRmQlQ2Lb7miad3d1bfXCqicugkwaao38v3bEQ/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUQkdl2ncjNp5ZicibicVc2dHUTibfy6B4zRLURGVpoOx5Wva01AISp0wQgRD0ebmxljymVJbdMyV9nkibHR6QfBWQnl24lDVFdl0hY/640?wx_fmt=png&from=appmsg "")  
  
img  
## 0x4 EasyTools工具箱  
### 1、工具介绍  
  
EasyTools - 一个简单方便使用的渗透测试工具箱,集成了工具仓库、网址导航、简练助手、CTF合集、代理池、cli脚本定时执行等诸多功能。  
  
工具下载地址：https://github.com/doki-byte/EasyTools  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXaM1gQa6NluGtdCA8NZOr76WgAibialXeibzRlgicr6WcwPIJtAnJX1z1TtkEjnogWF71DiaMQPibiay6LwAknib182UYtI9TWRUI1DMM/640?wx_fmt=png&from=appmsg "")  
  
img  
### 二、使用功能界面  
  
支持各种key泄露，里面都有对应的接口功能调用  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXJATExowXia4l9ehbOFy4GVleyMDzDodhCooHRxwgLXTZBoLCSKxTiar1miaOAIib9gO0BW2yakMWy6Ys6nh2gibbdZCWiaGxqwJFDY/640?wx_fmt=png&from=appmsg "")  
  
img  
  
各种地图api key泄露利用  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUtHDsteiaEUbgGRp0qwia4q8FAtbYSFvibJXz2W1H3sxpD4hrw6tdqve6gUx1MVrJ2N3aFtg8Y17jIp6revMkDRX5azaeftPKCoM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
注册虚假手机号、身份证信息随机注册  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVxQeD5dWYwibFxRdYlCxmsGvjj4lIzcm0ia75sPuia69Pcmlw4VleOE2Qao0mAibbT3ibCWzMvQe2K6sFS0OtsKzwApiaiaialx59NAMA/640?wx_fmt=png&from=appmsg "")  
  
img  
  
Google语法相关功能：  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVDDCibYcppvo5HMibQq68Bf1J8TIfTvoUAGLFBOIyibq1Y42jZkvJ1m9sk2YbyvMbAWsFEaJdumoYoAyicFKYHLD7ZHE4M2Hia3HoM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
OSS存储桶相关漏洞利用  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QWGUsNe02JDbiaibZxl9BoAVFVX4TKxyyAV36GDZWkJ9qnTXK5BrtPGf3jQ4RhaMQwyGxHsbB5Lgy05MSfpUKkbmN5IdHLIPPYibs/640?wx_fmt=png&from=appmsg "")  
  
img  
## 0x5 API-Explorer工具  
### 0x1 工具介绍  
  
工具初衷是做一个小程序、公众号、企业微信、飞书、钉钉等泄露secert后利用工具，后来发现几家接口有一定区别，认证等参数分布在不同位置，索性就做成一个比较通用的工具了。目前可以定义：请求类型、url、header、body、正则提取认证token、接口参数说明。  
  
工具GitHub下载链接：  
  
https://github.com/mrknow001/API-Explorer  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWZlH3EW8ia7icC8Nicdfia8C0JbOSN1vYq7k2MkZ9IRUTyOJEibIHKWo1c0dS312989FLs1qQjVsu0DG3jW2tzHDaE6pp4YtltqvR4/640?wx_fmt=png&from=appmsg "")  
  
img  
  
工具使用截屏：  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVs190EiayUOvRNQ2D4fJpk2RI9KicL3p99LFwtfHian4poqfI0ZSwSJawibWUEAePA0w2P6YNrxrWYve9h3mkhBEMWgY7wKY8nficc/640?wx_fmt=png&from=appmsg "")  
  
img  
### 0x2 使用场景  
  
场景1-(公众号appid，secert泄露利用)：  
  
1、获取accesstoken  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUvdAGt1dibo0ic3oWLiaiaibhZroaYKGaAEsibibs8M6x5r9YW1ia07UjiaW2UicyOndKFLzKgwINQW4lbevp9f3QGLtXM1HTYJMyPpawbw/640?wx_fmt=png&from=appmsg "")  
  
img  
  
2、使用此token访问其他接口  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXML8siaFuriaPSlwr8XIwhnPsTXQBAcIUWicssLuqmJaUoCQudT5V28tzBGPaNzQJbIM1iaBRO0obEHrweVnV6ibFdvVJXuqBFOH1Y/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QW6I40aibeGGYw3GFdyBbAZCE9Z8jnVXrtg9eGffFODzqsLWXH480sEoTudicSMbq0Zk0hEAib4ECaf6dZ9ibMCQiboM2KSvt7d8tQw/640?wx_fmt=png&from=appmsg "")  
  
img  
  
有些时候拿到的appid跟secert公众号用不了，其实是它没有公众号，只有小程序，可以先用公众号接口获取token然后使用小程序接口获取其对应信息。  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXxzdlMyTWbn2WfjpTCIqJNf8AWsXvEqvianyxlJVIHDW3eOzQ8RzIdUOUMLRhry6o2gyPYicqQH7aFU2AKvRdasqshqxQVewcHg/640?wx_fmt=png&from=appmsg "")  
  
img  
  
地图系列  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU0ibyBoeicGn9ibZESMSAib4gP7BujGnp1wnvdBia1I8HqTJdaFIOojHr34S2CLCr99qRZoG701NANOcjey7oxgibibjg1bIX8EgeLQ0/640?wx_fmt=png&from=appmsg "")  
  
img  
  
场景2-(设备巡检)：  
  
绿盟扫描器  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QW32gTrvyZGicYzDew8khibQSGI92xAbOzJbQC96BzcIVId80lRRcATibJVrX4ia4DZm1qz4ThRcdic1yGYbj1rTwghTXPj9IZ9HYsE/640?wx_fmt=png&from=appmsg "")  
  
img  
  
绿盟UTS  
  
获取token，注意这里密码加密后的，为了通用工具不做任何加密，所以加好密传入才行。获取加密办法：  
  
f12后登录页面输入账号密码，找到authen_user接口，获取password内容即可。这个密码可复用，只要不改密码就可以一直用。  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXhOGibR5kJKSCb1ONqeQaH4tm63D5DdTz7KVzP4u9c53s4dVicReJF2naaGex0HNBXea9UzE2d6cdwbqia9JpmicXfQs6ENaibMKWo/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXj1iaSMoCa3F47VegKZRLC9tofs2QIyUMwcia4pVJubU8Nlh7GdSEicShf0TolI5XjB4u13DH63cIUUqxUuAQbNIDwngiakiaorWqU/640?wx_fmt=png&from=appmsg "")  
  
img  
  
使用token获取设备信息  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUuNzjVFE17ALOI0CyXrDBIEPOJticF3G1ajvQ1gu8Gz6ABlg2letImoMUiceHZ0iaBnyaw3b9STLCNmLb7peqF3I2wW1MjMNsH7g/640?wx_fmt=png&from=appmsg "")  
  
img  
  
## 0x6 session_key三要素泄露  
  
GitHub下载地址：https://github.com/mrknow001/wx_sessionkey_decrypt/releases  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QUyNWm3iajXJFMVYqROkMLLGfrrt31ZrDz1JRxe7JBYNDMCb3nB9NNnq2pZro3oA3QzA6UroEXcpkichHqEMa0UAQGcboTz5sx8g/640?wx_fmt=png&from=appmsg "")  
  
img  
  
下面呢是我在挖那个市里面的人社局的微信小程序，说到微信小程序呢，师傅们应该是不陌生的，特别是打微信小程序常见的几个泄露，比如说这次要分享的session_key三要素泄露案例漏洞就是其中一个。session_key三要素泄露指的是SessionKey、iv以及加密字段全部泄露出来，一般在微信小程序使用手机号一键登录的时候常见的泄露，但是很多都是泄露iv以及加密字段，但是session_key值泄露的少。  
  
可以看到这个数据包直接把SessionKey、iv以及加密字段三个部分全部泄露了  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWhVhN3icQV3bXnu40RIgeaibIVl1zZUOs6uE9CCTFh9hYzdykN9vjrBkSnH5ABw5eG6Iia6wiaLpU3gwkcmhwlIbukhJZXKuZ4Gwo/640?wx_fmt=png&from=appmsg "")  
  
img  
  
得到session_key三要素泄露之后呢，就需要使用我们的一个Wx_SessionKey_crypt这个工具了（需要的师傅们可以私信我，或者加我微信获取）  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVs7zTJE8lqibm9O0fBFLWRKUfcPKBuvJiad8JDOQVMkX4lXiacDsHqRfJDFqqnaL2EVTqXRtgoJePddyibgfQdlI5niaMgdYQDyg4s/640?wx_fmt=png&from=appmsg "")  
  
img  
  
然后把泄露的三要素放到工具里面，然后解密，就可以看到我们的手机号了  
  
![img](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QVKJFQIl5EbEMdSHm7LmY2N3AES4AEKKZGAIr5RdKNyEFNr2JOiaITAAXCn77Ee3NRbias6a85o08m219DLPdgCvum9OJATRSpRk/640?wx_fmt=png&from=appmsg "")  
  
img  
  
其实利用这个漏洞的危害也很简单，就是我们可以在这个微信小程序的站点找到里面管理员的手机号，然后去替换手机号，然后再反向加密，然后再替换回开始登录的数据包中，然后再一键放包，就可以成功登录我们管理员的后台了  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QU6ib9ZsiaeiapDfXiblNqzPwpR3XLl4z4gaCLRicMTuPaNCkw5hXbicVwVibtX4icNWX5wEx9aYCaDFEkTFAXRZsKOribWbbYMTPnRoBsM/640?wx_fmt=png&from=appmsg "")  
  
img  
  
![img](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXia08oYuyv3u163oznl4o0x4JVuaxPWerRljrpdtgictX4eiaBaD4G8Uyb5mYOSwfiatgFWQVSthQIkzriaBMqTEKdibvzeibfJT3sfk/640?wx_fmt=png&from=appmsg "")  
  
img  
  
02  
  
0x2 培训课程介绍  
  
26  
  
**SRC漏洞挖掘培训课程**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/6cIuvSQkkicOHhYFkQLTibYAMUR9rfZ9eUrI78toIC4V2304G909O6s6CnVrAGiaYLEJM9XuUARhzNfxCtYKQfQ83wfPSlqpshSScfoYzSKzgY/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&watermark=1&tp=wxpic#imgIndex=4 "")  
  
  
**1.课程价格目前是500（后面也会随着人数越多，涨价）🌟师傅们还可以上车补票，冲冲冲！**  
  
**2.报名成功送知识星球一个，拉内部小圈子交流群+SRC直播通知群！✨**  
  
**3.一周2节课程，直播+录播形式，课程内容大家可以看课表，目前是第一期，一次报名永久无限听课！❤️**  
  
**4.目前是第一期课程，后面比如说开了二、三期，都是不用在花钱的！**  
  
**5.上课结束后，会把视频录播+课件笔记一起打包发直播群！**  
  
**6.哔哩哔哩SRC课程公开课，链接🔗直达：**  
  
**https://space.bilibili.com/642258933**  
  
SRC课程详情🔎：  
[学了一堆理论，还是挖不到漏洞？你缺的是实战！](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247507132&idx=1&sn=7b3c40c91ce461e1ed1319edfbd4eeba&scene=21#wechat_redirect)  
  
  
内部小圈子知识星球详情🔎：[50 元封顶！渗透攻防 + SRC 漏洞星球限时开放！](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247506434&idx=1&sn=afc6b7a3f7ff85899f67f1fcfa06b3f8&scene=21#wechat_redirect)  
  
  
欢迎关注微信公众号：神农Sec，报名咨询添加微信：  
routing_love  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QVcCkxIUpaBmNic17zibGfXMWrr9z89gE0DFtbOu3QYzD5d62zsp6qwc38Pssk60mLq8VKthcMOmctVlHU716S5G4KYmrKVrEj5c/640?wx_fmt=other&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=6 "")  
  
开课快四个月时间  
，课程目前已经  
累计加入了720+个学员  
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
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXqrv8Q7Vsons0tPanSGJgScibQcxT3Ulfbpu9oAZRZpMYUFMyLwtvA4kshsskESZVvoCFZjCI1J4EQmqtv7UhDMCYicCfYm3rB4/640?wx_fmt=png&from=appmsg "")  
  
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
累计2200+网络安全爱好者的加入！  
  
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
  
课程价格：500 元  
  
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
  
[强烈推荐一个永久的SRC挖掘、渗透攻防内部知](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247506434&idx=1&sn=afc6b7a3f7ff85899f67f1fcfa06b3f8&scene=21#wechat_redirect)  
  
[‍](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247506434&idx=1&sn=afc6b7a3f7ff85899f67f1fcfa06b3f8&scene=21#wechat_redirect)  
  
[识库](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247506434&idx=1&sn=afc6b7a3f7ff85899f67f1fcfa06b3f8&scene=21#wechat_redirect)  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QUnMhqpaL2GxsESAJLqn2v7xL2vYLemogiaMQmoacQbwXg0S2ic4cIC07TABY7iciaFzCegKSbeZWZr7ZnNicicRIf8n2cKnQv8Tgvuo/640?wx_fmt=png&from=appmsg "")  
  
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
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/mcko8AHj6QXicA0BukQVuKKhTydZfiaOEibqlIm6hJ5liacN1nBmN38icH4ibibfHAAh2jkSSaDqbCgNZgdEia5gHjibwKMBVO72Vp5iaSrN6iagxicZpOg/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QWzKmnCemQquDBf5uFwcpaG7RQqSPVwKqOKjrFxkCicFVTh6ngv3LOGDY1InR2mj0D6iby2A3Adic9U6MMsJ8FIo2wwxzPswjHsIQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/mcko8AHj6QXQJcAmd5OVIoq1znICoW1Sy9hTsxpwe9HsiceptQ58rFYCNibBonWQQEH1TB3IrMASTQ3icWHwRd7JDtBwAwibWEGZxvIxeseTiaIY/640?wx_fmt=png&from=appmsg "")  
  
  
  
**神农安全公开交流群**  
  
有需要的师傅们直接扫描文章二维码加入，然后要是后面群聊二维码扫描加入不了的师傅们，直接扫描文章开头的二维码加我（备注加群）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/mcko8AHj6QXibJR5TWAjg6DFt50ATthicP7fceTvvQibA90ec5XUic6AjSD77UziaEl3YRibFsticPvUArxdQR9MA4RddgKHRemwFGHlvWJMfU43do/640?wx_fmt=jpeg&from=appmsg "")  
  
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
  
[攻防演练｜分享最近一次攻防演练RTSP奇特之旅](https://mp.weixin.qq.com/s?__biz=Mzk0Mzc1MTI2Nw==&mid=2247492377&idx=1&sn=a94ad30e30e08bd96e888dad744e9814&scene=21#wechat_redirect)  
  
  
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
  
  
  
