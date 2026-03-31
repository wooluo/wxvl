#  Telegram 惊曝零日漏洞争议：发个贴纸就能控制手机？官方却全盘否认  
看雪学苑
                    看雪学苑  看雪学苑   2026-03-31 10:08  
  
最近，全球知名加密通讯软件Telegram被爆出一个可能影响数亿用户的零日漏洞，但戏剧性的是，Telegram官方对此全盘否认，称所谓漏洞根本不存在。这一消息在网络安全圈引发轩然大波，也让普通用户忧心忡忡。  
  
  
据网络安全公司TrendAI Zero Day的研究员Michael DePlante（推特账号@izobashi）通过零日漏洞披露平台ZDI发布的信息，这个编号为ZDI-CAN-30207的漏洞危险等级高达9.8分（满分10分），属于最严重级别。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/Cpo2XCpI7K0BshfMtrj92N1P6NwcvxtXmtAg4n54QU05GhW3J1J6I7SX9q0GrkoNqssQ8A3SWXGJO59XeCgwU716r0rxoVvqLLg5FEZGVYA/640?wx_fmt=png&from=appmsg "")  
  
  
**无需点击，发个贴纸就能控制设备**  
  
攻击者不需要用户做任何操作，只要给你发送一个看似普通的  
动画贴纸  
，就能  
远程执行恶意代码，完全控制你的设备。  
  
  
原理很简单：Telegram会自动处理收到的媒体文件来生成预览图，而这个漏洞就藏在媒体处理机制中。攻击者可以精心构造一个恶意动画贴纸，当Telegram客户端自动生成预览时，就会触发漏洞，让攻击者获得设备的完全控制权。  
  
  
该漏洞据称影响  
Android和Linux系统  
的Telegram客户端，一旦被利用，攻击者可以：  
  
- 读取你所有聊天记录和个人信息  
  
- 控制摄像头、麦克风进行窃听  
  
- 窃取银行卡、密码等敏感数据  
  
- 植入恶意软件，将设备变成"肉鸡"  
  
  
目前  
没有任何官方补丁  
可以修复这个漏洞，用户只能被动等待解决方案。  
  
  
**Telegram官方：漏洞不存在**  
  
面对这一严重安全警报，Telegram官方却给出了完全相反的回应。意大利国家网络安全局（ACN）在最新公告中透露，Telegram已正式否认该漏洞的存在。  
  
  
Telegram的理由很充分：  
所有上传到平台的贴纸都会经过服务器端的强制验证，只有通过安全检查的贴纸才会被分发给用户客户端。  
这种集中式过滤机制从根源上阻止了恶意贴纸成为攻击载体，因此通过贴纸执行代码在技术上根本不可能。  
  
  
"每一个贴纸在分发前都要经过我们服务器的严格审查，恶意文件根本没有机会到达用户设备，"Telegram官方表示。  
  
  
**ZDI：7月24日前不公开细节**  
  
负责披露这一漏洞的零日漏洞披露平台ZDI表示，为了给Telegram足够的时间修复问题，他们  
不会在2026年7月24日之前公开漏洞的技术细节。  
  
  
这是网络安全行业的常见做法，目的是避免漏洞信息过早泄露，被黑客利用攻击用户。目前尚不清楚是否已有黑客在野外利用该漏洞发起攻击。  
  
  
**普通用户该怎么办？**  
  
虽然事件存在争议，但安全专家建议用户采取以下措施降低风险：  
  
1. Telegram Business用户专属：在设置→隐私和安全→消息中，将消息接收权限限制为"仅保存的联系人"或"仅高级用户"，减少陌生消息接触风险。  
  
  
2. 所有用户通用：  
  
   - 暂时谨慎接收和打开陌生人发送的动画贴纸  
  
   - 及时更新Telegram客户端到最新版本  
  
   - 对异常消息保持警惕，不轻易点击可疑链接或下载未知文件  
  
   - 重要账号开启双重验证，保护敏感信息  
  
  
3. 漏洞市场价值惊人：这类针对热门平台的零日漏洞  
在地下市场价值数百万甚至上千万美元，黑客组织往往会迅速将其武器化，发动大规模攻击。  
  
  
目前，事件仍在持续发酵。ZDI坚持认为漏洞真实存在，而Telegram则坚称自身系统安全无虞。我们将持续关注事件进展，一旦有官方补丁发布或更多细节披露，会第一时间通知大家。  
  
  
  
资讯来源：本文根据Zero Day Initiative(ZDI)漏洞披露、意大利国家网络安全局(ACN)公告及相关网络安全报道综合整理  
  
  
  
﹀  
  
﹀  
  
﹀  
  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/Uia4617poZXP96fGaMPXib13V1bJ52yHq9ycD9Zv3WhiaRb2rKV6wghrNa4VyFR2wibBVNfZt3M5IuUiauQGHvxhQrA/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/1UG7KPNHN8Fjcl6q2ORwibt8PXPU5bLibE1yC1VFg5b1Fw8RncvZh2CWWiazpL6gPXp0lXED2x1ODLVNicsagibuxRw/640?wx_fmt=gif&from=appmsg "")  
  
**球分享**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/1UG7KPNHN8Fjcl6q2ORwibt8PXPU5bLibE1yC1VFg5b1Fw8RncvZh2CWWiazpL6gPXp0lXED2x1ODLVNicsagibuxRw/640?wx_fmt=gif&from=appmsg "")  
  
**球点赞**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/1UG7KPNHN8Fjcl6q2ORwibt8PXPU5bLibE1yC1VFg5b1Fw8RncvZh2CWWiazpL6gPXp0lXED2x1ODLVNicsagibuxRw/640?wx_fmt=gif&from=appmsg "")  
  
**球在看**  
  
