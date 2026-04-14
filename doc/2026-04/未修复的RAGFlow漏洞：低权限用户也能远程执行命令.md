#  未修复的RAGFlow漏洞：低权限用户也能远程执行命令  
 幻泉之洲   2026-04-14 01:41  
  
> RAGFlow 0.24版本存在一个未修复的高危漏洞，允许任何通过身份验证的低权限用户执行任意代码。该漏洞源于对用户输入数据的处理不当，仅在用户使用Infinity作为存储后端时有效。目前官方尚未发布修复补丁，但已有第三方提交了修复方案。  
  
## 漏洞影响有多大？  
  
RAGFlow在GitHub上有超过7.7万颗星，被众多企业采用。虽然大多数用户将其部署在内网，但根据Shodan的数据，至少1918个实例直接暴露在公网上。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibcO81P5YcmNvmwMzEhOH27EAX2KpWr3GzPTEl9djITY5EmZ2CGdiabW4qfQz3vgS3g7hBEXdPicQoUuXzbS7iag5KhVGHOKlrmvWk/640?wx_fmt=png&from=appmsg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/tbTbtBE6TibcdtXoQKIFO62WeyfNyUN55euicgsRkoVV4MuaY4IQeL5w6fZdQAqTJoGGiaAvUiaXQIzibmgp6FqHnpQ9UJib5pLz1ICANh0g2FaJI/640?wx_fmt=png&from=appmsg "")  
  
这意味着可能有上千个系统面临风险。  
  
漏洞存在于当前最新版本0.24.0中。只要攻击者获得了一个低权限账户，就能在服务器上运行任意代码。  
> 攻击者甚至不需要管理员权限，普通用户账户就够用了。  
  
## 披露过程：官方反应迟缓  
  
研究团队在2026年3月3日就通过GitHub安全报告系统提交了漏洞详情。  
  
![](https://mmbiz.qpic.cn/mmbiz_png/tbTbtBE6TibeIxO0fwlgK1EoaB8h1OQ7CkicuOEoSBHnibL8VT9mH6pXQ3XMdZItocTpPeEXz4qjC14iaZY1QQn4ZacD9xORzXUEMzLrIxDTFBw/640?wx_fmt=png&from=appmsg "")  
  
他们多次尝试通过邮件联系项目维护者，但都没有得到回应。  
  
等待一个月后，研究团队决定直接提交修复代码。这是无奈之举——公开的拉取请求会让攻击者注意到漏洞存在，但继续沉默下去，漏洞可能被悄悄利用而管理员毫不知情。  
  
说实话，如今LLM加速了漏洞发现过程，类似的情况可能会越来越常见。项目维护者可能根本处理不过来那些安全报告。  
## 漏洞是怎么产生的？  
### 危险的eval()调用  
  
问题出在_rank_feature_scores()函数里。这个函数在文档检索的重新排序阶段被调用，用eval()把数据库中的字符串转换成Python字典：  
  
# rag/nlp/search.py  
  
  
def _rank_feature_scores(self, query_rfea, search_res):  
  
    # ...  
  
    for t, sc in eval(search_res.field[i].get(TAG_FLD, \"{}\")).items():  
  
eval()会执行任何Python代码。正常情况下TAG_FLD的值应该是个字典声明，比如{"foo": "bar"}  
。但如果能往数据库里塞点别的东西，远程代码执行就达成了。  
### 数据流向：从数据库到eval()  
  
TAG_FLD对应的是文档块的tag_feas属性。这个字段本应记录预定义标签与文档块的相关性分数。  
  
检索API被调用时，如果后端是Infinity，RAGFlow会读取这个字段。关键问题在于，虽然数据经过了json.loads()处理，但一个普通字符串也是合法的JSON。  
  
更讽刺的是，当使用Infinity后端时，这个eval()调用完全多余——json.loads()已经把字符串转成字典了，eval()又把它转回字符串再转成字典。  
### 后端差异决定了是否受影响  
  
ElasticSearch存储后端对tag_feas字段有类型约束，必须是键为字符串、值为浮点数的JSON对象。攻击者很难把恶意代码塞进去。  
  
但Infinity后端把这个字段简单地存为varchar类型，没有任何约束。这就是为什么只有使用Infinity的RAGFlow实例才会受影响。  
### 公开API一路放行  
  
更让人意外的是，所有更新chunk的公开API端点都直接存储用户提供的tag_feas值，没有任何验证。  
  
可能开发团队觉得ElasticSearch会自己检查类型，但忘了Infinity不会。  
  
于是，攻击链条完整了：通过公开API往数据库写入恶意代码，然后在检索时触发eval()执行。  
## 触发条件有点特别  
  
存了恶意代码还不够，得让RAGFlow去读它。  
  
有漏洞的代码在重新排序阶段。默认情况下，使用Infinity后端时会跳过重新排序。但如果在检索查询中明确指定了重新排序模型，这段代码就会执行。  
  
所以完整的攻击流程是：  
- 创建一个定义了标签的知识库  
  
- 创建第二个知识库，引用第一个作为标签库  
  
- 在第二个知识库里添加一个chunk，把恶意代码写入tag_feas属性  
  
- 调用检索API搜索这个chunk，并指定使用重新排序模型  
  
这时候，重新排序代码就会执行eval()，你的恶意代码就跑起来了。  
  
研究团队提供了完整的验证脚本。测试时发现，如果数据库里文档很少，全文缓存可能导致恶意chunk不会立即出现在搜索结果中。生产环境应该没这个问题，但攻击者可能需要多试几次。  
## 现在该怎么办？  
  
官方还没发布修复版本。你可以手动应用研究团队提交的补丁。  
  
链接：github.com/infiniflow/ragflow/pull/14091  
  
如果你运行着RAGFlow，还有几件事可以做：  
- 确保实例不暴露在公网上  
  
- 只给受信用户创建账户，并且用强密码  
  
- 监控服务器进程，留意RAGFlow进程下有没有可疑子进程  
  
说实话，在测试环境中用eval()把字符串转成字典还算常见，但放在生产代码里就是给自己挖坑了。即使你认为输入不会被用户影响，最好也别用这个办法。大多数情况下，这都是个不必要的安全隐患。  
  
这个漏洞再次提醒我们，开源项目的安全响应流程多么重要。维护者忙不过来，漏洞就可能被公开披露，所有人都陷入被动。对用户来说，及时关注安全动态、准备好应急方案，比什么都重要。  
  
