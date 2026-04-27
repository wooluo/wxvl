#  代码审计 某cms任意文件下载漏洞  
原创 moonsec
                    moonsec  moonsec   2026-04-27 03:08  
  
```
免责声明：
本公众号所提供的文字和信息仅供学习和研究使用，不得用于任何非法用途。
我们强烈谴责任何非法活动，并严格遵守法律法规。
读者应该自觉遵守法律法规，不得利用本公众号所提供的信息从事任何违法活动。
本公众号不对读者的任何违法行为承担任何责任。
```  
  
文件位置 app/admin/controller/PicManager.php  
  
当提交的参数是 extract 进入getImg函数   
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRtArriadXNZnPBwkgYznvLN8SH5QvfBlbV66cA5DOldPkocxbO9AxAibZbJuBMsTAOwr8HgSf7KRjdkUjyTZNwibicteicW33Jf7Zw4/640?wx_fmt=png&from=appmsg "")  
  
跟进 getImg函数  创建图片类对象   
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRtWXfNiaN5Bh0IDib7QTraTgZFvYCvNwhuspwQzOfBPsiblGZHIH2e8398re3aW63devprRiaqlwbKCYXlwA4pgrVsemjIQUCzgnM8/640?wx_fmt=png&from=appmsg "")  
  
调用download函数 跟进该函数  调用file_url_content内容 通过 $$filename的参数是可控的 最后通过 file_put_contents 函数将文件写入。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRuomlaziau2ibNZ1SznHQfxlaovwdzMmsLW6DjIFict477Rujia5mTSZfB51DQbahTXHRpLLvX6ia26DXg90Je2DjYQuhLJh8mhIibSs/640?wx_fmt=png&from=appmsg "")  
  
后面就是 new file是检测该文件是否存在 上传之后code返回=0 所以并不会删除该文件  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRuBY4cYIOdWqrdnnUN14DtWRE0OQNkVA0ZwgqnCEYFEVBWohG3YMjlHdIAP9AvNcrwONzWobmjaWLHaYt983ialtOPKl5btGvPM/640?wx_fmt=png&from=appmsg "")  
  
在远程服务器上创建shell文件  
```
<?php
file_put_contents('sb.php','<?php phpinfo();?>');
phpinfo();
?>

```  
  
提交  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0ic45F94NibRuKoVbRiaowz7HLZPUNCDdibPFgZ2Zg9fIBLUib5tZWDG0CrKia6EepMenmly8gpoOL0rPfNDoj9GbialJFSlWMzbQvaNUhugmj2D7U/640?wx_fmt=png&from=appmsg "")  
  
shell.php下载该服务器上  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0ic45F94NibRtjY3FV9FcrLNF90G5hjgS2jrnwSMDBFcPBOlVI0O391nDRqcJpgBZ7pPqW6qrR2uYC1G3ECCaWpxfEAvRfUxD5D0LBQicib99Js/640?wx_fmt=png&from=appmsg "")  
  
  
想系统学习渗透测试？扫码报名培训课程！  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/0ic45F94NibRsialpJZMkRG2RdpfT0h6icA8KWIQCN24FYyshicRB8N68lr3Jm73zKB5OEIVPyouSluEus7plSEaS4Ckgic7U2ezqibzmUWb4Km7nA/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
  
  
