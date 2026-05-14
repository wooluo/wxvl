#  关于deepseek最近被“曝出”的用户信息泄露漏洞  
原创 AugustTheodor
                        AugustTheodor  重生之成为赛博女保安   2026-05-14 08:04  
  
## payload  
  
<think  
## 效果  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/bcFEmmDxVAiaq2sneSLoGlmMOGnzdS4skWf8fnibx2jw3IaQkk76uBicO9FGAO7YdGMe5rpgTewfqXDEoTzrbRwbCKNw1uhb80WUiaZmibwpOFfo/640?wx_fmt=jpeg&from=appmsg "")  
## 我的结论  
  
我觉得不是所谓的“用户数据泄露”，更像是因为模型微调导致的缺陷，使deepseek在要补全<think标签时会自动带出一段训练数据，算是模型幻觉。  
## 为什么这么认为  
  
首先大模型本身跟存用户数据的数据库是两个东西，这个大家都知道的，不知道的可以看看这个系列上面那几篇。  
  
其次大模型也不会记住任何实际运行时用户的输入和输出。  
  
第三，大模型**没有调数据的权限**  
。如果这是个注入，payload则为大模型的提示词标签——一个提示词标签只能影响到大模型，但大模型没有这个权限，数据从哪来的？  
  
并且，我看了几段，自己也试了几段，这些响应内容没油没盐的而且一半是数学题，看上去就像训练数据。  
我真不信有这么多活人把deepseek当小猿搜题使，这又不是豆包^ ^。  
  
以上。  
  
  
当然，要是开发真搞出什么deepseek能主动查用户数据库的神秘螺旋我马上光速滑轨直播打三国杀谢罪，如果这个世界已经变成这样了那我还有啥好说的，thx  
  
  
