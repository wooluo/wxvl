#  一个存在21年没有CVE的漏洞：影响 PHP 自5.1至8.5.6全版本  
原创 360漏洞研究院
                    360漏洞研究院  360漏洞研究院   2026-05-11 03:05  
  
2026年5月，一个在PHP引擎中潜伏了21年的反序列化UAF漏洞被AI辅助发现。它影响PHP 5.1至8.5.6所有版本，却因官方一纸“非安全问题”的政策下，从未获得CVE编号。  
  
该漏洞并非传统应用层反序列化问题，而是Zend Engine反序列化状态机中的一致性缺陷。研究人员不仅完成了PHP 8.x上的远程代码执行，还在开启ASLR、disable_functions等防护条件下实现了稳定利用。更讽刺的是，在官方未公开发布修复说明的情况下，该漏洞已被集成到蚁剑插件，成为实战中的利器——CVE没有，威胁却在。  
  
这意味着：即使PHP经历了多轮引擎重构与二十余年的安全研究，unserialize()仍然是Zend Engine中最危险的攻击面之一。  
  
  
**基本信息**  
  
  
<table><tbody><tr style="box-sizing: border-box;"><td data-colwidth="26.0000%" width="26.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">漏洞编号</span></p></section></td><td data-colwidth="74.0000%" width="74.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">暂无CVE（PHP官方2017年政策调整后不再为unserialize内存损坏分配CVE）</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="26.0000%" width="26.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">漏洞类型</span></p></section></td><td data-colwidth="74.0000%" width="74.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">Use-After-Free / 远程代码执行（RCE）</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="26.0000%" width="26.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">影响版本</span></p></section></td><td data-colwidth="74.0000%" width="74.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">PHP 5.1 - 8.5.6（全版本）</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="26.0000%" width="26.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">危害等级</span></p></section></td><td data-colwidth="74.0000%" width="74.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">严重（Critical）</span></p></section></td></tr><tr style="box-sizing: border-box;"><td data-colwidth="26.0000%" width="26.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">披露状态</span></p></section></td><td data-colwidth="74.0000%" width="74.0000%" style="border-width: 1px;border-color: rgb(62, 62, 62);border-style: solid;box-sizing: border-box;padding: 0px;"><section style="padding: 0px 8px;box-sizing: border-box;"><p style="white-space: normal;margin: 0px;padding: 0px;box-sizing: border-box;"><span leaf="">已公开</span></p></section></td></tr></tbody></table>  
  
  
**漏洞概述**  
  
  
该漏洞源于Zend/zend_interfaces.c中zend_user_unserialize()函数的实现缺陷。  
  
在反序列化过程中，当解析器遇到实现了Serializable接口的类时，会调用该类的unserialize()方法执行自定义恢复逻辑。与其他用户代码钩子点（__wakeup、__unserialize、__destruct）不同，zend_user_unserialize()在调用用户方法前未递增BG(serialize_lock)计数器。  
  
BG(serialize_lock)是PHP反序列化流程中的状态计数器，其作用是在执行用户代码期间阻止嵌套unserialize()复用当前解析上下文。锁机制的缺失导致了一个确定性的状态共享：内层unserialize()继承外层var_hash，内层解析的对象属性被注册为外层表的条目。当内层对象属性表因扩容触发内存释放时，外层R:N反向引用指向已回收内存，形成use-after-free。  
  
从技术实现角度看，PHP的HashTable采用连续内存布局，对象属性底层以连续bucket数组存储，扩容时会整体迁移。漏洞场景中，内层stdClass对象的8个属性恰好填满初始容量的哈希表，第9次写入触发扩容，原缓冲区被释放。外层解析器对此释放操作无感知，后续反向引用解析时直接操作悬空指针。  
  
  
**漏洞触发机制**  
  
  
最小化的触发Gadget仅需一个语句：  
```
classCachedDataimplementsSerializable{
public function serialize(): string { return''; }
public function unserialize(string $data): void{
        unserialize($data)->x = 0;
    }}
```  
  
执行流程如下：外层解析器启动，var_hash登记顶层数组。解析CachedData时登记实例，进入zend_user_unserialize()，锁计数未增加，用户代码执行。内层解析器发现serialize_lock==0，复用外层var_hash，登记内层对象及其属性。Gadget执行属性写入触发扩容，原缓冲区释放，外层反向引用成为悬空指针。后续spray reclaim该内存后，解析器向可控位置写入数据，完成信息泄露。  
  
  
**原EXP复现与分析**  
  
  
为了验证漏洞利用条件，我们在PHP 8.5.6环境中复现了Calif公开的EXP。测试环境启用了ASLR与默认堆分配器，默认 php.ini 配置，disable_functions 默认空值，以尽可能接近真实部署场景。  
  
当解析实现Serializable接口的对象时，内层unserialize()会复用外层var_hash。随后，内层对象属性扩容触发HashTable重分配，原arData缓冲区被释放，而外层反向引用仍继续指向旧地址，最终形成UAF。整个过程无需竞态条件，触发具有稳定性。  
  
在实际复现中，可以观察到spray数据成功reclaim已释放的arData区域。随后，R:N反向引用解析阶段向可控区域写入zend_reference结构，EXP即可借此泄露堆地址。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzzicF2Y5up1NicMiaAng9Sq4wpJvRJMdicr8onxYLMDLa8MicvQrRE5BBBMemGNGAn8BwWEtzZ3j1ZJfichv61qFmXAB9xEubemF369dk/640?wx_fmt=png&from=appmsg "")  
  
在获得堆地址后，利用链继续构造任意地址读写能力，并逐步解析Zend运行时结构，包括closure_handlers、zend_ce_closure与executor_globals等关键对象。通过伪造zend_closure实现控制流劫持。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/dZ7ia5iaWFzzibOCQD8ib5QNg9VMlFWtAHfJyhdB5pTpgk6Ud5caks5N33rnq9exw6A37MbGKllWdjFnuZOWPX3via7cFOUTqFKPSw6RiczuYPMe4/640?wx_fmt=png&from=appmsg "")  
  
利用链通过伪造 zend_closure 对象直接调用 zif_system 的底层函数指针，攻击者从 var_dump 等未被禁用的函数溯源到 standard 模块的 zend_function_entry[] 静态入口数组，读取 system 的原始处理函数地址，从而绕过运行时 disable_functions 对函数表的补丁限制。因此 disable_functions 字符串黑名单对此类底层指针调用无效。  
  
远程利用需目标应用存在实现 Serializable 且内部递归调用 unserialize() 的类（如 PoC 中的 CachedData），实战中此类代码极为罕见；本地利用则无此前置条件，任何可执行 PHP 代码的环境均可触发。  
  
  
**安全趋势分析**  
  
  
从PHP unserialize漏洞的历史脉络看，这并非孤立事件。2007年Stefan Esser首次公开该类漏洞，2015-2016年Taoguang Chen以方法论化的方式批量发现SPL相关UAF，2016年Check Point在PHP 7新引擎中继续发现同类问题。数十个CVE的积累并未从根本上消除漏洞土壤。  
  
2017年PHP官方做出"Not a Security Issue"的政策调整，理由是"unserialize()不应接收不可信输入"。这一决策的直接影响是：后续同类漏洞不再分配CVE编号，修复优先级降低。然而现实情况是，PHP生态中大量框架的缓存、会话、消息队列机制均依赖unserialize()，开发者层面的完全规避并不具备可操作性。  
  
本次漏洞由Calif开发的AI辅助审计技能 /php-unserialize-audit 识别，该技能基于约20个历史漏洞通告训练，对PHP 5.6.40的回归测试成功复现了全部12个已知UAF漏洞。**这表明历史漏洞模式的结构化提取，本质上是将人类研究员的审计经验转化为可复用的搜索策略。AI在此处更像一种"漏洞模式放大器"，它并非凭空创造新的攻击面，而是将已知的攻击路径以更高的覆盖率和更低的遗漏率重新验证。**  
  
PHP 8.5.6 的 Serializable 路径能够命中，恰恰说明2015-2016年SPL UAF的修复是"打地鼠"式的局部修补——加固了具体调用点，却未审视整个状态机的设计一致性。这种修复模式在大型C代码库中极为常见：漏洞通告驱动补丁，补丁覆盖触发点，但架构层面的状态共享机制始终未被重构。  
  
无CVE编号意味着大多数漏洞扫描器与资产管理平台不会自动告警，企业安全团队极易遗漏。一个没有CVE的漏洞，比有CVE的更危险，因为你可能根本不会注意到它。当安全政策的藩篱高于技术事实，当官方声明成为攻击者的掩护，我们所依赖的漏洞管理体系，本身就是最大的“状态一致性缺陷”。  
  
  
**风险与修复建议**  
  
  
**风险场景**  
  
共享主机环境中，多个租户共享同一PHP-FPM进程池，单个租户的序列化入口被利用可能导致跨站点数据泄露。容器化部署下，PHP容器通常与数据库、缓存等内部服务处于同一网络平面，内部横向移动风险显著。供应链角度，部分构建系统使用PHP序列化传递配置，CI/CD管道中的攻击路径值得警惕。  
  
  
**修复建议**  
  
短期应在zend_user_unserialize()入口处补充BG(serialize_lock)++，与其他钩子点保持行为一致。中长期应避免使用Serializable接口，迁移至__serialize/__unserialize（PHP 7.4+已支持）。对必须保留的反序列化场景，优先使用unserialize($data, ['allowed_classes' => false])限制对象实例化能力，降低利用复杂度。同时评估以json_decode()、igbinary或msgpack替代原生unserialize()。  
  
  
**企业自查**  
  
扫描代码库中implements Serializable的使用，检查缓存、会话、消息队列组件的序列化后端配置。在WAF/IDS层拦截包含C:标识的序列化流，限制unserialize()输入长度。  
  
  
**参考来源**  
  
  
https://blog.calif.io/p/mad-bugs-finding-and-exploiting-a  
  
https://xz.aliyun.com/news/92079  
  
  
  
“扫描下方二维码，进入公众号粉丝交流群。更多一手网安资讯、漏洞预警、技术干货和技术交流等您参与！”  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/5nNKGRl7pFgrNicMticDTWVCUWbOwRuWcrYSpAlwDRibKNLbe3KialEfR0Y2PlPAvS4MN50asXETicAviaRy1gRicI2Dw/640?wx_fmt=gif&from=appmsg "")  
  
  
  
“洞”悉网络威胁，守护数字安全  
  
  
**关于我们**  
  
  
360 漏洞研究院，隶属于360数字安全集团。其成员常年入选谷歌、微软、华为等厂商的安全精英排行榜, 并获得谷歌、微软、苹果史上最高漏洞奖励。研究院是中国首个荣膺Pwnie Awards“史诗级成就奖”，并获得多个Pwnie Awards提名的组织。累计发现并协助修复谷歌、苹果、微软、华为、高通等全球顶级厂商CVE漏洞3000多个，收获诸多官方公开致谢。研究院也屡次受邀在BlackHat，Usenix Security，Defcon等极具影响力的工业安全峰会和顶级学术会议上分享研究成果，并多次斩获信创挑战赛、天府杯等顶级黑客大赛总冠军和单项冠军。研究院将凭借其在漏洞挖掘和安全攻防方面的强大技术实力，帮助各大企业厂商不断完善系统安全，为数字安全保驾护航，筑造数字时代的安全堡垒。  
  
  
