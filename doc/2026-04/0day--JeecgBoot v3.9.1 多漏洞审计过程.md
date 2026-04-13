#  0day--JeecgBoot v3.9.1 多漏洞审计过程  
xia0mai
                    xia0mai  道一安全   2026-04-13 02:25  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWjKYvoSviaiaDUIGf1pH9H1bpSJRC3lIk08f5m6yibtkLDhFQwmCXicNMLFniaRrN0Xqvth9XWMQkn5bGQ/640?wx_fmt=gif "")  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**免责声明**  
  
道一安全（本公众号）的技术文章仅供参考，此文所提供的信息只为网络安全人员对自己所负责的网站、服务器等（包括但不限于）进行检测或维护参考，未经授权请勿利用文章中的技术资料对任何计算机系统进行入侵操作。利用此文所提供的信息而造成的直接或间接后果和损失，均由使用者本人负责。本文所提供的工具仅用于学习，禁止用于其他！！！  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**前言**  
  
本文不涉及任何poc或者exp的构建过程，只有漏洞挖掘过程供参考，感兴趣的师傅可以自行去复现  
  
  
原文链接：  
https://xz.aliyun.com/news/91897  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**项目介绍**  
  
  
JeecgBoot，github上star 41k的低代码平台，国内企业用的比较多，项目是标准的Spring Boot结构，后端业务走的Spring MVC，MyBatis做持久层  
  
  
3.9.1版本新增了AIRAG模块支持MCP协议，同时字典相关的接口还用的黑名单防注入方案  
  
  
这次审计发现了两类漏洞：AIRAG MCP模块的命令执行和字典接口的SQL注入（绕过之前的修复）  
  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**漏洞一：AIRAG MCP 命令执行**  
  
#### 漏洞背景  
  
  
AIRAG MCP模块的saveAndSync接口将用户可控的endpoint字段在stdio模式下直接拼进sh -c  
执行，认证用户即可RCE  
  
前置条件：已认证用户 + 配置文件中allow-sensitive-nodes包含stdio（开发/演示环境默认开启）  
  
#### 挖掘过程  
  
  
看了一下模块列表注意到jeecg-boot-module-airag是个新模块，MCP本身就涉及工具调用和进程通信，这种模块天然就是审计的重点目标。AiragMcpController里面有个saveAndSync接口，发现他保存并同步，同步什么？  
  
AiragMcpController.java  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1HMMDSg1EcPkwiatdGbkgE2icmkbAciagv5u8TvV6GMjLlg4tNDWVS55AS0u1jdsyF8xzlmEWM4t5DY08Vlbouxm4eD86dUhL2IwoXO9oSPw7E/640?wx_fmt=png&from=appmsg "")  
  
逻辑很简单，先edit保存再sync同步，对传入的字段没有做任何校验，跟进entity看下有什么  
  
  
AiragMcp.java  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1HMMDSg1EcPdTuxK33AzJT2IuQITDvmWcxBoDSkWlrtNY9m4gjA6DTnjGt3V3BdibllVLGKcHBXPbVWLfdZcicqw2ExDSiaPFHL3TLgnnnR4m8/640?wx_fmt=png&from=appmsg "")  
  
注释写的清清楚楚，"stdio类型为命令"，type和endpoint都是@RequestBody进来的完全可控  
  
  
跟进AiragMcpServiceImpl.java的sync方法，来到stdio分支  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1HMMDSg1EcNpowE0SEjpY3XYJI02EJNYtKXb3hI6oMhSabZphyIWicYWAhE76CXYH7Ncaxib8icHkjibH8jcQAJFgibG19ibLicXU9KzzpViazNc77Q/640?wx_fmt=png&from=appmsg "")  
  
endpoint.trim()直接塞进了["sh", "-c", endpoint]  
，中间零过滤。注释里自己都写了"endpoint 可能是一个命令行"，但没做任何安全处理  
  
唯一的门槛是allowSensitiveNodes配置检查，看下默认值  
```
jeecg:
  ai-rag:
    # AI流程敏感节点(stdio=命令行节点, sql=SQL节点)
    allow-sensitive-nodes: sql,stdio
```  
  
默认就开着，开发和演示环境都是这个配置  
```
简化调用链
1  POST /jeecg-boot/airag/airagMcp/saveAndSync
2  AiragMcpController.saveAndSync(@RequestBody AiragMcp)
3  airagMcpService.edit(airagMcp) ← endpoint持久化
4  airagMcpService.sync(id)
5  cmdParts = ["sh", "-c", endpoint.trim()]
6  StdioMcpTransport → ProcessBuilder → /bin/sh -c "<endpoint>"
```  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**漏洞二：SQL注入（绕过历史修复）**  
  
#### 漏洞背景  
  
  
JeecgBoot的字典接口之前就出过SQL注入，官方在v3.4.x加了个黑名单方案修复，用的是SqlInjectionUtil.specialFilterContentForDictSql()  
，这次是分析这个黑名单找到绕过，同时发现部分接口连黑名单都没走  
#### 挖掘过程  
  
  
审计思路就是看这个黑名单到底拦了什么、有没有绕过的可能  
  
先看看之前修复加的防护逻辑，SqlInjectionUtil.java里的specialFilterContentForDictSql  
方法  
  
![](https://mmbiz.qpic.cn/mmbiz_png/1HMMDSg1EcPPvDxvqiaOEI907ec159icdv5DV8sGCvRdMuAomEavh4QcgxicGXNjhwTXgGiblWFsOHdb0MMJaUSnpyZqmurjdV100GIJxd7NSc4/640?wx_fmt=png&from=appmsg "")  
  
这是黑名单关键词列表，注意几个关键点：select   
后面带空格、information_schema  
完整匹配、没有exists  
、没有and  
/or  
  
  
再看正则部分  
  
```
private final static String[] XSS_REGULAR_STR_ARRAY = new String[]{
    "chr\\s*\\(",
    "mid\\s*\\(",
    " char\\s*\\(",
    "sleep\\s*\\(",
    "user\\s*\\(",
    "show\\s+tables",
    "user[\\s]*\\([\\s]*\\)",
    "show\\s+databases",
    "sleep\\(\\d*\\)",
    "sleep\\(.*\\)",
};
```  
  
user\s*\(  
匹配的是user()  
带括号的形式，sleep\s*\(  
也在拦截列表里  
  
  
分析完黑名单，绕过思路就很清楚了：  
  
  
1、select   
要求后面带空格，用%0a  
换行符替代空格就能绕过，select%0a1  
不会被检测到  
  
  
2、user\s*\(  
拦截的是user()  
带括号的形式，但MySQL的current_user  
不需要括号，直接绕过  
  
  
3、information_schema  
被拦了，但mysql.innodb_table_stats  
一样可以查表名，绕过  
  
  
那么接下来就是找哪些接口用了这个黑名单过滤、哪些地方用了MyBatis的${}  
拼接  
  
  
SysDictMapper.xml里面一搜就看到好几个${}  
直接拼接的点  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/1HMMDSg1EcNiciael1e8yvnV4dL6S8Fyopk4RFAM7hvj1PCZKBe03LLQCuHN6tnZL592vNcRQmrvD6MWGjQK3vkx5szz1Xtiat49kuSgEca0eI/640?wx_fmt=png&from=appmsg "")  
```
<if test="key == '_tableFilterSql'">
    and ${value}
</if>
```  
  
${filterSql}  
和${value}  
都是直接拼接的，不是#{}  
参数化查询  
  
  
那么审计思路就是找非预编译、参数可控、经过specialFilterContentForDictSql  
黑名单的接口  
  
  
这里演示几处，主要还是找的思路  
  
  
**第一处：**/sys/dict/getDictItems/{dictCode}**— 布尔盲注（过了黑名单，可绕）**  
  
  
SysDictController.java  
```
@GetMapping("/getDictItems/{dictCode}")
public Result<List<DictModel>> getDictItems(
        @PathVariable("dictCode") String dictCode,
        @RequestParam(value = "sign", required = false) String sign) {
    // ...
    String[] params = dictCode.split(",");
    if (params.length == 4) {
        // params[3]就是filterSql，直接传入
        return Result.OK(sysDictService.queryTableDictItemsByCodeAndFilter(
            params[0], params[1], params[2], params[3]));
    }
```  
  
dictCode用逗号分割，第四个参数直接作为filterSql传入，跟进Service层  
  
  
SysDictServiceImpl.java  
```
public List<DictModel> queryTableDictItemsByCodeAndFilter(
        String table, String text, String code, String filterSql) {
    // 黑名单过滤
    filterSql = SqlInjectionUtil.specialFilterContentForDictSql(filterSql);
    return sysDictMapper.queryTableDictWithFilterSql(table, text, code, filterSql);
}
```  
  
过了一层specialFilterContentForDictSql  
黑名单然后直接进Mapper的${filterSql}  
，前面分析过这个黑名单可以绕，存在布尔盲注  
```
1=1 → 返回数据
1=2 → 返回空
```  
  
**第二处：**/sys/dict/loadDict/{dictCode}**— LIKE注入（连黑名单都没过）**  
  
  
这个更直接，keyword参数连黑名单都没过  
```
private String getFilterSql(String tableSql, String text, String code,
        String condition, String keyword){
    // ...
    if (oConvertUtils.isNotEmpty(keyword)) {
        if (keyword.contains(SymbolConstant.COMMA)) {
            String inKeywords = "'" + String.join("','", keyword.split(",")) + "'";
            keywordSql = "(" + text + " in (" + inKeywords + ") or " + code + " in (" + inKeywords + "))";
        } else {
            keywordSql = "("+text + " like '%"+keyword+"%' or "+ code + " like '%"+keyword+"%')";
        }
    }
```  
  
keyword直接拼进了LIKE语句，没有调用任何过滤方法，连specialFilterContentForDictSql  
都没走  
  
```
keyword=%' OR 1=1 OR '%'='
```  
  
拼出来就是realname like '%%' OR 1=1 OR '%'='%'  
，LIKE条件直接被绕过返回所有数据  
  
  
**第三处：**/sys/dict/loadTreeData**— 时间盲注（JSON透传，没过黑名单）**  
  
  
condition参数是个JSON，里面的_tableFilterSql  
直接透传到Mapper  
  
  
SysDictServiceImpl.java  
```
if (StringUtils.isNotBlank(condition)) {
    Map<String, String> query = JSON.parseObject(condition, Map.class);
    for (String key : query.keySet()) {
        queryParams.put(key, query.get(key));  // ← _tableFilterSql直接透传
    }
}
return sysDictMapper.queryTreeList(queryParams);
```  
  
Mapper里${value}  
直接拼接，没有任何过滤，连黑名单都没走，存在时间盲注  
```
condition={"_tableFilterSql":"1=1 and sleep(5)"}
基线耗时0.016秒，注入后耗时15秒
```  
  
同样的模式还有  
```
/sys/api/queryFilterTableDictInfo、
/sys/api/queryTableDictItemsByCode、
/sys/api/loadDictItemByKeyword、
/sys/dict/loadDictItem/{dictCode}
```  
  
  
，都是类似的问题，要么走了黑名单可以绕，要么压根没走黑名单  
  
  
**7个接口汇总**  
(其实不止 7 个)  
<table><tbody><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">接口</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">注入参数</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">类型</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">是否过黑名单</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/dict/getDictItems/{dictCode}</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">filterSql</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">布尔盲注</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">过了，可绕</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/dict/loadDict/{dictCode}</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">keyword</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">LIKE注入</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">没过</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/dict/loadTreeData</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">_tableFilterSql</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">时间盲注</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">没过</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/api/queryFilterTableDictInfo</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">filterSql</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">布尔盲注</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">过了，可绕</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/api/queryTableDictItemsByCode</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">tableFilterSql</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">布尔盲注</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">过了，可绕</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/api/loadDictItemByKeyword</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">keyword</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">LIKE注入</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">没过</span></p></td></tr><tr style="height: 33px;"><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><code style="font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;background-color: rgba(0, 0, 0, 0.06);border: 1px solid rgba(0, 0, 0, 0.08);border-radius: 2px;padding: 0px 2px;"><span leaf="">/sys/dict/loadDictItem/{dictCode}</span></code></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">dictCode(表名)</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">布尔盲注</span></p></td><td data-colwidth="250" width="250" style="border: 1px solid #d9d9d9;"><p style="margin: 0;padding: 0;min-height: 24px;"><span leaf="">过了，可绕</span></p></td></tr></tbody></table>  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWgJHGxRSfVlI02pBf15B0slPyoWRWfSP0mM3LqDQKhOhVwfvVKma68JRwQ7E2Oysib3Nsw5ny7uaSw/640?wx_fmt=gif "")  
  
**总结**  
  
这次审计JeecgBoot 3.9.1找到两类问题:MCP命令执行是新模块引入的新洞，endpoint直接进sh -c没有任何过滤。SQL注入是老问题新绕过，之前v3.4.x用黑名单方案修的， select 带空格用 %0a 换行绕、user() 用 current_user 无括号绕、 information_schema 用 mysql.innodb_table_stats 替代，而且7个接口里有3个连黑名单都没走直接拼接的。根因还是MyBatis用了 ${} 而不是 #{} ，黑名单治标不治本。  
  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWiaHpokNh4uWxia9Vv2eYjfzjK9Euejia8GQQAicPWkJI7HfpDplIlc3tPr73ZYKHIdg9kIHpWaJia2tGA/640?wx_fmt=gif "")  
  
**点分享**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWiaHpokNh4uWxia9Vv2eYjfzjXjW9bUCoUia7g4iaVGGGm5AKWRMoDMQoFDdJuiceofhPJ8SJpKSGToZcw/640?wx_fmt=gif "")  
  
**点收藏**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWiaHpokNh4uWxia9Vv2eYjfzjAEe2Bq3UgWlgxribzfYtnQ6EVkxkao5qmK0xpaoycfHyGVl7zFicPGibw/640?wx_fmt=gif "")  
  
**点在看**  
  
![](https://mmbiz.qpic.cn/mmbiz_gif/Ljib4So7yuWiaHpokNh4uWxia9Vv2eYjfzjDia9eCL6sIvuL17F5uKHsjx0GNc6estct1jOfWh4EtOcVsvzynOar1Q/640?wx_fmt=gif "")  
  
**点点赞**  
  
