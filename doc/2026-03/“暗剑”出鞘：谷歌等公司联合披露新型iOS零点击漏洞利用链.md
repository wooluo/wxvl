#  “暗剑”出鞘：谷歌等公司联合披露新型iOS零点击漏洞利用链  
原创 奇安侦察兵
                    奇安侦察兵  奇安网情局   2026-03-19 08:06  
  
**编者按**  
  
  
美国谷歌、iVerify及Lookout公司3月18日分别发布研究报告，联合披露名为“暗剑”（DarkSword）的恶意漏洞利用链。该攻击链针对苹果iOS系统（主要影响18.4-18.7版本），利用6个漏洞组合，可在极少的用户交互下完全控制设备，并已被多个具有国家背景的威胁行为体和商业监控软件供应商所使用。  
  
  
DarkSword是一个完全基于JavaScript编写的iOS完整漏洞利用链和有效载荷，主要通过在受信任的合法网站上嵌入恶意内联框架进行水坑攻击。DarkSword利用6个漏洞组成完整攻击链，最终以内核权限完全攻陷iOS设备。其中，在初始阶段，利用WebContent进程中的即时编译漏洞CVE-2025-31277和CVE-2025-43529，获取任意内存读写原语；在代码执行阶段，利用CVE-2026-20700漏洞绕过可信路径只读和指针身份验证码保护，实现任意代码执行；在沙箱逃逸阶段，利用越界写入漏洞CVE-2025-14174并结合指针身份验证码绕过技术，突破Safari沙箱；在内核提权阶段，利用写时复制漏洞CVE-2025-43510攻击mediaplaybackd守护进程，获得任意内存读写能力。  
  
  
DarkSword已经被多个威胁行为体使用，并部署了“幽灵刀”、“幽灵剑”和“幽灵刃”等三个不同的恶意软件家族。其中，威胁集群UNC6748被观察到利用“幽灵刀”攻击沙特阿拉伯目标；土耳其商业监控设备供应商PARS Defense被观察到利用“幽灵剑”攻击了土耳其和马来西亚目标；疑似俄罗斯间谍组织UNC6353被观察到利用“幽灵刃”攻击乌克兰目标。“幽灵刀”使用JavaScript编写，通过HTTP使用自定义二进制协议与其命令和控制服务器通信，可窃取账户、消息、浏览器数据、位置、录音等数据，支持下载文件、截屏、录制麦克风，配置可更新；“幽灵剑”是一款JavaScript后门程序，通过HTTP(S)与命令和控制服务器通信，功能包括设备和账户枚举、文件列表、数据窃取以及任意JavaScript代码执行，样本中包含未完成的命令（如录音、获取地理位置）；“幽灵刃”是一款用JavaScript编写的数据挖掘程序，能够从受感染的设备中收集并窃取各种数据，通过HTTP(S)协议将窃取数据传输至攻击者控制的服务器，功能较弱，不支持任何额外的模块或类似后门的功能且不会持续运行。  
  
  
DarkSword旨在快速完成一次性数据收集和窃取，而非长期持续监控，采取“打完就跑”攻击策略，在设备上的停留时间仅为几秒钟至最多几分钟，攻击完成后会主动删除在设备文件系统中创建的所有文件并退出。DarkSword窃取的数据范围极广，包括：已保存的密码；照片（包括屏幕截图和隐藏的图像文件）；WhatsApp和Telegram数据库；加密货币钱包（Coinbase、Binance、Ledger等）；短信；手机通讯录；通话记录；位置历史记录；浏览器历史记录；Cookie信息；Wi-Fi历史记录和密码；苹果健康数据；日历；笔记；已安装的应用程序；已关联账户。  
  
  
谷歌、iVerify和Lookout公司评估认为，DarkSword接近零点击攻击，比基于应用的恶意软件或社交工程攻击更强大、更隐蔽；一旦设备被成功入侵，恶意软件几乎可以不受限制地访问用户的数字足迹，对用户的工作和私人数据都可能造成毁灭性影响；DarkSword和Coruna攻击均针对iPhone用户，两者合并后可能影响全球数亿台运行iOS 13至18.6.2版本且未打补丁的设备；DarkSword和Coruna攻击存在扩散风险，其他威胁组织和犯罪分子也可能会获取并利用相关漏洞利用程序，或以此为蓝图开发更复杂或新型攻击；传统认知上，只有国家支持的组织及为执法/情报机构开发工具的公司才能掌握此类复杂且昂贵的漏洞利用工具包，但DarkSword和Coruna事件表明，资源有限、动机非高度定向间谍的组织可以通过漏洞利用程序二手市场获得顶尖漏洞利用程序，并将其用于攻击移动设备用户。  
  
  
奇安网情局编译有关情况，供读者参考。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhULEcZj3IQX5TUJAHhFibhQQOtcjHEMXKicVnJV6wvzqGhmvPGYQbZ1KtDND1915D1xxp9qXgYI8eMqXl4ICLUyVSUc0ap8YbBOM/640?wx_fmt=png&from=appmsg "")  
  
  
美国谷歌公司和移动威胁狩猎公司iVerify、云安全公司Lookout合作开展了一项研究，并于3月18日分别发布研究报告曝光称，商业监控厂商和疑似国家支持的黑客组织在不同的攻击活动中使用了名为“暗剑”（DarkSword）漏洞利用链，针对沙特阿拉伯、土耳其、马来西亚和乌克兰等国目标开展网络攻击。  
  
  
此前，谷歌公司和iVerify于3月3日发布报告，公布了功能强大的漏洞利用工具包Coruna的详细信息。该工具包针对iOS 13到17.2.1中的23个漏洞，其中包括近12个零日漏洞。Coruna被认定为首个针对iOS设备的大规模漏洞利用工具包，名为UNC6353的俄罗斯国家支持的间谍组织曾利用它对乌克兰发动水坑攻击，后来由于其加密货币窃取功能，被一些以经济利益为目的的组织所利用。  
  
  
最新曝光DarkSword针对苹果移动平台中的6个漏洞，只需极少的用户交互即可完全控制设备。DarkSword与Coruna共享基础设施，并被用于对乌克兰进行水坑攻击，表明它们是同一威胁行为体武器库的一部分。  
  
  
  
  
**完整的漏洞利用链**  
  
  
  
  
  
DarkSword利用6个不同的漏洞完全攻陷易受攻击的iOS设备，并以完整的内核权限运行最终有效载荷。与Coruna不同，DarkSword仅支持有限的iOS版本（18.4-18.7），并且虽然各个攻击阶段的技术较为复杂，但其用于加载漏洞利用程序的机制比Coruna更基础、更不稳健。  
  
  
与Coruna不同，DarkSword在漏洞利用链的所有阶段以及最终有效载荷中都使用纯JavaScript。虽然在JavaScript与漏洞利用中使用的原生API和进程间通信（IPC）通道之间建立桥接需要更复杂的技术，但它的使用避免了识别绕过iOS页面保护层（PPL）或安全页表监视器（SPTM）漏洞的必要性，这些漏洞原本可以阻止执行未签名的二进制代码。  
  
  
具体的目标漏洞包括CVE-2025-31277、CVE-2025-43529、CVE-2025-14174、CVE-2025-43510、CVE-2025-43520和CVE-2026-20700。  
  
  
CVE-2025-31277和CVE-2025-43529是WebContent进程的两个“即时编译”（JIT）漏洞，会导致任意内存读/写原语，DarkSword在攻击的初始阶段会利用这些问题。  
  
  
然后，DarkSword继续针对CVE-2026-20700，该漏洞可绕过可信路径只读（TPRO）和指针身份验证码（PAC）保护并执行任意代码。该漏洞已于2026年2月份作为零日漏洞被修复。  
  
  
接下来，该攻击链利用了CVE-2025-14174，即ANGLE库中的一个越界写入漏洞，并结合PAC绕过技术，通过GPU进程绕过Safari的沙箱机制。CVE-2025-43529和CVE-2025-14174已于2025年12月被修复。  
  
  
从GPU进程开始，该攻击利用CVE-2025-43510攻击XNU内核。CVE-2025-43510是一个写时复制漏洞，它允许mediaplaybackd守护进程进行任意内存读/写操作，然后利用这些操作来利用CVE-2025-43520进行内核权限提升。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhUokwJOyVW98anj4B9IT255NwQobyMFlSDR8OVic3YiaKE6aYYVVbSO1y08GPlmdBSwLaC3xdIricG5fqIDXGq2fAsn2X8fXxsgcA/640?wx_fmt=png&from=appmsg "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhUglajOM5pKsuKMYfyesxDSMV8I0SeNMEHO2uB5xSic3TRicKDw9Ok3nncw6BQeKNIARX136iacaBAic6pV2lztkktSm2BrxdVN9QY/640?wx_fmt=png&from=appmsg "")  
  
  
  
  
**“暗剑攻击”三大恶意软件家族**  
  
  
  
  
  
谷歌威胁情报小组指出称，DarkSword至少从2025年11月起就被多个威胁行为者使用，他们部署了三个不同的恶意软件家族：  
  
- **“幽灵刀”（GHOSTKNIFE）**  
。GHOSTKNIFE使用JavaScript编写，包含多个模块，用于窃取不同类型的数据，包括已登录账户、消息、浏览器数据、位置历史记录和录音。它还支持从C2服务器下载文件、截屏以及录制设备麦克风的音频。GHOSTKNIFE通过HTTP使用自定义二进制协议与其C2服务器通信，该协议采用基于ECDH和AES的加密方案。GHOSTKNIFE可以从其C2服务器获取新的参数来更新其配置。  
  
  
- **“幽灵剑”（GHOSTSABER）**  
。GHOSTSABER是一款JavaScript后门程序，通过HTTP(S)与其C2服务器通信。其功能包括设备和账户枚举、文件列表、数据窃取以及执行任意JavaScript代码。已发现的GHOSTSABER样本包含对多个命令的引用，但这些命令缺少执行所需的代码，其中包括一些声称可以从设备麦克风录制音频并将设备当前地理位置发送到C2服务器的命令。  
  
  
- **“幽灵刃”（GHOSTBLADE）**  
。GHOSTBLADE是一款用JavaScript编写的数据挖掘程序，能够从受感染的设备中收集并窃取各种数据。GHOSTBLADE收集的数据通过HTTP(S)协议被窃取到攻击者控制的服务器。与GHOSTKNIFE和GHOSTSABER不同，GHOSTBLADE的功能较弱，不支持任何额外的模块或类似后门的功能；它也不会持续运行。然而，与GHOSTKNIFE类似，GHOSTBLADE也包含用于删除崩溃报告的代码，但其目标目录与GHOSTKNIFE不同。  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhWYx1MN8txMRLNOplc8HEibsBmYcMb6QjRMSCiaiblJBFltafSY7BPGtCxk4VAcBNeG42JQd0dMKVRmZjHJSn4zBANtiaXjJMzYKFg/640?wx_fmt=png&from=appmsg "")  
  
  
2025年11月初，谷歌威胁情报小组发现威胁集群UNC6748利用一个以Snapchat为主题的网站（snapshare.chat）攻击沙特阿拉伯用户。该网站的登录页面包含一段使用多种混淆技术的JavaScript代码，并创建了一个新的IFrame，该IFrame会从另一个资源中获取信息。登录页面的JavaScript代码还会设置一个名为uid的会话存储键，并在创建用于获取下一阶段信息的IFrame之前检查该键是否已被设置。谷歌威胁情报小组在2025年11月多次观察到UNC6748的活动，其感染过程既有重大更新也有细微更新。根据谷歌威胁情报小组的观察，UNC6748使用了相同的沙箱逃逸和权限提升模块，以及相同的最终有效载荷“幽灵刀”（GHOSTKNIFE）。  
  
  
2025年11月下旬，谷歌威胁情报小组观察到与土耳其商业监控设备供应商PARS Defense相关的活动，该活动在土耳其境内使用了DarkSword漏洞利用程序，支持iOS 18.4-18.7版本。与UNC6748活动不同，此次攻击活动更加注重操作安全，对漏洞利用加载器和部分漏洞利用阶段进行了混淆处理，并使用ECDH和AES加密服务器与受害者间的漏洞利用程序。2026年1月，谷歌威胁情报小组观察到马来西亚存在与另一家PARS Defense客户相关的其他活动。谷歌威胁情报小组收集到了该活动中使用的不同加载器，该加载器包含额外的设备指纹识别逻辑，并且还使用了会话存储检查。与UNC6748一样，该加载器也对未通过所有检查的目标uid使用重定向，但同时将其设置为相同的URL。谷歌威胁情报小组识别出了上述活动中使用的不同的最终有效载荷，即名为“幽灵剑”（GHOSTSABER）的后门。  
  
  
谷歌威胁情报小组还观察到疑似俄罗斯间谍组织UNC6353利用DarkSword发起针对乌克兰用户的新型水坑攻击活动。此次新活动持续到2026年3月，但至少可以追溯到2025年12月，该活动利用DarkSword漏洞链部署名为“幽灵刃”（GHOSTBLADE）的恶意软件。UNC6353对DarkSword的使用仅支持iOS 18.4-18.6。  
  
  
  
  
**强大的信息窃取能力**  
  
  
  
  
  
除只需一键即可利用的DarkSword漏洞利用工具包外，iVerify公司还发现了一个Safari漏洞利用程序，该程序具有“沙箱逃逸、权限提升和内存植入”功能，可以从设备中窃取敏感数据。  
  
  
DarkSword攻击始于Safari浏览器，利用多种漏洞获取内核读/写权限，然后通过主编排器组件（pe_main.js）执行代码。  
  
  
目前尚不清楚发起这些攻击的网站最初是如何被入侵的，但攻击者拥有足够的权限，可以在这些网站的HTML代码中植入恶意iframe。  
  
  
该编排器将JavaScript引擎注入到享有特权的iOS服务（例如App Access、Wi-Fi、Springboard、Keychain和iCloud）中，然后激活数据窃取模块（例如GHOSTBLADE），这些模块会收集以下信息：  
  
- 已保存的密码  
  
  
- 照片，包括屏幕截图和隐藏的图像文件  
  
  
- WhatsApp和Telegram数据库  
  
  
- 加密货币钱包（Coinbase、Binance、Ledger等）  
  
  
- 短信（SMS）  
  
  
- 手机通讯录  
  
  
- 通话记录  
  
  
- 位置历史记录  
  
  
- 浏览器历史记录  
  
  
- Cookie信息  
  
  
- Wi-Fi历史记录和密码  
  
  
- 苹果健康数据  
  
  
- 日历  
  
  
- 笔记  
  
  
- 已安装的应用程序  
  
  
- 已关联账户  
  
  
值得注意的是，DarkSword似乎采用了“打完就跑”（hit-and-run）的攻击方式，在几秒钟或最多几分钟内即可从设备中收集并窃取目标数据，随后进行清理。与之前报道的许多其他针对移动设备的复杂攻击案例不同，DarkSword并非旨在进行持续监控。一旦完成目标数据的收集和窃取，它就会删除在设备文件系统中创建的文件并退出。它在设备上的停留时间可能只有几分钟，具体取决于它发现和窃取的数据量，表明其并非为长期监视操作而设计。  
  
  
Lookout公司指出：“这款恶意软件非常复杂，似乎是一个专业设计的平台，它可以通过访问高级编程语言来快速开发模块。这一额外步骤表明，该恶意软件的开发投入了大量精力，并考虑到了可维护性、长期发展和可扩展性。”该公司还指出，DarkSword的加密货币攻击能力表明，UNC6353可能已将其攻击能力扩展到金融盗窃领域，或者它从一开始就是一个以经济利益为目的的威胁行为者。  
  
  
  
  
**未来风险评估**  
  
  
  
  
  
谷歌威胁情报小组评估称，DarkSword和Coruna被各种行为者使用，表明不同地域和动机的行为者之间持续存在利用漏洞扩散的风险。  
  
  
iVerify公司评估称，根据手机市场分析数据，估计DarkSword漏洞利用链仍然影响着相当一部分iPhone用户，运行18.4到18.6.2至iOS版本的用户中约有14.2%（约2.2152亿台设备）被认为存在漏洞；假设所有iOS 18版本都易受此漏洞链中大部分漏洞的影响，大约17.3%的用户（2.7亿）可能受到影响；一个月内，攻击者第二次利用水坑攻击瞄准iPhone用户，且两次攻击都不是单独针对特定目标的；目前，这两次攻击合并后可能影响数亿台运行iOS 13至18.6.2版本且未打补丁的设备；两次攻击中，攻击工具的发现都源于严重的运维安全漏洞和iOS攻击手段部署上的疏忽；其他威胁组织和犯罪分子也能够获取这些漏洞利用程序，它们可能会被重复利用，或成为开发更复杂或新型攻击的蓝图。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhVibV2NV0mYbN26tVOf1QmBJ5dfWJoD7Hu7dJN4BJGfqQicUxrmrIiaKQRUXfaXTWbVUO5nug0ZMprGxteZjibdDiaK7xdGiak33gIEo/640?wx_fmt=png&from=appmsg "")  
  
  
Lookout公司报告评估称，DarkSword攻击比基于应用程序的恶意软件或针对智能手机用户的社交工程攻击更强大、更隐蔽；利用被入侵的合法网站发起的“水坑攻击”几乎（即使并非严格意义上的）是零点击攻击，因为目标受害者可能本来就会访问恶意网站；即使需要诱骗用户访问该网站，社交工程防御培训也无效，因为感染网址是合法的；一旦设备被成功入侵，恶意软件几乎可以不受限制地访问用户的数字足迹，对用户的工作和私人数据都可能造成毁灭性的影响；此类复杂且被认为极其昂贵的漏洞利用工具包，通常被认为是只有国家支持的组织以及为执法和情报机构开发工具的公司才能掌握的技术；但DarkSword以及之前的Coruna事件表明，此类漏洞利用程序存在二手市场，使得资源有限且动机并非高度定向间谍活动的组织也能获得顶尖的漏洞利用程序，并将其用于攻击移动设备用户。  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhX1jGdflH9xeNrnC2vYyWovWxfQBv1oOBwwEAVxzTC5zQfpg4cG8yyv4ibuaRjWkicfDjNKbiaiaSRwShauhaqGe8ULbINu3rZwcxs/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhUg4BdRwDick3JNgxYLWVibzic8iaN9OFreaQql5ChHsibneeIBPZsAv8AOvlJFOYuB02yuO73YvJsrJjV42tib2BUBYGTLbgHW24Ac4/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhXQBA7ePh7S76OPmWrpZZIp9JBjribsyDtZwuf2J5UdzNc6VRd4WJaKtNSMRgCZo4cD4faI9zhFhGnj8OdYpD8tVOMImeItiatQk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhVbvHPMRibC367v3qbdPE5QhSzgI5JoVoXia5icbc75WNpicfQU0eD7415jWME7Og2GXoXUiaf1zuzXuoBTCUPXg3t9ewJD6p0ZIwEM/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhWw3vicib9IHBfuDG8oxfhf1uicqDUicicqRkrdiarlJArgXRFWHGNao3cVWzTlAon5KAZpO9D2qHGDTPvGCIPFwuTMibmoUT59aYZcU8/640?wx_fmt=png&from=appmsg "")  
  
  
未经本公众号主体允许，  
不得利用本公众号原创内容开展商业营利行为  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhVTNc2HIYovF7wQQZcYGYmLvLY4oj7Nwlx88Hcgu6uO5sBfweCUvczxh98OY8eb7DkZysHQ8lic3Mwicg3kLITzOtgplVh0HAzJ0/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhXz1dHFQbal49Xm4YVmEic4ExYzIDzYlv9ibALuVIGLAHMJwZSUlH9OVFNl29zeCMdlnFDXM7Tc7iaAbfcgTLNwB9xbNRb61h7wXY/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/0SLhkeQQqhXnfrz9O5QHlEvw4RBAL9DeoG34svhibp37liaZY74CM2dYCY5Le9RtyibYTdTMZdsYCCxCIEHiacNg3TRKRELyzBK0A1qgTIBnLgI/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhXfpwwpct90ic2iaoJfg5bKYDGtlznheZnGibWgbNUhdOt7D4jicicQgRYAUQWIolfLyOPicjBRAyH6pyTQFXxUl3X39sSO1ZQ20Yy5M/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/0SLhkeQQqhW6lIY30Lan5E5f6yicqKyP3eXGz7iajNL6UFGNuHy1ldYD9DRwWIa4Y8pJe6wxPia9Fg9Kibia6ibpc83neLvxfnR8le2hgxzF8tFXM/640?wx_fmt=png&from=appmsg "")  
  
  
网络国防知识库  
  
产业发展前哨站  
  
开源情报信息源  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/0SLhkeQQqhXaql1ibmkroGiaKmkU8dtUobBfERlaQW7WfnnjeuxTgCtT39egZ0dRNZ48W0ZjaEZej6qvbcC1p2YzibhuIoss9iaLBUevTAUC1xo/640?wx_fmt=jpeg&from=appmsg "")  
  
  
奇安网情局  
  
