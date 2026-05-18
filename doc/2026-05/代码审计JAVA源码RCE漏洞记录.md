#  代码审计JAVA源码RCE漏洞记录  
 威零安全团队   2026-05-18 06:14  
  
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
  
