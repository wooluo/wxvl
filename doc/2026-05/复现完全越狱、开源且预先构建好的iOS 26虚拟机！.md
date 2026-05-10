#  复现完全越狱、开源且预先构建好的iOS 26虚拟机！  
原创 bl0ckdev
                    bl0ckdev  Esn技术社区   2026-05-09 15:23  
  
本文目的回应之前这篇文章的后续：  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/icfnkibn16VejmOx92RA9KZz3RoLicAbdyLtsZsPXDS6W01TBDOMqrT4nAqRTKWCQewztKAFRhYWPgnfa4RibgEwQgSiaLMyvwOdaHaF1jsjybyI/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0 "")  
  
[有人发布了一个完全越狱、开源且预先构建好的iOS 26虚拟机！](https://mp.weixin.qq.com/s?__biz=MzU5Njg5NzUzMw==&mid=2247492543&idx=1&sn=843851f2b025245b5eddc57e64b8cb87&scene=21#wechat_redirect)  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/icfnkibn16Vej0SWNLEicqibm8SicgoIHytE8Fl1pgNCy6ZmRJNWJCJd8uuK4bgCVzpU97HM8AiaQw9gPxt60rFokQJzxiaXPUGbaORdocQ4mYjibD0/640?wx_fmt=png&from=appmsg "")  
  
  
已测试环境 / 适配测试环境  
<table><tbody><tr><td data-colwidth="191"><section><span leaf="">主机</span></section></td><td data-colwidth="191"><section><span leaf="">苹果手机</span></section></td><td data-colwidth="191"><section><span leaf="">云操作系统</span></section></td></tr><tr><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Mona Sans VF&#34;, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, &#34;Noto Sans&#34;, Helvetica, Arial, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">Mac16,12 26.3</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">17,3_26.1_23B85</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">26.1-23B85</span></span></section></td></tr><tr><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Mona Sans VF&#34;, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, &#34;Noto Sans&#34;, Helvetica, Arial, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(246, 248, 250);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">Mac16,12 26.3</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">17,3_26.3_23D127</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">26.1-23B85</span></span></section></td></tr><tr><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Mona Sans VF&#34;, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, &#34;Noto Sans&#34;, Helvetica, Arial, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">Mac16,12 26.3</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">17,3_26.3_23D127</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">26.3-23D128</span></span></section></td></tr><tr><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Mona Sans VF&#34;, -apple-system, BlinkMacSystemFont, &#34;Segoe UI&#34;, &#34;Noto Sans&#34;, Helvetica, Arial, sans-serif, &#34;Apple Color Emoji&#34;, &#34;Segoe UI Emoji&#34;;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(246, 248, 250);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">Mac16,12 26.3</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">17,3_26.3.1_23D8133</span></span></section></td><td data-colwidth="191"><section><span style="color: rgb(31, 35, 40);font-family: &#34;Monaspace Neon&#34;, ui-monospace, SFMono-Regular, &#34;SF Mono&#34;, Menlo, Consolas, &#34;Liberation Mono&#34;, monospace;font-size: 13.6px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: normal;orphans: 2;text-align: start;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;white-space: break-spaces;background-color: rgba(129, 139, 152, 0.12);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">26.3-23D128</span></span></section></td></tr></tbody></table>  
请使用Mac进行复现。  
  
  
复现的常见问题：  
  
> 首先，请务必git pull确保您已安装最新版本。  
  
  
问：我zsh: killed ./vphone-cli在尝试运行它时遇到问题。  
AMFI/调试限制未正确绕过。请选择一种设置路径：  
  
**选项 1（完全禁用 AMFI）：**  
```
sudo nvram boot-args="amfi_get_out_of_my_way=1 -v"
```  
- **选项 2（仅限调试限制）：** 使用恢复模式csrutil enable --without debug（不完全禁用 SIP），然后安装/加载amfidont，或者amfree保持 AMFI 启用状态。对于此仓库，make amfidont_allow_vphone打包所需的编码路径和 CDHash 允许列表启动（如果使用 amfidont）。  
  
**问：make boot/make boot_dfu开始运行，然后失败，VZErrorDomain Code=2 "Virtualization is not available on this hardware."**  
  
主机本身运行在 Apple 虚拟机内，因此嵌套的 Virtualization.framework 客户机启动方式不可用。请改在非嵌套的 macOS 15+ 主机上运行启动流程。make boot_host_preflight这将显示为 Model Name: Apple Virtual Machine 1“使用kern.hv_vmm_present=1. make boot/make boot_dfu现在在尝试在该类型的主机上启动虚拟机之前快速失败” boot_binary_check。  
  
**问：系统应用（App Store、信息等）无法下载或安装。**  
  
在 iOS 设置过程中，请勿**选择**日本**或**欧盟**作为**您的地区。这些地区会强制执行额外的监管检查（例如，侧载披露、相机快门要求），而虚拟机无法满足这些检查，从而导致系统应用无法下载和安装。请选择其他地区（例如，美国）以避免此问题。  
  
**问：我卡在“按主屏幕继续”的界面了。**  
  
通过 VNC 连接（vnc://127.0.0.1:5901），然后在屏幕任意位置单击鼠标右键（Mac 触控板上双指点击）。这样可以模拟按下 Home 键。  
  
**问：我如何获得SSH访问权限？**  
  
通过 Sileo 安装（越狱版本首次启动后可用）。openssh-server  
  
**问：安装了openssh-server后SSH无法使用。**  
  
重启虚拟机。SSH服务器将在下一次启动时自动启动。  
  
**问：我可以安装.tipa文件吗？**  
  
是的。安装菜单支持这两个和包。可以拖放或使用文件选择器。.ipa.tipa  
  
**问：我可以更新到更新的iOS版本吗？**  
  
是的。用你想要的版本的IPSW URL覆盖：fw_prepare  
```
export IPHONE_SOURCE=/path/to/some_os.ipsw
export CLOUDOS_SOURCE=/path/to/some_os.ipsw
make fw_prepare
make fw_patch
```  
  
我们的补丁是通过二进制分析应用的，而不是静态偏移，所以新版本应该可以正常使用。如果出现故障，向AI求助。  
  
**问：我用过restore_offline，现在卡在设置界面了**  
  
设备正在尝试联系苹果进行设置，如果你用的是 。 你可以通过让设备被监督，绕过大部分设置界面：restore_offline  
```
python3 -m pymobiledevice3 profile supervise vphone
```  
  
****  
自动化：  
  
vphone-CLI 提供了一个主机控制套接字（），用于程序化虚拟机交互——截图、触控注入、滑动手势、硬件键和剪贴板。每个操作都会内嵌返回紧凑的灰阶截图，支持AI驱动的端对端测试工作流程。vm/vphone.sock  
  
参见vphone-mcp，这是一个MCP服务器，它用高级工具（按名称打开应用、返回导航、滚动、输入文本）包裹该套接字，这些工具可从Claude Code或Claude Desktop中使用。  
  
vphone-mcp：  
  
https://github.com/pluginslab/vphone-mcp  
  
![图片](https://mmbiz.qpic.cn/mmbiz_png/icfnkibn16VegIdRPEkA1qb3Yy4d1ksiaxBRoa3dN3XuO7QoUOD8nBB36p73yMibsTCFh6ByvhdNxRWvaaoFTvzibuF3xRsKWQqteDTNhZb5Pxpo/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2 "")  
  
仓库地址：  
  
https://github.com/EsnBl0ckdev/vphone-cli  
  
  
