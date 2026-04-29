#  Java“幽灵比特位” 漏洞原理+复现+工具地址(Ghost Bits(幽灵比特)详细分析手册)  
原创 0x八月
                    0x八月  0x八月   2026-04-29 04:38  
  
⚠️  
  
    请勿利用文章内的相关技术从事  
**非法渗透测试**  
，由于传播、利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，作者不为此承担任何责任。  
**工具和内容均来自网络，仅做学习和记录使用，安全性自测，如有侵权请联系删除。**  
  
⚠️注意：现在只对常读和星标的公众号才展示大图推送，建议大家把"  
**0x八月**  
"设为星标⭐️"否则可能就看不到了啦  
,  
点击下方卡片关注我哦！  
  
**💡手册地址在文章底部哦！**  
  
  
## 一句话讲明白 Java 中 Ghost Bits(幽灵比特)  
  
**Ghost Bits / 幽灵比特 指的是：**  
   
  
  Java 里的 char 是 16 位，但某些代码把它强行转成 8 位 byte 。 结果就是：高 8 位被悄悄丢掉，只剩低 8 位。 攻击者可以利用这个特性，让WAF安全检查设备看到“奇怪中文/Unicode”，但底层真正执行时变成危险字符。  
## Ghost Bits(幽灵比特)详细分析手册(地址在文章底部：)  
  
![](https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODzWKTSrQGmNVcjvfCprVaiaMNJfTHcfsS91UuYTdNMn1rAy1ZNgL6XukUjMQFiczUGicepU5bzKSYqESptd6bzmdmxm67fW6hZov4/640?wx_fmt=png&from=appmsg "")  
  
Cast Attack: Java 中 Ghost Bits(幽灵比特)引发的新型威胁  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODxkUCOLCLlbAfae7jPmZZymhrJYdafkHibFGAiaJzXe9z223ls1eVg6fueiadibOrUDr9QSV1b01UgakaZaicHruv6FRUDFeHeoqvQY/640?wx_fmt=png&from=appmsg "")  
![](https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODwzNMW07kj40r9rXZmZBAC4TPVD6g3Artnb7VzTeqhbJv080dfI5s2E5FnBKCEXRZn0T1V9pCjJAsLCFn0GSSzKgnYpZNFqnqE/640?wx_fmt=png&from=appmsg "")  
## 1.输入框  
  
**1.开局一个文件上传处**  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/L9cic5ql9ODyd6XQwHWbMPXSaxwMeNnADLVtEhvbGwqMrkZoZo4k4pZA2cP32LicfEicmmbWzz0L5o4M2ARicffETPLwjb4D7C4Hqzajiafsn03E/640?wx_fmt=other&from=appmsg "")  
## 2.webshell工具  
  
https://github.com/cseroad/Webshell_Generate  
  
用webshell工具生成一个冰蝎jsp马子，工具地址如上：  
  
![](https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODwkPBwhuRcMvCspqMZkRiaU09b4PMmerpAhHCMRXIE9E3ibkcWb7OjeEspriazysPNibjmcIQtrgicFfyCFUjIRCMmGpiaNBRx5xGT34/640?wx_fmt=png&from=appmsg "")  
  
上传jsp马子，WAF拦截了，提示禁止上传JSP文件  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/L9cic5ql9ODzickD14ibrIL0Wgjyr11Ck6yXKTNzicOcNNuddiaZVjwZ6ZRAribL1ibBoRzOl4r1EX1ia5RZoqaoTLDW3JKKVBiaLicku7XjR1HXlVMDY/640?wx_fmt=other&from=appmsg "")  
  
上传马子提示拦截  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/L9cic5ql9ODyRB3jypQKvK3Lb7QhxJJCfnB4x508CyUArrn575JmLtp7iaS7B7BUR89mGQtNicLXHUicBh1LxtQjL31y5WcV2Gef2LiamAcdx0Tc/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/L9cic5ql9ODzyc28xc5f5tIcxOnzic7AjNjmOl7Vzg9qUBr7C9056P9QOcK7YX8YibUfTrajZfyMAkwO3pHNyecL3cjdX13icwcc1PZvlKv8MRM/640?wx_fmt=other&from=appmsg "")  
## 3.抓包拦截  
  
  用burp或者Yakit抓包拦截，利用陪字进行绕过，把j改为陪字，工具地址如下：  
  
https://www.yaklang.com/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/L9cic5ql9ODxhbOGAiaX7h2vmePKJIBoDRsfgc5E3Ga9nVQCf7zVzEZmOuLiaphicKVkGu8I0UbUBlTyPPM4dseicxZPdoad4zoHfuTVNuR2Swno/640?wx_fmt=other&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/L9cic5ql9ODycB0wosibuVy52xfOMHxo7kjiawd71kC1icPq9ibCicsRpCJxmc29TQcLau2Vtx1ibQEpt4icZEER7j4QiadpW6TocdAKibE1XKicvzDdt8/640?wx_fmt=other&from=appmsg "")  
## 4.冰蝎连接  
  
  用冰蝎进行连接，用其他工具也可以生成对应的马子上传链接就行，工具用的是ONE-FOX集成工具箱的工具，  
ONE-FOX集成工具箱  
地址(**工具来自我个人转存**  
)如下：  
  
https://pan.baidu.com/s/1FWJ_BB6ixGt49FDYJfiKxQ?pwd=nqf7  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODyrI0hJ0c20McpwnSMRQ2ibpxDzrZVhQZ7FtVsy9P6ia2kl3WHlCqQAjdR6RtfESsGPr5b2eY2VqpsmR2DrIOBDFL2S6YYB7OTqU/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/L9cic5ql9ODxabkel9nQdmcvzs0tKqEiaP832JoX4dyZbXTDVAo71JvkPKYyuxAkOVHK0ogLiblE5CeIC4aCJvI5FIibDicrXicB6WotmricLxYHKE/640?wx_fmt=other&from=appmsg "")  
  
找到/tmp/flag.txt![](https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODy6098qmbrDXfUpKRguazIpBnmELpIV8UevDiaOHKjheGCXC6L0qupYooWfKKUsIJrfpm6Lic8vFaUvMAQfyEdIIsVIwnj41VicHY/640?wx_fmt=png&from=appmsg "")  
  
  
## 📖 手册地址  
  
  
```
https://wwavm.lanzoue.com/iLWW93oa35sj
```  
## 💻 技术交流与学习  
  
      
如果师傅们想要第一时间获取到  
**最新的威胁情报**  
，可以添加下面我创建的  
**钉钉漏洞威胁情报群**  
，便于师傅们可以及时获取最新的  
**IOC**  
。  
  
    如果师傅们想要获取网络安全相关知识内容，可以添加下面我创建的  
**网络安全全栈知识库**  
，便于师傅们的学习和使用：  
  
覆盖渗透、安服、运营、代码审计、内网、移动、应急、工控、AI/LLM、数据、业务、情报、黑灰产、SRC、溯源、钓鱼、区块链等  方向，  
**内容还在持续整理中......**  
。  
  
⚠️  
打广告的勿进，会直接踢掉！！！  
  
  
<table><thead><tr style="border-width: 0px;border-style: none;border-color: currentcolor;background-color: transparent;"><th style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/mmbiz_png/L9cic5ql9ODzDcbialtDJB2iauRibULjWbzQk2oeHEyuNcGjibhWw6SpJia0RYGY3D7UhMASYr1QPAicb1LaSL1XlDrVowaibjeB41IKYSBHE8z9sN8/640?wx_fmt=png&amp;from=appmsg" class="rich_pages wxw-img" data-ratio="0.7916666666666666" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;display: block;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-backw="289.33334" data-backh="229.33334" data-imgfileid="100003716" data-aistatus="1"/></section></th><th style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);text-align: left;background-color: rgb(255, 217, 61);text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;"><section nodeleaf=""><img data-src="https://mmbiz.qpic.cn/sz_mmbiz_png/L9cic5ql9ODwMu4dL9ZhibwZKibzwdD01Btq6ia2183uH0ibzaGibkr1aribDe1jicrtW0px8pd6Rz1kT7QpTtzfdmicibiaFZHSqI40srWZhLQ9HpR1JY/640?wx_fmt=png&amp;from=appmsg" class="rich_pages wxw-img" data-ratio="0.625" data-type="png" data-w="1080" style="margin: 32px auto;padding: 8px;display: block;border-radius: 4px;border-width: 4px;border-style: solid;border-color: rgb(26, 26, 26);box-shadow: rgb(26, 26, 26) 8px 8px 0px;background: none rgb(255, 255, 255);transform: rotate(-1deg);transition: transform 0.3s;width: 100%;height: auto;" data-backw="0.33333999999999975" data-backh="0.33333999999999975" data-imgfileid="100003715" data-aistatus="1"/></section></th></tr></thead></table>  
### 推荐阅读  
  
  
✦ ✦ ✦  
  
<table><thead><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><th data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);background: rgb(255, 217, 61);text-align: left;text-transform: uppercase;letter-spacing: 0.02em;font-size: 14px;min-width: 85px;word-break: break-all;"><section style="text-align: center;"><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485592&amp;idx=1&amp;sn=818004a6d625c4c4112ce73b83433854&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">渗透测试人员必备武器库：子域名爆破、漏洞扫描、内网渗透、工控安全工具全收录</a></span></section></th></tr></thead><tbody><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485309&amp;idx=1&amp;sn=292afbe37fb95c64f33470f915b0c54e&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI驱动的自动化红队编排框架(AutoRedTeam-Orchestrator)跨平台支持，集成 130+ 安全工具与 2000+ Payload</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247486181&amp;idx=1&amp;sn=3ace47da643c72cec0d615aeccb955ac&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">JS逆向必备：这款插件能Bypass Debugger、Hook CryptoJS、抓取路由</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485488&amp;idx=1&amp;sn=a37acb031febe69db608de53ddee5732&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">上传代码即审计：AI 驱动的自动化漏洞挖掘与 POC 验证平台</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="439.3333333333333" width="439.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485208&amp;idx=1&amp;sn=b5181181c1e0800124e3e099706ef2ef&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">AI 原生安全测试平台(CyberStrikeAI)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485805&amp;idx=1&amp;sn=8f374a239135f6a753d5cce887f8318b&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">多Agent智能协作+40+工具调用：基于大模型的端到端自动化漏洞挖掘与验证系统</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: rgb(255, 249, 196);"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485314&amp;idx=1&amp;sn=56082cd314311ffc15cc0bcf03a395e2&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于DeepSeek的代码审计工具 (Ai-SAST-tool.xjar)</a></span></section></td></tr><tr style="border-width: 0px;border-style: initial;border-color: initial;background-color: transparent;"><td data-colwidth="459.3333333333333" width="459.3333333333333" style="padding: 12px 16px;border-width: 2px;border-color: rgb(26, 26, 26);font-size: 15px;color: rgb(45, 45, 45);font-weight: 600;min-width: 85px;"><section><span leaf=""><a class="normal_text_link" target="_blank" style="color: rgb(255, 107, 107);border-bottom: 3px solid rgb(255, 217, 61);background: linear-gradient(transparent 70%, rgba(255, 217, 61, 0.3) 0px);transition: 0.2s;" href="https://mp.weixin.qq.com/s?__biz=MzE5ODgwNzgzMA==&amp;mid=2247485127&amp;idx=1&amp;sn=b5eb3fdc1cc23976011e2bca396c1bc7&amp;scene=21#wechat_redirect" textvalue="" linktype="text" data-linktype="2">基于AI的自主渗透测试平台 </a></span></section></td></tr></tbody></table>  
  
✦ ✦ ✦  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnAqueibZX8s1IJDIlA8UJmu3uWsZUxqahoolciaqq65A30ia93jCyEwTLA/640?wx_fmt=gif&from=appmsg "")  
  
**点分享**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJniaq4LXsS43znk18DicsT6LtgMylx4w69DNNhsia1nyw4qEtEFnADmSLPg/640?wx_fmt=gif&from=appmsg "")  
  
**点收藏**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnev2xbu5ega5oFianDp0DBuVwibRZ8Ro1BGp4oxv0JOhDibNQzlSsku9ng/640?wx_fmt=gif&from=appmsg "")  
  
**点在看**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/AXRefkPRWsEZqurn2l5WTaTjyicrUtIJnwVncsEYvPhsCdoMYkI6PAHJQq4tEiaK3fcm3HGLialEMuMwKnnwwSibyA/640?wx_fmt=gif&from=appmsg "")  
  
**点点赞**  
  
