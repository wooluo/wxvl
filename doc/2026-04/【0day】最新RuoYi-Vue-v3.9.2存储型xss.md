#  【0day】最新RuoYi-Vue-v3.9.2存储型xss  
原创 wallkone
                    wallkone  星络安全实验室   2026-04-04 11:32  
  
<table><tbody><tr><td data-colwidth="576"><section><span style="color: rgba(0, 0, 0, 0.9);font-family: &#34;PingFang SC&#34;, system-ui, -apple-system, BlinkMacSystemFont, &#34;Helvetica Neue&#34;, &#34;Hiragino Sans GB&#34;, &#34;Microsoft YaHei UI&#34;, &#34;Microsoft YaHei&#34;, Arial, sans-serif;font-size: 16px;font-style: normal;font-variant-ligatures: normal;font-variant-caps: normal;font-weight: 400;letter-spacing: 0.544px;orphans: 2;text-align: justify;text-indent: 0px;text-transform: none;widows: 2;word-spacing: 0px;-webkit-text-stroke-width: 0px;background-color: rgb(255, 255, 255);text-decoration-thickness: initial;text-decoration-style: initial;text-decoration-color: initial;display: inline !important;float: none;" data-pm-slice="0 0 []"><span leaf="">免责声明:文章中涉及的漏洞均已修复，敏感信息均已做打码处理，文章仅做经验分享用途，未授权的攻击属于非法行为!文章中敏感信息均已做多层打码处理。传播、利用本文章所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责作者不为此承担任何责任，一旦造成后果请自行负责</span></span></section></td></tr></tbody></table>  
项目地址：https://gitee.com/y_project/RuoYi-Vue/  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2AAMh9HmvsTY2iaxZdN4MJI0wh0SrNnibqcNicTrOibF1OOXvQoibbwgah4ibYDb6YFW2G1NjyaKdERKK1NotCDqNHt6I7y5RZnRseq3DZtS2WgkA/640?wx_fmt=png&from=appmsg "")  
  
我们本地搭建好环境，通过账号密码登录后台  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/2AAMh9HmvsQ0Yx0RXWEOtMhxZa2HBib75aeCJibSicYSsk5mUHYSibX8QI9z8h8icpZfmBicpp4Jjwyn6ZpGuwddVf2eQV1vF2fydVCQ9xvddn5ow/640?wx_fmt=png&from=appmsg "")  
  
抓包，构造payload  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2AAMh9HmvsTWxAr4A9FTovGb2fEZkmdkMbYNAYkExVkWIfUZ7eqhFN2RhCI5e7micsqftEicQF3QnEEDheLqdvXRJb6D5805ibicQpReEib6AEQI/640?wx_fmt=png&from=appmsg "")  
  
我们去首页右  
上角铃铛哪里查看  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2AAMh9HmvsTGySkAGWeriaqy8zltbI214ltmHmwxgDwk55m4hibQEenQSHM7wJRtXYN6xTgDRSQEtlO3nA7fa8ZYqQTy4znK2OZmpvibFJVV9o/640?wx_fmt=png&from=appmsg "")  
  
点击公共，成功弹窗  
  
![](https://mmbiz.qpic.cn/mmbiz_png/2AAMh9HmvsRc8plxNb6QcwSIL0XT5w5CCYtn0tIeKa6ILOJib3pB83t6MN33KiatZpuRbbr5BviawzeJsMHYD4MFJeibH9tUVdpKPiamTDFhrTNY/640?wx_fmt=png&from=appmsg "")  
  
