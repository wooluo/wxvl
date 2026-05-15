#  CVSS 10.0 满分恐怖！React2Shell 漏洞爆发，全球数千万网站面临 RCE 威胁  
原创 爱坤
                    爱坤  爱坤sec   2026-05-14 18:30  
  
# 一 漏洞描述  
  
CVE-2025-55182 是一个严重的远程代码执行 (RCE) 漏洞，影响多个软件包中的 React 服务器组件 (RSC) 实现，其中包括：react-server-dom-webpackreact-server-dom-turbopackreact-server-dom-parcel  
  
该漏洞源于RSC使用的内部Flight协议对有效载荷进行不安全的反序列化。当某些不受信任的输入通过HTTP请求流经React服务器组件时，可能会触发服务器端代码执行。  
  
CVSS 评分 10.0  
# 二 影响版本  
```
React Server Components：19.0.0、19.1.0、19.1.1、19.2.0
Next.js：15.0.0-15.0.4、15.1.0-15.1.8、15.2.0-15.2.5、15.3.0-15.3.5、15.4.0-15.4.7、16.0.0-16.0.6
```  
# 三 搜索语法  
```
app="NEXT.JS" || app="React.js"
```  
# 四 影响范围  
  
资产很广  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/uqtLGQlJSxUia6e4MibxCa88RCk4I6fe6qe5K1TcGBR4xCKgp4tQJd0CCoSswxkWvUTV5UcXcwGxibZT7b6var70QEyKnysI02z0BzNI4ukdZE/640?wx_fmt=png&from=appmsg "")  
  
五 工具获取  
```
https://github.com/assetnote/react2shell-scanner
```  
  
  
【严重声明】本文所涉及的工具、思路和操作手法仅用于本地安全测试以及教育目的，禁止将其用于非法入侵或对他人的系统进行攻击以及盈利，一切后果由操作者自行承担！！！下载后的24小时请删除。  
  
更多精彩文章与工具分享 欢迎关注  
  
