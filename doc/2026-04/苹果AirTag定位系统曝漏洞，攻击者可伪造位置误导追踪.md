#  苹果AirTag定位系统曝漏洞，攻击者可伪造位置误导追踪  
 FreeBuf   2026-04-18 10:02  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/qq5rfBadR38jUokdlWSNlAjmEsO1rzv3srXShFRuTKBGDwkj4gvYy34iajd6zQiaKl77Wsy9mjC0xBCRg0YgDIWg/640?wx_fmt=gif "")  
  
##   
##   
  
苹果AirTag本应通过周边苹果设备组成的庞大网络帮助用户追踪遗失物品，但最新研究表明，攻击者可以操纵该系统显示AirTag从未到过的虚假位置。  
##   
  
**Part01**  
## 攻击原理剖析  
  
  
Find My网络依赖AirTag发出的蓝牙低功耗（BLE）信号。当iPhone或其他苹果设备检测到这些信号时，会向苹果发送加密的位置报告，物主随后能在Find My应用中查看该位置。这种加密机制虽然保护了用户隐私，但也导致系统无法验证所报告位置的真实性。  
  
  
研究人员利用这一缺陷演示了中继攻击：他们使用安卓设备、Linux系统和小型嵌入式硬件捕获测试AirTag的蓝牙信号，移除原AirTag的电池后，通过定制发射器在不同位置重放这些信号。接收到重放信号的苹果设备会误认为信号来自原AirTag，进而基于新位置生成报告并在Find My应用中显示。该攻击甚至能跨国实施——通过互联网传输捕获数据并在另一国家重放。  
  
  
**Part02**  
## Find My系统的信号冲突处理机制  
  
  
当原始AirTag与重放信号同时存在时，应用会在两个位置间切换显示，具体位置取决于系统处理哪组报告。该系统通过两种方式处理报告：仅接受使用当前加密密钥（约24小时更换一次）的云端报告，旧密钥轮换后立即失效；当物主设备在附近时，本地蓝牙信号会优先覆盖云端数据。  
  
  
被捕获的信号具有时效性：若通过移除电池等方式暂停密钥轮换，重放信号最多能持续七天产生有效位置报告。为验证该机制，研究人员搭建了中继服务器来存储捕获信号、记录首次发现时间并控制重放时机，从而系统测试虚假位置的持续时间。  
  
  
研究团队指出："我们的实验证明，苹果Find My协议设计存在实际可用的中继攻击漏洞。除向安全社区揭示该攻击向量外，后续研究将探索是否可通过位置混淆或干扰追踪等手段，将中继技术转化为反跟踪的主动防御措施。"  
  
  
**参考来源：**  
  
Apple AirTag tracking can be misled by replayed Bluetooth signals  
  
https://www.helpnetsecurity.com/2026/04/17/apple-airtag-relay-attack-location/  
  
  
  
**推荐阅读**  
  
[](https://mp.weixin.qq.com/s?__biz=MjM5NjA0NjgyMA==&mid=2651337048&idx=1&sn=7238361cc36d8446dbd7c8ed85cb2f42&scene=21#wechat_redirect)  
  
  
### 电报讨论  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/qq5rfBadR3ibvNluUKZ6RPy7h2fbYibRbLQDHPFqj89KkFsXBRibx5YTLiaTUfFOy9PKicps3l56iazUPNQrwdhkZ7jA/640?wx_fmt=png&from=appmsg "")  
  
****  
  
  
  
  
